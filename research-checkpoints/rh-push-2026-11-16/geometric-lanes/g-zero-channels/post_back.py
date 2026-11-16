"""Backward certified reach with chain check (same zero followed): cells [-2,0], width 0.05."""
import json, glob, math, statistics as st
from fractions import Fraction as Fr
recs = []
for fn in sorted(glob.glob("back_*.json")): recs += json.load(open(fn))["recs"]
by = {}
for r in recs: by.setdefault(r["k"], []).append(r)
tab = {r["k"]: r for r in json.load(open("table.json"))}
out = {}
for k, rs in by.items():
    rs.sort(key=lambda r: -Fr(r["t0"]))
    reach = 0.0; prev = None; why = "end"
    for r in rs:
        if not r["ok"] or not r["contiguous"]: why = "rouche"; break
        if prev is not None:
            d = abs(Fr(prev["y"])-Fr(r["y"]))
            if not (d+Fr(prev["r_in"]) < Fr(r["r_max"]) and d+Fr(r["r_in"]) < Fr(prev["r_max"])): why = "chain"; break
        reach = float(Fr(r["t0"])-Fr(r["w"])); prev = r
    out[k] = (reach, why)
ks = sorted(out)
# pair consistency: neighbours that stop at the same place
print("k reach why g g/mean reach/g^2")
for k in ks:
    r = tab[k]; print(k, out[k][0], out[k][1], round(r["g"], 3), round(r["gn"], 2), round(-out[k][0]/r["g"]**2, 2))
part = [k for k in ks if out[k][0] > -1.999]
x = [-out[k][0]/tab[k]["g"]**2 for k in part if k < 100]
print("zeros reaching -2:", len(ks)-len(part), " stopping earlier:", len(part), " reach/g^2 min/median/max:", min(x), st.median(x), max(x))
for lo, hi in ((1, 25), (26, 50), (51, 75), (76, 100)):
    sub = [out[k][0] for k in ks if lo <= k <= hi]
    print("block", lo, hi, "shortest reach", max(sub), "median", st.median(sub), "n reaching -2:", sum(s <= -1.999 for s in sub))
json.dump({str(k): out[k] for k in ks}, open("reach_backward.json", "w"))
