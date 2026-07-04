// imp-33597 offline probe: ASSESS the imp-33581 surrogateNotPlatformSurvey caveat.
//
// imp-33581 proved the imp-33534 double-double reference libm is bit-identical (0.0 ULP
// self-error) across a 12-setting ddExp/ddLog sweep, BUT its verdict flagged
// surrogateNotPlatformSurvey: the dd sweep only bounds the SURROGATE truncation self-error,
// not a real platform libm. A correctly-rounded-minus-1-ULP platform exp/log (i.e. up to
// ~1 ULP worse than correctly rounded) could still shift the tau=8 envelope ceiling E_ref.
//
// This probe closes that gap differently from imp-33581: instead of tightening the dd
// surrogate, it INJECTS a bounded +/-1 ULP relative perturbation directly into every
// Math.exp / Math.log call feeding the imp-33312 tau=8 ceiling, then remeasures the
// resulting ceiling under (i) all-plus, (ii) all-minus correlated worst cases and
// (iii) many seeded random +/-1 ULP sign patterns. It reports the E_ref SHIFT ENVELOPE
// vs the imp-33559 ~10.212 ULP dd reference floor, whether the binding height stays
// tau=8, and whether the imp-33559 ~0.567 ULP fp64-vs-dd shift is robust to platform-libm
// error. Measurement only; injected surrogate error model; changes no bound; imp-3066
// untouched; no QED; PT Lambda <= 0.2 stays SOTA.

const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52);
const HI = 14;

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

// -- INJECTED platform-libm error model -----------------------------------------------------------
// A correctly-rounded libm has <= 0.5 ULP error; a "correctly-rounded-minus-1-ULP" platform
// libm can be off by up to ~1 ULP. We model that by scaling each exp/log output by
// (1 + delta*EPS), |delta| <= 1, where EPS = 2^-52 is ~1 ULP of a mantissa in [1,2). The
// sign source (perturb) is supplied by the caller: constant for the correlated worst cases,
// a seeded PRNG for the random survey.
function makePerturbedLibm(perturb) {
  return {
    exp(x) { const v = Math.exp(x); return v * (1 + perturb() * EPS); },
    log(x) { const v = Math.log(x); return v * (1 + perturb() * EPS); },
  };
}

// -- imp-33312 / imp-33559 fp64 machinery, but exp/log routed through the injected libm ------------
function makeNegLnA(libm) {
  const { exp, log } = libm;
  function logPhiFactored(u) {
    const e2 = exp(2 * u);
    const e4 = exp(4 * u);
    let acc = 0;
    for (let n = 1; n <= NPHI; n += 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
      acc += amp * exp(-PI * (n2 - 1) * e4);
    }
    return -PI * e4 + log(acc);
  }
  return function negLnA(tau, hi, panels, grade) {
    const terms = [];
    for (let j = 0; j < panels; j += 1) {
      const a = hi * Math.pow(j / panels, grade);
      const b = hi * Math.pow((j + 1) / panels, grade);
      const mid = 0.5 * (a + b);
      const half = 0.5 * (b - a);
      for (let k = 0; k < GL_X.length; k += 1) {
        const s = mid + half * GL_X[k];
        terms.push(log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
      }
    }
    let mx = -Infinity;
    for (const t of terms) if (t > mx) mx = t;
    let acc = 0;
    for (const t of terms) acc += exp(t - mx);
    return -(mx + log(acc));
  };
}

// -- DOUBLE-DOUBLE reference libm (imp-33534/imp-33559 verbatim) -- the E_ref floor ---------------
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

// -- imp-33312 band machinery ---------------------------------------------------------------------
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));
const HEIGHTS = [7, 8, 9, 10];
const GOLD_MARGIN = 3.5;
const STEP = 2;
const GRADE = 6;
const NBHD_LO = 245;
const NBHD_HI = 325;

function ceilingFor(tau, evalFn) {
  const T = tau + GOLD_MARGIN;
  const v5 = evalFn(tau, HI, panelsForTauStar(T, 5), 5);
  const v6 = evalFn(tau, HI, panelsForTauStar(T, 6), 6);
  const ref = 0.5 * (v5 + v6);
  const ulp = Math.abs(ref) * EPS;
  let max = -Infinity;
  for (let p = NBHD_LO; p <= NBHD_HI; p += STEP) {
    const u = Math.abs(evalFn(tau, HI, p, GRADE) - ref) / ulp;
    if (u > max) max = u;
  }
  return max;
}

// deterministic PRNG (mulberry32) so the random survey is reproducible run-to-run.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// -- unperturbed baselines ------------------------------------------------------------------------
const identity = makePerturbedLibm(() => 0);
const fp64Env = {}; // per-tau fp64 baseline ceiling
const ddEnv = {};   // per-tau dd reference floor
for (const tau of HEIGHTS) {
  fp64Env[tau] = ceilingFor(tau, makeNegLnA(identity));
  ddEnv[tau] = ceilingFor(tau, negLnAreference);
}
const fp64Base8 = fp64Env[8];
const ddFloor8 = ddEnv[8];

console.log('imp-33597: injected +/-1 ULP platform-libm error model on the imp-33312 tau=8 ceiling');
console.log('unperturbed fp64 baseline E_ref(tau=8) = %s ULP', fp64Base8.toFixed(4));
console.log('dd reference floor       E_ref(tau=8) = %s ULP', ddFloor8.toFixed(4));
console.log('imp-33559 fp64-vs-dd shift            = %s ULP\n', (fp64Base8 - ddFloor8).toFixed(4));

// -- correlated worst cases: all exp/log biased +1 ULP, then all -1 ULP ---------------------------
console.log('-- correlated worst-case +/-1 ULP bias (all exp/log same sign) --');
console.log('tau   ceiling(+1ULP)   ceiling(-1ULP)   fp64 base   dd floor');
const corrRows = [];
for (const tau of HEIGHTS) {
  const cPlus = ceilingFor(tau, makeNegLnA(makePerturbedLibm(() => 1)));
  const cMinus = ceilingFor(tau, makeNegLnA(makePerturbedLibm(() => -1)));
  corrRows.push({ tau, cPlus, cMinus });
  console.log(
    `${tau}    ${cPlus.toFixed(4)}         ${cMinus.toFixed(4)}         ` +
    `${fp64Env[tau].toFixed(4)}     ${ddEnv[tau].toFixed(4)}`
  );
}

// -- seeded random +/-1 ULP sign survey: independent per-call signs, many trials ------------------
const NTRIALS = 400;
console.log('\n-- random independent +/-1 ULP per-call survey (%d trials), tau=8 --', NTRIALS);
let rMin = Infinity;
let rMax = -Infinity;
let rSum = 0;
let rSumSq = 0;
for (let s = 1; s <= NTRIALS; s += 1) {
  const rng = mulberry32(0x9E3779B9 ^ s);
  // symmetric +/-1 ULP: delta uniform in [-1,1]
  const c = ceilingFor(8, makeNegLnA(makePerturbedLibm(() => 2 * rng() - 1)));
  if (c < rMin) rMin = c;
  if (c > rMax) rMax = c;
  rSum += c;
  rSumSq += c * c;
}
const rMean = rSum / NTRIALS;
const rSd = Math.sqrt(Math.max(0, rSumSq / NTRIALS - rMean * rMean));
console.log('random ceiling: min=%s  mean=%s  max=%s  sd=%s ULP',
  rMin.toFixed(4), rMean.toFixed(4), rMax.toFixed(4), rSd.toExponential(3));

// -- E_ref shift envelope vs the dd reference floor -----------------------------------------------
const corr8 = corrRows.find((r) => r.tau === 8);
const allCeil8 = [corr8.cPlus, corr8.cMinus, rMin, rMax, fp64Base8];
const envLo = Math.min(...allCeil8);
const envHi = Math.max(...allCeil8);
const maxShiftFromFloor = Math.max(Math.abs(envLo - ddFloor8), Math.abs(envHi - ddFloor8));
const worstPerturbSpan = Math.max(
  Math.abs(corr8.cPlus - fp64Base8), Math.abs(corr8.cMinus - fp64Base8),
  Math.abs(rMax - fp64Base8), Math.abs(rMin - fp64Base8)
);

// binding height under the worst (all-plus) correlated model
let bindPlus = HEIGHTS[0];
let bindPlusVal = -Infinity;
for (const r of corrRows) if (r.cPlus > bindPlusVal) { bindPlusVal = r.cPlus; bindPlus = r.tau; }
let bindMinus = HEIGHTS[0];
let bindMinusVal = -Infinity;
for (const r of corrRows) if (r.cMinus > bindMinusVal) { bindMinusVal = r.cMinus; bindMinus = r.tau; }

console.log('\n-- E_ref shift envelope under injected +/-1 ULP platform libm --');
console.log('tau=8 ceiling envelope over all models: [%s, %s] ULP', envLo.toFixed(4), envHi.toFixed(4));
console.log('max |shift| of E_ref from the dd floor (%s) = %s ULP', ddFloor8.toFixed(4), maxShiftFromFloor.toFixed(4));
console.log('max ceiling excursion from fp64 baseline    = %s ULP', worstPerturbSpan.toFixed(4));
console.log('binding height under +1 ULP model: tau=%d ; under -1 ULP model: tau=%d', bindPlus, bindMinus);

const shift = fp64Base8 - ddFloor8;
console.log('\n-- verdict --');
console.log('binding height stays tau=8:',
  (bindPlus === 8 && bindMinus === 8) ? 'YES (both correlated worst cases)' : `NO (+1:tau=${bindPlus}, -1:tau=${bindMinus})`);
console.log('imp-33559 shift (%s ULP) robust to platform libm:',
  (worstPerturbSpan < 0.5 * Math.abs(shift)) ? 'YES' : 'MARGINAL/NO', shift.toFixed(4));
console.log('  perturbation excursion %s ULP is %sx the %s ULP shift',
  worstPerturbSpan.toFixed(4), (worstPerturbSpan / Math.abs(shift)).toFixed(3), Math.abs(shift).toFixed(4));
console.log('a real correctly-rounded-minus-1-ULP libm keeps E_ref within +/-%s ULP of the dd floor.',
  maxShiftFromFloor.toFixed(4));
