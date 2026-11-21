/**
 * @module imp-35952-w1-caterpillar-worst-tree-n-ladder
 *
 * imp-35952 (numerical, S-frontier): MEASURE whether the imp-35893 caterpillarR
 * worst-tree pairwise normalized error is an N-INDEPENDENT FLOOR or SCALES with N,
 * by sweeping the maximally-unbalanced caterpillarR pairing-tree SHAPE across the
 * imp-35890 N-ladder (N = 1e3, 1e4, 1e5, 4.886e5) at a fixed leaf block -- rather
 * than at the single fixed N = 488602 that imp-35893 measured.
 *
 * imp-35893 found the caterpillarR tree (peel a leaf-sized block off the RIGHT each
 * level, depth ~N/leaf) is the WORST pairwise pairing-tree SHAPE on the fixed
 * imp-35812 oscillatory multiset at N = 488602: normalized error ~1.85e-18, ~4.42e-4
 * of the log2(N)*eps ceiling. But a caterpillar has depth ~N/leaf, so its
 * worst-case depth*eps error bound GROWS ~linearly with N, while the balanced
 * log2(N)*eps ceiling grows only logarithmically. imp-35893 measured only ONE N,
 * leaving the N-scaling of the ACHIEVED caterpillarR error unmeasured: does it track
 * the growing depth*eps envelope, or stay an N-independent floor?
 *
 * This module holds the SHAPE fixed (caterpillarR) and the term family fixed (the
 * imp-35812 oscillatory multiset, original order) and sweeps only N across the
 * imp-35890 ladder [1e3, 1e4, 1e5, N_AT_TPT]. For each N it re-runs the SAME
 * explicit-stack pairwise tree of imp-35893 (so no JS call-stack overflow at depth
 * ~3817), scores it against the SAME association-invariant exact dyadic-BigInt
 * reference, and tabulates the achieved caterpillarR error and its ratio to both the
 * depth*eps envelope (this tree's own worst case) and the log2(N)*eps ceiling
 * (the balanced-tree reference) vs N. A balanced-tree run at each N is carried for
 * the floor/ceiling contrast.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity;
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED (caterpillarR, fixed shape; sweeping N; err normalized by Sum|t_k|):
 *   N          depthR   caterpillarR err   err/(log2(N)*eps)   err/(depth*eps)
 *   1e3            7       ~8.06e-18          ~3.64e-3           ~5.19e-3
 *   1e4           78       ~3.86e-18          ~1.31e-3           ~2.23e-4
 *   1e5          781       ~2.86e-18          ~7.76e-4           ~1.65e-5
 *   4.886e5     3817       ~1.85e-18          ~4.42e-4           ~2.19e-6   (imp-35893 rung)
 *
 * READING: across a ~489x range of N the caterpillarR depth grows ~545x (7 -> 3817,
 * tracking N/leaf), so its depth*eps worst-case bound grows ~linearly with N -- from
 * ~1.55e-15 up to ~8.5e-13. But the ACHIEVED caterpillarR error does NOT track that
 * envelope: it stays in a narrow [~1.85e-18, ~8.06e-18] band -- a ~4.3x spread -- and
 * actually DECREASES with N (the top rung is the LOWEST, not the highest). So the
 * error is an N-independent FLOOR, not a growing-with-depth quantity: the ratio to
 * the depth*eps envelope COLLAPSES ~2400x (from ~5.19e-3 at N=1e3 to ~2.19e-6 at
 * N=488602), and the ratio to the log2(N)*eps ceiling also falls (~3.64e-3 ->
 * ~4.42e-4). The per-addition rounding errors do not accumulate coherently along the
 * lengthening caterpillar spine on this cancellation-heavy multiset, so the
 * depth-proportional worst case is a vast over-estimate that grows unboundedly
 * relative to the achieved error. This EXTENDS the imp-35893 single-N finding to the
 * whole N-ladder: caterpillarR remains far below its ceiling at every N, and the gap
 * WIDENS with N rather than closing. Precision stays NON-binding under the
 * worst-case pairing-tree shape across the entire N-ladder; the obstruction remains
 * the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725),
 * and the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35893-w1-summation-pairwise-tree-shape (worst tree SHAPE at fixed N=488602; this sweeps N)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the N = 1e3 .. 4.886e5 ladder this reuses)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed oscillatory term family + balanced baseline)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive ceiling)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise summation error and tree depth)
 */

// -- Anchor + operative constants (import-light; matching imp-35893 / imp-35890) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same representative oscillatory term as imp-35812 / imp-35893 (fixed; deterministic, no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to imp-35893 / imp-35852 pairwise scheme)

// The imp-35890 growth ladder (identical sizes to imp-35812 / imp-35890) + the T_PT run.
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];

// -- Pairwise summation over an ARBITRARY pairing tree, evaluated on an explicit stack ---
function sumTree(terms, splitter, leaf) {
  // The pairing tree is defined by splitter(lo, hi, leaf) -> mid. Evaluated post-order on
  // an explicit work stack so a caterpillar of depth ~N/leaf does not overflow the call stack.
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

// -- Pairing-tree shapes: the fixed worst SHAPE (caterpillarR) + balanced baseline -------
const CATERPILLAR_R = (lo, hi, leaf) => hi - leaf; // peel a leaf-sized block off the RIGHT
const BALANCED = (lo, hi) => (lo + hi) >> 1; // imp-35852 balanced midpoint (contrast)

// imp-35761 ceilings depend on N; evaluate per rung below.
const CEIL_PAIRWISE_OF = (n) => Math.log2(n) * EPS_DOUBLE; // balanced-tree log2(N)*eps ceiling
const CEIL_NAIVE_LINEAR_OF = (n) => n * EPS_DOUBLE; // coherent naive N*eps ceiling

// -- Sweep caterpillarR (and balanced) across the N-ladder against exact references ------
function scanAt(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n; // exact sum is association-invariant -- one reference per N, reused for both trees
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);

  const { sum: sumR, maxDepth: depthR } = sumTree(base, CATERPILLAR_R, LEAF);
  const { sum: sumB, maxDepth: depthB } = sumTree(base, BALANCED, LEAF);
  const errR = normalizedError(sumR, trueNum, sumAbs);
  const errB = normalizedError(sumB, trueNum, sumAbs);

  const ceilPairwise = CEIL_PAIRWISE_OF(N);
  const depthEpsEnvelope = depthR * EPS_DOUBLE; // caterpillarR own worst-case depth*eps bound
  return {
    N,
    sumAbs,
    caterpillarDepth: depthR,
    balancedDepth: depthB,
    caterpillarNormErr: errR,
    balancedNormErr: errB,
    depthEpsEnvelope,
    ratioToPairwiseCeiling: errR / ceilPairwise, // fraction of the balanced log2(N)*eps ceiling
    ratioToDepthEpsEnvelope: errR / depthEpsEnvelope, // fraction of this tree's own depth*eps bound
    ratioToNaiveCeiling: errR / CEIL_NAIVE_LINEAR_OF(N),
    caterpillarOverBalanced: errR / errB,
  };
}

const LADDER = LADDER_SIZES.map(scanAt);
const AT_TPT = LADDER[LADDER.length - 1]; // the imp-35893 rung (N ~ 488602)
const AT_BOTTOM = LADDER[0]; // N = 1e3

// Floor vs growth diagnostics.
const MAX_CAT_ERR = Math.max(...LADDER.map((r) => r.caterpillarNormErr));
const MIN_CAT_ERR = Math.min(...LADDER.map((r) => r.caterpillarNormErr));
const ERR_SPREAD = MAX_CAT_ERR / MIN_CAT_ERR;
const DEPTH_SWEEP_FACTOR = AT_TPT.caterpillarDepth / AT_BOTTOM.caterpillarDepth;
// If achieved error tracked depth*eps, ratioToDepthEpsEnvelope would stay ~flat; if a floor,
// it COLLAPSES as depth grows. Measure the collapse factor across the ladder.
const DEPTH_EPS_RATIO_COLLAPSE = AT_BOTTOM.ratioToDepthEpsEnvelope / AT_TPT.ratioToDepthEpsEnvelope;
const IS_N_INDEPENDENT_FLOOR = AT_TPT.caterpillarNormErr <= AT_BOTTOM.caterpillarNormErr && ERR_SPREAD < 100;

export const IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER = {
  id: 'imp-35952',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35893 caterpillarR worst-tree pairwise normalized error an N-INDEPENDENT FLOOR, or does it ' +
    'SCALE with N along the growing depth*eps envelope? Sweep the fixed maximally-unbalanced caterpillarR ' +
    'SHAPE across the imp-35890 N-ladder (N = 1e3 .. 4.886e5) on the fixed imp-35812 multiset with exact ' +
    'BigInt reference. Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed multiset as imp-35893)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    leafBlock: LEAF,
    fixedShape: 'caterpillarR (peel a leaf-sized block off the RIGHT each level, depth ~N/leaf)',
    note: 'the SHAPE and term family are held fixed; only N is swept across the imp-35890 ladder',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    associationInvariant: true,
    note: 'one exact reference is computed per N and reused for both the caterpillarR and balanced trees',
  },
  ladder: LADDER.map((r) => ({
    N: r.N,
    caterpillarDepth: r.caterpillarDepth,
    balancedDepth: r.balancedDepth,
    caterpillarNormErr: r.caterpillarNormErr,
    balancedNormErr: r.balancedNormErr,
    depthEpsEnvelope: r.depthEpsEnvelope,
    ratioToPairwiseCeiling: r.ratioToPairwiseCeiling,
    ratioToDepthEpsEnvelope: r.ratioToDepthEpsEnvelope,
    caterpillarOverBalanced: r.caterpillarOverBalanced,
  })),
  summary: {
    bottomN: AT_BOTTOM.N,
    bottomCaterpillarErr: AT_BOTTOM.caterpillarNormErr,
    bottomDepth: AT_BOTTOM.caterpillarDepth,
    topN: AT_TPT.N,
    topCaterpillarErr: AT_TPT.caterpillarNormErr,
    topDepth: AT_TPT.caterpillarDepth,
    depthSweepFactor: DEPTH_SWEEP_FACTOR,
    errSpread: ERR_SPREAD,
    maxCaterpillarErr: MAX_CAT_ERR,
    minCaterpillarErr: MIN_CAT_ERR,
    depthEpsRatioCollapse: DEPTH_EPS_RATIO_COLLAPSE,
    isNIndependentFloor: IS_N_INDEPENDENT_FLOOR,
    topRatioToPairwiseCeiling: AT_TPT.ratioToPairwiseCeiling,
    topRatioToDepthEpsEnvelope: AT_TPT.ratioToDepthEpsEnvelope,
  },
  reading: {
    reproducesImp35893AtTPT:
      'the top rung (N ~ 488602) reproduces the imp-35893 caterpillarR error ~1.85e-18 (~4.42e-4 of the ' +
      'log2(N)*eps ceiling), confirming the same shape, scheme, and term family',
    depthGrowsLinearlyWithN:
      'the caterpillarR depth grows ~545x (7 -> 3817) across the ~489x N-range, tracking N/leaf, so its ' +
      'depth*eps worst-case bound grows ~linearly with N (from ~1.55e-15 up to ~8.5e-13)',
    achievedErrorIsFloorNotGrowth:
      'the ACHIEVED caterpillarR error does NOT track that growing envelope: it stays in a ~4.3x band ' +
      '[~1.85e-18, ~8.06e-18] and DECREASES with N (the top rung is the LOWEST), so it is an N-independent floor',
    depthEpsRatioCollapses:
      'because the error is a floor while depth*eps grows, the ratio to the depth*eps envelope COLLAPSES ' +
      '~2400x (from ~5.19e-3 at N=1e3 to ~2.19e-6 at N=488602) and the ratio to the log2(N)*eps ceiling falls too',
    gapWidensWithN:
      'the caterpillarR gap to its worst-case bound WIDENS with N rather than closing -- the per-addition ' +
      'rounding errors do not accumulate coherently along the lengthening caterpillar spine on this ' +
      'cancellation-heavy multiset',
  },
  conclusion: {
    caterpillarErrorIsNIndependentFloor:
      'the caterpillarR worst-tree pairwise error is an N-INDEPENDENT FLOOR, not a quantity scaling with the ' +
      'growing depth*eps envelope; sweeping N across the imp-35890 ladder the achieved error stays flat/decreasing ' +
      'while its depth-proportional worst-case bound grows ~linearly with N',
    depthProportionalBoundIsVastOverEstimate:
      'the depth*eps worst case is a vast over-estimate that grows unboundedly relative to the achieved error; ' +
      'the ratio collapses across the ladder rather than approaching 1',
    precisionNotBindingAcrossLadder:
      'precision stays NON-binding under the worst-case pairing-tree shape across the entire N-ladder; the ' +
      'obstruction remains the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725)',
    staysGreenfield:
      'this module sweeps caterpillarR pairwise errors across N only; it evaluates no sum of H_t and verifies ' +
      'no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Sweeping the FIXED maximally-unbalanced ' +
    'caterpillarR pairing-tree SHAPE across the imp-35890 N-ladder (N = 1e3, 1e4, 1e5, 488602) on the fixed ' +
    'imp-35812 oscillatory multiset against a per-N association-invariant exact BigInt reference, the caterpillarR ' +
    'depth grows ~545x (7 -> 3817, tracking N/leaf) so its depth*eps worst-case bound grows ~linearly with N ' +
    '(from ~1.55e-15 up to ~8.5e-13), yet the ACHIEVED caterpillarR normalized error stays in a ~4.3x band ' +
    '[~1.85e-18, ~8.06e-18] and DECREASES with N (the top rung reproduces the imp-35893 value ~1.85e-18 and is ' +
    'the LOWEST, not the highest). The achieved error is therefore an N-INDEPENDENT FLOOR, not a quantity ' +
    'tracking the growing depth*eps envelope: the ratio to that envelope COLLAPSES ~2400x across the ladder ' +
    '(~5.19e-3 -> ~2.19e-6) and the ratio to the log2(N)*eps ceiling falls too (~3.64e-3 -> ~4.42e-4). The gap ' +
    'to the depth-proportional worst case WIDENS with N -- the per-addition rounding errors do not accumulate ' +
    'coherently along the lengthening caterpillar spine on this cancellation-heavy data. This EXTENDS the ' +
    'imp-35893 single-N finding to the whole ladder: caterpillarR stays far below its ceiling at every N and the ' +
    'gap widens with N rather than closing. Precision is NOT the binding constraint under the worst-case ' +
    'pairing-tree shape across the entire N-ladder; the obstruction stays the ENGINEERING of the certified ' +
    'length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates ' +
    'no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C ' +
    'certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35893 (caterpillarR worst tree SHAPE at fixed N=488602 this extends across N); imp-35890 (the ' +
    'N = 1e3 .. 4.886e5 ladder reused); imp-35812 (fixed oscillatory term family + balanced baseline); ' +
    'imp-35761 (pairwise log2(N)*eps and naive N*eps ceilings); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) ' +
    'retained terms); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (pairwise summation ' +
    'error and tree depth); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER_ASSERTIONS = [
  {
    // N-ladder anchored: 4 rungs, last = floor(sqrt(T_PT/4 pi)) ~ 488602 (the imp-35893 rung).
    id: 'imp35952-n-ladder-anchor',
    description: 'N-ladder [1e3, 1e4, 1e5, N_AT_TPT] with last rung floor(sqrt(T_PT/4 pi)) ~ 488602; 4 rungs',
    holds: () =>
      LADDER.length === 4 &&
      LADDER[0].N === 1000 && LADDER[1].N === 10000 && LADDER[2].N === 100000 &&
      AT_TPT.N === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      AT_TPT.N > 4.8e5 && AT_TPT.N < 4.9e5,
  },
  {
    // Top rung reproduces the imp-35893 caterpillarR error ~1.854e-18 (within 2%).
    id: 'imp35952-top-rung-reproduces-imp35893',
    description: 'Top rung (N ~ 488602) reproduces the imp-35893 caterpillarR error ~1.854e-18 (within 2%)',
    holds: () =>
      AT_TPT.caterpillarDepth > 3000 &&
      Math.abs(AT_TPT.caterpillarNormErr - 1.854e-18) / 1.854e-18 < 0.02 &&
      Math.abs(AT_TPT.ratioToPairwiseCeiling - 4.418e-4) / 4.418e-4 < 0.02,
  },
  {
    // The caterpillarR depth grows ~linearly with N (N/leaf): >100x across the ladder to >3000.
    id: 'imp35952-depth-grows-linearly-with-n',
    description: 'CaterpillarR depth grows ~N/leaf across the ladder: >100x, top depth >3000',
    holds: () =>
      AT_TPT.caterpillarDepth > 3000 &&
      DEPTH_SWEEP_FACTOR > 100 &&
      LADDER.every((r) => r.caterpillarDepth >= Math.floor(r.N / LEAF) - 2 &&
                          r.caterpillarDepth <= Math.floor(r.N / LEAF) + 2),
  },
  {
    // The ACHIEVED error is an N-INDEPENDENT FLOOR: narrow band, top rung not above bottom rung.
    id: 'imp35952-achieved-error-is-n-independent-floor',
    description: 'Achieved caterpillarR error is an N-independent floor: <100x spread, top rung not above bottom',
    holds: () =>
      IS_N_INDEPENDENT_FLOOR === true &&
      ERR_SPREAD < 100 &&
      AT_TPT.caterpillarNormErr <= AT_BOTTOM.caterpillarNormErr &&
      MAX_CAT_ERR < 1e-17,
  },
  {
    // Because the error is a floor while depth*eps grows, the ratio to depth*eps COLLAPSES.
    id: 'imp35952-depth-eps-ratio-collapses',
    description: 'Ratio to the depth*eps envelope collapses >100x across the ladder (floor, not growth)',
    holds: () =>
      DEPTH_EPS_RATIO_COLLAPSE > 100 &&
      AT_TPT.ratioToDepthEpsEnvelope < AT_BOTTOM.ratioToDepthEpsEnvelope &&
      AT_TPT.ratioToDepthEpsEnvelope < 1e-5,
  },
  {
    // Every rung stays strictly below its log2(N)*eps ceiling (worst tree never attains it).
    id: 'imp35952-every-rung-below-log2n-eps-ceiling',
    description: 'CaterpillarR stays below the log2(N)*eps ceiling at every N (worst tree never attains it)',
    holds: () =>
      LADDER.every((r) =>
        r.caterpillarNormErr > 0 &&
        r.ratioToPairwiseCeiling < 1e-2 &&
        r.caterpillarNormErr < CEIL_PAIRWISE_OF(r.N)),
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35952-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /N-INDEPENDENT FLOOR/.test(
        IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER.conclusion.caterpillarErrorIsNIndependentFloor,
      ) &&
      /GREENFIELD/.test(IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER.verdict),
  },
];

for (const a of IMP35952_W1_CATERPILLAR_WORST_TREE_N_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35952-w1-caterpillar-worst-tree-n-ladder assertion failed: ${a.id}`);
  }
}
