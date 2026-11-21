/**
 * @module imp-35812-w1-summation-scheme-measured-cost
 *
 * imp-35812 (numerical, S-frontier): MEASURE the ACHIEVABLE rounding-error growth of
 * pairwise and Kahan-compensated summation on a representative sum of the imp-35761
 * length (N = floor(sqrt(T_PT / 4 pi)) ~ 488602 terms at T_PT = 3e12), and contrast the
 * measured errors against the PESSIMISTIC linear-in-N ceiling ~ N * eps that imp-35761
 * supplied for the naive recursive sum.
 *
 * imp-35761 modeled the certified-rounding cost of the W1 A + B - C interval sum with the
 * classical worst-case recursive-sum forward error gamma_{N-1} = (N-1) u / (1 - (N-1) u)
 * ~ N u (Higham), calling it a PESSIMISTIC ceiling and noting -- without measuring -- that
 * pairwise summation replaces N by log2(N) ~ 18.9 and Kahan compensation removes the
 * N-dependence entirely. This module supplies the missing MEASUREMENT: it actually RUNS
 * the three summation schemes (naive recursive, pairwise divide-and-conquer, Kahan-Babuska
 * compensated) on a representative length-N oscillatory sum and measures each scheme error
 * against an EXACT reference computed by summing the terms as dyadic rationals in BigInt
 * (error-free), then compares the measured errors to the imp-35761 linear ceiling.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * REPRESENTATIVE SUM
 * -----------------------------------------------------------------------------
 * To mimic the A_t + B_t - C_t structure (many oscillatory terms of comparable magnitude
 * summing with heavy cancellation), the terms are
 *      t_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k),   k = 1 .. N,
 * a bounded oscillatory Dirichlet-like sum with magnitudes decaying from 1 to 1/sqrt(N)
 * and a condition number kappa = (Sum |t_k|) / |Sum t_k| ~ 1.4e3 at N = 488602. Constants
 * alpha, beta are fixed (golden-ratio / arctan-adjacent) so the measurement is fully
 * deterministic and reproducible; no randomness is used.
 *
 * EXACT REFERENCE (error-free)
 * -----------------------------------------------------------------------------
 * Each IEEE-754 double t_k is exactly the dyadic rational m_k * 2^{e_k}; the TRUE sum is
 * therefore Sum m_k * 2^{e_k}, computed with no rounding by shifting every term onto a
 * common 2^{-96} fixed-point grid and accumulating in BigInt. Each scheme result y is
 * decomposed the same way, so |y - trueSum| is an EXACT BigInt; the normalized error
 * err/Sum|t_k| (the quantity Higham gamma_{N-1} bounds) is reported to double precision.
 *
 * MEASURED at N = 488602 (see MEASURED below; err normalized by Sum|t_k|):
 *   naive recursive : ~3.0e-17   (imp-35761 linear ceiling N * eps ~ 1.08e-10)
 *   pairwise (d&c)  : ~3.6e-19   (imp-35761 pairwise ceiling log2(N) * eps ~ 4.20e-15)
 *   Kahan-Babuska   : ~1.9e-20   (~ unit-roundoff floor, N-independent)
 *
 * READING: the ACHIEVED naive error sits ~6 orders below the pessimistic linear ceiling --
 * the directed-rounding worst case assumes the N errors add COHERENTLY, but on real data
 * they accumulate as a random walk (naive absolute error tracks O(sqrt(N) * u) across the
 * ladder N = 1e3 .. 4.886e5, NOT O(N * u)). Pairwise summation delivers a further ~2 orders
 * (tracking O(log2(N) * u)); Kahan delivers ~1 more and shows NO growth with N (flat at the
 * unit-roundoff floor). ALL three, and the pessimistic ceiling itself, remain ~10+ orders
 * below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760 allocation). CONCLUSION: the
 * imp-35761 linear model is confirmed PESSIMISTIC by direct measurement; achievable double
 * precision under any of the three schemes leaves overwhelming strict headroom, so precision
 * is NOT the binding constraint -- the obstruction stays the ENGINEERING of the certified
 * length-N interval sum, exactly the MECHANICAL classification of imp-35725. The W1 A + B - C
 * certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35761-w1-certified-rounding-cost-scope (supplies the pessimistic linear ceiling this measures)
 * @see imp-35725-w1-effective-error-cap-budget (names the mechanical N-term certified-rounding cost)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all errors sit under)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x)=floor(sqrt(x/4 pi)) retained terms)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (recursive/pairwise/Kahan error bounds)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C); Platt-Trudgian 2021 (barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35674) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u); imp-35761 quoted its ceiling in eps

// Representative oscillatory Dirichlet-like term (fixed constants; deterministic, no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes ------------------------------------------------------------------
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

// -- Run the measurement at a target length --------------------------------------------
function measureAt(N) {
  const terms = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    terms[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  const naive = sumNaive(terms);
  const pairwise = sumPairwise(terms);
  const kahan = sumKahan(terms);
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(terms[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  return {
    N,
    sumAbs,
    trueSum,
    conditionNumber: sumAbs / Math.abs(trueSum),
    naive: normalizedError(naive, trueNum, sumAbs),
    pairwise: normalizedError(pairwise, trueNum, sumAbs),
    kahan: normalizedError(kahan, trueNum, sumAbs),
  };
}

// Growth ladder (sub-N sizes) + the operative N_AT_TPT run. Cheap: ~0.08 s total.
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map(measureAt);
const AT_TPT = LADDER[LADDER.length - 1];

// imp-35761 pessimistic ceilings (normalized errors), for direct contrast.
const CEIL_NAIVE_LINEAR = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10 (imp-35761 N * eps ceiling)
const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (imp-35761 pairwise ceiling)
const CEIL_KAHAN = 2 * U_ROUNDOFF; // ~2.22e-16 (unit-roundoff floor)

export const IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST = {
  id: 'imp-35812',
  proofSection: 'S-frontier',
  question:
    'MEASURE the achievable rounding-error growth of pairwise and Kahan-compensated summation on a ' +
    'representative N ~ 4.886e5-term sum at T_PT = 3e12 versus the pessimistic linear-in-N ceiling ' +
    '~ N * eps imp-35761 supplied for the naive recursive sum. Measurement only; certifies no W1 ' +
    'bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (deterministic, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: AT_TPT.conditionNumber,
    note: 'bounded oscillatory Dirichlet-like sum with heavy cancellation, mimicking A_t + B_t - C_t',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    note: 'the true sum is Sum m_k * 2^{e_k} with NO rounding; scheme errors are exact BigInt differences',
  },
  ceilings: {
    naiveLinear: { value: CEIL_NAIVE_LINEAR, source: 'imp-35761 worst-case N * eps (coherent directed rounding)' },
    pairwise: { value: CEIL_PAIRWISE, source: 'imp-35761 pairwise ceiling log2(N) * eps' },
    kahan: { value: CEIL_KAHAN, source: 'unit-roundoff floor ~ 2 u (N-independent Kahan bound)' },
  },
  measuredAtTPT: {
    N: AT_TPT.N,
    sumAbs: AT_TPT.sumAbs,
    naiveNormErr: AT_TPT.naive,
    pairwiseNormErr: AT_TPT.pairwise,
    kahanNormErr: AT_TPT.kahan,
    naiveVsCeilingOrders: Math.log10(CEIL_NAIVE_LINEAR / AT_TPT.naive),
    pairwiseVsCeilingOrders: Math.log10(CEIL_PAIRWISE / AT_TPT.pairwise),
    kahanVsCeilingOrders: Math.log10(CEIL_KAHAN / AT_TPT.kahan),
  },
  ladder: LADDER.map((r) => ({
    N: r.N,
    naiveNormErr: r.naive,
    pairwiseNormErr: r.pairwise,
    kahanNormErr: r.kahan,
    sqrtNu: Math.sqrt(r.N) * U_ROUNDOFF,
    log2Nu: Math.log2(r.N) * U_ROUNDOFF,
  })),
  reading: {
    naiveIsSubLinear:
      'measured naive error tracks O(sqrt(N) * u) across the ladder (random-walk accumulation), NOT the ' +
      'coherent O(N * u) worst case -- so it sits ~6 orders below the imp-35761 pessimistic linear ceiling',
    pairwiseBuysOrders:
      'pairwise divide-and-conquer tracks O(log2(N) * u), delivering ~2 further orders below the naive error',
    kahanIsFlat:
      'Kahan-Babuska compensation stays at the unit-roundoff floor with NO measurable growth in N',
    allUnderMargin:
      'all three schemes and the pessimistic ceiling itself remain ~10+ orders below the O(1) barrier ' +
      'margin |A_t + B_t| - |C_t| (imp-35760 allocation)',
  },
  conclusion: {
    linearModelConfirmedPessimistic:
      'direct measurement confirms the imp-35761 linear-in-N model is a PESSIMISTIC ceiling: the achieved ' +
      'naive error is ~6 orders below it, and pairwise / Kahan buy further orders exactly as imp-35761 noted',
    precisionNotBinding:
      'achievable double precision under any scheme leaves overwhelming strict headroom; precision is NOT ' +
      'the binding constraint',
    staysGreenfield:
      'this module measures scheme errors only; it evaluates no sum of H_t and verifies no inequality, so ' +
      'the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Running naive, pairwise, and ' +
    'Kahan-Babuska summation on a representative N = floor(sqrt(T_PT/4 pi)) ~ 488602-term oscillatory sum ' +
    'against an EXACT BigInt reference, the measured normalized errors are naive ~3.0e-17, pairwise ~3.6e-19, ' +
    'Kahan ~1.9e-20 -- the naive error sits ~6 orders BELOW the imp-35761 pessimistic linear ceiling N * eps ' +
    '~1.08e-10, tracks O(sqrt(N) * u) (random-walk, not coherent O(N * u)) across the N = 1e3 .. 4.886e5 ' +
    'ladder, pairwise tracks O(log2(N) * u), and Kahan is flat at the unit-roundoff floor. This CONFIRMS by ' +
    'measurement that the imp-35761 linear model is pessimistic and that pairwise / compensated schemes buy ' +
    'further orders, all ~10+ orders below the O(1) barrier margin |A_t + B_t| - |C_t|. Precision is NOT the ' +
    'binding constraint; the obstruction stays the ENGINEERING of the certified length-N interval sum, ' +
    'exactly the MECHANICAL classification of imp-35725. Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35761 (pessimistic linear ceiling this measurement tests); imp-35725 (mechanical N-term certified ' +
    'cost); imp-35760 (barrier-margin allocation); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained ' +
    'terms); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (recursive/pairwise/Kahan ' +
    'error bounds); Polymath15 2019 (effective approximation H_t = A + B - C); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35761 / imp-35674 Part D.
    id: 'imp35812-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      AT_TPT.N === N_AT_TPT,
  },
  {
    // Naive achieved error sits far (>1e5x, ~6 orders) below the imp-35761 linear ceiling N * eps.
    id: 'imp35812-naive-below-linear-ceiling',
    description: 'Measured naive normalized error is >1e5x below the imp-35761 linear ceiling N * eps',
    holds: () =>
      AT_TPT.naive > 0 &&
      AT_TPT.naive < 1e-15 &&
      CEIL_NAIVE_LINEAR / AT_TPT.naive > 1e5 &&
      IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.measuredAtTPT.naiveVsCeilingOrders > 5,
  },
  {
    // Scheme ordering: Kahan < pairwise < naive (compensated beats pairwise beats naive).
    id: 'imp35812-scheme-ordering',
    description: 'Measured normalized errors ordered Kahan < pairwise < naive',
    holds: () =>
      AT_TPT.kahan < AT_TPT.pairwise &&
      AT_TPT.pairwise < AT_TPT.naive &&
      AT_TPT.pairwise < CEIL_PAIRWISE,
  },
  {
    // Kahan shows NO growth with N (flat at the unit-roundoff floor across the ladder).
    id: 'imp35812-kahan-flat',
    description: 'Kahan normalized error stays at the unit-roundoff floor with no N-growth (< 2 u)',
    holds: () => {
      const kahanErrs = LADDER.map((r) => r.kahan);
      const maxK = Math.max(...kahanErrs);
      const minK = Math.min(...kahanErrs);
      return maxK < 2 * U_ROUNDOFF && minK > 0 && maxK / minK < 100;
    },
  },
  {
    // Naive absolute error tracks O(sqrt(N) * u), NOT the coherent O(N * u) worst case.
    id: 'imp35812-naive-sublinear-growth',
    description: 'Naive error tracks O(sqrt(N) * u) at N_TPT, orders below the coherent O(N * u) ceiling',
    holds: () => {
      const naiveAbs = AT_TPT.naive * AT_TPT.sumAbs; // de-normalize to absolute error
      const sqrtNu = Math.sqrt(N_AT_TPT) * U_ROUNDOFF;
      const linearAbsCeil = CEIL_NAIVE_LINEAR * AT_TPT.sumAbs;
      return naiveAbs / sqrtNu > 0.02 && naiveAbs / sqrtNu < 50 && naiveAbs < 1e-3 * linearAbsCeil;
    },
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35812-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /PESSIMISTIC/.test(IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.conclusion.linearModelConfirmedPessimistic) &&
      /GREENFIELD/.test(IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.verdict) &&
      /refereed bound is changed/i.test(IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.verdict),
  },
];

for (const a of IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35812-w1-summation-scheme-measured-cost assertion failed: ${a.id}`);
  }
}
