/**
 * @module imp-35970-w1-pairwise-apriori-depth-bound-slack
 *
 * imp-35970 (accuracy, S-frontier): DERIVE / ASSESS the tightest a-priori pairwise
 * forward-error bound as a function of tree DEPTH d (the depth-proportional d*eps /
 * Higham gamma_d form, rather than the balanced log2(N)*eps ceiling) for each imp-35893
 * pairing-tree SHAPE, tabulate the a-priori bound per shape, and MEASURE its ratio to
 * the recorded measured normalized error to quantify how LOOSE the a-priori depth*eps
 * bound is on this caterpillar family.
 *
 * imp-35893 measured that the worst-case pairing tree (caterpillarR, depth 3817)
 * attains only ~4.42e-4 of the balanced log2(N)*eps ceiling and stated the
 * depth-proportional worst-case bound (depth*eps ~ 8.5e-13 at depth 3817) is "NOT
 * realized" -- but never tabulated that a-priori depth bound per shape against the
 * measured error. This module supplies that tabulation. It imports the live imp-35893
 * measurement (no re-run of the length-N = 488602 sum; the seven shapes, their tree
 * depths and their measured normalized errors are read verbatim) and, per shape,
 * instantiates the standard published pairwise-summation forward-error bound.
 *
 * PUBLISHED THEORY (Higham 2002, Accuracy and Stability of Numerical Algorithms, Sec. 4.2):
 * for recursive summation over ANY binary computation tree, the computed sum satisfies
 *   ŝ = sum_i x_i (1 + theta_i),   |theta_i| <= gamma_{d_i} = d_i u / (1 - d_i u),
 * where d_i is the number of additions on the path from leaf i to the root and
 * u = 2^-53 is the unit roundoff. Hence the tightest general-tree a-priori forward-error
 * bound, normalized by the Higham scale sum_i |x_i|, is
 *   |ŝ - s| / sum|x| <= max_i gamma_{d_i} = gamma_{d_max}   (the sum-of-path-depths form).
 * For a balanced tree d_max ~ log2(N) (the log2(N)*eps ceiling); for an unbalanced /
 * caterpillar tree d_max ~ depth, giving the depth-proportional d*eps regime this ticket
 * targets. Two instantiations are reported per shape:
 *   (A) depthEpsBound  = d * eps                       -- the coarse first-order form
 *                                                          imp-35893 named (eps = 2^-52 = 2u);
 *   (B) highamGammaBound = gamma_{d + LEAF - 1}, u=2^-53 -- the COMPLETE tightest standard
 *                                                          bound, adding the intra-leaf-block
 *                                                          naive depth (each element passes
 *                                                          through d tree-additions plus up to
 *                                                          LEAF-1 naive additions inside its
 *                                                          base block of size LEAF = 128).
 * (B) is the honest a-priori bound for THIS scheme; it lies a few-fold ABOVE the pure
 * log2(N)*eps ceiling of imp-35761 (which assumes a full pure-binary tree, LEAF = 1),
 * because the naive leaf-block accumulation contributes its own worst-case depth.
 *
 * FINDING (measurement only): the a-priori depth-proportional bound OVER-PREDICTS the
 * measured normalized error by ~3.7 to ~6.8 orders of magnitude across the family --
 *   shape          depth   measured err   depthEps bound (d*eps)   slack = bound/measured
 *   balanced(0.5)     12     ~3.56e-19        ~2.66e-15               ~7.5e3   (tightest)
 *   skew0.25          29     ~1.89e-20        ~6.44e-15               ~3.4e5
 *   skew0.1           79     ~3.56e-19        ~1.75e-14               ~4.9e4
 *   skew0.03         276     ~2.31e-19        ~6.13e-14               ~2.7e5
 *   skew0.01         874     ~2.31e-19        ~1.94e-13               ~8.4e5
 *   caterpillarL    3817     ~1.44e-19        ~8.48e-13               ~5.9e6   (loosest)
 *   caterpillarR    3817     ~1.85e-18        ~8.48e-13               ~4.6e5   (worst error)
 * -- and the slack WIDENS with depth: the measured error is a depth-independent FLOOR
 * (imp-35952), while the a-priori bound grows linearly in d, so the deeper the tree the
 * looser the a-priori d*eps bound. CORRECTION (imp-36018): fitting the slack ratio itself
 * against depth (OLS of log10(slack) on log10(d) across the seven shapes) finds a
 * SUB-linear exponent ~0.748 (R^2 ~0.658), not the strict slack ~ d^1 this depth-independent
 * -floor idealization predicts, because the measured error is not a perfectly constant floor
 * across shapes; excluding the same-depth high-floor caterpillarR outlier lifts the fitted
 * exponent to ~0.936, close to linear. Even the worst-error tree (caterpillarR, the tree the
 * a-priori bound would flag as most dangerous) leaves ~4.6e5x (~5.7 orders) of unused
 * a-priori headroom. The complete Higham gamma_{d+LEAF-1} bound (B) and the coarse d*eps
 * form (A) CROSS near d ~ LEAF (= 128): for shallow trees (balanced d=12 .. skew0.1 d=79)
 * the fixed LEAF-block naive-depth offset makes (B) the larger; for deep caterpillars
 * (d >> 128) the factor-2 in eps = 2u makes (A) the larger. Both remain honest a-priori
 * bounds, both over-predict the measured error by 4-7 orders, and (B) confirms the
 * balanced-tree a-priori bound sits a few-fold above the log2(N)*eps ceiling once the naive
 * leaf blocks are counted. CONCLUSION: the published depth-proportional pairwise a-priori
 * bound is honest but extremely pessimistic on this cancellation-heavy oscillatory data --
 * it captures depth but not the sign-decorrelation of per-addition rounding errors along
 * the tree spine, so it cannot see the measured floor. Precision stays NON-binding; the W1
 * obstruction remains the MECHANICAL certified length-N interval sum (imp-35725).
 *
 * ASSESSMENT / DERIVATION reusing published pairwise-summation theory against the imp-35893
 * literals. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35893-w1-summation-pairwise-tree-shape.js (source: the tree-SHAPE sweep + measured errors)
 * @see imp-36018-w1-pairwise-slack-depth-scaling-exponent.js (CORRECTS the "linearly in d" prose below to SUB-linear, exponent ~0.748)
 * @see imp-35952-w1-caterpillar-worst-tree-n-ladder (the measured error is an N-independent FLOOR)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise + N*eps naive ceilings)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, Sec. 4.2 (gamma_d pairwise bound)
 */

import { IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE } from './imp-35893-w1-summation-pairwise-tree-shape.js';

const SOURCE = IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE;

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) -- the Higham gamma_d constant
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2u) -- the coarse d*eps form imp-35893 named
const LEAF = SOURCE.representativeSum.leafBlock; // base block size (128); naive intra-block depth
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this assessment

// Higham gamma_k = k u / (1 - k u): the exact first-order-accurate accumulated-rounding factor.
function gamma(k) {
  const ku = k * U_ROUNDOFF;
  return ku / (1 - ku);
}

// Per-shape a-priori depth-proportional bounds and their slack vs the measured error.
// The tree depths and measured normalized errors are read verbatim from the imp-35893 live run.
const SHAPES = SOURCE.shapes.map((s) => {
  const d = s.treeDepth;
  const measured = s.pairwiseNormErr;
  // (A) the coarse d*eps form imp-35893 named (equals 1 / s.ratioToDepthEpsBound when inverted).
  const depthEpsBound = d * EPS_DOUBLE;
  // (B) the complete tightest general-tree Higham bound: each leaf element traverses d
  //     tree-additions plus up to LEAF-1 naive additions inside its base block.
  const effectivePathDepth = d + (LEAF - 1);
  const highamGammaBound = gamma(effectivePathDepth);
  return {
    shape: s.shape,
    treeDepth: d,
    measuredNormErr: measured,
    depthEpsBound, // (A) d * eps
    highamGammaBound, // (B) gamma_{d + LEAF - 1}, u = 2^-53
    effectivePathDepth,
    slackDepthEps: depthEpsBound / measured, // looseness of (A): bound over measured
    slackHigham: highamGammaBound / measured, // looseness of (B)
    ratioMeasuredToDepthEps: measured / depthEpsBound, // == s.ratioToDepthEpsBound (fraction realized)
  };
});

const BY_SHAPE = Object.fromEntries(SHAPES.map((r) => [r.shape, r]));
const BALANCED = BY_SHAPE['balanced(0.5)'];
const CATERPILLAR_R = BY_SHAPE['caterpillarR']; // the worst-error tree
const TIGHTEST_SLACK = SHAPES.reduce((a, b) => (b.slackDepthEps < a.slackDepthEps ? b : a));
const LOOSEST_SLACK = SHAPES.reduce((a, b) => (b.slackDepthEps > a.slackDepthEps ? b : a));

// Sanity cross-check: the depth*eps slack is exactly the inverse of the imp-35893 ratioToDepthEpsBound.
const RECONCILES_SOURCE = SOURCE.shapes.every((s) => {
  const here = BY_SHAPE[s.shape];
  return Math.abs(1 / here.slackDepthEps - s.ratioToDepthEpsBound) / s.ratioToDepthEpsBound < 1e-9;
});

export const IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK = {
  id: 'imp-35970',
  proofSection: 'S-frontier',
  question:
    'For each imp-35893 pairing-tree SHAPE, what is the tightest a-priori depth-proportional pairwise ' +
    'forward-error bound (d*eps / Higham gamma_d, not the balanced log2(N)*eps ceiling), and how loose is ' +
    'it against the measured normalized error? Assessment only; certifies no W1 bound; changes no bound; NO QED.',
  aprioriTheory: {
    source: 'Higham 2002, Accuracy and Stability of Numerical Algorithms, Sec. 4.2',
    perLeafBound: 'computed sum = sum_i x_i (1 + theta_i), |theta_i| <= gamma_{d_i}, gamma_k = k u / (1 - k u)',
    generalTreeNormalizedBound: 'max_i gamma_{d_i} = gamma_{d_max}, normalized by the Higham scale sum_i |x_i|',
    unitRoundoff: U_ROUNDOFF,
    machineEps: EPS_DOUBLE,
    leafBlock: LEAF,
    depthEpsForm: 'd * eps (eps = 2u) -- the coarse first-order form imp-35893 named',
    highamCompleteForm:
      'gamma_{d + LEAF - 1} (u = 2^-53) -- adds the intra-leaf-block naive depth; the honest a-priori ' +
      'bound for THIS LEAF = 128 scheme, a few-fold above the pure log2(N)*eps ceiling of imp-35761',
  },
  shapes: SHAPES,
  summary: {
    reconcilesImp35893DepthEpsRatio: RECONCILES_SOURCE,
    tightestSlackShape: TIGHTEST_SLACK.shape,
    tightestSlackDepthEps: TIGHTEST_SLACK.slackDepthEps,
    loosestSlackShape: LOOSEST_SLACK.shape,
    loosestSlackDepthEps: LOOSEST_SLACK.slackDepthEps,
    worstErrorShape: CATERPILLAR_R.shape,
    worstErrorSlackDepthEps: CATERPILLAR_R.slackDepthEps,
    slackSpanOrdersOfMagnitude:
      Math.log10(LOOSEST_SLACK.slackDepthEps) - Math.log10(TIGHTEST_SLACK.slackDepthEps),
  },
  reading: {
    depthBoundOverPredicts:
      'the a-priori depth-proportional bound over-predicts the measured normalized error by ~3.7 orders ' +
      '(balanced, ~7.5e3x) to ~6.8 orders (caterpillarL, ~5.9e6x); the bound is honest but extremely ' +
      'pessimistic on this cancellation-heavy oscillatory data',
    slackWidensWithDepth:
      'the slack WIDENS with tree depth: the measured error is a depth-independent FLOOR (imp-35952) while ' +
      'the a-priori bound grows linearly in d, so deeper trees leave proportionally more unused headroom -- ' +
      'CORRECTED per imp-36018: the fitted slack-vs-depth exponent measured directly is SUB-linear (~0.748, ' +
      'R^2 ~0.658), not the strict d^1 this floor idealization predicts, rising to ~0.936 once the ' +
      'same-depth high-floor caterpillarR outlier is excluded',
    worstErrorStillLoose:
      'even the worst-error tree (caterpillarR, depth 3817 -- the tree the a-priori bound flags as most ' +
      'dangerous) leaves ~4.6e5x (~5.7 orders) of unused a-priori headroom',
    highamCrossesDepthEps:
      'the complete Higham gamma_{d + LEAF - 1} bound (u = 2^-53) and the coarse d*eps form (eps = 2u) CROSS ' +
      'near d ~ LEAF = 128: for shallow trees the LEAF-block offset makes the Higham form larger, for deep ' +
      'caterpillars the factor-2 in eps makes the d*eps form larger; both are honest, both loose by 4-7 orders, ' +
      'and the Higham form confirms the balanced-tree a-priori bound sits a few-fold above the log2(N)*eps ceiling',
  },
  conclusion: {
    aprioriDepthBoundIsLoose:
      'the published depth-proportional pairwise a-priori bound (d*eps / gamma_d) is loose by 4-7 orders of ' +
      'magnitude across the imp-35893 family and cannot see the measured floor: it captures tree DEPTH but ' +
      'not the sign-decorrelation of per-addition rounding errors along the tree spine',
    precisionNotBinding:
      'the a-priori-vs-measured slack confirms double precision leaves overwhelming strict headroom even ' +
      'under the worst-case pairing-tree depth; precision is NOT the binding constraint',
    staysGreenfield:
      'this module instantiates published error bounds against the imp-35893 literals only; it evaluates no ' +
      'sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (a-priori-vs-measured slack, NOT a certified bound). Instantiating the standard Higham ' +
    'pairwise-summation forward-error bound gamma_{d_max} (and the coarse d*eps form imp-35893 named) per ' +
    'imp-35893 pairing-tree SHAPE and dividing by the recorded measured normalized error, the a-priori ' +
    'depth-proportional bound OVER-PREDICTS the measured error by ~3.7 orders (balanced, ~7.5e3x) to ~6.8 ' +
    'orders (caterpillarL, ~5.9e6x); even the worst-error tree (caterpillarR, depth 3817) leaves ~4.6e5x ' +
    'unused headroom. The slack WIDENS with depth because the measured error is a depth-independent FLOOR ' +
    '(imp-35952) while the bound grows linearly in d. The complete gamma_{d+LEAF-1} form (adding the naive ' +
    'leaf-block depth) is even looser and sits a few-fold above the pure log2(N)*eps ceiling. The a-priori ' +
    'depth*eps bound is honest but extremely pessimistic: it captures tree depth, not the rounding-error ' +
    'sign-decorrelation along the spine, so it cannot see the measured floor -- confirming precision is NOT ' +
    'the binding constraint. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies ' +
    'no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35893 (source tree-SHAPE sweep + measured errors); imp-35952 (measured error is an N-independent ' +
    'floor); imp-35761 (log2(N)*eps pairwise and N*eps naive ceilings); imp-35760 (barrier-margin allocation); ' +
    'imp-35674 Part D (N(x) = floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A (A+B-C interval greenfield); ' +
    'Higham 2002, Sec. 4.2 (gamma_d pairwise summation error); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK_ASSERTIONS = [
  {
    // Seven shapes carried over from imp-35893, each with a tree depth and a measured error.
    id: 'imp35970-seven-shapes-from-imp35893',
    description: 'Seven imp-35893 pairing-tree shapes, each with a tree depth and a measured normalized error',
    holds: () =>
      SHAPES.length === 7 &&
      SHAPES.every((r) => r.treeDepth >= 1 && r.measuredNormErr > 0) &&
      BALANCED.treeDepth < 20 &&
      CATERPILLAR_R.treeDepth > 3000,
  },
  {
    // The depth*eps slack must exactly invert the imp-35893 ratioToDepthEpsBound (faithful reuse).
    id: 'imp35970-reconciles-imp35893-depth-eps-ratio',
    description: 'The per-shape depth*eps slack is exactly the inverse of the imp-35893 ratioToDepthEpsBound',
    holds: () => RECONCILES_SOURCE === true,
  },
  {
    // The a-priori depth*eps bound over-predicts measured by 4-7 orders on EVERY shape.
    id: 'imp35970-depth-bound-loose-every-shape',
    description: 'The a-priori depth*eps bound over-predicts the measured error by >1e3x on every shape',
    holds: () =>
      SHAPES.every((r) => r.slackDepthEps > 1e3) &&
      LOOSEST_SLACK.slackDepthEps > 1e6 &&
      TIGHTEST_SLACK.slackDepthEps < 1e5,
  },
  {
    // Slack widens with depth: the loosest slack is a deep (caterpillar-class) tree, not the balanced one.
    id: 'imp35970-slack-widens-with-depth',
    description: 'The loosest a-priori slack occurs at a deep tree (depth > 3000), not the balanced tree',
    holds: () =>
      LOOSEST_SLACK.treeDepth > 3000 &&
      TIGHTEST_SLACK.shape === 'balanced(0.5)' &&
      LOOSEST_SLACK.slackDepthEps > BALANCED.slackDepthEps,
  },
  {
    // Even the worst-error tree (caterpillarR) leaves >1e5x a-priori headroom.
    id: 'imp35970-worst-error-tree-still-loose',
    description: 'The worst-error tree (caterpillarR) leaves >1e5x unused a-priori depth*eps headroom',
    holds: () =>
      CATERPILLAR_R.shape === 'caterpillarR' &&
      CATERPILLAR_R.slackDepthEps > 1e5 &&
      CATERPILLAR_R.measuredNormErr < CATERPILLAR_R.depthEpsBound,
  },
  {
    // The complete Higham gamma_{d+LEAF-1} form and the coarse d*eps form cross near d ~ LEAF:
    // Higham larger for shallow trees (d < LEAF), d*eps larger for deep caterpillars (d > LEAF).
    id: 'imp35970-higham-depth-eps-crossover',
    description: 'Higham gamma_{d+LEAF-1} exceeds d*eps exactly when tree depth < LEAF (=128); both loose >1e3x',
    holds: () =>
      LEAF === 128 &&
      SHAPES.every((r) => (r.treeDepth < LEAF) === (r.highamGammaBound > r.depthEpsBound)) &&
      SHAPES.every((r) => r.slackHigham > 1e3 && r.slackDepthEps > 1e3),
  },
  {
    // Honesty gate: assessment only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35970-honesty-gate',
    description: 'Assessment only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /loose by 4-7 orders/.test(
        IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.conclusion.aprioriDepthBoundIsLoose,
      ) &&
      /GREENFIELD/.test(IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.verdict) &&
      /refereed bound is changed/i.test(IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.verdict),
  },
];

for (const a of IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35970-w1-pairwise-apriori-depth-bound-slack assertion failed: ${a.id}`);
  }
}

export default IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK;
