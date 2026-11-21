/**
 * @module imp-95705-cf-integrated-reach-measured
 *
 * imp-95705 (numerical, frontier-direction): imp-95691 pinned CF_BAND_HI to the geometric mean
 * sqrt(1.2 * 1.4) ~ 1.29615 of an ASSERTED 1.2-1.4x integrated direction-flip reach. That band was a
 * downweighting of the imp-1134 (c-f-bulk-refinement) fixed-alpha local flip ratios ~1.91x (alpha=0.5)
 * and ~4.56x (alpha=0.8), and the imp-1134 JSDoc itself claims "numerically integrating the EXACT
 * denominator against rho(T) gives a direction-flip factor of approximately 1.2 to 1.4" -- but Section IV
 * of that module NEVER produced 1.2-1.4: it computes RATIO_V2(alpha) = ~1.91 / ~4.56 and the 1.2-1.4 was
 * only asserted. This module COMPUTES the operation the ticket names: it integrates the fixed-alpha local
 * flip ratio r_alpha(T) = T^2 / (T - alpha*T0)^2 against the rho(T)/T^2 measure (rho(T) = log(T/2pi)/2pi,
 * the leading Riemann-von Mangoldt density) and reports the MEASURED effective multiplier and how far it
 * moves the imp-95658/imp-95617 box-min gap. It replaces the asserted band with the measured one.
 *
 * THE MEASURED INTEGRATED REACH (baked literals; see @reproduce)
 * -------------------------------------------------------------
 *   reach(alpha) := [ int_{T0}^{1e4 T0} rho(T)/(T - alpha*T0)^2 dT ] / [ int_{T0}^{1e4 T0} rho(T)/T^2 dT ]
 *   is exactly "integrate the fixed-alpha local flip ratio against the rho(T)/T^2 measure". It is
 *   scale-invariant in T0 up to the slowly-varying log (1.914 at T0=2990, 1.926 at 9878, 1.967 at 4.85e8).
 *   The measured alpha-profile at the imp-1134 baseline anchor T0 = 2990.04 is:
 *       alpha = 0.10  ->  reach = 1.1028
 *       alpha = 0.20  ->  reach = 1.2309
 *       alpha = 0.30  ->  reach = 1.3948
 *       alpha = 0.50  ->  reach = 1.9138   (the bulk MIDPOINT k_star -- imp-1134 Section IV variant 2)
 *       alpha = 0.80  ->  reach = 4.5772
 *       alpha = 0.90  ->  reach = 8.9177
 *   KEY: the asserted 1.2-1.4 band corresponds to alpha in [0.20, 0.30] -- the LOWER quintile of the bulk
 *   [T0-side], NOT the physical bulk-midpoint off-ladder zero k_star = 0.5. The module's OWN physical
 *   representative (alpha = 0.5, the midpoint zero it names in Section IV) integrates to 1.9138x, well
 *   ABOVE the asserted 1.2-1.4x. The uniform average over the bulk range alpha in [0.1, 0.9] is 2.632x.
 *
 * REPLACING THE ASSERTED BAND (K1): the measured reach is HIGHER, not lower
 * ------------------------------------------------------------------------
 *   The honest MEASURED integrated reach at the module's own bulk-midpoint representative is 1.9138x,
 *   NOT 1.2-1.4x. The 1.2-1.4x downweighting had no computational basis in imp-1134 (it lives at alpha
 *   ~0.25-0.30, with no stated justification for demoting the midpoint k_star to the lower quintile).
 *   The measured value therefore moves CF_BAND_HI UPWARD past the imp-95691 geometric-mean pin 1.29615.
 *
 * RE-RUN OF THE imp-95658/imp-95617 BOX-MIN GAP AT THE MEASURED REACH (K2)
 * -----------------------------------------------------------------------
 *   Using the identical imp-95660 full-model box-min gap over the +/-50% (C_C, E_trunc) band
 *   (BAND = [0.5,0.7,0.85,1.0,1.15,1.3,1.5], gap = log10 N_knee - log10 N_cross):
 *       cf = 1.0000 (imp-95617 nominal):    minGap = -0.004682   corner (C_C 0.5x, E_trunc 1.5x)
 *       cf = 1.2961 (imp-95691 pinned GM):  minGap = -0.013197   corner (C_C 0.5x, E_trunc 1.5x)
 *       cf = 1.9138 (MEASURED bulk-mid):    minGap = -0.030490   corner (C_C 0.5x, E_trunc 1.5x)
 *       cf = 2.6321 (uniform bulk-avg):     minGap = -0.049835   corner (C_C 0.5x, E_trunc 1.5x)
 *   At the measured bulk-midpoint reach the box-min gap deepens to -0.030490 -- ~6.51x the nominal
 *   -0.004682 depth (vs imp-95691's ~2.82x at the asserted geometric mean). The box-min corner never
 *   leaves the imp-95617 wedge corner (C_C 0.5x, E_trunc 1.5x): the honest UPWARD C_F revision deepens
 *   the SAME inversion, it does not migrate or heal it. Replacing the asserted 1.2-1.4x band with the
 *   measured reach opens the transition-before-knee wedge FURTHER than imp-95691 concluded.
 *
 * SUB-GAP (named): CF-alpha-weight-unpinned. The measured reach depends on WHICH bulk off-ladder position
 * alpha dominates the direction-flip, which is NOT rigorously pinned: the reach spans 1.10 (alpha=0.1) to
 * 8.92 (alpha=0.9), and the choice of the bulk-midpoint k_star = 0.5 (1.914x) versus the uniform bulk
 * average (2.632x) versus the asserted lower-quintile band (1.2-1.4x) is a heuristic, not a theorem. All
 * three lie ABOVE 1.2 and all deepen the wedge; the sub-gap is the exact multiplier, not its sign.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Integration + box-min re-evaluation on the inherited imp-3220/imp-3406
 * model, NOT a rigorous asymptotic. The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @reproduce tmp/imp-95705-scratch.mjs integrates reach(alpha) via a 4e5-panel midpoint rule on
 *   int rho/(T - alpha*T0)^2 dT over [T0, 1e4 T0] (imp-1134 numericalSOff_midpointDenominator) divided by
 *   the closed-form int rho/T^2 = (log(T0/2pi)+1)/(2pi T0), then re-runs the imp-95660 box-min gap
 *   (importing effectiveHeightForN and C_C_PINNED) at each measured cf; literals baked here to keep this
 *   data module import-light.
 * @see imp-95691-cf-band-hi-pinned-wedge-opening (pinned CF_BAND_HI to the ASSERTED-band geometric mean)
 * @see imp-95674-cf-provenance-band-wedge-reachability (assembled the band; left CF_BAND_HI unpinned)
 * @see imp-95660-cf-multiplier-wedge-closure (exact box-min gap model; cf* ~ 0.839; slope ~ -0.029)
 * @see c-f-bulk-refinement-2026-05 (imp-1134: C_F is a LOWER bound; Section IV RATIO_V2 = ~1.91/~4.56)
 */

import { IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING } from './imp-95691-cf-band-hi-pinned-wedge-opening.js';

// --- Measured integrated reach reach(alpha) (reproduced by tmp/imp-95705-scratch.mjs) --------------
// reach(alpha) = int rho/(T-alpha*T0)^2 / int rho/T^2 over [T0, 1e4 T0], T0 = 2990.04 (imp-1134 anchor).
const REACH_PROFILE = {
  a010: 1.1028,
  a020: 1.2309,
  a030: 1.3948,
  a050: 1.9138, // bulk MIDPOINT k_star -- imp-1134 Section IV variant 2 physical representative
  a080: 4.5772,
  a090: 8.9177,
};
const REACH_BULK_MIDPOINT = REACH_PROFILE.a050; // 1.9138 -- the measured integrated reach at k_star=0.5
const REACH_UNIFORM_BULK_AVG = 2.6321; // uniform average of reach(alpha) over alpha in [0.1, 0.9]

// The asserted band imp-95691 downweighted to; corresponds to alpha in [0.20, 0.30] (lower quintile).
const ASSERTED_LO = 1.2;
const ASSERTED_HI = 1.4;
const IMP95691_PINNED_GM = 1.29615; // sqrt(1.2*1.4) -- imp-95691 CF_BAND_HI_PINNED

// --- Baked box-min gap re-evaluation at the MEASURED reach (reproduced by scratch) ----------------
// minGap over the +/-50% (C_C, E_trunc) BAND; corner is fixed at the imp-95617 wedge corner for all cf.
const MINGAP_AT_CF1 = -0.004682; // imp-95617 nominal (reproduces byte-for-byte)
const MINGAP_AT_GM = -0.013197; // cf = 1.29615 imp-95691 pinned geom mean (matches imp-95691 -0.013188)
const MINGAP_AT_MEASURED = -0.030490; // cf = 1.9138 MEASURED bulk-midpoint reach
const MINGAP_AT_UNIFORM = -0.049835; // cf = 2.6321 uniform bulk average
const WEDGE_CORNER = { cC_mult: 0.5, eTrunc_mult: 1.5 }; // imp-95617 wedge corner (fixed for all cf)

const OPENING_AT_MEASURED = +(MINGAP_AT_MEASURED - MINGAP_AT_CF1).toFixed(6); // ~ -0.025808 dex
const DEEPEN_FACTOR_MEASURED = +(MINGAP_AT_MEASURED / MINGAP_AT_CF1).toFixed(3); // ~6.513x

export const IMP95705_CF_INTEGRATED_REACH_MEASURED = {
  id: 'imp-95705',
  proofSection: 'S-frontier',
  question:
    'Replace the imp-95691 ASSERTED 1.2-1.4x integrated C_F direction-flip reach with the MEASURED one: ' +
    'actually integrate the imp-1134 fixed-alpha local flip ratio r_alpha(T) = T^2/(T-alpha*T0)^2 against ' +
    'the rho(T)/T^2 measure, report the resulting effective multiplier band, and re-run the ' +
    'imp-95658/imp-95617 box-min corner at the measured reach. Sensitivity/measurement only; no QED.',
  measuredQuantity:
    'reach(alpha) = int_{T0}^{1e4 T0} rho(T)/(T-alpha*T0)^2 dT divided by int_{T0}^{1e4 T0} rho(T)/T^2 dT ' +
    '(the exact "integrate the fixed-alpha local flip ratio against the rho(T)/T^2 measure" operation), ' +
    'plus the imp-95617 box-min gap at the measured reach',
  reachProfile: REACH_PROFILE,
  reachBulkMidpoint: REACH_BULK_MIDPOINT, // 1.9138 -- the measured integrated reach (k_star = 0.5)
  reachUniformBulkAvg: REACH_UNIFORM_BULK_AVG, // 2.6321
  assertedBand: { lo: ASSERTED_LO, hi: ASSERTED_HI, imp95691_pinned_gm: IMP95691_PINNED_GM },
  assertedBandCorrespondsToAlpha: '[0.20, 0.30] (lower quintile of the bulk, NOT the k_star=0.5 midpoint)',
  boxMinGap: {
    at_cf1_nominal: MINGAP_AT_CF1, // -0.004682 (imp-95617)
    at_imp95691_gm: MINGAP_AT_GM, // -0.013197 (matches imp-95691 -0.013188)
    at_measured_bulk_midpoint: MINGAP_AT_MEASURED, // -0.030490
    at_uniform_bulk_avg: MINGAP_AT_UNIFORM, // -0.049835
    corner: WEDGE_CORNER, // (C_C 0.5x, E_trunc 1.5x) for ALL cf -- the imp-95617 wedge corner
  },
  wedgeOpening: {
    opening_at_measured: OPENING_AT_MEASURED, // ~ -0.025808 dex
    deepen_factor_at_measured: DEEPEN_FACTOR_MEASURED, // ~6.513x (vs imp-95691 ~2.817x at the asserted GM)
  },
  finding: {
    K1_measured_reach_exceeds_the_asserted_band:
      'Integrating the fixed-alpha local flip ratio against the rho(T)/T^2 measure gives reach = ' +
      REACH_BULK_MIDPOINT + 'x at the module OWN bulk-midpoint off-ladder zero k_star = 0.5 (imp-1134 ' +
      'Section IV variant 2), ABOVE the asserted 1.2-1.4x band. That band corresponds to alpha in ' +
      '[0.20, 0.30] -- the lower quintile of the bulk -- with no stated basis for demoting the midpoint ' +
      'k_star. The honest measured reach thus moves CF_BAND_HI UPWARD past the imp-95691 pin ' +
      IMP95691_PINNED_GM + 'x.',
    K2_box_min_deepens_to_6p5x_at_the_measured_reach:
      'Re-running the imp-95658/imp-95617 box-min gap at the measured reach cf = ' + REACH_BULK_MIDPOINT +
      ' drives minGap from ' + MINGAP_AT_CF1 + ' to ' + MINGAP_AT_MEASURED + ' -- an opening of ' +
      OPENING_AT_MEASURED + ' dex, i.e. ~' + DEEPEN_FACTOR_MEASURED + 'x the nominal depth (vs the ' +
      'imp-95691 ~2.82x at the asserted geometric mean). The corner stays fixed at (C_C 0.5x, E_trunc ' +
      '1.5x): the honest upward revision deepens the SAME inversion, it does not migrate or heal it.',
    K3_sub_gap_is_the_alpha_weight_not_the_sign:
      'SUB-GAP CF-alpha-weight-unpinned: the measured reach depends on which bulk off-ladder position ' +
      'alpha dominates the direction-flip, which is not rigorously pinned (reach spans 1.10 at alpha=0.1 ' +
      'to 8.92 at alpha=0.9). The bulk-midpoint k_star (1.914x), the uniform bulk average (2.632x) and ' +
      'the asserted lower-quintile band (1.2-1.4x) all lie ABOVE 1.2 and all deepen the wedge; the ' +
      'sub-gap is the exact multiplier, not its sign (the wedge opens for every admissible weight).',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). Actually integrating the imp-1134 ' +
    'fixed-alpha local flip ratio r_alpha(T) = T^2/(T-alpha*T0)^2 against the rho(T)/T^2 measure gives a ' +
    'MEASURED integrated reach of ' + REACH_BULK_MIDPOINT + 'x at the module own bulk-midpoint off-ladder ' +
    'zero k_star = 0.5, ABOVE the imp-95691 ASSERTED 1.2-1.4x band (which corresponds to the lower-' +
    'quintile alpha in [0.20, 0.30], with no stated basis). Re-running the imp-95658/imp-95617 box-min ' +
    'gap at the measured reach gives minGap = ' + MINGAP_AT_MEASURED + ' -- ~' + DEEPEN_FACTOR_MEASURED +
    'x the nominal -0.004682 depth, at the same (C_C 0.5x, E_trunc 1.5x) wedge corner, deepening the ' +
    'transition-before-knee inversion FURTHER than the imp-95691 ~2.82x. The named sub-gap is ' +
    'CF-alpha-weight-unpinned: the exact multiplier depends on the (non-rigorous) bulk-alpha weight ' +
    '(reach 1.10x to 8.92x across the bulk), but every admissible weight lies above 1.2 and opens the ' +
    'wedge -- the sub-gap is the multiplier, not its sign. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95691 (pinned CF_BAND_HI to the geometric mean of the ASSERTED 1.2-1.4x reach); imp-95674 ' +
    '(assembled the C_F provenance band; left CF_BAND_HI unpinned); imp-95660 (exact box-min gap model; ' +
    'cf* ~ 0.839; d(minGap)/d(cf) ~ -0.029); imp-95617 (nominal box-min gap -0.00468 at cf=1); imp-1134 ' +
    'c-f-bulk-refinement (Section IV RATIO_V2 = ~1.91x/~4.56x; C_F is a LOWER bound); imp-398/imp-838 ' +
    '(C_F closed form); imp-486 (C_mb GUE-conditional).',
};

export const IMP95705_CF_INTEGRATED_REACH_MEASURED_ASSERTIONS = [
  {
    // The measured bulk-midpoint reach exceeds the asserted band and the imp-95691 pin.
    id: 'imp95705-measured-reach-exceeds-asserted-band',
    description: 'measured bulk-midpoint reach ~1.914x > asserted 1.4x and > imp-95691 pin 1.29615x',
    holds: () =>
      REACH_BULK_MIDPOINT > ASSERTED_HI &&
      REACH_BULK_MIDPOINT > IMP95691_PINNED_GM &&
      Math.abs(REACH_BULK_MIDPOINT - 1.9138) < 5e-3,
  },
  {
    // The reach profile is strictly increasing in alpha and brackets the asserted band at [0.2, 0.3].
    id: 'imp95705-reach-monotone-brackets-asserted',
    description: 'reach(alpha) strictly increasing; asserted 1.2-1.4 sits at alpha in [0.20, 0.30]',
    holds: () =>
      REACH_PROFILE.a010 < REACH_PROFILE.a020 &&
      REACH_PROFILE.a020 < REACH_PROFILE.a030 &&
      REACH_PROFILE.a030 < REACH_PROFILE.a050 &&
      REACH_PROFILE.a050 < REACH_PROFILE.a080 &&
      REACH_PROFILE.a080 < REACH_PROFILE.a090 &&
      REACH_PROFILE.a020 >= ASSERTED_LO && REACH_PROFILE.a030 <= ASSERTED_HI + 1e-9,
  },
  {
    // The box-min re-run reproduces imp-95617 at cf=1 and imp-95691 at the geometric-mean pin.
    id: 'imp95705-boxmin-reproduces-anchors',
    description: 'minGap(cf=1) = -0.004682 (imp-95617) and minGap(cf=GM) ~ imp-95691 -0.01319',
    holds: () =>
      Math.abs(MINGAP_AT_CF1 - -0.004682) < 1e-6 &&
      Math.abs(MINGAP_AT_GM - -0.013197) < 1e-6 &&
      Math.abs(MINGAP_AT_GM - IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.boxMinGap.at_pinned_geom_mean) < 5e-5,
  },
  {
    // The measured reach deepens the wedge further than the imp-95691 pin, at the fixed wedge corner.
    id: 'imp95705-measured-deepens-past-imp95691',
    description: 'minGap at measured reach < imp-95691 GM gap < 0; corner fixed at (C_C 0.5x, E_trunc 1.5x)',
    holds: () =>
      MINGAP_AT_MEASURED < MINGAP_AT_GM &&
      MINGAP_AT_GM < 0 &&
      DEEPEN_FACTOR_MEASURED > IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.wedgeOpening.deepen_factor_at_pin &&
      WEDGE_CORNER.cC_mult === 0.5 &&
      WEDGE_CORNER.eTrunc_mult === 1.5,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95705-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95705_CF_INTEGRATED_REACH_MEASURED.isRigorous === false &&
      /NO QED/.test(IMP95705_CF_INTEGRATED_REACH_MEASURED.verdict) &&
      /refereed bound is changed/i.test(IMP95705_CF_INTEGRATED_REACH_MEASURED.verdict),
  },
];

for (const a of IMP95705_CF_INTEGRATED_REACH_MEASURED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95705-cf-integrated-reach-measured assertion failed: ${a.id}`);
  }
}
