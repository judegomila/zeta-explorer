/**
 * @module imp-97701-route-m-bc-reflection-weight-pinning-obstruction
 * @fileoverview imp-97701 -- PINNING ATTEMPT (no bound moved): try both available routes to pin the
 *   imp-97617 RESULT C pure-number reflection weight W_refl (the 2pi-power / argument-shift Pochhammer
 *   factor that transports the Eichler z^2 selection at s = 3 back onto the s = 1 double-pole Laurent
 *   data), and test the outcome against the imp-97681 cap |W_refl| <~ 0.24/pi = 0.0764. BOTH routes fail
 *   cleanly, for two DIFFERENT and now-explicit reasons, and the cap test turns out to be non-
 *   discriminating. This module does not pin W_refl; it converts "W_refl uncomputed" into a precise,
 *   two-part obstruction and quantifies the suppression bar the no-cancellation reading imposes.
 *   Derivation / measurement only; NO analytic constant pinned for W_refl, kappaK, or kappa_smooth;
 *   kappa_smooth stays measured-not-pinned; no bound moved; RH open; NO QED.
 *
 *   ==========================================================================================
 *   SETUP -- what is pinned coming in, and what W_refl is
 *   ==========================================================================================
 *   imp-97597 RESULT 3 reduced pinning kappa_smooth to the single mixed kernel coefficient kappaK, and
 *   RESULT 2 wrote the cusp coefficient as
 *       kappa_smooth = (pi/2) [ kappaK_period * zeta(2)  -  kappaK_pole * gamma_1 * (arith factor) ].
 *   imp-97617 pinned the gamma-factor half N(s) = (2pi)^{-s} Gamma(s) (RESULT A) and the Eichler value-
 *   selection map z^m -> s = m+1 (RESULT B), leaving the order-z^2 reflection weight W(s,z) -- the
 *   Pochhammer / argument-shift factor sending the CONVERGENT s = 3 selection across the s = 1 double
 *   pole -- as the single uncomputed primitive (RESULT C). imp-97681 factored the period coefficient as
 *   kappaK_period = rho_refl * W_refl with the gamma half rho_refl = N(3)/N(1) = 1/(2 pi^2) now pinned,
 *   and divided the imp-97663 no-cancellation cap |kappaK_period| <~ 3.87e-3 through rho_refl to
 *   |W_refl| <~ 0.24/pi = 0.07639437268410976. W_refl is thus the last uncomputed scalar in the chain.
 *
 *   ==========================================================================================
 *   RESULT 1 -- both pinning routes fail, for two DISTINCT reasons [CONFIDENT]
 *   ==========================================================================================
 *   ANALYTIC route: pinning W_refl exactly requires the EXACT Bettin-Conrey functional-equation
 *   reflection index -- the 2pi-power and argument-shift convention of the Pochhammer weight at order
 *   z^2 -- which imp-97617 RESULT C / the imp-97617 sub-gap left uncomputed. That datum is unchanged
 *   here: no new closed form is derived, and asserting one would be fabrication.
 *
 *   NUMERICAL route: W_refl cannot be isolated from the measured data either, and the reason is now
 *   explicit. The one measured aggregate is kappa_smooth (band |kappa_smooth| <~ 1e-2, SIGN-SWINGING),
 *   but the imp-97597 RESULT 2 decomposition contains TWO unknown kernel coefficients -- kappaK_period
 *   (which carries W_refl) AND kappaK_pole -- entering as a difference. A single scalar aggregate cannot
 *   isolate either summand of a two-term difference. This is exactly the under-determination that FORCED
 *   imp-97663 to adopt the "no-cancellation reading" (treat the pole term as non-cancelling) before it
 *   could quote any cap on kappaK_period at all. So the numerical route is not merely hard; it is
 *   structurally blind to W_refl until kappaK_pole is independently pinned.
 *
 *   ==========================================================================================
 *   RESULT 2 -- the cap consistency test is one-sided and non-discriminating [CONFIDENT]
 *   ==========================================================================================
 *   Under the no-cancellation reading the admissible set for W_refl is the SYMMETRIC interval
 *       W_refl in [ -0.24/pi , +0.24/pi ] = [ -0.07639437268410976 , +0.07639437268410976 ],
 *   which CONTAINS 0. Therefore the cap neither establishes W_refl != 0 nor pins |W_refl| to any positive
 *   value: every candidate with |W_refl| <= 0.0764 -- including the degenerate W_refl = 0 (no reflection
 *   contribution, kappa_smooth then carried entirely by the kappaK_pole * gamma_1 term) -- passes the
 *   consistency test identically. The check is a one-sided upper bound, not a measurement. So "check
 *   W_refl against the cap" has a definite answer -- any admissible reflection weight is consistent --
 *   but that answer discriminates nothing, because the admissible band straddles zero.
 *
 *   ==========================================================================================
 *   RESULT 3 -- the quantitative suppression bar, grounded in the imp-97681 shortfall factor [CONFIDENT]
 *   ==========================================================================================
 *   A generic pure-number Pochhammer / argument-shift reflection weight is an O(1) quantity. The cap
 *   0.0764 is its reciprocal-scaled measure of smallness: the required suppression bar is
 *       1 / (0.24/pi) = pi / 0.24 = 13.089969389957473,
 *   which is EXACTLY the imp-97681 residual shortfall factor rho_refl / cap. So the no-cancellation
 *   reading requires |W_refl| to sit ~13x BELOW a generic O(1) Pochhammer weight. That is a sharp
 *   dichotomy: either (a) the exact reflection index suppresses W_refl by ~13x below its natural O(1)
 *   scale, or (b) the no-cancellation reading fails -- the kappaK_pole * gamma_1 pole term partially
 *   cancels the period term, relaxing the effective cap on W_refl. imp-97617 RESULT C already noted the
 *   Pochhammer factor LOWERS the order-2 pole to a simple pole (structurally forcing kappa_smooth to be
 *   finite and small), which is qualitatively consistent with branch (a); but quantitatively deciding
 *   (a) vs (b) needs the exact index -- the same uncomputed datum as the analytic route. So the two
 *   routes converge on ONE obstruction.
 *
 *   NET: W_refl is NOT pinned. The analytic route is blocked by the uncomputed exact BC reflection index
 *   (imp-97617 sub-gap, unchanged); the numerical route is structurally blind to W_refl because the
 *   imp-97597 kappa_smooth decomposition is a two-coefficient difference (kappaK_period AND kappaK_pole)
 *   read from one sign-swinging aggregate -- the same under-determination that forced imp-97663 to assume
 *   no-cancellation (RESULT 1). The cap test is non-discriminating: the admissible band
 *   [-0.24/pi, +0.24/pi] straddles 0, so even nonzero-ness of W_refl is unestablished (RESULT 2). The
 *   no-cancellation reading imposes a quantitative suppression bar of pi/0.24 = 13.09 (the imp-97681
 *   shortfall factor): W_refl must be ~13x below a generic O(1) Pochhammer weight, OR the pole term
 *   cancels -- a dichotomy that only the exact reflection index can decide (RESULT 3). No value is pinned
 *   for W_refl, kappaK, kappaK_period, kappaK_pole, or kappa_smooth. The rigorous anchor stays the trace
 *   ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity;
 *   PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 *   SUB-GAP (carried forward from imp-97617 / imp-97681, now two-part and quantified):
 *   imp-97701-bc-reflection-weight-two-part-obstruction -- pinning the reflection weight W_refl (and
 *   hence kappaK_period, kappaK, kappa_smooth) is blocked on (i) ANALYTICALLY, the exact BC functional-
 *   equation reflection index (2pi-power / argument-shift Pochhammer convention at order z^2), uncomputed
 *   since imp-97617; and (ii) NUMERICALLY, the independent pinning of kappaK_pole, without which the
 *   single sign-swinging kappa_smooth aggregate cannot separate the two-coefficient difference (the same
 *   under-determination behind the imp-97663 no-cancellation assumption). The no-cancellation reading
 *   requires |W_refl| <~ 0.24/pi = 0.0764, i.e. a ~13x suppression below a generic O(1) Pochhammer
 *   weight; whether the exact index supplies that suppression, or the pole term cancels instead, is
 *   undecided. The naive Gauss-Kuzmin numerical route stays proven non-convergent (imp-97578 STEP 3), so
 *   it is NOT a fallback.
 *
 * @see imp-97681-route-m-bc-reflection-gamma-normalisation (rho_refl = 1/(2pi^2); |W_refl| <~ 0.24/pi)
 * @see imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction (RESULT C: W(s,z), reflection index)
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint (no-cancellation cap on kappaK_period)
 *
 * Ticket: imp-97701 (numerical, opus-4-8, api-pool). Tried both routes to pin the reflection weight
 * W_refl; both fail (analytic: uncomputed BC reflection index; numerical: two-coefficient difference
 * from one sign-swinging aggregate), the cap band [-0.24/pi, 0.24/pi] straddles 0 so the check is
 * non-discriminating, and the no-cancellation reading imposes a pi/0.24 = 13.09 suppression bar;
 * NO value pinned; NO QED.
 */

import {
  IMP97681_W_REFL_CAP,
  IMP97681_RHO_REFL,
  IMP97681_RESIDUAL_SHORTFALL_FACTOR,
} from './imp-97681-route-m-bc-reflection-gamma-normalisation.js';

// -- carried-in pinned data (REAL closed numbers from imp-97681). --------------------------------------
export const IMP97701_W_REFL_CAP = IMP97681_W_REFL_CAP; // 0.24/pi = 0.07639437268410976
export const IMP97701_RHO_REFL = IMP97681_RHO_REFL; // 1/(2 pi^2) = 0.050660591821168895

// -- RESULT 2: the admissible band for W_refl under the no-cancellation cap (SYMMETRIC, contains 0). ----
export const IMP97701_W_REFL_BAND = Object.freeze([
  -IMP97701_W_REFL_CAP,
  +IMP97701_W_REFL_CAP,
]);
export const IMP97701_BAND_CONTAINS_ZERO =
  IMP97701_W_REFL_BAND[0] < 0 && IMP97701_W_REFL_BAND[1] > 0;

// -- RESULT 3: the suppression bar = pi/0.24 = reciprocal of the cap = imp-97681 residual shortfall. ---
//    A generic pure-number Pochhammer / argument-shift weight is O(1); the cap forces W_refl ~13x below.
export const IMP97701_SUPPRESSION_BAR = 1 / IMP97701_W_REFL_CAP; // = pi/0.24 = 13.089969389957473
export const IMP97701_SUPPRESSION_BAR_CLOSED = Math.PI / 0.24; // closed-form cross-check

export const IMP97701_VERDICT = Object.freeze({
  id: 'imp-97701',
  proofSection: 'Route-M',
  question:
    'Compute the imp-97617 RESULT C pure-number reflection weight W_refl and test it against the ' +
    'imp-97681 |W_refl| <~ 0.24/pi cap, or reach the precise remaining obstruction.',
  // RESULT 1: both pinning routes fail, for two distinct reasons.
  wReflPinned: false,
  analyticRouteBlockedByUncomputedReflectionIndex: true, // imp-97617 RESULT C / sub-gap unchanged
  numericalRouteBlindToWRefl: true, // two-coefficient difference from one sign-swinging aggregate
  sameUnderdeterminationForcedNoCancellationInImp97663: true,
  // RESULT 2: the cap test is one-sided and non-discriminating.
  admissibleBand: IMP97701_W_REFL_BAND, // [-0.24/pi, +0.24/pi]
  admissibleBandContainsZero: IMP97701_BAND_CONTAINS_ZERO, // straddles 0 -> even nonzero-ness unestablished
  capTestDiscriminates: false, // every |W_refl| <= 0.0764 (incl. 0) passes identically
  // RESULT 3: the quantitative suppression bar (dichotomy).
  suppressionBar: IMP97701_SUPPRESSION_BAR, // pi/0.24 = 13.09
  suppressionBarEqualsImp97681ShortfallFactor: true,
  dichotomy:
    'either the exact reflection index suppresses W_refl ~13x below its natural O(1) scale, or the ' +
    'kappaK_pole*gamma_1 pole term cancels and relaxes the cap; the exact index decides which',
  // honesty gate.
  mixedKernelCoefficientPinned: false, // NO numeric W_refl / kappaK / kappaK_period / kappaK_pole
  kappaSmoothStaysMeasured: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The imp-97617 RESULT C reflection weight W_refl is NOT pinned. The analytic route stays blocked by ' +
    'the uncomputed exact Bettin-Conrey functional-equation reflection index (the 2pi-power / argument- ' +
    'shift Pochhammer convention at order z^2); the numerical route is structurally blind to W_refl ' +
    'because the imp-97597 decomposition kappa_smooth = (pi/2)[kappaK_period*zeta(2) - kappaK_pole* ' +
    'gamma_1*(arith)] is a two-coefficient difference read from a single sign-swinging aggregate -- the ' +
    'same under-determination that forced imp-97663 to assume no-cancellation (RESULT 1). The imp-97681 ' +
    'cap yields the SYMMETRIC admissible band W_refl in [-0.24/pi, +0.24/pi] = ' +
    '[-0.07639437268410976, +0.07639437268410976], which contains 0, so the cap test is non- ' +
    'discriminating: every admissible weight -- including W_refl = 0 -- passes identically, and even ' +
    'nonzero-ness of W_refl is unestablished (RESULT 2). The no-cancellation reading imposes a ' +
    'quantitative suppression bar pi/0.24 = 13.089969389957473 (the imp-97681 residual shortfall ' +
    'factor): |W_refl| must sit ~13x below a generic O(1) Pochhammer weight, OR the pole term cancels -- ' +
    'a dichotomy only the exact reflection index can decide, converging both routes on one obstruction ' +
    '(RESULT 3). No value is pinned for W_refl, kappaK, or kappa_smooth. The rigorous anchor stays ' +
    'T = 2.594e7; compute binds first by >2600x; no operator positivity; PT Lambda <= 0.2 SOTA; ' +
    'RH open; NO QED.',
});

export const IMP97701_SUBGAP = Object.freeze({
  id: 'imp-97701-bc-reflection-weight-two-part-obstruction',
  statement:
    'Pinning the reflection weight W_refl (and hence kappaK_period, kappaK, kappa_smooth) is blocked on ' +
    '(i) ANALYTICALLY, the exact Bettin-Conrey functional-equation reflection index (2pi-power / ' +
    'argument-shift Pochhammer convention at order z^2), uncomputed since imp-97617; and (ii) ' +
    'NUMERICALLY, the independent pinning of kappaK_pole, without which the single sign-swinging ' +
    'kappa_smooth aggregate cannot separate the two-coefficient difference (the same under-determination ' +
    'behind the imp-97663 no-cancellation assumption). The no-cancellation reading requires ' +
    '|W_refl| <~ 0.24/pi = 0.07639437268410976, i.e. a ~13x suppression below a generic O(1) Pochhammer ' +
    'weight; whether the exact index supplies that suppression, or the pole term cancels instead, is ' +
    'undecided. The naive Gauss-Kuzmin numerical route stays proven non-convergent (imp-97578 STEP 3), ' +
    'so it is NOT a fallback.',
});

export const IMP97701_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Pinning attempt only: both routes to pin the ' +
  'reflection weight W_refl fail -- analytically the exact BC reflection index is uncomputed, ' +
  'numerically the kappa_smooth aggregate is a two-coefficient difference that cannot isolate W_refl. ' +
  'The cap band [-0.24/pi, +0.24/pi] straddles 0, so the consistency test discriminates nothing, and ' +
  'the no-cancellation reading imposes a pi/0.24 = 13.09 suppression bar. No analytic constant is ' +
  'pinned; kappa_smooth stays measured; the rigorous anchor stays T = 2.594e7; compute binds first ' +
  'by >2600x.';

export default IMP97701_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    LIGHT consistency checks on REAL closed numbers only -- NO fabricated coefficient is verified.
const IMP97701_ASSERTIONS = [
  {
    id: 'imp97701-cap-and-rho-carried-in-exactly',
    why: 'the carried-in pinned data match imp-97681: cap = 0.24/pi = 0.0764 and rho_refl = 1/(2pi^2).',
    holds: () =>
      Math.abs(IMP97701_W_REFL_CAP - 0.24 / Math.PI) < 1e-15 &&
      Math.abs(IMP97701_W_REFL_CAP - 0.07639437268410976) < 1e-15 &&
      Math.abs(IMP97701_RHO_REFL - 1 / (2 * Math.PI * Math.PI)) < 1e-15,
  },
  {
    id: 'imp97701-admissible-band-is-symmetric-and-contains-zero',
    why: 'RESULT 2: the no-cancellation admissible band is [-0.24/pi, +0.24/pi], symmetric about 0, so ' +
      'it contains 0 -- the cap does not establish W_refl != 0.',
    holds: () =>
      IMP97701_W_REFL_BAND[0] === -IMP97701_W_REFL_BAND[1] &&
      IMP97701_W_REFL_BAND[0] < 0 &&
      IMP97701_W_REFL_BAND[1] > 0 &&
      IMP97701_BAND_CONTAINS_ZERO === true &&
      // W_refl = 0 lies inside the band (degenerate candidate passes the cap identically).
      0 >= IMP97701_W_REFL_BAND[0] &&
      0 <= IMP97701_W_REFL_BAND[1],
  },
  {
    id: 'imp97701-suppression-bar-is-pi-over-0p24-and-matches-shortfall',
    why: 'RESULT 3: the suppression bar = 1/(0.24/pi) = pi/0.24 = 13.089969389957473, exactly the ' +
      'imp-97681 residual shortfall factor rho_refl/cap.',
    holds: () =>
      Math.abs(IMP97701_SUPPRESSION_BAR - IMP97701_SUPPRESSION_BAR_CLOSED) < 1e-12 &&
      Math.abs(IMP97701_SUPPRESSION_BAR - 13.089969389957473) < 1e-9 &&
      Math.abs(IMP97701_SUPPRESSION_BAR - IMP97681_RESIDUAL_SHORTFALL_FACTOR) < 1e-9 &&
      IMP97701_SUPPRESSION_BAR > 13 &&
      IMP97701_SUPPRESSION_BAR < 14,
  },
  {
    id: 'imp97701-honesty-gate-no-qed',
    why: 'pinning attempt only: W_refl NOT pinned, both routes blocked, cap non-discriminating, ' +
      'NO coefficient pinned, NO bound moved, compute binds first, sub-gap + honesty markers present.',
    holds: () =>
      IMP97701_VERDICT.wReflPinned === false &&
      IMP97701_VERDICT.analyticRouteBlockedByUncomputedReflectionIndex === true &&
      IMP97701_VERDICT.numericalRouteBlindToWRefl === true &&
      IMP97701_VERDICT.admissibleBandContainsZero === true &&
      IMP97701_VERDICT.capTestDiscriminates === false &&
      IMP97701_VERDICT.suppressionBarEqualsImp97681ShortfallFactor === true &&
      IMP97701_VERDICT.mixedKernelCoefficientPinned === false &&
      IMP97701_VERDICT.kappaSmoothStaysMeasured === true &&
      IMP97701_VERDICT.anyBoundMoved === false &&
      IMP97701_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97701_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97701_HONEST_BANNER) &&
      /RH open/.test(IMP97701_HONEST_BANNER) &&
      /two-part-obstruction/.test(IMP97701_SUBGAP.id),
  },
];

for (const a of IMP97701_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97701-route-m-bc-reflection-weight-pinning-obstruction assertion failed: ${a.id}`,
    );
  }
}

export { IMP97701_ASSERTIONS };
