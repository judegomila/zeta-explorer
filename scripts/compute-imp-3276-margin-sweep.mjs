/**
 * imp-3276: Measure the per-N safety MARGIN of the PATH-1 leading-order
 * predicates E1 (rho_{J*(N)} non-decreasing) and E2 (tau_c_est non-increasing)
 * across the full Odlyzko sweep N in {2,...,10^6}.
 *
 * The roadmap (PATH 1, imp-833/imp-858) reports ZERO violations, a binary.
 * This script quantifies the ROBUSTNESS by decomposing the signed margin into:
 *
 *   (a) the min signed margin over ALL adjacent-N steps  -- expected to be an
 *       exact TIE at 0, since rho(N) and tau_c_est(N) are piecewise-constant
 *       and only change at RECORD-breaking steps (prefix-min gap moves to the
 *       newest top pair); at every non-record step the value is unchanged.
 *
 *   (b) the min STRICT jump at RECORD-breaking steps only -- the genuinely
 *       informative margin: rho jumps UP (new argmin sits at a higher gamma
 *       => higher density) and tau_c_est jumps DOWN. We track the smallest
 *       such jump per decade of N to see whether the strict margin shrinks
 *       toward 0 (fragile) or stays bounded away (robust).
 *
 * Run: node scripts/compute-imp-3276-margin-sweep.mjs
 *
 * O(N) single prefix-min pass -- NOT O(N^2). ~10^6 ops.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TWO_PI = 2 * Math.PI;

// ── Load zero ordinates directly from the data module source (avoid the heavy
//    vite import path; parse the frozen numeric array out of the file text). ──
const zerosPath = join(__dirname, '..', 'src', 'data', 'zeros-to-1e6.js');
const src = readFileSync(zerosPath, 'utf8');
const start = src.indexOf('Object.freeze([');
const end = src.indexOf('])', start);
const body = src.slice(start + 'Object.freeze(['.length, end);
const zeros = body
  .split(',')
  .map((s) => parseFloat(s))
  .filter((x) => Number.isFinite(x));

console.log(`loaded ${zeros.length} zero ordinates`);

const rvmF = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1);
const rvmDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;

const N_MAX = zeros.length;

// Prefix-min sweep. jStar(N) = argmin_{k<N-1} deltaF_k. It changes only when the
// newest gap (between gamma_{N-1} and gamma_N) sets a new record.
let H = Infinity;         // running prefix-min of unfolded gaps
let jStar = 0;            // 0-indexed argmin
let prevRho = 0;
let prevTau = Infinity;

let minRhoIncrementAll = Infinity;   // min over ALL steps of rho(N)-rho(N-1)
let minTauDecrementAll = Infinity;   // min over ALL steps of -(tau(N)-tau(N-1))
let rhoViolations = 0;
let tauViolations = 0;
let recordSteps = 0;

// Per-decade smallest STRICT jump at record steps.
const decades = [
  [2, 10], [10, 100], [100, 1e3], [1e3, 1e4],
  [1e4, 1e5], [1e5, 1e6], [1e6, 1e6 + 1],
];
const decMinRhoJump = decades.map(() => Infinity);
const decMinTauDrop = decades.map(() => Infinity);
const decRecordCount = decades.map(() => 0);
function decadeIndex(N) {
  for (let i = 0; i < decades.length; i++) {
    if (N >= decades[i][0] && N < decades[i][1]) return i;
  }
  return decades.length - 1;
}

// N counts the number of zeros in the prefix; gaps run over k=0..N-2.
// At step N we newly consider gap k = N-2 (between gamma_{N-2} and gamma_{N-1}).
for (let N = 2; N <= N_MAX; N++) {
  const kNew = N - 2;
  const dNew = rvmF(zeros[kNew + 1]) - rvmF(zeros[kNew]);
  let record = false;
  if (dNew < H) {
    H = dNew;
    jStar = kNew;
    record = true;
  }
  const rho = rvmDensity(zeros[jStar]);
  const tau = (H * H) / (8 * rho * rho);

  if (N > 2) {
    const rhoInc = rho - prevRho;
    const tauDec = prevTau - tau;
    if (rhoInc < minRhoIncrementAll) minRhoIncrementAll = rhoInc;
    if (tauDec < minTauDecrementAll) minTauDecrementAll = tauDec;
    if (rhoInc < -1e-10) rhoViolations++;
    if (tauDec < -1e-20) tauViolations++;
    if (record) {
      recordSteps++;
      const di = decadeIndex(N);
      decRecordCount[di]++;
      // At a record step the value strictly changes; capture the strict jump.
      if (rhoInc > 0 && rhoInc < decMinRhoJump[di]) decMinRhoJump[di] = rhoInc;
      if (tauDec > 0 && tauDec < decMinTauDrop[di]) decMinTauDrop[di] = tauDec;
    }
  }
  prevRho = rho;
  prevTau = tau;
}

const round = (x, d = 6) =>
  x === Infinity ? null : +x.toExponential(d);

console.log('\n=== E1/E2 margin decomposition (imp-3276) ===');
console.log(`N range: 2 .. ${N_MAX}`);
console.log(`rho violations (increment < -1e-10): ${rhoViolations}`);
console.log(`tau violations (decrement < -1e-20): ${tauViolations}`);
console.log(`record-breaking steps (jStar moved): ${recordSteps}`);
console.log(`min rho increment over ALL steps: ${round(minRhoIncrementAll)}`);
console.log(`min tau decrement over ALL steps: ${round(minTauDecrementAll)}`);
console.log('\nper-decade smallest STRICT jump at record steps:');
decades.forEach((d, i) => {
  console.log(
    `  N in [${d[0]}, ${d[1]}):  records=${decRecordCount[i]}  ` +
    `minRhoJump=${round(decMinRhoJump[i])}  minTauDrop=${round(decMinTauDrop[i])}`
  );
});

// Emit a compact JSON payload for baking into the data module.
const payload = {
  N_min: 2,
  N_max: N_MAX,
  rhoViolations,
  tauViolations,
  recordSteps,
  minRhoIncrementAll: round(minRhoIncrementAll),
  minTauDecrementAll: round(minTauDecrementAll),
  perDecade: decades.map((d, i) => ({
    N_lo: d[0],
    N_hi: d[1],
    records: decRecordCount[i],
    minRhoJump: round(decMinRhoJump[i]),
    minTauDrop: round(decMinTauDrop[i]),
  })),
};
console.log('\nJSON payload:');
console.log(JSON.stringify(payload, null, 2));
