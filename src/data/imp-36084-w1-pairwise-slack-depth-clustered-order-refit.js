/**
 * @module imp-36084-w1-pairwise-slack-depth-clustered-order-refit
 *
 * imp-36084 (numerical, S-frontier): REFIT the imp-36018 slack-vs-depth power law under the
 * imp-35852 CLUSTERED same-sign worst term ORDER, and report whether the depth-scaling
 * EXPONENT stays sub-linear or STEEPENS toward the strict linear-in-d value 1.
 *
 * imp-36018 fit log10(slack) on log10(depth) across the seven imp-35893 pairing-tree SHAPES
 * and found a SUB-linear depth-scaling exponent ~0.748 (R^2 ~0.66), but its slack literals
 * were taken from the imp-35970 table, which measured the per-shape pairwise error under the
 * DEFAULT (natural k = 1 .. N) term order only. imp-36037 / imp-36020 later swept the same
 * seven shapes under the imp-35852 CLUSTERED same-sign order (all negatives, then all
 * positives) and located a worst-SHAPE FLIP to caterpillarL, but reported only the per-shape
 * arg-max -- neither refit the depth EXPONENT under that hostile order. This module supplies
 * that refit, closing the "default-order-only" caveat imp-36018 explicitly flagged.
 *
 * METHOD (measurement only): import the live imp-36020 clustered-order seven-shape sweep
 * (combined pairwise normalized error per shape, plus tree depth, all under the imp-35852
 * clustered order at N ~ 488602 against the same exact 2^{-96} dyadic-BigInt reference; no
 * re-run of the length-N sum here). For each shape form the CLUSTERED-order slack
 * slack_clustered = (d * eps) / errClustered (eps = 2^-52, the identical a-priori Higham
 * gamma_{d_max} coarse-form numerator imp-36018/imp-35970 used, which is order-INDEPENDENT),
 * take base-10 logs, and run ordinary least squares of log10(slack_clustered) on
 * log10(depth). The fitted SLOPE is the clustered-order depth-scaling exponent. We compare it
 * against the imp-36018 default-order exponent (imported live, ~0.748) to decide whether the
 * hostile order STEEPENS the exponent toward 1 or leaves / drives it further sub-linear.
 *
 * FINDING: under the clustered worst order the depth-scaling exponent does NOT steepen toward
 * d^1 -- it FLATTENS FURTHER, from the default-order ~0.748 down to ~0.417 (R^2 drops
 * ~0.66 -> ~0.44). The mechanism is the imp-36020 worst-shape flip: the clustered order
 * inflates the measured error PRECISELY at the DEEPEST tree caterpillarL (d = 3817), whose
 * error climbs from ~2.9e-19 (default floor) to ~1.73e-15 -- the family arg-max -- so its
 * slack COLLAPSES from ~5.9e6 (default) to ~4.9e2, a ~1.2e4x tightening of the a-priori
 * over-prediction at the largest depth. That drags the high-depth end of the slack-vs-depth
 * trend DOWN, which flattens the log-log slope rather than steepening it. Removing the
 * same-depth caterpillarL point (the flip driver) lifts the exponent to ~0.617 (R^2 ~0.73) --
 * still sub-linear and still below the default-order ~0.748 -- confirming the flattening is
 * caterpillarL-driven, the reverse of imp-36018 where removing caterpillarR LIFTED the
 * exponent toward 1. CONCLUSION: the imp-36018 sub-linear finding is not an artifact of the
 * default order -- the sub-linearity PERSISTS and DEEPENS under the imp-35852 skeptical
 * order; the a-priori depth bound over-predicts LESS at large depth precisely because the
 * hostile order makes the deepest caterpillar the arg-max, so the "slack widens with depth"
 * reading weakens (not strengthens) under worst-case ordering. Precision stays NON-binding:
 * even the tightened caterpillarL clustered slack ~4.9e2 leaves the a-priori bound over-
 * predicting the measured error by ~2.7 orders, and imp-36020 already showed every clustered
 * configuration stays below the log2(N)*eps ceiling (arg-max ~41%).
 *
 * HONEST CAVEATS: only seven data points (two caterpillars share depth 3817); the exponent is
 * a descriptive log-log slope, not a certified growth law, and the clustered-order R^2 ~0.44
 * is weaker than the default-order fit -- the slack is even less a clean function of depth
 * under the hostile order. This is a comparative DESCRIPTIVE measurement, precision non-binding.
 *
 * MEASUREMENT / REGRESSION reusing the imp-36020 clustered-order sweep + imp-36018 default-order
 * exponent literals. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36018-w1-pairwise-slack-depth-scaling-exponent (default-order fit this refits under the hostile order)
 * @see imp-36020-w1-clustered-order-shape-argmax (source: per-shape clustered-order error + depth)
 * @see imp-35852-w1-summation-adversarial-ordering (the clustered worst term ORDER)
 * @see imp-36081-w1-pairwise-slack-depth-densified-fit (default-order densified fit; genuine sub-linearity)
 */

import { IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX } from './imp-36020-w1-clustered-order-shape-argmax.js';
import { IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT } from './imp-36018-w1-pairwise-slack-depth-scaling-exponent.js';

const CLUSTERED = IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX;
const DEFAULT_FIT = IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT;
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this regression
const EPS_DOUBLE = 2 ** -52; // machine epsilon; the order-INDEPENDENT a-priori d*eps numerator

// Ordinary least squares of y on x; returns slope, intercept and R^2.
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

// Per-shape CLUSTERED-order (depth, slack) pairs. slack = (d*eps)/errClustered, using the same
// order-independent a-priori Higham d*eps numerator imp-36018/imp-35970 used, now divided by the
// CLUSTERED-order measured error (imp-36020) instead of the default-order error (imp-35970).
const POINTS = CLUSTERED.shapes.map((s) => ({
  shape: s.shape,
  treeDepth: s.treeDepth,
  errClustered: s.combinedNormErr,
  slackClustered: (s.treeDepth * EPS_DOUBLE) / s.combinedNormErr,
  logDepth: Math.log10(s.treeDepth),
  logSlack: Math.log10((s.treeDepth * EPS_DOUBLE) / s.combinedNormErr),
}));

// (1) Full seven-point clustered-order power-law fit: log10(slack_clustered) ~ exponent * log10(d) + c.
const FULL_FIT = ols(POINTS.map((p) => p.logDepth), POINTS.map((p) => p.logSlack));

// (2) Robustness fit excluding the same-depth flip driver caterpillarL (the arg-max under the
// clustered order) -- the mirror of the imp-36018 caterpillarR-removal diagnostic.
const POINTS_NO_L = POINTS.filter((p) => p.shape !== 'caterpillarL');
const NO_L_FIT = ols(POINTS_NO_L.map((p) => p.logDepth), POINTS_NO_L.map((p) => p.logSlack));

// The default-order exponent imp-36018 fit (for the steepen-vs-flatten comparison).
const DEFAULT_EXPONENT = DEFAULT_FIT.fit.full.exponent; // ~0.748
const DEFAULT_R2 = DEFAULT_FIT.fit.full.r2; // ~0.66

// caterpillarL is the DEEPEST tree; its default vs clustered slack shows the collapse that
// flattens the high-depth end of the trend under the hostile order.
const CAT_L = POINTS.find((p) => p.shape === 'caterpillarL');
const CAT_L_DEFAULT = DEFAULT_FIT.points.find((p) => p.shape === 'caterpillarL');
const CAT_L_SLACK_TIGHTENING = CAT_L_DEFAULT.slackDepthEps / CAT_L.slackClustered; // ~1.2e4x

// Does the clustered order STEEPEN the exponent toward the strict linear-in-d value 1?
// Steepening would require the clustered exponent to move CLOSER to 1 than the default fit.
const CLUSTERED_STEEPENS_TOWARD_LINEAR =
  Math.abs(FULL_FIT.slope - 1) < Math.abs(DEFAULT_EXPONENT - 1);
const CLUSTERED_STAYS_SUB_LINEAR = FULL_FIT.slope < 0.85 && FULL_FIT.slope < DEFAULT_EXPONENT;

export const IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT = {
  id: 'imp-36084',
  proofSection: 'S-frontier',
  question:
    'Refitting the imp-36018 log10(slack)-vs-log10(depth) power law under the imp-35852 CLUSTERED same-sign ' +
    'worst term ORDER (imp-36018 fit the default order only), does the depth-scaling exponent stay SUB-linear ' +
    'or STEEPEN toward the strict linear-in-d value 1? Measurement only; NO QED.',
  method: {
    axis: 'tree DEPTH d (12..3817) at FIXED N ~ 488602, measured error under the imp-35852 CLUSTERED same-sign order',
    slackDefinition:
      'slack_clustered = (d * eps) / errClustered (eps = 2^-52); the a-priori d*eps numerator is order-INDEPENDENT, ' +
      'so only the denominator (imp-36020 clustered-order measured error) changes vs the imp-36018 default-order fit',
    regression: 'ordinary least squares of log10(slack_clustered) on log10(treeDepth); slope = clustered depth-scaling exponent',
    comparisonBaseline: 'the imp-36018 default-order exponent (~0.748, R^2 ~0.66), imported live',
    dataPoints: POINTS.length,
    note: 'seven shapes; caterpillarL and caterpillarR share depth 3817, so only six distinct depths',
  },
  points: POINTS.map((p) => ({
    shape: p.shape,
    treeDepth: p.treeDepth,
    errClustered: p.errClustered,
    slackClustered: p.slackClustered,
  })),
  fit: {
    clusteredFull: {
      exponent: FULL_FIT.slope,
      intercept: FULL_FIT.intercept,
      r2: FULL_FIT.r2,
      n: FULL_FIT.n,
    },
    clusteredExcludingSameDepthCaterpillarL: {
      exponent: NO_L_FIT.slope,
      intercept: NO_L_FIT.intercept,
      r2: NO_L_FIT.r2,
      n: NO_L_FIT.n,
    },
    defaultOrderFull: {
      exponent: DEFAULT_EXPONENT,
      r2: DEFAULT_R2,
      source: 'imp-36018 default-order seven-point fit',
    },
  },
  diagnostics: {
    caterpillarLDefaultSlack: CAT_L_DEFAULT.slackDepthEps, // ~5.9e6 (default order, deepest tree, loosest)
    caterpillarLClusteredSlack: CAT_L.slackClustered, // ~4.9e2 (clustered order, deepest tree, now tight)
    caterpillarLSlackTighteningFactor: CAT_L_SLACK_TIGHTENING, // ~1.2e4x tighter at the largest depth
    clusteredSlackSpreadFactor:
      Math.max(...POINTS.map((p) => p.slackClustered)) / Math.min(...POINTS.map((p) => p.slackClustered)),
  },
  test: {
    clusteredExponent: FULL_FIT.slope,
    defaultExponent: DEFAULT_EXPONENT,
    clusteredSteepensTowardLinear: CLUSTERED_STEEPENS_TOWARD_LINEAR,
    clusteredStaysSubLinear: CLUSTERED_STAYS_SUB_LINEAR,
    verdict:
      'the clustered worst order does NOT steepen the exponent toward d^1: it FLATTENS it from the default-order ' +
      '~0.748 to ~0.417, because the hostile order inflates the measured error precisely at the DEEPEST tree ' +
      'caterpillarL (its slack collapses ~1.2e4x, from ~5.9e6 to ~4.9e2), dragging the high-depth end of the ' +
      'trend DOWN -- so the sub-linearity PERSISTS and DEEPENS under the worst-case order',
  },
  reading: {
    subLinearityPersists:
      'the imp-36018 sub-linear finding is NOT a default-order artifact: the clustered-order exponent ~0.417 is ' +
      'even further below the strict linear-in-d value 1 than the default-order ~0.748',
    flattensNotSteepens:
      'the worst-case order FLATTENS the slope (0.748 -> 0.417) rather than steepening it: the deepest caterpillarL ' +
      'becomes the arg-max error shape (imp-36020), so its a-priori over-prediction slack collapses at the largest ' +
      'depth, pulling the high-depth end of the log-log trend down',
    caterpillarLIsTheFlattener:
      'removing the same-depth flip driver caterpillarL lifts the exponent only to ~0.617 (R^2 ~0.73) -- still ' +
      'sub-linear and still below the default-order ~0.748; this is the MIRROR of imp-36018, where removing the ' +
      'HIGH-floor caterpillarR LIFTED the exponent toward 1',
    precisionNotBinding:
      'even the tightened caterpillarL clustered slack ~4.9e2 leaves the a-priori bound over-predicting the ' +
      'measured error by ~2.7 orders, and imp-36020 showed every clustered configuration stays below the ' +
      'log2(N)*eps ceiling (arg-max ~41%); precision is NOT the binding constraint',
  },
  conclusion: {
    subLinearPersistsUnderClusteredOrder:
      'the imp-36018 sub-linear depth-scaling exponent PERSISTS -- indeed DEEPENS to ~0.417 -- under the imp-35852 ' +
      'clustered worst order; it does NOT steepen toward the strict linear-in-d value 1',
    mechanismIsTheWorstShapeFlip:
      'the flattening is driven by the imp-36020 worst-shape flip: the clustered order makes the deepest caterpillarL ' +
      'the arg-max, collapsing its a-priori over-prediction slack ~1.2e4x at the largest depth',
    staysGreenfield:
      'this module refits published clustered-order error literals only; it evaluates no sum of H_t and verifies no ' +
      'inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (clustered-order depth-scaling-exponent refit, NOT a certified growth law). Refitting OLS of ' +
    'log10(slack) on log10(tree depth d) over the seven imp-35893 shapes (d = 12..3817 at fixed N ~ 488602), but ' +
    'with the pairwise error measured under the imp-35852 CLUSTERED same-sign worst term ORDER (imp-36020 sweep) ' +
    'in place of the imp-35970 DEFAULT-order error imp-36018 used, gives a clustered depth-scaling exponent of ' +
    '~0.417 (R^2 ~0.44). This does NOT steepen toward the strict linear-in-d value 1 -- it FLATTENS FURTHER from ' +
    'the default-order ~0.748 (R^2 ~0.66): the hostile order inflates the measured error precisely at the DEEPEST ' +
    'tree caterpillarL (its error rises to the family arg-max ~1.73e-15 and its slack collapses ~1.2e4x, from ' +
    '~5.9e6 to ~4.9e2), dragging the high-depth end of the trend DOWN. Removing that same-depth flip driver lifts ' +
    'the exponent only to ~0.617 -- still sub-linear, still below the default-order value -- the mirror of ' +
    'imp-36018, where removing the high-floor caterpillarR LIFTED the exponent toward 1. So the imp-36018 ' +
    'sub-linearity is NOT a default-order artifact: it PERSISTS and DEEPENS under the worst-case order, and the ' +
    '"slack widens with depth" reading weakens rather than strengthens under worst-case ordering. Precision stays ' +
    'NON-binding (the a-priori bound still over-predicts by ~2.7 orders even at the tightened caterpillarL, and ' +
    'imp-36020 kept every clustered configuration below the log2(N)*eps ceiling). Certifies no W1 bound; evaluates ' +
    'no true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; ' +
    'the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36018 (default-order slack-vs-depth fit this refits under the hostile order); imp-36020 (source ' +
    'clustered-order seven-shape error + depth); imp-35852 (clustered worst term ORDER); imp-35970 (default-order ' +
    'a-priori-vs-measured slack table); imp-36081 (default-order densified fit); imp-35893 (tree-SHAPE sweep); ' +
    'Higham 2002, Sec. 4.2 (gamma_d pairwise bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT_ASSERTIONS = [
  {
    // Seven (depth, clustered-slack) points carried from the imp-36020 clustered-order sweep.
    id: 'imp36084-seven-points-from-imp36020',
    description: 'Seven imp-35893 shapes, each a (tree depth, clustered-order slack) point spanning depth 12..3817',
    holds: () =>
      POINTS.length === 7 &&
      POINTS.every((p) => p.treeDepth >= 1 && p.slackClustered > 0) &&
      Math.min(...POINTS.map((p) => p.treeDepth)) === 12 &&
      Math.max(...POINTS.map((p) => p.treeDepth)) === 3817,
  },
  {
    // The clustered-order full-set exponent is sub-linear (~0.42), well below the strict-linear value 1.
    id: 'imp36084-clustered-exponent-sub-linear',
    description: 'The full seven-point clustered-order depth-scaling exponent is ~0.42 (in [0.3,0.55]), below 1',
    holds: () => FULL_FIT.slope > 0.3 && FULL_FIT.slope < 0.55 && FULL_FIT.slope < 1,
  },
  {
    // The clustered order FLATTENS the exponent (does not steepen it toward 1): it drops below the
    // default-order ~0.748, and does NOT move closer to 1.
    id: 'imp36084-clustered-flattens-not-steepens',
    description: 'The clustered exponent (~0.42) is BELOW the default-order ~0.748 and does not steepen toward 1',
    holds: () =>
      FULL_FIT.slope < DEFAULT_EXPONENT &&
      CLUSTERED_STEEPENS_TOWARD_LINEAR === false &&
      CLUSTERED_STAYS_SUB_LINEAR === true &&
      DEFAULT_EXPONENT > 0.7 && DEFAULT_EXPONENT < 0.8,
  },
  {
    // The flattening is caterpillarL-driven: the deepest tree is the arg-max under the clustered order,
    // so its slack collapses ~1.2e4x vs the default order (from ~5.9e6 to ~4.9e2).
    id: 'imp36084-caterpillarL-slack-collapse-drives-flattening',
    description: 'Deepest caterpillarL slack collapses >1e3x under clustered order (from ~5.9e6 to ~5e2)',
    holds: () =>
      CAT_L.treeDepth === 3817 &&
      CAT_L_SLACK_TIGHTENING > 1e3 &&
      CAT_L.slackClustered < 1e3 &&
      CAT_L_DEFAULT.slackDepthEps > 1e6,
  },
  {
    // Removing caterpillarL lifts the exponent only to ~0.62 -- still sub-linear, still below default.
    id: 'imp36084-remove-caterpillarL-still-sub-linear',
    description: 'Excluding the flip driver caterpillarL lifts the exponent to ~0.62 (>full, <default, still <1)',
    holds: () =>
      NO_L_FIT.n === 6 &&
      NO_L_FIT.slope > FULL_FIT.slope &&
      NO_L_FIT.slope > 0.5 && NO_L_FIT.slope < 0.72 &&
      NO_L_FIT.slope < DEFAULT_EXPONENT,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36084-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /PERSISTS/.test(IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT.conclusion.subLinearPersistsUnderClusteredOrder) &&
      /GREENFIELD/.test(IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT.verdict) &&
      /refereed bound is changed/i.test(IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT.verdict),
  },
];

for (const a of IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36084-w1-pairwise-slack-depth-clustered-order-refit assertion failed: ${a.id}`);
  }
}

export default IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT;
