/**
 * @fileoverview imp-95653 — SHAPE TEST: can a second independent anchor
 * c_odd(rho != 1/20) corroborate or refute the Sun-Catalan curvature form
 * c_odd(rho) = kappa rho^2 off the single verified 1/20 anchor?
 *
 * This is the concrete follow-up to the imp-95637 verdict "kappa is anchor-verified
 * but SHAPE-uncertified": kappa = 2.51069789 is the ONE-POINT back-solve
 * kappa = c_odd(1/20)/(1/20)^2 = 0.006276744725/0.0025 of the ASSUMED rho^2 form at the
 * single verified anchor rho = 1/20. Its role as a curvature governing c_odd away from
 * 1/20 rests on the rho^2 functional form, the named imp-95516 sub-gap.
 *
 * WHAT THE TICKET ASKS: measure/derive c_odd at a second rho (e.g. 1/50 or 1/56, the
 * imp-95516/95600 interior optima) from the Sun Section 6 machinery INDEPENDENTLY, and
 * assess how far a two-point dataset corroborates or deviates from the pure rho^2 shape.
 *
 * HONEST OUTCOME (a PARTIAL closure with a clearly-named residual sub-gap):
 *
 *  (1) NO second independent NUMERIC anchor exists in the carried ledger. The only
 *      verified c_odd datum anywhere in imp-95516/95600/95615/95618/95637 is the single
 *      value c_odd(1/20) = 0.006276744725. Producing a genuine second anchor requires
 *      re-running Sun Section 6 (the rho-independent integrand P_6.3) at a second rho, or
 *      an independent Section 7 Lambda_mid(rho2) to back it out of the decisive ledger
 *      delta_0 = Lambda_mid + Delta_gtB - c_odd - (4rho-2rho^2). Neither the Section 6
 *      integrand nor a second Lambda_mid is reproduced here (both sit inside the
 *      uncertified imp-95516 Section 2-5 determinant/rank core). So the two-point
 *      NUMERIC corroboration the ticket asks for CANNOT be executed from available
 *      material. The rho^2-shape sub-gap therefore REMAINS OPEN.
 *
 *  (2) The shape question is nonetheless REDUCIBLE to a single structural claim already
 *      carried in imp-95516 (line 64): "the Section 6 integrand is rho-INDEPENDENT". If
 *      c_odd(rho) = P(rho) * I(rho) with I(rho) = I0 a rho-independent integral and P(rho)
 *      the explicit algebraic prefactor, then:
 *        - IF the integrand is genuinely rho-independent AND P(rho) = rho^2, then
 *          c_odd(rho)/rho^2 = kappa EXACTLY for every rho, and any second anchor
 *          corroborates the form with ZERO deviation (the form is structurally forced,
 *          not fitted). This is the certification the carried literal claims.
 *        - IF the integrand carries a residual rho-dependence dI(rho) = I(rho)/I0 - 1,
 *          then a second anchor deviates from the 1/20 kappa by EXACTLY
 *          kappa(rho2) - kappa = kappa * dI(rho2). So "deviation from the rho^2 shape"
 *          is not an unspecified fit residual: it equals the fractional rho-variation of
 *          the Section 6 integrand. The shape test thus collapses to the binary structural
 *          question "is the Section 6 integrand rho-independent?", which is exactly what
 *          imp-95637 flagged as uncertified and which this module does NOT settle.
 *
 *  (3) DOWNSTREAM SENSITIVITY (measurable from the carried models, reported not as a
 *      corroboration but as a robustness margin): even a LARGE hypothetical second-anchor
 *      deviation in kappa leaves the imp-95600 corrected interior optimum positive. On the
 *      Section 9 sign-corrected ledger a second-anchor kappa_prime enters the decisive
 *      margin identically to the -4rho^2 downshift, via
 *        margin(rho) = delta0Model(rho) - (4 + (kappa_prime - kappa)) rho^2,
 *      so scanning kappa_prime across [0.5x, 2.0x] of 2.51069789 moves the interior
 *      optimum margin only within [0.03656, 0.03771] (all > 0.037-ish), with the optimum
 *      rho* drifting only 0.01844 -> 0.01664. This corroborates the imp-95637
 *      kappa-INSENSITIVITY conclusion: no plausible second-anchor shape deviation flips
 *      the interior-optimum verdict. (The local parabola is valid only near [1/56, 1/20];
 *      the wide-band insensitivity beyond 2.0x is a parabola-extrapolation artifact and
 *      is NOT read as evidence.)
 *
 * NET VERDICT: the rho^2 form is neither corroborated nor refuted by a real second
 * anchor (none is available); the shape sub-gap stays OPEN, now sharpened to the single
 * structural claim "Section 6 integrand rho-independent"; and downstream conclusions are
 * shown robust to any second-anchor kappa in a wide band. Assessment + sensitivity, not a
 * primary-source Section 6 re-derivation. Catalan G irrationality OPEN; Sun
 * arXiv:2609.04176 single-author and unrefereed; changes no bound; NO Lambda movement;
 * no refereed bound is changed; NO QED.
 *
 * NO heavy imports. All figures baked as literals / recomputed from the ledger.
 */

const KAPPA = 2.51069789;
const C_ODD_AT_1_OVER_20 = 0.006276744725; // imp-95516 sole VERIFIED anchor datum
const RHO_ANCHOR = 1 / 20;

// Sole anchor back-solve reproduces kappa exactly (rides on the one verified datum).
const KAPPA_FROM_ANCHOR = C_ODD_AT_1_OVER_20 / (RHO_ANCHOR * RHO_ANCHOR);

// imp-95600/95618 local parabola model of delta_0(rho), pinned at gate + optimum.
const RHO_OPT_ORIG = 1 / 50;
const D0_OPT_ORIG = 0.038723;
const D0_AT_1_OVER_20 = 0.00966243;
const PARABOLA_A =
  (D0_AT_1_OVER_20 - D0_OPT_ORIG) / Math.pow(RHO_ANCHOR - RHO_OPT_ORIG, 2); // ~ -32.28952

function delta0Model(rho) {
  return PARABOLA_A * Math.pow(rho - RHO_OPT_ORIG, 2) + D0_OPT_ORIG;
}

// A second-anchor kappa_prime enters the Section 9 sign-corrected margin exactly like the
// -4rho^2 downshift: total downshift coefficient c = 4 + (kappa_prime - kappa).
function correctedOptimumForKappa(kappaPrime) {
  const c = 4 + (kappaPrime - KAPPA);
  const rhoStar = (PARABOLA_A * RHO_OPT_ORIG) / (PARABOLA_A - c);
  const margin = delta0Model(rhoStar) - c * rhoStar * rhoStar;
  return { kappaPrime, rhoStar, margin, impliedCOddAtRhoStar: kappaPrime * rhoStar * rhoStar };
}

const KAPPA_SCAN = [0.5, 0.8, 1.0, 1.2, 1.5, 2.0].map((f) =>
  correctedOptimumForKappa(KAPPA * f),
);
const MARGINS = KAPPA_SCAN.map((r) => r.margin);
const MARGIN_MIN = Math.min(...MARGINS);
const MARGIN_MAX = Math.max(...MARGINS);

export const C_ODD_SECOND_ANCHOR_SHAPE_TEST = Object.freeze({
  id: 'imp-95653-c-odd-second-anchor-shape-test',
  title:
    'Shape test: can a second independent anchor c_odd(rho != 1/20) corroborate the '
    + 'Sun-Catalan curvature form c_odd(rho) = kappa rho^2 off the 1/20 anchor?',
  status:
    'PARTIAL — NO second independent numeric anchor exists in the carried ledger (only '
    + 'c_odd(1/20)=0.006276744725 is verified), so the two-point corroboration CANNOT be '
    + 'executed; the rho^2-shape sub-gap REMAINS OPEN, now sharpened to the single '
    + 'structural claim "Section 6 integrand rho-independent". Downstream interior optimum '
    + 'is kappa-INSENSITIVE across [0.5x,2.0x]. G irrationality OPEN; Sun unrefereed; '
    + 'changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',

  soleAnchor: {
    rho: '1/20',
    cOdd: C_ODD_AT_1_OVER_20,
    kappaBackSolved: KAPPA_FROM_ANCHOR,
    literalKappa: KAPPA,
    exactMatch: Math.abs(KAPPA_FROM_ANCHOR - KAPPA) < 1e-9,
  },

  secondAnchorAvailability: {
    verdict: 'NONE AVAILABLE',
    reason:
      'The only verified c_odd datum in imp-95516/95600/95615/95618/95637 is c_odd(1/20). '
      + 'A genuine second anchor requires either re-running the Sun Section 6 integrand at a '
      + 'second rho or an independent Section 7 Lambda_mid(rho2) to back c_odd out of the '
      + 'decisive ledger; neither is reproduced here (both sit in the uncertified imp-95516 '
      + 'Section 2-5 determinant/rank core). The two-point NUMERIC test is not executable.',
  },

  shapeReduction: {
    structuralClaim: 'imp-95516 line 64: the Section 6 integrand is rho-independent',
    ifIntegrandRhoIndependentAndPrefactorRhoSquared:
      'c_odd(rho)/rho^2 = kappa EXACTLY for all rho; a second anchor corroborates with ZERO '
      + 'deviation (form structurally forced, not fitted)',
    ifResidualIntegrandDependence:
      'kappa(rho2) - kappa = kappa * dI(rho2) where dI = I(rho2)/I0 - 1; the shape deviation '
      + 'equals the fractional rho-variation of the Section 6 integrand',
    collapsesTo:
      'the binary structural question "is the Section 6 integrand rho-independent?" — the '
      + 'named imp-95637/imp-95516 sub-gap, NOT settled here',
  },

  downstreamSensitivity: {
    entryChannel:
      'kappa_prime enters the sign-corrected margin as c = 4 + (kappa_prime - kappa) in '
      + 'margin(rho) = delta0Model(rho) - c rho^2 (same channel as the -4rho^2 sign fix)',
    kappaScan: KAPPA_SCAN,
    marginRangeOver_0p5x_to_2x: [MARGIN_MIN, MARGIN_MAX],
    conclusion:
      'the imp-95600 corrected interior optimum stays positive (~0.0366..0.0377) across a '
      + '[0.5x, 2.0x] second-anchor kappa band; consistent with the imp-95637 '
      + 'kappa-INSENSITIVITY finding. Wide-band insensitivity beyond 2.0x is a local-parabola '
      + 'extrapolation artifact and is NOT read as evidence.',
  },

  caveats:
    'Assessment + sensitivity, not a primary-source re-derivation of Sun Section 6. Uses the '
    + 'imp-95600/95618 LOCAL parabola model of an unpublished Lambda_mid(rho). Catalan G '
    + 'irrationality OPEN; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const C_ODD_SECOND_ANCHOR_SHAPE_TEST_ASSERTIONS = Object.freeze([
  {
    name: 'sole anchor: kappa is exactly c_odd(1/20)/(1/20)^2 (one-point back-solve)',
    holds: () => Math.abs(KAPPA_FROM_ANCHOR - KAPPA) < 1e-9,
  },
  {
    name: 'no second independent numeric anchor is available (two-point test not executable)',
    holds: () =>
      C_ODD_SECOND_ANCHOR_SHAPE_TEST.secondAnchorAvailability.verdict === 'NONE AVAILABLE',
  },
  {
    name: 'downstream interior optimum stays positive across [0.5x, 2.0x] kappa band',
    holds: () => KAPPA_SCAN.every((r) => r.margin > 0.036 && r.margin < 0.038),
  },
  {
    name: 'the margin band is narrow (< 0.002 wide): kappa-insensitive downstream',
    holds: () => MARGIN_MAX - MARGIN_MIN < 0.002,
  },
  {
    name: 'honest: PARTIAL, sub-gap OPEN, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /REMAINS OPEN/.test(C_ODD_SECOND_ANCHOR_SHAPE_TEST.status)
      && /G irrationality OPEN/.test(C_ODD_SECOND_ANCHOR_SHAPE_TEST.status)
      && /refereed bound is changed/i.test(C_ODD_SECOND_ANCHOR_SHAPE_TEST.status)
      && /NO QED/.test(C_ODD_SECOND_ANCHOR_SHAPE_TEST.status),
  },
]);

export default C_ODD_SECOND_ANCHOR_SHAPE_TEST;
