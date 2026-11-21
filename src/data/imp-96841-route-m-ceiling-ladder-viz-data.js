/**
 * @module imp-96841-route-m-ceiling-ladder-viz-data
 *
 * imp-96841 (ux): import-light viz-data leaf for the imp-96693/imp-96793 Route M
 * conditioning-ceiling ladder. imp-96693 established the three ceilings T~2.594e7
 * (rigorous), F~3.764e7 (fit), M~4.109e7 (measured) and their adjacency ratios
 * (F/T 1.4511, M/F 1.0917); imp-96793 then cross-checked those ratios against an
 * independent flat-proxy direct measurement at N0=9000 (F/T 1.3480, M/F 1.0588). This
 * leaf reshapes both ladders into chart-ready series (a three-bar ceiling ladder plus a
 * two-leg adjacency-ratio comparison, fit vs flat-proxy), so the "flat-proxy reproduces
 * the fit ordering within single-digit percent" reading can be seen at a glance.
 *
 * No re-derivation: every ceiling value and every ratio is copied verbatim from
 * imp-96693 and imp-96793 (which itself copies imp-96693 unchanged). The only new
 * arithmetic here is reshaping into plot-ready arrays.
 *
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the three ceilings and fit ratios)
 * @see imp-96793-route-m-ceiling-adjacency-ratio-direct-crosscheck.js (the independent flat-proxy ratios)
 *
 * Ticket: imp-96841 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294/imp-96819 convention) --
 * values are validated below via a plain exported check object instead of an import-time throw.
 */

import { IMP96693_CEILINGS, IMP96693_RATIOS } from './imp-96693-route-m-conditioning-ceiling-residual-decomposition.js';
import { IMP96793_FLAT_RATIOS } from './imp-96793-route-m-ceiling-adjacency-ratio-direct-crosscheck.js';

// FINDING (T<F<M ladder): the three ceilings, reshaped for a bar chart (x = ceiling label).
export const IMP96841_CEILING_BARS = Object.freeze([
  { key: 'trace', label: 'trace (T)', N: IMP96693_CEILINGS.trace.N, rigor: IMP96693_CEILINGS.trace.label },
  { key: 'frobenius', label: 'Frobenius (F)', N: IMP96693_CEILINGS.frobenius.N, rigor: IMP96693_CEILINGS.frobenius.label },
  { key: 'measured', label: 'measured (M)', N: IMP96693_CEILINGS.measured.N, rigor: IMP96693_CEILINGS.measured.label },
]);

// FINDING (adjacency ratios): fit-ceiling ratios (imp-96693) vs the independent flat-proxy
// direct measurement (imp-96793), paired for a grouped-bar comparison.
export const IMP96841_RATIO_COMPARISON = Object.freeze([
  { leg: 'F/T', fit: IMP96693_RATIOS.frobeniusOverTrace, flatProxy: IMP96793_FLAT_RATIOS.frobeniusOverTrace },
  { leg: 'M/F', fit: IMP96693_RATIOS.measuredOverFrobenius, flatProxy: IMP96793_FLAT_RATIOS.measuredOverFrobenius },
]);

// Per-leg gap between the fit ratio and the flat-proxy ratio, for a delta chart.
export const IMP96841_RATIO_GAP = IMP96841_RATIO_COMPARISON.map((r) => ({
  leg: r.leg,
  fit: r.fit,
  flatProxy: r.flatProxy,
  gap: r.fit - r.flatProxy,
}));

export const IMP96841_LANDMARKS = Object.freeze({
  traceN: IMP96693_CEILINGS.trace.N,
  frobeniusN: IMP96693_CEILINGS.frobenius.N,
  measuredN: IMP96693_CEILINGS.measured.N,
  fitFrobeniusOverTrace: IMP96693_RATIOS.frobeniusOverTrace,
  fitMeasuredOverFrobenius: IMP96693_RATIOS.measuredOverFrobenius,
  flatFrobeniusOverTrace: IMP96793_FLAT_RATIOS.frobeniusOverTrace,
  flatMeasuredOverFrobenius: IMP96793_FLAT_RATIOS.measuredOverFrobenius,
});

export const IMP96841_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every ceiling value and ' +
  'every adjacency ratio plotted here is copied verbatim from imp-96693 and imp-96793 (which ' +
  'itself copies imp-96693 unchanged); the only new arithmetic is the plot-ready reshaping and ' +
  'the per-leg fit-vs-flat-proxy gap. Only the trace ceiling T=2.594e7 is a rigorous lower ' +
  'bound; the Frobenius and measured ceilings both rest on log-fit extrapolation. Measurement/' +
  'reconciliation only: changes no bound and establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP96841_VALIDATION = Object.freeze({
  threeBarsPresent: IMP96841_CEILING_BARS.length === 3,
  strictlyOrdered:
    IMP96841_CEILING_BARS[0].N < IMP96841_CEILING_BARS[1].N &&
    IMP96841_CEILING_BARS[1].N < IMP96841_CEILING_BARS[2].N,
  twoLegsPresent: IMP96841_RATIO_COMPARISON.length === 2,
  fitExceedsFlatProxyBothLegs: IMP96841_RATIO_GAP.every((r) => r.gap > 0),
});

export default {
  ceilingBars: IMP96841_CEILING_BARS,
  ratioComparison: IMP96841_RATIO_COMPARISON,
  ratioGap: IMP96841_RATIO_GAP,
  landmarks: IMP96841_LANDMARKS,
  banner: IMP96841_HONEST_BANNER,
  validation: IMP96841_VALIDATION,
};
