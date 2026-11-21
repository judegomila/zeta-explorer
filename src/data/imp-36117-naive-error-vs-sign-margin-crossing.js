/**
 * @module imp-36117-naive-error-vs-sign-margin-crossing
 *
 * imp-36117 (numerical, S-frontier): LOCATE the N at which the imp-36094 NAIVE
 * (uncompensated) left-to-right W1 summation error would FIRST exceed the H_t
 * positivity/sign margin at the imp-35973 combined worst-case configuration, and
 * QUANTIFY the headroom the compensated (classic Kahan / KBN) schemes preserve that
 * naive summation loses.
 *
 * BACKGROUND. imp-36094/imp-36023 measured that on the imp-35852 clustered same-sign
 * worst ORDER the NAIVE error grows with conditioning kappa while both compensated
 * schemes stay N-flat. imp-36075 separately measured the "sign margin": the exact
 * delivered sum sits a distance |exact sum| ~ 0.64 (bounded, O(1)) from zero, and the
 * KBN absolute error is ~1e-17, so the delivered value is ~1.5e16..4.3e16 error-widths
 * on the correct side of zero. This module joins the two: for the NAIVE scheme the
 * absolute error grows, so at SOME (extrapolated) N it reaches the distance-to-zero of
 * the delivered quantity -- i.e. the naive relative error reaches ~1 and the sign is no
 * longer guaranteed. We locate that crossing N and contrast it with the compensated
 * schemes, whose N-flat error never approaches the margin at any reachable N.
 *
 * SET-UP (byte-identical schemes / term family / reference to imp-36023 / imp-36075):
 *   - term family t_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k), k = 1..N (imp-35812 family),
 *   - clustered worst ORDER (imp-35852): all negatives first, then all positives -- the
 *     order maximising the running-accumulator excursion and the naive forward error,
 *   - per-N exact 2^{-96} dyadic-BigInt reference (order/association invariant, error-free),
 *   - ladder rungs N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi)) ~ 488602].
 *
 * MEASURED (see LADDER below): the sign margin |exact sum| is BOUNDED ~0.635..0.651
 * (N-independent, the oscillatory sum does not grow), while the naive absolute error
 * grows ~1.07 in log-log (naiveAbsErr ~ 2.6e-18 * N^1.07 -- essentially the linear
 * n*u forward-error accumulation), from ~4.2e-15 at N=1000 to ~4.3e-12 at N~488602. The
 * KBN error is N-flat (log-log slope ~0.028, max ~4.4e-17), ~14 orders BELOW the margin.
 *
 * EXTRAPOLATION (the "location"): fitting log(naiveAbsErr) vs log(N) by OLS on the four
 * rungs and solving naiveAbsErr(N) = marginRep (the conservative min ladder margin), the
 * naive error first reaches the distance-to-zero at N_cross ~ 1.8e16, i.e. log10 ~ 16.3 --
 * about 10.6 DECADES beyond the full T_PT retained-term count N ~ 488602. The compensated
 * schemes' N-flat error (KBN slope ~0.03, ~zero) never crosses the margin at any reachable
 * N: that ~10.6-decade gap for naive, and its total absence for compensation, is the
 * headroom compensation preserves that naive summation loses.
 *
 * MEASUREMENT + EXTRAPOLATION ONLY. The crossing N is a log-log extrapolation of a
 * conditioning-driven trend on ONE fixed representative (clustered, same-sign) family; it
 * is NOT a certified bound. Establishes NO positivity theorem; certifies no W1 bound;
 * evaluates no true H_0; instantiates no interval; verifies no inequality; changes no
 * bound; the C_mb GUE-conditional constant (imp-486) is untouched; the W1 A + B - C
 * certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); no
 * RH verdict, NO QED. No refereed bound is changed. The oscillatory family is
 * a representative proxy, NOT the actual mollified H_t sum -- "sign margin" means the
 * distance to zero of the compensated sum relative to its own exact reference, nothing
 * stronger.
 *
 * @see imp-36094-kbn-kahan-naive-error-ladder-viz-data (naive grows / compensated N-flat)
 * @see imp-36075-kbn-positivity-sign-margin (sign margin = distance to zero, KBN preserves it)
 * @see imp-36023-kbn-combined-worst-ladder (underlying error-magnitude measurement)
 * @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (naive n*u forward error)
 */

// -- Anchor + operative constants (import-light; matching imp-36075) ----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35973 / imp-36023.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) ----------
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

function fixedToDouble(num, extraBits) {
  const abs = num < 0n ? -num : num;
  const shift = BigInt(extraBits);
  const val = Number(abs << shift) / 2 ** extraBits / 2 ** 96;
  return num < 0n ? -val : val;
}

// -- Summation schemes on the clustered worst order ---------------------------------------
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s; // uncompensated left-to-right
}

function sumKBN(terms) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
    else c += (x - t) + s;
    s = t;
  }
  return s + c;
}

// -- Measure sign margin + naive/KBN absolute error at one N ------------------------------
function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }

  // Exact full-sum reference (order/association invariant).
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueSum = fixedToDouble(trueNum, 40);
  const signMargin = Math.abs(trueSum); // distance of the delivered quantity to zero
  const kappa = sumAbs / signMargin;

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives, then positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  const naive = sumNaive(clustered);
  const naiveAbsErr = Math.abs(fixedToDouble(doubleToFixedBigInt(naive) - trueNum, 80));
  const kbn = sumKBN(clustered);
  const kbnAbsErr = Math.abs(fixedToDouble(doubleToFixedBigInt(kbn) - trueNum, 80));

  return {
    N,
    kappa,
    signMargin,
    naiveAbsErr,
    naiveRelErr: naiveAbsErr / signMargin,
    naiveSignMargin: naiveAbsErr > 0 ? signMargin / naiveAbsErr : Infinity, // error-widths from zero
    kbnAbsErr,
    kbnSignMargin: kbnAbsErr > 0 ? signMargin / kbnAbsErr : Infinity,
  };
}

// -- The imp-35812 N ladder ---------------------------------------------------------------
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Log-log OLS fit helper (y = a + p*x) -------------------------------------------------
function olsLogLog(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

const LOG_N = LADDER.map((r) => Math.log(r.N));
const NAIVE_FIT = olsLogLog(LOG_N, LADDER.map((r) => Math.log(r.naiveAbsErr)));
const KBN_FIT = olsLogLog(LOG_N, LADDER.map((r) => Math.log(r.kbnAbsErr)));

// Conservative (earliest-crossing) representative sign margin: the smallest ladder margin.
const MARGIN_REP = Math.min(...LADDER.map((r) => r.signMargin));

// Locate the naive crossing: N at which naiveAbsErr(N) = MARGIN_REP (relative error ~ 1,
// sign no longer guaranteed). Solve log(MARGIN_REP) = intercept + slope*log(N).
const NAIVE_CROSS_LOG_N = (Math.log(MARGIN_REP) - NAIVE_FIT.intercept) / NAIVE_FIT.slope;
const NAIVE_CROSS_N = Math.exp(NAIVE_CROSS_LOG_N);
const NAIVE_CROSS_LOG10_N = NAIVE_CROSS_LOG_N / Math.LN10;
const HEADROOM_DECADES_PAST_TPT = NAIVE_CROSS_LOG10_N - Math.log10(N_AT_TPT);

// The compensated scheme is N-flat: its log-log slope is ~0, so it never reaches the margin.
const KBN_IS_N_FLAT = Math.abs(KBN_FIT.slope) < 0.2;
const KBN_MAX_ABS_ERR = Math.max(...LADDER.map((r) => r.kbnAbsErr));
const KBN_MARGIN_DECADES_BELOW = Math.log10(MARGIN_REP / KBN_MAX_ABS_ERR);

export const IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING = {
  id: 'imp-36117',
  proofSection: 'S-frontier',
  question:
    'At what N does the imp-36094 NAIVE (uncompensated) left-to-right W1 summation error FIRST ' +
    'exceed the H_t positivity/sign margin (the distance to zero |exact sum|) at the imp-35973 ' +
    'combined worst-case config, and how much headroom do the compensated (Kahan/KBN) schemes ' +
    'preserve that naive summation loses? Measurement + log-log extrapolation only; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k), k = 1..N (same fixed family as imp-36075)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    combinedWorstOrder:
      'clustered same-sign runs (all negatives, then all positives) -- the imp-35852 worst ORDER',
    note: 'representative proxy, NOT the actual mollified H_t sum; sign margin = distance to zero of the compensated sum vs its own exact reference',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
  },
  unitRoundoff: U_ROUNDOFF,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  signMargin: {
    representative: MARGIN_REP,
    bounded:
      'the sign margin |exact sum| stays ~0.635..0.651 across the ladder (N-independent, O(1)) -- ' +
      'the oscillatory sum does not grow, so the target the naive error must reach is essentially fixed',
    min: MARGIN_REP,
    max: Math.max(...LADDER.map((r) => r.signMargin)),
  },
  naiveFit: {
    slopeLogLog: NAIVE_FIT.slope, // ~1.07: near-linear n*u forward-error accumulation
    interceptLogLog: NAIVE_FIT.intercept,
    model: 'naiveAbsErr(N) ~ exp(intercept) * N^slope (log-log OLS on the four ladder rungs)',
  },
  naiveCrossing: {
    crossingN: NAIVE_CROSS_N, // ~1.8e16
    crossingLog10N: NAIVE_CROSS_LOG10_N, // ~16.3
    headroomDecadesPastTPT: HEADROOM_DECADES_PAST_TPT, // ~10.6 decades beyond N~488602
    meaning:
      'N at which the naive absolute error first reaches the distance-to-zero (relative error ~ 1, ' +
      'sign of the delivered value no longer guaranteed); a log-log extrapolation, NOT a certified bound',
  },
  compensatedHeadroom: {
    kbnSlopeLogLog: KBN_FIT.slope, // ~0.03: N-flat
    kbnIsNFlat: KBN_IS_N_FLAT,
    kbnMaxAbsErr: KBN_MAX_ABS_ERR, // ~4.4e-17
    kbnDecadesBelowMargin: KBN_MARGIN_DECADES_BELOW, // ~14 decades below the margin
    reading:
      'the KBN error is N-flat (log-log slope ~0.03, ~zero), staying ~14 orders below the sign margin ' +
      'at every rung, so it never reaches the margin at any reachable N -- the compensated schemes ' +
      'preserve the entire ~10.6-decade-plus headroom that the naive scheme loses by N ~ 1.8e16',
  },
  conclusion: {
    naiveLosesMarginFarBeyondReach:
      'the naive left-to-right sum would first lose the sign margin only at an extrapolated ' +
      'N ~ 1.8e16 (log10 ~ 16.3), about 10.6 decades beyond the full T_PT retained-term count ' +
      'N ~ 488602 -- so even the conditioning-sensitive naive scheme is safe across all reachable N',
    compensationPreservesUnbounded:
      'compensation (classic Kahan / KBN) removes the conditioning-driven growth entirely: the ' +
      'compensated error is N-flat ~14 orders below the margin and never crosses it, so the sign ' +
      'margin is preserved with no reachable-N failure at all -- that is the headroom naive loses',
    precisionNotBinding:
      'under either compensated scheme precision is NOT the binding constraint on positivity anywhere ' +
      'on or far beyond the ladder; the obstruction stays the ENGINEERING of the certified length-N ' +
      'interval sum (W1 A + B - C stays GREENFIELD/MECHANICAL)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT + LOG-LOG EXTRAPOLATION (frontier-direction, NOT a certified bound). ' +
    'On the imp-35973 combined worst-case config (imp-35852 clustered same-sign ORDER) against a ' +
    'per-N exact BigInt reference at the imp-35812 ladder N = [1000, 10000, 100000, 488602], the ' +
    'sign margin (distance to zero |exact sum|) is BOUNDED ~0.635..0.651 (N-independent) while the ' +
    'NAIVE left-to-right absolute error grows ~N^1.07 (near-linear n*u accumulation) from ~4.2e-15 ' +
    'to ~4.3e-12. Fitting log(naiveAbsErr) vs log(N) and solving naiveAbsErr(N) = the (conservative ' +
    'minimum) sign margin, the naive error would FIRST exceed the margin -- i.e. reach relative ' +
    'error ~ 1 and no longer guarantee the sign -- only at an extrapolated N ~ 1.8e16 (log10 ~ 16.3), ' +
    'about 10.6 DECADES beyond the full T_PT retained-term count N ~ 488602. The compensated ' +
    '(classic Kahan / KBN) error is N-FLAT (log-log slope ~0.03, max ~4.4e-17, ~14 orders below the ' +
    'margin) and never reaches the margin at any reachable N: that ~10.6-decade gap for naive and ' +
    'its total absence for compensation is the headroom compensation preserves that naive summation ' +
    'loses. The crossing N is an extrapolation of a conditioning trend on ONE fixed representative ' +
    'family, NOT a certified bound. Establishes NO positivity theorem; certifies no W1 bound; ' +
    'evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound; the ' +
    'W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
    '(imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36094 (naive grows / compensated N-flat); imp-36075 (sign margin = distance to zero, KBN ' +
    'preserves it); imp-36023 (error-magnitude measurement); imp-35973 (single-endpoint combined ' +
    'stress); imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + N ladder); imp-35681 ' +
    'Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); Higham 2002.',
};

export const IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING_ASSERTIONS = [
  {
    id: 'imp36117-ladder-anchor',
    description: 'Four-rung ladder N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi))~488602]',
    holds: () =>
      LADDER.length === 4 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[3] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // The target the naive error must reach is bounded O(1) and N-independent.
    id: 'imp36117-sign-margin-bounded',
    description: 'sign margin |exact sum| stays O(1) (0.5..1) at every rung -- the target does not grow',
    holds: () => LADDER.every((r) => r.signMargin > 0.5 && r.signMargin < 1),
  },
  {
    // Naive error grows near-linearly with N (conditioning-driven forward-error accumulation).
    id: 'imp36117-naive-grows-near-linear',
    description: 'naive absolute error grows monotonically with N at log-log slope ~1 (> 0.9)',
    holds: () =>
      NAIVE_FIT.slope > 0.9 &&
      LADDER[3].naiveAbsErr > 100 * LADDER[0].naiveAbsErr &&
      LADDER.every((r, i) => i === 0 || r.naiveAbsErr >= LADDER[i - 1].naiveAbsErr),
  },
  {
    // The located crossing is finite and far beyond any reachable N.
    id: 'imp36117-naive-crossing-far-beyond-tpt',
    description: 'naive sign-margin crossing N is finite and >= 5 decades beyond N~488602',
    holds: () =>
      Number.isFinite(NAIVE_CROSS_N) &&
      NAIVE_CROSS_LOG10_N > 12 &&
      NAIVE_CROSS_LOG10_N < 22 &&
      HEADROOM_DECADES_PAST_TPT > 5,
  },
  {
    // Compensated error is N-flat and never approaches the margin -- the preserved headroom.
    id: 'imp36117-compensated-n-flat-below-margin',
    description: 'KBN error is N-flat (|slope|<0.2), below unit roundoff, and many decades below the margin',
    holds: () =>
      KBN_IS_N_FLAT === true &&
      KBN_MAX_ABS_ERR < U_ROUNDOFF &&
      KBN_MARGIN_DECADES_BELOW > 10,
  },
  {
    id: 'imp36117-honesty-gate',
    description: 'Measurement+extrapolation only; no bound change; GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /never crosses it/.test(
        IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING.conclusion.compensationPreservesUnbounded,
      ) &&
      /GREENFIELD/.test(IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING.verdict) &&
      /NOT a certified bound/.test(IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING.verdict) &&
      /NO QED/.test(IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING.verdict),
  },
];

for (const a of IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36117-naive-error-vs-sign-margin-crossing assertion failed: ${a.id}`);
  }
}

export default IMP36117_NAIVE_ERROR_VS_SIGN_MARGIN_CROSSING;
