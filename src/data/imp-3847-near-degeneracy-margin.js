/**
 * @module imp-3847-near-degeneracy-margin
 * @fileoverview imp-3847 (numerical, MEASUREMENT-ONLY): plateau-by-plateau
 * near-degeneracy margin audit of the imp-3725 gap-domination two-sided
 * true-flow enclosure  0 <= F_mb(N) <= (H^2/8)(1/theta_N - 1)  on [1e4, 1e6].
 *
 * WHY THIS MEASUREMENT
 * --------------------
 * imp-3729 established that the LOWER side of the enclosure is N-agnostic and
 * that the ONLY genuine risk to the UPPER side is not the size of N but the
 * LOCAL gap geometry at the record pair: theta_N = 1 - Psi_N(T)/8 degrades
 * only when a neighbour of the record pair falls within ~0.5% of the minimum
 * gap H (a near-degenerate cluster), because the retardation term
 *   Psi_N(T) = 4 H^2 * sum_j 1 / D_j(T)^2
 * blows up as the nearest frozen shrunk distance Dmin -> H. imp-3729 quoted a
 * SINGLE illustrative figure (Dmin/H ~= 27, theta >= 0.99823) on the plateaus.
 * This module MEASURES the full Dmin/H distribution across all 10 imp-3725
 * H_raw plateaus and certifies, plateau by plateau, how far each sits from the
 * two walls that could void its upper-bound certificate:
 *   (WALL 1, VACUOUSNESS)      theta_N > 0   <=>   Psi_N(T) < 8
 *   (WALL 2, SELF-CONSISTENCY) theta_N >= thetaBar = 0.99  <=>  Psi_N(T) <= 0.08
 * Wall 2 is the bootstrap hypothesis under which imp-3725 PROVES the upper
 * bound (H^2/(8 theta) <= T); it is far tighter than Wall 1 and is therefore
 * the binding constraint.
 *
 * WHAT WAS MEASURED (all derived live from the imp-3725 baked rows)
 * ----------------------------------------------------------------
 *  - Dmin/H per plateau (nearest frozen shrunk distance over the minimum gap):
 *    ranges from 20.54 (WORST, plateau 1) up to 121.29 (plateau 9). The single
 *    illustrative 27 imp-3729 quoted was plateau 0; the true worst-case margin
 *    is plateau 1 at 20.54 -- still ~20x above the Dmin/H ~= 1 near-degeneracy
 *    collapse threshold.
 *  - Vacuousness margin factor 8 / Psi_N (how many-fold Psi could grow before
 *    theta hits 0): worst-case 352x at plateau 1; best 9597x at plateau 9.
 *  - Self-consistency margin factor 0.08 / Psi_N (how many-fold Psi could grow
 *    before theta drops below thetaBar): worst-case 3.52x at plateau 1; best
 *    95.97x at plateau 9. This is the binding headroom on the whole scan.
 *  - COINCIDENCE: plateau 1 is simultaneously the minimum Dmin/H, the maximum
 *    Psi_N, and the minimum theta_N. So Dmin/H is a faithful monotone proxy
 *    for the near-degeneracy risk (smaller Dmin/H => larger 1/D^2 retardation
 *    => larger Psi => smaller theta), and one plateau governs all three walls.
 *
 * NET: even the worst plateau sits ~3.5x from the self-consistency wall and
 * ~350x from the vacuousness wall, with neighbours ~20x farther than the
 * minimum gap. The near-degeneracy risk imp-3729 named as the sole upper-bound
 * vector is real but nowhere near binding anywhere on [1e4, 1e6].
 *
 * MEASUREMENT ONLY. No new bound on Lambda; imp-3066 K_a >= 0 positivity
 * UNTOUCHED; Platt-Trudgian Lambda <= 0.2 REMAINS SOTA; NO QED.
 *
 * @see imp-3725-fmb-plateau-domination-lemma.js (source of the live rows)
 * @see imp-3729-gap-domination-below-1e4-regime.js (named this risk vector)
 */

import { IMP_3725_FMB_PLATEAU_DOMINATION } from './imp-3725-fmb-plateau-domination-lemma.js';

const SRC_ROWS = IMP_3725_FMB_PLATEAU_DOMINATION.rows;

// The bootstrap horizon uses thetaBar = 0.99 on every plateau (imp-3725).
const THETA_BAR = 0.99;
const PSI_VACUOUSNESS_WALL = 8;                 // theta_N > 0  <=>  Psi_N < 8
const PSI_SELFCONSISTENCY_WALL = 8 * (1 - THETA_BAR); // theta_N >= thetaBar <=> Psi_N <= 0.08

// Per-plateau near-degeneracy margins, all derived from the imp-3725 rows so
// this module stays single-source-of-truth (no independently baked numbers).
const MARGIN_ROWS = SRC_ROWS.map((r) => {
  const dminOverH = r.Dmin / r.H;
  const vacuousnessMarginFactor = PSI_VACUOUSNESS_WALL / r.psiEnd;
  const selfConsistencyMarginFactor = PSI_SELFCONSISTENCY_WALL / r.psiEnd;
  return Object.freeze({
    plateauIndex: r.plateauIndex,
    startN: r.startN,
    endN: r.endN,
    H: r.H,
    Dmin: r.Dmin,
    dminOverH,                       // nearest frozen distance over the min gap
    psiEnd: r.psiEnd,                // Psi_N at the plateau end (dominates the plateau)
    theta: r.theta,                  // theta_N = 1 - Psi_N/8
    thetaMarginToBar: r.theta - THETA_BAR,
    vacuousnessMarginFactor,         // 8 / Psi_N  (fold-growth of Psi to reach theta = 0)
    selfConsistencyMarginFactor,     // 0.08 / Psi_N (fold-growth of Psi to reach thetaBar)
  });
});

const dminRatios = MARGIN_ROWS.map((r) => r.dminOverH);
const MIN_DMIN_OVER_H = Math.min(...dminRatios);
const MAX_DMIN_OVER_H = Math.max(...dminRatios);
const worstByDmin = MARGIN_ROWS.reduce((a, b) => (b.dminOverH < a.dminOverH ? b : a));
const worstByPsi = MARGIN_ROWS.reduce((a, b) => (b.psiEnd > a.psiEnd ? b : a));

export const IMP_3847_NEAR_DEGENERACY_MARGIN = Object.freeze({
  id: 'imp-3847',
  title:
    'Near-degeneracy margin Dmin/H across the 10 imp-3725 H_raw plateaus and ' +
    'the worst-case distance to the theta_N vacuousness and self-consistency walls',
  status: 'measurement-only',
  rhFree: true,
  semantics: 'characterization of an existing true-flow lemma; no new bound',

  thetaBar: THETA_BAR,
  vacuousnessWallPsi: PSI_VACUOUSNESS_WALL,
  selfConsistencyWallPsi: PSI_SELFCONSISTENCY_WALL,

  rows: MARGIN_ROWS,

  headline: {
    plateauCount: MARGIN_ROWS.length,
    dminOverH_min: MIN_DMIN_OVER_H,           // 20.54 (plateau 1)
    dminOverH_max: MAX_DMIN_OVER_H,           // 121.29 (plateau 9)
    worstPlateauIndex: worstByPsi.plateauIndex,
    worstVacuousnessMarginFactor: worstByPsi.vacuousnessMarginFactor,       // ~352x
    worstSelfConsistencyMarginFactor: worstByPsi.selfConsistencyMarginFactor, // ~3.52x
    bindingWall: 'self-consistency (theta_N >= thetaBar); ~3.52x headroom at plateau 1',
    worstPlateauIsUnanimous:
      worstByDmin.plateauIndex === worstByPsi.plateauIndex,
    note:
      'The near-degeneracy risk imp-3729 named as the sole upper-bound vector ' +
      'is real but nowhere near binding on [1e4, 1e6]: the tightest plateau ' +
      '(index 1) sits ~3.52x from the self-consistency wall, ~352x from the ' +
      'vacuousness wall, with neighbours ~20x farther than the minimum gap ' +
      '(Dmin/H = 20.54, vs the Dmin/H ~= 1 collapse threshold). Dmin/H, ' +
      'max Psi and min theta all peak at the SAME plateau, so Dmin/H is a ' +
      'faithful monotone proxy for the retardation risk.',
  },

  interpretation: {
    imp3729SingleFigure:
      'imp-3729 quoted one illustrative Dmin/H ~= 27 (plateau 0). The full ' +
      'distribution shows plateau 0 is NOT the worst; the worst is plateau 1 ' +
      'at Dmin/H = 20.54.',
    whyDminOverHisTheProxy:
      'Psi_N = 4 H^2 sum 1/D_j^2 is dominated by its nearest term ~ (H/Dmin)^2, ' +
      'so smaller Dmin/H raises Psi and lowers theta. That the min-Dmin/H, ' +
      'max-Psi and min-theta plateaus coincide (index 1) confirms the proxy.',
    bindingConstraint:
      'The vacuousness wall (theta > 0) is never within 3 orders of magnitude ' +
      'of being reached; the bootstrap self-consistency line thetaBar = 0.99 ' +
      'is the binding wall, and even it retains a 3.52x Psi-growth margin at ' +
      'the worst plateau.',
  },

  scope: {
    measurementOnly: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'Lambda <= 0.2 (PT 2021) remains SOTA',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) ----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3847_NEAR_DEGENERACY_MARGIN_ASSERTIONS = [
  {
    id: 'imp3847-dminOverH-recomputes-from-imp3725',
    holds: () =>
      MARGIN_ROWS.every((r, i) => rel(r.dminOverH, SRC_ROWS[i].Dmin / SRC_ROWS[i].H) < 1e-12),
    why:
      'Dmin/H must recompute exactly from the imp-3725 baked Dmin and H; this ' +
      'module bakes no independent geometry numbers, so any drift signals the ' +
      'imp-3725 rows changed under it.',
  },
  {
    id: 'imp3847-worst-plateau-is-plateau-1',
    holds: () => worstByDmin.plateauIndex === 1 && worstByPsi.plateauIndex === 1,
    why:
      'The full Dmin/H distribution has its minimum at plateau 1 (20.54), and ' +
      'plateau 1 is ALSO the maximum Psi_N (smallest theta). The near-degeneracy ' +
      'proxy and the retardation risk agree on the worst plateau.',
  },
  {
    id: 'imp3847-dminOverH-well-above-collapse-threshold',
    holds: () => MIN_DMIN_OVER_H > 20 && MAX_DMIN_OVER_H < 130,
    why:
      'Every plateau keeps Dmin/H > 20, i.e. the nearest neighbour of the ' +
      'record pair is at least ~20x farther than the minimum gap -- far from ' +
      'the Dmin/H ~= 1 near-degeneracy collapse threshold that would inflate Psi.',
  },
  {
    id: 'imp3847-vacuousness-wall-never-close',
    holds: () => MARGIN_ROWS.every((r) => r.psiEnd < PSI_VACUOUSNESS_WALL && r.vacuousnessMarginFactor > 300),
    why:
      'Wall 1: theta_N > 0 requires Psi_N < 8. Every plateau keeps Psi_N below ' +
      '8 with at least a 300x growth margin, so the enclosure is nowhere near ' +
      'vacuous on [1e4, 1e6].',
  },
  {
    id: 'imp3847-self-consistency-is-binding-wall-with-margin',
    holds: () =>
      MARGIN_ROWS.every(
        (r) => r.psiEnd <= PSI_SELFCONSISTENCY_WALL && r.theta >= THETA_BAR && r.selfConsistencyMarginFactor > 3,
      ) &&
      worstByPsi.selfConsistencyMarginFactor < worstByPsi.vacuousnessMarginFactor,
    why:
      'Wall 2 (theta_N >= thetaBar = 0.99, the imp-3725 bootstrap hypothesis) ' +
      'is the binding wall: it is far tighter than the vacuousness wall yet ' +
      'still retains a > 3x Psi-growth margin at every plateau. If any plateau ' +
      'breaches Psi_N <= 0.08 the imp-3725 upper-bound certificate for that ' +
      'plateau is void.',
  },
  {
    id: 'imp3847-margins-consistent-with-imp3725-theta',
    holds: () =>
      MARGIN_ROWS.every((r, i) => rel(r.theta, 1 - r.psiEnd / 8) < 1e-8 && r.theta === SRC_ROWS[i].theta),
    why:
      'The theta this module reports must be the identical imp-3725 theta and ' +
      'must equal 1 - Psi_N/8; a mismatch means the margin table desynced from ' +
      'the lemma it is auditing.',
  },
  {
    id: 'imp3847-measurement-only-no-lambda-claim',
    holds: () =>
      IMP_3847_NEAR_DEGENERACY_MARGIN.scope.noNewLambdaBound === true &&
      IMP_3847_NEAR_DEGENERACY_MARGIN.scope.noQED === true &&
      IMP_3847_NEAR_DEGENERACY_MARGIN.scope.imp3066Untouched === true,
    why:
      'Honesty guard: this is a measurement of an existing lemma. It must not ' +
      'assert a new Lambda bound or a QED, and imp-3066 stays untouched; ' +
      'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3847_NEAR_DEGENERACY_MARGIN_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3847-near-degeneracy-margin assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3847_NEAR_DEGENERACY_MARGIN;
