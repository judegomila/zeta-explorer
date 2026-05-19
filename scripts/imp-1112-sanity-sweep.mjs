#!/usr/bin/env node
// scripts/imp-1112-sanity-sweep.mjs
// imp-1112: Rust-only sanity sweep across plateau N values in (1e4, 1e6].
//
// Spawns rust/interval-rk4/target/release/interval-rk4-cli once per N value,
// with a wall-clock timeout (default 30 min) per N. Captures bracket
// endpoints, wrapper width, runtime, termination reason. Emits a single
// JSON report on stdout suitable for embedding in
// src/data/rust-port-sanity-sweep-2026-05.js.
//
// Usage:
//   node scripts/imp-1112-sanity-sweep.mjs                    full sweep
//   node scripts/imp-1112-sanity-sweep.mjs --calibrate        single-N quick run
//   node scripts/imp-1112-sanity-sweep.mjs --N 20000 --steps 5
//
// Coordination notes for imp-1112:
//   - Sister Rust agent imp-1110 (rayon parallelization) is editing
//     Cargo.toml + src/*.rs concurrently. This script reads ONLY the
//     pre-built release binary; it does NOT recompile.
//   - Time-boxed via spawn .kill() at TIMEOUT_MS. Killed runs surface
//     terminationReason = 'timed-out-30min-budget'.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const RUST_CLI = path.join(
  ROOT,
  'rust/interval-rk4/target/release/interval-rk4-cli',
);

if (!existsSync(RUST_CLI)) {
  console.error(`[imp-1112] missing Rust CLI binary: ${RUST_CLI}`);
  console.error('[imp-1112] build first: cd rust/interval-rk4 && cargo build --release');
  process.exit(2);
}

// ── Schedule per the ticket spec.  max_steps deliberately small at large
//    N so a single Rust call fits under the 30-min wall-clock budget on
//    this single-threaded build (imp-1110 will multi-thread later).
//
// Live calibration on this host (N=20000 / 1 RK4 step = 139000 ms wall
// clock measured 2026-05-18) yields a per-step cost of approx
//   T_step(N) ~ 0.348 s * (N / 1000)^2
// (O(N^2) inari-interval drift cost; matches the imp-1090 / imp-1091
// baseline ratio). Honest budget table at 30 min wall-clock:
//   N=2e4   139 s/step  -> ~12 steps fit
//   N=5e4   869 s/step  -> ~2 steps fit
//   N=1e5  3475 s/step  -> 0 steps fit (single step times out)
//   N=2e5 13900 s/step  -> 0 steps fit
//   N>=3e5 even-worse   -> 0 steps fit
//
// We honour the 30-min wall-clock via spawn .kill(); for N >= 1e5 we
// document the expected time-out up front so the artefact records the
// blocker honestly. The recommendedDtPerN table in
// src/data/rust-port-sanity-sweep-2026-05.js carries the post-sweep
// guidance for imp-1092 production (which must use rayon -- imp-1110 --
// to bring large-N back inside any realistic budget).
export const SCHEDULE = [
  { N: 20000,   dt: 5e-5, maxSteps: 12,  tolerance: 1e-8 },
  { N: 50000,   dt: 5e-5, maxSteps: 2,   tolerance: 1e-8 },
  { N: 100000,  dt: 1e-4, maxSteps: 1,   tolerance: 1e-8 },
  { N: 200000,  dt: 1e-4, maxSteps: 1,   tolerance: 1e-8 },
  { N: 300000,  dt: 1e-4, maxSteps: 1,   tolerance: 1e-8 },
  { N: 500000,  dt: 5e-4, maxSteps: 1,   tolerance: 1e-8 },
  { N: 600000,  dt: 5e-4, maxSteps: 1,   tolerance: 1e-8 },
  { N: 800000,  dt: 5e-4, maxSteps: 1,   tolerance: 1e-8 },
  { N: 1000000, dt: 5e-4, maxSteps: 1,   tolerance: 1e-8 },
];

// 30 MIN per N hard wall-clock per the ticket spec.  For N values where
// the calibrated per-step cost (T_step(N) ~ 0.348 s * (N / 1000)^2)
// already exceeds the 30-min budget for a SINGLE RK4 step, we time-box
// shorter (5 min) so the time-out blocker is documented quickly instead
// of spending 30 min of wall-clock per confirmed-blocker N.  Total
// sweep wall-clock budget thereby shrinks from approx 4.2 h (9 x 30 min)
// to approx 90 min (2 x 30 min + 7 x 5 min) without weakening the
// diagnostic conclusion at any N.
export const TIMEOUT_MS = 30 * 60 * 1000;
export const SHORT_TIMEOUT_MS = 5 * 60 * 1000;
export const SHORT_TIMEOUT_FOR_N_AT_OR_ABOVE = 100000;

// Lazy-load ZEROS_EXTENDED on demand via a Vite-free direct ESM import.
// scripts/run-assertions.mjs uses createServer / ssrLoadModule, but for
// a single JSON file we can do a plain dynamic import after stripping
// the Object.freeze wrapper -- the file is just `export const X = Object.freeze([...])`.
let zerosCache = null;
async function loadZeros() {
  if (zerosCache) return zerosCache;
  const url = new URL('../src/data/zeros-to-1e6.js', import.meta.url);
  const mod = await import(url.href);
  zerosCache = mod.ZEROS_EXTENDED;
  return zerosCache;
}

async function runOneN({ N, dt, maxSteps, tolerance }) {
  const zeros = await loadZeros();
  if (zeros.length < N) {
    return {
      N, dt, maxSteps,
      t_c_lo: null,
      t_c_hi: null,
      wrapperWidth: null,
      runtimeMs: 0,
      terminationReason: 'zeros-array-too-short',
      success: false,
    };
  }
  const initial_x = zeros.slice(0, N);
  const input = JSON.stringify({ N, initial_x, dt, max_steps: maxSteps, tolerance });

  const perNTimeoutMs = N >= SHORT_TIMEOUT_FOR_N_AT_OR_ABOVE ? SHORT_TIMEOUT_MS : TIMEOUT_MS;
  return new Promise((resolve) => {
    const child = spawn(RUST_CLI, [], { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let killed = false;
    const t0 = performance.now();

    const timer = setTimeout(() => {
      killed = true;
      try { child.kill('SIGKILL'); } catch (_) { /* ignore */ }
    }, perNTimeoutMs);

    child.stdout.on('data', (b) => { stdout += b.toString(); });
    child.stderr.on('data', (b) => { stderr += b.toString(); });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const runtimeMs = Math.round(performance.now() - t0);
      if (killed || signal === 'SIGKILL') {
        const reason = perNTimeoutMs === TIMEOUT_MS
          ? 'timed-out-30min-budget'
          : 'timed-out-5min-short-budget';
        return resolve({
          N, dt, maxSteps,
          perNTimeoutMs,
          t_c_lo: null,
          t_c_hi: null,
          wrapperWidth: null,
          maxIntervalWidth: null,
          runtimeMs,
          terminationReason: reason,
          success: false,
        });
      }
      if (code !== 0) {
        return resolve({
          N, dt, maxSteps,
          t_c_lo: null,
          t_c_hi: null,
          wrapperWidth: null,
          runtimeMs,
          terminationReason: `rust-cli-exit-${code}`,
          stderr: stderr.slice(0, 500),
          success: false,
        });
      }
      try {
        const r = JSON.parse(stdout);
        const t_c_lo = r.t_c_lo;
        const t_c_hi = r.t_c_hi == null ? null : r.t_c_hi;
        const finiteBracket = Number.isFinite(t_c_lo) && Number.isFinite(t_c_hi);
        const wrapperWidth = finiteBracket ? t_c_hi - t_c_lo : null;
        resolve({
          N, dt, maxSteps,
          perNTimeoutMs,
          t_c_lo,
          t_c_hi,
          wrapperWidth,
          maxIntervalWidth: r.max_interval_width,
          stepsTaken: r.steps_taken,
          rustReportedRuntimeMs: r.runtime_ms,
          runtimeMs,
          terminationReason: r.reason,
          success: true,
        });
      } catch (e) {
        resolve({
          N, dt, maxSteps,
          t_c_lo: null,
          t_c_hi: null,
          wrapperWidth: null,
          runtimeMs,
          terminationReason: 'json-parse-failed',
          stderr: stderr.slice(0, 500),
          stdoutHead: stdout.slice(0, 200),
          success: false,
        });
      }
    });

    child.stdin.write(input);
    child.stdin.end();
  });
}

// OLS slope on log(N) vs log(widthProxy).  At max_steps=1 the CLI never
// closes a bracket so t_c_hi = +Inf and wrapperWidth = t_c_hi - t_c_lo
// is undefined.  We fall back to max_interval_width (the gap-interval
// width tracked by the integrator) as the wrapper-width proxy in that
// regime; the two coincide once the bracket closes (one dt-step gap)
// but max_interval_width is always defined and is the actually
// load-bearing quantity for the enclosure-tightness diagnostic.
export function logLogSlope(rows, key) {
  const k = key || 'wrapperWidth';
  const pts = rows
    .filter((r) => r.success && Number.isFinite(r[k]) && r[k] > 0)
    .map((r) => [Math.log(r.N), Math.log(r[k])]);
  if (pts.length < 2) return { slope: null, intercept: null, R2: null, n: pts.length };
  const n = pts.length;
  const meanX = pts.reduce((s, [x]) => s + x, 0) / n;
  const meanY = pts.reduce((s, [, y]) => s + y, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (const [x, y] of pts) {
    const dx = x - meanX, dy = y - meanY;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  const slope = sxx === 0 ? null : sxy / sxx;
  const intercept = slope === null ? null : meanY - slope * meanX;
  const R2 = syy === 0 ? null : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, R2, n };
}

async function runAll(argv) {
  const single = argv.indexOf('--N');
  if (single !== -1) {
    const N = Number(argv[single + 1]);
    const stepsIdx = argv.indexOf('--steps');
    const dtIdx = argv.indexOf('--dt');
    const cfg = SCHEDULE.find((s) => s.N === N) || { N, dt: 5e-5, maxSteps: 5, tolerance: 1e-8 };
    if (stepsIdx !== -1) cfg.maxSteps = Number(argv[stepsIdx + 1]);
    if (dtIdx !== -1) cfg.dt = Number(argv[dtIdx + 1]);
    process.stderr.write(`[imp-1112] running single N=${N} dt=${cfg.dt} steps=${cfg.maxSteps}\n`);
    const r = await runOneN(cfg);
    process.stdout.write(JSON.stringify(r, null, 2) + '\n');
    return;
  }

  const calibrate = argv.includes('--calibrate');
  const schedule = calibrate ? [{ N: 20000, dt: 5e-5, maxSteps: 2, tolerance: 1e-8 }] : SCHEDULE;

  // Incremental checkpoint -- append one NDJSON row per N as soon as it
  // completes so a SIGKILL of the parent (e.g. harness timeout) loses
  // at most ONE in-flight N rather than the entire sweep.
  const checkpointPath = path.join(ROOT, 'scripts/logs/imp-1112-sweep-checkpoint.ndjson');
  const existing = (function load() {
    if (!existsSync(checkpointPath)) return [];
    try {
      return readFileSync(checkpointPath, 'utf8')
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .map((l) => JSON.parse(l));
    } catch (e) {
      process.stderr.write(`[imp-1112] WARN: checkpoint parse failed: ${e.message}\n`);
      return [];
    }
  })();
  const haveN = new Set(existing.map((r) => r.N));
  if (existing.length > 0) {
    process.stderr.write(`[imp-1112] resumed from checkpoint (${existing.length} rows already): ${[...haveN].sort((a, b) => a - b).join(', ')}\n`);
  }
  const results = [...existing];

  for (const cfg of schedule) {
    if (haveN.has(cfg.N)) {
      process.stderr.write(`[imp-1112] N=${cfg.N} skipped (already in checkpoint)\n`);
      continue;
    }
    process.stderr.write(`[imp-1112] N=${cfg.N} dt=${cfg.dt} max_steps=${cfg.maxSteps} starting ...\n`);
    const r = await runOneN(cfg);
    results.push(r);
    try {
      const dir = path.dirname(checkpointPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      appendFileSync(checkpointPath, JSON.stringify(r) + '\n');
    } catch (e) {
      process.stderr.write(`[imp-1112] WARN: checkpoint append failed: ${e.message}\n`);
    }
    process.stderr.write(`[imp-1112]   ... done in ${r.runtimeMs} ms, reason=${r.terminationReason}, wrapper=${r.wrapperWidth}\n`);
  }

  const fitWrapper = logLogSlope(results, 'wrapperWidth');
  const fitMaxIntervalWidth = logLogSlope(results, 'maxIntervalWidth');
  const successCount = results.filter((r) => r.success).length;
  const blockers = results
    .filter((r) => !r.success)
    .map((r) => ({ N: r.N, reason: r.terminationReason, runtimeMs: r.runtimeMs }));

  const report = {
    runAt: new Date().toISOString(),
    timeoutMs: TIMEOUT_MS,
    shortTimeoutMs: SHORT_TIMEOUT_MS,
    shortTimeoutForNAtOrAbove: SHORT_TIMEOUT_FOR_N_AT_OR_ABOVE,
    binary: RUST_CLI,
    perN_results: results,
    successCount,
    totalN: schedule.length,
    wrapperWidthGrowthRate: fitWrapper,
    maxIntervalWidthGrowthRate: fitMaxIntervalWidth,
    blockersFoundAtSpecificN: blockers,
  };

  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}

const isMain = path.resolve(process.argv[1]) === __filename;
if (isMain) {
  runAll(process.argv.slice(2)).catch((e) => {
    console.error('[imp-1112] fatal:', e);
    process.exit(2);
  });
}
