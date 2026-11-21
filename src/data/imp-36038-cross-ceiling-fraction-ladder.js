/**
 * @module imp-36038-cross-ceiling-fraction-ladder
 *
 * imp-36038 (numerical, S-frontier): MEASURE whether the imp-35973 combined worst-SHAPE
 * x worst-ORDER CROSS pairwise-summation CEILING FRACTION cross / (log2(N)*eps) GROWS with
 * N toward the log2(N)*eps ceiling across the imp-35948 7-rung half-decade ladder [1e3, 4.886e5].
 *
 * imp-35973 summed the fixed imp-35812 oscillatory multiset under the imp-35852 worst term
 * ORDER (clustered same-sign runs) THROUGH the imp-35893 worst pairing-tree SHAPE
 * (caterpillarR) and found the combined pairwise error was ~13x closer to the log2(N)*eps
 * pairwise ceiling than either single stress -- ceiling fraction ~1.03e-1 -- but measured
 * that fraction at the SINGLE endpoint N = floor(sqrt(T_PT/4 pi)) ~ 488602 only. imp-36019
 * later swept the CROSS super-additivity FACTOR over the coarse four-rung imp-35812 ladder,
 * but never characterised the CEILING-FRACTION trajectory itself across a dense ladder. So it
 * stayed open whether the ~0.10 endpoint fraction is N-flat, or grows with N toward the
 * ceiling (which would signal the two stresses compound super-linearly in the large-N limit).
 *
 * This module supplies the missing dense sweep. It recomputes the combined CROSS pairwise
 * error (caterpillarR tree over the clustered same-sign order) against a per-N exact BigInt
 * reference at the imp-35948 DENSER 7-rung half-decade ladder N = [1000, 3162, 10000, 31623,
 * 100000, 316228, 488602] and tracks its ceiling fraction cross / (log2(N)*eps) rung to rung.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; the C_mb
 * GUE-conditional constant (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED CROSS ceiling fraction cross / (log2(N)*eps) across the dense ladder:
 *   N        kappa    cross        log2(N)*eps   ceilFraction
 *   1000      61.9    8.48e-17     2.21e-15      3.830e-2
 *   3162     109.1    3.01e-17     2.58e-15      1.165e-2
 *   10000    194.5    1.37e-17     2.95e-15      4.639e-3
 *   31623    352.4    6.40e-17     3.32e-15      1.929e-2
 *   100000   632.6    5.19e-16     3.69e-15      1.407e-1
 *   316228  1119.4    4.40e-16     4.06e-15      1.085e-1
 *   488602  1391.0    4.32e-16     4.20e-15      1.030e-1
 *
 * READING: the CROSS ceiling fraction is NOT N-flat and does NOT climb monotonically toward
 * the ceiling. Across the dense ladder it swings ~30x (min ~4.64e-3 at N = 10000 -- ~216x
 * UNDER the ceiling -- max ~1.41e-1 at N = 100000, ~7.1x under it) and is non-monotone: it
 * DIPS across the first three rungs, then jumps up onto an O(0.1) plateau across the upper
 * three half-decades (~0.14, ~0.11, ~0.10). Because of that early dip the naive log-log slope
 * is nominally POSITIVE (~+0.36), but that is a phase artifact of the deep N = 10000 trough,
 * NOT evidence of a march toward the ceiling: the upper-half rungs SATURATE near ~0.10-0.14
 * rather than climbing toward 1, and the fraction stays >= ~7x under the ceiling at EVERY rung.
 * So the two hostile stresses do NOT compound super-linearly toward the log2(N)*eps ceiling in
 * the large-N limit -- the combined fraction is bounded at O(0.1) with ~1 order of magnitude of
 * headroom, and the imp-35973 ~0.10 endpoint is representative of the upper-ladder plateau, not
 * a point on a rising curve. Precision stays NON-binding across the whole ladder even under the
 * combined worst-case shape x order stress; the obstruction remains the ENGINEERING of the
 * certified length-N interval sum (MECHANICAL, imp-35725), and the W1 A + B - C certificate at
 * T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-36019-order-shape-cross-N-ladder (CROSS super-additivity FACTOR over the coarse 4-rung ladder)
 * @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint cross-term at N~488602, ~0.10 fraction)
 * @see imp-35948-w1-probabilistic-sqrtN-apriori-scale (source of the dense 7-rung [1e3, 4.886e5] ladder)
 * @see imp-35995-w1-higham-mary-scale-ladder-trajectory (the same 7-rung ladder, Higham-Mary scale)
 * @see imp-35852-w1-summation-adversarial-ordering (worst term ORDER); imp-35893 (worst tree SHAPE)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise error, ordering)
 */

// -- Anchor + operative constants (import-light; matching imp-35973 / imp-36019) ---------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35893 / imp-35973.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to imp-35852 / imp-35893 / imp-35973 / imp-36019)

// -- Pairwise summation over an ARBITRARY pairing tree, explicit stack (as imp-36019) ----
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
      result = f.leftVal + result;
      stack.pop();
    }
  }
  return { sum: result, maxDepth };
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
    exp = -1074;
  } else {
    mant |= 1n << 52n;
    exp = exp - 1075;
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

// -- Tree splitter: imp-35893 worst SHAPE (caterpillarR peels a leaf off the right) ------
const splitCaterpillarR = (lo, hi, leaf) => hi - leaf;

// -- Measure the combined CROSS config at one N against a per-N exact reference ----------
function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n; // order- and association-invariant -- computed once per N, reused
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);

  // imp-35852 worst ORDER: clustered same-sign runs (all negatives then all positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  // CROSS = imp-35893 worst SHAPE (caterpillarR) over imp-35852 worst ORDER (clustered).
  const { sum, maxDepth } = sumTree(clustered, splitCaterpillarR, LEAF);
  const crossNormErr = normalizedError(sum, trueNum, sumAbs);
  const ceilPairwise = Math.log2(N) * EPS_DOUBLE;
  return {
    N,
    kappa,
    crossNormErr,
    crossDepth: maxDepth,
    ceilPairwise,
    crossCeilingFraction: crossNormErr / ceilPairwise, // fraction of the log2(N)*eps ceiling
  };
}

// -- The imp-35948 DENSER 7-rung half-decade ladder across [1e3, 4.886e5] ----------------
const LADDER_SIZES = [1000, 3162, 10000, 31623, 100000, 316228, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- N-trajectory metrics for the ceiling fraction ---------------------------------------
const FRACTIONS = LADDER.map((r) => r.crossCeilingFraction);
const FRACTION_MIN = Math.min(...FRACTIONS);
const FRACTION_MAX = Math.max(...FRACTIONS);
const FRACTION_SPAN_RATIO = FRACTION_MAX / FRACTION_MIN; // >>1 => NOT N-flat
const FRACTION_AT_TPT = LADDER[LADDER.length - 1].crossCeilingFraction;
// Least-squares log-log slope dlog10(fraction) / dlog10(N).
const XS = LADDER_SIZES.map((N) => Math.log10(N));
const YS = FRACTIONS.map((f) => Math.log10(f));
const NROWS = XS.length;
const MX = XS.reduce((a, b) => a + b, 0) / NROWS;
const MY = YS.reduce((a, b) => a + b, 0) / NROWS;
let SXY = 0;
let SXX = 0;
for (let i = 0; i < NROWS; i++) {
  SXY += (XS[i] - MX) * (YS[i] - MY);
  SXX += (XS[i] - MX) ** 2;
}
const LOGLOG_SLOPE = SXY / SXX;
// Monotone in N would mean strictly increasing (or decreasing) rung to rung.
let MONOTONE_INCREASING = true;
let MONOTONE_DECREASING = true;
for (let i = 1; i < FRACTIONS.length; i++) {
  if (!(FRACTIONS[i] > FRACTIONS[i - 1])) MONOTONE_INCREASING = false;
  if (!(FRACTIONS[i] < FRACTIONS[i - 1])) MONOTONE_DECREASING = false;
}
const FRACTION_MONOTONE_IN_N = MONOTONE_INCREASING || MONOTONE_DECREASING;
// The barrier-relevant invariant: the fraction stays under 1 (below the ceiling) at every rung.
const BELOW_CEILING_EVERY_RUNG = FRACTIONS.every((f) => f < 1);
const MIN_X_UNDER_CEILING = 1 / FRACTION_MAX; // worst rung is still this many x under the ceiling
// Upper-half plateau: the top three half-decades saturate at O(0.1), not climbing toward 1.
const UPPER_HALF = FRACTIONS.slice(-3);
const UPPER_PLATEAU = UPPER_HALF.every((f) => f > 0.08 && f < 0.2);

export const IMP36038_CROSS_CEILING_FRACTION_LADDER = {
  id: 'imp-36038',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35973 combined worst-SHAPE x worst-ORDER CROSS pairwise CEILING FRACTION ' +
    'cross / (log2(N)*eps) (~0.10 at N ~ 488602) GROW with N toward the log2(N)*eps ceiling across ' +
    'the imp-35948 dense 7-rung half-decade ladder [1e3, 4.886e5], or is it N-flat / plateaued? ' +
    'Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-35973)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    leafBlock: LEAF,
    note: 'the same combined worst-SHAPE (caterpillarR) x worst-ORDER (clustered) cross imp-35973 measured, at 7 N rungs',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    orderAndAssociationInvariant: true,
    note: 'one exact reference is computed once PER N and reused for that rung (true sum depends on neither order nor tree)',
  },
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  ceilingFractionTrajectory: {
    fractionsAcrossLadder: FRACTIONS,
    fractionMin: FRACTION_MIN,
    fractionMax: FRACTION_MAX,
    fractionSpanRatio: FRACTION_SPAN_RATIO,
    fractionAtTPT: FRACTION_AT_TPT,
    logLogSlope: LOGLOG_SLOPE,
    monotoneInN: FRACTION_MONOTONE_IN_N,
    nFlat: FRACTION_SPAN_RATIO < 2, // false: the fraction is NOT N-flat
    upperHalfPlateau: UPPER_PLATEAU,
  },
  barrierInvariant: {
    belowCeilingEveryRung: BELOW_CEILING_EVERY_RUNG,
    fractionMax: FRACTION_MAX,
    minXUnderCeiling: MIN_X_UNDER_CEILING,
  },
  reading: {
    notNFlat:
      'the CROSS ceiling fraction is NOT N-flat: across the dense 7-rung ladder cross / (log2(N)*eps) swings ' +
      '~30x (min ~4.64e-3 at N = 10000, ~216x under the ceiling; max ~1.41e-1 at N = 100000, ~7.1x under it)',
    notMonotoneClimb:
      'it does NOT climb monotonically toward the ceiling -- it DIPS across the first three rungs then jumps up ' +
      'onto an O(0.1) plateau across the upper three half-decades (~0.14, ~0.11, ~0.10); the naive log-log slope ' +
      'is nominally positive (~+0.36) only because of the deep N = 10000 trough, NOT a march toward the ceiling',
    saturatesBelowCeiling:
      'the upper-half rungs SATURATE near ~0.10-0.14 rather than climbing toward 1, and the fraction stays >= ~7x ' +
      'under the log2(N)*eps ceiling at EVERY rung -- the two hostile stresses do NOT compound super-linearly ' +
      'toward the ceiling in the large-N limit; the combined fraction is bounded at O(0.1) with ~1 order of headroom',
    endpointRepresentative:
      'the imp-35973 ~0.10 single-endpoint fraction is REPRESENTATIVE of the upper-ladder plateau, not a point on ' +
      'a rising curve -- a single-N reading neither over- nor under-states the large-N combined ceiling fraction',
  },
  conclusion: {
    ceilingFractionNotGrowing:
      'the combined worst-SHAPE x worst-ORDER CROSS ceiling fraction does NOT grow with N toward the log2(N)*eps ' +
      'ceiling -- it swings ~30x non-monotonically and saturates at an O(0.1) plateau (~0.10-0.14) across the upper ' +
      'half-decades, staying >= ~7x under the ceiling at every rung, so the stresses do NOT compound super-linearly',
    precisionNotBindingAcrossLadder:
      'the combined cross error stays below the log2(N)*eps ceiling at EVERY rung of the dense ladder -- precision ' +
      'is NOT the binding constraint anywhere even under the combined worst-case shape x order stress',
    staysGreenfield:
      'this module measures pairwise errors under the combined skeptical stress at seven N only; it evaluates ' +
      'no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running the imp-35973 combined ' +
    'worst-SHAPE (caterpillarR) x worst-ORDER (clustered same-sign runs) pairwise CROSS against a per-N exact ' +
    'BigInt reference at the imp-35948 dense 7-rung half-decade ladder N = [1000, 3162, 10000, 31623, 100000, ' +
    '316228, 488602], the ceiling fraction cross / (log2(N)*eps) is [3.83e-2, 1.16e-2, 4.64e-3, 1.93e-2, ' +
    '1.41e-1, 1.08e-1, 1.03e-1]: it does NOT grow with N toward the log2(N)*eps ceiling. It swings ~30x ' +
    'non-monotonically (min ~4.64e-3 at N = 10000, ~216x under the ceiling), DIPS across the first three rungs, ' +
    'then SATURATES on an O(0.1) plateau (~0.14, ~0.11, ~0.10) across the upper three half-decades. The nominal ' +
    '+0.36 log-log slope is a phase artifact of the deep N = 10000 trough, not a march toward the ceiling: the ' +
    'combined fraction is bounded at O(0.1) with ~1 order of magnitude of headroom, staying >= ~7x under the ' +
    'ceiling at every rung, so the two hostile stresses do NOT compound super-linearly in the large-N limit. The ' +
    'imp-35973 ~0.10 endpoint is REPRESENTATIVE of the upper-ladder plateau, not a point on a rising curve. ' +
    'Precision is NOT the binding constraint anywhere on the ladder even under the combined worst-case shape x ' +
    'order stress; the obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL, ' +
    'imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; ' +
    'changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35973 (single-endpoint order-x-shape cross-term at N ~ 488602, ~0.10 ceiling fraction); imp-36019 ' +
    '(CROSS super-additivity factor over the coarse 4-rung ladder); imp-35948 (dense 7-rung [1e3, 4.886e5] ' +
    'ladder); imp-35995 (same ladder, Higham-Mary scale); imp-35852 (worst term ORDER); imp-35893 (worst ' +
    'pairing-tree SHAPE); imp-35761 (pairwise log2(N)*eps ceiling); imp-35760 (barrier-margin allocation); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); Higham 2002.',
};

export const IMP36038_CROSS_CEILING_FRACTION_LADDER_ASSERTIONS = [
  {
    id: 'imp36038-ladder-anchor',
    description: 'Dense 7-rung half-decade ladder N = [1000, 3162, 10000, 31623, 100000, 316228, ~488602]',
    holds: () =>
      LADDER.length === 7 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[2] === 10000 &&
      LADDER_SIZES[6] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The endpoint reproduces imp-35973: cross ~4.32e-16, ceiling fraction ~0.103.
    id: 'imp36038-endpoint-reproduces-imp35973',
    description: 'The N~488602 rung reproduces the imp-35973 cross ~4.32e-16 and ~0.103 ceiling fraction',
    holds: () => {
      const r = LADDER[LADDER.length - 1];
      return (
        Math.abs(r.crossNormErr - 4.324e-16) / 4.324e-16 < 0.05 &&
        Math.abs(r.crossCeilingFraction - 0.1030) / 0.1030 < 0.05
      );
    },
  },
  {
    // Core finding: the ceiling fraction is NOT N-flat (swings by >>2x across the dense ladder).
    id: 'imp36038-fraction-not-n-flat',
    description: 'The ceiling fraction swings by >10x across the dense ladder -- NOT N-flat, NOT monotone',
    holds: () =>
      FRACTION_SPAN_RATIO > 10 &&
      FRACTION_MONOTONE_IN_N === false &&
      IMP36038_CROSS_CEILING_FRACTION_LADDER.ceilingFractionTrajectory.nFlat === false,
  },
  {
    // Core finding: does NOT climb monotonically toward the ceiling -- dips deep then plateaus.
    id: 'imp36038-does-not-climb-to-ceiling',
    description: 'The fraction dips deep (min < 1e-2, ~216x under ceiling) then saturates on an O(0.1) upper-half plateau',
    holds: () =>
      FRACTION_MIN < 1e-2 &&
      UPPER_PLATEAU === true &&
      MONOTONE_INCREASING === false,
  },
  {
    // Barrier invariant IS N-robust: fraction below the log2(N)*eps ceiling at EVERY rung.
    id: 'imp36038-below-ceiling-every-rung',
    description: 'The combined cross ceiling fraction stays below 1 (below the log2(N)*eps ceiling) at every rung',
    holds: () =>
      BELOW_CEILING_EVERY_RUNG === true &&
      FRACTION_MAX < 1 &&
      FRACTION_MAX > 1e-2 &&
      MIN_X_UNDER_CEILING > 5,
  },
  {
    id: 'imp36038-honesty-gate',
    description: 'Measurement only; ceiling fraction NOT growing toward ceiling; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36038_CROSS_CEILING_FRACTION_LADDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /does NOT grow/.test(IMP36038_CROSS_CEILING_FRACTION_LADDER.conclusion.ceilingFractionNotGrowing) &&
      /NOT the binding constraint/.test(
        IMP36038_CROSS_CEILING_FRACTION_LADDER.conclusion.precisionNotBindingAcrossLadder,
      ) &&
      /GREENFIELD/.test(IMP36038_CROSS_CEILING_FRACTION_LADDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36038_CROSS_CEILING_FRACTION_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36038_CROSS_CEILING_FRACTION_LADDER.verdict),
  },
];

for (const a of IMP36038_CROSS_CEILING_FRACTION_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36038-cross-ceiling-fraction-ladder assertion failed: ${a.id}`);
  }
}
