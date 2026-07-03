/**
 * @module imp-3657-sigma-crossover-tc-closedform-pin-viz-data
 * @fileoverview imp-3657 -- lightweight, import-light literal data for a
 *   visualization of the imp-3620 imp-398 closed-form flow-factor pin.
 *
 *   Visualizes where the crossover-scale flow factor exp(C_G t_c(N_x)) lands
 *   inside the imp-3604 rigorous bracket [1, 1.000474] -- at 22.05% (C_G=1)
 *   to 44.09% (C_G=2), strictly BELOW the imp-3580 frozen node (which sat at
 *   the anchor worst case 1.000237, ~50% of the bracket) -- and the per-floor
 *   N_half/N_x ratio PINNED to a single value (0.997717 .. 0.993128) with a
 *   residual C_G spread far tighter than the imp-3604 flat-bracket spread.
 *
 *   Values below are baked reference literals taken from the imp-3604 and
 *   imp-3620 floorGrid exports (root-solved, residual < 1e-9). This module
 *   does NOT import either source module, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3620-sigma-crossover-tc-closedform-pin.js (the source derivation)
 *   @see imp-3604-sigma-crossover-flow-factor-invariance.js (the flat bracket this pins)
 *   @see imp-3614-sigma-crossover-floor-invariance-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-3657 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3657_BRACKET = Object.freeze({ min: 1, top: 1.0004741, frozen: 1.000237 });

export const IMP3657_CROSSOVER_FACTOR = Object.freeze({
  cg1: 1.0001045,
  cg2: 1.0002091,
  bracketFraction_cg1: 0.2205,
  bracketFraction_cg2: 0.4409,
  overStatementRatio: 2.27, // frozen exponent / closed-form C_G=1 exponent at N_x
});

// Half-to-double E_trunc floor grid: the imp-3604 flat-bracket ratio range
// (min/max across Gronwall in {1, exp(2.37e-4), exp(4.74e-4)}) vs the imp-3620
// closed-form PINNED ratio (C_G=1) and its own much-tighter residual C_G spread.
export const IMP3657_GRID = Object.freeze([
  { factor: 0.5, bracketMin: 0.997716, bracketMax: 0.997717, pinned: 0.997717, cgResidualSwing: 2.24e-7 },
  { factor: 0.75, bracketMin: 0.996835, bracketMax: 0.996836, pinned: 0.996836, cgResidualSwing: 3.22e-7 },
  { factor: 1.0, bracketMin: 0.996018, bracketMax: 0.99602, pinned: 0.996019, cgResidualSwing: 4.16e-7 },
  { factor: 1.5, bracketMin: 0.994512, bracketMax: 0.994515, pinned: 0.994514, cgResidualSwing: 5.97e-7 },
  { factor: 2.0, bracketMin: 0.993126, bracketMax: 0.993129, pinned: 0.993128, cgResidualSwing: 7.7e-7 },
]);

export const IMP3657_BASELINE = IMP3657_GRID.find((r) => r.factor === 1.0);

export const IMP3657_SWING_COMPARISON = Object.freeze({
  maxBracketSwing: 3e-6, // imp-3604 largest per-floor flat-bracket ratio_swing
  maxPinnedSwing: 7.7e-7, // imp-3620 largest per-floor cg_residual_swing
});
