/**
 * @module imp-96410-sigma-peak-knee-crossover-viz-data
 *
 * imp-96410 (ux, sonnet-4-6): chart-shaping layer for the imp-96388 sigma(N) peak /
 * knee / crossover cross-tabulation. Every landmark value, shared-axis row, and
 * finding below is copied verbatim from imp-96388-sigma-peak-vs-knee-cross-tabulation.js;
 * the only work done here is sampling the sigma(N) curve on a dense log10 N grid (for a
 * log-x curve chart) so the two landmarks and the crossover render on one shared axis.
 *
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation.js (source measurement, method, verdict)
 */

import { IMP96388_SIGMA_PEAK_VS_KNEE_CROSS_TABULATION } from './imp-96388-sigma-peak-vs-knee-cross-tabulation.js';

const {
  peak,
  knee,
  crossover,
  separationDecades,
  sharedAxis,
  finding,
  verdict,
} = IMP96388_SIGMA_PEAK_VS_KNEE_CROSS_TABULATION;

// Dense curve sample of sigma vs log10 N across the shared axis range, so the chart
// shows the actual monotone descent between the peak and the knee, not just the two
// landmark points. sigma(N) here is reconstructed from the sharedAxis rows via a
// monotone piecewise-linear interpolant in log10N -- no re-derivation of the model.
const AXIS_LOG10 = sharedAxis.map((r) => r.log10N);
const AXIS_SIGMA = sharedAxis.map((r) => r.sigma);

function interpSigma(d) {
  if (d <= AXIS_LOG10[0]) return AXIS_SIGMA[0];
  if (d >= AXIS_LOG10[AXIS_LOG10.length - 1]) return AXIS_SIGMA[AXIS_SIGMA.length - 1];
  for (let i = 0; i < AXIS_LOG10.length - 1; i += 1) {
    if (d >= AXIS_LOG10[i] && d <= AXIS_LOG10[i + 1]) {
      const t = (d - AXIS_LOG10[i]) / (AXIS_LOG10[i + 1] - AXIS_LOG10[i]);
      return AXIS_SIGMA[i] + t * (AXIS_SIGMA[i + 1] - AXIS_SIGMA[i]);
    }
  }
  return AXIS_SIGMA[AXIS_SIGMA.length - 1];
}

const CURVE_MIN_D = Math.min(peak.log10N, AXIS_LOG10[0]);
const CURVE_MAX_D = Math.max(knee.log10N, AXIS_LOG10[AXIS_LOG10.length - 1]);
const CURVE_STEPS = 80;

export const IMP96410_AXIS = Object.freeze({
  log10NMin: CURVE_MIN_D,
  log10NMax: CURVE_MAX_D,
  sigmaMin: 0,
  sigmaMax: 1,
});

export const IMP96410_SIGMA_CURVE = Object.freeze(
  Array.from({ length: CURVE_STEPS + 1 }, (_, i) => {
    const d = CURVE_MIN_D + (i / CURVE_STEPS) * (CURVE_MAX_D - CURVE_MIN_D);
    return Object.freeze({ log10N: d, sigma: interpSigma(d) });
  }),
);

export const IMP96410_LANDMARKS = Object.freeze({
  peak: Object.freeze({ log10N: peak.log10N, sigma: peak.sigma, N: peak.N, kind: peak.kind }),
  knee: Object.freeze({ log10N: knee.log10N, sigma: knee.sigma, N: knee.N, kind: knee.kind }),
  crossover: Object.freeze({ log10N: crossover.log10N, N: crossover.N, note: crossover.note }),
});

export const IMP96410_SEPARATION_DECADES = separationDecades;

export const IMP96410_SHARED_AXIS = Object.freeze(sharedAxis.map((r) => Object.freeze({ ...r })));

export const IMP96410_FINDING = Object.freeze({ ...finding });

export const IMP96410_HONEST_BANNER = verdict;
