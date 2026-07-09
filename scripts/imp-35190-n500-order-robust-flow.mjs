// imp-35190 — order-robust backward-Dyson flow reference at N=500 and the
// R2 one-sided true-flow test t_c_flow(500) <= t_c_hi(500).
//
// imp-35150 found the imp-35104 R2 obligation MET at N in {50,100,200} but
// UNCERTIFIED at N>=500 purely because no ORDER-ROBUST flow reference exists
// there: only an RK4 (order-4) reference (t_c=0.012336, imp-2509 cache) and
// the imp-857 closable MAP bracket were available. This sidecar computes an
// INDEPENDENT-ORDER Dormand-Prince 5(4) (DP45) collision reference on the SAME
// grid and gate as the cached RK4, confirms the two agree (order-robust), and
// evaluates the fixed-dt=1e-4 MAP bracket upper endpoint t_c_hi(500) to test
// the imp-2528 one-sided bound t_c_flow <= t_c_hi at the first rung past N=200.
//
// MEASUREMENT/CERTIFICATION ONLY. Removes no conditional; C_mb stays
// GUE-conditional per imp-486; NO QED. Result baked as a light literal into
// src/data/imp-35190-r2-n500-flow-reference.js (no heavy import in the build).
//
// Run: node scripts/imp-35190-n500-order-robust-flow.mjs

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
// Different ORDER (5) and different Butcher tableau than RK4 (order 4). A shared
// discretization bug cannot survive an order-5 vs order-4 agreement.
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
// (the SAME gate as the in-build N in {50,100,200} rows and the imp-2509 cache).
function runCollision(initial, dt, maxSteps, stepper) {
  let gammas = Float64Array.from(initial);
  for (let step = 0; step < maxSteps; step++) {
    const { spacing, index } = minSpacing(gammas);
    if (spacing < 1e-4) return { t_c: step * dt, pair_index: index, steps: step };
    gammas = stepper(gammas, dt, -1);
  }
  return { t_c: null, pair_index: null, steps: maxSteps };
}

// ── N=500 setup (matches imp-2509 cache: dt = tauC_est/100). ──────────────────
const N = 500;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;           // 1.2047e-5 — the imp-2509 RESOLVED cache grid
const maxStepsFlow = 1389;                // imp-2509 cache maxSteps at N=500 (collision ~1024)

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)}`);

let t0 = Date.now();
const rk4 = runCollision(initial, dtFlow, maxStepsFlow, rk4StepKahan);
console.log(`RK4  (order4) t_c=${rk4.t_c.toExponential(10)} steps=${rk4.steps} pair=${rk4.pair_index} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);

t0 = Date.now();
const dp45 = runCollision(initial, dtFlow, maxStepsFlow, dp45Step);
console.log(`DP45 (order5) t_c=${dp45.t_c.toExponential(10)} steps=${dp45.steps} pair=${dp45.pair_index} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);

// dt/2 DP45 convergence probe (order-robustness of the DP45 reference itself).
t0 = Date.now();
const dp45Half = runCollision(initial, dtFlow / 2, 2 * maxStepsFlow, dp45Step);
console.log(`DP45 dt/2     t_c=${dp45Half.t_c.toExponential(10)} steps=${dp45Half.steps} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);

// ── MAP bracket at N=500: fixed dt=1e-4 RK4 (matches imp-857 baseline grid). ──
// t_c_hi = collision-step * dt (upper bracket endpoint); t_c_lo = previous step.
const dtMap = 1e-4;
t0 = Date.now();
const map = runCollision(initial, dtMap, 400, rk4StepKahan);
const t_c_hi = map.steps * dtMap;         // upper bracket endpoint
const t_c_lo = (map.steps - 1) * dtMap;   // last certified-positive step
console.log(`MAP  dt=1e-4  collisionStep=${map.steps} bracket=[${t_c_lo.toExponential(6)}, ${t_c_hi.toExponential(6)}] (${((Date.now() - t0) / 1000).toFixed(1)}s)`);

// ── Order-robustness + R2 verdict. ────────────────────────────────────────────
const orderGap = Math.abs(dp45.t_c - rk4.t_c);
const dp45SelfConv = Math.abs(dp45.t_c - dp45Half.t_c);
const t_c_flow = dp45.t_c;                // best-order reference
const r2Met = t_c_flow <= t_c_hi;
const r2Slack = t_c_hi - t_c_flow;

console.log('\n── R2 one-sided true-flow test at N=500 ──');
console.log(`order4-vs-order5 gap |dp45-rk4| = ${orderGap.toExponential(3)}`);
console.log(`DP45 dt-vs-dt/2 self-conv       = ${dp45SelfConv.toExponential(3)}`);
console.log(`t_c_flow (DP45 order-robust)    = ${t_c_flow.toExponential(10)}`);
console.log(`t_c_hi   (map upper bracket)    = ${t_c_hi.toExponential(10)}`);
console.log(`R2 predicate t_c_flow <= t_c_hi = ${r2Met}   slack=${r2Slack.toExponential(6)}`);
