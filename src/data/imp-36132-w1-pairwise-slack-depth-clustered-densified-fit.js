/**
 * @module imp-36132-w1-pairwise-slack-depth-clustered-densified-fit
 *
 * imp-36132 (numerical, S-frontier): DENSIFY the imp-36084 CLUSTERED-order slack-vs-depth
 * log-log fit beyond the seven imp-35893 caterpillar SHAPES (the analog of the imp-36081
 * DEFAULT-order densification), re-run the ordinary-least-squares depth-scaling fit, and PIN
 * whether the clustered depth-scaling EXPONENT ~0.417 is GENUINE or a seven-point /
 * same-depth-3817-outlier artifact.
 *
 * imp-36084 refit log10(slack) on log10(depth) under the imp-35852 CLUSTERED same-sign worst
 * term ORDER, but on only SEVEN shapes (from the imp-36020 clustered-order sweep, two sharing
 * depth 3817), and found a clustered depth-scaling exponent ~0.417 (R^2 ~0.44) -- FLATTER than
 * the default-order ~0.748 -- with the honest caveat that only seven data points support it and
 * the same-depth flip-driver caterpillarL (whose slack collapses ~1.2e4x under the hostile
 * order) carries outsized leverage (removing it lifted the seven-point exponent all the way to
 * ~0.617, a ~0.20 swing). imp-36081 supplied the DEFAULT-order densification (7 -> 37 trees) and
 * found the default exponent ESSENTIALLY UNCHANGED (~0.748 -> ~0.753, shift ~0.005) -- genuinely
 * sub-linear. This module supplies the missing CLUSTERED-order densification: it regenerates the
 * imp-35893 machinery, applies the imp-35852 clustered order, sweeps the identical imp-36081
 * THIRTY-SEVEN pairing-tree shapes (depth 12..4099), and re-fits.
 *
 * METHOD (measurement only): identical machinery to imp-35893 / imp-36081 (t_k = cos(alpha k +
 * beta sqrt k)/sqrt k, k = 1..N ~ 488602, LEAF = 128, explicit-stack pairwise sumTree,
 * association-invariant exact dyadic-BigInt reference), but the term array is reordered into the
 * imp-35852 CLUSTERED same-sign runs (all negatives, then all positives) exactly as imp-36020
 * does, so the seven ORIGINAL shapes reproduce the imp-36020 clustered errors bit-for-bit
 * (RECONCILIATION assertion below). slack = (d * eps) / errClustered, eps = 2^-52, identical to
 * imp-36084. The fitted OLS SLOPE is the clustered depth-scaling exponent; we report its
 * standard error SE and nominal 95% interval, the constrained-slope RSS at the imp-36039
 * candidate laws m in {0, 0.5, 1} (FLAT / SQRT / LINEAR), and -- as the artifact diagnostic --
 * the exponent shift from the imp-36084 seven-point ~0.417 and the caterpillarL-removal leverage
 * at both sample sizes.
 *
 * FINDING (measurement only): the PRECISE ~0.417 value WAS partly a thin-sample /
 * same-depth-outlier artifact, but the QUALITATIVE clustered reading is GENUINE. Densifying
 * 7 -> 37 clustered trees LIFTS the exponent from ~0.417 to ~0.532 (a shift of ~0.115, ~23x the
 * negligible ~0.005 shift the imp-36081 DEFAULT-order densification produced) -- so the exact
 * seven-point 0.417 was depressed by the outsized leverage of the single collapsed-slack
 * caterpillarL point at d = 3817: removing it lifted the SEVEN-point exponent ~0.20 (0.417 ->
 * 0.617), whereas in the 37-point fit removing that same point shifts the exponent only ~0.04
 * (0.532 -> 0.573), the leverage now diluted across many deep caterpillar/skew shapes. HOWEVER
 * the imp-36084 headline SURVIVES densification: the clustered exponent stays SUB-linear (nominal
 * 95% interval ~[0.33, 0.73], strictly below the linear value 1.0) and stays BELOW the
 * default-order ~0.748 -- the clustered order still FLATTENS the slope, it does NOT steepen it
 * toward d^1. And densification RESOLVES what neither the seven-point clustered fit nor the
 * imp-36039 seven-point adjudication could: the clustered exponent ~0.53 is statistically
 * consistent with the SQRT law (RSS(0.5) ~7.93 essentially equals the free minimum ~7.91; the
 * 95% interval CONTAINS 0.5) and INCONSISTENT with LINEAR (RSS(1) ~12.6, ~1.6x the free minimum;
 * the interval EXCLUDES 1.0) -- a cleaner sqrt-vs-linear separation than the default-order tie,
 * because the clustered exponent sits much nearer sqrt than the 0.5/1.0 midpoint. The R^2 does
 * NOT improve (~0.44) and the floor still spans ~3600x, so the confidence is from sample n, not
 * tighter scatter. CONCLUSION: the imp-36084 exponent's precise ~0.417 was a small-sample
 * artifact (true densified ~0.53), but its central claim -- the clustered order FLATTENS the
 * depth-scaling exponent below both the linear value 1 and the default-order ~0.75 -- is GENUINE
 * and survives 5x densification; the densified fit additionally pins the clustered law as
 * sub-linear and sqrt-consistent. Precision stays NON-binding.
 *
 * HONEST CAVEATS: the 95% interval is the standard OLS-slope nominal interval (assumes iid
 * Gaussian log-residuals); here the residuals are FLOOR-SCATTER driven, so "excludes 1.0 /
 * contains 0.5" is a DESCRIPTIVE narrowed-interval statement, NOT a certified hypothesis test or
 * a certified growth law. The clustered-order R^2 ~0.44 stays weaker than the default-order fit
 * -- under the hostile order the slack is even less a clean function of depth. The exponent
 * remains a log-log slope, not a proven power law.
 *
 * MEASUREMENT / REGRESSION regenerating the imp-35893 machinery under the imp-35852 clustered
 * order on the imp-36081 37-shape family and reconciling the seven original shapes to the
 * imp-36020 clustered literals. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity; C_mb
 * GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36084-w1-pairwise-slack-depth-clustered-order-refit (seven-point clustered fit ~0.417 this densifies)
 * @see imp-36081-w1-pairwise-slack-depth-densified-fit (the DEFAULT-order densification this mirrors under the hostile order)
 * @see imp-36020-w1-clustered-order-shape-argmax (source: seven-shape clustered errors reconciled here bit-for-bit)
 * @see imp-35852-w1-summation-adversarial-ordering (the clustered worst term ORDER)
 * @see imp-36039-w1-pairwise-slack-depth-law-adjudication (FLAT/SQRT/LINEAR; sqrt-vs-linear a seven-point tie)
 */

import { IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX } from './imp-36020-w1-clustered-order-shape-argmax.js';
import { IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT } from './imp-36084-w1-pairwise-slack-depth-clustered-order-refit.js';

const REFIT = IMP36084_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_ORDER_REFIT;
const CLUSTERED_7 = IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX;
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this regression

// -- Anchor + operative constants (import-light; identical to imp-35893 / imp-36081 / imp-36020) -
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

// -- Densified pairing-tree shape set (37 shapes, depth 12..4099) -- IDENTICAL to imp-36081 ----
// Splitter families: balanced midpoint; skew-fraction split; left/right caterpillar peeling m
// leaf blocks per level. catL1 == imp-36020 caterpillarL, catR1 == imp-36020 caterpillarR.
const skewSplit = (f) => (lo, hi) => lo + Math.floor((hi - lo) * f);
const catBlocksL = (m) => (lo, hi, leaf) => lo + m * leaf;
const catBlocksR = (m) => (lo, hi, leaf) => hi - m * leaf;

const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1, 'balanced(0.5)'], // third element: matching imp-36020 original name (or null)
  ...[0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.12, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.025, 0.02, 0.015, 0.012, 0.01, 0.008, 0.006, 0.005, 0.004, 0.003, 0.002].map(
    (f) => {
      const orig = { 0.25: 'skew0.25', 0.1: 'skew0.1', 0.03: 'skew0.03', 0.01: 'skew0.01' }[f] || null;
      return [`skew${f}`, skewSplit(f), orig];
    },
  ),
  ...[1, 2, 3, 4, 6, 8, 12, 16].map((m) => [`catL${m}`, catBlocksL(m), m === 1 ? 'caterpillarL' : null]),
  ...[1, 2, 4, 8].map((m) => [`catR${m}`, catBlocksR(m), m === 1 ? 'caterpillarR' : null]),
];

// -- Run pairwise on every tree shape under the CLUSTERED order against the shared reference ----
const POINTS = TREE_SHAPES.map(([name, splitter, originalName]) => {
  const { sum, maxDepth } = sumTree(CLUSTERED_TERMS, splitter, LEAF);
  const errClustered = normalizedError(sum, _trueNum, _sumAbs);
  const slackClustered = (maxDepth * EPS_DOUBLE) / errClustered;
  return {
    shape: name,
    treeDepth: maxDepth,
    errClustered,
    slackClustered,
    originalName, // the imp-36020 name if this is one of the seven originals, else null
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

// -- Artifact diagnostic: caterpillarL-removal leverage at BOTH sample sizes -------------
// In the densified fit remove catL1 (== imp-36020 caterpillarL, the same-depth-3817 flip driver).
const POINTS_NO_L = POINTS.filter((p) => p.shape !== 'catL1');
const NO_L_FIT = ols(POINTS_NO_L.map((p) => p.logDepth), POINTS_NO_L.map((p) => p.logSlack));

// The imp-36084 seven-point clustered baselines (imported live).
const SEVEN_POINT_EXPONENT = REFIT.fit.clusteredFull.exponent; // ~0.417
const SEVEN_POINT_NO_L_EXPONENT = REFIT.fit.clusteredExcludingSameDepthCaterpillarL.exponent; // ~0.617
const DEFAULT_ORDER_EXPONENT = REFIT.fit.defaultOrderFull.exponent; // ~0.748 (imp-36018)

// caterpillarL-removal leverage: how much the exponent moves when the flip driver is removed.
const SEVEN_POINT_CATL_LEVERAGE = SEVEN_POINT_NO_L_EXPONENT - SEVEN_POINT_EXPONENT; // ~+0.20 (huge)
const DENSIFIED_CATL_LEVERAGE = NO_L_FIT.slope - FIT.slope; // ~+0.04 (diluted)
const EXPONENT_SHIFT_FROM_SEVEN_POINT = FIT.slope - SEVEN_POINT_EXPONENT; // ~+0.115

// Floor spread across the 37 densified clustered shapes.
const measuredErrs = POINTS.map((p) => p.errClustered);
const FLOOR_SPREAD = Math.max(...measuredErrs) / Math.min(...measuredErrs);

// RECONCILIATION: the seven imp-36020 original shapes must reproduce the clustered errors here.
const RECON = CLUSTERED_7.shapes.map((sp) => {
  const mine = POINTS.find((p) => p.originalName === sp.shape);
  return {
    shape: sp.shape,
    treeDepth: sp.treeDepth,
    publishedErr: sp.combinedNormErr,
    recomputedErr: mine ? mine.errClustered : null,
    relErr: mine ? Math.abs(mine.errClustered - sp.combinedNormErr) / sp.combinedNormErr : Infinity,
  };
});
const RECONCILES = RECON.every((r) => r.relErr < 1e-9);

// Verdicts on the imp-36132 question.
const DENSIFIED_EXCLUDES_LINEAR = CI_HI < 1; // clustered exponent stays SUB-linear
const DENSIFIED_CONTAINS_SQRT = CI_LO < 0.5 && CI_HI > 0.5; // consistent with sqrt
const STAYS_BELOW_DEFAULT_ORDER = FIT.slope < DEFAULT_ORDER_EXPONENT; // clustered still flattens vs default
// The precise 0.417 was thin-sample-sensitive if the densified shift dwarfs the imp-36081 default ~0.005.
const PRECISE_VALUE_WAS_THIN_SAMPLE_ARTIFACT = Math.abs(EXPONENT_SHIFT_FROM_SEVEN_POINT) > 0.05;
// But the leverage the seven-point fit gave the flip driver is DILUTED by densification.
const CATL_LEVERAGE_DILUTED = Math.abs(DENSIFIED_CATL_LEVERAGE) < Math.abs(SEVEN_POINT_CATL_LEVERAGE);

export const IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT = {
  id: 'imp-36132',
  proofSection: 'S-frontier',
  question:
    'Densifying the imp-36084 CLUSTERED-order slack-vs-depth log-log fit beyond the seven imp-35893 shapes ' +
    '(the analog of the imp-36081 default-order densification) to 37 pairing trees, is the clustered ' +
    'depth-scaling exponent ~0.417 GENUINE or a seven-point / same-depth-3817-outlier artifact? Measurement ' +
    'only; certifies no W1 bound; changes no bound; NO QED.',
  method: {
    machinery:
      'regenerates the imp-35893 measurement (t_k = cos(alpha k + beta sqrt k)/sqrt k, k = 1..N ~ 488602; ' +
      'LEAF = 128; explicit-stack pairwise sumTree; association-invariant exact dyadic-BigInt reference)',
    termOrder: 'imp-35852 CLUSTERED same-sign runs (all negatives, then all positives) -- identical to imp-36020',
    densification:
      'the IDENTICAL imp-36081 37-shape family: balanced midpoint + 24 skew-fraction splits (f = 0.4..0.002) + ' +
      'left/right caterpillars peeling m leaf blocks (catL m = 1,2,3,4,6,8,12,16; catR m = 1,2,4,8)',
    slackDefinition: 'slackClustered = (d * eps) / errClustered, eps = 2^-52 (identical to imp-36084)',
    regression: 'ordinary least squares of log10(slackClustered) on log10(treeDepth); slope = clustered depth-scaling exponent',
    confidence: 'slope standard error SE = sqrt(RSS_free/(n-2)/Sxx); nominal 95% interval = exponent +- 1.96 SE',
    dataPoints: POINTS.length,
    depthRange: [POINTS[0].treeDepth, POINTS[POINTS.length - 1].treeDepth],
    reconcilesSevenOriginalShapes: RECONCILES,
  },
  points: POINTS.map((p) => ({
    shape: p.shape,
    treeDepth: p.treeDepth,
    errClustered: p.errClustered,
    slackClustered: p.slackClustered,
    isOriginalShape: p.originalName !== null,
  })),
  fit: {
    clusteredDensified: {
      exponent: FIT.slope,
      intercept: FIT.intercept,
      r2: FIT.r2,
      n: FIT.n,
      seSlope: FIT.seSlope,
      ci95: [CI_LO, CI_HI],
    },
    clusteredDensifiedExcludingCaterpillarL: {
      exponent: NO_L_FIT.slope,
      r2: NO_L_FIT.r2,
      n: NO_L_FIT.n,
    },
    sevenPointClusteredBaseline: {
      exponent: SEVEN_POINT_EXPONENT, // imp-36084 ~0.417
      excludingCaterpillarL: SEVEN_POINT_NO_L_EXPONENT, // imp-36084 ~0.617
      source: 'imp-36084 seven-point clustered-order fit',
    },
    defaultOrderFull: {
      exponent: DEFAULT_ORDER_EXPONENT, // imp-36018 ~0.748
      source: 'imp-36018 default-order seven-point fit (via imp-36084)',
    },
  },
  candidateLawRss: {
    flat: { exponent: 0, rss: RSS_FLAT, ratioToFree: RSS_FLAT / FIT.rssFree },
    sqrt: { exponent: 0.5, rss: RSS_SQRT, ratioToFree: RSS_SQRT / FIT.rssFree },
    linear: { exponent: 1, rss: RSS_LINEAR, ratioToFree: RSS_LINEAR / FIT.rssFree },
    free: { exponent: FIT.slope, rss: FIT.rssFree, ratioToFree: 1 },
  },
  diagnostics: {
    exponentShiftFromSevenPoint: EXPONENT_SHIFT_FROM_SEVEN_POINT, // ~+0.115 (dwarfs imp-36081 default ~0.005)
    sevenPointCaterpillarLLeverage: SEVEN_POINT_CATL_LEVERAGE, // ~+0.20 (single-point leverage in the thin fit)
    densifiedCaterpillarLLeverage: DENSIFIED_CATL_LEVERAGE, // ~+0.04 (diluted across many deep shapes)
    caterpillarLLeverageDiluted: CATL_LEVERAGE_DILUTED,
    floorSpreadFactor: FLOOR_SPREAD, // ~3600x (still NOT a strict depth-independent floor)
    ciWidthDensified: CI_HI - CI_LO,
  },
  reconciliation: RECON,
  test: {
    clusteredDensifiedExponent: FIT.slope,
    sevenPointExponent: SEVEN_POINT_EXPONENT,
    preciseValueWasThinSampleArtifact: PRECISE_VALUE_WAS_THIN_SAMPLE_ARTIFACT,
    caterpillarLLeverageDiluted: CATL_LEVERAGE_DILUTED,
    staysSubLinearBelowDefault: DENSIFIED_EXCLUDES_LINEAR && STAYS_BELOW_DEFAULT_ORDER,
    consistentWithSqrt: DENSIFIED_CONTAINS_SQRT,
    verdict:
      'the PRECISE ~0.417 was partly a seven-point / same-depth-3817-outlier artifact: densifying 7 -> 37 ' +
      'clustered trees LIFTS the exponent to ~0.532 (shift ~0.115, ~23x the imp-36081 default-order ~0.005), ' +
      'because the single collapsed-slack caterpillarL point that swung the seven-point exponent ~0.20 on ' +
      'removal now moves it only ~0.04. BUT the imp-36084 headline SURVIVES: the clustered exponent stays ' +
      'sub-linear (95% interval ~[0.33,0.73] excludes 1.0) and below the default-order ~0.748; densification ' +
      'additionally RESOLVES it as sqrt-consistent (RSS(0.5) essentially equals the free minimum) and ' +
      'linear-inconsistent',
  },
  reading: {
    preciseValueThinSample:
      'the exact seven-point ~0.417 was depressed by the outsized leverage of the single collapsed-slack ' +
      'caterpillarL point at d = 3817 (imp-36084 noted its slack collapses ~1.2e4x under the hostile order); ' +
      'densifying to 37 trees lifts the exponent ~0.115 to ~0.532, ~23x the imp-36081 default-order shift ~0.005',
    leverageDiluted:
      'removing caterpillarL swung the SEVEN-point clustered exponent ~+0.20 (0.417 -> 0.617) but shifts the ' +
      '37-point exponent only ~+0.04 (0.532 -> 0.573): the same-depth flip-driver leverage the imp-36084 caveat ' +
      'flagged is DILUTED across many deep caterpillar/skew shapes, confirming the same-depth-outlier sensitivity',
    qualitativeReadingSurvives:
      'the imp-36084 central claim is GENUINE: the clustered order FLATTENS the depth-scaling exponent below both ' +
      'the linear value 1.0 (95% interval upper ~0.73) and the default-order ~0.748 -- it does NOT steepen toward d^1',
    densificationResolvesTheLaw:
      'densification pins what the seven-point clustered fit and the imp-36039 seven-point adjudication could not: ' +
      'the clustered exponent ~0.53 is sqrt-consistent (RSS(0.5) ~7.93 essentially equals the free minimum ~7.91; ' +
      'the 95% interval contains 0.5) and linear-inconsistent (RSS(1) ~12.6, ~1.6x free; interval excludes 1.0)',
    confidenceFromSampleNotScatter:
      'the clustered-order R^2 does NOT improve (~0.44) and the floor still spans ~3600x, so the resolving power ' +
      'is from the larger sample n = 37, not tighter per-point scatter; the fit stays a descriptive log-log slope',
  },
  conclusion: {
    preciseValueArtifactHeadlineGenuine:
      'the imp-36084 clustered exponent PRECISE ~0.417 value was partly a seven-point / same-depth-3817-outlier ' +
      'artifact (densified ~0.532), but its central finding -- the clustered order FLATTENS the depth-scaling ' +
      'exponent below both linear (1.0) and the default-order (~0.748) -- is GENUINE and survives 5x densification',
    precisionNotBinding:
      'whether the clustered exponent is 0.42 or 0.53, the a-priori depth bound still over-predicts the measured ' +
      'error by orders on every shape (imp-36084 ~2.7 orders even at the tightened caterpillarL); double precision ' +
      'leaves overwhelming strict headroom, precision is NOT binding',
    staysGreenfield:
      'this module regenerates the imp-35893 machinery under the clustered order and reconciles the seven original ' +
      'shapes to the imp-36020 literals; it evaluates no sum of H_t and verifies no inequality, so the W1 ' +
      'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (densified clustered-order depth-scaling-exponent regression, NOT a certified growth law). ' +
    'Regenerating the imp-35893 pairwise-summation machinery under the imp-35852 CLUSTERED same-sign term ORDER ' +
    '(fixed N ~ 488602 oscillatory multiset, LEAF = 128, exact BigInt reference -- the seven imp-36020 original ' +
    'shapes reproduce the clustered errors bit-for-bit) and sweeping the identical imp-36081 37-shape family ' +
    '(depth 12..4099), the clustered OLS depth-scaling exponent is ~0.532 (R^2 ~0.44), with a nominal 95% ' +
    'interval ~[0.33, 0.73]. So the imp-36084 seven-point ~0.417 was partly a thin-sample / same-depth-outlier ' +
    'artifact: densifying 7 -> 37 clustered trees LIFTS the exponent ~0.115 (~23x the imp-36081 default-order ' +
    'densification shift ~0.005), because the single collapsed-slack caterpillarL point at d = 3817 that swung ' +
    'the seven-point exponent ~0.20 on removal (0.417 -> 0.617) now moves the 37-point exponent only ~0.04 ' +
    '(0.532 -> 0.573) -- its leverage diluted across many deep shapes. YET the imp-36084 headline SURVIVES: the ' +
    'clustered exponent stays sub-linear (95% interval excludes the linear value 1.0) and stays BELOW the ' +
    'default-order ~0.748, so the clustered order still FLATTENS the slope rather than steepening it toward d^1. ' +
    'And densification RESOLVES the law where the seven-point fit and imp-36039 could not: the clustered exponent ' +
    '~0.53 is sqrt-consistent (RSS(0.5) ~7.93 essentially equals the free minimum ~7.91; the interval contains ' +
    '0.5) and linear-inconsistent (RSS(1) ~12.6, ~1.6x free; the interval excludes 1.0). The R^2 does not improve ' +
    '(~0.44) and the floor still spans ~3600x, so the resolving power is from the larger sample, not tighter ' +
    'scatter. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; ' +
    'changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36084 (seven-point clustered fit ~0.417 this densifies); imp-36081 (default-order densification this ' +
    'mirrors, shift ~0.005); imp-36020 (source seven-shape clustered errors, reconciled bit-for-bit); imp-35852 ' +
    '(clustered worst term ORDER); imp-36039 (FLAT/SQRT/LINEAR adjudication, sqrt-vs-linear tie on 7 points); ' +
    'imp-35893 (tree-SHAPE sweep, machinery mirrored here); Higham 2002, Sec. 4.2 (gamma_d pairwise bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT_ASSERTIONS = [
  {
    // The seven imp-36020 original shapes must reproduce the clustered errors bit-for-bit.
    id: 'imp36132-reconciles-seven-clustered-shapes',
    description: 'The seven imp-36020 original shapes recomputed under the clustered order match its errors to <1e-9 rel',
    holds: () => RECONCILES === true && RECON.length === 7 && RECON.every((r) => r.recomputedErr !== null),
  },
  {
    // Densification generated a substantially larger clustered sample over the same depth axis and beyond.
    id: 'imp36132-densified-sample',
    description: 'The densified clustered fit uses >= 30 pairing trees spanning depth 12..>=3817 (vs the seven of imp-36084)',
    holds: () =>
      POINTS.length >= 30 &&
      POINTS.every((p) => p.treeDepth >= 1 && p.slackClustered > 0) &&
      Math.min(...POINTS.map((p) => p.treeDepth)) === 12 &&
      Math.max(...POINTS.map((p) => p.treeDepth)) >= 3817,
  },
  {
    // The densified clustered exponent is ~0.53 -- sub-linear, and LIFTED above the seven-point ~0.417.
    id: 'imp36132-densified-exponent-lifted-sub-linear',
    description: 'The densified clustered exponent is ~0.53 (in [0.45,0.62]), sub-linear, and above the seven-point ~0.417',
    holds: () =>
      FIT.slope > 0.45 && FIT.slope < 0.62 && FIT.slope < 1 &&
      FIT.slope > SEVEN_POINT_EXPONENT &&
      SEVEN_POINT_EXPONENT > 0.38 && SEVEN_POINT_EXPONENT < 0.46,
  },
  {
    // The precise 0.417 was a thin-sample artifact: the densified shift dwarfs the imp-36081 default ~0.005.
    id: 'imp36132-precise-value-thin-sample-artifact',
    description: 'Densification shifts the clustered exponent >0.05 (~0.115), vs the negligible imp-36081 default ~0.005',
    holds: () =>
      PRECISE_VALUE_WAS_THIN_SAMPLE_ARTIFACT === true &&
      EXPONENT_SHIFT_FROM_SEVEN_POINT > 0.05 &&
      EXPONENT_SHIFT_FROM_SEVEN_POINT < 0.2,
  },
  {
    // The same-depth caterpillarL leverage the imp-36084 caveat flagged is DILUTED by densification.
    id: 'imp36132-caterpillarL-leverage-diluted',
    description: 'Removing caterpillarL swung the 7-point exponent ~0.20 but the 37-point exponent only ~0.04 (leverage diluted)',
    holds: () =>
      CATL_LEVERAGE_DILUTED === true &&
      Math.abs(DENSIFIED_CATL_LEVERAGE) < 0.12 &&
      Math.abs(SEVEN_POINT_CATL_LEVERAGE) > 0.15 &&
      NO_L_FIT.n === 36,
  },
  {
    // The imp-36084 headline SURVIVES: sub-linear (CI excludes 1.0) and still below the default-order ~0.748.
    id: 'imp36132-headline-survives-flatter-than-default',
    description: 'The densified clustered exponent stays sub-linear (95% CI upper < 1) and below the default-order ~0.748',
    holds: () =>
      DENSIFIED_EXCLUDES_LINEAR === true &&
      CI_HI < 1 &&
      STAYS_BELOW_DEFAULT_ORDER === true &&
      DEFAULT_ORDER_EXPONENT > 0.7 && DEFAULT_ORDER_EXPONENT < 0.8,
  },
  {
    // Densification RESOLVES the law: sqrt-consistent (RSS(0.5) ~= free; CI contains 0.5), linear-inconsistent.
    id: 'imp36132-resolves-sqrt-not-linear',
    description: 'Densified clustered fit is sqrt-consistent (RSS(0.5) within ~5% of free; CI contains 0.5) and linear-rejected',
    holds: () =>
      RSS_SQRT / FIT.rssFree < 1.05 &&
      RSS_LINEAR / FIT.rssFree > 1.4 &&
      RSS_FLAT / FIT.rssFree > 1.4 &&
      DENSIFIED_CONTAINS_SQRT === true,
  },
  {
    // Confidence from sample, not scatter: R^2 stays ~0.44 and the floor still spans wide.
    id: 'imp36132-confidence-from-sample-not-scatter',
    description: 'The clustered R^2 stays ~0.44 (does not improve) and the measured floor still spans >50x',
    holds: () => FIT.r2 > 0.3 && FIT.r2 < 0.55 && FLOOR_SPREAD > 50,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36132-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GENUINE/.test(IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT.conclusion.preciseValueArtifactHeadlineGenuine) &&
      /GREENFIELD/.test(IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT.verdict),
  },
];

for (const a of IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36132-w1-pairwise-slack-depth-clustered-densified-fit assertion failed: ${a.id}`);
  }
}

export default IMP36132_W1_PAIRWISE_SLACK_DEPTH_CLUSTERED_DENSIFIED_FIT;
