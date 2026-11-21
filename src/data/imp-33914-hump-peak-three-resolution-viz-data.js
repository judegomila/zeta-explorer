/**
 * @module imp-33914-hump-peak-three-resolution-viz-data
 * @fileoverview imp-33914 -- lightweight viz-data module tabulating the M3
 *   saturation-curvature hump argmax at THREE resolutions on one shared axis,
 *   so a consumer chart can show how the sliding-window grid argmax converges
 *   on the continuum limit k* as the grid is refined, and the surviving
 *   offset from the pointwise crossover:
 *
 *     (1) integer-decade k = 9        (imp-33809/imp-33896), hump 6.4758e-2
 *     (2) quarter-decade  k = 8.75    (imp-33896), hump 6.5245e-2
 *     (3) continuum limit k* ~ 8.821  (imp-33878), hump ~6.5337e-2
 *
 *   plus the pointwise E_coll = E_trunc crossover k_cross ~ 9.516 (imp-33844/
 *   imp-33723), annotated with the ~0.695-decade gap k_cross - k* that imp-33878
 *   G3 found does NOT vanish under grid refinement.
 *
 *   The continuum k* and its residual are pulled from
 *   IMP33878_HUMP_ARGMAX_GRID_REFINEMENT (already a light, no-heavy-import
 *   module reused verbatim by imp-33905/imp-33942/imp-33948); the k=9 and
 *   k=8.75 readings are baked reference literals from imp-33809/imp-33896 so
 *   this module does not need to import the heavier ladder sources.
 *
 *   @see imp-33809-saturation-curvature-hump-vs-k.js (k=9 integer-decade ladder)
 *   @see imp-33896-decade-label-consistency-audit.js (k=8.75 finer-grid reading)
 *   @see imp-33878-hump-argmax-grid-refinement.js (continuum k*, k_cross gap)
 *   @see imp-33844-hump-peak-closed-form.js (closed-form crossover k_cross~9.516)
 *
 *   Ticket: imp-33914 (ux, low). Data module only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.8211
const RESID_AT_KSTAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.residAtKStar; // ~6.5337e-2
const K_CROSS = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.crossoverComparison.kCrossContinuous; // ~9.5159
const GAP_KCROSS_MINUS_KSTAR =
  IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.crossoverComparison.gap_kCross_minus_kStar; // ~0.695

// Three readings of the SAME M3 curvature-hump argmax, one shared k-axis.
export const IMP33914_THREE_RESOLUTION_READINGS = Object.freeze([
  {
    label: 'integer decade',
    resolution: 'step = 1 (whole decade)',
    k: 9,
    hump: 6.4758e-2,
    source: 'imp-33809/imp-33896',
  },
  {
    label: 'quarter decade',
    resolution: 'step = 0.25',
    k: 8.75,
    hump: 6.5245e-2,
    source: 'imp-33896',
  },
  {
    label: 'continuum limit',
    resolution: 'step -> 0 (ternary search)',
    k: K_STAR,
    hump: RESID_AT_KSTAR,
    source: 'imp-33878',
  },
]);

export const IMP33914_CROSSOVER_REFERENCE = Object.freeze({
  label: 'pointwise E_coll = E_trunc crossover',
  k: K_CROSS,
  source: 'imp-33844/imp-33723',
});

// The gap between the continuum argmax and the pointwise crossover -- imp-33878
// G3 found this survives grid refinement rather than vanishing with it.
export const IMP33914_KCROSS_MINUS_KSTAR_GAP = GAP_KCROSS_MINUS_KSTAR; // ~0.695 decade

export const IMP33914_HUMP_PEAK_THREE_RESOLUTION_VIZ_DATA = {
  ticket: 'imp-33914',
  readings: IMP33914_THREE_RESOLUTION_READINGS,
  crossoverReference: IMP33914_CROSSOVER_REFERENCE,
  kCrossMinusKStarGapDecades: IMP33914_KCROSS_MINUS_KSTAR_GAP,
  note:
    'The three readings track the SAME resid_exp(k) sliding-window argmax at ' +
    'successively finer grid resolution: the quarter-decade reading (k=8.75) ' +
    'undershoots, then further refinement oscillates the grid argmax (8.875, ' +
    '8.8125, ...) converging on the true continuum value k*~8.821, which sits ' +
    'BETWEEN the quarter-decade reading and the integer-decade label (k=9) -- ' +
    '0.071 above 8.75 and 0.179 below 9. All three sit well AWAY from the ' +
    'pointwise crossover k_cross~9.516 (imp-33878 G1). The ~0.695-decade gap ' +
    'from the converged k* to k_cross is grid-independent (imp-33878 G3): a ' +
    'genuine two-notion separation between the windowed widening-fit hump peak ' +
    'and the pointwise sigma=1/2 crossover, not a discretization artifact.',
  honest:
    'VIZ-DATA ONLY -- tabulates existing imp-33809/imp-33896/imp-33878 readings ' +
    'on one shared axis; adds no new derivation or measurement and changes no ' +
    'bound. No refereed bound is changed.',
};

export const IMP33914_ASSERTIONS = [
  {
    id: 'imp-33914-three-readings-present',
    description: 'exactly three hump-peak resolution readings are tabulated',
    holds: () => IMP33914_THREE_RESOLUTION_READINGS.length === 3,
  },
  {
    id: 'imp-33914-continuum-argmax-between-quarter-and-integer',
    description: 'the converged continuum argmax k* sits between the quarter-decade and integer readings',
    holds: () =>
      IMP33914_THREE_RESOLUTION_READINGS[1].k < IMP33914_THREE_RESOLUTION_READINGS[2].k &&
      IMP33914_THREE_RESOLUTION_READINGS[2].k < IMP33914_THREE_RESOLUTION_READINGS[0].k,
  },
  {
    id: 'imp-33914-gap-matches-imp33878',
    description: 'the k_cross - k* gap matches the imp-33878 G3 finding (~0.695, does not vanish)',
    holds: () => IMP33914_KCROSS_MINUS_KSTAR_GAP > 0.5 && IMP33914_KCROSS_MINUS_KSTAR_GAP < 0.9,
  },
];

for (const a of IMP33914_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33914-hump-peak-three-resolution-viz-data assertion failed: ${a.id}`);
  }
}
