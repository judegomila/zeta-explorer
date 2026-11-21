/**
 * @module imp-124824-ecf-stencil-crossover-viz-data
 *
 * imp-124824: import-light viz-data leaf charting the imp-124769 E_CF finite-difference error decomposition
 * across the landmark ladder L2..L6: the clean O(eps^2) truncation power law (errCF(1e-3) falling
 * monotonically L2 -> L5), the landmark-bisection round-off floor R ~ 4.5e-13 reached at L5, and the pinned
 * crossover |E_CF|_crit ~ 1.4e-6 (sigma_crit ~ 0.013) between L5 and L6. Reuses the imp-124769 ladder verbatim
 * -- no new computation.
 *
 * PRESENTATION ONLY. Conditional-share diagnostic, NOT an RH bound; no bound moves; NO QED.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER, source ladder)
 */

import { IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER } from './imp-124769-ecf-stencil-noise-floor-crossover.js';

const SRC = IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER;

export const IMP124824_LADDER_ROWS = Object.freeze(
  SRC.ladder.map((r) =>
    Object.freeze({
      key: r.key,
      sigma: r.sigma,
      absE_CF: Math.abs(r.E_CF),
      errCF_at_1em3: r.errCF_at_1em3,
      relTrunc_at_1em3: r.relTrunc_at_1em3,
    })
  )
);

export const IMP124824_CROSSOVER = Object.freeze({
  E_CF_crit: SRC.crossover.E_CF_crit,
  sigma_crit: SRC.crossover.sigma_crit,
  bracket_low: 'L6',
  bracket_high: 'L5',
  roundoff_floor: SRC.roundoffFloor.R_abs,
  relTrunc_plateau: SRC.truncationPlateau.relTrunc_mean,
});

export const IMP124824_SUMMARY = Object.freeze({
  law:
    'The direct E_CF finite-difference error at the shared headline step eps=1e-3 falls monotonically across '
    + 'L2 -> L5 tracking a clean O(eps^2) truncation power law (relTrunc plateau ~'
    + `${IMP124824_CROSSOVER.relTrunc_plateau.toExponential(2)}), bottoms at the landmark-bisection round-off `
    + `floor R ~ ${IMP124824_CROSSOVER.roundoff_floor.toExponential(2)} at L5, then turns back up at L6. The `
    + `crossover where the two regimes meet is pinned at |E_CF|_crit ~ ${IMP124824_CROSSOVER.E_CF_crit.toExponential(2)} `
    + `(sigma_crit ~ ${IMP124824_CROSSOVER.sigma_crit.toExponential(2)}), strictly between L5 and L6.`,
  reading:
    IMP124824_LADDER_ROWS.map(
      (r) => `${r.key} (sigma=${r.sigma}): errCF(1e-3)=${r.errCF_at_1em3.toExponential(2)}, `
        + `relTrunc=${r.relTrunc_at_1em3.toExponential(2)}`
    ).join('; '),
  verdict:
    'Presentation only: every ladder value is reused verbatim from imp-124769; no new computation. '
    + 'Measurement/cross-validation on the inherited imp-3220/imp-3406 extrapolation, not a rigorous '
    + 'asymptotic; changes no bound; imp-3066 K_a >= 0 untouched; no refereed bound is changed; '
    + 'RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124824_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124824-five-rows',
    description: 'exactly five landmark rows (L2..L6)',
    holds: () => IMP124824_LADDER_ROWS.length === 5,
  },
  {
    id: 'imp124824-errCF-monotone-decreasing-L2-to-L5',
    description: 'errCF(1e-3) strictly decreases from L2 through L5',
    holds: () => {
      for (let i = 1; i < 4; i++) {
        if (IMP124824_LADDER_ROWS[i].errCF_at_1em3 >= IMP124824_LADDER_ROWS[i - 1].errCF_at_1em3) return false;
      }
      return true;
    },
  },
  {
    id: 'imp124824-errCF-turns-up-at-L6',
    description: 'errCF(1e-3) increases from L5 to L6 (round-off floor reached)',
    holds: () => IMP124824_LADDER_ROWS[4].errCF_at_1em3 > IMP124824_LADDER_ROWS[3].errCF_at_1em3,
  },
  {
    id: 'imp124824-crossover-brackets-L5-L6',
    description: '|E_CF|_crit lies strictly between the L6 and L5 |E_CF| magnitudes',
    holds: () =>
      IMP124824_CROSSOVER.E_CF_crit > IMP124824_LADDER_ROWS[4].absE_CF &&
      IMP124824_CROSSOVER.E_CF_crit < IMP124824_LADDER_ROWS[3].absE_CF,
  },
  {
    id: 'imp124824-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /changes no bound/.test(IMP124824_SUMMARY.verdict) && /NO QED/.test(IMP124824_SUMMARY.verdict),
  },
];

for (const assertion of IMP124824_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124824 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124824_SUMMARY;
