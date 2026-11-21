/**
 * @module imp-36056-kbn-caterpillarL-argmax-shape
 *
 * imp-36056 (numerical, S-frontier): does Kahan-Babuska-Neumaier (KBN) compensated summation
 * ALSO floor the imp-36020 caterpillarL ARG-MAX pairing (the true worst SHAPE under the
 * imp-35852 clustered same-sign order, ~41.2% of the log2(N)*eps ceiling), or does the deep
 * left-caterpillar spine defeat compensation?
 *
 * BACKGROUND. imp-36023 showed KBN keeps the imp-35852 clustered same-sign SEQUENTIAL order at
 * the unit-roundoff floor N-uniformly across the imp-35812 ladder. imp-36020 then located
 * caterpillarL as the true worst pairing-tree SHAPE (~4.12e-1 of the log2(N)*eps ceiling) under
 * that same clustered order -- BUT compensation was measured only on the SEQUENTIAL order, never
 * on the worst-shape pairing tree itself. A left caterpillar is NOT a linear left-to-right scan:
 * with the imp-35893 splitter mid = lo + leaf it peels a leaf block off the left and recurses on
 * the remainder, so the tree is a right-nested chain of combines whose spine reaches depth ~3817
 * at N ~ 488602. This module applies KBN compensation to THAT tree and asks whether the deep
 * spine defeats sequential compensation or whether the ~41.2% ceiling fraction collapses to the
 * roundoff floor.
 *
 * WHAT IS COMPENSATED. Each leaf block is summed with the KBN recurrence (returning a running
 * sum s and a compensation c, kept separate). Each internal combine adds the two child sums with
 * a Neumaier two-sum whose exact roundoff e is captured, and propagates a single compensation
 * c_node = c_left + c_right + e up the tree; the reported value is s_root + c_root. Every rounded
 * addition in the tree -- leaf accumulation AND every spine combine -- thus contributes its
 * roundoff to one propagated Neumaier compensation. This is the tree-shaped analogue of the
 * sequential KBN in imp-36023.
 *
 * MEASURED at N = 488602 (clustered same-sign order; caterpillarL splitter mid = lo + leaf,
 * depth 3817; normalized by Sum|t_k|; against the SAME order- and association-invariant exact
 * 2^{-96} dyadic-BigInt reference used by imp-36020 / imp-36023):
 *   scheme                          normalized err   err / log2(N)*eps ceiling   err / u
 *   uncompensated caterpillarL      ~1.731e-15       ~4.124e-1  (= imp-36020 arg-max)   ~1.6e1
 *   KBN-compensated caterpillarL    ~1.892e-20       ~4.51e-6                            ~1.70e-4
 *
 * FINDING (measurement only): KBN compensation DOES floor the worst-shape caterpillarL pairing.
 * The deep left-caterpillar spine does NOT defeat sequential compensation -- it drives the
 * ~41.2% ceiling fraction down by a factor of ~9.1e4 to ~4.51e-6 of the ceiling, i.e. ~1.70e-4
 * of the unit roundoff u = 2^{-53} ~ 1.11e-16. Strikingly, the compensated caterpillarL value
 * (~1.892e-20) is IDENTICAL (to the measured precision) to the imp-36023 sequential-KBN floor at
 * the same N ~ 488602 (~1.89e-20): once every spine roundoff is captured by the propagated
 * Neumaier compensation, the worst SHAPE lands on exactly the same roundoff floor as the worst
 * ORDER summed sequentially -- the pairing geometry that made caterpillarL the uncompensated
 * arg-max no longer matters once the additions are compensated. So compensation closes BOTH
 * worst-case levers (order AND shape) to the same floor. Precision stays overwhelmingly
 * NON-binding under the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); the obstruction
 * remains the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725), and the
 * W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality;
 * changes no bound; establishes no positivity; C_mb GUE-conditional (imp-486) untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36023-kbn-combined-worst-ladder (KBN floor on the clustered SEQUENTIAL order across the ladder)
 * @see imp-36020-w1-clustered-order-shape-argmax (caterpillarL arg-max ~41.2% of the ceiling; compensation never applied)
 * @see imp-35973-w1-summation-order-shape-cross-term (fixed-shape order-x-shape cross-term)
 * @see imp-35893-w1-summation-pairwise-tree-shape (tree-SHAPE stress; caterpillar spine)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36020 / imp-36023) ---------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)
const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35852 / imp-35893 / imp-36020 / imp-36023 (fixed; no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to the imp-35852 / imp-35893 / imp-36020 pairwise scheme)

// -- Uncompensated pairwise tree over an arbitrary pairing (imp-36020, explicit stack) ---
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
      result = f.leftVal + result; // combine left + right (single rounded addition)
      stack.pop();
    }
  }
  return { sum: result, maxDepth };
}

// -- KBN-compensated pairwise tree -------------------------------------------------------
// Each leaf block: KBN recurrence returning (s, c) kept separate. Each combine: Neumaier
// two-sum of the two child sums whose exact roundoff e is captured; a single compensation
// c_node = c_left + c_right + e is propagated up the tree. Reported value = s_root + c_root.
function twoSumNeumaier(a, b) {
  const s = a + b;
  const e = Math.abs(a) >= Math.abs(b) ? (a - s) + b : (b - s) + a;
  return { s, e };
}
function sumTreeKBN(terms, splitter, leaf) {
  const n = terms.length;
  const stack = [{ lo: 0, hi: n, stage: 0, leftS: 0, leftC: 0, mid: 0 }];
  let rs = 0; // result sum of the last-finished subtree
  let rc = 0; // result compensation of the last-finished subtree
  while (stack.length) {
    const f = stack[stack.length - 1];
    if (f.hi - f.lo <= leaf) {
      let s = 0;
      let c = 0;
      for (let i = f.lo; i < f.hi; i++) {
        const x = terms[i];
        const t = s + x;
        if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
        else c += (x - t) + s;
        s = t;
      }
      rs = s;
      rc = c;
      stack.pop();
      continue;
    }
    if (f.stage === 0) {
      let mid = splitter(f.lo, f.hi, leaf);
      if (mid <= f.lo) mid = f.lo + 1;
      if (mid >= f.hi) mid = f.hi - 1;
      f.mid = mid;
      f.stage = 1;
      stack.push({ lo: f.lo, hi: mid, stage: 0, leftS: 0, leftC: 0, mid: 0 });
    } else if (f.stage === 1) {
      f.leftS = rs; // left child finished
      f.leftC = rc;
      f.stage = 2;
      stack.push({ lo: f.mid, hi: f.hi, stage: 0, leftS: 0, leftC: 0, mid: 0 });
    } else {
      const { s, e } = twoSumNeumaier(f.leftS, rs); // combine child sums; capture roundoff
      rs = s;
      rc = f.leftC + rc + e; // propagate both child compensations plus the combine roundoff
      stack.pop();
    }
  }
  return rs + rc; // Neumaier: add the propagated compensation once at the end
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) ---------
const FRAC_BITS = 96n;
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

// -- Build the fixed term multiset + the order/shape-invariant exact reference -----------
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

// -- The imp-36020 arg-max SHAPE: caterpillarL (mid = lo + leaf) -------------------------
const CATERPILLAR_L_SPLIT = (lo, hi, leaf) => lo + leaf;

const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (balanced-tree log2(N)*eps)

// -- Measure uncompensated vs KBN-compensated caterpillarL on the clustered order --------
const _uncomp = sumTree(CLUSTERED, CATERPILLAR_L_SPLIT, LEAF);
const UNCOMP_ERR = normalizedError(_uncomp.sum, _trueNum, _sumAbs);
const _kbn = sumTreeKBN(CLUSTERED, CATERPILLAR_L_SPLIT, LEAF);
const KBN_ERR = normalizedError(_kbn, _trueNum, _sumAbs);

const UNCOMP_RATIO = UNCOMP_ERR / CEIL_PAIRWISE; // ~0.412 (reproduces imp-36020 arg-max)
const KBN_RATIO = KBN_ERR / CEIL_PAIRWISE;
const KBN_OVER_U = KBN_ERR / U_ROUNDOFF;
const REDUCTION_FACTOR = UNCOMP_ERR / KBN_ERR; // how far compensation drives the arg-max down
const KBN_SEQ_IMP36023 = 1.89e-20; // imp-36023 sequential-KBN floor at N ~ 488602 (for comparison)

export const IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE = {
  id: 'imp-36056',
  proofSection: 'S-frontier',
  question:
    'Does KBN compensated summation ALSO floor the imp-36020 caterpillarL ARG-MAX pairing (the true worst ' +
    'SHAPE under the imp-35852 clustered order, ~41.2% of the log2(N)*eps ceiling), or does the deep ' +
    'left-caterpillar spine defeat compensation? imp-36023 measured the KBN floor only on the clustered ' +
    'SEQUENTIAL order, never on the worst-shape pairing tree. Measurement only; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed multiset as imp-36020/imp-36023)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    leafBlock: LEAF,
    termOrder: 'clustered same-sign runs (all negatives, then all positives) -- imp-35852 worst ORDER',
    shape: 'caterpillarL (mid = lo + leaf) -- imp-36020 worst SHAPE under the clustered order',
    treeDepth: _uncomp.maxDepth,
    negativeCount: _neg.length,
    positiveCount: _pos.length,
    note: 'the arg-max order-x-shape configuration from imp-36020, now evaluated with and without KBN compensation',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    orderAndAssociationInvariant: true,
    note: 'one exact reference is computed once and reused for both schemes (the true sum is order- and pairing-invariant)',
  },
  ceiling: {
    pairwiseBalanced: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N)*eps (balanced tree depth)' },
    unitRoundoff: U_ROUNDOFF,
  },
  schemes: {
    uncompensated: {
      normErr: UNCOMP_ERR,
      ratioToPairwiseCeiling: UNCOMP_RATIO,
      note: 'reproduces the imp-36020 caterpillarL arg-max (~1.73e-15, ~41.2% of the ceiling)',
    },
    kbnCompensated: {
      normErr: KBN_ERR,
      ratioToPairwiseCeiling: KBN_RATIO,
      overUnitRoundoff: KBN_OVER_U,
      note: 'propagated Neumaier compensation over every leaf-sum and spine-combine roundoff',
    },
    reductionFactor: REDUCTION_FACTOR,
    kbnSequentialImp36023: KBN_SEQ_IMP36023,
  },
  reading: {
    kbnFloorsTheWorstShape:
      'KBN compensation DOES floor the worst-shape caterpillarL pairing: it drives the ~41.2% ceiling fraction ' +
      'down by a factor of ~9.1e4 to ~4.51e-6 of the ceiling, i.e. ~1.70e-4 of the unit roundoff u ~ 1.11e-16',
    spineDoesNotDefeatCompensation:
      'the deep left-caterpillar spine (depth ~3817) does NOT defeat sequential compensation -- capturing every ' +
      'spine-combine roundoff into the propagated Neumaier term collapses the arg-max error to the roundoff floor',
    matchesSequentialFloor:
      'the compensated caterpillarL value (~1.892e-20) is IDENTICAL (to the measured precision) to the imp-36023 ' +
      'sequential-KBN floor at the same N ~ 488602 (~1.89e-20): the worst SHAPE lands on the SAME roundoff floor ' +
      'as the worst ORDER summed sequentially -- the pairing geometry no longer matters once additions are compensated',
    bothLeversClosed:
      'compensation closes BOTH worst-case levers (order AND shape) to the same floor; the geometry that made ' +
      'caterpillarL the uncompensated arg-max is neutralized by capturing its per-addition roundoffs',
    allUnderMargin:
      'both schemes remain many orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision ' +
      'is NOT the binding constraint',
  },
  conclusion: {
    kbnFloorsCaterpillarL:
      'KBN compensated summation floors the imp-36020 caterpillarL arg-max SHAPE to ~1.89e-20 (~1.70e-4 of unit ' +
      'roundoff), a ~9.1e4x reduction from the uncompensated ~41.2% ceiling fraction; the deep spine does NOT ' +
      'defeat compensation',
    shapeAndOrderMeetSameFloor:
      'the compensated worst-shape tree lands on the SAME roundoff floor as the imp-36023 sequential worst-order ' +
      'KBN (~1.89e-20), so compensation neutralizes both worst-case levers to a common floor',
    precisionNotBinding:
      'even the compensated worst order-x-shape configuration leaves overwhelming strict headroom under the ' +
      'ceiling and the O(1) barrier margin; precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures pairwise errors under the skeptical order-x-shape arg-max only; it evaluates no sum ' +
      'of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 ' +
      'Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Applying Kahan-Babuska-Neumaier (KBN) ' +
    'compensated summation to the imp-36020 caterpillarL ARG-MAX pairing tree (the true worst SHAPE under the ' +
    'imp-35852 clustered same-sign ORDER, depth ~3817) on the fixed imp-35812 length-N = 488602 oscillatory ' +
    'multiset, against the SAME order- and association-invariant exact BigInt reference, drives the normalized ' +
    'error from the uncompensated ~1.731e-15 (~4.124e-1 of the log2(N)*eps ceiling, reproducing the imp-36020 ' +
    'arg-max) down to ~1.892e-20 -- a ~9.1e4x reduction, ~4.51e-6 of the ceiling and ~1.70e-4 of the unit ' +
    'roundoff u = 2^{-53} ~ 1.11e-16. The deep left-caterpillar spine does NOT defeat sequential compensation: ' +
    'capturing every leaf-sum and spine-combine roundoff into a single propagated Neumaier compensation collapses ' +
    'the arg-max error to the roundoff floor. Strikingly the compensated caterpillarL value (~1.892e-20) is ' +
    'IDENTICAL to the imp-36023 sequential-KBN floor at the same N ~ 488602 (~1.89e-20) -- the worst SHAPE lands ' +
    'on exactly the SAME roundoff floor as the worst ORDER summed sequentially, so the pairing geometry that made ' +
    'caterpillarL the uncompensated arg-max no longer matters once the additions are compensated; compensation ' +
    'closes BOTH worst-case levers (order AND shape) to a common floor. Both schemes remain many orders below ' +
    'the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision is NOT the binding constraint. The ' +
    'obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). Certifies ' +
    'no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A); C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36023 (KBN floor on the clustered SEQUENTIAL order across the ladder; sequential floor ~1.89e-20 at ' +
    'N ~ 488602); imp-36020 (caterpillarL arg-max ~41.2% of the ceiling, compensation never applied); imp-35973 ' +
    '(fixed-shape order-x-shape cross-term); imp-35893 (caterpillar pairing SHAPE); imp-35852 (clustered worst ' +
    'ORDER); imp-35812 (fixed term family + N ladder); imp-35761 (pairwise log2(N)*eps ceiling); imp-35760 ' +
    '(barrier-margin allocation); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A ' +
    '(A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); Higham 2002, Neumaier 1974 ' +
    '(compensated summation).',
};

export const IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE_ASSERTIONS = [
  {
    // Same anchor as imp-36020: N ~ 488602, caterpillarL depth ~3817, clustered order splits the signs.
    id: 'imp36056-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602; caterpillarL depth ~3817; clustered order splits the signs',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      _uncomp.maxDepth > 3000 &&
      _neg.length + _pos.length === N_AT_TPT &&
      _neg.length > 2e5 && _pos.length > 2e5,
  },
  {
    // Uncompensated caterpillarL reproduces the imp-36020 arg-max (~1.73e-15, ~41.2% of the ceiling).
    id: 'imp36056-uncompensated-reproduces-imp36020',
    description: 'Uncompensated caterpillarL reproduces the imp-36020 arg-max ~1.73e-15 (~41.2% of the ceiling)',
    holds: () =>
      Math.abs(UNCOMP_ERR - 1.7305e-15) / 1.7305e-15 < 0.05 &&
      UNCOMP_RATIO > 0.35 && UNCOMP_RATIO < 0.5,
  },
  {
    // KBN floors the worst SHAPE: below unit roundoff by ~3-4 orders (KBN/u < 0.01).
    id: 'imp36056-kbn-floors-worst-shape',
    description: 'KBN drives the caterpillarL arg-max to the roundoff floor (below unit roundoff, KBN/u < 0.01)',
    holds: () =>
      KBN_ERR > 0 && KBN_ERR < 1e-18 &&
      KBN_OVER_U < 0.01 &&
      KBN_RATIO < 1e-4,
  },
  {
    // The reduction from the uncompensated arg-max is large (compensation is not defeated by the spine).
    id: 'imp36056-large-reduction-factor',
    description: 'KBN reduces the caterpillarL arg-max error by a factor > 1e4 (spine does not defeat compensation)',
    holds: () => REDUCTION_FACTOR > 1e4,
  },
  {
    // Compensated worst SHAPE lands on the SAME floor as the imp-36023 sequential worst ORDER (~1.89e-20).
    id: 'imp36056-matches-sequential-floor',
    description: 'Compensated caterpillarL floor matches the imp-36023 sequential-KBN floor ~1.89e-20',
    holds: () => Math.abs(KBN_ERR - KBN_SEQ_IMP36023) / KBN_SEQ_IMP36023 < 0.05,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36056-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /floors the imp-36020 caterpillarL/.test(
        IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE.conclusion.kbnFloorsCaterpillarL,
      ) &&
      /GREENFIELD/.test(IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE.verdict) &&
      /refereed bound is changed/i.test(IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE.verdict),
  },
];

for (const a of IMP36056_KBN_CATERPILLARL_ARGMAX_SHAPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36056-kbn-caterpillarL-argmax-shape assertion failed: ${a.id}`);
  }
}
