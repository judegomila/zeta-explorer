/**
 * @module imp-124778-knee-eflow-amplification-grid-robustness-viz-data
 *
 * imp-124778: import-light viz-data leaf charting the imp-97805 knee E_flow amplification A ~ 9.5
 * grid-robustness -- the PPD sweep converging to ~9.54 and the bracket-width sweep spanning the
 * 9.54..10.11 band -- for an "A vs grid knob" chart. Reuses the frozen IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO
 * ppdSweep/widthSweep/gridBand rows verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97805-knee-eflow-amplification-ratio.js (source module)
 * @see imp-97804-knee-eflow-linear-expansion.js (closed-form A ~ 9.4 this measurement confirms)
 */

import { IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO } from './imp-97805-knee-eflow-amplification-ratio.js';

const { ppdSweep, widthSweep, gridBand, baseline } = IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO;

// PPD-refinement robustness: A vs points-per-decade, converging to the fine-grid limit.
export const IMP124778_PPD_ROBUSTNESS = Object.freeze(
  ppdSweep.map((r) => Object.freeze({ PPD: r.PPD, A: r.A, A_ppd_refined_limit: gridBand.A_ppd_refined_limit })),
);

// Bracket-width robustness: A vs quarter-decade bracket width W (null at the degenerate W=0.5 rung).
export const IMP124778_WIDTH_ROBUSTNESS = Object.freeze(
  widthSweep.map((r) => Object.freeze({ W: r.W, A: r.A })),
);

export const IMP124778_SUMMARY = Object.freeze({
  law:
    'The imp-97805 knee-to-crossover E_flow amplification A is O(10) (not the ~1000x heuristic), and is '
    + `grid-robust: at the baseline grid (W=${baseline.W}, PPD=${baseline.PPD}) A ~ ${baseline.A}, PPD `
    + `refinement (PPD >= 40) converges A to ~${gridBand.A_ppd_refined_limit}, and the only material grid `
    + `knob is the bracket width W, spanning [${gridBand.A_min}, ${gridBand.A_max}] across the usable window.`,
  reading:
    `PPD sweep A: ${IMP124778_PPD_ROBUSTNESS.map((r) => `${r.PPD}->${r.A}`).join(', ')}; `
    + `width sweep A: ${IMP124778_WIDTH_ROBUSTNESS.map((r) => `${r.W}->${r.A === null ? 'degenerate' : r.A}`).join(', ')}.`,
  verdict:
    'Presentation only: every point is reused verbatim from imp-97805 (a measurement, not a derivation), '
    + 're-shaped into two grid-robustness series (A vs PPD, A vs bracket width) for a chart; no new '
    + 'computation. Measurement / sensitivity only on the inherited imp-3220/imp-3406 extrapolation '
    + 'surrogate, not a rigorous asymptotic. Changes no bound; establishes no operator positivity; '
    + 'C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; Platt-Trudgian Lambda <= '
    + '0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124778_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124778-six-ppd-rows',
    description: 'one PPD-robustness row per imp-97805 ppdSweep entry (PPD in 20,30,40,60,80,120)',
    holds: () => IMP124778_PPD_ROBUSTNESS.length === 6,
  },
  {
    id: 'imp124778-four-width-rows',
    description: 'one width-robustness row per imp-97805 widthSweep entry (W in 0.20,0.25,1/3,0.5)',
    holds: () => IMP124778_WIDTH_ROBUSTNESS.length === 4,
  },
  {
    id: 'imp124778-ppd-fine-grid-converges',
    description: 'PPD >= 40 rows all sit within 0.05 of the refined limit (~9.54)',
    holds: () =>
      IMP124778_PPD_ROBUSTNESS.filter((r) => r.PPD >= 40).every(
        (r) => Math.abs(r.A - r.A_ppd_refined_limit) < 0.05,
      ),
  },
  {
    id: 'imp124778-width-half-degenerate',
    description: 'the W=0.5 rung is degenerate (A === null, no knee resolved)',
    holds: () => IMP124778_WIDTH_ROBUSTNESS.find((r) => r.W === 0.5).A === null,
  },
  {
    id: 'imp124778-width-band-matches-source',
    description: 'usable-window width rows stay within the imp-97805 gridBand [A_min, A_max]',
    holds: () =>
      IMP124778_WIDTH_ROBUSTNESS.filter((r) => r.A !== null).every(
        (r) => r.A >= gridBand.A_min - 1e-9 && r.A <= gridBand.A_max + 1e-9,
      ),
  },
  {
    id: 'imp124778-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124778_SUMMARY.verdict) && /NO QED/.test(IMP124778_SUMMARY.verdict),
  },
];

for (const assertion of IMP124778_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124778 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124778_SUMMARY;
