# REFEREE (independent, lens: general) for c16-ctheta-proposition5-power-sum

Date: 2026-11-19. Referee is not the author of the lane. The author's own second pass (not an independent pass, by its own statement) is kept unchanged at the end of this file.

Outcome: **the verdict "precise obstruction" holds, with the scope corrections E1 to E3 below.** No statement about zeros of zeta is made or supported. Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

## 1. PROVED steps, re-derived by hand

| Step | Re-derivation | Outcome |
|---|---|---|
| Lemma A | int_0^u (1 - v/u) cos(zv) dv = (1 - cos uz)/(u z^2) by one integration by parts; Re cos((y + ib)v) = cos(yv) cosh(bv); K_u(-b+iy) + K_u(b+iy) has real part 2 int (1 - v/u) cosh(bv) cos(yv) dv | HOLDS |
| Theorem B | F_u(x) = (1/2) int_{-u}^{u} (1 - abs(xi)/u) e^(i xi x) d xi, valid for complex x, so the transform of F_u(x + ib) is pi (1 - abs(xi)/u)_+ e^(-b xi); Poisson summation with finitely many non-zero coefficients; k and -k combine to 2 cosh(k v_1 b) cos(k v_1 y) | HOLDS |
| (B1) | no k with k v_1 < u when d <= 2 pi/u | HOLDS, at the fixed u; see E1 |
| (B2) | d = 4 pi/L', v_1 = L'/2, factor (1 - v_1/u) = 1/2 up to O(1/log t); the k = 2 term carries (1 - L'/log t) = log(2 pi)/log t and is lower order for b = O(L^(-3/2)); min = -(L'/2)(cosh(b L'/2) - 1); b <= (4/L') sqrt(M/L') | HOLDS |
| (B3) | q^z + c + q^(-z) = 0 with c > 2: sin(y log q) = 0, cos(y log q) = -1, cosh(b log q) = c/2; spacing 2 pi/log q | HOLDS |
| Lemma T, (T1) | written out both halves of the cosine: the half at xi = v_0 + eta gives (pi/2) e^(-i phi) e^(-i v_0 (zeta - t)) [(1 - v_0/u) B - B_1/u]; the half at -v_0 + eta is its conjugate after zeta -> conj(zeta) because B(conj z) = conj B(z) and B_1(conj z) = -conj B_1(z) (B_1 is i times a function real on the real line); symmetry of the set under conjugation gives Re[e^(-i phi) S_u] | HOLDS |
| (T2), (T3) | u S_u - u_1 S_{u_1} = pi (u - u_1) T; abs(T) <= (u (M + D_u) + u_1 (M + D_{u_1}))/(pi kappa u) <= (2 - kappa)(M + D)/(pi kappa) | HOLDS |
| Step 3 | abs(delta z/2) <= 1/2 for the cluster; abs(sinc^2 - 1) <= 0.0862 on that disc, so Re B >= 0.9138 delta/(2 pi) and 2 x 0.9138/(2 pi) = 0.2909 >= 0.29 (with the rounded 0.91 the product is 0.2897: the stated 0.29 is correct only with the unrounded constant); ordering b_1 >= ... >= b_n is the ordering abs(z_1) >= ... required by the theorem; m = n gives (16e)^(-n) and v in (V/2, V]; conjugate members and on-line ordinates have exponent modulus <= 1 | HOLDS, given the classical theorem |
| Remark (i) | (1 + lambda) log(8e(1 + lambda))/lambda at lambda = 5 is 1.2 x 4.871 = 5.85 (minimum over lambda is near 4 to 5) | HOLDS |
| Lemma R | first bound: int_0^u (1 - v/u) dv = u/2; second: two integrations by parts, phi(0) = phi(u) = phi'(0) = 0; int (1 - v/u) b^2 cosh(bv) dv is in fact exactly (cosh(ub) - 1)/u, so the bound can be sharpened to (8/y^2)(cosh(ub) - 1)/u; the stated bound is weaker and valid | HOLDS |
| Lemma R, example | at y = 2 pi/u, b = A/u: cos(2 pi + iA) = cosh A and Re (2 pi + iA)^(-2) = (4 pi^2 - A^2)/(4 pi^2 + A^2)^2; F_u vanishes at non-zero multiples of 2 pi/u | HOLDS |

Turan's second main theorem: the referee recalls the same form (Sos-Turan constant 8e, minimum over partial sums in the order of decreasing modulus; Montgomery, Ten Lectures, chapter 5) and did not open the source either. 200000 trials (n = 2 to 6, m in {0, n, 5n}, including nodes clustered near 1 at scales 1e-3 to 1): smallest ratio 87, no counterexample. This remains a recalled statement. If the constant differs, only the number 15.1 (and 5.85) changes.

## 2. Numerical checks rerun on different cases (server unit rh-c16ct-refgen-1119225800, 4 cores, 8 GB limit, finished; code in ~/rh-push/c16-ctheta-proposition5-power-sum-referee-general/refchk.py; nothing left running)

| Check | Case (not used by the author) | Result |
|---|---|---|
| Theorem B | direct sums over 8e6 + 1 pairs with the 1/x^2 tail added: (d, b, u, y) = (0.9, 0.37, 11.3, 0.123), (0.9, 0.37, 11.3, 0.45), (0.5, 0.5, 12, 0.2) (invisible regime, b = 1/2), (1.7, 0.3, 9, 0.4) (two harmonics) | 30.19236871 against 30.19236872; -28.54105797 against -28.54105796; 12.56637045 against 4 pi = 12.56637061; -1.66150982 against -1.66150984. Differences 1e-8 to 2e-7 |
| Lemma T | three seeded sets (60 on-line ordinates, 3 pairs with b up to 0.38, u = 6, kappa = 1/2): D_u from the formula against quadrature of int G_u B; sup abs(T(v_0)) over the allowed range against (T3); the Turan lower bound on (V/2, V] | D: agreement to 6e-8. sup abs(T)/bound = 0.17, 0.14, 0.19. Turan: left side 0.23 to 0.60 against right side 2e-6 to 5e-6. Final bound (T) gives 12.8 to 18.1 against b_1 = 0.25 to 0.38 (true and far from sharp at n = 3) |
| Finite tapered row, ball (400 bits) | A = 30, n = 66, spacing pi, profile cos^2; y to 40 beyond the row at step 0.11 and from 40 to 2000 beyond the row at step 0.83; 16 values of u from 0.03 to 1, five of them below 1/2 and several off the author's grid | passes: lower bound of min G +0.0132 (near, u >= 1/2), +0.0340 (near, u < 1/2), +2.9e-5 and +7.3e-5 in the far zone. A = 12, n = 27 (odd n): +0.0111, +0.0286, +1.3e-5, +3.2e-5 |
| Same, below the law | A = 30, n = 60 | fails, -7.86 near the centre at u = 1 |
| Same, other profile | A = 30, n = 72, profile cos^4 (n = 2.4 A) | FAILS, -2758 near the centre; also -4.4 at u = 0.4 |
| Same, other spacing | A = 30, n = 75, spacing 2 pi/2.5 (n = 2.5 A) | FAILS, -11.1 near the centre |
| Stored clusters on zeta's ordinates, theta = 1 | cells (1e8, n = 12, b = 0.49), (1e7, n = 6, b = 0.49), (1e9, n = 3, b = 0.25); y at step 0.02/u_max; 53 values of u from 0.02 u_max to u_max; y within 60/u_max and also within 40 units (all stored on-line ordinates included) | min G = 1.399, 0.735, 0.498 near the cluster (stored: 1.402, 0.709, 0.499); over the 40-unit range 0.507, 0.283, 0.498; for u < u_max/2 the minimum is 3.6 to 7.0. Ball value at each overall minimum equals the float value. All three pass |
| Control: one pair alone | A = 0.3, 1, 3 | min -0.0023, -0.0308, -0.557: never passes with M = 0; agrees with "-0.03 at A = 1" |

Tables of RESULT section 4 were compared with `tables.txt` and with three `parts/` records: consistent.

## 3. Errors and scope corrections

E1 (scope of the first direction; the main correction). Theorem B is exact for an infinite row at a fixed u. A row with fixed spacing d and fixed b > 0 does NOT satisfy C(theta) as an all-heights statement: it runs through all heights, and once theta log t > 2 pi/d the k = 1 term appears and the row fails where cosh(v_1 b) > 1/(2(1 - v_1/u)). What is PROVED is the window form: for each T, the row with d = 2 pi/(theta log 2T) satisfies G_u(tau) >= 0 for all real tau and all u <= theta log 2T, with every pair at any offset b <= 1/2. That refutes "C(theta) on [T/2, 2T] implies the region near T" for arbitrary point sets with at most theta log(2T)/pi zeros per unit length (within the Riemann-von Mangoldt density only for theta < 1/2). The all-heights failure (a single configuration satisfying C(theta) for all t >= t_0 with pairs outside the region at arbitrarily large heights) needs spacing that shrinks with height or finite rows at infinitely many heights; this rests on the finite tapered rows, which are MEASURED on grids and ARGUED, not proved. The verdict line and section 3, third bullet, should carry this distinction; RESULT states it only in section 8, item 1. The sentence "with n of order log gamma no bound follows" is PROVED in the window form and MEASURED in the finite-cluster form.

E2 (range of u in the tests). C(theta) asks for all u <= theta log t. `cluster.py` and `ballfam.py` test u in [u_max/2, u_max] only. The referee runs with u down to 0.02 to 0.03 of u_max found no failure in the cells tested (three stored clusters, two rows), so no table entry is contradicted; the other cells remain tested on the upper half of the range only.

E3 (the linear law is specific to one profile and one spacing, and is a law in row length). At A = 30 the cos^4 profile with n = 2.4 A fails by -2758, and spacing 2 pi/2.5 with n = 2.5 A fails by -11.1, while spacing pi with n = 2.2 A passes. In RESULT 4.5 the sentence "n = 2.2 A to 2.5 A passes" covers the spacing-pi rows; the row at kappa = 2.5 in that table has n = 3 A. Consistent reading of all rows: the row must be longer than about 2.2 pi b_max in ordinate (n >= 1.1 kappa A), for the cos^2 profile. Linear growth of the passing offset with n stands (lower constant about 1/2.2 at spacing pi/u, upper constant 5.85/(1 - kappa) from Lemma T).

E4 (Lemma T, small gaps; none changes the statement). (a) Step 1 needs v_0 >= delta for every v in (V/2, V], that is (1 - kappa) u >= 3 delta; not stated. (b) The constant 0.29 needs 0.9138, not the rounded 0.91. (c) The reduction of C(theta) to hypothesis (H): the quoted trivial bound -4 e^(u/2)/u is not a bound for G_u in general; in the one-cluster setting the correct statement is that for abs(tau - t) > t/2 the cluster contributes at least -8 n (1 + e^(u/2))/(u t^2) and the rest is non-negative, which is smaller than what the text uses. The conclusion stands. (d) The lemma is for sets whose entire off-line part is one cluster; remark (iii) ("Proposition 5 with a proof" for n = 1) is for a set with exactly one off-line pair. For a set with off-line pairs elsewhere the statement is not proved (remark (iv), OPEN). (e) Turan's theorem is recalled, not opened, by author and referee.

E5 (Lemma R). The order log^2 t is attained only by sets that put about log t pairs inside an interval of length 1/(10u) and place the on-line ordinates on a lattice around one point; this is inside "O(log t) zeros per unit window" and outside any local-density hypothesis. RESULT says so; the task summary "the region gives C(theta') only with M ~ log^2 t" is a statement about that synthetic class, not about zeta.

E6 (measured tables). "Largest b that passes" is a lower bound from a local optimiser at one position per height; every "passes" is a grid statement (author: step 0.13/u_max; referee: 0.02/u_max in three cells). Nothing is certified between grid points. Cells n = 16 and most of n = 40 are unfinished. The clusters of 4.2 exceed the unconditional short-interval zero count for theta = 1 beyond b of about 0.07 (RESULT section 3, ARGUED), so they are point sets, not candidates for zeta.

## 4. Required checks

- Assumes RH: no. The on-line ordinates are used as a set of real numbers.
- Restates verified height: no. No claim about zeta's zeros is made.
- Known theorem presented as new: no. Theorem B is Poisson summation for a band-limited kernel; Lemma T is the standard use of Turan's theorem; both are recorded as the decision of an ARGUED proposition, not as new mathematics.
- Zeta-only mechanism: none is claimed. Every proved statement holds for arbitrary point sets, and the lane says so. Controls run by the referee: one pair alone (fails, as stated), rows below the length law (fail), other profile and spacing (fail; E3). Controls not run by anyone: unimodular twist, backward heat, Beurling, phase-rotated transfer operator, theta^w; DH is taken from c15.

## 5. Flags and surviving claim

R1 false (no step uses multiplicativity; all statements are about point sets). R2 false (nothing is established at every height; the proved counterexample is per window, E1). R3 false (no argument exists for a control to fail at). R4 false (the lane shows a limit of the device, not a passage to the line).

Surviving claim: Lemma A, Theorem B, Lemma T (given Turan's theorem, for a set whose off-line part is one cluster) and Lemma R are correct. Proposition 5 of c15 is not a two-sided correspondence for arbitrary point sets: in window form it is refuted exactly by lattice rows of spacing 2 pi/(theta log 2T); for isolated clusters the confinement constant is at most (5.85 to 15.1) n/theta plus logarithms and, on grids, at least about n/2.2 for cos^2 rows of spacing pi/u (ball arithmetic, A up to 160 by the author, A = 12 and 30 with far field and small u by the referee); the converse holds only with M of order log^2 t in the synthetic class. The all-heights form of the first failure is measured, not proved.

---

# Author's second pass (kept as written; not an independent referee pass)

Date: 2026-11-19. **This is a second pass by the author of the lane, with separately written check code (`ref_checks.py`, mpmath only; `ballcheck.py`, `ballfam.py`, python-flint). No independent referee could be started from this lane (no agent tool in this session). It does not count as an independent referee pass: every PROVED label in RESULT.md is "author only", and an independent referee is owed.**

## Items checked

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Lemma A: Re[K_u(-b+iy) + K_u(b+iy)] = 2 Re F_u(y+ib) | mpmath, 30 digits, three (u, y, b) including b = 0.49, u = 20.7 | difference 4e-31. HOLDS |
| 2 | Theorem B, formula (B), both regimes | (a) numpy rows of 400001 pairs, 9 (d, b, u) cases, 4 points y; (b) mpmath nsum, 4 cases; rederived the transform of F_u(x + ib): e^(-b xi) pi (1 - abs(xi)/u)_+ | (a) equal to 6 printed digits, including the case d = 7.5, u = 1 where the k = 1 term is present; (b) 6e-5 to 6e-4, the accuracy of the extrapolated 1/j^2 tail. HOLDS |
| 3 | Lemma T, identity (T1) | direct quadrature of int G_u w against D_u + Re[e^(-i phi) S_u] for 6 on-line ordinates and 2 pairs (u = 8, v_0 = 3.1, delta = 0.3) | 1.57811713668 against 1.57811713671; the difference is the tail of the quadrature beyond abs(tau) = 3000 (bounded by 2 sup G/(pi delta 3000)). HOLDS |
| 4 | Lemma T, identity (T2) (two heights remove the Fejer weight) | same set, u = 8, u_1 = 5 | 3e-31. HOLDS |
| 5 | Lemma T, step 3: Re B(z) >= 0.91 delta/(2 pi) for abs(delta z/2) <= 1/2 | sinc(w)^2 = 1 - w^2/3 + ..., abs(w) <= 1/2: abs(sinc^2 - 1) <= 0.25/3 + 2 (0.25)^2/45 + ... < 0.087 | HOLDS |
| 6 | Turan's second main theorem with constant 8e | 3000 random trials, n <= 5, m in {0, 1, 2, 5, 10} | smallest ratio (left side)/(right side) 10.9; no counterexample. This is a sanity check, NOT a verification: the statement is recalled, the source was not opened |
| 7 | Lemma R, bound on E(y, b) | grid of 4788 points (u in {3, 10, 20}, b in {0.01, 0.05, 0.2, 0.5}, y to 14.8) | largest abs(E)/bound 0.256. HOLDS |
| 8 | Passing clusters of sections 4.2, 4.3 | acb 256 bits on a grid offset by 0.37 steps from the float grid, 7 values of u, on-line ordinates within 15; 12 clusters | lower bounds of min G positive and equal to the float values to the printed digits. HOLDS at grid points |
| 9 | Rows alone at larger A | acb, 256 and 512 bits, float-built ordinates | A = 20: passes; A = 40, n = 88: -5e-4; A >= 80: FAILS by 1e16 and more. Diagnosis: float rounding of the ordinates against a cancellation of relative size e^(-A) (terms 1e31, result 1e16 = 1e31 x 1e-15). Recorded in RESULT 4.5 as a tolerance statement; rows rebuilt in ball arithmetic in `ballfam.py` |
| 10 | Prediction (iv) of the plan (all-outside clusters do not pass above the one-pair threshold) | 4.3 | WRONG as registered: 4 quadruples at b >= 0.2 pass at (1e9, 1) where one pair passes at most at 0.148. Recorded |
| 11 | First scale-free run | profile not normalised for even n | CORRECTED before any number was used; run discarded |
| 12 | Remark E, constant | explicit formula: sum_gamma e^(i gamma x) has singular part -Lambda(n) n^(-1/2) delta(x - log n) | CORRECTED in the text: T(v_0) = -(1/2 pi) sum_n Lambda(n) n^(-1/2 -+ it) bhat(log n - v_0) + O(1) gamma terms |
| 13 | (B2), theta = 1 | row value (2 pi/d)[1 - 2 (1 - v_1/u) cosh(v_1 b)] with v_1 = u/2 | min = -(L'/2)(cosh(b L'/2) - 1), L' = log(t/2 pi): b <= (2/L') sqrt(4M/L'). HOLDS (all zeros are in the row; there is no separate positive part) |

## Not checked

- Turan's theorem was not opened; the constant 8e and the form with partial sums are from memory. If the constant is 24e^2 (Turan's original) the leading constant of Lemma T changes and nothing else does.
- The finite tapered rows have no proof; the saddle-point argument is not written out. Nothing is certified between grid points, and the far field (beyond 60/u to 400/u from the cluster) is argued only.
- The reduction of C(theta) to hypothesis (H) of Lemma T (one line in RESULT) was not expanded into a full estimate.
- The short-interval count argument of section 3 (constant 0.11 for S(t)) uses a recalled constant.
- The optimiser's results are lower bounds for the true supremum; no upper bound was computed except through Lemma T.
- Controls not run: unimodular twist, backward heat, Beurling, phase-rotated transfer operator, theta^w, DH (taken from c15).
- The cells listed as unfinished in RESULT 4 were not completed.

## Checks requested of a referee

- Assumes RH anywhere? No. The statements are about point configurations; the on-line ordinates used in the test are below the verified height and are used only as a set of real numbers.
- Restates verified height? No claim is made about zeta's zeros.
- Known theorem presented as new? Theorem B is Poisson summation for a band-limited kernel (elementary; the T-NR factor is the standard example). Lemma T is an application of Turan's theorem in the style of the classical zero-density and zero-free arguments. Neither is claimed as new mathematics; they are recorded as the decision of an ARGUED proposition of c15.
- Zeta-only mechanism claimed? No.

## Outcome

Verdict "precise obstruction" stands for this pass. Flags: R1 false, R2 false, R3 false, R4 false. Owed: an independent referee; a written proof or a refutation of the finite tapered-row statement (weakest step 1).
