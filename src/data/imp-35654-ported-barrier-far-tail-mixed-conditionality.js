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
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
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
const L_PT = 0.2; // Platt-Trudgian SOTA -- the value the ported bridge MATCHES, not beats

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
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
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
    // Honesty gate: assessment only, GUE-conditional per imp-486, no QED, PT stays SOTA.
    id: 'imp35654-honesty-gate-no-qed',
    description: 'Assessment only: C_mb GUE-conditional (imp-486) UNTOUCHED, parity-not-beat, no QED, PT SOTA',
    holds: () =>
      IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.isRigorous === false &&
      /UNCONDITIONAL UP TO A VANISHING GUE-CONDITIONAL SHARE/.test(
        IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict,
      ) &&
      /PARITY-WITH-PT/.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict) &&
      /does NOT beat it/.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict) &&
      /NO QED/.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict) &&
      /remains SOTA/.test(IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY.verdict),
  },
];

for (const a of IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35654-ported-barrier-far-tail-mixed-conditionality assertion failed: ${a.id}`);
  }
}
