# Test 2 data: values on the critical line for the Gram matrix. t in [0,T], step h.
import numpy as np, flint, time, sys
from hlib import *
T0 = float(sys.argv[1]); T = float(sys.argv[2]); h = float(sys.argv[3]); out = sys.argv[4]
ts = np.arange(T0, T + h / 2, h)
Ds = neg_fund(200)
print('alloc MB', len(ts) * (len(Ds) + 2) * 16 / 1e6, flush=True)
Lv = np.zeros((len(Ds), len(ts)), dtype=complex); Z1 = np.zeros(len(ts), dtype=complex); Z2 = Z1.copy()
t0 = time.time()
for j, t in enumerate(ts):
    s = flint.acb(0.5, float(t))
    Z1[j] = complex(s.zeta())
    Z2[j] = complex((2 * s).zeta()) if t > 0 else np.inf
    for k, D in enumerate(Ds):
        Lv[k, j] = complex(chi(D).l(s))
    if j % 2000 == 0: print(j, t, time.time() - t0, flush=True)
np.savez(out, ts=ts, Ds=np.array(Ds), L=Lv, Z1=Z1, Z2=Z2)
