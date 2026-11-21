/**
 * @module imp-96683-route-m-conditioning-ceiling-ci-viz-data
 *
 * imp-96683 (ux): import-light viz-data leaf for the imp-96656 Route M
 * conditioning-ceiling confidence interval -- the asymmetric log-normal
 * band (dense vs all-rung fit) with the rigorous trace lower ceiling
 * 2.59e7 (imp-96548), the imp-96648 Frobenius sharper ceiling 3.75e7, and
 * the imp-96352 compute ceiling 9916 all marked on a shared log-N axis.
 *
 * imp-96656 reported the two point estimates and their 1-sigma/95% bands
 * as prose numbers with no chart. This module reshapes the same baked
 * interval numbers into a chart-ready band list plus a labeled reference
 * table; every value is reused verbatim from imp-96656 / imp-96648 / the
 * imp-96352 compute ceiling -- no re-fit, no new numerics.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity,
 * no RH claim; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96656-route-m-conditioning-ceiling-confidence-interval.js (source CI numbers)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (Frobenius sharper ceiling)
 * @see imp-96670-route-m-lammax-majorants-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96683 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96656_ALL,
  IMP96656_DENSE,
  IMP96656_INTERVAL,
} from './imp-96656-route-m-conditioning-ceiling-confidence-interval.js';
import { IMP96648_CEILINGS } from './imp-96648-route-m-lammax-frobenius-moment-majorant.js';

// Chart-ready band list: one entry per fit, each carrying its point estimate
// plus 1-sigma and 95% log-normal band edges (baked verbatim from imp-96656).
export const IMP96683_BANDS = Object.freeze([
  Object.freeze({
    key: 'all',
    label: 'all-rung fit (5 rungs, N=250,3000-6000)',
    point: IMP96656_ALL.ceiling,
    ci68: Object.freeze({ lo: IMP96656_ALL.ci68.lo, hi: IMP96656_ALL.ci68.hi }),
    ci95: Object.freeze({ lo: IMP96656_ALL.ci95.lo, hi: IMP96656_ALL.ci95.hi }),
  }),
  Object.freeze({
    key: 'dense',
    label: 'dense fit (4 rungs, N=3000-6000)',
    point: IMP96656_DENSE.ceiling,
    ci68: Object.freeze({ lo: IMP96656_DENSE.ci68.lo, hi: IMP96656_DENSE.ci68.hi }),
    ci95: Object.freeze({ lo: IMP96656_DENSE.ci95.lo, hi: IMP96656_DENSE.ci95.hi }),
  }),
]);

// Log10 versions for a readable log-N axis chart.
export const IMP96683_LOG10_BANDS = Object.freeze(
  IMP96683_BANDS.map((b) => Object.freeze({
    key: b.key,
    label: b.label,
    log10Point: Math.log10(b.point),
    log10Ci68: Object.freeze({ lo: Math.log10(b.ci68.lo), hi: Math.log10(b.ci68.hi) }),
    log10Ci95: Object.freeze({ lo: Math.log10(b.ci95.lo), hi: Math.log10(b.ci95.hi) }),
  })),
);

// Fixed reference ceilings marked as vertical lines alongside the bands.
export const IMP96683_REFERENCE_LINES = Object.freeze([
  Object.freeze({
    key: 'compute',
    label: 'wall-clock compute ceiling (imp-96352)',
    value: IMP96656_INTERVAL.referenceCeilings.compute, // 9916
  }),
  Object.freeze({
    key: 'traceLower',
    label: 'rigorous trace lower ceiling (imp-96548)',
    value: IMP96656_INTERVAL.referenceCeilings.rigorousLower, // 2.59e7
  }),
  Object.freeze({
    key: 'frobeniusLower',
    label: 'Frobenius sharper lower ceiling (imp-96648)',
    value: IMP96648_CEILINGS.frobenius, // ~3.75e7
  }),
]);

export const IMP96683_LOG10_REFERENCE_LINES = Object.freeze(
  IMP96683_REFERENCE_LINES.map((r) => Object.freeze({ ...r, log10Value: Math.log10(r.value) })),
);

// Margin summary: how far below every band edge the compute ceiling sits,
// reused verbatim from the imp-96656 per-fit margin factors.
export const IMP96683_MARGIN_SUMMARY = Object.freeze({
  allLo95AboveComputeFactor: IMP96656_ALL.lo95AboveComputeFactor,
  denseLo95AboveComputeFactor: IMP96656_DENSE.lo95AboveComputeFactor,
  allLo95AboveTraceFactor: IMP96656_ALL.lo95AboveRigorousFactor,
  denseLo95AboveTraceFactor: IMP96656_DENSE.lo95AboveRigorousFactor,
});

export const IMP96683_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every band edge and ' +
  'point estimate is reused verbatim from imp-96656 (delta-method log-normal CI), the ' +
  'Frobenius reference ceiling is reused verbatim from imp-96648, and the compute ceiling ' +
  'from imp-96352; this module only reshapes those baked numbers into a chart-ready band ' +
  'list. No bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96683_ASSERTIONS = [
  {
    id: 'imp96683-two-bands-with-nested-intervals',
    holds: () =>
      IMP96683_BANDS.length === 2 &&
      IMP96683_BANDS.every((b) => b.ci68.lo < b.point && b.point < b.ci68.hi) &&
      IMP96683_BANDS.every((b) => b.ci95.lo < b.ci68.lo && b.ci68.hi < b.ci95.hi),
    why: 'both the all-rung and dense fits must carry a point estimate strictly inside their own 1-sigma band, which is itself strictly inside the wider 95% band.',
  },
  {
    id: 'imp96683-dense-band-wider-than-all',
    holds: () => {
      const all = IMP96683_BANDS.find((b) => b.key === 'all');
      const dense = IMP96683_BANDS.find((b) => b.key === 'dense');
      return (dense.ci95.hi - dense.ci95.lo) > (all.ci95.hi - all.ci95.lo);
    },
    why: 'the sparser dense fit (df=2) must give a wider 95% band than the all-rung fit (df=3, extra low-N anchor), matching the imp-96656 finding.',
  },
  {
    id: 'imp96683-reference-lines-ordered',
    holds: () => {
      const byKey = Object.fromEntries(IMP96683_REFERENCE_LINES.map((r) => [r.key, r.value]));
      return byKey.compute < byKey.traceLower && byKey.traceLower < byKey.frobeniusLower;
    },
    why: 'the three reference lines must be ordered compute < trace lower < Frobenius lower, matching the imp-96548/imp-96648/imp-96352 verdicts.',
  },
  {
    id: 'imp96683-every-band-95-lower-edge-above-trace-and-compute',
    holds: () =>
      IMP96683_BANDS.every((b) => b.ci95.lo > IMP96683_REFERENCE_LINES.find((r) => r.key === 'traceLower').value) &&
      IMP96683_BANDS.every((b) => b.ci95.lo > IMP96683_REFERENCE_LINES.find((r) => r.key === 'compute').value * 2000),
    why: 'the ordering 9916 (compute) < 2.59e7 (trace lower) < fitted-ceiling 95% lower edge must survive the full band on both fits, with compute at least 2000x below every edge.',
  },
  {
    id: 'imp96683-log10-bands-match-linear-bands',
    holds: () =>
      IMP96683_LOG10_BANDS.every((lb, i) => {
        const b = IMP96683_BANDS[i];
        return (
          Math.abs(Math.pow(10, lb.log10Point) - b.point) < 1e-3 * b.point &&
          Math.abs(Math.pow(10, lb.log10Ci95.lo) - b.ci95.lo) < 1e-3 * b.ci95.lo
        );
      }),
    why: 'the log10 chart-axis values must round-trip back to the same linear band numbers (no transcription drift between the two representations).',
  },
  {
    id: 'imp96683-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96683_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96683_HONEST_BANNER) &&
      /NO QED/.test(IMP96683_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96683_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96683-route-m-conditioning-ceiling-ci-viz-data assertion failed: ${a.id}`,
    );
  }
}
