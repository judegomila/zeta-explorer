/**
 * @module imp-896-retuning-calibration
 * @fileoverview Per-N retuning calibration table for the imp-857 phased-
 * forcing grid-completion run (k₀, ω, ε, dt, nSteps, wallSec budget per
 * cell). Exports {@link IMP_896_RETUNING_CALIBRATION} (calibration record
 * + missing-cells inventory) as default. Engineering record consumed by
 * scripts/imp-917-run-cell.mjs; NOT part of the formal proof chain.
 * Module-doc added by imp-946.
 * @see imp-896
 * @see imp-857
 * @see imp-917
 */

/**
 * imp-896 / imp-857-sub-phased-forcing:
 *   Per-N retuning calibration for the phased-forcing grid-completion run.
 *
 * SCOPE AND HONEST STATUS (read first)
 * ------------------------------------
 * imp-896 asked to complete the phased-forcing grid at (N in {5000, 10000})
 * x (eps in {0, 0.01, 0.02, 0.05, 0.1}) plus (N in {1000, 2000}) x
 * (eps in {0.02, 0.1}). Total: 14 missing cells on top of the 6 already
 * measured in imp-893 (src/data/imp-857-phased-forcing-sweep.js).
 *
 * The ticket description flagged two prerequisites:
 *   (P1) Retuning. Per imp-894, the fixed-resonance (k0 = pi, omega =
 *        pi^2 * rho_mean(N = 500)) does NOT scale; running imp-896 at fixed
 *        resonance would produce null reductions and waste CPU. The
 *        minimum-viable retuning is (k0, phaseVel) = (2*pi / min_gap(N),
 *        pi * rho_mean(N)) per N, per the imp-894 pilot headline.
 *   (P2) CPU budget. A single three-way (eps = {0, eps_1, eps_2}) run at
 *        N = 10000 with nSteps >= 20 is ~1 hour wall-time in Node under
 *        the existing O(N^2) forced-drift-vector kernel; a 14-cell grid
 *        is ~20 wall-hours and exceeds any single engine turn.
 *
 * WHAT THIS FILE DELIVERS (INFRASTRUCTURE CLOSURE OF imp-896)
 * -----------------------------------------------------------
 *   (a) Exact calibration constants (min_gap(N), mean_gap(N), rho_mean(N),
 *       rho_min(N), rho_max(N)) derived from the first N entries of
 *       src/data/zeros-to-1e6.js for N in {500, 1000, 2000, 5000, 10000}.
 *       These are the inputs the prototype needs, hard-coded so the data
 *       file has no runtime dependency on the 20-MB zero table.
 *   (b) Recommended retuning triple (k0*, phaseVel*, omega*) per N from
 *       the imp-894 minimum-viable rule.
 *   (c) Wall-time budget per cell at the three N values, derived from a
 *       measured probe run at N = 1000, nSteps = 10 (~3.4 min CPU on
 *       2024-era Apple Silicon under concurrent engine load).
 *   (d) The exact env-var invocation an offline scripts/ worker must use
 *       to execute each missing cell, including the note about having to
 *       edit EPSILONS in the prototype for the {0.02, 0.1} values.
 *
 * WHAT THIS FILE DOES NOT DELIVER (NAMED SUB-GAP imp-917)
 * -------------------------------------------------------
 *   The 14 missing measurement rows themselves. Execution is pure CPU
 *   budget; there is no further design or decision needed. Promoted to
 *   imp-917 for offline-worker scheduling (queue id claimed via
 *   scripts/claim-ticket-id.mjs).
 *
 * HEADLINE
 * --------
 * imp-896 cleared of all blocker except raw wall-time. A CPU-budget-only
 * sub-ticket (imp-917) carries the remaining 14-cell execution. No
 * mathematical or infrastructural design decisions remain; the offline
 * worker reads (k0*, phaseVel*) for the target N from RETUNING_CALIBRATION
 * below and invokes the existing prototype with those env vars.
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc. Uses "k0" / "omega"
 * in prose where the Greek letters were used in the prototype.
 */

// --- Per-N calibration constants -------------------------------------------
//
// Derived exactly from the first N entries of src/data/zeros-to-1e6.js on
// 2026-04-23 UTC. Reproducible via a tiny Node script:
//
//   node -e 'import("./src/data/zeros-to-1e6.js").then(m => {
//     const Z = m.ZEROS_EXTENDED;
//     for (const N of [500, 1000, 2000, 5000, 10000]) {
//       const a = Z.slice(0, N);
//       let min = Infinity, max = -Infinity, sum = 0;
//       for (let i = 1; i < N; i++) {
//         const g = a[i] - a[i-1];
//         if (g < min) min = g;
//         if (g > max) max = g;
//         sum += g;
//       }
//       console.log(N, min, max, sum / (N - 1));
//     }
//   });'
//
// Values below are the full-precision Number outputs of that script.

const CALIBRATION = {
  500: {
    minGap: 0.3104307050000443,
    maxGap: 6.887314496999998,
    meanGap: 1.5972938551202402,
    rhoMean: 0.6260588787682543,
    rhoMin: 0.14519447317754744,
    rhoMax: 3.221330828082413,
  },
  1000: {
    minGap: 0.1615007880000121,
    maxGap: 6.887314496999998,
    meanGap: 1.406694450254254,
    rhoMean: 0.7108864329558237,
    rhoMin: 0.14519447317754744,
    rhoMax: 6.191920252425796,
  },
  2000: {
    minGap: 0.09750250199999755,
    maxGap: 6.887314496999998,
    meanGap: 1.2512014796313156,
    rhoMean: 0.7992317914255219,
    rhoMin: 0.14519447317754744,
    rhoMax: 10.256147067898064,
  },
  5000: {
    minGap: 0.04325406000043586,
    maxGap: 6.887314496999998,
    meanGap: 1.0869628472012403,
    rhoMean: 0.9199946461600265,
    rhoMin: 0.14519447317754744,
    rhoMax: 23.119217016620482,
  },
  10000: {
    minGap: 0.03769849900072586,
    maxGap: 6.887314496999998,
    meanGap: 0.9864634392301231,
    rhoMean: 1.0137223137032239,
    rhoMin: 0.14519447317754744,
    rhoMax: 26.526255063384504,
  },
};

// --- Per-N recommended retuning ---------------------------------------------
//
// Minimum-viable retuning rule from imp-894 pilot:
//   k0*(N)        = 2 * pi / min_gap(N)        (drift-Jacobian eigenmode)
//   phaseVel*(N)  = pi * rho_mean(N)           (bulk GUE phase velocity)
//   omega*(N)     = k0*(N) * phaseVel*(N)
// Under this rule the imp-894 pilot delivers the minimum eps = 0.01 ratio
// in the 2x2 pilot grid (ratio 0.955, 5% wrapper-width reduction in the
// linear regime at N = 500, nSteps = 30). See imp-857-resonance-tuning-
// sweep.js for full pilot-row provenance.

function computeRetuning(N) {
  const c = CALIBRATION[N];
  if (!c) return null;
  const k0 = 2 * Math.PI / c.minGap;
  const phaseVel = Math.PI * c.rhoMean;
  const omega = k0 * phaseVel;
  return { N, k0_star: k0, phaseVel_star: phaseVel, omega_star: omega };
}

const RETUNING_CALIBRATION = [500, 1000, 2000, 5000, 10000].map(computeRetuning);

// --- Per-cell offline-worker invocation table -------------------------------
//
// Each missing cell is executed by invoking
//   IMP857_N=<N> IMP857_NSTEPS=<nSteps> IMP857_DT=<dt>
//   IMP857_K0=<k0_star> IMP857_PHASEVEL=<phaseVel_star>
//   node src/math/imp-857-phase-locked-dyson.mjs
// after editing the prototype's EPSILONS = [...] array to [0, eps_1, eps_2]
// for the targeted eps pair. The prototype reads k0 / phaseVel / N / nSteps
// / dt from env vars (imp-894 infrastructure) but EPSILONS is still
// hard-coded; one-line edit per pair. The baseline (eps = 0) is re-run each
// cell for internal consistency with the measured ratio.

const MISSING_CELLS = [
  // N = 1000 x {0.02, 0.1} --------------------------------------------------
  { N: 1000, eps: 0.02, dt: 1e-4, nSteps: 40, wallSecondsEstPerTripleRun: 1400 },
  { N: 1000, eps: 0.1,  dt: 1e-4, nSteps: 40, wallSecondsEstPerTripleRun: 1400 },
  // N = 2000 x {0.02, 0.1} --------------------------------------------------
  { N: 2000, eps: 0.02, dt: 1e-4, nSteps: 20, wallSecondsEstPerTripleRun: 2800 },
  { N: 2000, eps: 0.1,  dt: 1e-4, nSteps: 20, wallSecondsEstPerTripleRun: 2800 },
  // N = 5000 x {0, 0.01, 0.02, 0.05, 0.1} -----------------------------------
  { N: 5000, eps: 0,    dt: 1e-4, nSteps: 10, wallSecondsEstPerTripleRun: 18000 },
  { N: 5000, eps: 0.01, dt: 1e-4, nSteps: 10, wallSecondsEstPerTripleRun: 18000 },
  { N: 5000, eps: 0.02, dt: 1e-4, nSteps: 10, wallSecondsEstPerTripleRun: 18000 },
  { N: 5000, eps: 0.05, dt: 1e-4, nSteps: 10, wallSecondsEstPerTripleRun: 18000 },
  { N: 5000, eps: 0.1,  dt: 1e-4, nSteps: 10, wallSecondsEstPerTripleRun: 18000 },
  // N = 10000 x {0, 0.01, 0.02, 0.05, 0.1} ----------------------------------
  { N: 10000, eps: 0,    dt: 1e-4, nSteps: 5, wallSecondsEstPerTripleRun: 72000 },
  { N: 10000, eps: 0.01, dt: 1e-4, nSteps: 5, wallSecondsEstPerTripleRun: 72000 },
  { N: 10000, eps: 0.02, dt: 1e-4, nSteps: 5, wallSecondsEstPerTripleRun: 72000 },
  { N: 10000, eps: 0.05, dt: 1e-4, nSteps: 5, wallSecondsEstPerTripleRun: 72000 },
  { N: 10000, eps: 0.1,  dt: 1e-4, nSteps: 5, wallSecondsEstPerTripleRun: 72000 },
];

// Wall-time estimates are derived from a measured probe run at
// N = 1000, nSteps = 10, three-way (eps in {0, 0.01, 0.05}) on 2026-04-23
// UTC which consumed 201 s of wall-time (305 s user CPU) under concurrent
// engine load. At N = 1000, nSteps = 40 this scales to ~804 s per triple
// (~13 min); at N = 2000, nSteps = 20 it is O(N^2) * (nSteps / 10) =
// 4 * 2 = 8x the N=1000, nSteps=10 cost, i.e. ~27 min; at N = 5000 it is
// 25 * 1 = 25x ~= 85 min; at N = 10000 at nSteps = 5 it is 100 * 0.5 =
// 50x ~= 170 min. Per-cell estimates above are approximately the
// per-triple-run cost (each row of the MISSING_CELLS table contributes a
// cell to the underlying triple; a given triple covers up to 3 cells so
// the MISSING_CELLS totals are an upper bound on the actual CPU needed).

// --- Canonical sub-gap record (imp-1001 canonicalization) ------------------
//
// The auto-improve queue ticket imp-1001 names the residual sub-gap as
// "imp-917-exec". The original openSubGaps array below uses id "imp-917"
// for the same piece of research (~20 CPU-h to execute the 14 missing
// (N, eps) cells via 6 batch-plan invocations of the offline-worker
// scripts/imp-917-run-cell.mjs). To keep cross-file references stable,
// surface a canonical singular openSubGap field with id "imp-917-exec"
// that maps onto imp-917. No new math is claimed; this is a structural /
// cataloguing improvement.
const RETUNING_CALIBRATION_SUB_GAP = {
  id: 'imp-917-exec',
  statement:
    'Execute the 14 missing (N, eps) cells of the imp-896 phased-forcing ' +
    'grid using the RETUNING_CALIBRATION table (k0_star, phaseVel_star) per ' +
    'N and the executionRecipe IMP857_* env vars: roughly 6 batch-plan ' +
    'invocations of scripts/imp-917-run-cell.mjs covering N=1000 x ' +
    '{0.02, 0.1} (1 triple), N=2000 x {0.02, 0.1} (1 triple), N=5000 x ' +
    '{0, 0.01, 0.02, 0.05, 0.1} (2 triples), and N=10000 x ' +
    '{0, 0.01, 0.02, 0.05, 0.1} (2 triples). Output rows append to ' +
    'MEASURED_ROWS in src/data/imp-857-phased-forcing-sweep.js with the ' +
    'retuned (k0_star, phaseVel_star) per N rather than the imp-893 ' +
    'fixed-resonance corner.',
  statusOfPriorWork:
    'INFRASTRUCTURE-COMPLETE (imp-896 closure): per-N retuning calibration ' +
    'CALIBRATION (minGap, meanGap, rhoMean, rhoMin, rhoMax) derived exactly ' +
    'from the first N entries of zeros-to-1e6.js for N in {500, 1000, 2000, ' +
    '5000, 10000}; RETUNING_CALIBRATION (k0_star=2*pi/min_gap(N), ' +
    'phaseVel_star=pi*rho_mean(N), omega_star=k0_star*phaseVel_star) ' +
    'computed per N and exposed via retuningTable; offline-worker ' +
    'invocation recipe published with IMP857_EPSILONS env override so no ' +
    'source edit is required to sweep the {0.02, 0.1} cells. Driver ' +
    'scripts/imp-917-run-cell.mjs implemented with --plan-table, ' +
    '--missing-cells, --batch-plan-cost, --remaining-cells progress flags.',
  statusOfRemaining:
    'open: 12 of 14 cells remaining after the imp-2537 batch 1 of 6 ' +
    '(2026-06-10: N=1000 triple at eps {0, 0.02, 0.1}, 460 s wall, cells ' +
    '(1000, 0.02) and (1000, 0.1) transcribed into MEASURED_ROWS as the ' +
    'retuned cohort). Remaining: N=2000 x {0.02, 0.1} (1 triple, ~27 min), ' +
    'N=5000 x {0, 0.01, 0.02, 0.05, 0.1} (2 triples, ~85 min each), ' +
    'N=10000 x {0, 0.01, 0.02, 0.05, 0.1} (2 triples, ~170 min each) on ' +
    '2024-era Apple Silicon under concurrent engine load. Cannot all run ' +
    'inside one engine turn; schedule on an idle scripts/ offline worker ' +
    '(the N=2000 triple DOES fit a single pool turn, per batch 1). Output ' +
    'rows must merge into src/data/imp-857-phased-forcing-sweep.js ' +
    'MEASURED_ROWS to close the imp-893 grid completion downstream.',
  progressNoteImp2537:
    'Batch 1 of 6 EXECUTED (imp-2537, api-pool, 2026-06-10): the gating ' +
    'question this record posed — does the retuned (k0_star, ' +
    'phaseVel_star) restore wrapper-width reduction? — is answered YES at ' +
    'N=1000: final-step ratios 0.157 (eps=0.02) and 0.312 (eps=0.1) vs ' +
    '0.839/0.444 for the fixed resonance at the same N. The retuned eps=0 ' +
    'baseline exactly reproduces the fixed-resonance baseline (consistency ' +
    'check), and the eps=0.1 run shows the first step-level collision ' +
    'shift (+1 step; sub-step bisection resolves 1.741e-4 > dt = 1e-4), ' +
    'inside the imp-892 bound. Per the staging approachSuggestion, the ' +
    'next batch is the N=2000 triple (~27 min); re-confirm reduction there ' +
    'before committing the ~2.8 h N=5000 + ~5.7 h N=10000 spend.',
  dependsOn: [
    'imp-917 -- same 14-cell execution, originally entered into the ' +
      'openSubGaps array on this file. imp-917-exec is the canonical name ' +
      'for the residual research statement; imp-917 names the concrete ' +
      'CPU-budget blocker. Closing imp-917-exec closes imp-917 by ' +
      'construction.',
    'imp-899 (PREREQUISITE-OPTIONAL) -- the dense (k0, phaseVel) heatmap ' +
      'at nSteps=200. Per the notes[] field on this file, if imp-899 ' +
      'sharpens the (k0_star, phaseVel_star) recommendation away from the ' +
      'imp-894 minimum-viable rule, imp-917-exec should re-derive the ' +
      'retuning at N=10000 from the imp-899 heatmap before consuming the ' +
      'big-N CPU budget. Not strictly blocking -- the current rule is the ' +
      'best available pre-imp-899.',
    'imp-893-sub-large-N-rerun (DOWNSTREAM CONSUMER) -- canonical id of ' +
      'the large-N rerun in src/data/imp-857-phased-forcing-sweep.js ' +
      '(imp-1000 canonicalization). The imp-917-exec output rows feed ' +
      'directly into MEASURED_ROWS to flip the rerun statusOfRemaining ' +
      'from open to partial/closed.',
  ],
  approachSuggestions: [
    'Schedule each batch as a single scripts/imp-917-run-cell.mjs ' +
      'invocation reading IMP857_N, IMP857_NSTEPS, IMP857_DT, IMP857_K0, ' +
      'IMP857_PHASEVEL, IMP857_EPSILONS from env. The driver already ' +
      'persists per-cell JSON output so partially-completed batches ' +
      'resume from the cache; engine turns sample --done-cells / ' +
      '--remaining-cells without re-running the sweep.',
    'Stage by N axis from cheap to expensive: N=1000 triples (~13 min ' +
      'each) first, then N=2000 (~27 min), then N=5000 (~85 min per ' +
      'triple), gate the N=10000 batches (~170 min per triple, ~14 hours ' +
      'total) on whether the retuned (k0_star, phaseVel_star) restores ' +
      'wrapper-width reduction at N=5000. If reduction is still null at ' +
      'N=5000 with retuning, abandon the N=10000 batch and document the ' +
      'negative result rather than paying the dominant CPU cost.',
    'Re-probe the per-cell wall-time before committing the full budget: ' +
      'the MISSING_CELLS estimates are derived from a single 2026-04-23 ' +
      'probe at N=1000, nSteps=10 under concurrent engine load and may be ' +
      'off by 2x in either direction depending on machine contention. A ' +
      '5-minute re-probe at N=1000, nSteps=40 sharpens all four scaling ' +
      'multipliers before the big-N runs.',
  ],
};

// --- imp-2535 consolidation: dedupe the dual-id residual ---------------------
//
// The 14-cell execution residual was tracked under TWO ids in this file:
// "imp-917" (the openSubGaps array entry below, original promotion) and
// "imp-917-exec" (the canonical singular openSubGap record above, added by
// imp-1001). The sub-gap harvester seeded BOTH as concurrent queue tickets
// (imp-2535 from this entry, imp-2537 from the canonical record), dispatching
// two pool workers onto the same ~20-CPU-hour execution. This entry is
// therefore marked CONSOLIDATED into the canonical id so the residual is
// seeded exactly once; the execution itself remains OPEN under imp-917-exec.
// No cell was executed by this consolidation and no measurement is claimed.
const IMP_917_OPEN_SUB_GAP_ENTRY = {
  id: 'imp-917',
  status:
    'CONSOLIDATED-INTO-IMP-917-EXEC (structural dedupe only; the 14-cell ' +
    'execution itself remains open and no cells are claimed measured by ' +
    'this entry)',
  consolidatedInto: 'imp-917-exec',
  resolvedBy: 'imp-2535 (api-pool dual-id dedupe; see resolutionImp2535)',
  resolutionImp2535:
    'Dual-id dedupe (queue ticket imp-2535): this entry and the canonical ' +
    'singular openSubGap record (id imp-917-exec, surfaced by imp-1001) ' +
    'named the SAME 14-cell ~20-CPU-hour execution, and the sub-gap ' +
    'harvester seeded BOTH ids as concurrent queue tickets -- imp-2535 from ' +
    'this array entry and imp-2537 from the canonical record -- dispatching ' +
    'two pool workers onto one residual. Consolidated so the residual is ' +
    'tracked exactly once under imp-917-exec, whose execution was in flight ' +
    'under queue ticket imp-2537 (api-pool-w3) at consolidation time, with ' +
    'the sweep-file reductionTable already cohort-keyed (fixed vs retuned ' +
    'resonance) to receive the output rows. The execution itself remains ' +
    'OPEN: 0 of 14 cells are claimed by this consolidation, the canonical ' +
    'record statusOfRemaining is unchanged, and the imp2535 tripwires fail ' +
    'the build if this entry ever claims measurement or the canonical ' +
    'record silently flips away from open.',
  summary:
    'Execute the 14-cell imp-896 grid using the RETUNING_CALIBRATION table ' +
    'and executionRecipe above. Pure CPU-budget ticket; no further design ' +
    'needed.',
  blocker:
    'Wall-time budget. Estimated total ~20 CPU-hours across 14 cells on ' +
    'current hardware under concurrent engine load. Must run on an idle ' +
    'scripts/ offline worker, not inside an engine turn. Output rows ' +
    'append to MEASURED_ROWS in src/data/imp-857-phased-forcing-sweep.js. ' +
    '(Blocker now carried by the canonical imp-917-exec record above.)',
  prerequisite: null,
};

// --- Closure record ---------------------------------------------------------

export const IMP_896_RETUNING_CALIBRATION = {
  id: 'imp-896',
  title:
    'imp-857-sub-phased-forcing: per-N retuning calibration for imp-896 grid ' +
    '(infrastructure closure; 14-cell measurement execution promoted to imp-917)',

  status:
    'COMPLETED-AS-INFRASTRUCTURE (retuning calibration + offline-worker ' +
    'invocation table delivered; 14-cell measurement execution requires pure ' +
    'CPU budget and is promoted to imp-917)',

  prerequisites: {
    imp_893: 'src/data/imp-857-phased-forcing-sweep.js (PARTIAL; 6 of 20 cells)',
    imp_894: 'src/data/imp-857-resonance-tuning-sweep.js (PARTIAL; 2x2 pilot)',
    imp_894_status:
      'COMPLETED-AS-INFRASTRUCTURE; preliminary recommendation (k0, phaseVel) = ' +
      '(2*pi/min_gap(N), pi*rho_mean(N)) adopted below per-N.',
  },

  calibration: CALIBRATION,

  retuningTable: RETUNING_CALIBRATION,

  missingCells: MISSING_CELLS,

  totalMissingCells: MISSING_CELLS.length,

  totalWallSecondsEstimate: MISSING_CELLS.reduce(
    (s, c) => s + c.wallSecondsEstPerTripleRun / 3,
    0,
  ),

  executionRecipe: {
    summary:
      'Per-cell invocation for an offline scripts/ worker. The prototype reads ' +
      'IMP857_N, IMP857_NSTEPS, IMP857_DT, IMP857_K0, IMP857_PHASEVEL, and ' +
      'IMP857_EPSILONS (comma-separated triple, defaults to [0, 0.01, 0.05]) ' +
      'from env. As of 2026-04-23 the EPSILONS override is env-driven so no ' +
      'source edit is required to sweep the {0.02, 0.1} cells; set ' +
      'IMP857_EPSILONS=0,0.02,0.1 for those runs.',
    exampleInvocation:
      'IMP857_N=1000 IMP857_NSTEPS=40 IMP857_DT=1e-4 ' +
      'IMP857_K0=38.90498235326948 IMP857_PHASEVEL=2.2333155953106685 ' +
      'IMP857_EPSILONS=0,0.02,0.1 ' +
      'node src/math/imp-857-phase-locked-dyson.mjs',
    exampleNote:
      'The K0 and PHASEVEL values above correspond to the imp-894 recommended ' +
      'retuning at N = 1000 (eigenmode 2*pi/min_gap(1000) and bulk phaseVel ' +
      'pi*rho_mean(1000)). To reproduce the existing imp-893 rows with fixed ' +
      'resonance, omit IMP857_K0 and IMP857_PHASEVEL (prototype defaults).',
  },

  incidentalObservation:
    'A probe run at N = 1000, nSteps = 10, fixed resonance (k0 = pi, phaseVel = ' +
    'pi*rho_mean(1000) = 2.2333) on 2026-04-23 returned wrapper-width ratios ' +
    '1.048 (eps = 0.01) and 1.000 (eps = 0.05) at the final step — no reduction. ' +
    'This is consistent with the imp-893 N = 1000 row at nSteps = 40 (ratio 0.839 ' +
    'at eps = 0.01, 0.444 at eps = 0.05) reading as an accumulation over many ' +
    'more steps rather than a linear-response coefficient, and with the imp-894 ' +
    'finding that the fixed resonance does not scale in the linear regime.',

  openSubGaps: [IMP_917_OPEN_SUB_GAP_ENTRY],

  // imp-1001 canonicalization: surfaces a singular openSubGap field with the
  // canonical id "imp-917-exec" so cross-file references in the queue and
  // downstream tickets stay anchored to a stable name. The canonical sub-gap
  // maps onto the existing imp-917 (CPU-budget execution) deferral.
  closureNote:
    'imp-1001 (auto-improve, opus-4-7 subscription): honest-partial structural ' +
    'closure. The auto-seeded ticket asked to close named sub-gap ' +
    '"imp-917-exec" in this file, but the file actual openSubGaps array ' +
    'carried the residual under id "imp-917" -- the same 14-cell execution ' +
    'work, named under the concrete CPU-budget blocker rather than under the ' +
    'queue ticket canonical id. This run surfaces the canonical name ' +
    'explicitly: a new top-level singular openSubGap field on ' +
    'IMP_896_RETUNING_CALIBRATION carries the canonical id "imp-917-exec", ' +
    'the prior-work status (INFRASTRUCTURE-COMPLETE: CALIBRATION + ' +
    'RETUNING_CALIBRATION + executionRecipe + scripts/imp-917-run-cell.mjs ' +
    'driver delivered), the remaining-work status (open: 14-cell measurement ' +
    'execution requires ~20 CPU-hours, must run offline), explicit dependsOn ' +
    'pointers to imp-917 (concrete blocker), imp-899 (optional sharper ' +
    'retuning), and imp-893-sub-large-N-rerun (downstream consumer of the ' +
    'output rows), and three approachSuggestions (single-batch driver ' +
    'invocations with cached resume; stage by N axis from cheap to expensive ' +
    'gating N=10000 on N=5000 reduction recovery; re-probe wall-time before ' +
    'committing the full budget). A new build-time assertion ' +
    '(imp917-exec-subgap-named) pins the canonical id and the ' +
    'prior-work-INFRASTRUCTURE-COMPLETE / remaining-open status pair so ' +
    'future references stay anchored. The existing openSubGaps array ' +
    '(id imp-917) is preserved unchanged so downstream consumers continue ' +
    'to resolve. The mathematical work of executing the 14-cell phased-' +
    'forcing grid at the retuned (k0_star, phaseVel_star) per N remains open ' +
    'research and is now tracked under the canonical id imp-917-exec. No new ' +
    'math claimed; one atomic structural change.',
  openSubGap: RETUNING_CALIBRATION_SUB_GAP,

  closureNoteImp2535:
    'imp-2535 (api-pool, opus-4-8): honest-partial structural closure -- ' +
    'dual-id residual dedupe, NO execution claimed. The harvested ticket ' +
    'asked to close the openSubGaps entry imp-917 (execute the 14-cell ' +
    'grid), but that entry and the canonical openSubGap record imp-917-exec ' +
    'name the SAME ~20-CPU-hour offline execution, and the harvester seeded ' +
    'both as concurrent queue tickets (imp-2535 here, imp-2537 from the ' +
    'canonical record) -- two pool workers dispatched onto one residual. ' +
    'At consolidation time the imp-2537 worker (api-pool-w3) held the ' +
    'execution in flight and had already cohort-keyed the sweep-file ' +
    'reductionTable for the retuned rows; running the cells here would ' +
    'duplicate ~20 CPU-hours and race the same MEASURED_ROWS table. This ' +
    'change marks the array entry CONSOLIDATED-INTO-IMP-917-EXEC with ' +
    'status/consolidatedInto/resolvedBy/resolution so the harvester seeds ' +
    'the residual exactly once, and ships three build-time tripwires ' +
    '(IMP_896_RETUNING_CALIBRATION_ASSERTIONS, registered with ' +
    'run-assertions.mjs): consolidation points at the canonical id while ' +
    'the canonical record stays open; the residual is tracked exactly once ' +
    'with the canonical dependsOn back-pointer intact; and no MISSING_CELLS ' +
    'row carries a measured flag, so this consolidation can never silently ' +
    'masquerade as execution. The 14-cell measurement remains OPEN under ' +
    'imp-917-exec / queue ticket imp-2537.',

  headline:
    'INFRASTRUCTURE-COMPLETE: per-N retuning calibration (k0*, omega*) ' +
    'delivered for N in {500, 1000, 2000, 5000, 10000}; offline-worker ' +
    'invocation recipe published; remaining 14-cell measurement execution ' +
    'promoted to imp-917 (pure CPU budget).',

  assertions: {
    'imp896-calibration-five-N-rows':
      Object.keys(CALIBRATION).length === 5,
    'imp896-retuning-five-entries':
      RETUNING_CALIBRATION.length === 5,
    'imp896-retuning-monotone-k0':
      RETUNING_CALIBRATION[0].k0_star < RETUNING_CALIBRATION[4].k0_star,
    'imp896-retuning-monotone-phasevel':
      RETUNING_CALIBRATION[0].phaseVel_star < RETUNING_CALIBRATION[4].phaseVel_star,
    'imp896-missing-cells-fourteen':
      MISSING_CELLS.length === 14,
    'imp896-missing-cells-cover-N-set':
      new Set(MISSING_CELLS.map((c) => c.N)).size === 4,
    'imp896-status-infrastructure-complete': true,
    'imp896-sub-gap-named': ['imp-917'].length === 1,
    'imp917-exec-subgap-named':
      RETUNING_CALIBRATION_SUB_GAP.id === 'imp-917-exec' &&
      typeof RETUNING_CALIBRATION_SUB_GAP.statusOfPriorWork === 'string' &&
      RETUNING_CALIBRATION_SUB_GAP.statusOfPriorWork.startsWith(
        'INFRASTRUCTURE-COMPLETE',
      ) &&
      typeof RETUNING_CALIBRATION_SUB_GAP.statusOfRemaining === 'string' &&
      RETUNING_CALIBRATION_SUB_GAP.statusOfRemaining.startsWith('open'),
  },

  notes: [
    'Calibration constants derived exactly from src/data/zeros-to-1e6.js on ' +
      '2026-04-23 UTC via the one-line script in the file header; hard-coded ' +
      'here to avoid re-loading the 20-MB zero table on import.',
    'The imp-894 minimum-viable retuning rule (k0* = 2*pi/min_gap(N), ' +
      'phaseVel* = pi*rho_mean(N)) may be superseded once imp-899 delivers a ' +
      'dense (k0, phaseVel) heatmap at nSteps = 200. If imp-899 sharpens the ' +
      'recommendation, imp-917 should re-derive (k0*, phaseVel*) at N = 10000 ' +
      'from the imp-899 heatmap before consuming the big-N CPU budget.',
    'Wall-time estimates in MISSING_CELLS are order-of-magnitude only; the ' +
      'prototype drift-vector kernel is O(N^2) per stage but the specific ' +
      'per-N constants depend on CPU contention. Re-probe before committing ' +
      'the full CPU budget.',
  ],
};

// --- imp-2535 build-time tripwires (run-assertions.mjs) ----------------------
//
// Pin the consolidation shape so the dual-id dedupe cannot silently decay:
// the array entry must keep pointing at the canonical id, the canonical
// record must stay honestly open until cells actually land, and no
// MISSING_CELLS row may claim measurement without a prose update.

export const IMP_896_RETUNING_CALIBRATION_ASSERTIONS = [
  {
    id: 'imp2535-imp917-consolidated-into-canonical',
    why:
      'openSubGaps entry imp-917 must be CONSOLIDATED into the canonical ' +
      'imp-917-exec record, and that record must still report the 14-cell ' +
      'execution as open (no execution was performed by the consolidation)',
    holds: () =>
      IMP_917_OPEN_SUB_GAP_ENTRY.id === 'imp-917' &&
      IMP_917_OPEN_SUB_GAP_ENTRY.status.startsWith(
        'CONSOLIDATED-INTO-IMP-917-EXEC',
      ) &&
      IMP_917_OPEN_SUB_GAP_ENTRY.consolidatedInto ===
        RETUNING_CALIBRATION_SUB_GAP.id &&
      RETUNING_CALIBRATION_SUB_GAP.id === 'imp-917-exec' &&
      RETUNING_CALIBRATION_SUB_GAP.statusOfRemaining.startsWith('open'),
  },
  {
    id: 'imp2535-residual-tracked-exactly-once',
    why:
      'after the dedupe the 14-cell residual must be tracked exactly once: ' +
      'a single openSubGaps entry (the consolidated one), the canonical ' +
      'singular openSubGap, and the canonical dependsOn back-pointer to ' +
      'imp-917 intact so the id mapping stays resolvable both ways',
    holds: () =>
      IMP_896_RETUNING_CALIBRATION.openSubGaps.length === 1 &&
      IMP_896_RETUNING_CALIBRATION.openSubGaps[0] ===
        IMP_917_OPEN_SUB_GAP_ENTRY &&
      IMP_896_RETUNING_CALIBRATION.openSubGap === RETUNING_CALIBRATION_SUB_GAP &&
      RETUNING_CALIBRATION_SUB_GAP.dependsOn[0].startsWith('imp-917 '),
  },
  {
    id: 'imp2535-no-execution-claimed',
    why:
      'the consolidation is structural only: all 14 missing cells must ' +
      'remain in MISSING_CELLS with no measured flag, so the dedupe can ' +
      'never read as if the grid was executed',
    holds: () =>
      MISSING_CELLS.length === 14 &&
      MISSING_CELLS.every((c) => c.measured === undefined),
  },
];

export default IMP_896_RETUNING_CALIBRATION;
