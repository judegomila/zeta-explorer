/**
 * @module imp-96822-gmin-ladder-reach-frontier-viz-data
 *
 * imp-96822 (ux): import-light viz-data leaf for the imp-96754 dyadic
 * block-minima reach frontier. imp-96754 pinned three milestones on the
 * imp-96629 / imp-96734 gap-exponent ladder built from scripts/.zeros-cache/zeros6
 * (2,001,052 consecutive zeros): the last COMPLETE dyadic block (k=19), the
 * current TRUNCATED top rung (k=20, 90.835% filled), and the exact
 * acquisition requirement to add the next rung (k=21, blocked on data).
 * This module reshapes those three exported milestones into a small
 * chart-ready stage array; no new arithmetic beyond what imp-96754 exports.
 *
 * PRESENTATION ONLY. Every number here is reused verbatim from
 * GMIN_LADDER_REACH_FRONTIER. Changes no bound, establishes no operator
 * positivity, no RH claim; measurement/scoping only; conditional on GUE;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96754-gmin-ladder-reach-frontier.js (the source measurement/scoping module)
 *
 * Ticket: imp-96822 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96754 (itself import-light,
 * no zeros bundle imported -- arithmetic on the cached zero COUNT only).
 */

import { GMIN_LADDER_REACH_FRONTIER } from './imp-96754-gmin-ladder-reach-frontier.js';

const { topRung, acquisition, source, verdict } = GMIN_LADDER_REACH_FRONTIER;

// Three reach-frontier stages: complete -> partial -> blocked-on-acquisition.
export const IMP96822_REACH_STAGES = Object.freeze([
  Object.freeze({
    k: topRung.lastCompleteK, // 19
    label: `k=${topRung.lastCompleteK} (complete)`,
    nCenter: topRung.lastCompleteNcenter, // 741455.2
    fillFraction: 1,
    status: 'complete',
  }),
  Object.freeze({
    k: topRung.topRungK, // 20
    label: `k=${topRung.topRungK} (partial)`,
    nCenter: topRung.topRungAvailableGeoCenter, // 1448535.5 -- true center of the filled part
    nCenterPlotted: topRung.topRungPlottedNcenter, // 1482910.4 -- what the ladder plots (assumes complete)
    fillFraction: topRung.topRungFillFraction, // 0.90835
    status: 'partial',
  }),
  Object.freeze({
    k: acquisition.nextRungK, // 21
    label: `k=${acquisition.nextRungK} (blocked)`,
    nCenter: acquisition.nextRungNcenter, // 2965821
    fillFraction: 0,
    extraOrdinatesNeeded: acquisition.nextRungExtraOrdinates, // 2193252
    status: 'blocked',
  }),
]);

export const IMP96822_ACQUISITION_SUMMARY = Object.freeze({
  zerosCached: source.zerosCount, // 2001052
  completeTopRungNeeds: acquisition.completeTopRungNeeds, // 96100
  nextRungExtraOrdinates: acquisition.nextRungExtraOrdinates, // 2193252
  perRungRule: acquisition.perRungRule,
});

export const IMP96822_HONEST_BANNER = verdict;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96822_ASSERTIONS = [
  {
    id: 'imp96822-three-stages-k19-k20-k21-in-order',
    holds: () =>
      IMP96822_REACH_STAGES.length === 3 &&
      IMP96822_REACH_STAGES[0].k === 19 &&
      IMP96822_REACH_STAGES[1].k === 20 &&
      IMP96822_REACH_STAGES[2].k === 21,
    why: 'imp-96754 pins exactly three milestones: last complete block k=19, partial top rung k=20, blocked next rung k=21.',
  },
  {
    id: 'imp96822-fill-fraction-monotone-then-zero',
    holds: () =>
      IMP96822_REACH_STAGES[0].fillFraction === 1 &&
      IMP96822_REACH_STAGES[1].fillFraction > 0 &&
      IMP96822_REACH_STAGES[1].fillFraction < 1 &&
      IMP96822_REACH_STAGES[2].fillFraction === 0,
    why: 'the complete block is 100% filled, the top rung is genuinely partial (~90.835%), and the next rung has zero data cached yet.',
  },
  {
    id: 'imp96822-nCenter-strictly-increasing-across-stages',
    holds: () => IMP96822_REACH_STAGES.every((s, i) => i === 0 || s.nCenter > IMP96822_REACH_STAGES[i - 1].nCenter),
    why: 'each dyadic rung k has a strictly larger index range than the previous, so N_center must increase monotonically along the frontier.',
  },
  {
    id: 'imp96822-acquisition-exceeds-full-cache',
    holds: () => IMP96822_ACQUISITION_SUMMARY.nextRungExtraOrdinates > IMP96822_ACQUISITION_SUMMARY.zerosCached,
    why: 'imp-96754 FINDING 2: adding rung k=21 needs more additional ordinates than the entire current cache holds.',
  },
  {
    id: 'imp96822-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96822_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96822_HONEST_BANNER) &&
      /NO QED/.test(IMP96822_HONEST_BANNER),
    why: 'every measurement/scoping viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96822_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96822-gmin-ladder-reach-frontier-viz-data assertion failed: ${a.id}`);
  }
}
