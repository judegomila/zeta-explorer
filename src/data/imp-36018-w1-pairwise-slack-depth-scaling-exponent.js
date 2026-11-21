/**
 * @module imp-36018-w1-pairwise-slack-depth-scaling-exponent
 *
 * imp-36018 (numerical, S-frontier): FIT the imp-35970 a-priori-vs-measured slack RATIO
 * (the gamma_{d_max} depth bound over-prediction of the measured pairwise error) against
 * pairing-tree DEPTH d across the seven imp-35893 SHAPES and extract the depth-scaling
 * exponent, TESTING whether the slack grows strictly linearly in d as imp-35970 asserted.
 *
 * imp-35970 tabulated the depth-proportional a-priori pairwise forward-error bound
 * (Higham gamma_{d_max}, coarse form d*eps) over-predicting the measured normalized error
 * by ~3.7 orders (balanced, d=12) to ~6.8 orders (caterpillarL, d=3817), and argued the
 * slack "WIDENS with depth ... linearly in d" on the ground that the measured error is a
 * depth-INDEPENDENT floor (imp-35952) while the bound grows linearly in d. Under that
 * mechanism slack = d*eps / floor is EXACTLY proportional to d, i.e. a power-law
 * log10(slack) = 1 * log10(d) + const with depth-scaling EXPONENT = 1. imp-35970 never fit
 * the slack-vs-depth relation, so the "linearly in d" assertion was never quantitatively
 * tested. This module supplies that fit.
 *
 * METHOD (measurement only): import the live imp-35970 slack table (no re-run of the
 * length-N = 488602 sum; the seven shapes, tree depths d and per-shape slackDepthEps =
 * (d*eps)/measured are read verbatim), take base-10 logs and run ordinary least squares of
 * log10(slackDepthEps) on log10(treeDepth). The fitted SLOPE is the depth-scaling EXPONENT
 * (slack ~ d^exponent); exponent = 1 would confirm the claimed strict linear-in-d growth.
 * We also record the coefficient of determination R^2 and, as a robustness diagnostic, the
 * same fit with the same-depth outlier caterpillarR removed (see FINDING).
 *
 * FINDING: the claimed STRICT linear-in-d growth is NOT confirmed by the fit. Over all
 * seven shapes the OLS depth-scaling exponent is ~0.748 (SUB-linear, well below 1) with a
 * modest R^2 ~ 0.658 -- the slack does widen with depth (positive exponent, and the deepest
 * tree caterpillarL is the loosest, ~5.9e6x) so imp-35970 is QUALITATIVELY right, but the
 * growth is sub-linear and noisy, not the strict slack ~ d^1 the depth-independent-floor
 * mechanism predicts. The sub-linearity is a SHAPE-FLOOR artifact: the measured error is NOT
 * a strict depth-independent floor -- it spans ~98x across the seven shapes, and crucially
 * the two caterpillars share the SAME depth d = 3817 yet their slacks differ ~12.9x
 * (caterpillarL ~5.9e6x vs caterpillarR ~4.6e5x) because caterpillarR carries an
 * anomalously HIGH measured floor (~1.85e-18, the family max), which pulls the slack DOWN at
 * the largest depth and flattens the trend. Removing that single same-depth high-floor
 * point lifts the exponent to ~0.936 with R^2 ~ 0.773 -- close to the linear-in-d value 1,
 * confirming the mechanism is APPROXIMATELY linear once the shape-floor scatter is removed.
 * CONCLUSION: imp-35970 "slack widens linearly in d" should read "widens SUB-linearly
 * (fitted depth exponent ~0.75, R^2 ~0.66; ~0.94 excluding the same-depth caterpillarR
 * outlier)"; the depth-independent-floor idealization over-states the exponent because the
 * per-shape measured floor is not constant. Precision stays NON-binding either way; the W1
 * obstruction remains the MECHANICAL certified length-N interval sum (imp-35725).
 *
 * HONEST CAVEATS: only seven data points (two sharing depth 3817), so the fit is
 * small-sample and the exponent is sensitive to the single caterpillarR outlier (0.75 -> 0.94
 * on its removal); the exponent is a descriptive log-log slope, not a certified growth law.
 *
 * MEASUREMENT / REGRESSION reusing the imp-35970 slack literals. Certifies no W1 bound;
 * evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound;
 * establishes no positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack (source: per-shape slack vs depth)
 * @see imp-35893-w1-summation-pairwise-tree-shape (the tree-SHAPE sweep + measured errors)
 * @see imp-35952-w1-caterpillar-worst-tree-n-ladder (measured error is an N-independent FLOOR at fixed shape)
 * @see imp-35974 (the complementary ceiling-ratio-vs-N axis; this is the depth axis at fixed N)
 */

import { IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK } from './imp-35970-w1-pairwise-apriori-depth-bound-slack.js';

const SOURCE = IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK;
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this regression

// Ordinary least squares of y on x; returns slope, intercept and R^2 (coefficient of determination).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2, n };
}

// Per-shape (depth, slack) pairs read verbatim from the imp-35970 live table.
const POINTS = SOURCE.shapes.map((s) => ({
  shape: s.shape,
  treeDepth: s.treeDepth,
  slackDepthEps: s.slackDepthEps,
  measuredNormErr: s.measuredNormErr,
  logDepth: Math.log10(s.treeDepth),
  logSlack: Math.log10(s.slackDepthEps),
}));

// (1) Full seven-point power-law fit: log10(slack) ~ exponent * log10(d) + c.
const FULL_FIT = ols(POINTS.map((p) => p.logDepth), POINTS.map((p) => p.logSlack));

// (2) Robustness fit excluding the same-depth high-floor outlier caterpillarR.
const POINTS_NO_R = POINTS.filter((p) => p.shape !== 'caterpillarR');
const NO_R_FIT = ols(POINTS_NO_R.map((p) => p.logDepth), POINTS_NO_R.map((p) => p.logSlack));

// Shape-floor spread: the measured error is NOT a strict depth-independent floor.
const measuredErrs = POINTS.map((p) => p.measuredNormErr);
const FLOOR_SPREAD = Math.max(...measuredErrs) / Math.min(...measuredErrs);

// The two caterpillars share depth 3817 yet differ in slack -- the direct evidence the
// slack is not a pure function of d (a strict d^1 law would force equal slack here).
const CAT_L = POINTS.find((p) => p.shape === 'caterpillarL');
const CAT_R = POINTS.find((p) => p.shape === 'caterpillarR');
const SAME_DEPTH_SLACK_RATIO = CAT_L.slackDepthEps / CAT_R.slackDepthEps;

// Is the strict linear-in-d claim (exponent == 1) supported? Require the fitted exponent
// to sit within a modest tolerance of 1 AND a strong fit; neither holds for the full set.
const LINEAR_TOL = 0.15;
const STRICT_LINEAR_CONFIRMED = Math.abs(FULL_FIT.slope - 1) <= LINEAR_TOL && FULL_FIT.r2 >= 0.9;

export const IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT = {
  id: 'imp-36018',
  proofSection: 'S-frontier',
  question:
    'Fitting the imp-35970 a-priori-vs-measured slack ratio (gamma_{d_max} over-prediction) against pairing-tree ' +
    'DEPTH d across the seven imp-35893 shapes, what is the depth-scaling exponent (slack ~ d^exponent) and does ' +
    'the slack grow STRICTLY linearly in d (exponent = 1) as imp-35970 asserted? Measurement only; NO QED.',
  method: {
    axis: 'tree DEPTH d (12..3817) at FIXED problem size N ~ 488602 (distinct from the imp-35974 ceiling-ratio-vs-N axis)',
    regression: 'ordinary least squares of log10(slackDepthEps) on log10(treeDepth); slope = depth-scaling exponent',
    slackDefinition: 'slackDepthEps = (d * eps) / measuredNormErr, read verbatim from imp-35970 (eps = 2^-52)',
    linearInDPrediction:
      'the imp-35970 depth-independent-floor mechanism (slack = d*eps / const) predicts a STRICT power law ' +
      'slack ~ d^1, i.e. a fitted depth-scaling exponent of exactly 1',
    dataPoints: POINTS.length,
    note: 'seven shapes; caterpillarL and caterpillarR share depth 3817, so only six distinct depths',
  },
  points: POINTS.map((p) => ({
    shape: p.shape,
    treeDepth: p.treeDepth,
    slackDepthEps: p.slackDepthEps,
    measuredNormErr: p.measuredNormErr,
  })),
  fit: {
    full: {
      exponent: FULL_FIT.slope,
      intercept: FULL_FIT.intercept,
      r2: FULL_FIT.r2,
      n: FULL_FIT.n,
    },
    excludingSameDepthCaterpillarR: {
      exponent: NO_R_FIT.slope,
      intercept: NO_R_FIT.intercept,
      r2: NO_R_FIT.r2,
      n: NO_R_FIT.n,
    },
  },
  diagnostics: {
    floorSpreadFactor: FLOOR_SPREAD, // ~98x: measured error is NOT a strict depth-independent floor
    sameDepthCaterpillarSlackRatio: SAME_DEPTH_SLACK_RATIO, // ~12.9x at the identical depth 3817
    loosestShape: POINTS.reduce((a, b) => (b.slackDepthEps > a.slackDepthEps ? b : a)).shape,
    worstFloorShape: POINTS.reduce((a, b) => (b.measuredNormErr > a.measuredNormErr ? b : a)).shape,
  },
  test: {
    strictLinearInDPredictedExponent: 1,
    fittedExponentFull: FULL_FIT.slope,
    strictLinearConfirmed: STRICT_LINEAR_CONFIRMED,
    verdict:
      'the STRICT linear-in-d growth imp-35970 asserted is NOT confirmed: the full-set depth-scaling exponent ' +
      'is ~0.75 (SUB-linear, below 1) with a modest R^2 ~0.66; excluding the same-depth high-floor caterpillarR ' +
      'lifts it to ~0.94 (R^2 ~0.77), so the mechanism is APPROXIMATELY linear once the shape-floor scatter is removed',
  },
  reading: {
    qualitativeWideningHolds:
      'the slack does widen with depth -- the fitted exponent is positive and the deepest tree caterpillarL is ' +
      'the loosest (~5.9e6x) -- so the imp-35970 qualitative "widens with depth" is correct',
    subLinearNotStrictLinear:
      'but the fitted depth-scaling exponent is ~0.75 (R^2 ~0.66), SUB-linear, not the strict slack ~ d^1 the ' +
      'depth-independent-floor mechanism predicts; imp-35970 "linearly in d" over-states the exponent',
    shapeFloorArtifact:
      'the sub-linearity is a shape-floor artifact: the measured error spans ~98x across the seven shapes (not a ' +
      'strict depth-independent floor), and the two caterpillars at the SAME depth 3817 differ ~12.9x in slack ' +
      'because caterpillarR carries the family-max measured floor, flattening the trend at the largest depth',
    mechanismRecoveredOnOutlierRemoval:
      'removing that single same-depth high-floor point lifts the exponent to ~0.94 (R^2 ~0.77), confirming the ' +
      'underlying slack = d*eps/floor mechanism is close to linear-in-d once the non-constant floor is controlled for',
  },
  conclusion: {
    claimRefinedToSubLinear:
      'the imp-35970 "slack widens linearly in d" is refined to "widens SUB-linearly (fitted depth exponent ~0.75, ' +
      'R^2 ~0.66; ~0.94 excluding the same-depth caterpillarR outlier)": the depth-independent-floor idealization ' +
      'over-states the exponent because the per-shape measured floor is not constant',
    precisionNotBinding:
      'whether the exponent is 0.75 or 0.94, the a-priori depth bound over-predicts the measured error by 4-7 ' +
      'orders on every shape (imp-35970); double precision leaves overwhelming strict headroom, precision is NOT binding',
    staysGreenfield:
      'this module fits published slack literals only; it evaluates no sum of H_t and verifies no inequality, so ' +
      'the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (depth-scaling-exponent regression, NOT a certified growth law). Running OLS of log10(slack) on ' +
    'log10(tree depth d) over the seven imp-35893 shapes (d = 12..3817 at fixed N ~ 488602) gives a fitted ' +
    'depth-scaling exponent of ~0.748 with R^2 ~0.658 -- SUB-linear, so the STRICT linear-in-d growth (exponent = 1) ' +
    'imp-35970 asserted is NOT confirmed. The slack does widen with depth (positive exponent; deepest tree ' +
    'caterpillarL is the loosest ~5.9e6x), so the qualitative claim holds, but the strict slack ~ d^1 the ' +
    'depth-independent-floor mechanism predicts does not: the measured error spans ~98x across shapes (not a strict ' +
    'floor) and the two caterpillars at the SAME depth 3817 differ ~12.9x in slack, because caterpillarR carries the ' +
    'family-max measured floor and flattens the trend at the largest depth. Removing that one same-depth outlier ' +
    'lifts the exponent to ~0.936 (R^2 ~0.773), close to linear -- so the mechanism is approximately linear-in-d ' +
    'once the non-constant floor is controlled for, and imp-35970 "linearly in d" is refined to "sub-linearly, ' +
    'exponent ~0.75". Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no ' +
    'inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35970 (source a-priori-vs-measured slack table); imp-35893 (tree-SHAPE sweep + measured errors); ' +
    'imp-35952 (measured error is an N-independent floor at fixed shape); imp-35974 (complementary ceiling-ratio ' +
    'vs N axis); imp-35761 (log2(N)*eps pairwise ceiling); Higham 2002, Sec. 4.2 (gamma_d pairwise bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT_ASSERTIONS = [
  {
    // Seven (depth, slack) points carried over from the imp-35970 live table.
    id: 'imp36018-seven-points-from-imp35970',
    description: 'Seven imp-35893 shapes, each a (tree depth, slackDepthEps) point spanning depth 12..3817',
    holds: () =>
      POINTS.length === 7 &&
      POINTS.every((p) => p.treeDepth >= 1 && p.slackDepthEps > 0) &&
      Math.min(...POINTS.map((p) => p.treeDepth)) === 12 &&
      Math.max(...POINTS.map((p) => p.treeDepth)) === 3817,
  },
  {
    // The full-set OLS depth-scaling exponent is sub-linear (~0.75), well below the strict-linear value 1.
    id: 'imp36018-fitted-exponent-sub-linear',
    description: 'The full seven-point OLS depth-scaling exponent is ~0.75 (in [0.6,0.85]), below the linear value 1',
    holds: () => FULL_FIT.slope > 0.6 && FULL_FIT.slope < 0.85 && FULL_FIT.slope < 1,
  },
  {
    // The full-set fit is only modest (R^2 ~0.66) -- the slack is not a clean function of depth.
    id: 'imp36018-modest-r2',
    description: 'The full-set fit R^2 is modest (~0.66, in [0.55,0.75]), not a clean depth power law',
    holds: () => FULL_FIT.r2 > 0.55 && FULL_FIT.r2 < 0.75,
  },
  {
    // The claimed STRICT linear-in-d growth (exponent 1, strong fit) is NOT confirmed.
    id: 'imp36018-strict-linear-not-confirmed',
    description: 'The strict linear-in-d claim (fitted exponent within 0.15 of 1 AND R^2>=0.9) is NOT confirmed',
    holds: () =>
      STRICT_LINEAR_CONFIRMED === false &&
      IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT.test.strictLinearConfirmed === false,
  },
  {
    // The sub-linearity is a shape-floor artifact: same depth 3817 gives ~12.9x different slack,
    // and the measured floor spans ~98x -- so slack is not a pure function of d.
    id: 'imp36018-shape-floor-not-pure-depth',
    description: 'Same-depth caterpillars differ ~12.9x in slack and the measured floor spans ~98x: slack is not pure-d',
    holds: () =>
      CAT_L.treeDepth === CAT_R.treeDepth &&
      SAME_DEPTH_SLACK_RATIO > 5 &&
      FLOOR_SPREAD > 50,
  },
  {
    // Removing the same-depth high-floor caterpillarR lifts the exponent toward linear (~0.94, R^2 ~0.77):
    // the mechanism is approximately linear-in-d once the non-constant floor is controlled for.
    id: 'imp36018-exponent-recovers-on-outlier-removal',
    description: 'Excluding the same-depth caterpillarR outlier lifts the exponent to ~0.94 (>full) with higher R^2',
    holds: () =>
      NO_R_FIT.n === 6 &&
      NO_R_FIT.slope > FULL_FIT.slope &&
      NO_R_FIT.slope > 0.85 &&
      NO_R_FIT.slope < 1.05 &&
      NO_R_FIT.r2 > FULL_FIT.r2,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36018-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /SUB-linear/.test(IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT.conclusion.claimRefinedToSubLinear) &&
      /GREENFIELD/.test(IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT.verdict),
  },
];

for (const a of IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36018-w1-pairwise-slack-depth-scaling-exponent assertion failed: ${a.id}`);
  }
}

export default IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT;
