# lemma2.py: (a) sign of the log-derivative coefficients of HQ2: nu(q^k) = log q (1 + q^(k/2) (4 - S_k)); first negative k.
# (b) the sibling control HQ3(q, a, b) = zeta(s) (1 - alpha u + u^2)/(1 - beta u + u^2), alpha = q^a + q^-a, beta = q^b + q^-b, 0 < a < b < 1/2:
#     nu(q^k) = log q (1 + 2 q^(k/2) (cosh(k b log q) - cosh(k a log q))) > Lambda; FE; zeros at 1/2 +- a + 2 pi i k/log q; poles at 1/2 +- b + 2 pi i k/log q.
import json
from flint import arb, acb, ctx
import hq2
ctx.prec = 400
out = {"hq2_first_negative_nu": [], "hq3": []}
for (q, eps) in [(2, "1e-8"), (2, "1e-6"), (2, "1e-4"), (2, "1e-3"), (2, "1e-2"), (2, "1e-1"), (3, "1e-4"), (3, "1e-2"), (101, "1e-2")]:
    K = 4000
    S = hq2.power_sums(arb(eps), K)
    first = None; nneg = 0
    for k in range(1, K + 1):
        val = 1 + arb(q).sqrt() ** k * (4 - S[k])
        if val < 0:
            nneg += 1
            if first is None: first = k
    import math
    out["hq2_first_negative_nu"].append({"q": q, "eps": eps, "first_k_with_nu_negative": first, "n_at_first": ("%d^%d" % (q, first)) if first else None,
                                         "log10_n": first * math.log10(q) if first else None, "count_negative_k<=4000": nneg})
    print(q, eps, "first negative k", first, "log10 n = %.1f" % (first * math.log10(q)) if first else "", "negatives", nneg)
gam = lambda s: (-(s / 2) * arb.pi().log()).exp() * (s / 2).gamma()
ctx.prec = 200
for (q, a, b) in [(2, "0.1", "0.2"), (2, "0.3239252271", "0.4"), (2, "0.03", "0.06"), (3, "0.2", "0.3")]:
    v = arb(q).log(); A = arb(a) * v; B = arb(b) * v
    al = 2 * A.cosh(); be = 2 * B.cosh()
    def m3(s):
        u = (v * (arb(1) / 2 - s)).exp()
        return (1 - al * u + u * u) / (1 - be * u + u * u)
    # coefficients of m3 as a power series in u (convolution), and a(q^j)
    N = 40
    den = [arb(1)]
    for k in range(1, N + 1):
        den.append(be * den[k - 1] - (den[k - 2] if k >= 2 else 0))
    b_k = [den[k] - al * (den[k - 1] if k >= 1 else 0) + (den[k - 2] if k >= 2 else 0) for k in range(N + 1)]
    a_q = []; run = arb(0)
    for j in range(N + 1):
        run += b_k[j] * arb(q).sqrt() ** j
        a_q.append(run)
    nu_ok = all((1 + 2 * arb(q).sqrt() ** k * ((k * B).cosh() - (k * A).cosh())) > 1 for k in range(1, 400))
    fe = []
    for s in [acb("0.3", "7.1"), acb("0.81", "23.4"), acb("-1.3", "5.5")]:
        x = s.zeta() * m3(s) * gam(s); y = (1 - s).zeta() * m3(1 - s) * gam(1 - s)
        fe.append(bool(x.overlaps(y)) and float((abs(x - y) / abs(x)).upper()) < 1e-40)
    zs = []
    for k in (0, 1, 7):
        s0 = acb(arb(1) / 2 + arb(a), 2 * arb.pi() * k / v)
        zs.append({"k": k, "re": s0.real.str(15, radius=False), "im": s0.imag.str(15, radius=False), "m_contains_0": bool(m3(s0).contains(0)),
                   "abs_m_upper": float(abs(m3(s0)).upper()), "zeta_nonzero": bool(abs(s0.zeta()) > 0)})
    ps = []
    for k in (0, 1, 7):
        p0 = acb(arb(1) / 2 + arb(b), 2 * arb.pi() * k / v)
        ps.append({"k": k, "re": p0.real.str(15, radius=False), "im": p0.imag.str(15, radius=False), "zeta_nonzero_so_simple_pole": bool(abs(p0.zeta()) > 0)})
    row = {"q": q, "a": a, "b": b, "alpha": al.str(12, radius=False), "beta": be.str(12, radius=False),
           "nu_ge_Lambda_certified_k<400": nu_ok, "a_q^j_ge_1_certified_j<=40": all(x > 1 or j == 0 for j, x in enumerate(a_q)),
           "a_q^j_first": [x.str(8, radius=False) for x in a_q[:5]], "fe": fe, "zeros": zs, "poles": ps}
    out["hq3"].append(row)
    print("HQ3", q, a, b, "nu>=Lambda", nu_ok, "a>=1", row["a_q^j_ge_1_certified_j<=40"], "fe", fe, "zeros", [z["m_contains_0"] and z["zeta_nonzero"] for z in zs], "a(q^j)", row["a_q^j_first"])
json.dump(out, open("lemma2.json", "w"), indent=1)
