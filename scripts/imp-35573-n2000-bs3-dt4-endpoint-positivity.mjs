// imp-35573 -- Fill the MISSING BS3 dt/4 cell of the imp-35506 3x3 family-x-grid
// endpoint-positivity knife-edge matrix. imp-35506 assembled a 3x2 matrix
// (DP45/RK4/BS3 x dt, dt/2) with exactly ONE endpoint-POSITIVE cell (DP45 dt/2).
// The dt/4 column exists only for RK4/DP45 (imp-35452); BS3 (imp-35477) stops at
// dt, dt/2. This script re-runs the imp-35477 BS3 (order-3 FSAL + cubic-Hermite)
// dense-output crossing on the SAME imp-35278 N=2000 setup at dt/4 and reports the
// endpoint-positivity sign (endpointPositive flag + g_curr signed gap at the dense
// crossing node), so the missing cell can be filled and the single-positive-cell
// knife-edge either confirmed persistent or shown to gain a second positive cell.
//
// MEASUREMENT ONLY. Presentation-neutral; adds no Lambda bound; C_mb stays
// GUE-conditional per imp-486; NO QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.
//
// Run: node scripts/imp-35573-n2000-bs3-dt4-endpoint-positivity.mjs

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

// -- Verbatim BS3 step (order 3, FSAL) -- identical to imp-35477. ----------------
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

// GATE-FREE + BS3 HERMITE DENSE-OUTPUT collision, identical to imp-35477.
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

// -- N=2000 setup (matches imp-35278 / imp-35351 / imp-35416 / imp-35477 cache). -
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;            // 1.188352e-6 -- resolved flow grid
const DENSE_NODES = 256;                    // SAME interior resolution as imp-35477

console.log(`N=${N} tauC_est=${tauC_est} dtFlow=${dtFlow.toExponential(6)} denseNodes=${DENSE_NODES}`);

// imp-35477 baked BS3 dt, dt/2 references (for the sign continuity read-out).
const BS3_REFS = {
  dt:     { t_c: 0.0011923806919, step: 1004, endpointPositive: false, g_curr: -2.635e-6 },
  dtHalf: { t_c: 0.0011921020374, step: 2007, endpointPositive: false, g_curr: -1.044e-5 },
};

const t0 = Date.now();
// dt/4 crossing lands near step ~4014 (dt step 1004, dt/2 step 2007); bound past it.
const bs3Quarter = runBs3HermiteDense(initial, dtFlow / 4, 4300, DENSE_NODES);
const secs = ((Date.now() - t0) / 1000).toFixed(1);

if (bs3Quarter.t_c === null) {
  console.log(`BS3 dt/4 Hermite (${secs}s): NO CROSSING within ${bs3Quarter.step} steps`);
} else {
  console.log(
    `BS3 dt/4 Hermite (${secs}s): t_c=${bs3Quarter.t_c.toExponential(10)} step=${bs3Quarter.step} ` +
    `idx=${bs3Quarter.cross_index} frac=${bs3Quarter.frac.toFixed(6)} subStep=${bs3Quarter.subStep} ` +
    `endpointPos=${bs3Quarter.endpointPositive} g_prev=${bs3Quarter.g_prev.toExponential(3)} ` +
    `g_curr=${bs3Quarter.g_curr.toExponential(6)}`,
  );
  console.log('\n-- BS3 endpoint-positivity sign across dt, dt/2, dt/4 --');
  console.log(`  dt  : endpointPos=${BS3_REFS.dt.endpointPositive} g_curr=${BS3_REFS.dt.g_curr.toExponential(3)} (imp-35477)`);
  console.log(`  dt/2: endpointPos=${BS3_REFS.dtHalf.endpointPositive} g_curr=${BS3_REFS.dtHalf.g_curr.toExponential(3)} (imp-35477)`);
  console.log(`  dt/4: endpointPos=${bs3Quarter.endpointPositive} g_curr=${bs3Quarter.g_curr.toExponential(3)} (imp-35573, THIS run)`);
  const secondPositive = bs3Quarter.endpointPositive === true;
  console.log(`\n  -> BS3 dt/4 endpoint sign = ${secondPositive ? 'POSITIVE (a SECOND positive cell appears)' : 'NEGATIVE (single-positive-cell knife-edge PERSISTS)'}`);
}
