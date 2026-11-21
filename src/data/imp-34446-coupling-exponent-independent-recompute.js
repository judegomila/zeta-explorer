/**
 * @module imp-34446-coupling-exponent-independent-recompute
 * @fileoverview imp-34446 -- MEASUREMENT ONLY: independently recompute the imp-34372
 *   factor-2 coupling exponent from a SECOND code path, rather than reading it off the
 *   two-landmark lockstep.
 *
 *   imp-34372 attributed the factor 2 in the coupling residual ~ 2 * (E_flow/E_trunc) to
 *   "N proportional to E_coll^-2", but READ that factor off the imp-34355 halving/far-tail
 *   lockstep ratio (residual / (E_flow/E_trunc) = 2.0885 -> 2.0788 -> 2.0634 across the three
 *   landmarks). The factor 2 is the EXPONENT of the closed-form crossover relation
 *   N = C_C^2 log T0(N) / E_coll^2  (equivalently E_coll = C_C sqrt(log T0 / N)): the -2 power
 *   of E_coll in N(E_coll) is what maps a (1+r)^-2 truncation shift into the leading 2r
 *   residual (imp-34270/imp-34351 exact form residual = 1 - [L/L]/(1+r)^2, r = E_flow/E_trunc).
 *   This module SOURCES that exponent DIRECTLY: it reimplements the Riemann-von Mangoldt height
 *   inversion and E_coll as an INDEPENDENT instance (imports NOTHING -- no lambda-rh-height-
 *   mapping, no polymath15 constant module, no zeros bundle), builds a fine geometric grid of N
 *   around the imp-33620 deep-tail landmark N* ~ 4.6244e13, and fits the LOCAL log-log exponent
 *   d log N / d log E_coll by central difference. It then cross-checks the fitted magnitude
 *   against the imp-34372 lockstep-read coupling ratio 2.0634.
 *
 *   THE SECOND CODE PATH (independent of the imp-34372 lockstep read)
 *   ----------------------------------------------------------------
 *     T0(N)   : Newton inversion of N = (T0/2pi)(log(T0/2pi) - 1)   (fresh instance below)
 *     E_coll  : C_C sqrt(log T0 / N),  C_C = (1/8) sqrt(3 pi) ~ 0.383748  (imp-2714 ansatz)
 *     slope   : d log N / d log E_coll via central difference on N*(1 +/- h)
 *   The closed-form inversion N = C_C^2 log T0 / E_coll^2 is verified to reproduce N to ~1e-16
 *   relative error at the landmark (the E_coll -> N map is exact), and E_coll(N*) ~ 3.0909e-7
 *   independently equals the sigma-landmark value E_trunc * thr/(1-thr) = 3.06e-5 * 0.01/0.99.
 *
 *   THE FINDING (measurement only)
 *   ------------------------------
 *   (F1) THE EXPONENT LANDS ON -2, PLUS A SMALL SLOW-log-T0 DRIFT. The independently fitted
 *        local exponent d log N / d log E_coll = -2.0664 at the deep-tail landmark N* ~ 4.6244e13
 *        (step-size-independent to 6 figures across h in {1e-2, 1e-3, 1e-4}). The excess over the
 *        clean -2 is +0.0664: it is the slow log T0(N) factor in N = C_C^2 log T0 / E_coll^2,
 *        whose contribution d log(log T0)/d log E_coll shrinks toward 0 as log T0 saturates, so
 *        the exponent approaches -2 from BELOW (in magnitude, from above -2) down the tail:
 *        -2.0698 (1e13) -> -2.0681 -> -2.0664 (N*) -> -2.0648 (1e14). The -2 power law is the
 *        asymptote; the accessible-N exponent sits ~3.3% above it, NOT a coincidence at -2 exactly.
 *   (F2) THE INDEPENDENT EXPONENT MATCHES THE imp-34372 LOCKSTEP-READ RATIO. |slope| = 2.0664
 *        agrees with the imp-34372 deep-tail coupling ratio residual/(E_flow/E_trunc) = 2.0634
 *        to ~0.15% -- a genuine cross-path confirmation that the factor 2 is the structural
 *        N-proportional-to-E_coll^-2 exponent, NOT an artifact of reading two lockstep landmarks.
 *        Both routes agree that the accessible-N value is ~2.06, drifting toward the exact-2 limit.
 *
 *   MEASUREMENT ONLY. This independently reproduces an already-established exponent; it adds no
 *   new Lambda bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 *   rigorous asymptotic; C_C is the imp-2714 (1/8)sqrt(3 pi) ansatz (C_H = 1/8), UNTOUCHED; the
 *   C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34372-lockstep-ratio-deeptail-persistence.js (lockstep-read coupling ratio 2.0634)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, E_coll ladder)
 *   @see imp-34351-crossover-offset-division-form-fartail-crossvalidation.js (exact residual = 1 - [L/L]/(1+r)^2)
 *   @see polymath15-constant-C-C.js (C_C = (1/8) sqrt(3 pi) ansatz -- reproduced inline here, not imported)
 *
 *   Ticket: imp-34446 (numerical, medium). Presentation-independent MEASUREMENT of an already-
 *   established quantity via a second code path; adds no new Lambda bound.
 */

// -- INDEPENDENT instance of the Riemann-von Mangoldt height inversion (no import of --
// -- lambda-rh-height-mapping): Newton solve of N = (T0/2pi)(log(T0/2pi) - 1) for T0. --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N*
const E_TRUNC_PT = 3.06e-5; // imp-2631 fixed-strip floor (for the sigma-landmark cross-check only)
const DEEP_TAIL_THR = 0.01; // imp-33620 deep-tail crossover threshold

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

// Local log-log exponent d log N / d log E_coll by central difference on N*(1 +/- h).
function couplingExponent(N, h) {
  const Np = N * (1 + h);
  const Nm = N * (1 - h);
  const dLogN = Math.log(Np) - Math.log(Nm);
  const dLogE = Math.log(eColl(Np)) - Math.log(eColl(Nm));
  return dLogN / dLogE;
}

// (Sanity) The closed-form inversion N = C_C^2 log T0 / E_coll^2 must return N exactly.
const EC_AT_STAR = eColl(DEEP_TAIL_N);
const N_RECOVERED = (C_C * C_C * Math.log(heightForN(DEEP_TAIL_N))) / (EC_AT_STAR * EC_AT_STAR);
const INVERSION_REL_ERR = Math.abs(N_RECOVERED - DEEP_TAIL_N) / DEEP_TAIL_N;

// (Cross-check) E_coll at the landmark equals the sigma-crossover value E_trunc thr/(1-thr).
const EC_LANDMARK_EXPECTED = (E_TRUNC_PT * DEEP_TAIL_THR) / (1 - DEEP_TAIL_THR);

// (F1) The step-size-independent local exponent at the landmark.
const EXPONENT_AT_STAR = +couplingExponent(DEEP_TAIL_N, 1e-3).toFixed(6); // -2.066433
const EXPONENT_STEP_STABLE =
  Math.abs(couplingExponent(DEEP_TAIL_N, 1e-2) - couplingExponent(DEEP_TAIL_N, 1e-4)) < 1e-5;

// (F1) The exponent drifts monotonely toward -2 down the tail (magnitude shrinking).
const TAIL_GRID = [13.0, 13.333, 13.665, 14.0].map((e) => {
  const N = Math.pow(10, e);
  return {
    log10N: +e.toFixed(3),
    N: +N.toExponential(3),
    E_coll: +eColl(N).toExponential(4),
    exponent: +couplingExponent(N, 1e-3).toFixed(6),
  };
});
const EXPONENT_MONOTONE_TOWARD_MINUS_TWO = TAIL_GRID.every(
  (r, k) => k === 0 || r.exponent > TAIL_GRID[k - 1].exponent, // rising toward -2 (less negative)
);

// (F2) Cross-path agreement with the imp-34372 lockstep-read coupling ratio.
const IMP34372_LOCKSTEP_RATIO_DEEPTAIL = 2.0634; // imp-34372 residual/(E_flow/E_trunc) at deep tail
const CROSS_PATH_REL_GAP = +(
  (Math.abs(Math.abs(EXPONENT_AT_STAR) - IMP34372_LOCKSTEP_RATIO_DEEPTAIL) /
    IMP34372_LOCKSTEP_RATIO_DEEPTAIL) *
  100
).toFixed(4); // ~0.15%

export const IMP34446_COUPLING_EXPONENT = Object.freeze({
  id: 'imp-34446',
  proofSection: 'S-frontier',
  landmark_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  inversion_rel_err: INVERSION_REL_ERR,
  E_coll_at_landmark: +EC_AT_STAR.toExponential(6),
  E_coll_landmark_expected: +EC_LANDMARK_EXPECTED.toExponential(6),
  exponent_at_star: EXPONENT_AT_STAR, // -2.066433
  exponent_excess_over_minus_two: +(EXPONENT_AT_STAR + 2).toFixed(6), // -0.066433 (slow-logT0 drift)
  step_size_stable: EXPONENT_STEP_STABLE,
  tail_grid: Object.freeze(TAIL_GRID.map((r) => Object.freeze(r))),
  exponent_monotone_toward_minus_two: EXPONENT_MONOTONE_TOWARD_MINUS_TWO,
  imp34372_lockstep_ratio_deeptail: IMP34372_LOCKSTEP_RATIO_DEEPTAIL,
  cross_path_rel_gap_pct: CROSS_PATH_REL_GAP, // ~0.15%
  isRigorous: false,
  verdict:
    'MEASUREMENT (second code path, NOT rigorous). An INDEPENDENT reimplementation of the ' +
    'Riemann-von Mangoldt height inversion and E_coll = C_C sqrt(log T0 / N) (imports NOTHING) ' +
    'fits the local exponent d log N / d log E_coll = -2.0664 at the imp-33620 deep-tail landmark ' +
    'N* ~ 4.6244e13 (step-size-stable to 6 figures). This DIRECTLY sources the factor 2 that ' +
    'imp-34372 read off the two-landmark lockstep: the -2 power of E_coll in N = C_C^2 log T0 / ' +
    'E_coll^2 is the origin of the leading 2r residual coupling. The +0.0664 excess over -2 is the ' +
    'slow log T0(N) factor, shrinking toward 0 as log T0 saturates, so the exponent approaches -2 ' +
    'from above (in magnitude) down the tail (-2.0698 -> -2.0648 across 1e13..1e14). The fitted ' +
    '|exponent| 2.0664 matches the imp-34372 lockstep-read coupling ratio 2.0634 to ~0.15% -- a ' +
    'cross-path confirmation that the factor 2 is the structural N-proportional-to-E_coll^-2 ' +
    'exponent, NOT a lockstep artifact. The closed-form inversion reproduces N to ~1e-16 and ' +
    'E_coll(N*) ~ 3.0909e-7 equals the sigma-landmark value E_trunc thr/(1-thr). C_C is the ' +
    'imp-2714 (1/8)sqrt(3 pi) ansatz UNTOUCHED; the C_mb GUE-conditional share per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34372 (lockstep-read coupling ratio 2.0634, reproduced/cross-checked here); imp-33620 ' +
    '(deep-tail landmark N* ~ 4.62e13); imp-34351 (exact residual = 1 - [L/L]/(1+r)^2); imp-2714 ' +
    '(C_C = (1/8)sqrt(3 pi) ansatz); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34446_ASSERTIONS = [
  {
    id: 'imp34446-closed-form-inversion-exact',
    holds: () =>
      INVERSION_REL_ERR < 1e-12 &&
      Math.abs(EC_AT_STAR - EC_LANDMARK_EXPECTED) / EC_LANDMARK_EXPECTED < 1e-3,
    why: 'The independent E_coll -> N inversion N = C_C^2 log T0 / E_coll^2 must reproduce N* to ~1e-12, and E_coll(N*) must equal the sigma-landmark value E_trunc thr/(1-thr) to ~0.1%.',
  },
  {
    id: 'imp34446-exponent-lands-near-minus-two',
    holds: () =>
      EXPONENT_AT_STAR < -2 &&
      EXPONENT_AT_STAR > -2.1 &&
      EXPONENT_STEP_STABLE,
    why: 'F1: the independently fitted local exponent d log N / d log E_coll lands in (-2.1, -2) at the deep-tail landmark (the -2 power law plus a small slow-log-T0 drift), step-size-stable.',
  },
  {
    id: 'imp34446-exponent-drifts-toward-minus-two',
    holds: () => EXPONENT_MONOTONE_TOWARD_MINUS_TWO,
    why: 'F1: the exponent magnitude shrinks monotonely toward the exact-2 asymptote down the tail as the slow log T0 factor saturates.',
  },
  {
    id: 'imp34446-cross-path-agrees-with-lockstep',
    holds: () => CROSS_PATH_REL_GAP < 0.5,
    why: 'F2: the second-code-path |exponent| 2.0664 must agree with the imp-34372 lockstep-read coupling ratio 2.0634 to within ~0.5% -- a genuine cross-path confirmation, not a lockstep artifact.',
  },
  {
    id: 'imp34446-honesty-gate-no-qed',
    holds: () =>
      IMP34446_COUPLING_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP34446_COUPLING_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP34446_COUPLING_EXPONENT.verdict) &&
      /UNTOUCHED/.test(IMP34446_COUPLING_EXPONENT.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34446_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34446-coupling-exponent-independent-recompute assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34446_COUPLING_EXPONENT;
