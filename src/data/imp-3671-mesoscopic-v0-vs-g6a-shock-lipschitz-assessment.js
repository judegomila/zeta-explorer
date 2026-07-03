/**
 * @module imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment
 *
 * imp-3671 (proof, frontier-direction): ASSESS whether the imp-3642 direct-flow measurement of the
 * mesoscopic density floor V0(gamma) -- exactly linear in the LOCAL density log(gamma / 2 pi), and
 * respecting the Lemma B Gronwall floor exp(-2 s / y_star^2) along the Step-2 backward-Dyson flow --
 * supplies a QUANTITATIVE Lipschitz (Hoelder-1/2) modulus for the OPEN Step-4 Polymath15-bridge
 * sub-gap G6a_shock_lipschitz, or whether the mesoscopic-density reading is STRUCTURALLY SILENT on
 * the microscopic shock-front Lipschitz constant. Assessment/derivation only; no bridge closure, NO QED.
 *
 * WHAT G6a_shock_lipschitz NEEDS (Polymath15 Lemma 5.2, roadmap Step 4)
 * --------------------------------------------------------------------
 * The roadmap names G6a_shock_lipschitz as the Hoelder-1/2 modulus of the collision-time field
 * tau_c(x) at the Burgers shock: a constant C_Lip in a bound
 *     |tau_c(x) - tau_c(x_prime)| <= C_Lip * |x - x_prime|^{1/2}
 * governing the SPATIAL regularity of the shock FRONT. This is a microscopic, per-characteristic
 * quantity carrying the x-difference (x - x_prime) structure of neighbouring colliding characteristics.
 *
 * WHAT imp-3642 MEASURES
 * ----------------------
 * imp-3642 measured a single scalar V0(gamma) = sup over the strip of Im M(x + i y_star), the
 * MESOSCOPIC density floor, read at strip height y_star = 4 d (d = 2 pi / log(gamma / 2 pi) the local
 * spacing). It governs the collision-TIME scale t_c ~ 1 / (2 V0) (imp-2520) and was found exactly linear
 * in log(gamma / 2 pi) (invariant V0 / log(gamma / 2 pi) = 0.48458, spread 3.3e-16 across the ladder),
 * with the Gronwall floor exp(-2 s / y_star^2) respected (worst grid-sup / (sup0 * floor) = 0.991).
 *
 * TWO INDEPENDENT REASONS THE READING IS STRUCTURALLY SILENT ON C_Lip
 * ------------------------------------------------------------------
 * (S1) TYPE / DIMENSION MISMATCH. V0 is a strip-SUP scalar with units of density (inverse time); it
 *      quantifies WHEN the shock forms (the value t_c ~ 1/(2 V0)), not HOW the front bends in x (the
 *      modulus C_Lip). The sup over the strip erases the microscopic x-gradient structure that C_Lip
 *      encodes -- a single density-floor scalar carries no (x - x_prime) spatial-difference information
 *      at all, so it is the wrong TYPE of object to bound a Hoelder-1/2 spatial modulus, independent of
 *      any scale question.
 * (S2) SCALE MISMATCH -- the nearest-pair regime is Gronwall-VACUOUS (imp-2520 negative-finding 1). The
 *      mesoscopic reading lives at y_star = 4 d, where the Gronwall floor exp(-2 s / y_star^2) ~ 0.99
 *      (contraction present, essentially trivial). The shock-front Lipschitz constant is a NEAREST-PAIR
 *      quantity at strip height y -> 0 (the closest pair gap g -> 0 as it collides). Writing the strip
 *      height as y = y_star / k, the SAME floor is exp(-k^2 * (2 s / y_star^2)) = floor_meso^{k^2}, which
 *      COLLAPSES to 0 as k grows (see the scale-separation table below). So the Gronwall contraction the
 *      mesoscopic V0 respects is VACUOUS at the microscopic front -- exactly imp-2520 negative-finding 1
 *      that the nearest-pair regime is a DIFFERENT, Gronwall-vacuous scale.
 *
 * QUANTITATIVE SCALE-SEPARATION (grounded in the imp-3642 measured floor 0.991)
 * ----------------------------------------------------------------------------
 * imp-3642 measured the worst mesoscopic floor 0.991 at y_star = 4 d, so the mesoscopic Gronwall
 * exponent is E_meso = -ln(0.991) = 0.009041 = 2 s / y_star^2. The floor at strip height y = y_star / k
 * is floor(k) = exp(-k^2 * E_meso):
 *     k=1  (y_star=4d):   0.99100   mesoscopic, contraction respected (imp-3642)
 *     k=2  (2d):          0.96448
 *     k=4  (d):           0.86532   at the mean spacing the floor is already noticeably below 1
 *     k~8.76 (0.457 d):   0.50000   HALF the contraction already lost above the mean spacing
 *     k=16 (0.25 d):      0.09873
 *     k=32 (0.125 d):     9.5e-5
 *     k=50 (0.08 d):      1.5e-10   at the nearest-pair scale the floor is VACUOUS (-> 0)
 * The floor crosses 1/2 at k ~ 8.76, i.e. the mesoscopic contraction is already half-gone at strip
 * height ~0.46 d, and is numerically vacuous well before the true nearest-pair gap g << d is resolved.
 *
 * WHAT V0 DOES supply (and where it lands)
 * ----------------------------------------
 * V0 supplies the collision-TIME scale t_c ~ 1/(2 V0) and its log(gamma / 2 pi) scaling. Per imp-2564
 * the per-N collision scale feeds the E(N) BRIDGE CONSTANTS (fidelity of the connection), NOT the
 * headline inequality and NOT the shock-front modulus. imp-3661 already propagated exactly this scale
 * (density-corrected flow factor 1.0000917, ~19.3% of the imp-3604 bracket). None of that touches C_Lip.
 *
 * VERDICT: STRUCTURALLY SILENT. The imp-3642 V0 profile does NOT supply a quantitative Lipschitz
 * modulus for G6a_shock_lipschitz. Two independent obstructions -- (S1) a scalar strip-sup density is
 * the wrong TYPE of object for a spatial Hoelder-1/2 modulus, and (S2) the mesoscopic scale is
 * Gronwall-vacuous at the nearest-pair front (imp-2520 negative-finding 1) -- so G6a stays OPEN.
 *
 * ASSESSMENT / DERIVATION ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian
 * Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (V0 linear in log(gamma/2pi), floor 0.991)
 * @see imp-3661-sigma-crossover-tc-density-corrected-pin (propagates the SCALE into the E(N) constants)
 * @see imp-3662-mesoscopic-invariant-seed-sensitivity (Gronwall floor >0.98 at baseline seed, y_star=4d)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz; imp-2564 reframing)
 */

// imp-3642 measured worst mesoscopic Gronwall floor at y_star = 4 d (F1, "worst grid-sup ... = 0.991").
const IMP3642_MESO_FLOOR = 0.991;
// Mesoscopic Gronwall exponent E_meso = 2 s / y_star^2 = -ln(floor_meso).
const E_MESO = -Math.log(IMP3642_MESO_FLOOR); // 0.009041

// Floor at strip height y = y_star / k is exp(-k^2 * E_meso) = floor_meso^{k^2}.
function floorAt(k) {
  return Math.exp(-(k * k) * E_MESO);
}

// Strip-height ladder from mesoscopic (k=1, y_star = 4 d) down toward the nearest-pair scale (large k).
const K_LADDER = [1, 2, 4, 8, 16, 32, 50];
const SCALE_TABLE = K_LADDER.map((k) => ({
  k,
  y_over_d: +(4 / k).toFixed(4), // y = y_star / k, y_star = 4 d
  floor: +floorAt(k).toExponential(4),
}));

// The strip height (in units of d) at which the mesoscopic contraction is HALF lost (floor = 1/2).
const K_HALF = Math.sqrt(Math.log(2) / E_MESO); // ~8.76
const Y_HALF_OVER_D = 4 / K_HALF; // ~0.457 d -- still above the true nearest-pair gap

export const IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT = {
  id: 'imp-3671',
  proofSection: 'S-frontier',
  question:
    'Does the imp-3642 direct-flow measurement of the mesoscopic density floor V0(gamma) -- linear in ' +
    'the local density log(gamma / 2 pi) and respecting the Gronwall floor exp(-2 s / y_star^2) -- supply ' +
    'a QUANTITATIVE Lipschitz (Hoelder-1/2) modulus for the open Step-4 Polymath15-bridge sub-gap ' +
    'G6a_shock_lipschitz, or is the mesoscopic-density reading STRUCTURALLY SILENT on the microscopic ' +
    'shock-front Lipschitz constant? Assessment/derivation only, no bridge closure, no QED.',
  whatG6aNeeds:
    'A Hoelder-1/2 modulus C_Lip in |tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2} governing the ' +
    'SPATIAL regularity of the collision-time field tau_c(x) at the Burgers shock front (Polymath15 ' +
    'Lemma 5.2): a microscopic, per-characteristic quantity carrying x-difference structure.',
  whatV0Is:
    'A strip-SUP scalar V0(gamma) = sup Im M(x + i y_star) at mesoscopic height y_star = 4 d, units of ' +
    'density (inverse time), governing the collision-TIME scale t_c ~ 1/(2 V0); measured exactly linear ' +
    'in log(gamma / 2 pi) with the Gronwall floor exp(-2 s / y_star^2) ~ 0.991 respected (imp-3642).',
  obstructions: {
    S1_type_dimension_mismatch:
      'V0 is a strip-SUP density scalar (WHEN the shock forms, the value t_c ~ 1/(2 V0)); C_Lip is a ' +
      'spatial modulus (HOW the front bends in x). The strip sup erases the microscopic x-gradient ' +
      'structure C_Lip encodes -- a single density-floor scalar carries no (x - x_prime) information, so ' +
      'it is the wrong TYPE of object for a Hoelder-1/2 modulus, independent of any scale question.',
    S2_scale_mismatch_gronwall_vacuous:
      'The mesoscopic reading lives at y_star = 4 d where the Gronwall floor exp(-2 s / y_star^2) ~ 0.99. ' +
      'The shock-front Lipschitz constant is a nearest-pair quantity at strip height y -> 0 (gap g -> 0). ' +
      'At y = y_star / k the SAME floor is floor_meso^{k^2}, collapsing to 0 as k grows: the mesoscopic ' +
      'contraction is VACUOUS at the microscopic front -- exactly imp-2520 negative-finding 1 that the ' +
      'nearest-pair regime is a DIFFERENT, Gronwall-vacuous scale.',
  },
  scaleSeparation: {
    E_meso: +E_MESO.toFixed(6), // 0.009041 = 2 s / y_star^2 from the measured 0.991 floor
    y_star_over_d: 4, // imp-3642 baseline strip height
    table: SCALE_TABLE, // floor collapse from mesoscopic (k=1) toward nearest-pair (k=50)
    k_half: +K_HALF.toFixed(2), // ~8.76: floor = 1/2 already above the mean spacing
    y_half_over_d: +Y_HALF_OVER_D.toFixed(4), // ~0.457 d
    floor_at_nearest_pair_proxy: +floorAt(50).toExponential(2), // ~1.5e-10: vacuous
  },
  whatV0DoesSupply:
    'The collision-TIME scale t_c ~ 1/(2 V0) and its log(gamma / 2 pi) scaling, which per imp-2564 feed ' +
    'the E(N) BRIDGE CONSTANTS (fidelity), not the headline inequality and not the shock-front modulus. ' +
    'imp-3661 already propagated this scale (flow factor 1.0000917, ~19.3% of the imp-3604 bracket); ' +
    'none of that touches C_Lip.',
  suppliesLipschitzModulus: false,
  structurallySilent: true,
  g6aStillOpen: true,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous): STRUCTURALLY SILENT. The imp-3642 direct-flow ' +
    'measurement of the mesoscopic density floor V0(gamma) -- exactly linear in log(gamma / 2 pi) and ' +
    'respecting the Gronwall floor exp(-2 s / y_star^2) ~ 0.991 at y_star = 4 d -- does NOT supply a ' +
    'quantitative Lipschitz (Hoelder-1/2) modulus C_Lip for G6a_shock_lipschitz, for two INDEPENDENT ' +
    'reasons. (S1) TYPE/DIMENSION: V0 is a strip-SUP density scalar quantifying WHEN the shock forms ' +
    '(t_c ~ 1/(2 V0)); C_Lip is the SPATIAL modulus quantifying HOW the front bends in x. The strip sup ' +
    'erases the microscopic x-gradient structure, so a single density-floor scalar carries no ' +
    '(x - x_prime) difference information and is the wrong type of object for a Hoelder-1/2 modulus. ' +
    '(S2) SCALE: the mesoscopic reading sits at y_star = 4 d where the Gronwall floor ~ 0.99, but the ' +
    'shock-front Lipschitz constant is a nearest-pair quantity at y -> 0; at y = y_star / k the same ' +
    'floor is floor_meso^{k^2}, collapsing (0.991 -> 0.865 at the mean spacing d -> 1.5e-10 at ~0.08 d), ' +
    'half-lost already at ~0.46 d, so the mesoscopic contraction is Gronwall-VACUOUS at the microscopic ' +
    'front -- exactly imp-2520 negative-finding 1 that the nearest-pair regime is a different, ' +
    'Gronwall-vacuous scale. What V0 DOES supply is the collision-TIME scale, which per imp-2564 feeds ' +
    'the E(N) bridge CONSTANTS (imp-3661 propagated it), not the shock-front modulus. G6a_shock_lipschitz ' +
    'therefore stays OPEN. Assessment/derivation only; no positivity, no bridge closure, no RH claim, NO ' +
    'QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3642 (direct RK4 attractive-Dyson flow; V0 linear in log(gamma/2pi), invariant 0.48458, worst ' +
    'Gronwall floor 0.991 at y_star=4d); imp-3661 (propagates the collision-time SCALE into the E(N) ' +
    'bridge constants; flow factor 1.0000917); imp-3662 (Gronwall floor >0.98 at baseline seed); ' +
    'imp-2520 (shock time t_c ~ 1/(2 V0); negative-finding 1: nearest-pair regime is a different, ' +
    'Gronwall-vacuous scale); imp-2564 (per-N collision scale feeds E(N) bridge constants, not the ' +
    'headline inequality); lambda-roadmap Step 4 (Polymath15 bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT_ASSERTIONS = [
  {
    // (S2) The mesoscopic exponent reproduces the imp-3642 measured floor 0.991 at y_star = 4 d.
    id: 'imp3671-emeso-reproduces-imp3642-floor',
    description: 'E_meso = -ln(0.991) reconstructs the imp-3642 mesoscopic Gronwall floor at y_star=4d',
    holds: () =>
      Math.abs(Math.exp(-E_MESO) - IMP3642_MESO_FLOOR) < 1e-12 &&
      Math.abs(floorAt(1) - IMP3642_MESO_FLOOR) < 1e-12,
  },
  {
    // (S2) The floor collapses monotonically from mesoscopic (>0.98) to vacuous (<1e-8) at the pair scale.
    id: 'imp3671-floor-collapses-toward-nearest-pair',
    description: 'Gronwall floor > 0.98 at y_star (k=1) but < 1e-8 at the nearest-pair proxy (k=50), monotone',
    holds: () => {
      const monotone = SCALE_TABLE.every(
        (row, i) => i === 0 || row.floor < SCALE_TABLE[i - 1].floor,
      );
      return monotone && floorAt(1) > 0.98 && floorAt(50) < 1e-8;
    },
  },
  {
    // (S2) The contraction is already half-lost above the mean spacing d (k_half ~ 8.76, y ~ 0.46 d).
    id: 'imp3671-half-contraction-above-mean-spacing',
    description: 'floor crosses 1/2 at k ~ 8.76 (strip height ~0.46 d), i.e. above the true nearest-pair gap',
    holds: () =>
      Math.abs(floorAt(K_HALF) - 0.5) < 1e-12 &&
      K_HALF > 8 &&
      K_HALF < 9.5 &&
      Y_HALF_OVER_D > 0.4 &&
      Y_HALF_OVER_D < 0.5,
  },
  {
    // Verdict flags: structurally silent, does not supply C_Lip, G6a stays open.
    id: 'imp3671-verdict-structurally-silent',
    description: 'Assessment concludes structurally silent: no Lipschitz modulus supplied, G6a open',
    holds: () =>
      IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.suppliesLipschitzModulus === false &&
      IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.structurallySilent === true &&
      IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.g6aStillOpen === true,
  },
  {
    // Honesty gate: assessment/derivation only, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp3671-honesty-gate-no-qed',
    description: 'Assessment/derivation only: no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.verdict) &&
      /remains the rigorous SOTA/.test(IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.verdict),
  },
];

for (const a of IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment assertion failed: ${a.id}`);
  }
}
