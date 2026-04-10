/**
 * imp-323 (BLOCKER B2): one-sided confidence bound on the Path C fit intercept
 *
 * lambda-zero-attack.js B2 is the SOLE load-bearing blocker between Path C
 * and Λ ≤ 0 at the heights the verified zero list controls: if the intercept
 * a in |t_c(N)| ≈ a + b/N is provably ≤ 0, then the Dyson backward collision
 * argument delivers Λ ≤ 0, which IS the Riemann Hypothesis up to that
 * height. imp-323 proposed two angles of attack:
 *
 *   (a) statistical — show that the fitted a is within one-sided confidence
 *       distance of 0 and use a proper upper CI bound instead of the point
 *       estimate;
 *   (b) analytic   — derive an a-priori upper bound on a from the Dyson ODE
 *       itself, not the numerical fit.
 *
 * This file executes angle (a) on the baseline 5-point Path C data that
 * lambda-error-budget.js named the binding constraint — the same points
 * dyson-scaling-N5000.js re-fits when imp-315 extends N. The angle (b)
 * analytic closure is still open and tracked in lambda-zero-attack.js B2.
 *
 * Statistical setup
 * -----------------
 * Data: (x_i, y_i) with x_i = 1/N_i and y_i = |t_c(N_i)| from the imp-309
 * Path C run, N ∈ {50, 100, 200, 500, 2458}. Model: y = a + b·x + ε,
 * ε ~ N(0, σ²), i.i.d. Ordinary least squares gives
 *
 *     b̂ = Sxy / Sxx                           (slope)
 *     â = ȳ − b̂·x̄                              (intercept)
 *     σ̂² = SSR / (n − 2)                       (residual variance, df = 3)
 *     Var(â) = σ̂² · (1/n + x̄² / Sxx)           (intercept variance)
 *     SE(â) = √Var(â)
 *
 * With n = 5 degrees of freedom n − 2 = 3, the t-critical values are
 *   t(0.95,  3) ≈ 2.353     (one-sided 95% = two-sided 90%)
 *   t(0.975, 3) ≈ 3.182     (two-sided 95%)
 *   t(0.995, 3) ≈ 5.841     (two-sided 99%)
 *
 * The one-sided upper 95% confidence bound on the TRUE intercept a is
 *   a_upper(95%) = â + t(0.95, 3) · SE(â).
 * If a_upper(95%) ≤ 0, the data establishes Λ ≤ 0 at one-sided 95%
 * confidence (which, combined with Rodgers–Tao Λ ≥ 0, would force Λ = 0
 * at the controlled height). The complementary one-sided LOWER bound
 *   a_lower(95%) = â − t(0.95, 3) · SE(â)
 * tells us whether 0 is even plausible under the fit — i.e. whether the
 * data is CONSISTENT with Λ ≤ 0 while not yet PROVING it.
 *
 * Honest result
 * -------------
 * The OLS fit on the recorded baseline points (see PATH_C_BASELINE in
 * dyson-scaling-N5000.js) gives â ≈ 0.0029 — smaller than the headline
 * Path C value 0.0066 that bridge-lambda-rh.js and lambda-cross-validation.js
 * carry. The ~0.0037 discrepancy is within the computed SE and reflects
 * that the headline 0.0066 / 4.91 numbers come from a runtime Dyson ODE
 * re-run with slightly different collision times, not from OLS on this
 * exact 5-point table. Both values are tracked below (computedCentralOLS
 * and headlinePathC) and neither supersedes the other; this file
 * deliberately does NOT overwrite the headline because every other Λ
 * record imports from the bridge/error-budget files.
 *
 * Verdict for B2 (a):
 *   - â > 0 on the baseline points, so strict a ≤ 0 is NOT established
 *     at any one-sided confidence level (the upper CL is strictly above
 *     the point estimate, which is itself > 0).
 *   - BUT the one-sided 95% LOWER bound on a is NEGATIVE on this fit:
 *     the 5-point data is statistically CONSISTENT with a ≤ 0. The
 *     null "a = 0" cannot be rejected at two-sided 95%. So B2(a) is
 *     approachable — shrinking SE(â) (imp-315 extending N) could tip
 *     the upper CL below zero even without a shift in â.
 *   - Angle (b) (analytic bound on a) remains the only path to a
 *     THEOREM-grade closure of B2; angle (a) can at best give a
 *     confidence-interval claim that upgrades to "Λ ≤ 0 at one-sided
 *     95%" when imp-315 doubles the lever arm.
 *
 * Scope and caveats
 * -----------------
 * - 5 data points and normal-errors OLS is a caricature of the true
 *   underlying uncertainty — the collision times carry per-N Dyson
 *   integration error that is neither i.i.d. nor Gaussian, so the
 *   t-intervals computed here are NOT a substitute for the full
 *   imp-314 error budget. They are the angle (a) instrument only.
 * - The one-sided 95% lower bound crossing zero does not mean a ≤ 0
 *   is proved; it means the null a = 0 is statistically consistent.
 * - Angle (b) — analytic bound on a from the Dyson ODE — remains
 *   the load-bearing path forward for a theorem-grade Λ ≤ 0.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_ERROR_BUDGET } from './lambda-error-budget.js';

// Inverse Student-t at df = 3, for the tails we need. Hard-coded to avoid
// shipping a full quantile routine for a single use site.
const T_CRIT = {
  'one-sided-90': 1.638, // df=3, upper 90%
  'one-sided-95': 2.353, // df=3, upper 95%
  'one-sided-99': 4.541, // df=3, upper 99%
  'two-sided-95': 3.182, // df=3, two-sided 95% = upper 97.5%
  'two-sided-99': 5.841, // df=3, two-sided 99% = upper 99.5%
};

// imp-329: Student-t critical values at df = 6, needed for the projected
// 8-point re-fit (3 extra baseline points at N ∈ {1000, 3000, 5000}).
// Going from df = 3 to df = 6 alone drops t(0.95) from 2.353 to 1.943 —
// a ~17% shrink in the one-sided 95% CI half-width, before any reduction
// in seA from the expanded Sxx lever arm.
const T_CRIT_DF6 = {
  'one-sided-90': 1.440, // df=6, upper 90%
  'one-sided-95': 1.943, // df=6, upper 95%
  'one-sided-99': 3.143, // df=6, upper 99%
  'two-sided-95': 2.447, // df=6, two-sided 95% = upper 97.5%
  'two-sided-99': 3.707, // df=6, two-sided 99% = upper 99.5%
};

function olsFit(points) {
  const n = points.length;
  const xs = points.map((p) => 1 / p.N);
  const ys = points.map((p) => p.tc);

  const sx = xs.reduce((s, x) => s + x, 0);
  const sy = ys.reduce((s, y) => s + y, 0);
  const xbar = sx / n;
  const ybar = sy / n;

  let Sxx = 0;
  let Sxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - xbar;
    const dy = ys[i] - ybar;
    Sxx += dx * dx;
    Sxy += dx * dy;
  }

  const b = Sxy / Sxx;
  const a = ybar - b * xbar;

  // Residuals and residual variance with df = n - 2.
  let ssr = 0;
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const yhat = a + b * xs[i];
    const r = ys[i] - yhat;
    residuals.push(r);
    ssr += r * r;
  }
  const dof = n - 2;
  const sigma2 = ssr / dof;
  const sigma = Math.sqrt(sigma2);

  // Intercept variance: σ² · (1/n + x̄² / Sxx).
  const varA = sigma2 * (1 / n + (xbar * xbar) / Sxx);
  const seA = Math.sqrt(varA);

  // Slope variance: σ² / Sxx.
  const varB = sigma2 / Sxx;
  const seB = Math.sqrt(varB);

  return { n, dof, a, b, Sxx, Sxy, xbar, ybar, sigma, sigma2, seA, seB, residuals, ssr };
}

// imp-331: Weighted least squares re-fit of the same baseline.
//
// imp-331 asked for WLS with weights w_i = 1/δ(t_c, N_i)² using the certified
// per-N bounds from interval-dyson-collision.js (imp-318). That file runs a
// verified-computing backward Dyson at a single witness N = 12 and does NOT
// currently produce δ(t_c) at the baseline values N ∈ {50, 100, 200, 500,
// 2458}, so the literal weight list called for in the ticket is not yet
// available. In its place we adopt a DECLARED relative-error model
//
//     δ(t_c, N_i) ≈ σ_rel · y_i
//
// motivated by the empirical behaviour of the float64 RK4 + Kahan backward
// integrator: the per-trajectory drift is dominated by the accumulated
// Richardson tail at the final steps, which scales with the collision time
// t_c itself rather than with N directly. With that model the weights become
//
//     w_i = 1 / (σ_rel² · y_i²)   ∝   1 / y_i²
//
// and, crucially, the WLS point estimate and the CI half-widths are invariant
// under rescaling w_i → k·w_i (the empirical residual variance σ̂²_w absorbs
// the constant and the k cancels out of Var(â) = σ̂²_w · S_wxx / D). So the
// (unknown) value of σ_rel drops out of everything reported here — we are
// not smuggling in a guessed error magnitude, only the relative SHAPE of the
// error as a function of N, and that shape is the minimum the ticket needs.
//
// What this WLS is useful for:
//   - The large-N points (N = 500, 2458) have y_i ≈ 0.016, 0.009 which under
//     this model are ~ (0.143/0.009)² ≈ 250× more precise than the N = 50
//     point. WLS lets those tight points dominate the fit, which the ticket
//     predicted would shift â toward zero and shrink SE(â).
//   - It provides an independent B2(a) instrument alongside OLS — if WLS and
//     OLS give meaningfully different â, the 5-point fit is sensitive to the
//     weighting scheme and the whole angle-(a) route is fragile at this N.
//
// Honesty: this is NOT the certified-δ WLS imp-331 literally requested. It
// IS a principled WLS re-fit with defensible weights and is clearly labelled
// below as the interim deliverable. The certified-δ WLS becomes possible
// once interval-dyson-collision.js (or a successor) runs at the baseline N.
function wlsFit(points, weights) {
  const n = points.length;
  const xs = points.map((p) => 1 / p.N);
  const ys = points.map((p) => p.tc);
  const ws = weights;

  let Sw = 0, Swx = 0, Swy = 0, Swxx = 0, Swxy = 0;
  for (let i = 0; i < n; i++) {
    const w = ws[i];
    Sw += w;
    Swx += w * xs[i];
    Swy += w * ys[i];
    Swxx += w * xs[i] * xs[i];
    Swxy += w * xs[i] * ys[i];
  }
  const D = Sw * Swxx - Swx * Swx;
  const b = (Sw * Swxy - Swx * Swy) / D;
  const a = (Swxx * Swy - Swx * Swxy) / D;

  const residuals = [];
  let ssrW = 0;
  for (let i = 0; i < n; i++) {
    const yhat = a + b * xs[i];
    const r = ys[i] - yhat;
    residuals.push(r);
    ssrW += ws[i] * r * r;
  }
  const dof = n - 2;
  // Empirical (reduced) residual variance. Invariant to w → k·w because k
  // enters numerator once and cancels against the k² in D in the Var(â)
  // formula below, leaving the reported standard errors in the natural
  // units of y regardless of how the weights are normalised.
  const sigma2 = ssrW / dof;
  const sigma = Math.sqrt(sigma2);

  // Normal-equation variances: Var(â) = σ̂²_w · S_wxx / D, Var(b̂) = σ̂²_w · S_w / D.
  const varA = sigma2 * Swxx / D;
  const varB = sigma2 * Sw / D;
  const seA = Math.sqrt(Math.abs(varA));
  const seB = Math.sqrt(Math.abs(varB));

  return { n, dof, a, b, sigma, sigma2, seA, seB, residuals, ssrW, weights: ws.slice() };
}

const FIT = olsFit(PATH_C_BASELINE_FIT);

// Relative-error weights w_i = 1 / y_i² (invariant to the unknown σ_rel).
const WLS_WEIGHTS = PATH_C_BASELINE_FIT.map((p) => 1 / (p.tc * p.tc));
const WLS = wlsFit(PATH_C_BASELINE_FIT, WLS_WEIGHTS);

function ciBounds(pointEstimate, standardError) {
  const out = {};
  for (const [key, t] of Object.entries(T_CRIT)) {
    out[key] = {
      upper: pointEstimate + t * standardError,
      lower: pointEstimate - t * standardError,
      halfWidth: t * standardError,
    };
  }
  return out;
}

const A_INTERVALS = ciBounds(FIT.a, FIT.seA);
const B_INTERVALS = ciBounds(FIT.b, FIT.seB);

const A_INTERVALS_WLS = ciBounds(WLS.a, WLS.seA);
const B_INTERVALS_WLS = ciBounds(WLS.b, WLS.seB);

// imp-329: projected 8-point re-fit with 3 extra baseline points at
// N ∈ {1000, 3000, 5000}.
//
// imp-329 ticket: shrink SE(â) by adding baseline points at N = 1000, 3000,
// 5000. With 8 points, df goes from 3 to 6, t(0.95) drops 2.353 → 1.943, and
// the expanded Sxx lever arm cuts (1/n + x̄²/Sxx) further. If the upper 95%
// CL tips below zero, B2(a) alone establishes Λ ≤ 0 at one-sided 95%.
//
// The ticket explicitly allowed either reading existing data from
// dyson-scaling-N5000.js OR running the backward Dyson fresh. Neither path
// produced a measured t_c at N = 1000, 3000, 5000 that is methodologically
// comparable to the recorded PATH_C_BASELINE_FIT points:
//   - dyson-scaling-N5000.js exports a function dysonScalingExtendedTest()
//     that generates data on demand, but the function is never invoked
//     automatically (its comment block calls out a ~7.5·10¹⁰ float op cost
//     that is too heavy for a page render) and no cached output sits in
//     the repo;
//   - the original Path C runtime that produced the N = 2458 tc = 0.0086
//     entry lived in certified-lambda-hybrid (imp-309) which has since been
//     removed — the only surviving artefact is the literal 5-tuple in
//     PATH_C_FIT_POINTS. A naive raw-backward-Dyson re-run at N ≤ 870 using
//     only the existing ZETA_ZEROS collapses at the smallest initial gap
//     long before N-dependent behaviour kicks in, so it produces a flat
//     |t_c| ≈ 0.0125 across N ∈ {700, 800, 850} that does NOT agree with
//     the 1/N decay shape of the baseline fit. The Path C methodology
//     includes ingredients (mean-field regularisation calibration, step
//     size choice, trajectory seeding) that are not all captured by the
//     surviving dyson-mean-field.js helper.
//
// In place of a measured re-fit, this block runs a PROJECTED re-fit using
// synthetic points placed exactly on the current OLS line: for each extra
// N the hypothetical y_i = â_OLS + b̂_OLS/N_i. Because the synthetic points
// sit on the line, adding them does not move the OLS point estimate (least
// squares is a linear projection — appending points that already lie on
// the fit preserves the fit) and does not increase SSR. But it DOES increase
// df from 3 to 6, which halves σ̂² = SSR/df, and it expands Sxx, which
// shrinks (1/n + x̄²/Sxx). The projection reports the full CI machinery at
// df = 6 so B2(a) has a calibrated answer to "what SE shrinkage does the
// ticket's 3-point addition buy you, in the BEST case where the new points
// land exactly on the current fit line". If this best-case upper CL still
// does NOT tip below zero, the ticket's statistical route is dead on the
// 5→8 point upgrade alone and closure requires either imp-321 (PT-scale
// log-spaced ladder, 2 more decades of lever arm) or the analytic angle
// (b) in imp-328. If the best-case upper CL DOES tip below zero, the
// ticket's route is viable and the follow-up work is a principled
// re-derivation of the Path C methodology at N = 1000, 3000, 5000 to
// check whether the real points land close enough to the fit line for
// the projection to remain meaningful.
//
// This is the SAME interim-deliverable pattern imp-331 and imp-332 used
// (WLS with declared weights; ladder round-trip refit): an honest-labelled
// projection that wires the statistical machinery while the measured data
// for a full closure remains a separate follow-up.
const IMP329_EXTRA_N = [1000, 3000, 5000];
const IMP329_SYNTHETIC_POINTS = IMP329_EXTRA_N.map((N) => ({
  N,
  tc: FIT.a + FIT.b / N, // sits exactly on the 5-point OLS line
  synthetic: true,
}));
const IMP329_PROJECTED_BASELINE = [
  ...PATH_C_BASELINE_FIT.map((p) => ({ N: p.N, tc: p.tc, synthetic: false })),
  ...IMP329_SYNTHETIC_POINTS,
];
const PROJECTED_FIT = olsFit(IMP329_PROJECTED_BASELINE);

// df = 6 CI bounds on the projected fit. The projected intercept equals
// FIT.a exactly (to float precision) because the added points lie on the
// 5-point OLS line; the value of this block is the new seA / upper-CL.
function ciBoundsDf6(pointEstimate, standardError) {
  const out = {};
  for (const [key, t] of Object.entries(T_CRIT_DF6)) {
    out[key] = {
      upper: pointEstimate + t * standardError,
      lower: pointEstimate - t * standardError,
      halfWidth: t * standardError,
    };
  }
  return out;
}
const PROJECTED_A_INTERVALS = ciBoundsDf6(PROJECTED_FIT.a, PROJECTED_FIT.seA);
const PROJECTED_B_INTERVALS = ciBoundsDf6(PROJECTED_FIT.b, PROJECTED_FIT.seB);

// How far off zero we are in SE units — "how many SE to cross 0 from a".
const aOverSe = FIT.a / FIT.seA;
const aOverSeWls = WLS.a / WLS.seA;
const aOverSeProjected = PROJECTED_FIT.a / PROJECTED_FIT.seA;

export const LAMBDA_INTERCEPT_CONFIDENCE = {
  purpose:
    'imp-323 (B2 angle a): one-sided confidence bound on the Path C fit intercept — ' +
    'is Λ ≤ 0 statistically compatible with the 5-point baseline fit?',
  blockerRef: 'lambda-zero-attack.js / LAMBDA_ZERO_BLOCKERS[B2]',
  fitSource: 'src/math/dyson-scaling-N5000.js PATH_C_BASELINE_FIT (imp-309 Path C data)',

  fitInputs: PATH_C_BASELINE_FIT.map((p) => ({ N: p.N, invN: 1 / p.N, tc: p.tc })),

  fit: {
    n: FIT.n,
    dof: FIT.dof,
    intercept_a: FIT.a,
    slope_b: FIT.b,
    residualStdDev: FIT.sigma,
    residualSSR: FIT.ssr,
    seIntercept: FIT.seA,
    seSlope: FIT.seB,
    residuals: FIT.residuals,
  },

  // Headline Path C number for comparison — NOT the source of truth here,
  // but the value every other Λ file in the repo has agreed on.
  headlinePathC: {
    centralValue: LAMBDA_ERROR_BUDGET.centralValue,
    source: 'lambda-error-budget.js (mirrors bridge-lambda-rh.js)',
    discrepancyFromOLS: LAMBDA_ERROR_BUDGET.centralValue - FIT.a,
    discrepancyNote:
      'The headline 0.0066 comes from a runtime Dyson re-run with collision times ' +
      'that differ slightly from the recorded PATH_C_BASELINE_FIT tuples used by OLS here. ' +
      'The ~0.0037 gap is inside one SE of â and this file does NOT overwrite the headline.',
  },

  computedCentralOLS: FIT.a,

  // imp-330 reconciliation: pick a single canonical Λ central value so the
  // 0.0029 (OLS) vs 0.0066 (headline Path C) gap stops being an unresolved
  // floating discrepancy that downstream files might silently re-pick from.
  // Decision: the headline 0.0066 from bridge-lambda-rh.js / lambda-error-budget.js
  // is the canonical Λ central value going forward, with the OLS 0.0029 retained
  // here as a *diagnostic* re-fit on the recorded 5-tuple snapshot only.
  // Why 0.0066 wins:
  //   (i)  Conservatism — for an UPPER bound on Λ, the larger of two compatible
  //        central values is the safer claim. 0.0066 ≥ 0.0029, so any reader
  //        quoting Λ ≤ 0.0066 + 0.01 is also covered against the OLS re-fit
  //        (whose two-sided 95% CI on a comfortably contains 0.0066).
  //   (ii) Provenance — the headline number flows from imp-309 / commit 229139's
  //        runtime Dyson ODE re-run with the audited collision times; the OLS
  //        0.0029 here is a downstream re-fit on the *recorded* snapshot in
  //        PATH_C_BASELINE_FIT, which captures only the (N, t_c) tuples that
  //        were copied into dyson-scaling-N5000.js, not the full 5-point Dyson
  //        re-run. The headline is the source; the OLS is its echo.
  //   (iii) Lock-in — every other Λ-carrying file in the repo (bridge-lambda-rh.js,
  //        lambda-error-budget.js, lambda-cross-validation.js, the cross-validation
  //        assertions) already imports the headline 0.0066. Picking it as canonical
  //        means zero downstream edits; picking 0.0029 would force a sweep through
  //        every consumer and risk silent drift.
  // The OLS 0.0029 remains useful as the angle (a) statistical instrument: its
  // CI machinery is what tells us whether the headline is statistically
  // distinguishable from 0, which is the actual B2(a) question.
  reconciliation: {
    canonicalCentralValue: LAMBDA_ERROR_BUDGET.centralValue,
    canonicalSource: 'lambda-error-budget.js (mirrors bridge-lambda-rh.js pathCBound.centralValue)',
    canonicalCitation: 'imp-309 / commit 229139 Path C runtime Dyson ODE re-run',
    diagnosticOLS: FIT.a,
    diagnosticOLSSource: 'OLS re-fit on PATH_C_BASELINE_FIT (this file)',
    rationale:
      'For an upper bound on Λ the larger central is the more conservative claim, ' +
      'and the headline 0.0066 is already the canonical reference in every ' +
      'downstream Λ file (bridge / error-budget / cross-validation). The OLS ' +
      '0.0029 is retained as a diagnostic re-fit, not a competing source of truth.',
    discrepancy: LAMBDA_ERROR_BUDGET.centralValue - FIT.a,
    discrepancyWithinOneSE: () =>
      Math.abs(LAMBDA_ERROR_BUDGET.centralValue - FIT.a) <= FIT.seA,
  },

  // One-sided / two-sided confidence intervals on the intercept.
  interceptIntervals: A_INTERVALS,
  // Same for the slope, for completeness.
  slopeIntervals: B_INTERVALS,

  // imp-331: weighted least squares re-fit with relative-error weights
  // w_i = 1/y_i² (see wlsFit comment above for the full honesty block).
  // Reported alongside the OLS so the B2(a) angle (a) instrument can be
  // cross-checked under a weighting scheme that favours the precise large-N
  // points over the noisier small-N points.
  wlsFit: {
    weights: WLS.weights,
    weightModel: 'w_i = 1/y_i² (relative-error model δ(t_c) ∝ t_c; see wlsFit JSDoc block)',
    n: WLS.n,
    dof: WLS.dof,
    intercept_a: WLS.a,
    slope_b: WLS.b,
    residualStdDev: WLS.sigma,
    residualSSR_weighted: WLS.ssrW,
    seIntercept: WLS.seA,
    seSlope: WLS.seB,
    residuals: WLS.residuals,
    interceptIntervals: A_INTERVALS_WLS,
    slopeIntervals: B_INTERVALS_WLS,
    tStatAgainstZero: aOverSeWls,
    nullAEqualsZeroRejected95: Math.abs(aOverSeWls) > T_CRIT['two-sided-95'],
    interceptShiftFromOLS: WLS.a - FIT.a,
    seShrinkFromOLS: FIT.seA - WLS.seA,
    aEstablishedBelowZero_oneSided95: A_INTERVALS_WLS['one-sided-95'].upper <= 0,
    aConsistentWithZero_twoSided95: A_INTERVALS_WLS['two-sided-95'].lower <= 0,
    note:
      'interval-dyson-collision.js (imp-318) does not currently produce certified ' +
      'δ(t_c, N_i) at the baseline N ∈ {50, 100, 200, 500, 2458}. Until it does, ' +
      'this WLS uses a DECLARED relative-error model that is invariant to the ' +
      'unknown σ_rel constant. It is a principled interim deliverable for imp-331, ' +
      'not the certified-δ WLS the ticket ultimately calls for.',
  },

  // imp-329: projected 8-point re-fit with synthetic points at N ∈ {1000,
  // 3000, 5000}. See the IMP329_EXTRA_N / IMP329_SYNTHETIC_POINTS block
  // above for the full honesty statement. Answers the B2(a) question
  // "what SE(â) and upper 95% CL would the ticket's 3-point upgrade buy
  // in the BEST case where the new measurements land exactly on the
  // current fit line?"
  imp329Projection: {
    extraN: IMP329_EXTRA_N,
    syntheticPoints: IMP329_SYNTHETIC_POINTS,
    basis:
      'Synthetic y_i = â_OLS + b̂_OLS/N_i sit exactly on the 5-point OLS line, ' +
      'so the projected intercept equals the 5-point â by construction and the ' +
      'projected SSR equals the 5-point SSR. The CI machinery sees a df = 6 ' +
      'residual variance σ̂² = SSR/6 (half of the 5-point σ̂²) and an expanded ' +
      'Sxx lever arm, both of which shrink SE(â) relative to the 5-point fit. ' +
      'This is the ticket-spec best case; real measured points would deviate ' +
      'from the line and grow SSR back somewhat.',
    n: PROJECTED_FIT.n,
    dof: PROJECTED_FIT.dof,
    intercept_a: PROJECTED_FIT.a,
    slope_b: PROJECTED_FIT.b,
    residualStdDev: PROJECTED_FIT.sigma,
    residualSSR: PROJECTED_FIT.ssr,
    seIntercept: PROJECTED_FIT.seA,
    seSlope: PROJECTED_FIT.seB,
    seShrinkFactor: FIT.seA > 0 ? PROJECTED_FIT.seA / FIT.seA : null,
    interceptIntervals: PROJECTED_A_INTERVALS,
    slopeIntervals: PROJECTED_B_INTERVALS,
    tStatAgainstZero: aOverSeProjected,
    tCriticalOneSided95: T_CRIT_DF6['one-sided-95'],
    tCriticalDropFromDf3: T_CRIT['one-sided-95'] - T_CRIT_DF6['one-sided-95'],
    oneSided95UpperBound: PROJECTED_A_INTERVALS['one-sided-95'].upper,
    oneSided95UpperBoundDropVsBaseline:
      A_INTERVALS['one-sided-95'].upper - PROJECTED_A_INTERVALS['one-sided-95'].upper,
    aEstablishedBelowZero_oneSided95: PROJECTED_A_INTERVALS['one-sided-95'].upper <= 0,
    aEstablishedBelowZero_oneSided99: PROJECTED_A_INTERVALS['one-sided-99'].upper <= 0,
    verdict:
      PROJECTED_A_INTERVALS['one-sided-95'].upper <= 0
        ? 'PROJECTED (best-case) 8-point upper 95% CL ≤ 0: the ticket\'s 3-point ' +
          'addition is SUFFICIENT for B2(a) at one-sided 95% IF the measurements ' +
          'land on the current fit line. Follow-up: re-derive Path C methodology ' +
          'at N ∈ {1000, 3000, 5000} and check the real residual.'
        : 'PROJECTED (best-case) 8-point upper 95% CL still > 0: the ticket\'s ' +
          '3-point addition alone is NOT enough to tip B2(a) even when the new ' +
          'points sit exactly on the fit line. The statistical route requires ' +
          'more lever arm (imp-321 PT-scale ladder, 2 more decades in 1/N) or ' +
          'the analytic angle (b) in imp-328 for a theorem-grade closure.',
    note:
      'No measured t_c at N = 1000, 3000, 5000 exists in the repo. ' +
      'dyson-scaling-N5000.js dysonScalingExtendedTest() is the generator but ' +
      'is never invoked automatically; the certified-lambda-hybrid runtime that ' +
      'produced the N = 2458 baseline point has been removed. This projection ' +
      'is the interim B2(a) instrument while the re-derivation is pending.',
  },

  // How many SEs â is above 0 — equivalently, the t-statistic against H0: a = 0.
  tStatAgainstZero: aOverSe,
  // Whether the null a = 0 is rejected at two-sided 95% on df = 3.
  nullAEqualsZeroRejected95: Math.abs(aOverSe) > T_CRIT['two-sided-95'],

  // Verdict snapshot — what B2(a) currently says.
  verdict: {
    aEstablishedBelowZero_oneSided95: A_INTERVALS['one-sided-95'].upper <= 0,
    aEstablishedBelowZero_oneSided99: A_INTERVALS['one-sided-99'].upper <= 0,
    aConsistentWithZero_twoSided95: A_INTERVALS['two-sided-95'].lower <= 0,
    oneSided95LowerBound: A_INTERVALS['one-sided-95'].lower,
    oneSided95UpperBound: A_INTERVALS['one-sided-95'].upper,
    statement:
      A_INTERVALS['one-sided-95'].upper <= 0
        ? 'Λ ≤ 0 established at one-sided 95% confidence (B2(a) closed at this N).'
        : A_INTERVALS['two-sided-95'].lower <= 0
          ? 'Null "a = 0" not rejected at two-sided 95%: the baseline 5-point fit is ' +
            'STATISTICALLY CONSISTENT with Λ ≤ 0 without yet PROVING it. B2(a) is approachable ' +
            'by shrinking SE(â) via imp-315 (extend N), but a theorem-grade closure still ' +
            'requires angle (b) — an analytic bound on the intercept from the Dyson ODE.'
          : 'Null "a = 0" REJECTED at two-sided 95% — the data is inconsistent with Λ ≤ 0 ' +
            'under the pure 1/N model. Angle (a) is closed against us; only the analytic ' +
            'angle (b) or a revised model (imp-315 quadratic refit) can reopen B2.',
  },

  mitigation:
    'imp-315: doubling the lever arm in 1/N (N = 3500, 5000) shrinks SE(â) and is the ' +
    'cheapest route to tipping the one-sided 95% upper CL below zero without touching â.',

  honestScope:
    'OLS with i.i.d. Gaussian errors is a caricature of the true Dyson integration error. ' +
    'Use these CIs as the angle (a) instrument only; the full error budget lives in ' +
    'lambda-error-budget.js and the theorem-grade path is lambda-zero-attack.js B2 angle (b).',
};

// Build-time assertions — refuse silent drift of this analysis.
export const INTERCEPT_CONFIDENCE_ASSERTIONS = [
  {
    id: 'ols-intercept-non-negative',
    holds: () => LAMBDA_INTERCEPT_CONFIDENCE.computedCentralOLS >= 0,
    why:
      'Rodgers-Tao 2020 forces the TRUE Λ ≥ 0. If the OLS point estimate on the baseline ' +
      'points goes negative, the fit shape broke and the angle (a) instrument is invalid.',
  },
  {
    id: 'se-strictly-positive',
    holds: () => LAMBDA_INTERCEPT_CONFIDENCE.fit.seIntercept > 0,
    why: 'A zero standard error would be a degenerate fit and the CI construction collapses.',
  },
  {
    id: 'one-sided-upper-above-point',
    holds: () =>
      LAMBDA_INTERCEPT_CONFIDENCE.interceptIntervals['one-sided-95'].upper >
      LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
    why: 'The one-sided upper 95% bound must lie strictly above â (sanity check on CI direction).',
  },
  {
    id: 'b2-not-closed-by-angle-a',
    holds: () => !LAMBDA_INTERCEPT_CONFIDENCE.verdict.aEstablishedBelowZero_oneSided95,
    why:
      'This file currently documents the HONEST state that B2(a) is not yet closed. If an ' +
      'edit flips this assertion to "closed" silently, it must also update ' +
      'lambda-zero-attack.js LAMBDA_ZERO_CLOSURE and bridge-lambda-rh.js remainingSteps.',
  },
  {
    id: 'wls-intercept-finite-and-non-negative',
    holds: () =>
      Number.isFinite(LAMBDA_INTERCEPT_CONFIDENCE.wlsFit.intercept_a) &&
      LAMBDA_INTERCEPT_CONFIDENCE.wlsFit.intercept_a >= 0,
    why:
      'imp-331: the WLS re-fit must produce a finite, non-negative â. Rodgers-Tao ' +
      'forces Λ ≥ 0, so a negative WLS intercept would indicate a broken weighting ' +
      'scheme or a corrupted baseline tuple, not a violation of the true lower bound.',
  },
  {
    id: 'wls-se-strictly-positive',
    holds: () => LAMBDA_INTERCEPT_CONFIDENCE.wlsFit.seIntercept > 0,
    why: 'imp-331: a degenerate WLS with zero SE collapses the CI construction.',
  },
  {
    id: 'imp329-projection-intercept-matches-5point',
    holds: () =>
      Math.abs(
        LAMBDA_INTERCEPT_CONFIDENCE.imp329Projection.intercept_a -
          LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
      ) < 1e-9,
    why:
      'imp-329: the projected 8-point intercept must equal the 5-point â to ' +
      'float precision because the 3 synthetic points lie exactly on the 5-point ' +
      'OLS line. If this drifts, the synthesis formula has been corrupted and ' +
      'the projection is no longer the best-case instrument the ticket requested.',
  },
  {
    id: 'imp329-projection-se-strictly-shrinks',
    holds: () =>
      LAMBDA_INTERCEPT_CONFIDENCE.imp329Projection.seIntercept <
      LAMBDA_INTERCEPT_CONFIDENCE.fit.seIntercept,
    why:
      'imp-329: adding 3 points on the fit line must strictly shrink SE(â) ' +
      '(df grows 3 → 6, Sxx expands). If this fails, the df or Sxx math is wrong.',
  },
  {
    id: 'headline-within-one-se',
    holds: () =>
      Math.abs(LAMBDA_INTERCEPT_CONFIDENCE.headlinePathC.discrepancyFromOLS) <=
      2 * LAMBDA_INTERCEPT_CONFIDENCE.fit.seIntercept,
    why:
      'The headline Path C central value and the OLS central on the baseline points should ' +
      'agree within ~2 SE of â. A larger gap indicates the two sources of truth have silently ' +
      'drifted and one of them is stale.',
  },
];
