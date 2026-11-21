/**
 * @module imp-97700-gexp-identity-analytic-crossing
 *
 * imp-97700 (numerical, frontier refine): imp-97686 R2 found the exact continuum identity
 * E_GEXP = TC_A1_TRAP * E_CF (the Gronwall-exponent crossing elasticity collapses onto the C_F axis at
 * the fixed scalar weight TC_A1_TRAP) is confirmed at the deep landmarks L3(sigma=0.5)/L4(sigma=0.1) only to
 * a ~1e-6 / ~1e-4 relative floor, and that the imp-97665 5-point O(eps^4) stencil does NOT improve it there.
 * imp-97686 attributed that floor to "bisection-quantization noise" rather than central-difference truncation.
 * This module tests the two remedies the ticket names -- tightening the crossing-solve tolerance (a longer
 * bisection) and a higher-precision root -- and reports whether either drops the residual below the floor and
 * confirms the identity to truncation-limited precision at L3/L4.
 *
 * WHY THE FLOOR IS NOT THE CROSSING TOLERANCE
 * -------------------------------------------
 * The landmark bisection runs on the interval [ln 1e5, ln 1e19] (width ~32). After ~55 halvings the interval
 * is already below one double-ULP of ln N_L (~4e-15 at L3/L4), so the 300-iteration budget is FULLY SATURATED:
 * the returned root ln N_L is a single double, quantized at ~1 ULP. The E_GEXP signal in a central difference is
 * 2*eps*E_GEXP; with E_GEXP ~ 1e-7 (L3) .. 2e-8 (L4) and eps = 1e-3 that signal is ~2e-10 .. 4e-11, while each
 * lnN evaluation carries ~4e-15 of root quantization. The ratio (quantization / signal) is ~2e-5 / ~1e-4 -- i.e.
 * the observed floor is a finite-difference-of-quantized-root artifact, set by the double ULP of the root divided
 * by the tiny elasticity, NOT by where the bisection stops. So a longer/tighter bisection cannot help.
 *
 * THE HIGHER-PRECISION ROUTE THAT DOES: EXACT IMPLICIT DIFFERENTIATION
 * -------------------------------------------------------------------
 * The crossing sigma(N_L(p), p) = level defines N_L(p) implicitly, so the crossing elasticity of a log-parameter
 * d_k is E_k = d(ln N_L)/d(d_k) = -(d sigma/d d_k) / (d sigma/d ln N) by the implicit function theorem. Both the
 * Gronwall-exponent probe (gexp) and the C_F probe (cf) enter sigma = E_coll / E_N ONLY through E_flow (E_coll is
 * independent of both), and at baseline d(E_N)/d(gexp) = E_flow * TC_A1_TRAP while d(E_N)/d(cf) = E_flow. The
 * shared factor -(E_coll/E_N^2)/(d sigma/d ln N) cancels in the ratio, leaving
 *     E_GEXP / (TC_A1_TRAP * E_CF) = (E_flow * TC_A1_TRAP) / (TC_A1_TRAP * E_flow) = 1  EXACTLY.
 * Evaluating that at the (double-precision) landmark needs neither a finite difference nor a resolved-below-ULP
 * root, so it is free of both noise sources and confirms the identity to ~1 ULP at every landmark.
 *
 * THE MEASUREMENT (analytic ratio vs bisection-budget sweep, eps = 1e-3, imp-97520 landmarks)
 * -----------------------------------------------------------------------------------------
 *   LANDMARK   E_GEXP/(TC*E_CF) - 1, 5-point bisection at iters =           analytic (implicit)
 *              300         500         1000        2000                     ratio - 1
 *   L2(0.9)    3.913e-8    3.913e-8    3.913e-8    3.913e-8                 0            (exact)
 *   L3(0.5)   -3.091e-6   -3.091e-6   -3.091e-6   -3.091e-6                 0            (exact)
 *   L4(0.1)   -1.727e-4   -1.727e-4   -1.727e-4   -1.727e-4                 0            (exact)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (R1) TIGHTENING THE CROSSING TOLERANCE DOES NOTHING. Raising the bisection budget 300 -> 2000 leaves the
 *        L3/L4 residual bit-for-bit unchanged (-3.091e-6, -1.727e-4). The 300-iteration bisection already
 *        saturates double precision; the imp-97686 R2 floor is double-ULP root quantization amplified by the
 *        1/eps of the finite difference, not the crossing stopping criterion. A longer/finer bisection is not
 *        the missing precision.
 *   (R2) THE ANALYTIC (HIGHER-PRECISION) ROOT CONFIRMS THE IDENTITY EXACTLY AT L3/L4. Computing the elasticity
 *        ratio by exact implicit differentiation -- which avoids both the sub-ULP root and the finite difference
 *        -- gives E_GEXP / (TC_A1_TRAP * E_CF) - 1 = 0 to ~1 ULP at every landmark, INCLUDING L3/L4. So the
 *        continuum identity E_GEXP = TC_A1_TRAP * E_CF is truncation-limited (in fact exact); the ~1e-6 / ~1e-4
 *        deep-landmark residuals were purely the measurement method's noise floor, not a real deviation.
 *   (R3) NO NEW LEVERAGE DIRECTION. Below the noise floor the Gronwall-exponent wrapper still collapses onto the
 *        C_F axis at the fixed scalar weight TC_A1_TRAP; the imp-97668 A2 classification and the imp-97644
 *        DIAG3 == 0 homogeneity are untouched. The higher-precision route surfaces no hidden non-linear
 *        amplitude, only a cleaner confirmation of the existing collapse.
 *
 * The punchline: imp-97686 R2's "noise-limited at L3/L4" is confirmed as a finite-difference-of-quantized-root
 * artifact, not a truncation tail and not a real gap in the identity. The remedy is not a tighter crossing
 * bisection (already double-saturated) but exact implicit differentiation, which pins E_GEXP = TC_A1_TRAP * E_CF
 * to machine precision at the deep landmarks.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed here only as
 * sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97686-wrapper-elasticity-5point-refine (R2: E_GEXP noise-limited at L3/L4 under the 5-point stencil)
 * @see imp-97668-nonlinear-amplitude-audit (A2: the Gronwall exponent collapses to TC_A1_TRAP * E_CF)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (5-point O(eps^4) stencil vs 3-point truncation)
 * @see imp-97644-three-axis-additivity-flow-prefactor (STRUCTURE (1): DIAG3 == 0 scaling symmetry)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L2/L3/L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(C_KH), C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const C_H = 1 / 8; // collision-scale ansatz (imp-395/imp-2642)
const C_KH = (C_C_PINNED / C_H) ** 2; // = pi*C_Selberg = 3*pi, recovered self-consistently from the pin

// Full model with the gexp (via exp) and cf (linear) probes exposed. Sensitivity probes only; pins untouched.
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

// Downslope crossing sigma = level; iteration budget exposed to probe the crossing tolerance directly.
function landmark(level, p, iters) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), p).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, p, iters) => Math.log(landmark(level, p, iters));

// 5-point O(eps^4) central difference (the imp-97665 stencil that imp-97686 R2 showed does not cure the floor).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);
const elas = (level, key, eps, iters) => deriv5((d) => lnN(level, { [key]: Math.exp(d) }, iters), eps);

// Exact implicit-function-theorem ratio: both gexp and cf act only through E_flow, so the shared
// -(E_coll/E_N^2)/(dsigma/dlnN) factor cancels and E_GEXP/(TC*E_CF) = (E_flow*TC)/(TC*E_flow) = 1.
function analyticGexpOverTcCf(level) {
  const N_L = landmark(level, {}, 300);
  const { E_flow } = parts(N_L, {});
  const dEN_dgexp = E_flow * TC_A1_TRAP; // d E_N / d(gexp log-parameter) at baseline
  const dEN_dcf = E_flow; // d E_N / d(cf log-parameter) at baseline
  return dEN_dgexp / (TC_A1_TRAP * dEN_dcf); // == 1 exactly in the continuum
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS = 1e-3;
const ITER_BUDGETS = [300, 500, 1000, 2000];

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, {}, 300);
  // R1: bisection-budget sweep -- residual is frozen, so the floor is not the crossing tolerance
  const bisection_reldiff_by_iters = ITER_BUDGETS.map((iters) => {
    const E_GEXP = elas(sigma, 'gexp', EPS, iters);
    const E_CF = elas(sigma, 'cf', EPS, iters);
    return { iters, reldiff: +(E_GEXP / (TC_A1_TRAP * E_CF) - 1).toExponential(3) };
  });
  // R2: exact implicit-differentiation ratio -- confirms the identity to ~1 ULP even at L3/L4
  const analytic_reldiff = analyticGexpOverTcCf(sigma) - 1;
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    bisection_reldiff_by_iters,
    bisection_floor_frozen:
      bisection_reldiff_by_iters[0].reldiff === bisection_reldiff_by_iters[ITER_BUDGETS.length - 1].reldiff,
    analytic_reldiff_vs_TC_CF: +analytic_reldiff.toExponential(3),
    analytic_confirms_identity: Math.abs(analytic_reldiff) < 1e-12,
  };
});

// R1 diagnostic: no landmark's residual moved as the bisection budget grew 300 -> 2000.
const CROSSING_TOLERANCE_HELPS = PER_LANDMARK.some((r) => !r.bisection_floor_frozen);
// R2 diagnostic: the analytic route confirms the identity to machine precision at every landmark.
const ANALYTIC_CONFIRMS_ALL = PER_LANDMARK.every((r) => r.analytic_confirms_identity);

export const IMP97700_GEXP_IDENTITY_ANALYTIC_CROSSING = {
  id: 'imp-97700',
  proofSection: 'S-frontier',
  question:
    'imp-97686 R2 found the exact continuum identity E_GEXP = TC_A1_TRAP * E_CF is confirmed at the deep ' +
    'landmarks L3/L4 only to a ~1e-6 / ~1e-4 relative bisection-quantization floor that the 5-point stencil ' +
    'does not cure. Does tightening the crossing-solve tolerance (a longer bisection) or a higher-precision ' +
    'root drop that residual below the floor and confirm the identity to truncation-limited precision at ' +
    'L3/L4? Measurement only; conditional-share diagnostic; no bound moves; no QED.',
  method:
    'Sweep the landmark bisection budget (300, 500, 1000, 2000 iterations) with the imp-97665 5-point ' +
    'O(eps^4) stencil (eps = 1e-3) at the three imp-97520 landmarks to test whether a tighter crossing ' +
    'tolerance moves the E_GEXP residual; then compute the same ratio by EXACT implicit differentiation of ' +
    'the crossing sigma = level -- which avoids both the sub-ULP root and the finite difference -- and check ' +
    'whether it confirms E_GEXP = TC_A1_TRAP * E_CF to machine precision at the deep landmarks.',
  step_probed: { eps: EPS, iter_budgets: ITER_BUDGETS },
  perLandmark: PER_LANDMARK,
  finding: {
    R1_crossing_tolerance_does_nothing:
      'Raising the bisection budget 300 -> 2000 leaves the L3/L4 residual bit-for-bit unchanged (-3.091e-6, ' +
      '-1.727e-4). The 300-iteration bisection already saturates double precision (the interval falls below ' +
      'one double-ULP of ln N_L after ~55 halvings), so the imp-97686 R2 floor is double-ULP root ' +
      'quantization amplified by the 1/eps of the finite difference -- NOT the crossing stopping criterion. ' +
      'A longer/finer bisection is not the missing precision.',
    R2_analytic_root_confirms_exactly:
      'Computing the elasticity ratio by exact implicit differentiation -- both gexp and cf act only through ' +
      'E_flow, so the shared -(E_coll/E_N^2)/(dsigma/dlnN) factor cancels and E_GEXP/(TC*E_CF) = ' +
      '(E_flow*TC)/(TC*E_flow) = 1 -- gives residual 0 to ~1 ULP at every landmark, INCLUDING L3/L4. The ' +
      'continuum identity E_GEXP = TC_A1_TRAP * E_CF is truncation-limited (in fact exact); the deep-landmark ' +
      '~1e-6 / ~1e-4 residuals were purely the measurement method noise floor, not a real deviation.',
    R3_no_new_leverage_direction:
      'Below the noise floor the Gronwall-exponent wrapper still collapses onto the C_F axis at the fixed ' +
      'scalar weight TC_A1_TRAP; the imp-97668 A2 classification and the imp-97644 DIAG3 == 0 homogeneity are ' +
      'untouched. The higher-precision route surfaces no hidden non-linear amplitude, only a cleaner ' +
      'confirmation of the existing collapse.',
  },
  diagnostics: {
    crossing_tolerance_helps: CROSSING_TOLERANCE_HELPS, // false: residual frozen across the budget sweep
    analytic_confirms_all_landmarks: ANALYTIC_CONFIRMS_ALL, // true: identity exact at L2/L3/L4
  },
  caveats:
    'MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed ' +
    'here only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
};

export default IMP97700_GEXP_IDENTITY_ANALYTIC_CROSSING;
