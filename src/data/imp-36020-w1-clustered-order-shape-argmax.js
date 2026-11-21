/**
 * @module imp-36020-w1-clustered-order-shape-argmax
 *
 * imp-36020 (numerical, S-frontier): LOCATE and CONFIRM the worst-SHAPE FLIP to
 * caterpillarL under the imp-35852 CLUSTERED same-sign term ORDER, by sweeping the FULL
 * imp-35893 pairing-tree shape set (balanced, four skew fractions, left/right caterpillar)
 * under the clustered order at N = 488602 -- imp-35973 reported the flip and the
 * ~41%-of-ceiling figure only for its FIXED shape set (balanced order-only, caterpillarR
 * shape-only, caterpillarL/caterpillarR cross), never sweeping all seven shapes to pin
 * which one is the true arg-max of the combined pairwise error.
 *
 * BACKGROUND. Floating-point summation error has two independent skeptical levers:
 *   - term ORDER (imp-35852): worst = clustered same-sign runs (all negatives, then all
 *     positives), which on the balanced tree reaches ~7.5e-3 of the log2(N)*eps ceiling;
 *   - pairing-tree SHAPE (imp-35893): worst under the NATURAL order = caterpillarR
 *     (~4.42e-4 of the ceiling).
 * imp-35973 crossed the two (clustered order THROUGH caterpillarR shape -> ~1.03e-1 of the
 * ceiling, super-additive) and NOTED that under the clustered order the worst SHAPE flips
 * from caterpillarR to caterpillarL (~41% of the ceiling, because caterpillarL peels the
 * all-negative prefix into a monotonically growing left accumulator). But imp-35973 only
 * evaluated caterpillarL and caterpillarR under the clustered order -- it never confirmed
 * caterpillarL is the arg-max over the FULL seven-shape family. This module closes that
 * gap: it sweeps all seven imp-35893 shapes under the imp-35852 clustered order against the
 * SAME order- and association-invariant exact 2^{-96} dyadic-BigInt reference, tabulates the
 * combined normalized error and its ratio to the log2(N)*eps ceiling per shape, and pins the
 * arg-max plus its ceiling fraction.
 *
 * MEASURED at N = 488602 (clustered same-sign order; normalized by Sum|t_k|; the exact sum
 * is order- and association-invariant, computed once and reused for all shapes):
 *   shape          depth    combined err   err / log2(N)*eps ceiling
 *   balanced(0.5)     12     ~3.148e-17     ~7.50e-3   (= imp-35852 clustered order-only)
 *   skew0.25          29     ~3.148e-17     ~7.50e-3
 *   skew0.1           79     ~3.148e-17     ~7.50e-3
 *   skew0.03         276     ~1.550e-17     ~3.69e-3   (LOWER than balanced -- non-monotone)
 *   skew0.01         874     ~6.345e-17     ~1.51e-2
 *   caterpillarL    3817     ~1.731e-15     ~4.12e-1   (ARG-MAX -- the flip caterpillar)
 *   caterpillarR    3817     ~4.324e-16     ~1.03e-1   (= imp-35973 cross-term)
 *
 * FINDING (measurement only): sweeping the full seven-shape family under the clustered
 * order CONFIRMS caterpillarL is the arg-max, at ~4.12e-1 (~41.2%) of the log2(N)*eps
 * ceiling -- ~4.0x the caterpillarR cross-term (~1.03e-1) imp-35973 highlighted, and ~55x
 * the shallow-tree order-only worst (~7.50e-3, which balanced / skew0.25 / skew0.1 all share
 * since their spine never touches the all-negative prefix coherently). The shape ordering is
 * NON-MONOTONE in depth (skew0.03 at depth 276 sits BELOW balanced at depth 12), so depth
 * alone does not order the error -- what makes caterpillarL the arg-max is that its LEFT
 * caterpillar spine peels the clustered all-negative prefix into a monotonically growing
 * accumulator, the one geometry that lets the per-addition roundoffs accumulate coherently.
 * YET even the arg-max stays ~2.4x BELOW the log2(N)*eps ceiling (ratio ~0.412): pulling
 * BOTH worst-case levers on the single most-favourable shape still does NOT attain the
 * pairwise ceiling. All configurations remain many orders below the O(1) barrier margin
 * |A_t + B_t| - |C_t| (imp-35760): precision stays NON-binding, and the W1 A + B - C
 * certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725).
 *
 * This is the SHAPE-arg-max complement of imp-35973 (which fixed the shape set and crossed
 * two levers). It confirms, not merely asserts, the caterpillarL flip. Certifies no W1
 * bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no
 * bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35973-w1-summation-order-shape-cross-term (fixed-shape cross-term; this sweeps all shapes)
 * @see imp-35893-w1-summation-pairwise-tree-shape (tree-SHAPE stress at natural order; caterpillarR worst)
 * @see imp-35852-w1-summation-adversarial-ordering (term-ORDER stress at balanced tree; clustered worst)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise summation error and tree depth)
 */

// -- Anchor + operative constants (import-light; matching imp-35893 / imp-35973) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35893 (fixed; no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to the imp-35852 / imp-35893 pairwise scheme)

// -- Pairwise summation over an ARBITRARY pairing tree, evaluated on an explicit stack ---
function sumTree(terms, splitter, leaf) {
  // Post-order on an explicit work stack so a caterpillar of depth ~N/leaf does not overflow.
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
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Build the fixed term multiset + the order/shape-invariant exact reference ----------
const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) {
  const t = TERM(k);
  _base[k - 1] = t;
  _sumAbs += Math.abs(t);
}
let _trueNum = 0n; // exact sum is order- AND association-invariant -- computed once, reused
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);

// -- imp-35852 worst term ORDER: clustered same-sign runs (all negatives, then all positives)
const _neg = [];
const _pos = [];
for (let i = 0; i < N_AT_TPT; i++) {
  if (_base[i] < 0) _neg.push(_base[i]);
  else _pos.push(_base[i]);
}
const CLUSTERED = Float64Array.from(_neg.concat(_pos));

// -- The full imp-35893 pairing-tree shape set ------------------------------------------
const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1],
  ['skew0.25', (lo, hi) => lo + Math.floor((hi - lo) * 0.25)],
  ['skew0.1', (lo, hi) => lo + Math.floor((hi - lo) * 0.1)],
  ['skew0.03', (lo, hi) => lo + Math.floor((hi - lo) * 0.03)],
  ['skew0.01', (lo, hi) => lo + Math.floor((hi - lo) * 0.01)],
  ['caterpillarL', (lo, hi, leaf) => lo + leaf],
  ['caterpillarR', (lo, hi, leaf) => hi - leaf],
];

const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (balanced-tree log2(N)*eps)

// -- Sweep every shape under the CLUSTERED order against the shared exact reference ------
const SHAPES = TREE_SHAPES.map(([name, splitter]) => {
  const { sum, maxDepth } = sumTree(CLUSTERED, splitter, LEAF);
  const err = normalizedError(sum, _trueNum, _sumAbs);
  return {
    shape: name,
    treeDepth: maxDepth,
    combinedNormErr: err, // clustered ORDER through this SHAPE
    ratioToPairwiseCeiling: err / CEIL_PAIRWISE, // fraction of the log2(N)*eps ceiling
  };
});

const BY_SHAPE = Object.fromEntries(SHAPES.map((r) => [r.shape, r]));
const BALANCED = BY_SHAPE['balanced(0.5)'];
const SKEW003 = BY_SHAPE['skew0.03'];
const CATERPILLAR_L = BY_SHAPE['caterpillarL'];
const CATERPILLAR_R = BY_SHAPE['caterpillarR'];
const ARGMAX = SHAPES.reduce((a, b) => (b.combinedNormErr > a.combinedNormErr ? b : a));

export const IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX = {
  id: 'imp-36020',
  proofSection: 'S-frontier',
  question:
    'Under the imp-35852 CLUSTERED same-sign term ORDER, which of the seven imp-35893 pairing-tree SHAPES ' +
    'maximizes the combined pairwise normalized error, and is it caterpillarL (the flip imp-35973 reported for ' +
    'its fixed shape set)? Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed multiset as imp-35852/imp-35893)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    leafBlock: LEAF,
    termOrder: 'clustered same-sign runs (all negatives, then all positives) -- imp-35852 worst ORDER',
    negativeCount: _neg.length,
    positiveCount: _pos.length,
    note: 'a fixed term multiset re-summed under the clustered ORDER across varying pairing-tree SHAPES; the exact sum is order- and association-invariant',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    orderAndAssociationInvariant: true,
    note: 'one exact reference is computed once and reused for every shape (the true sum does not depend on order or pairing tree)',
  },
  ceiling: {
    pairwiseBalanced: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N)*eps (balanced tree depth)' },
  },
  shapes: SHAPES,
  summary: {
    argMaxShape: ARGMAX.shape,
    argMaxNormErr: ARGMAX.combinedNormErr,
    argMaxDepth: ARGMAX.treeDepth,
    argMaxRatioToCeiling: ARGMAX.ratioToPairwiseCeiling,
    caterpillarLNormErr: CATERPILLAR_L.combinedNormErr,
    caterpillarLRatioToCeiling: CATERPILLAR_L.ratioToPairwiseCeiling,
    caterpillarRNormErr: CATERPILLAR_R.combinedNormErr, // = imp-35973 cross-term
    caterpillarRRatioToCeiling: CATERPILLAR_R.ratioToPairwiseCeiling,
    balancedNormErr: BALANCED.combinedNormErr, // = imp-35852 clustered order-only
    argMaxOverCaterpillarR: CATERPILLAR_L.combinedNormErr / CATERPILLAR_R.combinedNormErr,
    argMaxOverBalanced: CATERPILLAR_L.combinedNormErr / BALANCED.combinedNormErr,
  },
  reading: {
    caterpillarLIsArgMax:
      'sweeping the full seven-shape family under the clustered order CONFIRMS caterpillarL is the arg-max ' +
      'of the combined pairwise error (~1.73e-15), at ~4.12e-1 (~41.2%) of the log2(N)*eps ceiling',
    flipConfirmedNotAsserted:
      'imp-35973 evaluated only caterpillarL and caterpillarR under the clustered order; the full sweep shows ' +
      'caterpillarL beats not just caterpillarR (~4.0x) but every skew and balanced shape too',
    nonMonotoneInDepth:
      'the shape ordering is NON-MONOTONE in depth: skew0.03 (depth 276) sits BELOW balanced (depth 12), so ' +
      'depth alone does not order the error -- the arg-max geometry is caterpillarL peeling the all-negative ' +
      'prefix into a monotonically growing left accumulator',
    ceilingStillNotAttained:
      'even the arg-max stays ~2.4x BELOW the log2(N)*eps ceiling (ratio ~0.412): pulling BOTH skeptical ' +
      'levers on the single most-favourable shape still does not attain the pairwise ceiling',
    allUnderMargin:
      'all configurations remain many orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    argMaxIsCaterpillarL:
      'caterpillarL is the arg-max pairing-tree SHAPE under the imp-35852 clustered same-sign ORDER, confirming ' +
      'the imp-35973 flip across the full imp-35893 shape family, at ~41.2% of the log2(N)*eps ceiling',
    precisionNotBinding:
      'even the combined worst order-x-shape configuration leaves overwhelming strict headroom under the ceiling ' +
      'and the O(1) barrier margin; precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures pairwise errors under skeptical order-x-shape only; it evaluates no sum of H_t and ' +
      'verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
      'and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Sweeping the FULL imp-35893 seven ' +
    'pairing-tree shape set -- balanced midpoint, four skew-fraction splits (0.25, 0.1, 0.03, 0.01), and ' +
    'left/right caterpillars -- under the imp-35852 CLUSTERED same-sign term ORDER on the fixed imp-35812 ' +
    'length-N = 488602 oscillatory multiset, against the SAME order- and association-invariant exact BigInt ' +
    'reference, CONFIRMS caterpillarL is the arg-max of the combined pairwise normalized error (~1.73e-15), ' +
    'at ~4.12e-1 (~41.2%) of the log2(N)*eps ceiling -- ~4.0x the caterpillarR cross-term (~1.03e-1) imp-35973 ' +
    'highlighted and ~55x the shallow-tree order-only worst (~7.5e-3 shared by balanced / skew0.25 / skew0.1). ' +
    'The shape ordering is NON-MONOTONE in depth (skew0.03 at depth 276 sits BELOW balanced at depth 12): what ' +
    'makes caterpillarL the arg-max is its LEFT spine peeling the clustered all-negative prefix into a ' +
    'monotonically growing accumulator, the one geometry that lets per-addition roundoffs accumulate ' +
    'coherently. YET even the arg-max stays ~2.4x BELOW the log2(N)*eps ceiling (ratio ~0.412): pulling BOTH ' +
    'worst-case levers on the single most-favourable shape still does NOT attain the pairwise ceiling. All ' +
    'configurations remain many orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision ' +
    'is NOT the binding constraint. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; ' +
    'verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT ' +
    'stays GREENFIELD (imp-35681 Part A); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35973 (fixed-shape order-x-shape cross-term this sweeps across all shapes); imp-35893 (tree-SHAPE ' +
    'stress at natural order); imp-35852 (term-ORDER stress at balanced tree); imp-35761 (pairwise log2(N)*eps ' +
    'ceiling); imp-35760 (barrier-margin allocation); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained ' +
    'terms); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (pairwise summation error and ' +
    'tree depth); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX_ASSERTIONS = [
  {
    // Same anchor as imp-35852/imp-35893/imp-35973: N ~ 488602; 7 shapes; clustered order splits the signs.
    id: 'imp36020-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602; 7 pairing-tree shapes swept under the clustered order',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      SHAPES.length === 7 &&
      _neg.length + _pos.length === N_AT_TPT &&
      _neg.length > 2e5 && _pos.length > 2e5,
  },
  {
    // caterpillarL is the arg-max over ALL seven shapes under the clustered order.
    id: 'imp36020-caterpillarL-is-argmax',
    description: 'caterpillarL is the arg-max combined-error shape under the clustered order across all 7 shapes',
    holds: () =>
      ARGMAX.shape === 'caterpillarL' &&
      SHAPES.every((r) => r.combinedNormErr <= CATERPILLAR_L.combinedNormErr) &&
      CATERPILLAR_L.combinedNormErr > CATERPILLAR_R.combinedNormErr,
  },
  {
    // The arg-max ceiling fraction is ~41% (imp-35973 reported ~41% for its fixed set).
    id: 'imp36020-argmax-ceiling-fraction',
    description: 'caterpillarL reaches ~41% of the log2(N)*eps ceiling (in [0.35, 0.50])',
    holds: () =>
      CATERPILLAR_L.ratioToPairwiseCeiling > 0.35 &&
      CATERPILLAR_L.ratioToPairwiseCeiling < 0.5 &&
      Math.abs(CATERPILLAR_L.combinedNormErr - 1.7305e-15) / 1.7305e-15 < 0.05,
  },
  {
    // caterpillarL clearly beats the caterpillarR cross-term (imp-35973) -- a genuine flip, ~4x.
    id: 'imp36020-caterpillarL-beats-caterpillarR-cross',
    description: 'caterpillarL exceeds the caterpillarR cross-term (imp-35973 ~4.32e-16) by ~4x',
    holds: () =>
      Math.abs(CATERPILLAR_R.combinedNormErr - 4.3237e-16) / 4.3237e-16 < 0.05 &&
      CATERPILLAR_L.combinedNormErr / CATERPILLAR_R.combinedNormErr > 3 &&
      CATERPILLAR_L.combinedNormErr / CATERPILLAR_R.combinedNormErr < 5,
  },
  {
    // Non-monotone in depth: skew0.03 (deep) sits below balanced (shallow) under the clustered order.
    id: 'imp36020-non-monotone-in-depth',
    description: 'Combined error is non-monotone in depth: skew0.03 (depth 276) below balanced (depth 12)',
    holds: () =>
      SKEW003.treeDepth > BALANCED.treeDepth &&
      SKEW003.combinedNormErr < BALANCED.combinedNormErr,
  },
  {
    // Ceiling still NOT attained: even the arg-max stays below the log2(N)*eps ceiling.
    id: 'imp36020-ceiling-not-attained',
    description: 'Even the arg-max caterpillarL stays below the log2(N)*eps ceiling (ratio < 1, ~2.4x below)',
    holds: () =>
      ARGMAX.ratioToPairwiseCeiling < 1 &&
      SHAPES.every((r) => r.combinedNormErr < CEIL_PAIRWISE && r.combinedNormErr > 0),
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36020-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /caterpillarL is the arg-max/.test(
        IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX.conclusion.argMaxIsCaterpillarL,
      ) &&
      /GREENFIELD/.test(IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX.verdict) &&
      /refereed bound is changed/i.test(IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX.verdict),
  },
];

for (const a of IMP36020_W1_CLUSTERED_ORDER_SHAPE_ARGMAX_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36020-w1-clustered-order-shape-argmax assertion failed: ${a.id}`);
  }
}
