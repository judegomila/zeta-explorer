"""Part 2: cubic large sieve over F_7[T], direct.
C[c, d] = chi_c(d), rows c squarefree monic of degree m, columns d all monic of degree n.
G = C C^* (row Gram).  phi = trace/rows.
Row-side families (deg r <= k):  A: g~(1,c) conj chi_c(r) = g~(r,c);  B: g~(1,c) chi_c(r);  Cc: conj of B;  Dc: conj of A.
Column-side family: v_r[d] = conj g(r,d) (Vc) or g(r,d) (Vn), all monic d of degree n.
Usage: sieve.py m n"""
import sys, time, json, numpy as np, scipy.linalg as sla
from scipy.linalg.blas import cherk
from scipy.sparse.linalg import eigsh, LinearOperator
from common import *
m, n = int(sys.argv[1]), int(sys.argv[2]); t0 = time.time()
MODE = sys.argv[3] if len(sys.argv) > 3 else 'all'      # 'sf': columns restricted to squarefree d
g1 = np.load(f'G_deg{m}.npy')[:, 0].astype(complex)
rows = np.nonzero(np.abs(g1) > 0.5)[0]; N = len(rows); gt = g1[rows] / q ** (m / 2)
k0 = 2 * m - 2 - n
kr = min(max(k0 + 1, 2), 5)
if len(np.nonzero(np.abs(g1) > 0.5)[0]) > 2100: kr = min(kr, 3)
Rall, Rdeg = monic_pad(kr, kr + 1)
print(f'q={q} m={m} n={n} rows(sqfree)={N} cols={q**n} k0=2m-2-n={k0} kr={kr}')
print(f'planned: Cexp int8 {N*q**n/1e9:.3f} GB; Gram complex64 {N*N*8/1e9:.3f} GB; Xr int8 {N*len(Rall)/1e9:.3f} GB', flush=True)
D = ff.monic(n); ALLC = ff.allc(m)
Cexp = np.empty((N, q ** n), dtype=np.int8); Xr = np.empty((N, len(Rall)), dtype=np.int8)
for i, ci in enumerate(rows):
    clow = ALLC[ci]; tab = chi_table(clow)
    Cexp[i] = tab[ff.redidx(clow, D)]; Xr[i] = tab[ff.redidx(clow, Rall)]
if MODE == 'sf':
    if n <= 5: sqd = np.abs(np.load(f'G_deg{n}.npy')[:, 0]) > 0.5
    else:
        sqd = np.zeros(q ** 6, dtype=bool); _r = np.load('reps6.npy'); _g = np.abs(np.load('g1_deg6_reps.npy')) > 0.5; _A = ff.allc(6)
        _R6 = np.concatenate([_A[_r], np.ones((len(_r), 1), dtype=np.int64)], axis=1)
        for a in range(q): sqd[shift_coeffs(_R6, a)[:, :6] @ (q ** np.arange(6))] = _g
    Cexp[:, ~sqd] = -1; print('MODE sf: squarefree columns', int(sqd.sum()))
print(f'symbols built {time.time()-t0:.0f}s', flush=True)
PH = np.array([1, OM[1], OM[2], 0], dtype=np.complex64)       # index -1 -> 0
def phase(E): return PH[E]
G = np.zeros((N, N), dtype=np.complex64, order='F')
CH = max(1, int(4e8 // (N * 8)))
for j0 in range(0, q ** n, CH):
    X = np.asfortranarray(phase(Cexp[:, j0:j0 + CH]))
    G = cherk(1.0, X, beta=1.0, c=G, lower=1, overwrite_c=1)
B = 1024
for i0 in range(0, N, B):
    i1 = min(N, i0 + B)
    blk = G[i0:i1, i0:i1]; il = np.tril_indices(i1 - i0, -1); blk[il[1], il[0]] = blk[il].conj()
    if i1 < N: G[i0:i1, i1:] = G[i1:, i0:i1].conj().T
tr = float(np.real(np.trace(G))); phi = tr / N
print(f'Gram built {time.time()-t0:.0f}s  trace={tr:.6g} phi=trace/rows={phi:.4f} q^n={q**n}', flush=True)
out = dict(q=q, m=m, n=n, N=N, k0=k0, phi=phi, trace=tr)
DENSE = N <= 2100
def top_dense(M, k=12):
    w = sla.eigvalsh(M); return w[::-1][:k], w[0]
def top_op(mv, k=4):
    op = LinearOperator((N, N), matvec=mv, dtype=np.complex64)
    w = eigsh(op, k=k, which='LA', tol=1e-5, return_eigenvectors=False, ncv=40)
    return np.sort(w)[::-1]
if DENSE:
    w, U = sla.eigh(G.astype(np.complex128)); top = w[::-1][:16]; lam_min = w[0]; u1 = U[:, -1]
else:
    wv, Uv = eigsh(G, k=12, which='LA', tol=1e-6, ncv=60); o = np.argsort(wv)[::-1]; top = wv[o]; u1 = Uv[:, o[0]]; lam_min = float('nan')
lam1 = float(top[0])
print('undeflated: lam1/phi = %.4f  lam1/trace = %.3e  lam_min/phi = %.4f' % (lam1 / phi, lam1 / tr, lam_min / phi))
print('top eigenvalues / phi:', ' '.join(f'{x/phi:.3f}' for x in top), flush=True)
out.update(lam1=lam1, top=[float(x) for x in top], lam_min=float(lam_min))
# row-side families
def famf(name, sel):
    X = PH[Xr[:, sel]].astype(np.complex128)
    if name in ('A', 'Cc'): X = X.conj()
    return (gt if name in ('A', 'B') else gt.conj())[:, None] * X
# identity check: G = q^(n-m) [ (q-1) W_{<=k0} W^* - W_{=k0+1} W^* ] + Delta
if 0 <= k0 + 1 <= kr and len(Rall) <= 3000 and DENSE:
    W = famf('A', slice(None)); lo = Rdeg <= k0; hi = Rdeg == k0 + 1
    F = q ** (n - m) * ((q - 1) * (W[:, lo] @ W[:, lo].conj().T) - W[:, hi] @ W[:, hi].conj().T)
    Dl = G - F
    cop = np.abs(G) > -1
    # coprime pairs: chi_c(c') != 0; compute through gcd indicator = whether both rows share a zero pattern: use symbol of c at c'
    Gc = np.zeros((N, N), dtype=bool)
    for i, ci in enumerate(rows):
        tab = chi_table(ALLC[ci]); Gc[i] = tab[ff.redidx(ALLC[ci], ff.monic(m)[rows])] >= 0
    off = ~np.eye(N, dtype=bool)
    r_cop = np.abs(Dl[Gc & off]).max(); r_non = np.abs(Dl[(~Gc) & off]).max() if ((~Gc) & off).any() else 0.0
    dg = np.real(np.diag(Dl))
    wD = sla.eigvalsh(Dl.astype(np.complex128))
    print(f'identity: max |G - F| on coprime off-diagonal pairs = {r_cop:.3e} (entries of G up to {np.abs(G[off]).max():.1f}); on non-coprime pairs = {r_non:.3f}; diag(Delta)/phi in [{dg.min()/phi:.4f}, {dg.max()/phi:.4f}]')
    print(f'Delta = G - F: eigenvalues/phi in [{wD[0]/phi:.4f}, {wD[-1]/phi:.4f}]; fraction of non-coprime pairs {1-Gc[off].mean():.4f}', flush=True)
    out.update(id_res_coprime=float(r_cop), id_res_noncoprime=float(r_non), Delta_top=float(wD[-1]), Delta_bot=float(wD[0]))
    del F, Dl, Gc
def deflate_rows(Wk):
    Q, Rr = np.linalg.qr(Wk); keep = np.abs(np.diag(Rr)) > 1e-8 * np.abs(np.diag(Rr)).max()
    if not keep.all():
        s = np.linalg.svd(Wk, full_matrices=False); Q = s[0][:, s[1] > 1e-8 * s[1][0]]
    if DENSE:
        Gd = G.astype(np.complex128); GQ = Gd @ Q
        Gd = Gd - GQ @ Q.conj().T - Q @ GQ.conj().T + Q @ (Q.conj().T @ GQ) @ Q.conj().T
        w = sla.eigvalsh(Gd); return w[-1], Q.shape[1]
    Qc = Q.astype(np.complex64)
    def mv(x):
        x = x.astype(np.complex64).ravel(); x = x - Qc @ (Qc.conj().T @ x); y = G @ x; return y - Qc @ (Qc.conj().T @ y)
    return float(top_op(mv, k=2)[0]), Q.shape[1]
print('row-side deflation: lam_top/phi after removing family, by max conductor degree k  [rank removed]')
res = {}
for name in ['A', 'B', 'Cc', 'Dc']:
    line = []
    for k in range(0, kr + 1):
        if N > 2100 and name != 'A' and k > 1: continue
        lam, rk = deflate_rows(famf(name, Rdeg <= k)); res[f'{name}{k}'] = (float(lam), int(rk))
        line.append(f'k={k}: {lam/phi:.4f} [{rk}]')
    print(f'  {name}: ' + '  '.join(line), flush=True)
out['rowdefl'] = res
# column-side family
Vsrc = None
if n <= 5:
    Gn = np.load(f'G_deg{n}.npy'); Rk, Rkdeg = monic_pad(4, 5); Vsrc = Gn; del Gn
else:
    reps = np.load('reps6.npy'); g6 = np.load('g1_deg6_reps.npy'); A6 = ff.allc(6)
    full = np.zeros(q ** 6, dtype=complex); R6 = np.concatenate([A6[reps], np.ones((len(reps), 1), dtype=np.int64)], axis=1)
    for a in range(q):
        full[shift_coeffs(R6, a)[:, :6] @ (q ** np.arange(6))] = g6
    Vsrc = full[:, None].astype(np.complex64); Rkdeg = np.array([0])
def CQ(Qv):
    Y = np.zeros((N, Qv.shape[1]), dtype=np.complex128); CHr = max(1, int(2e8 // (q ** n * 8)))
    for i0 in range(0, N, CHr):
        Y[i0:i0 + CHr] = phase(Cexp[i0:i0 + CHr]) @ Qv
    return Y
print('column-side deflation (Kubota side): lam_top/phi after removing span{conj g(r,.)} (Vc) or span{g(r,.)} (Vn), deg r <= k')
cres = {}
kmaxc = int(Rkdeg.max()) if N <= 2100 else min(int(Rkdeg.max()), 2)
for name in ['Vc', 'Vn']:
    line = []
    for k in range(0, kmaxc + 1):
        V = Vsrc[:, Rkdeg <= k].astype(np.complex128)
        if name == 'Vc': V = V.conj()
        s = np.linalg.svd(V, full_matrices=False); Qv = s[0][:, s[1] > 1e-8 * s[1][0]]; Y = CQ(Qv)
        if DENSE:
            w = sla.eigvalsh(G.astype(np.complex128) - Y @ Y.conj().T); lam = w[-1]
        else:
            Yc = Y.astype(np.complex64)
            lam = float(top_op(lambda x: G @ x.astype(np.complex64).ravel() - Yc @ (Yc.conj().T @ x.astype(np.complex64).ravel()), k=2)[0])
        if k == 0:
            v = V[:, 0]; Cv = CQ((v / np.linalg.norm(v))[:, None])[:, 0]
            ov_left = abs(np.vdot(u1, Cv)) / np.linalg.norm(Cv); ray = np.linalg.norm(Cv) ** 2
            # overlap of v with the true right singular vector C^* u1 / s1
            vstar = np.zeros(q ** n, dtype=np.complex128); CHr = max(1, int(2e8 // (q ** n * 8)))
            for i0 in range(0, N, CHr): vstar += phase(Cexp[i0:i0 + CHr]).conj().T @ u1[i0:i0 + CHr]
            ov_right = abs(np.vdot(vstar, v)) / (np.linalg.norm(vstar) * np.linalg.norm(v))
            line.append(f'[r=1: |Cv|^2/|v|^2 = {ray/phi:.4f} phi; overlap(Cv,u1)={ov_left:.4f}; overlap(v, right vec)={ov_right:.4f}]')
            cres[name + '_r1'] = (float(ray), float(ov_left), float(ov_right))
        line.append(f'k={k}: {lam/phi:.4f} [{Qv.shape[1]}]'); cres[f'{name}{k}'] = (float(lam), int(Qv.shape[1]))
    print(f'  {name}: ' + '  '.join(line), flush=True)
out['coldefl'] = cres
# overlap of u1 with row family r = 1
for name in ['A', 'Cc']:
    w1 = famf(name, slice(0, 1))[:, 0]; print(f'overlap(u1, {name}[r=1]) = {abs(np.vdot(u1, w1))/np.linalg.norm(w1):.4f}')
json.dump(out, open(f'sieve_{m}_{n}_{MODE}.json', 'w'))
print(f'done {time.time()-t0:.0f}s')
