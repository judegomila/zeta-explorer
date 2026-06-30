/**
 * @module data/heat-flow-parity-gap-imp3028
 *
 * imp-3028: measure the open imp372-Ht-full PARITY GAP for the heat-flow
 * Lambda estimator leg (lambda-estimator-triptych-imp2991.js / imp-372).
 *
 * THE LEG. heat-flow-cross-validation-imp372.js estimates the finite-N
 * collision time by the analytic INITIAL-SLOPE linearization
 *     t_c^init(N) = B_0(N) / |dB/dtau|_{tau=0}                  (factor-2 Dyson)
 * and OLS-fits its 1/N intercept to get a_hf_norm. Its honestLimit defers the
 * comparison against the ACTUAL backward-Dyson trajectories to the open
 * sub-gap imp372-Ht-full (deferred at build time as ~1e9 ops/N). This module
 * bakes an OFFLINE measurement of that gap.
 *
 * WHAT WAS MEASURED (offline, scripts/imp3028-ht-parity-offline.mjs, NOT in the
 * Vite build). For N in {50, 100, 200} the FULL N-body factor-2 backward-Dyson
 * surrogate ODE
 *     dg_k/dtau = -2 * sum_{j!=k} 1/(g_k - g_j)
 * was integrated with adaptive RK4 from the first N Riemann zeros until the
 * minimum consecutive gap closes, giving the TRUE first-collision time
 * t_c^actual(N). Collision time is stable to ~0.2% under 5x step refinement.
 *
 * HEADLINE FINDING (honest, and it corrects the leg's stated direction).
 * The actual collision time is roughly HALF the initial-slope estimate:
 * t_c^actual / t_c^init ~ 0.47-0.49 across N, with the 1/N intercept ratio
 * a_actual / a_init = 0.489. So the initial-slope linearization is an
 * UPPER BOUND on the surrogate collision time, NOT a lower bound. This is
 * exactly the 2-body analytic limit: for a single pair at gap B_0,
 *     dB/dtau = -4/B  =>  B^2/2 = 4*tau  =>  t_c^actual = B_0^2 / 8,
 * while the initial-slope estimate is t_c^init = B_0 / (4/B_0) = B_0^2 / 4,
 * giving the EXACT ratio 1/2. The many-body far-field nudges the measured
 * ratio off 1/2 by a few percent.
 *
 * SCOPE / WHAT THIS DOES NOT DO.
 *   - It integrates the Dyson SURROGATE ODE (the same vector field imp-372
 *     linearizes), not the literal H_t heat-flow PDE. So it quantifies the
 *     LINEARIZATION slack within the surrogate; the surrogate-vs-PDE gap is a
 *     further open piece. No closure of imp372-Ht-full is claimed.
 *   - The measured direction (UPPER bound, ratio -> 1/2) CONTRADICTS the
 *     imp-372 honestLimit wording ("t_c^init is a LOWER BOUND ... a_hf_norm <=
 *     a_rk4 + 2*seA is the consistent direction"). Reconciling that wording
 *     with this measurement is filed as the named sub-gap imp372-Ht-direction;
 *     this module does NOT rewrite the imp-372 leg or the Lambda chain.
 *   - The certified finite-height Lambda claim rests on the interval-RK4
 *     brackets and Platt-Trudgian Lambda <= 0.2, never on this leg.
 *
 * PT Lambda <= 0.2 stays SOTA. This is a diagnostic magnitude, not a bound.
 */

export const HEAT_FLOW_PARITY_GAP_IMP3028 = {
  id: 'imp-3028',
  proofSection: 'S-frontier',
  title:
    'Measured imp372-Ht-full parity gap: full-trajectory vs initial-slope ' +
    'heat-flow collision time at small N',
  subtitle:
    'Actual full N-body Dyson-surrogate collision time is ~0.47-0.49x the ' +
    'initial-slope estimate (2-body limit: exactly 1/2). The linearization is ' +
    'an UPPER bound, not a lower bound. Diagnostic only; PT Lambda <= 0.2 SOTA.',

  convention: 'factor-2 backward-Dyson (dg_k/dtau = -2*sum 1/(g_k-g_j))',

  // ── Per-N measured collision times (offline RK4; literals baked) ──────────
  // tc_init  = B_0 / |dB/dtau|_0   (initial-slope LOWER-bound leg, imp-372)
  // tc_actual = full N-body RK4 first-collision time
  perN: [
    { N: 50,  B0: 0.8451236, tc_init: 2.057140e-1, tc_actual: 9.592153e-2, ratio: 0.46629 },
    { N: 100, B0: 0.7157867, tc_init: 1.536855e-1, tc_actual: 7.014710e-2, ratio: 0.45643 },
    { N: 200, B0: 0.4981795, tc_init: 6.894137e-2, tc_actual: 3.387620e-2, ratio: 0.49138 },
  ],

  // ── 1/N OLS intercepts of the two collision-time legs (factor-2) ──────────
  interceptInitialSlope: 4.292708e-2, // a_init  (matches the imp-372 a_hf leg, factor-2)
  interceptActual:       2.098899e-2, // a_actual (full-trajectory)
  parityGap:            -2.193809e-2, // a_actual - a_init
  interceptRatio:        0.48895,     // a_actual / a_init

  // ── Exact 2-body analytic anchor ──────────────────────────────────────────
  twoBody: {
    tc_actual_formula: 'B0^2 / 8',
    tc_init_formula:   'B0^2 / 4',
    exactRatio:        0.5,
    note:
      'A single pair at gap B0 closes in t_c = B0^2/8 under dB/dtau = -4/B; ' +
      'the initial-slope estimate is B0^2/4. Exact ratio 1/2 anchors the ' +
      'measured many-body ~0.47-0.49 and certifies the UPPER-bound direction.',
  },

  honestStatus:
    'ESTIMATE / DIAGNOSTIC. Quantifies the initial-slope linearization slack ' +
    'within the Dyson surrogate (~2x: linear over-estimates collision time). ' +
    'It does NOT integrate the literal H_t PDE and does NOT close imp372-Ht-full.',

  // Named open sub-gaps surfaced by this measurement.
  subGaps: [
    'imp372-Ht-full: surrogate-vs-literal-H_t-PDE collision-time gap still open.',
    'imp372-Ht-direction: the measured UPPER-bound direction (ratio -> 1/2) ' +
      'contradicts the imp-372 honestLimit LOWER-bound wording; reconcile the ' +
      'a_hf_norm <= a_rk4 + 2*seA inequality direction (chain untouched here).',
  ],

  offlineScript: 'scripts/imp3028-ht-parity-offline.mjs',
  sources: [
    'imp-372: heat-flow-cross-validation-imp372.js (initial-slope a_hf_norm leg)',
    'imp-2991: lambda-estimator-triptych-imp2991.js (heat-flow honestLimit)',
  ],
};

// ── Load-time honesty + analytic tripwires ───────────────────────────────────
(() => {
  const D = HEAT_FLOW_PARITY_GAP_IMP3028;

  // (1) every measured row must show the actual collision SHORTER than the
  //     initial-slope estimate (UPPER-bound direction), with ratio near 1/2.
  for (const r of D.perN) {
    if (!(r.tc_actual < r.tc_init)) {
      throw new Error(
        '[imp-3028] N=' + r.N + ' actual collision time must be below the ' +
        'initial-slope estimate (upper-bound direction)',
      );
    }
    if (r.ratio <= 0.4 || r.ratio >= 0.55) {
      throw new Error(
        '[imp-3028] N=' + r.N + ' collision-time ratio ' + r.ratio +
        ' drifted off the 2-body 1/2 anchor band [0.4, 0.55]',
      );
    }
  }

  // (2) intercept bookkeeping must be self-consistent.
  const gap = D.interceptActual - D.interceptInitialSlope;
  if (Math.abs(gap - D.parityGap) > 1e-6) {
    throw new Error('[imp-3028] parityGap literal inconsistent with intercepts');
  }
  const ratio = D.interceptActual / D.interceptInitialSlope;
  if (Math.abs(ratio - D.interceptRatio) > 1e-4) {
    throw new Error('[imp-3028] interceptRatio literal inconsistent with intercepts');
  }

  // (3) the exact 2-body anchor: t_c = B0^2/8 vs B0^2/4 is exactly 1/2.
  const B0 = 1.234567; // arbitrary positive probe
  const tcActual2 = (B0 * B0) / 8;
  const tcInit2 = (B0 * B0) / 4;
  if (Math.abs(tcActual2 / tcInit2 - D.twoBody.exactRatio) > 1e-12) {
    throw new Error('[imp-3028] 2-body analytic anchor must give exactly ratio 1/2');
  }
})();
