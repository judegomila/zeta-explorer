/**
 * @module imp-33284-r40-inner-quadrature-ladder-viz-data
 * @fileoverview imp-33284 -- lightweight, import-light literal data for a
 *   visualization of the imp-33256 R_40 = |D_40|/|D_40^saddle| inner-quadrature
 *   O(h^4) convergence ladder: delta = |R_40(h_inner) - R_40_converged| plotted
 *   against the inner A(tau) Simpson panel width h_inner, with the informal
 *   ~1e-5 tie bar marked and the imp-3685 coarse native grid ([0,7]/1200,
 *   h_inner ~ 5.83e-3) shown as the outlier rung above the bar.
 *
 *   Values below are baked reference literals reproduced from a one-off
 *   evaluation of imp-33256-r40-inner-quadrature-sweep.js (its
 *   `measured.sweep` / `measured.r40CoarseImp3685Inner` /
 *   `measured.coarseDeltaVsRef` fields); this module does NOT re-run that
 *   self-computing quadrature sweep, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-33256-r40-inner-quadrature-sweep.js (the source measurement)
 *
 *   Ticket: imp-33284 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Primary inner sweep on [0,2]: h_inner = 2/panels, delta = |R_40(h) - R_40_converged|.
export const IMP33284_LADDER = Object.freeze([
  { hInner: 0.008, delta: 0.000033234931968495474, withinTieBar: false },
  { hInner: 0.006666666666666667, delta: 0.000018966242918860843, withinTieBar: false },
  { hInner: 0.005714285714285714, delta: 0.000011237912526551597, withinTieBar: false },
  { hInner: 0.005, delta: 0.0000069786797864956895, withinTieBar: true },
  { hInner: 0.0044444444444444444, delta: 0.00000452725064148396, withinTieBar: true },
  { hInner: 0.004, delta: 0.000003051342199134055, withinTieBar: true },
  { hInner: 0.0033333333333333335, delta: 0.0000015230028178603305, withinTieBar: true },
  { hInner: 0.0025, delta: 4.982635775085953e-7, withinTieBar: true },
  { hInner: 0.00125, delta: 3.207053289600026e-8, withinTieBar: true },
  { hInner: 0.000625, delta: 1.945979821726951e-9, withinTieBar: true },
  { hInner: 0.0004166666666666667, delta: 3.2142577488514235e-10, withinTieBar: true },
]);

// imp-3685 native coarse inner grid [0,7]/1200 (h_inner ~ 5.83e-3) -- the outlier rung,
// the ONLY point above the informal ~1e-5 tie bar.
export const IMP33284_COARSE_H_INNER = 7 / 1200;
export const IMP33284_COARSE_DELTA = 0.000012075534612687733;

// The informal tie bar itself.
export const IMP33284_TIE_BAR = 1e-5;

// The crossing rung: [0,2]/400 is the first (finest-to-coarsest) rung under the bar,
// [0,2]/350 is the last rung still above it.
export const IMP33284_TIE_BAR_CROSS_H = 0.005;
