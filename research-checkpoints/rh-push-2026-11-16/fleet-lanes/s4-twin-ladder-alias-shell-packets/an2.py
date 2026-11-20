"""an2.py -- merge c2.json (p <= 11) and c2b.json (p = 97, 997, 9973; rerun after the overflow fix) -> c2m.json, an2.md"""
import json, math
import numpy as np
a = json.load(open("c2.json")); b = json.load(open("c2b.json"))
rows = [r for r in a["theta"] if r["p"] not in (97, 997, 9973)] + b["theta"]
assert not any(math.isnan(v) for r in rows for v in r["theta"].values())
a["theta"] = rows; json.dump(a, open("c2m.json", "w"))
md = []
md.append("**Certificate E (coefficient-uniform, sign-blind), exact census.** W(p,D)/(pD)^(2/3) over the %d cells p in {2,..,9973}, D in {1,..,1e6}: between %.4f and %.4f (bounds of the record for pD >= 64: 5/32 and 28/3). Firing needs x_avail > 2 a* W with a* = %.4f: fires in %d of %d cells.\n" % (
    len(a["certE"]), min(r["ratio"] for r in a["certE"]), max(r["ratio"] for r in a["certE"]), a["astar"], sum(r["fires"] for r in a["certE"]), len(a["certE"])))
md.append("| p | D | W(p,D) | W/(pD)^(2/3) | x_avail | needed 2 a* W |\n|---|---|---|---|---|---|")
for r in a["certE"]:
    if r["p"] in (2, 97, 9973) and r["D"] in (1, 1024, 10 ** 6): md.append("| %d | %d | %.6g | %.4f | %.4g | %.4g |" % (r["p"], r["D"], r["W"], r["ratio"], r["x_avail"], r["need"]))
md.append("\n**Complex energy ratio theta = phi^H G phi / 1^T G 1 on the full grid G(p,D) (N = (p-1)D packets), float64 GPU.** ARITH: phi = e(hr/p), the record's coefficients, min..max over r in {1, 2, (p-1)/2, p-1}. SGN / UNI: independent random signs / phases per packet (mean of 8 draws, and the largest). SGNH / UNIH: arithmetic phase times a random sign / phase per alias class h (mean of 4). LEG: arithmetic phase times the Legendre symbol of h. Fires = theta < 1/2.\n")
md.append("| p | D | N | ARITH min..max | 1/(p-1)^2 | SGN mean (max) | UNI mean (max) | SGNH | UNIH | LEG | p/(p-1)^2 | diagonal share |\n|---|---|---|---|---|---|---|---|---|---|---|---|")
summ = []
for r in rows:
    th = r["theta"]; ar = [v for k, v in th.items() if k.startswith("ARITH")]; sg = [v for k, v in th.items() if k.startswith("SGN_")]; un = [v for k, v in th.items() if k.startswith("UNI_")]
    sh = [v for k, v in th.items() if k.startswith("SGNH")]; uh = [v for k, v in th.items() if k.startswith("UNIH")]; p = r["p"]
    summ.append(dict(p=p, D=r["D"], N=r["N"], arith_min=min(ar), arith_max=max(ar), sgn_max=max(sg), uni_max=max(un), sgnh_max=max(sh), leg=th.get("LEG")))
    if r["D"] in (1, 4, 16, 64, 256, 1024) or r["N"] > 9e4:
        md.append("| %d | %d | %d | %.4g..%.4g | %.4g | %.3g (%.3g) | %.3g (%.3g) | %.3g | %.3g | %s | %.4g | %.3g |" % (p, r["D"], r["N"], min(ar), max(ar), 1 / (p - 1) ** 2, np.mean(sg), max(sg), np.mean(un), max(un), np.mean(sh), np.mean(uh),
                  ("%.4g" % th["LEG"]) if "LEG" in th else "-", p / (p - 1) ** 2, r["diag_fraction"]))
n = len(summ)
st = dict(cells=n, arith_fires_all_r=sum(s["arith_max"] < 0.5 for s in summ), sgn_fires=sum(s["sgn_max"] < 0.5 for s in summ), uni_fires=sum(s["uni_max"] < 0.5 for s in summ),
          arith_fails_cells=[(s["p"], s["D"]) for s in summ if s["arith_max"] >= 0.5][:40], sgn_fails_cells=[(s["p"], s["D"]) for s in summ if s["sgn_max"] >= 0.5],
          uni_fails_cells=[(s["p"], s["D"]) for s in summ if s["uni_max"] >= 0.5], leg_fails_cells=[(s["p"], s["D"]) for s in summ if s["leg"] is not None and s["leg"] >= 0.5],
          cells_random_below_arith_min=sum(max(s["sgn_max"], s["uni_max"]) < s["arith_min"] for s in summ),
          cells_random_below_arith_max=sum(max(s["sgn_max"], s["uni_max"]) < s["arith_max"] for s in summ), Nmax=max(s["N"] for s in summ))
md.append("\nCounts over the %d cells (largest N = %d): ARITH fires for every r in %d cells (fails in %s ...); random signs fire in %d, random phases in %d (fail in %s, %s); LEG fails in %s. Largest random theta below the smallest arithmetic theta in %d cells, below the largest arithmetic theta in %d cells.\n" % (
    n, st["Nmax"], st["arith_fires_all_r"], st["arith_fails_cells"][:6], st["sgn_fires"], st["uni_fires"], st["sgn_fails_cells"], st["uni_fails_cells"], st["leg_fails_cells"], st["cells_random_below_arith_min"], st["cells_random_below_arith_max"]))
json.dump(dict(summary=st, rows=summ), open("an2.json", "w"), indent=1); open("an2.md", "w").write("\n".join(md) + "\n"); print("\n".join(md[-3:]))
