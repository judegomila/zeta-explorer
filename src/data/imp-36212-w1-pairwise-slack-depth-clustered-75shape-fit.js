/**
 * @module imp-36212-w1-pairwise-slack-depth-clustered-75shape-fit
 *
 * imp-36212 (numerical, S-frontier): DENSIFY the imp-36132 CLUSTERED-order slack-vs-depth
 * log-log fit a SECOND time -- from the 37 imp-36081 pairing-tree shapes to ~75 -- at fixed
 * N ~ 488602 under the imp-35852 clustered same-sign term ORDER, and MEASURE whether the
 * depth-scaling exponent STABILIZES toward sqrt (0.5) or CONTINUES to drift upward, and whether
 * the nominal 95% interval tightens toward 0.5.
 *
 * CONTEXT. imp-36084 fit seven clustered shapes and read the exponent as ~0.417; imp-36132
 * densified 7 -> 37 and found the exponent LIFTED to ~0.532 (shift ~0.115) with a nominal 95%
 * interval ~[0.33, 0.73], reading it as sqrt-consistent (the interval CONTAINS 0.5; RSS(0.5) ~=
 * the free minimum) and linear-inconsistent. But imp-36132 flagged the open worry that the
 * 7 -> 37 shift of ~0.115 might indicate an exponent that keeps DRIFTING with sample size rather
 * than a stable sub-linear law. This module tests that worry directly: it re-runs the identical
 * imp-35893 machinery under the imp-35852 clustered order over a SEVENTY-FIVE-shape family that
 * is a strict SUPERSET of the imp-36081 37 shapes (so the shared shapes reproduce the imp-36132
 * clustered errors bit-for-bit -- RECONCILIATION assertion below), and re-fits.
 *
 * METHOD (measurement only): identical machinery to imp-35893 / imp-36081 / imp-36132 (t_k =
 * cos(alpha k + beta sqrt k)/sqrt k, k = 1..N ~ 488602, LEAF = 128, explicit-stack pairwise
 * sumTree, association-invariant exact dyadic-BigInt reference), term array reordered into the
 * imp-35852 CLUSTERED same-sign runs (all negatives, then all positives). The 75-shape family
 * ADDS 24 interpolated skew fractions, 8 more left caterpillars and 6 more right caterpillars to
 * the imp-36081 37, all with the smallest skew fraction held at 0.002 so the DEPTH AXIS is NOT
 * extended (span 12..6095, identical to the 37-shape run) -- this is a genuine in-range
 * densification, not a reach to new depths. slack = (d * eps) / errClustered, eps = 2^-52. The
 * fitted OLS slope is the clustered depth-scaling exponent; we report its SE, nominal 95%
 * interval, the constrained-slope RSS at m in {0, 0.5, 1} (FLAT / SQRT / LINEAR), and the shift
 * from the imp-36132 37-point ~0.532.
 *
 * FINDING (measurement only): densification does NOT stabilize the clustered exponent at sqrt --
 * it CONTINUES to drift UPWARD. The 37 -> 75 shift is ~+0.127 (0.532 -> 0.659), essentially the
 * SAME magnitude as the 7 -> 37 shift ~+0.115, so across the three sample sizes the exponent
 * climbs 0.417 -> 0.532 -> 0.659 in near-equal steps rather than converging to 0.5. The nominal
 * 95% interval DOES tighten (width ~0.40 -> ~0.29, ~1.4x narrower) and R^2 modestly improves
 * (~0.43 -> ~0.52), but the tightening moves the interval AWAY from sqrt: at 75 shapes the
 * interval ~[0.51, 0.81] now marginally EXCLUDES 0.5 at its lower edge (as well as excluding
 * 1.0). So the imp-36132 "sqrt-consistent / interval contains 0.5" reading does NOT survive the
 * second densification -- the point estimate has moved ~0.16 above sqrt and sits between sqrt and
 * linear. Of the three named single-exponent laws SQRT is still the CLOSEST (RSS(0.5) ~1.06x the
 * free minimum, vs LINEAR ~1.28x and FLAT ~2.07x), but the free exponent is no longer statistically
 * indistinguishable from 0.5. WHAT DOES SURVIVE the second densification is the qualitative
 * imp-36084 / imp-36132 headline: the clustered exponent stays strictly SUB-linear (95% interval
 * excludes 1.0; RSS(1) ~1.28x free) and stays BELOW the default-order ~0.748 (0.659 < 0.748) --
 * though the gap to the default order has narrowed from ~0.22 to ~0.09. CONCLUSION: the clustered
 * depth-scaling exponent is NOT a stable sqrt law -- it drifts upward under successive
 * densification (0.417 -> 0.532 -> 0.659) and at 75 shapes the tightened 95% interval excludes
 * 0.5; the only claim robust across all three sample sizes is that the clustered order keeps the
 * exponent sub-linear (< 1) and below the default order (~0.748). Precision stays NON-binding.
 *
 * HONEST CAVEATS: the 95% interval is the standard OLS-slope nominal interval (assumes iid
 * Gaussian log-residuals); here the residuals are FLOOR-SCATTER driven (floor spans ~3600x), so
 * "excludes 0.5 / excludes 1.0" is a DESCRIPTIVE narrowed-interval statement, NOT a certified
 * hypothesis test. A log-log slope is COMPOSITION-sensitive: the 75-shape family adds many
 * shallow large-m caterpillars, so part of the upward drift is family reweighting rather than a
 * proven functional trend -- the honest read is that no stable single exponent is pinned, only
 * the sub-linear / below-default bracket. R^2 ~0.52 stays weak; the exponent remains a log-log
 * slope, not a proven power law.
 *
 * MEASUREMENT / REGRESSION regenerating the imp-35893 machinery under the imp-35852 clustered
 * order on a 75-shape superset of the imp-36081 family and reconciling the shared shapes to the
 * imp-36132 clustered errors bit-for-bit. Certifies no W1 bound; evaluates no true H_0;
 * instantiates no interval; verifies no inequality; changes no bound; establishes no positivity;
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36132-w1-pairwise-slack-depth-clustered-densified-fit (the 37-shape clustered fit this densifies; ~0.532)
 * @see imp-36084-w1-pairwise-slack-depth-clustered-order-refit (the original seven-point clustered fit ~0.417)
 * @see imp-36081-w1-pairwise-slack-depth-densified-fit (the DEFAULT-order densification; the 37 shapes this superset extends)
 * @see imp-35852-w1-summation-adversarial-ordering (the clustered worst term ORDER)
 * @see imp-36039-w1-pairwise-slack-depth-law-adjudication (FLAT/SQRT/LINEAR candidate laws)
 */

import { IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT } from './imp-36132-w1-pairwise-slack-depth-clustered-densified-fit.js';

const PRIOR = IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT;
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this regression

// -- Anchor + operative constants (import-light; identical to imp-35893 / imp-36081 / imp-36132) -
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
let _trueNum = 0n; // exact sum is order- AND association-invariant -- computed once, reused
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);

// -- imp-35852 worst term ORDER: clustered same-sign runs (all negatives, then all positives) --
const _neg = [];
const _pos = [];
for (let i = 0; i < N_AT_TPT; i++) {
  if (_base[i] < 0) _neg.push(_base[i]);
  else _pos.push(_base[i]);
}
const CLUSTERED_TERMS = Float64Array.from(_neg.concat(_pos));

// -- 75-shape pairing-tree family: a strict SUPERSET of the imp-36081 37 shapes -----------
// The imp-36081 37 = balanced + 24 skew (0.4..0.002) + catL{1,2,3,4,6,8,12,16} + catR{1,2,4,8};
// this adds 24 interpolated skews + catL{5,7,10,14,20,24,32,48} + catR{3,6,12,16,24,32} = 75.
// The smallest skew fraction stays 0.002, so the depth AXIS is unchanged (span 12..6095).
const skewSplit = (fr) => (lo, hi) => lo + Math.floor((hi - lo) * fr);
const catBlocksL = (m) => (lo, hi, leaf) => lo + m * leaf;
const catBlocksR = (m) => (lo, hi, leaf) => hi - m * leaf;

// Third element: matching imp-36081/imp-36132 shape name if shared (for the reconciliation set).
const SKEWS_37 = [0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.12, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.025, 0.02, 0.015, 0.012, 0.01, 0.008, 0.006, 0.005, 0.004, 0.003, 0.002];
const SKEWS_EXTRA = [0.45, 0.38, 0.32, 0.28, 0.22, 0.18, 0.13, 0.11, 0.09, 0.07, 0.055, 0.045, 0.035, 0.028, 0.022, 0.018, 0.013, 0.011, 0.009, 0.007, 0.0055, 0.0045, 0.0035, 0.0025];
const CATL_37 = [1, 2, 3, 4, 6, 8, 12, 16];
const CATL_EXTRA = [5, 7, 10, 14, 20, 24, 32, 48];
const CATR_37 = [1, 2, 4, 8];
const CATR_EXTRA = [3, 6, 12, 16, 24, 32];

const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1, true],
  ...SKEWS_37.map((fr) => [`skew${fr}`, skewSplit(fr), true]),
  ...SKEWS_EXTRA.map((fr) => [`skew${fr}`, skewSplit(fr), false]),
  ...CATL_37.map((m) => [`catL${m}`, catBlocksL(m), true]),
  ...CATL_EXTRA.map((m) => [`catL${m}`, catBlocksL(m), false]),
  ...CATR_37.map((m) => [`catR${m}`, catBlocksR(m), true]),
  ...CATR_EXTRA.map((m) => [`catR${m}`, catBlocksR(m), false]),
];

// -- Run pairwise on every tree shape under the CLUSTERED order against the shared reference ----
const POINTS = TREE_SHAPES.map(([name, splitter, isShared]) => {
  const { sum, maxDepth } = sumTree(CLUSTERED_TERMS, splitter, LEAF);
  const errClustered = normalizedError(sum, _trueNum, _sumAbs);
  const slackClustered = (maxDepth * EPS_DOUBLE) / errClustered;
  return {
    shape: name,
    treeDepth: maxDepth,
    errClustered,
    slackClustered,
    isShared, // true if this shape is one of the imp-36081/imp-36132 37 (reconciled below)
    logDepth: Math.log10(maxDepth),
    logSlack: Math.log10(slackClustered),
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
  const rssFree = syy - slope * sxy;
  const seSlope = Math.sqrt((rssFree / (n - 2)) / sxx);
  return { slope, intercept, r2, n, mx, my, sxx, syy, rssFree, seSlope };
}

const XS = POINTS.map((p) => p.logDepth);
const YS = POINTS.map((p) => p.logSlack);
const FIT = ols(XS, YS);

const Z95 = 1.96; // normal quantile for the nominal 95% interval
const CI_LO = FIT.slope - Z95 * FIT.seSlope;
const CI_HI = FIT.slope + Z95 * FIT.seSlope;
const CI_WIDTH = CI_HI - CI_LO;

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

// Floor spread across the 75 densified clustered shapes.
const measuredErrs = POINTS.map((p) => p.errClustered);
const FLOOR_SPREAD = Math.max(...measuredErrs) / Math.min(...measuredErrs);

// -- The imp-36132 37-point clustered baselines (imported live) --------------------------
const PRIOR_37_EXPONENT = PRIOR.fit.clusteredDensified.exponent; // ~0.532
const PRIOR_37_CI = PRIOR.fit.clusteredDensified.ci95; // ~[0.33, 0.73]
const PRIOR_37_CI_WIDTH = PRIOR_37_CI[1] - PRIOR_37_CI[0]; // ~0.40
const DEFAULT_ORDER_EXPONENT = PRIOR.fit.defaultOrderFull.exponent; // ~0.748

const EXPONENT_SHIFT_37_TO_75 = FIT.slope - PRIOR_37_EXPONENT; // ~+0.127

// -- RECONCILIATION: the shared 37 imp-36132 shapes must reproduce its clustered errors ---
const RECON = PRIOR.points.map((pp) => {
  const mine = POINTS.find((p) => p.shape === pp.shape);
  return {
    shape: pp.shape,
    treeDepth: pp.treeDepth,
    priorErr: pp.errClustered,
    recomputedErr: mine ? mine.errClustered : null,
    relErr: mine ? Math.abs(mine.errClustered - pp.errClustered) / pp.errClustered : Infinity,
  };
});
const RECONCILES = RECON.length === 37 && RECON.every((r) => r.recomputedErr !== null && r.relErr < 1e-9);

// -- Verdicts on the imp-36212 question --------------------------------------------------
const EXPONENT_DRIFTED_UP = FIT.slope > PRIOR_37_EXPONENT + 0.05; // continues to climb, not stabilize
const INTERVAL_TIGHTENED = CI_WIDTH < PRIOR_37_CI_WIDTH; // narrower nominal 95% interval
const INTERVAL_EXCLUDES_SQRT = CI_LO > 0.5; // tightening moved it AWAY from sqrt
const INTERVAL_EXCLUDES_LINEAR = CI_HI < 1; // still strictly sub-linear
const STAYS_BELOW_DEFAULT_ORDER = FIT.slope < DEFAULT_ORDER_EXPONENT; // clustered still flattens vs default
const SQRT_STILL_CLOSEST_NAMED = RSS_SQRT < RSS_LINEAR && RSS_SQRT < RSS_FLAT; // best of {0,0.5,1}
// The 37->75 shift is comparable in magnitude to the 7->37 shift ~0.115 (drift not converging).
const DRIFT_COMPARABLE_TO_PRIOR_STEP = EXPONENT_SHIFT_37_TO_75 > 0.08 && EXPONENT_SHIFT_37_TO_75 < 0.18;

export const IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT = {
  id: 'imp-36212',
  proofSection: 'S-frontier',
  question:
    'Densifying the imp-36132 CLUSTERED-order slack-vs-depth log-log fit a second time (37 -> 75 pairing ' +
    'trees, same depth axis 12..6095), does the depth-scaling exponent STABILIZE toward sqrt (0.5) with a ' +
    'tightening 95% interval, or does it CONTINUE to drift upward as the 7 -> 37 shift ~0.115 suggested? ' +
    'Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  method: {
    machinery:
      'regenerates the imp-35893 measurement (t_k = cos(alpha k + beta sqrt k)/sqrt k, k = 1..N ~ 488602; ' +
      'LEAF = 128; explicit-stack pairwise sumTree; association-invariant exact dyadic-BigInt reference)',
    termOrder: 'imp-35852 CLUSTERED same-sign runs (all negatives, then all positives) -- identical to imp-36132',
    densification:
      'a 75-shape family that is a strict SUPERSET of the imp-36081 37: + 24 interpolated skew fractions, ' +
      '+ catL{5,7,10,14,20,24,32,48}, + catR{3,6,12,16,24,32}; smallest skew held at 0.002 so the depth axis is unchanged',
    slackDefinition: 'slackClustered = (d * eps) / errClustered, eps = 2^-52 (identical to imp-36132)',
    regression: 'ordinary least squares of log10(slackClustered) on log10(treeDepth); slope = clustered depth-scaling exponent',
    confidence: 'slope standard error SE = sqrt(RSS_free/(n-2)/Sxx); nominal 95% interval = exponent +- 1.96 SE',
    dataPoints: POINTS.length,
    depthRange: [POINTS[0].treeDepth, POINTS[POINTS.length - 1].treeDepth],
    reconcilesSharedShapesToPrior: RECONCILES,
  },
  points: POINTS.map((p) => ({
    shape: p.shape,
    treeDepth: p.treeDepth,
    errClustered: p.errClustered,
    slackClustered: p.slackClustered,
    isSharedWith37: p.isShared,
  })),
  fit: {
    clustered75Shape: {
      exponent: FIT.slope,
      intercept: FIT.intercept,
      r2: FIT.r2,
      n: FIT.n,
      seSlope: FIT.seSlope,
      ci95: [CI_LO, CI_HI],
      ciWidth: CI_WIDTH,
    },
    prior37Shape: {
      exponent: PRIOR_37_EXPONENT, // imp-36132 ~0.532
      ci95: PRIOR_37_CI, // ~[0.33, 0.73]
      ciWidth: PRIOR_37_CI_WIDTH, // ~0.40
      source: 'imp-36132 37-shape clustered-order fit',
    },
    defaultOrderFull: {
      exponent: DEFAULT_ORDER_EXPONENT, // imp-36018 ~0.748
      source: 'imp-36018 default-order fit (via imp-36132)',
    },
    driftLadder: {
      sevenPoint: 0.417, // imp-36084
      thirtySeven: PRIOR_37_EXPONENT, // imp-36132 ~0.532
      seventyFive: FIT.slope, // ~0.659
      shift7to37: PRIOR_37_EXPONENT - 0.417, // ~+0.115
      shift37to75: EXPONENT_SHIFT_37_TO_75, // ~+0.127
    },
  },
  candidateLawRss: {
    flat: { exponent: 0, rss: RSS_FLAT, ratioToFree: RSS_FLAT / FIT.rssFree },
    sqrt: { exponent: 0.5, rss: RSS_SQRT, ratioToFree: RSS_SQRT / FIT.rssFree },
    linear: { exponent: 1, rss: RSS_LINEAR, ratioToFree: RSS_LINEAR / FIT.rssFree },
    free: { exponent: FIT.slope, rss: FIT.rssFree, ratioToFree: 1 },
  },
  diagnostics: {
    exponentShift37to75: EXPONENT_SHIFT_37_TO_75, // ~+0.127 (comparable to the 7->37 ~0.115; not converging)
    ciWidth75: CI_WIDTH, // ~0.29
    ciWidth37: PRIOR_37_CI_WIDTH, // ~0.40
    intervalTightened: INTERVAL_TIGHTENED,
    intervalExcludesSqrt: INTERVAL_EXCLUDES_SQRT, // the tightening moved it AWAY from 0.5
    intervalExcludesLinear: INTERVAL_EXCLUDES_LINEAR,
    floorSpreadFactor: FLOOR_SPREAD, // ~3600x (still NOT a strict depth-independent floor)
    r2Prior: PRIOR.fit.clusteredDensified.r2, // ~0.43
    r275: FIT.r2, // ~0.52
  },
  reconciliation: RECON,
  test: {
    clustered75ShapeExponent: FIT.slope,
    prior37Exponent: PRIOR_37_EXPONENT,
    exponentDriftedUp: EXPONENT_DRIFTED_UP,
    intervalTightened: INTERVAL_TIGHTENED,
    intervalExcludesSqrt: INTERVAL_EXCLUDES_SQRT,
    staysSubLinearBelowDefault: INTERVAL_EXCLUDES_LINEAR && STAYS_BELOW_DEFAULT_ORDER,
    sqrtStillClosestNamed: SQRT_STILL_CLOSEST_NAMED,
    verdict:
      'the clustered depth-scaling exponent does NOT stabilize at sqrt under the second densification -- it ' +
      'CONTINUES to drift upward: 37 -> 75 lifts it ~+0.127 (0.532 -> 0.659), essentially matching the 7 -> 37 ' +
      'shift ~+0.115, so across the ladder it climbs 0.417 -> 0.532 -> 0.659 in near-equal steps. The nominal ' +
      '95% interval DOES tighten (~0.40 -> ~0.29 wide) but AWAY from sqrt: at 75 shapes ~[0.51, 0.81] now ' +
      'marginally EXCLUDES 0.5 as well as 1.0. So the imp-36132 "sqrt-consistent" reading does NOT survive; ' +
      'what survives is the sub-linear (< 1) / below-default-order (~0.748) bracket, robust across all three sizes',
  },
  reading: {
    exponentKeepsDrifting:
      'the worry imp-36132 flagged is CONFIRMED: the exponent keeps climbing with sample size (0.417 -> 0.532 ' +
      '-> 0.659) in near-equal ~0.12 steps rather than converging to 0.5, so the clustered depth-scaling law is ' +
      'not a stable sqrt; no single exponent is pinned by these three sample sizes',
    intervalTightensAwayFromSqrt:
      'densification DOES narrow the nominal 95% interval (~0.40 -> ~0.29 wide, ~1.4x) and lifts R^2 ~0.43 -> ' +
      '~0.52, but the tightened interval ~[0.51, 0.81] EXCLUDES 0.5 at its lower edge -- the extra resolving ' +
      'power moves the estimate AWAY from sqrt, reversing the imp-36132 "interval contains 0.5" reading',
    sqrtStillClosestButNotIndistinguishable:
      'of the three named single-exponent laws SQRT stays the CLOSEST (RSS(0.5) ~1.06x the free minimum vs ' +
      'LINEAR ~1.28x and FLAT ~2.07x), but the free exponent now sits ~0.16 above 0.5, so sqrt is no longer ' +
      'statistically indistinguishable from the free fit as it was at 37 shapes',
    subLinearBracketSurvives:
      'the robust claim across 7 / 37 / 75 shapes is only the BRACKET: the clustered exponent stays strictly ' +
      'sub-linear (95% interval excludes 1.0; RSS(1) ~1.28x free) and below the default-order ~0.748 (though the ' +
      'gap has narrowed from ~0.22 to ~0.09) -- the clustered order flattens the slope but the precise value is unstable',
    confidenceFromCompositionNotScatter:
      'R^2 stays modest (~0.52) and the floor still spans ~3600x, and a log-log slope is composition-sensitive: ' +
      'the 75-shape family adds many shallow large-m caterpillars, so part of the upward drift is family ' +
      'reweighting, not a proven functional trend -- the fit stays a descriptive log-log slope',
  },
  conclusion: {
    exponentUnstableBracketRobust:
      'the clustered depth-scaling exponent is NOT a stable sqrt law -- it drifts upward under successive ' +
      'densification (0.417 -> 0.532 -> 0.659) and at 75 shapes the tightened 95% interval marginally excludes ' +
      '0.5; the only claim robust across all three sample sizes is the sub-linear (< 1) / below-default-order ' +
      '(~0.748) bracket, so the imp-36132 sqrt-consistency was itself a sample-size-dependent reading',
    precisionNotBinding:
      'whether the clustered exponent is 0.53 or 0.66, the a-priori depth bound still over-predicts the measured ' +
      'error by orders on every shape (floor spans only ~3600x while the depth axis spans ~500x); double ' +
      'precision leaves overwhelming strict headroom, precision is NOT binding',
    staysGreenfield:
      'this module regenerates the imp-35893 machinery under the clustered order and reconciles the shared 37 ' +
      'shapes to the imp-36132 clustered errors bit-for-bit; it evaluates no sum of H_t and verifies no ' +
      'inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (second-densification clustered-order depth-scaling-exponent regression, NOT a certified ' +
    'growth law). Regenerating the imp-35893 pairwise-summation machinery under the imp-35852 CLUSTERED ' +
    'same-sign term ORDER (fixed N ~ 488602 oscillatory multiset, LEAF = 128, exact BigInt reference -- the ' +
    'shared 37 imp-36132 shapes reproduce the clustered errors bit-for-bit) over a 75-shape superset of the ' +
    'imp-36081 family (depth 12..6095, axis unchanged), the clustered OLS depth-scaling exponent is ~0.659 ' +
    '(R^2 ~0.52), nominal 95% interval ~[0.51, 0.81]. So densification does NOT stabilize the exponent at ' +
    'sqrt: 37 -> 75 LIFTS it ~+0.127 (0.532 -> 0.659), essentially matching the 7 -> 37 shift ~+0.115, so the ' +
    'exponent climbs 0.417 -> 0.532 -> 0.659 in near-equal steps rather than converging to 0.5 -- confirming ' +
    'the drift worry imp-36132 flagged. The nominal 95% interval DOES tighten (~0.40 -> ~0.29 wide, ~1.4x) and ' +
    'R^2 improves (~0.43 -> ~0.52), but the tightening moves the interval AWAY from sqrt: it now marginally ' +
    'EXCLUDES 0.5 at its lower edge as well as excluding 1.0, reversing the imp-36132 "interval contains 0.5 / ' +
    'sqrt-consistent" reading. Of the three named laws SQRT stays the CLOSEST (RSS(0.5) ~1.06x free vs LINEAR ' +
    '~1.28x, FLAT ~2.07x) but the free exponent now sits ~0.16 above 0.5. What SURVIVES across all three sample ' +
    'sizes is only the bracket: the clustered exponent stays strictly sub-linear (interval excludes 1.0) and ' +
    'below the default-order ~0.748 (gap narrowed ~0.22 -> ~0.09). The floor still spans ~3600x and a log-log ' +
    'slope is composition-sensitive (the family adds many shallow caterpillars), so no stable single exponent ' +
    'is pinned -- only the sub-linear / below-default bracket. Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-36132 (37-shape clustered fit ~0.532 this densifies, reconciled bit-for-bit); imp-36084 (seven-point ' +
    'clustered fit ~0.417); imp-36081 (default-order densification; the 37-shape family this superset extends); ' +
    'imp-36020 (source clustered errors); imp-35852 (clustered worst term ORDER); imp-36039 (FLAT/SQRT/LINEAR ' +
    'candidate laws); imp-35893 (tree-SHAPE sweep, machinery mirrored here); Higham 2002, Sec. 4.2 (gamma_d ' +
    'pairwise bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT_ASSERTIONS = [
  {
    // The shared 37 imp-36132 shapes must reproduce the clustered errors bit-for-bit.
    id: 'imp36212-reconciles-shared-37-shapes',
    description: 'The 37 imp-36132 shapes recomputed in the 75-family match its clustered errors to <1e-9 rel',
    holds: () => RECONCILES === true && RECON.length === 37 && RECON.every((r) => r.recomputedErr !== null),
  },
  {
    // Densification generated a 75-shape sample on the SAME depth axis (superset, not extension).
    id: 'imp36212-densified-75-sample-same-axis',
    description: 'The fit uses 75 pairing trees spanning depth 12..6095 (the imp-36132 axis, unchanged)',
    holds: () =>
      POINTS.length === 75 &&
      POINTS.every((p) => p.treeDepth >= 1 && p.slackClustered > 0) &&
      Math.min(...POINTS.map((p) => p.treeDepth)) === 12 &&
      Math.max(...POINTS.map((p) => p.treeDepth)) === 6095 &&
      POINTS.filter((p) => p.isShared).length === 37,
  },
  {
    // The exponent CONTINUES to drift upward -- it does NOT stabilize at sqrt.
    id: 'imp36212-exponent-drifts-up-not-sqrt',
    description: 'The 75-shape clustered exponent is ~0.66 (in [0.60,0.72]), above the imp-36132 ~0.532 -- still drifting up',
    holds: () =>
      FIT.slope > 0.6 && FIT.slope < 0.72 &&
      EXPONENT_DRIFTED_UP === true &&
      FIT.slope > PRIOR_37_EXPONENT &&
      PRIOR_37_EXPONENT > 0.5 && PRIOR_37_EXPONENT < 0.56,
  },
  {
    // The 37->75 shift is comparable to the 7->37 shift ~0.115 (near-equal steps, not converging).
    id: 'imp36212-drift-step-comparable-to-prior',
    description: 'The 37->75 shift (~+0.127) is comparable to the 7->37 shift (~+0.115) -- near-equal steps, no convergence',
    holds: () =>
      DRIFT_COMPARABLE_TO_PRIOR_STEP === true &&
      EXPONENT_SHIFT_37_TO_75 > 0.08 && EXPONENT_SHIFT_37_TO_75 < 0.18,
  },
  {
    // The nominal 95% interval tightens but AWAY from sqrt: it now excludes 0.5.
    id: 'imp36212-interval-tightens-away-from-sqrt',
    description: 'The 95% interval narrows (~0.40 -> ~0.29 wide) but now EXCLUDES 0.5 at its lower edge (moved away from sqrt)',
    holds: () =>
      INTERVAL_TIGHTENED === true &&
      CI_WIDTH < 0.35 && CI_WIDTH < PRIOR_37_CI_WIDTH &&
      INTERVAL_EXCLUDES_SQRT === true && CI_LO > 0.5,
  },
  {
    // The sub-linear / below-default-order bracket SURVIVES (the only robust claim).
    id: 'imp36212-sublinear-below-default-survives',
    description: 'The 75-shape clustered exponent stays sub-linear (95% CI upper < 1) and below the default-order ~0.748',
    holds: () =>
      INTERVAL_EXCLUDES_LINEAR === true && CI_HI < 1 &&
      STAYS_BELOW_DEFAULT_ORDER === true &&
      DEFAULT_ORDER_EXPONENT > 0.7 && DEFAULT_ORDER_EXPONENT < 0.8,
  },
  {
    // SQRT stays the closest of {0,0.5,1} but the free exponent is no longer indistinguishable from it.
    id: 'imp36212-sqrt-closest-but-not-indistinguishable',
    description: 'SQRT stays the closest named law (RSS(0.5) < RSS(1) < RSS-flat) but RSS(0.5)/free > 1.03 (not a tie now)',
    holds: () =>
      SQRT_STILL_CLOSEST_NAMED === true &&
      RSS_SQRT / FIT.rssFree > 1.03 &&
      RSS_LINEAR / FIT.rssFree > RSS_SQRT / FIT.rssFree &&
      RSS_FLAT / FIT.rssFree > 1.5,
  },
  {
    // Confidence from sample/composition, not scatter: R^2 stays modest and the floor still spans wide.
    id: 'imp36212-confidence-from-composition-not-scatter',
    description: 'The clustered R^2 stays ~0.52 (in [0.4,0.6]) and the measured floor still spans >50x',
    holds: () => FIT.r2 > 0.4 && FIT.r2 < 0.6 && FLOOR_SPREAD > 50,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36212-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NOT a stable sqrt law/.test(IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT.conclusion.exponentUnstableBracketRobust) &&
      /GREENFIELD/.test(IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT.verdict),
  },
];

for (const a of IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36212-w1-pairwise-slack-depth-clustered-75shape-fit assertion failed: ${a.id}`);
  }
}

export default IMP36212_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_75SHAPE_FIT;
