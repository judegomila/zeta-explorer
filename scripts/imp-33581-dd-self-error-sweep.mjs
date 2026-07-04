// imp-33581 offline probe: BOUND the imp-33559 double-double reference-libm SELF-ERROR.
//
// imp-33559 attributes the ~0.567 ULP downward shift of the tau=8 envelope ceiling
// (fp64 10.779 -> E_ref 10.212) to genuine fp64-libm round-off, using a ~106-bit dd
// libm (range-reduced 24-term Taylor ddExp, one-Newton-step ddLog) as the reference.
// But that dd libm has its OWN truncation floor. This probe sweeps the ddExp Taylor
// order and the ddLog Newton-iteration count ABOVE the imp-33534/imp-33559 defaults and
// remeasures the tau=8 reference ceiling E_ref -- if E_ref is stable across the sweep the
// dd self-error is << the 0.567 ULP shift (the shift is real), if E_ref drifts with dd
// term count the shift is partly a reference-truncation artifact. Measurement only; the
// dd libm is a reference surrogate; changes no bound; imp-3066 untouched; no QED.

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

// -- DOUBLE-DOUBLE core (imp-33534 verbatim) ------------------------------------------------------
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

// -- PARAMETERIZED reference libm: ddExp Taylor order EXPTERMS, ddLog Newton count LOGITERS --------
function makeLibm(EXPTERMS, LOGITERS) {
  function ddExp(x) {
    const xh = x[0];
    if (xh <= -745) return [0, 0];
    if (xh >= 709) return [Infinity, 0];
    const k = Math.round(xh / LN2[0]);
    const r = ddSub(x, ddMulN(LN2, k));
    let term = [1, 0];
    let sum = [1, 0];
    for (let n = 1; n <= EXPTERMS; n += 1) {
      term = ddDiv(ddMul(term, r), [n, 0]);
      sum = ddAdd(sum, term);
      if (Math.abs(term[0]) < 1e-34 * Math.abs(sum[0])) break;
    }
    const scale = Math.pow(2, k);
    return [sum[0] * scale, sum[1] * scale];
  }
  function ddLog(x) {
    // Newton on f(y) = exp(y) - x: y_{m+1} = y_m + x*exp(-y_m) - 1.
    let y = [Math.log(x[0]), 0];
    for (let m = 0; m < LOGITERS; m += 1) {
      const t = ddMul(x, ddExp(ddSub([0, 0], y)));
      y = ddAdd(y, ddSub(t, [1, 0]));
    }
    return y;
  }
  return { ddExp, ddLog };
}

function makeNegLnAreference(EXPTERMS, LOGITERS) {
  const { ddExp, ddLog } = makeLibm(EXPTERMS, LOGITERS);
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
  return function negLnAreference(tau, hi, panels, grade) {
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
  };
}

// -- imp-33312 band machinery (tau=8 ceiling only) ------------------------------------------------
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));
const GOLD_MARGIN = 3.5;
const STEP = 2;
const GRADE = 6;
const NBHD_LO = 245;
const NBHD_HI = 325;
const TAU = 8;

function ceilingFor(evalFn) {
  const T = TAU + GOLD_MARGIN;
  const v5 = evalFn(TAU, HI, panelsForTauStar(T, 5), 5);
  const v6 = evalFn(TAU, HI, panelsForTauStar(T, 6), 6);
  const ref = 0.5 * (v5 + v6);
  const ulp = Math.abs(ref) * EPS;
  let max = -Infinity;
  for (let p = NBHD_LO; p <= NBHD_HI; p += STEP) {
    const u = Math.abs(evalFn(TAU, HI, p, GRADE) - ref) / ulp;
    if (u > max) max = u;
  }
  return max;
}

// -- SWEEP ----------------------------------------------------------------------------------------
// Defaults are EXPTERMS=24, LOGITERS=1 (imp-33534/imp-33559). Sweep ABOVE both.
const EXP_ORDERS = [24, 32, 40, 48];
const LOG_ITERS = [1, 2, 3];

console.log('imp-33581: dd reference-libm SELF-ERROR sweep of the tau=%d ceiling E_ref', TAU);
console.log('defaults EXPTERMS=24 LOGITERS=1; imp-33559 baked E_ref=10.2120 ULP, shift -0.567 ULP\n');
console.log('EXPTERMS  LOGITERS   E_ref(tau=8) ULP    dE vs default');

let baseline = null;
const results = [];
for (const et of EXP_ORDERS) {
  for (const li of LOG_ITERS) {
    const E = ceilingFor(makeNegLnAreference(et, li));
    if (baseline === null) baseline = E;
    results.push({ expTerms: et, logIters: li, eRef: E, dVsDefault: E - baseline });
    console.log(
      `  ${String(et).padStart(2)}         ${li}          ${E.toFixed(6)}        ` +
      `${(E - baseline >= 0 ? '+' : '')}${(E - baseline).toExponential(3)}`
    );
  }
}

const eRefs = results.map((r) => r.eRef);
const eMin = Math.min(...eRefs);
const eMax = Math.max(...eRefs);
const spread = eMax - eMin;
const SHIFT = 0.5673; // imp-33559 measured downward shift (fp64 10.7793 -> dd 10.2120)
console.log('\n-- dd SELF-ERROR band across the sweep --');
console.log('E_ref min = %s, max = %s, spread (dd self-error) = %s ULP', eMin.toFixed(6), eMax.toFixed(6), spread.toExponential(4));
console.log('imp-33559 shift = %s ULP; self-error / shift = %s', SHIFT.toFixed(4), (spread / SHIFT).toExponential(3));
console.log('self-error << shift (< 1%% of it):', spread < 0.01 * SHIFT ? 'YES -- the 0.567 ULP shift is REAL, not a dd-truncation artifact' : 'NO -- E_ref drifts with dd term count');
