/**
 * @module imp-97729-fartail-residual-twopiece-crossover-viz-data
 *
 * imp-97729: import-light viz-data leaf charting the imp-97702 far-tail residual two-piece
 * split -- the power-law piece (1/2)sigma vs the logarithmic piece a(1-sigma) across
 * N = 1e12..1e15, their crossover at N ~ 3.553e12 (log10 N ~ 12.551), and the deep-tail
 * diagnostic (1/2 - p) * 2 log T0 settling to ~0.98 out to 1e24. Reuses
 * IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW verbatim (no re-derivation, no new
 * computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw.js (ladder, crossover, logAsymptote)
 */

import { IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW } from './imp-97702-sigma-fartail-exponent-residual-half-loglaw.js';

const { ladder, crossover, logAsymptote } = IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW;

// One row per baked ladder rung: the two residual pieces, reused verbatim.
export const IMP97729_PIECE_ROWS = Object.freeze(
  ladder.map((r) =>
    Object.freeze({
      key: r.N,
      logN: Number(r.N.replace('1e', '')),
      powerLawPiece: r.powerLawPiece,
      logPiece: r.logPiece,
    })
  )
);

export const IMP97729_CROSSOVER = Object.freeze({
  N: crossover.N,
  log10N: crossover.log10N,
});

// The deep-tail asymptote readings: (1/2-p)*2 log T0 at 1e15/1e18/1e24, reused verbatim.
export const IMP97729_ASYMPTOTE_ROWS = Object.freeze(
  Object.entries(logAsymptote.resid_times_2logT0).map(([key, value]) =>
    Object.freeze({
      key,
      logN: Number(key.replace('at_1e', '')),
      value,
    })
  )
);

const FIRST_ROW = IMP97729_PIECE_ROWS[0];
const LAST_ROW = IMP97729_PIECE_ROWS[IMP97729_PIECE_ROWS.length - 1];
const LAST_ASYMPTOTE = IMP97729_ASYMPTOTE_ROWS[IMP97729_ASYMPTOTE_ROWS.length - 1];

export const IMP97729_SUMMARY = Object.freeze({
  reading:
    `The imp-97702 residual splits into a power-law piece (1/2)sigma falling from ` +
    `${FIRST_ROW.powerLawPiece} at 1e${FIRST_ROW.logN} to ${LAST_ROW.powerLawPiece} at ` +
    `1e${LAST_ROW.logN} (~27x over three decades) and a nearly-flat logarithmic piece ` +
    `a(1-sigma) moving only from ${FIRST_ROW.logPiece} to ${LAST_ROW.logPiece}. The two pieces ` +
    `cross at N ~ ${IMP97729_CROSSOVER.N} (log10 N ~ ${IMP97729_CROSSOVER.log10N}); past it the ` +
    `logarithmic piece dominates and the deep-tail diagnostic (1/2 - p) * 2 log T0 settles to ` +
    `~${LAST_ASYMPTOTE.value} by 1e${LAST_ASYMPTOTE.logN}.`,
  verdict:
    'Presentation only: every piece value, crossover height, and asymptote reading is reused ' +
    'verbatim from imp-97702 (a measurement/decomposition, not a new computation). ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a ' +
    'rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; ' +
    'NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97729_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97729-four-piece-rows',
    description: 'exactly four baked ladder rows (1e12..1e15)',
    holds: () =>
      IMP97729_PIECE_ROWS.length === 4 &&
      FIRST_ROW.logN === 12 &&
      LAST_ROW.logN === 15,
  },
  {
    id: 'imp97729-powerlaw-falls-log-flat',
    description: 'power piece falls > 20x over [1e12,1e15]; log piece changes < 20% over the same span',
    holds: () =>
      FIRST_ROW.powerLawPiece / LAST_ROW.powerLawPiece > 20 &&
      Math.abs(LAST_ROW.logPiece / FIRST_ROW.logPiece - 1) < 0.2 &&
      LAST_ROW.powerLawPiece < LAST_ROW.logPiece,
  },
  {
    id: 'imp97729-crossover-within-domain',
    description: 'the crossover N falls strictly inside the [1e12,1e15] ladder domain',
    holds: () =>
      IMP97729_CROSSOVER.N > Math.pow(10, FIRST_ROW.logN) &&
      IMP97729_CROSSOVER.N < Math.pow(10, LAST_ROW.logN) &&
      IMP97729_CROSSOVER.log10N > FIRST_ROW.logN &&
      IMP97729_CROSSOVER.log10N < LAST_ROW.logN,
  },
  {
    id: 'imp97729-asymptote-rows-settle-near-one',
    description: 'the three deep-tail asymptote rows (1e15/1e18/1e24) all sit within 0.1 of 1',
    holds: () =>
      IMP97729_ASYMPTOTE_ROWS.length === 3 &&
      IMP97729_ASYMPTOTE_ROWS.every((r) => Math.abs(r.value - 1) < 0.1) &&
      Math.abs(LAST_ASYMPTOTE.value - 0.981) < 1e-3,
  },
  {
    id: 'imp97729-values-match-imp97702-source',
    description: 'piece and asymptote values match the imp-97702 baked ladder verbatim',
    holds: () =>
      IMP97729_PIECE_ROWS.every((row, i) => {
        const src = ladder[i];
        return row.powerLawPiece === src.powerLawPiece && row.logPiece === src.logPiece;
      }),
  },
  {
    id: 'imp97729-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97729_SUMMARY.verdict) && /NO QED/.test(IMP97729_SUMMARY.verdict),
  },
];

for (const assertion of IMP97729_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97729 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97729_SUMMARY;
