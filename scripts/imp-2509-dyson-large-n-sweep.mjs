// imp-2509 / imp-860-sub-extend-to-N10k — offline backward-Dyson RK4 sweep
// at N in {500, 1000, 2000, 5000, 10000}.
//
// WHY OFFLINE: module-load RK4 at N >= 500 is ~10^9 float ops per integrator
// and scales as N^2 (~5e11 at N = 10000) — infeasible inside the Vite build.
// This script implements resolution path (a)+(c) named in the sub-gap:
// precompute the rows once in an offline node run and cache them as an
// auto-generated module (src/data/c-mb-dyson-large-n-cache.js, same pattern
// as zeros-to-1e6.js) that the build imports for free.
//
// INTEGRATOR FIDELITY: dysonDerivativesKahan / rk4StepKahan / minSpacingInfo
// below are copied VERBATIM from src/math/dyson-ode-integrator.js
// (imp-306/imp-357/imp-363) so the cached t_c is produced by the SAME
// RK4 + Kahan-Neumaier scheme and the same spacing < 1e-4 collision gate as
// the in-build N in {50, 100, 200} rows. The only deliberate departures:
//   1. dt is SCALED PER N: dt_N = tauC_est(N) / 100. At large N the
//      leading-order collision time tauC_est = H_raw^2 / 8 shrinks below the
//      stock dt = 5e-4 (tauC_est ~ 1e-4 at N = 10000), so the stock step
//      would overshoot the collision entirely. The stock dt could never have
//      resolved F_mb at these N — this is part of why the sub-gap existed.
//   2. t_c is recorded at full Float64 precision (step * dt), not toFixed(6),
//      because t_c itself is ~1e-4 at the top of the range.
//   3. A dt/2 convergence re-run is performed at every N <= 2000 (cheap
//      there) to quantify step-size sensitivity of the cached t_c.
//   4. AUTOMATIC dt REFINEMENT: if the measured residual F_mb = |t_c -
//      tauC_est| is <= 5*dt (i.e. quantization-limited rather than resolved),
//      dt is divided by 10 and the run repeated, up to 2 refinements at
//      N <= 2000 and 1 at N >= 5000 (where each x10 costs ~10x wall time).
//      Every pass is recorded; the final pass carries a resolved flag
//      (F_mb > 5*dt_final).
//
// Usage: node scripts/imp-2509-dyson-large-n-sweep.mjs [N1 N2 ...]
//        (no args = the full ticket set {500, 1000, 2000, 5000, 10000})
//        With explicit N args, rows already present in the cache for OTHER N
//        are preserved (merge semantics), so the expensive targets can be
//        recomputed one at a time without losing the rest.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { ZEROS_EXTENDED } = await import('../src/data/zeros-to-1e6.js');
const { EMPIRICAL_M_SWEEP_EXTENDED } = await import('../src/data/empirical-m-sweep-extended.js');

// ── Verbatim copies from src/math/dyson-ode-integrator.js ───────────────────

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
  for (let i = 0; i < N; i++) y1[i] = gammas[i] + dt/2 * k1[i];
  const k2 = dysonDerivativesKahan(y1, direction);
  const y2 = new Float64Array(N);
  for (let i = 0; i < N; i++) y2[i] = gammas[i] + dt/2 * k2[i];
  const k3 = dysonDerivativesKahan(y2, direction);
  const y3 = new Float64Array(N);
  for (let i = 0; i < N; i++) y3[i] = gammas[i] + dt * k3[i];
  const k4 = dysonDerivativesKahan(y3, direction);
  const result = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    result[i] = gammas[i] + dt/6 * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]);
  }
  return result;
}

function minSpacingInfo(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i+1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { spacing: minS, index: minIdx };
}

// Same as src runBackwardCollision but full-precision t_c (departure 2).
function runBackwardCollision(initial, dt, maxSteps) {
  let gammas = Float64Array.from(initial);
  for (let step = 0; step < maxSteps; step++) {
    const { spacing, index } = minSpacingInfo(gammas);
    if (spacing < 1e-4) return { t_c: step * dt, pair_index: index, steps: step };
    gammas = rk4StepKahan(gammas, dt, -1);
  }
  return { t_c: null, pair_index: null, steps: maxSteps };
}

// ── Sweep ────────────────────────────────────────────────────────────────────

const TARGET_NS = process.argv.length > 2
  ? process.argv.slice(2).map(Number)
  : [500, 1000, 2000, 5000, 10000];

const SAMPLE_BY_N = new Map(EMPIRICAL_M_SWEEP_EXTENDED.samples.map((s) => [s.N, s]));

const DT_DIVISOR = 100;     // dt_N = tauC_est(N) / 100
const MAX_STEPS  = 1000;    // covers t up to 10 * tauC_est(N)
const HALF_DT_CONVERGENCE_N_MAX = 2000;

const rows = [];
for (const N of TARGET_NS) {
  const sample = SAMPLE_BY_N.get(N);
  if (!sample) {
    console.error(`N=${N}: no EMPIRICAL_M_SWEEP_EXTENDED sample — skipped`);
    continue;
  }
  const initial = ZEROS_EXTENDED.slice(0, N);
  const maxRefine = N <= 2000 ? 2 : 1;

  const passes = [];
  let dtN = sample.tauC_est / DT_DIVISOR;
  let maxSteps = MAX_STEPS;
  let main = null;
  for (let pass = 0; pass <= maxRefine; pass++) {
    const t0 = Date.now();
    main = runBackwardCollision(initial, dtN, maxSteps);
    const wallMs = Date.now() - t0;
    const fmb = main.t_c === null ? null : Math.abs(main.t_c - sample.tauC_est);
    const resolved = fmb !== null && fmb > 5 * dtN;
    passes.push({
      dt: dtN,
      maxSteps,
      t_c: main.t_c,
      pair_index: main.pair_index,
      steps: main.steps,
      F_mb: fmb,
      resolved,
      wall_ms: wallMs,
    });
    console.log(`N=${N} pass ${pass}: dt=${dtN.toExponential(3)} t_c=${main.t_c === null ? 'NONE' : main.t_c.toExponential(6)} steps=${main.steps} pair=${main.pair_index} F_mb=${fmb === null ? 'NONE' : fmb.toExponential(3)} resolved=${resolved} (${(wallMs/1000).toFixed(1)}s)`);
    if (main.t_c === null || resolved) break;
    // Quantization-limited: refine dt, sized so maxSteps comfortably covers
    // the collision time seen at the coarser dt.
    const cover = Math.max(main.t_c, sample.tauC_est);
    dtN /= 10;
    maxSteps = Math.ceil(1.3 * cover / dtN) + 50;
  }
  const finalPass = passes[passes.length - 1];

  let half = null;
  if (N <= HALF_DT_CONVERGENCE_N_MAX) {
    const t1 = Date.now();
    const h = runBackwardCollision(initial, finalPass.dt / 2, 2 * finalPass.maxSteps);
    half = {
      dt: finalPass.dt / 2,
      t_c: h.t_c,
      pair_index: h.pair_index,
      steps: h.steps,
      wall_ms: Date.now() - t1,
    };
    console.log(`  dt/2 check: t_c=${h.t_c === null ? 'NONE' : h.t_c.toExponential(6)} steps=${h.steps} pair=${h.pair_index}`);
  }

  rows.push({
    N,
    dt: finalPass.dt,
    maxSteps: finalPass.maxSteps,
    t_c: finalPass.t_c,
    pair_index: finalPass.pair_index,
    steps: finalPass.steps,
    resolved: finalPass.resolved,
    wall_ms: finalPass.wall_ms,
    tauC_est: sample.tauC_est,
    H_N: sample.H_N,
    rho_jStar: sample.rho_jStar,
    passes,
    halfDtCheck: half,
  });
}

// ── Emit cache module (merge with existing rows for N not in this run) ──────

if (process.argv.length > 2) {
  try {
    const { C_MB_DYSON_LARGE_N_CACHE } = await import('../src/data/c-mb-dyson-large-n-cache.js');
    for (const prev of C_MB_DYSON_LARGE_N_CACHE.rows || []) {
      if (!TARGET_NS.includes(prev.N)) rows.push(prev);
    }
    rows.sort((a, b) => a.N - b.N);
  } catch {
    // No existing cache — emit only the freshly-computed rows.
  }
}

const out = `/**
 * @module c-mb-dyson-large-n-cache
 * @fileoverview imp-2509 / imp-860-sub-extend-to-N10k — OFFLINE-PRECOMPUTED
 * backward-Dyson RK4 collision times at N in {${rows.map((r) => r.N).join(', ')}}.
 * Auto-generated by scripts/imp-2509-dyson-large-n-sweep.mjs. DO NOT EDIT BY
 * HAND — regenerate via: node scripts/imp-2509-dyson-large-n-sweep.mjs
 * Integrator: VERBATIM RK4 + Kahan-Neumaier from
 * src/math/dyson-ode-integrator.js (imp-306/imp-357/imp-363), spacing < 1e-4
 * collision gate, dt scaled per N as tauC_est(N)/${DT_DIVISOR} (the stock
 * dt = 5e-4 exceeds tauC_est itself at large N and cannot resolve F_mb).
 * Consumed by src/data/c-mb-empirical-dyson-sweep.js (imp-860 closure record).
 * @see imp-2509
 * @see scripts/imp-2509-dyson-large-n-sweep.mjs
 */

// Auto-generated by scripts/imp-2509-dyson-large-n-sweep.mjs (imp-2509)
// Generated: ${new Date().toISOString()}
// Node: ${process.version}

export const C_MB_DYSON_LARGE_N_CACHE = Object.freeze({
  generatedAt: '${new Date().toISOString()}',
  generator: 'scripts/imp-2509-dyson-large-n-sweep.mjs',
  integrator: 'rk4StepKahan (verbatim copy of src/math/dyson-ode-integrator.js)',
  collisionGate: 'spacing < 1e-4 between adjacent zeros',
  dtRule: 'dt_N = tauC_est(N) / ${DT_DIVISOR}',
  maxSteps: ${MAX_STEPS},
  zerosSource: 'src/data/zeros-to-1e6.js::ZEROS_EXTENDED (Odlyzko, imp-359)',
  rows: ${JSON.stringify(rows, null, 2)},
});
`;

const outPath = join(__dirname, '..', 'src', 'data', 'c-mb-dyson-large-n-cache.js');
writeFileSync(outPath, out);
console.log(`\nWrote ${outPath} (${rows.length} rows)`);
