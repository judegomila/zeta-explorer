/**
 * imp-962: per-plateau START + INTERIOR interval-RK4 sweep for N ∈ (10⁴, 10⁶].
 *
 * Analogous to imp-933-interior-sweep.mjs (which covers N ∈ [100, 10⁴]).
 * This script runs TWO certs per plateau:
 *   (a) START: at the H_raw-update N (plateau-entry point, analogous to imp-903)
 *   (b) INTERIOR: at the floor midpoint of [startN, endN]
 *
 * SKIPPED CERTS:
 *   - Plateau 0 carry-over START (N=10000): already sourced from imp-933 plateau-26
 *     in imp-911-per-plateau-gronwall-certs-rows.json.
 *   - N values in the L1 skip set {25000, 50000, 100000, 250000, 500000, 1000000}:
 *     these are being filled by the parallel imp-360 routine.
 *   - Trivial few-body (N < 10): not applicable here since all N ≥ 10000.
 *   - Width-1 plateaus: startN = endN, midpoint equals endpoint; skipped.
 *
 * RUNTIME WARNING:
 *   The interval-RK4 step cost scales as O(N²). On the new plateau range:
 *     N=14429  (plateau 0 interior):  ~8.5h per full cert
 *     N=18860  (plateau 1 start):    ~17h per cert
 *     N=710446 (plateau 9 interior): ~9000h per cert
 *   These certs require remote compute or parallelization. Run in parallel
 *   across plateaus (the plateaus are independent).
 *
 * USAGE:
 *   node src/math/imp-962-sweep-N10k-to-N1e6.mjs [outputJsonPath] [wallClockBudgetSec] [startPlateau] [endPlateau]
 *
 *   outputJsonPath      path to write rows JSON (default:
 *                       src/data/imp-962-per-plateau-gronwall-certs-N10k-to-N1e6-rows.json)
 *   wallClockBudgetSec  stop after this many seconds (default: unlimited)
 *   startPlateau        first plateau index to process (default: 0)
 *   endPlateau          last plateau index (exclusive) to process (default: 10)
 *
 * Row schema (matches imp-911-per-plateau-gronwall-certs-rows.json):
 *   plateauIndex, certType, N, H_raw,
 *   closed, steps, tAbs, t_c_lo, t_c_hi, collisionWidth, maxIntervalWidth,
 *   minGapLoAtCollision, runtimeSec,
 *   t_c_pair, F_mb_upper, K_raw_cert, K_paper_cert_floor
 *
 * Skipped rows: { plateauIndex, certType, N, H_raw, skip: <reason> }
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  subInterval,
  rk4IntervalStep,
} from './interval-dyson-integrator.mjs';
import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';
import { IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6 } from '../data/imp-962-plateau-structure-N10k-to-N1e6.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const args = process.argv.slice(2);
const OUTPUT_PATH = args[0]
  ? path.resolve(args[0])
  : path.join(
      ROOT,
      'src/data/imp-962-per-plateau-gronwall-certs-N10k-to-N1e6-rows.json',
    );
const BUDGET_SEC = args[1] ? Number(args[1]) : Infinity;
const START_PLATEAU = args[2] ? Number(args[2]) : 0;
const END_PLATEAU = args[3] ? Number(args[3]) : 10;

// L1 samples being filled by parallel imp-360 routine — skip these N values.
const L1_SKIP = new Set([25000, 50000, 100000, 250000, 500000, 1000000]);

const RESCUE_THRESHOLD = 0.12751;

function log(msg) {
  process.stdout.write(msg + '\n');
}

// Floor midpoint of the plateau interior.
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

// Compute K-cert fields from a closed row.
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

// Load existing partial rows (idempotent re-runs).
let existingRows = [];
if (fs.existsSync(OUTPUT_PATH)) {
  try {
    existingRows = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
  } catch {
    existingRows = [];
  }
}

// Track covered certs by "plateauIndex-certType" key.
const coveredKeys = new Set(
  existingRows.map((r) => `${r.plateauIndex}-${r.certType ?? 'unknown'}`),
);

function saveRows(rows) {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rows, null, 2));
}

const PLATEAUS = IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6.plateaus;
const wallStart = Date.now();

log('imp-962 per-plateau START+INTERIOR sweep  N ∈ (10⁴, 10⁶]');
log('============================================================');
log(`Output: ${OUTPUT_PATH}`);
log(`Budget: ${BUDGET_SEC === Infinity ? 'unlimited' : BUDGET_SEC + 's'}`);
log(`Plateaus: ${START_PLATEAU}..${END_PLATEAU - 1} (of ${PLATEAUS.length} total)`);
log('');

const rows = [...existingRows];

for (const p of PLATEAUS.slice(START_PLATEAU, END_PLATEAU)) {
  if ((Date.now() - wallStart) / 1000 > BUDGET_SEC) {
    log(`[BUDGET] Wall-clock limit reached before plateau ${p.plateauIndex}.`);
    break;
  }

  // --- Determine START and INTERIOR N values ---
  const startN = p.startN;
  const midN = interiorN(p);

  // Plateau 0 (carry-over): START = N=10000, already in rows as sourced from imp-933.
  const CARRY_OVER_START_KEY = '0-start';
  const skipCarryOverStart =
    p.plateauIndex === 0 && coveredKeys.has(CARRY_OVER_START_KEY);

  // --- START cert ---
  const startKey = `${p.plateauIndex}-start`;
  if (!coveredKeys.has(startKey)) {
    const prefix = `[${p.plateauIndex}] START  N=${startN}  H_raw=${p.H_raw}`;

    if (p.plateauIndex === 0) {
      // Carry-over start: should already be in rows from prior run. If not, mark skip.
      log(`${prefix}  SKIP (carry-over plateau 0 start; source from imp-933 should be in rows)`);
      const row = {
        plateauIndex: p.plateauIndex,
        certType: 'start',
        N: startN,
        H_raw: p.H_raw,
        skip: 'carry-over-sourced-from-imp-933',
      };
      rows.push(row);
      saveRows(rows);
      coveredKeys.add(startKey);
    } else if (L1_SKIP.has(startN)) {
      log(`${prefix}  SKIP (L1-covered by imp-360)`);
      const row = {
        plateauIndex: p.plateauIndex,
        certType: 'start',
        N: startN,
        H_raw: p.H_raw,
        skip: 'l1-covered-imp-360',
      };
      rows.push(row);
      saveRows(rows);
      coveredKeys.add(startKey);
    } else {
      if ((Date.now() - wallStart) / 1000 > BUDGET_SEC) {
        log(`${prefix}  [BUDGET] skipping due to wall-clock limit`);
        break;
      }
      const { dt, maxSteps } = budgetForN(p.H_raw);
      log(`${prefix}  dt=${dt}  maxSteps=${maxSteps}`);
      const t0 = Date.now();
      const raw = runBaselineAtN(startN, dt, maxSteps);
      const elapsed = +((Date.now() - t0) / 1000).toFixed(1);
      const row = {
        plateauIndex: p.plateauIndex,
        certType: 'start',
        N: startN,
        H_raw: p.H_raw,
        ...addKFields(raw, startN, p.H_raw),
        runtimeSec: elapsed,
      };
      rows.push(row);
      saveRows(rows);
      coveredKeys.add(startKey);
      const kStr = row.K_paper_cert_floor != null
        ? `  K=${row.K_paper_cert_floor}`
        : '';
      log(`  -> closed=${raw.closed}  maxW=${raw.maxIntervalWidth}${kStr}  (${elapsed}s)`);
    }
  }

  // --- INTERIOR cert ---
  const interiorKey = `${p.plateauIndex}-interior`;
  if (!coveredKeys.has(interiorKey)) {
    const prefix = `[${p.plateauIndex}] INTERIOR  N=${midN}  plateau=[${p.startN},${p.endN}]  H_raw=${p.H_raw}`;

    if (p.startN === p.endN) {
      log(`${prefix}  SKIP (width=1)`);
      const row = {
        plateauIndex: p.plateauIndex,
        certType: 'interior',
        N: midN,
        H_raw: p.H_raw,
        skip: 'width-1',
      };
      rows.push(row);
      saveRows(rows);
      coveredKeys.add(interiorKey);
    } else if (L1_SKIP.has(midN)) {
      log(`${prefix}  SKIP (L1-covered by imp-360)`);
      const row = {
        plateauIndex: p.plateauIndex,
        certType: 'interior',
        N: midN,
        H_raw: p.H_raw,
        skip: 'l1-covered-imp-360',
      };
      rows.push(row);
      saveRows(rows);
      coveredKeys.add(interiorKey);
    } else {
      if ((Date.now() - wallStart) / 1000 > BUDGET_SEC) {
        log(`${prefix}  [BUDGET] skipping due to wall-clock limit`);
        break;
      }
      const { dt, maxSteps } = budgetForN(p.H_raw);
      log(`${prefix}  dt=${dt}  maxSteps=${maxSteps}`);
      const t0 = Date.now();
      const raw = runBaselineAtN(midN, dt, maxSteps);
      const elapsed = +((Date.now() - t0) / 1000).toFixed(1);
      const row = {
        plateauIndex: p.plateauIndex,
        certType: 'interior',
        N: midN,
        H_raw: p.H_raw,
        ...addKFields(raw, midN, p.H_raw),
        runtimeSec: elapsed,
      };
      rows.push(row);
      saveRows(rows);
      coveredKeys.add(interiorKey);
      const kStr = row.K_paper_cert_floor != null
        ? `  K=${row.K_paper_cert_floor}`
        : '';
      log(`  -> closed=${raw.closed}  maxW=${raw.maxIntervalWidth}${kStr}  (${elapsed}s)`);
    }
  }
}

log('');
log('=== SUMMARY ===');
const closedRows = rows.filter((r) => r.closed === true);
const skippedRows = rows.filter((r) => r.skip != null);
log(`Total rows: ${rows.length} / ${20} needed`);
log(`Closed: ${closedRows.length}`);
log(`Skipped: ${skippedRows.length}`);
if (closedRows.length > 0) {
  const Kmax = Math.max(...closedRows.map((r) => r.K_paper_cert_floor));
  log(`K_paper_cert_floor max (all closed N): ${Kmax.toExponential(4)}`);
  const above10k = closedRows.filter((r) => r.N >= 10000);
  if (above10k.length > 0) {
    const K10k = Math.max(...above10k.map((r) => r.K_paper_cert_floor));
    const lhs = (K10k * Math.log(10000)) / Math.sqrt(10000);
    log(`K_paper_cert_floor max (N≥10000): ${K10k.toExponential(4)}`);
    log(`Rescue LHS at N_0=10000: ${lhs.toFixed(6)} (threshold: ${RESCUE_THRESHOLD})`);
    log(`Rescue satisfied: ${lhs < RESCUE_THRESHOLD}`);
  }
}
log('');
log(`Rows written to: ${OUTPUT_PATH}`);
