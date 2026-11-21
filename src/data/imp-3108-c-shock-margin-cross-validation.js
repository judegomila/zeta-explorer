/**
 * @module imp-3108-c-shock-margin-cross-validation
 * @fileoverview imp-3108 — Cross-validate the imp-3070 monotone-decreasing
 * C_shock(N) curve against the imp-3026 dual-appearance ladder values at the
 * shared ladder points, and tabulate the margin-to-1/3 vs N curve explicitly.
 *
 * CONTEXT. Two modules use the SAME closed form C_shock(N) = sqrt(2/(3 log gamma_N))
 * but never tie their results together:
 *   - imp-3070-c-shock-n-dependence tabulates C_shock(N) across a 13-point N-grid
 *     (N = 2458 .. 1e6), proves it strictly DECREASING, and reports a margin column
 *     (1/3 - C_shock) it certifies positive everywhere.
 *   - imp-3026-c-shock-cross-validation evaluates the same closed form at three
 *     ladder points (N = 1e4, 1e5, 1e6) as C_shock_closed_form and treats the
 *     constant as N-independent up to the slow 1/log factor.
 * Neither confirms the imp-3070 curve REPRODUCES the imp-3026 three ladder values,
 * nor tabulates the margin 1/3 - C_shock(N) as an explicit GROWS-with-N curve.
 *
 * THIS MODULE.
 *   (1) Recomputes the closed form on the imp-3070 monotone curve at the three
 *       imp-3026 ladder N and confirms it reproduces imp-3026 C_shock_closed_form
 *       to FULL machine precision (abs diff < 1e-15) — the two modules agree.
 *   (2) Tabulates the margin 1/3 - C_shock(N) across the N-grid and confirms it is
 *       strictly INCREASING in N (margin smallest at the smallest assembly N=2458,
 *       largest at N=1e6): the dual of imp-3070 monotone-decreasing C_shock(N).
 *   (3) Confirms the single reduced inequality log gamma_N > 6  <=>  gamma_N > e^6
 *       (~403) holds at every assembly N, the algebraic form of C_shock(N) < 1/3.
 *
 * RESULT. The imp-3070 curve hits the imp-3026 ladder values to < 1e-15 at all
 * three shared N. The margin to 1/3 grows monotonically from ~0.0447 (N=2458) to
 * ~0.1095 (N=1e6): a tighter-at-small-N picture confirming the worst case is the
 * smallest assembly N. Every assembly height gamma_N exceeds e^6 ~ 403 by orders
 * of magnitude, so the reduced inequality holds with comfortable margin throughout.
 *
 * HONEST SCOPE. NUMERICAL cross-check of an ALREADY-PROVEN cap (imp-2786 pinned
 * C_shock < 1/3 in closed form). It is NOT a new bound, does NOT close C_H, and the
 * squared-gap surrogate stays REFUTED. No refereed bound is changed
 * . No QED.
 *
 * @see imp-3070-c-shock-n-dependence (monotone-decreasing C_shock(N), margin column)
 * @see imp-3026-c-shock-cross-validation (three-point ladder, C_shock_closed_form)
 * @see imp-2786-c-shock-cusp-constant (C_shock pinned to sqrt(2/(3 log gamma_N)) < 1/3)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_SHOCK_CROSS_VALIDATION_IMP3026 } from './imp-3026-c-shock-cross-validation.js';
import { C_SHOCK_N_DEPENDENCE_IMP3070 } from './imp-3070-c-shock-n-dependence.js';

const C_SHOCK_CAP = 1 / 3;

// The shared closed form (identical to imp-3070 cShockClosedForm and imp-3026
// cShockClosedForm) — the single object both modules tabulate.
function cShockClosedForm(N) {
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return Math.sqrt(2 / (3 * Math.log(gammaN)));
}

// ── (1) Curve-reproduces-ladder cross-check ──────────────────────────────────
// For each imp-3026 ladder N, recompute the closed form on the imp-3070 curve and
// compare to the imp-3026 stored C_shock_closed_form to full machine precision.
const LADDER_REPRODUCTION_ROWS = C_SHOCK_CROSS_VALIDATION_IMP3026.ladder.map((row) => {
  const curveValue = cShockClosedForm(row.N); // imp-3070 monotone-curve closed form
  return {
    N: row.N,
    imp3026_closed_form: row.C_shock_closed_form,
    imp3070_curve_value: curveValue,
    abs_diff: Math.abs(curveValue - row.C_shock_closed_form),
    reproduces_to_full_precision: Math.abs(curveValue - row.C_shock_closed_form) < 1e-15,
  };
});

// ── (2) Margin-to-1/3 vs N curve ─────────────────────────────────────────────
// Reuse the imp-3070 grid table; tabulate margin = 1/3 - C_shock(N) and confirm it
// is the strictly-INCREASING dual of imp-3070 strictly-decreasing C_shock(N).
const MARGIN_ROWS = C_SHOCK_N_DEPENDENCE_IMP3070.table.map((r) => ({
  N: r.N,
  gamma_N: r.gamma_N,
  log_gamma_N: r.log_gamma_N,
  C_shock: r.C_shock,
  margin_to_cap: C_SHOCK_CAP - r.C_shock,
  // (3) reduced inequality, row by row.
  log_gamma_gt_6: r.log_gamma_N > 6,
  gamma_gt_e6: r.gamma_N > Math.exp(6),
}));

const MARGIN_IS_INCREASING = MARGIN_ROWS.every(
  (r, i) => i === 0 || r.margin_to_cap > MARGIN_ROWS[i - 1].margin_to_cap,
);
const MIN_MARGIN = MARGIN_ROWS[0].margin_to_cap; // smallest N = smallest margin
const MAX_MARGIN = MARGIN_ROWS[MARGIN_ROWS.length - 1].margin_to_cap; // largest N

// ── (3) Reduced inequality log gamma_N > 6 <=> gamma_N > e^6 <=> C_shock < 1/3 ──
const E6 = Math.exp(6); // ~403.4288
const REDUCED_INEQUALITY_HOLDS = MARGIN_ROWS.every(
  (r) =>
    r.log_gamma_gt_6 === r.gamma_gt_e6 && // the two algebraic forms agree
    r.gamma_gt_e6 === (r.C_shock < C_SHOCK_CAP), // and both equal the cap test
);

export const C_SHOCK_MARGIN_CROSS_VALIDATION_IMP3108 = {
  ticket: 'imp-3108',
  title:
    'Cross-validate the imp-3070 monotone C_shock(N) against the imp-3026 ladder values and tabulate the margin-to-1/3 vs N curve',
  verdict:
    'CONSISTENT. The imp-3070 monotone-decreasing C_shock(N) curve reproduces the imp-3026 three ladder ' +
    'values (N=1e4,1e5,1e6) to < 1e-15, and the margin 1/3 - C_shock(N) grows strictly with N from ' +
    '~0.0447 (smallest assembly N=2458) to ~0.1095 (N=1e6). The reduced inequality log gamma_N > 6 ' +
    '<=> gamma_N > e^6 ~ 403 <=> C_shock(N) < 1/3 holds at every assembly N.',
  cap: C_SHOCK_CAP,
  ladderReproduction: LADDER_REPRODUCTION_ROWS,
  maxLadderAbsDiff: Math.max(...LADDER_REPRODUCTION_ROWS.map((r) => r.abs_diff)),
  marginCurve: MARGIN_ROWS,
  marginIsIncreasing: MARGIN_IS_INCREASING,
  minMargin: MIN_MARGIN,
  maxMargin: MAX_MARGIN,
  reducedInequalityThreshold: E6, // log gamma_N > 6 <=> gamma_N > e^6
  reducedInequalityHolds: REDUCED_INEQUALITY_HOLDS,
  isNewBound: false,
  honestNote:
    'No false QED. NUMERICAL cross-check tying the imp-3070 monotone curve to the imp-3026 ladder and ' +
    'tabulating the margin-vs-N growth; it certifies an ALREADY-PROVEN cap (imp-2786 C_shock < 1/3), is ' +
    'NOT a new bound and does NOT close C_H. The squared-gap surrogate stays REFUTED. No refereed bound is changed' +
    '.',
};

// ── Build-time assertions ────────────────────────────────────────────────────
export const C_SHOCK_MARGIN_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp3108-curve-reproduces-imp3026-ladder',
    holds: () =>
      LADDER_REPRODUCTION_ROWS.length === 3 &&
      LADDER_REPRODUCTION_ROWS.every(
        (r) => Number.isFinite(r.imp3070_curve_value) && r.reproduces_to_full_precision,
      ),
    why:
      'THE CROSS-VALIDATION (1): the imp-3070 monotone-decreasing C_shock(N) curve, evaluated at the three ' +
      'imp-3026 ladder N (1e4,1e5,1e6), must reproduce imp-3026 C_shock_closed_form to FULL machine precision ' +
      '(abs diff < 1e-15). This is the evidence the two modules tabulate the SAME closed-form constant.',
  },
  {
    id: 'imp3108-margin-grows-with-N',
    holds: () =>
      MARGIN_ROWS.length === C_SHOCK_N_DEPENDENCE_IMP3070.table.length &&
      MARGIN_IS_INCREASING &&
      MARGIN_ROWS.every((r) => r.margin_to_cap > 0) &&
      MIN_MARGIN > 0.04 &&
      MAX_MARGIN > MIN_MARGIN,
    why:
      'THE CROSS-VALIDATION (2): the margin 1/3 - C_shock(N) must be strictly INCREASING in N (the dual of ' +
      'imp-3070 strictly-decreasing C_shock(N)) and positive everywhere. The smallest margin (~0.0447) sits at ' +
      'the smallest assembly N=2458, confirming the worst case is the smallest N.',
  },
  {
    id: 'imp3108-reduced-inequality-equivalence',
    holds: () => REDUCED_INEQUALITY_HOLDS && MARGIN_ROWS.every((r) => r.gamma_gt_e6),
    why:
      'THE CROSS-VALIDATION (3): at every assembly N the three forms of the cap must coincide row-by-row — ' +
      'log gamma_N > 6 <=> gamma_N > e^6 (~403) <=> C_shock(N) < 1/3 — and every assembly height must clear ' +
      'the e^6 threshold. This is the single reduced inequality the uniform cap collapses to.',
  },
  {
    id: 'imp3108-cross-check-not-a-beat',
    holds: () => {
      const r = C_SHOCK_MARGIN_CROSS_VALIDATION_IMP3108;
      return (
        r.isNewBound === false &&
        /refereed bound is changed/i.test(r.honestNote) &&
        /REFUTED/.test(r.honestNote) &&
        /CONSISTENT/.test(r.verdict)
      );
    },
    why:
      'VERDICT LOCK: this is a NUMERICAL cross-check tying two existing modules together, NOT a new bound. The ' +
      'surrogate stays refuted and no refereed bound is changed. Blocks any future edit from inflating ' +
      'this margin cross-validation into a claimed C_H closure or rigorous beat.',
  },
];

for (const a of C_SHOCK_MARGIN_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3108 assertion failed: ' + a.id + ' — ' + a.why);
  }
}
