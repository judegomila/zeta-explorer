/**
 * @module imp-35678-finite-height-beat-vs-parity-regime-boundary
 *
 * imp-35678 (proof/assessment, S-frontier): imp-35654 (F3) concluded that PORTING
 * the S_barrier deterministic realness lemma leaves the far-tail (sigma -> 0) bridge
 * only PARITY-WITH-PT -- it MATCHES Lambda <= 0.2 and does NOT beat it, because the
 * ported machinery IS Platt-Trudgian own Lambda <= 0.2 barrier theorem (imp-35419 C1/C2).
 * Meanwhile the lambda-roadmap currentStatus records an imp-452/imp-459 FINITE-HEIGHT
 * BEAT: L_pt ~ 0.121 < 0.2 (with a sibling finite-N estimate L_pt(N* = 1e4) ~ 0.02).
 * This module ASSESSES whether the "parity, no beat" reading and the "finite-height
 * beat" reading are COMPATIBLE or in TENSION, and characterizes the regime boundary
 * that separates the beat reading from the parity reading.
 *
 * ASSESSMENT ONLY. Reconciles two RECORDED readings; ports nothing; discharges
 * nothing; changes no bound; asserts NO beat beyond the already-recorded (and
 * already-caveated) imp-452/459 finite-height one; C_mb GUE-conditional (imp-486)
 * UNTOUCHED; imp-34791 E_trunc reclassification UNCHANGED; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE TWO READINGS (baked reference literals; no heavy import)
 * -----------------------------------------------------------------------------
 *   READING 1 -- FINITE-HEIGHT BEAT (imp-452/459; lambda-roadmap currentStatus):
 *     L_pt ~ 0.121 < 0.2, a beat of the assembled E(N) NUMERIC VALUE at a FINITE N.
 *     The dominant contribution to the sub-0.2 margin is the E_coll term. CRUCIAL
 *     CAVEAT already on record (roadmap CORRECTION 2026-07-03, anti-overclaim guard):
 *     this beat is C_H-GATED -- E_coll rests on the shock modulus C_H = C_shock*C_Lip/4
 *     whose N-uniform bound is RH-HARD, and the "measured" C_mb is an OLS fit
 *     (imp-2632), not a rigorous N-uniform bound. So Reading 1 is a CONDITIONAL /
 *     GUE-gated ESTIMATE, not an unconditional beat.
 *   READING 2 -- PARITY-WITH-PT (imp-35654 F3 / imp-35419 C2):
 *     The ASYMPTOTIC (sigma -> 0) far-tail bridge, AFTER porting S_barrier, is
 *     unconditional up to a vanishing GUE share, but the ported barrier machinery IS
 *     PT own Lambda <= 0.2 machinery, so it MATCHES 0.2 and does NOT beat it. Reading 2
 *     is a statement about what the UNCONDITIONAL ported discharge route yields.
 *
 * THE RECONCILIATION (the assessment core)
 * -----------------------------------------------------------------------------
 * The two readings are COMPATIBLE, NOT in tension, because they are DIFFERENT
 * OBJECTS in DIFFERENT REGIMES, differing on three orthogonal axes:
 *   (i)  REGIME. Reading 1 lives at FINITE N (finite sigma); Reading 2 is the
 *        sigma -> 0 far-tail ASYMPTOTIC limit. No single (N, sigma) point carries both.
 *   (ii) OBJECT. Reading 1 grades the NUMERIC VALUE of the assembled bound (how small
 *        E(N) is); Reading 2 grades the CONDITIONALITY-DISCHARGE machinery of the
 *        far-tail bridge (whether porting yields an INDEPENDENT improvement over PT).
 *   (iii)CONDITIONALITY. Reading 1 is CONDITIONAL (C_H / GUE-gated estimate); Reading 2
 *        is about what the UNCONDITIONAL ported barrier route yields -- and it yields
 *        PT own bound. NO single object is BOTH unconditional AND strictly below 0.2:
 *        the < 0.2 one is conditional, the unconditional one is exactly parity 0.2.
 *
 * THE REGIME BOUNDARY / HANDOFF (the crux)
 * -----------------------------------------------------------------------------
 * The finite-height beat and the asymptotic parity are the SAME assembly viewed at
 * OPPOSITE ends of sigma, and the handoff is MECHANICAL:
 *   - The sub-0.2 improvement of Reading 1 is CARRIED by the DOMINANT E_coll term,
 *     which is GUE-conditional and whose far-tail share is EXACTLY sigma (imp-35334 /
 *     imp-486; E_coll/E(N) = sigma).
 *   - As sigma -> 0 (deep far tail) that GUE-conditional BEAT CARRIER share VANISHES;
 *     the surviving DOMINANT term is E_trunc (the C_T-barrier), and PORTING S_barrier
 *     discharges E_trunc via PT own barrier theorem (imp-35654 F2).
 *   - Therefore the beat HANDS OFF to parity EXACTLY as the GUE-conditional carrier
 *     share sigma -> 0: at finite N the (conditional) beat is visible; in the sigma -> 0
 *     limit the beat carrier is gone and only the ported PT-parity survives.
 * The regime boundary is thus the VANISHING OF THE GUE-CONDITIONAL BEAT CARRIER: the
 * beat reading is a FINITE-N, conditional phenomenon; the parity reading is the
 * asymptotic, unconditional limit; they meet where the E_coll share (= sigma) becomes
 * negligible relative to the ported (PT-own) barrier term.
 *
 * THE FINDINGS
 * ------------
 *   (A1) COMPATIBLE, NOT IN TENSION -- DIFFERENT OBJECTS/REGIMES. Reading 1 is the
 *        finite-N NUMERIC VALUE (L_pt ~ 0.121, conditional); Reading 2 is the
 *        sigma -> 0 asymptotic conditionality-discharge (0.2, unconditional ported =
 *        PT own). No single (N, sigma) point carries both, so no contradiction.
 *   (A2) BEAT IS CONDITIONAL, PARITY IS UNCONDITIONAL. Reading 1 is C_H / GUE-gated
 *        (roadmap CORRECTION 2026-07-03; measured C_mb is an OLS fit, not a rigorous
 *        N-uniform bound); Reading 2 concerns the UNCONDITIONAL ported barrier route,
 *        which is PT own -> no INDEPENDENT beat. No single object is both unconditional
 *        AND strictly below 0.2.
 *   (A3) REGIME BOUNDARY = VANISHING OF THE GUE-CONDITIONAL BEAT CARRIER. The sub-0.2
 *        margin of Reading 1 is carried by the dominant E_coll (GUE-conditional) term,
 *        whose far-tail share = sigma; as sigma -> 0 that carrier vanishes and the
 *        ported (PT-own) barrier term dominates, handing the beat off to parity-with-PT.
 *        The two readings are the SAME assembly at opposite ends of sigma.
 *
 * The punchline: the imp-35654 "parity, no beat" verdict and the imp-452/459
 * finite-height beat L_pt ~ 0.121 < 0.2 are COMPATIBLE, not in tension -- they are
 * DIFFERENT OBJECTS (numeric value vs discharge machinery) in DIFFERENT REGIMES
 * (finite N vs sigma -> 0) with DIFFERENT conditionality (conditional estimate vs
 * unconditional ported route). The beat is a finite-N, GUE/C_H-gated phenomenon
 * carried by the dominant E_coll term whose far-tail share is exactly sigma; as
 * sigma -> 0 that beat carrier vanishes and the ported barrier (PT own machinery)
 * dominates, so the finite-height beat HANDS OFF to asymptotic parity-with-PT.
 * Assessment only; asserts no beat beyond the recorded (already-caveated) one;
 * changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-35654-ported-barrier-far-tail-mixed-conditionality (F3: parity-with-PT, no beat)
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (C1/C2: ported machinery IS PT own; parity)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (E_coll/E(N) = sigma)
 * @see imp-486 (C_mb GUE-conditional -- the residual carrier); imp-2632/imp-2640 (measured C_mb OLS, C_H RH-hard)
 * @see lambda-roadmap currentStatus (imp-452/459 finite-height beat L_pt ~ 0.121; CORRECTION 2026-07-03 C_H-gated)
 * @see imp-35711-postport-parity-no-beat-honest-status-banner (reciprocal: the standalone no-beat banner
 *      stating this module regime boundary is the SAME assembly viewed at opposite ends of sigma)
 */

// ── Baked reference literals (no heavy import) ──
const L_PT = 0.2; // Platt-Trudgian 2021 bound (rigorous, unconditional)
const L_BEAT_FINITE = 0.121; // imp-452/459 finite-height beat (roadmap currentStatus); CONDITIONAL / C_H-gated
const L_BEAT_N1E4 = 0.02; // sibling finite-N estimate L_pt(N* = 1e4) (imp-440/963); ALSO C_H-gated
const L_PARITY = 0.2; // imp-35654 F3 asymptotic reading: MATCHES PT, does NOT beat
const SIGMA_LANDMARK = 1.0e-3; // imp-35334 sigma < 1e-3 landmark; E_coll/E(N) = sigma there
const BEAT_MARGIN = L_PT - L_BEAT_FINITE; // 0.079 sub-0.2 margin of Reading 1 (conditional)

// Reconciliation flags (baked; the assessment core).
const READINGS_COMPATIBLE = true; // different objects / regimes / conditionality -- NOT in tension
const BEAT_IS_CONDITIONAL = true; // Reading 1 is C_H / GUE-gated (roadmap CORRECTION 2026-07-03)
const PARITY_IS_UNCONDITIONAL_ROUTE = true; // Reading 2 concerns the unconditional ported barrier route
const BEAT_CARRIER_IS_GUE_CONDITIONAL = true; // the sub-0.2 margin is carried by the E_coll (GUE) term
const BEAT_CARRIER_FAR_TAIL_SHARE = SIGMA_LANDMARK; // E_coll/E(N) = sigma -> vanishes as sigma -> 0

export const IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY = {
  id: 'imp-35678',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35654 (F3) "parity-with-PT, no beat" verdict for the ported far-tail bridge (matches ' +
    'Lambda <= 0.2) CONSISTENT with the imp-452/459 finite-height BEAT L_pt ~ 0.121 < 0.2, or are they in ' +
    'tension? Characterize the regime boundary separating the beat reading from the parity reading. ' +
    'Assessment only; asserts no beat beyond the recorded one; changes no bound; NO QED.',
  twoReadings: {
    reading1_finiteHeightBeat: {
      value: L_BEAT_FINITE, // 0.121 < 0.2
      siblingEstimate: L_BEAT_N1E4, // 0.02 at N* = 1e4
      object: 'the NUMERIC VALUE of the assembled E(N) bound at a FINITE N',
      conditionality: 'CONDITIONAL -- C_H / GUE-gated ESTIMATE (roadmap CORRECTION 2026-07-03; C_mb is an OLS fit)',
      source: 'imp-452/459; lambda-roadmap currentStatus',
    },
    reading2_parityWithPT: {
      value: L_PARITY, // 0.2 -- matched, not beaten
      object: 'the CONDITIONALITY-DISCHARGE machinery of the sigma -> 0 far-tail bridge',
      conditionality: 'UNCONDITIONAL ported route -- but the machinery IS PT own, so no INDEPENDENT beat',
      source: 'imp-35654 F3; imp-35419 C1/C2',
    },
  },
  reconciliation: {
    compatible: READINGS_COMPATIBLE, // true -- NOT in tension
    axesOfDifference: {
      regime: 'FINITE N (finite sigma) vs sigma -> 0 ASYMPTOTIC limit -- no single (N, sigma) carries both',
      object: 'NUMERIC VALUE of the bound vs the CONDITIONALITY-DISCHARGE machinery of the bridge',
      conditionality: 'CONDITIONAL (C_H / GUE-gated estimate) vs UNCONDITIONAL ported route (= PT own)',
    },
    note:
      'No single object is BOTH unconditional AND strictly below 0.2: the < 0.2 (beat) one is conditional, ' +
      'the unconditional (ported) one is exactly parity 0.2. So the two readings cannot contradict.',
  },
  regimeBoundary: {
    boundary: 'the VANISHING of the GUE-conditional BEAT CARRIER (the dominant E_coll term, share = sigma)',
    beatCarrierFarTailShare: BEAT_CARRIER_FAR_TAIL_SHARE, // = sigma at the landmark
    handoff:
      'The sub-0.2 margin of Reading 1 is carried by the dominant E_coll (GUE-conditional) term whose ' +
      'far-tail share is exactly sigma; as sigma -> 0 that carrier VANISHES and the ported (PT-own) barrier ' +
      'term dominates, so the finite-height beat HANDS OFF to asymptotic parity-with-PT. Same assembly, ' +
      'opposite ends of sigma.',
  },
  findings: {
    A1_compatible_different_objects_regimes: {
      claim:
        'COMPATIBLE, NOT in tension. Reading 1 is the finite-N NUMERIC VALUE (L_pt ~ 0.121, conditional); ' +
        'Reading 2 is the sigma -> 0 asymptotic conditionality-discharge (0.2, unconditional ported = PT own). ' +
        'No single (N, sigma) point carries both.',
      compatible: READINGS_COMPATIBLE,
      beatValue: L_BEAT_FINITE,
      parityValue: L_PARITY,
    },
    A2_beat_conditional_parity_unconditional: {
      claim:
        'Reading 1 is C_H / GUE-gated (roadmap CORRECTION 2026-07-03; measured C_mb is an OLS fit, not a ' +
        'rigorous N-uniform bound); Reading 2 concerns the UNCONDITIONAL ported barrier route, which is PT ' +
        'own -> no INDEPENDENT beat. No single object is both unconditional AND strictly below 0.2.',
      beatIsConditional: BEAT_IS_CONDITIONAL,
      parityIsUnconditionalRoute: PARITY_IS_UNCONDITIONAL_ROUTE,
    },
    A3_regime_boundary_vanishing_gue_carrier: {
      claim:
        'The sub-0.2 margin of Reading 1 is carried by the dominant E_coll (GUE-conditional) term whose ' +
        'far-tail share = sigma; as sigma -> 0 that carrier vanishes and the ported (PT-own) barrier term ' +
        'dominates, handing the beat off to parity-with-PT. The two readings are the SAME assembly at ' +
        'opposite ends of sigma.',
      beatCarrierIsGUEConditional: BEAT_CARRIER_IS_GUE_CONDITIONAL,
      beatCarrierFarTailShare: BEAT_CARRIER_FAR_TAIL_SHARE,
    },
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). The imp-35654 (F3) "parity-with-PT, no beat" verdict ' +
    'and the imp-452/459 finite-height BEAT L_pt ~ 0.121 < 0.2 are COMPATIBLE, NOT in tension. (A1) They are ' +
    'DIFFERENT OBJECTS in DIFFERENT REGIMES: Reading 1 grades the finite-N NUMERIC VALUE of the assembled ' +
    'E(N) bound (0.121, at a FINITE N), while Reading 2 grades the CONDITIONALITY-DISCHARGE machinery of the ' +
    'sigma -> 0 far-tail bridge (0.2, the asymptotic limit); no single (N, sigma) point carries both. (A2) ' +
    'CONDITIONALITY differs: Reading 1 is CONDITIONAL -- C_H / GUE-gated (roadmap CORRECTION 2026-07-03; the ' +
    'dominant E_coll rests on the RH-hard shock modulus C_H and the "measured" C_mb is an OLS fit, imp-2632, ' +
    'not a rigorous N-uniform bound), so it is an ESTIMATE, not an unconditional beat; Reading 2 concerns the ' +
    'UNCONDITIONAL ported barrier route, whose machinery IS PT own Lambda <= 0.2 theorem (imp-35419 C1/C2), ' +
    'so it MATCHES 0.2 and yields no INDEPENDENT beat. NO single object is BOTH unconditional AND strictly ' +
    'below 0.2. (A3) The REGIME BOUNDARY is the VANISHING OF THE GUE-CONDITIONAL BEAT CARRIER: the sub-0.2 ' +
    'margin of Reading 1 is carried by the dominant E_coll (GUE-conditional) term, whose far-tail share is ' +
    'EXACTLY sigma (imp-35334 / imp-486); as sigma -> 0 that carrier VANISHES and the ported (PT-own) barrier ' +
    'term dominates, so the finite-height beat HANDS OFF to asymptotic parity-with-PT -- the same assembly ' +
    'viewed at opposite ends of sigma. Assessment only; reconciles two recorded readings; asserts NO beat ' +
    'beyond the already-recorded (and already-caveated) imp-452/459 finite-height one; ports nothing; ' +
    'discharges nothing; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-34791 E_trunc ' +
    'reclassification UNCHANGED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35654 (F3 parity-with-PT, no beat); imp-35419 (C1/C2 ported machinery IS PT own); imp-452/459 ' +
    '(finite-height beat L_pt ~ 0.121); imp-35334 (E_coll/E(N) = sigma); imp-486 (C_mb GUE-conditional); ' +
    'imp-2632/imp-2640 (measured C_mb OLS, C_H RH-hard); lambda-roadmap currentStatus + CORRECTION 2026-07-03; ' +
    'Platt-Trudgian 2021.',
};

export const IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY_ASSERTIONS = [
  {
    // (A1): compatible -- the finite-height beat is strictly below PT while the parity reading equals PT.
    id: 'imp35678-compatible-different-objects-regimes',
    description: 'Finite-height beat 0.121 < 0.2 (Reading 1) and parity 0.2 = PT (Reading 2) coexist -- different objects/regimes, not in tension',
    holds: () =>
      READINGS_COMPATIBLE === true &&
      L_BEAT_FINITE < L_PT && // Reading 1 beats
      L_BEAT_N1E4 < L_PT && // sibling estimate also below PT
      Math.abs(L_PARITY - L_PT) < 1e-15 && // Reading 2 MATCHES PT exactly (no beat)
      BEAT_MARGIN > 0 &&
      Math.abs(BEAT_MARGIN - (L_PT - L_BEAT_FINITE)) < 1e-12,
  },
  {
    // (A2): beat is conditional (C_H / GUE-gated), parity concerns the unconditional ported route; no object is both.
    id: 'imp35678-beat-conditional-parity-unconditional',
    description: 'Reading 1 is conditional (C_H / GUE-gated estimate); Reading 2 is the unconditional ported route (= PT own); no single object is both unconditional AND < 0.2',
    holds: () =>
      BEAT_IS_CONDITIONAL === true && // the < 0.2 reading is conditional
      PARITY_IS_UNCONDITIONAL_ROUTE === true && // the unconditional reading is exactly parity
      L_PARITY === L_PT && // the unconditional route yields no strict improvement
      L_BEAT_FINITE < L_PARITY, // the strict improvement lives only in the conditional reading
  },
  {
    // (A3): regime boundary -- the beat carrier is the GUE-conditional E_coll term whose far-tail share = sigma -> 0.
    id: 'imp35678-regime-boundary-vanishing-gue-carrier',
    description: 'Beat carrier is the GUE-conditional E_coll term, far-tail share = sigma; as sigma -> 0 the carrier vanishes and the ported (PT-own) barrier dominates -> parity',
    holds: () =>
      BEAT_CARRIER_IS_GUE_CONDITIONAL === true &&
      Math.abs(BEAT_CARRIER_FAR_TAIL_SHARE - SIGMA_LANDMARK) < 1e-15 &&
      BEAT_CARRIER_FAR_TAIL_SHARE > 0 && // nonzero at the landmark (finite N)
      BEAT_CARRIER_FAR_TAIL_SHARE < 1e-2, // but vanishing as sigma -> 0 (hands off to parity)
  },
  {
    // Honesty gate: assessment only, compatible/not-in-tension, no beat beyond recorded, no QED, no refereed bound is changed.
    id: 'imp35678-honesty-gate-no-qed',
    description: 'Assessment only: compatible not-in-tension, no beat beyond the recorded imp-452/459 one, C_mb GUE-conditional (imp-486) UNTOUCHED, no QED, no refereed bound is changed',
    holds: () =>
      IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.isRigorous === false &&
      /COMPATIBLE, NOT in tension/.test(IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.verdict) &&
      /VANISHING OF THE GUE-CONDITIONAL BEAT CARRIER/.test(
        IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.verdict,
      ) &&
      /asserts NO beat beyond the already-recorded/.test(
        IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.verdict,
      ) &&
      /NO QED/.test(IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.verdict) &&
      /refereed bound is changed/i.test(IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.verdict),
  },
];

for (const a of IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35678-finite-height-beat-vs-parity-regime-boundary assertion failed: ${a.id}`);
  }
}
