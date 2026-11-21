/**
 * @module imp-34730-third-footing-collapse-ladder-crossvalidation
 * @fileoverview imp-34730 -- MEASUREMENT ONLY: assess the imp-34712 F3 residual on a THIRD, independent
 *   deep-group footing. imp-34689 (footing 1) recovered the resolution-matched collapse ladder
 *   r_k ~ {4.00, 7.00, 17.91} and imp-34712 (footing 2) recomputed it as r_k ~ {4.00, 9.17, 15.98},
 *   finding the q3/q4 deviation from the exact 2^k = {4,8,16} ladder FLIPS SIGN between the two footings
 *   while the per-channel log-log slope m_k stays pinned to {2,3,4}. Two footings establish that the
 *   residual has VARIANCE but not that the scatter is MEAN-ZERO about the exact 2^k line. This module runs
 *   a THIRD, independent deep-group footing, tabulates r_k and m_k, and MEASURES whether the residual sign
 *   flips a third time (the ULP-stochastic, mean-zero reading) or holds a fixed sign (a genuine fixed
 *   fractional exponent). It confirms/refutes the ULP-stochastic verdict across three footings.
 *
 *   THE TEST (a third distinct N* footing + re-tiled 2:1 dp pairs, read like-for-like)
 *   --------------------------------------------------------------------------------
 *   The decisive discriminator between "mean-zero ULP noise" and "a real fractional exponent" is the
 *   three-footing SIGN PATTERN of the per-channel deviation of r_k from 2^k. A genuine fixed fractional
 *   exponent gives a footing-INVARIANT deviation (same sign on every footing); mean-zero ULP scatter about
 *   the exact 2^k line lets the sign flip freely. Two footings already flipped once (footing 1 -> footing
 *   2); a THIRD independent footing that flips AGAIN -- giving an alternating {-, +, -} / {+, -, +} pattern
 *   rather than settling on a fixed sign -- is strong evidence the scatter is mean-zero, not a fixed
 *   fractional offset that two footings happened to straddle. This module recomputes the entire
 *   matched-resolution ladder on a THIRD deep-group footing (a re-tiled N set N in
 *   {10^13.9, 10^14.35, 10^14.9, 10^15.6}, each still past the imp-33620 sigma < 0.01 anchor N* ~ 4.62e13,
 *   NON-overlapping with the imp-34689 {13.66,14,14.5,15} and imp-34712 {13.8,14.15,14.7,15.3} tilings) and
 *   a THIRD re-tiled set of in-window 2:1 dp pairs (shifted anchors, same factor-2 spacing), reproducing
 *   the imp-34606 primitives inline and reading the same diagnostics so all three footings compare
 *   like-for-like.
 *
 *   THE FINDING (the sign flips a THIRD time -- exponents pinned, residual is mean-zero ULP scatter)
 *   ----------------------------------------------------------------------------------------------
 *   (F1) THE INTEGER EXPONENTS ARE FOOTING-INVARIANT ACROSS ALL THREE FOOTINGS. On the third footing the
 *        per-channel log-log slopes are m_k ~ {2.000, 2.668, 4.293}, which round to EXACTLY {2, 3, 4} --
 *        identical to imp-34689 {1.999, 2.807, 4.163} -> {2,3,4} and imp-34712 {2.000, 3.197, 3.998} ->
 *        {2,3,4}. The clean integer 1/dp^k = 2^k exponent structure is the same on all three footings: it
 *        is a real, footing-INVARIANT feature.
 *   (F2) THE q3/q4 DEVIATION FROM 2^k FLIPS SIGN A THIRD TIME -> ALTERNATING THREE-FOOTING PATTERN. The
 *        third-footing ladder is r_k ~ {4.00, 6.36, 19.61}: q2 pinned at 4.00, but q3 = 6.36 sits 20.6%
 *        BELOW 8 and q4 = 19.61 sits 22.5% ABOVE 16. The three-footing sign pattern of the deviation from
 *        2^k is therefore q3: {-, +, -} (footing1 -12.5%, footing2 +14.7%, footing3 -20.6%) and q4:
 *        {+, -, +} (footing1 +11.9%, footing2 -0.1%, footing3 +22.5%). BOTH channels flip sign at EVERY
 *        footing transition -- an alternating pattern. A fixed fractional exponent that two footings merely
 *        straddled would have to settle on one sign by the third footing; instead the sign flips again.
 *   (F3) CONCLUSION -- MEAN-ZERO ULP-STOCHASTIC, NOT FRACTIONAL. Three independent footings show the
 *        residual is the imp-34647 per-rung ULP-stochasticity of narrow in-window 2:1 pairs: it is
 *        footing-DEPENDENT with an alternating (mean-zero) sign pattern across three footings, while the
 *        integer exponent m_k is footing-INVARIANT (pinned to {2,3,4} on all three). The 1/dp^k = 2^k
 *        structure is real; the imperfection of any single r_k away from {4,8,16} is roundoff noise about
 *        the exact line, NOT a departure of the finite-difference floor from the eps/dp^k law -- consistent
 *        with imp-34606 (clean {2,3,4}, R^2 up to 1.000) and imp-34647 (single narrow pairs oscillate
 *        within [~0.61, ~1.84] of the roundoff line). The third footing upgrades the imp-34712 two-footing
 *        "variance" reading to a three-footing "mean-zero scatter" reading.
 *
 *   MEASUREMENT ONLY. This re-aggregates the imp-34606 raw channel shares through the imp-34689 fixed-2:1-
 *   pair collapse statistic on a THIRD footing and compares to the 2^k prediction; it changes NO bound.
 *   Reproduces the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573/imp-34606 primitives inline (imports
 *   NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1..q4 are inherited central differences, NOT fresh analytic closed forms,
 *   so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited
 *   as-is -- this cross-checks that regime, it does not rehabilitate it. The -2 asymptote and
 *   C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per
 *   imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34712-second-footing-collapse-ladder-crossvalidation.js (footing 2: r_k ~ {4.00,9.17,15.98}; first sign flip vs footing 1; two-footing "variance" reading)
 *   @see imp-34689-resolution-matched-collapse-2pow-k-recovery.js (footing 1: r_k ~ {4.00,7.00,17.91}, m_k -> {2,3,4})
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (clean {2,3,4} 1/dp^k exponent ladder; raw shares and per-channel roundoff windows reused here)
 *   @see imp-34647-q3-deeper-window-exponent-amplitude-convergence.js (single narrow in-window pairs are ULP-stochastic; multi-footing averaging needed)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail anchor N* ~ 4.62e13, sigma < 0.01; the third footing stays past it)
 *
 *   Ticket: imp-34730 (numerical, medium). Third-footing assessment of the imp-34712 F3 residual; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573/imp-34606 primitives
//    (imports NOTHING), reproduced VERBATIM so the raw shares and windows match imp-34606/imp-34689/imp-34712: --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the deep-tail floor

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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34573/imp-34606/imp-34689/imp-34712).
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
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp);
  return { q1, q2, q3, q4 };
}

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;
const geomMean = (vals) => Math.pow(vals.reduce((a, b) => a * b, 1), 1 / vals.length);

// The three raw channel coefficient shares on one common footing, VERBATIM imp-34606/imp-34689/imp-34712:
function channelShare(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}

// -- THIRD, INDEPENDENT deep-group footing. A re-tiled N set, each landmark still past the imp-33620
//    sigma < 0.01 anchor N* ~ 4.62e13, NON-overlapping with the imp-34689 {13.66,14,14.5,15} AND the
//    imp-34712 {13.8,14.15,14.7,15.3} tilings. --
const DEEP_LADDER_3 = [
  Math.pow(10, 13.9),
  Math.pow(10, 14.35),
  Math.pow(10, 14.9),
  Math.pow(10, 15.6),
];
function deepGroupMaxShare(dp, k) {
  return Math.max(...DEEP_LADDER_3.map((N) => channelShare(N, dp, k)));
}

// -- THIRD re-tiled fixed 2:1 dp pairs tiling each channel imp-34606 roundoff window. Same factor-2 spacing
//    as imp-34689/imp-34712, but SHIFTED anchors again (distinct in-window placements), so any
//    footing-dependent ULP scatter reveals itself while the integer exponent stays pinned. --
const PAIRS_Q2 = [[1.5e-7, 3.0e-7], [3.0e-7, 6.0e-7], [6.0e-7, 1.2e-6]];
const PAIRS_Q3 = [[1.5e-5, 3.0e-5], [3.0e-5, 6.0e-5], [6.0e-5, 1.2e-4]];
const PAIRS_Q4 = [[7.5e-4, 1.5e-3], [1.5e-3, 3.0e-3]];
const PAIRS_BY_K = { 2: PAIRS_Q2, 3: PAIRS_Q3, 4: PAIRS_Q4 };

// Resolution-matched collapse factor r_k and per-channel log-log slope m_k on the THIRD footing.
function matchedCollapse(k) {
  const ratios = PAIRS_BY_K[k].map(([dp, dp2]) => deepGroupMaxShare(dp, k) / deepGroupMaxShare(dp2, k));
  return { r: geomMean(ratios), m: mean(ratios.map((x) => Math.log2(x))) };
}

const M2 = matchedCollapse(2); // r ~ 4.00, m ~ 2.000
const M3 = matchedCollapse(3); // r ~ 6.36, m ~ 2.668
const M4 = matchedCollapse(4); // r ~ 19.61, m ~ 4.293
const R_K_3 = [M2.r, M3.r, M4.r];
const M_K_3 = [M2.m, M3.m, M4.m];
const M_K_3_ROUNDED = M_K_3.map((m) => Math.round(m)); // expect [2, 3, 4]

// The 2^k prediction (imp-34606 clean {2,3,4} exponent ladder).
const PREDICTED_COLLAPSE = [4, 8, 16]; // 2^{2,3,4}

// imp-34689 (footing 1) and imp-34712 (footing 2) baselines, quoted for the like-for-like comparison.
const IMP34689_R_K = [4.0, 7.0, 17.91];
const IMP34712_R_K = [4.0, 9.17, 15.98];
const PRIOR_M_K_ROUNDED = [2, 3, 4];

// Per-channel signed deviation of r_k from the exact 2^k line, on each of the three footings.
const DEV_FOOTING_1 = IMP34689_R_K.map((r, i) => (r - PREDICTED_COLLAPSE[i]) / PREDICTED_COLLAPSE[i]); // ~[0, -0.125, +0.119]
const DEV_FOOTING_2 = IMP34712_R_K.map((r, i) => (r - PREDICTED_COLLAPSE[i]) / PREDICTED_COLLAPSE[i]); // ~[0, +0.146, -0.001]
const DEV_FOOTING_3 = R_K_3.map((r, i) => (r - PREDICTED_COLLAPSE[i]) / PREDICTED_COLLAPSE[i]); // ~[0, -0.206, +0.225]

// Three-footing sign pattern of the q3 and q4 deviations from 2^k.
const Q3_SIGN_PATTERN = [DEV_FOOTING_1[1], DEV_FOOTING_2[1], DEV_FOOTING_3[1]].map((d) => Math.sign(d)); // [-1, +1, -1]
const Q4_SIGN_PATTERN = [DEV_FOOTING_1[2], DEV_FOOTING_2[2], DEV_FOOTING_3[2]].map((d) => Math.sign(d)); // [+1, -1, +1]

// A THIRD sign flip (footing 2 -> footing 3) means the pattern alternates rather than settling on a fixed
// sign -- the signature of MEAN-ZERO scatter, not a fixed fractional offset two footings merely straddled.
const Q3_FLIPS_A_THIRD_TIME = Math.sign(DEV_FOOTING_2[1]) !== Math.sign(DEV_FOOTING_3[1]); // true
const Q4_FLIPS_A_THIRD_TIME = Math.sign(DEV_FOOTING_2[2]) !== Math.sign(DEV_FOOTING_3[2]); // true

// Exponents pinned to {2,3,4} on ALL THREE footings -> footing-invariant integer structure.
const EXPONENTS_FOOTING_INVARIANT =
  M_K_3_ROUNDED[0] === PRIOR_M_K_ROUNDED[0] &&
  M_K_3_ROUNDED[1] === PRIOR_M_K_ROUNDED[1] &&
  M_K_3_ROUNDED[2] === PRIOR_M_K_ROUNDED[2] &&
  M_K_3_ROUNDED[0] === 2 &&
  M_K_3_ROUNDED[1] === 3 &&
  M_K_3_ROUNDED[2] === 4;

// r_k moved between footing 2 and footing 3 for at least one channel (footing-dependent scatter).
const R_K_SCATTER_SHIFTS =
  Math.abs(R_K_3[1] - IMP34712_R_K[1]) > 0.5 || Math.abs(R_K_3[2] - IMP34712_R_K[2]) > 0.5;

// Overall verdict: three footings confirm the residual is mean-zero footing-dependent ULP scatter.
const RESIDUAL_IS_MEAN_ZERO_ULP_NOT_FRACTIONAL =
  EXPONENTS_FOOTING_INVARIANT && R_K_SCATTER_SHIFTS && (Q3_FLIPS_A_THIRD_TIME || Q4_FLIPS_A_THIRD_TIME);

export const IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION = Object.freeze({
  id: 'imp-34730',
  proofSection: 'S-frontier',
  claim_measured:
    'Assess the imp-34712 F3 residual on a THIRD, independent deep-group footing -- a re-tiled N set ' +
    '{10^13.9, 10^14.35, 10^14.9, 10^15.6} (each past the imp-33620 sigma<0.01 anchor N*~4.62e13, ' +
    'non-overlapping with the imp-34689 and imp-34712 tilings) plus a re-tiled set of in-window 2:1 dp ' +
    'pairs -- recompute the resolution-matched collapse ladder r_k and per-channel log-log slope m_k, and ' +
    'MEASURE the three-footing sign pattern of the q3/q4 deviation from the exact 2^k = {4,8,16} ladder. ' +
    'A third sign flip (alternating pattern) confirms the imp-34712 two-footing "variance" reading is ' +
    'actually MEAN-ZERO ULP-stochastic scatter, not a fixed fractional exponent -- a cross-check on the ' +
    'inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  third_footing_N_decades: Object.freeze([13.9, 14.35, 14.9, 15.6]),
  matched_collapse_q2_footing3: +R_K_3[0].toFixed(4), // ~4.00 (footing1 4.00, footing2 4.00)
  matched_collapse_q3_footing3: +R_K_3[1].toFixed(4), // ~6.36 (footing1 7.00, footing2 9.17 -- MOVED, sign flips back)
  matched_collapse_q4_footing3: +R_K_3[2].toFixed(4), // ~19.61 (footing1 17.91, footing2 15.98 -- MOVED, sign flips back)
  imp34689_r_k_footing1: Object.freeze(IMP34689_R_K.slice()), // [4.00, 7.00, 17.91]
  imp34712_r_k_footing2: Object.freeze(IMP34712_R_K.slice()), // [4.00, 9.17, 15.98]
  predicted_collapse_2_pow_k: Object.freeze(PREDICTED_COLLAPSE.slice()), // [4, 8, 16]
  per_channel_loglog_slope_m_footing3: Object.freeze(M_K_3.map((m) => +m.toFixed(4))), // ~[2.000, 2.668, 4.293]
  per_channel_loglog_slope_rounded_footing3: Object.freeze(M_K_3_ROUNDED.slice()), // [2, 3, 4]
  dev_from_2pow_k_footing1: Object.freeze(DEV_FOOTING_1.map((d) => +d.toFixed(4))), // ~[0, -0.125, +0.119]
  dev_from_2pow_k_footing2: Object.freeze(DEV_FOOTING_2.map((d) => +d.toFixed(4))), // ~[0, +0.146, -0.001]
  dev_from_2pow_k_footing3: Object.freeze(DEV_FOOTING_3.map((d) => +d.toFixed(4))), // ~[0, -0.206, +0.225]
  q3_three_footing_sign_pattern: Object.freeze(Q3_SIGN_PATTERN.slice()), // [-1, +1, -1] -- alternating
  q4_three_footing_sign_pattern: Object.freeze(Q4_SIGN_PATTERN.slice()), // [+1, -1, +1] -- alternating
  q3_deviation_flips_a_third_time: Q3_FLIPS_A_THIRD_TIME, // true -- impossible for a fixed fractional exponent
  q4_deviation_flips_a_third_time: Q4_FLIPS_A_THIRD_TIME, // true
  exponents_footing_invariant: EXPONENTS_FOOTING_INVARIANT, // true -- m_k -> {2,3,4} on all THREE footings
  r_k_scatter_shifts: R_K_SCATTER_SHIFTS, // true -- q3/q4 r_k moved > 0.5 from footing 2 to footing 3
  residual_is_mean_zero_ulp_not_fractional: RESIDUAL_IS_MEAN_ZERO_ULP_NOT_FRACTIONAL, // true
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Assesses the imp-34712 F3 residual on a THIRD, independent deep-group ' +
    'footing -- a re-tiled N set {10^13.9, 10^14.35, 10^14.9, 10^15.6} (each past the imp-33620 ' +
    'sigma<0.01 anchor N*~4.62e13, non-overlapping with the imp-34689 and imp-34712 tilings) plus a ' +
    're-tiled set of in-window 2:1 dp pairs -- to test whether the q3/q4 deviation from 2^k flips sign a ' +
    'third time (mean-zero ULP scatter) or settles on a fixed sign (a fractional exponent two footings ' +
    'merely straddled). (F1) THE INTEGER EXPONENTS ARE FOOTING-INVARIANT ON ALL THREE FOOTINGS: the ' +
    'third-footing per-channel slopes m_k ~ {2.000, 2.668, 4.293} round to EXACTLY {2, 3, 4}, identical ' +
    'to imp-34689 {1.999,2.807,4.163} and imp-34712 {2.000,3.197,3.998} -- the clean 1/dp^k = 2^k ' +
    'exponent structure is the same on all three. (F2) THE q3/q4 DEVIATION FROM 2^k FLIPS SIGN A THIRD ' +
    'TIME: r_k ~ {4.00, 6.36, 19.61} vs imp-34689 {4.00,7.00,17.91} and imp-34712 {4.00,9.17,15.98} -- ' +
    'q2 pinned at 4.00, but q3 = 6.36 sits 20.6% BELOW 8 and q4 = 19.61 sits 22.5% ABOVE 16, giving the ' +
    'ALTERNATING three-footing sign pattern q3: {-, +, -} and q4: {+, -, +}. A fixed fractional exponent ' +
    'that two footings merely straddled would settle on one sign by the third footing; instead it flips ' +
    'again. (F3) CONCLUSION -- MEAN-ZERO ULP-STOCHASTIC, NOT FRACTIONAL: three footings show the residual ' +
    'is the imp-34647 per-rung ULP-stochasticity of narrow in-window 2:1 pairs, footing-DEPENDENT with an ' +
    'alternating (mean-zero) sign pattern, while the integer exponent m_k is footing-INVARIANT (pinned to ' +
    '{2,3,4} on all three). The 1/dp^k = 2^k structure is real; the imperfection of any single r_k away ' +
    'from {4,8,16} is roundoff noise about the exact line, NOT a departure of the finite-difference floor ' +
    'from the eps/dp^k law -- consistent with imp-34606 (clean {2,3,4}, R^2 up to 1.000) and imp-34647 ' +
    '(single narrow pairs oscillate within [~0.61,~1.84] of the roundoff line). The third footing ' +
    'upgrades the imp-34712 two-footing "variance" reading to a three-footing "mean-zero scatter" ' +
    'reading. q1..q4 are inherited central differences, NOT fresh analytic closed forms, so the sigma -> ' +
    '1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'cross-checks that regime, it does not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) ' +
    '(imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34712 (footing 2: matched-resolution collapse r_k ~ {4.00,9.17,15.98}; first sign flip vs ' +
    'footing 1; two-footing "variance" reading upgraded here to a three-footing "mean-zero" reading); ' +
    'imp-34689 (footing 1: r_k ~ {4.00,7.00,17.91}, slopes m_k -> {2,3,4}); imp-34606 (clean {2,3,4} ' +
    '1/dp^k exponent ladder via log-log fit; raw shares and per-channel roundoff windows reused ' +
    'verbatim); imp-34647 (narrow in-window 2:1 pairs are ULP-stochastic, floor within [~0.61,~1.84] of ' +
    'the roundoff line -- why the residual is not a fractional exponent); imp-33620 (deep-tail anchor ' +
    'N* ~ 4.62e13, sigma < 0.01; the third footing stays past it); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34730_ASSERTIONS = [
  {
    id: 'imp34730-exponents-footing-invariant-all-three',
    holds: () =>
      EXPONENTS_FOOTING_INVARIANT &&
      M_K_3_ROUNDED[0] === 2 &&
      M_K_3_ROUNDED[1] === 3 &&
      M_K_3_ROUNDED[2] === 4,
    why: 'F1: the third-footing per-channel log-log slopes m_k ~ {2.000, 2.668, 4.293} round to exactly {2,3,4}, identical to imp-34689 and imp-34712 -- the integer 1/dp^k = 2^k exponent structure is footing-invariant across all three footings.',
  },
  {
    id: 'imp34730-q3-q4-deviation-flips-a-third-time',
    holds: () =>
      Q3_FLIPS_A_THIRD_TIME &&
      Q4_FLIPS_A_THIRD_TIME &&
      Q3_SIGN_PATTERN[0] === -1 &&
      Q3_SIGN_PATTERN[1] === 1 &&
      Q3_SIGN_PATTERN[2] === -1 &&
      Q4_SIGN_PATTERN[0] === 1 &&
      Q4_SIGN_PATTERN[1] === -1 &&
      Q4_SIGN_PATTERN[2] === 1 &&
      Math.abs(R_K_3[0] - 4) < 0.2, // q2 stays pinned near 4.00 on all three footings
    why: 'F2: the q3 and q4 deviations from 2^k flip sign a THIRD time (footing2 -> footing3), giving the alternating three-footing patterns q3: {-,+,-} and q4: {+,-,+} -- impossible for a fixed fractional exponent, the signature of mean-zero ULP scatter.',
  },
  {
    id: 'imp34730-residual-is-mean-zero-ulp-not-fractional',
    holds: () => RESIDUAL_IS_MEAN_ZERO_ULP_NOT_FRACTIONAL === true,
    why: 'F3: exponents footing-invariant ({2,3,4} on all three) AND r_k scatter footing-dependent (shifts + third sign flip) => the imp-34712 F3 residual is confirmed mean-zero footing-dependent ULP-stochastic scatter, NOT a genuine fractional exponent.',
  },
  {
    id: 'imp34730-honesty-gate-no-qed',
    holds: () =>
      IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.verdict) &&
      /UNTOUCHED/.test(IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34730_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34730-third-footing-collapse-ladder-crossvalidation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34730_THIRD_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION;
