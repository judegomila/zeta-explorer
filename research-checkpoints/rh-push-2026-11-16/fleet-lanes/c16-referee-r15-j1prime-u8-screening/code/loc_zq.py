"""Second referee, control ZQ: own code, a pair not used by the lane or by the first referee. mpmath 30 digits."""
import sys, json, mpmath as mp
mp.mp.dps = 30; OUT = sys.argv[1]; R = {}
gam = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2)
# pair: zeros 922, 923 (close pair near 1329.1 found in the zeros table; exact ordinates from mpmath.zetazero)
for (n1, eta) in ((922, mp.mpf("0.12")), (34, mp.mpf("0.31"))):
    g1 = mp.zetazero(n1).imag; g2 = mp.zetazero(n1 + 1).imag; gb = (g1 + g2) / 2; d = (g2 - g1) / 2
    quart = [mp.mpc(0.5 + sx * eta, sy * gb) for sx in (1, -1) for sy in (1, -1)]; rem = [mp.mpc(0.5, s * g) for g in (g1, g2) for s in (1, -1)]
    def m(s):                                   # product over the eight points (not the t^2 form)
        r = mp.mpf(1)
        for q in quart: r *= (s - q)
        for p in rem: r /= (s - p)
        return r
    ZQ = lambda s: mp.zeta(s) * m(s)
    tag = "pair %d,%d eta=%s" % (n1, n1 + 1, mp.nstr(eta, 3)); r = {"g1": mp.nstr(g1, 15), "g2": mp.nstr(g2, 15), "d": mp.nstr(d, 8)}
    pts = [mp.mpc("0.3", "7.7"), mp.mpc("1.7", "-33.1"), mp.mpc("-2.4", "1000.3"), mp.mpc("0.81", str(float(gb) + 0.37))]
    r["FE defect max"] = mp.nstr(max(abs(ZQ(s) * gam(s) - ZQ(1 - s) * gam(1 - s)) / abs(ZQ(s) * gam(s)) for s in pts), 3)
    t2 = lambda s: -(s - mp.mpf(1) / 2) ** 2
    mc = lambda s: 1 + (eta ** 2 + d ** 2) * (2 * t2(s) + 2 * gb ** 2 + eta ** 2 - d ** 2) / ((t2(s) - g1 ** 2) * (t2(s) - g2 ** 2))
    r["closed form of m vs product, max rel"] = mp.nstr(max(abs(m(s) - mc(s)) / abs(m(s)) for s in pts), 3)
    # non-vanishing checks
    r["abs zeta at the quartet point (must be > 0)"] = mp.nstr(abs(mp.zeta(quart[0])), 8)
    r["abs ZQ at the quartet point"] = mp.nstr(abs(ZQ(quart[0])), 3)
    r["abs ZQ at removed zero 1/2+i g1 (limit; must be > 0)"] = mp.nstr(abs(ZQ(mp.mpc(0.5, g1) + mp.mpf(10) ** -12)), 8)
    r["ZQ(2), zeta(2)"] = [mp.nstr(ZQ(2), 15), mp.nstr(mp.zeta(2), 15)]
    r["m(1), m(-2), m(-4) (finite, non-zero, real)"] = [mp.nstr(m(mp.mpf(k)), 12) for k in (1, -2, -4)]
    # winding numbers by the argument principle (rectangle right of the line around gbar; and across the line)
    def count(F, x0, x1, y0, y1, n=4000):
        tot = mp.mpf(0); corners = [mp.mpc(x0, y0), mp.mpc(x1, y0), mp.mpc(x1, y1), mp.mpc(x0, y1), mp.mpc(x0, y0)]
        prev = None
        for a, b in zip(corners[:-1], corners[1:]):
            for k in range(n + 1):
                v = F(a + (b - a) * k / n); ph = mp.arg(v)
                if prev is not None:
                    dphi = ph - prev
                    while dphi > mp.pi: dphi -= 2 * mp.pi
                    while dphi < -mp.pi: dphi += 2 * mp.pi
                    tot += dphi
                prev = ph
        return int(mp.nint(tot / (2 * mp.pi)))
    mp.mp.dps = 15
    e = float(eta); gbf = float(gb)
    r["zeros in (1/2+eta/2, 1.4) x (gb-0.6, gb+0.6): ZQ, zeta"] = [count(ZQ, 0.5 + e / 2, 1.4, gbf - 0.6, gbf + 0.6), count(mp.zeta, 0.5 + e / 2, 1.4, gbf - 0.6, gbf + 0.6)]
    r["zeros in (-0.4, 1.4) x (g1-0.05, g2+0.05): ZQ, zeta"] = [count(ZQ, -0.4, 1.4, float(g1) - 0.05, float(g2) + 0.05), count(mp.zeta, -0.4, 1.4, float(g1) - 0.05, float(g2) + 0.05)]
    mp.mp.dps = 30
    # density D and the bound
    D = lambda L: -4 * mp.exp(-L / 2) * mp.cos(gb * L) * (mp.cosh(eta * L) - mp.cos(d * L))
    env = lambda L: 4 * mp.exp(-L / 2) * (mp.cosh(eta * L) - mp.cos(d * L))
    import math
    gf, ef, df = float(gb), float(eta), float(d)
    sup = 0.0; mn = 0.0; mx = 0.0; step = (2 * math.pi / gf) / 40; L = 0.0
    while L < 80:
        v = -4 * math.exp(-L / 2) * math.cos(gf * L) * (math.cosh(ef * L) - math.cos(df * L)); sup = max(sup, abs(v)); mn = min(mn, v); mx = max(mx, v); L += step
    bound = 8 * math.exp(-2) * (ef ** 2 + df ** 2) / (0.5 - ef) ** 2
    r["sup abs D (grid resolving cos(gbar L), L <= 80), min D, max D"] = [sup, mn, mx]; r["proved bound 8e^-2(eta^2+d^2)/(1/2-eta)^2"] = bound; r["bound holds"] = bool(sup <= bound)
    # Laplace identity -m'/m(s) = int_0^inf e^{-(s-1)L} D(e^L) dL  (x = e^L, dx = e^L dL)
    s0 = mp.mpc("1.4", "3.1"); lhs = -mp.diff(m, s0) / m(s0)
    if n1 == 34:
        rhs = mp.quad(lambda L: mp.exp(-(s0 - 1) * L) * D(L), mp.linspace(0, 70, 2801))
        r["Laplace identity: lhs, rhs, abs diff"] = [mp.nstr(lhs, 12), mp.nstr(rhs, 12), mp.nstr(abs(lhs - rhs), 3)]
    pf = sum(1 / (s0 - p) for p in rem) - sum(1 / (s0 - q) for q in quart)
    r["-m'/m against the eight partial fractions, abs diff"] = mp.nstr(abs(lhs - pf), 3)
    r["integral bound 4(eta^2+d^2)/(sigma-1/2-eta)^3 at sigma=1.4 vs abs lhs"] = [mp.nstr(4 * (eta ** 2 + d ** 2) / (mp.mpf("1.4") - mp.mpf(1) / 2 - eta) ** 3, 6), mp.nstr(abs(lhs), 6)]
    # pole clause: G_+ = zeta * numerator/(t^2+b^2)^2, D_+ = 4 x^(-1/2)(cosh(bL) - cos(gb L) cosh(eta L)) >= 0 for b > eta
    b = float(eta) + 0.1; L = 0.0; mnp = 1e9
    while L < 80:
        mnp = min(mnp, 4 * math.exp(-L / 2) * (math.cosh(b * L) - math.cos(gf * L) * math.cosh(ef * L))); L += step
    r["G_+ (pole clause dropped), b = eta + 0.1: min D_+ on grid (>= 0)"] = mnp
    bb = mp.mpf(b); mplus = lambda s: (((s - quart[0]) * (s - quart[1]) * (s - quart[2]) * (s - quart[3])) / ((t2(s) + bb ** 2) ** 2))
    Gp = lambda s: mp.zeta(s) * mplus(s)
    r["G_+ FE defect"] = mp.nstr(max(abs(Gp(s) * gam(s) - Gp(1 - s) * gam(1 - s)) / abs(Gp(s) * gam(s)) for s in pts), 3)
    r["G_+ real poles at 1/2 +- b: abs G_+ at distance 1e-10"] = mp.nstr(abs(Gp(mp.mpf(1) / 2 + bb + mp.mpf(10) ** -10)), 3)
    # Lemma L sign mechanism: f(sigma) = -m'/m(sigma) for ZQ changes sign on the real axis and f(sigma) = -f(1-sigma)
    f = lambda x: -mp.diff(m, x) / m(x)
    r["f(sigma) = -m'/m at sigma = 2, -1 (antisymmetry f(s) = -f(1-s))"] = [mp.nstr(f(mp.mpf(2)), 10), mp.nstr(f(mp.mpf(-1)), 10)]
    R[tag] = r
json.dump(R, open(OUT, "w"), indent=1); print(json.dumps(R, indent=1))
