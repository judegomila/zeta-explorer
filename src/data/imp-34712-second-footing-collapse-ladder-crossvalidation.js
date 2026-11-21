/**
 * @module imp-34712-second-footing-collapse-ladder-crossvalidation
 * @fileoverview imp-34712 -- MEASUREMENT ONLY: cross-validate the imp-34689 resolution-matched collapse
 *   ladder r_k ~ {4.00, 7.00, 17.91} (per-channel log-log slopes m_k ~ {1.999, 2.807, 4.163} rounding to
 *   {2, 3, 4}) on a SECOND, INDEPENDENT deep-group footing, to confirm the imp-34689 F3 residual (q3 ~7.0
 *   sitting BELOW 8, q4 ~17.9 sitting ABOVE 16) is footing-DEPENDENT ULP-stochastic scatter, not a
 *   footing-INVARIANT genuine fractional exponent.
 *
 *   THE TEST (a distinct N* footing + re-tiled 2:1 dp pairs, read like-for-like)
 *   ---------------------------------------------------------------------------
 *   imp-34689 computed the matched-resolution collapse factor r_k = geomMean over fixed 2:1 dp pairs of
 *   s_k(dp)/s_k(2 dp) on ONE deep-group max footing (the imp-34606 ladder N in
 *   {4.62e13, 1e14, 1e14.5, 1e15}) and one fixed set of in-window pairs, and flagged in F3 that the
 *   recovered ladder is not perfectly {4, 8, 16} -- attributing the residual to imp-34647 per-rung
 *   ULP-stochasticity WITHOUT an independent footing to confirm it. The decisive discriminator between
 *   "ULP noise" and "a real fractional exponent" is FOOTING-INVARIANCE: a genuine departure of the
 *   finite-difference floor from the eps/dp^k law would reproduce the SAME r_k (same sign and magnitude of
 *   the deviation from 2^k) on any deep footing, whereas ULP scatter moves the r_k around -- and, in
 *   particular, can flip the SIGN of the per-channel deviation from 2^k -- while the underlying integer
 *   exponent m_k stays pinned. This module recomputes the entire matched-resolution ladder on a DISTINCT
 *   deep-group footing (a re-tiled N set N in {10^13.8, 10^14.15, 10^14.7, 10^15.3}, each still past the
 *   imp-33620 sigma < 0.01 anchor N* ~ 4.62e13, non-overlapping with the imp-34689 tiling) and a re-tiled
 *   set of in-window 2:1 dp pairs (shifted anchors, same factor-2 spacing), reproducing the imp-34606
 *   primitives inline and reading the same diagnostics so the two footings compare like-for-like.
 *
 *   THE FINDING (the residual IS footing-dependent ULP scatter -- exponents pinned, r_k moved, signs flipped)
 *   ------------------------------------------------------------------------------------------------------
 *   (F1) THE INTEGER EXPONENTS ARE FOOTING-INVARIANT. On the second footing the per-channel log-log slopes
 *        are m_k ~ {2.000, 3.197, 3.998}, which round to EXACTLY {2, 3, 4} -- identical to imp-34689
 *        {1.999, 2.807, 4.163} -> {2, 3, 4}. The clean integer 1/dp^k = 2^k exponent structure is the same
 *        on both footings: it is a real, footing-INVARIANT feature.
 *   (F2) THE r_k COLLAPSE FACTORS MOVE, AND THE q3/q4 DEVIATION FROM 2^k FLIPS SIGN. The second-footing
 *        ladder is r_k ~ {4.00, 9.17, 15.98} versus imp-34689 {4.00, 7.00, 17.91}: q2 is pinned at 4.00
 *        (both footings), but q3 moves from 7.00 (12.5% BELOW 8) to 9.17 (14.7% ABOVE 8) and q4 moves from
 *        17.91 (11.9% ABOVE 16) to 15.98 (0.1% BELOW 16). BOTH q3 and q4 deviations from 2^k FLIP SIGN
 *        between the two footings. A genuine fractional exponent would keep the SAME deviation sign on
 *        every footing; a sign flip is only possible if the residual is stochastic scatter about the exact
 *        2^k line.
 *   (F3) CONCLUSION -- ULP-STOCHASTIC, NOT FRACTIONAL. The imp-34689 F3 residual (q3 ~7.0 < 8, q4 ~17.9 >
 *        16) is confirmed to be the imp-34647 per-rung ULP-stochasticity of narrow in-window 2:1 pairs: it
 *        is footing-DEPENDENT (the r_k scatter shifts and its sign flips across two independent footings)
 *        while the integer exponent m_k is footing-INVARIANT (pinned to {2, 3, 4} on both). The 1/dp^k =
 *        2^k structure is real; the imperfection of any single r_k away from {4, 8, 16} is roundoff noise,
 *        NOT a departure of the finite-difference floor from the eps/dp^k law -- consistent with imp-34606
 *        (clean {2,3,4}, R^2 up to 1.000) and imp-34647 (single narrow pairs oscillate within
 *        [~0.61, ~1.84] of the roundoff line).
 *
 *   MEASUREMENT ONLY. This re-aggregates the imp-34606 raw channel shares through the imp-34689 fixed-2:1-
 *   pair collapse statistic on a SECOND footing and compares to the 2^k prediction; it changes NO bound.
 *   Reproduces the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573/imp-34606 primitives inline (imports
 *   NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1..q4 are inherited central differences, NOT fresh analytic closed forms,
 *   so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited
 *   as-is -- this cross-checks that regime, it does not rehabilitate it. The -2 asymptote and
 *   C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per
 *   imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34689-resolution-matched-collapse-2pow-k-recovery.js (first footing: r_k ~ {4.00,7.00,17.91}, m_k -> {2,3,4}; F3 residual claimed ULP-stochastic on one footing)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (clean {2,3,4} 1/dp^k exponent ladder; raw shares and per-channel roundoff windows reused here)
 *   @see imp-34647-q3-deeper-window-exponent-amplitude-convergence.js (single narrow in-window pairs are ULP-stochastic; wide-window / multi-footing averaging needed)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail anchor N* ~ 4.62e13, sigma < 0.01; the second footing stays past it)
 *
 *   Ticket: imp-34712 (accuracy, medium). Second-footing cross-validation of the imp-34689 collapse ladder; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573/imp-34606 primitives
//    (imports NOTHING), reproduced VERBATIM so the raw shares and windows match imp-34606/imp-34689: --
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34573/imp-34606/imp-34689).
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

// The three raw channel coefficient shares on one common footing, VERBATIM imp-34606/imp-34689:
function channelShare(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}

// -- SECOND, INDEPENDENT deep-group footing. A re-tiled N set, each landmark still past the imp-33620
//    sigma < 0.01 anchor N* ~ 4.62e13, NON-overlapping with the imp-34689 tiling {4.62e13,1e14,1e14.5,1e15}. --
const DEEP_LADDER_2 = [
  Math.pow(10, 13.8),
  Math.pow(10, 14.15),
  Math.pow(10, 14.7),
  Math.pow(10, 15.3),
];
function deepGroupMaxShare(dp, k) {
  return Math.max(...DEEP_LADDER_2.map((N) => channelShare(N, dp, k)));
}

// -- RE-TILED fixed 2:1 dp pairs tiling each channel imp-34606 roundoff window. Same factor-2 spacing as
//    imp-34689, but SHIFTED anchors (so the pairs sit at different in-window placements), the second knob
//    that lets footing-dependent ULP scatter reveal itself while the integer exponent stays pinned. --
const PAIRS_Q2 = [[1.2e-7, 2.4e-7], [2.4e-7, 4.8e-7], [4.8e-7, 9.6e-7]];
const PAIRS_Q3 = [[1.2e-5, 2.4e-5], [2.4e-5, 4.8e-5], [4.8e-5, 9.6e-5]];
const PAIRS_Q4 = [[6e-4, 1.2e-3], [1.2e-3, 2.4e-3]];
const PAIRS_BY_K = { 2: PAIRS_Q2, 3: PAIRS_Q3, 4: PAIRS_Q4 };

// Resolution-matched collapse factor r_k and per-channel log-log slope m_k on the SECOND footing.
function matchedCollapse(k) {
  const ratios = PAIRS_BY_K[k].map(([dp, dp2]) => deepGroupMaxShare(dp, k) / deepGroupMaxShare(dp2, k));
  return { r: geomMean(ratios), m: mean(ratios.map((x) => Math.log2(x))) };
}

const M2 = matchedCollapse(2); // r ~ 4.00, m ~ 2.000
const M3 = matchedCollapse(3); // r ~ 9.17, m ~ 3.197
const M4 = matchedCollapse(4); // r ~ 15.98, m ~ 3.998
const R_K_2 = [M2.r, M3.r, M4.r];
const M_K_2 = [M2.m, M3.m, M4.m];
const M_K_2_ROUNDED = M_K_2.map((m) => Math.round(m)); // expect [2, 3, 4]

// The 2^k prediction (imp-34606 clean {2,3,4} exponent ladder).
const PREDICTED_COLLAPSE = [4, 8, 16]; // 2^{2,3,4}

// imp-34689 first-footing baselines (quoted from imp-34689 F1/F3 for the like-for-like comparison).
const IMP34689_R_K = [4.0, 7.0, 17.91];
const IMP34689_M_K_ROUNDED = [2, 3, 4];

// Per-channel signed deviation of r_k from the exact 2^k line, on each footing.
const DEV_FOOTING_1 = IMP34689_R_K.map((r, i) => (r - PREDICTED_COLLAPSE[i]) / PREDICTED_COLLAPSE[i]); // ~[0, -0.125, +0.119]
const DEV_FOOTING_2 = R_K_2.map((r, i) => (r - PREDICTED_COLLAPSE[i]) / PREDICTED_COLLAPSE[i]); // ~[0, +0.147, -0.001]

// A sign flip of the q3/q4 deviation across two independent footings is IMPOSSIBLE for a genuine fixed
// fractional exponent (which would give a footing-invariant deviation) -- it is the signature of ULP scatter.
const Q3_DEVIATION_SIGN_FLIPS = Math.sign(DEV_FOOTING_1[1]) !== Math.sign(DEV_FOOTING_2[1]); // true
const Q4_DEVIATION_SIGN_FLIPS = Math.sign(DEV_FOOTING_1[2]) !== Math.sign(DEV_FOOTING_2[2]); // true

// Exponents pinned to {2,3,4} on BOTH footings -> footing-invariant integer structure.
const EXPONENTS_FOOTING_INVARIANT =
  M_K_2_ROUNDED[0] === IMP34689_M_K_ROUNDED[0] &&
  M_K_2_ROUNDED[1] === IMP34689_M_K_ROUNDED[1] &&
  M_K_2_ROUNDED[2] === IMP34689_M_K_ROUNDED[2] &&
  M_K_2_ROUNDED[0] === 2 &&
  M_K_2_ROUNDED[1] === 3 &&
  M_K_2_ROUNDED[2] === 4;

// r_k moved between footings for at least one channel (footing-dependent scatter).
const R_K_SCATTER_SHIFTS =
  Math.abs(R_K_2[1] - IMP34689_R_K[1]) > 0.5 || Math.abs(R_K_2[2] - IMP34689_R_K[2]) > 0.5;

// Overall verdict: the residual is confirmed footing-dependent ULP scatter, not a fixed fractional exponent.
const RESIDUAL_IS_FOOTING_DEPENDENT_ULP =
  EXPONENTS_FOOTING_INVARIANT && R_K_SCATTER_SHIFTS && (Q3_DEVIATION_SIGN_FLIPS || Q4_DEVIATION_SIGN_FLIPS);

export const IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION = Object.freeze({
  id: 'imp-34712',
  proofSection: 'S-frontier',
  claim_measured:
    'Recompute the imp-34689 resolution-matched collapse ladder r_k (geometric mean over fixed 2:1 dp ' +
    'pairs of the raw-share ratio s_k(dp)/s_k(2dp)) and its per-channel log-log slope m_k on a SECOND, ' +
    'INDEPENDENT deep-group footing -- a re-tiled N set {10^13.8, 10^14.15, 10^14.7, 10^15.3} (each past ' +
    'the imp-33620 sigma<0.01 anchor N*~4.62e13, non-overlapping with the imp-34689 tiling) and a ' +
    're-tiled set of in-window 2:1 dp pairs -- and test whether m_k still rounds to {2,3,4} while the r_k ' +
    'scatter SHIFTS, confirming the imp-34689 F3 residual (q3~7.0<8, q4~17.9>16) is footing-DEPENDENT ' +
    'ULP-stochastic scatter and NOT a footing-INVARIANT fractional exponent -- a cross-check on the ' +
    'inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  second_footing_N_decades: Object.freeze([13.8, 14.15, 14.7, 15.3]),
  matched_collapse_q2_footing2: +R_K_2[0].toFixed(4), // ~4.00 (imp-34689: 4.00)
  matched_collapse_q3_footing2: +R_K_2[1].toFixed(4), // ~9.17 (imp-34689: 7.00 -- MOVED, sign flipped)
  matched_collapse_q4_footing2: +R_K_2[2].toFixed(4), // ~15.98 (imp-34689: 17.91 -- MOVED, sign flipped)
  imp34689_r_k_footing1: Object.freeze(IMP34689_R_K.slice()), // [4.00, 7.00, 17.91]
  predicted_collapse_2_pow_k: Object.freeze(PREDICTED_COLLAPSE.slice()), // [4, 8, 16]
  per_channel_loglog_slope_m_footing2: Object.freeze(M_K_2.map((m) => +m.toFixed(4))), // ~[2.000, 3.197, 3.998]
  per_channel_loglog_slope_rounded_footing2: Object.freeze(M_K_2_ROUNDED.slice()), // [2, 3, 4]
  dev_from_2pow_k_footing1: Object.freeze(DEV_FOOTING_1.map((d) => +d.toFixed(4))), // ~[0, -0.125, +0.119]
  dev_from_2pow_k_footing2: Object.freeze(DEV_FOOTING_2.map((d) => +d.toFixed(4))), // ~[0, +0.147, -0.001]
  q3_deviation_sign_flips: Q3_DEVIATION_SIGN_FLIPS, // true -- impossible for a fixed fractional exponent
  q4_deviation_sign_flips: Q4_DEVIATION_SIGN_FLIPS, // true
  exponents_footing_invariant: EXPONENTS_FOOTING_INVARIANT, // true -- m_k -> {2,3,4} on BOTH footings
  r_k_scatter_shifts: R_K_SCATTER_SHIFTS, // true -- q3/q4 r_k moved > 0.5 between footings
  residual_is_footing_dependent_ulp_not_fractional: RESIDUAL_IS_FOOTING_DEPENDENT_ULP, // true
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Cross-validates the imp-34689 resolution-matched collapse ladder r_k ~ ' +
    '{4.00, 7.00, 17.91} (per-channel log-log slopes m_k ~ {1.999, 2.807, 4.163} -> {2,3,4}) on a ' +
    'SECOND, INDEPENDENT deep-group footing -- a re-tiled N set {10^13.8, 10^14.15, 10^14.7, 10^15.3} ' +
    '(each past the imp-33620 sigma<0.01 anchor N*~4.62e13, non-overlapping with the imp-34689 tiling) ' +
    'plus a re-tiled set of in-window 2:1 dp pairs -- to settle whether the imp-34689 F3 residual (q3 ' +
    '~7.0<8, q4 ~17.9>16) is footing-DEPENDENT ULP scatter or a footing-INVARIANT fractional exponent. ' +
    '(F1) THE INTEGER EXPONENTS ARE FOOTING-INVARIANT: the second-footing per-channel slopes m_k ~ ' +
    '{2.000, 3.197, 3.998} round to EXACTLY {2, 3, 4}, identical to imp-34689 -- the clean 1/dp^k = 2^k ' +
    'exponent structure is the same on both footings. (F2) THE r_k COLLAPSE FACTORS MOVE AND THE q3/q4 ' +
    'DEVIATION FROM 2^k FLIPS SIGN: r_k ~ {4.00, 9.17, 15.98} vs imp-34689 {4.00, 7.00, 17.91} -- q2 ' +
    'pinned at 4.00, but q3 moves from 12.5% BELOW 8 to 14.7% ABOVE 8 and q4 from 11.9% ABOVE 16 to 0.1% ' +
    'BELOW 16; BOTH deviations flip sign. A genuine fractional exponent would hold the SAME deviation ' +
    'sign on every footing -- a sign flip is only possible for stochastic scatter about the exact 2^k ' +
    'line. (F3) CONCLUSION -- ULP-STOCHASTIC, NOT FRACTIONAL: the imp-34689 F3 residual is confirmed to ' +
    'be the imp-34647 per-rung ULP-stochasticity of narrow in-window 2:1 pairs; it is footing-DEPENDENT ' +
    '(r_k scatter shifts and its sign flips across two independent footings) while the integer exponent ' +
    'm_k is footing-INVARIANT (pinned to {2,3,4} on both). The 1/dp^k = 2^k structure is real; the ' +
    'imperfection of any single r_k away from {4,8,16} is roundoff noise, NOT a departure of the ' +
    'finite-difference floor from the eps/dp^k law -- consistent with imp-34606 (clean {2,3,4}, R^2 up ' +
    'to 1.000) and imp-34647 (single narrow pairs oscillate within [~0.61,~1.84] of the roundoff line). ' +
    'q1..q4 are inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 ' +
    'deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'cross-checks that regime, it does not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) ' +
    '(imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34689 (first footing: matched-resolution collapse r_k ~ {4.00,7.00,17.91}, slopes m_k -> ' +
    '{2,3,4}; F3 residual claimed ULP-stochastic on a single footing -- cross-validated here); imp-34606 ' +
    '(clean {2,3,4} 1/dp^k exponent ladder via log-log fit; raw shares and per-channel roundoff windows ' +
    'reused verbatim); imp-34647 (narrow in-window 2:1 pairs are ULP-stochastic, floor within ' +
    '[~0.61,~1.84] of the roundoff line -- why the residual is not a fractional exponent); imp-33620 ' +
    '(deep-tail anchor N* ~ 4.62e13, sigma < 0.01; the second footing stays past it); imp-2714 (C_C ' +
    'ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34712_ASSERTIONS = [
  {
    id: 'imp34712-exponents-footing-invariant',
    holds: () =>
      EXPONENTS_FOOTING_INVARIANT &&
      M_K_2_ROUNDED[0] === 2 &&
      M_K_2_ROUNDED[1] === 3 &&
      M_K_2_ROUNDED[2] === 4,
    why: 'F1: the second-footing per-channel log-log slopes m_k ~ {2.000, 3.197, 3.998} round to exactly {2,3,4}, identical to imp-34689 -- the integer 1/dp^k = 2^k exponent structure is footing-invariant.',
  },
  {
    id: 'imp34712-r-k-scatter-shifts-and-sign-flips',
    holds: () =>
      R_K_SCATTER_SHIFTS &&
      Q3_DEVIATION_SIGN_FLIPS &&
      Q4_DEVIATION_SIGN_FLIPS &&
      Math.abs(R_K_2[0] - 4) < 0.2, // q2 stays pinned near 4.00 on both footings
    why: 'F2: the r_k collapse factors move between footings ({4.00,7.00,17.91} -> {4.00,9.17,15.98}) and the q3 and q4 deviations from 2^k both FLIP SIGN -- impossible for a fixed fractional exponent, the signature of ULP scatter.',
  },
  {
    id: 'imp34712-residual-is-footing-dependent-ulp-not-fractional',
    holds: () => RESIDUAL_IS_FOOTING_DEPENDENT_ULP === true,
    why: 'F3: exponents footing-invariant ({2,3,4} on both) AND r_k scatter footing-dependent (shifts + sign flip) => the imp-34689 F3 residual is confirmed footing-dependent ULP-stochastic scatter, NOT a genuine fractional exponent.',
  },
  {
    id: 'imp34712-honesty-gate-no-qed',
    holds: () =>
      IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.verdict) &&
      /UNTOUCHED/.test(IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34712_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34712-second-footing-collapse-ladder-crossvalidation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION;
