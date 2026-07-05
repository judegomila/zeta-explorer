// imp-33945 offline: characterize the k*(argmax) vs k_cross(crossover) ~0.695-decade gap and its grid-stability.
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const LN10 = Math.log(10);

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_flow, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [], ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return ecollExponentMag(lo, hi) * (1 - parts(hi).sigma) - olsSigmaExponent(lo, hi);
}

// Continuum argmax via ternary
function ternaryArgmax(lo, hi) {
  for (let i = 0; i < 200; i++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1; else hi = m2;
  }
  return (lo + hi) / 2;
}
const K_STAR = ternaryArgmax(8, 10);

// Raw + parabolic grid argmax at a given step
function gridRung(h) {
  const ks = [];
  for (let k = 6; k <= 11 + 1e-9; k += h) ks.push(+k.toFixed(10));
  let pi = 0, pv = -Infinity;
  for (let i = 0; i < ks.length; i++) { const v = residExp(ks[i]); if (v > pv) { pv = v; pi = i; } }
  const kPeak = ks[pi];
  const fL = residExp(ks[pi - 1]), f0 = pv, fR = residExp(ks[pi + 1]);
  const denom = fL - 2 * f0 + fR;
  const delta = denom !== 0 ? (0.5 * (fL - fR)) / denom : 0;
  return { raw: kPeak, parab: kPeak + delta * h };
}

// k_cross = E_coll = E_trunc crossover (sigma = 1/2), grid-INDEPENDENT root via bisection.
function crossoverN() {
  let a = 1e8, b = 1e11;
  for (let i = 0; i < 200; i++) {
    const m = Math.sqrt(a * b);
    if (parts(m).E_coll > E_TRUNC_PT) a = m; else b = m;
  }
  return Math.sqrt(a * b);
}
const N_CROSS = crossoverN();
const K_CROSS = Math.log10(N_CROSS);

console.log('=== continuum references ===');
console.log('K_STAR (ternary argmax) =', K_STAR.toFixed(6));
console.log('K_CROSS (E_coll=E_trunc, sigma=1/2) =', K_CROSS.toFixed(6));
console.log('sigma(N_cross) =', sigma(N_CROSS).toFixed(6));
console.log('gap = K_CROSS - K_STAR =', (K_CROSS - K_STAR).toFixed(6));
console.log('sigma at k* =', sigma(Math.pow(10, K_STAR)).toFixed(6));
console.log('resid_exp(k*) =', residExp(K_STAR).toExponential(6));
console.log('resid_exp(k_cross) =', residExp(K_CROSS).toExponential(6));

console.log('\n=== grid ladder: k* (raw / parabolic) and gap = k_cross - k* ===');
for (const h of [0.25, 0.125, 0.0625]) {
  const { raw, parab } = gridRung(h);
  console.log(`h=${h}: raw=${raw.toFixed(6)} gapRaw=${(K_CROSS - raw).toFixed(6)}  parab=${parab.toFixed(6)} gapParab=${(K_CROSS - parab).toFixed(6)}`);
}

// Is the parabolic gap grid-stable? Spread across the three steps.
const gapsParab = [0.25, 0.125, 0.0625].map((h) => K_CROSS - gridRung(h).parab);
console.log('\nparabolic gap spread (max-min) =', (Math.max(...gapsParab) - Math.min(...gapsParab)).toExponential(3));
const gapsRaw = [0.25, 0.125, 0.0625].map((h) => K_CROSS - gridRung(h).raw);
console.log('raw gap spread (max-min) =', (Math.max(...gapsRaw) - Math.min(...gapsRaw)).toExponential(3));

// Structural: resid_exp is p_ecoll(1-sigma) - p_sigma; at k_cross sigma=1/2. What shifts argmax below?
// Check the (1-sigma) weighting effect: locate where p_ecoll*(1-sigma) alone peaks (drop p_sigma).
function residNoSigmaSub(k) {
  const lo = Math.pow(10, k), hi = Math.pow(10, k + 1);
  return ecollExponentMag(lo, hi) * (1 - parts(hi).sigma);
}
function ternaryOf(f, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) lo = m1; else hi = m2;
  }
  return (lo + hi) / 2;
}
console.log('\nargmax of p_ecoll*(1-sigma) alone (no p_sigma) =', ternaryOf(residNoSigmaSub, 8, 11).toFixed(6));
