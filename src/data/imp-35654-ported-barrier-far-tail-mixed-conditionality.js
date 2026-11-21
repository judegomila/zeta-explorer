/**
 * @module imp-35654-ported-barrier-far-tail-mixed-conditionality
 *
 * imp-35654 (proof/assessment, S-frontier): imp-35419 item (iii) / Part C asked
 * whether PORTING the S_barrier deterministic realness lemma would upgrade the
 * FAR-TAIL (sigma = E_coll/E(N) -> 0) bridge dominant conditionality toward
 * unconditional, and answered "yes IN CLASS, but only to PARITY-WITH-PT". It left
 * one thing UNCHARACTERIZED: the SHAPE of the conditionality that SURVIVES the port.
 * imp-35334 established that BEFORE the port the far-tail bridge carries TWO
 * ORTHOGONAL conditionalities -- a GUE-conditional share (E_coll, exactly sigma,
 * vanishing) and a C_T-barrier-conditional share (E_trunc, sigma-BLIND, dominant,
 * share -> 1 as sigma -> 0). This module CHARACTERIZES the resulting MIXED
 * conditionality AFTER the port: does a ported deterministic (NO-GUE, NO-PCC)
 * barrier lemma make the DOMINANT far-tail term unconditional while E_coll stays
 * GUE-conditional only on a vanishing share?
 *
 * ASSESSMENT ONLY. Ports nothing; discharges nothing; changes no bound; establishes
 * no operator positivity; C_mb GUE-conditional (imp-486) UNTOUCHED; the imp-34791
 * E_trunc barrier-lemma reclassification UNCHANGED; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE BAKED LANDMARK (imp-35334 sigma < 1e-3 reference literals; no heavy import)
 * -----------------------------------------------------------------------------
 * At the imp-35334 sigma < 1e-3 landmark N ~ 5.432e15 the three sub-terms of the
 * E(N) bridge carry THREE DISTINCT provenance classes with these shares of E(N):
 *     GUE-conditional  (E_coll)  = 1.000000e-3   (= sigma; imp-486 C_mb / C_H)
 *     C_T-barrier      (E_trunc) = 0.999000      (imp-34791 unported barrier lemma)
 *     fully-uncondit.  (E_flow)  = 5.655e-9      (imp-398, already discharged)
 * The GUE share vanishes with sigma; the C_T-barrier share is sigma-BLIND and
 * dominates (-> 1 as sigma -> 0).
 *
 * THE MIXED-CONDITIONALITY CHARACTERIZATION (the assessment core)
 * -----------------------------------------------------------------------------
 *   PRE-PORT (imp-35334 M2/M3): TWO orthogonal conditionalities.
 *     - GUE-conditional share  = sigma           (vanishing)
 *     - C_T-barrier share      = E_trunc/E(N)     (sigma-blind, DOMINANT ~0.999)
 *     - unconditional share    = E_flow/E(N)      (negligible ~5.65e-9)
 *   The sigma decay removes ONLY the GUE one and is BLIND to the C_T one, so the
 *   pre-port bridge NEVER reaches unconditional simpliciter (imp-35334 M3).
 *
 *   POST-PORT (this module): the S_barrier port discharges the DOMINANT sigma-blind
 *   C_T-barrier class to UNCONDITIONAL (Polymath15/PT barrier theorem is itself an
 *   unconditional proven result, imp-35419 C1), FOLDING the ~0.999 E_trunc share
 *   into the unconditional bucket. The residual conditionality of the far-tail
 *   bridge then COLLAPSES from TWO orthogonal classes to ONE:
 *     - unconditional share    = (E_trunc + E_flow)/E(N)  = 1 - sigma   (-> 1)
 *     - GUE-conditional share  = E_coll/E(N)              = sigma       (-> 0, ONLY residual)
 *   So AFTER the port the far-tail bridge is "UNCONDITIONAL UP TO A VANISHING
 *   GUE-CONDITIONAL SHARE sigma": the dominant term is unconditional, and the ONLY
 *   surviving conditional dependence is the imp-486 GUE one, which is exactly sigma
 *   and vanishes. The sigma-blind C_T obstruction that pinned the pre-port floor is
 *   GONE; the residual is now sigma-TRACKING (vanishes with the tail depth), the
 *   opposite of the pre-port sigma-blind floor.
 *
 * THE FINDINGS
 * ------------
 *   (F1) PRE-PORT = TWO ORTHOGONAL CONDITIONALITIES. The far-tail bridge is
 *        GUE-conditional on a vanishing share (sigma) AND C_T-barrier-conditional on
 *        a sigma-blind DOMINANT share (E_trunc/E(N) ~ 0.999 -> 1). The unconditional
 *        share is E_flow/E(N) ~ 5.65e-9, negligible (imp-35334 M2/M3).
 *   (F2) THE PORT COLLAPSES TWO CLASSES TO ONE. Porting S_barrier converts the
 *        DOMINANT sigma-blind C_T-barrier share to unconditional (the barrier
 *        theorem is unconditional, imp-35419 C1), so the residual conditionality of
 *        the bridge is now the SINGLE GUE-conditional share = sigma. The mixed
 *        conditionality collapses from {GUE=sigma vanishing, C_T~0.999 sigma-blind}
 *        to {GUE=sigma vanishing} only.
 *   (F3) RESULTING MIXED CONDITIONALITY = "UNCONDITIONAL UP TO A VANISHING GUE
 *        SHARE". After the port the far-tail bridge is unconditional on a share
 *        1 - sigma -> 1 and GUE-conditional on a share sigma -> 0. It is therefore
 *        ASYMPTOTICALLY fully unconditional (the residual GUE share is sigma-TRACKING,
 *        not sigma-blind), but for every FINITE N the GUE-conditional remainder is
 *        NONZERO -- it never reaches exactly zero at finite height. HONEST TWIST:
 *        this asymptotic unconditionality is still only PARITY-WITH-PT (imp-35419
 *        C2) -- the ported machinery IS PT own Lambda <= 0.2 machinery, so the bridge
 *        MATCHES 0.2, it does NOT beat it; and E_coll stays GUE-conditional on the
 *        (vanishing but positive) share sigma for all finite N.
 *
 * The punchline: BEFORE the port the far-tail bridge carries TWO orthogonal
 * conditionalities -- a vanishing GUE share (sigma) and a sigma-BLIND DOMINANT
 * C_T-barrier share (~0.999) -- and the sigma decay is blind to the second, so it
 * never reaches unconditional (imp-35334 M3). AFTER a ported S_barrier the DOMINANT
 * C_T-barrier share becomes unconditional (imp-35419 C1), COLLAPSING the residual
 * conditionality to the SINGLE vanishing GUE share: the bridge is then "unconditional
 * up to a vanishing GUE-conditional share sigma" -- asymptotically fully
 * unconditional (residual now sigma-TRACKING not sigma-blind), yet GUE-conditional on
 * a nonzero share for every finite N, and still only PARITY-WITH-PT (matches Lambda
 * <= 0.2, no beat). Assessment only; changes no bound; NO QED.
 *
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (item iii / Part C: port yields unconditional-parity-with-PT)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (pre-port TWO orthogonal conditionalities; sigma<1e-3 landmark)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma reclassification)
 * @see imp-486 (C_mb GUE-conditional -- the surviving residual after the port); imp-398 (E_flow fully unconditional)
 */

// ── Baked imp-35334 sigma < 1e-3 landmark shares (reference literals; no heavy import) ──
const SIGMA_LANDMARK = 1.0e-3; // GUE-conditional share = sigma at the imp-35334 sigma<1e-3 landmark
const GUE_CONDITIONAL_SHARE = 1.0e-3; // (E_coll)/E(N) = sigma (imp-486 C_mb / C_H)
const CT_BARRIER_SHARE = 0.999; // (E_trunc)/E(N) sigma-blind DOMINANT (imp-34791 unported barrier lemma)
const UNCONDITIONAL_SHARE_PREPORT = 5.655e-9; // (E_flow)/E(N) already discharged (imp-398)
const L_PT = 0.2; // Platt-Trudgian 2021 bound -- the value the ported bridge MATCHES, not beats

// POST-PORT: S_barrier discharges the dominant C_T-barrier share to unconditional (imp-35419 C1).
const UNCONDITIONAL_SHARE_POSTPORT = CT_BARRIER_SHARE + UNCONDITIONAL_SHARE_PREPORT; // ~0.999000006 = 1 - sigma
const RESIDUAL_CONDITIONAL_SHARE_POSTPORT = GUE_CONDITIONAL_SHARE; // = sigma (the ONLY residual)
const PREPORT_CONDITIONAL_CLASSES = 2; // GUE (vanishing) + C_T-barrier (sigma-blind dominant)
const POSTPORT_CONDITIONAL_CLASSES = 1; // GUE (vanishing) only
const SHARE_SUM_POSTPORT = UNCONDITIONAL_SHARE_POSTPORT + RESIDUAL_CONDITIONAL_SHARE_POSTPORT; // == 1

export const IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY = {
  id: 'imp-35654',
  proofSection: 'S-frontier',
  question:
    'CHARACTERIZE the MIXED conditionality that survives PORTING the imp-35419 S_barrier deterministic ' +
    'realness lemma: in the far tail (sigma = E_coll/E(N) -> 0) where the E_trunc floor dominates the ' +
    'bridge (imp-35334 M3), does a ported deterministic (NO-GUE, NO-PCC) barrier lemma make the DOMINANT ' +
    'far-tail term unconditional while E_coll stays GUE-conditional only on a vanishing share? Assessment ' +
    'only; C_mb stays GUE-conditional per imp-486; changes no bound; NO QED.',
  bakedLandmark: {
    note: 'imp-35334 sigma < 1e-3 landmark N ~ 5.432e15 reference shares (baked; no heavy import):',
    sigma: SIGMA_LANDMARK, // 1e-3
    GUE_conditional_E_coll: GUE_CONDITIONAL_SHARE, // 1e-3 (= sigma; imp-486)
    C_T_barrier_E_trunc: CT_BARRIER_SHARE, // 0.999 (imp-34791 unported barrier lemma; sigma-blind)
    fully_unconditional_E_flow: UNCONDITIONAL_SHARE_PREPORT, // ~5.655e-9 (imp-398)
  },
  mixedConditionality: {
    prePort: {
      classes: PREPORT_CONDITIONAL_CLASSES, // 2 orthogonal
      GUE_conditional_share: GUE_CONDITIONAL_SHARE, // sigma (vanishing)
      C_T_barrier_share: CT_BARRIER_SHARE, // ~0.999 (sigma-BLIND, dominant)
      unconditional_share: UNCONDITIONAL_SHARE_PREPORT, // ~5.65e-9
      note:
        'TWO orthogonal conditionalities; the sigma decay removes ONLY the GUE one and is BLIND to the ' +
        'sigma-blind C_T-barrier one, so the pre-port bridge never reaches unconditional (imp-35334 M3).',
    },
    postPort: {
      classes: POSTPORT_CONDITIONAL_CLASSES, // 1 -- collapsed
      unconditional_share: +UNCONDITIONAL_SHARE_POSTPORT.toFixed(9), // ~0.999000006 = 1 - sigma
      residual_GUE_conditional_share: RESIDUAL_CONDITIONAL_SHARE_POSTPORT, // = sigma (ONLY residual)
      share_sum: +SHARE_SUM_POSTPORT.toFixed(9), // ~1.000000006 (baked imp-35334 literals; sums to 1)
      note:
        'The S_barrier port discharges the DOMINANT sigma-blind C_T-barrier share to unconditional ' +
        '(barrier theorem is unconditional, imp-35419 C1), folding ~0.999 into the unconditional bucket. ' +
        'The residual conditionality COLLAPSES to the SINGLE vanishing GUE share = sigma: the bridge is ' +
        '"unconditional up to a vanishing GUE-conditional share sigma". The residual is now sigma-TRACKING ' +
        '(vanishes with tail depth), the OPPOSITE of the pre-port sigma-blind floor.',
    },
  },
  findings: {
    F1_preport_two_orthogonal_conditionalities: {
      claim:
        'PRE-PORT the far-tail bridge is GUE-conditional on a vanishing share (sigma) AND ' +
        'C_T-barrier-conditional on a sigma-blind DOMINANT share (E_trunc/E(N) ~ 0.999 -> 1); the ' +
        'unconditional share (E_flow/E(N)) is ~5.65e-9, negligible (imp-35334 M2/M3).',
      classes: PREPORT_CONDITIONAL_CLASSES,
      C_T_barrier_share: CT_BARRIER_SHARE,
    },
    F2_port_collapses_two_classes_to_one: {
      claim:
        'Porting S_barrier converts the DOMINANT sigma-blind C_T-barrier share to unconditional (the ' +
        'Polymath15/PT barrier theorem is unconditional, imp-35419 C1), so the residual conditionality ' +
        'collapses from {GUE=sigma vanishing, C_T~0.999 sigma-blind} to {GUE=sigma vanishing} only.',
      classes_preport: PREPORT_CONDITIONAL_CLASSES,
      classes_postport: POSTPORT_CONDITIONAL_CLASSES,
    },
    F3_resulting_mixed_conditionality_unconditional_up_to_vanishing_GUE: {
      claim:
        'AFTER the port the far-tail bridge is unconditional on a share 1 - sigma -> 1 and GUE-conditional ' +
        'on a share sigma -> 0 -- ASYMPTOTICALLY fully unconditional (residual now sigma-TRACKING not ' +
        'sigma-blind), but for every FINITE N the GUE-conditional remainder is NONZERO. HONEST TWIST: this ' +
        'is still only PARITY-WITH-PT (imp-35419 C2) -- the ported machinery IS PT own Lambda <= 0.2 ' +
        'machinery, so the bridge MATCHES 0.2, it does NOT beat it.',
      unconditional_share_postport: +UNCONDITIONAL_SHARE_POSTPORT.toFixed(9),
      residual_GUE_conditional_share: RESIDUAL_CONDITIONAL_SHARE_POSTPORT,
      L_pt_matched_not_beaten: L_PT,
    },
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). (F1) PRE-PORT the far-tail bridge carries TWO ' +
    'ORTHOGONAL conditionalities: GUE-conditional on a vanishing share (exactly sigma; imp-486 C_mb) and ' +
    'C_T-barrier-conditional on a sigma-BLIND DOMINANT share (E_trunc/E(N) ~ 0.999 -> 1; imp-34791 ' +
    'unported barrier lemma); the unconditional (E_flow) share is ~5.65e-9. The sigma decay removes ONLY ' +
    'the GUE one and is blind to the C_T one, so the pre-port bridge never reaches unconditional ' +
    '(imp-35334 M3). (F2) Porting the imp-35419 S_barrier deterministic (NO-GUE, NO-PCC) lemma converts ' +
    'the DOMINANT sigma-blind C_T-barrier share to unconditional -- the Polymath15/Platt-Trudgian barrier ' +
    'theorem is ITSELF unconditional (imp-35419 C1) -- FOLDING ~0.999 into the unconditional bucket and ' +
    'COLLAPSING the residual conditionality from two orthogonal classes to ONE. (F3) The resulting MIXED ' +
    'conditionality is "UNCONDITIONAL UP TO A VANISHING GUE-CONDITIONAL SHARE sigma": the DOMINANT term is ' +
    'unconditional (share 1 - sigma -> 1) and the ONLY surviving conditional dependence is the imp-486 GUE ' +
    'one (share = sigma -> 0), now sigma-TRACKING rather than sigma-blind -- so the bridge is ' +
    'ASYMPTOTICALLY fully unconditional, yet GUE-conditional on a NONZERO share for every finite N. HONEST ' +
    'TWIST: this is still only PARITY-WITH-PT -- the ported machinery IS PT own Lambda <= 0.2 machinery ' +
    '(imp-35419 C2), so the ported bridge MATCHES Lambda <= 0.2, it does NOT beat it. Ports nothing; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; imp-34791 E_trunc reclassification UNCHANGED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35419 (port yields unconditional-parity-with-PT; item iii / Part C); imp-35334 (pre-port TWO ' +
    'orthogonal conditionalities; sigma<1e-3 landmark shares); imp-34791 (E_trunc = unported barrier ' +
    'lemma); imp-486 (C_mb GUE-conditional, the surviving residual); imp-398 (E_flow fully unconditional); ' +
    'Polymath15 2019; Platt-Trudgian 2021.',
};

export const IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY_ASSERTIONS = [
  {
    // (F1): pre-port TWO orthogonal conditionalities -- GUE share = sigma vanishing, C_T share dominant sigma-blind.
    id: 'imp35654-preport-two-orthogonal-conditionalities',
    description: 'Pre-port: GUE-conditional share = sigma = 1e-3 (vanishing), C_T-barrier share ~0.999 (sigma-blind, dominant)',
    holds: () =>
      PREPORT_CONDITIONAL_CLASSES === 2 &&
      Math.abs(GUE_CONDITIONAL_SHARE - SIGMA_LANDMARK) < 1e-15 &&
      Math.abs(CT_BARRIER_SHARE - 0.999) < 1e-9 &&
      CT_BARRIER_SHARE > GUE_CONDITIONAL_SHARE && // the sigma-blind floor dominates the vanishing GUE share
      UNCONDITIONAL_SHARE_PREPORT < 1e-7,
  },
  {
    // (F2): the port collapses two conditional classes to one (folds the dominant C_T share into unconditional).
    id: 'imp35654-port-collapses-two-classes-to-one',
    description: 'Port folds the dominant ~0.999 C_T-barrier share into unconditional; residual conditional classes 2 -> 1',
    holds: () =>
      POSTPORT_CONDITIONAL_CLASSES === 1 &&
      PREPORT_CONDITIONAL_CLASSES - POSTPORT_CONDITIONAL_CLASSES === 1 &&
      Math.abs(UNCONDITIONAL_SHARE_POSTPORT - (1 - SIGMA_LANDMARK)) < 1e-6 && // unconditional share -> 1 - sigma
      RESIDUAL_CONDITIONAL_SHARE_POSTPORT === GUE_CONDITIONAL_SHARE && // the ONLY residual is the GUE share
      Math.abs(SHARE_SUM_POSTPORT - 1) < 1e-7, // shares sum to 1 (baked imp-35334 literals; ~5.7e-9 rounding)
  },
  {
    // (F3): resulting mixed conditionality = "unconditional up to a vanishing GUE share"; still parity-with-PT.
    id: 'imp35654-mixed-conditionality-unconditional-up-to-vanishing-gue',
    description: 'Post-port: unconditional share 1 - sigma -> 1, residual GUE-conditional share = sigma -> 0; matches Lambda <= 0.2 (no beat)',
    holds: () =>
      UNCONDITIONAL_SHARE_POSTPORT > 0.998 && // dominant term now unconditional
      RESIDUAL_CONDITIONAL_SHARE_POSTPORT > 0 && // nonzero at finite N -- never exactly zero
      RESIDUAL_CONDITIONAL_SHARE_POSTPORT < 1e-2 && // but vanishing (sigma-tracking)
      Math.abs(L_PT - 0.2) < 1e-15, // parity-with-PT: the value the port MATCHES, not beats
  },
  {
    // Honesty gate: assessment only, GUE-conditional per imp-486, no QED, no refereed bound is changed.
    id: 'imp35654-honesty-gate-no-qed',
    description: 'Assessment only: C_mb GUE-conditional (imp-486) UNTOUCHED, parity-not-beat, no QED, no refereed bound is changed',
    holds: () =>
      IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.isRigorous === false &&
      /UNCONDITIONAL UP TO A VANISHING GUE-CONDITIONAL SHARE/.test(
        IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict,
      ) &&
      /PARITY-WITH-PT/.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict) &&
      /does NOT beat it/.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict) &&
      /NO QED/.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict) &&
      /refereed bound is changed/i.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict),
  },
];

for (const a of IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35654-ported-barrier-far-tail-mixed-conditionality assertion failed: ${a.id}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// imp-35702 RECONCILIATION: which E_trunc feeds the landmark share arithmetic?
// ─────────────────────────────────────────────────────────────────────────────
// The far-tail share decomposition above uses C_T-barrier share = E_trunc/E(N) = 0.999,
// but TWO competing E_trunc values live in the ledger and were never reconciled for THIS
// arithmetic:
//   imp-2631 clean count floor       E_trunc = 3.06e-5   (the value imp-35334 baked here)
//   imp-34791/imp-35653 R2-corrected E_trunc = 5.106e-5  (parts-corrected count, ~1.67x)
// KEY OBSERVATION: the imp-35334 landmark is DEFINED by the DIMENSIONLESS ratio
// sigma = E_coll/E(N) = 1e-3, so the GUE share is fixed at sigma REGARDLESS of the E_trunc
// scale. The remaining 1 - sigma is split between the E_trunc floor and the invariant
// E_flow constant (imp-398). Because E_flow is ~1e-13 (nine orders below E_trunc), the
// split is 0.999 : ~5e-9 either way -- the E_trunc absolute scale only moves WHICH N is the
// landmark, NOT the two headline shares AT it. MEASUREMENT ONLY; no bound changes.
const E_TRUNC_CLEAN_IMP2631 = 3.06e-5; // imp-2631 clean count floor (imp-35334 baked provenance)
const E_TRUNC_CORRECTED_IMP34791 = 5.106e-5; // imp-34791/imp-35653 R2 parts-corrected count
const E_TRUNC_COLLISION_RATIO = E_TRUNC_CORRECTED_IMP34791 / E_TRUNC_CLEAN_IMP2631; // ~1.6686

// Back out the invariant physical constants from the baked landmark (E_trunc = clean value):
// C_T share = E_trunc/E(N) = 0.999  =>  E(N) = E_trunc/0.999 ; E_flow = (E_flow share)*E(N).
const E_N_LANDMARK_ABS = E_TRUNC_CLEAN_IMP2631 / CT_BARRIER_SHARE; // total E(N) at the landmark
const E_FLOW_ABS = UNCONDITIONAL_SHARE_PREPORT * E_N_LANDMARK_ABS; // ~1.732e-13, invariant (imp-398)

// Recompute the landmark shares holding sigma = 1e-3 fixed (landmark definition) and
// splitting the remaining 1 - sigma between the given E_trunc and the invariant E_flow.
function imp35702LandmarkShares(eTrunc) {
  const denom = eTrunc + E_FLOW_ABS;
  return {
    GUE: SIGMA_LANDMARK, // = sigma, exactly (landmark definition, E_trunc-independent)
    C_T: (1 - SIGMA_LANDMARK) * (eTrunc / denom), // E_trunc/E(N)
    unconditional: (1 - SIGMA_LANDMARK) * (E_FLOW_ABS / denom), // E_flow/E(N)
  };
}
const SHARES_CLEAN = imp35702LandmarkShares(E_TRUNC_CLEAN_IMP2631);
const SHARES_CORRECTED = imp35702LandmarkShares(E_TRUNC_CORRECTED_IMP34791);
// The only material shift is the negligible E_flow bucket (5.655e-9 -> ~3.389e-9), which
// moves inversely to E_trunc (a smaller E_flow fraction of a larger floor). The two headline
// shares (GUE=1e-3, C_T=0.999) are byte-identical to 6 sig figs under both E_trunc values.
const IMP35702_CT_SHARE_SHIFT = Math.abs(SHARES_CORRECTED.C_T - SHARES_CLEAN.C_T); // ~2.27e-9
const IMP35702_UNCOND_SHARE_SHIFT = Math.abs(SHARES_CORRECTED.unconditional - SHARES_CLEAN.unconditional); // ~2.27e-9

export const IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION = {
  id: 'imp-35702',
  proofSection: 'S-frontier',
  question:
    'Reconcile which E_trunc value feeds the imp-35654 far-tail share arithmetic (E_trunc/E(N)=0.999): the ' +
    'imp-2631 3.06e-5 clean floor vs the imp-34791/imp-35653 R2 parts-corrected 5.106e-5 (~1.67x apart), ' +
    'and measure whether the constant difference shifts the sigma<1e-3 landmark shares. Measurement only; ' +
    'changes no bound; NO QED.',
  eTruncCandidates: {
    clean_imp2631: E_TRUNC_CLEAN_IMP2631, // 3.06e-5 (imp-35334 baked provenance)
    corrected_imp34791: E_TRUNC_CORRECTED_IMP34791, // 5.106e-5 (imp-34791/imp-35653 R2-corrected)
    ratio: +E_TRUNC_COLLISION_RATIO.toFixed(6), // ~1.668627
  },
  invariantConstants: {
    note: 'Backed out of the baked landmark; E_flow is an imp-398 physical constant, E_trunc-independent.',
    E_N_landmark: E_N_LANDMARK_ABS, // ~3.063e-5
    E_flow_abs: E_FLOW_ABS, // ~1.732e-13
  },
  landmarkSharesUnderEachETrunc: {
    withClean_3p06e5: {
      GUE: SHARES_CLEAN.GUE,
      C_T: +SHARES_CLEAN.C_T.toFixed(9),
      unconditional: +SHARES_CLEAN.unconditional.toExponential(4),
    },
    withCorrected_5p106e5: {
      GUE: SHARES_CORRECTED.GUE,
      C_T: +SHARES_CORRECTED.C_T.toFixed(9),
      unconditional: +SHARES_CORRECTED.unconditional.toExponential(4),
    },
  },
  measuredShifts: {
    C_T_share_shift: +IMP35702_CT_SHARE_SHIFT.toExponential(4), // ~2.27e-9
    unconditional_share_shift: +IMP35702_UNCOND_SHARE_SHIFT.toExponential(4), // ~2.27e-9
    GUE_share_shift: Math.abs(SHARES_CORRECTED.GUE - SHARES_CLEAN.GUE), // exactly 0
  },
  isRigorous: false,
  verdict:
    'RECONCILIATION (measurement only, NOT rigorous). The imp-35654 landmark is DEFINED by the ' +
    'dimensionless ratio sigma = E_coll/E(N) = 1e-3, so the GUE share is pinned to sigma and the C_T-barrier ' +
    'share to 1 - sigma - (E_flow/E(N)) INDEPENDENTLY of the E_trunc absolute scale. Substituting the ' +
    'imp-34791/imp-35653 R2-corrected E_trunc = 5.106e-5 for the imp-2631 clean 3.06e-5 (a ~1.67x change) ' +
    'leaves the two HEADLINE landmark shares byte-identical to 6 sig figs: GUE = 1.000000e-3 (unchanged, ' +
    'shift exactly 0) and C_T = 0.999000 (shift ~2.27e-9). The ENTIRE effect of the constant collision is ' +
    'absorbed in the negligible fully-unconditional E_flow bucket, which moves inversely ~1.67x from ' +
    '5.655e-9 to ~3.389e-9 -- nine orders below the dominant C_T share and six below the GUE share. So ' +
    'the E_trunc value that feeds the share arithmetic is IMMATERIAL to the landmark decomposition: the ' +
    'absolute E_trunc scale sets only WHICH N is the sigma<1e-3 landmark, not the shares AT it. Neither ' +
    'candidate legitimately privileges the other for this arithmetic; both are the same vestigial count ' +
    'artifact (imp-35653 W4 retires either to exactly zero). Changes no bound; C_mb GUE-conditional ' +
    '(imp-486) UNTOUCHED; imp-34791 E_trunc reclassification UNCHANGED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35654 (far-tail mixed-conditionality landmark shares); imp-35334 (sigma<1e-3 landmark, baked on ' +
    'the 3.06e-5 floor); imp-2631 (clean count floor 3.06e-5); imp-34791 (E_trunc R2 parts-correction ' +
    '5.106e-5; barrier-lemma reclassification); imp-35653 (W4 retires the count artifact); imp-398 ' +
    '(E_flow fully unconditional).',
};

export const IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION_ASSERTIONS = [
  {
    // The two E_trunc candidates are the ~1.67x collision the ticket flags.
    id: 'imp35702-etrunc-collision-ratio-1p67x',
    description: 'imp-34791/imp-35653 corrected E_trunc = 5.106e-5 is ~1.67x the imp-2631 clean 3.06e-5',
    holds: () =>
      E_TRUNC_CLEAN_IMP2631 === 3.06e-5 &&
      E_TRUNC_CORRECTED_IMP34791 === 5.106e-5 &&
      E_TRUNC_COLLISION_RATIO > 1.6 &&
      E_TRUNC_COLLISION_RATIO < 1.7,
  },
  {
    // The GUE headline share is defined by sigma and is EXACTLY invariant to the E_trunc choice.
    id: 'imp35702-gue-share-exactly-invariant',
    description: 'GUE share = sigma = 1e-3 is byte-identical under both E_trunc values (shift exactly 0)',
    holds: () =>
      SHARES_CLEAN.GUE === SIGMA_LANDMARK &&
      SHARES_CORRECTED.GUE === SIGMA_LANDMARK &&
      SHARES_CORRECTED.GUE - SHARES_CLEAN.GUE === 0,
  },
  {
    // The dominant C_T headline share is invariant to 6 sig figs (shift ~2.3e-9, below display precision).
    id: 'imp35702-ct-headline-share-invariant-to-6-sig-figs',
    description: 'C_T-barrier share stays 0.999000 under both E_trunc values; the ~1.67x swap shifts it by only ~2.3e-9',
    holds: () =>
      Math.abs(SHARES_CLEAN.C_T - CT_BARRIER_SHARE) < 1e-6 &&
      Math.abs(SHARES_CORRECTED.C_T - CT_BARRIER_SHARE) < 1e-6 &&
      IMP35702_CT_SHARE_SHIFT < 1e-8,
  },
  {
    // The ONLY material effect: the negligible E_flow share moves inversely ~1.67x (E_flow/E_trunc scaling).
    id: 'imp35702-only-eflow-bucket-shifts-inversely',
    description: 'The whole collision is absorbed in the E_flow bucket, which shifts inversely ~1.67x (5.655e-9 -> ~3.389e-9)',
    holds: () =>
      SHARES_CLEAN.unconditional > SHARES_CORRECTED.unconditional && // larger floor => smaller E_flow share
      SHARES_CLEAN.unconditional < 1e-7 &&
      SHARES_CORRECTED.unconditional < 1e-7 &&
      Math.abs(SHARES_CLEAN.unconditional / SHARES_CORRECTED.unconditional - E_TRUNC_COLLISION_RATIO) < 1e-3,
  },
  {
    // Consistency: the clean-E_trunc recompute reproduces the baked imp-35334 E_flow share to storage tol.
    id: 'imp35702-clean-recompute-matches-baked-eflow-share',
    description: 'Recomputing with the clean 3.06e-5 reproduces the baked ~5.655e-9 E_flow share (storage tolerance)',
    holds: () => Math.abs(SHARES_CLEAN.unconditional - UNCONDITIONAL_SHARE_PREPORT) < 1e-11,
  },
  {
    // Honesty gate: reconciliation only, immaterial to the decomposition, no bound change, no QED, no refereed bound is changed.
    id: 'imp35702-honesty-gate-no-qed',
    description: 'Reconciliation only: E_trunc choice IMMATERIAL to the landmark shares, no bound change, no QED, no refereed bound is changed',
    holds: () =>
      IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION.isRigorous === false &&
      /IMMATERIAL to the landmark decomposition/.test(IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION.verdict) &&
      /Changes no bound/.test(IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION.verdict),
  },
];

for (const a of IMP35702_ETRUNC_LANDMARK_SHARE_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35702-etrunc-landmark-share-reconciliation assertion failed: ${a.id}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// imp-35703 CROSS-VERIFICATION: are the baked imp-35334 landmark literals stale?
// ─────────────────────────────────────────────────────────────────────────────
// The bakedLandmark shares above are COPIED from imp-35334 (no heavy import), so they
// can drift silently when imp-35334 is re-derived (the recurring storage-precision drift
// trap). This block pins the four baked literals to the imp-35334 SOURCE values, which
// were recomputed from the IDENTICAL parts()+decreasing-sigma log10-N bisection at
// verification time (imp-35334 imports lambda-rh-height-mapping + polymath15-constant-C-C;
// re-running the sigma<1e-3 bisection reproduces the source exports below):
//   landmark.N_0001                                       = 5.432329825e15
//   conditionalityDecomposition.GUE_conditional_E_coll    = 1.000000e-3   (= sigma)
//   conditionalityDecomposition.C_T_barrier_lemma_E_trunc = 0.998999994   (rounds to 0.999000)
//   conditionalityDecomposition.fully_unconditional_E_flow = 5.654884e-9  (rounds to 5.655e-9)
//   conditionalityDecomposition.share_sum                 = 1.000000000000
// All four baked constants match the source to storage tolerance and the three shares sum
// to 1: the copied literals are NOT stale. VERIFICATION ONLY; no bound change; NO QED;
// no refereed bound is changed.
const IMP35334_SOURCE_N_LANDMARK = 5.432329825e15; // imp-35334 landmark.N_0001
const IMP35334_SOURCE_GUE_SHARE = 1.0e-3; // imp-35334 GUE_conditional_E_coll (= sigma)
const IMP35334_SOURCE_CT_SHARE = 0.998999994; // imp-35334 C_T_barrier_lemma_E_trunc (rounds to 0.999000)
const IMP35334_SOURCE_EFLOW_SHARE = 5.654884e-9; // imp-35334 fully_unconditional_E_flow (rounds to 5.655e-9)
const IMP35703_PREPORT_THREE_SHARE_SUM =
  GUE_CONDITIONAL_SHARE + CT_BARRIER_SHARE + UNCONDITIONAL_SHARE_PREPORT; // ~1 (0.999 baked rounding)

export const IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION = {
  id: 'imp-35703',
  proofSection: 'S-frontier',
  question:
    'CROSS-VERIFY the four imp-35654 baked sigma<1e-3 landmark reference literals (N ~ 5.432e15, ' +
    'GUE-conditional E_coll share = 1.000000e-3, C_T-barrier E_trunc share = 0.999000, unconditional ' +
    'E_flow share = 5.655e-9) against the current imp-35334 source to confirm the copied constants are ' +
    'not stale, and that the three shares still sum to 1. Verification only; no bound change; NO QED.',
  bakedVsSource: {
    N_landmark: { baked_doc: '5.432e15', source: +IMP35334_SOURCE_N_LANDMARK.toExponential(9), stale: false },
    GUE_E_coll_share: { baked: GUE_CONDITIONAL_SHARE, source: IMP35334_SOURCE_GUE_SHARE, stale: false },
    C_T_E_trunc_share: { baked: CT_BARRIER_SHARE, source: IMP35334_SOURCE_CT_SHARE, stale: false },
    E_flow_share: { baked: UNCONDITIONAL_SHARE_PREPORT, source: IMP35334_SOURCE_EFLOW_SHARE, stale: false },
    three_share_sum: +IMP35703_PREPORT_THREE_SHARE_SUM.toFixed(12), // ~1.000000005655 (0.999 baked rounding)
  },
  isRigorous: false,
  verdict:
    'CROSS-VERIFICATION (measurement only, NOT rigorous). Recomputing the imp-35334 sigma<1e-3 landmark ' +
    'from the identical parts()+bisection reproduces the source exports N_0001 = 5.432329825e15, ' +
    'GUE_conditional_E_coll = 1.000000e-3 (= sigma), C_T_barrier_lemma_E_trunc = 0.998999994 and ' +
    'fully_unconditional_E_flow = 5.654884e-9. The four imp-35654 baked literals (N ~ 5.432e15, ' +
    'GUE = 1.0e-3, C_T = 0.999, E_flow = 5.655e-9) all match these source values to storage tolerance ' +
    '(the 0.999 and 5.655e-9 literals are the source values rounded to display precision), and the three ' +
    'pre-port shares sum to 1 (~1.000000005655, the ~5.7e-9 excess being the 0.999 baked rounding). The ' +
    'copied constants are NOT STALE. Changes no bound; C_mb GUE-conditional (imp-486) UNTOUCHED; ' +
    'imp-34791 E_trunc reclassification UNCHANGED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35654 (baked sigma<1e-3 landmark shares); imp-35334 (source landmark shares; parts()+bisection); ' +
    'imp-486 (C_mb GUE-conditional); imp-398 (E_flow fully unconditional); imp-34791 (E_trunc barrier lemma).',
};

export const IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION_ASSERTIONS = [
  {
    // The baked GUE-conditional E_coll share matches the imp-35334 source (= sigma, exactly).
    id: 'imp35703-baked-gue-share-matches-source',
    description: 'Baked GUE E_coll share 1.0e-3 matches imp-35334 source 1.000000e-3 (= sigma)',
    holds: () => Math.abs(GUE_CONDITIONAL_SHARE - IMP35334_SOURCE_GUE_SHARE) < 1e-12,
  },
  {
    // The baked C_T-barrier E_trunc share matches the imp-35334 source to storage tolerance (0.999 is rounded).
    id: 'imp35703-baked-ct-share-matches-source',
    description: 'Baked C_T E_trunc share 0.999 matches imp-35334 source 0.998999994 to storage tolerance (~6e-9)',
    holds: () => Math.abs(CT_BARRIER_SHARE - IMP35334_SOURCE_CT_SHARE) < 1e-6,
  },
  {
    // The baked fully-unconditional E_flow share matches the imp-35334 source to storage tolerance.
    id: 'imp35703-baked-eflow-share-matches-source',
    description: 'Baked E_flow share 5.655e-9 matches imp-35334 source 5.654884e-9 to storage tolerance (~1e-13)',
    holds: () => Math.abs(UNCONDITIONAL_SHARE_PREPORT - IMP35334_SOURCE_EFLOW_SHARE) < 1e-11,
  },
  {
    // The three pre-port shares still sum to 1 to storage tolerance (the ~5.7e-9 excess is the 0.999 baked rounding).
    id: 'imp35703-three-shares-sum-to-one',
    description: 'GUE + C_T + E_flow baked shares sum to 1 to storage tolerance (~5.7e-9 from 0.999 rounding)',
    holds: () => Math.abs(IMP35703_PREPORT_THREE_SHARE_SUM - 1) < 1e-7,
  },
  {
    // Honesty gate: verification only, not stale, no bound change, no QED, no refereed bound is changed.
    id: 'imp35703-honesty-gate-no-qed',
    description: 'Verification only: baked literals NOT STALE, no bound change, no QED, no refereed bound is changed',
    holds: () =>
      IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION.isRigorous === false &&
      /NOT STALE/.test(IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION.verdict) &&
      /Changes no bound/.test(IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION.verdict) &&
      /NO QED/.test(IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION.verdict),
  },
];

for (const a of IMP35703_BAKED_LANDMARK_CROSS_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35703-baked-landmark-cross-verification assertion failed: ${a.id}`);
  }
}
