# Combination 1, part A, float64 screen: spectrum of the diagonally normalised orbit-pair matrix at large N (GPU eigensolver when available).
# The inertia itself is fixed by proof (N-1, 0, 1); float64 can only show: one eigenvalue clearly negative, numerical rank, no second negative above noise.
# usage: c1a_gpu.py out.json N1,N2,...
import sys, json, time, math
import numpy as np
from scipy.special import erfcx
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=24*1024**3)
    GPU = True
except Exception as e:
    cp = None; GPU = False
out = {'gpu': GPU, 'rows': []}
for N in [int(x) for x in sys.argv[2].split(',')]:
    t0 = time.time()
    print('N', N, 'planned allocation: matrix %.2f GB float64 (+ eigensolver workspace about 2x)' % (N*N*8/2**30), flush=True)
    n = np.arange(1, N + 1, dtype=np.float64)
    al = math.pi*n*n
    P = np.stack([-30*al, 60*al**2, -16*al**3])        # coefficients of x^1..x^3
    bt = 4*al*(2*al - 3); ct = P.sum(axis=0)
    C = np.empty((N, N))
    B = 500
    # diagonal first
    def block(i0, i1):
        S = al[i0:i1, None] + al[None, :]
        r = np.sqrt(S)
        J = [math.sqrt(math.pi)*erfcx(r)/r]
        for k in range(1, 7):
            J.append(((k - 0.5)*J[-1] + 1)/S)
        g = np.zeros_like(S)
        for i in range(3):
            for j in range(3):
                g += P[i, i0:i1, None]*P[j][None, :]*J[i + j + 2]
        return g + (bt[i0:i1, None]*ct[None, :] + ct[i0:i1, None]*bt[None, :])/2
    dg = np.empty(N)
    for i0 in range(0, N, B):
        i1 = min(N, i0 + B)
        blk = block(i0, i1)
        C[i0:i1] = blk
        dg[i0:i1] = np.sqrt(np.diagonal(blk[:, i0:i1]))
    C /= dg[:, None]; C /= dg[None, :]
    offneg = bool((C[~np.eye(N, dtype=bool)] < 0).all()) if N <= 4000 else None
    print('host memory plan: one %.2f GB matrix, overwritten in place by the eigensolver (GPU stage skipped: device 1 is full)' % (N*N*8/2**30), flush=True)
    used = 'cpu'
    w = None
    if GPU and N*N*8*3 < 2*1024**3:
        try:
            w = cp.asnumpy(cp.linalg.eigvalsh(cp.asarray(C)))
            cp.get_default_memory_pool().free_all_blocks(); used = 'gpu'
        except Exception as e:
            print('GPU eigensolver failed (%s); CPU fallback' % repr(e)[:120], flush=True)
    if w is None:
        import scipy.linalg as sla
        w = sla.eigh(C, eigvals_only=True, overwrite_a=True, check_finite=False, lower=True)
    tol = 1e-11*float(np.abs(w).max())
    row = {'N': N, 'min_eig': float(w[0]), 'second_eig': float(w[1]), 'max_eig': float(w[-1]), 'n_below_-tol': int((w < -tol).sum()),
           'n_above_tol': int((w > tol).sum()), 'n_within_tol': int((np.abs(w) <= tol).sum()), 'tol': tol, 'most_negative_5': [float(x) for x in w[:5]],
           'offdiag_all_negative': offneg, 'solver': used, 'seconds': time.time() - t0}
    print(json.dumps(row), flush=True)
    out['rows'].append(row)
    del C
json.dump(out, open(sys.argv[1], 'w'), indent=1)
