// imp-33561 offline probe: does raising the graded-GL panel budget ABOVE the imp-33249
// grade6/171p single-hit restore headroom above the imp-33534 ~0.947 ULP reference-libm
// error floor for -ln A(tau), or is that floor panel-insensitive?
//
// Machinery: the imp-33534 double vs ~106-bit double-double reference-precision libm reused
// verbatim (Dekker/Knuth twoSum/twoProd, range-reduced Taylor ddExp, one-Newton-step ddLog).
// For each panel budget p in {171,200,250,300,350,400} at GRADE=6 we compute the fp64
// single-hit -ln A(tau) and its double-double reference, and report the reference error
// refErr(tau,p) = |double - reference| / (|reference|*EPS) [in double ULP], peaking over
// the imp-33534 tau grid {0.5..6}. Accuracy measurement only; changes no bound.

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
  return { hi: res[0] + res[1], value: res };
}

// -- (C) the sweep --------------------------------------------------------------------------------
const GRADE = 6;
const PANELS = [171, 200, 250, 300, 350, 400];
const TAUS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];

// reference error (in double ULP) of the fp64 single hit vs the dd reference at a fixed panel budget
function refErr(tau, panels) {
  const d = negLnAdouble(tau, HI, panels, GRADE);
  const r = negLnAreference(tau, HI, panels, GRADE).hi;
  const ulp = Math.abs(r) * EPS;
  return Math.abs(d - r) / ulp;
}

console.log('imp-33561: graded-GL panel-budget sweep of the fp64-vs-double-double reference-libm error of -ln A(tau)');
console.log('grade %d, tau grid {0.5..6}, reference error in DOUBLE ULP = |double - dd_reference|/(|ref|*EPS)\n', GRADE);
console.log('panels  glNodes   peakRefErr(ULP)  @tau    meanRefErr   #taus>0.24headroom');

const rows = [];
for (const p of PANELS) {
  let peak = -Infinity;
  let peakTau = null;
  let sum = 0;
  let overHeadroom = 0;
  for (const tau of TAUS) {
    const e = refErr(tau, p);
    sum += e;
    if (e > 0.24) overHeadroom += 1;
    if (e > peak) { peak = e; peakTau = tau; }
  }
  const mean = sum / TAUS.length;
  rows.push({ panels: p, glNodes: 10 * p, peak, peakTau, mean, overHeadroom });
  console.log(
    `${String(p).padStart(4)}    ${String(10 * p).padStart(5)}     ${peak.toFixed(4)}` +
    `          ${peakTau.toFixed(1)}     ${mean.toFixed(4)}       ${overHeadroom}/${TAUS.length}`
  );
}

const base = rows[0];
const best = rows.reduce((m, r) => (r.peak < m.peak ? r : m), rows[0]);
const worst = rows.reduce((m, r) => (r.peak > m.peak ? r : m), rows[0]);
const spread = worst.peak - best.peak;
const HEADROOM = 0.24; // imp-33534 grade6/171p headroom below the strict 1-ULP bar

console.log('\n-- verdict --');
console.log('baseline 171p peak reference error   = %s ULP @tau=%s', base.peak.toFixed(4), base.peakTau.toFixed(1));
console.log('best (min peak over budgets)         = %s ULP @%d panels @tau=%s',
  best.peak.toFixed(4), best.panels, best.peakTau.toFixed(1));
console.log('worst (max peak over budgets)        = %s ULP @%d panels', worst.peak.toFixed(4), worst.panels);
console.log('peak spread across {171..400}p       = %s ULP', spread.toFixed(4));
console.log('does any budget restore headroom (peak < %s ULP)? %s',
  HEADROOM.toFixed(2), best.peak < HEADROOM ? 'YES' : 'NO');
console.log('is the ~0.947 ULP floor panel-insensitive (spread < 0.5 ULP AND no budget < headroom)? %s',
  (spread < 0.5 && best.peak >= HEADROOM) ? 'YES -- PANEL-INSENSITIVE FLOOR' : 'NO -- panel-sensitive');
console.log('all budgets stay below the strict 1-ULP bar? %s', worst.peak < 1 ? 'YES' : 'NO');
