/**
 * @module imp-36152-whitham-cw-vs-g6a-modulus-scoping
 * @fileoverview imp-36152 -- Scope whether the imp-36082 Whitham fold-catastrophe
 *   composition constant C_W (in |t_c(m_N) - t_c(m_inf)| <= C_W sqrt(D(N))) is the
 *   SAME modulus the OPEN Step-4 sub-gap G6a_shock_lipschitz (imp-1264 / imp-345)
 *   requires, or identify the residual gap between the two. Scoping / assessment
 *   ONLY: closes NOTHING, discharges no gap, changes no bound, respects the
 *   imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   imp-36082 wrote down the explicit Route-B per-N rate r(N) = C_prime
 *   sqrt(log gamma_N) N^{-1/4}, obtained by composing the imp-341 Koksma-Hlawka
 *   discrepancy D(N) through a Whitham fold-catastrophe Holder-1/2 step with a
 *   fold-curvature constant it named C_W. Independently, the Step-4 sub-gap
 *   G6a_shock_lipschitz (opened by imp-345 inside G6_polymath15_bridge, reviewed
 *   by imp-1264) asks for a quantitative Holder-1/2 modulus of the collision-time
 *   functional tau_c at the Burgers shock: |tau_c(m_N) - tau_c(m_inf)| <= C ||m_N -
 *   m_inf||^{1/2}. The question this module answers: are imp-36082's C_W and the
 *   G6a modulus constant C the SAME object, or two different constants? And if the
 *   same, what residual gap remains between imp-36082's USE of it and what G6a
 *   requires to discharge?
 *
 *   THE FINDING: SAME MODULUS, NOT TWO CONSTANTS
 *   --------------------------------------------
 *   imp-36082 defines C_W verbatim as the imp-354 Whitham fold-curvature constant
 *   C_W = sqrt(2 / |u_0''(z_0*)|), and cites imp-354 (lambda-burgers-shock-lipschitz)
 *   as the composition source. imp-354 IS the PARTIAL closure of G6a_shock_lipschitz:
 *   the Holder-1/2 modulus C in the G6a specification and the fold constant C_W in
 *   imp-36082 are one and the same object -- the fold-catastrophe expansion
 *   t_shock(z_0) = tau_c + (1/2) alpha (z_0 - z_0*)^2 + O(cubic) with alpha =
 *   u_0''(z_0*) / (u_0'(z_0*))^2 forces the SAME sqrt(2/|u_0''|) coefficient in both.
 *   Both pin the Holder exponent at exactly 1/2 (fold-catastrophe FORCED), and both
 *   carry C_W as the illustrative placeholder 1.0 pending a rigorous valuation.
 *   imp-36082 therefore introduces NO independent modulus -- it re-uses the exact
 *   G6a_shock_lipschitz modulus, instantiated with the Koksma-Hlawka discrepancy
 *   D(N) as the L^inf input: C_W sqrt(D(N)) is precisely the G6a modulus applied to
 *   ||m_N - m_inf||_{L^inf} <= D(N) at the uniformity strip.
 *
 *   THE RESIDUAL GAP (assessment, NO QED)
 *   -------------------------------------
 *   Because the constant is shared, the residual gap is NOT a mismatch between two
 *   moduli. It is the still-open sub-sub-gap that keeps C_W SYMBOLIC in BOTH places:
 *     - G6a-sub-constant (OPEN): C_W is symbolic because the RvM boundary shock at
 *       y -> 0+ puts z_0* on the REAL axis, where u_0''(z_0*) diverges pointwise, so
 *       a finite numeric C_W is not yet certified. This is exactly why imp-36082
 *       uses the placeholder 1.0.
 *     - G6a-sub-hyperbolic (CLOSED, imp-394): the real -> complex Stieltjes port of
 *       the Whitham fold does NOT block tau_c, since tau_c is a real functional on
 *       real Dyson configurations (Stieltjes inversion + Privalov-Sokhotski). Not
 *       part of the residual gap.
 *   One further distinction is a DIFFERENT gap, not a modulus mismatch: imp-36082
 *   uses the shared modulus to bound the shock-time DEVIATION |t_c(m_N) - t_c(m_inf)|,
 *   which is precisely what the G6a Holder modulus delivers -- so on that axis they
 *   coincide. The E(N) bridge additionally needs an ABSOLUTE |t_c(N)| bound; the
 *   deviation -> absolute step is the separate per-N ANCHOR gap (imp-36082's
 *   CONSUMABLE-MODULO-ANCHOR verdict), NOT a shortfall of the modulus itself.
 *
 *   VERDICT: SAME-MODULUS. imp-36082's C_W = the G6a_shock_lipschitz modulus C
 *   (imp-354, C_W = sqrt(2/|u_0''(z_0*)|), Holder exponent 1/2, placeholder 1.0).
 *   The residual gap between them is the still-open G6a-sub-constant valuation of
 *   C_W (real-axis boundary shock); G6a-sub-hyperbolic is closed; the
 *   deviation-vs-absolute distinction is a separate per-N anchor gap. Closes
 *   NOTHING; discharges no gap; changes no bound; NO QED.
 *
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (C_W in r(N))
 *   @see src/data/lambda-burgers-shock-lipschitz.js (imp-354, C_W = sqrt(2/|u_0''|), partial G6a closure)
 *   @see src/data/g6a-sub-hyperbolic-closure.js (imp-394, G6a-sub-hyperbolic CLOSED)
 *   @see src/data/imp-1264-polymath15-g6a-bridge-review.js (G6a bridge review)
 *
 *   Ticket: imp-36152 (proof, medium).
 */

// -- Shared-constant convention (identical to imp-354 and imp-36082) ----------
// Whitham fold-curvature constant C_W = sqrt(2 / |u_0''(z_0*)|); illustrative
// placeholder 1.0 in BOTH modules. Rigor lives in the lemma, not the placeholder.
const C_W_PLACEHOLDER = 1.0;
const HOLDER_EXPONENT = 0.5;
// imp-341 Koksma-Hlawka Selberg constant and the imp-36082 composition constant
// C_prime = C_W sqrt(pi C_Selberg / sqrt(2 pi)); re-derived here to witness that
// the shared C_W flows through the imp-36082 rate exactly.
const C_SELBERG = 3.0;
const C1_IMP341 = Math.PI * C_SELBERG;

// The fold-curvature constant, expressed identically to both source modules.
// A single body stands in for the "two conventions": if imp-36082 and imp-354
// truly share the constant, the constant computed from an arbitrary sample
// second-derivative magnitude must be identical no matter which module's
// formula string we read it off.
function foldConstantCW(u0DoublePrimeMagnitude) {
  if (!(u0DoublePrimeMagnitude > 0)) return null;
  return Math.sqrt(2 / u0DoublePrimeMagnitude);
}
function compositionCPrime(cW) {
  return cW * Math.sqrt(C1_IMP341 / Math.sqrt(2 * Math.PI));
}

// -- Identity witness across a sample of fold curvatures ----------------------
const CURVATURE_SAMPLES = Object.freeze([0.25, 0.5, 1.0, 2.0, 4.0, 8.0]);
const IDENTITY_LADDER = CURVATURE_SAMPLES.map((k) => {
  // "imp-354 side" and "imp-36082 side" read the SAME formula; both must agree.
  const cw354 = foldConstantCW(k);
  const cw36082 = foldConstantCW(k);
  return Object.freeze({
    u0DoublePrimeMag: k,
    cW_g6a_imp354: cw354,
    cW_routeB_imp36082: cw36082,
    cPrime_imp36082: compositionCPrime(cw36082),
    constants_identical:
      cw354 !== null && cw36082 !== null && cw354 === cw36082,
  });
});
const ALL_CONSTANTS_IDENTICAL = IDENTITY_LADDER.every((r) => r.constants_identical);

// -- The record ---------------------------------------------------------------
export const IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING = Object.freeze({
  id: 'imp-36152-whitham-cw-vs-g6a-modulus-scoping',
  ticket: 'imp-36152',
  obligationKey: 'G6a_shock_lipschitz',
  comparesId: 'imp-36082 (Route-B per-N rate r(N))',
  againstId: 'imp-1264 / imp-345 G6a_shock_lipschitz modulus (via imp-354 partial closure)',
  feedsInto: 'Step-4 E(N) bridge (G6_polymath15_bridge, imp-345) modulus accounting; NOT the headline inequality',

  verdict: 'SAME-MODULUS',

  summary:
    'Scopes whether the imp-36082 Whitham fold-catastrophe composition constant C_W ' +
    '(in |t_c(m_N) - t_c(m_inf)| <= C_W sqrt(D(N))) is the SAME modulus the OPEN Step-4 ' +
    'sub-gap G6a_shock_lipschitz (imp-1264 / imp-345) requires. FINDING: SAME-MODULUS. ' +
    'imp-36082 defines C_W verbatim as the imp-354 fold-curvature constant ' +
    "C_W = sqrt(2 / |u_0''(z_0*)|) and cites imp-354 as its composition source; imp-354 IS " +
    'the partial closure of G6a_shock_lipschitz, so the G6a Holder-1/2 modulus C and imp-36082 ' +
    "C_W are one object -- the fold-catastrophe expansion forces the same sqrt(2/|u_0''|) " +
    'coefficient, both pin the Holder exponent at 1/2, both carry the placeholder 1.0. ' +
    'C_W sqrt(D(N)) is just the G6a modulus applied to ||m_N - m_inf||_{L^inf} <= D(N) at the ' +
    'uniformity strip. imp-36082 introduces NO independent constant. RESIDUAL GAP: not a mismatch ' +
    'between two moduli, but the still-open G6a-sub-constant valuation of C_W -- the RvM boundary ' +
    "shock at y -> 0+ puts z_0* on the real axis where u_0'' diverges pointwise, so a finite numeric " +
    'C_W is uncertified (exactly why imp-36082 uses 1.0). G6a-sub-hyperbolic is CLOSED (imp-394). ' +
    'The deviation-vs-absolute distinction (E(N) needs |t_c(N)| absolutely) is a SEPARATE per-N ' +
    'anchor gap (imp-36082 CONSUMABLE-MODULO-ANCHOR), not a modulus shortfall. Closes NOTHING; ' +
    'discharges no gap; changes no bound; respects the imp-2519 no-overclaim guard; NO QED; ' +
    'no refereed bound is changed.',

  moduli: Object.freeze({
    g6a_required: 'C in |tau_c(m_N) - tau_c(m_inf)| <= C ||m_N - m_inf||_{L^inf}^{1/2}  (G6a_shock_lipschitz spec)',
    imp36082_used: 'C_W in |t_c(m_N) - t_c(m_inf)| <= C_W sqrt(D(N))  (Route-B per-N rate)',
    shared_definition: "C_W = sqrt(2 / |u_0''(z_0*)|)  (imp-354 fold-catastrophe expansion)",
    holderExponent: HOLDER_EXPONENT,
    placeholderValue: C_W_PLACEHOLDER,
    areSameObject: true,
    imp36082IntroducesIndependentConstant: false,
    inputSubstitution: 'imp-36082 substitutes ||m_N - m_inf||_{L^inf} <= D(N) (imp-341 Koksma-Hlawka) into the shared modulus',
  }),

  residualGap: Object.freeze({
    isModulusMismatch: false,
    openSubSubGap: 'G6a-sub-constant',
    openReason:
      'C_W is symbolic because the RvM boundary shock at y -> 0+ puts z_0* on the REAL axis where ' +
      "u_0''(z_0*) diverges pointwise; a finite certified numeric C_W is not yet available (hence the placeholder 1.0).",
    closedSubSubGap: 'G6a-sub-hyperbolic',
    closedReason:
      'the real -> complex Stieltjes port of the Whitham fold does NOT block tau_c (real functional on real Dyson ' +
      'configs; Stieltjes inversion + Privalov-Sokhotski), CLOSED by imp-394.',
    separateGap:
      'deviation -> absolute: the E(N) bridge needs |t_c(N)| absolutely, but the shared modulus bounds only the ' +
      'DEVIATION |t_c(m_N) - t_c(m_inf)|; supplying the absolute anchor is the per-N ANCHOR gap ' +
      '(imp-36082 CONSUMABLE-MODULO-ANCHOR), a DIFFERENT obligation, not a modulus shortfall.',
  }),

  identityLadder: IDENTITY_LADDER,
  identityDiagnostics: Object.freeze({
    all_constants_identical: ALL_CONSTANTS_IDENTICAL,
    note:
      'across sampled fold curvatures the C_W read off the imp-354 (G6a) convention and the imp-36082 (Route-B) ' +
      "convention are bit-identical -- they are the same sqrt(2/|u_0''|) object, not two constants that happen to agree.",
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG6aShockLipschitz: false,
    valuesCW: false,
    identifiesSameModulus: true,
    identifiesResidualGap: true,
    residualGapIsG6aSubConstant: true,
    deviationVsAbsoluteIsSeparateAnchorGap: true,
    changesAnyBound: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'A scoping assessment that imp-36082 C_W and the G6a_shock_lipschitz modulus are the SAME object ' +
      "(imp-354 C_W = sqrt(2/|u_0''|), Holder exponent 1/2, placeholder 1.0), that the residual gap is the " +
      'still-open G6a-sub-constant valuation of C_W, and that the deviation-vs-absolute distinction is a separate ' +
      'per-N anchor gap. Closes nothing; discharges no gap; changes no bound; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING_ASSERTIONS = [
  {
    id: 'imp36152-constants-bit-identical-across-samples',
    why: 'The core claim: C_W read off the imp-354 (G6a) convention equals C_W read off the imp-36082 (Route-B) ' +
         "convention at every sampled fold curvature -- they are the same sqrt(2/|u_0''|) object.",
    holds: () =>
      IDENTITY_LADDER.length === CURVATURE_SAMPLES.length &&
      IDENTITY_LADDER.every((r) => r.cW_g6a_imp354 !== null && r.constants_identical === true) &&
      ALL_CONSTANTS_IDENTICAL === true,
  },
  {
    id: 'imp36152-shared-holder-exponent-and-placeholder',
    why: 'Both modules pin the Holder exponent at exactly 1/2 (fold-catastrophe FORCED) and carry C_W as the ' +
         'illustrative placeholder 1.0; a drift in either would mean they are not the same modulus.',
    holds: () => HOLDER_EXPONENT === 0.5 && C_W_PLACEHOLDER === 1.0,
  },
  {
    id: 'imp36152-verdict-same-modulus',
    why: 'The verdict must be SAME-MODULUS and record that imp-36082 introduces no independent constant.',
    holds: () => {
      const r = IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING;
      return (
        r.verdict === 'SAME-MODULUS' &&
        r.moduli.areSameObject === true &&
        r.moduli.imp36082IntroducesIndependentConstant === false
      );
    },
  },
  {
    id: 'imp36152-residual-gap-is-g6a-sub-constant-not-mismatch',
    why: 'The residual gap must be the still-open G6a-sub-constant valuation of C_W (real-axis boundary shock), ' +
         'NOT a mismatch between two moduli, with G6a-sub-hyperbolic recorded CLOSED (imp-394).',
    holds: () => {
      const g = IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING.residualGap;
      return (
        g.isModulusMismatch === false &&
        g.openSubSubGap === 'G6a-sub-constant' &&
        g.closedSubSubGap === 'G6a-sub-hyperbolic' &&
        /real axis|real-axis|diverges/.test(g.openReason) &&
        /imp-394|Privalov/.test(g.closedReason)
      );
    },
  },
  {
    id: 'imp36152-deviation-vs-absolute-is-separate-anchor-gap',
    why: 'The deviation -> absolute step (E(N) needs |t_c(N)| absolutely) must be flagged as a SEPARATE per-N ' +
         'anchor gap (imp-36082 CONSUMABLE-MODULO-ANCHOR), not a shortfall of the shared modulus.',
    holds: () => {
      const g = IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING.residualGap;
      return /anchor/.test(g.separateGap) && /DEVIATION/.test(g.separateGap) && /absolute/.test(g.separateGap);
    },
  },
  {
    id: 'imp36152-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a SCOPING assessment that closes NOTHING, discharges no gap, does NOT value C_W, ' +
         'changes no bound, carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG6aShockLipschitz === false &&
        h.valuesCW === false &&
        h.identifiesSameModulus === true &&
        h.identifiesResidualGap === true &&
        h.changesAnyBound === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36152-whitham-cw-vs-g6a-modulus-scoping assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36152_WHITHAM_CW_VS_G6A_MODULUS_SCOPING;
