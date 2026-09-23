/**
 * @module imp-95587-legb-straddle-vs-ratio-viz-data
 * @fileoverview imp-95587 -- lightweight, import-light literal data for a
 *   visualization of the imp-95561 LEG B DELTA_A straddle at the real
 *   port-derived window (p, D) = (3, 1): the two DELTA_A = A_m - A_p
 *   eigenvalues straddle zero (Loewner sandwich inconclusive) while the two
 *   direct generalized-pencil eigenvalues lambda_max(A_p,B_p) and
 *   lambda_max(A_m,B_m) still satisfy the ratio inequality paper <= model.
 *
 *   Values are baked reference literals reproduced from
 *   imp-95561-legb-d2-indefinite-straddle-witness.js (its exported
 *   IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS.portWindow_3_1 fields); this
 *   module does NOT re-run that eigendecomposition machinery, so importing it
 *   into a page costs nothing at load time and pulls in no zeros bundle.
 *
 *   @see imp-95561-legb-d2-indefinite-straddle-witness.js (source measurement)
 *   @see imp-95537 (D2: direct pencil comparison sharper than Loewner sandwich)
 *
 *   Ticket: imp-95587 (ux, low). Presentation only, RH-equivalent; LEG B
 *   uniformity (imp-95443) untouched; NO QED.
 */

// DELTA_A = A_m - A_p at the real port window (p, D) = (3, 1) -- full eigenpair.
export const IMP95587_DELTA_A_EIG_MIN = -0.0162701087409865;
export const IMP95587_DELTA_A_EIG_MAX = 0.09509971969320163;
export const IMP95587_DELTA_A_DET = -0.0015470528024015575; // eigMin * eigMax, < 0 => straddle
export const IMP95587_DELTA_A_TRACE = 0.07882961198221513;
export const IMP95587_DELTA_A_STRADDLES_ZERO = true;

// direct generalized-pencil eigenvalues (largest root of the definite pencil)
// at the same window: the ratio inequality that actually decides LEG B.
export const IMP95587_PAPER_LAMMAX = 0.03933416090409959; // lambda_max(A_p, B_p)
export const IMP95587_MODEL_LAMMAX = 0.7076767351647459; // lambda_max(A_m, B_m)
export const IMP95587_RATIO_INEQUALITY_HOLDS = IMP95587_PAPER_LAMMAX <= IMP95587_MODEL_LAMMAX;

// number-line reference points shared by both panels of the chart.
export const IMP95587_STRADDLE_POINTS = Object.freeze([
  { key: 'eigMin', value: IMP95587_DELTA_A_EIG_MIN, label: 'eigMin(DELTA_A)', color: '#f87171' },
  { key: 'eigMax', value: IMP95587_DELTA_A_EIG_MAX, label: 'eigMax(DELTA_A)', color: '#34d399' },
]);

export const IMP95587_RATIO_POINTS = Object.freeze([
  { key: 'paper', value: IMP95587_PAPER_LAMMAX, label: 'lambda_max(A_p,B_p)', color: '#38bdf8' },
  { key: 'model', value: IMP95587_MODEL_LAMMAX, label: 'lambda_max(A_m,B_m)', color: '#a78bfa' },
]);
