// imp-36257 -- MEASUREMENT ONLY (no bound moves; per-N translation stays OPEN; NO QED).
//
// imp-36151 asserts the Route-B (imp-36082) per-N rate
//     r_B(N) = C' * sqrt(log gamma_N) * N^{-1/4}
// has a wide-window log-log slope that converges to -1/4 FROM ABOVE as the
// slowly-varying sqrt(log gamma_N) dressing dilutes, but never TABULATED the
// convergence rate of the slope toward -1/4.
//
// Here we recompute the LOCAL log-log slope  d log r_B / d log N  on a wide
// geometric N-ladder (through the Platt-Trudgian anchor N* ~ 1.236e13 and far
// beyond), tabulate the residual excess  slope(N) + 1/4 , and fit its decay.
//
// gamma_N is the height of the N-th zero via the SAME Riemann-von Mangoldt
// inverse used across the repo (src/data/lambda-rh-height-mapping.js), so this
// is consistent with the imp-354 RvM count.
//
// The overall constant C' cancels in the log-log slope, so we set C' = 1.

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

// log r_B(N) with C' = 1.
function logRB(N) {
  const gamma = effectiveHeightForN(N);
  return 0.5 * Math.log(Math.log(gamma)) - 0.25 * Math.log(N);
}

// Local log-log slope via symmetric geometric finite difference in log N.
// h is the half-step in natural-log-N units.
function localSlope(N, h = 1e-3) {
  const lnN = Math.log(N);
  const Nlo = Math.exp(lnN - h);
  const Nhi = Math.exp(lnN + h);
  return (logRB(Nhi) - logRB(Nlo)) / (2 * h);
}

// Platt-Trudgian anchor: verified height X ~ 3e12 => N* ~ 1.236e13 (imp-36238).
const N_STAR = 1.236240301966e13;

// Wide geometric ladder in N, log10 spaced.
const exps = [];
for (let k = 4; k <= 40; k += 2) exps.push(k);

console.log('imp-36257  Route-B log-log slope convergence toward -1/4');
console.log('r_B(N) = sqrt(log gamma_N) * N^{-1/4},  gamma_N via RvM inverse\n');
console.log('   log10(N)      N            gamma_N        slope        excess=slope+1/4   1/(4 log N)');
for (const k of exps) {
  const N = Math.pow(10, k);
  const gamma = effectiveHeightForN(N);
  const s = localSlope(N);
  const excess = s + 0.25;
  const pred = 1 / (4 * Math.log(N));
  console.log(
    `   ${String(k).padStart(3)}      ${N.toExponential(3)}   ${gamma.toExponential(3)}   ` +
    `${s.toFixed(8)}   ${excess.toExponential(6)}   ${pred.toExponential(6)}`
  );
}

// PT anchor slope.
const sStar = localSlope(N_STAR);
console.log(`\nPT anchor  N* = ${N_STAR.toExponential(6)}  (gamma ~ 3e12):`);
console.log(`   slope(N*)          = ${sStar.toFixed(10)}`);
console.log(`   excess(N*)         = ${(sStar + 0.25).toExponential(6)}`);
console.log(`   1/(4 log N*) pred  = ${(1 / (4 * Math.log(N_STAR))).toExponential(6)}`);
console.log(`   ratio excess/pred  = ${((sStar + 0.25) / (1 / (4 * Math.log(N_STAR)))).toFixed(6)}`);

// N needed to reach slope within a relative tolerance of -1/4.
// |slope - (-1/4)| / (1/4) = 4*|excess| < tol.
function nForTol(tol) {
  // bisection on log10(N) using the monotone-decaying excess.
  let lo = 4, hi = 300;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    const N = Math.pow(10, mid);
    const rel = 4 * Math.abs(localSlope(N) + 0.25);
    if (rel > tol) lo = mid; else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const k1 = nForTol(0.01);
const k01 = nForTol(0.001);
console.log(`\nN to reach slope within 1%  of -1/4 : log10(N) ~ ${k1.toFixed(3)}  (N ~ 1e${k1.toFixed(1)})`);
console.log(`N to reach slope within 0.1% of -1/4 : log10(N) ~ ${k01.toFixed(3)}  (N ~ 1e${k01.toFixed(1)})`);

// Verify the asymptotic excess ~ 1/(4 log N): fit log(excess) vs log(log N).
console.log('\nAsymptotic check: excess(N) * (4 log N) -> should approach 1 (from a slowly-varying correction):');
for (const k of [20, 40, 80, 160, 300]) {
  const N = Math.pow(10, k);
  const r = (localSlope(N) + 0.25) * (4 * Math.log(N));
  console.log(`   log10(N)=${String(k).padStart(3)}   excess*(4 log N) = ${r.toFixed(8)}`);
}
