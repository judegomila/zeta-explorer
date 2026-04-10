/**
 * imp-334 (BLOCKER B2 angle a): 1/N² quadratic-correction re-fit of the
 * Path C baseline.
 *
 * Every B2(a) angle so far has fit |t_c(N)| = a + b·(1/N) linearly. The 1/N
 * ansatz is asymptotic — at finite N there can be a curvature correction
 *
 *     |t_c(N)| = a + b · (1/N) + c · (1/N)² + ε,                       (Q)
 *
 * and if the quadratic fit is statistically preferred AND drives â below
 * zero, the linear ansatz was systematically biasing the intercept estimate
 * upward, and B2(a) may already be closed as a fitting-model artefact.
 *
 * This file runs the 3-parameter OLS (Q) on:
 *   (1) the 5-point Path C baseline PATH_C_BASELINE_FIT (imp-309 / imp-323);
 *   (2) the 8-point imp-329 projected baseline (same 5 points + synthetic
 *       rows at N ∈ {1000, 3000, 5000} sitting EXACTLY on the linear OLS
 *       fit line — a deliberately adversarial test for the quadratic
 *       model, since synthetic-on-linear-line points pull ĉ toward 0).
 *
 * For each dataset we report:
 *   - (â, b̂, ĉ) and OLS standard errors from Var(β̂) = σ̂² · (XᵀX)⁻¹;
 *   - the linear OLS (â_lin, b̂_lin) residual sum of squares SSR_lin;
 *   - the F statistic for H₀: c = 0 vs H₁: c ≠ 0,
 *
 *         F = ((SSR_lin − SSR_quad) / 1) / (SSR_quad / (n − 3));
 *
 *   - the critical F(1, n−3) at 95% (hard-coded for the two df we need);
 *   - ΔAIC = AIC_quad − AIC_lin where AIC_k = n·ln(SSR/n) + 2k  (k = 2 or 3);
 *   - the one-sided 95% upper confidence bound on â using the Student-t
 *     critical at df = n − 3 (hard-coded for df = 2 and df = 5);
 *   - a boolean verdict aEstablishedBelowZero_oneSided95 that is TRUE iff
 *     both (a) the F-test rejects H₀ at 5% AND (b) â + t(0.95, n−3)·SE(â) ≤ 0.
 *
 * Honest scope
 * ------------
 * With n = 5 and three parameters the quadratic fit has df = 2. Adding a
 * curvature term is cheap in parameters but EXPENSIVE in df — t(0.95, 2) =
 * 2.920 against t(0.95, 3) = 2.353, and the F(1, 2) critical is 18.51,
 * so the quadratic fit has to EARN its extra parameter by a very sharp
 * drop in SSR to be preferred. If F < 18.51 the honest verdict is "the
 * linear ansatz is not falsified and the quadratic re-fit does not close
 * B2(a)". The projected 8-point re-fit is reported as a diagnostic: ĉ on
 * synthetic-on-linear-line data is structurally biased toward 0, so its
 * value is seeing whether the REAL 5-point curvature signal survives
 * dilution by df-padding with synthetic points, not as an independent
 * measurement.
 *
 * The ladder from imp-332 is deliberately EXCLUDED from this re-fit: its
 * rows are the arithmetic round-trip y = â_OLS + b̂_OLS/N of the linear
 * baseline fit, so they sit exactly on a line and the quadratic term
 * recovers ĉ = 0 with ~zero residual by construction, carrying no
 * curvature information. This matches the imp-333 pooling exclusion
 * rationale.
 *
 * Interpretation of the result
 * ----------------------------
 * If F < F_crit AND ΔAIC > 0, the quadratic term is NOT statistically
 * preferred over the linear ansatz — the 5-point baseline alone cannot
 * distinguish the two models, and the positive â from linear OLS remains
 * the honest statistical state. The path forward is NOT to pick the model
 * with the lower â (that would be unprincipled), but either (i) obtain
 * measured collision times at new N that break the model-degeneracy, or
 * (ii) the analytic angle imp-328.
 *
 * If F ≥ F_crit AND the upper 95% CL on â_quad ≤ 0, the quadratic re-fit
 * tips B2(a) — downstream work then has to update lambda-zero-attack.js
 * LAMBDA_ZERO_CLOSURE, bridge-lambda-rh.js remainingSteps, and the
 * lambda-intercept-confidence.js / lambda-intercept-pooled.js verdicts.
 * The build-time assertion at the bottom of this file is a tripwire
 * forcing that downstream update.
 *
 * ticket: imp-334  |  priority: critical  |  section: S7 / B2(a)
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';

// Student-t one-sided 95% critical values at the two df we need.
const T_ONE_SIDED_95 = {
  2: 2.920, // df = 2 (5-point quadratic, n − 3 = 2)
  5: 2.015, // df = 5 (8-point projected quadratic, n − 3 = 5)
};

// F-distribution 95% critical values for H₀: c = 0 (one extra parameter).
const F_CRIT_95 = {
  2: 18.513, // F(1, 2)
  5: 6.608,  // F(1, 5)
};

// ────────────────────────────────────────────────────────────────────────
// 3×3 linear-system helpers (Cramer's rule + full 3×3 inverse).
// We avoid shipping a general linear algebra routine because we only need
// to invert XᵀX once per dataset at this site.
// ────────────────────────────────────────────────────────────────────────
function det3(m) {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

function inv3(m) {
  const D = det3(m);
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  // Adjugate (transpose of cofactor matrix) divided by det.
  return [
    [ (e * i - f * h) / D, -(b * i - c * h) / D,  (b * f - c * e) / D],
    [-(d * i - f * g) / D,  (a * i - c * g) / D, -(a * f - c * d) / D],
    [ (d * h - e * g) / D, -(a * h - b * g) / D,  (a * e - b * d) / D],
  ];
}

function matVec3(M, v) {
  return [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2],
  ];
}

// ────────────────────────────────────────────────────────────────────────
// 3-parameter OLS: y = a + b·x + c·x², with x = 1/N.
//
// Normal equations XᵀX · β = Xᵀy,
//
//     XᵀX = [ S₀ S₁ S₂ ]    Xᵀy = [ T₀ ]
//           [ S₁ S₂ S₃ ]          [ T₁ ]
//           [ S₂ S₃ S₄ ]          [ T₂ ]
//
// where S_k = Σ x_i^k, T_k = Σ x_i^k · y_i.
// ────────────────────────────────────────────────────────────────────────
function quadraticFit(points) {
  const n = points.length;
  const xs = points.map((p) => 1 / p.N);
  const ys = points.map((p) => p.tc);

  let S0 = 0, S1 = 0, S2 = 0, S3 = 0, S4 = 0;
  let T0 = 0, T1 = 0, T2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    const x2 = x * x;
    const x3 = x2 * x;
    const x4 = x2 * x2;
    S0 += 1;
    S1 += x;
    S2 += x2;
    S3 += x3;
    S4 += x4;
    T0 += y;
    T1 += x * y;
    T2 += x2 * y;
  }

  const XtX = [
    [S0, S1, S2],
    [S1, S2, S3],
    [S2, S3, S4],
  ];
  const XtY = [T0, T1, T2];
  const XtXInv = inv3(XtX);
  const [a, b, c] = matVec3(XtXInv, XtY);

  let ssr = 0;
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const yhat = a + b * x + c * x * x;
    const r = ys[i] - yhat;
    residuals.push(r);
    ssr += r * r;
  }
  const dof = n - 3;
  const sigma2 = dof > 0 ? ssr / dof : Number.NaN;
  const sigma = Math.sqrt(Math.abs(sigma2));

  // Var(β̂) = σ̂² · (XᵀX)⁻¹.  Diagonal gives variance of each coefficient.
  const varA = sigma2 * XtXInv[0][0];
  const varB = sigma2 * XtXInv[1][1];
  const varC = sigma2 * XtXInv[2][2];
  const seA = Math.sqrt(Math.abs(varA));
  const seB = Math.sqrt(Math.abs(varB));
  const seC = Math.sqrt(Math.abs(varC));

  return { n, dof, a, b, c, seA, seB, seC, sigma, sigma2, ssr, residuals };
}

// 2-parameter OLS (linear ansatz y = a + b·x). Used to compute SSR_lin for
// the F-test against the quadratic fit on the SAME dataset.
function linearFit(points) {
  const n = points.length;
  const xs = points.map((p) => 1 / p.N);
  const ys = points.map((p) => p.tc);

  const sx = xs.reduce((s, x) => s + x, 0);
  const sy = ys.reduce((s, y) => s + y, 0);
  const xbar = sx / n;
  const ybar = sy / n;

  let Sxx = 0, Sxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - xbar;
    const dy = ys[i] - ybar;
    Sxx += dx * dx;
    Sxy += dx * dy;
  }
  const b = Sxy / Sxx;
  const a = ybar - b * xbar;

  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const yhat = a + b * xs[i];
    const r = ys[i] - yhat;
    ssr += r * r;
  }
  return { n, a, b, ssr };
}

// Build the imp-329 projected 8-point baseline from the SAME constants the
// imp-323 file uses, so there is no drift between files.
const IMP329_EXTRA_N = [1000, 3000, 5000];
const OLS_A = LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a;
const OLS_B = LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b;
const IMP329_SYNTHETIC_POINTS = IMP329_EXTRA_N.map((N) => ({
  N,
  tc: OLS_A + OLS_B / N, // exactly on the linear OLS fit line
  synthetic: true,
}));
const IMP329_PROJECTED_BASELINE = [
  ...PATH_C_BASELINE_FIT.map((p) => ({ N: p.N, tc: p.tc, synthetic: false })),
  ...IMP329_SYNTHETIC_POINTS,
];

function diagnose(label, points, tCritKey, fCritKey) {
  const lin = linearFit(points);
  const quad = quadraticFit(points);
  const n = points.length;
  const dofQuad = n - 3;

  // F statistic for H₀: c = 0. dfN = 1, dfD = n − 3.
  const F = dofQuad > 0
    ? ((lin.ssr - quad.ssr) / 1) / (quad.ssr / dofQuad)
    : Number.NaN;
  const Fcrit = F_CRIT_95[fCritKey];
  const quadraticPreferredByF = Number.isFinite(F) && F >= Fcrit;

  // ΔAIC = AIC_quad − AIC_lin. Lower AIC is preferred.
  // AIC = n·ln(SSR/n) + 2k, dropping the Gaussian constant.
  const aicLin = n * Math.log(lin.ssr / n) + 2 * 2;
  const aicQuad = n * Math.log(Math.max(quad.ssr, 1e-300) / n) + 2 * 3;
  const deltaAIC = aicQuad - aicLin;
  const quadraticPreferredByAIC = deltaAIC < 0;

  // One-sided 95% upper CL on â_quad (Student-t with df = n − 3).
  const tCrit = T_ONE_SIDED_95[tCritKey];
  const aUpper95 = quad.a + tCrit * quad.seA;
  const aLower95 = quad.a - tCrit * quad.seA;
  const aEstablishedBelowZero_oneSided95 =
    quadraticPreferredByF && aUpper95 <= 0;

  return {
    label,
    n,
    linear: {
      a: lin.a,
      b: lin.b,
      ssr: lin.ssr,
    },
    quadratic: {
      a: quad.a,
      b: quad.b,
      c: quad.c,
      seA: quad.seA,
      seB: quad.seB,
      seC: quad.seC,
      residualSSR: quad.ssr,
      residualStdDev: quad.sigma,
      dof: quad.dof,
      residuals: quad.residuals,
    },
    modelComparison: {
      F,
      FcritOneSided95: Fcrit,
      quadraticPreferredByF,
      aicLin,
      aicQuad,
      deltaAIC,
      quadraticPreferredByAIC,
    },
    interceptConfidence: {
      tCritOneSided95: tCrit,
      oneSided95Upper: aUpper95,
      oneSided95Lower: aLower95,
    },
    verdict: {
      aEstablishedBelowZero_oneSided95,
      statement: aEstablishedBelowZero_oneSided95
        ? 'imp-334: quadratic 1/N² ansatz is statistically preferred AND its ' +
          'one-sided 95% upper CL on a is ≤ 0. B2(a) may be closed by the ' +
          'curvature correction. Downstream: update lambda-zero-attack.js ' +
          'LAMBDA_ZERO_CLOSURE, bridge-lambda-rh.js remainingSteps, and the ' +
          'verdicts in lambda-intercept-confidence.js / lambda-intercept-pooled.js.'
        : (quadraticPreferredByF
            ? 'imp-334: quadratic 1/N² ansatz is statistically preferred by F-test ' +
              'but its one-sided 95% upper CL on a is still > 0. B2(a) NOT closed ' +
              'by this angle.'
            : 'imp-334: quadratic 1/N² ansatz is NOT statistically preferred over ' +
              'the linear 1/N ansatz at 5% (F < F_crit). The 5-point baseline cannot ' +
              'distinguish the two models; picking the model with the lower â would ' +
              'be unprincipled. B2(a) NOT closed by the curvature correction.'),
    },
  };
}

const BASELINE_5 = diagnose(
  '5-point Path C baseline',
  PATH_C_BASELINE_FIT,
  2, // df for t-critical
  2, // df for F-critical
);

const PROJECTED_8 = diagnose(
  'imp-329 projected 8-point baseline (synthetic-on-linear-line)',
  IMP329_PROJECTED_BASELINE,
  5,
  5,
);

export const LAMBDA_INTERCEPT_QUADRATIC = {
  purpose:
    'imp-334 (B2 angle a): 1/N² curvature-correction re-fit — does adding a ' +
    'quadratic term to the Path C fit drop â ≤ 0 and flip B2(a)?',
  ticket: 'imp-334',
  blockerRef: 'lambda-zero-attack.js / LAMBDA_ZERO_BLOCKERS[B2] angle (a)',
  model: '|t_c(N)| = a + b·(1/N) + c·(1/N)² + ε',

  datasets: {
    baseline5: BASELINE_5,
    projected8: PROJECTED_8,
  },

  // Headline verdict is driven by the 5-point baseline fit — the projected
  // 8-point diagnostic is structurally biased toward ĉ = 0 and must NOT
  // override a meaningful 5-point curvature signal.
  verdict: {
    driver: 'baseline5',
    aEstablishedBelowZero_oneSided95:
      BASELINE_5.verdict.aEstablishedBelowZero_oneSided95,
    oneSided95Upper: BASELINE_5.interceptConfidence.oneSided95Upper,
    statement: BASELINE_5.verdict.statement,
  },

  ladderExcluded: true,
  ladderExclusionReason:
    'The imp-332 log-spaced ladder is the arithmetic round-trip of the ' +
    'linear OLS fit, so its rows sit exactly on a line in 1/N and the ' +
    'quadratic term recovers ĉ = 0 with ~zero residual by construction. ' +
    'Including it would pollute the F-test with noise-free zero-residual ' +
    'rows. This matches the imp-333 pooling exclusion rationale.',

  honestScope:
    'With n = 5 and 3 parameters the quadratic fit has df = 2, and t(0.95, 2) ' +
    '= 2.920 is strictly larger than t(0.95, 3) = 2.353, so the quadratic ' +
    'term has to EARN its extra parameter against both the F(1, 2) = 18.51 ' +
    'critical AND the widened t-interval. This file does NOT pick the ' +
    'lower-â model regardless of statistical support; the verdict is ' +
    'gated on the F-test.',
};

export const LAMBDA_INTERCEPT_QUADRATIC_ASSERTIONS = [
  {
    id: 'imp334-quadratic-fit-finite',
    holds: () =>
      Number.isFinite(BASELINE_5.quadratic.a) &&
      Number.isFinite(BASELINE_5.quadratic.b) &&
      Number.isFinite(BASELINE_5.quadratic.c) &&
      Number.isFinite(BASELINE_5.quadratic.seA),
    why:
      'imp-334: the 3-parameter OLS on the 5-point baseline must produce ' +
      'finite coefficients and a finite intercept SE. A NaN here means the ' +
      '3×3 normal-equation system is singular, which on the baseline 1/N ' +
      'values would itself be a code bug worth surfacing.',
  },
  {
    id: 'imp334-linear-ssr-ge-quadratic-ssr',
    holds: () =>
      BASELINE_5.linear.ssr + 1e-15 >= BASELINE_5.quadratic.residualSSR,
    why:
      'imp-334: a nested 3-parameter OLS fit on the SAME data must have ' +
      'SSR no larger than its 2-parameter restriction. Violation indicates ' +
      'a fit-routine bug.',
  },
  {
    id: 'imp334-projected-8-point-quadratic-c-small',
    holds: () => {
      // The imp-329 projected 8-point baseline adds 3 synthetic rows that
      // sit exactly on the LINEAR OLS line. The quadratic fit should
      // therefore recover |ĉ| near zero relative to the raw 5-point
      // curvature. We compare against the 5-point |ĉ| and require the
      // 8-point fit to be STRICTLY closer to ĉ = 0.
      return (
        Math.abs(PROJECTED_8.quadratic.c) <=
        Math.abs(BASELINE_5.quadratic.c) + 1e-15
      );
    },
    why:
      'imp-334: the projected 8-point dataset pads the 5-point baseline ' +
      'with synthetic rows that sit on the LINEAR fit line, which biases ĉ ' +
      'toward zero. If this fails the imp-329 projection has drifted from ' +
      'the linear OLS line (or the quadratic fit routine is misbehaving on ' +
      'the padded dataset).',
  },
  {
    id: 'imp334-b2a-not-closed-by-quadratic-unless-downstream-updated',
    holds: () =>
      !LAMBDA_INTERCEPT_QUADRATIC.verdict.aEstablishedBelowZero_oneSided95,
    why:
      'imp-334 currently documents the honest state that the 1/N² curvature ' +
      'correction does NOT close B2(a) on the 5-point baseline. If a future ' +
      'edit flips this to "closed", it MUST also update lambda-zero-attack.js ' +
      'LAMBDA_ZERO_CLOSURE, bridge-lambda-rh.js remainingSteps, and the ' +
      'verdicts in lambda-intercept-confidence.js and lambda-intercept-pooled.js.',
  },
];
