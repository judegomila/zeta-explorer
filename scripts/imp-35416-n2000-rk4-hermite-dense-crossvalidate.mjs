// imp-35416 -- SCHEME-INDEPENDENCE cross-validation of the imp-35351 DP45
// CONTD5 dense-output within-step crossing (N=2000 pair-1495) against an
// INDEPENDENT RK4 flow + cubic Hermite dense-output interpolant.
//
// imp-35351 built the Dormand-Prince 5(4) continuous extension (Hairer/Wanner
// CONTD5) and caught the N=2000 pair-1495 WITHIN-STEP step-over at step 2007,
// sub-step frac 0.110798, t_c=1.1919828898e-3, where the step-endpoint signed
// gap is POSITIVE (only the interior dense sample sees it). That was a
// SINGLE-METHOD detection. This script confirms the crossing is
// SCHEME-INDEPENDENT (not a DP45-CONTD5 interpolant artifact) by reproducing the
// SAME imp-35278 N=2000 setup with an RK4 (order-4) flow and a CUBIC HERMITE
// dense-output interpolant built from the RK4 step-endpoint states and their
// Dyson derivatives (y0, f0=f(y0), y1, f1=f(y1)), sampled at the SAME 256
// interior sub-step nodes, and compares the caught within-step crossing time,
// step index, cross pair, and sub-step fraction to the imp-35351 DP45 event.
//
// Cubic Hermite on theta in [0,1] with step size h:
//   y(theta) = h00*y0 + h10*h*f0 + h01*y1 + h11*h*f1
//   h00 = 2t^3-3t^2+1, h10 = t^3-2t^2+t, h01 = -2t^3+3t^2, h11 = t^3-t^2
// This is the order-4-consistent C^1 interpolant matching value+slope at both
// step ends -- the standard RK4 companion dense output, DISTINCT in family from
// the DP45 CONTD5 rational-D-coefficient extension.
//
// Same N=2000, same dt = tauC_est/1000 grid, RK4 at dt and dt/2. MEASUREMENT
// ONLY. Removes no conditional; C_mb stays GUE-conditional per imp-486; NO QED.
//
// Run: node scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs

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

// -- Verbatim RK4 step (order 4), returning endpoint state and endpoint deriv. ---
// Returns { result, f0, f1 } so the caller can build the cubic Hermite dense
// output: f0 is the derivative at the step START (k1), f1 the derivative at the
// step END (one extra Dyson eval; RK4 is not FSAL). Same math as imp-35351/imp-35278.
function rk4StepHermite(gammas, dt, direction) {
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
  const f1 = dysonDerivativesKahan(result, direction);
  return { result, f0: k1, f1 };
}

// -- Cubic Hermite continuous extension, per component. --------------------------
// Value+slope matched at both step ends; sampled component-wise so the caller can
// form the signed gap y(i+1;theta) - y(i;theta) at the tracked argmin index.
function hermiteEvalIndex(i, y0, y1, f0, f1, dt, s) {
  const s2 = s * s, s3 = s2 * s;
  const h00 = 2 * s3 - 3 * s2 + 1;
  const h10 = s3 - 2 * s2 + s;
  const h01 = -2 * s3 + 3 * s2;
  const h11 = s3 - s2;
  return h00 * y0[i] + h10 * dt * f0[i] + h01 * y1[i] + h11 * dt * f1[i];
}

function minSignedGap(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { gap: minS, index: minIdx };
}

// GATE-FREE + RK4 HERMITE DENSE-OUTPUT collision: at each step, track the argmin
// signed-gap index i from the step start, then sample the cubic Hermite extension
// of the signed gap g(theta) = y(i+1;theta) - y(i;theta) at denseNodes interior
// nodes. The first step with any interior sample <= 0 is a within-step crossing;
// the sub-step time is bracketed on the dense node grid and refined linearly.
function runRk4HermiteDense(initial, dt, maxSteps, denseNodes) {
  let gammas = Float64Array.from(initial);
  let prev = minSignedGap(gammas);
  for (let step = 1; step <= maxSteps; step++) {
    const { result: next, f0, f1 } = rk4StepHermite(gammas, dt, -1);
    const i = prev.index;
    const gapAt = (s) =>
      hermiteEvalIndex(i + 1, gammas, next, f0, f1, dt, s) -
      hermiteEvalIndex(i, gammas, next, f0, f1, dt, s);
    let gPrevNode = gammas[i + 1] - gammas[i]; // s=0
    let sPrev = 0;
    for (let m = 1; m <= denseNodes; m++) {
      const s = m / denseNodes;
      const g = gapAt(s);
      if (g <= 0 && gPrevNode > 0) {
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

// -- N=2000 setup (matches imp-35235 / imp-35278 / imp-35351 cache convention). --
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;           // 1.188352e-6 -- resolved flow grid
const maxStepsFlow = 3000;
const DENSE_NODES = 256;                   // interior sub-step sample resolution -- SAME as imp-35351

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)} denseNodes=${DENSE_NODES}`);

// imp-35351 DP45 CONTD5 dense-output references to cross-check against.
const IMP35351 = {
  dp45_dt:     { t_c: 0.0011923008536, step: 1004, cross_index: 1495, frac: 0.322966, endpointPositive: false },
  dp45_dthalf: { t_c: 0.0011919828898, step: 2007, cross_index: 1495, frac: 0.110798, endpointPositive: true },
};

function report(label, r) {
  if (r.t_c === null) { console.log(`${label}: NO CROSSING within ${r.step} steps`); return; }
  console.log(`${label}: t_c=${r.t_c.toExponential(10)} step=${r.step} idx=${r.cross_index} frac=${r.frac.toFixed(6)} subStep=${r.subStep} endpointPos=${r.endpointPositive} g_prev=${r.g_prev.toExponential(3)} g_curr=${r.g_curr.toExponential(3)}`);
}

let t0 = Date.now();
const rk4Dt = runRk4HermiteDense(initial, dtFlow, maxStepsFlow, DENSE_NODES);
report(`RK4 dt   Hermite (${((Date.now() - t0) / 1000).toFixed(1)}s)`, rk4Dt);

t0 = Date.now();
const rk4Half = runRk4HermiteDense(initial, dtFlow / 2, 2 * maxStepsFlow, DENSE_NODES);
report(`RK4 dt/2 Hermite (${((Date.now() - t0) / 1000).toFixed(1)}s)`, rk4Half);

// -- Scheme-independence comparison against imp-35351 DP45 CONTD5. ---------------
console.log('\n-- Cross-validation vs imp-35351 DP45 CONTD5 dense-output --');
for (const [key, rk4] of [['dt', rk4Dt], ['dt/2', rk4Half]]) {
  const ref = key === 'dt' ? IMP35351.dp45_dt : IMP35351.dp45_dthalf;
  if (rk4.t_c === null) { console.log(`${key}: RK4 Hermite found NO crossing (DP45 saw one) -- schemes DISAGREE`); continue; }
  const dtc = Math.abs(rk4.t_c - ref.t_c);
  const rel = dtc / ref.t_c;
  console.log(`${key}: RK4 t_c=${rk4.t_c.toExponential(10)} DP45 t_c=${ref.t_c.toExponential(10)} |dt_c|=${dtc.toExponential(3)} rel=${rel.toExponential(3)} sameStep=${rk4.step === ref.step} samePair=${rk4.cross_index === ref.cross_index} step(RK4=${rk4.step},DP45=${ref.step})`);
}
