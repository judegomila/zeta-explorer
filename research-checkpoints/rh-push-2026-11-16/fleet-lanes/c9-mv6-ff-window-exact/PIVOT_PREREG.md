# PIVOT_PREREG: completed rows at dual length at or below 3N (the one pivot of this lane)

Written 2026-11-19 about 04:50 UTC, after the q = 7 production results and the q = 13 results (2,7,1), (2,8,1),
(2,9,1), (2,7,2), (2,8,2) were seen, and before any run of the configurations below. Model statement in F_q[T]
only; no statement about zeta.

**What prompted it (seen, post hoc; `decomp.txt`).** In the pre-registered N = 3 runs the completed row is
S_3 + Jbar V S_0. Its energy at (3, 9, 2) and (3, 12, 1), q = 7, is carried by the cube term Jbar V(m) S_0(m)
(n linear, cofactor A' = 1): E_1/(X D) = 5.3 and 34.5 for target a, while the squarefree row has 0.69 and 0.49.
S_0 = sum_P g_3(1, P) chi_P(m) is the marked row with trivial cofactor; its Moebius sum has no cancellation.

**Statement P to test.** For completed rows with N = 3 in the window and rmax <= 3N = 9 (where round 8 found the
squarefree rows of Weil targets at the diagonal), the cube term puts the probe vectors above the diagonal.

**Configurations** (all with lam > N, lam > d, window, rmax = lam + 1 <= 9): q = 7: (3, lam, d), lam = 6, 7, 8,
d = 1, 2; q = 13: (3, 6, 1), (3, 6, 2), (3, 7, 1); (3, 7, 2) at q = 13 only if server time remains. Vectors: the
six of PREREG.md. Companion runs (0, lam, d).

**Advance predictions** (`pivot_predict.py`, `pivot_predictions.txt`, written before the runs): cube-term energy
over the diagonal, Delta = q mean(V^2) e_U pi(lam) q^d / diag, with e_U = (pi(lam)/q^lam)(wt_0^2 + wt_1^2/(1 - 1/q))
the law of round 8 applied to the trivial cofactor:

| q | (N, lam, d) | rmax | Delta, target a | Delta, one |
|---|---|---|---|---|
| 7 | (3, 6, 1) | 7 | 0.96 | 0 |
| 7 | (3, 6, 2) | 7 | 0.84 | 0.84 |
| 7 | (3, 7, 1) | 8 | 0 | 0 |
| 7 | (3, 7, 2) | 8 | 0.85 | 0.84 |
| 7 | (3, 8, 1) | 9 | 6.88 | 0 |
| 7 | (3, 8, 2) | 9 | 7.04 | 7.02 |
| 13 | (3, 6, 1) | 7 | 1.69 | 0 |
| 13 | (3, 6, 2) | 7 | 1.84 | 1.84 |
| 13 | (3, 7, 1) | 8 | 0 | 0 |
| 13 | (3, 7, 2) | 8 | 1.71 | 1.71 |

**Thresholds.** Measured quantity: E_1/(X D) from the exact decomposition E = E_0 + E_1 + cross (`decomp.py`), and
e = E/(X D) of the completed row.
- P HOLDS if (i) E_1/(X D) lies in [0.5, 1.5] Delta in every configuration run with Delta >= 0.8, (ii) E_1/(X D)
  <= 0.05 where Delta = 0, and (iii) target a has e >= 1.5 for the completed row in every configuration run with
  Delta >= 1.5, at both q.
- P FAILS if E_1/(X D) < 0.25 Delta in more than half of the configurations with Delta >= 0.8, or if (iii) fails at
  both q.
- Otherwise UNDECIDED.
Controls: r1 inside 3/sqrt(q^d); al above 100; mu reported.
Scope stated in advance: N = 3 only (one cube step, cofactor of length 0). The extension to larger N (terms with
cofactor length N - 3j) is not tested by these runs.
