import json, glob, math, sys
import numpy as np
OUT = sys.argv[0].rsplit("/", 1)[0]
R = [json.load(open(f)) for f in glob.glob(OUT + "/svd_K*.json")]
R.sort(key=lambda r: (r["K"] != r["D"], r["K"] * r["D"], r["K"]))
def fit(x, y):
    return float(np.polyfit(np.log(x), np.log(y), 1)[0])
print("K D rows cols | s1^2 s1^2/(KD)^(2/3) | s2^2 s2^2/(K+D) s2^2/edge | edge | #>1.0e #>1.1e #>1.25e #>1.5e | ov(v1, conj g N^-1/6) slope|v1|^2 | Rayleigh(w_1) excess/(KD)^(2/3)")
for r in R:
    s2 = np.array(r["s2"]); e = r["edge_mp"]; K, D = r["K"], r["D"]
    bulk = r["fro"] / r["nc"]
    ray1 = r["rayleigh"][0][1]
    r["exc1"] = ray1 - bulk
    cnt = [int((s2 > t * e).sum()) for t in (1.0, 1.1, 1.25, 1.5)]
    r["cnt"] = cnt
    print(f"{K} {D} {r['nr']} {r['nc']} | {s2[0]:.0f} {s2[0]/(K*D)**(2/3):.4f} | {s2[1]:.0f} {s2[1]/(K+D):.3f} {s2[1]/e:.3f} | {e:.0f} | "
          + " ".join(map(str, cnt)) + f" | {r['ov_v1_conj g_0.167']:.4f} {r['amp_slope_v1']:.3f} | {r['exc1']/(K*D)**(2/3):.4f}")
sq = [r for r in R if r["K"] == r["D"]]
Ks = np.array([r["K"] for r in sq], float)
print("\nBalanced K = D fits (all sizes / K >= 2000):")
big = Ks >= 2000
for J in (1, 2, 5, 10, 20, 40):
    y = np.array([r["s2"][J - 1] for r in sq])
    print(f"  s_{J}^2 ~ K^a: a = {fit(Ks, y):.3f} / {fit(Ks[big], y[big]):.3f}")
y = np.array([r["exc1"] for r in sq]); print(f"  Rayleigh excess of w_1 ~ K^a: a = {fit(Ks, y):.3f} / {fit(Ks[big], y[big]):.3f}   (4/3 = 1.333)")
y = np.array([r["edge_mp"] for r in sq]); print(f"  MP edge ~ K^a: a = {fit(Ks, y):.3f}")
for i, t in enumerate((1.0, 1.1, 1.25, 1.5)):
    y = np.array([max(r["cnt"][i], 0.5) for r in sq])
    print(f"  count(s^2 > {t} edge) = {[r['cnt'][i] for r in sq]}  ~ K^a: a (K >= 2000) = {fit(Ks[big], y[big]):.3f}")
print("\nTail profile at fixed size: fit (s_j^2 - x*edge) ... reported as s_j^2/s_1^2 and local exponent over j in [2,40], [5,100]")
for r in sq:
    s2 = np.array(r["s2"]); j = np.arange(1, len(s2) + 1)
    a = fit(j[1:40], s2[1:40]); b = fit(j[4:100], s2[4:100]) if len(s2) >= 100 else float("nan")
    print(f"  K=D={r['K']}: s_j^2 ~ j^b: b[2..40] = {a:.3f}, b[5..100] = {b:.3f};  s_2/s_1 (squared) = {s2[1]/s2[0]:.3f}, s_10 = {s2[9]/s2[0]:.3f}, s_40 = {s2[39]/s2[0]:.3f}")
al = [r for r in R if r["s2"][0] > 1.3 * r["edge_mp"]]
A = np.array([[1, math.log(r["K"]), math.log(r["D"])] for r in al]); yy = np.log([r["s2"][0] for r in al])
co = np.linalg.lstsq(A, yy, rcond=None)[0]
print(f"\nJoint fit s1^2 = c K^a D^b over {len(al)} shapes with s1^2 > 1.3 edge: a = {co[1]:.3f}, b = {co[2]:.3f}, c = {math.exp(co[0]):.3f}")
yy = np.log([r["exc1"] for r in R]); A = np.array([[1, math.log(r["K"]), math.log(r["D"])] for r in R])
co = np.linalg.lstsq(A, yy, rcond=None)[0]
print(f"Joint fit Rayleigh excess of w_1 = c K^a D^b over all {len(R)} shapes: a = {co[1]:.3f}, b = {co[2]:.3f}, c = {math.exp(co[0]):.3f}")
print("\nRayleigh excess by N(r), prime r, relative to r = 1 (largest balanced size):")
r = sq[-1]; bulk = r["fro"] / r["nc"]
pr = [(n, q - bulk) for n, q, l in r["rayleigh"]]
e1 = pr[0][1]
print("  " + "  ".join(f"N={n}:{x/e1:.3f}[{n**(-1/3):.3f}]" for n, x in pr[:30]))
print("\nExplicit deflation table (largest balanced size):")
for d in r["deflation"]:
    print("  ", d)
print("\nQuadratic twist:")
for r in R:
    q = r["quadtwist"][0]
    print(f"  K={r['K']} D={r['D']}: bulk {q['bulk']:.0f}; cubic-only Rayleigh {q['rq_cubic_odd_mean']:.0f} ({q['rq_cubic_odd_mean']/q['bulk']:.2f}x); quadratic-twisted {q['rq_quad_mean']:.0f} ({q['rq_quad_mean']/q['bulk']:.3f}x), max {q['rq_quad_max']/q['bulk']:.3f}x; top-40 energy {q['en_quad_mean']:.4f} vs baseline {q['base']:.4f}; span ratio quad {r['span_quadr']['top']/r['span_quadr']['mp']:.2f} cubic {r['span_cubic']['top']/r['span_cubic']['mp']:.2f}")
