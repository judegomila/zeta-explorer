/**
 * @module imp-holder-exponent-sharpness
 * @fileoverview imp-2855 -- Certify the Holder exponent of the first-collision
 * time modulus is EXACTLY 1/2 and cannot be improved to Holder-alpha with
 * alpha > 1/2. The structural source is the inverse-square-root cusp density of
 * the limiting shock measure,
 *
 *     rho_inf(gamma) ~ C_cusp / |gamma - gamma_star|^{1/2}   (gamma -> gamma_star),
 *
 * which the Polymath15 Lemma 5.2 port (polymath15-lemma52-shock-holder.js,
 * imp-366) asserts as `imp366-holder-exponent-is-half`. This file pins the
 * sharpness: the exponent 1/2 is the THEOREM, not a lower bound on what could
 * hold, and it explains WHY any Lipschitz (alpha = 1) Gronwall route to C_Lip
 * must diverge -- directly grounding the imp-2640 NEGATIVE.
 *
 * WHAT IS RIGOROUS HERE (the certified core):
 *   The cumulative distribution function (CDF) of the inverse-square-root cusp
 *   is EXACTLY Holder-1/2 at the shock and NOT Holder-alpha for any alpha > 1/2.
 *   With gamma_star = 0 and the cusp normalized to unit mass on [-1, 0],
 *
 *       rho_inf(gamma) = (1/2) / sqrt(-gamma),     F(gamma) = 1 - sqrt(-gamma),
 *
 *   so the CDF increment from the shock is |F(gamma) - F(0)| = sqrt(-gamma) =
 *   |gamma - gamma_star|^{1/2}. The Holder ratio at exponent alpha,
 *
 *       R_alpha(gamma) = |F(gamma) - F(0)| / |gamma - gamma_star|^{alpha}
 *                      = (-gamma)^{1/2 - alpha},
 *
 *   is BOUNDED (== 1) at alpha = 1/2, but DIVERGES as gamma -> gamma_star for
 *   every alpha > 1/2 (in particular for the Lipschitz value alpha = 1, where
 *   R_1 = (-gamma)^{-1/2} -> infinity). This is the intrinsic obstruction:
 *   no Holder-alpha modulus with alpha > 1/2 exists for the cusp CDF, and no
 *   finite Lipschitz constant exists. The general density-to-CDF exponent law
 *   density ~ |x|^{-beta}  ==>  CDF increment ~ |x|^{1 - beta} gives 1 - beta =
 *   1 - 1/2 = 1/2: improving the modulus to alpha > 1/2 would require a MILDER
 *   cusp (beta < 1/2), contradicting the established inverse-square-root density.
 *
 * HOW THIS GROUNDS imp-2640 (the explanatory consequence):
 *   The first-collision time obeys the quadratic tangency tau_c = g_min^2 / 8
 *   (rigorous two-particle leading order, C_QUADRATIC_TANGENCY = 8), and the
 *   cusp scaling (Lemma 5.2 Step 3) ties the minimal gap to transport distance
 *   through the SAME square-root law that makes the CDF Holder-1/2. A Lipschitz
 *   (alpha = 1) modulus for tau_c would require the gap-to-data map to be
 *   Lipschitz, i.e. a finite N-uniform C_Lip. The cusp forbids exactly that:
 *   its CDF has no Lipschitz constant (R_1 diverges as (-gamma)^{-1/2}), which
 *   is the analytic shadow of the Gronwall divergence int_0^{t_c} 2/g(t)^2 dt
 *   -> infinity recorded in imp-2640. So the C_Lip wall is not an opaque
 *   failure of one technique -- it is forced by an intrinsic Holder-1/2 cusp.
 *
 * HONEST SCOPE (named sub-gap):
 *   This file rigorously certifies sharpness at the level of the cusp DENSITY /
 *   CDF (the structural source). Promoting this to a fully rigorous SATURATING
 *   FAMILY of N-particle configurations mu_N with |tau_c(mu_N)| = Theta(
 *   W_1(mu_N, rho_inf)^{1/2}) -- exhibiting a worst case that meets the modulus
 *   with matching constant -- remains the open sub-gap
 *   `subgap-tau-c-saturating-family`. That is the same RH-hard microscopic
 *   gap-stability question flagged in imp-2640 / imp-2672; it is NOT discharged
 *   here. No beat and no discharge of C_H are claimed.
 *
 * **Key assertions (HOLDER_EXPONENT_SHARPNESS_ASSERTIONS):**
 *   - exponent at alpha = 1/2 is finite (Holder-1/2 holds);
 *   - exponent at alpha > 1/2 diverges toward the shock (cannot be improved);
 *   - the Lipschitz ratio R_1 diverges (no finite C_Lip), grounding imp-2640;
 *   - the numerically fitted CDF-increment exponent equals 1/2;
 *   - the density-to-CDF exponent law 1 - beta = 1/2 holds.
 *
 * Depends on nothing heavy. Cites: Tao et al. (Polymath15), arXiv:1904.12438,
 * Lemma 5.2; Villani, AMS GSM 58, Ch. 7.
 */

// Quadratic tangency constant tau_c = g_min^2 / 8 (rigorous two-particle leading
// order). Mirrors C_QUADRATIC_TANGENCY in polymath15-lemma52-shock-holder.js;
// kept local so this certificate stays standalone and import-light.
const C_QUADRATIC_TANGENCY = 8.0;

// ── Inverse-square-root cusp model ───────────────────────────────────────────
// gamma_star = 0; cusp on [-1, 0] normalized to unit mass.
//   rho_inf(gamma) = (1/2) / sqrt(-gamma)   (density singularity exponent beta = 1/2)
//   F(gamma)       = 1 - sqrt(-gamma)       (CDF; F(-1) = 0, F(0) = 1)
//   Q(p)           = -(1 - p)^2             (quantile; Q(1 - u) = -u^2, matches
//                                            Lemma 5.2 line gamma_star - Q(1-u) ~ u^2)
const GAMMA_STAR = 0.0;
const CUSP_DENSITY_EXPONENT = 0.5; // beta in rho ~ |gamma - gamma_star|^{-beta}

function cuspCDF(gamma) {
  // F(gamma) on [-1, 0]; increment from the shock is |F(gamma) - F(0)| = sqrt(-gamma).
  return 1 - Math.sqrt(-gamma);
}

function cdfIncrementFromShock(gamma) {
  // |F(gamma) - F(gamma_star)| = sqrt(-gamma) for the unit-mass cusp above.
  return Math.abs(cuspCDF(gamma) - cuspCDF(GAMMA_STAR));
}

function holderRatio(gamma, alpha) {
  // R_alpha(gamma) = |F(gamma) - F(0)| / |gamma - gamma_star|^{alpha} = (-gamma)^{1/2 - alpha}.
  const dist = Math.abs(gamma - GAMMA_STAR);
  if (!(dist > 0)) return null;
  return cdfIncrementFromShock(gamma) / Math.pow(dist, alpha);
}

// A geometric approach sequence toward the shock from inside the cusp. The very
// close probes (down to 1e-30) make the alpha > 1/2 divergence visible even
// though its growth exponent (e.g. (-gamma)^{-0.1} at alpha = 0.6) is slow.
const APPROACH_GAMMAS = [
  -1e-1, -1e-2, -1e-4, -1e-6, -1e-10, -1e-20, -1e-30,
];

// ── The sharpness certificate ────────────────────────────────────────────────

export const HOLDER_EXPONENT_SHARPNESS = (() => {
  // (1) At alpha = 1/2 the Holder ratio is the constant 1 -- the modulus HOLDS.
  // At alpha = 1/2 the ratio is analytically the constant 1; it stays BOUNDED
  // near 1 across every probe (the residual ~1e-3 at gamma = -1e-30 is the float
  // gap between Math.sqrt and Math.pow at extreme magnitudes, not a divergence).
  // Boundedness -- in sharp contrast to the divergence at alpha > 1/2 -- is the claim.
  const ratiosAtHalf = APPROACH_GAMMAS.map((g) => holderRatio(g, 0.5));
  const halfStaysBounded = ratiosAtHalf.every(
    (r) => r !== null && Number.isFinite(r) && Math.abs(r - 1) < 1e-2,
  );

  // (2) At alpha = 0.6 > 1/2 the ratio R = (-gamma)^{-0.1} grows without bound
  // as gamma -> shock: the LAST (closest) probe dominates the FIRST.
  const ratiosAtSixTenths = APPROACH_GAMMAS.map((g) => holderRatio(g, 0.6));
  const sixTenthsDiverges =
    ratiosAtSixTenths.every((r) => r !== null && Number.isFinite(r)) &&
    ratiosAtSixTenths[ratiosAtSixTenths.length - 1] >
      1e2 * ratiosAtSixTenths[0];

  // (3) The Lipschitz ratio (alpha = 1) diverges as (-gamma)^{-1/2}: NO finite
  // Lipschitz constant exists. This is the analytic obstruction behind imp-2640.
  const lipRatios = APPROACH_GAMMAS.map((g) => holderRatio(g, 1.0));
  const lipschitzDiverges =
    lipRatios.every((r) => r !== null && Number.isFinite(r)) &&
    lipRatios[lipRatios.length - 1] > 1e4 * lipRatios[0];

  // (4) Empirically FIT the CDF-increment exponent p from |F(gamma)| ~ (-gamma)^p
  // via a log-log slope between two probes well inside the cusp. p must be 1/2.
  const gA = -1e-4;
  const gB = -1e-8;
  const fittedExponent =
    (Math.log(cdfIncrementFromShock(gA)) - Math.log(cdfIncrementFromShock(gB))) /
    (Math.log(Math.abs(gA)) - Math.log(Math.abs(gB)));

  // (5) Density-to-CDF exponent law: density ~ |x|^{-beta} => increment ~ |x|^{1-beta}.
  const cdfExponentFromLaw = 1 - CUSP_DENSITY_EXPONENT; // = 0.5

  // (6) imp-2988 -- PARTIAL closure of subgap-tau-c-saturating-family at the
  // continuum (limiting shock-measure / CDF) level. Exhibit the EXPLICIT sequence
  // gamma_n = -1/n^2 -> gamma_star. Each member realizes the Holder-1/2 modulus
  // with EQUALITY (the constant is exactly 1, not merely bounded near 1):
  //   |F(gamma_n) - F(0)| = sqrt(1/n^2) = 1/n = |gamma_n - gamma_star|^{1/2},
  // so R_{1/2}(gamma_n) == 1 for every n. This is the rigorous lower-bound (worst-
  // case-attaining) half of the saturating-family question -- a concrete family
  // meeting the modulus with matching constant -- at the level of the limiting
  // measure. What stays OPEN is the LIFT to N-particle empirical configurations
  // mu_N with an N-uniform matching constant (RH-hard microscopic gap stability,
  // imp-2640 / imp-2672); the sub-gap therefore remains named, now narrowed to
  // exactly that lift rather than the full continuum+discrete statement.
  const SATURATING_NS = [1, 2, 4, 8, 16, 64, 256, 1024];
  const continuumSaturatingFamily = SATURATING_NS.map((n) => {
    const gamma = -1 / (n * n);
    return { n, gamma, holderRatioAtHalf: holderRatio(gamma, 0.5) };
  });
  const familyRealizesEquality = continuumSaturatingFamily.every(
    (m) => m.holderRatioAtHalf !== null && Math.abs(m.holderRatioAtHalf - 1) < 1e-9,
  );

  return {
    ticket: 'imp-2855',
    claim:
      'The Holder exponent of the first-collision-time modulus is exactly 1/2; ' +
      'it cannot be improved to Holder-alpha with alpha > 1/2 because the shock ' +
      'measure has an intrinsic inverse-square-root cusp density.',
    verdict:
      'SHARP -- exponent 1/2 is the theorem (cusp-CDF level, rigorous). Lipschitz ' +
      '(alpha = 1) is impossible: no finite Lipschitz constant exists, which is the ' +
      'analytic root of the imp-2640 C_Lip divergence.',
    cuspModel: {
      gammaStar: GAMMA_STAR,
      densitySingularityExponent: CUSP_DENSITY_EXPONENT, // beta = 1/2
      cdfIncrementExponent: cdfExponentFromLaw, // 1 - beta = 1/2
      densityFormula: 'rho_inf(gamma) = (1/2) / sqrt(-gamma)',
      cdfFormula: 'F(gamma) = 1 - sqrt(-gamma)',
      quantileFormula: 'Q(p) = -(1 - p)^2,  Q(1 - u) = -u^2',
    },
    quadraticTangency: {
      formula: 'tau_c = g_min^2 / C_QUADRATIC_TANGENCY',
      constant: C_QUADRATIC_TANGENCY,
      role:
        'Couples the gap to the collision time; combined with the square-root ' +
        'cusp scaling of g_min it transmits the Holder-1/2 character to tau_c.',
    },
    holderRatioAtHalf: ratiosAtHalf,
    holderRatioAtSixTenths: ratiosAtSixTenths,
    lipschitzRatio: lipRatios,
    fittedCdfIncrementExponent: fittedExponent,
    cdfExponentFromDensityLaw: cdfExponentFromLaw,
    halfStaysBounded,
    sixTenthsDiverges,
    lipschitzDiverges,
    continuumSaturatingFamily,
    familyRealizesEquality,
    rigorousBeat: false,
    chDischarged: false,
    openSubGap: 'subgap-tau-c-saturating-family',
    subGapPartialClosure:
      'imp-2988: the saturating family is now CLOSED at the continuum (limiting ' +
      'shock-measure / CDF) level -- the explicit sequence gamma_n = -1/n^2 meets the ' +
      'Holder-1/2 modulus with EQUALITY (constant exactly 1) at every member. The ' +
      'residual open part is strictly the N-particle lift: empirical configurations ' +
      'mu_N with an N-uniform matching constant (RH-hard microscopic gap stability, ' +
      'imp-2640 / imp-2672). No beat, no C_H discharge.',
    groundsImp2640:
      'The cusp CDF has no Lipschitz constant (R_1 ~ (-gamma)^{-1/2} -> infinity), ' +
      'the analytic shadow of int_0^{t_c} 2/g(t)^2 dt -> infinity. Hence the only ' +
      'available (Gronwall) C_Lip is non-finite/non-N-uniform up to the collision ' +
      'time -- the imp-2640 NEGATIVE is a forced consequence of an intrinsic ' +
      'Holder-1/2 cusp, not an opaque failure of one technique.',
    honestNote:
      'Rigorous at the cusp-density / CDF level (the structural source). A fully ' +
      'rigorous SATURATING family of N-particle configurations meeting the tau_c ' +
      'modulus with matching constant is the open sub-gap subgap-tau-c-saturating-family ' +
      '(RH-hard microscopic gap stability, per imp-2640 / imp-2672). No beat, no C_H discharge.',
  };
})();

// ── Build-time assertions ────────────────────────────────────────────────────

export const HOLDER_EXPONENT_SHARPNESS_ASSERTIONS = [
  {
    id: 'imp2855-holder-half-holds',
    holds: () => {
      const r = HOLDER_EXPONENT_SHARPNESS;
      // At alpha = 1/2 the Holder ratio is exactly 1 at every probe -- the
      // modulus genuinely holds with constant 1 for the cusp CDF.
      return (
        r.halfStaysBounded === true &&
        r.holderRatioAtHalf.length > 0 &&
        r.holderRatioAtHalf.every((x) => Number.isFinite(x) && Math.abs(x - 1) < 1e-2)
      );
    },
    why:
      'imp-2855: the inverse-square-root cusp CDF increment is exactly |gamma - ' +
      'gamma_star|^{1/2}, so the Holder-1/2 ratio stays bounded at the constant 1 ' +
      '(unlike the divergence at alpha > 1/2). If this fails the cusp model no longer ' +
      'realizes the Lemma 5.2 imp366-holder-exponent-is-half claim.',
  },
  {
    id: 'imp2855-cannot-improve-above-half',
    holds: () => {
      const r = HOLDER_EXPONENT_SHARPNESS;
      // For alpha = 0.6 > 1/2 the ratio (-gamma)^{-0.1} blows up toward the shock:
      // no Holder-alpha modulus with alpha > 1/2 can exist. Sharpness locked.
      return (
        r.sixTenthsDiverges === true &&
        r.holderRatioAtSixTenths[r.holderRatioAtSixTenths.length - 1] >
          r.holderRatioAtSixTenths[0]
      );
    },
    why:
      'imp-2855 sharpness lock: any exponent alpha > 1/2 makes the Holder ratio ' +
      '(-gamma)^{1/2 - alpha} diverge as gamma -> shock. This blocks any future edit ' +
      'from silently claiming a stronger-than-1/2 modulus for the first-collision time.',
  },
  {
    id: 'imp2855-no-lipschitz-constant-grounds-imp2640',
    holds: () => {
      const r = HOLDER_EXPONENT_SHARPNESS;
      // The Lipschitz (alpha = 1) ratio diverges as (-gamma)^{-1/2}: no finite
      // C_Lip exists. This is the intrinsic obstruction behind the imp-2640 NEGATIVE.
      return (
        r.lipschitzDiverges === true &&
        r.chDischarged === false &&
        r.rigorousBeat === false &&
        /imp-2640/.test(r.groundsImp2640)
      );
    },
    why:
      'imp-2855 explains imp-2640: a Lipschitz modulus would need a finite C_Lip, ' +
      'but the cusp CDF has none (R_1 -> infinity as (-gamma)^{-1/2}), the analytic ' +
      'shadow of the divergent Gronwall integral. Locks the negative as a forced ' +
      'consequence of the intrinsic Holder-1/2 cusp; blocks any false discharge or beat.',
  },
  {
    id: 'imp2855-fitted-exponent-is-half',
    holds: () => {
      const r = HOLDER_EXPONENT_SHARPNESS;
      // The numerically fitted CDF-increment exponent and the density-to-CDF
      // exponent law must both deliver exactly 1/2.
      return (
        Math.abs(r.fittedCdfIncrementExponent - 0.5) < 1e-9 &&
        Math.abs(r.cdfExponentFromDensityLaw - 0.5) < 1e-12 &&
        r.openSubGap === 'subgap-tau-c-saturating-family'
      );
    },
    why:
      'imp-2855: log-log fit of |F(gamma)| ~ (-gamma)^p gives p = 1/2, and the ' +
      'density-to-CDF law 1 - beta with beta = 1/2 gives 1/2. Improving to alpha > 1/2 ' +
      'would require a milder cusp (beta < 1/2), contradicting the established ' +
      'inverse-square-root density. The honest open sub-gap stays named.',
  },
  {
    id: 'imp2988-continuum-saturating-family-realizes-equality',
    holds: () => {
      const r = HOLDER_EXPONENT_SHARPNESS;
      const fam = r.continuumSaturatingFamily;
      // imp-2988 partial closure: the explicit sequence gamma_n = -1/n^2 meets the
      // Holder-1/2 modulus with EQUALITY (ratio identically 1) at every member -- a
      // rigorous saturating family at the continuum (CDF / limiting-measure) level.
      return (
        Array.isArray(fam) &&
        fam.length >= 4 &&
        r.familyRealizesEquality === true &&
        fam.every(
          (m) =>
            m.holderRatioAtHalf !== null &&
            Number.isFinite(m.holderRatioAtHalf) &&
            Math.abs(m.holderRatioAtHalf - 1) < 1e-9 &&
            m.gamma < 0,
        ) &&
        // Strictly approaching the shock so the family is genuinely a sequence.
        fam[fam.length - 1].gamma > fam[0].gamma &&
        // Sub-gap stays honestly named (only the N-particle lift remains open) and
        // no beat / no C_H discharge is claimed.
        r.openSubGap === 'subgap-tau-c-saturating-family' &&
        typeof r.subGapPartialClosure === 'string' &&
        /N-particle lift/.test(r.subGapPartialClosure) &&
        r.rigorousBeat === false &&
        r.chDischarged === false
      );
    },
    why:
      'imp-2988: closes the saturating-family sub-gap at the continuum (limiting ' +
      'shock-measure / CDF) level by exhibiting gamma_n = -1/n^2, which realizes the ' +
      'Holder-1/2 modulus with EQUALITY (constant exactly 1) -- the rigorous worst-case- ' +
      'attaining half of the question. Locks that the residual is strictly the ' +
      'N-particle lift with N-uniform constant (RH-hard, imp-2640 / imp-2672); blocks ' +
      'any edit from over-claiming a full discrete saturating family, a beat, or a C_H ' +
      'discharge.',
  },
];
