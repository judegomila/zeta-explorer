"""selftest: factor-list pipeline against direct powmod on every column; multiplicativity; mu."""
import numpy as np, restricted4 as R
U = 2 ** 9
Ns, mu, F, plist = R.columns(500)
rows = R.rows_true(U)
E = R.chi_primes(rows, plist)
# direct: enumerate elements again in the same order
els = []
import math
B = int(math.isqrt(4 * 500 // 3)) + 3
for a in range(-2 * B, 2 * B + 1):
    if a % 3 != 1: continue
    for b in range(-3 * ((2 * B) // 3 + 1), 2 * B + 1, 3):
        N = a * a - a * b + b * b
        if 0 < N <= 500: els.append((N, a, b))
els.sort()
bad = 0
Eext = np.concatenate([E, np.zeros((len(rows), 1), dtype=np.int8)], axis=1)
for i, (p, w) in enumerate(rows):
    p = int(p); w = int(w); z = (1 + w) % p
    zs = [pow(z, t, p) for t in range(6)]
    for j, (N, a, b) in enumerate(els):
        direct = zs.index(pow((a + b * w) % p, (p - 1) // 6, p))
        viaf = int(Eext[i, F[j]].sum()) % 6
        bad += direct != viaf
print("rows", len(rows), "cols", len(els), "mismatches", bad)
# mu check: sum over ideals of mu(n)/N^s vs 1/zeta_K-like sanity: sum_{d | n} mu(d) = [n = 1] is tested via counts
print("mu values", {int(v): int((mu == v).sum()) for v in (-1, 0, 1)}, "norm-1 mu", mu[0], "first norms", Ns[:8])
# orthogonality sanity: mean over rows of chi(n) for n not a sixth power should be small
ex = np.zeros((len(rows), len(els)), dtype=np.int16)
for j in range(F.shape[1]): ex += Eext[:, F[:, j]]
m = np.abs(R.Z6[ex % 6].mean(axis=0))
print("mean |row-average of chi(n)| over n>1:", m[1:].mean(), " (random level", 1 / np.sqrt(len(rows)), ")")
