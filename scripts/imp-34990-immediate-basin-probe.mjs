import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5;
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
const EPS_FP = 2.3e-16;

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) { let N = seed; for (let i = 0; i < iters; i++) N = g(N); return N; }
const N_CROSS_FP = iterate(1e9, 200);

// nextUp / nextDown via bit manipulation
const buf = new ArrayBuffer(8);
const f64 = new Float64Array(buf);
const u64 = new BigUint64Array(buf);
function nextUp(x) {
  f64[0] = x;
  if (x >= 0) u64[0] += 1n; else u64[0] -= 1n;
  return f64[0];
}
function nextDown(x) {
  f64[0] = x;
  if (x > 0) u64[0] -= 1n; else u64[0] += 1n;
  return f64[0];
}

const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R = Math.abs(gPrimeAtStep(1));
console.log('N_CROSS_FP =', N_CROSS_FP.toPrecision(18));
console.log('R (contraction) =', R.toPrecision(8));
console.log('EPS_FP =', EPS_FP);
console.log('machine eps =', Number.EPSILON);
console.log('ulp(N*)/N* =', (nextUp(N_CROSS_FP) - N_CROSS_FP) / N_CROSS_FP);

// Walk UP from N* while g(N) === N*, record last N still mapping to N*.
let up = N_CROSS_FP, upSteps = 0;
while (g(nextUp(up)) === N_CROSS_FP && upSteps < 100000) { up = nextUp(up); upSteps++; }
// Walk DOWN
let dn = N_CROSS_FP, dnSteps = 0;
while (g(nextDown(dn)) === N_CROSS_FP && dnSteps < 100000) { dn = nextDown(dn); dnSteps++; }

const relUp = Math.abs(up - N_CROSS_FP) / N_CROSS_FP;
const relDn = Math.abs(dn - N_CROSS_FP) / N_CROSS_FP;
const penultMax = Math.max(relUp, relDn);
console.log('immediate-basin steps up   =', upSteps, ' relUp =', relUp);
console.log('immediate-basin steps down =', dnSteps, ' relDn =', relDn);
console.log('penultMax (immediate-basin max rel dist) =', penultMax);
console.log('penultMax / EPS_FP = c =', penultMax / EPS_FP);
console.log('observed off-by-one penult = 1.4536413720400559e-16');
console.log('c < 1 ?', penultMax / EPS_FP < 1);

// --- Scan real seeds: what is the MAX penultimate rel dist actually reached? ---
function penultOf(seed, cap = 500) {
  let N = seed, k = 0, prev;
  while (k < cap) {
    prev = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
    N = g(N); k++;
    if (N === N_CROSS_FP) return prev;
  }
  return null;
}
let maxPenultSeen = 0, argmax = null, nAbove = 0, nScanned = 0;
// fine grid across the off-by-one-bearing decades and beyond
for (let e = 6; e <= 12; e += 0.0005) {
  const s = Math.pow(10, e);
  const p = penultOf(s);
  if (p === null) continue;
  nScanned++;
  if (p > EPS_FP) nAbove++;
  if (p > maxPenultSeen) { maxPenultSeen = p; argmax = s; }
}
console.log('\n--- fine seed scan [1e6,1e12], step 10^0.0005 ---');
console.log('seeds scanned      =', nScanned);
console.log('max penult SEEN    =', maxPenultSeen, ' at seed', argmax && argmax.toPrecision(10));
console.log('max penult / EPS_FP=', maxPenultSeen / EPS_FP);
console.log('# seeds with penult > EPS_FP =', nAbove);

// coarser grid affordable at build time — does it still attain B?
let mx=0,na=0,ns=0;
for (let e=6;e<=12;e+=0.005){const p=penultOf(Math.pow(10,e));if(p===null)continue;ns++;if(p>EPS_FP)na++;if(p>mx)mx=p;}
console.log('\ncoarse [1e6,1e12] step 10^0.005: seeds',ns,' max',mx,' max/EPS',mx/EPS_FP,' #>EPS',na);
