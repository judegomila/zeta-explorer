/**
 * @module imp-124902-floor-elasticity-overlay-duplicate-check
 * @fileoverview imp-124902 asked for "a viz overlay contrasting the interior-peak (-1.412) and
 * far-tail knee (-2.106) floor-elasticity exponents". This audit confirms that exact overlay
 * already ships as imp-124881 (page Imp124881FloorElasticitySidebysideViz, route
 * /viz-imp124881-floor-elasticity-sidebyside, indexed in visualizations-index.js), and that the
 * imp-124901 discoverability audit already certified that route as reachable. No new page or
 * data leaf is needed; this module only records the duplicate finding so the queue entry is not
 * silently re-attempted.
 *
 * @see imp-124881-floor-elasticity-sidebyside-viz-data (the overlay itself)
 * @see imp-124901-sigma-leaves-visualizations-index-discoverability-audit (precedent pattern for
 *   recording a requested leaf's actual discoverability state instead of re-shipping it)
 */

import { IMP124881_SUMMARY } from './imp-124881-floor-elasticity-sidebyside-viz-data.js';

export const IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK = Object.freeze({
  id: 'imp-124902-floor-elasticity-overlay-duplicate-check',
  title: 'Duplicate check: imp-124902 requested overlay already ships as imp-124881',
  requestedTicket: 'imp-124902',
  requestedExponents: Object.freeze({ interiorPeak: -1.412, farTailKnee: -2.106 }),
  satisfiedBy: Object.freeze({
    dataModule: 'src/data/imp-124881-floor-elasticity-sidebyside-viz-data.js',
    page: 'src/pages/Imp124881FloorElasticitySidebysideViz.jsx',
    route: '/viz-imp124881-floor-elasticity-sidebyside',
  }),
  measuredExponents: Object.freeze({
    interiorPeak: IMP124881_SUMMARY.peak.slope,
    farTailKnee: IMP124881_SUMMARY.knee.slope,
  }),
  status:
    'DUPLICATE: the requested overlay already exists (imp-124881), is routed, and was already ' +
    'certified reachable by the imp-124901 discoverability audit. No new page created. Read-only ' +
    'check; no bound moved; no operator positivity established; NO QED; no refereed bound is changed' +
    '.',
});

export const IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK_ASSERTIONS = Object.freeze([
  {
    name: 'requested interior-peak exponent matches the shipped imp-124881 overlay to 3 decimals',
    holds: () =>
      Math.abs(
        IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK.requestedExponents.interiorPeak -
          IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK.measuredExponents.interiorPeak,
      ) < 0.001,
  },
  {
    name: 'requested far-tail-knee exponent matches the shipped imp-124881 overlay to 3 decimals',
    holds: () =>
      Math.abs(
        IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK.requestedExponents.farTailKnee -
          IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK.measuredExponents.farTailKnee,
      ) < 0.001,
  },
  {
    name: 'honest: no bound moved, NO QED',
    holds: () =>
      /no bound moved/.test(IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK.status) &&
      /NO QED/.test(IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK.status),
  },
]);

for (const a of IMP124902_FLOOR_ELASTICITY_OVERLAY_DUPLICATE_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124902-floor-elasticity-overlay-duplicate-check assertion failed: ${a.name}`);
  }
}
