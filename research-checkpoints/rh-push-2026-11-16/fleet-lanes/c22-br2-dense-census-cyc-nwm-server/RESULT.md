# c22-br2-dense-census-cyc-nwm-server: RESULT

Lane kind: compute (heavy lane, server through rhrun). Date 2026-11-20. Supports
`c22-br2-dense-remainder-integer-quantization`. Labels: PROVED / CLASSICAL / MEASURED / ARGUED / OPEN.
Nothing here is a statement about zeros of zeta. No score is claimed.

## 0. Verdict

partial-result (census; no proof).

1. **No twin candidate** among the dense rows. Statistic 2 (the mean-square integral of the round-21 missing
   lemma) is not O(V) in any dense row: M(V) grows like V^3.00 in all 27 rows of class log x (V up to 2^20),
   V^4.0 (random phases) or V^2.5 (smooth sequence, phases + or alternating) in class (log x)^2 (V up to 2^13).
   Its positive control is valid: CYC gives M(V)/V = 55.66627 constant to 9 digits over 2^7..2^20 (closed form
   (2 pi b(u_1))^2 = 55.66670 without the kernel cut). MEASURED (float64 screen; Arb at 14 probe values).
2. **Statistic 1 is void as registered.** The positive control CYC fails the registered cut: 93.85% of its
   heights have slope within 0.02 of an integer, the cut is 99%. Cause (MEASURED): all 123 failing heights
   are pole-class heights t < 0.0049, i.e. pole points of the high-index lattices, which accumulate at the pole
   t = 0 of 1/(1 - w); the registered allowance covered heights near a pole but the height design put 6% of
   the heights there. By the pre-registration no flag may be read from statistic 1. Post hoc (not
   registered) variants that exclude t < 0.5 pass CYC at 100% and leave every dense row at 2% to 7%,
   which is the chance level 4% of a slope with no relation to the integers.
3. Consequence of 1 and 2: "twin candidate" needs both statistics; no dense row passes statistic 2, so no
   dense row goes to lane 1 as a construction target. The class (log x)^4 and exp(sqrt(log x)) could not be
   tested at three decades (stated before the run).
4. Two registered predictions failed: CYC under statistic 1 (above), and CYCP "flagged exactly like CYC"
   (it passes statistic 2 with e = 1.004 but has 79.7% integer slopes: its first four primes differ from
   3^(2^k) by up to 11%, which leaves uncancelled pole and zero lattices of total density about 10 per unit
   height, and the 99% cut rejects a meromorphic function with that density at delta_max = 2^-8).

## 1. Plan, and what is new against the record

Object: N_1(z) = prod over k of (1 - e^(i theta_k - lambda_k z)), z = delta + it, the denominator of the
relative product R_S(1/2 + z) with abs(alpha_q) = q^(1/2); y = -log abs(N_1). Round 21 closed the sparse part of
regime (K) (Theorem W, sum over S of (log q)^(-gamma) finite, gamma < 1; author only) and named the missing
lemma for the dense remainder: a lower bound for M(V) = int over [V, 2V] of abs(I(omega))^2 d omega,
I(omega) = sum over k, n of lambda_k e^(i n theta_k) T^(omega - n lambda_k), that is not O(V). This lane measures M(V) and the
radial slopes on dense sets with a telescoping positive control. PREREG.md was written before any run.
New against the map: (i) M(V) measured on 50 rows with the diagonal prediction as reference; (ii) the
resolution of both statistics located on a perturbed-CYC ladder; (iii) the observation (section 3) that
"nearest prime to exp(f(k))" for smooth f is, at every reachable resolution, the Beurling sequence
lambda_k = f(k): for f(k) = k the product is Euler's prod (1 - q^k), for f(k) = k^(1/2) the diagonal estimate of
M is wrong by six to seven orders of magnitude.

## 2. Runs

Server only, through rhrun, after rhstatus. Units (all exited or stopped by this lane; none left running):
c22ds1, c22ds1b (statistic 1, GPU 1, 4 cores each, cupy pool use 2.2 GB of a 16 GB limit), c22ds2, c22ds2e,
c22ds2d (statistic 2, GPU 1, pool limit 8 GB), c22da1, c22da1b, c22da2 (Arb, 8 + 1 cores), c22dnwm, c22dref,
c22dph, c22dfin, c22dtest, c22test (first test unit: killed by its 4 GB limit after 3.5 s; a candidate list of
1.5e8 x 23 doubles in the height construction; fixed by a cap of 20000 candidates before any registered
run). At most 16 cores and 32 GB of unit limits at any time. Planned allocation sizes are printed in the
logs (largest: 0.75 GB per array, at most 4 live, statistic 1; 0.54 GB grid, statistic 2).
Code: `sets.py` (rows), `stat1.py`, `stat2.py`, `arbcheck.py`, `nwm.py`, `referee.py`, `posthoc.py`, `final.py`.
Outputs: `out1/*.json`, `out2/*.json`, `final.txt`, `posthoc.txt`, `arb_stat1.json`, `arb_stat1_D2.json`,
`arb_stat2.json`, `nwm_out.json`, `referee_out.json`, `d4_partial.txt`. The per-height arrays (13 MB) stay on
the server in `~/rh-push/c22-br2-dense-census-cyc-nwm-server/out1/*.npz`.

Deviations from PREREG:
1. D4 rows of statistic 2 were stopped by this lane: the kernel pad (100) exceeds V (8..64), each V costs
   2e8 to 2.7e9 lattice generators, and the range is not asymptotic. Two values exist for D4 +
   (M = 7.66e5 at V = 8, 7.61e5 at V = 16). No conclusion is drawn for D4.
2. Arb stage of statistic 1 covered D1 (+, alternating, random 1), D1-RAND(1) (+, random 1), ETA, INJ1 +,
   INJ64 random, all CYC-type rows and HQ1 (not all 34 rows of that size), and D2 at j <= 6 as registered.
3. `posthoc.py` (variants of statistic 1) was written after the registered result was seen.
4. NWM used 200 heights in [0, 1.2] and mpmath quadrature, as registered; it is not an enclosure.

## 3. Statistic 2 (MEASURED)

Window y_c = 5.5, h = 1.5, 4-fold B-spline; kernel cut at 100; grid 1/32. e = least-squares exponent of M on
the upper half of the V range. "ratio" = M(V)/V at the largest V divided by the diagonal value
(int abs(K)^2 = 9.036 times (17/6) V^2 for N(lambda) = lambda, times (49/6) V^3 for N(lambda) = lambda^2), i.e. what unrelated
lattices give.

| Row | V range | e | M/V at largest V | ratio to diagonal | PASS-2 |
|---|---|---|---|---|---|
| CYC (positive control) | 2^7..2^20 | 1.0000 | 55.66627 | - | yes |
| HQ1 (single prime 3) | 2^7..2^20 | 1.0000 | 55.66627 | - | yes |
| CYCP | 2^7..2^20 | 1.004 | 287.7 | - | yes |
| CYCeps 1e-10 | 2^7..2^20 | 1.014 | 60.33 (55.67 up to 2^15) | - | yes |
| CYCeps 1e-8 | 2^7..2^20 | 2.65 | 4.66e4 | - | no |
| CYCeps 1e-6, 1e-4, 1e-2 | 2^7..2^20 | 3.21, 2.04, 2.00 | 2.0e7, 2.3e7, 2.2e7 | - | no |
| DEL, THIN on D1, D2 | 2^7..2^20, 2^5..2^13 | - | < 2e-10, 0 above V = 2^8 | - | yes (analytic on the line) |
| ETA (lambda_k = k) | 2^7..2^20 | 3.0000 | 2.447e13 | 0.869 | no |
| D1 + | 2^7..2^20 | 3.0001 | 2.447e13 | 0.869 | no |
| D1 alternating | 2^7..2^20 | 3.0004 | 7.07e12 | 0.251 | no |
| D1 random 1, 2, 3 | 2^7..2^20 | 3.002, 2.997, 3.002 | 2.79e13 | 0.991, 0.992, 0.990 | no |
| D1-RAND(1,2,3) + | 2^7..2^20 | 3.001, 3.004, 3.004 | 2.72e13 | 0.969, 0.966, 0.966 | no |
| D1-RAND(1,2,3) random 1 | 2^7..2^20 | 2.997, 3.001, 3.001 | 2.79e13 | 0.990, 0.987, 0.994 | no |
| INJ-J, J = 1, 2, 4, 16, 64, phase + | 2^7..2^20 | 3.001 to 3.003 | 1.6e13 to 4.9e13 | 0.57, 1.74, 1.33, 1.06, 0.98 | no |
| INJ-J, alternating | 2^7..2^20 | 3.003 to 3.007 | 2.8e13 to 4.4e13 | 1.56, 1.25, 1.09, 1.01, 0.98 | no |
| INJ-J, random 1 | 2^7..2^20 | 2.996 to 3.002 | 2.6e13 to 2.8e13 | 0.91, 0.96, 0.97, 0.98, 0.99 | no |
| D2 random 1, 2, 3 | 2^5..2^13 | 4.04, 3.99, 4.05 | 4.0e13 | 0.990, 0.974, 0.971 | no |
| D2-RAND(1) random 1 | 2^5..2^13 | 4.04 | 4.02e13 | 0.990 | no |
| D2 + | 2^5..2^13 | 2.57 (local 2.62, 2.54, 2.50) | 6.56e6 | 1.6e-7 | no |
| D2 alternating | 2^5..2^13 | 2.55 (local 2.69, 2.51, 2.48) | 1.88e7 | 4.6e-7 | no |
| D2-RAND(1) + | 2^5..2^13 | 2.59 (local 2.62, 2.57, 2.51) | 2.16e7 | 5.3e-7 | no |
| DE +, DE-RAND(1) + | 2^3..2^7 | 2.68, 2.45 | 1.8e4, 4.3e4 | - | no (range too short to mean much) |
| DE random, DE-RAND(1) random | 2^3..2^7 | 8.26, 8.34 (not a power law) | 4.0e10 | - | no |
| D4 | - | not completed (deviation 1) | - | - | - |

Readings.
- R-a (MEASURED). With random phases, or with jittered frequencies in class log x, M(V) equals the diagonal
  value within 1% to 3.5%: the cross terms between different lattices do not reduce the mean square. The
  missing lemma holds numerically at full diagonal strength on these rows (M/V grows by 4.00 per octave in
  class log x, by 8 per octave in class (log x)^2).
- R-b (MEASURED; mechanism ARGUED). For the smooth sequence lambda_k = k^(1/2) with phases + or alternating, and
  also for the jittered one with phase + (the jitter moves lambda_k by 1/(2 k^(1/2)), far below the kernel width),
  the cross terms cancel all but about 1e-7 of the diagonal, and M(V) grows like V^(5/2), not V^4. Argument:
  Poisson summation in k of sum over k of k^(1/2) g(n k^(1/2)) leaves the stationary terms n^2 = 4 pi m omega/y,
  y in the window, of size omega^(1/2) m^(-3/2), about (m omega)^(1/2) of them per m with unrelated phases; the sum of
  squares is omega^(3/2) sum m^(-5/2), so M(V) is of order V^(5/2). The local exponents 2.62, 2.54, 2.50 agree.
  Still not O(V). So a proof of the missing lemma cannot be a diagonal-dominance argument: it has to
  survive a set on which the off-diagonal part cancels the diagonal to relative size V^(-3/2).
- R-c (MEASURED). Rational dependence alone does not produce a candidate: INJ-J rows (all frequencies
  multiples of log p for J = 1..64 primes) have e = 3.00 with ratio between 0.57 and 1.74; the ratio moves
  away from 1 as J decreases (the cross terms are then exact coincidences and add or subtract) but the
  exponent does not move. The telescoping of CYC needs the doubling relation and theta = pi together.
- R-d (MEASURED), resolution: on the ladder lambda_k = 2^k log 3 (1 + eps u_k) the integral stays O(V) for
  eps = 1e-10 (M/V drifts from 55.67 to 60.3 at V = 2^20) and is lost at eps = 1e-8 (M/V = 4.7e4 at 2^20,
  departing at V about 2^15). The statistic resolves a relative frequency error of about 1/(V y_c) times a
  small constant. A flag at V = 1e6 certifies telescoping to about 1e-9 and nothing finer.
- ETA and D1 + agree (0.8693 both): the 30 searched primes do not matter at this resolution.

Arb stage (`arb_stat2.json`): I(omega) at the grid maximum and at one seeded omega of the top octave, 128-bit
balls, same kernel cut. abs(float - Arb): CYC 2.9e-4 and 5.2e-5 on values of size 7.46; CYCP 1.3e-3 and 1.9e-4
(size 51 and 8); D1 +, alternating, random 1: 2e-4 to 1.5e-3 on values of size 2e6 to 2e7; ETA 2.6e-8 and
7e-9 (its spikes sit on grid points); D1-RAND(1) +: 135 and 47 on values of size 2.1e7 and 4.2e6 (relative
6.5e-6 and 1.1e-5: the linear deposit of off-grid spikes). Arb radii below 6e-29. The screen is accurate to
1e-5 relative at these points; M itself (a sum of 3.4e7 grid values) has no enclosure.

## 4. Statistic 1 (MEASURED; void as registered)

Float64 on GPU 1, lambda and t and theta as doubles; factors with delta lambda <= 32. Slope beta = least squares on the
11 smallest delta. "frac" = fraction of heights with abs(beta - round(beta)) <= 0.02 (registered cut 0.99).

| Row | j range, heights, factors | frac (registered) | frac, t >= 0.5 (post hoc) | sd of beta at generic t | sd of y at generic t, smallest delta |
|---|---|---|---|---|---|
| CYC | 4..18, 2000, 23 | 0.9385 (FAILS) | 1.0000 | 0.00028 | 0.881 |
| CYCeps 1e-10, 1e-9, 1e-8 | same | 0.9385 each | 1.0000 each | 0.0003, 0.0006, 0.005 | 0.88 |
| CYCeps 1e-7, 1e-6, 1e-4, 1e-2 | same | 0.491, 0.228, 0.079, 0.052 | 0.463, 0.146, 0.046, 0.052 | 0.047, 0.19, 0.36, 0.42 | 0.96, 1.6, 2.6, 3.5 |
| CYCP | same | 0.797 | 0.830 | 0.028 | 1.72 |
| HQ1 (factor of prime 3); map HQ1 | 4..18, 2000 | 1.0000; 0.9985 | same | 0.0003; 0.006 | 0.88; 1.73 |
| DEL, THIN on D1, D2 | 4..18, 2000 | 1.0000 (all four) | 1.0000 | 0.0004 to 0.0017 | 0.55 to 1.55 |
| NWM (200 heights, mpmath) | 4..18 | 1.000 (beta in [1e-5, 4.4e-4]) | - | - | y between 1.6 and 46.9 |
| D1 random 1, 2, 3 | 4..18, 2000, 8.4e6 | 0.044, 0.038, 0.031 | 0.045, 0.038, 0.031 | 37.6, 36.2, 35.0 | 298, 284, 279 |
| D1-RAND(1,2,3), + and random | same | 0.035 to 0.044 | 0.035 to 0.043 | 34.6 to 36.7 | 276 to 292 |
| D1 +; ETA | same | 0.040; 0.012 | 0.040; 0.011 | 1.55; 1.54 | 8.3; 7.4 (resonant heights: y up to 4.31e5) |
| D1 alternating | same | 0.025 | 0.023 | 3.99 | 17.8 |
| INJ-J (15 rows) | 4..18, 2000, 7.7e6 to 8.4e6 | 0.029 to 0.072 | 0.029 to 0.073 | 20 to 36 | 164 to 288 |
| D2 random 1, 2, 3; D2-RAND(1) random | 0..10, 400, 1.07e9 | 0.028, 0.055, 0.065; 0.035 | same | 49 to 56 | 487, 523, 550; 484 |
| D2 +, alternating; D2-RAND(1) + | 0..10, 400, 1.07e9 | 0.040, 0.043; 0.058 | same | 2.4, 4.6; 4.1 | 17.5, 31.9; 28.0 |
| D4 (4 rows) | -1..2, 200, 2.7e8 | not testable (0.03 to 0.075) | - | 3.6 to 5.1 | 8.2 to 11.6 |
| DE (4 rows) | 0..3, 200, 8.9e6 | not testable (0.02 to 0.045) | - | 0.9 to 1.0 | 2.0 to 2.3 |

Readings.
- The registered positive control fails (section 0, item 2). `posthoc.txt`: the failing CYC heights are the
  123 pole-class heights with t < 0.00489; no height at distance >= 0.0051 from a pole of 1/(1 - w) fails; the
  40 telescoped-pole heights have beta = -0.99977 (Arb: same to 1e-10), the others 0.00023.
- Post hoc only: with heights t >= 0.5 the controls CYC, CYCeps <= 1e-8, HQ1, DEL, THIN pass at 100% and every
  dense row has 1% to 7% (a slope with a continuous distribution of spread >> 1 gives 4%). This is not a
  registered test; it shows that the registered failure came from the height design, not from the slopes.
- Size of y at generic heights (MEASURED against an ARGUED model). For independent phases the variance of
  y is int (1/2) Li_2(e^(-2 delta lambda)) dN(lambda): zeta(3)/(4 delta) for N = lambda and zeta(4)/(4 delta^2) for N = lambda^2. At the smallest
  delta this gives standard deviations 280.7 (D1, delta = 2^-18) and 532.7 (D2, delta = 2^-10); measured 276 to 298
  and 484 to 550, and the measured values double per two (D1) or one (D2) steps of j through the whole
  range. So with random phases or jittered frequencies y has no radial limit of the form
  n log(1/delta) + c at generic heights within the tested range.
- ETA (code check, CLASSICAL): at t = 2 pi/b, b = 1, 2, 3, 4, 5, 7 and j = 8, 13, 18 the computed y equals
  pi^2/(6 b^2 delta) - (1/2) log(2 pi/(b delta)) - delta/24 with differences between 7e-15 and 3e-9 (values up to 4.3e5).
- Resolution: the slope statistic separates the perturbed CYC from CYC at eps = 1e-7 (frac 0.49) and not at
  1e-8 (frac equal to CYC; only the 4-point terminal slope moves, 0.75 against 0.99).

Arb stage (`arb_stat1.json`, `arb_stat1_D2.json`; 128-bit balls, the doubles taken as exact, the searched primes
with exact logarithms): max abs(float - Arb) of y over all 15 delta: at most 5.5e-7 on the D1-size rows (4
heights each: smallest and largest beta, smallest and largest distance to an integer), 5.3e-9 on the CYC-type
rows (38 or 39 heights each), 1.9e-14 on HQ1, 2.3e-11 on D2 at j <= 6. Largest radius 1.3e-26. Slopes agree to
5e-8. The truncation at delta lambda <= 32 is common to both and bounded by 1.8e-6 (D2, j = 10), 6.6e-9 (D1, j = 18).

## 5. Controls

| Control | Registered expectation | Outcome |
|---|---|---|
| CYC (positive control) | flagged by both statistics | statistic 2: flagged (e = 1.0000). Statistic 1: NOT flagged at the registered cut (0.9385 < 0.99): statistic 1 void |
| CYCP | flagged like CYC | statistic 2: e = 1.004 (pass); statistic 1: 0.797. Prediction failed (section 0, item 4) |
| CYCeps | transition between 1e-9 and 1e-7 | statistic 2: between 1e-10 and 1e-8; statistic 1: between 1e-8 and 1e-7 |
| INJ-J | not flagged for any J | not flagged (e = 3.00 in all 15 rows) |
| DEL, THIN | beta = 0, bounded integral | abs(beta) <= 0.0075 at all 8000 heights; M < 2e-10 |
| HQ1 | beta = 1 at pole points, 0 elsewhere, e = 1; map factor: 2 | 0.99977 at 800 heights, abs <= 0.0052 at 1200, e = 1.0000; map factor 2.0000 at 800, 3 generic heights of 1200 beyond 0.02 |
| NWM | beta = 0; statistic 2 not applicable | beta between 9.6e-6 and 4.4e-4 at 200 heights; statistic 2 not applicable |
| ETA | eta transformation formula | agreement to 3e-9 or better |

DH, backward heat, sign twist and the other campaign controls are not rows of this census: the object is a
relative product and no statement about zeta is derived (Theorem W, remark (iv): the base is irrelevant).

## 6. What goes to lane 1

- No dense row is a construction target.
- Any twin candidate found by a finite computation of this kind is a statement at resolution about
  1/(V y_c) (statistic 2) or about 0.02 delta_min/t (slopes); a prime set within e^(-lambda_k) of a telescoping
  Beurling sequence is beyond both. A flag cannot be evidence of a twin; only a non-flag carries
  information.
- A proof of the missing lemma for all dense S has to cover the smooth class (log x)^2, where the off-diagonal
  terms cancel the diagonal down to relative size V^(-3/2) (R-b). In class log x with phase + the model is
  Euler's product and the answer is classical (the line is its natural boundary).
- For a resonance-constructed height in lane 1: at generic heights the fluctuation of y is
  (zeta(3)/(4 delta))^(1/2) (class log x) or (zeta(4))^(1/2)/(2 delta) (class (log x)^2) against a pole term log(1/delta);
  a constructed height has to beat that fluctuation, not log(1/delta).

## 7. Requirement flags

- R1 (all primes, multiplicativity essential): NOT established. The dense rows are model frequency
  sequences; the census shows that the reachable statistics do not see whether the frequencies are
  logarithms of primes (section 0, item 4; R-d).
- R2 (height-uniform, every window): NOT established. One window (y_c = 5.5, h = 1.5), finite V, finite sets of
  heights.
- R3 (every control fails at a named step): NOT established; the lane is a census, not an argument. Its own
  positive control failed for statistic 1.
- R4 (reaches the critical line): NOT established. Nothing is derived for zeta.

## 8. Three weakest steps

1. Statistic 1 has no valid positive control as registered, so half of the registered threshold is void.
   The post hoc variants were chosen after seeing the data. The "no twin candidate" statement rests on
   statistic 2 alone.
2. The dense rows are sequences of doubles, not certified sets of primes, and the smooth ones are
   Beurling sequences with exact relations (lambda_k = k, k^(1/2)); the statement "nearest prime to exp(f(k))
   behaves like f(k)" uses the heuristic size f e^(-f) of the difference, not a proved bound. Class (log x)^2 is
   measured only for delta >= 2^-10 and V <= 2^13; classes (log x)^4 and exp(sqrt(log x)) are not tested (D4
   statistic 2 not completed).
3. M(V) is a float64 quantity on one window with a kernel cut; Arb covers 14 single values of I, not M. The
   exponent e is a finite-range fit; "not O(V) up to 2^20" is MEASURED support for the missing lemma on
   these sequences and proves nothing. The V^(5/2) law of R-b is an argument checked against three local
   exponents. REFEREE.md is a second implementation by the same author plus a reading of the claims; no
   independent person or agent has checked this lane.

## 9. Follow-up (one item)

Prove R-b as a lemma: for lambda_k = k^(1/2) (and smooth f with f'' < 0), M(V) is of exact order V^(5/2) on every
window, by Poisson summation and a mean-square bound for the resulting quadratic-phase sums. It would be
the first dense case of the missing lemma in which the diagonal is not the main term, and it tests whether
the lemma can be proved without independence of the frequencies over Q.
