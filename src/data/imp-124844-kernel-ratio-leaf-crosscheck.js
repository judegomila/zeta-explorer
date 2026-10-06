/**
 * @module imp-124844-kernel-ratio-leaf-crosscheck
 *
 * imp-124844: cross-check verifying that the two imp-97823 "reconstruction-kernel per-decade growth ratio"
 * presentation leaves -- imp-124776 (gap-keyed) and imp-97843 (decade-index-keyed) -- export MUTUALLY
 * CONSISTENT numbers. Both claim to reuse the shared IMP97823_KERNEL_DECADE_GROWTH_SQRT10 upslope/downslope
 * ratio tables "verbatim, no re-derivation", but they were written independently and key their rows
 * differently (gap value vs bare decade index); this leaf checks that claim holds element-wise rather than
 * taking it on faith.
 *
 * PRESENTATION-LAYER AUDIT ONLY. No new computation on the imp-97823 source; RH open; NO QED.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10.js (shared source)
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data.js (gap-keyed leaf)
 * @see imp-97843-kernel-decade-growth-viz-data.js (decade-index-keyed leaf)
 */

import { IMP97823_KERNEL_DECADE_GROWTH_SQRT10 } from './imp-97823-kernel-decade-growth-sqrt10.js';
import { IMP124776_WIDE_RATIO_VS_GAP, IMP124776_DEEP_RATIO_VS_GAP } from './imp-124776-kernel-decade-ratio-vs-gap-viz-data.js';
import { IMP97843_WIDE_RATIO_ROWS, IMP97843_DEEP_RATIO_ROWS } from './imp-97843-kernel-decade-growth-viz-data.js';

const SQRT10 = IMP97823_KERNEL_DECADE_GROWTH_SQRT10.sqrt10;

// Both leaves derive their WIDE arrays from the imp-97823 wide_per_decade_ratios (6 entries) and their DEEP
// arrays from the deep_per_decade_ratios (3 entries); the two leaves must report identical values per row
// even though imp-124776 keys by gap and imp-97843 keys by decade index.
function maxAbsDiff(leafA, leafB, field) {
  return Math.max(...leafA.map((row, i) => Math.abs(row[field] - leafB[i][field])));
}

const wideUpslopeDiff = maxAbsDiff(IMP124776_WIDE_RATIO_VS_GAP, IMP97843_WIDE_RATIO_ROWS, 'upslope_ratio');
const wideDownslopeDiff = maxAbsDiff(IMP124776_WIDE_RATIO_VS_GAP, IMP97843_WIDE_RATIO_ROWS, 'downslope_ratio');
const deepUpslopeDiff = maxAbsDiff(IMP124776_DEEP_RATIO_VS_GAP, IMP97843_DEEP_RATIO_ROWS, 'upslope_ratio');
const deepDownslopeDiff = maxAbsDiff(IMP124776_DEEP_RATIO_VS_GAP, IMP97843_DEEP_RATIO_ROWS, 'downslope_ratio');

export const IMP124844_KERNEL_RATIO_LEAF_CROSSCHECK = Object.freeze({
  id: 'imp-124844',
  question:
    'Do the imp-124776 (gap-keyed) and imp-97843 (decade-index-keyed) presentation leaves, both claiming to ' +
    'reuse the imp-97823 reconstruction-kernel per-decade growth ratios verbatim, actually export identical ' +
    'ratio values row-for-row?',
  method:
    'Pairwise-compare IMP124776_WIDE_RATIO_VS_GAP vs IMP97843_WIDE_RATIO_ROWS and ' +
    'IMP124776_DEEP_RATIO_VS_GAP vs IMP97843_DEEP_RATIO_ROWS, taking the max |difference| per field across ' +
    'all rows (both leaves share row order -- i-th wide ratio / i-th deep ratio from the same source arrays).',
  maxAbsDiff: {
    wide_upslope_ratio: wideUpslopeDiff,
    wide_downslope_ratio: wideDownslopeDiff,
    deep_upslope_ratio: deepUpslopeDiff,
    deep_downslope_ratio: deepDownslopeDiff,
  },
  sqrt10: SQRT10,
  isRigorous: false,
  verdict:
    'CONSISTENT: the imp-124776 and imp-97843 leaves export identical kernel-growth ratios from the shared ' +
    'imp-97823 source (max |difference| = 0 across all wide and deep, upslope and downslope rows); the two ' +
    'independently-written leaves differ only in presentation (gap-keyed vs decade-index-keyed), not in the ' +
    'numbers they carry. Presentation-layer audit only; no new computation on the imp-97823 measurement; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
});

const IMP124844_ASSERTIONS = [
  {
    id: 'imp124844-wide-ratios-match',
    description: 'imp-124776 and imp-97843 wide-ladder upslope/downslope ratios match exactly (max diff 0)',
    holds: () => wideUpslopeDiff === 0 && wideDownslopeDiff === 0,
  },
  {
    id: 'imp124844-deep-ratios-match',
    description: 'imp-124776 and imp-97843 deep-window upslope/downslope ratios match exactly (max diff 0)',
    holds: () => deepUpslopeDiff === 0 && deepDownslopeDiff === 0,
  },
  {
    id: 'imp124844-row-counts-match',
    description: 'both leaves carry the same number of wide (6) and deep (3) rows',
    holds: () =>
      IMP124776_WIDE_RATIO_VS_GAP.length === IMP97843_WIDE_RATIO_ROWS.length &&
      IMP124776_DEEP_RATIO_VS_GAP.length === IMP97843_DEEP_RATIO_ROWS.length,
  },
  {
    id: 'imp124844-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () =>
      /no bound/.test(IMP124844_KERNEL_RATIO_LEAF_CROSSCHECK.verdict) &&
      /NO QED/.test(IMP124844_KERNEL_RATIO_LEAF_CROSSCHECK.verdict),
  },
];

for (const assertion of IMP124844_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124844-kernel-ratio-leaf-crosscheck assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124844_KERNEL_RATIO_LEAF_CROSSCHECK;
