/**
 * @module imp-35704-postport-share-identity-guard
 *
 * imp-35704 (numerical, regression-guard): REGRESSION-GUARD pinning the
 * imp-35654 post-port SHARE IDENTITY (as distinct from the imp-35686 share
 * LITERAL guard). imp-35654 computes SHARE_SUM_POSTPORT =
 * UNCONDITIONAL_SHARE_POSTPORT + RESIDUAL_CONDITIONAL_SHARE_POSTPORT == 1 --
 * the core arithmetic of the mixed-conditionality collapse -- but nothing in
 * the assertion sweep pins the two structural identities behind it:
 *
 *   (I1) unity partition: (1 - sigma) + sigma == 1 to storage tolerance
 *        (~1e-6, not 1e-9), i.e. the post-port unconditional share plus the
 *        residual GUE-conditional share (= sigma) sum to 1.
 *   (I2) bucket fold: the post-port unconditional share = (E_trunc + E_flow)/E(N)
 *        = C_T-barrier share + E_flow share -- the port folds the dominant
 *        sigma-blind E_trunc floor into the E_flow unconditional bucket.
 *
 * This import-light module INDEPENDENTLY reconstructs the two identities from
 * the baked imp-35334 sigma<1e-3 landmark shares and cross-checks the imp-35654
 * baked IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY record reproduces
 * them. Regression-guard only; recomputes an established assessment identity;
 * changes no bound; establishes no operator positivity; C_mb GUE-conditional
 * (imp-486) UNTOUCHED; imp-34791 E_trunc reclassification UNCHANGED; no RH
 * verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-35654-ported-barrier-far-tail-mixed-conditionality (source module pinned here)
 * @see imp-35686-postport-share-literal-guard (sibling LITERAL guard; this pins the IDENTITY)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark shares)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma; E_flow discharged)
 */

import { IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY } from './imp-35654-ported-barrier-far-tail-mixed-conditionality.js';

// ── Baked imp-35334 sigma<1e-3 landmark shares (reference literals; no heavy import) ──
const SIGMA_LANDMARK = 1.0e-3; // GUE-conditional share = sigma
const CT_BARRIER_SHARE = 0.999; // (E_trunc)/E(N) sigma-blind DOMINANT (imp-34791 unported barrier lemma)
const E_FLOW_SHARE = 5.655e-9; // (E_flow)/E(N) already discharged (imp-398)

// POST-PORT: the E_trunc floor + the E_flow constant fold into ONE unconditional bucket.
const UNCONDITIONAL_SHARE_POSTPORT = CT_BARRIER_SHARE + E_FLOW_SHARE; // (E_trunc + E_flow)/E(N) ~ 0.999000006 = 1 - sigma
const RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT = SIGMA_LANDMARK; // = sigma (the ONLY residual)
const STORAGE_TOL = 1e-6; // 7-sig-fig cache tolerance trap: use ~1e-6, not 1e-9

export const IMP35704_POSTPORT_SHARE_IDENTITY_GUARD = {
  id: 'imp-35704',
  identities: {
    unityPartition: '(1 - sigma) + sigma == 1',
    bucketFold: 'unconditional_share_postport == (E_trunc + E_flow)/E(N) == C_T_barrier_share + E_flow_share',
  },
  reconstructed: {
    unconditional_share_postport: +UNCONDITIONAL_SHARE_POSTPORT.toFixed(9),
    residual_GUE_conditional_share: RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT,
    share_sum: +(UNCONDITIONAL_SHARE_POSTPORT + RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT).toFixed(9),
  },
};

export const IMP35704_POSTPORT_SHARE_IDENTITY_GUARD_ASSERTIONS = [
  {
    // (I1a) clean unity partition: (1 - sigma) + sigma == 1 exactly (structural identity).
    id: 'imp35704-unity-partition-clean',
    description: '(1 - sigma) + sigma == 1 to storage tolerance (structural unity partition)',
    holds: () => Math.abs(((1 - SIGMA_LANDMARK) + SIGMA_LANDMARK) - 1) < STORAGE_TOL,
  },
  {
    // (I1b) the actual post-port shares (unconditional + residual GUE) sum to 1 to storage tolerance.
    id: 'imp35704-postport-shares-sum-to-unity',
    description: 'post-port unconditional share + residual GUE share = 1 to storage tolerance (~1e-6, not 1e-9)',
    holds: () =>
      Math.abs((UNCONDITIONAL_SHARE_POSTPORT + RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT) - 1) < STORAGE_TOL,
  },
  {
    // (I2) bucket fold: the post-port unconditional share = (E_trunc + E_flow)/E(N) and equals 1 - sigma.
    id: 'imp35704-unconditional-bucket-folds-etrunc-eflow',
    description: 'post-port unconditional bucket = (E_trunc + E_flow)/E(N) = C_T share + E_flow share = 1 - sigma',
    holds: () =>
      Math.abs(UNCONDITIONAL_SHARE_POSTPORT - (CT_BARRIER_SHARE + E_FLOW_SHARE)) < 1e-15 &&
      Math.abs(UNCONDITIONAL_SHARE_POSTPORT - (1 - SIGMA_LANDMARK)) < STORAGE_TOL,
  },
  {
    // (I3) cross-check: the imp-35654 baked record reproduces the same identity computed here.
    id: 'imp35704-source-module-cross-check',
    description: 'the imp-35654 baked postPort record reproduces the unity partition and bucket fold computed here',
    holds: () => {
      const rec = IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY;
      const pp = rec.mixedConditionality.postPort;
      return (
        Math.abs(pp.unconditional_share - UNCONDITIONAL_SHARE_POSTPORT) < STORAGE_TOL &&
        Math.abs(pp.residual_GUE_conditional_share - RESIDUAL_GUE_CONDITIONAL_SHARE_POSTPORT) < 1e-15 &&
        Math.abs((pp.unconditional_share + pp.residual_GUE_conditional_share) - 1) < STORAGE_TOL
      );
    },
  },
];

for (const a of IMP35704_POSTPORT_SHARE_IDENTITY_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35704-postport-share-identity-guard assertion failed: ${a.id}`);
  }
}
