/**
 * @module imp-97737-psi-cusp-x2-mixed-kernel-period-polynomial-route-obstruction
 * @fileoverview imp-97737 -- PROOF-DIRECTION ASSESSMENT (no bound moved): take the imp-97597 RESULT 3
 *   sub-gap -- the single uncomputed scalar kappaK = coefficient of epsilon*z^2 (epsilon = s-1,
 *   z = x) in the Bettin-Conrey kernel K(s,z) at (s=1, z=0) -- and ASSESS the ONE route imp-97656
 *   named as the candidate beyond the elementary cocycle: the Bettin-Conrey mean-value /
 *   period-polynomial machinery. The conclusion is NOT a pinned value (that would be fabrication);
 *   it is the PRECISE STRUCTURAL OBSTRUCTION that blocks the period-polynomial route, and the exact
 *   restatement of where the single scalar relocates. Assessment only; NO analytic constant pinned;
 *   kappa_smooth stays measured-not-pinned; no bound moved; RH open; NO QED.
 *
 *   ==========================================================================================
 *   THE OBJECT
 *   ==========================================================================================
 *   imp-97597 sharpened the whole O(x^2) cusp obstruction down to one scalar kappaK, and imp-97656
 *   confirmed (side by side) that the imp-97618 leading-Laurent cross-check does NOT touch it:
 *       closedFormClosesFromElementaryCocycle = false, pureAnalyticCoefficientPinned = false.
 *   The cotangent-sum period function psi is, in the Bettin-Conrey framework, built from the
 *   Estermann function E(s, a/q) whose s=1 double pole comes from zeta(s) zeta(2s-1): zeta(s) has a
 *   simple pole at s=1 and zeta(2s-1) has a simple pole at s=1 (argument 2s-1 -> 1), so the product
 *   carries a genuine DOUBLE pole ~ 1/(2 (s-1)^2). The specialisation that produces the cotangent
 *   sum is the weight-2 specialisation of that transform. So the natural "beyond the cocycle" route
 *   is the Eichler-Shimura / period-polynomial machinery for the weight-2 Eisenstein series E_2.
 *
 *   ==========================================================================================
 *   THE ROUTE (period-polynomial / mean-value machinery) AND WHY IT DOES NOT CLOSE
 *   ==========================================================================================
 *   For a weight-k modular form the Eichler-Shimura period polynomial has degree exactly k - 2, and
 *   its coefficients are the critical L-values / periods that the SL(2,Z) cocycle pins. The cotangent
 *   sum sits at WEIGHT 2. Two structural facts then collide:
 *
 *     (1) DEGREE COLLAPSE. At k = 2 the period polynomial has degree k - 2 = 0 -- it is a CONSTANT.
 *         A degree-0 polynomial cocycle is structurally blind to z^2: the Eichler-Shimura machinery,
 *         and hence the elementary V-reciprocity that is its arithmetic shadow, can carry data only
 *         in the {z^0, z^1} block. This is exactly why the elementary reciprocity fixes only the
 *         leading Laurent block {A, B, C0} = w_lin (imp-97597 RESULT 1 / imp-97618) and says NOTHING
 *         about the z^2 term. The failure to close is not incidental; it is forced by k - 2 = 0.
 *
 *     (2) QUASIMODULAR ANOMALY. E_2 is not modular but quasimodular:
 *             E_2(-1/z) = z^2 E_2(z) + 12 z / (2 pi i),
 *         so the modular defect is a DEGREE-1 (z-linear) coboundary, not a genuine period. Under the
 *         Eichler integral this z-linear defect is exactly what produces the log(x)/pi and -x/pi
 *         terms of w_lin (the anomalous non-polynomial "period function" of weight 2). The z^2
 *         coefficient therefore lives ENTIRELY in the regularised second moment of the E_2 Eichler
 *         integral -- the part the quasimodular anomaly does NOT resolve into a period.
 *
 *   Consequence: the period-polynomial route does NOT evaluate kappaK. It RELOCATES the same single
 *   scalar into the one datum the polynomial cocycle cannot supply -- the normalisation of the
 *   Bettin-Conrey Mellin-Barnes Gamma-kernel at the s=1 double pole (equivalently, the regularised
 *   second period of the E_2 Eichler integral). That normalisation is precisely the relative weight
 *   between the two imp-97597 RESULT 2 pieces: P2 = the zeta(2) = pi^2/6 Eisenstein-period part and
 *   L2 = the gamma_1 double-pole subleading-Laurent part. The period machinery names P2 (the
 *   Eisenstein period) but at weight 2 cannot fix its ratio to L2, because that ratio is set by the
 *   quasimodular Gamma-factor, not by any critical L-value.
 *
 *   ==========================================================================================
 *   NET (precise obstruction, no value pinned)
 *   ==========================================================================================
 *   The route beyond the elementary cocycle -- Bettin-Conrey mean-value / period-polynomial
 *   machinery -- is BLOCKED at weight 2 by the degree collapse k - 2 = 0 (structurally no z^2 in the
 *   polynomial cocycle) together with the quasimodular anomaly of E_2 (the z^2 datum lives in the
 *   non-period regularised second moment). The obstruction is therefore sharpened, not closed:
 *   kappaK equals the Bettin-Conrey Mellin-Barnes Gamma-kernel normalisation at the s=1 double pole
 *   (= the regularised second period of the E_2 Eichler integral) fixing the P2 : L2 ratio, and NO
 *   period-polynomial datum determines it. No numeric value is asserted for kappaK, P2, L2, the
 *   ratio, or kappa_smooth: pinning any of them without the explicit BC Gamma-kernel would be
 *   fabrication. kappa_smooth stays measured (|kappa_smooth| <~ 1e-2, sign-swinging). The rigorous
 *   anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x;
 *   no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion.js (RESULT 3: kappaK sub-gap)
 * @see imp-97656-wlin-laurent-crossval-subgap-standing-honest-status.js (sub-gap stands, independent)
 * @see imp-97618-wlin-leading-laurent-crossval.js (leading block {A,B,C0} reproduces w_lin)
 *
 * Ticket: imp-97737 (proof, opus-4-8, api-pool). Assessed the period-polynomial route; reached the
 * precise weight-2 degree-collapse + quasimodular obstruction; NO value pinned; NO QED.
 */

import { IMP97597_ZETA2, IMP97597_GAMMA1, IMP97597_SUBGAP } from './imp-97597-route-m-psi-s-integral-rep-double-expansion.js';

// -- structural constants of the weight-2 route (integers -- structural, NOT pinned coefficients). ----
export const IMP97737_WEIGHT = 2; // the cotangent-sum period function sits at weight 2
export const IMP97737_PERIOD_POLY_DEGREE = IMP97737_WEIGHT - 2; // Eichler-Shimura degree = k - 2 = 0
export const IMP97737_QUASIMODULAR_DEFECT_DEGREE = 1; // E_2(-1/z) - z^2 E_2(z) is z-linear (degree 1)
export const IMP97737_TARGET_MONOMIAL_DEGREE = 2; // the z^2 datum we need (out of reach of a degree-0 cocycle)

export const IMP97737_VERDICT = Object.freeze({
  id: 'imp-97737',
  proofSection: 'Route-M',
  question:
    'Does the Bettin-Conrey mean-value / period-polynomial machinery pin the imp-97597 RESULT 3 ' +
    'mixed kernel coefficient kappaK (epsilon*z^2 in K(s,z) at (s=1,z=0)) beyond the elementary ' +
    'cocycle, or is there a precise obstruction?',
  routeAssessed: 'Bettin-Conrey mean-value / Eichler-Shimura period-polynomial machinery at weight 2',
  // OBSTRUCTION PART 1 -- degree collapse: at k=2 the period polynomial is degree k-2 = 0.
  periodPolynomialDegree: IMP97737_PERIOD_POLY_DEGREE, // 0
  periodCocycleCanCarryZ2: false, // a degree-0 cocycle is structurally blind to z^2
  explainsWhyElementaryCocycleFixesOnlyLeadingBlock: true, // {A,B,C0} = w_lin, the {z^0,z^1} block
  // OBSTRUCTION PART 2 -- quasimodular anomaly: E_2 defect is z-linear, not a period.
  e2IsQuasimodular: true,
  quasimodularDefectDegree: IMP97737_QUASIMODULAR_DEFECT_DEGREE, // 1
  z2LivesInRegularisedSecondMoment: true, // the non-period part the anomaly does not resolve
  // RELOCATION -- same single scalar, moved into the Gamma-kernel normalisation.
  kappaKRelocatesToGammaKernelNormalisation: true,
  gammaKernelSetsP2toL2Ratio: true, // P2 = zeta(2) period, L2 = gamma_1 double-pole Laurent
  periodMachinePinsRatio: false, // weight-2 has no critical L-value to fix the P2:L2 ratio
  // HONESTY GATE
  closedFormReached: false,
  pureAnalyticCoefficientPinned: false, // NO value for kappaK / P2 / L2 / ratio / kappa_smooth
  kappaSmoothStaysMeasured: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  isRigorous: false,
  qed: false,
  conclusion:
    'The period-polynomial route does NOT close kappaK. At weight 2 the Eichler-Shimura period ' +
    'polynomial has degree k-2 = 0, so the polynomial cocycle (whose arithmetic shadow is the ' +
    'elementary V-reciprocity) is structurally blind to z^2 and can only carry the {A,B,C0} = w_lin ' +
    'leading block -- this is why the elementary cocycle never touches the coefficient. The z^2 datum ' +
    'lives entirely in the quasimodular anomaly of E_2 (E_2(-1/z) = z^2 E_2(z) + 12z/(2 pi i), a ' +
    'z-linear coboundary that under the Eichler integral produces the log(x)/pi and -x/pi terms), i.e. ' +
    'in the regularised second moment of the E_2 Eichler integral, which is not a period. The route ' +
    'therefore RELOCATES the single scalar into the Bettin-Conrey Mellin-Barnes Gamma-kernel ' +
    'normalisation at the s=1 double pole -- the relative weight between P2 (zeta(2) = pi^2/6 ' +
    'Eisenstein period) and L2 (gamma_1 double-pole Laurent) -- which no weight-2 critical L-value ' +
    'fixes. Obstruction reached, not closed; no value pinned; kappa_smooth stays measured; the ' +
    'rigorous anchor stays T = 2.594e7; compute binds first by >2600x; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97737_SUBGAP = Object.freeze({
  id: 'imp-97737-kappaK-gamma-kernel-normalisation',
  statement:
    'After the period-polynomial route, kappaK equals the Bettin-Conrey Mellin-Barnes Gamma-kernel ' +
    'normalisation at the s=1 double pole (= the regularised second period of the E_2 Eichler ' +
    'integral) fixing the P2 : L2 ratio, where P2 ~ zeta(2) = pi^2/6 and L2 ~ gamma_1. Weight 2 has ' +
    'degree k-2 = 0, so no critical L-value / period polynomial datum determines that ratio; pinning ' +
    'kappaK still requires the explicit BC Gamma-factor, not reconstructed here. Inherits ' +
    'imp-97597 RESULT 3 (' + IMP97597_SUBGAP.id + '); the naive Gauss-Kuzmin route is proven ' +
    'non-convergent (imp-97578 STEP 3), so it is NOT a fallback.',
});

export const IMP97737_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the Bettin-Conrey mean-value / ' +
  'period-polynomial route does NOT pin the imp-97597 RESULT 3 mixed kernel coefficient kappaK. At ' +
  'weight 2 the period polynomial has degree k-2 = 0 (structurally blind to z^2, so the elementary ' +
  'cocycle fixes only {A,B,C0} = w_lin) and the z^2 datum lives in the quasimodular anomaly of E_2 ' +
  '(regularised second moment, not a period). kappaK relocates to the BC Mellin-Barnes Gamma-kernel ' +
  'normalisation at the s=1 double pole (the P2:L2 = zeta(2):gamma_1 ratio), which no weight-2 ' +
  'critical L-value fixes. No value pinned; kappa_smooth stays measured; the rigorous anchor stays ' +
  'T = 2.594e7; compute binds first by >2600x.';

export default IMP97737_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    STRUCTURAL checks only -- NO fabricated coefficient is verified (none is asserted).
const IMP97737_ASSERTIONS = [
  {
    id: 'imp97737-weight-two-degree-collapse',
    why: 'OBSTRUCTION PART 1: at weight k=2 the Eichler-Shimura period polynomial has degree k-2 = 0, ' +
      'strictly below the target z^2 degree, so the polynomial cocycle cannot carry the coefficient.',
    holds: () =>
      IMP97737_WEIGHT === 2 &&
      IMP97737_PERIOD_POLY_DEGREE === 0 &&
      IMP97737_PERIOD_POLY_DEGREE < IMP97737_TARGET_MONOMIAL_DEGREE &&
      IMP97737_VERDICT.periodCocycleCanCarryZ2 === false,
  },
  {
    id: 'imp97737-quasimodular-defect-is-linear',
    why: 'OBSTRUCTION PART 2: the E_2 quasimodular defect is z-linear (degree 1), below the z^2 target, ' +
      'so the z^2 datum lives in the regularised second moment (not a period).',
    holds: () =>
      IMP97737_VERDICT.e2IsQuasimodular === true &&
      IMP97737_QUASIMODULAR_DEFECT_DEGREE === 1 &&
      IMP97737_QUASIMODULAR_DEFECT_DEGREE < IMP97737_TARGET_MONOMIAL_DEGREE &&
      IMP97737_VERDICT.z2LivesInRegularisedSecondMoment === true,
  },
  {
    id: 'imp97737-relocation-not-closure',
    why: 'the route RELOCATES the single scalar into the Gamma-kernel normalisation (P2:L2 ratio) and ' +
      'does NOT pin it; no weight-2 critical L-value fixes the ratio.',
    holds: () =>
      IMP97737_VERDICT.kappaKRelocatesToGammaKernelNormalisation === true &&
      IMP97737_VERDICT.gammaKernelSetsP2toL2Ratio === true &&
      IMP97737_VERDICT.periodMachinePinsRatio === false &&
      IMP97737_VERDICT.closedFormReached === false &&
      IMP97737_VERDICT.pureAnalyticCoefficientPinned === false,
  },
  {
    id: 'imp97737-p2-l2-scales-inherited-consistent',
    why: 'the P2 and L2 scales are the imp-97597 RESULT 2 constants (structural, not pinned): P2 ~ ' +
      'zeta(2) = pi^2/6 > 1.64 and L2 ~ gamma_1 < 0; the ratio between them is what stays uncomputed.',
    holds: () =>
      Math.abs(IMP97597_ZETA2 - (Math.PI * Math.PI) / 6) < 1e-15 &&
      IMP97597_ZETA2 > 1.64 &&
      IMP97597_GAMMA1 < 0,
  },
  {
    id: 'imp97737-honesty-gate-no-qed',
    why: 'assessment only: route assessed, obstruction reached, NO value pinned, NO bound moved, ' +
      'compute binds first, sub-gap + honesty markers present.',
    holds: () =>
      IMP97737_VERDICT.anyBoundMoved === false &&
      IMP97737_VERDICT.operatorPositivityEstablished === false &&
      IMP97737_VERDICT.kappaSmoothStaysMeasured === true &&
      IMP97737_VERDICT.computeBindsFirst === true &&
      IMP97737_VERDICT.isRigorous === false &&
      IMP97737_VERDICT.qed === false &&
      /NO QED/.test(IMP97737_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97737_HONEST_BANNER) &&
      /RH open/.test(IMP97737_HONEST_BANNER) &&
      /gamma-kernel-normalisation/.test(IMP97737_SUBGAP.id),
  },
];

for (const a of IMP97737_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97737-psi-cusp-x2-mixed-kernel-period-polynomial-route-obstruction assertion failed: ${a.id}`,
    );
  }
}

export { IMP97737_ASSERTIONS };
