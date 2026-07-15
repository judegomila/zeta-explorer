// imp-35351 -- TRUE DP45 dense-output (continuous-extension) collision event for
// the imp-35278 R2 N=2000 within-step step-over.
//
// imp-35278 replaced the imp-35235 (0, 1e-4) min-spacing gate with an ENDPOINT
// signed-crossing plus LINEAR within-step interpolation and found the DP45 dt/2
// reference STILL fails identically (spurious re-approach at ~1.3235e-3), because
// pair-1495 steps THROUGH and re-separates WITHIN a single dt/2 step, so the
// signed gap is positive at BOTH step endpoints and no endpoint event can see it.
// The imp-35278 refined sub-gap (imp-35278-sub-within-step-stepover) named remedy
// (b): a GENUINE DP45 dense-output interpolant sampled at sub-step INTERIOR nodes,
// distinct from the imp-35278 endpoint linear interpolation.
//
// THIS SCRIPT builds the classic Dormand-Prince 5(4) continuous extension (the
// Hairer/Wanner CONTD5 4th-order interpolant, exact rational D-coefficients) from
// the SAME seven stages the DP45 step already evaluates (k7 is the FSAL stage at
// the step endpoint). At each step it forms the per-component interpolation
// polynomial y(theta), theta in (0,1), and samples the SIGNED adjacent gap
// gamma[i+1]-gamma[i] at the tracked argmin index at INTERIOR nodes. The first
// step whose interior sample dips non-positive is a genuine WITHIN-STEP crossing;
// the sub-step crossing time is then bracketed on the dense node grid and refined.
// Same N=2000, same dt = tauC_est/1000 grid, same RK4 (order 4) and DP45 (order 5)
// families at dt and dt/2. MEASUREMENT ONLY.
//
// Removes no conditional; C_mb stays GUE-conditional per imp-486; NO QED.
//
// Run: node scripts/imp-35351-n2000-dense-output-flow.mjs

const { ZEROS_EXTENDED } = await import('../src/data/zeros-to-1e6.js');
const { EMPIRICAL_M_SWEEP_EXTENDED } = await import('../src/data/empirical-m-sweep-extended.js');

// -- Verbatim Kahan-Neumaier Dyson derivative (imp-306/imp-357/imp-363). --------
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

// -- Verbatim RK4 step (order 4). -----------------------------------------------
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

// -- Independent-family DP45 (Dormand-Prince 5(4)) fifth-order step. -------------
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

// Returns { result, k } so callers can reuse the seven stages for dense output.
function dp45StepStages(gammas, dt, direction) {
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
  return { result, k };
}
function dp45Step(gammas, dt, direction) {
  return dp45StepStages(gammas, dt, direction).result;
}

// -- DP45 (DOPRI5) 4th-order CONTINUOUS EXTENSION (Hairer/Wanner CONTD5). --------
// Exact rational interpolation D-coefficients. Given a step from y0 to y1 over dt
// with the seven stages k[0..6] (k1..k7, k7 the FSAL endpoint stage), builds five
// per-component rcont polynomials so that for theta in [0,1]:
//   s = theta, s1 = 1 - s
//   y(theta) = r1 + s*(r2 + s1*(r3 + s*(r4 + s1*r5)))
const D1 = -12715105075 / 11282082432;
const D3 = 87487479700 / 32700410799;
const D4 = -10690763975 / 1880347072;
const D5 = 701980252875 / 199316789632;
const D6 = -1453857185 / 822651844;
const D7 = 69997945 / 29380423;

function denseCoeffsIndex(i, y0, y1, k, dt) {
  // Per-COMPONENT (single index i) dense-output coefficients.
  const k1 = k[0][i], k3 = k[2][i], k4 = k[3][i], k5 = k[4][i], k6 = k[5][i], k7 = k[6][i];
  const r1 = y0[i];
  const ydiff = y1[i] - y0[i];
  const bspl = dt * k1 - ydiff;
  const r2 = ydiff;
  const r3 = bspl;
  const r4 = ydiff - dt * k7 - bspl;
  const r5 = dt * (D1 * k1 + D3 * k3 + D4 * k4 + D5 * k5 + D6 * k6 + D7 * k7);
  return { r1, r2, r3, r4, r5 };
}
function denseEval(c, s) {
  const s1 = 1 - s;
  return c.r1 + s * (c.r2 + s1 * (c.r3 + s * (c.r4 + s1 * c.r5)));
}

function minSignedGap(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { gap: minS, index: minIdx };
}

// GATE-FREE + DENSE-OUTPUT collision: at each step, track the argmin signed-gap
// index i from the step start, then sample the DP45 continuous extension of the
// signed gap g(theta) = y(i+1;theta) - y(i;theta) at DENSE_NODES interior nodes.
// The first step with any interior sample <= 0 is a genuine within-step crossing;
// refine the sub-step crossing time by linear interpolation on the bracketing
// dense-node pair. If no interior dip, fall back to the endpoint sign change
// (identical to imp-35278) so the two methods coincide on clean references.
function runCollisionDense(initial, dt, maxSteps, denseNodes) {
  let gammas = Float64Array.from(initial);
  let prev = minSignedGap(gammas);
  for (let step = 1; step <= maxSteps; step++) {
    const { result: next, k } = dp45StepStages(gammas, dt, -1);
    const i = prev.index;
    const cLo = denseCoeffsIndex(i, gammas, next, k, dt);
    const cHi = denseCoeffsIndex(i + 1, gammas, next, k, dt);
    const gapAt = (s) => denseEval(cHi, s) - denseEval(cLo, s);
    // Scan interior nodes s in (0,1) for the FIRST non-positive gap sample.
    let gPrevNode = gammas[i + 1] - gammas[i]; // s=0
    let sPrev = 0;
    for (let m = 1; m <= denseNodes; m++) {
      const s = m / denseNodes;
      const g = gapAt(s);
      if (g <= 0 && gPrevNode > 0) {
        // Sub-step crossing bracketed on [sPrev, s]; refine linearly on the node.
        const fracNode = gPrevNode / (gPrevNode - g);
        const sCross = sPrev + fracNode * (s - sPrev);
        const t_c = (step - 1) * dt + sCross * dt;
        return {
          t_c, cross_index: i, step, frac: sCross,
          g_prev: gPrevNode, g_curr: g, subStep: sPrev > 0 || s < 1,
          endpointPositive: (next[i + 1] - next[i]) > 0,
        };
      }
      gPrevNode = g;
      sPrev = s;
    }
    gammas = next;
    prev = minSignedGap(gammas);
  }
  return { t_c: null, cross_index: null, step: maxSteps, frac: null, g_prev: null, g_curr: null, subStep: null, endpointPositive: null };
}

// -- N=2000 setup (matches imp-35235 / imp-35278 cache convention). -------------
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;           // 1.188352e-6 -- resolved flow grid
const maxStepsFlow = 3000;
const DENSE_NODES = 256;                   // interior sub-step sample resolution

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)} denseNodes=${DENSE_NODES}`);

function report(label, r) {
  if (r.t_c === null) { console.log(`${label}: NO CROSSING within ${r.step} steps`); return; }
  console.log(`${label}: t_c=${r.t_c.toExponential(10)} step=${r.step} idx=${r.cross_index} frac=${r.frac.toFixed(6)} subStep=${r.subStep} endpointPos=${r.endpointPositive} g_prev=${r.g_prev.toExponential(3)} g_curr=${r.g_curr.toExponential(3)}`);
}

let t0 = Date.now();
const dp45 = runCollisionDense(initial, dtFlow, maxStepsFlow, DENSE_NODES);
report(`DP45 dt   dense (${((Date.now() - t0) / 1000).toFixed(1)}s)`, dp45);

t0 = Date.now();
const dp45Half = runCollisionDense(initial, dtFlow / 2, 2 * maxStepsFlow, DENSE_NODES);
report(`DP45 dt/2 dense (${((Date.now() - t0) / 1000).toFixed(1)}s)`, dp45Half);

// -- R2 verdict under the DENSE-OUTPUT event (DP45 family). ----------------------
// The two RK4 references and the DP45 dt reference already register genuine
// endpoint crossings under imp-35278; the ONLY reference the dense output can
// change is DP45 dt/2 (the within-step step-over). We fold in the imp-35278
// RK4 dt, RK4 dt/2, DP45 dt endpoint crossings for the worst-case envelope.
const IMP35278 = {
  rk4_dt: 0.0011924488124,
  dp45_dt: 0.0011926277027,
  rk4_dthalf: 0.0011924935719,
};
const T_C_HI = 1.2e-3;   // imp-857 fixed-dt=1e-4 map upper bracket at N=2000
const envVals = [IMP35278.rk4_dt, dp45.t_c, IMP35278.rk4_dthalf, dp45Half.t_c].filter((v) => v !== null);
const envMax = Math.max(...envVals);
const dp45SelfConv = Math.abs(dp45.t_c - dp45Half.t_c);

console.log('\n-- R2 one-sided true-flow test at N=2000 (TRUE DP45 DENSE-OUTPUT event) --');
console.log(`DP45 dt/2 dense t_c                    = ${dp45Half.t_c === null ? 'null' : dp45Half.t_c.toExponential(10)}`);
console.log(`DP45 dt-vs-dt/2 self-conv (dense)      = ${dp45SelfConv.toExponential(3)}`);
console.log(`worst-case envelope max                = ${envMax.toExponential(10)}`);
console.log(`t_c_hi (map upper bracket)             = ${T_C_HI.toExponential(10)}`);
console.log(`within-step crossing < t_c_hi?         = ${dp45Half.t_c !== null && dp45Half.t_c < T_C_HI}`);
console.log(`R2 predicate envMax <= t_c_hi          = ${envMax <= T_C_HI}   slack=${(T_C_HI - envMax).toExponential(6)}`);
