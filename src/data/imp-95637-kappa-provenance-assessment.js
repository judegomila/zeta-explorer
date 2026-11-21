/**
 * @fileoverview imp-95637 — ASSESSMENT: provenance/certification status of the
 * Sun-Catalan c_odd curvature constant kappa = 2.51069789.
 *
 * The odd-part curvature constant kappa appears identically as a bare literal in
 * imp-95516 (kappa: 2.51069789), imp-95600 (const KAPPA = 2.51069789), and
 * imp-95618 (const KAPPA = 2.51069789), setting c_odd(rho) = kappa rho^2 and, via
 * placement C, the +2 kappa rho^2 upshift of the corrected optimum. imp-95615
 * inherits the SAME ledger through the derived curvature A (= -32.28952) but does
 * NOT re-declare the literal. This module traces where kappa comes from, rates its
 * certification, and measures how much the imp-95618 placement-robust conclusion
 * ("an interior positive optimum with delta_0_corr(rho*) > 0.037 exists") depends
 * on it.
 *
 * PROVENANCE (exact, verified by arithmetic below).
 *   imp-95516 records ONE independently VERIFIED datum: c_odd(1/20) = 0.006276744725
 *   ("correct to all printed digits", a prior spurious erratum refuted). The literal
 *   kappa is NOT a separate quantity derived from Sun Section 6-9 machinery: it is the
 *   one-point back-solve of the ASSUMED functional form c_odd(rho) = kappa rho^2 at the
 *   single anchor rho = 1/20:
 *       kappa = c_odd(1/20) / (1/20)^2 = 0.006276744725 / 0.0025 = 2.51069789  (exact).
 *   So kappa inherits EXACTLY the certification of c_odd(1/20): VERIFIED as a value at
 *   the anchor. But its ROLE as a curvature -- the rho^2 shape that lets c_odd be
 *   evaluated (and differentiated) away from 1/20 -- rests on the rho^2 functional form
 *   being exact, which is taken as Sun states it. The rho^2 form and the underlying
 *   Section 2-5 determinant/rank core are the named imp-95516 sub-gap and are NOT
 *   independently re-derived here.
 *
 * VERDICT ON kappa.
 *   - As a NUMBER at rho = 1/20: a DISCHARGED constant (rides on the verified c_odd(1/20)).
 *   - As a CURVATURE constant governing c_odd off the anchor: an OPEN sub-gap -- it is a
 *     single-point fit of an uncertified rho^2 form, not a point-by-point certification.
 *   It is therefore neither a fully certified quantity nor a raw unverified transcription;
 *   it is anchor-verified but shape-uncertified.
 *
 * SENSITIVITY of the imp-95618 robust conclusion to a +/- band on kappa.
 *   kappa enters imp-95618 ONLY through placement C (shift coefficient +2 kappa). The two
 *   other placements are kappa-free: A (shift -4) gives marginAtOpt = 0.03730 and B (shift
 *   -1) gives 0.03834. The placement-robust claim "delta_0_corr(rho*) > 0.037 in EVERY
 *   placement" is therefore BINDING at placement A (0.03730), which does not use kappa at
 *   all. Scanning placement C over kappa in [0.5x, 2.0x] of 2.51069789 moves its
 *   marginAtOpt only within [0.03981, 0.04455] -- always > 0.037. So the robust "> 0.037"
 *   conclusion is INSENSITIVE to kappa: the binding case is kappa-free, and the one case
 *   that uses kappa stays above threshold across a wide band. (The sharp imp-95600/95618
 *   claims that are placement-A-specific -- "rho=1/20 goes negative", "optimum near 1/56"
 *   -- are likewise kappa-free, since A does not use kappa.)
 *
 * This is an assessment of a carried literal, not a primary-source re-derivation of
 * Sun Section 6. Catalan constant G irrationality remains OPEN; Sun arXiv:2609.04176
 * single-author and unrefereed; changes no bound; NO Lambda movement; no refereed bound is changed
 * ; NO QED.
 *
 * HONEST-STATUS UPDATE (imp-95690, later primary-source check): the "OPEN sub-gap"
 * verdict on kappa-as-curvature below is now SUPERSEDED by a REFUTATION, not just left
 * open. imp-95690 read Sun Prop 6.3 (eqs 6.1-6.25) directly and found the rho^2 PREFACTOR
 * structurally FORCED, but the v-integral factor J(rho) is NOT rho-independent as written
 * -- its Q_0(v) piece is built from moduli (1/rho, 2/rho, 2/rho+1) and a leading
 * -(4/rho-1)/2 coefficient that all rescale off rho = 1/20. So kappa*rho^2 is not a
 * structurally forced shape; it stays a one-point fit, now with a NAMED mechanism for why
 * it need not hold off-anchor. The sensitivity conclusion below (kappa-insensitive,
 * bound by kappa-free placement A) is unaffected, since it never assumed the shape held.
 *
 * NO heavy imports. All figures baked as literals / recomputed from the ledger.
 */

const KAPPA = 2.51069789;
const C_ODD_AT_1_OVER_20 = 0.006276744725; // imp-95516 VERIFIED anchor datum
const RHO_ANCHOR = 1 / 20;

// Back-solve of the assumed rho^2 form at the single anchor -> reproduces kappa exactly.
const KAPPA_FROM_ANCHOR = C_ODD_AT_1_OVER_20 / (RHO_ANCHOR * RHO_ANCHOR);

// imp-95618 local parabola (identical inputs) so the sensitivity is self-contained.
const RHO_OPT_ORIG = 1 / 50;
const D0_OPT_ORIG = 0.038723;
const D0_AT_1_OVER_20 = 0.00966243;
const PARABOLA_A =
  (D0_AT_1_OVER_20 - D0_OPT_ORIG) / Math.pow(RHO_ANCHOR - RHO_OPT_ORIG, 2);

function delta0Model(rho) {
  return PARABOLA_A * Math.pow(rho - RHO_OPT_ORIG, 2) + D0_OPT_ORIG;
}
// Placement C uses coef = 2*kappa; recompute its interior-optimum margin for a given kappa.
function placementCMarginAtOpt(kappa) {
  const coef = 2 * kappa;
  const rhoStar = (PARABOLA_A * RHO_OPT_ORIG) / (PARABOLA_A + coef);
  return delta0Model(rhoStar) + coef * rhoStar * rhoStar;
}

const KAPPA_BAND = [0.5, 0.8, 0.9, 1.0, 1.1, 1.2, 1.5, 2.0].map((f) => ({
  factor: f,
  kappa: KAPPA * f,
  placementCMarginAtOpt: placementCMarginAtOpt(KAPPA * f),
}));

// kappa-free binding placements (from imp-95618): A (shift -4), B (shift -1).
function placementMarginAtOpt(coef) {
  const rhoStar = (PARABOLA_A * RHO_OPT_ORIG) / (PARABOLA_A + coef);
  return delta0Model(rhoStar) + coef * rhoStar * rhoStar;
}
const PLACEMENT_A_MARGIN = placementMarginAtOpt(-4); // kappa-free, binding at 0.0373
const PLACEMENT_B_MARGIN = placementMarginAtOpt(-1); // kappa-free

export const KAPPA_PROVENANCE_ASSESSMENT = Object.freeze({
  id: 'imp-95637-kappa-provenance-assessment',
  title:
    'Assessment: provenance/certification of the Sun-Catalan c_odd curvature constant '
    + 'kappa = 2.51069789 carried across imp-95516/95600/95615/95618',
  status:
    'ASSESSMENT — kappa is the one-point back-solve of the ASSUMED c_odd(rho)=kappa rho^2 '
    + 'form at the verified anchor c_odd(1/20)=0.006276744725: DISCHARGED as a value at '
    + '1/20, OPEN sub-gap as a curvature (rho^2 shape uncertified). The imp-95618 robust '
    + '"> 0.037" conclusion is kappa-INSENSITIVE (binding placement A is kappa-free); '
    + 'G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',

  carriedIn: {
    literalDeclarations: ['imp-95516 (kappa: 2.51069789)', 'imp-95600 (KAPPA)', 'imp-95618 (KAPPA)'],
    inheritsViaDerivedCurvature: ['imp-95615 (uses A=-32.28952, does NOT re-declare kappa)'],
  },

  provenance: {
    verifiedAnchor: C_ODD_AT_1_OVER_20,
    assumedForm: 'c_odd(rho) = kappa rho^2',
    kappaBackSolvedFromAnchor: KAPPA_FROM_ANCHOR,
    literalKappa: KAPPA,
    exactMatch: Math.abs(KAPPA_FROM_ANCHOR - KAPPA) < 1e-9,
    note:
      'kappa is not an independent Section 6 output; it is c_odd(1/20)/(1/20)^2. It carries '
      + 'the certification of the single verified anchor, not of the rho^2 shape off it.',
  },

  verdict: {
    asValueAtAnchor: 'DISCHARGED — rides on the imp-95516-verified c_odd(1/20)=0.006276744725',
    asCurvatureOffAnchor:
      'OPEN sub-gap — single-point fit of an uncertified rho^2 form; the Section 2-5 core and '
      + 'the rho^2 shape are the named imp-95516 sub-gap, not re-derived here',
  },

  sensitivity: {
    kappaEntersImp95618Only: 'placement C (shift coefficient +2 kappa); placements A, B are kappa-free',
    bindingKappaFreePlacementAMarginAtOpt: PLACEMENT_A_MARGIN, // ~0.0373 -- sets the "> 0.037" floor
    placementBMarginAtOpt: PLACEMENT_B_MARGIN,                 // ~0.0383, also kappa-free
    placementCBand: KAPPA_BAND, // marginAtOpt across kappa in [0.5x, 2.0x]; all > 0.037
    conclusion:
      'The placement-robust "> 0.037" conclusion is INSENSITIVE to kappa: it is bound by the '
      + 'kappa-free placement A (0.0373), and placement C (the only kappa-user) stays in '
      + '[0.0398, 0.0446] across a +/-50%..+100% band, always above 0.037.',
  },

  caveats:
    'Assessment of a carried literal, not a primary-source re-derivation of Sun Section 6. '
    + 'Local parabolic model of an unpublished Lambda_mid(rho) inherited from imp-95618. '
    + 'Catalan G irrationality OPEN; NO Lambda movement.',

  honestStatusUpdate: {
    supersededBy: 'imp-95690-sun-s6-integrand-rho-independence-verdict',
    change:
      'the "OPEN sub-gap" verdict on kappa-as-curvature above is SUPERSEDED by a REFUTATION: '
      + 'imp-95690 read Sun Prop 6.3 directly and found the rho^2 prefactor FORCED but the '
      + 'v-integral factor J(rho) NOT rho-independent as written (its Q_0(v) moduli rescale '
      + 'off rho=1/20), so kappa*rho^2 is not structurally forced off the single anchor.',
    unaffected:
      'the kappa-insensitivity sensitivity result above (bound by kappa-free placement A) '
      + 'still holds -- it never assumed the rho^2 shape was structurally forced.',
  },
});

export const KAPPA_PROVENANCE_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    name: 'kappa is exactly c_odd(1/20)/(1/20)^2 (one-point back-solve of the rho^2 form)',
    holds: () => Math.abs(KAPPA_FROM_ANCHOR - KAPPA) < 1e-9,
  },
  {
    name: 'the "> 0.037" floor is set by the kappa-free placement A (~0.0373)',
    holds: () =>
      PLACEMENT_A_MARGIN > 0.037
      && PLACEMENT_A_MARGIN < PLACEMENT_B_MARGIN
      && Math.abs(PLACEMENT_A_MARGIN - 0.03730) < 1e-4,
  },
  {
    name: 'placement C marginAtOpt stays > 0.037 across a [0.5x, 2.0x] kappa band',
    holds: () => KAPPA_BAND.every((b) => b.placementCMarginAtOpt > 0.037),
  },
  {
    name: 'honest: assessment only, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /G irrationality OPEN/.test(KAPPA_PROVENANCE_ASSESSMENT.status)
      && /refereed bound is changed/i.test(KAPPA_PROVENANCE_ASSESSMENT.status)
      && /NO QED/.test(KAPPA_PROVENANCE_ASSESSMENT.status),
  },
  {
    name: 'honest-status update flags the imp-95690 refutation of the rho^2 shape',
    holds: () =>
      KAPPA_PROVENANCE_ASSESSMENT.honestStatusUpdate.supersededBy
      === 'imp-95690-sun-s6-integrand-rho-independence-verdict'
      && /REFUTATION/.test(KAPPA_PROVENANCE_ASSESSMENT.honestStatusUpdate.change),
  },
]);

export default KAPPA_PROVENANCE_ASSESSMENT;
