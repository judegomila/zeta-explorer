/**
 * @module imp-97275-cq-subleading-drift-viz-data
 *
 * imp-97275 (ux): import-light viz-data leaf for the imp-97241 cQ sub-leading instability
 * (imp-97241-route-m-cq-subleading-finer-ladder.js), which had baked the pointwise-drift and
 * log-model tables but no chart-ready surface for either.
 *
 * Reshapes the baked imp-97241 IMP97241_POINTWISE rows (low-b cutoff bLo = 100..1000) into a
 * single chart-ready series tracking bLo against the drifting sub-leading constant cQ and the
 * flat leading slope s0, plus the IMP97241_THREE_PARAM rows annotated with a signFlip flag
 * marking where the log-model coefficient cL crosses zero. Together the two series illustrate
 * why the sub-leading constituent (B) = 2 cQ (zeta(2)-5/4) stays unpinned: cQ is not a
 * range-independent constant (it drifts monotonically), and adding a log term does not rescue
 * it (cL changes sign instead of converging).
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (bLo, s0, cQ, cL) value below is copied verbatim from
 * the imp-97241 baked IMP97241_POINTWISE / IMP97241_THREE_PARAM / IMP97241_WINDOW_LADDERS tables
 * (no re-derivation of the Vasyunin-kernel Q(b) ladder). Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97241-route-m-cq-subleading-finer-ladder.js (IMP97241_POINTWISE, IMP97241_THREE_PARAM, IMP97241_WINDOW_LADDERS, IMP97241_VERDICT)
 *
 * Ticket: imp-97275 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97241_POINTWISE,
  IMP97241_THREE_PARAM,
  IMP97241_WINDOW_LADDERS,
  IMP97241_COARSE,
  IMP97241_VERDICT,
} from './imp-97241-route-m-cq-subleading-finer-ladder.js';

// one row per pointwise cutoff, ascending bLo (100 -> 1000), with a derived "belowCoarse" flag
// marking rows whose cQ has already dropped past the coarse 4-window reference (-13.3841).
export const IMP97275_DRIFT_ROWS = IMP97241_POINTWISE.map((row) => ({
  ...row,
  belowCoarseRef: row.cQ < IMP97241_COARSE.cQ,
}));

// one row per three-parameter fit cutoff, with a derived sign relative to the first (bLo=100) row.
const firstCLSign = Math.sign(IMP97241_THREE_PARAM[0].cL);
export const IMP97275_LOG_MODEL_ROWS = IMP97241_THREE_PARAM.map((row) => ({
  ...row,
  clSignFlipped: Math.sign(row.cL) !== firstCLSign,
}));

export const IMP97275_ASYMPTOTES = Object.freeze({
  coarseCQRef: IMP97241_COARSE.cQ, // -13.3841, the imp-97207 4-window reference
  coarseS0Ref: IMP97241_COARSE.s0, // 1.7626
  windowLadderBand: Object.freeze({
    cQmin: Math.min(...IMP97241_WINDOW_LADDERS.map((w) => w.cQ)), // -15.5124
    cQmax: Math.max(...IMP97241_WINDOW_LADDERS.map((w) => w.cQ)), // -14.1288
  }),
  s0StableBand: Object.freeze({
    lo: Math.min(...IMP97241_POINTWISE.map((r) => r.s0)), // 1.76567
    hi: Math.max(...IMP97241_POINTWISE.map((r) => r.s0)), // 1.77647
  }),
  cQDriftBand: Object.freeze({
    atBLo100: IMP97241_POINTWISE[0].cQ, // -14.2749
    atBLo1000: IMP97241_POINTWISE[IMP97241_POINTWISE.length - 1].cQ, // -28.1633
  }),
});

export const IMP97275_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (bLo, s0, cQ, cL) row is ' +
  'copied verbatim from the imp-97241 baked IMP97241_POINTWISE / IMP97241_THREE_PARAM tables (no ' +
  're-derivation of the Vasyunin-kernel Q(b) ladder); no bound is claimed and no operator positivity ' +
  'is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97275_ASSERTIONS = [
  {
    id: 'imp97275-six-drift-rows-present',
    holds: () => IMP97275_DRIFT_ROWS.length === 6,
    why: 'imp-97241 measures the pointwise cQ drift at exactly six low-b cutoffs (bLo=100..1000).',
  },
  {
    id: 'imp97275-ascending-blo-order',
    holds: () =>
      IMP97275_DRIFT_ROWS.every((r, i) => i === 0 || r.bLo > IMP97275_DRIFT_ROWS[i - 1].bLo),
    why: 'the pointwise-drift rows are sorted ascending by low-b cutoff for chart rendering.',
  },
  {
    id: 'imp97275-cq-drifts-monotonically-below-coarse',
    holds: () =>
      IMP97275_DRIFT_ROWS.every((r, i) => i === 0 || r.cQ <= IMP97275_DRIFT_ROWS[i - 1].cQ) &&
      IMP97275_DRIFT_ROWS.every((r) => r.belowCoarseRef === true),
    why: 'cQ must drift monotonically downward with the cutoff, already below the coarse -13.3841 ' +
      'reference at the first cutoff (bLo=100, cQ=-14.27) and further below at every later cutoff.',
  },
  {
    id: 'imp97275-s0-stays-flat',
    holds: () =>
      IMP97275_ASYMPTOTES.s0StableBand.hi - IMP97275_ASYMPTOTES.s0StableBand.lo < 0.02,
    why: 'the leading slope s0 must stay within a tight band (<0.02 spread) across all cutoffs, ' +
      'in contrast to the wide cQ drift -- the key contrast the chart is built to show.',
  },
  {
    id: 'imp97275-log-model-sign-flips',
    holds: () =>
      IMP97275_LOG_MODEL_ROWS.some((r) => r.clSignFlipped) &&
      IMP97275_LOG_MODEL_ROWS[0].clSignFlipped === false,
    why: 'the three-parameter log-model coefficient cL must flip sign relative to the first ' +
      '(bLo=100) row at some later cutoff, confirming the log model is unstable, not merely noisy.',
  },
  {
    id: 'imp97275-asymptotes-match-source',
    holds: () =>
      Math.abs(IMP97275_ASYMPTOTES.coarseCQRef - IMP97241_COARSE.cQ) < 1e-9 &&
      Math.abs(IMP97275_ASYMPTOTES.windowLadderBand.cQmin - (-15.5124)) < 1e-6 &&
      Math.abs(IMP97275_ASYMPTOTES.windowLadderBand.cQmax - (-14.1288)) < 1e-6,
    why: 'the derived asymptotes must match the imp-97241 baked coarse reference and window-ladder ' +
      'band exactly.',
  },
  {
    id: 'imp97275-verdict-cross-check',
    holds: () =>
      IMP97241_VERDICT.cQPinned === false &&
      IMP97241_VERDICT.pointwiseDrifts === true &&
      IMP97241_VERDICT.logModelUnstable === true &&
      IMP97241_VERDICT.exactValuePinned === false,
    why: 'the viz leaf must agree with the source imp-97241 verdict flags: cQ not pinned, ' +
      'pointwise drift confirmed, log model unstable.',
  },
  {
    id: 'imp97275-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97275_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97275_HONEST_BANNER) &&
      /NO QED/.test(IMP97275_HONEST_BANNER),
    why: 'every Route-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97275_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97275-cq-subleading-drift-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  driftRows: IMP97275_DRIFT_ROWS,
  logModelRows: IMP97275_LOG_MODEL_ROWS,
  asymptotes: IMP97275_ASYMPTOTES,
  banner: IMP97275_HONEST_BANNER,
};
