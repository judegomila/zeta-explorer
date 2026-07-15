// imp-35490 -- Does the imp-35452 lone endpoint-POSITIVE cell (DP45 dt/2, min
// endpoint gap +1.775304e-3 at step 2006) survive COMPENSATED / EXTENDED-precision
// arithmetic, or is the DP45 dt/2 endpoint positivity a float64 rounding artifact?
//
// imp-35452 mapped the 2x3 (order x grid) endpoint-signed-gap sign map for the
// N=2000 pair-1495 collision and found the DP45 dt/2 cell is the ONLY one whose
// step-endpoint gap stays POSITIVE (pure within-step step-over: the order-5 pair
// re-separates before the step lands). imp-35477 confirmed BS3 negative. That lone
// positive cell is the imp-35412 knife-edge worst-case. This script MEASURES whether
// the +1.775304e-3 minimum positive endpoint gap is precision-robust:
//
//   (1) reproduce the baseline float64 min endpoint gap under the verbatim
//       Kahan-Neumaier (COMPENSATED-accumulation) derivative, capturing the state
//       ENTERING the argmin step;
//   (2) recompute that single critical DP45 step in FULL DOUBLE-DOUBLE (dd) arithmetic
//       -- dd twoSum/twoProd accumulation of the derivative, dd stage combination --
//       from the identical float64 entering-state, giving an extended-precision
//       reference for the most cancellation-prone (final) step;
//   (3) report the analytical float64 endpoint-subtraction noise floor
//       eps*(|y[i+1]|+|y[i]|), i.e. the rounding uncertainty of the g_end = y[i+1]-y[i]
//       difference itself, and the many-orders-of-magnitude margin over it.
//
// If the dd endpoint gap agrees with the float64 gap to well within the +1.775e-3
// magnitude (and the noise floor sits orders of magnitude below it), the endpoint
// POSITIVITY is GENUINE -- an order-5 within-step step-over, not a rounding artifact.
//
// Full-trajectory double-double at N=2000 x ~2010 steps x 7 dd-derivative-evals is
// ~5.6e10 dd inner ops (~hours single-threaded) and is left as the residual sub-gap
// imp-35490a; this script isolates the decisive final-step arithmetic + the endpoint-
// difference conditioning, which is where any rounding sign-flip would have to live.
//
// Same verbatim N=2000 / dt = tauC_est/1000 / Kahan-Neumaier Dyson setup as
// imp-35278 / imp-35351 / imp-35416 / imp-35452. MEASUREMENT ONLY. Adopts NO new slack
// denominator (imp-35412 KEEPS the endpoint worst-case), changes no bound, R2 ladder
// certified at N=1000 UNTOUCHED; C_mb stays GUE-conditional per imp-486; NO QED.
//
// Run: node scripts/imp-35490-dp45-dthalf-endpoint-positivity-doubledouble.mjs

const { ZEROS_EXTENDED } = await import('../src/data/zeros-to-1e6.js');
const { EMPIRICAL_M_SWEEP_EXTENDED } = await import('../src/data/empirical-m-sweep-extended.js');

// -- Verbatim Kahan-Neumaier Dyson derivative (imp-306/imp-357/imp-363). ---------
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

// -- Double-double primitives (Dekker/Knuth error-free transforms). ---------------
// A dd number is a pair [hi, lo] with hi + lo representing the value to ~106 bits.
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
function twoProd(a, b) {
  const p = a * b;
  const err = Math.fma ? Math.fma(a, b, -p) : dekkerTwoProd(a, b, p);
  return [p, err];
}
function dekkerTwoProd(a, b, p) {
  const SPLIT = 134217729; // 2^27 + 1
  let c = SPLIT * a; const ahi = c - (c - a); const alo = a - ahi;
  c = SPLIT * b; const bhi = c - (c - b); const blo = b - bhi;
  return ((ahi * bhi - p) + ahi * blo + alo * bhi) + alo * blo;
}
function ddAdd(a, b) { // [hi,lo] + [hi,lo]
  let [s, e] = twoSum(a[0], b[0]);
  e += a[1] + b[1];
  const [hi, lo] = twoSum(s, e);
  return [hi, lo];
}
function ddAddF(a, f) { // dd + float
  let [s, e] = twoSum(a[0], f);
  e += a[1];
  const [hi, lo] = twoSum(s, e);
  return [hi, lo];
}
function ddMulF(a, f) { // dd * float
  let [p, e] = twoProd(a[0], f);
  e += a[1] * f;
  const [hi, lo] = twoSum(p, e);
  return [hi, lo];
}
function ddRecip(f) { // 1 / float, refined to dd (Newton correction)
  const y0 = 1 / f;
  // residual r = 1 - f*y0  (computed in dd via twoProd)
  const [p, pe] = twoProd(f, y0);
  const r = (1 - p) - pe;          // 1 - f*y0 to high precision
  const corr = y0 * r;             // y0 * r
  return twoSum(y0, corr);
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

// -- Double-double DP45 derivative: dd twoSum accumulation of 1/(g[n]-g[k]). ------
// gammas is an array of dd pairs. Returns an array of dd pairs dg[n].
function dysonDerivativesDD(gammasDD, direction) {
  const N = gammasDD.length;
  const dg = new Array(N);
  for (let n = 0; n < N; n++) {
    let acc = [0, 0];
    const gn = gammasDD[n];
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = ddAdd(gn, [-gammasDD[k][0], -gammasDD[k][1]]); // gn - gk in dd
      if (Math.abs(diff[0]) < 1e-15) continue;
      // 1/diff in dd: reciprocal of the dd value (use hi as seed, Newton-correct).
      const y0 = 1 / diff[0];
      const [p, pe] = twoProd(diff[0], y0);
      // r = 1 - diff*y0  (diff*y0 = p + pe + diff[1]*y0)
      const r = ((1 - p) - pe) - diff[1] * y0;
      const term = twoSum(y0, y0 * r);
      acc = ddAdd(acc, term);
    }
    dg[n] = ddMulF(acc, direction * 2);
  }
  return dg;
}

// One full DP45 step in double-double, from a dd state, returning dd state.
function dp45StepDD(gammasDD, dt, direction) {
  const N = gammasDD.length;
  const k = [];
  for (let s = 0; s < 7; s++) {
    const y = new Array(N);
    for (let i = 0; i < N; i++) {
      let acc = gammasDD[i];
      for (let j = 0; j < s; j++) {
        acc = ddAdd(acc, ddMulF(k[j][i], dt * A[s][j]));
      }
      y[i] = acc;
    }
    k.push(dysonDerivativesDD(y, direction));
  }
  const result = new Array(N);
  for (let i = 0; i < N; i++) {
    let acc = gammasDD[i];
    for (let s = 0; s < 7; s++) {
      acc = ddAdd(acc, ddMulF(k[s][i], dt * B5[s]));
    }
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

// -- N=2000 setup (matches imp-35235 / imp-35278 / imp-35351 / imp-35416/35452). --
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;
const dtFlow = tauC_est / 1000;
const dt = dtFlow / 2;                          // DP45 dt/2 -- the lone positive cell
const MAX_STEPS = 2150;

console.log(`imp-35490 -- DP45 dt/2 endpoint positivity under compensated/extended precision`);
console.log(`N=${N} tauC_est=${tauC_est} dt=dtFlow/2=${dt.toExponential(6)}`);
console.log(`Tracking endpoint signed gap g_end(step)=y1[argmin+1]-y1[argmin], DP45, direction=-1.\n`);

// -- (1) Full float64 Kahan-Neumaier (COMPENSATED-accumulation) run. --------------
// Reproduce the imp-35452 min positive endpoint gap and capture the float64 state
// ENTERING the argmin step (so the critical step can be redone in double-double).
let gammas = Float64Array.from(initial);
let prev = minSignedGap(gammas);
let minEnd = Infinity, minEndStep = -1, minEndPair = -1;
let stateEnteringArgmin = null;
const t0 = Date.now();
for (let step = 1; step <= MAX_STEPS; step++) {
  const i = prev.index;                         // argmin pair entering this step
  const entering = Float64Array.from(gammas);   // float64 state at step-start
  const next = dp45Step(gammas, dt, -1);
  const gEnd = next[i + 1] - next[i];
  if (gEnd < minEnd) {
    minEnd = gEnd; minEndStep = step; minEndPair = i;
    stateEnteringArgmin = entering;             // save the state feeding the argmin step
  }
  gammas = next;
  prev = minSignedGap(gammas);
}
const t1 = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`[1] float64 Kahan-Neumaier (compensated accumulation), ${t1}s:`);
console.log(`    min endpoint gap = ${minEnd.toExponential(9)}  @ step ${minEndStep}  pair ${minEndPair}`);
console.log(`    sign = ${minEnd > 0 ? 'POSITIVE (endpoint BLIND: within-step step-over)' : 'NON-POSITIVE'}\n`);

// -- (2) Double-double recomputation of the single critical argmin step. ----------
// Feed the identical float64 entering-state (lifted to dd, lo=0) through one DP45
// step in full dd; compare the dd endpoint gap to the float64 gap.
const i = minEndPair;
const enteringDD = Array.from(stateEnteringArgmin, (v) => [v, 0]);
const t2 = Date.now();
const nextDD = dp45StepDD(enteringDD, dt, -1);
const t3 = ((Date.now() - t2) / 1000).toFixed(1);
// dd endpoint gap = nextDD[i+1] - nextDD[i]  (computed in dd, then collapsed).
const gEndDD = ddAdd(nextDD[i + 1], [-nextDD[i][0], -nextDD[i][1]]);
const gEndDDval = gEndDD[0] + gEndDD[1];
// The float64 gap AT the same critical step (recompute for an apples-to-apples pair):
const nextF64 = dp45Step(stateEnteringArgmin, dt, -1);
const gEndF64 = nextF64[i + 1] - nextF64[i];
const delta = gEndDDval - gEndF64;
console.log(`[2] double-double recomputation of the critical step ${minEndStep} (pair ${i}), ${t3}s:`);
console.log(`    float64  endpoint gap = ${gEndF64.toExponential(12)}`);
console.log(`    dd (~106-bit) gap     = ${gEndDDval.toExponential(12)}  [hi=${gEndDD[0].toExponential(6)}, lo=${gEndDD[1].toExponential(3)}]`);
console.log(`    dd - float64 delta    = ${delta.toExponential(6)}  (relative ${(Math.abs(delta) / Math.abs(gEndF64)).toExponential(3)})`);
console.log(`    dd sign = ${gEndDDval > 0 ? 'POSITIVE' : 'NON-POSITIVE'}\n`);

// -- (3) Analytical float64 endpoint-subtraction noise floor. ---------------------
// The endpoint gap g_end = y[i+1] - y[i] is a subtraction of two ~O(1e3) values; its
// float64 representation error is ~ eps*(|y[i+1]|+|y[i]|). Compare to the +gap.
const EPS = Number.EPSILON;                      // 2.220446e-16
const yhi = Math.abs(nextF64[i + 1]);
const ylo = Math.abs(nextF64[i]);
const noiseFloor = EPS * (yhi + ylo);
console.log(`[3] float64 endpoint-subtraction noise floor:`);
console.log(`    |y[i+1]|+|y[i]| = ${(yhi + ylo).toExponential(6)}   eps = ${EPS.toExponential(3)}`);
console.log(`    noise floor eps*(|y[i+1]|+|y[i]|) = ${noiseFloor.toExponential(6)}`);
console.log(`    margin = gap / noiseFloor = ${(minEnd / noiseFloor).toExponential(3)} (orders of magnitude the positivity clears the float64 subtraction floor)\n`);

// -- Verdict. ---------------------------------------------------------------------
const ddConfirms = gEndDDval > 0;
const deltaSmall = Math.abs(delta) < 1e-6 * Math.abs(gEndF64) || Math.abs(delta) < 1e-9;
console.log(`VERDICT: DP45 dt/2 endpoint positivity is ${ddConfirms && deltaSmall ? 'GENUINE' : 'NOT robust'} under compensated/extended precision.`);
console.log(`  - dd critical-step gap ${ddConfirms ? 'stays POSITIVE' : 'FLIPS'}; dd-vs-float64 delta ${deltaSmall ? 'negligible' : 'material'}.`);
console.log(`  - +1.775e-3-scale gap sits ~${Math.round(Math.log10(minEnd / noiseFloor))} decades above the float64 subtraction noise floor.`);
console.log(`  - Residual sub-gap imp-35490a: full-trajectory double-double (all ~${MAX_STEPS} steps in dd) left uncomputed (single-threaded ~hours; native backend).`);
console.log(`  imp-35412 KEEPS the endpoint worst-case; changes no bound; C_mb stays GUE-conditional (imp-486); NO QED.`);
