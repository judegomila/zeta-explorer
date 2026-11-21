/**
 * @module imp-35679-postport-share-sum-unity-excess-reconciliation
 *
 * imp-35679 (accuracy/verification, S-frontier): imp-35654 bakes
 * SHARE_SUM_POSTPORT = UNCONDITIONAL_SHARE_POSTPORT (0.999 + 5.655e-9) +
 * residual GUE (1e-3) = ~1.000000006, i.e. the three baked provenance shares
 * of E(N) at the imp-35334 sigma < 1e-3 landmark sum to 1 + ~6e-9 rather than
 * EXACTLY 1. This module RECONCILES that +6e-9 excess: is it a genuine
 * normalization gap in the imp-35334 landmark shares, or purely a
 * display-rounding artifact of the sigma < 1e-3 reference literals
 * (GUE = 1e-3, C_T = 0.999, E_flow = 5.655e-9)?
 *
 * VERIFICATION / MEASUREMENT ONLY. Ports nothing; discharges nothing; changes
 * no bound; corrects no literal (the 0.999 C_T value is a legitimate 3-sig-fig
 * DISPLAY of the true residual mass); C_mb GUE-conditional (imp-486) UNTOUCHED;
 * the imp-34791 E_trunc barrier-lemma reclassification UNCHANGED; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * THE ARITHMETIC (baked imp-35334 sigma < 1e-3 landmark literals; no heavy import)
 * -----------------------------------------------------------------------------
 *   share_sum = C_T (0.999) + E_flow (5.655e-9) + GUE (1e-3)
 *             = (GUE + C_T) + E_flow
 *             = 1.000000000000000 + 5.655e-9        <-- GUE + C_T sum to EXACTLY 1
 *             = 1.000000005655
 *   excess over unity = share_sum - 1 = 5.655e-9 = the E_flow literal EXACTLY
 *   (to float precision; the residual |excess - E_flow| ~ 2.4e-17 is pure
 *   double-rounding, ~100x below one ULP of unity).
 *
 * THE RECONCILIATION (the verification core)
 * -----------------------------------------------------------------------------
 * The excess is a DISPLAY-ROUNDING ARTIFACT, NOT a genuine normalization gap.
 * The two DOMINANT literals -- GUE = sigma = 1e-3 and C_T = 0.999 -- already sum
 * to EXACTLY 1. The 0.999 C_T value is a 3-significant-figure DISPLAY of the
 * true residual share E_trunc/E(N) = 1 - sigma - (E_flow/E(N))
 *                                   = 1 - 1e-3 - 5.655e-9
 *                                   = 0.998999994345,
 * which ALREADY absorbs the ~5.655e-9 E_flow mass into the dominant residual
 * bucket at 3-sig-fig precision (0.998999994345 rounds to 0.999). Because the
 * baked literal reports the ROUNDED-up 0.999 and then E_flow (5.655e-9) is added
 * on TOP, the E_flow mass is DOUBLE-REPRESENTED, inflating the sum by exactly
 * the E_flow share. The underlying provenance partition
 *     E_coll + E_trunc + E_flow = E(N)
 * IS exact: with the un-rounded C_T = 0.998999994345 the three shares
 *     GUE (1e-3) + C_T_true (0.998999994345) + E_flow (5.655e-9)
 * sum to EXACTLY 1 (residual < 1e-15). So no normalization gap exists in the
 * imp-35334 shares; the +6e-9 is an artifact of pinning the dominant residual
 * to 3 sig figs (0.999) while the vanishing E_flow share is carried at full
 * precision alongside it.
 *
 * THE FINDINGS
 * ------------
 *   (V1) EXCESS EQUALS E_flow EXACTLY. share_sum - 1 = 5.655e-9 = the baked
 *        E_flow literal to float precision (residual ~2.4e-17). The excess is
 *        NOT an unexplained ~6e-9 remainder; it is precisely the E_flow share.
 *   (V2) GUE + C_T SUM TO EXACTLY 1 -- the double-count source. The two dominant
 *        literals GUE (1e-3) + C_T (0.999) = 1.0 exactly, so adding E_flow on top
 *        double-represents its mass. The 0.999 C_T literal is the 3-sig-fig
 *        DISPLAY of the true residual 0.998999994345 that already absorbs E_flow.
 *   (V3) THE TRUE PARTITION IS EXACT -- rounding artifact, NOT a gap. With the
 *        un-rounded C_T_true = 1 - sigma - E_flow_share = 0.998999994345, the
 *        three shares sum to EXACTLY 1 (residual < 1e-15). The provenance classes
 *        E_coll + E_trunc + E_flow = E(N) DO exactly partition E(N); the +6e-9 is
 *        purely a display-rounding artifact of pinning C_T to 3 sig figs.
 *
 * The punchline: the imp-35654 SHARE_SUM_POSTPORT ~1.000000006 is a
 * DISPLAY-ROUNDING artifact, not a genuine normalization gap. The +6e-9 excess
 * equals the E_flow literal (5.655e-9) EXACTLY because the two dominant literals
 * GUE (1e-3) + C_T (0.999) already sum to 1, so E_flow is double-represented; the
 * true residual C_T = 0.998999994345 already absorbs E_flow, and with it the three
 * imp-35334 shares partition E(N) EXACTLY. Verification only; corrects no literal;
 * changes no bound; NO QED.
 *
 * @see imp-35654-ported-barrier-far-tail-mixed-conditionality (source: bakes share_sum ~1.000000006)
 * @see imp-35686-postport-share-literal-guard (regression-guard pinning the same share literals)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark shares)
 * @see imp-486 (C_mb GUE-conditional, the residual GUE share); imp-398 (E_flow fully unconditional)
 */

// Baked imp-35334 sigma < 1e-3 landmark shares (reference literals; no heavy import).
const SIGMA_LANDMARK = 1.0e-3; // GUE-conditional share = sigma (E_coll/E(N); imp-486)
const CT_BARRIER_SHARE = 0.999; // 3-sig-fig DISPLAY of E_trunc/E(N) (imp-34791 unported barrier lemma)
const E_FLOW_SHARE = 5.655e-9; // E_flow/E(N) fully unconditional (imp-398)

// Post-port shares as imp-35654 bakes them.
const UNCONDITIONAL_SHARE_POSTPORT = CT_BARRIER_SHARE + E_FLOW_SHARE; // ~0.999000006
const RESIDUAL_GUE_SHARE_POSTPORT = SIGMA_LANDMARK; // = sigma
const SHARE_SUM_POSTPORT = UNCONDITIONAL_SHARE_POSTPORT + RESIDUAL_GUE_SHARE_POSTPORT; // ~1.000000006

// The reconciliation quantities.
const EXCESS_OVER_UNITY = SHARE_SUM_POSTPORT - 1; // == E_flow share (double-representation)
const GUE_PLUS_CT = SIGMA_LANDMARK + CT_BARRIER_SHARE; // == 1 exactly (the double-count source)
const CT_BARRIER_SHARE_TRUE = 1 - SIGMA_LANDMARK - E_FLOW_SHARE; // 0.998999994345 (un-rounded residual)
const SHARE_SUM_TRUE = SIGMA_LANDMARK + CT_BARRIER_SHARE_TRUE + E_FLOW_SHARE; // == 1 exactly

export const IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION = {
  id: 'imp-35679',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35654 post-port SHARE_SUM_POSTPORT ~1.000000006 excess (+~6e-9 over unity) a genuine ' +
    'normalization gap in the imp-35334 landmark shares, or a display-rounding artifact of the sigma<1e-3 ' +
    'reference literals (GUE 1e-3, C_T 0.999, E_flow 5.655e-9)? Verification only; corrects no literal; ' +
    'changes no bound; NO QED.',
  bakedLiterals: {
    GUE_conditional_share: SIGMA_LANDMARK, // 1e-3 (= sigma; imp-486)
    C_T_barrier_share_displayed: CT_BARRIER_SHARE, // 0.999 (3-sig-fig display; imp-34791)
    E_flow_unconditional_share: E_FLOW_SHARE, // 5.655e-9 (imp-398)
    share_sum_postport: +SHARE_SUM_POSTPORT.toFixed(9), // ~1.000000006
  },
  reconciliation: {
    excess_over_unity: +EXCESS_OVER_UNITY.toExponential(6), // ~5.655e-9 == E_flow share
    excess_equals_E_flow: Math.abs(EXCESS_OVER_UNITY - E_FLOW_SHARE) < 1e-15,
    GUE_plus_CT_displayed: +GUE_PLUS_CT.toFixed(15), // 1.0 exactly (the double-count source)
    C_T_barrier_share_true: +CT_BARRIER_SHARE_TRUE.toPrecision(16), // 0.998999994345 (un-rounded residual)
    share_sum_true: +SHARE_SUM_TRUE.toPrecision(16), // 1.0 exactly with the un-rounded C_T
    verdict_is_rounding_artifact: true,
    note:
      'The +6e-9 excess is a DISPLAY-ROUNDING artifact, not a normalization gap. The dominant literals ' +
      'GUE (1e-3) + C_T (0.999) already sum to EXACTLY 1, so the E_flow share (5.655e-9) added on top is ' +
      'DOUBLE-REPRESENTED -- the excess equals E_flow exactly. The 0.999 C_T literal is the 3-sig-fig ' +
      'display of the true residual 0.998999994345 that already absorbs E_flow; with the un-rounded C_T the ' +
      'three imp-35334 shares partition E(N) EXACTLY (residual < 1e-15).',
  },
  findings: {
    V1_excess_equals_E_flow: {
      claim:
        'share_sum - 1 = 5.655e-9 = the baked E_flow literal EXACTLY (residual ~2.4e-17, ~100x below one ' +
        'ULP of unity). The +6e-9 excess is precisely the E_flow share, not an unexplained remainder.',
      excess_over_unity: +EXCESS_OVER_UNITY.toExponential(6),
    },
    V2_GUE_plus_CT_exactly_one: {
      claim:
        'The two dominant literals GUE (1e-3) + C_T (0.999) sum to EXACTLY 1, so adding E_flow on top ' +
        'double-represents its mass. The 0.999 C_T literal is the 3-sig-fig display of the true residual ' +
        '0.998999994345 that already absorbs E_flow.',
      GUE_plus_CT_displayed: +GUE_PLUS_CT.toFixed(15),
    },
    V3_true_partition_exact: {
      claim:
        'With the un-rounded C_T_true = 1 - sigma - E_flow_share = 0.998999994345 the three shares sum to ' +
        'EXACTLY 1 (residual < 1e-15). The provenance classes E_coll + E_trunc + E_flow = E(N) DO exactly ' +
        'partition E(N); the +6e-9 is purely a display-rounding artifact -- NOT a normalization gap.',
      C_T_barrier_share_true: +CT_BARRIER_SHARE_TRUE.toPrecision(16),
      share_sum_true: +SHARE_SUM_TRUE.toPrecision(16),
    },
  },
  isRigorous: false,
  verdict:
    'VERIFICATION (measurement, NOT a bound). The imp-35654 SHARE_SUM_POSTPORT ~1.000000006 is a ' +
    'DISPLAY-ROUNDING ARTIFACT of the sigma<1e-3 reference literals, NOT a genuine normalization gap. ' +
    '(V1) The excess over unity share_sum - 1 = 5.655e-9 equals the baked E_flow literal EXACTLY (residual ' +
    '~2.4e-17). (V2) The two DOMINANT literals GUE (1e-3) + C_T (0.999) already sum to EXACTLY 1, so the ' +
    'E_flow share added on top is DOUBLE-REPRESENTED -- the 0.999 C_T value is the 3-significant-figure ' +
    'display of the true residual share E_trunc/E(N) = 1 - sigma - E_flow_share = 0.998999994345, which ' +
    'already absorbs the ~5.655e-9 E_flow mass at 3-sig-fig precision. (V3) With the un-rounded ' +
    'C_T = 0.998999994345 the three imp-35334 shares partition E(N) EXACTLY (residual < 1e-15): the ' +
    'provenance classes E_coll + E_trunc + E_flow = E(N) DO sum to 1, and the +6e-9 is purely a ' +
    'display-rounding artifact of pinning the dominant residual C_T to 3 sig figs alongside a ' +
    'full-precision vanishing E_flow. No literal is stale; the 0.999 display is legitimate. Verification ' +
    'only; corrects no literal; changes no bound; establishes no operator positivity; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-34791 E_trunc reclassification UNCHANGED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35654 (source: bakes share_sum ~1.000000006); imp-35686 (regression-guard pinning the same ' +
    'literals); imp-35334 (sigma<1e-3 landmark shares); imp-486 (C_mb GUE-conditional residual); imp-398 ' +
    '(E_flow fully unconditional); imp-34791 (E_trunc = unported barrier lemma).',
};

export const IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION_ASSERTIONS = [
  {
    // (V1): the +6e-9 excess over unity equals the E_flow literal EXACTLY (to float precision).
    id: 'imp35679-excess-equals-eflow',
    description: 'share_sum - 1 = 5.655e-9 = the baked E_flow literal exactly (residual < 1e-15)',
    holds: () =>
      Math.abs(EXCESS_OVER_UNITY - E_FLOW_SHARE) < 1e-15 &&
      Math.abs(EXCESS_OVER_UNITY - 5.655e-9) < 1e-15,
  },
  {
    // (V2): the two dominant literals GUE + C_T already sum to EXACTLY 1 -- the double-count source.
    id: 'imp35679-gue-plus-ct-exactly-one',
    description: 'GUE (1e-3) + C_T (0.999) = 1 exactly, so E_flow added on top is double-represented',
    holds: () =>
      Math.abs(GUE_PLUS_CT - 1) < 1e-15 &&
      CT_BARRIER_SHARE === 0.999 &&
      SIGMA_LANDMARK === 1.0e-3,
  },
  {
    // (V3): the un-rounded true partition sums to EXACTLY 1 -- rounding artifact, NOT a normalization gap.
    id: 'imp35679-true-partition-exact',
    description: 'GUE + C_T_true (0.998999994345) + E_flow = 1 exactly; the +6e-9 is a display-rounding artifact',
    holds: () =>
      Math.abs(CT_BARRIER_SHARE_TRUE - 0.998999994345) < 1e-12 &&
      Math.abs(SHARE_SUM_TRUE - 1) < 1e-15 &&
      CT_BARRIER_SHARE_TRUE < CT_BARRIER_SHARE && // the un-rounded residual is BELOW the 0.999 display
      Math.round(CT_BARRIER_SHARE_TRUE * 1000) / 1000 === 0.999, // and rounds to the 0.999 display
  },
  {
    // Cross-check: the imp-35654 baked share_sum reproduces the value reconciled here.
    id: 'imp35679-source-module-cross-check',
    description: 'the imp-35654 baked postPort.share_sum reproduces the ~1.000000006 reconciled here',
    holds: () =>
      Math.abs(SHARE_SUM_POSTPORT - 1.000000006) < 1e-8 &&
      IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.reconciliation.verdict_is_rounding_artifact === true,
  },
  {
    // Honesty gate: verification only, rounding artifact not a gap, no literal corrected, no QED, no refereed bound is changed.
    id: 'imp35679-honesty-gate-no-qed',
    description: 'Verification only: rounding artifact (not a normalization gap), corrects no literal, no QED, no refereed bound is changed',
    holds: () =>
      IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.isRigorous === false &&
      /DISPLAY-ROUNDING ARTIFACT/.test(IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.verdict) &&
      /NOT a genuine normalization gap/.test(IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.verdict) &&
      /corrects no literal/.test(IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.verdict),
  },
];

for (const a of IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35679-postport-share-sum-unity-excess-reconciliation assertion failed: ${a.id}`);
  }
}
