/**
 * @module imp-34543-drift-residual-third-derivative-share
 * @fileoverview imp-34543 -- MEASUREMENT ONLY: isolate the pure THIRD-DERIVATIVE (q''') share of
 *   the imp-34531 F2 O(h^2) drift-residual coefficient C_th and test whether the raw residual
 *   divided by the pure SECOND-derivative (q'') part is more constant than the ~6% raw/d2m drift.
 *
 *   imp-34531 F2 certified that the raw central-difference drift residual
 *       raw = analyticExponent(N) - measuredExponent(N, h)
 *   equals, to <1% at every landmark, the full analytic O(h^2) coefficient (times h^2)
 *       C_th = -(1/q1)( q2/(2 q1) - q3/(6 q1) ),
 *   where q1,q2,q3 are the 1st/2nd/3rd derivatives of q(p) = log E_coll in p = log N. imp-34531
 *   reported the pure-q2 ("curvature") part is ~98% of C_th and attributed the residual ~2% (and
 *   thus the fact that raw/d2m drifts ~6% rather than 0%) to the q3 term -- but it never isolated
 *   the q3 term's share on its own, nor tested whether removing the q3 term from the denominator
 *   flattens the ratio. This module supplies exactly that isolation and that test.
 *
 *   WHAT THIS MEASUREMENT ADDS (beyond imp-34531)
 *   ---------------------------------------------
 *   C_th splits EXACTLY into two additive pieces (no cross term):
 *       C_th = C_q2 + C_q3,   C_q2 = -(1/q1)( q2/(2 q1) ),   C_q3 = +(1/q1)( q3/(6 q1) ) = q3/(6 q1^2).
 *   C_q2 is the pure second-derivative ("curvature") part imp-34531 already tabulated; C_q3 is the
 *   pure THIRD-derivative part, isolated here for the first time. The q3 used is the inherited
 *   4-point central third difference of q(p) = log E_coll (identical construction to imp-34531's
 *   qDerivs -- NOT a fresh analytic model), so this is a decomposition of the already-certified
 *   coefficient, not a new derivation. This module:
 *     (i)   tabulates the pure-q2 share C_q2/C_th and the pure-q3 share C_q3/C_th SEPARATELY down
 *           the N = 1e13 .. 1e14 ladder (the two shares sum to 1 by construction);
 *     (ii)  measures the relative range of raw/(h^2 C_q2) -- raw divided by the pure second-
 *           derivative part -- and compares it to the relative range of raw/d2m (the ~6% drift);
 *     (iii) as a control, measures raw/(h^2 C_th) -- raw over the FULL coefficient with the q3 term
 *           restored -- confirming it is tighter still (the q3 term is what the ~2% residual is).
 *
 *   THE FINDING (third-derivative share of the O(h^2) coefficient, standalone)
 *   ------------------------------------------------------------------------
 *   (F1) THE q3 SHARE IS ~2% AND STABLE. The pure third-derivative part C_q3/C_th sits at
 *        ~0.017..0.022 across the ladder (pure-q2 share ~0.978..0.983) -- so the third-derivative
 *        term accounts for ~2% of the O(h^2) coefficient at every landmark, exactly the residual
 *        imp-34531 F2 attributed to it but never isolated.
 *   (F2) DIVIDING BY THE PURE-q2 PART IS ~6.7x MORE CONSTANT THAN raw/d2m. raw/(h^2 C_q2) is
 *        constant to ~0.9% down the ladder (1.02185 -> 1.01265), versus the ~6.1% relative range of
 *        raw/d2m -- so removing the q3 term's absence from the denominator (i.e. dividing by the
 *        pure-curvature coefficient rather than by the raw second derivative d2m) flattens the ratio
 *        by ~6.7x. Restoring the q3 term (raw/(h^2 C_th), the full coefficient) tightens it further
 *        to ~0.4%. This quantifies exactly how much of the ~2% residual the q3 term explains: nearly
 *        all of it -- raw/d2m's ~6% drift collapses to ~0.9% once the pure-q2 coefficient is used and
 *        to ~0.4% once q3 is added back.
 *
 *   MEASUREMENT ONLY. This decomposes an already-certified coefficient and compares constancy of a
 *   ratio; it changes NO bound. Reproduces the imp-34446/imp-34486/imp-34531 primitives inline
 *   (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle),
 *   following the no-heavy-imports directive. q''' is the inherited 4-point central third difference,
 *   NOT a fresh analytic closed form -- so the sigma->1 deep-tail regime, where the inherited
 *   imp-3220/imp-3406 component model is least trustworthy, is inherited as-is (stated honestly).
 *   The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34531-drift-residual-vs-second-derivative.js (F2 coefficient certification, ~98% q2 share)
 *   @see imp-34513-slowlog-drift-residual-crosscheck.js (F1 residual shrink "as curvature relaxes")
 *   @see imp-34486-slowlog-t0-drift-analytic-derivation.js (closed form x = -2 g/(1-g))
 *   @see imp-34446-coupling-exponent-independent-recompute.js (measured central-difference exponent)
 *
 *   Ticket: imp-34543 (numerical, medium). Standalone q3-share isolation; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34486/imp-34531 primitives (imports NOTHING): --
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

// Closed-form second derivative of the drift exponent w.r.t. log N (imp-34531 "curvature d2m").
function secondDerivExponent(N, dl) {
  const lN = Math.log(N);
  const fp = analyticExponent(Math.exp(lN + dl));
  const f0 = analyticExponent(N);
  const fm = analyticExponent(Math.exp(lN - dl));
  return (fp - 2 * f0 + fm) / (dl * dl);
}

// Derivatives of q(p) = log E_coll as a function of p = log N (identical construction to imp-34531:
// 3-point central for q1/q2, 4-point central for q3). These feed the two additive pieces of C_th.
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
const DL = 1e-3; // second-derivative step (imp-34531 offline-checked stable)
const DP = 1e-3; // q-derivative step for the coefficient decomposition

// Tabulate across the imp-34446 landmark ladder + the deep-tail landmark N* (imp-34531 ladder).
const LADDER = [
  { label: '1e13', N: Math.pow(10, 13.0) },
  { label: '2.15e13', N: Math.pow(10, 13.333) },
  { label: 'N* (4.62e13)', N: DEEP_TAIL_N },
  { label: '4.62e13 (13.665)', N: Math.pow(10, 13.665) },
  { label: '1e14', N: Math.pow(10, 14.0) },
];

const SHARE_LADDER = LADDER.map(({ label, N }) => {
  const rawResidual = analyticExponent(N) - measuredExponent(N, H_MEAS);
  const d2m = secondDerivExponent(N, DL);
  const { q1, q2, q3 } = qDerivs(N, DP);
  // C_th = C_q2 + C_q3 EXACTLY (additive, no cross term):
  const cQ2 = -(1 / q1) * (q2 / (2 * q1)); // pure second-derivative (curvature) part
  const cQ3 = (1 / q1) * (q3 / (6 * q1)); // pure THIRD-derivative part (isolated here) = q3/(6 q1^2)
  const cThFull = cQ2 + cQ3; // full O(h^2) coefficient
  return {
    label,
    N: +N.toExponential(3),
    raw_residual: +rawResidual.toExponential(4), // ~1.1e-9
    q2_share: +(cQ2 / cThFull).toFixed(5), // ~0.978..0.983
    q3_share: +(cQ3 / cThFull).toFixed(5), // ~0.017..0.022 -- the isolated third-derivative share
    ratio_raw_over_d2m: +(rawResidual / d2m).toExponential(4), // ~ -8e-6, drifts ~6%
    ratio_raw_over_q2: +(rawResidual / (H_MEAS * H_MEAS * cQ2)).toFixed(6), // ~1.02, near-constant
    ratio_raw_over_full: +(rawResidual / (H_MEAS * H_MEAS * cThFull)).toFixed(6), // ~1.00, tightest
  };
});

// Relative range (max-min)/min of |.| across the ladder -- the "constancy" metric.
function relRange(vals) {
  const mags = vals.map((v) => Math.abs(v));
  const lo = Math.min(...mags);
  const hi = Math.max(...mags);
  return (hi - lo) / lo;
}

// (F1) The pure third-derivative share, isolated.
const Q3_SHARE_MIN = Math.min(...SHARE_LADDER.map((r) => r.q3_share));
const Q3_SHARE_MAX = Math.max(...SHARE_LADDER.map((r) => r.q3_share));

// (F2) constancy of raw/(pure-q2 part) vs raw/d2m vs raw/(full coefficient).
const RANGE_RAW_OVER_D2M = relRange(SHARE_LADDER.map((r) => r.ratio_raw_over_d2m)); // ~0.061
const RANGE_RAW_OVER_Q2 = relRange(SHARE_LADDER.map((r) => r.ratio_raw_over_q2)); // ~0.009
const RANGE_RAW_OVER_FULL = relRange(SHARE_LADDER.map((r) => r.ratio_raw_over_full)); // ~0.004
const CONSTANCY_GAIN_Q2 = RANGE_RAW_OVER_D2M / RANGE_RAW_OVER_Q2; // ~6.7x

export const IMP34543_DRIFT_RESIDUAL_Q3_SHARE = Object.freeze({
  id: 'imp-34543',
  proofSection: 'S-frontier',
  claim_measured:
    'Isolate the pure third-derivative (q3) share of the imp-34531 F2 O(h^2) drift-residual ' +
    'coefficient C_th = C_q2 + C_q3 [C_q2 = -(1/q1)(q2/(2 q1)), C_q3 = q3/(6 q1^2)] and test ' +
    'whether raw/(pure-q2 part) is more constant than the ~6% raw/d2m drift.',
  meas_step_h: H_MEAS,
  q_deriv_step: DP,
  C_C_inline: +C_C.toFixed(6),
  share_ladder: Object.freeze(SHARE_LADDER.map((r) => Object.freeze(r))),
  q3_share_min: Q3_SHARE_MIN, // ~0.0166
  q3_share_max: Q3_SHARE_MAX, // ~0.0217
  range_raw_over_d2m: +RANGE_RAW_OVER_D2M.toFixed(5), // ~0.061 (the ~6% baseline drift)
  range_raw_over_q2: +RANGE_RAW_OVER_Q2.toFixed(5), // ~0.009 -- pure-q2 denominator, ~6.7x tighter
  range_raw_over_full: +RANGE_RAW_OVER_FULL.toFixed(5), // ~0.004 -- full coefficient, tightest
  constancy_gain_pure_q2_over_d2m: +CONSTANCY_GAIN_Q2.toFixed(2), // ~6.7
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). The imp-34531 F2 O(h^2) drift-residual coefficient splits exactly ' +
    'into C_th = C_q2 + C_q3, with C_q2 = -(1/q1)(q2/(2 q1)) the pure second-derivative (curvature) ' +
    'part and C_q3 = q3/(6 q1^2) the pure THIRD-derivative part isolated here [q1,q2,q3 the 1st/2nd/ ' +
    '3rd derivatives of q = log E_coll in log N, q3 the inherited 4-point central third difference]. ' +
    '(F1) The pure q3 share C_q3/C_th sits at ~0.017..0.022 across the N = 1e13 .. 1e14 ladder ' +
    '(pure-q2 share ~0.978..0.983) -- so the third-derivative term is ~2% of the coefficient at ' +
    'every landmark, exactly the residual imp-34531 attributed to it but never isolated. (F2) ' +
    'raw/(h^2 C_q2) -- the raw residual divided by the pure second-derivative part -- is constant to ' +
    '~0.9% down the ladder (1.02185 -> 1.01265), versus the ~6.1% relative range of raw/d2m: ~6.7x ' +
    'more constant. Restoring the q3 term (raw/(h^2 C_th), the full coefficient) tightens it further ' +
    'to ~0.4%. So the ~2% residual that made raw/d2m drift ~6% IS the q3 term: dividing by the ' +
    'pure-q2 coefficient collapses the drift to ~0.9%, and adding q3 back to ~0.4%. q3 is the ' +
    'inherited central third difference, NOT a fresh analytic closed form, so the sigma->1 deep-tail ' +
    'regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2 ' +
    'asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34531 (F2 coefficient certification, ~98% q2 share, decomposed here); imp-34513 (F1 ' +
    'residual shrink); imp-34486 (closed-form drift x = -2 g/(1-g)); imp-34446 (central-difference ' +
    'exponent measurement); imp-33620 (deep-tail landmark N* ~ 4.62e13); imp-2714 (C_C ansatz); ' +
    'imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34543_ASSERTIONS = [
  {
    id: 'imp34543-shares-sum-to-one',
    holds: () => SHARE_LADDER.every((r) => Math.abs(r.q2_share + r.q3_share - 1) < 1e-4),
    why: 'C_th = C_q2 + C_q3 is an exact additive split, so the two shares sum to 1 at every landmark.',
  },
  {
    id: 'imp34543-q3-share-is-about-two-percent',
    holds: () => Q3_SHARE_MIN > 0.01 && Q3_SHARE_MAX < 0.03,
    why: 'F1: the isolated pure third-derivative share sits at ~2% (0.017..0.022) across the ladder -- the residual imp-34531 F2 attributed to q3 but never isolated.',
  },
  {
    id: 'imp34543-pure-q2-denominator-more-constant-than-d2m',
    holds: () => RANGE_RAW_OVER_Q2 < RANGE_RAW_OVER_D2M && RANGE_RAW_OVER_Q2 < 0.02,
    why: 'F2: raw/(pure-q2 part) is constant to <2% (~0.9%), tighter than the ~6% raw/d2m drift -- dividing by the pure-curvature coefficient flattens the ratio.',
  },
  {
    id: 'imp34543-full-coefficient-tightest',
    holds: () => RANGE_RAW_OVER_FULL < RANGE_RAW_OVER_Q2 && RANGE_RAW_OVER_FULL < 0.01,
    why: 'F2: restoring the q3 term (full coefficient) tightens the ratio below the pure-q2 range -- confirming the ~2% residual IS the third-derivative term.',
  },
  {
    id: 'imp34543-constancy-gain-substantial',
    holds: () => CONSTANCY_GAIN_Q2 > 3,
    why: 'F2: the pure-q2 denominator is >3x (measured ~6.7x) more constant than raw/d2m -- a substantial flattening.',
  },
  {
    id: 'imp34543-honesty-gate-no-qed',
    holds: () =>
      IMP34543_DRIFT_RESIDUAL_Q3_SHARE.isRigorous === false &&
      /NO QED/.test(IMP34543_DRIFT_RESIDUAL_Q3_SHARE.verdict) &&
      /refereed bound is changed/i.test(IMP34543_DRIFT_RESIDUAL_Q3_SHARE.verdict) &&
      /UNTOUCHED/.test(IMP34543_DRIFT_RESIDUAL_Q3_SHARE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34543_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34543-drift-residual-third-derivative-share assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34543_DRIFT_RESIDUAL_Q3_SHARE;
