/**
 * @module imp-35574-peak-location-height-map-damping
 *
 * imp-35574 (numerical, frontier-direction): imp-35458 measured the HEIGHT-MAP
 * sensitivity of the E_coll = E_trunc floor CROSSOVER landmark (~3.28e9) and found
 * a ~-0.98 percent shift that was ~18x SMALLER than the ~18 percent raw-height gap
 * between the two maps -- the crossover sees only log T0, so the log DAMPS the
 * height-map choice by an order of magnitude. imp-35536 then re-ran the imp-35337
 * interior sigma-PEAK locator (N_max ~ 9.2186e5) under the same maps and reported
 * that the peak HEIGHT sigma_max is robust (~0.8 percent) while the peak LOCATION
 * drifts +0.158 decades. What imp-35536 never computed is the imp-35458 DAMPING
 * comparison itself for the peak LOCATION: does the ~18x log-damping the crossover
 * enjoys ALSO hold at the peak? This module answers that directly -- it recomputes
 * the peak N_max on the exact RvM inverse and the imp-35413 closed surrogate
 * T0 = 2 pi N / log N, then forms the SAME damping factor imp-35458 used
 * ((1 - raw-height ratio) / abs(relative landmark shift)) and compares it to the
 * crossover value.
 *
 * THE MEASUREMENT (single swap: the height map only, imp-35536 locator verbatim)
 * -----------------------------------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll), with (imp-35017/imp-3406)
 *   E_coll = C_C sqrt(log T0 / N)  (dominant, GUE-conditional C_H),
 *   E_flow = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi) + 1)/(2pi),
 *   E_trunc = 3.06e-5   (N-independent fixed-strip route).
 * Peak located by bisecting the sign of dg_sigma/dN in log N over [1e4, 1e7].
 *
 *   landmark          map (A) RvM inverse   map (B) surrogate    rel. shift (B-A)/A
 *   peak N_max        9.218633e5            1.327368e6           +0.43987  (+43.99%)
 *   crossover N       3.280294352e9         3.248060946e9        -0.00983  (-0.98%)  [imp-35458]
 *
 *   raw-height gap at fixed landmark height (surrogate / RvM):
 *   peak:      T0_sur / T0_rvm ~ 0.75673  =>  gap ~ 24.33 percent
 *   crossover: T0_sur / T0_rvm ~ 0.822    =>  gap ~ 18 percent          [imp-35458]
 *
 *   DAMPING FACTOR = (1 - raw-height ratio) / abs(relative landmark shift):
 *   peak:      0.24327 / 0.43987 ~ 0.553    (< 1 -- shift is AMPLIFIED, not damped)
 *   crossover: 0.178   / 0.00983  ~ 18       (>> 1 -- shift is log-damped 18x)   [imp-35458]
 *
 * THE FINDING
 * -----------
 * The imp-35458 log-damping does NOT carry over to the peak LOCATION. Where the
 * crossover compresses a ~18 percent raw-height gap into a ~1 percent landmark shift
 * (damping ~18x), the peak location instead maps a ~24 percent raw-height gap into a
 * ~44 percent shift -- a damping factor of ~0.55, i.e. mild AMPLIFICATION rather than
 * damping. The crossover's damping is thus ~32x stronger than the peak location's.
 * The mechanism is structural: the crossover N solves E_coll = E_trunc, giving
 * N proportional to log T0, so the height enters only through its logarithm; the peak
 * location instead solves dg_sigma/dN = 0, whose stationarity balances E_coll against
 * E_flow with no log-proportional insulation, so a height-map change moves the balance
 * point close to one-for-one. This SHARPENS the imp-35536 verdict: the peak HEIGHT
 * sigma_max ~ 0.949 is robust to the height map (imp-35536), but the peak LOCATION
 * N_max is NOT a log-damped landmark the way the crossover is -- it should be quoted
 * to ~one significant figure (~9e5 to 1.3e6) and NOT treated as height-map-insensitive.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; NOT a rigorous
 * asymptotic; changes no bound. Surrogate-vs-true fidelity (imp-35337a) UNTOUCHED;
 * C_C ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) UNTOUCHED;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per
 * imp-3463; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35458-crossover-height-map-sensitivity (the ~18x crossover damping factor mirrored here)
 * @see imp-35536-peak-height-map-sensitivity (peak sigma_max robustness + N_max drift; no damping factor)
 * @see imp-35337 (the interior-peak locator recomputed here)
 * @see imp-35413 (the closed surrogate map T0 = 2 pi N / log N)
 * @see imp-35017 (the sigma double-surrogate formula)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-35017/imp-35536 exactly

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

const PEAK_RVM = locatePeak(makeSigma(effectiveHeightForN));
const PEAK_SUR = locatePeak(makeSigma(surrogateHeightForN));

// Peak-LOCATION relative shift (surrogate vs RvM), the imp-35458 "landmark shift".
const REL_SHIFT_PEAK = (PEAK_SUR.Nmax - PEAK_RVM.Nmax) / PEAK_RVM.Nmax; // ~+0.43987
const DLOG10_PEAK = Math.log10(PEAK_SUR.Nmax) - Math.log10(PEAK_RVM.Nmax); // ~+0.15832

// Raw-height gap at the FIXED peak height (mirror imp-35458 M3: surrogate / RvM).
const T0_RVM_FIXED = effectiveHeightForN(PEAK_RVM.Nmax); // ~5.5732e5
const T0_SUR_FIXED = surrogateHeightForN(PEAK_RVM.Nmax); // ~4.2174e5
const RAW_HEIGHT_RATIO_PEAK = T0_SUR_FIXED / T0_RVM_FIXED; // ~0.75673
const LOG_T0_RATIO_PEAK = Math.log(T0_SUR_FIXED) / Math.log(T0_RVM_FIXED); // ~0.97893

// The imp-35458 damping factor, formed identically for the peak LOCATION.
const DAMPING_FACTOR_PEAK = (1 - RAW_HEIGHT_RATIO_PEAK) / Math.abs(REL_SHIFT_PEAK); // ~0.553

// imp-35458 crossover reference values (verbatim, for the head-to-head comparison).
const DAMPING_FACTOR_CROSSOVER = 18; // ~18x (imp-35458 M3)
const CROSS_VS_PEAK_DAMPING_RATIO = DAMPING_FACTOR_CROSSOVER / DAMPING_FACTOR_PEAK; // ~32x

export const IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING = {
  id: 'imp-35574',
  proofSection: 'S-frontier',
  question:
    'imp-35458 found the E_coll = E_trunc CROSSOVER shifts only ~0.98 percent between the ' +
    'RvM inverse and the closed surrogate T0 = 2 pi N / log N -- ~18x SMALLER than the ' +
    '~18 percent raw-height gap (the log damps the height-map choice). Does that same ' +
    'log-damping hold at the interior sigma PEAK location (N_max ~ 9.2186e5)? Recompute ' +
    'N_max on both maps, form the SAME imp-35458 damping factor, and compare.',
  method:
    'Swap ONLY the height map in the imp-35017/imp-3406 double-surrogate sigma(N) = ' +
    'E_coll/(E_trunc + E_flow + E_coll), bisect the sign of dg_sigma/dN in log N over ' +
    '[1e4, 1e7] (the imp-35337/imp-35536 locator) under (A) the exact RvM inverse ' +
    'effectiveHeightForN and (B) the closed surrogate 2 pi N / log N, then form the ' +
    'imp-35458 damping factor (1 - T0_sur/T0_rvm at the fixed peak height) / |relative ' +
    'peak-location shift| and compare to the crossover value ~18x.',
  peak: {
    rvm_inverse: {
      map: 'T0 = effectiveHeightForN(N) (RvM inverse, imp-35337/imp-35536 BASE)',
      N_max: +PEAK_RVM.Nmax.toExponential(6), // 9.218633e5
      sigma_max: +PEAK_RVM.sigmaMax.toFixed(8), // 0.94942901
    },
    closed_surrogate: {
      map: 'T0 = 2 pi N / log N (closed surrogate, imp-35413)',
      N_max: +PEAK_SUR.Nmax.toExponential(6), // 1.327368e6
      sigma_max: +PEAK_SUR.sigmaMax.toFixed(8),
    },
    relative_shift: +REL_SHIFT_PEAK.toExponential(6), // ~+4.398749e-1
    relative_shift_pct: +(REL_SHIFT_PEAK * 100).toFixed(3), // ~+43.987
    dLog10: +DLOG10_PEAK.toFixed(5), // ~+0.15832
  },
  rawHeightGapAtPeak: {
    T0_rvm_at_Nmax: +T0_RVM_FIXED.toExponential(6),
    T0_surrogate_at_Nmax: +T0_SUR_FIXED.toExponential(6),
    raw_height_ratio: +RAW_HEIGHT_RATIO_PEAK.toFixed(6), // ~0.756728
    raw_height_gap_pct: +((1 - RAW_HEIGHT_RATIO_PEAK) * 100).toFixed(3), // ~24.327
    log_T0_ratio: +LOG_T0_RATIO_PEAK.toFixed(6), // ~0.978932
  },
  dampingComparison: {
    damping_factor_peak: +DAMPING_FACTOR_PEAK.toFixed(4), // ~0.5530
    damping_factor_crossover: DAMPING_FACTOR_CROSSOVER, // ~18 (imp-35458)
    crossover_vs_peak_ratio: +CROSS_VS_PEAK_DAMPING_RATIO.toFixed(2), // ~32.55
    peak_is_damped: DAMPING_FACTOR_PEAK > 1, // false -- amplified, not damped
  },
  finding: {
    F1_peak_location_not_log_damped:
      'The peak LOCATION does NOT enjoy the crossover log-damping: a ~24 percent raw-height ' +
      'gap maps into a ~44 percent location shift (damping factor ~0.55, i.e. mild ' +
      'AMPLIFICATION), whereas the crossover compresses a ~18 percent gap into a ~1 percent ' +
      'shift (damping ~18x). The crossover damping is ~32x stronger than the peak location.',
    F2_mechanism_is_structural:
      'The crossover N solves E_coll = E_trunc, so N is proportional to log T0 and the height ' +
      'enters only through its logarithm; the peak location solves dg_sigma/dN = 0, a ' +
      'stationarity balancing E_coll against E_flow with no log-proportional insulation, so a ' +
      'height-map change moves the balance point close to one-for-one.',
    F3_sharpens_imp35536:
      'This sharpens the imp-35536 verdict: the peak HEIGHT sigma_max ~ 0.949 is robust to the ' +
      'height map, but the peak LOCATION N_max is NOT a log-damped landmark the way the ' +
      'crossover is -- quote it to ~one significant figure (~9e5 to 1.3e6), NOT as ' +
      'height-map-insensitive.',
  },
  isRigorous: false,
  honestStatus:
    'Recomputing the imp-35337 interior sigma-peak location under the exact RvM inverse and ' +
    'the imp-35413 closed surrogate T0 = 2 pi N / log N and forming the imp-35458 damping ' +
    'factor for the peak LOCATION: N_max moves 9.218633e5 -> 1.327368e6 (a +43.99 percent / ' +
    '+0.158-decade shift) against a ~24.33 percent raw-height gap, giving a damping factor ' +
    '~0.55 (< 1, amplification) -- ~32x weaker than the crossover ~18x. The interior-peak ' +
    'LOCATION therefore does NOT share the crossover height-map log-damping; only the peak ' +
    'HEIGHT sigma_max is robust (imp-35536). Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; changes ' +
    'no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Mirroring the imp-35458 crossover ' +
    'height-map damping analysis at the imp-35337 interior sigma PEAK: the peak LOCATION N_max ' +
    'shifts +43.99 percent (9.218633e5 -> 1.327368e6, +0.158 decades) between the RvM inverse ' +
    'and the closed surrogate T0 = 2 pi N / log N against a ~24.33 percent raw-height gap, a ' +
    'damping factor of ~0.55 -- LESS than 1, i.e. mild AMPLIFICATION -- versus the crossover ' +
    'damping of ~18x, so the crossover is ~32x more log-damped than the peak location. The ' +
    'crossover N is proportional to log T0 (height enters only logarithmically) while the peak ' +
    'solves dg_sigma/dN = 0 (no log-proportional insulation), which explains the near ' +
    'one-for-one peak-location response. This SHARPENS imp-35536: the peak HEIGHT sigma_max ~ ' +
    '0.949 is robust to the height map, but the peak LOCATION is NOT a log-damped landmark and ' +
    'should be quoted only to ~one significant figure. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; surrogate-vs-true fidelity ' +
    '(imp-35337a) UNTOUCHED; C_C ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 ' +
    '(imp-2631/imp-447) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail ' +
    'exponent 1/2 per imp-3463; changes no bound; no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35458 (crossover height-map damping ~18x, mirrored here); imp-35536 (peak sigma_max ' +
    'robustness + N_max drift, without the damping factor); imp-35337 (interior-peak locator); ' +
    'imp-35413 (closed surrogate map T0 = 2 pi N / log N); imp-35017 (sigma double-surrogate ' +
    'formula); imp-486 (C_mb GUE-conditional, UNTOUCHED); effectiveHeightForN (exact RvM inverse).',
};

export const IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING_ASSERTIONS = [
  {
    // The BASE (RvM) map reproduces the imp-35337/imp-35536 peak location N_max ~ 9.2186e5.
    id: 'imp35574-reproduces-peak-Nmax',
    description: 'the RvM-base peak locator reproduces the imp-35337 N_max ~ 9.2186e5',
    holds: () => Math.abs(PEAK_RVM.Nmax - 9.2186e5) / 9.2186e5 < 1e-3,
  },
  {
    // The peak LOCATION shift is large and positive (~+44%), NOT the <1% crossover shift.
    id: 'imp35574-peak-location-shift-large',
    description: 'the closed surrogate shifts the peak location by ~+44% (positive, >>1%)',
    holds: () =>
      REL_SHIFT_PEAK > 0.4 && REL_SHIFT_PEAK < 0.48 && Math.abs(DLOG10_PEAK - 0.15832) < 1e-3,
  },
  {
    // Raw-height gap at the peak: surrogate under-estimates by ~24% (ratio ~0.757).
    id: 'imp35574-raw-height-gap-at-peak',
    description: 'the surrogate under-estimates T0 at the peak by ~24% (ratio ~0.757)',
    holds: () => RAW_HEIGHT_RATIO_PEAK > 0.72 && RAW_HEIGHT_RATIO_PEAK < 0.8,
  },
  {
    // KEY: the peak-location damping factor is <1 (amplified), NOT the crossover ~18x.
    id: 'imp35574-peak-not-log-damped',
    description: 'the peak-location damping factor is ~0.55 (<1, amplified), unlike the ~18x crossover',
    holds: () =>
      DAMPING_FACTOR_PEAK > 0.4 &&
      DAMPING_FACTOR_PEAK < 0.7 &&
      DAMPING_FACTOR_PEAK < 1 &&
      CROSS_VS_PEAK_DAMPING_RATIO > 10,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35574-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.isRigorous === false &&
      /NO QED/.test(IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.verdict) &&
      /refereed bound is changed/i.test(IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.verdict),
  },
];

for (const a of IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35574-peak-location-height-map-damping assertion failed: ${a.id}`,
    );
  }
}

export default IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING;
