/**
 * @module imp-97711-gexp-l2-7point-noise-floor
 *
 * imp-97711 (numerical, frontier refine): imp-97686 R2 found the Gronwall-exponent crossing elasticity
 * E_GEXP = TC_A1_TRAP * E_CF is central-difference truncation-limited ONLY at the flow-heavy L2 landmark
 * (sigma = 0.9): there the imp-97665 5-point O(eps^4) stencil improved the 3-point residual ~4.3x, from
 * -1.68e-7 to +3.9e-8. At the deep landmarks L3/L4 the elasticity is so tiny that the residual already sits
 * at the bisection-quantization noise floor and the 5-point rule does not help. This module extends the L2
 * measurement one further order -- a 7-point O(eps^6) central-difference stencil -- to decide whether the L2
 * residual is STILL truncation (a 7-point rule should cut it another order) or has itself reached the
 * arithmetic-noise floor at the 5-point level (a 7-point rule then does nothing systematic).
 *
 * THE STENCIL LADDER (first-derivative central differences of the log-landmark crossing)
 * -------------------------------------------------------------------------------------
 *   D3[f] = ( f(eps) - f(-eps) ) / (2 eps)                                              -- O(eps^2)
 *   D5[f] = ( -f(2eps) + 8 f(eps) - 8 f(-eps) + f(-2eps) ) / (12 eps)                   -- O(eps^4)
 *   D7[f] = ( f(3eps) - 9 f(2eps) + 45 f(eps) - 45 f(-eps) + 9 f(-2eps) - f(-3eps) ) / (60 eps)  -- O(eps^6)
 * The 7-point weights are the standard centered coefficients {-1, 9, -45, 45, -9, 1}/60 on the log-parameter
 * probe d ln gexp; the target axis E_CF is re-measured with the same stencil for a fair same-order reldiff.
 *
 * THE MEASUREMENT (L2, sigma = 0.9, eps = 1e-3 primary; eps-scan for the noise diagnosis)
 * -------------------------------------------------------------------------------------
 *   E_GEXP reldiff vs TC_A1_TRAP * E_CF at L2, primary eps = 1e-3:
 *     3-point   -1.6821e-7
 *     5-point   +3.9130e-8   (5-pt improves the 3-pt residual ~4.3x -- imp-97686 R2)
 *     7-point   +3.1180e-8   (7-pt improves the 5-pt residual only ~1.26x)
 *   eps-scan of the 5->7 improvement factor (does the higher order systematically shrink the residual?):
 *     eps = 5e-4   rd5 = -5.02e-8   rd7 = +5.38e-9   5->7 x = 9.34
 *     eps = 1e-3   rd5 = +3.91e-8   rd7 = +3.12e-8   5->7 x = 1.26
 *     eps = 2e-3   rd5 = -5.54e-9   rd7 = -6.54e-9   5->7 x = 0.85  (7-pt WORSE)
 *     eps = 4e-3   rd5 = +4.50e-9   rd7 = +1.43e-8   5->7 x = 0.31  (7-pt WORSE)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (R1) THE L2 RESIDUAL IS AT THE NOISE FLOOR ALREADY AT THE 5-POINT STENCIL, NOT STILL TRUNCATION-LIMITED.
 *        A genuine central-difference truncation tail would fall by roughly an order under each higher-order
 *        stencil and shrink monotonically with eps at a fixed sign. Instead the 7-point rule cuts the primary
 *        (eps = 1e-3) residual only ~1.26x (versus the ~4.3x of the 3->5 step), and across the eps-scan the
 *        5->7 improvement factor scatters erratically (9.34, 1.26, 0.85, 0.31) with the residual SIGN flipping
 *        (positive at eps = 1e-3, negative at 5e-4 and 2e-3) and the 7-point value sometimes LARGER than the
 *        5-point value. That random ~1e-8 scatter is the arithmetic / bisection-quantization noise floor, not a
 *        residual O(eps^4) tail. So the 4.3x seen at 3->5 was the LAST truncation order at L2: the precision
 *        limit of the E_GEXP = TC_A1_TRAP * E_CF identity at L2 is a few x 1e-8 relative, reached by the
 *        5-point stencil.
 *   (R2) THE CONTINUUM IDENTITY IS UNCHANGED. E_GEXP = TC_A1_TRAP * E_CF is confirmed at L2 to this ~1e-8
 *        noise floor by both the 5-point and 7-point stencils (elasticity E_GEXP ~ -5.9637e-5 at L2, stable to
 *        6 figures across the two stencils). No hidden non-linear amplitude is surfaced; the Gronwall exponent
 *        stays on the single E_CF axis at the fixed scalar weight TC_A1_TRAP.
 *   (R3) NO NEW LEVERAGE DIRECTION. The 7-point refinement pins the L2 precision floor of the imp-97668 A2
 *        wrapper classification without moving any bound. DIAG3 == 0 (the imp-97644 STRUCTURE (1) scaling
 *        homogeneity) is untouched; no amplitude is re-pinned.
 *
 * The punchline: the ~4.3x that the 5-point stencil bought at the flow-heavy L2 was the final truncation order.
 * A 7-point O(eps^6) stencil does not systematically reduce the L2 residual (only ~1.26x at the primary step,
 * erratic and sometimes worse across eps), so the L2 residual is arithmetic-noise-limited at ~few x 1e-8 from
 * the 5-point level onward -- the same noise-floor character imp-97686 R2 found at L3/L4, just three-plus orders
 * lower because L2 carries the largest E_GEXP.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed here
 * only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97686-wrapper-elasticity-5point-refine (R2: E_GEXP truncation only at L2, 5-point ~4.3x)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (5-point O(eps^4) stencil vs 3-point truncation)
 * @see imp-97668-nonlinear-amplitude-audit (A2: wrapper elasticities E_CKH=0.5 E_CC, E_GEXP=TC E_CF)
 * @see imp-97644-three-axis-additivity-flow-prefactor (STRUCTURE (1): DIAG3 == 0 scaling symmetry)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmark L2 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const C_H = 1 / 8; // collision-scale ansatz (imp-395/imp-2642)
const C_KH = (C_C_PINNED / C_H) ** 2; // = 3*pi, recovered self-consistently from the pin

// Same full model as imp-97686, with the gexp (exp wrapper) and cf (linear) probes exposed.
function parts(N, p) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const cKH = (p.ckh ?? 1) * C_KH;
  const C_C = (p.ch ?? 1) * C_H * Math.sqrt(cKH);
  const C_F = (p.cf ?? 1) * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 prefactor
  const G = Math.exp((p.gexp ?? 1) * 1.0 * TC_A1_TRAP); // gexp enters via exp (non-linear wrapper)
  const E_flow = C_F * (L / T0) * G;
  const E_coll = C_C * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N };
}

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97668/imp-97686).
function landmark(level, p) {
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

// 3/5/7-point central-difference first-derivative stencils (O(eps^2), O(eps^4), O(eps^6)).
const deriv3 = (f, eps) => (f(eps) - f(-eps)) / (2 * eps);
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);
const deriv7 = (f, eps) =>
  (f(3 * eps) - 9 * f(2 * eps) + 45 * f(eps) - 45 * f(-eps) + 9 * f(-2 * eps) - f(-3 * eps)) / (60 * eps);

const elas = (level, key, deriv, eps) => deriv((d) => lnN(level, { [key]: Math.exp(d) }), eps);

const SIGMA_L2 = 0.9;
const EPS = 1e-3; // primary step (reproduces the imp-97686 measurement)

// Primary L2 measurement at eps = 1e-3.
const E_CF_3 = elas(SIGMA_L2, 'cf', deriv3, EPS);
const E_CF_5 = elas(SIGMA_L2, 'cf', deriv5, EPS);
const E_CF_7 = elas(SIGMA_L2, 'cf', deriv7, EPS);
const E_GEXP_3 = elas(SIGMA_L2, 'gexp', deriv3, EPS);
const E_GEXP_5 = elas(SIGMA_L2, 'gexp', deriv5, EPS);
const E_GEXP_7 = elas(SIGMA_L2, 'gexp', deriv7, EPS);
const RD3 = E_GEXP_3 / (TC_A1_TRAP * E_CF_3) - 1;
const RD5 = E_GEXP_5 / (TC_A1_TRAP * E_CF_5) - 1;
const RD7 = E_GEXP_7 / (TC_A1_TRAP * E_CF_7) - 1;

// eps-scan: does the 7-point rule systematically shrink the residual (truncation) or scatter (noise)?
const EPS_SCAN = [5e-4, 1e-3, 2e-3, 4e-3].map((eps) => {
  const cf5 = elas(SIGMA_L2, 'cf', deriv5, eps);
  const cf7 = elas(SIGMA_L2, 'cf', deriv7, eps);
  const g5 = elas(SIGMA_L2, 'gexp', deriv5, eps);
  const g7 = elas(SIGMA_L2, 'gexp', deriv7, eps);
  const rd5 = g5 / (TC_A1_TRAP * cf5) - 1;
  const rd7 = g7 / (TC_A1_TRAP * cf7) - 1;
  return {
    eps,
    rd5: +rd5.toExponential(3),
    rd7: +rd7.toExponential(3),
    improve_5to7_x: +Math.abs(rd5 / rd7).toFixed(3),
    sign_flip_5_vs_7: Math.sign(rd5) !== Math.sign(rd7),
  };
});

// Diagnostic: the 5->7 improvement factor scatters (min < 1 means the 7-point rule is sometimes WORSE),
// which is the noise-floor signature -- a genuine truncation tail would give a consistent >1 improvement.
const IMPROVE_5TO7_FACTORS = EPS_SCAN.map((r) => r.improve_5to7_x);
const IMPROVE_5TO7_MIN = Math.min(...IMPROVE_5TO7_FACTORS);
const IMPROVE_5TO7_MAX = Math.max(...IMPROVE_5TO7_FACTORS);
const L2_IS_NOISE_LIMITED_AT_5POINT = IMPROVE_5TO7_MIN < 1; // 7-point does NOT systematically improve -> noise

export const IMP97711_GEXP_L2_7POINT_NOISE_FLOOR = {
  id: 'imp-97711',
  proofSection: 'S-frontier',
  question:
    'imp-97686 R2 found the Gronwall-exponent elasticity E_GEXP = TC_A1_TRAP * E_CF is central-difference ' +
    'truncation-limited only at the flow-heavy L2 landmark, where the imp-97665 5-point O(eps^4) stencil ' +
    'improved the 3-point residual ~4.3x (to ~4e-8). Does a 7-point O(eps^6) stencil further reduce the L2 ' +
    'residual -- meaning it is STILL truncation -- or has the L2 residual itself reached the arithmetic-noise ' +
    'floor at the 5-point level? Measurement only; no bound moves; no QED.',
  method:
    'Extend the imp-97686 L2 crossing-elasticity measurement one order with the 7-point O(eps^6) central ' +
    'difference D7[f] = (f(3eps) - 9 f(2eps) + 45 f(eps) - 45 f(-eps) + 9 f(-2eps) - f(-3eps)) / (60 eps), ' +
    'compare the 3/5/7-point residuals of E_GEXP against TC_A1_TRAP * E_CF (same-stencil baseline) at the ' +
    'primary eps = 1e-3, and run an eps-scan (5e-4..4e-3) to distinguish a systematic higher-order reduction ' +
    '(truncation) from erratic scatter (arithmetic / bisection-quantization noise).',
  landmark: { label: 'below-0.9 (L2, flow-heavy)', sigma: SIGMA_L2, eps: EPS },
  elasticity_GEXP_L2: {
    E_GEXP_5pt: +E_GEXP_5.toExponential(6),
    E_GEXP_7pt: +E_GEXP_7.toExponential(6),
  },
  primary_residuals: {
    gexp_reldiff_vs_TC_CF_3pt: +RD3.toExponential(4),
    gexp_reldiff_vs_TC_CF_5pt: +RD5.toExponential(4),
    gexp_reldiff_vs_TC_CF_7pt: +RD7.toExponential(4),
    improve_3to5_x: +Math.abs(RD3 / RD5).toFixed(3),
    improve_5to7_x: +Math.abs(RD5 / RD7).toFixed(3),
  },
  epsScan: EPS_SCAN,
  finding: {
    R1_L2_noise_limited_at_5point:
      'The L2 residual is at the arithmetic / bisection-quantization noise floor already at the 5-point ' +
      'stencil, NOT still truncation-limited. The 7-point rule cuts the primary (eps = 1e-3) residual only ' +
      '~1.26x (versus ~4.3x for the 3->5 step), and across the eps-scan the 5->7 improvement factor scatters ' +
      'erratically (9.34, 1.26, 0.85, 0.31) with the residual sign flipping and the 7-point value sometimes ' +
      'LARGER than the 5-point value -- the signature of noise, not an O(eps^4) tail. The 4.3x at 3->5 was ' +
      'the last truncation order at L2; the precision limit of the identity there is a few x 1e-8 relative.',
    R2_continuum_identity_unchanged:
      'E_GEXP = TC_A1_TRAP * E_CF is confirmed at L2 to this ~1e-8 noise floor by both the 5-point and ' +
      '7-point stencils (E_GEXP ~ -5.9637e-5, stable to 6 figures across the two stencils). No hidden ' +
      'non-linear amplitude is surfaced; the Gronwall exponent stays on the single E_CF axis at TC_A1_TRAP.',
    R3_no_new_leverage_direction:
      'The 7-point refinement pins the L2 precision floor of the imp-97668 A2 wrapper classification without ' +
      'moving any bound. DIAG3 == 0 (the imp-97644 STRUCTURE (1) scaling homogeneity) is untouched; no ' +
      'amplitude is re-pinned.',
  },
  diagnostics: {
    improve_5to7_min_x: +IMPROVE_5TO7_MIN.toFixed(3),
    improve_5to7_max_x: +IMPROVE_5TO7_MAX.toFixed(3),
    l2_is_noise_limited_at_5point: L2_IS_NOISE_LIMITED_AT_5POINT,
  },
  caveats:
    'MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed ' +
    'here only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
};

export default IMP97711_GEXP_L2_7POINT_NOISE_FLOOR;
