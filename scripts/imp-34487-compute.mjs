// imp-34487 -- add a FIFTH ultra-deep thr=0.0001 crossover landmark below the imp-34447
// thr=0.001 point and fit the coupling-ratio excess-above-2 sequence to a 1/logT0 decay
// law to locate the finite limit the imp-34447 turnover is converging to (~2.05).
// Reuses the identical imp-34447 machinery (scripts/imp-34447-compute.mjs).
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;

function crossoverFixedPoint(thr, seed, iters) {
  const K_THR = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_THR * Math.log(effectiveHeightForN(N));
  return N;
}
function crossBelowSigma(thr, lo, hi) {
  let a = Math.log(lo), b = Math.log(hi);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > thr) a = m; else b = m;
  }
  return Math.exp((a + b) / 2);
}
function crossoverFixedPointWithFlow(thr, seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) {
    const rhs = (thr / (1 - thr)) * (E_TRUNC_PT + parts(N).E_flow);
    N = (C_C_PINNED / rhs) ** 2 * Math.log(effectiveHeightForN(N));
  }
  return N;
}

function landmark(thr, seed) {
  const K_THR = ((1 - thr) / thr) ** 2 * K_AMPL;
  const N_cf = crossoverFixedPoint(thr, seed, 300);
  const N_emp = crossBelowSigma(thr, 1e6, 1e22);
  const N_wf = crossoverFixedPointWithFlow(thr, seed, 400);
  const rel_offset = (N_cf - N_emp) / N_cf;
  const p = parts(N_emp);
  const r = p.E_flow / E_TRUNC_PT;
  const coupling = rel_offset / r;
  const h = N_cf * 1e-6;
  const G = (x) => K_THR * Math.log(effectiveHeightForN(x));
  const contraction = Math.abs((G(N_cf + h) - G(N_cf - h)) / (2 * h));
  return { thr, K_THR, N_cf, N_emp, N_wf, rel_offset, r, coupling,
           logT0: p.L, wf_vs_emp: Math.abs(N_wf - N_emp) / N_emp, contraction };
}

const L05 = landmark(0.5, 3e9);
const L01 = landmark(0.1, 3e11);
const L001 = landmark(0.01, 5e13);
const L0001 = landmark(0.001, 5e15);
const L00001 = landmark(0.0001, 5e17); // NEW fifth ultra-deep landmark

const seq = [L05, L01, L001, L0001, L00001];
const labels = ['0.5', '0.1', '0.01', '0.001', '0.0001'];

for (let i = 0; i < seq.length; i++) {
  const L = seq[i];
  console.log(('thr=' + labels[i]).padEnd(13),
    'N_cf=' + L.N_cf.toExponential(6),
    'logT0=' + L.logT0.toFixed(4),
    'rel=' + L.rel_offset.toExponential(4),
    'r=' + L.r.toExponential(4),
    'coupling=' + L.coupling.toFixed(6),
    'excess=' + (L.coupling - 2).toFixed(6),
    'contr=' + L.contraction.toExponential(3),
    'wf=' + L.wf_vs_emp.toExponential(2));
}

console.log('\n-- per-landmark-step coupling-ratio drift --');
for (let i = 1; i < seq.length; i++) {
  const prev = seq[i - 1].coupling, cur = seq[i].coupling;
  const driftPct = ((prev - cur) / prev) * 100;
  console.log(`${labels[i-1]} -> ${labels[i]}: drift ${driftPct.toFixed(4)}%  (excess drop ${(prev-cur).toExponential(4)})  r x ${(seq[i-1].r/seq[i].r).toFixed(2)}  rel x ${(seq[i-1].rel_offset/seq[i].rel_offset).toFixed(2)}`);
}

// ---- 1/logT0 decay fit of the excess-above-2 sequence ----
// Model: excess(x) = c0 + c1 * x with x = 1/logT0.  Limit as x->0 (N->inf) is c0.
// The coupling-ratio finite limit is then L_inf = 2 + c0.
const xs = seq.map((L) => 1 / L.logT0);
const ys = seq.map((L) => L.coupling - 2);

function linfit(xa, ya) {
  const n = xa.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sx += xa[i]; sy += ya[i]; sxx += xa[i] * xa[i]; sxy += xa[i] * ya[i]; }
  const d = n * sxx - sx * sx;
  const c1 = (n * sxy - sx * sy) / d;
  const c0 = (sy - c1 * sx) / n;
  // residuals + R^2
  let ssr = 0, sst = 0; const ym = sy / n;
  for (let i = 0; i < n; i++) { const f = c0 + c1 * xa[i]; ssr += (ya[i] - f) ** 2; sst += (ya[i] - ym) ** 2; }
  return { c0, c1, r2: 1 - ssr / sst, ssr };
}

const fitAll = linfit(xs, ys);
console.log('\n-- 1/logT0 decay fit  excess = c0 + c1*(1/logT0)  (all 5 points) --');
console.log('c0 (excess limit)=' + fitAll.c0.toFixed(6), 'c1=' + fitAll.c1.toFixed(6),
  'R^2=' + fitAll.r2.toFixed(6), '-> L_inf = 2 + c0 = ' + (2 + fitAll.c0).toFixed(6));

// leave-one-out on the shallowest point to gauge stability of the limit
const fitDeep4 = linfit(xs.slice(1), ys.slice(1));
console.log('deep-4 (drop thr=0.5): c0=' + fitDeep4.c0.toFixed(6), 'c1=' + fitDeep4.c1.toFixed(6),
  'R^2=' + fitDeep4.r2.toFixed(6), '-> L_inf = ' + (2 + fitDeep4.c0).toFixed(6));
const fitDeep3 = linfit(xs.slice(2), ys.slice(2));
console.log('deep-3 (thr<=0.01):   c0=' + fitDeep3.c0.toFixed(6), 'c1=' + fitDeep3.c1.toFixed(6),
  'R^2=' + fitDeep3.r2.toFixed(6), '-> L_inf = ' + (2 + fitDeep3.c0).toFixed(6));

// limit uncertainty band from the three fits
const limits = [2 + fitAll.c0, 2 + fitDeep4.c0, 2 + fitDeep3.c0];
console.log('\nL_inf band across {all5, deep4, deep3} = [' +
  Math.min(...limits).toFixed(6) + ', ' + Math.max(...limits).toFixed(6) + '], midpoint ' +
  ((Math.min(...limits) + Math.max(...limits)) / 2).toFixed(6));

// two-term fit  excess = c0 + c1*x + c2*x^2  (x=1/logT0) to test curvature of the limit
function quadfit(xa, ya) {
  const n = xa.length;
  // normal equations for [c0,c1,c2]
  let S0 = n, S1 = 0, S2 = 0, S3 = 0, S4 = 0, T0 = 0, T1 = 0, T2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xa[i], y = ya[i];
    S1 += x; S2 += x * x; S3 += x ** 3; S4 += x ** 4;
    T0 += y; T1 += x * y; T2 += x * x * y;
  }
  // solve 3x3 via Cramer
  const A = [[S0, S1, S2], [S1, S2, S3], [S2, S3, S4]];
  const b = [T0, T1, T2];
  const det = (m) => m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1]) - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0]) + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
  const D = det(A);
  const rep = (col) => A.map((row, r) => row.map((v, c) => (c === col ? b[r] : v)));
  return { c0: det(rep(0)) / D, c1: det(rep(1)) / D, c2: det(rep(2)) / D };
}
const q = quadfit(xs, ys);
console.log('\n-- two-term fit  excess = c0 + c1/logT0 + c2/logT0^2  (all 5 points) --');
console.log('c0=' + q.c0.toFixed(6), 'c1=' + q.c1.toFixed(6), 'c2=' + q.c2.toFixed(6),
  '-> L_inf = 2 + c0 = ' + (2 + q.c0).toFixed(6));

// new landmark amplitude / K ratio
console.log('\nthr=0.0001 K_THR=' + L00001.K_THR.toExponential(6),
  'amplitude ((1-thr)/thr)^2=' + Math.round(((1 - 0.0001) / 0.0001) ** 2),
  'K_ratio_to_halving=' + (L00001.K_THR / K_AMPL).toFixed(1));
