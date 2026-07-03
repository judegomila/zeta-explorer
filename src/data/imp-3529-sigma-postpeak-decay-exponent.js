/**
 * @module imp-3529-sigma-postpeak-decay-exponent
 *
 * imp-3529 (numerical, frontier-direction): imp-3406 pinned the imp-3220 conditional
 * share sigma(N) = E_coll(N)/E(N) to an interior MAXIMUM at N_max ~ 9.219e5
 * (sigma_max ~ 0.949429) and asserted it then decays MONOTONELY to 0; imp-3463 later
 * derived the FAR-tail leading form sigma(N) ~ (C_C_PINNED/E_trunc) sqrt(logT0/N) valid
 * only far ABOVE the E_coll = E_trunc crossover (N >> 3.28e9). What was never measured
 * is the DECAY EXPONENT across the whole post-peak arm -- the intermediate regime
 * between the flat maximum (N ~ 9.22e5, sigma ~ 0.95) and the far tail (N >> 3.28e9,
 * sigma << 1). This module measures the LOCAL power-law decay exponent
 *     p(N) = - d ln sigma / d ln N
 * (central-difference in ln N on the EXACT imp-3220/imp-3406/imp-3463 sub-terms),
 * quantifying the roadmap's qualitative "monotone decay toward 0" claim and reporting
 * the N at which sigma falls below chosen thresholds.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3406 / imp-3463)
 * ---------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 * with the same repo sub-terms:
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *
 * THE MEASURED QUANTITY: the LOCAL decay exponent
 * -----------------------------------------------
 * A pure power law sigma ~ N^{-p} has constant local exponent p(N) = -dln sigma/dln N.
 * The post-peak arm is NOT a single power law -- p(N) DRIFTS. Writing sigma = x/(1+x+f)
 * with x = E_coll/E_trunc = (C_C_PINNED/E_trunc) sqrt(logT0/N) and f = E_flow/E_trunc,
 *     ln x = const + (1/2) ln logT0 - (1/2) ln N,
 *     d ln x / d ln N = -1/2 + (1/2) d(ln logT0)/d ln N,
 *     p(N) = -d ln sigma/d ln N = -d ln x/d ln N + d ln(1+x+f)/d ln N.
 * At the peak p = 0 (stationary point). Far above the crossover x,f -> 0 so the
 * denominator term vanishes and p -> 1/2 - (1/2) d(ln logT0)/d ln N, i.e. p -> 1/2
 * FROM BELOW (the slow logT0 growth keeps p just under the sqrt(1/N) exponent). The
 * post-peak arm is thus a CONTINUOUS interpolation from a flat cap (p ~ 0) to the
 * imp-3463 asymptotic sqrt law (p -> 1/2).
 *
 * THE POST-PEAK LADDER (exact sub-terms; N_max ~ 9.219e5)
 * ------------------------------------------------------
 *   N=9.22e5 sigma=0.949429 p=0.00000  E_coll/E_trunc=47.51  (interior MAX, flat cap)
 *   N=1e6    sigma=0.949408 p=0.00056  45.74
 *   N=1e7    sigma=0.926562 p=0.02332  15.58
 *   N=1e8    sigma=0.835378 p=0.07321   5.26
 *   N=1e9    sigma=0.636702 p=0.17136   1.76
 *   N=3.28e9 sigma=0.499536 p=0.23805   1.00  (E_coll = E_trunc crossover, sigma ~ 1/2)
 *   N=1e10   sigma=0.369742 p=0.30107   0.59
 *   N=1e11   sigma=0.162971 p=0.40186   0.20
 *   N=1e12   sigma=0.060440 p=0.45264   0.06
 *   N=1e13   sigma=0.020741 p=0.47311   0.02
 *   ... p continues toward 1/2: 0.4842 (1e15), 0.4889 (1e20), 0.4956 (1e50).
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) The local decay exponent p(N) rises MONOTONELY from ~0 at the interior maximum
 *        to the asymptotic 1/2, so the post-peak arm is NOT a single power law -- it is a
 *        smooth interpolation from a flat cap to the imp-3463 far-tail sqrt(1/N) law.
 *   (F2) The half-decay point sigma = 1/2 sits EXACTLY at the E_coll = E_trunc crossover
 *        N ~ 3.267e9, and there the local exponent is p ~ 0.238 -- roughly HALFWAY up to
 *        the 1/2 asymptote, i.e. the crossover is the inflection of the decay steepening.
 *   (F3) p(N) approaches 1/2 FROM BELOW (0.4731 at 1e13, 0.4956 at 1e50): the slow logT0
 *        growth (d(ln logT0)/d ln N > 0) keeps the measured exponent just under the bare
 *        sqrt(1/N) value at every finite N, matching the imp-3463 leading form.
 *   (F4) Threshold crossings (N above the peak where sigma first falls below the level):
 *        sigma<0.9 at N~2.57e7, <0.75 at ~3.17e8, <0.5 at ~3.27e9, <0.25 at ~3.26e10,
 *        <0.1 at ~3.21e11, <0.01 at ~4.62e13 -- one decade of N per ~0.4 drop early,
 *        steepening to ~one decade of sigma per decade of N once p exceeds ~0.4.
 *
 * The punchline: the roadmap's qualitative "sigma decays monotonically toward 0 past the
 * peak" is quantified by a local decay exponent that climbs smoothly from 0 (flat max) to
 * 1/2 (far-tail sqrt), inflecting through p ~ 0.238 exactly at the E_coll = E_trunc
 * crossover where sigma = 1/2 (N ~ 3.27e9). There is no single post-peak power-law
 * exponent -- the decay steepens continuously toward the imp-3463 asymptote.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form sigma ~ (C_C/E_trunc) sqrt(logT0/N))
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder, exact sub-terms)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406/imp-3463)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3463 exactly

// EXACT imp-3406/imp-3463 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, super-poly negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// The MEASURED local power-law decay exponent p(N) = -d ln sigma / d ln N, by a
// symmetric central difference in ln N (step h in log space). p == 0 at the peak,
// p -> 1/2 (from below) on the far tail.
function localDecayExponent(N) {
  const h = 1e-4;
  const lnN = Math.log(N);
  const sMinus = Math.log(sigma(Math.exp(lnN - h)));
  const sPlus = Math.log(sigma(Math.exp(lnN + h)));
  return -(sPlus - sMinus) / (2 * h);
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3406) -- the flat
// cap where the post-peak decay begins and p = 0.
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

const N_MAX = argmaxSigmaLnN(1e4, 1e9); // ~9.219e5 (imp-3406 interior maximum)
const SIGMA_MAX = sigma(N_MAX); // ~0.949429
const N_CROSS = 3.280294352e9; // imp-3444 E_coll = E_trunc crossover (sigma ~ 1/2)
const ASYMP_EXPONENT = 0.5; // the far-tail sqrt(1/N) exponent (imp-3463 leading form)

// The post-peak ladder: local decay exponent measured on the exact sub-terms from the
// flat cap out to the far tail, exhibiting the p ~ 0 -> 1/2 drift.
const LADDER_N = [N_MAX, 1e6, 1e7, 1e8, 1e9, N_CROSS, 1e10, 1e11, 1e12, 1e13];
const DECAY_LADDER = LADDER_N.map((N) => {
  const p = parts(N);
  return {
    N: +N.toExponential(3),
    sigma: +p.sigma.toFixed(6),
    p_local: +localDecayExponent(N).toFixed(5),
    E_coll_over_E_trunc: +(p.E_coll / E_TRUNC_PT).toFixed(3),
  };
});

// Where the post-peak arm falls below reference share levels (crossings above the peak).
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
const THRESHOLDS = [0.9, 0.75, 0.5, 0.25, 0.1, 0.05, 0.01].map((level) => {
  const N = crossingAbovePeak(level);
  return {
    sigma_below: level,
    N: +N.toExponential(4),
    p_local: +localDecayExponent(N).toFixed(5),
  };
});

// Far-tail exponent approaching 1/2 from below (matches imp-3463 leading form).
const P_FAR = [1e13, 1e15, 1e20, 1e50].map((N) => ({
  N: +N.toExponential(0),
  p_local: +localDecayExponent(N).toFixed(6),
}));

export const IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT = {
  id: 'imp-3529',
  proofSection: 'S-frontier',
  question:
    'Measure the sigma(N) post-peak DECAY EXPONENT past the imp-3406 interior maximum ' +
    '(N ~ 9.22e5, sigma_max ~ 0.9494): fit how the conditional share sigma(N) = ' +
    'E_coll/E(N) decays toward 0 via the local exponent p(N) = -d ln sigma/d ln N and ' +
    'report the N at which sigma falls below chosen thresholds. Measurement/extrapolation ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity: 'p(N) = -d ln sigma / d ln N   (local power-law decay exponent, central-difference in ln N)',
  peak: {
    N_max: +N_MAX.toExponential(4), // ~9.219e5
    sigma_max: +SIGMA_MAX.toFixed(7), // ~0.9494290
    p_at_peak: +localDecayExponent(N_MAX).toExponential(3), // ~0 (stationary point)
  },
  N_crossover: +N_CROSS.toExponential(6), // 3.280294e9 (imp-3444 E_coll = E_trunc, sigma ~ 1/2)
  asymptoticExponent: ASYMP_EXPONENT, // 1/2, approached FROM BELOW (imp-3463 sqrt law)
  decayLadder: DECAY_LADDER,
  thresholds: THRESHOLDS,
  farTailExponent: P_FAR,
  finding: {
    F1_exponent_climbs_0_to_half:
      'p(N) rises monotonely from ~0 at N_max to the 1/2 asymptote: the post-peak arm is ' +
      'NOT a single power law but a smooth interpolation from flat cap to sqrt(1/N).',
    F2_half_decay_at_crossover:
      'sigma = 1/2 lands exactly at the E_coll = E_trunc crossover N ~ 3.267e9, where the ' +
      'local exponent p ~ 0.238 -- roughly halfway up to the 1/2 asymptote (decay inflection).',
    F3_half_from_below:
      'p(N) -> 1/2 FROM BELOW (0.4731 at 1e13, 0.4956 at 1e50): slow logT0 growth keeps the ' +
      'measured exponent just under the bare sqrt(1/N) value, matching the imp-3463 form.',
    F4_thresholds:
      'sigma<0.9 at N~2.57e7, <0.75 at ~3.17e8, <0.5 at ~3.27e9, <0.25 at ~3.26e10, <0.1 ' +
      'at ~3.21e11, <0.01 at ~4.62e13.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Past the imp-3406 interior maximum ' +
    '(N_max ~ 9.22e5, sigma_max ~ 0.94943) the conditional share sigma(N) decays with a ' +
    'LOCAL power-law exponent p(N) = -d ln sigma/d ln N that climbs monotonely from ~0 at ' +
    'the flat cap toward the 1/2 asymptote of the imp-3463 far-tail sqrt(logT0/N) law -- ' +
    'so there is NO single post-peak exponent, the decay steepens continuously. The ' +
    'half-decay sigma = 1/2 sits exactly at the imp-3444 E_coll = E_trunc crossover ' +
    '(N ~ 3.27e9) where p ~ 0.238, and p approaches 1/2 from below (0.4731 at 1e13, ' +
    '0.4956 at 1e50) because slow logT0 growth keeps the exponent under sqrt(1/N). ' +
    'Threshold crossings above the peak: sigma<0.9 at N~2.57e7, <0.5 at ~3.27e9, <0.1 at ' +
    '~3.21e11, <0.01 at ~4.62e13. This quantifies the roadmaps qualitative monotone-decay ' +
    'claim. No positivity, no bridge closure, no RH claim, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3406 (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm); imp-3463 (far-tail ' +
    'leading form sigma ~ (C_C/E_trunc) sqrt(logT0/N)); imp-3444 (E_coll = E_trunc crossover ' +
    'N ~ 3.280e9); imp-3220 (U-shaped sigma(N) decade ladder, exact sub-terms); imp-2642 ' +
    '(C_H = 1/8 ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT_ASSERTIONS = [
  {
    // Reuse gate: the exact sub-terms reproduce the imp-3406 interior maximum
    // (N_max ~ 9.22e5, sigma_max ~ 0.94943) where the local exponent vanishes.
    id: 'imp3529-reproduces-imp3406-peak',
    description: 'N_max ~ 9.22e5, sigma_max ~ 0.94943, and the local exponent p(N_max) ~ 0 (stationary)',
    holds: () =>
      N_MAX > 5e5 &&
      N_MAX < 2e6 &&
      Math.abs(SIGMA_MAX - 0.94943) < 5e-4 &&
      Math.abs(localDecayExponent(N_MAX)) < 1e-5,
  },
  {
    // (F1): the local decay exponent is strictly increasing across the post-peak ladder,
    // rising from ~0 at the cap toward 1/2 -- the drift that rules out a single power law.
    id: 'imp3529-exponent-climbs-monotonely',
    description: 'p_local strictly increases down the post-peak ladder (from ~0 toward 1/2)',
    holds: () => {
      for (let i = 1; i < DECAY_LADDER.length; i++) {
        if (!(DECAY_LADDER[i].p_local > DECAY_LADDER[i - 1].p_local)) return false;
      }
      return DECAY_LADDER[0].p_local < 0.01 && DECAY_LADDER[DECAY_LADDER.length - 1].p_local > 0.45;
    },
  },
  {
    // (F2): the half-decay sigma = 1/2 sits at the imp-3444 E_coll = E_trunc crossover,
    // and the local exponent there is ~0.238 -- roughly halfway to the 1/2 asymptote.
    id: 'imp3529-half-decay-at-crossover',
    description: 'sigma(N_cross) ~ 0.5 and p(N_cross) ~ 0.238 (decay inflection at the crossover)',
    holds: () => {
      const nHalf = crossingAbovePeak(0.5);
      return (
        Math.abs(sigma(N_CROSS) - 0.5) < 2e-3 &&
        Math.abs(nHalf / N_CROSS - 1) < 5e-3 &&
        Math.abs(localDecayExponent(N_CROSS) - 0.238) < 5e-3
      );
    },
  },
  {
    // (F3): p(N) approaches 1/2 FROM BELOW -- strictly increasing toward but never
    // reaching 1/2 on the far tail (slow logT0 growth keeps it under sqrt(1/N)).
    id: 'imp3529-exponent-approaches-half-from-below',
    description: 'p(N) -> 1/2 from below on the far tail (0.473 at 1e13 rising to 0.496 at 1e50, all < 0.5)',
    holds: () => {
      for (let i = 1; i < P_FAR.length; i++) {
        if (!(P_FAR[i].p_local > P_FAR[i - 1].p_local)) return false;
      }
      return P_FAR.every((r) => r.p_local < ASYMP_EXPONENT && r.p_local > 0.47);
    },
  },
  {
    // (F4): the reported threshold crossings are monotone in N and land at the measured
    // decades (sigma<0.9 near 2.6e7, <0.5 near 3.3e9, <0.01 near 4.6e13).
    id: 'imp3529-threshold-crossings-monotone',
    description: 'threshold N crossings increase as the level drops; sigma<0.5 near 3.27e9, <0.01 near 4.62e13',
    holds: () => {
      for (let i = 1; i < THRESHOLDS.length; i++) {
        if (!(THRESHOLDS[i].N > THRESHOLDS[i - 1].N)) return false;
      }
      const half = THRESHOLDS.find((t) => t.sigma_below === 0.5);
      const pct1 = THRESHOLDS.find((t) => t.sigma_below === 0.01);
      return (
        Math.abs(half.N / 3.267e9 - 1) < 5e-2 && Math.abs(pct1.N / 4.62e13 - 1) < 5e-2
      );
    },
  },
  {
    // Honesty gate: measurement/derivation only, no QED, PT stays SOTA.
    id: 'imp3529-honesty-gate-no-qed',
    description: 'Measurement only: no QED, PT stays SOTA',
    holds: () =>
      IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT.verdict) &&
      /remains SOTA/.test(IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT.verdict),
  },
];

for (const a of IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3529-sigma-postpeak-decay-exponent assertion failed: ${a.id}`);
  }
}
