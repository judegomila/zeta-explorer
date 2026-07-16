// imp-36100 offline: does the imp-36062 KBN-vs-Kahan separation onset (N~34000 on the
// imp-35852 clustered worst order) SHIFT on the imp-35812 NATURAL order (k=1..N)?
// Byte-identical schemes + per-N exact 2^-96 dyadic-BigInt reference to imp-36062.
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

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
function sumKBN(terms) {
  let s = 0, c = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
    else c += (x - t) + s;
    s = t;
  }
  return s + c;
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

function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) { const t = TERM(k); base[k - 1] = t; sumAbs += Math.abs(t); }
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);
  // NATURAL order: k = 1..N as generated (imp-35812), NO clustering.
  const kahanNormErr = normalizedError(sumKahan(base), trueNum, sumAbs);
  const kbnNormErr = normalizedError(sumKBN(base), trueNum, sumAbs);
  return {
    N, kappa, kahanNormErr, kbnNormErr,
    kbnStrictlyTighter: kbnNormErr < kahanNormErr,
    kbnOverKahan: kahanNormErr > 0 ? kbnNormErr / kahanNormErr : 1,
    bitIdentical: kbnNormErr === kahanNormErr,
  };
}

const LADDER_SIZES = [1000, 10000, 30000, 33000, 34000, 38000, 40000, 50000, 70000, 100000, 488602];
const LADDER = LADDER_SIZES.map(measureAtN);
const first = LADDER.find((r) => r.kbnStrictlyTighter) || null;
console.log('N\tkappa\tKahan\tKBN\tKBN<Kahan?\tratio\tbitId');
for (const r of LADDER) {
  console.log(`${r.N}\t${r.kappa.toFixed(1)}\t${r.kahanNormErr.toExponential(3)}\t${r.kbnNormErr.toExponential(3)}\t${r.kbnStrictlyTighter}\t${r.kbnOverKahan.toFixed(3)}\t${r.bitIdentical}`);
}
console.log('\nFIRST SEPARATION N (natural):', first ? first.N : 'NONE');
console.log('clustered onset (imp-36062): 34000');
