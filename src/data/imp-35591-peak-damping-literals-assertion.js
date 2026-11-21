/**
 * @module imp-35591-peak-damping-literals-assertion
 * @fileoverview imp-35591 -- ASSERTION-ONLY tripwire pinning the imp-35574 peak-LOCATION
 *   vs crossover damping-factor literals against a silent height-map or locator drift.
 *
 *   imp-35574 measured the imp-35458 height-map DAMPING FACTOR at the interior sigma-PEAK
 *   location and compared it to the E_coll = E_trunc crossover. It bakes, but never pins
 *   with a recompute assertion, these figures:
 *     DAMPING_PEAK      ~ 0.5530   (< 1 -- the peak LOCATION is AMPLIFIED, not log-damped)
 *     DAMPING_CROSS     = 18       (the imp-35458 crossover value, log-damped ~18x)
 *     CROSS/PEAK ratio  ~ 32.55    (the crossover damping is ~32x stronger)
 *     peak N_max shift  9.218633e5 -> 1.327368e6  (+43.99 percent / +0.15832 decades)
 *     raw-height gap    ~ 24.33 percent  (surrogate under-estimates T0 at the peak)
 *   The source module carries only loose range assertions (1e-3 / bracket tolerances), so a
 *   silent change in effectiveHeightForN (the RvM inverse height map), surrogateHeightForN,
 *   or the imp-35337 peak locator could drift the baked damping record without tripping any
 *   build at storage precision.
 *
 *   This module INDEPENDENTLY recomputes all of the above from the same inlined
 *   effectiveHeightForN / surrogateHeightForN / sigma / locator (verbatim from imp-35574, no
 *   import), then asserts:
 *     (a) the full-precision recompute matches hard-coded 7-sig-fig reference literals within
 *         1e-6 relative -- the storage-precision tolerance per [[storage_precision_assertion_tolerance]];
 *     (b) each baked imp-35574 field reproduces EXACTLY when the source module's own display
 *         rounding (toExponential / toFixed) is re-applied to this independent recompute -- so
 *         any drift in the source recompute also trips.
 *
 *   Import-light: inlines pure-Math helpers and imports only the (import-light) imp-35574
 *   record for the exact-reproduction cross-check; never the 16.7MB zeros bundle, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 *
 *   @see imp-35574-peak-location-height-map-damping.js (source of every baked literal)
 *   @see imp-35458-crossover-height-map-sensitivity (the ~18x crossover damping mirrored)
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse, inlined here)
 *
 *   Ticket: imp-35591 (accuracy, medium). Verification-tooling only; recomputes the same
 *   already-established measurement figures; adds no new Lambda bound; imp-35337a stays OPEN;
 *   C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) UNTOUCHED.
 *   No refereed bound is changed. NO QED.
 */

import { IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING } from './imp-35574-peak-location-height-map-damping.js';

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-35017/imp-35574 exactly

// Height map A: the EXACT RvM inverse -- inlined verbatim from imp-35574.
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
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

// -- INDEPENDENT recompute of every imp-35574 damping figure --
const PEAK_RVM = locatePeak(makeSigma(effectiveHeightForN));
const PEAK_SUR = locatePeak(makeSigma(surrogateHeightForN));
const REL_SHIFT_PEAK = (PEAK_SUR.Nmax - PEAK_RVM.Nmax) / PEAK_RVM.Nmax; // ~+0.43987
const DLOG10_PEAK = Math.log10(PEAK_SUR.Nmax) - Math.log10(PEAK_RVM.Nmax); // ~+0.15832
const T0_RVM_FIXED = effectiveHeightForN(PEAK_RVM.Nmax);
const T0_SUR_FIXED = surrogateHeightForN(PEAK_RVM.Nmax);
const RAW_HEIGHT_RATIO_PEAK = T0_SUR_FIXED / T0_RVM_FIXED; // ~0.75673
const DAMPING_FACTOR_PEAK = (1 - RAW_HEIGHT_RATIO_PEAK) / Math.abs(REL_SHIFT_PEAK); // ~0.553
const DAMPING_FACTOR_CROSSOVER = 18; // imp-35458 crossover reference
const CROSS_VS_PEAK_DAMPING_RATIO = DAMPING_FACTOR_CROSSOVER / DAMPING_FACTOR_PEAK; // ~32.55

// -- 7-sig-fig reference literals (storage-precision tolerance ~1e-6 relative) --
const REF = Object.freeze({
  peakNmaxRvm: 921863.307, // interior sigma-peak N_max under the RvM inverse
  peakNmaxSur: 1327367.84, // ... under the closed surrogate
  relShiftPeak: 0.439874900, // (N_sur - N_rvm) / N_rvm
  dLog10Peak: 0.158324761, // log10 N_sur - log10 N_rvm
  rawHeightRatio: 0.756728033, // T0_sur / T0_rvm at the fixed peak height
  rawHeightGapPct: 24.3271967, // (1 - ratio) * 100
  dampingPeak: 0.553048077, // (1 - ratio) / |relShift|
  crossVsPeakRatio: 32.5468992, // 18 / dampingPeak
});

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35591_PEAK_DAMPING_RECOMPUTE = Object.freeze({
  id: 'imp-35591',
  peakNmaxRvm: PEAK_RVM.Nmax,
  peakNmaxSur: PEAK_SUR.Nmax,
  relShiftPeak: REL_SHIFT_PEAK,
  dLog10Peak: DLOG10_PEAK,
  rawHeightRatio: RAW_HEIGHT_RATIO_PEAK,
  rawHeightGapPct: (1 - RAW_HEIGHT_RATIO_PEAK) * 100,
  dampingPeak: DAMPING_FACTOR_PEAK,
  dampingCrossover: DAMPING_FACTOR_CROSSOVER,
  crossVsPeakRatio: CROSS_VS_PEAK_DAMPING_RATIO,
});

export const IMP35591_PEAK_DAMPING_LITERALS_ASSERTIONS = [
  {
    // (1) full-precision recompute matches the 7-sig-fig references within 1e-6 relative --
    //     guards effectiveHeightForN / surrogate / locator drift at storage precision.
    id: 'imp35591-recompute-matches-reference-at-storage-tol',
    description:
      'independently recomputing the peak N_max on both maps, the +44% location shift, the ' +
      '24.33% raw-height gap, the ~0.553 peak damping factor and the ~32.55x crossover/peak ' +
      'ratio matches the 7-sig-fig reference literals within 1e-6 relative',
    holds: () =>
      relClose(PEAK_RVM.Nmax, REF.peakNmaxRvm) &&
      relClose(PEAK_SUR.Nmax, REF.peakNmaxSur) &&
      relClose(REL_SHIFT_PEAK, REF.relShiftPeak) &&
      relClose(DLOG10_PEAK, REF.dLog10Peak) &&
      relClose(RAW_HEIGHT_RATIO_PEAK, REF.rawHeightRatio) &&
      relClose((1 - RAW_HEIGHT_RATIO_PEAK) * 100, REF.rawHeightGapPct) &&
      relClose(DAMPING_FACTOR_PEAK, REF.dampingPeak) &&
      relClose(CROSS_VS_PEAK_DAMPING_RATIO, REF.crossVsPeakRatio),
  },
  {
    // (2) each baked imp-35574 field reproduces EXACTLY when the source module's own display
    //     rounding is re-applied to this INDEPENDENT recompute -- catches source drift.
    id: 'imp35591-baked-imp35574-fields-reproduce-exactly',
    description:
      'each imp-35574 baked field (peak N_max on both maps, relative_shift, relative_shift_pct, ' +
      'dLog10, raw_height_ratio, raw_height_gap_pct, damping_factor_peak, crossover_vs_peak_ratio) ' +
      'equals the source display-rounding re-applied to this independent recompute',
    holds: () => {
      const m = IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING;
      return (
        m.peak.rvm_inverse.N_max === +PEAK_RVM.Nmax.toExponential(6) &&
        m.peak.closed_surrogate.N_max === +PEAK_SUR.Nmax.toExponential(6) &&
        m.peak.relative_shift === +REL_SHIFT_PEAK.toExponential(6) &&
        m.peak.relative_shift_pct === +(REL_SHIFT_PEAK * 100).toFixed(3) &&
        m.peak.dLog10 === +DLOG10_PEAK.toFixed(5) &&
        m.rawHeightGapAtPeak.raw_height_ratio === +RAW_HEIGHT_RATIO_PEAK.toFixed(6) &&
        m.rawHeightGapAtPeak.raw_height_gap_pct === +((1 - RAW_HEIGHT_RATIO_PEAK) * 100).toFixed(3) &&
        m.dampingComparison.damping_factor_peak === +DAMPING_FACTOR_PEAK.toFixed(4) &&
        m.dampingComparison.crossover_vs_peak_ratio === +CROSS_VS_PEAK_DAMPING_RATIO.toFixed(2)
      );
    },
  },
  {
    // (3) the qualitative direction: peak damping < 1 (AMPLIFIED) while the crossover is >> 1
    //     (log-damped), and the crossover is >10x stronger -- the imp-35574 finding, pinned.
    id: 'imp35591-peak-amplified-crossover-log-damped',
    description:
      'the peak-location damping factor is < 1 (amplified) while the crossover value 18 is >> 1 ' +
      '(log-damped) and the crossover damping is > 10x stronger than the peak',
    holds: () =>
      DAMPING_FACTOR_PEAK < 1 &&
      DAMPING_FACTOR_CROSSOVER > 1 &&
      CROSS_VS_PEAK_DAMPING_RATIO > 10 &&
      IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.dampingComparison.peak_is_damped === false,
  },
  {
    // (4) honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35591-honesty-gate-no-qed',
    description: 'Measurement only: source isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.isRigorous === false &&
      /NO QED/.test(IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.verdict) &&
      /refereed bound is changed/i.test(IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.verdict),
  },
];

for (const a of IMP35591_PEAK_DAMPING_LITERALS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35591-peak-damping-literals-assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35591-peak-damping-literals-assertion',
  ticket: 'imp-35591',
  recompute: IMP35591_PEAK_DAMPING_RECOMPUTE,
  reference: REF,
  storageRelTol: STORAGE_REL_TOL,
});
