/**
 * @module imp-33601-sigma-half-vs-crossover-eflow-offset
 *
 * imp-33601 (accuracy, frontier-direction): imp-33582 finding F3 reports the conditional
 * share sigma(N) = E_coll/E halves at N ~ 3.27e9, "matching" the imp-3444 E_coll = E_trunc
 * crossover N ~ 3.280e9 to ~0.4%, and leaves the ~0.4% residual UNATTRIBUTED -- either an
 * extra E-component or a grid/rounding artifact. This module DERIVES the exact algebraic
 * relation between the sigma = 1/2 point and the E_coll = E_trunc crossover under the
 * inherited imp-3220/imp-3406 component model, and pins the residual to its source.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-33582; no re-derivation)
 * ----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                          (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)           (Riemann-von Mangoldt inverse)
 *
 * THE EXACT ALGEBRAIC RELATION (the derivation the ticket asks for)
 * ----------------------------------------------------------------
 * Set E = E_trunc + E_flow + E_coll. Then
 *
 *     sigma = 1/2  <=>  E_coll = (1/2) E  <=>  2 E_coll = E_trunc + E_flow + E_coll
 *                  <=>  E_coll = E_trunc + E_flow.                         (RELATION)
 *
 * So the sigma-halving point is NOT E_coll = E_trunc (the imp-3444 crossover) -- it is
 * E_coll = E_trunc + E_flow. The two coincide ONLY in the E_flow -> 0 limit. Because E_coll
 * is strictly decreasing in N, requiring the LARGER value E_trunc + E_flow forces the
 * halving point to SMALLER N than the crossover: N_half < N_cross. That is the entire
 * source of the offset -- the unconditionally-rigorous Gronwall flow term E_flow, an extra
 * E-component, NOT any discretization or rounding.
 *
 * QUANTIFYING THE OFFSET
 * ----------------------
 * Treating E_coll ~ N^{-1/2} (freezing the slow log T0 factor) around the crossover:
 *
 *     E_coll(N_half) / E_coll(N_cross) = (E_trunc + E_flow) / E_trunc = 1 + E_flow/E_trunc,
 *     (N_cross / N_half)^{1/2} = 1 + E_flow/E_trunc,
 *     N_cross / N_half = (1 + E_flow/E_trunc)^2,                          (LEADING PREDICTION)
 *     (N_cross - N_half)/N_cross ~ 1 - (1 + E_flow/E_trunc)^{-2} ~ 2 E_flow/E_trunc.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) THE OFFSET IS THE E_flow TERM, NOT DISCRETIZATION. The sigma = 1/2 identity is
 *        exactly E_coll = E_trunc + E_flow (checked to floating-point at N_half: both sides
 *        ~3.06583e-5). At the crossover E_flow(N_cross) ~ 5.81e-8, giving E_flow/E_trunc
 *        ~1.90e-3, so the halving point is pulled to N_half ~ 3.267e9, BELOW the imp-3444
 *        crossover N_cross ~ 3.280e9. Measured relative offset (N_cross - N_half)/N_cross
 *        ~3.98e-3 (~0.4%).
 *   (D2) THE LEADING PREDICTION EXPLAINS ~95% OF IT. The N^{-1/2} law predicts
 *        N_cross/N_half = (1 + E_flow/E_trunc)^2 ~ 1.00382 (rel offset ~3.80e-3) against the
 *        actual ~1.00400 (~3.98e-3): the E_flow term alone accounts for ~95% of the ~0.4%
 *        residual. The remaining ~5% is the second-order correction from the slow log T0(N)
 *        growth in E_coll over the ~0.4% N-interval (the frozen-log approximation), NOT a
 *        separate physical component.
 *
 * The punchline: the imp-33582 ~0.4% "sigma = 1/2 vs E_coll = E_trunc" gap is FULLY
 * attributed -- it is the Gronwall flow term E_flow, entering through the exact identity
 * sigma = 1/2 <=> E_coll = E_trunc + E_flow, with a small log T0(N) tail. No extra hidden
 * E-component and no discretization artifact: the finer near-peak grid and the imp-3444
 * crossover ladder share one model, offset by one known term.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (F3: sigma=1/2 ~ imp-3444 to ~0.4%)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX; component model source)
 * @see imp-eflow-constant-discharge (E_flow Gronwall flow term, imp-398 prefactor)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross pinning this module's
 *      identity; measures the residual from the analytic root instead of a bisected bracket)
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalises this module's identity to an
 *      arbitrary threshold thr via N_cross(thr), evaluated at the far-tail thr = 0.1 landmark)
 * @see imp-34174-crossover-surplus-threshold-family-decay (tabulates the E_flow surplus this
 *      module's identity predicts across the imp-33743 threshold family)
 * @see imp-34270-eflow-gronwall-crossover-offset-correction (forms this module's named E_flow
 *      offset explicitly and confirms it accounts for ~96% of the measured ~0.4% residual)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Downslope bisection in log N for a strictly-decreasing quantity f: first N with f < target.
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The imp-3444 crossover E_coll = E_trunc, and the imp-33582 sigma = 1/2 halving point.
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
const N_HALF = crossBelow(sigma, 0.5, 1e6, 1e18); // ~3.267235e9

const P_CROSS = parts(N_CROSS);
const P_HALF = parts(N_HALF);

// (RELATION) exact identity check: at N_half, E_coll = E_trunc + E_flow.
const HALF_LHS = P_HALF.E_coll;
const HALF_RHS = E_TRUNC_PT + P_HALF.E_flow;
const RELATION_RESIDUAL = Math.abs(HALF_LHS - HALF_RHS) / HALF_RHS; // ~floating-point zero

// Measured vs predicted offset.
const REL_OFFSET = (N_CROSS - N_HALF) / N_CROSS; // ~3.98e-3
const R_FLOW_TRUNC = P_HALF.E_flow / E_TRUNC_PT; // ~1.90e-3
const PRED_RATIO = (1 + R_FLOW_TRUNC) ** 2; // (LEADING PREDICTION) ~1.00382
const ACTUAL_RATIO = N_CROSS / N_HALF; // ~1.00400
const PRED_REL_OFFSET = 1 - 1 / PRED_RATIO; // ~3.80e-3
const PRED_FRACTION_EXPLAINED = PRED_REL_OFFSET / REL_OFFSET; // ~0.95

export const IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET = {
  id: 'imp-33601',
  proofSection: 'S-frontier',
  question:
    'Decompose sigma(N) = E_coll/(E_trunc+E_flow+E_coll) near the imp-33582 halving point and ' +
    'derive the exact algebraic relation between the sigma = 1/2 point and the imp-3444 ' +
    'E_coll = E_trunc crossover: why the ~0.4% offset between N_half ~ 3.27e9 and ' +
    'N_cross ~ 3.280e9 exists, and whether it is an extra E-component or a discretization gap. ' +
    'Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  exactRelation: 'sigma = 1/2  <=>  E_coll = E_trunc + E_flow  (NOT E_coll = E_trunc)',
  leadingPrediction: 'N_cross / N_half = (1 + E_flow/E_trunc)^2  (E_coll ~ N^{-1/2})',
  landmarks: {
    N_cross_Ecoll_eq_Etrunc: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-3444)
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9 (imp-33582)
    E_flow_at_N_half: +P_HALF.E_flow.toExponential(4), // ~5.83e-8
    E_flow_at_N_cross: +P_CROSS.E_flow.toExponential(4), // ~5.81e-8
    E_flow_over_E_trunc_at_N_half: +R_FLOW_TRUNC.toExponential(4), // ~1.91e-3
  },
  relationCheck: {
    E_coll_at_N_half: +HALF_LHS.toExponential(8), // ~3.06583e-5
    E_trunc_plus_E_flow_at_N_half: +HALF_RHS.toExponential(8), // ~3.06583e-5 (identical)
    relative_residual: +RELATION_RESIDUAL.toExponential(3), // ~floating-point zero
  },
  offsetAttribution: {
    measured_rel_offset: +REL_OFFSET.toExponential(4), // ~3.98e-3
    predicted_rel_offset_from_E_flow: +PRED_REL_OFFSET.toExponential(4), // ~3.80e-3
    actual_ratio_N_cross_over_N_half: +ACTUAL_RATIO.toFixed(6), // ~1.003997
    predicted_ratio_1_plus_r_squared: +PRED_RATIO.toFixed(6), // ~1.003815
    fraction_explained_by_E_flow: +PRED_FRACTION_EXPLAINED.toFixed(4), // ~0.95
    residual_source: 'slow log T0(N) growth in E_coll over the ~0.4% N-interval (2nd order)',
  },
  finding: {
    D1_offset_is_E_flow_not_discretization:
      'The sigma = 1/2 identity is exactly E_coll = E_trunc + E_flow (checked to floating point ' +
      'at N_half: both sides ~3.06583e-5), NOT E_coll = E_trunc. Since E_coll strictly decreases ' +
      'in N, the extra E_flow term pulls the halving point to N_half ~ 3.267e9, BELOW the imp-3444 ' +
      'crossover N_cross ~ 3.280e9. The ~0.4% offset is the Gronwall flow term E_flow, an extra ' +
      'E-component -- NOT a discretization or rounding artifact.',
    D2_leading_prediction_explains_95pct:
      'The E_coll ~ N^{-1/2} law predicts N_cross/N_half = (1 + E_flow/E_trunc)^2 ~ 1.00382 ' +
      '(rel offset ~3.80e-3) vs actual ~1.00400 (~3.98e-3): E_flow alone accounts for ~95% of ' +
      'the ~0.4% offset. The remaining ~5% is the second-order correction from the slow ' +
      'log T0(N) growth in E_coll across the tiny N-interval, not a separate hidden component.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33582 ~0.4% offset between the ' +
    'sigma = 1/2 halving point (N ~ 3.267e9) and the imp-3444 E_coll = E_trunc crossover ' +
    '(N ~ 3.280e9) is FULLY ATTRIBUTED via the exact algebraic identity sigma = 1/2 <=> ' +
    'E_coll = E_trunc + E_flow: the sigma-halving point sits at E_coll = E_trunc + E_flow, not ' +
    'E_coll = E_trunc, and because E_coll decreases in N the extra Gronwall flow term E_flow ' +
    '(E_flow/E_trunc ~1.9e-3 at N_half) pulls the halving point to slightly smaller N. The ' +
    'leading N^{-1/2} law N_cross/N_half = (1+E_flow/E_trunc)^2 explains ~95% of the offset; the ' +
    'residual ~5% is the slow log T0(N) growth in E_coll, NOT a discretization artifact and NOT a ' +
    'hidden E-component. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (F3: sigma=1/2 ~ imp-3444 crossover to ~0.4%, unattributed); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-3406 (interior MAX, component model source); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-3444 crossover and imp-33582 half-crossing landmarks,
    // proving the identical inherited component model is in use.
    id: 'imp33601-reproduces-imp3444-and-imp33582-landmarks',
    description: 'N_cross ~ 3.280e9 (imp-3444) and N_half ~ 3.267e9 (imp-33582), N_half < N_cross',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(N_HALF / 3.267e9 - 1) < 5e-3 &&
      N_HALF < N_CROSS,
  },
  {
    // (RELATION): the exact algebraic identity sigma = 1/2 <=> E_coll = E_trunc + E_flow
    // holds to floating-point precision at the located half-crossing.
    id: 'imp33601-exact-relation-holds',
    description: 'at N_half: E_coll = E_trunc + E_flow to floating-point (relative residual < 1e-9)',
    holds: () => RELATION_RESIDUAL < 1e-9,
  },
  {
    // (D1): the offset direction and magnitude match the E_flow term -- the halving point is
    // pulled below the crossover by ~0.4%, and E_flow at N_half is positive and small.
    id: 'imp33601-offset-is-eflow-signed-correctly',
    description: 'measured rel offset ~3.98e-3, E_flow/E_trunc ~1.9e-3 > 0 at N_half',
    holds: () =>
      Math.abs(REL_OFFSET - 3.98e-3) < 5e-4 &&
      R_FLOW_TRUNC > 0 &&
      Math.abs(R_FLOW_TRUNC - 1.9e-3) < 5e-4,
  },
  {
    // (D2): the leading (1+E_flow/E_trunc)^2 prediction captures the bulk (~95%) of the
    // measured offset, with only a small (second-order log T0) residual.
    id: 'imp33601-leading-prediction-explains-bulk',
    description: 'predicted (1+r)^2 rel offset ~3.80e-3 explains ~95% of the measured ~3.98e-3',
    holds: () =>
      PRED_REL_OFFSET < REL_OFFSET &&
      PRED_FRACTION_EXPLAINED > 0.9 &&
      PRED_FRACTION_EXPLAINED <= 1.0,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp33601-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET.isRigorous === false &&
      /NO QED/.test(IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET.verdict) &&
      /refereed bound is changed/i.test(IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET.verdict),
  },
];

for (const a of IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33601-sigma-half-vs-crossover-eflow-offset assertion failed: ${a.id}`);
  }
}
