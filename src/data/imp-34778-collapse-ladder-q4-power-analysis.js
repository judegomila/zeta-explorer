/**
 * @module imp-34778-collapse-ladder-q4-power-analysis
 *   imp-34751 F3 upgraded the eyeballed "the q4 sign flips so it is mean-zero" reading to a FORMAL test over
 *   an ensemble of N_F = 24 deep-group footings and found the q4 deviation d4 = (r4 - 2^4)/2^4 has a 95% mean
 *   CI ~[-0.048, +0.187] that CONTAINS 0 (mean ~ +0.069) -- but flagged two caveats: (a) that CI is notably
 *   WIDER than the q3 CI ~[-0.051, +0.040], reflecting the larger two-pair ULP amplitude of the q4 channel
 *   (imp-34647), and (b) a CI containing 0 is FAILURE TO REJECT, not acceptance. A failure-to-reject is only
 *   as strong as the test's POWER: a wide CI can fail to reject mean-zero simply because it is too blunt to
 *   see a real offset. This module MEASURES that power directly. It reproduces the imp-34606/imp-34689/
 *   imp-34751 collapse-ladder primitives inline (imports NOTHING), recomputes the per-footing q3/q4 deviation
 *   ensemble, extracts the sample standard deviation sigma_k, and runs a standard one-sample power analysis:
 *   for a hypothesized FIXED fractional q4 offset delta, how many footings N_F would be needed to reject
 *   mean-zero at 95% (two-sided alpha = 0.05) with 80%/90% power, and -- the dual question -- what is the
 *   MINIMUM DETECTABLE EFFECT (MDE) at the current N_F = 24. Measurement only; changes NO bound.
 *
 *   THE POWER MODEL (standard normal-approximation one-sample two-sided test)
 *   ----------------------------------------------------------------------------------------------------------
 *   For a one-sample test of H0: mean deviation = 0 against a fixed alternative delta at two-sided level alpha
 *   with power 1 - beta, the required sample size is the textbook
 *          N_F(delta) = ((z_{alpha/2} + z_{beta}) * sigma / delta)^2
 *   and, inverting at fixed N_F, the minimum detectable effect is
 *          MDE(N_F) = (z_{alpha/2} + z_{beta}) * sigma / sqrt(N_F),
 *   with z_{0.975} = 1.959964 (two-sided 5%), z_{0.80} = 0.841621, z_{0.90} = 1.281552. sigma is the sample
 *   standard deviation of the per-footing deviation ensemble (the SAME quantity that sets the imp-34751 CI
 *   half-width). This is a normal approximation to the Student-t test imp-34751 actually ran; at N_F = 24 the
 *   t/z inflation is a few percent and does not change any order-of-magnitude conclusion below.
 *
 *   THE FINDINGS
 *   ----------------------------------------------------------------------------------------------------------
 *   (F1) THE q4 ENSEMBLE SIGMA IS ~2.6x THE q3 SIGMA. The measured per-footing sample standard deviations are
 *        sigma_q4 ~ 0.2794 and sigma_q3 ~ 0.1070, a ratio ~2.61 -- a direct quantification of the imp-34647
 *        "two-pair q4 channel has the larger ULP amplitude" caveat that imp-34751 gave only qualitatively. It
 *        is this larger sigma, not a nonzero centre, that widens the q4 CI to ~[-0.048, +0.187].
 *   (F2) THE MINIMUM DETECTABLE q4 OFFSET AT N_F = 24 IS ~16%. With sigma_q4 the current 24-footing ensemble
 *        can only reject mean-zero at 80% power against a fixed fractional q4 offset of MDE ~ 0.160 (or ~0.185
 *        at 90% power). Any true fixed offset SMALLER than ~16% of the 2^4 collapse factor would be invisible
 *        to the current test -- so the imp-34751 "no evidence for a fixed offset" is a statement about offsets
 *        >~16%, not about arbitrarily small ones. For contrast the q3 channel, with its 2.6x smaller sigma,
 *        reaches an MDE ~ 0.061 at the same N_F = 24.
 *   (F3) DETECTING A SMALL FIXED q4 OFFSET NEEDS HUNDREDS OF FOOTINGS. To reject mean-zero against a fixed q4
 *        offset of delta = 0.05 (5%) at 80% power would take N_F ~ 245 footings (~328 at 90%); delta = 0.10
 *        needs N_F ~ 61 (~82 at 90%); only a large delta = 0.20 is within reach of a ~15-footing run. The
 *        cost grows as 1/delta^2, so halving the target offset quadruples the required ensemble.
 *   (F4) CONCLUSION -- THE imp-34751 MEAN-ZERO READING IS EVIDENTIALLY SOUND FOR MODERATE-TO-LARGE OFFSETS BUT
 *        BLIND TO SMALL ONES. The wide q4 CI is fully explained by the ~2.6x larger channel sigma (F1), not by
 *        a suppressed nonzero centre; the failure-to-reject is genuine for any fixed offset above the ~16% MDE
 *        (F2); and closing the window on small (few-percent) offsets is a matter of ensemble size, scaling as
 *        1/delta^2 (F3). This QUANTIFIES the evidentiary strength of the imp-34751 mean-zero conclusion; it
 *        does NOT change it, and a CI containing 0 remains failure-to-reject, not proof of an exactly-zero mean.
 *
 *   Measurement only on the inherited imp-3220/imp-3406 surrogate (q1..q4 are inherited central differences,
 *   not fresh closed forms); the -2 asymptote and C_C = (1/8)sqrt(3pi) (imp-2714, C_H = 1/8) ansatz untouched;
 *   C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 *   operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34751-collapse-ladder-mean-zero-statistical-test.js (F3: the wide q4 CI ~[-0.048,+0.187] this powers)
 *   @see imp-34771-collapse-ladder-q5-channel-extension.js (the q5 extension of the same ensemble machinery)
 *   @see imp-34647-... (the two-pair q4 channel larger-ULP-amplitude caveat quantified here)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail anchor N* ~ 4.62e13; every footing stays past it)
 *
 *   Ticket: imp-34778 (numerical, medium). Sample-size / power analysis of the imp-34751 q4 mean-zero test.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34566/imp-34606/imp-34689/imp-34751 primitives
//    (imports NOTHING), reproduced VERBATIM so the raw shares, windows and footings match: --
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34606/imp-34689/imp-34751).
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

function channelShare(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}

// Fixed 2:1 dp pairs tiling each channel imp-34606 roundoff window (same anchors as imp-34689/imp-34751).
const PAIRS_BY_K = {
  3: [[1.5e-5, 3.0e-5], [3.0e-5, 6.0e-5], [6.0e-5, 1.2e-4]],
  4: [[7.5e-4, 1.5e-3], [1.5e-3, 3.0e-3]],
};

function matchedCollapse(k, decades) {
  const ladder = decades.map((d) => Math.pow(10, d));
  const gmax = (dp) => Math.max(...ladder.map((N) => channelShare(N, dp, k)));
  const ratios = PAIRS_BY_K[k].map(([a, b]) => gmax(a) / gmax(b));
  return { r: geomMean(ratios), m: mean(ratios.map((x) => Math.log2(x))) };
}

// -- THE ENSEMBLE: the SAME N_F = 24 deterministic deep-group footings as imp-34751. --
const N_FOOTINGS = 24;
function footingDecades(j) {
  const base = [13.66, 14.0, 14.5, 15.0];
  const shift = 0.05 * j;
  return base.map((b, i) => b + shift + 0.03 * i * (j % 2 ? 1 : -1));
}

const PRED_Q3 = 8; // 2^3
const PRED_Q4 = 16; // 2^4

const DEV_Q3 = [];
const DEV_Q4 = [];
for (let j = 0; j < N_FOOTINGS; j++) {
  const decs = footingDecades(j);
  DEV_Q3.push((matchedCollapse(3, decs).r - PRED_Q3) / PRED_Q3);
  DEV_Q4.push((matchedCollapse(4, decs).r - PRED_Q4) / PRED_Q4);
}

// Sample mean, sample standard deviation (n-1) and standard error of a deviation ensemble.
function sampleStats(dev) {
  const n = dev.length;
  const mu = mean(dev);
  const sd = Math.sqrt(dev.reduce((a, d) => a + (d - mu) * (d - mu), 0) / (n - 1));
  const se = sd / Math.sqrt(n);
  return { n, mean: mu, sd, se };
}

const S3 = sampleStats(DEV_Q3);
const S4 = sampleStats(DEV_Q4);

// -- THE POWER ANALYSIS (standard normal-approximation one-sample two-sided test) --
const Z_ALPHA2 = 1.959964; // two-sided alpha = 0.05  -> z_{0.975}
const Z_POWER = { 80: 0.841621, 90: 1.281552 }; // z_{beta} for 80% / 90% power

// Footings needed to reject mean-zero against a FIXED fractional offset delta at the given power.
function footingsNeeded(sigma, delta, power) {
  return Math.pow(((Z_ALPHA2 + Z_POWER[power]) * sigma) / Math.abs(delta), 2);
}
// Minimum detectable effect at a fixed footing count N_F.
function minDetectableEffect(sigma, nF, power) {
  return ((Z_ALPHA2 + Z_POWER[power]) * sigma) / Math.sqrt(nF);
}

const OFFSET_GRID = [0.05, 0.1, 0.2];
const q4_footings_needed = Object.freeze(
  OFFSET_GRID.map((delta) =>
    Object.freeze({
      offset: delta,
      nF_power80: +footingsNeeded(S4.sd, delta, 80).toFixed(1),
      nF_power90: +footingsNeeded(S4.sd, delta, 90).toFixed(1),
    }),
  ),
);

const r4 = (x) => +x.toFixed(4);
const r5 = (x) => +x.toFixed(5);

// Sanity self-checks: reproduce the imp-34751 q4 CI half-width and mean from the same ensemble.
const _q4_ci_lo = r4(S4.mean - 2.0687 * S4.se);
const _q4_ci_hi = r4(S4.mean + 2.0687 * S4.se);
const REPRODUCES_IMP34751_CI = Math.abs(_q4_ci_lo - -0.0485) < 5e-3 && Math.abs(_q4_ci_hi - 0.1875) < 5e-3;

export const IMP34778_COLLAPSE_LADDER_Q4_POWER_ANALYSIS = Object.freeze({
  id: 'imp-34778',
  proofSection: 'S-frontier',
  claim_measured:
    'Run a sample-size / power analysis on the imp-34751 q4 collapse-ladder mean-zero test: from the SAME ' +
    '24-footing deep-group deviation ensemble, extract the sample sigma and report (a) the minimum ' +
    'detectable fixed fractional q4 offset at the current N_F=24 and (b) the footing count needed to reject ' +
    'mean-zero against a fixed offset of 5%/10%/20% at 80%/90% power -- quantifies the evidentiary strength ' +
    'of the imp-34751 failure-to-reject; changes NO bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  n_footings: N_FOOTINGS,
  test_level_alpha: 0.05,
  z_alpha_over_2: Z_ALPHA2,
  // (F1) channel sigmas -- q4 is ~2.6x q3, quantifying the imp-34647 larger-ULP-amplitude caveat.
  q3_ensemble_sigma: r4(S3.sd), // ~0.1070
  q4_ensemble_sigma: r4(S4.sd), // ~0.2794
  sigma_ratio_q4_over_q3: r4(S4.sd / S3.sd), // ~2.61
  q4_mean_deviation: r4(S4.mean), // ~+0.069
  q4_ci95_reproduced: Object.freeze([_q4_ci_lo, _q4_ci_hi]), // ~[-0.048, +0.188] matches imp-34751 F3
  reproduces_imp34751_ci: REPRODUCES_IMP34751_CI, // true
  // (F2) minimum detectable effect at the current N_F = 24.
  q4_mde_at_24_power80: r5(minDetectableEffect(S4.sd, 24, 80)), // ~0.160
  q4_mde_at_24_power90: r5(minDetectableEffect(S4.sd, 24, 90)), // ~0.185
  q3_mde_at_24_power80: r5(minDetectableEffect(S3.sd, 24, 80)), // ~0.061 (2.6x tighter channel)
  // (F3) footings needed to detect a fixed fractional q4 offset of 5% / 10% / 20%.
  q4_footings_needed, // delta=0.05 -> ~245/328; 0.10 -> ~61/82; 0.20 -> ~15/21
  power_law_note: 'N_F scales as 1/delta^2: halving the target fixed offset quadruples the required ensemble.',
  isRigorous: false,
  verdict:
    'The imp-34751 q4 mean-zero failure-to-reject is evidentially sound for fixed offsets above the ' +
    '~16% minimum detectable effect at N_F=24 but blind below it; the wide q4 CI is explained by the ~2.6x ' +
    'larger channel sigma (imp-34647), not a suppressed nonzero centre. Detecting a small (few-percent) ' +
    'offset would take hundreds of footings (1/delta^2 growth). Measurement only; a CI containing 0 remains ' +
    'failure-to-reject, not acceptance; changes no bound; C_mb GUE-conditional per imp-486 untouched; NO QED.',
});

export default IMP34778_COLLAPSE_LADDER_Q4_POWER_ANALYSIS;
