/**
 * @module imp-34690-q3-share-cancellation-stencil-width-scaling
 * @fileoverview imp-34690 -- MEASUREMENT ONLY: quantify how the q3-share catastrophic-cancellation
 *   conditioning scales with finite-difference STENCIL WIDTH, resolving the imp-34684 F4 observation
 *   that the 4th-order q3-share float-order sensitivity (~9e-6) is ~30x milder than the 6th-order
 *   (~3e-4). At a reference (N,dp) grid this computes, for the imp-34611 accuracy-4 7-point q3 stencil
 *   and the imp-34626/imp-34654 accuracy-6 9-point q3 stencil:
 *     (i) the near-cancellation ratio  R = max|stencil term| / |sum|  (sum = the un-normalized
 *         weighted stencil sum s3 = SUM_j num_j * q(p + j*dp) that then divides by denom*dp^3);
 *     (ii) the input-roundoff conditioning FLOOR  F = max|term| * eps_mach / |sum| = eps_mach * R;
 *     (iii) the exactly-representable-weights effect: the raw Fornberg-float weight residual and the
 *         raw-float-vs-exact-integer q3 relative difference it drives.
 *   It then tests whether the floor F predicts the observed ~30x severity gap, and DISTINGUISHES the
 *   exactly-representable-weights effect (imp-34684 F3) from the intrinsic cancellation-depth effect
 *   (imp-34684 F4).
 *
 *   THE FINDING (the floor is nearly stencil-INDEPENDENT; the ~30x gap is the WEIGHT-residual effect)
 *   ------------------------------------------------------------------------------------------------
 *   (F1) THE INPUT-ROUNDOFF FLOOR max|term|*eps/|sum| IS NEARLY STENCIL-WIDTH-INDEPENDENT. Across the
 *        whole reference grid (dp in 1e-2..1e-1, N in 1e12..1e15) the 9-point/7-point floor ratio is a
 *        CONSTANT ~1.251 -- NOT ~30x. Both floors track the same near-cancellation depth: widening the
 *        stencil from 7 to 9 points barely changes the lost-digits floor.
 *   (F2) THAT CONSTANT HAS A CLOSED FORM. Because q(p+j*dp) ~ const over the narrow stencil, max|term|
 *        ~ maxNum * |q| and |sum| ~ denom * dp^3 * |q3| with q3 nearly stencil-independent, so
 *        F ~ eps * (maxNum/denom) / (dp^3 * |q3|). The stencil-width dependence enters ONLY through
 *        maxNum/denom: (488/240) for the 9-point vs (13/8) for the 7-point, whose ratio 2.0333/1.625 =
 *        1.25128 reproduces the measured 1.251 to 4 digits. So the floor grows ~1.25x, not 30x, from
 *        the 7-point to the 9-point stencil.
 *   (F3) THE ~30x GAP IS THE EXACTLY-REPRESENTABLE-WEIGHTS EFFECT (imp-34684 F3), NOT THE FLOOR. The
 *        7-point Fornberg weights are EXACTLY representable (raw residual 0), so the raw-float-vs-exact
 *        q3 relative difference is 0 -- the 7-point share sensitivity is set by the floor alone (~few
 *        e-6, matching the imp-34684 ~9e-6). The 9-point Fornberg weights carry a ~5.3e-13 residual
 *        that the ~1e12 near-cancellation ratio amplifies to a raw-vs-exact q3 relative difference of
 *        ~4.5e-5 at (N*,dp=3e-2) -- growing toward the imp-34654 window-mean ~3e-4. So the ~30x gap is
 *        DOMINATED by the weight-residual amplification of the LARGER stencil, not by a larger intrinsic
 *        cancellation floor.
 *   (F4) VERDICT ON THE TWO EFFECTS. The intrinsic cancellation-depth (imp-34684 F4) grows only ~1.25x
 *        with stencil width -- it does NOT explain the ~30x. The exactly-representable-weights effect
 *        (imp-34684 F3) explains it: the 7-point stencil has no weight residual to amplify (exact
 *        weights), the 9-point does (~5.3e-13 amplified to ~4.5e-5). The input-roundoff floor
 *        max|term|*eps/|sum| therefore does NOT predict the ~30x severity gap; the weight residual does.
 *
 *   MEASUREMENT ONLY. Reproduces the imp-34446/imp-34531/imp-34611 primitives (heightForN, eColl, qOfP)
 *   and the imp-34611 7-point / imp-34626 9-point q3 stencils inline; imports NOTHING (no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), per the no-heavy-imports
 *   directive. q1,q2,q3 remain inherited central differences, NOT fresh analytic closed forms -- so the
 *   sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited
 *   as-is; this characterizes the STENCIL conditioning, it does not rehabilitate the surrogate. The -2
 *   asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity;
 *   no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34684-fourth-order-stencil-reference-weight-crossvalidation.js (F3/F4: the ~30x observed here)
 *   @see imp-34654-sixth-order-stencil-reference-weight-crossvalidation.js (9-point stencil / conditioning)
 *   @see imp-34611-plateau-drift-independent-stencil-crosscheck.js (the inline 7-point stencil)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34690 (numerical, medium). Stencil-width conditioning measurement; adds no bound.
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

// -- The two q3 stencils under comparison (offsets k in units of dp; q3 = num.q / (denom * dp^3)): --
//    accuracy-4 7-point (imp-34611); accuracy-6 9-point (imp-34626/imp-34654).
const Q3_7PT = { grid: [-3, -2, -1, 0, 1, 2, 3], num: [1, -8, 13, 0, -13, 8, -1], denom: 8, order: 3 };
const Q3_9PT = {
  grid: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
  num: [-7, 72, -338, 488, 0, -488, 338, -72, 7],
  denom: 240,
  order: 3,
};

// Fornberg (1988) finite-difference-weight recurrence (verbatim imp-34654) -- to expose the raw-float
// weight residual that the exactly-representable-weights effect (imp-34684 F3) amplifies.
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
// representable-weights effect (imp-34684 F3). 7-point weights are exactly representable (residual 0);
// 9-point weights carry ~5.3e-13.
function rawWeightResidual(stencil) {
  const w = fornbergWeights(0, stencil.grid, stencil.order);
  return Math.max(...w.map((wi) => Math.abs(wi * stencil.denom - Math.round(wi * stencil.denom))));
}

// -- Reference (N,dp) grid: mid/deep N ladder x plateau dp ladder (imp-33620 / imp-34611 windows). --
const N_GRID = [1e12, Math.pow(10, 12.5), Math.pow(10, 13.0), DEEP_TAIL_N, Math.pow(10, 14.0), 1e15];
const DP_GRID = [1e-2, 1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1];

// Measure the 9-point/7-point floor ratio across the whole reference grid -- F1: it is ~constant.
const FLOOR_RATIOS = [];
let maxFloor7 = 0;
let maxFloor9 = 0;
for (const N of N_GRID) {
  for (const dp of DP_GRID) {
    const c7 = conditioning(Q3_7PT, N, dp);
    const c9 = conditioning(Q3_9PT, N, dp);
    FLOOR_RATIOS.push(c9.roundoffFloor / c7.roundoffFloor);
    maxFloor7 = Math.max(maxFloor7, c7.roundoffFloor);
    maxFloor9 = Math.max(maxFloor9, c9.roundoffFloor);
  }
}
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const FLOOR_RATIO_MEAN = mean(FLOOR_RATIOS);
const FLOOR_RATIO_MIN = Math.min(...FLOOR_RATIOS);
const FLOOR_RATIO_MAX = Math.max(...FLOOR_RATIOS);
// F2: closed form for the stencil-width dependence of the floor -- ratio = (maxNum/denom)_9pt / _7pt.
const maxNum = (s) => Math.max(...s.num.map(Math.abs));
const FLOOR_RATIO_CLOSED_FORM = maxNum(Q3_9PT) / Q3_9PT.denom / (maxNum(Q3_7PT) / Q3_7PT.denom); // ~1.25128

// -- Reference conditioning at the imp-33620 deep-tail landmark (N*, dp = 3e-2, within the plateau). --
const REF_N = DEEP_TAIL_N;
const REF_DP = 3e-2;
const REF7 = conditioning(Q3_7PT, REF_N, REF_DP);
const REF9 = conditioning(Q3_9PT, REF_N, REF_DP);

// F3: the exactly-representable-weights effect -- raw Fornberg residual and raw-vs-exact q3 rel diff.
function rawVsExactQ3RelDiff(stencil, N, dp) {
  const raw = fornbergWeights(0, stencil.grid, stencil.order);
  const exact = raw.map((w) => Math.round(w * stencil.denom));
  const qRaw = q3FromWeights(stencil, N, dp, raw, 1); // denom absorbed into the raw floats
  const qExact = q3FromWeights(stencil, N, dp, exact, stencil.denom);
  return Math.abs(qRaw - qExact) / Math.abs(qExact);
}
const RESIDUAL_7PT = rawWeightResidual(Q3_7PT); // 0 (exactly representable)
const RESIDUAL_9PT = rawWeightResidual(Q3_9PT); // ~5.3e-13
const RAWDIFF_7PT = rawVsExactQ3RelDiff(Q3_7PT, REF_N, REF_DP); // 0
const RAWDIFF_9PT = rawVsExactQ3RelDiff(Q3_9PT, REF_N, REF_DP); // ~4.5e-5

const IMP34684_SIXTH_ORDER_SIGNATURE = 3e-4; // imp-34684 F3 6th-order raw-float plateau shift (~30x)
const IMP34684_FOURTH_ORDER_SENSITIVITY = 9e-6; // imp-34684 F4 4th-order ordering sensitivity
const OBSERVED_SEVERITY_GAP = IMP34684_SIXTH_ORDER_SIGNATURE / IMP34684_FOURTH_ORDER_SENSITIVITY; // ~33x
// F4: does the floor predict the ~30x? It predicts only the ~1.25x width ratio -- no.
const FLOOR_PREDICTS_SEVERITY_GAP = FLOOR_RATIO_MEAN > OBSERVED_SEVERITY_GAP / 3; // false

export const IMP34690_Q3_SHARE_CANCELLATION_STENCIL_WIDTH_SCALING = Object.freeze({
  id: 'imp-34690',
  proofSection: 'S-frontier',
  claim_measured:
    'Quantify how the q3-share catastrophic-cancellation conditioning scales with finite-difference ' +
    'stencil width, resolving the imp-34684 F4 observation that the 4th-order q3-share float-order ' +
    'sensitivity (~9e-6) is ~30x milder than the 6th-order (~3e-4). At a reference (N,dp) grid compute ' +
    'the near-cancellation ratio max|term|/|sum| and the input-roundoff floor max|term|*eps/|sum| for ' +
    'the accuracy-4 7-point and accuracy-6 9-point q3 stencils, test whether the floor predicts the ' +
    '~30x gap, and distinguish the exactly-representable-weights effect (imp-34684 F3) from the ' +
    'intrinsic cancellation-depth effect (imp-34684 F4). Measurement on an inherited component model, ' +
    'not a bound.',
  q3_7pt_weights: Object.freeze(Q3_7PT.num.slice()),
  q3_7pt_denominator: Q3_7PT.denom,
  q3_9pt_weights: Object.freeze(Q3_9PT.num.slice()),
  q3_9pt_denominator: Q3_9PT.denom,
  reference_N: REF_N,
  reference_dp: REF_DP,
  // F1: near-cancellation ratio + floor at the reference point.
  ref_7pt_cancel_ratio: +REF7.cancelRatio.toExponential(3), // ~3.0e10
  ref_9pt_cancel_ratio: +REF9.cancelRatio.toExponential(3), // ~3.8e10
  ref_7pt_roundoff_floor: +REF7.roundoffFloor.toExponential(3), // ~6.7e-6
  ref_9pt_roundoff_floor: +REF9.roundoffFloor.toExponential(3), // ~8.4e-6
  // F1/F2: the floor ratio is ~constant across the grid, matching a closed form.
  floor_ratio_9pt_over_7pt_mean: +FLOOR_RATIO_MEAN.toFixed(6), // ~1.251282
  floor_ratio_9pt_over_7pt_min: +FLOOR_RATIO_MIN.toFixed(6),
  floor_ratio_9pt_over_7pt_max: +FLOOR_RATIO_MAX.toFixed(6),
  floor_ratio_closed_form_maxnum_over_denom: +FLOOR_RATIO_CLOSED_FORM.toFixed(6), // 1.251282
  floor_ratio_matches_closed_form: Math.abs(FLOOR_RATIO_MEAN - FLOOR_RATIO_CLOSED_FORM) < 1e-4,
  // F3: exactly-representable-weights effect -- the real source of the ~30x.
  raw_fornberg_residual_7pt: +RESIDUAL_7PT.toExponential(3), // 0
  raw_fornberg_residual_9pt: +RESIDUAL_9PT.toExponential(3), // ~5.3e-13
  raw_vs_exact_q3_reldiff_7pt: +RAWDIFF_7PT.toExponential(3), // 0
  raw_vs_exact_q3_reldiff_9pt: +RAWDIFF_9PT.toExponential(3), // ~4.5e-5
  // F4: verdict -- floor predicts ~1.25x, not the observed ~33x.
  imp34684_observed_severity_gap: +OBSERVED_SEVERITY_GAP.toFixed(2), // ~33.3x
  floor_predicts_severity_gap: FLOOR_PREDICTS_SEVERITY_GAP, // false
  severity_gap_source: 'exactly-representable-weights (imp-34684 F3), not the max|term|*eps/|sum| floor',
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Quantify how the q3-share catastrophic-cancellation conditioning ' +
    'scales with finite-difference STENCIL WIDTH, resolving imp-34684 F4 (4th-order share sensitivity ' +
    '~9e-6 vs 6th-order ~3e-4, ~30x). Comparing the imp-34611 accuracy-4 7-point q3 stencil ' +
    '[1,-8,13,0,-13,8,-1]/8 with the imp-34626/imp-34654 accuracy-6 9-point stencil ' +
    '[-7,72,-338,488,0,-488,338,-72,7]/240 at a reference (N,dp) grid: (F1) THE INPUT-ROUNDOFF FLOOR ' +
    'max|term|*eps/|sum| IS NEARLY STENCIL-WIDTH-INDEPENDENT -- across dp in 1e-2..1e-1 and N in ' +
    '1e12..1e15 the 9-point/7-point floor ratio is a CONSTANT ~1.251, not ~30x; both floors track the ' +
    'same near-cancellation depth. (F2) THAT CONSTANT HAS A CLOSED FORM -- since q(p+j*dp) ~ const, ' +
    'max|term| ~ maxNum*|q| and |sum| ~ denom*dp^3*|q3| with q3 nearly stencil-independent, so the ' +
    'width dependence enters ONLY through maxNum/denom: (488/240)/(13/8) = 1.25128 reproduces the ' +
    'measured 1.251. (F3) THE ~30x GAP IS THE EXACTLY-REPRESENTABLE-WEIGHTS EFFECT (imp-34684 F3), NOT ' +
    'THE FLOOR -- the 7-point Fornberg weights are exactly representable (raw residual 0), so their ' +
    'raw-vs-exact q3 relative difference is 0 and the share sensitivity is set by the floor alone (~few ' +
    'e-6, matching imp-34684 ~9e-6); the 9-point weights carry a ~5.3e-13 residual that the ~1e12 ' +
    'near-cancellation amplifies to a raw-vs-exact q3 relative difference ~4.5e-5 at (N*,dp=3e-2), ' +
    'growing toward the imp-34654 window-mean ~3e-4. (F4) VERDICT -- the intrinsic cancellation-depth ' +
    '(imp-34684 F4) grows only ~1.25x with stencil width and does NOT explain the ~30x; the ' +
    'input-roundoff floor max|term|*eps/|sum| therefore does NOT predict the severity gap, the ' +
    'exactly-representable-weights amplification of the larger stencil does. q1,q2,q3 are inherited ' +
    'central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime ' +
    '(imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this characterizes the ' +
    'STENCIL conditioning, it does not rehabilitate the surrogate. The -2 asymptote and C_C = ' +
    '(1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per ' +
    'imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34684 (F3/F4: the ~30x severity gap resolved here); imp-34654 (9-point reference-weight ' +
    'cross-validation, raw-float ~3e-4 signature); imp-34611 (inline 7-point stencil); imp-34626 ' +
    '(9-point stencil / conditioning); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb GUE-conditional); Fornberg B. (1988), "Generation of finite ' +
    'difference formulas on arbitrarily spaced grids", Math. Comp. 51, 699-706.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34690_ASSERTIONS = [
  {
    id: 'imp34690-floor-ratio-nearly-stencil-independent',
    holds: () => FLOOR_RATIO_MIN > 1.24 && FLOOR_RATIO_MAX < 1.26,
    why: 'F1: the 9-point/7-point input-roundoff floor ratio max|term|*eps/|sum| is a near-constant ~1.251 across the whole (N,dp) reference grid -- widening the q3 stencil from 7 to 9 points barely changes the lost-digits floor.',
  },
  {
    id: 'imp34690-floor-ratio-matches-closed-form',
    holds: () =>
      Math.abs(FLOOR_RATIO_MEAN - FLOOR_RATIO_CLOSED_FORM) < 1e-4 &&
      Math.abs(FLOOR_RATIO_CLOSED_FORM - 488 / 240 / (13 / 8)) < 1e-12,
    why: 'F2: the measured floor ratio matches the closed form (maxNum/denom)_9pt / (maxNum/denom)_7pt = (488/240)/(13/8) = 1.25128 to ~4e-6 -- the floor stencil-width dependence enters only through maxNum/denom, since max|term| ~ maxNum*|q| and |sum| ~ denom*dp^3*|q3| (the small ~4e-6 gap is the residual q3 stencil-dependence).',
  },
  {
    id: 'imp34690-7pt-weights-exact-9pt-weights-not',
    holds: () => RESIDUAL_7PT === 0 && RESIDUAL_9PT > 1e-14 && RESIDUAL_9PT < 1e-11,
    why: 'F3: the 7-point Fornberg weights are exactly representable (raw residual 0) while the larger 9-point weights carry a ~5.3e-13 residual -- the exactly-representable-weights effect (imp-34684 F3) is present only for the wider stencil.',
  },
  {
    id: 'imp34690-weight-residual-amplification-dominates-gap',
    holds: () =>
      RAWDIFF_7PT === 0 &&
      RAWDIFF_9PT > 1e-6 &&
      RAWDIFF_9PT / Math.max(REF7.roundoffFloor, 1e-300) > FLOOR_RATIO_MEAN,
    why: 'F3/F4: the 9-point raw-vs-exact q3 relative difference (~4.5e-5) is far larger than the ~1.25x floor ratio would allow, while the 7-point difference is exactly 0 -- so the ~30x severity gap is dominated by the exactly-representable-weights amplification of the larger stencil, not by the input-roundoff floor.',
  },
  {
    id: 'imp34690-floor-does-not-predict-severity-gap',
    holds: () =>
      FLOOR_PREDICTS_SEVERITY_GAP === false &&
      OBSERVED_SEVERITY_GAP > 10 * FLOOR_RATIO_MEAN &&
      IMP34690_Q3_SHARE_CANCELLATION_STENCIL_WIDTH_SCALING.floor_predicts_severity_gap === false,
    why: 'F4: the observed ~33x severity gap (imp-34684 3e-4 / 9e-6) is more than 10x the ~1.251 floor ratio, so the input-roundoff floor max|term|*eps/|sum| does NOT predict the ~30x -- the gap is the exactly-representable-weights effect.',
  },
  {
    id: 'imp34690-honesty-gate-no-qed',
    holds: () =>
      IMP34690_Q3_SHARE_CANCELLATION_STENCIL_WIDTH_SCALING.isRigorous === false &&
      /NO QED/.test(IMP34690_Q3_SHARE_CANCELLATION_STENCIL_WIDTH_SCALING.verdict) &&
      /refereed bound is changed/i.test(IMP34690_Q3_SHARE_CANCELLATION_STENCIL_WIDTH_SCALING.verdict) &&
      /UNTOUCHED/.test(IMP34690_Q3_SHARE_CANCELLATION_STENCIL_WIDTH_SCALING.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34690_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34690-q3-share-cancellation-stencil-width-scaling assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34690_Q3_SHARE_CANCELLATION_STENCIL_WIDTH_SCALING;
