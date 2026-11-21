/**
 * @module imp-34244-kpss-l0-flip-shift-ranking-viz-data
 * @fileoverview imp-34244 -- import-light viz-data module for the imp-34155 per-rung KPSS l=0
 *   flip-shift ranking: all 21 imp-33858 residual rungs ranked by |flip shift| (the smallest
 *   single-rung residual perturbation that drops the un-HAC l=0 level KPSS statistic eta_mu below
 *   the 10% critical value 0.347). The head endpoint k=6.00 is cheapest (~0.00201), its neighbour
 *   k=6.25 second (~0.00353), and the far-tail endpoint k=11.00 third (~0.00509); the deep interior
 *   needs 4-19x larger shifts, so the borderline is endpoint-driven.
 *
 *   Values below are baked literals reproduced verbatim from the imp-34155 module's RANKED array
 *   (rounded the same way, 5/4/6 sig figs) so this module has NO imports and costs nothing to load
 *   into a page, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34155-kpss-l0-borderline-margin.js (source: full derivation, assertions, per-rung math)
 *   @see imp-34024-kpss-stationarity-bracket.js (the l=0 eta_mu ~0.3483 borderline being dissected)
 *   @see imp-33858-widening-fit-residual-localization.js (the head/far-tail endpoint localization)
 *
 *   Ticket: imp-34244 (ux, low). Presentation only; C_mb GUE-conditional per imp-486 UNTOUCHED;
 *   imp-3066 K_a >= 0 UNTOUCHED; NO QED; no refereed bound is changed.
 */

// All 21 imp-33858 residual rungs, ranked ascending by |flip shift| (cheapest first). Baked from
// the imp-34155 RANKED array; k = fit index, residual = signed imp-33858 residual e_k, deriv =
// d(eta_mu)/d(delta_r) at baseline, flipShift = smallest signed shift that drops eta_mu below 0.347.
export const IMP34244_RANKED_RUNGS = Object.freeze(
  [
    { k: 6.0, residual: -0.11419, deriv: 0.6387, flipShift: -0.002006 },
    { k: 6.25, residual: 0.01375, deriv: 0.362, flipShift: -0.003526 },
    { k: 11.0, residual: 0.24788, deriv: -0.2532, flipShift: 0.005092 },
    { k: 6.5, residual: 0.09405, deriv: 0.198, flipShift: -0.006361 },
    { k: 9.0, residual: -0.15246, deriv: -0.1431, flipShift: 0.008444 },
    { k: 8.75, residual: -0.13852, deriv: -0.1391, flipShift: 0.008658 },
    { k: 9.25, residual: -0.15153, deriv: -0.1323, flipShift: 0.009076 },
    { k: 8.5, residual: -0.11118, deriv: -0.1214, flipShift: 0.009773 },
    { k: 9.5, residual: -0.13503, deriv: -0.109, flipShift: 0.010822 },
    { k: 10.75, residual: 0.15754, deriv: -0.1141, flipShift: 0.011108 },
    { k: 6.75, residual: 0.13134, deriv: 0.1083, flipShift: -0.01114 },
    { k: 8.25, residual: -0.07283, deriv: -0.0934, flipShift: 0.012227 },
    { k: 9.75, residual: -0.10309, deriv: -0.0781, flipShift: 0.014414 },
    { k: 8.0, residual: -0.02669, deriv: -0.0601, flipShift: 0.017121 },
    { k: 7.0, residual: 0.13368, deriv: 0.0605, flipShift: -0.017752 },
    { k: 10.0, residual: -0.0564, deriv: -0.0489, flipShift: 0.020781 },
    { k: 10.5, residual: 0.07555, deriv: -0.0487, flipShift: 0.022746 },
    { k: 7.25, residual: 0.11051, deriv: 0.0305, flipShift: -0.026091 },
    { k: 7.75, residual: 0.02301, deriv: -0.0265, flipShift: 0.026766 },
    { k: 10.25, residual: 0.00369, deriv: -0.0337, flipShift: 0.027335 },
    { k: 7.5, residual: 0.07095, deriv: 0.0036, flipShift: -0.038679 },
  ].map((row, i) => Object.freeze({ ...row, rank: i + 1 }))
);

export const IMP34244_HEAD_CLUSTER_KS = Object.freeze([6.0, 6.25]);
export const IMP34244_FAR_TAIL_K = 11.0;
export const IMP34244_CRIT10 = 0.347;
export const IMP34244_RESID_RMS = 0.116039;

// Ratio of each rung's |flip shift| to the deep-interior minimum (the cheapest non-endpoint rung),
// showing the 4-19x factor named in the ticket/finding text.
const interiorFlipShifts = IMP34244_RANKED_RUNGS.filter(
  (r) => r.k !== 6.0 && r.k !== 6.25 && r.k !== 11.0
).map((r) => Math.abs(r.flipShift));
const deepInteriorMin = Math.min(...interiorFlipShifts);
export const IMP34244_DEEP_INTERIOR_MIN_FLIP_SHIFT = +deepInteriorMin.toFixed(6);
export const IMP34244_DEEP_INTERIOR_TO_HEAD_RATIO = +(deepInteriorMin / 0.002006).toFixed(2);
