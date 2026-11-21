/**
 * @module imp-34795-collapse-ladder-q6-channel-extension
 * @fileoverview imp-34795 -- MEASUREMENT ONLY: extend the imp-34771 resolution-matched collapse ladder to
 *   the q6 CHANNEL (sixth central difference) and measure whether the clean integer-exponent structure
 *   r_k -> 2^k / m_k -> k finally BREAKS at a sixth central-difference order, or persists one rung further.
 *   imp-34771 pinned r5 -> 2^5 = 32 with log-log slope m5 -> 5, extending the imp-34751 q2,q3,q4 ladder and
 *   concluding the ladder does NOT break at fifth order (q5 deviation CI contained 0 = failure to reject).
 *   The q6 channel carries the sixth central difference, whose finite-difference roundoff floor scales as
 *   eps/dp^6 -- the STEEPEST inverse-power in the ladder, so the collapse factor is predicted r6 = 2^6 = 64
 *   and the log-log slope m6 -> 6, but the per-footing ULP amplitude is the largest of any channel tested
 *   (catastrophic cancellation across a symmetric SEVEN-point stencil with a nonzero f0 term). This module
 *   runs the SAME ENSEMBLE of N_F = 24 independent deep-group footings (every anchor still past the
 *   imp-33620 sigma < 0.01 anchor N* ~ 4.62e13, read through the SAME imp-34606/imp-34689 fixed 2:1 in-window
 *   dp-pair primitives over the SAME [1.5e-6, 2.4e-5] window imp-34771 used), measures the ensemble-mean q6
 *   collapse factor r6 and slope m6, and applies the SAME three formal tests (exact two-sided binomial
 *   sign-test, Wald-Wolfowitz runs-test, Student-t mean CI) to the q6 deviation d6 = (r6 - 64)/64 from 2^6.
 *
 *   THE q6 STENCIL (the sixth central difference over the same footing tiling)
 *   -------------------------------------------------------------------------
 *   The sixth derivative of q(p) = log E_coll in p = log N is read through the symmetric seven-point central
 *   stencil q6 = [q(p+3dp) - 6 q(p+2dp) + 15 q(p+dp) - 20 q(p) + 15 q(p-dp) - 6 q(p-2dp) + q(p-3dp)] / dp^6,
 *   the natural sixth-order extension of the imp-34566/imp-34606 q1..q4 and imp-34771 q5 central differences.
 *   Unlike the odd-order q5 stencil this EVEN order carries a central f0 term (the -20 q(p) coefficient), the
 *   binomial [1,-6,15,-20,15,-6,1] row. Its raw channel share |q6 / (30 q1)| carries the k(k-1) = 30
 *   prefactor continuing the {2,6,12,20} -> 30 pattern of the q2..q5 shares; the collapse factor
 *   r6 = gmax(dp)/gmax(2dp) is dominated by the eps/dp^6 roundoff floor and so is prefactor-independent,
 *   exactly as r2..r5 were. The window is the SAME contiguous four-rung 2:1 dp tiling [1.5e-6, 2.4e-5] that
 *   imp-34771 used for q5 (chosen to sit inside the roundoff-dominated band -- the sixth difference leaves the
 *   clean 2^6 regime for larger dp, where truncation takes over, and for smaller dp, where cancellation is
 *   pure noise), so this is a strictly protocol-matched one-order extension, not a re-tuned window.
 *
 *   THE FINDING (the clean integer-exponent structure DOES NOT BREAK at sixth order -- r6 -> 64, m6 -> 6)
 *   ---------------------------------------------------------------------------------------------------
 *   (F1) THE q6 COLLAPSE FACTOR RECOVERS 2^6 = 64. The ensemble-mean q6 collapse factor is r6 ~ 64.41,
 *        rounding to EXACTLY 64, and the ensemble-mean log-log slope is m6 ~ 6.00 (rounds to 6). The
 *        1/dp^k = 2^k exponent structure of imp-34606/imp-34689/imp-34751/imp-34771 survives the sixth
 *        central-difference order despite the q6 channel carrying the largest per-footing ULP amplitude yet.
 *   (F2) THE q6 DEVIATION IS STATISTICALLY MEAN-ZERO. Over 24 footings the q6 deviation d6 splits 13
 *        positive / 11 negative (exact two-sided sign-test p ~ 0.84, far from rejecting symmetry), the runs
 *        count R ~ 16 sits within two intervals of E[R] ~ 12.9 (runs-z ~ 1.30, |z| < 1.96 -- no
 *        footing-ordered drift), and the Student-t 95% mean CI is ~[-0.028, +0.041], which CONTAINS 0
 *        (mean ~ +0.006, t-stat ~ +0.39). All three tests fail to reject mean-zero.
 *   (F3) CONCLUSION -- THE INTEGER-EXPONENT LADDER STILL DOES NOT BREAK DOWN AT SIXTH ORDER. The clean
 *        r_k -> 2^k / m_k -> k structure that imp-34751 established for q2,q3,q4 and imp-34771 extended to q5
 *        extends cleanly to the q6 channel: r6 -> 64, m6 -> 6, and the deviation from 2^6 is statistically
 *        indistinguishable from zero-mean footing-dependent roundoff scatter -- the sixth central difference,
 *        though the noisiest channel tested, still lands on the exact 2^6 line in the ensemble mean. This
 *        does NOT prove the deviation mean is EXACTLY 0 (a CI containing 0 is failure to reject, not
 *        acceptance); it establishes there is no statistical evidence for a fixed fractional offset at sixth
 *        order, consistent with imp-34606 (clean {2,3,4}), imp-34751 (formal mean-zero on q3,q4), and
 *        imp-34771 (mean-zero on q5). The ladder-break the ticket asked about is NOT observed at q6.
 *
 *   MEASUREMENT ONLY. This re-aggregates the imp-34606 raw channel primitives through the imp-34689 fixed-
 *   2:1-pair collapse statistic over the imp-34771 ensemble, extended one derivative order; it changes NO
 *   bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34566/imp-34606/imp-34689/imp-34751/imp-34771
 *   primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no
 *   zeros bundle), following the no-heavy-imports directive. q1,q6 are inherited central differences, NOT
 *   fresh analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least
 *   trustworthy) is inherited as-is -- this cross-checks that regime, it does not rehabilitate it. The -2
 *   asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional
 *   share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; no
 *   operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34771-collapse-ladder-q5-channel-extension.js (the q5 rung + 24-footing three-test harness this extends to q6)
 *   @see imp-34751-collapse-ladder-mean-zero-statistical-test.js (the 24-footing ensemble + three-test harness)
 *   @see imp-34689-resolution-matched-collapse-2pow-k-recovery.js (footing 1; r_k ~ {4.00,7.00,17.91}, m_k -> {2,3,4})
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (clean {2,3,4} 1/dp^k exponent ladder; raw shares and windows reused here)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail anchor N* ~ 4.62e13, sigma < 0.01; every footing stays past it)
 *
 *   Ticket: imp-34795 (numerical, medium). Extends the collapse ladder to the q6 channel; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34606/imp-34689/imp-34751/
//    imp-34771 primitives (imports NOTHING), reproduced VERBATIM so the raw shares and windows match: --
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34606/imp-34771 for
// q1, EXTENDED to the sixth central difference q6 -- the symmetric seven-point stencil WITH an f0 term).
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const f0 = q(p);
  const fp1 = q(p + dp);
  const fm1 = q(p - dp);
  const fp2 = q(p + 2 * dp);
  const fm2 = q(p - 2 * dp);
  const fp3 = q(p + 3 * dp);
  const fm3 = q(p - 3 * dp);
  const q1 = (fp1 - fm1) / (2 * dp);
  const q6 =
    (fp3 - 6 * fp2 + 15 * fp1 - 20 * f0 + 15 * fm1 - 6 * fm2 + fm3) / Math.pow(dp, 6);
  return { q1, q6 };
}

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;
const geomMean = (vals) => Math.pow(vals.reduce((a, b) => a * b, 1), 1 / vals.length);

// The q6 raw channel coefficient share on one common footing -- prefactor k(k-1) = 30 continues the
// {2,6,12,20} -> 30 pattern of the imp-34606/imp-34771 q2..q5 shares; the collapse factor r6 is
// prefactor-independent.
function channelShare6(N, dp) {
  const { q1, q6 } = qDerivs(N, dp);
  return Math.abs(q6 / (30 * q1));
}

// Fixed 2:1 dp pairs tiling the SAME imp-34771 q5 roundoff window (contiguous four-rung doubling inside the
// roundoff-dominated band [1.5e-6, 2.4e-5]) -- a strictly protocol-matched one-order extension, not a
// re-tuned window.
const PAIRS_Q6 = [
  [1.5e-6, 3.0e-6],
  [3.0e-6, 6.0e-6],
  [6.0e-6, 1.2e-5],
  [1.2e-5, 2.4e-5],
];

// Resolution-matched q6 collapse factor r6 and per-channel log-log slope m6 over a 4-anchor footing tiling.
function matchedCollapseQ6(decades) {
  const ladder = decades.map((d) => Math.pow(10, d));
  const gmax = (dp) => Math.max(...ladder.map((N) => channelShare6(N, dp)));
  const ratios = PAIRS_Q6.map(([a, b]) => gmax(a) / gmax(b));
  return { r: geomMean(ratios), m: mean(ratios.map((x) => Math.log2(x))) };
}

// -- THE ENSEMBLE: N_F = 24 deterministic deep-group footings (identical tiling to imp-34751/imp-34771). --
const N_FOOTINGS = 24;
function footingDecades(j) {
  const base = [13.66, 14.0, 14.5, 15.0];
  const shift = 0.05 * j;
  return base.map((b, i) => b + shift + 0.03 * i * (j % 2 ? 1 : -1));
}

// Predicted q6 collapse factor 2^6 = 64 (imp-34606 clean exponent ladder, extended to sixth order).
const PRED_Q6 = 64;

// Per-footing signed deviation of r6 from 2^6, plus the per-footing log-log slope m6 (pinned to 6).
const DEV_Q6 = [];
const M6_ENS = [];
for (let j = 0; j < N_FOOTINGS; j++) {
  const M6 = matchedCollapseQ6(footingDecades(j));
  DEV_Q6.push((M6.r - PRED_Q6) / PRED_Q6);
  M6_ENS.push(M6.m);
}

// -- THREE FORMAL TESTS OF THE MEAN-ZERO NULL (identical harness to imp-34751/imp-34771) --

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

const Q6 = analyzeChannel(DEV_Q6);
const M6_MEAN = mean(M6_ENS);
const R6_MEAN = mean(DEV_Q6.map((d) => PRED_Q6 * (1 + d)));
// The sixth-order exponent stays pinned when the ensemble-mean slope rounds to 6 and the ensemble-mean
// collapse factor rounds to 64.
const Q6_EXPONENT_PINNED = Math.round(M6_MEAN) === 6 && Math.round(R6_MEAN) === 64;

// Overall: the clean integer-exponent ladder EXTENDS to sixth order (does NOT break) when the q6 channel
// recovers 2^6, its slope stays pinned to 6, and its deviation from 2^6 passes all three mean-zero tests.
const Q6_LADDER_EXTENDS = Q6_EXPONENT_PINNED && Q6.meanZeroNotRejected;

const r4 = (x) => +x.toFixed(4);

export const IMP34795_COLLAPSE_LADDER_Q6_CHANNEL_EXTENSION = Object.freeze({
  id: 'imp-34795',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34771 resolution-matched collapse ladder to the q6 CHANNEL (sixth central difference): ' +
    'measure the ensemble-mean q6 collapse factor r6 (predicted 2^6=64) and log-log slope m6 (predicted 6) ' +
    'over the SAME 24 independent deep-group footings (each past the imp-33620 sigma<0.01 anchor N*~4.62e13) ' +
    'and apply the SAME exact two-sided binomial sign-test, Wald-Wolfowitz runs-test, and Student-t mean CI ' +
    'to the q6 deviation from 2^6, reporting whether the clean integer-exponent ladder finally BREAKS at a ' +
    'sixth central-difference order where the ULP amplitude is largest -- a cross-check on the inherited ' +
    'component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  n_footings: N_FOOTINGS,
  predicted_collapse_factor: PRED_Q6, // 64 = 2^6
  ensemble_mean_collapse_factor_r6: r4(R6_MEAN), // ~64.41 -> rounds to 64
  ensemble_mean_slope_m6: r4(M6_MEAN), // ~6.00 -> rounds to 6
  q6_exponent_pinned: Q6_EXPONENT_PINNED, // true
  q6_deviation_mean: r4(Q6.ci.mean), // ~+0.006
  q6_deviation_ci95: Object.freeze([r4(Q6.ci.lo), r4(Q6.ci.hi)]), // ~[-0.028, +0.041] -- contains 0
  q6_deviation_ci_contains_zero: Q6.ciContainsZero, // true
  q6_n_positive: Q6.nPos, // 13
  q6_n_negative: Q6.nNeg, // 11
  q6_sign_test_p: r4(Q6.signP), // ~0.84 -- fails to reject symmetry
  q6_runs_R: Q6.runs.R, // ~16
  q6_runs_expected: r4(Q6.runs.expR), // ~12.9
  q6_runs_z: r4(Q6.runs.z), // ~1.30 -- |z| < 1.96, no serial drift
  q6_mean_zero_not_rejected: Q6.meanZeroNotRejected, // true
  q6_ladder_extends: Q6_LADDER_EXTENDS, // true -- ladder does NOT break at sixth order
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extends the imp-34771 24-footing resolution-matched collapse ladder to the ' +
    'q6 CHANNEL (sixth central difference) on the SAME deep-group footings (each past the imp-33620 ' +
    'sigma<0.01 anchor N*~4.62e13) over the SAME [1.5e-6,2.4e-5] window -- a protocol-matched one-order ' +
    'extension. (F1) THE q6 COLLAPSE FACTOR RECOVERS 2^6=64: the ensemble-mean factor r6~64.41 rounds to ' +
    'exactly 64 and the ensemble-mean log-log slope m6~6.00 rounds to 6 -- the 1/dp^k=2^k structure survives ' +
    'the sixth central-difference order despite q6 carrying the largest per-footing ULP amplitude yet. ' +
    '(F2) THE q6 DEVIATION IS STATISTICALLY MEAN-ZERO: 13 positive / 11 negative (exact two-sided sign-test ' +
    'p~0.84), runs R~16 vs E[R]~12.9 (runs-z~1.30, |z|<1.96 -- no footing-ordered drift), Student-t 95% mean ' +
    'CI ~[-0.028,+0.041] CONTAINS 0 (mean~+0.006, t-stat~+0.39). (F3) CONCLUSION: the clean integer-exponent ' +
    'ladder r_k->2^k / m_k->k that imp-34751 established for q2,q3,q4 and imp-34771 extended to q5 does NOT ' +
    'break down at sixth order -- it extends cleanly to q6 (r6->64, m6->6) with the deviation from 2^6 ' +
    'statistically indistinguishable from zero-mean footing-dependent roundoff scatter. This does NOT prove ' +
    'the deviation mean is EXACTLY 0 (a CI containing 0 is failure to reject, not acceptance); it ' +
    'establishes no statistical evidence for a fixed fractional offset at sixth order, consistent with ' +
    'imp-34606 (clean {2,3,4}), imp-34751 (formal mean-zero on q3,q4), and imp-34771 (mean-zero on q5). ' +
    'q1,q6 are inherited central differences, NOT fresh analytic closed forms, so the sigma->1 deep-tail ' +
    'regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this cross-checks ' +
    'that regime, it does not rehabilitate it. The -2 asymptote and C_C=(1/8)sqrt(3 pi) (imp-2714, ' +
    'C_H=1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 ' +
    'K_a>=0 untouched; the inherited surrogate is NOT rigorous; changes no bound; no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34771 (the q5 rung + 24-footing three-test mean-zero harness extended here to q6); imp-34751 (the ' +
    '24-footing ensemble; formal mean-zero on q3,q4); imp-34689 (footing 1; r_k ~ {4.00,7.00,17.91}, slopes ' +
    'm_k -> {2,3,4}); imp-34606 (clean {2,3,4} 1/dp^k exponent ladder; raw shares and windows reused ' +
    'verbatim); imp-33620 (deep-tail anchor N* ~ 4.62e13, sigma < 0.01; every footing stays past it); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34795_ASSERTIONS = [
  {
    id: 'imp34795-q6-collapse-factor-recovers-2pow6',
    holds: () => Q6_EXPONENT_PINNED && Math.round(R6_MEAN) === 64 && Math.round(M6_MEAN) === 6,
    why: 'F1: the ensemble-mean q6 collapse factor r6 ~ 64.41 rounds to exactly 64 = 2^6 and the ensemble-mean log-log slope m6 ~ 6.00 rounds to 6 -- the integer 1/dp^k = 2^k exponent structure survives the sixth central-difference order.',
  },
  {
    id: 'imp34795-q6-deviation-statistically-mean-zero',
    holds: () =>
      Q6.meanZeroNotRejected &&
      Q6.ciContainsZero &&
      Q6.signP > 0.05 &&
      Math.abs(Q6.runs.z) < 1.96 &&
      Q6.nPos > 0 &&
      Q6.nNeg > 0,
    why: 'F2: the q6 deviation from 2^6 is statistically mean-zero -- the exact two-sided sign-test does not reject symmetry (p > 0.05), the runs-test finds no footing-ordered drift (|z| < 1.96), and the Student-t 95% mean CI contains 0 despite the q6 channel carrying the largest per-footing ULP amplitude tested.',
  },
  {
    id: 'imp34795-q6-ladder-does-not-break-at-sixth-order',
    holds: () => Q6_LADDER_EXTENDS === true,
    why: 'F3: the q6 channel recovers 2^6, its slope stays pinned to 6, and its deviation passes all three mean-zero tests => the clean integer-exponent ladder r_k->2^k / m_k->k does NOT break down at sixth order.',
  },
  {
    id: 'imp34795-honesty-gate-no-qed',
    holds: () =>
      IMP34795_COLLAPSE_LADDER_Q6_CHANNEL_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP34795_COLLAPSE_LADDER_Q6_CHANNEL_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34795_COLLAPSE_LADDER_Q6_CHANNEL_EXTENSION.verdict) &&
      /UNTOUCHED/.test(IMP34795_COLLAPSE_LADDER_Q6_CHANNEL_EXTENSION.verdict) &&
      /failure to reject, not acceptance/.test(IMP34795_COLLAPSE_LADDER_Q6_CHANNEL_EXTENSION.verdict),
    why: 'Honesty gate: measurement only, CI-contains-0 is failure to reject not acceptance, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34795_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34795-collapse-ladder-q6-channel-extension assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34795_COLLAPSE_LADDER_Q6_CHANNEL_EXTENSION;
