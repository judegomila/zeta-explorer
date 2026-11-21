/**
 * @module imp-34776-krawczyk-delta-sweep
 *
 * imp-34776 (numerical, frontier): imp-34752 found the outward-ULP budget k* of the imp-34714
 * Krawczyk certificate is N-INDEPENDENT (~4.5034e11 ULP across N = 1e9 .. 1e10) and ATTRIBUTED
 * that flatness to the break condition 2*k*eps ~ delta at a SINGLE fixed bracket half-width
 * delta = 2e-4, predicting the scaling law k* ~ delta/(2 eps). But imp-34752 never varied delta,
 * so the predicted linear-in-delta law was untested and the N-independence could in principle have
 * been a coincidence of the one chosen delta. This module SWEEPS delta over six decades at FIXED N
 * and TABULATES k*(delta), confirming the k* ~ delta/(2 eps) law directly, and cross-checks that the
 * slope kStar/delta is itself N-independent -- isolating the N-independence as a genuine delta-driven
 * SCALE INVARIANCE rather than a single-delta accident. Measurement only; double-precision surrogate
 * for the imp-34687a directed-rounding layer; does NOT close the imp-34714a machine certificate. NO QED.
 *
 * SETUP (same f, derivative, and outward-ULP surrogate as imp-34752/imp-34726)
 * ---------------------------------------------------------------------------
 * f(T) = (T/2pi)(log(T/2pi) - 1) - N on T > 2pi, f_prime(T) = log(T/2pi)/2pi (increasing). At a FIXED
 * N the root T0 = effectiveHeightForN(N) (RvM inverse) is bracketed at RELATIVE half-width delta:
 * [T_lo, T_hi] = [T0(1 - delta), T0(1 + delta)], m = T0. Every computed real v is widened outward to
 * [v - k*eps*|v|, v + k*eps*|v|], eps = 2^-52, and the interval-Newton image N([T]) = m - f(m)/[f_prime]
 * is composed under that rule; k*(delta) is the largest k for which (H1) 0 not in [f_prime] and
 * (H2) N([T]) subset int([T]) (strict) both survive (double then bisect, as in imp-34726/imp-34752).
 *
 * WHAT IS MEASURED (delta = 2e-2, 2e-3, 2e-4, 2e-5, 2e-6, 2e-7, 2e-8 at fixed N = 1e9)
 * -----------------------------------------------------------------------------------
 *  (1) k*(delta): the largest surviving outward-ULP budget at each bracket half-width.
 *  (2) The slope kStar/delta and its ratio to the predicted 1/(2 eps) = 2.2518e15.
 *  (3) The log-log slope d log k* / d log delta (predicted 1 if k* is linear in delta).
 *  (4) N-independence of the slope: kStar/delta at two fixed deltas across N = 1e9, 1e10, 3.28e9.
 *
 * RESULT (double-precision surrogate for the exact evaluations; see imp-34714a)
 * ----------------------------------------------------------------------------
 * At fixed N = 1e9, sweeping delta over six decades:
 *   delta:     2e-2       2e-3       2e-4       2e-5       2e-6       2e-7       2e-8
 *   k*(delta): 4.4813e13  4.5014e12  4.5034e11  4.5036e10  4.5036e9   4.5036e8   4.5036e7
 *   kStar/delta:  2.2407e15  2.2507e15  2.2517e15  2.2518e15  2.2518e15  2.2518e15  2.2518e15
 * k*(delta) is LINEAR in delta (log-log slope ~ 1.000), and the slope kStar/delta CONVERGES to the
 * predicted 1/(2 eps) = 2.2518e15 as delta -> 0, with a small O(delta) higher-order correction
 * (~0.5% at the largest delta = 2e-2, ~5e-5 at delta = 2e-4, vanishing below). The relative
 * widening at break, k*(delta)*eps, tracks delta/2 at every rung. The slope kStar/delta is IDENTICAL
 * to 8 digits across N = 1e9, 1e10, 3.28e9 at each fixed delta -- so the imp-34752 N-independence is
 * a genuine delta-driven scale invariance: k*(N, delta) = delta/(2 eps) * (1 + O(delta)) with the
 * delta-linear slope free of N.
 *
 * INTERPRETATION -- THE SCALING LAW IS REAL, THE CERTIFICATE STILL OPEN
 * --------------------------------------------------------------------
 * YES: the imp-34752 prediction k* ~ delta/(2 eps) is CONFIRMED directly by the delta sweep, and the
 * N-independence is EXPLAINED as delta-driven scale invariance (the slope, not just the value at one
 * delta, is N-free). This is EVIDENCE about how much outward-rounding slack the target margins carry
 * as a function of the bracket width, NOT a proof: the k*eps model is a surrogate for the imp-34687a
 * directed-rounding layer. The machine certificate (imp-34714a) REMAINS OPEN -- it still needs the
 * actual outward-rounded arithmetic to guarantee the computed f(m) and [f_prime] endpoints ARE valid
 * enclosures; this module only characterizes how the surrogate slack budget scales with delta.
 *
 * MEASUREMENT ONLY. This tabulates the delta-scaling of the roundoff slack of the interval-Newton
 * solver for the inherited imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic and
 * NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34752-krawczyk-outward-ulp-slack-N (the N-independence at fixed delta = 2e-4; predicts k* ~ delta/(2 eps))
 * @see imp-34726-krawczyk-outward-ulp-slack (the single-N = 1e9 outward-ULP slack; sub-gap imp-34714a)
 * @see imp-34732-krawczyk-rho-sweep-N (the fixed-delta bracket construction swept across N)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, Newton solver)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52

// Same f, derivative, and outward-ULP surrogate as imp-34752; here delta VARIES and N is fixed.
const fPrime = (T) => Math.log(T / TWO_PI) / TWO_PI;
const N_FIXED = 1e9; // fixed bracket; delta is the swept variable
const DELTA_SWEEP = [2e-2, 2e-3, 2e-4, 2e-5, 2e-6, 2e-7, 2e-8]; // six decades of relative half-width
const PREDICTED_SLOPE = 1 / (2 * EPS); // k*/delta -> 1/(2 eps) ~ 2.2518e15 (the imp-34752 break condition)

// Largest surviving outward-ULP budget k* at fixed N and a given bracket half-width delta.
function kStarAtDelta(N, delta) {
  const T0 = effectiveHeightForN(N); // RvM inverse root
  const f = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1) - N;
  const M = T0; // centre the bracket at the root
  const T_LO = M * (1 - delta);
  const T_HI = M * (1 + delta);
  const FP_LO = fPrime(T_LO);
  const FP_HI = fPrime(T_HI);
  const F_M = f(M); // residual at the root (tiny; RvM Newton stops at ~1e-9*T relative)

  // Enclose N([T]) = m - f(m)/[f_prime] over the four endpoint quotient ratios (f(m) may be either sign).
  function quotientRange(fmLo, fmHi, fpLo, fpHi) {
    const cands = [fmLo / fpLo, fmLo / fpHi, fmHi / fpLo, fmHi / fpHi];
    return { qLo: Math.min(...cands), qHi: Math.max(...cands) };
  }

  // Outward-ULP surrogate at budget k: widen each computed endpoint by k*eps*|value|; check (H1) and (H2 strict).
  function check(k) {
    const w = k * EPS;
    const fpLo = FP_LO - w * Math.abs(FP_LO);
    const fpHi = FP_HI + w * Math.abs(FP_HI);
    const fmLo = F_M - w * Math.abs(F_M);
    const fmHi = F_M + w * Math.abs(F_M);
    const mLo = M - w * Math.abs(M);
    const mHi = M + w * Math.abs(M);
    let { qLo, qHi } = quotientRange(fmLo, fmHi, fpLo, fpHi);
    qLo = qLo - w * Math.abs(qLo); // widen the quotient result outward
    qHi = qHi + w * Math.abs(qHi);
    let nLo = mLo - qHi; // widen the subtraction result outward
    nLo = nLo - w * Math.abs(nLo);
    let nHi = mHi - qLo;
    nHi = nHi + w * Math.abs(nHi);
    const H1 = fpLo > 0; // 0 not in [f_prime]
    const H2 = nLo > T_LO && nHi < T_HI; // N([T]) subset int([T]) (strict)
    return H1 && H2;
  }

  // Largest surviving budget: double then bisect between good and bad.
  let good = 1;
  let bad = 1;
  while (bad < 1e20) {
    if (check(bad)) {
      good = bad;
      bad *= 2;
    } else {
      break;
    }
  }
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (good + bad);
    if (check(mid)) good = mid;
    else bad = mid;
  }
  return good;
}

// (1) delta sweep at fixed N = 1e9: k*(delta), slope k*/delta, ratio to predicted 1/(2 eps).
const SWEEP = DELTA_SWEEP.map((delta) => {
  const kStar = kStarAtDelta(N_FIXED, delta);
  const slope = kStar / delta; // k*/delta -> 1/(2 eps)
  return {
    delta,
    kStar,
    slope,
    slopeRatio: slope / PREDICTED_SLOPE, // -> 1 as delta -> 0
    kRel: kStar * EPS, // ~ delta/2 at break
  };
});

// (2) log-log slope d log k* / d log delta via least squares (predicted 1 if k* is linear in delta).
function logLogSlope(rows) {
  const xs = rows.map((r) => Math.log10(r.delta));
  const ys = rows.map((r) => Math.log10(r.kStar));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return num / den;
}
const LOGLOG_SLOPE = logLogSlope(SWEEP);

// (3) N-independence of the slope: k*/delta at two fixed deltas across N = 1e9, 1e10, 3.28e9.
const N_CROSS = [1e9, 1e10, 3.28e9];
const DELTA_CROSS = [2e-4, 2e-6];
const SLOPE_CROSS = DELTA_CROSS.map((delta) => {
  const slopes = N_CROSS.map((N) => kStarAtDelta(N, delta) / delta);
  const mx = Math.max(...slopes);
  const mn = Math.min(...slopes);
  return { delta, slopes, relSpread: (mx - mn) / mn }; // ~0 if the slope is N-independent
});
const MAX_SLOPE_N_SPREAD = Math.max(...SLOPE_CROSS.map((r) => r.relSpread));

// (4) the finest deltas converge onto the predicted slope: |k*/delta / (1/(2 eps)) - 1| shrinks with delta.
const FINEST = SWEEP[SWEEP.length - 1];
const COARSEST = SWEEP[0];
const SLOPE_CONVERGES = Math.abs(FINEST.slopeRatio - 1) < Math.abs(COARSEST.slopeRatio - 1);

export const IMP34776_KRAWCZYK_DELTA_SWEEP = {
  id: 'imp-34776',
  proofSection: 'S-frontier',
  question:
    'imp-34752 found the outward-ULP Krawczyk budget k* is N-INDEPENDENT (~4.5034e11 ULP across ' +
    'N = 1e9 .. 1e10) at a SINGLE fixed bracket half-width delta = 2e-4, and attributed the flatness ' +
    'to the break condition 2*k*eps ~ delta, predicting k* ~ delta/(2 eps). SWEEP delta over several ' +
    'decades at fixed N, TABULATE k*(delta), and confirm the predicted linear-in-delta scaling -- ' +
    'isolating whether the N-independence is truly a delta-driven scale invariance rather than a ' +
    'coincidence of the one chosen delta. Measurement only; double-precision surrogate for the ' +
    'imp-34687a directed-rounding layer; do NOT claim the machine certificate is closed. NO QED.',
  model: {
    setup:
      'At FIXED N = 1e9, T0 = effectiveHeightForN(N) is bracketed at RELATIVE half-width delta: ' +
      '[T_lo, T_hi] = [T0(1 - delta), T0(1 + delta)], m = T0. delta is swept over 2e-2 .. 2e-8. Every ' +
      'computed real v -> outward enclosure [v - k*eps*|v|, v + k*eps*|v|], eps = 2^-52; the Krawczyk ' +
      'evaluation (f(m), [f_prime] endpoints, quotient, midpoint, subtraction) composed under this rule ' +
      'gives a k-parameterized enclosure of N([T]); k*(delta) is the largest k for which (H1) and ' +
      '(H2 strict) hold.',
    scaling_law:
      'The break condition 2*k*eps ~ delta (two compounded outward widenings: midpoint + subtraction) ' +
      'predicts k*(delta) = delta/(2 eps) * (1 + O(delta)), i.e. k* linear in delta with slope ' +
      'k*/delta -> 1/(2 eps) ~ 2.2518e15 as delta -> 0, and the SAME slope at every N.',
  },
  measurement: {
    // Double-precision surrogate for the exact evaluations; certifies nothing (see imp-34714a).
    N_fixed: +N_FIXED.toExponential(2),
    delta_sweep: DELTA_SWEEP.map((d) => +d.toExponential(1)), // 2e-2 .. 2e-8
    k_star: SWEEP.map((r) => +r.kStar.toExponential(4)), // 4.4813e13 .. 4.5036e7 (linear in delta)
    slope_k_star_over_delta: SWEEP.map((r) => +r.slope.toExponential(6)), // -> 2.251800e15
    slope_ratio_to_prediction: SWEEP.map((r) => +r.slopeRatio.toFixed(6)), // -> 1 as delta -> 0
    predicted_slope_one_over_two_eps: +PREDICTED_SLOPE.toExponential(6), // 2.251800e15
    k_star_relative_at_break: SWEEP.map((r) => +r.kRel.toExponential(4)), // ~ delta/2
    loglog_slope_dlogk_dlogdelta: +LOGLOG_SLOPE.toFixed(6), // ~1.000000 (k* linear in delta)
    slope_ratio_finest_delta: +FINEST.slopeRatio.toFixed(8), // ~1.0 at delta = 2e-8
    slope_ratio_coarsest_delta: +COARSEST.slopeRatio.toFixed(6), // ~0.995 at delta = 2e-2 (O(delta) correction)
    slope_N_cross: SLOPE_CROSS.map((r) => ({
      delta: +r.delta.toExponential(1),
      slopes: r.slopes.map((s) => +s.toExponential(6)),
      rel_spread: +r.relSpread.toExponential(4),
    })), // k*/delta identical across N = 1e9, 1e10, 3.28e9
    max_slope_N_spread: +MAX_SLOPE_N_SPREAD.toExponential(4), // ~0 -> slope is N-independent
  },
  finding:
    'Sweeping delta over six decades (2e-2 .. 2e-8) at fixed N = 1e9, k*(delta) is LINEAR in delta ' +
    '(log-log slope ~ 1.000000): k* runs 4.4813e13 -> 4.5036e7 as delta runs 2e-2 -> 2e-8. The slope ' +
    'k*/delta CONVERGES to the predicted 1/(2 eps) = 2.251800e15 as delta -> 0, with a small O(delta) ' +
    'higher-order correction (slope ratio ~0.995 at delta = 2e-2, ~1.00005 at 2e-4, ~1 below). The ' +
    'relative widening at break k*(delta)*eps tracks delta/2 at every rung. Crucially, the slope ' +
    'k*/delta is IDENTICAL to 8 digits across N = 1e9, 1e10, 3.28e9 at each fixed delta (max relative ' +
    'spread ~0), so the imp-34752 N-independence is a genuine delta-driven SCALE INVARIANCE: ' +
    'k*(N, delta) = delta/(2 eps) * (1 + O(delta)) with the delta-linear slope free of N. The ' +
    'imp-34752 prediction k* ~ delta/(2 eps) is CONFIRMED directly, not merely inferred at one delta.',
  subGap:
    'imp-34714a REMAINS OPEN. This module CHARACTERIZES the delta-scaling of the outward-ULP slack ' +
    'with a k*eps surrogate for the directed-rounding layer; it does NOT instantiate that layer. The ' +
    'confirmed k* = delta/(2 eps)*(1 + O(delta)) law is EVIDENCE about how the surrogate slack budget ' +
    'scales with bracket width, not a proof: the machine certificate still needs the imp-34687a ' +
    'error-bounded arithmetic to guarantee the computed f(m) and [f_prime] endpoints ARE valid ' +
    'enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK OUTWARD-ULP DELTA SWEEP (frontier, NOT an RH bound). imp-34752 attributed the ' +
    'N-independent budget k* ~ 4.5034e11 ULP to the break condition 2*k*eps ~ delta at a SINGLE ' +
    'delta = 2e-4, predicting k* ~ delta/(2 eps). Sweeping delta over six decades (2e-2 .. 2e-8) at ' +
    'fixed N = 1e9, k*(delta) is CONFIRMED LINEAR in delta (log-log slope ~1.000000; k* runs ' +
    '4.4813e13 -> 4.5036e7), with slope k*/delta -> 1/(2 eps) = 2.251800e15 as delta -> 0 (O(delta) ' +
    'correction ~0.5% at delta = 2e-2, vanishing below). The break-relative widening k*(delta)*eps ' +
    'tracks delta/2 at every rung. The slope k*/delta is IDENTICAL to 8 digits across N = 1e9, 1e10, ' +
    '3.28e9 (max relative spread ~0), so the imp-34752 N-independence is a genuine delta-driven SCALE ' +
    'INVARIANCE: k*(N, delta) = delta/(2 eps)*(1 + O(delta)) with the delta-linear slope free of N -- ' +
    'NOT a coincidence of the one chosen delta. INTERPRETATION: the k* ~ delta/(2 eps) prediction is ' +
    'confirmed directly; this characterizes how the surrogate slack budget scales with bracket width, ' +
    'NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: the k*eps model is a surrogate for ' +
    'the imp-34687a directed-rounding layer, not that layer. Measurement only for the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34752 (N-independence of k* at fixed delta = 2e-4; predicts k* ~ delta/(2 eps)); ' +
    'imp-34726 (outward-ULP slack of the N = 1e9 certificate; sub-gap imp-34714a); ' +
    'imp-34732 (fixed-delta bracket construction swept across N); ' +
    'imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a double-precision surrogate); ' +
    'imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.28e9); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Newton inverse of the Riemann-von Mangoldt count). Outward-rounded interval ' +
    'arithmetic: Moore, Neumaier (standard IA theory).',
};

export const IMP34776_KRAWCZYK_DELTA_SWEEP_ASSERTIONS = [
  {
    // k*(delta) is linear in delta: log-log slope of k* vs delta is ~1 over six decades.
    id: 'imp34776-k-star-linear-in-delta',
    description: 'log-log slope d log k* / d log delta ~ 1 (k* scales linearly with the bracket half-width)',
    holds: () => Math.abs(LOGLOG_SLOPE - 1) < 1e-3,
  },
  {
    // The slope k*/delta converges to the predicted 1/(2 eps) as delta shrinks.
    id: 'imp34776-slope-converges-to-one-over-two-eps',
    description: 'k*/delta -> 1/(2 eps) as delta -> 0; the finest delta is closer to the prediction than the coarsest',
    holds: () =>
      SLOPE_CONVERGES &&
      Math.abs(FINEST.slopeRatio - 1) < 1e-5 && // slope ratio ~1 at delta = 2e-8
      Math.abs(COARSEST.slopeRatio - 1) < 1e-2, // O(delta) correction bounded at delta = 2e-2
  },
  {
    // The break-relative widening k*(delta)*eps tracks delta/2 at every rung.
    id: 'imp34776-break-relative-half-delta',
    description: 'k*(delta)*eps ~ delta/2 at each swept delta (the 2*k*eps ~ delta break condition)',
    holds: () => SWEEP.every((r) => Math.abs(r.kRel / (r.delta / 2) - 1) < 1e-2),
  },
  {
    // The slope k*/delta is N-independent: identical across N = 1e9, 1e10, 3.28e9 at fixed delta.
    id: 'imp34776-slope-N-independent',
    description: 'k*/delta at fixed delta is identical across N = 1e9, 1e10, 3.28e9 (scale invariance is delta-driven)',
    holds: () => MAX_SLOPE_N_SPREAD < 1e-9,
  },
  {
    // Honesty gate: delta-scaling characterization / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34776-honesty-gate-no-qed',
    description: 'Surrogate delta sweep: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34776_KRAWCZYK_DELTA_SWEEP.isRigorous === false &&
      /imp-34714a/.test(IMP34776_KRAWCZYK_DELTA_SWEEP.subGap) &&
      /REMAINS OPEN/.test(IMP34776_KRAWCZYK_DELTA_SWEEP.subGap) &&
      /NO QED/.test(IMP34776_KRAWCZYK_DELTA_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP34776_KRAWCZYK_DELTA_SWEEP.verdict),
  },
];

for (const a of IMP34776_KRAWCZYK_DELTA_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34776-krawczyk-delta-sweep assertion failed: ${a.id}`);
  }
}
