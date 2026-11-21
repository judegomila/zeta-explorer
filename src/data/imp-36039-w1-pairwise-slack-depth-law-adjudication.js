/**
 * @module imp-36039-w1-pairwise-slack-depth-law-adjudication
 *
 * imp-36039 (accuracy, S-frontier): ADJUDICATE which of the THREE named candidate
 * depth-scaling laws -- FLAT (slack ~ d^0), SQRT (slack ~ d^0.5), or LINEAR (slack ~ d^1)
 * -- best describes how the imp-35970 a-priori pairwise forward-error bound OVER-PREDICTS
 * the imp-35893 measured error as a function of tree DEPTH d across the seven caterpillar
 * SHAPES, quantifying how conservative the depth*eps a-priori bound is on this family.
 *
 * imp-35970 tabulated the Higham gamma_{d_max} depth-proportional a-priori bound over-predicting
 * the measured normalized error by ~3.7 orders (balanced, d=12) to ~6.8 orders (caterpillarL,
 * d=3817) and asserted the slack "widens LINEARLY in d". imp-36018 then fit the log-log slope
 * and REFUTED the strict-linear claim, reporting a SUB-linear free exponent ~0.748 (R^2 ~0.66).
 * Neither ticket asked the question this one poses: among the three SPECIFIC candidate power
 * laws named here -- flat, sqrt-in-d, linear-in-d -- which one the data actually prefers, and
 * whether sqrt and linear can even be told apart on this seven-shape family. This module supplies
 * that three-way adjudication by comparing constrained-slope residual sums of squares (RSS).
 *
 * METHOD (measurement only): import the live imp-36018 (depth, slack) point set (no re-run of the
 * length-N = 488602 sum; the seven shapes, tree depths d and per-shape slackDepthEps =
 * (d*eps)/measured are read verbatim through imp-36018, which reads them from imp-35970), take
 * base-10 logs, and for each candidate exponent m in {0, 0.5, 1} compute the constrained-fit
 * residual sum of squares RSS(m) = sum_i ( (y_i - ybar) - m (x_i - xbar) )^2 -- i.e. the best
 * offset-only fit at the fixed slope m, where x = log10(d), y = log10(slack). The free OLS
 * exponent (imp-36018 ~0.748) gives the unconstrained minimum RSS_free = syy - slope*sxy. A law
 * is DECISIVELY rejected when its constrained RSS is a large multiple of RSS_free; two laws are
 * INDISTINGUISHABLE when their constrained RSS differ by only a few percent.
 *
 * FINDING (measurement only): the over-prediction factor unambiguously GROWS with depth (FLAT is
 * decisively rejected: RSS_flat ~5.065 is ~2.92x the free-fit minimum RSS_free ~1.733), but the
 * data CANNOT distinguish SQRT-in-d from LINEAR-in-d --
 *   candidate law      exponent m   constrained RSS   RSS / RSS_free
 *   FLAT               0.0            ~5.065            ~2.92   (DECISIVELY rejected)
 *   SQRT               0.5            ~2.099            ~1.21
 *   LINEAR             1.0            ~2.112            ~1.22
 *   (free OLS)         ~0.748         ~1.733            1.00    (imp-36018)
 * -- SQRT and LINEAR sit within ~0.6% of each other (RSS ratio ~0.994, sqrt marginally lower) and
 * BOTH fit worse than the free exponent, because the fitted depth-scaling exponent ~0.748 lands
 * almost exactly at the arithmetic MIDPOINT of 0.5 and 1.0 (equidistant to within ~0.004: 0.248
 * from sqrt, 0.252 from linear). So the honest verdict on the three named candidates is: NOT flat,
 * and sqrt-vs-linear is a statistical TIE this seven-point family (two shapes sharing depth 3817;
 * R^2 ~0.66) has no power to break. imp-35970 "linearly in d" over-states the growth; imp-36018
 * "sub-linear ~0.75" is the correct summary, and this module locates that ~0.75 as the midpoint
 * between the sqrt and linear hypotheses -- the depth*eps a-priori bound loosens somewhere strictly
 * between sqrt-in-d and linear-in-d, and 4-7 orders above the measured floor throughout. Precision
 * stays NON-binding; the W1 obstruction remains the MECHANICAL certified length-N interval sum
 * (imp-35725).
 *
 * HONEST CAVEATS: only seven data points (two sharing depth 3817), so the sqrt/linear tie reflects
 * genuinely low resolving power, not a proof of equivalence; RSS comparison is descriptive model
 * selection, not a certified growth law or a formal hypothesis test with p-values.
 *
 * MEASUREMENT / MODEL-SELECTION reusing the imp-36018 (=imp-35970) slack literals. Certifies no W1
 * bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound;
 * establishes no positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36018-w1-pairwise-slack-depth-scaling-exponent (source: free OLS depth-scaling exponent + points)
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack (per-shape a-priori-vs-measured slack table)
 * @see imp-35893-w1-summation-pairwise-tree-shape (the tree-SHAPE sweep + measured errors)
 * @see imp-35952-w1-caterpillar-worst-tree-n-ladder (measured error is an N-independent FLOOR at fixed shape)
 */

import { IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT } from './imp-36018-w1-pairwise-slack-depth-scaling-exponent.js';

const SOURCE = IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT;
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this model selection

// (depth, slack) points read verbatim from the imp-36018 export (which reads them from imp-35970).
const POINTS = SOURCE.points.map((p) => ({
  shape: p.shape,
  treeDepth: p.treeDepth,
  slackDepthEps: p.slackDepthEps,
  x: Math.log10(p.treeDepth), // log10 tree depth d
  y: Math.log10(p.slackDepthEps), // log10 a-priori-vs-measured slack
}));

const N = POINTS.length;
const XBAR = POINTS.reduce((a, p) => a + p.x, 0) / N;
const YBAR = POINTS.reduce((a, p) => a + p.y, 0) / N;
let SXY = 0;
let SXX = 0;
let SYY = 0;
for (const p of POINTS) {
  SXY += (p.x - XBAR) * (p.y - YBAR);
  SXX += (p.x - XBAR) ** 2;
  SYY += (p.y - YBAR) ** 2;
}
const FREE_SLOPE = SXY / SXX; // unconstrained OLS exponent (imp-36018 ~0.748)
const RSS_FREE = SYY - FREE_SLOPE * SXY; // unconstrained minimum residual sum of squares

// Constrained-fit residual sum of squares at a FIXED slope m (best offset-only fit at that slope):
// RSS(m) = sum_i ((y_i - ybar) - m (x_i - xbar))^2.
function constrainedRss(m) {
  let s = 0;
  for (const p of POINTS) {
    const r = (p.y - YBAR) - m * (p.x - XBAR);
    s += r * r;
  }
  return s;
}

// The three NAMED candidate depth-scaling laws this ticket adjudicates.
const CANDIDATES = [
  { law: 'flat', exponent: 0 }, // slack ~ d^0 (no depth dependence)
  { law: 'sqrt', exponent: 0.5 }, // slack ~ d^0.5
  { law: 'linear', exponent: 1 }, // slack ~ d^1 (imp-35970 asserted)
].map((c) => {
  const rss = constrainedRss(c.exponent);
  return {
    law: c.law,
    exponent: c.exponent,
    rss,
    rssOverFree: rss / RSS_FREE, // >> 1 means this constrained law fits far worse than free OLS
    distanceToFreeExponent: Math.abs(FREE_SLOPE - c.exponent),
  };
});

const BY_LAW = Object.fromEntries(CANDIDATES.map((c) => [c.law, c]));
const FLAT = BY_LAW.flat;
const SQRT = BY_LAW.sqrt;
const LINEAR = BY_LAW.linear;

// Best-fitting NAMED candidate (smallest constrained RSS).
const BEST_CANDIDATE = CANDIDATES.reduce((a, b) => (b.rss < a.rss ? b : a));
// sqrt-vs-linear resolving power: how close their constrained RSS are (near 1 => indistinguishable).
const SQRT_LINEAR_RSS_RATIO = SQRT.rss / LINEAR.rss;
// Is FLAT decisively rejected relative to the free-fit optimum?
const FLAT_REJECTED = FLAT.rssOverFree > 2;
// Are sqrt and linear statistically indistinguishable on this family (RSS within ~10%)?
const SQRT_LINEAR_INDISTINGUISHABLE = Math.abs(SQRT_LINEAR_RSS_RATIO - 1) < 0.1;

export const IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION = {
  id: 'imp-36039',
  proofSection: 'S-frontier',
  question:
    'Among the three named candidate depth-scaling laws -- FLAT (slack ~ d^0), SQRT (slack ~ d^0.5), ' +
    'LINEAR (slack ~ d^1) -- which best describes how the imp-35970 a-priori pairwise bound over-predicts ' +
    'the imp-35893 measured error vs tree depth d across the seven shapes, and can sqrt and linear be told ' +
    'apart on this family? Measurement / model selection only; certifies no bound; NO QED.',
  method: {
    axis: 'tree DEPTH d (12..3817) at FIXED problem size N ~ 488602',
    slackDefinition: 'slackDepthEps = (d * eps) / measuredNormErr, read verbatim via imp-36018 (from imp-35970)',
    modelSelection:
      'for each candidate exponent m in {0, 0.5, 1} compute the constrained-slope residual sum of squares ' +
      'RSS(m) = sum ((y - ybar) - m (x - xbar))^2 with x = log10(d), y = log10(slack); compare to the free ' +
      'OLS minimum RSS_free = syy - slope*sxy (free exponent = imp-36018 ~0.748)',
    rejectionRule: 'a law is DECISIVELY rejected when RSS(m) / RSS_free > 2; two laws are INDISTINGUISHABLE when their RSS differ by < 10%',
    dataPoints: POINTS.length,
    note: 'seven shapes; caterpillarL and caterpillarR share depth 3817, so only six distinct depths',
  },
  freeFit: {
    exponent: FREE_SLOPE, // ~0.748 (imp-36018)
    rss: RSS_FREE, // ~1.733
    r2: (SXY * SXY) / (SXX * SYY), // ~0.658 (imp-36018)
  },
  candidates: CANDIDATES,
  adjudication: {
    flatRss: FLAT.rss,
    sqrtRss: SQRT.rss,
    linearRss: LINEAR.rss,
    freeRss: RSS_FREE,
    flatRssOverFree: FLAT.rssOverFree, // ~2.92
    sqrtLinearRssRatio: SQRT_LINEAR_RSS_RATIO, // ~0.994
    bestNamedCandidate: BEST_CANDIDATE.law, // sqrt (marginally)
    flatDecisivelyRejected: FLAT_REJECTED,
    sqrtLinearIndistinguishable: SQRT_LINEAR_INDISTINGUISHABLE,
    freeExponentEquidistant:
      Math.abs(SQRT.distanceToFreeExponent - LINEAR.distanceToFreeExponent) < 0.05, // 0.248 vs 0.252
  },
  reading: {
    flatRejected:
      'the over-prediction factor unambiguously GROWS with depth: the FLAT law (slack ~ d^0) has constrained ' +
      'RSS ~5.07, ~2.92x the free-fit minimum ~1.73 -- decisively rejected',
    sqrtVsLinearTie:
      'SQRT (RSS ~2.10) and LINEAR (RSS ~2.11) sit within ~0.6% of each other (ratio ~0.994, sqrt marginally ' +
      'lower) and BOTH fit worse than the free exponent, so this seven-point family cannot tell sqrt-in-d from ' +
      'linear-in-d apart',
    freeExponentIsMidpoint:
      'the free OLS exponent ~0.748 lands almost exactly at the arithmetic midpoint of 0.5 and 1.0 (equidistant ' +
      'to within ~0.004: 0.248 from sqrt, 0.252 from linear), which is WHY the two constrained fits nearly tie -- ' +
      'the true loosening sits strictly between the sqrt and linear hypotheses this ticket named',
    reconcilesImp36018:
      'consistent with imp-36018 (which refuted the strict-linear claim with a free exponent ~0.748, R^2 ~0.66); ' +
      'this module locates that exponent as the sqrt-linear midpoint and shows the two named laws are a statistical tie',
  },
  conclusion: {
    threeWayVerdict:
      'among the three named candidate laws the verdict is: FLAT decisively rejected (RSS ~2.92x free-fit), and ' +
      'SQRT vs LINEAR a statistical TIE (RSS within ~0.6%) this family has no power to break -- the depth*eps ' +
      'a-priori bound loosens somewhere strictly between sqrt-in-d and linear-in-d (free exponent ~0.75)',
    precisionNotBinding:
      'whichever of sqrt/linear one adopts, the a-priori depth bound over-predicts the measured error by 4-7 ' +
      'orders on every shape (imp-35970); double precision leaves overwhelming strict headroom, precision is NOT binding',
    staysGreenfield:
      'this module compares constrained fits of published slack literals only; it evaluates no sum of H_t and ' +
      'verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and ' +
      'MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (three-way depth-law model selection, NOT a certified growth law). Comparing constrained-slope ' +
    'residual sums of squares for the three named candidate laws against the seven imp-35893 shapes (depth ' +
    'd = 12..3817 at fixed N ~ 488602), the FLAT law (slack ~ d^0) is decisively rejected -- its constrained ' +
    'RSS ~5.07 is ~2.92x the free-fit minimum ~1.73 -- so the over-prediction factor unambiguously grows with ' +
    'depth. But SQRT (RSS ~2.10) and LINEAR (RSS ~2.11) are within ~0.6% of each other (ratio ~0.994, sqrt ' +
    'marginally lower) and BOTH fit worse than the free exponent, because the free OLS exponent ~0.748 lands ' +
    'almost exactly at the arithmetic midpoint of 0.5 and 1.0 (equidistant to within ~0.004). So the honest ' +
    'three-way verdict is NOT flat, with sqrt-vs-linear a statistical tie this seven-point family (two shapes ' +
    'sharing depth 3817, R^2 ~0.66) cannot break: the depth*eps a-priori bound loosens strictly between ' +
    'sqrt-in-d and linear-in-d, refining imp-35970 "linearly in d" and locating the imp-36018 sub-linear ~0.75 ' +
    'exponent as the sqrt-linear midpoint. Certifies no W1 bound; evaluates no true H_0; instantiates no ' +
    'interval; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate ' +
    'at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36018 (source free OLS depth-scaling exponent + points); imp-35970 (a-priori-vs-measured slack table); ' +
    'imp-35893 (tree-SHAPE sweep + measured errors); imp-35952 (measured error is an N-independent floor at fixed ' +
    'shape); imp-35761 (log2(N)*eps pairwise ceiling); Higham 2002, Sec. 4.2 (gamma_d pairwise bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION_ASSERTIONS = [
  {
    // Seven (depth, slack) points carried over from imp-36018 (=imp-35970), depth 12..3817.
    id: 'imp36039-seven-points-from-imp36018',
    description: 'Seven imp-35893 shapes, each a (tree depth, slackDepthEps) point spanning depth 12..3817',
    holds: () =>
      POINTS.length === 7 &&
      POINTS.every((p) => p.treeDepth >= 1 && p.slackDepthEps > 0) &&
      Math.min(...POINTS.map((p) => p.treeDepth)) === 12 &&
      Math.max(...POINTS.map((p) => p.treeDepth)) === 3817,
  },
  {
    // The free OLS exponent reproduces imp-36018 (~0.748), the shared anchor for the RSS comparison.
    id: 'imp36039-free-exponent-matches-imp36018',
    description: 'The free OLS depth exponent reproduces the imp-36018 value (~0.748) within tolerance',
    holds: () => Math.abs(FREE_SLOPE - SOURCE.fit.full.exponent) / SOURCE.fit.full.exponent < 1e-9,
  },
  {
    // FLAT (slack ~ d^0) is decisively rejected: its constrained RSS is > 2x the free-fit minimum.
    id: 'imp36039-flat-decisively-rejected',
    description: 'The flat law (d^0) has constrained RSS > 2x the free-fit minimum (~2.92x): over-prediction grows with depth',
    holds: () => FLAT_REJECTED === true && FLAT.rssOverFree > 2.5 && FLAT.rssOverFree < 3.5,
  },
  {
    // SQRT and LINEAR are a statistical tie: their constrained RSS agree within ~0.6% (ratio ~0.994).
    id: 'imp36039-sqrt-linear-indistinguishable',
    description: 'SQRT (d^0.5) and LINEAR (d^1) constrained RSS agree within ~10% (ratio ~0.994): the family cannot tell them apart',
    holds: () =>
      SQRT_LINEAR_INDISTINGUISHABLE === true &&
      SQRT_LINEAR_RSS_RATIO > 0.9 &&
      SQRT_LINEAR_RSS_RATIO < 1.05,
  },
  {
    // Both sqrt and linear fit WORSE than the free exponent, which sits between them.
    id: 'imp36039-free-beats-both-named',
    description: 'Both SQRT and LINEAR constrained RSS exceed the free-fit RSS; the free exponent (~0.75) lies strictly between 0.5 and 1',
    holds: () =>
      SQRT.rss > RSS_FREE &&
      LINEAR.rss > RSS_FREE &&
      FREE_SLOPE > 0.5 &&
      FREE_SLOPE < 1,
  },
  {
    // The free exponent ~0.748 is essentially the midpoint of the sqrt (0.5) and linear (1.0) hypotheses.
    id: 'imp36039-free-exponent-is-sqrt-linear-midpoint',
    description: 'The free exponent ~0.748 is equidistant (within ~0.05) from the sqrt (0.5) and linear (1.0) hypotheses',
    holds: () =>
      Math.abs(SQRT.distanceToFreeExponent - LINEAR.distanceToFreeExponent) < 0.05 &&
      Math.abs(FREE_SLOPE - 0.75) < 0.05,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36039-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /statistical TIE/.test(IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION.conclusion.threeWayVerdict) &&
      /GREENFIELD/.test(IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION.verdict) &&
      /refereed bound is changed/i.test(IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION.verdict),
  },
];

for (const a of IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36039-w1-pairwise-slack-depth-law-adjudication assertion failed: ${a.id}`);
  }
}

export default IMP36039_W1_PAIRWISE_SLACK_DEPTH_LAW_ADJUDICATION;
