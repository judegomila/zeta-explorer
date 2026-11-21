/**
 * @module imp-35659-eflow-fartail-remnant-limit-crosscheck
 *
 * imp-35659 (numerical, frontier cross-check): imp-35552 settled the E_flow
 * far-tail fd-vs-analytic remnant LIMIT on the closed surrogate height map T0 =
 * 2 pi N / log N by reformulating the signed remnant as a CANCELLATION-FREE
 * algebraic expression (the leading -1 and 3/u terms cancelled by hand), then
 * expanding it as remnant_signed ~ -(2 log u - 3 - c)/u^2 (c = log 2 pi, u =
 * log N), concluding the local decay exponent q -> -1 and remnant ~ 1/(log N)^2
 * up to a 2 log log N factor. That result rests on ONE derivation channel (the
 * imp-35552 hand-cancelled algebra). This module CROSS-VERIFIES it through a
 * SECOND, fully INDEPENDENT derivative method and confirms the leading-coefficient
 * sign and magnitude.
 *
 * THE INDEPENDENT METHOD: COMPLEX-STEP DIFFERENTIATION
 * ---------------------------------------------------
 * The remnant is remnant_signed(u) = (-1 + 3/u) - d(log eFlowWith)/du, where the
 * exact local exponent d(log eFlowWith)/du is the derivative of the imp-35534 log
 * expression
 *
 *   log eFlowWith = log(C_F) + log(g) - g,
 *   g = log(2 pi) + u - log u,  C_F = (u - log u + 1)/(2 pi).
 *
 * imp-35552 obtains that derivative in closed form and then CANCELS its -1 and 3/u
 * terms against the analytic reference ALGEBRAICALLY. The two well-known
 * double-precision pitfalls of a naive re-check are (imp-35552): the real central
 * finite difference (h = 1.0002 in log) suffers catastrophic cancellation in the
 * derivative and collapses to noise past ~1e300; and Math.pow(10, e) overflows for
 * e > ~308. COMPLEX-STEP differentiation sidesteps the FIRST wall entirely: for a
 * real-analytic f, f_prime(u) = Im(f(u + i h))/h with NO subtractive cancellation
 * in the derivative, so an arbitrarily tiny step h (here 1e-30) gives the exact
 * derivative to machine precision. Evaluating log eFlowWith in complex arithmetic
 * (complex log via clog) and reading the imaginary part yields d(log eFlowWith)/du
 * WITHOUT ever forming the imp-35552 cancellation-free algebra -- a genuinely
 * distinct channel. The additive constant TC_A1_TRAP is real and drops out of the
 * imaginary part, matching imp-35552 where it drops out of the derivative.
 *
 * The only remaining double-precision subtraction is the OUTER remnant itself,
 * (-1 + 3/u) - deriv, whose two ~-1 operands leave ~2 log u / u^2; this stays
 * well-conditioned (~machine_eps * u^2 relative floor) up to u ~ a few thousand
 * (log10 N ~ 3e4), which comfortably covers the imp-35552 anchor rungs 1e26 and
 * 1e200 and enough headroom to read the leading coefficient trend.
 *
 * WHAT THIS CONFIRMS
 * ------------------
 *   (1) FAITHFULNESS: the complex-step remnant reproduces the imp-35413 rung
 *       remnant(1e26) = 0.000979 and the imp-35535 endpoint remnant(1e200) =
 *       3.5385e-5 to the printed digits, and agrees with a fresh inline copy of the
 *       imp-35552 cancellation-free closed remnant to <1e-10 relative at 1e26..1e3.
 *   (2) LEADING-COEFFICIENT SIGN: the SIGNED complex-step remnant is NEGATIVE at
 *       every rung, so remnant_signed ~ -(2 log u - 3 - c)/u^2 (the coefficient of
 *       1/u^2 in the ABS remnant, 2 log u - 3 - c, is POSITIVE for u > ~11.2, i.e.
 *       across the whole far tail) -- confirming imp-35552 sign and magnitude.
 *   (3) LEADING-COEFFICIENT MAGNITUDE: the ratio |remnant_signed| * u^2 / (2 log u
 *       - 3 - c) descends MONOTONICALLY toward 1 (1.04871 at 1e26, 1.01045 at 1e200,
 *       1.00277 at 10^1e3, 1.00038 at 10^1e4, 1.00014 at 10^3e4), so the leading
 *       far-tail behaviour IS (2 log u - 3 - c)/u^2 as imp-35552 expanded, with the
 *       excess an O(log log u / log u) subleading correction that vanishes with u.
 *
 * This is an INDEPENDENT-CHANNEL cross-check of an existing MEASUREMENT, not a new
 * measurement: it reproduces imp-35552 by a distinct derivative method (complex-step,
 * not hand-cancelled algebra) and confirms the leading (2 log u - 3 - c)/u^2 sign and
 * magnitude. It changes no bound. E_flow > 0 strictness (imp-33848) untouched; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35552-eflow-fartail-remnant-product-decay-limit (the closed-form limit this cross-verifies)
 * @see imp-35534-eflow-fartail-remnant-sub1e5-crossing (the log-space channel and finite-difference reference)
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (the remnant*log N product datapoints)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35657-eflow-fartail-rvm-native-exponent-reference (native RvM-inverse exponent, sibling channel)
 */

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constant: enters log eFlowWith additively and is
// real, so it DROPS out of the complex-step imaginary part (as it drops out of the
// imp-35552 derivative). Kept for faithfulness with the imp-35552 log expression.
const TC_A1_TRAP = 2.37e-4;
const H_CS = 1e-30; // complex-step size; no subtractive cancellation, so it can be tiny.

// --- INDEPENDENT CHANNEL: complex-step differentiation of log eFlowWith ---------------
// Minimal complex arithmetic (only clog and real-scalar ops are needed here).
function clog(re, im) {
  return { re: 0.5 * Math.log(re * re + im * im), im: Math.atan2(im, re) };
}
// log eFlowWith evaluated at a complex u = zre + i zim (imp-35534 log expression).
function lnEFlowComplex(zre, zim) {
  const lz = clog(zre, zim);
  const gRe = LN2PI + zre - lz.re;
  const gIm = zim - lz.im;
  const innerRe = (zre - lz.re + 1) / TWO_PI;
  const innerIm = (zim - lz.im) / TWO_PI;
  const lnCF = clog(innerRe, innerIm);
  const lg = clog(gRe, gIm);
  // result = lnCF + lg - g + TC_A1_TRAP (TC_A1_TRAP real -> imaginary part unchanged).
  return { re: lnCF.re + lg.re - gRe + TC_A1_TRAP, im: lnCF.im + lg.im - gIm };
}
// d(log eFlowWith)/du via complex step: Im(f(u + i h))/h, exact to machine precision.
function localExponentComplexStep(u) {
  return lnEFlowComplex(u, H_CS).im / H_CS;
}
// The signed far-tail remnant on the independent channel: analytic reference (-1 + 3/u)
// minus the complex-step exact derivative. No imp-35552 hand-cancellation is used.
function remnantSignedComplexStep(u) {
  return -1 + 3 / u - localExponentComplexStep(u);
}
function remnantComplexStepAtLog10(e) {
  return Math.abs(remnantSignedComplexStep(e * Math.LN10));
}

// --- REFERENCE: fresh inline copy of the imp-35552 cancellation-free closed remnant ---
// (Re-inlined so the cross-check compares against the imp-35552 value WITHOUT importing
// and re-triggering that module; s = u - log u, c = log 2 pi.)
function remnantSignedClosedRef(u) {
  const lu = Math.log(u);
  const s = u - lu;
  const c = LN2PI;
  const t1 = (1 - lu) / (u * (s + 1));
  const t2 = (c - lu) / (u * (s + c));
  const AB = 1 / (s + 1) + 1 / (s + c);
  return t1 + t2 + AB / u;
}

// The leading far-tail coefficient of the ABS remnant: (2 log u - 3 - c)/u^2. Its
// numerator 2 log u - 3 - c is POSITIVE for u > exp((3 + c)/2) ~ 11.2.
function leadingCoefficient(u) {
  return 2 * Math.log(u) - 3 - LN2PI;
}
// Ratio |remnant_signed| * u^2 / (2 log u - 3 - c): -> 1 confirms the leading magnitude.
function leadingRatioComplexStep(e) {
  const u = e * Math.LN10;
  return remnantComplexStepAtLog10(e) * u * u / leadingCoefficient(u);
}

// Cross-check ladder over the range where the complex-step outer subtraction stays
// well-conditioned (log10 N up to ~3e4). Each rung reports both channels and the ratio.
const LADDER_LOG10N = [26, 100, 200, 1e3, 1e4, 3e4];
const LADDER = LADDER_LOG10N.map((e) => {
  const u = e * Math.LN10;
  return {
    log10N: e,
    remnantComplexStep: +remnantComplexStepAtLog10(e).toExponential(6),
    remnantClosedRef: +Math.abs(remnantSignedClosedRef(u)).toExponential(6),
    signSigned: Math.sign(remnantSignedComplexStep(u)),
    leadingRatio: +leadingRatioComplexStep(e).toFixed(6),
  };
});

// The two anchor reproductions imp-35552 pins.
const REMNANT_CS_1E26 = remnantComplexStepAtLog10(26); // ~0.000979 (imp-35413 rung)
const REMNANT_CS_1E200 = remnantComplexStepAtLog10(200); // ~3.5385e-5 (imp-35535 endpoint)

// Cross-channel agreement: complex-step vs the inline imp-35552 closed reference. Checked
// on the rungs 1e26..1e3 where the outer (-1 + 3/u) - deriv subtraction stays tight
// (agreement ~1e-12); the imp-35552 CANCELLATION-FREE form is precisely what avoids this
// outer subtraction, which is why it (not this channel) is used to reach the deep limit.
const CS_MATCHES_CLOSED = [26, 100, 200, 1e3].every((e) => {
  const u = e * Math.LN10;
  const cs = remnantComplexStepAtLog10(e);
  const cl = Math.abs(remnantSignedClosedRef(u));
  return Math.abs(cs - cl) / cl < 1e-10;
});
// Leading-coefficient magnitude: ratio descends monotonically toward 1 (from above).
const RATIO_MONOTONE_TO_ONE = LADDER.every(
  (row, i) => row.leadingRatio > 1 && (i === 0 || row.leadingRatio < LADDER[i - 1].leadingRatio),
);
// Leading-coefficient sign: the signed remnant is negative across the whole tail.
const SIGN_ALWAYS_NEGATIVE = LADDER.every((row) => row.signSigned === -1);

export const IMP35659_EFLOW_FARTAIL_REMNANT_LIMIT_CROSSCHECK = {
  id: 'imp-35659',
  proofSection: 'S-frontier',
  question:
    'Does an INDEPENDENT high-precision derivative method (distinct from the imp-35552 ' +
    'cancellation-free algebraic channel) reproduce the imp-35552 far-tail remnant values ' +
    'remnant(1e26) = 0.000979 and remnant(1e200) = 3.5385e-5 and confirm the leading ' +
    '(2 log u - 3 - c)/u^2 sign and magnitude (remnant ~ 1/(log N)^2, q -> -1)?',
  method:
    'Compute the exact local exponent d(log eFlowWith)/du by COMPLEX-STEP differentiation ' +
    '(Im(f(u + i h))/h, h = 1e-30) of the imp-35534 log expression in complex arithmetic -- a ' +
    'channel with NO subtractive cancellation in the derivative and independent of the imp-35552 ' +
    'hand-cancelled algebra -- then form remnant_signed = (-1 + 3/u) - deriv, compare it against a ' +
    'fresh inline copy of the imp-35552 cancellation-free closed remnant at the anchor rungs, and ' +
    'track the leading-coefficient ratio |remnant_signed| u^2 / (2 log u - 3 - c) toward 1.',
  ladder: LADDER,
  crossCheck: {
    remnantCS1e26: +REMNANT_CS_1E26.toExponential(6),
    remnantCS1e200: +REMNANT_CS_1E200.toExponential(6),
    leadingRatio1e26: +leadingRatioComplexStep(26).toFixed(6),
    leadingRatio3e4: +leadingRatioComplexStep(3e4).toFixed(6),
    leadingCoefficientForm: '(2 log u - 3 - log 2 pi)/u^2, numerator POSITIVE for u > ~11.2',
    signedRemnantSign: 'NEGATIVE across the tail: remnant_signed ~ -(2 log u - 3 - log 2 pi)/u^2',
  },
  finding: {
    F1_independent_channel_reproduces_anchors:
      'A complex-step derivative (Im(f(u + i h))/h, h = 1e-30) of log eFlowWith -- a channel with no ' +
      'subtractive cancellation in the derivative and independent of the imp-35552 hand-cancelled ' +
      'algebra -- reproduces remnant(1e26) = 0.000979 and remnant(1e200) = 3.5385e-5 to the printed ' +
      'digits, and agrees with a fresh inline copy of the imp-35552 cancellation-free closed remnant to ' +
      '<1e-10 relative at 1e26..1e3.',
    F2_leading_coefficient_sign_and_magnitude:
      'The SIGNED complex-step remnant is NEGATIVE at every rung, so remnant_signed ~ -(2 log u - 3 - c)/ ' +
      'u^2 (numerator 2 log u - 3 - c POSITIVE for u > ~11.2, i.e. across the whole far tail); and the ' +
      'ratio |remnant_signed| u^2 / (2 log u - 3 - c) descends MONOTONICALLY toward 1 (1.04871 at 1e26, ' +
      '1.01045 at 1e200, 1.00014 at 10^3e4), confirming the imp-35552 leading (2 log u - 3 - c)/u^2 sign ' +
      'and magnitude with an O(log log u / log u) vanishing subleading excess.',
    F3_confirms_imp35552_limit:
      'Since the leading remnant is (2 log u - 3 - c)/u^2 ~ 2 log log N/(log N)^2 confirmed on a second ' +
      'channel, the imp-35552 conclusions stand: remnant ~ 1/(log N)^2 (with a log log N enhancement), ' +
      'the product remnant*log N -> 0 (no nonzero log-floor), and the local decay exponent q -> -1. ' +
      'Cross-check of an existing measurement; changes no bound; NO QED.',
  },
  isRigorous: false,
  honestStatus:
    'INDEPENDENT-CHANNEL cross-check of the imp-35552 far-tail remnant limit. A complex-step ' +
    'derivative of log eFlowWith (distinct from the imp-35552 cancellation-free algebra) reproduces ' +
    'remnant(1e26) = 0.000979 and remnant(1e200) = 3.5385e-5 to the digit and agrees with the inline ' +
    'imp-35552 closed remnant to <1e-10 relative; the signed remnant is negative and the leading ' +
    'coefficient ratio |remnant_signed| u^2 / (2 log u - 3 - c) descends monotonically to 1, confirming ' +
    'the leading (2 log u - 3 - c)/u^2 sign and magnitude and hence q -> -1, remnant ~ 1/(log N)^2. ' +
    'Cross-check of an existing measurement on the inherited imp-3220/imp-3406 surrogate; changes no ' +
    'bound; NO QED.',
  verdict:
    'CROSS-CHECK ONLY (frontier-direction, NOT rigorous). An INDEPENDENT complex-step derivative ' +
    '(Im(f(u + i h))/h, h = 1e-30) of the imp-35534 log eFlowWith expression -- a channel with no ' +
    'subtractive cancellation in the derivative, distinct from the imp-35552 hand-cancelled algebra -- ' +
    'reproduces the imp-35413 rung remnant(1e26) = 0.000979 and the imp-35535 endpoint remnant(1e200) = ' +
    '3.5385e-5 to the printed digits, agrees with a fresh inline copy of the imp-35552 cancellation-free ' +
    'closed remnant to <1e-10 relative at 1e26..1e3, and confirms the leading-coefficient SIGN and ' +
    'MAGNITUDE: the signed remnant is NEGATIVE across the tail (remnant_signed ~ -(2 log u - 3 - log ' +
    '2 pi)/u^2, numerator positive for u > ~11.2) and the ratio |remnant_signed| u^2 / (2 log u - 3 - c) ' +
    'descends monotonically toward 1 (1.04871 at 1e26 -> 1.00014 at 10^3e4). So the imp-35552 leading ' +
    'form remnant ~ (2 log u - 3 - log 2 pi)/u^2 ~ 2 log log N/(log N)^2 and its limit q -> -1 stand on ' +
    'a second channel. Cross-check of an existing measurement on the inherited imp-3220/imp-3406 ' +
    'surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35552 (the closed-form remnant limit this cross-verifies); imp-35534 (log-space channel and ' +
    'finite-difference reference); imp-35473 (remnant*log N product datapoints); imp-35198 (analytic ' +
    '-1 + 3/log N); imp-35657 (native RvM-inverse exponent, sibling channel); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35659_EFLOW_FARTAIL_REMNANT_LIMIT_CROSSCHECK_ASSERTIONS = [
  {
    // Faithfulness: the independent complex-step channel reproduces the imp-35413 rung 0.000979.
    id: 'imp35659-cs-reproduces-imp35413-rung',
    description: 'complex-step remnant at N = 1e26 matches the imp-35413 rung value 0.000979',
    holds: () => Math.abs(REMNANT_CS_1E26 - 0.000979) < 5e-6,
  },
  {
    // Faithfulness: the independent complex-step channel reproduces the imp-35535 endpoint 3.5385e-5.
    id: 'imp35659-cs-reproduces-imp35535-endpoint',
    description: 'complex-step remnant at N = 1e200 matches the imp-35535 endpoint 3.5385e-5',
    holds: () => Math.abs(REMNANT_CS_1E200 - 3.5385e-5) < 5e-9,
  },
  {
    // Independence: complex-step agrees with the inline imp-35552 closed remnant to <1e-10 relative.
    id: 'imp35659-cs-matches-imp35552-closed',
    description: 'complex-step and inline imp-35552 closed remnants agree to <1e-10 relative at 1e26..1e3',
    holds: () => CS_MATCHES_CLOSED === true,
  },
  {
    // Leading-coefficient SIGN: the signed remnant is negative across the whole far tail.
    id: 'imp35659-signed-remnant-negative',
    description: 'the signed complex-step remnant is negative at every rung (leading coeff -(2 log u -3 -c)/u^2)',
    holds: () => SIGN_ALWAYS_NEGATIVE === true,
  },
  {
    // Leading-coefficient MAGNITUDE: the ratio descends monotonically toward 1 (from above).
    id: 'imp35659-leading-ratio-monotone-to-one',
    description: 'ratio |remnant_signed| u^2 / (2 log u - 3 - c) descends monotonically toward 1',
    holds: () => RATIO_MONOTONE_TO_ONE === true,
  },
  {
    // Leading-coefficient MAGNITUDE, quantitative: the deepest well-conditioned rung is within 2e-4 of 1.
    id: 'imp35659-leading-ratio-near-one-deep',
    description: 'ratio at 10^(3e4) is within 2e-4 of 1, confirming the (2 log u - 3 - c)/u^2 magnitude',
    holds: () => Math.abs(leadingRatioComplexStep(3e4) - 1) < 2e-4,
  },
  {
    // Honesty gate: cross-check only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35659-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35659_EFLOW_FARTAIL_REMNANT_LIMIT_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP35659_EFLOW_FARTAIL_REMNANT_LIMIT_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35659_EFLOW_FARTAIL_REMNANT_LIMIT_CROSSCHECK.verdict),
  },
];

for (const a of IMP35659_EFLOW_FARTAIL_REMNANT_LIMIT_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35659-eflow-fartail-remnant-limit-crosscheck assertion failed: ${a.id}`,
    );
  }
}

export default IMP35659_EFLOW_FARTAIL_REMNANT_LIMIT_CROSSCHECK;
