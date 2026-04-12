#!/usr/bin/env node
/**
 * imp-514 (partial closure): Offline compute harness for extended Dyson ladder
 *
 * Extends the backward Dyson ODE ladder from N=100,000 toward N=1,000,000.
 * Writes a JSON cache to src/data/dyson-ladder-extended-cache.json that can
 * be imported by dyson-ladder-measured.js to replace its projected rows with
 * measured values.
 *
 * HONEST SCOPE — named sub-gaps
 * ==============================
 *
 * imp514a (data): ZEROS_EXTENDED in src/data/zeros-to-1e6.js has 100,000
 *   entries (Odlyzko zeros1). For N > 100,000 this script downloads
 *   additional batches (zeros2, zeros3, ...) from Odlyzko sequentially.
 *   Each file covers the next 100,000 zeros (zeros2 = zeros 100,001-200,000,
 *   etc.). Run with --download to fetch them into scripts/.zeros-cache/.
 *   Alternatively, zeros6 at the same base URL may be a single 2M-zero
 *   combined file (~35 MB); this script probes for it first.
 *
 * imp514b (compute infeasibility in plain JS for large N):
 *   Float64 RK4 per-step cost is O(N^2). Estimated wall times in Node.js:
 *     N=150,000:  ~22 s/step x 120 steps = ~45 min  (feasible offline)
 *     N=250,000:  ~62 s/step x 120 steps = ~2.1 hr  (slow but feasible)
 *     N=400,000:  ~160 s/step x 120 steps = ~5.3 hr (marginal)
 *     N=600,000:  ~360 s/step x 120 steps = ~12 hr  (infeasible overnight)
 *     N=1,000,000: ~1000 s/step x 120 steps = ~33 hr (infeasible in JS)
 *   Closing imp-514 for N=1M requires a C/Rust backend (Arb, CAPD, or
 *   custom compiled code). This script handles N up to ~250K-400K.
 *
 * imp514c (step-size and collision detection at large N):
 *   At N=100K the interval integrator returned budget-exhausted (too wide).
 *   The Float64 RK4 here is NOT certified — it gives a central value without
 *   error bars. At large N the minimum gap shrinks to ~pi/N (GUE spacing),
 *   which is ~3e-6 at N=1M. Fixed dt=1e-4 may overshoot the collision; this
 *   script uses adaptive step-size halving near singularity (gap < 3e-4).
 *   The certified interval bound for large N must await a C/Arb backend.
 *
 * Usage
 * -----
 *   node scripts/compute-dyson-ladder-extended.mjs [options]
 *
 *   --max-n N       Largest N to attempt  (default: 250000)
 *   --download      Download missing Odlyzko batches into scripts/.zeros-cache/
 *   --dry-run       Print plan without computing
 *   --out PATH      Output JSON path
 *                   (default: src/data/dyson-ladder-extended-cache.json)
 *   --dt DT         Fixed step size for RK4 (default: 0.0001)
 *   --steps K       Max RK4 steps per N   (default: 120)
 *
 * Output format (JSON)
 * --------------------
 * {
 *   generatedAt: "ISO-8601",
 *   source: "imp-514 offline compute",
 *   zeros_provenance: "Odlyzko zeros1-N (https://www-users.cse.umn.edu/~odlyzko/zeta_tables/)",
 *   rows: [
 *     {
 *       N: 150000,
 *       source: "measured-float64-rk4",   // NOT interval arithmetic
 *       t_c: 0.006683,                    // Float64 central value
 *       reason: "gap-nonpositive" | "budget-exhausted",
 *       dt: 0.0001,
 *       nSteps: 120,
 *       wallTimeMs: 2700000,
 *       note: "..."
 *     },
 *     ...
 *   ],
 *   subGaps: [ ... ]
 * }
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function flag(name)      { return args.includes(name); }
function param(name, def) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}

const MAX_N    = parseInt(param('--max-n',    '250000'), 10);
const DT       = parseFloat(param('--dt',     '0.0001'));
const STEPS    = parseInt(param('--steps',    '120'), 10);
const DRY_RUN  = flag('--dry-run');
const DOWNLOAD = flag('--download');
const OUT_PATH = param('--out', path.join(ROOT, 'src/data/dyson-ladder-extended-cache.json'));

const CACHE_DIR = path.join(__dirname, '.zeros-cache');
const ODLYZKO_BASE = 'https://www-users.cse.umn.edu/~odlyzko/zeta_tables/';

// Target N values for the extended ladder (from imp-514 ticket and dyson-ladder-measured.js)
const TARGET_NS = [150000, 250000, 400000, 600000, 1000000].filter(n => n <= MAX_N);

// ── Feasibility estimates ─────────────────────────────────────────────────────
// At ~1e9 float ops/s in Node.js, O(N^2) per-step estimate:
function estimatedStepSec(N) { return (N * N) / 1e9; }
function estimatedTotalMin(N) { return (estimatedStepSec(N) * STEPS) / 60; }

// ── Zeros loading ─────────────────────────────────────────────────────────────
// zeros1 = zeros 1..100000, zeros2 = zeros 100001..200000, etc.
// A "zeros6" combined file (2M zeros, ~35 MB) is probed first.

const ZEROS_PER_FILE = 100000;

async function downloadBatch(batchName, destFile) {
  const url = `${ODLYZKO_BASE}${batchName}`;
  process.stderr.write(`downloading ${url} -> ${path.relative(ROOT, destFile)}\n`);
  const res = await fetch(url, { headers: { accept: 'text/plain' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  const text = await res.text();
  fs.writeFileSync(destFile, text);
  process.stderr.write(`saved ${destFile} (${(text.length / 1024).toFixed(0)} KB)\n`);
  return text;
}

function parseBatch(text) {
  const zeros = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const v = Number(line);
    if (Number.isFinite(v) && v > 0) zeros.push(v);
  }
  return zeros;
}

async function loadZerosUpToN(N) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

  // First try: load the zeros6 combined file (2M zeros) if it exists / can be downloaded
  const zeros6Path = path.join(CACHE_DIR, 'zeros6');
  if (fs.existsSync(zeros6Path)) {
    process.stderr.write('loading zeros6 combined file...\n');
    const text  = fs.readFileSync(zeros6Path, 'utf8');
    const zeros = parseBatch(text);
    if (zeros.length >= N && zeros[0] < 20) { // sanity: first zero near 14.13...
      return zeros.slice(0, N);
    }
    process.stderr.write(`zeros6 parsed ${zeros.length} entries (first: ${zeros[0]}); not usable as combined γ₁..γ_N table\n`);
  } else if (DOWNLOAD) {
    try {
      const text  = await downloadBatch('zeros6', zeros6Path);
      const zeros = parseBatch(text);
      if (zeros.length >= N && zeros[0] < 20) {
        return zeros.slice(0, N);
      }
      process.stderr.write(`zeros6 does not start from γ₁ (first: ${zeros[0]}); falling back to sequential batches\n`);
    } catch (err) {
      process.stderr.write(`zeros6 fetch failed (${err.message}); falling back to sequential batches\n`);
    }
  }

  // Fallback: load zeros1 (already in src/data/zeros-to-1e6.js) plus zeros2, zeros3, ...
  // zeros1 is already downloaded; for N > 100K we need additional batches.
  const allZeros = [];

  // Try to load from the existing src/data/zeros-to-1e6.js first
  const zerosJsPath = path.join(ROOT, 'src/data/zeros-to-1e6.js');
  if (fs.existsSync(zerosJsPath)) {
    process.stderr.write('loading zeros from src/data/zeros-to-1e6.js...\n');
    const src    = fs.readFileSync(zerosJsPath, 'utf8');
    // Extract the array literals: lines of the form "  14.1347..., "
    const numRe  = /^\s{2}(\d+\.\d+),\s*$/gm;
    let m;
    while ((m = numRe.exec(src)) !== null) allZeros.push(Number(m[1]));
    process.stderr.write(`loaded ${allZeros.length} zeros from zeros-to-1e6.js\n`);
  }

  // If we still need more zeros, load additional Odlyzko batches
  let batchIdx = 2; // zeros1 already handled above
  while (allZeros.length < N) {
    const batchName = `zeros${batchIdx}`;
    const batchPath = path.join(CACHE_DIR, batchName);
    let text;
    if (fs.existsSync(batchPath)) {
      text = fs.readFileSync(batchPath, 'utf8');
    } else if (DOWNLOAD) {
      try {
        text = await downloadBatch(batchName, batchPath);
      } catch (err) {
        process.stderr.write(`${batchName} fetch failed: ${err.message} — stopping at ${allZeros.length} zeros\n`);
        break;
      }
    } else {
      process.stderr.write(`${batchName} not cached; run with --download to fetch it\n`);
      break;
    }
    const batch = parseBatch(text);
    if (batch.length === 0) {
      process.stderr.write(`${batchName} parsed 0 zeros — stopping\n`);
      break;
    }
    // Verify sequential ordering: first zero of batch should be > last zero already loaded
    if (allZeros.length > 0 && batch[0] <= allZeros[allZeros.length - 1]) {
      process.stderr.write(`${batchName} first zero ${batch[0]} <= last loaded ${allZeros[allZeros.length - 1]}; non-sequential\n`);
      break;
    }
    allZeros.push(...batch);
    process.stderr.write(`loaded ${batchName}: ${batch.length} zeros, total now ${allZeros.length}\n`);
    batchIdx++;
    if (batchIdx > 20) { process.stderr.write('batchIdx > 20 safety stop\n'); break; }
  }

  return allZeros.slice(0, N);
}

// ── Backward Dyson RK4 integrator (Float64, NOT interval arithmetic) ──────────
// The Dyson backward ODE is: dg_k/dt = -2 * sum_{j != k} 1/(g_k - g_j)
// At t=0 the g_k are the Riemann zero ordinates (ordered ascending).
// We integrate backward in time until the minimum gap g_{k+1}-g_k hits zero.
// NOTE: This is a Float64 implementation — not certified. The interval-
// arithmetic version in interval-dyson-integrator.mjs is certified but far
// too slow for N > 100K.

function dysonDerivBackward(g, N) {
  const dg = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    // Kahan-compensated sum to reduce roundoff in the 1/(g_i - g_j) reduction
    let c = 0;
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const d = g[i] - g[j];
      const y = (1 / d) - c;
      const t = s + y;
      c = (t - s) - y;
      s = t;
    }
    dg[i] = -2 * s;
  }
  return dg;
}

function minGap(g, N) {
  let mg = Infinity;
  for (let i = 0; i + 1 < N; i++) {
    const gap = g[i + 1] - g[i];
    if (gap < mg) mg = gap;
  }
  return mg;
}

function backwardCollisionRK4Float64(initial, dt, maxSteps) {
  const N   = initial.length;
  const g   = new Float64Array(initial);
  const tmp = new Float64Array(N);
  const g2  = new Float64Array(N);
  const COLLISION_THRESHOLD = 0;
  // Adaptive step: halve dt when gap < ADAPT_THRESH to reduce overshoot
  const ADAPT_THRESH = 3 * dt; // ~3x the step size in spacing

  let currentDt = dt;
  let t = 0;

  for (let step = 0; step < maxSteps; step++) {
    const mg = minGap(g, N);

    if (mg <= COLLISION_THRESHOLD) {
      return { t_c: t, reason: 'gap-nonpositive', step };
    }

    // Adapt step size when close to collision
    if (mg < ADAPT_THRESH && currentDt > dt / 16) {
      currentDt = Math.max(dt / 16, mg / 4);
    } else if (mg > 10 * ADAPT_THRESH) {
      currentDt = dt; // restore full step
    }

    // RK4 step
    const k1 = dysonDerivBackward(g, N);
    for (let i = 0; i < N; i++) tmp[i] = g[i] + 0.5 * currentDt * k1[i];
    const k2 = dysonDerivBackward(tmp, N);
    for (let i = 0; i < N; i++) tmp[i] = g[i] + 0.5 * currentDt * k2[i];
    const k3 = dysonDerivBackward(tmp, N);
    for (let i = 0; i < N; i++) tmp[i] = g[i] + currentDt * k3[i];
    const k4 = dysonDerivBackward(tmp, N);

    for (let i = 0; i < N; i++) {
      g2[i] = g[i] + (currentDt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    }

    // Check post-step minimum gap
    const mgPost = minGap(g2, N);
    if (mgPost <= COLLISION_THRESHOLD) {
      return { t_c: t + currentDt, reason: 'gap-nonpositive', step: step + 1 };
    }

    // Accept step
    for (let i = 0; i < N; i++) g[i] = g2[i];
    t += currentDt;
  }

  return { t_c: t, reason: 'budget-exhausted', step: maxSteps };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('imp-514 offline Dyson ladder extension harness');
  console.log(`  MAX_N  = ${MAX_N.toLocaleString()}`);
  console.log(`  DT     = ${DT}`);
  console.log(`  STEPS  = ${STEPS}`);
  console.log(`  OUT    = ${OUT_PATH}`);
  console.log(`  DRY_RUN = ${DRY_RUN}`);
  console.log('');

  console.log('Feasibility estimates for Float64 RK4 in Node.js:');
  for (const N of [150000, 250000, 400000, 600000, 1000000]) {
    const stepSec = estimatedStepSec(N);
    const totalMin = estimatedTotalMin(N);
    const feasible = totalMin < 360 ? 'FEASIBLE' : totalMin < 2000 ? 'MARGINAL' : 'INFEASIBLE (needs C/Rust)';
    console.log(`  N=${N.toLocaleString().padStart(9)}: ~${stepSec.toFixed(0)}s/step x ${STEPS} = ~${totalMin.toFixed(0)} min  [${feasible}]`);
  }
  console.log('');

  console.log(`Target N values (up to MAX_N=${MAX_N.toLocaleString()}): ${TARGET_NS.map(n => n.toLocaleString()).join(', ')}`);

  if (TARGET_NS.length === 0) {
    console.log('No target N values within MAX_N — increase --max-n or check TARGET_NS.');
    process.exit(0);
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would compute the following rows:');
    for (const N of TARGET_NS) {
      const stepSec = estimatedStepSec(N);
      const totalMin = estimatedTotalMin(N);
      console.log(`  N=${N.toLocaleString()}: est. ${totalMin.toFixed(0)} min (${stepSec.toFixed(0)}s/step x ${STEPS} steps)`);
    }
    console.log('\n[DRY RUN] Sub-gaps:');
    console.log('  imp514a: zeros2..zerosK needed for N > 100K. Run with --download to fetch.');
    console.log('  imp514b: N >= 400K infeasible in plain JS; needs C/Rust backend.');
    console.log('  imp514c: Float64 RK4 is uncertified (no error bars). Interval arithmetic too slow for N > 100K.');
    process.exit(0);
  }

  // Load zeros
  const maxN = TARGET_NS[TARGET_NS.length - 1];
  console.log(`\nLoading up to ${maxN.toLocaleString()} zeros...`);
  const allZeros = await loadZerosUpToN(maxN);
  console.log(`Loaded ${allZeros.length.toLocaleString()} zeros. First: ${allZeros[0]}, Last: ${allZeros[allZeros.length - 1]}`);

  if (allZeros.length < TARGET_NS[0]) {
    console.error(`ERROR: Only ${allZeros.length} zeros available but smallest target N is ${TARGET_NS[0]}.`);
    console.error('Run with --download to fetch missing Odlyzko batches.');
    process.exit(1);
  }

  const rows = [];

  for (const N of TARGET_NS) {
    if (allZeros.length < N) {
      console.log(`\nN=${N.toLocaleString()}: insufficient zeros (have ${allZeros.length}) — skipping`);
      rows.push({
        N,
        source: 'skipped-insufficient-zeros',
        t_c: null,
        reason: 'zero-list-insufficient',
        dt: DT,
        nSteps: STEPS,
        wallTimeMs: 0,
        note: `Only ${allZeros.length} zeros available; ${N} needed. Run --download to fetch more Odlyzko batches.`,
      });
      continue;
    }

    const stepSec    = estimatedStepSec(N);
    const totalMin   = estimatedTotalMin(N);
    console.log(`\nN=${N.toLocaleString()}: est. ${totalMin.toFixed(0)} min — starting RK4...`);

    if (totalMin > 360) {
      console.warn(`  WARNING: N=${N.toLocaleString()} estimated ${totalMin.toFixed(0)} min — this will take a very long time.`);
      console.warn(`  Consider using --max-n ${TARGET_NS[TARGET_NS.indexOf(N) - 1] ?? 150000} to stop earlier.`);
    }

    const zeros = allZeros.slice(0, N);
    const t0    = Date.now();
    const result = backwardCollisionRK4Float64(zeros, DT, STEPS);
    const wallMs = Date.now() - t0;

    console.log(`  -> t_c=${result.t_c?.toFixed(8)}, reason=${result.reason}, wall=${(wallMs / 1000).toFixed(1)}s`);

    // OLS projection for comparison: a + b/N where a=0.006649, b=4.91 (PATH_C_BASELINE_FIT OLS)
    const OLS_A = 0.006649;
    const OLS_B = 4.91;
    const olsProjection = OLS_A + OLS_B / N;

    rows.push({
      N,
      source: 'measured-float64-rk4',
      t_c: result.t_c !== null ? +result.t_c.toFixed(8) : null,
      reason: result.reason,
      dt: DT,
      nSteps: STEPS,
      stepsRun: result.step,
      wallTimeMs: wallMs,
      olsProjection: +olsProjection.toFixed(8),
      note: `Float64 RK4 (NOT certified interval arithmetic). Step-size adaptive near collision. ` +
            `Estimated ~${stepSec.toFixed(0)}s/step. ` +
            (result.reason === 'budget-exhausted'
              ? `Budget exhausted at t=${result.t_c?.toFixed(6)}; increase --steps to push further.`
              : `Collision detected at t_c ~ ${result.t_c?.toFixed(6)}.`),
    });
  }

  const output = {
    generatedAt:      new Date().toISOString(),
    source:           'imp-514 offline compute harness (scripts/compute-dyson-ladder-extended.mjs)',
    zerosProvenance:  'Odlyzko zeta tables (https://www-users.cse.umn.edu/~odlyzko/zeta_tables/)',
    zerosLoaded:      allZeros.length,
    dt:               DT,
    maxSteps:         STEPS,
    rows,
    subGaps: [
      {
        id:          'imp514a',
        description: 'zeros data blocker: zeros-to-1e6.js has 100K entries; N>100K needs zeros2..zerosK. ' +
                     'Run this script with --download to fetch additional Odlyzko batches. ' +
                     'zeros6 may also be a combined 2M-zero file (~35 MB) at the same base URL.',
        status:      'partial',
      },
      {
        id:          'imp514b',
        description: 'compute feasibility: Float64 RK4 in Node.js handles N up to ~250K-400K (minutes to hours). ' +
                     'N=600K-1M requires C/Rust backend (Arb, CAPD, or custom). ' +
                     'This script cannot fully close imp-514 for N=1M without native code.',
        status:      'open',
      },
      {
        id:          'imp514c',
        description: 'certification: Float64 RK4 gives t_c central value without error bars. ' +
                     'Interval arithmetic (interval-dyson-integrator.mjs) is certified but returns ' +
                     'budget-exhausted for N>100K. Closing imp-514 with certified bounds at N=1M ' +
                     'requires a native Arb/CAPD backend.',
        status:      'open',
      },
    ],
    usageNote: 'Import these rows into dyson-ladder-measured.js to replace PROJECTED_ROWS at matching N. ' +
               'Only rows with source="measured-float64-rk4" and reason="gap-nonpositive" carry ' +
               'a meaningful collision time. Budget-exhausted rows report t_c as a lower bound.',
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${rows.length} rows to ${path.relative(ROOT, OUT_PATH)}`);
  console.log('To integrate with dyson-ladder-measured.js, load this JSON and replace PROJECTED_ROWS at matching N.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
