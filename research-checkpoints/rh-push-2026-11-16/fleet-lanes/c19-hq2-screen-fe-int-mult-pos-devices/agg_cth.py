import json, sys, collections
import numpy as np
rows = [json.loads(l) for l in open("cth.jsonl")]
g = collections.defaultdict(list)
for r in rows:
    key = (r["T0"], r["theta"], r["obj"], r.get("q", ""), r.get("eps", r.get("eta", "")))
    g[key].append(r)
out = []
print("| T0 | theta | object | q | eps or eta | windows | min G: min / median / max | fails M=0 (ball) | fails M=1 (ball < -1) | passes on grid (ball > 0 at grid min) |")
print("|---|---|---|---|---|---|---|---|---|---|")
for key in sorted(g, key=lambda k: (k[0], k[1], str(k[2]), str(k[3]), float(k[4]) if k[4] != "" else 0)):
    rs = g[key]; v = np.array([r["ball_mid"] for r in rs])
    row = dict(T0=key[0], theta=key[1], obj=key[2], q=key[3], par=key[4], n=len(rs), mn=float(v.min()), med=float(np.median(v)), mx=float(v.max()),
               fail0=sum(r["ball_neg"] for r in rs), fail1=sum(r["ball_lt_m1"] for r in rs), pass0=sum(r["ball_pos"] for r in rs),
               maxrad=max(r["ball_rad"] for r in rs), max_float_ball_diff=max(abs(r["minG"] - r["ball_mid"]) for r in rs))
    out.append(row)
    print("| %g | %g | %s | %s | %s | %d | %.3f / %.3f / %.3f | %d | %d | %d |" % (row["T0"], row["theta"], row["obj"], row["q"], row["par"], row["n"], row["mn"], row["med"], row["mx"], row["fail0"], row["fail1"], row["pass0"]))
json.dump(out, open("cth_table.json", "w"), indent=1)
print("max ball radius", max(r["maxrad"] for r in out), "max |float - ball|", max(r["max_float_ball_diff"] for r in out), file=sys.stderr)
