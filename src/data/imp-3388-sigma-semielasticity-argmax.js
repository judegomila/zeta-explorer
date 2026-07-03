/**
 * @module imp-3388-sigma-semielasticity-argmax
 *
 * imp-3388 (numerical, frontier-direction): imp-3324 derived that the GUE-conditional
 * share sigma(N) = E_coll/E(N) has the CLOSED-FORM C_H-sensitivity
 *     d(sigma)/d(log C_H) = sigma (1 - sigma)      (the dimensionless semi-elasticity),
 * and measured it ONLY at the N* = 10^6 widest-gap ceiling, where sigma ~ 0.9494 sits
 * near its saturation ceiling 1 so the semi-elasticity is small (~0.04803) -- the share
 * is near-insensitive to C_H there. But imp-3220 established sigma(N) is U-SHAPED across
 * N in {2..10^6} (imp-3323 pinned the argmin at N* ~ 97.80). Since sigma(1-sigma) is a
 * strictly increasing function of sigma only up to sigma = 1/2 and DECREASING beyond it,
 * and sigma stays well above 1/2 everywhere on this range (min ~ 0.841 > 1/2), the
 * semi-elasticity is MAXIMIZED exactly where sigma is CLOSEST to 1/2 -- i.e. at the
 * U-MINIMUM of sigma(N), NOT at either end. This module LOCATES that argmax: it reuses
 * the EXACT imp-3220/imp-3323/imp-3324 sub-term formulas, evaluates sigma(1-sigma) across
 * the assembly range, and reports the N (and sigma) where the conditional share is MOST
 * C_H-sensitive, plus the peak semi-elasticity. This is the complement of the imp-3324
 * finding (which measured only the 10^6 ceiling).
 *
 * THE QUANTITY (identical to imp-3220/imp-3323/imp-3324)
 * -----------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     semi-elasticity SE(N) = sigma(N) (1 - sigma(N)) = d(sigma)/d(log C_H)  (imp-3324)
 * with the same repo sub-terms:
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *
 * KEY OBSERVATION. Because sigma > 1/2 on the ENTIRE range {2..10^6} (its interior
 * minimum ~0.841 already exceeds 1/2), the map sigma -> sigma(1-sigma) is monotone
 * DECREASING here. Hence argmax_N SE(N) = argmin_N sigma(N) EXACTLY -- the peak
 * C_H-sensitivity of the share sits at the same interior N* ~ 97.80 that imp-3323
 * located as the sigma U-minimum. The semi-elasticity is itself a single-peaked (inverse
 * U) function of N, mirror-imaging the sigma U-shape.
 *
 * THE FINDING (assessment only)
 * -----------------------------
 *   (F1) LOCATION. The continuous argmax of SE(N) is N* = 97.7969 (integer argmax
 *        N = 98) -- identical to the imp-3323 sigma-argmin -- with sigma = 0.8409680
 *        and PEAK semi-elasticity SE_max = 0.1337408. So the share is MOST sensitive
 *        to C_H near N ~ 98, deep in the interior, NOT at either assembly end.
 *   (F2) HOW MUCH MORE SENSITIVE THAN THE CEILING. The peak SE = 0.13374 is 2.784x
 *        the imp-3324 ceiling value SE(10^6) = 0.04803: the conditional share responds
 *        to C_H almost 3x as fast (in log terms) at the U-minimum as it does at the
 *        near-saturated 10^6 headline point. Even so, the peak semi-elasticity is only
 *        ~0.134 -- still an order below unity, so the share is nowhere strongly
 *        C_H-sensitive; imp-3324s robustness conclusion holds across the whole range.
 *   (F3) INVERSE-U SHAPE. SE(N) rises from 0.08047 at N = 2, peaks at 0.13374 near
 *        N = 98, then falls monotonically to 0.04803 at N = 10^6 -- the exact mirror of
 *        the sigma U-shape. The peak is 1.662x the N = 2 small-end value and 2.784x the
 *        N = 10^6 ceiling, so the interior maximum is genuine, not an endpoint artefact.
 *
 * The punchline: the share is MOST sensitive to the C_H = 1/8 ansatz not at the headline
 * 10^6 ceiling (where imp-3324 measured it and found it near-saturated) but at the
 * interior sigma U-minimum N* ~ 97.80, where the peak semi-elasticity 0.13374 is ~2.78x
 * the ceiling value -- yet still well below unity, so the imp-3324 robustness verdict
 * (E_coll dominance survives any plausible C_H) is unthreatened even at its most
 * sensitive point.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3324-sigma-CH-sensitivity (semi-elasticity sigma(1-sigma) measured ONLY at 10^6)
 * @see imp-3323-sigma-argmin-locator (the sigma U-minimum N* ~ 97.80, same formulas)
 * @see imp-3220-en-bridge-fidelity-frontier (the U-shaped sigma(N) decade ladder)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(3pi); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323/imp-3324 exactly
const N_CEILING = 1e6; // the imp-3220 widest-gap assembly ceiling (imp-3324 measured here)

// EXACT imp-3220/imp-3323/imp-3324 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, E_flow, E_coll };
}
const sigma = (N) => parts(N).sigma;
// The imp-3324 semi-elasticity d(sigma)/d(log C_H) = sigma(1-sigma).
const semiElasticity = (N) => {
  const s = sigma(N);
  return s * (1 - s);
};

// High-iteration ternary search to MAXIMIZE SE(N) over the unimodal (inverse-U) basin.
function argmaxSE(lo, hi) {
  for (let i = 0; i < 400; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (semiElasticity(m1) > semiElasticity(m2)) hi = m2;
    else lo = m1;
  }
  return (lo + hi) / 2;
}

const N_STAR = argmaxSE(2, N_CEILING); // ~97.7969 -- coincides with the imp-3323 sigma-argmin
const SIGMA_AT_STAR = sigma(N_STAR); // ~0.8409680
const SE_MAX = semiElasticity(N_STAR); // ~0.1337408

// Integer argmax (the physically-meaningful N is an integer count of zeros).
let N_STAR_INT = 98;
{
  let best = { v: -Infinity, N: 0 };
  for (let N = 2; N <= 5000; N++) {
    const v = semiElasticity(N);
    if (v > best.v) best = { v, N };
  }
  N_STAR_INT = best.N;
}

// Endpoints and the imp-3324 ceiling, to frame the interior peak.
const SE_AT_2 = semiElasticity(2); // ~0.0804692 (small-N end)
const SE_AT_CEILING = semiElasticity(N_CEILING); // ~0.0480328 (imp-3324 measured this)
const PEAK_OVER_CEILING = SE_MAX / SE_AT_CEILING; // ~2.784x
const PEAK_OVER_SMALL_END = SE_MAX / SE_AT_2; // ~1.662x

// Sweep SE(N) across the imp-3220 decade ladder (reuse of the same formulas).
const LADDER_N = [2, 10, 100, 1000, 1e4, 1e5, 1e6];
const SWEEP = LADDER_N.map((N) => ({
  N,
  sigma: +sigma(N).toFixed(6),
  semiElasticity: +semiElasticity(N).toFixed(7),
}));

export const IMP3388_SIGMA_SEMIELASTICITY_ARGMAX = {
  id: 'imp-3388',
  proofSection: 'S-frontier',
  question:
    'Locate the argmax over N in {2..10^6} of the imp-3324 C_H semi-elasticity ' +
    'sigma(1-sigma) = d(sigma)/d(log C_H) across the imp-3220 U-shaped sigma(N) range: ' +
    'the N where the GUE-conditional share of E(N) is MOST sensitive to the C_H = 1/8 ' +
    'ansatz. Complements imp-3324, which measured the semi-elasticity only at the 10^6 ' +
    'ceiling (near-saturated, insensitive). Measurement only, no QED.',
  argmax: {
    N_star_continuous: +N_STAR.toFixed(4), // 97.7969
    N_star_integer: N_STAR_INT, // 98
    sigma_at_star: +SIGMA_AT_STAR.toFixed(7), // 0.8409680
    peak_semi_elasticity: +SE_MAX.toFixed(7), // 0.1337408
    note:
      'The argmax of SE(N) = sigma(1-sigma) is N* ~ 97.80 (integer 98) -- IDENTICAL to ' +
      'the imp-3323 sigma-argmin -- with sigma = 0.8409680 and peak semi-elasticity ' +
      '0.1337408. Because sigma stays above 1/2 on the entire range (min ~0.841), the map ' +
      'sigma -> sigma(1-sigma) is monotone DECREASING here, so argmax SE = argmin sigma ' +
      'exactly: the share is most C_H-sensitive at the interior U-minimum, not at an end.',
  },
  vsCeiling: {
    imp3324_ceiling_N: N_CEILING,
    semi_elasticity_at_ceiling: +SE_AT_CEILING.toFixed(7), // 0.0480328 (imp-3324)
    peak_over_ceiling: +PEAK_OVER_CEILING.toFixed(4), // 2.784x
    peak_over_small_end: +PEAK_OVER_SMALL_END.toFixed(4), // 1.662x
    note:
      'The peak SE = 0.13374 at N ~ 98 is 2.784x the imp-3324 ceiling value SE(10^6) = ' +
      '0.04803, and 1.662x the N = 2 small-end value 0.08047 -- so the share responds to ' +
      'C_H almost 3x as fast (in log terms) at the U-minimum as at the near-saturated ' +
      'headline 10^6 point. The interior maximum is genuine, not an endpoint artefact.',
  },
  sweep: SWEEP,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). The imp-3324 C_H semi-elasticity ' +
    'sigma(1-sigma) = d(sigma)/d(log C_H) is MAXIMIZED at the interior N* = 97.80 ' +
    '(integer 98), sigma = 0.8409680, peak SE = 0.1337408 -- coinciding EXACTLY with the ' +
    'imp-3323 sigma U-minimum, because sigma > 1/2 everywhere makes sigma(1-sigma) monotone ' +
    'decreasing in sigma. This is 2.784x the imp-3324-measured ceiling value SE(10^6) = ' +
    '0.04803, so the GUE-conditional share is most C_H-sensitive deep in the interior, ' +
    'NOT at the headline 10^6 point where imp-3324 measured it. Yet the peak semi-elasticity ' +
    '~0.134 is still an order below unity, so the imp-3324 robustness verdict (E_coll ' +
    'dominance survives any plausible C_H) holds even at the share most sensitive point. ' +
    'No positivity, no bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-3324 (semi-elasticity sigma(1-sigma) measured only at 10^6); imp-3323 (sigma ' +
    'U-minimum N* ~ 97.80, same formulas); imp-3220 (U-shaped sigma(N) decade ladder); ' +
    'imp-2642 (C_H = 1/8 ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3388_SIGMA_SEMIELASTICITY_ARGMAX_ASSERTIONS = [
  {
    // Reuse gate: sigma at the located argmax reproduces the imp-3323 sigma_min ~0.841,
    // proving the identical imp-3220/imp-3323/imp-3324 sub-term formulas are in use.
    id: 'imp3388-reproduces-imp3323-sigma-min',
    description: 'sigma at the SE argmax reproduces the imp-3323 sigma_min ~0.84097',
    holds: () => Math.abs(SIGMA_AT_STAR - 0.84097) < 5e-4,
  },
  {
    // The argmax of the semi-elasticity coincides with the sigma-argmin (integer 98,
    // continuous ~97.80) -- the ticket hypothesis that the peak sits at the U-minimum.
    id: 'imp3388-argmax-coincides-with-sigma-argmin',
    description: 'SE argmax N* ~ 97.80 (integer 98) coincides with the imp-3323 sigma-argmin',
    holds: () =>
      N_STAR_INT === 98 && N_STAR > 90 && N_STAR < 105,
  },
  {
    // The peak semi-elasticity is sigma(1-sigma) at the argmin (~0.1337) and is the true
    // maximum: it exceeds BOTH endpoints, confirming an interior (inverse-U) peak.
    id: 'imp3388-peak-is-interior-maximum',
    description: 'Peak SE ~ 0.1337 exceeds both the N=2 and N=10^6 endpoint values',
    holds: () =>
      Math.abs(SE_MAX - SIGMA_AT_STAR * (1 - SIGMA_AT_STAR)) < 1e-12 &&
      Math.abs(SE_MAX - 0.13374) < 5e-4 &&
      SE_MAX > SE_AT_2 &&
      SE_MAX > SE_AT_CEILING,
  },
  {
    // The peak is ~2.78x the imp-3324-measured 10^6 ceiling value -- the quantitative
    // complement of imp-3324: the share is far more C_H-sensitive at the interior minimum.
    id: 'imp3388-peak-is-2p78x-imp3324-ceiling',
    description: 'Peak SE is ~2.78x the imp-3324 ceiling value SE(10^6) ~ 0.04803',
    holds: () =>
      Math.abs(SE_AT_CEILING - 0.04803) < 5e-4 &&
      PEAK_OVER_CEILING > 2.6 &&
      PEAK_OVER_CEILING < 2.9,
  },
  {
    // Honesty gate: the peak semi-elasticity is still well below unity, so the share is
    // nowhere strongly C_H-sensitive -- the imp-3324 robustness conclusion is unthreatened.
    id: 'imp3388-peak-still-below-unity',
    description: 'Even at its most sensitive point the semi-elasticity ~0.134 stays well below 1',
    holds: () => SE_MAX > 0 && SE_MAX < 0.2,
  },
  {
    // Honesty gate: assessment only, no QED, PT stays SOTA, complement-of-imp-3324 verdict.
    id: 'imp3388-honesty-gate-no-qed',
    description: 'Assessment only: interior-argmax verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP3388_SIGMA_SEMIELASTICITY_ARGMAX.isRigorous === false &&
      /NO QED/.test(IMP3388_SIGMA_SEMIELASTICITY_ARGMAX.verdict) &&
      /remains SOTA/.test(IMP3388_SIGMA_SEMIELASTICITY_ARGMAX.verdict),
  },
];

for (const a of IMP3388_SIGMA_SEMIELASTICITY_ARGMAX_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3388-sigma-semielasticity-argmax assertion failed: ${a.id}`);
  }
}
