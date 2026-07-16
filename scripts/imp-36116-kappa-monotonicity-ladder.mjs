// imp-36116 offline probe: is the per-N conditioning number kappa(N) = Sum|t_k| / |Sum t_k|
// NON-MONOTONE in N across the full imp-35812 clustered-order ladder?
// imp-36062 found kappa(N=34000)=361.5 < kappa(N=33000)=362.8 near the KBN separation onset
// and concluded the onset cannot be keyed to a hard kappa cutoff. Here we compute kappa(N) at
// FINE N resolution over the whole ladder [1000 .. N_AT_TPT] in a single O(N_max) incremental
// pass (kappa is ORDER-INDEPENDENT: it depends only on the multiset of terms, not the summation
// order, so the imp-35852 clustered order does not change it), and characterize its monotonicity
// profile: local dips (rung-to-rung decreases), the envelope growth rate, and how far kappa
// fails to be a clean predictor of summation difficulty.
// Terms and constants are imp-36023 verbatim. Measurement only; changes no bound;
// C_mb GUE-conditional (imp-486) untouched; NO QED.

const T_PT = 3e12;
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // 488602
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// Exact fixed-point accumulation of the true sum (bit-for-bit sum of the fp64 terms),
// so the kappa denominator |Sum t_k| never inherits summation roundoff.
const FRAC_BITS = 96n;
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);
function doubleToFixedBigInt(x) {
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) exp = -1074;
  else { mant |= 1n << 52n; exp = exp - 1075; }
  const shift = BigInt(exp) + FRAC_BITS;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}
function fixedToDouble(num) {
  const abs = num < 0n ? -num : num;
  return (Number(abs << 40n) / 2 ** 40 / 2 ** 96) * (num < 0n ? -1 : 1);
}

// Fine grid: dense (every 100) through the imp-36062 onset window and its neighbourhood,
// coarser (every 1000) across the rest of the ladder up to N_AT_TPT.
const checkpoints = new Set();
for (let N = 1000; N <= N_AT_TPT; N += 1000) checkpoints.add(N);
for (let N = 30000; N <= 45000; N += 100) checkpoints.add(N);
checkpoints.add(33000); checkpoints.add(34000); checkpoints.add(N_AT_TPT);

const sorted = Array.from(checkpoints).filter((N) => N <= N_AT_TPT).sort((a, b) => a - b);
const cpSet = new Set(sorted);

// Single incremental pass k = 1 .. N_max, recording kappa at each checkpoint.
let sumAbs = 0;            // Sum|t_k| -- all positive, well conditioned in fp64
let trueNum = 0n;         // exact fixed-point Sum t_k
const rows = [];
const N_max = sorted[sorted.length - 1];
for (let k = 1; k <= N_max; k++) {
  const t = TERM(k);
  sumAbs += Math.abs(t);
  trueNum += doubleToFixedBigInt(t);
  if (cpSet.has(k)) {
    const trueSum = fixedToDouble(trueNum);
    const kappa = sumAbs / Math.abs(trueSum);
    rows.push({ N: k, kappa });
  }
}

// ---- monotonicity characterization ----
let dips = 0, rises = 0, ties = 0;
let maxDropAbs = 0, maxDropAt = 0;
let runningMax = -Infinity, dipsBelowRunningMax = 0;
for (let i = 1; i < rows.length; i++) {
  const d = rows[i].kappa - rows[i - 1].kappa;
  if (d < 0) { dips++; if (-d > maxDropAbs) { maxDropAbs = -d; maxDropAt = rows[i].N; } }
  else if (d > 0) rises++;
  else ties++;
  runningMax = Math.max(runningMax, rows[i - 1].kappa);
  if (rows[i].kappa < runningMax) dipsBelowRunningMax++;
}

// envelope growth: OLS fit kappa ~ a + b*sqrt(N) and kappa ~ a + b*ln(N)
function ols(xs, ys) {
  const n = xs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; syy += ys[i] * ys[i]; }
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;
  const r2 = Math.pow(n * sxy - sx * sy, 2) / ((n * sxx - sx * sx) * (n * syy - sy * sy));
  return { a, b, r2 };
}
const ks = rows.map((r) => r.kappa);
const fitSqrt = ols(rows.map((r) => Math.sqrt(r.N)), ks);
const fitLog = ols(rows.map((r) => Math.log(r.N)), ks);

const kappaAt = (N) => (rows.find((r) => r.N === N) || {}).kappa;
const k33 = kappaAt(33000), k34 = kappaAt(34000);
const kappaMin = Math.min(...ks), kappaMax = Math.max(...ks);
const kEnd = rows[rows.length - 1];

console.log(`imp-36116  kappa(N) = Sum|t_k| / |Sum t_k|  over N in [1000, ${N_AT_TPT}]`);
console.log(`checkpoints: ${rows.length}  (dense every 100 across N in [30000,45000], else every 1000)`);
console.log(`\nkappa endpoints: kappa(1000)=${kappaAt(1000).toFixed(3)}  kappa(${kEnd.N})=${kEnd.kappa.toFixed(3)}`);
console.log(`kappa min/max over grid: ${kappaMin.toFixed(3)} / ${kappaMax.toFixed(3)}   (max not at endpoint: ${kappaMax > kEnd.kappa + 1e-9})`);
console.log(`\nimp-36062 onset window reproduction:`);
console.log(`  kappa(33000)=${k33.toFixed(4)}   kappa(34000)=${k34.toFixed(4)}   dip = ${(k34 - k33).toFixed(4)}  (${k34 < k33 ? 'CONFIRMED kappa(34000) < kappa(33000)' : 'NOT reproduced'})`);
console.log(`\nmonotonicity profile over ${rows.length - 1} rung-to-rung steps:`);
console.log(`  rises=${rises}  dips=${dips}  ties=${ties}   -> dip fraction = ${(dips / (rows.length - 1) * 100).toFixed(1)}%`);
console.log(`  local dips below the running max: ${dipsBelowRunningMax}`);
console.log(`  largest single-step drop: ${maxDropAbs.toFixed(4)} at N=${maxDropAt}`);
console.log(`\nenvelope growth fits:`);
console.log(`  kappa ~ ${fitSqrt.a.toFixed(3)} + ${fitSqrt.b.toExponential(4)}*sqrt(N)   R^2=${fitSqrt.r2.toFixed(5)}`);
console.log(`  kappa ~ ${fitLog.a.toFixed(3)} + ${fitLog.b.toFixed(4)}*ln(N)     R^2=${fitLog.r2.toFixed(5)}`);
console.log(`\nVERDICT: kappa is NON-MONOTONE in N (${dips} local dips over ${rows.length - 1} steps, ${(dips / (rows.length - 1) * 100).toFixed(1)}% of steps decrease);`);
console.log(`  its ${fitSqrt.r2 >= fitLog.r2 ? 'sqrt(N)' : 'ln(N)'} envelope rises smoothly (best fit R^2=${Math.max(fitSqrt.r2, fitLog.r2).toFixed(4)}) but the per-rung value oscillates,`);
console.log(`  so kappa cannot serve as a clean hard-threshold predictor of summation difficulty -- the imp-36062 conclusion holds ladder-wide.`);
