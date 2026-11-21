/**
 * @module imp-95993-worst-alias-margin-viz-data
 * @fileoverview imp-95993 -- lightweight viz-data module charting the imp-95962
 *   worst-alias collar-depth measurement across its four witness windows: the
 *   Airy support-condition clearance dMin = a_1/mu_ctrl (the threshold the
 *   imp-95961 turning-point geometry must supply), the alias seam depth dSeam
 *   that already meets it, and the growing margin = dSeam - dMin.
 *
 *   Reuses the imp-95962 baked table verbatim (same reuse pattern as
 *   imp-95888): no re-derivation, no new cited input, no heavy imports (no
 *   zeros bundle, no sibling data beyond imp-95962 itself).
 *
 *   @see imp-95962-worst-alias-collar-depth-threshold.js (the measurement this charts)
 */

import { IMP95962_WORST_ALIAS_COLLAR_DEPTH } from './imp-95962-worst-alias-collar-depth-threshold.js';

const { thresholds: THRESHOLDS } = IMP95962_WORST_ALIAS_COLLAR_DEPTH.constants;

export const IMP95993_A1 = IMP95962_WORST_ALIAS_COLLAR_DEPTH.a1;

export const IMP95993_MARGIN_ROWS = Object.freeze(
  THRESHOLDS.map((row) =>
    Object.freeze({
      label: `(${row.p},${row.k})`,
      p: row.p,
      k: row.k,
      ctrlH: row.ctrlH,
      muCtrl: row.muCtrl,
      dMin: row.dMin,
      dSeam: row.dSeam,
      margin: row.margin,
      clearanceRatio: +(row.dSeam / row.dMin).toFixed(6),
    }),
  ),
);

export const IMP95993_CAVEAT_BANNER =
  'HONEST STATUS: dMin = a_1/mu_ctrl is the Airy support-condition threshold the imp-95961 ' +
  'turning-point-depth geometry must supply; dSeam is the alias seam depth used here as a ' +
  'stand-in for the true turning-point depth, which is imp-95961 leg (i) and STILL OPEN. The ' +
  'margin (dSeam - dMin) is positive and growing across the four witness windows, but that ' +
  'only shows the seam-depth stand-in clears the threshold -- it does not establish that the ' +
  'true Section 4.5 turning point sits at or above dSeam. Introduces no new cited input and ' +
  'changes no bound; no refereed bound is changed. No QED.';

export const IMP95993_WORST_ALIAS_MARGIN_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95993-rows-match-source-count-and-order',
    description: 'the reshaped rows match the imp-95962 baked table exactly, in witness-window order',
    holds: () =>
      IMP95993_MARGIN_ROWS.length === THRESHOLDS.length &&
      IMP95993_MARGIN_ROWS.every(
        (r, i) => r.p === THRESHOLDS[i].p && r.k === THRESHOLDS[i].k && r.margin === THRESHOLDS[i].margin,
      ),
  },
  {
    id: 'imp95993-dmin-descends-margin-ascends',
    description: 'dMin is monotonically decreasing and margin is monotonically increasing across windows',
    holds: () =>
      IMP95993_MARGIN_ROWS.every(
        (r, i) => i === 0 || (r.dMin < IMP95993_MARGIN_ROWS[i - 1].dMin && r.margin > IMP95993_MARGIN_ROWS[i - 1].margin),
      ),
  },
  {
    id: 'imp95993-clearance-ratio-exceeds-one-everywhere',
    description: 'the clearance ratio dSeam/dMin exceeds 1 at every witness window (positive margin)',
    holds: () => IMP95993_MARGIN_ROWS.every((r) => r.clearanceRatio > 1),
  },
  {
    id: 'imp95993-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS, names the STILL OPEN leg, and flags no QED',
    holds: () =>
      /HONEST STATUS/.test(IMP95993_CAVEAT_BANNER) &&
      /STILL OPEN/.test(IMP95993_CAVEAT_BANNER) &&
      /No QED/.test(IMP95993_CAVEAT_BANNER),
  },
];

for (const a of IMP95993_WORST_ALIAS_MARGIN_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95993-worst-alias-margin-viz-data assertion failed: ${a.id}`);
  }
}
