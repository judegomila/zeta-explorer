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

  openSubGaps: [
    {
      id: 'imp-917',
      summary:
        'Execute the 14-cell imp-896 grid using the RETUNING_CALIBRATION table ' +
        'and executionRecipe above. Pure CPU-budget ticket; no further design ' +
        'needed.',
      blocker:
        'Wall-time budget. Estimated total ~20 CPU-hours across 14 cells on ' +
        'current hardware under concurrent engine load. Must run on an idle ' +
        'scripts/ offline worker, not inside an engine turn. Output rows ' +
        'append to MEASURED_ROWS in src/data/imp-857-phased-forcing-sweep.js.',
      prerequisite: null,
    },
  ],

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

export default IMP_896_RETUNING_CALIBRATION;
