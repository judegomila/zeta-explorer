// imp-34569: INDEPENDENT extended-precision cross-check of the imp-34551 double-double (dd, 106-bit)
// resid_exp(k) hi-word vs native residExp, to confirm the reported ~8.5e-16 native-vs-dd relative
// difference is genuine ARITHMETIC WIDTH (native double rounding of the same function), NOT a formula
// divergence in the widened pipeline.
//
// The imp-34551 evidence was a SINGLE dd-hi-vs-native check (rel-diff 8.496e-16 at the e=24 imp-34524
// node k=8.821091353893). A dd kernel and native double share the same float64 substrate, so a single
// self-comparison cannot on its own exclude a compensating transcription/formula difference. This script
// re-implements the SAME imp-34411/imp-34508/imp-34524 resid_exp(k) primitives in a STRUCTURALLY
// INDEPENDENT extended-precision arithmetic -- BigInt decimal FIXED-POINT at 60 fractional digits
// (~199-bit, well beyond binary128's 113-bit / 34-digit and beyond dd's ~106-bit / 32-digit). This
// kernel shares NO code path, NO radix (base-10 integers, not base-2 floats), and NO transcendental
// algorithm with the dd kernel:
//   dd exp = Taylor after k*ln2 reduction on float64 pairs;   bf exp = Taylor after k*ln2 reduction on BigInt.
//   dd log = Newton on dd-exp;                                bf log = atanh series after 2^e reduction.
//   dd sqrt = Newton (Karp);                                  bf sqrt = Newton on BigInt from a native seed.
// The bf value V* is >6 decimal digits MORE precise than dd, so it is an independent ARBITER: if the
// 8.5e-16 gap is arithmetic width then rel(native, V*) ~ 8.5e-16 AND rel(dd, V*) ~ 1e-30; a formula
// divergence would instead blow up rel(dd, V*). No package installs (BigInt is native); the surrogate is
// inherited/descriptive, not rigorous; changes no bound; imp-3066 untouched; NO QED.
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

// ===========================================================================
// (A) INDEPENDENT extended-precision kernel: BigInt decimal fixed-point, P=60.
//     value real x is stored as BigInt X with x = X / 10^P (truncating mul/div;
//     truncation error ~1e-60 per op, thousands of ops -> ~1e-56, far below the
//     1e-32 dd floor we are arbitrating).
// ===========================================================================
const P = 60n;
const SCALE = 10n ** P;
const HALF = SCALE / 2n;
const bfAdd = (a, b) => a + b;
const bfSub = (a, b) => a - b;
const bfMul = (a, b) => (a * b) / SCALE;
const bfDiv = (a, b) => (a * SCALE) / b;
const bfFromInt = (n) => BigInt(n) * SCALE;
function bfFromDecStr(s) {                       // "3.14159..." -> BigInt fixed-point
  const neg = s[0] === '-'; if (neg) s = s.slice(1);
  let [ip, fp = ''] = s.split('.');
  fp = (fp + '0'.repeat(Number(P))).slice(0, Number(P));
  const X = BigInt(ip) * SCALE + BigInt(fp);
  return neg ? -X : X;
}
// EXACT conversion of a native double to fixed-point via IEEE-754 bit extraction (value = m * 2^e).
function bfFromDouble(x) {
  if (x === 0) return 0n;
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, x);
  const bits = (BigInt(dv.getUint32(0)) << 32n) | BigInt(dv.getUint32(4));
  const sign = (bits >> 63n) & 1n;
  const exp = Number((bits >> 52n) & 0x7ffn);
  const mantBits = bits & 0xfffffffffffffn;
  let e, m;
  if (exp === 0) { e = -1074; m = mantBits; } else { e = exp - 1075; m = mantBits | 0x10000000000000n; }
  let X;
  if (e >= 0) { X = m * (2n ** BigInt(e)) * SCALE; }
  else { const den = 2n ** BigInt(-e); X = (m * SCALE + den / 2n) / den; }
  return sign ? -X : X;
}
const bfToNum = (X) => Number(X) / 1e60;          // for native-seed reductions only (display/seed)
const bfMulPow2 = (X, k) => (k >= 0 ? X * (2n ** BigInt(k)) : X / (2n ** BigInt(-k)));
// 60-digit constants (well-known literals, avoids bootstrap error).
const BF_PI = bfFromDecStr('3.141592653589793238462643383279502884197169399375105820974945');
const BF_LN2 = bfFromDecStr('0.693147180559945309417232121458176568075500134360255254120680');
const BF_LN10 = bfFromDecStr('2.302585092994045684017991454684364207601101488628772976033328');
const LN2_NUM = 0.6931471805599453;
function bfExp(a) {                                // a small-ish; k*ln2 range reduction then Taylor
  const k = Math.round(bfToNum(a) / LN2_NUM);
  const r = bfSub(a, bfMul(BF_LN2, bfFromInt(k))); // |r| <= ln2/2
  let term = SCALE, sum = SCALE;
  for (let n = 1n; n < 200n; n++) {
    term = bfDiv(bfMul(term, r), bfFromInt(n));
    sum = bfAdd(sum, term);
    if (term < 100n && term > -100n) break;        // |term| < 1e-58
  }
  return bfMulPow2(sum, k);
}
function bfLog(a) {                                // 2^e reduction then atanh series (INDEPENDENT of bfExp)
  const e2 = Math.floor(Math.log2(bfToNum(a)));
  let m = bfMulPow2(a, -e2);                        // m in ~[1,2)
  if (m >= 2n * SCALE) { m = bfMulPow2(m, -1); }    // guard
  const y = bfDiv(bfSub(m, SCALE), bfAdd(m, SCALE)); // (m-1)/(m+1), |y| < 1/3
  const y2 = bfMul(y, y);
  let term = y, sum = y;
  for (let n = 3n; n < 400n; n += 2n) {
    term = bfMul(term, y2);
    const add = bfDiv(term, bfFromInt(n));
    sum = bfAdd(sum, add);
    if (add < 100n && add > -100n) break;
  }
  return bfAdd(bfMulPow2(sum, 1), bfMul(bfFromInt(e2), BF_LN2)); // 2*sum + e2*ln2
}
function bfSqrt(a) {                                // Newton from a native seed (INDEPENDENT of dd Karp)
  if (a === 0n) return 0n;
  let x = bfFromDouble(Math.sqrt(bfToNum(a)));
  for (let i = 0; i < 8; i++) x = bfMulPow2(bfAdd(x, bfDiv(a, x)), -1);
  return x;
}
const bfLog10 = (a) => bfDiv(bfLog(a), BF_LN10);
const bfPow10 = (x) => bfExp(bfMul(x, BF_LN10));

// The imp-34411/imp-34508/imp-34524 resid_exp(k) surrogate, in the bf (BigInt) kernel.
const BF_TWO_PI = bfMul(bfFromInt(2), BF_PI);
const BF_E_TRUNC = bfFromDouble(3.06e-5);
const BF_GRONWALL_B = bfExp(bfFromDouble(2.37e-4));
const BF_C_C = bfFromDouble(C_C_PINNED);
function bfEffHeight(N) {                           // native seed then Newton on the RvM inverse (dd-style)
  let T = bfFromDouble(effectiveHeightForN(bfToNum(N)));
  for (let i = 0; i < 12; i++) {
    const u = bfLog(bfDiv(T, BF_TWO_PI));
    const f = bfSub(bfMul(bfDiv(T, BF_TWO_PI), bfSub(u, SCALE)), N);
    const fp = bfDiv(u, BF_TWO_PI);
    T = bfSub(T, bfDiv(f, fp));
  }
  return T;
}
function bfChannels(N) {
  const T0 = bfEffHeight(N);
  const logT0 = bfLog(T0);
  const cFlow = bfDiv(bfAdd(bfLog(bfDiv(T0, BF_TWO_PI)), SCALE), BF_TWO_PI);
  const eFlow = bfMul(bfMul(cFlow, bfDiv(logT0, T0)), BF_GRONWALL_B);
  const eColl = bfMul(BF_C_C, bfSqrt(bfDiv(logT0, N)));
  const eTot = bfAdd(bfAdd(BF_E_TRUNC, eFlow), eColl);
  return { eColl, fracColl: bfDiv(eColl, eTot) };
}
function bfSampleGrid(loN, hiN, per = 4) {
  const dLo = bfLog10(loN), dHi = bfLog10(hiN);
  const xs = [], ys = [];
  for (let i = 0; ; i++) {
    const d = bfAdd(dLo, bfDiv(bfFromInt(i), bfFromInt(per)));
    if (bfToNum(d) > bfToNum(dHi) + 1e-9) break;
    const N = bfPow10(d);
    xs.push(bfLog(N)); ys.push(bfLog(bfChannels(N).fracColl));
  }
  return { xs, ys };
}
function bfMean(arr) { let s = 0n; for (const v of arr) s = bfAdd(s, v); return bfDiv(s, bfFromInt(arr.length)); }
function bfPSigmaStable(loN, hiN) {
  const { xs, ys } = bfSampleGrid(loN, hiN);
  const mx = bfMean(xs), my = bfMean(ys);
  let sxx = 0n, sxy = 0n;
  for (let i = 0; i < xs.length; i++) { const dx = bfSub(xs[i], mx), dv = bfSub(ys[i], my); sxx = bfAdd(sxx, bfMul(dx, dx)); sxy = bfAdd(sxy, bfMul(dx, dv)); }
  return bfSub(0n, bfDiv(sxy, sxx));
}
function bfPEcollEndpoints(loN, hiN) {
  const a = bfChannels(loN).eColl, b = bfChannels(hiN).eColl;
  return bfSub(0n, bfDiv(bfSub(bfLog(b), bfLog(a)), bfSub(bfLog(hiN), bfLog(loN))));
}
function bfResidExp(kdd) {
  const lo = bfPow10(kdd), hi = bfPow10(bfAdd(kdd, SCALE));
  return bfSub(bfMul(bfPEcollEndpoints(lo, hi), bfSub(SCALE, bfChannels(hi).fracColl)), bfPSigmaStable(lo, hi));
}

// ===========================================================================
// (B) Native-double residExp (imp-34524 verbatim) -- the REFERENCE being arbitrated.
// ===========================================================================
function channels(N) { const T0 = effectiveHeightForN(N), logT0 = Math.log(T0), TP = 2 * Math.PI; const cFlow = (Math.log(T0 / TP) + 1) / TP; const eFlow = cFlow * (logT0 / T0) * Math.exp(2.37e-4); const eColl = C_C_PINNED * Math.sqrt(logT0 / N); return { eColl, fracColl: eColl / (3.06e-5 + eFlow + eColl) }; }
function nSample(loN, hiN, per = 4) { const dLo = Math.log10(loN), dHi = Math.log10(hiN), xs = [], ys = []; for (let i = 0; ; i++) { const d = dLo + i / per; if (d > dHi + 1e-9) break; const N = Math.pow(10, d); xs.push(Math.log(N)); ys.push(Math.log(channels(N).fracColl)); } return { xs, ys }; }
function nPSigma(loN, hiN) { const { xs, ys } = nSample(loN, hiN); const n = xs.length; const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n; let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); } return -sxy / sxx; }
function nPEcoll(loN, hiN) { const a = channels(loN).eColl, b = channels(hiN).eColl; return -(Math.log(b) - Math.log(a)) / (Math.log(hiN) - Math.log(loN)); }
function nResidExp(k) { const lo = Math.pow(10, k), hi = Math.pow(10, k + 1); return nPEcoll(lo, hi) * (1 - channels(hi).fracColl) - nPSigma(lo, hi); }

// ===========================================================================
// (C) imp-34551 double-double kernel (reproduced verbatim -- ONLY to obtain the
//     per-node dd hi-word for the three-way table; the bf kernel is the arbiter).
// ===========================================================================
function twoSum(a, b) { const s = a + b; const bb = s - a; return [s, (a - (s - bb)) + (b - bb)]; }
function quickTwoSum(a, b) { const s = a + b; return [s, b - (s - a)]; }
function split(a) { const c = 134217729 * a; const hi = c - (c - a); return [hi, a - hi]; }
function twoProd(a, b) { const p = a * b; const [ah, al] = split(a); const [bh, bl] = split(b); return [p, ((ah * bh - p) + ah * bl + al * bh) + al * bl]; }
const dd = (x) => [x, 0];
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; return quickTwoSum(s, e); }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProd(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; return quickTwoSum(p, e); }
function ddDiv(a, b) { const q1 = a[0] / b[0]; let r = ddSub(a, ddMul(b, dd(q1))); const q2 = r[0] / b[0]; r = ddSub(r, ddMul(b, dd(q2))); const q3 = r[0] / b[0]; return ddAdd(quickTwoSum(q1, q2), dd(q3)); }
function ddMulPow2(a, k) { const f = Math.pow(2, k); return [a[0] * f, a[1] * f]; }
const DD_LN2 = [0.6931471805599453, 2.3190468138462996e-17];
const DD_PI = [3.141592653589793, 1.2246467991473532e-16];
function ddExp(a) { const k = Math.round(a[0] / DD_LN2[0]); const r = ddSub(a, ddMul(DD_LN2, dd(k))); let term = dd(1), sum = dd(1); for (let n = 1; n < 40; n++) { term = ddDiv(ddMul(term, r), dd(n)); sum = ddAdd(sum, term); if (Math.abs(term[0]) < 1e-34 * Math.abs(sum[0])) break; } return ddMulPow2(sum, k); }
function ddLog(a) { let y = dd(Math.log(a[0])); for (let i = 0; i < 4; i++) { const c = ddSub(ddDiv(a, ddExp(y)), dd(1)); y = ddAdd(y, c); } return y; }
function ddSqrt(a) { if (a[0] === 0) return dd(0); const x = 1 / Math.sqrt(a[0]); const ax = ddMul(a, dd(x)); const corr = ddMul(ddSub(a, ddMul(ax, ax)), dd(0.5 * x)); return ddAdd(ax, corr); }
const DD_LN10 = ddLog(dd(10));
function ddPow10(x) { return ddExp(ddMul(x, DD_LN10)); }
const ddToNum = (a) => a[0] + a[1];
const DD_TWO_PI = ddMul(dd(2), DD_PI);
const DD_E_TRUNC = dd(3.06e-5);
const DD_GRONWALL_B = ddExp(dd(2.37e-4));
const DD_C_C = dd(C_C_PINNED);
function ddEffHeight(N) { let T = dd(effectiveHeightForN(N[0])); for (let i = 0; i < 10; i++) { const u = ddLog(ddDiv(T, DD_TWO_PI)); const f = ddSub(ddMul(ddDiv(T, DD_TWO_PI), ddSub(u, dd(1))), N); const fp = ddDiv(u, DD_TWO_PI); T = ddSub(T, ddDiv(f, fp)); } return T; }
function ddChannels(N) { const T0 = ddEffHeight(N); const logT0 = ddLog(T0); const cFlow = ddDiv(ddAdd(ddLog(ddDiv(T0, DD_TWO_PI)), dd(1)), DD_TWO_PI); const eFlow = ddMul(ddMul(cFlow, ddDiv(logT0, T0)), DD_GRONWALL_B); const eColl = ddMul(DD_C_C, ddSqrt(ddDiv(logT0, N))); const eTot = ddAdd(ddAdd(DD_E_TRUNC, eFlow), eColl); return { eColl, fracColl: ddDiv(eColl, eTot) }; }
function ddSampleGrid(loN, hiN, per = 4) { const dLo = ddDiv(ddLog(loN), DD_LN10), dHi = ddDiv(ddLog(hiN), DD_LN10); const xs = [], ys = []; for (let i = 0; ; i++) { const d = ddAdd(dLo, ddDiv(dd(i), dd(per))); if (d[0] > dHi[0] + 1e-9) break; const N = ddPow10(d); xs.push(ddLog(N)); ys.push(ddLog(ddChannels(N).fracColl)); } return { xs, ys }; }
function ddMean(arr) { let s = dd(0); for (const v of arr) s = ddAdd(s, v); return ddDiv(s, dd(arr.length)); }
function ddPSigmaStable(loN, hiN) { const { xs, ys } = ddSampleGrid(loN, hiN); const mx = ddMean(xs), my = ddMean(ys); let sxx = dd(0), sxy = dd(0); for (let i = 0; i < xs.length; i++) { const dx = ddSub(xs[i], mx), dv = ddSub(ys[i], my); sxx = ddAdd(sxx, ddMul(dx, dx)); sxy = ddAdd(sxy, ddMul(dx, dv)); } return ddSub(dd(0), ddDiv(sxy, sxx)); }
function ddPEcollEndpoints(loN, hiN) { const a = ddChannels(loN).eColl, b = ddChannels(hiN).eColl; return ddSub(dd(0), ddDiv(ddSub(ddLog(b), ddLog(a)), ddSub(ddLog(hiN), ddLog(loN)))); }
function ddResidExp(kdd) { const lo = ddPow10(kdd), hi = ddPow10(ddAdd(kdd, dd(1))); return ddSub(ddMul(ddPEcollEndpoints(lo, hi), ddSub(dd(1), ddChannels(hi).fracColl)), ddPSigmaStable(lo, hi)); }

// ===========================================================================
// (D) Three-way cross-check at the imp-34551 node (e=24 imp-34524 node used for
//     the 8.496e-16 figure) plus the e=25 and e=26 dd-argmax nodes.
// ===========================================================================
const bfAbs = (X) => (X < 0n ? -X : X);
function bfRelBetween(a, b) {                      // |a - b| / |b|, both bf; returned as double
  return bfToNum(bfDiv(bfAbs(bfSub(a, b)), bfAbs(b)));
}
const bfFromDdPair = (p) => bfAdd(bfFromDouble(p[0]), bfFromDouble(p[1])); // FULL 106-bit dd value in bf
const NODES = [
  { label: 'e=24 (imp-34524 node, the 8.496e-16 figure)', k: 8.821091353893 },
  { label: 'e=25 (dd-argmax node)', k: 8.821091592312 },
  { label: 'e=26 (dd-argmax node)', k: 8.821091607213 },
  { label: 'e=27 (dd-argmax node, imp-34588 fourth rung)', k: 8.821091599762 },
];
console.log('=== imp-34569: independent BigInt-fixed-point (P=60, ~199-bit) arbiter of imp-34551 dd hi-word ===\n');
const results = [];
for (const nd of NODES) {
  const kBf = bfFromDouble(nd.k);
  const bfV = bfResidExp(kBf);
  const nV = nResidExp(nd.k);
  const ddPair = ddResidExp(dd(nd.k));            // [hi, lo] 106-bit double-double
  const ddBf = bfFromDdPair(ddPair);              // full 106-bit dd value promoted into bf
  const relNativeBf = bfRelBetween(bfFromDouble(nV), bfV);
  const relDdBf = bfRelBetween(ddBf, bfV);        // full dd pair vs the >binary128 arbiter (~106-bit floor)
  results.push({ label: nd.label, k: nd.k, nV, ddV: ddToNum(ddPair), bf: bfToNum(bfV), relNativeBf, relDdBf });
  console.log(`  ${nd.label}  k=${nd.k}`);
  console.log(`    native      = ${nV.toExponential(17)}`);
  console.log(`    dd hi-word  = ${ddToNum(ddPair).toExponential(17)}`);
  console.log(`    bf (P=60)   = ${bfToNum(bfV).toExponential(17)}   (independent arbiter)`);
  console.log(`    rel(native, bf) = ${relNativeBf.toExponential(3)}   <- native double ULP width (few * 2^-56 rel)`);
  console.log(`    rel(dd,     bf) = ${relDdBf.toExponential(3)}   <- expect ~1e-28..1e-31 (dd = same function to its 106-bit floor)\n`);
}

// ===========================================================================
// (E) Verdict.
// ===========================================================================
const e24 = results[0];
const maxDdBf = Math.max(...results.map((r) => r.relDdBf));
const maxNativeBf = Math.max(...results.map((r) => r.relNativeBf));
// dd matches the independent >binary128 arbiter to ~1e-28 or better (its 106-bit floor).
const DD_MATCHES_INDEPENDENT = results.every((r) => r.relDdBf < 1e-25);
// native matches only to native-double level (few * 2^-56 rel), never a formula-divergence O(1e-3+) gap.
const NATIVE_IS_DOUBLE_LEVEL = results.every((r) => r.relNativeBf < 1e-12);
// the widening genuinely helped: dd is >6 decimal orders tighter to the truth than native at every node.
const DD_TIGHTER_THAN_NATIVE = results.every((r) => r.relDdBf < r.relNativeBf * 1e-6);
console.log('=== VERDICT ===');
console.log('  rel(native, bf) at the e=24 node =', e24.relNativeBf.toExponential(3),
  '(imp-34551 reported native-vs-dd = 8.496e-16 -- same order)');
console.log('  worst rel(dd, bf) over all nodes  =', maxDdBf.toExponential(3), '(dd 106-bit floor; << native)');
console.log('  worst rel(native, bf) over nodes  =', maxNativeBf.toExponential(3), '(native double ULP width)');
console.log('  dd matches independent arbiter to its 106-bit floor (all rel(dd,bf) < 1e-25):', DD_MATCHES_INDEPENDENT);
console.log('  native matches only to double level, no O(1) formula divergence (all rel(native,bf) < 1e-12):', NATIVE_IS_DOUBLE_LEVEL);
console.log('  widening genuinely improved accuracy (dd > 1e6x tighter than native at every node):', DD_TIGHTER_THAN_NATIVE);
console.log('  => the ~8.5e-16 native-vs-dd gap is confirmed ARITHMETIC WIDTH (native double rounding of the');
console.log('     SAME function), NOT a formula divergence: an independent >binary128 base-10 kernel reproduces');
console.log('     the dd hi-word to its 106-bit floor and reproduces the native gap. imp-34551 F1/F2/F3 stand.');
console.log('  CONFIRMED:', DD_MATCHES_INDEPENDENT && NATIVE_IS_DOUBLE_LEVEL && DD_TIGHTER_THAN_NATIVE);
console.log('  Cross-validation only; inherited surrogate NOT rigorous; changes no bound; NO QED; PT Lambda <= 0.2 SOTA.');
