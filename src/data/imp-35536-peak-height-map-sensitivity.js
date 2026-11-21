/**
 * @module imp-35536-peak-height-map-sensitivity
 *
 * imp-35536 (numerical, frontier-direction): the imp-3406/imp-35337 sigma interior
 * PEAK (N_max ~ 9.2186e5, sigma_max ~ 0.94942901) was located holding the height map
 * FIXED at the exact Riemann-von Mangoldt inverse effectiveHeightForN(N). imp-35458
 * posed the HEIGHT-MAP sensitivity question for the E_coll=E_trunc CROSSOVER and
 * imp-35497 applied it to the E_flow far-tail crossing. This module applies that
 * identical method to the INTERIOR PEAK: re-run the imp-35337 peak locator on the
 * double surrogate sigma(N) = E_coll / (E_trunc + E_flow + E_coll) under a bracketing
 * family of perturbed effective-height maps T0(N), and report how far N_max and
 * sigma_max move.
 *
 * THE MEASUREMENT (single swap: the height map only)
 * --------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll), with (imp-35017/imp-3406 verbatim)
 *   E_coll = C_C_PINNED sqrt(log T0 / N)  (dominant, GUE-conditional C_H),
 *   E_flow = C_F (log T0 / T0) Gronwall,   C_F = (log(T0/2pi) + 1)/(2pi),
 *   E_trunc = 3.06e-5   (N-independent fixed-strip route).
 * The imp-35337 locator bisects the sign of d sigma / dN in log N over [1e4, 1e7].
 * Only the height map T0(N) is swapped, across:
 *   (A) exact RvM inverse effectiveHeightForN (the map imp-35337 uses -- the BASE),
 *   (B) closed surrogate T0 = 2 pi N / log N,
 *   (C) multiplicative perturbations T0_base (1 +/- delta), delta in {2 percent, 5 percent}.
 *
 *   height map                       N_max          sigma_max     d(log10 N)   d(sigma)
 *   RvM inverse (BASE)               9.2186e5       0.94942901    0.00000      0
 *   closed surrogate 2 pi N / log N  1.3274e6       0.94172721   +0.15832     -7.70e-3
 *   RvM x 1.02                       9.0150e5       0.94994766   -0.00970     +5.19e-4
 *   RvM x 0.98                       9.4310e5       0.94889474   +0.00989     -5.34e-4
 *   RvM x 1.05                       8.7249e5       0.95069795   -0.02390     +1.27e-3
 *   RvM x 0.95                       9.7674e5       0.94806227   +0.02511     -1.37e-3
 *
 * THE FINDING
 * -----------
 * The two canonical maps diverge by ~32 percent at the peak scale (T0_RvM ~ 5.573e5 vs
 * T0_surrogate ~ 4.217e5 at N = N_max) -- much wider than the ~9 percent far-tail
 * divergence imp-35497 saw, because at N ~ 1e6 the surrogate 2 pi N / log N under-shoots
 * the RvM inverse by an O(1/log T0) term that is largest at low height. Yet the PEAK
 * HEIGHT sigma_max barely moves: it stays in [0.9417, 0.9507] across ALL maps, shifting
 * at most ~7.7e-3 (~0.81 percent) even under the full ~32-percent surrogate swap. The
 * peak LOCATION N_max is only moderately sensitive: the full surrogate swap moves it
 * +0.158 decades (9.22e5 -> 1.33e6, an N-ratio ~1.44x), and locally a +/-2 percent height
 * perturbation moves N_max by only -/+ ~1 percent (d log10 N_max / d ln(mult) ~ -0.49).
 * VERDICT: the sigma interior peak is ROBUST to the height-map choice -- unlike the
 * imp-35497 far-tail crossing (NOT robust, +15 decades). The peak HEIGHT sigma_max ~ 0.949
 * is a genuine feature to ~1 percent, not a surrogate artifact; the peak LOCATION N_max
 * should be quoted to ~one significant figure (~9e5-1.3e6) as a surrogate-channel landmark.
 * This flat-topped robustness matches the imp-35337 quadratic-max signature (small
 * curvature k ~ 6.4e-3): a wide, shallow interior extremum whose height is insensitive
 * to horizontal (height-map) reparametrisation.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; NOT a rigorous
 * asymptotic; changes no bound. Surrogate-vs-true fidelity (imp-35337a) UNTOUCHED;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * E_flow > 0 strictness (imp-33848) untouched; no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35337-sigma-peak-crossover-dd-certification (the peak locator recomputed here)
 * @see imp-35458 (the height-map sensitivity method, applied to the E_coll=E_trunc crossover)
 * @see imp-35497-fartail-crossing-height-map-sensitivity (the same method on the far-tail crossing)
 * @see imp-35017-sigma-landmark-pointwise-exponent-ladder (the sigma double-surrogate formula, verbatim)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-35017 exactly

// Height map A: the EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
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
// Height map B: the imp-35413 closed surrogate T0 = 2 pi N / log N.
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

const HEIGHT_MAPS = [
  { name: 'RvM inverse (BASE)', heightForN: effectiveHeightForN },
  { name: 'closed surrogate 2 pi N / log N', heightForN: surrogateHeightForN },
  { name: 'RvM x 1.02', heightForN: (N) => 1.02 * effectiveHeightForN(N) },
  { name: 'RvM x 0.98', heightForN: (N) => 0.98 * effectiveHeightForN(N) },
  { name: 'RvM x 1.05', heightForN: (N) => 1.05 * effectiveHeightForN(N) },
  { name: 'RvM x 0.95', heightForN: (N) => 0.95 * effectiveHeightForN(N) },
];

const BASE = locatePeak(makeSigma(effectiveHeightForN));
const PEAK_LADDER = HEIGHT_MAPS.map(({ name, heightForN }) => {
  const p = locatePeak(makeSigma(heightForN));
  return {
    heightMap: name,
    Nmax: +p.Nmax.toExponential(4),
    sigmaMax: +p.sigmaMax.toFixed(8),
    dLog10N: +(Math.log10(p.Nmax) - Math.log10(BASE.Nmax)).toFixed(5),
    dSigma: +(p.sigmaMax - BASE.sigmaMax).toExponential(4),
  };
});

// Height-map divergence at the peak scale, and the sigma_max spread across all maps.
const T0_SURROGATE_PEAK = surrogateHeightForN(BASE.Nmax);
const T0_RVM_PEAK = effectiveHeightForN(BASE.Nmax);
const HEIGHT_REL_DIVERGENCE_PEAK = (T0_RVM_PEAK - T0_SURROGATE_PEAK) / T0_SURROGATE_PEAK;
const SIGMA_MAX_SPREAD =
  Math.max(...PEAK_LADDER.map((r) => r.sigmaMax)) - Math.min(...PEAK_LADDER.map((r) => r.sigmaMax));
const SURROGATE_ROW = PEAK_LADDER.find((r) => r.heightMap.startsWith('closed surrogate'));

export const IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY = {
  id: 'imp-35536',
  proofSection: 'S-frontier',
  question:
    'Re-run the imp-35337 sigma interior-PEAK locator (N_max ~ 9.2186e5, sigma_max ~ ' +
    '0.94942901) under a bracketing family of perturbed effective-height maps T0(N) and ' +
    'measure how far N_max and sigma_max move -- is the peak robust to the height-map choice?',
  method:
    'Swap ONLY the height map in the imp-35017/imp-3406 double-surrogate sigma(N) = ' +
    'E_coll/(E_trunc + E_flow + E_coll) (E_coll = C_C sqrt(log T0/N), E_flow = ' +
    'C_F (log T0/T0) Gronwall, E_trunc = 3.06e-5), then bisect the sign of d sigma/dN in ' +
    'log N over [1e4, 1e7] (the imp-35337 locator) under: (A) the exact RvM inverse ' +
    'effectiveHeightForN, (B) the closed surrogate 2 pi N / log N, (C) multiplicative ' +
    'perturbations RvM (1 +/- delta), delta in {0.02, 0.05}.',
  base: {
    Nmax: +BASE.Nmax.toExponential(4),
    sigmaMax: +BASE.sigmaMax.toFixed(8),
  },
  peakLadder: PEAK_LADDER,
  heightMapDivergence: {
    T0_surrogate_at_Nmax: +T0_SURROGATE_PEAK.toExponential(6),
    T0_rvm_at_Nmax: +T0_RVM_PEAK.toExponential(6),
    relDivergence_at_Nmax: +HEIGHT_REL_DIVERGENCE_PEAK.toExponential(4),
  },
  sigmaMaxSpread: +SIGMA_MAX_SPREAD.toExponential(4),
  finding: {
    F1_maps_diverge_by_about_32pct:
      'The two canonical maps diverge by ~32 percent at the peak scale (T0_RvM ~ 5.573e5 ' +
      'vs T0_surrogate ~ 4.217e5 at N = N_max), WIDER than the ~9 percent far-tail ' +
      'divergence imp-35497 saw, because at N ~ 1e6 the surrogate under-shoots the RvM ' +
      'inverse by an O(1/log T0) term largest at low height.',
    F2_sigma_max_is_robust:
      'Despite the ~32 percent height divergence, sigma_max barely moves: it stays in ' +
      '[0.9417, 0.9507] across ALL maps, shifting at most ~7.7e-3 (~0.81 percent) even ' +
      'under the full surrogate swap. The peak HEIGHT ~0.949 is a genuine feature to ~1 ' +
      'percent, NOT a surrogate artifact.',
    F3_Nmax_moves_moderately:
      'The peak LOCATION N_max is only moderately sensitive: the full surrogate swap moves ' +
      'it +0.158 decades (9.22e5 -> 1.33e6, N-ratio ~1.44x), and locally a +/-2 percent ' +
      'height perturbation moves N_max by only -/+ ~1 percent (d log10 N_max / d ln(mult) ' +
      '~ -0.49). N_max should be quoted to ~one significant figure as a surrogate-channel landmark.',
    F4_robust_unlike_the_crossing:
      'Unlike the imp-35497 far-tail crossing (NOT robust, +15 decades under the same swap), ' +
      'the interior peak is ROBUST -- a wide, shallow flat-topped extremum (imp-35337 ' +
      'quadratic-max curvature k ~ 6.4e-3) whose height is insensitive to horizontal ' +
      '(height-map) reparametrisation.',
  },
  isRigorous: false,
  honestStatus:
    'Re-running the imp-35337 peak locator under the exact RvM inverse, the closed ' +
    'surrogate 2 pi N / log N (which sits ~32 percent below the RvM at the peak scale), ' +
    'and RvM (1 +/- 2 percent, 5 percent) multiplicative perturbations: sigma_max stays in ' +
    '[0.9417, 0.9507] (spread ~9e-3, <1 percent) while N_max drifts from 9.22e5 to 1.33e6 ' +
    '(+0.158 decades under the full surrogate swap; ~1 percent per 2-percent height ' +
    'perturbation). The sigma interior PEAK is therefore ROBUST to the height-map choice: ' +
    'the peak HEIGHT is a genuine ~0.949 feature to ~1 percent, only the peak LOCATION ' +
    'drifts to ~one significant figure. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Applying the imp-35458/imp-35497 ' +
    'height-map sensitivity method to the imp-35337 sigma interior PEAK: swapping the exact ' +
    'RvM inverse for the closed surrogate 2 pi N / log N (a ~32-percent height divergence at ' +
    'this low scale) and applying RvM (1 +/- 2 percent, 5 percent) perturbations moves ' +
    'sigma_max by at most ~7.7e-3 (~0.81 percent, spread ~9e-3 in [0.9417, 0.9507]) and ' +
    'N_max by +0.158 decades (9.22e5 -> 1.33e6). The PEAK is ROBUST to the height-map ' +
    'choice -- the peak HEIGHT ~0.949 is genuine to ~1 percent, only the location drifts to ' +
    '~one significant figure -- in sharp contrast to the imp-35497 far-tail crossing (NOT ' +
    'robust, +15 decades). Measurement only on the inherited imp-3220/imp-3406 surrogate, ' +
    'NOT a rigorous asymptotic; surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; ' +
    'E_flow > 0 strictness (imp-33848) untouched; changes no bound; no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35337 (sigma interior-peak locator, recomputed here); imp-35458 (height-map ' +
    'sensitivity method); imp-35497 (same method on the far-tail crossing); imp-35017 ' +
    '(sigma double-surrogate formula); effectiveHeightForN (exact RvM inverse); imp-486 ' +
    '(C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY_ASSERTIONS = [
  {
    // The BASE (RvM) map reproduces the imp-35337 peak location N_max ~ 9.2186e5.
    id: 'imp35536-reproduces-imp35337-Nmax',
    description: 'the RvM-base peak locator reproduces the imp-35337 N_max ~ 9.2186e5',
    holds: () => Math.abs(BASE.Nmax - 9.2186e5) / 9.2186e5 < 1e-3,
  },
  {
    // The BASE (RvM) map reproduces the imp-35337 peak height sigma_max ~ 0.94942901.
    id: 'imp35536-reproduces-imp35337-sigmaMax',
    description: 'the RvM-base peak locator reproduces the imp-35337 sigma_max ~ 0.94942901',
    holds: () => Math.abs(BASE.sigmaMax - 0.94942901) < 1e-6,
  },
  {
    // The two canonical maps diverge by ~32 percent at the peak scale.
    id: 'imp35536-maps-diverge-about-32pct',
    description: 'the RvM inverse exceeds the surrogate by ~32 percent at N = N_max',
    holds: () => HEIGHT_REL_DIVERGENCE_PEAK > 0.28 && HEIGHT_REL_DIVERGENCE_PEAK < 0.36,
  },
  {
    // sigma_max is ROBUST: total spread across all maps is under 1 percent.
    id: 'imp35536-sigma-max-robust',
    description: 'sigma_max spread across all height maps is under 1e-2 (robust peak height)',
    holds: () => SIGMA_MAX_SPREAD < 1e-2 && SIGMA_MAX_SPREAD > 0,
  },
  {
    // The full surrogate swap moves N_max by ~+0.158 decades (~1.44x), moderate not wild.
    id: 'imp35536-Nmax-shift-moderate',
    description: 'the surrogate swap shifts N_max by ~+0.158 decades (~1.44x), not decades',
    holds: () => SURROGATE_ROW.dLog10N > 0.1 && SURROGATE_ROW.dLog10N < 0.25,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35536-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY.verdict),
  },
];

for (const a of IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35536-peak-height-map-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY;
