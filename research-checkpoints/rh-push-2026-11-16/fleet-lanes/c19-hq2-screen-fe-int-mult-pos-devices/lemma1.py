# lemma1.py: first lemma. HQ2 coefficients, pole data, off-line zeros in balls, non-vanishing checks. Local.
import json, sys
from flint import arb, acb, ctx
import hq2
ctx.prec = 200
out = {"prec_bits": 200, "members": []}
gam = lambda s: (-(s / 2) * arb.pi().log()).exp() * (s / 2).gamma()
for (q, eps) in [(2, "0.01"), (2, "0.0001"), (2, "0.000001"), (3, "0.01"), (101, "0.01")]:
    e = arb(eps); v = arb(q).log()
    row = {"q": q, "eps": eps}
    # coefficients: Dirichlet convolution check a = 1 * b, b(q^j) = eps C(j+1,3) q^(j/2), against the closed form; multiplicativity is by construction (a depends on v_q(n) only)
    row["a_q^v_v=0..6"] = [hq2.coeff(q, e, vv).str(12, radius=False) for vv in range(7)]
    # power sums two ways
    S1 = hq2.power_sums(e, 40); S2 = hq2.power_sums_newton(e, 40)
    row["max_abs_S_closed_minus_newton_k<=40"] = float(max(abs((a - b).mid()) + (a - b).rad() for a, b in zip(S1, S2)))
    row["k_d_k = 4 - S_k, k=1..6"] = [(4 - S1[k]).str(10, radius=False) for k in range(1, 7)]
    w = hq2.w_root(e)
    row["offset_Re_z"] = (w.real / v).str(20, radius=False); row["Im_z"] = (w.imag / v).str(20, radius=False)
    row["in_open_strip"] = bool(w.real / v < arb(1) / 2)
    zs = []
    for k in (0, 1, 2, 50, 1000):
        for idx, s0 in enumerate(hq2.zeros_s(q, e, k)[:1] + hq2.zeros_s(q, e, k)[2:3]):  # the two zeros right of the line
            m0 = hq2.mfac(q, e, s0)
            z0 = s0.zeta()
            # derivative of m at the zero (simple zero check): m' != 0 by finite difference in balls is not rigorous; use closed form
            u = (v * (arb(1) / 2 - s0)).exp()
            dm = -v * e * (2 * u * u / (1 - u) ** 4 + 4 * u ** 3 / (1 - u) ** 5)
            zs.append({"k": k, "re": s0.real.str(25, radius=False), "im": s0.imag.str(25, radius=False),
                       "abs_m_at_zero_upper": float(abs(m0).upper()), "m_ball_contains_0": bool(m0.contains(0)),
                       "abs_zeta_lower": float(abs(z0).lower()), "zeta_nonzero_certified": bool(abs(z0) > 0),
                       "abs_dm_lower": float(abs(dm).lower()), "simple_zero_certified": bool(abs(dm) > 0),
                       "re_minus_half_positive_certified": bool(s0.real > arb(1) / 2)})
    row["zeros_right_of_line"] = zs
    # poles: s = 1/2 + 2 pi i k/log q; order 4 iff zeta != 0 there
    ps = []
    for k in list(range(0, 6)) + [50, 1000, 100000]:
        p = acb(arb(1) / 2, 2 * arb.pi() * k / v)
        z = p.zeta()
        ps.append({"k": k, "im": p.imag.str(20, radius=False), "abs_zeta_lower": float(abs(z).lower()), "order4_certified": bool(abs(z) > 0)})
    row["poles"] = ps
    # leading Laurent coefficient at u = 1: eps/(log q)^4 (s - p)^-4
    row["leading_laurent_coeff"] = (e / v ** 4).str(15, radius=False)
    # functional equation residual at 3 points
    fe = []
    for s in [acb("0.3", "7.1"), acb("0.81", "23.4"), acb("-1.3", "5.5")]:
        a = s.zeta() * hq2.mfac(q, e, s) * gam(s); b = (1 - s).zeta() * hq2.mfac(q, e, 1 - s) * gam(1 - s)
        fe.append({"overlap": bool(a.overlaps(b)), "rel_width": float((abs(a - b) / abs(a)).upper())})
    row["fe_checks"] = fe
    # no zero of the factor on the line: u/(1-u)^2 = 1/(4 sinh^2(w/2)) <= -1/4 on |u| = 1, so m >= 1 there (PROVED); sample
    mn = None
    for j in range(1, 400):
        s = acb(arb(1) / 2, arb(j) / 37)
        mm = hq2.mfac(q, e, s)
        val = mm.real.lower()
        mn = val if mn is None or val < mn else mn
    row["min_Re_m_on_line_sample_lower"] = float(mn)
    out["members"].append(row)
json.dump(out, open("lemma1.json", "w"), indent=1)
for r in out["members"]:
    print(r["q"], r["eps"], "offset", r["offset_Re_z"], "Im z", r["Im_z"], "strip", r["in_open_strip"], "S diff", r["max_abs_S_closed_minus_newton_k<=40"])
    for z in r["zeros_right_of_line"][:4]: print("   zero", z)
    print("   poles ok:", all(p["order4_certified"] for p in r["poles"]), "fe ok:", all(f["overlap"] for f in r["fe_checks"]), "min m on line", r["min_Re_m_on_line_sample_lower"])
