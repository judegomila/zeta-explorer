"""Part 3: dual (functional-equation) form of the row-Gram excess, q = 7.
Rows: squarefree monic c of degree m.  X[c, r] = chi_c(r) for monic r of degree <= kmax (reciprocity: chi_c(r) = chi_r(c)).
K = X^* X.  Positive part of the excess of G(m, n), n = 2m-2-k0:  (q-1) q^(n-m) W W^*, W[c, r] = g~(r, c), deg r <= k0,
same non-zero spectrum as (q-1) q^(n-m) K_{<=k0}.  After removing deg r <= k from the row space: Schur complement.
Output: E(m, k0; k) = (q-1) lam_max(Schur_k(K_{<=k0})) / q^m  = (excess top eigenvalue) / q^n.
Usage: dual.py m kmax"""
import sys, time, json, numpy as np, scipy.linalg as sla
from common import *
m, kmax = int(sys.argv[1]), int(sys.argv[2]); t0 = time.time()
R, Rdeg = monic_pad(kmax, kmax + 1); nR = len(R)
# squarefree flags for monic c of degree m: strike multiples of p^2, p prime, 2 deg p <= m
sq = np.ones(q ** m, dtype=bool)
for d in range(1, m // 2 + 1):
    P = ff.monic(d)[PRIMES[d]]; P2 = np.stack([polymul_idx(P[i:i + 1], P[i:i + 1])[0, 0] for i in range(len(P))])
    Y = ff.monic(m - 2 * d)
    for i0 in range(0, len(P2), 16):
        pr = polymul_idx(P2[i0:i0 + 16], Y)[:, :, :m] @ (q ** np.arange(m)); sq[pr.ravel()] = False
rows = np.nonzero(sq)[0]; N = len(rows)
print(f'q={q} m={m} kmax={kmax} sqfree rows N={N} (expected {q**m - q**(m-1)}) columns r: {nR}')
print(f'planned: coefficient array {N*(m+1)*8/1e9:.3f} GB; X int8 {N*nR/1e9:.3f} GB; K complex128 {nR*nR*16/1e9:.3f} GB', flush=True)
Cc = np.concatenate([ff.coeffs(rows, m), np.ones((N, 1), dtype=np.int64)], axis=1)
X = np.zeros((N, nR), dtype=np.int8)
for j in range(1, nR):
    e = Rdeg[j]; rlow = R[j, :e]; tab = chi_table(rlow); X[:, j] = tab[ff.redidx(rlow, Cc)]
    if j % 500 == 0: print('  r', j, f'{time.time()-t0:.0f}s', flush=True)
PH = np.array([1, OM[1], OM[2], 0], dtype=np.complex64)
if m <= 4:   # reciprocity check against chi_c(r) computed from the modulus side
    ALLC = ff.allc(m); bad = 0
    for i in range(0, N, max(1, N // 50)):
        clow = ALLC[rows[i]]; bad += int((chi_table(clow)[ff.redidx(clow, R)] != X[i]).sum())
    print('reciprocity check mismatches:', bad)
K = np.zeros((nR, nR), dtype=np.complex128); CH = max(1, int(3e8 // (nR * 8)))
for i0 in range(0, N, CH):
    Xc = PH[X[i0:i0 + CH]]; K += (Xc.conj().T @ Xc).astype(np.complex128)
print(f'K built {time.time()-t0:.0f}s', flush=True)
out = dict(q=q, m=m, N=N, E={}, spec={})
print('E(m,k0;k) = (q-1) lam_max(Schur_k) / q^m   [n = 2m-2-k0;  k = -1 means no deflation]')
for k0 in range(0, kmax + 1):
    n = 2 * m - 2 - k0
    if n < 1: continue
    sel = Rdeg <= k0; Kk = K[np.ix_(sel, sel)]; dg = Rdeg[sel]
    w = sla.eigvalsh(Kk)[::-1]
    line = [f'k=-1: {(q-1)*w[0]/q**m:.4f}']
    out['spec'][k0] = [float((q - 1) * x / q ** m) for x in w[:40]]
    out['E'][f'{k0},-1'] = float((q - 1) * w[0] / q ** m)
    for k in range(0, k0):
        a = dg <= k; b = ~a
        Kaa = Kk[np.ix_(a, a)]; Kab = Kk[np.ix_(a, b)]
        Sc = Kk[np.ix_(b, b)] - Kab.conj().T @ (np.linalg.pinv(Kaa, rcond=1e-10, hermitian=True) @ Kab)
        ws = sla.eigvalsh(Sc)[-1]; line.append(f'k={k}: {(q-1)*ws/q**m:.4f}'); out['E'][f'{k0},{k}'] = float((q - 1) * ws / q ** m)
    cnt = int(((q - 1) * w / q ** m > 0.5).sum())
    print(f'  k0={k0} (n={n}, family size {sel.sum()}, eig>0.5: {cnt}): ' + '  '.join(line))
    print('      top spectrum: ' + ' '.join(f'{(q-1)*x/q**m:.2f}' for x in w[:14]), flush=True)
# signed form including the negative top-degree block, when it fits
for k0 in range(0, kmax):
    n = 2 * m - 2 - k0
    if n < 1: continue
    sel = Rdeg <= k0 + 1; Kk = K[np.ix_(sel, sel)]; s = np.where(Rdeg[sel] <= k0, q - 1.0, -1.0)
    ev, U = sla.eigh(Kk); ev = np.clip(ev, 0, None); Rt = (U * np.sqrt(ev)) @ U.conj().T
    ws = sla.eigvalsh(Rt @ (s[:, None] * Rt))
    print(f'  signed excess k0={k0} (n={n}): top {ws[-1]/q**m:.4f}  bottom {ws[0]/q**m:.4f}   (units of q^n)')
    out['E'][f'{k0},signed'] = (float(ws[-1] / q ** m), float(ws[0] / q ** m))
json.dump(out, open(f'dual_{m}_{kmax}.json', 'w'))
print(f'done {time.time()-t0:.0f}s')
