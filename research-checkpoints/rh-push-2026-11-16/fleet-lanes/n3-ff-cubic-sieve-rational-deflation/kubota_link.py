"""Part 5: link between the column-side Gauss vector and the Kubota coefficient.
(C v)[c] = sum_{deg d = n} chi_c(d) conj g(1, d)  versus  conj S_n(c), S_n(c) = sum_{deg d = n} g(c, d) (all d).
Also the residue form: for n > deg r + 1, S_n(r) = (1 - 1/q) sum_{j >= 1} q^(4j) a_{n-3j}(r)."""
import numpy as np
from common import *
S = np.load('S.npy'); R = np.load('R.npy'); deg = (R != 0).cumsum(axis=1).argmax(axis=1)
a = []
for n in range(7):
    p = S[n] - (q ** 4 * S[n - 3] if n >= 3 else 0); a.append(p + (q ** 3 * a[n - 3] if n >= 3 else 0))
worst = 0
for n in range(1, 7):
    sel = deg < n - 1
    if not sel.any(): continue
    pred = (1 - 1 / q) * sum(q ** (4 * j) * a[n - 3 * j][sel] for j in range(1, n // 3 + 1))
    worst = max(worst, np.abs(S[n, sel] - pred).max() / q ** (4 * n / 3))
print(f'residue form S_n = (1-1/q) sum_j q^(4j) a_(n-3j) for n > deg r + 1: max deviation / q^(4n/3) = {worst:.2e}')
for (m, n) in [(3, 5), (4, 5), (4, 4), (3, 4), (4, 6), (3, 6), (2, 6)]:
    gm = np.load(f'G_deg{m}.npy')[:, 0]; rows = np.nonzero(np.abs(gm) > 0.5)[0]; ALLC = ff.allc(m); D = ff.monic(n)
    if n <= 5: gn = np.load(f'G_deg{n}.npy')[:, 0].astype(complex)
    else:
        gn = np.zeros(q ** 6, dtype=complex); _r = np.load('reps6.npy'); _g = np.load('g1_deg6_reps.npy'); _A = ff.allc(6)
        _R6 = np.concatenate([_A[_r], np.ones((len(_r), 1), dtype=np.int64)], axis=1)
        for sh in range(q): gn[shift_coeffs(_R6, sh)[:, :6] @ (q ** np.arange(6))] = _g
    PH = np.array([1, OM[1], OM[2], 0], dtype=complex)
    Cv = np.array([np.sum(PH[chi_table(ALLC[ci])[ff.redidx(ALLC[ci], D)]] * gn.conj()) for ci in rows])
    off = sum(q ** e for e in range(m)); Sn = S[n, off + rows]
    rel = np.linalg.norm(Cv - Sn.conj()) / np.linalg.norm(Cv); cor = abs(np.vdot(Cv, Sn.conj())) / (np.linalg.norm(Cv) * np.linalg.norm(Sn))
    stable = n > m + 1
    print(f'(m,n)=({m},{n}) n > m+1: {stable}:  |Cv - conj S_n(c)| / |Cv| = {rel:.4f}; correlation = {cor:.4f}; |Cv|^2 / (N q^(8n/3 - m/3)) = {np.linalg.norm(Cv)**2 / (len(rows) * q ** (8 * n / 3 - m / 3)):.4f}')
