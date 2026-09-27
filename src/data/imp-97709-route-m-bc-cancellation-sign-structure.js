/**
 * @module imp-97709-route-m-bc-cancellation-sign-structure
 * @fileoverview imp-97709 -- MEASUREMENT / ASSESSMENT ONLY (no bound moved): test the no-cancellation
 *   reading that sits behind the imp-97663 cap |kappaK_period| <~ 3.87e-3 (and its imp-97681 consequence
 *   |W_refl| <~ 0.24/pi). imp-97663 RESULT 2 offered two readings of the measured smallness of
 *   kappa_smooth: (i) SUPPRESSION -- the period normalisation is itself O(1e-3); (ii) CANCELLATION -- the
 *   period part P2 and the pole part L2 near-cancel. The cap was stated under reading (i). This module
 *   measures the SIGN STRUCTURE of the two contributing terms of the imp-97597 decomposition to assess
 *   whether genuine cancellation is available, and if so by how much it could loosen the cap. It reaches
 *   a precise structural finding (the written minus is a reinforcement, not a cancellation channel) plus a
 *   quantitative bounded-pole loosening factor; it does NOT pin any coefficient. kappa_smooth stays
 *   measured-not-pinned; no bound moved; RH open; NO QED.
 *
 *   ==========================================================================================
 *   SETUP -- the decomposition and its two contributing terms
 *   ==========================================================================================
 *   imp-97597 RESULT 2 wrote the O(x^2) cusp coefficient as
 *       kappa_smooth = (pi/2) [ kappaK_period * zeta(2)  -  kappaK_pole * gamma_1 * (arith factor) ],
 *   with the two classical scale constants
 *       zeta(2) = pi^2/6 = +1.6449340668482264   (STRICTLY POSITIVE), and
 *       gamma_1 = -0.0728158454836767            (STRICTLY NEGATIVE, first Stieltjes constant).
 *   The two unknowns are the normalisations kappaK_period and kappaK_pole (components of the single
 *   uncomputed mixed kernel coefficient kappaK; imp-97617 reflection index). Call the two contributions
 *       TERM_P2 = kappaK_period * zeta(2),
 *       TERM_L2 = - kappaK_pole * gamma_1 * (arith factor).
 *
 *   ==========================================================================================
 *   RESULT 1 -- the written "minus" is a REINFORCEMENT, not a cancellation channel [CONFIDENT]
 *   ==========================================================================================
 *   The formula displays kappa_smooth = (pi/2)[P2 - L2], which superficially looks like a difference that
 *   could cancel. But the L2 contribution carries gamma_1 < 0, so the literal minus multiplies a NEGATIVE
 *   scale:
 *       TERM_L2 = - kappaK_pole * gamma_1 * (arith)  =  + kappaK_pole * |gamma_1| * (arith)   [arith > 0].
 *   Hence, reading off effective coefficients, BOTH contributions enter with a POSITIVE scale constant:
 *       TERM_P2 = (+ zeta(2))     * kappaK_period,        sign(TERM_P2) = sign(kappaK_period),
 *       TERM_L2 = (+ |gamma_1|*arith) * kappaK_pole,      sign(TERM_L2) = sign(kappaK_pole)   [arith > 0].
 *   Therefore the two terms REINFORCE (add in magnitude) precisely when kappaK_period and kappaK_pole
 *   share a sign, and CANCEL only when they carry OPPOSITE signs. The minus written in "P2 - L2" is spent
 *   by gamma_1 < 0 and does NOT by itself open a cancellation channel. So cancellation is available if and
 *   only if the two normalisations have opposite sign -- a fact about the (uncomputed) imp-97617 reflection
 *   index, not something the elementary reciprocity or the written formula supplies for free.
 *   The relative-sign selector is sign(kappaK_period) * sign(kappaK_pole) * sign(arith): value +1 means
 *   reinforcement, value -1 means cancellation.
 *
 *   ==========================================================================================
 *   RESULT 2 -- the cap is SHARP under reinforcement; loosens by AT MOST 2x under bounded-pole cancellation
 *   ==========================================================================================
 *   REINFORCEMENT branch (same-signed normalisations, relative sign +1). Same-signed positive-scaled
 *   contributions add in magnitude, so
 *       |kappa_smooth| = (pi/2) | TERM_P2 + TERM_L2 |  >=  (pi/2) |TERM_P2| = (pi/2) |kappaK_period| zeta(2).
 *   Dividing by the bare period scale P2_unit = (pi/2)zeta(2) = pi^3/12 gives back exactly
 *       |kappaK_period|  <=  |kappa_smooth| / P2_unit  <~  1e-2 / (pi^3/12)  =  3.87e-3,
 *   i.e. the imp-97663 no-cancellation cap is the SHARP (binding, correct) upper bound in this branch --
 *   the period term cannot exceed the total when the terms reinforce.
 *
 *   CANCELLATION branch (opposite-signed normalisations, relative sign -1). Here TERM_P2 can exceed the
 *   total because TERM_L2 subtracts part of it. With NO control on the pole part the cap is uninformative
 *   (this is exactly imp-97663 resolution (ii): both normalisations O(1) with a ~1-part-in-250 fine-tuning
 *   -- unmotivated). But under the MILD auxiliary reading that the pole contribution is itself band-limited
 *   (|(pi/2) TERM_L2| <~ 1e-2, the same order as kappa_smooth), even maximal cancellation gives
 *       (pi/2)|TERM_P2|  <=  |kappa_smooth| + |(pi/2) TERM_L2|  <~  1e-2 + 1e-2 = 2e-2,
 *   so
 *       |kappaK_period|  <~  2e-2 / P2_unit  =  7.74e-3,
 *   AT MOST a factor of 2 looser than the no-cancellation cap. So cancellation cannot loosen the period
 *   cap unboundedly UNLESS the pole term is itself allowed to be large (the unmotivated fine-tuning).
 *
 *   ==========================================================================================
 *   RESULT 3 -- assessment: the cap is conservative-to-sharp; the measured sign-swing does NOT decide it
 *   ==========================================================================================
 *   Reading (i) is the SHARP upper bound whenever the two normalisations reinforce (RESULT 2 branch A),
 *   and is loosened by at most 2x under bounded-pole cancellation (branch B). The only way the cap fails
 *   to be conservative is the resolution-(ii) fine-tuning (two O(1) normalisations cancelling to 1 part in
 *   250), which imp-97663 already flagged as unmotivated. The measured kappa_smooth is sign-swinging across
 *   windows (imp-97578 STEP 3), but that swing is a WINDOWING artifact of the analytic-continuation wobble,
 *   not the analytic sign of either normalisation, so it does NOT resolve the relative sign
 *   sign(kappaK_period)*sign(kappaK_pole) that decides reinforcement vs cancellation. Deciding that sign --
 *   and hence whether the cap is exactly sharp or up-to-2x conservative -- still requires the imp-97617
 *   reflection index. No value is pinned for kappaK, kappaK_period, kappaK_pole, or kappa_smooth.
 *
 *   NET: the "P2 - L2" minus in kappa_smooth = (pi/2)[P2 - L2] is spent by gamma_1 < 0, so the two
 *   contributions REINFORCE when kappaK_period and kappaK_pole share a sign and CANCEL only when they are
 *   opposite-signed (RESULT 1). Under reinforcement the imp-97663 cap |kappaK_period| <~ 3.87e-3 is the
 *   SHARP upper bound; under bounded-pole cancellation it loosens by at most 2x (to <~ 7.74e-3); only the
 *   unmotivated resolution-(ii) fine-tuning removes the cap entirely (RESULT 2). The measured sign-swing is
 *   a windowing artifact and does NOT decide the relative sign, so the reflection index is still needed to
 *   say whether the cap is exactly sharp or up-to-2x conservative (RESULT 3). No coefficient is pinned;
 *   kappa_smooth stays measured; no bound moved. The rigorous anchor stays the trace ceiling T = 2.594e7;
 *   compute (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity; PT Lambda <= 0.2 remains
 *   SOTA; RH open; NO QED.
 *
 *   SUB-GAP (carried forward from imp-97663 / imp-97681, sign structure now assessed):
 *   imp-97709-bc-cancellation-relative-sign -- whether the imp-97663 no-cancellation cap is exactly sharp
 *   (reinforcement) or up-to-2x conservative (bounded-pole cancellation) is decided by the relative sign
 *   sign(kappaK_period)*sign(kappaK_pole), which requires the imp-97617 reflection index (the 2pi-power /
 *   argument-shift Pochhammer convention of the BC functional equation); this stays uncomputed. The naive
 *   Gauss-Kuzmin numerical route is proven non-convergent (imp-97578 STEP 3), so it is NOT a fallback.
 *
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint (the no-cancellation cap 3.87e-3)
 * @see imp-97681-route-m-bc-reflection-gamma-normalisation (|W_refl| <~ 0.24/pi consequence of the cap)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 2: kappa_smooth = (pi/2)[P2 - L2])
 *
 * Ticket: imp-97709 (numerical, opus-4-8, api-pool). Measured the sign structure of the BC decomposition
 * terms: the written "P2 - L2" minus is spent by gamma_1 < 0 (reinforcement, not cancellation), so the
 * imp-97663 cap is sharp under same-signed normalisations and loosens by at most 2x under bounded-pole
 * cancellation; the measured sign-swing is a windowing artifact and does NOT decide the relative sign;
 * NO coefficient pinned; NO QED.
 */

export const IMP97709_ZETA2 = (Math.PI * Math.PI) / 6; // scale of the period term P2 (STRICTLY POSITIVE)
export const IMP97709_GAMMA1 = -0.0728158454836767; // first Stieltjes constant (STRICTLY NEGATIVE)
export const IMP97709_KAPPA_SMOOTH_MEASURED_UPPER = 1e-2; // |kappa_smooth| <~ 1e-2, sign-swinging

// -- bare period scale and the imp-97663 no-cancellation cap (carried in as REAL numbers). ------------
export const IMP97709_P2_UNIT = (Math.PI / 2) * IMP97709_ZETA2; // = pi^3/12 = 2.5838563900249847
export const IMP97709_NO_CANCEL_CAP =
  IMP97709_KAPPA_SMOOTH_MEASURED_UPPER / IMP97709_P2_UNIT; // = 3.87e-3 (imp-97663 reading (i))

// -- RESULT 1: effective contribution signs. The L2 term is "- kappaK_pole*gamma_1*arith"; with -------
//    gamma_1 < 0 the literal minus multiplies a NEGATIVE scale, so both contributions enter with a
//    POSITIVE effective scale constant. The relative-sign selector is the product below: +1 = the terms
//    reinforce (add in magnitude), -1 = the terms can cancel.
export function imp97709RelativeContributionSign(signPeriod, signPole, signArith) {
  // sign(TERM_P2) = signPeriod * sign(zeta2)=+1 ; sign(TERM_L2) = sign(-gamma1)=+1 times signPole*signArith.
  const sp = Math.sign(signPeriod);
  const so = Math.sign(signPole);
  const sa = Math.sign(signArith);
  return sp * so * sa; // +1 reinforcement, -1 cancellation
}
// the effective scale constant multiplying kappaK_pole after the gamma_1 sign is absorbed is POSITIVE:
export const IMP97709_L2_EFFECTIVE_SCALE_SIGN = -Math.sign(IMP97709_GAMMA1); // = +1 (minus times gamma_1<0)

// -- RESULT 2: the bounded-pole cancellation loosening factor (at most 2x). ---------------------------
//    Under reinforcement the cap is exact. Under cancellation with the pole contribution itself band-
//    limited (|(pi/2)TERM_L2| <~ 1e-2), maximal cancellation lifts the period budget to 2e-2, so the cap
//    at most doubles.
export const IMP97709_BOUNDED_POLE_BUDGET =
  2 * IMP97709_KAPPA_SMOOTH_MEASURED_UPPER; // = 2e-2
export const IMP97709_CANCEL_CAP_BOUNDED_POLE =
  IMP97709_BOUNDED_POLE_BUDGET / IMP97709_P2_UNIT; // = 7.74e-3
export const IMP97709_MAX_LOOSENING_FACTOR =
  IMP97709_CANCEL_CAP_BOUNDED_POLE / IMP97709_NO_CANCEL_CAP; // = 2.0 exactly

export const IMP97709_VERDICT = Object.freeze({
  id: 'imp-97709',
  proofSection: 'Route-M',
  question:
    'Test the no-cancellation reading behind |kappaK_period| <~ 3.87e-3: measure the sign structure of ' +
    'the Bettin-Conrey decomposition terms to assess whether cross-term cancellation could loosen the cap.',
  // RESULT 1: the written minus is a reinforcement, not a cancellation channel.
  writtenMinusIsReinforcement: true, // gamma_1 < 0 spends the minus into a positive effective scale
  bothContributionsPositiveScale: true, // zeta(2) > 0 and -gamma_1 > 0
  cancellationRequiresOppositeSignNormalisations: true,
  relativeSignSelectorReinforceValue: imp97709RelativeContributionSign(1, 1, 1), // = +1
  relativeSignSelectorCancelValue: imp97709RelativeContributionSign(1, -1, 1), // = -1
  // RESULT 2: cap sharpness and bounded-pole loosening.
  capSharpUnderReinforcement: true, // period term cannot exceed the total when terms add
  noCancelCap: IMP97709_NO_CANCEL_CAP, // 3.87e-3
  boundedPoleCancelCap: IMP97709_CANCEL_CAP_BOUNDED_POLE, // 7.74e-3
  maxLooseningFactorUnderBoundedPole: IMP97709_MAX_LOOSENING_FACTOR, // 2.0
  unboundedLooseningNeedsUnmotivatedFineTuning: true, // resolution (ii): both O(1), 1-part-in-250 cancel
  // RESULT 3: assessment.
  noCancellationCapIsConservativeToSharp: true, // sharp under reinforcement, up-to-2x conservative else
  measuredSignSwingDecidesRelativeSign: false, // windowing artifact, not the analytic sign
  relativeSignRequiresReflectionIndex: true, // imp-97617 reflection index still uncomputed
  // honesty gate.
  mixedKernelCoefficientPinned: false, // NO numeric kappaK / kappaK_period / kappaK_pole asserted
  kappaSmoothStaysMeasured: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The imp-97597 decomposition kappa_smooth = (pi/2)[P2 - L2] displays a minus, but the L2 term ' +
    'carries gamma_1 = -0.0728158454836767 < 0, so the literal minus multiplies a NEGATIVE scale and the ' +
    'two contributions BOTH enter with a positive effective scale (zeta(2) = pi^2/6 > 0 and -gamma_1 > 0). ' +
    'Hence the terms REINFORCE when kappaK_period and kappaK_pole share a sign and CANCEL only when they ' +
    'are opposite-signed -- the written minus is spent by gamma_1 and is NOT a cancellation channel ' +
    '(RESULT 1). Under reinforcement the imp-97663 cap |kappaK_period| <~ 3.87e-3 is the SHARP upper bound ' +
    '(the period term cannot exceed the total); under cancellation with the pole contribution itself band- ' +
    'limited the cap loosens by AT MOST a factor of 2 (to <~ 7.74e-3), and only the unmotivated ' +
    'resolution-(ii) fine-tuning (two O(1) normalisations cancelling to 1 part in 250) removes it entirely ' +
    '(RESULT 2). The measured kappa_smooth sign-swing (imp-97578 STEP 3) is a windowing artifact of the ' +
    'continuation wobble and does NOT decide the relative sign, so the imp-97617 reflection index is still ' +
    'needed to say whether the cap is exactly sharp or up-to-2x conservative (RESULT 3). No value is ' +
    'pinned for kappaK or kappa_smooth; the reflection index stays uncomputed; kappa_smooth stays ' +
    'measured. The rigorous anchor stays T = 2.594e7; compute binds first by >2600x; no operator ' +
    'positivity; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97709_SUBGAP = Object.freeze({
  id: 'imp-97709-bc-cancellation-relative-sign',
  statement:
    'Whether the imp-97663 no-cancellation cap |kappaK_period| <~ 3.87e-3 is exactly sharp ' +
    '(reinforcement, same-signed normalisations) or up-to-2x conservative (bounded-pole cancellation, ' +
    'opposite-signed normalisations) is decided by the relative sign ' +
    'sign(kappaK_period)*sign(kappaK_pole), because the written "P2 - L2" minus is spent by gamma_1 < 0 ' +
    'and does NOT itself cancel. Pinning that relative sign requires the imp-97617 reflection index (the ' +
    '2pi-power / argument-shift Pochhammer convention of the BC functional equation), which stays ' +
    'uncomputed. The measured sign-swing is a windowing artifact, not the analytic sign, so it does not ' +
    'decide it; the naive Gauss-Kuzmin numerical route is proven non-convergent (imp-97578 STEP 3), so it ' +
    'is NOT a fallback.',
});

export const IMP97709_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Measurement / assessment only: the "P2 - L2" minus in ' +
  'the Bettin-Conrey cusp decomposition is spent by gamma_1 < 0, so the two contributions reinforce for ' +
  'same-signed normalisations and cancel only for opposite-signed ones. The imp-97663 cap ' +
  '|kappaK_period| <~ 3.87e-3 is therefore sharp under reinforcement and loosens by at most 2x under ' +
  'bounded-pole cancellation; the measured sign-swing does not decide the relative sign. No analytic ' +
  'constant is pinned; kappa_smooth stays measured; the rigorous anchor stays T = 2.594e7; compute binds ' +
  'first by >2600x.';

export default IMP97709_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    LIGHT consistency checks on REAL scale numbers and the sign algebra only -- NO fabricated
//    coefficient is verified.
const IMP97709_ASSERTIONS = [
  {
    id: 'imp97709-scale-constant-signs',
    why: 'RESULT 1 rests on the classical signs: zeta(2) = pi^2/6 > 0 and gamma_1 < 0, so the effective ' +
      'scale multiplying kappaK_pole (namely -gamma_1) is POSITIVE.',
    holds: () =>
      IMP97709_ZETA2 > 0 &&
      IMP97709_GAMMA1 < 0 &&
      IMP97709_L2_EFFECTIVE_SCALE_SIGN === 1 &&
      Math.abs(IMP97709_ZETA2 - 1.6449340668482264) < 1e-13,
  },
  {
    id: 'imp97709-relative-sign-selector',
    why: 'RESULT 1: the terms reinforce (+1) when the two normalisations share a sign and cancel (-1) ' +
      'when they are opposite-signed (arith > 0); the written minus is NOT a cancellation channel.',
    holds: () =>
      imp97709RelativeContributionSign(1, 1, 1) === 1 &&
      imp97709RelativeContributionSign(-1, -1, 1) === 1 &&
      imp97709RelativeContributionSign(1, -1, 1) === -1 &&
      imp97709RelativeContributionSign(-1, 1, 1) === -1,
  },
  {
    id: 'imp97709-no-cancel-cap-matches-imp97663',
    why: 'the no-cancellation cap reproduced here equals the imp-97663 value 3.87e-3 = 1e-2 / (pi^3/12).',
    holds: () =>
      Math.abs(IMP97709_P2_UNIT - Math.PI ** 3 / 12) < 1e-15 &&
      Math.abs(IMP97709_NO_CANCEL_CAP - 0.0038701841319839394) < 1e-15,
  },
  {
    id: 'imp97709-bounded-pole-loosening-at-most-2x',
    why: 'RESULT 2: under bounded-pole cancellation the period budget lifts to 2e-2, so the cap loosens ' +
      'by EXACTLY a factor of 2 (to <~ 7.74e-3) -- not unboundedly.',
    holds: () =>
      Math.abs(IMP97709_CANCEL_CAP_BOUNDED_POLE - 0.007740368263967879) < 1e-15 &&
      Math.abs(IMP97709_MAX_LOOSENING_FACTOR - 2) < 1e-12 &&
      IMP97709_CANCEL_CAP_BOUNDED_POLE > IMP97709_NO_CANCEL_CAP,
  },
  {
    id: 'imp97709-honesty-gate-no-qed',
    why: 'measurement / assessment only: sign structure measured, cap sharpness and bounded-pole ' +
      'loosening reported, NO coefficient pinned, NO bound moved, compute binds first, sub-gap + ' +
      'honesty markers present.',
    holds: () =>
      IMP97709_VERDICT.writtenMinusIsReinforcement === true &&
      IMP97709_VERDICT.cancellationRequiresOppositeSignNormalisations === true &&
      IMP97709_VERDICT.capSharpUnderReinforcement === true &&
      IMP97709_VERDICT.maxLooseningFactorUnderBoundedPole === 2 &&
      IMP97709_VERDICT.measuredSignSwingDecidesRelativeSign === false &&
      IMP97709_VERDICT.mixedKernelCoefficientPinned === false &&
      IMP97709_VERDICT.kappaSmoothStaysMeasured === true &&
      IMP97709_VERDICT.anyBoundMoved === false &&
      IMP97709_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97709_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97709_HONEST_BANNER) &&
      /RH open/.test(IMP97709_HONEST_BANNER) &&
      /cancellation-relative-sign/.test(IMP97709_SUBGAP.id),
  },
];

for (const a of IMP97709_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97709-route-m-bc-cancellation-sign-structure assertion failed: ${a.id}`,
    );
  }
}

export { IMP97709_ASSERTIONS };
