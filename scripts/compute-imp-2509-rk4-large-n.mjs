#!/usr/bin/env node
/**
 * imp-2509: Close sub-gap imp-860-sub-extend-to-N10k.
 *
 * Extends the direct backward-Dyson RK4 sweep of imp-860
 * (src/data/c-mb-empirical-dyson-sweep.js) to N in {500, 1000, 2000, 5000,
 * 10000} by running the SAME RK4 + Kahan-Neumaier integrator OFFLINE (the
 * named blocker was module-load cost, resolution path (a) of the sub-gap:
 * precompute once and cache as JSON).
 *
 * Integrator: verbatim replica of rk4StepKahan / dysonDerivativesKahan /
 * minSpacingInfo from src/math/dyson-ode-integrator.js (imp-306/imp-363),
 * with the identical collision gate (raw spacing < 1e-4) and the identical
 * t_c convention (t_c = step * dt at the first step whose PRE-step minimum
 * spacing is below the gate).
 *
 * Step size: the imp-859 config (dt = 5e-4) is physically unusable at large
 * N because tau_c_est(N) is non-increasing and drops below 5e-4 near
 * N = 10^4 (a single 5e-4 step would overshoot the collision). Per N we use
 * dt = min(5e-4, tau_c_est(N) / 300), so the t_c quantization error (one dt)
 * stays below ~0.4% of tau_c_est. Each N is re-run at dt/2 as a step-halving
 * self-consistency check; agreement within 5*dt is recorded per row (the
 * 5*dt factor matches the imp-357/imp-859 integrator-agreement convention,
 * minus its 1e-3 absolute floor which would swamp the small-tau rows; the
 * observed worst case is 2.5*dt at N = 1000).
 *
 * Sweep quantities (H_unf, jStar, rho, tau_c_est) are recomputed here with
 * the same RvM formulas as src/data/empirical-m-sweep-extended.js and
 * cross-checked against that module's SAMPLES at the shared N values.
 *
 * Output: src/data/imp-2509-rk4-large-n-rows.json
 * Usage:  node scripts/compute-imp-2509-rk4-large-n.mjs [--smoke]
 *         (--smoke runs only N=500 to validate plumbing)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import { EMPIRICAL_M_SWEEP_EXTENDED } from '../src/data/empirical-m-sweep-extended.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, '../src/data/imp-2509-rk4-large-n-rows.json');
const SMOKE = process.argv.includes('--smoke');

const TARGET_NS = SMOKE ? [500] : [500, 1000, 2000, 5000, 10000];
const COLLISION_GATE = 1e-4;
const DT_CAP = 5e-4;          // imp-859 config value, used when tau_c_est allows
const DT_DIVISOR = 300;       // dt = tau_c_est / 300 when below the cap
const MAX_STEPS = 1200;       // covers measured/est ratios up to 4 at dt = est/300

// ── RvM helpers (identical to empirical-m-sweep-extended.js) ────────────────
function rvmF(T) {
  const L = Math.log(T / (2 * Math.PI));
  return (T / (2 * Math.PI)) * (L - 1);
}
function rvmDensity(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}

// ── Integrator (verbatim replica of dyson-ode-integrator.js, imp-306/363) ──
function dysonDerivativesKahan(gammas, direction) {
  const N = gammas.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0, c = 0;
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = gammas[n] - gammas[k];
      if (Math.abs(diff) < 1e-15) continue;
      const term = 1 / diff;
      const t = sum + term;
      c += Math.abs(sum) >= Math.abs(term) ? (sum - t) + term : (term - t) + sum;
      sum = t;
    }
    dg[n] = direction * 2 * (sum + c);
  }
  return dg;
}

function rk4StepKahan(gammas, dt, direction) {
  const N = gammas.length;
  const k1 = dysonDerivativesKahan(gammas, direction);
  const y1 = new Float64Array(N);
  for (let i = 0; i < N; i++) y1[i] = gammas[i] + dt / 2 * k1[i];
  const k2 = dysonDerivativesKahan(y1, direction);
  const y2 = new Float64Array(N);
  for (let i = 0; i < N; i++) y2[i] = gammas[i] + dt / 2 * k2[i];
  const k3 = dysonDerivativesKahan(y2, direction);
  const y3 = new Float64Array(N);
  for (let i = 0; i < N; i++) y3[i] = gammas[i] + dt * k3[i];
  const k4 = dysonDerivativesKahan(y3, direction);
  const result = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    result[i] = gammas[i] + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return result;
}

function minSpacingInfo(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { spacing: minS, index: minIdx };
}

// Same convention as runBackwardCollision in dyson-ode-integrator.js:
// spacing is checked BEFORE stepping; t_c = step * dt on first sub-gate spacing.
function runBackwardCollision(initial, dt, maxSteps) {
  let gammas = Float64Array.from(initial);
  for (let step = 0; step < maxSteps; step++) {
    const { spacing, index } = minSpacingInfo(gammas);
    if (spacing < COLLISION_GATE) {
      return { t_c: step * dt, steps: step, pair_index: index, final_spacing: spacing };
    }
    gammas = rk4StepKahan(gammas, dt, -1);
  }
  return { t_c: null, steps: maxSteps, pair_index: null, final_spacing: null };
}

// ── Sweep-sample lookup for the cross-check ────────────────────────────────
const SWEEP_BY_N = Object.create(null);
for (const s of EMPIRICAL_M_SWEEP_EXTENDED.samples) SWEEP_BY_N[s.N] = s;

// ── Main sweep ──────────────────────────────────────────────────────────────
const rows = [];
for (const N of TARGET_NS) {
  const zeros = ZEROS_EXTENDED.slice(0, N);

  // Sweep quantities, same math as empirical-m-sweep-extended.js.
  let H_unf = Infinity, jStar = 0;
  let prevF = rvmF(zeros[0]);
  for (let k = 1; k < N; k++) {
    const F = rvmF(zeros[k]);
    const d = F - prevF;
    if (d < H_unf) { H_unf = d; jStar = k - 1; }
    prevF = F;
  }
  const rho = rvmDensity(zeros[jStar]);
  const tau_est = (H_unf * H_unf) / (8 * rho * rho);
  const H_raw = H_unf / rho;

  // Cross-check against the imp-833 sweep samples (rounded display values).
  const sample = SWEEP_BY_N[N] || null;
  const sweepConsistent = sample
    ? Math.abs(sample.tauC_est - tau_est) / tau_est < 1e-4 &&
      Math.abs(sample.H_N - H_unf) / H_unf < 1e-4 &&
      Math.abs(sample.rho_jStar - rho) < 1e-6
    : null;

  const dt = Math.min(DT_CAP, tau_est / DT_DIVISOR);

  console.log(`N=${N}: H_unf=${H_unf.toExponential(4)} jStar=${jStar + 1} rho=${rho.toFixed(5)} ` +
    `tau_est=${tau_est.toExponential(4)} dt=${dt.toExponential(3)} sweepConsistent=${sweepConsistent}`);

  let t0 = Date.now();
  const run = runBackwardCollision(zeros, dt, MAX_STEPS);
  const wallMsFull = Date.now() - t0;

  t0 = Date.now();
  const runHalf = runBackwardCollision(zeros, dt / 2, MAX_STEPS * 2);
  const wallMsHalf = Date.now() - t0;

  const halvingAgrees =
    run.t_c !== null && runHalf.t_c !== null &&
    Math.abs(run.t_c - runHalf.t_c) <= 5 * dt;

  console.log(`  t_c=${run.t_c === null ? 'null' : run.t_c.toExponential(5)} (${run.steps} steps, ${wallMsFull} ms); ` +
    `t_c(dt/2)=${runHalf.t_c === null ? 'null' : runHalf.t_c.toExponential(5)} (${runHalf.steps} steps, ${wallMsHalf} ms); ` +
    `halvingAgrees=${halvingAgrees}`);

  rows.push({
    N,
    dt: +dt.toExponential(6),
    maxSteps: MAX_STEPS,
    tc_measured: run.t_c !== null ? +run.t_c.toExponential(6) : null,
    steps_to_collision: run.steps,
    pair_index: run.pair_index,
    tc_dt_half: runHalf.t_c !== null ? +runHalf.t_c.toExponential(6) : null,
    halving_agrees_within_5dt: halvingAgrees,
    tau_c_est: +tau_est.toExponential(6),
    H_unf: +H_unf.toExponential(6),
    H_raw: +H_raw.toExponential(6),
    rho_argmin: +rho.toFixed(7),
    jStar_1indexed: jStar + 1,
    gamma_jStar: +zeros[jStar].toFixed(4),
    sweep_sample_consistent: sweepConsistent,
    wall_ms: wallMsFull + wallMsHalf,
  });
}

const out = {
  id: 'imp-2509',
  closesSubGap: 'imp-860-sub-extend-to-N10k',
  generatedBy: 'scripts/compute-imp-2509-rk4-large-n.mjs',
  generatedAtUtc: new Date().toISOString(),
  smoke: SMOKE,
  zeroSource: 'src/data/zeros-to-1e6.js (Odlyzko, imp-359)',
  integrator:
    'RK4 + Kahan-Neumaier backward Dyson (verbatim replica of ' +
    'src/math/dyson-ode-integrator.js rk4StepKahan, imp-306/imp-363); ' +
    'collision gate raw spacing < 1e-4; t_c = step * dt at first sub-gate step',
  dtPolicy:
    'dt = min(5e-4, tau_c_est(N) / 300) — the imp-859 fixed dt = 5e-4 exceeds ' +
    'tau_c_est(N) near N = 10^4, so a per-N dt is physically required; each N ' +
    're-run at dt/2 as a step-halving self-consistency check (agreement ' +
    'tolerance 5*dt, the imp-357/imp-859 convention without its 1e-3 floor)',
  rows,
};

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${OUT_PATH} (${rows.length} rows)`);
