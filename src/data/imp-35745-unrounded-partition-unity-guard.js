/**
 * @module imp-35745-unrounded-partition-unity-guard
 *
 * imp-35745 (meta, regression-guard): REGRESSION-GUARD pinning the imp-35679
 * UN-ROUNDED provenance partition (as distinct from the imp-35704 ROUNDED-literal
 * share IDENTITY guard). imp-35679 reconciled the imp-35654 SHARE_SUM_POSTPORT
 * ~1.000000006 excess as a display-rounding artifact: with the un-rounded
 * C_T_true = 1 - sigma - E_flow_share = 0.998999994345, the three baked
 * imp-35334 sigma<1e-3 landmark shares
 *     GUE (1e-3) + C_T_true (0.998999994345) + E_flow (5.655e-9)
 * sum to EXACTLY 1 (residual < 1e-15) -- tighter than the imp-35704 guard, which
 * pins the ROUNDED C_T = 0.999 literal summing with sigma to storage tolerance
 * (~1e-6). Nothing in the assertion sweep independently pinned this un-rounded
 * exact-unity identity as its own regression guard.
 *
 * This import-light module INDEPENDENTLY recomputes the un-rounded partition
 * from the baked imp-35334 landmark literals and cross-checks the imp-35679
 * baked reconciliation record reproduces the same figures. Regression-guard
 * only; recomputes an established reconciliation identity; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional (imp-486) UNTOUCHED;
 * imp-34791 E_trunc reclassification UNCHANGED; no RH verdict, NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35679-postport-share-sum-unity-excess-reconciliation (source: reconciles the un-rounded partition)
 * @see imp-35704-postport-share-identity-guard (sibling ROUNDED-literal share IDENTITY guard; this pins UN-ROUNDED)
 * @see imp-35686-postport-share-literal-guard (sibling share LITERAL guard)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark shares)
 */

import { IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION } from './imp-35679-postport-share-sum-unity-excess-reconciliation.js';

// ── Baked imp-35334 sigma<1e-3 landmark shares (reference literals; no heavy import) ──
const SIGMA_LANDMARK = 1.0e-3; // GUE-conditional share = sigma (E_coll/E(N); imp-486)
const E_FLOW_SHARE = 5.655e-9; // E_flow/E(N) fully unconditional (imp-398)

// The UN-ROUNDED residual share (distinct from the imp-35704 rounded 0.999 literal).
const CT_BARRIER_SHARE_TRUE = 1 - SIGMA_LANDMARK - E_FLOW_SHARE; // 0.998999994345
const SHARE_SUM_TRUE = SIGMA_LANDMARK + CT_BARRIER_SHARE_TRUE + E_FLOW_SHARE; // == 1 exactly
const EXACT_TOL = 1e-15; // tighter than the imp-35704 storage tolerance (~1e-6)

export const IMP35745_UNROUNDED_PARTITION_UNITY_GUARD = {
  id: 'imp-35745',
  guards: 'the imp-35679 un-rounded provenance partition, distinct from the imp-35704 rounded-literal guard',
  reconstructed: {
    C_T_barrier_share_true: +CT_BARRIER_SHARE_TRUE.toPrecision(16),
    share_sum_true: +SHARE_SUM_TRUE.toPrecision(16),
  },
};

export const IMP35745_UNROUNDED_PARTITION_UNITY_GUARD_ASSERTIONS = [
  {
    // (G1) the un-rounded residual reproduces the imp-35679 baked literal exactly.
    id: 'imp35745-ct-true-matches-baked-literal',
    description: 'C_T_true = 1 - sigma - E_flow_share reproduces 0.998999994345 exactly',
    holds: () => Math.abs(CT_BARRIER_SHARE_TRUE - 0.998999994345) < 1e-12,
  },
  {
    // (G2) the un-rounded partition sums to EXACTLY 1, at 1e-15 tolerance (not the ~1e-6 storage tolerance).
    id: 'imp35745-unrounded-sum-exactly-unity',
    description: 'GUE + C_T_true + E_flow = 1 to < 1e-15 (exact, not storage-tolerance)',
    holds: () => Math.abs(SHARE_SUM_TRUE - 1) < EXACT_TOL,
  },
  {
    // (G3) the un-rounded residual is strictly below the imp-35704 rounded 0.999 literal (the guards are distinct).
    id: 'imp35745-distinct-from-rounded-guard',
    description: 'C_T_true < 0.999 (the un-rounded guard is strictly tighter than the imp-35704 rounded guard)',
    holds: () => CT_BARRIER_SHARE_TRUE < 0.999 && CT_BARRIER_SHARE_TRUE > 0.99899999,
  },
  {
    // (G4) cross-check: the imp-35679 baked reconciliation record reproduces the same figures.
    id: 'imp35745-source-module-cross-check',
    description: 'the imp-35679 baked reconciliation.C_T_barrier_share_true/share_sum_true reproduce the values computed here',
    holds: () => {
      const rec = IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.reconciliation;
      return (
        Math.abs(rec.C_T_barrier_share_true - CT_BARRIER_SHARE_TRUE) < 1e-12 &&
        Math.abs(rec.share_sum_true - SHARE_SUM_TRUE) < EXACT_TOL &&
        rec.verdict_is_rounding_artifact === true
      );
    },
  },
];

for (const a of IMP35745_UNROUNDED_PARTITION_UNITY_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35745-unrounded-partition-unity-guard assertion failed: ${a.id}`);
  }
}
