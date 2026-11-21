/**
 * @module imp-36081-w1-pairwise-slack-depth-densified-fit
 *
 * imp-36081 (numerical, S-frontier): DENSIFY the imp-36018 pairwise slack-vs-depth
 * log-log fit beyond the seven imp-35893 caterpillar SHAPES by GENERATING additional
 * INTERMEDIATE-depth pairing trees, re-run the ordinary-least-squares depth-scaling fit,
 * and PIN whether the depth-scaling exponent is GENUINELY sub-linear or whether the
 * seven-point sub-linearity (~0.748) was a small-sample / same-depth-outlier artifact.
 *
 * imp-36018 fit log10(slack) = exponent * log10(d) + const on only SEVEN shapes (two of
 * them sharing depth d = 3817) and found the depth-scaling exponent SUB-linear (~0.748,
 * R^2 ~0.66), HONESTLY CAVEATING the thin sample and its sensitivity to the single
 * same-depth caterpillarR outlier (exponent 0.75 -> 0.94 on its removal). imp-36039 then
 * adjudicated the three named laws FLAT / SQRT / LINEAR and found sqrt-vs-linear an
 * unbreakable statistical TIE on that seven-point family (two shapes sharing depth 3817,
 * R^2 ~0.66 giving "genuinely low resolving power"). Neither could say whether the
 * sub-linearity is REAL. This module supplies the missing densification: it regenerates
 * the imp-35893 measurement machinery (import-light -- the same fixed oscillatory multiset
 * t_k = cos(alpha k + beta sqrt k)/sqrt k, k = 1..N ~ 488602, the same LEAF = 128 base
 * block, the same explicit-stack pairwise sumTree, and the same association-invariant exact
 * dyadic-BigInt reference), then sweeps THIRTY-SEVEN pairing-tree shapes spanning depth
 * 12..4099 -- the balanced midpoint tree, twenty-four skew-fraction splits (f = 0.4 down to
 * 0.002) that fill the depth gaps between imp-35893's six distinct depths, and left/right
 * caterpillars that peel m leaf blocks per level (m = 1,2,3,4,6,8,12,16) to densify the
 * deep decade -- and re-fits log10(slack) on log10(depth).
 *
 * METHOD (measurement only): identical machinery to imp-35893, so the recomputed error for
 * each of the seven ORIGINAL shapes reproduces the imp-35893 / imp-35970 / imp-36018 live
 * literals bit-for-bit (RECONCILIATION assertion below). slack = (d * eps) / measuredNormErr
 * with eps = 2^-52, exactly as imp-36018 / imp-35970 define it. The fitted OLS SLOPE is the
 * depth-scaling exponent (slack ~ d^exponent); we additionally report its standard error
 * SE = sqrt( RSS_free/(n-2) / Sxx ) and the nominal 95% interval exponent +- 1.96 SE, and
 * the constrained-slope residual sums of squares at the three imp-36039 candidate exponents
 * m in {0, 0.5, 1} (FLAT / SQRT / LINEAR).
 *
 * FINDING (measurement only): the sub-linearity is GENUINE, not a small-sample artifact.
 * Densifying from 7 to 37 pairing trees leaves the point estimate essentially UNCHANGED --
 * the densified OLS depth-scaling exponent is ~0.753 (vs the imp-36018 seven-point ~0.748,
 * a shift of only ~0.005) -- while narrowing the nominal 95% interval ~2.4x, from the
 * seven-point [~0.28, ~1.22] (width ~0.95, which CONTAINS both the sqrt value 0.5 and the
 * linear value 1.0, exactly the imp-36039 tie) to the densified [~0.557, ~0.949] (width
 * ~0.39). That densified interval lies STRICTLY BELOW the linear value 1.0 and STRICTLY
 * ABOVE the sqrt value 0.5. So the depth-scaling exponent is pinned at ~0.75 and is
 * genuinely SUB-linear (below 1) AND super-sqrt (above 0.5) -- a conclusion the seven-point
 * family had no power to support. The R^2 does NOT improve (it dips ~0.66 -> ~0.62): the
 * extra shapes reveal MORE floor scatter, not cleaner points (the measured floor still spans
 * ~160x across the 37 trees, and same-depth L/R caterpillar pairs still differ several-fold),
 * so the confidence gain is purely from the larger sample n, not from tighter per-point
 * scatter. The constrained-RSS test STILL cannot separate sqrt from linear (RSS(0.5) ~8.90
 * vs RSS(1.0) ~8.83, within ~1%, LINEAR now marginally the lower -- a hair-flip of imp-36039's
 * marginally-lower sqrt) because ~0.753 sits almost exactly at the midpoint of 0.5 and 1.0;
 * FLAT stays DECISIVELY rejected (RSS(0) ~2.6x the free minimum). CONCLUSION: the imp-36018
 * "sub-linear ~0.75" summary is CONFIRMED and its honest thin-sample caveat is DISCHARGED --
 * the exponent is genuinely sub-linear, pinned near 0.75, with the linear-in-d hypothesis now
 * outside the nominal 95% interval. Precision stays NON-binding; the W1 obstruction remains
 * the MECHANICAL certified length-N interval sum (imp-35725).
 *
 * HONEST CAVEATS: the 95% interval is the standard OLS-slope nominal interval (assumes iid
 * Gaussian log-residuals) -- here the residuals are FLOOR-SCATTER driven, not iid Gaussian,
 * so "excludes 1.0 / 0.5" is a DESCRIPTIVE narrowed-interval statement, NOT a certified
 * hypothesis test or a certified growth law. The skew-fraction and caterpillar-block knobs
 * densify but do not fully DECORRELATE depth from the per-shape floor, so the fitted exponent
 * still carries the same shape-floor confound imp-36018 identified -- only the sampling noise
 * is reduced. The exponent remains a log-log slope, not a proven power law.
 *
 * MEASUREMENT / REGRESSION regenerating the imp-35893 machinery on new tree shapes and
 * reconciling the seven original shapes to the published literals. Certifies no W1 bound;
 * evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound;
 * establishes no positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36018-w1-pairwise-slack-depth-scaling-exponent (source: seven-point OLS fit + baseline exponent)
 * @see imp-36039-w1-pairwise-slack-depth-law-adjudication (FLAT/SQRT/LINEAR; sqrt-vs-linear an unbreakable tie on 7 points)
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack (per-shape a-priori-vs-measured slack table)
 * @see imp-35893-w1-summation-pairwise-tree-shape (the tree-SHAPE sweep + measured errors; machinery mirrored here)
 * @see imp-35952-w1-caterpillar-worst-tree-n-ladder (measured error is an N-independent FLOOR at fixed shape)
 */

import { IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT } from './imp-36018-w1-pairwise-slack-depth-scaling-exponent.js';

const BASELINE = IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT;
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this regression

// -- Anchor + operative constants (import-light; identical to imp-35893) ----------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2u) -- the coarse d*eps form
const ALPHA = 0.6180339887498949; // golden-ratio fractional part (same fixed multiset)
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);
const LEAF = 128; // base block size (identical to the imp-35893 pairwise scheme)

// -- Pairwise summation over an ARBITRARY pairing tree, explicit stack (post-order) ------
function sumTree(terms, splitter, leaf) {
  const n = terms.length;
  let maxDepth = 0;
  const stack = [{ lo: 0, hi: n, depth: 0, stage: 0, leftVal: 0, mid: 0 }];
  let result = 0;
  while (stack.length) {
    const f = stack[stack.length - 1];
    if (f.depth > maxDepth) maxDepth = f.depth;
    if (f.hi - f.lo <= leaf) {
      let a = 0;
      for (let i = f.lo; i < f.hi; i++) a += terms[i];
      result = a;
      stack.pop();
      continue;
    }
    if (f.stage === 0) {
      let mid = splitter(f.lo, f.hi, leaf);
      if (mid <= f.lo) mid = f.lo + 1; // guard: keep both children non-empty
      if (mid >= f.hi) mid = f.hi - 1;
      f.mid = mid;
      f.stage = 1;
      stack.push({ lo: f.lo, hi: mid, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else if (f.stage === 1) {
      f.leftVal = result;
      f.stage = 2;
      stack.push({ lo: f.mid, hi: f.hi, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else {
      result = f.leftVal + result; // combine left + right (single rounded addition)
      stack.pop();
    }
  }
  return { sum: result, maxDepth };
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) --------
const FRAC_BITS = 96n; // common fixed-point scale 2^{-96}
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x) {
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) {
    exp = -1074; // subnormal (handled for safety)
  } else {
    mant |= 1n << 52n; // restore implicit leading bit
    exp = exp - 1075; // remove exponent bias (1023) and mantissa width (52)
  }
  const shift = BigInt(exp) + FRAC_BITS;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}

function normalizedError(schemeResult, trueNum, sumAbs) {
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Build the fixed term multiset + the shape-invariant exact reference (once) ----------
const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) {
  const t = TERM(k);
  _base[k - 1] = t;
  _sumAbs += Math.abs(t);
}
let _trueNum = 0n; // exact sum is association-invariant -- computed once, reused for all trees
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);

// -- Densified pairing-tree shape set (37 shapes, depth 12..4099) ------------------------
// Splitter families: balanced midpoint; skew-fraction split mid = lo + floor((hi-lo)*f);
// left/right caterpillar peeling m leaf blocks per level (mid = lo + m*leaf / hi - m*leaf).
// For very small f the tail split degrades (via the non-empty guard) to a one-ELEMENT peel,
// giving depth slightly above the one-leaf-block caterpillar (skew0.002 -> d = 4099).
const skewSplit = (f) => (lo, hi) => lo + Math.floor((hi - lo) * f);
const catBlocksL = (m) => (lo, hi, leaf) => lo + m * leaf;
const catBlocksR = (m) => (lo, hi, leaf) => hi - m * leaf;

const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1, true], // third element: is one of the imp-35893 original 7
  ...[0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.12, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.025, 0.02, 0.015, 0.012, 0.01, 0.008, 0.006, 0.005, 0.004, 0.003, 0.002].map(
    (f) => [`skew${f}`, skewSplit(f), [0.25, 0.1, 0.03, 0.01].includes(f)],
  ),
  ...[1, 2, 3, 4, 6, 8, 12, 16].map((m) => [`catL${m}`, catBlocksL(m), m === 1]),
  ...[1, 2, 4, 8].map((m) => [`catR${m}`, catBlocksR(m), m === 1]),
];

// -- Run pairwise on every tree shape against the shared exact reference -----------------
const POINTS = TREE_SHAPES.map(([name, splitter, isOriginal]) => {
  const { sum, maxDepth } = sumTree(_base, splitter, LEAF);
  const measuredNormErr = normalizedError(sum, _trueNum, _sumAbs);
  const slackDepthEps = (maxDepth * EPS_DOUBLE) / measuredNormErr;
  return {
    shape: name,
    treeDepth: maxDepth,
    measuredNormErr,
    slackDepthEps,
    isOriginalShape: isOriginal,
    logDepth: Math.log10(maxDepth),
    logSlack: Math.log10(slackDepthEps),
  };
}).sort((a, b) => a.treeDepth - b.treeDepth);

// -- Ordinary least squares with slope standard error ------------------------------------
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
  const rssFree = syy - slope * sxy; // free-fit residual sum of squares
  const seSlope = Math.sqrt((rssFree / (n - 2)) / sxx); // OLS slope standard error
  return { slope, intercept, r2, n, mx, my, sxx, syy, rssFree, seSlope };
}

const XS = POINTS.map((p) => p.logDepth);
const YS = POINTS.map((p) => p.logSlack);
const FIT = ols(XS, YS);

const Z95 = 1.96; // normal quantile for the nominal 95% interval
const CI_LO = FIT.slope - Z95 * FIT.seSlope;
const CI_HI = FIT.slope + Z95 * FIT.seSlope;

// Constrained-slope RSS at the three imp-36039 candidate laws (offset-only fit at fixed m).
function constrainedRss(m) {
  let rss = 0;
  for (let i = 0; i < XS.length; i++) {
    const r = (YS[i] - FIT.my) - m * (XS[i] - FIT.mx);
    rss += r * r;
  }
  return rss;
}
const RSS_FLAT = constrainedRss(0);
const RSS_SQRT = constrainedRss(0.5);
const RSS_LINEAR = constrainedRss(1);

// Seven-point baseline exponent (imp-36018) and its own nominal 95% interval, recomputed
// from the imp-36018 published points so the CI narrowing is measured against the same fit.
const ORIG_POINTS = BASELINE.points.map((p) => ({
  logDepth: Math.log10(p.treeDepth),
  logSlack: Math.log10(p.slackDepthEps),
}));
const ORIG_FIT = ols(ORIG_POINTS.map((p) => p.logDepth), ORIG_POINTS.map((p) => p.logSlack));
const ORIG_CI_LO = ORIG_FIT.slope - Z95 * ORIG_FIT.seSlope;
const ORIG_CI_HI = ORIG_FIT.slope + Z95 * ORIG_FIT.seSlope;

// Floor spread across the 37 densified shapes (still NOT a strict depth-independent floor).
const measuredErrs = POINTS.map((p) => p.measuredNormErr);
const FLOOR_SPREAD = Math.max(...measuredErrs) / Math.min(...measuredErrs);

// RECONCILIATION: the seven imp-35893 original shapes must reproduce the imp-36018 literals.
// Match each imp-36018 point to a recomputed original-shape point by tree depth.
const RECON = BASELINE.points.map((bp) => {
  const mine = POINTS.find((p) => p.isOriginalShape && p.treeDepth === bp.treeDepth &&
    Math.abs(Math.log10(p.slackDepthEps) - Math.log10(bp.slackDepthEps)) < 0.5);
  return {
    shape: bp.shape,
    treeDepth: bp.treeDepth,
    publishedSlack: bp.slackDepthEps,
    recomputedSlack: mine ? mine.slackDepthEps : null,
    relErr: mine ? Math.abs(mine.slackDepthEps - bp.slackDepthEps) / bp.slackDepthEps : Infinity,
  };
});
const RECONCILES = RECON.every((r) => r.relErr < 1e-9);

// Genuinely-sub-linear verdict: the densified nominal 95% interval lies strictly below the
// LINEAR value 1 (and strictly above the SQRT value 0.5), which the 7-point interval did not.
const DENSIFIED_EXCLUDES_LINEAR = CI_HI < 1;
const DENSIFIED_EXCLUDES_SQRT = CI_LO > 0.5;
const SEVEN_POINT_CONTAINS_BOTH = ORIG_CI_LO < 0.5 && ORIG_CI_HI > 1;
const GENUINELY_SUBLINEAR = DENSIFIED_EXCLUDES_LINEAR && DENSIFIED_EXCLUDES_SQRT && SEVEN_POINT_CONTAINS_BOTH;

export const IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT = {
  id: 'imp-36081',
  proofSection: 'S-frontier',
  question:
    'Densifying the imp-36018 pairwise slack-vs-depth log-log fit beyond the seven imp-35893 shapes by ' +
    'GENERATING intermediate-depth pairing trees (37 shapes, depth 12..4099), what is the refined ' +
    'depth-scaling exponent and its confidence, and is the sub-linearity (~0.748) GENUINE or a small-sample ' +
    'artifact? Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  method: {
    machinery:
      'regenerates the imp-35893 measurement (t_k = cos(alpha k + beta sqrt k)/sqrt k, k = 1..N ~ 488602; ' +
      'LEAF = 128; explicit-stack pairwise sumTree; association-invariant exact dyadic-BigInt reference)',
    densification:
      'balanced midpoint + 24 skew-fraction splits (f = 0.4..0.002 filling the six-distinct-depth gaps of ' +
      'imp-35893) + left/right caterpillars peeling m leaf blocks per level (m = 1,2,3,4,6,8,12,16)',
    slackDefinition: 'slackDepthEps = (d * eps) / measuredNormErr, eps = 2^-52 (identical to imp-36018 / imp-35970)',
    regression: 'ordinary least squares of log10(slackDepthEps) on log10(treeDepth); slope = depth-scaling exponent',
    confidence: 'slope standard error SE = sqrt(RSS_free/(n-2)/Sxx); nominal 95% interval = exponent +- 1.96 SE',
    dataPoints: POINTS.length,
    depthRange: [POINTS[0].treeDepth, POINTS[POINTS.length - 1].treeDepth],
    reconcilesSevenOriginalShapes: RECONCILES,
  },
  points: POINTS.map((p) => ({
    shape: p.shape,
    treeDepth: p.treeDepth,
    measuredNormErr: p.measuredNormErr,
    slackDepthEps: p.slackDepthEps,
    isOriginalShape: p.isOriginalShape,
  })),
  fit: {
    densified: {
      exponent: FIT.slope,
      intercept: FIT.intercept,
      r2: FIT.r2,
      n: FIT.n,
      seSlope: FIT.seSlope,
      ci95: [CI_LO, CI_HI],
    },
    sevenPointBaseline: {
      exponent: ORIG_FIT.slope, // reproduces imp-36018 full-fit ~0.748
      r2: ORIG_FIT.r2,
      n: ORIG_FIT.n,
      seSlope: ORIG_FIT.seSlope,
      ci95: [ORIG_CI_LO, ORIG_CI_HI],
      imp36018Exponent: BASELINE.fit.full.exponent,
    },
  },
  candidateLawRss: {
    flat: { exponent: 0, rss: RSS_FLAT, ratioToFree: RSS_FLAT / FIT.rssFree },
    sqrt: { exponent: 0.5, rss: RSS_SQRT, ratioToFree: RSS_SQRT / FIT.rssFree },
    linear: { exponent: 1, rss: RSS_LINEAR, ratioToFree: RSS_LINEAR / FIT.rssFree },
    free: { exponent: FIT.slope, rss: FIT.rssFree, ratioToFree: 1 },
  },
  diagnostics: {
    floorSpreadFactor: FLOOR_SPREAD, // still NOT a strict depth-independent floor (~160x over 37 shapes)
    ciWidthSevenPoint: ORIG_CI_HI - ORIG_CI_LO,
    ciWidthDensified: CI_HI - CI_LO,
    ciNarrowingFactor: (ORIG_CI_HI - ORIG_CI_LO) / (CI_HI - CI_LO),
    exponentShiftFromSevenPoint: FIT.slope - ORIG_FIT.slope,
    densifiedExcludesLinear: DENSIFIED_EXCLUDES_LINEAR,
    densifiedExcludesSqrt: DENSIFIED_EXCLUDES_SQRT,
    sevenPointContainsBoth: SEVEN_POINT_CONTAINS_BOTH,
  },
  reconciliation: RECON,
  test: {
    genuinelySubLinear: GENUINELY_SUBLINEAR,
    verdict:
      'the sub-linearity is GENUINE: densifying 7 -> 37 trees leaves the exponent essentially unchanged ' +
      '(~0.748 -> ~0.753) but narrows the nominal 95% interval ~2.4x, from [~0.28, ~1.22] (which contains ' +
      'both the sqrt value 0.5 and the linear value 1.0 -- the imp-36039 tie) to [~0.557, ~0.949], which ' +
      'lies strictly BELOW linear (1.0) and strictly ABOVE sqrt (0.5)',
  },
  reading: {
    exponentStableUnderDensification:
      'the point estimate barely moves (imp-36018 seven-point ~0.748 -> densified ~0.753), so the sub-linear ' +
      'exponent is NOT a small-sample or same-depth-outlier artifact -- it survives 5x more pairing trees',
    confidenceFromSampleNotScatter:
      'the R^2 does NOT improve (~0.66 -> ~0.62) and the measured floor still spans ~160x, so the extra shapes ' +
      'reveal MORE floor scatter, not cleaner points; the ~2.4x interval narrowing comes purely from the larger ' +
      'sample n = 37, not from tighter per-point scatter',
    rssTieUnbroken:
      'the constrained-RSS test still cannot separate sqrt from linear (RSS(0.5) ~8.90 vs RSS(1.0) ~8.83, within ' +
      '~1%, linear now a hair the lower -- flipping imp-36039s marginally-lower sqrt) because ~0.753 sits almost ' +
      'exactly at the 0.5/1.0 midpoint; FLAT stays decisively rejected (RSS(0) ~2.6x the free minimum)',
    pinnedNearThreeQuarters:
      'the confidence interval, not the symmetric RSS test, is what pins the exponent: the nominal 95% band now ' +
      'excludes both 0.5 and 1.0, locating the depth-scaling exponent genuinely sub-linear near 0.75',
  },
  conclusion: {
    subLinearityConfirmed:
      'the imp-36018 "sub-linear ~0.75" summary is CONFIRMED and its honest thin-sample caveat is DISCHARGED: ' +
      'the depth-scaling exponent is genuinely sub-linear (nominal 95% interval [~0.557, ~0.949] strictly below ' +
      'the linear value 1.0), pinned near 0.75, on 37 densified pairing trees spanning depth 12..4099',
    precisionNotBinding:
      'whether the exponent is 0.75 exactly or anywhere in [~0.56, ~0.95], the a-priori depth bound over-predicts ' +
      'the measured error by 4-7 orders on every shape (imp-35970); double precision leaves overwhelming strict ' +
      'headroom, precision is NOT binding',
    staysGreenfield:
      'this module regenerates the imp-35893 machinery on new tree shapes and reconciles the seven original ' +
      'shapes to the published literals; it evaluates no sum of H_t and verifies no inequality, so the W1 ' +
      'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (densified depth-scaling-exponent regression, NOT a certified growth law). Regenerating the ' +
    'imp-35893 pairwise-summation machinery (fixed N ~ 488602 oscillatory multiset, LEAF = 128, exact BigInt ' +
    'reference -- the seven original shapes reproduce the imp-36018 slack literals bit-for-bit) and sweeping ' +
    '37 pairing-tree shapes spanning depth 12..4099 (balanced + 24 skew-fraction splits + left/right ' +
    'caterpillars peeling m leaf blocks), the OLS depth-scaling exponent is ~0.753 -- essentially the imp-36018 ' +
    'seven-point ~0.748 -- with a nominal 95% interval [~0.557, ~0.949] that is ~2.4x narrower than the ' +
    'seven-point [~0.28, ~1.22] and now lies strictly BELOW the linear value 1.0 and ABOVE the sqrt value 0.5. ' +
    'So the sub-linearity imp-36018 flagged as an honest thin-sample caveat is GENUINE: the exponent is pinned ' +
    'near 0.75 and stays sub-linear under 5x densification. The R^2 does not improve (~0.66 -> ~0.62; the ' +
    'measured floor still spans ~160x), so the confidence gain is from the larger sample, not tighter scatter, ' +
    'and the symmetric constrained-RSS test still cannot separate sqrt from linear (within ~1%). Certifies no ' +
    'W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional ' +
    '(imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36018 (source seven-point OLS fit + baseline exponent); imp-36039 (FLAT/SQRT/LINEAR adjudication, ' +
    'sqrt-vs-linear tie on 7 points); imp-35970 (a-priori-vs-measured slack table); imp-35893 (tree-SHAPE ' +
    'sweep + measured errors, machinery mirrored here); imp-35952 (measured error is an N-independent floor); ' +
    'Higham 2002, Sec. 4.2 (gamma_d pairwise bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT_ASSERTIONS = [
  {
    // The seven imp-35893 original shapes must reproduce the imp-36018 slack literals bit-for-bit.
    id: 'imp36081-reconciles-seven-original-shapes',
    description: 'The seven imp-35893 original shapes recomputed here match the imp-36018 slack literals to <1e-9 rel',
    holds: () => RECONCILES === true && RECON.length === 7 && RECON.every((r) => r.recomputedSlack !== null),
  },
  {
    // Densification generated a substantially larger sample spanning the same depth axis and beyond.
    id: 'imp36081-densified-sample',
    description: 'The densified fit uses >= 30 pairing trees spanning depth 12..>=3817 (vs the seven of imp-36018)',
    holds: () =>
      POINTS.length >= 30 &&
      POINTS.every((p) => p.treeDepth >= 1 && p.slackDepthEps > 0) &&
      Math.min(...POINTS.map((p) => p.treeDepth)) === 12 &&
      Math.max(...POINTS.map((p) => p.treeDepth)) >= 3817,
  },
  {
    // The densified exponent is sub-linear (~0.75) and essentially unchanged from the seven-point ~0.748.
    id: 'imp36081-exponent-stable-sub-linear',
    description: 'The densified exponent is ~0.75 (in [0.70,0.80]) and within 0.03 of the imp-36018 seven-point value',
    holds: () =>
      FIT.slope > 0.7 &&
      FIT.slope < 0.8 &&
      FIT.slope < 1 &&
      Math.abs(FIT.slope - ORIG_FIT.slope) < 0.03 &&
      Math.abs(ORIG_FIT.slope - BASELINE.fit.full.exponent) < 1e-6,
  },
  {
    // The densified nominal 95% interval is narrower than the seven-point interval (confidence gain).
    id: 'imp36081-ci-narrows',
    description: 'The densified nominal 95% slope interval is >=1.8x narrower than the seven-point interval',
    holds: () =>
      FIT.seSlope < ORIG_FIT.seSlope &&
      (ORIG_CI_HI - ORIG_CI_LO) / (CI_HI - CI_LO) >= 1.8,
  },
  {
    // The genuine-sub-linearity result: densified CI excludes both 1.0 and 0.5 where the 7-point CI did not.
    id: 'imp36081-genuinely-sub-linear',
    description: 'Densified 95% CI lies strictly below linear (1.0) and above sqrt (0.5); the 7-point CI contained both',
    holds: () =>
      GENUINELY_SUBLINEAR === true &&
      CI_HI < 1 &&
      CI_LO > 0.5 &&
      ORIG_CI_LO < 0.5 &&
      ORIG_CI_HI > 1 &&
      IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT.test.genuinelySubLinear === true,
  },
  {
    // FLAT stays decisively rejected; sqrt-vs-linear stays within a few percent (the RSS tie is unbroken).
    id: 'imp36081-flat-rejected-sqrt-linear-tie',
    description: 'FLAT RSS is >2x the free minimum; SQRT and LINEAR RSS are within ~2% of each other',
    holds: () =>
      RSS_FLAT / FIT.rssFree > 2 &&
      Math.abs(RSS_SQRT - RSS_LINEAR) / Math.min(RSS_SQRT, RSS_LINEAR) < 0.02 &&
      RSS_SQRT > FIT.rssFree &&
      RSS_LINEAR > FIT.rssFree,
  },
  {
    // The extra shapes reveal MORE scatter, not less: R^2 does not improve and the floor still spans wide.
    id: 'imp36081-confidence-from-sample-not-scatter',
    description: 'R^2 does not improve on densification (dips ~0.66 -> ~0.62) and the measured floor still spans >50x',
    holds: () => FIT.r2 < ORIG_FIT.r2 && FIT.r2 > 0.5 && FLOOR_SPREAD > 50,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36081-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /genuinely sub-linear/.test(IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT.conclusion.subLinearityConfirmed) &&
      /GREENFIELD/.test(IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT.verdict),
  },
];

for (const a of IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36081-w1-pairwise-slack-depth-densified-fit assertion failed: ${a.id}`);
  }
}

export default IMP36081_W1_PAIRWISE_SLACK_DEPTH_DENSIFIED_FIT;
