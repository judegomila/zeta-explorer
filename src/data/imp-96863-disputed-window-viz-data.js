/**
 * @module imp-96863-disputed-window-viz-data
 *
 * imp-96863 (ux): import-light viz-data leaf for the imp-96834 disputed-window
 * table -- the certified kmax=4 double-precision eps margin vs the N=36
 * Galerkin operator floor lambda_min(T_a[sigma_2]), across the four sampled
 * points 1.0 <= 2a <= 1.1316 (IMP96834_WINDOW imported directly, no
 * transcription).
 *
 * imp-96834 assembled the disputed-window table but shipped no
 * visualization: this module reshapes it into chart-ready rows plus a
 * banded classification (positive-margin room vs sign-flipped ceiling).
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96834-krein-certificate-degree-margin-assessment.js (source window + verdict)
 * @see imp-96779-route-m-ceiling-ladder-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96863 (ux, sonnet-4-6, small/low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96834_WINDOW, IMP96834_VERDICT } from './imp-96834-krein-certificate-degree-margin-assessment.js';

const LN3 = Math.log(3);

// Chart-ready rows, one per disputed-window sample point.
export const IMP96863_ROWS = Object.freeze(
  IMP96834_WINDOW.map((r) =>
    Object.freeze({
      twoA: r.twoA,
      label: Math.abs(r.twoA - LN3) < 1e-9 ? 'ln3' : r.twoA.toFixed(4),
      certifiedEpsKmax4: r.certifiedEpsKmax4,
      operatorFloorN36: r.operatorFloorN36,
      roomForRicherCertificate: r.roomForRicherCertificate,
      band: r.operatorFloorN36 > 0 ? 'positive-floor-room' : 'ceiling-sign-flipped',
    }),
  ),
);

export const IMP96863_VERDICT_SUMMARY = Object.freeze({
  epsWallIsIntrinsic: IMP96834_VERDICT.epsWallIsIntrinsic,
  operatorCeilingPositiveThroughLn3: IMP96834_VERDICT.operatorCeilingPositiveThroughLn3,
  operatorSignFlipTwoA: IMP96834_VERDICT.operatorSignFlipTwoA,
  answer: IMP96834_VERDICT.answer,
});

export const IMP96863_HONEST_BANNER =
  'No refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96863_ASSERTIONS = [
  {
    id: 'imp96863-four-rows-match-source-window',
    holds: () =>
      IMP96863_ROWS.length === IMP96834_WINDOW.length &&
      IMP96863_ROWS.every((row, i) => row.twoA === IMP96834_WINDOW[i].twoA),
    why: 'each viz row must correspond 1:1 to a source IMP96834_WINDOW entry, in the same order.',
  },
  {
    id: 'imp96863-ln3-row-labelled-and-positive-floor',
    holds: () => {
      const ln3Row = IMP96863_ROWS.find((r) => r.label === 'ln3');
      return ln3Row !== undefined && ln3Row.band === 'positive-floor-room' && ln3Row.operatorFloorN36 > 0;
    },
    why: 'the ln3 sample point must be labelled and classified in the positive-floor-room band, matching imp-96834 Finding 2.',
  },
  {
    id: 'imp96863-sign-flip-row-is-ceiling-band',
    holds: () => {
      const flipRow = IMP96863_ROWS.find((r) => Math.abs(r.twoA - 1.1316) < 1e-9);
      return flipRow !== undefined && flipRow.band === 'ceiling-sign-flipped' && flipRow.operatorFloorN36 < 0;
    },
    why: 'the 2a=1.1316 sample must fall in the sign-flipped ceiling band, matching the operator floor sign change reported in imp-96834.',
  },
  {
    id: 'imp96863-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96863_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96863_HONEST_BANNER) &&
      /NO QED/.test(IMP96863_HONEST_BANNER) &&
      IMP96863_VERDICT_SUMMARY.epsWallIsIntrinsic === false,
    why: 'every disputed-window viz surface carries the RH-open / PT-Lambda / NO-QED markers, matching the source verdict.',
  },
];

for (const a of IMP96863_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96863-disputed-window-viz-data assertion failed: ${a.id}`);
  }
}
