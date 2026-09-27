/**
 * @module imp-97812-tra2-ratio-ladder-viz-data
 *
 * imp-97812 (ux): import-light viz-data leaf charting the imp-97684 tr(A2) uniform-block
 * ratio ladder r1..r4 = d_{i+1}/d_i climbing monotonically toward 1 (0.687945 -> 0.717237 ->
 * 0.741517 -> 0.761970) with a DECELERATING increment -- the algebraic-tail signature, as
 * opposed to a flat ratio (which a geometric tail would require). Reuses the frozen
 * IMP97684_LADDER / IMP97684_UNIFORM_BLOCKS / IMP97684_EXTRAPOLATION values verbatim
 * (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97684-tra2-fifth-block-tail-confirmation.js (source module)
 */

import {
  IMP97684_LADDER,
  IMP97684_UNIFORM_BLOCKS,
  IMP97684_EXTRAPOLATION,
} from './imp-97684-tra2-fifth-block-tail-confirmation.js';

// One row per block-ratio step: the Kbig at which the "new" block ends, the ratio itself,
// and the increment toward 1 relative to the previous step (null for the first step).
export const IMP97812_RATIO_LADDER_ROWS = Object.freeze([
  Object.freeze({ step: 1, Kbig: 720, ratio: IMP97684_UNIFORM_BLOCKS.r1, driftFromPrev: null }),
  Object.freeze({
    step: 2,
    Kbig: 800,
    ratio: IMP97684_UNIFORM_BLOCKS.r2,
    driftFromPrev: IMP97684_UNIFORM_BLOCKS.r2 - IMP97684_UNIFORM_BLOCKS.r1,
  }),
  Object.freeze({
    step: 3,
    Kbig: 880,
    ratio: IMP97684_UNIFORM_BLOCKS.r3,
    driftFromPrev: IMP97684_UNIFORM_BLOCKS.ratioDrift32,
  }),
  Object.freeze({
    step: 4,
    Kbig: 960,
    ratio: IMP97684_UNIFORM_BLOCKS.r4,
    driftFromPrev: IMP97684_UNIFORM_BLOCKS.ratioDrift43,
  }),
]);

export const IMP97812_GEOMETRIC_LIMIT = IMP97684_EXTRAPOLATION.L_geom_newRatioFromK960;
export const IMP97812_ALGEBRAIC_LIMIT = IMP97684_EXTRAPOLATION.L_algebraic_newTrio;
export const IMP97812_LADDER = IMP97684_LADDER;

export const IMP97812_SUMMARY = Object.freeze({
  law:
    'The four uniform-block ratios r1..r4 rise monotonically toward 1 (0.687945, 0.717237, '
    + '0.741517, 0.761970) with a shrinking increment at every step (+0.029292, +0.024280, '
    + '+0.020453): a pure geometric tail needs a CONSTANT ratio (flat line), so the sustained '
    + 'climb with a decelerating drift is the signature of an algebraic (power-law) tail, not '
    + 'a geometric one.',
  reading:
    `r1(K=${IMP97812_RATIO_LADDER_ROWS[0].Kbig})=${IMP97812_RATIO_LADDER_ROWS[0].ratio.toFixed(6)}, `
    + `r2(K=${IMP97812_RATIO_LADDER_ROWS[1].Kbig})=${IMP97812_RATIO_LADDER_ROWS[1].ratio.toFixed(6)}, `
    + `r3(K=${IMP97812_RATIO_LADDER_ROWS[2].Kbig})=${IMP97812_RATIO_LADDER_ROWS[2].ratio.toFixed(6)}, `
    + `r4(K=${IMP97812_RATIO_LADDER_ROWS[3].Kbig})=${IMP97812_RATIO_LADDER_ROWS[3].ratio.toFixed(6)}. `
    + `Geometric extrapolation from r4 gives L~${(IMP97812_GEOMETRIC_LIMIT / 1e6).toFixed(3)}M; `
    + `the algebraic fit gives L~${(IMP97812_ALGEBRAIC_LIMIT / 1e6).toFixed(3)}M -- the two models `
    + 'agree to relative ~9e-7.',
  verdict:
    'Presentation only: every ratio, drift and extrapolated limit value is reused verbatim from '
    + 'imp-97684 (a measurement, not a derivation); no new computation. Conditional-share '
    + 'diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. '
    + 'Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains '
    + 'SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97812_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97812-four-rows',
    description: 'exactly four ratio-ladder rows (r1..r4)',
    holds: () => IMP97812_RATIO_LADDER_ROWS.length === 4,
  },
  {
    id: 'imp97812-ratios-monotone-toward-one',
    description: 'ratios strictly increase and stay below 1 at every step',
    holds: () =>
      IMP97812_RATIO_LADDER_ROWS.every((r, i) => r.ratio < 1 && (i === 0 || r.ratio > IMP97812_RATIO_LADDER_ROWS[i - 1].ratio)),
  },
  {
    id: 'imp97812-drift-decelerates',
    description: 'the positive increment toward 1 shrinks at every subsequent step',
    holds: () => {
      const drifts = IMP97812_RATIO_LADDER_ROWS.slice(1).map((r) => r.driftFromPrev);
      return drifts.every((d) => d > 0) && drifts.every((d, i) => i === 0 || d < drifts[i - 1]);
    },
  },
  {
    id: 'imp97812-extrapolators-agree',
    description: 'geometric and algebraic extrapolated limits agree to relative < 1e-4',
    holds: () =>
      Math.abs(IMP97812_GEOMETRIC_LIMIT - IMP97812_ALGEBRAIC_LIMIT) / IMP97812_ALGEBRAIC_LIMIT < 1e-4,
  },
  {
    id: 'imp97812-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97812_SUMMARY.verdict) && /NO QED/.test(IMP97812_SUMMARY.verdict),
  },
];

for (const assertion of IMP97812_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97812 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97812_SUMMARY;
