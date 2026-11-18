# c3-multiwindow-converse-defect: joint functional-equation test in m windows for unimodular Euler products

Date: 2026-11-18. Kind: combine (rotation lemma of `c2-polydisc-leeyang-bound` x window-translate lemma of
`c2-euler-cone-fe-rigidity`). Scope: this directory only. Numerics: float64 nonlinear least squares, local runs through
`scripts/memcap.sh 8`; the `T = 1e6` runs on the compute server through `rhrun` (4 cores, 8 GB, units stopped); survivors
re-evaluated in ball arithmetic (python-flint). Labels: PROVED (argument given here), CLASSICAL, MEASURED (float64 search, no
certificate), ARGUED, OPEN. No statement about zeros of zeta is made.

## Verdict

**Precise obstruction. No new result. Outcome B at each fixed height in the finite model, outcome A as the height grows at a
fixed number of windows; the rigidity that appears beyond the crossover is a parameter count and is not uniform in T.**

1. (MEASURED) In the finite model of round 2, a completely multiplicative unimodular sequence `a(n) = prod chi(p)^k`,
   `p <= N = 3.2 sqrt(T/2 pi)`, that passes the windowed functional-equation test in m windows `[T_j, T_j + 2]` (same chi in all
   windows) and has a prescribed zero at `1/2 + delta + i t0` in the top window exists for `m < m*` and was not found for
   `m > m*`, with `m* ~ pi(N)/r`, `r ~ 30` real conditions per window at tolerance 1e-5 (windows in `[T/2, T]`):

   | T | primes P | m = 1 | m = 2 | m = 4 | m = 8 | m = 16 |
   |---|---|---|---|---|---|---|
   | 1e3 | 12 | 7e-2 | 3e-1 | 4e-1 | 4e-1 | 5e-1 |
   | 1e4 | 31 | 7e-5 | 7e-2 | 1e-1 | 3e-1 | 3e-1 |
   | 1e5 | 79 | 1e-10 | 2e-5 (refined) | 7e-3 (refined) | 1e-1 | 3e-1 |
   | 1e6 | 206 | 1e-9 | 4e-9 | 7e-7 (refined) | 2e-3 (refined) | 4e-1 |

   (entries: smallest value found of max(window defect, |F(s0)|, X-dependence at s0) for `delta = 0.1`; zeta's own model
   residual is 2e-11 to 2e-10). The crossover moves from below 1 (T = 1e3) to about 1 (1e4), 2 to 3 (1e5), 4 to 8 (1e6):
   it grows like `sqrt(T)/log T`. The binding conditions past the crossover are the window rows themselves: the Jacobian of
   the defect in the phases `theta_p` reaches rank P minus the primes in the cut-off tail (at T = 1e5 the nine primes
   353 .. 401 above 0.87 N), so `chi(p)` is fixed for the other primes.
2. (PROVED, Lemma B) For every fixed m, H and relative tolerance eta there is a height `T_0(m, H, eta)` such that for all
   `T_0 <= T_1 < ... < T_m` an integer `alpha != 0`, `alpha <= ceil(4 pi/eta)^m`, exists with `zeta(s + i alpha)` passing zeta's
   functional equation in all m windows with relative defect at most eta. So no fixed number of windows is rigid with
   constants uniform in T. Measured optimum over translates: `eta_min(m) ~ c 2 pi (H/(T log T))^{1/m}`, `c` in 0.3 to 0.5.
   Translates carry no off-line zero of their own; the zero in item 1 comes from the free primes.
3. (PROVED, Lemma C; CLASSICAL comparison) A window at height T tests the analytic conductor and one phase. The members of
   the Kaczorowski-Perelli degree-one list `L(s + i alpha, chi mod q)` pass one window when `q (T + alpha) = T` (round-2 Lemma 3);
   two windows at heights `T_1 != T_2` force `q = 1` (measured: `L(chi_5)` and DH shifted, residual 1e-3 to 5e-2 at m = 1,
   0.4 to 0.8 at m = 2). Coverage of a whole range `[T_0, T]` forces
   `|alpha| <= pi eta / log(T/T_0)` to leading order. The quantitative converse in the model is `Y = N = 1.6 R sqrt(T/2 pi)` (R = the X-range of the
   test); nothing above N enters the test at heights below T.
4. (MEASURED) Without multiplicativity the same test leaves `2(N-1)` real unknowns; a prescribed zero is feasible for every
   `m <= 16` when the windows lie in `[T/2, T]` (defect 2e-10, `|a(n)| <= 1.4`). When the windows are spread log-uniformly over
   `[100, T]` the non-multiplicative sequences are pinned as well (T = 1e4: the minimum-norm zero witness needs `|a(n)|` up to
   2.6e11 at m = 4). Multiplicativity lowers the crossover by the factor `2N/pi(N)`; it is not what makes the statement true.

Requirement flags: R1 false, R2 false, R3 false, R4 false (section 7).

The assignment's scoring condition for outcome B (rigidity proved with constants uniform in T and false for a
non-multiplicative sequence) is not met on either count: `m*` grows with T (item 1, Lemma B), and bounded non-multiplicative
sequences are pinned too once the windows cover the scales (item 4; exact version: Hamburger).

## 0. Plan (as executed)

Question: does an Euler product with unimodular `chi(p)` exist that passes the functional-equation test in m windows jointly
and has a prescribed off-line zero in one of them? Steps: (1) count conditions against parameters in m; (2) a converse
statement with a range `Y(T, H, eps)`; (3) decisive test for m = 1, 2, 4, 8, 16, T = 1e3 .. 1e5 (extended to 1e6), with
controls DH, `L(s, chi_5)` at `T/5`, U, Liouville.

Against the sources: round 2 (`c2-euler-cone-fe-rigidity`) had one window (unpinned for T >= 1e4, zero witnesses in convex
slices with small primes frozen) and one multi-height run (all dyadic heights, slices only, pinned). New here: all primes
free as phases (the nonconvex problem round 2 did not solve), the dependence on m at fixed T, two window layouts, the
m-window translate lemma with its height threshold, the conductor statement for two windows, and the non-multiplicative
comparison at each m. The rotation lemma of `c2-polydisc-leeyang-bound` enters as the choice of class: unimodular twists are
torus rotations, and the question is whether m window tests break the rotation invariance. They do at fixed T for `m > m*`
and do not uniformly in T.

## 1. Model

`afe.py` (copied unchanged from round 2). For a sequence a and `X > 0`:
`A_X(s)[a] = sum a(n) n^{-s} V_s(n/X) + chi(s) sum conj(a(n)) n^{s-1} W_s(nX)` (smoothed approximate functional equation;
`A_X(s)[1] = zeta(s)` for every X to 1e-11). Defect rows: `A_X(s) - A_1(s)` at `s = 1/2 + it`, 21 points of `[T_j, T_j + 2]`,
X on 25 log-uniform points of `[1/R_j, R_j]`, `R_j = N/(1.6 q_j)`, `q_j = sqrt(T_j/2 pi)`, `N = round(3.2 q(T))`.
Zero block: `F(s0) := A_1(s0)[a]`, `s0 = 1/2 + delta + i(T + 1)`, with its own X-independence rows.

Unknown: `theta_p` real for every prime `p <= N`; `a(n) = exp(i sum_p v_p(n) theta_p)` (completely multiplicative,
unimodular: the class U of the controls; the rotation lemma says every size bound is blind to it). Every point is an exact
finite Euler product; no convex relaxation, no frozen primes.

Layouts (nested in m): `cluster`, `T_j = T (1 - f_j/2)`; `geom`, `T_j = T (100/T)^{f_j}`; `f = 0, 1, 1/2, 1/4, 3/4, 1/8, ...`.
Window 0 is `[T, T+2]` and carries the zero.

Search (`mw.py`): Gauss-Newton/trust-region least squares (`scipy.optimize.least_squares`, analytic Jacobian) on the stacked
defect rows plus the zero block, 23 or 24 starts per case (zeta, the best lattice translates, Gaussian perturbations of zeta of size
0.1, 0.3, 1, uniform random phases, the survivor of m/2). Second pass (`mw2.py`): weight 100 on the zero block, null-space
construction of non-multiplicative witnesses, off-grid residual. `T = 1e6` (`mw_fast.py`): 5 to 6 starts, 150 function
evaluations, `delta = 0.1, 0.4` only.

## 2. First lemma: conditions against parameters

**Lemma A (MEASURED count).** Numerical rank of the defect rows of one window (H = 2, R = 2 to 2.8), on the
non-multiplicative unknowns: 30 to 41 (singular values above 1e-5), 40 to 53 (above 1e-8), independent of T (1e4, 1e5, 1e6
agree). On the phases at zeta: 26 to 39 (1e-5). Ranks add until they reach the number of unknowns:

| T | P | m = 1 | 2 | 4 | 8 | 16 |
|---|---|---|---|---|---|---|
| 1e4 (cluster) | 31 | 26 | 27 | 29 | 29 | 29 |
| 1e5 (cluster) | 79 | 29 | 61 | 66 | 67 | 70 |
| 1e6 (cluster) | 206 | 29 | 67 | 124 | 170 | 177 |
| 1e5, non-multiplicative, of 806 | | 30 | 71 | 137 | 270 | 492 |

(phase-Jacobian rank at zeta, threshold 1e-5). The directions that stay weak are the largest primes (`edge_check.py`, T = 1e5,
m = 16: the 9 singular values below 1e-5 span the phases of the primes 353 .. 401 to weight 0.9999; the column norm of the
Jacobian falls from 2e-3 at p = 317 to 1.5e-9 at p = 401). Their weights are in the cut-off tail of every row, including the
row of `F(s0)`.

Crossover: `m*(T, H) ~ pi(N)/r(H)`, `r(2) ~ 30`, i.e. 1.0, 2.6, 6.9 at T = 1e4, 1e5, 1e6, and about `0.107 q/log(3.2 q)`, `q = sqrt(T/2 pi)`,
in general; round 2 measured `r(20) ~ 35`, so r grows slowly with H and `m* H` is of the order of the Riemann-Siegel length
when the windows are to pin all primes below N. For non-multiplicative sequences the count is `2N/r`: larger by `2 log N`.

Why r does not depend on T (ARGUED): the X-derivative of `A_X(s)` is a pair of short smooth sums over `n ~ qX` and `n ~ q/X`;
a window of length H resolves `H Delta/(2 pi)` frequencies of `log n` over a band of logarithmic width Delta, plus
`O(log(1/eps))` from the smooth cut-off. The count is a time-bandwidth product and does not see `q`.

## 3. Decisive test

### 3.1 Residual against m (first pass, `mw_*.jsonl`; score = max(window defect, |F(s0)|, X-dependence at s0))

Cluster layout, windows in `[T/2, T]`:

| T | m | phase rank (1e-5/1e-8) of P | delta 0.02 | 0.05 | 0.1 | 0.25 | 0.4 | best lattice translate: abs alpha, defect |
|---|---|---|---|---|---|---|---|---|
| 1e3 | 1 | 11/12 of 12 | 5.5e-2 | 1.6e-1 | 6.8e-2 | 3.6e-1 | 2.7e-1 | 1.24: 3.0e-3 |
| 1e3 | 2 | 11/12 | 6.2e-2 | 1.5e-1 | 3.0e-1 | 4.5e-1 | 5.0e-1 | 8.65: 1.3e-1 |
| 1e3 | 4 | 11/12 | 3.6e-1 | 3.6e-1 | 3.7e-1 | 3.7e-1 | 4.3e-1 | 43.6: 3.2e-1 |
| 1e3 | 16 | 11/12 | 4.7e-1 | 4.7e-1 | 4.7e-1 | 4.7e-1 | 5.2e-1 | 1.30: 5.0e-1 |
| 1e4 | 1 | 26/28 of 31 | 4.2e-5 | 3.3e-5 | 7.2e-5 | 8.7e-5 | 5.0e-4 | 0.85: 2.5e-4 |
| 1e4 | 2 | 27/30 | 2.3e-2 | 4.5e-2 | 7.1e-2 | 9.9e-2 | 2.4e-1 | 45.2: 2.4e-2 |
| 1e4 | 4 | 29/30 | 9.1e-2 | 9.1e-2 | 1.0e-1 | 2.1e-1 | 3.2e-1 | 45.2: 3.2e-1 |
| 1e4 | 16 | 29/30 | 2.2e-1 | 2.2e-1 | 2.6e-1 | 3.9e-1 | 5.0e-1 | 0.89: 4.4e-1 |
| 1e5 | 1 | 29/39 of 79 | 1.2e-10 | 1.2e-10 | 1.1e-10 | 1.1e-9 | 1.6e-6 | 8.44: 3.5e-4 |
| 1e5 | 2 | 61/68 | 1.6e-5 | 3.6e-5 | 4.3e-5 | 4.4e-5 | 1.4e-4 | 9.09: 6.4e-3 |
| 1e5 | 4 | 66/73 | 1.3e-2 | 5.6e-3 | 7.7e-3 | 1.9e-2 | 1.6e-1 | 45.4: 1.8e-1 |
| 1e5 | 8 | 67/74 | 1.6e-1 | 2.0e-1 | 9.6e-2 | 5.5e-1 | 5.0e-1 | 0.67: 3.0e-1 |
| 1e5 | 16 | 70/76 | 2.8e-1 | 4.5e-1 | 3.0e-1 | 5.2e-1 | 4.4e-1 | 0.67: 2.9e-1 |
| 1e6 | 1 | 29/39 of 206 | - | - | 1.1e-9 | - | 8.2e-5 | 31.0: 6.6e-5 |
| 1e6 | 2 | 67/90 | - | - | 3.7e-9 | - | 2.8e-6 | 36.2: 1.4e-2 |
| 1e6 | 4 | 124/164 | - | - | 5.7e-5; refined 6.6e-7 | - | 2.0e-4 | 0.54: 2.4e-1 |
| 1e6 | 8 | 170/186 | - | - | 2.6e-3; refined 2.2e-3 | - | 9.5e-2 | 0.54: 2.6e-1 |
| 1e6 | 16 | 177/194 | - | - | 3.7e-1 | - | 6.1e-1 | 0.54: 3.3e-1 |

Geometric layout, windows log-uniform in `[100, T]` (m = 1 is the same window):

| T | m = 2 | 4 | 8 | 16 | (delta = 0.1) |
|---|---|---|---|---|---|
| 1e3 | 3.2e-1 | 6.4e-1 | 1.1 | 1.2 | |
| 1e4 | 2.5e-1 | 2.6e-1 | 2.6e-1 | 2.6e-1 | |
| 1e5 | 9.9e-2 | 3.0e-1 | 7.2e-1 | 1.3 | |

Refinement (`mw_refine.py`, restart from the saved point with a larger evaluation budget): T = 1e6, m = 4: max defect 6.6e-7
with `|F(s0)|` = 1.7e-9 after 8000 evaluations, still decreasing; T = 1e6, m = 8: stalls at 2.2e-3; T = 1e5, m = 2: stalls at
1.9e-5; T = 1e5, m = 4: stalls at 6.8e-3.

A window at height 100 (m = 2) already removes the witness at T = 1e5: its X-range is `R = 63`, so it reads all `n <= N`.

### 3.2 Largest off-line displacement that stays feasible (tolerance 1e-5; cluster)

| T | m = 1 | m = 2 | m = 4 | m >= 8 |
|---|---|---|---|---|
| 1e3 | none | none | none | none |
| 1e4 | none at 1e-5 (0.25 at 1e-4) | none | none | none |
| 1e5 | 0.4 (all tested) | none at 1e-5 (0.1 at 1.9e-5 after refinement; 0.25 at 5e-5) | none (7e-3 level) | none |
| 1e6 (delta = 0.1, 0.4 only) | 0.4 at 1e-4; 0.1 at 1e-9 | 0.4 | 0.1 (7e-7 after refinement); 0.4 at 2e-4, not refined | none (2e-3 level at m = 8) |

Well past the crossover (m >= 8 at T <= 1e5, m = 16 at 1e6) the smallest score is 0.1 to 0.5, against `|zeta(s0)|` = 0.22 to 1.5. At T = 1e4, m >= 8, the scores
(0.22, 0.22, 0.26, 0.39, 0.50) equal `|zeta(s0)|` at the five values of delta to two digits: the search returns zeta itself and
the cost of the zero is the value of zeta at `s0`. This is the same reading as round 2, section 5.5: the
pinned statement is "F equals zeta in the window", and it excludes a zero of F only where zeta is not small.

### 3.3 Second pass (`mw2_*.jsonl`): zero enforced with weight 100; non-multiplicative witnesses; off-grid

`T = 1e5`, cluster, `delta = 0.1`:

| m | unimodular: max defect at abs F(s0) | off the design grid | non-multiplicative: max defect, max abs a(n), free dimension left |
|---|---|---|---|
| 1 | 1.0e-9 at 7e-16 | 3.9e-9 | 2.0e-10, 1.12, 763 of 806 |
| 2 | 7.1e-5 at 7e-8 | 2.8e-4 | 2.0e-10, 1.12, 707 |
| 4 | 9.1e-3 at 8e-6 | 1.0e-2 | 2.0e-10, 1.12, 614 |
| 8 | 8.1e-2 at 1e-3 | | 2.1e-10, 1.13, 422 |
| 16 | 1.9e-1 at 2e-2 | | 2.6e-10, 1.17, 213 |

Non-multiplicative witness: `a = 1 + (null vector of the defect rows, singular values below 1e-9)`, minimum-norm solution of
the zero block. In the cluster layout it exists for every `m <= 16` at T = 1e4 and 1e5 with `|a(n)| <= 1.4` (not inside the unit
disk; the box-constrained problem was not solved). In the geometric layout: T = 1e5, `max |a(n)|` = 1.7, 2.8, 4.0e4, 3.5e10
at m = 2, 4, 8, 16; T = 1e4: 3.8, 2.6e11, 6.5e13, 9.3e11. T = 1e3, cluster, m = 16: one free dimension left and no zero
(`|F| = 0.41`). So bounded non-multiplicative sequences are pinned by enough windows spread over the scales; the count is
larger, the phenomenon is the same.

### 3.4 Ball-arithmetic re-evaluation of survivors (`arbcheck.py`, `arbcheck.jsonl`; acb, 160 bits)

The sums defining `A_X(s)[a]` were recomputed with the phases `theta_p` taken as exact float64 numbers, at two points of
each window off the design grid, five X values, and at `s0`. Ball radii below 1e-39.

| survivor | max defect (upper bound of the ball) | abs F(s0) | X-dependence at s0 |
|---|---|---|---|
| T = 1e4, m = 1, delta = 0.1 | 6.1e-5 | 2.1e-6 | 2.6e-5 |
| T = 1e5, m = 1, delta = 0.1 | 5.2e-10 | 1.4e-10 | 6.0e-11 |
| same, quadrature step halved | 5.2e-10 | 1.4e-10 | 6.0e-11 |
| T = 1e5, m = 2, delta = 0.1 | 4.4e-5 | 7.1e-8 | 4.4e-6 |
| T = 1e5, m = 4, delta = 0.1 | 6.5e-3 | 7.5e-6 | 1.2e-4 |

The float64 value `|F(s0)| = 7e-16` for the T = 1e5, m = 1 survivor is 1.4e-10 in ball arithmetic: the float64 weights are
accurate to about 1e-10, and that is the floor of every float64 number in this note. The balls enclose the trapezoid sums;
the quadrature and truncation errors of the weight integrals are not enclosed (halving the step changes the eighth digit).
The T = 1e5, m = 1 witness is an exact unimodular Euler product over the 79 primes below 404 whose model function has a zero
at `0.6 + 100001 i` and window defect 5e-10, about twice zeta's own model residual.

## 4. Lemma B: translates in m windows

Exact identity (PROVED): for real alpha and `s = 1/2 + it`, with `F_alpha(s) = zeta(s + i alpha)`,
`F_alpha(s) - chi(s) conj(F_alpha(1 - conj s)) = zeta(s + i alpha) (1 - e^{i Psi(t, alpha)})`,
`Psi(t, alpha) = 2 theta(t + alpha) - 2 theta(t)` (theta the Riemann-Siegel theta function). The relative defect is
`2 |sin(Psi/2)|`.

**Lemma B (PROVED; uses `2 theta'(x) = log(x/2 pi) + O(x^{-2})`, CLASSICAL).** Let `m >= 1`, `H > 0`, `0 < eta <= 1`,
`Q = ceil(4 pi/eta)`, and `2 pi e <= T_1 < ... < T_m` with `T_1 >= (2.1/eta) Q^m (H + Q^m)`. Then there is an integer alpha,
`1 <= alpha <= Q^m`, with `2 |sin(Psi(t, alpha)/2)| <= eta` for every t in the union of the windows `[T_j, T_j + H]`.

Proof. Dirichlet's simultaneous approximation theorem for `lambda_j = log(T_j/2 pi)/(2 pi)` gives an integer
`1 <= alpha <= Q^m` with `dist(alpha lambda_j, Z) <= 1/Q` for all j. `Psi(t, alpha) = int_t^{t+alpha} 2 theta'(x) dx
= alpha log(T_j/2 pi) + int_t^{t+alpha} log(x/T_j) dx + O(alpha/T_j^2)`, and for t in the j-th window
`0 <= log(x/T_j) <= (H + alpha)/T_j`. Hence `dist(Psi, 2 pi Z) <= 2 pi/Q + alpha (H + alpha)/T_1 + O(alpha/T_1^2)
<= eta/2 + eta/2.1 + o(eta)`, and `2 |sin(x/2)| <= |x|`. QED.

Consequences.
- For fixed m, H, eta the unimodular Euler product `n^{-i alpha}` (a torus rotation of zeta in the sense of the rotation
  lemma) passes all m windows at every height above `T_0(m, H, eta)`. `|F_alpha(s0) - zeta(s0)|` is of order 1. A rigidity
  statement "defect at most eta in m windows implies chi(p) = 1 for p <= Y" with m and eta independent of T is false.
  It can hold only with `alpha` left free: "chi(p) = p^{-i alpha}".
- Measured optimum (`translate_mw.py`, exact phase with `mpmath.siegeltheta` at 50 digits, heights `T_1 x (1, 1.37, 1.93,
  2.71, 3.59, 4.83)`, H = 2, scan of the lattice of window 1 up to 4e6 points):

  | T_1 | m = 1 | 2 | 3 | 4 | 5 | 6 |
  |---|---|---|---|---|---|---|
  | 1e5 | 6.5e-6 | 3.5e-3 | 3.8e-2 | 1.1e-1 | 1.9e-1 | 4.2e-1 |
  | 1e7 | 4.4e-8 | 3.9e-4 | 7.2e-3 | 2.6e-2 | 8.2e-2 | 1.7e-1 |
  | 1e9 | 3.3e-10 | 2.2e-5 | 2.6e-3 | 2.5e-2 | 5.2e-2 | 1.1e-1 |
  | 1e11 (scan-limited from m = 3) | 2.7e-12 | 7.1e-7 | 9.2e-4 | 9.1e-3 | 5.6e-2 | 1.1e-1 |
  | `2 pi (H/(T log(T/2 pi)))^{1/m}` at 1e7 | 8.8e-8 | 7.4e-4 | 1.5e-2 | 6.8e-2 | 1.7e-1 | 3.1e-1 |

  The heuristic (the range `|alpha| <~ eta T/H` holds `eta T log T/(2 pi H)` lattice points of window 1, each passing the
  other `m - 1` windows with probability `eta/pi`) fits within a factor 3 where the scan is not range-limited:
  `m_translate*(T, H, eta) ~ log(T log T/H)/log(2 pi/eta)`. At eta = 1e-5 this is 1 at T = 1e5 and 2 at T = 1e11; the
  translate family is a weak adversary at the heights of the test, and the measured crossover of section 3 is set by the
  free primes, not by the translates. Lemma B's threshold (`T_1 >= eta^{-2m-1}` up to constants) is far from the heuristic one
  (`eta^{-m}`); only the existence statement is used.

## 5. Second lemma: the converse statement and its range Y

**Lemma C (PROVED, elementary).**
(a) Range coverage. Suppose `2 |sin(Psi(t, alpha)/2)| <= eta < 1` for every t in `[T_0, T]`, `|alpha| <= T_0/2`. Then
`dist(Psi(t, alpha), 2 pi Z) <= 2 arcsin(eta/2) <= pi eta/2 < pi/2`; `Psi(., alpha)` is continuous in t, so it stays near one
multiple of `2 pi`, and `|Psi(T, alpha) - Psi(T_0, alpha)| <= pi eta`. Since `Psi(T, alpha) - Psi(T_0, alpha) = alpha log(T/T_0) + O(alpha^2/T_0)`,
coverage of every height in `[T_0, T]` leaves only the translates with `|alpha| <= pi eta / log(T/T_0)` (leading order).
(b) Conductor. For `F(s) = L(s + i alpha, chi)`, chi primitive mod q, the phase of the functional equation at height t has
t-derivative `log(q (t + alpha)/2 pi)` (CLASSICAL). Matching zeta's derivative `log(t/2 pi)` at two heights `T_1 < T_2` requires
`q (T_j + alpha) = T_j` for j = 1, 2, i.e. `alpha = -T_j (1 - 1/q)` for both, so `q = 1`. With `q > 1` and alpha matched at `T_1`,
the mismatch of the derivative at `T_2` is `log(1 + (q-1)(1 - T_1/T_2))`, and by the argument of (a) the phase cannot stay
within the tolerance across the second window when `H log(1 + (q-1)(1 - T_1/T_2)) > pi eta`. Other shifts alpha (not matched
at `T_1`) fail in the first window for the same reason.

**Y in the model (PROVED for the upper bound, MEASURED for attainment).** The defect rows of a window at height `T_j` with
X in `[1/R, R]` have coefficients of `a(n)` that decay like the cut-off weights beyond `n = 1.6 R q_j`; nothing above
`N = 1.6 R sqrt(T/2 pi)` enters any test at heights up to T. So `Y(T, H, eps) <= 1.6 R sqrt(T/2 pi) (1 + o(1))`, and the
measured rank saturates at P minus 3 to 9 edge primes (rank 70 to 77 of 79 at T = 1e5, m = 16). A test with `R = 2`
therefore gives: defect at most eps in `m >= m*` windows spread over `[T_0, T]` implies `chi(p) = p^{-i alpha}(1 + O(kappa eps))`
for `p <= Y ~ 3 sqrt(T/2 pi)`, `|alpha| <~ eps/log(T/T_0)` (taking the defect relative to the size of zeta in the window), with `kappa = kappa(T)` the inverse of the smallest relevant singular
value (round 2 measured `kappa` = 2, 4.4, 15 at T = 1e3, 1e4, 1e5 on dyadic heights; here the three smallest singular values of the phase Jacobian at m = 16, cluster, are 7e-5, 8e-6, 3e-9 at T = 1e4 and
7e-9, 1e-9, 5e-11 at T = 1e5, because of the edge primes, so `kappa` is finite only after removing them). This
statement is MEASURED, not proved, and its constants grow with T.

**Comparison.**
- Hamburger (CLASSICAL): exact functional equation at all heights plus an ordinary Dirichlet series gives `F = zeta`. No
  multiplicativity. The finite-model analogue is the pinning of bounded non-multiplicative sequences by windows spread over
  the scales (section 3.3, geometric layout; round 2, section 5.5, "relaxed" column).
- Kaczorowski-Perelli (CLASSICAL): the degree-one elements of the Selberg class are zeta and `L(s + i alpha, chi)`; of the
  extended class, linear combinations with a common conductor, parity and shift (DH is one). The window test is the local
  form of that classification: one window fixes neither q nor alpha (any pair with `q(T + alpha) = T` passes, and DH passes
  exactly as `L(chi_5)` does); two windows at different heights fix `q = 1` (Lemma C(b)); m windows fix alpha up to the
  Dirichlet translates of Lemma B; coverage of a range fixes alpha to `O(eta/log(T/T_0))` (Lemma C(a)). The Euler product is
  used nowhere in this chain: DH is removed by its conductor at m = 2, at the same step and with the same residual as
  `L(chi_5)`.
- What multiplicativity adds in the finite model: `pi(N)` unknowns instead of `2(N-1)`, hence a crossover lower by
  `2 log N`. No step is false for non-multiplicative sequences once the number of windows is raised by that factor.

## 6. Controls (`mw_*.jsonl`, field `controls`; max window defect, sup norm, zeta = 2e-11 to 2e-10)

| Control | m = 1 | m = 2 | m >= 4 | step at which it fails |
|---|---|---|---|---|
| U: lattice translate `n^{-i alpha}` (best, abs alpha <= 60) | 3e-3, 2.5e-4, 3.5e-4, 6.6e-5 (T = 1e3 .. 1e6) | 1.3e-1, 2.4e-2, 6.4e-3, 1.4e-2 | 0.2 to 0.5 | none uniformly in T (Lemma B); at these heights the phase conditions of m >= 2 windows |
| U: random unimodular twist | 0.8 to 1.1 | 1.4 to 2.3 | 1.6 to 6 | fails every window; the search of section 3 is the test of whether some U passes |
| U with a prescribed off-line zero (section 3) | passes for T >= 1e5 | passes for T = 1e6, marginal at 1e5 | fails beyond `m* ~ pi(N)/30` | parameter count |
| DH (period-5 coefficients), unshifted | 0.4 to 0.7 | 0.7 to 1.5 | 1 to 3.4 | conductor |
| DH shifted by `alpha = -0.8 T_c + delta` | 4.5e-2, 5.9e-3, 2.8e-3, 1.2e-3 | 0.44, 0.78, 0.50, 0.70 | 0.6 to 2.1 | conductor mismatch at the second height (Lemma C(b)); not the Euler product |
| `L(s + i alpha, chi_5)` at `T/5` | 4.7e-2, 5.9e-3, 1.2e-3, 4.6e-3 | 0.53, 0.82, 0.80, 0.54 | 0.7 to 2.5 | same step as DH |
| Liouville `lambda(n)` | 0.60 to 0.87 | 0.8 to 1.8 | 1.2 to 3.8 | fails the one-window test: `zeta(2s)/zeta(s)` has a different gamma factor; an identity-level exclusion |
| non-multiplicative bounded sequence with prescribed zero | passes | passes | passes to m = 16 (cluster); fails from m = 4 to 8 (geometric) | parameter count `2N/r` |

Not formulable in this model (no ordinary Dirichlet series with these coefficients, as in round 2): backward heat,
`zeta(s+a) zeta(s-a)` (degree 2; fails the gamma factor), T-NR, Beurling, phase-rotated transfer operator, theta^w.

Reading for R3: DH and `L(chi_5)` behave identically at every m; the step that removes them is the conductor, which is in the
functional equation and not in the Euler product. The unimodular twist is not removed uniformly in T.

## 7. Requirement flags

- **R1 (multiplicativity essential): false.** Multiplicativity enters as a count: P real phases against `2(N-1)` real
  coefficients, which moves the crossover from `2N/r` to `pi(N)/r`. The pinned statement holds for bounded non-multiplicative
  sequences with more windows (section 3.3), and its exact form is Hamburger's theorem. DH is removed by the conductor.
- **R2 (height-uniform, every window): false.** `m*` grows like `sqrt(T)/log T` (measured at four heights) and, for the
  translate family alone, at least like `log T/log(1/eta)` (Lemma B, proved). Past the crossover the conclusion is "F = zeta
  on the window to `kappa(T) eps`", which excludes a zero only where zeta is not small.
- **R3 (every control fails at a named structural step): false.** The translate (U) passes any fixed number of windows at
  large height. DH fails only by conductor mismatch at m >= 2, and passes m = 1 after a shift.
- **R4 (reaches the critical line): false.** Finite-stage objects only; nothing is derived for zeta.

## 8. Three weakest steps

1. **"Infeasible" is the failure of a local search, not a certificate.** The problem in the phases is nonconvex; 23 or 24 starts
   (6 at T = 1e6, with 150 evaluations) were used, and the score mixes defect and `|F(s0)|` with a fixed weight. The entry
   T = 1e6, m = 4 moved from 6e-5 to 7e-7 when the evaluation budget was raised, so entries near the crossover (T = 1e5, m = 2;
   T = 1e6, m = 8) may be search-limited as well. The crossover values are therefore brackets (between the last m with a witness and the first m with
   rank P), and the law `m* ~ pi(N)/30` rests on four heights.
2. **The model is one truncation, and r is a property of it.** `r ~ 30` depends on the X-range (`R = 2` at the top window), on
   the smoothing (`beta = 0.003`) and on the tolerance; `Y = 1.6 R sqrt(T/2 pi)` is the reach of the test, not a theorem about
   Dirichlet series. Witnesses are finite Euler products (79 or 206 primes), not functions with a functional equation; a
   unimodular twist with all primes has in general no continuation to the line, so the question has no model-free form.
   The ball-arithmetic check encloses the sums, not the quadrature of the weights.
3. **Lemma B and Lemma C are leading-order in the Stirling remainder, and Lemma B's threshold is not sharp.** The error
   `O(alpha/T^2)` of `2 theta'` is quoted, not bounded with a constant; the threshold `T_1 >= (2.1/eta) Q^m (H + Q^m)` is
   quadratic in `Q^m` where the heuristic and the scan indicate `Q^m`; the table for `T_1 >= 1e11` is limited by the scan
   range (4e6 lattice points) and overstates `eta_min`. Lemma C(b) leaves the lattice coincidences to a count. The
   non-multiplicative witnesses have `|a(n)|` up to 1.4, outside the unit disk; the box-constrained problem was not solved.

## 9. Record for the filter

- A stronger form of the unimodular-twist control: `n^{-i alpha}` passes the functional-equation test in any fixed number m of
  windows of fixed length at all sufficiently large heights (Lemma B). A window argument must use a number of windows, or a
  total window length, that grows with T; at the growth rate where the test becomes rigid in the finite model
  (`m H ~ sqrt(T)/log T` conditions) it has the size of a Riemann-Siegel evaluation.
- Window tests read (analytic conductor, phase) and at most `r(H, eps)` further real numbers per window; they never read the
  Euler product. DH and `L(chi_5)` are indistinguishable to them at every m.
- No pivot was made: the adjacent idea (a window count growing with T together with multiplicativity) is the pinned regime
  of section 3, whose conclusion is the identity of F with zeta on the window (verified-height type).

## 10. Files

`mw.py` (model, first pass), `mw_fast.py` (reduced start set, server), `mw2.py` (second pass), `mw_refine.py`,
`edge_check.py`, `arbcheck.py`,
`translate_mw.py`, `afe.py` (round 2, unchanged); `mw_<layout>_T<T>.jsonl`, `mw2_<layout>_T<T>.jsonl`, `arbcheck.jsonl`,
`translate_mw.json`, `server_T1e6/` (server outputs and logs), `log_*.txt`, `log2_*.txt`, `surv_*.npy` and `hard_*.npy`
(phase vectors of the best points). Run log: local runs under `scripts/memcap.sh 8`, planned allocations printed (largest
330 MB), none killed; server units `rh-c3mw-1e6-1118094457` (stopped by me after 9 minutes, replaced) and
`rh-c3mw-1e6f-1118095402` (cluster layout completed; stopped by me during the geometric layout, which was not run at T = 1e6)
and `rh-c3mw-refine-1118102505` (completed); all 4 cores, 8 GB; no unit left running.
