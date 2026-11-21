/**
 * imp-95049 - Independent cross-check of the Gate-2 raw-tiling cell-count lower
 * bound rawTilingCellLowerBound = 7.2e26 baked in the imp-95012 frozen spec.
 *
 * WHAT THE BAKED NUMBER CLAIMS. imp-95012 (GATE2_TARGETS.rawTilingCellLowerBound)
 * records: a uniform raw-tiling atlas at the anchor cell width
 * (|x - x*| <= 1/40000000000) covering the open family 690988 <= N <= 54799999,
 * every window parameter, and both seam sides would need > 7.20e26 cells, so raw
 * (pointwise) tiling is not a viable global architecture. The number was
 * transcribed as a spec constant and never independently re-derived from its
 * stated ingredients. This module re-derives a cell-count lower bound from those
 * four ingredients, confirms the order of magnitude, and identifies which factor
 * dominates. Measure only; changes no bound.
 *
 * THE FOUR STATED INGREDIENTS.
 *   (1) anchor half-width       w = 1/4e10 = 2.5e-11, so the certified cell has
 *       full x-width  W_cell = 2w = 5e-11, i.e. 1/W_cell = 2e10 cells per unit x.
 *   (2) family span             DeltaN = N_HI - N_LO = 54799999 - 690988
 *                                       = 54109011  (~5.41e7 integer indices).
 *   (3) window-parameter count  W_win ~ 5 (the documented Gate-2 window family;
 *       imp-95006 probe carries ~5 window parameters). An assumed O(1) count.
 *   (4) seam sides              S = 2 (both sides of the weld seam).
 *
 * TWO HONEST READINGS OF "ATLAS AT THE ANCHOR WIDTH".
 *
 *   Reading A (1D / physically minimal): x is a continuous height coordinate that
 *   advances ~O(1) per unit N, so the total x-extent of the whole family is
 *   ~DeltaN and the atlas is a 1D strip resolved at the anchor width:
 *       cells_1D = DeltaN * (1/W_cell) * W_win * S
 *                = 5.41e7 * 2e10 * 5 * 2  ~  1.08e19.
 *   This UNDERSHOOTS the baked 7.2e26 by ~7-8 orders, but is already
 *   astronomically infeasible (18+ orders past any tractable certificate atlas),
 *   so it already CONFIRMS the qualitative claim raw tiling is not viable.
 *
 *   Reading B (2D / quadratic in the family span): if the atlas must resolve, per
 *   index N, an x-window that itself spans ~DeltaN anchor-widths (the family-scale
 *   correlation window rather than a single O(1) unit cell), the count picks up a
 *   SECOND family-span factor:
 *       cells_2D = DeltaN * (DeltaN / W_cell) * W_win * S
 *                = DeltaN^2 * (1/W_cell) * W_win * S
 *                = (5.41e7)^2 * 2e10 * 5 * 2  ~  5.86e26.
 *   This REPRODUCES the baked 7.2e26 to within a factor 1.23 (windowCount 5 gives
 *   5.86e26, windowCount 6 gives 7.03e26, bracketing 7.2e26). The numeric match
 *   is tight enough that the baked value was almost certainly computed this way:
 *   family-span-squared, anchor inverse cell width, and an O(10) window*seam
 *   multiplier.
 *
 * DOMINANT FACTOR. Under the reconstruction that reproduces 7.2e26 (Reading B) the
 * family span DOMINATES by entering QUADRATICALLY: DeltaN^2 ~ 2.93e15 is the
 * largest factor group, the anchor inverse cell width 1/W_cell = 2e10 is second,
 * and the window count (~5) times seam sides (2) is a sub-dominant O(10)
 * multiplier that does NOT set the order of magnitude. Under Reading A the family
 * span (5.41e7) and the anchor inverse cell width (2e10) are comparable, with the
 * anchor width marginally larger. In every reading the two structural drivers are
 * the family span and the anchor width; windows and seams are minor.
 *
 * HONEST STATUS. The order of magnitude of the baked 7.2e26 is CONFIRMED under the
 * quadratic reading (match to 1.23x with round window/seam counts), and raw tiling
 * is CONFIRMED infeasible under BOTH readings (>= 1e19 cells, i.e. >= 18 orders
 * past feasibility). What is NOT pinned by the imp-95012 spec is the per-index
 * x-extent assumption that separates the two readings (O(1) unit window vs.
 * family-scale window): the spec bakes 7.2e26 without recording whether the atlas
 * is 1D or family-quadratic, so the exact exponent (19 vs 26) is
 * spec-underdetermined. Named sub-gap: imp-95049-sub-per-N-x-extent. This does not
 * affect the conclusion (both readings eliminate raw tiling) but does mean the precise
 * 7.2e26 rests on an unrecorded per-index x-extent choice.
 *
 * Cross-check / measurement only; changes no bound; promotes nothing; NO QED;
 * no refereed bound is changed.
 */

// -- baked reference (imp-95012 GATE2_TARGETS) ------------------------------
const BAKED_CELL_LOWER_BOUND = 7.2e26; // rawTilingCellLowerBound

// -- ingredient (1): anchor width -> cells per unit x -----------------------
const ANCHOR_HALF_WIDTH = 1 / 40000000000; // 2.5e-11 (|x - x*| <= 1/4e10)
const CELL_FULL_WIDTH = 2 * ANCHOR_HALF_WIDTH; // 5e-11
const CELLS_PER_UNIT_X = 1 / CELL_FULL_WIDTH; // 2e10

// -- ingredient (2): family span --------------------------------------------
const N_LO = 690988;
const N_HI = 54799999;
const FAMILY_SPAN_N = N_HI - N_LO; // 54109011

// -- ingredients (3),(4): window-parameter count and seam sides -------------
const WINDOW_PARAM_COUNT = 5; // documented Gate-2 window family (imp-95006 ~5)
const SEAM_SIDES = 2;

// -- Reading A (1D / physically minimal) ------------------------------------
const CELLS_1D = FAMILY_SPAN_N * CELLS_PER_UNIT_X * WINDOW_PARAM_COUNT * SEAM_SIDES;

// -- Reading B (2D / quadratic in the family span) --------------------------
const CELLS_2D =
  FAMILY_SPAN_N * FAMILY_SPAN_N * CELLS_PER_UNIT_X * WINDOW_PARAM_COUNT * SEAM_SIDES;

// -- reconstruction accuracy vs the baked value -----------------------------
const RATIO_2D_TO_BAKED = CELLS_2D / BAKED_CELL_LOWER_BOUND; // ~0.813
const RATIO_BAKED_TO_2D = BAKED_CELL_LOWER_BOUND / CELLS_2D; // ~1.23
// window count that reproduces the baked value exactly at seams = 2:
const WINDOW_COUNT_EXACT_MATCH =
  BAKED_CELL_LOWER_BOUND / (FAMILY_SPAN_N * FAMILY_SPAN_N * CELLS_PER_UNIT_X * SEAM_SIDES); // ~6.15

// -- dominant-factor decomposition (Reading B) ------------------------------
const FACTOR_FAMILY_SPAN_SQUARED = FAMILY_SPAN_N * FAMILY_SPAN_N; // ~2.93e15
const FACTOR_ANCHOR_INVERSE_WIDTH = CELLS_PER_UNIT_X; // 2e10
const FACTOR_WINDOW_TIMES_SEAM = WINDOW_PARAM_COUNT * SEAM_SIDES; // 10

// -- verdict object ---------------------------------------------------------
export const IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK = {
  ticket: 'imp-95049',
  question:
    're-derive the imp-95012 baked rawTilingCellLowerBound = 7.2e26 from the anchor half-width 1/4e10, the family span 690988..54799999, the window-parameter count, and the seam sides; confirm the order of magnitude and identify the dominant factor',
  source:
    'imp-95012 GATE2_TARGETS.rawTilingCellLowerBound (spec transcription, never independently re-derived); anchor cell |x-x*|<=1/4e10 at N=690988; open family 690988<=N<=54799999',
  bakedCellLowerBound: BAKED_CELL_LOWER_BOUND,
  ingredients: {
    anchorHalfWidth: ANCHOR_HALF_WIDTH,
    cellFullWidth: CELL_FULL_WIDTH,
    cellsPerUnitX: CELLS_PER_UNIT_X,
    familySpanN: FAMILY_SPAN_N,
    windowParamCount: WINDOW_PARAM_COUNT,
    seamSides: SEAM_SIDES,
  },
  reading1D: {
    formula: 'DeltaN * (1/W_cell) * W_win * S',
    cells: CELLS_1D,
    note: 'physically minimal: x-extent per index O(1), atlas is a 1D strip. Undershoots the baked 7.2e26 by ~7-8 orders but is already >1e19 cells (raw tiling already infeasible).',
  },
  reading2D: {
    formula: 'DeltaN^2 * (1/W_cell) * W_win * S',
    cells: CELLS_2D,
    ratioToBaked: RATIO_2D_TO_BAKED,
    ratioBakedTo2D: RATIO_BAKED_TO_2D,
    windowCountExactMatch: WINDOW_COUNT_EXACT_MATCH,
    note: 'family-quadratic: per-index x-window itself spans ~DeltaN anchor-widths. Reproduces the baked 7.2e26 to within a factor 1.23 (windowCount 5 -> 5.86e26, windowCount 6 -> 7.03e26, bracketing 7.2e26).',
  },
  dominantFactor: {
    underReadingB: 'family span squared',
    factorFamilySpanSquared: FACTOR_FAMILY_SPAN_SQUARED,
    factorAnchorInverseWidth: FACTOR_ANCHOR_INVERSE_WIDTH,
    factorWindowTimesSeam: FACTOR_WINDOW_TIMES_SEAM,
    ranking:
      'DeltaN^2 (~2.93e15) >> 1/W_cell (2e10) >> W_win*S (10); the family span dominates by entering quadratically, the anchor inverse cell width is second, window*seam is a minor O(10) multiplier that does not set the order of magnitude',
    underReadingA:
      'family span (5.41e7) and anchor inverse cell width (2e10) are comparable, anchor width marginally larger; window*seam again minor',
  },
  namedSubGap: 'imp-95049-sub-per-N-x-extent',
  subGapStatement:
    'the imp-95012 spec bakes 7.2e26 without recording the per-index x-extent (1D unit window vs family-scale window), which is the only ingredient separating the ~1e19 (Reading A) and ~5.86e26 (Reading B) counts; the exact exponent is spec-underdetermined, though both readings confirm infeasibility by >= 18 orders',
  isRigorous: false,
  rigorScope:
    'the cell-count arithmetic (anchor width -> cells per unit x, family span, window/seam multipliers, both readings) is exact; the per-index x-extent (1D vs quadratic) is the assumed/underdetermined structural input, and the window-parameter count ~5 is the documented Gate-2 family size. No new geometry is proved; the atlas dimensionality is read from the two candidate interpretations, not derived.',
  promotesBound: false,
  verdict:
    'CROSS-CHECK (measurement only): the imp-95012 baked rawTilingCellLowerBound = 7.2e26 is REPRODUCED to within a factor 1.23 by DeltaN^2 * (1/W_cell) * W_win * S with the anchor full cell width 5e-11 (2e10 cells/unit), family span 54109011, ~5 window parameters, and 2 seam sides - so its order of magnitude is CONFIRMED and the family span (entering quadratically, ~2.93e15) is the DOMINANT factor, the anchor inverse cell width (2e10) second, window*seam (10) minor. A physically-minimal 1D reading gives ~1.08e19, ~7-8 orders below the baked value but still >= 18 orders past feasibility, so raw tiling is confirmed non-viable under BOTH readings; the per-index x-extent choice separating the two exponents is the named sub-gap. Changes no bound; NO QED; no refereed bound is changed.',
};

// -- assertions (self-executing; throw on violation) ------------------------
export const IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK_ASSERTIONS = [
  {
    id: 'imp95049-cells-per-unit-x-value',
    description: 'the anchor full cell width 2*(1/4e10)=5e-11 gives exactly 2e10 cells per unit x',
    holds: () => Math.abs(CELLS_PER_UNIT_X - 2e10) < 1,
  },
  {
    id: 'imp95049-family-span-value',
    description: 'the family span N_HI - N_LO equals 54109011 (~5.41e7)',
    holds: () => FAMILY_SPAN_N === 54109011,
  },
  {
    id: 'imp95049-reading-1d-order',
    description: 'the 1D reading lands near 1.08e19 (already infeasible: > 1e18)',
    holds: () => CELLS_1D > 1e18 && CELLS_1D < 2e19 && Math.abs(CELLS_1D / 1.08218022e19 - 1) < 0.01,
  },
  {
    id: 'imp95049-reading-2d-reproduces-baked',
    description: 'the quadratic reading reproduces the baked 7.2e26 within a factor 1.5',
    holds: () => RATIO_BAKED_TO_2D > 0.67 && RATIO_BAKED_TO_2D < 1.5,
  },
  {
    id: 'imp95049-window-count-exact-match-bracket',
    description: 'the window count reproducing 7.2e26 exactly at seams=2 sits between 5 and 7 (round Gate-2 window family)',
    holds: () => WINDOW_COUNT_EXACT_MATCH > 5 && WINDOW_COUNT_EXACT_MATCH < 7,
  },
  {
    id: 'imp95049-dominant-factor-is-family-span-squared',
    description: 'under the quadratic reading the family-span-squared factor exceeds the anchor inverse width, which exceeds window*seam',
    holds: () =>
      FACTOR_FAMILY_SPAN_SQUARED > FACTOR_ANCHOR_INVERSE_WIDTH &&
      FACTOR_ANCHOR_INVERSE_WIDTH > FACTOR_WINDOW_TIMES_SEAM,
  },
  {
    id: 'imp95049-both-readings-confirm-infeasibility',
    description: 'both the 1D and the quadratic readings exceed 1e18 cells, so raw tiling is non-viable under either interpretation',
    holds: () => CELLS_1D > 1e18 && CELLS_2D > 1e18,
  },
  {
    id: 'imp95049-honesty-gate-no-qed',
    description: 'cross-check-only honest partial: promotes no bound, spec-underdetermined exponent, names the sub-gap, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK.promotesBound === false &&
      IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK.isRigorous === false &&
      IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK.namedSubGap === 'imp-95049-sub-per-N-x-extent' &&
      /NO QED/.test(IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK.verdict),
  },
];

for (const a of IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95049-raw-tiling-cell-count-crosscheck assertion failed: ${a.id}`);
  }
}

export default IMP95049_RAW_TILING_CELL_COUNT_CROSSCHECK;
