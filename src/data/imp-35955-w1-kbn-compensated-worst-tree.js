/**
 * @module imp-35955-w1-kbn-compensated-worst-tree
 *
 * imp-35955 (numerical, S-frontier): MEASURE whether adding per-node
 * Kahan-Babuska-Neumaier (KBN) compensation to the pairwise divide-and-conquer
 * COMBINE step neutralizes the imp-35893 pairing-tree SHAPE sensitivity -- in
 * particular whether it recovers the lost digits on the WORST tree (caterpillarR,
 * depth 3817), where uncompensated pairwise was weakest (~1.85e-18 normalized).
 *
 * imp-35893 held the imp-35812 oscillatory term multiset FIXED (N = 488602 at
 * T_PT) and varied only the pairing-tree SHAPE, finding uncompensated pairwise
 * normalized error spread across [~1.9e-20, ~1.85e-18] -- a ~98x spread that was
 * NON-MONOTONE in depth, with the right caterpillar (peel one leaf block off the
 * RIGHT each level, depth 3817) the WORST at ~1.85e-18 (~4.42e-4 of the
 * log2(N)*eps ceiling). That left the COMPLEMENTARY question unmeasured: is the
 * tree-shape penalty a fundamental property of the data, or an artifact of the
 * single-rounded plain combine that a compensated combine removes?
 *
 * This module answers it directly. It re-runs the SAME fixed multiset (identical
 * TERM(k), original order, LEAF = 128) on three tree shapes -- balanced midpoint,
 * left caterpillar, right caterpillar -- under a KBN-compensated pairwise sum in
 * which every leaf block is accumulated with Neumaier compensation and every
 * internal COMBINE keeps a running compensation term via a two-sum on the child
 * partial sums. The compensated result reported is the single double s + c. The
 * exact reference is the SAME association-invariant dyadic-BigInt sum imp-35893
 * used, so |compensatedResult - trueSum| is an EXACT BigInt for every shape.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity;
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED at N = 488602 (normalized by Sum|t_k| ~ 889.18):
 *   shape          depth   uncompensated   KBN-compensated   compensation gain
 *   balanced(0.5)     12    ~3.557e-19       ~1.892e-20        ~18.8x
 *   caterpillarL    3817    ~1.438e-19       ~1.892e-20         ~7.6x
 *   caterpillarR    3817    ~1.854e-18       ~1.892e-20        ~98.0x   (worst tree)
 *
 * READING: KBN compensation drives the WORST tree (caterpillarR) from ~1.854e-18
 * down to ~1.892e-20 -- a ~98x gain -- and lands it on EXACTLY the same value as
 * the balanced tree: the compensated returned double is BIT-IDENTICAL across all
 * three shapes (balanced == caterpillarL == caterpillarR as IEEE-754 doubles). The
 * ~98x uncompensated shape spread collapses to ZERO: tree-shape sensitivity
 * VANISHES under compensation. The common compensated floor ~1.892e-20 is
 * ~4.51e-6 of the log2(N)*eps ceiling (~4.20e-15) and matches the imp-35893
 * best-shape value (skew0.25) -- the single-rounding floor of the final s + c on
 * this multiset, reached by every tree once the per-combine error is compensated.
 * The uncompensated worst tree was NOT a fundamental data property but an artifact
 * of the plain single-rounded combine; the compensated combine removes it. As with
 * imp-35893, precision stays NON-binding: even the uncompensated worst error sat
 * >2000x below its ceiling, and compensation makes tree shape irrelevant. The
 * obstruction remains the ENGINEERING of the certified length-N interval sum
 * (MECHANICAL, imp-35725); the W1 A + B - C certificate at T_PT stays GREENFIELD
 * (imp-35681 Part A).
 *
 * @see imp-35893-w1-summation-pairwise-tree-shape (uncompensated tree-SHAPE sweep this compensates)
 * @see imp-35852-w1-summation-adversarial-ordering (term-ORDER stress)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + balanced pairwise baseline)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated / Kahan-Babuska-Neumaier summation)
 */

// -- Anchor + operative constants (import-light; matching imp-35893) ---------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35893 (fixed; no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to imp-35852 / imp-35893)

// -- Plain (uncompensated) pairwise over an ARBITRARY pairing tree, explicit stack -------
function sumTreePlain(terms, splitter, leaf) {
  // The pairing tree is defined by splitter(lo, hi) -> mid, evaluated post-order on an
  // explicit work stack so a caterpillar of depth ~N/leaf does not overflow the call stack.
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
      if (mid <= f.lo) mid = f.lo + 1;
      if (mid >= f.hi) mid = f.hi - 1;
      f.mid = mid;
      f.stage = 1;
      stack.push({ lo: f.lo, hi: mid, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else if (f.stage === 1) {
      f.leftVal = result;
      f.stage = 2;
      stack.push({ lo: f.mid, hi: f.hi, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else {
      result = f.leftVal + result; // plain single-rounded combine
      stack.pop();
    }
  }
  return { sum: result, maxDepth };
}

// -- KBN-compensated pairwise over the SAME pairing tree ---------------------------------
function sumTreeKBN(terms, splitter, leaf) {
  // Each leaf block is accumulated with Neumaier compensation, returning (s, c). Each
  // internal COMBINE two-sums the child partial sums (s1, s2) and folds the exact rounding
  // error e together with both child compensations into a running compensation. The
  // compensated result reported is the single double s + c.
  const n = terms.length;
  let maxDepth = 0;
  const stack = [{ lo: 0, hi: n, depth: 0, stage: 0, leftS: 0, leftC: 0, mid: 0 }];
  let rS = 0; // value of most-recently-completed frame
  let rC = 0; // its running compensation
  while (stack.length) {
    const f = stack[stack.length - 1];
    if (f.depth > maxDepth) maxDepth = f.depth;
    if (f.hi - f.lo <= leaf) {
      let s = 0;
      let c = 0;
      for (let i = f.lo; i < f.hi; i++) {
        const x = terms[i];
        const t = s + x;
        // Neumaier: accumulate the lost low-order bits into the compensation c.
        if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
        else c += (x - t) + s;
        s = t;
      }
      rS = s;
      rC = c;
      stack.pop();
      continue;
    }
    if (f.stage === 0) {
      let mid = splitter(f.lo, f.hi, leaf);
      if (mid <= f.lo) mid = f.lo + 1;
      if (mid >= f.hi) mid = f.hi - 1;
      f.mid = mid;
      f.stage = 1;
      stack.push({ lo: f.lo, hi: mid, depth: f.depth + 1, stage: 0, leftS: 0, leftC: 0, mid: 0 });
    } else if (f.stage === 1) {
      f.leftS = rS;
      f.leftC = rC;
      f.stage = 2;
      stack.push({ lo: f.mid, hi: f.hi, depth: f.depth + 1, stage: 0, leftS: 0, leftC: 0, mid: 0 });
    } else {
      const s1 = f.leftS;
      const s2 = rS;
      const t = s1 + s2;
      // Exact rounding error of the combine addition (two-sum branch on magnitude).
      const e = Math.abs(s1) >= Math.abs(s2) ? (s1 - t) + s2 : (s2 - t) + s1;
      rS = t;
      rC = f.leftC + rC + e; // fold both child compensations and the combine error
      stack.pop();
    }
  }
  return { sum: rS + rC, rawSum: rS, comp: rC, maxDepth };
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) ---------
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

// -- Build the fixed term multiset + the shape-invariant exact reference -----------------
const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) {
  const t = TERM(k);
  _base[k - 1] = t;
  _sumAbs += Math.abs(t);
}
let _trueNum = 0n; // exact sum is association-invariant -- computed once, reused for all trees
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);

// -- Pairing-tree shapes measured (balanced + both caterpillars; imp-35893 worst = right) -
const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1],
  ['caterpillarL', (lo, hi, leaf) => lo + leaf],
  ['caterpillarR', (lo, hi, leaf) => hi - leaf],
];

const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 balanced log2(N)*eps ceiling

// -- Run plain vs KBN on every shape against the shared exact reference -------------------
const SHAPES = TREE_SHAPES.map(([name, splitter]) => {
  const plain = sumTreePlain(_base, splitter, LEAF);
  const kbn = sumTreeKBN(_base, splitter, LEAF);
  const uncompErr = normalizedError(plain.sum, _trueNum, _sumAbs);
  const kbnErr = normalizedError(kbn.sum, _trueNum, _sumAbs);
  return {
    shape: name,
    treeDepth: plain.maxDepth,
    uncompensatedNormErr: uncompErr,
    kbnNormErr: kbnErr,
    compensationGain: uncompErr / kbnErr, // factor by which KBN reduces the error
    kbnRawDouble: kbn.sum, // the reported compensated double s + c (for bit-identity check)
    kbnRatioToPairwiseCeiling: kbnErr / CEIL_PAIRWISE,
  };
});

const BY_SHAPE = Object.fromEntries(SHAPES.map((r) => [r.shape, r]));
const BALANCED = BY_SHAPE['balanced(0.5)'];
const CATERPILLAR_R = BY_SHAPE['caterpillarR'];
const CATERPILLAR_L = BY_SHAPE['caterpillarL'];

// Uncompensated worst tree (imp-35893 identified caterpillarR); its compensation gain.
const UNCOMP_WORST = SHAPES.reduce((a, b) => (b.uncompensatedNormErr > a.uncompensatedNormErr ? b : a));
// KBN shape spread: max/min of the compensated errors across shapes (== 1 if bit-identical).
const KBN_ERR_MAX = Math.max(...SHAPES.map((r) => r.kbnNormErr));
const KBN_ERR_MIN = Math.min(...SHAPES.map((r) => r.kbnNormErr));
const KBN_SHAPE_SPREAD = KBN_ERR_MAX / KBN_ERR_MIN;
const UNCOMP_ERR_MAX = Math.max(...SHAPES.map((r) => r.uncompensatedNormErr));
const UNCOMP_ERR_MIN = Math.min(...SHAPES.map((r) => r.uncompensatedNormErr));
const UNCOMP_SHAPE_SPREAD = UNCOMP_ERR_MAX / UNCOMP_ERR_MIN;
// Bit-identity of the compensated returned double across all measured shapes.
const KBN_BIT_IDENTICAL = SHAPES.every((r) => r.kbnRawDouble === BALANCED.kbnRawDouble);

export const IMP35955_W1_KBN_COMPENSATED_WORST_TREE = {
  id: 'imp-35955',
  proofSection: 'S-frontier',
  question:
    'Does per-node Kahan-Babuska-Neumaier compensation of the pairwise COMBINE step recover the digits ' +
    'lost on the imp-35893 WORST tree (caterpillarR, ~1.85e-18), and does it make tree-shape sensitivity ' +
    'vanish, on the fixed imp-35812 N ~ 488602 term family? Measurement only; certifies no W1 bound; ' +
    'changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed multiset as imp-35893)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    sumAbs: _sumAbs,
    leafBlock: LEAF,
    note: 'a fixed term multiset (original order) re-summed under three pairing-tree SHAPES, plain vs KBN-compensated',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    associationInvariant: true,
    note: 'one exact reference is computed once and reused for every tree shape and both schemes',
  },
  compensation: {
    scheme: 'Kahan-Babuska-Neumaier: leaf blocks accumulated with Neumaier compensation; each internal ' +
      'combine two-sums the child partial sums and folds the exact rounding error plus both child ' +
      'compensations into a running compensation; reported result is the single double s + c',
    reportedResult: 's + c (single double)',
  },
  ceiling: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N)*eps (balanced tree depth)' },
  shapes: SHAPES,
  summary: {
    balancedUncompErr: BALANCED.uncompensatedNormErr,
    balancedKbnErr: BALANCED.kbnNormErr,
    balancedGain: BALANCED.compensationGain,
    caterpillarRUncompErr: CATERPILLAR_R.uncompensatedNormErr,
    caterpillarRKbnErr: CATERPILLAR_R.kbnNormErr,
    caterpillarRGain: CATERPILLAR_R.compensationGain,
    caterpillarLGain: CATERPILLAR_L.compensationGain,
    uncompensatedWorstShape: UNCOMP_WORST.shape,
    uncompensatedShapeSpread: UNCOMP_SHAPE_SPREAD,
    kbnShapeSpread: KBN_SHAPE_SPREAD,
    kbnBitIdenticalAcrossShapes: KBN_BIT_IDENTICAL,
    kbnCommonFloorNormErr: BALANCED.kbnNormErr,
    kbnFloorRatioToCeiling: BALANCED.kbnRatioToPairwiseCeiling,
  },
  reading: {
    worstTreeRecovered:
      'KBN compensation drives the WORST tree (caterpillarR, depth 3817) from ~1.854e-18 down to ' +
      '~1.892e-20 -- a ~98x compensation gain -- the largest gain of the three shapes because it had the ' +
      'most to recover',
    shapeSensitivityVanishes:
      'the compensated returned double is BIT-IDENTICAL across balanced, caterpillarL and caterpillarR ' +
      '(same IEEE-754 double), so the ~98x uncompensated shape spread collapses to exactly 1: tree-shape ' +
      'sensitivity VANISHES under compensation',
    commonFloorIsSingleRounding:
      'all three shapes reach the same compensated floor ~1.892e-20 (~4.51e-6 of the log2(N)*eps ceiling), ' +
      'matching the imp-35893 best-shape (skew0.25) value -- the single-rounding floor of the final s + c ' +
      'on this multiset',
    worstTreeWasArtifact:
      'the uncompensated worst tree was NOT a fundamental data property but an artifact of the plain ' +
      'single-rounded combine, which the compensated combine removes',
  },
  conclusion: {
    compensationNeutralizesShape:
      'per-node Kahan-Babuska-Neumaier compensation recovers the digits lost on the worst pairing tree ' +
      '(~98x on caterpillarR) and makes the returned double independent of tree shape (bit-identical); ' +
      'tree-shape sensitivity vanishes under compensation',
    precisionNotBinding:
      'even the uncompensated worst error sat >2000x below its ceiling (imp-35893); compensation makes ' +
      'tree shape irrelevant, so achievable precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures compensated pairwise errors under worst-case tree shapes only; it evaluates ' +
      'no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running the imp-35812 fixed ' +
    'length-N = 488602 term multiset (original order) under three pairing-tree SHAPES -- balanced midpoint ' +
    'and left/right caterpillars (depth 3817) -- with a Kahan-Babuska-Neumaier-compensated pairwise sum ' +
    '(Neumaier leaf accumulation + two-sum combine folding the exact rounding error into a running ' +
    'compensation, reported as the single double s + c), against the SAME association-invariant exact ' +
    'BigInt reference, the compensation drives the imp-35893 WORST tree (caterpillarR) from ~1.854e-18 to ' +
    '~1.892e-20 -- a ~98x gain -- and lands EVERY shape on a BIT-IDENTICAL compensated double. The ~98x ' +
    'uncompensated tree-shape spread collapses to exactly 1: tree-shape sensitivity VANISHES under ' +
    'compensation, all shapes reaching the common single-rounding floor ~1.892e-20 (~4.51e-6 of the ' +
    'log2(N)*eps ceiling), matching the imp-35893 best-shape value. The uncompensated worst tree was an ' +
    'artifact of the plain single-rounded combine, not a fundamental data property. As with imp-35893, ' +
    'precision is NOT the binding constraint; the obstruction stays the ENGINEERING of the certified ' +
    'length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35893 (uncompensated tree-SHAPE sweep this compensates; caterpillarR worst); imp-35852 ' +
    '(term-ORDER stress); imp-35812 (fixed term family + balanced pairwise baseline); imp-35761 (pairwise ' +
    'log2(N)*eps ceiling); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A ' +
    '(A+B-C interval bound greenfield); Higham 2002 (compensated / Kahan-Babuska-Neumaier summation); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP35955_W1_KBN_COMPENSATED_WORST_TREE_ASSERTIONS = [
  {
    // Same anchor as imp-35893: N = floor(sqrt(T_PT/4 pi)) ~ 488602; 3 tree shapes, both schemes.
    id: 'imp35955-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms; 3 pairing-tree shapes, plain vs KBN',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      SHAPES.length === 3,
  },
  {
    // Reproduce the imp-35893 uncompensated caterpillarR worst error ~1.854e-18 (within 2%).
    id: 'imp35955-reproduces-imp35893-worst',
    description: 'Uncompensated caterpillarR reproduces the imp-35893 worst error ~1.854e-18 (within 2%)',
    holds: () =>
      CATERPILLAR_R.treeDepth > 3000 &&
      Math.abs(CATERPILLAR_R.uncompensatedNormErr - 1.854e-18) / 1.854e-18 < 0.02 &&
      UNCOMP_WORST.shape === 'caterpillarR',
  },
  {
    // KBN recovers the worst tree by a large factor: caterpillarR gain > 50x.
    id: 'imp35955-worst-tree-recovered',
    description: 'KBN compensation gains >50x on the worst tree (caterpillarR ~1.85e-18 -> ~1.9e-20)',
    holds: () =>
      CATERPILLAR_R.compensationGain > 50 &&
      CATERPILLAR_R.kbnNormErr < CATERPILLAR_R.uncompensatedNormErr &&
      CATERPILLAR_R.kbnNormErr < 1e-19,
  },
  {
    // Tree-shape sensitivity VANISHES: the compensated double is bit-identical across all shapes.
    id: 'imp35955-shape-sensitivity-vanishes',
    description: 'KBN compensated double is bit-identical across all shapes; shape spread collapses to 1',
    holds: () =>
      KBN_BIT_IDENTICAL === true &&
      Math.abs(KBN_SHAPE_SPREAD - 1) < 1e-12 &&
      UNCOMP_SHAPE_SPREAD > 5,
  },
  {
    // The common compensated floor sits well below the log2(N)*eps ceiling (~4.5e-6 of it).
    id: 'imp35955-common-floor-below-ceiling',
    description: 'Common KBN floor ~1.9e-20 is ~4.5e-6 of the log2(N)*eps ceiling and equal for all shapes',
    holds: () =>
      BALANCED.kbnRatioToPairwiseCeiling < 1e-5 &&
      BALANCED.kbnRatioToPairwiseCeiling > 0 &&
      Math.abs(CATERPILLAR_R.kbnNormErr - BALANCED.kbnNormErr) / BALANCED.kbnNormErr < 1e-9,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35955-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35955_W1_KBN_COMPENSATED_WORST_TREE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /tree-shape sensitivity vanishes under compensation/.test(
        IMP35955_W1_KBN_COMPENSATED_WORST_TREE.conclusion.compensationNeutralizesShape,
      ) &&
      /GREENFIELD/.test(IMP35955_W1_KBN_COMPENSATED_WORST_TREE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35955_W1_KBN_COMPENSATED_WORST_TREE.verdict) &&
      /refereed bound is changed/i.test(IMP35955_W1_KBN_COMPENSATED_WORST_TREE.verdict),
  },
];

for (const a of IMP35955_W1_KBN_COMPENSATED_WORST_TREE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35955-w1-kbn-compensated-worst-tree assertion failed: ${a.id}`);
  }
}
