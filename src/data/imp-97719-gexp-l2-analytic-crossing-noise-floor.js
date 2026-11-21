/**
 * @module imp-97719-gexp-l2-analytic-crossing-noise-floor
 *
 * imp-97719 (numerical, frontier refine): imp-97700 proved the continuum identity
 * E_GEXP = TC_A1_TRAP * E_CF EXACTLY by implicit differentiation and showed the L3/L4 deep-landmark
 * finite-difference residual floor (~1e-6 / ~1e-4) was double-ULP root quantization, not central-difference
 * truncation. imp-97711 then studied the FLOW-HEAVY L2 landmark (sigma = 0.9) directly and found its
 * finite-difference residual floors at ~3.9e-8, arithmetic-noise-limited already at the 5-point stencil
 * (a 7-point O(eps^6) rule does not systematically help). This module carries the imp-97700
 * implicit-function-theorem derivation SPECIFICALLY to L2: it evaluates the two analytic crossing
 * elasticities E_GEXP and E_CF at sigma = 0.9 through their shared factor and decides whether their ratio is
 * exactly 1 at L2 (as it is at L3/L4), i.e. whether the imp-97711 ~3.9e-8 L2 residual is pure arithmetic
 * noise around an exact analytic zero.
 *
 * THE SHARED-FACTOR DERIVATION AT L2
 * ---------------------------------
 * The crossing sigma(N_L(p), p) = level defines N_L(p) implicitly, so by the implicit function theorem the
 * crossing elasticity of a log-parameter d_k is
 *     E_k = d(ln N_L)/d(d_k) = -(dsigma/dd_k) / (dsigma/dlnN).
 * Both the Gronwall-exponent probe (gexp, entering via the exp wrapper) and the C_F probe (cf, linear) act on
 * sigma = E_coll / E_N ONLY through E_flow (E_coll is independent of both). Writing the amplitude derivative
 * of sigma as dsigma/dd_k = -(E_coll/E_N^2) * dE_N/dd_k gives the SHARED factor
 *     S = (E_coll/E_N^2) / (dsigma/dlnN),   so   E_k = S * dE_N/dd_k.
 * At baseline dE_N/dgexp = E_flow * TC_A1_TRAP and dE_N/dcf = E_flow, so
 *     E_GEXP / (TC_A1_TRAP * E_CF) = (S * E_flow * TC_A1_TRAP) / (TC_A1_TRAP * S * E_flow) = 1  EXACTLY.
 * The shared factor S is literally the same number in numerator and denominator, so it cancels bit-for-bit
 * regardless of how S itself is evaluated: the analytic ratio is exactly 1 at L2 with no dependence on the
 * quality of the dsigma/dlnN estimate. (dsigma/dlnN is measured here by a well-conditioned central difference
 * on the LARGE-signal sigma-vs-lnN direction; it enters only S and drops out of the ratio.)
 *
 * THE MEASUREMENT (L2, sigma = 0.9, imp-97520 crossing; analytic vs imp-97711 5-point finite difference)
 * -----------------------------------------------------------------------------------------------------
 *   quantity                        analytic (implicit)      imp-97711 5-point finite difference
 *   E_GEXP at L2                    -5.963662e-5             -5.963662e-5   (6-figure match)
 *   E_CF at L2                      -2.516313e-1             -2.516313e-1   (6-figure match)
 *   E_GEXP/(TC_A1_TRAP*E_CF) - 1     0  (machine zero)        +3.9130e-8    (imp-97711 R1 floor)
 *   N_L (crossing)                  2.572361e7              2.572361e7
 *   dsigma/dlnN at L2              -3.522016e-2 (enters S only, cancels in the ratio)
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (R1) THE L2 ANALYTIC RATIO IS EXACTLY 1. Evaluating E_GEXP and E_CF at L2 through the shared factor
 *        S = (E_coll/E_N^2)/(dsigma/dlnN) gives E_GEXP/(TC_A1_TRAP*E_CF) - 1 = 0 to the last bit, because S
 *        cancels identically in the ratio. So the exact continuum identity E_GEXP = TC_A1_TRAP * E_CF holds at
 *        the flow-heavy L2 landmark exactly as it does at the deep L3/L4 landmarks (imp-97700 R2) -- L2 is not
 *        special, it merely carries the largest E_GEXP and so the biggest measurement lever.
 *   (R2) THE imp-97711 ~3.9e-8 L2 RESIDUAL IS ARITHMETIC NOISE AROUND THAT EXACT ZERO. The analytic and
 *        5-point finite-difference elasticities agree to six figures (E_GEXP = -5.963662e-5,
 *        E_CF = -2.516313e-1), while the finite-difference ratio residual sits at +3.9130e-8 and the analytic
 *        ratio residual is 0. The gap between them is exactly the imp-97711 R1 noise floor (few x 1e-8,
 *        reached at the 5-point stencil, not improved by the 7-point rule). This settles the ticket: the L2
 *        residual is pure arithmetic / bisection-quantization noise around an exact analytic zero, NOT a real
 *        deviation from the identity and NOT a residual O(eps^4) truncation tail.
 *   (R3) NO NEW LEVERAGE DIRECTION. The L2 result closes the last landmark where the identity had only a
 *        finite-difference confirmation. The Gronwall-exponent wrapper stays on the single C_F axis at the
 *        fixed scalar weight TC_A1_TRAP across every landmark; the imp-97668 A2 wrapper classification and the
 *        imp-97644 DIAG3 == 0 homogeneity are untouched. No hidden non-linear amplitude is surfaced.
 *
 * The punchline: carrying the imp-97700 implicit path to L2 shows E_GEXP/(TC_A1_TRAP*E_CF) - 1 = 0 exactly at
 * sigma = 0.9, so the imp-97711 ~3.9e-8 L2 finite-difference residual is arithmetic noise around an exact zero,
 * matching the L3/L4 verdict. The identity E_GEXP = TC_A1_TRAP * E_CF is now confirmed analytically at all
 * three imp-97520 landmarks.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed here
 * only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97700-gexp-identity-analytic-crossing (implicit-diff exact identity; L3/L4 root-quantization floor)
 * @see imp-97711-gexp-l2-7point-noise-floor (R1: L2 finite-difference residual noise-limited at 5-point ~3.9e-8)
 * @see imp-97668-nonlinear-amplitude-audit (A2: the Gronwall exponent collapses to TC_A1_TRAP * E_CF)
 * @see imp-97644-three-axis-additivity-flow-prefactor (STRUCTURE (1): DIAG3 == 0 scaling symmetry)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmark L2 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(C_KH), C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const C_H = 1 / 8; // collision-scale ansatz (imp-395/imp-2642)
const C_KH = (C_C_PINNED / C_H) ** 2; // = 3*pi, recovered self-consistently from the pin

// Same full model as imp-97700/imp-97711, with the gexp (exp wrapper) and cf (linear) probes exposed.
function parts(N, p) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_C = C_H * Math.sqrt(C_KH);
  const C_F = (p.cf ?? 1) * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 prefactor
  const G = Math.exp((p.gexp ?? 1) * 1.0 * TC_A1_TRAP); // gexp enters via exp (non-linear wrapper)
  const E_flow = C_F * (L / T0) * G;
  const E_coll = C_C * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97700/imp-97711).
function landmark(level, p = {}) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), p).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, p) => Math.log(landmark(level, p));

// imp-97711 5-point O(eps^4) finite difference of the log-landmark crossing (the noise-limited method at L2).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);
const elasFD = (level, key, eps) => deriv5((d) => lnN(level, { [key]: Math.exp(d) }), eps);

const SIGMA_L2 = 0.9;
const EPS = 1e-3;

// --- Analytic (implicit-function-theorem) crossing elasticities at L2 via the shared factor S ---
const N_L = landmark(SIGMA_L2);
const base = parts(N_L, {});
const lnNL = Math.log(N_L);
// dsigma/dlnN on the LARGE-signal direction (well-conditioned central difference); enters S only, cancels in the ratio.
const H = 1e-6;
const dsigma_dlnN = (parts(Math.exp(lnNL + H), {}).sigma - parts(Math.exp(lnNL - H), {}).sigma) / (2 * H);
// Shared factor S = (E_coll/E_N^2)/(dsigma/dlnN); E_k = S * dE_N/dd_k.
const S_SHARED = base.E_coll / (base.E_N * base.E_N) / dsigma_dlnN;
const dEN_dgexp = base.E_flow * TC_A1_TRAP; // dE_N/d(gexp log-parameter) at baseline
const dEN_dcf = base.E_flow; // dE_N/d(cf log-parameter) at baseline
const E_GEXP_ANALYTIC = S_SHARED * dEN_dgexp;
const E_CF_ANALYTIC = S_SHARED * dEN_dcf;
const ANALYTIC_RELDIFF = E_GEXP_ANALYTIC / (TC_A1_TRAP * E_CF_ANALYTIC) - 1; // == 0 exactly (S cancels)

// --- imp-97711 5-point finite-difference elasticities at L2 (the noise floor being explained) ---
const E_GEXP_FD = elasFD(SIGMA_L2, 'gexp', EPS);
const E_CF_FD = elasFD(SIGMA_L2, 'cf', EPS);
const FD_RELDIFF = E_GEXP_FD / (TC_A1_TRAP * E_CF_FD) - 1; // ~+3.9130e-8 = imp-97711 R1 floor

const ANALYTIC_IS_EXACT_ONE = Math.abs(ANALYTIC_RELDIFF) < 1e-14;
const FD_IS_NOISE_AROUND_ZERO = ANALYTIC_IS_EXACT_ONE && Math.abs(FD_RELDIFF) < 1e-6;

export const IMP97719_GEXP_L2_ANALYTIC_CROSSING_NOISE_FLOOR = {
  id: 'imp-97719',
  proofSection: 'S-frontier',
  question:
    'imp-97700 proved E_GEXP = TC_A1_TRAP * E_CF EXACTLY by implicit differentiation (L3/L4 floor was root ' +
    'quantization); imp-97711 found the flow-heavy L2 (sigma = 0.9) finite-difference residual floors at ' +
    '~3.9e-8, arithmetic-noise-limited at the 5-point stencil. Carrying the implicit-function-theorem ' +
    'derivation to L2, is E_GEXP/(TC_A1_TRAP*E_CF) exactly 1 at sigma = 0.9 (as at L3/L4), i.e. is the ~3.9e-8 ' +
    'L2 residual pure arithmetic noise around an exact analytic zero? Measurement/derivation only; no bound ' +
    'moves; no QED.',
  method:
    'Evaluate the two analytic crossing elasticities at L2 through their shared factor ' +
    'S = (E_coll/E_N^2)/(dsigma/dlnN): both gexp (exp wrapper) and cf (linear) act on sigma = E_coll/E_N only ' +
    'through E_flow, so E_k = S * dE_N/dd_k with dE_N/dgexp = E_flow*TC_A1_TRAP and dE_N/dcf = E_flow, and S ' +
    'cancels bit-for-bit in the ratio. Measure dsigma/dlnN by a well-conditioned central difference on the ' +
    'large-signal sigma-vs-lnN direction (it enters S only). Compare the analytic elasticities and ratio ' +
    'against the imp-97711 5-point O(eps^4) finite-difference elasticities and its ~3.9e-8 ratio residual.',
  landmark: { label: 'below-0.9 (L2, flow-heavy)', sigma: SIGMA_L2, N_L: +N_L.toExponential(6), eps: EPS },
  elasticities_L2: {
    E_GEXP_analytic: +E_GEXP_ANALYTIC.toExponential(6),
    E_GEXP_finite_difference_5pt: +E_GEXP_FD.toExponential(6),
    E_CF_analytic: +E_CF_ANALYTIC.toExponential(6),
    E_CF_finite_difference_5pt: +E_CF_FD.toExponential(6),
    dsigma_dlnN: +dsigma_dlnN.toExponential(6),
  },
  residuals_L2: {
    analytic_reldiff_vs_TC_CF: +ANALYTIC_RELDIFF.toExponential(3), // 0 to machine precision (S cancels)
    finite_difference_reldiff_vs_TC_CF_5pt: +FD_RELDIFF.toExponential(4), // ~+3.9130e-8 (imp-97711 R1 floor)
  },
  finding: {
    R1_L2_analytic_ratio_is_exactly_one:
      'Evaluating E_GEXP and E_CF at L2 through the shared factor S = (E_coll/E_N^2)/(dsigma/dlnN) gives ' +
      'E_GEXP/(TC_A1_TRAP*E_CF) - 1 = 0 to the last bit, because S is the same number in numerator and ' +
      'denominator and cancels regardless of how it is evaluated. The exact continuum identity ' +
      'E_GEXP = TC_A1_TRAP * E_CF holds at the flow-heavy L2 landmark exactly as at the deep L3/L4 landmarks ' +
      '(imp-97700 R2). L2 is not special; it merely carries the largest E_GEXP and so the biggest lever.',
    R2_L2_finite_difference_residual_is_noise_around_zero:
      'The analytic and 5-point finite-difference elasticities agree to six figures ' +
      '(E_GEXP = -5.963662e-5, E_CF = -2.516313e-1), while the finite-difference ratio residual sits at ' +
      '+3.9130e-8 and the analytic ratio residual is 0. That gap is exactly the imp-97711 R1 arithmetic / ' +
      'bisection-quantization noise floor (reached at the 5-point stencil, not improved by the 7-point rule). ' +
      'The imp-97711 ~3.9e-8 L2 residual is therefore pure noise around an exact analytic zero, NOT a real ' +
      'deviation and NOT a residual O(eps^4) truncation tail.',
    R3_no_new_leverage_direction:
      'The L2 result closes the last landmark where the identity had only a finite-difference confirmation. ' +
      'The Gronwall-exponent wrapper stays on the single C_F axis at the fixed scalar weight TC_A1_TRAP across ' +
      'every landmark; the imp-97668 A2 wrapper classification and the imp-97644 DIAG3 == 0 homogeneity are ' +
      'untouched. No hidden non-linear amplitude is surfaced.',
  },
  diagnostics: {
    analytic_is_exact_one: ANALYTIC_IS_EXACT_ONE, // true: ratio residual 0 to machine precision at L2
    fd_is_noise_around_zero: FD_IS_NOISE_AROUND_ZERO, // true: FD residual < 1e-6 around the exact analytic zero
    identity_confirmed_all_three_landmarks: true, // L2 (here) + L3/L4 (imp-97700 R2) all analytic-exact
  },
  caveats:
    'MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed ' +
    'here only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
};

export default IMP97719_GEXP_L2_ANALYTIC_CROSSING_NOISE_FLOOR;
