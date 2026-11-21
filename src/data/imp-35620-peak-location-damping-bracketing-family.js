/**
 * @module imp-35620-peak-location-damping-bracketing-family
 *
 * imp-35620 (numerical, frontier-direction): imp-35574 formed the imp-35458
 * height-map DAMPING factor for the interior sigma-PEAK LOCATION using ONLY the
 * single RvM-inverse vs closed-surrogate T0 = 2 pi N / log N swap, and reported a
 * damping factor ~0.553 (< 1 -- mild AMPLIFICATION, the peak location moves MORE
 * than one-for-one). But imp-35555 showed the closed surrogate behaves like a
 * >5 percent effective multiplicative perturbation at the peak scale, LARGER than
 * the imp-35536 +/- 5 percent bracket -- so the ~0.55 could be inflated by the
 * surrogate specifically. This module re-forms the SAME damping factor under the
 * imp-35536 multiplicative bracketing family RvM x {1.02, 0.98, 1.05, 0.95}
 * instead of the closed surrogate, to separate the ROBUST qualitative claim
 * (amplification, damping < 1) from the surrogate-specific MAGNITUDE (~0.55).
 *
 * THE MEASUREMENT (imp-35536 locator + imp-35574 damping form, verbatim)
 * ---------------------------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll), with (imp-35017/imp-3406)
 *   E_coll = C_C sqrt(log T0 / N)  (dominant, GUE-conditional C_H),
 *   E_flow = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi) + 1)/(2pi),
 *   E_trunc = 3.06e-5   (N-independent fixed-strip route).
 * Peak located by bisecting the sign of dg_sigma/dN in log N over [1e4, 1e7]
 * (the imp-35337/imp-35536 locator). For each multiplicative arm T0 = m * RvM(N),
 * the raw-height ratio at the FIXED base peak is EXACTLY m (a constant scaling),
 * so the imp-35458 damping factor is |1 - m| / |relative peak-location shift|.
 *
 *   arm (T0 = m RvM)   N_max          rel. loc. shift   raw gap |1-m|   DAMPING
 *   RvM x 1.02         9.0150e5       -0.02209          0.02            0.9055
 *   RvM x 0.98         9.4310e5       +0.02304          0.02            0.8680
 *   RvM x 1.05         8.7249e5       -0.05356          0.05            0.9336
 *   RvM x 0.95         9.7674e5       +0.05953          0.05            0.8399
 *   closed surrogate   1.3274e6       +0.43987          0.24327         0.5530  [imp-35574]
 *
 * THE FINDING
 * -----------
 * F1 (ROBUST): the AMPLIFICATION is a map-FAMILY property, NOT a surrogate artifact.
 * Every multiplicative arm gives a damping factor STRICTLY below 1 (range
 * [0.840, 0.934], mean ~0.887), so the peak LOCATION moves more than one-for-one
 * with the height under ALL maps -- exactly the imp-35574 qualitative verdict, and
 * far from the crossover ~18x log-damping. The amplification is real.
 *
 * F2 (surrogate-SPECIFIC MAGNITUDE): the specific ~0.55 is NOT the family value.
 * The four exact constant-scaling arms sit at ~0.84-0.93 (mean ~0.887), close to
 * the imp-35536 local slope prediction (d log10 N_max / d ln(mult) ~ -0.49, i.e.
 * |rel shift| ~ ln(10) * 0.49 ~ 1.13 x |raw gap| => damping ~ 1/1.13 ~ 0.88). The
 * surrogate's stronger amplification (0.553) reflects its LARGER, N-dependent
 * (nonlinear, >5 percent effective per imp-35555) effective perturbation: a pure
 * -24.33 percent constant scaling would predict rel shift ~ +0.27 (damping ~0.88),
 * but the surrogate's slope-change adds extra shift (+43.99 percent). So the ~0.55
 * is a lower bound on the family damping, inflated by the surrogate's nonlinearity.
 *
 * VERDICT: the ~0.55 AMPLIFICATION is DIRECTIONALLY robust (damping < 1 across the
 * whole imp-35536 bracket family) but its MAGNITUDE is surrogate-specific -- the
 * cleaner constant-scaling family value is milder (~0.88). This SHARPENS imp-35574:
 * the peak LOCATION is genuinely NOT a log-damped landmark (amplified under every
 * map), yet quoting ~0.55 as THE damping number over-states the amplification the
 * local bracket family shows. The peak HEIGHT sigma_max robustness (imp-35536) and
 * the crossover ~18x log-damping (imp-35458) are untouched.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; NOT a rigorous
 * asymptotic; changes no bound. Reuses the imp-35536/imp-35574 locator + component
 * model verbatim; surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; C_C ansatz
 * (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35574-peak-location-height-map-damping (the ~0.553 surrogate-only damping factor re-formed here)
 * @see imp-35536-peak-height-map-sensitivity (the multiplicative bracketing family + local N_max slope ~ -0.49)
 * @see imp-35555 (the closed surrogate as a >5 percent effective multiplicative perturbation)
 * @see imp-35458 (the height-map damping factor definition, applied to the crossover ~18x)
 * @see imp-35337 (the interior-peak locator recomputed here)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-35017/imp-35536/imp-35574 exactly

// Height map: the EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
// Inlined from lambda-rh-height-mapping.js effectiveHeightForN (pure Math, no import).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI; // d/dT of the RvM count = log(T/2pi)/(2pi)
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}
// Closed surrogate T0 = 2 pi N / log N (imp-35413) -- kept for the imp-35574 reference row.
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// The imp-35017/imp-3406 double-surrogate sigma(N), parameterised by the height map.
function makeSigma(heightForN) {
  return function sigma(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL;
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
    return E_coll / (E_TRUNC_PT + E_flow + E_coll);
  };
}

// The imp-35337 peak locator: sign-of-derivative bisection in log N over [1e4, 1e7].
function locatePeak(sigma) {
  const dSigmadN = (N) => {
    const h = N * 1e-6;
    return (sigma(N + h) - sigma(N - h)) / (2 * h);
  };
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  const Nmax = Math.exp((a + b) / 2);
  return { Nmax, sigmaMax: sigma(Nmax) };
}

const BASE = locatePeak(makeSigma(effectiveHeightForN));

// The imp-35536 multiplicative bracketing family (RvM x {1.02, 0.98, 1.05, 0.95}).
// For a constant scaling T0 = m * RvM(N), the raw-height ratio at the FIXED base
// peak is EXACTLY m, so the imp-35574 damping factor is |1 - m| / |rel loc shift|.
const MULT_ARMS = [1.02, 0.98, 1.05, 0.95];
const ARM_LADDER = MULT_ARMS.map((mult) => {
  const p = locatePeak(makeSigma((N) => mult * effectiveHeightForN(N)));
  const relShift = (p.Nmax - BASE.Nmax) / BASE.Nmax;
  const rawGap = Math.abs(1 - mult); // exact constant-scaling raw-height gap
  const damping = rawGap / Math.abs(relShift);
  return {
    arm: `RvM x ${mult}`,
    mult,
    Nmax: +p.Nmax.toExponential(4),
    relShift: +relShift.toExponential(6),
    dLog10N: +(Math.log10(p.Nmax) - Math.log10(BASE.Nmax)).toFixed(5),
    rawGap: +rawGap.toFixed(4),
    dampingFactor: +damping.toFixed(4),
  };
});

const DAMPINGS = ARM_LADDER.map((r) => r.dampingFactor);
const DAMPING_MIN = Math.min(...DAMPINGS);
const DAMPING_MAX = Math.max(...DAMPINGS);
const DAMPING_MEAN = DAMPINGS.reduce((s, d) => s + d, 0) / DAMPINGS.length;
const ALL_ARMS_AMPLIFY = DAMPINGS.every((d) => d < 1);

// imp-35574 closed-surrogate reference row (recomputed here for the head-to-head).
const PEAK_SUR = locatePeak(makeSigma(surrogateHeightForN));
const REL_SHIFT_SUR = (PEAK_SUR.Nmax - BASE.Nmax) / BASE.Nmax;
const T0_RVM_FIXED = effectiveHeightForN(BASE.Nmax);
const T0_SUR_FIXED = surrogateHeightForN(BASE.Nmax);
const RAW_GAP_SUR = 1 - T0_SUR_FIXED / T0_RVM_FIXED; // ~0.24327
const DAMPING_SUR = RAW_GAP_SUR / Math.abs(REL_SHIFT_SUR); // ~0.5530 (imp-35574)

export const IMP35620_PEAK_LOCATION_DAMPING_BRACKETING_FAMILY = {
  id: 'imp-35620',
  proofSection: 'S-frontier',
  question:
    'imp-35574 formed the imp-35458 height-map DAMPING factor for the interior sigma-PEAK ' +
    'LOCATION (~0.553, < 1 -- AMPLIFICATION) using ONLY the RvM-inverse vs closed-surrogate ' +
    'swap. imp-35555 showed the surrogate is a >5 percent effective (larger than the imp-35536 ' +
    '+/- 5 percent bracket) multiplicative perturbation. Re-form the SAME damping factor under ' +
    'the imp-35536 multiplicative family RvM x {1.02, 0.98, 1.05, 0.95}: is the amplification ' +
    '(< 1 damping) a map-FAMILY-robust property, or specific to the closed surrogate?',
  method:
    'Re-locate N_max via the imp-35337/imp-35536 dg_sigma/dN = 0 bisection on each map ' +
    'T0 = m * effectiveHeightForN(N), m in {1.02, 0.98, 1.05, 0.95}; for a constant scaling ' +
    'the raw-height ratio at the fixed base peak is EXACTLY m, so the imp-35574 damping factor ' +
    'is |1 - m| / |relative peak-location shift|. Compare the four-arm damping range to the ' +
    'imp-35574 closed-surrogate value ~0.553.',
  base: {
    Nmax: +BASE.Nmax.toExponential(6), // 9.218633e5
    sigmaMax: +BASE.sigmaMax.toFixed(8),
  },
  armLadder: ARM_LADDER,
  familyDamping: {
    min: +DAMPING_MIN.toFixed(4), // ~0.8399
    max: +DAMPING_MAX.toFixed(4), // ~0.9336
    mean: +DAMPING_MEAN.toFixed(4), // ~0.8868
    all_arms_amplify: ALL_ARMS_AMPLIFY, // true -- every arm damping < 1
  },
  surrogateReference: {
    Nmax: +PEAK_SUR.Nmax.toExponential(6), // 1.327368e6
    relShift: +REL_SHIFT_SUR.toExponential(6), // +4.398749e-1
    rawGap: +RAW_GAP_SUR.toFixed(5), // ~0.24327
    dampingFactor: +DAMPING_SUR.toFixed(4), // ~0.5530 (imp-35574)
  },
  finding: {
    F1_amplification_is_map_family_robust:
      'Every multiplicative arm gives a damping factor STRICTLY below 1 (range ~[0.840, 0.934], ' +
      'mean ~0.887), so the peak LOCATION moves more than one-for-one with the height under ALL ' +
      'maps -- the imp-35574 AMPLIFICATION verdict is a map-FAMILY property, NOT a closed-surrogate ' +
      'artifact, and remains far from the crossover ~18x log-damping.',
    F2_magnitude_is_surrogate_specific:
      'The specific ~0.55 is NOT the family value: the four exact constant-scaling arms sit at ' +
      '~0.84-0.93 (mean ~0.887), close to the imp-35536 local slope prediction (d log10 N_max / ' +
      'd ln(mult) ~ -0.49 => damping ~ 1/(ln(10)*0.49) ~ 0.88). The surrogate is a larger, ' +
      'N-dependent (nonlinear, >5 percent effective per imp-35555) perturbation whose slope-change ' +
      'adds extra shift (+43.99 percent vs the ~+27 percent a pure -24.33 percent scaling predicts), ' +
      'inflating its damping to ~0.55 below the cleaner family value.',
    F3_sharpens_imp35574:
      'This SHARPENS imp-35574: the peak LOCATION is genuinely NOT a log-damped landmark ' +
      '(amplified under every map), but quoting ~0.55 as THE damping number over-states the ' +
      'amplification the local bracket family shows (~0.88). Peak HEIGHT sigma_max robustness ' +
      '(imp-35536) and the crossover ~18x log-damping (imp-35458) are untouched.',
  },
  isRigorous: false,
  honestStatus:
    'Re-forming the imp-35574 peak-LOCATION damping factor under the imp-35536 multiplicative ' +
    'family RvM x {1.02, 0.98, 1.05, 0.95} instead of the closed surrogate: all four arms give ' +
    'damping < 1 (range ~[0.840, 0.934], mean ~0.887), so the AMPLIFICATION is map-family-robust, ' +
    'NOT a surrogate artifact. But the specific ~0.55 is surrogate-specific -- the constant-scaling ' +
    'family value is milder (~0.88) and the surrogate inflates it via its larger, nonlinear ' +
    'effective perturbation. Measurement only on the inherited imp-3220/imp-3406 surrogate; ' +
    'reuses the imp-35536/imp-35574 locator + component model verbatim; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Re-forming the imp-35574 interior ' +
    'sigma-PEAK LOCATION damping factor under the imp-35536 multiplicative bracketing family ' +
    'RvM x {1.02, 0.98, 1.05, 0.95} rather than the single closed-surrogate swap: every arm gives ' +
    'a damping factor strictly below 1 (~0.9055, 0.8680, 0.9336, 0.8399; range ~[0.840, 0.934], ' +
    'mean ~0.887), so the AMPLIFICATION (peak location moves more than one-for-one with the ' +
    'height) is a map-FAMILY-robust property, NOT a closed-surrogate artifact -- and stays far ' +
    'from the crossover ~18x log-damping. The specific imp-35574 value ~0.553 is however ' +
    'surrogate-specific: the clean constant-scaling family value is milder (~0.88, matching the ' +
    'imp-35536 local slope d log10 N_max / d ln(mult) ~ -0.49), and the surrogate inflates the ' +
    'amplification via its larger, N-dependent (>5 percent effective per imp-35555) perturbation ' +
    'whose slope-change adds extra shift. This SHARPENS imp-35574: the peak LOCATION is genuinely ' +
    'NOT a log-damped landmark (amplified under every map) but ~0.55 over-states the family ' +
    'amplification. Reuses the imp-35536/imp-35574 locator + component model verbatim; ' +
    'surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; C_C ansatz (imp-2642/imp-2643) and ' +
    'E_trunc = 3.06e-5 (imp-2631/imp-447) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'E_coll far-tail exponent 1/2 per imp-3463; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35574 (the ~0.553 surrogate-only peak-location damping factor re-formed here); imp-35536 ' +
    '(multiplicative bracketing family + local N_max slope ~ -0.49); imp-35555 (surrogate as a ' +
    '>5 percent effective multiplicative perturbation); imp-35458 (the damping factor definition, ' +
    'crossover ~18x); imp-35337 (interior-peak locator); imp-35017 (sigma double-surrogate ' +
    'formula); imp-486 (C_mb GUE-conditional, UNTOUCHED); effectiveHeightForN (exact RvM inverse).',
};

export const IMP35620_PEAK_LOCATION_DAMPING_BRACKETING_FAMILY_ASSERTIONS = [
  {
    // The BASE (RvM) map reproduces the imp-35337/imp-35536/imp-35574 peak N_max ~ 9.2186e5.
    id: 'imp35620-reproduces-base-Nmax',
    description: 'the RvM-base peak locator reproduces the imp-35574 N_max ~ 9.2186e5',
    holds: () => Math.abs(BASE.Nmax - 9.2186e5) / 9.2186e5 < 1e-3,
  },
  {
    // F1: every multiplicative arm gives a damping factor STRICTLY below 1 (amplification).
    id: 'imp35620-all-arms-amplify',
    description: 'every RvM x {1.02,0.98,1.05,0.95} arm gives damping < 1 (map-family amplification)',
    holds: () => ALL_ARMS_AMPLIFY === true && DAMPING_MAX < 1 && DAMPING_MIN > 0.5,
  },
  {
    // F1 quantitative: the family damping range is ~[0.84, 0.93], mean ~0.887.
    id: 'imp35620-family-damping-range',
    description: 'the multiplicative-family damping range is ~[0.84, 0.93] with mean ~0.887',
    holds: () =>
      DAMPING_MIN > 0.82 && DAMPING_MIN < 0.86 &&
      DAMPING_MAX > 0.91 && DAMPING_MAX < 0.95 &&
      DAMPING_MEAN > 0.87 && DAMPING_MEAN < 0.90,
  },
  {
    // F2: the surrogate damping ~0.553 sits BELOW the whole family range (surrogate-inflated).
    id: 'imp35620-surrogate-below-family',
    description: 'the closed-surrogate damping ~0.553 is below the full multiplicative-family range',
    holds: () =>
      DAMPING_SUR > 0.54 && DAMPING_SUR < 0.57 && DAMPING_SUR < DAMPING_MIN,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35620-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35620_PEAK_LOCATION_DAMPING_BRACKETING_FAMILY.isRigorous === false &&
      /NO QED/.test(IMP35620_PEAK_LOCATION_DAMPING_BRACKETING_FAMILY.verdict) &&
      /refereed bound is changed/i.test(IMP35620_PEAK_LOCATION_DAMPING_BRACKETING_FAMILY.verdict),
  },
];

for (const a of IMP35620_PEAK_LOCATION_DAMPING_BRACKETING_FAMILY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35620-peak-location-damping-bracketing-family assertion failed: ${a.id}`,
    );
  }
}

export default IMP35620_PEAK_LOCATION_DAMPING_BRACKETING_FAMILY;
