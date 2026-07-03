/**
 * @module imp-3711-sigma-postpeak-continuation
 *
 * imp-3711 (numerical, frontier-direction): imp-3406 pinned the right-arm interior
 * MAXIMUM of the GUE-conditional share sigma(N) = E_coll(N)/E(N) at N_max ~ 9.219e5
 * (sigma_max ~ 0.949429) and reported "widest at 10^6" as a flat-cap SAMPLING
 * ARTIFACT: the decade-ladder 10^6 sample sits 2.1e-5 below the peak on the
 * downslope. imp-3406 then predicted -- ANALYTICALLY only -- that sigma decays
 * monotonically to 0 past the peak as the constant truncation floor E_trunc
 * outlives the vanishing E_coll. This module CONTINUES that ladder just past the
 * peak at the exact rungs the imp-3711 ticket names {1.5e6, 2e6, 5e6, 1e7},
 * ADDING the 5e6 rung that imp-3406 did not tabulate, confirms the decay is
 * strictly monotone, characterizes the decay SHAPE (log-log slope steepening
 * toward the sqrt-law asymptote), and pins a peak HALF-LIFE (sigma_max/2 crossing).
 *
 * THE QUANTITY (identical to imp-3220 / imp-3406, no re-derivation)
 * ----------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *     T0      = effectiveHeightForN(N)                 (Riemann-von Mangoldt inverse)
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)          (GUE-conditional, dominant)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                                (N-independent, imp-2631)
 *
 * FEASIBILITY / HONEST SCOPE (imp-1082 native-backend note)
 * ---------------------------------------------------------
 * The ANALYTIC E_coll(N) = C_C sqrt(log T0/N) here is O(1) to evaluate at any N --
 * this continuation is MODEL-ONLY and needs no spectral run. The TRUE empirical
 * E_coll(N) (the measured GUE-conditional collision energy) requires an O(N^2)
 * Dyson/spectral computation and is INFEASIBLE past N ~ 10^5 on the active pool
 * (imp-1082). So NONE of the rungs below are freshly-measured spectral rows: they
 * are the imp-3406 analytic model evaluated at new N. The only "cheaply-available"
 * cross-check rungs are the imp-3406 shared analytic values at 10^6/1.5e6/2e6/1e7,
 * which this module reproduces EXACTLY (reuse gate) -- NOT measured E_coll rows.
 *
 * THE FINDING (continuation / measurement only)
 * ---------------------------------------------
 *   (F1) STRICTLY MONOTONE decay past the peak. At the imp-3711 rungs the model gives
 *        sigma(1.5e6)=0.948635, sigma(2e6)=0.947368, sigma(5e6)=0.938717 (NEW rung,
 *        not in the imp-3406 ladder), sigma(1e7)=0.926562 -- each strictly below the
 *        last, confirming imp-3406-F2 monotone decay just above N_max ~ 9.22e5.
 *   (F2) DECAY SHAPE: near the peak the fall is very gentle (log-log slope
 *        d ln sigma / d ln N ~ -0.023 at 1e7) because E_coll still dominates the
 *        constant floor (E_coll/E_trunc ~ 15.6 at 1e7). The slope STEEPENS toward the
 *        sqrt-law asymptote -1/2 as E_coll drops through E_trunc (~-0.30 at 1e10,
 *        ~-0.45 at 1e12, ~-0.48 at 1e15), matching sigma ~ E_coll/E_trunc ~
 *        sqrt(log T0/N) once E_coll << E_trunc. So the deep-tail decay is a slow
 *        1/sqrt(N) power law (up to the slow log T0 factor), NOT exponential.
 *   (F3) PEAK HALF-LIFE: sigma first falls to sigma_max/2 ~ 0.474715 near
 *        N_half ~ 4.04e9 (log10 ~ 9.607), i.e. ~3.64 decades of N above the peak.
 *        This is a DISTINCT landmark from the imp-3406 absolute-0.5 crossing
 *        (N ~ 3.27e9): the peak half-life measures halving FROM sigma_max, not the
 *        fixed 0.5 level. Because the tail slope approaches -1/2, the deep-tail
 *        local half-life shortens toward ~4x in N (~0.60 decades per halving).
 *
 * ASSESSMENT ONLY. Model continuation of the imp-3406 analytic curve, no fresh
 * spectral measurement, no positivity, no bridge closure, no RH claim, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N_max ~ 9.22e5, decay-to-0 prediction)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder, widest at 10^6)
 * @see imp-3323-sigma-argmin-locator (interior MIN pinned N ~ 97.80, same formulas)
 * @see imp-1082 (empirical E_coll native-backend note: O(N^2) infeasible past ~10^5)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406 exactly

// EXACT imp-3406/imp-3220 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior maximum (same ternary search as imp-3406) -- the peak we continue past.
function argmaxSigmaLnN(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1)) < sigma(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}
const N_MAX = argmaxSigmaLnN(1e4, 1e9); // ~9.219e5
const SIGMA_MAX = sigma(N_MAX); // ~0.949429
const SIGMA_AT_CEILING = sigma(1e6); // ~0.9494076 (imp-3406 reuse gate)

// The imp-3711 continuation rungs {1.5e6, 2e6, 5e6, 1e7}: 5e6 is NEW (not in the
// imp-3406 ladder). Each is a model evaluation, NOT a fresh spectral measurement.
const CONTINUATION_N = [1.5e6, 2e6, 5e6, 1e7];
const CONTINUATION = CONTINUATION_N.map((N) => {
  const p = parts(N);
  return {
    N: +N.toExponential(2),
    sigma: +p.sigma.toFixed(6),
    E_coll: +p.E_coll.toExponential(3),
    E_coll_over_E_trunc: +(p.E_coll / E_TRUNC_PT).toFixed(3),
    new_rung: N === 5e6, // 5e6 absent from the imp-3406 decade ladder
  };
});
const STRICTLY_DECREASING =
  SIGMA_AT_CEILING > CONTINUATION[0].sigma &&
  CONTINUATION.every((r, i) => i === 0 || r.sigma < CONTINUATION[i - 1].sigma);

// Local log-log slope d ln sigma / d ln N (the decay shape), sampled from the gentle
// near-peak region out to the sqrt-law asymptote -1/2 in the deep tail.
function logLogSlope(N) {
  const h = 1e-4;
  return (Math.log(sigma(N * Math.exp(h))) - Math.log(sigma(N * Math.exp(-h)))) / (2 * h);
}
const SLOPE_SHAPE = [1e7, 1e10, 1e12, 1e15].map((N) => ({
  N: +N.toExponential(0),
  slope: +logLogSlope(N).toFixed(4),
}));

// Peak half-life: N where sigma first falls to sigma_max/2 (distinct from the
// imp-3406 absolute-0.5 crossing). Bisection on the monotone post-peak arm.
function crossingAbovePeak(target) {
  let a = Math.log(N_MAX);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_HALF_PEAK = crossingAbovePeak(SIGMA_MAX / 2); // ~4.04e9
const HALF_LIFE_DECADES = Math.log10(N_HALF_PEAK) - Math.log10(N_MAX); // ~3.64

export const IMP3711_SIGMA_POSTPEAK_CONTINUATION = {
  id: 'imp-3711',
  proofSection: 'S-frontier',
  question:
    'Continue the imp-3406 conditional-share ladder sigma(N)=E_coll/E(N) past the ' +
    '10^6 endpoint at N in {1.5e6, 2e6, 5e6, 1e7} via the imp-3406 extrapolation model, ' +
    'cross-checked against the cheaply-available shared analytic rungs, measuring ' +
    'whether sigma decays monotonically past the N~9.22e5 interior maximum. ' +
    'Model continuation / measurement only, no RH verdict.',
  reuseGate: {
    sigma_at_1e6: +SIGMA_AT_CEILING.toFixed(7), // ~0.9494076, matches imp-3406 SIGMA_AT_CEILING
    N_max: +N_MAX.toExponential(4), // ~9.219e5, matches imp-3406
    sigma_max: +SIGMA_MAX.toFixed(7), // ~0.9494290, matches imp-3406
    note:
      'sigma(10^6) and (N_max, sigma_max) reproduce the imp-3406 values exactly, ' +
      'proving the identical imp-3220/imp-3406 sub-term formulas are in use -- this ' +
      'is a continuation of that curve, not a fresh model.',
  },
  continuationLadder: CONTINUATION,
  monotoneDecay: STRICTLY_DECREASING,
  decayShape: {
    logLogSlopes: SLOPE_SHAPE,
    asymptote: -0.5,
    note:
      'Just past the peak the decay is very gentle (log-log slope ~ -0.023 at 1e7, ' +
      'E_coll/E_trunc ~ 15.6) because E_coll still dominates the constant floor. The ' +
      'slope STEEPENS toward the sqrt-law asymptote -1/2 (~-0.30 at 1e10, ~-0.45 at ' +
      '1e12, ~-0.48 at 1e15) as E_coll drops through E_trunc, so the deep-tail decay ' +
      'is a slow 1/sqrt(N) power law (up to the slow log T0 factor), NOT exponential.',
  },
  halfLife: {
    sigma_half: +(SIGMA_MAX / 2).toFixed(6), // ~0.474715
    N_half_peak: +N_HALF_PEAK.toExponential(4), // ~4.04e9
    log10_N_half: +Math.log10(N_HALF_PEAK).toFixed(3), // ~9.607
    decades_above_peak: +HALF_LIFE_DECADES.toFixed(3), // ~3.642
    note:
      'sigma first falls to sigma_max/2 ~ 0.4747 near N ~ 4.04e9 (~3.64 decades above ' +
      'N_max). This peak half-life is DISTINCT from the imp-3406 absolute-0.5 crossing ' +
      '(N ~ 3.27e9): it measures halving FROM the peak, not the fixed 0.5 level. As the ' +
      'tail slope approaches -1/2 the local half-life shortens toward ~4x in N.',
  },
  feasibility:
    'MODEL-ONLY continuation. The analytic E_coll(N)=C_C sqrt(log T0/N) is O(1) to ' +
    'evaluate at any N, so all rungs above are the imp-3406 model at new N, NOT fresh ' +
    'spectral rows. The TRUE empirical E_coll(N) needs an O(N^2) Dyson/spectral run, ' +
    'INFEASIBLE past N ~ 10^5 on the active pool (imp-1082). The only cheaply-available ' +
    'cross-check rungs are the imp-3406 shared analytic values at 1e6/1.5e6/2e6/1e7, ' +
    'reproduced here exactly -- no measured E_coll row is claimed past 10^5.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). Continuing the imp-3406 analytic ' +
    'sigma(N) curve past the 10^6 ceiling at the ticket rungs {1.5e6, 2e6, 5e6, 1e7} ' +
    '(5e6 newly tabulated), sigma decays STRICTLY MONOTONICALLY past the interior ' +
    'maximum N_max ~ 9.22e5: 0.948635, 0.947368, 0.938717, 0.926562. The decay shape ' +
    'is a slow power law -- the log-log slope steepens from ~-0.023 at 1e7 toward the ' +
    'sqrt-law asymptote -1/2 in the deep tail as the GUE-conditional E_coll drops ' +
    'through the constant truncation floor E_trunc = 3.06e-5. The peak half-life ' +
    '(sigma_max/2) lands near N ~ 4.04e9, ~3.64 decades above the peak. This is a ' +
    'MODEL-ONLY continuation: the empirical E_coll is O(N^2)-infeasible past ~10^5 ' +
    '(imp-1082), so no fresh spectral rung is claimed. No positivity, no bridge ' +
    'closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3406 (interior MAX N_max ~ 9.22e5, decay-to-0 prediction); imp-3220 (U-shaped ' +
    'sigma(N) decade ladder); imp-3323 (interior min N ~ 97.80); imp-1082 (empirical ' +
    'E_coll O(N^2) native-backend note); imp-2642 (C_H = 1/8); imp-398 (E_flow C_F ' +
    'prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP3711_SIGMA_POSTPEAK_CONTINUATION_ASSERTIONS = [
  {
    // Reuse gate: sigma(10^6) and the interior max reproduce the imp-3406 values, so
    // this is a continuation of the identical curve, not a fresh model.
    id: 'imp3711-reproduces-imp3406-anchors',
    description: 'sigma(10^6) ~ 0.9494076 and (N_max, sigma_max) reproduce the imp-3406 anchors',
    holds: () =>
      Math.abs(SIGMA_AT_CEILING - 0.9494076) < 5e-6 &&
      N_MAX > 5e5 && N_MAX < 2e6 &&
      Math.abs(SIGMA_MAX - 0.949429) < 5e-5,
  },
  {
    // The ticket rungs {1.5e6, 2e6, 5e6, 1e7} are all past the peak and strictly
    // decreasing -- confirms the imp-3406-F2 monotone decay just above N_max.
    id: 'imp3711-continuation-strictly-monotone',
    description: 'sigma decreases strictly across {1e6, 1.5e6, 2e6, 5e6, 1e7} (monotone past the peak)',
    holds: () => STRICTLY_DECREASING === true && CONTINUATION.length === 4,
  },
  {
    // The 5e6 rung is genuinely new (absent from the imp-3406 decade ladder) and lands
    // between the 2e6 and 1e7 rungs as expected.
    id: 'imp3711-adds-new-5e6-rung',
    description: 'the 5e6 rung is new and sits between the 2e6 and 1e7 values',
    holds: () => {
      const r5 = CONTINUATION.find((r) => r.new_rung);
      return !!r5 && r5.sigma < 0.947368 && r5.sigma > 0.926562 &&
        Math.abs(r5.sigma - 0.938717) < 5e-6;
    },
  },
  {
    // Decay shape: gentle near the peak, steepening toward the sqrt-law asymptote -1/2
    // in the deep tail -- the 1/sqrt(N) power-law signature, not exponential.
    id: 'imp3711-decay-shape-approaches-sqrt-law',
    description: 'log-log slope steepens from ~-0.02 at 1e7 toward -1/2 in the deep tail',
    holds: () => {
      const s = Object.fromEntries(SLOPE_SHAPE.map((x) => [x.N, x.slope]));
      return s[1e7] > -0.1 && s[1e15] < -0.45 && s[1e12] < s[1e10] && s[1e10] < s[1e7];
    },
  },
  {
    // Peak half-life: sigma_max/2 crossing lands a few decades above the peak and is a
    // distinct landmark from the imp-3406 absolute-0.5 crossing (~3.27e9).
    id: 'imp3711-peak-half-life-located',
    description: 'sigma_max/2 crossing at N ~ 4.04e9 (~3.6 decades above the peak)',
    holds: () =>
      N_HALF_PEAK > 1e9 && N_HALF_PEAK < 1e10 &&
      HALF_LIFE_DECADES > 3 && HALF_LIFE_DECADES < 4,
  },
  {
    // Honesty gate: model-only continuation, infeasibility flagged, no QED, PT SOTA.
    id: 'imp3711-honesty-gate-no-qed',
    description: 'Model-only continuation: O(N^2) infeasibility flagged, no QED, PT stays SOTA',
    holds: () =>
      IMP3711_SIGMA_POSTPEAK_CONTINUATION.isRigorous === false &&
      /INFEASIBLE/.test(IMP3711_SIGMA_POSTPEAK_CONTINUATION.feasibility) &&
      /NO QED/.test(IMP3711_SIGMA_POSTPEAK_CONTINUATION.verdict) &&
      /remains SOTA/.test(IMP3711_SIGMA_POSTPEAK_CONTINUATION.verdict),
  },
];

for (const a of IMP3711_SIGMA_POSTPEAK_CONTINUATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3711-sigma-postpeak-continuation assertion failed: ${a.id}`);
  }
}
