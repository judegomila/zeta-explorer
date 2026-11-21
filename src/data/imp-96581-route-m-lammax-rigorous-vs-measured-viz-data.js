/**
 * @module imp-96581-route-m-lammax-rigorous-vs-measured-viz-data
 *
 * imp-96581 (ux): import-light viz-data leaf for the imp-96548 Route M
 * lam_max(N) contrast between the rigorous, unconditional SPD
 * trace-domination upper bound lam_max(N) <= I(1,1) H_N (slope I(1,1) =
 * 1.2607) and the measured power-iteration fit lam_max = 3.0247 +
 * 0.3526 log N, which had FINDING 1/2 numbers but no chart.
 *
 * HONESTY NOTE on the two different "overstatement" numbers in play: the
 * imp-96548 module reports a ~1.58x figure, but that is the CEILING-N ratio
 * (measuredFitCeilingN / rigorousTraceCeilingN, IMP96548_CEILING), not the
 * ratio of the two lam_max curves' VALUES at N=6000. Recomputing the value
 * ratio directly from the same inputs gives rigorous(6000)/measured(6000)
 * = 11.6948 / 6.0924 =~ 1.92x, not 1.58x. Both numbers are correct
 * quantities from the same record; this module plots and labels each
 * distinctly rather than conflating them.
 *
 * MEASUREMENT / PRESENTATION ONLY. All curve inputs (I(1,1), gamma, the
 * fit coefficients, the ceiling ratio) are reused verbatim from
 * imp-96548; only the per-N ladder recompute and the relabeled N=6000
 * value ratio are new here. Changes no bound, establishes no operator
 * positivity, no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (source finding + inputs)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (same N=250..6000 ladder convention)
 *
 * Ticket: imp-96581 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96548_INPUTS,
  IMP96548_CEILING,
} from './imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js';

const { i11, gamma, measuredFitA, measuredFitB } = IMP96548_INPUTS;

const lamMaxRigorous = (N) => i11 * (Math.log(N) + gamma);
const lamMaxMeasured = (N) => measuredFitA + measuredFitB * Math.log(N);

// accessible N ladder, same convention as imp-96586's peer viz.
const NS = [250, 500, 1000, 2000, 3000, 4000, 5000, 6000];

export const IMP96581_LADDER = Object.freeze(
  NS.map((N) => {
    const rigorous = lamMaxRigorous(N);
    const measured = lamMaxMeasured(N);
    return Object.freeze({ N, rigorous, measured, valueRatio: rigorous / measured });
  }),
);

// FINDING 1 restated -- the slope gap (rigorous trace slope vs measured fit slope).
export const IMP96581_SLOPE_GAP = Object.freeze({
  rigorousSlope: i11,
  measuredSlope: measuredFitB,
  ratio: i11 / measuredFitB, // ~3.575 ("3.6x" in the ticket title)
});

// FINDING 2 restated -- the top accessible rung N=6000, with the two DISTINCT
// "overstatement" quantities kept separate (see module honesty note above).
const n6000 = IMP96581_LADDER[IMP96581_LADDER.length - 1];
export const IMP96581_N6000 = Object.freeze({
  N: n6000.N,
  rigorous: n6000.rigorous, // ~11.6948
  measured: n6000.measured, // ~6.0924
  valueOverstatementRatio: n6000.valueRatio, // ~1.92x -- ratio of the two CURVE VALUES at N=6000
  ceilingOverstatementRatio: IMP96548_CEILING.ratioMeasuredOverRigorous, // ~1.58x -- ratio of the two CEILING-N estimates (a different quantity)
  note:
    'valueOverstatementRatio (~1.92x) is the ratio of the rigorous and measured lam_max ' +
    'CURVES at N=6000; ceilingOverstatementRatio (~1.58x, from IMP96548_CEILING) is the ratio ' +
    'of the two resulting conditioning-ceiling N estimates. Both are correct but answer ' +
    'different questions -- they are not the same 1.58x, despite imp-96548 pairing 1.58x with ' +
    'the N=6000 rung in prose.',
});

export const IMP96581_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every ladder value is ' +
  'recomputed from the exact imp-96548 inputs (I(1,1), gamma, fit coefficients) verbatim, no ' +
  'new measurement. The rigorous curve is an unconditional SPD trace-domination upper bound; ' +
  'the measured curve is the non-rigorous imp-96443 power-iteration fit. No bound is claimed ' +
  'moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96581_ASSERTIONS = [
  {
    id: 'imp96581-ladder-is-eight-points-both-monotone-increasing',
    holds: () =>
      IMP96581_LADDER.length === 8 &&
      IMP96581_LADDER.every(
        (row, i) =>
          i === 0 ||
          (row.rigorous > IMP96581_LADDER[i - 1].rigorous &&
            row.measured > IMP96581_LADDER[i - 1].measured),
      ),
    why: 'both the rigorous trace bound and the measured fit are increasing log-shape curves over the accessible N=250..6000 ladder.',
  },
  {
    id: 'imp96581-n6000-matches-imp96548-jsdoc-figures',
    holds: () =>
      Math.abs(IMP96581_N6000.rigorous - 11.6948) < 1e-3 &&
      Math.abs(IMP96581_N6000.measured - 6.0924) < 1e-3,
    why: 'the N=6000 rung must reproduce the imp-96548 JSDoc figures (rigorous 11.6948, measured ~6.09) exactly.',
  },
  {
    id: 'imp96581-value-ratio-and-ceiling-ratio-are-distinct',
    holds: () =>
      IMP96581_N6000.valueOverstatementRatio > 1.8 &&
      IMP96581_N6000.valueOverstatementRatio < 2.0 &&
      IMP96581_N6000.ceilingOverstatementRatio > 1.4 &&
      IMP96581_N6000.ceilingOverstatementRatio < 1.8 &&
      Math.abs(IMP96581_N6000.valueOverstatementRatio - IMP96581_N6000.ceilingOverstatementRatio) > 0.2,
    why: 'the N=6000 curve-value ratio (~1.92x) and the ceiling-N ratio (~1.58x, IMP96548_CEILING) are genuinely different quantities from the same record; this assertion guards against silently conflating them.',
  },
  {
    id: 'imp96581-slope-gap-is-about-3point6x',
    holds: () => IMP96581_SLOPE_GAP.ratio > 3.4 && IMP96581_SLOPE_GAP.ratio < 3.7,
    why: 'the rigorous trace slope I(1,1)=1.2607 is ~3.6x the measured fit slope 0.3526, per imp-96548 FINDING 2.',
  },
  {
    id: 'imp96581-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96581_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96581_HONEST_BANNER) &&
      /NO QED/.test(IMP96581_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96581_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96581-route-m-lammax-rigorous-vs-measured-viz-data assertion failed: ${a.id}`,
    );
  }
}
