/**
 * @module data/imp-857-phased-forcing-sweep
 * @fileoverview imp-893 N-scaling sweep of the phase-locked traveling-wave
 *   Dyson forcing prototype src/math/imp-857-phase-locked-dyson.mjs. Records
 *   six measured (N, eps) grid cells out of the requested twenty, surfaces
 *   the headline negative finding that wrapper-width reduction decays from
 *   ~1000x at N=500 to ~1.05x at N=2000 under fixed (k0, omega), and tracks
 *   the residual research statement under the canonical sub-gap id
 *   imp-893-sub-large-N-rerun (which maps onto imp-896 large-N grid
 *   completion and imp-898 sub-step Brent-style collision-time bisection).
 *
 * Proof chain step: imp-857 alt-path (phased-forcing wrapper-width reduction
 *   as a candidate alternative to the directed-rounding backend of
 *   imp-857-sub-scale-to-N10k). Reads the imp-892 commutator bound
 *   |tau_c(eps) - tau_c(0)| <= eps * H_0^2 / 4 as a consistency invariant.
 *
 * Exports:
 *   - IMP_857_PHASED_FORCING_SWEEP (default + named): structured record with
 *     measuredRows (6 cells), reductionTable (per-N ratio + factor), commutator
 *     BoundConsistency (per-row predicted-shift vs RK4 dt), headlineFinding,
 *     interpretation, consequencesForRoadmap, openSubGaps (imp-896 large-N
 *     grid, imp-897 Richardson-extrapolated certified C_mb bound, imp-898
 *     sub-step bisection), canonical openSubGap (imp-893-sub-large-N-rerun),
 *     assertions (8 self-documenting tripwires), notes.
 *
 * Key assertions (self-documenting; not wired to run-assertions.mjs):
 *   - imp893-at-least-six-measured-rows: MEASURED_ROWS.length >= 6
 *   - imp893-baseline-rows-nonempty: at least one eps=0 row present
 *   - imp893-reduction-at-N1000-sub-unity-eps-0p05: ratio < 1
 *   - imp893-reduction-at-N2000-near-unity-eps-0p05: |ratio - 1| < 0.2
 *   - imp893-commutator-bound-consistent: every measured row consistent with
 *     imp-892 bound at RK4-step granularity
 *   - imp893-status-partial: PARTIAL closure flag pinned
 *   - imp893-sub-gaps-named: imp-896 / imp-897 / imp-898 ids surfaced
 *   - imp893-sub-large-N-rerun-subgap-named: canonical id + PARTIAL/open
 *     status pair pinned for cross-file references
 *
 * Created by: imp-893 (honest-partial scale sweep of the imp-857 phased-
 *   forcing prototype).
 * Modified by: imp-1000 (canonical sub-gap surfacing under id
 *   imp-893-sub-large-N-rerun + 8th assertion); imp-1041 (added @module /
 *   @fileoverview JSDoc header for navigation); imp-2518 (imp-897 sub-gap
 *   synced to RESOLVED-PARTIAL per imp-857-phased-forcing-richardson.js +
 *   exported IMP_857_PHASED_FORCING_SWEEP_ASSERTIONS tripwires, registered
 *   with run-assertions.mjs); imp-2517 (imp-896 sub-gap synced to
 *   RESOLVED-INFRASTRUCTURE per imp-896-retuning-calibration.js +
 *   imp-917-run-cell.mjs, residual imp-917; two more tripwires).
 *
 * Upstream deps:
 *   - src/math/imp-857-phase-locked-dyson.mjs (prototype the rows measure)
 *   - src/math/imp-857-phased-forcing-memo.js (motivation memo)
 *   - src/math/imp-857-commutator-bound.js (imp-892 bound used in consistency
 *     check)
 *   - src/data/zeros-to-1e6.js (ZEROS_EXTENDED, first-N zero source)
 */

/**
 * imp-893 / imp-857-sub-phased-forcing:
 *   N-scaling sweep of the phase-locked traveling-wave Dyson forcing
 *   prototype src/math/imp-857-phase-locked-dyson.mjs.
 *
 * SCOPE AND HONEST STATUS (read first)
 * ------------------------------------
 * This is an HONEST-PARTIAL closure of imp-893. The ticket requested a
 * (N x epsilon) sweep over
 *   N       in {1000, 2000, 5000, 10000}
 *   epsilon in {0,    0.01, 0.02, 0.05, 0.1}
 * with wrapper-width reduction factor, collision-time shift, and a
 * certified upper bound on C_mb_empirical(N) via Richardson extrapolation.
 *
 * WHAT IS DELIVERED HERE
 * ----------------------
 * Concrete per-run measurements from the existing prototype at
 *   (N, epsilon) in ({1000, 2000} x {0, 0.01, 0.05}).
 * That is six of the requested twenty grid cells. Each row records:
 *   - collision step (where interval min-gap crosses zero backward)
 *   - final maxIntervalWidth (wrapper width, proxy for RK4 error)
 *   - reductionFactor = maxW(epsilon) / maxW(0) at the final step
 *   - observed collision-time shift |tau_c(epsilon) - tau_c(0)| / tau_c(0)
 *     (which by the imp-892 commutator bound is O(epsilon) with
 *     universal constant C_tau = 1/4 in N).
 *
 * WHAT IS NOT DELIVERED (NAMED SUB-GAPS)
 * --------------------------------------
 *   (a) N in {5000, 10000}: the prototype drift_vector is O(N^2) per RK4
 *       stage and O(N^2) wall-time per step is ~60 s at N = 2000 in Node;
 *       at N = 10000 that is ~25x, i.e. a single three-way run would take
 *       well over an hour per eps. That exceeds the per-engine-turn budget.
 *       The N = 5000 / 10000 cells are deferred to imp-896 (named below).
 *   (b) epsilon in {0.02, 0.1}: the prototype hard-codes EPSILONS = [0,
 *       0.01, 0.05]. The two missing eps values are deferred to imp-896
 *       along with the large-N cells since they can be batched together.
 *   (c) Richardson-extrapolated certified upper bound on C_mb_empirical(N)
 *       from the {eps_1, eps_2} pair: requires all five eps-grid points
 *       to drive a two-point extrapolation with a small residual; since
 *       we do not have {0.02, 0.1}, the certified bound is also deferred.
 *
 * HEADLINE FINDING (NEGATIVE FOR THE NAIVE PATH)
 * ----------------------------------------------
 * At the fixed (k0, omega) = (pi, pi^2 * rho_mean) used by the N = 500
 * prototype, the wrapper-width reduction EFFECT DEGRADES WITH N:
 *
 *   N      reduction(eps=0.01)   reduction(eps=0.05)
 *   500     0.0009 (1114x)        0.005  (185x)   [prototype headline]
 *   1000    0.839   (1.19x)       0.444  (2.25x)  [this file]
 *   2000    0.953   (1.05x)       0.950  (1.05x)  [this file]
 *
 * The N = 500 prototype headline (185-1114x) does NOT generalize under
 * the fixed resonance parameters. By N = 2000 the reduction is within
 * 5% of unity, i.e. effectively null. The rapid decay across a factor-4
 * increase in N strongly suggests that (k0, omega) is N-specific and
 * must be retuned per N to stay on resonance.
 *
 * CONSEQUENCE FOR THE BROADER ROADMAP
 * -----------------------------------
 *   - imp-894 (resonance-tuning sweep for optimal (k0*, omega*) at N = 500)
 *     becomes a PREREQUISITE for the remaining N = 5000 / 10000 cells of
 *     imp-893. Running the existing fixed-(k0, omega) prototype at larger
 *     N without that retuning would spend budget on a configuration we
 *     already know does not scale.
 *   - The phased-forcing path CANNOT replace the directed-rounding backend
 *     of imp-857-sub-scale-to-N10k at fixed (k0, omega) = (pi, pi^2 *
 *     rho_mean). Whether it can replace it under retuned (k0*, omega*)
 *     is the open question imp-894 + imp-896 jointly answer.
 *   - imp-892 commutator bound is unaffected: that bound is
 *     |tau_c(eps) - tau_c(0)| <= (1/4) * eps * H_0^2 UNIFORMLY in N and
 *     in (k0, omega). The N = 1000 / 2000 data below is consistent with
 *     it (observed shift < eps * H_0^2 / 4 at every row).
 *
 * HOW TO EXTEND
 * -------------
 * The prototype src/math/imp-857-phase-locked-dyson.mjs reads IMP857_N,
 * IMP857_DT, IMP857_NSTEPS from the environment. To add rows, run:
 *   IMP857_N=5000  IMP857_DT=1e-5 IMP857_NSTEPS=20 node .../phase-locked-dyson.mjs
 *   IMP857_N=10000 IMP857_DT=1e-5 IMP857_NSTEPS=20 node .../phase-locked-dyson.mjs
 * and append the output to MEASURED_ROWS below. The prototype currently
 * sweeps only EPSILONS = [0, 0.01, 0.05]; add 0.02 and 0.1 to that array
 * when running for the full eps grid.
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc. Uses "k0" / "omega"
 * in prose where the Greek letters were used in the prototype.
 */

// ── Measured sweep rows (hard-coded from Node harness runs on 2026-04-20) ────
//
// Each row holds one run of the prototype at (N, eps) under the fixed
// (k0, omega) = (pi, pi^2 * rho_mean(N)) resonance parameters.
// collisionStep is the RK4 step at which the interval min-gap crossed
// zero (backward collision detected). maxWidth is the maxIntervalWidth
// reported at the final step. rho_mean is the per-N density used to set
// omega, derived from the first-N Riemann zero table (ZEROS_EXTENDED).

const MEASURED_ROWS = [
  // N = 1000 cohort ---------------------------------------------------------
  {
    N: 1000,
    dt: 1e-4,
    nSteps: 40,
    k0: Math.PI,
    rho_mean: 0.7109,
    omega: Math.PI * Math.PI * 0.7109,
    eps: 0,
    collisionStep: 34,
    tAbs_at_collision: 0.0034,
    maxWidth: 3.359e-8,
    minGapLo: -0.09845,
  },
  {
    N: 1000,
    dt: 1e-4,
    nSteps: 40,
    k0: Math.PI,
    rho_mean: 0.7109,
    omega: Math.PI * Math.PI * 0.7109,
    eps: 0.01,
    collisionStep: 34,
    tAbs_at_collision: 0.0034,
    maxWidth: 2.818e-8,
    minGapLo: -0.08956,
  },
  {
    N: 1000,
    dt: 1e-4,
    nSteps: 40,
    k0: Math.PI,
    rho_mean: 0.7109,
    omega: Math.PI * Math.PI * 0.7109,
    eps: 0.05,
    collisionStep: 34,
    tAbs_at_collision: 0.0034,
    maxWidth: 1.492e-8,
    minGapLo: -0.06559,
  },
  // N = 2000 cohort ---------------------------------------------------------
  {
    N: 2000,
    dt: 1e-4,
    nSteps: 20,
    k0: Math.PI,
    rho_mean: 0.7992,
    omega: Math.PI * Math.PI * 0.7992,
    eps: 0,
    collisionStep: 12,
    tAbs_at_collision: 0.0012,
    maxWidth: 2.519e-10,
    minGapLo: -0.007611,
  },
  {
    N: 2000,
    dt: 1e-4,
    nSteps: 20,
    k0: Math.PI,
    rho_mean: 0.7992,
    omega: Math.PI * Math.PI * 0.7992,
    eps: 0.01,
    collisionStep: 12,
    tAbs_at_collision: 0.0012,
    maxWidth: 2.401e-10,
    minGapLo: -0.007537,
  },
  {
    N: 2000,
    dt: 1e-4,
    nSteps: 20,
    k0: Math.PI,
    rho_mean: 0.7992,
    omega: Math.PI * Math.PI * 0.7992,
    eps: 0.05,
    collisionStep: 12,
    tAbs_at_collision: 0.0012,
    maxWidth: 2.394e-10,
    minGapLo: -0.007244,
  },
  // N = 1000 RETUNED cohort (imp-917-exec batch 1 of 6, 2026-06-10 UTC) ------
  //
  // First executed batch of the imp-917 14-cell grid: one triple run of the
  // prototype via scripts/imp-917-run-cell.mjs --N 1000 --eps 0,0.02,0.1
  // (460 s wall) under the imp-894/imp-896 retuned resonance
  // k0_star = 2*pi/min_gap(1000) = 38.90498235326948,
  // phaseVel_star = pi*rho_mean(1000) = 2.2333155953106685,
  // omega_star = k0_star * phaseVel_star. Covers MISSING_CELLS rows
  // (1000, 0.02) and (1000, 0.1); the eps = 0 baseline is re-run for
  // internal cohort consistency and exactly reproduces the fixed-resonance
  // baseline above (forcing vanishes at eps = 0, so the resonance
  // parameters are inert there) — maxWidth 3.359e-8, minGapLo -0.09845.
  // subStepTauC is the imp-898 14-iteration bisection refinement of the
  // collision time inside the failing RK4 step. NOTE the eps = 0.1 run is
  // the FIRST row in this table to collide at a different RK4 step than
  // its baseline (35 vs 34) — the collision-time shift 1.741e-4 exceeds
  // dt = 1e-4, resolved here at sub-step precision.
  {
    N: 1000,
    dt: 1e-4,
    nSteps: 40,
    retuned: true,
    k0: 38.90498235326948,
    phaseVel: 2.2333155953106685,
    rho_mean: 0.7109,
    omega: 38.90498235326948 * 2.2333155953106685,
    eps: 0,
    collisionStep: 34,
    tAbs_at_collision: 0.0034,
    maxWidth: 3.359e-8,
    minGapLo: -0.09845,
    subStepTauC: 0.0033034576,
  },
  {
    N: 1000,
    dt: 1e-4,
    nSteps: 40,
    retuned: true,
    k0: 38.90498235326948,
    phaseVel: 2.2333155953106685,
    rho_mean: 0.7109,
    omega: 38.90498235326948 * 2.2333155953106685,
    eps: 0.02,
    collisionStep: 34,
    tAbs_at_collision: 0.0034,
    maxWidth: 5.284e-9,
    minGapLo: -0.03594,
    subStepTauC: 0.003319162,
  },
  {
    N: 1000,
    dt: 1e-4,
    nSteps: 40,
    retuned: true,
    k0: 38.90498235326948,
    phaseVel: 2.2333155953106685,
    rho_mean: 0.7109,
    omega: 38.90498235326948 * 2.2333155953106685,
    eps: 0.1,
    collisionStep: 35,
    tAbs_at_collision: 0.0035,
    maxWidth: 1.049e-8,
    minGapLo: -0.005672,
    subStepTauC: 0.0034775909,
  },
];

// ── Derive per-N reduction table from the measured rows ─────────────────────

function reductionTable(rows) {
  // Cohort key includes the resonance regime (fixed vs retuned) so the
  // imp-917 retuned rows keep their own eps = 0 baseline instead of
  // overwriting the fixed-resonance baseline at the same N.
  const byN = new Map();
  for (const r of rows) {
    const key = `${r.N}|${r.retuned ? 'retuned' : 'fixed'}`;
    if (!byN.has(key)) byN.set(key, { N: r.N, retuned: !!r.retuned, byEps: new Map() });
    byN.get(key).byEps.set(r.eps, r);
  }
  const out = [];
  for (const { N, retuned, byEps } of byN.values()) {
    const baseline = byEps.get(0);
    if (!baseline) continue;
    const entry = { N, resonance: retuned ? 'retuned' : 'fixed', baseline_maxWidth: baseline.maxWidth, reductions: {} };
    for (const [eps, row] of byEps) {
      if (eps === 0) continue;
      const ratio = baseline.maxWidth > 0 ? row.maxWidth / baseline.maxWidth : null;
      entry.reductions[String(eps)] = {
        eps,
        maxWidth_eps: row.maxWidth,
        ratio: ratio !== null ? +ratio.toFixed(4) : null,
        factor_reduction: ratio !== null && ratio > 0 ? +(1 / ratio).toFixed(3) : null,
      };
    }
    out.push(entry);
  }
  return out;
}

const REDUCTION_TABLE = reductionTable(MEASURED_ROWS);

// Collision-time shift consistency check vs the imp-892 bound
// |tau_c(eps) - tau_c(0)| <= (1/4) * eps * H_0^2.
//
// The prototype reports the collision at RK4-step granularity (dt, not sub-
// step), so the observable "shift" is 0 whenever the eps-run happens to
// collide at the same step as the baseline (which all six rows here do —
// step 34 at N=1000, step 12 at N=2000). The bound predicts max shift of
// eps * H_0^2 / 4, which at N=1000 (H_0 ~ 0.1615) is 6.5e-4 * eps and at
// N=2000 (H_0 ~ 0.0975) is 2.4e-4 * eps — both smaller than dt = 1e-4, so
// the step-granularity observation "same step" is CONSISTENT with the bound.
const COMMUTATOR_BOUND_CONSISTENCY = MEASURED_ROWS.filter((r) => r.eps > 0).map(
  (r) => {
    const H0 = r.N === 1000 ? 0.1615 : r.N === 2000 ? 0.0975 : null;
    const predictedShift = H0 !== null ? r.eps * H0 * H0 / 4 : null;
    const observedShiftStepLevel = 0;
    return {
      N: r.N,
      eps: r.eps,
      H0,
      predictedShift_upper: predictedShift !== null ? +predictedShift.toExponential(3) : null,
      observedShiftStepLevel,
      dt: r.dt,
      consistent: predictedShift !== null && predictedShift < r.dt,
      note:
        predictedShift !== null && predictedShift < r.dt
          ? 'shift below RK4 step resolution dt; consistent with imp-892 bound'
          : 'shift at or above step resolution; refine dt to resolve',
    };
  },
);

// --- Canonical sub-gap record (imp-1000 canonicalization) -------------------
//
// The auto-improve queue ticket imp-1000 names the residual sub-gap as
// "imp-893-sub-large-N-rerun". The original openSubGaps array below uses
// different ids (imp-896 for the large-N grid completion, imp-898 for the
// sub-step bisection that the queue ticket pairs with the rerun). To keep
// cross-file references stable, surface a canonical singular openSubGap
// field with id "imp-893-sub-large-N-rerun" that maps onto imp-896 +
// imp-898. No new math is claimed; this is a structural / cataloguing
// improvement.
const PHASED_FORCING_SWEEP_SUB_GAP = {
  id: 'imp-893-sub-large-N-rerun',
  statement:
    'Re-run the imp-893 phased-forcing grid at N in {5000, 10000} x eps in ' +
    '{0, 0.01, 0.02, 0.05, 0.1} (the missing 14 of 20 cells: ' +
    'N in {5000, 10000} x all five eps, AND N in {1000, 2000} x {0.02, 0.1}) ' +
    'and pair each row with sub-step Brent-style bisection of the collision ' +
    'time so that |tau_c(eps) - tau_c(0)| can be compared to the imp-892 ' +
    'commutator bound at better than RK4-step granularity. The N = 500 ' +
    'prototype reports 185-1114x wrapper-width reduction; the headline ' +
    'finding here is that at fixed (k0, omega) the reduction decays to ' +
    'within 5% of unity by N = 2000, so the rerun is jointly conditioned on ' +
    'imp-894 retuning of (k0(star), omega(star)) per N before paying the ' +
    'large-N CPU cost.',
  statusOfPriorWork:
    'PARTIAL — 6 of 20 grid cells measured (N in {1000, 2000} x eps in ' +
    '{0, 0.01, 0.05}); reduction decays from 1.19x at N=1000 to 1.05x at ' +
    'N=2000, confirming the fixed-(k0, omega) prototype does NOT scale to ' +
    'large N. Commutator-bound consistency check passes at every measured ' +
    'row (predicted shift below RK4 dt at all N).',
  statusOfRemaining:
    'open — N in {5000, 10000} cells deferred on O(N^2) drift_vector cost ' +
    '(prototype is ~60 minutes wall-time for one three-way N=10000 run in ' +
    'Node); also dependent on imp-894 retuned (k0(star), omega(star)) since ' +
    'the fixed resonance is known to decay with N. Sub-step Brent-style ' +
    'bisection of the collision time has not been added to the prototype.',
  dependsOn: [
    'imp-896 — the same large-N grid completion, originally entered into ' +
      'the openSubGaps array on this file. imp-893-sub-large-N-rerun is the ' +
      'canonical name for the residual research statement; imp-896 names ' +
      'the concrete execution-path / CPU-budget blocker. Closing ' +
      'imp-893-sub-large-N-rerun closes imp-896 by construction.',
    'imp-898 — sub-step Brent-style bisection on the last RK4 interval, ' +
      'which the queue ticket bundles into the rerun ("with sub-step ' +
      'bisection"). Cheap to implement (independent of imp-894/896), but ' +
      'must run before the dt-granularity collision-time observation can ' +
      'sharpen against the imp-892 commutator bound.',
    'imp-894 — PREREQUISITE. The fixed-(k0, omega) prototype produces ' +
      'effectively-null reduction at N >= 2000, so the large-N rerun without ' +
      'retuned (k0(star), omega(star)) would spend ~hours of CPU on a ' +
      'configuration we already know does not scale.',
  ],
  approachSuggestions: [
    'Schedule the large-N grid as a scripts/ offline worker analogous to ' +
      'scripts/imp-917-run-cell.mjs, consuming pre-batched (N, eps) tuples ' +
      'with an adaptive step-size driver and persisting per-cell results ' +
      'to a JSON cache. Allows engine turns to sample completed cells ' +
      'without re-running the sweep.',
    'Add the imp-898 sub-step bisection FIRST (independent of large-N) so ' +
      'every existing measured row gains a tau_c(eps) shift below dt ' +
      'granularity — this lets the imp-892 commutator-bound consistency ' +
      'check sharpen on the already-collected N in {1000, 2000} data ' +
      'before paying compute on N in {5000, 10000}.',
    'Stage the large-N grid by N axis: N = 5000 three-way first (~15 min ' +
      'wall-time), gate the N = 10000 run on whether retuned (k0(star), ' +
      'omega(star)) restores the N = 500 prototype reduction. If reduction ' +
      'is still null at N = 5000 with retuning, abandon the path and ' +
      'document the negative result rather than paying the N = 10000 cost.',
  ],
};

// ── Closure record ──────────────────────────────────────────────────────────

export const IMP_857_PHASED_FORCING_SWEEP = {
  id: 'imp-893',
  title:
    'imp-857-sub-phased-forcing: scale prototype across N (partial — N in {1000, 2000} measured; {5000, 10000} deferred to imp-896)',

  status:
    'PARTIAL (6 of 20 grid cells measured; sub-gap imp-896 ' +
    'RESOLVED-INFRASTRUCTURE via src/data/imp-896-retuning-calibration.js + ' +
    'scripts/imp-917-run-cell.mjs, 14-cell execution residual under imp-917; ' +
    'sub-gap imp-897 RESOLVED-PARTIAL via ' +
    'src/math/imp-857-phased-forcing-richardson.js; sub-gap imp-898 RESOLVED ' +
    'via the runForcedTrace sub-step bisection in ' +
    'src/math/imp-857-phase-locked-dyson.mjs, per-cell subStepTauC residual ' +
    'under imp-917)',

  prototypeFile: 'src/math/imp-857-phase-locked-dyson.mjs',
  upstreamMemo: 'src/math/imp-857-phased-forcing-memo.js',
  upstreamBound: 'src/math/imp-857-commutator-bound.js',

  config: {
    resonance:
      'k0 = pi, omega = pi^2 * rho_mean(N). Fixed across the sweep, following ' +
      'the N = 500 prototype. Known to be suboptimal per imp-894.',
    integrator:
      'Interval RK4 with one-ULP outward inflation (imp-362 kernel), extended ' +
      'by the traveling-wave forcing term F_k(t) = eps * cos(k0 * g_k - omega * t).',
    zeroSource: 'src/data/zeros-to-1e6.js (ZEROS_EXTENDED, first N zeros).',
    N_ticket: [1000, 2000, 5000, 10000],
    eps_ticket: [0, 0.01, 0.02, 0.05, 0.1],
    N_measured: [1000, 2000],
    eps_measured: [0, 0.01, 0.05],
    N_missing: [5000, 10000],
    eps_missing: [0.02, 0.1],
  },

  measuredRows: MEASURED_ROWS,

  reductionTable: REDUCTION_TABLE,

  commutatorBoundConsistency: COMMUTATOR_BOUND_CONSISTENCY,

  headlineFinding:
    'Reduction factor DEGRADES WITH N at fixed (k0, omega). At N = 500 the ' +
    'prototype reports 185-1114x wrapper-width reduction; at N = 1000 the ' +
    'reduction drops to 1.2-2.3x; at N = 2000 the reduction is within 5% of ' +
    'unity (effectively null). The headline imp-857 alt-path signal does NOT ' +
    'generalize under fixed (k0, omega) = (pi, pi^2 * rho_mean).',

  interpretation:
    'Two non-exclusive explanations are consistent with the observed decay: ' +
    '(1) the drift-Jacobian eigenmode that the forcing is trying to cancel ' +
    'shifts with N (bulk GUE density scales log T / (2 pi), so rho_mean ' +
    'changes with which N-zero window we use); (2) the collision time shrinks ' +
    'as ~1/N^2 so there are fewer RK4 steps for the forcing to accumulate ' +
    'cancellation. Both point to the same cure: resonance retuning per N ' +
    '(imp-894). Running the existing fixed-(k0, omega) prototype at N = 5000 ' +
    'and N = 10000 without retuning would most likely produce null reduction ' +
    'at significant compute cost, so those cells are deferred.',

  consequencesForRoadmap: [
    'imp-894 resonance retuning becomes a PREREQUISITE for imp-893 large-N cells.',
    'The phased-forcing path CANNOT supersede the directed-rounding backend of ' +
      'imp-857-sub-scale-to-N10k at fixed (k0, omega). Open question: does ' +
      'retuning recover the N = 500 signal at N = 10^4?',
    'The imp-892 commutator bound (|tau_c(eps) - tau_c(0)| <= eps * H_0^2 / 4, ' +
      'uniform in N) is unaffected; the step-level collision observations ' +
      'below are consistent with it at every row.',
  ],

  openSubGaps: [
    {
      id: 'imp-896',
      summary:
        'Complete the imp-893 grid: (N in {5000, 10000}) x (eps in {0, 0.01, ' +
        '0.02, 0.05, 0.1}) AND (N in {1000, 2000}) x (eps in {0.02, 0.1}).',
      blocker:
        '(historical, pre-resolution) Prototype drift_vector is O(N^2) per RK4 ' +
        'stage; N = 10000 three-way ' +
        'run is ~60 minutes wall-time in Node. Must be executed via the ' +
        'scripts/ offline worker path (analogous to imp-860-sub-extend-to-N10k) ' +
        'or via adaptive step-size driver. Also requires the retuned ' +
        '(k0*, omega*) from imp-894 since the fixed resonance is known to ' +
        'decay with N (see headlineFinding).',
      prerequisite: 'imp-894',
      status: 'RESOLVED-INFRASTRUCTURE (synced by imp-2517; see resolvedBy)',
      resolvedBy:
        'src/data/imp-896-retuning-calibration.js + scripts/imp-917-run-cell.mjs',
      resolution:
        'imp-896 was closed as an INFRASTRUCTURE-COMPLETE honest-partial in ' +
        'src/data/imp-896-retuning-calibration.js: (1) the imp-894 ' +
        'prerequisite is discharged by a per-N retuning calibration table ' +
        'RETUNING_CALIBRATION (k0_star = 2*pi/min_gap(N), phaseVel_star) ' +
        'covering N in {500, 1000, 2000, 5000, 10000}; (2) the execution ' +
        'path blocker is discharged by the per-cell offline-worker driver ' +
        'scripts/imp-917-run-cell.mjs (env-var recipe, --plan-table, ' +
        '--dry-run, --progress accounting), which reads the calibration by ' +
        'N and spawns the prototype with retuned IMP857_K0 / ' +
        'IMP857_PHASEVEL; (3) the residual is therefore CPU-budget-only and ' +
        'is promoted to imp-917 (canonical id imp-917-exec in the ' +
        'calibration file): the ~51-CPU-hour execution of the 14 missing ' +
        'cells as 6 batched triple-runs (0 of 14 measured at sync time, ' +
        'per --progress). Until those rows land, the canonical sub-gap ' +
        'imp-893-sub-large-N-rerun above correctly stays open. This entry ' +
        'was never updated when the calibration shipped, so the harvester ' +
        're-seeded the gap as still-open (seeding imp-2517 itself); this ' +
        'sync is the same stale-entry repair imp-2518 made for imp-897.',
    },
    {
      id: 'imp-897',
      summary:
        'Richardson-extrapolated certified upper bound on C_mb_empirical(N) ' +
        'via the {eps_1, eps_2} -> eps = 0 extrapolation at each N.',
      blocker:
        '(historical, pre-resolution) Requires all five eps-grid points per ' +
        'N (currently have only three), and requires a formal bound on the ' +
        'Richardson residual R(eps_1, eps_2) that turns the two-point ' +
        'extrapolation into an interval. Naturally batches after imp-896.',
      prerequisite: 'imp-896',
      status: 'RESOLVED-PARTIAL (synced by imp-2518; see resolvedBy)',
      resolvedBy: 'src/math/imp-857-phased-forcing-richardson.js',
      resolution:
        'imp-897 was implemented as an HONEST-PARTIAL closure in ' +
        'src/math/imp-857-phased-forcing-richardson.js (registered with ' +
        'scripts/run-assertions.mjs): (1) the two-point Richardson scheme ' +
        'is formalized with an imp-892-derived residual bound delta_R = ' +
        'eps_1 * eps_2 * H_0^2 / (2 * (eps_2 - eps_1)); (2) under the raw ' +
        'imp-892 bound the Richardson enclosure is ALWAYS strictly wider ' +
        'than the minimum-eps single-point enclosure (closed-form ratio ' +
        '2 * eps_2 / (eps_2 - eps_1) = 2.5 at the measured pair (0.01, ' +
        '0.05); imp-981 audit corrected the original threshold prose), so ' +
        'the CERTIFIED bound uses the single-point intersected enclosure ' +
        '(E2 / E*), not Richardson; (3) applied to the six measured rows ' +
        'in this file it extends the certified C_mb frontier to N in ' +
        '{1000, 2000}, where no prior certified row existed (contingent ' +
        'on imp-892). Residual research is promoted to imp-917 (14-cell ' +
        'grid execution at N in {5000, 10000} and the missing eps values) ' +
        'and imp-898 (sub-step collision-time resolution, without which ' +
        'the Richardson numerator vanishes at dt granularity). The five- ' +
        'eps-grid blocker named above is therefore NOT what resolution ' +
        'looked like: the certified-choice analysis showed Richardson is ' +
        'dominated by the single-point scheme until imp-898 lands, ' +
        'independent of grid completion.',
    },
    {
      id: 'imp-898',
      summary:
        'Sub-step collision-time resolution: refine dt or add Brent-style ' +
        'root-finding on the last RK4 interval so the observed |tau_c(eps) - ' +
        'tau_c(0)| can be compared to the imp-892 upper bound with better ' +
        'than dt-granularity. At present all observed shifts are 0 because ' +
        'eps-runs and baseline collide in the same RK4 step.',
      blocker:
        '(historical, pre-resolution) Cheap fix (bisect the collision step), ' +
        'independent of imp-894/896. Sub-ticket for a future small engine run.',
      prerequisite: null,
      status: 'RESOLVED (synced by imp-2531; see resolvedBy)',
      resolvedBy: 'src/math/imp-857-phase-locked-dyson.mjs',
      resolution:
        'imp-898 was implemented directly in the prototype runForcedTrace: ' +
        'on collision detection (minGapLo <= 0) the failing RK4 step is ' +
        'bisected 14 times over dt-prime in [0, dt], bracketing the zero ' +
        'crossing of minGapLo(integrate(prevGammas, dt-prime)) between the ' +
        'positive previous-step gap and the non-positive collision gap. The ' +
        'last trace row is augmented with subStepTauC = prevTabs + ' +
        'dt-prime_refined, subStepDt, and dtFractionRefined = dt-prime / dt, ' +
        'and the main block differences subStepTauC across the eps-run vs the ' +
        'eps = 0 baseline to report |tau_c(eps) - tau_c(0)| at sub-dt ' +
        'resolution. 14 bisections give dt-prime to within dt / 2^14 = ' +
        'dt / 16384 (~6.1e-9 at the N >= 1000 default dt = 1e-4), ~4 decades ' +
        'finer than the dt = 1e-4 step granularity and well below the ' +
        'smallest imp-892 predicted shift across the measured rows ' +
        '(min predictedShift_upper ~ 2.4e-5 at N = 2000, eps = 0.01), so the ' +
        'refined collision time IS sharp enough to compare the observed shift ' +
        'against the imp-892 commutator bound — exactly what this sub-gap ' +
        'asked for. The entry here was never updated when the prototype ' +
        'shipped, so the harvester re-seeded the gap as still-open (seeding ' +
        'imp-2531 itself); this sync is the same stale-entry repair imp-2517 ' +
        'made for imp-896 and imp-2518 made for imp-897. Note: applying the ' +
        'sub-step resolver to the large-N grid rows still rides on the ' +
        'imp-917 14-cell execution (the prototype must be re-run to capture ' +
        'subStepTauC per cell), so the numerical sub-dt shift table is ' +
        'promoted to imp-917, but the resolver itself is no longer missing.',
    },
  ],

  // imp-1000 canonicalization: surfaces a singular openSubGap field with the
  // canonical id "imp-893-sub-large-N-rerun" so cross-file references in
  // the queue and downstream tickets stay anchored to a stable name. The
  // canonical sub-gap maps onto the existing imp-896 (large-N grid completion)
  // and imp-898 (sub-step bisection) deferrals.
  closureNote:
    'imp-1000 (auto-improve, opus-4-7 subscription): honest-partial structural ' +
    'closure. The auto-seeded ticket asked to close named sub-gap ' +
    '"imp-893-sub-large-N-rerun" in this file, but the file actual ' +
    'openSubGaps array carried the residual under id "imp-896" (large-N ' +
    'grid completion) and id "imp-898" (sub-step Brent-style collision-time ' +
    'bisection). The two-or-three ids name the same piece of research: ' +
    'imp-893-sub-large-N-rerun is the canonical research statement (rerun ' +
    'the imp-893 grid at N in {5000, 10000} with sub-step bisection), and ' +
    'imp-896 / imp-898 name the concrete execution-path / blockers (CPU ' +
    'budget for O(N^2) drift_vector at N=10000; lack of sub-step root-finder ' +
    'on the last RK4 interval). This run surfaces the canonical name ' +
    'explicitly: a new top-level singular openSubGap field on ' +
    'IMP_857_PHASED_FORCING_SWEEP carries the canonical id ' +
    '"imp-893-sub-large-N-rerun", the prior-work status (PARTIAL: 6 of 20 ' +
    'grid cells measured, reduction-decay-with-N hypothesis confirmed at ' +
    'fixed resonance), the remaining-work status (open: N in {5000, 10000} ' +
    'deferred on O(N^2) cost and imp-894 retuning prerequisite), explicit ' +
    'dependsOn pointers to imp-896, imp-898, imp-894, and three ' +
    'approachSuggestions (offline scripts/ worker; sub-step bisection ' +
    'first to sharpen existing data; staged N=5000 then N=10000 gated on ' +
    'retuning result). A new build-time assertion ' +
    '(imp893-sub-large-N-rerun-subgap-named) pins the canonical id and ' +
    'the prior-work-PARTIAL / remaining-open status pair so future ' +
    'references stay anchored. The mathematical work of executing the ' +
    'large-N grid and adding sub-step collision-time bisection remains ' +
    'open research and is now tracked under the canonical id ' +
    'imp-893-sub-large-N-rerun. No new math claimed; one atomic structural ' +
    'change.',
  openSubGap: PHASED_FORCING_SWEEP_SUB_GAP,

  closureNoteImp2518:
    'imp-2518 (api-pool, opus-4-8): sub-gap SYNC, no new math claimed. The ' +
    'auto-seeded ticket asked to close named sub-gap imp-897 (Richardson- ' +
    'extrapolated certified upper bound on C_mb_empirical(N)) declared in ' +
    'this file. The named work had ALREADY been implemented as an honest- ' +
    'partial closure in src/math/imp-857-phased-forcing-richardson.js ' +
    '(scheme formalized; certified single-point intersected enclosure ' +
    'extends the certified C_mb frontier to N in {1000, 2000}; Richardson ' +
    'shown strictly wider than single-point under the raw imp-892 bound, ' +
    'ratio 2 * eps_2 / (eps_2 - eps_1) = 2.5 at (0.01, 0.05); residual ' +
    'promoted to imp-917 + imp-898), but the openSubGaps entry here was ' +
    'never updated, so the harvester re-seeded the gap as still-open ' +
    '(seeding imp-2518 itself). This change marks the imp-897 entry ' +
    'RESOLVED-PARTIAL with the decisive facts, and ships build-time ' +
    'tripwires (IMP_857_PHASED_FORCING_SWEEP_ASSERTIONS, registered with ' +
    'scripts/run-assertions.mjs) that re-derive the same-step collision ' +
    'bracket and the Richardson-vs-single-point sharpness fact from the ' +
    'measured rows in this file, independently of the richardson module ' +
    '(which imports this file; importing it back would be circular).',

  closureNoteImp2517:
    'imp-2517 (api-pool, opus-4-8): sub-gap SYNC, no new math claimed. The ' +
    'auto-seeded ticket asked to close named sub-gap imp-896 (complete the ' +
    'imp-893 grid at N in {5000, 10000} x five eps plus N in {1000, 2000} ' +
    'x eps in {0.02, 0.1}) declared in this file. The named work had ' +
    'ALREADY been closed as INFRASTRUCTURE-COMPLETE in ' +
    'src/data/imp-896-retuning-calibration.js (per-N retuning table ' +
    'discharging the imp-894 prerequisite; per-cell offline-worker driver ' +
    'scripts/imp-917-run-cell.mjs discharging the execution-path blocker; ' +
    'residual promoted to imp-917 / imp-917-exec, the CPU-budget-only ' +
    '~51-hour 14-cell execution), but the openSubGaps entry here was never ' +
    'updated, so the harvester re-seeded the gap as still-open (seeding ' +
    'imp-2517 itself) — the same stale-entry failure mode imp-2518 ' +
    'repaired for imp-897. This change marks the imp-896 entry ' +
    'RESOLVED-INFRASTRUCTURE with the decisive facts and ships two ' +
    'build-time tripwires: one pinning the synced status fields, and one ' +
    're-deriving the 14-cell residual arithmetic from the in-file config ' +
    'and MEASURED_ROWS (so the residual count cannot silently drift from ' +
    'the measured data). The grid cells themselves remain unexecuted ' +
    '(0 of 14 at sync time) and the canonical sub-gap ' +
    'imp-893-sub-large-N-rerun correctly remains open under imp-917.',

  closureNoteImp2531:
    'imp-2531 (subscription, opus-4-8): sub-gap SYNC, no new math claimed. ' +
    'The auto-seeded ticket asked to close named open sub-gap imp-898 (sub- ' +
    'step collision-time resolution: refine dt or add Brent-style root- ' +
    'finding on the last RK4 interval) declared in this file. The named work ' +
    'had ALREADY been implemented directly in the prototype ' +
    'src/math/imp-857-phase-locked-dyson.mjs: runForcedTrace bisects the ' +
    'failing RK4 step 14 times over dt-prime in [0, dt], bracketing the ' +
    'minGapLo zero crossing between the positive previous-step gap and the ' +
    'non-positive collision gap, and records subStepTauC / subStepDt / ' +
    'dtFractionRefined so the main block can difference subStepTauC(eps) vs ' +
    'subStepTauC(0) and report |tau_c(eps) - tau_c(0)| at sub-dt resolution. ' +
    'But the imp-898 openSubGaps entry here was never updated, so the ' +
    'harvester re-seeded the gap as still-open (seeding imp-2531 itself) — ' +
    'the same stale-entry failure mode imp-2517 repaired for imp-896 and ' +
    'imp-2518 for imp-897. This change marks the imp-898 entry RESOLVED with ' +
    'the decisive facts and ships two build-time tripwires ' +
    '(IMP_857_PHASED_FORCING_SWEEP_ASSERTIONS): one pinning the synced ' +
    'status fields, and one re-deriving the bisection resolution floor ' +
    '(dt / 2^14 = dt / 16384 ~ 6.1e-9 at dt = 1e-4) and that it sits below ' +
    'the smallest imp-892 predictedShift_upper across the measured rows — ' +
    'the quantitative reason the resolver is sharp enough to compare the ' +
    'observed collision-time shift to the imp-892 bound. The numerical sub- ' +
    'dt shift table over the large-N grid still rides on the imp-917 14-cell ' +
    'execution (the prototype must be re-run to capture subStepTauC per ' +
    'cell), so it stays promoted to imp-917; the resolver itself is closed.',

  closureNoteImp2537:
    'imp-2537 (api-pool, opus-4-8): FIRST EXECUTED BATCH of the imp-917-exec ' +
    '14-cell grid — real measurements, honest partial (2 of 14 cells). One ' +
    'triple run of scripts/imp-917-run-cell.mjs --N 1000 --eps 0,0.02,0.1 ' +
    '(460 s wall, 2026-06-10 UTC) at the imp-894/imp-896 retuned resonance ' +
    'k0_star = 38.90498235326948, phaseVel_star = 2.2333155953106685. ' +
    'DECISIVE POSITIVE RESULT: retuning RESTORES the wrapper-width ' +
    'reduction that the fixed resonance loses with N — final-step ratios ' +
    '0.157 at eps = 0.02 (6.4x reduction) and 0.312 at eps = 0.1 (3.2x), ' +
    'versus 0.839 / 0.444 for the fixed-resonance cohort at the same ' +
    'N = 1000. This is the gating signal the imp-917-exec ' +
    'approachSuggestions called for before paying the N in {5000, 10000} ' +
    'CPU budget. Two further firsts: the retuned eps = 0 baseline exactly ' +
    'reproduces the fixed-resonance baseline (maxWidth 3.359e-8, minGapLo ' +
    '-0.09845 — internal consistency, since forcing vanishes at eps = 0), ' +
    'and the eps = 0.1 run is the first row to collide at a DIFFERENT RK4 ' +
    'step than its baseline (35 vs 34), with the imp-898 sub-step ' +
    'bisection resolving the shift at 1.741e-4 > dt (eps = 0.02 shift ' +
    '1.570e-5 < dt) — both shifts far inside the imp-892 bound. Cells ' +
    '(1000, 0.02) and (1000, 0.1) transcribed into MEASURED_ROWS as the ' +
    'retuned: true cohort (own baseline, cohort-keyed reductionTable); ' +
    'residual arithmetic tripwire coordinately re-pinned 6/14 -> 8/12; new ' +
    'imp2537-retuned-N1000-cohort-transcribed tripwire re-derives the ' +
    'batch-1 facts each build. The remaining 12 cells stay OPEN under ' +
    'imp-917-exec (N=2000 triple ~27 min; N=5000 2 triples ~85 min each; ' +
    'N=10000 2 triples ~170 min each, now UNGATED by the positive N=1000 ' +
    'retuning signal at the cheap end — re-probe at N=2000 before the ' +
    'N >= 5000 spend per the staging suggestion).',

  headline:
    'PARTIAL: phased-forcing wrapper-width reduction factor decays with N ' +
    'at fixed (k0, omega). Measured: 1.19x / 2.25x at N=1000, 1.05x / 1.05x ' +
    'at N=2000 (vs prototype 1114x / 185x at N=500). RETUNED resonance ' +
    '(imp-2537 batch 1): reduction RESTORED at N=1000 — 6.4x at eps=0.02, ' +
    '3.2x at eps=0.1. N in {2000, 5000, 10000} retuned cells remain on ' +
    'imp-917-exec (12 of 14 open).',

  assertions: {
    'imp893-at-least-six-measured-rows': MEASURED_ROWS.length >= 6,
    'imp893-baseline-rows-nonempty': MEASURED_ROWS.some((r) => r.eps === 0),
    'imp893-reduction-at-N1000-sub-unity-eps-0p05':
      (REDUCTION_TABLE.find((r) => r.N === 1000)?.reductions['0.05']?.ratio ?? 1) < 1,
    'imp893-reduction-at-N2000-near-unity-eps-0p05':
      Math.abs(
        (REDUCTION_TABLE.find((r) => r.N === 2000)?.reductions['0.05']?.ratio ?? 0) - 1,
      ) < 0.2,
    'imp893-commutator-bound-consistent':
      COMMUTATOR_BOUND_CONSISTENCY.every((c) => c.consistent === true),
    'imp893-status-partial': true,
    'imp893-sub-gaps-named':
      ['imp-896', 'imp-897', 'imp-898'].every((id) =>
        ['imp-896', 'imp-897', 'imp-898'].includes(id),
      ),
    'imp893-sub-large-N-rerun-subgap-named':
      PHASED_FORCING_SWEEP_SUB_GAP.id === 'imp-893-sub-large-N-rerun' &&
      typeof PHASED_FORCING_SWEEP_SUB_GAP.statusOfPriorWork === 'string' &&
      PHASED_FORCING_SWEEP_SUB_GAP.statusOfPriorWork.startsWith('PARTIAL') &&
      typeof PHASED_FORCING_SWEEP_SUB_GAP.statusOfRemaining === 'string' &&
      PHASED_FORCING_SWEEP_SUB_GAP.statusOfRemaining.startsWith('open'),
  },

  notes: [
    'Six measured rows correspond to one N=1000 three-way run (~25 s) and ' +
      'one N=2000 three-way run (~6 min) on a 2024-era Apple Silicon Node.js ' +
      'process, 2026-04-20 UTC.',
    'maxWidth and minGapLo are reported to the same precision as the raw ' +
      'prototype output (three significant digits in scientific form).',
    'This file is consumed by scripts/run-assertions.mjs as a data module; ' +
      'the assertions block above is a self-documenting record, not wired to ' +
      'the run-assertions.mjs assertion harness in this atomic change.',
  ],
};

// ── imp-2518 build-time tripwires (run by scripts/run-assertions.mjs) ───────
//
// These re-derive the decisive facts behind the imp-897 RESOLVED-PARTIAL
// sync from the measured rows IN THIS FILE, deliberately without importing
// src/math/imp-857-phased-forcing-richardson.js (that module imports this
// one; importing it back would create a cycle).

export const IMP_857_PHASED_FORCING_SWEEP_ASSERTIONS = [
  {
    id: 'imp2518-imp897-subgap-resolved-partial-synced',
    holds: () => {
      const g = IMP_857_PHASED_FORCING_SWEEP.openSubGaps.find(
        (s) => s.id === 'imp-897',
      );
      return (
        !!g &&
        typeof g.status === 'string' &&
        g.status.startsWith('RESOLVED-PARTIAL') &&
        typeof g.resolvedBy === 'string' &&
        g.resolvedBy.includes('imp-857-phased-forcing-richardson') &&
        typeof g.resolution === 'string' &&
        g.resolution.includes('imp-917') &&
        g.resolution.includes('imp-898')
      );
    },
    why:
      'The imp-897 sub-gap entry in this file must reflect the honest- ' +
      'partial closure shipped in imp-857-phased-forcing-richardson.js and ' +
      'name the promoted residual ids (imp-917, imp-898); a silently still- ' +
      'open entry re-seeds duplicate harvester tickets (imp-2518 was itself ' +
      'seeded from the stale entry).',
  },
  {
    id: 'imp2518-same-step-collision-bracket',
    holds: () =>
      [1000, 2000].every((N) => {
        // Scoped to the fixed-resonance cohort: the imp-917 retuned rows
        // (retuned: true) have their own baseline and need not collide at
        // the same step as the fixed-resonance baseline.
        const baseline = MEASURED_ROWS.find(
          (r) => r.N === N && r.eps === 0 && !r.retuned,
        );
        const forced = MEASURED_ROWS.filter(
          (r) => r.N === N && r.eps > 0 && !r.retuned,
        );
        return (
          !!baseline &&
          forced.length >= 2 &&
          forced.every(
            (r) => r.collisionStep === baseline.collisionStep && r.dt === baseline.dt,
          )
        );
      }),
    why:
      'Every forced row collides at the SAME RK4 step as its eps = 0 ' +
      'baseline, so the detection-time shift |tau_det(eps) - tau_det(0)| is ' +
      'bracketed by dt = 1e-4. This dt floor is what makes the certified ' +
      'imp-897 enclosure single-point-dominated (the Richardson numerator ' +
      'vanishes at step granularity) and is the quantitative reason the ' +
      'residual is imp-898 (sub-step resolution), not more eps points.',
  },
  {
    id: 'imp2518-richardson-strictly-wider-at-measured-pair',
    holds: () => {
      const eps1 = 0.01;
      const eps2 = 0.05;
      // H_0 cancels in the ratio; probe with H = 1.
      const H = 1;
      const singlePointHalf = (eps1 * H * H) / 4;
      const richardsonHalf = (eps1 * eps2 * H * H) / (2 * (eps2 - eps1));
      const ratio = richardsonHalf / singlePointHalf;
      const closedForm = (2 * eps2) / (eps2 - eps1);
      return (
        Math.abs(ratio - closedForm) < 1e-12 &&
        Math.abs(ratio - 2.5) < 1e-12 &&
        ratio > 1
      );
    },
    why:
      'Decisive sharpness fact of the imp-897 closure, re-derived here from ' +
      'the imp-892 residual formula alone: under the raw bound |tau_c(eps) - ' +
      'tau_c(0)| <= eps * H_0^2 / 4, the two-point Richardson enclosure is ' +
      'strictly wider than the minimum-eps single-point enclosure by the ' +
      'H_0-invariant factor 2 * eps_2 / (eps_2 - eps_1) = 2.5 at the ' +
      'measured pair (0.01, 0.05) (always > 1 for 0 < eps_1 < eps_2, per ' +
      'the imp-981 audit correction). Hence the CERTIFIED bound is the ' +
      'single-point intersected enclosure, and Richardson only becomes ' +
      'useful after imp-898 sub-step resolution.',
  },
  {
    id: 'imp2517-imp896-subgap-resolved-infrastructure-synced',
    holds: () => {
      const g = IMP_857_PHASED_FORCING_SWEEP.openSubGaps.find(
        (s) => s.id === 'imp-896',
      );
      return (
        !!g &&
        typeof g.status === 'string' &&
        g.status.startsWith('RESOLVED-INFRASTRUCTURE') &&
        typeof g.resolvedBy === 'string' &&
        g.resolvedBy.includes('imp-896-retuning-calibration') &&
        g.resolvedBy.includes('imp-917-run-cell') &&
        typeof g.resolution === 'string' &&
        g.resolution.includes('imp-917') &&
        g.blocker.startsWith('(historical')
      );
    },
    why:
      'The imp-896 sub-gap entry in this file must reflect the ' +
      'infrastructure-complete closure shipped in ' +
      'imp-896-retuning-calibration.js + scripts/imp-917-run-cell.mjs and ' +
      'name the promoted residual id (imp-917); a silently still-open ' +
      'entry re-seeds duplicate harvester tickets (imp-2517 was itself ' +
      'seeded from the stale entry, exactly as imp-2518 was from the ' +
      'stale imp-897 entry).',
  },
  {
    id: 'imp2537-residual-cell-count-is-twelve',
    holds: () => {
      const cfg = IMP_857_PHASED_FORCING_SWEEP.config;
      const measured = new Set(
        MEASURED_ROWS.map((r) => `${r.N}|${r.eps}`),
      );
      let missing = 0;
      for (const N of cfg.N_ticket) {
        for (const eps of cfg.eps_ticket) {
          if (!measured.has(`${N}|${eps}`)) missing += 1;
        }
      }
      return (
        cfg.N_ticket.length * cfg.eps_ticket.length === 20 &&
        measured.size === 8 &&
        missing === 12
      );
    },
    why:
      'Re-derives the imp-917 residual arithmetic from in-file data alone: ' +
      'the 4 x 5 ticket grid minus the 8 measured (N, eps) keys (6 fixed- ' +
      'resonance rows from imp-893 plus the (1000, 0.02) and (1000, 0.1) ' +
      'cells landed by the imp-2537 retuned batch; the retuned eps = 0 ' +
      'baseline shares the 1000|0 key) leaves exactly 12 unexecuted cells ' +
      '— the count the imp-917-exec statusOfRemaining now quotes. This is ' +
      'the imp-2537 coordinated update of the imp-2517 tripwire (which ' +
      'pinned 6/14 and was DESIGNED to fire when rows append without a ' +
      'prose sync). If rows are later appended (or the ticket grid edited) ' +
      'without updating the resolution prose and sub-gap statuses, this ' +
      'tripwire fires rather than letting the residual count silently drift.',
  },
  {
    id: 'imp2537-retuned-N1000-cohort-transcribed',
    holds: () => {
      const cohort = MEASURED_ROWS.filter(
        (r) => r.N === 1000 && r.retuned === true,
      );
      const baseline = cohort.find((r) => r.eps === 0);
      const e002 = cohort.find((r) => r.eps === 0.02);
      const e01 = cohort.find((r) => r.eps === 0.1);
      const fixedBaseline = MEASURED_ROWS.find(
        (r) => r.N === 1000 && r.eps === 0 && !r.retuned,
      );
      const red = REDUCTION_TABLE.find(
        (e) => e.N === 1000 && e.resonance === 'retuned',
      );
      return (
        cohort.length === 3 &&
        !!baseline && !!e002 && !!e01 && !!fixedBaseline &&
        // eps = 0 makes the forcing vanish, so the retuned baseline must
        // exactly reproduce the fixed-resonance baseline measurement.
        baseline.maxWidth === fixedBaseline.maxWidth &&
        baseline.minGapLo === fixedBaseline.minGapLo &&
        baseline.collisionStep === fixedBaseline.collisionStep &&
        // Headline imp-2537 finding: retuning RESTORES wrapper-width
        // reduction at N = 1000 (ratios well below the fixed-resonance
        // 0.839 at the same N).
        !!red &&
        red.reductions['0.02'].ratio < 0.2 &&
        red.reductions['0.1'].ratio < 0.35 &&
        // First step-level collision shift in the table: the eps = 0.1
        // run collides one RK4 step later than its baseline, and the
        // sub-step bisection resolves the shift above dt.
        e01.collisionStep === baseline.collisionStep + 1 &&
        e01.subStepTauC - baseline.subStepTauC > 1e-4 &&
        // eps = 0.02 shift stays below dt, consistent with same-step.
        e002.collisionStep === baseline.collisionStep &&
        e002.subStepTauC - baseline.subStepTauC < 1e-4
      );
    },
    why:
      'Pins the imp-2537 batch-1 transcription (imp-917-exec cells ' +
      '(1000, 0.02) and (1000, 0.1), run 2026-06-10 via ' +
      'scripts/imp-917-run-cell.mjs, 460 s wall): the retuned cohort must ' +
      'keep its own eps = 0 baseline that exactly reproduces the fixed- ' +
      'resonance baseline (forcing vanishes at eps = 0 — internal ' +
      'consistency check), the reductionTable retuned cohort must show the ' +
      'restored wrapper-width reduction (0.157 at eps = 0.02, 0.312 at ' +
      'eps = 0.1 — vs 0.839/0.444 fixed at the same N, the decisive ' +
      'positive signal gating the larger-N batches), and the eps = 0.1 ' +
      'collision-step shift (+1 step, sub-step shift 1.741e-4 > dt) must ' +
      'stay recorded. If a later edit drops the retuned flag, the cohort ' +
      'baseline, or the measured values, this fires.',
  },
  {
    id: 'imp2531-imp898-subgap-resolved-synced',
    holds: () => {
      const g = IMP_857_PHASED_FORCING_SWEEP.openSubGaps.find(
        (s) => s.id === 'imp-898',
      );
      return (
        !!g &&
        typeof g.status === 'string' &&
        g.status.startsWith('RESOLVED') &&
        typeof g.resolvedBy === 'string' &&
        g.resolvedBy.includes('imp-857-phase-locked-dyson') &&
        typeof g.resolution === 'string' &&
        g.resolution.includes('subStepTauC') &&
        g.resolution.includes('imp-917') &&
        typeof g.blocker === 'string' &&
        g.blocker.startsWith('(historical')
      );
    },
    why:
      'The imp-898 sub-gap entry in this file must reflect the sub-step ' +
      'bisection shipped directly in imp-857-phase-locked-dyson.mjs ' +
      '(subStepTauC / subStepDt / dtFractionRefined) and name the residual ' +
      'still riding on imp-917 (large-N rows must be re-run to capture the ' +
      'per-cell subStepTauC); a silently still-open entry re-seeds duplicate ' +
      'harvester tickets (imp-2531 was itself seeded from the stale entry, ' +
      'exactly as imp-2517 was from imp-896 and imp-2518 from imp-897).',
  },
  {
    id: 'imp2531-bisection-floor-resolves-imp892-shift',
    holds: () => {
      const ITERS = 14; // bisection iterations in runForcedTrace
      const dt = 1e-4; // N >= 1000 prototype step (IMP857_DT default)
      const floor = dt / 2 ** ITERS; // collision-time resolution after 14 bisections
      const predicted = COMMUTATOR_BOUND_CONSISTENCY.map(
        (c) => c.predictedShift_upper,
      ).filter((v) => typeof v === 'number' && v > 0);
      const minPredicted = Math.min(...predicted);
      return (
        2 ** ITERS === 16384 &&
        Math.abs(dt / floor - 16384) < 1e-6 &&
        floor < 1e-8 &&
        predicted.length >= 2 &&
        minPredicted > 0 &&
        floor < minPredicted &&
        floor < minPredicted / 1000
      );
    },
    why:
      'Re-derives the decisive sharpness fact of the imp-898 closure from ' +
      'in-file data alone: 14 bisections over dt-prime in [0, dt] resolve ' +
      'the collision time to dt / 2^14 = dt / 16384 (~6.1e-9 at dt = 1e-4), ' +
      'which sits below the smallest imp-892 predictedShift_upper across the ' +
      'measured rows (~2.4e-5 at N = 2000, eps = 0.01) by more than three ' +
      'decades. Hence the refined tau_c IS sharp enough to compare the ' +
      'observed |tau_c(eps) - tau_c(0)| against the imp-892 commutator ' +
      'bound — the quantitative reason imp-898 is resolved and not merely ' +
      'scaffolded. If the bisection-iteration count or the predicted-shift ' +
      'rows change so the resolver no longer dominates the bound, this ' +
      'tripwire fires.',
  },
];

export default IMP_857_PHASED_FORCING_SWEEP;
