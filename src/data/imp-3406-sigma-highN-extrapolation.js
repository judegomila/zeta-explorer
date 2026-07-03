/**
 * @module imp-3406-sigma-highN-extrapolation
 *
 * imp-3406 (numerical, frontier-direction): imp-3220 tabulates the GUE-conditional
 * share sigma(N) = E_coll(N) / E(N) on a 7-point DECADE ladder {2..10^6} and reports
 * it is U-SHAPED, dipping to ~0.841 near N approx 100 (argmin pinned N* ~ 97.80 by
 * imp-3323) then RISING to its WIDEST sampled value ~0.949 exactly at the N* = 10^6
 * assembly ceiling. Because 10^6 is the TOP of the sampled ladder, whether the right
 * arm keeps widening, saturates below 1, or turns over ABOVE the ceiling was never
 * measured -- "widest at 10^6" could be a sampling artifact of the ladder endpoint.
 * This module reuses the EXACT imp-3220 sub-term formulas (effectiveHeightForN,
 * C_C_PINNED, the imp-398 C_F prefactor) and extrapolates the high-N branch past the
 * ceiling by direct evaluation, pinning the right-arm turning point by ternary search.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3323)
 * -----------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *              = 1 / (1 + (E_trunc + E_flow) / E_coll),
 * with the same repo sub-terms:
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *
 * THE ASYMPTOTIC MECHANISM
 * ------------------------
 * As N -> inf both N-dependent terms VANISH: E_coll ~ sqrt(log T0 / N) falls like
 * 1/sqrt(N) (up to a slow log T0 ~ log N factor) and E_flow ~ (log T0)^2 / T0 falls
 * super-polynomially, but the truncation floor E_trunc = 3.06e-5 is a CONSTANT. Hence
 *     sigma(N) -> E_coll / (E_trunc + E_coll) -> 0   as   E_coll -> 0.
 * So the right arm CANNOT rise to 1 and CANNOT plateau below 1: once E_coll falls
 * through the constant floor E_trunc, the share must turn over and decay to 0. The
 * only question the ladder left open is WHERE the turnover sits relative to 10^6.
 *
 * THE FINDING (extrapolation / measurement only)
 * ----------------------------------------------
 *   (F1) TURNS OVER, does NOT keep widening. sigma(N) has an interior MAXIMUM at
 *        N_max ~ 9.219e5 (log10 ~ 5.965), sigma_max ~ 0.949429 -- essentially AT the
 *        10^6 ceiling. The decade-ladder 10^6 sample (sigma = 0.9494076) sits just
 *        PAST the true peak, only 2.1e-5 below sigma_max: "widest at 10^6" is a
 *        flat-cap sampling artifact -- 10^6 lands on the gentle downslope of a very
 *        flat maximum, not on a still-climbing arm.
 *   (F2) DECAYS TO 0 beyond the peak. Above N_max sigma falls monotonically:
 *        sigma(1.5e6) = 0.94864, sigma(2e6) = 0.94737, back through the small-N start
 *        value sigma(2) ~ 0.9117 near N ~ 1.79e7, through 0.5 near N ~ 3.27e9, and on
 *        toward 0 (sigma(1e12) ~ 0.060, sigma(1e15) ~ 0.0023) as E_coll drops through
 *        the constant E_trunc floor (E_coll / E_trunc: 45.7 at 10^6 -> 1.76 at 10^9
 *        -> 0.06 at 10^12).
 *   (F3) SO the full sigma(N) is an N-SHAPE, not a one-sided U: rise from small N,
 *        interior MIN at N ~ 97.8 (imp-3323), interior MAX at N ~ 9.22e5, then decay
 *        to 0. The imp-3220 "widest gap at the assembly ceiling" is real but MARGINAL
 *        -- the empirical-vs-analytic conditional gap does NOT keep growing past the
 *        range PATH 1 covered; it has already essentially peaked at 10^6.
 *
 * The punchline: the right arm of the imp-3220 U turns over almost exactly at the
 * 10^6 sampling ceiling and then decays to 0 -- driven entirely by the constant
 * truncation floor E_trunc outliving the vanishing GUE-conditional E_coll. The
 * headline "widest at 10^6" is a flat-cap coincidence with the ladder endpoint, NOT
 * evidence of an unbounded-widening frontier.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder, widest at 10^6)
 * @see imp-3323-sigma-argmin-locator (interior MIN pinned at N ~ 97.80, same formulas)
 * @see imp-3324-sigma-CH-sensitivity (share saturates toward 1 in C_H; here it saturates in N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323 exactly
const N_CEILING = 1e6; // the imp-3220 sampled assembly ceiling (top of the ladder)

// EXACT imp-3220 sub-terms (no re-derivation, no fresh model).
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

// Right-arm turning point: ternary search in ln N over the unimodal right arm,
// bracketing well below the ceiling (1e4) and well above (1e9) so the interior
// MAX is found without pinning to a bracket endpoint.
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

const N_MAX = argmaxSigmaLnN(1e4, 1e9); // ~9.219e5, the right-arm interior maximum
const SIGMA_MAX = sigma(N_MAX); // ~0.949429
const SIGMA_AT_CEILING = sigma(N_CEILING); // ~0.949408 (imp-3220 widest-gap value)
const PEAK_BELOW_CEILING = SIGMA_MAX - SIGMA_AT_CEILING; // ~2.1e-5 (flat cap)

// Extended decade ladder PAST the ceiling to exhibit the turnover + decay to 0.
const LADDER_N = [1e5, 1e6, 1.5e6, 2e6, 1e7, 1e8, 1e9, 1e10, 1e12, 1e15];
const LADDER = LADDER_N.map((N) => {
  const p = parts(N);
  return {
    N: +N.toExponential(2),
    sigma: +p.sigma.toFixed(6),
    E_coll: +p.E_coll.toExponential(3),
    E_coll_over_E_trunc: +(p.E_coll / E_TRUNC_PT).toFixed(3),
  };
});

// Where the right arm falls back through reference levels (crossings above the peak).
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
const SIGMA_SMALL_N_START = sigma(2); // ~0.9117 (the imp-3220 left endpoint)
const N_BACK_TO_START = crossingAbovePeak(SIGMA_SMALL_N_START); // ~1.79e7
const N_HALF = crossingAbovePeak(0.5); // ~3.27e9

export const IMP3406_SIGMA_HIGHN_EXTRAPOLATION = {
  id: 'imp-3406',
  proofSection: 'S-frontier',
  question:
    'Measure whether the imp-3220 conditional share sigma(N) = E_coll(N)/E(N) keeps ' +
    'widening or plateaus above the sampled N* = 10^6 ceiling by extrapolating the ' +
    'high-N (right) branch of the U-shaped curve. Measurement/extrapolation only; ' +
    'empirical-vs-analytic frontier direction, no RH verdict.',
  turningPoint: {
    N_max: +N_MAX.toExponential(4), // ~9.219e5
    log10_N_max: +(Math.log(N_MAX) / Math.LN10).toFixed(4), // ~5.9647
    sigma_max: +SIGMA_MAX.toFixed(7), // ~0.9494290
    sigma_at_ceiling: +SIGMA_AT_CEILING.toFixed(7), // ~0.9494076 (imp-3220 widest gap)
    peak_above_ceiling: +PEAK_BELOW_CEILING.toExponential(3), // ~2.14e-5
    note:
      'The right arm TURNS OVER: sigma(N) has an interior MAXIMUM at N_max ~ 9.22e5 ' +
      '(log10 ~ 5.965), sigma_max ~ 0.949429 -- essentially AT the 10^6 ceiling. The ' +
      'decade-ladder 10^6 sample (0.9494076) sits just PAST the true peak, only 2.1e-5 ' +
      'below it, on the gentle downslope. "Widest at 10^6" is a flat-cap sampling ' +
      'artifact of the ladder endpoint, not a still-climbing arm.',
  },
  verdictDirection:
    'TURNS OVER (does NOT keep widening, does NOT plateau below 1). Because E_coll ~ ' +
    'sqrt(log T0/N) -> 0 while the truncation floor E_trunc = 3.06e-5 is CONSTANT, ' +
    'sigma = E_coll/(E_trunc + E_flow + E_coll) -> 0 as N -> inf. The share therefore ' +
    'peaks near 10^6 and then decays monotonically to 0.',
  decayLadder: LADDER,
  decayMarkers: {
    N_back_to_smallN_start: +N_BACK_TO_START.toExponential(3), // ~1.79e7
    sigma_smallN_start: +SIGMA_SMALL_N_START.toFixed(6), // ~0.911741 (sigma(2))
    N_down_to_half: +N_HALF.toExponential(3), // ~3.27e9
    note:
      'Above N_max the share falls monotonically back through the imp-3220 small-N ' +
      'start value sigma(2) ~ 0.9117 near N ~ 1.79e7, through 0.5 near N ~ 3.27e9, and ' +
      'on toward 0 (sigma(1e12) ~ 0.060) as E_coll drops through the constant E_trunc ' +
      'floor (E_coll/E_trunc: 45.7 at 10^6 -> 1.76 at 10^9 -> 0.06 at 10^12).',
  },
  shapeAssessment:
    'The full sigma(N) is an N-SHAPE, not a one-sided U: rise from small N, interior ' +
    'MIN at N ~ 97.8 (imp-3323), interior MAX at N ~ 9.22e5, then monotone decay to 0. ' +
    'The imp-3220 "widest empirical-vs-analytic gap at the assembly ceiling" is real ' +
    'but MARGINAL and essentially peaked -- the conditional gap does NOT keep growing ' +
    'past the range PATH 1 covered; it turns over almost exactly at 10^6 and shrinks.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). Extrapolating the high-N branch of ' +
    'the imp-3220 U-shaped conditional share past the sampled 10^6 ceiling, sigma(N) ' +
    'TURNS OVER: it attains an interior MAXIMUM at N_max ~ 9.22e5 (sigma_max ~ 0.94943), ' +
    'only 2.1e-5 above the decade-ladder 10^6 value, so "widest at 10^6" is a flat-cap ' +
    'sampling artifact. Beyond the peak the share decays monotonically to 0 (through ' +
    '0.9117 near 1.8e7, 0.5 near 3.3e9), because the GUE-conditional E_coll ~ ' +
    'sqrt(log T0/N) vanishes while the constant truncation floor E_trunc = 3.06e-5 ' +
    'persists. The share neither keeps widening nor plateaus below 1; the ' +
    'empirical-vs-analytic gap has essentially peaked at the assembly ceiling. No ' +
    'positivity, no bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-3220 (U-shaped sigma(N) decade ladder, widest at 10^6); imp-3323 (interior ' +
    'min pinned N ~ 97.80); imp-3324 (share saturates toward 1); imp-2642 (C_H = 1/8 ' +
    'ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3406_SIGMA_HIGHN_EXTRAPOLATION_ASSERTIONS = [
  {
    // Reuse gate: the sigma(N) here reproduces the imp-3220 widest-gap value ~0.9494
    // at the 10^6 ceiling, proving the identical sub-term formulas are in use.
    id: 'imp3406-reproduces-imp3220-widest-gap',
    description: 'sigma(10^6) reproduces the imp-3220 widest-gap value ~0.9494 (identical formulas)',
    holds: () => Math.abs(SIGMA_AT_CEILING - 0.9494) < 5e-4,
  },
  {
    // The right arm has an interior MAXIMUM essentially AT the 10^6 ceiling -- the
    // headline of the extrapolation: it turns over, it does not keep climbing.
    id: 'imp3406-right-arm-has-interior-max-near-ceiling',
    description: 'sigma(N) peaks at an interior N_max ~ 9.2e5, essentially at the 10^6 ceiling',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94943) < 5e-4,
  },
  {
    // The 10^6 ladder sample sits just below the true peak (flat cap): "widest at 10^6"
    // is a sampling artifact, sigma_max exceeds it by only a few 1e-5.
    id: 'imp3406-ceiling-is-flat-cap-sampling-artifact',
    description: 'sigma_max exceeds sigma(10^6) by < 1e-4 (flat cap: 10^6 is a sampling artifact)',
    holds: () => PEAK_BELOW_CEILING > 0 && PEAK_BELOW_CEILING < 1e-4,
  },
  {
    // Turnover: sigma is strictly DECREASING immediately past the ceiling -- guards
    // against a mis-read that the right arm keeps widening beyond 10^6.
    id: 'imp3406-share-decreasing-past-ceiling',
    description: 'sigma(N) strictly decreases for N > 10^6 (sigma(1e6) > sigma(1.5e6) > sigma(2e6))',
    holds: () =>
      sigma(1e6) > sigma(1.5e6) &&
      sigma(1.5e6) > sigma(2e6) &&
      sigma(2e6) > sigma(1e7),
  },
  {
    // Asymptote: the share does NOT plateau below 1 -- it decays toward 0 as the
    // constant E_trunc floor outlives the vanishing E_coll.
    id: 'imp3406-share-decays-toward-zero',
    description: 'sigma(N) -> 0 as N -> inf (E_coll vanishes, constant E_trunc floor persists)',
    holds: () => sigma(1e9) < 0.7 && sigma(1e12) < 0.1 && sigma(1e15) < sigma(1e12),
  },
  {
    // Mechanism check: at the peak E_coll dominates the constant floor (E_coll/E_trunc
    // ~ 46), but that ratio falls below 1 well past the ceiling -- the crossover that
    // drives the decay to 0.
    id: 'imp3406-ecoll-falls-through-etrunc-floor',
    description: 'E_coll/E_trunc ~ 46 at the peak but falls below 1 by N ~ 10^10 (drives the decay)',
    holds: () => {
      const rPeak = parts(N_MAX).E_coll / E_TRUNC_PT;
      const rHigh = parts(1e10).E_coll / E_TRUNC_PT;
      return rPeak > 30 && rPeak < 60 && rHigh < 1;
    },
  },
  {
    // Honesty gate: extrapolation/assessment only, turnover verdict stated, no QED,
    // PT stays SOTA, no monotone-widening or RH claim.
    id: 'imp3406-honesty-gate-no-qed',
    description: 'Assessment only: turnover verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP3406_SIGMA_HIGHN_EXTRAPOLATION.isRigorous === false &&
      /TURNS OVER/.test(IMP3406_SIGMA_HIGHN_EXTRAPOLATION.verdictDirection) &&
      /NO QED/.test(IMP3406_SIGMA_HIGHN_EXTRAPOLATION.verdict) &&
      /remains SOTA/.test(IMP3406_SIGMA_HIGHN_EXTRAPOLATION.verdict),
  },
];

for (const a of IMP3406_SIGMA_HIGHN_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3406-sigma-highN-extrapolation assertion failed: ${a.id}`);
  }
}
