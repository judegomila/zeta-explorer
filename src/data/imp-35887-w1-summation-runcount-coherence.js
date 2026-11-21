/**
 * @module imp-35887-w1-summation-runcount-coherence
 *
 * imp-35887 (numerical, S-frontier): MEASURE the fraction of the coherent N * eps
 * summation ceiling attained by naive recursive summation as a function of the NUMBER
 * of maximal same-sign RUNS r in the term ordering, interpolating between the imp-35852
 * clustered 2-run worst case and the oscillatory extreme (r ~ N) on the SAME multiset.
 *
 * imp-35852 tested five DISCRETE orderings and found the clustered stable sign-partition
 * (two long same-sign runs, r = 2) was the worst naive case (naive normalized error
 * ~4.86e-15, still ~4.35 orders below the coherent N * eps ceiling ~1.08e-10), concluding
 * full sign-coherence is NOT realizable on this data. That left the INTERMEDIATE regime
 * untabulated: how does the attained-coherence fraction move as the ordering is broken
 * from 2 runs toward the oscillatory extreme? This module fills that gap. It holds the
 * SAME fixed imp-35812 term multiset and constructs a LADDER of orderings with a
 * controlled number r = 2 m of maximal same-sign runs, by splitting the negatives into m
 * contiguous chunks and the positives into m contiguous chunks and interleaving them
 * (neg-chunk, pos-chunk, neg-chunk, ...). m = 1 is the imp-35852 clustered r = 2 case;
 * m = min(#neg, #pos) drives r up to ~ N (fully alternating, the oscillatory extreme).
 * Each ordering is measured against the SAME exact BigInt reference (the true sum is
 * permutation-invariant, so one reference serves all r).
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity;
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * RUN-COUNT LADDER (same multiset, r = 2 m maximal same-sign runs; N = 488602)
 * -----------------------------------------------------------------------------
 * (normalized by Sum|t_k| ~ 889; coherent ceiling N * eps ~ 1.085e-10; frac = naive/ceiling)
 *      r        naive          frac (of coherent ceiling)
 *      2        ~4.86e-15      ~4.48e-5   (clustered worst -- matches imp-35852)
 *      4        ~4.76e-15      ~4.39e-5
 *      8        ~2.85e-15      ~2.62e-5
 *      16       ~1.01e-15      ~9.30e-6
 *      32       ~5.58e-16      ~5.14e-6
 *      64       ~1.23e-16      ~1.13e-6
 *      128      ~4.81e-17      ~4.43e-7
 *      256      ~1.96e-16      ~1.80e-6
 *      512      ~2.03e-17      ~1.87e-7
 *      2048     ~2.33e-17      ~2.15e-7
 *      8192     ~1.93e-17      ~1.78e-7
 *      32768    ~2.61e-17      ~2.40e-7
 *      131072   ~2.78e-17      ~2.57e-7
 *      488548   ~2.77e-17      ~2.55e-7   (oscillatory extreme, r ~ N)
 *   [ original oscillatory order: r = 96655, naive ~3.03e-17, frac ~2.80e-7 ]
 *
 * READING: the attained-coherence fraction is HIGHEST at the fewest runs and DECAYS as
 * the ordering is broken. In the coherent regime (r = 2 .. ~64) the naive error descends
 * as a near-inverse POWER LAW in the run count -- slope ~ -1.06 over r in [2, 64]
 * (naive drops ~40x while r grows 32x), i.e. ~ r^{-1}, NOT the ~r^{-1/2} a
 * central-limit-of-run-sums heuristic would predict; the coherent within-run buildup of
 * the running-accumulator magnitude falls faster than sqrt as the runs shorten. Past
 * r ~ 256 the naive error FLATTENS onto the random-walk roundoff floor ~2.8e-17 (a bit
 * noisy: individual rungs wobble within ~10x near the floor), matching the imp-35812 /
 * imp-35852 oscillatory baseline ~3.03e-17 -- the O(sqrt(N) * u) regime. So the coherence
 * fraction falls ~175x from ~4.48e-5 at r = 2 to ~2.55e-7 at r ~ N, and NEVER exceeds
 * ~4.5e-5: even at the fewest realizable runs the naive error stays > 2e4x (~4.35 orders)
 * BELOW the coherent O(N * u) ceiling. Pairwise stays below its log2(N) * eps ceiling
 * (~4.20e-15) and Kahan-Babuska stays at the unit-roundoff floor (< 2 u) at EVERY r --
 * both compensated / hierarchical schemes are run-count-robust. All errors remain ~10+
 * orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760). CONCLUSION: the
 * coherence fraction is a decreasing ~r^{-1}-then-plateau function of the run count that
 * TOPS OUT ~4.35 orders below the pessimistic linear ceiling; the coherent worst case is
 * approached but not attained at any realizable run count. Precision stays NON-binding;
 * the obstruction remains the ENGINEERING of the certified length-N interval sum
 * (MECHANICAL, imp-35725). The W1 A + B - C certificate at T_PT stays GREENFIELD
 * (imp-35681 Part A).
 *
 * @see imp-35852-w1-summation-adversarial-ordering (five discrete orderings; clustered 2-run worst)
 * @see imp-35812-w1-summation-scheme-measured-cost (single-ordering baseline; term family + exact ref)
 * @see imp-35854-w1-summation-kappa-sweep (condition-number sweep companion)
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic coherent linear ceiling N * eps)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (ordering and error growth)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35852) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u); imp-35761 quoted its ceiling in eps

// Same representative oscillatory term as imp-35812 / imp-35852 (fixed constants; no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (identical to imp-35812 / imp-35852) -----------------------------
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

// Split into sign groups (original relative order preserved within each group).
const _neg = [];
const _pos = [];
for (let i = 0; i < N_AT_TPT; i++) {
  if (_base[i] < 0) _neg.push(_base[i]);
  else _pos.push(_base[i]);
}
const MAX_M = Math.min(_neg.length, _pos.length); // largest chunk count keeping every chunk nonempty

// Split an array into m contiguous, as-equal-as-possible chunks (each nonempty for m <= len).
function chunkContiguous(arr, m) {
  const out = [];
  const n = arr.length;
  for (let j = 0; j < m; j++) {
    const lo = Math.floor((j * n) / m);
    const hi = Math.floor(((j + 1) * n) / m);
    out.push(arr.slice(lo, hi));
  }
  return out;
}

// Build an ordering with exactly r = 2 m maximal same-sign runs: interleave the m negative
// chunks with the m positive chunks (neg-chunk, pos-chunk, neg-chunk, pos-chunk, ...).
function buildRunOrdering(m) {
  const negChunks = chunkContiguous(_neg, m);
  const posChunks = chunkContiguous(_pos, m);
  const out = new Float64Array(N_AT_TPT);
  let w = 0;
  for (let j = 0; j < m; j++) {
    const nc = negChunks[j];
    for (let i = 0; i < nc.length; i++) out[w++] = nc[i];
    const pc = posChunks[j];
    for (let i = 0; i < pc.length; i++) out[w++] = pc[i];
  }
  return out;
}

// Count maximal same-sign runs actually present in an ordering (verifies r = 2 m).
function countRuns(terms) {
  let runs = 0;
  let prev = 0;
  for (let i = 0; i < terms.length; i++) {
    const s = terms[i] < 0 ? -1 : 1;
    if (s !== prev) {
      runs++;
      prev = s;
    }
  }
  return runs;
}

// imp-35761 pessimistic ceilings (normalized errors), for direct contrast.
const CEIL_NAIVE_LINEAR = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10 (coherent directed-rounding N * eps)
const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (log2(N) * eps)
const CEIL_KAHAN = 2 * U_ROUNDOFF; // ~2.22e-16 (unit-roundoff floor)

// -- Run-count ladder: m from 1 (r=2 clustered) up to MAX_M (r ~ N, oscillatory extreme) --
const M_LADDER = [1, 2, 4, 8, 16, 32, 64, 128, 256, 1024, 4096, 16384, 65536, MAX_M];

const RUNGS = M_LADDER.map((m) => {
  const a = buildRunOrdering(m);
  const runs = countRuns(a);
  const naive = normalizedError(sumNaive(a), _trueNum, _sumAbs);
  const pairwise = normalizedError(sumPairwise(a), _trueNum, _sumAbs);
  const kahan = normalizedError(sumKahan(a), _trueNum, _sumAbs);
  return {
    chunks: m,
    runs,
    naiveNormErr: naive,
    pairwiseNormErr: pairwise,
    kahanNormErr: kahan,
    naiveFractionOfCoherentCeiling: naive / CEIL_NAIVE_LINEAR,
    naiveOrdersBelowCoherentCeiling: Math.log10(CEIL_NAIVE_LINEAR / naive),
  };
});

// Original oscillatory ordering (the k = 1..N baseline), for the extreme reference point.
const _origRuns = countRuns(_base);
const _origNaive = normalizedError(sumNaive(_base), _trueNum, _sumAbs);

// Summary quantities.
const RUNG_MIN_R = RUNGS[0]; // r = 2, clustered worst
const RUNG_MAX_R = RUNGS[RUNGS.length - 1]; // r ~ N, oscillatory extreme
const NAIVE_AT_R2 = RUNG_MIN_R.naiveNormErr;
const NAIVE_AT_MAXR = RUNG_MAX_R.naiveNormErr;
const FRAC_AT_R2 = RUNG_MIN_R.naiveFractionOfCoherentCeiling;
const FRAC_AT_MAXR = RUNG_MAX_R.naiveFractionOfCoherentCeiling;
const MAX_FRACTION = Math.max(...RUNGS.map((r) => r.naiveFractionOfCoherentCeiling));

// Coherent-regime descent slope d log10(naive) / d log10(r) over r = 2 .. 64 (chunks 1 .. 32).
const _rung64 = RUNGS.find((r) => r.chunks === 32); // r = 64
const DESCENT_SLOPE =
  (Math.log10(_rung64.naiveNormErr) - Math.log10(NAIVE_AT_R2)) /
  (Math.log10(_rung64.runs) - Math.log10(RUNG_MIN_R.runs));

const PAIRWISE_WORST = Math.max(...RUNGS.map((r) => r.pairwiseNormErr));
const KAHAN_WORST = Math.max(...RUNGS.map((r) => r.kahanNormErr));

export const IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE = {
  id: 'imp-35887',
  proofSection: 'S-frontier',
  question:
    'How does the fraction of the coherent N * eps naive-summation ceiling attained by naive recursive ' +
    'summation vary with the NUMBER of maximal same-sign runs r in the term ordering, interpolating between ' +
    'the imp-35852 clustered r = 2 worst case and the oscillatory extreme r ~ N on the same multiset? ' +
    'Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same multiset as imp-35812/imp-35852)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: CONDITION_NUMBER,
    negativeCount: _neg.length,
    positiveCount: _pos.length,
    maxRunChunks: MAX_M,
    note: 'a fixed multiset re-summed under run-count-controlled permutations; the exact sum is permutation-invariant',
  },
  construction: {
    method:
      'split negatives into m contiguous chunks and positives into m contiguous chunks, then interleave ' +
      '(neg-chunk, pos-chunk, ...) to force exactly r = 2 m maximal same-sign runs',
    mLadder: M_LADDER,
    note: 'm = 1 reproduces the imp-35852 clustered r = 2 case; m = MAX_M drives r up to ~ N (oscillatory extreme)',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    permutationInvariant: true,
    note: 'one exact reference is computed once and reused for every run-count rung (the true sum does not depend on order)',
  },
  ceilings: {
    naiveCoherentLinear: { value: CEIL_NAIVE_LINEAR, source: 'imp-35761 worst-case N * eps (coherent directed rounding)' },
    pairwise: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N) * eps' },
    kahan: { value: CEIL_KAHAN, source: 'unit-roundoff floor ~ 2 u (N-independent Kahan bound)' },
  },
  rungs: RUNGS,
  oscillatoryBaseline: {
    runs: _origRuns,
    naiveNormErr: _origNaive,
    naiveFractionOfCoherentCeiling: _origNaive / CEIL_NAIVE_LINEAR,
    note: 'the imp-35812 k = 1..N oscillatory order; the run-count ladder plateau lands on this floor',
  },
  summary: {
    naiveAtR2: NAIVE_AT_R2,
    naiveAtMaxR: NAIVE_AT_MAXR,
    fractionAtR2: FRAC_AT_R2,
    fractionAtMaxR: FRAC_AT_MAXR,
    fractionDecayR2ToMaxR: FRAC_AT_R2 / FRAC_AT_MAXR,
    maxFractionOfCoherentCeiling: MAX_FRACTION,
    coherentRegimeDescentSlope: DESCENT_SLOPE,
    pairwiseWorstNormErr: PAIRWISE_WORST,
    kahanWorstNormErr: KAHAN_WORST,
  },
  reading: {
    fractionHighestAtFewestRuns:
      'the attained-coherence fraction is HIGHEST at the fewest runs (r = 2, ~4.48e-5) and decays as the ' +
      'ordering is broken toward the oscillatory extreme (r ~ N, ~2.55e-7) -- a ~175x fall',
    coherentRegimeInversePowerLaw:
      'in the coherent regime r = 2 .. ~64 the naive error descends as a near-inverse power law in the run ' +
      'count -- slope ~ -1.06 over r in [2, 64], i.e. ~ r^{-1}, NOT the ~r^{-1/2} a run-sum central-limit ' +
      'heuristic would predict; the coherent within-run accumulator buildup falls faster than sqrt',
    plateauOntoRandomWalkFloor:
      'past r ~ 256 the naive error FLATTENS onto the random-walk roundoff floor ~2.8e-17 (individual rungs ' +
      'wobble within ~10x near the floor), matching the imp-35812/imp-35852 oscillatory baseline ~3.03e-17 -- ' +
      'the O(sqrt(N) * u) regime',
    ceilingNeverAttained:
      'the coherence fraction never exceeds ~4.5e-5: even at the fewest realizable runs the naive error stays ' +
      '> 2e4x (~4.35 orders) BELOW the coherent O(N * u) ceiling',
    compensatedSchemesRunCountRobust:
      'pairwise stays below its log2(N) * eps ceiling (~4.20e-15) and Kahan-Babuska stays at the unit-roundoff ' +
      'floor (< 2 u) at every run count -- both compensated / hierarchical schemes are run-count-robust',
    allUnderMargin:
      'all schemes at all run counts remain ~10+ orders below the O(1) barrier margin |A_t + B_t| - |C_t| ' +
      '(imp-35760 allocation)',
  },
  conclusion: {
    coherenceFractionInversePowerThenPlateau:
      'the attained-coherence fraction is a decreasing ~r^{-1}-then-plateau function of the run count that ' +
      'TOPS OUT ~4.35 orders below the pessimistic linear ceiling; the coherent worst case is approached but ' +
      'NOT attained at any realizable run count',
    compensatedSchemesRobust:
      'pairwise and Kahan-Babuska are run-count-robust -- pairwise stays below its log2(N) ceiling and Kahan ' +
      'stays at the roundoff floor regardless of run count',
    precisionNotBinding:
      'achievable double precision leaves overwhelming strict headroom at every run count; precision is NOT ' +
      'the binding constraint',
    staysGreenfield:
      'this module measures scheme errors as a function of run count only; it evaluates no sum of H_t and ' +
      'verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
      'and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Constructing a ladder of orderings ' +
    'with a controlled number r = 2 m of maximal same-sign runs (m from 1 to ~244274) on the FIXED imp-35812 ' +
    'length-N = 488602 term multiset -- by interleaving m negative chunks with m positive chunks -- and ' +
    'measuring naive/pairwise/Kahan-Babuska against the SAME exact BigInt reference, the naive attained-' +
    'coherence fraction is HIGHEST at r = 2 (~4.48e-5, the imp-35852 clustered worst) and DECAYS ~175x to ' +
    '~2.55e-7 at r ~ N. In the coherent regime r = 2 .. ~64 the naive error descends as a near-inverse power ' +
    'law (slope ~ -1.06 over r in [2, 64], ~ r^{-1}, steeper than the ~r^{-1/2} a run-sum central-limit ' +
    'heuristic predicts), then FLATTENS past r ~ 256 onto the random-walk roundoff floor ~2.8e-17 matching ' +
    'the oscillatory baseline ~3.03e-17. The coherence fraction never exceeds ~4.5e-5: even at the fewest ' +
    'realizable runs the naive error stays > 2e4x (~4.35 orders) BELOW the coherent O(N * u) ceiling ' +
    '~1.08e-10, so full sign-coherence is not realizable at any run count. Pairwise stays below its ' +
    'log2(N) * eps ceiling and Kahan stays at the unit-roundoff floor at every run count -- both compensated ' +
    '/ hierarchical schemes are run-count-robust. All schemes at all run counts remain ~10+ orders below the ' +
    'O(1) barrier margin |A_t + B_t| - |C_t|. Precision is NOT the binding constraint at any run count; the ' +
    'obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). ' +
    'Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes ' +
    'no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35852 (five discrete orderings; clustered 2-run worst this interpolates from); imp-35812 ' +
    '(single-ordering baseline; term family + exact BigInt reference); imp-35854 (condition-number sweep ' +
    'companion); imp-35761 (pessimistic coherent linear ceiling N * eps); imp-35760 (barrier-margin ' +
    'allocation); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A (A+B-C ' +
    'interval bound greenfield); Higham 2002 (ordering and summation error growth); Platt-Trudgian 2021 ' +
    '(barrier base).',
};

export const IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE_ASSERTIONS = [
  {
    // Same anchor as imp-35812/imp-35852: N = floor(sqrt(T_PT/4 pi)) ~ 488602 terms at T_PT = 3e12.
    id: 'imp35887-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12; ladder built',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      RUNGS.length === M_LADDER.length &&
      RUNGS.length >= 10,
  },
  {
    // The construction yields exactly r = 2 m maximal same-sign runs at every rung; the ladder
    // spans from the clustered r = 2 case up to r ~ N (oscillatory extreme).
    id: 'imp35887-run-count-construction',
    description: 'Each rung has exactly r = 2 m maximal same-sign runs; ladder spans r = 2 up to r ~ N',
    holds: () =>
      RUNGS.every((r) => r.runs === 2 * r.chunks) &&
      RUNG_MIN_R.runs === 2 &&
      RUNG_MAX_R.runs > 0.99 * N_AT_TPT &&
      RUNG_MAX_R.runs <= N_AT_TPT,
  },
  {
    // Attained-coherence fraction is HIGHEST at the fewest runs (r = 2 clustered, matches imp-35852)
    // and decays substantially toward the oscillatory extreme.
    id: 'imp35887-fraction-highest-at-fewest-runs',
    description: 'Coherence fraction is largest at r = 2 (~4.5e-5, imp-35852 clustered) and decays >50x to r ~ N',
    holds: () =>
      FRAC_AT_R2 === MAX_FRACTION &&
      NAIVE_AT_R2 > 3e-15 && NAIVE_AT_R2 < 7e-15 &&
      FRAC_AT_R2 / FRAC_AT_MAXR > 50,
  },
  {
    // Coherent regime r = 2 .. 64 descends as a near-inverse power law (~ r^{-1}, steeper than r^{-1/2}).
    id: 'imp35887-coherent-regime-inverse-power-law',
    description: 'Naive descends as ~ r^{-1} over r in [2,64] (slope steeper than -0.7, milder than -1.4)',
    holds: () =>
      DESCENT_SLOPE < -0.7 &&
      DESCENT_SLOPE > -1.4 &&
      _rung64.naiveNormErr < 0.1 * NAIVE_AT_R2,
  },
  {
    // Past the descent the naive error FLATTENS onto the random-walk floor matching the oscillatory baseline.
    id: 'imp35887-plateau-onto-random-walk-floor',
    description: 'Naive at r ~ N flattens onto the random-walk floor within ~10x of the oscillatory baseline',
    holds: () =>
      NAIVE_AT_MAXR < 1e-16 &&
      NAIVE_AT_MAXR / _origNaive > 0.1 &&
      NAIVE_AT_MAXR / _origNaive < 10,
  },
  {
    // The coherent ceiling is NEVER attained: the fraction stays > 2e4x below N*eps at every run count.
    id: 'imp35887-coherent-ceiling-never-attained',
    description: 'Coherence fraction never exceeds ~4.5e-5 (naive stays >2e4x below the coherent N*eps ceiling)',
    holds: () =>
      MAX_FRACTION < 1e-3 &&
      RUNGS.every((r) => r.naiveNormErr < 1e-3 * CEIL_NAIVE_LINEAR) &&
      RUNG_MIN_R.naiveOrdersBelowCoherentCeiling > 4,
  },
  {
    // Pairwise and Kahan are run-count-robust across the whole ladder.
    id: 'imp35887-compensated-schemes-run-count-robust',
    description: 'Pairwise < log2(N)*eps and Kahan < 2u at every run count (ordering/run-count-robust)',
    holds: () =>
      PAIRWISE_WORST < CEIL_PAIRWISE &&
      KAHAN_WORST < CEIL_KAHAN &&
      RUNGS.every((r) => r.pairwiseNormErr < CEIL_PAIRWISE && r.kahanNormErr < CEIL_KAHAN && r.pairwiseNormErr > 0),
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35887-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /approached but/.test(IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE.conclusion.coherenceFractionInversePowerThenPlateau) &&
      /GREENFIELD/.test(IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE.verdict) &&
      /refereed bound is changed/i.test(IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE.verdict),
  },
];

for (const a of IMP35887_W1_SUMMATION_RUNCOUNT_COHERENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35887-w1-summation-runcount-coherence assertion failed: ${a.id}`);
  }
}
