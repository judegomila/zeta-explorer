/**
 * @module imp-33903-geometric-center-direct-finite-difference-reproduction
 *
 * imp-33903 (accuracy, frontier-direction): imp-33879 derived the imp-33856 ~4% endpoint-vs-
 * midpoint offset of the imp-33816 pointwise 1/(2 log T0) law as an ANALYTIC first-order Taylor
 * step -- the closed-form leading factor offset_lead = (1/2 ln 10)/log T0 -- and validated it
 * against the actual offset across the 1e12..1e15 ladder. That validation, however, computed the
 * "actual" offset inside the SAME module that houses the Taylor derivation. This module
 * INDEPENDENTLY reproduces the offset via a genuinely distinct code path: it evaluates the
 * pointwise law 1/(2 log T0) DIRECTLY at the decade endpoint N and the geometric midpoint
 * N/sqrt(10) and DIFFERENCES the two numeric values -- no Taylor expansion, no derivative, no
 * (1/2) ln 10 constant anywhere in the direct path -- then compares the resulting finite difference
 * to the analytic factor. The two-path agreement confirms the ~4% is CODE-PATH-INDEPENDENT and not
 * an artifact of the analytic half-log-decade Taylor step.
 *
 * THE TWO PATHS (same log T0 sub-term, disjoint arithmetic)
 * --------------------------------------------------------
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     law(N) = 1/(2 log T0(N))                 (imp-33816 pointwise shortfall)
 *   PATH B (this module, DIRECT finite difference): evaluate law at endpoint N and midpoint
 *     N/sqrt(10) and difference them,
 *         offset_direct(N) = [law(N/sqrt10) - law(N)] / law(N).
 *     Pure numeric subtraction of two law evaluations; contains no ln 10, no derivative.
 *   PATH A (imp-33879, ANALYTIC Taylor step): the closed-form leading factor
 *         offset_lead(N)   = (1/2 ln 10) / log T0(N).
 *     Built from the half-log-decade first-order Taylor expansion of law(x).
 * Path B never touches the Taylor construction; Path A never subtracts two law evaluations. They
 * share only the log T0 sub-term.
 *
 * THE MEASUREMENT (two-path agreement, SAME 1e12..1e15 ladder)
 * -----------------------------------------------------------
 *   N      log T0    offset_direct (Path B)   offset_lead (Path A)   rel err (A vs B)
 *   1e12   26.3130   4.376%                    4.375%                 -0.012%
 *   1e13   28.5255   4.038%                    4.036%                 -0.057%
 *   1e14   30.7452   3.748%                    3.745%                 -0.088%
 *   1e15   32.9710   3.496%                    3.492%                 -0.110%
 * The DIRECT finite difference (Path B) reproduces the imp-33879 published offsetMeasured
 * {4.376, 4.038, 3.748, 3.496}% to <3.2e-4 percentage points (rounding level) AND agrees with the
 * analytic factor (Path A) to <0.11% relative error at every rung (RMSE of the relative error
 * ~7.6e-4). The ~4% therefore appears purely from directly differencing two law values, with the
 * analytic Taylor factor merely a second, independent route to the same number.
 *
 * HONEST RESIDUAL (why the DIRECT difference, not a plain derivative, is the faithful path)
 * ---------------------------------------------------------------------------------------
 * A naive pointwise first-order derivative estimate -- a symmetric small-h finite difference
 * df/dx at the endpoint, folded as the half-decade step -(1/2) f_prime(x)/f(x) -- UNDERSHOOTS the
 * direct offset by ~3.3%..4.1% relative (the second-order half-decade curvature of law over the
 * finite half decade, which the direct midpoint evaluation captures but the endpoint derivative
 * drops). This is the imp-33900 second-order Taylor tail seen from the derivative side, and it is
 * exactly why the code-path-independent reproduction uses the DIRECT midpoint-vs-endpoint numeric
 * difference rather than a differentiated law. The direct path carries the full curvature and
 * matches the analytic LEADING factor only to leading order (<0.11%), the sub-0.11% gap being that
 * same second-order tail.
 *
 * THE FINDINGS (cross-validation only)
 * ------------------------------------
 *   (R1) CODE-PATH-INDEPENDENT REPRODUCTION. The direct finite difference of 1/(2 log T0) between
 *        the geometric midpoint N/sqrt(10) and the endpoint N -- a code path sharing no arithmetic
 *        with the imp-33879 Taylor derivation -- reproduces the imp-33879 measured offset to
 *        <3.2e-4 percentage points across 1e12..1e15. The ~4% is not an artifact of the analytic
 *        half-log-decade Taylor step.
 *   (R2) TWO-PATH AGREEMENT. The direct finite difference (Path B) and the analytic closed-form
 *        factor (1/2 ln 10)/log T0 (Path A) agree to <0.11% relative error at every rung (RMSE
 *        ~7.6e-4); the residual is the second-order Taylor tail the leading factor drops.
 *   (R3) DERIVATIVE UNDERSHOOT DISCLOSED. A plain pointwise first-order derivative estimate
 *        undershoots the direct offset by ~3.3%..4.1% (the finite half-decade curvature), which is
 *        why the faithful reproduction uses the direct midpoint-vs-endpoint difference, not a
 *        differentiated law.
 *
 * ACCURACY CROSS-VALIDATION ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (analytic Taylor factor, reproduced here)
 * @see imp-33901-geometric-center-correction-lower-decade-ladder (same factor on the lower 1e6..1e12 ladder)
 * @see imp-33900-geometric-center-second-order-taylor-tail (the second-order residual seen here as derivative undershoot)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5;
const LN10 = Math.log(10);
const HALF_LOG10 = HALF * LN10; // (1/2) ln 10 = 1.151293.. leading half-log-decade step (Path A only)

// The imp-33879 ladder rungs whose ~4% midpoint offset we independently reproduce: 1e12..1e15.
const DECADE_EXPONENTS = [12, 13, 14, 15];

// The pointwise shortfall law, evaluated DIRECTLY from effectiveHeightForN (no Taylor, no ln 10).
const law = (N) => HALF / Math.log(effectiveHeightForN(N));

// The imp-33879 published offsetMeasured_pct landmarks the direct path must reproduce.
const IMP33879_OFFSET_MEASURED_PCT = [4.376, 4.038, 3.748, 3.496];

// Per rung: Path B (direct finite difference) vs Path A (analytic closed-form factor), and the
// pointwise-derivative undershoot that motivates using the direct difference.
const TABLE = DECADE_EXPONENTS.map((e, i) => {
  const N = Math.pow(10, e);
  const Nmid = Math.pow(10, e - 0.5); // geometric centre of the decade slope
  const lawEnd = law(N); // direct evaluation at the labelling endpoint
  const lawMid = law(Nmid); // direct evaluation at the slope centre N/sqrt(10)

  // PATH B: direct numeric finite difference of the two law values (no Taylor, no derivative).
  const offsetDirect = (lawMid - lawEnd) / lawEnd; // fractional offset (~0.04)

  // PATH A: analytic closed-form leading factor from the imp-33879 half-log-decade Taylor step.
  const Lend = Math.log(effectiveHeightForN(N));
  const offsetLead = HALF_LOG10 / Lend; // (1/2 ln 10)/log T0

  // Honest residual: pointwise symmetric small-h derivative folded as the half-decade step.
  const h = 1e-3;
  const fPrime = (law(Math.pow(10, e + h)) - law(Math.pow(10, e - h))) / (2 * h);
  const offsetDeriv = -HALF * fPrime / lawEnd; // first-order half-decade step (undershoots)

  const relErrLeadVsDirect = (offsetLead - offsetDirect) / offsetDirect; // <0.11%
  const derivUndershoot = (offsetDeriv - offsetDirect) / offsetDirect; // ~-3.3%..-4.1%
  const reproDeltaPct = Math.abs(offsetDirect * 100 - IMP33879_OFFSET_MEASURED_PCT[i]); // <3.2e-4

  return {
    N_log10: e,
    logT0: +Lend.toFixed(4),
    offsetDirect_pct: +(offsetDirect * 100).toFixed(3), // Path B: 4.376 .. 3.496
    offsetLead_pct: +(offsetLead * 100).toFixed(3), // Path A: 4.375 .. 3.492
    relErrLeadVsDirect_pct: +(relErrLeadVsDirect * 100).toFixed(3), // -0.01 .. -0.11
    derivUndershoot_pct: +(derivUndershoot * 100).toFixed(2), // -3.32 .. -4.10
    reproDelta_pct: +reproDeltaPct.toExponential(2), // <3.2e-4 vs imp-33879 landmark
  };
});

const rmse = (arr) => Math.sqrt(arr.reduce((s, x) => s + x * x, 0) / arr.length);
const REL_ERRS = TABLE.map((r) => r.relErrLeadVsDirect_pct / 100);
const MAX_REL_ERR = +Math.max(...REL_ERRS.map(Math.abs)).toExponential(3); // ~1.10e-3
const RMSE_REL_ERR = +rmse(REL_ERRS).toExponential(3); // ~7.6e-4
const MAX_REPRO_DELTA = +Math.max(...TABLE.map((r) => r.reproDelta_pct)).toExponential(2); // ~3.1e-4
const UNDERSHOOT_MIN = Math.min(...TABLE.map((r) => r.derivUndershoot_pct)); // ~-4.10
const UNDERSHOOT_MAX = Math.max(...TABLE.map((r) => r.derivUndershoot_pct)); // ~-3.32
const OFFSET_MIN = Math.min(...TABLE.map((r) => r.offsetDirect_pct)); // ~3.50
const OFFSET_MAX = Math.max(...TABLE.map((r) => r.offsetDirect_pct)); // ~4.38

export const IMP33903_GEOMETRIC_CENTER_DIRECT_FINITE_DIFFERENCE_REPRODUCTION = {
  id: 'imp-33903',
  proofSection: 'S-frontier',
  question:
    'Independently reproduce the imp-33879 geometric-center correction factor via a DIRECT finite ' +
    'difference of 1/(2 log T0) between the decade midpoint N/sqrt(10) and the endpoint N -- a code ' +
    'path sharing no arithmetic with the imp-33879 analytic Taylor derivation -- and compare to the ' +
    'analytic factor, confirming the ~4% offset is code-path-independent and not an artifact of the ' +
    'analytic half-log-decade Taylor step. Accuracy cross-validation only; no bound change; no QED.',
  componentModel:
    'law(N) = 1/(2 log T0(N)); T0 = effectiveHeightForN(N). Path B (this module) directly ' +
    'differences law(N/sqrt10) and law(N); Path A (imp-33879) is the analytic (1/2 ln 10)/log T0. ' +
    'The two paths share only the log T0 sub-term.',
  twoPaths: {
    path_B_direct_finite_difference: '[law(N/sqrt10) - law(N)] / law(N) (no Taylor, no ln 10)',
    path_A_analytic_taylor_factor: '(1/2 ln 10) / log T0(N) (imp-33879 closed-form)',
  },
  table: TABLE,
  measurement: {
    max_relative_error_A_vs_B: MAX_REL_ERR, // ~1.10e-3
    rmse_relative_error_A_vs_B: RMSE_REL_ERR, // ~7.6e-4
    max_reproduction_delta_pct_vs_imp33879: MAX_REPRO_DELTA, // ~3.1e-4 percentage points
    deriv_undershoot_range_pct: [UNDERSHOOT_MIN, UNDERSHOOT_MAX], // ~[-4.10, -3.32]
    offset_range_pct: [OFFSET_MIN, OFFSET_MAX], // ~[3.50, 4.38]
  },
  findings: {
    R1_code_path_independent_reproduction:
      'The direct finite difference of 1/(2 log T0) between N/sqrt(10) and N -- sharing no ' +
      'arithmetic with the imp-33879 Taylor derivation -- reproduces the imp-33879 measured offset ' +
      'to <3.2e-4 percentage points across 1e12..1e15. The ~4% is not an artifact of the analytic ' +
      'half-log-decade Taylor step.',
    R2_two_path_agreement:
      'The direct finite difference (Path B) and the analytic (1/2 ln 10)/log T0 (Path A) agree to ' +
      '<0.11% relative error at every rung (RMSE ~7.6e-4); the residual is the second-order Taylor ' +
      'tail the leading factor drops.',
    R3_derivative_undershoot_disclosed:
      'A plain pointwise first-order derivative estimate undershoots the direct offset by ' +
      '~3.3%..4.1% (the finite half-decade curvature), which is why the faithful reproduction uses ' +
      'the direct midpoint-vs-endpoint difference, not a differentiated law.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY CROSS-VALIDATION (frontier-direction, NOT rigorous). The imp-33879 ~4% endpoint-vs-' +
    'midpoint geometric-center offset -- derived there as the analytic half-log-decade Taylor step ' +
    '(1/2 ln 10)/log T0 -- is reproduced here by a genuinely independent code path: directly ' +
    'evaluating the pointwise 1/(2 log T0) law at the endpoint N and the geometric midpoint ' +
    'N/sqrt(10) and differencing the two numeric values, with no Taylor expansion, no derivative, ' +
    'and no (1/2) ln 10 constant anywhere in the direct path. This direct finite difference ' +
    'reproduces the imp-33879 published offsetMeasured {4.376, 4.038, 3.748, 3.496}% to <3.2e-4 ' +
    'percentage points AND agrees with the analytic factor to <0.11% relative error at every rung ' +
    'across 1e12..1e15 (RMSE ~7.6e-4), confirming the ~4% is CODE-PATH-INDEPENDENT and not an ' +
    'artifact of the analytic Taylor step. Honest residual: a plain pointwise first-order ' +
    'derivative estimate undershoots the direct offset by ~3.3%..4.1% (the imp-33900 second-order ' +
    'half-decade curvature seen from the derivative side), which is exactly why the faithful ' +
    'reproduction uses the direct midpoint-vs-endpoint difference rather than a differentiated law. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33879 (analytic Taylor factor, reproduced here); imp-33901 (same factor on 1e6..1e12); ' +
    'imp-33900 (second-order Taylor tail); imp-33816 (pointwise gap_sigma ~ 1/(2 log T0)); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33903_GEOMETRIC_CENTER_DIRECT_FINITE_DIFFERENCE_REPRODUCTION_ASSERTIONS = [
  {
    // (R1) The direct finite difference reproduces the imp-33879 published offset landmarks.
    id: 'imp33903-direct-reproduces-imp33879-offset-landmarks',
    description: 'direct finite difference reproduces imp-33879 offsetMeasured to <1e-3 percentage points',
    holds: () => MAX_REPRO_DELTA < 1e-3,
  },
  {
    // (R2) The two paths agree to <0.2% relative error (leading factor vs direct difference).
    id: 'imp33903-two-path-agreement-under-quarter-percent',
    description: 'analytic factor and direct finite difference agree to <0.2% relative error at every rung',
    holds: () => MAX_REL_ERR < 2e-3 && RMSE_REL_ERR < 1.5e-3,
  },
  {
    // (R1) The reproduced offset is the imp-33856/imp-33879 "~4%": range ~[3.5%, 4.4%].
    id: 'imp33903-offset-is-the-four-percent-caveat',
    description: 'direct offset ranges within [3.3%, 4.6%] (the imp-33856 ~4% caveat)',
    holds: () => OFFSET_MIN > 3.3 && OFFSET_MAX < 4.6,
  },
  {
    // (R3) The pointwise derivative undershoots the direct offset by a few percent (curvature).
    id: 'imp33903-derivative-undershoot-is-second-order-curvature',
    description: 'plain first-order derivative undershoots direct offset by ~3%..5% (finite half-decade curvature)',
    holds: () => UNDERSHOOT_MIN > -5 && UNDERSHOOT_MAX < -3,
  },
  {
    // Honesty gate: cross-validation only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33903-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33903_GEOMETRIC_CENTER_DIRECT_FINITE_DIFFERENCE_REPRODUCTION.isRigorous === false &&
      /NO QED/.test(IMP33903_GEOMETRIC_CENTER_DIRECT_FINITE_DIFFERENCE_REPRODUCTION.verdict) &&
      /remains SOTA/.test(IMP33903_GEOMETRIC_CENTER_DIRECT_FINITE_DIFFERENCE_REPRODUCTION.verdict),
  },
];

for (const a of IMP33903_GEOMETRIC_CENTER_DIRECT_FINITE_DIFFERENCE_REPRODUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33903-geometric-center-direct-finite-difference-reproduction assertion failed: ${a.id}`,
    );
  }
}
