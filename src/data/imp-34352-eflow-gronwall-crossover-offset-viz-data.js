/**
 * @module imp-34352-eflow-gronwall-crossover-offset-viz-data
 * @fileoverview imp-34352 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34270 E_flow-Gronwall
 *   crossover-offset decomposition: the ~0.4% relative gap between the closed-form
 *   crossover N_cross and the sigma=1/2 halving landmark N_half splits into a LEADING
 *   doubled-Gronwall term 2*E_flow/E_trunc (95.74% of the offset) plus a second-order
 *   log T0 drift deltaL (4.26%), reproducing the measured offset to <1e-6 relative.
 *
 *   All numbers are baked reference literals copied from the imp-34270 module exports
 *   -- this module does not import imp-34270 (or its lambda-rh-height-mapping /
 *   polymath15-constant-C-C dependency chain) so pages consuming it stay import-light.
 *
 *   @see imp-34270-eflow-gronwall-crossover-offset-correction.js (source measurement)
 *   @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross; named the E_flow offset)
 *   @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 *
 *   Ticket: imp-34352 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

export const IMP34352_LANDMARKS = Object.freeze({
  N_cross_closed_form: 3.280294e9,
  N_half_sigma_eq_half: 3.267235e9,
  measured_rel_offset: 3.981092e-3,
});

// The two-term decomposition: leading doubled-Gronwall term + second-order log T0 drift.
export const IMP34352_LEADING_GRONWALL_TERM = 3.811454e-3; // 2 * E_flow/E_trunc at N_half
export const IMP34352_LOGT0_DRIFT_TERM = 1.811946e-4; // deltaL = 1 - L(N_half)/L(N_cross)
export const IMP34352_PREDICTED_EXACT = 3.981092e-3; // 2r + deltaL, via exact division identity
export const IMP34352_MEASURED_OFFSET = 3.981092e-3;

export const IMP34352_LEADING_SHARE = 0.957390; // fraction of the offset from the leading term alone
export const IMP34352_DRIFT_SHARE = 1 - IMP34352_LEADING_SHARE;
export const IMP34352_EXACT_VS_MEASURED_RESIDUAL = 9e-13; // relative, identity-level agreement

export const IMP34352_R_FLOW = 1.905727e-3; // E_flow/E_trunc at N_half (the un-doubled ratio)
