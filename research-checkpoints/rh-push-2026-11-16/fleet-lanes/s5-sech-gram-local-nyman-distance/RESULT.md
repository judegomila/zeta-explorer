# s5-sech-gram-local-nyman-distance: sech seam Gram, local Nyman-Beurling distance, Gaussian Weil functionals, pointwise profile

Date 2026-11-20. Screening lane, four combinations. Grades: PROVED / CLASSICAL / MEASURED / NOT RUN.

## Verdict

Four combinations tested, no survivor.

1. Local Nyman-Beurling distance in a sech window. Zeta, L(chi_-4), L(chi_5) and the unimodular twist follow one
   law, rel = d_N^2/d_0^2 = 0.82 (sd 0.06) / (1 + log N / log(qT0/2pi)), in all 134 windows. Every control that
   departs does so in the windows that contain its off-line zeros and in no other window: Davenport-Heilbronn
   (DH) equals L(chi_5) in the windows with no off-line zero near the centre and stalls in the others; the same
   for backward heat; a zero planted in zeta by a unimodular factor moves the statistic by 0.02 to 0.50 when it
   is at the centre and by less than 1e-4 when it is 3H away. The departure is visible at N = 1. This is
   detection of off-line zeros window by window: verified height in local form. T-NR with q = 1000003 stalls
   at 0.87 to 0.90 at every N <= 2e4 because the coefficient at q lies beyond N.
2. Smallest eigenvalue of the sech Gram on arithmetic node sets. G is a scaled Cauchy matrix and
   G^{-1} = P G P in closed form. log lambda_min = -3.5255 x (number of nodes) for the integers and for every
   union of residue classes, to 4 digits at 1e6 nodes; it reads the node set only. The Rayleigh quotient of the
   coefficient vector reads the Abel sum of the coefficients (pole at s = 1 or not). L(chi_-4), a positive
   comparison, differs from zeta by the factor 2 in the exponent; DH equals L(chi_5) exactly in lambda_min.
3. Gaussian Weil functionals. Zeta: non-negative on the grid, prime side (primes to 1e12) equal to the zero
   side to 3e-10. Every control turns negative at width x depth = 0.37 to 0.67 with the centre at the height
   of the off-line zero: the width is set by the depth of the zero, not by its height. The sech average is
   positive for every zero configuration inside the open strip (PROVED), so it reads nothing.
4. Pointwise profile of the optimal Nyman-Beurling approximant. Source numbers reproduced (median 0.0788,
   max 0.6925 at N = 500). Below 0.8 x 85.70 DH behaves as L(chi_5) and L(chi_-4) at every N <= 5000. The
   criterion "sup above 1" is met by zeta itself. DH departs only in a spike at t = 85.4, next to its first
   off-line zero, growing from N of a few hundred.

RH content: none. No bound moves.

## Sizes reached and machines

| item | size | machine |
|---|---|---|
| values of F on the line (all objects) | 23201 points per height, heights 1e3, 1e4, 1e5, 1e6 and four low windows; Euler-Maclaurin sums of up to 5e5 terms per Hurwitz zeta (2.5e6 integers for modulus 5) | server GPU 1 (unit rh-s5c1eval, 139 s at 1e6); checked against Arb at 25 points per height: largest error 3.3e-11 |
| window solves, combination 1 | 408 windows, N = 20000, H = 4, 16, 64 (23041 grid points and rank 1199 at H = 64) | Mac, 2 threads per job (the first server unit received about 2 cores; one H = 4 window took 37 s there against 3 s locally) |
| DH off-line zeros near the H = 4 windows | winding counts in 90 boxes at heights 1e4, 1e5, 1e6 | server GPU 1 (rh-s5dhbox) |
| Arb minimum, combination 1 | N = 20, 50, 100 in 4 windows, 12000 bits; N = 10, 30, 60 at 1500 bits | Mac |
| combination 2 | integers to 1e6, primes to 1e6 (78498 nodes), residue classes to 1e5, zero ordinates: first 100000 (height 74921) | server CPU (rh-s5c2) |
| combination 3, prime side | all 37607247439 primes in (1e7, 1e12] (count equals pi(1e12) - pi(1e7)) plus 744649 prime powers; 400 widths x 200 centres up to 1e5 | server CPU (rh-s5sieve 616 s, rh-s5c3p12 369 s) |
| combination 3, zero side | 138161 zeta zeros to height 100060 (Arb); controls from the battery tables to height 2000 | server, Mac |
| combination 4 | zeta N = 10000; T-NR q = 2 (N = 5000), q = 3 (N = 2222); L(chi_-4), L(chi_5), DH N = 5000 | server (rh-s5c4), Mac (periodic) |

Not completed: the sieve to 1e13 (rh-s5sieve13) was stopped at 26% after 35 minutes; at the share received it
needed 2.2 more hours. It would extend the usable widths of the prime side from 3.35 to about 3.9 in a
check of an identity and cannot change a classification. All units of this lane are stopped.

## 0. Controls and how they are evaluated

zeta; L(chi_-4); L(chi_5) (real character mod 5); DH = 5^{-s}[zeta(s,1/5) + k zeta(s,2/5) - k zeta(s,3/5) -
zeta(s,4/5)], k = 0.2840790438; E_a = zeta(s+1/4) zeta(s-1/4); T-NR = zeta(s)(1 + c q^{1/2-s} + q^{1-2s}),
c = 2.2, q = 3 and q = 1000003; unimodular twist WT = zeta(s + 1.2393 i); backward heat on the line,
Z_tau(t) = E[xi(1/2 + i(t+Y))]/|xi/zeta|(t), Y normal with variance |tau|/2, F_tau = Z_tau e^{-i theta(t)},
tau = -0.1 and -0.5 (check: first zeros 14.16372, 21.05983 and 14.27991 against the battery table 14.163718,
21.059827, 14.279906). Sign twist in the Liouville form zeta(2s)/zeta(s): poles on the line, so |F|^2 is
not integrable in any window and combinations 1 and 4 are not formulable (as in s2); it is included in
combinations 2 and 3. Off-line zeros below height 2000 are those of `c12-control-battery-harness/tables`.

## 1. Combination 1: local Nyman-Beurling distance with a sech window

Definition. d_N^2(T0,H) = min over c of int |1 - F(1/2+it) sum_{n<=N} c_n n^{-it}|^2 sech(pi(t-T0)/H) dt/(2H).
At c = 0 the value is 1/2. Reported: rel = d_N^2/(1/2). Survival would have required a control with rel not
decreasing in a window that contains none of its off-line zeros.

Structure (PROVED, one line each). The Gram matrix of the vectors F n^{-it} is
int |F|^2 (m/n)^{it} w dt: it depends on |F| in the window only. The target vector is int conj(F) n^{it} w dt:
it depends on F with its phase. A control enters through the values of F on the line inside the window and
through nothing else.

Computation. Trapezoid rule with step 0.05 on |t - T0| <= 9H (weight below 1e-12 outside). The columns are
orthogonalised incrementally (two-pass block Gram-Schmidt, new directions re-orthogonalised; directions of
relative size below 1e-9 dropped; largest orthogonality defect over all runs 5e-14) and the minimum is taken
with a coefficient penalty mu x (column norm)^2 x |c|^2, mu = 1e-2, 1e-4, 1e-6, 1e-8, 1e-10. Check against a
direct solve of the same penalised problem: agreement to 1e-9 (mu = 1e-4) and 1e-7 (mu = 1e-8) at N = 400,
1000, 2000. Between mu = 1e-4 and 1e-10 the value at N = 20000 changes by 0.002 on average (largest 0.024).
Numerical rank at N = 20000: 144 to 153 (H = 4), 402 to 425 (H = 16), 1179 to 1199 (H = 64).

Arb check of the minimum (same grid, the float64 values of F taken as exact numbers, normal equations at
12000 bits, radius 0):

| window | N | exact minimum (rel) | log10 of the squared coefficient norm | float64, mu = 1e-10 |
|---|---|---|---|---|
| zeta, T0 = 1000, H = 4 | 20, 50, 100 | 0.4383, 0.4085, 0.3561 | 7.1, 44.8, 147.7 | 0.4391, 0.4221, 0.4059 |
| zeta, T0 = 1e6, H = 4 | 20, 50, 100 | 0.6435, 0.6010, 0.5359 | 5.5, 45.1, 145.2 | 0.6435, 0.6250, 0.5934 |
| L(chi_5), T0 = 280, H = 4 | 20, 50, 100 | 0.4782, 0.4098, 0.3945 | 7.2, 45.2, 146.5 | 0.4796, 0.4358, 0.4064 |
| DH, T0 = 280, H = 4 (no off-line zero within 9.9 H) | 20, 50, 100 | 0.4761, 0.4037, 0.3639 | 6.9, 45.2, 147.2 | 0.4765, 0.4343, 0.3967 |

The unpenalised minimum is reached with coefficients of size 1e22 at N = 50 and 1e73 at N = 100, and it lies
0.01 to 0.06 below the penalised value at N = 100; the gap grows with N. The exact minimum at N = 2e4 is
not computable and is not what the float64 numbers are. All numbers below are the penalised statistic
(mu = 1e-8): an upper bound for the exact minimum, with bounded coefficients. The Arb values keep the order of
the objects (DH in a zero-free window is not above zeta or L(chi_5)).

A remark on the limit (ARGUMENT, not written out). For H > 1 the system {n^{-it}} is not complete in
L^2(sech(pi t/H) dt): the Fourier transform of an orthogonal function is analytic in a strip of half-width
pi/(2H), the nodes log n satisfy the Blaschke condition of that strip exactly when sum n^{-H} converges, and
for H > 1 a Blaschke product of a slightly wider strip gives a non-zero orthogonal function. For H <= 1 (the
seam scale sech(pi t) of the Gram sech((x_i - x_j)/2)) the system is complete. The biorthogonal functionals
have norms growing faster than exponentially in n, which is the coefficient growth seen in the Arb column.

### 1.1 Premise on zeta and the comparison L-functions

rel x (1 + theta), theta = log N / log(q T0/2pi), over all 134 windows of zeta, L(chi_-4), L(chi_5):

| N | mean | sd | min | max |
|---|---|---|---|---|
| 20 | 0.804 | 0.077 | 0.587 | 1.094 |
| 400 | 0.813 | 0.061 | 0.694 | 1.162 |
| 2000 | 0.821 | 0.057 | 0.684 | 1.086 |
| 20000 | 0.834 | 0.058 | 0.693 | 1.076 |

The decrease is 1/(1 + theta), which is 1/log N only for log N well above log T0; for N below (T0/2pi)^{1/2}
it is the mollifier regime. The premise holds in this form for zeta and for both L-functions (MEASURED). The
ladder is monotone in every window (one exception of 2.5e-7 at rel = 0.99994).

### 1.2 Main table: mean of rel over the windows (H = 16, three windows per height; mu = 1e-8)

| object | T0 = 1e3: N = 20, 20000 | 1e4: N = 20, 20000 | 1e5: N = 20, 20000 | 1e6: N = 20, 20000 |
|---|---|---|---|---|
| zeta | 0.490, 0.285 | 0.590, 0.375 | 0.653, 0.414 | 0.672, 0.449 |
| L(chi_-4) | 0.553, 0.334 | 0.597, 0.396 | 0.662, 0.443 | 0.684, 0.470 |
| L(chi_5) | 0.581, 0.341 | 0.597, 0.403 | 0.660, 0.449 | 0.714, 0.486 |
| WT (unimodular twist) | 0.486, 0.284 | 0.593, 0.376 | 0.659, 0.413 | 0.669, 0.448 |
| DH | 0.610, 0.410 | 0.667, 0.478 | 0.702, 0.545 | 0.716, 0.577 |
| heat tau = -0.1 | 0.514, 0.303 | 0.679, 0.449 | 0.814, 0.649 | 0.867, 0.734 |
| heat tau = -0.5 | 0.726, 0.587 | 0.959, 0.940 | 0.997, 0.997 | 1.000, 1.000 |
| E_a, a = 1/4 | 0.948, 0.921 | 0.986, 0.976 | 0.996, 0.992 | 0.999, 0.998 |
| T-NR q = 3 | 0.858, 0.713 | 0.878, 0.743 | 0.913, 0.764 | 0.903, 0.780 |
| T-NR q = 1000003 | 0.925, 0.869 | 0.940, 0.883 | 0.949, 0.887 | 0.950, 0.899 |

H = 64 (one window per height), rel at N = 1, 20, 400, 2000, 20000: zeta at 1e6: 0.917, 0.709, 0.576, 0.506,
0.465; L(chi_5): 0.913, 0.733, 0.597, 0.547, 0.497; DH: 0.855, 0.767, 0.674, 0.643, 0.599. The full table
(408 windows, all N, all mu) is `c1_table.txt` / `c1_table.json`, the summary `c1_summary.txt`.

### 1.3 DH against its off-line zeros

Low windows, where the battery table gives every off-line zero (rel at N = 1, 20, 400, 2000, 20000):

| window | nearest off-line zero | DH | zeta | L(chi_5) |
|---|---|---|---|---|
| T0 = 60, H = 4 | 85.70, 6.4 H away | 0.597, 0.424, 0.296, 0.288, 0.228 | 0.823, 0.392, 0.261, 0.248, 0.200 | 0.798, 0.331, 0.277, 0.231, 0.195 |
| T0 = 280, H = 4 | 240.40, 9.9 H away | 0.568, 0.477, 0.369, 0.330, 0.283 | 0.849, 0.353, 0.273, 0.236, 0.194 | 0.865, 0.482, 0.397, 0.382, 0.301 |
| T0 = 280, H = 16 | 240.40, 2.5 H away | 0.700, 0.536, 0.411, 0.373, 0.306 | 0.835, 0.452, 0.327, 0.284, 0.245 | 0.830, 0.503, 0.382, 0.357, 0.298 |
| T0 = 1055.9, H = 4 | 1078.49, 5.6 H away | 0.729, 0.545, 0.392, 0.365, 0.342 | 0.875, 0.690, 0.536, 0.424, 0.361 | 0.770, 0.424, 0.385, 0.358, 0.289 |
| T0 = 85.7, H = 4 | 0.8085 + 85.70 i, at the centre | 0.852, 0.741, 0.694, 0.682, 0.671 | 0.646, 0.362, 0.251, 0.211, 0.190 | 0.609, 0.413, 0.293, 0.283, 0.233 |
| T0 = 240.4, H = 4 | 0.8695 + 240.40 i, at the centre | 0.870, 0.793, 0.761, 0.758, 0.748 | 0.672, 0.438, 0.319, 0.276, 0.239 | 0.691, 0.451, 0.324, 0.301, 0.275 |
| T0 = 240.4, H = 16 | the same | 0.726, 0.603, 0.530, 0.502, 0.472 | 0.799, 0.450, 0.319, 0.271, 0.242 | 0.823, 0.479, 0.374, 0.345, 0.299 |
| T0 = 850, H = 4 | 0.562 + 847.5 i, 0.63 H away | 0.644, 0.534, 0.442, 0.388, 0.363 | 0.907, 0.512, 0.370, 0.349, 0.275 | 0.799, 0.489, 0.388, 0.341, 0.322 |

In the four windows without an off-line zero DH decreases as the L-functions do and ends inside their range.
With a zero of depth 0.31 or 0.37 at the centre it stalls at 0.67 and 0.75; the departure from the other
objects is present at N = 1 to 5. With a zero of depth 0.062 the excess is 0.04.

High windows (H = 4). Off-line zeros of DH counted by winding numbers in six boxes
Re s in [0.52, 2], Im s in [c + 4j, c + 4j + 4], j = -3..2 (float64 phases, largest phase step 0.35; check on
the known zeros at 85.70 and 114.16: both found in the right box). rel at N = 20000:

| centre c | off-line zeros per box | within 4 of the centre | DH | zeta | L(chi_5) |
|---|---|---|---|---|---|
| 9600 | 0 0 0 1 0 0 | 1 | 0.485 | 0.343 | 0.455 |
| 9800 | 0 0 1 0 0 0 | 1 | 0.586 | 0.320 | 0.367 |
| 10000 | 1 0 0 0 0 0 | 0 | 0.369 | 0.395 | 0.380 |
| 10200 | 1 0 0 1 0 0 | 1 | 0.413 | 0.343 | 0.394 |
| 10400 | 0 1 0 0 0 0 | 0 | 0.391 | 0.378 | 0.396 |
| 99600 | 1 0 1 0 1 0 | 1 | 0.561 | 0.417 | 0.427 |
| 99800 | 1 0 0 0 1 0 | 0 | 0.415 | 0.376 | 0.455 |
| 100000 | 2 0 0 0 1 0 | 0 | 0.399 | 0.378 | 0.491 |
| 100200 | 1 1 0 0 2 0 | 0 | 0.464 | 0.344 | 0.449 |
| 100400 | 1 1 0 0 1 1 | 0 | 0.426 | 0.382 | 0.405 |
| 999600 | 1 0 1 0 1 2 | 1 | 0.497 | 0.425 | 0.486 |
| 999800 | 2 0 1 0 1 1 | 1 | 0.563 | 0.516 | 0.502 |
| 1000000 | 0 1 1 2 1 1 | 3 | 0.603 | 0.493 | 0.457 |
| 1000200 | 0 0 0 0 1 0 | 0 | 0.454 | 0.426 | 0.465 |
| 1000400 | 0 0 2 0 1 0 | 2 | 0.653 | 0.384 | 0.464 |

Windows with no off-line zero within 4 of the centre: DH 0.369 to 0.464 against L(chi_5) 0.380 to 0.491 (seven
windows; DH below L(chi_5) in five). Windows with one or more: DH 0.413 to 0.653 against 0.367 to 0.502. The
DH excess in the main table is the density of its off-line zeros (1 to 6 per 24 units of height at these
heights, so no window with H >= 16 is free of them). DH has no Euler product and is still approximated at
the rate of L(chi_5) wherever no off-line zero sits in the window; the test does not read the Euler product.
In particular DH does not stall at N below (T0/2pi)^{1/2} in a zero-free window: at 1e6, N = 20, the mean is
0.716 for DH and 0.714 for L(chi_5).

### 1.4 Planted zero (same Gram, different target)

F* = zeta x (s - rho0)/(s - 1 + conj rho0), rho0 = 1/2 + eta + i gamma0. |F*| = |zeta| on the line, so the
Gram matrix is that of zeta. Window T0 = 10000, H = 4; rel at N = 1, 20, 400, 2000, 20000; zeta itself:
0.868, 0.580, 0.485, 0.424, 0.395.

| eta | zero at the centre | 1.5 H away (weight 0.018) | 3 H away (weight 1.6e-4) | 6 H away |
|---|---|---|---|---|
| 0.01 | 0.871, 0.591, 0.501, 0.445, 0.415 | change at N = 20000: +3e-4 | -4e-6 | -1e-6 |
| 0.05 | 0.887, 0.644, 0.562, 0.509, 0.484 | +1.4e-3 | -4e-5 | -2e-5 |
| 0.2 | 0.931, 0.788, 0.735, 0.701, 0.686 | +5.8e-3 | -9e-5 | -4e-5 |
| 0.5 | 0.978, 0.936, 0.915, 0.903, 0.898 | +1.4e-2 | -1.1e-4 | -8e-5 |

The statistic reads a zero to the right of the line through the phase of F inside the window, in proportion
to weight and depth, at every N from 1. A zero three widths away leaves 1e-4.

### 1.5 The other controls

- Backward heat. tau = -0.1 at T0 = 60, 85.7 (no off-line zero below 415): 0.207, 0.191 against zeta 0.200,
  0.190. T0 = 850 (nearest off-line zero 24 H away): 0.324 against 0.275 (H = 4), 0.299 against 0.285 (H = 16,
  6 H away). T0 = 1055.9 (pair of depth 0.199 at 0.24 H): 0.596 against 0.361. tau = -0.5 at T0 = 60, 85.7
  (first off-line zero 111.69): 0.213, 0.179; at T0 = 850 (zero of depth 0.257 at the centre): 0.815. The excess
  in the main table grows with height because the share of off-line zeros of the deformed function grows
  (mean zero spacing 0.52 at 1e6 against the smoothing scale 0.22 and 0.5). In windows without off-line zeros
  the deformed function gives the value of zeta: the statistic is continuous under the flow.
- E_a: zeros at depth 1/4 above every zeta zero, so every window contains them; rel 0.92 to 0.998.
- T-NR, q = 1000003: rel(N) = 0.962 to 0.988 at N = 1 and 0.864 to 0.905 at N = 20000 at every height and
  width. For N < q no polynomial contains the frequency log q, and the best multiple of the zeta
  approximant leaves 1 - (1 - rel_zeta)/(2 + c^2) = 0.90: the value is the coefficient at q, not a zero
  statistic. Its off-line zeros (depth 0.032, spacing 0.455) are in every window. q = 3: 0.62 to 0.85.
- WT: zeta in a window shifted by 1.2393; passes (it has no off-line zero).
- Sign twist: not formulable (poles on the line).

Classification: CLOSED. Zeta and both L-functions pass at every size. DH, heat and E_a fail only in windows
that hold their off-line zeros, at any N; this is the zero itself, seen at its own height. T-NR at large q
fails through one coefficient beyond N. No control fails in a window free of its zeros for a reason other
than a missing coefficient.

## 2. Combination 2: Riesz floor and lambda_min of the sech Gram on arithmetic node sets

With y_i = e^{x_i}: G_ij = sech((x_i - x_j)/2) = 2 sqrt(y_i y_j)/(y_i + y_j), a scaled Cauchy matrix.

**Identity (PROVED; Cauchy inverse formula).** G^{-1} = P G P, P = diag(P_i),
P_i = prod_{k != i} (y_i + y_k)/(y_i - y_k) = +- prod_{k != i} coth((x_i - x_k)/2). Hence
max_i P_i^2 <= 1/lambda_min <= sum_i P_i^2, and lambda_min = 1/lambda_max(PGP). For the integers 1..N,
|P_i| = (N+i)!/(i! 2i (i-1)! (N-i)!). Check against 80-digit eigenvalues: integers 1..12, 12 primes, 8 zero
ordinates: log lambda_min agrees to 16 digits, the identity to 1e-65 (`c2_validate.json`).

| node set | size | nodes | -log lambda_min | per node | Riesz floor log A_opt at the smallest gap |
|---|---|---|---|---|---|
| integers n <= N (support of zeta, E_a, WT, Liouville, T-NR for N < q) | 1e5 | 100000 | 352529.27 | 3.5253 | -9.87e5 |
| | 1e6 | 1000000 | 3525470.72 | 3.5255 | -9.87e6 |
| odd n (support of L(chi_-4)) | 1e5 | 50000 | 176253.82 | 3.5251 | -4.93e5 |
| n prime to 5 (support of L(chi_5) and of DH) | 1e5 | 80000 | 282018.42 | 3.5252 | -9.87e5 |
| primes | 1e5 | 9592 | 32053.22 | 3.3417 | -4.93e5 |
| | 1e6 | 78498 | 265090.99 | 3.3770 | -4.94e6 |
| zeta zero ordinates | first 1e4 (height 9878) | 10000 | 38034.01 | 3.8034 | -1.83e6 |
| | first 1e5 (height 74921) | 100000 | 373667.37 | 3.7367 | -4.82e7 |

lambda_min is not a power of N: log lambda_min is linear in the number of nodes with slope 4 log(1 + sqrt 2) =
3.52549 for the integers (the Hilbert-matrix constant) and for each union of residue classes. The lattice
floor A_opt(delta) = ess-inf of 1 + 2 sum sech(m delta/2) cos(m theta), about (8 pi/delta) e^{-pi^2/delta} at
the smallest gap delta, holds in every row with a slope pi^2 per unit of 1/delta against the measured 3.5
(integers) or less. A float64 eigensolver cannot reach these numbers beyond about 12 nodes; the closed form
replaces the planned GPU and Arb stages and is exact up to the float64 evaluation of sums of logarithms.

Rayleigh quotient R_F(N) = a^* G a/a^* a, a_n = a_F(n) n^{-1/2}: R_F = 2 int_0^inf |sum a_F(n) e^{-nx}|^2 dx /
sum |a_F(n)|^2/n (PROVED, from 1/(m+n) = int e^{-(m+n)x} dx).

| F | R_F at N = 1e3, 1e4, 1e5, 1e6 | local exponent d log R/d log N at the top |
|---|---|---|
| zeta, T-NR (q > N) | 368, 2831, 22931, 192636 | 0.927 (N/log N) |
| WT | 103, 785, 6357, 53399 | 0.927 |
| E_a | 616, 5639, 53872, 527135 | 0.992 |
| L(chi_-4) | 0.122, 0.0954, 0.0782, 0.0663 | -0.069 (1/log N) |
| L(chi_5) | 0.0186, 0.0144, 0.0118, 0.0099 | -0.070 |
| DH | 0.208, 0.164, 0.135, 0.114 | -0.068 |
| Liouville | 0.335, 0.528, 0.562, 0.532 | 0 (bounded, fluctuating) |

The quotient R_F/lambda_min has logarithm 3.5255 x (number of nodes) + O(log N): 3.5255 N for zeta, 1.7627 N
for L(chi_-4), 2.8202 N for L(chi_5) and for DH. The exponent reads the support of a_F and nothing else:
the positive comparison L(chi_-4) "fails" against zeta, DH equals L(chi_5). The lowest eigenvector is
concentrated on a band around n = N/sqrt 2 (1711 nodes at N = 1e5, 5413 at 1e6) with alternating signs; its squared overlap with the
coefficient vector is 1e-22 to 1e-30 for zeta and L(chi_5), 7e-4 for L(chi_-4), 4e-5 for DH at N = 1e5. The
power of N in R_F separates the objects with a pole at 1 from the entire ones; for Liouville, R_F bounded is
the Abel-summed form of the classical bound for sum lambda(n) x^n, an RH-equivalent growth statement that at
N = 1e6 tests only the lowest zeros.

Classification: CLOSED. lambda_min: the object does not enter (support only). Rayleigh quotient: the
coefficients enter through one Abel mean. Heat: no coefficients, not formulable.

## 3. Combination 3: Gaussian Weil functionals and the sech average

g(x) = exp(-x^2/(2w^2)) cos(xi0 x), hhat(r) = w sqrt(pi/2)[e^{-w^2(r-xi0)^2/2} + e^{-w^2(r+xi0)^2/2}],
W_F(w, xi0) = sum over the divisor of F of hhat(gamma), rho = 1/2 + i gamma (poles with negative sign).

Zeta, prime side: W = pole - 2 sum Lambda(n) n^{-1/2} g(log n) + archimedean - log pi, with all prime powers
to 1e12 (primes above 1e7 through seven moments per bin of width 1e-6 in log p; check of the moment method
against a direct sum over the 5096876 primes in (1e7, 1e8]: difference 6e-15). Grid: 400 widths in
[0.25, 3.5], 200 centres (100 geometric in [1, 1e5], 100 midpoints of the widest zero gap near geometric
heights up to 99990). Against the zero side (138161 zeros):

| widths | truncation tail at 1e12 | largest difference prime side - zero side | smallest prime-side value |
|---|---|---|---|
| 0.25 to 3.16 | below 1.1e-11 | 3.0e-10 | -1.8e-11 |
| to 3.35 | below 1e-9 | 1.6e-9 | -9.5e-10 |
| 3.5 | 1.7e-8 | 2.8e-8 | -2.8e-8 |

The zero side is a sum of positive terms; it is below 1e-6 at 12.4% of the grid points (centres between
zeros at large width, smallest 2e-15). At the 70094 points where it exceeds 1e-6 the prime side is positive
(smallest 1.018e-6). Where the true value is below the error the sign of the prime side is not decided.
Zeta passes, and the pass is the statement that the zeros below 1e5 are on the line: verified height.

Controls, zero side (battery divisors to height 2000; widths 0.05 to 40; for each off-line point, centres
within 4/w of it):

| control | smallest width with a negative value | at off-line zero (depth eta, height) | width x eta | width / log(height/2pi) | share of the 400 x 200 grid negative |
|---|---|---|---|---|---|
| DH | 2.17 | 0.3085, 85.70 | 0.669 | 0.83 | 1.0% |
| E_a, a = 1/4 | 1.58 | 0.25, 21.02 | 0.394 | 1.31 | 18.4% |
| E_a, a = 1/8 | 3.13 | 0.125, 787.47 | 0.392 | 0.65 | 15.9% |
| T-NR q = 3 | 1.21 | 0.4038, 20.02 | 0.487 | 1.04 | 4.0% |
| T-NR q = 1000003 | 14.89 = 1.08 log q | 0.0321, 20.24 | 0.478 | 12.7 | 5.1% |
| Liouville | 1.47 | poles on the line, zeros at depth -1/4 | 0.369 | 0.59 | 18.0% |
| heat tau = -0.1 | 2.88 | 0.1611, 750.85 | 0.464 | 0.60 | 0.6% |
| heat tau = -0.5 | 1.38 | 0.4847, 650.46 | 0.668 | 0.30 | 5.5% |
| zeta, WT | none | | | | 0 |

The onset is width x depth = 0.37 to 0.67 in every row. The ratio to log(gamma_off/2pi) runs from 0.30 to
12.7 and falls below 0.5 in one row (heat tau = -0.5, a zero of depth 0.48 at height 650): the ratio is small
where a deep zero sits high, which is a property of that zero and not of the test. For T-NR with large q the
onset is the width at which the test function reaches log q: the single coefficient at q.

**Sech average (PROVED).** For g(x) = sech(x/(2L)) cos(xi0 x), hhat(r) = pi L [sech(pi L (r - xi0)) + ...], and
Re sech(a - ib) = cosh a cos b/(cosh^2 a cos^2 b + sinh^2 a sin^2 b). A zero at depth eta contributes a positive
amount exactly when L eta < 1/2. The prime side of the explicit formula converges only for L < 1 (the sum
Lambda(n) n^{-1/2 - 1/(2L)}), and zeros in the open strip have eta < 1/2. Every admissible sech-type Weil
functional is therefore positive for every zero configuration in the open strip, with no other
hypothesis; the p-average of the Gaussian functionals carries no information
about the zeros. Measured minimum over centres 20 to 1700 (step 0.05):

| L | zeta | DH | E_1/4 | T-NR q=3 | T-NR q=1000003 | heat -0.1 | heat -0.5 (depths to 0.67) | Liouville (poles) |
|---|---|---|---|---|---|---|---|---|
| 0.5 | 0.0904 | 0.724 | 0.167 | 0.254 | 13.9 | 0.0891 | 0.0839 | 0.235 |
| 0.9 | 0.00537 | 0.205 | 0.00817 | 0.0150 | 13.8 | 0.00523 | -114 | -2.43 |
| 1.0 (seam scale) | 0.00255 | 0.145 | 0.00361 | 0.00674 | 13.8 | 0.00247 | -289 | -3.21 |

Negative entries occur only where the divisor leaves the strip (heat tau = -0.5: depth above 1/2) or has
poles on the line (Liouville).

Classification: CLOSED. The object enters through its zeros. The Gaussian functional is negative when the
Gaussian resolves the depth of an off-line zero at the height of that zero; zeta passes by verified height.

## 4. Combination 4: pointwise profile of the optimal approximant

P_N(t) = |1 - F(1/2+it) D_N(1/2+it)|^2, D_N = sum y_n n^{-s}, y = G_N^{-1} b with the exact Gram matrix
(`nbcore.c` of s2: Vasyunin formula for zeta, digamma form for periodic coefficients, zeta values at ratios
for T-NR). Checks: d_N^2 at N = 500 is 0.00741985801 (source 0.007419858); (1/2pi) int_{|t|<=400} P_N/(1/4+t^2) =
0.00678626 (source 0.006786264); value at the grid point nearest each zero within 0.05 of 1 (grid 0.01).

Source numbers. Midpoints between consecutive zeros, N = 500: median 0.0788 and max 0.6925 over the gaps
below t = 251.2 (108 gaps); 0.0782 and 0.6003 below 244; 0.0868 and 0.852 below 400. The source values 0.0794
and 0.692 are reproduced for its 110 zeros.

Midpoint median (and largest value of P_N over the whole range, in brackets) for t <= 68.6 = 0.8 x 85.70:

| N | zeta | L(chi_-4) | L(chi_5) | DH |
|---|---|---|---|---|
| 100 | 0.088 [1.64] | 0.057 [1.39] | 0.144 [1.21] | 0.092 [1.88] |
| 500 | 0.043 [1.28] | 0.040 [1.16] | 0.067 [1.32] | 0.039 [1.61] |
| 1000 | 0.031 [1.08] | 0.059 [1.12] | 0.052 [1.23] | 0.046 [1.63] |
| 2000 | 0.019 [1.06] | 0.029 [1.19] | 0.057 [1.48] | 0.020 [1.35] |
| 5000 | 0.014 [1.06] | 0.037 [1.14] | 0.036 [1.14] | 0.045 [1.21] |
| 10000 | 0.018 [1.07] | | | |

Whole-range median of P_N for t <= 68.6: zeta 0.137, 0.044, 0.038, 0.033, 0.025 (N = 100, 500, 1000, 2000,
5000); L(chi_-4) 0.316, 0.159, 0.126, 0.077, 0.076; L(chi_5) 0.467, 0.222, 0.152, 0.121, 0.087; DH 0.366,
0.191, 0.151, 0.118, 0.085.

- The sup of P_N exceeds 1 for zeta at every N (1.06 to 1.64 below 68.6; 1.37 to 3.47 below 400): P_N = 1 at
  a zero with non-zero slope. The stated failure criterion "sup above 1" does not separate anything. The sup
  over the central half of each gap is below 1 for zeta below t = 244 from N = 500 (0.98, 0.92, 0.81, 0.83,
  0.76, 0.97); for L(chi_5) below 68.6 it is above 1 at N = 100, 250, 500 and 2000.
- Below 0.8 gamma_off DH is inside the range of the two L-functions in the median and in the midpoint median
  at every N. Its sup is 1.21 to 1.88 against 1.06 to 1.64 for the other three; all four exceed 1 at every N.
  DH does not fail there: its median decreases in N as the others do.
- At the off-line zero: the largest value of P_N for 60 <= t <= 120 is at t = 84.96 to 86.17 for DH: 8.2, 7.5,
  7.0, 9.2, 11.8 at N = 20, 50, 100, 500, 5000; for L(chi_5) in the same range 6.7, 5.7, 4.5, 3.5, 2.4. The
  two are not distinguishable at N <= 50 and separate from N of a few hundred, that is for (log N) x 0.31
  above about 1.5: resolution of the zero at its height.
- T-NR q = 2, 3 with c = 2.2 (local-factor zeros of depth 0.64 and 0.40 at heights 4.53 + 9.06 k and
  2.86 + 5.72 k): midpoint median 0.28 to 0.70 (q = 2, N = 100 to 5000) and 0.84 to 1.56 (q = 3, N = 100 to
  2000), sup 4 to 15; d_N^2 stays at 0.127 and 0.183. The range t <= 0.8 gamma_off contains no zero on the line: the stated statistic
  is empty. T-NR with q = 1000003: NOT RUN (the Gram needs zeta-type sums of length q N); for N < q the
  approximant can only be a multiple of the zeta approximant, as in 1.5.
- E_a, WT, heat, Liouville: NOT RUN (no closed form for the Gram, or not formulable; s2 section 6). WT has no
  off-line zero; E_a has no zero on the line, so the statistic is empty.

Classification: CLOSED. The object enters through its values near the point t; a control departs at the
height of its off-line zero once log N exceeds about 1.5/depth.

## 5. Table

| combination | statistic | sizes reached | zeta | comparison L-functions | DH | heat tau < 0 | E_a | T-NR | twists | classification |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 local Nyman-Beurling distance, sech window | rel = d_N^2/d_0^2, coefficient-penalised | N = 2e4; T0 to 1e6; H = 4, 16, 64; 408 windows; Arb minimum to N = 100 | 0.82/(1 + theta); 0.449 at 1e6, H = 16 | same law; 0.470, 0.486 | = L(chi_5) in zero-free windows (0.37 to 0.46 against 0.38 to 0.49); 0.41 to 0.75 with a zero near the centre | = zeta in zero-free windows; 0.60 to 1.00 otherwise | 0.92 to 0.998 (zeros in every window) | q = 1000003: 0.87 to 0.90 from N = 1 (coefficient at q); q = 3: 0.62 to 0.85 | WT = zeta shifted; Liouville not formulable | CLOSED: off-line zeros inside the window, at any N; values on the line |
| 2 lambda_min of the sech Gram, Rayleigh quotient | log lambda_min per node; exponent of R_F | 1e6 integers, 78498 primes, 1e5 zeros | 3.5255 per node; R ~ N/log N | 3.5251, 3.5252 per node, half and 4/5 of the nodes; R ~ 1/log N | lambda_min identical to L(chi_5); R ~ 1/log N | not formulable | support of zeta; R ~ N^0.99 | support of zeta for N < q | WT: R as zeta; Liouville: R bounded | CLOSED: support only; one Abel mean of the coefficients |
| 3 Gaussian Weil functional, sech average | sign of W_F(w, xi0); smallest negative width | primes to 1e12; 400 x 200 grid to centre 1e5; controls to height 2000 | >= 0; prime side = zero side to 3e-10 | not run (same structure) | negative from w = 2.17 at 85.70 (w eta = 0.67) | from 2.88 (w eta = 0.46) and 1.38 (0.67) | from 1.58 (w eta = 0.39) | q = 3: 1.21; q = 1000003: 14.9 = 1.08 log q | WT >= 0; Liouville negative from 1.47 | CLOSED: depth resolution at the height of the zero; sech average positive for all (PROVED) |
| 4 pointwise profile | midpoint median, sup of P_N below 0.8 gamma_off | N = 1e4 (zeta), 5000 (periodic) | median 0.088 to 0.018; sup above 1 at every N | medians 0.057 to 0.037 and 0.144 to 0.036; sup above 1 | same as the L-functions below 68.6; spike 7 to 11.8 at t = 85.4 | not formulable | statistic empty | q = 2, 3: medians 0.3 to 1.6 (zeros in range); q = 1000003 not run | not run | CLOSED: criterion met by zeta; DH departs only at its zero |

## 6. Why nothing here is a survivor

A survivor needs every control to fail below the scale of its zeros or for a reason independent of them.
In combinations 1, 3 and 4 DH, heat and E_a fail exactly where the test function sits on an off-line zero
and pass elsewhere; the planted-zero experiment gives the same response from a function that differs from
zeta by one zero. In combination 2 the statistic does not see the function. The one failure not caused by a
zero (T-NR at large q) is a missing coefficient and occurs for the same reason in a function with all zeros
on the line whose coefficients start beyond N.

## 7. Three weakest steps

1. Combination 1 reports a coefficient-penalised minimum. The Arb minimum without penalty is lower by 0.01 to
   0.06 at N = 100 with coefficients up to 1e73, and was not computed beyond N = 100; whether the unpenalised
   minimum tends to 0 for zeta in a fixed window, and what it does for the controls at large N, is not
   decided. The incompleteness remark for H > 1 is an argument, not a written proof.
2. The DH classification above height 2000 rests on float64 winding counts in boxes |t - c| <= 12,
   Re s >= 0.52; zeros of depth below 0.02 and zeros further than 3 H are not counted, and H = 16, 64 windows
   at these heights were not classified (every one contains off-line zeros by the measured density).
3. Window solves and the periodic Grams ran on the Mac, not on the server, because the server share was about
   2 cores; the server did the evaluation of F at 1e6, the sieve to 1e12, combination 2 and the zeta Gram.
   The sieve to 1e13 was not completed. The heat control on the line is a definition made here (Gaussian
   average of xi along the line, divided by the gamma factor); it reproduces the battery zeros to 1e-6.

## Files

`objs.py` (values on the line; Hurwitz by Euler-Maclaurin, GPU), `validate_objs.py`, `out/validate_objs.log`;
`c1_eval.py`, `c1_local_nb.py` (window solver), `c1_exact.py` (Arb minimum), `c1_blaschke.py`, `c1_dh_boxes.py`,
`c1_analyze.py`, `c1_summary.py`, `c1_table.txt`, `c1_table.json`, `c1_summary.txt`, `out_c1/` (408 windows,
exact minima, planted zero), `out/F_*.npz` (values), `out/dhbox_*.json`;
`c2_cauchy.py`, `c2_validate.json`, `out/c2.json`;
`c3_sieve.c`, `c3_prime.py`, `out/c3_prime_1e12.json`, `out/c3_prime_1e12.npz`, `c3_weil.py`, `c3_zero_side.json`;
`nbcore.c` (from s2, unchanged), `c4_profile.py`, `c4_spike.py`, `out4/` (periodic, spike), `out4s/` (zeta, T-NR);
`run_c1eval.sh`, `run_c1_local.sh`, `run_c4.sh`, `run_c4_local.sh`, `run_dhbox.sh`, `run_c1.sh` (first server
attempt, stopped). Server copy: `~/rh-push/s5-sech-gram-local-nyman-distance/` (includes `out/mom_1e12.bin`,
645 MB, the prime moments).
