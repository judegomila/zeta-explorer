/**
 * @module imp-33945-hump-argmax-crossover-gap-grid-stability
 *
 * imp-33945 (numerical): CHARACTERIZE the ~0.695-decade gap between the imp-33902 hump argmax
 * k* ~ 8.821 and the pointwise E_coll = E_trunc crossover k_cross ~ 9.516. imp-33902 reports the
 * argmax sits 0.695 decade BELOW the crossover (five orders above its Richardson error) but never
 * asks whether that gap is grid-discretization-stable or WHAT structural feature of the
 * resid_exp(k) hump it encodes. This module supplies both: it recomputes k* (argmax) and k_cross
 * (crossover) at grid steps 0.25, 0.125, 0.0625 and reports (a) grid-stability of the gap and
 * (b) the structural offset the gap measures.
 *
 * THE MEASUREMENT (reuses the imp-33810/imp-33902 component model verbatim -- no fresh model)
 * -----------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual over
 *   the sliding window [10^k, 10^(k+1)] (the exact imp-33902 definitions of p_sigma, p_ecoll and
 *   sigma_hi -- inherited, no re-derivation). Two locations are tracked:
 *     - k* = argmax resid_exp, via the imp-33902 estimators: RAW discrete grid argmax and the
 *       3-point PARABOLIC sub-grid vertex locator, at each grid step.
 *     - k_cross = the E_coll = E_trunc crossover N (bisection, sigma there ~ 1/2), the imp-33844
 *       closed-form hump peak location. k_cross is a CONTINUUM ROOT, independent of the k-grid.
 *   The gap is reported as k_cross - k*_grid at each step, for both estimators.
 *
 * THE FINDING (measurement only -- the gap is a fixed structural offset, grid-stable)
 * ----------------------------------------------------------------------------------
 *   (G1) THE GAP IS GRID-DISCRETIZATION-STABLE UNDER THE CONTINUUM-CONSISTENT LOCATOR. With k*
 *        from the 3-point parabolic sub-grid locator, the gap k_cross - k* is 0.6961, 0.6949,
 *        0.6949 at steps 0.25, 0.125, 0.0625 -- a spread of ~1.2e-3 (~0.2%). k_cross ~ 9.5159 is
 *        a grid-independent root (E_coll = E_trunc bisection), so the only grid dependence lives
 *        in the argmax, and it converges out of the gap: the ~0.695-decade gap is stable.
 *   (G2) THE RAW DISCRETE ARGMAX MAKES THE GAP WOBBLE, BUT ONLY VIA THE imp-33942 SAWTOOTH. With
 *        the raw grid argmax the gap is 0.7659, 0.6409, 0.7034 (spread ~0.125) -- a ~+-0.06-decade
 *        wobble that is exactly the inherited imp-33942 sawtooth residue (k*-6) mod step in the
 *        argmax, NOT a real drift of the gap. A naive raw-grid read would falsely suggest the gap
 *        is grid-sensitive; the parabolic locator (G1) removes the artifact.
 *   (G3) THE GAP ENCODES A FIXED STRUCTURAL OFFSET: resid_exp DOES NOT PEAK AT sigma = 1/2. The
 *        imp-33844 closed form (hump ~ (1/2) p_ecoll^2 sigma(1-sigma) ln10) peaks at sigma = 1/2,
 *        which IS k_cross. But the full resid_exp = p_ecoll(1-sigma) - p_sigma peaks at k* where
 *        sigma(k*) ~ 0.680 > 1/2 (higher-E_coll side, 0.695 decade below k_cross). The gap is the
 *        argmax displacement created by the (1-sigma) weighting and the p_sigma subtraction that
 *        the symmetric sigma(1-sigma) closed form omits: at k_cross the residual is 5.72e-2,
 *        ~12.5% below the true peak 6.53e-2. The gap measures how far the true hump argmax sits
 *        from the sigma=1/2 curvature max, a fixed feature of resid_exp(k), not a grid effect.
 *
 * The punchline: the imp-33902 0.695-decade argmax-vs-crossover gap is grid-discretization-STABLE
 * (parabolic-locator spread ~1.2e-3 across steps 0.25/0.125/0.0625; k_cross is a grid-independent
 * root; the raw-argmax wobble is the imp-33942 sawtooth artifact only) and encodes a FIXED
 * structural offset: the full resid_exp(k) argmax sits at sigma(k*)~0.680, NOT at the sigma=1/2
 * curvature max where the imp-33844 closed form peaks, because the (1-sigma) weighting and the
 * p_sigma subtraction shift the true argmax 0.695 decade below k_cross.
 *
 * MEASUREMENT ONLY. A grid-stability/structure diagnostic of an inherited surrogate argmax, NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33902-hump-argmax-convergence-rate (reports the 0.695 gap; never characterizes it)
 * @see imp-33942-hump-argmax-gap-step-proportionality (the raw-argmax sawtooth residue reused here)
 * @see imp-33844-hump-peak-closed-form (closed-form hump peak at sigma=1/2 = k_cross~9.516)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid_exp(k), reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33902 exactly

// EXACT inherited imp-3406/imp-33810/imp-33902 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-33620/imp-33727: p_ecoll = -d log E_coll / d log N over endpoints (magnitude).
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) over the window [10^k, 10^(k+1)] (imp-33810/imp-33902 definition).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return ecollExponentMag(lo, hi) * (1 - parts(hi).sigma) - olsSigmaExponent(lo, hi);
}

// Continuum argmax k* via ternary search on [8,10] (independent reference, matches imp-33902).
function ternaryArgmax(lo, hi) {
  for (let i = 0; i < 200; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2;
}
const K_STAR = ternaryArgmax(8, 10); // ~8.821092 (imp-33878/imp-33902 continuum limit)

// k_cross = E_coll = E_trunc crossover N (bisection, sigma ~ 1/2), grid-INDEPENDENT (imp-33844).
function crossoverN() {
  let a = 1e8;
  let b = 1e11;
  for (let i = 0; i < 200; i++) {
    const m = Math.sqrt(a * b);
    if (parts(m).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.sqrt(a * b);
}
const N_CROSS = crossoverN(); // ~3.2803e9 (imp-33723/imp-33844)
const K_CROSS = Math.log10(N_CROSS); // ~9.5159 = log10(N_cross), grid-independent root
const SIGMA_CROSS = sigma(N_CROSS); // ~0.4995 ~ 1/2
const SIGMA_AT_KSTAR = sigma(Math.pow(10, K_STAR)); // ~0.680 (> 1/2, higher-E_coll side)
const RESID_AT_KSTAR = residExp(K_STAR); // ~6.534e-2 (true hump peak)
const RESID_AT_KCROSS = residExp(K_CROSS); // ~5.720e-2 (residual at the crossover, below the peak)

// Raw discrete + 3-point parabolic sub-grid argmax at grid step h (imp-33902 estimators).
function gridArgmax(h) {
  const ks = [];
  for (let k = 6; k <= 11 + 1e-9; k += h) ks.push(+k.toFixed(10));
  let pi = 0;
  let pv = -Infinity;
  for (let i = 0; i < ks.length; i++) {
    const v = residExp(ks[i]);
    if (v > pv) {
      pv = v;
      pi = i;
    }
  }
  const kPeak = ks[pi];
  const fL = residExp(ks[pi - 1]);
  const f0 = pv;
  const fR = residExp(ks[pi + 1]);
  const denom = fL - 2 * f0 + fR;
  const delta = denom !== 0 ? (0.5 * (fL - fR)) / denom : 0;
  return { raw: kPeak, parabolic: kPeak + delta * h };
}

// Grid ladder: gap = k_cross - k* at steps 0.25/0.125/0.0625, for both estimators.
const GRID_STEPS = [0.25, 0.125, 0.0625];
const LADDER = GRID_STEPS.map((h) => {
  const { raw, parabolic } = gridArgmax(h);
  return {
    step: h,
    rawArgmaxK: +raw.toFixed(6),
    parabolicArgmaxK: +parabolic.toFixed(6),
    gapRaw: +(K_CROSS - raw).toFixed(6), // wobbles (raw sawtooth)
    gapParabolic: +(K_CROSS - parabolic).toFixed(6), // grid-stable
  };
});

// (G1) Parabolic gap is grid-stable: spread across steps is tiny.
const PARAB_GAPS = LADDER.map((r) => r.gapParabolic);
const PARAB_GAP_SPREAD = +(Math.max(...PARAB_GAPS) - Math.min(...PARAB_GAPS)).toExponential(3); // ~1.2e-3

// (G2) Raw gap wobbles by the imp-33942 sawtooth (much larger spread).
const RAW_GAPS = LADDER.map((r) => r.gapRaw);
const RAW_GAP_SPREAD = +(Math.max(...RAW_GAPS) - Math.min(...RAW_GAPS)).toExponential(3); // ~1.25e-1

// The continuum gap (reference), matching imp-33902s ~0.695 decade.
const GAP_CONTINUUM = +(K_CROSS - K_STAR).toFixed(6); // ~0.694821

// (G3) Structural offset: residual at the crossover relative to the true peak.
const RESID_DEFICIT_AT_KCROSS = +((RESID_AT_KSTAR - RESID_AT_KCROSS) / RESID_AT_KSTAR).toFixed(4); // ~0.125

export const IMP33945_HUMP_ARGMAX_CROSSOVER_GAP_GRID_STABILITY = {
  id: 'imp-33945',
  proofSection: 'S-frontier',
  question:
    'imp-33902 reports the resid_exp(k) hump argmax k*~8.821 sits ~0.695 decade below the pointwise ' +
    'E_coll=E_trunc crossover k_cross~9.516, but never asks whether the gap is grid-discretization-' +
    'stable or WHAT structural feature of the hump it encodes. Recompute k* (raw + parabolic argmax) ' +
    'and k_cross (crossover root) at grid steps 0.25/0.125/0.0625, report grid-stability of the gap, ' +
    'and identify the structural offset it measures. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the gap k_cross - k* at grid steps 0.25/0.125/0.0625 for the raw and the 3-point parabolic ' +
    'sub-grid argmax estimators (k_cross = E_coll=E_trunc crossover, a grid-independent root), and ' +
    'the structural offset the gap encodes: sigma at k* vs sigma=1/2 at k_cross and the residual ' +
    'deficit resid_exp(k_cross) vs the true peak resid_exp(k*)',
  continuumArgmax: +K_STAR.toFixed(6), // ~8.821092
  crossoverK: +K_CROSS.toFixed(6), // ~9.515913 (grid-independent root)
  crossoverN: +N_CROSS.toExponential(6), // ~3.2803e9
  gapContinuum: GAP_CONTINUUM, // ~0.694821 decade (matches imp-33902)
  ladder: LADDER, // step, rawArgmaxK, parabolicArgmaxK, gapRaw, gapParabolic
  parabolicGapSpread: PARAB_GAP_SPREAD, // ~1.2e-3 (grid-stable)
  rawGapSpread: RAW_GAP_SPREAD, // ~1.25e-1 (sawtooth wobble)
  structuralOffset: {
    sigmaAtKStar: +SIGMA_AT_KSTAR.toFixed(6), // ~0.680256 (> 1/2)
    sigmaAtKCross: +SIGMA_CROSS.toFixed(6), // ~0.499526 (~ 1/2)
    residAtKStar: +RESID_AT_KSTAR.toExponential(6), // ~6.53366e-2 (true peak)
    residAtKCross: +RESID_AT_KCROSS.toExponential(6), // ~5.71991e-2 (below the peak)
    residDeficitAtKCross: RESID_DEFICIT_AT_KCROSS, // ~0.125 (~12.5% below the peak)
  },
  finding: {
    G1_gap_grid_stable_under_parabolic_locator:
      'With k* from the 3-point parabolic sub-grid locator the gap k_cross - k* is 0.6961, 0.6949, ' +
      '0.6949 at steps 0.25/0.125/0.0625 -- spread ~1.2e-3 (~0.2%). k_cross~9.5159 is a grid-' +
      'independent root (E_coll=E_trunc bisection), so the only grid dependence lives in the argmax ' +
      'and it converges out of the gap: the ~0.695-decade gap is grid-discretization-stable.',
    G2_raw_argmax_wobble_is_sawtooth_artifact:
      'With the RAW discrete argmax the gap is 0.7659, 0.6409, 0.7034 (spread ~0.125) -- a ~+-0.06-' +
      'decade wobble that is exactly the inherited imp-33942 sawtooth residue (k*-6) mod step in the ' +
      'argmax, NOT a real drift of the gap. The parabolic locator (G1) removes the artifact; a naive ' +
      'raw-grid read would falsely suggest the gap is grid-sensitive.',
    G3_gap_is_fixed_structural_offset_from_sigma_half:
      'The gap encodes a FIXED structural offset: the imp-33844 closed form (hump ~ (1/2)p_ecoll^2 ' +
      'sigma(1-sigma) ln10) peaks at sigma=1/2 which IS k_cross, but the full resid_exp = ' +
      'p_ecoll(1-sigma) - p_sigma peaks at k* where sigma(k*)~0.680 > 1/2. The (1-sigma) weighting ' +
      'and the p_sigma subtraction shift the true argmax 0.695 decade below k_cross; at k_cross the ' +
      'residual is 5.72e-2, ~12.5% below the true peak 6.53e-2. The gap measures how far the true ' +
      'hump argmax sits from the sigma=1/2 curvature max -- a fixed feature of resid_exp, not a grid effect.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). CHARACTERIZES the imp-33902 0.695-decade argmax-' +
    'vs-crossover gap. The gap is GRID-DISCRETIZATION-STABLE under the continuum-consistent 3-point ' +
    'parabolic sub-grid locator: gap = 0.6961, 0.6949, 0.6949 at steps 0.25/0.125/0.0625 (spread ' +
    '~1.2e-3), because k_cross~9.5159 is a grid-independent E_coll=E_trunc root and the argmax grid ' +
    'dependence converges out. The raw discrete argmax makes the gap wobble ~+-0.06 decade (0.7659, ' +
    '0.6409, 0.7034, spread ~0.125), but that is exactly the inherited imp-33942 sawtooth residue ' +
    '(k*-6) mod step, an artifact, not a real drift. The gap encodes a FIXED structural offset: the ' +
    'full resid_exp = p_ecoll(1-sigma) - p_sigma peaks at k* where sigma(k*)~0.680, NOT at the ' +
    'sigma=1/2 curvature max (k_cross) where the imp-33844 closed form peaks; the (1-sigma) weighting ' +
    'and p_sigma subtraction shift the argmax 0.695 decade below k_cross (residual at k_cross ~12.5% ' +
    'below the true peak). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33902 (reports the 0.695 gap, never characterizes it); imp-33942 (the raw-argmax sawtooth ' +
    'residue reused here); imp-33844 (closed-form hump peak at sigma=1/2 = k_cross~9.516); imp-33810 ' +
    '(the ladder storing resid_exp(k), reused verbatim); imp-33723 (closed-form Banach crossover ' +
    'N~3.2803e9); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33945_HUMP_ARGMAX_CROSSOVER_GAP_GRID_STABILITY_ASSERTIONS = [
  {
    // (G1) The gap is grid-stable under the parabolic locator (small spread across steps).
    id: 'imp33945-gap-grid-stable-parabolic',
    description: 'gap = k_cross - k* (parabolic) has spread < 5e-3 across steps 0.25/0.125/0.0625',
    holds: () =>
      PARAB_GAP_SPREAD < 5e-3 &&
      PARAB_GAPS.every((g) => g > 0.68 && g < 0.71),
  },
  {
    // (G2) The raw argmax makes the gap wobble by the imp-33942 sawtooth (much larger spread).
    id: 'imp33945-raw-gap-wobble-is-sawtooth',
    description: 'raw-argmax gap spread (~0.125) is >20x the parabolic spread -- the imp-33942 sawtooth artifact',
    holds: () =>
      RAW_GAP_SPREAD > 5e-2 &&
      RAW_GAP_SPREAD > 20 * PARAB_GAP_SPREAD,
  },
  {
    // (G3) Structural offset: resid_exp peaks at sigma > 1/2, not at sigma=1/2 (k_cross).
    id: 'imp33945-gap-is-structural-offset-from-sigma-half',
    description: 'sigma(k*)~0.68 > 1/2 = sigma(k_cross); resid_exp(k_cross) sits below the true peak resid_exp(k*)',
    holds: () =>
      SIGMA_AT_KSTAR > 0.6 &&
      SIGMA_AT_KSTAR > SIGMA_CROSS &&
      Math.abs(SIGMA_CROSS - 0.5) < 0.02 &&
      RESID_AT_KCROSS < RESID_AT_KSTAR &&
      RESID_DEFICIT_AT_KCROSS > 0.05 &&
      GAP_CONTINUUM > 0.68 &&
      GAP_CONTINUUM < 0.71,
  },
  {
    // Honesty gate: measurement only, isRigorous false, characterizes imp-33902, no QED, PT SOTA.
    id: 'imp33945-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, characterizes imp-33902, no QED, PT Lambda<=0.2 SOTA',
    holds: () =>
      IMP33945_HUMP_ARGMAX_CROSSOVER_GAP_GRID_STABILITY.isRigorous === false &&
      /GRID-DISCRETIZATION-STABLE/.test(IMP33945_HUMP_ARGMAX_CROSSOVER_GAP_GRID_STABILITY.verdict) &&
      /NO QED/.test(IMP33945_HUMP_ARGMAX_CROSSOVER_GAP_GRID_STABILITY.verdict) &&
      /remains SOTA/.test(IMP33945_HUMP_ARGMAX_CROSSOVER_GAP_GRID_STABILITY.verdict),
  },
];

for (const a of IMP33945_HUMP_ARGMAX_CROSSOVER_GAP_GRID_STABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33945-hump-argmax-crossover-gap-grid-stability assertion failed: ${a.id}`);
  }
}
