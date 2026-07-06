// imp-34508: directly compute the imp-34411 top-two resid_exp margin at rungs e=23, e=24
// to CONFIRM/REFUTE the imp-34472 extrapolated ULP-floor crossing (fitted ~2.50e-16 at e=23,
// ~6.62e-17 at e=24). Reproduces the imp-34411 primitives verbatim; DEEP_EXPONENTS = [23, 24].
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5;
const A1_TRAP = 2.37e-4;
const GRONWALL_B = Math.exp(1.0 * A1_TRAP);

function channels(N) {
  const T0 = effectiveHeightForN(N);
  const logT0 = Math.log(T0);
  const cFlow = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const eFlow = cFlow * (logT0 / T0) * GRONWALL_B;
  const eColl = C_C_PINNED * Math.sqrt(logT0 / N);
  const eTot = E_TRUNC + eFlow + eColl;
  return { eColl, eTot, fracColl: eColl / eTot };
}

function sampleGrid(loN, hiN, per = 4) {
  const dLo = Math.log10(loN);
  const dHi = Math.log10(hiN);
  const xs = [];
  const ys = [];
  for (let i = 0; ; i++) {
    const d = dLo + i / per;
    if (d > dHi + 1e-9) break;
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(channels(N).fracColl));
  }
  return { xs, ys };
}

function pSigmaStable(loN, hiN) {
  const { xs, ys } = sampleGrid(loN, hiN);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

function pSigmaRawMoments(loN, hiN) {
  const { xs, ys } = sampleGrid(loN, hiN);
  let Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
  const m = xs.length;
  for (let i = 0; i < m; i++) {
    Sx += xs[i]; Sy += ys[i]; Sxx += xs[i] * xs[i]; Sxy += xs[i] * ys[i];
  }
  return -(m * Sxy - Sx * Sy) / (m * Sxx - Sx * Sx);
}

function kahanSum(arr) {
  let sum = 0, c = 0;
  for (let i = 0; i < arr.length; i++) {
    const y = arr[i] - c;
    const t = sum + y;
    c = t - sum - y;
    sum = t;
  }
  return sum;
}

function pSigmaKahan(loN, hiN) {
  const { xs, ys } = sampleGrid(loN, hiN);
  const n = xs.length;
  const mx = kahanSum(xs) / n;
  const my = kahanSum(ys) / n;
  const dxx = [], dxy = [];
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    dxx.push(dx * dx);
    dxy.push(dx * (ys[i] - my));
  }
  return -kahanSum(dxy) / kahanSum(dxx);
}

function pEcollEndpoints(loN, hiN) {
  const a = channels(loN).eColl;
  const b = channels(hiN).eColl;
  return -(Math.log(b) - Math.log(a)) / (Math.log(hiN) - Math.log(loN));
}

function residExp(k, pSigmaFn) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSig = pSigmaFn(lo, hi);
  const pEc = pEcollEndpoints(lo, hi);
  const sigHi = channels(hi).fracColl;
  return pEc * (1 - sigHi) - pSig;
}

const ORIGIN = 6;
const WIN_LO = 8.72;
const WIN_HI = 8.94;

function topTwo(exponent, pSigmaFn) {
  const step = 1 / Math.pow(2, exponent);
  const jLo = Math.ceil((WIN_LO - ORIGIN) / step);
  const jHi = Math.floor((WIN_HI - ORIGIN) / step);
  let best = { k: ORIGIN + jLo * step, v: -Infinity };
  let second = { k: null, v: -Infinity };
  for (let j = jLo; j <= jHi; j++) {
    const kk = +(ORIGIN + j * step).toFixed(10);
    const v = residExp(kk, pSigmaFn);
    if (v > best.v) { second = best; best = { k: kk, v }; }
    else if (v > second.v) { second = { k: kk, v }; }
  }
  return { best, second, step };
}

function measureRung(e) {
  const s = topTwo(e, pSigmaStable);
  const r = topTwo(e, pSigmaRawMoments);
  const kh = topTwo(e, pSigmaKahan);
  const stableK = +s.best.k.toFixed(12);
  const rawK = +r.best.k.toFixed(12);
  const kahanK = +kh.best.k.toFixed(12);
  const lo = Math.pow(10, s.best.k);
  const hi = Math.pow(10, s.best.k + 1);
  const rawPert = Math.abs(pSigmaStable(lo, hi) - pSigmaRawMoments(lo, hi));
  const kahanPert = Math.abs(pSigmaStable(lo, hi) - pSigmaKahan(lo, hi));
  const marginStable = s.best.v - s.second.v;
  return { exponent: e, step: kh.step, stableTopK: stableK, rawMomentTopK: rawK, kahanTopK: kahanK,
    marginStable, rawPert, kahanPert, classification: (kahanK === stableK && kahanK !== rawK) ? 'rescues-stable' : (kahanK === rawK && kahanK !== stableK ? 'confirms-flip' : 'undecided') };
}

for (const e of [23, 24]) {
  const t0 = process.hrtime.bigint();
  const m = measureRung(e);
  const dt = Number(process.hrtime.bigint() - t0) / 1e9;
  console.log(`e=${e} (${dt.toFixed(1)}s):`);
  console.log(`  stableTopK   = ${m.stableTopK}`);
  console.log(`  rawMomentTopK= ${m.rawMomentTopK}`);
  console.log(`  kahanTopK    = ${m.kahanTopK}`);
  console.log(`  marginStable = ${m.marginStable.toExponential(6)}`);
  console.log(`  rawPert      = ${m.rawPert.toExponential(6)}`);
  console.log(`  kahanPert    = ${m.kahanPert.toExponential(6)}`);
  console.log(`  classification = ${m.classification}`);
}
