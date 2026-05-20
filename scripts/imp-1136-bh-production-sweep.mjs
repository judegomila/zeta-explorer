#!/usr/bin/env node
// scripts/imp-1136-bh-production-sweep.mjs
// imp-1136: Phase 3 production sweep using the imp-1132 Barnes-Hut backend
// (or whatever backend the released interval-rk4-cli currently dispatches).
//
// Spawns rust/interval-rk4/target/release/interval-rk4-cli once per N value
// from the ticket plateau ladder {2e4, 5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5,
// 1e6}, with a wall-clock timeout per N. Captures bracket endpoints,
// wrapper width, runtime, termination reason. Writes one JSON report on
// stdout suitable for embedding in src/data/k-plateau-ladder-measured-2026-05.js
// and writes one NDJSON checkpoint row per N as soon as it completes to
// scripts/logs/imp-1136-sweep-checkpoint.ndjson.
//
// Per the ticket spec: 3 hour wall-clock per N for N < 1e5, 1 hour per N
// for N >= 1e5. Pick theta = 0.5 if multipole (imp-1139) has shipped,
// otherwise theta = 0.05 as the slower but correctness-preserving setting.
//
// CRITICAL NOTE: the current rust/interval-rk4/src/bin/interval-rk4-cli.rs
// (read-only here -- sister imp-1139 owns the rust src/ tree) dispatches
// `backward_collision_interval` which uses the DENSE O(N^2)
// dyson_drift_vector path, NOT the BH dyson_drift_vector_barnes_hut path.
// Until imp-1139 wires --integrator / --backend / --theta flags into the
// CLI, this sweep records dense-path measurements; large-N rows time out
// honestly. The theta_used field still records the theta we would HAVE
// asked for had the CLI accepted it, so the artifact is forward-compatible
// when imp-1139 ships.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
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
  console.error(`[imp-1136] missing Rust CLI binary: ${RUST_CLI}`);
  console.error('[imp-1136] build first: cd rust/interval-rk4 && cargo build --release');
  process.exit(2);
}

// Ticket plateau ladder. Same 9 N values as imp-1092 / imp-1112 / imp-1082.
export const PLATEAU_NS = [
  20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000,
];

// dt + max_steps schedule. Calibrated from imp-1112 measured data:
//   N = 2e4 / dt = 5e-5 / 12 steps  -> 356 s, closed bracket (4 steps used)
//   N = 5e4 / dt = 5e-5 / 2 steps   -> 1113 s, partial bracket (2 steps used)
//   N >= 1e5 -> single-step dense cost already exceeds the budget.
// imp-1092 pilot used dt = 1e-4 / 8 steps at N = 2e4 and got a bracket in
// 2 steps / 180 s. We use the imp-1092 settings at N = 2e4 (faster) and
// the imp-1112 settings elsewhere.
export const SCHEDULE = [
  { N: 20000,   dt: 1e-4, maxSteps: 8,  tolerance: 1e-8 },
  { N: 50000,   dt: 5e-5, maxSteps: 2,  tolerance: 1e-8 },
  { N: 100000,  dt: 1e-4, maxSteps: 1,  tolerance: 1e-8 },
  { N: 200000,  dt: 1e-4, maxSteps: 1,  tolerance: 1e-8 },
  { N: 300000,  dt: 1e-4, maxSteps: 1,  tolerance: 1e-8 },
  { N: 500000,  dt: 5e-4, maxSteps: 1,  tolerance: 1e-8 },
  { N: 600000,  dt: 5e-4, maxSteps: 1,  tolerance: 1e-8 },
  { N: 800000,  dt: 5e-4, maxSteps: 1,  tolerance: 1e-8 },
  { N: 1000000, dt: 5e-4, maxSteps: 1,  tolerance: 1e-8 },
];

// Per-N wall-clock budget. Per ticket: 3 h for N < 1e5, 1 h for N >= 1e5.
export const LONG_BUDGET_MS  = 3 * 60 * 60 * 1000;
export const SHORT_BUDGET_MS = 1 * 60 * 60 * 1000;
export const SHORT_FOR_N_AT_OR_ABOVE = 100000;

// theta the BH backend would use if the CLI accepted a flag. Recorded for
// the artifact so a future re-run on a BH-wired CLI is self-documenting.
// Per ticket: 0.5 if imp-1139 multipole shipped, 0.05 otherwise. imp-1139
// is currently pending, so we default to 0.05.
const IMP1139_SHIPPED = false; // flip when imp-1139 lands
export const DEFAULT_THETA = IMP1139_SHIPPED ? 0.5 : 0.05;

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
      theta: DEFAULT_THETA,
      t_c_lo: null,
      t_c_hi: null,
      wrapperWidth: null,
      maxIntervalWidth: null,
      runtimeMs: 0,
      terminationReason: 'zeros-array-too-short',
      success: false,
    };
  }
  const initial_x = zeros.slice(0, N);
  const input = JSON.stringify({ N, initial_x, dt, max_steps: maxSteps, tolerance });

  const perNTimeoutMs = N >= SHORT_FOR_N_AT_OR_ABOVE ? SHORT_BUDGET_MS : LONG_BUDGET_MS;
  return new Promise((resolve) => {
    const child = spawn(RUST_CLI, ['--drift-mode', 'bh_multipole', '--theta', '0.1'], { stdio: ['pipe', 'pipe', 'pipe'] });
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
        const reason = perNTimeoutMs === LONG_BUDGET_MS
          ? 'timed-out-3h-budget'
          : 'timed-out-1h-budget';
        return resolve({
          N, dt, maxSteps,
          theta: DEFAULT_THETA,
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
          theta: DEFAULT_THETA,
          t_c_lo: null,
          t_c_hi: null,
          wrapperWidth: null,
          maxIntervalWidth: null,
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
          theta: DEFAULT_THETA,
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
          theta: DEFAULT_THETA,
          t_c_lo: null,
          t_c_hi: null,
          wrapperWidth: null,
          maxIntervalWidth: null,
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

async function runAll(argv) {
  const single = argv.indexOf('--N');
  if (single !== -1) {
    const N = Number(argv[single + 1]);
    const stepsIdx = argv.indexOf('--steps');
    const dtIdx = argv.indexOf('--dt');
    const cfg = SCHEDULE.find((s) => s.N === N) || { N, dt: 5e-5, maxSteps: 1, tolerance: 1e-8 };
    if (stepsIdx !== -1) cfg.maxSteps = Number(argv[stepsIdx + 1]);
    if (dtIdx !== -1) cfg.dt = Number(argv[dtIdx + 1]);
    process.stderr.write(`[imp-1136] running single N=${N} dt=${cfg.dt} steps=${cfg.maxSteps}\n`);
    const r = await runOneN(cfg);
    process.stdout.write(JSON.stringify(r, null, 2) + '\n');
    return;
  }

  const onlyN = argv.indexOf('--only');
  const onlySet = onlyN !== -1
    ? new Set(argv[onlyN + 1].split(',').map((s) => Number(s)))
    : null;

  // Incremental checkpoint -- append one NDJSON row per N as soon as it
  // completes so a SIGKILL of the parent loses at most ONE in-flight N.
  const checkpointPath = path.join(ROOT, 'scripts/logs/imp-1136-sweep-checkpoint.ndjson');
  const existing = (function load() {
    if (!existsSync(checkpointPath)) return [];
    try {
      return readFileSync(checkpointPath, 'utf8')
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .map((l) => JSON.parse(l));
    } catch (e) {
      process.stderr.write(`[imp-1136] WARN: checkpoint parse failed: ${e.message}\n`);
      return [];
    }
  })();
  const haveN = new Set(existing.map((r) => r.N));
  if (existing.length > 0) {
    process.stderr.write(`[imp-1136] resumed from checkpoint (${existing.length} rows already): ${[...haveN].sort((a, b) => a - b).join(', ')}\n`);
  }
  const results = [...existing];

  for (const cfg of SCHEDULE) {
    if (onlySet && !onlySet.has(cfg.N)) continue;
    if (haveN.has(cfg.N)) {
      process.stderr.write(`[imp-1136] N=${cfg.N} skipped (already in checkpoint)\n`);
      continue;
    }
    process.stderr.write(`[imp-1136] N=${cfg.N} dt=${cfg.dt} max_steps=${cfg.maxSteps} theta=${DEFAULT_THETA} starting ...\n`);
    const r = await runOneN(cfg);
    results.push(r);
    try {
      const dir = path.dirname(checkpointPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      appendFileSync(checkpointPath, JSON.stringify(r) + '\n');
    } catch (e) {
      process.stderr.write(`[imp-1136] WARN: checkpoint append failed: ${e.message}\n`);
    }
    process.stderr.write(`[imp-1136]   ... done in ${r.runtimeMs} ms, reason=${r.terminationReason}, wrapper=${r.wrapperWidth}\n`);
  }

  const successCount = results.filter((r) => r.success).length;
  const blockers = results
    .filter((r) => !r.success)
    .map((r) => ({ N: r.N, reason: r.terminationReason, runtimeMs: r.runtimeMs }));

  const report = {
    runAt: new Date().toISOString(),
    longBudgetMs: LONG_BUDGET_MS,
    shortBudgetMs: SHORT_BUDGET_MS,
    shortBudgetForNAtOrAbove: SHORT_FOR_N_AT_OR_ABOVE,
    binary: RUST_CLI,
    theta: DEFAULT_THETA,
    imp1139Shipped: IMP1139_SHIPPED,
    perN_results: results,
    successCount,
    totalN: SCHEDULE.length,
    blockersFoundAtSpecificN: blockers,
  };

  const outPath = path.join(ROOT, 'scripts/logs/imp-1136-sweep-result.json');
  try {
    writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
    process.stderr.write(`[imp-1136] full report written to ${outPath}\n`);
  } catch (e) {
    process.stderr.write(`[imp-1136] WARN: result write failed: ${e.message}\n`);
  }

  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}

const isMain = path.resolve(process.argv[1]) === __filename;
if (isMain) {
  runAll(process.argv.slice(2)).catch((e) => {
    console.error('[imp-1136] fatal:', e);
    process.exit(2);
  });
}
