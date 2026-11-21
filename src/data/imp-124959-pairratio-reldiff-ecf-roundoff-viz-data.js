/**
 * @module imp-124959-pairratio-reldiff-ecf-roundoff-viz-data
 *
 * imp-124959 (ux): import-light viz-data leaf charting the imp-124811 inverse round-off law
 * |reldiff| ~ R / |E_CF| on log-log axes across the L2..L7 landmark ladder. Reuses the frozen
 * IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW ladder and fit fields VERBATIM (no re-derivation):
 * this leaf only takes log10 of the already-measured |E_CF|/|reldiff| pairs for plotting and
 * overlays the predicted slope -1 line R_floor/|E_CF| against the measured ~-1.085 fit.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law.js (source module)
 */

import { IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW } from './imp-124811-pairratio-reldiff-ecf-roundoff-law.js';

const S = IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW;

const log10 = (x) => Math.log(x) / Math.LN10;

// One point per landmark: log-log coordinates of the measured |E_CF| vs |reldiff| pair, plus the
// predicted-slope-(-1) fitted value R_floor/|E_CF| for the overlay line.
export const IMP124959_LOGLOG_POINTS = Object.freeze(
  S.ladder.map((r) => {
    const fittedReldiff = S.fit.R_floor_geomean_product / r.absE_CF;
    return Object.freeze({
      key: r.key,
      sigma: r.sigma,
      absE_CF: r.absE_CF,
      absReldiff: r.absReldiff,
      log10_absE_CF: +log10(r.absE_CF).toFixed(4),
      log10_absReldiff: +log10(r.absReldiff).toFixed(4),
      fittedReldiff: +fittedReldiff.toExponential(4),
      log10_fittedReldiff: +log10(fittedReldiff).toFixed(4),
      product: r.product_reldiff_times_absECF, // the flat round-off invariant P = |reldiff|*|E_CF|
    });
  })
);

export const IMP124959_FIT_LINE = Object.freeze({
  measuredSlope: S.fit.loglog_slope_reldiff_vs_absECF, // ~ -1.085
  predictedSlope: S.fit.predicted_slope, // -1 (inverse-|E_CF| round-off law)
  R_floor: S.fit.R_floor_geomean_product, // ~2.34e-12
  productMaxOverMin: S.fit.product_max_over_min, // ~8.5 (flat invariant, no drift)
});

export const IMP124959_SUMMARY = Object.freeze({
  law:
    `log10(|reldiff|) vs log10(|E_CF|) across L2..L7 has measured slope ${IMP124959_FIT_LINE.measuredSlope} `
    + `against the predicted inverse-|E_CF| round-off law slope ${IMP124959_FIT_LINE.predictedSlope}; the `
    + `round-off invariant R = ${IMP124959_FIT_LINE.R_floor.toExponential(2)} stays flat `
    + `(max/min ~ ${IMP124959_FIT_LINE.productMaxOverMin}) across eight decades of |E_CF|.`,
  reading: IMP124959_LOGLOG_POINTS.map(
    (p) => `${p.key}: log10|E_CF|=${p.log10_absE_CF}, log10|reldiff|=${p.log10_absReldiff} (fit ${p.log10_fittedReldiff})`
  ).join(', '),
  verdict:
    'Presentation only: every log-log point and the fit-line constants are reused verbatim from '
    + 'imp-124811 (a measurement, not a derivation); no new computation. Conditional-share diagnostic on '
    + 'the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; changes no bound; '
    + 'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124959_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124959-six-ladder-points',
    description: 'exactly six log-log points (the L2..L7 ladder)',
    holds: () => IMP124959_LOGLOG_POINTS.length === 6,
  },
  {
    id: 'imp124959-log10-strictly-decreasing-ecf',
    description: 'log10|E_CF| strictly decreases down the ladder (matches the source monotone collapse)',
    holds: () =>
      IMP124959_LOGLOG_POINTS.every((p, i) => i === 0 || p.log10_absE_CF < IMP124959_LOGLOG_POINTS[i - 1].log10_absE_CF),
  },
  {
    id: 'imp124959-log10-strictly-increasing-reldiff',
    description: 'log10|reldiff| strictly increases down the ladder (matches the source monotone growth)',
    holds: () =>
      IMP124959_LOGLOG_POINTS.every(
        (p, i) => i === 0 || p.log10_absReldiff > IMP124959_LOGLOG_POINTS[i - 1].log10_absReldiff
      ),
  },
  {
    id: 'imp124959-fitted-line-matches-source-floor',
    description: 'each fittedReldiff matches R_floor/absE_CF from the frozen source fields to rounding precision',
    holds: () =>
      IMP124959_LOGLOG_POINTS.every(
        (p) => Math.abs(p.fittedReldiff / (S.fit.R_floor_geomean_product / p.absE_CF) - 1) < 1e-3
      ),
  },
  {
    id: 'imp124959-measured-slope-near-predicted',
    description: 'the measured slope lies within 15% of the predicted -1 (restated from imp-124811)',
    holds: () => Math.abs(IMP124959_FIT_LINE.measuredSlope - IMP124959_FIT_LINE.predictedSlope) < 0.15,
  },
  {
    id: 'imp124959-product-column-matches-source',
    description: 'the exposed product column equals the source product_reldiff_times_absECF field exactly',
    holds: () =>
      IMP124959_LOGLOG_POINTS.every((p, i) => p.product === S.ladder[i].product_reldiff_times_absECF),
  },
  {
    id: 'imp124959-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124959_SUMMARY.verdict) && /NO QED/.test(IMP124959_SUMMARY.verdict),
  },
];

for (const assertion of IMP124959_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124959 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124959_SUMMARY;
