# Combination 2, large sections on CPU: the matrix iT is Hermitian and banded (bandwidth = kernel autocorrelation width / H0),
# so its extreme eigenvalues are computed from band storage (LAPACK zhbevx through scipy.linalg.eigvals_banded).
# The eigenvalues of S = T^T T are the squares; the pair (lambda_{2j-1}, lambda_{2j}) is (sigma_j^+)^2, (sigma_j^-)^2 with
# sigma_j^+ the j-th largest and -sigma_j^- the j-th smallest eigenvalue of iT.
import sys, json, math, time, os
import numpy as np
from scipy.linalg import eigvals_banded
from glib import KERNELS, ORDER
from c2 import tvec, symbol, stats

NS = [int(x) for x in sys.argv[1].split(',')]
out = sys.argv[2]
names = [ORDER[int(i)] for i in sys.argv[3].split(',')] if len(sys.argv) > 3 else ORDER   # kernel indices (one name contains a comma)
res = json.load(open(out)) if os.path.exists(out) else {}
for name in names:
    t = tvec(KERNELS[name], 400)
    M, th0, g2, band, second = symbol(t)
    kb = int(np.nonzero(np.abs(t) > 0)[0].max())
    res.setdefault(name, {'symbol': {'M': M, 'theta0': th0, 'g2': g2, 'band': band, 'second_max_ratio': second}, 'rows': {}})
    for N in NS:
        if str(N) in res[name]['rows']: continue
        t0 = time.time()
        print('  planned: band storage %d x %d complex128 = %.2f GB' % (kb + 1, N, (kb + 1)*N*16/1e9), flush=True)
        ab = np.zeros((kb + 1, N), dtype=np.complex128)
        for k in range(1, kb + 1):
            ab[k, :N - k] = -1j*t[k]
        hi = eigvals_banded(ab, lower=True, select='i', select_range=(N - 6, N - 1))[::-1]
        lo = -eigvals_banded(ab, lower=True, select='i', select_range=(0, 5))
        lam = np.empty(12); lam[0::2] = np.maximum(hi, lo)**2; lam[1::2] = np.minimum(hi, lo)**2
        split, L, C, resid = stats(lam)
        Cp = math.pi**2*g2/(M*(N + 1)**2)
        res[name]['rows'][str(N)] = {'lam': [float(x) for x in lam], 'split': split, 'L': L, 'C': C, 'resid': resid, 'Cpred': Cp,
                                     'lam1_over_M2': float(lam[0]/M**2), 'sec': time.time() - t0}
        print('%-12s N=%6d  max split %.2e  C N^2 %.6f  C/Cpred %.6f  ladder resid %.2e  ratios L3/L2 %.6f L4/L2 %.6f (8/3, 5)  %.0fs'
              % (name, N, max(split), C*N*N, C/Cp, resid, L[2]/L[1], L[3]/L[1], time.time() - t0), flush=True)
        json.dump(res, open(out, 'w'))
print('DONE_BAND')
