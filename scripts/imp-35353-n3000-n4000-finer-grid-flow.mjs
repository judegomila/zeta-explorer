// imp-35353 — extend the imp-35324 finer-base-grid (dt = tauC_est/4000) R2
// order-robust backward-Dyson flow test from N=2000 to N=3000 and N=4000, and
// MEASURE whether all four references (RK4/DP45 x dt,dt/2) still land in the
// (0, 1e-4) min-spacing collision gate and clear the imp-857 map bracket
// t_c_hi(N), or whether the imp-35235 DP45 dt/2 gate-skip / marginal-clearance
// regime recurs at higher N on the tauC/4000 grid.
//
// WHY THIS TEST
// The R2 order-robust flow ladder is robustly certified only through N=1000
// (imp-35221). imp-35235 found a DP45 dt/2 gate-skip at N=2000 on the tauC/1000
// grid; imp-35324 resolved it on a finer tauC/4000 base grid but only to a
// razor-thin +6.16e-8 clearance. This ticket asks the next question: does the
// finer-grid four-of-four clearing envelope PERSIST at N=3000 and N=4000, or
// does the faster higher-N approach re-introduce the order-5 dt/2 step-over even
// on the tauC/4000 grid? Note the tauC/4000 grid is SELF-SCALING with tauC, so
// the grid-resolution vs collision-speed ratio is N-invariant by construction --
// this test measures whether that invariance actually holds in the near-gate
// order-5 sampling.
//
// SELF-CONTAINED tauC: EMPIRICAL_M_SWEEP_EXTENDED has no N=3000/N=4000 sample,
// so tauC_est(N) is recomputed here directly from the zeros as minGap^2/8 (the
// imp-2563 leading-order collapse horizon g0^2/8), the SAME formula the imp-2509
// sweep uses (tauC_est = H_raw^2 / 8). Verified against the N=2000 sample.
//
// MEASUREMENT/CERTIFICATION ONLY. Removes no conditional; C_mb stays
// GUE-conditional per imp-486; the R2 ladder stays at N=1000 regardless; changes
// NO bound; NO QED.
//
// Run: node scripts/imp-35353-n3000-n4000-finer-grid-flow.mjs 3000
//      node scripts/imp-35353-n3000-n4000-finer-grid-flow.mjs 4000

const { ZEROS_EXTENDED } = await import('../src/data/zeros-to-1e6.js');

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
// (IDENTICAL gate to imp-35235/imp-35324). Records the min gap on the step
// BEFORE the gate trips so a step-over (gap jumping the band) is diagnosable.
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

// ── Setup: N from argv; FINER base grid dt = tauC_est/4000 (imp-35324 lever). ──
const N = Number(process.argv[2] || 3000);
const initial = ZEROS_EXTENDED.slice(0, N);

// tauC_est = minGap^2 / 8 recomputed directly from the first N zeros (the
// imp-2509 sweep formula; EMPIRICAL_M_SWEEP_EXTENDED has no N=3000/4000 sample).
let minGap = Infinity, minGapIdx = -1;
for (let i = 0; i < N - 1; i++) {
  const g = initial[i + 1] - initial[i];
  if (g < minGap) { minGap = g; minGapIdx = i; }
}
const tauC_est = (minGap * minGap) / 8;
const dtFlow = tauC_est / 4000;           // tauC/4000 finer base grid (imp-35324)
const maxStepsFlow = 8000;                // collision ~ step 4014 (dt) with margin
const maxStepsHalf = 12000;               // dt/2 refinement (tauC/8000); covers past t_c_hi even on a skip

console.log(`N=${N} minGap=${minGap.toExponential(6)} minGapIdx=${minGapIdx} tauC_est=${tauC_est.toExponential(9)} dtFlow=${dtFlow.toExponential(6)} (tauC/4000)`);

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

// ── MAP bracket at N: fixed dt=1e-4 RK4 (imp-857 baseline grid). ──────────────
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

console.log(`\n── R2 one-sided true-flow test at N=${N} on FINER grid (tauC/4000) ──`);
console.log(`order4-vs-order5 gap  dt    |dp45-rk4|      = ${orderGap.toExponential(3)}`);
console.log(`order4-vs-order5 gap  dt/2  |dp45h-rk4h|    = ${halfOrderGap.toExponential(3)}`);
console.log(`DP45 dt-vs-dt/2 self-conv                   = ${dp45SelfConv.toExponential(3)}`);
console.log(`flow envelope [min,max]                     = [${fmt(envMin)}, ${fmt(envMax)}]`);
console.log(`t_c_hi   (map upper bracket)                = ${t_c_hi.toExponential(10)}`);
console.log(`R2 predicate envMax <= t_c_hi               = ${r2Met}   slack=${r2Slack.toExponential(6)}`);
console.log(`gateSkip(DP45 dt/2)? t_c==null -> ${dp45Half.t_c === null}`);

function fmt(x) { return x === null ? 'null' : x.toExponential(10); }
function fmtE(x) { return (x === null || !isFinite(x)) ? String(x) : x.toExponential(3); }
function sec(t) { return ((Date.now() - t) / 1000).toFixed(1); }
