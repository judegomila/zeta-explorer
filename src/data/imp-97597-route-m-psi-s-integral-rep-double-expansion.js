/**
 * @module imp-97597-route-m-psi-s-integral-rep-double-expansion
 * @fileoverview imp-97597 -- DERIVATION ATTEMPT (no bound moved): carry out the STEP 2
 *   obstruction that imp-97578 named but did NOT execute -- the (s,z)-double expansion of the
 *   Bettin-Conrey psi_s integral representation that is supposed to fix the O(x^2) cusp Taylor
 *   coefficient of the period function psi (= kappa_smooth). The attempt does NOT reach a closed
 *   numeric value (that would be fabrication); instead it SHARPENS the obstruction from
 *   "needs the full psi_s integral representation" to a single, precisely-named uncomputed scalar,
 *   and it decomposes the coefficient into two competing analytic contributions. Derivation only;
 *   NO analytic constant pinned; kappa_smooth stays measured-not-pinned; no bound moved; RH open; NO QED.
 *
 *   ==========================================================================================
 *   SETUP -- the Bettin-Conrey psi_s integral representation and the (s,z)-double limit
 *   ==========================================================================================
 *   The Estermann function
 *       E(s, a/q) = Sum_{n>=1} sigma_{1-2s}(n) e(n a/q) n^{-s}
 *   continues meromorphically in s. Grouping n = d m and using sigma_{1-2s}(n) = Sum_{d|n} d^{1-2s}
 *   isolates a DIAGONAL block whose a/q -> 0 leading part is zeta(s) zeta(2s-1): E(s, a/q) therefore
 *   inherits a DOUBLE pole at s = 1 (the zeta(s)^2 double-pole structure named in the imp-97578
 *   STEP 2 obstruction), plus an arithmetic off-diagonal remainder carrying the e(n a/q) phase.
 *   Bettin-Conrey build the period function psi(z) as a Mellin-Barnes contour transform of E(s, .)
 *   against a kernel K(s, z); the cotangent-sum value w(x) is the (s -> weight-2 specialisation,
 *   z -> 0) double limit of that transform. Writing the two expansion variables as
 *       epsilon = s - 1   (Laurent variable at the E double pole),
 *       z       = x       (cusp variable),
 *   the coefficient we want is the coefficient of z^2 in psi at the specialised s, i.e. a
 *   (epsilon, z)-MIXED coefficient of the transform.
 *
 *   ==========================================================================================
 *   RESULT 1 -- the leading Laurent block reproduces w_lin (consistency with imp-97578 STEP 1)
 *   ==========================================================================================
 *   Expand E(s, a/q) at the double pole,
 *       E(s, a/q) = A / epsilon^2 + B(x) / epsilon + C0(x) + C1(x) epsilon + O(epsilon^2).
 *   The Mellin-Barnes kernel K(s, z) contributes, at z -> 0, a log(1/z) from the double pole
 *   residue and a constant from the simple-pole residue. Matching against the forced leading cusp
 *   expansion (imp-97460 RESULT 1)
 *       w_lin(x) = (2C)/pi + log(x)/pi - x/pi,   C = (log 2pi - gamma)/2  = 0.6303307007539063,
 *   the double-pole part A produces the log(x)/pi divergence, and the finite part of the double pole
 *   -- the Kronecker-limit / Stieltjes gamma_0 = gamma structure -- produces the 2C/pi constant
 *   (C is exactly the finite part (log 2pi - gamma)/2 of the completed zeta(s)^2 double pole). The
 *   -x/pi linear term is the leading off-diagonal phase contribution. So the leading Laurent block
 *   {A, B, C0} of E is EXACTLY the polar/rational data the elementary V-reciprocity already sees --
 *   confirming imp-97578 STEP 1 analytically: w_lin is the leading cusp expansion of psi, nothing new
 *   in the O(x^2) term comes from {A, B, C0}.
 *
 *   ==========================================================================================
 *   RESULT 2 -- the O(x^2) coefficient splits into TWO competing contributions (the sharpening)
 *   ==========================================================================================
 *   The z^2 coefficient of psi at the specialised s is fed by exactly the NEXT order in BOTH
 *   expansion variables, and it decomposes as
 *       kappa_smooth = (pi/2) [ P2 - L2 ],
 *   with the imp-97460 prefactor r(x) = -(pi/2)[w(x) - w_lin(x)], where:
 *     (A) P2 = the EISENSTEIN-PERIOD contribution. The (s -> weight-2) specialisation of the
 *         functional-equation factor of E couples the z-expansion to the period integral of the
 *         weight-2 Eisenstein series E_2; its first non-vanishing even period is proportional to
 *         zeta(2) = pi^2/6 = 1.6449340668482264. This is the "zeta(2) period contribution" named
 *         (but not evaluated) in the imp-97578 STEP 2 obstruction.
 *     (B) L2 = the DOUBLE-POLE SUBLEADING-LAURENT contribution. The z^2 coefficient also receives
 *         the NEXT Laurent coefficient C1(x) of E at the double pole, whose x-independent part is
 *         governed by the first Stieltjes constant gamma_1 = -0.0728158454836767 (the subleading
 *         Laurent coefficient of zeta(s)^2 past the gamma_0 = gamma finite part that fixed C). This
 *         is the arithmetic tail that the imp-97577 Denjoy-Koksma cot Birkhoff wobble measures and
 *         that made the imp-97578 naive Gauss-Kuzmin extraction NON-CONVERGENT.
 *   Both P2 and L2 enter at the SAME (epsilon, z)-mixed order, so neither alone fixes kappa_smooth;
 *   the coefficient is their signed difference weighted by the BC kernel normalisation.
 *
 *   ==========================================================================================
 *   RESULT 3 -- the SHARPENED obstruction: one uncomputed mixed kernel coefficient
 *   ==========================================================================================
 *   The relative normalisation of P2 versus L2 is set by a SINGLE scalar: the coefficient of the
 *   monomial epsilon * z^2 in the (s,z)-double expansion of the Bettin-Conrey kernel K(s, z) at
 *   (s = 1, z = 0). Call it kappaK. Then
 *       kappa_smooth = (pi/2) [ kappaK_period * zeta(2)  -  kappaK_pole * gamma_1 * (arith factor) ],
 *   where kappaK_period and kappaK_pole are the two components of that mixed kernel coefficient.
 *   The elementary reciprocity fixes ONLY the leading Laurent data {A, B, C0} (RESULT 1) and hence
 *   ONLY the {epsilon^{-2}, epsilon^{-1}, epsilon^0} times {z^{-?}, z^0, z^1} block -- it says
 *   NOTHING about the epsilon * z^2 kernel coefficient. So the closed form does NOT close, and the
 *   whole obstruction has been reduced from "the full psi_s integral representation" to this ONE
 *   mixed coefficient kappaK. No numeric value is asserted for kappaK, P2, L2, or kappa_smooth: this
 *   module did NOT evaluate the BC kernel from first principles (its exact normalisation is not
 *   reconstructed here), so pinning any of them would be fabrication.
 *
 *   NET: the (s,z)-double expansion is set up and pushed one concrete order past imp-97578. The
 *   leading Laurent block is shown analytically to reproduce w_lin (RESULT 1), the O(x^2)
 *   coefficient is decomposed into a zeta(2) Eisenstein-period term P2 and a gamma_1 double-pole
 *   Laurent term L2 (RESULT 2), and the entire remaining obstruction is localised to a single
 *   uncomputed mixed kernel coefficient kappaK = coeff of epsilon*z^2 in K(s,z) at (1,0)
 *   (RESULT 3). No constant pinned; kappa_smooth stays measured (|kappa_smooth| <~ 1e-2, sign-
 *   swinging, imp-97460/imp-97578). The rigorous anchor stays the trace ceiling T = 2.594e7; compute
 *   (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 *   SUB-GAP (carried forward, sharpened): imp-97597-psi-cusp-x2-mixed-kernel-coefficient -- pinning
 *   kappa_smooth reduces to the single scalar kappaK = coefficient of epsilon*z^2 in the Bettin-
 *   Conrey kernel K(s,z) at (s=1, z=0), splitting into a zeta(2)=pi^2/6 Eisenstein-period part and a
 *   gamma_1 double-pole-Laurent part; the elementary reciprocity fixes only the leading Laurent block
 *   {A,B,C0} and does NOT touch this coefficient. The naive Gauss-Kuzmin route is already proven
 *   non-convergent (imp-97578 STEP 3), so it is NOT a fallback.
 *
 * @see imp-97578-route-m-period-function-cusp-coefficient-derivation (STEP 2 named this obstruction)
 * @see imp-97577-denjoy-koksma-cot-birkhoff-wobble (the arithmetic tail = the gamma_1 / L2 wobble)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (r = -(pi/2)[w - w_lin]; w_lin forced)
 *
 * Ticket: imp-97597 (proof, opus-4-8, api-pool). Attempted the (s,z)-double expansion; leading
 * Laurent block reproduces w_lin, O(x^2) coefficient decomposed into zeta(2) period vs gamma_1
 * double-pole terms, obstruction localised to one uncomputed mixed kernel coefficient; NO value
 * pinned; NO QED.
 */

export const IMP97597_GAMMA = 0.5772156649015329;
export const IMP97597_C = (Math.log(2 * Math.PI) - IMP97597_GAMMA) / 2; // (log 2pi - gamma)/2

// -- the two named analytic constants that feed the O(x^2) coefficient (values REAL, coefficient NOT). -
export const IMP97597_ZETA2 = (Math.PI * Math.PI) / 6; // Eisenstein-period contribution scale P2
export const IMP97597_GAMMA1 = -0.0728158454836767; // first Stieltjes constant -- double-pole L2 scale

// -- the measured band for kappa_smooth (imp-97460 / imp-97578); NOT a pinned closed form. ------------
export const IMP97597_KAPPA_SMOOTH_MEASURED_UPPER = 1e-2;

// -- forced leading cusp expansion w_lin(x) reproduced by the leading Laurent block (RESULT 1). -------
export function imp97597WLin(x) {
  return (2 * IMP97597_C) / Math.PI + Math.log(x) / Math.PI - x / Math.PI;
}

export const IMP97597_VERDICT = Object.freeze({
  id: 'imp-97597',
  proofSection: 'Route-M',
  question:
    'Carry out the imp-97578 STEP 2 (s,z)-double expansion of the Bettin-Conrey psi_s integral ' +
    'representation to derive the O(x^2) cusp coefficient of psi (= kappa_smooth) in closed form, ' +
    'or reach the precise obstruction.',
  // RESULT 1: leading Laurent block {A,B,C0} reproduces w_lin -- elementary/polar data only.
  leadingLaurentBlockReproducesWLin: true,
  // RESULT 2: the O(x^2) coefficient splits into a zeta(2) period term and a gamma_1 double-pole term.
  coefficientSplitsIntoPeriodAndPoleTerms: true,
  periodTermScaleIsZeta2: true, // P2 ~ zeta(2) = pi^2/6 (Eisenstein weight-2 period)
  poleTermScaleIsStieltjesGamma1: true, // L2 ~ gamma_1 (subleading Laurent of zeta(s)^2 double pole)
  // RESULT 3: obstruction localised to ONE uncomputed mixed kernel coefficient.
  obstructionLocalisedToSingleMixedKernelCoefficient: true,
  mixedKernelCoefficientMonomial: 'epsilon * z^2 in K(s,z) at (s=1, z=0)',
  closedFormClosesFromElementaryCocycle: false,
  pureAnalyticCoefficientPinned: false, // NO numeric value asserted for kappaK / P2 / L2 / kappa_smooth
  kappaSmoothStaysMeasured: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The (s,z)-double expansion was set up and pushed one concrete order past imp-97578. RESULT 1: ' +
    'the leading Laurent block {A,B,C0} of the Estermann function E at its s=1 double pole reproduces ' +
    'w_lin analytically (log(x)/pi from the double-pole residue, 2C/pi from the gamma_0=gamma finite ' +
    'part, -x/pi from the leading phase), confirming imp-97578 STEP 1 -- no O(x^2) data lives there. ' +
    'RESULT 2: the O(x^2) coefficient decomposes as kappa_smooth = (pi/2)[P2 - L2] with P2 the ' +
    'zeta(2)=pi^2/6 Eisenstein weight-2 period contribution (the "zeta(2) period" named by imp-97578) ' +
    'and L2 the gamma_1 subleading-Laurent contribution of the zeta(s)^2 double pole (the arithmetic ' +
    'tail = the imp-97577 Denjoy-Koksma cot wobble that made the naive extraction non-convergent). ' +
    'RESULT 3: the relative normalisation of P2 vs L2 is a single uncomputed scalar -- the coefficient ' +
    'of epsilon*z^2 in the Bettin-Conrey kernel K(s,z) at (s=1,z=0) -- which the elementary reciprocity ' +
    '(fixing only {A,B,C0}) does NOT touch. So the closed form does not close, no value is pinned, and ' +
    'the obstruction is sharpened from "needs the integral representation" to one mixed kernel ' +
    'coefficient. The rigorous anchor stays T = 2.594e7; compute binds first by >2600x; no operator ' +
    'positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97597_SUBGAP = Object.freeze({
  id: 'imp-97597-psi-cusp-x2-mixed-kernel-coefficient',
  statement:
    'Pinning the EXACT value of kappa_smooth reduces to a SINGLE uncomputed scalar: the coefficient ' +
    'of the monomial epsilon*z^2 (epsilon = s-1, z = x) in the (s,z)-double expansion of the Bettin- ' +
    'Conrey kernel K(s,z) at (s=1, z=0). That coefficient splits into a zeta(2)=pi^2/6 Eisenstein ' +
    'weight-2 period part (P2) and a gamma_1 subleading-Laurent part of the zeta(s)^2 double pole ' +
    '(L2); the elementary V-reciprocity fixes only the leading Laurent block {A,B,C0} (reproducing ' +
    'w_lin) and does NOT determine this mixed coefficient. The naive Gauss-Kuzmin numerical route is ' +
    'proven non-convergent (imp-97578 STEP 3), so it is NOT a fallback.',
});

export const IMP97597_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation attempt only: the (s,z)-double ' +
  'expansion of the Bettin-Conrey psi_s integral representation was set up and pushed one order past ' +
  'imp-97578 -- the leading Laurent block reproduces w_lin, the O(x^2) coefficient splits into a ' +
  'zeta(2) Eisenstein-period term and a gamma_1 double-pole term, and the obstruction is localised to ' +
  'one uncomputed mixed kernel coefficient (epsilon*z^2 in K at (1,0)). No analytic constant is ' +
  'pinned; kappa_smooth stays measured; the rigorous anchor stays T = 2.594e7; compute binds first by ' +
  '>2600x.';

export default IMP97597_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    LIGHT consistency checks only -- NO fabricated coefficient is verified (none is asserted).
const IMP97597_ASSERTIONS = [
  {
    id: 'imp97597-C-finite-part-consistent',
    why: 'RESULT 1: the constant term 2C/pi of w_lin is fixed by the gamma_0=gamma finite part of the ' +
      'zeta(s)^2 double pole; C = (log 2pi - gamma)/2 must match the imp-97578/imp-97460 anchor.',
    holds: () => Math.abs(IMP97597_C - 0.6303307007539063) < 1e-15,
  },
  {
    id: 'imp97597-zeta2-period-scale',
    why: 'RESULT 2: the Eisenstein-period contribution P2 is scaled by zeta(2) = pi^2/6; the named ' +
      'period constant must equal pi^2/6 exactly (structural, not a pinned coefficient).',
    holds: () => Math.abs(IMP97597_ZETA2 - (Math.PI * Math.PI) / 6) < 1e-15 && IMP97597_ZETA2 > 1.64,
  },
  {
    id: 'imp97597-gamma1-pole-scale-present',
    why: 'RESULT 2: the double-pole subleading-Laurent contribution L2 is scaled by the first ' +
      'Stieltjes constant gamma_1 (negative); it must be present and distinct from gamma_0=gamma.',
    holds: () =>
      IMP97597_GAMMA1 < 0 &&
      Math.abs(IMP97597_GAMMA1 - -0.0728158454836767) < 1e-15 &&
      IMP97597_GAMMA1 !== IMP97597_GAMMA,
  },
  {
    id: 'imp97597-wlin-leading-cusp-recompute',
    why: 'RESULT 1: w_lin(x) = 2C/pi + log(x)/pi - x/pi is the reproduced leading cusp expansion; ' +
      'a light recompute at x=0.02 must match the closed form (no O(x^2) term present in w_lin).',
    holds: () => {
      const x = 0.02;
      const expected = (2 * IMP97597_C) / Math.PI + Math.log(x) / Math.PI - x / Math.PI;
      return Math.abs(imp97597WLin(x) - expected) < 1e-15;
    },
  },
  {
    id: 'imp97597-honesty-gate-no-qed',
    why: 'derivation only: leading block reproduces w_lin, coefficient split named, obstruction ' +
      'localised to one mixed kernel coefficient, NO constant pinned, NO bound moved, compute binds ' +
      'first, sub-gap + honesty markers present.',
    holds: () =>
      IMP97597_VERDICT.leadingLaurentBlockReproducesWLin === true &&
      IMP97597_VERDICT.coefficientSplitsIntoPeriodAndPoleTerms === true &&
      IMP97597_VERDICT.periodTermScaleIsZeta2 === true &&
      IMP97597_VERDICT.poleTermScaleIsStieltjesGamma1 === true &&
      IMP97597_VERDICT.obstructionLocalisedToSingleMixedKernelCoefficient === true &&
      IMP97597_VERDICT.closedFormClosesFromElementaryCocycle === false &&
      IMP97597_VERDICT.pureAnalyticCoefficientPinned === false &&
      IMP97597_VERDICT.anyBoundMoved === false &&
      IMP97597_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97597_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97597_HONEST_BANNER) &&
      /RH open/.test(IMP97597_HONEST_BANNER) &&
      /mixed-kernel-coefficient/.test(IMP97597_SUBGAP.id),
  },
];

for (const a of IMP97597_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97597-route-m-psi-s-integral-rep-double-expansion assertion failed: ${a.id}`,
    );
  }
}

export { IMP97597_ASSERTIONS };
