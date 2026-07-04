/**
 * @module imp-33866-hump-peak-closed-form-viz-data
 * @fileoverview imp-33866 -- lightweight, import-light literal data for a
 *   visualization of the imp-33844 M3 hump-peak closed form against the
 *   imp-33809 measured per-decade curvature-hump amplitude ladder (k=6..13),
 *   making the leading-closed-form-overshoot -> p_ecoll-restored-tightening
 *   pattern legible: CF0 = ln10/32 ~ 7.19558e-2 overshoots the measured
 *   k=9 peak 6.47579e-2 by +11.12%, while the p_ecoll-restored closed form
 *   p_ecoll^2 ln10/8 ~ 6.55527e-2 tightens that to +1.23% (~9x closer).
 *
 *   Values below are baked reference literals reproduced by re-evaluating the
 *   imp-33809-saturation-curvature-hump-vs-k.js `HUMP_LADDER` and the
 *   imp-33844-hump-peak-closed-form.js `CF_PEAK_LEADING` / `CF_PEAK_CORRECTED`
 *   / residual formulas (identical inherited imp-3220/imp-3406 sub-terms);
 *   this module does NOT re-run that computation or import the heavy zeros
 *   bundle, so importing it into a page costs nothing at load time.
 *
 *   @see imp-33844-hump-peak-closed-form.js (the closed-form derivation + residuals)
 *   @see imp-33809-saturation-curvature-hump-vs-k.js (the measured per-decade hump ladder)
 *   @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form Banach crossover N ~ 3.2803e9)
 *
 *   Ticket: imp-33866 (content, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Measured per-decade curvature-hump amplitude, k=6..13 (imp-33809 HUMP_LADDER).
// Peaks at k=9, the E_coll = E_trunc crossover decade.
export const IMP33866_HUMP_LADDER = Object.freeze([
  { k: 6, decade: '1e6->1e7', hump: 2.3886e-2 },
  { k: 7, decade: '1e7->1e8', hump: 3.291e-2 },
  { k: 8, decade: '1e8->1e9', hump: 5.4863e-2 },
  { k: 9, decade: '1e9->1e10', hump: 6.4758e-2 },
  { k: 10, decade: '1e10->1e11', hump: 4.5058e-2 },
  { k: 11, decade: '1e11->1e12', hump: 2.0884e-2 },
  { k: 12, decade: '1e12->1e13', hump: 7.8506e-3 },
  { k: 13, decade: '1e13->1e14', hump: 2.7085e-3 },
]);

export const IMP33866_PEAK_K = 9; // E_coll = E_trunc crossover decade
export const IMP33866_PEAK_MEASURED = 6.47579e-2; // imp-33809/imp-33844 measured k=9 hump

// The two closed-form estimates of the peak (imp-33844), plotted as reference
// lines against the measured ladder to show the overshoot-then-tightening.
export const IMP33866_CLOSED_FORM_LEADING = Object.freeze({
  value: 7.19558e-2,
  label: 'CF0 = ln10/32 (p_ecoll -> 1/2 leading form)',
  residualPct: 11.12,
});

export const IMP33866_CLOSED_FORM_CORRECTED = Object.freeze({
  value: 6.55527e-2,
  label: 'p_ecoll^2 ln10/8 (measured p_ecoll ~ 0.47724 restored)',
  residualPct: 1.23,
});

export const IMP33866_TIGHTENING_FACTOR = 9.06; // |resid_leading| / |resid_corrected|
