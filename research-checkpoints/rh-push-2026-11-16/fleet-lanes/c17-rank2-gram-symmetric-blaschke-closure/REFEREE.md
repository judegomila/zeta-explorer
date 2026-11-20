# REFEREE (adversarial, lens: general) for c17-rank2-gram-symmetric-blaschke-closure/RESULT.md

Date 2026-11-19. Referee scripts (not part of the lane): /tmp/c17ref/t_exact.py, t_num.py, t_dh.py, all run locally
through scripts/memcap.sh 8. No server use. RH is open; the result makes no statement about zeros of zeta and
neither does this report.

**Finding: the verdict "partial result, tried, not closed" HOLDS. Both PROVED steps (Lemma M, Theorem T) were
re-derived and confirmed. Five corrections below; none changes the verdict. Flags: R1 false, R2 false, R3 false, R4 false.**

## 1. PROVED steps re-derived

### Lemma M (confirmed)
- Coset bookkeeping re-derived by hand from the orbit list: the pairs {w, s_1 w} are
  (z1,z2)|(-z1,z1+z2), (z1+z2,-z2)|(-z1-z2,z1), (z2,-z1-z2)|(-z2,-z1), with cocycle ratio M(x_1), x_1 = z1, z1+z2, z2.
  Two terms of a coset combine to c e^{(x_2+x_1/2) tau_2}[e^{x_1 t} + M(x_1) e^{-x_1 t}] with
  t = tau_1 - tau_2/2 = t_1/2. Pairing gives the four-term K1_t. Correct.
- Independent numeric check (own S_3 enumeration by permutations of (l1,l2,l3), mpmath 140 digits, a case not in
  the lane: zeta times quartet(0.13, 2.2) times real pair 1/2 -+ 0.31, tau = (0.9, 0.7)): numerical d/d tau_2 of
  the 36-term sum against the 9-term rank-one combination, relative defect 1.8e-141.
- Corollaries M1, M2: the segment sT, 0 <= s <= 1, stays in the closed chamber and increases tau_1 and tau_2, so
  K_T - K_0 is an integral of positive kernels when the rank-one kernel is positive for t >= 0. Correct.
  The hypothesis M(u)M(-u) = 1 in the statement of Lemma M is not used by the identity (harmless).
- Rank-one hypothesis, spot check (8 x 8 Gram matrices of K1_t, t = 0, 0.2, 1, non-rigorous 140-digit LDL):
  positive for zeta, zeta times left pair 0.13 +- 5.3i, zeta times real {0.2, 0.7}, zeta times single real {0.2},
  and DH (5 x 5). Consistent with the lane.

### Theorem T (confirmed)
- Degree bound. The lane states "at most 18 per point variable" without derivation. Referee derivation:
  psi(w lam) has degree 6 in z_1 (each of the three roots occurs once up to sign; two of them contain z_1);
  D has degree 12 in z_1; every pair (nu_1, nu_2) contains z_1 in at least one member; so each term has degree
  at most 17 in z_1. The right side has degree 2 + 3 + 12 = 17. In a_1: psi(lam)psi(mu) gives 6 on the left,
  H has degree at most 6 on the right (H_11 degree 5 in a_1 by inspection of toy_exact.json). The grid has
  19 values per point variable and 7 per parameter. The identity test is valid.
- Independent exact check at parameters that are not interpolation nodes and at complex points (sympy
  rationals, own cocycle from inversions of permutations): (a_1, a_2) = (2/7, 5/11), (3/13, 10/13),
  1/5 +- 3i, 1/2 +- 7i/3, 9/10 +- i/7, two pairs (lam, mu) with Gaussian-rational entries: difference
  exactly 0 in all 10 cases. Inertia of H: (1,2), rank 1 positive, (1,2), rank 1 positive, (3,0). Matches Corollary T1.
- Corollary T1 factorisations checked: m - kappa + 1 = |a-1|^2, m - 2 kappa + 4 = |a-2|^2,
  4m - 2 kappa + 1 = |2a-1|^2, (a_1+2a_2)(2a_1+a_2) = 2 kappa^2 + m; det H = H_33 times block determinant carries
  (kappa-1)^2; at kappa = 1, H_22 = 36 m^2. The region arguments (connected regions, one sample each) are sound.

## 2. Numeric rerun with different cases (referee code, 140 digits, non-rigorous LDL, order 10, T = 0 unless stated)

| case | negative squares |
|---|---|
| zeta | 0 |
| zeta times quartet(0.37, 5.3) (not a registered configuration), T = (0,0) and (0.2,0.7) | 0, 0 |
| zeta times quartet(0.13, 2.2) times real pair 1/2 -+ 0.31 | 0 |
| quartet(0.37, 5.3), six points within 1e-1 .. 1e-6 of the Lemma R location (1-a, a) | 0 |
| left pair 0.13 +- 5.3i only (control) | 2 |
| right pair 0.87 +- 5.3i only | 0 |
| single real zero 0.66 (control) | 1 |
| quartet displaced by 1e-8, order 10 | 0 (consistent with the calibration table: not visible at this order) |
| M = 1, M = -1, toy M_0 at T = 0 | entries 1e-142 (zero) |

Counts in the result re-added: table of orders sums to 1,397,025; 1,397,025 / 2,970,240 = 47.0%;
136 x 7 x 8 x 8 = 60,928; 3,472 + 1,736 = 5,208; DH 1,092 + 84 + 108 = 1,284. Logs main.log, main_local.log,
ext.log, controls.log agree with the text. The server part was not rerun.

## 3. Controls run by the referee: a finding the result does not contain

Lane code k2.py, certified inertia, T = 0, orders 5, 12, 24, four point sets each (half of them at the
Lemma R location), base DH against base zeta:

| insertion | base zeta | base DH |
|---|---|---|
| none | 0 negative in 12 of 12 | 0 in 12 of 12 |
| unpaired left pair 0.2 +- 3i | 2 in 12 of 12 | **0 in 12 of 12** |
| single real zero 0.25 | 1 (order 5), 2 (orders 12, 24) | **0 in 12 of 12** |
| single real zero 0.75 | 1 in 12 of 12 | **0 in 12 of 12** |

So with the DH base the form does not detect a reflection defect or a real-zero parity defect at all (MEASURED,
36 certified matrices, order at most 24). The inertia law of section 3.3 is a statement about a base M with the
pole at 1 (as Lemma R and Theorem T's base M_0 have); it is not a law of the device in general.
Consequences for the text:
- The test "DH at points near its own off-line zero" (108 matrices) cannot fail by the mechanism the lane
  identifies, because that mechanism is absent for DH. It is not evidence about anything.
- Section 6 sentence "The device reads the functional equation of the divisor with very high resolution" holds
  only relative to the pole at 1; for a pole-free base it reads nothing that was found.
This strengthens R3 = false.

## 4. Errors and overstatements

E1 (section 5.3, backward heat t = -1). The explanation "the zeros that have left the line are still in the strip
and symmetric" is not supported. No off-line zero was located at t = -1; the count of real zeros below 60 changes
from 13 to 12, an odd change, which cannot be a pair leaving the line. The test points have height at most 40.
"Passes at t = -1" is a low-height, non-rigorous statement and may be vacuous (no off-line zero in the tested
range). The base at t = 0 is M (u-1)/(u+1), not zeta's M (stated in the result; the pole at 1 is removed, which by
section 3 above changes what the form can detect).

E2 (headline of Lemma M). "Positivity on the chamber is equivalent to positivity at T = 0" is PROVED only under
rank-one positivity for t >= 0: classical for zeta, imported from row D9 Theorem C for conjugate pairs (not
re-derived in the lane or here; spot-checked numerically), MEASURED for distinct real pairs. For the registered
configurations that contain real pairs (order-2 class and part of the products) "decisive at T = 0" is MEASURED.
The body of the result says this; the summary line and the lanes.jsonl claim do not.

E3 (summary item 5). "Exactly kappa negative squares" is a MEASURED statement on 16 configurations with 2 of 320
matrices below the predicted count; "exactly" should read "at most kappa observed, equal in 318 of 320". The
law also needs the qualifier of section 3 above (base with the pole at 1).

E4 (section 3.4). "Generic rank d(d+1)/2" rests on d = 2 and d = 4 only. "Closure cannot be proved by a strict
inequality" is ARGUED from the model, not established for zeta (for zeta the certified matrices are strictly
positive definite; the wall is in the parameter of the inserted set).

E5 (novelty). Lemma M is the rank-2 form of the standard fact that the derivative of a truncated inner product
in the truncation parameter is a boundary term of lower rank (Maass-Selberg relations). It is new relative to
the campaign record, as the result says; it should not be cited as a new theorem. Theorem T is a statement
about a rational model.

Not errors: nothing assumes RH; no verified-height input; the source check is stated with its limit (range of
the truncation parameter not found in the source, so (I2) for zeta at T = 0 is MEASURED). The "uniform sample"
statement rests on the fixed shuffle (front and back of one shuffled list), accepted from the logs.

## 5. Requirement flags (set by the referee)

- R1 false. No step uses multiplicativity essentially; DH (no Euler product) passes, and passes with every insertion tried.
- R2 false. No conclusion about zeros at any height.
- R3 false. Symmetric insertions, ZQ (lane: 3,360 certified), DH and DH with asymmetric insertions pass.
- R4 false. No passage to the critical line; Lemma M stays inside one inequality.

## 6. What survives

Lemma M (identity; apex reduction conditional on rank-one positivity). Theorem T and Corollary T1 (rational model,
degree 2; degree 4 at 14 exact parameter values). MEASURED: 1,397,025 + 5,208 certified positive matrices for
zeta times symmetric insertions; the inertia pattern for zeta's M; ZQ rational form passes. Closure for zeta is
neither proved nor refuted. Added by this report: with a pole-free base (DH) the form does not detect reflection
or parity defects.
