/**
 * @module imp-35893-w1-summation-pairwise-tree-shape
 *
 * imp-35893 (numerical, S-frontier): MEASURE whether the imp-35852 pairwise
 * divide-and-conquer log2(N)*eps ceiling is attained under an independently-structured
 * PAIRING TREE (unbalanced / worst-case tree SHAPE) -- as distinct from the term
 * ORDERING that imp-35852 varied -- at N = 488602.
 *
 * imp-35852 stressed the three summation schemes by permuting the term MULTISET but
 * held the pairwise divide-and-conquer TREE STRUCTURE fixed (balanced midpoint split,
 * base block 128), finding pairwise stayed ~3.6e-19 -- far below its log2(N)*eps
 * ceiling ~4.20e-15 -- under every ordering. That left the COMPLEMENTARY stress
 * unmeasured: the log2(N)*eps ceiling is a property of the BALANCED tree (depth
 * ~log2(N)); an UNBALANCED tree has larger depth and, in the worst case, a depth*eps
 * error bound that can climb toward the naive N*eps regime. This module holds the terms
 * FIXED (the imp-35812 oscillatory multiset, original order) and varies only the pairwise
 * TREE SHAPE, from the balanced midpoint split toward a maximally unbalanced caterpillar
 * (peel one leaf block per level), tabulating the pairwise error and its ratio to the
 * log2(N)*eps ceiling against the empirical tree DEPTH / imbalance.
 *
 * The pairing tree is realized by a splitter(lo, hi) that chooses the mid-index; the sum
 * is evaluated on an EXPLICIT work stack (post-order) so a caterpillar of depth ~N/leaf
 * ~3817 does not overflow the JS call stack. The exact reference is the SAME
 * permutation-invariant dyadic-BigInt sum imp-35852 used (tree shape changes only the
 * ASSOCIATION of the additions, never the exact total), so |schemeResult - trueSum| is an
 * EXACT BigInt for every shape.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity;
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * TREE SHAPES (same fixed multiset, varying pairing-tree shape)
 * -----------------------------------------------------------------------------
 *   balanced(0.5)  : midpoint split mid = (lo+hi)>>1 -- the imp-35852 balanced tree,
 *                    depth ~log2(N/leaf) ~12 (the log2(N)*eps ceiling reference shape).
 *   skew0.25 ..    : fractional split mid = lo + floor((hi-lo)*f) for f in
 *   skew0.01         {0.25, 0.1, 0.03, 0.01} -- progressively unbalanced, depth climbing
 *                    ~log_{1/(1-f)}(N) from ~29 up to ~874.
 *   caterpillarL   : peel a leaf-sized block off the LEFT each level (mid = lo+leaf) --
 *                    maximally unbalanced, depth ~N/leaf ~3817 (near-sequential).
 *   caterpillarR   : peel a leaf-sized block off the RIGHT each level (mid = hi-leaf) --
 *                    the mirror caterpillar, also depth ~3817.
 *
 * MEASURED at N = 488602 (normalized by Sum|t_k| ~ 889; balanced reproduces imp-35852):
 *   shape          depth    pairwise err   err / log2(N)*eps ceiling
 *   balanced(0.5)     12     ~3.56e-19      ~8.48e-5
 *   skew0.25          29     ~1.89e-20      ~4.51e-6   (best -- deeper yet LOWER than balanced)
 *   skew0.1           79     ~3.56e-19      ~8.48e-5
 *   skew0.03         276     ~2.31e-19      ~5.50e-5
 *   skew0.01         874     ~2.31e-19      ~5.50e-5
 *   caterpillarL    3817     ~1.44e-19      ~3.43e-5
 *   caterpillarR    3817     ~1.85e-18      ~4.42e-4   (worst)
 *
 * READING: sweeping the tree depth from 12 (balanced) to 3817 (caterpillar) -- a ~300x
 * increase in depth / imbalance -- the pairwise normalized error stays in
 * [~1.9e-20, ~1.85e-18], a ~98x spread that is NON-MONOTONE in depth: skew0.25 is DEEPER
 * than balanced (29 vs 12) yet has a LOWER error (~1.89e-20 vs ~3.56e-19). The WORST tree
 * (caterpillarR, depth 3817) reaches only ~4.42e-4 of the log2(N)*eps ceiling -- still
 * ~3.4 orders (>2000x) BELOW it, and ~16x below even the naive-original error ~3.03e-17.
 * The depth-proportional worst-case bound (depth*eps, ~8.5e-13 at depth 3817) is NOT
 * realized: on this benign cancellation-heavy multiset the per-addition rounding errors do
 * not accumulate coherently along the tree spine, so worst-case tree SHAPE -- exactly
 * like the worst-case term ORDER of imp-35852 -- does NOT push pairwise toward its
 * ceiling. Pairwise is ROBUST to BOTH tree shape and term order. All shapes remain ~10+
 * orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760). CONCLUSION:
 * precision stays NON-binding under worst-case pairing-tree shape too; the obstruction
 * remains the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725),
 * and the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35852-w1-summation-adversarial-ordering (term-ORDER stress; this varies tree SHAPE)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + balanced pairwise baseline)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive ceiling)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise summation error and tree depth)
 */

// -- Anchor + operative constants (import-light; matching imp-35852 / imp-35812) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same representative oscillatory term as imp-35812 / imp-35852 (fixed; deterministic, no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to the imp-35852 pairwise scheme)

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

// -- Build the fixed term multiset + the shape-invariant exact reference ----------------
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
const SKEW025 = BY_SHAPE['skew0.25'];
const WORST = SHAPES.reduce((a, b) => (b.pairwiseNormErr > a.pairwiseNormErr ? b : a));
const BEST = SHAPES.reduce((a, b) => (b.pairwiseNormErr < a.pairwiseNormErr ? b : a));
const MAX_DEPTH = Math.max(...SHAPES.map((r) => r.treeDepth));
const ERR_SPREAD = WORST.pairwiseNormErr / BEST.pairwiseNormErr;

export const IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE = {
  id: 'imp-35893',
  proofSection: 'S-frontier',
  question:
    'Does skeptical pairing-tree SHAPE (unbalanced / caterpillar trees, as distinct from the term ' +
    'ORDERING imp-35852 varied) push pairwise divide-and-conquer summation toward its log2(N)*eps ' +
    'ceiling on the fixed imp-35812 N ~ 488602 term family? Measurement only; certifies no W1 bound; ' +
    'changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed multiset as imp-35852)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: CONDITION_NUMBER,
    leafBlock: LEAF,
    note: 'a fixed term multiset (original order) re-summed under varying pairing-tree SHAPES; the exact sum is association-invariant',
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
    naiveOriginalNormErr: { value: NAIVE_ORIGINAL_NORM_ERR, source: 'imp-35812 naive original-order achieved error (~3.03e-17)' },
  },
  shapes: SHAPES,
  summary: {
    balancedNormErr: BALANCED.pairwiseNormErr,
    balancedDepth: BALANCED.treeDepth,
    worstShape: WORST.shape,
    worstNormErr: WORST.pairwiseNormErr,
    worstDepth: WORST.treeDepth,
    worstRatioToPairwiseCeiling: WORST.ratioToPairwiseCeiling,
    bestShape: BEST.shape,
    bestNormErr: BEST.pairwiseNormErr,
    maxTreeDepth: MAX_DEPTH,
    depthSweepFactor: MAX_DEPTH / BALANCED.treeDepth,
    errSpread: ERR_SPREAD,
    worstOverBalanced: WORST.pairwiseNormErr / BALANCED.pairwiseNormErr,
  },
  reading: {
    balancedReproducesImp35852:
      'the balanced midpoint tree reproduces the imp-35852 pairwise baseline (~3.56e-19), confirming the ' +
      'same scheme and term family',
    depthSweptButErrorFlat:
      'sweeping the tree depth from 12 (balanced) to 3817 (caterpillar) -- a ~300x increase in depth / ' +
      'imbalance -- the pairwise error stays in [~1.9e-20, ~1.85e-18], a ~98x spread',
    nonMonotoneInDepth:
      'the error is NON-MONOTONE in depth: skew0.25 is deeper than balanced (29 vs 12) yet has a LOWER ' +
      'error (~1.89e-20 vs ~3.56e-19), so depth alone does not order the error',
    ceilingNotAttained:
      'the worst tree (caterpillarR, depth 3817) reaches only ~4.42e-4 of the log2(N)*eps ceiling -- still ' +
      '~3.4 orders (>2000x) BELOW it, and its own depth*eps bound ~8.5e-13 is under-realized by ~4.6e-6',
    pairwiseBeatsNaive:
      'even the worst-shape pairwise error (~1.85e-18) stays ~16x BELOW the naive-original error ~3.03e-17',
    allUnderMargin:
      'all tree shapes remain ~10+ orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    treeShapeDoesNotReachCeiling:
      'skeptical pairing-tree SHAPE does NOT push pairwise toward its log2(N)*eps ceiling on this benign ' +
      'cancellation-heavy multiset; the depth-proportional worst case is not realized because the ' +
      'per-addition rounding errors do not accumulate coherently along the tree spine',
    pairwiseRobustToShapeAndOrder:
      'pairwise is ROBUST to BOTH tree shape (here) and term order (imp-35852) -- neither worst-case lever ' +
      'closes the gap to its ceiling',
    precisionNotBinding:
      'achievable double precision leaves overwhelming strict headroom under WORST-CASE pairing-tree shape too; ' +
      'precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures pairwise errors under worst-case tree shapes only; it evaluates no sum of H_t and ' +
      'verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
      'and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running pairwise divide-and-conquer ' +
    'summation on the FIXED imp-35812 length-N = 488602 term multiset (original order) under seven pairing-tree ' +
    'SHAPES -- balanced midpoint, four skew-fraction splits (0.25, 0.1, 0.03, 0.01), and left/right caterpillars ' +
    '-- against the SAME association-invariant exact BigInt reference, the empirical tree depth sweeps from 12 ' +
    '(balanced, reproducing the imp-35852 pairwise baseline ~3.56e-19) to 3817 (caterpillar), a ~300x increase, ' +
    'yet the pairwise normalized error stays in [~1.9e-20, ~1.85e-18] and is NON-MONOTONE in depth (skew0.25 is ' +
    'deeper than balanced but lower error). The worst tree (caterpillarR) reaches only ~4.42e-4 of the ' +
    'log2(N)*eps ceiling -- still >2000x below it, ~16x below even the naive-original error ~3.03e-17, and it ' +
    'under-realizes its own depth*eps bound by ~4.6e-6: the per-addition rounding errors do not accumulate ' +
    'coherently along the tree spine on this cancellation-heavy data. Worst-case tree SHAPE, exactly like the ' +
    'worst-case term ORDER of imp-35852, does NOT push pairwise toward its ceiling; pairwise is ROBUST to both ' +
    'levers. All shapes remain ~10+ orders below the O(1) barrier margin |A_t + B_t| - |C_t|. Precision is NOT ' +
    'the binding constraint even under worst-case pairing-tree shape; the obstruction stays the ENGINEERING of ' +
    'the certified length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35852 (term-ORDER stress this complements with tree-SHAPE stress); imp-35812 (fixed term family + ' +
    'balanced pairwise baseline); imp-35761 (pairwise log2(N)*eps and naive N*eps ceilings); imp-35760 ' +
    '(barrier-margin allocation); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A ' +
    '(A+B-C interval bound greenfield); Higham 2002 (pairwise summation error and tree depth); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE_ASSERTIONS = [
  {
    // Same anchor as imp-35812/imp-35852: N = floor(sqrt(T_PT/4 pi)) ~ 488602; 7 tree shapes.
    id: 'imp35893-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms; 7 pairing-tree shapes measured',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      SHAPES.length === 7,
  },
  {
    // The balanced midpoint tree reproduces the imp-35852 pairwise baseline ~3.557e-19.
    id: 'imp35893-balanced-reproduces-imp35852',
    description: 'Balanced midpoint tree reproduces the imp-35852 pairwise baseline ~3.56e-19 (within 2%)',
    holds: () =>
      BALANCED.treeDepth < 20 &&
      Math.abs(BALANCED.pairwiseNormErr - 3.557e-19) / 3.557e-19 < 0.02,
  },
  {
    // The sweep genuinely spans balanced -> caterpillar: depth grows by >100x to >3000.
    id: 'imp35893-depth-sweep-spans-balanced-to-caterpillar',
    description: 'Tree depth sweeps from balanced (~12) to caterpillar (>3000), a >100x imbalance range',
    holds: () =>
      MAX_DEPTH > 3000 &&
      BALANCED.treeDepth < 20 &&
      MAX_DEPTH / BALANCED.treeDepth > 100 &&
      SHAPES.every((r) => r.treeDepth >= BALANCED.treeDepth || r.shape === 'balanced(0.5)'),
  },
  {
    // Tree shape does NOT attain the log2(N)*eps ceiling: worst stays <1e-2 of it, all below it.
    id: 'imp35893-tree-shape-does-not-attain-ceiling',
    description: 'Worst-shape pairwise error stays <1e-2 of the log2(N)*eps ceiling; every shape below it',
    holds: () =>
      WORST.ratioToPairwiseCeiling < 1e-2 &&
      SHAPES.every((r) => r.pairwiseNormErr < CEIL_PAIRWISE && r.pairwiseNormErr > 0) &&
      WORST.pairwiseNormErr < 1e-3 * CEIL_NAIVE_LINEAR,
  },
  {
    // Non-monotone in depth: skew0.25 is DEEPER than balanced yet has a LOWER error.
    id: 'imp35893-error-non-monotone-in-depth',
    description: 'Pairwise error is non-monotone in tree depth: skew0.25 deeper than balanced but lower error',
    holds: () =>
      SKEW025.treeDepth > BALANCED.treeDepth &&
      SKEW025.pairwiseNormErr < BALANCED.pairwiseNormErr &&
      ERR_SPREAD < 1000,
  },
  {
    // Pairwise beats naive under EVERY tree shape (worst shape still below naive-original error).
    id: 'imp35893-pairwise-beats-naive-every-shape',
    description: 'Pairwise error under every tree shape stays below the naive-original error ~3.03e-17',
    holds: () =>
      NAIVE_ORIGINAL_NORM_ERR > 1e-17 && NAIVE_ORIGINAL_NORM_ERR < 1e-16 &&
      SHAPES.every((r) => r.pairwiseNormErr < NAIVE_ORIGINAL_NORM_ERR),
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35893-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /does NOT push pairwise toward its log2\(N\)\*eps ceiling/.test(
        IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.conclusion.treeShapeDoesNotReachCeiling,
      ) &&
      /GREENFIELD/.test(IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.verdict) &&
      /refereed bound is changed/i.test(IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.verdict),
  },
];

for (const a of IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35893-w1-summation-pairwise-tree-shape assertion failed: ${a.id}`);
  }
}
