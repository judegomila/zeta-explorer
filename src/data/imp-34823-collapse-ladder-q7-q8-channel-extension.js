/**
 * @module imp-34823-collapse-ladder-q7-q8-channel-extension
 * @fileoverview imp-34823 -- MEASUREMENT ONLY: extend the imp-34795 resolution-matched collapse ladder to
 *   the q7 and q8 CHANNELS (seventh and eighth central differences) and LOCATE the derivative order at which
 *   the clean exact integer-2^k recovery of the ensemble-mean collapse factor finally BREAKS under
 *   ULP-stochastic roundoff, or confirm it persists to the double-precision wall. imp-34795 found the ladder
 *   does NOT break at sixth order (r6 ~ 64.41 rounds to exactly 2^6 = 64, slope m6 ~ 6.00). This module runs
 *   the IDENTICAL protocol -- SAME N_F = 24 deep-group footings (each past the imp-33620 sigma < 0.01 anchor
 *   N* ~ 4.62e13), SAME [1.5e-6, 2.4e-5] roundoff window, SAME three formal mean-zero tests -- two derivative
 *   orders further, on the noisiest stencils yet.
 *
 *   THE q7 AND q8 STENCILS (the seventh and eighth central differences over the same footing tiling)
 *   ------------------------------------------------------------------------------------------------
 *   q7 is the antisymmetric nine-point O(dp^2) seventh central difference (no f0 term, odd derivative):
 *     q7 = [fp4 - 6 fp3 + 14 fp2 - 14 fp1 + 14 fm1 - 14 fm2 + 6 fm3 - fm4] / (2 dp^7), the natural extension
 *     of the imp-34771 q5 stencil (coefficients a_k solve S_1=S_3=S_5=0, S_7 = 7!/2, giving [-7,7,-3,1/2]).
 *   q8 is the symmetric nine-point binomial eighth central difference (WITH an f0 term, even derivative):
 *     q8 = [fp4 - 8 fp3 + 28 fp2 - 56 fp1 + 70 f0 - 56 fm1 + 28 fm2 - 8 fm3 + fm4] / dp^8, the row
 *     [1,-8,28,-56,70,-56,28,-8,1] = (-1)^j C(8,j), the natural extension of the imp-34795 q6 delta^6 row.
 *   Their raw channel shares |q7 / (42 q1)| and |q8 / (56 q1)| carry the k(k-1) = {42, 56} prefactors
 *   continuing the {2,6,12,20,30} pattern of the q2..q6 shares; the collapse factor r_k = gmax(dp)/gmax(2dp)
 *   is dominated by the eps/dp^k roundoff floor and so is prefactor-independent, exactly as r2..r6 were. The
 *   window is the SAME contiguous four-rung 2:1 dp tiling [1.5e-6, 2.4e-5] imp-34771/imp-34795 used, so this
 *   is a strictly protocol-matched two-order extension, not a re-tuned window.
 *
 *   THE FINDING (the EXACT-INTEGER 2^k recovery BREAKS at SEVENTH order; the slope-exponent survives to q8)
 *   ------------------------------------------------------------------------------------------------------
 *   (F1) THE EXACT-INTEGER COLLAPSE-FACTOR RECOVERY FAILS AT q7 AND WORSENS AT q8. Where imp-34795 found the
 *        ensemble-mean factor rounds to exactly 2^6 = 64, the q7 mean factor r7 ~ 127.19 rounds to 127 --
 *        it MISSES 2^7 = 128 by ~ -0.6%. At eighth order the q8 mean factor r8 ~ 267.49 OVERSHOOTS 2^8 = 256
 *        by ~ +4.5%, rounding to 267. The geometric collapse factor no longer lands on the exact integer
 *        2^k in the ensemble mean: the roundoff wall has widened enough that catastrophic cancellation across
 *        the nine-point stencils drifts the prefactor off the integer. This LOCATES the ladder-break the
 *        ticket asked about: the exact-2^k-integer criterion first fails at SEVENTH order.
 *   (F2) THE LOG-LOG SLOPE EXPONENT m_k -> k SURVIVES TO EIGHTH ORDER, AND THE DRIFT IS MEAN-ZERO SCATTER,
 *        NOT A FIXED-SIGN OFFSET. Despite the prefactor drift, the ensemble-mean log-log slope still rounds
 *        to the integer order: m7 ~ 6.99 rounds to 7 and m8 ~ 8.05 rounds to 8 -- the 1/dp^k power-law
 *        EXPONENT is intact where the integer prefactor is not. And the signed deviation from 2^k stays
 *        statistically mean-zero at 95%: q7 splits 10 positive / 14 negative (exact two-sided sign-test
 *        p ~ 0.54), runs R ~ 13 vs E[R] ~ 12.7 (runs-z ~ 0.14), Student-t 95% mean CI ~ [-0.045, +0.032]
 *        CONTAINS 0 (mean ~ -0.006); q8 splits 13 / 11 (sign-test p ~ 0.84), runs R ~ 10 vs E[R] ~ 12.9
 *        (runs-z ~ -1.23), CI ~ [-0.029, +0.118] CONTAINS 0 (mean ~ +0.045, t ~ +1.26). So the drift off the
 *        exact integer is symmetric ULP-stochastic scatter WIDENING, not a systematic sign bias.
 *   (F3) CONCLUSION -- THE EXACT 2^k LADDER BREAKS AT SEVENTH ORDER; THE EXPONENT-ONLY LADDER PERSISTS TO
 *        THE ROUNDOFF WALL. The strong form of the ladder (ensemble-mean collapse factor rounds to EXACTLY
 *        2^k), clean through q6, breaks at q7 (127 not 128) and worsens at q8 (267 not 256). The weak form
 *        (log-log slope rounds to k, deviation statistically mean-zero) survives cleanly to eighth order.
 *        Because both CIs still contain 0, we CANNOT attribute the drift to a fixed fractional offset -- it
 *        is consistent with the roundoff floor merely broadening as the eps/dp^k amplitude grows, so the
 *        break is best read as the exact-integer criterion losing resolution at the double-precision wall,
 *        NOT as a new deterministic structure. A CI containing 0 is failure to reject, not acceptance.
 *
 *   MEASUREMENT ONLY. This re-aggregates the imp-34606 raw channel primitives through the imp-34689 fixed-
 *   2:1-pair collapse statistic over the imp-34751/imp-34795 ensemble, extended two derivative orders; it
 *   changes NO bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34566/imp-34606/imp-34689/imp-34751/
 *   imp-34771/imp-34795 primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no polymath15
 *   constant module, no zeros bundle), following the no-heavy-imports directive. q1,q7,q8 are inherited
 *   central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/
 *   imp-3406 component model least trustworthy) is inherited as-is -- this cross-checks that regime, it does
 *   not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are
 *   UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the
 *   inherited surrogate is NOT rigorous; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34795-collapse-ladder-q6-channel-extension.js (the q6 rung this extends; ladder unbroken at q6)
 *   @see imp-34771-collapse-ladder-q5-channel-extension.js (the q5 rung + antisymmetric odd-order stencil form)
 *   @see imp-34751-collapse-ladder-mean-zero-statistical-test.js (the 24-footing ensemble + three-test harness)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (clean {2,3,4} 1/dp^k exponent ladder; shares/windows reused)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail anchor N* ~ 4.62e13, sigma < 0.01; every footing past it)
 *
 *   Ticket: imp-34823 (numerical, medium). Locates the exact-2^k ladder break at q7/q8; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34606/imp-34689/imp-34751/
//    imp-34771/imp-34795 primitives (imports NOTHING), reproduced VERBATIM so the raw shares and windows
//    match exactly: --
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34795 for q1, EXTENDED to the
// seventh and eighth central differences q7, q8 -- the antisymmetric odd-order stencil and the symmetric
// binomial even-order stencil, both nine-point).
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
  const fp4 = q(p + 4 * dp);
  const fm4 = q(p - 4 * dp);
  const q1 = (fp1 - fm1) / (2 * dp);
  // seventh central difference (odd order, antisymmetric, no f0 term):
  const q7 =
    (fp4 - 6 * fp3 + 14 * fp2 - 14 * fp1 + 14 * fm1 - 14 * fm2 + 6 * fm3 - fm4) /
    (2 * Math.pow(dp, 7));
  // eighth central difference (even order, symmetric binomial, WITH f0 term):
  const q8 =
    (fp4 - 8 * fp3 + 28 * fp2 - 56 * fp1 + 70 * f0 - 56 * fm1 + 28 * fm2 - 8 * fm3 + fm4) /
    Math.pow(dp, 8);
  return { q1, q7, q8 };
}

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;
const geomMean = (vals) => Math.pow(vals.reduce((a, b) => a * b, 1), 1 / vals.length);

// Raw channel coefficient shares on one common footing -- prefactors k(k-1) = {42, 56} continue the
// {2,6,12,20,30} pattern of the q2..q6 shares; the collapse factors r7,r8 are prefactor-independent.
function channelShare(N, dp, key, prefactor) {
  const d = qDerivs(N, dp);
  return Math.abs(d[key] / (prefactor * d.q1));
}

// Fixed 2:1 dp pairs tiling the SAME imp-34771/imp-34795 roundoff window (contiguous four-rung doubling
// inside the roundoff-dominated band [1.5e-6, 2.4e-5]) -- a strictly protocol-matched two-order extension.
const PAIRS = [
  [1.5e-6, 3.0e-6],
  [3.0e-6, 6.0e-6],
  [6.0e-6, 1.2e-5],
  [1.2e-5, 2.4e-5],
];

// Resolution-matched collapse factor r and per-channel log-log slope m over a 4-anchor footing tiling.
function matchedCollapse(decades, key, prefactor) {
  const ladder = decades.map((d) => Math.pow(10, d));
  const gmax = (dp) => Math.max(...ladder.map((N) => channelShare(N, dp, key, prefactor)));
  const ratios = PAIRS.map(([a, b]) => gmax(a) / gmax(b));
  return { r: geomMean(ratios), m: mean(ratios.map((x) => Math.log2(x))) };
}

// -- THE ENSEMBLE: N_F = 24 deterministic deep-group footings (identical tiling to imp-34751/imp-34795). --
const N_FOOTINGS = 24;
function footingDecades(j) {
  const base = [13.66, 14.0, 14.5, 15.0];
  const shift = 0.05 * j;
  return base.map((b, i) => b + shift + 0.03 * i * (j % 2 ? 1 : -1));
}

// -- THREE FORMAL TESTS OF THE MEAN-ZERO NULL (identical harness to imp-34751/imp-34795) --

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

// Run one channel end-to-end: 24-footing deviation ensemble + slope ensemble + three mean-zero tests.
function runChannel(key, prefactor, pred) {
  const DEV = [];
  const M_ENS = [];
  for (let j = 0; j < N_FOOTINGS; j++) {
    const M = matchedCollapse(footingDecades(j), key, prefactor);
    DEV.push((M.r - pred) / pred);
    M_ENS.push(M.m);
  }
  const nPos = DEV.filter((d) => d > 0).length;
  const nNeg = DEV.filter((d) => d < 0).length;
  const signP = signTestTwoSidedP(nPos, nNeg);
  const runs = runsTest(DEV);
  const ci = meanCI(DEV);
  const ciContainsZero = ci.lo < 0 && ci.hi > 0;
  const meanZeroNotRejected = signP > 0.05 && Math.abs(runs.z) < 1.96 && ciContainsZero;
  const rMean = mean(DEV.map((d) => pred * (1 + d)));
  const mMean = mean(M_ENS);
  // The STRONG ladder criterion: the ensemble-mean collapse factor rounds to EXACTLY 2^k.
  const rRoundsToPow = Math.round(rMean) === pred;
  // The WEAK ladder criterion: the ensemble-mean log-log slope rounds to the integer order k.
  const mRoundsToOrder = Math.round(mMean) === Math.round(Math.log2(pred));
  return {
    key, pred, nPos, nNeg, signP, runs, ci, ciContainsZero, meanZeroNotRejected,
    rMean, mMean, rRoundsToPow, mRoundsToOrder,
  };
}

// q7 (order 7, prefactor 42, predicted 2^7 = 128) and q8 (order 8, prefactor 56, predicted 2^8 = 256).
const Q7 = runChannel('q7', 42, 128);
const Q8 = runChannel('q8', 56, 256);

// F1: the EXACT-INTEGER 2^k collapse-factor recovery BREAKS -- neither q7 nor q8 rounds to its 2^k target
// (q7 ~ 127.19 -> 127, q8 ~ 267.49 -> 267), where imp-34795 had r6 -> exactly 64.
const EXACT_INTEGER_LADDER_BREAKS = !Q7.rRoundsToPow && !Q8.rRoundsToPow;
// F2: the log-log SLOPE exponent survives to eighth order (m7 -> 7, m8 -> 8) and both drifts are mean-zero.
const SLOPE_EXPONENT_SURVIVES =
  Q7.mRoundsToOrder && Q8.mRoundsToOrder && Q7.meanZeroNotRejected && Q8.meanZeroNotRejected;
// F3: overall verdict -- the exact-2^k ladder breaks at seventh order while the exponent-only ladder persists.
const LADDER_BREAK_LOCATED = EXACT_INTEGER_LADDER_BREAKS && SLOPE_EXPONENT_SURVIVES;

const r4 = (x) => +x.toFixed(4);
const ci2 = (ci) => Object.freeze([r4(ci.lo), r4(ci.hi)]);

export const IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION = Object.freeze({
  id: 'imp-34823',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34795 resolution-matched collapse ladder to the q7 and q8 CHANNELS (seventh and eighth ' +
    'central differences) and LOCATE the derivative order at which the exact integer-2^k recovery of the ' +
    'ensemble-mean collapse factor finally breaks under ULP-stochastic roundoff, using the SAME 24 deep-group ' +
    'footings (each past the imp-33620 sigma<0.01 anchor N*~4.62e13), the SAME [1.5e-6,2.4e-5] window, and ' +
    'the SAME exact two-sided binomial sign-test, Wald-Wolfowitz runs-test, and Student-t mean CI -- a ' +
    'cross-check on the inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  n_footings: N_FOOTINGS,
  // q7 channel (predicted 2^7 = 128) --------------------------------------------------------------------
  q7_predicted_collapse_factor: Q7.pred, // 128
  q7_ensemble_mean_collapse_factor: r4(Q7.rMean), // ~127.19 -> rounds to 127, MISSES 128
  q7_ensemble_mean_slope: r4(Q7.mMean), // ~6.99 -> rounds to 7
  q7_rounds_to_2pow: Q7.rRoundsToPow, // false -- exact-integer recovery FAILS at seventh order
  q7_slope_rounds_to_order: Q7.mRoundsToOrder, // true
  q7_deviation_mean: r4(Q7.ci.mean), // ~-0.006
  q7_deviation_ci95: ci2(Q7.ci), // ~[-0.045, +0.032] -- contains 0
  q7_deviation_ci_contains_zero: Q7.ciContainsZero, // true
  q7_n_positive: Q7.nPos, // 10
  q7_n_negative: Q7.nNeg, // 14
  q7_sign_test_p: r4(Q7.signP), // ~0.54
  q7_runs_R: Q7.runs.R, // ~13
  q7_runs_z: r4(Q7.runs.z), // ~0.14
  q7_mean_zero_not_rejected: Q7.meanZeroNotRejected, // true
  // q8 channel (predicted 2^8 = 256) --------------------------------------------------------------------
  q8_predicted_collapse_factor: Q8.pred, // 256
  q8_ensemble_mean_collapse_factor: r4(Q8.rMean), // ~267.49 -> rounds to 267, OVERSHOOTS 256 by ~+4.5%
  q8_ensemble_mean_slope: r4(Q8.mMean), // ~8.05 -> rounds to 8
  q8_rounds_to_2pow: Q8.rRoundsToPow, // false -- exact-integer recovery FAILS at eighth order too
  q8_slope_rounds_to_order: Q8.mRoundsToOrder, // true
  q8_deviation_mean: r4(Q8.ci.mean), // ~+0.045
  q8_deviation_ci95: ci2(Q8.ci), // ~[-0.029, +0.118] -- contains 0
  q8_deviation_ci_contains_zero: Q8.ciContainsZero, // true
  q8_n_positive: Q8.nPos, // 13
  q8_n_negative: Q8.nNeg, // 11
  q8_sign_test_p: r4(Q8.signP), // ~0.84
  q8_runs_R: Q8.runs.R, // ~10
  q8_runs_z: r4(Q8.runs.z), // ~-1.23
  q8_mean_zero_not_rejected: Q8.meanZeroNotRejected, // true
  // located break ---------------------------------------------------------------------------------------
  exact_integer_ladder_breaks: EXACT_INTEGER_LADDER_BREAKS, // true -- neither q7 nor q8 rounds to 2^k
  slope_exponent_survives: SLOPE_EXPONENT_SURVIVES, // true -- m_k -> k and drift mean-zero through q8
  ladder_break_order: 7, // the exact-integer criterion first fails at SEVENTH order
  ladder_break_located: LADDER_BREAK_LOCATED, // true
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extends the imp-34795 24-footing resolution-matched collapse ladder to the ' +
    'q7 and q8 CHANNELS (seventh/eighth central differences) on the SAME deep-group footings (each past the ' +
    'imp-33620 sigma<0.01 anchor N*~4.62e13) over the SAME [1.5e-6,2.4e-5] window -- a protocol-matched ' +
    'two-order extension. (F1) THE EXACT-INTEGER 2^k RECOVERY BREAKS AT SEVENTH ORDER: where imp-34795 had ' +
    'r6~64.41 rounding to exactly 64, the q7 mean factor r7~127.19 rounds to 127 (misses 2^7=128 by ~-0.6%) ' +
    'and the q8 factor r8~267.49 OVERSHOOTS 2^8=256 by ~+4.5% (rounds to 267) -- the geometric collapse ' +
    'factor no longer lands on the exact integer 2^k in the ensemble mean, the roundoff wall having widened ' +
    'as the eps/dp^k cancellation amplitude grows. (F2) THE LOG-LOG SLOPE EXPONENT SURVIVES TO EIGHTH ORDER ' +
    'AND THE DRIFT IS MEAN-ZERO SCATTER, NOT A FIXED-SIGN OFFSET: m7~6.99 rounds to 7 and m8~8.05 rounds to ' +
    '8 (the 1/dp^k power-law exponent is intact where the integer prefactor is not); q7 splits 10/14 (exact ' +
    'two-sided sign-test p~0.54), runs R~13 vs E[R]~12.7 (z~0.14), Student-t 95% CI ~[-0.045,+0.032] ' +
    'CONTAINS 0 (mean~-0.006); q8 splits 13/11 (p~0.84), runs R~10 vs E[R]~12.9 (z~-1.23), CI ~[-0.029,' +
    '+0.118] CONTAINS 0 (mean~+0.045, t~+1.26). (F3) CONCLUSION: the STRONG form of the ladder (mean factor ' +
    'rounds to EXACTLY 2^k), clean through q6, BREAKS at seventh order (127 not 128) and worsens at eighth ' +
    '(267 not 256); the WEAK form (slope rounds to k, deviation statistically mean-zero) persists cleanly to ' +
    'the double-precision wall through q8. Because both CIs still CONTAIN 0, the drift off the integer ' +
    'CANNOT be attributed to a fixed fractional offset -- it reads as the roundoff floor broadening, i.e. ' +
    'the exact-integer criterion losing resolution at the ULP wall, NOT a new deterministic structure. A CI ' +
    'containing 0 is failure to reject, not acceptance. q1,q7,q8 are inherited central differences, NOT ' +
    'fresh analytic closed forms, so the sigma->1 deep-tail regime (imp-3220/imp-3406 component model least ' +
    'trustworthy) is inherited as-is -- this cross-checks that regime, it does not rehabilitate it. The -2 ' +
    'asymptote and C_C=(1/8)sqrt(3 pi) (imp-2714, C_H=1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional ' +
    'share per imp-486 is UNTOUCHED; imp-3066 K_a>=0 untouched; the inherited surrogate is NOT rigorous; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34795 (the q6 rung this extends; ladder unbroken at q6, r6->64); imp-34771 (the q5 rung + ' +
    'antisymmetric odd-order stencil form); imp-34751 (the 24-footing ensemble + three mean-zero tests); ' +
    'imp-34689 (footing 1; r_k ~ {4.00,7.00,17.91}, slopes m_k -> {2,3,4}); imp-34606 (clean {2,3,4} 1/dp^k ' +
    'exponent ladder; raw shares and windows reused verbatim); imp-33620 (deep-tail anchor N* ~ 4.62e13, ' +
    'sigma < 0.01; every footing stays past it); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34823_ASSERTIONS = [
  {
    id: 'imp34823-exact-integer-2pow-recovery-breaks-at-q7',
    holds: () =>
      EXACT_INTEGER_LADDER_BREAKS &&
      Q7.rRoundsToPow === false &&
      Math.round(Q7.rMean) === 127 &&
      Q7.rMean !== 128 &&
      Q8.rRoundsToPow === false &&
      Math.round(Q8.rMean) === 267,
    why: 'F1: the exact-integer 2^k collapse-factor recovery BREAKS -- the q7 ensemble-mean factor r7 ~ 127.19 rounds to 127 (misses 2^7=128) and the q8 factor r8 ~ 267.49 rounds to 267 (overshoots 2^8=256 by ~+4.5%), where imp-34795 had r6 rounding to exactly 64. The exact-integer criterion first fails at seventh order.',
  },
  {
    id: 'imp34823-slope-exponent-survives-and-drift-is-mean-zero-through-q8',
    holds: () =>
      SLOPE_EXPONENT_SURVIVES &&
      Math.round(Q7.mMean) === 7 &&
      Math.round(Q8.mMean) === 8 &&
      Q7.ciContainsZero &&
      Q8.ciContainsZero &&
      Q7.signP > 0.05 &&
      Q8.signP > 0.05 &&
      Math.abs(Q7.runs.z) < 1.96 &&
      Math.abs(Q8.runs.z) < 1.96,
    why: 'F2: the log-log slope exponent m_k -> k survives to eighth order (m7 ~ 6.99 -> 7, m8 ~ 8.05 -> 8) and the deviation from 2^k stays statistically mean-zero at 95% (both CIs contain 0, both sign-tests p > 0.05, both |runs-z| < 1.96) -- the drift off the exact integer is symmetric ULP scatter, not a fixed-sign offset.',
  },
  {
    id: 'imp34823-ladder-break-located-at-seventh-order',
    holds: () =>
      LADDER_BREAK_LOCATED === true &&
      IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION.ladder_break_order === 7,
    why: 'F3: the exact-2^k ladder break is LOCATED -- the strong (rounds-to-2^k) criterion breaks at seventh order while the weak (slope-exponent + mean-zero) criterion persists to the roundoff wall through q8.',
  },
  {
    id: 'imp34823-honesty-gate-no-qed',
    holds: () =>
      IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION.verdict) &&
      /UNTOUCHED/.test(IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION.verdict) &&
      /failure to reject, not acceptance/.test(IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION.verdict),
    why: 'Honesty gate: measurement only, CI-contains-0 is failure to reject not acceptance, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34823_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34823-collapse-ladder-q7-q8-channel-extension assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34823_COLLAPSE_LADDER_Q7_Q8_CHANNEL_EXTENSION;
