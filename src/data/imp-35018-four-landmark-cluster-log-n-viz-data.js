/**
 * @module imp-35018-four-landmark-cluster-log-n-viz-data
 *
 * imp-35018 (ux, sonnet-4-6): viz-data companion to imp-35009's four-landmark cluster near
 * N ~ 3.3e9 -- three point-landmarks (N_half, N_cross, N_star) plus the imp-34693 admissible
 * seed BAND around N_cross -- none of which have ever been placed on one shared log-N axis.
 * This module reuses every literal VERBATIM from its four source modules (no recomputation)
 * and reshapes them into the ordered-locator + band fields a log-N axis viz needs.
 *
 * NO QED. Viz-data reshaping only; every number here traces back to imp-33723 / imp-33582 /
 * imp-33721 / imp-34693 (all inherited imp-3220/imp-3406 surrogate crossover map), C_mb
 * GUE-conditional per imp-486, no operator positivity, no refereed bound is changed.
 */

import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';
import { IMP34693_CROSSOVER_CONTRACTION_SEED_BAND } from './imp-34693-crossover-contraction-seed-band.js';

const N_CROSS = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form; // ~3.280294e9
const N_HALF = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.thresholdCrossings.sigma_below_0_5_at_N; // ~3.27e9
const N_STAR = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar; // ~3.38e9

// The imp-34693 k=10 row: the widest tabulated admissible seed half-width around N_cross.
const K10_ROW = IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.seedBandTable.find((r) => r.k === 10);
const BAND_HALF_WIDTH = K10_ROW.rho_closed_form; // ~1.7e8

export const IMP35018_ORDERED_LOCATORS = [
  {
    key: 'N_half',
    label: 'N_half (sigma=1/2 halving)',
    N: N_HALF,
    source: 'imp-33582',
  },
  {
    key: 'N_cross',
    label: 'N_cross (Banach fixed point)',
    N: N_CROSS,
    source: 'imp-33723',
  },
  {
    key: 'N_star',
    label: 'N_star (sigmoid inflection knee)',
    N: N_STAR,
    source: 'imp-33721',
  },
];

export const IMP35018_ADMISSIBLE_BAND = {
  key: 'admissible_seed_band',
  label: 'imp-34693 admissible seed band (k=10, centered on N_cross)',
  lo: N_CROSS - BAND_HALF_WIDTH,
  hi: N_CROSS + BAND_HALF_WIDTH,
  halfWidth: BAND_HALF_WIDTH,
  source: 'imp-34693',
};

export const IMP35018_PAIRWISE_SPREADS = {
  half_vs_cross_rel: Math.abs(N_CROSS - N_HALF) / N_CROSS,
  cross_vs_star_rel: Math.abs(N_STAR - N_CROSS) / N_CROSS,
  half_vs_star_rel: Math.abs(N_STAR - N_HALF) / N_STAR,
};

// imp-35050: this is a qualitative co-location sanity check, not a derived mathematical bound.
// The 4% ceiling was set with headroom above the imp-33721 ~3.3% N_star-vs-N_cross spread
// measured at authoring time. If a future refinement relocates a landmark (as imp-33721 itself
// relocated the inflection knee by a full decade), a spread crossing this line is a signal to
// re-examine the co-location claim in imp-35009, not necessarily a real regression -- widen the
// tolerance deliberately (with a comment noting the new source spread) rather than silently
// deriving it from whatever the modules currently measure.
const IMP35018_PAIRWISE_SPREAD_TOLERANCE = 0.04;

export const IMP35018_N_MIN = Math.min(IMP35018_ADMISSIBLE_BAND.lo, ...IMP35018_ORDERED_LOCATORS.map((l) => l.N));
export const IMP35018_N_MAX = Math.max(IMP35018_ADMISSIBLE_BAND.hi, ...IMP35018_ORDERED_LOCATORS.map((l) => l.N));

export const IMP35018_FOUR_LANDMARK_CLUSTER_LOG_N_VIZ_DATA = {
  id: 'imp-35018',
  orderedLocators: IMP35018_ORDERED_LOCATORS,
  band: IMP35018_ADMISSIBLE_BAND,
  pairwiseSpreads: IMP35018_PAIRWISE_SPREADS,
  nMin: IMP35018_N_MIN,
  nMax: IMP35018_N_MAX,
  isRigorous: false,
  citation:
    'imp-35009 (this cluster, tabulated); imp-33723 (N_cross closed-form Banach fixed point); ' +
    'imp-33582 (N_half sigma=1/2 halving landmark); imp-33721 (N_star sigmoid inflection knee); ' +
    'imp-34693 (admissible seed band around N_cross).',
};

export const IMP35018_FOUR_LANDMARK_CLUSTER_LOG_N_VIZ_ASSERTIONS = [
  {
    id: 'imp35018-three-locators-present',
    description: 'exactly 3 point-locators reused verbatim from imp-33723/imp-33582/imp-33721',
    holds: () => IMP35018_ORDERED_LOCATORS.length === 3,
  },
  {
    id: 'imp35018-locators-ordered-increasing',
    description: 'locators are listed in strictly increasing N order (N_half < N_cross < N_star)',
    holds: () =>
      IMP35018_ORDERED_LOCATORS.every(
        (l, i) => i === 0 || l.N > IMP35018_ORDERED_LOCATORS[i - 1].N
      ),
  },
  {
    id: 'imp35018-band-contains-all-locators',
    description: 'the imp-34693 admissible seed band contains all three point-locators',
    holds: () =>
      IMP35018_ORDERED_LOCATORS.every(
        (l) => l.N >= IMP35018_ADMISSIBLE_BAND.lo && l.N <= IMP35018_ADMISSIBLE_BAND.hi
      ),
  },
  {
    id: 'imp35018-pairwise-spreads-under-4pct',
    description: 'all pairwise relative spreads across the cluster stay under 4%, per the imp-35009 co-location finding (imp-33721 measured N_star ~3.3% above N_cross)',
    holds: () =>
      IMP35018_PAIRWISE_SPREADS.half_vs_cross_rel < IMP35018_PAIRWISE_SPREAD_TOLERANCE &&
      IMP35018_PAIRWISE_SPREADS.cross_vs_star_rel < IMP35018_PAIRWISE_SPREAD_TOLERANCE &&
      IMP35018_PAIRWISE_SPREADS.half_vs_star_rel < IMP35018_PAIRWISE_SPREAD_TOLERANCE,
  },
  {
    id: 'imp35018-cluster-band-3p3e9',
    description: 'nMin/nMax stay inside the [3.0e9, 3.5e9] cluster band',
    holds: () => IMP35018_N_MIN > 3.0e9 && IMP35018_N_MAX < 3.5e9,
  },
];

for (const a of IMP35018_FOUR_LANDMARK_CLUSTER_LOG_N_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35018-four-landmark-cluster-log-n-viz-data assertion failed: ${a.id}`);
  }
}
