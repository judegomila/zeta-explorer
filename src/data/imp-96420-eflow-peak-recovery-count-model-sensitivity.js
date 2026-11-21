/**
 * @module imp-96420-eflow-peak-recovery-count-model-sensitivity
 *
 * imp-96420 (numerical, frontier-direction): MEASURE whether rebuilding the imp-96266
 * closed-form baseline sigma_CF(N) from the +7/8-corrected zero count (instead of the
 * main-term Riemann-von Mangoldt count) narrows the imp-96266 peak-recovery LOCATION
 * error (N_recon vs N_full ~ 9.219e5). imp-96266 M3 recovers the imp-3220 interior peak
 * to ~9.1% in location by re-applying the E_flow suppression to sigma_CF; imp-96387 shows
 * the +7/8 count model shifts gamma_N (hence E_coll and the height-dependent sub-terms)
 * by relative ~1/N. This module reruns the imp-96266 peak reconstruction with the height
 * map T0(N) built from the +7/8 count and reports the change in the location error.
 *
 * THE SETUP (exact imp-96266 model, only the height map swapped)
 * -------------------------------------------------------------
 * The three-term share sigma_full = E_coll / (E_trunc + E_flow + E_coll) and the first-
 * order reconstruction sigma_recon = sigma_CF * (1 - E_flow/(E_trunc+E_coll)) are the
 * imp-96266 constructions VERBATIM (same E_trunc = 3.06e-5, same Gronwall factor, same
 * C_F prefactor, same C_C_PINNED, same crossover fixed point sigma_CF). The ONLY change
 * is the height map: run A uses the main-term count height T0 = effectiveHeightForN(N)
 * (the imp-96266 baseline); run B uses the +7/8-corrected count height, the Newton inverse
 * of (T/2pi)(log(T/2pi) - 1) + 7/8 = N (the imp-96387 gammaBisect78 equation). The peak
 * locator is the identical shrinking log grid over [1e4,1e8].
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) THE +7/8 BASELINE DOES NOT NARROW THE LOCATION ERROR. Under the main-term count
 *        the peak-recovery location error is 9.07848e-2; under the +7/8 count it is
 *        9.07843e-2 -- an absolute change of only -5.11e-7 (relative -5.63e-6). The ~9.08%
 *        error is unchanged to four significant figures. The count-model choice is NOT a
 *        lever on the imp-96266 location error.
 *   (M2) BOTH PEAKS CO-MOVE, SO THE RATIO IS INVARIANT. The +7/8 count moves the full-share
 *        peak location by relative +4.64e-6 (9.218632e5 -> 9.218675e5) and the reconstructed
 *        peak by relative +4.17e-6 (1.005554e6 -> 1.005559e6). Because both peaks ride the
 *        SAME ~1/N height correction, the shifts nearly cancel in the ratio N_recon/N_full,
 *        which is why the location error barely moves. The residual -5.6e-6 change is the
 *        small DIFFERENCE of two nearly-equal +4e-6 co-shifts.
 *   (M3) THE HEIGHT SHIFT MATCHES imp-96387. At the peak height N ~ 9.22e5 the +7/8 count
 *        moves T0 by relative -8.66e-7, consistent with the imp-96387 -7.99e-7 at N = 1e6
 *        and its ~1/N scaling (larger N -> smaller relative count correction). The peak
 *        HEIGHT error is likewise unchanged (9.1936e-4 -> 9.1935e-4).
 *
 * The punchline: the imp-96266 ~9.1% peak-LOCATION error is a STRUCTURAL feature of the
 * first-order E_flow reconstruction (it drops the crossover-model curvature), NOT a
 * count-model artifact. Rebuilding sigma_CF from the +7/8-corrected count leaves the error
 * at 9.08% (changes it by ~5e-7, four orders of magnitude too small to matter), because
 * the full and reconstructed peaks co-move under the same ~1/N height correction and the
 * shift cancels in their ratio.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is the
 * inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED (the share stays GUE-conditional); the
 * C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual (main-term baseline: 9.1% location error)
 * @see imp-96387-ecoll-anchor-count-model-sensitivity-n1e4 (+7/8 count shift, ~1/N scaling)
 * @see imp-96363-ecoll-independent-second-anchor (+7/8 count path; -3.00e-8 at N = 1e6)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross)
 * @see lambda-rh-height-mapping (effectiveHeightForN: main-term count height)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-96266 exactly

// +7/8-corrected count height: Newton inverse of (T/2pi)(log(T/2pi) - 1) + 7/8 = N.
// Solves the SAME equation as the imp-96387 gammaBisect78 path, seeded from the
// main-term height for fast convergence (dg_{k*}/dt-style Newton step, no bisection).
function height78(N) {
  let T = effectiveHeightForN(N);
  for (let i = 0; i < 60; i += 1) {
    const u = T / TWO_PI;
    const f = u * (Math.log(u) - 1) + 7 / 8 - N;
    const df = Math.log(u) / TWO_PI;
    if (!(Math.abs(df) > 0)) break;
    const dT = f / df;
    T -= dT;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

// The imp-96266 model, parameterised by the height map so run A (main term) and run B
// (+7/8) differ ONLY in T0(N). Every constant is the inherited imp-3406/imp-33723 value.
function makeModel(heightFn) {
  function parts(N) {
    const T0 = heightFn(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
    const E_N = E_TRUNC_PT + E_flow + E_coll;
    return { L, E_flow, E_coll, E_trunc: E_TRUNC_PT, E_N, sigma: E_coll / E_N };
  }
  const sigmaFull = (N) => parts(N).sigma;

  // imp-33723 closed-form crossover fixed point, rebuilt on THIS height map.
  const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
  let Nx = 1e9;
  for (let i = 0; i < 60; i += 1) Nx = K_AMPL * Math.log(heightFn(Nx));
  const N_CROSS = Nx;
  const L_CROSS = Math.log(heightFn(N_CROSS));
  function sigmaCF(N) {
    const L = Math.log(heightFn(N));
    return 1 / (1 + Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L));
  }
  // First-order reconstruction: re-apply the E_flow suppression to the closed-form baseline.
  function sigmaRecon(N) {
    const p = parts(N);
    return sigmaCF(N) * (1 - p.E_flow / (p.E_trunc + p.E_coll));
  }
  return { sigmaFull, sigmaRecon, N_CROSS };
}

// Peak locator on a shrinking log grid over [1e4,1e8] (identical to imp-96266; 6 passes
// keeps the grid step above the ULP of log10(N) ~ 6, so the inner sweep stays finite).
function findPeak(f) {
  let bestN = 0;
  let bestS = -1;
  let lo = 4;
  let hi = 8;
  for (let iter = 0; iter < 6; iter += 1) {
    const step = (hi - lo) / 400;
    bestS = -1;
    for (let d = lo; d <= hi + 1e-12; d += step) {
      const N = Math.pow(10, d);
      const s = f(N);
      if (s > bestS) {
        bestS = s;
        bestN = N;
      }
    }
    const db = Math.log10(bestN);
    lo = db - step;
    hi = db + step;
  }
  return { N: bestN, sigma: bestS };
}

// Run A: main-term count baseline (imp-96266). Run B: +7/8-corrected count.
const MODEL_MAIN = makeModel(effectiveHeightForN);
const MODEL_78 = makeModel(height78);

const PEAK_FULL_MAIN = findPeak(MODEL_MAIN.sigmaFull);
const PEAK_RECON_MAIN = findPeak(MODEL_MAIN.sigmaRecon);
const PEAK_FULL_78 = findPeak(MODEL_78.sigmaFull);
const PEAK_RECON_78 = findPeak(MODEL_78.sigmaRecon);

const LOC_ERR_MAIN = Math.abs(PEAK_RECON_MAIN.N / PEAK_FULL_MAIN.N - 1);
const LOC_ERR_78 = Math.abs(PEAK_RECON_78.N / PEAK_FULL_78.N - 1);
const HEIGHT_ERR_MAIN = Math.abs(PEAK_RECON_MAIN.sigma - PEAK_FULL_MAIN.sigma);
const HEIGHT_ERR_78 = Math.abs(PEAK_RECON_78.sigma - PEAK_FULL_78.sigma);

const LOC_ERR_ABS_DELTA = LOC_ERR_78 - LOC_ERR_MAIN; // ~ -5.11e-7
const LOC_ERR_REL_DELTA = LOC_ERR_ABS_DELTA / LOC_ERR_MAIN; // ~ -5.63e-6
const FULL_PEAK_REL_SHIFT = PEAK_FULL_78.N / PEAK_FULL_MAIN.N - 1; // ~ +4.64e-6
const RECON_PEAK_REL_SHIFT = PEAK_RECON_78.N / PEAK_RECON_MAIN.N - 1; // ~ +4.17e-6
const HEIGHT_MAP_REL_SHIFT_AT_PEAK =
  height78(PEAK_FULL_MAIN.N) / effectiveHeightForN(PEAK_FULL_MAIN.N) - 1; // ~ -8.66e-7

export const IMP96420_EFLOW_PEAK_RECOVERY_COUNT_MODEL_SENSITIVITY = {
  id: 'imp-96420',
  proofSection: 'S-frontier',
  question:
    'Does rebuilding the imp-96266 closed-form baseline sigma_CF(N) from the +7/8-corrected ' +
    'zero count (instead of the main-term Riemann-von Mangoldt count) narrow the imp-96266 ' +
    'peak-recovery LOCATION error (N_recon vs N_full ~ 9.219e5)? Measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  answer:
    'NO. The +7/8 count-model baseline leaves the location error at 9.08%: it moves from ' +
    '9.07848e-2 (main term) to 9.07843e-2 (+7/8), an absolute change of only -5.11e-7 ' +
    '(relative -5.63e-6), four orders of magnitude too small to matter. Both the full-share ' +
    'peak and the reconstructed peak co-move under the same ~1/N height correction (+4.64e-6 ' +
    'and +4.17e-6), so the shift nearly cancels in the ratio N_recon/N_full. The ~9.1% error ' +
    'is a STRUCTURAL feature of the first-order E_flow reconstruction, not a count-model ' +
    'artifact.',
  runMainTerm: {
    heightMap: 'effectiveHeightForN (main-term Riemann-von Mangoldt count) -- imp-96266 baseline',
    N_cross: +MODEL_MAIN.N_CROSS.toExponential(6), // ~3.280294e9
    peak_N_full: +PEAK_FULL_MAIN.N.toExponential(6), // ~9.218632e5
    peak_sigma_full: +PEAK_FULL_MAIN.sigma.toFixed(6), // ~0.949429
    peak_N_recon: +PEAK_RECON_MAIN.N.toExponential(6), // ~1.005554e6
    peak_sigma_recon: +PEAK_RECON_MAIN.sigma.toFixed(6), // ~0.948510
    peak_location_rel_err: +LOC_ERR_MAIN.toExponential(6), // ~9.078482e-2
    peak_height_abs_err: +HEIGHT_ERR_MAIN.toExponential(4), // ~9.1936e-4
  },
  runPlus78: {
    heightMap: '+7/8-corrected count: Newton inverse of (T/2pi)(log(T/2pi)-1) + 7/8 = N',
    N_cross: +MODEL_78.N_CROSS.toExponential(6), // ~3.280294e9 (essentially unchanged)
    peak_N_full: +PEAK_FULL_78.N.toExponential(6), // ~9.218675e5
    peak_sigma_full: +PEAK_FULL_78.sigma.toFixed(6), // ~0.949429
    peak_N_recon: +PEAK_RECON_78.N.toExponential(6), // ~1.005559e6
    peak_sigma_recon: +PEAK_RECON_78.sigma.toFixed(6), // ~0.948510
    peak_location_rel_err: +LOC_ERR_78.toExponential(6), // ~9.078431e-2
    peak_height_abs_err: +HEIGHT_ERR_78.toExponential(4), // ~9.1935e-4
  },
  sensitivity: {
    loc_err_abs_delta: +LOC_ERR_ABS_DELTA.toExponential(4), // ~-5.11e-7
    loc_err_rel_delta: +LOC_ERR_REL_DELTA.toExponential(4), // ~-5.63e-6
    full_peak_rel_shift: +FULL_PEAK_REL_SHIFT.toExponential(4), // ~+4.64e-6
    recon_peak_rel_shift: +RECON_PEAK_REL_SHIFT.toExponential(4), // ~+4.17e-6
    height_map_rel_shift_at_peak: +HEIGHT_MAP_REL_SHIFT_AT_PEAK.toExponential(4), // ~-8.66e-7
    narrows: LOC_ERR_78 < LOC_ERR_MAIN, // true, but negligibly (~5e-7)
    materially_narrows: Math.abs(LOC_ERR_REL_DELTA) > 1e-2, // false: not a lever
  },
  finding: {
    M1_no_narrowing:
      'The +7/8 count-model baseline does NOT narrow the location error: 9.07848e-2 (main ' +
      'term) -> 9.07843e-2 (+7/8), an absolute change of only -5.11e-7 (relative -5.63e-6). ' +
      'The ~9.08% error is unchanged to four significant figures; the count model is not a ' +
      'lever on the imp-96266 location error.',
    M2_peaks_co_move_ratio_invariant:
      'The +7/8 count moves the full-share peak by relative +4.64e-6 and the reconstructed ' +
      'peak by relative +4.17e-6 -- both ride the same ~1/N height correction, so the shifts ' +
      'nearly cancel in the ratio N_recon/N_full. The residual -5.6e-6 change in the location ' +
      'error is the small DIFFERENCE of the two nearly-equal +4e-6 co-shifts.',
    M3_height_shift_matches_imp96387:
      'At the peak height N ~ 9.22e5 the +7/8 count moves T0 by relative -8.66e-7, consistent ' +
      'with the imp-96387 -7.99e-7 at N = 1e6 and its ~1/N scaling. The peak HEIGHT error is ' +
      'likewise unchanged (9.1936e-4 -> 9.1935e-4).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Rebuilding the imp-96266 closed-form ' +
    'baseline sigma_CF from the +7/8-corrected zero count does NOT narrow the peak-recovery ' +
    'LOCATION error: it moves from 9.07848e-2 to 9.07843e-2, an absolute change of only ' +
    '-5.11e-7 (relative -5.63e-6), four orders of magnitude below the ~9.1% error itself. The ' +
    'reason is that both the full-share peak and the reconstructed peak co-move under the same ' +
    '~1/N height correction (+4.64e-6 and +4.17e-6 relative), so the count-model shift nearly ' +
    'cancels in the ratio N_recon/N_full. The ~9.1% location error is therefore a STRUCTURAL ' +
    'feature of the first-order E_flow reconstruction (which drops the crossover-model ' +
    'curvature), not a count-model artifact -- the +7/8 correction is not a lever on it. ' +
    'Component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays GUE-conditional and ' +
    'UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96266 (main-term baseline, 9.1% location error); imp-96387 (+7/8 count shift, ~1/N ' +
    'scaling); imp-96363 (+7/8 count path, -3.00e-8 at N = 1e6); imp-3220 (interior peak ' +
    'sigma_max ~ 0.9494 at N ~ 9.22e5); imp-33723 (closed-form crossover N_cross); ' +
    'lambda-rh-height-mapping (effectiveHeightForN main-term height).',
};

export const IMP96420_EFLOW_PEAK_RECOVERY_COUNT_MODEL_SENSITIVITY_ASSERTIONS = [
  {
    // Reproduce the imp-96266 main-term baseline: peak at ~9.22e5, location error ~9.08%.
    id: 'imp96420-main-term-reproduces-imp96266',
    description: 'main-term run reproduces the imp-96266 peak (N ~ 9.22e5) and ~9.1% location error',
    holds: () =>
      Math.abs(PEAK_FULL_MAIN.N / 9.218632e5 - 1) < 5e-4 &&
      Math.abs(LOC_ERR_MAIN - 9.0785e-2) < 5e-4,
  },
  {
    // The +7/8 baseline does NOT materially narrow the location error (change < 1% of it).
    id: 'imp96420-plus78-does-not-narrow-location-error',
    description: 'the +7/8 count-model baseline leaves the ~9.1% location error unchanged to < 1e-2 relative',
    holds: () => Math.abs(LOC_ERR_REL_DELTA) < 1e-2 && LOC_ERR_ABS_DELTA < 0,
  },
  {
    // Both peaks co-move by nearly the same ~1/N height correction (few e-6), so the ratio holds.
    id: 'imp96420-peaks-co-move-ratio-invariant',
    description: 'full and reconstructed peaks both shift by ~+4e-6 under the +7/8 count, cancelling in the ratio',
    holds: () =>
      FULL_PEAK_REL_SHIFT > 0 &&
      RECON_PEAK_REL_SHIFT > 0 &&
      Math.abs(FULL_PEAK_REL_SHIFT - RECON_PEAK_REL_SHIFT) < 2e-6,
  },
  {
    // The peak-height error is also unchanged (still ~9.2e-4).
    id: 'imp96420-height-error-unchanged',
    description: 'the peak-height error is unchanged by the count model (~9.2e-4 in both runs)',
    holds: () =>
      HEIGHT_ERR_MAIN < 1e-3 &&
      HEIGHT_ERR_78 < 1e-3 &&
      Math.abs(HEIGHT_ERR_78 - HEIGHT_ERR_MAIN) < 1e-6,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96420-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96420_EFLOW_PEAK_RECOVERY_COUNT_MODEL_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP96420_EFLOW_PEAK_RECOVERY_COUNT_MODEL_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96420_EFLOW_PEAK_RECOVERY_COUNT_MODEL_SENSITIVITY.verdict),
  },
];

for (const a of IMP96420_EFLOW_PEAK_RECOVERY_COUNT_MODEL_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96420-eflow-peak-recovery-count-model-sensitivity assertion failed: ${a.id}`);
  }
}
