/**
 * @module imp-97745-fartail-diagnostic-asymptote-viz-data
 *
 * imp-97745: import-light viz-data leaf charting the imp-97723 far-tail diagnostic
 * (1/2 - p) * 2 log T0 climbing to EXACTLY 1 across N=1e18..1e300, overlaid with the exact
 * Riemann-von Mangoldt slope 1 - 1/log(T0/2pi) it converges to, plus the 0.99/0.995
 * crossing-height markers. Reuses IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE verbatim
 * (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js (diagLadder, crossings)
 */

import { IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE } from './imp-97723-sigma-fartail-diagnostic-asymptote-one.js';

const { diagLadder, crossings, diagnosticLimit } = IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE;

// One row per baked ladder rung: the measured diagnostic vs the exact RvM-slope overlay.
export const IMP97745_DIAGNOSTIC_ROWS = Object.freeze(
  diagLadder.map((r) =>
    Object.freeze({
      key: r.N,
      logN: Number(r.N.replace('1e', '')),
      diag: r.diag,
      slopeRvM: r.slopeRvM,
    })
  )
);

export const IMP97745_CROSSINGS = Object.freeze({
  target99: 0.99,
  target995: 0.995,
  log10N_99: crossings.reach_0p99_log10N,
  log10N_995: crossings.reach_0p995_log10N,
});

const FIRST_ROW = IMP97745_DIAGNOSTIC_ROWS[0];
const LAST_ROW = IMP97745_DIAGNOSTIC_ROWS[IMP97745_DIAGNOSTIC_ROWS.length - 1];

export const IMP97745_SUMMARY = Object.freeze({
  reading:
    `The imp-97723 far-tail diagnostic (1/2 - p) * 2 log T0 climbs monotonically from ` +
    `${FIRST_ROW.diag} at 1e${FIRST_ROW.logN} to ${LAST_ROW.diag} at 1e${LAST_ROW.logN}, ` +
    `tracking the exact RvM slope 1 - 1/log(T0/2pi) at every rung. It crosses 0.99 only near ` +
    `1e${IMP97745_CROSSINGS.log10N_99} and 0.995 only near 1e${IMP97745_CROSSINGS.log10N_995}, ` +
    `converging to exactly ${diagnosticLimit} but only logarithmically.`,
  verdict:
    'Presentation only: every diagnostic value, overlay value, and crossing height is reused ' +
    'verbatim from imp-97723 (a measurement / closed-form derivation, not a new computation). ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a ' +
    'rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; ' +
    'NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97745_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97745-eight-rows',
    description: 'exactly eight baked ladder rows (1e18..1e300)',
    holds: () => IMP97745_DIAGNOSTIC_ROWS.length === 8,
  },
  {
    id: 'imp97745-monotonically-climbing',
    description: 'the diag column climbs monotonically toward 1',
    holds: () => {
      for (let i = 1; i < IMP97745_DIAGNOSTIC_ROWS.length; i++) {
        if (!(IMP97745_DIAGNOSTIC_ROWS[i].diag > IMP97745_DIAGNOSTIC_ROWS[i - 1].diag)) return false;
      }
      return LAST_ROW.diag < 1 && LAST_ROW.diag > 0.998;
    },
  },
  {
    id: 'imp97745-crossings-fall-inside-domain',
    description: '0.99/0.995 crossing heights fall strictly between the first and last rungs',
    holds: () =>
      IMP97745_CROSSINGS.log10N_99 > FIRST_ROW.logN
      && IMP97745_CROSSINGS.log10N_99 < IMP97745_CROSSINGS.log10N_995
      && IMP97745_CROSSINGS.log10N_995 < LAST_ROW.logN,
  },
  {
    id: 'imp97745-values-match-imp97723-source',
    description: 'diag/slopeRvM values match the imp-97723 baked ladder verbatim',
    holds: () =>
      IMP97745_DIAGNOSTIC_ROWS.every((row, i) => {
        const src = diagLadder[i];
        return row.diag === src.diag && row.slopeRvM === src.slopeRvM;
      }),
  },
  {
    id: 'imp97745-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97745_SUMMARY.verdict) && /NO QED/.test(IMP97745_SUMMARY.verdict),
  },
];

for (const assertion of IMP97745_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97745 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97745_SUMMARY;
