import sys, glob, numpy as np
for p in sorted(sys.argv[1:]):
    with open(p, "rb") as f:
        h = np.fromfile(f, dtype=np.int64, count=8); c0 = np.fromfile(f, dtype=np.int64, count=1)[0]
        t = np.fromfile(f, dtype=np.float64, count=2); xb = np.fromfile(f, dtype=np.int64, count=16)
    print(p.split("/")[-1], "NOBJ,NC,NW,Q,NB,XSTART,XMAX,XCHAIN=", list(h), "C0", c0, "T0,S", list(t), "XB", [int(x) for x in xb[:h[4]]], flush=True)
