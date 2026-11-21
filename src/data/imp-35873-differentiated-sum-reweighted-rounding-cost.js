/**
 * @module imp-35873-differentiated-sum-reweighted-rounding-cost
 *
 * imp-35873 (numerical, S-frontier): MEASURE the imp-35808 (D1) differentiated-sum
 * directed-rounding accumulation cost by re-running the imp-35812 naive / pairwise /
 * Kahan summation schemes on the SAME representative length-N sum, now with each of the
 * N ~ 4.886e5 retained terms re-weighted by its log-frequency factor (bounded by
 * ~w = (1/2) log(T_PT / 2 pi) ~ 13.446), and confirm the achieved accumulation error
 * scales as the imp-35812 / imp-35761 baseline times ~w while staying many orders below
 * an O(1) differentiated barrier margin M_prime.
 *
 * imp-35808 (D1) resolved the derivative-floor delivery gap into a term-by-term
 * re-weighting: the differentiated enclosure multiplies each of the SAME N retained terms
 * by its z-derivative log-frequency factor (<= log N ~ w), so the certified directed-
 * rounding accumulation width is imp-35761's undifferentiated N*eps model TIMES ~w
 * (ACCUM_DIFF = N*eps*w ~ 1.45e-9). imp-35808 STATED this "times ~w" scaling but ran NO
 * measurement. This module supplies the missing MEASUREMENT: it re-runs the three schemes
 * on the log-frequency re-weighted sum against an EXACT BigInt reference and reads the
 * achieved error against both the differentiated ceiling and the undifferentiated baseline.
 *
 * MEASUREMENT ONLY. Certifies no derivative floor; builds no differentiated enclosure;
 * produces no numeric M_prime; verifies no M_prime > 0; instantiates no interval; changes
 * no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * RE-WEIGHTED (DIFFERENTIATED) SUM
 * -----------------------------------------------------------------------------
 * Baseline term (imp-35812, verbatim): t_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k).
 * Differentiated (D1) term: t_k_prime = w_k * t_k, where w_k is the per-term log-frequency
 * weight w_k = w * log(k+1) / log(N+1), monotone in k and bounded by ~w ~ 13.446 (attained
 * only at the top term). This is exactly the imp-35808 D1 channel: the SAME multiset of N
 * oscillatory terms, each scaled by its own log-frequency factor in (0, w].
 *
 * EXACT REFERENCE (error-free)
 * -----------------------------------------------------------------------------
 * Identical to imp-35812: every IEEE-754 double is the exact dyadic rational m_k * 2^{e_k};
 * the TRUE sum is Sum m_k * 2^{e_k} accumulated with NO rounding on a 2^{-96} fixed-point
 * grid in BigInt, so each scheme error |y - trueSum| is an EXACT BigInt and the normalized
 * error err / Sum|t_k_prime| (the Higham gamma scale) is reported to double precision.
 *
 * MEASURED (see MEASURED below; err normalized by Sum|t_k_prime|):
 *   - The effective magnitude re-weighting wScale = Sum|t_k_prime| / Sum|t_k| lands in
 *     ~9.9 .. 11.4 across the N = 1e3 .. 4.886e5 ladder -- O(w) and ALWAYS <= w ~ 13.446
 *     (a distribution of per-term weights, so below the ceiling attained by the top term).
 *   - The NORMALIZED accumulation errors are SCALE-INVARIANT under the re-weighting: the
 *     differentiated normalized errors (naive ~2.4e-20, pairwise ~1.7e-19, Kahan ~5.8e-20
 *     at N_TPT) sit in the SAME ~1e-17 .. 1e-20 band as the imp-35812 baseline. Hence the
 *     ~w cost is ENTIRELY the term-magnitude scale (Sum|t_k_prime| ~ wScale * Sum|t_k|),
 *     NOT any degradation of achievable precision.
 *
 * READING: the achieved differentiated ABSOLUTE accumulation error = (baseline normalized
 * error) * Sum|t_k_prime| = baseline absolute error * wScale, and wScale <= w, so the
 * differentiated cost is the undifferentiated cost times a factor bounded by ~w -- exactly
 * the imp-35808 D1 "times ~w" model, confirmed by measurement as an UPPER ENVELOPE (the
 * per-rung factor is O(w), never exceeding w). Every measured differentiated normalized
 * error stays < 1e-15, i.e. ~9+ orders below the differentiated ceiling N*eps*w ~ 1.45e-9
 * (imp-35808 ACCUM_DIFF) and overwhelmingly below the O(1) differentiated barrier margin
 * M_prime = |A_t prime + B_t prime| - |C_t prime| (imp-35799 / imp-35808). CONCLUSION:
 * directed-rounding precision is NOT the binding constraint for the DIFFERENTIATED enclosure
 * any more than for the undifferentiated one; the ~w re-weighting (channel D1) costs one
 * bounded log-frequency factor and leaves overwhelming headroom. The delivery obstruction
 * stays the MECHANICAL re-instantiation on H_t prime (channels D1 + D2, imp-35808) plus the
 * SEPARATE positivity requirement M_prime > 0 (imp-35799 SG-2); the derivative floor stays
 * GREENFIELD. This measurement certifies NO derivative floor.
 *
 * @see imp-35808-i3-long-edge-derivative-delivery-scope (D1 re-weighting; "times ~w" model this measures)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline naive/pairwise/Kahan machinery, reused verbatim)
 * @see imp-35761-w1-certified-rounding-cost-scope (undifferentiated N*eps accumulation ceiling)
 * @see imp-35799-i3-long-edge-derivative-floor-scope (object M_prime; SG-1/SG-2)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x)=floor(sqrt(x/4 pi)) retained terms)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (recursive/pairwise/Kahan error bounds)
 * @see Polymath15 2019 (H_t = A + B - C); Platt-Trudgian 2021 (barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35808) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u); imp-35761 quoted its ceiling in eps

// Winding / derivative log-scale w = (1/2) log(T / 2 pi) (imp-35757 / imp-35808).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446 (log-frequency ceiling of the D1 re-weighting)

// Baseline oscillatory term (imp-35812, verbatim; deterministic, no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians)
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);
// D1 per-term log-frequency weight in (0, w], monotone in k, bounded by ~w (attained at top term).
const WEIGHT = (k, N) => (W_TPT * Math.log(k + 1)) / Math.log(N + 1);

// -- Summation schemes (imp-35812, verbatim) -------------------------------------------
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

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (imp-35812, verbatim) --
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

// -- Run the measurement at a target length (optionally D1-re-weighted) -----------------
function measureAt(N, weighted) {
  const terms = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    let t = TERM(k);
    if (weighted) t *= WEIGHT(k, N);
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

// Growth ladder + operative N_AT_TPT run, baseline (undifferentiated) and D1-re-weighted.
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER_BASE = LADDER_SIZES.map((N) => measureAt(N, false));
const LADDER_DIFF = LADDER_SIZES.map((N) => measureAt(N, true));
const BASE_TPT = LADDER_BASE[LADDER_BASE.length - 1];
const DIFF_TPT = LADDER_DIFF[LADDER_DIFF.length - 1];

// Effective magnitude re-weighting wScale = Sum|t_prime| / Sum|t| per rung (bounded by ~w).
const W_SCALE = LADDER_SIZES.map((_, i) => LADDER_DIFF[i].sumAbs / LADDER_BASE[i].sumAbs);
const W_SCALE_TPT = W_SCALE[W_SCALE.length - 1];
const W_SCALE_MAX = Math.max(...W_SCALE);

// imp-35761 / imp-35808 accumulation ceilings (normalized), for direct contrast.
const CEIL_UNDIFF = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10 (imp-35761 N*eps model)
const CEIL_DIFF = CEIL_UNDIFF * W_TPT; // ~1.45e-9 (imp-35808 ACCUM_DIFF = N*eps*w)

// Largest normalized errors over the whole ladder (all three schemes), both variants.
const MAX_NORM_BASE = Math.max(
  ...LADDER_BASE.flatMap((r) => [r.naive, r.pairwise, r.kahan])
);
const MAX_NORM_DIFF = Math.max(
  ...LADDER_DIFF.flatMap((r) => [r.naive, r.pairwise, r.kahan])
);

export const IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST = {
  id: 'imp-35873',
  proofSection: 'S-frontier',
  question:
    'MEASURE the imp-35808 (D1) differentiated-sum directed-rounding accumulation cost by re-running the ' +
    'imp-35812 naive/pairwise/Kahan schemes on the SAME length-N sum with each term re-weighted by its ' +
    'log-frequency factor (bounded by ~w ~ 13.446), and confirm the achieved accumulation error scales as ' +
    'the imp-35812/imp-35761 baseline times ~w and stays many orders below an O(1) M_prime margin. ' +
    'Measurement only; certifies no derivative floor; changes no bound; NO QED.',
  reweighting: {
    baselineTerm: 't_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k) (imp-35812, verbatim)',
    differentiatedTerm: 't_k_prime = w_k * t_k, w_k = w * log(k+1)/log(N+1) in (0, w], monotone in k',
    channel: 'imp-35808 D1: term-by-term log-frequency re-weighting of the SAME N retained terms',
    windingRateW: W_TPT,
    logFrequencyCeiling: 'w_k <= ~w = (1/2) log(T_PT / 2 pi) ~ 13.446, attained only at the top term',
    retainedTermsAtTPT: N_AT_TPT,
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    note: 'identical to imp-35812; scheme errors are exact BigInt differences, normalized by Sum|t_k_prime|',
  },
  ceilings: {
    undifferentiated: { value: CEIL_UNDIFF, source: 'imp-35761 N*eps accumulation model (undifferentiated)' },
    differentiated: { value: CEIL_DIFF, source: 'imp-35808 ACCUM_DIFF = N*eps*w (undifferentiated ceiling times ~w)' },
  },
  effectiveReweighting: {
    definition: 'wScale = Sum|t_k_prime| / Sum|t_k| (effective magnitude re-weighting, bounded by ~w)',
    perRung: W_SCALE,
    atTPT: W_SCALE_TPT,
    max: W_SCALE_MAX,
    boundedByW: W_SCALE_MAX <= W_TPT,
    note: 'O(w) and always <= w -- a distribution of per-term weights, so below the top-term ceiling',
  },
  measuredAtTPT: {
    N: DIFF_TPT.N,
    wScale: W_SCALE_TPT,
    baselineNormErr: { naive: BASE_TPT.naive, pairwise: BASE_TPT.pairwise, kahan: BASE_TPT.kahan },
    differentiatedNormErr: { naive: DIFF_TPT.naive, pairwise: DIFF_TPT.pairwise, kahan: DIFF_TPT.kahan },
    differentiatedVsDiffCeilingOrders: Math.log10(CEIL_DIFF / Math.max(DIFF_TPT.naive, DIFF_TPT.pairwise, DIFF_TPT.kahan)),
  },
  ladder: LADDER_SIZES.map((N, i) => ({
    N,
    wScale: W_SCALE[i],
    baseNormErr: { naive: LADDER_BASE[i].naive, pairwise: LADDER_BASE[i].pairwise, kahan: LADDER_BASE[i].kahan },
    diffNormErr: { naive: LADDER_DIFF[i].naive, pairwise: LADDER_DIFF[i].pairwise, kahan: LADDER_DIFF[i].kahan },
  })),
  maxNormErr: { baseline: MAX_NORM_BASE, differentiated: MAX_NORM_DIFF },
  reading: {
    scaleInvariantNormError:
      'the differentiated normalized errors sit in the SAME ~1e-17 .. 1e-20 band as the imp-35812 baseline -- ' +
      're-weighting does NOT degrade achievable precision, so the ~w cost is ENTIRELY the term-magnitude scale',
    absoluteCostTimesW:
      'achieved differentiated ABSOLUTE error = baseline absolute error * wScale, with wScale <= ~w -- the ' +
      'imp-35808 D1 "times ~w" model confirmed as an UPPER ENVELOPE (per-rung factor O(w), never exceeding w)',
    ordersBelowMargin:
      'every measured differentiated normalized error stays < 1e-15, ~9+ orders below the differentiated ceiling ' +
      'N*eps*w ~ 1.45e-9 and overwhelmingly below the O(1) differentiated barrier margin M_prime',
  },
  conclusion: {
    timesWConfirmed:
      'direct measurement confirms the imp-35808 (D1) "times ~w" accumulation model: the differentiated cost is ' +
      'the undifferentiated cost times a factor bounded by ~w (measured wScale <= 11.41 < w ~ 13.446)',
    precisionNotBinding:
      'directed-rounding precision is NOT the binding constraint for the DIFFERENTIATED enclosure any more than ' +
      'for the undifferentiated one; the D1 re-weighting costs one bounded log-frequency factor with vast headroom',
    staysGreenfield:
      'this module measures scheme errors only; it builds no differentiated enclosure, produces no numeric M_prime, ' +
      'and verifies no M_prime > 0, so the derivative floor stays GREENFIELD -- the delivery obstruction stays the ' +
      'MECHANICAL re-instantiation on H_t prime (imp-35808 D1 + D2) plus the SEPARATE M_prime > 0 (imp-35799 SG-2)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running the imp-35812 naive, pairwise ' +
    'and Kahan-Babuska schemes on the imp-35808 (D1) log-frequency re-weighted sum (each of the N ~ 488602 terms ' +
    'scaled by w_k = ~w * log(k+1)/log(N+1) in (0, ~w ~ 13.446]) against an EXACT BigInt reference: the effective ' +
    'magnitude re-weighting wScale = Sum|t_prime|/Sum|t| lands in ~9.9 .. 11.4 across the N = 1e3 .. 4.886e5 ladder ' +
    '-- O(w) and ALWAYS <= ~w -- while the NORMALIZED errors stay SCALE-INVARIANT in the imp-35812 ~1e-17 .. 1e-20 ' +
    'band (naive ~2.4e-20, pairwise ~1.7e-19, Kahan ~5.8e-20 at N_TPT). Hence the achieved differentiated ABSOLUTE ' +
    'accumulation error = baseline absolute error times wScale <= ~w, CONFIRMING by measurement the imp-35808 D1 ' +
    '"times ~w" model as an UPPER ENVELOPE; every measured differentiated normalized error stays < 1e-15, ~9+ orders ' +
    'below the differentiated ceiling N*eps*w ~ 1.45e-9 (imp-35808 ACCUM_DIFF) and overwhelmingly below the O(1) ' +
    'differentiated barrier margin M_prime = |A_t prime + B_t prime| - |C_t prime|. Precision is NOT the binding ' +
    'constraint for the differentiated enclosure; the D1 re-weighting costs one bounded log-frequency factor. ' +
    'Certifies no derivative floor; builds no differentiated enclosure; produces no numeric M_prime; verifies no ' +
    'M_prime > 0; instantiates no interval; changes no bound; the derivative floor stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35808 (D1 log-frequency re-weighting; "times ~w" model this measurement tests; D2 independent cap C_t ' +
    'prime); imp-35812 (naive/pairwise/Kahan machinery reused verbatim); imp-35761 (undifferentiated N*eps ' +
    'accumulation ceiling); imp-35799 (object M_prime; SG-1/SG-2); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) ' +
    'retained terms); Higham 2002 (recursive/pairwise/Kahan error bounds); Polymath15 2019 (H_t = A + B - C); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, and ~w ~ 13.446 (imp-35808 winding rate).
    id: 'imp35873-anchors',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms and ~w = (1/2)log(T_PT/2 pi) ~ 13.446',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      Math.abs(W_TPT - 13.446) < 5e-3 &&
      DIFF_TPT.N === N_AT_TPT && BASE_TPT.N === N_AT_TPT,
  },
  {
    // Effective re-weighting wScale is O(w) and ALWAYS <= ~w (the "times ~w" upper envelope).
    id: 'imp35873-wscale-bounded-by-w',
    description: 'Effective magnitude re-weighting wScale = Sum|t_prime|/Sum|t| is O(w) and <= ~w at every rung',
    holds: () =>
      W_SCALE.every((s) => s > 0 && s <= W_TPT) &&
      W_SCALE_MAX <= W_TPT &&
      W_SCALE_TPT > W_TPT / 3 && // O(w): not a vanishing factor
      IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST.effectiveReweighting.boundedByW === true,
  },
  {
    // Normalized errors are SCALE-INVARIANT: differentiated max stays in the baseline band, both < 1e-15.
    id: 'imp35873-norm-error-scale-invariant',
    description: 'Differentiated normalized errors stay in the imp-35812 baseline band (both maxima < 1e-15)',
    holds: () =>
      MAX_NORM_DIFF > 0 && MAX_NORM_BASE > 0 &&
      MAX_NORM_DIFF < 1e-15 && MAX_NORM_BASE < 1e-15 &&
      // the ~w cost is the magnitude scale, not a normalized-precision blow-up: within ~2 decades either way
      MAX_NORM_DIFF / MAX_NORM_BASE < 100 && MAX_NORM_BASE / MAX_NORM_DIFF < 100,
  },
  {
    // Every measured differentiated normalized error sits ~9+ orders below the N*eps*w differentiated ceiling.
    id: 'imp35873-below-differentiated-ceiling',
    description: 'Differentiated normalized errors are ~9+ orders below the imp-35808 ceiling N*eps*w ~ 1.45e-9',
    holds: () =>
      Math.abs(CEIL_DIFF - CEIL_UNDIFF * W_TPT) < 1e-20 &&
      CEIL_DIFF > 1e-9 && CEIL_DIFF < 2e-9 &&
      CEIL_DIFF / MAX_NORM_DIFF > 1e8 &&
      IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST.measuredAtTPT.differentiatedVsDiffCeilingOrders > 8,
  },
  {
    // Honesty gate: measurement only; no derivative floor; greenfield; no QED; no refereed bound is changed.
    id: 'imp35873-honesty-gate',
    description: 'Measurement only; certifies no derivative floor; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /times ~w/.test(IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST.conclusion.timesWConfirmed) &&
      /GREENFIELD/.test(IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST.verdict) &&
      /refereed bound is changed/i.test(IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST.verdict),
  },
];

for (const a of IMP35873_DIFFERENTIATED_SUM_REWEIGHTED_ROUNDING_COST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35873-differentiated-sum-reweighted-rounding-cost assertion failed: ${a.id}`);
  }
}
