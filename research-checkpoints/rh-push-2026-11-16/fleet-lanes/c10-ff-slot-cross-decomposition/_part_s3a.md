
## 3. Decisive test: the pre-registered split

PREREG.md (rules A to D, vectors, sizes, predictions, disclosure) was written after the kernel and the identity
check and before any production run; hashes in `logs/prereg_hashes.txt`. Seen before it: the c9 totals e for every
configuration; the split of q = 7 (2, 7, 2) for six vectors; the check configurations.

Vectors. Probe vectors (Moebius vectors after unfolding): `one` (trivial target), `a`, `b` (q = 7) / `c4` (q = 13)
(quadratic characters of prime conductor of degree 3, 3, 4). `mu`: Liouville-twisted vector. `al`: aligned
vector. Seeded classes: `U` (random completely multiplicative signs on the cofactor; the same vector in every
block), `r` (independent random sixth roots on every column), `a*e`, `mu*e` (a and mu with random signs on the
marked primes). 8 seeds per class in the runs of kind F, 2 in kind L, 1 in kind M.

Sizes run (all with lam > N, lam > d, N - lam < d < N + lam; rmax = N + lam - 1 - d + floor(d/2)):

| q | N | d | lam | below / above 3N |
|---|---|---|---|---|
| 7 | 2 | 1 | 3 .. 11 (F), 12 (L) | rmax = lam: 4 sizes at or below 6, 6 above |
| 7 | 2 | 2 | 3 .. 10 (F), 11 (L) | 4 at or below, 5 above |
| 7 | 2 | 3 | 4 .. 9 (F) | rmax = lam - 1: 4 at or below, 2 above |
| 7 | 3 | 1 | 4 .. 10 (F), 11 (L), 12 (M, optional) | rmax = lam + 1: 5 at or below 9, 3 or 4 above |
| 7 | 3 | 2 | 4 .. 9 (F), 10 (L) | 5 at or below, 2 above |
| 13 | 2 | 1 | 3 .. 7 (F), 8 (L) | 4 at or below, 2 above |
| 13 | 2 | 2 | 3 .. 7 (F) | 4 at or below, 1 above |
| 13 | 3 | 1 | 4 .. 6 (F), 7 (L) | all below 9 |
| 13 | 3 | 2 | 4, 5 (F), 6 (L) | all below 9 |

59 configurations (58 required, all run; of the two optional ones (3, 12, 1) was run and (2, 12, 2) was not: NOT-RUN).
At q = 13 the only configuration above 3N with an active class is (2, 7, 2); q = 13, N = 3 above 3N and q = 13
(2, 10, 1) (the c9 value 18.1) are NOT-RUN (size at 4 cores). Full tables: `tables.md`; exact fractions:
`slot_results.json`; rule output: `rules.txt`.

