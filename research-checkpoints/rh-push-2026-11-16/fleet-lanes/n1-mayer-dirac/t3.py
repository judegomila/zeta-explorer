# sigma_min(1 - L_b) on Re b = 0.3, 0.4, Im b <= 60 (nodal basis, Chebyshev nodes on [0,1]).
import sys, time
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
mp.dps = int(sys.argv[4]) if len(sys.argv) > 4 else 40
N = int(sys.argv[1]); step = int(sys.argv[2]); off = int(sys.argv[3])
print("planned allocation: 3 mp matrices %dx%d per point; N=%d dps=%d"%(N, N, N, mp.dps))
t0 = time.time()
print("Re_b Im_b sigma_min(1-L) sigma_min(1+L) min|lam-1| |det(1-L)|")
for t in range(off, 61, step):
    for sg in ('0.3', '0.4'):
        if time.time() - t0 > 1020: print("# wall limit reached"); sys.exit(0)
        b = mpc(sg, t)
        L, xs = mayer(b, N); A = tonp(L); I = np.eye(N)
        sm = np.linalg.svd(I - A, compute_uv=False)[-1]; sp = np.linalg.svd(I + A, compute_uv=False)[-1]
        ev = np.linalg.eigvals(A)
        print("%s %2d %.6e %.6e %.6e %.6e"%(sg, t, sm, sp, min(abs(ev-1)), abs(np.linalg.det(I-A))), flush=True)
print("# done %.0fs"%(time.time()-t0))
