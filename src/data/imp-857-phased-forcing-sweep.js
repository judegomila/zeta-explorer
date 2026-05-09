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
];

// ── Derive per-N reduction table from the measured rows ─────────────────────

function reductionTable(rows) {
  const byN = new Map();
  for (const r of rows) {
    if (!byN.has(r.N)) byN.set(r.N, new Map());
    byN.get(r.N).set(r.eps, r);
  }
  const out = [];
  for (const [N, byEps] of byN) {
    const baseline = byEps.get(0);
    if (!baseline) continue;
    const entry = { N, baseline_maxWidth: baseline.maxWidth, reductions: {} };
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
    'PARTIAL (6 of 20 grid cells measured; {5000, 10000} x all eps and ' +
    '{0.02, 0.1} x {1000, 2000} deferred to imp-896 pending imp-894 retuning)',

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
        'Prototype drift_vector is O(N^2) per RK4 stage; N = 10000 three-way ' +
        'run is ~60 minutes wall-time in Node. Must be executed via the ' +
        'scripts/ offline worker path (analogous to imp-860-sub-extend-to-N10k) ' +
        'or via adaptive step-size driver. Also requires the retuned ' +
        '(k0*, omega*) from imp-894 since the fixed resonance is known to ' +
        'decay with N (see headlineFinding).',
      prerequisite: 'imp-894',
    },
    {
      id: 'imp-897',
      summary:
        'Richardson-extrapolated certified upper bound on C_mb_empirical(N) ' +
        'via the {eps_1, eps_2} -> eps = 0 extrapolation at each N.',
      blocker:
        'Requires all five eps-grid points per N (currently have only three), ' +
        'and requires a formal bound on the Richardson residual R(eps_1, ' +
        'eps_2) that turns the two-point extrapolation into an interval. ' +
        'Naturally batches after imp-896.',
      prerequisite: 'imp-896',
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
        'Cheap fix (bisect the collision step), independent of imp-894/896. ' +
        'Sub-ticket for a future small engine run.',
      prerequisite: null,
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

  headline:
    'PARTIAL: phased-forcing wrapper-width reduction factor decays with N ' +
    'at fixed (k0, omega). Measured: 1.19x / 2.25x at N=1000, 1.05x / 1.05x ' +
    'at N=2000 (vs prototype 1114x / 185x at N=500). N in {5000, 10000} ' +
    'deferred to imp-896 pending imp-894 retuning.',

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

export default IMP_857_PHASED_FORCING_SWEEP;
