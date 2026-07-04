// imp-33317 offline: does the imp-3893 moment tilt T_n close the ~30-unit L_n=1
// crossing gap? Reuse the imp-3893 machinery verbatim on a finer/deeper n grid.
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
const MMAX = 122; // support n up to 120
const M_TRUE = buildMoments(T_A, NM, MMAX, INNER_FINE);
function qTrue(n) { return M_TRUE[n + 2] / M_TRUE[n]; }
function qModel(n, quadN, widthSigma) {
  const ts = saddleTau(n);
  const sig = Math.sqrt(saddleSigma2(n));
  const lo = Math.max(1e-12, ts - widthSigma * sig);
  const hi = ts + widthSigma * sig;
  const logf = (tau) => n * Math.log(tau) - Math.PI * Math.exp(4 * tau);
  const fmax = logf(ts);
  const num = simpson((t) => t * t * Math.exp(logf(t) - fmax), lo, hi, quadN);
  const den = simpson((t) => Math.exp(logf(t) - fmax), lo, hi, quadN);
  return num / den;
}
const QUAD_N = 150000, QUAD_W = 16;
function driftTrue(n) { const ts = saddleTau(n); return (qTrue(n) / (ts * ts) - 1) * n * (1 + 4 * ts); }
function driftModel(n) { const ts = saddleTau(n); return (qModel(n, QUAD_N, QUAD_W) / (ts * ts) - 1) * n * (1 + 4 * ts); }
function driftRecon(n) { return driftModel(n) + driftOffset(n); } // L_model + delta_n (drops 2nd-order)
function tilt(n) { return qTrue(n) / qModel(n, QUAD_N, QUAD_W); }
function driftOffset(n) { const ts = saddleTau(n); return (tilt(n) - 1) * n * (1 + 4 * ts); }
function crossingOfOne(fn, nLo, nHi) {
  let prev = fn(nLo), prevN = nLo;
  for (let n = nLo + 1; n <= nHi; n += 1) {
    const v = fn(n);
    if (prev >= 1 && v < 1) return prevN + (prev - 1) / (prev - v);
    prev = v; prevN = n;
  }
  return null;
}
// Fine grid n=10..120 step 2.5 -> use integer steps; report offsetFractionOfGap trend
const grid = [];
for (let n = 10; n <= 120; n += 5) {
  const ts = saddleTau(n);
  const qt = qTrue(n), qm = qModel(n, QUAD_N, QUAD_W);
  const t = qt / qm;
  const lever = n * (1 + 4 * ts);
  const lt = (qt / (ts * ts) - 1) * lever;
  const lm = (qm / (ts * ts) - 1) * lever;
  const delta = (t - 1) * lever;
  const frac = delta / (lt - lm);
  grid.push({ n, tilt: t, lt, lm, delta, frac, secondOrder: (lt - lm) - delta });
}
console.log('n, tilt, offsetFractionOfGap, driftTrue, secondOrderResidual');
for (const g of grid) {
  console.log(`${g.n}\t${g.tilt.toFixed(8)}\t${g.frac.toFixed(8)}\t${g.lt.toFixed(6)}\t${g.secondOrder.toExponential(4)}`);
}
// Crossings
const cTrue = crossingOfOne(driftTrue, 10, 120);
const cModel = crossingOfOne(driftModel, 10, 120);
const cRecon = crossingOfOne(driftRecon, 10, 120);
console.log('\nCROSS_TRUE=', cTrue);
console.log('CROSS_MODEL=', cModel);
console.log('CROSS_RECON (model+delta only, drops 2nd order)=', cRecon);
console.log('residual crossing gap CROSS_TRUE-CROSS_RECON=', cTrue - cRecon);
console.log('full gap CROSS_TRUE-CROSS_MODEL=', cTrue - cModel);
console.log('reconstruction closes fraction=', (cRecon - cModel) / (cTrue - cModel));
// where does offsetFractionOfGap cross 1?
let fracCross = null;
for (let i = 1; i < grid.length; i += 1) {
  if (grid[i - 1].frac < 1 && grid[i].frac >= 1) {
    const a = grid[i - 1], b = grid[i];
    fracCross = a.n + (1 - a.frac) / (b.frac - a.frac) * (b.n - a.n);
    break;
  }
}
console.log('offsetFractionOfGap crosses 1 at n~', fracCross);
console.log('offsetFractionOfGap at n=120:', grid[grid.length - 1].frac);
