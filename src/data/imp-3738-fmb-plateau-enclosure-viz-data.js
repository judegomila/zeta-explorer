/**
 * @module imp-3738-fmb-plateau-enclosure-viz-data
 * @fileoverview imp-3738 -- lightweight, import-light literal data for a
 *   visualization of the imp-3725 per-plateau F_mb two-sided true-flow
 *   enclosure 0 <= F_mb(N) <= (H^2/8)(1/theta_N2 - 1) across the 10
 *   H_raw-plateaus tiling [1e4, 1e6], contrasted with the retired imp-963
 *   carryforward K = 0.2014 heuristic.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3725-fmb-plateau-domination-lemma.js (ROWS: startN, endN, H, theta,
 *   FmbUpper, KpaperBound). This module does NOT import the Odlyzko zeros
 *   bundle or the imp-3725 module itself, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3725-fmb-plateau-domination-lemma.js (source lemma + full rows)
 *
 *   Ticket: imp-3738 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3738_PLATEAU_ROWS = Object.freeze([
  { plateauIndex: 0, startN: 10000,  endN: 18859,   H: 0.0376985,  theta: 0.9982270443, FmbUpper: 3.1551985e-7,  KpaperBound: 1.30125178e-6 },
  { plateauIndex: 1, startN: 18860,  endN: 44555,   H: 0.03530732, theta: 0.9971594513, FmbUpper: 4.43891849e-7, KpaperBound: 2.42370832e-6 },
  { plateauIndex: 2, startN: 44556,  endN: 73997,   H: 0.02953763, theta: 0.9985294971, FmbUpper: 1.60607652e-7, KpaperBound: 9.02672264e-7 },
  { plateauIndex: 3, startN: 73998,  endN: 82552,   H: 0.02583928, theta: 0.9984769068, FmbUpper: 1.27309053e-7, KpaperBound: 6.54737796e-7 },
  { plateauIndex: 4, startN: 82553,  endN: 87761,   H: 0.0208495,  theta: 0.9988376096, FmbUpper: 6.32351372e-8, KpaperBound: 2.69108783e-7 },
  { plateauIndex: 5, startN: 87762,  endN: 95248,   H: 0.01948463, theta: 0.9990452442, FmbUpper: 4.53525171e-8, KpaperBound: 1.86565768e-7 },
  { plateauIndex: 6, startN: 95249,  endN: 354769,  H: 0.01470148, theta: 0.9994921604, FmbUpper: 1.37271093e-8, KpaperBound: 7.37673527e-8 },
  { plateauIndex: 7, startN: 354770, endN: 415587,  H: 0.01305322, theta: 0.9993238137, FmbUpper: 1.44113689e-8, KpaperBound: 7.35124561e-8 },
  { plateauIndex: 8, startN: 415588, endN: 420891,  H: 0.00863639, theta: 0.9997542897, FmbUpper: 2.2914189e-9,  KpaperBound: 7.77504944e-9 },
  { plateauIndex: 9, startN: 420892, endN: 1000000, H: 0.00570371, theta: 0.9998958047, FmbUpper: 4.23757546e-10, KpaperBound: 1.37202908e-9 },
]);

export const IMP3738_K_PAPER_MAX = Math.max(...IMP3738_PLATEAU_ROWS.map((r) => r.KpaperBound));
export const IMP3738_CARRYFORWARD_K = 0.2014;
export const IMP3738_MARGIN_FACTOR = IMP3738_CARRYFORWARD_K / IMP3738_K_PAPER_MAX;
