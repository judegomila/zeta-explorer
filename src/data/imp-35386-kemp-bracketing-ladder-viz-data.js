/**
 * @module imp-35386-kemp-bracketing-ladder-viz-data
 *
 * imp-35386 (ux): lightweight, import-light viz-data module for a chart of the imp-35264
 * empirical prefactor kEmp(eps) across the imp-35076 ladder, bracketing the imp-35240
 * confirmed closed form K = 8 sqrt(2)/(9 pi) = 0.4001405850. Reference literals are baked
 * from the imp-35264 measured crosscheck table (self-computing at import there) -- no
 * re-derivation here.
 *
 * @see imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck.js (source module: crosscheck, kClosedForm)
 *
 * Ticket: imp-35386 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 * no refereed bound is changed; NO QED.
 */

import { IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK } from './imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck.js';

export const IMP35386_K_CLOSED_FORM = IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.kClosedForm;

export const IMP35386_LADDER = IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.crosscheck.map((r) => ({
  N: r.N,
  eps: r.eps,
  log10Eps: +Math.log10(r.eps).toFixed(4),
  kEmpirical: r.kEmpirical,
}));

// The two ladder ENDS with understood causes for their departure from K (imp-35264 diagnosis).
export const IMP35386_COARSEST_NOTE =
  'largest eps: physical O(eps) next-order term (imp-35256) pulls kEmp below K';
export const IMP35386_FINEST_NOTE =
  'smallest eps: imp-35076 6-decimal storage / coarse-quadrature floor scatters kEmp above K';
