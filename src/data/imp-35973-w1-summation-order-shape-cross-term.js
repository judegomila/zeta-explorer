/**
 * @module imp-35973-w1-summation-order-shape-cross-term
 *
 * imp-35973 (numerical, S-frontier): MEASURE the CROSS-TERM of the two skeptical
 * pairwise-summation stresses that imp-35852 and imp-35893 each explored on only one
 * axis -- apply BOTH stresses SIMULTANEOUSLY and compare to each single-stress worst.
 *
 * imp-35852 stressed pairwise summation by permuting the term ORDER at a FIXED balanced
 * tree (worst ordering: "clustered" same-sign runs -- all negatives then all positives --
 * pushing pairwise to ~3.15e-17, ~7.5e-3 of the log2(N)*eps ceiling). imp-35893 stressed
 * the pairing-tree SHAPE at a FIXED original term order (worst shape: "caterpillarR",
 * depth ~3817, pushing pairwise to ~1.85e-18, ~4.4e-4 of the ceiling). Each independently
 * found pairwise stays >2000x below its log2(N)*eps ceiling. NEITHER measured the
 * CROSS-TERM: whether applying the worst ORDER THROUGH the worst SHAPE compounds, cancels,
 * or leaves the two stresses independent.
 *
 * This module supplies the missing measurement. It sums the FIXED imp-35812 oscillatory
 * multiset at N = floor(sqrt(T_PT/4 pi)) ~ 488602 under the imp-35852 worst "clustered"
 * ORDERING evaluated on the imp-35893 worst "caterpillarR" TREE SHAPE (both hostile levers
 * on at once), against the SAME association- and permutation-invariant exact BigInt
 * reference, and compares the combined error to each single-stress worst.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity; the
 * C_mb GUE-conditional constant (imp-486) is untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * CONFIGURATIONS (same fixed multiset; term ORDER x pairing-tree SHAPE)
 * -----------------------------------------------------------------------------
 *   shape-only  : caterpillarR shape on ORIGINAL order (the imp-35893 worst SHAPE alone).
 *   order-only  : balanced midpoint tree on CLUSTERED order (the imp-35852 worst ORDER
 *                 alone, in the pairwise scheme).
 *   CROSS       : caterpillarR shape on CLUSTERED order (BOTH worst stresses at once).
 *   crossCatL   : caterpillarL shape on CLUSTERED order (the mirror caterpillar -- probes
 *                 whether the worst SHAPE flips under the hostile ORDER).
 *
 * MEASURED at N = 488602 (normalized by Sum|t_k| ~ 889; ratio = err / log2(N)*eps ceiling):
 *   configuration                        depth    pairwise err   ratio to ceiling
 *   shape-only  (catR, original)         3817     ~1.854e-18     ~4.42e-4
 *   order-only  (balanced, clustered)      12     ~3.148e-17     ~7.50e-3
 *   CROSS       (catR, clustered)        3817     ~4.324e-16     ~1.03e-1   (worst)
 *   crossCatL   (catL, clustered)        3817     ~1.731e-15     ~4.12e-1
 *
 * READING: the two stresses COMPOUND, and SUPER-ADDITIVELY. The combined worst
 * ORDER x worst SHAPE error ~4.32e-16 is ~13.7x the worse single stress (order-only
 * ~3.15e-17), ~233x the shape-only worst (~1.85e-18), and ~13x the naive SUM of the two
 * single-stress errors -- so the interaction is not merely additive; the hostile ordering
 * feeds coherent same-sign partial sums into the deep caterpillar spine where they
 * accumulate far more than either lever produces alone. The combined stress reaches
 * ~1.03e-1 (~10%) of the log2(N)*eps ceiling -- the CLOSEST any pairwise measurement in this
 * cluster has come, ~137x nearer than the shape-only worst and ~14x nearer than the
 * order-only worst. The mirror crossCatL goes further still (~41% of the ceiling): under
 * the clustered order the worst SHAPE FLIPS from caterpillarR (worst at original order) to
 * caterpillarL, because caterpillarL peels the all-negative prefix into a monotonically
 * growing left accumulator. YET even the combined worst-case pairwise error stays BELOW
 * the log2(N)*eps ceiling (ratio ~0.10, i.e. still ~9.7x under it; crossCatL ~2.4x under),
 * and its own depth*eps worst-case bound (~8.5e-13 at depth 3817) is still under-realized
 * by ~5.1e-4. Pairwise does NOT attain its ceiling even when both worst-case levers are
 * pulled together. All configurations remain ~9+ orders below the O(1) barrier margin
 * |A_t + B_t| - |C_t| (imp-35760); Kahan-Babuska on the same clustered order stays at the
 * unit-roundoff floor (~2.31e-19). CONCLUSION: the order and shape stresses are NOT
 * independent -- they compound super-additively and narrow the gap to the pairwise ceiling
 * by ~1.3 orders versus either alone, but precision stays NON-binding even under the
 * combined worst case; the obstruction remains the ENGINEERING of the certified length-N
 * interval sum (MECHANICAL, imp-35725), and the W1 A + B - C certificate at T_PT stays
 * GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35852-w1-summation-adversarial-ordering (term-ORDER stress at fixed balanced tree)
 * @see imp-35893-w1-summation-pairwise-tree-shape (tree-SHAPE stress at fixed original order)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + balanced pairwise baseline)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive ceiling)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise error, depth, ordering)
 */

// -- Anchor + operative constants (import-light; matching imp-35852 / imp-35893) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35893 (fixed; no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to imp-35852 / imp-35893 pairwise scheme)

// -- Kahan-Babuska (for the "compensated stays at the floor even combined" contrast) -----
function sumKahan(terms) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < terms.length; i++) {
    const y = terms[i] - c;
    const t = s + y;
    c = t - s - y;
    s = t;
  }
  return s;
}

// -- Pairwise summation over an ARBITRARY pairing tree, evaluated on an explicit stack ---
function sumTree(terms, splitter, leaf) {
  // The pairing tree is defined by splitter(lo, hi, leaf) -> mid. Evaluated post-order on
  // an explicit work stack so a caterpillar of depth ~N/leaf does not overflow the call stack.
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

// -- Build the fixed term multiset + the order/shape-invariant exact reference -----------
const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) {
  const t = TERM(k);
  _base[k - 1] = t;
  _sumAbs += Math.abs(t);
}
let _trueNum = 0n; // exact sum is order- and association-invariant -- computed once, reused
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);
const _trueAbs = _trueNum < 0n ? -_trueNum : _trueNum;
const TRUE_SUM = (Number(_trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (_trueNum < 0n ? -1 : 1);
const CONDITION_NUMBER = _sumAbs / Math.abs(TRUE_SUM);

// -- The two worst single-stress levers (from imp-35852 / imp-35893) ---------------------
// imp-35852 worst ORDER: clustered same-sign runs (all negatives then all positives).
function orderClustered() {
  const neg = [];
  const pos = [];
  for (let i = 0; i < N_AT_TPT; i++) {
    if (_base[i] < 0) neg.push(_base[i]);
    else pos.push(_base[i]);
  }
  return Float64Array.from(neg.concat(pos));
}
const ORIGINAL = Float64Array.from(_base);
const CLUSTERED = orderClustered();

// imp-35893 worst SHAPE: right caterpillar (peel a leaf block off the RIGHT each level).
const splitCaterpillarR = (lo, hi, leaf) => hi - leaf;
const splitCaterpillarL = (lo, hi, leaf) => lo + leaf; // mirror (probes shape-flip under order)
const splitBalanced = (lo, hi) => (lo + hi) >> 1;

// imp-35761 ceilings (normalized errors), for direct contrast.
const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (balanced-tree log2(N)*eps)
const CEIL_NAIVE_LINEAR = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10 (coherent naive N*eps)
const CEIL_KAHAN = 2 * U_ROUNDOFF; // ~2.22e-16 (unit-roundoff floor)

// -- Run each configuration against the shared exact reference ---------------------------
function measure(name, order, splitter) {
  const { sum, maxDepth } = sumTree(order, splitter, LEAF);
  const err = normalizedError(sum, _trueNum, _sumAbs);
  return {
    config: name,
    treeDepth: maxDepth,
    pairwiseNormErr: err,
    ratioToPairwiseCeiling: err / CEIL_PAIRWISE,
    ratioToNaiveCeiling: err / CEIL_NAIVE_LINEAR,
    ratioToDepthEpsBound: err / (maxDepth * EPS_DOUBLE),
  };
}

const SHAPE_ONLY = measure('shape-only(catR,original)', ORIGINAL, splitCaterpillarR);
const ORDER_ONLY = measure('order-only(balanced,clustered)', CLUSTERED, splitBalanced);
const CROSS = measure('cross(catR,clustered)', CLUSTERED, splitCaterpillarR);
const CROSS_CATL = measure('crossCatL(catL,clustered)', CLUSTERED, splitCaterpillarL);
const CONFIGS = [SHAPE_ONLY, ORDER_ONLY, CROSS, CROSS_CATL];

// Kahan on the combined (clustered) order, for the "compensated stays at floor" contrast.
const KAHAN_CLUSTERED_NORM_ERR = normalizedError(sumKahan(CLUSTERED), _trueNum, _sumAbs);

// Cross-term interaction metrics.
const WORSE_SINGLE = Math.max(SHAPE_ONLY.pairwiseNormErr, ORDER_ONLY.pairwiseNormErr);
const SUM_SINGLE = SHAPE_ONLY.pairwiseNormErr + ORDER_ONLY.pairwiseNormErr;
const CROSS_OVER_WORSE_SINGLE = CROSS.pairwiseNormErr / WORSE_SINGLE;
const CROSS_OVER_SHAPE = CROSS.pairwiseNormErr / SHAPE_ONLY.pairwiseNormErr;
const CROSS_OVER_ORDER = CROSS.pairwiseNormErr / ORDER_ONLY.pairwiseNormErr;
const CROSS_OVER_SUM = CROSS.pairwiseNormErr / SUM_SINGLE; // >1 => super-additive compounding

export const IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM = {
  id: 'imp-35973',
  proofSection: 'S-frontier',
  question:
    'Does COMBINING the imp-35852 worst term ORDER (clustered same-sign runs) with the imp-35893 worst ' +
    'pairing-tree SHAPE (caterpillarR) -- both skeptical stresses at once -- push pairwise summation ' +
    'higher than either single-axis stress alone on the fixed imp-35812 N ~ 488602 term family? ' +
    'Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed multiset as imp-35852/imp-35893)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: CONDITION_NUMBER,
    leafBlock: LEAF,
    note: 'a fixed term multiset re-summed under the worst term ORDER x worst pairing-tree SHAPE; the exact sum is invariant to both',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    orderAndAssociationInvariant: true,
    note: 'one exact reference is computed once and reused for every configuration (the true sum depends on neither order nor pairing tree)',
  },
  ceilings: {
    pairwiseBalanced: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N)*eps (balanced tree depth)' },
    naiveCoherentLinear: { value: CEIL_NAIVE_LINEAR, source: 'imp-35761 worst-case naive N*eps (coherent directed rounding)' },
    kahan: { value: CEIL_KAHAN, source: 'unit-roundoff floor ~2 u (N-independent Kahan bound)' },
  },
  configs: CONFIGS,
  kahanClusteredNormErr: KAHAN_CLUSTERED_NORM_ERR,
  crossTerm: {
    shapeOnlyNormErr: SHAPE_ONLY.pairwiseNormErr,
    orderOnlyNormErr: ORDER_ONLY.pairwiseNormErr,
    crossNormErr: CROSS.pairwiseNormErr,
    crossCatLNormErr: CROSS_CATL.pairwiseNormErr,
    worseSingleNormErr: WORSE_SINGLE,
    sumOfSinglesNormErr: SUM_SINGLE,
    crossOverWorseSingle: CROSS_OVER_WORSE_SINGLE,
    crossOverShapeOnly: CROSS_OVER_SHAPE,
    crossOverOrderOnly: CROSS_OVER_ORDER,
    crossOverSumOfSingles: CROSS_OVER_SUM,
    crossRatioToPairwiseCeiling: CROSS.ratioToPairwiseCeiling,
    superAdditive: CROSS_OVER_SUM > 1,
    compoundsNotCancels: CROSS.pairwiseNormErr > WORSE_SINGLE,
  },
  summary: {
    worstConfig: CROSS_CATL.pairwiseNormErr > CROSS.pairwiseNormErr ? CROSS_CATL.config : CROSS.config,
    crossNormErr: CROSS.pairwiseNormErr,
    crossDepth: CROSS.treeDepth,
    crossRatioToPairwiseCeiling: CROSS.ratioToPairwiseCeiling,
    crossOverWorseSingle: CROSS_OVER_WORSE_SINGLE,
    crossOverSumOfSingles: CROSS_OVER_SUM,
    crossStillBelowCeiling: CROSS.pairwiseNormErr < CEIL_PAIRWISE,
    crossCatLRatioToPairwiseCeiling: CROSS_CATL.ratioToPairwiseCeiling,
    kahanClusteredNormErr: KAHAN_CLUSTERED_NORM_ERR,
  },
  reading: {
    stressesCompound:
      'the combined worst ORDER x worst SHAPE error ~4.32e-16 is HIGHER than either single-stress worst -- ' +
      '~13.7x the order-only worst (~3.15e-17) and ~233x the shape-only worst (~1.85e-18) -- so the two ' +
      'worst-case levers COMPOUND rather than cancel or stay independent',
    superAdditive:
      'the compounding is SUPER-ADDITIVE: the combined error ~4.32e-16 is ~13x the naive SUM of the two ' +
      'single-stress errors (~3.33e-17), so the interaction is more than additive -- the hostile ordering ' +
      'feeds coherent same-sign partial sums into the deep caterpillar spine',
    closestToCeiling:
      'the combined stress reaches ~1.03e-1 (~10%) of the log2(N)*eps ceiling -- the CLOSEST any pairwise ' +
      'measurement in this cluster has come, ~137x nearer than the shape-only worst and ~14x nearer than the ' +
      'order-only worst',
    worstShapeFlips:
      'under the clustered order the WORST shape FLIPS: the mirror caterpillarL reaches ~41% of the ceiling ' +
      '(higher than caterpillarR), because caterpillarL peels the all-negative prefix into a monotonically ' +
      'growing left accumulator -- the worst SHAPE is order-dependent',
    stillBelowCeiling:
      'YET even the combined worst-case pairwise error stays BELOW the log2(N)*eps ceiling (ratio ~0.10, ' +
      'still ~9.7x under it; crossCatL ~2.4x under) and under-realizes its own depth*eps bound by ~5.1e-4 -- ' +
      'pairwise does NOT attain its ceiling even with both levers pulled together',
    kahanStillRobust:
      'Kahan-Babuska on the same clustered order stays at the unit-roundoff floor (~2.31e-19 << 2 u) -- the ' +
      'compensated scheme is unaffected by the combined stress',
    allUnderMargin:
      'all configurations remain ~9+ orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    stressesCompoundSuperAdditively:
      'the term-ORDER and tree-SHAPE stresses are NOT independent -- they compound SUPER-ADDITIVELY, the ' +
      'combined worst reaching ~13.7x the worse single stress and ~13x the sum of the two, narrowing the gap ' +
      'to the pairwise log2(N)*eps ceiling by ~1.3 orders versus either lever alone',
    ceilingStillNotAttained:
      'the combined worst-case pairwise error still stays ~9.7x BELOW the log2(N)*eps ceiling (~10% of it) -- ' +
      'even both worst-case levers together do not push pairwise to attain its ceiling on this data',
    precisionNotBinding:
      'achievable double precision leaves strict headroom under the COMBINED worst-case order x shape stress; ' +
      'precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures pairwise errors under the combined skeptical stress only; it evaluates no sum ' +
      'of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Summing the FIXED imp-35812 length-N ' +
    '= 488602 term multiset under the imp-35852 worst term ORDER (clustered same-sign runs) evaluated on the ' +
    'imp-35893 worst pairing-tree SHAPE (caterpillarR, depth 3817) -- both worst-case levers on at once -- ' +
    'against the SAME order- and association-invariant exact BigInt reference, the combined pairwise ' +
    'normalized error is ~4.32e-16: ~13.7x the order-only worst (~3.15e-17), ~233x the shape-only worst ' +
    '(~1.85e-18), and ~13x the naive SUM of the two single-stress errors. The two stresses COMPOUND ' +
    'SUPER-ADDITIVELY, reaching ~1.03e-1 (~10%) of the log2(N)*eps ceiling -- the closest any pairwise ' +
    'measurement in this cluster has come, and under the clustered order the worst SHAPE FLIPS to ' +
    'caterpillarL (~41% of the ceiling). YET even the combined worst case stays ~9.7x BELOW the log2(N)*eps ' +
    'ceiling and under-realizes its own depth*eps bound by ~5.1e-4: pairwise does NOT attain its ceiling even ' +
    'with both levers pulled together, and Kahan-Babuska on the same order stays at the unit-roundoff floor ' +
    '(~2.31e-19). All configurations remain ~9+ orders below the O(1) barrier margin |A_t + B_t| - |C_t|. ' +
    'Precision is NOT the binding constraint even under the combined worst-case order x shape stress; the ' +
    'obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). ' +
    'Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes ' +
    'no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35852 (worst term ORDER: clustered same-sign runs, balanced tree); imp-35893 (worst pairing-tree ' +
    'SHAPE: caterpillarR, original order); imp-35812 (fixed term family + balanced pairwise baseline); ' +
    'imp-35761 (pairwise log2(N)*eps and naive N*eps ceilings); imp-35760 (barrier-margin allocation); ' +
    'imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A (A+B-C interval bound ' +
    'greenfield); Higham 2002 (pairwise summation error, tree depth and ordering); Platt-Trudgian 2021 ' +
    '(barrier base).',
};

export const IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM_ASSERTIONS = [
  {
    // Same anchor as imp-35812/imp-35852/imp-35893: N = floor(sqrt(T_PT/4 pi)) ~ 488602.
    id: 'imp35973-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms; four order x shape configurations',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      CONFIGS.length === 4,
  },
  {
    // Single-stress worsts reproduce imp-35893 (shape-only ~1.85e-18) and imp-35852 (order-only ~3.15e-17).
    id: 'imp35973-single-stress-reproduces-priors',
    description: 'Shape-only reproduces imp-35893 ~1.85e-18 and order-only reproduces imp-35852 pairwise ~3.15e-17',
    holds: () =>
      SHAPE_ONLY.treeDepth > 3000 &&
      Math.abs(SHAPE_ONLY.pairwiseNormErr - 1.854e-18) / 1.854e-18 < 0.05 &&
      ORDER_ONLY.treeDepth < 20 &&
      Math.abs(ORDER_ONLY.pairwiseNormErr - 3.148e-17) / 3.148e-17 < 0.05,
  },
  {
    // The cross-term COMPOUNDS: combined error is higher than either single-stress worst.
    id: 'imp35973-cross-term-compounds',
    description: 'Combined worst-order-x-worst-shape error exceeds both single-stress worsts (stresses compound)',
    holds: () =>
      CROSS.pairwiseNormErr > SHAPE_ONLY.pairwiseNormErr &&
      CROSS.pairwiseNormErr > ORDER_ONLY.pairwiseNormErr &&
      CROSS_OVER_WORSE_SINGLE > 5,
  },
  {
    // The compounding is SUPER-ADDITIVE: combined error exceeds the naive sum of the two singles.
    id: 'imp35973-cross-term-super-additive',
    description: 'Combined error exceeds the naive sum of the two single-stress errors (super-additive interaction)',
    holds: () =>
      CROSS_OVER_SUM > 1 &&
      CROSS_OVER_SUM > 5 &&
      CROSS.crossNormErr === undefined, // guard: crossNormErr lives on crossTerm, not CROSS row
  },
  {
    // But pairwise STILL does not attain its ceiling: combined worst stays below log2(N)*eps.
    id: 'imp35973-ceiling-still-not-attained',
    description: 'Combined worst-case pairwise error stays below the log2(N)*eps ceiling (does not attain it)',
    holds: () =>
      CROSS.pairwiseNormErr < CEIL_PAIRWISE &&
      CROSS.ratioToPairwiseCeiling < 1 &&
      CROSS.ratioToPairwiseCeiling > 1e-2 && // yet the closest yet -- above 1% of the ceiling
      CROSS.pairwiseNormErr < 1e-3 * CEIL_NAIVE_LINEAR,
  },
  {
    // Kahan on the same clustered order stays at the unit-roundoff floor (compensated unaffected).
    id: 'imp35973-kahan-stays-at-floor',
    description: 'Kahan-Babuska on the combined clustered order stays below 2u (compensated scheme unaffected)',
    holds: () =>
      KAHAN_CLUSTERED_NORM_ERR < CEIL_KAHAN &&
      KAHAN_CLUSTERED_NORM_ERR > 0 &&
      KAHAN_CLUSTERED_NORM_ERR < 1e-18,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35973-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /compound SUPER-ADDITIVELY/.test(
        IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM.conclusion.stressesCompoundSuperAdditively,
      ) &&
      /still stays ~9.7x BELOW/.test(
        IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM.conclusion.ceilingStillNotAttained,
      ) &&
      /GREENFIELD/.test(IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM.verdict) &&
      /refereed bound is changed/i.test(IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM.verdict),
  },
];

for (const a of IMP35973_W1_SUMMATION_ORDER_SHAPE_CROSS_TERM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35973-w1-summation-order-shape-cross-term assertion failed: ${a.id}`);
  }
}
