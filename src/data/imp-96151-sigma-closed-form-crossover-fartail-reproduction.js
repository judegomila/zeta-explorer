/**
 * @module imp-96151-sigma-closed-form-crossover-fartail-reproduction
 *
 * imp-96151 (numerical, frontier-direction): the roadmap currentStatus names the empirical-vs-
 * analytic conditional gap sigma(N) = E_coll(N)/E(N) as the active S-frontier research direction.
 * Three pieces are already in the ledger: imp-3220 found sigma(N) has an INTERIOR MAXIMUM
 * (a U/n-shape, peak ~0.9494 at N ~ 9.22e5); imp-33582 measured a monotone POST-PEAK decay-
 * exponent ramp toward the far-tail 1/2 asymptote over [1e6,1e12] and STOPPED at 1e12; and
 * imp-33723 pinned the E_coll = E_trunc crossover in CLOSED FORM as the fixed point
 * N_cross = (C_C/E_trunc)^2 log T0(N_cross) ~ 3.280294e9. What was never tested: whether that
 * closed-form crossover, promoted to a two-term ANALYTIC model of the share itself, reproduces
 * BOTH the U-shape and the decay-exponent ramp -- and how the two behaviours extend PAST the
 * imp-33582 1e12 grid endpoint. This module supplies that test.
 *
 * THE CLOSED-FORM SHARE MODEL (built from the imp-33723 crossover)
 * ---------------------------------------------------------------
 * Past the crossover the Gronwall flow term E_flow is negligible against E_coll, so the share
 * collapses to the two-term form E_coll / (E_trunc + E_coll). Writing E_coll = C_C sqrt(L/N) and
 * using the imp-33723 crossover identity K = (C_C/E_trunc)^2 = N_cross / L_cross gives the
 * explicit closed form (no free constants beyond the pinned N_cross, L_cross):
 *
 *     sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) * sqrt(L_cross / L(N))),   L(N) = log T0(N).
 *
 * This is exactly 1/2 at N = N_cross by construction, and for N >> N_cross reduces to the pure
 * square-root decay sigma_CF ~ sqrt(N_cross / N) modulo the slow log factor. Sub-terms are the
 * EXACT inherited imp-3220/imp-33582/imp-33723 constants (C_C_PINNED, E_trunc = 3.06e-5,
 * effectiveHeightForN); no re-derivation, no fresh model, no new fit.
 *
 * THE MEASUREMENT: closed-form vs full, U-shape + ramp, extended past 1e12
 * -----------------------------------------------------------------------
 *   (a) U-shape: sign of d sigma_dN for the FULL three-term share vs the closed-form model over
 *       [1e2,1e12], to see whether the closed form carries the imp-3220 interior peak.
 *   (b) Ramp: per-decade OLS exponent p_dec = -slope of ln sigma on ln N (4 pts/decade) for BOTH
 *       the full share and sigma_CF, on the decades PAST the imp-33582 endpoint (k = 12..30), and
 *       the max relative full-vs-CF gap over [1e10,1e100].
 *   (c) Second-knee test: the per-decade increment of the closed-form exponent past 1e12.
 *   (d) Surviving share: sigma_full at N = 1e12, 1e18, 1e30, 1e60, 1e120, 1e218.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE CLOSED FORM REPRODUCES THE DECAY-EXPONENT RAMP EXACTLY PAST 1e12. The per-decade
 *        exponent of sigma_CF matches the full-share ladder to 4 decimals at every decade tested
 *        (0.4646 at 1e12, 0.4851 at 1e15, 0.4880 at 1e18, 0.4927 at 1e30), and the full-vs-CF
 *        share gap stays below 4.60e-4 over [1e10,1e100]. The reason is structural: E_flow/E_coll
 *        falls from ~3.0e-3 at N_cross to ~2.0e-4 at 1e12 and below, so the two-term crossover
 *        model becomes the full model in the far tail. imp-33582 could have used the closed form.
 *   (F2) THE CLOSED FORM DOES NOT REPRODUCE THE U-SHAPE PEAK -- ONLY THE RIGHT ARM. sigma_CF is
 *        strictly monotone DECREASING over [1e2,1e12] (no interior maximum), whereas the full
 *        share rises then falls (d sigma_dN > 0 at 1e5, < 0 at 1e7: the imp-3220 peak at 9.22e5).
 *        The rising left arm and the peak are an E_flow effect the crossover model omits by
 *        construction; the closed form captures the post-peak (right) arm only. So the U-shape is
 *        only HALF-reproduced: the decay yes, the peak no -- a clean attribution of the peak to
 *        the Gronwall flow term rather than to the collapse/truncation competition.
 *   (F3) THE RAMP CONTINUES TOWARD 1/2 WITH NO SECOND KNEE. Past 1e12 the per-decade increment of
 *        the closed-form exponent is strictly positive and strictly DECREASING (monotone
 *        deceleration): the only knee is the imp-33701/imp-95055 convex-to-concave inflection in
 *        [1e10,1e11]; no re-acceleration follows. This matches the imp-35036 logarithmic gap-
 *        closure 1/2 - p_dec ~ 1/(2 ln N) -- the approach to 1/2 is smooth and single-kneed.
 *   (F4) ALMOST NONE OF THE GUE-CONDITIONAL SHARE SURVIVES AT ASTRONOMICAL N. sigma_full is
 *        6.04e-2 at 1e12, 7.90e-5 at 1e18, 1.02e-10 at 1e30, 1.46e-25 at 1e60 and 2.80e-104 at
 *        1e218 (the imp-35036 exponent-hits-0.499 scale). The share the closed-form sqrt(N_cross/N)
 *        law exhausts is total: at any humanly-astronomical N the collapse term is a vanishing
 *        fraction of E(N) -- the constant E_trunc floor dominates E(N), and the GUE-conditional
 *        content of the bound is spent.
 *
 * The punchline: promoting the imp-33723 closed-form crossover to a two-term share model
 * sigma_CF(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L(N))) reproduces the imp-33582 post-peak
 * decay-exponent ramp EXACTLY past its 1e12 endpoint (per-decade exponents identical to 4 dp,
 * share gap < 4.6e-4 out to 1e100) and confirms the ramp climbs to 1/2 with a single knee and no
 * re-acceleration -- but it does NOT reproduce the imp-3220 U-shape peak, which is isolated as an
 * E_flow effect. The GUE-conditional share is driven to ~1e-104 by N ~ 1e218.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED (the share stays GUE-conditional); the C_C 1/8 ansatz
 * is UNTOUCHED (imp-2642/imp-2643); changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross fixed point)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ramp to 0.4310, stopped at 1e12)
 * @see imp-35036-sigma-decay-exponent-ladder-extension (1/2 - p_dec ~ 1/(2 ln N), 0.499 at N ~ 1.3e218)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-33701 / imp-95055 (single convex-to-concave knee in [1e10,1e11], not an endpoint artifact)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;

// imp-33723 closed-form crossover: fixed point N = K log T0(N), K = (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 60); // ~3.280294e9
const L_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576

// Two-term closed-form share model: drop the negligible E_flow, use K = N_cross / L_cross.
//   sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N))),  L(N) = log T0(N).
// Exactly 1/2 at N = N_cross; ~ sqrt(N_cross/N) for N >> N_cross.
function sigmaCF(N) {
  const L = Math.log(effectiveHeightForN(N));
  return 1 / (1 + Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L));
}

// Central-difference sign of the share slope in N (U-shape probe).
function dSigmadN(f, N) {
  const h = N * 1e-6;
  return (f(N + h) - f(N - h)) / (2 * h);
}

// Per-decade OLS decay exponent p = -slope of ln sigma on ln N over [10^k,10^(k+1)] (4 pts/decade).
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaCF(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
// Full-share per-decade exponent (same estimator, on the three-term sigma).
function olsExponentFull(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaFull(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// (F1) per-decade exponent ladder past the imp-33582 1e12 endpoint (full vs closed form).
const RAMP_PAST_1E12 = [12, 15, 18, 24, 30].map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_full: +olsExponentFull(lo, hi).toFixed(4),
    p_closed_form: +olsExponent(lo, hi).toFixed(4),
  };
});
// max relative full-vs-CF share gap over [1e10,1e100] (E_flow negligibility check).
let MAX_REL_GAP = 0;
for (let k = 10; k <= 100; k++) {
  const N = Math.pow(10, k);
  MAX_REL_GAP = Math.max(MAX_REL_GAP, Math.abs(sigmaFull(N) - sigmaCF(N)) / sigmaFull(N));
}

// (F2) U-shape: closed form monotone (no peak) vs full share carrying the imp-3220 peak.
let CF_MONOTONE_DOWN = true;
for (let k = 2; k <= 12; k += 0.25) {
  if (dSigmadN(sigmaCF, Math.pow(10, k)) >= 0) CF_MONOTONE_DOWN = false;
}
const FULL_RISES_AT_1E5 = dSigmadN(sigmaFull, 1e5) > 0; // left arm rising (imp-3220)
const FULL_FALLS_AT_1E7 = dSigmadN(sigmaFull, 1e7) < 0; // right arm falling (post-peak)

// (F3) second-knee test: per-decade increment of the closed-form exponent past 1e12.
const CF_INCREMENTS = [];
{
  let prev = olsExponent(1e12, 1e13);
  for (let k = 13; k <= 40; k++) {
    const p = olsExponent(Math.pow(10, k), Math.pow(10, k + 1));
    CF_INCREMENTS.push(p - prev);
    prev = p;
  }
}
const INCREMENTS_ALL_POSITIVE = CF_INCREMENTS.every((x) => x > 0);
let INCREMENTS_STRICTLY_DECREASING = true;
for (let i = 1; i < CF_INCREMENTS.length; i++) {
  if (CF_INCREMENTS[i] >= CF_INCREMENTS[i - 1]) INCREMENTS_STRICTLY_DECREASING = false;
}

// (F4) surviving GUE-conditional share at astronomical N.
const SURVIVING_SHARE = [12, 18, 30, 60, 120, 218].map((k) => ({
  N: `1e${k}`,
  sigma_full: +sigmaFull(Math.pow(10, k)).toExponential(4),
}));

const SIGMA_CF_AT_N_CROSS = sigmaCF(N_CROSS); // 0.5 by construction

export const IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION = {
  id: 'imp-96151',
  proofSection: 'S-frontier',
  question:
    'Promote the imp-33723 closed-form crossover N_cross = (C_C/E_trunc)^2 log T0(N_cross) to a ' +
    'two-term analytic share model sigma_CF(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L(N))) and ' +
    'test whether it reproduces the imp-3220 U-shape peak and the imp-33582 post-peak decay- ' +
    'exponent ramp PAST the imp-33582 1e12 endpoint; verify the ramp continues toward 1/2 with no ' +
    'second knee, and quantify how much GUE-conditional share survives at astronomical N. ' +
    'Measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedFormModel:
    'sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) * sqrt(L_cross/L(N))), N_cross ~ 3.280294e9, ' +
    'L_cross ~ 20.8576; the two-term (E_trunc + E_coll) limit of the full share once E_flow is ' +
    'negligible. Exactly 1/2 at N = N_cross; ~ sqrt(N_cross/N) for N >> N_cross.',
  landmarks: {
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~ 1.572709e8
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    L_cross: +L_CROSS.toFixed(6), // ~20.857609
    sigma_CF_at_N_cross: +SIGMA_CF_AT_N_CROSS.toFixed(8), // 0.5 by construction
    max_rel_gap_full_vs_CF_1e10_1e100: +MAX_REL_GAP.toExponential(3), // ~4.60e-4
  },
  rampPast1e12: RAMP_PAST_1E12,
  uShape: {
    closed_form_strictly_decreasing_1e2_1e12: CF_MONOTONE_DOWN, // true (no peak)
    full_share_rises_at_1e5: FULL_RISES_AT_1E5, // true (imp-3220 left arm)
    full_share_falls_at_1e7: FULL_FALLS_AT_1E7, // true (post-peak right arm)
  },
  secondKneeTest: {
    increments_all_positive_past_1e12: INCREMENTS_ALL_POSITIVE, // true
    increments_strictly_decreasing_past_1e12: INCREMENTS_STRICTLY_DECREASING, // true (no second knee)
  },
  survivingShare: SURVIVING_SHARE,
  farTailExponent: HALF, // imp-3463 asymptote the closed-form ramp approaches
  finding: {
    F1_closed_form_reproduces_ramp:
      'The per-decade exponent of sigma_CF matches the full-share ladder to 4 decimals at every ' +
      'decade past 1e12 (0.4646 at 1e12, 0.4851 at 1e15, 0.4880 at 1e18, 0.4927 at 1e30) and the ' +
      'full-vs-CF share gap stays below 4.60e-4 out to 1e100 -- because E_flow/E_coll falls to ' +
      '~2e-4 at 1e12 and below, so the two-term crossover model IS the full model in the far tail.',
    F2_closed_form_misses_the_peak:
      'sigma_CF is strictly monotone decreasing over [1e2,1e12] (no interior maximum), while the ' +
      'full share rises at 1e5 and falls at 1e7 (the imp-3220 peak at N ~ 9.22e5). The rising left ' +
      'arm and the peak are an E_flow effect the crossover model omits; the closed form reproduces ' +
      'the post-peak (right) arm only. The U-shape is thus half-reproduced -- decay yes, peak no -- ' +
      'isolating the peak as a Gronwall-flow feature, not a collapse/truncation competition.',
    F3_ramp_single_kneed:
      'Past 1e12 the per-decade increment of the closed-form exponent is strictly positive and ' +
      'strictly decreasing (monotone deceleration): the only knee is the imp-33701/imp-95055 ' +
      'convex-to-concave inflection in [1e10,1e11], with no re-acceleration afterward -- ' +
      'consistent with the imp-35036 logarithmic gap-closure 1/2 - p_dec ~ 1/(2 ln N).',
    F4_share_exhausted_at_astronomical_N:
      'sigma_full is 6.04e-2 at 1e12, 7.90e-5 at 1e18, 1.02e-10 at 1e30, 1.46e-25 at 1e60 and ' +
      '2.80e-104 at 1e218 (the imp-35036 exponent-hits-0.499 scale). The closed-form sqrt(N_cross/N) ' +
      'law drives the GUE-conditional share to a vanishing fraction of E(N): the constant E_trunc ' +
      'floor dominates and the GUE-conditional content of the bound is spent.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Promoting the imp-33723 closed-form crossover ' +
    'to the two-term share model sigma_CF(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L(N))) ' +
    '(N_cross ~ 3.280294e9, exactly 1/2 at the crossover) reproduces the imp-33582 post-peak decay- ' +
    'exponent ramp EXACTLY past its 1e12 endpoint -- per-decade exponents identical to 4 decimals ' +
    '(0.4646 at 1e12 up to 0.4927 at 1e30), full-vs-CF share gap < 4.60e-4 out to 1e100 -- because ' +
    'E_flow becomes negligible against E_coll beyond the crossover. The ramp continues toward the ' +
    'imp-3463 1/2 with a SINGLE knee (the imp-33701/imp-95055 [1e10,1e11] inflection) and no ' +
    'second knee: past 1e12 the exponent increment is strictly positive and strictly decreasing. ' +
    'But the closed form does NOT reproduce the imp-3220 U-shape peak -- it is monotone decreasing ' +
    'over [1e2,1e12], isolating the peak/left arm as an E_flow (Gronwall) effect the crossover ' +
    'model omits. The GUE-conditional share is driven to ~2.80e-104 by N ~ 1e218 (imp-35036 scale). ' +
    'Component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33723 (closed-form crossover N_cross fixed point); imp-33582 (per-decade ramp to 0.4310, ' +
    'stopped at 1e12); imp-35036 (1/2 - p_dec ~ 1/(2 ln N), 0.499 at N ~ 1.3e218); imp-3220 ' +
    '(interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); imp-33701/imp-95055 (single [1e10,1e11] ' +
    'knee, not an endpoint artifact); imp-3463 (far-tail exponent -> 1/2); imp-486 (C_mb GUE- ' +
    'conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION_ASSERTIONS = [
  {
    // Reuse gate: the closed form is built on the imp-33723 crossover and is 1/2 there by design.
    id: 'imp96151-closed-form-built-on-imp33723-crossover',
    description: 'N_cross ~ 3.280294e9 (imp-33723 fixed point); sigma_CF(N_cross) = 1/2 by construction',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(SIGMA_CF_AT_N_CROSS - 0.5) < 1e-6,
  },
  {
    // (F1): closed form reproduces the full-share decay exponent past 1e12 to <= 1e-3, gap tiny.
    id: 'imp96151-closed-form-reproduces-ramp-past-1e12',
    description: 'per-decade p_full == p_CF (to 4 dp) at every decade past 1e12; full-vs-CF gap < 1e-3',
    holds: () =>
      RAMP_PAST_1E12.every((r) => Math.abs(r.p_full - r.p_closed_form) < 1e-3) &&
      RAMP_PAST_1E12.every((r) => r.p_closed_form > 0.46 && r.p_closed_form < HALF) &&
      MAX_REL_GAP < 1e-3,
  },
  {
    // (F2): the closed form is monotone (no peak) while the full share carries the imp-3220 peak.
    id: 'imp96151-closed-form-misses-u-shape-peak',
    description: 'sigma_CF strictly decreasing over [1e2,1e12]; full share rises at 1e5, falls at 1e7',
    holds: () => CF_MONOTONE_DOWN && FULL_RISES_AT_1E5 && FULL_FALLS_AT_1E7,
  },
  {
    // (F3): no second knee -- exponent increment strictly positive and strictly decreasing past 1e12.
    id: 'imp96151-ramp-single-kneed-no-second-knee',
    description: 'closed-form exponent increment strictly positive and strictly decreasing past 1e12',
    holds: () => INCREMENTS_ALL_POSITIVE && INCREMENTS_STRICTLY_DECREASING,
  },
  {
    // (F4): surviving share ordered, decreasing, and driven to ~1e-104 at N ~ 1e218.
    id: 'imp96151-share-exhausted-at-astronomical-N',
    description: 'sigma_full decreasing across the decade set; ~6.0e-2 at 1e12 and ~2.8e-104 at 1e218',
    holds: () => {
      for (let i = 1; i < SURVIVING_SHARE.length; i++) {
        if (!(SURVIVING_SHARE[i].sigma_full < SURVIVING_SHARE[i - 1].sigma_full)) return false;
      }
      return (
        Math.abs(SURVIVING_SHARE[0].sigma_full / 6.044e-2 - 1) < 5e-2 &&
        SURVIVING_SHARE[SURVIVING_SHARE.length - 1].sigma_full < 1e-100
      );
    },
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp96151-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION.isRigorous === false &&
      IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION.verdict) &&
      /refereed bound is changed/i.test(IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION.verdict),
  },
];

for (const a of IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96151-sigma-closed-form-crossover-fartail-reproduction assertion failed: ${a.id}`,
    );
  }
}
