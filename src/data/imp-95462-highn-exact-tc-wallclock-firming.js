/**
 * @module imp-95462-highn-exact-tc-wallclock-firming
 * @fileoverview imp-95462 -- WALL-CLOCK FIRMING of the imp-95481 costed offline
 *   route for the single unexecuted high-N residual
 *   imp-2563-sub-pathc-ladder-replace-highN (the EXACT heat-semigroup
 *   discriminant recompute of t_c(N=2458)). imp-95481 delivered the native
 *   Arb/FLINT route, the ~3.0e4-bit precision budget, the checkpoint/parallel
 *   plan and the re-pointing analysis, but left the WALL-CLOCK as a wide,
 *   ungrounded bracket O(1)-O(1e2) core-hours because the per-Arb-multiply cost
 *   at the ~470-limb working precision was UNBENCHMARKED. imp-95481 explicitly
 *   named "firm the wall-clock via the imp-95461 Arb multiply micro-benchmark
 *   FIRST" as the next step. That micro-benchmark now exists
 *   (native/imp-95461-mul-bench/), so this module CONSUMES its measured
 *   ns-per-multiply anchors to firm the per-multiply and per-step legs and to
 *   RELOCATE the residual uncertainty from a hardware unknown to a single
 *   algorithmic factor (the root-isolation sweep count).
 *
 *   ASSESSMENT/MEASUREMENT ONLY: it runs no recompute, fires no certificate,
 *   imports no data table, asserts NO exact t_c value, and moves NO bound. R_A
 *   stays OPEN; no refereed bound is changed. NO QED.
 *
 *   THE MEASURED MULTIPLY ANCHOR (from imp-95461)
 *   ---------------------------------------------
 *   The imp-95461 in-repo Arb/FLINT micro-benchmark times a full arb mantissa
 *   multiply across 2..40 limbs on this platform. A subset of its measured
 *   ns-per-multiply values is baked below as the firming INPUT. Over the whole
 *   2..32-limb decade the effective log-log growth exponent is
 *     e_meas = log(ns[32]/ns[2]) / log(32/2) ~ 1.59,
 *   i.e. the multiply is ALREADY sub-quadratic in the measured range -- FLINT
 *   crosses into Karatsuba well below 32 limbs, so the pure schoolbook L^2
 *   replay factors used by imp-95277/imp-95380 OVER-cost the multiply. This is
 *   the key correction the benchmark supplies to the wall-clock leg.
 *
 *   EXTRAPOLATION TO THE ~470-LIMB WORKING PRECISION
 *   -----------------------------------------------
 *   The recompute runs at p ~ 3.0e4 bits ~ 469 64-bit limbs (imp-95481 budget).
 *   Anchoring at the measured L = 32 point (~353.9 ns) and extrapolating:
 *     - at the measured exponent e_meas ~ 1.59: per-multiply ~ 25 us,
 *     - at the pessimistic schoolbook exponent 2.0 (a hard CAP, since FLINT
 *       switches to Toom-3/FFT above ~40-100 limbs, dropping the true exponent
 *       toward ~1.46 and then ~1+eps): per-multiply ~ 76 us.
 *   So the per-multiply cost at 469 limbs is FIRMED to the bracket [25, 76] us,
 *   with the low end the realistic value (Toom/FFT make it no worse, likely
 *   lower) and the high end a schoolbook cap that the measured exponent already
 *   rules out. This replaces imp-95481's un-anchored per-multiply guess.
 *
 *   FIRMED PER-STEP AND TOTAL
 *   -------------------------
 *   Reusing imp-95481's operation model (one degree-d = 2458 real-root isolation
 *   SWEEP ~ d^2 ~ 6.04e6 arb multiplies; ~80 sequential s-bisection steps):
 *     - per-step, single sweep: [2.6, 7.7] minutes,
 *     - total over 80 steps, single sweep per step: [3.4, 10.2] CORE-HOURS.
 *   The full job total is (single-sweep total) x S, where S = number of d^2
 *   root-isolation refinement sweeps per s-collision test. S is the SOLE
 *   remaining unknown: it is an ALGORITHMIC / software factor (how many
 *   subdivision-refinement passes Arb real-root isolation needs to certify the
 *   collision count at each s), NOT a hardware unknown. For a plausible
 *   S ~ 5-10 the firmed total is ~17-100 core-hours; at S = 1 it is ~3.4-10.2.
 *   Either way the job remains offline-only and embarrassingly checkpointable.
 *
 *   NET EFFECT ON THE go/no-go
 *   --------------------------
 *   The go/no-go is UNCHANGED from imp-95481 (NO-GO inline, FEASIBLE offline,
 *   LOW priority, non-binding consumer, NO bound moved). What this module adds is
 *   CONFIDENCE: the hardware-cost leg of the wall-clock is now measured-anchored,
 *   so the wide O(1)-O(1e2) core-hour bracket is resolved into a firm
 *   single-sweep floor [3.4, 10.2] core-hours plus one bounded algorithmic
 *   multiplier S. The recompute buys audit completeness on the highest Path C
 *   lever-arm rung, never a tighter Lambda.
 *
 * @see src/data/imp-95481-highn-exact-tc-offline-route-scope.js (route, precision, re-pointing)
 * @see src/data/imp-2563-pathc-exact-tc-ladder.js (residual + imp-2605 reduction + imp-2626 ceiling)
 * @see native/imp-95461-mul-bench/bench_results_ext.csv (measured Arb multiply ns/limb this module consumes)
 */

// ── Measured Arb/FLINT multiply anchors from imp-95461 (ns per full multiply) ──
// Subset of native/imp-95461-mul-bench/bench_results_ext.csv on this platform.
const MUL_NS_BY_LIMB = [
  { limbs: 2, ns: 4.284 },
  { limbs: 8, ns: 29.10 },
  { limbs: 16, ns: 107.49 },
  { limbs: 24, ns: 200.97 },
  { limbs: 32, ns: 353.86 },
];

// Effective log-log growth exponent over the measured 2..32-limb decade.
const NS_LO = MUL_NS_BY_LIMB[0].ns;
const NS_HI = MUL_NS_BY_LIMB[MUL_NS_BY_LIMB.length - 1].ns;
const L_LO = MUL_NS_BY_LIMB[0].limbs;
const L_HI = MUL_NS_BY_LIMB[MUL_NS_BY_LIMB.length - 1].limbs;
const E_MEAS = Math.log(NS_HI / NS_LO) / Math.log(L_HI / L_LO); // ~1.59

// Target working precision from the imp-95481 budget.
const P_BITS_BUDGET = 3.0e4;
const TARGET_LIMBS = Math.ceil(P_BITS_BUDGET / 64); // 469
const N_HIGH = 2458;
const MULTIPLIES_PER_SWEEP = N_HIGH * N_HIGH; // ~6.04e6 arb multiplies (imp-95481 model)
const S_BISECTION_STEPS = 80; // imp-95481 s-bisection count

// Per-multiply at the target limb count, anchored at L = 32, at exponent `exp`.
const perMulUsAtExp = (exp) =>
  (Math.pow(TARGET_LIMBS / L_HI, exp) * NS_HI) / 1000; // ns -> us

const PER_MUL_US_MEAS = perMulUsAtExp(E_MEAS);   // ~25 us (realistic)
const PER_MUL_US_SCHOOLBOOK = perMulUsAtExp(2.0); // ~76 us (schoolbook cap)

// Single-sweep totals (one d^2 root-isolation sweep per s-step).
const coreHoursSingleSweep = (perMulUs) =>
  (S_BISECTION_STEPS * MULTIPLIES_PER_SWEEP * perMulUs * 1e-6) / 3600;

const TOTAL_CORE_HOURS_MEAS = coreHoursSingleSweep(PER_MUL_US_MEAS);        // ~3.4
const TOTAL_CORE_HOURS_SCHOOLBOOK = coreHoursSingleSweep(PER_MUL_US_SCHOOLBOOK); // ~10.2

export const HIGHN_EXACT_TC_WALLCLOCK_FIRMING = {
  id: 'imp-95462',
  residual: 'imp-2563-sub-pathc-ladder-replace-highN',
  ticket: 'imp-95462',
  status:
    'wall-clock leg FIRMED from the imp-95461 measured multiply anchor; recompute NOT run (assessment only, no bound moved)',
  title:
    'Firm the imp-95481 offline wall-clock for the exact heat-semigroup ' +
    't_c(N=2458) recompute using the imp-95461 measured Arb-multiply cost',

  builtOn:
    'imp-95481 delivered the native Arb/FLINT route, the ~3.0e4-bit precision ' +
    'budget, the checkpoint/parallel plan and the re-pointing analysis; this ' +
    'module only firms the wall-clock leg imp-95481 left un-anchored.',

  measuredMultiplyAnchor: {
    source: 'native/imp-95461-mul-bench (in-repo Arb/FLINT multiply micro-benchmark)',
    nsByLimb: MUL_NS_BY_LIMB,
    effectiveExponent: +E_MEAS.toFixed(3),
    reading:
      'effective log-log exponent ~' + E_MEAS.toFixed(2) + ' over 2..32 limbs is ' +
      'SUB-quadratic, so FLINT is already in Karatsuba well below 32 limbs and the ' +
      'pure schoolbook L^2 replay factors (imp-95277/imp-95380) OVER-cost the multiply.',
  },

  extrapolation: {
    targetLimbs: TARGET_LIMBS,
    targetBits: P_BITS_BUDGET,
    perMultiplyUsMeasured: +PER_MUL_US_MEAS.toFixed(1),
    perMultiplyUsSchoolbookCap: +PER_MUL_US_SCHOOLBOOK.toFixed(1),
    note:
      'anchored at the measured L=32 point (~' + NS_HI.toFixed(1) + ' ns); the ' +
      'measured-exponent value ~' + PER_MUL_US_MEAS.toFixed(0) + ' us is realistic ' +
      '(Toom-3/FFT above ~40-100 limbs make it no worse, likely lower) and the ' +
      'schoolbook-2.0 value ~' + PER_MUL_US_SCHOOLBOOK.toFixed(0) + ' us is a hard cap ' +
      'the measured exponent already rules out.',
  },

  firmedWallClock: {
    operationModel:
      'imp-95481 model: one degree-' + N_HIGH + ' root-isolation SWEEP ~ d^2 ~ ' +
      MULTIPLIES_PER_SWEEP.toExponential(2) + ' arb multiplies; ~' + S_BISECTION_STEPS +
      ' sequential s-bisection steps',
    perStepMinutesSingleSweep: [
      +((MULTIPLIES_PER_SWEEP * PER_MUL_US_MEAS * 1e-6) / 60).toFixed(2),
      +((MULTIPLIES_PER_SWEEP * PER_MUL_US_SCHOOLBOOK * 1e-6) / 60).toFixed(2),
    ],
    totalCoreHoursSingleSweep: [
      +TOTAL_CORE_HOURS_MEAS.toFixed(1),
      +TOTAL_CORE_HOURS_SCHOOLBOOK.toFixed(1),
    ],
    residualUnknown:
      'S = number of d^2 root-isolation refinement sweeps per s-collision test. ' +
      'Full total = (single-sweep total) x S. S is a bounded ALGORITHMIC/software ' +
      'factor (Arb subdivision passes), NOT a hardware unknown; for S ~ 5-10 the ' +
      'firmed total is ~17-100 core-hours.',
    improvementOverImp95481:
      'imp-95481 left the wall-clock as an un-anchored O(1)-O(1e2) core-hour bracket; ' +
      'the hardware-cost leg is now measured-anchored to a firm single-sweep floor ' +
      '[' + TOTAL_CORE_HOURS_MEAS.toFixed(1) + ', ' + TOTAL_CORE_HOURS_SCHOOLBOOK.toFixed(1) +
      '] core-hours plus one bounded algorithmic multiplier S.',
  },

  goNoGo: {
    unchangedFromImp95481: true,
    inline: 'NO-GO (arbitrary-precision degree-2458 job; correctly a residual)',
    offline: 'FEASIBLE on the existing FLINT toolchain; single-sweep floor now firmed',
    priority:
      'LOW -- consumer non-binding (imp-2626 ceiling ~7.4e-3 << 0.2); the exact rung ' +
      'buys provenance/audit completeness on the highest Path C lever-arm point, not a ' +
      'tighter Lambda',
  },

  honest:
    'Firming only. No recompute is run, no exact t_c(2458) is asserted, no certificate ' +
    'fires, no data table is imported, and no bound is moved. The measured multiply ' +
    'anchors are consumed from the concurrent imp-95461 micro-benchmark. R_A remains ' +
    'OPEN and no refereed bound is changed. NO QED.',

  sources: [
    'src/data/imp-95481-highn-exact-tc-offline-route-scope.js (route/precision/re-pointing)',
    'src/data/imp-2563-pathc-exact-tc-ladder.js (residual + imp-2605 + imp-2626)',
    'native/imp-95461-mul-bench/bench_results_ext.csv (measured Arb multiply ns/limb)',
  ],
};

// ── Build-time assertions (pure arithmetic on the baked figures; NO heavy compute) ─
export const HIGHN_EXACT_TC_WALLCLOCK_FIRMING_ASSERTIONS = [
  {
    id: 'imp95462-multiply-is-subquadratic',
    holds: () => E_MEAS > 1.4 && E_MEAS < 2.0,
    why:
      'the measured effective exponent (~' + E_MEAS.toFixed(2) + ') over 2..32 limbs is ' +
      'strictly sub-quadratic, so FLINT is already in Karatsuba and the schoolbook L^2 ' +
      'replay factors over-cost the multiply -- the correction this firming supplies.',
  },
  {
    id: 'imp95462-perstep-bracket-ordered',
    holds: () =>
      PER_MUL_US_MEAS > 0 &&
      PER_MUL_US_MEAS < PER_MUL_US_SCHOOLBOOK &&
      TOTAL_CORE_HOURS_MEAS < TOTAL_CORE_HOURS_SCHOOLBOOK,
    why:
      'the measured-exponent per-multiply and single-sweep total must be the LOW ends ' +
      'and the schoolbook-cap values the HIGH ends, so the firmed bracket is internally ' +
      'ordered and the schoolbook value is a true cap.',
  },
  {
    id: 'imp95462-firming-is-assessment-only',
    holds: () =>
      HIGHN_EXACT_TC_WALLCLOCK_FIRMING.goNoGo.unchangedFromImp95481 === true &&
      HIGHN_EXACT_TC_WALLCLOCK_FIRMING.goNoGo.inline.startsWith('NO-GO') &&
      HIGHN_EXACT_TC_WALLCLOCK_FIRMING.honest.includes('no bound is moved'),
    why:
      'this ticket firms a cost estimate only: it must keep the imp-95481 go/no-go, ' +
      'record NO-GO inline, and assert that no bound is moved, so no reader mistakes the ' +
      'firming for a delivered recompute or bound. No QED.',
  },
];

// ── Self-executing witness (throws at import if any firming invariant regresses) ──
for (const a of HIGHN_EXACT_TC_WALLCLOCK_FIRMING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      '[imp-95462-highn-exact-tc-wallclock-firming] build-time assertion failed: ' +
        a.id + ' - ' + a.why,
    );
  }
}
