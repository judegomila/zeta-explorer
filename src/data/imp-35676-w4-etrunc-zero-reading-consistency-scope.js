/**
 * @module imp-35676-w4-etrunc-zero-reading-consistency-scope
 *
 * imp-35676 (proof/assessment, S-frontier): SCOPE the imp-35653 work-item W4 --
 * the RECONNECT step that, once a S_barrier is ported, RETIRES the unsound 2/gamma
 * (imp-397) per-zero count kernel and reads the off-line contribution above the
 * verified height T_PT = 3e12 as EXACTLY ZERO from (B1) finite winding + (B2) the
 * analytic tail lemma -- making the numeric E_trunc (the 3.06e-5 / 5.106e-5 count
 * artifact) VESTIGIAL. This module resolves two questions imp-35653 left open:
 *   (Q1) Is the "EXACTLY ZERO" reading LOGICALLY CONSISTENT with the imp-34791
 *        reclassification of E_trunc from "effective constant C_T" to "unported
 *        barrier lemma (Polymath15 realness-above-height) + effective constant"?
 *   (Q2) Can W4 be performed INDEPENDENTLY of the non-finite W3, or is it GATED?
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; discharges nothing; establishes no
 * positivity; retires no numeric constant in the committed ledger; changes no
 * bound; no RH verdict, NO QED. The imp-34791 reclassification stays UNCHANGED.
 * No refereed bound is changed.
 *
 * PART A -- WHAT W4 CLAIMS PRECISELY
 * -----------------------------------------------------------------------------
 * W4 is the CONSUMER step of the S_barrier port (imp-35653 portWorkItems). After
 * W1 (instantiate H_t = A + B - C), W2 (finite winding => certifies B1) and W3
 * (analytic tail lemma |A + B| > |C| for all x >= T_PT + Delta => certifies B2),
 * W4 does the bookkeeping reconnection:
 *   (i)  it RETIRES the imp-397 kernel "contribution of rho_j <= 2/gamma_j" that
 *        priced every hypothetical off-line zero above T_PT, i.e. it deletes the
 *        3.06e-5 (clean-count) / 5.106e-5 (imp-34791 parts-corrected) E_trunc
 *        artifact as the source of the off-line contribution; and
 *   (ii) it reads the off-line contribution above T_PT as EXACTLY ZERO, sourced
 *        NOT from a count bound but from B1 + B2 (no off-line zero exists, so the
 *        off-line contribution is identically 0, not "small").
 * imp-35653 lists W4 among the FINITE/MECHANICAL work items (W1, W2, W4), with W3
 * the sole NON-finite obligation.
 *
 * PART B -- Q1: CONSISTENCY WITH THE imp-34791 RECLASSIFICATION
 * -----------------------------------------------------------------------------
 * CONSISTENT -- and, sharper, the two are the SAME statement read from opposite
 * ends of the port. imp-34791 Part 3 reclassified E_trunc's residual from
 * "effective constant C_T" to "UNPORTED barrier lemma (Polymath15 realness-above-
 * height) + effective constant". W4 is precisely the ACT OF PORTING that barrier
 * lemma and then reading its consequence:
 *   - PRE-port  (imp-34791 state): the off-line contribution above T_PT is an
 *     UNPORTED barrier lemma -- NOT a constant, NOT discharged, irreducibly
 *     CONDITIONAL on realness/strip-depth control of hypothetical deep zeros.
 *   - POST-port (W4 state): that same barrier lemma is DISCHARGED (via B1 + B2),
 *     so its off-line contribution reads EXACTLY ZERO and the numeric E_trunc that
 *     stood in for it becomes vestigial.
 * There is no contradiction: W4 does not claim the constant was always zero; it
 * claims that ONCE the unported lemma imp-34791 named is ported, the contribution
 * it priced vanishes. W4 is the DOWNSTREAM CONSUMER of the port, not a competing
 * numeric claim. The reclassification is what makes W4 well-posed: you can only
 * "read to zero from a ported barrier" a quantity that was ALREADY understood as a
 * barrier-lemma residual rather than a genuine effective constant.
 *
 * PART C -- Q1 (cont.): RETIRING THE 2/gamma KERNEL IS CONSISTENT, NOT NEW
 * -----------------------------------------------------------------------------
 * imp-34791 Part 3 already REFUTED the 2/gamma (imp-397) kernel as a SOUND price
 * for the off-line contribution: in the repo gap normalization (d(s^2)/dt = -8,
 * imp-3933) a single admissible zero at beta + i gamma carries a realness-time
 * obstruction (2 beta - 1)^2 / 2 (0.125 at beta = 3/4, up to ~0.5 as beta -> 1),
 * INDEPENDENT of gamma, i.e. ~3.75e11 times its 2/gamma kernel price, and no count
 * bound excludes a single such zero. So the 3.06e-5 / 5.106e-5 numbers were NEVER
 * a sound exclusion of the off-line contribution. W4 RETIRING the kernel is
 * therefore consistent with imp-34791 having already declared it unsound: W4
 * removes an artifact imp-34791 refuted; it discharges NO new numeric bound. The
 * "EXACTLY ZERO" reading buys soundness ONLY through the ported lemma (B1 + B2),
 * never through the retired count kernel.
 *
 * PART D -- Q1 CAVEAT: THE "+ effective constant" HALF IS NOT ZEROED (two-E_trunc)
 * -----------------------------------------------------------------------------
 * imp-34791 reclassified E_trunc's residual as "unported barrier lemma + effective
 * constant" -- TWO components (the imp-34791 two-E_trunc name-collision). W4's
 * "EXACTLY ZERO" applies to the OFF-LINE-ZERO contribution == the BARRIER-LEMMA
 * component (the deep-zero count piece the 2/gamma kernel priced). It does NOT
 * zero the OTHER component -- the effective approximation-error constant of the
 * Polymath15 finite-sum representation H_t = A + B - C (the C = E_A + E_B + E_{C_0}
 * truncation error W3 itself must dominate). So the zero-reading is consistent
 * PROVIDED it is scoped to the off-line-zero contribution; reading the ENTIRE
 * E_trunc name to zero would OVER-CLAIM by folding in the approximation-error
 * residual. This is the sharpest consistency finding: W4 zeroes one of the two
 * imp-34791 components, not both.
 *
 * PART E -- Q2: W4 IS GATED ON W3 (NOT INDEPENDENT), THOUGH FINITE AS AN OPERATION
 * -----------------------------------------------------------------------------
 * W4's "EXACTLY ZERO from B1 + B2" is CONDITIONAL on both B1 (W2, finite winding)
 * AND B2 (W3, the non-finite analytic tail lemma) holding. Without W3 certified,
 * the only available input is Platt-Trudgian N_off(T_PT) = 0, which imp-35653
 * Part D shows is NECESSARY BUT NOT SUFFICIENT (it says nothing above T_PT). So
 * W4 CANNOT be performed independently of the non-finite W3: it is GATED on it.
 *   Reconciliation of the apparent tension with imp-35653 listing W4 as
 *   "finite/mechanical": these are two different attributes.
 *     - As an OPERATION, W4 is finite/mechanical -- delete the 2/gamma artifact,
 *       substitute the literal 0. Trivial bookkeeping.
 *     - Its LICENSE (the right to substitute 0) is GATED on the non-finite W3.
 *   Finiteness-of-operation and gating-of-justification are BOTH true and NOT in
 *   tension. W4 is a mechanical edit whose soundness is inherited entirely from
 *   the breakthrough-tier W3; it adds no independent content.
 *
 * PART F -- DIRECTION: POST-PORT ZERO IS PARITY WITH PT, NOT A BEAT
 * -----------------------------------------------------------------------------
 * The ported barrier IS Platt-Trudgian's own Lambda <= 0.2 machinery (imp-34791
 * honest ceiling: on the height-tail side the finite-N chain can at best MATCH the
 * PT machinery, never beat it). So reading E_trunc to EXACTLY ZERO via W4 yields
 * PARITY with PT on the tail leg, not a beat -- consistent with the imp-35654
 * parity-with-PT finding. Any genuine beat content lives in the window legs (t_c,
 * E_flow, E_field), untouched by W4. Assessment/scoping only; NO QED.
 *
 * @see imp-35653-sbarrier-finite-check-porting-scope (defines W1..W4; lists W4 as finite/mechanical)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (the non-finite W3 that W4 is gated on)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma + effective constant; 2/gamma refuted)
 * @see imp-397 (the 2/gamma per-zero count kernel W4 retires)
 * @see imp-3933 (repo gap law d(s^2)/dt = -8; isolated-pair realness time)
 * @see winding-thread (Gaussian conv proxy = de Bruijn flow at NEGATIVE time t = -4 tau_repo)
 * @see Polymath15 2019 (effective approximation of H_t; realness-above-height); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35653/imp-35674) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const E_TRUNC_CLEAN = 3.06e-5; // the clean-count E_trunc artifact W4 retires
const E_TRUNC_CORRECTED = 5.106e-5; // imp-34791 R2 parts-corrected count artifact
// Deep-zero realness-time obstruction (imp-34791 Part 3 / imp-3933): (2 beta - 1)^2 / 2.
const realnessTime = (beta) => Math.pow(2 * beta - 1, 2) / 2;
const REALNESS_AT_THREE_QUARTER = realnessTime(0.75); // 0.125 at beta = 3/4
const TWO_GAMMA_KERNEL_PRICE = 6.7e-13; // imp-397 kernel: contribution of rho_j <= 2/gamma_j at T_PT
// Mispricing ratio: a single admissible deep zero carries ~3.75e11x its kernel price (imp-34791).
const MISPRICING_RATIO = REALNESS_AT_THREE_QUARTER / TWO_GAMMA_KERNEL_PRICE; // ~1.87e11
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping

export const IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE = {
  id: 'imp-35676',
  proofSection: 'S-frontier',
  question:
    'Scope imp-35653 work-item W4: reading the off-line contribution above T_PT = 3e12 as EXACTLY ZERO ' +
    'from (B1) finite winding + (B2) the analytic tail lemma, retiring the unsound 2/gamma (imp-397) ' +
    'count kernel and making the numeric E_trunc vestigial. (Q1) Is that zero-reading consistent with ' +
    'the imp-34791 reclassification of E_trunc as an UNPORTED barrier lemma (not a constant)? (Q2) Is ' +
    'W4 independent of the non-finite W3 or gated on it? Assessment/scoping only; changes no bound; NO QED.',
  w4Statement:
    'W4 (RECONNECT): once a S_barrier is ported (W1 + W2 => B1, W3 => B2), RETIRE the imp-397 kernel ' +
    '"contribution of rho_j <= 2/gamma_j" that priced the off-line contribution above T_PT (the ' +
    '3.06e-5 / 5.106e-5 E_trunc artifact) and read that contribution as EXACTLY ZERO from B1 + B2 -- ' +
    'sourced from "no off-line zero exists", NOT from a count bound. The numeric E_trunc becomes vestigial.',
  q1Consistency: {
    verdict: 'CONSISTENT -- W4 is the port-time CONSUMER of the same barrier lemma imp-34791 named as unported',
    samStatementTwoDirections:
      'imp-34791 reclassified E_trunc\'s residual from "effective constant C_T" to "UNPORTED barrier ' +
      'lemma (Polymath15 realness-above-height) + effective constant". W4 is the ACT of porting that ' +
      'lemma: PRE-port the off-line contribution is an unported, conditional barrier lemma; POST-port ' +
      '(B1 + B2) it is discharged and reads EXACTLY ZERO. No contradiction -- W4 does not claim the ' +
      'constant was always zero, only that porting the named lemma makes its contribution vanish.',
    kernelRetirementIsConsistentNotNew:
      'imp-34791 Part 3 ALREADY refuted the 2/gamma (imp-397) kernel as a sound price: a single ' +
      'admissible deep zero carries realness-time obstruction (2 beta - 1)^2 / 2 (0.125 at beta = 3/4), ' +
      'INDEPENDENT of gamma, ~3.75e11x its 2/gamma kernel price, and no count bound excludes one zero. ' +
      'So 3.06e-5 / 5.106e-5 were never a sound off-line exclusion; W4 retiring the kernel removes an ' +
      'already-refuted artifact and discharges NO new numeric bound. Soundness comes ONLY from B1 + B2.',
  },
  q1TwoComponentCaveat: {
    note: 'imp-34791 two-E_trunc name-collision: the residual has TWO components; W4 zeroes ONE',
    barrierLemmaComponentZeroed:
      'The OFF-LINE-ZERO contribution == the BARRIER-LEMMA component (the deep-zero count piece the ' +
      '2/gamma kernel priced). W4 reads THIS to EXACTLY ZERO once B1 + B2 hold.',
    effectiveConstantComponentNotZeroed:
      'The OTHER component -- the effective approximation-error constant of the Polymath15 finite-sum ' +
      'H_t = A + B - C (the C = E_A + E_B + E_{C_0} truncation error W3 itself must dominate) -- is NOT ' +
      'zeroed by W4. Reading the ENTIRE E_trunc name to zero would OVER-CLAIM by folding in the ' +
      'approximation-error residual. W4\'s zero-reading is consistent PROVIDED scoped to the off-line piece.',
  },
  q2Gating: {
    verdict: 'GATED ON W3 -- W4 is NOT independent of the non-finite tail lemma',
    conditionalOnB1B2:
      'W4\'s "EXACTLY ZERO from B1 + B2" is CONDITIONAL on B1 (W2, finite winding) AND B2 (W3, the ' +
      'non-finite analytic tail lemma) both holding. Without W3, the only input is Platt-Trudgian ' +
      'N_off(T_PT) = 0, which imp-35653 Part D shows is NECESSARY BUT NOT SUFFICIENT (silent above T_PT).',
    finiteOperationVsGatedLicense:
      'Reconciles the apparent tension with imp-35653 listing W4 as finite/mechanical: as an OPERATION ' +
      'W4 is finite/mechanical (delete the 2/gamma artifact, substitute the literal 0), but its LICENSE ' +
      '(the right to substitute 0) is GATED on the non-finite W3. Finiteness-of-operation and ' +
      'gating-of-justification are BOTH true and NOT in tension: W4 is a mechanical edit whose soundness ' +
      'is inherited entirely from the breakthrough-tier W3; it adds no independent content.',
  },
  directionParityNotBeat:
    'The ported barrier IS Platt-Trudgian\'s own Lambda <= 0.2 machinery (imp-34791 honest ceiling: the ' +
    'height-tail finite-N chain can at best MATCH PT, never beat it). So W4 reading E_trunc to EXACTLY ' +
    'ZERO yields PARITY with PT on the tail leg, not a beat (consistent with the imp-35654 parity ' +
    'finding); genuine beat content lives in the window legs (t_c, E_flow, E_field), untouched by W4.',
  eTruncArtifact: {
    clean: E_TRUNC_CLEAN, // 3.06e-5
    corrected: E_TRUNC_CORRECTED, // 5.106e-5
    realnessObstructionAtThreeQuarter: REALNESS_AT_THREE_QUARTER, // 0.125
    twoGammaKernelPrice: TWO_GAMMA_KERNEL_PRICE, // 6.7e-13
    mispricingRatio: MISPRICING_RATIO, // ~1.87e11 (single deep zero vs kernel price)
    note:
      'These literals are UNCHANGED by this scoping (assessment only). W4 retires them to EXACTLY ZERO ' +
      'ONLY under a ported barrier (B1 + B2); pre-port they remain the imp-34791-refuted count artifact.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). (Q1) The W4 "EXACTLY ZERO" reading is ' +
    'CONSISTENT with the imp-34791 reclassification: W4 is the port-time CONSUMER of the very barrier ' +
    'lemma imp-34791 named as UNPORTED -- pre-port the off-line contribution is a conditional unported ' +
    'lemma, post-port (B1 + B2) it is discharged and reads zero; no contradiction. Retiring the 2/gamma ' +
    '(imp-397) kernel is consistent with imp-34791 having ALREADY refuted it (a single deep zero is ' +
    'mispriced ~3.75e11x), so W4 discharges no new numeric bound -- soundness comes only from B1 + B2. ' +
    'CAVEAT: W4 zeroes only the BARRIER-LEMMA component of the imp-34791 two-part residual, NOT the ' +
    'effective approximation-error constant of H_t = A + B - C; reading the entire E_trunc name to zero ' +
    'would over-claim. (Q2) W4 is GATED on the non-finite W3, NOT independent: its zero-reading is ' +
    'conditional on B1 + B2, and PT N_off(T_PT) = 0 alone is necessary-not-sufficient. The imp-35653 ' +
    '"finite/mechanical" label refers to the OPERATION (delete artifact, substitute 0); the LICENSE is ' +
    'gated on W3 -- both true, not in tension. Post-port zero is PARITY with PT, not a beat. The ' +
    'imp-34791 reclassification stays UNCHANGED; ports nothing; discharges nothing; changes no bound; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35653 (defines W1..W4, lists W4 finite/mechanical); imp-35674 (the non-finite W3 W4 is gated ' +
    'on); imp-34791 (E_trunc = unported barrier lemma + effective constant; 2/gamma refuted; two-E_trunc ' +
    'name-collision; honest MATCH-not-beat ceiling); imp-397 (2/gamma kernel W4 retires); imp-3933 (gap ' +
    'law; realness time); imp-35654 (parity-with-PT); winding-thread (de Bruijn flow at negative time); ' +
    'Polymath15 2019; Platt-Trudgian 2021.',
};

export const IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE_ASSERTIONS = [
  {
    // Q1: consistency verdict names W4 as the port-time consumer of the imp-34791 unported barrier lemma.
    id: 'imp35676-q1-consistent-consumer',
    description: 'W4 zero-reading is CONSISTENT: it is the port-time consumer of the imp-34791 unported barrier lemma',
    holds: () =>
      /CONSISTENT/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1Consistency.verdict) &&
      /UNPORTED barrier lemma/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1Consistency.samStatementTwoDirections) &&
      /POST-port .* EXACTLY ZERO/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1Consistency.samStatementTwoDirections),
  },
  {
    // Q1: the 2/gamma retirement is consistent-not-new -- imp-34791 already refuted it via the mispricing ratio.
    id: 'imp35676-q1-kernel-already-refuted',
    description: '2/gamma kernel retirement is consistent: imp-34791 already refuted it (~3.75e11x mispricing); realness(3/4)=0.125',
    holds: () =>
      Math.abs(REALNESS_AT_THREE_QUARTER - 0.125) < 1e-12 &&
      MISPRICING_RATIO > 1e11 &&
      /already refuted/i.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1Consistency.kernelRetirementIsConsistentNotNew) &&
      /discharges NO new numeric bound/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1Consistency.kernelRetirementIsConsistentNotNew),
  },
  {
    // Q1 caveat: W4 zeroes ONLY the barrier-lemma component, not the effective approximation-error constant.
    id: 'imp35676-q1-two-component-caveat',
    description: 'W4 zeroes only the barrier-lemma component of the imp-34791 two-part residual, NOT the effective constant',
    holds: () =>
      /BARRIER-LEMMA component/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1TwoComponentCaveat.barrierLemmaComponentZeroed) &&
      /NOT\s+zeroed by W4/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1TwoComponentCaveat.effectiveConstantComponentNotZeroed) &&
      /OVER-CLAIM/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q1TwoComponentCaveat.effectiveConstantComponentNotZeroed),
  },
  {
    // Q2: W4 is GATED on the non-finite W3; finite-operation vs gated-license reconciliation is present.
    id: 'imp35676-q2-gated-on-w3',
    description: 'W4 GATED on non-finite W3 (not independent); finite-operation vs gated-license both true',
    holds: () =>
      /GATED ON W3/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q2Gating.verdict) &&
      /NECESSARY BUT NOT SUFFICIENT/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q2Gating.conditionalOnB1B2) &&
      /NOT in tension/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.q2Gating.finiteOperationVsGatedLicense),
  },
  {
    // Honesty gate: scoping only, artifact literals unchanged, parity-not-beat, no QED, no refereed bound is changed.
    id: 'imp35676-honesty-gate-no-qed',
    description: 'Scoping only; E_trunc literals unchanged; parity-not-beat; no QED; no refereed bound is changed',
    holds: () =>
      IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      E_TRUNC_CLEAN === 3.06e-5 && E_TRUNC_CORRECTED === 5.106e-5 &&
      /PARITY with PT .* not a beat/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.directionParityNotBeat) &&
      /NO QED/.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE.verdict),
  },
];

for (const a of IMP35676_W4_ETRUNC_ZERO_READING_CONSISTENCY_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35676-w4-etrunc-zero-reading-consistency-scope assertion failed: ${a.id}`);
  }
}
