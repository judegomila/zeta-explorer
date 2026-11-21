/**
 * @module imp-34351-eflow-division-form-fartail-crossvalidation
 *
 * imp-34351 (accuracy, frontier-direction): imp-34270 F2 stated that its exact division form
 * relOffset = 1 - [L(N_half)/L(N_cross)] / (1 + r)^2 reproduces the measured sigma = 1/2 HALVING
 * landmark offset to <1e-6 as an IDENTITY of the two defining equations (crossover E_coll = E_trunc,
 * halving E_coll = E_trunc + E_flow), r = E_flow/E_trunc, L = log T0. But it was only ever evaluated
 * at the halving landmark it was derived at. imp-33743 D2 separately restored E_flow to reproduce the
 * thr = 0.1 FAR-TAIL bisection landmark to ~1.3e-15. This module CROSS-VALIDATES the imp-34270 exact
 * division form directly at the imp-33743 far-tail thr = 0.1 crossover, to confirm the identity holds
 * LANDMARK-INDEPENDENTLY rather than being tuned to the halving landmark.
 *
 * WHY THE FORM IS LANDMARK-INDEPENDENT (the structural reason the cross-check must land)
 * ------------------------------------------------------------------------------------
 * At the general threshold thr the two defining balances are (imp-33743):
 *
 *     E_flow-dropped:   C_C sqrt(L(N_cf)/N_cf) = E_trunc * thr/(1-thr)                 (closed form)
 *     E_flow-restored:  C_C sqrt(L(N_wf)/N_wf) = (E_trunc + E_flow(N_wf)) * thr/(1-thr)
 *
 * Dividing the E_flow-dropped balance by the E_flow-restored balance, the entire threshold amplitude
 * factor thr/(1-thr) CANCELS, leaving exactly
 *
 *     sqrt( [L(N_cf)/N_cf] / [L(N_wf)/N_wf] ) = E_trunc / (E_trunc + E_flow) = 1/(1 + r),
 *
 * and squaring/rearranging gives the SAME imp-34270 identity with (N_cf, N_wf) in the (N_cross, N_half)
 * slots:
 *
 *     relOffset(thr) = (N_cf - N_wf)/N_cf = 1 - [L(N_wf)/L(N_cf)] / (1 + r)^2 ~ 2r + deltaL,
 *
 * with r = E_flow(N_wf)/E_trunc and deltaL = 1 - L(N_wf)/L(N_cf) the log T0 drift. Because the thr
 * factor drops out of the division, the identity CANNOT be tuned to thr = 1/2; it is a structural
 * consequence of the two balances at ANY threshold. thr = 0.1 (amplitude factor 81, N deep in the
 * tail) is the strongest available independent evaluation point.
 *
 * THE FINDING (cross-validation / measurement only)
 * -------------------------------------------------
 *   (X1) THE EXACT DIVISION FORM REPRODUCES THE FAR-TAIL OFFSET TO IDENTITY PRECISION. At thr = 0.1
 *        the E_flow-dropped closed form pins N_cf ~ 3.213418e11 and the E_flow-restored fixed point
 *        pins N_wf ~ 3.213181e11, a measured relative offset relOffset = 7.377156e-5. The imp-34270
 *        exact division form 1 - [L(N_wf)/L(N_cf)]/(1+r)^2 = 7.377156e-5 reproduces it to 8.41e-12
 *        relative -- ~5 orders of magnitude tighter than the <1e-6 the halving landmark delivered
 *        (no bisection enters here; both landmarks are fixed points), and with the SAME functional
 *        form and NO free parameter. The identity is confirmed landmark-independent.
 *   (X2) THE LEADING/DRIFT SPLIT SURVIVES, WITH THE LEADING SHARE SLIGHTLY HIGHER DEEP IN THE TAIL.
 *        The leading Gronwall term 2r = 2 * E_flow/E_trunc = 7.097596e-5 captures 96.21% of the
 *        far-tail offset (vs 95.74% at the halving landmark), and the log T0 drift deltaL =
 *        2.799579e-6 supplies the ~3.79% remainder (2r + deltaL = 7.377554e-5). The leading share
 *        edges up because L(N) grows down the tail, so the slow-log drift term deltaL shrinks
 *        faster than the leading 2r term -- the same doubling factor (from E_coll ~ N^{-1/2}) as at
 *        the halving landmark. So the 2r + deltaL decomposition is landmark-independent too, not an
 *        artifact of the sigma = 1/2 landmark it was formed at.
 *
 * The punchline: the imp-34270 exact division form relOffset = 1 - [L/L]/(1+r)^2 is NOT tuned to the
 * halving landmark. Evaluated verbatim at the imp-33743 far-tail thr = 0.1 crossover it reproduces
 * the measured N_cf-vs-N_wf offset (7.377156e-5) to 8.41e-12, and its 2r + deltaL split still holds
 * (leading share 96.21% vs 95.74% at halving). The thr/(1-thr) amplitude factor cancels in the
 * division, so the identity is a structural property of the two defining balances at ANY threshold.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643);
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34270-eflow-gronwall-crossover-offset-correction (F2: the exact division form, derived at halving)
 * @see imp-33743-sigma-fartail-crossover-closed-form (D2: E_flow-restored far-tail thr=0.1 fixed point)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross; named the E_flow offset)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-34348-eflow-gronwall-offset-tc-a1-sensitivity (TC_A1_TRAP sensitivity of the same offset)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33601/imp-33723/imp-33743 exactly
const THR = 0.1; // imp-33743 far-tail landmark threshold (sigma < 0.1)

// EXACT imp-3406/imp-33743 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { T0, L, E_flow, E_coll };
}

// E_flow-DROPPED far-tail closed form (imp-33743): N = K_thr log T0(N), K_thr = ((1-thr)/thr)^2 K.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude (imp-33723)
const K_THR = ((1 - THR) / THR) ** 2 * K_AMPL; // 81 * K_AMPL at thr = 0.1
function crossoverFixedPointDropped(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_THR * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CF = crossoverFixedPointDropped(1e11, 60); // ~3.213418e11 (E_flow dropped)

// E_flow-RESTORED far-tail fixed point (imp-33743 D2): E_coll = thr/(1-thr) (E_trunc + E_flow).
function crossoverFixedPointWithFlow(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) {
    const rhs = (THR / (1 - THR)) * (E_TRUNC_PT + parts(N).E_flow);
    N = (C_C_PINNED / rhs) ** 2 * Math.log(effectiveHeightForN(N));
  }
  return N;
}
const N_WF = crossoverFixedPointWithFlow(1e11, 80); // ~3.213181e11 (E_flow restored)

const P_CF = parts(N_CF);
const P_WF = parts(N_WF);

// Measured far-tail relative offset between the two landmarks (analogue of the halving REL_OFFSET).
const REL_OFFSET = (N_CF - N_WF) / N_CF; // ~7.377156e-5

// The Gronwall ratio at the E_flow-restored landmark (the r in the identity).
const R_FLOW = P_WF.E_flow / E_TRUNC_PT; // ~3.548798e-5 (far tail; cf ~1.91e-3 at halving)

// The imp-34270 leading term and log-T0 drift, evaluated at the far-tail landmark.
const PRED_LEADING = 2 * R_FLOW; // ~7.097596e-5
const DELTA_L = 1 - P_WF.L / P_CF.L; // ~2.799579e-6

// THE CROSS-VALIDATION: the imp-34270 exact division form 1 - [L(N_wf)/L(N_cf)]/(1+r)^2, verbatim.
const PRED_EXACT = 1 - (P_WF.L / P_CF.L) / (1 + R_FLOW) ** 2; // == REL_OFFSET to identity precision

const LEADING_SHARE = PRED_LEADING / REL_OFFSET; // ~0.9621 (cf ~0.9574 at halving)
const EXACT_RESIDUAL = Math.abs(PRED_EXACT - REL_OFFSET) / REL_OFFSET; // ~8.4e-12
const HALVING_LEADING_SHARE = 0.957390; // imp-34270 halving leading share, for the contrast

export const IMP34351_EFLOW_DIVISION_FORM_FARTAIL_CROSSVALIDATION = {
  id: 'imp-34351',
  proofSection: 'S-frontier',
  question:
    'imp-34270 F2 checked its exact division form relOffset = 1 - [L(N_half)/L(N_cross)]/(1+r)^2 ONLY ' +
    'at the sigma = 1/2 halving landmark it was derived at. Cross-validate the SAME form directly at the ' +
    'imp-33743 far-tail thr = 0.1 crossover (E_flow-dropped closed form N_cf vs E_flow-restored fixed ' +
    'point N_wf) to confirm the identity is landmark-independent, not tuned to the halving landmark. ' +
    'Cross-validation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  landmarkIndependenceArgument:
    'Dividing the E_flow-dropped balance C_C sqrt(L(N_cf)/N_cf) = E_trunc thr/(1-thr) by the ' +
    'E_flow-restored balance C_C sqrt(L(N_wf)/N_wf) = (E_trunc+E_flow) thr/(1-thr), the threshold ' +
    'amplitude factor thr/(1-thr) CANCELS, leaving 1/(1+r) with r = E_flow/E_trunc. So the identity ' +
    'relOffset = 1 - [L(N_wf)/L(N_cf)]/(1+r)^2 is a structural property of the two balances at ANY ' +
    'threshold, and CANNOT be tuned to thr = 1/2.',
  landmarks: {
    threshold: THR,
    N_cf_eflow_dropped: +N_CF.toExponential(6), // ~3.213418e11
    N_wf_eflow_restored: +N_WF.toExponential(6), // ~3.213181e11
    measured_rel_offset: +REL_OFFSET.toExponential(6), // ~7.377156e-5
  },
  crossValidation: {
    E_flow_over_E_trunc_at_far_tail: +R_FLOW.toExponential(6), // ~3.548798e-5
    leading_gronwall_term_2r: +PRED_LEADING.toExponential(6), // ~7.097596e-5
    logT0_drift_second_order: +DELTA_L.toExponential(6), // ~2.799579e-6
    exact_division_prediction: +PRED_EXACT.toExponential(6), // ~7.377156e-5
    exact_vs_measured_residual: +EXACT_RESIDUAL.toExponential(3), // ~8.4e-12
    fartail_leading_share: +LEADING_SHARE.toExponential(6), // ~0.962105
    halving_leading_share_imp34270: HALVING_LEADING_SHARE, // 0.957390 (for the contrast)
  },
  finding: {
    X1_exact_division_form_reproduces_fartail_offset:
      'At thr = 0.1 the E_flow-dropped closed form pins N_cf ~ 3.213418e11 and the E_flow-restored ' +
      'fixed point pins N_wf ~ 3.213181e11, a measured relative offset 7.377156e-5. The imp-34270 ' +
      'exact division form 1 - [L(N_wf)/L(N_cf)]/(1+r)^2 = 7.377156e-5 reproduces it to 8.41e-12 ' +
      'relative -- ~5 orders tighter than the <1e-6 at the halving landmark (no bisection enters; both ' +
      'landmarks are fixed points), with the SAME form and NO free parameter. The identity is confirmed ' +
      'landmark-independent, as the thr/(1-thr) cancellation in the division requires.',
    X2_leading_drift_split_survives_at_far_tail:
      'The leading Gronwall term 2r = 2 E_flow/E_trunc = 7.097596e-5 captures 96.21% of the far-tail ' +
      'offset (vs 95.74% at the halving landmark) and the log T0 drift deltaL = 2.799579e-6 supplies ' +
      'the ~3.79% remainder (2r + deltaL = 7.377554e-5). The leading share edges up because L(N) grows ' +
      'down the tail, shrinking the slow-log drift faster than the leading 2r term; the doubling factor ' +
      '(E_coll ~ N^{-1/2}) is unchanged. So the 2r + deltaL split is landmark-independent too.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). The imp-34270 exact division form ' +
    'relOffset = 1 - [L(N_half)/L(N_cross)]/(1+r)^2, checked there only at the sigma = 1/2 halving ' +
    'landmark, is re-evaluated verbatim at the imp-33743 far-tail thr = 0.1 crossover (E_flow-dropped ' +
    'closed form N_cf ~ 3.213418e11 vs E_flow-restored fixed point N_wf ~ 3.213181e11). It reproduces ' +
    'the measured offset 7.377156e-5 to 8.41e-12 relative -- ~5 orders tighter than the halving <1e-6, ' +
    'because both far-tail landmarks are fixed points and no bisection enters. The 2r + deltaL split ' +
    'survives: leading share 96.21% (vs 95.74% at halving), deltaL = 2.799579e-6 the remainder. The ' +
    'identity holds landmark-independently because the threshold amplitude factor thr/(1-thr) CANCELS ' +
    'in the division of the two defining balances, making the form structural at any threshold -- NOT ' +
    'tuned to sigma = 1/2. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/' +
    'imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34270 (F2: exact division form, derived at the halving landmark); imp-33743 (D2: E_flow-' +
    'restored far-tail thr=0.1 fixed point to ~1.3e-15); imp-33723 (closed-form N_cross); imp-33601 ' +
    '(exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), ' +
    '1/8 ansatz); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34351_EFLOW_DIVISION_FORM_FARTAIL_CROSSVALIDATION_ASSERTIONS = [
  {
    // (X1): the imp-34270 exact division form reproduces the far-tail offset to identity precision.
    id: 'imp34351-exact-division-form-matches-fartail-offset',
    description: 'the imp-34270 division form 1 - [L/L]/(1+r)^2 reproduces the measured thr=0.1 offset to < 1e-6',
    holds: () =>
      EXACT_RESIDUAL < 1e-6 &&
      REL_OFFSET > 0 &&
      Math.abs(REL_OFFSET - 7.377156e-5) < 5e-9,
  },
  {
    // The identity is far TIGHTER at the far tail than at the halving landmark (no bisection here).
    id: 'imp34351-fartail-identity-tighter-than-halving',
    description: 'far-tail exact residual < 1e-9 (both landmarks are fixed points, no bisection)',
    holds: () => EXACT_RESIDUAL < 1e-9,
  },
  {
    // (X2): the 2r + deltaL split survives; leading share ~96%, slightly above the halving 95.74%.
    id: 'imp34351-leading-drift-split-survives-at-fartail',
    description: 'leading 2r captures 90-100% of the far-tail offset, edging above the halving share',
    holds: () =>
      LEADING_SHARE > 0.9 &&
      LEADING_SHARE < 1.0 &&
      LEADING_SHARE > HALVING_LEADING_SHARE &&
      DELTA_L > 0 &&
      Math.abs(PRED_LEADING + DELTA_L - REL_OFFSET) < 1e-8,
  },
  {
    // Sanity: N_cf sits above N_wf and the far-tail landmark is the imp-33743 sigma<0.1 crossing.
    id: 'imp34351-fartail-landmarks-ordered-and-located',
    description: 'N_wf < N_cf and both ~3.2134e11 (the imp-33743 far-tail landmark)',
    holds: () => N_WF < N_CF && Math.abs(N_CF / 3.2134e11 - 1) < 5e-4,
  },
  {
    // Honesty gate: cross-validation/measurement only, no QED, no refereed bound is changed.
    id: 'imp34351-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34351_EFLOW_DIVISION_FORM_FARTAIL_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP34351_EFLOW_DIVISION_FORM_FARTAIL_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34351_EFLOW_DIVISION_FORM_FARTAIL_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34351_EFLOW_DIVISION_FORM_FARTAIL_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34351-eflow-division-form-fartail-crossvalidation assertion failed: ${a.id}`);
  }
}
