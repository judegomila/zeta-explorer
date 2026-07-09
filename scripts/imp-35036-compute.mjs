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
const sigma = (N) => parts(N).sigma;

// OLS local decay exponent over [10^k, 10^(k+1)], 4 pts/decade (matches imp-33582).
function olsExponentDecade(k, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [], ys = [];
  for (let d = k; d <= k + 1 + 1e-9; d += step) {
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

console.log('decade k -> p_dec, gap(1/2 - p)');
for (let k = 6; k <= 30; k++) {
  const p = olsExponentDecade(k);
  console.log(`1e${k}->1e${k + 1}: p=${p.toFixed(6)}  gap=${(0.5 - p).toExponential(4)}`);
}

// continuous p(k) via decade-start k; bisect for p = 0.499
const pk = (k) => olsExponentDecade(k);
function crossReach(target) {
  let a = 6, b = 400;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (pk(m) < target) a = m; else b = m;
  }
  return (a + b) / 2;
}
for (const t of [0.45, 0.49, 0.499, 0.4999]) {
  const k = crossReach(t);
  console.log(`p reaches ${t} at decade-start k=${k.toFixed(4)}  => N=1e${k.toFixed(4)} ~ ${Math.pow(10, k).toExponential(4)}`);
}

console.log('\n--- gap * 2*ln(N_center) test (should -> 1 if gap ~ 1/(2 ln N)) ---');
for (const k of [12, 15, 20, 30, 50, 100, 200]) {
  const p = olsExponentDecade(k);
  const gap = 0.5 - p;
  const lnNc = (k + 0.5) * Math.log(10);
  console.log(`k=${k}: gap=${gap.toExponential(4)}  gap*2*lnNc=${(gap * 2 * lnNc).toFixed(4)}`);
}
