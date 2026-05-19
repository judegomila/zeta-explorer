#!/usr/bin/env node
/**
 * imp-1090 Phase 1 — generate JS reference data at N=1000 for the
 * Rust interval-RK4 acceptance test.
 *
 * Loads the first 1000 Riemann zeros from ZEROS_EXTENDED, runs the
 * existing one-ULP interval RK4 backward integrator (imp-362) with
 * a small dt and a step budget large enough that the integration
 * terminates with EITHER a closed bracket OR a budget-exhausted lower
 * bound. Writes the resulting (t_c_lo, t_c_hi, ...) record plus the
 * exact initial conditions and integrator parameters to
 * rust/interval-rk4/tests/reference-data-n1000.json so the Rust
 * `n_1000_vs_js` integration test can re-run the same instance and
 * compare bracket endpoints.
 *
 * USAGE:
 *   node rust/interval-rk4/tests/generate-reference.mjs
 *
 * The chosen dt and max_steps must be modest because the JS integrator
 * is O(N^2) per stage = O(N^2) per step. At N=1000 a single step is
 * ~410ms (per the imp-423 cost model: step_sec(N) ~ 410*(N/25000)^2).
 * So at N=1000 a single step is ~0.7 ms — fast — but we keep the
 * budget small to keep the reference generator under one minute.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { backwardCollisionInterval } from '../../../src/math/interval-dyson-integrator.mjs';
import { ZEROS_EXTENDED } from '../../../src/data/zeros-to-1e6.js';

const N = 1000;
// Step size chosen so the integrator EITHER closes a bracket OR
// exhausts the budget. At N=1000 the JS interval RK4 is O(N^2) per
// stage = ~16M interval ops per RK4 step, so a single step is on the
// order of seconds. Keep MAX_STEPS modest to keep the generator under
// a minute. The pair collision time at N=1000 is ~5e-5 (per the
// imp-360 ladder); dt = 1e-5 with 30 steps spans t in [0, 3e-4] and
// either closes the bracket or exhausts the budget — both outcomes
// yield a deterministic reference the Rust port can reproduce.
// dt and MAX_STEPS match the existing imp-857 baseline at N=1000:
// dt = 1e-4, closure at step 34 (per src/data/imp-857-baseline-sweep-result.js).
// 40 steps gives a small safety margin past the expected closure step.
const DT = 1e-4;
const MAX_STEPS = 40;

const initial_x = ZEROS_EXTENDED.slice(0, N);

const t0 = Date.now();
const result = backwardCollisionInterval(initial_x, DT, MAX_STEPS);
const runtime_ms = Date.now() - t0;

const out = {
  generated_at: new Date().toISOString(),
  N,
  initial_x_first5: initial_x.slice(0, 5),
  initial_x_last5: initial_x.slice(-5),
  initial_x_sha_proxy: {
    sum: initial_x.reduce((a, b) => a + b, 0),
    count: initial_x.length,
  },
  initial_x,
  dt: DT,
  max_steps: MAX_STEPS,
  js_result: {
    t_c_lo: result.t_c_lo,
    t_c_hi: result.t_c_hi,
    width: result.width,
    steps: result.steps,
    reason: result.reason,
    collisionIndex: result.collisionIndex,
    finalMinGapLo: result.finalMinGapLo,
    finalMinGapHi: result.finalMinGapHi,
  },
  js_runtime_ms: runtime_ms,
};

const outPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  'reference-data-n1000.json',
);
writeFileSync(outPath, JSON.stringify(out, null, 2));

process.stdout.write(
  `Generated reference data: N=${N}, dt=${DT}, steps=${result.steps}, ` +
    `reason=${result.reason}, t_c_lo=${result.t_c_lo}, t_c_hi=${result.t_c_hi}, ` +
    `runtime_ms=${runtime_ms}\n`,
);
process.stdout.write(`Wrote ${outPath}\n`);
