/**
 * @module imp-124796-route-m-decay-exponent-climb-viz-data
 *
 * imp-124796: import-light viz-data leaf charting the imp-97640 RESULT 1/2 local decay exponent q
 * CLIMBING along the Route M gap-law residual ladder (q = 6.839 -> 8.713 -> 7.495 across p = 7919 ->
 * 104729 -> 1299709 -> 1999993), together with the two scaled-residual overlay columns
 * |residual|*log^2 p and |residual|*log^3 p that both STRICTLY DECREASE -- the signature that the
 * residual outruns every fixed inverse power of log p. Reuses the frozen imp-97640 exports verbatim
 * (no new computation) for a "q vs height" + "scaled column vs height" chart.
 *
 * PRESENTATION ONLY. No new computation; MCM stays refuted from omega=11; RH open; NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (source module)
 */

import {
  IMP97640_RESIDUAL_LADDER,
  IMP97640_LOCAL_EXPONENTS,
} from './imp-97640-route-m-gap-law-residual-decay-exponent.js';

// One chart row per consecutive-rung local exponent: q climbing against the "to" height of the rung.
export const IMP124796_Q_VS_HEIGHT = Object.freeze(
  IMP97640_LOCAL_EXPONENTS.map((e) => Object.freeze({
    fromP: e.fromP,
    toP: e.toP,
    qLocal: e.qLocal,
    residualRatio: e.residualRatio,
  })),
);

// One chart row per ladder point: the two scaled-residual overlay columns (1/log^2 and 1/log^3 test).
export const IMP124796_SCALED_COLUMNS_VS_HEIGHT = Object.freeze(
  IMP97640_RESIDUAL_LADDER.map((row) => Object.freeze({
    pOmega: row.pOmega,
    absResidual: Math.abs(row.residual),
    absResidualTimesLog2: Math.abs(row.residual) * Math.log(row.pOmega) ** 2,
    absResidualTimesLog3: Math.abs(row.residual) * Math.log(row.pOmega) ** 3,
  })),
);

export const IMP124796_SUMMARY = Object.freeze({
  law:
    'The imp-97640 local decay exponent q CLIMBS on the two precision-clean rungs '
    + `(${IMP124796_Q_VS_HEIGHT[0].qLocal.toFixed(3)} -> ${IMP124796_Q_VS_HEIGHT[1].qLocal.toFixed(3)}), while both `
    + 'scaled overlay columns |residual|*log^2 p and |residual|*log^3 p strictly decrease along the ladder -- '
    + 'no fixed inverse power of log p saturates.',
  reading:
    `q: ${IMP124796_Q_VS_HEIGHT.map((r) => r.qLocal.toFixed(3)).join(' -> ')}; `
    + `|res|*log^2: ${IMP124796_SCALED_COLUMNS_VS_HEIGHT.map((r) => r.absResidualTimesLog2.toExponential(3)).join(' -> ')}; `
    + `|res|*log^3: ${IMP124796_SCALED_COLUMNS_VS_HEIGHT.map((r) => r.absResidualTimesLog3.toExponential(3)).join(' -> ')}.`,
  verdict:
    'Presentation only: every row is reused verbatim from imp-97640 exports (a measurement, not a '
    + 'derivation), relabeled for a "q vs height" chart plus the two 1/log^2 and 1/log^3 scaled-column '
    + 'overlays. No new computation. MCM stays refuted from omega=11; no bound moves; PT Lambda <= 0.2 '
    + 'remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124796_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124796-three-exponent-rows',
    description: 'one chart row per consecutive-rung local exponent (three rungs across the four-point ladder)',
    holds: () => IMP124796_Q_VS_HEIGHT.length === 3,
  },
  {
    id: 'imp124796-four-scaled-column-rows',
    description: 'one chart row per ladder point (four points)',
    holds: () => IMP124796_SCALED_COLUMNS_VS_HEIGHT.length === 4,
  },
  {
    id: 'imp124796-q-climbs-on-clean-rungs',
    description: 'the local exponent climbs on the first two (precision-clean) rungs',
    holds: () => IMP124796_Q_VS_HEIGHT[1].qLocal > IMP124796_Q_VS_HEIGHT[0].qLocal,
  },
  {
    id: 'imp124796-scaled-columns-strictly-decrease',
    description: 'both |res|*log^2 p and |res|*log^3 p columns strictly decrease along the ladder',
    holds: () =>
      IMP124796_SCALED_COLUMNS_VS_HEIGHT.every(
        (row, i) => i === 0
          || (row.absResidualTimesLog2 < IMP124796_SCALED_COLUMNS_VS_HEIGHT[i - 1].absResidualTimesLog2
            && row.absResidualTimesLog3 < IMP124796_SCALED_COLUMNS_VS_HEIGHT[i - 1].absResidualTimesLog3),
      ),
  },
  {
    id: 'imp124796-every-exponent-exceeds-three',
    description: 'every local exponent exceeds 3 (faster than 1/log^3)',
    holds: () => IMP124796_Q_VS_HEIGHT.every((r) => r.qLocal > 3),
  },
  {
    id: 'imp124796-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124796_SUMMARY.verdict) && /NO QED/.test(IMP124796_SUMMARY.verdict),
  },
];

for (const assertion of IMP124796_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124796 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124796_SUMMARY;
