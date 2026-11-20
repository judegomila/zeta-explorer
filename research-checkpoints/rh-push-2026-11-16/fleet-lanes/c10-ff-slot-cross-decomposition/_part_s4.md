
## 4. POST-HOC: the remainder is a second squared signal, in the direction u(m)

Written after the (2, 12, 1) result was seen; not an advance prediction; totals only (the row values R(m) of every
run are in `results/`; no per-prime split of this part). Scripts `resonance.py`, `explore_dirs.py`; output
`posthoc_dirs.txt`.

For a vector u that is a multiplicative function of the cofactor, let w_u(m) = u(m), the same function at the row
variable (for a target: nu(m) = chi_0(Res(F, m))^3; for mu: mu(m); for a U seed: its sign function; for `one`:
w_u = v_0). Enlarge the span by w_u and w_u v_1 and let n_u = e - (squared signal on the enlarged span).

| q | (N, lam, d) | vector | e | beta (span{v_0, v_1}) | added by u(m), u(m) v_1 | n_u |
|---|---|---|---|---|---|---|
| 7 | (2, 12, 1) | b | 7.468 | 2.158 | 5.235 | 0.075 |
| 7 | (2, 12, 1) | a | 20.64 | 19.43 | 1.147 | 0.066 |
| 7 | (2, 12, 1) | U2 | 74.27 | 65.28 | 8.92 | 0.062 |
| 7 | (2, 10, 1) | b | 1.568 | 0.366 | 0.978 | 0.224 |
| 7 | (2, 10, 1) | a | 3.52 | 3.296 | 0.221 | 0.003 |
| 7 | (2, 10, 1) | U2 | 12.87 | 10.97 | 1.646 | 0.254 |
| 7 | (2, 11, 2) | mu | 132.5 | 129.9 | 2.616 | 0 |
| 7 | (3, 10, 2) | mu | 167.2 | 164.9 | 2.33 | 0 |
| 7 | (3, 11, 1) | a | 3.338 | 1.901 | 1.263 | 0.174 |
| 13 | (2, 7, 2) | mu | 269.6 | 267.4 | 1.94 | 0.248 |

Over all squarefree configurations (`posthoc_dirs.txt`):

| vector class | vector-configurations | max n | with n > 1.5 | max n_u | with n_u > 1.5 |
|---|---|---|---|---|---|
| a | 58 | 1.44 | 0 | 0.97 | 0 |
| b | 40 | 5.31 | 1 | 1.10 | 0 |
| c4 | 18 | 1.47 | 0 | 1.47 | 0 |
| mu | 58 | 2.62 | 7 | 1.97 | 1 ((2, 4, 3)) |
| class U | 422 | 8.98 | 5 | 1.43 | 0 |
| one | 58 | 9.06 | 9 | 9.06 | 9 |

- [MEASURED, POST-HOC] For the targets, mu and class U the row energy is, in the data, a remainder of at most
  about 1.5 diagonals (2 for mu) plus squared signals in the directions v_0, v_1, u(m), u(m) v_1. The ratio of the
  second signal to the first at (2, 10, 1) and (2, 12, 1): 2.67 and 2.43 for b; 0.067 and 0.059 for a; both grow
  from lam = 10 to 12 by the factor 5.2 to 5.9 of the sixth-power staircase. The second signal is therefore of
  the same kind and order as B_coh (a sum with square-root cancellation times the frequency count), not a new
  power of q.
- [ARGUED] Mechanism: for multiplicative u the product u(A') u(m) is u at the product A' m, so the projection of
  the row on u(m) is the k = 0 probe of the same vector with the row variable absorbed into the column; its
  Moebius-type sum is a different sum of the same vector. Not derived line by line.
- [OPEN] The vector `one` (trivial target). w_u = v_0 gives nothing new. For d = 2 the directions
  v^(j)(m) = sum_a chi_0(m(a))^j, j = 2..5, take the whole remainder in 4 of 6 cases ((2, 6, 2): 2.843 of 2.843;
  (2, 11, 2): 4.006 of 4.006; q = 13 (2, 6, 2): 3.541 of 3.541; (3, 5, 2): 2.858 of 2.858) and little in the others
  ((2, 10, 2), q = 13 (2, 7, 2)); for d = 3 they take 1.25 of 9.06 at (2, 7, 3) and 1.25 of 8.40 at (2, 8, 3). The excess of
  `one` is in the cross term in every case (s = 1). Its row directions at d = 3 are not identified. This is the
  open item of c9 (section 3, last observation), now located: it is cross, and it is not in B.
- Consequence for the wording of round 8 ("energy = non-coherent part + squared signal"): there is more than one
  squared signal. The reading of c8 and c9 (the window bound fails for a vector when a squared signal exceeds the
  diagonal) is unchanged.

