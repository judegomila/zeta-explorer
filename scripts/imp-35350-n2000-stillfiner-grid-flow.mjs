// imp-35350 — re-run the imp-35324 R2 N=2000 order-robust backward-Dyson flow
// test on STILL-FINER BASE GRIDS (dt = tauC_est/8000 and tauC_est/16000) and
// measure whether the DP45-vs-RK4 dt/2 cross-family gap (7.576e-6 on the
// imp-35324 tauC/4000 grid) COLLAPSES toward the full-precision tie seen at
// N<=1000, and how far the DP45 dt/2 reference sits below t_c_hi=1.2e-3 (the
// 6.16e-8 knife-edge clearance imp-35324 measured).
//
// KEY OBSERVATION ON RESOLUTIONS
// imp-35324 ran base dt = tauC/4000 with a dt/2 refinement at tauC/8000. So its
// dt/2 cross-family gap (7.576e-6) is a measurement AT resolution tauC/8000.
// A base grid of tauC/8000 has its dt/2 refinement at tauC/16000; a base grid of
// tauC/16000 refines to tauC/32000. So the distinct new resolutions this test
// needs are tauC/16000 and tauC/32000 (tauC/8000 is recomputed here too so the
// script is self-contained and cross-checks imp-35324).
//
// MEASUREMENT/CERTIFICATION ONLY. Removes no conditional; C_mb stays
// GUE-conditional per imp-486; does NOT advance the R2 ladder past N=1000;
// changes NO bound; NO QED. Result baked as a light literal into
// src/data/imp-35350-r2-n2000-stillfiner-grid-reference.js (no heavy build import).
//
// Run: node scripts/imp-35350-n2000-stillfiner-grid-flow.mjs

const { ZEROS_EXTENDED } = await import('../src/data/zeros-to-1e6.js');
const { EMPIRICAL_M_SWEEP_EXTENDED } = await import('../src/data/empirical-m-sweep-extended.js');

// ── Verbatim Kahan-Neumaier Dyson derivative (imp-306/imp-357/imp-363). ───────
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

// ── Verbatim RK4 step (order 4). ─────────────────────────────────────────────
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

// ── Independent-family DP45 (Dormand-Prince 5(4)) fifth-order step. ───────────
const A = [
  [],
  [1 / 5],
  [3 / 40, 9 / 40],
  [44 / 45, -56 / 15, 32 / 9],
  [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
  [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
  [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84],
];
const B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];

function dp45Step(gammas, dt, direction) {
  const N = gammas.length;
  const k = [];
  for (let s = 0; s < 7; s++) {
    const y = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      let acc = gammas[i];
      for (let j = 0; j < s; j++) acc += dt * A[s][j] * k[j][i];
      y[i] = acc;
    }
    k.push(dysonDerivativesKahan(y, direction));
  }
  const result = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let acc = gammas[i];
    for (let s = 0; s < 7; s++) acc += dt * B5[s] * k[s][i];
    result[i] = acc;
  }
  return result;
}

function minSpacing(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { spacing: minS, index: minIdx };
}

// Backward collision; gate = min spacing < 1e-4 (IDENTICAL gate to imp-35324/35235).
function runCollision(initial, dt, maxSteps, stepper) {
  let gammas = Float64Array.from(initial);
  let prevSpacing = Infinity;
  for (let step = 0; step < maxSteps; step++) {
    const { spacing, index } = minSpacing(gammas);
    if (spacing < 1e-4) {
      return { t_c: step * dt, pair_index: index, steps: step, gapBeforeGate: prevSpacing };
    }
    prevSpacing = spacing;
    gammas = stepper(gammas, dt, -1);
  }
  return { t_c: null, pair_index: null, steps: maxSteps, gapBeforeGate: prevSpacing };
}

// ── N=2000 setup. ─────────────────────────────────────────────────────────────
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const T_C_HI = 1.2e-3; // imp-857 map upper bracket at N=2000 (unchanged)

console.log(`N=${N} tauC_est=${tauC_est} t_c_hi=${T_C_HI.toExponential(6)}`);

// Distinct resolutions: tauC/8000 (imp-35324 dt/2, recomputed), tauC/16000, tauC/32000.
const RESOLUTIONS = [8000, 16000, 32000];
const results = {};
for (const denom of RESOLUTIONS) {
  const dt = tauC_est / denom;
  const maxSteps = Math.ceil((1.35e-3 / dt)); // collision ~1.19e-3; generous headroom
  let t0 = Date.now();
  const rk4 = runCollision(initial, dt, maxSteps, rk4StepKahan);
  console.log(`res tauC/${denom}  dt=${dt.toExponential(6)}  RK4  t_c=${fmt(rk4.t_c)} step=${rk4.steps} pair=${rk4.pair_index} gapBeforeGate=${fmtE(rk4.gapBeforeGate)} (${sec(t0)}s)`);
  t0 = Date.now();
  const dp45 = runCollision(initial, dt, maxSteps, dp45Step);
  console.log(`res tauC/${denom}  dt=${dt.toExponential(6)}  DP45 t_c=${fmt(dp45.t_c)} step=${dp45.steps} pair=${dp45.pair_index} gapBeforeGate=${fmtE(dp45.gapBeforeGate)} (${sec(t0)}s)`);
  results[denom] = { dt, rk4, dp45 };
}

// ── Base-grid report: dt/2 cross-family gap and DP45 dt/2 slack vs resolution. ──
// Base tauC/4000  -> dt/2 at tauC/8000   (imp-35324 baseline: gap 7.576e-6)
// Base tauC/8000  -> dt/2 at tauC/16000  (NEW)
// Base tauC/16000 -> dt/2 at tauC/32000  (NEW)
console.log('\n── dt/2 cross-family gap and DP45 dt/2 slack vs base-grid resolution ──');
const baseGrids = [
  { base: 4000, half: 8000 },
  { base: 8000, half: 16000 },
  { base: 16000, half: 32000 },
];
for (const g of baseGrids) {
  const r = results[g.half];
  if (!r) { console.log(`base tauC/${g.base}: dt/2 res tauC/${g.half} not computed here`); continue; }
  const gap = Math.abs(r.dp45.t_c - r.rk4.t_c);
  const dp45Slack = T_C_HI - r.dp45.t_c;
  const rk4Slack = T_C_HI - r.rk4.t_c;
  console.log(`base tauC/${g.base}  dt/2 res tauC/${g.half}: |dp45-rk4|(dt/2)=${gap.toExponential(4)}  DP45 dt/2 slack=${dp45Slack.toExponential(6)}  RK4 dt/2 slack=${rk4Slack.toExponential(6)}`);
}

function fmt(x) { return x === null ? 'null' : x.toExponential(10); }
function fmtE(x) { return (x === null || !isFinite(x)) ? String(x) : x.toExponential(3); }
function sec(t) { return ((Date.now() - t) / 1000).toFixed(1); }
