/**
 * @module imp-34475-four-locator-cluster-axis-viz-data
 *
 * imp-34475 (ux, sonnet-4-6): viz-data companion to the imp-34441 four-locator reconciliation
 * TABLE. imp-34441 tabulates four independently-derived landmarks clustered near N ~ 3.28e9 on
 * the sigma(N) post-peak curve, plus every pairwise relative offset, but has no accompanying
 * visualization. This module reuses the imp-34441 literal exports VERBATIM (no recomputation)
 * and reshapes them into the fields an axis viz needs: an ordered list of the four locators and
 * the two headline gaps (the ~0.40% E_flow halving-to-crossover displacement and the ~3.0-3.5%
 * ramp-curvature crossover-to-knee offset).
 *
 * NO QED. Viz-data reshaping only; every number here traces back to imp-34441 -> imp-33723 /
 * imp-33721 / imp-3444, none of it recomputed.
 */

import { IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION } from './imp-34441-3p28e9-landmark-cluster-reconciliation.js';

const LOCATORS_BY_KEY = Object.fromEntries(
  IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION.locators.map((l) => [l.key, l])
);

// Ordered left-to-right along the shared axis (increasing N), per imp-34441 finding F3.
export const IMP34475_ORDERED_LOCATORS = [
  { ...LOCATORS_BY_KEY.N_half, label: 'N_half', short: 'halving' },
  { ...LOCATORS_BY_KEY.N_cross_bisection, label: 'N_cross (bisection)', short: 'crossover' },
  { ...LOCATORS_BY_KEY.N_cross_closed_form, label: 'N_cross (closed form)', short: 'crossover' },
  { ...LOCATORS_BY_KEY.N_knee_sigmoid, label: 'N_knee_sigmoid', short: 'knee' },
];

export const IMP34475_KEY_OFFSETS = IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION.keyOffsets;

// The two headline gaps this viz annotates, reusing imp-34441's keyOffsets verbatim.
export const IMP34475_GAPS = [
  {
    id: 'crossover_vs_half',
    fromKey: 'N_half',
    toKey: 'N_cross_closed_form',
    label: 'E_flow displacement (halving -> crossover)',
    relativeOffset: Math.abs(IMP34475_KEY_OFFSETS.crossover_vs_half_rel),
    color: '#4ade80',
  },
  {
    id: 'knee_vs_crossover',
    fromKey: 'N_cross_closed_form',
    toKey: 'N_knee_sigmoid',
    label: 'ramp-curvature offset (crossover -> knee)',
    relativeOffset: Math.abs(IMP34475_KEY_OFFSETS.knee_vs_crossover_rel),
    color: '#facc15',
  },
];

export const IMP34475_N_MIN = Math.min(...IMP34475_ORDERED_LOCATORS.map((l) => l.N));
export const IMP34475_N_MAX = Math.max(...IMP34475_ORDERED_LOCATORS.map((l) => l.N));

export const IMP34475_FOUR_LOCATOR_CLUSTER_AXIS_VIZ_DATA = {
  id: 'imp-34475',
  orderedLocators: IMP34475_ORDERED_LOCATORS,
  gaps: IMP34475_GAPS,
  keyOffsets: IMP34475_KEY_OFFSETS,
  nMin: IMP34475_N_MIN,
  nMax: IMP34475_N_MAX,
  isRigorous: false,
  citation: IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION.citation,
};

export const IMP34475_FOUR_LOCATOR_CLUSTER_AXIS_VIZ_ASSERTIONS = [
  {
    id: 'imp34475-four-locators-present',
    description: 'exactly 4 locators reused verbatim from imp-34441',
    holds: () => IMP34475_ORDERED_LOCATORS.length === 4,
  },
  {
    id: 'imp34475-locators-ordered-increasing',
    description: 'locators are listed in strictly non-decreasing N order (F3 monotone ordering)',
    holds: () =>
      IMP34475_ORDERED_LOCATORS.every(
        (l, i) => i === 0 || l.N >= IMP34475_ORDERED_LOCATORS[i - 1].N
      ),
  },
  {
    id: 'imp34475-two-gaps-distinct-magnitude',
    description: 'the crossover-vs-half gap is strictly smaller than the knee-vs-crossover gap',
    holds: () => IMP34475_GAPS[0].relativeOffset < IMP34475_GAPS[1].relativeOffset,
  },
  {
    id: 'imp34475-gaps-in-expected-bands',
    description: 'crossover-vs-half in [0.1%,1%], knee-vs-crossover in [2%,5%]',
    holds: () =>
      IMP34475_GAPS[0].relativeOffset > 0.001 &&
      IMP34475_GAPS[0].relativeOffset < 0.01 &&
      IMP34475_GAPS[1].relativeOffset > 0.02 &&
      IMP34475_GAPS[1].relativeOffset < 0.05,
  },
  {
    id: 'imp34475-cluster-band',
    description: 'nMin/nMax stay inside the imp-34441 [3.0e9, 3.5e9] cluster band',
    holds: () => IMP34475_N_MIN > 3.0e9 && IMP34475_N_MAX < 3.5e9,
  },
];

for (const a of IMP34475_FOUR_LOCATOR_CLUSTER_AXIS_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34475-four-locator-cluster-axis-viz-data assertion failed: ${a.id}`);
  }
}
