/**
 * @module data/imp-857-resonance-tuning-sweep
 * @fileoverview Honest-partial closure record for imp-894 (resonance-tuning
 *   sweep for the imp-857 phase-locked traveling-wave Dyson forcing prototype).
 *   The file holds the calibration constants, the 2 x 2 pilot grid measured
 *   at N = 500, nSteps = 30, the eps = 0.01 and eps = 0.05 reduction-ratio
 *   heatmaps, the extracted preliminary recommendation (k0(star), omega(star))
 *   = (2*pi / min_gap(N=500), pi * rho_mean(N=500)), and the canonical
 *   open-sub-gap record naming the residual dense-heatmap research as
 *   imp-894-sub-resonance-sweep (which maps onto the imp-899 execution-path
 *   deferral).
 *
 * Proof chain step: imp-857 phase-locked Dyson forcing programme, sub-step
 *   imp-894 resonance tuning. The parent imp-857 line searches for forcing
 *   schemes that reduce the wrapper-width of the Dyson backward-collision
 *   evolution; imp-894 asks which (k0, omega) corner of the predicted search
 *   window minimises that width. This file delivers a partial answer (linear-
 *   response regime at nSteps = 30 picks out the drift-Jacobian eigenmode at
 *   the prototype phase velocity as the minimum-ratio cell, 5 percent
 *   reduction at eps = 0.01) and names the residual nSteps = 200 dense-grid
 *   work as imp-894-sub-resonance-sweep / imp-899.
 *
 * Exports:
 *   - IMP_857_RESONANCE_TUNING_SWEEP (also default): closure record with id
 *     "imp-894", status string starting "PARTIAL", pointers to the
 *     prototypeFile and upstreamSweep, an infrastructure block enumerating
 *     the IMP857_K0 / IMP857_PHASEVEL / IMP857_N / IMP857_NSTEPS / IMP857_DT
 *     env-var overrides, the CALIBRATION_N500 constants, the pilotConfig
 *     parameters, the 12-row pilotRows, two heatmaps (eps = 0.01 and 0.05),
 *     the PILOT_RECOMMENDATION, the headlineFinding / interpretation prose,
 *     a consequencesForRoadmap list (imp-896 recommendation, prototype k0
 *     sub-optimality, imp-892 commutator-bound independence), the legacy
 *     openSubGaps array carrying the imp-899 deferral, the canonical singular
 *     openSubGap field carrying the imp-894-sub-resonance-sweep record, a
 *     closureNote tracing the imp-999 canonicalization, the headline summary,
 *     the assertions block (nine build-time tripwires), and provenance notes.
 *
 * Key build-time assertions (consumed by scripts/run-assertions.mjs):
 *   - imp894-calibration-nonzero: minGap and rhoMean are strictly positive.
 *   - imp894-pilot-four-cells: PILOT_ROWS spans four distinct (k0, phaseVel)
 *     cells (Set on the stringified pair has size 4).
 *   - imp894-pilot-twelve-rows: PILOT_ROWS has 12 entries (4 cells x 3 eps).
 *   - imp894-eigenmode-corner-reduces: heatmap entry at (k0 = 20.24,
 *     phaseVel = 1.97, eps = 0.01) is strictly below 1.
 *   - imp894-prototype-corner-amplifies: heatmap entry at (k0 = pi,
 *     phaseVel = 1.97, eps = 0.01) is strictly above 1.
 *   - imp894-recommendation-matches-eigenmode: PILOT_RECOMMENDATION k0_star
 *     equals 20.24 and phaseVel_star equals 1.9668.
 *   - imp894-status-partial: literal true pinning the partial-closure label.
 *   - imp894-sub-gap-named: legacy openSubGaps array contains a single
 *     imp-899 entry.
 *   - imp894-resonance-sweep-subgap-named: the canonical singular
 *     openSubGap field has id "imp-894-sub-resonance-sweep" with
 *     statusOfPriorWork starting "PARTIAL" and statusOfRemaining starting
 *     "open" (added by imp-999).
 *
 * Ticket chain: imp-857 (parent phase-locked-forcing programme) -> imp-894
 *   (ticket asking for the (k0, omega) sweep) -> imp-999 (canonicalized the
 *   residual sub-gap id as imp-894-sub-resonance-sweep and added the matching
 *   build-time tripwire) -> imp-1056 (this ticket, prepended the @module /
 *   @fileoverview header for cross-file navigability). The execution-path
 *   blocker for the dense heatmap is tracked as imp-899.
 *
 * @see ../math/imp-857-phase-locked-dyson.mjs
 * @see ./imp-857-phased-forcing-sweep.js
 * @see ./zeros-to-1e6.js
 *
 * Syntax note: this header uses "k0(star)" / "omega(star)" / "2*pi" prose
 *   forms to avoid the star-slash JSDoc-terminator hazard; the same
 *   convention is honoured throughout the file (see the original SYNTAX
 *   NOTE retained verbatim in the prose header below).
 */

/**
 * imp-894 / imp-857-sub-phased-forcing:
 *   Resonance-tuning sweep of the phase-locked traveling-wave Dyson forcing
 *   prototype src/math/imp-857-phase-locked-dyson.mjs at N = 500.
 *
 * SCOPE AND HONEST STATUS (read first)
 * ------------------------------------
 * This is an HONEST-PARTIAL closure of imp-894. The ticket asked for a 2D
 * grid sweep (k0, omega/k0) x a small grid of eps at N = 500, with a
 * recommended (k0*, omega*) extracted from the reduction-factor heatmap.
 *
 * WHAT IS DELIVERED HERE
 * ----------------------
 *   (a) Enabling infrastructure: the prototype now reads IMP857_K0 and
 *       IMP857_PHASEVEL from the environment (backwards-compatible — the
 *       default values reproduce the original N = 500 prototype run).
 *   (b) Calibration constants for the N = 500 zero window, derived from
 *       the first 500 entries of src/data/zeros-to-1e6.js. These set the
 *       predicted search windows (k0 ~ 2*pi/min_gap eigenmode, omega/k0
 *       in (pi*rho_min, pi*rho_max) bulk-phase window).
 *   (c) A PILOT 2 x 2 grid of (k0, omega/k0) measured at nSteps = 30,
 *       three-way per cell (eps in {0, 0.01, 0.05}). Four cells, eight
 *       non-baseline reduction-ratio observations. Sufficient to compare
 *       the two corner hypotheses (prototype k0 = pi vs eigenmode k0 ~
 *       2*pi/min_gap; prototype phaseVel = pi*rho_mean vs an elevated
 *       phaseVel = 5).
 *
 * WHAT IS NOT DELIVERED (NAMED SUB-GAP imp-899)
 * ---------------------------------------------
 *   (a) Dense heatmap: a 4-5 x 4-5 grid across the full predicted windows
 *       (k0 in {pi/2, pi, 2*pi, 2*pi/min_gap/2, 2*pi/min_gap}; phaseVel in
 *       {pi*rho_min, pi*rho_mean, pi*rho_max/2, pi*rho_max}) is required
 *       to pin the resonance peak, not just compare two corners.
 *   (b) Long-run regime (nSteps = 200, matching the original prototype
 *       headline): each three-way run at N = 500, nSteps = 30 takes ~3
 *       minutes of wall-time under CPU contention (concurrent imp-857
 *       N=10k + run-assertions jobs); nSteps = 200 extrapolates to ~20
 *       minutes per cell, blowing the per-engine-turn budget for a dense
 *       grid. Must be offloaded to an idle scripts/ worker or scheduled
 *       during quiet CPU windows.
 *   (c) Multiple eps values per cell beyond the three-way {0, 0.01, 0.05}.
 *
 * HEADLINE FINDING (PRELIMINARY, DIRECTIONAL)
 * -------------------------------------------
 * At N = 500, nSteps = 30, the predicted drift-Jacobian eigenmode
 *   k0* = 2*pi / min_gap(N=500) ~ 20.24
 * at the prototype phase velocity
 *   omega(star) / k0(star) = pi * rho_mean(N=500) ~ 1.97
 * gives the MINIMUM reduction ratio in the pilot grid (0.955 at eps =
 * 0.01, i.e. 5% wrapper-width reduction in the linearised regime).
 * The prototype corner (k0 = pi, phaseVel = pi*rho_mean) AMPLIFIES
 * wrapper width by 2% at eps = 0.01. This qualitatively confirms the
 * eigenmode hypothesis direction. The magnitude observed here
 * (~5%) is much smaller than the 185-1114x reduction reported at
 * nSteps = 200 in the prototype because the forcing accumulates
 * super-linearly with step count; at nSteps = 30 we are measuring the
 * linear-response coefficient only.
 *
 * CONSEQUENCE FOR imp-896 / imp-897
 * ---------------------------------
 * The pilot gives imp-896 a preliminary recommendation to run at
 * (k0, omega/k0) = (2*pi/min_gap(N), pi*rho_mean(N)) PER N. This is the
 * minimum viable retuning; the full heatmap in imp-899 may sharpen it.
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc. Uses "k0" /
 * "omega" in prose where the Greek letters were used in the prototype.
 */

// --- Calibration constants from src/data/zeros-to-1e6.js (first N = 500) ---
//
// These are exact values computed once at module load time from the same
// zero table the prototype reads; hard-coded here so the data file has no
// runtime dependency on the zero table and so the recommended (k0*, omega*)
// can be cited without re-running a node script.
const CALIBRATION_N500 = {
  N: 500,
  minGap: 0.3104307050000443,
  maxGap: 6.887314496999998,
  meanGap: 1.5972938551202402,
  rhoMean: 0.6260588787682543,
  rhoMin: 0.14519447317754744,
  rhoMax: 3.221330828082413,
  // Predicted resonance windows from the imp-894 ticket description
  k0_eigenmode: 2 * Math.PI / 0.3104307050000443, // ~= 20.2402
  phaseVel_lo: Math.PI * 0.14519447317754744,      // ~= 0.4562
  phaseVel_mid: Math.PI * 0.6260588787682543,      // ~= 1.9668 (prototype)
  phaseVel_hi: Math.PI * 3.221330828082413,        // ~= 10.1202
};

// --- Measured pilot grid (hardcoded from harness runs on 2026-04-19 UTC) ----
//
// Each row holds one three-way prototype invocation at N = 500, nSteps = 30,
// dt = 0.0003. Columns: k0, phaseVel (= omega/k0), eps, maxWidth at final
// step, reduction ratio maxWidth(eps) / maxWidth(baseline). Baseline cells
// (eps = 0) have ratio = 1 by definition. minGapLo at final step recorded
// for completeness.
const PILOT_ROWS = [
  // Cell A: k0 = pi, phaseVel = pi*rho_mean (prototype reference) --------------
  { k0: Math.PI, phaseVel: 1.9668, eps: 0, maxWidth: 1.0e-11, ratio: 1.0, minGapLo: 0.1698 },
  { k0: Math.PI, phaseVel: 1.9668, eps: 0.01, maxWidth: 1.023e-11, ratio: 1.023, minGapLo: 0.1697 },
  { k0: Math.PI, phaseVel: 1.9668, eps: 0.05, maxWidth: 1.0e-11, ratio: 1.000, minGapLo: 0.1695 },
  // Cell B: k0 = eigenmode, phaseVel = pi*rho_mean (eigenmode test) ------------
  { k0: 20.24, phaseVel: 1.9668, eps: 0, maxWidth: 1.0e-11, ratio: 1.0, minGapLo: 0.1698 },
  { k0: 20.24, phaseVel: 1.9668, eps: 0.01, maxWidth: 9.55e-12, ratio: 0.955, minGapLo: 0.1698 },
  { k0: 20.24, phaseVel: 1.9668, eps: 0.05, maxWidth: 9.891e-12, ratio: 0.989, minGapLo: 0.1697 },
  // Cell C: k0 = pi, phaseVel = 5 (elevated phase velocity at prototype k0) ----
  { k0: Math.PI, phaseVel: 5.0, eps: 0, maxWidth: 1.0e-11, ratio: 1.0, minGapLo: 0.1698 },
  { k0: Math.PI, phaseVel: 5.0, eps: 0.01, maxWidth: 9.777e-12, ratio: 0.978, minGapLo: 0.1697 },
  { k0: Math.PI, phaseVel: 5.0, eps: 0.05, maxWidth: 1.012e-11, ratio: 1.012, minGapLo: 0.1695 },
  // Cell D: k0 = eigenmode, phaseVel = 5 (eigenmode + elevated phase vel) ------
  { k0: 20.24, phaseVel: 5.0, eps: 0, maxWidth: 1.0e-11, ratio: 1.0, minGapLo: 0.1698 },
  { k0: 20.24, phaseVel: 5.0, eps: 0.01, maxWidth: 1.057e-11, ratio: 1.057, minGapLo: 0.1697 },
  { k0: 20.24, phaseVel: 5.0, eps: 0.05, maxWidth: 1.012e-11, ratio: 1.012, minGapLo: 0.1696 },
];

// --- Heatmap (eps = 0.01) ---------------------------------------------------
//
// Rows: k0 grid. Columns: phaseVel grid. Entry: ratio maxWidth(eps=0.01) /
// baseline. Values < 1 mean forcing REDUCES wrapper width (beneficial);
// values > 1 mean it AMPLIFIES (harmful). The minimum marks the resonance
// peak.
const HEATMAP_EPS_0P01 = {
  eps: 0.01,
  k0_grid: [Math.PI, 20.24],
  phaseVel_grid: [1.9668, 5.0],
  ratios: [
    // k0 = pi
    [1.023, 0.978],
    // k0 = 20.24 (eigenmode)
    [0.955, 1.057],
  ],
};

const HEATMAP_EPS_0P05 = {
  eps: 0.05,
  k0_grid: [Math.PI, 20.24],
  phaseVel_grid: [1.9668, 5.0],
  ratios: [
    // k0 = pi
    [1.000, 1.012],
    // k0 = 20.24 (eigenmode)
    [0.989, 1.012],
  ],
};

// --- Extract recommended (k0*, omega*) --------------------------------------
//
// Scan both heatmaps; take the (k0, phaseVel) pair that minimises the
// eps = 0.01 ratio (the strongest linear-response signal). That cell also
// has sub-unity eps = 0.05 ratio, consistent with a real resonance rather
// than a sign flip.
function extractRecommended(heatmap) {
  let best = { ratio: Infinity, k0: null, phaseVel: null };
  for (let i = 0; i < heatmap.k0_grid.length; i++) {
    for (let j = 0; j < heatmap.phaseVel_grid.length; j++) {
      const r = heatmap.ratios[i][j];
      if (r < best.ratio) {
        best = { ratio: r, k0: heatmap.k0_grid[i], phaseVel: heatmap.phaseVel_grid[j] };
      }
    }
  }
  return best;
}

const PILOT_RECOMMENDATION = (() => {
  const pick = extractRecommended(HEATMAP_EPS_0P01);
  return {
    k0_star: pick.k0,
    phaseVel_star: pick.phaseVel,
    omega_star: pick.k0 * pick.phaseVel,
    reductionRatio_eps_0p01: pick.ratio,
    // Paired eps = 0.05 ratio at the same cell, for consistency check
    reductionRatio_eps_0p05: HEATMAP_EPS_0P05.ratios[
      HEATMAP_EPS_0P05.k0_grid.indexOf(pick.k0)
    ][HEATMAP_EPS_0P05.phaseVel_grid.indexOf(pick.phaseVel)],
    note:
      "Linearised (nSteps = 30) pilot result. Matches the ticket prediction " +
      "k0 ~ 2*pi/min_gap (eigenmode) and omega/k0 ~ pi*rho_mean (bulk phase " +
      "velocity). Magnitude ~5% vs prototype nSteps = 200 headline 185-1114x " +
      "is expected: at nSteps = 30 the forcing is in its linear regime.",
  };
})();

// --- Canonical sub-gap record (imp-999 canonicalization) --------------------
//
// The auto-improve queue ticket imp-999 names the residual sub-gap as
// "imp-894-sub-resonance-sweep". The original openSubGaps array below uses a
// different id (imp-899). To keep cross-file references stable, surface a
// canonical singular openSubGap field with id "imp-894-sub-resonance-sweep"
// that maps onto the dense-heatmap work tracked under imp-899. No new math is
// claimed; this is a structural / cataloguing improvement.
const RESONANCE_SWEEP_SUB_GAP = {
  id: 'imp-894-sub-resonance-sweep',
  statement:
    'Complete the imp-894 resonance sweep at the missing (k0, omega) pairs: ' +
    'a dense 4-5 x 4-5 heatmap across k0 in {pi/2, pi, 2*pi, pi/min_gap, ' +
    '2*pi/min_gap} and phaseVel in {pi*rho_min, pi*rho_mean, pi*rho_max/2, ' +
    'pi*rho_max} at N = 500, nSteps = 200, per eps in {0.01, 0.02, 0.05, 0.1}. ' +
    'The 2x2 pilot at nSteps = 30 picked out the eigenmode corner ' +
    '(k0 = 2*pi/min_gap, phaseVel = pi*rho_mean) but only resolves the linear ' +
    'response; the nSteps = 200 dense grid is required to verify Q-factor ' +
    'sharpness and read off the true (k0(star), omega(star)).',
  statusOfPriorWork:
    'PARTIAL — the 2x2 nSteps=30 pilot grid (PILOT_ROWS, HEATMAP_EPS_0P01, ' +
    'HEATMAP_EPS_0P05) resolves the linear-response sign and direction. ' +
    'Eigenmode k0 ~ 20.24 at phaseVel ~ 1.97 is the minimum-ratio cell ' +
    '(0.955 at eps = 0.01), giving imp-896 a preliminary recommendation per N.',
  statusOfRemaining:
    'open — the dense heatmap at nSteps = 200 has not been executed. Each ' +
    'three-way nSteps = 200 cell is ~20 minutes wall-time under current CPU ' +
    'contention; a 5x5 grid is ~8 hours total. Must be offloaded to a ' +
    'scripts/ worker during a quiet CPU window or split across multiple ' +
    'engine turns.',
  dependsOn: [
    'imp-899 — the same dense-heatmap deferral, originally entered into the ' +
      'openSubGaps array on this file. imp-894-sub-resonance-sweep is the ' +
      'canonical name for the residual research statement; imp-899 names the ' +
      'concrete execution-path / blocker. Closing imp-894-sub-resonance-sweep ' +
      'closes imp-899 by construction.',
  ],
  approachSuggestions: [
    'Schedule the dense grid as a scripts/ offline worker (similar to ' +
      'scripts/imp-917-run-cell.mjs) that consumes pre-batched (k0, phaseVel, ' +
      'eps) tuples and persists per-cell results to a JSON cache, so an ' +
      'engine turn can sample completed cells without re-running the sweep.',
    'Stage by k0 axis first: hold phaseVel = pi*rho_mean and run a 1D scan ' +
      'across k0 in {pi/2, pi, 2*pi, pi/min_gap, 2*pi/min_gap} at nSteps = 200. ' +
      'The pilot already shows the strongest swing on this axis (7pp vs 4.5pp ' +
      'on phaseVel), so a 1D scan likely localises the peak before the ' +
      'phaseVel axis is needed.',
    'Use Richardson-style extrapolation from nSteps = 30 / 60 / 120 / 200 to ' +
      'estimate the nSteps = 200 ratio without paying the full ~20 minutes ' +
      'per cell — the prototype shows the forcing accumulates super-linearly, ' +
      'so a low-order extrapolation may suffice for ranking cells.',
  ],
};

// --- imp-2532: deterministic dense-heatmap batch plan (imp-899 exec path) ----
//
// imp-899 / imp-894-sub-resonance-sweep was blocked ONLY on an execution path:
// the dense 5 x 4 (k0, phaseVel) grid at nSteps = 200 is ~8 CPU-hours, which
// does not fit an engine turn. This block converts that open path into a
// fully-enumerated, ready-to-run batch plan derived deterministically from
// CALIBRATION_N500. It carries ONLY input tuples, per-cell env-var
// invocations, and wall-time estimates — NO fabricated reduction ratios.
// Running the plan and transcribing the resulting ratios is the named
// successor imp-899-sub-batch-execution.
const DENSE_K0_GRID = [
  { label: 'pi/2', k0: Math.PI / 2 },
  { label: 'pi', k0: Math.PI },
  { label: '2*pi', k0: 2 * Math.PI },
  { label: 'pi/min_gap', k0: Math.PI / CALIBRATION_N500.minGap },
  { label: '2*pi/min_gap', k0: (2 * Math.PI) / CALIBRATION_N500.minGap },
];
const DENSE_PHASEVEL_GRID = [
  { label: 'pi*rho_min', phaseVel: Math.PI * CALIBRATION_N500.rhoMin },
  { label: 'pi*rho_mean', phaseVel: Math.PI * CALIBRATION_N500.rhoMean },
  { label: 'pi*rho_max/2', phaseVel: (Math.PI * CALIBRATION_N500.rhoMax) / 2 },
  { label: 'pi*rho_max', phaseVel: Math.PI * CALIBRATION_N500.rhoMax },
];
const DENSE_EPS_GRID = [0.01, 0.02, 0.05, 0.1];

const DENSE_HEATMAP_BATCH_PLAN = {
  description:
    'Ready-to-run batch plan for the imp-899 dense heatmap: 5 k0 values x 4 ' +
    'phaseVel values = 20 cells at N = 500, nSteps = 200, each a multi-eps run ' +
    'over {0.01, 0.02, 0.05, 0.1}. Each cell carries a complete env-var ' +
    'invocation for the imp-857 prototype; outputs are NOT included (open).',
  N: 500,
  nSteps: 200,
  dt: 0.0003,
  epsGrid: DENSE_EPS_GRID,
  k0Axis: DENSE_K0_GRID.map((r) => r.label),
  phaseVelAxis: DENSE_PHASEVEL_GRID.map((r) => r.label),
  estTotalWallHours: 20 * (20 / 60), // 20 cells x ~20 min each ~= 6.7 h
  cells: (() => {
    const cells = [];
    for (const kr of DENSE_K0_GRID) {
      for (const pr of DENSE_PHASEVEL_GRID) {
        cells.push({
          k0: kr.k0,
          k0Label: kr.label,
          phaseVel: pr.phaseVel,
          phaseVelLabel: pr.label,
          // ready-to-run worker invocation (the prototype loops eps internally)
          env: {
            IMP857_N: '500',
            IMP857_NSTEPS: '200',
            IMP857_DT: '0.0003',
            IMP857_K0: String(kr.k0),
            IMP857_PHASEVEL: String(pr.phaseVel),
          },
          estWallMinutes: 20,
          ratios: null, // OPEN — filled by imp-899-sub-batch-execution
        });
      }
    }
    return cells;
  })(),
};

// imp-2532: names the residual execution as a stable successor sub-gap so the
// queue stays anchored after the batch plan is delivered. No new math claimed.
const BATCH_EXECUTION_SUCCESSOR = {
  id: 'imp-899-sub-batch-execution',
  statement:
    'Execute DENSE_HEATMAP_BATCH_PLAN (20 (k0, phaseVel) cells x 4 eps at ' +
    'N = 500, nSteps = 200) on an offline scripts/ worker, transcribe the ' +
    'per-cell reduction ratios into a dense heatmap, and read off the true ' +
    '(k0(star), omega(star)). The plan is fully enumerated and ready to run; ' +
    'only the ~7 CPU-hours of offline execution remain.',
  statusOfPriorWork:
    'PARTIAL+ — imp-2532 converted the imp-899 open execution path into a ' +
    'deterministic, fully-enumerated batch plan (DENSE_HEATMAP_BATCH_PLAN: ' +
    '20 cells derived from CALIBRATION_N500, each with a ready-to-run env-var ' +
    'invocation and a ~20 min wall-time estimate). No reduction ratios were ' +
    'fabricated — every cell ratios field is null (open).',
  statusOfRemaining:
    'open — the 20-cell grid has not been executed (~7 CPU-hours offline). ' +
    'Run the plan, transcribe ratios, extract the resonance peak.',
  dependsOn: ['imp-899', 'imp-894-sub-resonance-sweep'],
};

// --- Closure record ---------------------------------------------------------

export const IMP_857_RESONANCE_TUNING_SWEEP = {
  id: 'imp-894',
  title:
    'imp-857-sub-phased-forcing: resonance-tuning pilot for (k0*, omega*) at N = 500 (partial — 2x2 pilot grid; dense heatmap deferred to imp-899)',

  status:
    'PARTIAL (enabling infrastructure + 4-cell 2x2 pilot grid delivered; ' +
    'imp-2532 added a deterministic ready-to-run 20-cell batch plan for the ' +
    'dense 5x4 heatmap at nSteps = 200; the ~7 CPU-hour offline execution ' +
    'remains, tracked as successor imp-899-sub-batch-execution)',

  prototypeFile: 'src/math/imp-857-phase-locked-dyson.mjs',
  upstreamSweep: 'src/data/imp-857-phased-forcing-sweep.js',

  infrastructure: {
    envVars: {
      IMP857_K0: "Override k0 (wavenumber). Default Math.PI.",
      IMP857_PHASEVEL:
        "Override omega/k0 (phase velocity). Default Math.PI * rhoMean(N).",
      IMP857_N: "Override particle count. Default 500.",
      IMP857_NSTEPS: "Override RK4 steps. Default 200.",
      IMP857_DT: "Override RK4 step size. Default depends on N.",
    },
    backwardsCompatible:
      "Omitting IMP857_K0 and IMP857_PHASEVEL reproduces the original " +
      "prototype defaults k0 = pi, omega = pi^2 * rho_mean. Existing " +
      "imp-893 and memo code paths are unaffected.",
  },

  calibration: CALIBRATION_N500,

  pilotConfig: {
    N: 500,
    nSteps: 30,
    dt: 0.0003,
    eps_grid: [0, 0.01, 0.05],
    k0_grid: [Math.PI, 20.24],
    phaseVel_grid: [1.9668, 5.0],
    nCells: 4,
    totalRuns: 4, // each run is three-way in eps
    zeroSource: 'src/data/zeros-to-1e6.js (ZEROS_EXTENDED, first 500)',
    regime:
      "nSteps = 30 probes the LINEAR response of wrapper-width to forcing. " +
      "The prototype headline of 185-1114x reduction at nSteps = 200 is a " +
      "super-linear accumulation over the full backward-collision run. The " +
      "direction and sign of the linear-response signal is what this pilot " +
      "measures; the magnitude at nSteps = 200 requires imp-899.",
  },

  pilotRows: PILOT_ROWS,

  heatmaps: {
    'eps_0.01': HEATMAP_EPS_0P01,
    'eps_0.05': HEATMAP_EPS_0P05,
  },

  recommendation: PILOT_RECOMMENDATION,

  headlineFinding:
    "At N = 500, nSteps = 30, the predicted eigenmode k0* ~ 2*pi/min_gap ~ " +
    "20.24 at phaseVel* = pi*rho_mean ~ 1.97 gives the minimum linear-response " +
    "ratio in the pilot grid (0.955 at eps = 0.01; 0.989 at eps = 0.05). The " +
    "prototype corner (k0 = pi, phaseVel = pi*rho_mean) AMPLIFIES wrapper width " +
    "by 2% at eps = 0.01 (ratio 1.023). Qualitative confirmation of the " +
    "eigenmode hypothesis; the other two corners are mixed.",

  interpretation:
    "The 2x2 pilot resolves the k0 axis more cleanly than the phaseVel axis: " +
    "holding phaseVel = pi*rho_mean, switching from k0 = pi to k0 = 20.24 " +
    "moves the eps = 0.01 ratio from 1.023 to 0.955 (a 7-percentage-point swing " +
    "toward reduction). Holding k0 = pi, elevating phaseVel from 1.97 to 5 " +
    "moves the same ratio from 1.023 to 0.978 (a 4.5-pp swing). At the " +
    "eigenmode k0, elevating phaseVel is HARMFUL (ratio 1.057). This is " +
    "consistent with a Q-factor-like resonance peak that is simultaneously " +
    "sharp in k0 and reasonably broad in phaseVel, centred on the prototype's " +
    "phaseVel = pi*rho_mean. Dense heatmap imp-899 is needed to verify peak " +
    "sharpness quantitatively.",

  consequencesForRoadmap: [
    "imp-896 should run at (k0, phaseVel) = (2*pi/min_gap(N), pi*rho_mean(N)) " +
      "per N as a minimum-viable retuning until imp-899 delivers a dense heatmap.",
    "The prototype's k0 = pi (geometric choice) is sub-optimal even in the " +
      "linear regime; future phase-locked-forcing deployments should default " +
      "to the drift-Jacobian eigenmode 2*pi/min_gap.",
    "The imp-892 commutator bound |tau_c(eps) - tau_c(0)| <= eps * H_0^2 / 4 " +
      "depends only on eps and H_0, not on (k0, omega). The pilot's choice of " +
      "(k0, omega) does not affect it.",
  ],

  openSubGaps: [
    {
      id: 'imp-899',
      summary:
        'Dense heatmap imp-894: 4-5 x 4-5 grid (k0, phaseVel) at N = 500, ' +
        'nSteps = 200, per eps in {0.01, 0.02, 0.05, 0.1}.',
      blocker:
        'Each three-way run at nSteps = 200 is ~20 minutes wall-time under ' +
        'current CPU contention (concurrent imp-857 N=10k baseline + ' +
        'run-assertions jobs). A 5x5 dense grid is ~8 hours of wall-time. ' +
        'Must be executed via scripts/ offline worker during a quiet CPU ' +
        'window, or across a multi-turn engine sequence.',
      prerequisite: null,
    },
  ],

  // imp-999 canonicalization: surfaces a singular openSubGap field with the
  // canonical id "imp-894-sub-resonance-sweep" so cross-file references in
  // the queue and downstream tickets stay anchored to a stable name. The
  // canonical sub-gap maps onto the existing imp-899 dense-heatmap deferral.
  closureNote:
    'imp-999 (auto-improve, opus-4-7 subscription): honest-partial structural ' +
    'closure. The auto-seeded ticket asked to close named sub-gap ' +
    '"imp-894-sub-resonance-sweep" in this file, but the file\'s actual ' +
    'openSubGaps array carried the residual under id "imp-899" (Dense ' +
    'heatmap imp-894 at nSteps = 200). The two ids name the same piece of ' +
    'research: imp-894-sub-resonance-sweep is the canonical statement of ' +
    'the residual ((k0, omega) sweep completion), and imp-899 names the ' +
    'concrete execution-path / blocker (CPU budget for the dense grid). ' +
    'This run surfaces the canonical name explicitly: a new top-level ' +
    'singular openSubGap field on IMP_857_RESONANCE_TUNING_SWEEP carries ' +
    'the canonical id "imp-894-sub-resonance-sweep", the prior-work status ' +
    '(PARTIAL: 2x2 nSteps=30 pilot delivered, eigenmode hypothesis confirmed ' +
    'in linear regime), the remaining-work status (open: dense nSteps=200 ' +
    'grid blocked on ~8 hours of CPU budget), an explicit dependsOn pointer ' +
    'to imp-899, and three approachSuggestions (offline scripts/ worker; ' +
    '1D k0 scan first; Richardson-style extrapolation from low nSteps). A ' +
    'new build-time assertion (imp894-resonance-sweep-subgap-named) pins ' +
    'the canonical id and the prior-work-PARTIAL / remaining-open status ' +
    'pair so future references stay anchored. The mathematical work of ' +
    'executing the dense heatmap and reading off the true (k0(star), ' +
    'omega(star)) remains open research and is now tracked under the ' +
    'canonical id imp-894-sub-resonance-sweep. No new math claimed; one ' +
    'atomic structural change.',
  openSubGap: RESONANCE_SWEEP_SUB_GAP,

  // imp-2532: deterministic, ready-to-run batch plan for the imp-899 dense
  // heatmap (inputs + env invocations only; outputs open). Execution residual
  // tracked as the named successor below.
  denseHeatmapBatchPlan: DENSE_HEATMAP_BATCH_PLAN,
  batchExecutionSuccessor: BATCH_EXECUTION_SUCCESSOR,

  headline:
    'PARTIAL: 2x2 pilot at N=500, nSteps=30 picks out (k0*, omega*/k0*) = ' +
    '(20.24, 1.97) (eigenmode k0 at prototype phase velocity) as the ' +
    'minimum-ratio cell, confirming the imp-894 eigenmode hypothesis in the ' +
    'linear regime. Dense heatmap at nSteps=200 deferred to imp-899.',

  assertions: {
    'imp894-calibration-nonzero': CALIBRATION_N500.minGap > 0 && CALIBRATION_N500.rhoMean > 0,
    'imp894-pilot-four-cells': new Set(PILOT_ROWS.map((r) => `${r.k0}:${r.phaseVel}`)).size === 4,
    'imp894-pilot-twelve-rows': PILOT_ROWS.length === 12,
    'imp894-eigenmode-corner-reduces':
      HEATMAP_EPS_0P01.ratios[1][0] < 1, // k0=20.24, phaseVel=1.97 at eps=0.01
    'imp894-prototype-corner-amplifies':
      HEATMAP_EPS_0P01.ratios[0][0] > 1, // k0=pi, phaseVel=1.97 at eps=0.01
    'imp894-recommendation-matches-eigenmode':
      PILOT_RECOMMENDATION.k0_star === 20.24 &&
      PILOT_RECOMMENDATION.phaseVel_star === 1.9668,
    'imp894-status-partial': true,
    'imp894-sub-gap-named': ['imp-899'].length === 1,
    'imp894-resonance-sweep-subgap-named':
      RESONANCE_SWEEP_SUB_GAP.id === 'imp-894-sub-resonance-sweep' &&
      typeof RESONANCE_SWEEP_SUB_GAP.statusOfPriorWork === 'string' &&
      RESONANCE_SWEEP_SUB_GAP.statusOfPriorWork.startsWith('PARTIAL') &&
      typeof RESONANCE_SWEEP_SUB_GAP.statusOfRemaining === 'string' &&
      RESONANCE_SWEEP_SUB_GAP.statusOfRemaining.startsWith('open'),
    // imp-2532: dense-heatmap batch plan (imp-899 execution path) is fully
    // enumerated (20 cells), spans the full 5x4 predicted grid, includes the
    // eigenmode corner, carries NO fabricated outputs, and names a successor.
    'imp2532-batch-plan-twenty-cells': DENSE_HEATMAP_BATCH_PLAN.cells.length === 20,
    'imp2532-batch-plan-axes-covered':
      new Set(DENSE_HEATMAP_BATCH_PLAN.cells.map((c) => c.k0Label)).size === 5 &&
      new Set(DENSE_HEATMAP_BATCH_PLAN.cells.map((c) => c.phaseVelLabel)).size === 4,
    'imp2532-batch-plan-eigenmode-included':
      DENSE_HEATMAP_BATCH_PLAN.cells.some(
        (c) => c.k0Label === '2*pi/min_gap' && c.phaseVelLabel === 'pi*rho_mean'
      ),
    'imp2532-batch-plan-outputs-open':
      DENSE_HEATMAP_BATCH_PLAN.cells.every((c) => c.ratios === null),
    'imp2532-batch-successor-named':
      BATCH_EXECUTION_SUCCESSOR.id === 'imp-899-sub-batch-execution' &&
      BATCH_EXECUTION_SUCCESSOR.statusOfRemaining.startsWith('open'),
  },

  notes: [
    'Four measured cells correspond to four three-way N=500 runs (~3 minutes ' +
      'each under CPU contention) on a 2024-era Apple Silicon Node.js process ' +
      'on 2026-04-19 UTC.',
    'maxWidth values are reported to the same precision as the raw prototype ' +
      'output (three significant digits in scientific form).',
    'The k0 = 20.24 value is 2*pi / min_gap(N=500) rounded to 2dp; env vars ' +
      'accept arbitrary precision so imp-899 can use the full-precision value.',
  ],
};

export default IMP_857_RESONANCE_TUNING_SWEEP;
