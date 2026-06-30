/**
 * @module imp-3132-c-shock-worst-case-margin-floor
 * @fileoverview imp-3132 — Closed-form lower bound on the worst-case imp-3108
 * margin 1/3 - C_shock(N) at the smallest assembly N=2458.
 *
 * CONTEXT. imp-3108 tabulated the margin 1/3 - C_shock(N) across a 13-point
 * N-grid and found it GROWS strictly with N, so the worst case (smallest margin,
 * ~0.0447) sits at the smallest assembly N=2458. The closed form is
 *   C_shock(N) = sqrt(2 / (3 log gamma_N)),   gamma_N = effectiveHeightForN(N),
 * with gamma_N strictly increasing in N. The margin was reported as a NUMBER
 * (~0.0447) but never given an explicit closed-form FLOOR.
 *
 * THIS MODULE. Pins the worst-case height gamma_min = effectiveHeightForN(2458)
 * and derives a certified closed-form lower bound on the worst-case margin.
 *
 *   STEP 1 (pin the height). gamma_min = effectiveHeightForN(2458) ~ 2990.04,
 *   so log gamma_min ~ 8.00304. In particular log gamma_min > 8, i.e.
 *   gamma_min > e^8.
 *
 *   STEP 2 (reduced-inequality headroom). The cap C_shock(N) < 1/3 reduces to
 *   log gamma_N > 6. At the worst case N_min=2458 the headroom is
 *     log gamma_min - 6 ~ 2.00304 > 2,
 *   equivalently gamma_min / e^6 ~ 7.4116 > e^2 ~ 7.389. So the reduced
 *   inequality holds at N_min with the rational margin log gamma_min > 8 to spare.
 *
 *   STEP 3 (closed-form margin floor). Because gamma_N is increasing in N,
 *   log gamma_N >= log gamma_min > 8 at EVERY assembly N, hence
 *     C_shock(N) = sqrt(2/(3 log gamma_N)) <= sqrt(2/(3*8)) = sqrt(1/12)
 *                = 1/(2*sqrt(3)) = sqrt(3)/6 ~ 0.2886751,
 *   so the margin is bounded below by the CLOSED EXPRESSION
 *     1/3 - C_shock(N) >= 1/3 - 1/(2*sqrt(3)) = (2 - sqrt(3))/6 ~ 0.0446582.
 *   This rational-plus-surd floor (2 - sqrt(3))/6 sits just below the exact
 *   worst-case margin 0.0447131 (gap ~5.5e-5), certifying the headroom with a
 *   single algebraic constant valid for all N.
 *
 * RESULT. Worst-case margin 1/3 - C_shock(2458) = 0.0447131 is floored by the
 * closed expression (2 - sqrt(3))/6 = 0.0446582 > 0, derived from the rational
 * height threshold log gamma_min > 8. The reduced inequality log gamma_N > 6
 * carries ~2.003 of headroom at the worst case N_min.
 *
 * HONEST SCOPE. Cross-check of an ALREADY-PROVEN cap (imp-2786 pinned
 * C_shock < 1/3). This is NOT a new bound, does NOT close C_H, and the
 * squared-gap surrogate stays REFUTED. Platt-Trudgian Lambda <= 0.2 remains the
 * rigorous SOTA. No QED.
 *
 * @see imp-3108-c-shock-margin-cross-validation (margin-vs-N curve, ~0.0447 at N=2458)
 * @see imp-3070-c-shock-n-dependence (monotone-decreasing C_shock(N))
 * @see imp-2786-c-shock-cusp-constant (C_shock pinned to sqrt(2/(3 log gamma_N)) < 1/3)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const C_SHOCK_CAP = 1 / 3;
const N_MIN = 2458; // smallest assembly height (current imp-305 level)

// ── STEP 1: pin the worst-case height ────────────────────────────────────────
const GAMMA_MIN = effectiveHeightForN(N_MIN); // ~2990.04
const LOG_GAMMA_MIN = Math.log(GAMMA_MIN); // ~8.00304

// Rational height threshold used by the closed-form floor: log gamma_min > 8.
const LOG_GAMMA_THRESHOLD = 8;

// ── STEP 2: reduced-inequality headroom at N_min ─────────────────────────────
// The cap C_shock < 1/3 reduces to log gamma_N > 6; report the headroom there.
const REDUCED_INEQUALITY_FLOOR = 6;
const REDUCED_INEQUALITY_HEADROOM = LOG_GAMMA_MIN - REDUCED_INEQUALITY_FLOOR; // ~2.003

// ── STEP 3: closed-form worst-case margin floor ──────────────────────────────
// log gamma_N >= log gamma_min > 8 for all N  =>  C_shock(N) <= sqrt(2/(3*8))
//   = sqrt(1/12) = 1/(2 sqrt 3) = sqrt(3)/6,
// hence margin >= 1/3 - 1/(2 sqrt 3) = (2 - sqrt 3)/6.
const C_SHOCK_CEILING = Math.sqrt(2 / (3 * LOG_GAMMA_THRESHOLD)); // 1/(2 sqrt 3)
const MARGIN_FLOOR_CLOSED_FORM = (2 - Math.sqrt(3)) / 6; // (2 - sqrt 3)/6 ~ 0.0446582

// Exact worst-case margin at N_min (the number imp-3108 reported as ~0.0447).
const C_SHOCK_AT_NMIN = Math.sqrt(2 / (3 * LOG_GAMMA_MIN));
const WORST_CASE_MARGIN_EXACT = C_SHOCK_CAP - C_SHOCK_AT_NMIN; // ~0.0447131

export const C_SHOCK_WORST_CASE_MARGIN_FLOOR_IMP3132 = {
  ticket: 'imp-3132',
  title:
    'Closed-form lower bound on the worst-case imp-3108 margin 1/3 - C_shock(N) at the smallest assembly N=2458',
  verdict:
    'FLOORED. The worst-case margin 1/3 - C_shock(2458) ~ 0.0447131 is bounded below by the closed ' +
    'expression (2 - sqrt(3))/6 ~ 0.0446582 > 0, derived from the rational height threshold ' +
    'log gamma_min > 8 (gamma_min = effectiveHeightForN(2458) ~ 2990.04). The reduced inequality ' +
    'log gamma_N > 6 carries ~2.003 headroom at the worst case N_min.',
  cap: C_SHOCK_CAP,
  nMin: N_MIN,
  gammaMin: GAMMA_MIN,
  logGammaMin: LOG_GAMMA_MIN,
  logGammaThreshold: LOG_GAMMA_THRESHOLD, // log gamma_min > 8 underlies the floor
  reducedInequalityFloor: REDUCED_INEQUALITY_FLOOR, // log gamma_N > 6
  reducedInequalityHeadroom: REDUCED_INEQUALITY_HEADROOM, // ~2.003 at N_min
  cShockCeiling: C_SHOCK_CEILING, // sqrt(2/24) = 1/(2 sqrt 3)
  cShockAtNmin: C_SHOCK_AT_NMIN,
  marginFloorClosedForm: MARGIN_FLOOR_CLOSED_FORM, // (2 - sqrt 3)/6
  marginFloorExpression: '(2 - sqrt(3)) / 6',
  worstCaseMarginExact: WORST_CASE_MARGIN_EXACT,
  floorGap: WORST_CASE_MARGIN_EXACT - MARGIN_FLOOR_CLOSED_FORM, // ~5.5e-5 > 0
  isNewBound: false,
  honestNote:
    'No false QED. Closed-form FLOOR for the worst-case margin of an ALREADY-PROVEN cap (imp-2786 ' +
    'C_shock < 1/3); it is NOT a new bound and does NOT close C_H. The squared-gap surrogate stays ' +
    'REFUTED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

// ── Build-time assertions ────────────────────────────────────────────────────
export const C_SHOCK_WORST_CASE_MARGIN_FLOOR_ASSERTIONS = [
  {
    id: 'imp3132-height-pinned-above-e8',
    holds: () =>
      Number.isFinite(GAMMA_MIN) &&
      Math.abs(GAMMA_MIN - 2990.0431783071244) < 1e-6 &&
      LOG_GAMMA_MIN > LOG_GAMMA_THRESHOLD,
    why:
      'STEP 1: the worst-case height gamma_min = effectiveHeightForN(2458) must pin to ~2990.04 with ' +
      'log gamma_min > 8 — the rational threshold the closed-form margin floor rests on. If the height ' +
      'mapping drifts below e^8 the floor derivation no longer holds and this fires.',
  },
  {
    id: 'imp3132-reduced-inequality-headroom',
    holds: () =>
      REDUCED_INEQUALITY_HEADROOM > 2 &&
      Math.abs(REDUCED_INEQUALITY_HEADROOM - 2.0030431071858565) < 1e-6 &&
      GAMMA_MIN / Math.exp(REDUCED_INEQUALITY_FLOOR) > Math.exp(2),
    why:
      'STEP 2: at the worst case N_min=2458 the cap-reducing inequality log gamma_N > 6 must carry ' +
      '~2.003 of headroom (equivalently gamma_min/e^6 ~ 7.41 > e^2), so the cap C_shock < 1/3 holds at ' +
      'the smallest assembly with the rational log gamma_min > 8 margin to spare.',
  },
  {
    id: 'imp3132-margin-floor-is-valid-closed-form',
    holds: () => {
      // (2 - sqrt 3)/6 must equal 1/3 - 1/(2 sqrt 3) to machine precision and sit
      // strictly below the exact worst-case margin while staying positive.
      const algebraicIdentity =
        Math.abs(MARGIN_FLOOR_CLOSED_FORM - (C_SHOCK_CAP - C_SHOCK_CEILING)) < 1e-15;
      return (
        algebraicIdentity &&
        MARGIN_FLOOR_CLOSED_FORM > 0 &&
        MARGIN_FLOOR_CLOSED_FORM < WORST_CASE_MARGIN_EXACT &&
        Math.abs(MARGIN_FLOOR_CLOSED_FORM - 0.04465819873852042) < 1e-12 &&
        WORST_CASE_MARGIN_EXACT - MARGIN_FLOOR_CLOSED_FORM > 0 &&
        WORST_CASE_MARGIN_EXACT - MARGIN_FLOOR_CLOSED_FORM < 1e-3
      );
    },
    why:
      'STEP 3: the closed expression (2 - sqrt 3)/6 must equal 1/3 - 1/(2 sqrt 3) exactly, be strictly ' +
      'positive, and sit just below the exact worst-case margin 0.0447131 (gap ~5.5e-5). This is the ' +
      'certified floor: margin(N) >= (2 - sqrt 3)/6 for every assembly N since log gamma_N >= log gamma_min > 8.',
  },
  {
    id: 'imp3132-cross-check-not-a-beat',
    holds: () => {
      const r = C_SHOCK_WORST_CASE_MARGIN_FLOOR_IMP3132;
      return (
        r.isNewBound === false &&
        /SOTA/.test(r.honestNote) &&
        /REFUTED/.test(r.honestNote) &&
        /FLOORED/.test(r.verdict)
      );
    },
    why:
      'VERDICT LOCK: a closed-form FLOOR on the worst-case margin of an already-proven cap, NOT a new ' +
      'bound. The surrogate stays refuted and Platt-Trudgian Lambda <= 0.2 stays SOTA. Blocks any future ' +
      'edit from inflating this margin floor into a claimed C_H closure or rigorous beat.',
  },
];

for (const a of C_SHOCK_WORST_CASE_MARGIN_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3132 assertion failed: ' + a.id + ' — ' + a.why);
  }
}
