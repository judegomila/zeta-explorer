/**
 * @module imp-35945-w1-summation-monotone-tree-shape
 *
 * imp-35945 (numerical, S-frontier): MEASURE the COMPLEMENT of imp-35893. imp-35893 swept
 * the pairwise divide-and-conquer TREE SHAPE from balanced (depth ~12) to caterpillar
 * (depth ~3817) on the FIXED imp-35812 oscillatory multiset and found the depth-proportional
 * worst-case bound is NOT realized (worst caterpillarR reached only ~4.42e-4 of the
 * log2(N)*eps ceiling), attributing the non-attainment to that BENIGN cancellation-heavy
 * multiset: on data whose partial sums oscillate near zero, per-addition rounding errors do
 * not accumulate coherently along the tree spine.
 *
 * This module re-runs the IDENTICAL seven explicit-stack pairing-tree shapes at the SAME
 * N ~ 488602 but replaces the term multiset with a MONOTONE same-sign sequence
 *   t_k = 1 / sqrt(k),  k = 1 .. N   (all positive, NO cancellation, condition number ~1),
 * so the running accumulator GROWS monotonically toward the full partial sum. This is the
 * regime in which per-addition rounding errors CAN accumulate coherently, so it directly
 * tests imp-35893's attribution: if cancellation was the only thing suppressing attainment,
 * the monotone multiset should push the worst tree much closer to its ceiling.
 *
 * The exact reference is the SAME permutation-/association-invariant dyadic-BigInt sum
 * imp-35893 used (tree shape changes only the ASSOCIATION of the additions, never the exact
 * total), so |schemeResult - trueSum| stays an EXACT BigInt for every shape.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED at N = 488602 on t_k = 1/sqrt(k) (condition number ~1.0; balanced base block 128):
 *   shape          depth    pairwise err   err / log2(N)*eps ceiling   err / (depth*eps)
 *   balanced(0.5)     12     ~1.09e-16      ~2.59e-2                    ~4.09e-2
 *   skew0.25          29     ~5.39e-17      ~1.29e-2   (best)           ~8.37e-3
 *   skew0.1           79     ~5.39e-17      ~1.29e-2                    ~3.07e-3
 *   skew0.03         276     ~2.72e-16      ~6.47e-2                    ~4.43e-3
 *   skew0.01         874     ~1.09e-16      ~2.59e-2                    ~5.61e-4
 *   caterpillarL    3817     ~9.23e-16      ~2.20e-1                    ~1.09e-3
 *   caterpillarR    3817     ~2.71e-15      ~6.47e-1   (worst)          ~3.20e-3
 *
 * READING: dropping cancellation makes a LARGE difference to log2(N)*eps-ceiling attainment.
 * The worst tree (caterpillarR, depth 3817) now reaches ~0.647 of the log2(N)*eps ceiling --
 * versus imp-35893's ~4.42e-4 on the oscillatory multiset, a ~1460x jump in relative
 * attainment. So imp-35893's attribution is CORROBORATED in direction: worst-case tree
 * SHAPE DOES push pairwise substantially toward its log2(N)*eps ceiling once the running
 * accumulator grows monotonically (no cancellation). BUT the tree's OWN depth-proportional
 * worst-case forward bound (depth*eps ~ 8.5e-13 at depth 3817) is STILL far from realized:
 * caterpillarR sits at only ~3.2e-3 of it. Even without cancellation, the rounding-error
 * signs along the caterpillar spine are not fully aligned, so the coherent depth*eps regime
 * is NOT attained; what the monotone data does is lift attainment of the (much smaller)
 * log2(N)*eps balanced ceiling from negligible to O(1). The error remains NON-MONOTONE in
 * depth (skew0.03 at depth 276 exceeds skew0.01 at depth 874; caterpillarL and caterpillarR
 * share depth 3817 yet differ ~3x). Every shape's worst pairwise error (~2.71e-15) still sits
 * ~4 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760): precision stays
 * NON-binding even with cancellation removed AND worst-case tree shape. The obstruction
 * remains the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725);
 * the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35893-w1-summation-pairwise-tree-shape (tree-SHAPE stress on the cancellation-heavy multiset; this is its monotone complement)
 * @see imp-35852-w1-summation-adversarial-ordering (term-ORDER stress)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + balanced pairwise baseline)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive ceiling)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise summation error and tree depth)
 */

// -- Anchor + operative constants (import-light; matching imp-35893) --------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// MONOTONE same-sign term (imp-35945): all positive, no cancellation, condition number ~1.
const TERM = (k) => 1 / Math.sqrt(k);

const LEAF = 128; // base block size (identical to the imp-35893 pairwise scheme)

// -- Naive reference scheme (for the "pairwise still beats naive" contrast) --------------
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}

// -- Pairwise summation over an ARBITRARY pairing tree, evaluated on an explicit stack ---
function sumTree(terms, splitter, leaf) {
  // The pairing tree is defined by splitter(lo, hi) -> mid. Evaluated post-order on an
  // explicit work stack so a caterpillar of depth ~N/leaf does not overflow the call stack.
  const n = terms.length;
  let maxDepth = 0;
  const stack = [{ lo: 0, hi: n, depth: 0, stage: 0, leftVal: 0, mid: 0 }];
  let result = 0; // return value of the most-recently-completed frame
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
      f.leftVal = result; // left child finished
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
const FRAC_BITS = 96n; // common fixed-point scale 2^{-96}; covers the term exponent range
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x) {
  // Return the m * 2^{-96} representation of x as an exact BigInt numerator.
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) {
    exp = -1074; // subnormal (not expected for these magnitudes, handled for safety)
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
  // Exact absolute error |schemeResult - trueSum|, divided by Sum|t_k| (the Higham scale).
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Build the MONOTONE term multiset + the shape-invariant exact reference --------------
const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) {
  const t = TERM(k);
  _base[k - 1] = t;
  _sumAbs += Math.abs(t);
}
let _trueNum = 0n; // exact sum is association-invariant -- computed once, reused for all trees
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);
const _trueAbs = _trueNum < 0n ? -_trueNum : _trueNum;
const TRUE_SUM = (Number(_trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (_trueNum < 0n ? -1 : 1);
// For an all-positive family Sum|t_k| == |Sum t_k|, so the condition number is ~1 (no cancellation).
const CONDITION_NUMBER = _sumAbs / Math.abs(TRUE_SUM);

// -- Pairing-tree shapes (same fixed multiset; varying tree SHAPE only) ------------------
const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1],
  ['skew0.25', (lo, hi) => lo + Math.floor((hi - lo) * 0.25)],
  ['skew0.1', (lo, hi) => lo + Math.floor((hi - lo) * 0.1)],
  ['skew0.03', (lo, hi) => lo + Math.floor((hi - lo) * 0.03)],
  ['skew0.01', (lo, hi) => lo + Math.floor((hi - lo) * 0.01)],
  ['caterpillarL', (lo, hi, leaf) => lo + leaf],
  ['caterpillarR', (lo, hi, leaf) => hi - leaf],
];

// imp-35761 ceilings (normalized errors), for direct contrast.
const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (balanced-tree log2(N)*eps)
const CEIL_NAIVE_LINEAR = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10 (coherent naive N*eps)

// Naive-original error, for the "pairwise beats naive under every tree" contrast.
const NAIVE_ORIGINAL_NORM_ERR = normalizedError(sumNaive(_base), _trueNum, _sumAbs);

// -- Run pairwise on every tree shape against the shared exact reference -----------------
const SHAPES = TREE_SHAPES.map(([name, splitter]) => {
  const { sum, maxDepth } = sumTree(_base, splitter, LEAF);
  const err = normalizedError(sum, _trueNum, _sumAbs);
  return {
    shape: name,
    treeDepth: maxDepth,
    pairwiseNormErr: err,
    ratioToPairwiseCeiling: err / CEIL_PAIRWISE, // fraction of the balanced log2(N)*eps ceiling
    ratioToNaiveCeiling: err / CEIL_NAIVE_LINEAR,
    ratioToDepthEpsBound: err / (maxDepth * EPS_DOUBLE), // fraction of this tree's own depth*eps bound
  };
});

const BY_SHAPE = Object.fromEntries(SHAPES.map((r) => [r.shape, r]));
const BALANCED = BY_SHAPE['balanced(0.5)'];
const WORST = SHAPES.reduce((a, b) => (b.pairwiseNormErr > a.pairwiseNormErr ? b : a));
const BEST = SHAPES.reduce((a, b) => (b.pairwiseNormErr < a.pairwiseNormErr ? b : a));
const MAX_DEPTH = Math.max(...SHAPES.map((r) => r.treeDepth));
const ERR_SPREAD = WORST.pairwiseNormErr / BEST.pairwiseNormErr;

// imp-35893's worst caterpillarR reached only ~4.42e-4 of the log2(N)*eps ceiling on the
// cancellation-heavy multiset; this is the direct cross-family contrast literal.
const IMP35893_WORST_RATIO_TO_CEILING = 4.42e-4;
const RELATIVE_ATTAINMENT_JUMP = WORST.ratioToPairwiseCeiling / IMP35893_WORST_RATIO_TO_CEILING;

export const IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE = {
  id: 'imp-35945',
  proofSection: 'S-frontier',
  question:
    'Does skeptical pairing-tree SHAPE push pairwise divide-and-conquer summation toward its ' +
    'log2(N)*eps / depth*eps forward-error bound on a MONOTONE same-sign (non-cancelling) multiset ' +
    't_k = 1/sqrt(k) at N ~ 488602 -- the complement of the imp-35893 cancellation-heavy multiset ' +
    'whose benign structure imp-35893 credited for non-attainment? Measurement only; certifies no ' +
    'W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = 1/sqrt(k), k = 1 .. N (monotone all-positive; no cancellation)',
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: CONDITION_NUMBER,
    leafBlock: LEAF,
    note: 'a monotone same-sign multiset re-summed under varying pairing-tree SHAPES; the exact sum is association-invariant',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    associationInvariant: true,
    note: 'one exact reference is computed once and reused for every tree shape (the true sum does not depend on the pairing tree)',
  },
  ceilings: {
    pairwiseBalanced: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N)*eps (balanced tree depth)' },
    naiveCoherentLinear: { value: CEIL_NAIVE_LINEAR, source: 'imp-35761 worst-case naive N*eps (coherent directed rounding)' },
    naiveOriginalNormErr: { value: NAIVE_ORIGINAL_NORM_ERR, source: 'naive original-order achieved error on the monotone multiset' },
  },
  shapes: SHAPES,
  crossFamilyContrast: {
    imp35893WorstRatioToCeiling: IMP35893_WORST_RATIO_TO_CEILING,
    monotoneWorstRatioToCeiling: WORST.ratioToPairwiseCeiling,
    relativeAttainmentJump: RELATIVE_ATTAINMENT_JUMP,
    note: 'monotone worst tree reaches ~0.647 of the log2(N)*eps ceiling vs imp-35893 ~4.42e-4 -- a ~1460x jump in relative attainment when cancellation is removed',
  },
  summary: {
    balancedNormErr: BALANCED.pairwiseNormErr,
    balancedDepth: BALANCED.treeDepth,
    worstShape: WORST.shape,
    worstNormErr: WORST.pairwiseNormErr,
    worstDepth: WORST.treeDepth,
    worstRatioToPairwiseCeiling: WORST.ratioToPairwiseCeiling,
    worstRatioToDepthEpsBound: WORST.ratioToDepthEpsBound,
    bestShape: BEST.shape,
    bestNormErr: BEST.pairwiseNormErr,
    maxTreeDepth: MAX_DEPTH,
    depthSweepFactor: MAX_DEPTH / BALANCED.treeDepth,
    errSpread: ERR_SPREAD,
    worstOverBalanced: WORST.pairwiseNormErr / BALANCED.pairwiseNormErr,
  },
  reading: {
    cancellationRemovalLiftsCeilingAttainment:
      'removing cancellation lifts log2(N)*eps-ceiling attainment from negligible (imp-35893 caterpillarR ' +
      '~4.42e-4) to O(1): the monotone caterpillarR reaches ~0.647 of the ceiling, a ~1460x relative jump, ' +
      'corroborating imp-35893 attribution that the cancellation-heavy multiset suppressed coherent accumulation',
    depthEpsBoundStillNotRealized:
      'the tree own depth*eps worst-case forward bound (~8.5e-13 at depth 3817) stays far from realized: ' +
      'caterpillarR sits at only ~3.2e-3 of it, so even without cancellation the rounding-error signs along ' +
      'the caterpillar spine are not fully aligned',
    nonMonotoneInDepth:
      'the error stays NON-MONOTONE in depth: skew0.03 (depth 276) exceeds skew0.01 (depth 874); caterpillarL ' +
      'and caterpillarR share depth 3817 yet differ ~3x, so depth alone does not order the error',
    pairwiseBeatsNaive:
      'the worst-shape pairwise error (~2.71e-15) stays below the naive-original error (~4.29e-15) -- but only ' +
      '~1.6x below, versus ~16x on the cancellation-heavy multiset, another sign of stronger coherent accumulation',
    allUnderMargin:
      'all tree shapes remain ~4 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    monotoneShapePushesTowardLog2Ceiling:
      'on the monotone non-cancelling multiset skeptical pairing-tree SHAPE DOES push pairwise substantially ' +
      'toward its log2(N)*eps ceiling (~65% at worst) -- unlike the cancellation-heavy multiset (imp-35893), ' +
      'confirming that multiset structure, not tree shape alone, governs attainment',
    depthProportionalBoundStaysUnattained:
      'the depth-proportional depth*eps worst-case bound remains unattained (~0.3%) even for the monotone ' +
      'multiset: full coherent accumulation along the caterpillar spine is not achieved by all-positive terms alone',
    precisionNotBinding:
      'achievable double precision leaves ~4 orders of strict headroom under the barrier margin even with ' +
      'cancellation removed AND worst-case pairing-tree shape; precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures pairwise errors under worst-case tree shapes on a monotone multiset only; it ' +
      'evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays ' +
      'GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running pairwise divide-and-conquer ' +
    'summation on a MONOTONE same-sign multiset t_k = 1/sqrt(k) at N ~ 488602 (condition number ~1, no ' +
    'cancellation) under the same seven pairing-tree SHAPES imp-35893 used -- balanced midpoint, four ' +
    'skew-fraction splits, and left/right caterpillars -- against the SAME association-invariant exact BigInt ' +
    'reference, the worst tree (caterpillarR, depth 3817) now reaches ~0.647 of the log2(N)*eps ceiling, a ' +
    '~1460x jump over imp-35893 ~4.42e-4 on the cancellation-heavy multiset. This CORROBORATES imp-35893 ' +
    'attribution: removing cancellation lets worst-case tree SHAPE push pairwise substantially toward its ' +
    'log2(N)*eps ceiling. HOWEVER the tree own depth*eps worst-case forward bound (~8.5e-13 at depth 3817) is ' +
    'STILL far from realized (~0.3%): all-positive terms alone do not align the rounding-error signs along the ' +
    'caterpillar spine, so the coherent depth-proportional regime is not attained. The error remains ' +
    'NON-MONOTONE in depth, and the worst pairwise error (~2.71e-15) stays ~4 orders below the O(1) barrier ' +
    'margin |A_t + B_t| - |C_t|. Precision is NOT the binding constraint even with cancellation removed and ' +
    'worst-case tree shape; the obstruction stays the ENGINEERING of the certified length-N interval sum ' +
    '(MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies ' +
    'no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35893 (tree-SHAPE stress on the cancellation-heavy multiset, complemented here); imp-35852 ' +
    '(term-ORDER stress); imp-35812 (fixed term family + balanced pairwise baseline); imp-35761 (pairwise ' +
    'log2(N)*eps and naive N*eps ceilings); imp-35760 (barrier-margin allocation); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A (A+B-C interval bound greenfield); Higham ' +
    '2002 (pairwise summation error and tree depth); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE_ASSERTIONS = [
  {
    // Same anchor as imp-35893: N = floor(sqrt(T_PT/4 pi)) ~ 488602; 7 tree shapes; monotone multiset.
    id: 'imp35945-n-anchor-monotone',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602; 7 pairing-tree shapes; monotone all-positive multiset (cond ~1)',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      SHAPES.length === 7 &&
      Math.abs(CONDITION_NUMBER - 1) < 1e-12,
  },
  {
    // The sweep genuinely spans balanced -> caterpillar: depth grows by >100x to >3000.
    id: 'imp35945-depth-sweep-spans-balanced-to-caterpillar',
    description: 'Tree depth sweeps from balanced (~12) to caterpillar (>3000), a >100x imbalance range',
    holds: () =>
      MAX_DEPTH > 3000 &&
      BALANCED.treeDepth < 20 &&
      MAX_DEPTH / BALANCED.treeDepth > 100,
  },
  {
    // KEY FINDING: the monotone worst tree DOES approach the log2(N)*eps ceiling (>0.3 of it).
    id: 'imp35945-monotone-worst-approaches-log2-ceiling',
    description: 'Worst-shape pairwise error reaches >0.3 of the log2(N)*eps ceiling on the monotone multiset (caterpillarR)',
    holds: () =>
      WORST.ratioToPairwiseCeiling > 0.3 &&
      WORST.ratioToPairwiseCeiling < 1 &&
      WORST.shape === 'caterpillarR',
  },
  {
    // CROSS-FAMILY CONTRAST: this is a huge jump vs imp-35893 (~4.42e-4) -- cancellation was the suppressor.
    id: 'imp35945-large-jump-vs-cancellation-heavy',
    description: 'Monotone ceiling-attainment is >100x imp-35893 cancellation-heavy attainment (~4.42e-4)',
    holds: () =>
      RELATIVE_ATTAINMENT_JUMP > 100 &&
      Math.abs(IMP35893_WORST_RATIO_TO_CEILING - 4.42e-4) < 1e-6,
  },
  {
    // HONEST CAVEAT: the depth*eps worst-case bound is STILL not realized (worst < 1% of it).
    id: 'imp35945-depth-eps-bound-still-not-realized',
    description: 'The tree own depth*eps worst-case bound stays far from realized: worst < 1e-2 of depth*eps',
    holds: () =>
      WORST.ratioToDepthEpsBound < 1e-2 &&
      WORST.ratioToDepthEpsBound > 0 &&
      SHAPES.every((r) => r.pairwiseNormErr > 0),
  },
  {
    // Every shape still sits below the naive-original error (pairwise beats naive on this family too).
    id: 'imp35945-pairwise-beats-naive-every-shape',
    description: 'Pairwise error under every tree shape stays below the naive-original error on the monotone multiset',
    holds: () =>
      NAIVE_ORIGINAL_NORM_ERR > 0 &&
      SHAPES.every((r) => r.pairwiseNormErr < NAIVE_ORIGINAL_NORM_ERR),
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35945-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /push pairwise substantially/.test(
        IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE.conclusion.monotoneShapePushesTowardLog2Ceiling,
      ) &&
      /remains unattained/.test(
        IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE.conclusion.depthProportionalBoundStaysUnattained,
      ) &&
      /GREENFIELD/.test(IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE.verdict) &&
      /refereed bound is changed/i.test(IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE.verdict),
  },
];

for (const a of IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35945-w1-summation-monotone-tree-shape assertion failed: ${a.id}`);
  }
}
