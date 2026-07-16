// imp-36020 offline probe: sweep ALL seven imp-35893 pairing-tree shapes under the
// imp-35852 CLUSTERED same-sign term ORDER at N~488602 to locate the arg-max shape
// (imp-35973 reported a caterpillarR->caterpillarL flip only for its fixed shape set).
// Measurement only; NO QED.

const T_PT = 3e12;
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT);
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

const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1],
  ['skew0.25', (lo, hi) => lo + Math.floor((hi - lo) * 0.25)],
  ['skew0.1', (lo, hi) => lo + Math.floor((hi - lo) * 0.1)],
  ['skew0.03', (lo, hi) => lo + Math.floor((hi - lo) * 0.03)],
  ['skew0.01', (lo, hi) => lo + Math.floor((hi - lo) * 0.01)],
  ['caterpillarL', (lo, hi, leaf) => lo + leaf],
  ['caterpillarR', (lo, hi, leaf) => hi - leaf],
];

const N = N_AT_TPT;
const base = new Float64Array(N);
let sumAbs = 0;
for (let k = 1; k <= N; k++) {
  const t = TERM(k);
  base[k - 1] = t;
  sumAbs += Math.abs(t);
}
let trueNum = 0n;
for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);

// imp-35852 worst term ORDER: clustered same-sign runs (all negatives, then all positives).
const neg = [], pos = [];
for (let i = 0; i < N; i++) { if (base[i] < 0) neg.push(base[i]); else pos.push(base[i]); }
const clustered = Float64Array.from(neg.concat(pos));

const CEIL_PAIRWISE = Math.log2(N) * EPS_DOUBLE;

console.log(`N=${N}  neg=${neg.length}  pos=${pos.length}  ceiling(log2(N)*eps)=${CEIL_PAIRWISE.toExponential(4)}`);
console.log('shape\tdepth\tcombinedErr\terr/ceiling');
const rows = [];
for (const [name, splitter] of TREE_SHAPES) {
  const { sum, maxDepth } = sumTree(clustered, splitter, LEAF);
  const err = normalizedError(sum, trueNum, sumAbs);
  rows.push({ name, depth: maxDepth, err, ratio: err / CEIL_PAIRWISE });
  console.log(`${name}\t${maxDepth}\t${err.toExponential(4)}\t${(err / CEIL_PAIRWISE).toExponential(4)}`);
}
const argmax = rows.reduce((a, b) => (b.err > a.err ? b : a));
console.log(`\nARG-MAX shape under clustered order: ${argmax.name}  err=${argmax.err.toExponential(4)}  ratio=${(argmax.ratio).toExponential(4)} (~${(argmax.ratio * 100).toFixed(1)}% of ceiling)`);
