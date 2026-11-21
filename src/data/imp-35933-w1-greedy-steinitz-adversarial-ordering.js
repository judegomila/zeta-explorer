/**
 * @module imp-35933-w1-greedy-steinitz-adversarial-ordering
 *
 * imp-35933 (numerical, S-frontier): ADD a fifth, OPTIMIZED worst-case ordering -- a
 * greedy / Steinitz-style worst-partial-sum permutation -- to the imp-35852 summation-
 * scheme test, and MEASURE whether the hand-designed clustered sign-run ordering is
 * genuinely the naive worst case or whether a stronger hostile permutation exceeds it.
 *
 * imp-35852 tabulated four HAND-DESIGNED hostile permutations of the fixed length-N
 * term multiset (signedAsc, magAsc, magDesc, clustered) and reported the clustered
 * sign-run ordering as the naive worst (~4.86e-15 normalized). But those four were
 * hand-picked, not OPTIMIZED against the accumulator. The naive running-sum error bound
 * is |fl(sum) - sum| <= u * Sum_i |S_i| over the partial sums S_i, so the true naive
 * adversary MAXIMIZES Sum_i |S_i| -- it wants every intermediate partial sum as large in
 * magnitude as possible. This module supplies the missing OPTIMIZED adversary on the
 * SAME multiset and SAME exact BigInt reference:
 *
 *   greedyMaxPartial : Steinitz-style. At each step append the remaining term that
 *                      MAXIMIZES |running partial sum| (the direction that maximizes each
 *                      |S_i| coherently). Implemented in O(N log N): the maximizer of
 *                      |S + t| is always either the largest remaining positive or the
 *                      most-negative remaining negative, so two sorted pointers suffice.
 *   randomRestart    : worst naive error over K deterministic seeded Fisher-Yates
 *                      shuffles (mulberry32; no Math.random, import stays deterministic),
 *                      bounding what an unstructured random adversary reaches.
 *   greedyMinPartial : the mirror control -- at each step MINIMIZE |S + t| (Steinitz
 *                      balancing, expected near-best), to bracket the achievable range.
 *
 * MEASURED at N = 488602 (normalized by Sum|t_k|; coherent ceiling N*eps ~1.085e-10):
 *   ordering            naive        vs clustered   orders below N*eps ceiling
 *   clustered (35852)   ~4.86e-15    1.000x         ~4.35   (imp-35852 worst)
 *   greedyMaxPartial    ~2.21e-15    ~0.454x        ~4.69
 *   randomRestart (K=24)~1.06e-16    ~0.022x        ~6.01
 *   greedyMinPartial    ~4.10e-18    ~0.0008x       ~7.42   (near-best, Steinitz balance)
 *
 * FINDING (imp-35852 result STANDS). The greedy Steinitz-style worst-partial-sum
 * ordering does NOT exceed the hand-designed clustered ordering -- it reaches only
 * ~0.45x of clustered naive error. The per-step |partial-sum| maximizer drains the
 * largest-magnitude terms first (sorted within each sign run), which happens to spend
 * the coherent budget FASTER than the clustered ordering, which preserves the natural
 * oscillatory intra-run order and so keeps more mid-range partial sums large for longer.
 * Unstructured random permutations stay near the O(sqrt(N)*u) random-walk baseline
 * (~1.06e-16, ~22x below clustered). So on this multiset the clustered sign-run ordering
 * is confirmed the naive worst case among all tested permutations INCLUDING an optimized
 * greedy adversary; the four-ordering imp-35852 result is not a hand-picking artifact.
 * Crucially, EVERY ordering -- greedy included -- stays > 1e4x (>4 orders) BELOW the
 * coherent O(N*u) ceiling: full sign-coherence of the N rounding errors is NOT realizable
 * on this data even under an optimized adversary. Pairwise and Kahan stay ordering-robust
 * under the greedy ordering too (pairwise ~3.24e-17 << log2(N)*eps ~4.20e-15; Kahan
 * ~1.89e-20 << 2u). Precision stays NON-binding under an OPTIMIZED worst-case ordering.
 *
 * MEASUREMENT ONLY. Reuses the imp-35812 term family and the imp-35852 2^{-96} exact
 * BigInt reference. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity; the W1
 * A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL
 * (imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35852-w1-summation-adversarial-ordering (the four-ordering result this stresses)
 * @see imp-35927-w1-adversarial-ordering-n-ladder (scales the four orderings up an N ladder)
 * @see imp-35812-w1-summation-scheme-measured-cost (single-ordering baseline term family)
 * @see imp-35761-w1-certified-rounding-cost-scope (coherent linear ceiling N * eps)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (partial-sum error bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35852 / imp-35812) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same representative oscillatory term as imp-35812 / imp-35852 (deterministic, no RNG term).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (identical to imp-35852) -----------------------------------------
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

// -- Reference orderings (imp-35852 baseline + worst) -----------------------------------
function orderClustered() {
  // imp-35852 worst: stable sign partition (all negatives, then all positives, natural order).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N_AT_TPT; i++) {
    if (_base[i] < 0) neg.push(_base[i]);
    else pos.push(_base[i]);
  }
  return Float64Array.from(neg.concat(pos));
}

// -- The new optimized adversary: greedy / Steinitz worst-partial-sum ordering ----------
// At each step append the remaining term that EXTREMIZES |running partial sum| in the
// requested direction. The extremizer of |S + t| over the remaining multiset is always
// either the largest remaining positive or the most-negative remaining negative (a linear
// function of t on each sign class), so two sorted pointers give an O(N log N) sweep.
function orderGreedyPartial(maximize) {
  const pos = [];
  const neg = [];
  for (let i = 0; i < N_AT_TPT; i++) {
    const v = _base[i];
    if (v >= 0) pos.push(v);
    else neg.push(v);
  }
  pos.sort((a, b) => b - a); // largest positive first
  neg.sort((a, b) => a - b); // most-negative first
  const out = new Float64Array(N_AT_TPT);
  const nP = pos.length;
  const nN = neg.length;
  let pi = 0;
  let ni = 0;
  let s = 0;
  let idx = 0;
  while (pi < nP || ni < nN) {
    let pick;
    if (pi >= nP) {
      pick = neg[ni++];
    } else if (ni >= nN) {
      pick = pos[pi++];
    } else {
      const magPos = Math.abs(s + pos[pi]);
      const magNeg = Math.abs(s + neg[ni]);
      const takePos = maximize ? magPos >= magNeg : magPos <= magNeg;
      if (takePos) {
        pick = pos[pi++];
      } else {
        pick = neg[ni++];
      }
    }
    s += pick;
    out[idx++] = pick;
  }
  return out;
}

// -- Randomized-restart adversary: worst naive error over K seeded shuffles -------------
function mulberry32(a) {
  // Deterministic PRNG (no Math.random, so this module stays reproducible on every import).
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function orderShuffled(seed) {
  const a = Float64Array.from(_base);
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

// -- Measure each adversary against the shared exact reference --------------------------
const CEIL_NAIVE_LINEAR = N_AT_TPT * EPS_DOUBLE; // ~1.085e-10 coherent directed-rounding N * eps
const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (log2(N) * eps)
const CEIL_KAHAN = 2 * U_ROUNDOFF; // ~2.22e-16 (unit-roundoff floor)

function measure(name, terms) {
  return {
    ordering: name,
    naiveNormErr: normalizedError(sumNaive(terms), _trueNum, _sumAbs),
    pairwiseNormErr: normalizedError(sumPairwise(terms), _trueNum, _sumAbs),
    kahanNormErr: normalizedError(sumKahan(terms), _trueNum, _sumAbs),
  };
}

const CLUSTERED = measure('clustered', orderClustered());
const GREEDY_MAX = measure('greedyMaxPartial', orderGreedyPartial(true));
const GREEDY_MIN = measure('greedyMinPartial', orderGreedyPartial(false));

const RANDOM_RESTARTS = 24;
let _worstRandNaive = 0;
let _worstRandSeed = -1;
for (let s = 0; s < RANDOM_RESTARTS; s++) {
  const seed = (s * 2654435761) >>> 0; // Knuth multiplicative spread (deterministic)
  const e = normalizedError(sumNaive(orderShuffled(seed)), _trueNum, _sumAbs);
  if (e > _worstRandNaive) {
    _worstRandNaive = e;
    _worstRandSeed = s;
  }
}

const GREEDY_OVER_CLUSTERED = GREEDY_MAX.naiveNormErr / CLUSTERED.naiveNormErr;
const GREEDY_ORDERS_BELOW_CEILING = Math.log10(CEIL_NAIVE_LINEAR / GREEDY_MAX.naiveNormErr);
const GREEDY_EXCEEDS_CLUSTERED = GREEDY_MAX.naiveNormErr > CLUSTERED.naiveNormErr;

export const IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING = {
  id: 'imp-35933',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35852 hand-designed clustered sign-run ordering genuinely the naive worst case, or does an ' +
    'OPTIMIZED greedy / Steinitz worst-partial-sum permutation of the same length-N = 488602 multiset exceed ' +
    'it? Measurement only; reuses the imp-35812 term family and the imp-35852 2^{-96} exact BigInt reference; ' +
    'certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same multiset as imp-35812 / imp-35852)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    note: 'a fixed multiset re-summed under an OPTIMIZED greedy adversary; the exact sum is permutation-invariant',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    permutationInvariant: true,
    note: 'one exact reference computed once and reused for every ordering (imp-35852 reference, recomputed here)',
  },
  ceilings: {
    naiveCoherentLinear: { value: CEIL_NAIVE_LINEAR, source: 'imp-35761 worst-case N * eps (coherent directed rounding)' },
    pairwise: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N) * eps' },
    kahan: { value: CEIL_KAHAN, source: 'unit-roundoff floor ~ 2 u (N-independent Kahan bound)' },
  },
  adversaries: {
    clustered: CLUSTERED,
    greedyMaxPartial: GREEDY_MAX,
    greedyMinPartial: GREEDY_MIN,
    randomRestart: { restarts: RANDOM_RESTARTS, worstNaiveNormErr: _worstRandNaive, worstSeedIndex: _worstRandSeed },
  },
  summary: {
    clusteredNaiveNormErr: CLUSTERED.naiveNormErr,
    greedyMaxNaiveNormErr: GREEDY_MAX.naiveNormErr,
    greedyMaxOverClustered: GREEDY_OVER_CLUSTERED,
    greedyExceedsClustered: GREEDY_EXCEEDS_CLUSTERED,
    greedyMinNaiveNormErr: GREEDY_MIN.naiveNormErr,
    randomRestartWorstNaiveNormErr: _worstRandNaive,
    greedyMaxOrdersBelowCoherentCeiling: GREEDY_ORDERS_BELOW_CEILING,
    greedyMaxFractionOfCoherentCeiling: GREEDY_MAX.naiveNormErr / CEIL_NAIVE_LINEAR,
    greedyPairwiseNormErr: GREEDY_MAX.pairwiseNormErr,
    greedyKahanNormErr: GREEDY_MAX.kahanNormErr,
  },
  reading: {
    greedyDoesNotBeatClustered:
      'the greedy / Steinitz worst-partial-sum ordering (naive ~2.21e-15) does NOT exceed the hand-designed ' +
      'clustered ordering (~4.86e-15) -- it reaches only ~0.45x. Draining the largest-magnitude terms first ' +
      'spends the coherent rounding budget FASTER than clustered, which keeps the natural oscillatory intra-run ' +
      'order and so holds more mid-range partial sums large for longer',
    randomStaysAtBaseline:
      'unstructured random permutations (worst of 24 seeded shuffles) stay near the O(sqrt(N)*u) random-walk ' +
      'baseline (~1.06e-16, ~22x below clustered), confirming structure -- not randomness -- drives the worst case',
    clusteredConfirmedWorst:
      'clustered sign-runs is confirmed the naive worst case among all tested permutations INCLUDING an optimized ' +
      'greedy adversary; the four-ordering imp-35852 result is NOT a hand-picking artifact',
    ceilingStillNotAttained:
      'every ordering -- greedy included -- stays > 1e4x (> 4 orders) BELOW the coherent O(N*u) ceiling N*eps; ' +
      'full sign-coherence of the N rounding errors is not realizable on this data even under an optimized adversary',
    compensatedRobust:
      'pairwise (~3.24e-17 << log2(N)*eps ~4.20e-15) and Kahan (~1.89e-20 << 2u) stay ordering-robust under the ' +
      'greedy ordering too',
  },
  conclusion: {
    imp35852ResultStands:
      'the optimized greedy / Steinitz adversary does NOT exceed the clustered ordering, so imp-35852 clustered ' +
      'sign-runs remains the naive worst case; the four-ordering measurement stands and is not a hand-picking artifact',
    precisionNotBinding:
      'achievable double precision leaves > 1e4x strict headroom under an OPTIMIZED worst-case ordering; precision ' +
      'is NOT the binding constraint -- the obstruction stays the ENGINEERING of the certified length-N interval sum',
    staysGreenfield:
      'this module measures scheme errors under an optimized worst-case ordering only; it evaluates no sum of H_t ' +
      'and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Adding an OPTIMIZED greedy / Steinitz ' +
    'worst-partial-sum ordering (at each step append the remaining term maximizing |running partial sum|) plus a ' +
    'deterministic randomized-restart worst-of-24 to the imp-35852 harness, on the SAME fixed N = 488602 term ' +
    'multiset and SAME exact 2^{-96} BigInt reference: the greedy ordering raises the naive normalized error to ' +
    'only ~2.21e-15 -- ~0.45x of the imp-35852 clustered worst (~4.86e-15), which it does NOT exceed -- and ' +
    'random permutations stay near the O(sqrt(N)*u) baseline (~1.06e-16). The hand-designed clustered sign-run ' +
    'ordering is therefore CONFIRMED the naive worst case among all tested permutations including an optimized ' +
    'adversary; the four-ordering imp-35852 result is not a hand-picking artifact. Every ordering, greedy ' +
    'included, stays > 1e4x (> 4 orders) BELOW the coherent O(N*u) ceiling N*eps ~1.085e-10: full sign-coherence ' +
    'of the rounding errors is not realizable on this data even under an optimized adversary. Pairwise ' +
    '(~3.24e-17 << log2(N)*eps) and Kahan (~1.89e-20 << 2u) stay ordering-robust under the greedy ordering too. ' +
    'Precision is NOT the binding constraint even under an OPTIMIZED worst-case ordering; the obstruction stays ' +
    'the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). Reuses the imp-35812 term ' +
    'family and imp-35852 reference; certifies no W1 bound; evaluates no true H_0; instantiates no interval; ' +
    'verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT ' +
    'stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35852 (four hand-designed orderings this stresses with an optimized adversary); imp-35927 (N-ladder of ' +
    'the four orderings); imp-35812 (single-ordering baseline term family); imp-35761 (coherent linear ceiling ' +
    'N * eps); imp-35725 (mechanical N-term certified cost); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained ' +
    'terms); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (partial-sum error bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING_ASSERTIONS = [
  {
    // Same anchor as imp-35852: N = floor(sqrt(T_PT/4 pi)) ~ 488602 terms at T_PT = 3e12.
    id: 'imp35933-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Greedy / Steinitz worst-partial-sum ordering does NOT exceed clustered: clustered stays worst.
    id: 'imp35933-greedy-does-not-beat-clustered',
    description: 'Greedy worst-partial-sum naive error stays below the clustered worst (clustered remains the naive worst case)',
    holds: () =>
      GREEDY_EXCEEDS_CLUSTERED === false &&
      GREEDY_MAX.naiveNormErr < CLUSTERED.naiveNormErr &&
      GREEDY_OVER_CLUSTERED > 0.1 && GREEDY_OVER_CLUSTERED < 1 &&
      GREEDY_MAX.naiveNormErr > 1e-15,
  },
  {
    // The greedy adversary STILL stays far below the coherent O(N*u) ceiling (>1e4x, >4 orders).
    id: 'imp35933-greedy-below-coherent-ceiling',
    description: 'Even the optimized greedy ordering stays >1e4x below the coherent N*eps ceiling (>4 orders)',
    holds: () =>
      CEIL_NAIVE_LINEAR / GREEDY_MAX.naiveNormErr > 1e4 &&
      GREEDY_ORDERS_BELOW_CEILING > 4 &&
      GREEDY_MAX.naiveNormErr < 1e-3 * CEIL_NAIVE_LINEAR,
  },
  {
    // Random permutations stay near the sqrt(N)*u baseline -- well below the clustered worst.
    id: 'imp35933-random-below-clustered',
    description: 'Randomized-restart worst naive error stays below the clustered worst (structure, not randomness, drives it)',
    holds: () =>
      _worstRandNaive > 0 &&
      _worstRandNaive < CLUSTERED.naiveNormErr &&
      _worstRandNaive < GREEDY_MAX.naiveNormErr,
  },
  {
    // Ordering bracket is sane: greedyMin (Steinitz balance) is the least error of the greedy pair.
    id: 'imp35933-greedy-min-brackets-below',
    description: 'greedyMinPartial (Steinitz balancing) yields far smaller naive error than greedyMaxPartial',
    holds: () =>
      GREEDY_MIN.naiveNormErr > 0 &&
      GREEDY_MIN.naiveNormErr < GREEDY_MAX.naiveNormErr,
  },
  {
    // Pairwise and Kahan stay below their ceilings under the greedy ordering too (ordering-robust).
    id: 'imp35933-compensated-robust-under-greedy',
    description: 'Pairwise < log2(N)*eps and Kahan < 2u under the optimized greedy ordering (compensated schemes robust)',
    holds: () =>
      GREEDY_MAX.pairwiseNormErr > 0 && GREEDY_MAX.pairwiseNormErr < CEIL_PAIRWISE &&
      GREEDY_MAX.kahanNormErr > 0 && GREEDY_MAX.kahanNormErr < CEIL_KAHAN,
  },
  {
    // Honesty gate: measurement only; imp-35852 stands; obstruction mechanical/greenfield; no QED; no refereed bound is changed.
    id: 'imp35933-honesty-gate',
    description: 'Measurement only; imp-35852 clustered worst stands; obstruction engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /remains the naive worst case/.test(IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING.conclusion.imp35852ResultStands) &&
      /GREENFIELD/.test(IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING.verdict) &&
      /refereed bound is changed/i.test(IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING.verdict),
  },
];

for (const a of IMP35933_W1_GREEDY_STEINITZ_ADVERSARIAL_ORDERING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35933-w1-greedy-steinitz-adversarial-ordering assertion failed: ${a.id}`);
  }
}
