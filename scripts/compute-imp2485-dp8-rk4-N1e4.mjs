#!/usr/bin/env node
/**
 * scripts/compute-imp2485-dp8-rk4-N1e4.mjs
 *
 * imp-2485: Lambda-chain step 2 cross-verification at N = 1e4 — run BOTH a
 * genuine 8th-order Dormand-Prince integrator (the 12-stage DOP853 tableau,
 * Hairer-Norsett-Wanner) AND the classical Float64 RK4 backward from the
 * first 10 000 Odlyzko zero ordinates, bracket the collision time with the
 * interval-RK4 backend (Rust CLI when present, imp-1091 dispatch), and write
 * a JSON sidecar consumed by src/data/imp-2485-dp8-rk4-N1e4.js.
 *
 * This closes the two named sub-gaps of imp-2466:
 *   GAP-2466-dp8-upgrade      : the second integrator there was DP5(4); here
 *                               it is the true 8th-order DP tableau.
 *   GAP-2466-fresh-N1e4-1e6   : the N = 1e4 row is computed here from the
 *                               full ZEROS_EXTENDED Odlyzko table (offline,
 *                               so no Vite-build-time cost). N in {1e5, 1e6}
 *                               remain open (see sidecar remainingGaps).
 *
 * Tableau provenance: coefficients are transcribed VERBATIM from
 * scipy/integrate/_ivp/dop853_coefficients.py (scipy v1.13.0), which is the
 * Hairer DOP853 implementation of the Dormand-Prince 8(5,3) method whose
 * propagating solution is order 8. They are machine-validated below by
 * (a) row-sum consistency sum_j a_ij = c_i, (b) the eight quadrature order
 * conditions sum_i b_i c_i^(k-1) = 1/k for k = 1..8, and (c) an empirical
 * self-convergence order measurement on the actual Dyson system at N = 50.
 *
 * Usage:
 *   node scripts/compute-imp2485-dp8-rk4-N1e4.mjs            # full run
 *   node scripts/compute-imp2485-dp8-rk4-N1e4.mjs --smoke    # N=500 dry run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import { backwardCollisionRK4 } from '../src/math/dyson-scaling-N5000.js';
import { callIntervalRk4Async } from './compute-imp423-missing-N.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(
  __dirname,
  '../src/data/imp-2485-dp8-rk4-N1e4-rows.json',
);
const SMOKE = process.argv.includes('--smoke');

// ── DOP853 propagating tableau (12 stages, order 8) ─────────────────────────
// Verbatim from scipy v1.13.0 dop853_coefficients.py (C[:12], A[:12,:12],
// B = A[12,:12]). Do not edit by hand; validated below.
const DP8_C = [
  0.0, 0.526001519587677318785587544488e-01, 0.789002279381515978178381316732e-01, 0.118350341907227396726757197510, 0.281649658092772603273242802490, 0.333333333333333333333333333333, 0.25, 0.307692307692307692307692307692, 0.651282051282051282051282051282, 0.6, 0.857142857142857142857142857142, 1.0,
];
const DP8_A = [
  [],
  [5.26001519587677318785587544488e-2],
  [1.97250569845378994544595329183e-2, 5.91751709536136983633785987549e-2],
  [2.95875854768068491816892993775e-2, 0, 8.87627564304205475450678981324e-2],
  [2.41365134159266685502369798665e-1, 0, -8.84549479328286085344864962717e-1, 9.24834003261792003115737966543e-1],
  [3.7037037037037037037037037037e-2, 0, 0, 1.70828608729473871279604482173e-1, 1.25467687566822425016691814123e-1],
  [3.7109375e-2, 0, 0, 1.70252211019544039314978060272e-1, 6.02165389804559606850219397283e-2, -1.7578125e-2],
  [3.70920001185047927108779319836e-2, 0, 0, 1.70383925712239993810214054705e-1, 1.07262030446373284651809199168e-1, -1.53194377486244017527936158236e-2, 8.27378916381402288758473766002e-3],
  [6.24110958716075717114429577812e-1, 0, 0, -3.36089262944694129406857109825, -8.68219346841726006818189891453e-1, 2.75920996994467083049415600797e1, 2.01540675504778934086186788979e1, -4.34898841810699588477366255144e1],
  [4.77662536438264365890433908527e-1, 0, 0, -2.48811461997166764192642586468, -5.90290826836842996371446475743e-1, 2.12300514481811942347288949897e1, 1.52792336328824235832596922938e1, -3.32882109689848629194453265587e1, -2.03312017085086261358222928593e-2],
  [-9.3714243008598732571704021658e-1, 0, 0, 5.18637242884406370830023853209, 1.09143734899672957818500254654, -8.14978701074692612513997267357, -1.85200656599969598641566180701e1, 2.27394870993505042818970056734e1, 2.49360555267965238987089396762, -3.0467644718982195003823669022],
  [2.27331014751653820792359768449, 0, 0, -1.05344954667372501984066689879e1, -2.00087205822486249909675718444, -1.79589318631187989172765950534e1, 2.79488845294199600508499808837e1, -2.85899827713502369474065508674, -8.87285693353062954433549289258, 1.23605671757943030647266201528e1, 6.43392746015763530355970484046e-1],
];
const DP8_B = [
  5.42937341165687622380535766363e-2, 0, 0, 0, 0, 4.45031289275240888144113950566, 1.89151789931450038304281599044, -5.8012039600105847814672114227, 3.1116436695781989440891606237e-1, -1.52160949662516078556178806805e-1, 2.01365400804030348374776537501e-1, 4.47106157277725905176885569043e-2,
];
const N_STAGES = 12;

// ── Tableau validation ───────────────────────────────────────────────────────
function validateTableau() {
  let maxRowSumResidual = 0;
  for (let i = 1; i < N_STAGES; i++) {
    const s = DP8_A[i].reduce((a, b) => a + b, 0);
    const r = Math.abs(s - DP8_C[i]);
    if (r > maxRowSumResidual) maxRowSumResidual = r;
  }
  let maxQuadratureResidual = 0;
  for (let k = 1; k <= 8; k++) {
    let s = 0;
    for (let i = 0; i < N_STAGES; i++) s += DP8_B[i] * Math.pow(DP8_C[i], k - 1);
    const r = Math.abs(s - 1 / k);
    if (r > maxQuadratureResidual) maxQuadratureResidual = r;
  }
  return { maxRowSumResidual, maxQuadratureResidual };
}

// ── Kahan-Neumaier compensated backward Dyson drift ──────────────────────────
// dg_{k*}/dt form: dg_n/dt = -2 * sum over j != n of 1 / (g_n - g_j),
// backward (collision) direction. Identical reduction to backwardCollisionRK4
// (dyson-scaling-N5000.js) and to imp-2466, so the only difference between the
// integrators is the time-stepping tableau.
function dysonDerivBackward(g) {
  const N = g.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0;
    let c = 0;
    const gn = g[n];
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const d = gn - g[k];
      if (Math.abs(d) < 1e-15) continue;
      const y = 1 / d - c;
      const tt = sum + y;
      c = tt - sum - y;
      sum = tt;
    }
    dg[n] = -2 * sum;
  }
  return dg;
}

function dp8Step(g, dt) {
  const N = g.length;
  const ks = new Array(N_STAGES);
  const tmp = new Float64Array(N);
  ks[0] = dysonDerivBackward(g);
  for (let s = 1; s < N_STAGES; s++) {
    const row = DP8_A[s];
    for (let i = 0; i < N; i++) {
      let acc = 0;
      for (let j = 0; j < s; j++) {
        const a = row[j];
        if (a !== 0) acc += a * ks[j][i];
      }
      tmp[i] = g[i] + dt * acc;
    }
    ks[s] = dysonDerivBackward(tmp);
  }
  const next = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let acc = 0;
    for (let s = 0; s < N_STAGES; s++) {
      const b = DP8_B[s];
      if (b !== 0) acc += b * ks[s][i];
    }
    next[i] = g[i] + dt * acc;
  }
  return next;
}

// Same collision rule and |t_c| = (step+1)*dt convention as
// backwardCollisionRK4 so the reported difference is the tableau alone.
export function backwardCollisionDP8(initial, dt, maxSteps) {
  let g = Float64Array.from(initial);
  for (let step = 0; step < maxSteps; step++) {
    g = dp8Step(g, dt);
    let minS = Infinity;
    for (let i = 0; i < g.length - 1; i++) {
      const s = g[i + 1] - g[i];
      if (s < minS) minS = s;
    }
    if (minS < 1e-4) {
      return { t_c: -((step + 1) * dt), steps: step + 1, minSpacing: minS };
    }
  }
  return { t_c: null, steps: maxSteps, minSpacing: null };
}

// Fixed-step DP8 propagation over exactly nSteps (no collision early-exit),
// for the convergence-order measurement.
export function dp8Propagate(initial, dt, nSteps) {
  let g = Float64Array.from(initial);
  for (let s = 0; s < nSteps; s++) g = dp8Step(g, dt);
  return g;
}

// Fixed-step RK4 propagation (classical tableau, no early exit) for the
// order-contrast measurement. Same drift, same stepping convention.
function rk4Propagate(initial, dt, nSteps) {
  const N = initial.length;
  let g = Float64Array.from(initial);
  const tmp = new Float64Array(N);
  for (let s = 0; s < nSteps; s++) {
    const k1 = dysonDerivBackward(g);
    for (let i = 0; i < N; i++) tmp[i] = g[i] + 0.5 * dt * k1[i];
    const k2 = dysonDerivBackward(tmp);
    for (let i = 0; i < N; i++) tmp[i] = g[i] + 0.5 * dt * k2[i];
    const k3 = dysonDerivBackward(tmp);
    for (let i = 0; i < N; i++) tmp[i] = g[i] + dt * k3[i];
    const k4 = dysonDerivBackward(tmp);
    const next = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      next[i] = g[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    }
    g = next;
  }
  return g;
}

// ── Empirical self-convergence order on the real Dyson system ───────────────
// Integrate N = 50 backward over T = 0.08 (inside the funnel but before the
// ~0.1 collision blow-up) at dt in {0.02, 0.01, 0.005} against a dt = 6.25e-4
// DP8 reference; observed order is log2(err(dt) / err(dt/2)). A correctly
// transcribed order-8 tableau shows orders climbing toward 8; the classical
// RK4 run on the same grid shows ~4, separating the two methods empirically.
function measureConvergenceOrder() {
  const N = 50;
  const T = 0.08;
  const refDt = 0.000625;
  const initial = ZEROS_EXTENDED.slice(0, N);
  const dts = [0.02, 0.01, 0.005];
  const ref = dp8Propagate(initial, refDt, Math.round(T / refDt));
  const maxErr = (y) => {
    let e = 0;
    for (let i = 0; i < N; i++) e = Math.max(e, Math.abs(y[i] - ref[i]));
    return e;
  };
  const dp8Errs = dts.map((dt) => maxErr(dp8Propagate(initial, dt, Math.round(T / dt))));
  const rk4Errs = dts.map((dt) => maxErr(rk4Propagate(initial, dt, Math.round(T / dt))));
  const ordersOf = (errs) => {
    const out = [];
    for (let i = 0; i + 1 < errs.length; i++) {
      if (errs[i + 1] > 0) out.push(Math.log2(errs[i] / errs[i + 1]));
    }
    return out;
  };
  return {
    N,
    T,
    refDt,
    dts,
    dp8Errs,
    rk4Errs,
    dp8Orders: ordersOf(dp8Errs),
    rk4Orders: ordersOf(rk4Errs),
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const N = SMOKE ? 500 : 10000;
  const dt = 0.0001;
  const maxSteps = 120;
  console.log(`[imp-2485] N=${N} dt=${dt} maxSteps=${maxSteps} smoke=${SMOKE}`);
  console.log(`[imp-2485] ZEROS_EXTENDED.length = ${ZEROS_EXTENDED.length}`);
  if (ZEROS_EXTENDED.length < N) {
    throw new Error(`zero table too short: ${ZEROS_EXTENDED.length} < ${N}`);
  }

  const tableau = validateTableau();
  console.log('[imp-2485] tableau residuals:', tableau);
  if (tableau.maxRowSumResidual > 1e-9 || tableau.maxQuadratureResidual > 1e-9) {
    throw new Error('DP8 tableau failed validation; refusing to integrate');
  }

  const conv = measureConvergenceOrder();
  console.log('[imp-2485] convergence check:', conv);

  const initial = ZEROS_EXTENDED.slice(0, N);

  let t0 = Date.now();
  const rk4 = backwardCollisionRK4(initial, dt, maxSteps);
  const rk4Ms = Date.now() - t0;
  console.log('[imp-2485] RK4:', rk4, `${rk4Ms} ms`);

  t0 = Date.now();
  const dp8 = backwardCollisionDP8(initial, dt, maxSteps);
  const dp8Ms = Date.now() - t0;
  console.log('[imp-2485] DP8:', dp8, `${dp8Ms} ms`);

  // Refinement pass at dt/5 to resolve the two-method gap below the ladder
  // detection quantum (both methods quantize t_c to a multiple of dt).
  const dtFine = dt / 5;
  const maxStepsFine = maxSteps * 5;
  t0 = Date.now();
  const rk4Fine = backwardCollisionRK4(initial, dtFine, maxStepsFine);
  const rk4FineMs = Date.now() - t0;
  console.log('[imp-2485] RK4 fine:', rk4Fine, `${rk4FineMs} ms`);

  t0 = Date.now();
  const dp8Fine = backwardCollisionDP8(initial, dtFine, maxStepsFine);
  const dp8FineMs = Date.now() - t0;
  console.log('[imp-2485] DP8 fine:', dp8Fine, `${dp8FineMs} ms`);

  // Analytic two-particle cross-check: the tightest zero pair in the window
  // collapses (in isolation) at t_pair = H_min^2 / 8 from the Calogero-Moser
  // pair equation. At pair-dominated N this pins the true collision time.
  let hMin = Infinity;
  let pairIdx = -1;
  for (let i = 0; i + 1 < N; i++) {
    const gp = initial[i + 1] - initial[i];
    if (gp < hMin) {
      hMin = gp;
      pairIdx = i;
    }
  }
  const tPair = (hMin * hMin) / 8;
  console.log('[imp-2485] pair bound:', { hMin, pairIdx, tPair });

  // Roundoff-certified interval brackets from the imp-1091 dispatch (Rust CLI
  // when built, JS interval-RK4 fallback otherwise) at BOTH step sizes.
  t0 = Date.now();
  const interval = await callIntervalRk4Async({
    N,
    initial_x: Array.from(initial),
    dt,
    max_steps: maxSteps,
  });
  const intervalMs = Date.now() - t0;
  console.log('[imp-2485] interval (ladder dt):', interval, `${intervalMs} ms`);

  t0 = Date.now();
  const intervalFine = await callIntervalRk4Async({
    N,
    initial_x: Array.from(initial),
    dt: dtFine,
    max_steps: maxStepsFine,
  });
  const intervalFineMs = Date.now() - t0;
  console.log('[imp-2485] interval (fine dt):', intervalFine, `${intervalFineMs} ms`);

  const sidecar = {
    generatedBy: 'scripts/compute-imp2485-dp8-rk4-N1e4.mjs',
    generatedAtUtc: new Date().toISOString(),
    smoke: SMOKE,
    N,
    zeroSource: 'src/data/zeros-to-1e6.js (Odlyzko, imp-359)',
    tableau: {
      name: 'Dormand-Prince DOP853 propagating pair, 12 stages, order 8',
      provenance: 'scipy v1.13.0 scipy/integrate/_ivp/dop853_coefficients.py',
      maxRowSumResidual: tableau.maxRowSumResidual,
      maxQuadratureResidual: tableau.maxQuadratureResidual,
    },
    convergence: {
      description:
        'Self-convergence on the N=50 backward Dyson system over T=0.08, max-abs ' +
        'errors vs a dt=6.25e-4 DP8 reference; observed order between successive ' +
        'dt halvings, for BOTH integrators on the same grid.',
      dts: conv.dts,
      dp8MaxAbsErrors: conv.dp8Errs,
      rk4MaxAbsErrors: conv.rk4Errs,
      dp8ObservedOrders: conv.dp8Orders,
      rk4ObservedOrders: conv.rk4Orders,
    },
    ladderRow: {
      dt,
      maxSteps,
      rk4: { t_c: rk4.t_c, steps: rk4.steps, minSpacing: rk4.minSpacing ?? null, wallMs: rk4Ms },
      dp8: { t_c: dp8.t_c, steps: dp8.steps, minSpacing: dp8.minSpacing ?? null, wallMs: dp8Ms },
    },
    refinedRow: {
      dt: dtFine,
      maxSteps: maxStepsFine,
      rk4: { t_c: rk4Fine.t_c, steps: rk4Fine.steps, minSpacing: rk4Fine.minSpacing ?? null, wallMs: rk4FineMs },
      dp8: { t_c: dp8Fine.t_c, steps: dp8Fine.steps, minSpacing: dp8Fine.minSpacing ?? null, wallMs: dp8FineMs },
    },
    pairBound: {
      description:
        'Tightest zero pair in the first N ordinates; isolated Calogero-Moser ' +
        'pair collapses at t_pair = H_min^2 / 8.',
      hMin,
      pairIdx,
      tPair,
    },
    interval: {
      backend: interval.backend ?? null,
      dt,
      t_c_lo: interval.t_c_lo ?? null,
      t_c_hi: interval.t_c_hi ?? null,
      maxIntervalWidth: interval.max_interval_width ?? null,
      stepsTaken: interval.steps_taken ?? null,
      reason: interval.reason ?? null,
      wallMs: intervalMs,
    },
    intervalFine: {
      backend: intervalFine.backend ?? null,
      dt: dtFine,
      t_c_lo: intervalFine.t_c_lo ?? null,
      t_c_hi: intervalFine.t_c_hi ?? null,
      maxIntervalWidth: intervalFine.max_interval_width ?? null,
      stepsTaken: intervalFine.steps_taken ?? null,
      reason: intervalFine.reason ?? null,
      wallMs: intervalFineMs,
    },
    remainingGaps: [
      'GAP-2485-N1e5-N1e6: fresh dual-integrator rows at N in {1e5, 1e6} need the ' +
        'same offline harness at ~100x and ~10000x this runtime (O(N^2) per stage); ' +
        'N=1e6 additionally needs zeros beyond the bundled table.',
    ],
  };

  if (!SMOKE) {
    fs.writeFileSync(OUT_PATH, JSON.stringify(sidecar, null, 2) + '\n');
    console.log(`[imp-2485] wrote ${OUT_PATH}`);
  } else {
    console.log('[imp-2485] smoke run, sidecar NOT written:');
    console.log(JSON.stringify(sidecar, null, 2));
  }
}

const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
