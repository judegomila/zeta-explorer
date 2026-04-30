/**
 * imp-933: per-plateau interior interval-RK4 sweep.
 *
 * Runs the one-ULP interval RK4 at one representative interior N per
 * H_raw-plateau (the floor midpoint of [startN, endN]). Plateaus with
 * width = 1 or with midpoint < 10 (trivial few-body) are skipped.
 * Plateaus whose midpoint coincides with an L1 sample {50, 100, 200,
 * 500, 1000, 2000, 5000, 10000} are also skipped (already certified).
 *
 * Each completed row is appended to the JSON output file immediately so
 * partial results survive a timeout.
 *
 * USAGE:
 *   node src/math/imp-933-interior-sweep.mjs [outputJsonPath] [wallClockBudgetSec]
 *
 *   outputJsonPath      path to write rows JSON (default:
 *                       src/data/imp-911-per-plateau-gronwall-certs-rows.json)
 *   wallClockBudgetSec  stop after this many seconds (default: unlimited)
 *
 * Row schema (matches imp-903-uniform-sweep-result-rows.json):
 *   plateauIndex, interiorN, H_raw, N, closed, steps, tAbs,
 *   t_c_lo, t_c_hi, collisionWidth, maxIntervalWidth,
 *   minGapLoAtCollision, runtimeSec,
 *   t_c_pair, F_mb_upper, K_raw_cert, K_paper_cert_floor
 *
 * Skipped rows: { plateauIndex, interiorN, H_raw, skip: <reason> }
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  subInterval,
  rk4IntervalStep,
} from './interval-dyson-integrator.mjs';
import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';
import { IMP_857_UNIFORM_K_BOUND } from './imp-857-uniform-K-bound.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const args = process.argv.slice(2);
const OUTPUT_PATH = args[0]
  ? path.resolve(args[0])
  : path.join(ROOT, 'src/data/imp-911-per-plateau-gronwall-certs-rows.json');
const BUDGET_SEC = args[1] ? Number(args[1]) : Infinity;

const L1_SAMPLED_N = new Set([50, 100, 200, 500, 1000, 2000, 5000, 10000]);
const RESCUE_THRESHOLD = 0.12751;

function log(msg) {
  process.stdout.write(msg + '\n');
}

// Compute the floor midpoint of the plateau interior.
function interiorN(p) {
  return Math.floor((p.startN + p.endN) / 2);
}

// Budget dt/maxSteps to reach collision in 3-10 RK4 steps.
function budgetForN(H_raw) {
  const tcPair = (H_raw * H_raw) / 8;
  const dt = Math.max(1e-5, +(tcPair / 5).toPrecision(1));
  return { dt, maxSteps: 40 };
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
    closed: false,
    steps: maxSteps,
    tAbs: +tAbs.toFixed(8),
    note: 'budget exhausted before collision',
  };
}

// Compute derived K quantities from a closed row.
function addKFields(row, N, H_raw) {
  if (row.closed !== true) return row;
  const t_c_pair = (H_raw * H_raw) / 8;
  const F_mb_upper = Math.abs(row.t_c_hi - t_c_pair);
  const K_raw_cert = (F_mb_upper * H_raw * Math.sqrt(N)) / Math.log(N);
  const K_paper_cert_floor = K_raw_cert / RESCUE_THRESHOLD;
  return {
    ...row,
    t_c_pair: +t_c_pair.toFixed(10),
    F_mb_upper: +F_mb_upper.toExponential(6),
    K_raw_cert: +K_raw_cert.toExponential(6),
    K_paper_cert_floor: +K_paper_cert_floor.toExponential(6),
  };
}

// Load existing partial rows so a re-run is idempotent.
let existingRows = [];
if (fs.existsSync(OUTPUT_PATH)) {
  try {
    existingRows = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
  } catch {
    existingRows = [];
  }
}
const coveredPlateaux = new Set(
  existingRows.map((r) => r.plateauIndex),
);

// Save rows atomically.
function saveRows(rows) {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rows, null, 2));
}

const PLATEAUS = IMP_857_UNIFORM_K_BOUND.plateaus;
const wallStart = Date.now();

log('imp-933 per-plateau interior sweep');
log('===================================');
log(`Output: ${OUTPUT_PATH}`);
log(`Budget: ${BUDGET_SEC === Infinity ? 'unlimited' : BUDGET_SEC + 's'}`);
log(`Plateaus: ${PLATEAUS.length}`);
log('');

const rows = [...existingRows];

for (const p of PLATEAUS) {
  // Wall-clock budget check.
  if ((Date.now() - wallStart) / 1000 > BUDGET_SEC) {
    log(`[BUDGET] Wall-clock limit reached after ${PLATEAUS.indexOf(p)} plateaus.`);
    break;
  }

  const N = interiorN(p);
  const prefix = `[${p.plateauIndex}/${PLATEAUS.length - 1}]  N=${N}  plateau=[${p.startN},${p.endN}]  H_raw=${p.H_raw}`;

  // Already done.
  if (coveredPlateaux.has(p.plateauIndex)) {
    log(`${prefix}  SKIP (already computed)`);
    continue;
  }

  // Width = 1 → startN = endN, midpoint is the same as the endpoint.
  if (p.startN === p.endN) {
    log(`${prefix}  SKIP (width=1, startN==endN)`);
    const row = { plateauIndex: p.plateauIndex, interiorN: N, H_raw: p.H_raw, skip: 'width-1' };
    rows.push(row);
    saveRows(rows);
    coveredPlateaux.add(p.plateauIndex);
    continue;
  }

  // Trivial few-body: N < 10.
  if (N < 10) {
    log(`${prefix}  SKIP (trivial-few-body, N<10)`);
    const row = { plateauIndex: p.plateauIndex, interiorN: N, H_raw: p.H_raw, skip: 'trivial-few-body' };
    rows.push(row);
    saveRows(rows);
    coveredPlateaux.add(p.plateauIndex);
    continue;
  }

  // Midpoint already in L1 sample set.
  if (L1_SAMPLED_N.has(N)) {
    log(`${prefix}  SKIP (L1-covered, N=${N})`);
    const row = { plateauIndex: p.plateauIndex, interiorN: N, H_raw: p.H_raw, skip: 'l1-covered' };
    rows.push(row);
    saveRows(rows);
    coveredPlateaux.add(p.plateauIndex);
    continue;
  }

  const { dt, maxSteps } = budgetForN(p.H_raw);
  log(`${prefix}  dt=${dt}  maxSteps=${maxSteps}`);

  const t0 = Date.now();
  const raw = runBaselineAtN(N, dt, maxSteps);
  const elapsed = +((Date.now() - t0) / 1000).toFixed(1);

  const row = {
    plateauIndex: p.plateauIndex,
    interiorN: N,
    H_raw: p.H_raw,
    N,
    ...addKFields(raw, N, p.H_raw),
    runtimeSec: elapsed,
  };

  rows.push(row);
  saveRows(rows);
  coveredPlateaux.add(p.plateauIndex);

  const kStr = row.K_paper_cert_floor != null
    ? `  K_paper_cert_floor=${row.K_paper_cert_floor}`
    : '';
  log(`  -> closed=${raw.closed}  maxW=${raw.maxIntervalWidth}${kStr}  (${elapsed}s)`);
}

log('');
log('=== SUMMARY ===');
const closed = rows.filter((r) => r.closed === true);
const skipped = rows.filter((r) => r.skip != null);
const notClosed = rows.filter((r) => r.closed != null && r.closed !== true);
log(`Total rows: ${rows.length}`);
log(`Closed: ${closed.length}`);
log(`Skipped (trivial/width-1/l1): ${skipped.length}`);
log(`Not closed: ${notClosed.length}`);
if (closed.length > 0) {
  const Kmax = Math.max(...closed.map((r) => r.K_paper_cert_floor));
  const Kmax100 = closed.filter((r) => r.N >= 100);
  const KmaxAbove100 = Kmax100.length > 0
    ? Math.max(...Kmax100.map((r) => r.K_paper_cert_floor))
    : null;
  log(`K_paper_cert_floor max (all N): ${Kmax.toExponential(4)}`);
  if (KmaxAbove100 != null) {
    const lhs = (KmaxAbove100 * Math.log(100)) / Math.sqrt(100);
    log(`K_paper_cert_floor max (N≥100): ${KmaxAbove100.toExponential(4)}`);
    log(`Rescue LHS at N_0=100: ${lhs.toFixed(4)} (threshold: ${RESCUE_THRESHOLD})`);
    log(`Rescue satisfied: ${lhs < RESCUE_THRESHOLD}`);
  }
}
log('');
log(`Rows written to: ${OUTPUT_PATH}`);
