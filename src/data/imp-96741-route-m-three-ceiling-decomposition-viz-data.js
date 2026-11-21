/**
 * @module imp-96741-route-m-three-ceiling-decomposition-viz-data
 *
 * imp-96741 (ux): import-light viz-data leaf for the imp-96713/96693 Route M three-ceiling
 * conditioning decomposition -- trace-domination T (RIGOROUS lower), Frobenius F (FIT), and
 * measured composed M (MEASURED), with the strict ordering T < F < M, the residual factor
 * M/F, the gap-fraction (F-T)/(M-T), and the invariant total ratio M/T. Those figures exist
 * only as JSDoc/literal tables in imp-96713 and imp-96693; this reshapes them into a
 * chart-ready segment array plus the annotation figures, no re-derivation.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96713 (N=12000-updated)
 * exports; only the bar-segment reshaping is new. Changes no bound, establishes no operator
 * positivity, no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (source of the ceilings, ratios, gap-fraction)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the original decomposition, audited by imp-96713)
 * @see imp-96723-route-m-three-ceiling-decomposition-viz-data.js (sibling bar chart on the pre-imp-96713 ceilings;
 *      this leaf updates the Frobenius ceiling to the imp-96694 N=12000 re-solve and adds the gap-fraction annotation)
 *
 * Ticket: imp-96741 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96713 (itself import-light, no zeros bundle).
 */

import {
  IMP96713_CEILINGS,
  IMP96713_RATIOS,
  IMP96713_GAP_FRACTION,
  IMP96713_DECOMPOSITION,
  IMP96713_HONEST_BANNER,
} from './imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js';

// The three ceilings, reshaped into a chart-ready segment array (rigorous/fit/measured).
export const IMP96741_SEGMENTS = Object.freeze([
  Object.freeze({
    symbol: IMP96713_CEILINGS.trace.symbol,
    label: IMP96713_CEILINGS.trace.label,
    N: IMP96713_CEILINGS.trace.N,
    source: IMP96713_CEILINGS.trace.source,
    color: '#4ade80',
  }),
  Object.freeze({
    symbol: IMP96713_CEILINGS.frobenius.symbol,
    label: IMP96713_CEILINGS.frobenius.label,
    N: IMP96713_CEILINGS.frobenius.N,
    source: IMP96713_CEILINGS.frobenius.source,
    color: '#facc15',
  }),
  Object.freeze({
    symbol: IMP96713_CEILINGS.measured.symbol,
    label: IMP96713_CEILINGS.measured.label,
    N: IMP96713_CEILINGS.measured.N,
    source: IMP96713_CEILINGS.measured.source,
    color: '#f87171',
  }),
]);

// The residual-factor and gap-fraction annotations (reused verbatim).
export const IMP96741_ANNOTATIONS = Object.freeze({
  frobeniusOverTrace: IMP96713_RATIOS.frobeniusOverTrace, // ~1.4555
  measuredOverFrobenius: IMP96713_RATIOS.measuredOverFrobenius, // ~1.0884, the "1.09x" residual factor
  measuredOverTrace: IMP96713_RATIOS.measuredOverTrace, // ~1.5842, invariant total ratio
  gapFraction: IMP96713_GAP_FRACTION, // ~0.7797, the "~76-78%" gap-fraction
  decompositionCloses: IMP96713_DECOMPOSITION.relResidual < 1e-12,
});

export const IMP96741_HONEST_BANNER = IMP96713_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96741_ASSERTIONS = [
  {
    id: 'imp96741-three-segments-strictly-ordered-with-correct-labels',
    holds: () =>
      IMP96741_SEGMENTS.length === 3 &&
      IMP96741_SEGMENTS[0].N < IMP96741_SEGMENTS[1].N &&
      IMP96741_SEGMENTS[1].N < IMP96741_SEGMENTS[2].N &&
      IMP96741_SEGMENTS[0].label === 'rigorous' &&
      IMP96741_SEGMENTS[1].label === 'fit' &&
      IMP96741_SEGMENTS[2].label === 'measured',
    why: 'the three imp-96713 ceilings must reshape into exactly three segments, strictly ordered T < F < M, each carrying its correct rigorous/fit/measured label.',
  },
  {
    id: 'imp96741-residual-factor-rounds-to-109x-gap-fraction-in-band',
    holds: () =>
      Math.round(IMP96741_ANNOTATIONS.measuredOverFrobenius * 100) / 100 === 1.09 &&
      IMP96741_ANNOTATIONS.gapFraction > 0.75 &&
      IMP96741_ANNOTATIONS.gapFraction < 0.79,
    why: 'the residual factor M/F must still round to the reported 1.09x and the gap-fraction must sit in the reported ~76-78% band.',
  },
  {
    id: 'imp96741-decomposition-closes-and-total-ratio-invariant',
    holds: () =>
      IMP96741_ANNOTATIONS.decompositionCloses === true &&
      Math.abs(
        IMP96741_ANNOTATIONS.frobeniusOverTrace * IMP96741_ANNOTATIONS.measuredOverFrobenius -
          IMP96741_ANNOTATIONS.measuredOverTrace,
      ) < 1e-9,
    why: 'M/T = (F/T)*(M/F) must close to machine precision, reproducing the invariant total ratio ~1.5842.',
  },
  {
    id: 'imp96741-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96741_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96741_HONEST_BANNER) &&
      /NO QED/.test(IMP96741_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96741_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96741-route-m-three-ceiling-decomposition-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  segments: IMP96741_SEGMENTS,
  annotations: IMP96741_ANNOTATIONS,
  banner: IMP96741_HONEST_BANNER,
};
