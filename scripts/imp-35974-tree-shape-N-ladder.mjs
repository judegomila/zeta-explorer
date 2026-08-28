// imp-35974 offline measurement: re-run the imp-35893 balanced + caterpillarR
// pairing-tree shapes at a ladder of larger N to see whether worst/ceiling ratio
// grows with problem size. Prints baked literals for the viz-data module.

const EPS_DOUBLE = 2 ** -52;
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);
const LEAF = 128;

function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}

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

  const balanced = sumTree(base, (lo, hi) => (lo + hi) >> 1, LEAF);
  const catR = sumTree(base, (lo, hi, leaf) => hi - leaf, LEAF);
  const balErr = normalizedError(balanced.sum, trueNum, sumAbs);
  const catErr = normalizedError(catR.sum, trueNum, sumAbs);
  const naiveErr = normalizedError(sumNaive(base), trueNum, sumAbs);
  const ceilPairwise = Math.log2(N) * EPS_DOUBLE;
  const ceilNaive = N * EPS_DOUBLE;
  return {
    N,
    conditionNumber: sumAbs / Math.abs(trueSum),
    balancedDepth: balanced.maxDepth,
    balancedNormErr: balErr,
    caterpillarRDepth: catR.maxDepth,
    caterpillarRNormErr: catErr,
    naiveNormErr: naiveErr,
    ceilPairwise,
    ceilNaive,
    worstRatioToPairwiseCeiling: catErr / ceilPairwise,
    balancedRatioToPairwiseCeiling: balErr / ceilPairwise,
  };
}

const LADDER = process.argv.slice(2).map(Number);
const Ns = LADDER.length ? LADDER : [488602, 1e6, 1e7, 1e8];
for (const N of Ns) {
  const t0 = Date.now();
  const r = measureAtN(N);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(JSON.stringify({ ...r, seconds: dt }));
}
