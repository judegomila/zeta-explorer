/**
 * @module imp-124842-pairratio-reldiff-ecf-roundoff-law-viz-data
 *
 * imp-124842 (ux): import-light viz-data leaf plus routed page charting the imp-124811
 * |reldiff|-vs-|E_CF| round-off law -- the log-log scatter of the pair-ratio cross-check
 * |reldiff| against the measured |E_CF| across landmarks L2..L7 (slope ~ -1, the predicted
 * inverse-|E_CF| round-off law), and the flat invariant product P = |reldiff|*|E_CF| that
 * discriminates pure precision loss from a genuine identity drift. Reuses the frozen
 * IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.ladder/fit rows verbatim (no re-derivation,
 * no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law.js (source module)
 * @see imp-124815-pairratio-ladder-viz-data.js (sibling leaf: measured vs analytic ratio series)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the |E_CF| round-off floor driving the law)
 */

import { IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW } from './imp-124811-pairratio-reldiff-ecf-roundoff-law.js';

const ROWS = IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.ladder;
const FIT = IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.fit;

// One row per landmark: |E_CF|, |reldiff|, and the round-off invariant product P.
export const IMP124842_ROUNDOFF_LAW_ROWS = Object.freeze(
  ROWS.map((r) => Object.freeze({
    key: r.key,
    sigma: r.sigma,
    absE_CF: r.absE_CF,
    absReldiff: r.absReldiff,
    product: r.product_reldiff_times_absECF,
  })),
);

export const IMP124842_SUMMARY = Object.freeze({
  law:
    `A log-log regression of |reldiff| against |E_CF| over ${ROWS.length} landmarks has slope `
    + `${FIT.loglog_slope_reldiff_vs_absECF} (predicted ${FIT.predicted_slope}), confirming `
    + '|reldiff| ~ R/|E_CF| across eight decades of |E_CF| while the invariant product '
    + `P = |reldiff|*|E_CF| stays flat within a factor ${FIT.product_max_over_min} `
    + `(geomean R ~ ${FIT.R_floor_geomean_product}), not decreasing down the ladder.`,
  reading:
    `landmarks: ${IMP124842_ROUNDOFF_LAW_ROWS.map((r) => r.key).join(', ')}; `
    + `|E_CF|: ${IMP124842_ROUNDOFF_LAW_ROWS.map((r) => r.absE_CF.toExponential(2)).join(', ')}; `
    + `|reldiff|: ${IMP124842_ROUNDOFF_LAW_ROWS.map((r) => r.absReldiff.toExponential(2)).join(', ')}; `
    + `P = |reldiff|*|E_CF|: ${IMP124842_ROUNDOFF_LAW_ROWS.map((r) => r.product.toExponential(2)).join(', ')}.`,
  verdict:
    'Presentation only: every ladder row and fit statistic is reused verbatim from imp-124811 (a '
    + 'measurement, not a derivation); no new computation. The flat invariant product shows no '
    + '|E_CF|-proportional identity-drift signature -- the |reldiff| growth down the ladder is pure '
    + 'round-off precision loss as |E_CF| collapses, not a deviation from the imp-97665 EXACT '
    + 'pair-ratio identity. Measurement / sensitivity only on the inherited imp-3220/imp-3406 '
    + 'extrapolation surrogate, not a rigorous asymptotic. Changes no bound; establishes no operator '
    + 'positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124842_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124842-six-rows',
    description: 'one chart row per landmark L2..L7',
    holds: () => IMP124842_ROUNDOFF_LAW_ROWS.length === 6,
  },
  {
    id: 'imp124842-ecf-collapses-monotone',
    description: '|E_CF| strictly decreases down the ladder L2 -> L7',
    holds: () =>
      IMP124842_ROUNDOFF_LAW_ROWS.every(
        (row, i) => i === 0 || row.absE_CF < IMP124842_ROUNDOFF_LAW_ROWS[i - 1].absE_CF,
      ),
  },
  {
    id: 'imp124842-reldiff-grows-monotone',
    description: '|reldiff| strictly increases down the ladder L2 -> L7 as |E_CF| collapses',
    holds: () =>
      IMP124842_ROUNDOFF_LAW_ROWS.every(
        (row, i) => i === 0 || row.absReldiff > IMP124842_ROUNDOFF_LAW_ROWS[i - 1].absReldiff,
      ),
  },
  {
    id: 'imp124842-slope-near-minus-one',
    description: 'the fitted log-log slope lies within 15% of the predicted -1',
    holds: () => Math.abs(FIT.loglog_slope_reldiff_vs_absECF - FIT.predicted_slope) < 0.15,
  },
  {
    id: 'imp124842-product-bounded-no-collapse',
    description: 'the invariant product P stays positive and within a factor 20 across the ladder (no deep-tail collapse)',
    holds: () =>
      IMP124842_ROUNDOFF_LAW_ROWS.every((r) => r.product > 0)
      && FIT.product_max_over_min < 20
      && IMP124842_ROUNDOFF_LAW_ROWS[5].product >= IMP124842_ROUNDOFF_LAW_ROWS[0].product,
  },
  {
    id: 'imp124842-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124842_SUMMARY.verdict) && /NO QED/.test(IMP124842_SUMMARY.verdict),
  },
];

for (const assertion of IMP124842_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124842 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124842_SUMMARY;
