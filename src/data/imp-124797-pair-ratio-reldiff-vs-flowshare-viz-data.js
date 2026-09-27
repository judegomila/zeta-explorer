/**
 * @module imp-124797-pair-ratio-reldiff-vs-flowshare-viz-data
 *
 * imp-124797: import-light viz-data leaf charting the imp-124770 pair-ratio identity cross-check
 * |reldiff| growing monotonically down the L2..L7 landmark ladder against the collapsing flow
 * share E_flow/E_N. Reuses the frozen IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder rows
 * verbatim (no re-derivation, no new computation) for a "|reldiff| vs flow share" log-log chart.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124770-pair-ratio-identity-landmark-ladder.js (source module)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the |E_CF| round-off floor driving the growth)
 */

import { IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER } from './imp-124770-pair-ratio-identity-landmark-ladder.js';

const ROWS = IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder;

// One chart row per landmark: |reldiff| growing as the flow share collapses down the ladder.
export const IMP124797_RELDIFF_VS_FLOWSHARE = Object.freeze(
  ROWS.map((r) => Object.freeze({
    key: r.key,
    label: r.label,
    sigma: r.sigma,
    flow_share: r.flow_share,
    abs_reldiff: Math.abs(r.reldiff),
  })),
);

export const IMP124797_SUMMARY = Object.freeze({
  law:
    'The imp-124770 pair-ratio identity cross-check |reldiff| grows monotonically down the landmark ladder '
    + `${ROWS.map((r) => r.key).join(' -> ')} as the flow share E_flow/E_N collapses `
    + `${ROWS[0].flow_share} -> ${ROWS[ROWS.length - 1].flow_share}, running |reldiff| `
    + `${IMP124797_RELDIFF_VS_FLOWSHARE.map((r) => r.abs_reldiff).join(' -> ')}.`,
  reading:
    `landmarks: ${IMP124797_RELDIFF_VS_FLOWSHARE.map((r) => r.key).join(', ')}; `
    + `flow share: ${IMP124797_RELDIFF_VS_FLOWSHARE.map((r) => r.flow_share).join(' -> ')}; `
    + `|reldiff|: ${IMP124797_RELDIFF_VS_FLOWSHARE.map((r) => r.abs_reldiff).join(' -> ')}.`,
  verdict:
    'Presentation only: every row is reused verbatim from imp-124770 (a measurement, not a derivation), '
    + 'relabeled for a "|reldiff| vs flow share" log-log chart. The growth is a stencil / round-off artefact '
    + 'tracking the collapse of |E_CF| into the landmark-bisection round-off floor (imp-124769), NOT a '
    + 'deviation from the imp-97665 exact pair-ratio identity. No new computation. Measurement / sensitivity '
    + 'only on the inherited imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic. Changes no '
    + 'bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124797_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124797-six-rows',
    description: 'one chart row per landmark L2..L7',
    holds: () => IMP124797_RELDIFF_VS_FLOWSHARE.length === 6,
  },
  {
    id: 'imp124797-flow-share-collapses-monotone',
    description: 'flow share E_flow/E_N strictly decreases down the ladder L2 -> L7',
    holds: () =>
      IMP124797_RELDIFF_VS_FLOWSHARE.every(
        (row, i) => i === 0 || row.flow_share < IMP124797_RELDIFF_VS_FLOWSHARE[i - 1].flow_share,
      ),
  },
  {
    id: 'imp124797-abs-reldiff-grows-monotone',
    description: '|reldiff| strictly increases down the ladder L2 -> L7 as the flow share collapses',
    holds: () =>
      IMP124797_RELDIFF_VS_FLOWSHARE.every(
        (row, i) => i === 0 || row.abs_reldiff > IMP124797_RELDIFF_VS_FLOWSHARE[i - 1].abs_reldiff,
      ),
  },
  {
    id: 'imp124797-spans-eight-decades',
    description: '|reldiff| spans from < 1e-11 at L2 up to > 1e-4 at L7',
    holds: () =>
      IMP124797_RELDIFF_VS_FLOWSHARE[0].abs_reldiff < 1e-11
      && IMP124797_RELDIFF_VS_FLOWSHARE[5].abs_reldiff > 1e-4,
  },
  {
    id: 'imp124797-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124797_SUMMARY.verdict) && /NO QED/.test(IMP124797_SUMMARY.verdict),
  },
];

for (const assertion of IMP124797_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124797 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124797_SUMMARY;
