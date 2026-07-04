// imp-33563 offline probe: extend the imp-33534 double-double reference-libm single-hit error
// measurement of the imp-33249 grade6/171p -ln A(tau) single hit ABOVE tau=6 (tau in {6.5..10},
// the imp-33277/imp-33312 higher-height regime) to test whether the ~0.947 ULP peak reference
// error (imp-33534, at tau=2.5 on tau in {0.5..6}) RECURS, GROWS, or DECAYS with height.
//
// Machinery: the imp-33534 double vs ~106-bit double-double reference-precision libm reused
// VERBATIM (Dekker/Knuth twoSum/twoProd, range-reduced Taylor ddExp, one-Newton-step ddLog).
// Panel budget FIXED at the imp-33249 grade6/171p single hit. For each tau we compute the fp64
// single-hit -ln A(tau) and its double-double reference, and report
//   refErr(tau) = |double - reference| / (|reference|*EPS)   [in double ULP].
// Accuracy measurement only; changes no bound; imp-3066 untouched.

const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52);
const HI = 14;
const GRADE = 6;
const PANELS = 171; // the imp-33249 grade6/171p min-node single hit, FIXED

const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845, 0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806, 0.0666713443086881,
];

// -- (A) DOUBLE baseline (imp-33534/imp-33312 verbatim) -------------------------------------------
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}
function negLnAdouble(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

// -- (B) DOUBLE-DOUBLE reference libm (imp-33534 verbatim) ----------------------------------------
const SPLIT = 134217729;
function twoSum(a, b) { const s = a + b; const v = s - a; const e = (a - (s - v)) + (b - v); return [s, e]; }
function quickTwoSum(a, b) { const s = a + b; const e = b - (s - a); return [s, e]; }
function twoProd(a, b) {
  const p = a * b;
  const ca = SPLIT * a; const ah = ca - (ca - a); const al = a - ah;
  const cb = SPLIT * b; const bh = cb - (cb - b); const bl = b - bh;
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, e];
}
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; return quickTwoSum(s, e); }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProd(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; return quickTwoSum(p, e); }
function ddMulN(a, x) { let [p, e] = twoProd(a[0], x); e += a[1] * x; return quickTwoSum(p, e); }
function ddDiv(a, b) {
  const q1 = a[0] / b[0];
  let r = ddSub(a, ddMulN(b, q1));
  const q2 = r[0] / b[0];
  r = ddSub(r, ddMulN(b, q2));
  const q3 = r[0] / b[0];
  const [s, e] = quickTwoSum(q1, q2);
  return ddAdd([s, e], [q3, 0]);
}
const LN2 = [6.931471805599453e-1, 2.3190468138462996e-17];
function ddExp(x) {
  const xh = x[0];
  if (xh <= -745) return [0, 0];
  if (xh >= 709) return [Infinity, 0];
  const k = Math.round(xh / LN2[0]);
  const r = ddSub(x, ddMulN(LN2, k));
  let term = [1, 0];
  let sum = [1, 0];
  for (let n = 1; n <= 24; n += 1) {
    term = ddDiv(ddMul(term, r), [n, 0]);
    sum = ddAdd(sum, term);
    if (Math.abs(term[0]) < 1e-34 * Math.abs(sum[0])) break;
  }
  const scale = Math.pow(2, k);
  return [sum[0] * scale, sum[1] * scale];
}
function ddLog(x) {
  const y0 = Math.log(x[0]);
  const t = ddMul(x, ddExp([-y0, 0]));
  return ddAdd([y0, 0], ddSub(t, [1, 0]));
}
function logPhiFactoredDD(u) {
  const uu = [u, 0];
  const e2 = ddExp(ddMulN(uu, 2));
  const e4 = ddExp(ddMulN(uu, 4));
  let acc = [0, 0];
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = ddSub(ddMulN(e4, 2 * PI * PI * n4), ddMulN(e2, 3 * PI * n2));
    const ex = ddExp(ddMulN(e4, -PI * (n2 - 1)));
    acc = ddAdd(acc, ddMul(amp, ex));
  }
  return ddAdd(ddMulN(e4, -PI), ddLog(acc));
}
function negLnAreference(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      const lw = ddLog([GL_W[k] * half, 0]);
      terms.push(ddAdd(ddAdd(lw, logPhiFactoredDD(s)), logPhiFactoredDD(s + tau)));
    }
  }
  let mx = [-Infinity, 0];
  for (const t of terms) if (t[0] > mx[0]) mx = t;
  let acc = [0, 0];
  for (const t of terms) acc = ddAdd(acc, ddExp(ddSub(t, mx)));
  const res = ddSub([0, 0], ddAdd(mx, ddLog(acc)));
  return res[0] + res[1];
}

function refErr(tau) {
  const d = negLnAdouble(tau, HI, PANELS, GRADE);
  const r = negLnAreference(tau, HI, PANELS, GRADE);
  const ulp = Math.abs(r) * EPS;
  return { err: Math.abs(d - r) / ulp, ref: r };
}

// -- (C) the extended-tau sweep at FIXED grade6/171p ----------------------------------------------
// original imp-33534 grid {0.5..6} for the reproduce anchor, then the extension {6.5..10}
const ORIG_TAUS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];
const EXT_TAUS = [6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

console.log('imp-33563: extended-tau (>6) fp64-vs-double-double reference-libm error of -ln A(tau)');
console.log('grade %d, panels %d (imp-33249 single hit), reference error in DOUBLE ULP\n', GRADE, PANELS);

console.log('-- imp-33534 anchor grid tau in {0.5..6} --');
console.log('  tau    refErr(ULP)      -ln A(tau)');
let origPeak = -Infinity; let origPeakTau = null;
for (const tau of ORIG_TAUS) {
  const { err, ref } = refErr(tau);
  if (err > origPeak) { origPeak = err; origPeakTau = tau; }
  console.log(`  ${tau.toFixed(1)}    ${err.toFixed(4)}          ${ref.toExponential(6)}`);
}
console.log('  anchor peak = %s ULP @tau=%s\n', origPeak.toFixed(4), origPeakTau.toFixed(1));

console.log('-- EXTENSION grid tau in {6.5..10} --');
console.log('  tau    refErr(ULP)      -ln A(tau)');
let extPeak = -Infinity; let extPeakTau = null;
let extSum = 0; let extOver = 0;
const extRows = [];
for (const tau of EXT_TAUS) {
  const { err, ref } = refErr(tau);
  extSum += err;
  if (err > 0.24) extOver += 1;
  if (err > extPeak) { extPeak = err; extPeakTau = tau; }
  extRows.push({ tau, err });
  console.log(`  ${tau.toFixed(1)}    ${err.toFixed(4)}          ${ref.toExponential(6)}`);
}
const extMean = extSum / EXT_TAUS.length;

console.log('\n-- verdict --');
console.log('imp-33534 anchor peak {0.5..6}    = %s ULP @tau=%s', origPeak.toFixed(4), origPeakTau.toFixed(1));
console.log('extension peak {6.5..10}          = %s ULP @tau=%s', extPeak.toFixed(4), extPeakTau.toFixed(1));
console.log('extension mean {6.5..10}          = %s ULP', extMean.toFixed(4));
console.log('extension #taus over 0.24 headroom = %d/%d', extOver, EXT_TAUS.length);
const grows = extPeak > origPeak + 0.05;
const recurs = Math.abs(extPeak - origPeak) <= 0.05;
const decays = extPeak < origPeak - 0.05;
console.log('does the ~0.947 ULP worst-case GROW at higher tau? %s', grows ? 'YES' : 'no');
console.log('does it RECUR (within 0.05 ULP)?                   %s', recurs ? 'YES' : 'no');
console.log('does it DECAY at higher tau?                       %s', decays ? 'YES' : 'no');
console.log('extension stays below the strict 1-ULP bar?        %s', extPeak < 1 ? 'YES' : 'NO');
console.log('\nJSON:', JSON.stringify({ origPeak, origPeakTau, extPeak, extPeakTau, extMean, extOver, extRows }));
