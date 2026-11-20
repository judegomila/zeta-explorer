# Nystrom eigen-solve of C_- on L^2(0,T) with Gauss-Legendre nodes; entries from Arb, eigensolve in mpmath.
# Then Arb LDL^T certificate of positive definiteness of the node Gram (diagonally normalized).
import sys, json, time
from lib import *
import mpmath as mp
kind = sys.argv[1]; N = int(sys.argv[2]); T = sys.argv[3]; dps = int(sys.argv[4])
T0 = sys.argv[5] if len(sys.argv) > 5 else '0'
ctx.dps = dps; mp.mp.dps = dps
t0 = time.time()
a = arb(T0); b = arb(T)
ts = []; ws = []
for k in range(N):
    x, w = arb.legendre_p_root(N, k, weight=True)
    ts.append((a+b)/2 + (b-a)/2*x); ws.append((b-a)/2*w)
order = sorted(range(N), key=lambda i: float(ts[i].mid())); ts = [ts[i] for i in order]; ws = [ws[i] for i in order]
M, J = Cminus_matrix(ts, kind)
print('matrix built', time.time()-t0, flush=True)
def tomp(x): return mp.mpf(x.mid().str(dps, radius=False))
A = mp.matrix(N, N)
sw = [w.sqrt() for w in ws]
maxrad = 0
for i in range(N):
    for k in range(N):
        v = M[i, k]*sw[i]*sw[k]
        A[i, k] = tomp(v)
        maxrad = max(maxrad, float(v.rad()))
E, V = mp.eigsy(A)
ev = sorted([E[i] for i in range(N)], reverse=True)
print('eig done', time.time()-t0, 'max entry radius', maxrad, flush=True)
print('top eigenvalues:')
for i in range(min(N, 40)): print(i+1, mp.nstr(ev[i], 15))
print('min eig', mp.nstr(ev[-1], 10), 'num negative', sum(1 for e in ev if e < 0))
# sign changes of eigenvectors (as functions v(t)/sqrt(w))
idx = sorted(range(N), key=lambda i: -E[i])
sc = []
for r in range(min(N, 25)):
    col = [V[i, idx[r]]/tomp(sw[i]) for i in range(N)]
    mx = max(abs(c) for c in col)
    s = [c for c in col if abs(c) > mx*mp.mpf(10)**(-8)]
    sc.append(sum(1 for i in range(len(s)-1) if s[i]*s[i+1] < 0))
print('sign changes of top eigenvectors in t (above 1e-8 rel. amplitude):', sc)
# Arb LDL^T certificate on unit-diagonal normalised Gram
d = [M[i, i] for i in range(N)]
posdiag = all(x > 0 for x in d)
print('all diagonal entries certified >0:', posdiag)
piv = []; ok = True
if posdiag:
    G = [[M[i, k]/(d[i].sqrt()*d[k].sqrt()) for k in range(N)] for i in range(N)]
    L = [[arb(0)]*N for _ in range(N)]; D = [None]*N
    for j in range(N):
        s = G[j][j]
        for k in range(j): s = s - L[j][k]*L[j][k]*D[k]
        D[j] = s
        if not (s > 0):
            ok = False; print('pivot', j+1, 'not certified positive:', s.str(10)); break
        for i in range(j+1, N):
            s2 = G[i][j]
            for k in range(j): s2 = s2 - L[i][k]*L[j][k]*D[k]
            L[i][j] = s2/D[j]
    piv = [float(mp.log10(tomp(x))) if x > 0 else None for x in D if x is not None]
    print('LDL certified positive definite:', ok, 'pivots log10 (first/last):', piv[:3], piv[-3:])
json.dump({'kind': kind, 'N': N, 'T0': T0, 'T': T, 'dps': dps, 'eig': [mp.nstr(e, 30) for e in ev], 'signchanges': sc,
           'ldl_posdef': ok and posdiag, 'pivlog10': piv, 'nodes': [float(t.mid()) for t in ts],
           'topvecs': [[float(V[i, idx[r]]/tomp(sw[i])) for i in range(N)] for r in range(min(N, 12))]},
          open(f'nys_{kind}_{N}_{T0}_{T}.json', 'w'))
print('total', time.time()-t0)
