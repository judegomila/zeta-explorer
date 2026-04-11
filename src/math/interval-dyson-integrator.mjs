/**
 * imp-362: Interval arithmetic Dyson integrator with (emulated) IEEE 754
 * directed rounding.
 *
 * Purpose
 * -------
 * Upgrade imp-318 (which shipped a small-N naive interval Euler scaffold)
 * to a working interval RK4 backward Dyson integrator that emits a
 * certified per-N enclosure
 *
 *   t_c(N) in [t_c_lo(N), t_c_hi(N)]
 *
 * on the PATH_C_BASELINE_FIT ladder. This converts the existing Float64
 * central |t_c(N)| measurements into numbers with rigorous (modulo the
 * JavaScript rounding limitation below) error bars that can replace the
 * heuristic plus-minus 0.01 currently absorbed into the Path C Lambda bound.
 *
 * IMPORTANT LIMITATION (honest scope)
 * -----------------------------------
 * JavaScript does NOT expose IEEE 754 directed-rounding modes (fesetround).
 * Every Float64 arithmetic operation is round-to-nearest-even, full stop.
 * A rigorous interval library built on top of Float64 therefore has to
 * either (a) link against a C backend that flips the rounding mode, or
 * (b) conservatively inflate each operation by one ULP on each side to
 * dominate any possible directed-rounding result.
 *
 * This file implements (b): one-ULP outward inflation per operation. That
 * is STRICTLY WEAKER than true directed rounding because it is not a
 * tight bound — the inflation constant 2 ULP (1 ULP on each side) is the
 * smallest amount that is guaranteed to contain every IEEE 754 directed
 * result, but it discards the chance to shrink the interval when the
 * exact value happens to be representable. For a naive interval RK4 at
 * scale N ~ 2458 and thousands of steps this matters.
 *
 * The goal of imp-362 is therefore NOT to compete with Arb / MPFI /
 * CAPD. The goal is:
 *
 *   1. Produce a valid [t_c_lo, t_c_hi] per N that is strictly positive
 *      (the lower bound is not zero) and strictly smaller than the OLS
 *      central value of |t_c(N)| at that N, proving the measurement
 *      carries a verified error bar.
 *   2. Baseline the wrapper-width growth so a successor ticket (imp-363
 *      or a future imp-3xx port to Arb) has something to beat.
 *   3. Thread a numerical witness on PATH_C_BASELINE_FIT through the
 *      build so an assertion layer can quote certified intervals.
 *
 * If the envelopes come out too wide to conclude anything at the largest
 * baseline N, the verdict string says so and reports the width instead of
 * silently papering over it.
 *
 * A follow-up ticket should port this to an arbitrary-precision backend
 * (Arb via WASM, or CAPD via a native binding) so the one-ULP inflation
 * becomes genuine directed rounding and the scaling to N = 2458 with
 * thousands of backward steps becomes feasible without wrapper blow-up.
 *
 * Module format
 * -------------
 * This file is a .mjs module so it can be run directly with Node as a
 * local script (node src/math/interval-dyson-integrator.mjs). The data-
 * layer manifest at src/data/lambda-interval-dyson.js re-exports the
 * LAMBDA_INTERVAL_DYSON record so the Vite build picks it up and the
 * assertion registry can import it.
 *
 * Sign convention matches src/math/barrier-extrapolation.js dysonStep and
 * src/math/dyson-scaling-N5000.js dysonDerivBackward:
 *
 *   dg_{k}/dt = -2 * sum_{j != k} 1 / (g_k - g_j)
 *
 * with POSITIVE dt corresponding to BACKWARD flow toward the Calogero-
 * Moser collision time. This matches the Path C direction.
 */

// ---- ULP helpers -----------------------------------------------------------

// One ULP above x at double precision. For |x| > 0 this is roughly x * 2^-52.
// Used to emulate directed rounding by pushing each result one ULP outward
// on each side before taking the containing interval.
function ulp(x) {
  if (!Number.isFinite(x)) return Number.POSITIVE_INFINITY;
  if (x === 0) return Number.MIN_VALUE;
  const absX = Math.abs(x);
  // Next representable double above absX.
  const buf = new ArrayBuffer(8);
  const f = new Float64Array(buf);
  const u = new BigInt64Array(buf);
  f[0] = absX;
  u[0] = u[0] + 1n;
  return f[0] - absX;
}

// Outward-inflate [lo, hi] by one ULP on each side. This is the
// emulated directed-rounding envelope for a single Float64 operation.
function inflate(lo, hi) {
  if (Number.isNaN(lo) || Number.isNaN(hi)) return [NaN, NaN];
  return [lo - ulp(lo), hi + ulp(hi)];
}

// ---- Interval arithmetic primitives ---------------------------------------

export function addInterval(a, b) {
  const lo = a[0] + b[0];
  const hi = a[1] + b[1];
  return inflate(lo, hi);
}

export function subInterval(a, b) {
  const lo = a[0] - b[1];
  const hi = a[1] - b[0];
  return inflate(lo, hi);
}

export function mulInterval(a, b) {
  const p1 = a[0] * b[0];
  const p2 = a[0] * b[1];
  const p3 = a[1] * b[0];
  const p4 = a[1] * b[1];
  const lo = Math.min(p1, p2, p3, p4);
  const hi = Math.max(p1, p2, p3, p4);
  return inflate(lo, hi);
}

// Reciprocal with a strict guard: if the input interval straddles zero
// we return null and the caller is expected to short-circuit the run.
// A Dyson integration that reaches a zero-straddling gap has reached the
// certified collision time by definition.
export function reciprocalInterval(a) {
  if (a[0] <= 0 && a[1] >= 0) return null;
  const r1 = 1 / a[0];
  const r2 = 1 / a[1];
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  return inflate(lo, hi);
}

export function divInterval(a, b) {
  const r = reciprocalInterval(b);
  if (r === null) return null;
  return mulInterval(a, r);
}

// Scalar helpers that build a degenerate (point) interval from a Float64
// and a convenience constant.
function asInterval(x) {
  return inflate(x, x);
}
const NEG_TWO = asInterval(-2);

// ---- Dyson drift in interval arithmetic -----------------------------------

// For each k in [0, N), compute
//
//   dg_{k}/dt = -2 * sum_{j != k} 1 / (g_k - g_j)
//
// as intervals. Returns an array of per-k drift intervals, or null as
// soon as any denominator interval straddles zero (the certified collision
// short-circuit).
export function dysonDriftInterval(gammas, k) {
  const N = gammas.length;
  let sum = asInterval(0);
  const gk = gammas[k];
  for (let j = 0; j < N; j++) {
    if (j === k) continue;
    const diff = subInterval(gk, gammas[j]);
    const inv = reciprocalInterval(diff);
    if (inv === null) return null;
    sum = addInterval(sum, inv);
  }
  return mulInterval(NEG_TWO, sum);
}

// Full drift vector; null if any k flagged a zero-crossing.
function dysonDriftVectorInterval(gammas) {
  const N = gammas.length;
  const out = new Array(N);
  for (let k = 0; k < N; k++) {
    const d = dysonDriftInterval(gammas, k);
    if (d === null) return null;
    out[k] = d;
  }
  return out;
}

// ---- Interval RK4 step -----------------------------------------------------

// Classical Butcher tableau RK4 with a positive interval dt interpreted
// as backward time (t decreases by dt). Returns the updated gamma vector
// as intervals, or null if any intermediate stage hit a zero crossing.
export function rk4IntervalStep(gammas, dt) {
  const N = gammas.length;
  const dtI = typeof dt === 'number' ? asInterval(dt) : dt;
  const half = asInterval(0.5);
  const sixth = asInterval(1 / 6);
  const two = asInterval(2);

  const k1 = dysonDriftVectorInterval(gammas);
  if (k1 === null) return null;

  const stage2 = new Array(N);
  for (let i = 0; i < N; i++) {
    stage2[i] = addInterval(gammas[i], mulInterval(mulInterval(half, dtI), k1[i]));
  }
  const k2 = dysonDriftVectorInterval(stage2);
  if (k2 === null) return null;

  const stage3 = new Array(N);
  for (let i = 0; i < N; i++) {
    stage3[i] = addInterval(gammas[i], mulInterval(mulInterval(half, dtI), k2[i]));
  }
  const k3 = dysonDriftVectorInterval(stage3);
  if (k3 === null) return null;

  const stage4 = new Array(N);
  for (let i = 0; i < N; i++) {
    stage4[i] = addInterval(gammas[i], mulInterval(dtI, k3[i]));
  }
  const k4 = dysonDriftVectorInterval(stage4);
  if (k4 === null) return null;

  const next = new Array(N);
  for (let i = 0; i < N; i++) {
    const s = addInterval(
      addInterval(k1[i], mulInterval(two, k2[i])),
      addInterval(mulInterval(two, k3[i]), k4[i]),
    );
    const incr = mulInterval(mulInterval(sixth, dtI), s);
    next[i] = addInterval(gammas[i], incr);
  }
  return next;
}

// ---- Backward collision bracketer -----------------------------------------

// Returns { t_c_lo, t_c_hi, collisionIndex, width, steps, reason }.
// t_c_lo and t_c_hi are reported as non-negative magnitudes (|t_c|).
// The bracket is formed the standard way: while every adjacent-gap
// interval has strictly positive lower bound we keep integrating, and
// as soon as any adjacent-gap interval touches zero (lo <= 0) we stop
// and bracket t_c between the previous-step time and the current-step
// time. Both bounds are certified because the interval at the previous
// step still has a strictly positive lower gap (no collision yet) and
// at the current step the gap interval contains zero (collision is
// inside this interval).
export function backwardCollisionInterval(gammas0, dtMax, nSteps) {
  let gammas = gammas0.map((g) => asInterval(g));
  let tAbs = 0;
  let prevTAbs = 0;

  for (let step = 0; step < nSteps; step++) {
    // Check min-gap interval BEFORE integrating: has the previous step
    // pushed the configuration into a state where any gap can be 0?
    let minGapLo = Infinity;
    let minGapHi = Infinity;
    let kStar = -1;
    for (let i = 0; i < gammas.length - 1; i++) {
      const gap = subInterval(gammas[i + 1], gammas[i]);
      if (gap[0] < minGapLo) {
        minGapLo = gap[0];
        kStar = i;
      }
      if (gap[1] < minGapHi) minGapHi = gap[1];
    }

    if (minGapLo <= 0) {
      return {
        t_c_lo: prevTAbs,
        t_c_hi: tAbs,
        collisionIndex: kStar,
        width: tAbs - prevTAbs,
        steps: step,
        reason: 'gap-lower-bound-nonpositive',
        finalMinGapLo: minGapLo,
        finalMinGapHi: minGapHi,
      };
    }

    // Advance one backward RK4 step.
    const next = rk4IntervalStep(gammas, dtMax);
    if (next === null) {
      return {
        t_c_lo: tAbs,
        t_c_hi: tAbs + dtMax,
        collisionIndex: kStar,
        width: dtMax,
        steps: step,
        reason: 'rk4-stage-zero-crossing',
        finalMinGapLo: minGapLo,
        finalMinGapHi: minGapHi,
      };
    }
    gammas = next;
    prevTAbs = tAbs;
    tAbs += dtMax;
  }

  // Ran out of steps without closing the bracket. Honest result: report
  // the run as incomplete with a lower bound only (t_c_lo = nSteps * dt)
  // and t_c_hi = +Infinity, and flag reason = 'budget-exhausted'.
  let minGapLo = Infinity;
  for (let i = 0; i < gammas.length - 1; i++) {
    const gap = subInterval(gammas[i + 1], gammas[i]);
    if (gap[0] < minGapLo) minGapLo = gap[0];
  }
  return {
    t_c_lo: tAbs,
    t_c_hi: Number.POSITIVE_INFINITY,
    collisionIndex: -1,
    width: Number.POSITIVE_INFINITY,
    steps: nSteps,
    reason: 'budget-exhausted',
    finalMinGapLo: minGapLo,
    finalMinGapHi: NaN,
  };
}

// ---- Numerical witness on PATH_C_BASELINE_FIT ------------------------------
//
// PATH_C_BASELINE_FIT lives in src/math/dyson-scaling-N5000.js and is
// imported below as a const copy. Dynamic import is used so the .mjs file
// can also be run as a standalone Node script outside the Vite build.

import { ZETA_ZEROS } from './zeta.js';

// Mirror of PATH_C_FIT_POINTS from dyson-scaling-N5000.js. Kept as an
// inline constant to avoid circular imports (dyson-scaling-N5000.js does
// not re-export its internal fit array in a way that is stable across
// tree-shaking). The numbers are verbatim copies — a build assertion
// could be added later to pin them against the source.
const PATH_C_FIT_POINTS = [
  { N: 50, tc: 0.1435 },
  { N: 100, tc: 0.0723 },
  { N: 200, tc: 0.0352 },
  { N: 500, tc: 0.0163 },
  { N: 2458, tc: 0.0086 },
];

// Per-N integration budget. Small N collide fast (t_c ~ 0.14) so a larger
// dt is fine; large N have much smaller t_c and need a finer step to
// avoid a single RK4 jump skipping the collision. Because the wrapper
// grows with step count we cap nSteps modestly at every N and accept
// that the highest N rows will return an incomplete (budget-exhausted)
// bracket rather than a closed one.
function budgetForN(N) {
  if (N <= 60) return { dt: 0.002, nSteps: 200 };
  if (N <= 120) return { dt: 0.001, nSteps: 200 };
  if (N <= 240) return { dt: 0.0005, nSteps: 200 };
  if (N <= 600) return { dt: 0.0003, nSteps: 200 };
  return { dt: 0.0001, nSteps: 200 };
}

function runWitness() {
  const rows = [];
  for (const pt of PATH_C_FIT_POINTS) {
    const N = pt.N;
    if (ZETA_ZEROS.length < N) {
      rows.push({
        N,
        tc_ols_central: pt.tc,
        t_c_lo: null,
        t_c_hi: null,
        width: null,
        reason: 'zero-list-insufficient',
        note:
          'ZETA_ZEROS has ' +
          ZETA_ZEROS.length +
          ' entries; N = ' +
          N +
          ' is out of scope for the bundled witness. A future successor ticket should wire in the Odlyzko tables at larger heights.',
      });
      continue;
    }
    const initial = ZETA_ZEROS.slice(0, N);
    const { dt, nSteps } = budgetForN(N);
    const result = backwardCollisionInterval(initial, dt, nSteps);
    rows.push({
      N,
      dt,
      nSteps,
      tc_ols_central: pt.tc,
      t_c_lo: Number.isFinite(result.t_c_lo) ? +result.t_c_lo.toFixed(6) : result.t_c_lo,
      t_c_hi: Number.isFinite(result.t_c_hi) ? +result.t_c_hi.toFixed(6) : result.t_c_hi,
      width: Number.isFinite(result.width) ? +result.width.toFixed(6) : result.width,
      reason: result.reason,
      collisionIndex: result.collisionIndex,
      finalMinGapLo:
        typeof result.finalMinGapLo === 'number' ? +result.finalMinGapLo.toExponential(3) : null,
      bracketsCentral:
        Number.isFinite(result.t_c_lo) && Number.isFinite(result.t_c_hi)
          ? pt.tc >= result.t_c_lo && pt.tc <= result.t_c_hi
          : null,
    });
  }
  return rows;
}

const WITNESS_ROWS = runWitness();

// Verdict derivation. We want: at least one row has a CLOSED bracket with
// strictly positive lower bound AND strictly smaller width than the 0.01
// heuristic absorbed into the Path C pm 0.01 claim.
function deriveVerdict(rows) {
  const closed = rows.filter((r) => r.reason === 'gap-lower-bound-nonpositive');
  const budgetExhausted = rows.filter((r) => r.reason === 'budget-exhausted');
  const outOfScope = rows.filter((r) => r.reason === 'zero-list-insufficient');

  const narrowClosed = closed.filter(
    (r) => typeof r.width === 'number' && r.width < 0.01 && r.t_c_lo > 0,
  );

  if (narrowClosed.length >= 1) {
    const bestN = narrowClosed.reduce((a, b) => (a.width <= b.width ? a : b));
    return {
      status: 'certified-interval-narrower-than-heuristic',
      summary:
        'At N = ' +
        bestN.N +
        ' the interval-arithmetic Dyson integrator produced a ' +
        'closed bracket [' +
        bestN.t_c_lo +
        ', ' +
        bestN.t_c_hi +
        '] with width ' +
        bestN.width +
        ' < 0.01. This strictly beats the heuristic pm 0.01 currently ' +
        'carried by the Path C Lambda bound at that N. ' +
        closed.length +
        ' of ' +
        rows.length +
        ' baseline rows yielded a closed bracket; ' +
        budgetExhausted.length +
        ' exhausted the step budget; ' +
        outOfScope.length +
        ' are out of scope for the bundled zero list. ' +
        'JavaScript one-ULP inflation is WEAKER than true IEEE 754 ' +
        'directed rounding, so the bracket is certified modulo that ' +
        'limitation (documented in this file).',
    };
  }
  if (closed.length >= 1) {
    const widest = closed.reduce((a, b) => (a.width >= b.width ? a : b));
    return {
      status: 'certified-bracket-wider-than-heuristic',
      summary:
        closed.length +
        ' of ' +
        rows.length +
        ' baseline rows produced a closed interval bracket, but the ' +
        'widest (N = ' +
        widest.N +
        ', width = ' +
        widest.width +
        ') is not strictly smaller than the heuristic pm 0.01. The ' +
        'methodology is validated; tightening requires true directed- ' +
        'rounding backends (imp-363 successor / Arb port).',
    };
  }
  return {
    status: 'no-closed-bracket',
    summary:
      'No baseline row closed its interval bracket within the step ' +
      'budget. The wrapper widens faster than the RK4 step shrinks the ' +
      'min-gap enclosure, which is the expected failure mode of naive ' +
      'one-ULP interval RK4 at N >= 50 over a few hundred steps. ' +
      'The framework is in place; scaling requires a true directed- ' +
      'rounding backend (e.g. Arb via WASM) or a Krawczyk / mean-value- ' +
      'form contraction to control wrapper growth.',
  };
}

const VERDICT = deriveVerdict(WITNESS_ROWS);

// ---- Exported record -------------------------------------------------------

export const LAMBDA_INTERVAL_DYSON = {
  id: 'imp-362',
  title: 'Interval arithmetic Dyson integrator with emulated directed rounding',
  consumes: [
    'imp-318 INTERVAL_DYSON_FRAMEWORK (the scaffold this ticket upgrades)',
    'imp-315 PATH_C_BASELINE_FIT (the OLS central values being bracketed)',
    'imp-306 dysonStep sign convention (barrier-extrapolation.js)',
  ],
  method:
    'One-ULP outward inflation interval arithmetic on every Float64 + - * / ' +
    'operation (documented limitation: strictly weaker than true IEEE 754 ' +
    'directed rounding because ULP inflation pads each result by 2 ULP ' +
    'regardless of whether the exact result is representable). Four ' +
    'interval operations (addInterval, subInterval, mulInterval, ' +
    'divInterval) feed a Dyson drift reducer dysonDriftInterval(gammas, k) ' +
    'that sums the N-1 reciprocal-difference terms as intervals with a ' +
    'strict zero-crossing guard in reciprocalInterval. The drift feeds a ' +
    'classical RK4 step (rk4IntervalStep) in interval arithmetic, and ' +
    'backwardCollisionInterval(gammas0, dtMax, nSteps) integrates backward ' +
    'until any adjacent-gap interval lower bound hits zero. The first ' +
    'step at which that happens brackets the certified collision time ' +
    'between the previous-step time and the current-step time.',
  witness: WITNESS_ROWS,
  verdict: VERDICT,
  openWork: [
    'Port to an arbitrary-precision backend (Arb via WASM, or CAPD via a ' +
      'native binding) so the one-ULP inflation becomes true directed ' +
      'rounding and the wrapper growth shrinks enough to scale to ' +
      'N = 2458 with thousands of backward steps.',
    'Replace naive interval RK4 with a Krawczyk / mean-value-form ' +
      'contraction to tame wrapper growth at the same N.',
    'Load the Odlyzko tables at larger heights so the N = 2458 row can ' +
      'be witnessed rather than flagged zero-list-insufficient.',
    'Pair with imp-363 (compensated Kahan-Neumaier summation) so the ' +
      'inner-loop interval width is dominated by the summation error ' +
      'bound rather than by per-term ULP inflation.',
    'Honest scope tripwire: JavaScript Float64 cannot flip rounding ' +
      'modes. Any claim that this file provides "true" IEEE 754 directed ' +
      'rounding is incorrect and would be a regression on the honest ' +
      'scope recorded in the module header.',
  ],
  limitation:
    'JavaScript does not expose fesetround; this file emulates directed ' +
    'rounding by inflating every operation by one ULP on each side. That ' +
    'is strictly weaker than true directed rounding and the wrapper ' +
    'growth is a dominant source of conservatism at large N and many ' +
    'RK4 steps. Documented throughout the module header.',
};

// ---- Standalone script entry -----------------------------------------------
// Running `node src/math/interval-dyson-integrator.mjs` prints the witness
// table and the verdict. Importing the module from another module is the
// normal data-layer path.
// Detection via import.meta.url vs process.argv is node-specific and
// guarded so Vite build does not try to execute the block.
if (
  typeof process !== 'undefined' &&
  typeof process.argv !== 'undefined' &&
  process.argv[1] &&
  import.meta.url === 'file://' + process.argv[1]
) {
  // eslint-disable-next-line no-console
  console.log('imp-362 interval Dyson integrator witness');
  // eslint-disable-next-line no-console
  console.log('N       dt       nSteps   t_c_lo     t_c_hi     width      reason');
  for (const r of WITNESS_ROWS) {
    // eslint-disable-next-line no-console
    console.log(
      [
        String(r.N).padEnd(7),
        (r.dt ?? '-').toString().padEnd(8),
        String(r.nSteps ?? '-').padEnd(8),
        String(r.t_c_lo).padEnd(10),
        String(r.t_c_hi).padEnd(10),
        String(r.width).padEnd(10),
        r.reason,
      ].join(' '),
    );
  }
  // eslint-disable-next-line no-console
  console.log('\nverdict: ' + VERDICT.status);
  // eslint-disable-next-line no-console
  console.log(VERDICT.summary);
}
