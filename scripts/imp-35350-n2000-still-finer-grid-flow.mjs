// imp-35350 — re-run the imp-35324 R2 N=2000 finer-grid backward-Dyson flow test
// on STILL-finer base grids (dt = tauC_est/8000 and tauC_est/16000, i.e. 2x and
// 4x the imp-35324 tauC/4000 grid) and MEASURE whether the DP45-vs-RK4 dt/2
// cross-family gap (7.576e-6 on the tauC/4000 grid) collapses toward the
// full-precision tie seen at N<=1000, driving the clearance off the imp-35324
// razor-thin +6.16e-8 knife-edge below t_c_hi=1.2e-3.
//
// imp-35324 restored a four-of-four clearing envelope at N=2000 on dt=tauC/4000
// but the DP45 dt/2 reference sat only 6.156800e-8 below t_c_hi and the dt/2
// cross-family gap |dp45(dt/2)-rk4(dt/2)| = 7.576e-6 was NONZERO (at N<=1000 both
// dt/2 families landed on the identical t_c). Its named sub-gap
// imp-35324-sub-n2000-marginal-clearance asks for a STILL-finer grid to test
// whether the order-5 dt/2 sensitivity is a residual resolution artifact.
//
// The two base grids share resolutions: base grid A (dt=tauC/8000) has
// dt/2=tauC/16000; base grid B (dt=tauC/16000) has dt/2=tauC/32000. So we compute
// each of the three DISTINCT resolutions {tauC/8000, tauC/16000, tauC/32000} once,
// under both RK4 (order 4) and independent-family DP45 (order 5), and reconstruct
// the two base-grid dt/2 cross-family gaps from them.
//
// MEASUREMENT ONLY. Does NOT advance the R2 ladder past N=1000; changes NO bound;
// C_mb stays GUE-conditional per imp-486; NO QED. Result baked as a light literal
// into src/data/imp-35350-r2-n2000-still-finer-grid-reference.js.
//
// Run: node scripts/imp-35350-n2000-still-finer-grid-flow.mjs

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
// (IDENTICAL gate to imp-35324/imp-35235). Records the min gap on the step BEFORE
// the gate trips so a step-over (gap jumping the band) can be diagnosed.
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

// Still-finer resolutions (imp-35324 used tauC/4000, whose dt/2 = tauC/8000).
// POOL-BOUNDED honest-partial run: the tauC/8000 (reproduction) and tauC/16000
// (first genuinely-finer) rungs run to completion (~18 min single-core); the
// tauC/32000 rung (~24 min alone) is DEFERRED as sub-gap
// imp-35350-sub-tauC32000-rung to avoid starving bound-advancing pool workers on
// a diagnostic that changes NO bound. See src/data reference file for the split.
const RESOLUTIONS = [
  { label: 'tauC/8000', div: 8000, maxSteps: 13000 },
  { label: 'tauC/16000', div: 16000, maxSteps: 26000 },
];

console.log(`N=${N} tauC_est=${tauC_est}`);
const results = {};
for (const R of RESOLUTIONS) {
  const dt = tauC_est / R.div;
  let t0 = Date.now();
  const rk4 = runCollision(initial, dt, R.maxSteps, rk4StepKahan);
  console.log(`[${R.label}] RK4  t_c=${fmt(rk4.t_c)} steps=${rk4.steps} pair=${rk4.pair_index} gapBeforeGate=${fmtE(rk4.gapBeforeGate)} (${sec(t0)}s)`);
  t0 = Date.now();
  const dp45 = runCollision(initial, dt, R.maxSteps, dp45Step);
  console.log(`[${R.label}] DP45 t_c=${fmt(dp45.t_c)} steps=${dp45.steps} pair=${dp45.pair_index} gapBeforeGate=${fmtE(dp45.gapBeforeGate)} (${sec(t0)}s)`);
  results[R.div] = { dt, rk4, dp45 };
}

// ── Reconstruct the two still-finer base-grid dt/2 cross-family gaps. ──────────
// Base grid A: dt=tauC/8000  -> dt/2 = tauC/16000
// Base grid B: dt=tauC/16000 -> dt/2 = tauC/32000
const t_c_hi = 1.2e-3; // imp-857 map bracket upper endpoint (unchanged; pair 1495)
function baseGridReport(name, dtDiv, halfDiv) {
  const dtRun = results[dtDiv];
  const halfRun = results[halfDiv];
  if (!dtRun || !halfRun) {
    console.log(`\n── base grid ${name} (dt=tauC/${dtDiv}, dt/2=tauC/${halfDiv}) — DEFERRED (rung not run) ──`);
    return { name, dtDiv, halfDiv, deferred: true };
  }
  const gapDt = Math.abs(dtRun.dp45.t_c - dtRun.rk4.t_c);
  const gapHalf = Math.abs(halfRun.dp45.t_c - halfRun.rk4.t_c);
  const dp45HalfSlack = t_c_hi - halfRun.dp45.t_c;
  console.log(`\n── base grid ${name} (dt=tauC/${dtDiv}, dt/2=tauC/${halfDiv}) ──`);
  console.log(`  dt   cross-family gap |dp45-rk4|      = ${fmtE(gapDt)}`);
  console.log(`  dt/2 cross-family gap |dp45h-rk4h|    = ${fmtE(gapHalf)}`);
  console.log(`  DP45 dt/2 slack below t_c_hi(1.2e-3)  = ${fmtE(dp45HalfSlack)}`);
  return { name, dtDiv, halfDiv, gapDt, gapHalf, dp45HalfSlack,
    rk4Half_t_c: halfRun.rk4.t_c, dp45Half_t_c: halfRun.dp45.t_c };
}
const gridA = baseGridReport('A', 8000, 16000);
const gridB = baseGridReport('B', 16000, 32000);

console.log('\n── grid-resolution trend of the dt/2 cross-family gap ──');
console.log(`  tauC/4000 (imp-35324): dt/2 gap = 7.576e-6`);
console.log(`  tauC/8000  base grid A: dt/2 gap = ${fmtE(gridA.gapHalf)}`);
console.log(`  tauC/16000 base grid B: dt/2 gap = ${gridB.deferred ? 'DEFERRED (tauC/32000 rung, sub-gap)' : fmtE(gridB.gapHalf)}`);

console.log('\nRESULT_JSON ' + JSON.stringify({
  tauC_est,
  resolutions: Object.fromEntries(Object.entries(results).map(([div, r]) => [div, {
    dt: r.dt,
    rk4: r.rk4, dp45: r.dp45,
  }])),
  gridA, gridB,
}));

function fmt(x) { return x === null ? 'null' : x.toExponential(10); }
function fmtE(x) { return (x === null || !isFinite(x)) ? String(x) : x.toExponential(3); }
function sec(t) { return ((Date.now() - t) / 1000).toFixed(1); }
