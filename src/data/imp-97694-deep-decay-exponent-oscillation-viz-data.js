/**
 * @module imp-97694-deep-decay-exponent-oscillation-viz-data
 *
 * imp-97694: import-light viz-data leaf charting the imp-97659 deep Route M gap-law residual local
 * decay-exponent ladder (q_local oscillating from -6.738 to +28.721 across p ~ 2e6 .. 9.9e7), with the
 * single negative rung (p ~ 2.39e7 -> 3.25e7, where the residual magnitude RISES with height) flagged.
 * Reuses IMP97659_LOCAL_EXPONENTS and IMP97659_AVERAGE_EXPONENT verbatim (no new computation,
 * no re-derivation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97659-route-m-gap-law-decay-extprec.js (source dps=30 deep ladder + local/average exponents)
 */

import { IMP97659_LOCAL_EXPONENTS, IMP97659_AVERAGE_EXPONENT } from './imp-97659-route-m-gap-law-decay-extprec.js';

// One row per consecutive-rung local exponent, tagging the single negative (residual-rises) rung.
export const IMP97694_EXPONENT_ROWS = Object.freeze(
  IMP97659_LOCAL_EXPONENTS.map((e, i) =>
    Object.freeze({
      key: `rung-${i}`,
      label: `${e.fromP} -> ${e.toP}`,
      fromP: e.fromP,
      toP: e.toP,
      qLocal: e.qLocal,
      residualRatio: e.residualRatio,
      isNegativeRung: e.qLocal < 0,
    }),
  ),
);

const NEGATIVE_ROW = IMP97694_EXPONENT_ROWS.find((r) => r.isNegativeRung);

export const IMP97694_SUMMARY = Object.freeze({
  averageExponent: IMP97659_AVERAGE_EXPONENT, // ~10.18
  qLocalMin: Math.min(...IMP97694_EXPONENT_ROWS.map((r) => r.qLocal)), // ~ -6.738
  qLocalMax: Math.max(...IMP97694_EXPONENT_ROWS.map((r) => r.qLocal)), // ~ +28.721
  negativeRungLabel: NEGATIVE_ROW ? NEGATIVE_ROW.label : null,
  reading:
    `Across the ${IMP97694_EXPONENT_ROWS.length} deep, precision-clean rungs (p ~ 2e6 .. 9.9e7), the local `
    + `decay exponent q in |residual| ~ C/(log p)^q swings from ${Math.min(...IMP97694_EXPONENT_ROWS.map((r) => r.qLocal)).toFixed(3)} `
    + `to ${Math.max(...IMP97694_EXPONENT_ROWS.map((r) => r.qLocal)).toFixed(3)}, including one NEGATIVE rung `
    + `(${NEGATIVE_ROW ? NEGATIVE_ROW.label : 'n/a'}) where the residual magnitude RISES with height instead of `
    + `falling. The average exponent over the full ladder is ~${IMP97659_AVERAGE_EXPONENT.toFixed(2)}, still far `
    + 'above the q=3 fixed-power reference. Neither a monotone climb nor a fixed power fits this oscillation --'
    + ' the fingerprint of the oscillating PNT/Mertens error.',
  verdict:
    'Presentation only: every local exponent, residual ratio, and average exponent is reused verbatim from '
    + 'imp-97659 (a measurement, not a derivation); no new computation. Changes no bound; MCM stays refuted '
    + 'from omega=11; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97694_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97694-ten-rows',
    description: 'exactly ten rung rows, matching the imp-97659 eleven-rung deep ladder',
    holds: () => IMP97694_EXPONENT_ROWS.length === 10,
  },
  {
    id: 'imp97694-exactly-one-negative-rung',
    description: 'exactly one rung has a negative local exponent',
    holds: () => IMP97694_EXPONENT_ROWS.filter((r) => r.isNegativeRung).length === 1,
  },
  {
    id: 'imp97694-negative-rung-matches-2p39e7-to-3p25e7',
    description: 'the flagged negative rung is the p ~ 2.39e7 -> 3.25e7 transition',
    holds: () => NEGATIVE_ROW !== undefined && NEGATIVE_ROW.fromP === 23879519 && NEGATIVE_ROW.toP === 32452843,
  },
  {
    id: 'imp97694-range-matches-imp97659-source',
    description: 'the min/max local exponent match the imp-97659 baked -6.738 .. +28.721 range',
    holds: () =>
      Math.abs(IMP97694_SUMMARY.qLocalMin - (-6.738)) < 0.01
      && Math.abs(IMP97694_SUMMARY.qLocalMax - 28.721) < 0.01,
  },
  {
    id: 'imp97694-average-exceeds-three',
    description: 'the average exponent exceeds the q=3 fixed-power reference',
    holds: () => IMP97694_SUMMARY.averageExponent > 3,
  },
  {
    id: 'imp97694-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97694_SUMMARY.verdict) && /NO QED/.test(IMP97694_SUMMARY.verdict),
  },
];

for (const assertion of IMP97694_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97694 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97694_SUMMARY;
