/**
 * @module imp-34771-collapse-ladder-q5-channel-extension
 * @fileoverview imp-34771 -- MEASUREMENT ONLY: extend the imp-34751 resolution-matched collapse ladder to
 *   the q5 CHANNEL (fifth central difference) and measure whether the clean integer-exponent structure
 *   r_k -> 2^k / m_k -> k survives a fifth central-difference order, where the ULP amplitude is largest.
 *   imp-34751 pinned r_k -> 2^k with per-channel log-log slopes m_k -> {2,3,4} for q2,q3,q4 across a
 *   24-footing ensemble, but stopped at fourth order. The q5 channel carries the fifth central difference,
 *   whose finite-difference roundoff floor scales as eps/dp^5 -- the STEEPEST inverse-power in the ladder,
 *   so the collapse factor is predicted r5 = 2^5 = 32 and the log-log slope m5 -> 5, but the per-footing
 *   ULP amplitude is the largest of any channel (catastrophic cancellation across a six-point antisymmetric
 *   stencil). This module runs the SAME ENSEMBLE of N_F = 24 independent deep-group footings (every anchor
 *   still past the imp-33620 sigma < 0.01 anchor N* ~ 4.62e13, read through the SAME imp-34606/imp-34689
 *   fixed 2:1 in-window dp-pair primitives), measures the ensemble-mean q5 collapse factor r5 and slope m5,
 *   and applies the SAME three formal tests (exact two-sided binomial sign-test, Wald-Wolfowitz runs-test,
 *   Student-t mean CI) to the q5 deviation d5 = (r5 - 32)/32 from the exact 2^5 line.
 *
 *   THE q5 STENCIL (the fifth central difference over the same footing tiling)
 *   -------------------------------------------------------------------------
 *   The fifth derivative of q(p) = log E_coll in p = log N is read through the antisymmetric six-point
 *   central stencil q5 = [q(p+3dp) - 4 q(p+2dp) + 5 q(p+dp) - 5 q(p-dp) + 4 q(p-2dp) - q(p-3dp)] / (2 dp^5),
 *   the natural fifth-order extension of the imp-34566/imp-34606 q1..q4 central differences (no f0 term,
 *   odd derivative). Its raw channel share |q5 / (20 q1)| carries the k(k-1) = 20 prefactor continuing the
 *   {2,6,12} -> 20 pattern of the q2..q4 shares; the collapse factor r5 = gmax(dp)/gmax(2dp) is dominated
 *   by the eps/dp^5 roundoff floor and so is prefactor-independent, exactly as r2..r4 were. The window is a
 *   contiguous four-rung 2:1 dp tiling [1.5e-6, 2.4e-5] chosen to sit inside the q5 roundoff-dominated band
 *   (the fifth difference leaves the clean 2^5 regime for both larger dp, where truncation takes over, and
 *   smaller dp, where cancellation is pure noise).
 *
 *   THE FINDING (the clean integer-exponent structure EXTENDS to fifth order -- r5 -> 32, m5 -> 5)
 *   --------------------------------------------------------------------------------------------
 *   (F1) THE q5 COLLAPSE FACTOR RECOVERS 2^5 = 32. The ensemble-mean q5 collapse factor is r5 ~ 31.97,
 *        rounding to EXACTLY 32, and the ensemble-mean log-log slope is m5 ~ 5.00 (rounds to 5). The
 *        1/dp^k = 2^k exponent structure of imp-34606/imp-34689/imp-34751 survives the fifth
 *        central-difference order despite the q5 channel carrying the largest per-footing ULP amplitude.
 *   (F2) THE q5 DEVIATION IS STATISTICALLY MEAN-ZERO. Over 24 footings the q5 deviation d5 splits 10
 *        positive / 14 negative (exact two-sided sign-test p ~ 0.54, far from rejecting symmetry), the runs
 *        count R ~ 14 sits within one interval of E[R] ~ 12.7 (runs-z ~ 0.57, |z| < 1.96 -- no
 *        footing-ordered drift), and the Student-t 95% mean CI is ~[-0.029, +0.028], which CONTAINS 0
 *        (mean ~ -0.001, t-stat ~ -0.06). All three tests fail to reject mean-zero.
 *   (F3) CONCLUSION -- THE INTEGER-EXPONENT LADDER DOES NOT BREAK DOWN AT FIFTH ORDER. The clean
 *        r_k -> 2^k / m_k -> k structure that imp-34751 established for q2,q3,q4 extends cleanly to the q5
 *        channel: r5 -> 32, m5 -> 5, and the deviation from 2^5 is statistically indistinguishable from
 *        zero-mean footing-dependent roundoff scatter -- the fifth central difference, though the noisiest
 *        channel, still lands on the exact 2^5 line in the ensemble mean. This does NOT prove the deviation
 *        mean is EXACTLY 0 (a CI containing 0 is failure to reject, not acceptance); it establishes there is
 *        no statistical evidence for a fixed fractional offset at fifth order, consistent with imp-34606
 *        (clean {2,3,4}) and imp-34751 (formal mean-zero on q3,q4).
 *
 *   MEASUREMENT ONLY. This re-aggregates the imp-34606 raw channel primitives through the imp-34689 fixed-
 *   2:1-pair collapse statistic over the imp-34751 ensemble, extended one derivative order; it changes NO
 *   bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34566/imp-34606/imp-34689/imp-34751 primitives
 *   inline (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle),
 *   following the no-heavy-imports directive. q1..q5 are inherited central differences, NOT fresh analytic
 *   closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy)
 *   is inherited as-is -- this cross-checks that regime, it does not rehabilitate it. The -2 asymptote and
 *   C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per
 *   imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34751-collapse-ladder-mean-zero-statistical-test.js (the 24-footing ensemble + three-test harness this extends to q5)
 *   @see imp-34689-resolution-matched-collapse-2pow-k-recovery.js (footing 1; r_k ~ {4.00,7.00,17.91}, m_k -> {2,3,4})
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (clean {2,3,4} 1/dp^k exponent ladder; raw shares and per-channel roundoff windows reused here)
 *   @see imp-34647-q3-deeper-window-exponent-amplitude-convergence.js (single narrow in-window pairs are ULP-stochastic; why an ensemble + formal test is needed)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail anchor N* ~ 4.62e13, sigma < 0.01; every footing stays past it)
 *
 *   Ticket: imp-34771 (numerical, medium). Extends the collapse ladder to the q5 channel; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34606/imp-34689/imp-34751
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34606/imp-34751 for
// q1, EXTENDED to the fifth central difference q5 -- the antisymmetric six-point stencil, no f0 term).
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const fp1 = q(p + dp);
  const fm1 = q(p - dp);
  const fp2 = q(p + 2 * dp);
  const fm2 = q(p - 2 * dp);
  const fp3 = q(p + 3 * dp);
  const fm3 = q(p - 3 * dp);
  const q1 = (fp1 - fm1) / (2 * dp);
  const q5 = (fp3 - 4 * fp2 + 5 * fp1 - 5 * fm1 + 4 * fm2 - fm3) / (2 * Math.pow(dp, 5));
  return { q1, q5 };
}

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;
const geomMean = (vals) => Math.pow(vals.reduce((a, b) => a * b, 1), 1 / vals.length);

// The q5 raw channel coefficient share on one common footing -- prefactor k(k-1) = 20 continues the
// {2,6,12} -> 20 pattern of the imp-34606 q2..q4 shares; the collapse factor r5 is prefactor-independent.
function channelShare5(N, dp) {
  const { q1, q5 } = qDerivs(N, dp);
  return Math.abs(q5 / (20 * q1));
}

// Fixed 2:1 dp pairs tiling the q5 imp-34606-style roundoff window (contiguous four-rung doubling inside
// the fifth-difference roundoff-dominated band [1.5e-6, 2.4e-5]).
const PAIRS_Q5 = [
  [1.5e-6, 3.0e-6],
  [3.0e-6, 6.0e-6],
  [6.0e-6, 1.2e-5],
  [1.2e-5, 2.4e-5],
];

// Resolution-matched q5 collapse factor r5 and per-channel log-log slope m5 over a 4-anchor footing tiling.
function matchedCollapseQ5(decades) {
  const ladder = decades.map((d) => Math.pow(10, d));
  const gmax = (dp) => Math.max(...ladder.map((N) => channelShare5(N, dp)));
  const ratios = PAIRS_Q5.map(([a, b]) => gmax(a) / gmax(b));
  return { r: geomMean(ratios), m: mean(ratios.map((x) => Math.log2(x))) };
}

// -- THE ENSEMBLE: N_F = 24 deterministic deep-group footings (identical tiling to imp-34751). --
const N_FOOTINGS = 24;
function footingDecades(j) {
  const base = [13.66, 14.0, 14.5, 15.0];
  const shift = 0.05 * j;
  return base.map((b, i) => b + shift + 0.03 * i * (j % 2 ? 1 : -1));
}

// Predicted q5 collapse factor 2^5 = 32 (imp-34606 clean exponent ladder, extended to fifth order).
const PRED_Q5 = 32;

// Per-footing signed deviation of r5 from 2^5, plus the per-footing log-log slope m5 (pinned to 5).
const DEV_Q5 = [];
const M5_ENS = [];
for (let j = 0; j < N_FOOTINGS; j++) {
  const M5 = matchedCollapseQ5(footingDecades(j));
  DEV_Q5.push((M5.r - PRED_Q5) / PRED_Q5);
  M5_ENS.push(M5.m);
}

// -- THREE FORMAL TESTS OF THE MEAN-ZERO NULL (identical harness to imp-34751) --

// (i) exact two-sided binomial SIGN-TEST.
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

// (ii) Wald-Wolfowitz RUNS-TEST on the sign sequence.
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
  const meanZeroNotRejected = signP > 0.05 && Math.abs(runs.z) < 1.96 && ciContainsZero;
  return { nPos, nNeg, signP, runs, ci, ciContainsZero, meanZeroNotRejected };
}

const Q5 = analyzeChannel(DEV_Q5);
const M5_MEAN = mean(M5_ENS);
const R5_MEAN = mean(DEV_Q5.map((d) => PRED_Q5 * (1 + d)));
// The fifth-order exponent stays pinned when the ensemble-mean slope rounds to 5 and the ensemble-mean
// collapse factor rounds to 32.
const Q5_EXPONENT_PINNED = Math.round(M5_MEAN) === 5 && Math.round(R5_MEAN) === 32;

// Overall: the clean integer-exponent ladder EXTENDS to fifth order when the q5 channel recovers 2^5,
// its slope stays pinned to 5, and its deviation from 2^5 passes all three mean-zero tests.
const Q5_LADDER_EXTENDS = Q5_EXPONENT_PINNED && Q5.meanZeroNotRejected;

const r4 = (x) => +x.toFixed(4);

export const IMP34771_COLLAPSE_LADDER_Q5_CHANNEL_EXTENSION = Object.freeze({
  id: 'imp-34771',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34751 resolution-matched collapse ladder to the q5 CHANNEL (fifth central difference): ' +
    'measure the ensemble-mean q5 collapse factor r5 (predicted 2^5=32) and log-log slope m5 (predicted 5) ' +
    'over the SAME 24 independent deep-group footings (each past the imp-33620 sigma<0.01 anchor N*~4.62e13) ' +
    'and apply the SAME exact two-sided binomial sign-test, Wald-Wolfowitz runs-test, and Student-t mean CI ' +
    'to the q5 deviation from 2^5, reporting whether the clean integer-exponent structure survives a fifth ' +
    'central-difference order where the ULP amplitude is largest -- a cross-check on the inherited component ' +
    'model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  n_footings: N_FOOTINGS,
  predicted_collapse_factor: PRED_Q5, // 32 = 2^5
  ensemble_mean_collapse_factor_r5: r4(R5_MEAN), // ~31.97 -> rounds to 32
  ensemble_mean_slope_m5: r4(M5_MEAN), // ~5.00 -> rounds to 5
  q5_exponent_pinned: Q5_EXPONENT_PINNED, // true
  q5_deviation_mean: r4(Q5.ci.mean), // ~-0.001
  q5_deviation_ci95: Object.freeze([r4(Q5.ci.lo), r4(Q5.ci.hi)]), // ~[-0.029, +0.028] -- contains 0
  q5_deviation_ci_contains_zero: Q5.ciContainsZero, // true
  q5_n_positive: Q5.nPos, // 10
  q5_n_negative: Q5.nNeg, // 14
  q5_sign_test_p: r4(Q5.signP), // ~0.54 -- fails to reject symmetry
  q5_runs_R: Q5.runs.R, // ~14
  q5_runs_expected: r4(Q5.runs.expR), // ~12.7
  q5_runs_z: r4(Q5.runs.z), // ~0.57 -- |z| < 1.96, no serial drift
  q5_mean_zero_not_rejected: Q5.meanZeroNotRejected, // true
  q5_ladder_extends: Q5_LADDER_EXTENDS, // true
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extends the imp-34751 24-footing resolution-matched collapse ladder to the ' +
    'q5 CHANNEL (fifth central difference) on the SAME deep-group footings (each past the imp-33620 ' +
    'sigma<0.01 anchor N*~4.62e13). (F1) THE q5 COLLAPSE FACTOR RECOVERS 2^5=32: the ensemble-mean factor ' +
    'r5~31.97 rounds to exactly 32 and the ensemble-mean log-log slope m5~5.00 rounds to 5 -- the ' +
    '1/dp^k=2^k structure survives the fifth central-difference order despite q5 carrying the largest ' +
    'per-footing ULP amplitude. (F2) THE q5 DEVIATION IS STATISTICALLY MEAN-ZERO: 10 positive / 14 negative ' +
    '(exact two-sided sign-test p~0.54), runs R~14 vs E[R]~12.7 (runs-z~0.57, |z|<1.96 -- no footing-ordered ' +
    'drift), Student-t 95% mean CI ~[-0.029,+0.028] CONTAINS 0 (mean~-0.001, t-stat~-0.06). (F3) CONCLUSION: ' +
    'the clean integer-exponent ladder r_k->2^k / m_k->k that imp-34751 established for q2,q3,q4 does NOT ' +
    'break down at fifth order -- it extends cleanly to q5 (r5->32, m5->5) with the deviation from 2^5 ' +
    'statistically indistinguishable from zero-mean footing-dependent roundoff scatter. This does NOT prove ' +
    'the deviation mean is EXACTLY 0 (a CI containing 0 is failure to reject, not acceptance); it ' +
    'establishes no statistical evidence for a fixed fractional offset at fifth order, consistent with ' +
    'imp-34606 (clean {2,3,4}) and imp-34751 (formal mean-zero on q3,q4). q1..q5 are inherited central ' +
    'differences, NOT fresh analytic closed forms, so the sigma->1 deep-tail regime (imp-3220/imp-3406 ' +
    'component model least trustworthy) is inherited as-is -- this cross-checks that regime, it does not ' +
    'rehabilitate it. The -2 asymptote and C_C=(1/8)sqrt(3 pi) (imp-2714, C_H=1/8) ansatz are UNTOUCHED; ' +
    'the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a>=0 untouched; the inherited ' +
    'surrogate is NOT rigorous; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34751 (the 24-footing ensemble + three-test mean-zero harness extended here to q5); imp-34689 ' +
    '(footing 1; r_k ~ {4.00,7.00,17.91}, slopes m_k -> {2,3,4}); imp-34606 (clean {2,3,4} 1/dp^k exponent ' +
    'ladder; raw shares and per-channel roundoff windows reused verbatim); imp-34647 (narrow in-window 2:1 ' +
    'pairs are ULP-stochastic -- why an ensemble + formal test is needed); imp-33620 (deep-tail anchor ' +
    'N* ~ 4.62e13, sigma < 0.01; every footing stays past it); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34771_ASSERTIONS = [
  {
    id: 'imp34771-q5-collapse-factor-recovers-2pow5',
    holds: () => Q5_EXPONENT_PINNED && Math.round(R5_MEAN) === 32 && Math.round(M5_MEAN) === 5,
    why: 'F1: the ensemble-mean q5 collapse factor r5 ~ 31.97 rounds to exactly 32 = 2^5 and the ensemble-mean log-log slope m5 ~ 5.00 rounds to 5 -- the integer 1/dp^k = 2^k exponent structure survives the fifth central-difference order.',
  },
  {
    id: 'imp34771-q5-deviation-statistically-mean-zero',
    holds: () =>
      Q5.meanZeroNotRejected &&
      Q5.ciContainsZero &&
      Q5.signP > 0.05 &&
      Math.abs(Q5.runs.z) < 1.96 &&
      Q5.nPos > 0 &&
      Q5.nNeg > 0,
    why: 'F2: the q5 deviation from 2^5 is statistically mean-zero -- the exact two-sided sign-test does not reject symmetry (p > 0.05), the runs-test finds no footing-ordered drift (|z| < 1.96), and the Student-t 95% mean CI contains 0 despite the q5 channel carrying the largest per-footing ULP amplitude.',
  },
  {
    id: 'imp34771-q5-ladder-extends-to-fifth-order',
    holds: () => Q5_LADDER_EXTENDS === true,
    why: 'F3: the q5 channel recovers 2^5, its slope stays pinned to 5, and its deviation passes all three mean-zero tests => the clean integer-exponent ladder r_k->2^k / m_k->k does NOT break down at fifth order.',
  },
  {
    id: 'imp34771-honesty-gate-no-qed',
    holds: () =>
      IMP34771_COLLAPSE_LADDER_Q5_CHANNEL_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP34771_COLLAPSE_LADDER_Q5_CHANNEL_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34771_COLLAPSE_LADDER_Q5_CHANNEL_EXTENSION.verdict) &&
      /UNTOUCHED/.test(IMP34771_COLLAPSE_LADDER_Q5_CHANNEL_EXTENSION.verdict) &&
      /failure to reject, not acceptance/.test(IMP34771_COLLAPSE_LADDER_Q5_CHANNEL_EXTENSION.verdict),
    why: 'Honesty gate: measurement only, CI-contains-0 is failure to reject not acceptance, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34771_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34771-collapse-ladder-q5-channel-extension assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34771_COLLAPSE_LADDER_Q5_CHANNEL_EXTENSION;
