/**
 * @module imp-96377-off-anchor-residual-scatter-viz-data
 *
 * imp-96377 (ux): import-light viz-data leaf for the imp-96345 off-line uniform-in-T
 * obstruction measurement, which quantified the below-line residual structure of the 27
 * off-anchor heights against the seven-anchor reciprocal-log line but shipped with no
 * chart surface.
 *
 * Bakes the seven imp-96148 on-line anchor heights and the 27 imp-96224 off-anchor
 * measured heights verbatim (same literals as imp-96345-route-bd-offline-margin-envelope.js
 * lines 65-74), tags each off-anchor point with its sign relative to the seven-anchor line
 * (evaluated with the imp-96345 baked floor/slope, no re-fitting), and samples the fitted
 * line across the full observed T range for the chart curve.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every T/rho pair and the line floor/slope are copied
 * verbatim from imp-96345; only the per-point residual sign and the line-curve sampling are
 * computed here. Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96345-route-bd-offline-margin-envelope.js (source measurement: residuals, envelope)
 *
 * Ticket: imp-96377 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP_96345_SEVEN_ANCHOR_LINE,
  IMP_96345_OFFLINE_RESIDUALS,
  IMP_96345_BINDING_ENVELOPE,
} from './imp-96345-route-bd-offline-margin-envelope.js';

// Seven ON-LINE anchors (imp-96148) -- the grid the reciprocal-log line was fit on.
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];

// 27 OFF-anchor measured heights (imp-96224: gamma_500..gamma_4000), baked verbatim.
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];

const { floor: LINE_C, slope: LINE_D } = IMP_96345_SEVEN_ANCHOR_LINE;
const lineAt = (T) => LINE_C + LINE_D / Math.log(T);

export const IMP96377_ANCHOR_POINTS = T7.map((T, i) => ({ T, rho: R7[i] }));

export const IMP96377_OFFANCHOR_POINTS = OFF_T.map((T, i) => {
  const rho = OFF_RHO[i];
  const residual = rho - lineAt(T);
  return { T, rho, residual, belowLine: residual < 0 };
});

// Line-curve samples across the full observed T range (evaluating the already-fitted
// formula, not re-fitting).
function sampleLine(numSamples) {
  const tMin = Math.min(T7[0], OFF_T[0]);
  const tMax = Math.max(T7[T7.length - 1], OFF_T[OFF_T.length - 1]);
  const lnMin = Math.log(tMin);
  const lnMax = Math.log(tMax);
  const points = [];
  for (let i = 0; i < numSamples; i += 1) {
    const lnT = lnMin + ((lnMax - lnMin) * i) / (numSamples - 1);
    const T = Math.exp(lnT);
    points.push({ T, rho: LINE_C + LINE_D / lnT });
  }
  return points;
}

export const IMP96377_LINE_CURVE = sampleLine(60);

const worst = IMP96377_OFFANCHOR_POINTS.reduce((a, b) => (b.residual < a.residual ? b : a));
const allPoints = IMP96377_ANCHOR_POINTS.concat(IMP96377_OFFANCHOR_POINTS);
const envelopeMin = allPoints.reduce((a, b) => (b.rho < a.rho ? b : a));

export const IMP96377_LANDMARKS = {
  worstResidualT: worst.T,
  worstResidual: worst.residual,
  nBelowLine: IMP96377_OFFANCHOR_POINTS.filter((p) => p.belowLine).length,
  nOffAnchor: IMP96377_OFFANCHOR_POINTS.length,
  envelopeMinT: envelopeMin.T,
  envelopeMin: envelopeMin.rho,
  lineFloor: LINE_C,
  fullFloor: IMP_96345_BINDING_ENVELOPE.fullFloor,
};

export const IMP96377_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every T/rho pair and the '
  + 'seven-anchor line floor/slope are copied verbatim from imp-96345 (and, before that, '
  + 'imp-96148/imp-96224); only the per-point below-line flag and the line-curve sample points '
  + 'are computed here. The binding envelope (minimum measured margin) stays strictly positive '
  + `(${IMP_96345_BINDING_ENVELOPE.marginMin} at gamma_4000) even though the fitted floor `
  + 'collapses toward zero off the seven-anchor line -- the margin SIGN survives, the positive '
  + 'FLOOR does not.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96377_ASSERTIONS = [
  {
    id: 'imp96377-anchor-and-offanchor-counts',
    holds: () => IMP96377_ANCHOR_POINTS.length === 7 && IMP96377_OFFANCHOR_POINTS.length === 27,
    why: 'the chart must plot exactly the seven imp-96148 on-line anchors plus the 27 imp-96224 off-anchor heights.',
  },
  {
    id: 'imp96377-below-line-count-matches-imp-96345',
    holds: () => IMP96377_LANDMARKS.nBelowLine === IMP_96345_OFFLINE_RESIDUALS.nBelowLine
      && IMP96377_LANDMARKS.nOffAnchor === IMP_96345_OFFLINE_RESIDUALS.nOffAnchor,
    why: 'the baked below-line count must reproduce the imp-96345 measured count (23 of 27).',
  },
  {
    id: 'imp96377-worst-residual-matches-imp-96345',
    holds: () => Math.abs(IMP96377_LANDMARKS.worstResidual - IMP_96345_OFFLINE_RESIDUALS.worstResidual) < 1e-3
      && Math.abs(IMP96377_LANDMARKS.worstResidualT - IMP_96345_OFFLINE_RESIDUALS.worstResidualT) < 1e-6,
    why: 'the baked worst-residual point must reproduce the imp-96345 measured worst residual (-0.06081) and its height (gamma_4000).',
  },
  {
    id: 'imp96377-envelope-min-matches-imp-96345',
    holds: () => Math.abs(IMP96377_LANDMARKS.envelopeMin - IMP_96345_BINDING_ENVELOPE.marginMin) < 1e-4
      && Math.abs(IMP96377_LANDMARKS.envelopeMinT - IMP_96345_BINDING_ENVELOPE.marginMinT) < 1e-6
      && IMP96377_LANDMARKS.envelopeMin > 0,
    why: 'the baked binding-envelope minimum must reproduce the imp-96345 measured envelope (0.3791 at gamma_4000), strictly positive.',
  },
  {
    id: 'imp96377-line-curve-matches-baked-floor-at-endpoints',
    holds: () => {
      const first = IMP96377_LINE_CURVE[0];
      const last = IMP96377_LINE_CURVE[IMP96377_LINE_CURVE.length - 1];
      return Math.abs(first.rho - lineAt(first.T)) < 1e-9 && Math.abs(last.rho - lineAt(last.T)) < 1e-9;
    },
    why: 'the sampled line-curve endpoints must reproduce the imp-96345 baked floor/slope formula exactly (pure evaluation, no re-fit).',
  },
];

for (const a of IMP96377_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96377-off-anchor-residual-scatter-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
