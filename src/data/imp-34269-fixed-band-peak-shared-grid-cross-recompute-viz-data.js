/**
 * @module imp-34269-fixed-band-peak-shared-grid-cross-recompute-viz-data
 * @fileoverview imp-34358 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34269 fixed-band (k<=10)
 *   peak shared-grid cross-recompute.
 *
 *   imp-34269 cross-recomputed the fixed-band peak at the six kEnd boundaries shared by
 *   the imp-34196 0.25-grid and the imp-34109 0.5-grid (17.0, 17.5, 18.0, 18.5, 19.0,
 *   19.5) from a SECOND, independently-written flat routine and found every recomputed
 *   peak matches BOTH stored modules to |diff| < 1e-6 (a genuine cross-recompute, not a
 *   re-read of the same code path), that the band argmax rung agrees at every node
 *   (un-locking 6.50 -> 6.25 at kEnd = 19.0), and that the 0.25-grid bins are
 *   step-function-flat at sub-rung resolution (the interior increment at kEnd + 0.125 is
 *   exactly zero at all six boundaries).
 *
 *   All numbers are baked reference literals copied from the imp-34269 module exports --
 *   this module does not import imp-34269 (or its lambda-rh-height-mapping /
 *   polymath15-constant-C-C dependency chain) so pages consuming it stay import-light.
 *
 *   @see imp-34269-fixed-band-peak-shared-grid-cross-recompute.js (source measurement)
 *   @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine.js (the 0.25-grid row cross-checked)
 *   @see imp-34109-fixed-band-peak-amplitude-saturation-fit.js (the 0.5-grid row cross-checked)
 *   @see imp-34268-fixed-band-peak-reaccel-convexity-stitch-viz-data.js (same viz-data pattern, adjacent cohort)
 *
 *   Ticket: imp-34358 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// The six shared kEnd boundaries the imp-34196 0.25-grid and the imp-34109 0.5-grid have in common.
export const IMP34269_SHARED_KENDS = Object.freeze([17.0, 17.5, 18.0, 18.5, 19.0, 19.5]);

// Sub-rung probe offset -- finer than the 0.25 ladder spacing, so it adds no new rung.
export const IMP34269_SUB_RUNG_OFFSET = 0.125;

// The full cross-recompute row set: independent-path peak/argmax vs. both stored modules, plus the
// pre-rounding raw diff (before the toFixed(6) storage floor) and the sub-rung interior increment.
export const IMP34269_CROSS_ROWS = Object.freeze([
  { kEnd: 17.0, recomputedPeak: 0.648552, recomputedAtK: 6.5, imp34196Peak: 0.648552, imp34109Peak: 0.648552, rawDiff: -3.349e-7, subRungIncrement: 0 },
  { kEnd: 17.5, recomputedPeak: 0.685053, recomputedAtK: 6.5, imp34196Peak: 0.685053, imp34109Peak: 0.685053, rawDiff: -2.936e-7, subRungIncrement: 0 },
  { kEnd: 18.0, recomputedPeak: 0.71989, recomputedAtK: 6.5, imp34196Peak: 0.71989, imp34109Peak: 0.71989, rawDiff: 5.607e-8, subRungIncrement: 0 },
  { kEnd: 18.5, recomputedPeak: 0.75359, recomputedAtK: 6.5, imp34196Peak: 0.75359, imp34109Peak: 0.75359, rawDiff: -1.854e-7, subRungIncrement: 0 },
  { kEnd: 19.0, recomputedPeak: 0.787888, recomputedAtK: 6.25, imp34196Peak: 0.787888, imp34109Peak: 0.787888, rawDiff: -2.158e-7, subRungIncrement: 0 },
  { kEnd: 19.5, recomputedPeak: 0.824645, recomputedAtK: 6.25, imp34196Peak: 0.824645, imp34109Peak: 0.824645, rawDiff: -1.568e-7, subRungIncrement: 0 },
]);

export const IMP34269_MAX_RAW_DIFF = 3.349e-7; // largest pre-rounding cross-recompute diff, still < 1e-6
export const IMP34269_ALL_MATCH_196 = true;
export const IMP34269_ALL_MATCH_109 = true;
export const IMP34269_ALL_ARGMAX_MATCH = true;
export const IMP34269_ALL_SUB_RUNG_FLAT = true;
export const IMP34269_ARGMAX_UNLOCKS_AT_19 = true; // 6.50 through 18.5, then 6.25 at 19.0, 19.5

export const IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE_VIZ_DATA = {
  ticket: 'imp-34358',
  sourceTicket: 'imp-34269',
  sharedKEnds: IMP34269_SHARED_KENDS,
  subRungOffset: IMP34269_SUB_RUNG_OFFSET,
  crossRows: IMP34269_CROSS_ROWS,
  maxRawDiff: IMP34269_MAX_RAW_DIFF,
  allMatch196: IMP34269_ALL_MATCH_196,
  allMatch109: IMP34269_ALL_MATCH_109,
  allArgmaxMatch: IMP34269_ALL_ARGMAX_MATCH,
  allSubRungFlat: IMP34269_ALL_SUB_RUNG_FLAT,
  argmaxUnlocksAt19: IMP34269_ARGMAX_UNLOCKS_AT_19,
  note:
    'Cross-recomputing the fixed-band (k<=10) peak at the six kEnd boundaries shared by the imp-34196 ' +
    '0.25-grid and the imp-34109 0.5-grid, from a second independently-written flat routine, confirms all ' +
    'six peaks agree with BOTH stored modules to |diff| < 1e-6 (max ~3.3e-7 pre-rounding) and the band ' +
    'argmax rung agrees at every node, un-locking from 6.50 to 6.25 at kEnd = 19.0. The 0.25-grid bins are ' +
    'step-function-flat at sub-rung resolution -- the interior increment at kEnd + 0.125 is exactly zero.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34269 measurement; adds no new derivation and ' +
    'changes no bound. Verification/cross-recompute only, NOT a rigorous asymptotic; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34269_VIZ_ASSERTIONS = [
  {
    id: 'imp34358-six-shared-kends-cross-recompute-matches-both',
    description: 'six shared kEnds; recomputed peak matches imp-34196 and imp-34109; max raw diff < 1e-6',
    holds: () =>
      IMP34269_CROSS_ROWS.length === 6 &&
      IMP34269_ALL_MATCH_196 === true &&
      IMP34269_ALL_MATCH_109 === true &&
      IMP34269_MAX_RAW_DIFF < 1e-6 &&
      IMP34269_CROSS_ROWS.every((r) => Math.abs(r.recomputedPeak - r.imp34196Peak) < 1e-6 && Math.abs(r.recomputedPeak - r.imp34109Peak) < 1e-6),
  },
  {
    id: 'imp34358-argmax-agrees-and-unlocks-at-19',
    description: 'argmax rung agrees at all six nodes; 6.50 through 18.5 then 6.25 at 19.0/19.5',
    holds: () =>
      IMP34269_ALL_ARGMAX_MATCH === true &&
      IMP34269_ARGMAX_UNLOCKS_AT_19 === true &&
      IMP34269_CROSS_ROWS[0].recomputedAtK === 6.5 &&
      IMP34269_CROSS_ROWS[IMP34269_CROSS_ROWS.length - 1].recomputedAtK === 6.25,
  },
  {
    id: 'imp34358-sub-rung-bins-step-function-flat',
    description: 'interior increment at kEnd + 0.125 is exactly zero at all six boundaries',
    holds: () =>
      IMP34269_ALL_SUB_RUNG_FLAT === true &&
      IMP34269_SUB_RUNG_OFFSET < 0.25 &&
      IMP34269_CROSS_ROWS.every((r) => r.subRungIncrement === 0),
  },
  {
    id: 'imp34358-honesty-gate-no-qed',
    description: 'honest status references verification-only, NOT rigorous, NO QED, no refereed bound is changed',
    holds: () =>
      /NOT a rigorous asymptotic/.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE_VIZ_DATA.honest) &&
      /NO QED/.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE_VIZ_DATA.honest),
  },
];

for (const a of IMP34269_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34269-fixed-band-peak-shared-grid-cross-recompute-viz-data assertion failed: ${a.id}`);
  }
}
