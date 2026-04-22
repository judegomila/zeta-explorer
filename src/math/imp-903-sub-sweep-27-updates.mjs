/**
 * imp-903-sub-sweep-27-updates: run the baseline interval RK4 at each
 * of the 27 H_raw-update N values identified in
 * src/math/imp-857-uniform-K-bound.js.
 *
 * OUTPUT: writes JSON rows to stdout (redirect to file for persistence).
 * Each row: { N, H_raw, t_c_pair, closed, steps, maxIntervalWidth,
 *             t_c_lo, t_c_hi, runtimeSec }.
 *
 * After a full run, downstream can aggregate into
 * src/data/imp-903-uniform-sweep-result.js for build-time assertion.
 *
 * Runtime: O(N²) per step × ~3 steps per N × 27 N values. Small N
 * dominate in count, large N dominate in time. At N=6710 one step is
 * ~30s; 3 steps per N × 27 N values × weighted avg = 9-18 h total.
 *
 * USAGE:
 *   node src/math/imp-903-sub-sweep-27-updates.mjs [startIdx] [endIdx]
 *   (indices into the 27-element H_RAW_UPDATES list; defaults 0..27)
 */

import {
  subInterval,
  rk4IntervalStep,
} from './interval-dyson-integrator.mjs';
import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';
import { IMP_857_UNIFORM_K_BOUND } from './imp-857-uniform-K-bound.js';

function minGapRaw(zeros, N) {
  let H = Infinity;
  for (let i = 1; i < N; i++) {
    const g = zeros[i] - zeros[i - 1];
    if (g < H) H = g;
  }
  return H;
}

function runBaselineAtN(N, dt, maxSteps) {
  const initial = ZEROS_EXTENDED.slice(0, N);
  let gammas = initial.map((g) => [g, g]);
  let tAbs = 0;
  for (let step = 0; step < maxSteps; step++) {
    let mgLo = Infinity;
    let mgHi = Infinity;
    for (let i = 0; i < gammas.length - 1; i++) {
      const gap = subInterval(gammas[i + 1], gammas[i]);
      if (gap[0] < mgLo) {
        mgLo = gap[0];
        mgHi = gap[1];
      }
    }
    let maxW = 0;
    for (let i = 0; i < gammas.length; i++) {
      const w = gammas[i][1] - gammas[i][0];
      if (w > maxW) maxW = w;
    }
    if (mgLo <= 0) {
      return {
        N,
        closed: true,
        steps: step,
        tAbs: +tAbs.toFixed(8),
        t_c_lo: +(tAbs - dt).toFixed(8),
        t_c_hi: +tAbs.toFixed(8),
        collisionWidth: dt,
        maxIntervalWidth: +maxW.toExponential(3),
        minGapLoAtCollision: +mgLo.toExponential(3),
      };
    }
    const next = rk4IntervalStep(gammas, dt);
    if (next === null) {
      return {
        N,
        closed: 'rk4-returned-null',
        steps: step,
        tAbs: +tAbs.toFixed(8),
        maxIntervalWidth: +maxW.toExponential(3),
      };
    }
    gammas = next;
    tAbs += dt;
  }
  return {
    N,
    closed: false,
    steps: maxSteps,
    tAbs: +tAbs.toFixed(8),
    note: 'budget exhausted before collision',
  };
}

function log(msg) {
  process.stdout.write(msg + '\n');
}

const UPDATES = IMP_857_UNIFORM_K_BOUND.hRawUpdates;

const args = process.argv.slice(2).map(Number);
const startIdx = Number.isFinite(args[0]) ? args[0] : 0;
const endIdx = Number.isFinite(args[1]) ? args[1] : UPDATES.length;

log(
  `imp-903-sub-sweep-27-updates  start=${startIdx}  end=${endIdx}  ` +
  `total=${UPDATES.length}`,
);
log(
  '----------------------------------------------------------------------',
);

// Pick dt per N to reach collision in < 20 steps.
function budgetForN(N, H_raw) {
  const tcPair = (H_raw * H_raw) / 8;
  // aim for collision in ~3-10 RK4 steps.
  const dt = Math.max(1e-5, +(tcPair / 5).toPrecision(1));
  return { dt, maxSteps: 30 };
}

const results = [];
for (let i = startIdx; i < endIdx; i++) {
  const u = UPDATES[i];
  // For i=0,1 (N=2,3) the Dyson flow has trivial structure; skip the
  // interval RK4 (closed form).
  if (u.N < 10) {
    log(
      `[${i}/${UPDATES.length}]  N=${u.N}  H_raw=${u.newH_raw}  SKIP (trivial 2-body/3-body)`,
    );
    results.push({
      N: u.N,
      H_raw: u.newH_raw,
      skip: 'trivial-few-body',
    });
    continue;
  }
  const { dt, maxSteps } = budgetForN(u.N, u.newH_raw);
  log(
    `[${i}/${UPDATES.length}]  N=${u.N}  H_raw=${u.newH_raw}  dt=${dt}  maxSteps=${maxSteps}`,
  );
  const t0 = Date.now();
  const r = runBaselineAtN(u.N, dt, maxSteps);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const row = { ...r, H_raw_update: u.newH_raw, runtimeSec: +elapsed };
  results.push(row);
  log(`  result: ${JSON.stringify(row)}  (${elapsed}s)`);
}

log('');
log('=== SUMMARY ===');
log(`Ran ${results.length} rows`);
const closed = results.filter((r) => r.closed === true);
log(`Closed: ${closed.length}`);
const widestW = closed.length
  ? Math.max(...closed.map((r) => r.maxIntervalWidth))
  : null;
log(`Widest maxIntervalWidth: ${widestW}`);
log('');
log('ROWS (JSON):');
log(JSON.stringify(results, null, 2));
