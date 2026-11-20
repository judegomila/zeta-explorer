# PREREG: c21-br2-relative-product-pole-lattice-census-server

Written 2026-11-20 before any run of this lane (no code of the lane had been executed; the server had only
been queried with rhstatus).

## Object
R_S(s) = prod over p in S of (1 - p^(1/2-s))/(1 - p^-s); G = zeta/R_S (local parameter alpha_p = p^(1/2)
on S, 1 elsewhere). Statistic on m = G/zeta = 1/R_S: y(delta, t) = log abs(1/R_S(1/2 + delta + it)).
python-flint (Arb) ball arithmetic, precision 192 bits for rows reaching j = 40, 128 bits otherwise.

## Sets
log q_k = nearest prime to exp(f(k)):
- S1: f(k) = e^(k/2), k >= 0;  S2: f(k) = k^3;  S3: f(k) = k^2;  S4: f(k) = k^1.5 (k >= 1).
- Added row S0: f(k) = e^k (lacunary ratio e > 2; the elementary bound in "Pre-run analysis" applies).
Representation of log q: for f(k) <= 1500 the nearest prime is searched (proved prime up to 400 bits,
BPSW probable prime above; composite verdicts are certain, so only the primality of the selected number is
probabilistic above 400 bits) and log q is its Arb logarithm. For f(k) > 1500 the ball
log q in f(k) +- 0.08/f(k)^2 is used (Dusart 2010: a prime in [x, x(1 + 1/(25 log^2 x))] for x >= 396738;
RECALLED, not opened). Duplicated primes are dropped and reported.
Truncation: at delta = 2^-j the primes with delta f(k) <= 90 are multiplied; all others enter an enclosed
tail bound 2.04 e^(-delta f(K_j)) (1 + 1/(delta f'(K_j))) (each neglected factor has
abs(log abs(1 - r e^(i theta))) <= 2r, r = q^-delta <= e^-90; f convex increasing), plus 1e-35 for the
numerators 1 - q^-s with log q > 200. The bound is added to the radius of every y.
j ranges (feasibility: the number of factor evaluations per point is about sum_j N_S(90 2^j)):
S0, S1, S2: j = 4..40 (K = 33, 65, about 46000). S3: j = 4..30 (K about 3.1e5). S4: j = 4..24
(K about 1.3e6). The ranges for S3 and S4 are the largest feasible within the lane budget; stated as a limit.

## Statistic
beta_OLS = least-squares slope of y against log(1/delta) over the row's j range (a linear form in the y
balls, evaluated in Arb); beta_sec = secant slope between the two ends; beta_lo, beta_hi = OLS slopes on the
lower and upper half of the j range. Points:
(a) pole points t = 2 pi k / log p, p the first five primes of S and the three largest exactly searched
    primes, k in {0, 1, 2, 3, 5, 8, 13, 21} (t = 0 once); the factor of p itself is evaluated with cos = 1;
(b) 10^4 generic t = 1000 m / 2^53, m from random.Random(20261120).getrandbits(53) (exact dyadic);
(c) zeta zero ordinates below 1000 (649; mpmath zetazero at 30 digits, taken as balls of radius 1e-25;
    not interval-certified zeros).
A point is "beta > 0" when the lower end of beta_OLS is > 0, "beta <= 0" when the upper end is <= 0.

## Predictions
Assigned: (a) beta > 0 at the pole points for the two sparsest sets (S1, S2); (b), (c) record only.
Threshold: a set with beta <= 0 at every tested point within enclosure is reported as a twin candidate
subclass.

## Pre-run analysis (written before the run; to be tested by it)
P0 (claimed PROVED, elementary). At t = 0 every factor of 1/R_S is real and > 1 for delta > 0, and for any
M primes of S: 1/R_S(1/2 + delta) >= prod over those M of 1/(1 - q^-delta) >= c_M delta^-M. So
R_S(1/2 + delta) = O_M(delta^M) for every M when S is infinite. A function meromorphic at s = 1/2 and not
identically 0 decays at most like a fixed power. Hence R_S, and G = zeta/R_S (zeta(1/2) != 0), is not
meromorphic at s = 1/2 for any infinite S on which the product converges in Re s > 1/2. Consequence if it
holds: no member of this exact family (alpha_p = +p^(1/2) on an infinite S) is a twin, and no set can meet the
threshold (t = 0 is a tested point with y growing faster than any multiple of log(1/delta)). Test in the run:
y(delta, 0) against sum over log q <= 1/delta of log(1/(delta log q)).
P1 (claimed PROVED). At a pole point of p, y >= log(1/(delta log p)) - sum over q != p of log(1 + q^-delta)
- C. If log q_(k+1)/log q_k >= lambda > 2 eventually, the sum is <= (log 2/log lambda) log(1/delta) + C, so
y -> +infinity (exponent >= 1 - log 2/log lambda > 0) at every pole point; pole points are dense; R_S -> 0
radially on a dense set; the line is a natural boundary. Applies to S0 (lambda = e), not to S1
(lambda = e^(1/2) < 2, exponent bound 1 - 1.386 < 0), not to S2..S4.
P2 (expectation, heuristic). For t not a common pole, y = sum over log q < 1/delta of
-log abs(2 sin(t log q / 2)) + O(1) terms; the summand has mean 0 and variance pi^2/12 for equidistributed
phases. S1: N(1/delta) = 2 log(1/delta) terms, fluctuation about 0.9 sqrt(2 log(1/delta)) << log(1/delta):
expect beta near 1 at pole points (t != 0) and beta_OLS near 0 with spread at generic t. S2: N = delta^(-1/3)
(about 1e4 at j = 40), fluctuation about 90 against log(1/delta) = 27.7: expect the sign of beta at pole
points t != 0 to be mixed, so the assigned prediction (a) is expected to FAIL for S2 at part of the pole
points with t != 0. S3, S4: the same with larger fluctuation.

## Controls (same statistic on m = G/zeta, same points unless stated)
- DEL on S1 and S2: m = prod over S of (1 - p^-s) (absolutely convergent on the line). Expect beta = 0.
- THIN on S1 and S2: m = prod over S of (1 - p^-s)/(1 + p^-s). Expect beta = 0.
- HQ1 (single prime, as the assignment words it): S = {3} and S = {q_6 of S1}, same local factor; expect
  beta = 1 at its pole points, 0 elsewhere. Also the map's HQ1 factor 1 + eps u/(1 - u)^2, u = 3^(1/2-s),
  eps = 1: expect beta = 2 at pole points.
- RAND: log q_k = nearest prime to exp(f(k + U_k)), U_k uniform on [0, 1) from random.Random(seed):
  S1 with seeds 1, 2 (10^4 generic t); S2, S3, S4 with seed 1 (first 2000 generic t).
- Added row MINUS on S1: alpha_p = -p^(1/2) (factor (1 - p^-s)/(1 + p^(1/2-s))); at t = 0 expect
  y about -(2 log 2) log(1/delta) with a log-periodic term (not of the form n log(1/delta) + c + o(1) with
  integer n unless the oscillation vanishes).

## Fallback stated in advance
If a row cannot finish within the lane budget (16 cores, 6 hours in total), its generic part is cut to the
first n seeded points in order and n is reported. float64 or GPU output is not used for any reported number.

## Referee
REFEREE.md: rerun of three cells (one pole point of S1, one generic point of S2, one zero ordinate of S1)
with a second implementation (mpmath, direct complex product, no shared code).
