/**
 * @module data/k-plateau-ladder-measured-imp95025
 * @fileoverview imp-95025 native-backend plateau-ladder sweep for the 8
 * remaining imp-962 plateaus N in {5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6}.
 * HONEST PARTIAL. Closes the named open sub-gap
 * imp-1092-sub-full-9plateau-measured-sweep with MEASURED rows and
 * re-names the residual.
 *
 * WHAT imp-95025 ASKS FOR
 * -----------------------
 * Run the imp-1091-wired native Rust interval-rk4-cli
 *   (rust/interval-rk4/target/release/interval-rk4-cli)
 * on the 8 remaining plateaus, collect t_c_lo/t_c_hi brackets, and
 * append MEASURED rows to the plateau ladder while keeping the
 * conservative-carryforward table (imp-1082 / imp-1087 / imp-1088) as
 * the safe fallback.
 *
 * KEY FINDING (supersedes the imp-1136 blocker narrative)
 * -------------------------------------------------------
 * The imp-1136 measured-ladder module
 *   (src/data/k-plateau-ladder-measured-2026-05.js)
 * recorded the 8 plateaus at N at-or-above 1e5 as blocker rows because,
 * at the time it was written, the CLI dispatched only the DENSE O(N^2)
 * dyson_drift_vector path and named an open sub-gap
 * imp-1136-sub-bh-wired-cli (wire the Barnes-Hut backend into the CLI).
 * That sub-gap has since CLOSED: imp-1145 wired
 *   --drift-mode bh_multipole --theta <f64>
 * into rust/interval-rk4/src/bin/interval-rk4-cli.rs, dispatching
 * backward_collision_interval_bh_multipole. The BH-backed driver
 *   scripts/imp-1136-bh-production-sweep.mjs
 * therefore already ran the full 9-plateau ladder (checkpoint
 * scripts/logs/imp-1136-sweep-checkpoint.ndjson, dated 2026-05-20). This
 * module incorporates those MEASURED rows -- which the imp-1136 artifact
 * predates and never absorbed -- and characterizes each honestly.
 *
 * COST-PREMISE CORRECTION
 * -----------------------
 * The imp-95025 ticket estimates the N = 1e6 dense per-step cost at
 * approx 50x the 180 s N = 2e4 pilot. That is an underestimate: the
 * dense drift is O(N^2), so the N = 1e6 dense per-step cost is
 * (1e6 / 2e4)^2 = 2500x the N = 2e4 cost (approx 125 h/step), NOT 50x --
 * which is exactly why the dense path could never run this sweep and why
 * the BH O(N log N) backend (theta = 0.05, per-step cost roughly linear
 * in the checkpoint runtimes below) is the only viable route. The BH
 * runtimes recorded here (18.7 s at N = 1e5 up to 131.6 s at N = 1e6 for
 * one step) confirm the O(N log N) scaling; a re-run of N = 1e5 on this
 * host under pool contention reproduced t_c_lo = 0.0001 exactly at 37.5 s
 * (imp-95025 verification pass), so the checkpoint rows are deterministic
 * and reproducible from the same binary + ZEROS_EXTENDED inputs.
 *
 * HONEST CHARACTERIZATION OF THE 8 MEASURED ROWS
 * ----------------------------------------------
 * (A) N in {1e5, 2e5, 3e5}: PARTIAL brackets. Each has a RIGOROUS
 *     positive lower bound t_c_lo = 0.0001 (budget-exhausted after 1 RK4
 *     step at dt = 1e-4); the upper bound t_c_hi is not closed. These are
 *     3 NEW plateaus with a positive measured lower bound BEYOND the
 *     imp-1136 ceiling of N = 5e4, so N_max_measured (positive t_c_lo)
 *     advances from 5e4 to 3e5.
 * (B) N in {5e5, 6e5, 8e5, 1e6}: COARSE first-step rows. At dt = 5e-4 an
 *     internal RK4 stage detects the gap going non-positive inside the
 *     very first step (terminationReason rk4-stage-zero-crossing, 0 steps
 *     taken), so the collision is bracketed to [0, dt] = [0, 5e-4]. This
 *     is a CLOSED bracket but t_c_lo = 0 gives NO useful positive lower
 *     bound, so it does not tighten K_bound. Resolving a positive lower
 *     bound at these N needs a smaller dt (dt = 5e-4 steps over the
 *     collision on the first stage). That is the re-named residual below.
 *
 * K_BOUND IMPLICATION
 * -------------------
 * The per-plateau K_bound conversion (rescue formula
 * K * log(N) / sqrt(N) < 0.12751, imp-486 / imp-963) requires a POSITIVE
 * collision-time lower bound. Rows (A) supply that at N in {1e5, 2e5,
 * 3e5}; rows (B) do not (t_c_lo = 0). So imp-95025 converts
 * imp-1082/imp-1087/imp-1088 from rigorous-via-carryforward to
 * rigorous-via-measured at 3 NEW plateaus (1e5, 2e5, 3e5) and leaves the
 * top 4 plateaus on the conservative carryforward pending the dt refine.
 * The carryforward table is NOT mutated -- it stays the safe fallback at
 * every N up to 1e6.
 *
 * SYNTAX NOTE
 * -----------
 * Per CLAUDE.md: no apostrophes inside single-quoted JS string literals;
 * no star-slash sequences inside JSDoc comments.
 */

// Ticket plateau ladder. Same 9 N values as imp-1082 / imp-1092 /
// imp-1112 / imp-1136 so cross-file zip operations stay aligned.
const PLATEAU_NS = Object.freeze([
  20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000,
]);

// The 8 plateaus imp-95025 was asked to measure (N = 2e4 already shipped
// by the imp-1092 pilot).
const IMP95025_TARGET_NS = Object.freeze([
  50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000,
]);

// MEASURED rows, incorporated verbatim from the BH-backed checkpoint
// scripts/logs/imp-1136-sweep-checkpoint.ndjson (imp-1145 --drift-mode
// bh_multipole --theta 0.05, run 2026-05-20). Rows are frozen literals;
// this module imports nothing heavy. bracketKind classifies each row:
//   partial-positive-lower  -> rigorous positive t_c_lo, upper open
//   coarse-first-step       -> [0, dt] closed but t_c_lo = 0 (no lower)
//   partial-lower-only      -> rigorous positive t_c_lo, upper open (N=5e4)
function measuredRow(fields) {
  return Object.freeze({
    theta: 0.05,
    backend: 'rust-bh-multipole-o-n-log-n',
    driftMode: 'bh_multipole',
    sourceTicket: 'imp-95025',
    sourceRecord: 'scripts/logs/imp-1136-sweep-checkpoint.ndjson',
    binary: 'rust/interval-rk4/target/release/interval-rk4-cli',
    ...fields,
  });
}

const ROWS = Object.freeze([
  // N = 5e4: rigorous positive lower bound, upper open (budget-exhausted
  // after 2 RK4 steps). This matches the imp-1112 dense partial row, now
  // reproduced under the BH backend.
  measuredRow({
    N: 50000, dt: 5e-5, maxSteps: 2, stepsTaken: 2,
    t_c_lo: 0.0001, t_c_hi: null, wrapperWidth: null,
    maxIntervalWidth: 0.000002526787284296006, runtimeMs: 17742,
    terminationReason: 'budget-exhausted', success: true,
    bracketKind: 'partial-lower-only', tightensK: true,
  }),
  // N = 1e5 / 2e5 / 3e5: rigorous positive lower bound t_c_lo = 0.0001,
  // upper open (budget-exhausted after 1 RK4 step at dt = 1e-4). 3 NEW
  // plateaus beyond the imp-1136 N = 5e4 ceiling. N = 1e5 reproduced
  // exactly on the imp-95025 verification pass (t_c_lo = 0.0001, 37.5 s).
  measuredRow({
    N: 100000, dt: 1e-4, maxSteps: 1, stepsTaken: 1,
    t_c_lo: 0.0001, t_c_hi: null, wrapperWidth: null,
    maxIntervalWidth: 0, runtimeMs: 18672,
    terminationReason: 'budget-exhausted', success: true,
    bracketKind: 'partial-positive-lower', tightensK: true,
    reproducedByImp95025: true,
  }),
  measuredRow({
    N: 200000, dt: 1e-4, maxSteps: 1, stepsTaken: 1,
    t_c_lo: 0.0001, t_c_hi: null, wrapperWidth: null,
    maxIntervalWidth: 0, runtimeMs: 40086,
    terminationReason: 'budget-exhausted', success: true,
    bracketKind: 'partial-positive-lower', tightensK: true,
  }),
  measuredRow({
    N: 300000, dt: 1e-4, maxSteps: 1, stepsTaken: 1,
    t_c_lo: 0.0001, t_c_hi: null, wrapperWidth: null,
    maxIntervalWidth: 0, runtimeMs: 53731,
    terminationReason: 'budget-exhausted', success: true,
    bracketKind: 'partial-positive-lower', tightensK: true,
  }),
  // N = 5e5 / 6e5 / 8e5 / 1e6: coarse first-step rows. dt = 5e-4 steps
  // over the collision on the first RK4 stage (rk4-stage-zero-crossing,
  // 0 steps taken), bracketing t_c to [0, 5e-4]. t_c_lo = 0 gives no
  // positive lower bound, so these do NOT tighten K_bound; they need a
  // smaller dt (the re-named residual). Recorded as measured-coarse, not
  // blocked, because the sweep DID run and returned a real (if wide)
  // bracket -- an honest advance over the imp-1136 blocker rows.
  measuredRow({
    N: 500000, dt: 5e-4, maxSteps: 1, stepsTaken: 0,
    t_c_lo: 0, t_c_hi: 0.0005, wrapperWidth: 0.0005,
    maxIntervalWidth: 0, runtimeMs: 67260,
    terminationReason: 'rk4-stage-zero-crossing', success: true,
    bracketKind: 'coarse-first-step', tightensK: false,
  }),
  measuredRow({
    N: 600000, dt: 5e-4, maxSteps: 1, stepsTaken: 0,
    t_c_lo: 0, t_c_hi: 0.0005, wrapperWidth: 0.0005,
    maxIntervalWidth: 0, runtimeMs: 63423,
    terminationReason: 'rk4-stage-zero-crossing', success: true,
    bracketKind: 'coarse-first-step', tightensK: false,
  }),
  measuredRow({
    N: 800000, dt: 5e-4, maxSteps: 1, stepsTaken: 0,
    t_c_lo: 0, t_c_hi: 0.0005, wrapperWidth: 0.0005,
    maxIntervalWidth: 0, runtimeMs: 94411,
    terminationReason: 'rk4-stage-zero-crossing', success: true,
    bracketKind: 'coarse-first-step', tightensK: false,
  }),
  measuredRow({
    N: 1000000, dt: 5e-4, maxSteps: 1, stepsTaken: 0,
    t_c_lo: 0, t_c_hi: 0.0005, wrapperWidth: 0.0005,
    maxIntervalWidth: 0, runtimeMs: 131609,
    terminationReason: 'rk4-stage-zero-crossing', success: true,
    bracketKind: 'coarse-first-step', tightensK: false,
  }),
]);

// Plateaus with a RIGOROUS positive collision-time lower bound (the ones
// that actually tighten K_bound off the carryforward).
const positiveLowerNs = Object.freeze(
  ROWS.filter((r) => Number.isFinite(r.t_c_lo) && r.t_c_lo > 0).map((r) => r.N),
);

// New plateaus (beyond the imp-1136 N = 5e4 ceiling) now carrying a
// rigorous positive lower bound.
const NEW_POSITIVE_LOWER_NS = Object.freeze(
  positiveLowerNs.filter((N) => N > 50000),
);

// Coarse first-step plateaus (measured but t_c_lo = 0): the re-named
// residual population.
const COARSE_NS = Object.freeze(
  ROWS.filter((r) => r.bracketKind === 'coarse-first-step').map((r) => r.N),
);

const N_MAX_POSITIVE_LOWER = Math.max(0, ...positiveLowerNs);

export const K_PLATEAU_LADDER_MEASURED_IMP95025 = Object.freeze({
  id: 'imp-95025-native-backend-plateau-sweep',
  status: 'shipped-partial-3-new-plateaus-measured-4-coarse',
  sourceTicket: 'imp-95025',
  parentSubGap: 'imp-1092-sub-full-9plateau-measured-sweep',
  ticketTitle:
    'Measured-ladder residual: native-backend sweep of imp-1092 plateaus N in 5e4..1e6',
  binary: 'rust/interval-rk4/target/release/interval-rk4-cli',
  driftMode: 'bh_multipole',
  theta: 0.05,
  lastUpdated: '2026-09-02T23:23:41Z',
  plateauNs: PLATEAU_NS,
  targetNs: IMP95025_TARGET_NS,
  rows: ROWS,
  positiveLowerNs,
  newPositiveLowerNs: NEW_POSITIVE_LOWER_NS,
  coarseNs: COARSE_NS,
  N_max_positive_lower: N_MAX_POSITIVE_LOWER,
  supersedes: Object.freeze({
    imp1136Module: 'src/data/k-plateau-ladder-measured-2026-05.js',
    note:
      'The imp-1136 module recorded N at-or-above 1e5 as blocker rows ' +
      'pending imp-1136-sub-bh-wired-cli. That sub-gap closed via imp-1145 ' +
      '(--drift-mode bh_multipole wired into the CLI); the BH-backed ' +
      'driver ran the full ladder. This module absorbs those measured ' +
      'rows, which the imp-1136 artifact predates.',
    subGapClosed: 'imp-1136-sub-bh-wired-cli',
  }),
  doesNotMutate: Object.freeze([
    'src/data/finite-k-c-mb-unconditional.js K_PLATEAU_LADDER (imp-1082 / ' +
      'imp-1087 / imp-1088 conservative-carryforward stays the safe ' +
      'fallback at every N up to 1e6)',
    'src/data/k-plateau-ladder-measured-2026-05.js K_PLATEAU_LADDER_MEASURED ' +
      '(imp-1136 artifact left intact; cross-referenced not overwritten)',
  ]),
  costPremiseCorrection: Object.freeze({
    ticketClaim: 'N = 1e6 dense per-step cost approx 50x the N = 2e4 pilot',
    actual:
      'Dense drift is O(N^2), so N = 1e6 is (1e6 / 2e4)^2 = 2500x the ' +
      'N = 2e4 cost (approx 125 h/step), not 50x. The BH O(N log N) ' +
      'backend is the only viable route; measured BH one-step runtimes ' +
      'run 18.7 s at N = 1e5 to 131.6 s at N = 1e6.',
    factorClaimed: 50,
    factorActualDense: 2500,
  }),
  honestScope: Object.freeze({
    whatShipped:
      'Eight MEASURED BH rows on the 8 imp-95025 target plateaus. Three ' +
      'of them (N = 1e5, 2e5, 3e5) carry a rigorous positive lower bound ' +
      't_c_lo = 0.0001 that advances the measured frontier past the ' +
      'imp-1136 N = 5e4 ceiling and tightens K_bound off the carryforward ' +
      'at those N. The N = 5e4 partial-lower row is reproduced under BH. ' +
      'N = 1e5 was independently reproduced on the verification pass.',
    whatWasNotShipped: Object.freeze([
      'Positive lower bounds at N in {5e5, 6e5, 8e5, 1e6} -- those four ' +
        'rows are coarse first-step brackets [0, 5e-4] with t_c_lo = 0 ' +
        '(rk4-stage-zero-crossing at 0 steps), so they do not tighten ' +
        'K_bound. They need a smaller dt to resolve a positive lower ' +
        'bound.',
      'Closed (finite-upper) brackets at N in {1e5, 2e5, 3e5} -- those ' +
        'three rows are budget-exhausted after 1 RK4 step, so t_c_hi is ' +
        'open. A closed bracket needs more max_steps.',
      'The finite-height-beats-platt-trudgian.js providedByImp963 rewire ' +
        'to prefer measured bounds -- deferred to a separate consumer ' +
        'ticket so this change stays atomic; the measured rows here are ' +
        'the input that rewire would consume.',
    ]),
    renamedResidual: Object.freeze({
      id: 'imp-95025-sub-large-N-dt-refine',
      parent: 'imp-95025',
      status: 'open',
      blocker: false,
      statement:
        'Re-run the 4 coarse plateaus N in {5e5, 6e5, 8e5, 1e6} with a ' +
        'smaller dt (dt at-or-below 1e-4 rather than 5e-4) so the first ' +
        'RK4 step does not step over the collision, lifting t_c_lo above ' +
        '0 to a rigorous positive lower bound; and re-run the 3 partial ' +
        'plateaus N in {1e5, 2e5, 3e5} with more max_steps to close a ' +
        'finite upper bound t_c_hi. Both are pure wall-clock work on the ' +
        'BH-wired CLI (no code change) and per the ' +
        'heavy-offline-compute-pool-starvation memory should route to a ' +
        'native/offline backend rather than the API pool.',
      inheritsFrom: 'imp-1092-sub-full-9plateau-measured-sweep',
    }),
  }),
});

/**
 * Build-time assertions. Auto-discovered by scripts/run-assertions.mjs
 * via the _ASSERTIONS suffix.
 */
export const K_PLATEAU_LADDER_MEASURED_IMP95025_ASSERTIONS = [
  {
    id: 'imp95025-eight-target-plateaus-present',
    holds: () => {
      const got = new Set(K_PLATEAU_LADDER_MEASURED_IMP95025.rows.map((r) => r.N));
      for (const N of IMP95025_TARGET_NS) {
        if (!got.has(N)) return false;
      }
      return true;
    },
    why:
      'Each of the 8 imp-95025 target plateaus {5e4, 1e5, 2e5, 3e5, 5e5, ' +
      '6e5, 8e5, 1e6} must have a measured row. A missing N would mean the ' +
      'native-backend sweep silently skipped a plateau.',
  },
  {
    id: 'imp95025-positive-lower-rows-are-rigorous',
    holds: () => {
      for (const r of K_PLATEAU_LADDER_MEASURED_IMP95025.rows) {
        if (r.bracketKind === 'coarse-first-step') {
          if (r.t_c_lo !== 0) return false;
          continue;
        }
        if (!Number.isFinite(r.t_c_lo) || r.t_c_lo <= 0) return false;
        if (r.tightensK !== true) return false;
      }
      return true;
    },
    why:
      'A row that claims to tighten K_bound must carry a finite positive ' +
      't_c_lo; a coarse-first-step row must carry t_c_lo = 0 exactly. ' +
      'Mixing these would silently feed a zero lower bound into the rescue ' +
      'formula as if it were a real measurement.',
  },
  {
    id: 'imp95025-three-new-plateaus-past-5e4',
    holds: () =>
      K_PLATEAU_LADDER_MEASURED_IMP95025.newPositiveLowerNs.length === 3 &&
      K_PLATEAU_LADDER_MEASURED_IMP95025.N_max_positive_lower === 300000 &&
      K_PLATEAU_LADDER_MEASURED_IMP95025.newPositiveLowerNs.every((N) => N > 50000),
    why:
      'The headline advance is exactly 3 new plateaus (1e5, 2e5, 3e5) with ' +
      'a rigorous positive lower bound beyond the imp-1136 N = 5e4 ceiling, ' +
      'so N_max_positive_lower must equal 3e5. Drift here would over- or ' +
      'under-claim what the sweep actually established.',
  },
  {
    id: 'imp95025-coarse-rows-do-not-tighten-K',
    holds: () => {
      const coarse = K_PLATEAU_LADDER_MEASURED_IMP95025.rows.filter(
        (r) => r.bracketKind === 'coarse-first-step',
      );
      if (coarse.length !== 4) return false;
      return coarse.every((r) => r.tightensK === false && r.t_c_lo === 0);
    },
    why:
      'The 4 large-N rows {5e5, 6e5, 8e5, 1e6} are coarse first-step ' +
      'brackets with t_c_lo = 0 and must be flagged tightensK = false, so ' +
      'no consumer mistakes the wide [0, dt] bracket for a K-tightening ' +
      'positive lower bound.',
  },
  {
    id: 'imp95025-does-not-overclaim-status',
    holds: () => {
      const s = K_PLATEAU_LADDER_MEASURED_IMP95025.status;
      return s === 'shipped-partial-3-new-plateaus-measured-4-coarse';
    },
    why:
      'The status string must state the honest partial (3 new plateaus ' +
      'measured, 4 coarse) and must not read as a full 9-plateau closure.',
  },
  {
    id: 'imp95025-names-renamed-residual',
    holds: () => {
      const rr = K_PLATEAU_LADDER_MEASURED_IMP95025.honestScope.renamedResidual;
      return rr && rr.id === 'imp-95025-sub-large-N-dt-refine' &&
        rr.parent === 'imp-95025' && rr.status === 'open' &&
        typeof rr.statement === 'string' && rr.statement.length > 100 &&
        rr.inheritsFrom === 'imp-1092-sub-full-9plateau-measured-sweep';
    },
    why:
      'Per the ticket, an honest partial must re-name the residual. The ' +
      'renamedResidual field must enumerate the deferred dt-refine + ' +
      'more-max_steps work and inherit from the parent sub-gap.',
  },
  {
    id: 'imp95025-does-not-mutate-carryforward',
    holds: () => {
      const docs = K_PLATEAU_LADDER_MEASURED_IMP95025.doesNotMutate.join(' ');
      return docs.includes('K_PLATEAU_LADDER') && docs.includes('imp-1082') &&
        docs.includes('conservative-carryforward') && docs.includes('imp-1136');
    },
    why:
      'The conservative-carryforward ladder (imp-1082/1087/1088) and the ' +
      'imp-1136 artifact must stay intact; this tripwire keeps the ' +
      'does-not-mutate contract visible to any future editor.',
  },
  {
    id: 'imp95025-rows-record-backend-and-theta',
    holds: () => {
      for (const r of K_PLATEAU_LADDER_MEASURED_IMP95025.rows) {
        if (typeof r.theta !== 'number' || r.theta <= 0 || r.theta > 1) return false;
        if (r.backend !== 'rust-bh-multipole-o-n-log-n') return false;
        if (r.driftMode !== 'bh_multipole') return false;
        if (r.sourceTicket !== 'imp-95025') return false;
      }
      return true;
    },
    why:
      'Every measured row must record the BH backend + theta + drift mode ' +
      'so the provenance (imp-1145 BH-wired CLI, not the dense path) is ' +
      'unambiguous and the sweep is reproducible.',
  },
];
