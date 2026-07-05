/**
 * @module imp-33761-fartail-floor-sensitivity-scatter-viz-data
 * @fileoverview imp-33761 -- VIZ DATA ONLY for the imp-33708 far-tail floor-sensitivity
 *   result: a log-log scatter of the two far-tail landmarks (sigma=0.5 halving point,
 *   sigma<0.1 crossing) against the E_trunc floor factor, each with its own measured
 *   ~-2.0 trend line, plotted against a ~-1.375 reference line anchored at the same
 *   baseline points -- the imp-33684 interior-peak floor-scaling exponent -- so the
 *   far-tail's steeper floor-sensitivity is visible directly on the chart.
 *
 *   This module imports ONLY the light imp-33708 / imp-33684 baked-literal exports --
 *   it does NOT re-import the heavy zeros-to-1e6.js bundle, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js (the far-tail landmark table + exponents baked here)
 *   @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js (the interior-peak baseline + ~-1.375 exponent, the reference line)
 *
 *   Ticket: imp-33761 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. imp-3066 K_a>=0 UNTOUCHED. RH-EQUIVALENT. NO QED.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

import { IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY } from './imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js';
import { IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY } from './imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js';

const LANDMARK_0_5 = IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.landmark_sigma_0_5;
const LANDMARK_0_1 = IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.landmark_sigma_0_1;
const PEAK_EXPONENT = IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.scalingExponent; // ~-1.375

// -- scatter points: (log10 floorFactor, log10 N_landmark) per swept floor, one series per threshold --
function scatterFor(landmark, threshold) {
  return Object.freeze(
    landmark.table.map((row) =>
      Object.freeze({
        floorFactor: row.floorFactor,
        log10_floorFactor: +Math.log10(row.floorFactor).toFixed(6),
        N_landmark: row.N_landmark,
        log10_N: row.log10_N,
        threshold,
      }),
    ),
  );
}

export const IMP33761_SCATTER_SIGMA_0_5 = scatterFor(LANDMARK_0_5, 0.5);
export const IMP33761_SCATTER_SIGMA_0_1 = scatterFor(LANDMARK_0_1, 0.1);

// -- a straight log-log line of given slope through the floorFactor=1 baseline point --
function trendLine(baseLog10N, slope, floorFactorMin, floorFactorMax) {
  const xMin = Math.log10(floorFactorMin);
  const xMax = Math.log10(floorFactorMax);
  return Object.freeze([
    Object.freeze({ log10_floorFactor: xMin, log10_N: baseLog10N + slope * xMin }),
    Object.freeze({ log10_floorFactor: xMax, log10_N: baseLog10N + slope * xMax }),
  ]);
}

const FLOOR_MIN = Math.min(...LANDMARK_0_5.table.map((r) => r.floorFactor)); // 0.5
const FLOOR_MAX = Math.max(...LANDMARK_0_5.table.map((r) => r.floorFactor)); // 5.0
const BASE_LOG10_N_0_5 = LANDMARK_0_5.table.find((r) => r.floorFactor === 1.0).log10_N;
const BASE_LOG10_N_0_1 = LANDMARK_0_1.table.find((r) => r.floorFactor === 1.0).log10_N;

// -- the far-tail's own measured trend (~-2.099 / ~-2.079), anchored at each baseline --
export const IMP33761_FARTAIL_TREND_SIGMA_0_5 = trendLine(
  BASE_LOG10_N_0_5,
  LANDMARK_0_5.scalingExponent,
  FLOOR_MIN,
  FLOOR_MAX,
);
export const IMP33761_FARTAIL_TREND_SIGMA_0_1 = trendLine(
  BASE_LOG10_N_0_1,
  LANDMARK_0_1.scalingExponent,
  FLOOR_MIN,
  FLOOR_MAX,
);

// -- the imp-33684 interior-peak ~-1.375 reference slope, anchored at the SAME baselines --
export const IMP33761_PEAK_REFERENCE_LINE_AT_0_5_BASELINE = trendLine(
  BASE_LOG10_N_0_5,
  PEAK_EXPONENT,
  FLOOR_MIN,
  FLOOR_MAX,
);
export const IMP33761_PEAK_REFERENCE_LINE_AT_0_1_BASELINE = trendLine(
  BASE_LOG10_N_0_1,
  PEAK_EXPONENT,
  FLOOR_MIN,
  FLOOR_MAX,
);

export default Object.freeze({
  id: 'imp-33761-fartail-floor-sensitivity-scatter-viz-data',
  ticket: 'imp-33761',
  source: [
    'imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js',
    'imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js',
  ],
  scatterSigma0_5: IMP33761_SCATTER_SIGMA_0_5,
  scatterSigma0_1: IMP33761_SCATTER_SIGMA_0_1,
  fartailTrendSigma0_5: IMP33761_FARTAIL_TREND_SIGMA_0_5,
  fartailTrendSigma0_1: IMP33761_FARTAIL_TREND_SIGMA_0_1,
  peakReferenceLineAt0_5Baseline: IMP33761_PEAK_REFERENCE_LINE_AT_0_5_BASELINE,
  peakReferenceLineAt0_1Baseline: IMP33761_PEAK_REFERENCE_LINE_AT_0_1_BASELINE,
  fartailExponents: {
    sigma_0_5: LANDMARK_0_5.scalingExponent,
    sigma_0_1: LANDMARK_0_1.scalingExponent,
  },
  peakExponent: PEAK_EXPONENT,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP33761_ASSERTIONS = [
  {
    id: 'imp33761-scatter-has-all-swept-floors',
    holds: () =>
      IMP33761_SCATTER_SIGMA_0_5.length === LANDMARK_0_5.table.length &&
      IMP33761_SCATTER_SIGMA_0_1.length === LANDMARK_0_1.table.length,
    why: 'Both scatter series must plot every imp-33708 swept floor factor.',
  },
  {
    id: 'imp33761-fartail-trend-steeper-than-peak-reference',
    holds: () =>
      LANDMARK_0_5.scalingExponent < PEAK_EXPONENT && LANDMARK_0_1.scalingExponent < PEAK_EXPONENT,
    why: 'The far-tail trend slopes (~-2.0) must be more negative (steeper) than the imp-33684 peak reference (~-1.375).',
  },
  {
    id: 'imp33761-trend-lines-anchor-at-baseline',
    holds: () =>
      Math.abs(IMP33761_FARTAIL_TREND_SIGMA_0_5[1].log10_N - BASE_LOG10_N_0_5) < 1e-6 * Math.abs(BASE_LOG10_N_0_5) + 1e-9 ||
      Math.abs(
        IMP33761_FARTAIL_TREND_SIGMA_0_5[0].log10_N +
          LANDMARK_0_5.scalingExponent * (Math.log10(1.0) - Math.log10(FLOOR_MIN)) -
          BASE_LOG10_N_0_5,
      ) < 1e-6,
    why: 'The far-tail trend line evaluated at floorFactor=1 must reproduce the baseline log10(N) exactly.',
  },
  {
    id: 'imp33761-scatter-matches-source-table-endpoints',
    holds: () => {
      const first0_5 = IMP33761_SCATTER_SIGMA_0_5[0];
      const last0_5 = IMP33761_SCATTER_SIGMA_0_5[IMP33761_SCATTER_SIGMA_0_5.length - 1];
      return (
        first0_5.floorFactor === LANDMARK_0_5.table[0].floorFactor &&
        last0_5.floorFactor === LANDMARK_0_5.table[LANDMARK_0_5.table.length - 1].floorFactor &&
        first0_5.log10_N === LANDMARK_0_5.table[0].log10_N
      );
    },
    why: 'Scatter series must reproduce the source imp-33708 table verbatim (no recomputation, presentation only).',
  },
  {
    id: 'imp33761-honesty-gate-no-qed',
    holds: () =>
      IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.verdict),
    why: 'Presentation of a non-rigorous sensitivity measurement must inherit the source NO-QED gate.',
  },
];

for (const assertion of IMP33761_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-33761-fartail-floor-sensitivity-scatter-viz-data assertion failed: ${assertion.id}`,
    );
  }
}
