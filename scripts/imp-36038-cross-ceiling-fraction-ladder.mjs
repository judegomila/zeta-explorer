// imp-36038 offline probe: does the imp-35973 combined worst-SHAPE x worst-ORDER
// CROSS pairwise ceiling FRACTION cross / (log2(N)*eps) grow with N toward the
// pairwise ceiling, or stay N-flat, across the imp-35948 7-rung half-decade ladder
// [1e3, 4.886e5]? imp-35973 measured it at the single N~488602 endpoint (~1.03e-1)
// only. Measurement only; NO QED.

const T_PT = 3e12;
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT);
const U_ROUNDOFF = 2 ** -53;
const EPS_DOUBLE = 2 ** -52;
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);
const LEAF = 128;

function sumTree(terms, splitter, leaf) {
  const n = terms.length;
  let maxDepth = 0;
  const stack = [{ lo: 0, hi: n, depth: 0, stage: 0, leftVal: 0, mid: 0 }];
  let result = 0;
  while (stack.length) {
    const f = stack[stack.length - 1];
    if (f.depth > maxDepth) maxDepth = f.depth;
    if (f.hi - f.lo <= leaf) {
      let a = 0;
      for (let i = f.lo; i < f.hi; i++) a += terms[i];
      result = a;
      stack.pop();
      continue;
    }
    if (f.stage === 0) {
      let mid = splitter(f.lo, f.hi, leaf);
      if (mid <= f.lo) mid = f.lo + 1;
      if (mid >= f.hi) mid = f.hi - 1;
      f.mid = mid;
      f.stage = 1;
      stack.push({ lo: f.lo, hi: mid, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else if (f.stage === 1) {
      f.leftVal = result;
      f.stage = 2;
      stack.push({ lo: f.mid, hi: f.hi, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else {
      result = f.leftVal + result;
      stack.pop();
    }
  }
  return { sum: result, maxDepth };
}

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
function normalizedError(schemeResult, trueNum, sumAbs) {
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

const splitCaterpillarR = (lo, hi, leaf) => hi - leaf;

function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);

  const neg = [], pos = [];
  for (let i = 0; i < N; i++) { if (base[i] < 0) neg.push(base[i]); else pos.push(base[i]); }
  const clustered = Float64Array.from(neg.concat(pos));

  const { sum, maxDepth } = sumTree(clustered, splitCaterpillarR, LEAF);
  const cross = normalizedError(sum, trueNum, sumAbs);
  const ceil = Math.log2(N) * EPS_DOUBLE;
  return { N, kappa, cross, crossDepth: maxDepth, ceil, ratio: cross / ceil };
}

const LADDER = [1000, 3162, 10000, 31623, 100000, 316228, N_AT_TPT];
console.log('N\tkappa\tcross\tceil\tceilFraction');
const rows = [];
for (const N of LADDER) {
  const r = measureAtN(N);
  rows.push(r);
  console.log(`${r.N}\t${r.kappa.toFixed(1)}\t${r.cross.toExponential(4)}\t${r.ceil.toExponential(3)}\t${r.ratio.toExponential(4)}`);
}
const fr = rows.map((r) => r.ratio);
const min = Math.min(...fr), max = Math.max(...fr);
console.log('\nceilFraction across ladder:', fr.map((f) => f.toExponential(3)).join(', '));
console.log('min/max:', min.toExponential(3), max.toExponential(3), 'span-ratio:', (max / min).toFixed(2));
// log-log slope of ceilFraction vs N
const xs = LADDER.map((N) => Math.log10(N));
const ys = fr.map((f) => Math.log10(f));
const n = xs.length;
const mx = xs.reduce((a, b) => a + b, 0) / n;
const my = ys.reduce((a, b) => a + b, 0) / n;
let sxy = 0, sxx = 0;
for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
console.log('log-log slope (dlog10 ceilFraction / dlog10 N):', (sxy / sxx).toFixed(4));
let monoInc = true, monoDec = true;
for (let i = 1; i < fr.length; i++) { if (!(fr[i] > fr[i - 1])) monoInc = false; if (!(fr[i] < fr[i - 1])) monoDec = false; }
console.log('monotone in N:', monoInc || monoDec, '(inc', monoInc, 'dec', monoDec, ')');
console.log('max fraction still under ceiling (all < 1):', max < 1, 'x-under-ceiling at max:', (1 / max).toFixed(1));
