import sys, json, math
from elib import *
tc = float(sys.argv[1]); out = sys.argv[2]
sig = [round(0.51 + 0.02 * k, 3) for k in range(25)]
ts = [round(tc - 0.5 + 0.02 * k, 4) for k in range(51)]
print("planned rows", len(sig) * len(ts))
rows = {}
print("sigma:  " + " ".join("%4.2f" % s for s in sig))
for t in ts:
    line = []
    for s in sig:
        E = Eis(s, t); W, mn, info, per = winding(E, 3 + t / math.pi)
        rows["%g,%g" % (s, t)] = [W, mn]
        line.append(("%4d" % round(W)) if abs(W - round(W)) < 1e-3 else "  ??")
    print("t=%7.3f " % t + " ".join(line), flush=True)
json.dump(rows, open(out, "w"))
