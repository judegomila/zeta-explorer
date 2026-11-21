/**
 * @module imp-124815-pairratio-ladder-viz-data
 *
 * imp-124815 (ux): import-light viz-data leaf plus routed page charting the imp-124770 pair-ratio
 * identity ladder -- the measured 5-point E_CF/E_ET against the analytic E_flow/E_trunc, and the
 * |reldiff| between them, at every landmark L2..L7 as the flow share E_flow/E_N collapses toward
 * the far tail. Reuses the frozen IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder rows
 * verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124770-pair-ratio-identity-landmark-ladder.js (source module)
 * @see imp-124797-pair-ratio-reldiff-vs-flowshare-viz-data.js (sibling leaf: |reldiff| vs flow share only)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the |E_CF| round-off floor driving the growth)
 */

import { IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER } from './imp-124770-pair-ratio-identity-landmark-ladder.js';

const ROWS = IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder;

// One row per landmark: the two ratio series (measured vs analytic target) plus |reldiff| between them.
export const IMP124815_PAIR_RATIO_LADDER_ROWS = Object.freeze(
  ROWS.map((r) => Object.freeze({
    key: r.key,
    label: r.label,
    sigma: r.sigma,
    N_L: r.N_L,
    flow_share: r.flow_share,
    measured_ECF_over_EET: r.measured_ECF_over_EET,
    target_Eflow_over_Etrunc: r.target_Eflow_over_Etrunc,
    abs_reldiff: Math.abs(r.reldiff),
  })),
);

export const IMP124815_SUMMARY = Object.freeze({
  law:
    'At every landmark L2..L7 the measured 5-point E_CF/E_ET tracks the analytic E_flow/E_trunc '
    + `target closely (the two series ${ROWS.map((r) => r.key).join(', ')} run visually on top of `
    + 'each other on a log scale), while |reldiff| between them grows monotonically '
    + `${IMP124815_PAIR_RATIO_LADDER_ROWS.map((r) => r.abs_reldiff).join(' -> ')} as the flow share `
    + `E_flow/E_N collapses ${ROWS[0].flow_share} -> ${ROWS[ROWS.length - 1].flow_share}.`,
  reading:
    `landmarks: ${IMP124815_PAIR_RATIO_LADDER_ROWS.map((r) => r.key).join(', ')}; `
    + `measured E_CF/E_ET: ${IMP124815_PAIR_RATIO_LADDER_ROWS.map((r) => r.measured_ECF_over_EET).join(', ')}; `
    + `target E_flow/E_trunc: ${IMP124815_PAIR_RATIO_LADDER_ROWS.map((r) => r.target_Eflow_over_Etrunc).join(', ')}; `
    + `|reldiff|: ${IMP124815_PAIR_RATIO_LADDER_ROWS.map((r) => r.abs_reldiff).join(' -> ')}.`,
  verdict:
    'Presentation only: every row is reused verbatim from imp-124770 (a measurement, not a '
    + 'derivation); no new computation. The identity itself stays EXACT at every rung (the imp-97665 '
    + 'common-factor cancellation is flow-share-independent); the growing |reldiff| is a stencil / '
    + 'round-off artefact tracking the collapse of |E_CF| into the landmark-bisection round-off floor '
    + '(imp-124769), not a deviation from the identity. Measurement / sensitivity only on the inherited '
    + 'imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic. Changes no bound; '
    + 'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124815_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124815-six-rows',
    description: 'one chart row per landmark L2..L7',
    holds: () => IMP124815_PAIR_RATIO_LADDER_ROWS.length === 6,
  },
  {
    id: 'imp124815-flow-share-collapses-monotone',
    description: 'flow share E_flow/E_N strictly decreases down the ladder L2 -> L7',
    holds: () =>
      IMP124815_PAIR_RATIO_LADDER_ROWS.every(
        (row, i) => i === 0 || row.flow_share < IMP124815_PAIR_RATIO_LADDER_ROWS[i - 1].flow_share,
      ),
  },
  {
    id: 'imp124815-abs-reldiff-grows-monotone',
    description: '|reldiff| strictly increases down the ladder L2 -> L7 as the flow share collapses',
    holds: () =>
      IMP124815_PAIR_RATIO_LADDER_ROWS.every(
        (row, i) => i === 0 || row.abs_reldiff > IMP124815_PAIR_RATIO_LADDER_ROWS[i - 1].abs_reldiff,
      ),
  },
  {
    id: 'imp124815-both-series-positive-and-close',
    description: 'measured and target ratio series are both positive and agree to < 1e-3 relative at every rung',
    holds: () =>
      IMP124815_PAIR_RATIO_LADDER_ROWS.every((r) => r.measured_ECF_over_EET > 0 && r.target_Eflow_over_Etrunc > 0)
      && IMP124815_PAIR_RATIO_LADDER_ROWS.every((r) => r.abs_reldiff < 1e-3),
  },
  {
    id: 'imp124815-spans-eight-decades',
    description: '|reldiff| spans from < 1e-11 at L2 up to > 1e-4 at L7',
    holds: () =>
      IMP124815_PAIR_RATIO_LADDER_ROWS[0].abs_reldiff < 1e-11
      && IMP124815_PAIR_RATIO_LADDER_ROWS[5].abs_reldiff > 1e-4,
  },
  {
    id: 'imp124815-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124815_SUMMARY.verdict) && /NO QED/.test(IMP124815_SUMMARY.verdict),
  },
];

for (const assertion of IMP124815_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124815 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124815_SUMMARY;
