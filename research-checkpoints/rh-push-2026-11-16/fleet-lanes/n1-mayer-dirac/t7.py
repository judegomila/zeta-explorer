import sys, time
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
print("planned allocation: 3 mp matrices up to 84x84 per point")
for b in (('0.3', 60), ('0.4', 59), ('0.3', 24), ('0.4', 36)):
    out = []
    for N, d in ((48, 55), (64, 72), (84, 92)):
        mp.dps = d; t0 = time.time()
        L, xs = mayer(mpc(*b), N); A = tonp(L)
        out.append("N=%d: %.6e (%.0fs)"%(N, np.linalg.svd(np.eye(N)-A, compute_uv=False)[-1], time.time()-t0))
    print(b, " ".join(out), flush=True)
