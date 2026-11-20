#!/usr/bin/env python3
"""chain.py <prefix>: check that the direct-Turing-certified ranges (T1,T2] of consecutive windows overlap, that shared
zero indices have intersecting isolating intervals, and report the contiguous certified interval and zero count."""
import sys, os, json, glob
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
pre = sys.argv[1]
W = []
for f in sorted(glob.glob(os.path.join(HERE, "cert", pre + "*_turingwindow.json"))):
    c = json.load(open(f)); m = json.load(open(os.path.join(HERE, "runs", c["window"] + ".meta.json")))
    T0 = int(m["T"])
    iv = {}
    for line in open(os.path.join(HERE, "runs", c["window"] + ".zeros.tsv")):
        g = line.split("\t"); iv[int(g[0])] = (Fr(g[1]) + T0, Fr(g[2]) + T0)
    k1, k2 = int(c["N_T1"]), int(c["N_T2"])
    # exact Turing points as in turing_window.py: midpoints of the gaps after intervals k1 and k2
    T1 = (iv[k1][1] + iv[k1 + 1][0]) / 2; T2 = (iv[k2][1] + iv[k2 + 1][0]) / 2
    W.append(dict(id=c["window"], ok=c["status"].startswith("CERTIFIED"), T1=T1, T2=T2, k1=k1, k2=k2, iv=iv, meta=m,
                  margin=min(c["margins_T1"] + c["margins_T2"])))
allok = all(w["ok"] for w in W); breaks = []
for a, b in zip(W, W[1:]):
    if not (b["T1"] <= a["T2"]): breaks.append((a["id"], b["id"], "gap")); continue
    for k in set(a["iv"]) & set(b["iv"]):
        if a["iv"][k][1] < b["iv"][k][0] or b["iv"][k][1] < a["iv"][k][0]: breaks.append((a["id"], b["id"], "index mismatch %d" % k)); break
cpu = sum(w["meta"]["cpu_s"] for w in W)
cert_cpu = sum(w["meta"]["cpu_grid_s"] + w["meta"]["wall_isolate_s"] for w in W)
out = dict(windows=len(W), all_windows_certified=allok, chain_breaks=breaks,
           contiguous=allok and not breaks,
           T_lo=str(W[0]["T1"].numerator // W[0]["T1"].denominator + 1), T_hi=str(W[-1]["T2"].numerator // W[-1]["T2"].denominator),
           length=float(W[-1]["T2"] - W[0]["T1"]), N_T_lo=W[0]["k1"], N_T_hi=W[-1]["k2"], zeros=W[-1]["k2"] - W[0]["k1"],
           min_turing_margin=min(w["margin"] for w in W),
           mean_usable_per_window=float(sum(w["T2"] - w["T1"] for w in W) / len(W)),
           cpu_s_total_r36win=cpu, cpu_s_grid_plus_isolate=cert_cpu,
           maxrss_MB=max(w["meta"]["maxrss_MB"] for w in W))
print(json.dumps(out, indent=1))
json.dump(out, open(os.path.join(HERE, "cert", pre + "_chain.json"), "w"), indent=1)
