# s5-klein-torus-shift-bridge-charts: screening of four combinations (2026-11-19/20)

Screening arm. Four proposed combinations of nodes of the idea graph were turned into finite computable statements, run for zeta, Dirichlet L-functions and the controls, and classified. Nothing here is a statement about the zeros of zeta beyond the sizes sampled. Labels: PROVED (derived here or in the cited source), CLASSICAL, MEASURED. "Certified" for a sign of a pivot means: ball arithmetic (python-flint), the ball excludes zero, input radii included.

## 1. Verdict

No survivor. All four combinations are closed.

| # | combination | statistic | sizes reached | zeta | comparison L-functions | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | Jacobi chart, involutions, end charts, conormal family | Fourier modes in u of log F on circles v = const; energy E_k(v) of the modes of log abs F and arg F; second difference in v; parity under A | completed function: L = 100, N = 2^16, 12 circles, k <= 20000, r in {1.5, 3, 10}; arithmetic factor: L = 1e4 (N = 2^22, k <= 1e5), L = 1e6 (N = 2^22, all 2,097,151 modes) | convex on every triple of circles (0 violations in 914,347 mode triples); at every k one of the two energies is not log-convex (k = 1 to 8 measured, 5-digit agreement with the prediction); arg F does not vanish on the seam | L(chi_-4): same as zeta | TNR, TNRQ, EA, DH: non-convex only on triples across which the winding number changes (a zero circle), then in 9 to 33% of the modes; 0 violations elsewhere (3 marginal for EA). WT passes the A-parity test (it has a unitary functional equation). HEAT, sign twists: not formulable | closed: harmonic transport (PROVED for every F); the only separating events are zero circles = argument principle; the parity is the functional equation |
| 2 | conformal Schur window, closure routes, shift bridge | inertia of the n x n Pick matrix of S_a with strip denominators sinh(c w_i) + conj sinh(c w_j), c = pi/(2Y), nested Halton nodes in abs Im w <= gamma_off/4 | n = 300 at 4000 bits (200 at 3000 bits for HEAT), 10 to 12 values of Y per object, signs certified | positive at every Y and n, including the linear kernel | L(chi_-4), L(chi_5): positive at every Y and n | every control is positive at every listed Y <= gamma_off - b and has its first negative pivot at a listed Y between gamma_off - b and 1.10 gamma_off: DH Y*(300) = 90 = 1.05 gamma_off; HEAT Y*(200) = 123 = 1.10; EA Y* = 14.13 (gamma_off - b = 14.01, gamma_off = 14.135); TNR Y* = 2.6 (2.456, 2.860); TNRQ Y* = 0.215 (0.195, 0.227). Below gamma_off - b the pivots of EA, TNR, TNRQ, HEAT agree with those of zeta to 3 digits of their logarithm; those of DH lie within 1 to 3% of L(chi_5) and L(chi_-4) | closed: the strip is a window; positive by theorem until the window reaches the half-disc of the off-line zero. Verified height in window form |
| 3 | T3 split built from Phi, hidden square, shift dictionary | r(a, T) = -lambda_min(K0^(-1/2)(D_R + K^S)K0^(-1/2)) = 1 - mu_min(K_a, K_{a,0}); its sign is the inertia of the linear Pick matrix of S_a | split validated against the recorded certificate (beta_R, beta_S to 11 digits); r itself for n <= 40; inertia for n = 400 (T = 50, 200), n = 600 (T = 2000), controls n = 300 (HEAT 200), a in {0.4, 0.2, 0.1, 0.05, 0.02} | r < 1 on every set; 1 - r = 3.7e-32 at heights <= 30, n = 40 | r < 1 on every set | r > 1 below 0.5 gamma_off for every control with a < b: DH order 113 (relative pivot 1e-167), HEAT 94 (1e-173), EA 7 (1e-15), TNR 4 (1e-5), TNRQ 6 (1e-7); r < 1 at every order for a > b | closed: analytic continuation. The order and the number of digits grow linearly with the distance to the off-line zero (DH: 3.9 digits per unit height). Row G2 of the map with the control onsets measured |
| 4 | pair shear formula, frozen block, winding identity, leakage | prime-side smoothed A_X(x, t) = Re sum over zeros of (1 - Phi(rho - s))/(s - rho) on x = c/log t, minus the frozen block of listed on-line zeros, minus the smooth tail | zeta: primes to 1e10 (455,062,595 prime powers) at 8,388,608 heights around 1e10; also (T, X) = (1e8, 1e8), (1e6, 1e8), (1e6, 1e6), (1e10, 1e6); 24 to 40 windows with zero lists | remainder <= 0.21 of the tolerance in all 168 windows; ghost count 0 in every window | L(chi_-4) at T = 1e4, X = 1e8: remainder <= 0.06 of the tolerance | DH, TNR, EA fail outside the disk q < 4b^2 when x < b, with amplitude X^(b-x): DH excess 1e-3 at distance 32 below its first off-line pair for X = 1e7; TNR below the bound at 38 to 50% of the heights outside the disks; for x > b all pass. Sign twists: A_X has mean 0 and is negative at half of the heights. HEAT: no coefficients | closed: the classical zero-detecting sum. The reach in height is (X^(b-x)/tol)^(1/5)/eta; it is O(1) for b = O(1/log X). Controls fail through a local property of their coefficients (no Euler product, or a non-tempered factor) |

Where the object enters: (1) through its values on closed curves, i.e. through its zeros (winding) and its functional equation, not through coefficients; (2), (3) through its values at the nodes, i.e. by analytic continuation of S_a towards its poles; below the first negative order the pivots of a control are those of a function with all zeros on the line and the same gamma factor and conductor (Euler-blind); (4) through its coefficients, and through the listed zeros in the frozen block.

## 2. Objects, controls, code

s = 1/2 + w. X(w) is the completed function, even in w and real on the real axis for every object with the symmetry s <-> 1-s.

| code | object | off-line zeros used (b = Re rho - 1/2, gamma) |
|---|---|---|
| ZETA | s(s-1) pi^(-s/2) Gamma(s/2) zeta(s) | none to the heights used |
| LCHI4, LCHI5 | L(s, chi_-4) (odd), L(s, chi_5) (even real character mod 5), completed, by Hurwitz zeta | none found |
| EA:1/8 | zeta(s+a) zeta(s-a), a = 1/8 | every zero, b = 1/8; first gamma = 14.1347 |
| TNR | zeta(s)(1 + 2.2 * 3^(1/2-s) + 3^(1-2s)) | b = 0.40375, gamma = (2k+1) pi/log 3 = 2.8596, 8.5788, ... |
| TNRQ | the same with q = 1000003 | b = 0.032107, gamma = 0.22740 (2k+1): spacing 0.4548 at every height |
| DH | Davenport-Heilbronn, battery zero table (strip -0.5 <= Re s <= 1.5, height 2000) | 84 pairs; first (0.30852, 85.6993), (0.15083, 114.1633) |
| HEAT:-0.5 | backward heat family, tau = -0.5 (battery quadrature) | first (0.24296, 111.6942), (0.19811, 150.6922) |
| WT | zeta(s + i alpha), alpha = 1.2393 (unimodular twist; a translate) | none; zeros on the line |
| LIOU, SGN:7, SGN:8 | sign twists: lambda(n) Lambda(n) and eps_p = +-1 by a seeded hash (prime side only) | no completed function |

Files (this directory). `objs.py` (objects; `core.py`, `heatlib.py` are copies of the battery code), `pick.py` (combinations 2 and 3: Pick matrices, LDL* in ball arithmetic), `k0.py`, `c3r.py` (the split from Phi), `klein.py`, `klein_an.py` (combination 1), `explicit.py`, `explib.py`, `explicit_an.py`, `zeros_win.py`, `dh_reach.py` (combination 4), `mk_jobs.py`, `run_*.sh` (server units), `pick_sum.py`, `tables.py`. Full tables: `out/TABLES.md`. Results: `out/*.json`; the large arrays (`out/ex_*.npz`, `out/kl_*.npz`) stay on the server in `~/rh-push/s5-klein-torus-shift-bridge-charts/`. Server units: `rh-s5kt-pick`, `-pick2` (5 cores), `-b`, `-b2`, `-c` (3 cores), `-d`, `-e` (5 cores), `-f` (1 core); at most 8 cores at a time; all ended or stopped (section 9). No GPU was used.

## 3. Validation (cases with known answers)

| check | result |
|---|---|
| objects: evenness and reality of X; a known zero of each | relative 1e-36 at 128 bits; abs X at the first zero of L(chi_-4), L(chi_5): 1.5e-16, 8.7e-17 (input ordinate to 14 digits); DH at (0.30852, 85.6993): 6e-43; TNRQ at its first off-line zero: 6e-13 against 1984 at distance 0.1; HEAT at its first off-line zero: 1e-49 |
| Pick engine (`tests/val_pick.py`, same nodes as the DH geometry, n = 200, 4000 bits) | Blaschke product of 6 factors: 6 positive pivots, the 7th undetermined (rank 6); exp(-w) and exp(-w)(w-3)/(w+3): 200 positive pivots; cosh(w-a)/cosh(w+a): positive, and the determinants of the leading minors of orders 138 to 140 computed independently by acb_mat.det are positive |
| the split K_a = K_{a,0} + D_{a,R} + K_a^(S) (`k0.py`) | identity against the kernel computed from zeta values: relative 1.1e-38; recorded certificate a = 1/4, z = (-1/2, 0, 1/2) + i/5: beta_R = 1.0272860168029 (record: > 1.027286016), beta_S = 0.42200180358824 (record: > 0.42200180358); the least eigenvalue of G_R + G_0 is -2.6e-10 (record: negative) |
| Phi of the controls (`c3r.py`) | 8 int Phi cos(2 lambda u) du against X(i lambda) at lambda = 3: ratio 1 to 25 digits for ZETA, DH, TNR; Phi_DH > 0 on the grid |
| prime-side identity (`tests/val_explicit.py`: zeta, t in [990, 1010], X = 1e6) | A_X against the kernel sum over the 3474 zeros below 4000: 2.790458e-5, equal to the deviation of the Lorentzian sum from Re xi'/xi by Arb (2.790458e-5): the two agree to 2e-12; the common part is the tail beyond 4000 |
| the same identity for DH (all strip zeros in the block, t in [10, 160], X = 1e4 to 1e7) | remainder <= 3.5e-6 |
| bump transform (`tests/val_betahat.py`) | closed form against quadrature: 5.6e-15 |
| circles: pole of zeta at s = 1 in the arithmetic-factor mode (`kl_ZETAar_L100`) | winding -1.000000 on the circles that enclose s = 1 and 0 on the others; non-convexity exactly on the two triples that straddle it |

Defects found and corrected before any number below was produced. (i) The first version of `pick.py` took the sign of a pivot from its float64 value: pivots below 1e-308 became 0.0 and were counted as negative (zeta showed "negative" pivots from order 139). Signs are now taken from the ball; the S values carry the radius 2^(16-bits). All earlier local numbers were discarded. (ii) In float64 the completed function is unusable on the chart for L >= 1e4: ds/du reaches L/abs(1-w)^2 near the puncture and the winding number of the first L = 1e6 circle came out as -2.93 + 0.33i. For L >= 1e4 the arithmetic factor zeta'/zeta is sampled alone (it is 2^(-Re s) near the puncture); the float64 file is kept as `kl_ZETA_L1e6_float64_invalid.npz` on the server and is not used. (iii) The circle xmin = 0.5 passes through s = 1 exactly, where the Hurwitz terms of DH and L(chi) are infinite; triples containing that circle are excluded and replaced by circles at 0.45 and 0.6.

## 4. Combination (1): Jacobi chart, involutions, end charts, dual conormal family

Definitions (KLEIN-ANNULUS.md sec 3; PROVED there). m = r^-4, z = 4Ku + 2iK'(v - 1/2), w = (i/r) sn(z|m), s = 1/2 + L(1/(1-w) - 1/2). Annulus 1/4 <= v <= 3/4 is Re s >= 1/2. A(u, v) = (1/2 - u, 1/2 + v) is s -> 1 - conj s on the other sheet. Sampled: h(u) = d/du log F(s(u, v)) = (F'/F)(s) ds/du, single valued; hhat_k its Fourier coefficients; hhat_0/(2 pi i) the winding number; c_k = hhat_k/(2 pi i k) the modes of log F; a_k, b_k the modes of log abs F and arg F.

What is proved before any computation (two lines each):
1. Parity. If F(1-s) = F(s) and F(conj s) = conj F(s), then f o A = conj f, so log abs F is even under A and arg F is odd. The odd part of log abs F is identically zero; the "odd-part mode energy" of the proposal is the mode energy of arg F. The same holds for every F with abs F(1 - conj s) = abs F(s), in particular for WT.
2. Transport. On a sub-annulus v1 < v < v2 without zeros or poles of F, h is holomorphic and periodic in z, so hhat_k(v) = hhat_k(v1) exp(-kappa_k (v - v1)), kappa_k = pi k K'/K. Hence a_k(v) = alpha e^(-kappa x) + beta e^(kappa x) and E_k = abs a_k^2 has second derivative 4 kappa^2 (abs alpha^2 e^(-2 kappa x) + abs beta^2 e^(2 kappa x)) > 0: E_k is convex in v there, for every F. Likewise for b_k.
3. Log-convexity fails in general: (E E'' - E'^2)/(4 kappa^2) = 4 abs(alpha beta)^2 + 2 Re(alpha conj beta)(abs alpha^2 e^(-2 kappa x) + abs beta^2 e^(2 kappa x)), which is negative whenever Re(alpha conj beta) < 0 and the two exponentials are unbalanced. The deck involution D gives c_(-k) = (-1)^k c_k up to the transport factor, so for log abs F and for arg F the products alpha conj beta are opposite: at each k exactly one of the two energies is not log-convex near the seam. The curvature is of the size 8 kappa_k^2 abs(beta/alpha) e^(2 kappa_k x); on the circles used below abs(beta/alpha) e^(2 kappa_k x) = 0.121^k, so it falls below the rounding of the modes after about ten modes.
4. Across the circle of a zero at (u0, v0) every mode jumps: hhat_k changes by 2 pi i e^(-2 pi i k u0) (up to the transport factor), and hhat_0/(2 pi i) by 1.
5. On the seam v = 1/4 the function F is real, so arg F is pi times a step function with a step at every zero on the line. It does not vanish.

So the stated pass condition is false for zeta in two of its three parts (log-convexity, vanishing on the seam), and its convexity part is a theorem for every F away from zero circles. The fail condition ("non-convex on circles whose image stays at distance > 1 from all off-line zeros") cannot occur. The computation checks the code against these statements and measures where the controls differ.

Finite consequences tested: (a) relative odd part of log abs F between the circle xmin and its A-image; (b) transport residual between consecutive circles; (c) second divided difference of E_k on consecutive triples of circles, counted as a violation below -1e-6 of the scale; the same for log E_k; (d) winding numbers. Circles are labelled by xmin = Re s - 1/2 at their point nearest to s = 1/2. Resolution: a circle is resolved by N samples when xmin >= about 13.7 L/N (r = 1.5).

Results (MEASURED; all rows in `out/TABLES.md`, table T1).

A mode enters the count of a triple when its energy on all three circles exceeds 1e-16 of the largest mode energy of the triple (amplitude 1e-8; the float64 floor of a mode is about 1e-13 of the largest). Counts: non-convex modes for (log abs F, arg F), then the number of mode triples.

| run | circles (xmin) | winding | triples without a zero circle | triples across a zero circle | odd part of log abs F under A, max relative |
|---|---|---|---|---|---|
| ZETA, completed, L = 100, r = 1.5, N = 2^16 | 0.02 to 2.5 (12) | 0 on all | 0, 0 of 29,816 (10 triples) | none | 9.8e-8, 9.3e-9 |
| ZETA, completed, r = 3; r = 10 | 0.1 to 0.9 (6 each) | 0 | 0, 0 of 4191; 0, 0 of 3798 | none | 1.9e-8; 9.4e-8 |
| ZETA, arithmetic factor, L = 100, N = 2^16 | 0.02 to 2.5 (12) | -1 for xmin < 0.5 (the pole at s = 1), 0 above | 0, 0 of 21,333 (8 triples) | 2113, 1803 of 4585 (the pole circle, 2 triples) | not applicable |
| ZETA, arithmetic factor, L = 1e4, N = 2^22, k <= 1e5 | 0.05, 0.06, 0.07, 0.3, 0.35, 0.4 | -1 on all | 0, 0 of 399,935 (4 triples) | none | not applicable |
| ZETA, arithmetic factor, L = 1e6, N = 2^22, k <= 2,097,151 | 6, 7, 8 (Re s >= 2.8) | 0 | 0, 0 of 455,274 (amplitude mask 1e-6; k from 187,279 to 741,857) | none | not applicable |
| L(chi_-4), completed, L = 100, N = 2^15 | 0.05, 0.1, 0.15, 0.3; 0.3, 0.45, 0.6 | 0 | 0, 0 of 8440 (3 triples) | none | not run (see below) |
| WT, L = 100 | 0.1, 0.3, 0.5 | 0 | 0, 0 of 1448 | none | 9.8e-8 |
| DH, L = 100, N = 2^15 | 0.05 to 0.3 (12); 0.3, 0.45, 0.6 | 2 for xmin <= 0.12, 0 for xmin >= 0.15 | 0, 0 of 63,783 (9 triples) | 996, 1009 of 10,654 (2 triples) | not run |
| TNR, L = 10, N = 2^14 | 0.03 to 0.6 (14) | 6, 6, 6, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 0 | 0, 0 of 4721 (7 triples) | 1363, 1388 of 4284 (5 triples) | 7.4e-9 |
| TNRQ, L = 1, N = 2^14 | 0.004 to 0.1 (12) | 6, 6, 4, 4, 4, 4, 4, 2, 2, 2, 0, 0 | 0, 0 of 2535 (4 triples) | 1448, 1432 of 5758 (6 triples) | 1.4e-7 |
| EA:1/8, L = 30, N = 2^15 | 0.02 to 0.15 (10) | 12.01, 8.58, 6, 6, 6.01, 4, 4, 4, 2, 2 | 0, 3 of 11,556 (2 triples; the 3 at -1.2e-4, next to a circle with winding 6.007, under-resolved) | 13,711, 12,735 of 41,631 (6 triples) | 2.5e-7 |

Zeta in total: 0 violations in 914,347 mode triples. At L = 1e6 with the mask at 1e-8 there are 2 and 2 violations in 671,282, all among modes within a factor 100 of the rounding floor (the transport residual at this lens is 1.7e-7, against 1e-11 at L <= 1e4); with the mask at 1e-6, 1e-5, 1e-4 there are none.

Log-convexity of the lowest modes of zeta (completed function, L = 100, r = 1.5, circles 0.5, 0.6, 0.7; `tests/logconvex_low_modes.py`). The prediction is the two-exponential form fitted on the outer circles; it gives the middle circle to 1e-14.

| k | (log E_k)'' for log abs F | predicted | (log E_k)'' for arg F | predicted |
|---|---|---|---|---|
| 1 | -23.0248 | -23.0247 | +14.1560 | +14.1560 |
| 2 | +8.36419 | +8.36412 | -8.86881 | -8.86872 |
| 3 | -2.35292 | -2.35287 | +2.33630 | +2.33625 |
| 4 | +0.504186 | +0.504168 | -0.504619 | -0.504601 |
| 5 | -0.0953797 | -0.0953742 | +0.0953696 | +0.0953643 |
| 6 | +0.0166200 | +0.0166186 | -0.0166203 | -0.0166188 |
| 7 | -0.00273759 | -0.00273728 | +0.00273748 | +0.00273728 |
| 8 | +0.000432688 | +0.000432643 | -0.000432783 | -0.000432635 |

For larger k the second difference of log E_k is below the rounding of the modes and its sign is not determined; counts of "not log-convex" modes are therefore not reported.

Transport residual between consecutive resolved circles without a zero circle: median 4e-12 to 1e-9, against 1 to 100 across a zero circle (table T1). For the arithmetic factor alone, which has no symmetry D, the two exponentials of a mode are of comparable size and 40 to 42% of the 399,935 mode triples at L = 1e4 are not log-convex.

Reading.
1. Zeta and L(chi_-4): convex in every mode on every triple, as item 2 requires; log-convexity fails as item 3 predicts (table above); the winding number is 0 on every circle. The premise holds only in its convex form, and that form is a property of every harmonic function.
2. Controls: the only triples with violations are those across which the winding number changes. The DH pair at 85.70 lies between the circles 0.12 and 0.15; on the nine triples that do not contain that zero circle there are 0 violations in 63,783 mode triples, including the triples inside it (winding 2) and outside it (winding 0). The statistic does not see an off-line zero from any circle that does not pass it.
3. The winding number is the count of zeros between the circle and the seam (Jensen's formula on the annulus, CLASSICAL): 2 per off-line pair, and -1 for the pole of zeta in the arithmetic-factor mode. Mode k of the jump is the k-th power sum of the zero positions in the chart: the argument principle with moments.
4. The parity under A holds to rounding for every object with a functional equation that preserves the modulus, including the unimodular twist WT. It is the functional equation and contains no information on zeros or primes. It fails only for objects without a completed function (sign twists), for which the statistic is not formulable.
5. Large lens. A circle near the seam is the curve x = xmin (g(u)) (1 + (2t/L)^2) with g between 0.39 and 1; N samples resolve it only for xmin >= 13.7 L/N. At L = 1e6 and N = 2^24 this is xmin >= 0.82: the circle lies to the right of Re s = 1.3. With the stated sizes the L = 1e6 test never enters the critical strip. Moreover the mode index is a frequency in t scaled by the lens: the band of the prime 2 begins at k = 0.1877 L (largest mode at k = 187,686 for L = 1e6; modes k <= 1.5e5 have relative amplitude below 3.4e-7). The proposed range k <= 1e5 at L = 1e6 contains no arithmetic content; the run kept all modes.
6. The end charts and the conormal family (nodes `zv-strip-end-charts`, `zv-dual-conormal-family`) are coordinate statements that are regular at the punctures; they add no inequality. The essential singularity at the puncture is what destroys the completed function in float64 at L >= 1e4 (section 3, defect ii).

Not run: HEAT (the quadrature is not usable at the heights L^2/(4 xmin) reached by a circle near the puncture); the A-image circles of DH and L(chi) (Hurwitz zeta at Re s of order -1e4; the units were stopped at that circle); sign twists (no values in the strip). L = 1e5 (a circle of 2^23 samples in the strip took more than 35 minutes on 5 cores; stopped). 200 circles and 2^24 samples per circle were not reached: 3 to 14 circles per object and 2^14 to 2^22 samples.

Control onset against the height of the off-line zeros: the onset is the circle through the zero. Nothing happens earlier.

Classification: closed. Harmonic transport on zero-free sub-annuli (a theorem for every F), the argument principle on the zero circles, and the functional equation. Verified height in another form: to certify the absence of zero circles one must compute the winding number on circles down to the seam, which is the count of zeros to the right of the line inside the lens.

## 5. Combination (2): strip Pick kernel of the conformal Schur window

Definitions. S_a(w) = X(w-a)/X(w+a). Linear kernel P_lin(w, w') = (1 - S(w) conj S(w'))/(w + conj w'). Strip kernel: the same numerator over phi(w) + conj phi(w'), phi(w) = sinh(c w), c = pi/(2Y); phi maps the half-strip {Re w > 0, abs Im w < Y} conformally onto Re > 0.

The negative 2 x 2 minor of the source (OpenFrontierPage T61) is a property of the multiplier M(w, w') = (phi(w) + conj phi(w'))/(w + conj w') that would carry the strip kernel to the linear one, not of zeta. For real nodes x, y: M(x,x) M(y,y) - M(x,y)^2 = -c^4 (x - y)^2/6 + O(c^6) < 0 (PROVED by expansion: sinh(cx)/x = c(1 + c^2 x^2/6 + ...), and (sinh cx + sinh cy)/(x + y) = c(1 + c^2 (x^2 - xy + y^2)/6 + ...)). Reproduced exactly; no computation is needed and no L-function enters.

What is proved before computation. (i) The strip kernel is positive on every node set iff S_a is Schur on the half-strip (CLASSICAL, Pick). (ii) (PROVED up to the maximum principle on the half-strip, S_a -> 0 as Re w -> infinity) abs S_a <= 1 on the edge Im w = Y iff the integral of A(x, Y) = Re X'/X over [abs(u - a), u + a] is nonnegative for all u > 0; A is negative only inside the half-discs of radius b about the feet of off-line pairs (node `zero-pair-shear-formula`), so S_a is Schur on the half-strip for every Y <= gamma_off - b, and is not for Y > gamma_off when a < b (pole at b - a + i gamma_off). The threshold Y_max lies in [gamma_off - b, gamma_off]. (iii) Therefore the stated fail condition, "collapse beginning at Y < 0.5 gamma_off", cannot occur as a change of sign. What can be measured is the first order at which the nested matrix turns indefinite for Y > Y_max, and whether the size of the pivots below Y_max anticipates it.

Test. Nodes: the first n Halton points of [0.01, 2] x [-gamma_off/4, gamma_off/4] (Re w, Im w). Statistic: pivots d_k of the LDL* factorisation in node order, rho_k = d_k/P_kk; a negative pivot at order k means the k x k matrix is indefinite. Each control is run with zeta on the same nodes, the same a and the same list of Y.

Results (MEASURED, signs certified; table T2 in `out/TABLES.md`).

| geometry | object | first order with a negative pivot, by Y | linear kernel |
|---|---|---|---|
| gamma_off = 85.699, b = 0.3085, a = 0.1, n = 300 | DH | none for Y = 43, 60, 73, 81, 85.4; Y = 90: 265; 100: 205; 110: 186; 130: 169; 170: 158 | 148 (4 negative pivots) |
| | ZETA, L(chi_-4), L(chi_5) | none at any Y | none |
| gamma_off = 111.694, b = 0.243, a = 0.1, n = 200 | HEAT:-0.5 | none for Y = 34 to 116; Y = 123: 195; 134: 168; 160: 146 | 123 |
| | ZETA | none | none |
| gamma_off = 14.1347, b = 0.125, a = 0.05, n = 300 | EA:1/8 | none for Y = 7 to 14.0; Y = 14.13: 126; 14.5: 49; 15: 32; 16: 21; 18: 15; 22: 11 | 8 (84 negative pivots in 290) |
| | ZETA | none | none (determined to order 268) |
| gamma_off = 2.8596, b = 0.404, a = 0.1, n = 300 | TNR | none for Y = 1.43 to 2.45; Y = 2.6: 17; 2.86: 9; 3.0: 8; 3.2: 7; 3.6: 6; 4.5: 5; 6: 4 | 4 |
| | ZETA | none | none (determined to order 228) |
| gamma_off = 0.2274, b = 0.0321, a = 0.01, n = 300 | TNRQ | none for Y = 0.068 to 0.2; Y = 0.215: 96; 0.2274: 64; 0.24: 52; 0.26: 40; 0.3: 32; 0.4: 20 | 8 |
| | ZETA | none | none |

Conditioning below the threshold, log10 rho at order 100 (control | zeta): DH at Y = 85.4: -158.5 | -192.0; EA at Y = 14.0: -197.350 | -197.346; TNR at Y = 2.45: -124.80 | -125.00; TNRQ at Y = 0.2: -21.16 | -21.27; HEAT at Y = 111.4: -179.31 | -179.09. The pivots of a control do not fall relative to zeta as Y approaches the threshold from below; for DH they are larger than for zeta.

Reading. Every control is positive at every listed Y <= gamma_off - b and indefinite from a listed Y between gamma_off - b and 1.10 gamma_off on (HEAT at n = 200 is still positive at Y = 116 = 1.04 gamma_off; TNRQ at Y = 0.2, inside the interval), at an order that falls as Y grows and tends to the order of the linear kernel. The least Y with a negative pivot among the first n nodes, Y*(n), decreases with n towards the interval [gamma_off - b, gamma_off] and never lies below it: Y*(200) = 110 and Y*(300) = 90 for DH; 14.5 (n = 50) and 14.13 (n = 200) for EA. The strip of half-height Y is a window: the kernel is blind to everything outside it by construction, and positivity inside it is a theorem once the zeros inside are known to be on the line.

The object enters through its values at the nodes. Coefficients do not enter. Control onset: Y = gamma_off - b, the height at which the edge of the window touches the half-disc of the off-line pair; 1.00 to 1.10 times gamma_off at the orders reached.

Not reached: n = 2000 at 40,000 bits (reached n = 300 at 4000 bits; the linear kernel is determined to order 228 to 300 at this precision; one factorisation at n = 2000 and 40,000 bits is about 1.3e9 multiplications of 40,000-bit numbers). The unimodular twist is a translate (its window is the zeta window shifted by alpha); the sign twists have no completed function: not formulable.

Classification: closed. Verified height in window form (the source statement T61 with the controls measured).

## 6. Combination (3): the T3 split built from Phi

The split (reconstructed from the description in `formalization/paper/debranges_T3_structural_verdict.md` and validated against the recorded certificate; PROVED by expanding the Wronskian). With d = z - conj w, p = z + conj w, tau = (u+v)/2, s = u - v over the quadrant u, v >= 0:

pi d K_a(z, w) = 32 int int Phi(u) Phi(v) [ sinh(4 a tau) sin(2 d tau) cos(p s) + sinh(2 a s) cos(2 p tau) sin(d s) ] du dv,

K_{a,0}: the first term with cos(p s) replaced by 1, equal to int M(tau) sin(2 d tau)/(pi d) d tau with M(tau) = 128 sinh(4 a tau) int_tau^{2 tau} Phi(u) Phi(2 tau - u) du >= 0, a positive mixture of Paley-Wiener kernels; D_{a,R}: the first term with cos(p s) - 1; K_a^(S): the second term. The recorded numbers beta_R = 1.0272860168 and beta_S = 0.42200180358 at a = 1/4, z = (-1/2, 0, 1/2) + i/5 are reproduced to all recorded digits with the canonical shift a (not a/2).

Two facts fix what the statistic can show (PROVED):
1. r(a, set) - 1 = -mu_min(K_a, K_{a,0}), because K_{a,0} + D_{a,R} + K_a^(S) = K_a. The sign of r - 1 is the negative index of K_a on the set.
2. K_a(z, z') = E(z) conj E(z') P_lin(w, w')/(2 pi) with w = -i z, E(z) = X(w + a). So the negative index of K_a is that of the linear Pick matrix of S_a, the object of combination (2) with Y = infinity. The size of r - 1 is governed by abs E^2 = e^(-pi t/2) x polynomial, while K_{a,0}(z, z) does not depend on the height: r tends to 1 from either side at that rate.

Measured r (K_{a,0} from Phi by quadrature, n <= 40 nested points with Im z in [0.1, 0.6]; table T3):

| object | a | heights | 1 - r at n = 4 | at n = 16 | at n = 40 | negative eigenvalues at n = 40 |
|---|---|---|---|---|---|---|
| ZETA | 0.1 | [0, 6] | 7.2e-4 | 4.0e-13 | 6.4e-27 | 0 |
| ZETA | 0.1 | [0, 30] | 5.3e-8 | 6.9e-18 | 3.7e-32 | 0 |
| ZETA | 0.02 | [0, 30] | 5.2e-8 | 6.9e-18 | 3.6e-32 | 0 |
| DH | 0.1 | [0, 30] | 2.9e-11 | 1.4e-16 | 3.6e-26 | 0 |
| DH | 0.1 | [60, 90] | 1.5e-51 | 1.7e-56 | -1.1e-55 (r > 1) | 1 (from n = 24) |
| TNR | 0.1 | [0, 2] | -0.0343 (r > 1) | -0.0370 | -0.0371 | 9 |
| TNR | 0.1 | [0, 4] | -0.0355 | -0.0370 | -0.0371 | 9 |
| TNR | 0.45 (> b) | [0, 4] | 8.6e-3 | 2.4e-6 | 2.6e-15 | 0 |

r is 1 to within 1e-26 already at heights below 30. The inequality r <= 1 has no margin that a finite computation could exhibit: the margin is the least eigenvalue of the pencil and decays with the height and with n.

Inertia at scale (linear kernel; nodes: first n Halton points of Im z in [0.05, 1], Re z in [0, T]; signs certified):

| object | a | T | n, bits | first negative order | relative pivot there | negative pivots |
|---|---|---|---|---|---|---|
| ZETA | 0.4, 0.2, 0.1, 0.05, 0.02 | 50; 200; 2000 | 400, 5000; 400, 4000; 600, 2400 | none | least log10 rho -1135; -613; -10.4 | 0 |
| L(chi_-4), L(chi_5) | 0.4, 0.1, 0.02 (T = 50); 0.1 (T = 2000) | 50; 2000 | 300, 4000; 200, 1600 | none | -686, -673; 0 | 0 |
| DH | 0.1 | 42.85 = 0.5 gamma_off | 300, 4000 | 113 | 1e-166.7 | 4 |
| DH | 0.1 | 0.9 gamma_off; 1.1 gamma_off | 300, 4000 | 77; 58 | 1e-33.1; 1e-11.4 | 5; 4 |
| DH | 0.4 (> b) | 0.5, 0.9, 1.1 gamma_off | 300, 4000 | none | | 0 |
| HEAT:-0.5 | 0.1 | 0.5; 0.9; 1.1 gamma_off | 200, 3000 | 94; 65; 47 | 1e-173.3; 1e-44.1; 1e-4.0 | 4; 5; 5 |
| EA:1/8 | 0.05, 0.02 | 0.5; 0.9; 1.1 gamma_off | 300, 4000 | 7; 6; 5 | 1e-15; 1e-9; 1e-4 | 83 to 88 |
| EA:1/8 | 0.2 (> b) | all three | 300, 4000 | none | | 0 |
| TNR | 0.1, 0.02 | 0.5; 0.9; 1.1 gamma_off | 300, 4000 | 4; 3; 2 to 3 | 1e-5; 1e-2.3; 1e-0.6 to 1e-3 | 38 to 42 |
| TNR | 0.45 (> b) | 0.5, 1.1 gamma_off | 300, 4000 | none | | 0 |
| TNRQ | 0.01, 0.02 | 0.5; 0.9; 1.1 gamma_off | 300, 4000 | 6 | 1e-7 | 94 to 96 |
| TNRQ | 0.05 (> b) | all three | 300, 4000 | none | | 0 |

For T = 2000 with n = 600 the nodes are sparse (the least relative pivot is 1e-10.4): at that density the matrix is close to diagonal and the test has little content. The dense cases are T = 50 and T = 200.

Reading.
1. The stated fail condition is met by every control: r > 1 on test sets below 0.5 gamma_off (a < b), and r < 1 at every order when a exceeds the displacement b (the threshold theorem, node `shift-bridge-threshold`). Zeta and both L-functions pass at every size.
2. This is analytic continuation, not a new separation. The negative eigenvalue found from below the zero has relative size 10^(-3.9 d) for DH, d = gamma_off - T (166.7 digits at d = 42.85; 33.1 at d = 8.57: 3.89 and 3.86 digits per unit) and 10^(-3.1 d) to 10^(-3.9 d) for HEAT; the first negative order is 113 at d = 42.85 and 77 at d = 8.57. To see the off-line zero of DH from a distance d below it, F must be known to about 4 d digits at about a hundred nodes. For EA and TNR the off-line zeros are at distance 1.4 to 7 from the nodes and the orders are 4 to 7. The cost grows linearly in the distance to the zero in both the order and the number of digits; at d of the size of the verified height it exceeds the verification itself.
3. Passing at order n and p digits excludes only off-line zeros within the corresponding distance of the test set. Positivity of the kernel on finite sets is the statement that no pole of S_a has yet been reached by continuation.
4. Pivots are Euler-blind: at equal nodes the relative pivots of L(chi_-4), L(chi_5) and DH (conductors 4, 5, 5) agree within 4% of their logarithm below the first negative pivot of DH (log10 rho at order 100, linear kernel, DH geometry: -174.8, -170.3, -168.6; zeta, conductor 1: -216.3). Nothing in the DH pivots below order 148 distinguishes it from the two L-functions.

The object enters through its values at the nodes (through Phi only in the normalising core K_{a,0}, which is positive for every Phi >= 0 and carries no sign information). Control onsets: at 0.5 gamma_off for all controls at the orders above; the onset distance is set by the precision.

Not reached: n = 800 (reached 600 at T = 2000 and 400 at T <= 200); r with K_{a,0} from Phi beyond n = 40. Not formulable: sign twists (no completed function). WT: translate of zeta.

Classification: closed. Row G2 / G20 of the obstruction map (finite Pick orders; shifted kernel positivity = zero-free strip), with the onset law of the controls measured.

## 7. Combination (4): pair shear field, frozen block, prime side

Definitions. A(x, t) = Re X'/X(x + it) = sum over zeros of Re 1/(s - rho) (no constant). A reflected pair contributes P = 2x(q - b^2)/((q + b^2)^2 - 4x^2 b^2), q = x^2 + (t - gamma)^2, negative only inside q < b^2 (PROVED in the source).

Prime side with a smooth cut-off. v(u) = int_u^inf phi, phi(y) = beta((y - yc)/eta)/eta, beta = (35/32)(1 - x^2)^3, yc = log X - eta, eta = 1/2. Averaging the truncated explicit formula against phi (CLASSICAL) gives, with Phi(z) = e^(yc z) betahat(eta z), betahat(z) = 105[(z^3 + 15z) cosh z - (6z^2 + 15) sinh z]/z^7:

A_X(x, t) := Re[ -sum_n Lambda_F(n) n^(-s) v(log n) + G(s) ] = Re sum over zeros of (1 - Phi(rho - s))/(s - rho),

G the gamma and pole part. Each zero enters through an entire kernel; for a zero with Re rho - 1/2 = b the factor Phi has size X^(b - x) betahat. Frozen block: B = the same kernel summed over the listed on-line zeros of the window. Remainder = A_X - B - (smooth tail of the far zeros). Tolerance = tol_S + tol_Phi: tol_S = 2x S_max (1/d1^2 + 1/d2^2) from the unconditional bound S_max = 0.112 log t + 0.278 log log t + 2.510 on S(t) (Trudgian 2014), d1, d2 the distances to the ends of the block; tol_Phi bounds the Phi-terms of the far zeros under the hypothesis that they are on the line. Without that hypothesis the Phi-terms of far zeros are bounded only by X^(1/2 - x) betahat, which is larger than A itself: the prime side has no unconditional certified tail bound.

Zeta and L(chi_-4) (MEASURED; sums by a type-1 NUFFT at 1e-11 over all prime powers; zeros of zeta by Arb, of L(chi_-4) by sign changes of Z; table T4):

| T | X | prime powers | heights | windows | zeros per window | c = 0.5: max abs remainder / tolerance | c = 1 | c = 2 | c = 4 | ghost count |
|---|---|---|---|---|---|---|---|---|---|---|
| 1e10 | 1e10 | 455,062,595 | 8,388,608 (spacing 0.003) | 24 | 154 to 155 | 2.6e-3 / 1.2e-2 = 0.21 | 0.16 | 0.08 | 0.04 | 0 in all |
| 1e10 | 1e6 | 78,734 | 8,388,608 | 24 | | 0.14 | 0.12 | 0.08 | 0.04 | 0 |
| 1e8 | 1e8 | 5,762,859 | 8,388,608 (0.004) | 40 | 174 to 175 | 0.18 | 0.12 | 0.06 | 0.06 | 0 |
| 1e6 | 1e8 | 5,762,859 | 8,388,608 (0.005) | 40 | 159 to 160 | 0.10 | 0.07 | 0.06 | 0.06 | 0 |
| 1e6 | 1e6 | 78,734 | 8,388,608 | 40 | | 0.10 | 0.07 | 0.06 | 0.06 | 0 |
| 1e4, L(chi_-4) | 1e8 | 5,762,859 | 1,048,576 | 3 | 128 to 129 | 0.06 | 0.06 | 0.06 | 0.06 | count minus main term: 0.75, 0.5, 0.04 |

Ghost count = N(hi) - N(lo) - (number of listed on-line zeros), from Arb's zero count; it is 0 in all 168 zeta windows. The mean of A_X over the 8,388,608 heights equals pi times the smooth density to 5 digits (10.5940 against 10.5940 at 1e10); this is the mean of the gamma term, since the Dirichlet polynomial has mean zero, and is not a count obtained from the primes.

The premise "A >= 0 on the lines x = c/log t" does not hold for the prime-side quantity at small c: at T = 1e10, X = 1e10 the minimum of A_X over all heights is -10.58 (c = 0.5, 12.8% of the heights negative), -4.64 (c = 1, 3.3%), +1.02 (c = 2), +3.66 (c = 4). The kernel (1 - Phi)/(s - rho) is not positive; with X = T the cut-off resolves about one zero spacing.

Controls.

DH (coefficients Lambda_DH(n) for all n <= X by Dirichlet convolution; block = the 1861 on-line zeros below 2000 with conjugates; lines x fixed; first off-line pair b = 0.3085 at 85.699). Excess of the remainder over the Lorentzian field of the off-line pairs, at distance d below the pair (`out/dh_reach.json`; in brackets the envelope X^(b-x) e^(-eta(b-x)) abs betahat(eta(b - x + id))/abs(b - x + id)):

| X | x | d in [1.5, 3] | [8, 12] | [16, 24] | [32, 48] | reach at 1e-2 | at 1e-3 | at 1e-4 |
|---|---|---|---|---|---|---|---|---|
| 1e4 | 0.10 | 3.7 (2.5) | 0.28 (0.12) | 8.2e-3 (1.3e-3) | 2.1e-4 (1.6e-5) | 13.1 | 24.7 | 38.4 |
| 1e5 | 0.10 | 6.1 (4.1) | 0.45 (0.19) | 1.3e-2 (2.1e-3) | 3.8e-4 (2.6e-5) | 17.6 | 25.8 | 43.8 |
| 1e6 | 0.10 | 10.1 (6.6) | 0.72 (0.31) | 2.1e-2 (3.4e-3) | 5.8e-4 (4.2e-5) | 18.7 | 30.6 | 45.0 |
| 1e7 | 0.10 | 16.2 (10.7) | 1.15 (0.50) | 3.4e-2 (5.6e-3) | 1.0e-3 (6.8e-5) | 19.4 | 32.1 | 51.0 |
| 1e7 | 0.20 | 3.5 (2.3) | 0.24 (0.11) | 7.2e-3 (1.1e-3) | 2.1e-4 (1.2e-5) | 13.0 | 24.6 | 37.9 |
| 1e7 | 0.35 (> b) | 0.34 (0.22) | 2.3e-2 (1.0e-2) | 6.9e-4 (1.1e-4) | 2.0e-5 (1.1e-6) | 10.0 | 13.0 | 24.4 |
| 1e7 | 0.45 (> b) | 0.070 (0.045) | 4.9e-3 (2.1e-3) | 1.4e-4 (2.3e-5) | 4.5e-6 (2.5e-7) | 6.1 | 11.2 | 17.8 |

With every strip zero of the table in the block the remainder is at most 3.5e-6 for all X: the prime side of DH is the kernel sum over its zeros, and nothing else.

T-NR (prime side of zeta plus the terms log q (alpha^k + beta^k) q^(-ks) of the local factor; block = the on-line zeros, which are the zeros of zeta):

| q | T | X | x | b - x | fraction of heights outside q < 4b^2 with remainder below -tolerance | least remainder there | least exact pair field there |
|---|---|---|---|---|---|---|---|
| 3 | 1e3 | 1e4; 1e6; 1e8 | 0.1 | 0.304 | 0.49; 0.48; 0.50 | -9.0; -67; -257 | +0.057 |
| 3 | 1e3 | 1e4; 1e6; 1e8 | 0.3 | 0.104 | 0.38; 0.46; 0.47 | -1.3; -4.3; -6.7 | +0.171 |
| 3 | 1e3 | 1e4; 1e6; 1e8 | 0.45; 0.6 | < 0 | 0 | +0.03 to +0.32 | +0.25; +0.33 |
| 1000003 | 1e6 | 1e6 (no power of q below X) | 0.036 to 0.29 | < 0 | 0 | +13.8154 = log q at every height | +3.2 to +13.3 |
| 1000003 | 1e6 | 1e8 (one power of q) | 0.036 | -0.004 | 0.30 | -4.6 | +3.2 |
| 1000003 | 1e6 | 1e8 | 0.072 to 0.29 | < 0 | 0 | +2.6 to +13.3 | +6.1 to +13.3 |

EA:1/8 (coefficients Lambda(n)(n^a + n^-a), no on-line zeros, T = 1e4): for x = 0.05 the rms of A_X is 11.1, 14.7, 20.2 at X = 1e4, 1e6, 1e8 and 24%, 35%, 41% of the heights are negative; for x = 0.2 and 0.3 (> a) the minimum is positive at X >= 1e6 and the rms is constant (8.5, 7.8).

Sign twists (T = 1e6, X = 1e8, no gamma term): LIOU, SGN:7, SGN:8 have mean 1e-4, rms 5.7 to 5.9 at c = 0.5 and 1.15 at c = 4, and 48 to 52% negative heights on every line.

Reading.
1. Zeta and L(chi_-4) pass: the prime side at up to 4.6e8 terms and 8.4e6 heights equals the kernel sum over the listed zeros within the tolerance. The pass depends on the zero list of the window (Arb, i.e. verified zeros near that height) and on the hypothesis on the far zeros in tol_Phi.
2. The controls do fail at heights whose nearest off-line pair lies outside the disk q < 4b^2, when the line lies to the left of the zero (x < b). The mechanism is the factor X^(b - x) of the kernel of a zero to the right of the evaluation line: measured growth between X = 1e4 and 1e7 at x = 0.1 by the factor 4.1 to 4.7 in the four distance bins, predicted 10^(3 x 0.2085) = 4.22. The reach in height at tolerance tol is about (X^(b-x)/tol)^(1/5)/eta for this C^2 cut-off (measured 24.7 to 32.1 at 1e-3: factor 1.30; predicted 1000^(0.2085/5) = 1.33). For x > b the excess decreases with X and the control passes.
3. This is the classical zero-detecting sum: a zero with real part beta makes the smoothed sum over n <= X large by X^(beta - sigma) near its height. It separates in the strip only in proportion to X^b. For b of order 1/log X the factor is bounded and nothing is detected beyond the disk; for fixed b a reach d in height needs X >= (d log T)^(5/(b - x)) with this cut-off, and X >= (d tol)^(1/(b-x)) with a sharp cut-off (ARGUED: its kernel decays like X^(b-x)/d), which for b <= 1/2 is at least d^2 terms per window. It also assumes that the other far zeros are on the line; a second off-line zero can cancel the first.
4. The controls fail through local properties of their coefficients, not through all primes together: Lambda_DH is not supported on prime powers (max abs Lambda_DH(n)/n = 0.36 for n <= 1e7); T-NR has abs alpha_q = q^(1/2 + b) at the single prime q (with X < q the test sees only the conductor term log q, and with one power of q a term of size 2.2 log q x q^(-x) at every height); EA has abs alpha_p = p^a at every prime. Each is a violation of the Euler product or of the Ramanujan bound at finite places, visible in the coefficients without any sum. Zeta satisfies both trivially.
5. Sign twists: the on-line singularities of zeta(2s)/zeta(s) are poles, the field has mean zero and no sign; there is no frozen block. HEAT has no Dirichlet coefficients: not formulable. WT is zeta at the heights t + alpha.

Control onsets against the heights of the off-line zeros: DH from 20 to 51 below the pair at 85.7 (tolerance 1e-2 to 1e-4, X = 1e7); T-NR at every height (its pairs are 5.72 apart for q = 3 and 0.45 apart for q = 1000003); EA at every height. In each case the onset is the amplification X^(b - x) times the decay of the cut-off, and it is absent for x > b.

Sizes: the stated sizes were reached for X (1e10) and for the number of heights within a factor 1.2 (8.39e6 per run, 4.2e7 in total for zeta); the frozen block was subtracted in 24 to 40 windows of 10 to 20 height units per run (zeros within 60 mean spacings), not at every height.

Classification: closed. The explicit formula with a smooth cut-off; the control failures are the zero-detecting mechanism to the right of the evaluation line (row G8 for the field, the known "right of the line" pattern for the prime side); the pass of zeta is conditional on the zero list of the window.

## 8. Weakest steps

1. Combination (3): the split is reconstructed from a prose description, not from a formula in the repository; it is fixed by the identity K_{a,0} + D_{a,R} + K_a^(S) = K_a (1e-38) and by the two recorded constants (11 digits). The implemented D_{a,R} of the repository uses a regularised pseudo-inverse (SL0 audit); the exact kernel is tested here.
2. Combination (4): tol_Phi assumes the far zeros are on the line; the tail model uses the smooth density; L(chi_-4) zeros come from sign changes of Z with a count check against the main term, not from a certificate; the DH and HEAT zero tables are not interval certificates (battery README). The law for the reach is fitted on one off-line pair of one function.
3. Combinations (1) to (3): the sizes are below the sizes proposed (section headers). The conclusions rest on the statements proved in sections 4 to 6, with the computations as checks; for (1) at L >= 1e4 only the arithmetic factor was sampled, and L = 1e5 was not completed. Float64 sampling in (1) is not re-checked in ball arithmetic: no pass or fail of (1) depends on a float64 margin (0 violations against thousands), and the winding numbers are integers to 1e-6.

## 9. Server record

Units started by this lane (all through rhrun; none running at the end): rh-s5kt-pick-1120080644 (stopped by this lane at 08:34 to restart with smaller orders), rh-s5kt-pick2-1120083433 (ended), rh-s5kt-b-1120080824 (ended; one step, the L(chi_-4) zero search at 1e5, was stopped by process id and replaced by T = 1e4), rh-s5kt-b2-1120084514 (ended), rh-s5kt-b2-1120084522 (a duplicate started by a waiting script 8 seconds after the first; stopped within a minute), rh-s5kt-c-1120095854, rh-s5kt-d-1120101112, rh-s5kt-e-1120110112, rh-s5kt-f-1120110230 (all ended; individual steps that proved intractable were stopped by process id: the A-image circles of DH and L(chi_-4), the float64 L = 1e6 run, the L = 1e5 run). Peak use: 8 cores; memory limits requested 4 + 9 GB and later 10 + 10 GB, measured peak 5.1 GB (prime sums) and 1.3 GB per unit otherwise. No GPU. No process or unit of another lane was touched.
