/**
 * @module imp-124787-knee-amp-quadratic-richardson
 *
 * imp-124787 (numerical, frontier-direction): imp-124771 F3 found that the LINEAR (two-finest-bracket)
 * Richardson extrapolation of the knee E_flow amplification A(W) toward the continuum W -> 0 gives
 * A ~ 9.33, UNDERshooting the imp-97804 closed-form A ~ 9.42 by ~1%, and attributed that undershoot to
 * "mild concavity of A(W) near the continuum". A linear chord ignores curvature by construction, so if
 * the concavity story is right an O(W^2) Richardson model should close the ~1% gap. This leaf reuses the
 * imp-124771 A(W) bracket-width ladder VERBATIM (W in {0.25, 0.20, 0.15, 0.125, 0.10} at the fixed fine
 * PPD = 120) and fits an O(W^2) Richardson model in place of the linear chord, in three subset variants
 * (a 3-point exact quadratic through the finest brackets, and quadratic least squares over the four and
 * all five rungs), then compares each W -> 0 limit and its residual against the closed-form 9.42.
 *
 * THE LADDER (imported, not recomputed -- no fresh terms)
 * ------------------------------------------------------
 *   A(W) at PPD = 120 from imp-124771.widthLadder:
 *     W = 0.25 -> 9.542, 0.20 -> 9.537, 0.15 -> 9.477, 0.125 -> 9.412, 0.10 -> 9.397.
 *   imp-124771 read this as monotone concave and drew the linear W -> 0 chord from the two finest rungs
 *   to get A ~ 9.33. Here the same rungs feed a quadratic instead.
 *
 * THE MODELS
 * ----------
 *   linear (imp-124771 baseline):  A(W) = A0 + a1 W, chord through the two finest rungs -> A0 ~ 9.33.
 *   quad3:   A(W) = A0 + a1 W + a2 W^2, exact interpolation through the three finest rungs (0.15/0.125/
 *            0.10), evaluated at W = 0.
 *   quadLsq4 / quadLsq5:  the same quadratic by ordinary least squares over the four finest rungs and
 *            over all five rungs, evaluated at W = 0.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE QUADRATIC DOES NOT CLOSE THE GAP -- IT OVERCORRECTS, UNSTABLY. Far from landing on 9.42,
 *        the O(W^2) W -> 0 limit swings wildly with the point subset: quad3 (three finest) OVERshoots to
 *        A ~ 9.83 (+4.3%), while quadLsq5 (all five) UNDERshoots to A ~ 9.10 (-3.4%) and quadLsq4 to
 *        A ~ 9.24 (-1.9%). The spread across the three quadratic variants is ~0.73 (~8% of A), an order
 *        of magnitude larger than the ~1% gap they were meant to close. The linear chord (9.33, 0.9%)
 *        and the raw finest bracket A(0.10) = 9.397 (0.27%, imp-124771 F2) both sit CLOSER to 9.42 than
 *        any quadratic extrapolation.
 *   (F2) WHY: THE LADDER IS EXTRAPOLATION-JITTER-LIMITED, NOT CLEANLY CONCAVE. The point-to-point slope
 *        dA/dW is NON-monotone across the rungs: ~0.09 (0.25->0.20), 1.20 (0.20->0.15), 2.60 (0.15->
 *        0.125), 0.62 (0.125->0.10) per unit W. A genuinely concave A(W) would have a slope that varies
 *        monotonically; the ~4x swing and reversal instead reflect D2 zero-crossing quantization jitter
 *        (the knee cstar is a linear interpolation of a discretely-sampled second-difference curve whose
 *        edge positions shift with W). That jitter (~0.01-0.05 in A) is comparable to the true curvature
 *        signal, so the O(W^2) coefficient is not cleanly measurable and the quadratic limit is dominated
 *        by whichever three rungs it is anchored to.
 *
 * The punchline: the imp-124771 "mild concavity" gloss on the ~1% linear undershoot is NOT confirmable by
 * a higher-order Richardson fit. Raising the extrapolation order does not sharpen the W -> 0 estimate; it
 * amplifies ladder jitter. The discrete-vs-closed-form reconciliation therefore stands at the FINITE-
 * BRACKET level (A(0.10) ~ 9.40, matching 9.42 to ~0.3%, imp-124771 F2), NOT via an O(W^2) continuum
 * extrapolation. SUB-GAP: cleanly separating the O(W^2) curvature of A(W) from the D2-crossing jitter
 * needs a jitter-suppressed knee estimator (e.g. a smooth-fit second difference, or a much finer PPD/W
 * co-refinement), out of reach of the stored 4-decimal ladder.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-
 * conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124771-knee-amp-bracket-width-reconcile (the A(W) ladder + linear W -> 0 chord ~9.33)
 * @see imp-97804-knee-eflow-linear-expansion (closed-form A ~ 9.42 via the continuous d2p/dt2=0 knee)
 * @see imp-97805-knee-eflow-amplification-ratio (discrete A ~ 9.54, PPD-refined at W = 0.25)
 */

import { IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE } from './imp-124771-knee-amp-bracket-width-reconcile.js';
import { IMP97804_KNEE_EFLOW_LINEAR_EXPANSION } from './imp-97804-knee-eflow-linear-expansion.js';

// --- The imp-124771 A(W) ladder, imported VERBATIM (fixed fine PPD = 120). ---
const LADDER = IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE.widthLadder
  .filter((r) => r.A !== null)
  .map((r) => ({ W: r.W, A: r.A }))
  .sort((a, b) => a.W - b.W); // ascending W: 0.10 .. 0.25
const CLOSED_FORM_A = IMP97804_KNEE_EFLOW_LINEAR_EXPANSION.amplification; // ~9.422

// --- Linear (imp-124771) W -> 0 chord through the two finest rungs (reproduced for contrast). ---
const [q1, q2] = LADDER;
const LIN_SLOPE = (q2.A - q1.A) / (q2.W - q1.W);
const LINEAR_W0 = q1.A - LIN_SLOPE * q1.W; // ~9.33

// --- O(W^2) Richardson: exact quadratic interpolation through k finest rungs, evaluated at W = 0. ---
function quadInterpAtZero(pts) {
  const x = pts.map((p) => p.W);
  const y = pts.map((p) => p.A);
  let v = 0;
  for (let i = 0; i < pts.length; i++) {
    let lag = 1;
    for (let j = 0; j < pts.length; j++) if (j !== i) lag *= (0 - x[j]) / (x[i] - x[j]);
    v += y[i] * lag;
  }
  return v;
}

// --- O(W^2) Richardson by ordinary least squares over k rungs, intercept (W = 0). ---
function quadLsqAtZero(pts) {
  let S0 = pts.length;
  let S1 = 0;
  let S2 = 0;
  let S3 = 0;
  let S4 = 0;
  let T0 = 0;
  let T1 = 0;
  let T2 = 0;
  for (const { W, A } of pts) {
    S1 += W;
    S2 += W * W;
    S3 += W ** 3;
    S4 += W ** 4;
    T0 += A;
    T1 += A * W;
    T2 += A * W * W;
  }
  const M = [
    [S0, S1, S2],
    [S1, S2, S3],
    [S2, S3, S4],
  ];
  const b = [T0, T1, T2];
  for (let i = 0; i < 3; i++) {
    const piv = M[i][i];
    for (let j = 0; j < 3; j++) M[i][j] /= piv;
    b[i] /= piv;
    for (let k = 0; k < 3; k++) {
      if (k === i) continue;
      const f = M[k][i];
      for (let j = 0; j < 3; j++) M[k][j] -= f * M[i][j];
      b[k] -= f * b[i];
    }
  }
  return b[0]; // intercept = A at W = 0
}

const QUAD3_W0 = quadInterpAtZero(LADDER.slice(0, 3)); // three finest (0.10/0.125/0.15) ~9.83
const QUAD_LSQ4_W0 = quadLsqAtZero(LADDER.slice(0, 4)); // four finest ~9.24
const QUAD_LSQ5_W0 = quadLsqAtZero(LADDER); // all five ~9.10

const pct = (a) => +(Math.abs(a / CLOSED_FORM_A - 1) * 100).toFixed(3);
const LINEAR_PCT = pct(LINEAR_W0); // ~0.9%
const QUAD3_PCT = pct(QUAD3_W0); // ~4.3%
const QUAD_LSQ4_PCT = pct(QUAD_LSQ4_W0); // ~1.9%
const QUAD_LSQ5_PCT = pct(QUAD_LSQ5_W0); // ~3.4%
const QUAD_VALUES = [QUAD3_W0, QUAD_LSQ4_W0, QUAD_LSQ5_W0];
const QUAD_SPREAD = +(Math.max(...QUAD_VALUES) - Math.min(...QUAD_VALUES)).toFixed(4); // ~0.73
const FINE_BRACKET_PCT = pct(q1.A); // raw A(0.10) ~0.27%

// --- Point-to-point slope dA/dW (non-monotone -> jitter, not clean concavity). ---
const SLOPES = [];
for (let i = 1; i < LADDER.length; i++) {
  SLOPES.push(+((LADDER[i].A - LADDER[i - 1].A) / (LADDER[i].W - LADDER[i - 1].W)).toFixed(3));
}
const SLOPE_MONOTONE =
  SLOPES.every((s, i) => i === 0 || s >= SLOPES[i - 1]) ||
  SLOPES.every((s, i) => i === 0 || s <= SLOPES[i - 1]);

export const IMP124787_KNEE_AMP_QUADRATIC_RICHARDSON = {
  id: 'imp-124787',
  proofSection: 'S-frontier',
  question:
    'imp-124771 F3 found the LINEAR (two-finest-bracket) Richardson extrapolation of the knee E_flow ' +
    'amplification A(W) toward W -> 0 gives A ~ 9.33, undershooting the imp-97804 closed-form A ~ 9.42 by ' +
    '~1%, and blamed mild concavity of A(W). A linear chord ignores curvature; does an O(W^2) Richardson ' +
    'model close the gap? Reuse the imp-124771 A(W) ladder verbatim (W in {0.25,0.20,0.15,0.125,0.10} at ' +
    'fine PPD = 120), fit a quadratic in three point-subset variants, and quantify the residual. ' +
    'Measurement/sensitivity only; C_mb GUE-conditional (imp-486) untouched; no bound moves; NO QED.',
  measuredQuantity:
    'the O(W^2) Richardson W -> 0 limit of the imp-124771 amplification ladder A(W), fit as (a) an exact ' +
    'quadratic through the three finest rungs, (b) quadratic least squares over the four finest, and (c) ' +
    'quadratic least squares over all five, each compared to the imp-97804 closed-form A ~ 9.42',
  ladder: LADDER, // imported imp-124771.widthLadder, ascending W
  closedFormA: +CLOSED_FORM_A.toFixed(3), // ~9.422
  linearW0: +LINEAR_W0.toFixed(4), // ~9.33 (imp-124771 baseline, reproduced)
  linearResidualPct: LINEAR_PCT, // ~0.9%
  quad3W0: +QUAD3_W0.toFixed(4), // three finest, exact quadratic ~9.83 (OVERSHOOT)
  quad3ResidualPct: QUAD3_PCT, // ~4.3%
  quadLsq4W0: +QUAD_LSQ4_W0.toFixed(4), // four finest LSQ ~9.24 (undershoot)
  quadLsq4ResidualPct: QUAD_LSQ4_PCT, // ~1.9%
  quadLsq5W0: +QUAD_LSQ5_W0.toFixed(4), // all five LSQ ~9.10 (undershoot)
  quadLsq5ResidualPct: QUAD_LSQ5_PCT, // ~3.4%
  quadraticSpread: QUAD_SPREAD, // ~0.73 -- an order of magnitude larger than the ~1% gap
  fineBracketResidualPct: FINE_BRACKET_PCT, // raw A(0.10) ~0.27% -- closer than any extrapolation
  pointSlopes: SLOPES, // dA/dW non-monotone (~0.09,1.20,2.60,0.62) -> jitter, not clean concavity
  slopeMonotone: SLOPE_MONOTONE, // false
  finding: {
    F1_quadratic_overcorrects_unstably:
      'The O(W^2) W -> 0 limit does NOT land on ' + (+CLOSED_FORM_A.toFixed(2)) + '; it swings with the ' +
      'point subset: quad3 (three finest) OVERshoots to A ~ ' + (+QUAD3_W0.toFixed(2)) + ' (+' + QUAD3_PCT +
      '%), quadLsq5 (all five) UNDERshoots to A ~ ' + (+QUAD_LSQ5_W0.toFixed(2)) + ' (-' + QUAD_LSQ5_PCT +
      '%), quadLsq4 to A ~ ' + (+QUAD_LSQ4_W0.toFixed(2)) + ' (-' + QUAD_LSQ4_PCT + '%). The spread across ' +
      'the three quadratic variants is ~' + QUAD_SPREAD + ' (~8% of A), an order of magnitude larger than ' +
      'the ~1% gap. The linear chord (' + (+LINEAR_W0.toFixed(2)) + ', ' + LINEAR_PCT + '%) and the raw ' +
      'finest bracket A(0.10) = ' + q1.A + ' (' + FINE_BRACKET_PCT + '%) both sit CLOSER to ' +
      (+CLOSED_FORM_A.toFixed(2)) + ' than any quadratic extrapolation.',
    F2_ladder_is_jitter_limited:
      'The point-to-point slope dA/dW is NON-monotone across the rungs (~' + SLOPES.join(', ') + ' per ' +
      'unit W, coarse->fine). A genuinely concave A(W) would vary its slope monotonically; the ~4x swing ' +
      'and reversal instead reflect D2 zero-crossing quantization jitter (the knee cstar is a linear ' +
      'interpolation of a discretely-sampled second-difference curve whose edge positions shift with W). ' +
      'That jitter (~0.01-0.05 in A) is comparable to the true curvature, so the O(W^2) coefficient is ' +
      'not cleanly measurable and the quadratic limit is dominated by its anchoring rungs.',
  },
  subGap:
    'Cleanly separating the O(W^2) curvature of A(W) from the D2-crossing quantization jitter needs a ' +
    'jitter-suppressed knee estimator (a smooth-fit second difference, or a co-refined PPD/W ladder), ' +
    'out of reach of the stored 4-decimal amplification ladder.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Fitting an O(W^2) Richardson model to the imp-124771 ' +
    'A(W) ladder does NOT close the ~1% linear undershoot against the imp-97804 closed-form A ~ ' +
    (+CLOSED_FORM_A.toFixed(2)) + '; it OVERCORRECTS unstably, the W -> 0 limit swinging from A ~ ' +
    (+QUAD_LSQ5_W0.toFixed(2)) + ' to A ~ ' + (+QUAD3_W0.toFixed(2)) + ' (spread ~' + QUAD_SPREAD + ') ' +
    'depending on the anchoring rungs -- an order of magnitude larger than the gap it was meant to close. ' +
    'The point-to-point slope dA/dW is non-monotone, so A(W) is extrapolation-jitter-limited (D2 zero-' +
    'crossing quantization), not cleanly concave; the imp-124771 "mild concavity" gloss on the linear ' +
    'undershoot is NOT confirmable at higher order. The discrete-vs-closed-form reconciliation stands at ' +
    'the FINITE-BRACKET level (A(0.10) ~ ' + q1.A + ', matching ' + (+CLOSED_FORM_A.toFixed(2)) + ' to ~' +
    FINE_BRACKET_PCT + '%, imp-124771 F2), NOT via an O(W^2) continuum extrapolation. SUB-GAP: a jitter-' +
    'suppressed knee estimator is needed to measure the true curvature. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= ' +
    '0.2 remains SOTA.',
  citation:
    'imp-124771 (A(W) bracket-width ladder + linear W -> 0 chord ~9.33); imp-97804 (closed-form A ~ 9.42 ' +
    'via the continuous d2p/dt2 = 0 knee); imp-97805 (discrete A ~ 9.54, PPD-refined at W = 0.25); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP124787_KNEE_AMP_QUADRATIC_RICHARDSON_ASSERTIONS = [
  {
    // Reuse gate: the imported ladder is the imp-124771 five-rung width ladder.
    id: 'imp124787-reuses-imp124771-ladder',
    description: 'the A(W) ladder imported from imp-124771 has the five expected bracket widths',
    holds: () => {
      const ws = LADDER.map((r) => r.W).sort((a, b) => a - b);
      const want = [0.1, 0.125, 0.15, 0.2, 0.25];
      return ws.length === 5 && ws.every((w, i) => Math.abs(w - want[i]) < 1e-9);
    },
  },
  {
    // Reuse gate: the linear W -> 0 chord reproduces the imp-124771 value (~9.33) to < 0.01.
    id: 'imp124787-reproduces-imp124771-linear',
    description: 'the reproduced linear W -> 0 chord matches the imp-124771 wZeroExtrapolation (~9.33) to < 0.01',
    holds: () =>
      Math.abs(LINEAR_W0 - IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE.wZeroExtrapolation) < 0.01,
  },
  {
    // (F1): the quadratic OVERCORRECTS unstably -- the three-finest quadratic overshoots the closed form.
    id: 'imp124787-quad3-overshoots',
    description: 'the three-finest exact quadratic W -> 0 limit overshoots the closed form (> 9.42, resid > 2%)',
    holds: () => QUAD3_W0 > CLOSED_FORM_A && QUAD3_PCT > 2,
  },
  {
    // (F1): the LSQ quadratics undershoot -- the quadratic limit is subset-unstable, spread >> the gap.
    id: 'imp124787-quadratic-spread-exceeds-gap',
    description: 'the quadratic W -> 0 estimates span > 0.5 (an order of magnitude beyond the ~1% gap they should close)',
    holds: () => QUAD_LSQ5_W0 < CLOSED_FORM_A && QUAD_SPREAD > 0.5,
  },
  {
    // (F1): neither the quadratic nor the linear extrapolation beats the raw finest bracket A(0.10).
    id: 'imp124787-fine-bracket-beats-extrapolations',
    description: 'the raw finest bracket A(0.10) residual is smaller than every quadratic extrapolation residual',
    holds: () =>
      FINE_BRACKET_PCT < QUAD3_PCT && FINE_BRACKET_PCT < QUAD_LSQ4_PCT && FINE_BRACKET_PCT < QUAD_LSQ5_PCT,
  },
  {
    // (F2): the point-to-point slope dA/dW is non-monotone -> jitter, not clean concavity.
    id: 'imp124787-slope-nonmonotone-jitter',
    description: 'the point-to-point slope dA/dW is non-monotone across the rungs (jitter, not clean concavity)',
    holds: () => SLOPE_MONOTONE === false,
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp124787-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124787_KNEE_AMP_QUADRATIC_RICHARDSON.isRigorous === false &&
      /NO QED/.test(IMP124787_KNEE_AMP_QUADRATIC_RICHARDSON.verdict) &&
      /remains SOTA/.test(IMP124787_KNEE_AMP_QUADRATIC_RICHARDSON.verdict),
  },
];

for (const a of IMP124787_KNEE_AMP_QUADRATIC_RICHARDSON_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124787-knee-amp-quadratic-richardson assertion failed: ${a.id}`);
  }
}
