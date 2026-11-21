/**
 * @module imp-96228-ushape-slope-drift-beyond-nflow
 *
 * imp-96228 (numerical, frontier-direction): imp-96210 measured the local log-slopes
 * a(N) = d ln g_t/d ln N and b(N) = -d ln g_f/d ln N (with g_t = E_trunc/E_coll,
 * g_f = E_flow/E_coll) ONLY across the [N_peak, N_flow] peak decade, where it found a
 * MONOTONE, b-dominated UPWARD drift (a rose +0.001127 nearly flat, b rose +0.007420,
 * so the decade-averaged slope sum exceeded the peak value by +0.56pct). That drift was
 * never characterized PAST N_flow. This module extends the sigma(N) grid a few decades
 * beyond N_flow using the SAME inherited imp-3406/imp-33582/imp-33723 component model
 * and asks whether the b-dominated upward drift stays monotone, saturates, or reverses.
 *
 * WHAT THE EXTENSION MEASURES
 * ---------------------------
 * Grid: N = N_flow * 10^k for k = 0..DECADES_PAST, plus a deep asymptotic probe. The
 * measured slopes (dg_t model: E_trunc frozen 3.06e-5, E_flow Gronwall, E_coll GUE-
 * conditional C_C sqrt(L/N)):
 *   log10 N   a          b          a+b
 *   6.204*    0.466653   0.311563   0.778217   (* = N_flow, imp-96210 endpoint)
 *   7.204     0.470719   0.337565   0.808284
 *   8.204     0.473951   0.357469   0.831420
 *   9.204     0.476570   0.373152   0.849722
 *   ...
 *   30        0.492626   0.462286   0.954911
 *   250       0.499126   0.495619   0.994745   (deep asymptotic probe)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (G1) THE DRIFT STAYS MONOTONE AND b-DOMINATED, NO REVERSAL. Past N_flow both a(N)
 *        and b(N) keep rising monotonically to at least N = 1e40; b keeps rising far
 *        faster than a (b climbs 0.31 -> 0.50 while a climbs 0.47 -> 0.50), so b still
 *        carries the bulk of the drift. Neither slope reverses.
 *   (G2) THE UPWARD DRIFT DECELERATES AND SATURATES. The per-half-decade increment of
 *        (a+b) shrinks strictly and monotonically (1.61e-2 near N_flow down to <5e-3 by
 *        log10 N ~ 12), so the slope sum rises toward a ceiling rather than growing
 *        without bound. The b-dominated upward drift does NOT reverse; it saturates.
 *   (G3) THE ASYMPTOTE IS a -> 1/2, b -> 1/2, a+b -> 1. As N -> infinity, E_coll ~
 *        N^{-1/2} pins d ln g_t/d ln N -> 1/2, and E_flow ~ (log-factors)/T0 with
 *        T0 ~ N/log N drives -d ln g_f/d ln N -> 1/2, so the location exponent (a+b)
 *        approaches 1 from below. The deep probe at log10 N = 250 reads
 *        a = 0.4991, b = 0.4956, a+b = 0.9947 -- consistent with the (1/2, 1/2, 1) limit.
 *
 * FAR-N IMPLICATION FOR THE U-SHAPE SHARE. Since (a+b) -> 1 monotonically from below, the
 * imp-96187 location law N_peak/N_flow = (b/a)^(1/(a+b)) has a well-defined far-N regime:
 * the exponent 1/(a+b) contracts toward 1 while b/a -> 1, so the peak and the numerator
 * crossover N_flow asymptotically coincide -- the U-shape share flattens at large N. This
 * is a diagnostic of the inherited extrapolation, not a rigorous asymptotic.
 *
 * MEASUREMENT/DERIVATION ONLY. Conditional-share diagnostic (GUE-conditional C_mb per
 * imp-486), NOT an RH bound. The component model is the inherited imp-3220/imp-3406/
 * imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED (the share stays GUE-conditional); the C_C 1/8 ansatz (imp-2642/imp-2643)
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96210-ushape-peak-slope-drift-location-law (measured a,b only across [N_peak, N_flow])
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (derived the location law P1/P2)
 * @see imp-96162-sigma-ushape-peak-eflow-recovery (measured 0.5769 and the peak slopes)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96162/imp-96210 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (inherited, no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { L, E_flow, E_coll, E_N: E_TRUNC_PT + E_flow + E_coll };
}
const g_t = (N) => E_TRUNC_PT / parts(N).E_coll;
const g_f = (N) => parts(N).E_flow / parts(N).E_coll;

// Local log-log slope d ln f / d ln N via symmetric multiplicative difference.
function logSlope(f, N) {
  const h = 1e-6;
  return (Math.log(f(N * Math.exp(h))) - Math.log(f(N * Math.exp(-h)))) / (2 * h);
}
const aOf = (N) => logSlope(g_t, N);
const bOf = (N) => -logSlope(g_f, N);

// Numerator crossover N_flow (E_flow = E_trunc) -- the imp-96210 endpoint.
function nFlow() {
  let lo = 1e2;
  let hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (parts(mid).E_flow > E_TRUNC_PT) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
const N_FLOW = nFlow();

// (G1) Extend the grid a few decades PAST N_flow and measure a(N), b(N), a+b.
const DECADES_PAST = 6;
const GRID = [];
for (let k = 0; k <= DECADES_PAST; k++) {
  const N = N_FLOW * Math.pow(10, k);
  const a = aOf(N);
  const b = bOf(N);
  GRID.push({ log10N: +Math.log10(N).toFixed(3), a: +a.toFixed(6), b: +b.toFixed(6), sum: +(a + b).toFixed(6) });
}
const A_AT_NFLOW = GRID[0].a; // ~0.466653 (imp-96210 endpoint)
const B_AT_NFLOW = GRID[0].b; // ~0.311563
const A_AT_6DEC = GRID[DECADES_PAST].a; // ~0.485 (a keeps rising, flat)
const B_AT_6DEC = GRID[DECADES_PAST].b; // ~0.41 (b keeps rising, dominant)

// Strict monotonicity of a, b, a+b on a fine half-decade grid to 1e40 (no reversal).
let MONOTONE = true;
let prevA = -1;
let prevB = -1;
let prevS = -1;
for (let k = Math.log10(N_FLOW); k <= 40; k += 0.25) {
  const N = Math.pow(10, k);
  const a = aOf(N);
  const b = bOf(N);
  const s = a + b;
  if (prevA > -1 && (a <= prevA || b <= prevB || s <= prevS)) MONOTONE = false;
  prevA = a;
  prevB = b;
  prevS = s;
}

// (G2) The (a+b) increment per half decade decelerates strictly (saturation).
let DECELERATES = true;
let prevSum2 = -1;
let prevInc = Infinity;
for (let k = Math.log10(N_FLOW); k <= 30; k += 0.5) {
  const s = aOf(Math.pow(10, k)) + bOf(Math.pow(10, k));
  if (prevSum2 > -1) {
    const inc = s - prevSum2;
    if (inc > prevInc + 1e-12) DECELERATES = false;
    prevInc = inc;
  }
  prevSum2 = s;
}

// (G3) Deep asymptotic probe: a -> 1/2, b -> 1/2, a+b -> 1.
const N_DEEP = Math.pow(10, 250);
const A_DEEP = aOf(N_DEEP); // ~0.499126
const B_DEEP = bOf(N_DEEP); // ~0.495619
const SUM_DEEP = A_DEEP + B_DEEP; // ~0.994745

export const IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW = {
  id: 'imp-96228',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-96210 a(N) = d ln g_t/d ln N, b(N) = -d ln g_f/d ln N log-slope measurement a few ' +
    'decades PAST N_flow (imp-96210 covered only [N_peak, N_flow]) and report whether the b-dominated ' +
    'upward slope drift stays monotone, saturates, or reverses, and what that implies for the far-N ' +
    'U-shape share. Measurement/derivation only; NOT an RH bound; no QED.',
  landmarks: {
    N_flow: +N_FLOW.toExponential(6), // ~1.598e6 (imp-96210 endpoint)
    decades_past: DECADES_PAST,
    grid: GRID, // a(N), b(N), a+b at N_flow * 10^k, k=0..6
    a_at_N_flow: A_AT_NFLOW, // ~0.466653
    b_at_N_flow: B_AT_NFLOW, // ~0.311563
    a_at_6_decades: A_AT_6DEC, // a keeps rising (flat)
    b_at_6_decades: B_AT_6DEC, // b keeps rising (dominant)
    a_deep_probe: +A_DEEP.toFixed(6), // ~0.499126 at log10 N = 250
    b_deep_probe: +B_DEEP.toFixed(6), // ~0.495619
    sum_deep_probe: +SUM_DEEP.toFixed(6), // ~0.994745 (-> 1)
    monotone_no_reversal: MONOTONE, // true
    increment_decelerates: DECELERATES, // true (saturation)
  },
  finding: {
    G1_drift_stays_monotone_b_dominated_no_reversal:
      'Past N_flow both a(N) and b(N) keep rising monotonically to at least N = 1e40 with no reversal; b ' +
      'climbs 0.31 -> 0.50 while a climbs 0.47 -> 0.50, so b still carries the bulk of the drift. The ' +
      'b-dominated upward drift found by imp-96210 inside the peak decade CONTINUES, monotone, beyond N_flow.',
    G2_upward_drift_decelerates_and_saturates:
      'The per-half-decade increment of (a+b) shrinks strictly and monotonically (1.61e-2 near N_flow down ' +
      'to <5e-3 by log10 N ~ 12), so the slope sum rises toward a ceiling rather than growing without ' +
      'bound. The drift does NOT reverse; it saturates.',
    G3_asymptote_half_half_one:
      'As N -> infinity, E_coll ~ N^{-1/2} pins a = d ln g_t/d ln N -> 1/2, and E_flow ~ (log-factors)/T0 ' +
      'with T0 ~ N/log N drives b = -d ln g_f/d ln N -> 1/2, so the location exponent (a+b) approaches 1 ' +
      'from below. The deep probe at log10 N = 250 reads a = 0.4991, b = 0.4956, a+b = 0.9947, consistent ' +
      'with the (1/2, 1/2, 1) limit. Far-N implication: with (a+b) -> 1 and b/a -> 1, the imp-96187 law ' +
      'N_peak/N_flow = (b/a)^(1/(a+b)) drives the peak and N_flow to coincide -- the U-shape share flattens ' +
      'at large N. Diagnostic of the inherited extrapolation, not a rigorous asymptotic.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). Extending the imp-96210 a(N), b(N) ' +
    'log-slope measurement a few decades past N_flow (with the SAME imp-3406/imp-33582/imp-33723 ' +
    'component model) shows the b-dominated upward drift STAYS MONOTONE with NO REVERSAL: both a and b ' +
    'keep rising to at least N = 1e40, b far faster than a. The per-decade increment of (a+b) ' +
    'DECELERATES strictly, so the drift SATURATES rather than growing without bound. The asymptote is ' +
    'a -> 1/2 (E_coll ~ N^{-1/2}), b -> 1/2 (E_flow ~ log-factors/T0, T0 ~ N/log N), hence (a+b) -> 1 ' +
    'from below (deep probe at log10 N = 250: a=0.4991, b=0.4956, a+b=0.9947). Far-N implication: the ' +
    'imp-96187 location law drives N_peak and N_flow to coincide, flattening the U-shape share at large N. ' +
    'Component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96210 (measured a,b only across [N_peak, N_flow]); imp-96187 (derived the location law P1/P2); ' +
    'imp-96162 (measured 0.5769 and the peak slopes); imp-3220 (interior peak sigma_max ~ 0.9494 at ' +
    'N ~ 9.22e5); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW_ASSERTIONS = [
  {
    // Anchor: reproduces the imp-96210 N_flow endpoint slopes.
    id: 'imp96228-reproduces-nflow-endpoint-slopes',
    description: 'N_flow~1.598e6; a(N_flow)~0.4667, b(N_flow)~0.3116 (imp-96210 endpoint)',
    holds: () =>
      Math.abs(N_FLOW / 1.597752e6 - 1) < 5e-3 &&
      Math.abs(A_AT_NFLOW - 0.466653) < 1e-3 &&
      Math.abs(B_AT_NFLOW - 0.311563) < 1e-3,
  },
  {
    // (G1): the b-dominated upward drift stays monotone past N_flow with no reversal.
    id: 'imp96228-drift-monotone-b-dominated-no-reversal',
    description: 'a,b,a+b strictly increasing to 1e40; b rises more than a across 6 decades past N_flow',
    holds: () =>
      MONOTONE === true &&
      A_AT_6DEC > A_AT_NFLOW &&
      B_AT_6DEC > B_AT_NFLOW &&
      B_AT_6DEC - B_AT_NFLOW > A_AT_6DEC - A_AT_NFLOW,
  },
  {
    // (G2): the (a+b) increment decelerates -- the drift saturates, does not reverse.
    id: 'imp96228-drift-decelerates-saturates',
    description: '(a+b) per-half-decade increment shrinks strictly and monotonically (saturation)',
    holds: () => DECELERATES === true,
  },
  {
    // (G3): the deep asymptotic probe lands near the (1/2, 1/2, 1) limit.
    id: 'imp96228-asymptote-half-half-one',
    description: 'deep probe at log10 N=250: a~0.499, b~0.496, a+b~0.995 -> (1/2,1/2,1)',
    holds: () =>
      A_DEEP > 0.498 &&
      A_DEEP < 0.5 &&
      B_DEEP > 0.49 &&
      B_DEEP < 0.5 &&
      SUM_DEEP > 0.99 &&
      SUM_DEEP < 1.0,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96228-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW.isRigorous === false &&
      /NO QED/.test(IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW.verdict) &&
      /refereed bound is changed/i.test(IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW.verdict),
  },
];

for (const a of IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96228-ushape-slope-drift-beyond-nflow assertion failed: ${a.id}`);
  }
}
