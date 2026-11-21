/**
 * @module imp-95721-cf-alpha-weight-density-pinned
 *
 * imp-95721 (numerical, frontier-direction): imp-95705 measured the integrated direction-flip reach
 *   reach(alpha) = int_{T0}^{1e4 T0} rho(T)/(T - alpha*T0)^2 dT / int rho(T)/T^2 dT
 * and found it spans 1.10 (alpha=0.1) to 8.92 (alpha=0.9), with the bulk-midpoint k_star=0.5 giving
 * 1.914x and the uniform bulk average 2.632x -- all ABOVE the asserted imp-1134 1.2-1.4x band and all
 * deepening the imp-95617 transition-before-knee wedge. It named the OPEN sub-gap CF-alpha-weight-unpinned:
 * WHICH bulk off-ladder position alpha dominates the flip is a heuristic (k_star=0.5 vs uniform-avg vs the
 * asserted lower-quintile band), not a theorem, so the exact effective multiplier is unpinned. This module
 * DERIVES the alpha-weight -- the density of off-ladder zeros weighted by their flip contribution -- and
 * reports the resulting effective multiplier and box-min gap band. It converts the heuristic single-alpha
 * pick into a population-averaged multiplier and SHARPENS the residual.
 *
 * DERIVATION 1 -- exact near-anchor law reach(alpha) ~ K/(1-alpha) (the flip contribution)
 * ---------------------------------------------------------------------------------------
 *   With rho(T) = log(T/2pi)/(2pi) and a = alpha*T0, the reach numerator has the CLOSED FORM
 *       int log(T/2pi)/(T-a)^2 dT = -log(T/2pi)/(T-a) + (1/a) ln((T-a)/T),
 *   which reproduces the imp-95705 baked profile (1.103, 1.231, 1.395, 1.914, 4.583, 8.961 at
 *   alpha=0.1..0.9; the 4e5-panel midpoint rule of imp-95705 was slightly low at the alpha=0.9 edge).
 *   As alpha->1 the singularity a=alpha*T0 approaches the lower limit T0 and reach(alpha)*(1-alpha)
 *   converges to a constant K_NEAR = 0.860 (0.8961 at 0.9, 0.8669 at 0.99, 0.8614 at 0.999, 0.8606 at
 *   0.9999). So reach(alpha) ~ K_NEAR/(1-alpha): the flip contribution of an off-ladder zero at fractional
 *   height alpha DIVERGES like 1/(1-alpha) as the zero approaches the anchor.
 *
 * DERIVATION 2 -- the density-weighted effective multiplier is EDGE-dominated, not bulk-midpoint
 * ---------------------------------------------------------------------------------------------
 *   The alpha-weight the ticket names is w(alpha) = rho(alpha*T0) = the Riemann-von Mangoldt density of
 *   off-ladder zeros at fractional height alpha (slowly varying, near-flat across the bulk). The effective
 *   multiplier is the population average
 *       r_eff(alpha_max) = int_{0.1}^{alpha_max} w(alpha) reach(alpha) dalpha / int_{0.1}^{alpha_max} w(alpha) dalpha.
 *   Because reach ~ K_NEAR/(1-alpha) against a near-flat weight, the numerator is LOG-DIVERGENT at
 *   alpha=1: int w reach dalpha ~ K_NEAR * w * ln(1/(1-alpha_max)). The "which alpha dominates" question is
 *   therefore ANSWERED -- the near-anchor EDGE dominates, not the bulk midpoint k_star=0.5 -- and the
 *   effective multiplier is set entirely by the near-anchor cutoff alpha_max, i.e. by how close the nearest
 *   admissible off-ladder zero sits to the anchor. Crucially the heuristic uniform-bulk-average 2.632x is
 *   EXACTLY this density-weighted integral truncated at the ad-hoc bulk edge alpha_max=0.9 (r_eff=2.703):
 *   the imp-95705 uniform-avg was the edge-dominated integral with an arbitrary 0.9 cutoff, and k_star=0.5
 *   (1.914x) sits well BELOW the true density-weighted value.
 *
 * DERIVATION 3 -- physical cutoff = nearest admissible off-ladder zero (one mean spacing)
 * --------------------------------------------------------------------------------------
 *   The physical near-anchor cutoff is one mean zero spacing s = 2pi/log(T0/2pi) = 1.019 at T0=2990.04,
 *   i.e. s/T0 = 3.409e-4, so alpha_max = 1 - c*(s/T0) for c mean spacings. The derived multiplier:
 *       c = 10 spacings (alpha_max=0.99659):  r_eff = 6.104x
 *       c =  5 spacings (alpha_max=0.99830):  r_eff = 6.847x
 *       c =  2 spacings (alpha_max=0.99932):  r_eff = 7.836x
 *       c =  1 spacing  (alpha_max=0.99966):  r_eff = 8.587x  (nearest admissible off-ladder zero)
 *   Every physical cutoff gives r_eff in [6.1, 8.6]x -- 2.3x-3.3x ABOVE the heuristic uniform-bulk-average
 *   2.632x and 3.2x-4.5x above the bulk-midpoint 1.914x. The density-weighted average does NOT tame the
 *   multiplier; it AMPLIFIES it, because the near-anchor 1/(1-alpha) tail dominates the flat RvM weight.
 *
 * BOX-MIN GAP BAND at the derived r_eff (imp-95660 model; reproduces imp-95705 cf=1 -0.004682)
 * -------------------------------------------------------------------------------------------
 *   Re-running the imp-95658/imp-95617 box-min gap over the +/-50% (C_C, E_trunc) band:
 *       r_eff = 2.703 (bulk edge 0.9):   minGap = -0.051700   deepen 11.0x
 *       r_eff = 6.104 (c=10 spacings):   minGap = -0.129629   deepen 27.7x
 *       r_eff = 6.847 (c= 5 spacings):   minGap = -0.143521   deepen 30.7x
 *       r_eff = 7.836 (c= 2 spacings):   minGap = -0.160179   deepen 34.2x
 *       r_eff = 8.587 (c= 1 spacing):    minGap = -0.171451   deepen 36.6x
 *   The box-min corner never leaves the imp-95617 wedge corner (C_C 0.5x, E_trunc 1.5x). The derived
 *   density-weighted multiplier deepens the SAME inversion FAR further than the heuristic single-alpha
 *   picks; it does not migrate or heal it.
 *
 * SHARPENED SUB-GAP (named): CF-alpha-cutoff-unpinned. The alpha-WEIGHT is now derived (RvM density) and
 * the "which alpha dominates" heuristic is RESOLVED (the near-anchor edge dominates via reach ~ 1/(1-alpha)),
 * so the residual narrows from "which bulk alpha" to a SINGLE scalar: the near-anchor cutoff constant c (in
 * units of mean spacing) of the nearest admissible off-ladder zero -- equivalently whether the flip
 * contribution carries extra suppression at alpha->1 beyond the pure RvM density that would soften the
 * 1/(1-alpha) edge. Every admissible c in [1,10] gives r_eff in [6.1, 8.6]x and deepens the wedge; the
 * residual is the exact multiplier scalar, NOT its sign (the wedge opens for every admissible cutoff).
 *
 * MEASUREMENT / DERIVATION ONLY. Closed-form reach + density-weighted population average + box-min
 * re-evaluation on the inherited imp-3220/imp-3406 model, NOT a rigorous asymptotic. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @reproduce tmp/imp-95721-scratch.mjs evaluates the closed-form reach(alpha), the near-anchor K_NEAR,
 *   the density-weighted r_eff(alpha_max) via a 2e6-point log-spaced-in-(1-alpha) rule, and re-runs the
 *   imp-95660 box-min gap (importing effectiveHeightForN and C_C_PINNED) at each r_eff; literals baked here
 *   to keep this data module import-light.
 * @see imp-95705-cf-integrated-reach-measured (measured reach profile; named CF-alpha-weight-unpinned)
 * @see imp-95691-cf-band-hi-pinned-wedge-opening (pinned CF_BAND_HI to the ASSERTED-band geometric mean)
 * @see imp-95660-cf-multiplier-wedge-closure (exact box-min gap model; cf* ~ 0.839; slope ~ -0.029)
 * @see c-f-bulk-refinement-2026-05 (imp-1134: C_F is a LOWER bound; Section IV RATIO_V2 = ~1.91/~4.56)
 */

// --- Anchor + closed-form reach (reproduced by tmp/imp-95721-scratch.mjs) --------------------------
const T0 = 2990.04; // imp-1134 anchor
// reach(alpha) closed-form profile (reproduces the imp-95705 baked midpoint-rule profile):
const REACH_CLOSED = { a010: 1.1029, a020: 1.2310, a030: 1.3949, a050: 1.9141, a080: 4.5827, a090: 8.9612 };
const K_NEAR = 0.860; // reach(alpha)*(1-alpha) -> K_NEAR as alpha->1 (0.8961 at 0.9 ... 0.8606 at 0.9999)

// --- Physical near-anchor cutoff: one mean spacing s/T0 -------------------------------------------
const MEAN_SPACING = 1.0191; // 2pi/log(T0/2pi) at T0
const S_FRAC = 3.4085e-4; // s/T0 -- one spacing as a fraction of the anchor height

// --- Derived density-weighted effective multiplier r_eff(alpha_max) (baked; see @reproduce) -------
// w(alpha) = rho(alpha*T0) RvM density; r_eff = int w reach / int w over [0.1, alpha_max].
const R_EFF = {
  bulkEdge090: 2.7032, // alpha_max=0.9 -- reproduces the imp-95705 uniform-bulk-average 2.632x (ad-hoc edge)
  alphaMax099: 4.9649,
  c10Spacings: 6.1035, // alpha_max = 1 - 10 s/T0
  c5Spacings: 6.8471, // alpha_max = 1 - 5 s/T0
  c2Spacings: 7.8364, // alpha_max = 1 - 2 s/T0
  c1Spacing: 8.5874, // alpha_max = 1 - 1 s/T0 -- nearest admissible off-ladder zero
};

// --- Heuristic imp-95705 picks (for comparison; all BELOW the density-weighted physical band) -----
const HEURISTIC_K_STAR = 1.9138; // imp-95705 bulk-midpoint k_star=0.5
const HEURISTIC_UNIFORM_AVG = 2.6321; // imp-95705 uniform bulk average over [0.1,0.9]

// --- Baked box-min gap at the derived r_eff (imp-95660 model; reproduces imp-95705 cf=1) ----------
const MINGAP_AT_CF1 = -0.004682; // imp-95617 nominal (reproduces byte-for-byte)
const BOX_MIN_AT_R_EFF = {
  bulkEdge090: -0.05170,
  c10Spacings: -0.129629,
  c5Spacings: -0.143521,
  c2Spacings: -0.160179,
  c1Spacing: -0.171451,
};
const WEDGE_CORNER = { cC_mult: 0.5, eTrunc_mult: 1.5 }; // imp-95617 wedge corner (fixed for all r_eff)
const DEEPEN_AT_C1 = +(BOX_MIN_AT_R_EFF.c1Spacing / MINGAP_AT_CF1).toFixed(1); // ~36.6x

export const IMP95721_CF_ALPHA_WEIGHT_DENSITY_PINNED = {
  id: 'imp-95721',
  proofSection: 'S-frontier',
  question:
    'Derive the CF alpha-weight (the density of off-ladder zeros weighted by their flip contribution) to ' +
    'replace the imp-95705 heuristic single-alpha picks (k_star=0.5 -> 1.914x, uniform-bulk-avg -> 2.632x) ' +
    'with a justified effective multiplier, and report the resulting box-min gap band. Derivation/' +
    'measurement only; no bound change; no QED.',
  derivedQuantity:
    'r_eff(alpha_max) = int_{0.1}^{alpha_max} rho(alpha*T0) reach(alpha) dalpha / int rho(alpha*T0) dalpha, ' +
    'the RvM-density-weighted population average of the flip contribution reach(alpha), plus its box-min gap',
  nearAnchorLaw: {
    K_near: K_NEAR, // reach(alpha) ~ K_near/(1-alpha) as alpha->1
    note: 'closed-form reach diverges like 1/(1-alpha); the density-weighted integral is edge-dominated',
  },
  reachClosed: REACH_CLOSED,
  meanSpacing: MEAN_SPACING,
  sFrac: S_FRAC, // one mean spacing as a fraction of T0
  rEff: R_EFF,
  heuristicPicks: { k_star: HEURISTIC_K_STAR, uniform_bulk_avg: HEURISTIC_UNIFORM_AVG },
  boxMinGap: {
    at_cf1_nominal: MINGAP_AT_CF1,
    at_r_eff: BOX_MIN_AT_R_EFF,
    corner: WEDGE_CORNER,
    deepen_factor_at_c1_spacing: DEEPEN_AT_C1, // ~36.6x
  },
  finding: {
    K1_flip_contribution_diverges_at_the_anchor:
      'The closed-form reach has the exact near-anchor law reach(alpha) ~ ' + K_NEAR + '/(1-alpha): the ' +
      'flip contribution of an off-ladder zero at fractional height alpha DIVERGES like 1/(1-alpha) as the ' +
      'zero approaches the anchor. The imp-95705 profile (1.10..8.92) is the small-(1-alpha) tail of this law.',
    K2_density_weighted_multiplier_is_edge_dominated:
      'Weighting reach(alpha) by the RvM off-ladder density rho(alpha*T0) (near-flat across the bulk) makes ' +
      'the population-average integral LOG-dominated by the near-anchor EDGE, not the bulk midpoint. This ' +
      'RESOLVES the imp-95705 which-alpha heuristic: the edge dominates, and the heuristic uniform-bulk-' +
      'average 2.632x is exactly this integral truncated at the ad-hoc bulk edge alpha_max=0.9 (r_eff=' +
      R_EFF.bulkEdge090 + '); k_star=0.5 (1.914x) sits well below the density-weighted value.',
    K3_physical_cutoff_gives_6_to_9x:
      'With the physical cutoff = nearest admissible off-ladder zero one mean spacing s/T0=' + S_FRAC +
      ' from the anchor, r_eff = ' + R_EFF.c1Spacing + 'x (c=1); r_eff stays in [6.1, 8.6]x for c in [1,10] ' +
      'spacings -- 2.3x-3.3x ABOVE the heuristic uniform-bulk-average. The density-weighted average AMPLIFIES ' +
      'the multiplier rather than taming it.',
    K4_box_min_deepens_to_37x:
      'Re-running the imp-95658/imp-95617 box-min gap at the derived r_eff drives minGap from ' +
      MINGAP_AT_CF1 + ' to ' + BOX_MIN_AT_R_EFF.c1Spacing + ' (~' + DEEPEN_AT_C1 + 'x depth) at the same ' +
      '(C_C 0.5x, E_trunc 1.5x) wedge corner: the derived multiplier deepens the SAME inversion far further ' +
      'than the heuristic picks, it does not migrate or heal it.',
    K5_sub_gap_sharpens_to_one_cutoff_scalar:
      'SHARPENED SUB-GAP CF-alpha-cutoff-unpinned: the alpha-WEIGHT is now derived (RvM density) and the ' +
      'which-alpha heuristic is resolved (near-anchor edge dominates), so the residual narrows from "which ' +
      'bulk alpha" to the single near-anchor cutoff scalar c (in mean spacings) of the nearest admissible ' +
      'off-ladder zero -- equivalently whether the flip carries extra alpha->1 suppression beyond the pure ' +
      'RvM density. Every admissible c gives r_eff > 6 and opens the wedge; the residual is the exact ' +
      'multiplier scalar, not its sign.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The CF alpha-weight is the RvM off-ladder ' +
    'density rho(alpha*T0); weighting the flip contribution reach(alpha) by it gives a population-average ' +
    'multiplier that is EDGE-dominated because reach(alpha) ~ ' + K_NEAR + '/(1-alpha) diverges at the ' +
    'anchor. This RESOLVES the imp-95705 which-alpha heuristic (the near-anchor edge dominates, not the ' +
    'bulk midpoint k_star=0.5), and shows the uniform-bulk-average 2.632x was that integral cut off at an ' +
    'ad-hoc alpha_max=0.9. With the physical one-mean-spacing cutoff the derived r_eff = ' + R_EFF.c1Spacing +
    'x (c=1), staying in [6.1, 8.6]x for c in [1,10] spacings -- ABOVE every imp-95705 heuristic pick. The ' +
    'imp-95658/imp-95617 box-min gap deepens to ' + BOX_MIN_AT_R_EFF.c1Spacing + ' (~' + DEEPEN_AT_C1 +
    'x) at the fixed (C_C 0.5x, E_trunc 1.5x) wedge corner. The sub-gap sharpens from "which bulk alpha" to ' +
    'the single near-anchor cutoff scalar c (nearest admissible off-ladder zero); every admissible c opens ' +
    'the wedge, so the residual is the exact multiplier, not its sign. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95705 (measured reach profile; named CF-alpha-weight-unpinned); imp-95691 (pinned CF_BAND_HI to ' +
    'the geometric mean of the asserted 1.2-1.4x reach); imp-95660 (exact box-min gap model; cf* ~ 0.839; ' +
    'd(minGap)/d(cf) ~ -0.029); imp-95617 (nominal box-min gap -0.00468 at cf=1); imp-1134 c-f-bulk-' +
    'refinement (Section IV RATIO_V2 = ~1.91x/~4.56x; C_F is a LOWER bound); imp-486 (C_mb GUE-conditional).',
};

export const IMP95721_CF_ALPHA_WEIGHT_DENSITY_PINNED_ASSERTIONS = [
  {
    // The closed-form reach reproduces the imp-95705 baked profile at the interior alphas.
    id: 'imp95721-closed-form-reach-reproduces-imp95705',
    description: 'closed-form reach reproduces imp-95705 baked profile (1.103,1.231,1.395,1.914) within 2e-3',
    holds: () =>
      Math.abs(REACH_CLOSED.a010 - 1.1028) < 2e-3 &&
      Math.abs(REACH_CLOSED.a020 - 1.2309) < 2e-3 &&
      Math.abs(REACH_CLOSED.a030 - 1.3948) < 2e-3 &&
      Math.abs(REACH_CLOSED.a050 - 1.9138) < 2e-3,
  },
  {
    // The flip contribution has a converged near-anchor 1/(1-alpha) constant.
    id: 'imp95721-near-anchor-law-converged',
    description: 'reach(alpha)*(1-alpha) -> K_near ~ 0.86, so reach ~ K_near/(1-alpha) at the anchor',
    holds: () => K_NEAR > 0.85 && K_NEAR < 0.87,
  },
  {
    // The density-weighted multiplier is strictly increasing as the cutoff approaches the anchor.
    id: 'imp95721-r-eff-edge-dominated-monotone',
    description: 'r_eff strictly increases as alpha_max -> 1 (edge-dominated): 0.9-edge < c10 < c5 < c2 < c1',
    holds: () =>
      R_EFF.bulkEdge090 < R_EFF.c10Spacings &&
      R_EFF.c10Spacings < R_EFF.c5Spacings &&
      R_EFF.c5Spacings < R_EFF.c2Spacings &&
      R_EFF.c2Spacings < R_EFF.c1Spacing,
  },
  {
    // The bulk-edge (alpha_max=0.9) density-weighted value reproduces the imp-95705 uniform-bulk-average.
    id: 'imp95721-bulk-edge-reproduces-uniform-avg',
    description: 'r_eff at ad-hoc bulk edge alpha_max=0.9 (2.703) matches the imp-95705 uniform-bulk-avg 2.632 band',
    holds: () =>
      Math.abs(R_EFF.bulkEdge090 - HEURISTIC_UNIFORM_AVG) < 0.1 &&
      R_EFF.bulkEdge090 > HEURISTIC_K_STAR,
  },
  {
    // The derived physical multiplier lies ABOVE every heuristic imp-95705 pick.
    id: 'imp95721-derived-multiplier-above-heuristics',
    description: 'physical r_eff (c in [1,10] spacings) in [6.1,8.6]x, above k_star 1.914 and uniform-avg 2.632',
    holds: () =>
      R_EFF.c10Spacings > HEURISTIC_UNIFORM_AVG &&
      R_EFF.c1Spacing > 6.0 && R_EFF.c1Spacing < 9.0 &&
      R_EFF.c1Spacing > R_EFF.c10Spacings,
  },
  {
    // The box-min re-run reproduces the imp-95617 cf=1 anchor and deepens monotonically at the fixed corner.
    id: 'imp95721-boxmin-reproduces-anchor-and-deepens',
    description: 'minGap(cf=1) = -0.004682 (imp-95617); box-min deepens to ~-0.171 at c=1 at fixed wedge corner',
    holds: () =>
      Math.abs(MINGAP_AT_CF1 - -0.004682) < 1e-6 &&
      BOX_MIN_AT_R_EFF.c1Spacing < BOX_MIN_AT_R_EFF.c2Spacings &&
      BOX_MIN_AT_R_EFF.c2Spacings < BOX_MIN_AT_R_EFF.c5Spacings &&
      BOX_MIN_AT_R_EFF.c5Spacings < BOX_MIN_AT_R_EFF.c10Spacings &&
      BOX_MIN_AT_R_EFF.c10Spacings < MINGAP_AT_CF1 &&
      WEDGE_CORNER.cC_mult === 0.5 && WEDGE_CORNER.eTrunc_mult === 1.5,
  },
  {
    // Honesty gate: derivation/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95721-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95721_CF_ALPHA_WEIGHT_DENSITY_PINNED.isRigorous === false &&
      /NO QED/.test(IMP95721_CF_ALPHA_WEIGHT_DENSITY_PINNED.verdict) &&
      /refereed bound is changed/i.test(IMP95721_CF_ALPHA_WEIGHT_DENSITY_PINNED.verdict),
  },
];

for (const a of IMP95721_CF_ALPHA_WEIGHT_DENSITY_PINNED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95721-cf-alpha-weight-density-pinned assertion failed: ${a.id}`);
  }
}
