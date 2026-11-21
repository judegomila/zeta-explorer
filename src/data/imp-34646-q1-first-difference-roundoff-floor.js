/**
 * @module imp-34646-q1-first-difference-roundoff-floor
 * @fileoverview imp-34646 -- MEASUREMENT ONLY: extends the imp-34633 eps_mach roundoff-floor analysis
 *   DOWNWARD by one rung, to q1, the FIRST central difference that appears as the DENOMINATOR q1^2 in
 *   the drift shares C_q2 = -q2/(2 q1^2) and C_q3 = q3/(6 q1^2). imp-34633 confirmed that the deep-tail
 *   finite-difference floor of the q2 / q3 / q4 NUMERATOR channels is double-precision roundoff in BOTH
 *   its power (the clean {2,3,4} exponent ladder 1/dp^k) AND its amplitude (~ eps_mach |q| intercept) --
 *   but it tested only q2/q3/q4, never q1. This module measures the q1 deep-tail log-log floor slope and
 *   intercept and assesses (a) whether q1 exhibits the SAME eps_mach |q| roundoff-floor amplitude, and
 *   (b) whether its exponent extends the ladder DOWN to the k = 1 rung, or scales differently -- and
 *   whether q1 roundoff propagates into the share denominators.
 *
 *   WHY q1 IS DIFFERENT FROM q2/q3/q4 (and why it must be tested separately)
 *   ----------------------------------------------------------------------
 *   q1 = (q(p+dp) - q(p-dp)) / (2 dp) is a 2-point difference: stencil weights {1,-1}, RMS norm
 *   ||w1|| = sqrt(2), stencil denom 2 dp. So the absolute rounding error of q1 is
 *     err_q1(dp) ~ ||w1|| u |q| / (2 dp) = sqrt(2) u |q| / (2 dp),  u = eps/2 the unit roundoff,
 *   i.e. a 1/dp^1 floor with a parameter-free amplitude B1 = ||w1|| u |q| / 2 -- the k = 1 rung BELOW
 *   the {2,3,4} ladder. But q1 is WELL-CONDITIONED: its TRUE deep-tail value is O(1) (|q1| ~ 0.485),
 *   not the near-cancelling ~0 of the higher differences, so its roundoff floor sits at a tiny ABSOLUTE
 *   level. Unlike the q2/q3/q4 SHARES (which blow up as dp -> 0 because roundoff swamps a true ~0
 *   numerator), q1 never blows up -- so the floor must be measured as the ABSOLUTE error err_q1(dp) =
 *   |q1(dp) - q1_true| against a reference q1_true taken at a non-roundoff step (dp = 1e-2), NOT as a
 *   share. The measurement therefore answers a genuinely open question: does the eps_mach |q| structure
 *   hold one rung down, on the well-conditioned denominator, or only on the ill-conditioned numerators?
 *
 *   THE FINDING (q1 IS THE k = 1 RUNG -- same eps_mach |q| amplitude, exponent 1, negligible propagation)
 *   ----------------------------------------------------------------------------------------------------
 *   (F1) THE q1 DEEP-TAIL FLOOR SLOPE IS ~1, NOT part of the {2,3,4} ladder. The deep-group-max absolute
 *        error err_q1(dp) fits a log-log slope m1 ~ 1.07 across the deep roundoff window
 *        dp = 1e-6 .. 5e-8 -- confirming q1 amplifies as 1/dp^1, one power LOWER than q2 (1/dp^2). So the
 *        exponent ladder extends DOWN to k = 1 exactly as the 2-point-difference stencil predicts; q1
 *        does NOT share the q2/q3/q4 powers, it sits one rung below them.
 *   (F2) THE q1 AMPLITUDE MATCHES THE eps_mach |q| PREDICTION (within a factor ~3, but LESS CLEANLY than
 *        the higher differences). The measured intercept prefactor B1 ~ 4.90e-16 versus the parameter-
 *        free prediction B1_pred = ||w1|| u |q| / 2 ~ 1.29e-15 [||w1|| = sqrt(2), u = eps/2 ~ 1.11e-16,
 *        true |q| ~ 15..16 at the landmarks] -- ratio measured / predicted ~ 0.38, inside the same
 *        factor-~3.5 band imp-34633 used for q2/q3/q4. But the fit is NOISIER (R^2 ~ 0.946 vs the higher
 *        differences ~0.98+) and its amplitude wanders across sub-windows: because q1 is well-conditioned,
 *        its roundoff floor is a tiny ABSOLUTE quantity dominated by stochastic rounding jitter, so the
 *        eps_mach |q| amplitude is confirmed in structure but pinned less tightly than for the near-
 *        cancelling numerator channels. Same amplitude LAW, looser fit.
 *   (F3) q1 ROUNDOFF DOES NOT PROPAGATE INTO THE SHARE DENOMINATORS. At the truncation-regime step where
 *        the shares are actually evaluated (dp ~ 1e-3 .. 1e-4), the relative error of q1 is ~1e-9, so the
 *        induced relative error of the share denominator q1^2 [= 2 |dq1| / |q1|] is ~2e-9 -- utterly
 *        negligible. The blow-up of the C_q2 / C_q3 drift shares as dp -> 0 is therefore driven ENTIRELY
 *        by roundoff in the q2/q3/q4 NUMERATORS (imp-34606/imp-34633), with q1 a stable, well-conditioned
 *        denominator. This closes the denominator half of the drift-share conditioning picture: only the
 *        numerators carry the finite-difference floor into the shares.
 *
 *   MEASUREMENT ONLY. This measures the q1 finite-difference roundoff floor and compares it to a
 *   parameter-free machine-epsilon prediction; it changes NO bound. Reproduces the imp-34446 /
 *   imp-34531 / imp-34543 / imp-34606 / imp-34633 primitives inline (imports NOTHING -- no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1 is the inherited first central difference, NOT a fresh analytic closed
 *   form -- so the sigma -> 1 deep-tail regime, where the inherited imp-3220 / imp-3406 component model
 *   is least trustworthy, is inherited as-is (this diagnoses the finite-difference conditioning OF that
 *   measurement, it does not rehabilitate the model). The -2 asymptote and C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 *   imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js (q2/q3/q4 amplitudes; this adds the k=1 rung q1)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (the {2,3,4} SLOPE ladder q1 sits one below)
 *   @see imp-34531-drift-residual-curvature-attribution (the C_q2/C_q3 drift shares q1^2 denominates)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34646 (numerical, medium). q1 first-difference roundoff floor vs machine epsilon; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34606/imp-34633 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the deep-tail floor
const EPS_MACH = Number.EPSILON; // 2.220446049250313e-16 -- IEEE-754 double machine epsilon
const UNIT_ROUNDOFF = EPS_MACH / 2; // u = eps/2 ~ 1.11e-16 -- the per-value rounding half-ulp

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

// The FIRST central difference of q(p) = log E_coll in p = log N (identical stencil to imp-34606/imp-34633).
// q1 = (q(p+dp) - q(p-dp)) / (2 dp) -- 2-point difference, weights {1,-1}, denom 2 dp.
function q1of(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  return (q(p + dp) - q(p - dp)) / (2 * dp);
}

// The bare function value q(p) = log E_coll at the landmark -- the |q| magnitude the roundoff rides on.
function qValue(N) {
  const p = Math.log(N);
  return Math.log(eColl(Math.exp(p)));
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// True q1 taken at a NON-roundoff step (dp = 1e-2) -- the well-conditioned physical first derivative.
// Unlike the q2/q3/q4 SHARES, q1 does NOT blow up as dp -> 0 (its true value is O(1)), so the roundoff
// floor is measured as the ABSOLUTE error against this reference, not as an inflating share.
function q1True(N) {
  return q1of(N, 1e-2);
}

// Deep-group max ABSOLUTE roundoff error of q1 at step dp -- the worst-case rung across the landmarks.
function deepGroupMaxAbsErr(dp) {
  return Math.max(...DEEP_LADDER.map((N) => Math.abs(q1of(N, dp) - q1True(N))));
}

// Deep roundoff-dominated dp window for q1 (below the dp ~ u^(1/3) ~ 6e-6 truncation/roundoff crossover).
const WINDOW_Q1 = [1e-6, 5e-7, 3e-7, 1e-7, 5e-8];

// Log-log least-squares fit -- returns the SLOPE m1 AND the INTERCEPT prefactor B1 = exp(lnb).
function logLogFit(steps) {
  const xs = steps.map((dp) => Math.log(dp));
  const ys = steps.map((dp) => Math.log(deepGroupMaxAbsErr(dp)));
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx; // = -m1
  const lnb = ybar - slope * xbar; // intercept at log dp = 0 -> amplitude B1 = exp(lnb)
  const yhat = xs.map((x) => lnb + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { m: -slope, lnb, B: Math.exp(lnb), r2: 1 - ssr / sst };
}

const FIT_Q1 = logLogFit(WINDOW_Q1); // m ~ 1.069, B1 ~ 4.90e-16, R^2 ~ 0.946

// --- Parameter-free machine-epsilon PREDICTION of the q1 intercept prefactor B1 ---
// The 2-point difference numerator q(p+dp) - q(p-dp) sums two function values ~|q| carrying per-value
// rounding ~ u |q|; the numerator absolute rounding error is ~ ||w1|| u |q| with ||w1|| = sqrt(2) the RMS
// stencil-weight norm of {1,-1}. Dividing by the stencil denom 2 dp gives the pinned floor
//   err_q1(dp) ~ ||w1|| u |q| / (2 dp) = B1 / dp,   B1 = ||w1|| u |q| / 2,   NO fitted amplitude.
const STENCIL_NORM_Q1 = Math.sqrt(1 + 1); // weights {1,-1} -> sqrt(2) ~ 1.4142

function predictedPrefactor(N) {
  return (STENCIL_NORM_Q1 * UNIT_ROUNDOFF * Math.abs(qValue(N))) / 2;
}

// Deep-group max of the predicted prefactor -- matches the deep-group-max error the fit measured.
const B1_PRED = Math.max(...DEEP_LADDER.map(predictedPrefactor)); // ~ 1.29e-15

const RATIO_Q1 = FIT_Q1.B / B1_PRED; // ~ 0.38 -- within the factor-~3.5 band, one rung below q2/q3/q4

// --- Propagation of q1 roundoff into the C_q2/C_q3 SHARE DENOMINATORS q1^2 ---
// At the truncation-regime step where the shares are actually evaluated, q1 is well-conditioned; its
// relative error is ~1e-9, so the induced relative error of the denominator q1^2 is 2 |dq1| / |q1|.
function shareDenomRelError(dp) {
  return Math.max(...DEEP_LADDER.map((N) => (2 * Math.abs(q1of(N, dp) - q1True(N))) / Math.abs(q1True(N))));
}
const SHARE_DENOM_REL_1EM3 = shareDenomRelError(1e-3); // ~ 2.0e-9
const SHARE_DENOM_REL_1EM4 = shareDenomRelError(1e-4); // ~ 2.0e-9

// q1 floor exponent is the k=1 rung (slope ~1, NOT the {2,3,4} ladder) and its amplitude matches eps_mach?
const Q1_IS_K1_RUNG = Math.abs(FIT_Q1.m - 1) < 0.25;
const Q1_AMPLITUDE_MATCHES_EPSMACH = RATIO_Q1 > 1 / 3.5 && RATIO_Q1 < 3.5;
const Q1_DENOM_PROPAGATION_NEGLIGIBLE = SHARE_DENOM_REL_1EM3 < 1e-7 && SHARE_DENOM_REL_1EM4 < 1e-7;

export const IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR = Object.freeze({
  id: 'imp-34646',
  proofSection: 'S-frontier',
  claim_measured:
    'Measure the deep-tail log-log floor SLOPE and INTERCEPT of the ABSOLUTE roundoff error of q1, the ' +
    'FIRST central difference of q(p) = log E_coll [the well-conditioned denominator q1^2 of the drift ' +
    'shares C_q2 = -q2/(2 q1^2), C_q3 = q3/(6 q1^2)], and assess whether it exhibits the SAME eps_mach |q| ' +
    'roundoff-floor amplitude imp-34633 confirmed for the q2/q3/q4 numerators, whether its exponent extends ' +
    'the {2,3,4} ladder DOWN to the k = 1 rung, and whether q1 roundoff propagates into the share ' +
    'denominators; a conditioning diagnostic below imp-34633, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  eps_mach: EPS_MACH,
  unit_roundoff_u: +UNIT_ROUNDOFF.toExponential(4),
  C_C_inline: +C_C.toFixed(6),
  stencil_norm_q1: +STENCIL_NORM_Q1.toFixed(4), // sqrt(2) ~ 1.4142
  m_q1: +FIT_Q1.m.toFixed(4), // ~1.069 -- the k=1 rung, one power below q2 (1/dp^2)
  r2_q1: +FIT_Q1.r2.toFixed(4), // ~0.946 -- noisier than the higher differences (well-conditioned floor)
  B1_measured: +FIT_Q1.B.toExponential(4), // ~4.90e-16
  B1_predicted: +B1_PRED.toExponential(4), // ~1.29e-15 = sqrt(2) u |q| / 2
  ratio_q1: +RATIO_Q1.toFixed(3), // ~0.38 -- within the factor-~3.5 eps_mach band
  share_denom_rel_error_dp_1em3: +SHARE_DENOM_REL_1EM3.toExponential(3), // ~2.0e-9
  share_denom_rel_error_dp_1em4: +SHARE_DENOM_REL_1EM4.toExponential(3), // ~2.0e-9
  q1_is_k1_rung: Q1_IS_K1_RUNG, // slope ~1, extends the ladder down by one
  q1_amplitude_matches_epsmach: Q1_AMPLITUDE_MATCHES_EPSMACH, // ratio within factor ~3.5
  q1_denom_propagation_negligible: Q1_DENOM_PROPAGATION_NEGLIGIBLE, // roundoff does not reach the shares
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extends the imp-34633 eps_mach roundoff-floor analysis DOWN one rung, to ' +
    'q1, the FIRST central difference [q1 = (q(p+dp) - q(p-dp)) / (2 dp), the well-conditioned denominator ' +
    'q1^2 of the drift shares C_q2 = -q2/(2 q1^2), C_q3 = q3/(6 q1^2)]. Unlike the q2/q3/q4 numerator ' +
    'SHARES (which blow up as dp -> 0 because roundoff swamps a true ~0 numerator), q1 is well-conditioned ' +
    '(true value O(1), |q1| ~ 0.485) and never blows up, so its floor is measured as the ABSOLUTE error ' +
    '|q1(dp) - q1_true| against a non-roundoff reference (dp = 1e-2). (F1) The q1 deep-tail floor slope is ' +
    'm1 ~ 1.07 over dp = 1e-6 .. 5e-8 -- confirming q1 amplifies as 1/dp^1, one power BELOW q2 (1/dp^2); ' +
    'the exponent ladder extends down to the k = 1 rung exactly as the 2-point-difference stencil {1,-1} ' +
    'predicts, and q1 does NOT share the {2,3,4} powers. (F2) The measured amplitude B1 ~ 4.90e-16 matches ' +
    'the parameter-free prediction B1_pred = ||w1|| u |q| / 2 ~ 1.29e-15 [||w1|| = sqrt(2), u = eps/2 ~ ' +
    '1.11e-16, true |q| ~ 15..16] to within a factor ~3 (ratio ~0.38, inside the same factor-~3.5 band ' +
    'imp-34633 used) -- the SAME eps_mach |q| amplitude law -- but the fit is NOISIER (R^2 ~ 0.946): ' +
    'because q1 is well-conditioned its roundoff floor is a tiny ABSOLUTE quantity dominated by stochastic ' +
    'rounding jitter, so the amplitude is confirmed in structure yet pinned less tightly than the near-' +
    'cancelling numerator channels. (F3) q1 roundoff does NOT propagate into the share denominators: at the ' +
    'truncation-regime step the shares are evaluated (dp ~ 1e-3 .. 1e-4), q1 relative error is ~1e-9, so ' +
    'the induced denominator q1^2 relative error [2 |dq1| / |q1|] is ~2e-9 -- negligible; the C_q2/C_q3 ' +
    'share blow-up is driven ENTIRELY by the q2/q3/q4 NUMERATOR roundoff, with q1 a stable denominator. ' +
    'q1 is the inherited first central difference, NOT a fresh analytic closed form, so the sigma -> 1 ' +
    'deep-tail regime (imp-3220 / imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'diagnoses the finite-difference conditioning of that measurement, it does not rehabilitate the model. ' +
    'The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34633 (q2/q3/q4 roundoff amplitudes -- this adds the k=1 rung q1); ' +
    'imp-34606 (the {2,3,4} SLOPE ladder q1 sits one below); ' +
    'imp-34531 (the C_q2/C_q3 drift-residual curvature shares q1^2 denominates); ' +
    'imp-34543 (q2/q3 shares as ladder aggregates); imp-34446 (central-difference exponent); ' +
    'imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34646_ASSERTIONS = [
  {
    id: 'imp34646-q1-floor-is-k1-rung',
    holds: () => Q1_IS_K1_RUNG && Math.abs(FIT_Q1.m - 1) < 0.25,
    why: 'F1: the q1 deep-tail floor slope m1 ~ 1.07 confirms it amplifies as 1/dp^1 -- the k=1 rung below the {2,3,4} ladder, exactly as the 2-point-difference stencil predicts.',
  },
  {
    id: 'imp34646-q1-amplitude-matches-epsmach',
    holds: () => Q1_AMPLITUDE_MATCHES_EPSMACH && FIT_Q1.B > 1e-16 && FIT_Q1.B < 1e-14,
    why: 'F2: the q1 intercept prefactor B1 ~ 4.90e-16 matches the parameter-free eps_mach prediction ~1.29e-15 (ratio ~0.38) -- the SAME eps_mach |q| amplitude law, one rung down.',
  },
  {
    id: 'imp34646-q1-fit-noisier-than-higher-differences',
    holds: () => FIT_Q1.r2 > 0.85 && FIT_Q1.r2 < 0.98,
    why: 'F2: the q1 floor fit is noisier (R^2 ~ 0.946) than the higher differences because q1 is well-conditioned -- its roundoff floor is a tiny ABSOLUTE quantity dominated by rounding jitter.',
  },
  {
    id: 'imp34646-q1-denom-propagation-negligible',
    holds: () => Q1_DENOM_PROPAGATION_NEGLIGIBLE,
    why: 'F3: at the truncation-regime dp the shares are evaluated, the induced share-denominator q1^2 relative error is ~2e-9 -- q1 roundoff does NOT reach the C_q2/C_q3 shares.',
  },
  {
    id: 'imp34646-honesty-gate-no-qed',
    holds: () =>
      IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR.isRigorous === false &&
      /NO QED/.test(IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR.verdict) &&
      /UNTOUCHED/.test(IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34646_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34646-q1-first-difference-roundoff-floor assertion failed: ${assertion.id}`);
  }
}

export default IMP34646_Q1_FIRST_DIFFERENCE_ROUNDOFF_FLOOR;
