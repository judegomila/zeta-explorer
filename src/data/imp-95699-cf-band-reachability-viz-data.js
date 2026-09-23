/**
 * @module imp-95699-cf-band-reachability-viz-data
 *
 * imp-95699 (presentation, import-light): baked-literal viz data for the imp-95674 C_F
 * provenance-band reachability decision. Places the honest imp-398 C_F multiplier band
 * [cf_lo, cf_hi] ~ [0.995, 1.40] (nominal cf=1.0, downward-rigid floor ~0.9999/0.995,
 * imp-1134 upward reach 1.2-1.4x) on a single multiplier axis alongside the imp-95660
 * wedge-closure multiplier cf* ~ 0.839, showing cf* strictly OUTSIDE (below) the band.
 *
 * All numbers are re-exported verbatim from imp-95674 (no re-derivation, no fresh
 * computation, no zeros bundle import). Presentation only; changes no bound; NO QED.
 *
 * @see imp-95674-cf-provenance-band-wedge-reachability (source of every number below)
 * @see imp-95660-cf-multiplier-wedge-closure (measured cf* ~ 0.839)
 */

import { IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY } from './imp-95674-cf-provenance-band-wedge-reachability.js';

const f = IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY;

export const IMP95699_CF_BAND_REACHABILITY_VIZ = {
  id: 'imp-95699',
  axisLabel: 'C_F multiplier cf',
  axisMin: 0.75,
  axisMax: 1.5,
  cfNominal: f.cfNominal,
  cfStar: f.cfStar,
  band: {
    lo_rigorous: f.honestBand.cf_lo_rigorous,
    lo_generous: f.honestBand.cf_lo_generous,
    hi: f.honestBand.cf_hi,
  },
  foreclosureMargin: f.foreclosure.margin_below_generous_floor,
  overshootFactor: f.foreclosure.overshoot_factor,
  wedgeReachable: f.wedgeReachable,
  caption:
    'The honest imp-398 C_F provenance band cf in [' +
    f.honestBand.cf_lo_generous.toFixed(5) +
    ', ' +
    f.honestBand.cf_hi.toFixed(2) +
    '] (nominal cf=1.0) sits entirely to the right of the imp-95660 wedge-closure ' +
    'multiplier cf* = ' +
    f.cfStar.toFixed(5) +
    ' -- a gap of ' +
    f.foreclosure.margin_below_generous_floor.toFixed(3) +
    ' (~' +
    f.foreclosure.overshoot_factor +
    'x the largest honest downward lane), so the imp-95617 E_flow inversion wedge is ' +
    'physically FORECLOSED, not reachable.',
};
