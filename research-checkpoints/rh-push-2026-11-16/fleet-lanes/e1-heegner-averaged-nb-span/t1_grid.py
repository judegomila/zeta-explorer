# Test 1a: values of L(s, chi_D) (D<0 fundamental, |D|<=200) and zeta(s), zeta(2s) on a grid of the strip.
# Planned allocation: (NS x NT x 62) complex128.
import numpy as np, flint, time, sys
lo, hi, dt, out = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
from hlib import *
sig = np.concatenate([np.arange(0.5, 1.0001, 0.025), np.arange(1.1, 3.0001, 0.1)])
sig = sig[(sig >= lo - 1e-9) & (sig < hi - 1e-9)]
ts = np.arange(0.0, 50.0001, dt)
Ds = neg_fund(200)
print('alloc MB', len(sig) * len(ts) * (len(Ds) + 2) * 16 / 1e6, flush=True)
Lv = np.zeros((len(Ds), len(sig), len(ts)), dtype=complex)
Z1 = np.zeros((len(sig), len(ts)), dtype=complex); Z2 = Z1.copy()
t0 = time.time()
for i, s0 in enumerate(sig):
    for j, t in enumerate(ts):
        s = flint.acb(float(s0), float(t))
        if not (abs(s0 - 1) < 1e-12 and t == 0):
            Z1[i, j] = complex(s.zeta())
        Z2[i, j] = complex((2 * s).zeta()) if not (abs(s0 - .5) < 1e-12 and t == 0) else np.inf
        for k, D in enumerate(Ds):
            Lv[k, i, j] = complex(chi(D).l(s))
    print(i, s0, time.time() - t0, flush=True)
np.savez(out, sig=sig, ts=ts, Ds=np.array(Ds), L=Lv, Z1=Z1, Z2=Z2)
