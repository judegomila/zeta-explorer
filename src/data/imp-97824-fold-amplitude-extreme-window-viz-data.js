/**
 * @module imp-97824-fold-amplitude-extreme-window-viz-data
 *
 * imp-97824: import-light viz-data leaf charting the imp-97779 fold-amplitude extreme-window
 * sweep (0.02x..50x floor factors): the high-floor local exponent q climbing 0.2256 -> 0.8643
 * (2x..50x) with no ceiling, and the fold curvature phi_xx collapsing toward zero
 * (1.339604e-1 at 1x -> 2.79e-2 at 50x) across the same window. Reuses the frozen
 * IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW table / localExponents / highFloorDivergence
 * fields verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97779-fold-amplitude-saturation-extreme-window.js (source module)
 */

import { IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW } from './imp-97779-fold-amplitude-saturation-extreme-window.js';

const TABLE = IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW.table;
const LOCAL_EXPONENTS = IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW.localExponents;
const HI = IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW.highFloorDivergence;

// phi_xx-collapse rows: one per swept floor factor (full 0.02x..50x window).
export const IMP97824_PHIXX_ROWS = Object.freeze(
  TABLE.map((r) => Object.freeze({ floorFactor: r.floorFactor, phi_xx: r.phi_xx, K: r.K })),
);

// High-floor local-exponent ladder (2x..50x): q climbing with no ceiling.
export const IMP97824_Q_LADDER = Object.freeze(
  LOCAL_EXPONENTS.filter((e) => e.from >= 2.0).map((e) => Object.freeze({ from: e.from, to: e.to, q: e.q })),
);

export const IMP97824_SUMMARY = Object.freeze({
  law:
    'Past the 2x floor factor the local log-log exponent q = dlnK/dlnE_trunc climbs with no '
    + 'ceiling while the fold curvature phi_xx collapses toward zero across the whole 0.02x..50x '
    + 'window: the amplitude K = sqrt(S/(2 phi_xx)) diverges because its denominator vanishes, not '
    + 'because of a genuine steepening power law.',
  reading:
    `q ladder (2x..50x): ${IMP97824_Q_LADDER.map((r) => r.q.toFixed(4)).join(' -> ')} (terminal `
    + `${HI.hi_q_terminal_30x_50x.toFixed(4)}); phi_xx: ${HI.phi_xx_base_1x.toExponential(4)} at 1x -> `
    + `${HI.phi_xx_50x.toExponential(4)} at 50x.`,
  verdict:
    'Presentation only: every row and elasticity is reused verbatim from imp-97779 (a measurement, '
    + 'not a derivation); no new computation. Measurement / sensitivity only on the inherited '
    + 'imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic. Changes no bound; '
    + 'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97824_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97824-thirteen-phixx-rows',
    description: 'one phi_xx/K row per swept floor factor (0.02x..50x, 13 factors)',
    holds: () => IMP97824_PHIXX_ROWS.length === 13,
  },
  {
    id: 'imp97824-phixx-collapses-toward-zero',
    description: 'phi_xx at the base (1x) row exceeds phi_xx at the 50x row by more than 3x',
    holds: () => {
      const base = IMP97824_PHIXX_ROWS.find((r) => r.floorFactor === 1.0).phi_xx;
      const hi = IMP97824_PHIXX_ROWS.find((r) => r.floorFactor === 50.0).phi_xx;
      return base > 0 && hi > 0 && base > 3 * hi;
    },
  },
  {
    id: 'imp97824-q-ladder-climbs-no-ceiling',
    description: 'the 2x..50x local-exponent ladder climbs monotonically to ~0.86 with no ceiling',
    holds: () =>
      IMP97824_Q_LADDER.length === 6 &&
      IMP97824_Q_LADDER.every((r, i) => i === 0 || r.q > IMP97824_Q_LADDER[i - 1].q) &&
      IMP97824_Q_LADDER[IMP97824_Q_LADDER.length - 1].q > 0.5,
  },
  {
    id: 'imp97824-K-monotone-increasing',
    description: 'K increases monotonically with the floor factor across the whole window',
    holds: () => IMP97824_PHIXX_ROWS.every((r, i) => i === 0 || r.K > IMP97824_PHIXX_ROWS[i - 1].K),
  },
  {
    id: 'imp97824-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97824_SUMMARY.verdict) && /NO QED/.test(IMP97824_SUMMARY.verdict),
  },
];

for (const assertion of IMP97824_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97824 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97824_SUMMARY;
