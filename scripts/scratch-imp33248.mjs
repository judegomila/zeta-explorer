// Scratch prototype for imp-33248: cancellation-free / double-double reconstruction of the
// imp-33208 Watson-majorant bracket ladder, measuring rhoRatio(tau) at tau in {4,5,6}.
const NPHI = 10;
const PI = Math.PI;

// ---- Original imp-33208 single-double DIRECT route (the floor-swamped one) ----
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
function logPhiN1(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  const amp1 = 2 * PI * PI * e4 - 3 * PI * e2;
  return -PI * e4 + Math.log(amp1);
}
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];
function logIntegralGradedGL(lnG, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      terms.push(Math.log(GL_W[k] * half) + lnG(mid + half * GL_X[k]));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return mx + Math.log(acc);
}
const HI = 14, PANELS = 1600, GRADE = 6;

// pins
let ACC0 = 0, DACC0 = 0;
for (let n = 1; n <= NPHI; n += 1) {
  const n2 = n * n, n4 = n2 * n2;
  const amp = 2 * PI * PI * n4 - 3 * PI * n2;
  const expo = Math.exp(-PI * (n2 - 1));
  ACC0 += amp * expo;
  const dAmp = 8 * PI * PI * n4 - 6 * PI * n2;
  const dExpo = -PI * (n2 - 1) * 4;
  DACC0 += (dAmp + amp * dExpo) * expo;
}
const PHI0 = Math.exp(-PI) * ACC0;
const PHI_PRIME_0 = Math.exp(-PI) * (-PI * ACC0 + 0.25 * DACC0);
const PSI_PRIME_0 = PHI_PRIME_0 - 0.5 * PHI0;
const K_LEAD = 2 * PHI_PRIME_0 / PHI0;
const K6 = -(3 / PHI0) * (PSI_PRIME_0 / PI);
const K0 = 3.46;

function directRhoRatio(tau) {
  const T = PI * Math.exp(4 * tau);
  const e4t = Math.exp(-4 * tau);
  const lnAn1 = logIntegralGradedGL((s) => logPhiFactored(s) + logPhiN1(s + tau), HI, PANELS, GRADE);
  const bracket = Math.exp(lnAn1 + T - Math.log(PHI0 / 4));
  const rho = bracket - (2 * PI - 3 * Math.exp(-2 * tau));
  return rho / e4t;
}

// ---- Double-double primitives (Dekker/Knuth) ----
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
const SPLITTER = 134217729; // 2^27 + 1
function split(a) {
  const c = SPLITTER * a;
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}
// dd = [hi, lo]
function ddAddDd(a, b) {
  let [s, e] = twoSum(a[0], b[0]);
  e += a[1] + b[1];
  const [hi, lo] = twoSum(s, e);
  return [hi, lo];
}
function ddAddD(a, b) { // dd + double
  let [s, e] = twoSum(a[0], b);
  e += a[1];
  const [hi, lo] = twoSum(s, e);
  return [hi, lo];
}
function ddMulD(a, b) { // dd * double
  let [p, e] = twoProd(a[0], b);
  e += a[1] * b;
  const [hi, lo] = twoSum(p, e);
  return [hi, lo];
}
function ddToNumber(a) { return a[0] + a[1]; }
// pi in double-double
const PI_DD = [Math.PI, 1.2246467991473532e-16]; // pi hi + lo

// ---- Cancellation-free smooth-part helpers (stable, no huge cancellation) ----
// log(accF(s)) where accF excludes the -pi e^{4s} leading term.
function logAccF(s) {
  const e2 = Math.exp(2 * s);
  const e4 = Math.exp(4 * s);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n, n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return Math.log(acc);
}
// log(amp1(u)) = log(2 pi^2 e^{4u} - 3 pi e^{2u}) = 4u + log(2 pi^2 - 3 pi e^{-2u}); u = s+tau.
function logAmp1(u) {
  return 4 * u + Math.log(2 * PI * PI - 3 * PI * Math.exp(-2 * u));
}

// Reformulated exponent E_j = t_j + T, computed with the -T cancellation folded via expm1.
//   E_j = [logw + logAccF(s) + logAmp1(s+tau)]  +  PI*( -e^{4s} - e^{4tau} expm1(4s) )
// The bracketed smooth part is O(30); the PI*(...) huge-scale part is O(1) near the peak.
function reconstructLnAplusT(tau, useDD) {
  const e4tau = Math.exp(4 * tau);
  // collect exponents
  const smooth = [];
  const huge = [];
  for (let j = 0; j < PANELS; j += 1) {
    const a = HI * Math.pow(j / PANELS, GRADE);
    const b = HI * Math.pow((j + 1) / PANELS, GRADE);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      const logw = Math.log(GL_W[k] * half);
      const S = logw + logAccF(s) + logAmp1(s + tau);
      const H = -Math.exp(4 * s) - e4tau * Math.expm1(4 * s);
      smooth.push(S);
      huge.push(H);
    }
  }
  // Build E_j (either DD or plain) and reduce via log-sum-exp.
  const N = smooth.length;
  const Elo = new Float64Array(N); // ddToNumber value
  let mx = -Infinity;
  const Edd = useDD ? [] : null;
  for (let i = 0; i < N; i += 1) {
    let val;
    if (useDD) {
      const e = ddAddD(ddMulD(PI_DD, huge[i]), smooth[i]);
      Edd.push(e);
      val = ddToNumber(e);
    } else {
      val = PI * huge[i] + smooth[i];
    }
    Elo[i] = val;
    if (val > mx) mx = val;
  }
  let acc = 0;
  for (let i = 0; i < N; i += 1) acc += Math.exp(Elo[i] - mx);
  return mx + Math.log(acc); // = ln A_n1 + T (O(1))
}

function reformRhoRatio(tau, useDD) {
  const e4t = Math.exp(-4 * tau);
  const lnAplusT = reconstructLnAplusT(tau, useDD);
  const bracket = Math.exp(lnAplusT - Math.log(PHI0 / 4));
  const rho = bracket - (2 * PI - 3 * Math.exp(-2 * tau));
  return rho / e4t;
}

console.log('K_LEAD =', K_LEAD.toExponential(10), ' K6 =', K6.toExponential(10), ' PHI0 =', PHI0);
console.log('\n--- reliable-window cross-check tau=3 (should reproduce imp-33208 -3.406866) ---');
console.log('direct  tau=3:', directRhoRatio(3.0));
console.log('reform  tau=3:', reformRhoRatio(3.0, false));
console.log('reformDD tau=3:', reformRhoRatio(3.0, true));

console.log('\n--- high-tau window {4,5,6} ---');
for (const tau of [4.0, 5.0, 6.0]) {
  const model = K_LEAD + K6 * Math.exp(-2 * tau);
  const direct = directRhoRatio(tau);
  const reform = reformRhoRatio(tau, false);
  const reformDD = reformRhoRatio(tau, true);
  console.log(`tau=${tau}:`);
  console.log('  model    =', model);
  console.log('  direct   =', direct, ' (|.|>K0?', Math.abs(direct) > K0, ')');
  console.log('  reform   =', reform, ' diffModel=', Math.abs(reform - model), ' under K0?', Math.abs(reform) <= K0);
  console.log('  reformDD =', reformDD, ' diffModel=', Math.abs(reformDD - model), ' DD-vs-plain=', Math.abs(reformDD - reform));
}
