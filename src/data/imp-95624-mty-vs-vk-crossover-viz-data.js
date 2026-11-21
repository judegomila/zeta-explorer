// imp-95624: viz-data for the imp-95605 classical Mossinghoff-Trudgian-Yang (MTY)
// vs Ford Vinogradov-Korobov (VK) zero-free-region width comparison across
// T in [3e12, 1.9e16], plus the e^10000 crossover and the inert per-zero factor.
//
// Presentation only: recomputes the same two closed forms IMP_95605_ZERO_FREE_VERIFY
// already recorded, sampled onto a curve for charting. No new derivation; changes no
// bound; NO QED; no refereed bound is changed.

import { IMP_95605_ZERO_FREE_VERIFY } from './imp-95605-zero-free-region-verify.js';

const ln = Math.log;
const log10 = Math.log10;

const classicalWidth = (t) => 1 / (5.558691 * ln(t));
const vkWidth = (t) =>
  1 / (57.54 * Math.pow(ln(t), 2 / 3) * Math.pow(ln(ln(t)), 1 / 3));

const { windowHeights, crossoverLogT } = IMP_95605_ZERO_FREE_VERIFY;
const { logTlo, logThi } = windowHeights;

// Sample the curve in log t from the window bottom out past the crossover, so
// the chart shows both the window (where classical wins) and the far crossover
// (where VK eventually overtakes it).
const LOG_T_SAMPLE_MAX = crossoverLogT * 1.08;
const N_SAMPLES = 240;

function sampleCurve() {
  const points = [];
  for (let i = 0; i <= N_SAMPLES; i++) {
    // Sample uniformly in log10(log t) so the window and the far crossover
    // both get resolvable coverage on one axis.
    const u = log10(logTlo) + (i / N_SAMPLES) * (log10(LOG_T_SAMPLE_MAX) - log10(logTlo));
    const logT = Math.pow(10, u);
    const t = Math.exp(logT);
    points.push({
      logT,
      log10LogT: u,
      classical: classicalWidth(t),
      vk: vkWidth(t),
    });
  }
  return points;
}

export const IMP_95624_CROSSOVER_CURVE = sampleCurve();

export const IMP_95624_MARKERS = {
  windowLo: { logT: logTlo, log10LogT: log10(logTlo), label: 'T_LO ~ 3.0e12' },
  windowHi: { logT: logThi, log10LogT: log10(logThi), label: 'T_HI ~ 1.9e16' },
  crossover: {
    logT: crossoverLogT,
    log10LogT: log10(crossoverLogT),
    label: 'VK/classical crossover ~ e^{10000}',
  },
};

export const IMP_95624_PER_ZERO_FACTOR = {
  floor: IMP_95605_ZERO_FREE_VERIFY.perZeroFactorFloor,
  note:
    'per-zero factor u^{-(1-beta)} floor (u = t, most-saving case) stays pinned at '
    + '0.8354 across the whole window -- no unconditional saving from the wider '
    + 'classical region.',
};

export default IMP_95624_CROSSOVER_CURVE;
