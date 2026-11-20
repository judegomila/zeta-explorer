import json, sys, collections, glob
import numpy as np
fn = sys.argv[1]; tag = sys.argv[2]
rows = [json.loads(l) for l in open(fn)]
g = collections.defaultdict(list)
for r in rows:
    par = r.get("eps", r.get("eta", r.get("a", "")))
    if "b" in r: par = "%s/%s" % (r["a"], r["b"])
    g[(r["T0"], r["theta"], r["m"], r["obj"], r.get("q", ""), par)].append(r)
def fkey(k):
    p = k[5]
    try: pv = float(str(p).split("/")[0])
    except Exception: pv = 0
    return (k[0], k[1], k[2], str(k[3]), str(k[4]), pv)
out = []
L = ["| T0 | theta | m | object | q | eps / eta / a,b | cells | s = lam_min/Lg: min / median / max | M=0: pos / neg / undecided | M=1: pos / neg / undecided |", "|---|---|---|---|---|---|---|---|---|---|"]
for key in sorted(g, key=fkey):
    rs = g[key]; s = np.array([r["s"] for r in rs])
    c = lambda M, v: sum(r["signs"][M] == v for r in rs)
    row = dict(T0=key[0], theta=key[1], m=key[2], obj=key[3], q=key[4], par=key[5], n=len(rs), smin=float(s.min()), smed=float(np.median(s)), smax=float(s.max()),
               M0=[c("0", "pos"), c("0", "neg"), c("0", "undecided")], M1=[c("1", "pos"), c("1", "neg"), c("1", "undecided")])
    out.append(row)
    L.append("| %g | %g | %d | %s | %s | %s | %d | %.4g / %.4g / %.4g | %d / %d / %d | %d / %d / %d |" % (row["T0"], row["theta"], row["m"], row["obj"], row["q"], row["par"], row["n"], row["smin"], row["smed"], row["smax"], *row["M0"], *row["M1"]))
open("%s_table.md" % tag, "w").write("\n".join(L) + "\n")
json.dump(out, open("%s_table.json" % tag, "w"), indent=1)
print(len(rows), "records;", len(out), "table rows; cells:", len(set((r["T0"], r["w"], r["theta"]) for r in rows)))
# comparison with c18 (zeta, m = 96, same windows)
c18 = {}
for f in glob.glob("../c18-tz-band-completion-controls-server/res_1e6_DC_*.jsonl"):
    for l in open(f):
        r = json.loads(l)
        if r.get("form") == "D" and r.get("obj") == "zeta" and "lam_min" in r: c18[(r["w"], r["theta"])] = r["lam_min"]
d = [abs(r["lam_min"] - c18[(r["w"], r["theta"])]) for r in rows if r["obj"] == "zeta" and r["m"] == 96 and r["T0"] == 1e6 and (r["w"], r["theta"]) in c18]
if d: print("zeta m=96 at 1e6 against c18 lam_min: %d cells, max abs diff %.3g" % (len(d), max(d)))
