/**
 * @module imp-97671-gap-law-decay-exponent-viz-data
 *
 * imp-97671: import-light viz-data leaf charting the imp-97640 gap-law residual local-decay-exponent
 * ladder (q ~ 6.839 -> 8.713 -> 7.495) against the fixed-power q=2 and q=3 references, flagging the
 * precision-limited third rung. Reuses IMP97640_LOCAL_EXPONENTS verbatim (no re-derivation, no new
 * computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (IMP97640_LOCAL_EXPONENTS, IMP97640_RESIDUAL_LADDER)
 */

import { IMP97640_LOCAL_EXPONENTS, IMP97640_RESULTS } from './imp-97640-route-m-gap-law-residual-decay-exponent.js';

// One row per consecutive-rung local exponent, tagging the two precision-clean rungs vs the
// precision-limited third rung (residual ratio 1.25, see imp-97640 RESULT 3).
export const IMP97671_EXPONENT_ROWS = Object.freeze(
  IMP97640_LOCAL_EXPONENTS.map((e, i) =>
    Object.freeze({
      key: `rung-${i}`,
      label: `${e.fromP} -> ${e.toP}`,
      fromP: e.fromP,
      toP: e.toP,
      qLocal: e.qLocal,
      residualRatio: e.residualRatio,
      precisionLimited: e.residualRatio <= 5,
    })
  )
);

export const IMP97671_FIXED_POWER_REFERENCES = Object.freeze({ q2: 2, q3: 3 });

export const IMP97671_SUMMARY = Object.freeze({
  law:
    'The consecutive-rung local decay exponent of the imp-97619 gap-law residual (6.839, 8.713, 7.495) '
    + 'sits far above both fixed-power references q=2 and q=3 at every rung, and climbs on the two '
    + 'precision-clean rungs (6.839 -> 8.713); the third rung (7.495) is precision-limited by 7-sig-fig '
    + 'catastrophic cancellation and cannot confirm whether the climb continues.',
  reading:
    `Rung 1 (${IMP97671_EXPONENT_ROWS[0].label}): q=${IMP97671_EXPONENT_ROWS[0].qLocal.toFixed(3)} `
    + `(residual ratio ${IMP97671_EXPONENT_ROWS[0].residualRatio.toFixed(2)}, precision-clean). `
    + `Rung 2 (${IMP97671_EXPONENT_ROWS[1].label}): q=${IMP97671_EXPONENT_ROWS[1].qLocal.toFixed(3)} `
    + `(residual ratio ${IMP97671_EXPONENT_ROWS[1].residualRatio.toFixed(2)}, precision-clean). `
    + `Rung 3 (${IMP97671_EXPONENT_ROWS[2].label}): q=${IMP97671_EXPONENT_ROWS[2].qLocal.toFixed(3)} `
    + `(residual ratio ${IMP97671_EXPONENT_ROWS[2].residualRatio.toFixed(2)}, precision-limited past p~2e6). `
    + `Every rung exceeds both the q=2 and q=3 fixed-power references.`,
  verdict:
    'Presentation only: every local exponent and residual ratio is reused verbatim from imp-97640 (a '
    + 'measurement, not a derivation); no new computation. The precision-limited third rung is flagged, '
    + 'not resolved -- deciding the asymptotic exponent still needs an extended-precision (dps >= 30) '
    + 'recompute. Changes no bound; MCM stays refuted from omega=11; no refereed bound is changed'
    + '; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97671_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97671-three-rows',
    description: 'exactly three rung rows',
    holds: () => IMP97671_EXPONENT_ROWS.length === 3,
  },
  {
    id: 'imp97671-every-rung-exceeds-both-fixed-powers',
    description: 'every rung q exceeds both the q=2 and q=3 fixed-power references',
    holds: () =>
      IMP97671_EXPONENT_ROWS.every(
        (r) => r.qLocal > IMP97671_FIXED_POWER_REFERENCES.q2 && r.qLocal > IMP97671_FIXED_POWER_REFERENCES.q3
      ),
  },
  {
    id: 'imp97671-third-rung-flagged-precision-limited',
    description: 'the third rung is flagged precision-limited, the first two are not',
    holds: () =>
      IMP97671_EXPONENT_ROWS[0].precisionLimited === false
      && IMP97671_EXPONENT_ROWS[1].precisionLimited === false
      && IMP97671_EXPONENT_ROWS[2].precisionLimited === true,
  },
  {
    id: 'imp97671-values-match-imp97640-source',
    description: 'rung exponents match the imp-97640 baked results verbatim',
    holds: () =>
      Math.abs(IMP97671_EXPONENT_ROWS[0].qLocal - IMP97640_RESULTS.localExponents[0]) < 1e-9
      && Math.abs(IMP97671_EXPONENT_ROWS[1].qLocal - IMP97640_RESULTS.localExponents[1]) < 1e-9
      && Math.abs(IMP97671_EXPONENT_ROWS[2].qLocal - IMP97640_RESULTS.localExponents[2]) < 1e-9,
  },
  {
    id: 'imp97671-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97671_SUMMARY.verdict) && /NO QED/.test(IMP97671_SUMMARY.verdict),
  },
];

for (const assertion of IMP97671_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97671 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97671_SUMMARY;
