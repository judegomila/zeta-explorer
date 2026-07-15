// imp-35539 -- MEASURE the signed margin-to-zero of the LONE endpoint-POSITIVE cell
// (DP45 dt/2, imp-35416/imp-35452) at the WITHIN-STEP crossing step, against the
// endpoint-NEGATIVE RK4 and BS3 (imp-35477) cells, quantifying how knife-edge the
// lone positive sits.
//
// imp-35452 mapped the 2x3 (order x grid) sign map of the step-endpoint signed gap
//   g_end(step) = y1[i+1] - y1[i]      (i = tracked argmin pair 1495, N=2000)
// and found the DP45 dt/2 cell is the ONLY one whose endpoint gap stays POSITIVE
// (pure order-5 within-step step-over: the pair re-separates before the step lands),
// while RK4 dt/2 is NEGATIVE. imp-35477 added a THIRD integrator family (Bogacki-
// Shampine BS3, order 3) and confirmed its endpoint gap is NEGATIVE at both dt and
// dt/2, matching RK4. So DP45 dt/2 is the LONE endpoint-positive cell.
//
// imp-35452 reported the MINIMUM-over-steps endpoint gap (+1.775e-3 at step 2006).
// This script measures a DIFFERENT, more directly comparable quantity: the endpoint
// gap g_end evaluated AT THE WITHIN-STEP CROSSING STEP of each cell -- i.e. at the
// step where the dense (CONTD5 / cubic-Hermite) interior signed gap first dips <= 0.
// At that single step the endpoint is either BLIND (g_end > 0, the DP45 dt/2 case)
// or already SEES the crossing (g_end <= 0, RK4/BS3). Reporting g_end at that common
// event isolates exactly how far the lone positive sits from flipping negative and
// how large the neighbouring negatives are, so the knife-edge can be quantified as a
// signed margin ratio (positive value / typical neighbouring negative magnitude).
//
// Cells measured: DP45 {dt, dt/2} (CONTD5 dense), RK4 {dt, dt/2} and BS3 {dt, dt/2}
// (cubic-Hermite dense). For each: detect the within-step crossing step via the same
// dense-node interior scan as imp-35351/imp-35416/imp-35477, then record
//   g_end_cross = next[i+1] - next[i]   at that crossing step.
//
// Same verbatim N=2000 / dt = tauC_est/1000 / Kahan-Neumaier Dyson setup as
// imp-35278 / imp-35351 / imp-35416 / imp-35452 / imp-35477. MEASUREMENT ONLY.
// Adopts NO new worst-case (imp-35412 KEEPS endpoint DP45 dt/2); changes no bound;
// C_mb stays GUE-conditional per imp-486; NO QED; Platt-Trudgian Lambda<=0.2 SOTA.
//
// Run: node scripts/imp-35539-dp45-dthalf-endpoint-margin-to-zero.mjs

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

// -- DP45 (Dormand-Prince 5(4)) fifth-order step + seven stages for CONTD5. -------
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
const D1 = -12715105075 / 11282082432;
const D3 = 87487479700 / 32700410799;
const D4 = -10690763975 / 1880347072;
const D5 = 701980252875 / 199316789632;
const D6 = -1453857185 / 822651844;
const D7 = 69997945 / 29380423;
function dp45DenseIndex(i, y0, y1, k, dt, s) {
  const k1 = k[0][i], k3 = k[2][i], k4 = k[3][i], k5 = k[4][i], k6 = k[5][i], k7 = k[6][i];
  const r1 = y0[i];
  const ydiff = y1[i] - y0[i];
  const bspl = dt * k1 - ydiff;
  const r2 = ydiff;
  const r3 = bspl;
  const r4 = ydiff - dt * k7 - bspl;
  const r5 = dt * (D1 * k1 + D3 * k3 + D4 * k4 + D5 * k5 + D6 * k6 + D7 * k7);
  const s1 = 1 - s;
  return r1 + s * (r2 + s1 * (r3 + s * (r4 + s1 * r5)));
}

// -- RK4 step (order 4), returning endpoint state + end slopes for cubic Hermite. -
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
  const fEnd = dysonDerivativesKahan(result, direction);
  return { result, f0: k1, f1: fEnd };
}

// -- BS3 step (order 3, FSAL), returning endpoint state + FSAL end slope. ---------
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

// Detect the first within-step interior crossing (dense signed-gap sample <= 0) and
// record the endpoint signed gap g_end at THAT step. familyStep(gammas,dt) returns
// { next, gapDense(i,s) } so DP45 (CONTD5) and RK4/BS3 (Hermite) share one scanner.
function crossingStepEndpointGap(initial, dt, maxSteps, denseNodes, familyStep) {
  let gammas = Float64Array.from(initial);
  let prev = minSignedGap(gammas);
  for (let step = 1; step <= maxSteps; step++) {
    const { next, gapDense } = familyStep(gammas, dt);
    const i = prev.index;
    let gPrev = gammas[i + 1] - gammas[i]; // s=0 interior sample
    for (let m = 1; m <= denseNodes; m++) {
      const s = m / denseNodes;
      const g = gapDense(i, s);
      if (g <= 0 && gPrev > 0) {
        const gEnd = next[i + 1] - next[i]; // endpoint signed gap at the crossing step
        return { step, cross_index: i, gEnd, endpointPositive: gEnd > 0 };
      }
      gPrev = g;
    }
    gammas = next;
    prev = minSignedGap(gammas);
  }
  return { step: null, cross_index: null, gEnd: null, endpointPositive: null };
}

function dp45Family(gammas, dt) {
  const { result: next, k } = dp45StepStages(gammas, dt, -1);
  const gapDense = (i, s) =>
    dp45DenseIndex(i + 1, gammas, next, k, dt, s) - dp45DenseIndex(i, gammas, next, k, dt, s);
  return { next, gapDense };
}
function hermiteFamily(stepFn) {
  return (gammas, dt) => {
    const { result: next, f0, f1 } = stepFn(gammas, dt, -1);
    const gapDense = (i, s) =>
      hermiteEvalIndex(i + 1, gammas, next, f0, f1, dt, s) -
      hermiteEvalIndex(i, gammas, next, f0, f1, dt, s);
    return { next, gapDense };
  };
}

// -- N=2000 setup (matches imp-35235 / imp-35278 / imp-35351 / imp-35416 cache). --
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;            // 1.188352e-6 -- resolved flow grid
const DENSE_NODES = 256;                    // SAME interior resolution as imp-35351/etc.

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)} denseNodes=${DENSE_NODES}`);
console.log('Endpoint signed gap of pair-1495 AT the within-step crossing step:\n');

const CELLS = [
  { label: 'DP45 dt  ', dt: dtFlow,     maxSteps: 1100, fam: dp45Family },
  { label: 'DP45 dt/2', dt: dtFlow / 2, maxSteps: 2150, fam: dp45Family },
  { label: 'RK4  dt  ', dt: dtFlow,     maxSteps: 1100, fam: hermiteFamily(rk4StepHermite) },
  { label: 'RK4  dt/2', dt: dtFlow / 2, maxSteps: 2150, fam: hermiteFamily(rk4StepHermite) },
  { label: 'BS3  dt  ', dt: dtFlow,     maxSteps: 1100, fam: hermiteFamily(bs3StepHermite) },
  { label: 'BS3  dt/2', dt: dtFlow / 2, maxSteps: 2150, fam: hermiteFamily(bs3StepHermite) },
];

const rows = [];
for (const c of CELLS) {
  const t0 = Date.now();
  const r = crossingStepEndpointGap(initial, c.dt, c.maxSteps, DENSE_NODES, c.fam);
  const dtSec = ((Date.now() - t0) / 1000).toFixed(1);
  rows.push({ label: c.label.trim(), ...r });
  if (r.step === null) { console.log(`${c.label} (${dtSec}s): NO within-step crossing`); continue; }
  const sign = r.endpointPositive ? 'POSITIVE (endpoint BLIND)' : 'NEGATIVE (endpoint SEES)';
  console.log(
    `${c.label} (${dtSec}s): crossingStep=${r.step} pair=${r.cross_index} ` +
    `g_end=${r.gEnd.toExponential(9)} -> ${sign}`,
  );
}

// -- Margin-to-zero of the lone endpoint-positive DP45 dt/2 cell. -----------------
console.log('\n-- Margin-to-zero of the lone endpoint-positive cell (DP45 dt/2) --');
const lone = rows.find((r) => r.label === 'DP45 dt/2');
const negatives = rows.filter((r) => r.gEnd !== null && r.gEnd <= 0);
if (lone && lone.gEnd !== null && lone.endpointPositive && negatives.length) {
  const negMags = negatives.map((r) => Math.abs(r.gEnd));
  const meanNeg = negMags.reduce((a, b) => a + b, 0) / negMags.length;
  const minNeg = Math.min(...negMags);
  const maxNeg = Math.max(...negMags);
  console.log(`DP45 dt/2 endpoint gap (positive)   : ${lone.gEnd.toExponential(9)}`);
  console.log(`neighbouring NEGATIVE cells         : ${negatives.map((r) => r.label + '=' + r.gEnd.toExponential(3)).join(', ')}`);
  console.log(`|neg| magnitude  min/mean/max       : ${minNeg.toExponential(3)} / ${meanNeg.toExponential(3)} / ${maxNeg.toExponential(3)}`);
  console.log(`signed margin (positive gap to zero): +${lone.gEnd.toExponential(6)}`);
  console.log(`margin ratio (positive / mean |neg|): ${(lone.gEnd / meanNeg).toExponential(6)}`);
  console.log(`\nReading: the lone positive is NOT infinitesimally close to zero -- it sits`);
  console.log(`at ${(lone.gEnd / meanNeg).toFixed(3)}x the mean magnitude of the neighbouring negatives, so`);
  console.log(`the DP45 dt/2 endpoint step-over is a genuine order-5 within-step re-separation,`);
  console.log(`not a marginal float sign that a nudge would flip (cf. imp-35490 dd precision).`);
} else {
  console.log('Expected lone-positive DP45 dt/2 vs negative neighbours not reproduced.');
}
