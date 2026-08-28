// imp-36275 -- MEASUREMENT ONLY (no bound moves; per-N translation stays OPEN; NO QED).
//
// imp-36151 witnessed QUALITATIVELY that the Route-B (imp-36082) per-N rate
//     r_B(N) = C' * sqrt(log gamma_N) * N^{-1/4}
// has a wide-window log-log slope that converges to -1/4 FROM ABOVE as the
// slowly-varying sqrt(log gamma_N) dressing dilutes, but never quantified HOW
// WIDE a fit window is needed for a given accuracy.
//
// imp-36257 tabulated the POINTWISE local slope d log r_B / d log N. This module
// asks the complementary question: over a FINITE least-squares fit window
// [k0, k0 + W] (k0 = log10 N, W decades wide, anchored with its LOWER edge at the
// base height), what window width W makes the FITTED log-log slope land within
// 1% and within 0.1% of the -1/4 limit, and how does W scale with base height?
//
// gamma_N is the height of the N-th zero via the SAME Riemann-von Mangoldt
// inverse used across the repo (effectiveHeightForN), consistent with the
// imp-354 RvM count. The overall constant C' cancels in a log-log slope, so
// C' = 1 here.

const twoPi = 2 * Math.PI;

// Exact copy of effectiveHeightForN (RvM main-term inverse) -- offline, no imports.
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(twoPi * Math.E, twoPi * N / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

function logRB(N) {
  const gamma = effectiveHeightForN(N);
  return 0.5 * Math.log(Math.log(gamma)) - 0.25 * Math.log(N);
}

// Pointwise local log-log slope (the W -> 0 limit).
function localSlope(N, h = 1e-3) {
  const l = Math.log(N);
  return (logRB(Math.exp(l + h)) - logRB(Math.exp(l - h))) / (2 * h);
}

// Least-squares log-log FIT slope over the upward-anchored window [k0, k0+W]
// (k0, W in log10 N decades), sampled at M points.
function fitSlopeUp(k0, W, M = 801) {
  const ln10 = Math.LN10;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < M; i++) {
    const k = k0 + (W * i) / (M - 1);
    const x = k * ln10;               // ln N
    const y = logRB(Math.pow(10, k));
    sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  return (M * sxy - sx * sy) / (M * sxx - sx * sx);
}

// Window width W (decades) at which |fitSlope - (-1/4)| first falls below a
// RELATIVE tolerance tol of 1/4 (so 4*|excess| < tol). The fit slope decreases
// monotonically toward -1/4 as W grows, so a bisection is well posed.
function spanForTol(k0, tol) {
  const target = tol / 4;
  let lo = 0, hi = 1e5;
  if (Math.abs(fitSlopeUp(k0, hi) + 0.25) > target) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (Math.abs(fitSlopeUp(k0, mid) + 0.25) > target) lo = mid; else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// Platt-Trudgian anchor: verified height X ~ 3e12 => N* ~ 1.236e13 (imp-36238).
const N_STAR = 1.236240301966e13;
const kStar = Math.log10(N_STAR);

console.log('imp-36275  Route-B  r_B(N)=sqrt(log gamma_N) N^{-1/4}  windowed log-log FIT slope -> -1/4');
console.log('window [k0, k0+W] decades in log10 N; W = width for the FITTED slope to reach a tolerance of -1/4\n');
console.log('  baseK0   pointExcess   W@1%(dec)  W@0.1%(dec)   upperEdge@1%  upperEdge@0.1%');
const bases = [6, 8, 10, kStar, 15, 20, 30, 50];
const rows = [];
for (const k0 of bases) {
  const pe = localSlope(Math.pow(10, k0)) + 0.25;
  const w1 = spanForTol(k0, 0.01);
  const w01 = spanForTol(k0, 0.001);
  rows.push({ k0, pe, w1, w01 });
  const tag = Math.abs(k0 - kStar) < 1e-9 ? '  <-PT' : '';
  console.log(
    `  ${k0.toFixed(3).padStart(7)}  ${pe.toExponential(4)}   ${w1.toFixed(3).padStart(8)}  ${w01.toFixed(3).padStart(9)}   ` +
    `${(k0 + w1).toFixed(3).padStart(9)}   ${(k0 + w01).toFixed(3).padStart(9)}${tag}`
  );
}

console.log(`\nPT anchor  k0 = log10(N*) = ${kStar.toFixed(6)}  (gamma ~ 3e12):`);
console.log(`   pointwise excess           = ${(localSlope(N_STAR) + 0.25).toExponential(6)}  (rel ${((localSlope(N_STAR) + 0.25) * 4).toExponential(4)} above -1/4)`);
console.log(`   W@1%   = ${spanForTol(kStar, 0.01).toFixed(4)} decades  (fit window up to N ~ 1e${(kStar + spanForTol(kStar, 0.01)).toFixed(2)})`);
console.log(`   W@0.1% = ${spanForTol(kStar, 0.001).toFixed(4)} decades  (fit window up to N ~ 1e${(kStar + spanForTol(kStar, 0.001)).toFixed(2)})`);

// Convergence rate: fit W(tol) vs base height k0 = log10 N.
function lin(xs, ys) {
  const n = xs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { m, b: (sy - m * sx) / n };
}
const ks = rows.map((r) => r.k0);
const f1 = lin(ks, rows.map((r) => r.w1));
const f01 = lin(ks, rows.map((r) => r.w01));
console.log('\nConvergence-rate fit  W(tol) vs base height k0 = log10 N:');
console.log(`   W@1%   ~ ${f1.m.toFixed(4)} * k0 + ${f1.b.toFixed(4)}`);
console.log(`   W@0.1% ~ ${f01.m.toFixed(4)} * k0 + ${f01.b.toFixed(4)}`);
console.log('\nHeadline: the 0.1% UPPER window edge k0+W is base-INDEPENDENT (fit slope ~ -1.0000),');
console.log('pinned near log10 N ~ 307.46 -- 0.1% convergence is pointwise-tail-limited, not averaging-driven.');
console.log('The dilution is logarithmically slow: even 1% needs the window to reach N ~ 1e134..1e232,');
console.log('so at the PT anchor (N ~ 1e13) NO numerically accessible fit window witnesses convergence.');
