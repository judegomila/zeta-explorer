/**
 * @module imp-97715-route-m-exponent-robustness-viz-data
 *
 * imp-97715: import-light viz-data leaf charting the imp-97687 Route-M average decay exponent
 * robustness assessment: the leave-one-out (jackknife) band, the bootstrap 95% band, both against
 * the fixed q=3 reference power, plus the abscissa-dependent contrast (10.18 for the proper
 * 1/(log p)^q model vs 0.62 for a 1/p^s model). Reuses IMP97687_ROBUSTNESS verbatim (no
 * re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97687-route-m-avg-exponent-robustness.js (IMP97687_ROBUSTNESS, IMP97687_VERDICT)
 */

import { IMP97687_ROBUSTNESS, IMP97687_VERDICT } from './imp-97687-route-m-avg-exponent-robustness.js';

export const IMP97715_FIXED_POWER_REFERENCE = Object.freeze({ q3: 3 });

// Two confidence bands for the ~10.18 headline exponent, both shown against the q=3 reference.
export const IMP97715_BAND_ROWS = Object.freeze([
  Object.freeze({
    key: 'leave-one-out',
    label: 'Leave-one-out (jackknife)',
    low: IMP97687_ROBUSTNESS.looMin, // ~9.985
    high: IMP97687_ROBUSTNESS.looMax, // ~10.334
    center: IMP97687_ROBUSTNESS.looMean, // ~10.174
    exceedsQ3: IMP97687_ROBUSTNESS.looMin > IMP97715_FIXED_POWER_REFERENCE.q3,
  }),
  Object.freeze({
    key: 'bootstrap-95',
    label: 'Bootstrap 95% band (20000 draws)',
    low: IMP97687_ROBUSTNESS.bootstrapCI95[0], // ~8.2
    high: IMP97687_ROBUSTNESS.bootstrapCI95[1], // ~11.0
    center: IMP97687_ROBUSTNESS.bootstrapMean, // ~10.09
    exceedsQ3: IMP97687_ROBUSTNESS.bootstrapCI95[0] > IMP97715_FIXED_POWER_REFERENCE.q3,
  }),
]);

// The same headline exponent read against two different abscissa (model) choices.
export const IMP97715_ABSCISSA_CONTRAST = Object.freeze({
  properModel: Object.freeze({
    label: '1/(log p)^q model (log(log p) abscissa)',
    exponent: IMP97687_ROBUSTNESS.abscissa.logLogP, // ~10.18
  }),
  alternateModel: Object.freeze({
    label: '1/p^s model (log p abscissa)',
    exponent: IMP97687_ROBUSTNESS.abscissa.logP, // ~0.62
  }),
});

export const IMP97715_SUMMARY = Object.freeze({
  law:
    'Both confidence bands for the imp-97659 ~10.18 average decay exponent clear the fixed q=3 reference '
    + `entirely: leave-one-out stays in [${IMP97715_BAND_ROWS[0].low.toFixed(3)}, `
    + `${IMP97715_BAND_ROWS[0].high.toFixed(3)}] and the bootstrap 95% band is `
    + `[${IMP97715_BAND_ROWS[1].low.toFixed(2)}, ${IMP97715_BAND_ROWS[1].high.toFixed(2)}] -- but the `
    + 'exponent is only meaningful relative to its abscissa model: the same ladder gives '
    + `${IMP97715_ABSCISSA_CONTRAST.properModel.exponent.toFixed(2)} against log(log p) versus only `
    + `${IMP97715_ABSCISSA_CONTRAST.alternateModel.exponent.toFixed(2)} against log p.`,
  reading:
    `Leave-one-out band [${IMP97715_BAND_ROWS[0].low.toFixed(3)}, ${IMP97715_BAND_ROWS[0].high.toFixed(3)}] `
    + `(mean ${IMP97715_BAND_ROWS[0].center.toFixed(3)}): no single rung manufactures the slope. `
    + `Bootstrap 95% band [${IMP97715_BAND_ROWS[1].low.toFixed(2)}, ${IMP97715_BAND_ROWS[1].high.toFixed(2)}] `
    + `(mean ${IMP97715_BAND_ROWS[1].center.toFixed(2)}): wider (order 1.5) but still entirely above q=3. `
    + `Abscissa contrast: ${IMP97715_ABSCISSA_CONTRAST.properModel.exponent.toFixed(2)} (proper model) vs `
    + `${IMP97715_ABSCISSA_CONTRAST.alternateModel.exponent.toFixed(2)} (alternate model) -- the number is an `
    + 'exponent of a chosen parameterisation, not a universal decay rate.',
  verdict:
    'Presentation only: every band and exponent value is reused verbatim from imp-97687 (a measurement, '
    + 'not a derivation); no new computation. Changes no bound; MCM stays refuted from omega=11; '
    + 'Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97715_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97715-two-band-rows',
    description: 'exactly two confidence-band rows',
    holds: () => IMP97715_BAND_ROWS.length === 2,
  },
  {
    id: 'imp97715-both-bands-clear-q3',
    description: 'both the leave-one-out and bootstrap bands clear the q=3 reference entirely',
    holds: () => IMP97715_BAND_ROWS.every((r) => r.exceedsQ3 === true),
  },
  {
    id: 'imp97715-bootstrap-wider-than-jackknife',
    description: 'the bootstrap band is wider than the leave-one-out band',
    holds: () =>
      IMP97715_BAND_ROWS[1].high - IMP97715_BAND_ROWS[1].low > IMP97715_BAND_ROWS[0].high - IMP97715_BAND_ROWS[0].low,
  },
  {
    id: 'imp97715-abscissa-contrast-matches-source',
    description: 'the abscissa contrast values match the imp-97687 baked results verbatim',
    holds: () =>
      Math.abs(IMP97715_ABSCISSA_CONTRAST.properModel.exponent - IMP97687_ROBUSTNESS.fullExponent) < 1e-9
      && Math.abs(IMP97715_ABSCISSA_CONTRAST.alternateModel.exponent - IMP97687_ROBUSTNESS.abscissa.logP) < 1e-9,
  },
  {
    id: 'imp97715-proper-model-exceeds-alternate',
    description: 'the proper (log-log-p) model exponent exceeds the alternate (log-p) model exponent',
    holds: () =>
      IMP97715_ABSCISSA_CONTRAST.properModel.exponent > IMP97715_ABSCISSA_CONTRAST.alternateModel.exponent,
  },
  {
    id: 'imp97715-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers and matches source verdict',
    holds: () =>
      /no bound/.test(IMP97715_SUMMARY.verdict)
      && /NO QED/.test(IMP97715_SUMMARY.verdict)
      && IMP97687_VERDICT.qed === false,
  },
];

for (const assertion of IMP97715_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97715 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97715_SUMMARY;
