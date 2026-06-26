/**
 * @module data/lambda-estimator-triptych-imp2991
 *
 * imp-2991: side-by-side tabulation of the three INDEPENDENT Lambda
 * cross-validation estimators, with their representative values and an
 * explicit honest status, for surfacing on the Rigor Dashboard.
 *
 *   1. heat-flow      (imp-292 / 372) -- analytical initial-slope estimate
 *                                        of the finite-N collision-time
 *                                        intercept; a LOWER-BOUND leg.
 *   2. barrier        (imp-299 / 404) -- barrier-extrapolation OLS intercept
 *                                        of the same finite-N intercept.
 *   3. kernel-hack    (imp-360 / 373) -- analytical GUE-spacing asymptotic
 *                                        Lambda ~ s_min^2 / 4 at Platt scale.
 *
 * WHY A NEW MODULE: the three estimators each owned their own page/record
 * but were never tabulated together in one place. The exact per-N OLS
 * intercepts (a_hf_norm, a_barrier, a_rk4) live in the SYSTEM-OF-RECORD
 * cross-estimator-agreement-imp2884.js, whose build-time tripwire already
 * asserts they triangulate within their published bands. That module
 * transitively imports the 16.7MB ZEROS_EXTENDED bundle and so cannot be
 * imported into a page (no-heavy-imports rule). This module therefore bakes
 * the documented REFERENCE LITERALS and points to the owner modules for the
 * live numbers -- a presentational tabulation, not a recomputation.
 *
 * HONEST STATUS: all three legs are ESTIMATES, not rigorous bounds. The
 * heat-flow and barrier legs estimate the same finite-N intercept (Lambda
 * in the ~0.01 region) and mutually agree per the imp-2884 tripwire; the
 * kernel-hack leg is a different-scale asymptotic (T ~ 10^12) and is only
 * compared scope-matched. The certified finite-height Lambda claim continues
 * to rest on the interval-RK4 brackets and Platt-Trudgian Lambda <= 0.2,
 * never on this triangulation (imp-2754 / C_H wall guard).
 */

export const LAMBDA_ESTIMATOR_TRIPTYCH_IMP2991 = {
  id: 'imp-2991',
  proofSection: 'S7',
  title:
    'Heat-flow vs barrier vs kernel-hack Lambda cross-validation estimators, side by side',
  subtitle:
    'Three independent finite-N / asymptotic Lambda estimators with their ' +
    'representative values and honest status. Agreement is a confidence ' +
    'signal, NOT a rigorous bound.',

  // ── The three estimators ───────────────────────────────────────────────────
  estimators: [
    {
      key: 'heat-flow',
      label: 'Heat-flow (initial-slope)',
      ticket: 'imp-292 / 372',
      method:
        'For each N in {50, 100, 200, 500, 870} compute B_0 = min consecutive ' +
        'zero spacing and the factor-2 Dyson dB/dtau at tau = 0; OLS the ' +
        'initial-slope collision time tc_hf_initial vs 1/N, then halve for ODE ' +
        'normalization to get a_hf_norm.',
      scope: 'finite-N intercept (N up to 870)',
      representativeLambda: '~0.01 region (lower-bound leg)',
      kind: 'one-sided lower bound',
      status: 'ESTIMATE',
      honestLimit:
        'tc_hf_initial is a LOWER BOUND on the true heat-flow collision time, ' +
        'so a_hf_norm <= a_rk4 + 2*seA is the CONSISTENT direction. Full parity ' +
        'needs the open sub-gap imp372-Ht-full (actual H_t zero trajectories).',
      ownerModule: 'heat-flow-cross-validation-imp372.js (a_hf_norm)',
    },
    {
      key: 'barrier',
      label: 'Barrier-extrapolation',
      ticket: 'imp-299 / 404',
      method:
        'Track the barrier B(t) = min spacing along the backward Dyson flow per ' +
        'N, read off the barrier collision time t_c(N), and OLS in 1/N; the ' +
        'intercept a_barrier estimates Lambda at N -> infinity.',
      scope: 'finite-N intercept',
      representativeLambda: '~0.011',
      kind: 'two-sided estimate',
      status: 'ESTIMATE',
      honestLimit:
        'A heuristic OLS extrapolation, not a certified bound. Agrees with the ' +
        'Path-C / RK4 intercept a_rk4 within 2*seA_rk4 (imp-2884 tripwire).',
      ownerModule: 'barrier-extrapolation-v2.js (a_barrier)',
    },
    {
      key: 'kernel-hack',
      label: 'Kernel-hack (analytical GUE)',
      ticket: 'imp-360 / 373',
      method:
        'Evaluate the asymptotic Lambda ~ s_min^2 / 4 with the minimum spacing ' +
        's_min taken from GUE-spacing statistics at the matched Riemann-von ' +
        'Mangoldt height; anchored on the PATH_C_BASELINE_FIT_V2 OLS fit.',
      scope: 'asymptotic at Platt scale T ~ 10^12',
      representativeLambda: '~1.3e-10',
      kind: 'asymptotic heuristic',
      status: 'ESTIMATE',
      honestLimit:
        'A GUE-spacing asymptotic at a height far above the in-repo zero list; ' +
        'NOT directly comparable to the finite-N legs and used only in ' +
        'scope-matched comparisons.',
      ownerModule: 'kernel-hack-at-imp360.js / spectral-lambda-kernel.js',
    },
  ],

  // ── Cross-validation verdict (honest) ───────────────────────────────────────
  crossValidation:
    'The heat-flow and barrier legs estimate the SAME finite-N intercept and ' +
    'mutually agree within their owner modules published bands (the imp-2884 ' +
    'build-time tripwire fails the build if any leg regresses). The kernel-hack ' +
    'leg is a different-scale asymptotic and is only ever compared scope-matched. ' +
    'Independent-method agreement raises confidence; it does NOT promote any leg ' +
    'to a rigorous bound.',

  honestCeiling:
    'ESTIMATE — NOT RIGOROUS. All three legs are heuristic Lambda estimators ' +
    'gated by the undischargeable constant C_H (imp-2640). The certified ' +
    'finite-height Lambda claim rests on the interval-RK4 brackets and the ' +
    'Platt-Trudgian unconditional Lambda <= 0.2, never on this triangulation.',

  systemOfRecord:
    'cross-estimator-agreement-imp2884.js holds the live per-N OLS intercepts ' +
    '(a_hf_norm, a_barrier, a_rk4) and the pairwise-agreement tripwire. It is ' +
    'not page-importable because it transitively pulls the 16.7MB ZEROS bundle; ' +
    'this module bakes the documented reference literals for display.',

  sources: [
    'imp-292/372: heat-flow-cross-validation-imp372.js',
    'imp-299/404: barrier-extrapolation-v2.js (imp-299 method ~0.011)',
    'imp-360/373: kernel-hack-at-imp360.js + spectral-lambda-kernel.js (~1.3e-10)',
    'imp-2884: cross-estimator-agreement-imp2884.js (system-of-record tripwire)',
  ],
};

// ── Load-time honesty guard ──────────────────────────────────────────────────
// Cheap structural check: every estimator must carry a value AND an ESTIMATE
// status so this tabulation can never silently drop an honest-status label.
(() => {
  const rows = LAMBDA_ESTIMATOR_TRIPTYCH_IMP2991.estimators;
  if (!Array.isArray(rows) || rows.length !== 3) {
    throw new Error('[imp-2991] estimator triptych must list exactly 3 estimators');
  }
  for (const r of rows) {
    if (!r.representativeLambda || r.status !== 'ESTIMATE') {
      throw new Error(
        '[imp-2991] estimator ' + r.key + ' is missing a value or honest ESTIMATE status',
      );
    }
  }
})();
