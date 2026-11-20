# high-precision confirmation of the float64 screen: mpmath eigenvalues of the Hermitian matrix iT at 40 digits.
import sys, math, json
import mpmath as mp
import numpy as np
from glib import KERNELS
from c2 import tvec, stats, H0
mp.mp.dps = 40
N = int(sys.argv[1]); names = sys.argv[2].split(';')
for name in names:
    # kernel samples in float64 are inputs; the matrix built from them is then treated exactly
    t = tvec(KERNELS[name], 400)
    A = mp.zeros(N, N)
    for i in range(N):
        for j in range(N):
            k = abs(j - i)
            if k and k < len(t) and t[k] != 0:
                A[i, j] = mp.mpc(0, (1 if j > i else -1)*mp.mpf(float(t[k])))
    ev = mp.eigh(A, eigvals_only=True)
    ev = sorted([abs(x) for x in ev], reverse=True)
    lam = [x**2 for x in ev[:12]]
    split = [abs(lam[2*j] - lam[2*j + 1])/lam[0] for j in range(6)]
    L = [-mp.log(lam[2*j]/lam[0]) for j in range(6)]
    C = L[1]/3
    resid = max(abs(L[j]/(C*((j + 1)**2 - 1)) - 1) for j in range(2, 6))
    print('%s N=%d (40 digits): max pair split %s  C N^2 %s  ladder resid %s  L3/L2 %s L4/L2 %s' % (
        name, N, mp.nstr(max(split), 3), mp.nstr(C*N*N, 10), mp.nstr(resid, 4), mp.nstr(L[2]/L[1], 8), mp.nstr(L[3]/L[1], 8)), flush=True)
