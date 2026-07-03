/**
 * @module imp-3916-proxy-accuracy-structural-correlation
 * @fileoverview imp-3916 (accuracy, MEASUREMENT-ONLY): correlate the imp-3894
 * proxyAccuracyFactor (0.798-1.602, the factor that ALONE sets
 * sign(predictionRatio-1) on every imp-3725 plateau) with candidate per-plateau
 * STRUCTURAL features, to identify WHICH structural quantity predicts whether the
 * (H/Dmin)^2 proxy over- or under-estimates the exact left-endpoint elasticity
 * E(0.99). Everything derives LIVE from imp-3894 and imp-3870 rows -- no new
 * baked data, no offline scan.
 *
 * BACKGROUND
 * ----------
 * imp-3894 decomposed the imp-3854 predictionRatio = concavityFactor x
 * proxyAccuracyFactor, with concavityFactor a UNIFORM ~1% one-sided slack and
 * proxyAccuracyFactor = E(0.99)/kElasticityPerUnit straddling 1 (0.798-1.602) and
 * carrying the residual sign on all 10 plateaus. imp-3894 did NOT explain the
 * proxy per-plateau DIRECTION (why the (H/Dmin)^2 proxy tilts up vs down). This
 * module MEASURES that direction against structural features.
 *
 * CANDIDATE FEATURES TESTED (imp-3916 ticket)
 * -------------------------------------------
 *  (a) Dmin/smin ratio (nearest cumulative distance / smallest individual gap),
 *      the imp-3870 slack quantity -- LIVE from imp-3870.
 *  (b) dominant-term path length m_j. NOT a free variable: imp-3870 corrected
 *      picture established that the dominant (nearest-cumulative-distance) term is
 *      the adjacent-pair term whose path is the SINGLE adjacent gap, so its
 *      path-local length m_j = 1 on EVERY plateau. A constant cannot predict the
 *      varying sign, so it is excluded structurally (not by a degenerate fit).
 *  (c) second-nearest D_{a+-2}/Dmin gap. NOT available in any baked row; measuring
 *      it needs a fresh offline scan over the frozen distances. Left as the named
 *      sub-gap imp-3916-sub-second-nearest-gap (see below).
 *
 * Because (b) is constant and (c) is unbaked, this module tests (a) alongside the
 * other structural quantities that ARE baked -- Dmin, smin, H, the near-degeneracy
 * ratios Dmin/H and (H/Dmin)^2, and the imp-3870 tail-gap location distFromPair --
 * so the search is not restricted to the two testable ticket nominees.
 *
 * FINDING (Pearson + Spearman over the 10 plateaus)
 * -------------------------------------------------
 *  * The strongest structural predictor of proxyAccuracyFactor is the ABSOLUTE
 *    Dmin (nearest cumulative frozen distance): Pearson ~0.67, Spearman ~0.73.
 *    Larger Dmin => larger proxyAccuracyFactor => the (H/Dmin)^2 proxy tends to
 *    UNDER-estimate the exact elasticity (proxyAccuracyFactor > 1); smaller Dmin
 *    => the proxy over-estimates (proxyAccuracyFactor < 1).
 *  * ALL THREE ticket nominees FAIL to be the driver: the Dmin/smin ratio is only
 *    weakly correlated (Pearson ~0.18, Spearman ~0.27), confirming imp-3870 that
 *    the smin/Dmin slack does not track the residual; the dominant-term path
 *    length m_j = 1 is constant; the second-nearest gap is unbaked.
 *  * The near-degeneracy small parameter (H/Dmin)^2 itself is weakly NEGATIVELY
 *    correlated (Pearson ~-0.29), so the proxy MAGNITUDE does not set its own
 *    accuracy; the absolute nearest-distance Dmin does.
 *
 * PLAUSIBLE MECHANISM (association + reading, not a derived law)
 * -------------------------------------------------------------
 * The (H/Dmin)^2 proxy retains only the nearest (dominant) term of the exact
 * elasticity sum E(0.99) = (1/(1-theta)+1/theta) (T/(8 thetaBar)) 32 H^2 sum_j
 * P_j/D_j^3. A larger Dmin weakens the dominant term relative to the subdominant
 * tail, so the single-term proxy captures a smaller share of the exact elasticity
 * and under-estimates it; a smaller Dmin lets the nearest term dominate and the
 * proxy over-counts. Consistent with the sign of the Dmin correlation, but this is
 * a measured association on n = 10, marginal significance -- NOT a proof.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT of an existing decomposition; identifies the best AVAILABLE
 *    structural predictor and refutes the three ticket nominees as the driver.
 *  - n = 10 plateaus: the Dmin correlation is suggestive (Pearson 0.67, roughly
 *    p ~ 0.03), NOT conclusive. Named sub-gap imp-3916-sub-second-nearest-gap
 *    remains OPEN: measuring the second-nearest D_{a+-2}/Dmin gap (an offline
 *    frozen-distance scan) to test whether it sharpens the Dmin association.
 *  - No positivity claim; imp-3066 K_a >= 0 UNTOUCHED; Platt-Trudgian Lambda <= 0.2
 *    REMAINS SOTA; touches no imp-3854 INEQUALITY; NO QED.
 *
 * @see imp-3894-endpoint-concavity-slack-measurement.js (proxyAccuracyFactor source)
 * @see imp-3870-smin-dmin-slack-measurement.js (Dmin, smin, distFromPair source)
 * @see imp-3854-thetabar-insensitivity-derivation.js (predictionRatio, kElasticityPerUnit)
 */

import { IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT } from './imp-3894-endpoint-concavity-slack-measurement.js';
import { IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT } from './imp-3870-smin-dmin-slack-measurement.js';

const SRC94 = IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT.rows; // proxyAccuracyFactor, H, predictionRatio
const SRC70 = IMP_3870_SMIN_DMIN_SLACK_MEASUREMENT.rows;          // Dmin, smin, sminOverDmin, distFromPair

// Per-plateau structural feature table. All fields LIVE from imp-3894 / imp-3870.
const ROWS = SRC94.map((r94, i) => {
  const r70 = SRC70[i];
  return Object.freeze({
    plateauIndex: r94.plateauIndex,
    startN: r94.startN,
    endN: r94.endN,
    H: r94.H,
    Dmin: r70.Dmin,
    smin: r70.smin,
    DminOverSmin: r70.Dmin / r70.smin,      // ticket nominee (a): inverse imp-3870 slack
    sminOverDmin: r70.sminOverDmin,
    hOverDminSq: (r94.H / r70.Dmin) ** 2,   // the proxy magnitude itself
    DminOverH: r70.Dmin / r94.H,
    absDistFromPair: Math.abs(r70.distFromPair), // imp-3870 tail-gap location
    proxyAccuracyFactor: r94.proxyAccuracyFactor,
    predictionRatio: r94.predictionRatio,
  });
});

// -- Correlation helpers (Pearson + Spearman) --------------------------------
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
function pearson(xs, ys) {
  const n = xs.length;
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
  }
  return sxy / Math.sqrt(sxx * syy);
}
function ranks(a) {
  const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
  const r = new Array(a.length);
  idx.forEach((p, k) => { r[p[1]] = k + 1; });
  return r;
}
const spearman = (xs, ys) => pearson(ranks(xs), ranks(ys));

const TARGET = ROWS.map((r) => r.proxyAccuracyFactor);

// Structural features to correlate against proxyAccuracyFactor. m_j is omitted:
// it is constant (= 1) on every plateau (imp-3870 corrected picture), so it has
// zero variance and no defined correlation; it is recorded in EXCLUDED below.
const FEATURE_KEYS = ['Dmin', 'smin', 'DminOverSmin', 'sminOverDmin', 'hOverDminSq', 'DminOverH', 'absDistFromPair'];

const CORRELATIONS = Object.freeze(
  FEATURE_KEYS.map((key) => {
    const xs = ROWS.map((r) => r[key]);
    return Object.freeze({ feature: key, pearson: pearson(xs, TARGET), spearman: spearman(xs, TARGET) });
  }),
);

// Rank features by absolute Pearson correlation; the top one is the predictor.
const BY_ABS_PEARSON = [...CORRELATIONS].sort((a, b) => Math.abs(b.pearson) - Math.abs(a.pearson));
const BEST = BY_ABS_PEARSON[0];
const DMIN_OVER_SMIN_CORR = CORRELATIONS.find((c) => c.feature === 'DminOverSmin');

// Provenance cross-check: proxyAccuracyFactor tracks predictionRatio by construction
// (it carries the sign), so its self-correlation with predictionRatio is high.
const PREDICTION_RATIO_CORR = Object.freeze({
  pearson: pearson(ROWS.map((r) => r.predictionRatio), TARGET),
  spearman: spearman(ROWS.map((r) => r.predictionRatio), TARGET),
});

export const IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION = Object.freeze({
  id: 'imp-3916',
  title:
    'Structural correlation of the imp-3894 proxyAccuracyFactor: the ABSOLUTE ' +
    'Dmin (nearest cumulative frozen distance) is the best available predictor ' +
    '(Pearson ~0.67, Spearman ~0.73), while all three ticket nominees fail -- ' +
    'Dmin/smin is weak (~0.18), the dominant-term path length m_j = 1 is ' +
    'constant, and the second-nearest gap is unbaked',
  status: 'measurement-only',
  rhFree: true,
  semantics: 'correlation study over an existing residual; no new bound',

  plateauCount: ROWS.length,
  rows: ROWS,
  correlations: CORRELATIONS,
  bestPredictor: BEST,
  predictionRatioSelfCorrelation: PREDICTION_RATIO_CORR,

  excludedNominees: Object.freeze({
    dominantTermPathLength:
      'm_j = 1 on every plateau: the dominant (nearest-cumulative-distance) term ' +
      'is the adjacent-pair term whose path is the single adjacent gap (imp-3870 ' +
      'corrected picture). Constant => zero variance => cannot predict the sign.',
    secondNearestGap:
      'D_{a+-2}/Dmin is not present in any baked imp-3725/imp-3854/imp-3870 row; ' +
      'measuring it requires a fresh offline frozen-distance scan. Left OPEN as ' +
      'sub-gap imp-3916-sub-second-nearest-gap.',
  }),

  headline: {
    bestPredictorFeature: BEST.feature,           // 'Dmin'
    bestPredictorPearson: BEST.pearson,           // ~0.67
    bestPredictorSpearman: BEST.spearman,         // ~0.73
    dminOverSminPearson: DMIN_OVER_SMIN_CORR.pearson, // ~0.18 (ticket nominee, weak)
    finding:
      'Across the 10 imp-3725 plateaus the (H/Dmin)^2 proxy over- vs under- ' +
      'estimate of the exact left-endpoint elasticity is best predicted by the ' +
      'ABSOLUTE Dmin (nearest cumulative frozen distance): Pearson ~0.67, ' +
      'Spearman ~0.73. Larger Dmin => proxyAccuracyFactor > 1 (proxy under- ' +
      'estimates); smaller Dmin => proxyAccuracyFactor < 1 (proxy over-estimates). ' +
      'The three ticket nominees are NOT the driver: the Dmin/smin ratio is weak ' +
      '(Pearson ~0.18, Spearman ~0.27, confirming imp-3870), the dominant-term ' +
      'path length m_j = 1 is constant, and the second-nearest D_{a+-2}/Dmin gap ' +
      'is unbaked (open sub-gap). The proxy magnitude (H/Dmin)^2 is itself weakly ' +
      'NEGATIVELY correlated, so absolute nearest-distance -- not the small ' +
      'parameter size -- sets the proxy accuracy. Association on n = 10, marginal ' +
      'significance; imp-3066 untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; ' +
      'NO QED.',
  },

  openSubGap:
    'imp-3916-sub-second-nearest-gap: measure the second-nearest D_{a+-2}/Dmin ' +
    'gap per plateau (offline frozen-distance scan) and test whether it sharpens ' +
    'the absolute-Dmin association identified here into a mechanistic law.',

  scope: {
    measurementOnly: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'Lambda <= 0.2 (PT 2021) remains SOTA',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) ------
const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION_ASSERTIONS = [
  {
    id: 'imp3916-derives-live-from-imp3894-and-imp3870',
    holds: () =>
      ROWS.length === 10 &&
      ROWS.every(
        (r, i) =>
          r.proxyAccuracyFactor === SRC94[i].proxyAccuracyFactor &&
          r.H === SRC94[i].H &&
          r.Dmin === SRC70[i].Dmin &&
          r.smin === SRC70[i].smin &&
          rel(r.DminOverSmin, SRC70[i].Dmin / SRC70[i].smin) < 1e-12,
      ),
    why:
      'Nothing is baked here: proxyAccuracyFactor and H come from imp-3894, and ' +
      'Dmin, smin, distFromPair come from imp-3870. Any drift signals a source change.',
  },
  {
    id: 'imp3916-dmin-is-the-best-structural-predictor',
    holds: () =>
      BEST.feature === 'Dmin' &&
      BEST.pearson > 0.6 &&
      BEST.spearman > 0.65 &&
      // Dmin is strictly the strongest by |Pearson| among tested structural features
      CORRELATIONS.every((c) => c.feature === 'Dmin' || Math.abs(c.pearson) < Math.abs(BEST.pearson)),
    why:
      'Central result: the absolute Dmin (nearest cumulative frozen distance) is ' +
      'the strongest structural predictor of proxyAccuracyFactor (Pearson ~0.67, ' +
      'Spearman ~0.73), strictly above every other baked structural feature.',
  },
  {
    id: 'imp3916-ticket-nominees-are-not-the-driver',
    holds: () =>
      // Dmin/smin ratio (nominee a) is only weakly correlated
      Math.abs(DMIN_OVER_SMIN_CORR.pearson) < 0.35 &&
      Math.abs(DMIN_OVER_SMIN_CORR.pearson) < Math.abs(BEST.pearson) &&
      // m_j constant (nominee b) and second-nearest gap unbaked (nominee c) both documented
      typeof IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION.excludedNominees.dominantTermPathLength === 'string' &&
      typeof IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION.excludedNominees.secondNearestGap === 'string' &&
      typeof IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION.openSubGap === 'string',
    why:
      'The three ticket nominees fail: Dmin/smin ratio is weakly correlated ' +
      '(|Pearson| < 0.35, confirming imp-3870 that smin/Dmin slack does not track ' +
      'the residual), the dominant-term path length m_j = 1 is constant, and the ' +
      'second-nearest gap is unbaked (open sub-gap imp-3916-sub-second-nearest-gap).',
  },
  {
    id: 'imp3916-measurement-only-no-qed',
    holds: () =>
      IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION.scope.measurementOnly === true &&
      IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION.scope.noNewLambdaBound === true &&
      IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION.scope.imp3066Untouched === true &&
      IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION.scope.noQED === true,
    why:
      'Honesty guard: a correlation study, not a bound. It must not assert a new ' +
      'Lambda bound or a QED, imp-3066 stays untouched, PT Lambda <= 0.2 stays SOTA.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3916-proxy-accuracy-structural-correlation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3916_PROXY_ACCURACY_STRUCTURAL_CORRELATION;
