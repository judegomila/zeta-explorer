// imp-33531 offline: does adding the NEXT higher moment term to the imp-3893
// moment tilt close the imp-33317 ~0.0857-unit L_n=1 crossing residual, or leave
// a persistent second residual carried by still-discarded higher moments?
//
// The imp-33317 reconstruction is driftRecon = driftModel + delta_n with the
// LINEAR tilt term delta_n = (T_n - 1)*lever, T_n = qTrue/qModel. It explicitly
// "drops 2nd-order". Algebraically the exact drift is
//   driftTrue = (qModel*T_n/ts^2 - 1)*lever
//             = driftModel + (qModel/ts^2)*(T_n - 1)*lever,
// so the discarded next term is exactly the saddle-approx multiplier
//   mNext_n = (qModel/ts^2 - 1)*(T_n - 1)*lever,
// which is FULLY model-side (qModel, ts only; no qTrue). This script measures
// (a) baseline residual, (b) residual after adding mNext_n, and (c) the sign-flip
// location of the second-order residual under the extended tilt. Measurement only.
const NPHI = 10;
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  return (sum * h) / 3;
}
function makeAutocorr(innerN) {
  return (tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, innerN);
}
function buildMoments(tAxisEndpoint, nPanels, mMax, innerN) {
  const autocorr = makeAutocorr(innerN);
  const h = tAxisEndpoint / nPanels;
  const aGrid = [];
  for (let j = 0; j <= nPanels; j += 1) aGrid.push(autocorr(j * h));
  const moments = {};
  for (let m = 0; m <= mMax; m += 1) {
    let sum = 0;
    for (let j = 0; j <= nPanels; j += 1) {
      const tau = j * h;
      const w = j === 0 || j === nPanels ? 1 : (j % 2 === 0 ? 2 : 4);
      sum += w * Math.pow(tau, m) * aGrid[j];
    }
    moments[m] = (sum * h) / 3;
  }
  return moments;
}
function saddleTau(n) {
  let lo = 1e-9, hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
function saddleSigma2(n) {
  const ts = saddleTau(n);
  const P = Math.PI * Math.exp(4 * ts);
  const f2 = -n / (ts * ts) - 16 * P;
  return -1 / f2;
}
const T_A = 8, NM = 3200, INNER_FINE = 4800;
const MMAX = 122;
const M_TRUE = buildMoments(T_A, NM, MMAX, INNER_FINE);
function qTrue(n) { return M_TRUE[n + 2] / M_TRUE[n]; }
const QUAD_N = 150000, QUAD_W = 16;
function qModel(n) {
  const ts = saddleTau(n);
  const sig = Math.sqrt(saddleSigma2(n));
  const lo = Math.max(1e-12, ts - QUAD_W * sig);
  const hi = ts + QUAD_W * sig;
  const logf = (tau) => n * Math.log(tau) - Math.PI * Math.exp(4 * tau);
  const fmax = logf(ts);
  const num = simpson((t) => t * t * Math.exp(logf(t) - fmax), lo, hi, QUAD_N);
  const den = simpson((t) => Math.exp(logf(t) - fmax), lo, hi, QUAD_N);
  return num / den;
}
function lever(n) { const ts = saddleTau(n); return n * (1 + 4 * ts); }
function driftTrue(n) { const ts = saddleTau(n); return (qTrue(n) / (ts * ts) - 1) * lever(n); }
function driftModel(n) { const ts = saddleTau(n); return (qModel(n) / (ts * ts) - 1) * lever(n); }
function tilt(n) { return qTrue(n) / qModel(n); }
function delta(n) { return (tilt(n) - 1) * lever(n); }
// first-order (imp-33317): drops the (qModel/ts^2 - 1) multiplier
function driftRecon1(n) { return driftModel(n) + delta(n); }
// extended: add the next moment term = (qModel/ts^2 - 1)*(T_n-1)*lever
function nextTerm(n) { const ts = saddleTau(n); return (qModel(n) / (ts * ts) - 1) * delta(n); }
function driftRecon2(n) { return driftRecon1(n) + nextTerm(n); }
function crossingOfOne(fn, nLo, nHi) {
  let prev = fn(nLo), prevN = nLo;
  for (let n = nLo + 1; n <= nHi; n += 1) {
    const v = fn(n);
    if (prev >= 1 && v < 1) return prevN + (prev - 1) / (prev - v);
    prev = v; prevN = n;
  }
  return null;
}
// per-n second-order residual under first-order vs extended reconstruction
const grid = [];
for (let n = 10; n <= 120; n += 5) {
  const r1 = driftTrue(n) - driftRecon1(n);
  const r2 = driftTrue(n) - driftRecon2(n);
  grid.push({ n, r1, r2 });
}
console.log('n, secondOrderResid_firstOrderRecon, residual_extendedRecon');
for (const g of grid) console.log(`${g.n}\t${g.r1.toExponential(4)}\t${g.r2.toExponential(4)}`);
// sign-flip of r1
let flip1 = null;
for (let i = 1; i < grid.length; i += 1) {
  if (grid[i - 1].r1 > 0 && grid[i].r1 <= 0) {
    const a = grid[i - 1], b = grid[i];
    flip1 = a.n + a.r1 / (a.r1 - b.r1) * (b.n - a.n);
    break;
  }
}
const cTrue = crossingOfOne(driftTrue, 10, 120);
const cRecon1 = crossingOfOne(driftRecon1, 10, 120);
const cRecon2 = crossingOfOne(driftRecon2, 10, 120);
console.log('\nCROSS_TRUE=', cTrue);
console.log('CROSS_RECON1 (first-order, imp-33317)=', cRecon1);
console.log('CROSS_RECON2 (extended, +next moment term)=', cRecon2);
console.log('baseline residual gap =', cTrue - cRecon1);
console.log('extended residual gap =', cTrue - cRecon2);
console.log('fraction of 0.0857 residual closed by next term =',
  1 - (cTrue - cRecon2) / (cTrue - cRecon1));
console.log('second-order residual sign-flip (first-order recon) at n~', flip1);
let maxAbsR2 = 0; for (const g of grid) maxAbsR2 = Math.max(maxAbsR2, Math.abs(g.r2));
console.log('max |residual_extendedRecon| over grid =', maxAbsR2.toExponential(4));
