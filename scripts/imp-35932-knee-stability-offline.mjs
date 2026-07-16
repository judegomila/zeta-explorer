// imp-35932 offline: measure stability of the three imp-35853 knee locators under
// (a) sigma-grid refinement (halving spacing) and (b) chord-endpoint / smoothing choice.
// Replicates the EXACT imp-35853 sub-terms; measurement only, changes no bound.

const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643
const LOG_T0_NEEDED = 200; // imp-35538 REQ-4 binding log-height
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L };
}
const sigma = (N) => parts(N).sigma;

function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();
const SIGMA_MAX = sigma(N_PEAK);

function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const LOG_T0_PT = Math.log(3e12);
function nForLogT0(target) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e30);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).logT0 < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PT = nForLogT0(LOG_T0_PT);
const SIGMA_PT = sigma(N_PT);
const MULT_PT = LOG_T0_NEEDED / LOG_T0_PT;

function buildCurve(sHi, sLo, gridN) {
  const c = [];
  for (let i = 0; i <= gridN; i++) {
    const s = sHi + (sLo - sHi) * (i / gridN);
    const N = crossBelow(s);
    const L = parts(N).logT0;
    c.push({ sigma: s, logT0: L, multiple: LOG_T0_NEEDED / L });
  }
  return c;
}

// (A) Kneedle elbow: max |y - x| after normalising endpoints to (0,0)-(1,1).
function kneedle(curve) {
  const s0 = curve[0].sigma;
  const s1 = curve[curve.length - 1].sigma;
  const m0 = curve[0].multiple;
  const m1 = curve[curve.length - 1].multiple;
  let bestDist = -1;
  let idx = 0;
  for (let i = 0; i < curve.length; i++) {
    const x = (curve[i].sigma - s0) / (s1 - s0);
    const y = (curve[i].multiple - m0) / (m1 - m0);
    const d = Math.abs(y - x);
    if (d > bestDist) {
      bestDist = d;
      idx = i;
    }
  }
  return curve[idx].sigma;
}

// (B) Flattest point: min |dm/ds| with a symmetric k-point stencil (k=1 => raw).
function flattest(curve, k) {
  let minSlope = Infinity;
  let idx = k;
  for (let i = k; i < curve.length - k; i++) {
    const ds = curve[i + k].sigma - curve[i - k].sigma;
    const dm = curve[i + k].multiple - curve[i - k].multiple;
    const slope = Math.abs(dm / ds);
    if (slope < minSlope) {
      minSlope = slope;
      idx = i;
    }
  }
  return curve[idx].sigma;
}

// (C) PT-anchor approach: first sigma with multiple within frac of MULT_PT.
function firstWithin(curve, frac) {
  const row = curve.find((g) => g.multiple <= MULT_PT * (1 + frac));
  return row ? row.sigma : NaN;
}

console.log('peak N', N_PEAK.toExponential(3), 'SIGMA_MAX', SIGMA_MAX.toFixed(6), 'SIGMA_PT', SIGMA_PT.toFixed(5), 'MULT_PT', MULT_PT.toFixed(4));

// Grid refinement at fixed endpoints [0.94, SIGMA_PT].
console.log('\n== grid refinement (endpoints 0.94..SIGMA_PT) ==');
const grids = [400, 800, 1600, 3200];
const kn = [], fl = [], p5 = [], p10 = [];
for (const g of grids) {
  const cur = buildCurve(0.94, SIGMA_PT, g);
  const K = kneedle(cur), F = flattest(cur, 1), W5 = firstWithin(cur, 0.05), W10 = firstWithin(cur, 0.1);
  kn.push(K); fl.push(F); p5.push(W5); p10.push(W10);
  console.log(`gridN=${g}: kneedle=${K.toFixed(4)} flattest=${F.toFixed(4)} within10%=${W10.toFixed(4)} within5%=${W5.toFixed(4)}`);
}
const rng = (a) => Math.max(...a) - Math.min(...a);
console.log(`grid-move range: kneedle=${rng(kn).toFixed(4)} flattest=${rng(fl).toFixed(4)} within10%=${rng(p10).toFixed(4)} within5%=${rng(p5).toFixed(4)}`);

// Chord-endpoint variation (gridN=800), Kneedle & flattest sensitivity.
console.log('\n== endpoint variation (gridN=800) ==');
const sHis = [0.90, 0.92, 0.94, +SIGMA_MAX.toFixed(4)];
const sLos = [+SIGMA_PT.toFixed(5), 0.05, 0.10];
const knE = [], flE = [], p5E = [], p10E = [];
for (const sHi of sHis) {
  for (const sLo of sLos) {
    if (sLo >= sHi) continue;
    const cur = buildCurve(sHi, sLo, 800);
    const K = kneedle(cur), F = flattest(cur, 1), W5 = firstWithin(cur, 0.05), W10 = firstWithin(cur, 0.1);
    knE.push(K); flE.push(F); if (!Number.isNaN(W5)) p5E.push(W5); if (!Number.isNaN(W10)) p10E.push(W10);
    console.log(`[${sHi},${sLo}]: kneedle=${K.toFixed(4)} flattest=${F.toFixed(4)} within10%=${Number.isNaN(W10)?'--':W10.toFixed(4)} within5%=${Number.isNaN(W5)?'--':W5.toFixed(4)}`);
  }
}
console.log(`endpoint-move range: kneedle=${rng(knE).toFixed(4)} flattest=${rng(flE).toFixed(4)} within10%=${rng(p10E).toFixed(4)} within5%=${rng(p5E).toFixed(4)}`);

// Smoothing variation on flattest point (gridN=1600, stencil k=1,2,4,8,16).
console.log('\n== flattest smoothing (gridN=1600, endpoints 0.94..SIGMA_PT) ==');
const cur16 = buildCurve(0.94, SIGMA_PT, 1600);
const flS = [];
for (const k of [1, 2, 4, 8, 16]) {
  const F = flattest(cur16, k);
  flS.push(F);
  console.log(`stencil k=${k}: flattest=${F.toFixed(4)}`);
}
console.log(`smoothing-move range: flattest=${rng(flS).toFixed(4)}`);

// Overall span across ALL variations for each locator.
console.log('\n== overall min/max sigma across all variations ==');
const allKn = kn.concat(knE), allFl = fl.concat(flE, flS), allP5 = p5.concat(p5E), allP10 = p10.concat(p10E);
const fmt = (a) => `[${Math.min(...a).toFixed(4)}, ${Math.max(...a).toFixed(4)}] range=${rng(a).toFixed(4)} rel=${(rng(a)/(a.reduce((x,y)=>x+y,0)/a.length)*100).toFixed(1)}%`;
console.log('kneedle   ', fmt(allKn));
console.log('flattest  ', fmt(allFl));
console.log('within10% ', fmt(allP10));
console.log('within5%  ', fmt(allP5));
