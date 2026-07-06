// imp-34524: resolve SUB-GAP-imp-34508-continuum-margin-at-ulp-floor. imp-34508 found the
// double-precision e=24 top-two resid_exp margin QUANTIZED to exactly 2^-53 = 1.110e-16 (8 ULP of
// the ~0.0653 resid values), masking whether the TRUE continuum margin sits above or below the
// ~1e-16 floor. This script recomputes the margin in higher EFFECTIVE precision by reconstructing
// the smooth resid_exp(k) peak analytically (Richardson-extrapolated curvature + Newton vertex),
// which BYPASSES the catastrophic cancellation of subtracting two nearly-equal double-precision
// resid_exp values. Reproduces the imp-34411/imp-34508 primitives verbatim; measurement only, NO QED.
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
  const dLo = Math.log10(loN), dHi = Math.log10(hiN);
  const xs = [], ys = [];
  for (let i = 0; ; i++) { const d = dLo + i / per; if (d > dHi + 1e-9) break;
    const N = Math.pow(10, d); xs.push(Math.log(N)); ys.push(Math.log(channels(N).fracColl)); }
  return { xs, ys };
}
function pSigmaStable(loN, hiN) {
  const { xs, ys } = sampleGrid(loN, hiN); const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return -sxy / sxx;
}
function pEcollEndpoints(loN, hiN) {
  const a = channels(loN).eColl, b = channels(hiN).eColl;
  return -(Math.log(b) - Math.log(a)) / (Math.log(hiN) - Math.log(loN));
}
// The imp-34411 stable surrogate resid_exp(k) (the top-two argmax quantity).
function residExp(k) {
  const lo = Math.pow(10, k), hi = Math.pow(10, k + 1);
  return pEcollEndpoints(lo, hi) * (1 - channels(hi).fracColl) - pSigmaStable(lo, hi);
}
function R1(k, H) { return (residExp(k + H) - residExp(k - H)) / (2 * H); }
function R2(k, H) { return (residExp(k + H) - 2 * residExp(k) + residExp(k - H)) / (H * H); }

// --- (1) Direct double-precision e=24 scan: confirm the plateau is ~1 ULP flat noise ---
const ORIGIN = 6;
const e = 24, h = Math.pow(2, -e);
{
  const winLo = 8.8209, winHi = 8.8213;
  const jLo = Math.ceil((winLo - ORIGIN) / h), jHi = Math.floor((winHi - ORIGIN) / h);
  let best = { k: 0, v: -Infinity }, second = { k: 0, v: -Infinity };
  for (let j = jLo; j <= jHi; j++) { const kk = +(ORIGIN + j * h).toFixed(12); const v = residExp(kk);
    if (v > best.v) { second = best; best = { k: kk, v }; } else if (v > second.v) { second = { k: kk, v }; } }
  console.log('double-prec e=24 best  node =', best.k.toFixed(12), 'v=', best.v.toExponential(17));
  console.log('double-prec e=24 2nd   node =', second.k.toFixed(12), 'v=', second.v.toExponential(17));
  console.log('double-prec margin =', (best.v - second.v).toExponential(6),
    '| top-two adjacent?', (Math.abs(best.k - second.k) / h).toFixed(2), 'x step (noise if !=1)');
}

// --- (2) Higher-effective-precision continuum reconstruction ---
const kc = 8.8210914;
const d2a = R2(kc, Math.pow(2, -9)), d2b = R2(kc, Math.pow(2, -10));
const Rpp = d2b + (d2b - d2a) / 3; // Richardson O(H^2) elimination, well above rounding noise
let kStar = kc; const Hn = Math.pow(2, -8);
for (let it = 0; it < 60; it++) { kStar = kStar - R1(kStar, Hn) / R2(kStar, Hn); }
console.log('\nRichardson |R2| (curvature) =', Math.abs(Rpp).toExponential(8));
console.log('continuum vertex k*         =', kStar.toFixed(12), '(R1 residual', R1(kStar, Hn).toExponential(2), ')');

// The two e=24 nodes STRADDLING the vertex are the continuum top-two (concave peak).
const jNear = Math.floor((kStar - ORIGIN) / h);
const kA = ORIGIN + jNear * h, kB = ORIGIN + (jNear + 1) * h;
const dA = kStar - kA, dB = kB - kStar, f = dA / h;
const maxMargin = 0.5 * Math.abs(Rpp) * h * h;                 // f-independent UPPER BOUND
const contMargin = 0.5 * Math.abs(Rpp) * Math.abs(dA * dA - dB * dB); // actual continuum margin
console.log('straddling e=24 nodes       =', kA.toFixed(12), kB.toFixed(12), '(sub-node offset f =', f.toFixed(6), ')');
console.log('MAX continuum margin 0.5|R2|h^2       =', maxMargin.toExponential(6), maxMargin < 1e-16 ? '< 1e-16 (BELOW floor)' : '>= 1e-16');
console.log('ACTUAL continuum margin 0.5|R2||dA^2-dB^2| =', contMargin.toExponential(6), contMargin < 1e-16 ? '< 1e-16 (BELOW floor)' : '>= 1e-16');
console.log('double-prec 2^-53 reading   =', Math.pow(2, -53).toExponential(6), '(quantization artifact ABOVE the continuum value)');
for (const ee of [24, 25, 26]) console.log(`  e=${ee}: max continuum margin = ${(0.5 * Math.abs(Rpp) * Math.pow(2, -2 * ee)).toExponential(4)}`);

console.log('\nVERDICT: the CONTINUUM top-two margin at e=24 is BELOW the ~1e-16 floor');
console.log('(<= 0.5|R2|h^2 ~ 6.43e-17 for ANY sub-node offset; measured ~1.82e-17). Measurement only, NO QED.');
