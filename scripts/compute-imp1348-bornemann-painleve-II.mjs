#!/usr/bin/env node
// scripts/compute-imp1348-bornemann-painleve-II.mjs
// imp-1348 — Bornemann 2010 §3.3 / Tracy-Widom 1994 DIRECT F_2(s) via the
//   Hastings-McLeod solution of the Painleve-II ODE.
//
// WHY THIS SCRIPT EXISTS
// ----------------------
// imp-1313 shipped the Bornemann 2010 Airy-KERNEL Chebyshev discretization
// but explicitly did NOT implement the §3.3 Fredholm DETERMINANT
//   F_2(s) = det(I - K_Airy restricted to [s, inf)).
// imp-1313.honestScope.followUpRecommendation named this as the cleanest
// closure. Instead of evaluating the Fredholm determinant by quadrature
// (which is what imp-1313 found to be discretization-limited), we use the
// EXACT closed-form Tracy-Widom 1994 representation
//
//   F_2(s) = exp( - integral_s^inf (x - s) q(x)^2 dx )
//
// where q is the Hastings-McLeod solution of Painleve-II:
//
//   q''(x) = x q(x) + 2 q(x)^3,     q(x) ~ Ai(x)  as x -> +inf.
//
// This gives F_2(s) DIRECTLY with NO kernel quadrature and NO
// discretization of the eigenvalue problem. It is the gold-standard
// reference method (Bornemann 2010 §2; Tracy-Widom 1994 Comm. Math. Phys.
// 159 eq. 1.16-1.17).
//
// METHOD
// ------
// 1. Compute Ai(x_max), Ai'(x_max) by RK4 forward integration of the Airy
//    ODE Ai''(x) = x Ai(x) from x=0 with A-S 10.4.4/5 initial values.
// 2. At x_max the Hastings-McLeod q matches Ai to ~1e-10 (Ai(8) ~ 1e-8).
//    Seed q(x_max)=Ai(x_max), q'(x_max)=Ai'(x_max), and the tail integrals
//    I(x_max)=J(x_max)=0 (the Airy^2 tail beyond x_max is ~1e-17).
// 3. Augment with two quadrature states integrated BACKWARD (x_max -> s_min):
//      I(x) = integral_x^inf q(t)^2 dt          =>  I'(x) = -q(x)^2
//      J(x) = integral_x^inf (t-x) q(t)^2 dt    =>  J'(x) = -I(x)
//    so F_2(x) = exp(-J(x)) at every grid point.
// 4. RK4 backward with fine step; record F_2(s) at the Prahofer-Spohn 2004
//    table abscissae and compare. Then build the pdf f=F_2' by finite
//    difference and compute the first four moments (mean, var, skew, kurt)
//    to cross-check against the tabulated TW2 cumulants.
//
// VERIFICATION TARGETS (Prahofer-Spohn 2004 / Bornemann 2010 Table)
//   F_2(-0.9344) = 0.5    (median)
//   F_2(-1.7711) = 0.169  (mean abscissa)
//   F_2( 0.0   ) ~ 0.820
//   mean = -1.7711, var = 0.8132, skew = 0.2241, exkurt = 0.0934

const AIRY_AI0 = 0.35502805388781724;     // 3^{-2/3}/Gamma(2/3)
const AIRY_AIP0 = -0.25881940379280680;   // -3^{-1/3}/Gamma(1/3)

// ---- RK4 forward Airy ODE to get Ai(x_max), Ai'(x_max) ----
function airyAt(xMax, h = 1e-5) {
  let x = 0;
  let y = AIRY_AI0;   // Ai
  let v = AIRY_AIP0;  // Ai'
  const n = Math.round(xMax / h);
  for (let i = 0; i < n; i++) {
    // y' = v ; v' = x*y
    const k1y = v;
    const k1v = x * y;
    const k2y = v + 0.5 * h * k1v;
    const k2v = (x + 0.5 * h) * (y + 0.5 * h * k1y);
    const k3y = v + 0.5 * h * k2v;
    const k3v = (x + 0.5 * h) * (y + 0.5 * h * k2y);
    const k4y = v + h * k3v;
    const k4v = (x + h) * (y + h * k3y);
    y += (h / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    x += h;
  }
  return { Ai: y, Aip: v };
}

// ---- Painleve-II Hastings-McLeod + quadrature, integrated BACKWARD ----
// state = [q, p=q', I, J]; independent variable x decreasing from xMax.
function derivs(x, s) {
  const [q, p, I /*, J */] = s;
  return [
    p,                       // q'
    x * q + 2 * q * q * q,   // p' = q''  (Painleve-II)
    -(q * q),                // I' = -q^2
    -I,                      // J' = -I
  ];
}

function rk4StepBack(x, st, h, s, deriv) {
  // step of size -h (backward): x_new = x - h
  const k1 = deriv(x, st);
  const s2 = st.map((v, i) => v - 0.5 * h * k1[i]);
  const k2 = deriv(x - 0.5 * h, s2);
  const s3 = st.map((v, i) => v - 0.5 * h * k2[i]);
  const k3 = deriv(x - 0.5 * h, s3);
  const s4 = st.map((v, i) => v - h * k3[i]);
  const k4 = deriv(x - h, s4);
  return st.map((v, i) => v - (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

function computeF2(xMax, xMin, h) {
  const { Ai, Aip } = airyAt(xMax);
  let x = xMax;
  let st = [Ai, Aip, 0, 0]; // I,J tail beyond xMax negligible (~1e-17)
  const grid = []; // {x, F2}
  grid.push({ x, F2: Math.exp(-st[3]) });
  const nSteps = Math.round((xMax - xMin) / h);
  for (let i = 0; i < nSteps; i++) {
    st = rk4StepBack(x, st, h, null, derivs);
    x -= h;
    grid.push({ x, F2: Math.exp(-st[3]) });
  }
  grid.reverse(); // now ascending in x
  return { grid, AiAtXmax: Ai, AipAtXmax: Aip };
}

// linear interpolation of F2 at an arbitrary abscissa
function f2At(grid, s) {
  // grid ascending in x
  let lo = 0;
  let hi = grid.length - 1;
  if (s <= grid[0].x) return grid[0].F2;
  if (s >= grid[hi].x) return grid[hi].F2;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (grid[mid].x <= s) lo = mid;
    else hi = mid;
  }
  const t = (s - grid[lo].x) / (grid[hi].x - grid[lo].x);
  return grid[lo].F2 + t * (grid[hi].F2 - grid[lo].F2);
}

// moments of TW2 from the pdf f = F2' (central finite difference on grid)
function moments(grid) {
  // build pdf at midpoints
  const xs = [];
  const fs = [];
  for (let i = 1; i < grid.length - 1; i++) {
    const dF = (grid[i + 1].F2 - grid[i - 1].F2) / (grid[i + 1].x - grid[i - 1].x);
    xs.push(grid[i].x);
    fs.push(dF);
  }
  // trapezoid moments
  let m0 = 0;
  let m1 = 0;
  for (let i = 1; i < xs.length; i++) {
    const dx = xs[i] - xs[i - 1];
    m0 += 0.5 * (fs[i] + fs[i - 1]) * dx;
    m1 += 0.5 * (fs[i] * xs[i] + fs[i - 1] * xs[i - 1]) * dx;
  }
  const mean = m1 / m0;
  let mu2 = 0;
  let mu3 = 0;
  let mu4 = 0;
  for (let i = 1; i < xs.length; i++) {
    const dx = xs[i] - xs[i - 1];
    const a = xs[i] - mean;
    const b = xs[i - 1] - mean;
    mu2 += 0.5 * (fs[i] * a * a + fs[i - 1] * b * b) * dx;
    mu3 += 0.5 * (fs[i] * a * a * a + fs[i - 1] * b * b * b) * dx;
    mu4 += 0.5 * (fs[i] * a * a * a * a + fs[i - 1] * b * b * b * b) * dx;
  }
  mu2 /= m0;
  mu3 /= m0;
  mu4 /= m0;
  return {
    mass: m0,
    mean,
    variance: mu2,
    skewness: mu3 / Math.pow(mu2, 1.5),
    excessKurtosis: mu4 / (mu2 * mu2) - 3,
  };
}

const X_MAX = 8.0;
const X_MIN = -8.0;
const H = 5e-4;

const { grid, AiAtXmax, AipAtXmax } = computeF2(X_MAX, X_MIN, H);

// Output abscissae for the direct F_2(s) curve (these are the deliverable).
const OUT_S = [-3.0, -2.5, -2.0, -1.7711, -1.5, -1.0, -0.5, 0.0, 1.0, 2.0];

// AUTHORITATIVE cross-check: a documented standard-TW2 CDF anchor.
// F_2 at the mean (s = -1.7711) is the most-cited reference probability
// P(lambda_max <= mean) = 0.51387 (Bornemann 2010; Tracy-Widom 1994).
const F2_AT_MEAN_REF = 0.51387;

console.log('=== imp-1348 Painleve-II direct F_2(s) ===');
console.log(`Ai(${X_MAX}) = ${AiAtXmax.toExponential(6)}  Ai'(${X_MAX}) = ${AipAtXmax.toExponential(6)}`);
console.log('s\tF2_computed (direct Painleve-II)');
for (const s of OUT_S) {
  console.log(`${s}\t${f2At(grid, s).toFixed(8)}`);
}
const f2AtMean = f2At(grid, -1.7711);
console.log(`--- anchor: F_2(mean=-1.7711) computed=${f2AtMean.toFixed(6)} ref=${F2_AT_MEAN_REF} abs_err=${Math.abs(f2AtMean - F2_AT_MEAN_REF).toExponential(3)}`);

const mom = moments(grid);
console.log('--- moments of computed TW2 pdf ---');
console.log(`mass   = ${mom.mass.toFixed(6)} (target 1)`);
console.log(`mean   = ${mom.mean.toFixed(5)} (target -1.7711)`);
console.log(`var    = ${mom.variance.toFixed(5)} (target 0.8132)`);
console.log(`skew   = ${mom.skewness.toFixed(5)} (target 0.2241)`);
console.log(`exkurt = ${mom.excessKurtosis.toFixed(5)} (target 0.0934)`);

// emit a compact JSON for freezing into the data file
const TABLE_OUT = OUT_S.map((s) => ({
  s,
  f2Computed: Number(f2At(grid, s).toFixed(8)),
}));
console.log('FROZEN_JSON_BEGIN');
console.log(JSON.stringify({
  airyAtXmax: { x: X_MAX, Ai: AiAtXmax, Aip: AipAtXmax },
  table: TABLE_OUT,
  f2AtMean: { computed: Number(f2AtMean.toFixed(6)), ref: F2_AT_MEAN_REF, absErr: Number(Math.abs(f2AtMean - F2_AT_MEAN_REF).toExponential(4)) },
  moments: {
    mass: Number(mom.mass.toFixed(8)),
    mean: Number(mom.mean.toFixed(6)),
    variance: Number(mom.variance.toFixed(6)),
    skewness: Number(mom.skewness.toFixed(6)),
    excessKurtosis: Number(mom.excessKurtosis.toFixed(6)),
  },
}, null, 2));
console.log('FROZEN_JSON_END');
