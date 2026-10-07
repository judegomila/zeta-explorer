/**
 * @module imp-124859-reldiff-vs-ecf-product-invariant-viz-data
 *
 * imp-124859: import-light viz-data leaf charting the imp-124811 invariant product
 * P = |reldiff| * |E_CF| staying flat across the L2..L7 landmark ladder against the
 * inverse-|E_CF| |reldiff| law. Reuses the frozen
 * IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.ladder rows verbatim (no re-derivation,
 * no new computation) for a "|reldiff| vs |E_CF|" log-log chart plus the flat P-per-landmark
 * bar series.
 *
 * PRESENTATION ONLY. No new computation; conditional-share diagnostic; RH open; NO QED.
 *
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law.js (source module)
 * @see imp-124770-pair-ratio-identity-landmark-ladder.js (the |reldiff| ladder reused by imp-124811)
 * @see imp-124797-pair-ratio-reldiff-vs-flowshare-viz-data.js (sibling viz-data leaf, |reldiff| vs flow share)
 */

import { IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW } from './imp-124811-pairratio-reldiff-ecf-roundoff-law.js';

const ROWS = IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.ladder;
const FIT = IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.fit;

// One chart row per landmark: the inverse-|E_CF| |reldiff| law and the flat invariant product P.
export const IMP124859_RELDIFF_VS_ECF_PRODUCT = Object.freeze(
  ROWS.map((r) => Object.freeze({
    key: r.key,
    sigma: r.sigma,
    abs_E_CF: r.absE_CF,
    abs_reldiff: r.absReldiff,
    product_P: r.product_reldiff_times_absECF,
  })),
);

export const IMP124859_SUMMARY = Object.freeze({
  law:
    'The imp-124811 inverse-|E_CF| round-off law |reldiff| ~ R/|E_CF| holds with log-log slope '
    + `${FIT.loglog_slope_reldiff_vs_absECF} (predicted ${FIT.predicted_slope}) across the landmark ladder `
    + `${ROWS.map((r) => r.key).join(' -> ')} as |E_CF| collapses `
    + `${ROWS[0].absE_CF} -> ${ROWS[ROWS.length - 1].absE_CF}, while the invariant product P = `
    + `|reldiff|*|E_CF| stays flat within [${Math.min(...ROWS.map((r) => r.product_reldiff_times_absECF))}, `
    + `${Math.max(...ROWS.map((r) => r.product_reldiff_times_absECF))}] (geomean R ~ `
    + `${FIT.R_floor_geomean_product}, max/min ~ ${FIT.product_max_over_min}).`,
  reading:
    `landmarks: ${IMP124859_RELDIFF_VS_ECF_PRODUCT.map((r) => r.key).join(', ')}; `
    + `|E_CF|: ${IMP124859_RELDIFF_VS_ECF_PRODUCT.map((r) => r.abs_E_CF).join(' -> ')}; `
    + `|reldiff|: ${IMP124859_RELDIFF_VS_ECF_PRODUCT.map((r) => r.abs_reldiff).join(' -> ')}; `
    + `P = |reldiff|*|E_CF|: ${IMP124859_RELDIFF_VS_ECF_PRODUCT.map((r) => r.product_P).join(', ')}.`,
  verdict:
    'Presentation only: every row is reused verbatim from imp-124811 (a measurement, not a derivation), '
    + 'relabeled for a "|reldiff| vs |E_CF|" log-log chart and a flat per-landmark P bar series. The flat '
    + '(non-decreasing) invariant product P discriminates pure |E_CF|-linear round-off precision loss from a '
    + 'genuine |E_CF|-proportional identity drift (imp-124808 proved the drift D = 0 at mpmath dps=100). No new '
    + 'computation. Measurement / sensitivity only on the inherited imp-3220/imp-3406 extrapolation surrogate, '
    + 'not a rigorous asymptotic. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda '
    + '<= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124859_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124859-six-rows',
    description: 'one chart row per landmark L2..L7',
    holds: () => IMP124859_RELDIFF_VS_ECF_PRODUCT.length === 6,
  },
  {
    id: 'imp124859-ecf-collapses-monotone',
    description: '|E_CF| strictly decreases down the ladder L2 -> L7',
    holds: () =>
      IMP124859_RELDIFF_VS_ECF_PRODUCT.every(
        (row, i) => i === 0 || row.abs_E_CF < IMP124859_RELDIFF_VS_ECF_PRODUCT[i - 1].abs_E_CF,
      ),
  },
  {
    id: 'imp124859-abs-reldiff-grows-monotone',
    description: '|reldiff| strictly increases down the ladder L2 -> L7 as |E_CF| collapses',
    holds: () =>
      IMP124859_RELDIFF_VS_ECF_PRODUCT.every(
        (row, i) => i === 0 || row.abs_reldiff > IMP124859_RELDIFF_VS_ECF_PRODUCT[i - 1].abs_reldiff,
      ),
  },
  {
    id: 'imp124859-product-bounded-no-collapse',
    description: 'the invariant product P stays within a factor 20 across the ladder (no deep-tail collapse)',
    holds: () => {
      const products = IMP124859_RELDIFF_VS_ECF_PRODUCT.map((r) => r.product_P);
      const spread = Math.max(...products) / Math.min(...products);
      return spread < 20 && products.every((p) => p > 0);
    },
  },
  {
    id: 'imp124859-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124859_SUMMARY.verdict) && /NO QED/.test(IMP124859_SUMMARY.verdict),
  },
];

for (const assertion of IMP124859_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124859 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124859_SUMMARY;
