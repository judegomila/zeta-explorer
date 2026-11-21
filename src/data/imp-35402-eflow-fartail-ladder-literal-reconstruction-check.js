/**
 * @module imp-35402-eflow-fartail-ladder-literal-reconstruction-check
 *
 * imp-35402 (meta, sonnet-4-6): applies the imp-35339-style literal-verification method
 * (recompute a stored table literal from its defining identity and confirm it reproduces to
 * the storage-precision convention) to the imp-35279/imp-35280 E_flow far-tail four-rung
 * ladder (N = 1e6, 1e9, 1e12, 1e16). Three checks, all read directly off the two modules'
 * own live exports (no re-derivation, no heavy zeros-bundle import):
 *
 *   (1) CROSS-MODULE AGREEMENT: imp-35279's closedFormRemnant column (a byproduct of the
 *       swap-gap decomposition) equals imp-35280's fdVsAnalyticGap column (the same quantity,
 *       measured as the PRIMARY object by an independently-written function) at every rung.
 *       RESULT: exact bit-for-bit agreement (diff 0) at all four rungs -- the two modules'
 *       imp-35237-style cross-check holds.
 *   (2) RECONSTRUCTION IDENTITY: imp-35280's fdVsAnalyticGap + inverseSwapGap reproduces its
 *       own analyticResidual at every rung. RESULT: holds to < 5e-4 (the tolerance the module's
 *       OWN assertion already uses), confirming the docstring table's stated sums.
 *   (3) SWAP-FRACTION RECOMPUTATION (the imp-35402 ticket's specific ask): does the imp-35279
 *       stored swapFraction column (0.786/0.648/0.600/0.568) equal stored inverseSwapGap /
 *       stored analyticResidual -- i.e. is it reproducible from its own ROUNDED sibling
 *       columns alone? RESULT: NO, not to tight tolerance -- recomputing the division from the
 *       4-decimal-rounded gap/residual pair gives 0.7815/0.6517/0.5938/0.5814, off by up to
 *       0.0134 (1.34%, at N = 1e16) from the stored 0.568. This is NOT a computation bug: the
 *       module computes swapFraction from the FULL-PRECISION pre-rounding gap/residual, not
 *       from its own already-rounded storage columns, so dividing two independently-rounded
 *       4-decimal numbers (especially the small ~0.004-0.012 denominators/numerators at the
 *       ladder's deep end) amplifies the +/-5e-5 rounding error to a percent-level swing. The
 *       honest reading: swapFraction is faithful to the LIVE computation (which this module
 *       confirms indirectly via the exact closedFormRemnant/fdVsAnalyticGap agreement in check
 *       (1)), but a reader who tries to reproduce it by dividing the PUBLISHED 4-decimal
 *       gap/residual literals will land up to ~1.3% off -- worth flagging so future literal
 *       audits of this table do not mistake the gap for a transcription error.
 *
 * MEASUREMENT / CONSISTENCY CHECK ONLY. Changes no bound; no re-derivation of the underlying
 * E_flow quantity; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35279-eflow-fartail-inverse-swap-ladder (swap-fraction column checked in (3))
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (reconstruction identity checked in (2))
 * @see imp-35339 (the literal-verification method template this ticket applies)
 */

import { IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER } from './imp-35279-eflow-fartail-inverse-swap-ladder.js';
import { IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP } from './imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap.js';

const RUNGS = IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.rungs;
const LADDER = IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.ladder;

export const IMP35402_EFLOW_FARTAIL_LADDER_LITERAL_CHECK_ASSERTIONS = [
  {
    // Check (1): the two modules' independently-measured remnant quantity agree exactly.
    id: 'imp35402-cross-module-remnant-agreement',
    description:
      'imp-35279 closedFormRemnant equals imp-35280 fdVsAnalyticGap (same quantity, two derivations) at every rung',
    holds: () =>
      RUNGS.every((r, i) => Math.abs(r.closedFormRemnant - LADDER[i].fdVsAnalyticGap) < 1e-9),
  },
  {
    // Check (2): the imp-35280 reconstruction identity holds at the module's own tolerance.
    id: 'imp35402-imp35280-reconstruction-identity-holds',
    description:
      'imp-35280 fdVsAnalyticGap + inverseSwapGap reproduces analyticResidual to <5e-4 at every rung',
    holds: () =>
      LADDER.every(
        (r) => Math.abs(r.fdVsAnalyticGap + r.inverseSwapGap - r.analyticResidual) < 5e-4,
      ),
  },
  {
    // Check (3): the swap fraction is NOT tightly reproducible from its own rounded siblings
    // alone (expected double-rounding amplification), but the deviation stays bounded.
    id: 'imp35402-swap-fraction-rounded-recompute-bounded-not-exact',
    description:
      'stored swapFraction vs (rounded inverseSwapGap / rounded analyticResidual) differs by up to ~1.5% -- a bounded, expected rounding-amplification artifact, not exact reproduction',
    holds: () =>
      RUNGS.every((r) => {
        const recomputedFromRoundedLiterals = r.inverseSwapGap / r.analyticResidual;
        const diff = Math.abs(recomputedFromRoundedLiterals - r.swapFraction);
        return diff < 0.015; // bounded (observed max ~0.0134 at N = 1e16)
      }) &&
      // and it is NOT vacuously tight -- confirms the artifact is real, not a mislabeled pass
      Math.abs(RUNGS[3].inverseSwapGap / RUNGS[3].analyticResidual - RUNGS[3].swapFraction) >
        1e-3,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35402-honesty-gate-no-derivation-change',
    description: 'both source modules stay isRigorous false with NO QED verdicts (unchanged by this audit)',
    holds: () =>
      IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.isRigorous === false &&
      IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.isRigorous === false &&
      /NO QED/.test(IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.verdict) &&
      /NO QED/.test(IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.verdict),
  },
];

for (const a of IMP35402_EFLOW_FARTAIL_LADDER_LITERAL_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35402-eflow-fartail-ladder-literal-reconstruction-check assertion failed: ${a.id}`,
    );
  }
}
