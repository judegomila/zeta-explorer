/**
 * @module imp-35026-sigma-decay-landmark-ladder-viz-data
 *
 * imp-35026 (ux, viz-only): the imp-33582 sigma(N) post-peak decay ladder and its
 * imp-33721 inflection knee are described in currentStatus and baked as literals across
 * several data modules, but no page renders the decay curve itself alongside its three
 * threshold-crossing landmarks (sigma = 0.9, 0.5, 0.1) and the local decay-exponent ramp
 * in one view. This module builds the log-spaced sigma(N) grid over N in [1e6,1e12] via
 * the shared sigma-n-subterms.js helper (no re-derivation) and re-exports the imp-33582
 * threshold crossings / per-decade exponent ladder and the imp-33721 inflection knee
 * verbatim for the viz page to render.
 *
 * VIZ-ONLY. Measurement/fit only, on the inherited imp-3220/imp-3406 surrogate; C_mb
 * GUE-conditional per imp-486 untouched; establishes no operator positivity; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (threshold crossings, per-decade ladder)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade inflection knee N*)
 * @see sigma-n-subterms (shared sigma(N) helper)
 */
import { sigmaNSubterms } from './sigma-n-subterms.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const D82 = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY;
const D21 = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE;

// Log-spaced sigma(N) grid over the imp-33582 near-peak-to-far-tail span, 4 points/decade.
const POINTS_PER_DECADE = 4;
const LOG10_LO = 6;
const LOG10_HI = 12;
const GRID = [];
for (let d = LOG10_LO; d <= LOG10_HI + 1e-9; d += 1 / POINTS_PER_DECADE) {
  const N = Math.pow(10, d);
  GRID.push({ log10N: +d.toFixed(4), N: +N.toExponential(4), sigma: +sigmaNSubterms(N).sigma.toFixed(6) });
}

export const IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA = {
  id: 'imp-35026',
  proofSection: 'S-frontier',
  grid: GRID,
  perDecadeLadder: D82.perDecadeLadder,
  farTailExponent: D82.farTailExponent, // imp-3463 asymptote, 1/2
  thresholdCrossings: D82.thresholdCrossings,
  inflection: {
    log10Nstar: D21.inflectionLog10Nstar,
    Nstar: D21.inflectionNstar,
    vsHalvingRelGap: D21.inflectionVsHalvingRelGap,
  },
  isRigorous: false,
  verdict:
    'VIZ-ONLY. Renders the imp-33582 sigma(N) grid (shared sigma-n-subterms.js helper, no ' +
    're-derivation) with the sigma = 0.9/0.5/0.1 threshold-crossing landmarks, the per-decade ' +
    'local decay exponent ramp toward the imp-3463 far-tail 1/2, and the imp-33721 sub-decade ' +
    'inflection knee N* -- all imported literals, no new computation. Measurement on the ' +
    'inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 untouched; ' +
    'establishes no operator positivity; changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp35026-grid-monotone-decreasing',
    description: 'sigma(N) grid strictly decreases across the full [1e6,1e12] span',
    holds: () => {
      for (let i = 1; i < GRID.length; i++) {
        if (!(GRID[i].sigma < GRID[i - 1].sigma)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp35026-grid-matches-imp33582-endpoints',
    description: 'grid endpoints reproduce the imp-33582 sigma_at_1e6 and per-decade ladder sigmaHi[1e11->1e12]',
    holds: () =>
      Math.abs(GRID[0].sigma - D82.peak.sigma_at_1e6) < 1e-3 &&
      Math.abs(GRID[GRID.length - 1].sigma - D82.perDecadeLadder[D82.perDecadeLadder.length - 1].sigmaHi) < 1e-3,
  },
  {
    id: 'imp35026-landmarks-reproduce-imp33582-thresholds',
    description: 'imported threshold crossings match the imp-33582 ~2.57e7/~3.27e9/~3.21e11 landmarks',
    holds: () =>
      Math.abs(D82.thresholdCrossings.sigma_below_0_9_at_N / 2.57e7 - 1) < 5e-2 &&
      Math.abs(D82.thresholdCrossings.sigma_below_0_5_at_N / 3.27e9 - 1) < 5e-2 &&
      Math.abs(D82.thresholdCrossings.sigma_below_0_1_at_N / 3.21e11 - 1) < 5e-2,
  },
  {
    id: 'imp35026-inflection-knee-within-grid-span',
    description: 'the imp-33721 inflection knee N* lies within the plotted [1e6,1e12] span',
    holds: () =>
      IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar >= 1e6 &&
      IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar <= 1e12,
  },
  {
    id: 'imp35026-honesty-gate-no-qed',
    description: 'Viz-only: not rigorous, far-tail exponent 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA.isRigorous === false &&
      IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA.verdict) &&
      /refereed bound is changed/i.test(IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA.verdict),
  },
];

for (const a of IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35026-sigma-decay-landmark-ladder-viz-data assertion failed: ${a.id}`);
  }
}
