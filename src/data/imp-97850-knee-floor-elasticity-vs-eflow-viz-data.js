/**
 * @module imp-97850-knee-floor-elasticity-vs-eflow-viz-data
 *
 * imp-97850 (ux): import-light viz-data leaf charting the imp-97822 sigma-ramp knee E_trunc
 * floor-elasticity band (~0.183 decades per +/-10% floor factor) against the ~100x-smaller
 * imp-33767 E_flow displacement (~0.400% ~ 0.00173 decades) that separates the halving landmark
 * from the crossover the knee sits above. Reuses the frozen IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY
 * fields verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (source module)
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

const S = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY;

// One row per swept E_trunc floor factor: where the pointwise knee lands (log10 N*) and its
// distance from the baseline (factor 1.0) knee, in decades.
export const IMP97850_FLOOR_ROWS = Object.freeze(
  S.floorSweep.map((r) =>
    Object.freeze({
      floorFactor: r.floorFactor,
      log10Nstar: r.log10Nstar,
      decadesFromBaseline:
        r.log10Nstar !== null && S.baselineLog10Nstar !== null
          ? +(r.log10Nstar - S.baselineLog10Nstar).toFixed(4)
          : null,
    })
  )
);

// The two-bar comparison the ticket asks for: the knee's own +/-10% floor band vs the tiny
// imp-33767 E_flow displacement that separates the halving landmark from the crossover.
export const IMP97850_COMPARISON_BARS = Object.freeze([
  Object.freeze({
    label: 'knee +/-10% E_trunc floor band',
    decades: S.eflowComparison.knee_pm10_floor_band_decades, // ~0.183
  }),
  Object.freeze({
    label: 'imp-33767 E_flow displacement (halving -> crossover)',
    decades: S.eflowComparison.eflow_displacement_decades, // ~0.001733
  }),
]);

export const IMP97850_FLOOR_OVER_EFLOW_RATIO = S.eflowComparison.floor_over_eflow_ratio; // ~105
export const IMP97850_KNEE_FLOOR_EXPONENT = S.kneeFloorExponent; // ~ -2.099
export const IMP97850_BASELINE_LOG10_NSTAR = S.baselineLog10Nstar; // ~9.5291

export const IMP97850_SUMMARY = Object.freeze({
  law:
    `The imp-97822 knee floor-elasticity (+/-10% E_trunc band = ${IMP97850_COMPARISON_BARS[0].decades} decades) `
    + `is ~${IMP97850_FLOOR_OVER_EFLOW_RATIO}x the imp-33767 E_flow displacement `
    + `(${IMP97850_COMPARISON_BARS[1].decades} decades) that separates the halving landmark from the `
    + 'crossover the knee sits above: the E_trunc floor MODEL FORM, not E_flow, governs where the knee lands.',
  reading:
    IMP97850_FLOOR_ROWS.map((r) => `factor=${r.floorFactor}: N*=${r.log10Nstar} (${r.decadesFromBaseline >= 0 ? '+' : ''}${r.decadesFromBaseline} dec)`).join(', '),
  verdict:
    'Presentation only: every floor-sweep row and the comparison bars are reused verbatim from '
    + 'imp-97822 (a measurement, not a derivation); no new computation. Conditional-share curvature '
    + 'diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; changes '
    + 'no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH '
    + 'open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97850_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97850-ten-floor-rows',
    description: 'exactly ten floor-sweep rows (the imp-33708 {0.5..5} ladder)',
    holds: () => IMP97850_FLOOR_ROWS.length === 10,
  },
  {
    id: 'imp97850-baseline-row-zero-decades',
    description: 'the factor=1.0 row is zero decades from itself',
    holds: () => {
      const base = IMP97850_FLOOR_ROWS.find((r) => r.floorFactor === 1.0);
      return base !== undefined && base.decadesFromBaseline === 0;
    },
  },
  {
    id: 'imp97850-comparison-bars-match-source',
    description: 'the two comparison bars match the imp-97822 eflowComparison fields exactly',
    holds: () =>
      IMP97850_COMPARISON_BARS[0].decades === S.pm10FloorBandDecades &&
      IMP97850_COMPARISON_BARS[1].decades === S.eflowComparison.eflow_displacement_decades,
  },
  {
    id: 'imp97850-floor-dwarfs-eflow',
    description: 'the floor band is at least 50x the E_flow displacement (imp-97822 K3)',
    holds: () => IMP97850_FLOOR_OVER_EFLOW_RATIO !== null && IMP97850_FLOOR_OVER_EFLOW_RATIO > 50,
  },
  {
    id: 'imp97850-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97850_SUMMARY.verdict) && /NO QED/.test(IMP97850_SUMMARY.verdict),
  },
];

for (const assertion of IMP97850_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97850 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97850_SUMMARY;
