/**
 * @module imp-97843-kernel-decade-growth-viz-data
 *
 * imp-97843: import-light viz-data leaf charting the imp-97823 per-decade growth ratio of the shared
 * reconstruction kernel |K| = |1/(N sigma_N)| on BOTH arms of the imp-97520 L1 sigma peak, converging
 * onto sqrt(10) = 3.162278 in the deep near-peak limit. Reuses the frozen
 * IMP97823_KERNEL_DECADE_GROWTH_SQRT10 upslope/downslope tables verbatim (no re-derivation, no new
 * computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10.js (source module)
 */

import { IMP97823_KERNEL_DECADE_GROWTH_SQRT10 } from './imp-97823-kernel-decade-growth-sqrt10.js';

const UP = IMP97823_KERNEL_DECADE_GROWTH_SQRT10.upslope;
const DOWN = IMP97823_KERNEL_DECADE_GROWTH_SQRT10.downslope;
const SQRT10 = IMP97823_KERNEL_DECADE_GROWTH_SQRT10.sqrt10;

// Wide-ladder per-decade ratio rows (g = 1e-1..1e-7, 6 decade-to-decade ratios, far-from-peak running).
export const IMP97843_WIDE_RATIO_ROWS = Object.freeze(
  UP.wide_per_decade_ratios.map((upRatio, i) =>
    Object.freeze({
      decade: i,
      upslope_ratio: upRatio,
      downslope_ratio: DOWN.wide_per_decade_ratios[i],
      sqrt10: SQRT10,
    }),
  ),
);

// Deep-window per-decade ratio rows (g = 1e-5..1e-8, 3 ratios, converging onto sqrt(10)).
export const IMP97843_DEEP_RATIO_ROWS = Object.freeze(
  UP.deep_per_decade_ratios.map((upRatio, i) =>
    Object.freeze({
      decade: i,
      upslope_ratio: upRatio,
      downslope_ratio: DOWN.deep_per_decade_ratios[i],
      upslope_deviation: UP.deep_ratio_deviation_from_sqrt10[i],
      downslope_deviation: DOWN.deep_ratio_deviation_from_sqrt10[i],
      sqrt10: SQRT10,
    }),
  ),
);

export const IMP97843_SUMMARY = Object.freeze({
  law:
    'The per-decade growth ratio of the shared reconstruction kernel |K| runs far from the imp-97520 L1 '
    + 'peak (wide-window growth ' + UP.full_ls.growth_per_decade + ' upslope / ' + DOWN.full_ls.growth_per_decade
    + ' downslope) and converges onto sqrt(10) = ' + SQRT10 + ' in the deep near-peak limit (deep-window '
    + 'growth ' + UP.deep_ls.growth_per_decade + ' upslope / ' + DOWN.deep_ls.growth_per_decade + ' downslope), '
    + 'the two arms bracketing sqrt(10) from opposite sides.',
  reading:
    `deep ratios (g=1e-5..1e-8): upslope ${UP.deep_per_decade_ratios.join(' -> ')}, `
    + `downslope ${DOWN.deep_per_decade_ratios.join(' -> ')}, sqrt(10) = ${SQRT10}.`,
  verdict:
    'Presentation only: every row and ratio is reused verbatim from imp-97823 (a measurement, not a '
    + 'derivation); no new computation. Measurement / sensitivity only on the inherited '
    + 'imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic. Changes no bound; '
    + 'establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97843_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97843-six-wide-rows',
    description: 'one ratio row per wide-ladder decade-to-decade gap (g=1e-1..1e-7, 6 ratios)',
    holds: () => IMP97843_WIDE_RATIO_ROWS.length === 6,
  },
  {
    id: 'imp97843-three-deep-rows',
    description: 'one ratio row per deep-window decade-to-decade gap (g=1e-5..1e-8, 3 ratios)',
    holds: () => IMP97843_DEEP_RATIO_ROWS.length === 3,
  },
  {
    id: 'imp97843-deep-closer-to-sqrt10-than-wide',
    description: 'the last deep-window ratio is closer to sqrt(10) than the first wide-window ratio, on both arms',
    holds: () => {
      const lastDeep = IMP97843_DEEP_RATIO_ROWS[IMP97843_DEEP_RATIO_ROWS.length - 1];
      const firstWide = IMP97843_WIDE_RATIO_ROWS[0];
      return (
        Math.abs(lastDeep.upslope_ratio - SQRT10) < Math.abs(firstWide.upslope_ratio - SQRT10)
        && Math.abs(lastDeep.downslope_ratio - SQRT10) < Math.abs(firstWide.downslope_ratio - SQRT10)
      );
    },
  },
  {
    id: 'imp97843-arms-bracket-sqrt10-in-deep-window',
    description: 'every deep-window row has upslope deviation < 0 and downslope deviation > 0 (bracketing sqrt(10))',
    holds: () => IMP97843_DEEP_RATIO_ROWS.every((r) => r.upslope_deviation < 0 && r.downslope_deviation > 0),
  },
  {
    id: 'imp97843-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97843_SUMMARY.verdict) && /NO QED/.test(IMP97843_SUMMARY.verdict),
  },
];

for (const assertion of IMP97843_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97843 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97843_SUMMARY;
