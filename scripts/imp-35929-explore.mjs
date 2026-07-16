// imp-35929 exploration: find (alpha,beta) rungs reaching kappa ~1e6..1e7 and measure
// naive/pairwise/Kahan errors vs exact BigInt 2^-96 reference on the imp-35812 term family.
const T_PT = 3e12;
const N = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602
const U = 2 ** -53;
const TERM = (alpha, beta, k) => Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);

function sumNaive(t) { let s = 0; for (let i = 0; i < t.length; i++) s += t[i]; return s; }
function sumKahan(t) { let s = 0, c = 0; for (let i = 0; i < t.length; i++) { const y = t[i] - c; const q = s + y; c = q - s - y; s = q; } return s; }
function sumPairwise(t) { const rec = (lo, hi) => { if (hi - lo <= 128) { let a = 0; for (let i = lo; i < hi; i++) a += t[i]; return a; } const mid = (lo + hi) >> 1; return rec(lo, mid) + rec(mid, hi); }; return rec(0, t.length); }

const FRAC = 96n;
const buf = new ArrayBuffer(8), dv = new DataView(buf);
function d2f(x) {
  if (x === 0) return 0n;
  dv.setFloat64(0, x);
  const hi = dv.getUint32(0), lo = dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) exp = -1074; else { mant |= 1n << 52n; exp -= 1075; }
  const shift = BigInt(exp) + FRAC;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}
function normErr(res, trueNum, sumAbs) {
  const e = d2f(res) - trueNum;
  const ae = e < 0n ? -e : e;
  return Number(ae << 80n) / 2 ** 80 / 2 ** 96 / sumAbs;
}

function measure(alpha, beta) {
  const terms = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) { const t = TERM(alpha, beta, k); terms[k - 1] = t; sumAbs += Math.abs(t); }
  const naive = sumNaive(terms), pw = sumPairwise(terms), kh = sumKahan(terms);
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += d2f(terms[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);
  const naiveNorm = normErr(naive, trueNum, sumAbs);
  const pwNorm = normErr(pw, trueNum, sumAbs);
  const khNorm = normErr(kh, trueNum, sumAbs);
  return { alpha, beta, kappa, sumAbs, trueSum, naiveNorm, pwNorm, khNorm,
    naiveRel: naiveNorm * kappa, pwRel: pwNorm * kappa, khRel: khNorm * kappa };
}

// Search: scan a fine alpha grid near the deep-cancellation region and keep the top kappas.
const all = [];
for (let a = 3.0e-5; a <= 8.0e-5; a += 5.0e-8) {
  for (const b of [0.7, 1.0, 1.2, 1.5, 2.0, 2.4]) {
    all.push(measure(a, b));
  }
}
all.sort((x, y) => y.kappa - x.kappa);
console.log('N=', N, 'sqrtN*u=', (Math.sqrt(N) * U).toExponential(3), 'u=', U.toExponential(3));
console.log('top 30 by kappa:');
for (const r of all.slice(0, 30)) {
  console.log(
    `k=${r.kappa.toExponential(3)} |S|=${Math.abs(r.trueSum).toExponential(3)} a=${r.alpha.toExponential(6)} b=${r.beta} ` +
    `nN=${r.naiveNorm.toExponential(3)} nRel=${r.naiveRel.toExponential(3)} khN=${r.khNorm.toExponential(3)} khRel=${r.khRel.toExponential(3)} 2uk=${(2 * U * r.kappa).toExponential(3)}`);
}
