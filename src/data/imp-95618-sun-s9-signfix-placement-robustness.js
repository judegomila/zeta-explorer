/**
 * @fileoverview imp-95618 — ASSESSMENT: is the imp-95600 verdict robust to WHICH
 * B-squared term carries Sun's flagged Section 9 sign error?
 *
 * Context. imp-95600-sun-s9-signfix-rho-margin-assessment repaired Sun's flagged
 * wrong-sign B-squared term under ONE reading: the (9.4) quadratic 4 rho - 2 rho^2
 * should read 4 rho + 2 rho^2, equivalently delta_0_corr(rho) = delta_0(rho) - 4 rho^2.
 * Under that reading it reported (a) Sun's literal rho = 1/20 margin flips NEGATIVE
 * and (b) the interior optimum survives near rho* ~ 1/56. But rho^2 = S^2 / B^2
 * appears in THREE ledger terms, and Sun's note only says a B-squared term has the
 * wrong sign — it does not pin which one. This module tests the two other plausible
 * placements and asks whether the imp-95600 conclusions are robust to the choice.
 *
 * The ledger (from imp-95516 / imp-95600):
 *   delta_0(rho) = Lambda_mid(rho) + Delta_gtB(rho) - c_odd(rho) - (4 rho - 2 rho^2)
 *   Delta_gtB(rho) = (2/3) rho + (1/2) rho^2      <- carries a rho^2 = S^2/B^2 term
 *   c_odd(rho)     = kappa rho^2, kappa = 2.51069789  <- carries a rho^2 = S^2/B^2 term
 *   (4 rho - 2 rho^2)                              <- carries a rho^2 = S^2/B^2 term (9.4)
 * Local parabola model of delta_0(rho) pinned by the three reported facts
 *   (delta_0(1/50)=0.038723, delta_0-prime(1/50)=0, delta_0(1/20)=0.00966243),
 *   giving curvature A = -32.28952 (identical to imp-95600).
 *
 * The three sign-flip placements. Flipping the sign of the flagged rho^2 term adds a
 * pure coefficient*rho^2 shift to delta_0 (twice the term, because the sign reverses):
 *   A  (9.4) quadratic:  -2 rho^2 -> +2 rho^2 inside -(4rho-2rho^2)  => shift = -4 rho^2
 *      (the imp-95600 reading)
 *   B  Delta_gtB:        +(1/2)rho^2 -> -(1/2)rho^2 inside +Delta_gtB => shift = -1 rho^2
 *   C  c_odd:            +kappa rho^2 -> -kappa rho^2 inside -c_odd   => shift = +2 kappa rho^2
 *      (= +5.02140 rho^2, an UPSHIFT because c_odd is subtracted)
 * Corrected optimum of A(rho-r0)^2 + D0_opt + coef*rho^2 is rho* = A r0 / (A + coef);
 * corrected margin at any rho is delta_0(rho) + coef*rho^2.
 *
 * FINDINGS (numbers recomputed below):
 *   placement        shift coef   rho*        margin(1/20)
 *   A (9.4)          -4.00000      1/56.19     -0.000338   (NEGATIVE)
 *   B (Delta_gtB)    -1.00000      1/51.55     +0.007162   (POSITIVE)
 *   C (c_odd)        +5.02140      1/42.22     +0.022216   (POSITIVE, improves)
 *
 *  - The imp-95600 headline "Sun's literal rho=1/20 margin goes NEGATIVE" is SPECIFIC
 *    to placement A. Under B the margin stays +0.007162; under C it stays +0.022216
 *    (larger than the uncorrected 0.00966243). Only the (9.4)-quadratic reading, whose
 *    downshift coefficient (4) is the largest of the three, is big enough to overrun
 *    the razor-thin 0.00966 gate. So the "goes negative" verdict is NOT robust to which
 *    B-squared term carries the sign error.
 *  - The imp-95600 headline "interior optimum near rho* ~ 1/56" is ALSO SPECIFIC to A.
 *    B leaves the optimum essentially where it was (rho* ~ 1/51.5); C pushes it OUTWARD
 *    to rho* ~ 1/42.2 (the upshift adds positive curvature, flattening the descent).
 *  - What IS robust across all three placements: an interior POSITIVE-margin optimum
 *    EXISTS in (0, 1/20) with delta_0_corr(rho*) > 0.037 (0.0373 / 0.0383 / 0.0411).
 *    The qualitative "rho-optimization rescues a positive margin" survives every
 *    placement; only the quantitative "1/20 goes negative" and "near 1/56" claims are
 *    placement-A-specific.
 *
 * VERDICT: the imp-95600 conclusions are placement-dependent. The interior positive
 * optimum is robust to which B-squared term is repaired, but the two sharp claims
 * (Sun's literal margin flips negative; optimum lands near 1/56) hold ONLY under the
 * (9.4)-quadratic reading, and follow from that reading carrying the largest downshift
 * coefficient. This is an assessment atop a LOCAL parabolic model of an unpublished
 * Lambda_mid(rho) and three candidate readings of "wrong-sign B-squared"; it is not a
 * primary-source re-derivation of Section 9 nor a certification of any placement.
 *
 * Catalan constant G irrationality remains OPEN; Sun arXiv:2609.04176 single-author and
 * unrefereed; changes no bound; NO Lambda movement; no refereed bound is changed; NO QED.
 *
 * NO heavy imports. All figures baked as literals / recomputed from the ledger.
 */

const KAPPA = 2.51069789;
const RHO_OPT_ORIG = 1 / 50; // 0.02
const D0_OPT_ORIG = 0.038723;
const D0_AT_1_OVER_20 = 0.00966243;
const PARABOLA_A =
  (D0_AT_1_OVER_20 - D0_OPT_ORIG) / Math.pow(1 / 20 - RHO_OPT_ORIG, 2); // ~ -32.28952

// Local parabola model of delta_0(rho) (identical to imp-95600).
function delta0Model(rho) {
  return PARABOLA_A * Math.pow(rho - RHO_OPT_ORIG, 2) + D0_OPT_ORIG;
}

// A sign-flip placement adds a pure coef*rho^2 shift; recompute optimum + gate margin.
function placement(coef) {
  const rhoStar = (PARABOLA_A * RHO_OPT_ORIG) / (PARABOLA_A + coef);
  const marginAtOpt = delta0Model(rhoStar) + coef * rhoStar * rhoStar;
  const marginAt1over20 = delta0Model(1 / 20) + coef * (1 / 20) * (1 / 20);
  return {
    shiftCoef: coef,
    rhoStar,
    rhoStarInverse: 1 / rhoStar,
    marginAtOpt,
    marginAt1over20,
    optimumInterior: rhoStar > 0 && rhoStar < 1 / 20,
    marginAt1over20Negative: marginAt1over20 < 0,
  };
}

const PLACEMENT_A = placement(-4);          // (9.4) quadratic — imp-95600 reading
const PLACEMENT_B = placement(-1);          // Delta_gtB rho^2 term
const PLACEMENT_C = placement(2 * KAPPA);   // c_odd rho^2 term (upshift)

export const SUN_S9_SIGNFIX_PLACEMENT_ROBUSTNESS = Object.freeze({
  id: 'imp-95618-sun-s9-signfix-placement-robustness',
  title:
    'Assessment: is the imp-95600 "rho=1/20 goes negative / optimum near 1/56" verdict '
    + 'robust to WHICH B-squared term carries Sun Section 9 sign error?',
  status:
    'ASSESSMENT — both sharp imp-95600 claims are PLACEMENT-A-SPECIFIC (only the (9.4) '
    + 'reading flips rho=1/20 negative and lands the optimum near 1/56); an interior '
    + 'positive optimum EXISTS under all three placements; '
    + 'G irrationality OPEN; Sun unrefereed; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  parabolaCurvatureA: PARABOLA_A,
  kappa: KAPPA,

  placements: {
    A_94quadratic: PLACEMENT_A,   // shift -4 rho^2, rho*~1/56, margin(1/20) NEGATIVE
    B_DeltaGtB: PLACEMENT_B,      // shift -1 rho^2, rho*~1/51.5, margin(1/20) +0.00716
    C_cOdd: PLACEMENT_C,          // shift +5.0214 rho^2, rho*~1/42.2, margin(1/20) +0.02222
  },

  robustConclusion:
    'An interior positive-margin optimum rho* in (0, 1/20) with delta_0_corr(rho*) > 0.037 '
    + 'exists under ALL three placements — the qualitative "rho-optimization rescues a '
    + 'positive corrected margin" is placement-robust.',

  fragileConclusions:
    'BOTH sharp imp-95600 claims are specific to placement A (the (9.4) quadratic reading): '
    + '(i) "Sun literal rho=1/20 margin goes negative" holds only for A (-0.00034); under B '
    + 'it is +0.00716 and under C +0.02222. (ii) "interior optimum near rho*~1/56" holds only '
    + 'for A; B keeps it near 1/51.5, C pushes it outward to ~1/42.2. Placement A is the '
    + 'decisive reading precisely because its downshift coefficient (4) is the largest and '
    + 'the only one big enough to overrun the razor-thin 0.00966 gate.',

  caveats:
    'LOCAL parabolic model of an unpublished Lambda_mid(rho); three CANDIDATE readings of '
    + '"wrong-sign B-squared" (only one can be the actual error). Not a primary-source '
    + 're-derivation of Section 9 nor a certification of any placement. The imp-95516 sub-gap '
    + '(uncertified S2-S5 determinant/rank core and the raw (9.4) coefficient) is untouched; '
    + 'Catalan G irrationality OPEN; NO Lambda movement.',
});

export const SUN_S9_SIGNFIX_PLACEMENT_ROBUSTNESS_ASSERTIONS = Object.freeze([
  {
    name: 'placement A reproduces the imp-95600 result: rho*~1/56, margin(1/20) NEGATIVE',
    holds: () =>
      PLACEMENT_A.marginAt1over20 < 0
      && Math.abs(PLACEMENT_A.marginAt1over20 + 0.00033757) < 1e-6
      && PLACEMENT_A.rhoStarInverse > 55 && PLACEMENT_A.rhoStarInverse < 57,
  },
  {
    name: 'placement B (Delta_gtB) keeps rho=1/20 margin POSITIVE (~+0.00716)',
    holds: () =>
      PLACEMENT_B.marginAt1over20 > 0
      && Math.abs(PLACEMENT_B.marginAt1over20 - 0.007162) < 1e-5,
  },
  {
    name: 'placement C (c_odd) keeps rho=1/20 margin POSITIVE and IMPROVES it (~+0.02222)',
    holds: () =>
      PLACEMENT_C.marginAt1over20 > D0_AT_1_OVER_20
      && Math.abs(PLACEMENT_C.marginAt1over20 - 0.022216) < 1e-5,
  },
  {
    name: 'optimum location NOT robust: A~1/56, B~1/51.5, C~1/42.2 (all distinct, all interior)',
    holds: () =>
      PLACEMENT_A.optimumInterior && PLACEMENT_B.optimumInterior && PLACEMENT_C.optimumInterior
      && PLACEMENT_A.rhoStarInverse > PLACEMENT_B.rhoStarInverse
      && PLACEMENT_B.rhoStarInverse > PLACEMENT_C.rhoStarInverse,
  },
  {
    name: 'ROBUST across placements: interior optimum margin > 0.037 in every case',
    holds: () =>
      PLACEMENT_A.marginAtOpt > 0.037
      && PLACEMENT_B.marginAtOpt > 0.037
      && PLACEMENT_C.marginAtOpt > 0.037,
  },
  {
    name: 'honest: assessment only, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /G irrationality OPEN/.test(SUN_S9_SIGNFIX_PLACEMENT_ROBUSTNESS.status)
      && /refereed bound is changed/i.test(SUN_S9_SIGNFIX_PLACEMENT_ROBUSTNESS.status)
      && /NO QED/.test(SUN_S9_SIGNFIX_PLACEMENT_ROBUSTNESS.status),
  },
]);

for (const a of SUN_S9_SIGNFIX_PLACEMENT_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95618-sun-s9-signfix-placement-robustness assertion failed: ${a.name}`);
  }
}

export default SUN_S9_SIGNFIX_PLACEMENT_ROBUSTNESS;
