/**
 * @module imp-97508-mcm-baseterm-extprec-viz-data
 *
 * imp-97508 (ux): import-light viz-data leaf visualizing the imp-97478
 * extended-precision (40 dps) re-evaluation of the level-1 MCM base term
 *     c(x) = h(x) - h(2x)
 * against its closed-form two-term decay law (1/24)(ln x)/x + M0/x, and the
 * scaled quantity c*x/ln x = K0 + M0/ln x drifting down toward K0 = 1/24.
 *
 * PRESENTATION ONLY. Every point is the imp-97478 IMP97478_MEASUREMENTS.ladder
 * baked extended-precision row, reused verbatim. Establishes no operator
 * positivity; changes no bound; the x=5e5 "blip" is confirmed a
 * double-precision artifact (not charted as a reversal); kappa_arith
 * unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97478-route-m-mcm-level1-baseterm-extprec.js (the baked extended-precision ladder, closed form, and verdict)
 *
 * Ticket: imp-97508 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97478_MEASUREMENTS,
  IMP97478_VERDICT,
  IMP97478_HONEST_BANNER,
} from './imp-97478-route-m-mcm-level1-baseterm-extprec.js';

const K0 = IMP97478_MEASUREMENTS.leadingCoeff; // 1/24
const M0 = IMP97478_MEASUREMENTS.constOverXCoeff; // 0.095496...

export const IMP97508_CURVE = Object.freeze(
  IMP97478_MEASUREMENTS.ladder.map((row) =>
    Object.freeze({
      x: row.x,
      c: row.c,
      pred: row.pred,
      scaled: row.scaled,
    }),
  ),
);

export const IMP97508_ASYMPTOTE = Object.freeze({
  K0,
  M0,
  label: 'K0 = 1/24 = 0.041667',
});

export const IMP97508_WINDOW_TOP = Object.freeze({
  x: IMP97478_MEASUREMENTS.windowTopCorrection.x,
  c: IMP97478_MEASUREMENTS.windowTopCorrection.extendedPrecision,
  correctedFrom: IMP97478_MEASUREMENTS.windowTopCorrection.doublePrecisionBaked,
});

export const IMP97508_BLIP = Object.freeze({
  x: 500000,
  doublePrecisionClaim: IMP97478_MEASUREMENTS.blipAt5e5.doublePrecisionClaim,
  extendedPrecision: IMP97478_MEASUREMENTS.blipAt5e5.extendedPrecision,
  isArtifact: IMP97478_MEASUREMENTS.blipAt5e5.isArtifact,
});

export const IMP97508_VERDICT = Object.freeze({
  ticket: 'imp-97508',
  sourceTicket: 'imp-97478',
  claim:
    'charts the imp-97478 extended-precision (40 dps) level-1 MCM base term c(x)=h(x)-h(2x) against its closed-form ' +
    'two-term law (1/24)(ln x)/x + M0/x (max relative deviation 1.08e-10), and the scaled c*x/ln x drifting down ' +
    'toward K0=1/24=0.041667, with the corrected window-top point c(457015)=1.397144e-6 and the refuted x=5e5 ' +
    '"blip" (true value 1.284522e-6, monotone) annotated.',
  pointsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97508_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97508_ASSERTIONS = [
  {
    id: 'imp97508-curve-nonempty-and-matches-source-ladder',
    holds: () =>
      IMP97508_CURVE.length === IMP97478_MEASUREMENTS.ladder.length &&
      IMP97508_CURVE.every((pt, i) => pt.x === IMP97478_MEASUREMENTS.ladder[i].x && pt.c === IMP97478_MEASUREMENTS.ladder[i].c),
    why: 'the charted curve must reuse the imp-97478 baked extended-precision ladder verbatim, point for point.',
  },
  {
    id: 'imp97508-curve-strictly-positive-monotone-decreasing',
    holds: () => {
      let prev = Infinity;
      for (const pt of IMP97508_CURVE) {
        if (!(pt.c > 0)) return false;
        if (!(pt.c < prev)) return false;
        prev = pt.c;
      }
      return true;
    },
    why: 'the base term c(x) is strictly positive and strictly decreasing across the whole extended ladder (imp-97478 RESULT 2), so the charted curve must be too.',
  },
  {
    id: 'imp97508-scaled-drifts-toward-K0-from-above',
    holds: () => {
      const scaledVals = IMP97508_CURVE.map((pt) => pt.scaled);
      if (!scaledVals.every((s) => s > K0)) return false;
      for (let i = 1; i < scaledVals.length; i++) {
        if (!(scaledVals[i] < scaledVals[i - 1])) return false;
      }
      return true;
    },
    why: 'the scaled quantity c*x/ln x = K0 + M0/ln x must sit strictly above K0 and drift monotonically down toward it (M0>0, ln x increasing).',
  },
  {
    id: 'imp97508-blip-is-artifact-and-window-top-corrected',
    holds: () =>
      IMP97508_BLIP.isArtifact === true &&
      IMP97508_BLIP.extendedPrecision < IMP97508_BLIP.doublePrecisionClaim &&
      IMP97508_WINDOW_TOP.c < IMP97508_WINDOW_TOP.correctedFrom,
    why: 'the x=5e5 double-precision blip is refuted (extended value strictly below the falsely-reported rise) and the window-top value is corrected downward, per imp-97478 RESULT 1 and RESULT 4.',
  },
  {
    id: 'imp97508-measurement-only-no-qed',
    holds: () =>
      IMP97508_VERDICT.pointsReusedVerbatim === true &&
      IMP97508_VERDICT.operatorPositivityProved === false &&
      IMP97508_VERDICT.boundMoves === false &&
      IMP97508_VERDICT.qed === false &&
      IMP97478_VERDICT.qed === false &&
      /NO QED/.test(IMP97478_HONEST_BANNER),
    why: 'presentation only: points reused verbatim from imp-97478; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97508_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97508-mcm-baseterm-extprec-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
