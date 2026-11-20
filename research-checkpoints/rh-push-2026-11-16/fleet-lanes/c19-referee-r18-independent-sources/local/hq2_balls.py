# Referee check of the control HQ2 = zeta(s) (1 + eps u^2/(1-u)^4), u = q^(1/2-s) (lane c18-exact-relation-rigidity-klein-spinor),
# and of Proposition F (HQ1 member), in ball arithmetic (python-flint acb).  Own code.
import json, math
from fractions import Fraction
from flint import arb, acb, ctx, acb_series
ctx.prec = 200
I = acb(0, 1); PI = arb.pi()
out = {}
def gam(s): return (PI ** (-s / 2)) * (s / 2).gamma()
def mk(q, eps):
    L = arb(q).log()
    def m(s):
        u = ((arb(1) / 2 - s) * L).exp()
        return 1 + eps * u * u / (1 - u) ** 4
    def G(s): return s.zeta() * m(s)
    return L, m, G
def small(x): return float(abs(x).upper())

# (1) functional equation: G(s) gam(s) = G(1-s) gam(1-s), balls at several points (the identity itself is algebraic: m(s) = m(1-s))
rows = []
for (q, eps) in [(2, arb(1) / 100), (3, arb(1) / 10000), (101, arb(10) ** -6)]:
    L, m, G = mk(q, eps)
    worst = 0.0; contains = True
    for s in [acb(0.3, 2.7), acb(1.9, -11.2), acb(-3.3, 5.1), acb(0.81, 40.3), acb(2.5, 0.4)]:
        d = G(s) * gam(s) - G(1 - s) * gam(1 - s)
        rel = d / (G(s) * gam(s))
        contains = contains and rel.contains(0)
        worst = max(worst, small(rel))
        dm = m(s) - m(1 - s)
        contains = contains and dm.contains(0)
    rows.append(dict(q=q, eps=float(eps.mid()), FE_relative_residual_upper=worst, residual_balls_contain_0=bool(contains)))
out["functional_equation"] = rows
print("FE", rows, flush=True)

# (2) integer frequencies, coefficients, multiplicativity, a(n) >= 1: exact in Q(sqrt q); a(n) = sum_{q^k | n} b_k, b_0 = 1, b_k = eps C(k+1,3) q^(k/2)
def coeffs(q, eps, N):
    # numbers x + y sqrt(q) as pairs of Fractions
    def b(k):
        if k == 0: return (Fraction(1), Fraction(0))
        if k == 1: return (Fraction(0), Fraction(0))
        c = eps * math.comb(k + 1, 3)
        return (c * q ** (k // 2), Fraction(0)) if k % 2 == 0 else (Fraction(0), c * q ** (k // 2))
    a = {}
    for n in range(1, N + 1):
        v = 0; t = n
        while t % q == 0: t //= q; v += 1
        x = Fraction(0); y = Fraction(0)
        for k in range(v + 1):
            bx, by = b(k); x += bx; y += by
        a[n] = (x, y)
    return a
def mul(p, r, q): return (p[0] * r[0] + q * p[1] * r[1], p[0] * r[1] + p[1] * r[0])
rows = []
for (q, eps) in [(2, Fraction(1, 100)), (3, Fraction(1, 10000)), (5, Fraction(7, 3))]:
    N = 4000
    a = coeffs(q, eps, N)
    mn = min(a[n][0] + a[n][1] * 0 for n in a)       # both parts are >= 0; the rational part alone is >= 1
    both_nonneg = all(a[n][0] >= 1 and a[n][1] >= 0 for n in a)
    bad = tot = 0
    for mm in range(2, 64):
        for nn in range(2, N // mm + 1):
            if math.gcd(mm, nn) == 1:
                tot += 1
                if mul(a[mm], a[nn], q) != a[mm * nn]: bad += 1
    not_cm = mul(a[q], a[q], q) != a[q * q]
    eq1 = all(a[n] == (1, 0) for n in a if n % (q * q))
    # Dirichlet series against the closed form at s = 9 (tail bounded by the closed-form majorant)
    s0 = 9
    sq = arb(q).sqrt()
    S = arb(0)
    NN = 4000
    for n in range(1, NN + 1):
        S += (arb(a[n][0].numerator) / a[n][0].denominator + sq * arb(a[n][1].numerator) / a[n][1].denominator) / arb(n) ** s0
    L, m, G = mk(q, arb(eps.numerator) / eps.denominator)
    diff = S - G(acb(s0)).real
    rows.append(dict(q=q, eps=str(eps), N=N, min_rational_part=str(mn), all_a_ge_1=bool(both_nonneg), a_eq_1_unless_q2_divides_n=bool(eq1),
                     coprime_pairs=tot, mult_failures=bad, completely_multiplicative=not not_cm,
                     series_minus_closed_form_at_9=float(diff.mid()), tail_scale=float((arb(NN) ** (-(s0 - 1) + 0.5 + 0.2)).mid())))
out["coefficients"] = rows
print("coefficients", rows, flush=True)

# (3) pole at s = 1/2: order 4, leading coefficient eps zeta(1/2)/(log q)^4; also at 1/2 + 2 pi i k/log q
rows = []
for (q, eps) in [(2, arb(1) / 100), (3, arb(1) / 10000)]:
    L, m, G = mk(q, eps)
    for k in (0, 1, 2):
        s0 = acb(arb(1) / 2, 2 * PI * k / L)
        z = s0.zeta()
        lead_pred = eps * z / L ** 4
        # contour check: (1/2 pi i) oint (s - s0)^j G(s) ds over a circle of radius r: nonzero for j = 3 (order exactly 4), zero for j = 4, 5
        r = arb(1) / 10
        def integ(j):
            def f(th, _):
                e = (I * th).exp() * r
                return (e ** j) * G(s0 + e) * e          # ds = i e dth; divided by 2 pi i below gives e/(2 pi)
            return acb.integral(f, acb(0), acb(2 * PI), rel_tol=arb(2) ** -60) / (2 * PI)
        c3 = integ(3); c4 = integ(4); c5 = integ(5)
        rows.append(dict(q=q, k=k, zeta_at_pole_nonzero=bool(not z.contains(0)), abs_zeta=float(abs(z).mid()),
                         coeff_order4=str(c3), predicted=str(lead_pred), agrees=bool((c3 - lead_pred).contains(0) or small(c3 - lead_pred) < 1e-30),
                         coeff_order4_nonzero=bool(not c3.contains(0)), order5_coeff_abs_upper=small(c4), order6_coeff_abs_upper=small(c5)))
out["pole"] = rows
print("pole", rows, flush=True)

# (4) two off-line zeros per parameter pair, enclosed; count by the argument principle on a small square
rows = []
for (q, eps) in [(2, arb(1) / 100), (3, arb(1) / 10000), (101, arb(10) ** -6), (10007, arb(10) ** -8)]:
    L, m, G = mk(q, eps)
    for (sgn, k) in [(1, 0), (-1, 1)]:
        # sinh(z L/2) = (eps^(1/4)/2) e^{sgn i pi/4}
        w = (eps.root(4) / 2) * (I * sgn * PI / 4).exp()
        z = 2 * w.asinh() / L + 2 * PI * I * k / L
        s0 = arb(1) / 2 + z
        val = G(s0)
        off = s0.real - arb(1) / 2
        # argument principle on the square of half-side h around s0 (h = |Re z|/4)
        h = abs(z.real) / 4
        hm = arb(float(h.mid()))
        c0 = acb(float(s0.real.mid()), float(s0.imag.mid()))
        def logder(s, _):
            # G'/G = zeta'/zeta + m'/m, m'/m via u
            u = ((arb(1) / 2 - s) * L).exp()
            dm = eps * (2 * u / (1 - u) ** 4 + 4 * u * u / (1 - u) ** 5) * (-L * u)
            zs = acb_series([s, 1], 2).zeta()
            return dm / (1 + eps * u * u / (1 - u) ** 4) + zs[1] / zs[0]
        cnt = acb(0)
        corners = [c0 + acb(-hm, -hm), c0 + acb(hm, -hm), c0 + acb(hm, hm), c0 + acb(-hm, hm)]
        for i in range(4):
            cnt += acb.integral(logder, corners[i], corners[(i + 1) % 4], rel_tol=arb(2) ** -40)
        cnt = cnt / (2 * PI * I)
        rows.append(dict(q=q, eps=float(eps.mid()), s0=[float(s0.real.mid()), float(s0.imag.mid())], G_ball_contains_0=bool(val.contains(0)), abs_G_upper=small(val),
                         offset_from_line=str(off), off_line_certified=bool(off > 0), leading_term=float((eps.root(4) / (arb(2).sqrt() * L)).mid()),
                         zeros_in_square=str(cnt.real), zeta_nonzero_at_s0=bool(not s0.zeta().contains(0)), in_open_strip=bool(s0.real < 1)))
        print(rows[-1], flush=True)
out["zeros"] = rows

# (5) Proposition F: G_q = zeta(s) (1 + (c_q + 2) u/(1-u)^2), c_q = q^(1/4) + q^(-1/4): zero at 3/4 + i pi/log q, a(n) = 1 for q not dividing n, bound
rows = []
for q in [11, 101, 10007, 1000003]:
    L = arb(q).log(); cq = arb(q).root(4) + 1 / arb(q).root(4)
    def m1(s):
        u = ((arb(1) / 2 - s) * L).exp()
        return 1 + (cq + 2) * u / (1 - u) ** 2
    s0 = acb(arb(3) / 4, PI / L)
    v = s0.zeta() * m1(s0)
    s1 = acb(arb(1) / 4, PI / L)
    v1 = s1.zeta() * m1(s1)
    fe = m1(acb(0.3, 1.7)) - m1(1 - acb(0.3, 1.7))
    bnd = {}
    for sg in (2, 1.01, 0.8):
        x = arb(q) ** (arb(1) / 2 - arb(sg))
        bnd[str(sg)] = float(((cq + 2) * x / (1 - x) ** 2).mid())
    rows.append(dict(q=q, G_at_three_quarters_contains_0=bool(v.contains(0)), abs_upper=small(v), G_at_one_quarter_contains_0=bool(v1.contains(0)),
                     zeta_nonzero_there=bool(not s0.zeta().contains(0)), m_symmetric_residual_contains_0=bool(fe.contains(0)), bounds=bnd))
out["proposition_F"] = rows
print("Prop F", rows, flush=True)
json.dump(out, open("hq2_balls.json", "w"), indent=1)
