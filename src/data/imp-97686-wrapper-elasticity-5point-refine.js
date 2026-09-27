/**
 * @module imp-97686-wrapper-elasticity-5point-refine
 *
 * imp-97686 (numerical, frontier refine): imp-97668 audited the six constants of the E_N component model and
 * classified the two NON-LINEAR-WRAPPER constants -- C_KH (which enters the collision amplitude via a square
 * root, C_C = C_H sqrt(C_KH)) and the Gronwall EXPONENT coefficient (which enters the flow amplitude via an
 * exponential, G = exp(gexp * TC)). It found each collapses onto a single existing linear axis at a fixed
 * scalar weight: E_CKH = 0.5 E_CC (measured ~1e-7 relative on the 3-point O(eps^2) central-difference stencil)
 * and E_GEXP = TC_A1_TRAP E_CF (measured ~1e-4 relative on the same 3-point stencil). imp-97665 had shown the
 * analogous E_CF/E_ET pair-ratio residual was PURE central-difference truncation, cut ~5 orders by a 5-point
 * O(eps^4) stencil D5[f] = (-f(2eps) + 8 f(eps) - 8 f(-eps) + f(-2eps)) / (12 eps). This module re-measures
 * E_CKH and E_GEXP with that same 5-point rule at the imp-97520 L2/L3/L4 landmarks (eps = 1e-3) and asks
 * whether the two wrapper residuals are likewise pure truncation that the higher-order stencil cures.
 *
 * THE ANALYTIC EXPECTATION (why the two wrappers are NOT symmetric)
 * ----------------------------------------------------------------
 * C_KH via sqrt is a PURE LOG-LINEAR REPARAMETRIZATION. Probing C_KH by exp(delta) sends
 *   C_C = C_H sqrt(C_KH exp(delta)) = C_H sqrt(C_KH) exp(delta/2),
 * which is EXACTLY probing C_H by exp(delta/2). So in the continuum E_CKH = 0.5 E_CC identically, and any
 * finite-eps discrepancy is only the O(eps^2) central-difference truncation of a smooth crossing -- exactly
 * the situation imp-97665 cured. The 5-point rule should drop the E_CKH residual by ~4-5 orders.
 * The Gronwall exponent via exp is DIFFERENT. Its true first derivative also equals TC_A1_TRAP E_CF exactly
 * (G is a factor of E_flow just like C_F, and d ln G / d ln gexp = gexp*TC = TC at baseline), so a higher-order
 * stencil that isolates the first derivative SHOULD converge to the target. BUT E_GEXP is a vanishingly small
 * elasticity (= TC_A1_TRAP E_CF, and E_CF itself is ~1e-2..1e-4, so E_GEXP ~ 1e-5..1e-8 across L2..L4). At the
 * deep landmarks the crossing derivative is so small that the machine-precision bisection quantization of the
 * landmark, amplified by division by eps, dominates -- a NOISE floor, not a truncation floor. A 5-point stencil
 * removes truncation but not noise, so it should help only where E_GEXP is largest (the flow-heavy L2).
 *
 * THE MEASUREMENT (3-point vs 5-point crossing elasticities, eps = 1e-3, imp-97520 landmarks)
 * ------------------------------------------------------------------------------------------
 *   LANDMARK   E_CKH reldiff vs 0.5 E_CC       E_GEXP reldiff vs TC_A1_TRAP E_CF
 *              3-point        5-point           3-point        5-point
 *   L2(0.9)    -1.31e-7       2.3e-13           -1.68e-7       3.9e-8      (5-pt improves ~4.3x)
 *   L3(0.5)    -1.47e-9       -1.1e-12          -2.01e-6       -3.1e-6     (5-pt does NOT improve)
 *   L4(0.1)    -8.54e-11      -1.1e-12          -1.39e-4       -1.73e-4    (5-pt does NOT improve)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (R1) E_CKH IS PURE TRUNCATION -> CURED. The sqrt wrapper is a log-linear reparametrization, so E_CKH
 *        converges to 0.5 E_CC EXACTLY. The 5-point stencil drops the residual to ~1e-12..1e-13 at every
 *        landmark (a ~5-order cut at L2), reproducing the imp-97665 result for the sqrt wrapper. No fresh
 *        leverage direction: the C_KH axis is exactly half the C_C axis to machine precision.
 *   (R2) E_GEXP IS NOISE-LIMITED, NOT TRUNCATION-LIMITED (at deep landmarks). The 3-point residual is pure
 *        truncation only at the flow-heavy L2, where the 5-point rule improves it ~4.3x (to ~4e-8). At L3/L4
 *        the elasticity is so tiny (~1e-7, ~2e-8) that the residual sits at the bisection-quantization noise
 *        floor (~1e-6, ~1e-4 relative); the 5-point rule does NOT improve it -- it is arithmetic noise, not a
 *        central-difference tail. The exact continuum identity E_GEXP = TC_A1_TRAP E_CF is nonetheless
 *        confirmed to the noise floor at every landmark, and to ~4e-8 at L2.
 *   (R3) NO NEW LEVERAGE DIRECTION. Both wrapper elasticities remain in span{E_CC, E_CF} at fixed scalar
 *        weights (0.5 and TC_A1_TRAP). Re-measurement with the higher-order stencil does not surface any
 *        hidden non-linear amplitude; the imp-97668 A2 classification survives below its 3-point floor for
 *        C_KH (exactly) and to the noise floor for the Gronwall exponent. DIAG3 == 0 is untouched.
 *
 * The punchline: the two non-linear wrappers of E_N behave differently under stencil refinement. The sqrt
 * wrapper (C_KH) is a pure log-linear reparametrization whose 3-point residual is central-difference
 * truncation, cured ~5 orders by the imp-97665 5-point rule to E_CKH = 0.5 E_CC at machine precision. The
 * exp wrapper (Gronwall exponent) has a genuinely small crossing elasticity; its 3-point residual is
 * truncation only at the flow-heavy L2 (5-point improves ~4.3x) and is dominated by bisection-quantization
 * noise at the deep landmarks (5-point does not help). Neither creates a fresh leverage direction; both stay
 * on their single existing axis at a fixed scalar weight.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed here
 * only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97668-nonlinear-amplitude-audit (A2: 3-point wrapper elasticities E_CKH=0.5 E_CC, E_GEXP=TC E_CF)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (5-point O(eps^4) stencil vs 3-point truncation)
 * @see imp-97644-three-axis-additivity-flow-prefactor (STRUCTURE (1): DIAG3 == 0 scaling symmetry)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L2/L3/L4 + crossing procedure)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(C_KH), C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const C_H = 1 / 8; // collision-scale ansatz (imp-395/imp-2642)
const C_KH = (C_C_PINNED / C_H) ** 2; // = pi*C_Selberg = 3*pi, recovered self-consistently from the pin

// Full model with the two non-linear-wrapper probes exposed (ckh via sqrt, gexp via exp) plus the two linear
// baseline axes (ch on C_H, cf on C_F). Sensitivity probes only; the pinned values are untouched.
function parts(N, p) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const cKH = (p.ckh ?? 1) * C_KH;
  const C_C = (p.ch ?? 1) * C_H * Math.sqrt(cKH); // C_KH enters via sqrt (non-linear wrapper)
  const C_F = (p.cf ?? 1) * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 prefactor
  const G = Math.exp((p.gexp ?? 1) * 1.0 * TC_A1_TRAP); // gexp enters via exp (non-linear wrapper)
  const E_flow = C_F * (L / T0) * G;
  const E_coll = C_C * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97668).
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

// 3-point O(eps^2) central difference (the imp-97668 stencil) and 5-point O(eps^4) central difference (imp-97665).
const deriv3 = (f, eps) => (f(eps) - f(-eps)) / (2 * eps);
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Crossing elasticity of a single probe key with a given stencil (log-parameter difference).
function elas(level, key, deriv, eps) {
  return deriv((d) => lnN(level, { [key]: Math.exp(d) }), eps);
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS = 1e-3; // reproduces the imp-97644/imp-97668 primary step

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, {});
  // baseline linear axes at both stencils (target uses the same-stencil baseline for a fair reldiff)
  const E_CC_3 = elas(sigma, 'ch', deriv3, EPS);
  const E_CC_5 = elas(sigma, 'ch', deriv5, EPS);
  const E_CF_3 = elas(sigma, 'cf', deriv3, EPS);
  const E_CF_5 = elas(sigma, 'cf', deriv5, EPS);
  // wrapper elasticities at both stencils
  const E_CKH_3 = elas(sigma, 'ckh', deriv3, EPS);
  const E_CKH_5 = elas(sigma, 'ckh', deriv5, EPS);
  const E_GEXP_3 = elas(sigma, 'gexp', deriv3, EPS);
  const E_GEXP_5 = elas(sigma, 'gexp', deriv5, EPS);
  const ckh_reldiff_3 = E_CKH_3 / (0.5 * E_CC_3) - 1;
  const ckh_reldiff_5 = E_CKH_5 / (0.5 * E_CC_5) - 1;
  const gexp_reldiff_3 = E_GEXP_3 / (TC_A1_TRAP * E_CF_3) - 1;
  const gexp_reldiff_5 = E_GEXP_5 / (TC_A1_TRAP * E_CF_5) - 1;
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    // R1: sqrt wrapper -- pure truncation, cured by the 5-point rule
    elasticity_CKH_3pt: +E_CKH_5.toFixed(9), // continuum value (5-pt is the reference)
    ckh_reldiff_vs_half_CC_3pt: +ckh_reldiff_3.toExponential(3),
    ckh_reldiff_vs_half_CC_5pt: +ckh_reldiff_5.toExponential(3),
    ckh_stencil_improvement_x: +(Math.abs(ckh_reldiff_3 / ckh_reldiff_5)).toExponential(2),
    // R2: exp wrapper -- truncation only at flow-heavy L2, noise-limited at deep landmarks
    elasticity_GEXP: +E_GEXP_5.toExponential(6),
    gexp_reldiff_vs_TC_CF_3pt: +gexp_reldiff_3.toExponential(3),
    gexp_reldiff_vs_TC_CF_5pt: +gexp_reldiff_5.toExponential(3),
    gexp_stencil_improvement_x: +(Math.abs(gexp_reldiff_3 / gexp_reldiff_5)).toExponential(2),
  };
});

// R1 diagnostic: the sqrt-wrapper residual is cured to machine precision at every landmark.
const CKH_5PT_MAX_ABS_RELDIFF = Math.max(...PER_LANDMARK.map((r) => Math.abs(r.ckh_reldiff_vs_half_CC_5pt)));
// R2 diagnostic: the exp-wrapper 5-point rule improves only where E_GEXP is largest (the flow-heavy L2).
const GEXP_5PT_IMPROVES_AT_L2 = PER_LANDMARK[0].gexp_stencil_improvement_x > 1;

export const IMP97686_WRAPPER_ELASTICITY_5POINT_REFINE = {
  id: 'imp-97686',
  proofSection: 'S-frontier',
  question:
    'imp-97668 classified the two non-linear-wrapper constants of E_N -- C_KH (via sqrt) and the Gronwall ' +
    'exponent (via exp) -- as collapsing onto a single linear axis at a fixed weight, measured to ~1e-7 ' +
    '(E_CKH = 0.5 E_CC) and ~1e-4 (E_GEXP = TC_A1_TRAP E_CF) on the 3-point O(eps^2) stencil. imp-97665 ' +
    'showed the analogous E_CF/E_ET residual was pure central-difference truncation, cut ~5 orders by a ' +
    '5-point O(eps^4) stencil. Do the two wrapper residuals likewise fall below their 3-point floors under ' +
    'the higher-order stencil, confirming no fresh leverage direction? Measurement only; no bound moves; no QED.',
  method:
    'Re-measure E_CKH and E_GEXP with the imp-97665 5-point O(eps^4) stencil D5[f] = (-f(2eps) + 8 f(eps) ' +
    '- 8 f(-eps) + f(-2eps)) / (12 eps) at the three imp-97520 landmarks (sigma = 0.9, 0.5, 0.1, eps = 1e-3), ' +
    'compare with the 3-point O(eps^2) values against the analytic targets 0.5 E_CC and TC_A1_TRAP E_CF ' +
    '(each using the same-stencil baseline axis), and diagnose whether each residual is central-difference ' +
    'truncation (cured by the higher order) or arithmetic noise (not).',
  step_probed: { eps: EPS },
  perLandmark: PER_LANDMARK,
  finding: {
    R1_CKH_pure_truncation_cured:
      'The sqrt wrapper is a log-linear reparametrization -- probing C_KH by exp(delta) is exactly probing ' +
      'C_H by exp(delta/2) -- so E_CKH = 0.5 E_CC identically and the 3-point residual is pure central-' +
      'difference truncation. The 5-point stencil drops it to ~1e-12..1e-13 at every landmark (a ~5-order ' +
      'cut at L2), reproducing the imp-97665 result for this wrapper. No fresh leverage direction.',
    R2_GEXP_noise_limited_at_depth:
      'The Gronwall-exponent elasticity is vanishingly small (E_GEXP = TC_A1_TRAP E_CF ~ 1e-5..1e-8 across ' +
      'L2..L4). At the flow-heavy L2 the 3-point residual is truncation and the 5-point rule improves it ' +
      '~4.3x (to ~4e-8). At L3/L4 the residual sits at the bisection-quantization noise floor and the ' +
      '5-point rule does NOT improve it: it is arithmetic noise, not a central-difference tail. The exact ' +
      'continuum identity E_GEXP = TC_A1_TRAP E_CF is confirmed to the noise floor at every landmark.',
    R3_no_new_leverage_direction:
      'Both wrapper elasticities remain in span{E_CC, E_CF} at fixed scalar weights (0.5 and TC_A1_TRAP). ' +
      'The higher-order stencil surfaces no hidden non-linear amplitude; the imp-97668 A2 classification ' +
      'survives below its 3-point floor for C_KH (exactly) and to the noise floor for the Gronwall exponent. ' +
      'DIAG3 == 0 (the imp-97644 STRUCTURE (1) homogeneity) is untouched.',
  },
  diagnostics: {
    ckh_5pt_max_abs_reldiff: +CKH_5PT_MAX_ABS_RELDIFF.toExponential(3),
    gexp_5pt_improves_at_L2: GEXP_5PT_IMPROVES_AT_L2,
  },
  caveats:
    'MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed ' +
    'here only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

export default IMP97686_WRAPPER_ELASTICITY_5POINT_REFINE;
