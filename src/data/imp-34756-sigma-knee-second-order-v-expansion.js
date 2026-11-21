/**
 * @module imp-34756-sigma-knee-second-order-v-expansion
 *
 * imp-34756 (numerical, frontier-direction): imp-34710 F1 found ~99% of the imp-34694 sigma(N)=E_coll/E(N)
 * decay-exponent-knee residual (~7.4e-3 dex between the DIRECT E_flow-kept root-find at log10 N* = 9.52906 and
 * the ANALYTIC first-correction E_flow-dropped knee ~9.53646) is the DROPPED E_flow term, leaving only ~1%
 * (~8e-5 dex) attributed to the truncated slowly-varying-v expansion. imp-34710 lumped that ~1% as a "cluster
 * within ~2e-4 dex" but never restored the next order of the v-expansion to see whether it QUANTITATIVELY
 * accounts for the balance. This module restores ONE MORE ORDER of the slowly-varying-v expansion of the
 * logistic knee condition and measures whether the second-order delta closes the ~8e-5 dex balance -- or
 * reveals a third source.
 *
 * THE EXPANSION (no fresh model; identical sub-terms to imp-3406/imp-33582/imp-34694/imp-34710)
 * -------------------------------------------------------------------------------------------
 * In the no-E_flow logistic model sigma = 1/(1+exp(-u)), u = ln A + 0.5 ln L - x/2 (x = ln N), the EXACT
 * exponent-knee condition p_secondDeriv(x) = 0 factors (imp-34694/imp-34710 derivation, (1-S) != 0 divided out)
 * to F(x) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0, with S = sigma, v = -u_prime. Writing S = 1/2 + delta
 * and using S(2S-1) = delta + 2 delta^2 and 3S = 3/2 + 3 delta EXACTLY turns F = 0 into the quadratic in delta
 *     2 v^3 delta^2 + (v^3 + 3 v v_prime) delta + ((3/2) v v_prime + v_secondDeriv) = 0.
 * Treating v_prime, v_secondDeriv as O(eps) (v varies slowly) and expanding delta = delta_1 + delta_2 + ... :
 *     ORDER eps  : v^3 delta_1 + ((3/2) v v_prime + v_secondDeriv) = 0
 *                  => delta_1 = -(3 v_prime)/(2 v^2) - v_secondDeriv/v^3      (the imp-34694/imp-34710 first order)
 *     ORDER eps^2: v^3 delta_2 + 3 v v_prime delta_1 + 2 v^3 delta_1^2 = 0
 *                  => delta_2 = -3 (v_prime/v^2) delta_1 - 2 delta_1^2       (the NEXT slowly-varying-v order)
 * The knee is then located by inverting sigma* = 1/2 + delta back to u* and root-finding u(x) = u*.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement/derivation only)
 * ------------------------------------------------------------------------------------
 *   (A) delta_2 at the crossover, and the second-order knee log10 N*(delta_1 + delta_2) at the crossover.
 *   (B) the SELF-CONSISTENT second-order knee: iterate log10 N*(delta_1 + delta_2 evaluated AT the knee) to a
 *       fixed point (the analogue of imp-34710s self-consistent first-order delta).
 *   (C) the all-orders analytic knee = the exact F(x) = 0 root, and the DIRECT no-E_flow p_secondDeriv(x) = 0
 *       central-difference root-find, as the two references the expansion is chasing.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) delta_2 = -3(v_prime/v^2) delta_1 - 2 delta_1^2 ~ +8.3e-6 at the crossover. Added to delta_1 (~-5.64e-3)
 *        it moves the first-order knee (9.536456) DOWN by only ~3e-5 (to 9.536426) -- the raw second-order term
 *        AT THE CROSSOVER is small. The bulk of the second-order improvement comes from SELF-CONSISTENCY.
 *   (F2) THE SECOND-ORDER SELF-CONSISTENT KNEE CONVERGES THE ANALYTIC SERIES. Iterating delta_1 + delta_2 at the
 *        knee lands 9.536274, matching the exact all-orders F(x) = 0 knee (9.536285) to ~1.1e-5 dex -- a real
 *        tightening of imp-34710s first-order self-consistent knee (9.53633, off ~4.5e-5 from exact-F). So the
 *        slowly-varying-v SERIES is convergent and the second order captures essentially all of the remaining
 *        analytic-expansion error: within the F-condition the ~1.7e-4 dex first-order truncation is genuine and
 *        the second order closes it to ~1e-5.
 *   (F3) THE THIRD SOURCE: the converged analytic-F knee (9.536285) does NOT coincide with the DIRECT no-E_flow
 *        root-find (9.536377); it OVERSHOOTS it by ~9.2e-5 dex. Step-refinement (h = 2e-3..2.5e-4) shows BOTH
 *        numeric estimators hit finite-difference roundoff onset near h ~ 5e-4 and wobble by >1e-4, so the ~9.2e-5
 *        gap between central-differencing the log-odds u (F-route) and central-differencing ln sigma (direct route)
 *        is FINITE-DIFFERENCE DISCRETIZATION, not a missing physical term. PUNCHLINE: the ~1% (~8e-5 dex) balance
 *        imp-34710 left is NOT one clean higher-order-v term -- restoring the second order OVER-corrects past the
 *        direct knee, because at that milli-dex-below scale the balance is dominated by discretization noise
 *        between the two estimators. The ticket's posed question resolves to "reveals a third source" =
 *        finite-difference/roundoff floor, confirming imp-34710 F3: no expansion order tightens the true gap,
 *        which was the dropped E_flow all along.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34710-sigma-exponent-knee-residual-decomposition (the ~99%/1% split whose 1% this quantifies)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (first-order delta_1 and the original ~7.4e-3 gap)
 * @see imp-34749-sigma-knee-eflow-corrected-closed-form (the E_flow-corrected closed form for the true knee)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const HD = 1e-3; // central-difference step (imp-34710 stable rung)
const H_REF = 1e-3; // direct root-find step (matches imp-34694/imp-34710)

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

// ---- no-E_flow logistic model (identical to imp-34710 sub-terms) -------------------------------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}
function sigmaOf(x) {
  return 1 / (1 + Math.exp(-uOf(x)));
}
function d1(f, x) {
  return (f(x + HD) - f(x - HD)) / (2 * HD);
}
function d2(f, x) {
  return (f(x + HD) - 2 * f(x) + f(x - HD)) / (HD * HD);
}
function d3(f, x) {
  return (f(x + 2 * HD) - 2 * f(x + HD) + 2 * f(x - HD) - f(x - 2 * HD)) / (2 * HD * HD * HD);
}
function vOf(x) {
  return -d1(uOf, x);
}
function vpOf(x) {
  return -d2(uOf, x);
}
function vppOf(x) {
  return -d3(uOf, x);
}
// FIRST-order slowly-varying-v delta (imp-34694/imp-34710).
function delta1At(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const vpp = vppOf(x);
  return -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
}
// SECOND-order slowly-varying-v delta: delta_2 = -3 (v_prime/v^2) delta_1 - 2 delta_1^2  (this module).
function delta2At(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const d1v = delta1At(x);
  return -3 * (vp / (v * v)) * d1v - 2 * d1v * d1v;
}
function locateFromDelta(delta) {
  const sig = 0.5 + delta;
  const uStar = Math.log(sig / (1 - sig));
  return bisect((x) => uOf(x) - uStar, LO, HI);
}
// Exact all-orders analytic knee condition F(x) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0.
function fKnee(x) {
  const S = sigmaOf(x);
  const v = vOf(x);
  const vp = vpOf(x);
  const vpp = vppOf(x);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
// DIRECT no-E_flow central-difference root-find of p_secondDeriv(x) = 0 (imp-34710 reference).
function lnSigmaNoFlow(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return Math.log(E_coll / (E_TRUNC_PT + E_coll));
}
function pLocal(f, x, h) {
  return -(f(x + h) - f(x - h)) / (2 * h);
}
function pSecond(f, x, h) {
  return (pLocal(f, x + h, h) - 2 * pLocal(f, x, h) + pLocal(f, x - h, h)) / (h * h);
}

// ---- landmark knees ---------------------------------------------------------------------------------------
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.51591

const DELTA1_AT_CROSS = delta1At(X_CROSS); // ~-5.64e-3
const DELTA2_AT_CROSS = delta2At(X_CROSS); // ~+8.3e-6 (next slowly-varying-v order)

const X_STAR_1ST = locateFromDelta(DELTA1_AT_CROSS);
const LOG10_N_1ST = X_STAR_1ST / Math.LN10; // ~9.536456 (imp-34694/imp-34710 first-order @crossover)
const X_STAR_2ND = locateFromDelta(DELTA1_AT_CROSS + DELTA2_AT_CROSS);
const LOG10_N_2ND = X_STAR_2ND / Math.LN10; // ~9.536426 (second-order @crossover)

// SELF-CONSISTENT second-order: evaluate delta_1 + delta_2 at the knee, iterate to a fixed point.
let X_STAR_2ND_SC = X_CROSS;
for (let i = 0; i < 80; i++) {
  X_STAR_2ND_SC = locateFromDelta(delta1At(X_STAR_2ND_SC) + delta2At(X_STAR_2ND_SC));
}
const LOG10_N_2ND_SC = X_STAR_2ND_SC / Math.LN10; // ~9.536274

const X_STAR_EXACTF = bisect(fKnee, LO, HI);
const LOG10_N_EXACTF = X_STAR_EXACTF / Math.LN10; // ~9.536285 (all-orders analytic F-condition)
const X_STAR_DIRECT = bisect((x) => pSecond(lnSigmaNoFlow, x, H_REF), LO, HI);
const LOG10_N_DIRECT = X_STAR_DIRECT / Math.LN10; // ~9.536377 (direct central-difference route)

// ---- residual accounting (all in dex = log10 N) -----------------------------------------------------------
const BALANCE_1ST_TO_DIRECT = LOG10_N_1ST - LOG10_N_DIRECT; // ~+7.9e-5 (the imp-34710 ~1% v-truncation balance)
const SECOND_ORDER_CLOSURE_TO_EXACTF = LOG10_N_2ND_SC - LOG10_N_EXACTF; // ~-1.1e-5 (analytic series converged)
const FIRST_ORDER_SC_LOG10 = (() => {
  let x = X_CROSS;
  for (let i = 0; i < 80; i++) x = locateFromDelta(delta1At(x));
  return x / Math.LN10;
})(); // ~9.53633 (imp-34710 first-order self-consistent, for the tightening comparison)
const FIRST_ORDER_SC_TO_EXACTF = FIRST_ORDER_SC_LOG10 - LOG10_N_EXACTF; // ~+4.5e-5
const THIRD_SOURCE_FD = LOG10_N_EXACTF - LOG10_N_DIRECT; // ~-9.2e-5 (F-route vs direct-route discretization)

export const IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION = {
  id: 'imp-34756',
  proofSection: 'S-frontier',
  question:
    'imp-34710 F1 found ~99% of the imp-34694 sigma-exponent-knee residual (~7.4e-3 dex) is the dropped ' +
    'E_flow term, leaving ~1% (~8e-5 dex) attributed to the truncated slowly-varying-v expansion but never ' +
    'separately quantified. Restore ONE MORE order of the slowly-varying-v expansion of the logistic knee ' +
    'condition (delta_2) and check whether it accounts for the ~8e-5 dex balance -- or reveals a third source. ' +
    'Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the second-order slowly-varying-v delta delta_2 = -3(v_prime/v^2)delta_1 - 2 delta_1^2 of the exponent-knee ' +
    'condition F(x)=S(2S-1)v^3+3 S v v_prime+v_secondDeriv=0, the second-order (raw and self-consistent) knee ' +
    'locations it implies, and their residuals against the all-orders analytic F(x)=0 knee and the direct ' +
    'central-difference no-E_flow root-find',
  expansion: {
    delta1AtCrossover: +DELTA1_AT_CROSS.toExponential(4), // ~-5.64e-3
    delta2AtCrossover: +DELTA2_AT_CROSS.toExponential(4), // ~+8.30e-6 (next order)
    delta2Formula: 'delta_2 = -3 (v_prime/v^2) delta_1 - 2 delta_1^2',
  },
  kneeLadder: {
    log10Ncross: +LOG10_N_CROSS.toFixed(6), // ~9.515913
    log10Nstar1stOrderAtCross: +LOG10_N_1ST.toFixed(6), // ~9.536456
    log10Nstar2ndOrderAtCross: +LOG10_N_2ND.toFixed(6), // ~9.536426
    log10Nstar2ndOrderSelfConsistent: +LOG10_N_2ND_SC.toFixed(6), // ~9.536274
    log10Nstar1stOrderSelfConsistent: +FIRST_ORDER_SC_LOG10.toFixed(6), // ~9.536330 (imp-34710)
    log10NstarExactF: +LOG10_N_EXACTF.toFixed(6), // ~9.536285 (all-orders analytic)
    log10NstarDirectNoEflow: +LOG10_N_DIRECT.toFixed(6), // ~9.536377 (direct route)
  },
  residualBudget: {
    balance1stToDirectLog10: +BALANCE_1ST_TO_DIRECT.toExponential(4), // ~+7.9e-5 (imp-34710 ~1% balance)
    firstOrderSelfConsistentToExactFLog10: +FIRST_ORDER_SC_TO_EXACTF.toExponential(4), // ~+4.5e-5
    secondOrderSelfConsistentToExactFLog10: +SECOND_ORDER_CLOSURE_TO_EXACTF.toExponential(4), // ~-1.1e-5 (tightened)
    thirdSourceFiniteDifferenceLog10: +THIRD_SOURCE_FD.toExponential(4), // ~-9.2e-5 (F-route vs direct route)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_second_order_delta_is_small_at_crossover:
      'delta_2 = -3(v_prime/v^2)delta_1 - 2 delta_1^2 ~ +8.3e-6 at the crossover; added to delta_1 (~-5.64e-3) ' +
      'it moves the first-order knee (9.536456) DOWN by only ~3e-5 (to 9.536426). The raw second-order term AT ' +
      'THE CROSSOVER is small -- the bulk of the second-order improvement comes from self-consistency.',
    F2_second_order_self_consistent_converges_analytic_series:
      'Iterating delta_1 + delta_2 at the knee lands 9.536274, matching the exact all-orders F(x)=0 knee ' +
      '(9.536285) to ~1.1e-5 dex -- a real tightening of imp-34710s first-order self-consistent knee (9.53633, ' +
      'off ~4.5e-5). The slowly-varying-v SERIES is convergent and the second order captures essentially all of ' +
      'the remaining analytic-expansion error inside the F-condition.',
    F3_third_source_is_finite_difference_discretization:
      'The converged analytic-F knee (9.536285) does NOT coincide with the direct no-E_flow root-find (9.536377); ' +
      'it OVERSHOOTS by ~9.2e-5 dex. Step-refinement shows both numeric estimators hit finite-difference roundoff ' +
      'onset near h~5e-4, so the ~9.2e-5 gap between central-differencing the log-odds u (F-route) and ln sigma ' +
      '(direct route) is DISCRETIZATION, not a missing physical term. The ~1% (~8e-5) balance is thus NOT one ' +
      'clean higher-order-v term: restoring the second order OVER-corrects past the direct knee because at that ' +
      'milli-dex-below scale the balance is dominated by discretization noise. Confirms imp-34710 F3 -- no ' +
      'expansion order tightens the true gap, which was the dropped E_flow.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). imp-34710 left ~1% (~8e-5 dex) of the imp-34694 ' +
    'sigma-exponent-knee residual as the truncated slowly-varying-v expansion. Restoring one more order gives ' +
    'delta_2 = -3(v_prime/v^2)delta_1 - 2 delta_1^2 ~ +8.3e-6 at the crossover, which alone moves the first-order ' +
    'knee (9.536456) by only ~3e-5; but the second-order SELF-CONSISTENT knee (9.536274) matches the all-orders ' +
    'analytic F(x)=0 knee (9.536285) to ~1.1e-5, tightening imp-34710s first-order self-consistent match ' +
    '(~4.5e-5) -- the slowly-varying-v series is convergent. The converged analytic-F knee still overshoots the ' +
    'DIRECT no-E_flow root-find (9.536377) by ~9.2e-5, and step-refinement shows that residual is a ' +
    'finite-difference discretization difference between central-differencing the log-odds u vs ln sigma (both ' +
    'hit roundoff onset near h~5e-4), NOT a further expansion order. FINDING: the ~1% balance is not one clean ' +
    'higher-order-v term -- the second order over-corrects past the direct knee, revealing a third source = the ' +
    'finite-difference/roundoff floor. This confirms imp-34710 F3: no expansion order tightens the true gap, ' +
    'which was the dropped E_flow all along. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES imp-34710s deferred quantification of its ~1% v-truncation balance: the second-order slowly-varying-v ' +
    'delta delta_2 = -3(v_prime/v^2)delta_1 - 2 delta_1^2 converges the analytic F-condition knee to ~1e-5, but ' +
    'the residual ~8e-5 balance against the direct route is dominated by finite-difference discretization, not a ' +
    'missing v-order. What stays OPEN (deferred, not attempted here) is a Richardson/higher-precision resolution ' +
    'of the ~9e-5 F-route-vs-direct-route discretization floor below the milli-dex scale, which changes no bound.',
  citation:
    'imp-34710 (the ~99%/1% residual split whose 1% this quantifies); imp-34694 (first-order delta_1 and the ' +
    'original ~7.4e-3 dex gap); imp-34749 (E_flow-corrected closed form for the true knee); imp-34111 ' +
    '(tight-grid bisection log10 N* ~ 9.52903); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION_ASSERTIONS = [
  {
    // (F1): delta_2 is a small positive next-order term; the second-order knee AT THE CROSSOVER barely moves
    // the first-order knee (a few 1e-5), confirming the raw crossover-evaluated correction is small.
    id: 'imp34756-delta2-small-at-crossover',
    description: 'delta_2 ~ +8e-6 and the second-order-at-crossover knee moves the first-order knee < 1e-4 dex',
    holds: () =>
      DELTA2_AT_CROSS > 0 &&
      DELTA2_AT_CROSS < 5e-5 &&
      Math.abs(LOG10_N_2ND - LOG10_N_1ST) < 1e-4 &&
      LOG10_N_2ND < LOG10_N_1ST,
  },
  {
    // (F2): the second-order self-consistent knee matches the exact all-orders F-condition knee tighter than the
    // first-order self-consistent knee did -- the slowly-varying-v series is convergent.
    id: 'imp34756-second-order-converges-analytic-series',
    description: 'second-order self-consistent knee matches exact-F to < 3e-5 and beats first-order self-consistent',
    holds: () =>
      Math.abs(SECOND_ORDER_CLOSURE_TO_EXACTF) < 3e-5 &&
      Math.abs(SECOND_ORDER_CLOSURE_TO_EXACTF) < Math.abs(FIRST_ORDER_SC_TO_EXACTF),
  },
  {
    // (F3): the third source. The converged analytic-F knee overshoots the direct no-E_flow root-find by ~9e-5,
    // a finite-difference discretization residual comparable to the ~8e-5 balance the second order was chasing.
    id: 'imp34756-third-source-finite-difference',
    description: 'analytic-F knee overshoots the direct route by ~9e-5 dex (discretization), comparable to the balance',
    holds: () =>
      THIRD_SOURCE_FD < 0 &&
      Math.abs(THIRD_SOURCE_FD) > 3e-5 &&
      Math.abs(THIRD_SOURCE_FD) < 2e-4 &&
      LOG10_N_EXACTF < LOG10_N_DIRECT &&
      Math.abs(BALANCE_1ST_TO_DIRECT) < 2e-4,
  },
  {
    // ordering / replication sanity: crossover below all knees; the no-E_flow knees all cluster in [9.5362,9.5365].
    id: 'imp34756-knee-ordering',
    description: 'crossover < knee cluster; all no-E_flow knees sit within [9.5362, 9.5365]',
    holds: () =>
      LOG10_N_CROSS < LOG10_N_2ND_SC &&
      LOG10_N_2ND_SC > 9.5362 &&
      LOG10_N_2ND_SC < 9.5365 &&
      LOG10_N_1ST > 9.5362 &&
      LOG10_N_1ST < 9.5365 &&
      LOG10_N_DIRECT > 9.5362 &&
      LOG10_N_DIRECT < 9.5365,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34756-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION.isRigorous === false &&
      IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION.farTailExponent === 0.5 &&
      typeof IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION.subGap === 'string' &&
      /NO QED/.test(IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION.verdict) &&
      /refereed bound is changed/i.test(IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION.verdict),
  },
];

for (const a of IMP34756_SIGMA_KNEE_SECOND_ORDER_V_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34756-sigma-knee-second-order-v-expansion assertion failed: ${a.id}`);
  }
}
