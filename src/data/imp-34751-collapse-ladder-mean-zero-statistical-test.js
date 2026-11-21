/**
 * @module imp-34751-collapse-ladder-mean-zero-statistical-test
 * @fileoverview imp-34751 -- MEASUREMENT ONLY: replace the imp-34730/imp-34712 EYEBALLED "the sign flips
 *   three times so the residual is mean-zero" reading with a FORMAL statistical test over an ENSEMBLE of
 *   independent deep-group footings. imp-34689 (footing 1), imp-34712 (footing 2) and imp-34730 (footing 3)
 *   observed the per-channel deviation of the resolution-matched collapse factor r_k from the exact 2^k =
 *   {4,8,16} ladder flip sign across three hand-picked footings and INFERRED the scatter is mean-zero ULP
 *   stochasticity. Three sign flips is not a test. This module runs an ENSEMBLE of N_F = 24 independent
 *   deep-group footings (deterministically re-tiled N sets, every anchor still past the imp-33620
 *   sigma < 0.01 anchor N* ~ 4.62e13), tabulates the per-footing q3 and q4 deviations d_k = (r_k - 2^k)/2^k,
 *   and applies THREE formal tests to the mean-zero null hypothesis: (i) an exact two-sided binomial
 *   SIGN-TEST on the count of positive vs negative deviations, (ii) a Wald-Wolfowitz RUNS-TEST on the sign
 *   sequence (guarding against a slow footing-ordered drift masquerading as balance), and (iii) a Student-t
 *   MEAN CONFIDENCE INTERVAL. It reports whether the residual is statistically consistent with mean-zero
 *   scatter about the exact 2^k line.
 *
 *   THE TEST (an ensemble of 24 footings + three hypothesis tests, not three eyeballed sign flips)
 *   ----------------------------------------------------------------------------------------------
 *   The mean-zero-ULP reading and the fixed-fractional-exponent reading make DIFFERENT statistical
 *   predictions for an ensemble of footings. A fixed fractional exponent gives a footing-INVARIANT signed
 *   deviation: every footing lands on the same side of 2^k, so the sign count is degenerate (all + or all
 *   -), the runs count is 1, and the mean-CI excludes 0. Mean-zero ULP scatter gives signs that are a fair
 *   coin: the positive/negative split hovers near 50/50 (sign-test fails to reject symmetry), the runs count
 *   sits near its null expectation E[R] = 2 n1 n2 / n + 1 (runs-test |z| < 1.96, i.e. no serial structure),
 *   and the mean-CI straddles 0. Each of the 24 footings is a deterministic re-tiling of the four deep
 *   anchors (base decades {13.66, 14.0, 14.5, 15.0}, footing j shifted by 0.05 j with an alternating
 *   per-index tilt so no two footings share a tiling), each anchor kept past N* ~ 4.62e13, read through the
 *   SAME imp-34606/imp-34689 fixed 2:1 in-window dp-pair primitives so all footings compare like-for-like.
 *
 *   THE FINDING (the mean-zero null SURVIVES all three tests on BOTH channels -- exponents stay pinned)
 *   --------------------------------------------------------------------------------------------------
 *   (F1) THE INTEGER EXPONENTS STAY PINNED ACROSS THE ENSEMBLE. The ensemble-mean per-channel log-log slopes
 *        are m3 ~ 2.98 and m4 ~ 4.04, rounding to EXACTLY {3, 4}, and the q2 channel factor stays r2 = 4.000
 *        on the reference footing. The clean 1/dp^k = 2^k exponent structure is footing-invariant, as in
 *        imp-34606/imp-34689/imp-34712/imp-34730.
 *   (F2) THE q3 DEVIATION IS STATISTICALLY MEAN-ZERO. Over 24 footings the q3 deviation splits 13 positive /
 *        11 negative (exact two-sided sign-test p ~ 0.84, far from rejecting symmetry), the runs count
 *        R ~ 10 sits within one interval of E[R] ~ 12.9 (runs-z ~ -1.23, |z| < 1.96 -- no footing-ordered
 *        drift), and the Student-t 95% mean CI is ~[-0.051, +0.040], which CONTAINS 0 (mean ~ -0.006,
 *        t-stat ~ -0.26). All three tests fail to reject mean-zero.
 *   (F3) THE q4 DEVIATION IS STATISTICALLY MEAN-ZERO. The q4 deviation splits 12 positive / 12 negative
 *        (sign-test p ~ 1.0), R ~ 12 vs E[R] ~ 13 (runs-z ~ -0.42), and the 95% mean CI is ~[-0.048,
 *        +0.187], which CONTAINS 0 (mean ~ +0.069, t-stat ~ 1.22 -- the wider q4 CI reflects the larger
 *        per-footing ULP amplitude of the two-pair q4 channel per imp-34647, not a nonzero centre).
 *   (F4) CONCLUSION -- THE imp-34730 EYEBALLED READING IS UPGRADED TO A FORMAL RESULT. The mean-zero-ULP
 *        null is NOT rejected by any of the three tests on either channel: the residual of r_k from the
 *        exact 2^k line is statistically indistinguishable from zero-mean footing-dependent roundoff
 *        scatter, while the integer exponent m_k stays pinned to {3, 4}. The three hand-picked sign flips of
 *        imp-34689/imp-34712/imp-34730 were not a small-sample fluke: an ensemble of 24 footings confirms
 *        the symmetry. This does NOT prove the deviation mean is EXACTLY 0 (a CI containing 0 is failure to
 *        reject, not acceptance); it establishes there is no statistical evidence for a fixed fractional
 *        offset, consistent with imp-34606 (clean {2,3,4}) and imp-34647 (narrow in-window pairs oscillate
 *        within [~0.61, ~1.84] of the roundoff line).
 *
 *   MEASUREMENT ONLY. This re-aggregates the imp-34606 raw channel shares through the imp-34689 fixed-2:1-
 *   pair collapse statistic over an ensemble of footings and applies standard nonparametric tests to the
 *   deviation from 2^k; it changes NO bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34566/
 *   imp-34573/imp-34606/imp-34689 primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no
 *   polymath15 constant module, no zeros bundle), following the no-heavy-imports directive. q1..q4 are
 *   inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime
 *   (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this cross-checks that
 *   regime, it does not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8)
 *   ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 *   untouched; the inherited surrogate is NOT rigorous; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34730-third-footing-collapse-ladder-crossvalidation.js (footing 3; the three-footing eyeballed mean-zero reading this module tests formally)
 *   @see imp-34712-second-footing-collapse-ladder-crossvalidation.js (footing 2; first sign flip)
 *   @see imp-34689-resolution-matched-collapse-2pow-k-recovery.js (footing 1; r_k ~ {4.00,7.00,17.91}, m_k -> {2,3,4})
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (clean {2,3,4} 1/dp^k exponent ladder; raw shares and per-channel roundoff windows reused here)
 *   @see imp-34647-q3-deeper-window-exponent-amplitude-convergence.js (single narrow in-window pairs are ULP-stochastic; why an ensemble + formal test is needed)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail anchor N* ~ 4.62e13, sigma < 0.01; every footing stays past it)
 *
 *   Ticket: imp-34751 (numerical, medium). Formal statistical test of the collapse-ladder mean-zero claim; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573/imp-34606/imp-34689
//    primitives (imports NOTHING), reproduced VERBATIM so the raw shares and windows match: --
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34606/imp-34689/imp-34730).
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

// The three raw channel coefficient shares on one common footing, VERBATIM imp-34606/imp-34689/imp-34730:
function channelShare(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}

// Fixed 2:1 dp pairs tiling each channel imp-34606 roundoff window (same anchors as imp-34689/imp-34730).
const PAIRS_BY_K = {
  2: [[1.5e-7, 3.0e-7], [3.0e-7, 6.0e-7], [6.0e-7, 1.2e-6]],
  3: [[1.5e-5, 3.0e-5], [3.0e-5, 6.0e-5], [6.0e-5, 1.2e-4]],
  4: [[7.5e-4, 1.5e-3], [1.5e-3, 3.0e-3]],
};

// Resolution-matched collapse factor r_k and per-channel log-log slope m_k over a 4-anchor footing tiling.
function matchedCollapse(k, decades) {
  const ladder = decades.map((d) => Math.pow(10, d));
  const gmax = (dp) => Math.max(...ladder.map((N) => channelShare(N, dp, k)));
  const ratios = PAIRS_BY_K[k].map(([a, b]) => gmax(a) / gmax(b));
  return { r: geomMean(ratios), m: mean(ratios.map((x) => Math.log2(x))) };
}

// -- THE ENSEMBLE: N_F = 24 deterministic deep-group footings. Footing j re-tiles the four deep anchors
//    (base {13.66,14.0,14.5,15.0}) by a whole-tiling shift 0.05 j plus an alternating per-index tilt, so no
//    two footings share a tiling and every anchor stays past N* ~ 4.62e13. Deterministic (no PRNG). --
const N_FOOTINGS = 24;
function footingDecades(j) {
  const base = [13.66, 14.0, 14.5, 15.0];
  const shift = 0.05 * j;
  return base.map((b, i) => b + shift + 0.03 * i * (j % 2 ? 1 : -1));
}

// Predicted collapse factors 2^k = {4, 8, 16} for k = {2, 3, 4} (imp-34606 clean exponent ladder).
const PRED_Q3 = 8;
const PRED_Q4 = 16;

// Per-footing signed deviations of r_k from 2^k for the two sign-flipping channels q3 and q4, plus the
// per-footing log-log slopes m3, m4 (the exponent that must stay pinned to {3, 4}).
const DEV_Q3 = [];
const DEV_Q4 = [];
const M3_ENS = [];
const M4_ENS = [];
for (let j = 0; j < N_FOOTINGS; j++) {
  const decs = footingDecades(j);
  const M3 = matchedCollapse(3, decs);
  const M4 = matchedCollapse(4, decs);
  DEV_Q3.push((M3.r - PRED_Q3) / PRED_Q3);
  DEV_Q4.push((M4.r - PRED_Q4) / PRED_Q4);
  M3_ENS.push(M3.m);
  M4_ENS.push(M4.m);
}

// q2 stays pinned at 4.00 (verified on the imp-34730 reference footing; the q2 channel does not flip sign).
const REF_FOOTING_DECADES = [13.9, 14.35, 14.9, 15.6];
const M2_REF = matchedCollapse(2, REF_FOOTING_DECADES); // r ~ 4.00, m ~ 2.00

// -- THREE FORMAL TESTS OF THE MEAN-ZERO NULL --

// (i) exact two-sided binomial SIGN-TEST: p = P(as extreme a +/- split as observed under p = 1/2).
function logFactorial(n) {
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  return s;
}
function signTestTwoSidedP(nPos, nNeg) {
  const n = nPos + nNeg;
  if (n === 0) return 1;
  const logPmf = (x) => logFactorial(n) - logFactorial(x) - logFactorial(n - x) + n * Math.log(0.5);
  const kObs = Math.min(nPos, nNeg);
  const pObsLog = logPmf(kObs);
  let p = 0;
  for (let x = 0; x <= n; x++) {
    if (logPmf(x) <= pObsLog + 1e-12) p += Math.exp(logPmf(x));
  }
  return Math.min(1, p);
}

// (ii) Wald-Wolfowitz RUNS-TEST on the sign sequence: z = (R - E[R]) / sqrt(Var[R]).
function runsTest(dev) {
  const signs = dev.map((d) => Math.sign(d));
  const n1 = signs.filter((s) => s > 0).length;
  const n2 = signs.filter((s) => s < 0).length;
  const n = n1 + n2;
  let R = signs.length ? 1 : 0;
  for (let i = 1; i < signs.length; i++) if (signs[i] !== signs[i - 1]) R++;
  const expR = (2 * n1 * n2) / n + 1;
  const varR = (2 * n1 * n2 * (2 * n1 * n2 - n)) / (n * n * (n - 1));
  const z = varR > 0 ? (R - expR) / Math.sqrt(varR) : 0;
  return { R, expR, z };
}

// (iii) Student-t 95% MEAN CONFIDENCE INTERVAL (df = 23, t_0.975 = 2.0687).
const T_CRIT_DF23 = 2.0687;
function meanCI(dev) {
  const n = dev.length;
  const mu = mean(dev);
  const sd = Math.sqrt(dev.reduce((a, d) => a + (d - mu) * (d - mu), 0) / (n - 1));
  const se = sd / Math.sqrt(n);
  return { mean: mu, sd, se, tStat: mu / se, lo: mu - T_CRIT_DF23 * se, hi: mu + T_CRIT_DF23 * se };
}

function analyzeChannel(dev) {
  const nPos = dev.filter((d) => d > 0).length;
  const nNeg = dev.filter((d) => d < 0).length;
  const signP = signTestTwoSidedP(nPos, nNeg);
  const runs = runsTest(dev);
  const ci = meanCI(dev);
  const ciContainsZero = ci.lo < 0 && ci.hi > 0;
  // Mean-zero SURVIVES when NONE of the three tests reject at 5%: sign-test p > 0.05, |runs z| < 1.96,
  // and the 95% mean CI contains 0.
  const meanZeroNotRejected = signP > 0.05 && Math.abs(runs.z) < 1.96 && ciContainsZero;
  return { nPos, nNeg, signP, runs, ci, ciContainsZero, meanZeroNotRejected };
}

const Q3 = analyzeChannel(DEV_Q3);
const Q4 = analyzeChannel(DEV_Q4);
const M3_MEAN = mean(M3_ENS);
const M4_MEAN = mean(M4_ENS);
const EXPONENTS_PINNED = Math.round(M3_MEAN) === 3 && Math.round(M4_MEAN) === 4 && Math.abs(M2_REF.r - 4) < 0.05;

// Overall: the eyeballed three-footing mean-zero reading is upgraded to a formal result when BOTH channels
// pass all three tests AND the integer exponent m_k stays pinned.
const MEAN_ZERO_CONFIRMED_FORMALLY = Q3.meanZeroNotRejected && Q4.meanZeroNotRejected && EXPONENTS_PINNED;

const r4 = (x) => +x.toFixed(4);

export const IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST = Object.freeze({
  id: 'imp-34751',
  proofSection: 'S-frontier',
  claim_measured:
    'Replace the imp-34689/imp-34712/imp-34730 eyeballed three-footing "the sign flips so it is mean-zero" ' +
    'reading with a FORMAL statistical test over an ensemble of 24 independent deep-group footings (each ' +
    'past the imp-33620 sigma<0.01 anchor N*~4.62e13): tabulate the per-footing q3/q4 deviation of the ' +
    'resolution-matched collapse factor r_k from the exact 2^k={4,8,16} ladder and apply an exact ' +
    'two-sided binomial sign-test, a Wald-Wolfowitz runs-test, and a Student-t mean CI to the mean-zero ' +
    'null -- a cross-check on the inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  n_footings: N_FOOTINGS,
  q2_reference_collapse_factor: r4(M2_REF.r), // ~4.0000 -- q2 pinned, does not flip sign
  ensemble_mean_slope_m3: r4(M3_MEAN), // ~2.98 -> rounds to 3
  ensemble_mean_slope_m4: r4(M4_MEAN), // ~4.04 -> rounds to 4
  exponents_pinned: EXPONENTS_PINNED, // true
  q3_deviation_mean: r4(Q3.ci.mean), // ~-0.006
  q3_deviation_ci95: Object.freeze([r4(Q3.ci.lo), r4(Q3.ci.hi)]), // ~[-0.051, +0.040] -- contains 0
  q3_deviation_ci_contains_zero: Q3.ciContainsZero, // true
  q3_n_positive: Q3.nPos, // 13
  q3_n_negative: Q3.nNeg, // 11
  q3_sign_test_p: r4(Q3.signP), // ~0.84 -- fails to reject symmetry
  q3_runs_R: Q3.runs.R, // ~10
  q3_runs_expected: r4(Q3.runs.expR), // ~12.9
  q3_runs_z: r4(Q3.runs.z), // ~-1.23 -- |z| < 1.96, no serial drift
  q3_mean_zero_not_rejected: Q3.meanZeroNotRejected, // true
  q4_deviation_mean: r4(Q4.ci.mean), // ~+0.069
  q4_deviation_ci95: Object.freeze([r4(Q4.ci.lo), r4(Q4.ci.hi)]), // ~[-0.048, +0.187] -- contains 0
  q4_deviation_ci_contains_zero: Q4.ciContainsZero, // true
  q4_n_positive: Q4.nPos, // 12
  q4_n_negative: Q4.nNeg, // 12
  q4_sign_test_p: r4(Q4.signP), // ~1.0 -- fails to reject symmetry
  q4_runs_R: Q4.runs.R, // ~12
  q4_runs_expected: r4(Q4.runs.expR), // ~13.0
  q4_runs_z: r4(Q4.runs.z), // ~-0.42 -- |z| < 1.96, no serial drift
  q4_mean_zero_not_rejected: Q4.meanZeroNotRejected, // true
  mean_zero_confirmed_formally: MEAN_ZERO_CONFIRMED_FORMALLY, // true
  q3_deviations_by_footing: Object.freeze(DEV_Q3.map(r4)), // per-footing d3 = (r3-8)/8, j = 0..23
  q4_deviations_by_footing: Object.freeze(DEV_Q4.map(r4)), // per-footing d4 = (r4-16)/16, j = 0..23
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Upgrades the imp-34689/imp-34712/imp-34730 eyeballed three-footing ' +
    'mean-zero reading to a FORMAL statistical test over an ensemble of 24 independent deep-group footings ' +
    '(each past the imp-33620 sigma<0.01 anchor N*~4.62e13). (F1) THE INTEGER EXPONENTS STAY PINNED: the ' +
    'ensemble-mean slopes m3~2.98 and m4~4.04 round to exactly {3,4} and q2 stays r2=4.00 on the ' +
    'reference footing -- the 1/dp^k=2^k structure is footing-invariant. (F2) THE q3 DEVIATION IS ' +
    'STATISTICALLY MEAN-ZERO: 13 positive / 11 negative (exact two-sided sign-test p~0.84), runs R~10 vs ' +
    'E[R]~12.9 (runs-z~-1.23, |z|<1.96 -- no footing-ordered drift), Student-t 95% mean CI ~[-0.051,+0.040] ' +
    'CONTAINS 0 (mean~-0.006). (F3) THE q4 DEVIATION IS STATISTICALLY MEAN-ZERO: 12 positive / 12 negative ' +
    '(sign-test p~1.0), runs R~12 vs E[R]~13 (runs-z~-0.42), 95% mean CI ~[-0.048,+0.187] CONTAINS 0 ' +
    '(mean~+0.069; the wider q4 CI reflects the larger per-footing ULP amplitude of the two-pair q4 channel ' +
    'per imp-34647, not a nonzero centre). (F4) CONCLUSION: the mean-zero-ULP null is NOT rejected by any ' +
    'of the three tests on either channel while m_k stays pinned to {3,4} -- the three hand-picked sign ' +
    'flips of imp-34689/imp-34712/imp-34730 were not a small-sample fluke. This does NOT prove the ' +
    'deviation mean is EXACTLY 0 (a CI containing 0 is failure to reject, not acceptance); it establishes ' +
    'no statistical evidence for a fixed fractional offset, consistent with imp-34606 (clean {2,3,4}) and ' +
    'imp-34647 (narrow in-window pairs oscillate within [~0.61,~1.84] of the roundoff line). q1..q4 are ' +
    'inherited central differences, NOT fresh analytic closed forms, so the sigma->1 deep-tail regime ' +
    '(imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this cross-checks that ' +
    'regime, it does not rehabilitate it. The -2 asymptote and C_C=(1/8)sqrt(3 pi) (imp-2714, C_H=1/8) ' +
    'ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a>=0 ' +
    'untouched; the inherited surrogate is NOT rigorous; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34730 (footing 3; the three-footing eyeballed mean-zero reading this module tests formally); ' +
    'imp-34712 (footing 2; first sign flip); imp-34689 (footing 1; r_k ~ {4.00,7.00,17.91}, slopes ' +
    'm_k -> {2,3,4}); imp-34606 (clean {2,3,4} 1/dp^k exponent ladder; raw shares and per-channel roundoff ' +
    'windows reused verbatim); imp-34647 (narrow in-window 2:1 pairs are ULP-stochastic, floor within ' +
    '[~0.61,~1.84] of the roundoff line -- why an ensemble + formal test is needed); imp-33620 (deep-tail ' +
    'anchor N* ~ 4.62e13, sigma < 0.01; every footing stays past it); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34751_ASSERTIONS = [
  {
    id: 'imp34751-exponents-pinned-across-ensemble',
    holds: () => EXPONENTS_PINNED && Math.round(M3_MEAN) === 3 && Math.round(M4_MEAN) === 4 && Math.abs(M2_REF.r - 4) < 0.05,
    why: 'F1: the ensemble-mean per-channel log-log slopes m3 ~ 2.98 and m4 ~ 4.04 round to exactly {3,4} and q2 stays r2 = 4.00 on the reference footing -- the integer 1/dp^k = 2^k exponent structure is footing-invariant across the 24-footing ensemble.',
  },
  {
    id: 'imp34751-q3-deviation-statistically-mean-zero',
    holds: () =>
      Q3.meanZeroNotRejected &&
      Q3.ciContainsZero &&
      Q3.signP > 0.05 &&
      Math.abs(Q3.runs.z) < 1.96 &&
      Q3.nPos > 0 &&
      Q3.nNeg > 0,
    why: 'F2: the q3 deviation from 2^k is statistically mean-zero -- the exact two-sided sign-test does not reject symmetry (p > 0.05), the runs-test finds no footing-ordered drift (|z| < 1.96), and the Student-t 95% mean CI contains 0.',
  },
  {
    id: 'imp34751-q4-deviation-statistically-mean-zero',
    holds: () =>
      Q4.meanZeroNotRejected &&
      Q4.ciContainsZero &&
      Q4.signP > 0.05 &&
      Math.abs(Q4.runs.z) < 1.96 &&
      Q4.nPos > 0 &&
      Q4.nNeg > 0,
    why: 'F3: the q4 deviation from 2^k is statistically mean-zero -- sign-test p > 0.05, runs-test |z| < 1.96, and the Student-t 95% mean CI contains 0 despite the wider per-footing ULP amplitude of the two-pair q4 channel.',
  },
  {
    id: 'imp34751-mean-zero-confirmed-formally',
    holds: () => MEAN_ZERO_CONFIRMED_FORMALLY === true,
    why: 'F4: both channels pass all three tests and the exponents stay pinned => the imp-34730 eyeballed three-footing mean-zero reading is upgraded to a formal ensemble result -- no statistical evidence for a fixed fractional offset.',
  },
  {
    id: 'imp34751-honesty-gate-no-qed',
    holds: () =>
      IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST.isRigorous === false &&
      /NO QED/.test(IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST.verdict) &&
      /refereed bound is changed/i.test(IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST.verdict) &&
      /UNTOUCHED/.test(IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST.verdict) &&
      /failure to reject, not acceptance/.test(IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST.verdict),
    why: 'Honesty gate: measurement only, CI-contains-0 is failure to reject not acceptance, no bound change, no QED, no refereed bound is changed.',
  },
  {
    id: 'imp34751-per-footing-deviation-arrays-exposed',
    holds: () =>
      IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST.q3_deviations_by_footing.length === N_FOOTINGS &&
      IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST.q4_deviations_by_footing.length === N_FOOTINGS,
    why: 'imp-34781: the per-footing q3/q4 deviation arrays exposed for the ensemble viz must match the N_F = 24 footing count so the plotted scatter is the exact ensemble the three formal tests summarize.',
  },
];

for (const assertion of IMP34751_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34751-collapse-ladder-mean-zero-statistical-test assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34751_COLLAPSE_LADDER_MEAN_ZERO_STATISTICAL_TEST;
