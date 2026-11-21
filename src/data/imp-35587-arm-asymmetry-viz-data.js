/**
 * @module imp-35587-arm-asymmetry-viz-data
 * @fileoverview imp-35587 -- VIZ DATA ONLY for the imp-35451 interior sigma-peak arm-asymmetry
 *   table: the rising/falling plateau half-width imbalance W_rise - W_fall and the width ratio
 *   W_rise/W_fall across tol in {1e-4 .. 1e-7}, produced by the NEGATIVE cubic-skew coefficient
 *   c3 ~ -2.6237e-4 of the imp-35337/imp-3406 interior sigma-peak.
 *
 *   imp-35451 measured this four-row table (plus the cubic coefficient and its cross-check
 *   against the imbalance slope) but shipped no page, so the imbalance-narrows / ratio-flattens
 *   picture is not visually legible anywhere on the site.
 *
 *   Re-exports the imp-35451 arm_asymmetry.table directly (that module is import-light: pure
 *   Math plus effectiveHeightForN, no heavy dependency, never the 16.7MB zeros bundle), per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35451-sigma-peak-arm-asymmetry.js (the four-row table this re-exports)
 *   @see imp-35450-sigma-peak-curvature-direct-fd (the quadratic curvature k used in the cross-check)
 *   @see imp-35411-sigma-peak-plateau-width (the asymmetric endpoints imp-35451 explains)
 *   @see imp-35561-peak-height-map-sensitivity-viz-data.js (sibling import-light viz-data module, same pattern)
 *
 *   Ticket: imp-35587 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Discharges nothing; imp-35337a stays OPEN. C_C = (1/8) sqrt(3 pi)
 *   ansatz (imp-2642/imp-2643) UNTOUCHED. NO QED. No refereed bound is changed.
 */

import { IMP35451_SIGMA_PEAK_ARM_ASYMMETRY } from './imp-35451-sigma-peak-arm-asymmetry.js';

export const IMP35587_ARM_TABLE = IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.arm_asymmetry.table;

export const IMP35587_CONSTANTS = IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.constants;

export const IMP35587_CUBIC = IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.cubic_coefficient;

export const IMP35587_CROSS_CHECK = IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.cross_check_cubic_predicts_imbalance;

export const IMP35587_SUMMARY = Object.freeze({
  rowCount: IMP35587_ARM_TABLE.length,
  imbalanceLo: Math.min(...IMP35587_ARM_TABLE.map((r) => r.imbalance_decades)),
  imbalanceHi: Math.max(...IMP35587_ARM_TABLE.map((r) => r.imbalance_decades)),
  ratioLo: Math.min(...IMP35587_ARM_TABLE.map((r) => r.ratio)),
  ratioHi: Math.max(...IMP35587_ARM_TABLE.map((r) => r.ratio)),
  c3: IMP35587_CUBIC.c3_cubic_coefficient,
});

export default Object.freeze({
  id: 'imp-35587-arm-asymmetry-viz-data',
  ticket: 'imp-35587',
  sources: ['imp-35451-sigma-peak-arm-asymmetry.js'],
  rows: IMP35587_ARM_TABLE,
  constants: IMP35587_CONSTANTS,
  cubic: IMP35587_CUBIC,
  crossCheck: IMP35587_CROSS_CHECK,
  summary: IMP35587_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35587_ASSERTIONS = [
  {
    id: 'imp35587-four-rows-present',
    holds: () => IMP35587_ARM_TABLE.length === 4,
    why: 'The table must cover all four imp-35451 tol values (1e-4, 1e-5, 1e-6, 1e-7).',
  },
  {
    id: 'imp35587-ratio-decays-toward-one',
    holds: () =>
      IMP35587_ARM_TABLE[0].ratio > IMP35587_ARM_TABLE[IMP35587_ARM_TABLE.length - 1].ratio &&
      IMP35587_SUMMARY.ratioLo > 1 &&
      IMP35587_SUMMARY.ratioHi < 1.02,
    why: 'The width ratio W_rise/W_fall must decay monotonically toward 1 as tol shrinks, matching imp-35451 (1.01449 -> 1.00044).',
  },
  {
    id: 'imp35587-imbalance-positive-throughout',
    holds: () => IMP35587_ARM_TABLE.every((r) => r.imbalance_decades > 0),
    why: 'W_rise - W_fall must stay positive at every tol -- the rising arm is wider at every resolved depth.',
  },
  {
    id: 'imp35587-c3-negative',
    holds: () => IMP35587_SUMMARY.c3 < 0,
    why: 'The cubic-skew coefficient c3 must stay negative, matching the imp-35451 direct third-derivative measurement.',
  },
];

for (const assertion of IMP35587_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35587-arm-asymmetry-viz-data assertion failed: ${assertion.id}`);
  }
}
