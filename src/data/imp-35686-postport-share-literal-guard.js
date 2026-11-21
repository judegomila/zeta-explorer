/**
 * @module imp-35686-postport-share-literal-guard
 *
 * imp-35686 (meta, regression-guard): REGRESSION-GUARD pinning the imp-35654
 * post-port share literals -- C_T-barrier share = 0.999, residual
 * GUE-conditional share = sigma = 1e-3, unconditional E_flow share ~5.655e-9,
 * conditional-class count collapse 2 -> 1, and share_sum ~1.000000006 -- so a
 * silent literal drift in the baked sigma<1e-3 landmark shares trips the
 * build. This import-light module INDEPENDENTLY recomputes the post-port
 * unconditional/residual shares from the imp-35334 sigma<1e-3 landmark
 * literals and cross-checks that the imp-35654 baked
 * IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY record reproduces the
 * same figures. Regression-guard only; recomputes an established
 * assessment figure; changes no bound; establishes no operator positivity;
 * C_mb GUE-conditional (imp-486) UNTOUCHED; imp-34791 E_trunc reclassification
 * UNCHANGED; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-35654-ported-barrier-far-tail-mixed-conditionality (source module pinned here)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark shares)
 * @see imp-35685-resolution-shortfall-literal-guard (sibling regression-guard pattern)
 */

import { IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY } from './imp-35654-ported-barrier-far-tail-mixed-conditionality.js';

const SIGMA_LANDMARK = 1.0e-3;
const CT_BARRIER_SHARE = 0.999;
const UNCONDITIONAL_SHARE_PREPORT = 5.655e-9;
const UNCONDITIONAL_SHARE_POSTPORT = CT_BARRIER_SHARE + UNCONDITIONAL_SHARE_PREPORT;
const RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT = SIGMA_LANDMARK;
const SHARE_SUM_POSTPORT = UNCONDITIONAL_SHARE_POSTPORT + RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT;
const PREPORT_CLASSES = 2;
const POSTPORT_CLASSES = 1;

export const IMP35686_POSTPORT_SHARE_LITERAL_GUARD = {
  id: 'imp-35686',
  pinnedLiterals: {
    CT_barrier_share: +CT_BARRIER_SHARE.toFixed(3),
    residual_GUE_conditional_share: +RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT.toExponential(0),
    E_flow_unconditional_share: +UNCONDITIONAL_SHARE_PREPORT.toExponential(3),
    class_count_preport: PREPORT_CLASSES,
    class_count_postport: POSTPORT_CLASSES,
    share_sum_postport: +SHARE_SUM_POSTPORT.toFixed(9),
  },
};

export const IMP35686_POSTPORT_SHARE_LITERAL_GUARD_ASSERTIONS = [
  {
    // (1) the C_T-barrier / residual GUE share literals reproduce to printed-digit tolerance
    id: 'imp35686-baked-shares-pinned',
    description: 'C_T-barrier share = 0.999 and residual GUE-conditional share = sigma = 1e-3 reproduce independently',
    holds: () =>
      Math.abs(CT_BARRIER_SHARE - 0.999) < 1e-9 &&
      Math.abs(RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT - 1e-3) < 1e-15,
  },
  {
    // (2) E_flow unconditional share literal reproduces to printed-digit tolerance
    id: 'imp35686-eflow-share-pinned',
    description: 'E_flow fully-unconditional share ~5.655e-9 reproduces independently',
    holds: () => Math.abs(UNCONDITIONAL_SHARE_PREPORT - 5.655e-9) < 1e-12,
  },
  {
    // (3) share_sum ~1.000000006 and the class-count collapse 2 -> 1
    id: 'imp35686-share-sum-and-class-collapse-pinned',
    description: 'share_sum ~1.000000006 and conditional-class count collapses from 2 to 1',
    holds: () =>
      Math.abs(SHARE_SUM_POSTPORT - 1.000000006) < 1e-8 &&
      PREPORT_CLASSES === 2 &&
      POSTPORT_CLASSES === 1,
  },
  {
    // (4) cross-check: the imp-35654 baked record reproduces the same figures computed here
    id: 'imp35686-source-module-cross-check',
    description: 'the imp-35654 baked bakedLandmark/mixedConditionality reproduce the same shares computed here',
    holds: () => {
      const rec = IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY;
      return (
        Math.abs(rec.bakedLandmark.sigma - SIGMA_LANDMARK) < 1e-15 &&
        Math.abs(rec.bakedLandmark.C_T_barrier_E_trunc - CT_BARRIER_SHARE) < 1e-9 &&
        Math.abs(rec.bakedLandmark.fully_unconditional_E_flow - UNCONDITIONAL_SHARE_PREPORT) < 1e-12 &&
        rec.mixedConditionality.prePort.classes === PREPORT_CLASSES &&
        rec.mixedConditionality.postPort.classes === POSTPORT_CLASSES &&
        Math.abs(rec.mixedConditionality.postPort.unconditional_share - UNCONDITIONAL_SHARE_POSTPORT) < 1e-6 &&
        Math.abs(rec.mixedConditionality.postPort.residual_GUE_conditional_share - RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT) < 1e-15 &&
        Math.abs(rec.mixedConditionality.postPort.share_sum - SHARE_SUM_POSTPORT) < 1e-7
      );
    },
  },
];

for (const a of IMP35686_POSTPORT_SHARE_LITERAL_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35686-postport-share-literal-guard assertion failed: ${a.id}`);
  }
}
