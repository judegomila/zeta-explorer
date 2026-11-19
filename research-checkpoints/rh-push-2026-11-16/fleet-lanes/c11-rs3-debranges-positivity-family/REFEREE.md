# c11-rs3-debranges-positivity-family: REFEREE

Status of this file: **author's own adversarial pass, not an independent referee.** This lane had no means to start a second agent. Count it as zero independent referees. The checks below were written after the result and recompute the load-bearing items by a second route where one exists.

## Items checked

1. Source. Conrey-Li arXiv:math/9812166v1 was read in full (10 pages). Theorem 1, Theorem 2, (3.1)-(3.4), the chi_4 examples and Sarnak's remark are quoted from it. de Branges' own papers were not opened; every attribution to de Branges is relative to Conrey-Li's text ("essentially due to de Branges").
2. Reproduction of the two published numbers (`screen.py`): (3.2) = -5.38910050718294518e-69 (published -5.389100507182945...e-69); (3.4) = -0.000131957293372 (published -0.000131957). HOLDS.
3. Lemma 1 (q_h = cos Delta_h). Second route: direct evaluation of -Re{xi' xi(rho+h)} against the arctan sum over the first 400 zeros with a tail estimate (`checks.py`). 18 cases; agreement 5e-6 (n = 1) to 1.4e-2 (n = 60, h = 2). The sign of every case agrees, including the negative case n = 34, h = 1 (-0.0879 against -0.0858). HOLDS at the stated accuracy. Not checked: the convention "symmetric summation" analytically; the tail formula is an estimate.
4. Lemma 2 (boundary-zero condition). The argument is the first-order expansion at a simple zero. Numerical check (`jc.py`): Re{xi(s)/xi(s+1)} < 0 at rho_n + 0.001 - 0.05i and rho_n + 0.01 - 0.3i for n = 1, 2, 3. HOLDS. Caveat found: for h = 0.1 the four test points all gave positive real part; the failure there needs a direction within 0.058 rad of the tangent and was not exhibited numerically. The text claims it from arg c != 0 only. Wording in RESULT section 2 is consistent with this ("nonzero, so ... fails"), which is a deduction from Lemma 2, not a measured negative value.
5. V1b kernel identity. Direct evaluation of the reproducing kernel of H(E_a) at (w, w + 2ai + 1e-8), a = 0.75, against xi'(rho) conj xi(rho + 2a)/(2 pi): real parts 1.2776654480e-6 against 1.2776654405e-6. HOLDS. The imaginary part matches the value at conj rho, as it should for w = -gamma - ia.
6. LAT. cosh L + sinh L Re(i cot u) with Im cot u < 0 for Im u > 0: correct (cot maps the upper half-plane to the lower). Random check minimum 1.0006 >= cosh(0.01). HOLDS. Note: LAT has no gamma factor and constant zero density; it is a control for the device, not for read set RS-3 as a whole. GAM carries the gamma side and passes only the necessary condition (N2_h), h < 2; whether GAM satisfies the full condition (C) is OPEN (it fails the weight form by Lemma 2).
7. Lemma 3 was not checked beyond the one-line kernel factorisation; the domain question (T defined on the span of kernels, closability) is not addressed. It is not used for a failure claim.
8. V1c for 1/2 < sigma_0 <= 1 and V3b: no independent check. Both rest on recalled theorems (Bohr; joint universality) and are labelled ARGUED. A referee should open Titchmarsh ch. XI for the exact form of the density statement on a fixed vertical line and check that the logarithm is the one continued from the right.
9. Table of section 5: the row values were copied from `screen.log`; re-read against the log after the run finished. The DH samples near 1000 and 1e4 are small (17 and 11 zeros); "same rate as zeta" is supported only at the level of these counts.
10. A stray output file (`screen.json`) was written to the repository root by a relative path; it was moved into the lane directory and the script path fixed. No other file outside the lane directory was touched except the lane's line in `campaign/lanes.jsonl`.

## Statements weakened by this pass

- "(N2_h) fails for every h > 0" is not measured for h <= 0.5 below 1e4; RESULT states it as ARGUED.
- "DH fails at the same rate" restricted to the measured counts.
- The h = 0.1 weight-form failure is a deduction, not a measured negative value.

## Verdict of this pass

The obstruction (device closed at stage A; condition = zero-free statement AND phase balance; false for zeta at named steps; lattice control passes) stands on items 2 to 6. No requirement flag is claimed. Independent referee: owed.

---

# Independent referee (lens: general), 2026-11-19

Independent of the author's pass above (kept unchanged). Source re-opened by this referee: Conrey-Li arXiv:math/9812166v1 (PDF fetched, text extracted). Numerics rerun with a separate script, different cases, mpmath 25 digits, through `scripts/memcap.sh 8`, local only, about 2 minutes; no server use. Nothing is interval-certified.

**Verdict: HOLDS as a precise obstruction (device closed at stage A), with four wording corrections (E1 to E4). No statement about zeros of zeta is made or supported. Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.**

## 1. Source check (opened)

- Theorem 1 hypotheses and conclusion match RESULT section 2 (no real zeros; |E(conj z)| < |E(z)|; conj E(conj z) = eps E(z - i); |E(x + iy)| strictly increasing in y > 0; conclusion: zeros on Im z = -1/2 and Re{conj E'(w) E(w + i)/2 pi i} >= 0 at each zero). "Essentially due to de Branges" is the paper's wording.
- Theorem 2 matches: W analytic and zero-free in the upper half-plane, T: K(w, .) -> K(w + i, .), Re <F, TF> >= 0 on F(W) implies W extends to Im z > -1/2 and W(z)/W(z + i) has non-negative real part there. So (P) on Re s > 1/2 is the correct half-plane.
- (3.2): 34th zero, 1/2 + i 111.0295355431696745..., value -5.389100507182945...e-69. (3.4): Re{xi(1 + 282i)/xi(2 + 282i)} = -0.000131957. chi_4: zero 1/2 + i 67.6369208635460683980549...; t = 8714.2 value -0.000422340607. Sarnak remark present; it cites density of values of log zeta(s), 1/2 < Re s < 2 (Titchmarsh ch. XI), logs continued from s = 2.
- The failure of (3.1) and (3.3) for zeta is the published content of Conrey-Li. RESULT attributes it correctly and does not present it as new.

## 2. Re-derivations

- **Lemma 1: confirmed, with a scope correction (E2).** xi'(rho) = -i Xi'(gamma). For sigma > 1/2, d/dsigma arg xi(sigma + i gamma) = Im (xi'/xi) = - sum (gamma - gamma')/((sigma - 1/2)^2 + (gamma - gamma')^2) with zeros paired symmetrically (the constant B + sum 1/rho is real). Integral over [0, h] of d/(x^2 + d^2) is arctan(h/d) for either sign of d. So arg xi(rho + h) = arg xi'(rho) - Delta_h, and since 2 arg xi'(rho) = pi mod 2 pi, -Re{xi'(rho) xi(rho + h)} = |.| cos Delta_h. Correct. The same computation gives Re{xi'(rho) conj xi(rho + 2a)} = |.| cos Delta_{2a} (V1b).
- **Lemma 2: confirmed.** f = c (s - rho)(1 + O(s - rho)); arg delta ranges over (-pi/2, pi/2), so Re f >= 0 near rho forces arg c = 0; arg c = Delta_h by Lemma 1.
- **LAT: confirmed.** E = sin(L(z + i/2)): E*(z) = E(z - i); |sin(a + ib)|^2 = sin^2 a + sinh^2 b gives |E*| < |E| and monotonicity for y > 0; no real zeros. sin(u + iL)/sin u = cosh L + i sinh L cot u, Im cot u < 0 for Im u > 0, so Re > cosh L. Delta_h = 0 at every zero by antisymmetry of the lattice.
- **V1c for sigma_0 <= 1: confirmed, and one gap closed.** Tight form of the argument: the Theorem-2 conclusion makes f = xi(s)/xi(s + h) analytic, zero-free, with |Im log f| <= pi/2 on Re s > sigma_0. On a line sigma in (max(sigma_0, 1 - h), 1): Im log zeta(sigma + h + it) is bounded by log zeta(sigma + h), the gamma-factor phase difference tends to a constant, so Im log zeta(sigma + it) would be bounded, against Bohr (density of log zeta(sigma + it), 1/2 < sigma <= 1; the log is the one continued from the right, which is the one the zero-free conclusion provides). At sigma_0 = 1 let sigma -> 1+ (sup_t Im log zeta(sigma + it) -> infinity by Kronecker). RESULT treats sigma_0 <= 1/2 by Lemma 2 with only h = 1 and h = 0.1 measured; this is not needed: Re s > sigma_0 contains Re s > 3/4, so the Bohr argument covers every sigma_0 < 1 and every h > 0 without any measured value. Bohr's theorem was RECALLED here too (Titchmarsh ch. XI not opened; Conrey-Li cite it for the same purpose).

## 3. Numeric reruns (different cases; all MEASURED)

| Item | Case chosen by referee | Result |
|---|---|---|
| (3.2), (3.4) | same points | -5.389100507182945181e-69; -0.000131957293372. Match the paper |
| first failure of (N2_1) | q_1 at zeros 1 to 40 | only n = 34 negative (q = -0.08788). "34th zero" confirmed as the first |
| Lemma 1 | (n, h) = (20, 0.7), (7, 1.5), (3, 3), (34, 1); 300 zeros + tail | direct 0.94163 / 0.32021 / -0.22311 / -0.08788 against cos Delta 0.94186 / 0.32013 / -0.22346 / -0.08419. Signs agree; differences 1e-4 to 4e-3 (truncation) |
| Lemma 2, stated point | s = 0.501 + 14.0847i, h = 1 | Re = -0.023352 (RESULT: -0.02334; the difference is the rounding of the ordinate) |
| Lemma 2, zero 4, h = 1 | arg c = -0.9371; s = rho_4 + 1e-3 e^{i theta} near the tangent | Re f / abs(f) = -0.451 with Re s - 1/2 = 4.5e-4 |
| Lemma 2, h = 0.1 (author's pass: deduced, not measured) | zeros 1 and 4, near-tangent direction | arg c = -0.05796, -0.09552; Re f / abs(f) = -0.0190, -0.0377 at Re s - 1/2 = 2.9e-5, 4.8e-5. Now measured negative. Also h = 0.25, zero 1: -0.068 |
| V1b kernel identity | a = 1, zero 2 (author: a = 0.75, zero 1) | K(w, w + 2ai) = 4.9939049754e-11 against Re{xi'(rho) conj xi(rho + 2)}/2 pi = 4.9939049716e-11 |
| LAT | 50000 random (L, u), new seed, L up to 8 | min of Re - cosh L = +0.0011 |
| DH control | new window t in [200, 230], 24 on-line zeros; completed function real on the line to 1e-35 | (N2_h) failures: h = 0.5: 0; h = 1: 3 of 24 (min -0.317); h = 2: 12 of 24. Weight form: arg c = -0.408 at t = 200.85, so Lemma 2 fails. Off-line point 0.8085171825 + 85.6993484854i: abs = 5e-39 (is a zero) |
| GAM control | new window t in [300, 330], 18 zeros | q_1 in [0.7090, 0.7115] (cos(pi/4) = 0.7071); h = 1.9: all positive (0.088 to 0.092); h = 2.1: all negative |

The controls behave as RESULT states: DH on its on-line zeros fails (N2_1) and Lemma 2 like zeta; GAM passes (N2_h) up to h near 2; LAT passes.

## 4. Errors and corrections

- **E1 (overstatement, "equals").** The summary line "the condition equals a zero-free statement AND a phase-balance condition at every zero" is established only as an implication. Entire-function form: Theorem 1 gives (C) implies (N1) and (N2); no converse is stated, proved or argued. Weight form: equivalence with "zero-free AND (P)" rests on Lemma 3, labelled ARGUED, with the domain of T not addressed; and "Delta_h = 0 at every zero" (Lemma 2) is a necessary boundary consequence of (P), not equivalent to (P). Correct wording: "the condition implies ...". The failure claims use only the implications, so the verdict is unaffected.
- **E2 (scope of Lemma 1).** The arctan formula for Delta_h is valid when all zeros are on the line. Unconditionally Delta_h(rho) = sum over rho' != rho of arg((rho + h - rho')/(rho - rho')). The quantity q_h and every measured value are computed directly from xi and do not use RH; only the reading of q_h as an ordinate sum does. The label "PROVED given the zeros used are on the line" should read "given all zeros are on the line (or with the arg form)". No conclusion about zeros depends on it.
- **E3 (not established: "the Euler product is what makes the condition fail").** DH has no Euler product and fails at the same step on its on-line zeros at comparable rates (rerun above). What is supported: functions with zeta-type value distribution fail, functions with rigid zero spacing pass. Attribution to the Euler product specifically is interpretation.
- **E4 (LAT "passes every step").** Proved: hypotheses of Theorem 1, (N1), (N2_h), (P). Not proved: that the full condition (C) holds for LAT in the entire-function form; in the weight form it follows only through Lemma 3 (ARGUED). The stage-A stop does not need it, because zeta fails by itself.
- Minor: (i) V1b falsity is measured at h = 1, 2, 4 (and h = 3 at zero 3 here), not for every h >= 1; "(N2_h) fails for every fixed h > 0 at some height" stays ARGUED, as RESULT says. (ii) In V1c with a < 1/2 the hypothesis of Theorem 2 (W = 1/E_a zero-free in the upper half-plane) is itself the open zero-free strip; the family is unconditionally formulable only for a >= 1/2. (iii) V3b (tied conductor family) is ARGUED relative to joint universality, with no computation; this referee did not verify it and it should not be counted as proved. (iv) DH samples are small (17, 11, and 24 here); "same rate" means same order of magnitude.

## 5. Checks requested by the brief

- Assumes RH anywhere: no. Zeros used numerically are low zeros known to be on the line; E2 is the only place where "on the line" enters a formula.
- Restates verified height: no.
- Known theorem presented as new: no. Theorems 1, 2 and both counterexamples are attributed to Conrey-Li (and de Branges relative to that text); V1a = T3 and V2 = G6 are declared restatements. Lemma 2 (failure next to the first zero) and the phase reading of (N2) are elementary observations and are labelled as such.
- Controls: the device does not separate zeta from DH (on-line zeros) and is passed by a lattice. R3 fails.

## 6. Requirement flags (strict)

- R1 false: no step uses multiplicativity.
- R2 false: no true height-uniform statement is obtained; the condition is false.
- R3 false: LAT passes; DH on-line zeros, U, WT fail at zeta's step.
- R4 false: nothing reaches the critical line; the weight family is false for every conclusion half-plane sigma_0 <= 1.

## 7. What survives

De Branges shift positivity is closed as a device at stage A. Established: (a) Conrey-Li's two counterexamples reproduce; zero 34 is the first failure of (N2) at h = 1; (b) the weight-form condition with shift h implies Delta_h = 0 mod 2 pi at every zero on the boundary line, and this fails at the first zeros for h = 1, 0.25, 0.1 (measured negative real parts); (c) the (a, h) weight family is false for every conclusion half-plane sigma_0 <= 1, relative to Bohr's density theorem; (d) the lattice function satisfies all hypotheses and necessary conditions; DH on-line zeros fail like zeta. Not established: the equivalences (E1), the every-h claim in the entire-function form, V3b, the Euler-product attribution (E3). Referee count for this lane: one independent.
