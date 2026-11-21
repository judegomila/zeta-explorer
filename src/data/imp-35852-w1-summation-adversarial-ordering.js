/**
 * @module imp-35852-w1-summation-adversarial-ordering
 *
 * imp-35852 (numerical, S-frontier): MEASURE whether the imp-35812 naive-summation
 * random-walk O(sqrt(N) * u) error growth degrades toward the COHERENT O(N * u)
 * pessimistic ceiling under INDEPENDENTLY-ORDERED term sequences, and whether the
 * pairwise / Kahan-Babuska schemes stay robust to ordering.
 *
 * imp-35812 measured the three summation schemes (naive recursive, pairwise
 * divide-and-conquer, Kahan-Babuska compensated) on ONE deterministic oscillatory
 * ordering of the length-N sum t_k = cos(alpha k + beta sqrt k) / sqrt k
 * (N = floor(sqrt(T_PT / 4 pi)) ~ 488602, condition number kappa ~ 1.4e3) and found
 * the naive normalized error ~3.0e-17 sat ~6.5 orders BELOW the imp-35761 pessimistic
 * linear ceiling N * eps ~ 1.08e-10, attributing it to random-walk O(sqrt(N) * u)
 * accumulation rather than coherent O(N * u). But the directed-rounding worst case
 * assumes the N per-step errors add COHERENTLY, and the single oscillatory ordering
 * never stressed that assumption. This module supplies the missing SKEPTICAL test:
 * it holds the SAME multiset of terms fixed and re-runs the three schemes under four
 * hostile permutations designed to force coherent accumulation, then measures each
 * scheme error against the SAME exact BigInt reference (the exact sum is
 * permutation-invariant, so one reference serves all orderings).
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity;
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * WORST-CASE ORDERINGS (same multiset, hostile permutations)
 * -----------------------------------------------------------------------------
 *   original  : the imp-35812 oscillatory order k = 1 .. N (baseline, well-behaved).
 *   signedAsc : sort by SIGNED value ascending (most-negative first). Builds a large
 *               negative partial sum ~ -Sum(neg) ~ -sumAbs/2 before the positives pull
 *               it back, maximizing intermediate partial-sum MAGNITUDE (hence ulp).
 *   magAsc    : sort by |t_k| ascending (smallest first). Classical BEST ordering.
 *   magDesc   : sort by |t_k| descending (largest first). Classical worse ordering.
 *   clustered : stable sign partition -- all negatives (original order) then all
 *               positives (original order). Forces two long same-sign RUNS so rounding
 *               errors accumulate coherently within each run before the runs cancel.
 *
 * The exact reference is computed ONCE (each IEEE-754 double summed as a dyadic
 * rational on a 2^{-96} fixed-point grid in BigInt, error-free) and reused for every
 * ordering, so |schemeResult - trueSum| is an EXACT BigInt per ordering.
 *
 * MEASURED at N = 488602 (normalized by Sum|t_k| ~ 889; orders = log10(ceiling/err)):
 *   ordering    naive        pairwise     kahan      naive orders below N*eps ceiling
 *   original    ~3.03e-17    ~3.56e-19    ~1.89e-20  ~6.55
 *   signedAsc   ~9.19e-16    ~3.15e-17    ~1.89e-20  ~5.07
 *   magAsc      ~2.69e-19    ~6.43e-19    ~1.89e-20  ~8.61  (best)
 *   magDesc     ~3.05e-17    ~1.27e-18    ~1.89e-20  ~6.55
 *   clustered   ~4.86e-15    ~3.15e-17    ~2.31e-19  ~4.35  (worst naive)
 *
 * READING: the WORST worst-case ordering (clustered sign-runs) pushes the naive error
 * UP by ~160x -- from ~6.55 orders below the coherent N * eps ceiling on the oscillatory
 * order to ~4.35 orders below -- exactly the direction the coherence argument predicts.
 * But even the worst worst-case naive error stays > 1e4x (~4.3 orders) BELOW the
 * coherent O(N * u) ceiling: full sign-coherence of the N rounding errors is NOT
 * realizable on this data, so the pessimistic linear ceiling is NOT attained even
 * independently. Pairwise stays below its own log2(N) * eps ceiling under every ordering
 * (worst ~3.15e-17 vs ceiling ~4.20e-15), and Kahan-Babuska stays at the unit-roundoff
 * floor with only ~1 order of ordering sensitivity (max ~2.31e-19 << 2 u ~2.22e-16) --
 * both compensated / hierarchical schemes are ORDERING-ROBUST. All errors remain ~10+
 * orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760). CONCLUSION:
 * worst-case ordering narrows but does NOT close the gap to the coherent ceiling for
 * naive summation, and leaves pairwise / Kahan essentially unaffected -- precision stays
 * NON-binding under worst-case ordering; the obstruction remains the ENGINEERING of the
 * certified length-N interval sum (MECHANICAL, imp-35725). The W1 A + B - C certificate
 * at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35812-w1-summation-scheme-measured-cost (single-ordering baseline this stresses)
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic coherent linear ceiling N * eps)
 * @see imp-35725-w1-effective-error-cap-budget (mechanical N-term certified-rounding cost)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (ordering and error growth)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35761) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u); imp-35761 quoted its ceiling in eps

// Same representative oscillatory term as imp-35812 (fixed constants; deterministic, no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (identical to imp-35812) -----------------------------------------
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}

function sumKahan(terms) {
  // Kahan-Babuska compensated summation: running correction c cancels the lost low bits.
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

function sumPairwise(terms) {
  // Divide-and-conquer pairwise summation: error grows like log2(N), not N.
  const rec = (lo, hi) => {
    if (hi - lo <= 128) {
      let a = 0;
      for (let i = lo; i < hi; i++) a += terms[i];
      return a;
    }
    const mid = (lo + hi) >> 1;
    return rec(lo, mid) + rec(mid, hi);
  };
  return rec(0, terms.length);
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) --------
const FRAC_BITS = 96n; // common fixed-point scale 2^{-96}; covers the term exponent range
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x) {
  // Return m * 2^{-96} representation of x as an exact BigInt numerator (x = m_k * 2^{e_k}).
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

// -- Build the fixed term multiset + the permutation-invariant exact reference ----------
const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) {
  const t = TERM(k);
  _base[k - 1] = t;
  _sumAbs += Math.abs(t);
}
let _trueNum = 0n; // exact sum is permutation-invariant -- computed once, reused for all orderings
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);
const _trueAbs = _trueNum < 0n ? -_trueNum : _trueNum;
const TRUE_SUM = (Number(_trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (_trueNum < 0n ? -1 : 1);
const CONDITION_NUMBER = _sumAbs / Math.abs(TRUE_SUM);

// -- Worst-case orderings (same multiset, hostile permutations) ------------------------
function orderOriginal() {
  return Float64Array.from(_base);
}
function orderSignedAsc() {
  const a = Float64Array.from(_base);
  a.sort((x, y) => x - y); // most-negative first -> large intermediate |partial sum|
  return a;
}
function orderMagAsc() {
  const a = Float64Array.from(_base);
  a.sort((x, y) => Math.abs(x) - Math.abs(y)); // smallest magnitude first (classical best)
  return a;
}
function orderMagDesc() {
  const a = Float64Array.from(_base);
  a.sort((x, y) => Math.abs(y) - Math.abs(x)); // largest magnitude first (classical worse)
  return a;
}
function orderClustered() {
  // Stable sign partition: all negatives (original order) then all positives (original order).
  // Two long same-sign runs force coherent accumulation before the runs cancel.
  const neg = [];
  const pos = [];
  for (let i = 0; i < N_AT_TPT; i++) {
    if (_base[i] < 0) neg.push(_base[i]);
    else pos.push(_base[i]);
  }
  return Float64Array.from(neg.concat(pos));
}

const ORDERING_BUILDERS = [
  ['original', orderOriginal],
  ['signedAsc', orderSignedAsc],
  ['magAsc', orderMagAsc],
  ['magDesc', orderMagDesc],
  ['clustered', orderClustered],
];

// imp-35761 pessimistic ceilings (normalized errors), for direct contrast.
const CEIL_NAIVE_LINEAR = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10 (coherent directed-rounding N * eps)
const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (log2(N) * eps)
const CEIL_KAHAN = 2 * U_ROUNDOFF; // ~2.22e-16 (unit-roundoff floor)

// -- Run every scheme on every ordering against the shared exact reference --------------
const ORDERINGS = ORDERING_BUILDERS.map(([name, build]) => {
  const a = build();
  const naive = normalizedError(sumNaive(a), _trueNum, _sumAbs);
  const pairwise = normalizedError(sumPairwise(a), _trueNum, _sumAbs);
  const kahan = normalizedError(sumKahan(a), _trueNum, _sumAbs);
  return {
    ordering: name,
    naiveNormErr: naive,
    pairwiseNormErr: pairwise,
    kahanNormErr: kahan,
    naiveOrdersBelowCoherentCeiling: Math.log10(CEIL_NAIVE_LINEAR / naive),
    naiveFractionOfCoherentCeiling: naive / CEIL_NAIVE_LINEAR,
  };
});

const BY_NAME = Object.fromEntries(ORDERINGS.map((r) => [r.ordering, r]));
const NAIVE_ORIGINAL = BY_NAME.original.naiveNormErr;
const NAIVE_WORST = Math.max(...ORDERINGS.map((r) => r.naiveNormErr));
const WORST_ORDERING = ORDERINGS.reduce((a, b) => (b.naiveNormErr > a.naiveNormErr ? b : a));
const PAIRWISE_WORST = Math.max(...ORDERINGS.map((r) => r.pairwiseNormErr));
const KAHAN_WORST = Math.max(...ORDERINGS.map((r) => r.kahanNormErr));
const KAHAN_BEST = Math.min(...ORDERINGS.map((r) => r.kahanNormErr));

export const IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING = {
  id: 'imp-35852',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35812 naive-summation random-walk O(sqrt(N) * u) error growth degrade toward the ' +
    'coherent O(N * u) pessimistic ceiling under independently-ordered term sequences (sign-aligned / ' +
    'magnitude-sorted / clustered) at N ~ 488602, and do pairwise / Kahan stay ordering-robust? ' +
    'Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same multiset as imp-35812)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: CONDITION_NUMBER,
    note: 'a fixed multiset re-summed under hostile permutations; the exact sum is permutation-invariant',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    permutationInvariant: true,
    note: 'one exact reference is computed once and reused for every ordering (the true sum does not depend on order)',
  },
  ceilings: {
    naiveCoherentLinear: { value: CEIL_NAIVE_LINEAR, source: 'imp-35761 worst-case N * eps (coherent directed rounding)' },
    pairwise: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N) * eps' },
    kahan: { value: CEIL_KAHAN, source: 'unit-roundoff floor ~ 2 u (N-independent Kahan bound)' },
  },
  orderings: ORDERINGS,
  summary: {
    naiveOriginalNormErr: NAIVE_ORIGINAL,
    naiveWorstNormErr: NAIVE_WORST,
    worstOrdering: WORST_ORDERING.ordering,
    naiveWorstOverOriginal: NAIVE_WORST / NAIVE_ORIGINAL,
    naiveWorstOrdersBelowCoherentCeiling: WORST_ORDERING.naiveOrdersBelowCoherentCeiling,
    naiveWorstFractionOfCoherentCeiling: WORST_ORDERING.naiveFractionOfCoherentCeiling,
    pairwiseWorstNormErr: PAIRWISE_WORST,
    kahanWorstNormErr: KAHAN_WORST,
    kahanOrderingSensitivity: KAHAN_WORST / KAHAN_BEST,
  },
  reading: {
    adversarialNarrowsGap:
      'the worst worst-case ordering (clustered same-sign runs) pushes the naive error UP by ~160x -- from ' +
      '~6.55 orders below the coherent N * eps ceiling on the oscillatory order to ~4.35 orders below -- ' +
      'exactly the direction the coherence argument predicts',
    coherentCeilingStillNotAttained:
      'even the worst worst-case naive error stays > 1e4x (~4.3 orders) BELOW the coherent O(N * u) ceiling: ' +
      'full sign-coherence of the N rounding errors is not realizable on this data, so the pessimistic linear ' +
      'ceiling is NOT attained even independently',
    pairwiseOrderingRobust:
      'pairwise divide-and-conquer stays below its own log2(N) * eps ceiling under every ordering (worst ' +
      '~3.15e-17 vs ceiling ~4.20e-15)',
    kahanOrderingRobust:
      'Kahan-Babuska stays at the unit-roundoff floor with only ~1 order of ordering sensitivity (worst ' +
      '~2.31e-19 << 2 u ~2.22e-16) -- essentially ordering-invariant',
    allUnderMargin:
      'all schemes under all orderings remain ~10+ orders below the O(1) barrier margin |A_t + B_t| - |C_t| ' +
      '(imp-35760 allocation)',
  },
  conclusion: {
    naiveClimbsButDoesNotReachCeiling:
      'worst-case ordering NARROWS but does not close the gap to the coherent ceiling for naive summation; ' +
      'the coherent O(N * u) worst case is not attained on this data even under hostile permutations',
    compensatedSchemesOrderingRobust:
      'pairwise and Kahan-Babuska are ordering-robust -- pairwise stays below its log2(N) ceiling and Kahan ' +
      'stays at the roundoff floor regardless of ordering',
    precisionNotBinding:
      'achievable double precision leaves overwhelming strict headroom under WORST-CASE ordering too; ' +
      'precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures scheme errors under worst-case orderings only; it evaluates no sum of H_t and ' +
      'verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
      'and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running naive, pairwise, and ' +
    'Kahan-Babuska summation on the FIXED imp-35812 length-N = 488602 term multiset under four skeptical ' +
    'orderings (signed-ascending, magnitude-ascending, magnitude-descending, clustered same-sign runs) ' +
    'against the SAME exact BigInt reference, the worst ordering (clustered) raises the naive normalized ' +
    'error to ~4.86e-15 -- ~160x above the ~3.03e-17 oscillatory baseline, climbing from ~6.55 to ~4.35 ' +
    'orders below the coherent N * eps ceiling ~1.08e-10 -- yet it stays > 1e4x BELOW that coherent ceiling: ' +
    'full sign-coherence of the rounding errors is not realizable on this data. Pairwise stays below its ' +
    'log2(N) * eps ceiling (~3.15e-17 vs ~4.20e-15) and Kahan stays at the unit-roundoff floor (~2.31e-19) ' +
    'under every ordering -- both compensated / hierarchical schemes are ORDERING-ROBUST. All schemes under ' +
    'all orderings remain ~10+ orders below the O(1) barrier margin |A_t + B_t| - |C_t|. Precision is NOT the ' +
    'binding constraint even under worst-case ordering; the obstruction stays the ENGINEERING of the ' +
    'certified length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35812 (single-ordering baseline this stresses); imp-35761 (pessimistic coherent linear ceiling ' +
    'N * eps); imp-35725 (mechanical N-term certified cost); imp-35760 (barrier-margin allocation); ' +
    'imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A (A+B-C interval bound ' +
    'greenfield); Higham 2002 (ordering and summation error growth); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING_ASSERTIONS = [
  {
    // Same anchor as imp-35812: N = floor(sqrt(T_PT/4 pi)) ~ 488602 terms at T_PT = 3e12.
    id: 'imp35852-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      ORDERINGS.length === 5,
  },
  {
    // Worst-case ordering DEGRADES naive: the worst ordering is >>10x above the oscillatory baseline.
    id: 'imp35852-adversarial-degrades-naive',
    description: 'Worst worst-case naive error is >10x above the oscillatory baseline (coherence forced up)',
    holds: () =>
      NAIVE_WORST / NAIVE_ORIGINAL > 10 &&
      WORST_ORDERING.ordering === 'clustered' &&
      NAIVE_WORST > 1e-15,
  },
  {
    // But naive STILL does not reach the coherent O(N*u) ceiling: worst stays >1e4x below N*eps.
    id: 'imp35852-coherent-ceiling-not-attained',
    description: 'Even worst-ordering naive error stays >1e4x below the coherent N*eps ceiling (>4 orders)',
    holds: () =>
      CEIL_NAIVE_LINEAR / NAIVE_WORST > 1e4 &&
      WORST_ORDERING.naiveOrdersBelowCoherentCeiling > 4 &&
      NAIVE_WORST < 1e-3 * CEIL_NAIVE_LINEAR,
  },
  {
    // Pairwise stays below its log2(N)*eps ceiling under EVERY ordering (ordering-robust).
    id: 'imp35852-pairwise-ordering-robust',
    description: 'Pairwise normalized error stays below the log2(N)*eps ceiling under every ordering',
    holds: () =>
      PAIRWISE_WORST < CEIL_PAIRWISE &&
      ORDERINGS.every((r) => r.pairwiseNormErr < CEIL_PAIRWISE && r.pairwiseNormErr > 0),
  },
  {
    // Kahan stays at the unit-roundoff floor under EVERY ordering with only ~1 order of sensitivity.
    id: 'imp35852-kahan-ordering-robust',
    description: 'Kahan normalized error stays below 2u under every ordering with < 100x ordering sensitivity',
    holds: () =>
      KAHAN_WORST < CEIL_KAHAN &&
      KAHAN_BEST > 0 &&
      KAHAN_WORST / KAHAN_BEST < 100 &&
      ORDERINGS.every((r) => r.kahanNormErr < CEIL_KAHAN),
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35852-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NARROWS but does not close/.test(IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.conclusion.naiveClimbsButDoesNotReachCeiling) &&
      /GREENFIELD/.test(IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.verdict) &&
      /refereed bound is changed/i.test(IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.verdict),
  },
];

for (const a of IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35852-w1-summation-adversarial-ordering assertion failed: ${a.id}`);
  }
}
