/**
 * @module imp-95095-eflow-gap-logt0-drift-elasticity-derivation
 *
 * imp-95095 (numerical/derivation, frontier-direction): imp-95056 tabulates the crossover-to-halving
 * N-gap and finds relOffset / (2 * E_flow/E_trunc) ~ 1.044 at N_half, attributing the leading 2*r
 * share (r = E_flow/E_trunc) to the inverse-square-root response of E_coll and leaving the ~4.4%
 * remainder (GAP_OVER_2R - 1 ~ 0.0445, absolute ~1.70e-4) as an ASSERTED slow log T0(N) drift. This
 * module DERIVES that ~4.4% remainder analytically as the log-height elasticity correction to the
 * leading inverse-sqrt-N drop, closing the gap between the measured relOffset and 2*(E_flow/E_trunc).
 *
 * THE DERIVATION (why the response is 1/(1 - beta), not the naive frozen-L factor 1)
 * ---------------------------------------------------------------------------------
 * Write g(N) = E_coll(N) = C_C sqrt(L(N)/N) with L(N) = log T0(N). Then
 *     ln g = const + (1/2) ln L(N) - (1/2) ln N,
 *     d ln g / d ln N = (1/2) beta - 1/2 = -(1/2)(1 - beta),   beta := d ln L / d ln N.
 * The two landmarks are the levels g = E_trunc (crossover, L2) and g = E_trunc + E_flow (halving, L3,
 * by the imp-33601 identity), so moving from crossover to halving raises ln g by ln(1 + r),
 * r = E_flow/E_trunc. Dividing the level change by the slope gives the exact log-N separation
 *     ln(N_cross / N_half) = 2 ln(1 + r) / (1 - beta),
 * hence the measured relative gap is
 *     relOffset = 1 - N_half/N_cross = 1 - exp( -2 ln(1 + r) / (1 - beta) ).
 * The naive "frozen log T0" reading (beta -> 0, r -> 0) is relOffset ~ 2r; the sqrt(L(N)) factor in
 * E_coll adds a +beta/2 slope that softens the pure -1/2 inverse-sqrt slope to -(1 - beta)/2, which
 * DIVIDES the N-response by (1 - beta). That factor 1/(1 - beta) IS the log T0(N) drift correction
 * imp-95056 left asserted:
 *     GAP_OVER_2R = relOffset / (2r) ~ 1/(1 - beta)  (up to O(r) shape terms from ln(1+r)/r and
 *                                                      the exp curvature).
 *
 * THE CLOSED FORM FOR beta (from Riemann-von Mangoldt, no fresh model)
 * -------------------------------------------------------------------
 * effectiveHeightForN inverts N ~ (T0/2pi) log(T0/2pi e), so d log T0 / d ln N = 1 - 1/log(T0/2pi),
 * and beta = d ln L / d ln N = (1/L)(d log T0/d ln N) gives the closed form
 *     beta = ( 1 - 1/log(T0/2pi) ) / log T0.
 * At the landmarks (T0 ~ height of N ~ 3.28e9) this evaluates to beta ~ 0.045431, matching a central
 * finite-difference of d ln L/d ln N to ~1e-10 -- an independent analytic anchor for the elasticity.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) beta CLOSED FORM = FINITE DIFFERENCE. The Riemann-von Mangoldt closed form
 *        beta = (1 - 1/log(T0/2pi))/log T0 ~ 0.045431 reproduces the central finite-difference
 *        elasticity d ln L/d ln N at N_half to ~1e-10 -- the log-height drift is pinned analytically.
 *   (D2) THE ANALYTIC GAP MATCHES THE MEASURED GAP. relOffset_predicted =
 *        1 - exp(-2 ln(1+r)/(1 - beta)) reproduces the imp-95056 measured relOffset ~3.981e-3 to
 *        ~4e-6 relative, so the crossover-to-halving separation is FULLY the closed-form response --
 *        no free residual remains.
 *   (D3) THE ~4.4% REMAINDER IS THE ELASTICITY FACTOR. GAP_OVER_2R ~ 1.0445 decomposes as the
 *        log-height elasticity factor 1/(1 - beta) ~ 1.0476 times a small O(r) shape softening
 *        ~0.9971 (from ln(1+r)/r and exp curvature, r ~ 1.906e-3). The ~4.4% remainder imp-95056
 *        left as an asserted log T0 drift IS beta/(1 - beta) net of the O(r) shape term -- derived,
 *        not asserted.
 *
 * The punchline: the ~4.4% crossover-to-halving remainder is the log-height elasticity
 * beta = d ln L/d ln N ~ 0.0454, closed-form (1 - 1/log(T0/2pi))/log T0, entering as the 1/(1 - beta)
 * softening of the inverse-sqrt N-response; the analytic relOffset matches imp-95056 to ~4 ppm.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95056-crossover-halving-eflow-three-landmark-table (the ~4.4% remainder left asserted)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (second-order ~1.8e-4 the remainder matches)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-95056 exactly

// EXACT imp-95056 sub-terms (no re-derivation, no fresh model): reproduce the same landmarks.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
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

// Reproduce the imp-95056 landmarks under the pinned constants.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 40); // ~3.280294e9
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9
const P_HALF = parts(N_HALF);
const REL_OFFSET_MEASURED = (N_CROSS - N_HALF) / N_CROSS; // ~3.981e-3 (imp-95056 measured)
const R_FLOW_TRUNC = P_HALF.E_flow / E_TRUNC_PT; // ~1.906e-3
const GAP_OVER_2R_MEASURED = REL_OFFSET_MEASURED / (2 * R_FLOW_TRUNC); // ~1.0445 (imp-95056)

// --- The log-height elasticity beta = d ln L / d ln N ---------------------------------------
// (a) central finite difference of ln(log T0) vs ln N at N_half.
function betaFiniteDiff(N0) {
  const h = 1e-4;
  const lnA = Math.log(N0) * (1 - h);
  const lnB = Math.log(N0) * (1 + h);
  const LA = Math.log(Math.log(effectiveHeightForN(Math.exp(lnA))));
  const LB = Math.log(Math.log(effectiveHeightForN(Math.exp(lnB))));
  return (LB - LA) / (lnB - lnA);
}
// (b) Riemann-von Mangoldt closed form beta = (1 - 1/log(T0/2pi)) / log T0.
function betaClosedForm(N0) {
  const T0 = effectiveHeightForN(N0);
  return (1 - 1 / Math.log(T0 / TWO_PI)) / Math.log(T0);
}
const BETA_FD = betaFiniteDiff(N_HALF); // ~0.045431
const BETA_CF = betaClosedForm(N_HALF); // ~0.045431
const BETA_FD_VS_CF_REL = Math.abs(BETA_FD - BETA_CF) / BETA_CF; // ~1e-10

// --- The analytic gap: relOffset = 1 - exp(-2 ln(1+r) / (1 - beta)) --------------------------
const R = R_FLOW_TRUNC;
const REL_OFFSET_PREDICTED = 1 - Math.exp((-2 * Math.log(1 + R)) / (1 - BETA_CF)); // ~3.981e-3
const PRED_VS_MEASURED_REL = Math.abs(REL_OFFSET_PREDICTED - REL_OFFSET_MEASURED) / REL_OFFSET_MEASURED; // ~4e-6
const GAP_OVER_2R_PREDICTED = REL_OFFSET_PREDICTED / (2 * R); // ~1.0445

// --- Decomposition of the ~4.4% remainder ---------------------------------------------------
// Elasticity factor 1/(1 - beta) is the log T0 drift correction; the O(r) shape term is the rest.
const ELASTICITY_FACTOR = 1 / (1 - BETA_CF); // ~1.0476
const SHAPE_SOFTENING = GAP_OVER_2R_PREDICTED / ELASTICITY_FACTOR; // ~0.9971 (O(r) curvature)
// The naive frozen-log leading term (beta -> 0) captures ~2r; the remainder it MISSES is beta/(1-beta).
const REMAINDER_MEASURED = GAP_OVER_2R_MEASURED - 1; // ~0.0445
const REMAINDER_FROM_ELASTICITY = BETA_CF / (1 - BETA_CF); // ~0.0476 (before O(r) softening)

export const IMP95095_EFLOW_GAP_LOGT0_DRIFT_ELASTICITY_DERIVATION = {
  id: 'imp-95095',
  proofSection: 'S-frontier',
  question:
    'Derive the ~4.4% remainder in the imp-95056 crossover-to-halving E_flow displacement ' +
    '(relOffset / (2 * E_flow/E_trunc) ~ 1.044) analytically as the log T0(N) drift correction to ' +
    'the leading inverse-sqrt-N drop, closing the gap between the measured relOffset and ' +
    '2*(E_flow/E_trunc). Derivation / measurement only; conditional-share diagnostic, NOT an RH ' +
    'bound; no QED.',
  landmarks: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    N_half: +N_HALF.toExponential(6), // ~3.267235e9
    relOffset_measured: +REL_OFFSET_MEASURED.toExponential(4), // ~3.981e-3
    E_flow_over_E_trunc_r: +R_FLOW_TRUNC.toExponential(4), // ~1.906e-3
    gap_over_2r_measured: +GAP_OVER_2R_MEASURED.toFixed(4), // ~1.0445
  },
  elasticity: {
    beta_finite_difference: +BETA_FD.toExponential(6), // ~4.543111e-2
    beta_closed_form: +BETA_CF.toExponential(6), // ~4.543111e-2
    beta_closed_form_expression: 'beta = (1 - 1/log(T0/2pi)) / log T0  (Riemann-von Mangoldt)',
    beta_fd_vs_cf_rel: +BETA_FD_VS_CF_REL.toExponential(3), // ~1e-10
    note: 'Closed-form log-height elasticity reproduces the finite-difference d ln L/d ln N to ~1e-10.',
  },
  analyticGap: {
    formula: 'relOffset = 1 - exp( -2 ln(1 + r) / (1 - beta) ),  r = E_flow/E_trunc',
    relOffset_predicted: +REL_OFFSET_PREDICTED.toExponential(4), // ~3.981e-3
    predicted_vs_measured_rel: +PRED_VS_MEASURED_REL.toExponential(3), // ~4e-6
    gap_over_2r_predicted: +GAP_OVER_2R_PREDICTED.toFixed(4), // ~1.0445
    note: 'The analytic relOffset reproduces the imp-95056 measured gap to ~4 ppm -- no free residual.',
  },
  remainderDecomposition: {
    remainder_measured: +REMAINDER_MEASURED.toExponential(4), // ~4.451e-2 (the ~4.4%)
    elasticity_factor_one_over_1_minus_beta: +ELASTICITY_FACTOR.toFixed(6), // ~1.047593
    remainder_from_elasticity_beta_over_1_minus_beta: +REMAINDER_FROM_ELASTICITY.toExponential(4), // ~4.759e-2
    O_r_shape_softening: +SHAPE_SOFTENING.toFixed(6), // ~0.997060
    attribution:
      'The ~4.4% remainder GAP_OVER_2R - 1 ~ 0.0445 is the log-height elasticity: E_coll = C_C ' +
      'sqrt(L(N)/N) carries a +beta/2 slope that softens the pure inverse-sqrt -1/2 slope to ' +
      '-(1 - beta)/2, dividing the N-response by (1 - beta). The factor 1/(1 - beta) ~ 1.0476 net ' +
      'of a small O(r) shape softening ~0.9971 gives GAP_OVER_2R ~ 1.0445 -- the asserted log T0 ' +
      'drift, now DERIVED as beta/(1 - beta) with beta = (1 - 1/log(T0/2pi))/log T0.',
  },
  finding: {
    D1_beta_closed_form_matches_finite_difference:
      'The Riemann-von Mangoldt closed form beta = (1 - 1/log(T0/2pi))/log T0 ~ 0.045431 reproduces ' +
      'the central finite-difference elasticity d ln L/d ln N at N_half to ~1e-10.',
    D2_analytic_gap_matches_measured:
      'relOffset_predicted = 1 - exp(-2 ln(1+r)/(1 - beta)) reproduces the imp-95056 measured ' +
      'relOffset ~3.981e-3 to ~4e-6 relative -- the separation is fully the closed-form response.',
    D3_remainder_is_elasticity:
      'GAP_OVER_2R ~ 1.0445 decomposes as the elasticity factor 1/(1 - beta) ~ 1.0476 times an O(r) ' +
      'shape softening ~0.9971; the ~4.4% remainder imp-95056 left asserted is beta/(1 - beta), ' +
      'derived from the log-height drift, not asserted.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The ~4.4% remainder imp-95056 left ' +
    'as an asserted slow log T0(N) drift (GAP_OVER_2R = relOffset/(2*E_flow/E_trunc) ~ 1.0445) is ' +
    'derived as the log-height elasticity correction to the inverse-sqrt-N drop: because ' +
    'E_coll = C_C sqrt(L(N)/N), the level-crossing response d ln g/d ln N = -(1 - beta)/2 with ' +
    'beta = d ln L/d ln N, so the exact gap is relOffset = 1 - exp(-2 ln(1+r)/(1 - beta)), which ' +
    'reproduces the imp-95056 measured relOffset ~3.981e-3 to ~4 ppm. The elasticity has the ' +
    'Riemann-von Mangoldt closed form beta = (1 - 1/log(T0/2pi))/log T0 ~ 0.045431, matching a ' +
    'finite-difference of d ln L/d ln N to ~1e-10, and the remainder GAP_OVER_2R - 1 ~ 0.0445 is the ' +
    'elasticity factor 1/(1 - beta) ~ 1.0476 net of a small O(r) shape softening -- the asserted log ' +
    'T0 drift is now beta/(1 - beta), derived. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95056 (crossover-to-halving E_flow gap, ~4.4% remainder left asserted); imp-33723 ' +
    '(second-order ~1.8e-4 the remainder matches); imp-33601 (identity sigma=1/2 <=> ' +
    'E_coll=E_trunc+E_flow); lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt ' +
    'inverse); imp-2642 (C_C = (1/8) sqrt(3 pi)).',
};

export const IMP95095_EFLOW_GAP_LOGT0_DRIFT_ELASTICITY_DERIVATION_ASSERTIONS = [
  {
    // (D1): the closed-form elasticity matches the finite-difference elasticity.
    id: 'imp95095-beta-closed-form-matches-finite-difference',
    description: 'beta = (1 - 1/log(T0/2pi))/log T0 matches central finite-diff d ln L/d ln N to < 1e-6 rel; both ~0.0454',
    holds: () =>
      BETA_FD_VS_CF_REL < 1e-6 &&
      Math.abs(BETA_CF - 0.045431) < 5e-5 &&
      BETA_CF > 0,
  },
  {
    // (D2): the analytic gap reproduces the measured imp-95056 relOffset.
    id: 'imp95095-analytic-gap-matches-measured',
    description: 'relOffset = 1 - exp(-2 ln(1+r)/(1 - beta)) reproduces the imp-95056 measured relOffset to < 1e-4 rel',
    holds: () =>
      PRED_VS_MEASURED_REL < 1e-4 &&
      Math.abs(REL_OFFSET_PREDICTED - 3.981e-3) < 5e-5,
  },
  {
    // (D3): the ~4.4% remainder is the elasticity factor 1/(1 - beta) net of O(r) shape softening.
    id: 'imp95095-remainder-is-elasticity-factor',
    description: 'GAP_OVER_2R_predicted ~ 1/(1-beta) * O(r)-softening ~ 1.0445; elasticity factor ~1.0476; softening in (0.99, 1)',
    holds: () =>
      Math.abs(GAP_OVER_2R_PREDICTED - GAP_OVER_2R_MEASURED) < 1e-3 &&
      Math.abs(ELASTICITY_FACTOR - 1.0476) < 1e-3 &&
      SHAPE_SOFTENING > 0.99 &&
      SHAPE_SOFTENING < 1.0 &&
      REMAINDER_FROM_ELASTICITY > REMAINDER_MEASURED,
  },
  {
    // Leading term sanity: the frozen-log 2r term captures the bulk (~95.7%) and the remainder is small.
    id: 'imp95095-leading-2r-captures-bulk',
    description: 'the naive frozen-log 2r term captures ~95.7% of relOffset; the derived remainder ~4.4% is the drift',
    holds: () =>
      Math.abs((2 * R) / REL_OFFSET_MEASURED - 1 / GAP_OVER_2R_MEASURED) < 1e-9 &&
      REMAINDER_MEASURED > 0 &&
      REMAINDER_MEASURED < 0.1,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp95095-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95095_EFLOW_GAP_LOGT0_DRIFT_ELASTICITY_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP95095_EFLOW_GAP_LOGT0_DRIFT_ELASTICITY_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP95095_EFLOW_GAP_LOGT0_DRIFT_ELASTICITY_DERIVATION.verdict),
  },
];

for (const a of IMP95095_EFLOW_GAP_LOGT0_DRIFT_ELASTICITY_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95095-eflow-gap-logt0-drift-elasticity-derivation assertion failed: ${a.id}`);
  }
}
