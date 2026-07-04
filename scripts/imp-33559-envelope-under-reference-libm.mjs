// imp-33559 offline probe: recompute the imp-33312 per-height band ceilings (tau in {7..10})
// under the imp-33534 ~106-bit DOUBLE-DOUBLE reference-precision libm and report whether the
// imp-33538 ~10.78 ULP tau-uniform envelope constant (binding at tau=8) survives or shifts.
//
// Machinery: the imp-33312 min-node grade6 lattice-jitter band over the FIXED resolved
// neighbourhood [245,325], single-tau gold per height, BUT every exp/log recomputed in
// double-double (Dekker/Knuth twoSum/twoProd, range-reduced Taylor ddExp, one-Newton-step
// ddLog) exactly as imp-33534. The gold and the whole window are recomputed in dd; the ULP
// scale is the double ULP |ref|*EPS. Accuracy measurement only; changes no bound.

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

// -- (A) DOUBLE baseline (imp-33312 verbatim) -----------------------------------------------------
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

// -- (B) DOUBLE-DOUBLE reference libm (imp-33534 verbatim) -----------------------------------------
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

// -- (C) imp-33312 band machinery -----------------------------------------------------------------
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
  return { tau, ref, ceilingUlp: max };
}

console.log('imp-33559: imp-33312 per-height band ceilings under fp64 vs ~106-bit double-double reference libm');
console.log('neighbourhood [%d,%d] step %d grade %d\n', NBHD_LO, NBHD_HI, STEP, GRADE);
console.log('tau   fp64 ceiling   dd  ceiling   shift(dd-fp64)   ratio');
const rows = [];
for (const tau of HEIGHTS) {
  const f = ceilingFor(tau, negLnAdouble);
  const d = ceilingFor(tau, negLnAreference);
  rows.push({ tau, fp64: f.ceilingUlp, dd: d.ceilingUlp });
  console.log(
    `${tau}    ${f.ceilingUlp.toFixed(4)}        ${d.ceilingUlp.toFixed(4)}        ` +
    `${(d.ceilingUlp - f.ceilingUlp >= 0 ? '+' : '')}${(d.ceilingUlp - f.ceilingUlp).toFixed(4)}        ` +
    `${(d.ceilingUlp / f.ceilingUlp).toFixed(3)}`
  );
}
const fp64Env = Math.max(...rows.map((r) => r.fp64));
const ddEnv = Math.max(...rows.map((r) => r.dd));
const fp64Bind = rows.find((r) => r.fp64 === fp64Env).tau;
const ddBind = rows.find((r) => r.dd === ddEnv).tau;
console.log('\n-- envelope constant E = max_tau ceiling --');
console.log('fp64  envelope E = %s ULP, binding height tau=%d', fp64Env.toFixed(4), fp64Bind);
console.log('dd    envelope E = %s ULP, binding height tau=%d', ddEnv.toFixed(4), ddBind);
console.log('envelope shift dd-fp64 = %s ULP (%s%%)',
  (ddEnv - fp64Env).toFixed(4), ((ddEnv - fp64Env) / fp64Env * 100).toFixed(2));
console.log('binding height survives:', ddBind === fp64Bind ? 'YES (tau=8)' : `NO (fp64 tau=${fp64Bind} -> dd tau=${ddBind})`);
console.log('imp-33538 named constant ~10.78 ULP survives:', Math.abs(ddEnv - 10.7793) < 0.5 ? 'YES (within 0.5 ULP)' : 'SHIFTED');
