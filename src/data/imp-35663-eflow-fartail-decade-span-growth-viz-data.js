/**
 * @module imp-35663-eflow-fartail-decade-span-growth-viz-data
 * @fileoverview imp-35663 -- VIZ DATA ONLY for the imp-35553 E_flow far-tail
 *   fd-vs-analytic remnant decade-span-GROWTH ladder: re-exports the four
 *   crossing log10 N values (1e-3 25.6205, 1e-4 109.1892, 1e-5 410.0475, 1e-6
 *   direct 1467.7351), the three decade spans (83.5687, 300.8583, 1057.6875),
 *   and the two span ratios (3.6001, 3.5156) so a page can plot the span
 *   ladder growing and the ratio declining toward the sqrt(10) asymptote --
 *   neither series had a page before this ticket.
 *
 *   Re-exports the imp-35553 span ladder verbatim (that module is
 *   import-light: pure Math, no heavy dependency, never the 16.7MB zeros
 *   bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js (the ladder this re-exports)
 *   @see imp-35552-eflow-fartail-remnant-product-decay-limit.js (the remnant leading form fixing the sqrt(10) asymptote)
 *
 *   Ticket: imp-35663 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. NO QED. No refereed bound is changed.
 */

import IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT from './imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js';

export const IMP35663_SPAN_LADDER = IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.spanLadder;

export const IMP35663_GEOMETRIC_PROJECTION =
  IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.geometricProjection;

export const IMP35663_DIRECT_MEASUREMENT =
  IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.directMeasurement;

export const IMP35663_PROJECTION_OVERSHOOT =
  IMP35553_EFLOW_FARTAIL_REMNANT_DECADE_SPAN_GROWTH_FIT.projectionOvershoot;

export const IMP35663_SUMMARY = Object.freeze({
  crossings: IMP35663_SPAN_LADDER.map((r) => r.crossingLog10N),
  spans: IMP35663_SPAN_LADDER.filter((r) => r.span !== null).map((r) => r.span),
  ratios: IMP35663_SPAN_LADDER.filter((r) => r.ratio !== null).map((r) => r.ratio),
  projectedSub1e6: IMP35663_GEOMETRIC_PROJECTION.sub1e6_log10N_projected,
  directSub1e6: IMP35663_DIRECT_MEASUREMENT.sub1e6_log10N,
  overshootDecades: IMP35663_PROJECTION_OVERSHOOT.decades,
  overshootPercent: IMP35663_PROJECTION_OVERSHOOT.percent,
  sqrt10: IMP35663_PROJECTION_OVERSHOOT.asymptoticRatioSqrt10,
});

export default Object.freeze({
  id: 'imp-35663-eflow-fartail-decade-span-growth-viz-data',
  ticket: 'imp-35663',
  sources: ['imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js'],
  spanLadder: IMP35663_SPAN_LADDER,
  geometricProjection: IMP35663_GEOMETRIC_PROJECTION,
  directMeasurement: IMP35663_DIRECT_MEASUREMENT,
  projectionOvershoot: IMP35663_PROJECTION_OVERSHOOT,
  summary: IMP35663_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35663_ASSERTIONS = [
  {
    id: 'imp35663-four-rungs-present',
    holds: () => IMP35663_SPAN_LADDER.length === 4,
    why: 'The ladder must cover all four imp-35553 threshold crossings (1e-3..1e-6).',
  },
  {
    id: 'imp35663-spans-strictly-grow',
    holds: () =>
      IMP35663_SUMMARY.spans[0] < IMP35663_SUMMARY.spans[1] &&
      IMP35663_SUMMARY.spans[1] < IMP35663_SUMMARY.spans[2],
    why: 'Each successive decade span must be strictly larger, matching the imp-35553 finding.',
  },
  {
    id: 'imp35663-ratio-declines-toward-sqrt10',
    holds: () =>
      IMP35663_SUMMARY.ratios[0] > IMP35663_SUMMARY.ratios[1] &&
      IMP35663_SUMMARY.ratios[1] > IMP35663_SUMMARY.sqrt10,
    why: 'The span ratio must decline (3.6001 -> 3.5156) yet stay above sqrt(10) ~ 3.1623.',
  },
  {
    id: 'imp35663-projection-overshoots-direct',
    holds: () => IMP35663_SUMMARY.projectedSub1e6 > IMP35663_SUMMARY.directSub1e6,
    why: 'The constant-ratio geometric projection must overstate the directly-measured sub-1e-6 crossing.',
  },
  {
    id: 'imp35663-endpoints-match-imp35553',
    holds: () =>
      Math.abs(IMP35663_SUMMARY.crossings[3] - 1467.7351) < 1e-2 &&
      Math.abs(IMP35663_SUMMARY.overshootDecades - 25.44) < 0.5,
    why: 'The direct sub-1e-6 crossing and overshoot must reproduce the imp-35553 headline figures.',
  },
];

for (const assertion of IMP35663_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35663-eflow-fartail-decade-span-growth-viz-data assertion failed: ${assertion.id}`);
  }
}
