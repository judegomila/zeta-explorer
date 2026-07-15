// imp-35352 — diagnose WHY the imp-35324 DP45 dt/2 pre-gate min neighbour
// spacing (9.841e-4) is anomalously LARGER than the other three N=2000
// references (~8.787-8.805e-4) on the tauC/4000 finer base grid.
//
// WHY THIS TEST
// imp-35324 re-ran the imp-35235 R2 N=2000 order-robust backward-Dyson flow test
// on a FINER base grid (dt = tauC_est/4000) and found the DP45 dt/2 gate-skip
// RESOLVED, but the DP45 dt/2 reference reported gapBeforeGate = 9.841e-4 while
// the other three references (RK4 dt, DP45 dt, RK4 dt/2) shared ~8.79e-4.
// imp-35324 flagged this as the residual signature of the order-5 dt/2 stages
// sampling the singular 2/diff approach differently near the collision, but never
// characterized it. This producer INSTRUMENTS the imp-35324 flow to record the
// full pre-collision pair-1495 gap trajectory for each of the four references and
// MEASURES at which step and by how much the DP45 dt/2 gap trajectory diverges
// from the RK4 dt/2 gap trajectory -- distinguishing a mere stage-ordering /
// last-step sampling effect (divergence appears ONLY in the final step or two
// before the gate) from a genuine accumulated trajectory divergence (divergence
// grows steadily over many steps).
//
// MEASUREMENT/CERTIFICATION ONLY. Removes no conditional; C_mb stays
// GUE-conditional per imp-486; changes NO bound; NO QED. Result baked as a light
// literal into src/data/imp-35352-dp45-dthalf-gap-divergence-reference.js.
//
// Run: node scripts/imp-35352-dp45-dthalf-gap-divergence.mjs

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
// (IDENTICAL gate to imp-35324/imp-35235). Records the FULL pre-collision
// trajectory of both the global min spacing AND the pair-1495 gap (the colliding
// pair), so the DP45 dt/2 vs RK4 dt/2 gap divergence can be measured step by step.
function runCollisionTraj(initial, dt, maxSteps, stepper, pairIdx) {
  let gammas = Float64Array.from(initial);
  const minGapTraj = [];
  const pairGapTraj = [];
  for (let step = 0; step < maxSteps; step++) {
    const { spacing, index } = minSpacing(gammas);
    const pairGap = gammas[pairIdx + 1] - gammas[pairIdx];
    minGapTraj.push(spacing);
    pairGapTraj.push(pairGap);
    if (spacing < 1e-4) {
      return { t_c: step * dt, pair_index: index, steps: step, minGapTraj, pairGapTraj };
    }
    gammas = stepper(gammas, dt, -1);
  }
  return { t_c: null, pair_index: null, steps: maxSteps, minGapTraj, pairGapTraj };
}

// ── N=2000 setup; FINER base grid dt = tauC_est/4000 (imp-35324). ─────────────
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 4000;           // 2.970880e-7 (imp-35324 finer grid)
const PAIR = 1495;                         // the colliding pair (imp-35235/imp-35324)
const maxStepsFlow = 8000;
const maxStepsHalf = 16000;

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)} PAIR=${PAIR}`);

let t0 = Date.now();
const rk4 = runCollisionTraj(initial, dtFlow, maxStepsFlow, rk4StepKahan, PAIR);
console.log(`RK4  dt    t_c=${fmt(rk4.t_c)} steps=${rk4.steps} pair=${rk4.pair_index} preGate=${fmtE(rk4.minGapTraj[rk4.steps - 1])} (${sec(t0)}s)`);

t0 = Date.now();
const dp45 = runCollisionTraj(initial, dtFlow, maxStepsFlow, dp45Step, PAIR);
console.log(`DP45 dt    t_c=${fmt(dp45.t_c)} steps=${dp45.steps} pair=${dp45.pair_index} preGate=${fmtE(dp45.minGapTraj[dp45.steps - 1])} (${sec(t0)}s)`);

t0 = Date.now();
const rk4Half = runCollisionTraj(initial, dtFlow / 2, maxStepsHalf, rk4StepKahan, PAIR);
console.log(`RK4  dt/2  t_c=${fmt(rk4Half.t_c)} steps=${rk4Half.steps} pair=${rk4Half.pair_index} preGate=${fmtE(rk4Half.minGapTraj[rk4Half.steps - 1])} (${sec(t0)}s)`);

t0 = Date.now();
const dp45Half = runCollisionTraj(initial, dtFlow / 2, maxStepsHalf, dp45Step, PAIR);
console.log(`DP45 dt/2  t_c=${fmt(dp45Half.t_c)} steps=${dp45Half.steps} pair=${dp45Half.pair_index} preGate=${fmtE(dp45Half.minGapTraj[dp45Half.steps - 1])} (${sec(t0)}s)`);

// ── DP45 dt/2 vs RK4 dt/2 pair-1495 gap divergence, step by step. ─────────────
// Both dt/2 references share dt/2 = tauC/8000 and the same initial condition, so
// at each common step index the pair-1495 gaps are directly comparable. Measure
// (a) the first step at which |gap_dp45 - gap_rk4| exceeds thresholds and (b) the
// max absolute + max relative divergence over the common (pre-RK4-gate) range.
const common = Math.min(rk4Half.pairGapTraj.length, dp45Half.pairGapTraj.length);
let firstAbs1e6 = -1, firstAbs1e5 = -1, firstRel1e3 = -1;
let maxAbs = 0, maxAbsStep = -1, maxRel = 0, maxRelStep = -1;
for (let s = 0; s < common; s++) {
  const gr = rk4Half.pairGapTraj[s];
  const gd = dp45Half.pairGapTraj[s];
  const abs = Math.abs(gd - gr);
  const rel = abs / Math.abs(gr);
  if (firstAbs1e6 < 0 && abs > 1e-6) firstAbs1e6 = s;
  if (firstAbs1e5 < 0 && abs > 1e-5) firstAbs1e5 = s;
  if (firstRel1e3 < 0 && rel > 1e-3) firstRel1e3 = s;
  if (abs > maxAbs) { maxAbs = abs; maxAbsStep = s; }
  if (rel > maxRel) { maxRel = rel; maxRelStep = s; }
}

console.log('\n── DP45 dt/2 vs RK4 dt/2 pair-1495 gap divergence ──');
console.log(`common comparable steps                    = ${common}`);
console.log(`first step |dp45-rk4| > 1e-6               = ${firstAbs1e6}`);
console.log(`first step |dp45-rk4| > 1e-5               = ${firstAbs1e5}`);
console.log(`first step rel > 1e-3                      = ${firstRel1e3}`);
console.log(`max abs divergence                         = ${maxAbs.toExponential(6)} at step ${maxAbsStep}`);
console.log(`max rel divergence                         = ${maxRel.toExponential(6)} at step ${maxRelStep}`);

// Tail dump: the last few steps before each dt/2 gate, to show whether the
// anomaly is concentrated in the final approach.
console.log('\n── RK4 dt/2 tail (last 6 steps: minGap, pairGap) ──');
for (let s = Math.max(0, rk4Half.steps - 5); s <= rk4Half.steps; s++) {
  console.log(`  step ${s}: minGap=${fmtE(rk4Half.minGapTraj[s])} pairGap=${fmtE(rk4Half.pairGapTraj[s])}`);
}
console.log('── DP45 dt/2 tail (last 6 steps: minGap, pairGap) ──');
for (let s = Math.max(0, dp45Half.steps - 5); s <= dp45Half.steps; s++) {
  console.log(`  step ${s}: minGap=${fmtE(dp45Half.minGapTraj[s])} pairGap=${fmtE(dp45Half.pairGapTraj[s])}`);
}
// Compare the two dt/2 references at the RK4 gate step (RK4 collides FIRST).
const gateStep = rk4Half.steps;
console.log(`\nAt RK4 gate step ${gateStep}: RK4 minGap=${fmtE(rk4Half.minGapTraj[gateStep])} DP45 minGap=${fmtE(dp45Half.minGapTraj[gateStep])}`);
console.log(`At RK4 gate step ${gateStep}: RK4 pairGap=${fmtE(rk4Half.pairGapTraj[gateStep])} DP45 pairGap=${fmtE(dp45Half.pairGapTraj[gateStep])}`);

function fmt(x) { return x === null ? 'null' : x.toExponential(10); }
function fmtE(x) { return (x === null || x === undefined || !isFinite(x)) ? String(x) : x.toExponential(6); }
function sec(t) { return ((Date.now() - t) / 1000).toFixed(1); }
