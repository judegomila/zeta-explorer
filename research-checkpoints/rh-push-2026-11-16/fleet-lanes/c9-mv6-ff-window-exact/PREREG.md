# PREREG: c9-mv6-ff-window-exact

Written 2026-11-19 02:15 UTC, before any production run and before any server run of this lane.
Hashes of the kernel, plan and prediction files at this time: `logs/prereg_hashes.txt`.
No statement about zeta or about zeros of any number-field L-function is tested here. This is a model computation
in F_q[T], where the Riemann hypothesis for the twist family is Weil's theorem.

## 0. What was already seen when this file was written (disclosure)

- Round 8 (`c8-ek-ff-reflected-rows-exact`): q = 7, (N, lam, d) = (2, 7, 2) and (2, 10, 2), weights a, b, mu, al, r1
  (energy/diagonal for target a: 1.192 and 4.13). These two configurations are in the plan below; their values
  are known and are not counted as advance predictions.
- This lane, local (through `scripts/memcap.sh 8`), while reproducing round 8 and validating the new kernel:
  q = 7 (2, 7, 2) with the weight `one` (2.262); q = 7 (2, 8, 2), all six weights (one 0.195, a 0.464, b 0.552,
  mu 0.094, r1 0.90, al 7.1e5); q = 13 (2, 6, 2) and (2, 6, 1) (not in the plan: rmax = 6).
  Known deviation from the law of section 4 before the runs: `one` at q = 7 (2, 7, 2) has B_coh = 0 and e = 2.262.
- Everything else in the plan (q = 7: lam >= 9 except (2, 10, 2); every q = 13 configuration) is unseen.

## 1. Object and exact formula

Conventions of `c7-ff-order2-vertex-exact` / `c8-ek-ff-reflected-rows-exact` (file `ffx.c`): q = 1 mod 6 prime,
chi_0 of order 6 on F_q^*, chi_c(x) = chi_0(Res(c, x)), g_3(1, c) = sum_{x mod c} chi_c(x)^2 e(x/c) = G_2^(deg c)
zeta_6^(g(c)) for squarefree monic c, G_2 = G(chi_0^2), J = J(chi_0^2, chi_0^2), Jbar = q^2/G_2^3.

**Completed marked row** (model form of the marked version of T = L_0 D, manuscript Prop. 5.1, (6.1), section 15.1,
with alpha = 1, sharp degree classes, no excluded set), total length N + lam, marks = all primes P of degree lam,
row variable m monic of degree d, vector u:

    R_m = sum_{j >= 0} Jbar^j sum_{n monic, deg n = j} u(n)^3 chi_n(m)^3
              sum_{P prime, deg P = lam} sum_{A' monic, deg A' = N - 3j, P A' squarefree} g_3(1, P A') u(A') chi_{P A'}(m) / G_2^(3j)

i.e. in units G_2^(N+lam): R_m = sum_j Jbar^j V_j(m) S_{N-3j}(m), S_{N'}(m) the squarefree marked row of round 8
(`ffx en`), V_j(m) = sum_{deg n = j} u(n)^3 chi_n(m)^3 (the terms with P | n need 3 lam <= N + lam and do not
occur for lam > N/2). Each R_m is an exact element of Z[zeta_6].

- N = 2: only j = 0 occurs. The completed row is the squarefree row of round 8.
- N = 3: j = 0 and j = 1 (A' = 1, n linear). Assembled from two kernel runs, (N, lam, d) and (0, lam, d).
- Compensated probe ((12.5) analogue, transcription of c8 section 6): marked term minus the rescaled base row at
  row degree d - 2 lam. In every configuration below d < 2 lam, the rescaled row set is empty, and the row of the
  compensated probe is the marked completed row.
- Reflection: the statistic below is a property of the numbers R_m; a functional equation is an identity between
  the same numbers. The reflected dual sums are not constructed. What is checked exactly (before the runs,
  `fe_check.py`, `fe_marked.py`): the completed rows are coefficients of polynomials (they vanish identically
  beyond a degree, which the squarefree rows do not). Dual length of the row of length N under that polynomial
  degree: R = 2(d + lam) - 2 - N. Dual length of the probe (c8): r = k + N + lam - 1 - d for k <= d/2,
  rmax = N + lam - 1 - d + floor(d/2). "Dual length above 3N" is taken as rmax > 3N (c8 table T9); R > 3N then
  holds as well.

**Statistic.** E = sum_m |R_m|^2 (exact integer times q^(N+lam)); X D = diagonal of the row Gram form
= q^(N+lam) [ sum_{(P, A')} u^2 #{m : (m, A') = 1} + q sum_{(P, n)} u^2 #{m : (m, n) = 1} ] (second term only
for N = 3); e = E/(X D); **excess x = e - 1**. Exact rationals; logarithms and fits are floats computed from
them.

**Vectors.** Probe vectors ("Moebius probe vectors": after the Gauss identity the unfolded vector is mu * nu):
`one` (nu = 1, the trivial target), `a` (nu = quadratic character of conductor T^3 + 2), second target `b`
(q = 7: conductor of index 8, degree 3) or `c4` (q = 13: first irreducible quartic). Controls: `mu`
(u = mu: the unfolded vector is identically 1; this is the Liouville-twisted vector), `al` (aligned vector,
coefficient conj chi_{PA'}(m_0)), `r1` (independent random sixth roots of unity on the pairs (P, A')).
For N = 3 the j = 1 term of the controls: mu: u(n)^3 = -1; al: Jbar conj(chi_P(m_0) chi_n(m_0)^3);
r1: product of independent random sixth roots on P and on n.

## 2. Sizes

All configurations satisfy lam > N, lam > d, the window N - lam < d < N + lam (Z/P < X < Z P) and rmax > 3N.

| family | q | N | d | lam | pair-row operations of the largest |
|---|---|---|---|---|---|
| A7 | 7 | 2 | 2 | 7 .. 13 | 7^17/13 = 1.8e13 |
| B7 | 7 | 2 | 1 | 7 .. 13 | 2.6e12 |
| C7 | 7 | 2 | 3 | 8 .. 11 | 7^16/11 = 3.0e12 |
| D7 | 7 | 3 | 2 | 9 .. 12 (+ companion N = 0) | 7^17/12 = 1.9e13 |
| E7 | 7 | 3 | 1 | 9 .. 12 (+ companion N = 0) | 2.8e12 |
| A13 | 13 | 2 | 2 | 7, 8, 9 | 13^13/9 = 3.4e13 |
| B13 | 13 | 2 | 1 | 7 .. 10 | 13^13/10 = 3.0e13 |
| C13 | 13 | 2 | 3 | 8 | 13^13/8 = 3.8e13 |
| E13 | 13 | 3 | 1 | 9 (+ companion N = 0) | 13^13/9 = 3.4e13 |

Largest sizes may be dropped for time (a job that would exceed 3 hours is not started); a dropped size is
reported as not run. Sizes are never added after results are seen.

## 3. Thresholds and decision rule

Active configurations of a vector: those with B_coh > 0 in `predictions.txt` (fixed now). Active dual length
r* = the largest r among its active k.

For a probe vector v and q, over the active configurations with N = 2 that were run:
beta_q(v) = least-squares slope of log_q(x) against r* (a configuration with x <= 0 enters with x = 0.01).

- **The window statement FAILS in the model** if for some probe vector v: beta_7(v) > 0 over at least three sizes
  with x >= 1 at the largest r*, and, when three active sizes exist at q = 13, also beta_13(v) > 0 with x >= 1 at
  the largest r*.
- **The window statement HOLDS in the model** if for every probe vector: beta_q(v) <= 0 over at least three sizes
  for q = 7 (and for q = 13 where three exist), and x <= 1 in every configuration run.
- Otherwise UNDECIDED, reported as such.
- Cross-q exponent (reported, not part of the rule): ln(x_13/x_7)/ln(13/7) at (2, 7, 2), (2, 8, 3), (2, 10, 1).
- N = 3 (completed rows with a non-trivial cube part) is reported separately; it enters the verdict only as a
  consistency check (too few sizes for a slope at q = 13).

Controls of the code (if one fails, the verdict is void until explained):
- `mu` (Liouville-twisted): slope of log_q(x) against r* over its active N = 2 configurations > 0 for q = 7 and
  q = 13, with x >= 30 at the largest.
- `al` (aligned): x > 100 in every configuration and e/(nsupp/q^d) in [0.5, 2].
- `r1` (random phases): |x| <= 3/sqrt(q^d) in every configuration (Lemma R of round 8: the mean over the phases is
  the diagonal exactly; q^d rows).
- Kernel: `ffw enw` must reproduce `ffx en` exactly on the server on at least five configurations, and the prime
  count of every run must equal the necklace count.

A run of a neighbouring object is recorded NOT-RUN. In particular: if the N = 3 rows are not assembled with their
j = 1 term, the N = 3 lines are squarefree rows and are labelled so; the explicit reflected dual sums are not part
of this plan and are recorded NOT-RUN.

## 4. Predicted values

Law of round 8 (c8 section 5; starred there for r >= 6): e = n + B_coh,

    B_coh = sum_{k <= d/2} wt(r, k)^2 q^(2d) S_cop(k)^2 / (||c_k||^2 q^(N+lam) diagsum),

wt = (q-1)(1 + q + .. + q^floor((r-1)/6)) - [6 | r] q^(r/6) in the class 6 | k - N - lam, sqrt(q) q^(r/6) for
6 | r in the other classes, 0 otherwise; S_cop(k) exact from `ffx sc`; n the non-coherent part.
Predicted for each configuration and real weight: e in [(1 - 1/q)^2 B_coh, B_coh + 1.1]. Full table:
`predictions.txt` (140 lines; produced by `predict.py`). Extract, target a:

| q | (N, lam, d) | r* | B_coh | predicted e |
|---|---|---|---|---|
| 7 | (2, 11, 2) | 11 | 3.66 | [2.69, 4.76] |
| 7 | (2, 12, 2) | 12 | 24.5 | [18.0, 25.6] |
| 7 | (2, 13, 2) | 12 | 26.4 | [19.4, 27.5] |
| 7 | (2, 10, 1) | 10 | 4.70 | [3.45, 5.80] |
| 7 | (2, 12, 1) | 12 | 28.6 | [21.0, 29.7] |
| 7 | (2, 10, 3) | 8 | 4.70 | [3.45, 5.80] |
| 7 | (2, 11, 3) | 10 | 3.66 | [2.69, 4.76] |
| 7 | (2, 9, 2), (2, 9, 1), (2, 11, 1), (2, 13, 1), (2, 9, 3) | - | 0 | [0, 1.1] |
| 13 | (2, 7, 2) | 6 | 1.86 | [1.58, 2.96] |
| 13 | (2, 8, 3) | 6 | 1.63 | [1.38, 2.72] |
| 13 | (2, 10, 1) | 10 | 16.7 | [14.2, 17.8] |
| 13 | (2, 8, 2), (2, 9, 2), (2, 7..9, 1) | - | 0 | [0, 1.1] |

Predicted slopes (from B_coh, active N = 2 configurations): beta_7(a) = beta_7(b) = 0.25 (10 sizes),
beta_13(a) = beta_13(c4) = 0.22 (3 sizes), beta_7(one) = 0.49 (3 sizes: (2, 11, 2), (2, 12, 2), (2, 11, 3));
`one` has no active configuration at q = 13. Cross-q exponent of B_coh for target a: 1.0 at (2, 7, 2) and
(2, 8, 3), 2.05 at (2, 10, 1).

**Predicted outcome: FAILS** (positive slope for the Weil targets; the excess is the squared signal of the
vector's own Moebius sum times the number of sixth-power frequencies, as in c8 section 5). Further predictions:
- inactive configurations: every real weight has e <= 1.1, the control mu included;
- completed rows at N = 3: where the squarefree row has e > 2, the completed row has e within a factor [0.7, 1.3]
  of it (the cube part has diagonal share about 1/q);
- r1 inside its band everywhere; al at nsupp/q^d.

Counted as advance predictions at the end: the interval for e of each unseen configuration and real weight
(one, a, second target, mu), and the three items above.

## 5. Machine plan

Linux server only through `rhrun`; heavy allowance 16 cores; memory request 4 GB per unit (the kernel `ffw enw`
stores no prime tables: planned memory below 0.1 GB for every configuration, printed by the kernel before it
allocates; the request of 4 GB is headroom for the 16 thread stacks and is never raised: if a unit is killed by
its limit, the size is dropped). `rhstatus` is checked before each launch; one unit at a time; units are
stopped or allowed to end before the lane closes. Local runs only through `scripts/memcap.sh 8`.
Exact integers give every value; floats appear only in logarithms, slopes and the display.
