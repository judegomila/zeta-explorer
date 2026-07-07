#!/usr/bin/env node
// imp-34816 offline solver: how does the imp-34813 conv-identity relative error
//   relErr(tau) = max_x |GaussConv_{sqrt(2 tau)}(H_0)(x) - H_{-tau}(x)| / max_x |H_{-tau}(x)|
// scale with tau, and is it a step-h (discrete-convolution) quadrature floor
// or a genuine tau-growth?
//
// imp-34813 recorded relErr = 1.982e-9 at tau=0.5 and 6.085e-9 at tau=2 with a
// discrete Gaussian convolution on an x-grid of step EXT_DX=0.01, kernel truncated
// at 6*sigma, x-band [20,104], ext-grid [8,116]. Two error channels:
//   (Q) discrete-convolution step h  : trapezoidal/Riemann error of the conv sum ~O(h^2)
//   (T) kernel-tail cut at 6*sigma   : renormalised tail fraction, tau-INDEPENDENT (~erfc)
//   (E) edge cut at ext-grid boundary: grows with tau because span=6*sigma grows
// This script separates them by (1) reproducing the recorded two points, (2)
// sweeping h at fixed tau to expose the O(h^2) floor, (3) sweeping tau on an
// INTERIOR band with generous ext-grid so the 6*sigma support never hits the edge.
// Measurement only; changes no bound; NO QED.

const PI = Math.PI;

// --- Phi and inner u-quadrature (identical to imp-34813 offline) -------------
function Phi(u) {
  const e4 = Math.exp(4 * u), e5 = Math.exp(5 * u), e9 = Math.exp(9 * u);
  let s = 0;
  for (let n = 1; n <= 40; n++) {
    const a = PI * n * n * e4;
    if (a > 700) break;
    s += (2 * PI * PI * n * n * n * n * e9 - 3 * PI * n * n * e5) * Math.exp(-a);
  }
  return s;
}
const U_MAX = 1.0, M = 2000, HU = U_MAX / M;
const U = new Float64Array(M + 1), SIMP = new Float64Array(M + 1), PHI = new Float64Array(M + 1);
for (let i = 0; i <= M; i++) {
  U[i] = i * HU;
  SIMP[i] = (i === 0 || i === M) ? HU / 3 : (i % 2 === 1 ? 4 * HU / 3 : 2 * HU / 3);
  PHI[i] = Phi(U[i]);
}
function weightsForT(t) {
  const w = new Float64Array(M + 1);
  for (let i = 0; i <= M; i++) w[i] = SIMP[i] * PHI[i] * Math.exp(t * U[i] * U[i]);
  return w;
}
function Hval(w, x) {
  let s = 0, c = 0;
  for (let i = 0; i <= M; i++) {
    const term = w[i] * Math.cos(x * U[i]);
    const y = term - c, tt = s + y; c = (tt - s) - y; s = tt;
  }
  return s;
}

// --- discrete Gaussian convolution of H_0 sampled on [extLo,extHi] step dx ----
function makeExtGrid(extLo, extHi, dx) {
  const w0 = weightsForT(0);
  const n = Math.round((extHi - extLo) / dx);
  const xs = new Float64Array(n + 1), hs = new Float64Array(n + 1);
  for (let j = 0; j <= n; j++) { xs[j] = extLo + j * dx; hs[j] = Hval(w0, xs[j]); }
  return { xs, hs, dx, extLo, extHi };
}
function convAt(ext, x, sigma, spanSigma) {
  const span = spanSigma * sigma;
  const j0 = Math.max(0, Math.ceil((x - span - ext.extLo) / ext.dx));
  const j1 = Math.min(ext.xs.length - 1, Math.floor((x + span - ext.extLo) / ext.dx));
  let num = 0, den = 0;
  for (let j = j0; j <= j1; j++) {
    const wj = Math.exp(-((x - ext.xs[j]) ** 2) / (2 * sigma * sigma));
    num += wj * ext.hs[j]; den += wj;
  }
  return num / den;
}
// relErr comparing conv(H_0) to direct H_{-tau} on x-band [xLo,xHi] step xStep.
function relErr(tau, ext, spanSigma, xLo, xHi, xStep) {
  const sigma = Math.sqrt(2 * tau);
  const w = weightsForT(-tau);
  let maxAbs = 0, maxDev = 0;
  for (let x = xLo; x <= xHi + 1e-9; x += xStep) {
    const d = Hval(w, x);
    maxAbs = Math.max(maxAbs, Math.abs(d));
    const c = convAt(ext, x, sigma, spanSigma);
    maxDev = Math.max(maxDev, Math.abs(c - d));
  }
  return maxDev / maxAbs;
}

// === 1. reproduce the two recorded imp-34813 points (original params) =========
console.log('=== 1. reproduce imp-34813 (x-band [20,104], ext [8,116], h=0.01, 6-sigma) ===');
{
  const ext = makeExtGrid(8, 116, 0.01);
  for (const tau of [0.5, 2]) {
    const r = relErr(tau, ext, 6, 20, 104, 0.5);
    console.log(`   tau=${tau}  relErr=${r.toExponential(3)}   (recorded ${tau === 0.5 ? '1.982e-9' : '6.085e-9'})`);
  }
}

// === 2. step-h scaling at FIXED tau (interior band, wide ext, 8-sigma) ========
// Interior band [40,84]; ext generous so 8*sigma never hits the grid edge.
console.log('=== 2. step-h scaling at fixed tau=2 (interior band [40,84], ext [10,114], 8-sigma) ===');
{
  const tau = 2;
  let prev = null;
  for (const h of [0.02, 0.01, 0.005, 0.0025]) {
    const ext = makeExtGrid(10, 114, h);
    const r = relErr(tau, ext, 8, 40, 84, 0.5);
    const ratio = prev === null ? null : prev / r;
    console.log(`   h=${h.toString().padEnd(7)} relErr=${r.toExponential(3)}${ratio ? `   prev/this=${ratio.toFixed(2)} (h^2 => 4.0)` : ''}`);
    prev = r;
  }
}

// === 3. tau scaling at FIXED fine h (interior band, wide ext, 8-sigma) ========
console.log('=== 3. tau scaling at fixed fine h=0.005 (interior band [40,84], ext [10,114], 8-sigma) ===');
{
  const h = 0.005;
  const rows = [];
  for (const tau of [0.25, 0.5, 1, 2, 4]) {
    const ext = makeExtGrid(10, 114, h);
    const r = relErr(tau, ext, 8, 40, 84, 0.5);
    rows.push({ tau, r });
    console.log(`   tau=${tau.toString().padEnd(5)} relErr=${r.toExponential(3)}`);
  }
  // log-log local slope d(log relErr)/d(log tau) between successive rungs
  for (let k = 1; k < rows.length; k++) {
    const slope = Math.log(rows[k].r / rows[k - 1].r) / Math.log(rows[k].tau / rows[k - 1].tau);
    console.log(`     slope[${rows[k - 1].tau}->${rows[k].tau}] = ${slope.toFixed(3)}`);
  }
}

// === 4. kernel-tail cut dependence at fixed tau,h (isolate channel T) =========
console.log('=== 4. spanSigma sweep at tau=2, h=0.005 (interior [40,84], ext [10,114]) ===');
{
  const tau = 2, h = 0.005;
  const ext = makeExtGrid(10, 114, h);
  for (const span of [4, 5, 6, 8, 10]) {
    const r = relErr(tau, ext, span, 40, 84, 0.5);
    console.log(`   spanSigma=${span}  relErr=${r.toExponential(3)}`);
  }
}
console.log('done');
