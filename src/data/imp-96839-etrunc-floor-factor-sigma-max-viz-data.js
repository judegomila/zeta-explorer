/**
 * @module imp-96839-etrunc-floor-factor-sigma-max-viz-data
 *
 * imp-96839 (ux): import-light viz-data leaf for the imp-96794 E_trunc floor-factor sweep.
 * imp-96794 measured that REDUCING the E_trunc truncation floor RAISES the binding
 * GUE-conditional peak share sigma_max (ADVERSE sign, d(sigma_max)/d(log E_trunc) ~ -0.019):
 * sigma_max climbs 0.94943 (1x) -> 0.96119 (0.5x) -> 0.97961 (0.1x) -> 0.99226 (0.01x) as the
 * floor tightens toward 0. This module reshapes those four reductionTable rows into a
 * chart-ready series (log10 floor factor vs sigma_max, plus the 1 - sigma_max headroom that
 * shrinks toward 0) so the "adverse climb toward 1" claim can be read visually.
 *
 * No re-derivation: every floorFactor, sigma_max and headroom value is copied verbatim from
 * IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE.reductionTable (imp-96794). The only new
 * arithmetic here is the log10 axis reshaping.
 *
 * @see imp-96794-etrunc-reduction-peak-share-leverage.js (the source object this reshapes)
 *
 * Ticket: imp-96839 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294/imp-96819 convention) --
 * values are validated below via a plain exported check object instead of an import-time throw.
 */

import { IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE as SRC } from './imp-96794-etrunc-reduction-peak-share-leverage.js';

const log10 = Math.log10;

// The four floor factors called out in the imp-96839 ticket title.
const FACTORS_SHOWN = [1.0, 0.5, 0.1, 0.01];

export const IMP96839_FLOOR_FACTOR_POINTS = SRC.reductionTable
  .filter((r) => FACTORS_SHOWN.includes(r.floorFactor))
  .map((r) => ({
    floorFactor: r.floorFactor,
    log10FloorFactor: log10(r.floorFactor),
    sigma_max: r.sigma_max,
    headroom: r.headroom_1_minus_sigma,
  }));

export const IMP96839_LANDMARKS = Object.freeze({
  baseSigmaMax: SRC.baseRow.sigma_max,
  d_sigma_max_d_log_etrunc: SRC.signedLeverage.d_sigma_max_d_log_etrunc,
  headroomElasticity: SRC.signedLeverage.headroom_elasticity_d_log_1minus_sigma_d_log_etrunc,
});

export const IMP96839_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every floorFactor, ' +
  'sigma_max and headroom value plotted here is copied verbatim from the imp-96794 ' +
  'reductionTable; the only new arithmetic is the log10 axis reshaping. Measurement/' +
  'sensitivity audit only: the adverse-sign verdict (a tighter E_trunc floor RAISES the ' +
  'binding GUE-conditional peak share toward 1, not shrinks it) changes no bound and ' +
  'establishes no operator positivity; C_mb stays GUE-conditional (imp-486).';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP96839_VALIDATION = Object.freeze({
  fourPointsPresent: IMP96839_FLOOR_FACTOR_POINTS.length === 4,
  monotoneRisingAsFloorTightens: IMP96839_FLOOR_FACTOR_POINTS.every((p, i) => {
    if (i === 0) return true;
    return p.sigma_max > IMP96839_FLOOR_FACTOR_POINTS[i - 1].sigma_max;
  }),
  matchesBaseRow:
    Math.abs(IMP96839_FLOOR_FACTOR_POINTS[0].sigma_max - SRC.baseRow.sigma_max) < 1e-9,
});
