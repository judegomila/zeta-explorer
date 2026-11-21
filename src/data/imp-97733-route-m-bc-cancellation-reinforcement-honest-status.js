/**
 * @module imp-97733-route-m-bc-cancellation-reinforcement-honest-status
 *
 * imp-97733 (content, sonnet-4-6, sonnet): standalone honest-status note recording the imp-97709
 * Bettin-Conrey cancellation sign-structure finding.
 *
 * BACKGROUND. imp-97597 wrote the O(x^2) cusp coefficient as kappa_smooth = (pi/2)[P2 - L2] with
 * P2 = kappaK_period * zeta(2) and L2 = kappaK_pole * gamma_1 * (arith factor). imp-97663 read the
 * measured smallness of kappa_smooth under a NO-CANCELLATION assumption to cap
 * |kappaK_period| <~ 3.87e-3 (and imp-97681 derived the |W_refl| <~ 0.24/pi consequence from it), but
 * left open whether the written "P2 - L2" minus could instead signal a genuine cancellation between
 * the two terms that would loosen or void the cap.
 *
 * FINDING -- THE WRITTEN MINUS IS A REINFORCEMENT, NOT A CANCELLATION CHANNEL. imp-97709 measured the
 * sign structure directly: gamma_1 = -0.0728158454836767 is STRICTLY NEGATIVE, so the L2 term
 * "- kappaK_pole * gamma_1 * (arith)" multiplies a NEGATIVE scale, flipping to a POSITIVE effective
 * coefficient on kappaK_pole. Since zeta(2) = pi^2/6 is also strictly positive, BOTH contributions enter
 * kappa_smooth with a positive effective scale. The two terms therefore REINFORCE (add in magnitude)
 * whenever kappaK_period and kappaK_pole share a sign, and can only CANCEL when the two normalisations
 * are opposite-signed -- a fact about the uncomputed imp-97617 reflection index, not something the
 * written formula supplies for free.
 *
 * FINDING -- THE CAP IS SHARP UNDER REINFORCEMENT, AT MOST 2x LOOSER UNDER BOUNDED-POLE CANCELLATION.
 * Under reinforcement, |kappaK_period| <= |kappa_smooth| / (pi^3/12) reproduces the imp-97663 cap
 * 3.87e-3 exactly and it is the SHARP (binding) bound in that branch. Under cancellation with the pole
 * contribution itself band-limited to the same order as kappa_smooth (|~1e-2), maximal cancellation
 * lifts the period budget from 1e-2 to 2e-2, loosening the cap by EXACTLY a factor of 2 (to <~ 7.74e-3)
 * -- not unboundedly. Only the unmotivated imp-97663 resolution-(ii) fine-tuning (two O(1)
 * normalisations cancelling to 1 part in 250) removes the cap entirely, and that reading was already
 * flagged as unmotivated.
 *
 * FINDING -- THE MEASURED SIGN-SWING DOES NOT DECIDE THE RELATIVE SIGN. kappa_smooth sign-swings across
 * windows (imp-97578 STEP 3), but that swing is a windowing artifact of the analytic-continuation
 * wobble, not the analytic sign of either normalisation. Deciding sign(kappaK_period)*sign(kappaK_pole)
 * -- and hence whether the cap is exactly sharp or up-to-2x conservative -- still requires the
 * imp-97617 reflection index; the naive Gauss-Kuzmin numerical route stays proven non-convergent
 * (imp-97578 STEP 3), so it is NOT a fallback.
 *
 * NO FIX APPLIED. This is a scoping/honest-status note, not a code defect -- it cross-indexes the
 * imp-97709 IMP97709_VERDICT / IMP97709_SUBGAP finding as a standalone indexable module (glossary/audit
 * sweeps that grep for honest-status modules by filename, per imp-36209's finding that inline-only
 * corrections are not reliably discoverable). Read-only record; changes no bound; establishes no
 * operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-97709-route-m-bc-cancellation-sign-structure.js (the sign-structure measurement this note records)
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint.js (the no-cancellation cap 3.87e-3)
 * @see imp-97681-route-m-bc-reflection-gamma-normalisation.js (|W_refl| <~ 0.24/pi consequence of the cap)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion.js (RESULT 2: kappa_smooth = (pi/2)[P2 - L2])
 */

import {
  IMP97709_NO_CANCEL_CAP,
  IMP97709_CANCEL_CAP_BOUNDED_POLE,
  IMP97709_MAX_LOOSENING_FACTOR,
  IMP97709_VERDICT,
} from './imp-97709-route-m-bc-cancellation-sign-structure.js';

export const IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS = {
  id: 'imp-97733',
  proofSection: 'Route-M',
  question:
    'Does the "P2 - L2" minus in the imp-97597 kappa_smooth decomposition open a cancellation channel ' +
    'that could loosen the imp-97663 no-cancellation cap |kappaK_period| <~ 3.87e-3, and if so by how much?',
  verdictShort:
    'THE WRITTEN MINUS IS A REINFORCEMENT, NOT A CANCELLATION CHANNEL. gamma_1 < 0 spends the minus into ' +
    'a positive effective scale, so the two contributions add in magnitude for same-signed normalisations ' +
    'and can only cancel for opposite-signed ones. The cap is sharp under reinforcement and loosens by at ' +
    'most 2x under bounded-pole cancellation.',
  writtenMinusIsReinforcement: IMP97709_VERDICT.writtenMinusIsReinforcement, // true
  cancellationRequiresOppositeSignNormalisations: IMP97709_VERDICT.cancellationRequiresOppositeSignNormalisations, // true
  capSharpUnderReinforcement: IMP97709_VERDICT.capSharpUnderReinforcement, // true
  noCancelCap: IMP97709_NO_CANCEL_CAP, // 3.87e-3
  boundedPoleCancelCap: IMP97709_CANCEL_CAP_BOUNDED_POLE, // 7.74e-3
  maxLooseningFactorUnderBoundedPole: IMP97709_MAX_LOOSENING_FACTOR, // 2.0 exactly
  measuredSignSwingDecidesRelativeSign: IMP97709_VERDICT.measuredSignSwingDecidesRelativeSign, // false
  relativeSignRequiresReflectionIndex: IMP97709_VERDICT.relativeSignRequiresReflectionIndex, // true
  mixedKernelCoefficientPinned: false,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / HONEST-STATUS FINDING (no fix applied, no new measurement -- restates and cross-indexes the ' +
    'imp-97709 sign-structure finding as a standalone module). The imp-97597 decomposition displays a ' +
    'minus, but gamma_1 = -0.0728158454836767 < 0 spends that minus into a POSITIVE effective scale on the ' +
    'pole term, so both contributions enter kappa_smooth with positive effective scale constants ' +
    '(zeta(2) = pi^2/6 > 0, -gamma_1 > 0). The terms REINFORCE for same-signed normalisations and CANCEL ' +
    'only for opposite-signed ones. Under reinforcement the imp-97663 cap |kappaK_period| <~ 3.87e-3 is ' +
    `the SHARP upper bound; under bounded-pole cancellation it loosens by EXACTLY a factor of ` +
    `${IMP97709_MAX_LOOSENING_FACTOR} (to <~ 7.74e-3). The measured kappa_smooth sign-swing is a ` +
    'windowing artifact and does not decide the relative sign, so the imp-97617 reflection index is ' +
    'still needed. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97709-route-m-bc-cancellation-sign-structure.js (IMP97709_VERDICT / IMP97709_SUBGAP, the source ' +
    'finding this note records); imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint.js ' +
    '(the no-cancellation cap 3.87e-3).',
};

export const IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97733-reinforcement-recorded',
    description: 'the written minus is recorded as a reinforcement channel, not a cancellation channel',
    holds: () =>
      IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.writtenMinusIsReinforcement === true &&
      IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.cancellationRequiresOppositeSignNormalisations === true &&
      IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.capSharpUnderReinforcement === true,
  },
  {
    id: 'imp97733-loosening-factor-matches-imp97709',
    description: 'the recorded caps and loosening factor equal the imp-97709 measured values exactly',
    holds: () =>
      Math.abs(IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.noCancelCap - 0.0038701841319839394) < 1e-15 &&
      Math.abs(IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.boundedPoleCancelCap - 0.007740368263967879) < 1e-15 &&
      Math.abs(IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.maxLooseningFactorUnderBoundedPole - 2) < 1e-12,
  },
  {
    id: 'imp97733-sign-swing-not-decisive',
    description: 'the measured sign-swing is recorded as not deciding the relative sign, which still needs the reflection index',
    holds: () =>
      IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.measuredSignSwingDecidesRelativeSign === false &&
      IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.relativeSignRequiresReflectionIndex === true,
  },
  {
    id: 'imp97733-no-fix-honesty-gate',
    description: 'honest-status finding only: no fix applied, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.fixApplied === false &&
      IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS.verdict),
  },
];

for (const a of IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97733-route-m-bc-cancellation-reinforcement-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP97733_BC_CANCELLATION_REINFORCEMENT_HONEST_STATUS;
