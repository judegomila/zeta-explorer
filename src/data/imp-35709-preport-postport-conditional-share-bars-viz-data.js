/**
 * @module imp-35709-preport-postport-conditional-share-bars-viz-data
 * @fileoverview imp-35709 -- VIZ DATA ONLY for the imp-35654 pre-port-vs-post-port
 *   conditional-share bars at the imp-35334 sigma < 1e-3 landmark (N ~ 5.432e15):
 *   PRE-PORT the far-tail bridge splits into THREE provenance classes
 *   (GUE-conditional / C_T-barrier-conditional / fully-unconditional); POST-PORT
 *   the S_barrier port folds the C_T-barrier class into the unconditional bucket,
 *   COLLAPSING the picture to TWO classes (unconditional 1-sigma / GUE-conditional
 *   sigma). No page rendered this three-vs-two bar comparison before this ticket.
 *
 *   Re-exports the imp-35654 baked landmark and mixed-conditionality fields
 *   verbatim (that module is import-light: pure Math, no heavy dependency, never
 *   the 16.7MB zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35654-ported-barrier-far-tail-mixed-conditionality.js (the assessment this re-exports)
 *   @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality.js (pre-port landmark shares)
 *
 *   Ticket: imp-35709 (ux, medium). Presentation only of an already-established
 *   assessment; adds no new Lambda bound. NO QED. No refereed bound is changed.
 */

import { IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY } from './imp-35654-ported-barrier-far-tail-mixed-conditionality.js';

const M = IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY;

export const IMP35709_PRE_PORT_BARS = [
  { label: 'GUE-conditional (E_coll)', provenance: 'gue', share: M.mixedConditionality.prePort.GUE_conditional_share },
  { label: 'C_T-barrier (E_trunc)', provenance: 'ct-barrier', share: M.mixedConditionality.prePort.C_T_barrier_share },
  { label: 'Unconditional (E_flow)', provenance: 'unconditional', share: M.mixedConditionality.prePort.unconditional_share },
];

export const IMP35709_POST_PORT_BARS = [
  { label: 'Unconditional (E_trunc + E_flow)', provenance: 'unconditional', share: M.mixedConditionality.postPort.unconditional_share },
  { label: 'GUE-conditional (E_coll)', provenance: 'gue', share: M.mixedConditionality.postPort.residual_GUE_conditional_share },
];

export const IMP35709_SUMMARY = Object.freeze({
  landmarkN: 5.432e15,
  sigma: M.bakedLandmark.sigma,
  prePortClassCount: M.mixedConditionality.prePort.classes,
  postPortClassCount: M.mixedConditionality.postPort.classes,
  prePortDominantShare: M.mixedConditionality.prePort.C_T_barrier_share,
  postPortDominantShare: M.mixedConditionality.postPort.unconditional_share,
});

export default Object.freeze({
  id: 'imp-35709-preport-postport-conditional-share-bars-viz-data',
  ticket: 'imp-35709',
  sources: ['imp-35654-ported-barrier-far-tail-mixed-conditionality.js'],
  prePortBars: IMP35709_PRE_PORT_BARS,
  postPortBars: IMP35709_POST_PORT_BARS,
  summary: IMP35709_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35709_ASSERTIONS = [
  {
    id: 'imp35709-three-bars-collapse-to-two',
    holds: () => IMP35709_PRE_PORT_BARS.length === 3 && IMP35709_POST_PORT_BARS.length === 2,
    why: 'The pre-port picture must show three provenance classes collapsing to two post-port, matching imp-35654 F2.',
  },
  {
    id: 'imp35709-preport-shares-sum-to-one',
    holds: () =>
      Math.abs(IMP35709_PRE_PORT_BARS.reduce((s, b) => s + b.share, 0) - 1) < 1e-6,
    why: 'The three pre-port shares (GUE + C_T-barrier + unconditional) must sum to 1.',
  },
  {
    id: 'imp35709-postport-shares-sum-to-one',
    holds: () =>
      Math.abs(IMP35709_POST_PORT_BARS.reduce((s, b) => s + b.share, 0) - 1) < 1e-6,
    why: 'The two post-port shares (unconditional + GUE-conditional) must sum to 1 (baked imp-35334 literals).',
  },
  {
    id: 'imp35709-ct-barrier-folds-into-unconditional',
    holds: () =>
      Math.abs(
        IMP35709_POST_PORT_BARS[0].share -
          (IMP35709_PRE_PORT_BARS[1].share + IMP35709_PRE_PORT_BARS[2].share),
      ) < 1e-9,
    why: 'Post-port unconditional share must equal the sum of the pre-port C_T-barrier and unconditional shares.',
  },
  {
    id: 'imp35709-gue-share-unchanged-by-port',
    holds: () => IMP35709_PRE_PORT_BARS[0].share === IMP35709_POST_PORT_BARS[1].share,
    why: 'The GUE-conditional share (sigma) is untouched by the port -- it is the sole surviving conditional class.',
  },
];

for (const assertion of IMP35709_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35709-preport-postport-conditional-share-bars-viz-data assertion failed: ${assertion.id}`);
  }
}
