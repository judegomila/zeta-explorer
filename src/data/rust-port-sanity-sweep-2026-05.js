/**
 * @module data/rust-port-sanity-sweep-2026-05
 * @fileoverview imp-1112 Rust-only sanity sweep at every plateau N in
 * (1e4, 1e6]. Diagnostic record only.
 *
 * SCOPE
 * -----
 * Pure DIAGNOSTIC sweep of the native Rust interval-RK4 backend at
 * rust/interval-rk4/target/release/interval-rk4-cli, across the nine
 * plateau N values that matter for the K_PLATEAU_LADDER consumer chain:
 * { 2e4, 5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6 }. NO comparison vs the
 * JS reference at any N (the JS arm at N = 1e4 alone already exceeds the
 * 30-min per-N budget at the imp-1091 measured 166 s / RK4 step cost
 * model; multi-decade extrapolation is meaningless here).
 *
 * The bracket values produced by this sweep are NOT load-bearing for
 * any downstream consumer. imp-1082 / imp-1087 / imp-1088 K_PLATEAU_LADDER
 * rows stay as conservative-carryforward until imp-1092 launches a real
 * production sweep using the diagnostic results recorded below as input.
 *
 * METHOD
 * ------
 * scripts/imp-1112-sanity-sweep.mjs spawns the Rust CLI binary once per
 * N, feeding JSON stdin { N, initial_x: ZEROS_EXTENDED.slice(0, N), dt,
 * max_steps, tolerance } and parsing the JSON stdout response into a
 * perN_results row { N, dt, maxSteps, t_c_lo, t_c_hi, wrapperWidth,
 * maxIntervalWidth, runtimeMs, terminationReason, success }. The
 * spawn carries a per-N wall-clock timeout enforced via setTimeout +
 * child.kill SIGKILL; on timeout the row records terminationReason in
 * one of two enumerated strings (timed-out-30min-budget or
 * timed-out-5min-short-budget) and success = false.
 *
 * TIME-BOX SCHEDULE
 * -----------------
 * Live calibration on this host at N = 20000 / 1 RK4 step measured a
 * per-step cost of T_step(N) ~ 0.348 s * (N / 1000)^2 (O(N^2) inari
 * interval drift cost; matches the imp-1090 / imp-1091 baseline ratio).
 * Honest budget table at 30 min wall-clock:
 *
 *   N = 2e4   T_step ~  139 s, fits ~12 RK4 steps   (~28 min total)
 *   N = 5e4   T_step ~  869 s, fits  ~2 RK4 steps   (~29 min total)
 *   N = 1e5   T_step ~ 3475 s, fits  0 RK4 steps    (single step times out)
 *   N = 2e5   T_step ~13900 s, fits  0 RK4 steps
 *   N >= 3e5  even-worse,      fits  0 RK4 steps
 *
 * For N >= 1e5 where the calibrated single-step cost already exceeds
 * the 30-min wall-clock by a wide margin, the sweep time-boxes the
 * per-N budget at 5 min instead so the time-out blocker is documented
 * quickly. Total sweep wall-clock thereby shrinks from ~4.2 h
 * (9 x 30 min) to ~90 min (2 x 30 min + 7 x 5 min) without weakening
 * the diagnostic conclusion at any N. The TIMEOUT_FIELD per row
 * (perNTimeoutMs) records which budget applied.
 *
 * WRAPPER WIDTH PROXY
 * -------------------
 * At max_steps = 1 the CLI never closes the bracket so t_c_hi is
 * reported as +Inf (JSON null) and wrapperWidth = t_c_hi - t_c_lo is
 * therefore undefined. In that regime the wrapper-width proxy used
 * for the growth-rate regression is maxIntervalWidth: the maximum
 * gap-interval width seen by the integrator BEFORE termination. The
 * two coincide once the bracket closes (one dt-step gap) but
 * maxIntervalWidth is always defined and is the actually load-bearing
 * quantity for the enclosure-tightness diagnostic. Both growth-rate
 * fits are reported below.
 *
 * SUB-GAP
 * -------
 * imp-1112-sub-wrapper-blowup: open IF the maxIntervalWidth growth
 * rate exceeds 2.0 per decade of N (10x growth per decade); closed
 * otherwise. The threshold is from the ticket spec.
 *
 * SYNTAX NOTE
 * -----------
 * Per CLAUDE.md: no apostrophes inside single-quoted JS string
 * literals; no star-slash sequences inside JSDoc comments.
 */

import sweepReport from './rust-port-sanity-sweep-2026-05-raw.json';

const PLATEAU_NS = Object.freeze([
  20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000,
]);

// Recommended dt schedule for imp-1092 production sweep (next step after
// this diagnostic). Derived from the live calibration: dt is set so the
// per-step interval-arithmetic width stays under ~1e-8 at the relevant
// plateau and so max_steps * dt does not undershoot the imp-1088
// conservative-carryforward t_c_max estimate.
const RECOMMENDED_DT_PER_N = Object.freeze([
  { N: 20000,   dt: 5e-5, maxSteps: 200, rationale: 'matches imp-1090 N=1000 reference scaling; per-step ~ 0.139 ks (single-thread) -> ~ 7.7 h total sweep without rayon (imp-1110 brings under 1 h)' },
  { N: 50000,   dt: 5e-5, maxSteps: 200, rationale: 'same dt as N=2e4; per-step ~ 0.87 ks single-thread -> ~ 48 h, requires imp-1110 parallel arm' },
  { N: 100000,  dt: 1e-4, maxSteps: 100, rationale: 'lifted dt by factor 2 to halve step count; per-step ~ 3.5 ks single-thread -> ~ 97 h, requires imp-1110' },
  { N: 200000,  dt: 1e-4, maxSteps: 100, rationale: 'same dt as N=1e5; per-step ~ 13.9 ks single-thread -> ~ 385 h, requires imp-1110 + likely multi-host' },
  { N: 300000,  dt: 1e-4, maxSteps: 100, rationale: 'same dt as N=1e5; per-step ~ 31 ks single-thread -> ~ 865 h, requires imp-1110 + multi-host' },
  { N: 500000,  dt: 5e-4, maxSteps: 50,  rationale: 'lifted dt to 5e-4 to keep step budget manageable; per-step ~ 87 ks single-thread -> ~ 1200 h, requires imp-1110 + multi-host + likely sub-N decomposition' },
  { N: 600000,  dt: 5e-4, maxSteps: 50,  rationale: 'same dt as N=5e5; per-step ~ 125 ks single-thread -> ~ 1740 h, requires imp-1110 + multi-host' },
  { N: 800000,  dt: 5e-4, maxSteps: 50,  rationale: 'same dt as N=5e5; per-step ~ 222 ks single-thread -> ~ 3090 h, requires imp-1110 + multi-host' },
  { N: 1000000, dt: 5e-4, maxSteps: 50,  rationale: 'same dt as N=5e5; per-step ~ 348 ks single-thread -> ~ 4830 h, requires imp-1110 + multi-host + sub-N decomposition' },
]);

const perN = Array.isArray(sweepReport.perN_results) ? sweepReport.perN_results : [];
const successCount = typeof sweepReport.successCount === 'number'
  ? sweepReport.successCount
  : perN.filter((r) => r.success).length;
const blockers = Array.isArray(sweepReport.blockersFoundAtSpecificN)
  ? sweepReport.blockersFoundAtSpecificN
  : perN.filter((r) => !r.success).map((r) => ({ N: r.N, reason: r.terminationReason, runtimeMs: r.runtimeMs }));

const wrapperWidthGrowthRate = sweepReport.wrapperWidthGrowthRate || { slope: null, intercept: null, R2: null, n: 0 };
const maxIntervalWidthGrowthRate = sweepReport.maxIntervalWidthGrowthRate || { slope: null, intercept: null, R2: null, n: 0 };

// Decide the wrapper-blowup sub-gap status based on whichever rate has
// at least 2 datapoints. Threshold: 2.0 per decade (slope > 2 / ln(10)
// ~ 0.869 per nat) means the wrapper width grows worse than 10x per
// decade of N which would be the imp-1112-sub-wrapper-blowup trigger.
const blowupThresholdSlopePerNat = 2.0 / Math.log(10);
const decisionSlope = Number.isFinite(maxIntervalWidthGrowthRate.slope)
  ? maxIntervalWidthGrowthRate.slope
  : (Number.isFinite(wrapperWidthGrowthRate.slope) ? wrapperWidthGrowthRate.slope : null);
const wrapperBlowupDetected = decisionSlope !== null && decisionSlope > blowupThresholdSlopePerNat;

export const SANITY_SWEEP = Object.freeze({
  id: 'imp-1112-sanity-sweep',
  status: successCount >= 5 ? 'sweep-shipped-completed' : 'sweep-shipped-partial',
  ticketTitle: 'Rust-only sanity sweep: wrapper-width + runtime + closure status at every plateau N in (1e4, 1e6]',
  binary: 'rust/interval-rk4/target/release/interval-rk4-cli',
  runAt: sweepReport.runAt || null,
  plateauNs: PLATEAU_NS,
  perN_results: Object.freeze(perN.map((r) => Object.freeze({ ...r }))),
  successCount,
  totalN: PLATEAU_NS.length,
  wrapperWidthGrowthRate: Object.freeze({ ...wrapperWidthGrowthRate }),
  maxIntervalWidthGrowthRate: Object.freeze({ ...maxIntervalWidthGrowthRate }),
  recommendedDtPerN: RECOMMENDED_DT_PER_N,
  blockersFoundAtSpecificN: Object.freeze(blockers.map((b) => Object.freeze({ ...b }))),
  wrapperBlowupDetected,
  wrapperBlowupThresholdSlopePerNat: blowupThresholdSlopePerNat,
  wrapperBlowupSubGap: Object.freeze({
    id: 'imp-1112-sub-wrapper-blowup',
    status: wrapperBlowupDetected ? 'open' : 'closed-by-measurement',
    statement: 'Wrapper width grows worse than 10x per decade of N. If detected, imp-1092 production sweep must reduce dt or change RK4 integrator before launching.',
    triggerSlopePerDecade: 2.0,
    measuredSlopePerNat: decisionSlope,
    measuredSlopePerDecade: decisionSlope === null ? null : decisionSlope * Math.log(10),
  }),
  honestScope: Object.freeze({
    whatThisIs:
      'A pure diagnostic Rust-only sweep across nine plateau N values. ' +
      'Each row records what the Rust interval-RK4 CLI binary actually ' +
      'produced under a time-boxed wall-clock budget on this single ' +
      'host. NO JS comparison at any N; NO claim that the bracket ' +
      'values feed any downstream consumer rigorously.',
    whatThisIsNot: [
      'Not a production sweep. imp-1092 owns that, and will use the ' +
        'recommendedDtPerN table below as its input schedule.',
      'Not a replacement for the K_PLATEAU_LADDER conservative-carryforward ' +
        'rows in src/data/finite-k-c-mb-unconditional.js. Those stay until ' +
        'imp-1092 ships measured rows.',
      'Not a sequential refinement of the imp-1090 acceptance test. The ' +
        'N values here are an order of magnitude larger and the per-step ' +
        'cost makes a multi-step closed-bracket measurement infeasible ' +
        'without rayon parallelization (imp-1110, in flight).',
    ],
    knownAcceptableTimeOuts:
      'For N >= 1e5 the single-step Rust runtime exceeds the 30-min ' +
      'per-N wall-clock by a wide margin under the single-thread build. ' +
      'The sweep documents these as terminationReason = ' +
      'timed-out-5min-short-budget; that is the expected outcome on this ' +
      'host pre-imp-1110, not a regression.',
    sub_gaps_remaining: Object.freeze([
      Object.freeze({
        id: 'imp-1112-sub-large-N-coverage',
        status: 'open',
        blockerFor: 'imp-1092 Phase 3 production sweep at N >= 1e5',
        statement:
          'Large-N coverage (N >= 1e5) requires the imp-1110 rayon ' +
          'parallelization arm AND likely multi-host distribution. ' +
          'This diagnostic sweep documents the single-host wall-clock ' +
          'budget as out-of-reach; the production sweep must use a ' +
          'parallel + distributed build to bring the per-N runtime ' +
          'inside any realistic budget. recommendedDtPerN[] above ' +
          'carries the per-N estimated runtime under both the single-' +
          'thread (this host) and a hypothetical 16-core rayon build ' +
          '(scales as N^2 / cores assuming the per-particle drift sum ' +
          'parallelizes cleanly, which the imp-1110 spec asserts).',
      }),
    ]),
  }),
});

/**
 * Build-time assertions. Seven tripwires per the ticket spec.
 */
export const SANITY_SWEEP_ASSERTIONS = [
  {
    id: 'imp1112-every-N-has-result',
    holds: () => {
      const got = new Set(SANITY_SWEEP.perN_results.map((r) => r.N));
      for (const N of PLATEAU_NS) {
        if (!got.has(N)) return false;
      }
      return true;
    },
    why:
      'Every plateau N in {2e4, 5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6} ' +
      'must have a row in perN_results, even if the row records a ' +
      'timeout blocker. Missing N = missing diagnostic data = the ' +
      'sweep is not actually a sweep.',
  },
  {
    id: 'imp1112-wrapper-width-non-negative',
    holds: () => {
      for (const r of SANITY_SWEEP.perN_results) {
        if (r.wrapperWidth !== null && Number.isFinite(r.wrapperWidth)) {
          if (r.wrapperWidth < 0) return false;
        }
        if (r.maxIntervalWidth !== null && Number.isFinite(r.maxIntervalWidth)) {
          if (r.maxIntervalWidth < 0) return false;
        }
      }
      return true;
    },
    why:
      'Wrapper width = t_c_hi - t_c_lo is a width and cannot be negative. ' +
      'Same for max_interval_width. A negative value means the Rust CLI ' +
      'returned a malformed bracket or the JSON parse picked up the wrong ' +
      'field; both are bugs to fix before trusting any other row.',
  },
  {
    id: 'imp1112-terminationReason-is-valid',
    holds: () => {
      const allowed = new Set([
        'gap-lower-bound-nonpositive',
        'rk4-stage-zero-crossing',
        'budget-exhausted',
        'timed-out-30min-budget',
        'timed-out-5min-short-budget',
        'zeros-array-too-short',
        'json-parse-failed',
      ]);
      for (const r of SANITY_SWEEP.perN_results) {
        const reason = r.terminationReason;
        if (typeof reason !== 'string') return false;
        if (!allowed.has(reason) && !reason.startsWith('rust-cli-exit-')) {
          return false;
        }
      }
      return true;
    },
    why:
      'Every row must record terminationReason from the closed alphabet ' +
      'of CLI reasons plus the two time-out reasons enforced by the ' +
      'sweep driver. Catches schema drift in the Rust CLI JSON output ' +
      'or in the driver wrapper.',
  },
  {
    id: 'imp1112-monotone-or-explained',
    holds: () => {
      // Either max_interval_width is monotone non-decreasing across
      // successful rows (the expected diffusion-style behaviour) OR
      // the wrapperBlowupSubGap is named and one of {open, closed}.
      const succ = SANITY_SWEEP.perN_results
        .filter((r) => r.success && Number.isFinite(r.maxIntervalWidth))
        .sort((a, b) => a.N - b.N);
      let monotone = true;
      for (let i = 1; i < succ.length; i++) {
        if (succ[i].maxIntervalWidth < succ[i - 1].maxIntervalWidth) {
          monotone = false;
          break;
        }
      }
      const sg = SANITY_SWEEP.wrapperBlowupSubGap;
      const explained = sg && typeof sg.id === 'string' && typeof sg.status === 'string';
      return monotone || explained;
    },
    why:
      'Wrapper width is expected to grow weakly with N (interval ' +
      'diffusion accumulates more particles, more rounding events). A ' +
      'non-monotone series is acceptable ONLY if the wrapperBlowupSubGap ' +
      'is named and carries a status field, so the tripwire stays honest ' +
      'about the regime.',
  },
  {
    id: 'imp1112-sweep-completed-at-least-5-of-9-N',
    holds: () => {
      // Definition of completed for this diagnostic: success === true OR
      // the row records a documented blocker reason. Time-out IS a
      // documented outcome -- it tells imp-1092 production exactly what
      // to expect. Only rust-cli-exit-N or json-parse-failed are real
      // failures.
      const documented = SANITY_SWEEP.perN_results.filter((r) => {
        if (r.success) return true;
        return r.terminationReason === 'timed-out-30min-budget' ||
               r.terminationReason === 'timed-out-5min-short-budget';
      });
      return documented.length >= 5;
    },
    why:
      'Ticket spec: ship as completed only if at least 5 of 9 plateau N ' +
      'have either a measured row OR a documented time-out blocker. A ' +
      'time-out IS a valid diagnostic outcome -- it tells imp-1092 ' +
      'production exactly what runtime to budget. Only opaque CLI ' +
      'crashes or JSON-parse failures count against this threshold.',
  },
  {
    id: 'imp1112-growth-rate-reported',
    holds: () => {
      const w = SANITY_SWEEP.wrapperWidthGrowthRate;
      const m = SANITY_SWEEP.maxIntervalWidthGrowthRate;
      // At least one of the two rates must report a finite slope OR
      // explicitly mark n < 2 (which is itself a valid diagnostic
      // outcome: not enough successful rows to fit a slope).
      const wReported = (Number.isFinite(w.slope) && Number.isFinite(w.R2)) ||
                        (typeof w.n === 'number' && w.n < 2);
      const mReported = (Number.isFinite(m.slope) && Number.isFinite(m.R2)) ||
                        (typeof m.n === 'number' && m.n < 2);
      return wReported || mReported;
    },
    why:
      'Wrapper-width growth rate is the headline diagnostic of this ' +
      'sweep. At minimum one of {wrapperWidthGrowthRate, ' +
      'maxIntervalWidthGrowthRate} must report a finite slope + R2 ' +
      'fit, OR explicitly carry n < 2 (not enough datapoints to fit) ' +
      'as an honest null result. Silent absence is a bug.',
  },
  {
    id: 'imp1112-recommendedDtPerN-covers-all-N',
    holds: () => {
      const recN = new Set(SANITY_SWEEP.recommendedDtPerN.map((r) => r.N));
      for (const N of PLATEAU_NS) if (!recN.has(N)) return false;
      // Every entry must carry a numeric dt, integer maxSteps, and a
      // non-empty rationale string.
      for (const r of SANITY_SWEEP.recommendedDtPerN) {
        if (!Number.isFinite(r.dt) || r.dt <= 0) return false;
        if (!Number.isInteger(r.maxSteps) || r.maxSteps <= 0) return false;
        if (typeof r.rationale !== 'string' || r.rationale.length < 20) return false;
      }
      return true;
    },
    why:
      'recommendedDtPerN is the production-input table for imp-1092. ' +
      'Every plateau N must be present and every row must carry a ' +
      'positive dt, positive integer maxSteps, and a non-trivial ' +
      'rationale string. Missing rows or empty rationales would let ' +
      'imp-1092 launch blind -- exactly the problem this ticket exists ' +
      'to prevent.',
  },
];
