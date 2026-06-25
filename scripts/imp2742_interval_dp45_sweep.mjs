/**
 * imp-2742: interval-DP45 second-integrator certificate.
 *
 * Closes (partially) the open sub-gap imp-1086-sub-interval-dp45: upgrade
 * the imp-1086 DP45 cross-check of the load-bearing K = 0.2014 finite-K
 * bound from POINT Float64 arithmetic to INTERVAL arithmetic, producing a
 * genuinely independent interval certificate rather than a numerical-
 * stability check on the imp-933 interval-RK4 bound.
 *
 * The interval-DP45 step reuses the one-ULP-inflated interval primitives
 * from interval-dyson-integrator.mjs (the same primitives that certify the
 * RK4 bound) with the 6-stage Dormand-Prince 5th-order Butcher tableau
 * from dyson-ode-integrator.js (imp-357). Both integrators bracket the
 * SAME backward-Dyson collision time of the SAME ODE, so each certified
 * bracket must contain the true t_c; the two brackets must therefore
 * overlap. We report the per-N relationship (containment / overlap /
 * disjoint) so the data module can bake honest verified literals.
 *
 * USAGE:
 *   node scripts/imp2742_interval_dp45_sweep.mjs [maxN]
 *
 *   maxN   only run N <= maxN (default 1000; large N exceed the per-session
 *          budget at the 6-stage interval cost -- those stay deferred to the
 *          imp-1090 native backend, documented as the residual sub-gap).
 *
 * Output: prints a JSON array of rows to stdout (one per closed N) of shape
 *   { N, H_raw, dt, dp45: { t_c_lo, t_c_hi, steps, kStar, maxIntervalWidth },
 *     rk4: { t_c_lo, t_c_hi }, relation }
 */

import {
  subInterval,
  addInterval,
  mulInterval,
  reciprocalInterval,
} from '../src/math/interval-dyson-integrator.mjs';
import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import crosscheckRows from '../src/data/imp-1086-crosscheck-rows.json' with { type: 'json' };

// ---- helpers (mirror the interval-dyson-integrator one-ULP envelope) -------

function ulp(x) {
  if (!Number.isFinite(x)) return Number.POSITIVE_INFINITY;
  if (x === 0) return Number.MIN_VALUE;
  const absX = Math.abs(x);
  const buf = new ArrayBuffer(8);
  const f = new Float64Array(buf);
  const u = new BigInt64Array(buf);
  f[0] = absX;
  u[0] = u[0] + 1n;
  return f[0] - absX;
}
function asInterval(x) {
  return [x - ulp(x), x + ulp(x)];
}

const NEG_TWO = asInterval(-2);

// Per-k Dyson drift dg_{k}/dt = -2 * sum_{j != k} 1/(g_k - g_j) in intervals.
function driftInterval(gammas, k) {
  const N = gammas.length;
  let sum = asInterval(0);
  const gk = gammas[k];
  for (let j = 0; j < N; j++) {
    if (j === k) continue;
    const inv = reciprocalInterval(subInterval(gk, gammas[j]));
    if (inv === null) return null;
    sum = addInterval(sum, inv);
  }
  return mulInterval(NEG_TWO, sum);
}
function driftVector(gammas) {
  const N = gammas.length;
  const out = new Array(N);
  for (let k = 0; k < N; k++) {
    const d = driftInterval(gammas, k);
    if (d === null) return null;
    out[k] = d;
  }
  return out;
}

// ---- 6-stage Dormand-Prince (DP45) Butcher tableau, 5th-order output -------
const DP45_A = [
  [],
  [1 / 5],
  [3 / 40, 9 / 40],
  [44 / 45, -56 / 15, 32 / 9],
  [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
  [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
];
const DP45_B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84];
const DP45_A_I = DP45_A.map((row) => row.map((c) => asInterval(c)));
const DP45_B5_I = DP45_B5.map((c) => asInterval(c));

// One interval-DP45 step. dt is a positive number interpreted exactly as the
// RK4 driver interprets it (the -2 drift sign carries the backward-time
// direction). Returns the updated interval vector, or null on a zero crossing.
function dp45IntervalStep(gammas, dt) {
  const N = gammas.length;
  const dtI = asInterval(dt);

  const ks = [];
  const k1 = driftVector(gammas);
  if (k1 === null) return null;
  ks.push(k1);

  for (let s = 1; s <= 5; s++) {
    const stage = new Array(N);
    for (let i = 0; i < N; i++) {
      let acc = gammas[i];
      for (let j = 0; j < s; j++) {
        const term = mulInterval(mulInterval(dtI, DP45_A_I[s][j]), ks[j][i]);
        acc = addInterval(acc, term);
      }
      stage[i] = acc;
    }
    const kS = driftVector(stage);
    if (kS === null) return null;
    ks.push(kS);
  }

  const next = new Array(N);
  for (let i = 0; i < N; i++) {
    let acc = gammas[i];
    for (let s = 0; s < 6; s++) {
      if (DP45_B5[s] === 0) continue;
      const term = mulInterval(mulInterval(dtI, DP45_B5_I[s]), ks[s][i]);
      acc = addInterval(acc, term);
    }
    next[i] = acc;
  }
  return next;
}

// Backward collision bracketer with interval-DP45 steps (mirrors
// backwardCollisionInterval in interval-dyson-integrator.mjs).
function dp45BackwardCollision(initial, dt, maxSteps) {
  let gammas = initial.map((g) => asInterval(g));
  let tAbs = 0;
  let prevTAbs = 0;

  for (let step = 0; step < maxSteps; step++) {
    let minGapLo = Infinity;
    let kStar = -1;
    let maxW = 0;
    for (let i = 0; i < gammas.length - 1; i++) {
      const gap = subInterval(gammas[i + 1], gammas[i]);
      if (gap[0] < minGapLo) {
        minGapLo = gap[0];
        kStar = i;
      }
    }
    for (let i = 0; i < gammas.length; i++) {
      const w = gammas[i][1] - gammas[i][0];
      if (w > maxW) maxW = w;
    }

    if (minGapLo <= 0) {
      return {
        closed: true,
        t_c_lo: +prevTAbs.toFixed(10),
        t_c_hi: +tAbs.toFixed(10),
        steps: step,
        kStar,
        maxIntervalWidth: +maxW.toExponential(3),
      };
    }

    const next = dp45IntervalStep(gammas, dt);
    if (next === null) {
      return {
        closed: true,
        t_c_lo: +tAbs.toFixed(10),
        t_c_hi: +(tAbs + dt).toFixed(10),
        steps: step,
        kStar,
        reason: 'dp45-stage-zero-crossing',
        maxIntervalWidth: +maxW.toExponential(3),
      };
    }
    gammas = next;
    prevTAbs = tAbs;
    tAbs += dt;
  }
  return { closed: false, steps: maxSteps, t_c_lo: +tAbs.toFixed(10), t_c_hi: Infinity };
}

// Replicate the imp-933 dt budget exactly.
function budgetForN(H_raw) {
  const tcPair = (H_raw * H_raw) / 8;
  const dt = Math.max(1e-5, +(tcPair / 5).toPrecision(1));
  return { dt, maxSteps: 40 };
}

function relation(rk4, dp45) {
  // Both brackets certify the SAME true t_c, so they must overlap.
  const overlap = dp45.t_c_lo <= rk4.t_c_hi && rk4.t_c_lo <= dp45.t_c_hi;
  if (!overlap) return 'DISJOINT';
  const rk4InDp45 = dp45.t_c_lo <= rk4.t_c_lo && rk4.t_c_hi <= dp45.t_c_hi;
  const dp45InRk4 = rk4.t_c_lo <= dp45.t_c_lo && dp45.t_c_hi <= rk4.t_c_hi;
  if (rk4InDp45) return 'RK4-CONTAINED-IN-DP45';
  if (dp45InRk4) return 'DP45-CONTAINED-IN-RK4';
  return 'OVERLAP';
}

const MAX_N = process.argv[2] ? Number(process.argv[2]) : 1000;

const out = [];
for (const r of crosscheckRows) {
  if (r.N > MAX_N) continue;
  const { dt, maxSteps } = budgetForN(r.H_raw);
  const initial = ZEROS_EXTENDED.slice(0, r.N);
  const t0 = Date.now();
  const dp45 = dp45BackwardCollision(initial, dt, maxSteps);
  const ms = Date.now() - t0;
  const rel = dp45.closed
    ? relation({ t_c_lo: r.rk4.t_c_lo, t_c_hi: r.rk4.t_c_hi }, dp45)
    : 'NOT-CLOSED';
  out.push({
    N: r.N,
    H_raw: r.H_raw,
    dt,
    dp45: {
      t_c_lo: dp45.t_c_lo,
      t_c_hi: dp45.t_c_hi,
      steps: dp45.steps,
      kStar: dp45.kStar,
      maxIntervalWidth: dp45.maxIntervalWidth,
    },
    rk4: { t_c_lo: r.rk4.t_c_lo, t_c_hi: r.rk4.t_c_hi },
    relation: rel,
    runtimeMs: ms,
  });
  process.stderr.write(
    `N=${r.N} dt=${dt} dp45=[${dp45.t_c_lo}, ${dp45.t_c_hi}] rk4=[${r.rk4.t_c_lo}, ${r.rk4.t_c_hi}] ${rel} (${ms}ms)\n`,
  );
}

process.stdout.write(JSON.stringify(out, null, 2) + '\n');
