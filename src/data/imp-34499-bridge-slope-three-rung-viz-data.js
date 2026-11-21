/**
 * @module imp-34499-bridge-slope-three-rung-viz-data
 * @fileoverview viz-data companion to imp-34454. imp-34454 tabulated the imp-34398 bridge
 *   quantity (the resid_exp local slope m) at three rungs -- near-zero bisected slope, the
 *   monomial's own flank-canonical prediction, and imp-34310's independently measured flank
 *   ratio -- confirming that the coefficient reading R = E_star/m and the exponent reading
 *   p = -1 are two readings of the SAME leading Laurent monomial g(k) ~ R (k - k*)^{-1}. No
 *   viz existed for this table. This module reshapes the imp-34454 exports VERBATIM (no
 *   recomputation) into per-rung bar-chart series for m, R and p.
 *
 *   Import-light: reuses only the imp-34454 IMP34454_RUNGS / IMP34454_SLOPE_SPREAD_PCT exports
 *   (no 16.7MB zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   NO QED. Viz-data reshaping only; the imp-34454 tabulation is UNCHANGED; C_mb GUE-conditional
 *   per imp-486 UNTOUCHED; changes no bound; no refereed bound is changed.
 *
 *   @see imp-34454-bridge-slope-three-rung-tabulation.js (source of the three-rung table)
 */

import {
  IMP34454_RUNGS,
  IMP34454_SLOPE_SPREAD_PCT,
  IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION,
} from './imp-34454-bridge-slope-three-rung-tabulation.js';

const T = IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION;

const RUNG_LABELS = ['near-zero slope', 'flank-canonical', 'flank-measured'];
const RUNG_COLORS = ['#38bdf8', '#4ade80', '#f59e0b'];

export const IMP34499_RUNG_ROWS = IMP34454_RUNGS.map((r, i) => ({
  key: r.rung,
  label: RUNG_LABELS[i],
  color: RUNG_COLORS[i],
  k: r.k,
  mSlope: r.mSlope,
  coeffR: r.coeffR,
  exponentP: r.exponentP,
}));

export const IMP34499_SLOPE_SPREAD_PCT = IMP34454_SLOPE_SPREAD_PCT;
export const IMP34499_KSTAR = T.kStar;
export const IMP34499_E_STAR = T.eStar;
export const IMP34499_REFERENCE_RESIDUE = T.imp34310Residue;
export const IMP34499_REFERENCE_EXPONENT = T.imp34247Exponent;

export const IMP34499_BRIDGE_SLOPE_THREE_RUNG_VIZ_DATA = {
  id: 'imp-34499',
  rungs: IMP34499_RUNG_ROWS,
  slopeSpreadPct: IMP34499_SLOPE_SPREAD_PCT,
  kStar: IMP34499_KSTAR,
  eStar: IMP34499_E_STAR,
  referenceResidue: IMP34499_REFERENCE_RESIDUE,
  referenceExponent: IMP34499_REFERENCE_EXPONENT,
  isRigorous: false,
};

export const IMP34499_ASSERTIONS = [
  {
    id: 'imp-34499-three-rung-rows-reproduce-imp34454-verbatim',
    description: 'the three rung rows reproduce the imp-34454 IMP34454_RUNGS mSlope/coeffR/exponentP exactly (===)',
    holds: () =>
      IMP34499_RUNG_ROWS.length === 3 &&
      IMP34499_RUNG_ROWS.every(
        (row, i) =>
          row.mSlope === IMP34454_RUNGS[i].mSlope &&
          row.coeffR === IMP34454_RUNGS[i].coeffR &&
          row.exponentP === IMP34454_RUNGS[i].exponentP,
      ),
  },
  {
    id: 'imp-34499-spread-matches-imp34454',
    description: 'the reported spread reproduces the imp-34454 ~8.38% spread exactly (===)',
    holds: () => IMP34499_SLOPE_SPREAD_PCT === IMP34454_SLOPE_SPREAD_PCT,
  },
  {
    id: 'imp-34499-all-slopes-negative-and-exponents-near-one',
    description: 'all three bridge-slope reads are negative and all three exponent reads are within 0.01 of 1',
    holds: () =>
      IMP34499_RUNG_ROWS.every((row) => row.mSlope < 0) &&
      IMP34499_RUNG_ROWS.every((row) => Math.abs(row.exponentP - 1) < 0.01),
  },
];

for (const a of IMP34499_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34499-bridge-slope-three-rung-viz-data assertion failed: ${a.id}`);
  }
}
