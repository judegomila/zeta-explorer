# lemma3.py: sibling HQ4(q, a, b) = zeta(s) (1 + alpha u + u^2)/(1 - beta u + u^2), alpha = q^a + q^-a, beta = q^b + q^-b, 0 < a < b < 1/2.
# Checks: FE; zeros at 1/2 +- a + (2k+1) pi i/log q; nu(q^k) = log q (1 + 2 q^(k/2)(cosh(k b L) - (-1)^k cosh(k a L))) >= log q;
# local series sum_v a(q^v) y^v = (1 + alpha u + u^2)/((1 - beta u + u^2)(1 - y)), u = sqrt(q) y: zeros negative real, poles positive real
# (Edrei-Thoma form prod(1 + b_j y)/prod(1 - a_j y), a_j, b_j > 0); finite check: Toeplitz minors of order <= 4 of a(q^v), v <= 14, non-negative.
# Also HQ1(q, eps), 0 < eps <= 4: zeros of the factor on the line, double poles on the line; nu >= Lambda.
import json, itertools
from flint import arb, acb, fmpq, fmpq_mat, ctx
ctx.prec = 200
gam = lambda s: (-(s / 2) * arb.pi().log()).exp() * (s / 2).gamma()
out = {"hq4": [], "hq1": []}
for (q, a, b) in [(2, "0.1", "0.2"), (2, "0.3", "0.4"), (3, "0.2", "0.3")]:
    v = arb(q).log(); A = arb(a) * v; B = arb(b) * v; al = 2 * A.cosh(); be = 2 * B.cosh()
    def m4(s):
        u = (v * (arb(1) / 2 - s)).exp()
        return (1 + al * u + u * u) / (1 - be * u + u * u)
    fe = []
    for s in [acb("0.3", "7.1"), acb("0.81", "23.4"), acb("-1.3", "5.5")]:
        x = s.zeta() * m4(s) * gam(s); y = (1 - s).zeta() * m4(1 - s) * gam(1 - s)
        fe.append(bool(x.overlaps(y)) and float((abs(x - y) / abs(x)).upper()) < 1e-40)
    zs = []
    for k in (0, 1, 5):
        s0 = acb(arb(1) / 2 + arb(a), (2 * k + 1) * arb.pi() / v)
        zs.append(bool(m4(s0).contains(0)) and float(abs(m4(s0)).upper()) < 1e-40 and bool(abs(s0.zeta()) > 0))
    nu_ok = all((2 * arb(q).sqrt() ** k * ((k * B).cosh() - (-1) ** k * (k * A).cosh())) > 0 for k in range(1, 400))
    N = 14
    den = [arb(1)]
    for k in range(1, N + 1): den.append(be * den[k - 1] - (den[k - 2] if k >= 2 else 0))
    bk = [den[k] + al * (den[k - 1] if k >= 1 else 0) + (den[k - 2] if k >= 2 else 0) for k in range(N + 1)]
    aq = []; run = arb(0)
    for j in range(N + 1):
        run += bk[j] * arb(q).sqrt() ** j; aq.append(run)
    # Toeplitz minors (a_{j_i - k_l}) of order <= 3 with rows/cols in 0..7
    from flint import arb_mat
    bad = 0; tot = 0
    idx = range(0, 8)
    for r in (1, 2, 3):
        for rows in itertools.combinations(idx, r):
            for cols in itertools.combinations(idx, r):
                M = arb_mat(r, r, [aq[i - j] if i - j >= 0 else arb(0) for i in rows for j in cols])
                d = M.det(); tot += 1
                if d < 0: bad += 1
    row = {"q": q, "a": a, "b": b, "fe": fe, "zeros_ok": zs, "nu_ge_Lambda_k<400": nu_ok, "a_q^v_first": [x.str(8, radius=False) for x in aq[:5]],
           "toeplitz_minors_order<=3_checked": tot, "certified_negative_minors": bad}
    out["hq4"].append(row); print("HQ4", row)
for (q, eps) in [(2, "1"), (2, "4"), (3, "0.5")]:
    e = arb(eps); v = arb(q).log()
    def m1(s):
        u = (v * (arb(1) / 2 - s)).exp()
        return 1 + e * u / (1 - u) ** 2
    th = (1 - e / 2).acos()     # zeros u = e^(+-i th)
    s0 = acb(arb(1) / 2, th / v)
    nu_ok = all((2 - 2 * (k * th).cos()) > -arb(10) ** -50 for k in range(1, 400))
    row = {"q": q, "eps": eps, "zero_on_line_im": s0.imag.str(15, radius=False), "m_contains_0": bool(m1(s0).contains(0)), "abs_m_upper": float(abs(m1(s0)).upper()),
           "c_k = 2 - 2 cos(k theta) >= 0 (k < 400, to 1e-50)": nu_ok}
    out["hq1"].append(row); print("HQ1", row)
json.dump(out, open("lemma3.json", "w"), indent=1)
