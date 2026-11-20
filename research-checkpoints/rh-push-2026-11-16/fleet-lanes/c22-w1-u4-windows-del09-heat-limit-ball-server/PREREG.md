# PREREG: c22-w1-u4-windows-del09-heat-limit-ball-server

Written 2026-11-20 before any run of this lane. Kind: compute, certified conversions (work item W1). No search for a
new device. No statement about zeros of zeta. Float64 output is a screen; a verdict is an Arb ball (python-flint 0.9.0).
Server only through `rhrun`, at most 8 cores and 12 GB per job.

## Objects (fixed here)

**U4 band form.** As in `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u4-second-order-archimedean-mixed-form/REFEREE2.md`
section 3. For a height t: P = floor(t^(3/4)), u = log P, Lg = log(t/(2 pi)), modes h_k(s) = (2/u)^(1/2) sin(k pi s/u) on
[0, u], k = 1..6, overlaps O_a(j, k) = int_a^u h_j(s) h_k(s - a) ds (closed form; the closed form is checked against
`acb.integral` in balls at three triples), and for a coefficient vector c in C^6

    Q_w(t, c) = Lg - 2 Re( sum_{n = p^m < P} w(n) n^(-1/2) log p  e^(-i t log n)  c^* O_(log n) c ) / (c^* c),

with w = 1 (zeta), w(p^m) = 0 for p in S (DEL), w(p^m) = (-1)^m for p in S (THIN). Error term err(t, P, c) = the
function `errK` of the round-21 scripts (Proposition M constants of the U4 lane) with n' = norm(h_0')/norm(h_0) of the
vector. The validity of err as a bound is the refereed statement of the U4 lane; it is not re-proved here.

**Sets S.** The greedy floor rule of the round-21 scripts (`greedy(b, half)`, float64 midpoint rule with 8 nodes per
gap) run on the server for primes below (2.001e8)^(3/4) + 100. The certified statements are about the explicit sets
written to `sets_sha.json` (sha256 of the decimal list, sizes, first members). Check: the first ten members and the
counts below P at the round-21 windows (58, 66, 244, 375, 1659, 1751, 195, 215) must be reproduced; if not, stop.

## Part 1 (decisive first test): the six failing windows of round 21 in balls

Windows and vectors: the eight control rows and two zeta rows of `u4_confirm.json` (t as the printed decimal, taken
as an exact rational; c_k as the printed float64 numbers, taken as exact). For each: Q_ctl, Q_zeta on the same vector,
err, at 128 bits (repeat at 192 bits).
- **Certified failing window** := the ball of Q_ctl + err lies below 0 (so the ball of Q_ctl excludes 0 and is negative).
- Threshold on agreement: the ball must contain the 30-digit value of round 21 to its printed 15 digits.
- Not identically zero: sum over deleted (DEL) or twisted (THIN) prime powers of abs(weight) > 0 reported per window; Q_zeta
  alongside in every row; zeta rows must have Q_zeta - err > 0 at the two zeta windows.
- Outcome rule: all six certified -> rows THIN b = 0.75, DEL b = 0.55, DEL b = 0.75 of U4 relabel CHECKED -> CERTIFIED
  (for these windows, given err). Any window not certified -> reported with value and radius; no relabel for that row.

## Part 2: DEL b = 0.9 on 100 times the round-21 range

Round-21 range: t in [1e5, 2.1e6], step 0.1, 2e7 heights. **Range here: t in [1e5, 2.001e8], step 0.1, 2.0e9 heights
(factor 100 in length and in number of heights).** Families screened: zeta and DEL b = 0.9 (plus all five families on
the round-21 range as a check of the screen).
- Screen (float64, not a verdict): lambda_min of the 6 x 6 Hermitian matrix Lg - (B + B^*) at heights
  t = t0 + (m + 1/2) 0.1, B by a Gaussian-gridding non-uniform FFT (21 taps, oversampling 2) with P frozen per block
  (block length 2000 * 2^k, k = min(4, floor(log2(t0/1e5))); P = floor(t0^(3/4))). Checks of the screen: (i) three
  direct sums per block, deviation reported, threshold 1e-5; (ii) on [1e5, 2.1e6] with blocks of 2000 the round-21
  minima must be reproduced to 1e-4: zeta +0.0257825, DEL 0.55 -2.858355, DEL 0.75 -1.921017, DEL 0.9 +0.1152516,
  THIN -7.866923.
- Verdict step: the 8 lowest block minima of DEL 0.9 (and of zeta) are re-evaluated with exact P = floor(t^(3/4))
  (floor certified in balls), float64 eigenvector at exact P, then Q_ctl, Q_zeta, err in Arb at 128 bits.
  **Certified negative window** := ball of Q_DEL0.9 + err below 0. Otherwise: the minimum found is reported with its ball
  and the row stays "not decided".
- **Prediction (registered before the run), from the size of the deleted prime sum.** Q_DEL = Q_zeta + D_S,
  D_S = 2 Re<h, A_S h>/norm(h)^2 the deleted part. Share of the variance sum_{p<P} (log p)^2/p carried by S for b = 0.9
  (density x^(-0.1)): int_0^u v e^(-0.1 v) dv / (u^2/2) = 0.51 at u = 10.6 (t = 1.4e6) and 0.41 at u = 14.3 (t = 2e8): the
  remaining primes keep 49 % to 59 % of the variance, and that share grows with height. Round 21: mean lambda_min 7.64,
  minimum +0.115 in 2e7 heights (about 3e6 independent samples at correlation length 2 pi/u), i.e. a deviation of
  about 5.0 sigma with sigma = 1.5. A 100 times larger sample moves a Gaussian-tail minimum by about 0.85 sigma = 1.3.
  **Predicted: at least one height with lambda_min < 0 in the range, and a minimum between -3 and -0.3; predicted
  fraction of heights below 0 between 1e-9 and 1e-5.** Falsified if no height below 0 is found (then: not decided,
  minimum reported with its ball), or if the minimum is below -3.
- A zeta window below -err, if one occurs, is reported as found and sent to the same ball test. None is predicted
  (round 21: none in 2e7).
- Outcome rule: a certified negative window relabels the DEL b = 0.9 row "fails S3 at an explicit window (CERTIFIED)".

## Part 3: HEAT row of Statement O line 11

Reading of the assignment: "radii" is read as the family of rectangles R; the residue cells are enclosed on a nested
sequence of rectangles whose complements shrink, and C_R is followed along it.
Object: F = H_{-tau}, tau = 1, in the variable z (s = 1/2 + z), z = i w/2, evaluation by the trapezoid representation
of the c20 lane (`heat_c20.py`, unchanged; its Lemmas S, T, Q), on slabs of half-width 16 in Re w, each with its own
nodes (U = 48) and its own error bound; derivative with error eps/r by Cauchy's estimate (r = 1/4). Rates and
coefficients as in round 21: P8: z_1 = 3/8 - 2500.921875 i, b = 1; P1: z_1 and z_2 = 5/8 - 2500.625 i, b = (1, -3/4 + i/2).
h = V V#, L = F'/F, Q_gen, W_R as in Lemma R of the round-21 lane.
Rectangles: R_k = {abs(Re z) <= 3, abs(Im z - 2500.75) <= Y_k}, Y_k = 1, 2, 4, 8, 16, 32 (k = 1..6); if an edge meets
a zero, the edge is moved by 1/16 and the change is recorded. Round 21's rectangle (X = 1.15625, [2499.875, 2501.140625])
is row k = 0, quoted from file.
Per rectangle, at 128 bits:
- N_k = (1/2 pi i) contour integral of L (must enclose one integer); the zeros in R_k each enclosed by a winding-number
  square of half-width 1e-15; completeness: number of enclosed zeros = N_k.
- C_R := (1/2 pi i) contour integral of h L (independent of the zero list), W_R = sum over the enclosed zeros of h,
  Q_gen from four evaluations of L. **Cell := Q_gen - W_R + C_R must enclose 0 with radius below 1e-10.**
- Zeta row alongside: the same rectangles, rates and cells for F = xi(1/2 + z) (Arb zeta directly), k = 1..6.
- Not identically zero: abs F lower bounds at the rates; abs W_R and abs C_R reported; off-line zeros counted per rectangle.
Decision rule for "C_R -> 0":
- (a) The limit over all rectangles is a statement about infinitely many zeros; no finite set of cells certifies it.
  It is decided by proof or not at all: Lemma H (to be written in RESULT.md): F entire, even, of order at most 1 with
  F(0) > 0 implies sum over zeros of abs(rho)^-2 finite and C_R = - sum over zeros outside R of m_rho h(rho) -> 0 along
  every exhaustion. Label if the proof is complete: PROVED (one derivation here plus the referee file of this lane).
- (b) On the stated range (k = 0..6): certified values of C_R with balls; "decreasing on the range" is certified iff the
  balls of abs(C_R_k) are strictly ordered for k = 1..6. Prediction: abs(C_R) is of order (density of zeros)/Y_k, i.e.
  ratio of consecutive values between 0.3 and 0.8 for k >= 2; abs(C_R_6) below 0.3 for P8.
- (c) An explicit bound abs(C_R) <= B(R) valid for every R containing R_6 is attempted from Jensen's formula with a ball
  for F(0); reported with its size whatever it is. Line 11 relabels (HEAT clause "passage to all zeros": ARGUED ->
  PROVED-1 with certified cells) only if (a) is complete and every cell of (b) encloses 0.
tau = 0.25 (height 5e5) is run only if time remains; otherwise reported as not run.

## Allocation plan
Part 2: per worker at most 36 x 640000 complex128 = 369 MB for the gridded array, the same for its FFT, 75 MB of
coefficients, 3 x 130000 x 21 sparse entries (33 MB): below 1.2 GB per worker, 8 workers, limit 12 GB.
Parts 1 and 3: lists of fewer than 2e5 balls (below 200 MB per process).
