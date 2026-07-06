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
  const N_cf = crossoverFixedPoint(thr, seed, 200);
  const N_emp = crossBelowSigma(thr, 1e6, 1e20);
  const N_wf = crossoverFixedPointWithFlow(thr, seed, 300);
  const rel_offset = (N_cf - N_emp) / N_cf;
  const p = parts(N_emp);
  const r = p.E_flow / E_TRUNC_PT;
  const coupling = rel_offset / r;
  return { thr, K_THR, N_cf, N_emp, N_wf, rel_offset, r, coupling,
           wf_vs_emp: Math.abs(N_wf - N_emp) / N_emp };
}

const L05 = landmark(0.5, 3e9);
const L01 = landmark(0.1, 3e11);
const L001 = landmark(0.01, 5e13);
const L0001 = landmark(0.001, 5e15);

for (const [name, L] of [['thr=0.5', L05], ['thr=0.1', L01], ['thr=0.01', L001], ['thr=0.001', L0001]]) {
  console.log(name.padEnd(11),
    'N_cf=' + L.N_cf.toExponential(6),
    'rel=' + L.rel_offset.toExponential(4),
    'r=' + L.r.toExponential(4),
    'coupling=' + L.coupling.toFixed(6),
    'wf_vs_emp=' + L.wf_vs_emp.toExponential(2));
}

// per-step drift of the coupling ratio (percent, downward positive)
const seq = [L05, L01, L001, L0001];
const labels = ['0.5', '0.1', '0.01', '0.001'];
console.log('\n-- per-landmark-step coupling-ratio drift --');
for (let i = 1; i < seq.length; i++) {
  const prev = seq[i - 1].coupling, cur = seq[i].coupling;
  const driftPct = ((prev - cur) / prev) * 100;
  console.log(`${labels[i-1]} -> ${labels[i]}: drift ${driftPct.toFixed(4)}%  (abs ${(prev-cur).toExponential(4)})  r x ${(seq[i-1].r/seq[i].r).toFixed(2)}`);
}

// contraction + wf closure at the new ultra-deep landmark
const thr = 0.001;
const K_THR = ((1 - thr) / thr) ** 2 * K_AMPL;
const Nr = L0001.N_cf;
const h = Nr * 1e-6;
const G = (x) => K_THR * Math.log(effectiveHeightForN(x));
const contraction = Math.abs((G(Nr + h) - G(Nr - h)) / (2 * h));
console.log('\nthr=0.001 K_THR=' + K_THR.toExponential(6), 'contraction=' + contraction.toExponential(4),
  'K_ratio_to_halving=' + (K_THR / K_AMPL).toFixed(1), 'wf_vs_emp=' + L0001.wf_vs_emp.toExponential(3),
  'N_wf=' + L0001.N_wf.toExponential(6));
