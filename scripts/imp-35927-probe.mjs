// Probe: re-run the imp-35852 four hostile orderings on an N ladder, measure how the
// clustered-ordering naive error and its orders-below-ceiling margin scale with N.
const U_ROUNDOFF = 2 ** -53;
const EPS_DOUBLE = 2 ** -52;
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

function sumNaive(terms) { let s = 0; for (let i = 0; i < terms.length; i++) s += terms[i]; return s; }
function sumKahan(terms) { let s = 0, c = 0; for (let i = 0; i < terms.length; i++) { const y = terms[i] - c; const t = s + y; c = t - s - y; s = t; } return s; }
function sumPairwise(terms) {
  const rec = (lo, hi) => {
    if (hi - lo <= 128) { let a = 0; for (let i = lo; i < hi; i++) a += terms[i]; return a; }
    const mid = (lo + hi) >> 1; return rec(lo, mid) + rec(mid, hi);
  };
  return rec(0, terms.length);
}
const FRAC_BITS = 96n;
const _buf = new ArrayBuffer(8); const _dv = new DataView(_buf);
function doubleToFixedBigInt(x) {
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0); const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) { exp = -1074; } else { mant |= 1n << 52n; exp = exp - 1075; }
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

function runN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) { const t = TERM(k); base[k - 1] = t; sumAbs += Math.abs(t); }
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);

  const orderSignedAsc = () => { const a = Float64Array.from(base); a.sort((x, y) => x - y); return a; };
  const orderMagAsc = () => { const a = Float64Array.from(base); a.sort((x, y) => Math.abs(x) - Math.abs(y)); return a; };
  const orderMagDesc = () => { const a = Float64Array.from(base); a.sort((x, y) => Math.abs(y) - Math.abs(x)); return a; };
  const orderClustered = () => {
    const neg = [], pos = [];
    for (let i = 0; i < N; i++) { if (base[i] < 0) neg.push(base[i]); else pos.push(base[i]); }
    return Float64Array.from(neg.concat(pos));
  };
  const builders = { original: () => Float64Array.from(base), signedAsc: orderSignedAsc, magAsc: orderMagAsc, magDesc: orderMagDesc, clustered: orderClustered };

  const ceilNaive = N * EPS_DOUBLE;
  const ceilPairwise = Math.log2(N) * EPS_DOUBLE;
  const out = { N, kappa, sumAbs, trueSum, ceilNaive, ceilPairwise, orderings: {} };
  for (const [name, build] of Object.entries(builders)) {
    const a = build();
    const naive = normalizedError(sumNaive(a), trueNum, sumAbs);
    const pairwise = normalizedError(sumPairwise(a), trueNum, sumAbs);
    const kahan = normalizedError(sumKahan(a), trueNum, sumAbs);
    out.orderings[name] = { naive, pairwise, kahan, naiveOrdersBelowCeiling: Math.log10(ceilNaive / naive) };
  }
  return out;
}

const LADDER = [1e4, 1e5, 4.88602e5, 1e6, 1e7].map((x) => Math.floor(x));
for (const N of LADDER) {
  const t0 = process.hrtime.bigint();
  const r = runN(N);
  const dt = Number(process.hrtime.bigint() - t0) / 1e6;
  const c = r.orderings.clustered;
  console.log(`N=${N} kappa=${r.kappa.toExponential(3)} sumAbs=${r.sumAbs.toFixed(2)} ceilNaive=${r.ceilNaive.toExponential(3)}`);
  console.log(`  clustered naive=${c.naive.toExponential(4)} ordersBelow=${c.naiveOrdersBelowCeiling.toFixed(3)} pairwise=${c.pairwise.toExponential(3)} kahan=${c.kahan.toExponential(3)}  [${dt.toFixed(0)}ms]`);
  const worst = Object.entries(r.orderings).reduce((A, B) => (B[1].naive > A[1].naive ? B : A));
  console.log(`  worst-naive ordering=${worst[0]} naive=${worst[1].naive.toExponential(4)}`);
}

console.log('\n===JSON===');
const full = LADDER.map((N) => runN(N));
console.log(JSON.stringify(full.map((r) => ({
  N: r.N, kappa: r.kappa, sumAbs: r.sumAbs, ceilNaive: r.ceilNaive, ceilPairwise: r.ceilPairwise,
  o: Object.fromEntries(Object.entries(r.orderings).map(([k, v]) => [k, { naive: v.naive, pairwise: v.pairwise, kahan: v.kahan, ob: v.naiveOrdersBelowCeiling }]))
})), null, 1));
