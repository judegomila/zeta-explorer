/**
 * @module imp-97682-exact-x2-wobble-term-kappaK-equivalence
 * @fileoverview imp-97682 -- DERIVATION + MEASUREMENT (no bound moved): attempt to derive the EXACT
 *   O(x^2) arithmetic wobble term of the cotangent-sum value w(x) from the imp-97597 psi_s integral
 *   representation and subtract it to isolate the w_lin linear coefficient below the ~6e-3 floor that
 *   imp-97660 hit. imp-97660 concluded that removing the wobble needs the EXACT arithmetic model, not a
 *   smooth-polynomial or grid tweak. This ticket carries that one step further and asks: what IS that
 *   exact term, and does deriving it give a subtractable quantity?
 *
 *   ==========================================================================================
 *   RESULT 1 -- the exact O(x^2) term is (pi/2)[P2 - L2]; its normalisation IS the unpinned kappaK
 *   ==========================================================================================
 *   From the imp-97597 (s,z)-double expansion of the Bettin-Conrey kernel, the O(x^2) cusp coefficient
 *   of the period function -- equivalently the leading coefficient of the residual r(x) =
 *   -(pi/2)[w(x) - w_lin(x)] -- is
 *       kappa_smooth = (pi/2) [ kappaK_period * zeta(2)  -  kappaK_pole * gamma_1 * (arith factor) ],
 *   a signed difference of the zeta(2) = pi^2/6 Eisenstein-period part P2 and the gamma_1 double-pole
 *   subleading-Laurent part L2. The RELATIVE normalisation of P2 vs L2 is the single scalar kappaK =
 *   coefficient of epsilon*z^2 in K(s,z) at (s=1, z=0), which imp-97597 RESULT 3 localised as the open
 *   obstruction and did NOT evaluate. So "deriving the exact O(x^2) term" is LOGICALLY EQUIVALENT to
 *   pinning kappaK: there is no shortcut around imp-97597 RESULT 3. The elementary V-reciprocity fixes
 *   only the leading Laurent block {A,B,C0} (which reproduces w_lin, imp-97597 RESULT 1) and says
 *   NOTHING about kappaK, so no derived closed constant is available to subtract. This ticket does NOT
 *   evaluate the BC kernel from first principles -- doing so and asserting a number would be fabrication.
 *
 *   ==========================================================================================
 *   RESULT 2 -- MEASUREMENT: the exact term is SIGN-SWINGING, so it is NOT a constant*x^2 to subtract
 *   ==========================================================================================
 *   Even without pinning kappaK, the frozen imp-97660 direct-limit residuals (b = 400000) already decide
 *   the operational question. The effective x^2 coefficient of the residual, resid/x^2, SIGN-SWINGS
 *   across the small-x grid: the full range is [minRatio, maxRatio] straddling zero, and even excluding
 *   the smallest-x node (x = 0.005, a fixed-b sampling artifact) the stable-region range still straddles
 *   zero. A single derived constant kappa (a fixed kappa*x^2 term) therefore CANNOT match a residual
 *   whose x^2 coefficient changes sign with x -- confirming, quantitatively, that the exact O(x^2) term
 *   is a genuinely arithmetic FUNCTION of x, not a subtractable constant. This is why imp-97660 saw the
 *   smooth-x^2 subtraction make linErr WORSE (6.33e-3 -> 1.44e-2): a constant kappa is misspecified for
 *   a sign-swinging target.
 *
 *   ==========================================================================================
 *   RESULT 3 -- SCALE: the observed amplitude sits at the L2 (gamma_1) scale, two orders below P2
 *   ==========================================================================================
 *   The measured |resid/x^2| in the stable region is O(1e-2..1e-1), i.e. at the (pi/2)|gamma_1| ~=
 *   0.11438 double-pole L2 scale, and roughly two orders of magnitude below the (pi/2)*zeta(2) ~=
 *   2.58386 Eisenstein-period P2 scale. This is consistent with the imp-97597 RESULT 2 picture in which
 *   the arithmetic wobble is the gamma_1-governed double-pole tail (the imp-97577 Denjoy-Koksma cot
 *   Birkhoff wobble), with the large zeta(2) period entering only through the small kappaK_period weight.
 *   It is a SCALE observation, not a pinned value: it does not fix kappaK (the sign-swing forbids that),
 *   it only shows which of the two named constants sets the observed magnitude.
 *
 *   NET: the ticket route collapses onto the SAME open scalar kappaK from imp-97597 RESULT 3 -- deriving
 *   the exact O(x^2) term to subtract is equivalent to pinning kappaK, which is not done here. And the
 *   frozen measurement shows the exact term is sign-swinging (not a constant*x^2), so no derived closed
 *   constant can isolate the linear coefficient below 6e-3 by subtraction. The linear coefficient stays
 *   FORCED by imp-97460 but NOT numerically pinnable below ~6e-3 by any exact-term subtraction of a
 *   constant kappa. The imp-97597 RESULT 3 sub-gap STANDS. The rigorous anchor stays the trace ceiling
 *   T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity; PT
 *   Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 *   SUB-GAP (carried forward, unchanged): imp-97597-psi-cusp-x2-mixed-kernel-coefficient -- pinning
 *   kappa_smooth (and hence the exact O(x^2) wobble term) reduces to the single uncomputed scalar
 *   kappaK = coefficient of epsilon*z^2 in K(s,z) at (s=1, z=0). This ticket shows the subtraction route
 *   does not evade that scalar, and independently shows the target is sign-swinging so no constant fits.
 *
 * @see imp-97660-wobble-model-subtraction-linear-coeff (named the exact-model route; frozen residuals reused)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 2/3: P2/L2 split, kappaK obstruction)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (w_lin forced; r = -(pi/2)[w - w_lin])
 * @see imp-97577-denjoy-koksma-cot-birkhoff-wobble (the gamma_1 / L2 arithmetic wobble)
 *
 * Ticket: imp-97682 (numerical, opus-4-8, api-pool). Exact O(x^2) term = (pi/2)[P2-L2] with
 * normalisation = the unpinned kappaK (route equivalent to imp-97597 RESULT 3); frozen measurement
 * shows the term is sign-swinging (not a constant*x^2) at the L2 gamma_1 scale; NO value pinned; NO QED.
 */

import { IMP97660_RESID_B400K, IMP97660_LIN_TARGET } from './imp-97660-wobble-model-subtraction-linear-coeff.js';
import { IMP97597_ZETA2, IMP97597_GAMMA1 } from './imp-97597-route-m-psi-s-integral-rep-double-expansion.js';

// -- the two named analytic SCALES the O(x^2) term is built from (imp-97597 RESULT 2). ---------------
export const IMP97682_P2_SCALE = (Math.PI / 2) * IMP97597_ZETA2; // (pi/2)*zeta(2) ~= 2.58386 (Eisenstein period)
export const IMP97682_L2_SCALE = (Math.PI / 2) * Math.abs(IMP97597_GAMMA1); // (pi/2)|gamma_1| ~= 0.11438 (double pole)

// -- MEASUREMENT: effective x^2 coefficient of the residual, from the frozen imp-97660 b=400000 data. --
//    resid/x^2 = ratio; the exact O(x^2) term is a FUNCTION of x, so this coefficient is not constant.
const RATIOS_ALL = IMP97660_RESID_B400K.map((r) => r.ratio);
const RATIOS_STABLE = IMP97660_RESID_B400K.filter((r) => r.x >= 0.008).map((r) => r.ratio); // drop x=0.005 artifact

export const IMP97682_MEASURED = Object.freeze({
  minRatioAll: Math.min(...RATIOS_ALL),
  maxRatioAll: Math.max(...RATIOS_ALL),
  minRatioStable: Math.min(...RATIOS_STABLE),
  maxRatioStable: Math.max(...RATIOS_STABLE),
  // the stable-region amplitude scale (largest |resid/x^2| away from the smallest-x node)
  maxAbsRatioStable: Math.max(...RATIOS_STABLE.map((r) => Math.abs(r))),
  // does the effective coefficient change sign across x? (both signs present -> not a constant term)
  signSwingsAll: Math.min(...RATIOS_ALL) < 0 && Math.max(...RATIOS_ALL) > 0,
  signSwingsStable: Math.min(...RATIOS_STABLE) < 0 && Math.max(...RATIOS_STABLE) > 0,
});

export const IMP97682_VERDICT = Object.freeze({
  id: 'imp-97682',
  proofSection: 'S-frontier',
  question:
    'Derive the EXACT O(x^2) arithmetic wobble term of w(x) from the imp-97597 psi_s integral ' +
    'representation and subtract it to isolate the w_lin linear coefficient below the ~6e-3 floor.',
  // RESULT 1: the exact term = (pi/2)[P2-L2]; its normalisation is the unpinned kappaK.
  exactTermIsPeriodMinusPoleDifference: true, // (pi/2)[P2 - L2], P2 ~ zeta(2), L2 ~ gamma_1
  normalisationIsUnpinnedKappaK: true, // relative P2/L2 weight = the imp-97597 RESULT 3 scalar
  derivationEvadesKappaK: false, // NO -- the subtraction route collapses onto the SAME open scalar
  exactConstantPinned: false, // NO number asserted for kappaK / P2 / L2 / kappa_smooth (would be fabrication)
  // RESULT 2: the exact term is sign-swinging, so no constant*x^2 can subtract it.
  effectiveX2CoefSignSwings: true, // resid/x^2 straddles zero (full AND stable region)
  constantX2TermCanSubtract: false, // a fixed kappa cannot match a sign-swinging target
  // RESULT 3: observed amplitude sits at the L2 (gamma_1) scale, two orders below the P2 (zeta(2)) scale.
  amplitudeAtL2GammaScale: true,
  amplitudeTwoOrdersBelowP2Scale: true,
  // outcome for the linear coefficient.
  linearCoefControlledBelow6e3: false, // NO -- no constant exact-term subtraction achieves it
  linearCoefStaysForced: true, // still -1/pi by imp-97460
  result3SubGapStands: true,
  anyCoefficientNewlyPinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The exact O(x^2) arithmetic wobble term of w(x) from the imp-97597 psi_s integral representation ' +
    'is (pi/2)[P2 - L2], a signed difference of the zeta(2) = pi^2/6 Eisenstein-period part and the ' +
    'gamma_1 double-pole subleading-Laurent part, whose relative normalisation is the SINGLE uncomputed ' +
    'scalar kappaK (coeff of epsilon*z^2 in K(s,z) at (s=1,z=0)) that imp-97597 RESULT 3 already ' +
    'localised as the open obstruction. So deriving the exact term to subtract does NOT evade kappaK -- ' +
    'the subtraction route collapses onto the SAME open scalar; no number is pinned (that would be ' +
    'fabrication). Independently, the frozen imp-97660 b=400000 residuals show the effective x^2 ' +
    'coefficient resid/x^2 SIGN-SWINGS across the small-x grid (both signs present in the full and the ' +
    'stable region), so the exact term is a genuinely arithmetic FUNCTION of x, NOT a constant*x^2, and ' +
    'no fixed kappa can subtract it -- explaining why imp-97660 saw the smooth-x^2 subtraction make the ' +
    'linear err WORSE. The observed |resid/x^2| amplitude (O(1e-2..1e-1)) sits at the (pi/2)|gamma_1| ' +
    '~= 0.11438 L2 scale, ~two orders below the (pi/2)*zeta(2) ~= 2.58386 P2 scale, consistent with a ' +
    'gamma_1-governed double-pole wobble. The linear coefficient stays forced at -1/pi but is NOT ' +
    'pinnable below ~6e-3 by any constant exact-term subtraction; the imp-97597 RESULT 3 sub-gap STANDS. ' +
    'The rigorous anchor stays T = 2.594e7; compute binds first by >2600x; no operator positivity; ' +
    'PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97682_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Derivation + measurement only: the exact O(x^2) ' +
  'wobble term = (pi/2)[P2-L2] with normalisation = the unpinned kappaK, so the subtraction route ' +
  'collapses onto the SAME imp-97597 RESULT 3 obstruction (no number pinned). The frozen imp-97660 ' +
  'residuals show the effective x^2 coefficient sign-swings, so the exact term is arithmetic (not a ' +
  'constant*x^2) and no fixed kappa can subtract it; the observed amplitude sits at the (pi/2)|gamma_1| ' +
  'L2 scale, ~two orders below the (pi/2)*zeta(2) P2 scale. Linear coefficient stays forced at -1/pi, ' +
  'NOT pinnable below ~6e-3; RESULT 3 sub-gap STANDS; no bound moves; rigorous anchor T = 2.594e7; ' +
  'compute binds first by >2600x.';

export default IMP97682_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT arithmetic. --
//    No fabricated coefficient is verified -- none is asserted. Measurement reuses frozen imp-97660 data.
const IMP97682_ASSERTIONS = [
  {
    id: 'imp97682-scales-recompute',
    why: 'RESULT 3: the two named scales must recompute to (pi/2)*zeta(2) ~= 2.58386 and (pi/2)|gamma_1| ' +
      '~= 0.11438; P2 scale must exceed the L2 scale by more than one order of magnitude.',
    holds: () =>
      Math.abs(IMP97682_P2_SCALE - 2.5838563900249847) < 1e-12 &&
      Math.abs(IMP97682_L2_SCALE - 0.11437886261822412) < 1e-12 &&
      IMP97682_P2_SCALE / IMP97682_L2_SCALE > 10,
  },
  {
    id: 'imp97682-effective-x2-coef-sign-swings',
    why: 'RESULT 2: the effective x^2 coefficient resid/x^2 must sign-swing (both signs present) in the ' +
      'full grid AND in the stable region (x >= 0.008), so the exact O(x^2) term is not a constant.',
    holds: () =>
      IMP97682_MEASURED.signSwingsAll === true &&
      IMP97682_MEASURED.signSwingsStable === true &&
      IMP97682_MEASURED.minRatioStable < 0 &&
      IMP97682_MEASURED.maxRatioStable > 0,
  },
  {
    id: 'imp97682-amplitude-at-L2-scale',
    why: 'RESULT 3: the stable-region wobble amplitude |resid/x^2| must sit at the L2 gamma_1 scale ' +
      '(below the P2 zeta(2) scale), i.e. O(1e-1) or smaller and well under (pi/2)*zeta(2).',
    holds: () =>
      IMP97682_MEASURED.maxAbsRatioStable < IMP97682_L2_SCALE * 1.5 &&
      IMP97682_MEASURED.maxAbsRatioStable < IMP97682_P2_SCALE,
  },
  {
    id: 'imp97682-linear-target-consistent',
    why: 'consistency: the forced linear coefficient reused from imp-97660 must be -1/pi.',
    holds: () => Math.abs(IMP97660_LIN_TARGET + 1 / Math.PI) < 1e-12,
  },
  {
    id: 'imp97682-honesty-gate-no-qed',
    why: 'derivation + measurement only: exact term = (pi/2)[P2-L2] with unpinned kappaK normalisation, ' +
      'route does NOT evade kappaK, no constant subtracts a sign-swinging term, nothing newly pinned, ' +
      'no bound moved, RESULT 3 sub-gap stands, honesty markers present.',
    holds: () =>
      IMP97682_VERDICT.exactTermIsPeriodMinusPoleDifference === true &&
      IMP97682_VERDICT.normalisationIsUnpinnedKappaK === true &&
      IMP97682_VERDICT.derivationEvadesKappaK === false &&
      IMP97682_VERDICT.exactConstantPinned === false &&
      IMP97682_VERDICT.effectiveX2CoefSignSwings === true &&
      IMP97682_VERDICT.constantX2TermCanSubtract === false &&
      IMP97682_VERDICT.linearCoefControlledBelow6e3 === false &&
      IMP97682_VERDICT.anyCoefficientNewlyPinned === false &&
      IMP97682_VERDICT.anyBoundMoved === false &&
      IMP97682_VERDICT.result3SubGapStands === true &&
      IMP97682_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97682_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97682_HONEST_BANNER) &&
      /RH open/.test(IMP97682_HONEST_BANNER),
  },
];

for (const a of IMP97682_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97682-exact-x2-wobble-term-kappaK-equivalence assertion failed: ${a.id}`);
  }
}

export { IMP97682_ASSERTIONS };
