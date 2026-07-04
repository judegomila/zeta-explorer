// imp-33578 offline probe: recompute the imp-33558 LOW-HEIGHT band ceilings (tau in {5,6})
// under the imp-33534 ~106-bit DOUBLE-DOUBLE reference-precision libm and report whether the
// imp-33559 downward reference-precision shift also appears below tau=7 and whether the binding
// height stays tau=8 once the FULL tau in {5..10} band is measured under the reference libm.
//
// Machinery reused verbatim from scripts/imp-33559-envelope-under-reference-libm.mjs (the imp-33312
// min-node grade6 lattice-jitter band over the FIXED resolved neighbourhood [245,325], single-tau
// gold per height, every exp/log recomputed in double-double). Only the HEIGHTS list changes to the
// low band tau in {5,6}. Accuracy measurement only; changes no bound.

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
const LOW_HEIGHTS = [5, 6];
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

console.log('imp-33578: imp-33558 LOW-HEIGHT band ceilings (tau in {5,6}) under fp64 vs ~106-bit dd reference libm');
console.log('neighbourhood [%d,%d] step %d grade %d\n', NBHD_LO, NBHD_HI, STEP, GRADE);
console.log('tau   fp64 ceiling   dd  ceiling   shift(dd-fp64)   ratio');
const rows = [];
for (const tau of LOW_HEIGHTS) {
  const f = ceilingFor(tau, negLnAdouble);
  const d = ceilingFor(tau, negLnAreference);
  rows.push({ tau, fp64: f.ceilingUlp, dd: d.ceilingUlp });
  console.log(
    `${tau}    ${f.ceilingUlp.toFixed(4)}        ${d.ceilingUlp.toFixed(4)}        ` +
    `${(d.ceilingUlp - f.ceilingUlp >= 0 ? '+' : '')}${(d.ceilingUlp - f.ceilingUlp).toFixed(4)}        ` +
    `${(d.ceilingUlp / f.ceilingUlp).toFixed(3)}`
  );
}
console.log('\n-- interpretation --');
console.log('Combined with the imp-33559 high band (tau=7 dd 9.6798, tau=8 dd 10.2120, tau=9 0.6650, tau=10 0.0000):');
const FULL = [
  ...rows.map((r) => ({ tau: r.tau, dd: r.dd })),
  { tau: 7, dd: 9.6798 }, { tau: 8, dd: 10.2120 }, { tau: 9, dd: 0.6650 }, { tau: 10, dd: 0.0000 },
];
const ddEnv = Math.max(...FULL.map((r) => r.dd));
const ddBind = FULL.find((r) => r.dd === ddEnv).tau;
console.log('full-band dd envelope E_ref = %s ULP, binding height tau=%d', ddEnv.toFixed(4), ddBind);
console.log('binding height stays tau=8:', ddBind === 8 ? 'YES' : `NO (tau=${ddBind})`);
console.log('fp64 ~10.78 envelope still upper-bounds full dd band:', ddEnv < 10.7793 ? 'YES' : 'NO');
