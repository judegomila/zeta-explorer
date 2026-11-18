# c4-stage-collision-law: the stage zeta_X = P_X + chi P_X(1 - .) against zeta, numerically

Lane: numerical companion to c4-fe-stage-rouche-crossing (not read; independent work on the same object). All numerics ran on the compute server through `rhrun` (five units, each 4 cores and 8 GB, longest 78 min; all units have exited or were stopped by exact unit name; none left running). Nothing was run on the Mac except text processing of the JSON outputs.

## Verdict

**precise-obstruction.** Nothing is claimed about zeros of zeta.

1. The stage lemma holds and is proved below: stage zeros leave the line only through double zeros, these need Phi'(t) = 0, i.e. Re sum_{p <= X, k >= 1} log p . p^(-k(1/2+it)) = theta'(t), and the local index is -sign(Phi_lambda Phi_tt). The event is a statement about primes up to X only.
2. MEASURED: the event has a positive, height-independent rate at every fixed a = log X / log T. Its frequency follows the torus model (independent prime phases) at heights 1e5 to 1e20 and decreases slowly towards the Gaussian tail Q(1/a); it is the same for every unimodular twist. It is empty only in the trivial regime sum_{p<=X} log p/(sqrt p - 1) < theta'(t), about X < (log T)^2/16, which holds for all twists.
3. MEASURED: the Rouche inequality |zeta - zeta_X| < |zeta_X| on Re s = 1/2 + c/log T fails on a set of sampled points whose fraction does not shrink with T at fixed (c, a) for a = 0.5 (0.6% to 0.9% at c = 1, 0.1% to 0.2% at c = 2, heights 8e3 to 1e9) and grows for X = log^2 T at c <= 1. It is empty in the sampled window only for (a = 0.25, c = 4) at T = 1e8, 1e9. The lattice translate has the same pass fractions to within 0.004 at T >= 1e6, and Davenport-Heilbronn (two-character stage) has the same pass rates at its height. Failing blocks are not predicted by the prime-only event except where the contour runs through the stage's own off-line zeros (c = 4, a = 0.5).
4. Where the inequality holds on a contour it gives equality of zero counts in a box, not location; the on-line version (sign of Z at the stage anti-points) fails at 0.05% to 0.9% of anti-points for a <= 0.5 and has no failure in 2000-zero windows at a = 0.75 (T = 1e5, 1e6, 1e7), with zero-matching defect rms 0.05 mean spacings there. No stage in the family reproduces the zeros exactly, and no bound on zeta - zeta_X near the line is available: requirement R4 is not met.

The score criterion of the assignment (failure set empty or shrinking at fixed scaled delta as T grows, in a way the controls do not share) is not met.

## Object and conventions

P_X(s) = prod_{p <= X} (1 - p^-s)^-1, D_X(s) = -P_X'/P_X(s) = sum_{p <= X} log p . p^-s/(1 - p^-s) = sum over prime powers n of primes <= X of Lambda(n) n^-s (Re s > 0).
chi(s) = 2^s pi^(s-1) sin(pi s/2) Gamma(1-s), zeta(s) = chi(s) zeta(1-s), chi(1/2+it) = e^(-2i theta(t)).
Stage: zeta_X(s) = P_X(s) + chi(s) P_X(1-s). It is meromorphic, holomorphic in 0 < Re s < 1, real on the real axis, and satisfies zeta_X(s) = chi(s) zeta_X(1-s). (The variant chi(s) P_X(conj s) is not analytic and has all zeros on the line for the trivial reason |chi| != 1 off the line; it is not used here.) The analytic stage has poles on Re s = 1 and Re s = 0 (at 1 + 2 pi i k/log p), and a zero close to each pole; "off-line stage zeros" below means zeros in 0.03 <= (Re s - 1/2) log T <= 4.
Phi(t) = theta(t) + arg P_X(1/2+it) (continuous; P_X has no zeros). The assignment's phi is -2 Phi.
a = log X / log T, c = delta log T, mean spacing = 2 pi/log(T/2 pi).

Prior work known to me (from memory, not checked against the source in this lane): Gonek, "Finite Euler products and the Riemann hypothesis" (2012), and the Gonek-Hughes-Keating hybrid product. The stage and the statement "zeros of the stage are on the line for small X" are theirs; the lemmas below are elementary. What this lane adds: the exact form of the exit event and its index, the measured law in (c, a, T) with ball arithmetic and controls, and the location of the stationary points relative to zeta zeros.

## Lemmas (PROVED, elementary)

**L1 (line form).** On s = 1/2 + it: P_X(1-s) = conj P_X(s), so zeta_X = e^(-i theta) . 2 |P_X| cos Phi(t). Since d/dt log P_X(1/2+it) = -i D_X(1/2+it),
Phi'(t) = theta'(t) - Re D_X(1/2+it), theta'(t) = (1/2) log(t/2 pi) + O(t^-2).

**L2 (complexification).** In 0 < Re s < 1, t > 0, H(s) = chi(s) P_X(1-s)/P_X(s) is holomorphic and zero-free, H = exp(-2i Phi(z)) with z = (s - 1/2)/i and Phi the analytic continuation of the real function of L1 to |Im z| < 1/2; Phi(conj z) = conj Phi(z). Zeros of zeta_X in the strip are exactly the solutions of Phi(z) in pi/2 + pi Z. Real solutions are the on-line zeros.

**L3 (exit only through double zeros; index).** Let Phi_lambda be a family of this form, real-analytic in (t, lambda) (for instance the exponent of one Euler factor moved from 0 to 1, or X fixed and the level moved). Non-real solutions of Phi_lambda(z) = L come in conjugate pairs, and a simple real solution stays real under perturbation (implicit function theorem for the real function). So a zero can leave or join the line at (t0, lambda0) only if Phi = L and Phi_t = 0 there, i.e. Re D_X(1/2+it0) = theta'(t0). At such a point with Phi_tt != 0 and Phi_lambda != 0, Phi - L = Phi_lambda (lambda - lambda0) + (1/2) Phi_tt (z - t0)^2 + higher terms, so (z - t0)^2 = -2 Phi_lambda (lambda - lambda0)/Phi_tt (1 + o(1)): two real zeros on the side Phi_lambda Phi_tt (lambda - lambda0) < 0 and one conjugate pair at distance sqrt(2 |Phi_lambda (lambda - lambda0)/Phi_tt|) on the other. The Brouwer degree of (t, lambda) -> (Phi - L, Phi_t) at the point is -sign(Phi_lambda Phi_tt): -1 when the pair leaves the line as lambda increases, +1 when it joins. Both factors are prime sums: Phi_lambda = -arg(1 - p^(-1/2-it)) for the one-factor family, Phi_tt = theta''(t) + Im D_X'(1/2+it). The same expansion in the level L shows: next to a non-degenerate real stationary point of Phi with value c, every level L on the missed side has a conjugate pair of solutions at distance about sqrt(2 |L - c|/|Phi''|); so real stationary points always come with off-line stage zeros within the range of validity of the expansion.

**L4 (modulus criterion, exact).** For 1/2 < sigma < 1, log |H(sigma+it)| = log |chi(sigma+it)| + integral over u in [1-sigma, sigma] of Re D_X(u+it) du. A stage zero at sigma + it requires the mean of Re D_X(u+it) over u in [1-sigma, sigma] to equal -log|chi(sigma+it)|/(2 sigma - 1) = (1/2) log(t/2 pi) + O(t^-2).

**L5 (trivial regime; holds for every unimodular twist).** |D_X(u+it)| <= sum_{p<=X} log p/(p^u - 1). If sum_{p<=X} log p/(p^(1-sigma0) - 1) < (1/2) log(t/2 pi) - O(t^-2) there is no stage zero with 1/2 < Re s <= sigma0 at height t, and if sum_{p<=X} log p/(sqrt p - 1) < theta'(t) then Phi' > 0 at t. The left side is about 2 sqrt X, so this covers X up to about (log T)^2/16.

**L6 (on-line count for Euler stages).** The number of on-line stage zeros in [t1, t2] is at least |Phi(t2) - Phi(t1)|/pi - 1, and |arg P_X(1/2+it)| <= A_X := sum_{p<=X} arcsin(p^(-1/2)). So it is at least (theta(t2) - theta(t1))/pi - 2 A_X/pi - 1. This uses that P_X is zero-free with a bounded logarithm on the line, i.e. the Euler product at stage level.

**L7 (identity).** At t not a zeta zero, Re (zeta'/zeta)(1/2+it) = -theta'(t) (from zeta = e^(-i theta) Z with Z real). Hence Phi'(t) = Re[-zeta'/zeta - D_X](1/2+it): the stationarity event is the event that the real part of the truncated prime sum equals the real part of the full logarithmic derivative on the line, and Phi' is the real part of what the truncation leaves out.

## Decisive test: what was run

Code: `stage.py` (main), `longscan.py` (prime-only event at heights to 1e20), `wiggle.py` (location of the intervals Phi' < 0), `summary.py`, `tables.py` (text only). Outputs: `out_8e3.json`, `out_1e5_h.json`, `out_1e6_h.json`, `out_1e7_h.json`, `out_1e8.json`, `out_1e9.json`, `out_dh.json`, `longscan.json`, `wiggle_1e6.json`, `wiggle_1e8.json`; all tables in `TABLES.md` (A to G) and `tables_full.txt`; unit logs with the planned-memory lines in `logs/`.

- Heights T = 8e3, 1e5, 1e6, 1e7, 1e8, 1e9 (1e9 added; 1e10 not run: estimated 2.5 h for one more point). Window: 2001 consecutive zeta zeros starting at index N(T)+1, from `acb.zeta_zeros` (certified isolation, exact index), stored relative to floor(first zero).
- X in {log^2 T, T^0.05, T^0.1, T^0.25, T^0.5}; T^0.75 for the line statistics at T = 1e5, 1e6, 1e7 (float64 only).
- (a) Phi' and e^(i theta) P_X on a grid of 64 points per mean spacing; stationary points = sign changes of Phi'; on-line stage zeros and anti-points (Phi = k pi) by bisection; off-line stage zeros by cell winding of the stage on a 48 x 32000 grid (0.03 <= c <= 4, 16 points per spacing), Newton, then for the zeta family an arb point-Newton and an interval-Newton certificate (N(B) inside B, radius 1e-12).
- (b) zeta zero n paired with the stage zero at level Phi = (n - 2 + 1/2) pi (the offset 2 minimises the rms in every run); defect in mean spacings. At each anti-point with Phi = k pi: count error e = N(t) - (k+1) (e = 0 for all anti-points in a window gives 2000 sign changes of Z interlacing the stage).
- (c) r = |zeta - zeta_X|/|zeta_X| on Re s = 1/2 + c/log T, c in {0.5, 1, 2, 4, 8}, 16 points per spacing (about 32000 points per line). zeta by `acb.zeta` at 128 bits; the zeta-family stage by arb (sums of logarithms of the Euler factors); each r classified by ball comparison. Over all rows reported there is no undecided point. Controls on these lines use the float64 stage against the arb value of the true function (screen).
- Float64 side: prime phases T0 log p mod 2 pi from mpmath at 40 digits, theta in 80-bit long double. Agreement with the arb stage: relative 5.6e-13 (1e5) to 2.2e-9 (1e9); on every line the float and arb classifications of r < 1 agree, except at (a = 0.5, c = 8) for T = 1e7, 1e8, 1e9 (141, 53 and 19 points).
- One defect found and fixed during the run: products of about 10^3 complex balls lost all precision by wrapping (first 1e7 and 1e8 passes returned undecided balls at a = 0.5, c >= 4); the product is now a sum of logarithms and those heights were rerun. The first interval-Newton pass used radius 1e-9 around float roots and failed at T >= 1e6; it now refines in arb first. The files kept are from the corrected code, except `out_8e3.json` (24 primes; all balls decided, all 574 off-line zeros certified).

## Results

All numbers MEASURED unless marked. Full tables in `TABLES.md`.

**(a) Stationary points and stage zeros (Table A, E, F, G).**

| X | T | stationary points in 2000 zeros | fraction of line with Phi' < 0 | arb-certified negative minima of Phi' | on-line stage zeros / zeta zeros | off-line stage zeros (interval-Newton certified) | smallest c of an off-line zero |
|---|---|---|---|---|---|---|---|
| T^0.1 | all | 0 (PROVED by L5: 4.5 < 8.3 at 1e8) | 0 | - | 1999..2000 / 2001 | 0 | - |
| T^0.25 | 1e5, 1e6, 1e7, 1e8, 1e9 | 10, 4, 2, 0, 2 | 1.1e-3 .. 0 .. 4e-4 | 5, 2, 1, -, 1 | 1999..2000 / 2001 | 1, 0, 0, 0, 0 | 3.93 |
| log^2 T | 1e5 .. 1e9 | 204, 82, 48, 10, 8 | 2.4e-2 .. 1.1e-3 | all checked | 1999..2001 / 2001 | 71, 17, 0, 0, 0 | 1.62 |
| T^0.5 | 1e5 .. 1e9 | 434, 362, 342, 326, 296 | 0.047, 0.042, 0.039, 0.036, 0.035 | 217, 181, 171, 163, 148 (all) | 2000..2001 / 2001 | 295, 245, 201, 184, 166 (all) | 1.8 .. 2.4 |
| T^0.75 (float) | 1e5, 1e6, 1e7 | 1494, 1358, 1318 | 0.152, 0.141, 0.137 | - | 2000 / 2001 | not scanned | - |

- Prime-only event at large height (Table E, 4e6 random t per row, or 4e5 where more than 1500 primes): at a = 0.25 the fraction of t with Phi' < 0 is 1.1e-3, 5.7e-4, 2.7e-4, 1.7e-4, 1.2e-4, 9.1e-5, 6.9e-5, 4.8e-5 at T = 1e5, 1e6, 1e7, 1e8, 1e10, 1e12, 1e16, 1e20; torus model 1.2e-3, 5.6e-4, 2.5e-4, 1.6e-4, 1.1e-4, 8.3e-5, 5.8e-5, 4.3e-5; Gaussian tail 3.1e-4 down to 5.1e-5, limit Q(4) = 3.2e-5. At a = 0.5: zeta 0.044, 0.041, 0.039, 0.037, 0.034 (1e5 .. 1e10), torus 0.044, 0.039, 0.036, 0.034, 0.031, limit Q(2) = 0.023. At a = 0.2: 1.4e-4 down to 7.5e-7 (three events in 4e6 samples at 1e20), limit Q(5) = 2.9e-7. The zeta fraction exceeds the torus fraction by about 7% at a = 0.5 (28 standard errors at 1e8); at a <= 0.4 the two agree within sampling error.
- Reading: at fixed a the event has a positive limiting rate, of the order of the Gaussian tail Q(1/a). It never becomes empty at fixed a; it becomes empty only if a -> 0 (for X = log^2 T the rate is about Q(log T/(2 log log T)), and L5 covers X < (log T)^2/16 rigorously).
- Location (Table F): for zeta the intervals Phi' < 0 sit at anti-points of the stage, inside large gaps of zeta zeros: median |cos Phi| at the minimum of Phi' is 0.992 to 0.996, 93% to 100% of intervals have |cos Phi| > 0.9, the containing zeta gap has median 1.7 to 2.3 mean spacings, and the drop of Phi across an interval is at most 0.50 pi. For two random unimodular twists the same intervals have median |cos Phi| 0.67 to 0.82 and 23% to 42% above 0.9 (uniform phase gives 29%). Consequences seen in Table B: for zeta no stage level is crossed more than once in any run (0 of about 66000 zero-level pairings over all runs and X, including T^0.75 with 14% to 15% of the line at Phi' < 0), while the twist has up to 34 multiply crossed levels per window at a <= 0.5 and 96 to 112 at a = 0.75; the zeta stage's off-line zeros stay at c >= 1.6, the twists' come down to c = 0.1.
- So for zeta the stationary event marks a large gap (Phi flattens and slightly reverses in the middle of the gap), not a near-collision of zeros: at a close pair Phi' is large and positive. A stage zero pair can leave the line only if Phi reverses by about pi/2 around an anti-point, which is a statement that the stage's count function decreases; the observed maximum reversal is 0.50 pi at a = 0.5 and was not followed to larger X or longer windows.

**(b) Stage zeros against zeta zeros (Table B, G).**

| X | rms defect, 1e5 .. 1e9 (mean spacings) | max defect | fraction of anti-points with wrong zero count, 1e5 .. 1e9 |
|---|---|---|---|
| T^0.05 (0 or 1 prime) | 0.32, 0.34, 0.31, 0.32, 0.33 | 1.0 .. 1.1 | 0.12, 0.14, 0.11, 0.12, 0.13 |
| T^0.1 | 0.23, 0.26, 0.25, 0.27, 0.26 | 0.8 .. 0.9 | 0.031, 0.053, 0.041, 0.058, 0.058 |
| T^0.25 | 0.155, 0.162, 0.173, 0.176, 0.174 | 0.45 .. 0.65 | 0.0020, 0.0035, 0.0080, 0.0090, 0.0045 |
| log^2 T (a = 0.42 .. 0.29) | 0.088, 0.106, 0.123, 0.139, 0.151 | 0.28 .. 0.50 | 0, 0, 0.0020, 0.0040, 0.0035 |
| T^0.5 | 0.073, 0.078, 0.078, 0.081, 0.080 | 0.24 .. 0.31 | 0, 0.0005, 0.0014, 0.0009, 0.0005 |
| T^0.75 (float; 1e5, 1e6, 1e7) | 0.047, 0.049, 0.051 | 0.13 .. 0.16 | 0, 0, 0 |

The defect is a function of a, flat or slowly growing in T at fixed a, and decreases roughly like 1/a. The anti-point sign law (which, with the known count, would give all zeros of the window on the line) fails at a positive rate for a <= 0.5 with no downward trend in T; at a = 0.75 no failure occurred in three 2000-zero windows, which does not distinguish rate 0 from a rate below about 1e-3. Failing anti-points are not predicted by Phi' < 0 (Table D, heights 1e5, 1e7, 1e9: no failing block contains the event, 0 to 16 failing blocks per window do not; at 1e6 and 1e8, a = 0.5, the 1 and 2 failing blocks do contain it).

**(c) Rouche ratio (Table C, D).** Fraction of sampled points with r < 1 (arb-decided), heights 8e3, 1e5, 1e6, 1e7, 1e8, 1e9:

| X | c = 0.5 | c = 1 | c = 2 | c = 4 |
|---|---|---|---|---|
| T^0.1 | 0.60 .. 0.64 | 0.67 .. 0.71 | 0.80 .. 0.84 | 0.94 .. 0.98 |
| T^0.25 | 0.800, 0.792, 0.782, 0.764, 0.766, 0.767 | 0.880, 0.875, 0.867, 0.852, 0.857, 0.857 | 0.986, 0.988, 0.985, 0.978, 0.976, 0.979 | 0.9932, 0.9989, 0.9992, 0.9999, 1 (all 31998 points), 1 (all points) |
| log^2 T | 0.951, 0.922, 0.893, 0.864, 0.835, 0.806 | 0.994, 0.983, 0.966, 0.946, 0.925, 0.896 | 0.9973, 0.9997, 0.9985, 0.9996, 0.9962, 0.9954 | 0.933, 0.974, 0.991, 0.996, 0.9987, 0.9996 |
| T^0.5 | 0.954, 0.951, 0.945, 0.945, 0.941, 0.944 | 0.9935, 0.9941, 0.9916, 0.9932, 0.9931, 0.9915 | 0.9975, 0.9991, 0.9984, 0.9987, 0.9987, 0.9980 | 0.927, 0.943, 0.950, 0.955, 0.958, 0.959 |

- Sub-windows of 16 mean spacings with r < 1 at every sampled point: a = 0.5, c = 1: 0.59 to 0.68; c = 2: 0.82 to 0.94; sub-windows of 256 spacings: 0 at c = 1, 0.14 to 0.57 at c = 2. The whole 2000-zero window holds only for (T^0.25, c = 4) at 1e8 and 1e9, and for c = 8 at T <= 1e6 (there Re s >= 1.08: the region right of 1, where both functions are close to P_X).
- c = 8 at T >= 1e7 is Re s = 0.89 to 0.996, next to the stage's poles on Re s = 1; the fraction falls to 0.83 to 0.996 and the float stage loses accuracy there (the only float/arb classification mismatches).
- Law in (c, a): the pass fraction rises with c a = delta log X until the contour reaches the stage's own off-line zeros (c about 1.6 to 2.4 at a = 0.5); between the two there is a band (c = 1 to 2 at a = 0.5) with 0.1% to 0.9% failing points, constant in T. At fixed c the row X = log^2 T (a decreasing) gets worse with T for c <= 1.
- Prediction by the prime-only event (Table D, 4-spacing blocks, [fail and event, fail without event, event without fail, neither]): a = 0.5, c = 1 at 1e9: [23, 33, 128, 315]; c = 2: [6, 6, 145, 342]; c = 4: [140, 72, 11, 276]; a = 0.25, c = 2: [0, 72, 2, 425]. The event predicts failure only at c = 4, a = 0.5, where the contour passes the off-line stage zeros attached to the stationary points (L3). Elsewhere failures occur without the event and the event occurs without failure: they come from zeta/P_X, the part the primes up to X do not see.

## Controls

| control | outcome | step |
|---|---|---|
| Davenport-Heilbronn (conductor 5; stage Q_X + chi_5 Q_X(1 - .), Q_X = c P_X(chi) + conj(c) P_X(conj chi); heights 8329 to 9900, 2001 on-line and 111 off-line true zeros from the c2 lane's list; functional equation of the arb evaluation checked to 1.7e-11) | Shares (c): fractions 0.953, 0.987, 0.994, 0.916, 1 at a = 0.5 and c = 0.5, 1, 2, 4, 8, against zeta's 0.954, 0.994, 0.998, 0.927, 1 at 8e3. Its stage also tracks its off-line zeros: median distance 0.07 to 0.09 mean spacings from a true off-line zero to the nearest off-line stage zero (first 60, a = 0.45 and 0.5). Differs in (a): 1981 on-line stage zeros against 2001 (2128 to 2222 at small X), off-line stage zeros down to c = 0.2, min Phi'/theta' = -139 to -188 against -1.1 for zeta at the same height. | The Rouche comparison and the matching do not use the Euler product. The steps that fail for DH are L5 and L6: Q_X has zeros in the strip, so -Q_X'/Q_X is not a bounded prime sum and arg Q_X is not bounded; these are stage-level statements. |
| Random unimodular twist u_p (one seed in the main runs, two in `wiggle.py`), chi imposed, compared with zeta | Shares (a) in law: 304 against 326 stationary points at (1e8, a = 0.5), fractions 0.0346 against 0.0363, and Table E. Fails (b) and (c): rms defect 0.5 to 0.57, 33% to 40% of anti-points wrong (a >= 0.25), r < 1 at 35% to 74% of points (a = 0.5). Its stationary intervals are not phase-locked to its levels. | L3, L4, L5, L6 hold verbatim for every twist (the event is invariant under torus rotation), so the event carries no information about zeta. What the twist lacks is any relation between its stage and a function with zeros. |
| Lattice translate (chi taken at height t - alpha, alpha = 50 mean spacings, alpha log(tA/2 pi) in 2 pi Z) | Passes everything at T >= 1e6 with the same numbers as zeta (Tables B, C: pass fractions differ by at most 0.0004 at 1e6 and 0.004 at 1e7 to 1e9; rms defects by at most 7e-5); at 8e3 the drift alpha W/T is 4 rad over the window and it fails (rms defect 0.83). | No step fails locally; the difference is non-local in height, as recorded in the map (controls section, WT). |
| Backward heat, sign-twisted primes, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | Not run. | - |

## Requirement flags

- **R1 (multiplicativity essential): false.** The Euler product enters L5 and L6 (zero-free P_X, bounded prime sum for Phi'), which are stage-level and hold for every unimodular twist. The measured law (b), (c) is shared by the DH two-character stage, which has no Euler product. Evidence: Table C DH rows; DH off-line tracking.
- **R2 (height-uniform, every window): false.** Failure fractions at fixed (c, a) are constant in T (a = 0.5) or growing (log^2 T, c <= 1); every sub-window length beyond 256 spacings fails at c <= 2; the stationary event has a positive limiting rate at each fixed a (Table E to 1e20). The one empty case, (a = 0.25, c = 4) at 1e8 and 1e9, is one sampled window per height, consistent with a small positive rate.
- **R3 (fails for every control for a structural reason): false.** The lattice translate passes with the same numbers to within 0.004; DH passes (c) at the same rates; only the random twist fails, and for the reason that its stage is unrelated to zeta. Seven controls were not run.
- **R4 (reaches the critical line): false.** Rouche on Re s = 1/2 + c/log T gives equality of counts in a box and was verified only at sampled points; the on-line sign law fails at a positive rate for a <= 0.5; the defect is about 0.05 mean spacings at a = 0.75 and no stage is exact. No inequality between zeta and zeta_X near the line was proved.

## What survives

- PROVED: L1 to L7 (elementary).
- CERTIFIED at the points listed (arb): 2762 negative local minima of Phi' (all that were checked); 2302 off-line stage zeros by interval Newton (all that were found for the zeta family, T = 8e3 to 1e9); every reported r < 1 or r > 1 on the zeta-family Rouche lines at about 32000 points per line. These are statements about the explicit finite object zeta_X and about values of zeta at sampled points.
- MEASURED: the laws in the Results section; the phase-locking of the stationary intervals to anti-points inside large zeta gaps, with no multiply crossed level in any zeta run and up to 112 per window for the twist.

One adjacent idea was examined as the single pivot (`longscan.py`, `wiggle.py`): whether the prime-only event itself separates zeta from the torus model. Its frequency does not, except for a 7% excess at a = 0.5, where the fourth and higher moments of the prime sum already involve prime pair correlations (X^2 = T). Its phase does (Table F), and L7 explains why: Phi' is the real part of the tail of -zeta'/zeta on the line, which is negative in the middle of a large gap. That is a property of how zeta's zeros shape the truncated prime sum; it gives no constraint on the zeros.

## Three weakest steps

1. **Sampling.** The Rouche statements are at 16 points per mean spacing on vertical lines; the horizontal sides of a contour and the continuum between samples were not checked, so "the whole window holds" is a statement about 32000 points. Completeness of the off-line stage-zero lists rests on float64 cell winding on a 48 x 32000 grid (some cells with opposite winding appear at a = 0.5, which is aliasing: for example 186 cells, net 186, 184 distinct zeros at 1e8; 627 cells, net 565, 574 zeros at 8e3), so the counts are lower bounds on that region.
2. **Controls.** DH was run at one height (8.3e3 to 9.9e3) with a float64 stage and float64 zeros from another lane; one random-twist seed in the main runs; seven listed controls not run. The statement "DH shares the Rouche law" compares DH at 9e3 with zeta at 8e3 only.
3. **Extrapolation of the law.** "Constant in T at fixed (c, a)" rests on one 2000-zero window at each of six heights; rates below about 1e-3 per zero (the sign law at a = 0.75, the case a = 0.25, c = 4) are not resolved. The limit Q(1/a) for the event rate is proved only for the torus model; for zeta at X = T^a it is a measured agreement (within 7%), since moments of order above 1/a are not diagonal.

## Files

`tmp/research-2026-11-16/push/c4-stage-collision-law/`: `RESULT.md`, `TABLES.md`, `tables_full.txt`, `stage.py`, `longscan.py`, `wiggle.py`, `summary.py`, `tables.py`, `out_*.json`, `longscan.json`, `wiggle_*.json`, `dh_zeros2.npy` (copied from `push/c2-euler-at-zeros-scale/`), `logs/`. Server copy: `~/rh-push/c4-stage-collision-law/`.
