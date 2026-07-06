// Offline: bisect the imp-34413 / imp-34247 pole-leakage metric leak(k) to the 3% and 8% crossings.
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
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;
function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return sxy / sxx;
}
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade; const xs = []; const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d); xs.push(Math.log(N)); ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function residExpAtK(k) {
  const lo = Math.pow(10, k); const hi = Math.pow(10, k + 1);
  return ecollExponentMag(lo, hi) * (1 - parts(hi).sigma) - olsSigmaExponent(lo, hi);
}
function yAtK(k) {
  const lo = Math.pow(10, k); const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi); const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return Math.log(eflowAttr / residExp);
}
function localSlope(k, h) { return (yAtK(k + h) - yAtK(k - h)) / (2 * h); }
function stepFor(k, kStar) { return Math.min(0.005, (kStar - k) / 4); }

let clo = 21.0, chi = 21.5;
for (let it = 0; it < 80; it++) { const mid = 0.5 * (clo + chi); if (residExpAtK(mid) > 0) clo = mid; else chi = mid; }
const K_STAR = 0.5 * (clo + chi);
const PLATEAU = localSlope(14, stepFor(14, K_STAR));
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

function bisectCrossing(target, a, b) {
  for (let it = 0; it < 100; it++) { const m = 0.5 * (a + b); if (leakPct(m) < target) a = m; else b = m; }
  return 0.5 * (a + b);
}
const K1 = bisectCrossing(1.0, 17.8, 19.0);
const K3 = bisectCrossing(3.0, 18.1, 19.5);
const K8 = bisectCrossing(8.0, 18.5, 20.0);
console.log('K_STAR', K_STAR.toFixed(6));
console.log('PLATEAU', PLATEAU.toFixed(6));
console.log('leak(18.5)', leakPct(18.5).toFixed(5), 'leak(19)', leakPct(19).toFixed(5));
console.log('K1 (1%)', K1.toFixed(6), 'leak', leakPct(K1).toFixed(5));
console.log('K3 (3%)', K3.toFixed(6), 'leak', leakPct(K3).toFixed(5));
console.log('K8 (8%)', K8.toFixed(6), 'leak', leakPct(K8).toFixed(5));
console.log('K3-K1', (K3 - K1).toFixed(4), 'K8-K3', (K8 - K3).toFixed(4));
console.log('K_STAR-K8', (K_STAR - K8).toFixed(4));
