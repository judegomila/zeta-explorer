// imp-35324 — re-run the imp-35235 R2 N=2000 order-robust backward-Dyson flow
// test on a FINER BASE GRID (dt = tauC_est/4000, four times the imp-35235
// tauC_est/1000 resolution) with the SAME (0, 1e-4) min-spacing collision gate,
// and measure whether the finer base grid restores the order-4 (RK4) vs order-5
// (DP45) cross-grid agreement that FAILED at N=2000 on the tauC/1000 grid.
//
// WHY THIS TEST
// imp-35235 reproduced the imp-35221 R2 order-robust flow method at N=2000 on
// dt = tauC_est/1000 = 1.188352e-6 and found three of four references (RK4 dt,
// RK4 dt/2, DP45 dt) cleanly clear the imp-857 map bracket t_c_hi = 1.2e-3, but
// the fourth (DP45 dt/2) suffered a GATE-SKIP: the pair-1495 gap collapsed so
// fast (5.63e-3 -> 1.78e-3 in one dt/2 step) that the order-5 stages stepped the
// two zeros THROUGH each other and the min gap jumped 1.775e-3 -> 3.23e-2 WITHOUT
// landing in the (0, 1e-4) gate, so DP45 continued to a spurious re-approach at
// t_c = 1.3238e-3 > t_c_hi. imp-35235 attributed this EXPLICITLY to the tauC/1000
// grid being "too coarse for the order-5 stages" at the faster N=2000 approach.
// A FINER BASE grid tests that diagnosis directly (distinct lever from imp-35278,
// which keeps the grid and changes the event definition to an interpolated cross).
//
// MEASUREMENT/CERTIFICATION ONLY. Removes no conditional; C_mb stays
// GUE-conditional per imp-486; changes NO bound; NO QED. Result baked as a light
// literal into src/data/imp-35324-r2-n2000-finer-grid-reference.js (no heavy
// import in the build).
//
// Run: node scripts/imp-35324-n2000-finer-grid-flow.mjs

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

// Backward collision under a supplied stepper; gate = min spacing < 1e-4
// (IDENTICAL gate to imp-35235). Also records the min gap on the step BEFORE the
// gate trips, so a step-over (gap jumping the band) can be diagnosed.
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

// ── N=2000 setup; FINER base grid dt = tauC_est/4000 (4x imp-35235). ──────────
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 4000;           // 2.97088e-7 — FOUR TIMES finer than imp-35235
const maxStepsFlow = 8000;                // collision expected ~4x imp-35235 step 1004 -> ~4016
const maxStepsHalf = 16000;               // dt/2 refinement (tauC/8000)

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)} (tauC/4000, 4x imp-35235)`);

let t0 = Date.now();
const rk4 = runCollision(initial, dtFlow, maxStepsFlow, rk4StepKahan);
console.log(`RK4  (order4) t_c=${fmt(rk4.t_c)} steps=${rk4.steps} pair=${rk4.pair_index} gapBeforeGate=${fmtE(rk4.gapBeforeGate)} (${sec(t0)}s)`);

t0 = Date.now();
const dp45 = runCollision(initial, dtFlow, maxStepsFlow, dp45Step);
console.log(`DP45 (order5) t_c=${fmt(dp45.t_c)} steps=${dp45.steps} pair=${dp45.pair_index} gapBeforeGate=${fmtE(dp45.gapBeforeGate)} (${sec(t0)}s)`);

t0 = Date.now();
const rk4Half = runCollision(initial, dtFlow / 2, maxStepsHalf, rk4StepKahan);
console.log(`RK4  dt/2     t_c=${fmt(rk4Half.t_c)} steps=${rk4Half.steps} pair=${rk4Half.pair_index} gapBeforeGate=${fmtE(rk4Half.gapBeforeGate)} (${sec(t0)}s)`);

t0 = Date.now();
const dp45Half = runCollision(initial, dtFlow / 2, maxStepsHalf, dp45Step);
console.log(`DP45 dt/2     t_c=${fmt(dp45Half.t_c)} steps=${dp45Half.steps} pair=${dp45Half.pair_index} gapBeforeGate=${fmtE(dp45Half.gapBeforeGate)} (${sec(t0)}s)`);

// ── MAP bracket at N=2000: fixed dt=1e-4 RK4 (imp-857 baseline grid). ─────────
const dtMap = 1e-4;
t0 = Date.now();
const map = runCollision(initial, dtMap, 400, rk4StepKahan);
const t_c_hi = map.steps * dtMap;
const t_c_lo = (map.steps - 1) * dtMap;
console.log(`MAP  dt=1e-4  collisionStep=${map.steps} bracket=[${t_c_lo.toExponential(6)}, ${t_c_hi.toExponential(6)}] pair=${map.pair_index} (${sec(t0)}s)`);

// ── Order-robustness + R2 verdict on the FINER grid. ──────────────────────────
const flowVals = [rk4.t_c, dp45.t_c, rk4Half.t_c, dp45Half.t_c];
const orderGap = Math.abs(dp45.t_c - rk4.t_c);
const halfOrderGap = Math.abs(dp45Half.t_c - rk4Half.t_c);
const dp45SelfConv = Math.abs(dp45.t_c - dp45Half.t_c);
const envMin = Math.min(...flowVals);
const envMax = Math.max(...flowVals);
const r2Met = envMax <= t_c_hi;
const r2Slack = t_c_hi - envMax;

console.log('\n── R2 one-sided true-flow test at N=2000 on FINER grid (tauC/4000) ──');
console.log(`order4-vs-order5 gap  dt    |dp45-rk4|      = ${orderGap.toExponential(3)}`);
console.log(`order4-vs-order5 gap  dt/2  |dp45h-rk4h|    = ${halfOrderGap.toExponential(3)}`);
console.log(`DP45 dt-vs-dt/2 self-conv                   = ${dp45SelfConv.toExponential(3)}`);
console.log(`flow envelope [min,max]                     = [${fmt(envMin)}, ${fmt(envMax)}]`);
console.log(`t_c_hi   (map upper bracket)                = ${t_c_hi.toExponential(10)}`);
console.log(`R2 predicate envMax <= t_c_hi               = ${r2Met}   slack=${r2Slack.toExponential(6)}`);

function fmt(x) { return x === null ? 'null' : x.toExponential(10); }
function fmtE(x) { return (x === null || !isFinite(x)) ? String(x) : x.toExponential(3); }
function sec(t) { return ((Date.now() - t) / 1000).toFixed(1); }
