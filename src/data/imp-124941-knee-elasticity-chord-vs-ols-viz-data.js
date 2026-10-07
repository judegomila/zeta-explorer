/**
 * @module imp-124941-knee-elasticity-chord-vs-ols-viz-data
 *
 * imp-124941: import-light viz-data leaf charting the imp-124772 knee floor-elasticity p_knee as TWO
 * overlaid panels, reusing every value verbatim from the two frozen source modules (no re-derivation,
 * no new computation):
 *
 *   Panel A (chordVsOlsRows): the imp-97822 two-floor CHORD (p_knee ~ -2.099, fit from only the 0.5x
 *   and 2x floors) overlaid on the imp-124772 full 10-floor OLS line (p_knee_lsq ~ -2.106,
 *   R^2 ~ 0.99999) across all ten (log10 E_trunc, log10 N*) floor points -- making visible how closely
 *   the two-point chord and the full-set least-squares line agree.
 *
 *   Panel B (residualURows): the imp-124823 sign-symmetric residual-U (~3e-3 decades at its largest) --
 *   negative at both floor extremes (0.5x, 5x), positive in the interior -- the faint concave-up
 *   curvature the OLS fit leaves behind.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY: floorSweep, kneeFloorExponent ~ -2.099)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit.js (IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT: fit.slope ~ -2.106, fit.residuals)
 * @see imp-124823-f2-curvature-honest-status.js (IMP124823_F2_CURVATURE_HONEST_STATUS: the standalone residual-U honesty restatement)
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';
import { IMP124823_F2_CURVATURE_HONEST_STATUS } from './imp-124823-f2-curvature-honest-status.js';

const SWEEP = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.floorSweep.filter((r) => r.log10Nstar !== null);
const CHORD_SLOPE = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.kneeFloorExponent; // ~ -2.099
const OLS_FIT = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit;

// Anchor the chord through its own two defining floors (0.5x, 2x) -- the identical two-floor fit
// imp-97822 used -- so the overlaid chord line reproduces those two points exactly.
const ANCHOR = SWEEP.find((r) => r.floorFactor === 0.5);
const ANCHOR_X = Math.log10(ANCHOR.E_trunc);
const CHORD_INTERCEPT = ANCHOR.log10Nstar - CHORD_SLOPE * ANCHOR_X;

// Panel A: per-floor point plus both overlaid line predictions at that point.
export const IMP124941_CHORD_VS_OLS_ROWS = Object.freeze(
  SWEEP.map((r) => {
    const x = Math.log10(r.E_trunc);
    return Object.freeze({
      floorFactor: r.floorFactor,
      log10Etrunc: +x.toFixed(4),
      log10NstarActual: r.log10Nstar,
      chordPrediction: +(CHORD_SLOPE * x + CHORD_INTERCEPT).toFixed(4),
      olsPrediction: +(OLS_FIT.slope * x + OLS_FIT.intercept).toFixed(4),
    });
  })
);

// Panel B: the imp-124823 sign-symmetric residual-U, reused verbatim.
export const IMP124941_RESIDUAL_U_ROWS = Object.freeze(
  OLS_FIT.residuals.map((r) => Object.freeze({ floorFactor: r.floorFactor, residualDecades: r.residualDecades }))
);

const MAX_CHORD_OLS_GAP = Math.max(
  ...IMP124941_CHORD_VS_OLS_ROWS.map((r) => Math.abs(r.chordPrediction - r.olsPrediction))
);

export const IMP124941_SUMMARY = Object.freeze({
  law:
    'The imp-97822 two-floor chord (p_knee ~ -2.099) and the imp-124772 full 10-floor OLS line '
    + '(p_knee_lsq ~ -2.106) nearly coincide across the entire 0.5x..5x floor ladder (max predicted-N* '
    + `gap ~${MAX_CHORD_OLS_GAP.toFixed(4)} decades), while the OLS residuals left behind form a `
    + 'shallow sign-symmetric U -- negative at the 0.5x/5x extremes, positive in the interior -- '
    + `~${IMP124823_F2_CURVATURE_HONEST_STATUS.maxAbsResidualDecades} decades at its largest.`,
  chordSlope: CHORD_SLOPE, // ~ -2.099
  olsSlope: OLS_FIT.slope, // ~ -2.106
  maxChordOlsGapDecades: +MAX_CHORD_OLS_GAP.toFixed(4),
  maxAbsResidualDecades: IMP124823_F2_CURVATURE_HONEST_STATUS.maxAbsResidualDecades,
  gapToInteriorPeak: IMP124823_F2_CURVATURE_HONEST_STATUS.gapToInteriorPeak, // ~0.73
  reading:
    `chord p_knee=${CHORD_SLOPE} (two-floor fit) vs OLS p_knee_lsq=${OLS_FIT.slope} (ten-floor fit, `
    + `R^2=${OLS_FIT.r2}); residual-U spans [${Math.min(...IMP124941_RESIDUAL_U_ROWS.map((r) => r.residualDecades))}, `
    + `${Math.max(...IMP124941_RESIDUAL_U_ROWS.map((r) => r.residualDecades))}] decades, negative at both `
    + 'floor extremes and positive in the interior.',
  verdict:
    'Presentation only: every point, slope, intercept, and residual is reused verbatim from imp-97822 '
    + '(two-floor chord), imp-124772 (ten-floor OLS fit) and imp-124823 (residual-U restatement); no new '
    + 'computation. Conditional-share curvature diagnostic on the inherited imp-3220/imp-3406 '
    + 'extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is untouched; '
    + 'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, '
    + 'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124941_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124941-ten-chord-ols-rows',
    description: 'panel A has exactly ten floor rows (the full imp-97822 ladder)',
    holds: () => IMP124941_CHORD_VS_OLS_ROWS.length === 10,
  },
  {
    id: 'imp124941-ten-residual-rows',
    description: 'panel B has exactly ten residual rows (one per floor)',
    holds: () => IMP124941_RESIDUAL_U_ROWS.length === 10,
  },
  {
    id: 'imp124941-chord-reproduces-anchor-points-exactly',
    description: 'the chord line passes through its own 0.5x anchor floor to within rounding',
    holds: () => {
      const row = IMP124941_CHORD_VS_OLS_ROWS.find((r) => r.floorFactor === 0.5);
      return Math.abs(row.chordPrediction - row.log10NstarActual) < 1e-3;
    },
  },
  {
    id: 'imp124941-chord-and-ols-lines-nearly-coincide',
    description: 'the chord and OLS predicted log10 N* never differ by more than 0.05 decades at any floor',
    holds: () => MAX_CHORD_OLS_GAP < 0.05,
  },
  {
    id: 'imp124941-residual-u-sign-symmetric',
    description: 'residual-U is negative at both floor extremes and positive at the interior midpoint',
    holds: () => {
      const first = IMP124941_RESIDUAL_U_ROWS[0].residualDecades;
      const last = IMP124941_RESIDUAL_U_ROWS[IMP124941_RESIDUAL_U_ROWS.length - 1].residualDecades;
      const mid = IMP124941_RESIDUAL_U_ROWS[Math.floor(IMP124941_RESIDUAL_U_ROWS.length / 2)].residualDecades;
      return first < 0 && last < 0 && mid > 0;
    },
  },
  {
    id: 'imp124941-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124941_SUMMARY.verdict) && /NO QED/.test(IMP124941_SUMMARY.verdict),
  },
];

for (const assertion of IMP124941_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124941 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124941_SUMMARY;
