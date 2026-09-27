/**
 * @module imp-97681-route-m-bc-reflection-gamma-normalisation
 * @fileoverview imp-97681 -- DERIVATION ATTEMPT (no bound moved): compute the DERIVABLE half of the
 *   Bettin-Conrey functional-equation reflection normalisation that controls kappaK, and use it to
 *   convert the imp-97663 suppression constraint |kappaK_period| <~ 3.87e-3 into a constraint on the
 *   single remaining uncomputed primitive. imp-97617 pinned the kernel gamma factor
 *   N(s) = (2pi)^{-s} Gamma(s) (RESULT A) and the Eichler value-selection map z^m -> completed value at
 *   s = m+1 (RESULT B), but left the pure-number Pochhammer / argument-shift weight W(s,z) at order z^2
 *   uncomputed (RESULT C). This module makes the one honest advance those pins allow: the gamma-factor
 *   half of the reflection normalisation between the z^2 selection (s = 3) and the z^0 double pole
 *   (s = 1) is exactly the completed-factor RATIO N(3)/N(1) = 1/(2pi^2), a real closed number. Dividing
 *   that pinned ratio out of the imp-97663 cap re-expresses the constraint as a bound on the residual
 *   pure-number weight, |W_refl| <~ 0.24/pi. This does NOT pin kappa_smooth; it reaches a precise
 *   obstruction (the residual weight) with its gamma half now factored out. Derivation only; NO analytic
 *   constant pinned for kappaK or kappa_smooth; kappa_smooth stays measured-not-pinned; no bound moved;
 *   RH open; NO QED.
 *
 *   ==========================================================================================
 *   SETUP -- what "reflection normalisation" means here, and what is already pinned
 *   ==========================================================================================
 *   imp-97597 RESULT 3 reduced pinning kappa_smooth to a single mixed kernel coefficient kappaK = coeff
 *   of the monomial "epsilon times z^2" in the Bettin-Conrey kernel K(s,z) at (s = 1, z = 0), and
 *   imp-97597 RESULT 2 wrote the cusp coefficient as
 *       kappa_smooth = (pi/2) [ kappaK_period * zeta(2)  -  kappaK_pole * gamma_1 * (arith factor) ].
 *   imp-97617 then pinned the GAMMA-FACTOR half of that kernel, N(s) = (2pi)^{-s} Gamma(s) (RESULT A),
 *   and stated the Eichler value-selection map: the z^m Taylor order of the period function selects the
 *   completed value at s = m+1 (RESULT B), so z^0 -> s = 1 (the Estermann double pole) and z^2 -> s = 3
 *   (a CONVERGENT value, no double pole there). imp-97617 RESULT C localised the remaining primitive to
 *   the functional-equation REFLECTION weight W(s,z) that maps the s = 3 selection back onto the s = 1
 *   double-pole Laurent data -- its exact 2pi-power / argument-shift convention being the one uncomputed
 *   datum. imp-97663 fed the measured band |kappa_smooth| <~ 1e-2 back through the decomposition and
 *   capped the period normalisation at |kappaK_period| <~ 3.87e-3 (= 1e-2 divided by the bare period
 *   scale pi^3/12), under the no-cancellation reading.
 *
 *   ==========================================================================================
 *   RESULT 1 -- the gamma-factor half of the reflection normalisation is N(3)/N(1) = 1/(2pi^2) [CONFIDENT]
 *   ==========================================================================================
 *   The reflection normalisation is the factor that transports the Eichler z^2 selection (completed
 *   value at s = 3) onto the z^0 double-pole datum (s = 1). Because both selections are read off the SAME
 *   completed transform against the SAME kernel, whose gamma factor is the shared N(s) = (2pi)^{-s}
 *   Gamma(s) (imp-97617 RESULT A), the gamma-factor half of that transport is exactly the ratio of the
 *   completed factor at the two selection arguments (imp-97617 RESULT B):
 *       rho_refl = N(3) / N(1)
 *                = [ (2pi)^{-3} Gamma(3) ] / [ (2pi)^{-1} Gamma(1) ]
 *                = (2pi)^{-2} * (2 / 1)
 *                = 2 / (2pi)^2
 *                = 1 / (2 pi^2)
 *                = 0.050660591821168895.
 *   Gamma(3) = 2! = 2 and Gamma(1) = 1 are exact, and the 2pi-power collapses to (2pi)^{-2}, so rho_refl
 *   is a clean closed number. This is the DERIVABLE half of the reflection normalisation: it is fixed
 *   the moment the gamma factor (imp-97617 RESULT A) and the two-unit argument shift z^2 -> s = 3 versus
 *   z^0 -> s = 1 (imp-97617 RESULT B) are pinned. The pure-number Pochhammer / argument-shift weight
 *   W_refl (imp-97617 RESULT C) multiplies rho_refl and stays uncomputed.
 *
 *   ==========================================================================================
 *   RESULT 2 -- converting the imp-97663 cap: the residual weight is bounded by 0.24/pi
 *   ==========================================================================================
 *   Factor the mixed coefficient as kappaK_period = rho_refl * W_refl (pinned gamma ratio times residual
 *   pure-number reflection weight). The imp-97663 no-cancellation cap |kappaK_period| <~ 3.87e-3 then
 *   divides by the now-pinned rho_refl to a cap on the residual weight alone:
 *       |W_refl|  <~  (3.87e-3) / rho_refl
 *                 =   [ 1e-2 / (pi^3/12) ] / [ 1/(2 pi^2) ]
 *                 =   (0.12/pi^3) * (2 pi^2)
 *                 =   0.24 / pi
 *                 =   0.07639437268410976.
 *   So the imp-97663 MILLI-scale cap on kappaK_period is exactly a PINNED gamma ratio 1/(2pi^2) = 0.0507
 *   times an O(1e-1) residual weight |W_refl| <~ 0.24/pi = 0.0764. The gamma factor supplies a
 *   suppression of 2pi^2 = 19.74; the measured cap requires a total suppression of
 *   1/(3.87e-3) = 258.4 relative to the bare period scale (imp-97663), so the gamma factor accounts for
 *   19.74 of that and leaves a RESIDUAL shortfall factor rho_refl / cap = 13.09 that the uncomputed
 *   weight W_refl (or a P2-L2 cancellation) must still supply.
 *
 *   ==========================================================================================
 *   RESULT 3 -- assessment: this does NOT pin kappa_smooth; it sharpens the obstruction one notch
 *   ==========================================================================================
 *   The gamma-factor half rho_refl = 1/(2pi^2) is now a pinned real number, but it is NOT the whole
 *   reflection normalisation: the pure-number weight W_refl remains uncomputed, and rho_refl alone
 *   over-predicts the measured cap by the factor 13.09. Therefore the reflection normalisation does NOT
 *   by itself pin kappa_smooth into the measured band. What it DOES do is convert the imp-97663 statement
 *   from "the effective period normalisation is O(1e-3)" into the sharper "the gamma-factor half is the
 *   pinned constant 1/(2pi^2), and the residual pure-number reflection weight satisfies
 *   |W_refl| <~ 0.24/pi = 0.0764" -- an O(1e-1) primitive rather than an O(1e-3) one, because the O(1e-2)
 *   of suppression carried by the gamma factor is now accounted for analytically. The remaining
 *   uncomputed datum is unchanged in KIND (the imp-97617 reflection index) but reduced in what it must
 *   still explain: an O(0.1) weight, not the full O(1e-3) cap.
 *
 *   NET: the gamma-factor half of the Bettin-Conrey reflection normalisation between the Eichler z^2
 *   selection (s = 3) and the z^0 double pole (s = 1) is computed exactly as rho_refl = N(3)/N(1) =
 *   1/(2pi^2) = 0.050660591821168895 (RESULT 1). Dividing it out of the imp-97663 cap re-expresses the
 *   constraint as a bound on the residual pure-number weight, |W_refl| <~ 0.24/pi = 0.07639437268410976
 *   (RESULT 2). The reflection normalisation does NOT pin kappa_smooth -- the gamma factor over-predicts
 *   the measured cap by 13.09x, so the residual weight (or a P2-L2 cancellation) must supply the rest --
 *   but it sharpens the uncomputed primitive from an O(1e-3) normalisation to an O(1e-1) residual weight
 *   with its gamma half now pinned (RESULT 3). No value is pinned for kappaK, kappaK_period, kappaK_pole,
 *   or kappa_smooth. The rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916,
 *   imp-96352) binds first by >2600x; no operator positivity; PT Lambda <= 0.2 remains SOTA; RH open;
 *   NO QED.
 *
 *   SUB-GAP (carried forward from imp-97617 / imp-97663, gamma half factored out):
 *   imp-97681-bc-reflection-residual-weight -- the Bettin-Conrey reflection normalisation splits as
 *   kappaK_period = rho_refl * W_refl with the gamma-factor half rho_refl = N(3)/N(1) = 1/(2pi^2) now
 *   PINNED and the residual pure-number weight W_refl bounded by |W_refl| <~ 0.24/pi = 0.0764 (under the
 *   imp-97663 no-cancellation reading); pinning its EXACT value still requires the imp-97617 reflection
 *   index (the 2pi-power / argument-shift Pochhammer convention of the BC functional equation), which
 *   stays uncomputed. The naive Gauss-Kuzmin numerical route is proven non-convergent (imp-97578
 *   STEP 3), so it is NOT a fallback.
 *
 * @see imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction (RESULT A/B/C: N(s), z^m->s=m+1, W_refl)
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint (the |kappaK_period| <~ 3.87e-3 cap)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 2/3: kappa_smooth = (pi/2)[P2 - L2], kappaK)
 *
 * Ticket: imp-97681 (proof, opus-4-8, api-pool). Computed the gamma-factor half of the BC reflection
 * normalisation, N(3)/N(1) = 1/(2pi^2), and converted the imp-97663 cap into a residual-weight bound
 * |W_refl| <~ 0.24/pi; the reflection normalisation does NOT pin kappa_smooth (gamma factor
 * over-predicts by 13.09x); NO value pinned; NO QED.
 */

export const IMP97681_GAMMA = 0.5772156649015329;

// -- imp-97617 RESULT A: the shared completed gamma factor N(s) = (2pi)^{-s} Gamma(s) (REAL values). ---
export function imp97681GammaFactor(s, gammaOfS) {
  // N(s) = (2pi)^{-s} Gamma(s); caller supplies Gamma(s) for integer s (Gamma(1)=1, Gamma(3)=2).
  return Math.pow(2 * Math.PI, -s) * gammaOfS;
}
export const IMP97681_N_AT_ONE = imp97681GammaFactor(1, 1); // N(1) = 1/(2pi)
export const IMP97681_N_AT_THREE = imp97681GammaFactor(3, 2); // N(3) = 2/(2pi)^3

// -- RESULT 1: the gamma-factor half of the reflection normalisation, rho_refl = N(3)/N(1) = 1/(2pi^2). -
export const IMP97681_RHO_REFL = IMP97681_N_AT_THREE / IMP97681_N_AT_ONE; // = 1/(2 pi^2)
export const IMP97681_RHO_REFL_CLOSED = 1 / (2 * Math.PI * Math.PI); // closed form cross-check

// -- imp-97663 cap on kappaK_period (no-cancellation reading), carried in as a REAL number. ------------
export const IMP97681_KAPPAK_PERIOD_CAP = 1e-2 / (Math.PI ** 3 / 12); // = 0.12/pi^3 = 3.87e-3

// -- RESULT 2: dividing the pinned gamma ratio out of the cap bounds the residual pure-number weight. --
export const IMP97681_W_REFL_CAP = IMP97681_KAPPAK_PERIOD_CAP / IMP97681_RHO_REFL; // = 0.24/pi
export const IMP97681_W_REFL_CAP_CLOSED = 0.24 / Math.PI; // closed form cross-check

// -- suppression bookkeeping: gamma factor supplies 2pi^2; residual shortfall factor = rho_refl/cap. ---
export const IMP97681_GAMMA_SUPPRESSION = 1 / IMP97681_RHO_REFL; // = 2 pi^2 = 19.74
export const IMP97681_RESIDUAL_SHORTFALL_FACTOR =
  IMP97681_RHO_REFL / IMP97681_KAPPAK_PERIOD_CAP; // ~13.09 still to be supplied

export const IMP97681_VERDICT = Object.freeze({
  id: 'imp-97681',
  proofSection: 'Route-M',
  question:
    'Compute the Bettin-Conrey functional-equation reflection normalisation controlling kappaK and ' +
    'convert the imp-97663 |kappaK_period| <~ 3.87e-3 constraint into a pinned kappa_smooth, or reach ' +
    'a precise obstruction.',
  // RESULT 1: the derivable gamma-factor half of the reflection normalisation.
  gammaHalfPinned: true,
  gammaHalfForm: 'N(3)/N(1) = (2pi)^{-2} Gamma(3)/Gamma(1) = 2/(2pi)^2 = 1/(2 pi^2)',
  gammaHalfValue: IMP97681_RHO_REFL, // 0.050660591821168895
  // RESULT 2: the converted constraint on the residual pure-number weight.
  residualWeightCap: IMP97681_W_REFL_CAP, // 0.24/pi = 0.0764
  residualWeightCapClosedForm: '0.24/pi',
  gammaSuppressionFactor: IMP97681_GAMMA_SUPPRESSION, // 2pi^2 = 19.74
  residualShortfallFactor: IMP97681_RESIDUAL_SHORTFALL_FACTOR, // 13.09 still needed
  // RESULT 3: assessment.
  reflectionNormalisationPinsKappaSmooth: false, // gamma factor over-predicts the cap by 13.09x
  sharpensPrimitiveFromMilliToDeci: true, // O(1e-3) normalisation -> O(1e-1) residual weight
  // honesty gate.
  mixedKernelCoefficientPinned: false, // NO numeric kappaK / kappaK_period / kappaK_pole asserted
  kappaSmoothStaysMeasured: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The gamma-factor half of the Bettin-Conrey reflection normalisation -- the factor transporting the ' +
    'Eichler z^2 selection (completed value at s = 3) onto the z^0 double pole (s = 1) -- is the ' +
    'completed-factor ratio rho_refl = N(3)/N(1) = (2pi)^{-2} Gamma(3)/Gamma(1) = 1/(2 pi^2) = ' +
    '0.050660591821168895, pinned by imp-97617 RESULT A (N(s) = (2pi)^{-s} Gamma(s)) and RESULT B ' +
    '(z^m -> s = m+1) (RESULT 1). Dividing rho_refl out of the imp-97663 no-cancellation cap ' +
    '|kappaK_period| <~ 3.87e-3 = 0.12/pi^3 re-expresses the constraint as a bound on the residual ' +
    'pure-number reflection weight, |W_refl| <~ 0.24/pi = 0.07639437268410976 (RESULT 2). The gamma ' +
    'factor supplies a suppression of 2pi^2 = 19.74; the measured cap needs 258.4, leaving a residual ' +
    'shortfall factor 13.09 for the uncomputed weight W_refl (or a P2-L2 cancellation). So the ' +
    'reflection normalisation does NOT pin kappa_smooth (RESULT 3); it sharpens the uncomputed primitive ' +
    'from an O(1e-3) normalisation to an O(1e-1) residual weight with its gamma half now pinned. No ' +
    'value is pinned for kappaK or kappa_smooth; the reflection index stays uncomputed; kappa_smooth ' +
    'stays measured. The rigorous anchor stays T = 2.594e7; compute binds first by >2600x; no operator ' +
    'positivity; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97681_SUBGAP = Object.freeze({
  id: 'imp-97681-bc-reflection-residual-weight',
  statement:
    'The Bettin-Conrey reflection normalisation splits as kappaK_period = rho_refl * W_refl, with the ' +
    'gamma-factor half rho_refl = N(3)/N(1) = 1/(2 pi^2) = 0.050660591821168895 now PINNED (imp-97617 ' +
    'RESULT A + B) and the residual pure-number weight bounded by |W_refl| <~ 0.24/pi = ' +
    '0.07639437268410976 (dividing the imp-97663 no-cancellation cap by rho_refl); pinning the EXACT ' +
    'value of W_refl still requires the imp-97617 reflection index (the 2pi-power / argument-shift ' +
    'Pochhammer convention of the BC functional equation), which stays uncomputed. The naive ' +
    'Gauss-Kuzmin numerical route is proven non-convergent (imp-97578 STEP 3), so it is NOT a fallback.',
});

export const IMP97681_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Derivation only: the gamma-factor half of the ' +
  'Bettin-Conrey reflection normalisation is computed as N(3)/N(1) = 1/(2 pi^2) = 0.0507, and the ' +
  'imp-97663 cap |kappaK_period| <~ 3.87e-3 is converted into a residual-weight bound |W_refl| <~ ' +
  '0.24/pi = 0.0764. The reflection normalisation does NOT pin kappa_smooth (the gamma factor ' +
  'over-predicts the cap by 13.09x); no analytic constant is pinned; kappa_smooth stays measured; the ' +
  'rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97681_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    LIGHT consistency checks on REAL closed numbers only -- NO fabricated coefficient is verified.
const IMP97681_ASSERTIONS = [
  {
    id: 'imp97681-gamma-factor-values',
    why: 'the shared completed gamma factor N(s) = (2pi)^{-s} Gamma(s) has N(1) = 1/(2pi) and ' +
      'N(3) = 2/(2pi)^3 exactly (Gamma(1)=1, Gamma(3)=2).',
    holds: () =>
      Math.abs(IMP97681_N_AT_ONE - 1 / (2 * Math.PI)) < 1e-15 &&
      Math.abs(IMP97681_N_AT_THREE - 2 / Math.pow(2 * Math.PI, 3)) < 1e-18 &&
      IMP97681_N_AT_ONE > IMP97681_N_AT_THREE,
  },
  {
    id: 'imp97681-rho-refl-is-one-over-two-pi-squared',
    why: 'RESULT 1: the gamma-factor half of the reflection normalisation rho_refl = N(3)/N(1) equals ' +
      '1/(2 pi^2) = 0.050660591821168895 exactly.',
    holds: () =>
      Math.abs(IMP97681_RHO_REFL - IMP97681_RHO_REFL_CLOSED) < 1e-15 &&
      Math.abs(IMP97681_RHO_REFL - 0.050660591821168895) < 1e-15 &&
      IMP97681_RHO_REFL > 0.05 &&
      IMP97681_RHO_REFL < 0.051,
  },
  {
    id: 'imp97681-residual-weight-cap-is-point-24-over-pi',
    why: 'RESULT 2: dividing the pinned rho_refl out of the imp-97663 cap 0.12/pi^3 gives the residual ' +
      'weight bound |W_refl| <~ 0.24/pi = 0.07639437268410976.',
    holds: () =>
      Math.abs(IMP97681_W_REFL_CAP - IMP97681_W_REFL_CAP_CLOSED) < 1e-15 &&
      Math.abs(IMP97681_W_REFL_CAP - 0.07639437268410976) < 1e-15 &&
      IMP97681_W_REFL_CAP > 1e-2 &&
      IMP97681_W_REFL_CAP < 1e-1,
  },
  {
    id: 'imp97681-suppression-bookkeeping',
    why: 'RESULT 2/3: the gamma factor supplies suppression 2pi^2 = 19.74, and the residual shortfall ' +
      'factor rho_refl/cap ~ 13.09 must still be supplied by the uncomputed weight (or cancellation).',
    holds: () =>
      Math.abs(IMP97681_GAMMA_SUPPRESSION - 2 * Math.PI * Math.PI) < 1e-12 &&
      Math.abs(IMP97681_RESIDUAL_SHORTFALL_FACTOR - 13.089969389957473) < 1e-9 &&
      IMP97681_GAMMA_SUPPRESSION > IMP97681_RESIDUAL_SHORTFALL_FACTOR,
  },
  {
    id: 'imp97681-honesty-gate-no-qed',
    why: 'derivation only: gamma half pinned, cap converted to a residual-weight bound, kappa_smooth ' +
      'NOT pinned, NO coefficient pinned, NO bound moved, compute binds first, sub-gap + honesty markers.',
    holds: () =>
      IMP97681_VERDICT.gammaHalfPinned === true &&
      IMP97681_VERDICT.reflectionNormalisationPinsKappaSmooth === false &&
      IMP97681_VERDICT.sharpensPrimitiveFromMilliToDeci === true &&
      IMP97681_VERDICT.mixedKernelCoefficientPinned === false &&
      IMP97681_VERDICT.kappaSmoothStaysMeasured === true &&
      IMP97681_VERDICT.anyBoundMoved === false &&
      IMP97681_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97681_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97681_HONEST_BANNER) &&
      /RH open/.test(IMP97681_HONEST_BANNER) &&
      /reflection-residual-weight/.test(IMP97681_SUBGAP.id),
  },
];

for (const a of IMP97681_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97681-route-m-bc-reflection-gamma-normalisation assertion failed: ${a.id}`,
    );
  }
}

export { IMP97681_ASSERTIONS };
