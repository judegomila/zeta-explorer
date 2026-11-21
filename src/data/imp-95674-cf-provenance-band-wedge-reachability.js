/**
 * @module imp-95674-cf-provenance-band-wedge-reachability
 *
 * imp-95674 (numerical, frontier-direction): imp-95660 found that the imp-95617 transition-knee
 * inversion wedge closes at a C_F MULTIPLIER cf* ~ 0.83891 -- i.e. it is fragile to only a ~16pct
 * DOWNWARD revision of the imp-398 prefactor C_F = (log(T0/2pi)+1)/2pi -- and reported the wedge
 * depth is near-linear in cf (d(minGap)/d(cf) ~ -0.029 dex). imp-95660 CALLED cf* < 1 "well inside a
 * modest imp-398 provenance band" but never DERIVED that band. This module assembles the honest
 * provenance band of the imp-398 C_F constant from its recorded lineage and decides whether the
 * cf* = 0.839 wedge-closure multiplier actually lies inside it -- i.e. whether the imp-95617 E_flow
 * inversion wedge is physically REACHABLE (cf* inside band) or FORECLOSED (cf* outside band).
 *
 * THE C_F PROVENANCE LINEAGE (assembled, not re-derived)
 * -----------------------------------------------------
 *   - imp-398 / imp-838: the closed form C_F = (log(T0/2pi)+1)/2pi is an analytic pinning of the
 *     order-unity off-ladder flow constant via the Polymath15 (arXiv:1904.12438) bulk-approximation
 *     lemma, S_off ~ int_{T0}^inf rho(T)/T^2 dT with rho the leading-order Riemann-von Mangoldt
 *     density. It is NOT a fitted parameter with a symmetric error bar; it is a formula.
 *   - imp-2704: within that fixed closed form the ONLY residual uncertainty is the height enclosure
 *     T0 = effectiveHeightForN(N), interval-certified by count-monotonicity to a half-width ~0.5 in
 *     ~9879, i.e. a fractional C_F uncertainty ~5e-5. This lane supplies NO room for a 16pct move.
 *   - imp-1134 (c-f-bulk-refinement): the honest DOWNWARD tightening audit. The natural
 *     denominator-refinement direction ((T-gamma)(T-gamma+) vs T^2) is SIGN-FLIPPED: the exact
 *     denominator is < T^2, so the true off-ladder amplitude is LARGER, ratios ~1.91x (alpha=0.5) and
 *     ~4.56x (alpha=0.8) locally, ~1.2-1.4x integrated. C_F is therefore a LOWER bound. The only
 *     genuine DOWNWARD lanes are (a) shifted-lower-limit and (b) Euler-Maclaurin, both with ratio
 *     ~0.9999 (a sub-0.01pct reduction), and (c) a ~1.005x Gronwall micro-floor that lives in C_G,
 *     NOT in C_F, and is itself research-grade. The rigorous downward tightening factor is 1.00x.
 *
 * THE HONEST BAND (asymmetric, downward-narrow)
 * ---------------------------------------------
 *   Expressed as a multiplier cf on the nominal C_F, the honest provenance band is
 *       cf in [CF_BAND_LO, CF_BAND_HI] ~ [0.995, 1.40]
 *   where CF_BAND_HI ~ 1.2-1.4 is the imp-1134 sign-direction UPPER reach (the true C_F is larger),
 *   and the DOWNWARD edge is the crux: the rigorous downward factor is 1.00x (cf = 1.000); the
 *   largest honest downward lane that touches C_F at all is the shifted/EM ~0.9999 lane (cf ~ 0.9999);
 *   the most generous honest downward edge, ILLEGITIMATELY crediting the C_G Gronwall micro-floor to
 *   C_F, is cf ~ 0.995. Any deeper cut requires a sharper-than-RvM local law or an argmin min-gap
 *   bound -- both RESEARCH_GRADE_HARD in imp-1134, and the local-law route is questionable after the
 *   imp-1108 ESY empirical falsification. So NO honest lane reaches even cf = 0.99.
 *
 * THE DECISION (K1): cf* = 0.839 IS OUTSIDE THE HONEST BAND -> THE WEDGE IS FORECLOSED
 * -----------------------------------------------------------------------------------
 *   The wedge needs cf <= cf* = 0.83891 (a 16.1pct downward revision of C_F). The honest downward
 *   band edge is CF_BAND_LO ~ 0.995 (generous) or ~0.9999 (rigorous). cf* sits BELOW that floor by
 *   ~0.156 in multiplier (~15.6 percentage points), i.e. the required cut is ~32x the largest honest
 *   downward lane (~0.5pct). Worse, the honest evidence points the OTHER way: imp-1134 shows C_F is a
 *   LOWER bound, so the physically-supported revision is UPWARD (cf ~ 1.2-1.4), which drives the
 *   box-min gap MORE negative and does NOT close the wedge. Conclusion: the imp-95617 E_flow
 *   inversion wedge is physically UNREACHABLE -- the ~16pct C_F fragility imp-95660 measured is a
 *   fragility to a revision the provenance forbids, not to one it permits.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Provenance-band assembly + reachability decision, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95660-cf-multiplier-wedge-closure (measured cf* ~ 0.839; called it "inside a modest band")
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint sweep WITH E_flow at cf=1)
 * @see c-f-bulk-refinement-2026-05 (imp-1134: C_F is a LOWER bound; honest downward factor 1.00x)
 * @see imp-2704-cf-interval-certificate (C_F fixed-form uncertainty ~5e-5 via height enclosure)
 * @see imp-398 (E_flow = C_F (log T0 / T0) Gronwall; C_F = (log(T0/2pi)+1)/2pi)
 */

import { C_F_BULK_REFINEMENT } from './c-f-bulk-refinement-2026-05.js';

// imp-95660 measured wedge-closure multiplier (baked literal; import-light, no re-run of the
// imp-95660 box bisections). cf* is the C_F multiplier at which anyInvertInBox flips true -> false.
const CF_STAR = 0.83891;

// Nominal C_F multiplier and the wedge requirement.
const CF_NOMINAL = 1.0;
const CF_WEDGE_REQUIREMENT = CF_STAR; // wedge inverts only for cf <= cf*

// --- Honest downward lanes on C_F (from imp-1134 numericalVerification), as multipliers cf < 1 ----
const nv = C_F_BULK_REFINEMENT.numericalVerification;
const CF_LANE_SHIFTED = nv.ratio_shifted_over_bulk;       // ~0.9999 shifted-lower-limit
const CF_LANE_EULER_MACLAURIN = nv.ratio_eulerMaclaurin_over_bulk; // ~0.9999 Euler-Maclaurin
const CF_LANE_GRONWALL_MICROFLOOR = 1 / 1.005;            // ~0.99502 -- lives in C_G, NOT C_F
const CF_RIGOROUS_DOWNWARD_FACTOR = C_F_BULK_REFINEMENT.tighteningFactor; // 1.00x rigorous (no move)

// --- Honest upward reach (imp-1134 sign-direction audit): C_F is a LOWER bound --------------------
const CF_LANE_DENOM_REFINE_ALPHA05 = nv.ratio_alpha05_over_bulk; // ~1.91x (local, alpha=0.5)
const CF_LANE_DENOM_REFINE_ALPHA08 = nv.ratio_alpha08_over_bulk; // ~4.56x (local, alpha=0.8)
const CF_BAND_HI_INTEGRATED = 1.4; // imp-1134 integrated direction-flip upper reach (20-40pct larger)

// The honest band edges as multipliers cf. The DOWNWARD edge is the crux for the wedge.
// - rigorous edge: 1.000 (no honest downward movement of C_F itself)
// - generous edge: ~0.995 (illegitimately crediting the C_G Gronwall micro-floor to C_F)
const CF_BAND_LO_RIGOROUS = Math.min(CF_LANE_SHIFTED, CF_LANE_EULER_MACLAURIN); // ~0.9999
const CF_BAND_LO_GENEROUS = CF_LANE_GRONWALL_MICROFLOOR;                        // ~0.99502
const CF_BAND_HI = CF_BAND_HI_INTEGRATED;                                       // ~1.40

// --- Reachability decision -----------------------------------------------------------------------
// cf* is reachable iff it lies at or above the honest downward band floor (using the MOST GENEROUS
// floor to be maximally charitable to the wedge). If cf* is below even the generous floor, foreclosed.
const CF_STAR_INSIDE_BAND = CF_WEDGE_REQUIREMENT >= CF_BAND_LO_GENEROUS && CF_WEDGE_REQUIREMENT <= CF_BAND_HI;
const WEDGE_REACHABLE = CF_STAR_INSIDE_BAND;

// Margin by which cf* falls short of the honest downward floor (positive = foreclosed depth).
const FORECLOSURE_MARGIN_GENEROUS = +(CF_BAND_LO_GENEROUS - CF_WEDGE_REQUIREMENT).toFixed(5); // ~0.156
const FORECLOSURE_MARGIN_RIGOROUS = +(CF_BAND_LO_RIGOROUS - CF_WEDGE_REQUIREMENT).toFixed(5); // ~0.161
// Required downward revision (pct) vs the largest honest downward lane (pct).
const REQUIRED_DOWNWARD_PCT = +((1 - CF_WEDGE_REQUIREMENT) * 100).toFixed(2);          // ~16.11pct
const LARGEST_HONEST_DOWNWARD_PCT = +((1 - CF_BAND_LO_GENEROUS) * 100).toFixed(2);     // ~0.50pct
const OVERSHOOT_FACTOR = +(REQUIRED_DOWNWARD_PCT / LARGEST_HONEST_DOWNWARD_PCT).toFixed(1); // ~32x

export const IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY = {
  id: 'imp-95674',
  proofSection: 'S-frontier',
  question:
    'Derive the honest provenance band of the imp-398 C_F = (log(T0/2pi)+1)/2pi prefactor from its ' +
    'Polymath15/Gronwall lineage (imp-398/imp-838, imp-2704 interval certificate, imp-1134 downward ' +
    'audit) and decide whether the imp-95660 wedge-closure multiplier cf* ~ 0.839 lies inside it -- ' +
    'i.e. whether the imp-95617 E_flow inversion wedge is physically reachable. Sensitivity/' +
    'measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the honest C_F provenance band [cf_lo, cf_hi] as a multiplier on the nominal C_F; the ' +
    'reachability verdict for the cf* = 0.839 wedge-closure multiplier; the foreclosure margin and ' +
    'the overshoot factor of the required downward revision vs the largest honest downward lane',
  cfNominal: CF_NOMINAL,
  cfStar: CF_STAR,
  cfWedgeRequirement: CF_WEDGE_REQUIREMENT,
  provenanceLanes: {
    // downward (would LOWER C_F, i.e. cf < 1) -- the only direction the wedge can use
    shifted_lower_limit: +CF_LANE_SHIFTED.toFixed(5),
    euler_maclaurin: +CF_LANE_EULER_MACLAURIN.toFixed(5),
    gronwall_microfloor_in_C_G_not_C_F: +CF_LANE_GRONWALL_MICROFLOOR.toFixed(5),
    rigorous_downward_factor: CF_RIGOROUS_DOWNWARD_FACTOR,
    // upward (would RAISE C_F; imp-1134 shows C_F is a LOWER bound)
    denom_refine_alpha05_local: +CF_LANE_DENOM_REFINE_ALPHA05.toFixed(4),
    denom_refine_alpha08_local: +CF_LANE_DENOM_REFINE_ALPHA08.toFixed(4),
    integrated_upper_reach: CF_BAND_HI_INTEGRATED,
  },
  honestBand: {
    cf_lo_rigorous: +CF_BAND_LO_RIGOROUS.toFixed(5), // ~0.9999 (shifted/EM lanes)
    cf_lo_generous: +CF_BAND_LO_GENEROUS.toFixed(5), // ~0.99502 (crediting C_G micro-floor to C_F)
    cf_hi: +CF_BAND_HI.toFixed(4),                   // ~1.40 (sign-direction upper reach)
    asymmetryNote:
      'The band is asymmetric and downward-narrow: C_F is a LOWER bound (imp-1134), so the ' +
      'physically-supported revision is UPWARD (cf up to ~1.2-1.4); honest DOWNWARD room is at most ' +
      '~0.5pct, and that ~0.5pct lane actually lives in C_G, not C_F.',
  },
  cfStarInsideBand: CF_STAR_INSIDE_BAND, // false
  wedgeReachable: WEDGE_REACHABLE,       // false -> foreclosed
  foreclosure: {
    margin_below_generous_floor: FORECLOSURE_MARGIN_GENEROUS, // ~0.156
    margin_below_rigorous_floor: FORECLOSURE_MARGIN_RIGOROUS, // ~0.161
    required_downward_pct: REQUIRED_DOWNWARD_PCT,             // ~16.11
    largest_honest_downward_pct: LARGEST_HONEST_DOWNWARD_PCT, // ~0.50
    overshoot_factor: OVERSHOOT_FACTOR,                       // ~32x
  },
  finding: {
    K1_cf_star_outside_honest_band_wedge_foreclosed:
      'The wedge needs cf <= cf* = 0.83891, a ' + REQUIRED_DOWNWARD_PCT + 'pct DOWNWARD revision of ' +
      'C_F. The honest downward provenance floor is cf ~ 0.9999 (rigorous shifted/EM lanes) or ' +
      '~0.995 at the most generous (illegitimately crediting the C_G Gronwall micro-floor to C_F). ' +
      'cf* sits ~0.156 below even the generous floor -- the required cut is ~' + OVERSHOOT_FACTOR +
      'x the largest honest downward lane -- so cf* is OUTSIDE the honest band and the imp-95617 ' +
      'E_flow inversion wedge is physically FORECLOSED, not reachable.',
    K2_honest_evidence_points_the_wrong_way:
      'imp-1134 shows the imp-398 C_F is a LOWER bound (the natural denominator refinement RAISES it, ' +
      'ratios ~1.91x/4.56x local, ~1.2-1.4x integrated). The physically-supported revision is ' +
      'therefore UPWARD (cf ~ 1.2-1.4), which drives the box-min gap MORE negative (imp-95660 K3: ' +
      'd(minGap)/d(cf) ~ -0.029 dex) and does NOT close the wedge. The ~16pct fragility imp-95660 ' +
      'measured is a fragility to a revision the provenance forbids.',
    K3_within_fixed_form_uncertainty_is_negligible:
      'Within the fixed imp-398 closed form the only residual C_F uncertainty is the imp-2704 ' +
      'interval-certified height enclosure, ~5e-5 fractional -- three orders of magnitude too small ' +
      'to supply even a 0.5pct move, let alone 16pct.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). Assembling the imp-398 C_F ' +
    'provenance lineage (imp-398/imp-838 closed form, imp-2704 ~5e-5 interval certificate, imp-1134 ' +
    'downward audit) gives an asymmetric, downward-narrow honest band cf in [~0.995, ~1.40]: the ' +
    'rigorous downward tightening factor is 1.00x, the largest honest downward lane is ~0.5pct (and ' +
    'it lives in C_G, not C_F), and C_F is in fact a LOWER bound so the supported revision is UPWARD. ' +
    'The imp-95660 wedge-closure multiplier cf* ~ 0.839 (a ~16pct DOWNWARD revision) sits ~0.156 ' +
    'below the most generous honest floor -- ~32x the largest honest downward lane -- so cf* is ' +
    'OUTSIDE the honest provenance band and the imp-95617 E_flow inversion wedge is physically ' +
    'FORECLOSED. This corrects the imp-95660 reading that cf* < 1 lay "inside a modest band": it does ' +
    'not. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95660 (measured cf* ~ 0.839, called it inside a modest band); imp-95617 (joint 2-D sweep ' +
    'WITH E_flow at cf=1); imp-1134 c-f-bulk-refinement (C_F is a LOWER bound; honest downward factor ' +
    '1.00x; shifted/EM ~0.9999 lanes; ~1.005x Gronwall micro-floor in C_G); imp-2704 (C_F fixed-form ' +
    'uncertainty ~5e-5); imp-398/imp-838 (C_F closed form); imp-486 (C_mb GUE-conditional); imp-1108 ' +
    '(ESY empirical falsification of the local-law route).',
};

export const IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY_ASSERTIONS = [
  {
    // The imported imp-1134 downward lanes must confirm the honest downward room is tiny (sub-pct).
    id: 'imp95674-honest-downward-lanes-subpct',
    description: 'shifted/EM downward lanes give ratio > 0.99 (sub-pct); rigorous factor is 1.00x',
    holds: () =>
      CF_LANE_SHIFTED > 0.99 &&
      CF_LANE_SHIFTED <= 1.0 &&
      CF_LANE_EULER_MACLAURIN > 0.99 &&
      CF_LANE_EULER_MACLAURIN <= 1.0 &&
      CF_RIGOROUS_DOWNWARD_FACTOR === 1.0,
  },
  {
    // imp-1134 sign-direction: the natural refinement RAISES C_F (both local ratios > 1, monotone).
    id: 'imp95674-c-f-is-a-lower-bound',
    description: 'denominator-refinement ratios > 1 (C_F is a LOWER bound; supported revision UP)',
    holds: () =>
      CF_LANE_DENOM_REFINE_ALPHA05 > 1 &&
      CF_LANE_DENOM_REFINE_ALPHA08 >= CF_LANE_DENOM_REFINE_ALPHA05,
  },
  {
    // The crux decision: cf* = 0.839 is strictly below the most generous honest downward floor.
    id: 'imp95674-cf-star-below-generous-floor',
    description: 'cf* ~ 0.839 < generous floor ~0.995 -> outside the honest band',
    holds: () =>
      CF_WEDGE_REQUIREMENT < CF_BAND_LO_GENEROUS &&
      CF_BAND_LO_GENEROUS < 1.0 &&
      FORECLOSURE_MARGIN_GENEROUS > 0.1,
  },
  {
    // Reachability verdict: the wedge is foreclosed (cf* outside band), not reachable.
    id: 'imp95674-wedge-foreclosed',
    description: 'cfStarInsideBand false and wedgeReachable false (foreclosed)',
    holds: () =>
      IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY.cfStarInsideBand === false &&
      IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY.wedgeReachable === false,
  },
  {
    // Overshoot: the required downward revision dwarfs the largest honest downward lane.
    id: 'imp95674-required-cut-dwarfs-honest-lane',
    description: 'required ~16pct downward cut is >= 20x the largest honest downward lane (~0.5pct)',
    holds: () =>
      REQUIRED_DOWNWARD_PCT > 15 &&
      LARGEST_HONEST_DOWNWARD_PCT < 1 &&
      OVERSHOOT_FACTOR >= 20,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95674-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY.isRigorous === false &&
      /NO QED/.test(IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY.verdict),
  },
];

for (const a of IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95674-cf-provenance-band-wedge-reachability assertion failed: ${a.id}`);
  }
}
