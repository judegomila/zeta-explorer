/**
 * @module imp-34708-q3-eleven-point-floor-width-scaling
 * @fileoverview imp-34708 -- MEASUREMENT ONLY: extend the imp-34690 near-cancellation input-roundoff
 *   floor closed form  F ~ eps*(maxNum/denom)/(dp^3 * |q3|)  to the 11-point accuracy-8 antisymmetric
 *   3rd-difference Fornberg q3 stencil, and test whether the ~1.25x-per-widening maxNum/denom law
 *   (measured by imp-34690 for the 7->9-point step) CONTINUES to the 9->11-point step.
 *
 *   imp-34690 (F1/F2) pinned the 9-point/7-point floor ratio to a CONSTANT ~1.251 = (488/240)/(13/8),
 *   with the stencil-width dependence entering ONLY through maxNum/denom (max|term| ~ maxNum*|q|,
 *   |sum| ~ denom*dp^3*|q3|, q3 nearly stencil-independent). This module derives maxNum/denom for the
 *   accuracy-8 11-point stencil, predicts the 11-point/9-point floor ratio, and MEASURES the actual
 *   near-cancellation floor max|term|*eps/|sum| across the imp-33620 deep-tail ladder (N >= N* ~ 4.62e13).
 *
 *   THE FINDING (the ~1.25x law does NOT continue -- the per-widening factor DECAYS toward 1)
 *   ---------------------------------------------------------------------------------------------
 *   (F1) THE 11-POINT ACCURACY-8 3rd-DIFFERENCE STENCIL is [205,-2522,14607,-52428,70098,0,-70098,
 *        52428,-14607,2522,-205] / 30240 (Fornberg 1988; verified against the recurrence). Its
 *        maxNum/denom = 70098/30240 = 2.318056, versus 488/240 = 2.033333 for the 9-point and
 *        13/8 = 1.625 for the 7-point.
 *   (F2) THE CLOSED-FORM FLOOR RATIO 11pt/9pt IS (70098/30240)/(488/240) = 1.140027, and the MEASURED
 *        floor ratio across the deep-tail (N,dp) grid is a near-constant mean ~1.140031 -- matching the
 *        closed form to ~4e-6, exactly as the imp-34690 F ~ eps*(maxNum/denom)/(dp^3*|q3|) model predicts.
 *   (F3) THE ~1.25x-PER-WIDENING LAW DOES NOT CONTINUE. The per-step multiplicative factor DECAYS:
 *        1.251282 for the 7->9 step, 1.140027 for the 9->11 step. The floor ratio drifts DOWN toward 1
 *        as the stencil widens -- consistent with the peak central-q3 Fornberg weight (maxNum/denom)
 *        converging to a finite limit, so each further widening adds diminishing extra lost digits.
 *   (F4) THE EXACTLY-REPRESENTABLE-WEIGHTS STATUS WORSENS WITH WIDTH. The 11-point Fornberg weights are
 *        NOT exactly representable (raw residual ~5.37e-11), and that residual is ~100x LARGER than the
 *        9-point ~5.33e-13 (imp-34690 F3). Yet the ~1e12 near-cancellation-amplified raw-vs-exact q3
 *        relative difference at (N*,dp=3e-2) is ~3.08e-5 for the 11-point -- comparable to (slightly
 *        below) the 9-point ~4.48e-5, NOT ~100x larger. So the larger raw residual does not translate
 *        monotonically into a larger amplified share error at this reference point.
 *
 *   MEASUREMENT ONLY. Reproduces the imp-34446/imp-34531/imp-34611 primitives (heightForN, eColl, qOfP)
 *   and the imp-34690 conditioning/Fornberg primitives inline; imports NOTHING (no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), per the no-heavy-imports
 *   directive. q1,q2,q3 remain inherited central differences, NOT fresh analytic closed forms -- so the
 *   sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited
 *   as-is; this characterizes the STENCIL conditioning, it does not rehabilitate the surrogate. The -2
 *   asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity;
 *   no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34690-q3-share-cancellation-stencil-width-scaling.js (the 7->9 floor ratio + closed form)
 *   @see imp-34654-sixth-order-stencil-reference-weight-crossvalidation.js (9-point stencil / conditioning)
 *   @see imp-34611-plateau-drift-independent-stencil-crosscheck.js (the inline 7-point stencil)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34708 (numerical, medium). Stencil-width conditioning measurement; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34611 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the reference deep-tail point
const EPS_MACH = Number.EPSILON; // ~2.220446e-16

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

const eColl = (N) => C_C * Math.sqrt(Math.log(heightForN(N)) / N);
const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// -- The three antisymmetric central q3 stencils under comparison (q3 = num.q / (denom * dp^3)): --
//    accuracy-4 7-point (imp-34611); accuracy-6 9-point (imp-34626/imp-34654); accuracy-8 11-point (new).
const Q3_7PT = { grid: [-3, -2, -1, 0, 1, 2, 3], num: [1, -8, 13, 0, -13, 8, -1], denom: 8, order: 3 };
const Q3_9PT = {
  grid: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
  num: [-7, 72, -338, 488, 0, -488, 338, -72, 7],
  denom: 240,
  order: 3,
};
// accuracy-8 11-point: Fornberg weights * 30240 (verified against the recurrence below; max raw residual
// ~5.37e-11). Peak numerator 70098 at offset +/-1, denom 30240.
const Q3_11PT = {
  grid: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
  num: [205, -2522, 14607, -52428, 70098, 0, -70098, 52428, -14607, 2522, -205],
  denom: 30240,
  order: 3,
};

// Fornberg (1988) finite-difference-weight recurrence (verbatim imp-34690) -- to expose the raw-float
// weight residual that the exactly-representable-weights effect (imp-34684 F3 / imp-34690 F3) amplifies.
function fornbergWeights(z, x, m) {
  const n = x.length - 1;
  const c = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  let c1 = 1;
  let c4 = x[0] - z;
  c[0][0] = 1;
  for (let i = 1; i <= n; i++) {
    const mn = Math.min(i, m);
    let c2 = 1;
    const c5 = c4;
    c4 = x[i] - z;
    for (let j = 0; j <= i - 1; j++) {
      const c3 = x[i] - x[j];
      c2 = c2 * c3;
      if (j === i - 1) {
        for (let k = mn; k >= 1; k--) c[i][k] = (c1 * (k * c[i - 1][k - 1] - c5 * c[i - 1][k])) / c2;
        c[i][0] = (-c1 * c5 * c[i - 1][0]) / c2;
      }
      for (let k = mn; k >= 1; k--) c[j][k] = (c4 * c[j][k] - k * c[j][k - 1]) / c3;
      c[j][0] = (c4 * c[j][0]) / c3;
    }
    c1 = c2;
  }
  return x.map((_, j) => c[j][m]);
}

// Near-cancellation conditioning of one q3 stencil at (N,dp): the un-normalized weighted stencil sum
// s3 = SUM_j num_j * q(p + j*dp), the largest individual summand, the cancellation ratio R =
// max|term|/|s3|, and the input-roundoff floor F = eps_mach * R = max|term|*eps/|sum|.
function conditioning(stencil, N, dp) {
  const p = Math.log(N);
  let s3 = 0;
  let maxTerm = 0;
  for (let j = 0; j < stencil.grid.length; j++) {
    const term = stencil.num[j] * qOfP(p + stencil.grid[j] * dp);
    s3 += term;
    maxTerm = Math.max(maxTerm, Math.abs(term));
  }
  const q3 = s3 / stencil.denom / (dp * dp * dp);
  const cancelRatio = maxTerm / Math.abs(s3);
  const roundoffFloor = (maxTerm * EPS_MACH) / Math.abs(s3);
  return { maxTerm, sum: s3, q3, cancelRatio, roundoffFloor };
}

// q3 evaluated from an arbitrary weight vector (raw floats with denom absorbed, or exact integers).
function q3FromWeights(stencil, N, dp, weights, denom) {
  const p = Math.log(N);
  let s3 = 0;
  for (let j = 0; j < stencil.grid.length; j++) s3 += weights[j] * qOfP(p + stencil.grid[j] * dp);
  return s3 / denom / (dp * dp * dp);
}

// Raw Fornberg-float residual (how far num.weight*denom sits from the exact integer): the exactly-
// representable-weights effect. 7-point weights are exactly representable (residual 0); 9-point carry
// ~5.3e-13; 11-point carry ~5.4e-11.
function rawWeightResidual(stencil) {
  const w = fornbergWeights(0, stencil.grid, stencil.order);
  return Math.max(...w.map((wi) => Math.abs(wi * stencil.denom - Math.round(wi * stencil.denom))));
}

function rawVsExactQ3RelDiff(stencil, N, dp) {
  const raw = fornbergWeights(0, stencil.grid, stencil.order);
  const exact = raw.map((w) => Math.round(w * stencil.denom));
  const qRaw = q3FromWeights(stencil, N, dp, raw, 1); // denom absorbed into the raw floats
  const qExact = q3FromWeights(stencil, N, dp, exact, stencil.denom);
  return Math.abs(qRaw - qExact) / Math.abs(qExact);
}

// -- Deep-tail reference (N,dp) grid: N >= N* per the ticket (imp-33620 far tail) x plateau dp ladder. --
const N_GRID = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), 1e15];
const DP_GRID = [1e-2, 1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1];

// F2: measure the 11-point/9-point floor ratio across the whole deep-tail grid.
const FLOOR_RATIOS_11_9 = [];
for (const N of N_GRID) {
  for (const dp of DP_GRID) {
    const c9 = conditioning(Q3_9PT, N, dp);
    const c11 = conditioning(Q3_11PT, N, dp);
    FLOOR_RATIOS_11_9.push(c11.roundoffFloor / c9.roundoffFloor);
  }
}
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const FLOOR_RATIO_11_9_MEAN = mean(FLOOR_RATIOS_11_9);
const FLOOR_RATIO_11_9_MIN = Math.min(...FLOOR_RATIOS_11_9);
const FLOOR_RATIO_11_9_MAX = Math.max(...FLOOR_RATIOS_11_9);

// F1/F3: closed-form per-widening factors (maxNum/denom)_wide / (maxNum/denom)_narrow.
const maxNum = (s) => Math.max(...s.num.map(Math.abs));
const MAXNUM_OVER_DENOM_7 = maxNum(Q3_7PT) / Q3_7PT.denom; // 1.625
const MAXNUM_OVER_DENOM_9 = maxNum(Q3_9PT) / Q3_9PT.denom; // 2.033333
const MAXNUM_OVER_DENOM_11 = maxNum(Q3_11PT) / Q3_11PT.denom; // 2.318056
const FACTOR_7_TO_9 = MAXNUM_OVER_DENOM_9 / MAXNUM_OVER_DENOM_7; // 1.251282
const FACTOR_9_TO_11 = MAXNUM_OVER_DENOM_11 / MAXNUM_OVER_DENOM_9; // 1.140027

// -- Reference conditioning at the imp-33620 deep-tail landmark (N*, dp = 3e-2, within the plateau). --
const REF_N = DEEP_TAIL_N;
const REF_DP = 3e-2;
const REF9 = conditioning(Q3_9PT, REF_N, REF_DP);
const REF11 = conditioning(Q3_11PT, REF_N, REF_DP);

// F4: exactly-representable-weights status of the wider stencil.
const RESIDUAL_9PT = rawWeightResidual(Q3_9PT); // ~5.33e-13
const RESIDUAL_11PT = rawWeightResidual(Q3_11PT); // ~5.37e-11
const RAWDIFF_9PT = rawVsExactQ3RelDiff(Q3_9PT, REF_N, REF_DP); // ~4.48e-5
const RAWDIFF_11PT = rawVsExactQ3RelDiff(Q3_11PT, REF_N, REF_DP); // ~3.08e-5

export const IMP34708_Q3_ELEVEN_POINT_FLOOR_WIDTH_SCALING = Object.freeze({
  id: 'imp-34708',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34690 near-cancellation input-roundoff floor closed form F ~ ' +
    'eps*(maxNum/denom)/(dp^3*|q3|) to the accuracy-8 11-point antisymmetric 3rd-difference Fornberg q3 ' +
    'stencil, and measure whether the ~1.25x-per-widening maxNum/denom law (imp-34690, 7->9 step) ' +
    'continues to the 9->11 step. Derive maxNum/denom for the 11-point stencil, predict the 11-point/' +
    '9-point floor ratio, and measure the actual near-cancellation floor max|term|*eps/|sum| across the ' +
    'imp-33620 deep-tail ladder N >= N* ~ 4.62e13. Measurement on an inherited component model, not a bound.',
  q3_9pt_weights: Object.freeze(Q3_9PT.num.slice()),
  q3_9pt_denominator: Q3_9PT.denom,
  q3_11pt_weights: Object.freeze(Q3_11PT.num.slice()),
  q3_11pt_denominator: Q3_11PT.denom,
  reference_N: REF_N,
  reference_dp: REF_DP,
  // F1: maxNum/denom for each stencil, and the near-cancellation ratio at the reference point.
  maxnum_over_denom_7pt: +MAXNUM_OVER_DENOM_7.toFixed(6), // 1.625
  maxnum_over_denom_9pt: +MAXNUM_OVER_DENOM_9.toFixed(6), // 2.033333
  maxnum_over_denom_11pt: +MAXNUM_OVER_DENOM_11.toFixed(6), // 2.318056
  ref_9pt_cancel_ratio: +REF9.cancelRatio.toExponential(3),
  ref_11pt_cancel_ratio: +REF11.cancelRatio.toExponential(3),
  ref_9pt_roundoff_floor: +REF9.roundoffFloor.toExponential(3),
  ref_11pt_roundoff_floor: +REF11.roundoffFloor.toExponential(3),
  // F2: the measured 11-point/9-point floor ratio matches the closed form (maxNum/denom)_11 / _9.
  floor_ratio_11pt_over_9pt_mean: +FLOOR_RATIO_11_9_MEAN.toFixed(6), // ~1.140031
  floor_ratio_11pt_over_9pt_min: +FLOOR_RATIO_11_9_MIN.toFixed(6),
  floor_ratio_11pt_over_9pt_max: +FLOOR_RATIO_11_9_MAX.toFixed(6),
  floor_ratio_11pt_over_9pt_closed_form: +FACTOR_9_TO_11.toFixed(6), // 1.140027
  floor_ratio_matches_closed_form: Math.abs(FLOOR_RATIO_11_9_MEAN - FACTOR_9_TO_11) < 1e-4,
  // F3: the per-widening factor DECAYS -- the ~1.25x law does NOT continue.
  per_widening_factor_7_to_9: +FACTOR_7_TO_9.toFixed(6), // 1.251282
  per_widening_factor_9_to_11: +FACTOR_9_TO_11.toFixed(6), // 1.140027
  per_widening_factor_decays: FACTOR_9_TO_11 < FACTOR_7_TO_9 - 0.05, // true
  // F4: exactly-representable-weights status of the wider stencil.
  raw_fornberg_residual_9pt: +RESIDUAL_9PT.toExponential(3), // ~5.33e-13
  raw_fornberg_residual_11pt: +RESIDUAL_11PT.toExponential(3), // ~5.37e-11
  raw_vs_exact_q3_reldiff_9pt: +RAWDIFF_9PT.toExponential(3), // ~4.48e-5
  raw_vs_exact_q3_reldiff_11pt: +RAWDIFF_11PT.toExponential(3), // ~3.08e-5
  eleven_point_weights_not_exact: RESIDUAL_11PT > 1e-12,
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extend the imp-34690 near-cancellation input-roundoff floor closed form ' +
    'F ~ eps*(maxNum/denom)/(dp^3*|q3|) to the accuracy-8 11-point antisymmetric 3rd-difference q3 ' +
    'stencil [205,-2522,14607,-52428,70098,0,-70098,52428,-14607,2522,-205]/30240 and test whether the ' +
    '~1.25x-per-widening maxNum/denom law (imp-34690, 7->9 step) continues. (F1) maxNum/denom = ' +
    '70098/30240 = 2.318056 for the 11-point, versus 488/240 = 2.033333 (9-point) and 13/8 = 1.625 ' +
    '(7-point). (F2) THE CLOSED-FORM FLOOR RATIO 11pt/9pt = (70098/30240)/(488/240) = 1.140027, and the ' +
    'MEASURED floor ratio max|term|*eps/|sum| across the deep-tail (N,dp) grid (N >= N* ~ 4.62e13) is a ' +
    'near-constant mean ~1.140031 -- matching the closed form to ~4e-6, as the imp-34690 floor model ' +
    'predicts. (F3) THE ~1.25x-PER-WIDENING LAW DOES NOT CONTINUE -- the per-step multiplicative factor ' +
    'DECAYS from 1.251282 (7->9) to 1.140027 (9->11); the floor ratio drifts DOWN toward 1 as the peak ' +
    'central-q3 Fornberg weight (maxNum/denom) converges to a finite limit, so each further widening ' +
    'adds diminishing extra lost digits. (F4) THE EXACTLY-REPRESENTABLE-WEIGHTS STATUS WORSENS WITH ' +
    'WIDTH -- the 11-point weights are NOT exactly representable (raw residual ~5.37e-11, ~100x the ' +
    '9-point ~5.33e-13), yet the near-cancellation-amplified raw-vs-exact q3 relative difference at ' +
    '(N*,dp=3e-2) is ~3.08e-5, comparable to (slightly below) the 9-point ~4.48e-5, NOT ~100x larger, ' +
    'so the larger raw residual does not translate monotonically into a larger amplified share error at ' +
    'this reference point. q1,q2,q3 are inherited central differences, NOT fresh analytic closed forms, ' +
    'so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is ' +
    'inherited as-is -- this characterizes the STENCIL conditioning, it does not rehabilitate the ' +
    'surrogate. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; ' +
    'the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34690 (7->9 floor ratio + closed form F ~ eps*(maxNum/denom)/(dp^3*|q3|)); imp-34684 (F3/F4 ' +
    'exactly-representable-weights effect); imp-34654 (9-point reference-weight cross-validation); ' +
    'imp-34611 (inline 7-point stencil); imp-34626 (9-point stencil / conditioning); imp-33620 ' +
    '(deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb ' +
    'GUE-conditional); Fornberg B. (1988), "Generation of finite difference formulas on arbitrarily ' +
    'spaced grids", Math. Comp. 51, 699-706.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34708_ASSERTIONS = [
  {
    id: 'imp34708-eleven-point-weights-verified-against-recurrence',
    holds: () => {
      const w = fornbergWeights(0, Q3_11PT.grid, Q3_11PT.order);
      return Q3_11PT.num.every((n, j) => Math.abs(w[j] * Q3_11PT.denom - n) < 1e-6);
    },
    why: 'F1: the baked-in 11-point accuracy-8 3rd-difference numerators [205,-2522,14607,-52428,70098,0,...]/30240 match the Fornberg (1988) recurrence to < 1e-6 -- the stencil is the correct accuracy-8 antisymmetric central q3 operator.',
  },
  {
    id: 'imp34708-floor-ratio-11-9-matches-closed-form',
    holds: () =>
      Math.abs(FLOOR_RATIO_11_9_MEAN - FACTOR_9_TO_11) < 1e-4 &&
      Math.abs(FACTOR_9_TO_11 - 70098 / 30240 / (488 / 240)) < 1e-12,
    why: 'F2: the measured 11-point/9-point input-roundoff floor ratio (mean ~1.140031) matches the closed form (maxNum/denom)_11 / (maxNum/denom)_9 = (70098/30240)/(488/240) = 1.140027 to ~4e-6 -- the imp-34690 floor model F ~ eps*(maxNum/denom)/(dp^3*|q3|) extends to the 11-point stencil.',
  },
  {
    id: 'imp34708-floor-ratio-11-9-nearly-constant',
    holds: () => FLOOR_RATIO_11_9_MIN > 1.135 && FLOOR_RATIO_11_9_MAX < 1.145,
    why: 'F2: the 11-point/9-point floor ratio is a near-constant ~1.140 across the whole deep-tail (N,dp) grid -- the residual q3 stencil-dependence is a few-e-4 wobble.',
  },
  {
    id: 'imp34708-per-widening-factor-decays-125-law-broken',
    holds: () =>
      FACTOR_7_TO_9 > 1.25 &&
      FACTOR_9_TO_11 < 1.15 &&
      FACTOR_9_TO_11 < FACTOR_7_TO_9 - 0.05 &&
      IMP34708_Q3_ELEVEN_POINT_FLOOR_WIDTH_SCALING.per_widening_factor_decays === true,
    why: 'F3: the per-widening maxNum/denom factor DECAYS from 1.251 (7->9) to 1.140 (9->11), so the ~1.25x-per-widening law does NOT continue -- the floor ratio drifts down toward 1 as the peak central-q3 Fornberg weight converges to a finite limit.',
  },
  {
    id: 'imp34708-eleven-point-weights-not-exact-worse-than-9pt',
    holds: () => RESIDUAL_11PT > 1e-12 && RESIDUAL_11PT > 10 * RESIDUAL_9PT,
    why: 'F4: the 11-point Fornberg weights are NOT exactly representable (raw residual ~5.37e-11) and the residual is > 10x the 9-point ~5.33e-13 -- the exactly-representable-weights status worsens with stencil width.',
  },
  {
    id: 'imp34708-amplified-share-error-not-monotone-in-residual',
    holds: () => RAWDIFF_11PT > 1e-6 && RAWDIFF_11PT < 5 * RAWDIFF_9PT && RAWDIFF_9PT > 1e-6,
    why: 'F4: despite the ~100x larger 11-point raw residual, the near-cancellation-amplified raw-vs-exact q3 relative difference at (N*,dp=3e-2) is ~3.08e-5 -- comparable to the 9-point ~4.48e-5, NOT ~100x larger -- so the larger raw residual does not translate monotonically into a larger amplified share error at this reference point.',
  },
  {
    id: 'imp34708-honesty-gate-no-qed',
    holds: () =>
      IMP34708_Q3_ELEVEN_POINT_FLOOR_WIDTH_SCALING.isRigorous === false &&
      /NO QED/.test(IMP34708_Q3_ELEVEN_POINT_FLOOR_WIDTH_SCALING.verdict) &&
      /refereed bound is changed/i.test(IMP34708_Q3_ELEVEN_POINT_FLOOR_WIDTH_SCALING.verdict) &&
      /UNTOUCHED/.test(IMP34708_Q3_ELEVEN_POINT_FLOOR_WIDTH_SCALING.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34708_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34708-q3-eleven-point-floor-width-scaling assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34708_Q3_ELEVEN_POINT_FLOOR_WIDTH_SCALING;
