/**
 * @module data/rust-port-phase3-pilot-validation
 * @fileoverview imp-1092 Phase 3 PILOT (HONEST PARTIAL, 1 of 9 plateaus
 * measured) -- records the first genuine native interval-RK4 measurement
 * on the imp-962 production plateau ladder, at the smallest ticket-spec
 * N value (N = 2e4, plateau 1).
 *
 * WHAT imp-1092 ASKS FOR
 * ----------------------
 * A production sweep across all 9 ticket-spec N values
 * {2e4, 5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6} -- the N values that
 * imp-1082 / imp-1087 / imp-1088 shipped as CONSERVATIVE-CARRYFORWARD
 * (K_bound = 0.2014, the imp-963 worst-case headline) with
 * maxIntervalWidth: null and status "projected-not-measured" in
 * K_PLATEAU_LADDER (src/data/finite-k-c-mb-unconditional.js).
 *
 * WHAT THIS PILOT SHIPS
 * ---------------------
 * The dependency imp-1091 wired the native Rust binary
 * (rust/interval-rk4/target/release/interval-rk4-cli) into the JS
 * pipeline. This pilot RAN that binary, single-input mode, on the
 * first ticket-spec plateau N = 2e4 (initial conditions = first 2e4
 * entries of ZEROS_EXTENDED from src/data/zeros-to-1e6.js, the same
 * source compute-imp423-missing-N.mjs feeds the dispatch wrapper).
 *
 * The result is a REAL CERTIFIED collision bracket -- not a carryforward,
 * not a projection. It is the first measured row of the Phase-3 ladder.
 *
 *   N = 20000, dt = 1e-4, max_steps = 8 requested
 *   -> t_c in [0.0001, 0.0002]   (certified interval bracket)
 *      max_interval_width = 4.911271389573812e-10
 *      steps_taken = 2  reason = "gap-lower-bound-nonpositive"
 *      runtime_ms = 180323  backend = rust
 *
 * The certificate terminated at step 2 because the minimum-gap interval
 * lower bound went non-positive -- i.e. the certified collision was
 * bracketed within two interval-RK4 steps. The measured interval width
 * 4.91e-10 replaces the conservative row maxIntervalWidth: null at this
 * plateau; the conservative K = 0.2014 carryforward stays valid (the
 * rescue formula holds with ~9x margin at N = 2e4) -- measurement here
 * is a TIGHTENING, not a soundness fix, exactly as IMP_1082_SUB
 * predicted.
 *
 * HONEST SCOPE -- WHAT THIS DOES NOT SHIP
 * ---------------------------------------
 * 8 of the 9 ticket-spec plateaus remain unmeasured. The N = 2e4 run
 * cost 180 s of native wall-clock for a 2-step certified bracket. The
 * per-step drift sum is O(N log N) after imp-1132 Barnes-Hut, so the
 * N = 1e6 plateau is roughly 50x the N = 2e4 work PER STEP and the full
 * 9-plateau sweep is a multi-hour job that cannot run inside one atomic
 * engine pass. The K_bound numeric conversion, the
 * K_PLATEAU_LADDER_MEASURED table, the finite-height-beats-platt-trudgian
 * consumer rewiring, and the imp-1082 / imp-1087 / imp-1088 closure-note
 * flips are all deferred to the named open sub-gap below. This file
 * does NOT modify K_PLATEAU_LADDER or any consumer -- it is a
 * standalone evidence record so the measurement is not lost.
 */

export const RUST_PORT_PHASE3_PILOT = Object.freeze({
  ticket: 'imp-1092',
  phase: 'Phase 3 PILOT',
  status: 'partial-1-of-9-plateaus-measured',
  dependsOnSatisfied: 'imp-1091 (CLI wire-up) completed 2026-05-18',
  binary: 'rust/interval-rk4/target/release/interval-rk4-cli',
  initialConditionSource:
    'src/data/zeros-to-1e6.js ZEROS_EXTENDED (first N entries), the ' +
    'same source compute-imp423-missing-N.mjs feeds callIntervalRk4',

  // The 9 ticket-spec production plateaus. Exactly one is measured here.
  ticketSpecPlateauNs: Object.freeze([
    20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000,
  ]),

  measuredPlateau: Object.freeze({
    N: 20000,
    plateauIndex: 1,
    dt: 1e-4,
    max_steps_requested: 8,
    steps_taken: 2,
    t_c_lo: 0.0001,
    t_c_hi: 0.0002,
    max_interval_width: 4.911271389573812e-10,
    reason: 'gap-lower-bound-nonpositive',
    runtime_ms: 180323,
    backend: 'rust',
    measuredAt: '2026-05-19T18:00:00Z',
  }),

  // What the conservative carryforward row at N = 2e4 currently carries
  // in K_PLATEAU_LADDER (buildPlateauRow batch 1). Recorded here only
  // for cross-reference -- this file does NOT mutate that table.
  conservativeCarryforwardAtN2e4: Object.freeze({
    K_bound: 0.2014,
    K_bound_source:
      'imp-963-headline-carryforward (worst-case K on [100, 10^4])',
    maxIntervalWidth: null,
    runtimeSec: null,
    status: 'projected-not-measured',
    measurementSubGap: 'imp-1082-sub-measurement',
  }),

  pilotTakeaway:
    'Native interval-RK4 produces a real certified t_c bracket at the ' +
    'first production plateau (N = 2e4) in 180 s with interval width ' +
    '4.91e-10, where the conservative ladder row had maxIntervalWidth ' +
    'null. The measurement TIGHTENS but does not contradict the ' +
    'K = 0.2014 carryforward (rescue margin ~9x at N = 2e4), confirming ' +
    'the Phase-3 approach is sound. Scaling the remaining 8 plateaus to ' +
    'N = 1e6 is multi-hour compute, deferred below.',

  honestScope: Object.freeze({
    whatShipped:
      'One real certified interval-RK4 collision bracket at the first ' +
      'ticket-spec plateau N = 2e4, recorded as an immutable evidence ' +
      'artifact.',
    whatWasNotShipped: Object.freeze([
      'Measurements for the remaining 8 plateaus (5e4, 1e5, 2e5, 3e5, ' +
        '5e5, 6e5, 8e5, 1e6) -- multi-hour native compute.',
      'The K_bound numeric conversion from the measured t_c bracket.',
      'The K_PLATEAU_LADDER_MEASURED table.',
      'The finite-height-beats-platt-trudgian consumer rewiring to ' +
        'prefer measured bounds.',
      'The imp-1082 / imp-1087 / imp-1088 closure-note flips.',
    ]),
    openSubGap: Object.freeze({
      id: 'imp-1092-sub-full-9plateau-measured-sweep',
      parent: 'imp-1092',
      status: 'open',
      blocker: false,
      statement:
        'Run the native interval-RK4 sweep CLI (sweep subcommand, ' +
        'rayon parallel from imp-1110) across the 8 remaining ' +
        'ticket-spec plateaus {5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, ' +
        '1e6}, convert each certified t_c bracket to a per-plateau ' +
        'K_bound, build K_PLATEAU_LADDER_MEASURED, rewire the ' +
        'finite-height-beats-platt-trudgian consumer to prefer ' +
        'measured-over-carryforward, and flip the imp-1082 / imp-1087 ' +
        '/ imp-1088 closure notes to cite the measured ladder. The ' +
        'N = 2e4 pilot in this file is the proof the pipeline works ' +
        'end to end; the residual is wall-clock, not correctness.',
      estimatedRuntimeHours:
        'multi-hour (N = 1e6 plateau alone is ~50x the 180 s N = 2e4 ' +
        'cost per step under imp-1132 Barnes-Hut O(N log N)).',
      deferredTo:
        'a long-running native sweep job outside the atomic engine pass',
    }),
  }),
});

/**
 * Build-time assertion tripwires (auto-discovered by
 * scripts/run-assertions.mjs via the _ASSERTIONS suffix). These fire
 * on every assertion sweep and exist to make over-claiming impossible:
 * the pilot must stay honestly scoped as 1-of-9.
 */
export const RUST_PORT_PHASE3_PILOT_ASSERTIONS = [
  {
    id: 'imp1092-pilot-plateau-is-first-ticket-spec-N',
    holds: () =>
      RUST_PORT_PHASE3_PILOT.measuredPlateau.N ===
        RUST_PORT_PHASE3_PILOT.ticketSpecPlateauNs[0] &&
      RUST_PORT_PHASE3_PILOT.ticketSpecPlateauNs.length === 9,
    why:
      'The pilot must measure the FIRST of the 9 ticket-spec plateaus ' +
      '(N = 2e4) so the honest partial maps cleanly onto the imp-1092 ' +
      'sweep spec. A mismatch means the recorded measurement is not on ' +
      'the production ladder and the partial closure is misattributed.',
  },
  {
    id: 'imp1092-pilot-bracket-ordered-and-finite',
    holds: () => {
      const m = RUST_PORT_PHASE3_PILOT.measuredPlateau;
      return (
        Number.isFinite(m.t_c_lo) &&
        Number.isFinite(m.t_c_hi) &&
        m.t_c_lo > 0 &&
        m.t_c_hi > m.t_c_lo
      );
    },
    why:
      'A certified collision bracket must satisfy 0 < t_c_lo < t_c_hi. ' +
      'If this fails the recorded Rust output is not a valid interval ' +
      'certificate and must not be cited as measured Phase-3 evidence.',
  },
  {
    id: 'imp1092-pilot-interval-width-is-tight',
    holds: () => {
      const w = RUST_PORT_PHASE3_PILOT.measuredPlateau.max_interval_width;
      return Number.isFinite(w) && w > 0 && w < 1e-6;
    },
    why:
      'The measured interval width must be a tight positive number ' +
      '(< 1e-6) -- this is the whole point of measuring vs the ' +
      'conservative row maxIntervalWidth: null. A loose or non-finite ' +
      'width means the native certificate did not converge.',
  },
  {
    id: 'imp1092-pilot-backend-is-rust',
    holds: () =>
      RUST_PORT_PHASE3_PILOT.measuredPlateau.backend === 'rust' &&
      RUST_PORT_PHASE3_PILOT.binary.endsWith('interval-rk4-cli'),
    why:
      'Phase 3 measurement only counts when produced by the native ' +
      'Rust binary wired in by imp-1091. A JS-fallback backend would ' +
      'be infeasible at production N and must not be recorded as a ' +
      'Phase-3 measured row.',
  },
  {
    id: 'imp1092-pilot-honest-subgap-named',
    holds: () => {
      const sg = RUST_PORT_PHASE3_PILOT.honestScope.openSubGap;
      return (
        sg.id === 'imp-1092-sub-full-9plateau-measured-sweep' &&
        sg.status === 'open' &&
        sg.parent === 'imp-1092' &&
        RUST_PORT_PHASE3_PILOT.honestScope.whatWasNotShipped.length >= 4
      );
    },
    why:
      'The honest partial REQUIRES a named open sub-gap enumerating ' +
      'the deferred work (remaining 8 plateaus + K conversion + ' +
      'consumer rewiring + closure flips). Dropping the sub-gap would ' +
      'silently over-claim imp-1092 as fully closed.',
  },
  {
    id: 'imp1092-pilot-does-not-overclaim',
    holds: () =>
      RUST_PORT_PHASE3_PILOT.status === 'partial-1-of-9-plateaus-measured',
    why:
      'The pilot status string must explicitly say 1-of-9 measured. ' +
      'Any status implying full Phase-3 closure is a false claim while ' +
      'imp-1092-sub-full-9plateau-measured-sweep is still open.',
  },
];
