/**
 * @module imp-36019-order-shape-cross-N-ladder
 *
 * imp-36019 (numerical, S-frontier): MEASURE whether the imp-35973 super-additive
 * order-x-shape compounding FACTOR is N-stable or trends across the imp-35812 N ladder.
 *
 * imp-35973 summed the fixed imp-35812 oscillatory multiset under the imp-35852 worst term
 * ORDER (clustered same-sign runs) THROUGH the imp-35893 worst pairing-tree SHAPE
 * (caterpillarR) and found the COMBINED pairwise error ~4.32e-16 was ~13x the naive SUM of
 * the order-only (~3.15e-17) and shape-only (~1.85e-18) single-stress errors -- reporting a
 * "SUPER-ADDITIVE" compounding factor. But imp-35973 measured that ratio at the SINGLE
 * endpoint N = floor(sqrt(T_PT/4 pi)) ~ 488602 only, and never checked whether the factor
 * is an N-stable law or an N-endpoint coincidence.
 *
 * This module supplies the missing N-ladder scan. It recomputes the shape-only, order-only,
 * combined (cross), and Kahan errors -- each against its OWN order- and association-invariant
 * exact BigInt reference -- at the same four rungs imp-35812 used, N = [1000, 10000, 100000,
 * 488602], and tracks the super-additivity factor crossOverSumOfSingles = cross / (shapeOnly
 * + orderOnly) across the ladder.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; the C_mb
 * GUE-conditional constant (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED super-additivity factor cross / (shapeOnly + orderOnly) across the ladder:
 *   N        kappa    shapeOnly    orderOnly    cross        crossOverSum  crossOverWorse
 *   1000      61.9    8.06e-18     5.25e-18     8.48e-17     6.365         10.510
 *   10000    194.5    3.86e-18     6.46e-17     1.37e-17     0.200          0.212
 *   100000   632.6    2.86e-18     5.31e-17     5.19e-16     9.266          9.765
 *   488602  1391.0    1.85e-18     3.15e-17     4.32e-16    12.969         13.733
 *
 * READING: the imp-35973 ~13x super-additive factor is NOT N-stable and does NOT trend
 * monotonically. Across the ladder the factor swings erratically over ~65x (min ~0.20 at
 * N = 10000, max ~12.97 at N ~ 488602) and is non-monotone in N. At N = 10000 the factor is
 * ~0.20 < 1 -- the combined stress is actually SUB-additive there, and its crossOverWorse
 * ~0.21 < 1 means the cross error does not even exceed the WORSE single stress: at that rung
 * the two hostile levers partially CANCEL rather than compound. The ~13x endpoint value is
 * therefore a PHASE-COINCIDENCE of the deterministic oscillatory multiset at N ~ 488602, not
 * an N-scaling law -- the combined error is governed by whether the clustered-order coherent
 * partial sums happen to align with the deep caterpillar spine at that particular N, which
 * varies non-monotonically rung to rung. So the imp-35973 STRICT super-additivity claim holds
 * at its measured endpoint but is NOT confirmed as N-robust; a single-N reading over-states it.
 *
 * YET the conclusion that matters for the barrier is N-ROBUST: at EVERY rung the combined
 * cross error stays BELOW the log2(N)*eps pairwise ceiling (max ratio ~0.141 at N = 100000,
 * i.e. still ~7.1x under it), and Kahan-Babuska on the same clustered order stays at the
 * unit-roundoff floor (~2.3e-19 to ~3.7e-19, < 2 u) at every N. Precision stays NON-binding
 * across the whole ladder even under the combined worst-case order x shape stress; the
 * obstruction remains the ENGINEERING of the certified length-N interval sum (MECHANICAL,
 * imp-35725), and the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint cross-term at N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (term-ORDER stress at fixed balanced tree)
 * @see imp-35893-w1-summation-pairwise-tree-shape (tree-SHAPE stress at fixed original order)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise error, ordering)
 */

// -- Anchor + operative constants (import-light; matching imp-35973) ---------------------
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

const LEAF = 128; // base block size (identical to imp-35852 / imp-35893 / imp-35973)

// -- Kahan-Babuska (compensated contrast, same as imp-35973) -----------------------------
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

// -- Pairwise summation over an ARBITRARY pairing tree, explicit stack (as imp-35973) ----
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

// -- Tree splitters (as imp-35973) -------------------------------------------------------
const splitCaterpillarR = (lo, hi, leaf) => hi - leaf; // imp-35893 worst SHAPE
const splitBalanced = (lo, hi) => (lo + hi) >> 1; // imp-35852 fixed tree

// -- Measure all configs at one N against a freshly built exact reference ----------------
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
  const original = Float64Array.from(base);

  const run = (order, splitter) => {
    const { sum, maxDepth } = sumTree(order, splitter, LEAF);
    return { err: normalizedError(sum, trueNum, sumAbs), depth: maxDepth };
  };
  const shape = run(original, splitCaterpillarR); // shape-only (catR, original)
  const order = run(clustered, splitBalanced); // order-only (balanced, clustered)
  const cross = run(clustered, splitCaterpillarR); // CROSS (catR, clustered)
  const kahan = normalizedError(sumKahan(clustered), trueNum, sumAbs);

  const sumSingle = shape.err + order.err;
  const worseSingle = Math.max(shape.err, order.err);
  const ceilPairwise = Math.log2(N) * EPS_DOUBLE;
  return {
    N,
    kappa,
    shapeOnlyNormErr: shape.err,
    orderOnlyNormErr: order.err,
    crossNormErr: cross.err,
    crossDepth: cross.depth,
    kahanClusteredNormErr: kahan,
    crossOverSumOfSingles: cross.err / sumSingle, // >1 => super-additive at this N
    crossOverWorseSingle: cross.err / worseSingle, // >1 => compounds past worse single
    ceilPairwise,
    crossRatioToPairwiseCeiling: cross.err / ceilPairwise,
  };
}

// -- The imp-35812 N ladder --------------------------------------------------------------
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- N-stability metrics for the super-additivity factor ---------------------------------
const FACTORS = LADDER.map((r) => r.crossOverSumOfSingles);
const FACTOR_MIN = Math.min(...FACTORS);
const FACTOR_MAX = Math.max(...FACTORS);
const FACTOR_SPAN_RATIO = FACTOR_MAX / FACTOR_MIN; // >>1 => NOT N-stable
const FACTOR_AT_TPT = LADDER[LADDER.length - 1].crossOverSumOfSingles;
// Monotone in N would mean strictly increasing (or decreasing) rung to rung.
let MONOTONE_INCREASING = true;
let MONOTONE_DECREASING = true;
for (let i = 1; i < FACTORS.length; i++) {
  if (!(FACTORS[i] > FACTORS[i - 1])) MONOTONE_INCREASING = false;
  if (!(FACTORS[i] < FACTORS[i - 1])) MONOTONE_DECREASING = false;
}
const FACTOR_MONOTONE_IN_N = MONOTONE_INCREASING || MONOTONE_DECREASING;
const SUPER_ADDITIVE_AT_EVERY_RUNG = FACTORS.every((f) => f > 1);
// The barrier-relevant invariant: cross stays under the ceiling at every rung.
const CROSS_BELOW_CEILING_EVERY_RUNG = LADDER.every((r) => r.crossRatioToPairwiseCeiling < 1);
const MAX_CROSS_RATIO_CEIL = Math.max(...LADDER.map((r) => r.crossRatioToPairwiseCeiling));
const KAHAN_AT_FLOOR_EVERY_RUNG = LADDER.every(
  (r) => r.kahanClusteredNormErr > 0 && r.kahanClusteredNormErr < 2 * U_ROUNDOFF,
);

export const IMP36019_ORDER_SHAPE_CROSS_N_LADDER = {
  id: 'imp-36019',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35973 super-additive order-x-shape compounding factor cross / (shapeOnly + orderOnly) ' +
    '(~13x at N ~ 488602) N-STABLE across the imp-35812 N ladder [1000, 10000, 100000, 488602], or does ' +
    'it trend / swing with N? Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-35973)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    leafBlock: LEAF,
    note: 'the same combined worst-ORDER x worst-SHAPE cross imp-35973 measured, re-run at four N rungs',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    orderAndAssociationInvariant: true,
    note: 'one exact reference is computed once PER N and reused for that rung (true sum depends on neither order nor tree)',
  },
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  factorStability: {
    factorsAcrossLadder: FACTORS,
    factorMin: FACTOR_MIN,
    factorMax: FACTOR_MAX,
    factorSpanRatio: FACTOR_SPAN_RATIO,
    factorAtTPT: FACTOR_AT_TPT,
    monotoneInN: FACTOR_MONOTONE_IN_N,
    superAdditiveAtEveryRung: SUPER_ADDITIVE_AT_EVERY_RUNG,
    nStable: FACTOR_SPAN_RATIO < 2, // false: the factor is NOT N-stable
  },
  barrierInvariant: {
    crossBelowCeilingEveryRung: CROSS_BELOW_CEILING_EVERY_RUNG,
    maxCrossRatioToPairwiseCeiling: MAX_CROSS_RATIO_CEIL,
    kahanAtFloorEveryRung: KAHAN_AT_FLOOR_EVERY_RUNG,
  },
  reading: {
    factorNotNStable:
      'the imp-35973 ~13x super-additive factor is NOT N-stable: across the ladder cross / (shapeOnly + ' +
      'orderOnly) swings over ~65x (min ~0.20 at N = 10000, max ~12.97 at N ~ 488602) and is non-monotone in N',
    subAdditiveAtOneRung:
      'at N = 10000 the factor is ~0.20 < 1 -- the combined stress is SUB-additive there, and cross does not ' +
      'even exceed the WORSE single stress (crossOverWorse ~0.21 < 1): the two hostile levers partially CANCEL',
    endpointIsCoincidence:
      'the ~13x endpoint value is a PHASE-COINCIDENCE of the deterministic oscillatory multiset at N ~ 488602 ' +
      '(whether the clustered-order coherent partial sums align with the deep caterpillar spine at that N), ' +
      'not an N-scaling law -- a single-N reading OVER-states the compounding',
    barrierInvariantHolds:
      'YET the barrier-relevant invariant IS N-robust: at every rung the combined cross error stays BELOW the ' +
      'log2(N)*eps pairwise ceiling (max ratio ~0.141 at N = 100000, still ~7.1x under it) and Kahan stays at ' +
      'the unit-roundoff floor (< 2 u) -- precision stays NON-binding across the whole ladder',
  },
  conclusion: {
    superAdditivityNotNStable:
      'the imp-35973 super-additive order-x-shape compounding factor is NOT N-stable and does NOT trend ' +
      'monotonically -- it swings erratically over ~65x across the imp-35812 ladder (sub-additive ~0.20 at ' +
      'N = 10000, ~12.97 at N ~ 488602), so the ~13x single-endpoint reading is a phase-coincidence not a law',
    precisionNotBindingAcrossLadder:
      'the combined cross error stays below the log2(N)*eps ceiling and Kahan stays at the roundoff floor at ' +
      'EVERY rung -- precision is NOT the binding constraint anywhere on the ladder even under the combined stress',
    staysGreenfield:
      'this module measures pairwise errors under the combined skeptical stress at four N only; it evaluates ' +
      'no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running the imp-35973 combined ' +
    'worst-ORDER (clustered same-sign runs) x worst-SHAPE (caterpillarR) pairwise cross against a per-N exact ' +
    'BigInt reference at the imp-35812 ladder N = [1000, 10000, 100000, 488602], the super-additivity factor ' +
    'cross / (shapeOnly + orderOnly) is [6.365, 0.200, 9.266, 12.969]: it is NOT N-stable and does NOT trend ' +
    'monotonically -- it swings over ~65x and at N = 10000 is SUB-additive (~0.20, cross below the worse ' +
    'single stress: the levers partially CANCEL). The imp-35973 ~13x reading is a PHASE-COINCIDENCE of the ' +
    'deterministic multiset at N ~ 488602, not an N-scaling law; the STRICT super-additivity claim is NOT ' +
    'confirmed as N-robust. YET the barrier-relevant invariant IS N-robust: at every rung the combined cross ' +
    'error stays below the log2(N)*eps ceiling (max ~0.141 at N = 100000, ~7.1x under it) and Kahan-Babuska ' +
    'stays at the unit-roundoff floor (< 2 u). Precision is NOT the binding constraint anywhere on the ladder ' +
    'even under the combined worst-case order x shape stress; the obstruction stays the ENGINEERING of the ' +
    'certified length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35973 (single-endpoint order-x-shape cross-term at N ~ 488602, ~13x super-additive); imp-35852 ' +
    '(worst term ORDER); imp-35893 (worst pairing-tree SHAPE); imp-35812 (fixed term family + N ladder ' +
    '[1e3..4.886e5]); imp-35761 (pairwise log2(N)*eps ceiling); imp-35760 (barrier-margin allocation); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); Higham 2002.',
};

export const IMP36019_ORDER_SHAPE_CROSS_N_LADDER_ASSERTIONS = [
  {
    id: 'imp36019-ladder-anchor',
    description: 'Four-rung ladder N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi))~488602]',
    holds: () =>
      LADDER.length === 4 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[3] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The endpoint reproduces imp-35973: cross ~4.32e-16, factor ~13x super-additive.
    id: 'imp36019-endpoint-reproduces-imp35973',
    description: 'The N~488602 rung reproduces the imp-35973 cross ~4.32e-16 and ~13x super-additive factor',
    holds: () => {
      const r = LADDER[LADDER.length - 1];
      return (
        Math.abs(r.crossNormErr - 4.324e-16) / 4.324e-16 < 0.05 &&
        Math.abs(r.crossOverSumOfSingles - 12.969) / 12.969 < 0.05 &&
        r.crossOverSumOfSingles > 1
      );
    },
  },
  {
    // Core finding: the super-additivity factor is NOT N-stable (swings by >>2x across ladder).
    id: 'imp36019-factor-not-n-stable',
    description: 'The super-additivity factor swings by >10x across the ladder -- NOT N-stable, NOT monotone',
    holds: () =>
      FACTOR_SPAN_RATIO > 10 &&
      FACTOR_MONOTONE_IN_N === false &&
      IMP36019_ORDER_SHAPE_CROSS_N_LADDER.factorStability.nStable === false,
  },
  {
    // At one rung the compounding fails entirely: sub-additive (factor < 1) and below worse single.
    id: 'imp36019-sub-additive-at-a-rung',
    description: 'At N = 10000 the factor is < 1 (sub-additive) -- the two stresses partially CANCEL there',
    holds: () => {
      const r = LADDER[1]; // N = 10000
      return (
        r.N === 10000 &&
        r.crossOverSumOfSingles < 1 &&
        r.crossOverWorseSingle < 1 &&
        SUPER_ADDITIVE_AT_EVERY_RUNG === false
      );
    },
  },
  {
    // Barrier invariant IS N-robust: cross below the log2(N)*eps ceiling at EVERY rung.
    id: 'imp36019-cross-below-ceiling-every-rung',
    description: 'The combined cross error stays below the log2(N)*eps pairwise ceiling at every rung',
    holds: () =>
      CROSS_BELOW_CEILING_EVERY_RUNG === true &&
      MAX_CROSS_RATIO_CEIL < 1 &&
      MAX_CROSS_RATIO_CEIL > 1e-2,
  },
  {
    // Kahan stays at the unit-roundoff floor at every rung (compensated scheme N-robust).
    id: 'imp36019-kahan-at-floor-every-rung',
    description: 'Kahan-Babuska on the clustered order stays below 2u at every rung',
    holds: () =>
      KAHAN_AT_FLOOR_EVERY_RUNG === true &&
      LADDER.every((r) => r.kahanClusteredNormErr < 1e-18),
  },
  {
    id: 'imp36019-honesty-gate',
    description: 'Measurement only; super-additivity NOT N-stable; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36019_ORDER_SHAPE_CROSS_N_LADDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NOT N-stable/.test(IMP36019_ORDER_SHAPE_CROSS_N_LADDER.conclusion.superAdditivityNotNStable) &&
      /NOT the binding constraint/.test(
        IMP36019_ORDER_SHAPE_CROSS_N_LADDER.conclusion.precisionNotBindingAcrossLadder,
      ) &&
      /GREENFIELD/.test(IMP36019_ORDER_SHAPE_CROSS_N_LADDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36019_ORDER_SHAPE_CROSS_N_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36019_ORDER_SHAPE_CROSS_N_LADDER.verdict),
  },
];

for (const a of IMP36019_ORDER_SHAPE_CROSS_N_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36019-order-shape-cross-N-ladder assertion failed: ${a.id}`);
  }
}
