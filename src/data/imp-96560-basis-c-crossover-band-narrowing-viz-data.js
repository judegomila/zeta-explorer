/**
 * @module imp-96560-basis-c-crossover-band-narrowing-viz-data
 *
 * imp-96560 (ux, sonnet-4-6): chart-shaping layer for the imp-96479/imp-96444 result
 * that de-jittering the basis-C direct-integral floor estimator (MEDIAN-over-resolved-ppp
 * in place of MIN-over-coarse-ppp) narrows the corroboration-reach crossover band from
 * [1.3e12, 2.5e12] to a proper subset [1.38e12, 1.76e12], against the PT anchor
 * L = 5.9e6. Every band endpoint and the anchor value are copied verbatim from
 * imp-96479-basis-c-floor-dejitter-glossary-headword.js; the only work done here is
 * projecting the two bands plus the anchor onto a shared log10(L) axis for a
 * before/after range chart.
 *
 * @see imp-96479-basis-c-floor-dejitter-glossary-headword.js (source verdict, bands baked here)
 * @see imp-96444-basis-c-floor-slope-dejitter.js (the de-jittered measurement behind the narrower band)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the coarse min-sweep band this narrows)
 */

import { IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD } from './imp-96479-basis-c-floor-dejitter-glossary-headword.js';

const PT_ANCHOR_L = 5.9e6;

export const IMP96560_BANDS = Object.freeze([
  Object.freeze({
    key: 'before',
    label: 'imp-96430 min-sweep band (jittery estimator)',
    lo: 1.3e12,
    hi: 2.5e12,
    widthRatio: 2.5e12 / 1.3e12,
  }),
  Object.freeze({
    key: 'after',
    label: 'imp-96444 median-sweep band (de-jittered estimator)',
    lo: 1.38e12,
    hi: 1.76e12,
    widthRatio: 1.76e12 / 1.38e12,
  }),
]);

export const IMP96560_ANCHOR = Object.freeze({
  label: 'Platt-Trudgian anchor',
  L: PT_ANCHOR_L,
});

export const IMP96560_AXIS = Object.freeze({
  log10Min: Math.log10(PT_ANCHOR_L) - 0.5,
  log10Max: Math.log10(Math.max(...IMP96560_BANDS.map((b) => b.hi))) + 0.5,
});

export const IMP96560_FINDING = Object.freeze({
  bandIsProperSubset:
    IMP96560_BANDS[1].lo >= IMP96560_BANDS[0].lo && IMP96560_BANDS[1].hi <= IMP96560_BANDS[0].hi,
  decadesPastAnchorLo: Math.log10(IMP96560_BANDS[1].lo) - Math.log10(PT_ANCHOR_L),
  decadesPastAnchorHi: Math.log10(IMP96560_BANDS[1].hi) - Math.log10(PT_ANCHOR_L),
});

export const IMP96560_HONEST_BANNER = IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD.verdict;
