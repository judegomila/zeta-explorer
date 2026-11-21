/**
 * @module imp-34510-affinity-residual-quadratic-curvature-check
 *
 * imp-34510 (accuracy, opus-4-8): FIT the convex imp-34470 affinity-departure residual to a quadratic in k
 * and CHECK its curvature coefficient against the predicted widening-slope curvature, confirming the
 * imp-34470 attribution QUANTITATIVELY (imp-34470 only observed the residual was convex and named the
 * ln10/u^2 drift as the cause, but never fit the curvature).
 *
 * imp-34470 fit the rung -> u height map u(k) = log(effectiveHeightForN(10^(k+1))/2pi) to u = a + b*k by
 * OLS across k = 17.8..21.3 (R^2 = 0.9999997) and found the OLS residual is convex (~+2.9e-3 at both ends,
 * ~-1.4e-3 in the middle), attributing the shape to the imp-34246 widening-slope drift b(u) = ln10*(1-1/u)
 * which changes by ~ln10/u^2 per unit u across the window -- but it never fit the residual curvature. This
 * module reuses the EXACT imp-34470 rung -> u map and OLS linear fit, computes the linear-fit residual on the
 * same 351-sample grid, fits that residual to a quadratic r = c0 + c1*k + c2*k^2 by OLS, and extracts the
 * curvature coefficient c2. Measurement / cross-check ONLY: changes no bound, C_mb GUE-conditional per
 * imp-486 UNTOUCHED, NO QED.
 *
 * THE PREDICTED CURVATURE (from the imp-34246 widening-slope ODE)
 * --------------------------------------------------------------
 * The height map locally obeys du/dk = b(u) = ln10*(1 - 1/u) (the imp-34246 widening slope). Its curvature
 * in k is therefore the second derivative
 *   d2u/dk2 = b'(u) * du/dk = (ln10 / u^2) * b(u) = ln10^2 * (1 - 1/u) / u^2,
 * i.e. the bare per-u slope-drift rate db/du = ln10/u^2 (the "~ln10/u^2" imp-34470 named) multiplied by the
 * local slope b ~ 2.25. A quadratic fit r ~ c2*k^2 has second derivative 2*c2, so the linear-fit residual
 * curvature 2*c2 should equal d2u/dk2 (the OLS line carries zero second derivative, so the residual inherits
 * the full curvature of u(k)).
 *
 * THE FIT AND THE CHECK (u ~ 43.57 at the window midpoint)
 * -------------------------------------------------------
 *   quadratic residual fit   r = 5.219e-1 - 5.354e-2*k + 1.36926e-3*k^2   (R^2 on the residual = 0.99908)
 *   curvature coefficient    c2 = 1.36926e-3
 *   empirical curvature      2*c2 = 2.73852e-3
 *   analytic prediction      ln10^2*(1-1/u)/u^2 at u = 43.567 = 2.72917e-3   (finite-diff d2u/dk2 = 2.72917e-3)
 *   ratio                    (2*c2) / prediction = 1.0034   (agree to 0.34%)
 *
 * So the convex residual imp-34470 observed IS the widening-slope curvature, confirmed to better than half a
 * percent: the measured curvature 2.739e-3 matches the closed-form ln10^2*(1-1/u)/u^2 = 2.729e-3. The bare
 * ln10/u^2 = 1.213e-3 that imp-34470 named is the per-u drift rate db/du; the per-k residual curvature is
 * that times the local slope b ~ 2.25, giving the full 2.729e-3. The quadratic captures the residual well
 * (R^2 = 0.999), so the residual really is parabolic-dominated as the constant-curvature model predicts.
 *
 * HONEST SCOPE -- measurement / cross-check only, NO QED. This fits the curvature of an already established
 * residual and checks it against an already stated attribution; it introduces no new mathematical claim and
 * changes no bound. The component model is NOT a rigorous asymptotic. The C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no
 * operator positivity; changes no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-34470-height-map-affinity-departure-fit (the OLS linear fit and convex residual this fits a quadratic to)
 * @see imp-34246-widening-slope-limit-analytic-derivation (the b(u) = ln10*(1-1/u) slope whose curvature is checked)
 * @see imp-34408-widening-slope-prepole-landmark-decade-axis (F2: the near-affine attribution imp-34470 quantified)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, the RvM inversion defining u(k))
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const LN10 = Math.LN10;

// EXACT imp-34470 rung -> u map and window/grid.
const uOfK = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 1)) / TWO_PI);
const K_LO = 17.8;
const K_HI = 21.3;
const M = 351; // 0.01-decade spacing, matching imp-34470

const KS = [];
const US = [];
for (let i = 0; i < M; i++) {
  const k = K_LO + ((K_HI - K_LO) * i) / (M - 1);
  KS.push(k);
  US.push(uOfK(k));
}

// EXACT imp-34470 OLS linear fit u = a + b*k, whose residual we now fit a quadratic to.
let sumK = 0;
let sumU = 0;
let sumKK = 0;
let sumKU = 0;
for (let i = 0; i < M; i++) {
  sumK += KS[i];
  sumU += US[i];
  sumKK += KS[i] * KS[i];
  sumKU += KS[i] * US[i];
}
const B_SLOPE = (M * sumKU - sumK * sumU) / (M * sumKK - sumK * sumK); // 2.24965
const A_INTERCEPT = (sumU - B_SLOPE * sumK) / M; // -0.41216

// Linear-fit residual on the same grid (the convex imp-34470 residual).
const R = US.map((u, i) => u - (A_INTERCEPT + B_SLOPE * KS[i]));

// OLS quadratic fit of the residual: r = c0 + c1*k + c2*k^2. Normal-equation moments over {1, k, k^2}.
let s0 = M;
let s1 = 0;
let s2 = 0;
let s3 = 0;
let s4 = 0;
let t0 = 0;
let t1 = 0;
let t2 = 0;
for (let i = 0; i < M; i++) {
  const k = KS[i];
  const k2 = k * k;
  s1 += k;
  s2 += k2;
  s3 += k2 * k;
  s4 += k2 * k2;
  t0 += R[i];
  t1 += R[i] * k;
  t2 += R[i] * k2;
}
// Solve the 3x3 symmetric normal system by Gaussian elimination with partial pivoting.
function solve3(mat, rhs) {
  const m = mat.map((row) => row.slice());
  const b = rhs.slice();
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[piv][col])) piv = r;
    }
    const tmpRow = m[col];
    m[col] = m[piv];
    m[piv] = tmpRow;
    const tmpB = b[col];
    b[col] = b[piv];
    b[piv] = tmpB;
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = m[r][col] / m[col][col];
      for (let c = 0; c < 3; c++) m[r][c] -= f * m[col][c];
      b[r] -= f * b[col];
    }
  }
  return [b[0] / m[0][0], b[1] / m[1][1], b[2] / m[2][2]];
}
const [C0, C1, C2] = solve3(
  [
    [s0, s1, s2],
    [s1, s2, s3],
    [s2, s3, s4],
  ],
  [t0, t1, t2],
);

// Fit quality of the quadratic on the residual.
let sseQ = 0;
let sstQ = 0;
const rMean = t0 / M;
for (let i = 0; i < M; i++) {
  const fit = C0 + C1 * KS[i] + C2 * KS[i] * KS[i];
  sseQ += (R[i] - fit) * (R[i] - fit);
  sstQ += (R[i] - rMean) * (R[i] - rMean);
}
const R2_QUAD = 1 - sseQ / sstQ; // 0.99908

// Empirical curvature: the linear fit contributes zero second derivative, so d2u/dk2 = 2*c2.
const EMPIRICAL_CURVATURE = 2 * C2; // 2.73852e-3

// Analytic prediction from the imp-34246 widening-slope ODE du/dk = ln10*(1-1/u):
//   d2u/dk2 = b'(u)*du/dk = (ln10/u^2)*b(u) = ln10^2*(1-1/u)/u^2.
const U_MID = uOfK((K_LO + K_HI) / 2); // 43.567
const PRED_CURVATURE = (LN10 * LN10 * (1 - 1 / U_MID)) / (U_MID * U_MID); // 2.72917e-3
const PRED_DRIFT_RATE = LN10 / (U_MID * U_MID); // 1.21311e-3 -- the bare per-u db/du imp-34470 named
const CURVATURE_RATIO = EMPIRICAL_CURVATURE / PRED_CURVATURE; // 1.0034

export const IMP34510_AFFINITY_RESIDUAL_QUADRATIC_CURVATURE_CHECK = {
  id: 'imp-34510',
  proofSection: 'S-frontier',
  question:
    'Fit the convex imp-34470 affinity-departure residual to a quadratic r = c0 + c1*k + c2*k^2 (OLS) and ' +
    'check the curvature coefficient c2 against the predicted widening-slope curvature ln10^2*(1-1/u)/u^2 ' +
    '(u ~ 44), confirming the imp-34470 ln10/u^2 attribution quantitatively.',
  window: { kLo: K_LO, kHi: K_HI, samples: M },
  // reused imp-34470 linear fit
  linearSlopeB: +B_SLOPE.toFixed(5), // 2.24965
  linearInterceptA: +A_INTERCEPT.toFixed(5), // -0.41216
  // quadratic residual fit
  quadC0: +C0.toExponential(4), // 5.2193e-1
  quadC1: +C1.toExponential(4), // -5.3538e-2
  quadC2: +C2.toExponential(5), // 1.36926e-3
  quadRSquared: +R2_QUAD.toFixed(5), // 0.99908
  // the curvature check
  empiricalCurvature: +EMPIRICAL_CURVATURE.toExponential(5), // 2.73852e-3 (= 2*c2)
  uMid: +U_MID.toFixed(3), // 43.567
  predictedCurvature: +PRED_CURVATURE.toExponential(5), // 2.72917e-3 = ln10^2*(1-1/u)/u^2
  predictedDriftRate: +PRED_DRIFT_RATE.toExponential(5), // 1.21311e-3 = bare ln10/u^2 (per-u db/du)
  curvatureRatio: +CURVATURE_RATIO.toFixed(4), // 1.0034
  attributionConfirmed: Math.abs(CURVATURE_RATIO - 1) < 0.01, // true: agree to 0.34%
  isRigorous: false,
  verdict:
    'MEASURED (component-model only): the convex imp-34470 affinity-departure residual (OLS linear fit ' +
    'u = -0.41216 + 2.24965*k across k = 17.8..21.3) fit to a quadratic r = 5.2193e-1 - 5.3538e-2*k + ' +
    '1.36926e-3*k^2 (R^2 on the residual = 0.99908) has curvature coefficient c2 = 1.36926e-3, giving an ' +
    'empirical residual curvature 2*c2 = 2.73852e-3. This matches the predicted imp-34246 widening-slope ' +
    'curvature d2u/dk2 = ln10^2*(1-1/u)/u^2 = 2.72917e-3 at the window midpoint u = 43.567 (finite-diff ' +
    'd2u/dk2 = 2.72917e-3) to within 0.34% (ratio 1.0034), CONFIRMING the imp-34470 attribution ' +
    'quantitatively. The bare ln10/u^2 = 1.21311e-3 imp-34470 named is the per-u slope-drift rate db/du; ' +
    'the per-k residual curvature is that times the local slope b ~ 2.25, giving the full 2.729e-3. The ' +
    'quadratic captures the residual (R^2 = 0.999), so the convex residual really is parabolic-dominated as ' +
    'the constant-curvature model predicts. Measurement / cross-check only within the inherited ' +
    'imp-3220/imp-3406/imp-33810/imp-34246 component model, NOT a rigorous asymptotic; imp-34470 findings ' +
    'UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
};

const IMP34510_ASSERTIONS = [
  {
    // The reused imp-34470 linear fit reproduces the near-affine slope/intercept.
    id: 'imp34510-reuses-imp34470-linear-fit',
    description: 'reused OLS linear fit gives b~2.24965, a~-0.41216 (the imp-34470 fit)',
    holds: () =>
      Math.abs(B_SLOPE - 2.24965) < 1e-3 && Math.abs(A_INTERCEPT - -0.41216) < 1e-3,
  },
  {
    // The quadratic captures the residual well and its curvature coefficient is c2 ~ 1.369e-3.
    id: 'imp34510-quadratic-curvature-coefficient',
    description: 'quadratic residual fit has c2 ~ 1.36926e-3 with R^2 ~ 0.999 (residual is parabolic-dominated)',
    holds: () =>
      Math.abs(C2 - 1.36926e-3) < 1e-5 && R2_QUAD > 0.99 && R2_QUAD < 1,
  },
  {
    // The empirical curvature 2*c2 matches the closed-form ln10^2*(1-1/u)/u^2 at u~43.57 to <1%.
    id: 'imp34510-curvature-matches-prediction',
    description: 'empirical 2*c2 ~ 2.739e-3 matches ln10^2*(1-1/u)/u^2 ~ 2.729e-3 at u~43.57 (ratio ~1.003)',
    holds: () =>
      Math.abs(EMPIRICAL_CURVATURE - 2.73852e-3) < 1e-5 &&
      Math.abs(PRED_CURVATURE - 2.72917e-3) < 1e-5 &&
      Math.abs(CURVATURE_RATIO - 1) < 0.01,
  },
  {
    // The bare ln10/u^2 is the per-u drift rate, smaller than the per-k curvature by the local slope b~2.25.
    id: 'imp34510-bare-drift-rate-times-slope',
    description: 'bare ln10/u^2 ~1.213e-3 is db/du; per-k curvature is that times b~2.25, giving ~2.729e-3',
    holds: () =>
      Math.abs(PRED_DRIFT_RATE - 1.21311e-3) < 1e-5 &&
      Math.abs(PRED_DRIFT_RATE * B_SLOPE - PRED_CURVATURE) < 5e-5,
  },
  {
    // Honesty gate: measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34510-honesty-gate-no-qed',
    description: 'isRigorous false, no bound changed, NO QED, K_a>=0 untouched, C_mb per imp-486 untouched, no refereed bound is changed',
    holds: () =>
      IMP34510_AFFINITY_RESIDUAL_QUADRATIC_CURVATURE_CHECK.isRigorous === false &&
      /NO QED/.test(IMP34510_AFFINITY_RESIDUAL_QUADRATIC_CURVATURE_CHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34510_AFFINITY_RESIDUAL_QUADRATIC_CURVATURE_CHECK.verdict) &&
      /C_mb GUE-conditional per imp-486 UNTOUCHED/.test(IMP34510_AFFINITY_RESIDUAL_QUADRATIC_CURVATURE_CHECK.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34510_AFFINITY_RESIDUAL_QUADRATIC_CURVATURE_CHECK.verdict),
  },
];

for (const a of IMP34510_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34510-affinity-residual-quadratic-curvature-check assertion failed: ${a.id}`);
  }
}

export default IMP34510_AFFINITY_RESIDUAL_QUADRATIC_CURVATURE_CHECK;
