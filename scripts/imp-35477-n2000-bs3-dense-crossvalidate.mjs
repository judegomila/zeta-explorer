// imp-35477 -- THIRD dense-output family cross-validation of the imp-35351 DP45
// CONTD5 within-step crossing (N=2000 pair-1495), corroborating the imp-35416
// two-family (DP45 CONTD5 + RK4 cubic-Hermite) scheme-independence result.
//
// imp-35351 caught a WITHIN-STEP step-over of pair 1495 at N=2000 (step 2007 at
// dt/2, sub-step interior, t_c=1.1919828898e-3) using the Dormand-Prince 5(4)
// continuous extension (CONTD5). imp-35416 confirmed the crossing is
// SCHEME-INDEPENDENT (not a DP45-CONTD5 artifact) with a SECOND family: an RK4
// (order-4) flow plus a cubic-Hermite dense output, agreeing to ~4.5e-5 relative
// at dt/2. This script adds a THIRD, genuinely distinct integrator family:
// Bogacki-Shampine BS3 (order-3, FSAL) with its NATURAL cubic-Hermite continuous
// extension built from (y0, f0=k1, y1, f1=k4-FSAL), on the SAME imp-35278 N=2000
// setup, same dt=tauC_est/1000 grid, same 256 interior sub-step nodes. It reports
// whether BS3 catches the same step/pair crossing at a compatible t_c.
//
// BS3 (Bogacki-Shampine 3(2)) tableau:
//   c = [0, 1/2, 3/4, 1]
//   k1 = f(y)
//   k2 = f(y + 1/2 h k1)
//   k3 = f(y + 3/4 h k2)
//   y1 = y + h(2/9 k1 + 1/3 k2 + 4/9 k3)   (order-3 update)
//   k4 = f(y1)                              (FSAL -- reused as next-step k1)
// Distinct from RK4 (order-4, non-FSAL) and DP45 (order-5, rational CONTD5): a
// LOWER-order flow with a genuine FSAL endpoint slope feeding the same Hermite
// interpolant form. If BS3 still catches the crossing at the same step/pair, the
// event is corroborated across THREE integrator orders (3, 4, 5).
//
// MEASUREMENT / CROSS-CHECK ONLY. Does not advance the R2 ladder (imp-35412
// KEEPS the endpoint DP45 dt/2 worst-case); changes no bound; C_mb stays
// GUE-conditional per imp-486; NO QED; Platt-Trudgian Lambda<=0.2 stays SOTA.
//
// Run: node scripts/imp-35477-n2000-bs3-dense-crossvalidate.mjs

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

// -- Verbatim BS3 step (order 3, FSAL), returning endpoint state and both end
// derivatives f0 (k1) and f1 (k4, FSAL) so the caller can build the natural cubic
// Hermite dense output. Same Dyson vector field as imp-35351/imp-35278/imp-35416.
function bs3StepHermite(gammas, dt, direction) {
  const N = gammas.length;
  const k1 = dysonDerivativesKahan(gammas, direction);
  const y1 = new Float64Array(N);
  for (let i = 0; i < N; i++) y1[i] = gammas[i] + dt / 2 * k1[i];
  const k2 = dysonDerivativesKahan(y1, direction);
  const y2 = new Float64Array(N);
  for (let i = 0; i < N; i++) y2[i] = gammas[i] + dt * 3 / 4 * k2[i];
  const k3 = dysonDerivativesKahan(y2, direction);
  const result = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    result[i] = gammas[i] + dt * (2 / 9 * k1[i] + 1 / 3 * k2[i] + 4 / 9 * k3[i]);
  }
  const k4 = dysonDerivativesKahan(result, direction); // FSAL endpoint slope
  return { result, f0: k1, f1: k4 };
}

// -- Cubic Hermite continuous extension, per component (value+slope at both ends).
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

// GATE-FREE + BS3 HERMITE DENSE-OUTPUT collision, identical dense-node scan logic
// to imp-35416: track the argmin signed-gap index from step start, sample the
// Hermite extension of the signed gap g(theta) at denseNodes interior nodes, and
// take the first step with any interior sample <= 0 as the within-step crossing.
function runBs3HermiteDense(initial, dt, maxSteps, denseNodes) {
  let gammas = Float64Array.from(initial);
  let prev = minSignedGap(gammas);
  for (let step = 1; step <= maxSteps; step++) {
    const { result: next, f0, f1 } = bs3StepHermite(gammas, dt, -1);
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

// -- N=2000 setup (matches imp-35235 / imp-35278 / imp-35351 / imp-35416 cache). -
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;           // 1.188352e-6 -- resolved flow grid
const maxStepsFlow = 3000;
const DENSE_NODES = 256;                   // SAME interior resolution as imp-35351/imp-35416

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)} denseNodes=${DENSE_NODES}`);

// imp-35351 DP45 CONTD5 (family 1) + imp-35416 RK4-Hermite (family 2) references.
const REFS = {
  dp45_dt:     { t_c: 0.0011923008536, step: 1004, cross_index: 1495 },
  dp45_dthalf: { t_c: 0.0011919828898, step: 2007, cross_index: 1495 },
  rk4_dt:      { t_c: 0.0011923500033, step: 1004, cross_index: 1495 },
  rk4_dthalf:  { t_c: 0.0011920364654, step: 2007, cross_index: 1495 },
};

function report(label, r) {
  if (r.t_c === null) { console.log(`${label}: NO CROSSING within ${r.step} steps`); return; }
  console.log(`${label}: t_c=${r.t_c.toExponential(10)} step=${r.step} idx=${r.cross_index} frac=${r.frac.toFixed(6)} subStep=${r.subStep} endpointPos=${r.endpointPositive} g_prev=${r.g_prev.toExponential(3)} g_curr=${r.g_curr.toExponential(3)}`);
}

let t0 = Date.now();
const bs3Dt = runBs3HermiteDense(initial, dtFlow, maxStepsFlow, DENSE_NODES);
report(`BS3 dt   Hermite (${((Date.now() - t0) / 1000).toFixed(1)}s)`, bs3Dt);

t0 = Date.now();
const bs3Half = runBs3HermiteDense(initial, dtFlow / 2, 2 * maxStepsFlow, DENSE_NODES);
report(`BS3 dt/2 Hermite (${((Date.now() - t0) / 1000).toFixed(1)}s)`, bs3Half);

// -- Three-family scheme-independence comparison. --------------------------------
console.log('\n-- Cross-validation vs imp-35351 DP45 CONTD5 and imp-35416 RK4-Hermite --');
for (const [key, bs3] of [['dt', bs3Dt], ['dt/2', bs3Half]]) {
  const dp45 = key === 'dt' ? REFS.dp45_dt : REFS.dp45_dthalf;
  const rk4 = key === 'dt' ? REFS.rk4_dt : REFS.rk4_dthalf;
  if (bs3.t_c === null) { console.log(`${key}: BS3 found NO crossing (DP45/RK4 saw one) -- schemes DISAGREE`); continue; }
  const dDp45 = Math.abs(bs3.t_c - dp45.t_c), relDp45 = dDp45 / dp45.t_c;
  const dRk4 = Math.abs(bs3.t_c - rk4.t_c), relRk4 = dRk4 / rk4.t_c;
  console.log(`${key}: BS3 t_c=${bs3.t_c.toExponential(10)} sameStep(DP45)=${bs3.step === dp45.step} samePair=${bs3.cross_index === dp45.cross_index}`);
  console.log(`      vs DP45: |dt_c|=${dDp45.toExponential(3)} rel=${relDp45.toExponential(3)}`);
  console.log(`      vs RK4 : |dt_c|=${dRk4.toExponential(3)} rel=${relRk4.toExponential(3)}`);
}
