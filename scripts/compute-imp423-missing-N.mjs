#!/usr/bin/env node
/**
 * scripts/compute-imp423-missing-N.mjs
 *
 * Two responsibilities (split clearly):
 *
 * 1. Original (imp-423) — compute H_raw, t_c_pair, pairIdx for N values
 *    in TARGETS. O(N) over ZEROS_EXTENDED, runs offline once and writes
 *    JSON sidecar rows. NO interval-RK4 work, this is just min-gap.
 *
 * 2. imp-1091 — expose a dispatch wrapper `callIntervalRk4(args)` that
 *    invokes the native Rust CLI at
 *    rust/interval-rk4/target/release/interval-rk4-cli when present and
 *    falls back to the JS backwardCollisionInterval driver from
 *    src/math/interval-dyson-integrator.mjs when not. Both paths emit
 *    the same JSON shape:
 *
 *      {
 *        t_c_lo: f64,
 *        t_c_hi: f64 | null,   // null when budget-exhausted
 *        max_interval_width: f64,
 *        steps_taken: usize,
 *        reason: string,
 *        runtime_ms: number,
 *        backend: 'rust' | 'js',
 *      }
 *
 *    This is the single function the imp-423 / imp-1082 / imp-1087 /
 *    imp-1088 plateau ladder calls to obtain certified t_c brackets.
 *    Phase 3 (imp-1092) will sweep all 10 plateaus through this wrapper.
 *
 * SCHEMA REMARK
 * -------------
 * The Rust CLI serializes f64::INFINITY as JSON null (serde_json
 * default). The JS path returns Number.POSITIVE_INFINITY for the same
 * budget-exhausted case. The wrapper normalizes both to `null` so a
 * downstream consumer can compare brackets without backend-specific
 * branching.
 *
 * USAGE
 * -----
 *   # Original H_raw sidecar mode (no args):
 *   node scripts/compute-imp423-missing-N.mjs
 *
 *   # Dispatch-wrapper smoke test (single N from CLI):
 *   node scripts/compute-imp423-missing-N.mjs --rk4 --N 1000 --dt 1e-4 --maxSteps 40
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const TARGETS = [150000, 400000, 600000];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

// Resolved at top of module so the existsSync check is cached for the
// process lifetime. Engine workers spawning many invocations get a single
// stat() per process.
const RUST_CLI_PATH = resolve(
  REPO_ROOT,
  'rust/interval-rk4/target/release/interval-rk4-cli',
);

/**
 * True when the Rust release binary is built and on disk. False otherwise
 * (engine host has not run `cargo build --release` in `rust/interval-rk4`
 * or the build artifact has been pruned).
 */
export function rustCliPresent() {
  return existsSync(RUST_CLI_PATH);
}

/**
 * Dispatch a single interval-RK4 backward-collision run.
 *
 * @param {Object} args
 * @param {number} args.N
 * @param {Array<number>} args.initial_x  initial particle positions
 * @param {number} args.dt                positive dt = BACKWARD Dyson per imp-362
 * @param {number} args.max_steps         RK4 step budget
 * @param {number} [args.tolerance]       reserved, currently unused (mirrors CLI input)
 * @param {Object} [opts]
 * @param {boolean} [opts.forceJs]        skip the Rust path even if CLI present
 *
 * @returns {{
 *   t_c_lo: number,
 *   t_c_hi: number | null,
 *   max_interval_width: number,
 *   steps_taken: number,
 *   reason: string,
 *   runtime_ms: number,
 *   backend: 'rust' | 'js',
 * }}
 */
export function callIntervalRk4(args, opts = {}) {
  const { N, initial_x, dt, max_steps, tolerance = 1e-7 } = args;
  const { forceJs = false } = opts;

  if (!Array.isArray(initial_x) || initial_x.length !== N) {
    throw new Error(
      `callIntervalRk4: initial_x length ${initial_x?.length} must equal N=${N}`,
    );
  }
  if (!Number.isFinite(dt) || dt <= 0) {
    throw new Error(`callIntervalRk4: dt must be positive finite, got ${dt}`);
  }
  if (!Number.isInteger(max_steps) || max_steps <= 0) {
    throw new Error(
      `callIntervalRk4: max_steps must be positive integer, got ${max_steps}`,
    );
  }

  if (!forceJs && rustCliPresent()) {
    return callIntervalRk4Rust({ N, initial_x, dt, max_steps, tolerance });
  }
  return callIntervalRk4Js({ N, initial_x, dt, max_steps, tolerance });
}

function callIntervalRk4Rust({ N, initial_x, dt, max_steps, tolerance }) {
  const input = JSON.stringify({ N, initial_x, dt, max_steps, tolerance });
  const t0 = Date.now();
  const proc = spawnSync(RUST_CLI_PATH, [], {
    input,
    encoding: 'utf8',
    // N can reach 1e6; JSON payload is ~20MB. 1 GiB stdio buffer is
    // overkill but cheaper than re-running on a node default cap.
    maxBuffer: 1024 * 1024 * 1024,
  });
  const wallMs = Date.now() - t0;
  if (proc.status !== 0) {
    throw new Error(
      `Rust interval-rk4-cli exited with status ${proc.status}: ${proc.stderr || '(no stderr)'}`,
    );
  }
  const parsed = JSON.parse(proc.stdout.trim());
  return {
    t_c_lo: parsed.t_c_lo,
    // serde_json maps f64::INFINITY to JSON null; preserve null.
    t_c_hi: parsed.t_c_hi === undefined ? null : parsed.t_c_hi,
    max_interval_width: parsed.max_interval_width,
    steps_taken: parsed.steps_taken,
    reason: parsed.reason,
    // Prefer the in-process Rust-measured runtime_ms when present, but
    // surface the wall-clock as a fallback (covers cold-spawn cost).
    runtime_ms: Number.isFinite(parsed.runtime_ms) ? parsed.runtime_ms : wallMs,
    backend: 'rust',
  };
}

async function loadJsBackend() {
  // Dynamic import keeps the JS interval-RK4 module out of the hot path
  // when the Rust backend is used; the JS module pulls in
  // src/math/zeta.js which is not free to evaluate.
  const m = await import('../src/math/interval-dyson-integrator.mjs');
  return m.backwardCollisionInterval;
}

function callIntervalRk4Js({ N, initial_x, dt, max_steps }) {
  // Sync entry point for the JS fallback: the JS integrator is async
  // (dynamic import of interval-dyson-integrator.mjs which itself pulls
  // src/math/zeta.js, not a free evaluation), so the sync wrapper
  // explicitly throws and points the caller at callIntervalRk4Async.
  // Documented exception: if the Rust binary is missing AND the caller
  // is in a sync context, this is the right place to fail loudly.
  throw new Error(
    'callIntervalRk4 JS-fallback path requires async context. Use ' +
      'callIntervalRk4Async() or rebuild the cargo release binary at ' +
      RUST_CLI_PATH,
  );
}

/**
 * Async sibling of {@link callIntervalRk4}. Identical contract but
 * returns a Promise. The Rust path is still synchronous (spawnSync) but
 * the JS-fallback path must dynamic-import the integrator module.
 */
export async function callIntervalRk4Async(args, opts = {}) {
  const { N, initial_x, dt, max_steps, tolerance = 1e-7 } = args;
  const { forceJs = false } = opts;

  if (!forceJs && rustCliPresent()) {
    return callIntervalRk4Rust({ N, initial_x, dt, max_steps, tolerance });
  }

  const backwardCollisionInterval = await loadJsBackend();
  const t0 = Date.now();
  const r = backwardCollisionInterval(initial_x, dt, max_steps);
  const runtime_ms = Date.now() - t0;
  return {
    t_c_lo: r.t_c_lo,
    // JS uses Number.POSITIVE_INFINITY for the budget-exhausted branch;
    // normalize to null so consumers see one shape across backends.
    t_c_hi: Number.isFinite(r.t_c_hi) ? r.t_c_hi : null,
    // JS does not track max_interval_width across steps; approximate
    // from the final-step min-gap interval (finalMinGapHi -
    // finalMinGapLo).
    max_interval_width: Number.isFinite(r.finalMinGapHi - r.finalMinGapLo)
      ? r.finalMinGapHi - r.finalMinGapLo
      : NaN,
    steps_taken: r.steps,
    reason: r.reason,
    runtime_ms,
    backend: 'js',
  };
}

function compute(N) {
  let minGap = Infinity;
  let minIdx = -1;
  for (let i = 0; i + 1 < N; i++) {
    const g = ZEROS_EXTENDED[i + 1] - ZEROS_EXTENDED[i];
    if (g < minGap) {
      minGap = g;
      minIdx = i;
    }
  }
  const t_c_pair = (minGap * minGap) / 8;
  return { N, H_raw: minGap, t_c_pair, pairIdx: minIdx };
}

// CLI driver. Default: original H_raw sidecar mode.
// Optional: --rk4 mode invokes callIntervalRk4Async on a single N.
async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--rk4')) {
    const Narg = Number(argv[argv.indexOf('--N') + 1] || '1000');
    const dtArg = Number(argv[argv.indexOf('--dt') + 1] || '1e-4');
    const stepsArg = Number(argv[argv.indexOf('--maxSteps') + 1] || '40');
    const init = Array.from(ZEROS_EXTENDED).slice(0, Narg);
    console.error(
      `[imp-1091] dispatch: N=${Narg} dt=${dtArg} max_steps=${stepsArg} ` +
        `rustCliPresent=${rustCliPresent()}`,
    );
    const result = await callIntervalRk4Async({
      N: Narg,
      initial_x: init,
      dt: dtArg,
      max_steps: stepsArg,
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const t0 = Date.now();
  console.log('ZEROS_EXTENDED.length =', ZEROS_EXTENDED.length);
  const results = [];
  for (const N of TARGETS) {
    const r = compute(N);
    const estStepSec = Math.round(410 * Math.pow(N / 25000, 2));
    console.log(JSON.stringify({ ...r, estimatedStepSec: estStepSec }));
    results.push({ ...r, estimatedStepSec: estStepSec });
  }
  console.log('elapsed ms:', Date.now() - t0);
}

// Only run main when invoked directly (not when imported for the
// dispatch wrapper).
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === __filename;
if (invokedDirectly) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
