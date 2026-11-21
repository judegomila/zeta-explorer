/**
 * @module imp-35580-req4-height-gap-viz-data
 * @fileoverview imp-35580 -- VIZ DATA ONLY for the imp-35538 REQ-4 "height regime where the
 *   bound can bind" requirement: the natural O(1/log T0) route-(i) remainder rate needs
 *   log T0 >= 200 (T0 >= e^200 ~ 7.23e86) to hit the 0.5% relative crossover budget, while the
 *   actual landmark log-heights sit at ~13.23 (sigma-peak) and ~20.86 (E_coll=E_trunc
 *   crossover), and even the Platt-Trudgian verified-height anchor sits at only log T_PT ~
 *   28.73 -- ~9.6x and ~7.0x short of the needed log-height respectively.
 *
 *   Re-exports the imp-35538 heightRegime record verbatim (that module is import-light: it
 *   only imports the lightweight `effectiveHeightForN` helper, never the 16.7MB zeros
 *   bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35538-route-i-remainder-derivation-requirements.js (REQ 4, the source of every figure here)
 *   @see imp-35475-sigma-fidelity-closure-scope (Part C budgets)
 *   @see imp-35493-route-i-remainder-literature-scope (route-(i) absent from the literature)
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 *
 *   Ticket: imp-35580 (ux, medium). Presentation only of an already-established requirements
 *   scoping; adds no new Lambda bound, derives no remainder. No refereed bound is changed
 *   . NO QED.
 */

import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';

const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;

// -- the four log-heights to bar-chart: two landmarks, the PT verified-height anchor, and the
//    log-height a natural O(1/log T0) remainder would need to hit the 0.5% crossover budget.
export const IMP35580_LOG_HEIGHT_BARS = Object.freeze([
  Object.freeze({ key: 'peak', label: 'sigma-peak (N~9.22e5)', logT0: HR.logT0Peak }),
  Object.freeze({ key: 'cross', label: 'E_coll=E_trunc crossover (N~3.28e9)', logT0: HR.logT0Cross }),
  Object.freeze({ key: 'pt', label: 'Platt-Trudgian anchor (T0=3e12)', logT0: HR.logT_PT }),
  Object.freeze({ key: 'needed', label: 'REQ-4 needed (0.5% budget)', logT0: HR.logT0NeededForHalfPctBudget }),
]);

export const IMP35580_SUMMARY = Object.freeze({
  logT0NeededForHalfPctBudget: HR.logT0NeededForHalfPctBudget,
  T0Needed: HR.T0Needed,
  logT0Peak: HR.logT0Peak,
  logT0Cross: HR.logT0Cross,
  logT_PT: HR.logT_PT,
  shortfallVsCross: HR.shortfallVsCross,
  shortfallVsTPT: HR.shortfallVsTPT,
  crossEcollRelBudget: HR.crossEcollRelBudget,
});

export default Object.freeze({
  id: 'imp-35580-req4-height-gap-viz-data',
  ticket: 'imp-35580',
  sources: ['imp-35538-route-i-remainder-derivation-requirements.js'],
  bars: IMP35580_LOG_HEIGHT_BARS,
  summary: IMP35580_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35580_ASSERTIONS = [
  {
    id: 'imp35580-four-bars-present-in-ascending-order',
    holds: () =>
      IMP35580_LOG_HEIGHT_BARS.length === 4 &&
      IMP35580_LOG_HEIGHT_BARS.every(
        (bar, i) => i === 0 || bar.logT0 > IMP35580_LOG_HEIGHT_BARS[i - 1].logT0
      ),
    why:
      'The four log-heights (peak, crossover, PT anchor, REQ-4 needed) must be present and ' +
      'strictly ascending, matching the imp-35538 finding that the needed height dwarfs every ' +
      'reachable landmark.',
  },
  {
    id: 'imp35580-needed-height-far-exceeds-pt-anchor',
    holds: () =>
      IMP35580_SUMMARY.logT0NeededForHalfPctBudget === 200 &&
      IMP35580_SUMMARY.shortfallVsCross > 9 && IMP35580_SUMMARY.shortfallVsCross < 10 &&
      IMP35580_SUMMARY.shortfallVsTPT > 6 && IMP35580_SUMMARY.shortfallVsTPT < 8,
    why:
      'The REQ-4 needed log-height (200) must be ~9.6x the crossover log-height and ~7.0x the ' +
      'PT anchor log-height, reproducing the imp-35538 shortfall figures.',
  },
];

for (const assertion of IMP35580_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35580-req4-height-gap-viz-data assertion failed: ${assertion.id}`);
  }
}
