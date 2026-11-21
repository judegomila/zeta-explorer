/**
 * @module imp-96861-cc-etrunc-leverage-contrast-viz-data
 *
 * imp-96861 (ux): import-light viz-data leaf contrasting the two OPPOSITE-SIGNED
 * sigma_max peak-share leverages already measured separately: d(sigma_max)/d(log C_C)
 * ~ +0.048 (imp-96831, the GUE-conditional constant) vs d(sigma_max)/d(log E_trunc)
 * ~ -0.019 (imp-96794, the truncation floor). Neither source module plots the two
 * signed derivatives side by side; this leaf reshapes both into a single chart-ready
 * bar-pair series (signed leverage per lever) plus the ratio already reported by
 * imp-96831 (cc_over_etrunc_leverage_ratio ~2.5x).
 *
 * No re-derivation: every signedLeverage number is copied verbatim from
 * IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY.signedLeverage and
 * IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE.signedLeverage. The only new
 * arithmetic here is packaging the two into one comparable series.
 *
 * @see imp-96831-sigma-peak-share-cc-sensitivity.js (the C_C-side leverage, +0.048)
 * @see imp-96794-etrunc-reduction-peak-share-leverage.js (the E_trunc-side leverage, -0.019)
 *
 * Ticket: imp-96861 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294/imp-96839 convention) --
 * values are validated below via a plain exported check object instead of an import-time throw.
 */

import { IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY as CC_SRC } from './imp-96831-sigma-peak-share-cc-sensitivity.js';
import { IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE as ETRUNC_SRC } from './imp-96794-etrunc-reduction-peak-share-leverage.js';

export const IMP96861_LEVERAGE_CONTRAST_POINTS = [
  {
    lever: 'log C_C (GUE-conditional constant, imp-96831)',
    d_sigma_max_d_log_lever: CC_SRC.signedLeverage.d_sigma_max_d_log_cc,
    sign: 'positive',
  },
  {
    lever: 'log E_trunc (truncation floor, imp-96794)',
    d_sigma_max_d_log_lever: ETRUNC_SRC.signedLeverage.d_sigma_max_d_log_etrunc,
    sign: 'negative',
  },
];

export const IMP96861_LANDMARKS = Object.freeze({
  d_sigma_max_d_log_cc: CC_SRC.signedLeverage.d_sigma_max_d_log_cc,
  d_sigma_max_d_log_etrunc: ETRUNC_SRC.signedLeverage.d_sigma_max_d_log_etrunc,
  ccOverEtruncLeverageRatio: CC_SRC.signedLeverage.cc_over_etrunc_leverage_ratio,
});

export const IMP96861_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every signed leverage ' +
  'value plotted here is copied verbatim from the imp-96831 and imp-96794 signedLeverage ' +
  'objects; the only new arithmetic is packaging the two derivatives into one comparable ' +
  'series. Measurement/sensitivity audit only: the two levers push sigma_max in opposite ' +
  'directions and the C_C lever is several times larger, but C_C stays GUE-conditional ' +
  '(imp-486) and is not a free lever.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96839 convention) --
export const IMP96861_VALIDATION = Object.freeze({
  twoPointsPresent: IMP96861_LEVERAGE_CONTRAST_POINTS.length === 2,
  oppositeSigns:
    IMP96861_LEVERAGE_CONTRAST_POINTS[0].d_sigma_max_d_log_lever > 0 &&
    IMP96861_LEVERAGE_CONTRAST_POINTS[1].d_sigma_max_d_log_lever < 0,
  ccLeverageLarger:
    Math.abs(IMP96861_LEVERAGE_CONTRAST_POINTS[0].d_sigma_max_d_log_lever) >
    Math.abs(IMP96861_LEVERAGE_CONTRAST_POINTS[1].d_sigma_max_d_log_lever),
  matchesReportedRatio:
    Math.abs(
      Math.abs(
        IMP96861_LEVERAGE_CONTRAST_POINTS[0].d_sigma_max_d_log_lever /
          IMP96861_LEVERAGE_CONTRAST_POINTS[1].d_sigma_max_d_log_lever,
      ) - IMP96861_LANDMARKS.ccOverEtruncLeverageRatio,
    ) < 0.1,
});
