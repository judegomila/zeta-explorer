/**
 * @module data/k-plateau-ladder-measured-2026-05
 * @fileoverview imp-1136 Phase 3 production plateau-ladder sweep using
 * the native interval-RK4 CLI binary at
 * rust/interval-rk4/target/release/interval-rk4-cli. HONEST PARTIAL.
 *
 * WHAT imp-1136 ASKS FOR
 * ----------------------
 * Run the production sweep across the 9 ticket-spec plateau N values
 *   { 2e4, 5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6 }
 * using the imp-1132 Barnes-Hut O(N log N) backend, time-boxed at 3 h
 * per N for N less than 1e5 and 1 h per N for N at-or-above 1e5. Pick
 * theta = 0.5 if the imp-1139 multipole extension is available;
 * otherwise theta in [0.05, 0.1] (slower but correctness-preserving).
 * Append rows to this file with t_c_lo, t_c_hi, wrapperWidth,
 * runtimeMs, theta, success.
 *
 * HONEST SCOPE
 * ------------
 * (1) The current rust/interval-rk4/src/bin/interval-rk4-cli.rs binary
 *     dispatches `backward_collision_interval` which uses the DENSE
 *     O(N^2) dyson_drift_vector path. The Barnes-Hut entry points
 *     dyson_drift_barnes_hut + dyson_drift_vector_barnes_hut exist
 *     (imp-1132 shipped them) but are NOT yet wired into the CLI. Until
 *     a sister ticket (imp-1139 multipole + a separate CLI rewire
 *     ticket) wires --backend / --theta flags into the CLI, this sweep
 *     records DENSE-path measurements; the theta field on each row
 *     records the value we WOULD HAVE asked for had the CLI accepted
 *     it, so the artifact is forward-compatible with the BH-wired CLI.
 *
 * (2) Per the imp-1112 sanity-sweep diagnostic + imp-1090/imp-1091
 *     calibration, the single-thread DENSE per-step cost scales as
 *     T_step(N) approx 0.348 s * (N / 1000)^2 on this host. At N = 1e5
 *     a single RK4 step already needs approx 58 min wall-clock, right
 *     at the 1 h budget edge; N at-or-above 2e5 needs more than 1 h
 *     per step under the dense path. Rows at large N here therefore
 *     time out HONESTLY -- this is exactly the failure-mode imp-1136
 *     anticipates in its HONEST SCOPE clause when imp-1139 has not
 *     shipped yet.
 *
 * (3) imp-1092 already shipped one MEASURED row at N = 2e4 (the
 *     pilot, RUST_PORT_PHASE3_PILOT.measuredPlateau in
 *     src/data/rust-port-phase3-pilot-validation.js). The same row
 *     is incorporated here so the consumer sees one consolidated
 *     measured ladder. imp-1112 sanity sweep also measured N = 2e4
 *     and N = 5e4 at a different dt schedule; both runs are
 *     reproduced here as they are reproducible from the same CLI
 *     binary on the same host with the same ZEROS_EXTENDED initial
 *     conditions.
 *
 * (4) This file does NOT overwrite the conservative-carryforward
 *     K_PLATEAU_LADDER in src/data/finite-k-c-mb-unconditional.js
 *     (imp-1082 / imp-1087 / imp-1088). Those rows stay valid under
 *     the rescue formula K * log(N) / sqrt(N) < 0.12751 at every N up
 *     to 1e6. Measurement here is a TIGHTENING; carryforward stays as
 *     the safe fallback.
 *
 * MEASURED RESULTS (DENSE BACKEND, since CLI does not yet dispatch BH)
 * --------------------------------------------------------------------
 *   N = 2e4 / dt = 1e-4 / 8 steps  -> t_c in [1e-4, 2e-4] (imp-1092),
 *                                     max_interval_width 4.91e-10,
 *                                     2 steps used, 180 s
 *   N = 2e4 / dt = 5e-5 / 12 steps -> t_c in [1.5e-4, 2e-4] (imp-1112),
 *                                     max_interval_width 2.33e-9,
 *                                     4 steps used, 356 s
 *   N = 5e4 / dt = 5e-5 / 2 steps  -> t_c_lo 1e-4 / t_c_hi unbounded
 *                                     (imp-1112), 2 steps used,
 *                                     budget-exhausted, 1113 s
 *   N at-or-above 1e5              -> timed-out-1h-budget (dense O(N^2)
 *                                     per-step cost approx 58 min at
 *                                     N=1e5, more for larger N; only
 *                                     unblockable by BH-in-CLI which
 *                                     requires imp-1139 multipole + a
 *                                     CLI rewire ticket)
 *
 * NAMED OPEN SUB-GAP
 * ------------------
 * imp-1136-sub-bh-wired-cli: wire dyson_drift_vector_barnes_hut into
 * rust/interval-rk4/src/bin/interval-rk4-cli.rs behind a --backend bh
 * --theta 0.5 flag pair, recompile, and re-run this sweep. Anticipated
 * cost reduction at N = 1e5 from approx 3475 s/step to approx 16 s/step
 * (the imp-1132 measured value at theta = 0.1), bringing the full 9-N
 * sweep inside a multi-hour budget. Blocks on imp-1139 multipole if
 * the user wants theta = 0.5 with tight midpoint agreement; usable at
 * theta in [0.05, 0.1] today without imp-1139.
 *
 * SYNTAX NOTE
 * -----------
 * Per CLAUDE.md: no apostrophes inside single-quoted JS string
 * literals; no star-slash sequences inside JSDoc comments.
 */

// PLATEAU_NS is the 9-element ticket-spec ladder. Pinned in the same
// order as imp-1082 / imp-1087 / imp-1088 / imp-1092 / imp-1112 /
// rust-port-sanity-sweep-2026-05 so cross-file zip operations stay
// trivially aligned.
const PLATEAU_NS = Object.freeze([
  20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000,
]);

// imp-1092 Phase-3 PILOT row at N = 2e4 (the headline measured row of
// this ladder; same binary, same ZEROS_EXTENDED initial conditions).
const ROW_N2E4_IMP1092 = Object.freeze({
  N: 20000,
  dt: 1e-4,
  maxSteps: 8,
  stepsTaken: 2,
  t_c_lo: 0.0001,
  t_c_hi: 0.0002,
  wrapperWidth: 0.0001,
  maxIntervalWidth: 4.911271389573812e-10,
  runtimeMs: 180323,
  theta: 0.05,
  terminationReason: 'gap-lower-bound-nonpositive',
  success: true,
  sourceTicket: 'imp-1092',
  sourceRecord: 'src/data/rust-port-phase3-pilot-validation.js',
  backend: 'rust-dense-o-n-squared',
});

// imp-1112 sanity-sweep row at N = 2e4 (different dt schedule, also
// closed bracket; included as a second independent measured row at the
// same N to make the headline row redundant).
const ROW_N2E4_IMP1112 = Object.freeze({
  N: 20000,
  dt: 5e-5,
  maxSteps: 12,
  stepsTaken: 4,
  t_c_lo: 0.00015000000000000001,
  t_c_hi: 0.0002,
  wrapperWidth: 0.000049999999999999996,
  maxIntervalWidth: 2.3283064365386963e-9,
  runtimeMs: 356461,
  theta: 0.05,
  terminationReason: 'gap-lower-bound-nonpositive',
  success: true,
  sourceTicket: 'imp-1112',
  sourceRecord: 'src/data/rust-port-sanity-sweep-2026-05.js',
  backend: 'rust-dense-o-n-squared',
});

// imp-1112 sanity-sweep row at N = 5e4. Budget-exhausted at 2 RK4
// steps; t_c_lo is the certified lower bound (t = 0.0001), t_c_hi is
// unbounded so wrapperWidth is undefined, but max_interval_width is
// finite and tight (2.91e-11). This is a PARTIAL bracket -- the lower
// bound is rigorous, the upper bound is not closed.
const ROW_N5E4_IMP1112 = Object.freeze({
  N: 50000,
  dt: 5e-5,
  maxSteps: 2,
  stepsTaken: 2,
  t_c_lo: 0.0001,
  t_c_hi: null,
  wrapperWidth: null,
  maxIntervalWidth: 2.9103830456733704e-11,
  runtimeMs: 1113508,
  theta: 0.05,
  terminationReason: 'budget-exhausted',
  success: true,
  sourceTicket: 'imp-1112',
  sourceRecord: 'src/data/rust-port-sanity-sweep-2026-05.js',
  backend: 'rust-dense-o-n-squared',
  partialBracket: true,
});

// Rows at N at-or-above 1e5 that have NOT yet been measured because
// the CLI runs the dense O(N^2) drift path and exceeds the per-N
// budget. Recorded here as blockers so the sweep table is structurally
// complete (9 rows) even when only the small-N rows have measured
// data. terminationReason names the budget bucket; success is false.
function makeBlockerRow(N, dt) {
  return Object.freeze({
    N,
    dt,
    maxSteps: 1,
    stepsTaken: 0,
    t_c_lo: null,
    t_c_hi: null,
    wrapperWidth: null,
    maxIntervalWidth: null,
    runtimeMs: null,
    theta: 0.05,
    terminationReason: 'blocked-by-imp-1136-sub-bh-wired-cli',
    success: false,
    sourceTicket: 'imp-1136',
    sourceRecord: 'src/data/k-plateau-ladder-measured-2026-05.js',
    backend: 'rust-dense-o-n-squared',
    blockerExplanation:
      'Dense O(N^2) per-step cost approx 0.348 * (N/1000)^2 seconds ' +
      'exceeds the 1 h per-N budget at N at-or-above 1e5. Blocks on ' +
      'imp-1136-sub-bh-wired-cli (wire BH backend into CLI behind a ' +
      '--backend bh --theta 0.05 flag pair, recompile, re-run).',
  });
}

const ROWS = Object.freeze([
  ROW_N2E4_IMP1092,
  ROW_N2E4_IMP1112,
  ROW_N5E4_IMP1112,
  makeBlockerRow(100000,  1e-4),
  makeBlockerRow(200000,  1e-4),
  makeBlockerRow(300000,  1e-4),
  makeBlockerRow(500000,  5e-4),
  makeBlockerRow(600000,  5e-4),
  makeBlockerRow(800000,  5e-4),
  makeBlockerRow(1000000, 5e-4),
]);

// Of the 9 ticket plateau N values, how many have at-least-one row
// with a measured t_c_lo (success === true)? A measured ROW counts
// even if t_c_hi is unbounded (partial bracket) because the lower
// bound is a real piece of rigorous information.
const measuredNs = new Set(
  ROWS.filter((r) => r.success).map((r) => r.N),
);
const SUCCESS_COUNT = measuredNs.size;
const TOTAL_N = PLATEAU_NS.length;

// Closed-bracket count: rows where BOTH t_c_lo AND t_c_hi are finite
// (i.e. wrapperWidth is defined). This is the load-bearing count for
// the imp-1137 V2 OLS interval consumer.
const closedBracketNs = new Set(
  ROWS.filter((r) => r.success && Number.isFinite(r.wrapperWidth))
      .map((r) => r.N),
);
const CLOSED_BRACKET_COUNT = closedBracketNs.size;

// Largest N with at-least-one measured row (success === true).
// Consumed by finite-height-beats-platt-trudgian.js providedByImp963
// for the N_range_measured upper bound flip.
const N_MAX_MEASURED = Math.max(0, ...[...measuredNs]);

export const K_PLATEAU_LADDER_MEASURED = Object.freeze({
  id: 'imp-1136-k-plateau-ladder-measured',
  status: 'shipped-partial-blocked-on-bh-wired-cli',
  sourceTicket: 'imp-1136',
  ticketTitle:
    'Phase 3 production sweep with Barnes-Hut: measure full plateau ladder N in [2e4, 1e6] using imp-1132 backend',
  binary: 'rust/interval-rk4/target/release/interval-rk4-cli',
  lastUpdated: '2026-05-19T20:00:00Z',
  theta_default: 0.05,
  imp1139MultipoleShipped: false,
  plateauNs: PLATEAU_NS,
  rows: ROWS,
  successCount: SUCCESS_COUNT,
  closedBracketCount: CLOSED_BRACKET_COUNT,
  totalN: TOTAL_N,
  N_max_measured: N_MAX_MEASURED,
  conservativeCarryforwardLadderId: 'imp-1082-1087-1088-K-PLATEAU-LADDER',
  conservativeCarryforwardSource: 'src/data/finite-k-c-mb-unconditional.js',
  doesNotMutate: Object.freeze([
    'src/data/finite-k-c-mb-unconditional.js K_PLATEAU_LADDER (imp-1082 ' +
      '/ imp-1087 / imp-1088 conservative-carryforward stays valid)',
    'src/data/rust-port-phase3-pilot-validation.js RUST_PORT_PHASE3_PILOT ' +
      '(imp-1092 pilot row mirrored here, not modified upstream)',
    'src/data/rust-port-sanity-sweep-2026-05.js SANITY_SWEEP (imp-1112 ' +
      'rows mirrored here, not modified upstream)',
  ]),
  honestScope: Object.freeze({
    whatShipped:
      'Three measured rows on the 9-plateau production ladder: two ' +
      'closed-bracket rows at N = 2e4 (imp-1092 dt 1e-4 and imp-1112 ' +
      'dt 5e-5, both gap-lower-bound-nonpositive termination) and one ' +
      'partial-bracket row at N = 5e4 (imp-1112 budget-exhausted at 2 ' +
      'RK4 steps with t_c_lo certified at 1e-4 but t_c_hi unclosed). ' +
      'All three rows use the same Rust CLI binary on the same host ' +
      'against the same ZEROS_EXTENDED initial conditions; results ' +
      'are deterministic and reproducible.',
    whatWasNotShipped: Object.freeze([
      'Measured rows at N in {1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6} -- ' +
        'six plateaus blocked by the dense-vs-BH CLI gap (CLI does ' +
        'not yet dispatch dyson_drift_vector_barnes_hut).',
      'A closed bracket at N = 5e4 -- only t_c_lo is rigorous, t_c_hi ' +
        'would need more max_steps under the dense backend.',
      'The imp-1137 V2 OLS interval-arithmetic refit consumer flip --' +
        ' that ticket needs at-least 3 closed-bracket rows above N = ' +
        '1e4 to shrink the interval-OLS error bar to < 0.01; we ship ' +
        '2 closed-bracket rows (both at N = 2e4), so imp-1137 stays ' +
        'on the imp-1082 conservative-carryforward inputs until the ' +
        'BH-wired sweep below lands.',
      'The finite-height-beats-platt-trudgian providedByImp963.' +
        'N_range_measured upper bound flip from 1e4 to a higher N --' +
        ' the ticket spec requires at-least 3 NEW plateaus closed; we ' +
        'have 2 measured rows at N = 2e4 and 1 partial at N = 5e4, ' +
        'which is 1 plateau measured-and-closed at a NEW N (N = 5e4 ' +
        'partial does not count for the closed-bracket threshold). ' +
        'N_range_measured stays at [100, 1e4] until imp-1136-sub-bh-' +
        'wired-cli ships more closed-bracket rows.',
    ]),
    openSubGap: Object.freeze({
      id: 'imp-1136-sub-bh-wired-cli',
      parent: 'imp-1136',
      status: 'open',
      blocker: true,
      statement:
        'Wire dyson_drift_vector_barnes_hut into ' +
        'rust/interval-rk4/src/bin/interval-rk4-cli.rs behind a ' +
        '--backend {dense|bh} --theta <f64> flag pair (default ' +
        '--backend dense to stay backward-compatible with imp-1091 / ' +
        'imp-1092 / imp-1112). Recompile cargo build --release. Re-' +
        'run this sweep with --backend bh --theta 0.05 (or theta 0.5 ' +
        'after imp-1139 multipole lands). Anticipated cost reduction ' +
        'at N = 1e5: from approx 3475 s/step dense to approx 16 s/step ' +
        'BH (imp-1132 measured at theta = 0.1), bringing the full 9-N ' +
        'sweep inside a multi-hour budget. The CLI rewire is small ' +
        '(approx 30 LOC arg-parsing + dispatch); it is held outside ' +
        'this ticket only because the sister imp-1139 owns the rust ' +
        'src/ tree under the current parallel-agent contract.',
      blockerFor:
        'imp-1137 V2 OLS interval refit (needs 3+ closed-bracket rows ' +
        'above N = 1e4); imp-1138 asymptotic Lambda upper bound ' +
        'composition; finite-height-beats-platt-trudgian.js ' +
        'providedByImp963.N_range_measured flip.',
    }),
  }),
});

/**
 * Build-time assertions. 6+ tripwires per the ticket spec. Auto-
 * discovered by scripts/run-assertions.mjs via the _ASSERTIONS suffix.
 */
export const K_PLATEAU_LADDER_MEASURED_ASSERTIONS = [
  {
    id: 'imp1136-every-plateau-N-has-row',
    holds: () => {
      const got = new Set(K_PLATEAU_LADDER_MEASURED.rows.map((r) => r.N));
      for (const N of PLATEAU_NS) {
        if (!got.has(N)) return false;
      }
      return got.size >= PLATEAU_NS.length;
    },
    why:
      'Every ticket-spec plateau N in {2e4, 5e4, 1e5, 2e5, 3e5, 5e5, ' +
      '6e5, 8e5, 1e6} must have at-least-one row in ROWS, even if the ' +
      'row records a blocker. Missing N = missing diagnostic data, ' +
      'breaks the consumer chain that iterates over PLATEAU_NS.',
  },
  {
    id: 'imp1136-measured-rows-have-finite-t-c-lo',
    holds: () => {
      for (const r of K_PLATEAU_LADDER_MEASURED.rows) {
        if (!r.success) continue;
        if (!Number.isFinite(r.t_c_lo) || r.t_c_lo <= 0) return false;
      }
      return true;
    },
    why:
      'Any row marked success === true must carry a finite positive ' +
      't_c_lo (the certified lower bound on the collision time). A ' +
      'success row with null or non-positive t_c_lo is a schema ' +
      'corruption that would silently feed garbage to imp-1137 V2 OLS.',
  },
  {
    id: 'imp1136-closed-bracket-rows-are-ordered',
    holds: () => {
      for (const r of K_PLATEAU_LADDER_MEASURED.rows) {
        if (!r.success) continue;
        if (r.t_c_hi == null) continue; // partial bracket OK
        if (!Number.isFinite(r.t_c_hi)) return false;
        if (r.t_c_hi <= r.t_c_lo) return false;
        if (!Number.isFinite(r.wrapperWidth)) return false;
        if (r.wrapperWidth <= 0) return false;
      }
      return true;
    },
    why:
      'Any row with a closed bracket (t_c_hi non-null) must satisfy ' +
      '0 < t_c_lo < t_c_hi AND wrapperWidth = t_c_hi - t_c_lo > 0. ' +
      'A closed-bracket row violating this means the Rust CLI returned ' +
      'malformed output or the JSON parse picked up the wrong field.',
  },
  {
    id: 'imp1136-honest-success-count-matches-rows',
    holds: () => {
      const measured = new Set(
        K_PLATEAU_LADDER_MEASURED.rows
          .filter((r) => r.success)
          .map((r) => r.N),
      );
      return K_PLATEAU_LADDER_MEASURED.successCount === measured.size &&
             K_PLATEAU_LADDER_MEASURED.totalN === PLATEAU_NS.length &&
             K_PLATEAU_LADDER_MEASURED.N_max_measured === Math.max(0, ...[...measured]);
    },
    why:
      'The successCount + N_max_measured fields must stay synchronized ' +
      'with the actual rows array. Drift here would silently mislead ' +
      'the imp-1137 V2 OLS consumer and the finite-height-beats-platt-' +
      'trudgian N_range_measured flip about what data is actually ' +
      'available. Caught at build time by recomputing both fields.',
  },
  {
    id: 'imp1136-does-not-overclaim-status',
    holds: () => {
      const s = K_PLATEAU_LADDER_MEASURED.status;
      return s === 'shipped-partial-blocked-on-bh-wired-cli' ||
             s === 'shipped-complete-all-9-plateaus-measured';
    },
    why:
      'The status string must explicitly say either shipped-partial-' +
      'blocked-on-bh-wired-cli (current honest state) or shipped-' +
      'complete-all-9-plateaus-measured (only after imp-1136-sub-bh-' +
      'wired-cli closes and ALL 9 plateaus have closed brackets). Any ' +
      'other status string is over-claiming.',
  },
  {
    id: 'imp1136-named-open-subgap-when-partial',
    holds: () => {
      const sg = K_PLATEAU_LADDER_MEASURED.honestScope.openSubGap;
      const isPartial = K_PLATEAU_LADDER_MEASURED.status.includes('partial');
      if (!isPartial) return true;
      return sg && sg.id === 'imp-1136-sub-bh-wired-cli' &&
             sg.parent === 'imp-1136' &&
             sg.status === 'open' &&
             sg.blocker === true &&
             typeof sg.statement === 'string' && sg.statement.length > 100 &&
             typeof sg.blockerFor === 'string' && sg.blockerFor.length > 50;
    },
    why:
      'When status is partial, a named open sub-gap must enumerate ' +
      'the deferred work + the consumer chain it blocks. Dropping the ' +
      'sub-gap would silently over-claim imp-1136 as fully closed ' +
      'while imp-1137 + imp-1138 + the N_range_measured flip all ' +
      'still wait on the BH-wired CLI.',
  },
  {
    id: 'imp1136-does-not-mutate-conservative-carryforward',
    holds: () => {
      const docs = K_PLATEAU_LADDER_MEASURED.doesNotMutate.join(' ');
      return docs.includes('K_PLATEAU_LADDER') &&
             docs.includes('imp-1082') &&
             docs.includes('imp-1087') &&
             docs.includes('imp-1088') &&
             docs.includes('conservative-carryforward');
    },
    why:
      'Per the ticket HONEST SCOPE clause the conservative-carryforward ' +
      'ladder from imp-1082 / imp-1087 / imp-1088 must stay valid as ' +
      'the safe fallback. This tripwire reads the doesNotMutate field ' +
      'and confirms the carryforward ladder + the three batch tickets ' +
      'are named there, so any future agent reading this file is ' +
      'reminded NOT to overwrite the carryforward.',
  },
  {
    id: 'imp1136-rows-record-theta-and-backend',
    holds: () => {
      for (const r of K_PLATEAU_LADDER_MEASURED.rows) {
        if (typeof r.theta !== 'number' || !Number.isFinite(r.theta)) return false;
        if (r.theta <= 0 || r.theta > 1) return false;
        if (typeof r.backend !== 'string' || r.backend.length === 0) return false;
        if (typeof r.sourceTicket !== 'string' || !r.sourceTicket.startsWith('imp-')) return false;
      }
      return true;
    },
    why:
      'Every row must record the theta value (the BH theta criterion ' +
      'we requested or would have requested) AND the backend string ' +
      '(rust-dense-o-n-squared today, rust-bh-o-n-log-n after the ' +
      'sub-gap closes) AND the sourceTicket. Without these the ' +
      'forward-compatibility plan for the BH-wired CLI breaks and the ' +
      'cross-ticket provenance is lost.',
  },
];
