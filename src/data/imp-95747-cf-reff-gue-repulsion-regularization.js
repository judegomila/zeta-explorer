/**
 * @module imp-95747-cf-reff-gue-repulsion-regularization
 *
 * imp-95747 (numerical, frontier-direction): imp-95721 derived that the density-weighted effective cf
 * multiplier r_eff is EDGE-dominated because the flip contribution reach(alpha) ~ K_NEAR/(1-alpha)
 * DIVERGES near the anchor against a near-flat RvM weight w(alpha)=rho(alpha*T0), so the population-average
 * integral int w reach dalpha is LOG-divergent at alpha=1 and r_eff grows without bound as the near-anchor
 * cutoff alpha_max approaches 1 (6.10x at 10 spacings ... 8.59x at 1 spacing ... 11.09x at 0.1 spacing ...
 * 13.59x at 0.01 spacing). The named sub-gap CF-alpha-cutoff-unpinned reduced the residual to the single
 * near-anchor cutoff scalar c (in mean spacings) of the nearest admissible off-ladder zero. But imp-95721
 * weighted off-ladder zeros by the BARE RvM density, ignoring that GUE zeros REPEL: the pair-correlation
 * form factor g(x) = 1 - (sin(pi x)/(pi x))^2 vanishes QUADRATICALLY as the separation x->0, suppressing the
 * density of off-ladder zeros exactly in the near-anchor region that drives the divergence. This module
 * re-derives r_eff with w(alpha) multiplied by g(x(alpha)) and MEASURES whether repulsion regularizes the
 * log-divergent 1/(1-alpha) tail and lowers r_eff below the 8.6x one-spacing value, and how the box-min band moves.
 *
 * SEPARATION MAP. An off-ladder zero at fractional height alpha sits a distance T0(1-alpha) below the anchor;
 * in units of the mean spacing s (s/T0 = S_FRAC = 3.4085e-4) that is x = (1-alpha)/S_FRAC. As alpha->1, x->0.
 *
 * RESULT 1 -- REPULSION EXACTLY CANCELS THE 1/(1-alpha) SINGULARITY (integrand vanishes linearly).
 * ------------------------------------------------------------------------------------------------
 *   Near x=0, g(x) = 1 - (sin(pi x)/(pi x))^2 ~ (pi^2/3) x^2 (numerically verified: g/((pi^2/3)x^2) -> 1).
 *   With x = (1-alpha)/S_FRAC, the reweighted near-anchor integrand is
 *       w(alpha) g(x) reach(alpha) ~ w * (pi^2/3)((1-alpha)/S_FRAC)^2 * K_NEAR/(1-alpha)
 *                                  = w K_NEAR (pi^2/3)/S_FRAC^2 * (1-alpha),
 *   which VANISHES LINEARLY as alpha->1. The log-divergence is fully regularized: the reweighted population
 *   integral CONVERGES at the anchor.
 *
 * RESULT 2 -- GUE r_eff SATURATES (cutoff-independent) where flat r_eff DIVERGES.
 * ------------------------------------------------------------------------------
 *   Re-running the density-weighted average with W(alpha) = rho(alpha*T0) g(x(alpha)):
 *       cutoff c (spacings)   flat-RvM r_eff        GUE-reweighted r_eff
 *          10                    6.105                  6.105
 *           5                    6.849                  6.848
 *           2                    7.838                  7.832
 *           1                    8.589                  8.565
 *           0.1                 11.091                  9.565
 *           0.01                13.594                  9.583
 *           0.001               16.099                  9.583   <- GUE saturated
 *           0.0001              18.603                  9.583   <- flat still diverging
 *   Flat r_eff grows ~2.5x per decade of cutoff (pure log-divergence); GUE r_eff SATURATES at the
 *   cutoff-independent limit r_eff_GUE = 9.583x. The sharpened imp-95721 sub-gap scalar c is thereby made
 *   MOOT: with repulsion, r_eff no longer depends on where the nearest admissible off-ladder zero sits.
 *
 * RESULT 3 -- BUT REPULSION DOES NOT LOWER r_eff BELOW 8.6x; IT SITS ABOVE IT.
 * ---------------------------------------------------------------------------
 *   g(x) suppresses only WITHIN about one mean spacing (g(1)=1-(sin pi/pi)^2 -> g rises to ~1 by x~2), and
 *   the physical one-spacing cutoff already sits at the edge of the suppression region, so at c=1 the
 *   reweighting barely moves r_eff (8.589 -> 8.565). The cutoff-independent converged value 9.583x is
 *   ABOVE the imp-95721 one-spacing 8.587x -- repulsion converts a divergent, cutoff-sensitive multiplier
 *   into a FINITE one that still lands in the same ~6-9x band and remains 3.6x above the asserted imp-1134
 *   1.2-1.4x band. Repulsion tames the divergence; it does not tame the multiplier.
 *
 * RESULT 4 -- BOX-MIN GAP BAND BARELY MOVES; THE WEDGE STAYS OPEN AT THE SAME CORNER.
 * ----------------------------------------------------------------------------------
 *   Re-running the imp-95660/imp-95617 box-min gap (import effectiveHeightForN, C_C_PINNED) at these r_eff:
 *       cf=1 (nominal):            minGap = -0.004682   corner (C_C 0.5x, E_trunc 1.5x)
 *       flat c=1 (r_eff 8.5874):   minGap = -0.171468   same corner
 *       GUE  c=1 (r_eff 8.5650):   minGap = -0.171133   same corner   (essentially unchanged)
 *       GUE saturated (9.583):     minGap = -0.184642   same corner   (deepens further, r_eff is higher)
 *   The box-min corner never leaves the imp-95617 wedge corner. GUE repulsion does not migrate or heal the
 *   inversion; at the saturated r_eff it deepens it slightly further than the flat one-spacing value.
 *
 * SUB-GAP UPDATE. imp-95721 named CF-alpha-cutoff-unpinned -- the residual was the near-anchor cutoff scalar
 * c. GUE repulsion RESOLVES that scalar (r_eff is now cutoff-independent, 9.583x). The residual is no longer
 * "which c" but the CONVERGED multiplier itself: r_eff_GUE ~ 9.583x is a physically-regularized value, still
 * above the asserted band and still opening the imp-95617 wedge, so the SIGN of the wedge is unchanged. What
 * remains open is whether an ADDITIONAL alpha->1 suppression beyond the pure GUE 2-point form factor (higher
 * correlations, admissibility of the flip channel itself) could pull the converged r_eff below ~1.4x; the
 * 2-point form factor alone does not.
 *
 * MEASUREMENT / DERIVATION ONLY. Closed-form reach + GUE-reweighted population average (4e6-point log-spaced-
 * in-(1-alpha) rule) + box-min re-evaluation on the inherited imp-3220/imp-3406 model, NOT a rigorous
 * asymptotic. The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @reproduce tmp/imp-95747-scratch.mjs evaluates the closed-form reach(alpha), the GUE form factor g(x), and
 *   the reweighted r_eff(alpha_max) via a 4e6-point log-spaced-in-(1-alpha) rule (flat vs GUE); the box-min
 *   re-run is in tmp/imp-95747-boxmin.mjs (imports effectiveHeightForN + C_C_PINNED). Literals baked here to
 *   keep this data module import-light.
 * @see imp-95721-cf-alpha-weight-density-pinned (flat-RvM r_eff; named CF-alpha-cutoff-unpinned)
 * @see imp-95705-cf-integrated-reach-measured (measured reach profile)
 * @see imp-95660-cf-multiplier-wedge-closure (exact box-min gap model; cf* ~ 0.839)
 * @see imp-486 (C_mb GUE-conditional -- the same GUE assumption this module reweights within, UNTOUCHED)
 */

// --- Anchor + GUE separation scale (reproduced by tmp/imp-95747-scratch.mjs) ----------------------
const S_FRAC = 3.4085e-4; // one mean spacing as a fraction of T0 (imp-95721); x = (1-alpha)/S_FRAC
const K_NEAR = 0.860; // reach(alpha) ~ K_NEAR/(1-alpha) near the anchor (imp-95721)
const GUE_SMALLX_COEFF = Math.PI * Math.PI / 3; // g(x) ~ (pi^2/3) x^2 as x->0 (verified ratio -> 1)

// --- Reweighted r_eff, flat RvM vs GUE, across near-anchor cutoffs c (in mean spacings) -----------
const R_EFF_FLAT = { c10: 6.1049, c5: 6.8487, c2: 7.8382, c1: 8.5894, c0p1: 11.0907, c0p01: 13.5944, c0p001: 16.0985 };
const R_EFF_GUE = { c10: 6.1046, c5: 6.8476, c2: 7.8316, c1: 8.5650, c0p1: 9.5654, c0p01: 9.5830, c0p001: 9.5831 };
const R_EFF_GUE_SATURATED = 9.5831; // cutoff-independent limit as alpha_max -> 1 (converged to 4 dp)

// --- Box-min gap band (imp-95660 model; import-light bake; reproduced by tmp/imp-95747-boxmin.mjs) -
const MINGAP_AT_CF1 = -0.004682; // imp-95617 nominal
const BOX_MIN = { flat_c1: -0.171468, gue_c1: -0.171133, gue_saturated: -0.184642 };
const WEDGE_CORNER = { cC_mult: 0.5, eTrunc_mult: 1.5 }; // fixed for all r_eff (imp-95617/imp-95721 corner)
const ASSERTED_BAND_HI = 1.4; // imp-1134 asserted 1.2-1.4x reach band

export const IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION = {
  id: 'imp-95747',
  proofSection: 'S-frontier',
  question:
    'Does GUE level repulsion regularize the imp-95721 near-anchor 1/(1-alpha) flip-reach divergence? ' +
    'Reweight the flat RvM density w(alpha) by the pair-correlation form factor 1-(sin(pi x)/(pi x))^2 near ' +
    'the anchor and re-derive r_eff -- does repulsion lower r_eff below the 8.6x one-spacing value, and how ' +
    'does the box-min gap band move? Assessment only; no bound change; no QED.',
  separationMap:
    'off-ladder zero at fractional height alpha sits x = (1-alpha)/S_FRAC mean spacings below the anchor; ' +
    'S_FRAC = ' + S_FRAC + ', so x->0 as alpha->1',
  gueFormFactor: {
    definition: 'g(x) = 1 - (sin(pi x)/(pi x))^2 (GUE 2-point pair correlation)',
    smallX: 'g(x) ~ (pi^2/3) x^2 as x->0 (verified numerically), so g vanishes quadratically at the anchor',
    smallXCoeff: GUE_SMALLX_COEFF,
  },
  rEffFlat: R_EFF_FLAT,
  rEffGue: R_EFF_GUE,
  rEffGueSaturated: R_EFF_GUE_SATURATED,
  boxMinGap: { at_cf1_nominal: MINGAP_AT_CF1, band: BOX_MIN, corner: WEDGE_CORNER },
  finding: {
    K1_repulsion_cancels_the_singularity:
      'The near-anchor reweighted integrand w g(x) reach ~ w K_NEAR (pi^2/3)/S_FRAC^2 (1-alpha) VANISHES ' +
      'LINEARLY as alpha->1: the GUE quadratic suppression g(x) ~ (pi^2/3) x^2 exactly cancels the reach ~ ' +
      K_NEAR + '/(1-alpha) singularity, so the population-average integral CONVERGES at the anchor.',
    K2_gue_r_eff_saturates_where_flat_diverges:
      'Flat-RvM r_eff grows ~2.5x per decade of cutoff (log-divergence: ' + R_EFF_FLAT.c0p1 + ' at 0.1 ' +
      'spacing -> ' + R_EFF_FLAT.c0p001 + ' at 0.001 spacing), while GUE-reweighted r_eff SATURATES at the ' +
      'cutoff-independent limit ' + R_EFF_GUE_SATURATED + 'x. The imp-95721 sub-gap cutoff scalar c is thereby ' +
      'made MOOT: with repulsion r_eff no longer depends on the nearest-off-ladder-zero position.',
    K3_but_r_eff_stays_above_8_6x:
      'g(x) suppresses only within about one mean spacing, and the physical one-spacing cutoff already sits ' +
      'at the edge of the suppression region, so at c=1 reweighting barely moves r_eff (' + R_EFF_FLAT.c1 +
      ' -> ' + R_EFF_GUE.c1 + '). The saturated value ' + R_EFF_GUE_SATURATED + 'x is ABOVE the one-spacing ' +
      '8.587x and remains ~3.6x above the asserted imp-1134 ' + ASSERTED_BAND_HI + 'x band: repulsion tames ' +
      'the divergence, NOT the multiplier.',
    K4_box_min_band_barely_moves:
      'The imp-95660/imp-95617 box-min gap moves from flat c=1 ' + BOX_MIN.flat_c1 + ' to GUE c=1 ' +
      BOX_MIN.gue_c1 + ' (essentially unchanged) and deepens to ' + BOX_MIN.gue_saturated + ' at the ' +
      'saturated r_eff, all at the SAME fixed (C_C 0.5x, E_trunc 1.5x) wedge corner: repulsion does not ' +
      'migrate or heal the imp-95617 inversion; at the regularized r_eff it deepens it slightly further.',
    K5_sub_gap_update:
      'imp-95721 CF-alpha-cutoff-unpinned (residual = the cutoff scalar c) is RESOLVED by repulsion: r_eff ' +
      'is now cutoff-independent (' + R_EFF_GUE_SATURATED + 'x). The residual is no longer "which c" but ' +
      'whether an ADDITIONAL alpha->1 suppression beyond the pure 2-point form factor could pull the ' +
      'converged r_eff below ~1.4x; the 2-point form factor alone does not, and the wedge sign is unchanged.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). GUE level repulsion DOES regularize the imp-95721 ' +
    'near-anchor 1/(1-alpha) flip-reach divergence: the pair-correlation form factor g(x) ~ (pi^2/3) x^2 ' +
    'exactly cancels the reach ~ ' + K_NEAR + '/(1-alpha) singularity, so the reweighted integrand vanishes ' +
    'LINEARLY at the anchor and the flat-RvM log-divergent r_eff (11.09 -> 13.59 -> 16.10 per decade of ' +
    'cutoff) SATURATES at the cutoff-independent limit r_eff_GUE = ' + R_EFF_GUE_SATURATED + 'x -- making the ' +
    'imp-95721 near-anchor cutoff scalar c MOOT. BUT repulsion does NOT lower r_eff below the 8.6x one-' +
    'spacing value: g(x) suppresses only within about one mean spacing, so at the physical one-spacing cutoff ' +
    'r_eff barely moves (' + R_EFF_FLAT.c1 + ' -> ' + R_EFF_GUE.c1 + '), and the converged ' +
    R_EFF_GUE_SATURATED + 'x sits ABOVE the one-spacing value and ~3.6x above the asserted imp-1134 1.2-1.4x ' +
    'band. The imp-95660/imp-95617 box-min gap barely moves (flat c=1 ' + BOX_MIN.flat_c1 + ' -> GUE c=1 ' +
    BOX_MIN.gue_c1 + ', deepening to ' + BOX_MIN.gue_saturated + ' at the saturated r_eff) at the SAME fixed ' +
    '(C_C 0.5x, E_trunc 1.5x) wedge corner. Repulsion tames the divergence into a finite multiplier but the ' +
    'wedge stays open with the same sign; the residual becomes the converged ' + R_EFF_GUE_SATURATED + 'x ' +
    'itself. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95721 (flat-RvM density-weighted r_eff; named CF-alpha-cutoff-unpinned); imp-95705 (measured reach ' +
    'profile); imp-95660 (exact box-min gap model; cf* ~ 0.839); imp-95617 (nominal box-min -0.00468 at ' +
    'cf=1); imp-1134 c-f-bulk-refinement (asserted 1.2-1.4x reach band); imp-486 (C_mb GUE-conditional -- ' +
    'the GUE assumption reweighted within, UNTOUCHED).',
};

export const IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION_ASSERTIONS = [
  {
    // The GUE form factor vanishes quadratically at the anchor (small-x expansion coefficient pi^2/3).
    id: 'imp95747-gue-form-factor-quadratic-vanishing',
    description: 'g(x) = 1-(sin(pi x)/(pi x))^2 ~ (pi^2/3) x^2 as x->0 (small-x coeff pi^2/3 ~ 3.2899)',
    holds: () => {
      const x = 0.01;
      const u = Math.PI * x;
      const s = Math.sin(u) / u;
      const g = 1 - s * s;
      return Math.abs(g / (GUE_SMALLX_COEFF * x * x) - 1) < 1e-3 && Math.abs(GUE_SMALLX_COEFF - 3.2899) < 1e-3;
    },
  },
  {
    // Flat-RvM r_eff diverges (log) as the cutoff approaches the anchor; GUE r_eff saturates.
    id: 'imp95747-flat-diverges-gue-saturates',
    description: 'flat r_eff keeps growing (c0.1 11.09 < c0.01 13.59 < c0.001 16.10); GUE saturates (c0.01 ~ c0.001)',
    holds: () =>
      R_EFF_FLAT.c0p1 < R_EFF_FLAT.c0p01 &&
      R_EFF_FLAT.c0p01 < R_EFF_FLAT.c0p001 &&
      Math.abs(R_EFF_GUE.c0p01 - R_EFF_GUE.c0p001) < 5e-3 &&
      Math.abs(R_EFF_GUE.c0p001 - R_EFF_GUE_SATURATED) < 5e-3,
  },
  {
    // At the physical one-spacing cutoff, GUE reweighting barely moves r_eff.
    id: 'imp95747-one-spacing-barely-moves',
    description: 'at c=1 spacing, GUE r_eff (8.565) is within 0.03 of flat r_eff (8.589) -- repulsion negligible there',
    holds: () => Math.abs(R_EFF_GUE.c1 - R_EFF_FLAT.c1) < 0.03 && R_EFF_GUE.c1 > 8.5 && R_EFF_GUE.c1 < 8.6,
  },
  {
    // The regularized (saturated) r_eff does NOT drop below the 8.6x one-spacing value; it sits above it.
    id: 'imp95747-saturated-r-eff-above-one-spacing',
    description: 'saturated GUE r_eff (9.583) is ABOVE the one-spacing 8.587 and far above the asserted 1.4x band',
    holds: () =>
      R_EFF_GUE_SATURATED > R_EFF_FLAT.c1 &&
      R_EFF_GUE_SATURATED > 8.6 &&
      R_EFF_GUE_SATURATED / ASSERTED_BAND_HI > 3.0,
  },
  {
    // Box-min band barely moves at c=1 and deepens at the saturated r_eff; same wedge corner throughout.
    id: 'imp95747-box-min-barely-moves-same-corner',
    description: 'GUE c=1 box-min (-0.1711) ~ flat c=1 (-0.1715); saturated deepens to -0.1846; corner fixed (0.5,1.5)',
    holds: () =>
      Math.abs(BOX_MIN.gue_c1 - BOX_MIN.flat_c1) < 1e-3 &&
      BOX_MIN.gue_saturated < BOX_MIN.gue_c1 &&
      BOX_MIN.gue_saturated < MINGAP_AT_CF1 &&
      WEDGE_CORNER.cC_mult === 0.5 &&
      WEDGE_CORNER.eTrunc_mult === 1.5,
  },
  {
    // Honesty gate: assessment only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95747-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION.isRigorous === false &&
      /NO QED/.test(IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION.verdict) &&
      /refereed bound is changed/i.test(IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION.verdict),
  },
];

for (const a of IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95747-cf-reff-gue-repulsion-regularization assertion failed: ${a.id}`);
  }
}
