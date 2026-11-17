"""Part 4: exactness checks of the functional-equation form of the row Gram (all monic d of degree n).
(a) prime moduli: G_prime = diagonal + q^(n-m) [ (q-1) W_{<=k0} W^* - W_{=k0+1} W^* ]; after removing g~(r,.), deg r <= k0,
    the top eigenvalue must be <= max diagonal of Delta.
(b) squarefree moduli: add the families 1[g | c] g~(d' e^2, c/g), e | g, deg d' <= k0 - 2 deg g + deg e.
Usage: exact_check.py m n"""
import sys, time, numpy as np, scipy.linalg as sla
from common import *
m, n = int(sys.argv[1]), int(sys.argv[2]); k0 = 2 * m - 2 - n
g1 = {e: np.load(f'G_deg{e}.npy')[:, 0].astype(complex) / q ** (e / 2) for e in range(1, m + 1)}; g1[0] = np.ones(1, dtype=complex)
rows = np.nonzero(np.abs(g1[m]) > 0.5)[0]; N = len(rows); pos = -np.ones(q ** m, dtype=np.int64); pos[rows] = np.arange(N)
D = ff.monic(n); ALLC = ff.allc(m)
kr = max(k0 + 1, 0); Rall, Rdeg = monic_pad(kr, kr + 1)
print(f'q={q} m={m} n={n} N={N} k0={k0}; planned dense C {N*q**n*16/1e9:.3f} GB, G {N*N*16/1e9:.3f} GB')
PH = np.array([1, OM[1], OM[2], 0], dtype=complex)
C = np.empty((N, q ** n), dtype=complex); Xr = np.empty((N, len(Rall)), dtype=np.int8)
for i, ci in enumerate(rows):
    tab = chi_table(ALLC[ci]); C[i] = PH[tab[ff.redidx(ALLC[ci], D)]]; Xr[i] = tab[ff.redidx(ALLC[ci], Rall)]
G = C @ C.conj().T; phi = np.real(np.trace(G)) / N; del C
W = g1[m][rows][:, None] * PH[Xr].conj()
def defl(Gm, V):
    if V.shape[1] == 0: return sla.eigvalsh(Gm)[-1], 0
    s = np.linalg.svd(V, full_matrices=False); Q = s[0][:, s[1] > 1e-9 * s[1][0]]
    GQ = Gm @ Q; Gd = Gm - GQ @ Q.conj().T - Q @ GQ.conj().T + Q @ (Q.conj().T @ GQ) @ Q.conj().T
    return sla.eigvalsh(Gd)[-1], Q.shape[1]
# (a) primes
pr = np.isin(rows, PRIMES[m]); Gp = G[np.ix_(pr, pr)]; Wp = W[pr]
lo = Rdeg <= k0; hi = Rdeg == k0 + 1
F = q ** (n - m) * ((q - 1) * Wp[:, lo] @ Wp[:, lo].conj().T - Wp[:, hi] @ Wp[:, hi].conj().T)
Dl = Gp - F; off = ~np.eye(pr.sum(), dtype=bool)
print(f'(a) prime moduli: {pr.sum()} rows; max |G - F| off the diagonal = {np.abs(Dl[off]).max():.3e}; diag(G - F) in [{np.real(np.diag(Dl)).min():.2f}, {np.real(np.diag(Dl)).max():.2f}]; q^n + q^(n-m) = {q**n + q**(n-m):.2f}')
l0 = sla.eigvalsh(Gp)[-1]; l1, r1 = defl(Gp, Wp[:, lo])
print(f'    top eigenvalue: undeflated {l0:.2f} = {l0/q**n:.4f} q^n; after removing {r1} vectors (deg r <= k0): {l1:.2f} = {l1/q**n:.6f} q^n')
for k in range(0, k0):
    lk, rk = defl(Gp, Wp[:, Rdeg <= k]); print(f'    partial k={k}: {lk/q**n:.4f} q^n [{rk}]')
# (b) squarefree: g-families
ext = [W[:, lo]]
cnt = 0
for gam in range(1, m):
    if k0 - gam < 0: break
    A = ff.monic(m - gam); ga = g1[m - gam]
    for gi in range(q ** gam):
        if abs(g1[gam][gi]) < 0.5: continue
        gco = ff.monic(gam)[gi:gi + 1]
        prod = polymul_idx(gco, A)[0][:, :m] @ (q ** np.arange(m)); rp = pos[prod]; ok = rp >= 0
        for e_deg in range(0, gam + 1):
            for ei in range(q ** e_deg):
                eco = tuple(int(x) for x in ff.monic(e_deg)[ei])
                if ff.pdivmod(tuple(int(x) for x in gco[0]), eco)[1]: continue
                dmax = k0 - 2 * gam + e_deg
                if dmax < 0: continue
                e2 = polymul_idx(np.array([eco]), np.array([eco]))[0, 0]
                Dp, _ = monic_pad(dmax, dmax + 1)
                T = polymul_idx(Dp, e2[None, :])[:, 0, :]                       # t = d' e^2
                for t in T:
                    tt = ff.trim(t); tlow = np.array(tt[:-1], dtype=np.int64)
                    chi = PH[chi_table(tlow)[ff.redidx(tlow, A)]] if len(tlow) else np.ones(len(A), dtype=complex)   # chi_t(a) = chi_a(t)
                    v = np.zeros(N, dtype=complex); v[rp[ok]] = (ga * chi.conj())[ok]; ext.append(v[:, None]); cnt += 1
V = np.concatenate(ext, axis=1)
l0 = sla.eigvalsh(G)[-1]; l1, r1 = defl(G, W[:, lo]); l2, r2 = defl(G, V)
print(f'(b) squarefree moduli: undeflated {l0/phi:.4f} phi; main family [{r1}]: {l1/phi:.4f} phi; main + {cnt} divisor-family vectors [{r2}]: {l2/phi:.4f} phi; flat level max_c #(d coprime to c)/phi = {np.real(np.diag(G)).max()/phi:.4f}')
