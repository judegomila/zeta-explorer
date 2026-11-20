"""Part 1: Kubota coefficients S_n(r) = sum_{c monic, deg c = n} g(r, c), n <= 6, all monic r of degree <= 4, q = 7.
Checks: (a) chi_table / Gauss sums against ff.py direct summation for small degree; (b) rationality:
p_n(r) = S_n(r) - q^4 S_{n-3}(r) = 0 for n > deg r + 1."""
import numpy as np, time, sys
from common import *
RMAX = 4; L = RMAX + 1
R, Rdeg = monic_pad(RMAX, L)
print('planned: r table', R.shape, '; per-modulus FFT array', q ** 6 * 16 / 1e6, 'MB; G store deg<=5', sum(q ** n for n in range(6)) * len(R) * 16 / 1e6, 'MB', flush=True)
ridx = {tuple(r): i for i, r in enumerate(map(tuple, R))}
S = np.zeros((7, len(R)), dtype=complex)
S[0] = 1.0
g1 = {0: np.ones(1, dtype=complex)}
t0 = time.time()
# validation against ff.py for n <= 3 (all c) and samples at n = 4
rng = np.random.default_rng(1); maxdev = 0
for n in range(1, 6):
    ALLC = ff.allc(n)
    Gst = np.zeros((q ** n, len(R)), dtype=np.complex64)
    for ci in range(q ** n):
        clow = ALLC[ci]
        tab = chi_table(clow)
        if n <= 3 or (n == 4 and ci % 97 == 0):
            ref = ff.chilog(clow); refc = np.where(ref >= 0, ref % 3 if False else (ref * 2 % 6) // 2, -1)
            assert np.array_equal(refc, tab), (n, ci)
            gref = ff.gauss(clow, R[:60], j=2)
        F = gauss_table(tab, n)
        G = F[t_index(clow, R)]
        if n <= 3 or (n == 4 and ci % 97 == 0):
            maxdev = max(maxdev, np.abs(G[:60] - gref).max())
        Gst[ci] = G
    S[n] = Gst.sum(axis=0, dtype=np.complex128)
    np.save(f'G_deg{n}.npy', Gst)
    print(f'n={n} done {time.time()-t0:.0f}s  max dev vs ff.py direct so far {maxdev:.2e}', flush=True)
# n = 6 through shift representatives (coefficient of T^5 equal to 0)
n = 6
allc6 = ff.allc(6); reps = np.nonzero(allc6[:, 5] == 0)[0]
A = np.zeros(len(R), dtype=complex); g1_6 = np.zeros(len(reps), dtype=complex)
for j, ci in enumerate(reps):
    clow = allc6[ci]
    F = gauss_table(chi_table(clow), 6)
    G = F[t_index(clow, R)]
    A += G; g1_6[j] = G[0]
    if j % 2000 == 0: print('  n=6 rep', j, f'{time.time()-t0:.0f}s', flush=True)
for a in range(q):
    Rs = shift_coeffs(R, a)
    S[6] += A[[ridx[tuple(r)] for r in Rs]]
np.save('g1_deg6_reps.npy', g1_6); np.save('reps6.npy', reps)
np.save('S.npy', S); np.save('R.npy', R)
print('total time', time.time() - t0)
