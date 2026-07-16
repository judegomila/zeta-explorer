// imp-36023 offline probe: does Kahan-Babuska-Neumaier (KBN) compensated summation on the
// imp-35973 COMBINED worst-case configuration (the imp-35852 clustered same-sign ORDER --
// all negatives then all positives, which is the worst ordering AND the traversal that the
// caterpillar pairing shape induces) stay at the unit-roundoff floor across the imp-35812 N
// ladder [1000, 10000, 100000, 488602], or does the compensated floor DRIFT with N?
// imp-35973 measured the ~2.31e-19 KBN floor only at the single N=488602 endpoint.
// Distinct from imp-35955 (Kahan on the caterpillarR shape-only / original order).
// Measurement only; certifies no bound; changes no bound; NO QED.

const T_PT = 3e12;
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT);
const U_ROUNDOFF = 2 ** -53; // unit roundoff u = eps/2
const EPS_DOUBLE = 2 ** -52;
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// naive left-to-right accumulation (baseline for contrast)
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}

// classic Kahan compensated summation
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

// Kahan-Babuska-Neumaier (KBN): improved compensation that is correct even when the
// running sum is smaller in magnitude than the incoming term.
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
  const kappa = sumAbs / Math.abs(trueSum); // conditioning of the sum

  // imp-35852 worst term ORDER: clustered same-sign runs (all negatives, then all positives).
  const neg = [], pos = [];
  for (let i = 0; i < N; i++) { if (base[i] < 0) neg.push(base[i]); else pos.push(base[i]); }
  const clustered = Float64Array.from(neg.concat(pos));

  const naiveErr = normalizedError(sumNaive(clustered), trueNum, sumAbs);
  const kahanErr = normalizedError(sumKahan(clustered), trueNum, sumAbs);
  const kbnErr = normalizedError(sumKBN(clustered), trueNum, sumAbs);
  return {
    N, kappa,
    naiveErr, kahanErr, kbnErr,
    floorU: U_ROUNDOFF, // ~1.11e-16 target if error were a plain u-floor
  };
}

const LADDER = [1000, 10000, 100000, N_AT_TPT];
console.log(`unit roundoff u = 2^-53 = ${U_ROUNDOFF.toExponential(4)}`);
console.log('N\tkappa\tnaive(clustered)\tKahan\tKBN\tKBN/u');
const rows = [];
for (const N of LADDER) {
  const r = measureAtN(N);
  rows.push(r);
  console.log(
    `${r.N}\t${r.kappa.toFixed(1)}\t${r.naiveErr.toExponential(4)}\t` +
    `${r.kahanErr.toExponential(4)}\t${r.kbnErr.toExponential(4)}\t${(r.kbnErr / U_ROUNDOFF).toExponential(3)}`
  );
}

const kbn = rows.map((r) => r.kbnErr);
const kbnMin = Math.min(...kbn.filter((x) => x > 0));
const kbnMax = Math.max(...kbn);
console.log('\nKBN normalized errors across ladder:', kbn.map((x) => x.toExponential(4)).join(', '));
console.log('KBN min/max (nonzero):', kbnMin.toExponential(4), kbnMax.toExponential(4),
  'span-ratio:', (kbnMax / (kbnMin || kbnMax)).toExponential(3));
console.log('N-flatness verdict: KBN error is', (kbnMax <= 4 * U_ROUNDOFF ? 'AT the unit-roundoff floor (<=4u) across the whole ladder -- N-FLAT, no drift' : 'NOT uniformly at the u-floor -- drifts with N'));
