# c14-joint-zeta-twist-noncone-search: REFEREE (independent, lens: general)

Written 2026-11-19 by a referee agent that did not run the lane. The author's own check is kept unchanged below as
"Appendix: author check" (RESULT.md cites its items 6 and 7). No statement about zeros of zeta is made by the lane
or by this report.

## Verdict

**Holds, with four corrections (R-1 to R-4).** Outcome "none" for the registered question stands as MEASURED on the
registered grid and draws, under the registered conventions. Every PROVED step was re-derived and confirmed. The
corrections change one secondary number (FE tier: 59 becomes 0 when the tier is read per member), one sentence of
the claim (Lemma T "only"), and the scope of the proposed map row (sign convention). None creates a survivor.

Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false. Nothing in the lane establishes a use of
multiplicativity, a height-uniform statement, a structural failure on the controls, or a passage to the critical
line; the lane is a search with a null result and does not claim otherwise.

No step assumes RH. Nothing restates verified height (no zeros are computed). Lemma J1 is an elementary Gaussian
identity and is presented as a lemma of the lane, not as a new theorem; Lemma T items are labelled PROVED /
CLASSICAL / MEASURED correctly in RESULT section 2.

## What was re-derived (PROVED steps)

1. **Lemma J1.** With g(u) = e^(tau u^2/4): g(u-h) g(u+h) = e^(tau (2u^2 + 2h^2)/4) = g(u)^2 e^(tau h^2/2). In JC2
   both monomials contain two A-values and two B-values, one monomial at (u-h, u+h; u, u) and the other at (u, u;
   u-h, u+h), so both carry g(u)^4 e^(tau h^2/2) (g real, so conjugation and real parts are unaffected). In JC1 the
   first monomial carries g(u)^2 e^(tau h^2/2) and the second g(u)^2, which gives the stated rescaling of lam by
   e^(-tau h^2/2) > 1 for tau < 0. Confirmed. The code matches the hypothesis: `kern.Heat._f` is g times K3 of zeta
   and `jk.HeatX` is g times K_chi with the same tau.
2. **Lemma T, T-NR.** T(-u) = conj T(u) follows from K_chi(-u) = conj K_chi(u) by exchanging the two shifted
   terms. Zeros: the transform is (x + 1/x + c) Lambda with x = chi(p0) p0^(1/2-s); for c > 2 the roots of
   x^2 + c x + 1 are real, negative, different from -1, so abs(p0^(1/2-s)) != 1. Needs chi(p0) != 0, which the code
   asserts. Confirmed.
3. **Lemma T, HEAT and BLS.** Even real multiplier; even real polynomial in D. Confirmed.
4. **Lemma T, E_a (CLASSICAL).** Dirichlet coefficients chi(n) n^a sigma_(-2a)(n) and the Bessel form are correct.

## Numerical checks run by the referee (local; no server use)

Interpreter: `.venv-arb/bin/python` (numpy, mpmath, scipy, python-flint). Checks A, B, D, E, F, G ran through
`scripts/memcap.sh 8`; the sums of check C and short readings of the JSON files and of the grid sign matrices (seconds, under 1 GB) ran directly.
Scripts were kept outside the lane
directory (`/tmp/c14-ref/r1.py` to `r4.py`, not persisted); each is described so that it can be retyped.

| check | case (different from the author's) | result |
|---|---|---|
| A. Rebuild of all 833 pairs on a second machine and rerun of three grid families (JC1-with, JC1-without, JC2-without) without the cascade | 41,965 functionals x 833 pairs | object names identical; 29,098,925 stored entries compared (stage 1 and stage 2): 0 different, 0 opposite |
| B. Recount of the grid tiers with own code, quantities not in `ref_recount.json` | per-class rejection counts under PZ and PA, T-train for nine classes and for the FE tier, 10 families | equal to the `_summary.json` files in all 10 families |
| C. Headline totals from the 40 summary files | sums | 38,101,627 / 21,228,601 / 20,169,475 / 278 / 4,266,644 / 0 / 59 reproduced; T-weak, full and favourable-reading T-train all 0; 4,000 shuffles, 40 of 40 planted runs recovered; ball files: 15,073 rows, 150,513 evaluations, 15,014 with a positive of each sign |
| D. Lemma J1 on the held-out HEAT pairs | 147,466 own random JC2 functionals (seed 987654321) x all 24 held-out HEAT pairs, each against the pair (zeta, same character) built by the referee (22 of these positives are not in the lane's object list) | JC2 without polar terms: 3,539,184 equal, 0 opposite, 0 undecided. With polar terms (no identity claimed): 20,786 opposite |
| E. Lemma J1 in mpmath | 320 digits, formulas retyped, direct series at u of either sign (no reflection), 48 cases on 4 held-out members (conductors 27, 29, 37, 37) | ratio of the two JC2 values over g(u)^4 e^(tau h^2/2) equals 1 to 1.9e-16 (the float rounding of the nodes u -+ h); lane float64 signs against mpmath signs: 96 agree, 0 disagree |
| F. Lemma T by direct series (mpmath, 60 digits, no reflection) | T-NR twist for (chi7.2, p0 = 3, c = 2.2), (chi11.3, 5, 2.31), (chi13.4, 2, 2.05); E_a twist for (chi7.2, a = 0.31), (chi9.2, 0.07), (chi8.5, 0.2) | T(-u) = conj T(u) to 1e-60; E_a: K(-u)/conj K(u) constant over three points to 2e-59, of modulus 1, equal to eps(chi)^2 from the Gauss sum to 5e-60 |
| G. The 59 FE-tier rows | re-evaluated from `tables/pz_ttrain_rows.json` | 59 of 59 one-signed on the 529 positives; reject T-NR, E_a, HEAT, BLS: 59; see R-1 |

Controls of a zeta-only mechanism: none is claimed by the lane, so there was nothing of that kind to rerun. The
nearest item is Lemma J1 (a control passes exactly), covered by D and E.

## Corrections

**R-1. The FE tier is read per class, but one DH training member keeps a functional equation; read per member the
59 become 0.** RESULT section 2 reports residual below 1e-8 for 5 of 28 twisted DH members, among them the training
pair DH x chi4.3. This agrees with the root-number relation eps(chi psi) = +-chi(q_psi) psi(q_chi) eps(chi) eps(psi)
for coprime conductors: for real psi the twisted real part keeps the reflection when chi_G(q_psi) is real (chi5(4)
= -1: kept; chi5(3) and chi5(8) = -+i: lost). The FE tier exists "because a class whose twisted member has no
functional equation can be rejected by a functional that only detects the missing reflection symmetry". Rerun
(check G): of the 59 rows, 0 reject DH x chi4.3; 58 reject DH x chi7.2 and DH x chi8.5, 19 reject DH x chi3.2,
all three without functional equation. So on these 59 rows the DH rejection is of exactly the kind the tier was
built to discount, and with the FE-keeping DH member added to the tier the count at T-train is 0, not 59. The
registered (class-level) number 59 is correctly computed; the member-level reading is the one consistent with the
tier's stated purpose. The sentence of the claim "twist keeps the functional equation for T-NR, HEAT, BLS, E_a
only" should read "for every member of T-NR, HEAT, BLS, E_a; for 5 of 28 DH members; lost on the others
(MEASURED)".

**R-2. Odd-degree families depend on the sign convention of omega; this is not among the listed conventions.**
K_chi is normalised by omega with omega^2 = eps and Re omega > 0. For a complex character the other root is equally
valid and replaces K_chi by -K_chi. JC1 (degree 1 in each kernel), JA of orders 2 and 3, JB1 and JB2 (through
M = cos(t) K_B + sin(t) K_A, except t = 0 or pi/2 at even order) change sign or value under that replacement; JC2
and JA of order 4 do not. "One-signed on the 529 positives" is therefore a statement about the convention
Re omega > 0 in those families, and the same holds for the E_a twist (its omega is +-eps(chi), chosen with positive
real part). Measured on the full JC1 grid (check A matrices, no cascade): choosing the 23 signs so that the pairs
(zeta, chi) are one-signed, the number of functionals one-signed on all 529 pairs is 156 (JC1 with polar terms;
112 under the registered convention) and 164 (without; 108 registered); with the control pairs transported by the
sign of their twisting character, T-train is 0 in both families, also with the E_a sign left free, and 0 in the FE
tier. So the null result is unchanged on that slice. Not tested: the JC1 draws, JA of orders 2 and 3, JB1, JB2 (the
cascade discarded the rows with mixed signs on PZ before the other pairs were evaluated, so the stored matrices
cannot answer it). The proposed map row should say "under the normalisation Re omega > 0".

**R-3. E_a with polar terms: the stated reason is incomplete.** RESULT section 5 attributes "rejected by every
one-signed JA and JC1 functional" to different polar exponents. Measured: the E_a kernel with polar terms is
negative on the window (a = 1/8: -2.083, -2.000, -1.089 at u = 0, 0.5, 1.5; a = 1/4: -2.617, -2.533, -1.608; the
coefficient xi*(2a) of e^((1/2-a)u) is negative), while zeta's kernel with polar terms is positive (1.086, 1.285,
2.117). A functional of odd degree in K_A reads that sign. This is a property of one kernel (c13 already had it),
not of the pair or of the twist, and it accounts for the 100% figures.

**R-4. Wording of the ball count.** "15,073 float64-undecided rows resolved in balls" is 15,014 rows resolved in
balls (each has a positive pair of each sign) plus 59 float64-decided FE-tier rows with 0 ball evaluations (the
`_ball.json` files of JB2-with-rnd, -rnd2, -adp record `ball_evaluations: 0`). RESULT section 6 says this; the
summary line and `lanes.jsonl` do not.

## Further observations (no error; they limit what "closed" means)

- **Rows one class short.** From the `nrej_hist` fields: 1,692 functionals one-signed on the 529 positives reject a
  training pair of 8 of the 9 classes: 1,631 in JC1 with polar terms (the missing class is HEAT), 58 in JB2 with
  polar terms (THIN; these are 58 of the 59 FE-tier rows), 3 in the adaptive JA stage. On the grid no row rejects
  all classes but one, whichever class is left out. RESULT gives the per-class counts but not this number. For the
  1,631 JC1 rows the E_a rejection is the kernel sign of R-3.
- **JB reads u >= 0 only, which hides more than THIN.** At u = 0, 0.5, 1.5 the A-side kernels of THIN-0.9, BEU-0.5
  and U-00 agree with zeta's to the four digits printed (the first differing term is suppressed by e^(-24 pi),
  e^(-5.25 pi) and e^(-3 pi) respectively), and HEAT at tau = -0.1 differs by 1e-3. JB1 under PA rejects
  U, THIN and BEU 0 times (RESULT table). For objects without functional equation the information is at u < 0,
  which JB never reads; the JB rows of the table say little about those three classes.
- **Shuffle control.** A permuted labelling asks for one sign on 529 random objects; 0 survivors in 4,000 runs is
  expected and the unshuffled count is also 0, so this control cannot fail and carries no information here. The
  planted controls (kernel level and value level) are the informative ones and both passed.
- **Class membership.** Beurling (zeros in Re s > 0 equal to zeta's, since the quotient of the Euler products
  converges absolutely and has no zeros there) and the twisted HEAT members (off-line zeros of backward heat of
  L(chi) not checked) are not established counterexamples; requirement (b) is stricter than a separator relevant
  to the campaign would need. With a null result this only matters through the leave-one-out counts above (BEU
  left out: 0 on the grid; not available for the draws).
- **Verdict label.** "precise-obstruction" is exact only for Lemma J1 (JC2 without polar terms against HEAT). The
  rest is a measured null on a finite grid and finite draws, as RESULT section 9 item 1 says.
- **Compute rules.** The author's three unwrapped local scripts and the one-minute 18-core overlap are disclosed in
  RESULT section 8; no further deviation found. Server units could not be inspected from here (no ssh by this
  referee).

## Surviving claim

MEASURED, registered grid and draws, convention Re omega > 0: among 38,101,627 functionals of DJ on 833 pairs,
4,266,644 are one-signed on the 529 training positive pairs and none of them rejects a training pair of each of the
nine lifted control classes (largest number of classes rejected: 8, on 1,692 rows); 15,014 float64-undecided rows
were excluded in balls. With only the 23 pairs (zeta, chi) as positives, 278 reach T-train in float64 and each has
at least 4 of the 506 pairs (chi, chi') of the opposite sign. FE tier: 59 at T-train per class, 0 per member
(none rejects the DH member that keeps a functional equation), 0 on held-out in either reading. PROVED: Lemma J1
(JC2 without polar terms has the same sign on a HEAT pair as on (zeta, chi) with the same character; JC1 up to a
rescaling of lam); Lemma T for T-NR, HEAT, BLS; CLASSICAL for E_a. No statement about zeta. R1 = R2 = R3 = R4 =
false.

---

# Appendix: author check (unchanged text of the lane's own REFEREE.md)

## c14-joint-zeta-twist-noncone-search: REFEREE (author check, not independent)

Written 2026-11-19 by the agent that ran the lane. It is a check with separate code paths, not an independent
referee; `refereeHolds` stays null in `lanes.jsonl`. No statement about zeros of zeta is made by the lane.

## 1. Was the registered question answered as registered?

Yes, with five amendments written before the server run (PREREG section 11): B1 absolute noise rule for the linear
family JB2; B2 a second set of draws ten times larger, reported separately; B3 fixed-point recurrence for the
theta^w coefficients; B4 group sizes of the synthetic set; B5 no ball evaluation of the theta^w twist. None removes
a registered item. Deviations found while checking:
- The cascade (PREREG section 7) sends to stage 2 the rows with no two opposite decided signs on PZ. The recount of
  item 4 confirms that every row outside stage 2 has two opposite decided signs on PZ and so cannot be one-signed on
  PZ or PA in the strict or the favourable reading.
- PREREG section 8 promised 2,000 cross-check entries per family; 400 per grid family were run (4,000 in total).
- PREREG section 8 promised kernel validation at 30 points; 60 points per type were run, on up to three members.
- The ball stage resolved the rows float64 could not exclude for PA (both tiers), as registered. The corresponding
  rows for the secondary tier PZ (128,814) were not resolved; PZ counts are float64 counts.

## 2. Independent evaluation path (`ref_check.py`, `ref_check.json`)

mpmath at 40 digits, formulas re-typed: theta kernel through `jtheta`; character kernels by direct summation at
abs(u) with the root number from the Gauss sum (not the lane's measured eps); twists of T-NR, HEAT, BLS (derivatives
by `mp.diff`), E_a (`besselk`), DH, U (coefficients regenerated from the seed), BEU (own enumeration of the
generalised integers); functionals re-typed with `mp.det`. Character values and seeds are taken from the object
definitions. Sample: 16 float64-decided entries per grid family, half of them on control pairs.

Result: 132 agree, 0 disagree, 28 outside the reference (A-side kernels the reference does not implement: HEAT with
polar terms, E_a, U, BEU without polar terms; theta^w and THIN pairs are excluded from the sample).

Two defects of the reference were found and repaired before this result; both runs are on file
(`ref_check_run1.log`):
1. First version: K3 of zeta by `mp.diff` of the full kernel at negative u, where the value (1e-119) is far below
   the working precision of the polar terms; one false disagreement (BLS pair, JC1). Repaired by evaluating the
   lattice sum without its polar term at abs(u).
2. Second version: series truncated at a fixed e^-110 inside a numerical fourth derivative, giving a value of 1e47
   at u = 0 (BLS pair, JB1); one false disagreement in 132. Repaired by letting the truncation follow the working
   precision. After the repair: 132 of 132.
In both cases the float64 value of the lane agreed with the repaired reference.

## 3. Ball checks (server, `jball.py`)

- Kernel validation (`validate.json`): float64 against 256-bit balls for every kernel type of the control pairs;
  largest relative error at most 8e-13 except the DH twist (1.2e-11) and the c13 E_a kernel without polar terms at
  cancellation points (ball itself 2.7e-6 wide); no ball for the theta^w twist.
- Cross-check: 4,000 random float64-decided entries of the grid families: 3,856 agree, 0 disagree, 144 without ball.
- Ball stage: 15,073 rows; 15,014 have positives of both signs in balls; 59 are float64-decided near-misses of the
  FE tier; none alive in the nine-class reading; 0 entries undecided at 4096 bits.

## 4. Recount (`ref_recount.json`)

The grid sign matrices were mirrored and the tiers recounted with separately typed code (integer row sums instead
of the pipeline's masks): numbers one-signed on PZ and on PA, T-train for both, HEAT rejections under PA. Equal to
the pipeline summaries in all ten grid families.

## 5. Lemma J1

Proof read again: g(u-h) g(u+h) = g(u)^2 e^(tau h^2/2) for g = e^(tau u^2/4); both monomials of JC2 contain
K_A at (u-h, u+h) or (u, u) and K_B at (u, u) or (u-h, u+h), so both carry g(u)^4 e^(tau h^2/2). Holds as stated,
for the kernels without polar terms only. Numerical agreement on the grid: 80,484 of 80,484 entries
(`lemma_j1_check.json`). The statement about held-out HEAT pairs needs the positive pair (zeta, chi) of the same
character, which is in the object list for 2 of the 24 held-out members only; the lemma covers the other 22 without
a measured counterpart.

## 6. Errors found in the lane's own tables

- `make_tables.py` grouped families by prefix, so its `by_family` rows named "with" also contained the "without"
  families (and `tables/summary.md` inherits this in its two lower tables). `tables_fix.py` regroups by exact name;
  RESULT.md uses `tables/by_family.json` only. The stage totals of `tables/totals.json` are not affected.
- `best_min_heldout` in the summaries ignores the held-out positives and reaches 1.0 on rows where the sign follows
  the conductor; RESULT.md quotes `best_min_heldout_given_pos`.
- Lemma T residuals for T-NR, HEAT, BLS, E_a are computed through the reflection and test nothing; RESULT.md says
  so and relies on the proofs and on the two-point eps check for E_a.

## 7. Compute rules

All server work through `rhrun`; `rhstatus` read first; own units only; none left running (checked with
`systemctl --user list-units "rh-c14*"`: empty). One overrun: a 2-core validation unit overlapped the 16-core unit
for about a minute. One own unit was stopped by name of the unit after 8 seconds and relaunched. Local runs through
`scripts/memcap.sh 8`, except three short inspection scripts (a few seconds, a few hundred MB) run directly with the
local interpreter; they produced `lemma_j1_check.json`, `ref_recount.json` and the table regrouping.

## 8. What an independent referee should attack first

1. The lifts of section 4 of PREREG are definitions of this lane; a referee should decide whether the theta^w twist
   on the index m and the transported Beurling character are the intended "coefficientwise" lifts.
2. The Hermitian completion (reading u >= 0 only) removes the reflection information on purpose; a referee may
   judge that the registered family (b) should also have been run on the two-sided matrix K(u_i - u_j).
3. The float64 noise rule: sample rows near the decision threshold in balls for the PZ tier.
4. Whether the 59 FE-tier rows (one-signed on 529 positives, rejecting training pairs of T-NR, E_a, HEAT, BLS,
   failing the held-out rule) have a structural explanation; the lane gives none.

## 9. Verdict of the author check

The outcome "none" for the registered question stands on the evidence above (MEASURED). Flags R1 to R4 false. No
claim beyond the registered grid and draws.
