/**
 * @module imp-3070-c-shock-n-dependence
 * @fileoverview imp-3070 — Tabulate the N-dependence of the closed-form cusp
 * constant C_shock(N) = sqrt(2 / (3 log gamma_N)) across the finite-height
 * assembly N-range and certify it stays strictly under 1/3 everywhere with margin.
 *
 * CONTEXT. imp-3026-c-shock-cross-validation uses cShockClosedForm(N) =
 * sqrt(2/(3 log gamma_N)) (via effectiveHeightForN) to cross-validate the two
 * ch-wall-verdict appearances of C_shock, but only samples three ladder points
 * (N = 1e4, 1e5, 1e6) and treats the constant as "N-independent up to the slow
 * 1/log factor". That slow factor is never actually tabulated. This module makes
 * the N-dependence explicit across the whole assembly range and shows the imp-2786
 * cap C_shock < 1/3 is UNIFORM, not just checked at three points.
 *
 * THE CONSTANT. gamma_N = effectiveHeightForN(N) is the Riemann-von Mangoldt
 * height the assembly "sees" at level N; it increases with N, so log gamma_N
 * increases and C_shock(N) = sqrt(2/(3 log gamma_N)) is STRICTLY DECREASING in N.
 * The worst case (largest C_shock, smallest margin to 1/3) is therefore at the
 * SMALLEST assembly N, N = 2458 (the current imp-305 level). The cap reduces to a
 * single inequality: C_shock(N) < 1/3  <=>  log gamma_N > 6  <=>  gamma_N > e^6 ~ 403.
 * Every assembly N has gamma_N >> 403, so the cap holds with comfortable margin.
 *
 * RESULT. Across a 13-point log-spaced N grid from N = 2458 to N = 1e6, C_shock(N)
 * falls monotonically from ~0.2886 (N=2458) to ~0.2238 (N=1e6). The maximum value
 * over the whole range is ~0.2886 at N=2458, a margin of ~0.0447 below the 1/3 cap.
 * The cap is uniform with margin everywhere.
 *
 * HONEST SCOPE. NUMERICAL ONLY. This certifies the uniformity of an ALREADY-PROVEN
 * cap (imp-2786 pinned C_shock < 1/3 in closed form); it is NOT a new bound and does
 * NOT close C_H. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA. No QED.
 *
 * @see imp-3026-c-shock-cross-validation (cShockClosedForm, three-point ladder)
 * @see imp-2786-c-shock-cusp-constant (C_shock pinned to sqrt(2/(3 log gamma_N)) < 1/3)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// The imp-2786 cap.
const C_SHOCK_CAP = 1 / 3;

// Closed-form cusp-law C_shock(N), identical to imp-3026 cShockClosedForm.
function cShockClosedForm(N) {
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return Math.sqrt(2 / (3 * Math.log(gammaN)));
}

// Assembly N-range: log-spaced grid from the current imp-305 level N=2458 up to
// the N=1e6 finite-height ceiling used by the imp-3026 ladder.
const N_MIN = 2458;
const N_MAX = 1_000_000;
const N_POINTS = 13;
const N_GRID = [];
for (let i = 0; i < N_POINTS; i++) {
  const frac = i / (N_POINTS - 1);
  const N = Math.round(N_MIN * Math.pow(N_MAX / N_MIN, frac));
  N_GRID.push(N);
}

const N_DEPENDENCE_ROWS = N_GRID.map((N) => {
  const gammaN = effectiveHeightForN(N);
  const cShock = cShockClosedForm(N);
  return {
    N,
    gamma_N: gammaN,
    log_gamma_N: Math.log(gammaN),
    C_shock: cShock,
    margin_to_cap: C_SHOCK_CAP - cShock, // > 0 everywhere
    under_cap: cShock < C_SHOCK_CAP,
  };
});

// Worst case = largest C_shock = smallest margin = smallest N (monotone decreasing).
const MAX_C_SHOCK = Math.max(...N_DEPENDENCE_ROWS.map((r) => r.C_shock));
const MIN_MARGIN = Math.min(...N_DEPENDENCE_ROWS.map((r) => r.margin_to_cap));
const WORST_ROW = N_DEPENDENCE_ROWS.find((r) => r.C_shock === MAX_C_SHOCK);

// Strict monotone-decrease check: C_shock(N_{i+1}) < C_shock(N_i) for every step.
const IS_MONOTONE_DECREASING = N_DEPENDENCE_ROWS.every(
  (r, i) => i === 0 || r.C_shock < N_DEPENDENCE_ROWS[i - 1].C_shock,
);

export const C_SHOCK_N_DEPENDENCE_IMP3070 = {
  ticket: 'imp-3070',
  title:
    'Tabulate C_shock(N) = sqrt(2/(3 log gamma_N)) across the assembly N-range; certify < 1/3 uniformly',
  verdict:
    'UNIFORM. C_shock(N) is strictly decreasing in N (slow 1/sqrt(log gamma_N) factor) and stays ' +
    'under the imp-2786 cap 1/3 at every assembly N. Worst case is the smallest N=2458 with ' +
    'C_shock ~ 0.2886, a margin of ~0.0447 below 1/3. The cap is uniform with margin, not just ' +
    'checked at the three imp-3026 ladder points.',
  cap: C_SHOCK_CAP,
  nMin: N_MIN,
  nMax: N_MAX,
  // Worst-case (smallest-N) headline.
  worstN: WORST_ROW.N,
  maxCShock: MAX_C_SHOCK,
  minMargin: MIN_MARGIN,
  isMonotoneDecreasing: IS_MONOTONE_DECREASING,
  // The cap reduces to gamma_N > e^6.
  capAsHeightThreshold: Math.exp(6), // C_shock < 1/3  <=>  gamma_N > e^6 ~ 403
  table: N_DEPENDENCE_ROWS,
  isNewBound: false,
  honestNote:
    'No false QED. NUMERICAL tabulation only: it certifies the imp-2786 cap C_shock < 1/3 is UNIFORM ' +
    'across the assembly N-range, not a new bound. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

// ── Build-time assertions ────────────────────────────────────────────────────
export const C_SHOCK_N_DEPENDENCE_ASSERTIONS = [
  {
    id: 'imp3070-c-shock-under-cap-everywhere',
    holds: () =>
      N_DEPENDENCE_ROWS.length === N_POINTS &&
      N_DEPENDENCE_ROWS.every(
        (r) => Number.isFinite(r.C_shock) && r.C_shock < C_SHOCK_CAP && r.margin_to_cap > 0,
      ),
    why:
      'THE CERTIFICATION: C_shock(N) = sqrt(2/(3 log gamma_N)) must sit strictly under 1/3 at EVERY ' +
      'sampled assembly N (2458 .. 1e6), with a positive margin. This is the uniform-cap statement the ' +
      'imp-3026 three-point ladder only spot-checked.',
  },
  {
    id: 'imp3070-c-shock-monotone-decreasing',
    holds: () => IS_MONOTONE_DECREASING,
    why:
      'C_shock(N) must be STRICTLY DECREASING in N because gamma_N increases with N and C_shock ~ ' +
      '1/sqrt(log gamma_N). This locks the structure that makes the worst case the smallest N: if the ' +
      'monotonicity broke, the uniform-cap argument by single worst-point would no longer be valid.',
  },
  {
    id: 'imp3070-worst-case-at-smallest-N',
    holds: () => {
      const r = C_SHOCK_N_DEPENDENCE_IMP3070;
      return (
        r.worstN === N_MIN &&
        r.maxCShock > 0.28 &&
        r.maxCShock < C_SHOCK_CAP &&
        r.minMargin > 0.04
      );
    },
    why:
      'The maximum C_shock over the whole range must occur at the smallest N=2458 and equal the ~0.2886 ' +
      'worst case, with the minimum margin to 1/3 still above 0.04. If a future edit pushed the worst-case ' +
      'C_shock past 1/3 (or the worst case moved off the smallest N) this fails loudly.',
  },
  {
    id: 'imp3070-cap-equiv-height-threshold',
    holds: () => {
      const thr = Math.exp(6);
      // C_shock < 1/3  <=>  log gamma_N > 6  <=>  gamma_N > e^6.
      return N_DEPENDENCE_ROWS.every((r) => (r.C_shock < C_SHOCK_CAP) === (r.gamma_N > thr));
    },
    why:
      'The cap C_shock < 1/3 is algebraically equivalent to gamma_N > e^6 ~ 403. This assertion confirms ' +
      'the equivalence holds row-by-row, documenting WHY the cap is uniform: every assembly height ' +
      'gamma_N (>= ~2990 at N=2458) exceeds the 403 threshold by an order of magnitude.',
  },
  {
    id: 'imp3070-numerical-not-a-beat',
    holds: () => {
      const r = C_SHOCK_N_DEPENDENCE_IMP3070;
      return (
        r.isNewBound === false &&
        /SOTA/.test(r.honestNote) &&
        /UNIFORM/.test(r.verdict)
      );
    },
    why:
      'VERDICT LOCK: this is a NUMERICAL tabulation certifying an existing cap is uniform, NOT a new ' +
      'bound. Platt-Trudgian Lambda <= 0.2 stays SOTA. Blocks any future edit from inflating this ' +
      'uniformity check into a claimed C_H closure or rigorous beat.',
  },
];

for (const a of C_SHOCK_N_DEPENDENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3070 assertion failed: ' + a.id + ' — ' + a.why);
  }
}
