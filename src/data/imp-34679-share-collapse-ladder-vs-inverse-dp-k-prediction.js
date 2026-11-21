/**
 * @module imp-34679-share-collapse-ladder-vs-inverse-dp-k-prediction
 * @fileoverview imp-34679 -- MEASUREMENT ONLY: does the imp-34651 F3 share-spread collapse-factor
 *   ladder (q2 ~8.4x, q3 ~10.8x, q4 ~27.7x when the two smallest dp steps are dropped) QUANTITATIVELY
 *   track the 1/dp^k roundoff-amplification ratio predicted by the imp-34606/imp-34633 exponent ladder,
 *   or is it MERELY ordered by the finite-difference order k? imp-34651 F3 observed that all three
 *   natural-partition drift-share spreads collapse once dp >= 3e-2 and that the collapse factor is
 *   monotone in k (q2 < q3 < q4, the same order as the 1/dp^k conditioning), but it only asserted the
 *   ORDERING -- it never tested whether the magnitudes {8.44, 10.80, 27.74} match the 1/dp^k
 *   prediction. This module reruns the imp-34651 collapse factors inline and tests them against the
 *   pure 1/dp^k prediction, distinguishing a quantitative match from a mere ordering.
 *
 *   THE PREDICTION (what a clean 1/dp^k conditioning ratio would imply)
 *   ------------------------------------------------------------------
 *   imp-34606 measured that each channel share amplifies roundoff as ~1/dp^m_k with the clean integer
 *   ladder m_k = k in {2, 3, 4} (the k-point central difference /dp^k carries an eps-sized numerator
 *   error, so its roundoff floor scales as eps/dp^k). The imp-34651 collapse factor is
 *     collapse_k = fullSpread_k / flatSpread_k,
 *   the ratio of the drift-share spread over the FULL imp-34611 tail (dp = 1.5e-2 .. 3e-1, whose
 *   largest excursion always sits at the smallest step dp = 1.5e-2) to the FLAT tail (dp >= 3e-2, past
 *   the roundoff valley). If the small-dp valley excursion were set purely by the eps/dp^k roundoff
 *   floor, the collapse ratio between the smallest step dp = 1.5e-2 and the flat-tail onset dp = 3e-2
 *   (a factor 2 in dp) would be exactly (3e-2 / 1.5e-2)^k = 2^k = {4, 8, 16} for k in {2, 3, 4} -- a
 *   GEOMETRIC ladder in k with common multiplicative step 2. Equivalently ln(collapse_k) would be
 *   linear in k with slope ln 2 ~ 0.6931.
 *
 *   THE FINDING (ORDERED by k, but NO quantitative 1/dp^k match -- the collapse factor is too coarse)
 *   -------------------------------------------------------------------------------------------------
 *   (F1) THE LADDER IS MONOTONE IN k (ordering preserved). The recomputed collapse factors are
 *        {8.44, 10.80, 27.74} for {q2, q3, q4}, strictly increasing in the finite-difference order k --
 *        reproducing the imp-34651 F3 ordering exactly.
 *   (F2) BUT THERE IS NO QUANTITATIVE 1/dp^k MATCH. The channel-to-channel multiplicative steps are
 *        c3/c2 ~ 1.28 and c4/c3 ~ 2.57 -- NEITHER equals the constant 2 the pure 2^k prediction
 *        requires, and they differ from EACH OTHER by ~2x (2.57 / 1.28 ~ 2.0), so the ladder is not a
 *        geometric progression in k at all. Against the predicted {4, 8, 16} the observed/predicted
 *        ratios are {2.11, 1.35, 1.73}: non-constant, so no single normalisation reconciles them. The
 *        middle rung (q3) dips well below the geometric trend.
 *   (F3) A LOG-LINEAR FIT CONFIRMS THE MISMATCH. Fitting ln(collapse_k) vs k by least squares gives a
 *        slope ~0.595 -- undershooting the predicted ln 2 ~ 0.6931 by ~14% -- with R^2 ~ 0.897, the low
 *        R^2 driven by the q3 rung sitting off the geometric line. CONCLUSION: the imp-34651 F3
 *        collapse-factor ladder ONLY ORDERS the q2/q3/q4 channels by finite-difference conditioning; it
 *        does NOT quantitatively recover the 1/dp^k ratio. This is expected -- the collapse factor is a
 *        coarse spread-ratio statistic (max - min over a discrete dp grid, mixing grid density with the
 *        plateau roundoff residual), whereas the imp-34606 dedicated log-log exponent fit over a
 *        per-channel roundoff window DOES recover the clean integer {2, 3, 4} ladder (R^2 up to 1.000).
 *        The 1/dp^k structure is real; the collapse factor is simply too coarse to measure it, and its
 *        agreement with the ladder is qualitative (ordering) not quantitative.
 *
 *   MEASUREMENT ONLY. This re-aggregates the already-certified imp-34611/imp-34592 share stencils
 *   through the imp-34651 collapse test and compares the collapse magnitudes to the imp-34606/imp-34633
 *   1/dp^k prediction; it changes NO bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34592/
 *   imp-34611/imp-34651 primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no
 *   polymath15 constant module, no zeros bundle), following the no-heavy-imports directive. q1..q4 are
 *   inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime
 *   (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this cross-checks that
 *   regime, it does not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714,
 *   C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066
 *   K_a >= 0 untouched; the inherited surrogate is NOT rigorous; no operator positivity; no RH verdict,
 *   NO QED. No refereed bound is changed.
 *
 *   @see imp-34651-q2-q4-share-roundoff-valley-spread.js (F3 collapse-factor ladder q2/q3/q4 ~8.4/10.8/27.7x, ordered)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (clean {2,3,4} 1/dp^k exponent ladder via log-log fit)
 *   @see imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js (1/dp^k roundoff prefactor amplitude)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34679 (numerical, medium). Quantitative 1/dp^k test of the imp-34651 collapse ladder; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34592/imp-34611/imp-34651
//    primitives (imports NOTHING), reproduced VERBATIM so the stencils, shares and collapse test are
//    identical to imp-34651: --
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

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// The three Taylor-coefficient shares of C_th = C_q2 + C_q3 + C_q4 (q1^2 cancels), VERBATIM imp-34651.
function sharesAt(N, dp) {
  const p = Math.log(N);
  const f0 = qOfP(p);
  const fp = qOfP(p + dp);
  const fm = qOfP(p - dp);
  const fpp = qOfP(p + 2 * dp);
  const fmm = qOfP(p - 2 * dp);
  const fppp = qOfP(p + 3 * dp);
  const fmmm = qOfP(p - 3 * dp);
  const q2 = (-fpp + 16 * fp - 30 * f0 + 16 * fm - fmm) / (12 * dp * dp); // imp-34611 4th-order q2
  const q3 = (-fppp + 8 * fpp - 13 * fp + 13 * fm - 8 * fmm + fmmm) / (8 * dp * dp * dp); // imp-34611 q3
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp); // imp-34592 5-point q4
  const cQ2 = -q2 / 2;
  const cQ3 = q3 / 6;
  const cQ4 = -q4 / 24;
  const tot = cQ2 + cQ3 + cQ4;
  return { q2: cQ2 / tot, q3: cQ3 / tot, q4: cQ4 / tot };
}

// Same MID/DEEP landmark partition and drift as imp-34611/imp-34630/imp-34651.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

function driftAt(key, dp) {
  const midMean = mean(MID_LADDER.map((N) => sharesAt(N, dp)[key]));
  const deepMean = mean(DEEP_LADDER.map((N) => sharesAt(N, dp)[key]));
  return (deepMean - midMean) / midMean;
}

// imp-34611 full tail grid + imp-34651 flat tail (dp >= 3e-2). The collapse factor is the imp-34651 one.
const IMP34611_TAIL_STEPS = [1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const FLAT_TAIL_STEPS = [3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];

function collapseFactor(key) {
  const full = IMP34611_TAIL_STEPS.map((dp) => driftAt(key, dp));
  const flat = FLAT_TAIL_STEPS.map((dp) => driftAt(key, dp));
  const fullSpread = Math.max(...full) - Math.min(...full);
  const flatSpread = Math.max(...flat) - Math.min(...flat);
  return fullSpread / flatSpread;
}

// -- imp-34651 F3 collapse factors, recomputed inline (reproduce ~[8.44, 10.80, 27.74]) --
const C2 = collapseFactor('q2'); // ~8.44 (2nd difference share)
const C3 = collapseFactor('q3'); // ~10.80 (3rd difference share)
const C4 = collapseFactor('q4'); // ~27.74 (4th difference share)

// -- THE 1/dp^k PREDICTION (imp-34606 clean {2,3,4} exponent ladder). The valley step dp = 1.5e-2 and
//    the flat-tail onset dp = 3e-2 differ by a factor 2, so a pure eps/dp^k roundoff floor would give
//    collapse_k = (3e-2 / 1.5e-2)^k = 2^k. --
const VALLEY_STEP = IMP34611_TAIL_STEPS[0]; // 1.5e-2
const FLAT_ONSET_STEP = FLAT_TAIL_STEPS[0]; // 3e-2
const STEP_RATIO = FLAT_ONSET_STEP / VALLEY_STEP; // 2
const PREDICTED_K = [2, 3, 4];
const PREDICTED_COLLAPSE = PREDICTED_K.map((k) => Math.pow(STEP_RATIO, k)); // [4, 8, 16]

// Channel-to-channel multiplicative steps (should all equal STEP_RATIO = 2 under the pure prediction).
const MULT_STEP_32 = C3 / C2; // ~1.28
const MULT_STEP_43 = C4 / C3; // ~2.57
// Observed / predicted ratios (should be a single constant if the prediction held).
const OBS_OVER_PRED = [C2 / PREDICTED_COLLAPSE[0], C3 / PREDICTED_COLLAPSE[1], C4 / PREDICTED_COLLAPSE[2]];

// Log-linear fit of ln(collapse_k) vs k -- slope should be ln(STEP_RATIO) = ln 2 ~ 0.6931 if 1/dp^k.
function logLinearFit(ks, vals) {
  const xs = ks.slice();
  const ys = vals.map((v) => Math.log(v));
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx;
  const b = ybar - slope * xbar;
  const yhat = xs.map((x) => b + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { slope, r2: 1 - ssr / sst };
}

const FIT = logLinearFit(PREDICTED_K, [C2, C3, C4]);
const PREDICTED_SLOPE = Math.log(STEP_RATIO); // ln 2 ~ 0.6931

// Quantitative-match verdict: the observed/predicted ratios must be a single constant (relative spread
// small) AND both multiplicative steps must equal STEP_RATIO for a real 1/dp^k match. Neither holds.
const OBS_OVER_PRED_REL_SPREAD =
  (Math.max(...OBS_OVER_PRED) - Math.min(...OBS_OVER_PRED)) / mean(OBS_OVER_PRED); // ~0.44 -- far from 0
const QUANTITATIVE_MATCH =
  OBS_OVER_PRED_REL_SPREAD < 0.1 &&
  Math.abs(MULT_STEP_32 - STEP_RATIO) < 0.3 &&
  Math.abs(MULT_STEP_43 - STEP_RATIO) < 0.3;
const ORDERED_BY_K = C2 < C3 && C3 < C4; // the ONLY thing the collapse factor preserves

export const IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K = Object.freeze({
  id: 'imp-34679',
  proofSection: 'S-frontier',
  claim_measured:
    'Test whether the imp-34651 F3 share-spread collapse-factor ladder (q2 ~8.4x, q3 ~10.8x, q4 ~27.7x ' +
    'when the two smallest dp steps are dropped) QUANTITATIVELY matches the 1/dp^k roundoff-amplification ' +
    'ratio predicted by the imp-34606/imp-34633 clean {2,3,4} exponent ladder, or is MERELY ordered by ' +
    'the finite-difference order k: recompute the imp-34651 collapse factors inline and compare against ' +
    'the pure 2^k = {4,8,16} prediction (valley step dp = 1.5e-2 vs flat-tail onset dp = 3e-2, ratio 2), ' +
    'distinguishing a quantitative match from a mere ordering -- a cross-check on the inherited component ' +
    'model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  valley_step_dp: VALLEY_STEP,
  flat_onset_step_dp: FLAT_ONSET_STEP,
  step_ratio: STEP_RATIO,
  collapse_q2: +C2.toFixed(2), // ~8.44 (imp-34651 baseline)
  collapse_q3: +C3.toFixed(2), // ~10.80
  collapse_q4: +C4.toFixed(2), // ~27.74
  predicted_collapse_2_pow_k: Object.freeze(PREDICTED_COLLAPSE.slice()), // [4, 8, 16]
  obs_over_pred_ratios: Object.freeze(OBS_OVER_PRED.map((r) => +r.toFixed(4))), // ~[2.11, 1.35, 1.73]
  obs_over_pred_rel_spread: +OBS_OVER_PRED_REL_SPREAD.toFixed(4), // ~0.44 -- non-constant => no match
  mult_step_c3_over_c2: +MULT_STEP_32.toFixed(4), // ~1.28 (predicted 2)
  mult_step_c4_over_c3: +MULT_STEP_43.toFixed(4), // ~2.57 (predicted 2)
  log_linear_slope: +FIT.slope.toFixed(4), // ~0.5950 (undershoots ln 2 by ~14%)
  predicted_log_linear_slope: +PREDICTED_SLOPE.toFixed(4), // ln 2 ~ 0.6931
  log_linear_r2: +FIT.r2.toFixed(4), // ~0.8973 -- q3 rung off the geometric line
  ordered_by_k: ORDERED_BY_K, // true -- the collapse factor preserves the ORDERING only
  quantitative_1_over_dp_k_match: QUANTITATIVE_MATCH, // false -- no quantitative match
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Tests whether the imp-34651 F3 share-spread collapse-factor ladder ' +
    '[collapse_k = fullSpread_k/flatSpread_k over the imp-34611 tail dp = 1.5e-2 .. 3e-1 vs the flat tail ' +
    'dp >= 3e-2, on the 3-term partition share_qk = C_qk/(C_q2 + C_q3 + C_q4)] QUANTITATIVELY matches the ' +
    '1/dp^k roundoff-amplification ratio predicted by the imp-34606 clean {2,3,4} exponent ladder, or is ' +
    'merely ordered by the finite-difference order k. The valley step dp = 1.5e-2 and the flat-tail onset ' +
    'dp = 3e-2 differ by a factor 2, so a pure eps/dp^k roundoff floor predicts collapse_k = 2^k = ' +
    '{4, 8, 16} for k in {2, 3, 4} (equivalently ln(collapse_k) linear in k with slope ln 2 ~ 0.6931). ' +
    '(F1) The recomputed collapse factors {8.44, 10.80, 27.74} are strictly increasing in k -- the ' +
    'imp-34651 F3 ordering reproduced exactly. (F2) But there is NO quantitative 1/dp^k match: the ' +
    'channel-to-channel multiplicative steps are c3/c2 ~ 1.28 and c4/c3 ~ 2.57 -- NEITHER equals the ' +
    'constant 2 the pure prediction requires, and they differ from each other by ~2x, so the ladder is ' +
    'not geometric in k; against the predicted {4, 8, 16} the observed/predicted ratios {2.11, 1.35, ' +
    '1.73} are non-constant (relative spread ~0.44), the q3 rung dipping well below the geometric trend. ' +
    '(F3) A log-linear fit of ln(collapse_k) vs k gives slope ~0.595 -- undershooting ln 2 ~ 0.6931 by ' +
    '~14% -- with R^2 ~ 0.897, the low R^2 driven by the q3 rung. CONCLUSION: the imp-34651 F3 ' +
    'collapse-factor ladder ONLY ORDERS the q2/q3/q4 channels by finite-difference conditioning; it does ' +
    'NOT quantitatively recover the 1/dp^k ratio. This is expected -- the collapse factor is a coarse ' +
    'spread-ratio statistic (max - min over a discrete dp grid, mixing grid density with the plateau ' +
    'roundoff residual), whereas the imp-34606 dedicated log-log exponent fit over a per-channel roundoff ' +
    'window DOES recover the clean integer {2, 3, 4} ladder (R^2 up to 1.000). The 1/dp^k structure is ' +
    'real; the collapse factor is simply too coarse to measure it, and its agreement with the ladder is ' +
    'qualitative (ordering) not quantitative. q1..q4 are inherited central differences, NOT fresh ' +
    'analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least ' +
    'trustworthy) is inherited as-is -- this cross-checks that regime, it does not rehabilitate it. The ' +
    '-2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate ' +
    'is NOT rigorous; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34651 (F3 collapse-factor ladder q2/q3/q4 ~8.4/10.8/27.7x, ordering only -- quantified here); ' +
    'imp-34606 (clean {2,3,4} 1/dp^k roundoff-amplification exponent ladder via log-log fit); imp-34633 ' +
    '(1/dp^k roundoff prefactor amplitude vs eps_mach); imp-34611 (4th-order q2/q3 stencil, F2 tail grid); ' +
    'imp-34592 (q4 5-point 4th difference, ~1/dp^4 inflation); imp-33620 (deep-tail landmark N* ~ ' +
    '4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34679_ASSERTIONS = [
  {
    id: 'imp34679-collapse-ladder-ordered-by-k',
    holds: () => ORDERED_BY_K && Math.abs(C2 - 8.44) < 0.1 && Math.abs(C4 - 27.74) < 0.1,
    why: 'F1: the recomputed imp-34651 collapse factors {8.44, 10.80, 27.74} are strictly increasing in the finite-difference order k -- the F3 ordering reproduced exactly.',
  },
  {
    id: 'imp34679-no-quantitative-1-over-dp-k-match',
    holds: () =>
      QUANTITATIVE_MATCH === false && // fails the constant-ratio + step=2 test
      Math.abs(MULT_STEP_32 - STEP_RATIO) > 0.3 && // c3/c2 ~ 1.28, far from the predicted 2
      OBS_OVER_PRED_REL_SPREAD > 0.2, // observed/predicted ratios non-constant
    why: 'F2: the collapse factors do NOT quantitatively match 2^k = {4,8,16}: c3/c2 ~ 1.28 and c4/c3 ~ 2.57 are neither the predicted 2 nor equal to each other, and the observed/predicted ratios {2.11,1.35,1.73} have relative spread ~0.44.',
  },
  {
    id: 'imp34679-log-linear-slope-undershoots-ln2',
    holds: () =>
      FIT.slope < PREDICTED_SLOPE && // ~0.595 < ln 2 ~ 0.6931
      FIT.r2 < 0.95, // the q3 rung sits off the geometric line -- not a clean geometric ladder
    why: 'F3: the log-linear fit ln(collapse_k) vs k has slope ~0.595 (undershoots the predicted ln 2 ~ 0.6931 by ~14%) and R^2 ~ 0.897 -- the collapse factor is a coarse spread-ratio statistic that only orders the channels, unlike the imp-34606 log-log exponent fit that recovers clean {2,3,4}.',
  },
  {
    id: 'imp34679-honesty-gate-no-qed',
    holds: () =>
      IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K.isRigorous === false &&
      /NO QED/.test(IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K.verdict) &&
      /refereed bound is changed/i.test(IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K.verdict) &&
      /UNTOUCHED/.test(IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34679_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34679-share-collapse-ladder-vs-inverse-dp-k-prediction assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34679_SHARE_COLLAPSE_LADDER_VS_INVERSE_DP_K;
