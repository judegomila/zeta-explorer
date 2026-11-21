/**
 * @module imp-36055-i4-rounding-never-threatens-pi-budget-honest-status
 *
 * imp-36055 (content, sonnet-4-6, sonnet): standalone honest-status MEASUREMENT-ONLY note
 * recording the imp-35989 finding that the I4 integer-closure pi budget is NEVER threatened by
 * per-panel rounding accrual at physical panel counts, so the operative I4 constraint at every
 * reachable panel count is TRUNCATION (reduced by subdivision), not rounding.
 *
 * FINDING. imp-35989 modeled the I4 accumulated argument-error half-width E(n) as two channels
 * pulling in opposite directions as the panel count n grows: E_round(n) = ((n-1) + RHO_EVAL) * u *
 * |S| GROWS linearly in n (per-panel arg/atan2 evaluation plus naive summation of n increments),
 * while E_trunc(n) = K_TRUNC / n FALLS as 1/n (the I1 enclosure argwidth shrinks faster than the
 * panel count grows under subdivision). The roundoff-only crossover to the pi budget sits at
 * n* ~ 4.50e15 panels -- ~14 orders of magnitude beyond any physical dR panel count (the imp-35757
 * regime carries ~4.28 panels per unit height, i.e. ~17 long-edge panels at h ~ 1, up to a few
 * million under heavy refinement). Across the ENTIRE plausible physical range (n ~ 17 to ~1e6), E
 * stays 6+ orders below pi and is dominated by the DECREASING truncation channel.
 *
 * WHY THIS MATTERS. It would be easy to misread "rounding accrual grows linearly in n" as a
 * warning against subdividing panels. imp-35989 shows the opposite is true at every physical scale:
 * raising n MONOTONELY lowers the total E(n) because the shrinking truncation channel dominates
 * until n is astronomically large (the U-minimum itself sits at n ~ 1.56e8, still ~7 orders below
 * pi). So subdivision is unambiguously safe and helpful for I4 across the whole physical range; the
 * binding constraint there is truncation, which more panels reduce, not rounding, which more panels
 * would eventually increase but only far outside any reachable regime.
 *
 * Honest-status record only; no new numerics computed here, verbatim import of the imp-35989
 * verdict. Changes no bound; certifies no count; NO QED. No refereed bound is changed.
 *
 * @see imp-35989-i4-accumulated-error-vs-panel-count-scale (the two-channel surrogate this note restates)
 * @see imp-35804-i4-integer-closure-error-budget-scope (I4 pi GLOBAL accumulated-error budget)
 * @see imp-35757-i2-panel-width-count-scope (I2 panel-width / count regime; ~4.28 panels per unit height)
 */

import { IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE } from './imp-35989-i4-accumulated-error-vs-panel-count-scale.js';

const SOURCE = IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE;

export const IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS = {
  id: 'imp-36055',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35804 I4 integer-closure pi budget ever threatened by per-panel rounding accrual ' +
    'at physical panel counts, per the imp-35989 two-channel accrual measurement?',
  verdictShort:
    'NEVER, AT PHYSICAL n. The roundoff-only crossover to the pi budget sits at n* ~ 4.50e15 ' +
    'panels, ~14 orders of magnitude beyond any physical dR panel count (~17 up to a few million). ' +
    'Across the entire plausible range (n ~ 17 to ~1e6) the total stays 6+ orders below pi, ' +
    'dominated by the DECREASING truncation channel -- so the operative I4 constraint at reachable ' +
    'n is truncation (which subdivision reduces), not rounding accrual (which subdivision grows).',
  roundoffCrossover: SOURCE.roundoffCrossover.nStar,
  physicalPanelCeiling: 1e6,
  ordersOfMagnitudeClear: Math.log10(SOURCE.roundoffCrossover.nStar / 1e6),
  uMinimumPanelCount: SOURCE.uMinimum.nMin,
  uMinimumHalfWidth: SOURCE.uMinimum.eMin,
  isRigorous: false,
  verdict:
    'HONEST-STATUS RECORD (restates imp-35989, no new numerics). The I4 pi integer-closure budget ' +
    'is never threatened by per-panel rounding accrual anywhere in the physical panel-count range: ' +
    'the roundoff-only crossover n* ~ 4.50e15 sits ~14 orders beyond the imp-35757 physical ceiling ' +
    '(~17 to a few million panels), and the U-shaped total E(n) stays 6+ orders below pi across that ' +
    'whole range, dominated by the falling truncation channel. So the operative I4 constraint at ' +
    'every physically reachable panel count is TRUNCATION, reduced by subdivision, not rounding, ' +
    'which subdivision would eventually grow but only far outside any reachable regime. Changes no ' +
    'bound; certifies no count; NO QED. No refereed bound is changed.',
  citation:
    'imp-35989-i4-accumulated-error-vs-panel-count-scale (source measurement); ' +
    'imp-35804-i4-integer-closure-error-budget-scope (I4 pi budget definition); ' +
    'imp-35757-i2-panel-width-count-scope (physical panel-count regime).',
};

export const IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36055-crossover-far-beyond-physical-ceiling',
    description: 'roundoff-only crossover n* is at least 9 orders of magnitude beyond the 1e6 physical panel ceiling',
    holds: () =>
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.ordersOfMagnitudeClear > 9 &&
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.roundoffCrossover > 1e15,
  },
  {
    id: 'imp36055-restates-source-verdict-verbatim',
    description: 'imports the imp-35989 roundoffCrossover/uMinimum fields verbatim, no re-derivation',
    holds: () =>
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.roundoffCrossover ===
        IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE.roundoffCrossover.nStar &&
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.uMinimumPanelCount ===
        IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE.uMinimum.nMin &&
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.uMinimumHalfWidth ===
        IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE.uMinimum.eMin,
  },
  {
    id: 'imp36055-u-minimum-below-physical-ceiling-order',
    description: 'the U-minimum panel count still sits comfortably below pi at all physical n',
    holds: () =>
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.uMinimumHalfWidth < 1e-6 &&
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.uMinimumPanelCount > 1e6,
  },
  {
    id: 'imp36055-honesty-gate-no-qed',
    description: 'honest-status record only: no bound changed, no count certified, NO QED, no refereed bound is changed',
    holds: () =>
      IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-36055-i4-rounding-never-threatens-pi-budget-honest-status assertion failed: ${a.id}`
    );
  }
}

export default IMP36055_I4_ROUNDING_NEVER_THREATENS_PI_BUDGET_HONEST_STATUS;
