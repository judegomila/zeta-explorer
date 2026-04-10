/**
 * imp-333 (BLOCKER B2 angle a): pooled Bayesian posterior on the Path C fit
 * intercept `a` from all four statistical angles seeded into this repo.
 *
 * Angles pooled:
 *   (1) imp-323 — OLS on the 5-point Path C baseline                (df = 3)
 *   (2) imp-331 — WLS with relative-error weights w_i = 1/y_i²      (df = 3)
 *   (3) imp-329 — projected 8-point OLS with synthetic points on    (df = 6)
 *                 the fit line at N ∈ {1000, 3000, 5000}
 *   (4) imp-332 — log-spaced ladder round-trip OLS                  (df = 5)
 *
 * Each angle already publishes a point estimate â_i and standard error
 * SE(â_i) in the companion files. Under a flat prior p(a, b) ∝ 1 and a
 * Gaussian likelihood for each angle,
 *
 *     p(a | angle i)  ∝  N(a | â_i, SE(â_i)²)
 *
 * and IF the angles were statistically independent the pooled posterior
 * would also be Gaussian with precision-weighted mean
 *
 *     τ_i = 1 / SE(â_i)²
 *     â_pooled   = (Σ τ_i · â_i) / (Σ τ_i)
 *     SE_pooled  = 1 / √(Σ τ_i)
 *
 * and the one-sided 95% upper credible bound would be
 *
 *     a_upper(95%) = â_pooled + z_{0.95} · SE_pooled,   z_{0.95} = 1.6449.
 *
 * HONESTY BLOCK — why the naive pool is overoptimistic:
 *
 *   • imp-323 OLS and imp-331 WLS are fit to the SAME 5 Path C points.
 *     Their likelihoods are not independent; they share every residual.
 *
 *   • imp-329 reuses those 5 points and adds 3 synthetic rows that sit
 *     exactly on the 5-point OLS line. The projection â_329 equals â_OLS
 *     by construction, and the SE shrink comes purely from df=3→6 and an
 *     expanded Sxx lever arm, not from any new information.
 *
 *   • imp-332 ladder rows are the arithmetic round-trip y = â_OLS + b̂_OLS/N
 *     of the baseline fit. LADDER_FIT recovers (â_OLS, b̂_OLS) with
 *     essentially zero residual SSR, so SE(â_ladder) ≈ 0 and naive
 *     precision weighting would let this angle completely dominate the
 *     pool with no genuine information gain.
 *
 * So we publish TWO pools:
 *
 *   (A) naivePool  — Σ τ_i Gaussian pool across angles 1–3, with the
 *       ladder DELIBERATELY EXCLUDED because its round-trip SE ≈ 0 is
 *       a fitting artefact rather than a real measurement precision.
 *       Honest label: "best-case under a false independence assumption".
 *
 *   (B) honestPool — the tightest single angle (minimum SE among the
 *       three genuinely-fit angles). Because the data overlap is total,
 *       pooling dependent likelihoods cannot legitimately do better than
 *       the single most informative re-fit.
 *
 * VERDICT is driven by honestPool. The naive pool is reported only as a
 * diagnostic ceiling on how much the statistical route could conceivably
 * gain from a future truly independent measurement.
 *
 * ticket: imp-333  |  priority: critical  |  section: S7 / B2(a)
 */

import {
  LAMBDA_INTERCEPT_CONFIDENCE,
} from './lambda-intercept-confidence.js';
import { PT_SCALE_B2A_REFIT } from './lambda-pt-scale-extrapolation.js';

// Normal (z) critical value for one-sided 95%.  We use the Gaussian limit
// here because a pooled posterior over three dependent df=3/df=6 fits has
// no clean effective-df; using z = 1.6449 is the sharper (and honest,
// clearly-labelled) asymptotic bound.  The single-angle t-based bounds
// remain in lambda-intercept-confidence.js as the rigorous values.
const Z_ONE_SIDED_95 = 1.6449;
const Z_ONE_SIDED_99 = 2.3263;
const Z_TWO_SIDED_95 = 1.9600;

// Gather the four angles in a uniform shape.
const ANGLES = [
  {
    ticket: 'imp-323',
    label: 'OLS 5-point baseline',
    a: LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
    seA: LAMBDA_INTERCEPT_CONFIDENCE.fit.seIntercept,
    dof: LAMBDA_INTERCEPT_CONFIDENCE.fit.dof,
    sharesBaseline: true,
    informativeForPool: true,
  },
  {
    ticket: 'imp-331',
    label: 'WLS with w_i = 1/y_i²',
    a: LAMBDA_INTERCEPT_CONFIDENCE.wlsFit.intercept_a,
    seA: LAMBDA_INTERCEPT_CONFIDENCE.wlsFit.seIntercept,
    dof: LAMBDA_INTERCEPT_CONFIDENCE.wlsFit.dof,
    sharesBaseline: true,
    informativeForPool: true,
  },
  {
    ticket: 'imp-329',
    label: 'projected 8-point OLS (synthetic N=1000,3000,5000 on fit line)',
    a: LAMBDA_INTERCEPT_CONFIDENCE.imp329Projection.intercept_a,
    seA: LAMBDA_INTERCEPT_CONFIDENCE.imp329Projection.seIntercept,
    dof: LAMBDA_INTERCEPT_CONFIDENCE.imp329Projection.dof,
    sharesBaseline: true,
    informativeForPool: true,
  },
  {
    ticket: 'imp-332',
    label: 'log-spaced ladder round-trip OLS',
    a: PT_SCALE_B2A_REFIT.fit.intercept_a,
    seA: PT_SCALE_B2A_REFIT.fit.seIntercept,
    dof: PT_SCALE_B2A_REFIT.fit.dof,
    sharesBaseline: true,
    // EXCLUDED from precision pooling: the ladder is the arithmetic
    // round-trip of the baseline OLS so its SE ≈ 0 and it carries no
    // independent information about the intercept.
    informativeForPool: false,
  },
];

// --- (A) naive precision-weighted Gaussian pool over informative angles ---
const POOL_INPUTS = ANGLES.filter((a) => a.informativeForPool);
const SUM_TAU = POOL_INPUTS.reduce((s, ang) => s + 1 / (ang.seA * ang.seA), 0);
const POOLED_MEAN = POOL_INPUTS.reduce(
  (s, ang) => s + ang.a / (ang.seA * ang.seA),
  0,
) / SUM_TAU;
const POOLED_SE = 1 / Math.sqrt(SUM_TAU);

function gaussianBounds(mean, se) {
  return {
    'one-sided-95': {
      upper: mean + Z_ONE_SIDED_95 * se,
      lower: mean - Z_ONE_SIDED_95 * se,
      halfWidth: Z_ONE_SIDED_95 * se,
    },
    'one-sided-99': {
      upper: mean + Z_ONE_SIDED_99 * se,
      lower: mean - Z_ONE_SIDED_99 * se,
      halfWidth: Z_ONE_SIDED_99 * se,
    },
    'two-sided-95': {
      upper: mean + Z_TWO_SIDED_95 * se,
      lower: mean - Z_TWO_SIDED_95 * se,
      halfWidth: Z_TWO_SIDED_95 * se,
    },
  };
}

const NAIVE_POOL_INTERVALS = gaussianBounds(POOLED_MEAN, POOLED_SE);

// --- (B) honest pool — tightest single informative angle ---
const TIGHTEST = POOL_INPUTS.reduce((best, ang) =>
  ang.seA < best.seA ? ang : best,
);
const HONEST_POOL_INTERVALS = gaussianBounds(TIGHTEST.a, TIGHTEST.seA);

const NAIVE_UPPER_95 = NAIVE_POOL_INTERVALS['one-sided-95'].upper;
const HONEST_UPPER_95 = HONEST_POOL_INTERVALS['one-sided-95'].upper;

export const LAMBDA_INTERCEPT_POOLED = {
  purpose:
    'imp-333: pooled posterior on the Path C fit intercept a across all four ' +
    'B2(a) statistical angles. Reports both a naive (independence-assumed) ' +
    'precision-weighted Gaussian pool and an honest (dependence-aware) pool.',
  ticket: 'imp-333',
  blockerRef: 'lambda-zero-attack.js / LAMBDA_ZERO_BLOCKERS[B2] angle (a)',

  angles: ANGLES,
  poolInputs: POOL_INPUTS.map((a) => a.ticket),
  ladderExcluded: true,
  ladderExclusionReason:
    'imp-332 ladder rows are the arithmetic round-trip y = â_OLS + b̂_OLS/N ' +
    'of the baseline OLS, so LADDER_FIT recovers (OLS_A, OLS_B) with ~zero ' +
    'residuals and SE(â_ladder) ≈ 0. Including it in precision weighting ' +
    'would let a zero-information angle dominate the pool.',

  naivePool: {
    label:
      'Precision-weighted Gaussian pool under a FALSE independence assumption ' +
      'across imp-323 / imp-331 / imp-329. Diagnostic ceiling only.',
    mean: POOLED_MEAN,
    se: POOLED_SE,
    sumPrecision: SUM_TAU,
    intervals: NAIVE_POOL_INTERVALS,
    verdict: {
      oneSided95Upper: NAIVE_UPPER_95,
      aEstablishedBelowZero_oneSided95: NAIVE_UPPER_95 <= 0,
      aEstablishedBelowZero_oneSided99:
        NAIVE_POOL_INTERVALS['one-sided-99'].upper <= 0,
    },
  },

  honestPool: {
    label:
      'Tightest single informative angle. Because all three angles fit the ' +
      'SAME 5-point Path C baseline (imp-329 only adds points on the fit line), ' +
      'the joint likelihood is collinear and honest pooling cannot legitimately ' +
      'beat the single sharpest re-fit.',
    driver: TIGHTEST.ticket,
    driverLabel: TIGHTEST.label,
    mean: TIGHTEST.a,
    se: TIGHTEST.seA,
    intervals: HONEST_POOL_INTERVALS,
    verdict: {
      oneSided95Upper: HONEST_UPPER_95,
      aEstablishedBelowZero_oneSided95: HONEST_UPPER_95 <= 0,
      aEstablishedBelowZero_oneSided99:
        HONEST_POOL_INTERVALS['one-sided-99'].upper <= 0,
    },
  },

  verdict: {
    driver: 'honestPool',
    oneSided95Upper: HONEST_UPPER_95,
    aEstablishedBelowZero_oneSided95: HONEST_UPPER_95 <= 0,
    statement:
      HONEST_UPPER_95 <= 0
        ? 'imp-333: pooled honest one-sided 95% upper credible bound on a is ≤ 0. ' +
          'B2(a) CLOSED across all four statistical angles simultaneously — ' +
          'Λ ≤ 0 at one-sided 95% at the controlled height. Update ' +
          'lambda-zero-attack.js LAMBDA_ZERO_CLOSURE accordingly.'
        : 'imp-333: pooled honest one-sided 95% upper credible bound on a is > 0. ' +
          'Pooling four statistical angles that all sit on the same 5-point ' +
          'Path C baseline does NOT tip B2(a). The purely-statistical route is ' +
          'exhausted at the current N; progress requires either (i) a genuinely ' +
          'independent dataset (measured Dyson collision times at new N, per ' +
          'imp-315 / imp-321) or (ii) the analytic angle imp-328.',
  },

  honestScope:
    'Gaussian pool + flat prior + perfect-independence is a best-case instrument, ' +
    'not a theorem. For a theorem-grade closure of B2(a) the honest path is ' +
    'either a new independent measurement that genuinely adds precision to â, ' +
    'or the analytic intercept bound from imp-328 (angle b).',
};

export const LAMBDA_INTERCEPT_POOLED_ASSERTIONS = [
  {
    id: 'imp333-naive-pool-tighter-than-any-single-angle',
    holds: () =>
      LAMBDA_INTERCEPT_POOLED.naivePool.se <
      Math.min(...POOL_INPUTS.map((a) => a.seA)),
    why:
      'imp-333: a precision-weighted pool under independence MUST produce an SE ' +
      'strictly smaller than the tightest input SE. If this fails, the pooling ' +
      'math is broken.',
  },
  {
    id: 'imp333-honest-pool-matches-tightest-single-angle',
    holds: () => {
      const tightestSe = Math.min(...POOL_INPUTS.map((a) => a.seA));
      return Math.abs(LAMBDA_INTERCEPT_POOLED.honestPool.se - tightestSe) < 1e-12;
    },
    why:
      'imp-333: the honest (dependence-aware) pool is defined as the tightest ' +
      'single informative angle. A drift here means the angle-selection logic ' +
      'has been corrupted.',
  },
  {
    id: 'imp333-ladder-excluded-from-pool',
    holds: () =>
      LAMBDA_INTERCEPT_POOLED.angles.find((a) => a.ticket === 'imp-332')
        .informativeForPool === false,
    why:
      'imp-333: the imp-332 ladder is a round-trip of the baseline OLS and ' +
      'carries no independent intercept information. It must remain excluded ' +
      'from precision pooling or the naive pool collapses onto it.',
  },
  {
    id: 'imp333-pool-mean-finite-and-non-negative',
    holds: () =>
      Number.isFinite(LAMBDA_INTERCEPT_POOLED.naivePool.mean) &&
      LAMBDA_INTERCEPT_POOLED.naivePool.mean >= 0,
    why:
      'imp-333: Rodgers-Tao forces the true Λ ≥ 0. A negative pooled central ' +
      'estimate indicates a weighting-scheme bug, not a disproof.',
  },
  {
    id: 'imp333-b2a-not-closed-by-pooling',
    holds: () =>
      !LAMBDA_INTERCEPT_POOLED.verdict.aEstablishedBelowZero_oneSided95,
    why:
      'imp-333 currently documents the HONEST state that pooling all four ' +
      'statistical angles does NOT close B2(a) — all four sit on the same ' +
      '5-point Path C baseline, so the honest pool reduces to the single ' +
      'tightest fit. If a future edit flips this to "closed", it MUST also ' +
      'update lambda-zero-attack.js LAMBDA_ZERO_CLOSURE, bridge-lambda-rh.js ' +
      'remainingSteps, and the verdict in lambda-intercept-confidence.js.',
  },
];
