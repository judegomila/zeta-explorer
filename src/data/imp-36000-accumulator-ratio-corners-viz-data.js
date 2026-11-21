/**
 * @module imp-36000-accumulator-ratio-corners-viz-data
 * @fileoverview imp-36000 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35949 (alpha, beta)
 *   accumulator-ratio r = max_i|S_i| / Sum|t_k| corners at fixed N ~ 488602:
 *
 *   - the imp-35812 strong-cancellation baseline (alpha, beta) = (golden-ratio
 *     fraction, golden angle): r ~ 1.2e-3, max_i|S_i| ~ 1.05, Sum|t_k| ~ 889;
 *   - the q=1 resonant breakdown corner (alpha = 2 pi, beta = 0): r -> 1,
 *     max_i|S_i| = Sum|t_k| ~ 1398 (cos(2 pi k) = 1 for all integer k, no
 *     cancellation).
 *
 *   This module does not import imp-35949 (no re-deriving the frequency-grid
 *   scan at page-load time); it only bakes the recorded literals for direct
 *   charting.
 *
 *   @see imp-35949-w1-accumulator-frequency-grid-robustness.js (source measurement)
 *   @see imp-35999-i2-i3-panel-margin-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-36000 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

// Baked literals reproducing the imp-35949 two named corners exactly.
export const IMP36000_ACCUMULATOR_RATIO_CORNERS = Object.freeze([
  {
    label: 'imp-35812 baseline (strong cancellation)',
    alpha: 0.6180339887498949,
    beta: 2.3999632297286533,
    maxPartial: 1.05,
    sumAbs: 889,
    ratio: 1.2e-3,
  },
  {
    label: 'q=1 resonant breakdown (alpha=2pi, beta=0)',
    alpha: 2 * Math.PI,
    beta: 0,
    maxPartial: 1398,
    sumAbs: 1398,
    ratio: 1,
  },
]);

export const IMP36000_SCALES = Object.freeze({
  fixedN: 488602, // floor(sqrt(T_PT / 4 pi)) at T_PT = 3e12 (imp-35674 Part D)
  ordersRecoveredBaseline: 2.9, // -log10(r) at the imp-35812 baseline
  ordersRecoveredResonant: 0, // -log10(r) at the resonant no-drift corner
});

export const IMP36000_ACCUMULATOR_RATIO_VIZ_DATA = {
  ticket: 'imp-36000',
  sourceTicket: 'imp-35949',
  corners: IMP36000_ACCUMULATOR_RATIO_CORNERS,
  scales: IMP36000_SCALES,
  note:
    'imp-35949 (alpha,beta) accumulator-ratio r = max_i|S_i| / Sum|t_k| at the two named grid ' +
    'corners, fixed N ~ 488602: the imp-35812 strong-cancellation baseline (r ~ 1.2e-3, O(1) ' +
    'accumulator) vs the q=1 resonant breakdown corner (alpha = 2 pi, beta = 0, r -> 1, no ' +
    'cancellation).',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35949 measurement exactly; adds no new ' +
    'derivation and changes no bound. The imp-35890 O(1) running-accumulator flatness is CONTINGENT ' +
    'on the frequencies, not generic; a certified engine must MONITOR the accumulator at run time. ' +
    'The certified length-N interval sum stays GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
    '(imp-35725). NO QED. No refereed bound is changed.',
};

export const IMP36000_VIZ_ASSERTIONS = [
  {
    id: 'imp36000-two-corners',
    description: 'exactly 2 named corners (baseline, resonant breakdown)',
    holds: () => IMP36000_ACCUMULATOR_RATIO_CORNERS.length === 2,
  },
  {
    id: 'imp36000-baseline-strong-cancellation',
    description: 'baseline corner has r < 0.01 (strong cancellation)',
    holds: () => IMP36000_ACCUMULATOR_RATIO_CORNERS[0].ratio < 0.01,
  },
  {
    id: 'imp36000-resonant-full-breakdown',
    description: 'resonant corner has r = 1 and maxPartial = sumAbs (no cancellation)',
    holds: () =>
      IMP36000_ACCUMULATOR_RATIO_CORNERS[1].ratio === 1 &&
      IMP36000_ACCUMULATOR_RATIO_CORNERS[1].maxPartial === IMP36000_ACCUMULATOR_RATIO_CORNERS[1].sumAbs,
  },
  {
    id: 'imp36000-resonant-alpha-is-2pi',
    description: 'resonant corner alpha is exactly 2 pi, beta is 0',
    holds: () =>
      IMP36000_ACCUMULATOR_RATIO_CORNERS[1].alpha === 2 * Math.PI &&
      IMP36000_ACCUMULATOR_RATIO_CORNERS[1].beta === 0,
  },
  {
    id: 'imp36000-fixed-n-matches-source',
    description: 'fixedN matches floor(sqrt(T_PT/4 pi)) at T_PT = 3e12',
    holds: () => IMP36000_SCALES.fixedN === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))),
  },
  {
    id: 'imp36000-honesty-gate-no-qed',
    description: 'honest status references viz-data-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36000_ACCUMULATOR_RATIO_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP36000_ACCUMULATOR_RATIO_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36000_ACCUMULATOR_RATIO_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36000_ACCUMULATOR_RATIO_VIZ_DATA.honest),
  },
];

for (const a of IMP36000_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36000-accumulator-ratio-corners-viz-data assertion failed: ${a.id}`);
  }
}
