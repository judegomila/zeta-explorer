# PREREG: c22-br2-dense-census-cyc-nwm-server

Written 2026-11-20 before any run of this lane (no code of the lane executed; the server had only been
queried with rhstatus). Heavy compute lane; supports `c22-br2-dense-remainder-integer-quantization`.
No score is possible. Nothing here concerns zeros of zeta.

## Object
N_1(z) = prod over k of (1 - e^(i theta_k - lambda_k z)), z = delta + it, lambda_k = log q_k: the denominator of
R_S(1/2 + z) = prod (1 - alpha_q q^-s)/(1 - q^-s), abs(alpha_q) = q^(1/2), alpha_q = q^(1/2) e^(i theta_q).
Statistic 1 is taken on y(delta, t) = -log abs(N_1(delta + it)). The other factor prod (1 - q^(-1/2 - z)) of
1/R_S is analytic and zero-free in Re z > -1/2 for every set here (sum over S of q^(-sigma) finite for
sigma > 0); it adds a bounded smooth term and no slope, and is left out (deviation from the wording
"log abs(1/R_S)", stated in advance).

## Sets (dense remainder: sum over S of 1/log q infinite)
x_k = k (smooth rows) or k + U_k, U_k uniform on [0,1) from a splitmix64 hash of (k, seed) (RAND rows; the same hash gives the random phases).
- D1: f(x) = x (N_S(x) about log x); D2: f(x) = x^(1/2) ((log x)^2); D4: f(x) = x^(1/4) ((log x)^4);
  DE: f(x) = (log(x+1))^2 (exp(sqrt(log x))).
- lambda_k: for f(x_k) <= 30, log of the nearest prime to exp(f(x_k)) (searched; duplicates dropped);
  for f(x_k) > 30 the IEEE double f(x_k) itself. This is a MODEL of "nearest prime to exp(f)": the true
  prime differs by about f e^(-f) < 3e-12 in the logarithm (heuristic size; the proved bound is much
  weaker). Every number reported for a dense row is a statement about the model sequence of doubles, not
  about a certified set of primes. Consequence stated in advance: the smooth rows carry the exact rational
  relations of f (D1: lambda_k = k for k > 30, so N_1 is Euler's product prod (1 - e^(-kz)) up to 30
  factors); the RAND rows are the generic members of each counting class.
- Phases: + (theta = 0), alternating (theta_k = pi k), random uniform (seeds 1, 2, 3).
- Rows: D1, D2 smooth with all five phase choices; D1-RAND seeds 1, 2, 3 with + and random(1);
  D2-RAND seed 1 with + and random(1); D4, DE smooth and RAND(1) with + and random(1).

## Feasibility limits (stated before the run)
Truncation: all k with delta lambda_k <= 32 (neglected factors: sum of 2 e^(-delta lambda) <= 2 e^(-32)
int e^(-delta(lambda - L)) dN; < 1e-5 in every row). Factor count K_j: D1 32*2^j; D2 (32*2^j)^2;
D4 (32*2^j)^4; DE exp(sqrt(32*2^j)).
- D1 and all sparse controls: j = 4..18, 2000 heights; slope window j = 8..18 (three decades).
- D2: j = 0..10 (K = 1.07e9 at j = 10), 400 heights; slope window j = 0..10. The window starts at delta = 1;
  this is the largest range that fits; the threshold test on D2 is weak and is reported as such.
- D4: j = -1..2; DE: j = 0..3; 200 heights. Three decades are NOT reachable: these two classes cannot be
  tested against the threshold; only y and its spread are recorded.
Heights (seeded, doubles taken as exact): 20% pole points t = (2 pi m + theta_k)/lambda_k (k among the first
ten and ten later lambda, m = 1..n/100, n the number of heights); 60% generic uniform in [0.5, 100]; 20%
resonance-constructed (anchor k0, t <= 200 a pole point of k0 chosen to maximise
sum over k <= 60 of -log dist(t lambda_k - theta_k, 2 pi Z); top 10 per anchor).

## Statistic 1
beta(t) = least-squares slope of y against log(1/delta) on the 11 smallest delta of the row (three decades).
PASS-1 for a row: at least 99% of its heights have abs(beta - round(beta)) <= 0.02.
Deviation from the assignment's "all slopes", decided in advance: a function meromorphic near the line
with poles at spacing D on it has slope between 0 and 1 at heights within about 2.5 delta_max of a pole
(fraction about 5 delta_max/D); for CYC (D = 2 pi/log 3 = 5.72, delta_max = 2^-8) that is 0.34%. With "all"
the positive control would be void by construction, so the cut is 99%.

## Statistic 2
Window T(y) = b((y - y_c)/h), y_c = 5.5, h = 1.5, b the 4-fold B-spline on [-1, 1] with integral 1:
T^(xi) = h e^(i xi y_c) (sin(h xi/4)/(h xi/4))^4. I(omega) = sum over k, n >= 1 of lambda_k e^(i n theta_k)
T^(omega - n lambda_k), kernel cut at abs(xi) <= 100; M(V) = int over [V, 2V] of abs(I)^2 d omega, V = 2^m.
Float64 screen (spikes deposited on a grid of step 1/32 with linear weights, FFT convolution), then Arb
evaluation of I(omega) at the grid maximum and at one seeded omega of the top octave.
V range: 2^7..2^20 for D1 and the sparse rows; 2^5..2^13 for D2; 2^3..2^6 for D4; 2^3..2^7 for DE (spike
counts 4 V^2, 10.7 V^4, exp(sqrt(2V))-type; the upper ends are the feasibility limits).
e = least-squares slope of log M against log V on the upper half of the row's V range.
PASS-2: e <= 1.1 (M = O(V)). Expected for unrelated lattices (diagonal only): M about h V sum over
lambda_k <= 2V of lambda_k, so e = 3 for D1, 4 for D2.
Twin candidate = PASS-1 and PASS-2.

## Positive control and other rows
- CYC: lambda_k = 2^k log 3 (k >= 0), theta = pi: N_1 = prod (1 + w^(2^k)) = 1/(1 - w),
  w = e^(-z log 3). Must be flagged (expected: beta = -1 at t = 2 pi m/log 3, 0 elsewhere; I(omega) bounded,
  e = 1). If CYC is not flagged the statistic is void.
- ETA (code check, added): lambda_k = k exactly, theta = 0. CLASSICAL (eta transformation): at t = 2 pi a/b,
  y = pi^2/(6 b^2 delta) - (1/2) log(2 pi/(b delta)) + o(1). To be compared at b = 1, 2, 3, 5.
  Its heights include t = 2 pi m/log 3, m = 1..40 (class 3), in place of 40 generic ones (also in CYCP, CYCeps).
- CYCP (added): lambda_k = log of the nearest prime to 3^(2^k) for k <= 5 (exact search), 2^k log 3 as a double
  beyond. Prediction written now: this row is flagged exactly like CYC, although the set is covered by
  Theorem W of the round-21 sparse lane (natural boundary, if that theorem holds): the perturbation moves
  the pole lattices by about e^(-lambda_k). So a flag is a statement at the resolution delta >= 2^-18 only, and a
  flagged row is a construction target, never evidence of a twin.
- CYCeps (transition, part 1): lambda_k = 2^k log 3 (1 + eps u_k), u_k uniform on [-1, 1] (seed 1), theta = pi,
  eps in {1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-4, 1e-2}. Expected transition where t eps/delta_min is about 0.02,
  i.e. between eps = 1e-9 and 1e-7.
- INJ-J (transition, part 2; "q replaced by powers of fewer primes"): D1-RAND(1) with each lambda_k replaced
  by the nearest element of {m log p: p among the first J primes, m >= 1} (duplicates dropped), J in {1, 2, 4, 16, 64};
  phases +, alternating, random(1). Expected: not flagged for any J (rational dependence alone does not
  give cancellation; CYC needs the doubling relation and theta = pi together).
- DEL: m = prod over S of (1 - q^-s) on D1 and D2 (y = sum log abs(1 - e^(-lambda/2) e^(-lambda z))); THIN:
  prod (1 - q^-s)/(1 + q^-s). Analytic near the line: expected beta = 0, stat 2 with weights
  lambda_k e^(-n lambda_k/2) (and the THIN analogue) bounded: flagged as "analytic near the line" (true positive).
- HQ1: single prime q = 3, factor 1/(1 - 3^(-z)): beta = 1 at pole points, 0 elsewhere, e = 1; and the
  map's HQ1 factor 1 + u/(1 - u)^2, u = 3^(-z): beta = 2 at pole points (statistic 1 only).
- NWM: m = 1 + R(s), R(s) = g(z) + g(-z), g(z) = int_0^inf e^(z r) r^(-r) dr, z = -4i(s - 1/2) (kappa = 4);
  entire, > 1 on the line. 200 heights in [0, 1.2], mpmath quadrature at 30 digits (not an enclosure).
  Expected beta = 0. Statistic 2 does not apply (no lattice-spike form): reported as not applicable.

## Predictions
No dense row passes PASS-1 or PASS-2. CYC, CYCP, CYCeps with eps <= 1e-9, DEL, THIN, HQ1 pass both; NWM
passes statistic 1. Effect of each outcome: a flagged dense row goes to lane 1 as a construction target;
"none flagged" is MEASURED support (at the stated ranges, for the model sequences) for the natural
boundary expectation, not a proof.

## Arb stage
Statistic 1: per row, y recomputed in Arb (256 bits, lambda and t and theta taken as the exact doubles,
log of the searched primes exact) at the heights of smallest and largest beta and of smallest and largest
abs(beta - round(beta)), all 15 delta, for rows with K <= 8.4e6; for D2 at j <= 6 only. All CYC, CYCP, HQ1 rows:
40 heights. Statistic 2: I(omega) in Arb at two omega per row for CYC, CYCP, D1 (+, alternating, random 1),
D1-RAND(1) +. GPU float64 output is a screen; a flag requires the Arb stage to agree.

## Allocation plan (printed again by the code)
Statistic 1 GPU: chunks of 2000 x 50000 doubles = 0.8 GB per array, at most 8 arrays live: 6.4 GB; cupy pool
limit 16 GB. Statistic 2: grid (V + 200) * 32 complex doubles: 0.54 GB at V = 2^20; spike chunks of 2e7
(0.5 GB). Unit limits: GPU unit 24 GB, 4 cores; Arb unit 8 GB, 12 cores. At most 16 cores, 32 GB in total.

## Referee
REFEREE.md: independent pass (separate implementation in mpmath, no shared code) of three cells of
statistic 1 and one of statistic 2, plus an adversarial reading of the threshold and of the claims.
