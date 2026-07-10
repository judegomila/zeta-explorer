// imp-35278 — gate-free (signed-crossing interpolated) collision event for the
// imp-35235 R2 N=2000 order-robust backward-Dyson flow test.
//
// imp-35235 left R2 at N=2000 PARTIAL: three of four references (RK4 dt, DP45 dt,
// RK4 dt/2) put the true-flow collision at t_c ~ 1.192-1.193e-3, strictly below
// the imp-857 fixed-dt map upper bracket t_c_hi = 1.2e-3, but the fourth
// reference -- the independent-family DP45 at dt/2 -- GATE-SKIPPED: at N=2000 the
// pair-1495 gap collapses fast and the order-5 dt/2 stages step the two zeros
// THROUGH each other in a single step, so the sorted min spacing never lands in
// the (0, 1e-4) gate band; DP45 continued to a spurious re-approach event at
// t_c = 1.3238e-3 > t_c_hi, breaking the honest worst-case envelope.
//
// THIS SCRIPT reimplements the collision event GATE-FREE, exactly as the
// imp-35235 named sub-gap (imp-35235-sub-n2000-gate-skip) prescribed: instead of
// the (0, 1e-4) min-spacing gate, detect the first step where ANY adjacent SIGNED
// gap gamma[i+1]-gamma[i] crosses from positive to non-positive (the two zeros
// pass through each other), then LINEARLY INTERPOLATE the event time within that
// step from the signed gap at the two step endpoints -- a step-over cannot
// masquerade as a missed collision because a sign change is caught even if the
// gap never lands in a narrow band. Same N=2000, same dt = tauC_est/1000 grid,
// same RK4 (order 4) and DP45 (order 5) families at dt and dt/2. MEASUREMENT ONLY.
//
// Removes no conditional; C_mb stays GUE-conditional per imp-486; NO QED.
//
// Run: node scripts/imp-35278-n2000-gatefree-flow.mjs

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

// Min SIGNED adjacent gap (can go non-positive when a pair passes through). We do
// NOT re-sort during the flow: the array is initialised sorted and the ODE moves
// each zero by identity, so a genuine crossing shows as a sign change at that
// index rather than a re-sorted jump. Returns the min signed gap and its index.
function minSignedGap(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { gap: minS, index: minIdx };
}

// GATE-FREE collision: step until the min signed adjacent gap first becomes
// non-positive (a sign change = the tracked pair passes through). Interpolate the
// event time within that step linearly from the pre-step and post-step signed gap
// of the crossing index i: t_c = (step-1)*dt + dt * g_prev / (g_prev - g_curr).
function runCollisionGateFree(initial, dt, maxSteps, stepper) {
  let gammas = Float64Array.from(initial);
  let prev = minSignedGap(gammas);
  for (let step = 1; step <= maxSteps; step++) {
    const next = stepper(gammas, dt, -1);
    const i = prev.index;
    const gPrev = gammas[i + 1] - gammas[i];   // signed gap of the argmin index, pre-step
    const gCurr = next[i + 1] - next[i];        // same index, post-step
    if (gCurr <= 0 && gPrev > 0) {
      const frac = gPrev / (gPrev - gCurr);     // in (0,1]
      const t_c = (step - 1) * dt + frac * dt;
      return { t_c, cross_index: i, step, frac, g_prev: gPrev, g_curr: gCurr };
    }
    gammas = next;
    prev = minSignedGap(gammas);
  }
  return { t_c: null, cross_index: null, step: maxSteps, frac: null, g_prev: null, g_curr: null };
}

// ── N=2000 setup (matches imp-35235 / imp-2509 cache convention). ─────────────
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;           // 1.188352e-6 — resolved flow grid
const maxStepsFlow = 3000;

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)}`);

function report(label, r, dt) {
  if (r.t_c === null) { console.log(`${label}: NO CROSSING within ${r.step} steps`); return; }
  console.log(`${label}: t_c=${r.t_c.toExponential(10)} step=${r.step} idx=${r.cross_index} frac=${r.frac.toFixed(4)} g_prev=${r.g_prev.toExponential(3)} g_curr=${r.g_curr.toExponential(3)}`);
}

let t0 = Date.now();
const rk4 = runCollisionGateFree(initial, dtFlow, maxStepsFlow, rk4StepKahan);
report(`RK4  dt   (${((Date.now() - t0) / 1000).toFixed(1)}s)`, rk4, dtFlow);

t0 = Date.now();
const dp45 = runCollisionGateFree(initial, dtFlow, maxStepsFlow, dp45Step);
report(`DP45 dt   (${((Date.now() - t0) / 1000).toFixed(1)}s)`, dp45, dtFlow);

t0 = Date.now();
const rk4Half = runCollisionGateFree(initial, dtFlow / 2, 2 * maxStepsFlow, rk4StepKahan);
report(`RK4  dt/2 (${((Date.now() - t0) / 1000).toFixed(1)}s)`, rk4Half, dtFlow / 2);

t0 = Date.now();
const dp45Half = runCollisionGateFree(initial, dtFlow / 2, 2 * maxStepsFlow, dp45Step);
report(`DP45 dt/2 (${((Date.now() - t0) / 1000).toFixed(1)}s)`, dp45Half, dtFlow / 2);

// ── R2 verdict under the gate-free event. ─────────────────────────────────────
const T_C_HI = 1.2e-3;   // imp-857 fixed-dt=1e-4 map upper bracket at N=2000
const flowVals = [rk4.t_c, dp45.t_c, rk4Half.t_c, dp45Half.t_c].filter((v) => v !== null);
const envMin = Math.min(...flowVals);
const envMax = Math.max(...flowVals);
const orderGap = Math.abs(dp45.t_c - rk4.t_c);
const dp45SelfConv = Math.abs(dp45.t_c - dp45Half.t_c);

console.log('\n── R2 one-sided true-flow test at N=2000 (GATE-FREE signed-crossing event) ──');
console.log(`order4-vs-order5 gap |dp45-rk4| (dt)  = ${orderGap.toExponential(3)}`);
console.log(`DP45 dt-vs-dt/2 self-conv             = ${dp45SelfConv.toExponential(3)}`);
console.log(`flow envelope [min,max]               = [${envMin.toExponential(10)}, ${envMax.toExponential(10)}]`);
console.log(`t_c_hi (map upper bracket)            = ${T_C_HI.toExponential(10)}`);
console.log(`R2 predicate envMax <= t_c_hi         = ${envMax <= T_C_HI}   slack=${(T_C_HI - envMax).toExponential(6)}`);
