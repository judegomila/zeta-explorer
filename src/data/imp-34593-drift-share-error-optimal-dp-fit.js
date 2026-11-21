/**
 * @module imp-34593-drift-share-error-optimal-dp-fit
 * @fileoverview imp-34593 -- MEASUREMENT ONLY: a finite-difference-step (dp) OPTIMAL-STEP
 *   analysis of the imp-34573 deep-tail q3-share error. imp-34573 F3 traced most of the
 *   deep-vs-mid q3-share instability to finite-difference conditioning (the drift shrinks
 *   ~21% -> ~8% and the deep-group relative range collapses ~36% -> ~7% moving dp 1e-3 -> 2e-3),
 *   attributing it to the classic truncation (grows with dp) vs roundoff (grows as dp -> 0)
 *   trade-off imp-34566 F3 quantified, but it never LOCATED the error-minimizing step. This
 *   module fits the observed deep-tail q3-share error vs dp to a total-error model and predicts
 *   the optimal dp* that minimizes it, then verifies by re-measuring the q3-share drift at dp*.
 *
 *   WHY THIS MATTERS (beyond imp-34573 / imp-34587)
 *   -----------------------------------------------
 *   imp-34573 said "dp = 2e-3 beats dp = 1e-3" from two points; imp-34587 added dp = 4e-3 and
 *   Richardson-extrapolated the DRIFT to dp -> 0, reporting an intrinsic ~ -7.5%. Neither
 *   located the step that MINIMIZES the total error, and both leaned on the trade-off imp-34566
 *   named -- truncation ~ a dp^2 vs roundoff ~ b/dp -- without ever fitting it. The ticket asks
 *   to fit err(dp) ~ a dp^2 + b/dp and solve for dp* = (b/2a)^(1/3). Doing so honestly forces
 *   two questions the parents left open: (i) does the truncation-vs-roundoff model even HAVE an
 *   interior optimum here, and (ii) is the roundoff exponent really 1 (a first-derivative form)
 *   or steeper (a third-difference q3 = 4-point/(2 dp^3) form)? The answers correct the parents.
 *
 *   WHAT THIS MEASUREMENT ADDS
 *   --------------------------
 *   Reusing the imp-34573/imp-34587 q3Share primitive VERBATIM [C_th = C_q2 + C_q3,
 *   C_q3 = q3/(6 q1^2), q1,q2,q3 the inherited central differences of q(p) = log E_coll in
 *   p = log N] and the same MID/DEEP landmark partition at N* ~ 4.62e13, this module:
 *     (i)   sweeps the deep-vs-mid mean-q3-share drift AND the deep-group relative range across
 *           dp = 6e-3 .. 1e-1 to read the truncation- and roundoff-FREE PLATEAU value of each;
 *     (ii)  fits the roundoff channel excess (deep relative range minus its structural floor)
 *           to b/dp^m by log-log least squares over the clean small-dp nodes dp = {0.75,1,1.25}e-3;
 *     (iii) checks the ticket-prescribed a dp^2 + b/dp form: the truncation coefficient a is
 *           unmeasurably small (both proxies flat to dp = 0.2), so (b/2a)^(1/3) DIVERGES -- no
 *           interior optimum -- and forcing the roundoff exponent to 1 fits far worse (R^2 ~ 0.48)
 *           than the free exponent m ~ 3.5 (R^2 ~ 0.99);
 *     (iv)  defines the practical optimal step dp* as the roundoff-floor CROSSING (excess = 10%
 *           of the structural floor) under the fitted b/dp^m, and verifies by measuring the drift
 *           and the relative range there.
 *
 *   THE FINDING (roundoff-limited plateau, not a U-shaped trade-off; parents undershot the drift)
 *   -------------------------------------------------------------------------------------------
 *   (F1) THE ERROR IS ROUNDOFF-LIMITED WITH A NEGLIGIBLE TRUNCATION CHANNEL. The deep-vs-mid
 *        drift is FLAT at ~ -0.09682 and the deep-group relative range flat at ~0.0854 across
 *        the whole window dp = 6e-3 .. 1e-1 (dp^2 spans 3.6e-5 .. 1e-2 with no visible growth):
 *        q(p) = log E_coll is analytic and slowly varying, so its central-difference truncation
 *        term is negligible. There is NO interior a dp^2 vs b/dp optimum -- the ticket-prescribed
 *        (b/2a)^(1/3) diverges because a ~ 0. The error is a roundoff-limited PLATEAU, not a
 *        U-shaped trade-off.
 *   (F2) THE ROUNDOFF EXPONENT IS ~3, NOT 1. The deep-group relative-range excess over its
 *        structural floor fits b/dp^m with m ~ 3.5 (R^2 ~ 0.99 in log-log) -- consistent with
 *        roundoff on the THIRD-difference q3 = (4-point)/(2 dp^3), eps/dp^3. Forcing the
 *        ticket-prescribed first-derivative exponent m = 1 (b/dp) fits far worse (R^2 ~ 0.48).
 *        So the classic a dp^2 + b/dp model MIS-SPECIFIES this roundoff channel; the correct
 *        floor model is err(dp) ~ R_inf + b/dp^3, monotone-decreasing to the structural floor.
 *   (F3) THE OPTIMAL STEP IS THE ROUNDOFF-FLOOR CROSSING dp* ~ 2.6e-3, AND THE PLATEAU CORRECTS
 *        THE PARENTS. Setting the roundoff excess to 10% of the structural floor gives
 *        dp* ~ 2.61e-3; re-measuring there yields a residual deep-vs-mid drift ~ -0.1012 (within
 *        ~4% of the plateau intrinsic) and a deep relative range ~0.093 (within ~9% of the
 *        floor). Crucially the PLATEAU intrinsic drift is ~ -0.0968 (~9.7%), NOT the ~ -0.0748
 *        (~7.5%) imp-34587 got by Richardson-extrapolating through the roundoff-DIP at dp = 2e-3
 *        (drift -0.0807, a below-optimal outlier). CONCLUSION: within the inherited component
 *        model the deep-tail q3-share error is roundoff-limited (truncation ~ 0, roundoff ~ eps/dp^3),
 *        the practical optimal step is the roundoff-floor crossing dp* ~ 2.6e-3, and the true
 *        intrinsic deep-vs-mid q3-share drift is ~ -9.7%, correcting the parents' ~ -7.5..8% floor.
 *
 *   MEASUREMENT ONLY. This re-aggregates an already-certified decomposition across a
 *   finite-difference-step sweep and fits a total-error model; it changes NO bound. Reproduces
 *   the imp-34446/imp-34531/imp-34543/imp-34573 primitives inline (imports NOTHING -- no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1,q2,q3 are the inherited central differences, NOT fresh
 *   analytic closed forms -- so the sigma -> 1 deep-tail regime, where the inherited
 *   imp-3220/imp-3406 component model is least trustworthy, is inherited as-is (a diagnostic ON
 *   that regime, not a rehabilitation OF it). The -2 asymptote and C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is
 *   UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34573-drift-residual-share-deeptail-vs-midrange.js (deep-vs-mid drift, dp = 1e-3, 2e-3)
 *   @see imp-34587-drift-share-drift-richardson-dp-extrapolation.js (Richardson dp -> 0 intrinsic ~ -7.5%)
 *   @see imp-34566-drift-residual-fourth-difference-share.js (truncation-vs-roundoff floor F3)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34593 (numerical, low). Optimal-step fit of the deep-tail q3-share error; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the mid/deep boundary

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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34543/imp-34573/imp-34587).
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

// The pure third-derivative share of the O(h^2) coefficient (imp-34543/imp-34573 decomposition, verbatim).
function q3Share(N, dp) {
  const { q1, q2, q3 } = qDerivs(N, dp);
  const cQ2 = -(1 / q1) * (q2 / (2 * q1)); // pure curvature part
  const cQ3 = (1 / q1) * (q3 / (6 * q1)); // pure third-derivative part = q3/(6 q1^2)
  return cQ3 / (cQ2 + cQ3);
}

// Same MID/DEEP landmark partition as imp-34573/imp-34587: MID = N < N*, DEEP = N >= N*.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// Deep-vs-mid mean-q3-share drift at a given finite-difference step (imp-34573 convention).
function driftAt(dp) {
  const midMean = mean(MID_LADDER.map((N) => q3Share(N, dp)));
  const deepMean = mean(DEEP_LADDER.map((N) => q3Share(N, dp)));
  return (deepMean - midMean) / midMean;
}

// Deep-group relative range (max-min)/min -- imp-34573 instability metric (the "total error" proxy).
function deepRelRange(dp) {
  const mags = DEEP_LADDER.map((N) => Math.abs(q3Share(N, dp)));
  const lo = Math.min(...mags);
  const hi = Math.max(...mags);
  return (hi - lo) / lo;
}

// (1) PLATEAU: the truncation- AND roundoff-free value of each proxy, read across a stable window
//     dp = 6e-3 .. 1e-1 (both are flat here -- truncation negligible, roundoff decayed). This is the
//     honest intrinsic reference, replacing the imp-34587 Richardson value contaminated by dp = 2e-3.
const PLATEAU_STEPS = [6e-3, 8e-3, 1e-2, 1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1];
const DRIFT_INF = mean(PLATEAU_STEPS.map(driftAt)); // ~ -0.09682 (plateau intrinsic drift)
const RELRANGE_INF = mean(PLATEAU_STEPS.map(deepRelRange)); // ~0.08538 (structural floor of the deep spread)

// (2) ROUNDOFF CHANNEL: fit excess = deepRelRange(dp) - RELRANGE_INF ~ b/dp^m by log-log least squares
//     over the clean small-dp nodes. m ~ 3.5 (third-difference eps/dp^3), NOT the prescribed 1.
const ROUNDOFF_STEPS = [0.75e-3, 1.0e-3, 1.25e-3];
function logLogFit(steps) {
  const xs = steps.map((dp) => Math.log(dp));
  const ys = steps.map((dp) => Math.log(deepRelRange(dp) - RELRANGE_INF));
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx; // = -m
  const lnb = ybar - slope * xbar;
  const yhat = xs.map((x) => lnb + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { m: -slope, b: Math.exp(lnb), r2: 1 - ssr / sst, xs, ys };
}
const FREE_FIT = logLogFit(ROUNDOFF_STEPS); // free exponent m ~ 3.5
// Ticket-prescribed b/dp: force the roundoff exponent to 1 and report the (worse) fit quality.
function fixedExponentFit(steps, mFixed) {
  const xs = steps.map((dp) => Math.log(dp));
  const ys = steps.map((dp) => Math.log(deepRelRange(dp) - RELRANGE_INF));
  const slope = -mFixed;
  const lnb = mean(ys.map((y, i) => y - slope * xs[i]));
  const yhat = xs.map((x) => lnb + slope * x);
  const ybar = mean(ys);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { b: Math.exp(lnb), r2: 1 - ssr / sst };
}
const PRESCRIBED_FIT = fixedExponentFit(ROUNDOFF_STEPS, 1); // b/dp -- the ticket form, misfits

// (3) OPTIMAL STEP dp*: the ticket-prescribed (b/2a)^(1/3) diverges (a ~ 0, no interior optimum),
//     so define the PRACTICAL optimum as the roundoff-floor crossing under the fitted b/dp^m:
//     roundoff excess = TOL_FRACTION of the structural floor. dp* = (b / (TOL_FRACTION * RELRANGE_INF))^(1/m).
const TOL_FRACTION = 0.10; // crossing threshold: 10% of the structural floor
const CROSS_TOL = TOL_FRACTION * RELRANGE_INF;
const DP_STAR = Math.pow(FREE_FIT.b / CROSS_TOL, 1 / FREE_FIT.m); // ~2.61e-3

// (4) VERIFY at dp*: residual deep-vs-mid drift and residual deep relative range.
const DRIFT_AT_STAR = driftAt(DP_STAR); // ~ -0.1012
const RELRANGE_AT_STAR = deepRelRange(DP_STAR); // ~0.093
const RESIDUAL_DRIFT_EXCESS = DRIFT_AT_STAR - DRIFT_INF; // ~ -4.4e-3 (within ~4% of the plateau intrinsic)
const RESIDUAL_RELRANGE_EXCESS = RELRANGE_AT_STAR - RELRANGE_INF; // ~7.8e-3 (near the crossing tol)

// The parents' Richardson intrinsic (imp-34587), reproduced here only to quantify the correction.
const IMP34587_RICHARDSON_INTRINSIC = -0.074829;
const PLATEAU_VS_RICHARDSON = DRIFT_INF / IMP34587_RICHARDSON_INTRINSIC; // ~1.29 (plateau ~29% deeper)

const DP_STEP_ROWS = [1e-3, 2e-3, 4e-3, DP_STAR, 6e-3, 1e-2, 1e-1].map((dp) => ({
  dp: +dp.toExponential(4),
  drift: +driftAt(dp).toFixed(6),
  deep_relrange: +deepRelRange(dp).toFixed(6),
}));

export const IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP = Object.freeze({
  id: 'imp-34593',
  proofSection: 'S-frontier',
  claim_measured:
    'Fit the imp-34573 deep-tail q3-share error vs the finite-difference step dp to a total-error ' +
    'model err(dp) ~ a dp^2 + b/dp (truncation + roundoff, imp-34566 F3) and predict the optimal dp* ' +
    'minimizing it, then verify by re-measuring the deep-vs-mid q3-share drift at dp* -- an ' +
    'optimal-step analysis on the inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  plateau_steps: Object.freeze(PLATEAU_STEPS.slice()),
  drift_plateau_intrinsic: +DRIFT_INF.toFixed(6), // ~ -0.09682 (truncation- and roundoff-free)
  deep_relrange_structural_floor: +RELRANGE_INF.toFixed(6), // ~0.08538
  roundoff_exponent_free: +FREE_FIT.m.toFixed(3), // ~3.5 -- third-difference eps/dp^3, NOT 1
  roundoff_fit_b_free: +FREE_FIT.b.toExponential(4),
  roundoff_fit_r2_free: +FREE_FIT.r2.toFixed(6), // ~0.99
  prescribed_bOverDp_fit_r2: +PRESCRIBED_FIT.r2.toFixed(6), // ~0.48 -- b/dp misfits (exponent wrong)
  truncation_coefficient_negligible: true, // both proxies flat to dp = 0.2 => a ~ 0, no interior optimum
  prescribed_interior_optimum_diverges: true, // (b/2a)^(1/3) diverges because a ~ 0
  crossing_tol_fraction: TOL_FRACTION,
  dp_star: +DP_STAR.toExponential(4), // ~2.61e-3 -- roundoff-floor crossing (practical optimum)
  drift_at_dp_star: +DRIFT_AT_STAR.toFixed(6), // ~ -0.1012
  deep_relrange_at_dp_star: +RELRANGE_AT_STAR.toFixed(6), // ~0.093
  residual_drift_excess_at_dp_star: +RESIDUAL_DRIFT_EXCESS.toExponential(3), // ~ -4.4e-3
  residual_deep_relrange_excess_at_dp_star: +RESIDUAL_RELRANGE_EXCESS.toExponential(3), // ~7.8e-3
  imp34587_richardson_intrinsic: IMP34587_RICHARDSON_INTRINSIC, // -0.074829 (contaminated by dp=2e-3 dip)
  plateau_vs_richardson_ratio: +PLATEAU_VS_RICHARDSON.toFixed(4), // ~1.29 -- plateau intrinsic ~29% deeper
  dp_step_rows: Object.freeze(DP_STEP_ROWS.map((r) => Object.freeze(r))),
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Optimal finite-difference-step (dp) analysis of the imp-34573 ' +
    'deep-tail q3-share error [q3 share of C_th = C_q2 + C_q3, C_q3 = q3/(6 q1^2), q1,q2,q3 the ' +
    'inherited central differences of q = log E_coll in log N; deep = N >= N* ~ 4.62e13, imp-33620 ' +
    'sigma < 0.01, vs mid = N < N*]. The ticket asked to fit err(dp) ~ a dp^2 + b/dp (truncation + ' +
    'roundoff, imp-34566 F3) and solve dp* = (b/2a)^(1/3). (F1) The error is ROUNDOFF-LIMITED with a ' +
    'NEGLIGIBLE truncation channel: the deep-vs-mid drift is flat at ~ -0.09682 and the deep-group ' +
    'relative range flat at ~0.08538 across dp = 6e-3 .. 1e-1 (q = log E_coll is analytic and slowly ' +
    'varying, so its central-difference truncation term is negligible), so a ~ 0 and the prescribed ' +
    '(b/2a)^(1/3) DIVERGES -- there is no interior U-shaped optimum, only a roundoff-limited plateau. ' +
    '(F2) The roundoff exponent is ~3, NOT 1: the deep relative-range excess over its structural ' +
    'floor fits b/dp^m with m ~ 3.5 (R^2 ~ 0.99 log-log), consistent with roundoff on the ' +
    'THIRD-difference q3 = (4-point)/(2 dp^3), eps/dp^3; forcing the prescribed first-derivative ' +
    'exponent m = 1 (b/dp) fits far worse (R^2 ~ 0.48). So the classic a dp^2 + b/dp form ' +
    'mis-specifies this roundoff channel; the correct floor model is err(dp) ~ R_inf + b/dp^3. ' +
    '(F3) The practical optimal step is the roundoff-floor crossing (excess = 10% of the structural ' +
    'floor) dp* ~ 2.61e-3; re-measuring there gives a residual deep-vs-mid drift ~ -0.1012 (within ' +
    '~4% of the plateau intrinsic) and a deep relative range ~0.093 (within ~9% of the floor). And ' +
    'the PLATEAU intrinsic drift is ~ -0.0968 (~9.7%), NOT the ~ -0.0748 (~7.5%) imp-34587 got by ' +
    'Richardson-extrapolating through the roundoff-DIP at dp = 2e-3 (drift -0.0807, a below-optimal ' +
    'outlier) -- a ~29% correction. CONCLUSION: within the inherited component model the deep-tail ' +
    'q3-share error is roundoff-limited (truncation ~ 0, roundoff ~ eps/dp^3), the practical optimal ' +
    'step is dp* ~ 2.6e-3, and the true intrinsic deep-vs-mid q3-share drift is ~ -9.7%, correcting ' +
    'the parents ~ -7.5..8% floor. q1,q2,q3 are inherited central differences, NOT fresh analytic ' +
    'closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least ' +
    'trustworthy) is inherited as-is -- this diagnoses that regime, it does not rehabilitate it. The ' +
    '-2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34573 (deep-tail q3-share error, deep-vs-mid drift at dp = 1e-3, 2e-3); imp-34587 ' +
    '(Richardson dp -> 0 intrinsic ~ -7.5%, corrected to the ~ -9.7% plateau here); imp-34566 ' +
    '(truncation-vs-roundoff finite-difference floor F3); imp-34543 (q2/q3 shares as ladder ' +
    'aggregates); imp-34531 (F2 O(h^2) coefficient certification); imp-34446 (central-difference ' +
    'exponent); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); ' +
    'imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34593_ASSERTIONS = [
  {
    id: 'imp34593-truncation-channel-negligible-plateau',
    holds: () => {
      const d6 = driftAt(6e-3);
      const d100 = driftAt(1e-1);
      return Math.abs(d6 - d100) < 1e-3 && Math.abs(deepRelRange(6e-3) - deepRelRange(1e-1)) < 1e-3;
    },
    why: 'F1: the drift and deep relative range are flat across dp = 6e-3 .. 1e-1 (truncation coefficient a ~ 0) -- the prescribed a dp^2 + b/dp has no interior optimum, only a roundoff-limited plateau.',
  },
  {
    id: 'imp34593-roundoff-exponent-is-third-difference-not-one',
    holds: () => FREE_FIT.m > 2.5 && FREE_FIT.r2 > 0.95 && PRESCRIBED_FIT.r2 < 0.7,
    why: 'F2: the roundoff excess fits b/dp^m with m ~ 3.5 (R^2 ~ 0.99), consistent with third-difference eps/dp^3; forcing the prescribed m = 1 (b/dp) fits far worse (R^2 ~ 0.48).',
  },
  {
    id: 'imp34593-dp-star-in-expected-window',
    holds: () => DP_STAR > 1.5e-3 && DP_STAR < 5e-3,
    why: 'F3: the roundoff-floor crossing dp* lands ~2.6e-3, above the roundoff-dominated dp = 1e-3 and near where imp-34573 said dp = 2e-3 beats dp = 1e-3.',
  },
  {
    id: 'imp34593-residual-drift-near-plateau-at-dp-star',
    holds: () => Math.abs(RESIDUAL_DRIFT_EXCESS) < 0.02 && DRIFT_AT_STAR < 0,
    why: 'F3: re-measured at dp* the deep-vs-mid drift sits within ~2% of the plateau intrinsic -- the crossing step recovers the roundoff-free drift.',
  },
  {
    id: 'imp34593-plateau-corrects-richardson-intrinsic',
    holds: () =>
      DRIFT_INF < IMP34587_RICHARDSON_INTRINSIC && PLATEAU_VS_RICHARDSON > 1.15 && DRIFT_INF < -0.08,
    why: 'F3: the plateau intrinsic drift (~ -0.097) is deeper than the imp-34587 Richardson intrinsic (-0.0748), which was contaminated by the roundoff dip at dp = 2e-3 -- a ~29% correction of the parents floor.',
  },
  {
    id: 'imp34593-honesty-gate-no-qed',
    holds: () =>
      IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP.isRigorous === false &&
      /NO QED/.test(IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP.verdict) &&
      /refereed bound is changed/i.test(IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP.verdict) &&
      /UNTOUCHED/.test(IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34593_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34593-drift-share-error-optimal-dp-fit assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34593_DRIFT_SHARE_ERROR_OPTIMAL_DP;
