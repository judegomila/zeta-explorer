/**
 * @module imp-124776-kernel-decade-ratio-vs-gap-viz-data
 *
 * imp-124776: import-light viz-data leaf charting the imp-97823 reconstruction-kernel |K| = |1/(N sigma_N)|
 * per-decade growth RATIO keyed by the actual near-peak gap g (not a bare decade index), on BOTH arms of the
 * imp-97520 L1 sigma peak, together with the sqrt(10) = 3.162278 asymptote overlay for a "ratio vs gap g" chart.
 * Reuses the frozen IMP97823_KERNEL_DECADE_GROWTH_SQRT10 upslope/downslope ratio tables verbatim (no
 * re-derivation, no new computation); the WIDE ratios are keyed to the imp-97823 WIDE_GAPS ladder rows it
 * already exports, the DEEP ratios to the g = 1e-5..1e-8 window documented in that module's header (M1/M2).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10.js (source module)
 * @see imp-97843-kernel-decade-growth-viz-data.js (sibling leaf, decade-index keyed rather than gap-keyed)
 */

import { IMP97823_KERNEL_DECADE_GROWTH_SQRT10 } from './imp-97823-kernel-decade-growth-sqrt10.js';

const UP = IMP97823_KERNEL_DECADE_GROWTH_SQRT10.upslope;
const DOWN = IMP97823_KERNEL_DECADE_GROWTH_SQRT10.downslope;
const SQRT10 = IMP97823_KERNEL_DECADE_GROWTH_SQRT10.sqrt10;

// Wide-ladder ratios keyed by the trailing gap of each decade-to-decade pair (g = 1e-2 .. 1e-7), reusing the
// imp-97823 wide ladder rows verbatim as the gap key (far-from-peak running correction regime).
export const IMP124776_WIDE_RATIO_VS_GAP = Object.freeze(
  UP.wide_per_decade_ratios.map((upRatio, i) =>
    Object.freeze({
      gap: UP.ladder[i + 1].gap,
      upslope_ratio: upRatio,
      downslope_ratio: DOWN.wide_per_decade_ratios[i],
      sqrt10: SQRT10,
    }),
  ),
);

// Deep-window ratios keyed by the trailing gap of each decade-to-decade pair (g = 1e-6 .. 1e-8), the
// imp-97823-documented deep near-peak window (converging onto sqrt(10)).
const DEEP_TRAILING_GAPS = [1e-6, 1e-7, 1e-8];
export const IMP124776_DEEP_RATIO_VS_GAP = Object.freeze(
  UP.deep_per_decade_ratios.map((upRatio, i) =>
    Object.freeze({
      gap: DEEP_TRAILING_GAPS[i],
      upslope_ratio: upRatio,
      downslope_ratio: DOWN.deep_per_decade_ratios[i],
      sqrt10: SQRT10,
    }),
  ),
);

export const IMP124776_SUMMARY = Object.freeze({
  law:
    'The imp-97823 reconstruction-kernel |K| per-decade growth ratio, keyed by the actual near-peak gap g '
    + '(rather than a bare decade index), runs from '
    + `upslope ${UP.wide_per_decade_ratios[0]} -> ${UP.wide_per_decade_ratios[UP.wide_per_decade_ratios.length - 1]} `
    + `and downslope ${DOWN.wide_per_decade_ratios[0]} -> ${DOWN.wide_per_decade_ratios[DOWN.wide_per_decade_ratios.length - 1]} `
    + `across the wide ladder (g = 1e-2 .. 1e-7), converging onto sqrt(10) = ${SQRT10} in the deep window `
    + `(g = 1e-6 .. 1e-8), the two arms bracketing sqrt(10) from opposite sides.`,
  reading:
    `wide g-keyed ratios: upslope ${IMP124776_WIDE_RATIO_VS_GAP.map((r) => r.upslope_ratio).join(' -> ')}, `
    + `downslope ${IMP124776_WIDE_RATIO_VS_GAP.map((r) => r.downslope_ratio).join(' -> ')}; `
    + `deep g-keyed ratios: upslope ${IMP124776_DEEP_RATIO_VS_GAP.map((r) => r.upslope_ratio).join(' -> ')}, `
    + `downslope ${IMP124776_DEEP_RATIO_VS_GAP.map((r) => r.downslope_ratio).join(' -> ')}, sqrt(10) = ${SQRT10}.`,
  verdict:
    'Presentation only: every ratio is reused verbatim from imp-97823 (a measurement, not a derivation), '
    + 'relabeled by its actual near-peak gap g for a "ratio vs gap" chart axis; no new computation. '
    + 'Measurement / sensitivity only on the inherited imp-3220/imp-3406 extrapolation surrogate, not a '
    + 'rigorous asymptotic. Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; '
    + 'no RH verdict, NO QED. No refereed bound is changed.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124776_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124776-six-wide-rows',
    description: 'one gap-keyed ratio row per wide-ladder decade-to-decade pair (g=1e-2..1e-7, 6 ratios)',
    holds: () => IMP124776_WIDE_RATIO_VS_GAP.length === 6,
  },
  {
    id: 'imp124776-three-deep-rows',
    description: 'one gap-keyed ratio row per deep-window decade-to-decade pair (g=1e-6..1e-8, 3 ratios)',
    holds: () => IMP124776_DEEP_RATIO_VS_GAP.length === 3,
  },
  {
    id: 'imp124776-wide-gaps-descending',
    description: 'the wide-ladder gap keys strictly decrease (g=1e-2 down to 1e-7)',
    holds: () =>
      IMP124776_WIDE_RATIO_VS_GAP.every(
        (row, i) => i === 0 || row.gap < IMP124776_WIDE_RATIO_VS_GAP[i - 1].gap,
      ),
  },
  {
    id: 'imp124776-deep-closer-to-sqrt10-than-wide',
    description: 'the last deep-window ratio is closer to sqrt(10) than the first wide-window ratio, on both arms',
    holds: () => {
      const lastDeep = IMP124776_DEEP_RATIO_VS_GAP[IMP124776_DEEP_RATIO_VS_GAP.length - 1];
      const firstWide = IMP124776_WIDE_RATIO_VS_GAP[0];
      return (
        Math.abs(lastDeep.upslope_ratio - SQRT10) < Math.abs(firstWide.upslope_ratio - SQRT10)
        && Math.abs(lastDeep.downslope_ratio - SQRT10) < Math.abs(firstWide.downslope_ratio - SQRT10)
      );
    },
  },
  {
    id: 'imp124776-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124776_SUMMARY.verdict) && /NO QED/.test(IMP124776_SUMMARY.verdict),
  },
];

for (const assertion of IMP124776_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124776 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124776_SUMMARY;
