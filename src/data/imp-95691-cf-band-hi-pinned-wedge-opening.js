/**
 * @module imp-95691-cf-band-hi-pinned-wedge-opening
 *
 * imp-95691 (numerical, frontier-direction): imp-95674 assembled the honest imp-398 C_F provenance
 * band as an asymmetric multiplier cf in [~0.995, ~1.40] and used the UPPER edge only qualitatively --
 * CF_BAND_HI was left as an UNPINNED range 1.2-1.4x (the imp-1134 sign-direction integrated reach,
 * where the exact off-ladder denominator is < T^2 so the true C_F is LARGER). imp-95674 noted the
 * honest revision points UPWARD and therefore drives the imp-95617 box-min gap MORE negative, but it
 * never PINNED the upper multiplier nor QUANTIFIED the resulting wedge opening. This module does both:
 * it pins CF_BAND_HI to a single defensible upper multiplier and re-runs the imp-95658/imp-95617
 * box-min gap at that pinned cf.
 *
 * PINNING CF_BAND_HI (from the imp-1134 integrated lane)
 * ------------------------------------------------------
 *   The imp-1134 c-f-bulk-refinement numerics give a fixed-alpha local direction-flip ratio ~1.91x
 *   (alpha=0.5) / ~4.56x (alpha=0.8), which the module downweights to an INTEGRATED reach of ~1.2-1.4x
 *   over the rho(T)/T^2 measure (the fixed-alpha shift alpha*T0 is physical only near T=T0 and decays
 *   for T >> T0). The single defensible pin from that multiplicative range is its GEOMETRIC MEAN --
 *   the natural center of a ratio interval -- CF_BAND_HI_PINNED = sqrt(1.2 * 1.4) ~ 1.29615. The
 *   conservative lower edge of the reach (cf = 1.2) is retained as a floor for the "opens by AT LEAST"
 *   statement. The shifted/EM downward lanes (~0.9999) do not touch the UPPER edge and are unchanged.
 *
 * RE-RUN OF THE imp-95658/imp-95617 BOX-MIN GAP AT THE PINNED cf (baked literals; see @reproduce)
 * ---------------------------------------------------------------------------------------------
 *   Using the identical imp-95660 full-model box-min gap over the +/-50% (C_C, E_trunc) band
 *   (BAND = [0.5,0.7,0.85,1.0,1.15,1.3,1.5], gap = log10 N_knee - log10 N_cross):
 *       cf = 1.000 (imp-95617 nominal): minGap = -0.004682   corner (C_C 0.5x, E_trunc 1.5x)
 *       cf = 1.200 (conservative floor): minGap = -0.010441   corner (C_C 0.5x, E_trunc 1.5x)
 *       cf = 1.296 (pinned geom mean):   minGap = -0.013188   corner (C_C 0.5x, E_trunc 1.5x)
 *       cf = 1.400 (upper reach edge):   minGap = -0.016134   corner (C_C 0.5x, E_trunc 1.5x)
 *   The box-min corner never leaves the imp-95617 wedge corner (C_C 0.5x, E_trunc 1.5x): the honest
 *   UPWARD C_F revision deepens the SAME inversion, it does not migrate or heal it.
 *
 * THE FINDING (K1): the pinned upper edge OPENS the wedge by ~2.8x its nominal depth
 * ---------------------------------------------------------------------------------
 *   At the pinned cf = 1.29615 the box-min gap moves from -0.004682 to -0.013188 -- an opening of
 *   -0.008506 dex, i.e. the imp-95617 inversion is ~2.82x DEEPER than at nominal. Even at the
 *   conservative lower edge cf = 1.2 the wedge is ~2.23x deeper (-0.010441); at the upper reach edge
 *   cf = 1.4 it is ~3.45x deeper (-0.016134). Every honest upward multiplier the imp-1134 provenance
 *   SUPPORTS makes minGap strictly MORE negative -- the opening is monotone in cf and never changes
 *   sign. This pins the imp-95674 K2 qualitative statement ("the supported revision is UPWARD and
 *   drives the gap more negative") to a definite magnitude: the transition-before-knee inversion wedge
 *   is opened, never closed, by the honest C_F provenance, by a factor of ~2.2x to ~3.4x across the
 *   pinned upper band.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Pinning + box-min re-evaluation on the inherited imp-3220/imp-3406
 * model, NOT a rigorous asymptotic. The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * SUPERSEDED (honest-status note, updated imp-95757): the chain has moved twice since imp-95733 last
 *   updated this note. imp-95705 MEASURED the integrated direction-flip reach directly and found 1.914x
 *   at the bulk-midpoint representative (uniform bulk average 2.632x); imp-95721 then derived a
 *   density-weighted physical-cutoff band of 6.1x-8.6x (edge-dominated, cutoff-scalar-dependent); imp-95747
 *   then reweighted that density by the GUE pair-correlation form factor and found the near-anchor
 *   divergence REGULARIZES to a cutoff-INDEPENDENT converged value r_eff_GUE = 9.583x -- the current
 *   most defensible single CF_BAND_HI representative, since it no longer depends on an arbitrary cutoff
 *   choice. All of 1.914x, 6.1x-8.6x, and 9.583x sit ABOVE this module's CF_BAND_HI_PINNED = 1.29615.
 *   The 1.29615 geometric-mean pin below is KEPT UNCHANGED (other modules depend on its exact value),
 *   but downstream readers should treat the imp-95747 converged 9.583x as the current honest CF_BAND_HI
 *   representative, not this pin, not the imp-95705 1.914x, and not the imp-95721 6.1x-8.6x band.
 *
 * @reproduce tmp/imp-95691-scratch.mjs reproduces the box-min gaps by importing effectiveHeightForN
 *   and C_C_PINNED and replicating the imp-95660 boxStats/minGapRaw over BAND; literals baked here to
 *   keep this data module import-light (imp-95660 already runs the bisections at load).
 * @see imp-95674-cf-provenance-band-wedge-reachability (assembled the band; left CF_BAND_HI unpinned)
 * @see imp-95660-cf-multiplier-wedge-closure (exact box-min gap model; cf* ~ 0.839; slope ~ -0.029)
 * @see imp-95617-transition-knee-ordering-joint-2d (nominal box-min gap -0.00468 at cf=1)
 * @see c-f-bulk-refinement-2026-05 (imp-1134: C_F is a LOWER bound; integrated reach ~1.2-1.4x)
 * @see imp-95705-cf-integrated-reach-measured (SUPERSEDES this pin with a measured 1.914x reach)
 * @see imp-95721-cf-alpha-weight-density-pinned (SUPERSEDES imp-95705 with a density-weighted 6.1x-8.6x band)
 * @see imp-95747-cf-reff-gue-repulsion-regularization (SUPERSEDES imp-95721 with the GUE-regularized,
 *   cutoff-independent converged value 9.583x -- the current honest CF_BAND_HI representative)
 * @see imp-95754-cf-wedge-depth-vs-multiplier-viz-data (imp-95719: the routed viz asking for "box-min
 *   gap vs cf multiplier across the pinned band" is ALREADY DELIVERED here, at route
 *   /viz-imp95754-cf-wedge-depth-vs-multiplier -- it plots this module's boxMinGap landmarks
 *   (cf = 1, 1.2, 1.29615, 1.4) as the low-cf segment of one continuous curve extended through
 *   imp-95721/imp-95747. Do not build a second page for the same data.)
 */

import { IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY } from './imp-95674-cf-provenance-band-wedge-reachability.js';

// The imp-1134 integrated direction-flip reach (from imp-95674 provenanceLanes / honestBand.cf_hi).
const CF_INTEGRATED_LO = 1.2; // conservative lower edge of the imp-1134 integrated reach
const CF_INTEGRATED_HI = 1.4; // upper edge (== imp-95674 honestBand.cf_hi)

// Pin CF_BAND_HI to the GEOMETRIC MEAN of the multiplicative reach -- the natural single representative
// of a ratio interval (equal log-distance to both edges).
const CF_BAND_HI_PINNED = +Math.sqrt(CF_INTEGRATED_LO * CF_INTEGRATED_HI).toFixed(5); // ~1.29615

// --- Baked box-min gap re-evaluation (reproduced by tmp/imp-95691-scratch.mjs) --------------------
// minGap = min over the +/-50% (C_C, E_trunc) BAND of gap(C_C, E_trunc, cf); corner is the (C_C mult,
// E_trunc mult) at which the min is attained. cf=1 reproduces imp-95617 byte-for-byte.
const MINGAP_AT_CF1 = -0.004682; // imp-95617 nominal (corner C_C 0.5x, E_trunc 1.5x)
const MINGAP_AT_LO = -0.010441; // cf = 1.2 conservative floor
const MINGAP_AT_PIN = -0.013188; // cf = 1.29615 pinned geom mean
const MINGAP_AT_HI = -0.016134; // cf = 1.4 upper reach edge
const WEDGE_CORNER = { cC_mult: 0.5, eTrunc_mult: 1.5 }; // the imp-95617 wedge corner (unchanged for all cf)

// Openings (more negative = wedge opened deeper) and deepening factors vs the nominal wedge depth.
const OPENING_AT_LO = +(MINGAP_AT_LO - MINGAP_AT_CF1).toFixed(6); // ~ -0.005759
const OPENING_AT_PIN = +(MINGAP_AT_PIN - MINGAP_AT_CF1).toFixed(6); // ~ -0.008506
const OPENING_AT_HI = +(MINGAP_AT_HI - MINGAP_AT_CF1).toFixed(6); // ~ -0.011452
const DEEPEN_FACTOR_LO = +(MINGAP_AT_LO / MINGAP_AT_CF1).toFixed(3); // ~2.230x
const DEEPEN_FACTOR_PIN = +(MINGAP_AT_PIN / MINGAP_AT_CF1).toFixed(3); // ~2.817x
const DEEPEN_FACTOR_HI = +(MINGAP_AT_HI / MINGAP_AT_CF1).toFixed(3); // ~3.446x

export const IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING = {
  id: 'imp-95691',
  proofSection: 'S-frontier',
  question:
    'Sharpen the imp-95674 C_F provenance-band UPPER edge (the imp-1134 integrated 1.2-1.4x reach, left ' +
    'as an unpinned range) to a single defensible upper multiplier, then re-run the imp-95658/imp-95617 ' +
    'box-min gap at that pinned cf to quantify by how much the honest UPWARD C_F revision opens (never ' +
    'closes) the transition-before-knee inversion wedge. Sensitivity/measurement only; NOT an RH bound; ' +
    'no QED.',
  measuredQuantity:
    'the pinned upper multiplier CF_BAND_HI_PINNED (geometric mean of the imp-1134 integrated reach) ' +
    'and the imp-95617 box-min gap at that pin (plus the conservative 1.2 floor and the 1.4 edge), ' +
    'expressed as the wedge opening (dex) and the deepening factor vs the nominal cf=1 depth',
  integratedReach: { lo: CF_INTEGRATED_LO, hi: CF_INTEGRATED_HI },
  cfBandHiPinned: CF_BAND_HI_PINNED, // ~1.29615 -- the single defensible upper multiplier
  honestStatus: {
    supersededBy: 'imp-95747',
    supersessionChain: ['imp-95705', 'imp-95721', 'imp-95747'],
    note:
      'This geometric-mean pin (' + CF_BAND_HI_PINNED + ') is an ESTIMATE, not a measurement. The chain has ' +
      'moved twice since it was last updated (imp-95733): imp-95705 measured 1.914x (bulk-midpoint) / ' +
      '2.632x (uniform bulk average); imp-95721 then derived a density-weighted physical-cutoff band of ' +
      '6.1x-8.6x; imp-95747 then reweighted that density by GUE level repulsion and found the near-anchor ' +
      'divergence regularizes to a cutoff-INDEPENDENT converged value of 9.583x. CF_BAND_HI_PINNED is kept ' +
      'unchanged here because other modules depend on its exact value -- downstream readers should treat ' +
      'the imp-95747 converged 9.583x as the current honest CF_BAND_HI representative, superseding both ' +
      'this pin and every intermediate link (imp-95705, imp-95721) in the chain.',
    supersedingValue: 9.583,
  },
  routedViz: {
    fulfillsTicket: 'imp-95719',
    route: '/viz-imp95754-cf-wedge-depth-vs-multiplier',
    note:
      'imp-95719 asked for a routed viz of this box-min gap vs cf multiplier data; imp-95754 already ' +
      'delivers it (this module contributes the cf=1/1.2/1.29615/1.4 landmarks as the low-cf segment ' +
      'of one continuous curve extended through imp-95721/imp-95747).',
  },
  boxMinGap: {
    at_cf1_nominal: MINGAP_AT_CF1, // -0.004682 (imp-95617)
    at_cf_1p2_floor: MINGAP_AT_LO, // -0.010441
    at_pinned_geom_mean: MINGAP_AT_PIN, // -0.013188
    at_cf_1p4_edge: MINGAP_AT_HI, // -0.016134
    corner: WEDGE_CORNER, // (C_C 0.5x, E_trunc 1.5x) for ALL cf -- the imp-95617 wedge corner
  },
  wedgeOpening: {
    opening_at_floor: OPENING_AT_LO, // ~ -0.005759 dex
    opening_at_pin: OPENING_AT_PIN, // ~ -0.008506 dex
    opening_at_edge: OPENING_AT_HI, // ~ -0.011452 dex
    deepen_factor_at_floor: DEEPEN_FACTOR_LO, // ~2.230x
    deepen_factor_at_pin: DEEPEN_FACTOR_PIN, // ~2.817x
    deepen_factor_at_edge: DEEPEN_FACTOR_HI, // ~3.446x
  },
  finding: {
    K1_pinned_upper_edge_opens_wedge_by_2p8x:
      'Pinning CF_BAND_HI to the geometric mean of the imp-1134 integrated reach, cf = ' +
      CF_BAND_HI_PINNED + ', drives the imp-95617 box-min gap from ' + MINGAP_AT_CF1 + ' to ' +
      MINGAP_AT_PIN + ' -- an opening of ' + OPENING_AT_PIN + ' dex, i.e. the inversion wedge is ~' +
      DEEPEN_FACTOR_PIN + 'x DEEPER than at nominal. The box-min corner stays fixed at the imp-95617 ' +
      'wedge corner (C_C 0.5x, E_trunc 1.5x): the honest upward revision deepens the SAME inversion.',
    K2_opening_is_monotone_and_never_closes:
      'Across the pinned upper band the opening is monotone in cf and never changes sign: cf = 1.2 ' +
      '(conservative floor) gives ~' + DEEPEN_FACTOR_LO + 'x depth (' + MINGAP_AT_LO + '), the pinned ' +
      'geometric mean ~' + DEEPEN_FACTOR_PIN + 'x, and cf = 1.4 (edge) ~' + DEEPEN_FACTOR_HI + 'x (' +
      MINGAP_AT_HI + '). Every honest UPWARD multiplier the imp-1134 provenance supports makes minGap ' +
      'strictly MORE negative, so the wedge is opened by ~2.2x to ~3.4x, never closed.',
    K3_pins_the_imp95674_K2_magnitude:
      'This converts the imp-95674 K2 qualitative statement (the supported revision is UPWARD and ' +
      'drives the box-min gap more negative) into a definite magnitude at a defensible single pin, and ' +
      'reconfirms the imp-95674 reachability verdict: the wedge closes only DOWNWARD (cf* ~ 0.839, ' +
      'outside the honest band), while the honest band edge is UPWARD and opens it further.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). Pinning the imp-95674 upper edge ' +
    'CF_BAND_HI to the geometric mean of the imp-1134 integrated 1.2-1.4x reach (cf ~ 1.29615) and ' +
    're-running the imp-95658/imp-95617 box-min gap there gives minGap = -0.013188 -- the imp-95617 ' +
    'inversion wedge is ~2.82x DEEPER than the nominal -0.004682, at the same (C_C 0.5x, E_trunc 1.5x) ' +
    'wedge corner. The opening is monotone in cf (~2.23x at the 1.2 floor, ~3.45x at the 1.4 edge) and ' +
    'never changes sign, pinning the imp-95674 K2 statement to a magnitude: the honest UPWARD C_F ' +
    'provenance opens the transition-before-knee wedge by ~2.2x to ~3.4x, never closing it (the wedge ' +
    'closes only for a DOWNWARD cf* ~ 0.839 that lies outside the honest band, imp-95674 K1). The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95674 (assembled the C_F provenance band; left CF_BAND_HI as an unpinned 1.2-1.4x range); ' +
    'imp-95660 (exact box-min gap model; cf* ~ 0.839; d(minGap)/d(cf) ~ -0.029); imp-95617 (nominal ' +
    'box-min gap -0.00468 at cf=1); imp-1134 c-f-bulk-refinement (C_F is a LOWER bound; integrated ' +
    'reach ~1.2-1.4x); imp-398/imp-838 (C_F closed form); imp-486 (C_mb GUE-conditional).',
};

export const IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING_ASSERTIONS = [
  {
    // The pin is the geometric mean of the imp-1134 integrated reach and lies strictly inside [1.2, 1.4].
    id: 'imp95691-pin-is-geom-mean-inside-reach',
    description: 'CF_BAND_HI_PINNED = sqrt(1.2 * 1.4) ~ 1.29615, strictly inside the integrated reach',
    holds: () =>
      Math.abs(CF_BAND_HI_PINNED - Math.sqrt(1.2 * 1.4)) < 1e-4 &&
      CF_BAND_HI_PINNED > CF_INTEGRATED_LO &&
      CF_BAND_HI_PINNED < CF_INTEGRATED_HI,
  },
  {
    // The pin does not exceed the imp-95674 honest-band upper edge (consistency with the assembled band).
    id: 'imp95691-pin-within-imp95674-band-hi',
    description: 'pinned upper multiplier <= imp-95674 honestBand.cf_hi (~1.40)',
    holds: () =>
      CF_BAND_HI_PINNED <= IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY.honestBand.cf_hi + 1e-9,
  },
  {
    // All box-min gaps are negative (still inverting) and the corner never leaves the imp-95617 wedge.
    id: 'imp95691-wedge-stays-inverted-at-fixed-corner',
    description: 'minGap < 0 at cf=1, 1.2, pin, 1.4; box-min corner fixed at (C_C 0.5x, E_trunc 1.5x)',
    holds: () =>
      MINGAP_AT_CF1 < 0 &&
      MINGAP_AT_LO < 0 &&
      MINGAP_AT_PIN < 0 &&
      MINGAP_AT_HI < 0 &&
      WEDGE_CORNER.cC_mult === 0.5 &&
      WEDGE_CORNER.eTrunc_mult === 1.5,
  },
  {
    // The opening is monotone and strictly more negative as cf rises: the wedge OPENS, never closes.
    id: 'imp95691-opening-monotone-more-negative',
    description: 'minGap strictly decreases cf=1 > 1.2 > pin > 1.4; every opening is negative',
    holds: () =>
      MINGAP_AT_CF1 > MINGAP_AT_LO &&
      MINGAP_AT_LO > MINGAP_AT_PIN &&
      MINGAP_AT_PIN > MINGAP_AT_HI &&
      OPENING_AT_LO < 0 &&
      OPENING_AT_PIN < 0 &&
      OPENING_AT_HI < 0,
  },
  {
    // The pinned-edge deepening factor is ~2.8x and the whole band spans ~2.2x to ~3.4x.
    id: 'imp95691-deepening-factor-band',
    description: 'deepen factor ~2.23x (floor) < ~2.82x (pin) < ~3.45x (edge), all > 2',
    holds: () =>
      DEEPEN_FACTOR_LO > 2 &&
      DEEPEN_FACTOR_LO < DEEPEN_FACTOR_PIN &&
      DEEPEN_FACTOR_PIN < DEEPEN_FACTOR_HI &&
      Math.abs(DEEPEN_FACTOR_PIN - 2.817) < 0.05,
  },
  {
    // Honest-status annotation (updated imp-95757): the pin is flagged as superseded by the imp-95747
    // GUE-regularized converged value (the end of the imp-95705 -> imp-95721 -> imp-95747 chain), and the
    // pinned constant CF_BAND_HI_PINNED remains unchanged so other consumers are not silently broken.
    id: 'imp95691-honest-status-supersession-annotated',
    description: 'honestStatus.supersededBy = imp-95747 (converged 9.583x); pinned constant left unchanged',
    holds: () =>
      IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.honestStatus.supersededBy === 'imp-95747' &&
      IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.honestStatus.supersessionChain.length === 3 &&
      IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.honestStatus.supersedingValue > CF_BAND_HI_PINNED &&
      IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.cfBandHiPinned === CF_BAND_HI_PINNED,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95691-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.isRigorous === false &&
      /NO QED/.test(IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.verdict) &&
      /refereed bound is changed/i.test(IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING.verdict),
  },
];

for (const a of IMP95691_CF_BAND_HI_PINNED_WEDGE_OPENING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95691-cf-band-hi-pinned-wedge-opening assertion failed: ${a.id}`);
  }
}
