"""High scan near w=1: on-line zeros of H(w,.) up to T=1000 for a list of w."""
import sys, json, time
from zf import *
from scan import scan
out = sys.argv[1]; ws = [float(x) for x in sys.argv[2:]]
Z = ZF(prec=400, delta=0.15, h=0.05, n=72, xmax=3.15)
with open(out, "a") as f:
    for w in ws:
        t0 = time.time(); zs, vals = scan(Z, w, tmax=1000.0, dt=0.025)
        f.write(json.dumps({"w": w, "n": len(zs), "zeros": zs})+"\n"); f.flush()
        print(w, len(zs), round(time.time()-t0,1), flush=True)
