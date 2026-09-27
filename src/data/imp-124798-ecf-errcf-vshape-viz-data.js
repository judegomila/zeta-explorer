/**
 * @module imp-124798-ecf-errcf-vshape-viz-data
 *
 * imp-124798: import-light viz-data leaf charting the imp-124769 direct-E_CF finite-difference error
 * errCF(eps=1e-3) across the landmark ladder L2..L6 as a V-shape: it falls monotonically L2 -> L5
 * (clean O(eps^2) truncation power law) then turns back UP at L6 (landmark-bisection round-off floor
 * overtakes truncation). Reuses the frozen IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.ladder rows
 * verbatim (no re-derivation, no new computation) for an "errCF(1e-3) vs landmark" log chart split
 * into the two regimes either side of the L5 bottom.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (source module; the crossover pin)
 */

import { IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER } from './imp-124769-ecf-stencil-noise-floor-crossover.js';

const ROWS = IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.ladder;
const BOTTOM_KEY = IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.roundoffFloor.reached_at; // 'L5'
const BOTTOM_INDEX = ROWS.findIndex((r) => r.key === BOTTOM_KEY);

// One chart row per landmark: errCF(1e-3) tagged by which side of the V-shape bottom it sits on.
export const IMP124798_ERRCF_VSHAPE = Object.freeze(
  ROWS.map((r, i) => Object.freeze({
    key: r.key,
    sigma: r.sigma,
    errCF_at_1em3: r.errCF_at_1em3,
    regime: i < BOTTOM_INDEX ? 'truncation' : i === BOTTOM_INDEX ? 'bottom' : 'round-off',
  })),
);

export const IMP124798_SUMMARY = Object.freeze({
  law:
    `errCF(1e-3) falls monotonically ${ROWS.slice(0, BOTTOM_INDEX + 1).map((r) => r.key).join(' -> ')} `
    + `(${ROWS.slice(0, BOTTOM_INDEX + 1).map((r) => r.errCF_at_1em3.toExponential(2)).join(' -> ')}), tracking `
    + 'a clean O(eps^2) truncation power law, bottoms at the landmark-bisection round-off floor at '
    + `${BOTTOM_KEY}, then turns back UP at ${ROWS[BOTTOM_INDEX + 1].key} `
    + `(${ROWS[BOTTOM_INDEX + 1].errCF_at_1em3.toExponential(2)}): a V-shape in errCF(1e-3) vs landmark.`,
  crossover: IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.crossover,
  verdict:
    'Presentation only: every row is reused verbatim from imp-124769 (a measurement, not a derivation), '
    + 'relabeled and split into truncation / bottom / round-off regimes for an "errCF(1e-3) vs landmark" '
    + 'V-shape chart. The upturn past the bottom is a stencil / round-off artefact of the shared eps=1e-3 '
    + 'headline step, NOT a deviation from the closed-form E_CF reconstruction. No new computation. '
    + 'Measurement / sensitivity only on the inherited imp-3220/imp-3406 extrapolation surrogate, not a '
    + 'rigorous asymptotic. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 '
    + 'remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124798_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124798-five-rows',
    description: 'one chart row per landmark L2..L6',
    holds: () => IMP124798_ERRCF_VSHAPE.length === 5,
  },
  {
    id: 'imp124798-bottom-is-L5',
    description: 'the V-shape bottom is tagged at L5',
    holds: () => IMP124798_ERRCF_VSHAPE.find((r) => r.regime === 'bottom')?.key === 'L5',
  },
  {
    id: 'imp124798-truncation-regime-decreasing',
    description: 'errCF(1e-3) strictly decreases across the truncation + bottom rows (L2 -> L5)',
    holds: () =>
      IMP124798_ERRCF_VSHAPE.slice(0, BOTTOM_INDEX + 1).every(
        (row, i) => i === 0 || row.errCF_at_1em3 < IMP124798_ERRCF_VSHAPE[i - 1].errCF_at_1em3,
      ),
  },
  {
    id: 'imp124798-roundoff-regime-turns-up',
    description: 'errCF(1e-3) increases past the bottom (L6 > L5), confirming the V-shape',
    holds: () =>
      IMP124798_ERRCF_VSHAPE.filter((r) => r.regime === 'round-off')
        .every((row) => row.errCF_at_1em3 > IMP124798_ERRCF_VSHAPE[BOTTOM_INDEX].errCF_at_1em3),
  },
  {
    id: 'imp124798-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124798_SUMMARY.verdict) && /NO QED/.test(IMP124798_SUMMARY.verdict),
  },
];

for (const assertion of IMP124798_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124798 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124798_SUMMARY;
