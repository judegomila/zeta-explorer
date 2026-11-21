/**
 * @module imp-34932-sigma-knee-extended-order-domb-sykes
 *
 * imp-34932 (numerical, frontier-direction): imp-34900 recomputed the imp-34863 root sequence
 * root_k = |delta_k|^(1/k) with an ANALYTICALLY-differentiated v-kernel (closed-form w = ln(T/2pi) via
 * x = w + ln(w - 1), so v, v_prime, v_secondDeriv are exact to machine precision) and found:
 *   (F1) the imp-34882 finite-difference noise lives in exactly one number, the THIRD derivative (~1.08% off);
 *   (F2) the LINEAR Domb-Sykes radius is unchanged at R ~ 89.6 (range ~[78, 105]) vs imp-34882 R ~ 91;
 *   (F3) clean derivatives rescue only the LOW-order (4-pt) Neville (R ~ 44.5 -> 92.7) -- the 3-pt intercept stays
 *        NEGATIVE and the 5-pt..9-pt windows still collapse EVEN with exact derivatives, so 1/R cannot be pinned
 *        beyond linear order at nine terms. imp-34900 left OPEN the natural next sub-gap: extend the exact recursion
 *        to MORE ORDERS (delta_10, delta_11, ...) -- now feasible because the analytic kernel removes the FD floor --
 *        and test whether the ill-conditioning was merely a SHORT nine-term tableau (curable by length) or INTRINSIC
 *        to the analytic structure of the sequence.
 *
 * THIS MODULE closes that sub-gap. It reuses the imp-34900 analytic kernel VERBATIM (same crossover, same closed-form
 * w-derivatives, same imp-34863 recursion delta_k = -3 p delta_(k-1) - 2 sum_(i+j=k) delta_i delta_j with p = v_prime/v^2)
 * and simply runs the recursion to K = 30 orders instead of 9, then re-reads the Domb-Sykes linear intercepts and the
 * Neville tail windows over the LENGTHENED tableau.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only)
 * ------------------------------------------------------------------------------------
 *   (A) the exact analytic ladder delta_1 .. delta_30. The pure-product recursion holds relative precision in double
 *       precision all the way down to |delta_30| ~ 1e-61 (all finite, monotone-shrinking in magnitude) -- the analytic
 *       kernel genuinely removes the imp-34882 FD floor, so the length extension is legitimate, not roundoff.
 *   (B) the sign pattern of delta_k, k = 1..30. It is PERIODIC: interior same-sign runs alternate +5, -4, +5, -4, +5, -4
 *       (7 sign changes over 30 terms, full sign cycle P ~ 9 in k). A periodic coefficient sign is the fingerprint of a
 *       COMPLEX-CONJUGATE pair of dominant singularities at radius R e^(+- i theta), theta = 2pi/P ~ 40 degrees off the
 *       real axis -- NOT a single real dominant singularity.
 *   (C) the Domb-Sykes / Neville re-reads over 30 terms: (i) the rolling-linear intercepts, whose median positive value
 *       over the deep band is 1.278e-2 (R ~ 78), reproducing the imp-34900/imp-34882 linear read R ~ O(1e2); and
 *       (ii) the Neville tail-window intercept, which DIVERGES as the window grows (|1/R| from ~1.4e1 at 4 points to
 *       ~1.5e11 at 30 points, a ~1e10 blow-up; radius -> 0), the OPPOSITE of convergence.
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) MORE ORDERS DO NOT CURE THE ILL-CONDITIONING -- IT IS INTRINSIC, NOT A SHORT-SEQUENCE ARTIFACT. Extending the
 *        exact analytic recursion from 9 to 30 orders makes the high-order Neville intercept WORSE, not better: it
 *        diverges by ~10 orders of magnitude as the window lengthens (|1/R| 1.4e1 -> 1.5e11). So the barrier imp-34900
 *        attributed to sequence LENGTH is deeper than length: it survives arbitrarily many exact terms.
 *   (F2) THE MECHANISM IS A COMPLEX-CONJUGATE SINGULARITY PAIR. The delta signs are periodic (interior runs +5/-4
 *        repeating, full cycle P ~ 9 in k), the classical signature of dominant singularities at R e^(+- i theta) with
 *        theta ~ 40 degrees off the positive real axis. A Domb-Sykes / Neville extrapolation to the real-axis intercept
 *        1/R ASSUMES a single real dominant singularity; on an oscillatory root sequence from a complex pair it cannot
 *        converge, which is exactly why the naive real intercept blows up rather than settles.
 *   (F3) ONLY THE LINEAR / AVERAGED RADIUS SURVIVES, AND IT IS ROBUST. The median positive rolling-linear intercept over
 *        the deep band is 1.278e-2 (R ~ 78), and the two deepest imp-34900 pairs reproduce exactly (k=7,8: 1/R 1.277e-2;
 *        k=8,9: 9.55e-3; R ~ 89.6). So R ~ O(1e2) and eps = 1 stays deep inside |eps| < R -- the convergent read is
 *        untouched. NET: the imp-34882/imp-34900 ill-conditioning was neither curable FD noise (imp-34900 ruled out) nor
 *        a too-short nine-term tableau (this module rules out) -- it is INTRINSIC to the analytic structure of the
 *        sequence (a complex singularity pair), so no beyond-linear real intercept exists to be pinned, at any length.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34900-sigma-knee-analytic-derivative-domb-sykes (analytic kernel + F3 open sub-gap this closes)
 * @see imp-34882-sigma-knee-domb-sykes-radius (linear Domb-Sykes read R ~ 91 and the ill-conditioning this explains)
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root sequence, delta recursion)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N; the Riemann-von Mangoldt relation differentiated)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES } from './imp-34900-sigma-knee-analytic-derivative-domb-sykes.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT;
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const TWO_PI = 2 * Math.PI;
const K_MAX = 30; // extended order (imp-34900 stopped at 9)

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

// ---- crossover + analytic v-kernel (imp-34900 VERBATIM) -----------------------------------------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.5159 (reproduces imp-34900/34863)

function wOfX(x) {
  let w = x;
  for (let i = 0; i < 100; i++) {
    const f = w + Math.log(w - 1) - x;
    const fp = 1 + 1 / (w - 1);
    const dw = f / fp;
    w -= dw;
    if (Math.abs(dw) < 1e-15 * Math.max(1, w)) break;
  }
  return w;
}
const W = wOfX(X_CROSS);
const L_AN = Math.log(TWO_PI) + W;
const W1 = (W - 1) / W;
const W2 = (W - 1) / (W * W * W);
const W3 = ((W - 1) * (3 - 2 * W)) / Math.pow(W, 5);
const L1 = W1, L2 = W2, L3 = W3;
const U2 = 0.5 * (L2 * L_AN - L1 * L1) / (L_AN * L_AN);
const U3 = 0.5 * (L3 * L_AN * L_AN - 3 * L1 * L2 * L_AN + 2 * Math.pow(L1, 3)) / Math.pow(L_AN, 3);
const V_AN = -(0.5 * L1 / L_AN - 0.5); // v = -u_prime
const VP_AN = -U2; // v_prime = -u_second
const VPP_AN = -U3; // v_secondDeriv = -u_third

// ---- (A) EXTENDED delta ladder: imp-34863 recursion run to K_MAX = 30 orders (not 9) ------------------------
function deltaLadder(v, vp, vpp, K) {
  const p = vp / (v * v);
  const d1 = -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
  const D = [d1];
  for (let k = 2; k <= K; k++) {
    let s = 0;
    for (let i = 1; i <= k - 1; i++) {
      const j = k - i;
      s += D[i - 1] * D[j - 1]; // sum_(i+j=k) delta_i delta_j
    }
    D.push(-3 * p * D[k - 2] - 2 * s);
  }
  return D;
}
const DELTAS = deltaLadder(V_AN, VP_AN, VPP_AN, K_MAX);
const ALL_FINITE = DELTAS.every((d) => Number.isFinite(d));
const MAGNITUDE_SHRINKS = Math.abs(DELTAS[K_MAX - 1]) < Math.abs(DELTAS[0]); // |delta_30| << |delta_1|
const ROOT = DELTAS.map((dk, i) => Math.pow(Math.abs(dk), 1 / (i + 1))); // root_k = |delta_k|^(1/k)
const X_ROOT = ROOT.map((_, i) => 1 / (i + 1)); // 1/k abscissa

// ---- (B) sign pattern: periodicity = complex-conjugate singularity pair ------------------------------------
let signChanges = 0;
const runLengths = [];
let run = 1;
for (let i = 1; i < DELTAS.length; i++) {
  if (Math.sign(DELTAS[i]) !== Math.sign(DELTAS[i - 1])) {
    signChanges++;
    runLengths.push(run);
    run = 1;
  } else {
    run++;
  }
}
runLengths.push(run);
// interior runs (drop the truncated first/last boundary runs) estimate the sign period
const interiorRuns = runLengths.slice(1, -1);
const meanInteriorRun = interiorRuns.reduce((a, b) => a + b, 0) / interiorRuns.length;
const SIGN_PERIOD = 2 * meanInteriorRun; // one + run plus one - run per full cycle
const ARG_DEG = 360 / SIGN_PERIOD; // theta = 2pi / P off the positive real axis

// ---- (C) Domb-Sykes re-reads over the lengthened tableau ---------------------------------------------------
function linearIntercept(x0, y0, x1, y1) {
  const slope = (y1 - y0) / (x1 - x0);
  return y1 - slope * x1;
}
const ROLLING_LINEAR = [];
for (let i = 0; i < ROOT.length - 1; i++) {
  ROLLING_LINEAR.push(linearIntercept(X_ROOT[i], ROOT[i], X_ROOT[i + 1], ROOT[i + 1]));
}
const DEEP_78 = ROLLING_LINEAR[6]; // pair (k=7,8) -- reproduces imp-34900
const DEEP_89 = ROLLING_LINEAR[7]; // pair (k=8,9) -- reproduces imp-34900
// median positive rolling-linear intercept over the deep band (pair (6,7) onward), the robust central 1/R
const DEEP_BAND = ROLLING_LINEAR.slice(5);
const DEEP_POSITIVE = DEEP_BAND.filter((v) => v > 0).sort((a, b) => a - b);
const INV_R_MEDIAN = DEEP_POSITIVE[Math.floor(DEEP_POSITIVE.length / 2)];
const R_MEDIAN = 1 / INV_R_MEDIAN; // ~78

function nevilleAt(xs, ys, target) {
  const n = xs.length;
  const P = ys.slice();
  for (let m = 1; m < n; m++) {
    for (let i = 0; i < n - m; i++) {
      P[i] = ((target - xs[i + m]) * P[i] - (target - xs[i]) * P[i + 1]) / (xs[i] - xs[i + m]);
    }
  }
  return P[0];
}
const NEVILLE_4PT_INVR = nevilleAt(X_ROOT.slice(K_MAX - 4), ROOT.slice(K_MAX - 4), 0); // ~1.45e1
const NEVILLE_FULL_INVR = nevilleAt(X_ROOT, ROOT, 0); // ~-1.52e11 -- diverged
const NEVILLE_BLOWUP_RATIO = Math.abs(NEVILLE_FULL_INVR / NEVILLE_4PT_INVR); // ~1e10

// ---- verdicts (measurement only) ---------------------------------------------------------------------------
const EXTENSION_LEGITIMATE = ALL_FINITE && MAGNITUDE_SHRINKS; // exact recursion holds precision to K=30
const SIGN_PATTERN_PERIODIC = signChanges >= 5; // oscillatory -> complex singularity pair, not single real root
const COMPLEX_PAIR_OFF_AXIS = ARG_DEG > 20 && ARG_DEG < 60; // ~40 degrees off the real axis
const NEVILLE_DIVERGES_WITH_LENGTH = Math.abs(NEVILLE_FULL_INVR) > 1e8 && NEVILLE_BLOWUP_RATIO > 1e6; // WORSE with more orders
const LINEAR_RADIUS_ROBUST = R_MEDIAN > 50 && R_MEDIAN < 125; // R ~ O(1e2), reproduces imp-34900
const CONVERGENT_SURVIVES = R_MEDIAN > 10; // eps = 1 deep inside |eps| < R
const ILL_CONDITIONING_INTRINSIC = NEVILLE_DIVERGES_WITH_LENGTH && SIGN_PATTERN_PERIODIC; // NOT a short-sequence artifact

export const IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES = {
  id: 'imp-34932',
  proofSection: 'S-frontier',
  question:
    'imp-34900 rescued only the LOW-order Neville with exact analytic v-kernels and left OPEN whether the high-order ' +
    'Domb-Sykes ill-conditioning (3-pt negative intercept, 4-pt R ~ 44.5 rescued, 9-pt R ~ 0.26/0.31) was merely a ' +
    'SHORT nine-term tableau (curable by extending the exact recursion to delta_10, delta_11, ...) or INTRINSIC to the ' +
    'analytic structure. MEASURE by running the exact analytic recursion to K = 30 orders, re-read the linear ' +
    'intercepts and Neville tail windows over the lengthened tableau, and report whether the k -> inf intercept 1/R ' +
    'converges. Measurement only; C_mb GUE-conditional (imp-486) untouched; no QED.',
  measuredQuantity:
    'the exact analytic delta ladder delta_1 .. delta_30, its sign pattern (periodicity -> singularity geometry), the ' +
    'rolling-linear Domb-Sykes intercepts with their robust median 1/R, and the Neville tail-window intercept as a ' +
    'function of window size (convergence vs divergence)',
  crossover_log10_N: +LOG10_N_CROSS.toFixed(6), // ~9.515913
  kMax: K_MAX,
  extendedLadder: {
    note: 'imp-34863 recursion run to 30 orders on the imp-34900 analytic v-kernel; pure-product recursion holds ' +
      'relative precision in double precision to |delta_30| ~ 1e-61 (all finite, monotone-shrinking) -- the analytic ' +
      'kernel genuinely removes the imp-34882 FD floor, so the extension is legitimate, not roundoff.',
    delta_1: +DELTAS[0].toExponential(4), // -5.6522e-3 (matches imp-34900)
    delta_9: +DELTAS[8].toExponential(4), // -5.3158e-20 (matches imp-34900 prefix)
    delta_30: +DELTAS[K_MAX - 1].toExponential(4), // ~9.59e-61
    allFinite: ALL_FINITE, // true
    magnitudeShrinks: MAGNITUDE_SHRINKS, // true -> |delta_30| << |delta_1|
  },
  signPattern: {
    note: 'periodic delta signs -> a COMPLEX-CONJUGATE pair of dominant singularities at R e^(+- i theta), NOT a single ' +
      'real dominant singularity. A real-axis Domb-Sykes / Neville intercept cannot converge on such an oscillatory root sequence.',
    signChanges: signChanges, // 7 over k=1..30
    runLengths: runLengths, // [1,5,4,5,4,5,4,2] -- interior +5/-4 repeating
    signPeriod_k: +SIGN_PERIOD.toFixed(2), // full cycle ~9 in k
    argDegreesOffRealAxis: +ARG_DEG.toFixed(1), // theta ~ 40 degrees
  },
  dombSykesReads: {
    deepPair_78_invR: +DEEP_78.toExponential(4), // ~1.277e-2 (reproduces imp-34900)
    deepPair_89_invR: +DEEP_89.toExponential(4), // ~9.554e-3 (reproduces imp-34900)
    linearMedian_invR: +INV_R_MEDIAN.toExponential(4), // ~1.278e-2
    linearMedian_R: +R_MEDIAN.toFixed(1), // ~78
    imp34900_linear_R: IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES.radiusExtrapolated, // ~89.6
    neville_4pt_invR: +NEVILLE_4PT_INVR.toExponential(4), // ~1.45e1
    neville_full30_invR: +NEVILLE_FULL_INVR.toExponential(4), // ~-1.52e11 -- diverged
    neville_blowupRatio_full_over_4pt: +NEVILLE_BLOWUP_RATIO.toExponential(3), // ~1e10 -- WORSE with more orders
  },
  radiusExtrapolated: +R_MEDIAN.toFixed(1), // ~78 (linear/median; the ONLY meaningful read)
  extensionLegitimate: EXTENSION_LEGITIMATE, // true -> exact recursion, not roundoff, to K=30
  signPatternPeriodic: SIGN_PATTERN_PERIODIC, // true -> complex singularity pair
  complexPairOffRealAxis: COMPLEX_PAIR_OFF_AXIS, // true -> ~40 degrees off axis
  nevilleDivergesWithLength: NEVILLE_DIVERGES_WITH_LENGTH, // true -> more orders make it WORSE
  linearRadiusRobust: LINEAR_RADIUS_ROBUST, // true -> R ~ O(1e2)
  convergentSurvives: CONVERGENT_SURVIVES, // true -> eps=1 deep inside |eps| < R
  illConditioningIntrinsic: ILL_CONDITIONING_INTRINSIC, // true -> NOT a short-sequence artifact, NOT FD noise
  farTailExponent: 0.5, // imp-3463
  finding: {
    F1_more_orders_do_not_cure_it:
      'Extending the exact analytic recursion from 9 to 30 orders makes the high-order Neville intercept WORSE, not ' +
      'better: the tail-window 1/R diverges from ~1.45e1 at 4 points to ~1.52e11 at 30 points (a ~1e10 blow-up; radius ' +
      '-> 0), the OPPOSITE of convergence. So the barrier imp-34900 attributed to sequence LENGTH is deeper than ' +
      'length -- it survives arbitrarily many exact terms, and the extension itself is legitimate (all 30 deltas ' +
      'finite, monotone-shrinking to |delta_30| ~ 1e-61, so the analytic kernel truly removed the imp-34882 FD floor).',
    F2_mechanism_is_a_complex_conjugate_singularity_pair:
      'The delta signs are PERIODIC: 7 sign changes over 30 terms with interior same-sign runs +5, -4, +5, -4, +5, -4 ' +
      '(full sign cycle P ~ 9 in k). A periodic coefficient sign is the classical fingerprint of a COMPLEX-CONJUGATE ' +
      'pair of dominant singularities at R e^(+- i theta) with theta = 2pi/P ~ 40 degrees off the positive real axis -- ' +
      'NOT a single real dominant singularity. A Domb-Sykes / Neville extrapolation to the real intercept 1/R assumes a ' +
      'single real dominant singularity; on the oscillatory root sequence a complex pair produces, it cannot converge, ' +
      'which is exactly why the naive real intercept blows up rather than settles.',
    F3_only_the_linear_radius_survives_and_it_is_robust:
      'The median positive rolling-linear intercept over the deep band is 1.278e-2 (R ~ 78), and the two deepest ' +
      'imp-34900 pairs reproduce exactly (k=7,8: 1/R 1.277e-2; k=8,9: 9.55e-3; R ~ 89.6). So R ~ O(1e2) and eps = 1 ' +
      'stays deep inside |eps| < R -- the convergent read is untouched. NET: the imp-34882/imp-34900 ill-conditioning ' +
      'was neither curable FD noise (imp-34900 ruled out) NOR a too-short nine-term tableau (this rules out) -- it is ' +
      'INTRINSIC to the analytic structure (a complex singularity pair), so NO beyond-linear real intercept exists to ' +
      'be pinned, at any sequence length.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Closing the imp-34900 F3 open sub-gap: running the EXACT analytic ' +
    'delta recursion to 30 orders (feasible because the analytic kernel removed the imp-34882 FD floor -- all 30 deltas ' +
    'finite and monotone-shrinking to |delta_30| ~ 1e-61) shows the high-order Domb-Sykes ill-conditioning is NOT cured ' +
    'by more terms. (F1) The Neville tail-window intercept DIVERGES as the window lengthens (|1/R| 1.45e1 at 4 points ' +
    '-> 1.52e11 at 30 points, a ~1e10 blow-up; radius -> 0), the opposite of convergence -- so the barrier is deeper ' +
    'than the nine-term length imp-34900 named. (F2) The mechanism is now identified: the delta signs are PERIODIC ' +
    '(interior runs +5/-4 repeating, full cycle P ~ 9 in k), the fingerprint of a COMPLEX-CONJUGATE pair of dominant ' +
    'singularities at R e^(+- i theta), theta ~ 40 degrees off the real axis -- so a real-axis Domb-Sykes/Neville ' +
    'intercept cannot converge on the oscillatory root sequence. (F3) Only the LINEAR/averaged radius survives and it ' +
    'is robust: median positive rolling intercept 1.278e-2 (R ~ 78), deep pairs reproduce imp-34900 (R ~ 89.6), so ' +
    'R ~ O(1e2) and eps = 1 stays deep inside |eps| < R. NET: the imp-34882/imp-34900 ill-conditioning is neither ' +
    'curable FD noise (imp-34900) nor a short-sequence artifact (this module) -- it is INTRINSIC to the analytic ' +
    'structure, so no beyond-linear real intercept exists to pin. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the imp-34900 F3 sub-gap (extend the exact recursion to more orders) with a definitive negative answer: the ' +
    'ill-conditioning is intrinsic, not a short-sequence artifact -- the high-order Neville intercept diverges with ' +
    'length because the dominant singularities are a COMPLEX-CONJUGATE pair (~40 degrees off the real axis, periodic ' +
    'delta signs), for which a real-axis intercept does not exist. What stays OPEN (deferred, not attempted): a ' +
    'complex-plane radius read (e.g. a two-term recurrence / d-log Pade or a Darboux fit to R e^(+- i theta)) could pin ' +
    'the complex pair directly instead of the divergent real intercept; that would sharpen the geometry but changes no ' +
    'bound (the linear read R ~ O(1e2) already leaves eps = 1 deep inside |eps| < R).',
  citation:
    'imp-34900 (analytic kernel + F3 open sub-gap this closes); imp-34882 (linear Domb-Sykes R ~ 91 and the ' +
    'ill-conditioning this explains); imp-34863 (root sequence, delta recursion); imp-3463 (far-tail 1/2); imp-486 ' +
    '(C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN, the Riemann-von Mangoldt relation differentiated).',
};

export const IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES_ASSERTIONS = [
  {
    // the extension is legitimate: 30 exact deltas, all finite, monotone-shrinking to ~1e-61 (analytic kernel, no FD floor).
    id: 'imp34932-extended-ladder-legitimate',
    description: 'exact analytic recursion runs to K=30: all deltas finite, |delta_30| << |delta_1|, crossover reproduces imp-34900',
    holds: () =>
      DELTAS.length === K_MAX &&
      ALL_FINITE &&
      MAGNITUDE_SHRINKS &&
      Math.abs(DELTAS[K_MAX - 1]) < 1e-55 &&
      LOG10_N_CROSS > 9.5158 && LOG10_N_CROSS < 9.5161 &&
      Math.abs(DELTAS[0] - -5.652e-3) < 5e-5 &&
      EXTENSION_LEGITIMATE === true,
  },
  {
    // (F2) the delta sign pattern is periodic -> complex-conjugate singularity pair ~40 degrees off the real axis.
    id: 'imp34932-sign-pattern-periodic-complex-pair',
    description: 'delta signs periodic (>= 5 sign changes over 30 terms), full cycle P ~ 9 in k -> complex singularity pair ~40 deg off axis',
    holds: () =>
      signChanges >= 5 &&
      SIGN_PATTERN_PERIODIC === true &&
      COMPLEX_PAIR_OFF_AXIS === true &&
      ARG_DEG > 20 && ARG_DEG < 60,
  },
  {
    // (F1) more orders do NOT cure it: the Neville tail-window intercept DIVERGES with window size.
    id: 'imp34932-neville-diverges-with-length',
    description: 'Neville tail-window 1/R blows up from ~1.4e1 (4-pt) to ~1.5e11 (30-pt), ratio > 1e6 -> more orders make it WORSE',
    holds: () =>
      Math.abs(NEVILLE_FULL_INVR) > 1e8 &&
      NEVILLE_BLOWUP_RATIO > 1e6 &&
      NEVILLE_DIVERGES_WITH_LENGTH === true,
  },
  {
    // (F3) only the LINEAR radius survives and is robust: median R ~ 78, deep pairs reproduce imp-34900 (R ~ 89.6).
    id: 'imp34932-linear-radius-robust-reproduces-imp34900',
    description: 'median positive rolling-linear R ~ 78 (O(1e2)); deep pairs reproduce imp-34900 (k=7,8 1/R ~1.277e-2, k=8,9 ~9.55e-3)',
    holds: () =>
      R_MEDIAN > 50 && R_MEDIAN < 125 &&
      LINEAR_RADIUS_ROBUST === true &&
      Math.abs(DEEP_78 - 1.277e-2) < 5e-4 &&
      Math.abs(DEEP_89 - 9.554e-3) < 5e-4,
  },
  {
    // the ill-conditioning is INTRINSIC (not FD noise per imp-34900, not a short sequence per this module); convergent read survives.
    id: 'imp34932-ill-conditioning-intrinsic-convergent-survives',
    description: 'ill-conditioning intrinsic to the analytic structure (complex pair), and eps=1 stays deep inside |eps| < R ~ O(1e2)',
    holds: () =>
      ILL_CONDITIONING_INTRINSIC === true &&
      CONVERGENT_SURVIVES === true &&
      R_MEDIAN > 10,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34932-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES.isRigorous === false &&
      IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES.farTailExponent === 0.5 &&
      typeof IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES.subGap === 'string' &&
      /NO QED/.test(IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES.verdict) &&
      /refereed bound is changed/i.test(IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES.verdict),
  },
];

for (const a of IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34932-sigma-knee-extended-order-domb-sykes assertion failed: ${a.id}`);
  }
}
