# REFEREE: c5-target-fe-order2-ledger (lens: general)

2026-11-18. Adversarial review of `RESULT.md`. Local runs only, through `scripts/memcap.sh 8`; compute server not
used. Referee scripts were kept outside the lane (`/tmp/ref_c5/`): an independent float LP (scipy HiGHS, formulas
re-typed from RESULT section 3) and spot checks with the lane's own exact solver (`tiers_fe.feas`).

## Outcome

**Core holds, with one section to correct.** The PROVED steps (Lemma U, scalar statements (R), (D), (E)) are
confirmed. The source-geometry ledger (13/15 at w = 0; reflected >= 13/15 + w/15; unreflected with polar term >= 1;
empty dual >= 11/12; 5/6 floor) is confirmed. Statement 3 of the verdict (where h > 1 vertices appear, and that
they fall below 1/2) is false as written: `tiers_fe2.py` never passes the `G` argument, so every X and Y run was
executed with G = "src" whatever its label says. With the labelled G actually passed there are further h > 1
vertices, one of them at 7/9 (not below 1/2). Everything remains a MODEL estimate-system abscissa; no statement
about zeros is made or affected.

## 1. PROVED steps re-derived

**Lemma U: confirmed.** Checked line by line against Proposition 2.1 (paper.txt 381-455).
- Mellin transform of f_2 Z^{-c_1}: f_2 Z^{-c_1} = (1/2 pi i) Int Z^{u} A_2(u + d) du, so the transform is A_2(s + d). Correct.
- Decay at Z -> 0: contour shift right, as in Proposition 2.1. Correct.
- E - c_1 = max(beta* - sigma_1, beta* - sigma_2 - d) = beta* - min(sigma_1, sigma_2 + d). Correct.
- Final step: beta_eta <= max(sigma_0, a, max(sigma_0, beta_eta) - d) with a = beta* - min(sigma_1, sigma_2 + d);
  if beta_eta > sigma_0 the third term is beta_eta - d < beta_eta, so beta_eta <= max(sigma_0, a) < beta*,
  uniformly in eta. Correct. The case d < 0 follows by exchanging indices.
- J cancels: the lemma is a statement about f_1 - f_2 alone. It uses no Euler product beyond "zeros of L are poles
  of 1/L", so it holds for every target admitted by Proposition 2.1 (consistent with R1 = false).

Scope remarks (not errors; RESULT section 8 item 2 states most of this):
- For a fixed probe h = 1 - lx + l is defined by the parameters; Lemma U adds only that no second signal of the
  form Z^{s+c'} with bounded H can be compared to the same J. It says nothing about (i) a signal with slope
  different from 1 in log Z, (ii) a different probe obtained by reflecting and then truncating or re-weighting.
  The sentence "no reflection changes h" is established for re-expressions of the same number J in the
  Proposition 2.1 format only.
- h <= 1 itself is the geometry hypothesis lx >= l (GEO of `r3-method-limit`), not a consequence of Lemma U.

**(R): confirmed.** With L0 = 5/6 + (lx - l)/6, L0' = L0 + b/12, L_K = L0 + (M + l - 1)/2,
H0 = 4/3 - ly/2 - 5lx/6 + l/3: weights 4/15, 2/5, 2/15, 1/5 sum to 1; coefficients of lx, ly, l vanish
(2/45 + 1/30 + 4/45 - 1/6 = 0; 1/30 + 1/15 - 1/10 = 0; -2/45 - 1/15 + 2/45 + 1/15 = 0); constant 39/45 = 13/15.
L_K(w) = L_K + w/2 gives +w/15. Needs G >= b/12 and the floor-class high bound H0 (MODEL), no geometry.

**(D): confirmed.** B_low >= 5/6 + M/12 - l/6 + k/2 from G >= b/12; the three cases (M >= 2 + 2l;
(1 + l)/2 <= M < 2 + 2l; M < (1 + l)/2) give 1, > 1, >= 9/8 + l/8. The polar term is essential: with G = 0 the
unreflected branch gives 5/6 in source geometry and 1/3 in free geometry (section 3 below).

**(E): confirmed.** T <= 0 gives M <= 1/2; H0 >= 4/3 - 5M/6 >= 11/12.

**Lemma V: confirmed as an identity** (1/L(1-s, conj eta) converges for Re s < 0).

**Section 1 (source reading): confirmed for the displayed formulas.** T_d = 2H + 2A_0 + 2z_a - N_* - N_0 - 3B_0 is
(14.11) at paper.txt 5870; the term max(H, v + l_b) is in (14.14); M' + l' - 1 = -3d and T_d - (H - 3d) <= small
are at 6232-6236; Liu II Lemma 2.4 k(m, l) = max(0, (1 + 3l - 2m)/4, m + l - 1, (3l - 1)/2) at lines 629-633.
T <= M iff M + l <= 1. |R(sigma + it)| ~ |t|^{4 sigma} is correct for the displayed gamma ratio; the w-extension
remains a model, as labelled.

## 2. Numeric rerun, different cases (independent LP; exact spot checks)

| case | referee value | agrees |
|---|---|---|
| regression w = 0, refl | 13/15 at (2/5, 2/5, 1/5) | yes |
| refl, w = 3/100, 3/20, 3/10 | 13/15 + w/15 (0.868667, 0.876667, 0.886667) | yes; exact solver: feasible at 13/15 + 1/50, infeasible 1e-9 below (w = 3/10) |
| refl, w = 3/5, 4/5 | 0.94444, 1.0000 (>= 13/15 + w/15) | consistent with (R) |
| dir, source / Q / free, G src or polar, box 8 and 32 | 1 | yes |
| empty, source and free | 11/12 | yes |
| dir0, source, box 4 and 16 | 5/6 at (1, 1, 1) | yes |
| r = 5 full ledger; k = 0 | 21/25 (exact: feasible, infeasible 1e-9 below); 4/5 | pattern 1 - 4/(5r), 1 - 1/r |
| r = 8 full ledger | 9/10 | pattern |
| free, refl K removed | 23/27 | yes |

Remark: equality B = 13/15 + w/15 persists to w = 3/10, further than the "w <= 1/5" stated. Not an error.

## 3. Errors

**E1 (script bug; affects RESULT section 4 second table and verdict statement 3).** In `tiers_fe2.py` no call
passes `G=`; the default is "src". Labels "G polar" (X2, X5, X6, Y2-Y7) and "G = 0" (X3, X4) do not describe what
ran. X1 = X2 = X3 and Y1 = Y2 in the log are identical for that reason. Values with the labelled G actually passed
(referee LP; starred rows also checked with the lane's exact solver, feasible at the value and infeasible 1e-9 below
or feasible at the value):

| run | RESULT says | actual |
|---|---|---|
| X3: free, dir (Lemma 9.1 as stated), G = 0 | 1 (LP) | 1/3 at (0, 8, 3, 0), h = 4, box 8 *; 0.25 = search bound at box 16 |
| X4: free, refl, G = 0, w free | 13/15, h = 4/5 | 5/6 at (0, 1, 0, 0), h = 1 * |
| Y2: lx <= l, no comp., refl or dir or empty, G polar | 1 | 9/10 at (1/15, 13/15, 1/15, 0), h = 1 * |
| Y6: lx <= l, no comp., refl K removed, G polar | 0.91026 | 0.88095, h = 1 |
| Y3, Y5, Y7 (G polar) | 0.4653 | 0.4653 (unchanged) |
| X5 "CONFIRMED for polar" | 13/15 | 13/15 (value right; the confirmation was run with src) |

**E2 (verdict statement 3 and the sentence "The last three rows are the only vertices with h > 1 or abscissa below
5/6" are false as written).** Additional vertices inside the lane's own system:
- Unreflected rows with Lemma 9.1 exactly as stated (not the hypothetical optimal sieve) and G = 0:
  free geometry 1/3 at h = 4 (box 8); geometry Q (M >= 2l), full ledger, box 4: 2/3 at (0, 4, 1), h = 2. So the
  optimal sieve dir0 is not needed for h > 1; deleting the polar term suffices.
- lx <= l, no compensation, reflected branch with only K removed (P kept), G = 0: **7/9 at (0, 5/3, 1/3, w), h = 4/3**,
  exact-feasible, independent of the box (8, 16, 64) and of w. This vertex is below 5/6, has h > 1, and is NOT
  below 1/2, so the argument "these runs fall below 1/2, hence the reduced system is inconsistent" does not cover it.
  It needs two hypothetical deletions (K-loss; polar and P_a^2/Y' terms with b = 5/3) at lx = 0, plus the
  uncompensated ideal high side at h > 1. It is a MODEL vertex, not a result, and no lemma supplying those inputs
  is stated; but the lane's claim that no such vertex exists is wrong.
Corrected statement 3: with G containing the polar term b/12, h > 1 vertices occur only at lx < l with dir0 or with
K and P deleted, and those are below 1/2 at the search bound. With G = 0 they also occur for the stated Lemma 9.1
sieve and for the reflected branch with K alone deleted (7/9, h = 4/3).

**E3 (proposed map row Z15b).** Its last sentence repeats E2 and must be amended before use. The rest of the row
(Lemma U; Prop. 5.1 as the source of M + l <= 1; the four ledger values) stands.

**E4 (minor).** Section 4 table row "lx <= l, no compensation, refl or dir or empty: 1" does not state G; it is the
src value. With polar G it is 9/10 (E1).

No other error found. Nothing assumes RH. Nothing restates verified height. Lemma U is an elementary uniqueness
statement for the Mellin exponent in the Proposition 2.1 format and is presented as such, not as a known theorem
made new.

## 4. Controls

No zeta-only mechanism is claimed, so there is no conclusion a control must break. Checked directly:
- Lemma U uses only Proposition 2.1; it holds for any target family admitted there (DH components, E_a with shifted
  abscissae, sign twists with beta* replaced by their own supremum). Consistent with R3 = false.
- THIN / sign twists restricted to the dir branch: abscissa 1 reproduced in source, Q and free geometry with G src
  and polar (referee LP). With G = 0 the dir branch gives 5/6 (source) and 1/3 (free), so "abscissa 1 in every
  geometry" requires the polar term, as (D) says.
- DH and E_a paragraphs are ARGUED in the RESULT and are not verified here; they carry no numeric claim.

## 5. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no step uses multiplicativity; Lemma U and the LP hold for any admitted target |
| R2 | false | no conclusion about zeros; height only raises the model abscissa |
| R3 | false | nothing is claimed that a control must break; controls satisfy the same statements |
| R4 | false | h <= 1 stands under lx >= l; the h > 1 vertices are MODEL vertices with hypothetical deletions |

## 6. What survives

Verdict "precise obstruction" stands for the proved row in source geometry (lx, ly >= l):
(1) Lemma U; (2) M + l <= 1 is "dual length T = 2M + l - 1 <= number of rows" (reading of (14.11), (14.14));
(3) ledger: infimum 13/15 at w = 0, reflected >= 13/15 + w/15, unreflected with polar term >= 1, empty dual >= 11/12,
5/6 floor unchanged, r = 3, 4, 5 following 1 - 4/(5r) and 1 - 1/r. All MODEL abscissae relative to unrefereed
sources. The free-geometry classification of h > 1 vertices must be replaced by the corrected statement in E2, and
`tiers_fe2.py` rerun with `G=` passed.
