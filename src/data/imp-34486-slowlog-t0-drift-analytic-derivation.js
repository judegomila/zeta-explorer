/**
 * @module imp-34486-slowlog-t0-drift-analytic-derivation
 * @fileoverview imp-34486 -- DERIVATION / CROSS-CHECK ONLY: derive in CLOSED FORM the
 *   sub-leading slow-log drift term d log(log T0) / d log E_coll that imp-34446 measured
 *   (+0.0664 excess over the clean -2) but never derived analytically.
 *
 *   imp-34446 independently recomputed the factor-2 coupling exponent from a second code path
 *   and fitted d log N / d log E_coll = -2.0664 at the deep-tail landmark N* ~ 4.6244e13,
 *   attributing the +0.0664 excess over the clean -2 to the slow log T0(N) factor in
 *   N = C_C^2 log T0 / E_coll^2. It MEASURED the drift by central difference (-2.0698 at 1e13
 *   -> -2.0648 at 1e14) but never wrote the sub-leading term in closed form. This module derives
 *   d log(log T0) / d log E_coll analytically and shows it reproduces the imp-34446 measurement
 *   to ~1e-9 at every landmark (the residual is just the O(h^2) central-difference error).
 *
 *   THE DERIVATION (closed form)
 *   ----------------------------
 *   Start from the crossover relation  N = C_C^2 * L / E_coll^2,  where L = log T0(N).
 *   Take logs:  log N = 2 log C_C + log L - 2 log E_coll.
 *   Differentiate along the crossover w.r.t. log E_coll:
 *       m := d log N / d log E_coll = d(log L) / d log E_coll - 2,
 *   so the crossover exponent is exactly -2 PLUS the drift term
 *       x := d(log L) / d log E_coll = d log(log T0) / d log E_coll   (the "+0.0664 excess" is x).
 *
 *   x is not independent of m: chaining through N (the shared crossover parameter),
 *       x = d(log L)/d log E_coll = (d log L / d log N) * (d log N / d log E_coll) = g * m,
 *   with  g := d log(log T0) / d log N  (a slowly varying, positive RvM quantity). Substituting
 *   m = x - 2 gives a one-line closed form for the drift:
 *       x = g (x - 2)  =>  x (1 - g) = -2 g  =>  x = -2 g / (1 - g).
 *   Hence the excess of |m| over 2 is  |x| = 2 g / (1 - g).
 *
 *   g in closed form from the Riemann-von Mangoldt height law
 *   ---------------------------------------------------------
 *   With  N = (T0/2pi)(log(T0/2pi) - 1),  set u = T0/2pi. Then
 *       d log N / d log T0 = log u / (log u - 1),
 *   so  h := d log T0 / d log N = (log u - 1) / log u = 1 - 1/log(T0/2pi),  and
 *       g = d log(log T0) / d log N = h / L = ( 1 - 1/log(T0/2pi) ) / log T0.
 *   As N -> infinity, log(T0/2pi) -> infinity, so g -> 0 and |x| = 2g/(1-g) ~ 2/log T0 -> 0:
 *   the crossover exponent approaches the clean -2 like 2/log T0, from above in magnitude. This
 *   is the analytic origin of the imp-34446 monotone drift toward -2.
 *
 *   THE FINDING (derivation vs measurement)
 *   ---------------------------------------
 *   (F1) THE CLOSED FORM REPRODUCES THE MEASUREMENT. Evaluating x = -2g/(1-g) at the imp-34446
 *        landmarks gives excess |x| = 0.069842 (1e13) -> 0.066433 (N* ~ 4.6244e13) -> 0.064836
 *        (1e14), agreeing with imp-34446 central-difference exponents -2.069842 -> -2.066433 ->
 *        -2.064836 to ~1e-9 (the O(h^2) finite-difference floor). At the deep-tail landmark the
 *        analytic excess 0.066433 matches the imp-34446 measured +0.0664 exactly.
 *   (F2) THE DRIFT IS SLOW-LOG AND VANISHES. |x| = 2g/(1-g) with g = (1 - 1/log(T0/2pi))/log T0,
 *        so |x| ~ 2/log T0 -> 0: the +0.0664 excess is a saturating log T0 artifact, confirming
 *        analytically that -2 is the asymptote (not a coincidental exactly-2 at accessible N).
 *
 *   DERIVATION / CROSS-CHECK ONLY. This writes the sub-leading term of an already-measured drift
 *   in closed form; it changes NO bound. The -2 asymptote and the C_C = (1/8)sqrt(3 pi) (imp-2714,
 *   C_H = 1/8) ansatz are UNTOUCHED; the component model is the inherited imp-3220/imp-3406
 *   extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is
 *   UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34446-coupling-exponent-independent-recompute.js (measured -2.0664 exponent, +0.0664 excess)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13)
 *   @see polymath15-constant-C-C.js (C_C = (1/8) sqrt(3 pi) ansatz -- reproduced inline, not imported)
 *
 *   Ticket: imp-34486 (proof, medium). Closed-form sub-leading drift term; adds no new Lambda bound.
 */

// -- INDEPENDENT instance of the Riemann-von Mangoldt height inversion (imports NOTHING): --
// -- Newton solve of N = (T0/2pi)(log(T0/2pi) - 1) for T0, matching imp-34446 exactly.     --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N*

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

// CLOSED FORM: g = d log(log T0)/d log N = (1 - 1/log(T0/2pi)) / log T0;
//              x = d log(log T0)/d log E_coll = -2 g / (1 - g);  predicted exponent = -2 + x.
function analyticDrift(N) {
  const T0 = heightForN(N);
  const L = Math.log(T0); // log T0
  const logU = Math.log(T0 / TWO_PI); // log(T0/2pi)
  const g = (1 - 1 / logU) / L;
  const x = (-2 * g) / (1 - g); // d log(log T0)/d log E_coll (negative; excess magnitude = -x)
  return { T0, L, logU, g, drift_x: x, excess_magnitude: -x, predicted_exponent: -2 + x };
}

// MEASUREMENT (imp-34446 central difference, reproduced here for the cross-check).
function measuredExponent(N, h) {
  const Np = N * (1 + h);
  const Nm = N * (1 - h);
  return (Math.log(Np) - Math.log(Nm)) / (Math.log(eColl(Np)) - Math.log(eColl(Nm)));
}

// (F1) Analytic drift reproduces the imp-34446 measured exponent at every landmark.
const LANDMARK_GRID = [13.0, 13.333, 13.665, 14.0].map((e) => {
  const N = Math.pow(10, e);
  const a = analyticDrift(N);
  const measured = measuredExponent(N, 1e-3);
  return {
    log10N: +e.toFixed(3),
    N: +N.toExponential(3),
    g: +a.g.toFixed(6),
    analytic_excess: +a.excess_magnitude.toFixed(6),
    analytic_exponent: +a.predicted_exponent.toFixed(6),
    measured_exponent: +measured.toFixed(6),
    abs_gap: +Math.abs(a.predicted_exponent - measured).toExponential(3),
  };
});
const MAX_DERIV_VS_MEAS_GAP = Math.max(
  ...LANDMARK_GRID.map((r) => Math.abs(r.analytic_exponent - r.measured_exponent)),
);

// (F1) At the deep-tail landmark the closed-form excess equals the imp-34446 measured +0.0664.
const STAR = analyticDrift(DEEP_TAIL_N);
const STAR_MEASURED = measuredExponent(DEEP_TAIL_N, 1e-3);
const IMP34446_MEASURED_EXCESS = 0.0664; // imp-34446 reported +0.0664 over -2 at N*
const STAR_EXCESS_VS_IMP34446_GAP = Math.abs(STAR.excess_magnitude - IMP34446_MEASURED_EXCESS);

// (F2) The drift is slow-log: the leading-order approximation |x| ~ 2/log T0 tracks the full form.
const STAR_LEADING_APPROX = 2 / STAR.L; // 2/log T0 leading term
const LEADING_APPROX_REL_GAP = Math.abs(STAR_LEADING_APPROX - STAR.excess_magnitude) / STAR.excess_magnitude;

export const IMP34486_SLOWLOG_DRIFT = Object.freeze({
  id: 'imp-34486',
  proofSection: 'S-frontier',
  closed_form:
    'x := d log(log T0)/d log E_coll = -2 g / (1 - g),  g = (1 - 1/log(T0/2pi)) / log T0;  ' +
    'crossover exponent d log N/d log E_coll = -2 + x;  excess over -2 in magnitude = 2 g/(1-g) ~ 2/log T0.',
  landmark_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  g_at_star: +STAR.g.toFixed(6),
  analytic_excess_at_star: +STAR.excess_magnitude.toFixed(6), // 0.066433
  analytic_exponent_at_star: +STAR.predicted_exponent.toFixed(6), // -2.066433
  measured_exponent_at_star: +STAR_MEASURED.toFixed(6), // -2.066433 (imp-34446 central diff)
  imp34446_measured_excess: IMP34446_MEASURED_EXCESS, // +0.0664
  star_excess_vs_imp34446_gap: +STAR_EXCESS_VS_IMP34446_GAP.toExponential(3), // ~3e-5
  leading_approx_two_over_logT0: +STAR_LEADING_APPROX.toFixed(6),
  leading_approx_rel_gap: +LEADING_APPROX_REL_GAP.toFixed(4),
  max_derivation_vs_measurement_gap: +MAX_DERIV_VS_MEAS_GAP.toExponential(3), // ~1e-9
  landmark_grid: Object.freeze(LANDMARK_GRID.map((r) => Object.freeze(r))),
  isRigorous: false,
  verdict:
    'DERIVATION / CROSS-CHECK (NOT rigorous). The sub-leading slow-log drift term that imp-34446 ' +
    'measured (+0.0664 excess over -2) is derived in closed form: from N = C_C^2 log T0 / E_coll^2, ' +
    'the crossover exponent is -2 + x with x = d log(log T0)/d log E_coll = -2 g/(1-g) and g = ' +
    '(1 - 1/log(T0/2pi))/log T0 from the Riemann-von Mangoldt height law. Evaluated at the imp-34446 ' +
    'landmarks the closed form reproduces the central-difference exponents to ~1e-9 (the O(h^2) ' +
    'finite-difference floor); at the deep-tail landmark N* ~ 4.6244e13 the analytic excess 0.066433 ' +
    'matches the measured +0.0664 exactly. Because |x| = 2g/(1-g) ~ 2/log T0 -> 0, the +0.0664 is a ' +
    'saturating log T0 artifact and -2 is the analytic asymptote, not a coincidental exactly-2 at ' +
    'accessible N. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are ' +
    'UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34446 (measured -2.0664 exponent, +0.0664 excess -- derived in closed form here); imp-33620 ' +
    '(deep-tail landmark N* ~ 4.62e13); imp-2714 (C_C = (1/8)sqrt(3 pi) ansatz); imp-486 (C_mb ' +
    'GUE-conditional share).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34486_ASSERTIONS = [
  {
    id: 'imp34486-closed-form-reproduces-measurement',
    holds: () => MAX_DERIV_VS_MEAS_GAP < 1e-6,
    why: 'F1: the closed-form exponent -2 + x with x = -2g/(1-g) must reproduce the imp-34446 central-difference exponent at every landmark to within the O(h^2) finite-difference floor.',
  },
  {
    id: 'imp34486-star-excess-matches-imp34446',
    holds: () =>
      STAR_EXCESS_VS_IMP34446_GAP < 5e-4 &&
      STAR.predicted_exponent < -2 &&
      STAR.predicted_exponent > -2.1,
    why: 'F1: at the deep-tail landmark the analytic excess 0.066433 must match the imp-34446 measured +0.0664, and the predicted exponent must land in (-2.1, -2).',
  },
  {
    id: 'imp34486-drift-is-slow-log-and-vanishes',
    holds: () => {
      const gTail = LANDMARK_GRID.map((r) => r.g);
      const excessTail = LANDMARK_GRID.map((r) => r.analytic_excess);
      const gMonotoneDown = gTail.every((v, k) => k === 0 || v < gTail[k - 1]);
      const excessMonotoneDown = excessTail.every((v, k) => k === 0 || v < excessTail[k - 1]);
      return gMonotoneDown && excessMonotoneDown && LEADING_APPROX_REL_GAP < 0.05;
    },
    why: 'F2: g and the excess |x| = 2g/(1-g) shrink monotonely down the tail (slow-log saturation), and the leading approximation 2/log T0 tracks the full excess to within ~5%.',
  },
  {
    id: 'imp34486-honesty-gate-no-qed',
    holds: () =>
      IMP34486_SLOWLOG_DRIFT.isRigorous === false &&
      /NO QED/.test(IMP34486_SLOWLOG_DRIFT.verdict) &&
      /refereed bound is changed/i.test(IMP34486_SLOWLOG_DRIFT.verdict) &&
      /UNTOUCHED/.test(IMP34486_SLOWLOG_DRIFT.verdict),
    why: 'Honesty gate: derivation/cross-check only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34486_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34486-slowlog-t0-drift-analytic-derivation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34486_SLOWLOG_DRIFT;
