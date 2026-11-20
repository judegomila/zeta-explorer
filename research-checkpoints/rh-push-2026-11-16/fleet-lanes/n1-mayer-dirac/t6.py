# (i) N-convergence of sigma_min at selected points; (ii) P3 bound |zeta(2b)|/(2|zeta(2b-1)|) for the table.
import sys
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
from mpmath import fabs
mp.dps = 50
print("planned allocation: 3 mp matrices up to 48x48 per point")
for b in (mpc('0.3', 60), mpc('0.4', 36), mpc('0.3', 24), mpc('0.4', 59)):
    out = []
    for N in (28, 36, 48):
        L, xs = mayer(b, N); A = tonp(L)
        out.append("N=%d: %.6e"%(N, np.linalg.svd(np.eye(N)-A, compute_uv=False)[-1]))
    print(mp.nstr(b, 6), " ".join(out), flush=True)
print("Re_b Im_b bound=|zeta(2b)|/(2|zeta(2b-1)|)")
for t in range(0, 61):
    print(t, " ".join("%.6e"%float(fabs(zeta(2*mpc(sg, t)))/(2*fabs(zeta(2*mpc(sg, t)-1)))) for sg in ('0.3', '0.4')))
