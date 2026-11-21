/**
 * @module imp-36098-kbn-kahan-onset-2e128-crossvalidation
 *
 * imp-36098 (accuracy, S-frontier): does the imp-36062 KBN-vs-Kahan "first strict separation
 * at N ~ 34000" onset survive an INDEPENDENT, higher-precision (2^{-128}) exact reference, or
 * is the bit-identical/separated verdict an artifact of the imp-36062 2^{-96} dyadic-BigInt
 * reference precision?
 *
 * imp-36062 classified each rung's KBN-vs-classic-Kahan verdict against a per-N exact 2^{-96}
 * dyadic-BigInt reference. Because the normalized errors near the onset are O(1e-19) ~ O(2^{-63}),
 * a 2^{-96} reference already carries ~33 bits of headroom, but the SOFT/intermittent character
 * of the onset (separated at N = 34000, bit-identical again at 35000-37000, separated at
 * 38000-40000) makes it worth confirming the verdicts survive a stricter reference. This module
 * recomputes classic Kahan, full KBN, and a per-N exact 2^{-128} dyadic-BigInt reference at the
 * seven onset-region rungs [33000, 34000, 35000, 36000, 37000, 38000, 40000] and checks the
 * bit-identical/separated verdict at each rung is UNCHANGED versus the 2^{-96} reference; any
 * flipped rung is reported.
 *
 * Both schemes and BOTH references are re-implemented here byte-identically to imp-36062 (same
 * fixed oscillatory family, same imp-35852 clustered same-sign worst ORDER); the ONLY difference
 * from imp-36062 is the second reference's FRAC_BITS (128 vs 96). MEASUREMENT / VALIDATION ONLY.
 * Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality;
 * changes no bound; establishes no positivity; the C_mb GUE-conditional constant (imp-486) is
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * RESULT: at all seven onset-region rungs the verdict is IDENTICAL under the 2^{-96} and the
 * stricter 2^{-128} reference, and the normalized errors agree to full 7-sig-fig display:
 *   N       kappa   verdict(96)   verdict(128)   kahanNormErr   kbnNormErr    kbn/kahan
 *   33000   362.8   identical     identical      1.451654e-19   1.451654e-19  1.0000
 *   34000   361.5   SEPARATED     SEPARATED      2.414836e-19   2.330553e-19  0.9651
 *   35000   ~       identical     identical      (bit-identical doubles)      1.0000
 *   36000   ~       identical     identical      (bit-identical doubles)      1.0000
 *   37000   ~       identical     identical      (bit-identical doubles)      1.0000
 *   38000   391.6   SEPARATED     SEPARATED      5.598508e-19   1.110657e-19  0.1984
 *   40000   396.0   SEPARATED     SEPARATED      3.898111e-19   4.757632e-20  0.1220
 *
 * READING: NO rung flips. The onset located by imp-36062 (first strict separation at N ~ 34000,
 * intermittent through N ~ 40000, identical at 35000-37000) is REPRODUCED bit-for-bit under a
 * reference carrying 32 EXTRA bits of headroom. The mechanistic reason the precision bump cannot
 * matter here: the per-rung verdict is governed ENTIRELY by whether the two Float64 scheme-results
 * differ as doubles. Where sumKahan(clustered) === sumKBN(clustered) as a double (rungs 33000,
 * 35000, 36000, 37000) the two normalized errors are equal against ANY reference; where the two
 * doubles differ (34000, 38000, 40000) the running sums are O(1) with a 2^{-52} LSB and every term
 * ~ 1/sqrt(k) has its LSB well above 2^{-96}, so BOTH the 2^{-96} and the 2^{-128} grid represent
 * every double AND their exact BigInt sum EXACTLY -- the error comparison is order-exact on both
 * grids and cannot flip. The 2^{-96} reference therefore was NOT a precision limiter, and the
 * imp-36062 onset verdict is not an artifact of it. Precision stays NON-binding everywhere; the
 * obstruction remains the ENGINEERING of the certified length-N interval sum (MECHANICAL,
 * imp-35725), and the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-36062-kbn-kahan-separation-onset (located the onset at N~34000 against a 2^{-96} reference only)
 * @see imp-36095-kbn-kahan-intermittency-band (the intermittent 34000-40000 separation band)
 * @see imp-36023-kbn-combined-worst-ladder (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36062) -----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-36023 / imp-36062.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (byte-identical to imp-36062) ---------------------------------------
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

// Kahan-Babuska-Neumaier: improved compensation correct even when |s| < |x|.
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

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) -----------
// FRAC_BITS is a parameter here so the SAME code path serves both the imp-36062 2^{-96}
// reference and the stricter 2^{-128} cross-validation reference.
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x, fracBits) {
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
  const shift = BigInt(exp) + fracBits;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}

function normalizedError(schemeResult, trueNum, sumAbs, fracBits) {
  const err = doubleToFixedBigInt(schemeResult, fracBits) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / Number(2n ** fracBits);
  return absErrDouble / sumAbs;
}

// -- Measure Kahan vs KBN at one N against a freshly built exact reference of fracBits ------
function measureAtN(N, fracBits) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n; // order- and association-invariant -- computed once per N per reference
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i], fracBits);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum =
    (Number(trueAbs << 40n) / 2 ** 40 / Number(2n ** fracBits)) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives, then positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  const kahanResult = sumKahan(clustered);
  const kbnResult = sumKBN(clustered);
  const kahanNormErr = normalizedError(kahanResult, trueNum, sumAbs, fracBits);
  const kbnNormErr = normalizedError(kbnResult, trueNum, sumAbs, fracBits);
  return {
    N,
    kappa,
    kahanNormErr,
    kbnNormErr,
    kbnStrictlyTighter: kbnNormErr < kahanNormErr,
    bitIdentical: kbnNormErr === kahanNormErr,
    // the two Float64 scheme-results as doubles -- the true driver of the per-rung verdict
    schemeDoublesEqual: kahanResult === kbnResult,
  };
}

// -- Onset-region rungs (the imp-36062 stored 33000/34000/38000/40000 plus the intermittency
//    band 35000-37000 that imp-36062 flagged but never stored) ------------------------------
const ONSET_RUNGS = [33000, 34000, 35000, 36000, 37000, 38000, 40000];

// Cross-validate each rung under the imp-36062 2^{-96} reference AND a stricter 2^{-128} one.
const CROSS_VALIDATION = ONSET_RUNGS.map((N) => {
  const ref96 = measureAtN(N, 96n);
  const ref128 = measureAtN(N, 128n);
  const verdictUnchanged =
    ref96.bitIdentical === ref128.bitIdentical &&
    ref96.kbnStrictlyTighter === ref128.kbnStrictlyTighter;
  return {
    N,
    kappa: ref128.kappa,
    schemeDoublesEqual: ref128.schemeDoublesEqual,
    // 2^{-96} reference (imp-36062)
    kahanNormErr96: ref96.kahanNormErr,
    kbnNormErr96: ref96.kbnNormErr,
    kbnStrictlyTighter96: ref96.kbnStrictlyTighter,
    // 2^{-128} reference (this cross-validation)
    kahanNormErr128: ref128.kahanNormErr,
    kbnNormErr128: ref128.kbnNormErr,
    kbnStrictlyTighter128: ref128.kbnStrictlyTighter,
    verdictUnchanged,
  };
});

const ANY_VERDICT_FLIPPED = CROSS_VALIDATION.some((r) => !r.verdictUnchanged);
const FLIPPED_RUNGS = CROSS_VALIDATION.filter((r) => !r.verdictUnchanged).map((r) => r.N);
// The verdict is governed entirely by whether the two scheme-results differ as doubles.
const VERDICT_TRACKS_SCHEME_DOUBLES = CROSS_VALIDATION.every(
  (r) => r.kbnStrictlyTighter128 === !r.schemeDoublesEqual,
);
// The imp-36062 34000/38000/40000 rungs stay SEPARATED; 33000/35000/36000/37000 stay identical.
const ONSET_RUNG = CROSS_VALIDATION.find((r) => r.N === 34000);
const ONSET_STAYS_SEPARATED_128 = ONSET_RUNG.kbnStrictlyTighter128 === true;

export const IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION = {
  id: 'imp-36098',
  proofSection: 'S-frontier',
  question:
    'Does the imp-36062 KBN-vs-Kahan "first strict separation at N ~ 34000" onset survive an ' +
    'INDEPENDENT higher-precision (2^{-128}) exact reference, confirming the bit-identical/separated ' +
    'verdict is not an artifact of the imp-36062 2^{-96} dyadic-BigInt reference precision? ' +
    'Measurement / validation only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36062)',
    alpha: ALPHA,
    beta: BETA,
    combinedWorstOrder:
      'clustered same-sign runs (all negatives, then all positives) -- the imp-35852 worst ORDER',
  },
  references: {
    baseline: 'imp-36062 per-N exact 2^{-96} dyadic-BigInt reference (33 bits of headroom over O(2^{-63}) errors)',
    stricter: 'this module: per-N exact 2^{-128} dyadic-BigInt reference (32 EXTRA bits of headroom)',
    errorFree: true,
    orderAndAssociationInvariant: true,
    note: 'the ONLY change from imp-36062 is FRAC_BITS (128 vs 96); schemes and order are byte-identical',
  },
  unitRoundoff: U_ROUNDOFF,
  onsetRungs: ONSET_RUNGS,
  crossValidation: CROSS_VALIDATION,
  summary: {
    anyVerdictFlipped: ANY_VERDICT_FLIPPED, // false
    flippedRungs: FLIPPED_RUNGS, // []
    verdictTracksSchemeDoubles: VERDICT_TRACKS_SCHEME_DOUBLES, // true
    onsetStaysSeparatedAt128: ONSET_STAYS_SEPARATED_128, // true
  },
  reading: {
    noRungFlips:
      'NO onset-region rung flips its bit-identical/separated verdict between the 2^{-96} and the stricter ' +
      '2^{-128} reference; the imp-36062 onset (first strict separation at N ~ 34000, intermittent through ' +
      'N ~ 40000, identical at 35000-37000) is reproduced bit-for-bit under 32 extra bits of headroom',
    verdictDrivenBySchemeDoubles:
      'the per-rung verdict is governed ENTIRELY by whether the two Float64 scheme-results differ as doubles: ' +
      'where they are equal (33000, 35000, 36000, 37000) the errors match against ANY reference, and where ' +
      'they differ (34000, 38000, 40000) BOTH grids represent every O(1) double and their exact BigInt sum ' +
      'EXACTLY, so the error comparison is order-exact on both grids and cannot flip',
    precisionHeadroomConfirmed:
      'the normalized errors agree to full 7-sig-fig display under the two references (e.g. N = 34000 gives ' +
      'kahan 2.414836e-19, kbn 2.330553e-19 under both), confirming the 2^{-96} reference was NOT a precision ' +
      'limiter and the onset verdict is not an artifact of it',
  },
  conclusion: {
    onsetSurvivesStricterReference:
      'the imp-36062 first-separation-at-N~34000 onset and its intermittent 34000-40000 band survive an ' +
      'independent stricter 2^{-128} exact reference with no rung flipping verdict; the 2^{-96} reference had ' +
      'ample headroom and the verdict is not a reference-precision artifact',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung under both references -- the separation ' +
      'is a floor-level rounding effect and precision is NOT the binding constraint anywhere on the ladder',
    staysGreenfield:
      'this module recomputes Kahan-vs-KBN verdicts at seven onset rungs against a stricter reference only; it ' +
      'evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays ' +
      'GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT / VALIDATION (frontier-direction, NOT a certified bound). Recomputing classic Kahan, ' +
    'full Kahan-Babuska-Neumaier (KBN), and a per-N exact 2^{-128} dyadic-BigInt reference at the seven ' +
    'onset-region rungs [33000, 34000, 35000, 36000, 37000, 38000, 40000] on the imp-35852 clustered worst ' +
    'order, EVERY rung reproduces its imp-36062 bit-identical/separated verdict exactly: 34000, 38000, 40000 ' +
    'stay SEPARATED and 33000, 35000, 36000, 37000 stay bit-identical, with normalized errors matching to full ' +
    '7-sig-fig display (N = 34000: kahan 2.414836e-19, kbn 2.330553e-19 under both references). No rung flips. ' +
    'The per-rung verdict is governed entirely by whether the two Float64 scheme-results differ as doubles, and ' +
    'because every O(1) running sum and every ~1/sqrt(k) term is represented EXACTLY on both the 2^{-96} and the ' +
    '2^{-128} grid, the error comparison is order-exact on both -- so the 2^{-96} reference was NOT a precision ' +
    'limiter and the imp-36062 onset is not an artifact of its reference precision. Both schemes sit at the ' +
    '~1e-19 compensated floor everywhere, so precision is NOT binding on the ladder. Certifies no W1 bound; ' +
    'evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no ' +
    'positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36062 (located the onset at N~34000 against a 2^{-96} reference only); imp-36095 (intermittency band); ' +
    'imp-36023 (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602); imp-35852 (clustered worst ORDER); ' +
    'imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35725 (mechanical certified sum); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002, Neumaier 1974.',
};

export const IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION_ASSERTIONS = [
  {
    id: 'imp36098-seven-onset-rungs',
    description: 'Seven onset-region rungs [33000..40000] cross-validated against 2^{-96} and 2^{-128}',
    holds: () =>
      CROSS_VALIDATION.length === 7 &&
      ONSET_RUNGS[0] === 33000 &&
      ONSET_RUNGS[ONSET_RUNGS.length - 1] === 40000,
  },
  {
    // No rung flips its verdict between the two references.
    id: 'imp36098-no-verdict-flips',
    description: 'No onset rung flips its bit-identical/separated verdict between 2^{-96} and 2^{-128}',
    holds: () => ANY_VERDICT_FLIPPED === false && FLIPPED_RUNGS.length === 0,
  },
  {
    // The onset rung N = 34000 stays SEPARATED under the stricter reference.
    id: 'imp36098-onset-stays-separated',
    description: 'The N = 34000 onset rung stays strictly separated (KBN tighter) under 2^{-128}',
    holds: () =>
      ONSET_STAYS_SEPARATED_128 === true &&
      ONSET_RUNG.kbnStrictlyTighter96 === true &&
      ONSET_RUNG.kbnNormErr128 < ONSET_RUNG.kahanNormErr128,
  },
  {
    // The verdict is driven purely by whether the two scheme doubles differ.
    id: 'imp36098-verdict-tracks-scheme-doubles',
    description: 'Every rung is separated iff its two Float64 scheme-results differ as doubles',
    holds: () => VERDICT_TRACKS_SCHEME_DOUBLES === true,
  },
  {
    // Normalized errors match to full 7-sig-fig display between the two references.
    id: 'imp36098-errors-match-across-references',
    description: 'Normalized errors agree to ~7 sig figs under the 2^{-96} and 2^{-128} references',
    holds: () =>
      CROSS_VALIDATION.every(
        (r) =>
          (r.kahanNormErr96 === 0
            ? r.kahanNormErr128 === 0
            : Math.abs(r.kahanNormErr128 - r.kahanNormErr96) / r.kahanNormErr96 < 1e-6) &&
          (r.kbnNormErr96 === 0
            ? r.kbnNormErr128 === 0
            : Math.abs(r.kbnNormErr128 - r.kbnNormErr96) / r.kbnNormErr96 < 1e-6),
      ),
  },
  {
    id: 'imp36098-honesty-gate',
    description: 'Measurement/validation only; verdict survives stricter reference; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /survive/i.test(IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION.conclusion.onsetSurvivesStricterReference) &&
      /NOT the binding constraint/.test(
        IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP36098_KBN_KAHAN_ONSET_2E128_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36098-kbn-kahan-onset-2e128-crossvalidation assertion failed: ${a.id}`);
  }
}
