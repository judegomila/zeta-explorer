// imp-36019 offline probe: is the imp-35973 super-additive order-x-shape compounding
// factor (CROSS / (shape-only + order-only)) N-stable or does it trend across the
// imp-35812 N ladder [1000, 10000, 100000, 488602]? Measurement only; NO QED.

const T_PT = 3e12;
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT);
const U_ROUNDOFF = 2 ** -53;
const EPS_DOUBLE = 2 ** -52;
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);
const LEAF = 128;

function sumKahan(terms) {
  let s = 0, c = 0;
  for (let i = 0; i < terms.length; i++) {
    const y = terms[i] - c;
    const t = s + y;
    c = t - s - y;
    s = t;
  }
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

const splitCaterpillarR = (lo, hi, leaf) => hi - leaf;
const splitCaterpillarL = (lo, hi, leaf) => lo + leaf;
const splitBalanced = (lo, hi) => (lo + hi) >> 1;

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
  const original = Float64Array.from(base);

  const m = (order, splitter) => {
    const { sum, maxDepth } = sumTree(order, splitter, LEAF);
    return { err: normalizedError(sum, trueNum, sumAbs), depth: maxDepth };
  };
  const shapeOnly = m(original, splitCaterpillarR);
  const orderOnly = m(clustered, splitBalanced);
  const cross = m(clustered, splitCaterpillarR);
  const crossCatL = m(clustered, splitCaterpillarL);
  const kahan = normalizedError(sumKahan(clustered), trueNum, sumAbs);

  const sumSingle = shapeOnly.err + orderOnly.err;
  const worseSingle = Math.max(shapeOnly.err, orderOnly.err);
  return {
    N, kappa,
    shapeOnly: shapeOnly.err, shapeDepth: shapeOnly.depth,
    orderOnly: orderOnly.err, orderDepth: orderOnly.depth,
    cross: cross.err, crossDepth: cross.depth,
    crossCatL: crossCatL.err,
    kahan,
    crossOverSum: cross.err / sumSingle,
    crossOverWorse: cross.err / worseSingle,
    ceilPairwise: Math.log2(N) * EPS_DOUBLE,
    crossRatioCeil: cross.err / (Math.log2(N) * EPS_DOUBLE),
  };
}

const LADDER = [1000, 10000, 100000, N_AT_TPT];
console.log('N\tkappa\tshapeOnly\torderOnly\tcross\tcrossOverSum\tcrossOverWorse\tcrossRatioCeil\tkahan');
const rows = [];
for (const N of LADDER) {
  const r = measureAtN(N);
  rows.push(r);
  console.log(
    `${r.N}\t${r.kappa.toFixed(1)}\t${r.shapeOnly.toExponential(4)}\t${r.orderOnly.toExponential(4)}\t` +
    `${r.cross.toExponential(4)}\t${r.crossOverSum.toFixed(3)}\t${r.crossOverWorse.toFixed(3)}\t` +
    `${r.crossRatioCeil.toExponential(3)}\t${r.kahan.toExponential(3)}`
  );
}
const factors = rows.map((r) => r.crossOverSum);
console.log('\ncrossOverSum factors across ladder:', factors.map((f) => f.toFixed(3)).join(', '));
console.log('min/max:', Math.min(...factors).toFixed(3), Math.max(...factors).toFixed(3),
  'span-ratio:', (Math.max(...factors) / Math.min(...factors)).toFixed(3));
