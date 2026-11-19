# Independent referee check (lens: general). No large allocation: one float array of 60001 complex128 (~1 MB).
import sys, json, itertools, mpmath as mp
mp.mp.dps = 30
out = {}
xi = lambda u: mp.pi**(-u/2)*mp.gamma(u/2)*mp.zeta(u)
# even primitive character mod 5 (Legendre symbol), chi(-1)=1
def chi5(n):
    return [0,1,-1,-1,1][n % 5]
def L5(s):
    return mp.dirichlet(s, [0,1,-1,-1,1])
out["L(0,chi5)"] = str(mp.nstr(L5(0), 10))
# 1. Lemma T on different cases: r = sym^3 (not self-conjugate), r = sym^2 o sym^4, r = std x conj(std), beta=0.6, gamma = 4th zero ordinate
g = mp.zetazero(4).imag
rows = []
for b in ("0.6", "0.85"):
    nu = mp.mpc((mp.mpf(b)-1)/2, g/2)
    cases = {
      "sym3": [(3-2*j)*nu for j in range(4)],
      "sym2_of_sym4": [((4-2*j)+(4-2*l))*nu for j in range(5) for l in range(j, 5)],
      "std_x_conjstd": [e1*nu + e2*mp.conj(nu) for e1 in (1,-1) for e2 in (1,-1)],
      "sym2_x_conj_sym2": [(2-2*j)*nu + (2-2*l)*mp.conj(nu) for j in range(3) for l in range(3)],
    }
    for name, ws in cases.items():
        m = min(mp.re(w) for w in ws)
        mins = [w for w in ws if abs(mp.re(w)-m) < mp.mpf(10)**(-20)]
        l0 = mins[0]
        # (ii) other factors at s = 1 - l0: zeta(1 + l - l0) for l != l0 : finite nonzero or pole
        others = []
        first = True
        for w in ws:
            if w == l0 and first:
                first = False; continue
            a = 1 + w - l0
            others.append("pole" if abs(a-1) < mp.mpf(10)**(-20) else mp.nstr(abs(mp.zeta(a)), 6))
        # (iii) twisted finite part at s = -l0: prod L(l - l0, chi5)
        val = mp.mpf(1)
        for w in ws:
            val *= L5(w - l0)
        # partial L at p = 11 (chi5(11)=1): s = -l0: factor prod (1 - 11^(-(l-l0)))
        fac = mp.mpf(1)
        for w in ws:
            fac *= (1 - mp.power(11, -(w - l0)))
        sym = sorted([float(mp.re(w)) for w in ws]) ; symok = all(abs(sym[i] + sym[-1-i]) < 1e-12 for i in range(len(sym)))
        rows.append({"beta": b, "r": name, "m": float(m), "P": float(1-m), "beta0": float(-m), "diff": float((1-m)-(-m)),
                     "min_weight_imag": float(mp.im(l0)), "n_min_weights": len(mins),
                     "min |other factor| at pole (non-pole ones)": min([float(x) for x in others if x != "pole"] or [float("nan")]),
                     "n_extra_poles": others.count("pole"),
                     "|twisted finite part at -l0|": float(abs(val)), "|inverse local factor p=11 at -l0|": float(abs(fac)),
                     "real parts symmetric": symok})
out["lemma_T"] = rows
# 2. pole order at 1 for the O2 shadow at beta = 1/2 (POLE1 asks 'simple'): (s-1)^2 * zeta(s)^2 zeta(s+2ig)zeta(s-2ig) -> nonzero
g1 = mp.zetazero(1).imag
F = lambda s: mp.zeta(s)**2*mp.zeta(s+2j*g1)*mp.zeta(s-2j*g1)
e = mp.mpf(10)**(-8)
out["O2_shadow_beta_half_pole_order"] = {"(s-1)^2 F at 1+1e-8": float(abs(e**2*F(1+e))), "(s-1) F at 1+1e-8": float(abs(e*F(1+e)))}
# 3. E9/O1 cell: order of vanishing at w = beta of zeta(w-(1-b))zeta(w+(1-b))zeta(w+ig)zeta(w-ig), b = 1/2 (first zero)
G = lambda w: mp.zeta(w-mp.mpf(1)/2)*mp.zeta(w+mp.mpf(1)/2)*mp.zeta(w+1j*g1)*mp.zeta(w-1j*g1)
vals = {str(k): float(abs(G(mp.mpf(1)/2+mp.mpf(10)**(-k)))) for k in (3, 4, 5, 6)}
out["E9_O1_vanishing_order_at_w=beta"] = {"|G(1/2+10^-k)|": vals, "ratio k=4/k=5": vals["4"]/vals["5"], "ratio k=5/k=6": vals["5"]/vals["6"]}
# 4. Proposition E numerics on other cases: zeros 5 and 10; edge equal modulus at t = 11.9; conj symmetry
rowsE = []
for k in (5, 10):
    rho = mp.zetazero(k)
    rowsE.append({"zero": k, "|xi(rho)|": float(abs(xi(rho))), "|xi(rho-1)|": float(abs(xi(rho-1))), "|xi(2-rho)|": float(abs(xi(2-rho))),
                  "|xi(2rho)|": float(abs(xi(2*rho))), "|xi(2rho-1)|": float(abs(xi(2*rho-1)))})
t = mp.mpf("11.9")
out["prop_E"] = {"rows": rowsE, "edge t=11.9": [float(abs(xi(1+2j*t))), float(abs(xi(2j*t)))]}
# 5. check D on a different zero (second) and primes < 500; also first zero p<200
def primes(n): return [p for p in range(2, n) if all(p % q for q in range(2, int(p**0.5)+1))]
for k, n in ((1, 200), (2, 500)):
    gg = mp.zetazero(k).imag
    d = min(((p, float(abs(gg*mp.log(p)/(2*mp.pi) - mp.nint(gg*mp.log(p)/(2*mp.pi))))) for p in primes(n)), key=lambda u: u[1])
    out["D_zero%d_p<%d" % (k, n)] = d
# 6. check A at the SECOND zero, x up to 60000 (pure python sieve, 60001 complex)
N = 60000
print("planned allocation: list of", N+1, "python complex (~2 MB)")
g2 = float(mp.zetazero(2).imag); z = complex(0, 2*g2)
sig = [0j]*(N+1)
for d in range(1, N+1):
    dz = d**z
    for mlt in range(d, N+1, d):
        sig[mlt] += dz
cs = 0.0; marks = {}
for n in range(1, N+1):
    cs += abs(sig[n])**2   # |n^{-ig} sigma_{2ig}(n)|^2
    if n in (15000, 30000, 60000): marks[n] = cs
t2 = 2*mp.mpf(g2)
H = lambda s: mp.zeta(s+1j*t2)*mp.zeta(s-1j*t2)/mp.zeta(2*s)
H1 = H(1); dH1 = mp.diff(H, 1)
rowsA = []
for x, v in marks.items():
    main = x*(H1*(mp.log(x) - 1 + 2*mp.euler) + dH1)
    osc = 0
    for sg in (1, -1):
        s0 = 1 + sg*1j*t2
        osc += mp.zeta(s0)**2*mp.zeta(1+2*sg*1j*t2)/mp.zeta(2*s0)*mp.power(x, s0)/s0
    rowsA.append({"x": x, "sum": v, "ratio_with_osc": float(v/mp.re(main+osc)), "ratio_main_only": float(v/mp.re(main))})
out["A_second_zero"] = rowsA
json.dump(out, open(sys.argv[1], "w"), indent=1); print(json.dumps(out, indent=1))
