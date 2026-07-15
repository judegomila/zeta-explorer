// imp-35325 -- diagnose whether the imp-35235 DP45 dt/2 gate-skip at N=2000 is a
// PHYSICAL near-collision the coarse order-5 stages stepped over, or merely a
// sort-order label swap of two zeros that stay separated.
//
// imp-35235 reported that the DP45 dt/2 refinement jumps the sorted min gap of
// pair-1495 from 1.775e-3 straight to a re-sorted 3.23e-2 WITHOUT landing in the
// (0, 1e-4) gate, and continues to a spurious re-approach at t_c=1.3238e-3.
// imp-35278 inferred (from step ENDPOINTS) that the pair steps through each other
// and re-separates within one dt/2 step, so both endpoints stay positive and an
// endpoint event (gate or signed-crossing) is blind to it. This sidecar makes the
// DIRECT measurement the ticket asks for: it captures the pre-skip DP45 dt/2 state
// and SUB-INTEGRATES that single dt/2 interval with a fine DP45 sub-grid, tracking
// the SIGNED ordinate difference d = gamma[1496]-gamma[1495] at INTERIOR nodes.
//   * If d changes sign inside the interval -> the two zeros PHYSICALLY pass
//     through each other; the coarse order-5 dt/2 step stepped OVER the true event
//     (a real collision), so the true t_c(2000) sits below t_c_hi as the three
//     clean references say, and the re-approach at 1.3238e-3 is spurious.
//   * If d stays same-sign throughout -> the zeros never cross; the coarse step's
//     jump to 3.23e-2 is a label re-sort of still-separated zeros.
// Cross-checks the RK4 dt/2 reference (which lands correctly at t_c=1.1925e-3) for
// the same interior signed-difference sign change.
//
// MEASUREMENT/DIAGNOSTIC ONLY. Informs imp-35278; changes no bound; C_mb stays
// GUE-conditional per imp-486; NO QED.
//
// Run: node scripts/imp-35325-n2000-signed-crossing-diagnostic.mjs

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

// The colliding pair (imp-35235). Adjacent slots; array is never re-sorted during
// the flow, so slots 1495/1496 hold the same two zeros until the event.
const LO = 1495, HI = 1496;
const signedDiff = (g) => g[HI] - g[LO];

// ── N=2000 setup, verbatim imp-35235 grid convention. ────────────────────────
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtHalf = tauC_est / 1000 / 2;   // dt/2 refinement grid (5.94176e-7)
console.log(`N=${N} tauC_est=${tauC_est} dtHalf=${dtHalf.toExponential(6)}`);

// Advance under a stepper, logging the SIGNED diff of the tracked pair. Returns
// the state saved at the step JUST BEFORE the skip (pre-skip snapshot) plus the
// signed-diff trajectory near the event.
function traceSigned(stepper, label, maxSteps, jumpFactor) {
  let g = Float64Array.from(initial);
  let prev = signedDiff(g);
  let preSkipState = null, skipStep = -1, dPre = NaN, dPost = NaN;
  const traj = [];
  for (let step = 0; step < maxSteps; step++) {
    const before = Float64Array.from(g);
    g = stepper(g, dtHalf, -1);
    const d = signedDiff(g);
    // record trajectory once we are inside the fast-approach region
    if (Math.abs(prev) < 6e-3) traj.push({ step: step + 1, d });
    // skip = signed diff was small-positive and jumped up by > jumpFactor in |.|
    if (skipStep < 0 && prev > 0 && prev < 2e-3 && Math.abs(d) > jumpFactor * prev) {
      preSkipState = before; skipStep = step; dPre = prev; dPost = d;
    }
    prev = d;
  }
  console.log(`\n[${label}] tracked signed diff d = gamma[${HI}]-gamma[${LO}]:`);
  for (const p of traj.slice(0, 24)) {
    console.log(`  step ${p.step}: d = ${p.d.toExponential(6)}`);
  }
  if (skipStep >= 0) {
    console.log(`  >> SKIP at step ${skipStep}->${skipStep + 1}: d_pre=${dPre.toExponential(6)} d_post=${dPost.toExponential(6)} (endpoint sign change: ${Math.sign(dPre) !== Math.sign(dPost)})`);
  } else {
    console.log('  (no single-step skip matching the jump criterion in range)');
  }
  return { preSkipState, skipStep, dPre, dPost };
}

// ── DP45 dt/2: locate the gate-skip step and snapshot the pre-skip state. ─────
const dp45Trace = traceSigned(dp45Step, 'DP45 dt/2', 2010, 5);

// ── RK4 dt/2 cross-check: same tracked signed diff near its correct landing. ──
const rk4Trace = traceSigned(rk4StepKahan, 'RK4 dt/2', 2012, 5);

// ── DIRECT SUB-STEP PROBE: finely re-integrate the DP45 skip interval. ────────
// From the pre-skip state, integrate the SAME single dt/2 interval with M DP45
// sub-steps and watch the signed diff at interior nodes. A sign change inside the
// interval => the zeros physically pass through each other (a real near-collision
// the coarse order-5 dt/2 step stepped over). No sign change => a label re-sort.
if (dp45Trace.preSkipState) {
  const M = 2000;
  const subDt = dtHalf / M;
  let g = Float64Array.from(dp45Trace.preSkipState);
  let prev = signedDiff(g);
  let signChanges = 0, minAbs = Math.abs(prev), minAbsAt = 0, firstCrossFrac = null;
  let dEnd = prev;
  for (let m = 0; m < M; m++) {
    g = dp45Step(g, subDt, -1);
    const d = signedDiff(g);
    if (Math.abs(d) < minAbs) { minAbs = Math.abs(d); minAbsAt = (m + 1) / M; }
    if (Math.sign(d) !== Math.sign(prev) && prev !== 0) {
      signChanges++;
      if (firstCrossFrac === null) firstCrossFrac = (m + 0.5) / M;
    }
    prev = d;
    dEnd = d;
    if (!Number.isFinite(d)) break;
  }
  console.log('\n── DIRECT SUB-STEP PROBE of the DP45 dt/2 skip interval ──');
  console.log(`  M=${M} sub-steps of DP45 (subDt=${subDt.toExponential(4)}) from the pre-skip state`);
  console.log(`  interior sign changes of d          = ${signChanges}`);
  console.log(`  min |d| reached inside the interval = ${minAbs.toExponential(6)} at frac ${minAbsAt.toFixed(4)}`);
  console.log(`  first zero-crossing at frac         = ${firstCrossFrac === null ? 'none' : firstCrossFrac.toFixed(4)}`);
  console.log(`  signed diff at interval end         = ${dEnd.toExponential(6)}`);
  console.log(`  VERDICT: ${signChanges > 0 ? 'PHYSICAL pass-through (zeros cross inside the coarse step)' : 'NO crossing (label re-sort of separated zeros)'}`);
}
