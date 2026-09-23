/**
 * @module imp-95737-half-retention-scale-viz-data
 *
 * imp-95737 (presentation, import-light): chart-ready viz data for the imp-95703
 * half-retention D_cross(delta) closed-form derivation. Reshapes the four
 * imp-95703 crossoverDerivation rows (delta, the full-sum root of the seam-symbol
 * equation, the explicit leading-log closed form, the true 40-pair crossover, and
 * the imp-95693 tabulated value) into a delta-ordered array for a small
 * multi-series chart plus a full comparison table.
 *
 * All numbers are re-exported verbatim from imp-95703 (no re-derivation, no fresh
 * computation, no zeros bundle import). Presentation only; changes no bound; NO QED.
 *
 * @see imp-95703-twin-pair-half-retention-scale-derivation (source of every number below)
 * @see imp-95693-twin-pair-block-floor-second-delta (the tabulated D_cross this derives)
 */

import { IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE } from './imp-95703-twin-pair-half-retention-scale-derivation.js';

const rows = IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE.crossoverDerivation;

export const IMP95737_HALF_RETENTION_SCALE_ROWS = rows.map((r) => ({
  label: r.label,
  delta: r.delta,
  blockIso: r.blockIso,
  DpredFull: r.DpredFull,
  Dlog: r.Dlog,
  Dtrue40: r.Dtrue40,
  tabulated: r.tabulated,
}));

export const IMP95737_MAX_FULL_SUM_ABS_RESIDUAL =
  IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE.fullSumMaxAbsResidual;
export const IMP95737_MAX_LEADING_LOG_REL_RESIDUAL =
  IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE.leadingLogMaxRelResidual;

export const IMP95737_CAPTION =
  'The imp-95703 single-sum seam-symbol root (full-sum closed form) reproduces ' +
  'every imp-95693 tabulated D_cross to < ' +
  IMP95737_MAX_FULL_SUM_ABS_RESIDUAL +
  ' absolute across the ln1.2..ln2.0 delta range; the explicit leading-log form ' +
  'D_cross ~ 2 ln[4(1-e^-delta/2)^2/(1-sech(delta/2))] matches to ~' +
  (IMP95737_MAX_LEADING_LOG_REL_RESIDUAL * 100).toFixed(1) +
  '% and shows D_cross is logarithmic in delta, deriving the observed delta-stability.';
