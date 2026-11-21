/**
 * @module imp-35628-req-severity-ranking-viz-data
 * @fileoverview imp-35628 -- VIZ DATA ONLY for the imp-35551 route-(i) requirement severity
 *   RANKING: re-exports the five REQ 1-5 severityRank/reachability/coupling fields verbatim as
 *   a ranked tier-chart data series, plus the REQ2<-REQ4 coupling annotation and the
 *   single-discharge verdict. No new computation.
 *
 *   Import-light: only imports the imp-35551 assessment module (itself import-light, no zeros
 *   bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35551-route-i-requirement-severity-ranking.js (the source of every figure here)
 *   @see imp-35538-route-i-remainder-derivation-requirements.js (enumerates the five REQs)
 *
 *   Ticket: imp-35628 (ux, medium). Presentation only of an already-established severity
 *   ranking; adds no new Lambda bound, derives no remainder. No refereed bound is changed
 *   . NO QED.
 */

import { IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING } from './imp-35551-route-i-requirement-severity-ranking.js';

const R = IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING;

// -- ranked tier bars, RANK1 (hardest) first, mirroring R.ranking order verbatim.
export const IMP35628_TIER_BARS = Object.freeze(
  R.ranking.map((entry) =>
    Object.freeze({
      req: entry.req,
      name: entry.name,
      severityRank: entry.severityRank,
      reachability: entry.reachability,
      coupledWith: Object.freeze([...entry.coupledWith]),
      note: entry.note,
    })
  )
);

export const IMP35628_SUMMARY = Object.freeze({
  bindingObstruction: R.bindingObstruction,
  singleDischargeSuffices: R.singleDischargeSuffices,
  req2CarriesReq4: IMP35628_TIER_BARS.find((b) => b.req === 'REQ 2').coupledWith.includes('REQ 4'),
});

export default Object.freeze({
  id: 'imp-35628-req-severity-ranking-viz-data',
  ticket: 'imp-35628',
  sources: ['imp-35551-route-i-requirement-severity-ranking.js'],
  tiers: IMP35628_TIER_BARS,
  summary: IMP35628_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35628_ASSERTIONS = [
  {
    id: 'imp35628-five-tiers-descending-severity',
    holds: () =>
      IMP35628_TIER_BARS.length === 5 &&
      IMP35628_TIER_BARS.every((b, i) => b.severityRank === i + 1) &&
      IMP35628_TIER_BARS[0].req === 'REQ 2' &&
      IMP35628_TIER_BARS[4].req === 'REQ 5',
    why:
      'The five tiers must be present in strict RANK1..RANK5 order (REQ 2 hardest, REQ 5 ' +
      'softest-as-ceiling), matching the imp-35551 severity ordering.',
  },
  {
    id: 'imp35628-req4-couples-into-req2',
    holds: () => IMP35628_SUMMARY.req2CarriesReq4 === true && IMP35628_SUMMARY.singleDischargeSuffices === false,
    why:
      'REQ 4 must fold into REQ 2 (coupledWith includes REQ 4) and no single requirement ' +
      'discharge suffices, reproducing the imp-35551 fused super-crux verdict.',
  },
];

for (const assertion of IMP35628_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35628-req-severity-ranking-viz-data assertion failed: ${assertion.id}`);
  }
}
