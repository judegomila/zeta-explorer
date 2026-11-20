# REFEREE (author's adversarial pass): c20-mixed-form-control-census-server

2026-11-20. Written by the lane itself after the result, against its own RESULT.md: this is not an independent referee and counts as zero referees. RH is open; nothing here is a statement about zeros of zeta.
Labels: CONFIRMED (re-derived or recomputed by a different route) / ERROR (found and corrected in RESULT.md) / NOTE / OWED (for an independent referee).

**Outcome: the verdict stands (registered outcome (a); outcome (d) in the extension). Five errors or overstatements were found and corrected (E1 to E5). Four items are owed to an independent referee (O1 to O4).**

## 1. Reruns by a different route

| claim | rerun | result |
|---|---|---|
| zeta has T2 < 0 at t = 1e6, theta' = 0.95, w = 121, tau = -22.66 (ball: -0.009476408061) | `referee_local.py`: dense Lambda_2 by direct convolution, float64 sums, the autocorrelation c computed by quadrature from sin^4 (not from the closed form used by `mixed.py` and `mixed_ball.py`), local machine | -0.009476408, difference 6.4e-13. CONFIRMED |
| Liouville has T2 < 0 at t = 1e6, w = 487 (ball: -0.038108732948) | same script | difference 8.6e-12. CONFIRMED |
| Float stage for the 11 classes with atoms | `selftest_float.py` (brute force, cell (1e4, 0.95)) | 2e-13 to 2e-12. CONFIRMED |
| ZQ float path | `selftest_zq.py` (every density term by Simpson quadrature, no bins) | 4e-13. CONFIRMED for the float path; ZQ has no ball stage (O2) |
| Float against balls | all 188 ball points at precision 128 | no sign disagreement; 7.5e-12 at t <= 1e8, 2.5e-10 at 1e10. CONFIRMED |
| Precision | 23 points at 256 against 128 | agree to all printed digits. CONFIRMED |
| Grid step 0.02 hides no sign change in the registered sample | step 0.002 on 4 cells x 24 windows (zeta) | minima lower by at most 1.7e-4, margins there 0.011 to 0.057. CONFIRMED on those cells; not a certificate (N2) |
| Lemma T: abs(rho) <= K6 abs(w)^-6 | `referee_checks.py`: 200 random w per series and tau, Re w <= sigma_R - 1/2, 3 <= abs(Im w) <= 1e4 | holds, largest ratio 0.027. CONFIRMED |
| q^(k)(u) = 0 for k <= 8 | balls, both tau, six series | contain 0, radius below 2e-68; q^(9)(u) != 0. CONFIRMED |
| Zero count used in the tail | Jensen bound N_J per unit box computed in balls; all 60 rows enclosed under it | CONFIRMED; removes the recalled count theorem from the enclosure |
| DEL set | count of deleted primes below 1e7 | 16210, the number in the c12 battery README. CONFIRMED |

## 2. Errors found and corrected

- **E1 (GATE, registered constants).** GATE registers the constant -u^2/4 in the second-order identity and (R - u)^2/2 in the zero-side formula. Both wrong. The run shows a defect equal to u^2/4 to 9 digits with the registered constant and a T^-3 decay with constant 0. Corrected in RESULT 2 (Part 1b) and 3.2; GATE is left as written.
- **E2 (GATE, prediction P-2).** The decisive prediction (zeta fails at theta' >= 0.85 in the registered sample) was wrong. It is reported as wrong, not reinterpreted. The failure of zeta was found only in the extension, which was designed after the census had been seen: it is CERTIFIED at the five points but its window count (600) was chosen post hoc.
- **E3 (RESULT first draft, section 3.3).** The first draft said that the bracket of the sector identity is positive (0.005 to 0.024) and that T2 >= 0 "is the sector condition to that accuracy". The rerun in section 1 showed sector term +0.0176 and bracket -0.0271 at zeta's failing point. The section was rewritten from all 21312 minima: bracket mean 0.015, sd 0.009, lowest -0.075, correlated with T1n. The corrected reading is weaker: T2 is T1n^2/2 up to a correction of at most 0.08, and failures need T1n below about 0.3.
- **E4 (RESULT first draft, numbers).** Largest float-ball difference at t <= 1e8 is 7.5e-12, not 5e-12; the Part 1 differences at T = 12800 reach 9.6e-24, not 4.8e-24; the smallest control difference from zeta is 0.0038 (HQ2 at P = 39), not 0.09; the T^-3 law of Part 1b is clean at tau = 7.3 only (at tau = 0 the product defect x T^3 varies between 3.6 and 16 with one value 0.28). Corrected.
- **E5 (process).** (i) `selftest_float.py` ran one window of a registered cell before the registered first test (D1). (ii) `trivbound.json` was first written to the repository root and moved (D8). (iii) Requested memory limits at the peak summed to about 40 GB, above the 32 GB the assignment allows for the grown size; actual use was far lower (0.4 to 0.9 GB per worker planned and printed) and the slice total never exceeded 39 GB at a check. Recorded in D7.

## 3. Notes on what the result does and does not establish

- **N1.** The object T2 is this lane's reading of the assignment. The paper lane may define a different second-order form. The sector identity and the kill apply to T2 as defined in GATE section 1 with sin^4 vectors and a constant reserve.
- **N2.** PASS means: no negative value on the tau grid and a positive ball value at the argmin. No rigorous lower bound for the minimum over a window was computed. FAIL entries are certified at a point. Outcome (a) therefore has the label MEASURED, as registered.
- **N3.** "DEL passes on every window" uses the greedy set at b = 0.75 only, on finite stages P < 7e6 where between 7 and 12653 primes are deleted. At these stages DEL is zeta with primes removed; the zero at 0.75 belongs to the limit object, not to the stage (map note on DEL). The statement that matters is: removing primes raises the margin, so the form cannot separate zeta from a deletion product.
- **N4.** Failure-rate comparison of zeta with chains (5 events against 12) is not a separation and is not claimed as one. A larger extension (several thousand windows, all 24 chains) would settle whether the ratio 2 to 5 is real; by 3.3 the expected explanation is the lower bound on T1 for zeta (T1 >= 0.20 c0 Lg in the sample), which is first-order.
- **N5.** Part 1: the enclosure is relative to the partial-fraction expansion D'/D = -u/2 + lim sum 1/(s - beta) (proved in the c19 referee report). With count (ii) nothing else is recalled. The certified zero lists rest on the c19 certification code (refereed once in round 19, "no defect found").
- **N6.** In `tailA.py` the first slab (abs(Im) < 0.3) counts each zero once; this is correct for real zeros and also for a complex pair inside the slab (both members are found). All six series have complete first slabs.
- **N7.** Heights are powers of 10 and windows are t + 200 w: the sample is not random in t. The Haar ensemble has the same windows.

## 4. Owed to an independent referee

- O1. Lemma T and the Jensen count (RESULT section 2): read the proof and `referee_checks.py`; re-derive K6 and the sign pattern of the six boundary terms.
- O2. ZQ: a ball implementation (the density terms have closed forms) or an independent rerun at t = 1e8.
- O3. The sector identity and the table of 3.3 on test vectors other than sin^4, and with the reserve taken from the xi convention (extra term pi Im S1).
- O4. One zeta failure at t = 1e8 rerun by a third route (the local rerun was done at t = 1e6 only; at 1e8 the ball value is the only route besides the float stage).

---

# INDEPENDENT REFEREE (lens: general), 2026-11-20

Written by a separate agent that did not take part in the lane. The author's pass above is left unchanged. RH is open; nothing below is a statement about zeros of zeta. No server unit was started; all reruns were local through `scripts/memcap.sh 8` with code written for this report (scratch copies in `/tmp/c20mf-referee/`, not part of the record: `t2check.py`, `p1check.py`, `kappa.py`).
Labels: CONFIRMED (re-derived by hand or recomputed with independent code) / ERROR (statement in RESULT.md that is wrong as written) / SCOPE (statement wider than what was run) / NOT RECHECKED.

**Outcome: holds = true. The verdict "precise obstruction" for the form T2 as defined in GATE section 1 stands. Every PROVED step was re-derived. Three statements in RESULT.md are wrong as written (X1 to X3) and three are wider than the evidence (S1 to S3); none changes the verdict. Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.**

## A. PROVED steps, re-derived by hand

| step | check | result |
|---|---|---|
| 3.1: [X, C_a] = a C_a; truncated shifts form a semigroup (C_a C_b = C_(a+b), zero when a + b >= u); A^2 + [X, A] has coefficients Lambda * Lambda + Lambda log = coefficients of F''/F | (X C_a h)(s) - (C_a X h)(s) = s h(s-a) - (s-a) h(s-a); F''/F = (F'/F)' + (F'/F)^2 | CONFIRMED |
| 3.1: T2 = (R^2/2) norm^2 - 2 R Re <h, A h> + 2 Re <h, A_2 h>; GATE: T2 = R T1 - c0 (R^2/2 - 2 Re S2/c0) | expansion of (R/2 - A)^2 | CONFIRMED |
| 3.1: "B^2 + [X, A] is the image of E''/E" | with E(t) = e^(i vartheta(t)) F(1/2 + it): E'/E -> iB, E''/E -> -(B^2 + [X, A]) | CONFIRMED up to sign: it is the image of -E''/E (t-derivative). Wording only; no number depends on it |
| 3.3 sector identity | <h, B h> = (T1 - iK)/2 with K = 2 Im S1; 2 Re(<h, B h>^2)/c0 = (T1^2 - K^2)/(2 c0); the rest is the definition of the bracket | CONFIRMED (it is an algebraic rearrangement valid for every h; "dispersion" is not a variance since B is not self-adjoint) |
| Lemma T: six integrations by parts | Phi = sum_{k<6} (-1)^(k+1) q^(k)(0) w^-(k+1) + w^-6 int_0^u q^(6) e^(w xi) d xi; needs q^(k)(u) = 0 for k <= 5 only; remainder at most u sup abs(q^(6)) max(1, P^(Re beta - 1/2)) abs(w)^-6 | CONFIRMED |
| Lemma T: vanishing order of q at u | autocorrelation of a function vanishing to order 4 at both ends is O((u - xi)^9) | CONFIRMED (and numerically: derivatives 0..8 at u below 1e-34, the 9th is 4.0e5 for P = 4) |
| Lemma T: sums of w^-(k+1) | from D'/D = -u/2 + lim sum 1/(s - beta): l_0 = -u/2 - sum 1/w, l_k = -sum w^-(k+1); the terms -u norm^2 and + q(0) u/2 cancel, leaving 2 norm^2 l_0 | CONFIRMED. The constant -u/2 was checked on D = 1 + 2^-s (D'/D = -u/2 + (u/2) tanh(su/2)) |
| Lemma T: count (i) | Stieltjes integration with n(T, y) <= u (y - T)/2 pi + P - 1 gives 2 (P-1) T^-6 + (u/5 pi) T^-5, which is below the stated (12/5)(u T/2 pi + P - 1) T^-6 | CONFIRMED (the stated bound is valid and not sharp). The count theorem itself is recalled, as labelled |
| Lemma T: count (ii) (Jensen) | disc centre sigma_0 + i(y + 1/2), box inside radius r, zeros in the box <= log(M(3r)/abs(D(centre)))/log 3 with M and the lower bound for abs(D(centre)) independent of y; sum over unit boxes <= N_J (T^-6 + T^-5/5) per sign. `referee_checks.py` implements this (parameters 0.5 and 3.0 chosen for all six series) | CONFIRMED |
| sigma_R values | sum_{n=2}^{12} n^-1.75 = 0.76; DH12 at sigma = 1: 0.955 | CONFIRMED (< 1) |
| Part 1b, constant 0 | residue of D''/D at beta is r_beta; sum r_beta/(s - beta) = D''/D - u^2/2; inserting the three regularising terms, the stated identity is equivalent to sum_beta r_beta G(beta) = S2 - (u^2/2) C(0). On D = 1 + 2^-s: r_beta = -u, sum_beta r_beta e^(w xi) = -u^2 e^(-xi/2) sum_m (-1)^m delta(xi - m u), half of the mass at 0 falls in [0, u], C(u) = 0, S2 = 0: both sides equal -(u^2/2) C(0) | CONFIRMED on the closed example and numerically (section B). The general statement has no written convergence proof; RESULT labels it CERTIFIED at fixed T, limit not enclosed, which is correct |
| 3.2 zero side | T2 = c0 [R^2/2 - R u + u^2] + 2 Re sum (R + r_beta) G(beta) and R^2/2 - R u + u^2 = (R - u)^2/2 + u^2/2; r_beta = -u + 2 sum_{beta' != beta} 1/(beta - beta'); check on 1 + 2^-s gives c0 R^2/2 on both sides | CONFIRMED (relative to Part 1b) |
| Triangle floor | c >= 0 (autocorrelation of a non-negative function), abs(Lambda_eps) = Lambda, abs(Lambda_2,eps) <= Lambda_2; Lg at the first window is the smallest in the cell | CONFIRMED as an argument; the three positive floors were not recomputed |

## B. Numerical reruns with independent code and different cases

1. **Zeta failure at t = 1e8 (item O4 of the author's pass, a third route).** Own code: sieve, dense Lambda_2 by direct convolution, c from a 64-node Chebyshev interpolant of an 80-node Gauss-Legendre quadrature of the sin^4 autocorrelation (not the closed form of `mixed.py`/`mixed_ball.py`, not the midpoint rule of `referee_local.py`), float64 sums.

| point | this referee: T1n, T2n | ball value in `ballx_ext.jsonl` | difference |
|---|---|---|---|
| zeta, t = 1e8, theta' = 0.95, w = 39, tau = 4.64 (P = 6945909, 473679 atoms) | 0.235909699, -0.022102380 | -0.022102384538 | 4.9e-9 |
| zeta, t = 1e8, w = 518, tau = -0.40 | 0.277485661, -0.017863920 | -0.017863917629 | 2.5e-9 |
| zeta, t = 1e6, w = 121, tau = -22.66 | 0.200418486, -0.009476408 | -0.009476408061 | 1e-12 |
| Liouville, t = 1e8, w = 52, tau = 2.40 | 0.073280120, -0.060682214 | -0.060682213296 | 6e-10 |
| DEL, t = 1e8, w = 256, tau = 6.36 (12653 primes deleted, 460908 atoms: both counts reproduced with an mpmath Ei) | 0.365785712, 0.077238935 | 0.077238933854 | 1.6e-9 |
| DEL at zeta's failing point t = 1e8, w = 39, tau = 4.64 (not in the lane's files) | 0.606146, +0.208619 | - | - |
| DEL at zeta's failing point t = 1e6, w = 121, tau = -22.66 | 0.654029, +0.237813 | - | - |

The differences at t = 1e8 are at the level expected from float64 phases (x log n near 1.6e9). CONFIRMED: zeta's partial sums have T2 < 0 at these points and DEL is positive at the same points. The sector term and bracket at the 1e6 point (0.0176, -0.0271) agree with RESULT 3.3.

2. **Lemma T and Part 1b on a series not in the lane's list.** D(s) = 1 + 0.8 2^-s - 0.6 3^-s + 0.5 4^-s (P = 4, not multiplicative), tau = 0 and 3.1 (the lane used 0 and 7.3). Zeros by float Newton from a grid, completeness by winding numbers on 32 slabs of height 50 (all equal to the count found; 364 zeros with 0 <= Im < 1650 against u T/2 pi = 364.05), polished to 1e-35 in mpmath at 40 digits; closed forms of C and G written from the definition and checked against quadrature (3e-42).

| tau | T | zeros | abs(lhs - rhs_T)/norm^2 | bound, count (i) | inside | 2nd-order defect, constant 0 | defect x T^3 | defect with the registered constant -u^2/4 |
|---|---|---|---|---|---|---|---|---|
| 0 | 200 | 88 | 1.3e-12 | 1.3e-7 | yes | 1.1e-6 | 8.7 | 0.48045193 |
| 0 | 800 | 352 | 8.5e-17 | 1.2e-10 | yes | 2.5e-8 | 13.0 | 0.48045299 |
| 0 | 1600 | 706 | 6.4e-19 | 3.7e-12 | yes | 1.2e-9 | 4.9 | 0.48045301 |
| 3.1 | 200 | 88 | 6.1e-12 | 6.0e-7 | yes | 4.1e-6 | 32.6 | 0.48045103 |
| 3.1 | 800 | 352 | 4.0e-16 | 5.6e-10 | yes | 7.3e-8 | 37.1 | 0.48045297 |
| 3.1 | 1600 | 706 | 3.0e-18 | 1.7e-11 | yes | 7.2e-9 | 29.6 | 0.48045301 |

u^2/4 = 0.48045301. CONFIRMED: the regularised identity holds inside the bound (difference falls by about 128 per doubling, i.e. T^-7); the second-order identity holds with constant 0 and the registered constant leaves a defect u^2/4. The product defect x T^3 is bounded but not constant here either (4.9 to 13 at tau = 0, 30 to 37 at tau = 3.1): "decays as T^-3" is supported as an order of magnitude, not as a clean law.

3. **Counts recomputed from the raw rows.** 59 objects; 14 x 13 = 182 class-cells = 111 + 43 + 24 + 4; 43 failing class-cells recounted from the table; ball files: 173 points at precision 128, one of them an error row (DH at t = 1e10, theta' = 0.7, P above the DH limit) that was rerun successfully, 23 at precision 256, 16 in the extension: 172 + 16 = 188. Extension rows (`ext/mixed_ext.jsonl`, 3600 rows): zeta fails in window 121 at t = 1e6 and windows 39, 247, 497, 518 at t = 1e8; Liouville 3 and 6; DEL 0 and 0. 21312 minima = 3 x 1536 + 576 + 2 x 8064; 38 failing minima = 5 + 9 + 14 + 10. CONFIRMED.

## C. Errors (wrong as written)

- **X1 (RESULT 3.3 and 3.6, last row).** "in the sample no point with T1n above 0.285 fails" and "a negative value needs T1n below about 0.3" are false for grid points. 0.285 is the largest T1n at a failing window MINIMUM. The lane's own `kappa` field (largest T1n at a grid point with T2 < 0) reaches 0.368 for zeta (t = 1e8, w = 518), 0.348 for Liouville, 0.324 for Haar chains, 0.310 for sign chains. Rerun here with independent code: zeta, t = 1e8, w = 518, tau = -0.48: T1n = 0.367641, T2n = -0.006370. The threshold is about 0.37, not 0.3, and the last row of 3.6 compares kappa of the chains (0.23 to 0.31) with T1n at the minima of zeta (0.20 to 0.29), which are different statistics; with the same statistic zeta's kappa (0.225 to 0.368) is not below the chains'. The qualitative reading (failure needs small T1; no separation in kappa) is unaffected, and the corrected numbers strengthen "no separation".
- **X2 (headline item 4, section 3.5, the lane record).** "DEL passes every window including 1200 extra": the 600 extension windows per height are w = 0..599 and contain the 24 registered ones. There are 1152 new windows, 1200 in total. "zeta fails on 5 of 1200" is correct as a count over the extension set.
- **X3 (section 4 table, zeta row; N4 of the author's pass).** "min 0.20 c0 Lg" and "T1 >= 0.20 c0 Lg in the sample": the minimum of T1n for zeta over the extension is 0.1990 (t = 1e6). Rounding only.

## D. Scope (statement wider than what was run)

- **S1. The object is not the paper lane's candidate.** `c20-u4-second-order-archimedean-mixed-form` now has a directory. Its candidate (M) is norm(A_P h)^2 <= norm((Arch - A_P) h)^2, which that lane reduces on paper to Lg T1 plus a small error; it contains no A_2 = A^2 + [X, A] term. T2 of this lane is a different form. The requests in that lane's `FOR_NUMERICS_LANE.md` (collapse in balls, lowest eigenvalue of Lg - 2 Re A_P on 200 windows with DEL at b = 0.9 and 0.7, the norm form, the twins test) were not run here. "The U4 residual ... is closed as MEASURED" therefore means: T2 as defined in GATE section 1 is closed; the paper lane's (M) is closed by that lane's own paper argument, not by this census. The proposed map row ("do not look for a zero statement in the sign of the completed second-order pair form at P = t^theta'") should name T2, the sin^4 vectors and the constant reserve.
- **S2. DEL as "a control with a zero at 0.75".** At every stage run, DEL is zeta's prime sum with primes removed, and the greedy rule removes the heaviest terms: the primes deleted below 100 are 5, 7, 11, 13, 19, 29, 37, 41, 53, 67, 79, 89 (recomputed here), and the weight c(log n) n^(-1/2) is largest at small n. DEL's T1n at zeta's failing points is 0.61 and 0.65 against 0.24 and 0.20 for zeta. DEL passing is a consequence of a smaller prime sum; no finite stage has a zero at 0.75. The author's N3 says this; headline item 4 and the DEL row of section 4 ("the zero at 0.75 is not read") should carry the same qualification. Registered outcome (a) is met literally. The stronger evidence for the obstruction is outcome (d) (certified negative values for zeta itself) together with ZQ, HQ3 and the chains.
- **S3. PASS and ZQ.** As the lane states: PASS is a grid statement with one certified point per class-cell; ZQ is float only (24 class-cells), not rerun here. The correlation and moment figures of the 3.3 table (bracket mean, sd, correlation with T1n) are POST-HOC and NOT RECHECKED by this referee beyond the two points in section B.

## E. Checks required by the assignment

- Assumes RH: no. Every object is a finite sum over n < P or a zero of a Dirichlet polynomial with at most 30 terms.
- Restates verified height: no.
- Known theorem presented as new: no. The partial-fraction expansion and the strip count are labelled CLASSICAL; Lemma T is elementary integration by parts and is presented as such.
- Zeta-only mechanism: none is claimed. The controls relevant to the opposite claim (zeta fails, DEL passes) were rerun here (section B.1).
- Server rules: not audited beyond the lane's own record (17 units, none loaded at the end per `units.txt`); the author's E5 records a requested-memory total above the lane default.

## F. Requirement flags (set by this referee)

- R1 = false. No step uses multiplicativity; the identities hold for non-multiplicative series (confirmed on a fourth one here) and Haar chains pass and fail as zeta does.
- R2 = false. Finite sample of windows; the inequality fails for zeta on 5 certified windows.
- R3 = false. No control fails for a structural reason; failures are by coefficient size and zeta fails where the chains fail.
- R4 = false. Nothing passes from P = t^theta' to the critical line.

## G. What survives

For the form T2 = 2 Re <h, (B^2 + [X, A]) h>, B = Lg/2 - A_P, sin^4 window vectors, constant reserve: (1) the algebraic identities of 3.1 to 3.3 and Lemma T hold for every Dirichlet polynomial with a_1 = 1; (2) the second-order zero-sum identity holds with constant 0 at fixed T (certified on six series by the lane, confirmed on a seventh here), limit not enclosed; (3) T2 >= 0 is false for the partial sums of zeta at theta' = 0.95 at five certified points (three reproduced here by a third route) and true at the same points for the deletion control; (4) T2 < 0 occurs only where T1/(c0 Lg) is below about 0.37 in the sample, with no separation of zeta from sign or Haar chains. Not established: any statement about the paper lane's candidate (M), about other test vectors or a non-constant reserve, or about ZQ in ball arithmetic.
