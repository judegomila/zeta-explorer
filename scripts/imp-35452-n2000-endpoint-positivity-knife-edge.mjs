// imp-35452 -- Characterize the DP45-specific ENDPOINT-POSITIVITY knife-edge that
// imp-35416 flagged. imp-35416 found the N=2000 pair-1495 within-step crossing is
// SCHEME-INDEPENDENT (t_c agrees ~4.5e-5 relative across DP45-CONTD5 and RK4-Hermite)
// but the ENDPOINT-positivity flag differs at dt/2: DP45 dt/2 endpoint gap POSITIVE
// (pure within-step step-over -- the order-5 pair re-separates before the step end)
// while independent RK4 dt/2 endpoint gap NEGATIVE (order-4 crossing persists to the
// step end). This script MAPS exactly where the step-endpoint signed gap of pair-1495
// changes SIGN across integrator order (RK4 vs DP45) and grid (dt, dt/2, dt/4), and
// quantifies how thin the DP45 knife-edge is via the minimum-over-steps endpoint gap.
//
// The endpoint signed gap at the tracked pair i=1495 for a step landing at y1 is
//   g_end(step) = y1[i+1] - y1[i].
// A pure within-step step-over keeps g_end(step) > 0 at EVERY step (the endpoint
// state never sees the crossing -- the knife-edge). An endpoint crossing has some
// step with g_end(step) <= 0. The knife-edge THINNESS is the minimum positive
// g_end over the collision window: the closer to zero, the thinner the blindness.
//
// Same verbatim N=2000 / dt = tauC_est/1000 / Kahan-Neumaier Dyson setup as
// imp-35278 / imp-35351 / imp-35416. MEASUREMENT ONLY. Removes no conditional;
// C_mb stays GUE-conditional per imp-486; changes no bound; NO QED.
//
// Run: node scripts/imp-35452-n2000-endpoint-positivity-knife-edge.mjs

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
function rk4Step(gammas, dt, direction) {
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

// -- Verbatim DP45 (Dormand-Prince 5(4)) fifth-order step. -----------------------
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

function minSignedGap(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { gap: minS, index: minIdx };
}

// Track the ENDPOINT signed gap g_end(step) = y1[i+1]-y1[i] at the argmin pair i.
// Report: (a) minimum g_end over the flow and the step it occurs at (knife-edge
// thinness -- if positive, the endpoint never sees the crossing); (b) whether the
// endpoint gap ever goes non-positive (endpointCrosses) and the first such step.
function endpointGapScan(initial, dt, maxSteps, stepFn) {
  let gammas = Float64Array.from(initial);
  let prev = minSignedGap(gammas);
  let minEnd = Infinity, minEndStep = -1;
  let endpointCrosses = false, firstCrossStep = -1, firstCrossGap = null;
  let trackedIndex = prev.index;
  for (let step = 1; step <= maxSteps; step++) {
    const next = stepFn(gammas, dt, -1);
    const i = prev.index;                       // argmin pair entering this step
    const gEnd = next[i + 1] - next[i];         // endpoint signed gap at that pair
    if (gEnd < minEnd) { minEnd = gEnd; minEndStep = step; trackedIndex = i; }
    if (gEnd <= 0 && !endpointCrosses) {
      endpointCrosses = true; firstCrossStep = step; firstCrossGap = gEnd;
    }
    gammas = next;
    prev = minSignedGap(gammas);
  }
  return { minEnd, minEndStep, trackedIndex, endpointCrosses, firstCrossStep, firstCrossGap };
}

// -- N=2000 setup (matches imp-35235 / imp-35278 / imp-35351 / imp-35416). -------
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;               // 1.188352e-6 -- resolved flow grid

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)}`);
console.log('Endpoint signed gap of pair-1495: sign map across order x grid.\n');

// Collision lands at t_c ~ 1.1920e-3 -> step ~ t_c/dt. Bound each run just past it.
const GRIDS = [
  { key: 'dt',   dt: dtFlow,     maxSteps: 1100 },
  { key: 'dt/2', dt: dtFlow / 2, maxSteps: 2150 },
  { key: 'dt/4', dt: dtFlow / 4, maxSteps: 4300 },
];
const INTEGRATORS = [
  { name: 'RK4 ', fn: rk4Step },
  { name: 'DP45', fn: dp45Step },
];

for (const intg of INTEGRATORS) {
  for (const g of GRIDS) {
    const t0 = Date.now();
    const r = endpointGapScan(initial, g.dt, g.maxSteps, intg.fn);
    const dtSec = ((Date.now() - t0) / 1000).toFixed(1);
    const sign = r.minEnd > 0 ? 'POSITIVE (within-step step-over: endpoint BLIND)'
                              : 'NON-POSITIVE (endpoint SEES crossing)';
    console.log(
      `${intg.name} ${g.key.padEnd(4)} (${dtSec}s): minEndGap=${r.minEnd.toExponential(6)} @step ${r.minEndStep} ` +
      `pair ${r.trackedIndex} | endpointCrosses=${r.endpointCrosses}` +
      (r.endpointCrosses ? ` firstCrossStep=${r.firstCrossStep} gap=${r.firstCrossGap.toExponential(3)}` : '') +
      `\n     -> endpoint SIGN = ${sign}`,
    );
  }
}
