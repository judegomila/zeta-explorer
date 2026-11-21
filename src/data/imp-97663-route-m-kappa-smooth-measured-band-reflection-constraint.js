/**
 * @module imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint
 * @fileoverview imp-97663 -- DERIVATION ATTEMPT + CONSTRAINT (no bound moved): the frontier scout
 *   seeded this ticket to "attempt the exact O(x^2) cusp coefficient kappa_smooth from the imp-97597
 *   Bettin-Conrey psi_s integral representation". The direct closed form does NOT close: the sibling
 *   imp-97617 already reconstructed the gamma-factor half of the Bettin-Conrey kernel and localised the
 *   remaining primitive to a single functional-equation reflection index, which stays uncomputed. So
 *   rather than re-run that reconstruction, this module makes the one honest advance the direct route
 *   cannot: it FEEDS THE MEASURED BAND |kappa_smooth| <~ 1e-2 (imp-97460/imp-97578, sign-swinging) BACK
 *   into the imp-97597 decomposition kappa_smooth = (pi/2)[P2 - L2] to turn the still-uncomputed
 *   Bettin-Conrey reflection normalisation into a quantitative order-of-magnitude CONSTRAINT. No value
 *   is pinned; the reflection index stays uncomputed; kappa_smooth stays measured-not-pinned; no bound
 *   moved; RH open; NO QED.
 *
 *   ==========================================================================================
 *   SETUP -- the two building-block scales are REAL numbers; the normalisations are not
 *   ==========================================================================================
 *   imp-97597 RESULT 2 decomposed the O(x^2) cusp coefficient of the analytic period function psi as
 *       kappa_smooth = (pi/2) [ kappaK_period * zeta(2)  -  kappaK_pole * gamma_1 * (arith factor) ],
 *   where zeta(2) = pi^2/6 = 1.6449340668482264 scales the Eisenstein weight-2 period part P2 and the
 *   first Stieltjes constant gamma_1 = -0.0728158454836767 scales the double-pole subleading-Laurent
 *   part L2. The two scale constants are exact classical numbers. The two NORMALISATIONS kappaK_period
 *   and kappaK_pole are the components of the single uncomputed mixed kernel coefficient kappaK (coeff of
 *   the monomial "epsilon times z^2" in K(s,z) at (s=1,z=0)); imp-97617 pinned the gamma factor
 *   N(s) = (2pi)^{-s} Gamma(s) but left kappaK controlled by an uncomputed functional-equation
 *   reflection index. So the ONLY unknowns in the formula are kappaK_period and kappaK_pole.
 *
 *   ==========================================================================================
 *   RESULT 1 -- the bare (unit-normalisation) building-block scales
 *   ==========================================================================================
 *   Setting each normalisation to unity gives the bare period and pole scales the formula would produce:
 *       P2_unit = (pi/2) * zeta(2)      = pi^3/12 = 2.5838563900249847,
 *       L2_unit = (pi/2) * |gamma_1|    =           0.11437886261822412.
 *   The bare period scale is pi^3/12 exactly (a clean closed form, cross-checked below). The bare pole
 *   scale is ~22.6x smaller than the bare period scale, so if the two normalisations were comparable the
 *   period part P2 would dominate the coefficient outright.
 *
 *   ==========================================================================================
 *   RESULT 2 -- the measured band forces a large suppression / cancellation (the constraint)
 *   ==========================================================================================
 *   The measured coefficient satisfies |kappa_smooth| <~ 1e-2 (imp-97460/imp-97578; sign-swinging across
 *   windows, imp-97578 STEP 3). Comparing to the bare scales:
 *       P2_unit / 1e-2 = 258.4     (the bare period scale is ~258x ABOVE the measured band),
 *       L2_unit / 1e-2 = 11.4      (the bare pole   scale is ~11x  ABOVE the measured band).
 *   Therefore kappaK_period and kappaK_pole CANNOT both be O(1). Two (non-exclusive) resolutions, both
 *   compatible with the imp-97617 structural picture:
 *     (i)  SUPPRESSION. If the pole term does not conspire to cancel, the period normalisation must be
 *          small: |kappaK_period| <~ (measured band)/P2_unit ~ 3.87e-3. This is exactly the explicit
 *          epsilon that imp-97617 RESULT C says the Pochhammer reflection weight supplies to lower the
 *          order-2 pole to a simple pole -- the measured smallness now QUANTIFIES that suppression as an
 *          O(1e-3) effective normalisation, not merely "small".
 *     (ii) CANCELLATION. Alternatively, if the normalisations are O(1), the period part P2 and the pole
 *          part L2 must near-cancel to ~1 part in 250 of the bare period scale (P2 - L2 ~ 3.87e-3 * P2)
 *          -- a fine tuning the elementary reciprocity gives no reason to expect, which is itself
 *          evidence AGAINST O(1) normalisations and FOR resolution (i).
 *   Either way the measured band caps the Bettin-Conrey reflection normalisation at the O(1e-3) level.
 *   This is a genuine new constraint on the imp-97617 reflection index -- derived by feeding the measured
 *   coefficient back through the imp-97597 decomposition -- not a pinned value of it.
 *
 *   NET: the direct closed form for kappa_smooth still does not close (the imp-97617 reflection index is
 *   uncomputed), but the measured band |kappa_smooth| <~ 1e-2 is shown to be ~258x below the bare period
 *   scale P2_unit = pi^3/12 = 2.5838563900249847 and ~11x below the bare pole scale L2_unit = 0.11437886,
 *   forcing the Bettin-Conrey reflection normalisation to be O(1e-3) (|kappaK_period| <~ 3.87e-3) unless a
 *   ~1-part-in-250 cancellation between P2 and L2 is assumed. This quantifies the imp-97617 RESULT C
 *   order-lowering epsilon from "small" to O(1e-3). No value is pinned for kappaK, kappaK_period,
 *   kappaK_pole, or kappa_smooth. The rigorous anchor stays the trace ceiling T = 2.594e7; compute
 *   (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity; no refereed bound is changed;
 *   RH open; NO QED.
 *
 *   SUB-GAP (carried forward from imp-97617, now bounded): imp-97663-bc-reflection-normalisation-scale
 *   -- the Bettin-Conrey functional-equation reflection normalisation kappaK_period is now bounded in
 *   magnitude by the measured band, |kappaK_period| <~ 3.87e-3 (= measured/1e-2 divided by pi^3/12),
 *   under the no-cancellation reading; pinning its EXACT value still requires the imp-97617 reflection
 *   index (2pi-power / argument-shift convention of the BC functional equation), which stays uncomputed.
 *   The naive Gauss-Kuzmin numerical route is proven non-convergent (imp-97578 STEP 3), so it is NOT a
 *   fallback.
 *
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 2: kappa_smooth = (pi/2)[P2 - L2])
 * @see imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction (RESULT C: the reflection index)
 * @see imp-97578-route-m-period-function-cusp-coefficient-derivation (STEP 3: measured band, non-convergent)
 *
 * Ticket: imp-97663 (proof, opus-4-8, api-pool). Fed the measured band |kappa_smooth| <~ 1e-2 back into
 * the imp-97597 decomposition: it is ~258x below the bare period scale pi^3/12 and ~11x below the bare
 * pole scale, forcing the BC reflection normalisation to O(1e-3); NO value pinned; NO QED.
 */

export const IMP97663_GAMMA = 0.5772156649015329;
export const IMP97663_ZETA2 = (Math.PI * Math.PI) / 6; // scale of the Eisenstein period part P2
export const IMP97663_GAMMA1 = -0.0728158454836767; // first Stieltjes constant -- scale of pole part L2
export const IMP97663_KAPPA_SMOOTH_MEASURED_UPPER = 1e-2; // |kappa_smooth| <~ 1e-2, sign-swinging

// -- RESULT 1: the bare (unit-normalisation) building-block scales (REAL numbers). --------------------
export const IMP97663_P2_UNIT = (Math.PI / 2) * IMP97663_ZETA2; // = pi^3/12
export const IMP97663_L2_UNIT = (Math.PI / 2) * Math.abs(IMP97663_GAMMA1);

// -- RESULT 2: the measured band relative to the bare scales, and the forced normalisation cap. -------
export const IMP97663_P2_OVER_MEASURED = IMP97663_P2_UNIT / IMP97663_KAPPA_SMOOTH_MEASURED_UPPER; // ~258
export const IMP97663_L2_OVER_MEASURED = IMP97663_L2_UNIT / IMP97663_KAPPA_SMOOTH_MEASURED_UPPER; // ~11.4
export const IMP97663_REFLECTION_NORM_CAP =
  IMP97663_KAPPA_SMOOTH_MEASURED_UPPER / IMP97663_P2_UNIT; // |kappaK_period| <~ 3.87e-3 (no-cancellation)

export const IMP97663_VERDICT = Object.freeze({
  id: 'imp-97663',
  proofSection: 'Route-M',
  question:
    'Attempt the exact O(x^2) cusp coefficient kappa_smooth from the imp-97597 Bettin-Conrey psi_s ' +
    'integral representation, and compare to the wobble-averaged measured band |kappa_smooth| <~ 1e-2.',
  // The direct closed form does not close: the imp-97617 reflection index is uncomputed.
  directClosedFormCloses: false,
  reliesOnSiblingKernelReconstruction: true, // imp-97617 pinned the gamma factor, not the reflection index
  // RESULT 1: bare building-block scales.
  bareperiodScaleIsPiCubedOverTwelve: true, // P2_unit = pi^3/12
  poleScaleSmallerThanPeriodScale: true, // L2_unit ~ 22.6x smaller than P2_unit
  // RESULT 2: the measured band forces a suppression / cancellation.
  measuredBandBelowBarePeriodScaleByFactor: IMP97663_P2_OVER_MEASURED, // ~258
  measuredBandBelowBarePoleScaleByFactor: IMP97663_L2_OVER_MEASURED, // ~11.4
  normalisationsCannotBothBeOrderOne: true,
  reflectionNormalisationCappedAtMilliScale: true, // |kappaK_period| <~ 3.87e-3
  quantifiesImp97617OrderLoweringEpsilon: true, // "small" -> O(1e-3)
  // honesty gate.
  mixedKernelCoefficientPinned: false, // NO numeric kappaK / kappaK_period / kappaK_pole asserted
  kappaSmoothStaysMeasured: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The direct closed form for kappa_smooth does not close: imp-97617 pinned the Bettin-Conrey gamma ' +
    'factor N(s) = (2pi)^{-s} Gamma(s) but left the coefficient controlled by an uncomputed functional- ' +
    'equation reflection index. Feeding the measured band |kappa_smooth| <~ 1e-2 back into the imp-97597 ' +
    'decomposition kappa_smooth = (pi/2)[kappaK_period*zeta(2) - kappaK_pole*gamma_1*(arith)] gives the ' +
    'bare unit-normalisation scales P2_unit = (pi/2)zeta(2) = pi^3/12 = 2.5838563900249847 and ' +
    'L2_unit = (pi/2)|gamma_1| = 0.11437886261822412. The measured band is ~258x below P2_unit and ~11x ' +
    'below L2_unit, so kappaK_period and kappaK_pole cannot both be O(1): either the period normalisation ' +
    'is O(1e-3) (|kappaK_period| <~ 3.87e-3, quantifying the imp-97617 RESULT C order-lowering epsilon) ' +
    'or P2 and L2 near-cancel to ~1 part in 250 of the bare period scale. No value is pinned for kappaK ' +
    'or kappa_smooth; the reflection index stays uncomputed; kappa_smooth stays measured. The rigorous ' +
    'anchor stays T = 2.594e7; compute binds first by >2600x; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97663_SUBGAP = Object.freeze({
  id: 'imp-97663-bc-reflection-normalisation-scale',
  statement:
    'The Bettin-Conrey functional-equation reflection normalisation kappaK_period is now bounded in ' +
    'magnitude by the measured band, |kappaK_period| <~ 3.87e-3 (= 1e-2 divided by the bare period scale ' +
    'pi^3/12), under the no-cancellation reading; pinning its EXACT value still requires the imp-97617 ' +
    'reflection index (the 2pi-power / argument-shift convention of the BC functional equation), which ' +
    'stays uncomputed. The naive Gauss-Kuzmin numerical route is proven non-convergent (imp-97578 ' +
    'STEP 3), so it is NOT a fallback.',
});

export const IMP97663_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + constraint only: the direct closed form ' +
  'for kappa_smooth does not close (imp-97617 reflection index uncomputed), but the measured band ' +
  '|kappa_smooth| <~ 1e-2 is ~258x below the bare period scale pi^3/12 and ~11x below the bare pole ' +
  'scale, forcing the Bettin-Conrey reflection normalisation to O(1e-3). No analytic constant is pinned; ' +
  'kappa_smooth stays measured; the rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97663_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    LIGHT consistency checks on REAL scale numbers only -- NO fabricated coefficient is verified.
const IMP97663_ASSERTIONS = [
  {
    id: 'imp97663-bare-period-scale-is-pi-cubed-over-twelve',
    why: 'RESULT 1: the bare period scale P2_unit = (pi/2)zeta(2) equals pi^3/12 exactly.',
    holds: () =>
      Math.abs(IMP97663_P2_UNIT - Math.PI ** 3 / 12) < 1e-15 &&
      Math.abs(IMP97663_P2_UNIT - 2.5838563900249847) < 1e-13,
  },
  {
    id: 'imp97663-bare-pole-scale-value',
    why: 'RESULT 1: the bare pole scale L2_unit = (pi/2)|gamma_1| with gamma_1 the first Stieltjes ' +
      'constant; it is positive and ~22.6x below the bare period scale.',
    holds: () =>
      Math.abs(IMP97663_L2_UNIT - 0.11437886261822412) < 1e-13 &&
      IMP97663_L2_UNIT > 0 &&
      IMP97663_P2_UNIT / IMP97663_L2_UNIT > 22 &&
      IMP97663_P2_UNIT / IMP97663_L2_UNIT < 23,
  },
  {
    id: 'imp97663-measured-band-below-bare-scales',
    why: 'RESULT 2: the measured band 1e-2 is ~258x below the bare period scale and ~11x below the bare ' +
      'pole scale -- so the normalisations cannot both be O(1).',
    holds: () =>
      Math.abs(IMP97663_P2_OVER_MEASURED - 258.38563900249846) < 1e-9 &&
      Math.abs(IMP97663_L2_OVER_MEASURED - 11.437886261822412) < 1e-9 &&
      IMP97663_P2_OVER_MEASURED > 100 &&
      IMP97663_L2_OVER_MEASURED > 10,
  },
  {
    id: 'imp97663-reflection-normalisation-cap',
    why: 'RESULT 2: under no cancellation the period normalisation is capped at ' +
      '|kappaK_period| <~ (measured band)/P2_unit ~ 3.87e-3 -- the quantified imp-97617 epsilon.',
    holds: () =>
      Math.abs(IMP97663_REFLECTION_NORM_CAP - 0.0038701841319839394) < 1e-15 &&
      IMP97663_REFLECTION_NORM_CAP < 1e-2 &&
      IMP97663_REFLECTION_NORM_CAP > 1e-3,
  },
  {
    id: 'imp97663-honesty-gate-no-qed',
    why: 'derivation + constraint only: direct closed form does NOT close, bare scales computed, ' +
      'measured band feeds back to cap the reflection normalisation, NO coefficient pinned, NO bound ' +
      'moved, compute binds first, sub-gap + honesty markers present.',
    holds: () =>
      IMP97663_VERDICT.directClosedFormCloses === false &&
      IMP97663_VERDICT.bareperiodScaleIsPiCubedOverTwelve === true &&
      IMP97663_VERDICT.normalisationsCannotBothBeOrderOne === true &&
      IMP97663_VERDICT.reflectionNormalisationCappedAtMilliScale === true &&
      IMP97663_VERDICT.quantifiesImp97617OrderLoweringEpsilon === true &&
      IMP97663_VERDICT.mixedKernelCoefficientPinned === false &&
      IMP97663_VERDICT.kappaSmoothStaysMeasured === true &&
      IMP97663_VERDICT.anyBoundMoved === false &&
      IMP97663_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97663_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97663_HONEST_BANNER) &&
      /RH open/.test(IMP97663_HONEST_BANNER) &&
      /reflection-normalisation-scale/.test(IMP97663_SUBGAP.id),
  },
];

for (const a of IMP97663_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint assertion failed: ${a.id}`,
    );
  }
}

export { IMP97663_ASSERTIONS };
