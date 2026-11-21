/**
 * @module imp-34531-drift-residual-vs-second-derivative
 * @fileoverview imp-34531 -- VERIFICATION ONLY: quantitatively verify the imp-34513 F1 claim
 *   that the raw central-difference drift residual SHRINKS "as the local curvature relaxes",
 *   i.e. that the O(h^2) finite-difference coefficient is proportional to the drift exponent's
 *   SECOND DERIVATIVE along the N = 1e13 .. 1e14 ladder.
 *
 *   imp-34513 F1 reported the raw residual |analytic - measured(h=1e-3)| shrinks monotonically
 *   1.194e-9 (1e13) -> 1.082e-9 (N*) -> 1.024e-9 (1e14) and ATTRIBUTED the shrink to "the local
 *   curvature relaxing" -- the O(h^2) truncation coefficient being proportional to the drift's
 *   second derivative -- but never verified that proportionality. This module supplies exactly
 *   that check, plus a stronger closed-form certification of what the O(h^2) coefficient IS.
 *
 *   WHAT THIS VERIFICATION ADDS (beyond imp-34513)
 *   ----------------------------------------------
 *   The imp-34446 "measurement" is a central difference of the crossover exponent
 *   m(N) = d log N / d log E_coll on the nodes N(1 +/- h). Expanding that central difference
 *   (nodes at p +/- log(1 +/- h) in p = log N) gives the leading truncation term
 *       measured(N,h) - true(N) = (h^2 / q')( q'' / (2 q') - q''' / (6 q') ) + O(h^4),
 *   where q(p) = log E_coll as a function of p = log N and true(N) = 1 / q'. So the raw residual
 *   raw = analytic - measured = -(that), and its O(h^2) coefficient is a q''-plus-q''' blend --
 *   DOMINATED by q'' (the curvature). This module:
 *     (i)   tabulates the closed-form second derivative d2m = d^2 m / d(log N)^2 of the drift
 *           exponent across the ladder (central second difference of analyticExponent in log N);
 *     (ii)  checks raw / d2m is roughly CONSTANT down the ladder -- the proportionality F1 asserts;
 *     (iii) CERTIFIES the coefficient: raw / h^2 matches the full analytic O(h^2) coefficient
 *           C_th = -(1/q')( q''/(2q') - q'''/(6q') ) to <1% at every landmark, and the pure
 *           second-derivative (q'') share of C_th is ~98% -- so ~98% of the shrink IS curvature,
 *           the residual ~2% being the q''' term (which is why raw/d2m drifts ~6%, not 0%).
 *
 *   THE FINDING (residual vs second derivative, standalone)
 *   ------------------------------------------------------
 *   (F1) RESIDUAL TRACKS THE DRIFT SECOND DERIVATIVE. The closed-form d2m = d^2 m/d(log N)^2 is
 *        negative and SHRINKS in magnitude down the ladder (-1.525e-4 -> -1.321e-4 -> -1.232e-4),
 *        in lockstep with the raw residual (1.194e-9 -> 1.082e-9 -> 1.024e-9): both monotone,
 *        same sign structure, and raw/d2m is constant to ~6% (7.83e-6 -> 8.31e-6). So the shrink
 *        IS curvature-driven, verifying the imp-34513 F1 attribution quantitatively.
 *   (F2) THE COEFFICIENT IS CERTIFIED, AND IS ~98% CURVATURE. raw/h^2 equals the full analytic
 *        O(h^2) coefficient C_th = -(1/q')( q''/(2q') - q'''/(6q') ) to <1% at every landmark
 *        (ratio ~0.996..1.000), confirming the residual IS the finite-difference floor; the pure
 *        second-derivative (q'') part is ~98% of C_th, so the drift's curvature accounts for ~98%
 *        of the O(h^2) coefficient and the residual ~2% (the q''' term) is why raw/d2m is not
 *        perfectly constant -- proportional-to-curvature is confirmed, but not exact.
 *
 *   VERIFICATION ONLY. This tests a proportionality within an already-derived closed form against
 *   an already-measured drift; it changes NO bound. Reproduces the imp-34446/imp-34486 primitives
 *   inline (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros
 *   bundle), following the no-heavy-imports directive. The -2 asymptote and C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the component model is the inherited imp-3220/
 *   imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486
 *   is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34513-slowlog-drift-residual-crosscheck.js (F1 residual shrink "as curvature relaxes")
 *   @see imp-34486-slowlog-t0-drift-analytic-derivation.js (closed form x = -2 g/(1-g))
 *   @see imp-34446-coupling-exponent-independent-recompute.js (measured central-difference exponent)
 *
 *   Ticket: imp-34531 (accuracy, medium). Standalone residual-vs-curvature verification; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34486 primitives (imports NOTHING): --
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

// imp-34486 CLOSED FORM: crossover exponent -2 + x, x = -2 g/(1-g), g = (1 - 1/log(T0/2pi))/log T0.
function analyticExponent(N) {
  const T0 = heightForN(N);
  const L = Math.log(T0);
  const logU = Math.log(T0 / TWO_PI);
  const g = (1 - 1 / logU) / L;
  const x = (-2 * g) / (1 - g);
  return -2 + x;
}

// imp-34446 MEASUREMENT: d log N / d log E_coll by central difference on N*(1 +/- h).
function measuredExponent(N, h) {
  const Np = N * (1 + h);
  const Nm = N * (1 - h);
  return (Math.log(Np) - Math.log(Nm)) / (Math.log(eColl(Np)) - Math.log(eColl(Nm)));
}

// CLOSED-FORM second derivative of the drift exponent w.r.t. log N (the "local curvature" that
// F1 says relaxes): central second difference of analyticExponent in the log N variable. The
// measurement differences the nodes in N, so log N is the natural truncation variable. Stable
// to <1e-4 relative across dl in [5e-4, 2e-3] (offline-checked), so dl = 1e-3 is used.
function secondDerivExponent(N, dl) {
  const lN = Math.log(N);
  const fp = analyticExponent(Math.exp(lN + dl));
  const f0 = analyticExponent(N);
  const fm = analyticExponent(Math.exp(lN - dl));
  return (fp - 2 * f0 + fm) / (dl * dl);
}

// Derivatives of q(p) = log E_coll as a function of p = log N, for the FULL O(h^2) coefficient
// C_th = -(1/q')( q''/(2q') - q'''/(6q') ). q'' is the curvature term, q''' the sub-leading term.
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const f0 = q(p);
  const fp = q(p + dp);
  const fm = q(p - dp);
  const fpp = q(p + 2 * dp);
  const fmm = q(p - 2 * dp);
  const q1 = (fp - fm) / (2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  return { q1, q2, q3 };
}

const H_MEAS = 1e-3; // imp-34446 reference step
const DL = 1e-3; // second-derivative step (offline-checked stable)
const DP = 1e-3; // q-derivative step for the coefficient certification

// Tabulate across the imp-34446 landmark ladder + the deep-tail landmark N*.
const LADDER = [
  { label: '1e13', N: Math.pow(10, 13.0) },
  { label: '2.15e13', N: Math.pow(10, 13.333) },
  { label: 'N* (4.62e13)', N: DEEP_TAIL_N },
  { label: '4.62e13 (13.665)', N: Math.pow(10, 13.665) },
  { label: '1e14', N: Math.pow(10, 14.0) },
];

const CURVATURE_LADDER = LADDER.map(({ label, N }) => {
  const rawResidual = analyticExponent(N) - measuredExponent(N, H_MEAS);
  const d2m = secondDerivExponent(N, DL);
  const { q1, q2, q3 } = qDerivs(N, DP);
  const cThFull = -(1 / q1) * (q2 / (2 * q1) - q3 / (6 * q1)); // full O(h^2) coefficient
  const cThCurv = -(1 / q1) * (q2 / (2 * q1)); // pure second-derivative (q'') part
  return {
    label,
    N: +N.toExponential(3),
    raw_residual: +rawResidual.toExponential(4), // ~1.1e-9
    second_deriv: +d2m.toExponential(4), // d2 m / d(log N)^2, ~ -1.3e-4 and shrinking
    ratio_raw_over_d2m: +(rawResidual / d2m).toExponential(4), // ~ -8e-6, roughly constant
    coeff_certify_ratio: +(rawResidual / (H_MEAS * H_MEAS) / cThFull).toFixed(5), // ~1.0
    curvature_share: +(cThCurv / cThFull).toFixed(4), // ~0.98 -- q'' share of the coefficient
  };
});

// (F1) Both the raw residual and the second derivative shrink monotonically down the ladder.
const RAW_MONOTONE_SHRINKING = CURVATURE_LADDER.every(
  (r, k) => k === 0 || Math.abs(r.raw_residual) <= Math.abs(CURVATURE_LADDER[k - 1].raw_residual),
);
const D2M_MONOTONE_SHRINKING = CURVATURE_LADDER.every(
  (r, k) => k === 0 || Math.abs(r.second_deriv) <= Math.abs(CURVATURE_LADDER[k - 1].second_deriv),
);

// (F1) raw / d2m is roughly constant -- the proportionality F1 asserts. Report its relative range.
const RATIOS = CURVATURE_LADDER.map((r) => Math.abs(r.ratio_raw_over_d2m));
const RATIO_MIN = Math.min(...RATIOS);
const RATIO_MAX = Math.max(...RATIOS);
const RATIO_REL_RANGE = (RATIO_MAX - RATIO_MIN) / RATIO_MIN; // ~0.06

// (F2) raw/h^2 matches the full analytic O(h^2) coefficient; the q'' share is ~98%.
const MAX_COEFF_MISMATCH = Math.max(...CURVATURE_LADDER.map((r) => Math.abs(r.coeff_certify_ratio - 1)));
const MIN_CURVATURE_SHARE = Math.min(...CURVATURE_LADDER.map((r) => r.curvature_share));

export const IMP34531_DRIFT_RESIDUAL_VS_SECOND_DERIV = Object.freeze({
  id: 'imp-34531',
  proofSection: 'S-frontier',
  claim_verified:
    'imp-34513 F1: the raw central-difference drift residual shrinks "as the local curvature ' +
    'relaxes" -- i.e. the O(h^2) finite-difference coefficient is proportional to the drift ' +
    'exponent second derivative d^2 m / d(log N)^2.',
  meas_step_h: H_MEAS,
  second_deriv_step: DL,
  C_C_inline: +C_C.toFixed(6),
  curvature_ladder: Object.freeze(CURVATURE_LADDER.map((r) => Object.freeze(r))),
  raw_monotone_shrinking: RAW_MONOTONE_SHRINKING,
  second_deriv_monotone_shrinking: D2M_MONOTONE_SHRINKING,
  ratio_raw_over_d2m_min: +RATIO_MIN.toExponential(4), // ~7.83e-6
  ratio_raw_over_d2m_max: +RATIO_MAX.toExponential(4), // ~8.31e-6
  ratio_rel_range: +RATIO_REL_RANGE.toFixed(4), // ~0.061 (proportional to ~6%)
  max_coeff_certify_mismatch: +MAX_COEFF_MISMATCH.toFixed(5), // <0.01 -- raw/h^2 == full coefficient
  min_curvature_share: +MIN_CURVATURE_SHARE.toFixed(4), // ~0.978 -- q'' is ~98% of the coefficient
  isRigorous: false,
  verdict:
    'VERIFICATION (NOT rigorous). The imp-34513 F1 attribution -- raw drift residual shrinks "as ' +
    'the local curvature relaxes" -- is verified quantitatively across the imp-34446 landmark ' +
    'ladder (N = 1e13 .. 1e14). (F1) The closed-form drift second derivative d^2 m / d(log N)^2 ' +
    'is negative and shrinks in magnitude down the ladder (-1.525e-4 -> -1.321e-4 -> -1.232e-4) ' +
    'in lockstep with the raw residual (1.194e-9 -> 1.082e-9 -> 1.024e-9); both are monotone and ' +
    'raw/d2m is constant to ~6% (7.83e-6 -> 8.31e-6), so the shrink IS curvature-driven. (F2) The ' +
    'residual is certified as the finite-difference floor: raw/h^2 matches the full analytic O(h^2) ' +
    'coefficient C_th = -(1/q1)( q2/(2 q1) - q3/(6 q1) ) [q1,q2,q3 the 1st/2nd/3rd derivatives of ' +
    'q = log E_coll as a function of log N] to <1% at ' +
    'every landmark, and the pure second-derivative (q2) part is ~98% of C_th -- so the drift ' +
    'curvature accounts for ~98% of the O(h^2) coefficient, the residual ~2% (the third-derivative ' +
    'term) being why raw/d2m drifts ~6% rather than staying exactly constant. proportional-to-' +
    'curvature is CONFIRMED, but not exact. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, ' +
    'C_H = 1/8) ansatz are UNTOUCHED; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34513 (F1 residual shrink "as curvature relaxes", verified here); imp-34486 (closed-form ' +
    'drift x = -2 g/(1-g)); imp-34446 (central-difference exponent measurement); imp-33620 ' +
    '(deep-tail landmark N* ~ 4.62e13); imp-2714 (C_C = (1/8)sqrt(3 pi) ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34531_ASSERTIONS = [
  {
    id: 'imp34531-raw-and-d2m-both-shrink',
    holds: () => RAW_MONOTONE_SHRINKING && D2M_MONOTONE_SHRINKING,
    why: 'F1: both the raw residual and the closed-form drift second derivative shrink monotonically down the ladder -- the shrink tracks the curvature.',
  },
  {
    id: 'imp34531-raw-proportional-to-second-derivative',
    holds: () => RATIO_REL_RANGE < 0.1 && RATIO_MIN > 0,
    why: 'F1: raw/d2m is constant to within ~10% across the ladder -- the raw residual is proportional to the drift second derivative, i.e. the shrink is curvature-driven.',
  },
  {
    id: 'imp34531-coefficient-is-fd-floor',
    holds: () => MAX_COEFF_MISMATCH < 0.02,
    why: 'F2: raw/h^2 matches the full analytic O(h^2) coefficient -(1/q1)(q2/(2 q1) - q3/(6 q1)) to <2% at every landmark -- certifying the residual IS the finite-difference truncation floor.',
  },
  {
    id: 'imp34531-curvature-dominates-coefficient',
    holds: () => MIN_CURVATURE_SHARE > 0.95,
    why: 'F2: the pure second-derivative (q2) part is >95% of the O(h^2) coefficient at every landmark -- the O(h^2) coefficient is ~98% curvature, so proportional-to-curvature holds to ~2%.',
  },
  {
    id: 'imp34531-honesty-gate-no-qed',
    holds: () =>
      IMP34531_DRIFT_RESIDUAL_VS_SECOND_DERIV.isRigorous === false &&
      /NO QED/.test(IMP34531_DRIFT_RESIDUAL_VS_SECOND_DERIV.verdict) &&
      /refereed bound is changed/i.test(IMP34531_DRIFT_RESIDUAL_VS_SECOND_DERIV.verdict) &&
      /UNTOUCHED/.test(IMP34531_DRIFT_RESIDUAL_VS_SECOND_DERIV.verdict),
    why: 'Honesty gate: verification only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34531_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34531-drift-residual-vs-second-derivative assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34531_DRIFT_RESIDUAL_VS_SECOND_DERIV;
