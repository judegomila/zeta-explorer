/**
 * @module imp-35138-sigma-deep-tail-threshold-ladder-viz-data
 *
 * imp-35138 (ux, viz-only): imp-35041 extended the imp-33582 sigma(N) threshold-crossing
 * ladder two decades deeper (sigma < 0.01 at N ~ 4.62e13, sigma < 0.001 at N ~ 5.43e15) and
 * measured the per-factor-10 crossing spacing clustering near 2 decades of N (1.99, 2.16,
 * 2.07) -- the direct signature of the far-tail sqrt(1/N) law (imp-3463 exponent 1/2) -- but
 * left it as bare literals with no page. This module builds the log-spaced sigma(N) grid over
 * N in [1e6, 1e16] via the shared sigma-n-subterms.js helper (no re-derivation) and re-exports
 * the imp-35041 threshold crossings / decade spacing / E_flow negligibility verbatim for the
 * viz page to render.
 *
 * VIZ-ONLY. Measurement/fit only, on the inherited imp-3220/imp-3406 surrogate; C_mb
 * GUE-conditional per imp-486 untouched; establishes no operator positivity; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35041-sigma-deep-tail-threshold-extension (threshold crossings, decade spacing, E_flow negligibility)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the 0.5/0.1 landmarks reproduced here)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see sigma-n-subterms (shared sigma(N) helper)
 */
import { sigmaNSubterms } from './sigma-n-subterms.js';
import { IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION } from './imp-35041-sigma-deep-tail-threshold-extension.js';

const D41 = IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION;

// Log-spaced sigma(N) grid over the imp-35041 deep-tail span, 2 points/decade.
const POINTS_PER_DECADE = 2;
const LOG10_LO = 6;
const LOG10_HI = 16;
const GRID = [];
for (let d = LOG10_LO; d <= LOG10_HI + 1e-9; d += 1 / POINTS_PER_DECADE) {
  const N = Math.pow(10, d);
  GRID.push({ log10N: +d.toFixed(4), N: +N.toExponential(4), sigma: +sigmaNSubterms(N).sigma.toExponential(6) });
}

export const IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA = {
  id: 'imp-35138',
  proofSection: 'S-frontier',
  grid: GRID,
  thresholdCrossings: D41.thresholdCrossings,
  decadeSpacing: D41.decadeSpacing,
  eflowNegligibility: D41.eflowNegligibility,
  farTailExponent: D41.farTailExponent, // imp-3463 asymptote, 1/2
  isRigorous: false,
  verdict:
    'VIZ-ONLY. Renders the imp-35041 sigma(N) grid over N in [1e6,1e16] (shared ' +
    'sigma-n-subterms.js helper, no re-derivation) with the sigma = 0.5/0.1/0.01/0.001 ' +
    'threshold-crossing landmarks and the per-factor-10 decade-spacing ladder (1.99, 2.16, ' +
    '2.07) converging on the imp-3463 far-tail sqrt(1/N) signature -- all imported literals, ' +
    'no new computation. Measurement on the inherited imp-3220/imp-3406 surrogate; C_mb ' +
    'GUE-conditional per imp-486 untouched; establishes no operator positivity; changes no ' +
    'bound; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp35138-grid-monotone-decreasing',
    description: 'sigma(N) grid strictly decreases across the full [1e6,1e16] span',
    holds: () => {
      for (let i = 1; i < GRID.length; i++) {
        if (!(GRID[i].sigma < GRID[i - 1].sigma)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp35138-grid-spans-all-four-thresholds',
    description: 'grid N-range brackets every threshold-crossing N from sigma=0.5 down to sigma=0.001',
    holds: () =>
      GRID[0].N <= D41.thresholdCrossings.sigma_below_0_5_at_N &&
      GRID[GRID.length - 1].N >= D41.thresholdCrossings.sigma_below_0_001_at_N,
  },
  {
    id: 'imp35138-decade-spacing-matches-imp35041',
    description: 'imported decade spacing reproduces the imp-35041 1.99/2.16/2.07 ladder',
    holds: () =>
      Math.abs(D41.decadeSpacing.from_0_5_to_0_1 - 1.99) < 0.05 &&
      Math.abs(D41.decadeSpacing.from_0_1_to_0_01 - 2.16) < 0.05 &&
      Math.abs(D41.decadeSpacing.from_0_01_to_0_001 - 2.07) < 0.05,
  },
  {
    id: 'imp35138-honesty-gate-no-qed',
    description: 'Viz-only: not rigorous, far-tail exponent 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA.isRigorous === false &&
      IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA.verdict) &&
      /refereed bound is changed/i.test(IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA.verdict),
  },
];

for (const a of IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35138-sigma-deep-tail-threshold-ladder-viz-data assertion failed: ${a.id}`);
  }
}
