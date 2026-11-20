# gramla.py <dir> <tag> <N> <kind> [params]: linear algebra on the exact Gram written by nbcore.
#  kind = zeta | per <L1> | tnr <q> <c>
# Outputs <dir>/la_<tag>.json (top eigenpairs on a ladder) and <dir>/d2_<tag>.npy (d_n^2 for all n<=N).
import sys, json, math, time
import numpy as np
from scipy.linalg import lapack, blas
from scipy.sparse.linalg import eigsh, LinearOperator
d, tag, N, kind = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
EG = 0.57721566490153286061
print(f'planned allocation: Gram {8*N*N/1e9:.2f} GB (single copy, in-place Cholesky)', flush=True)
G = np.fromfile(f'{d}/gram_{tag}.bin', dtype=np.float64).reshape(N, N)
k = min(N, 400); print('symmetry defect (block):', float(np.abs(G[:k,:k]-G[:k,:k].T).max()), flush=True)
Gf = G.T  # F-contiguous view; G symmetric
n_arr = np.arange(1, N+1, dtype=np.float64)
if kind == 'zeta':
    bvec = (np.log(n_arr)+1-EG)/n_arr
elif kind == 'per':
    from scipy.special import digamma
    q = int(sys.argv[5]); cf = [float(x) for x in sys.argv[6:6+q]]
    L1 = -sum(cf[r-1]*digamma(r/q) for r in range(1, q+1))/q; print('F(1) =', L1)
    bvec = L1/n_arr
elif kind == 'tnr':
    q = int(sys.argv[5]); c = float(sys.argv[6])
    def beta(th):  # int_1^inf {t/theta} dt/t^2
        if th >= 1: return (math.log(th)+1-EG)/th
        X = 1/th; M = int(math.floor(X+1e-12)); H = sum(1.0/k for k in range(1, M+1))
        return ((1-EG) - (math.log(X) - H + M/X))/th
    # H^2 normalisation: F~(s) = zeta(s)(1 + c q^(1/2) q^(-s) + q q^(-2s)) = q^(-(s-1/2)) F(s); |F~| = |F| on the line (same Gram)
    bvec = np.array([beta(n) + c*q**0.5*beta(n*q) + q*beta(n*q*q) for n in range(1, N+1)])
lad = sorted(set([int(round(x)) for x in np.geomspace(min(100, N), N, num=22)] + [x for x in (250,500,1000,2000,3000,4000,6000,8000,10000,12000,16000,20000,24000,30000) if x <= N]))
out = {'tag': tag, 'N': N, 'kind': kind, 'eig': []}
def top(n):
    def mv(v):
        v = np.asarray(v).ravel(); o = np.empty(n)
        for i0 in range(0, n, 2048):
            i1 = min(n, i0+2048); o[i0:i1] = G[i0:i1, :n] @ v
        return o
    w, V = eigsh(LinearOperator((n, n), matvec=mv, dtype=np.float64), k=3, which='LA', tol=1e-11)
    o = np.argsort(-w); w = w[o]; V = V[:, o]
    return w, V
t0 = time.time()
for n in lad:
    w, V = top(n); v1 = V[:, 0]
    tr = float(np.trace(G[:n, :n]))
    out['eig'].append({'n': n, 'lam1': float(w[0]), 'lam2': float(w[1]), 'lam3': float(w[2]), 'w1': float(v1[0]**2), 'trace': tr})
    print('eig', n, w[:3], 'w1', v1[0]**2, f'{time.time()-t0:.0f}s', flush=True)
c, info = lapack.dpotrf(Gf, lower=1, overwrite_a=1, clean=0)
print('cholesky info', info, 'in place:', np.shares_memory(c, Gf), flush=True)
out['chol_info'] = int(info)
if info == 0:
    dg = np.diagonal(c); out['min_pivot'] = float(dg.min()); out['argmin_pivot'] = int(dg.argmin())+1
    y = blas.dtrsv(c, bvec, lower=1)
    d2 = 1 - np.cumsum(y*y)
    np.save(f'{d}/d2_{tag}.npy', d2)
    out['d2_at'] = {str(n): float(d2[n-1]) for n in lad}
    print('d2 ladder', out['d2_at'], flush=True)
json.dump(out, open(f'{d}/la_{tag}.json', 'w'), indent=1)
print('done', f'{time.time()-t0:.0f}s')
