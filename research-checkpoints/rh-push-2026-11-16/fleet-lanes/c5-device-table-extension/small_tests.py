"""Devices (e), (a), (d): three exact or elementary checks.
(e) C(s) = zeta(s) + c/Gamma(s): same values as zeta at s = 0, -1, -2, ... (so the same Kubota-Leopoldt data for every p),
    with a zero placed at a chosen s0.
(a) S-unit frequencies log n, n = 2^a 3^b 5^c 7^d: smallest gap up to height U against the trivial integer bound exp(-U)
    and against the mean gap; the gap list does not depend on the coefficients of the Dirichlet series.
(d) Fejer cap: for a non-negative cosine polynomial a_0 + sum a_k cos(k x), a_1 <= 2 a_0 cos(pi/(K+2)) < 2 a_0 (value at degree K by an LP-free closed form check)."""
import json, math, itertools
from mpmath import mp, mpf, mpc, zeta, gamma, rgamma, bernoulli, fabs, findroot, cos, pi
mp.dps = 30
out = {}
# (e)
s0 = mpc("0.8", "20")
c = -zeta(s0)*gamma(s0)
C = lambda s: zeta(s) + c*rgamma(s)
vals = []
for k in range(0, 12):
    s = mpf(-k)
    vals.append((k, str(fabs(C(s) - zeta(s))), str(zeta(s))))
out["e"] = {"s0": str(s0), "c": str(c), "abs_C_at_s0": str(fabs(C(s0))), "abs_zeta_at_s0": str(fabs(zeta(s0))),
            "diff_at_nonpositive_integers": vals,
            "abs_c_over_Gamma_at_2": str(fabs(c*rgamma(2))), "abs_c_over_Gamma_at_3+50i": str(fabs(c*rgamma(mpc(3, 50))))}
# also a control that keeps the Dirichlet-series form on the integers side is impossible: record only the function-level control.
# (a)
P = [2, 3, 5, 7]
lp = [math.log(p) for p in P]
rows = []
for U in (20, 40, 60, 80):
    pts = []
    rng = [range(int(U/l) + 1) for l in lp]
    for e in itertools.product(*rng):
        v = sum(a*l for a, l in zip(e, lp))
        if v <= U: pts.append((v, e))
    pts.sort()
    # exact gap by integers for the smallest float gaps (avoid float cancellation)
    best = None
    cand = sorted(((pts[i+1][0] - pts[i][0]), i) for i in range(len(pts) - 1))[:200]
    for g, i in cand:
        m = math.prod(p**a for p, a in zip(P, pts[i][1])); n = math.prod(p**a for p, a in zip(P, pts[i+1][1]))
        gg = mp.log(mpf(n)/mpf(m))
        if best is None or gg < best[0]: best = (gg, pts[i][1], pts[i+1][1], pts[i][0])
    rows.append({"U": U, "count": len(pts), "mean_gap": U/len(pts), "min_gap": float(best[0]), "at_height": best[3],
                 "exponents": [best[1], best[2]], "trivial_bound_exp_minus_height": math.exp(-best[3]),
                 "log_min_gap_over_log_U": math.log(float(best[0]))/math.log(U)})
out["a"] = rows
# (d) Fejer-Riesz extremal: max a_1/a_0 over non-negative cosine polynomials of degree K is 2 cos(pi/(K+2))
out["d"] = [{"K": K, "max_a1_over_a0": float(2*cos(pi/(K+2)))} for K in (2, 3, 4, 8, 16, 64)]
json.dump(out, open("small_tests.json", "w"), indent=1)
print(json.dumps(out, indent=1))
