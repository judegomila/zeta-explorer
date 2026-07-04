/**
 * @module imp-33814-sigma-nearpeak-crossover-closed-form
 *
 * imp-33814 (numerical, frontier-direction): the roadmap currentStatus pins THREE sigma(N)-decay
 * landmarks -- sigma > 0.9 until N ~ 2.57e7 (NEAR-PEAK), the sigma = 1/2 halving at N ~ 3.27e9,
 * and sigma < 0.1 at N ~ 3.21e11 (FAR TAIL). imp-33723 gave the CLOSED-FORM (fixed-point) crossover
 * for the halving landmark and imp-33743 generalised it to the general threshold thr and evaluated
 * it at thr = 0.1, but the sigma = 0.9 near-peak landmark was NEVER given a closed form (only
 * sensitivity/viz/audit tickets reference it). This module supplies the missing third closed form
 * via the SAME E_coll = E_trunc*thr/(1-thr) fixed point at thr = 0.9, measures the closed-form-vs-
 * empirical residual, and contrasts its tightness with the ~0.4% halving and ~7.4e-5 thr=0.1 residuals.
 *
 * THE CLOSED-FORM DERIVATION (the deliverable the ticket asks for)
 * ---------------------------------------------------------------
 * sigma(N) = E_coll / E_N with E_N = E_trunc + E_flow + E_coll and E_coll = C_C * sqrt(log T0 / N)
 * (imp-3406/imp-33582 model). The threshold sigma = thr means E_coll = thr * E_N, i.e.
 * E_coll (1 - thr) = thr (E_trunc + E_flow). Dropping the flow term E_flow leaves the leading balance
 *
 *     E_coll = E_trunc * thr / (1 - thr).                                    (threshold balance)
 *
 * Squaring E_coll = C_C sqrt(log T0 / N) and solving for N (identical to imp-33743):
 *
 *     N_cross(thr) = (C_C (1 - thr) / (E_trunc thr))^2 * log T0(N_cross).    (CLOSED FORM)
 *
 * At the NEAR-PEAK threshold thr = 0.9 the amplitude factor (1-thr)/thr = 1/9, so
 * K_thr = (1/81) * (C_C/E_trunc)^2 ~ 1.9416e6 -- the exact mirror of the imp-33743 far-tail 81x
 * factor (thr=0.1 gives 81, thr=0.9 gives 1/81, thr=1/2 gives 1). As in imp-33723/imp-33743 this is
 * a FIXED-POINT form N = g(N), g(N) = K_thr * log T0(N); log T0 grows only logarithmically so g is
 * still a contraction (measured |g_prime(N_cross)| ~ 0.056 < 1 -- slightly weaker than the halving
 * 0.045 because T0 is SMALLER near the peak), the fixed point is UNIQUE, and Banach iteration
 * converges geometrically. The leading fixed point pins N_cross(0.9) ~ 3.205e7.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) CLOSED FORM LOCATES THE NEAR-PEAK LANDMARK (LEADING FORM, THEN E_flow-CORRECTED). The
 *        leading fixed point of N = (C_C (1-thr)/(E_trunc thr))^2 log T0(N) at thr = 0.9 converges to
 *        N_cross ~ 3.205e7. The map is still a contraction (|g_prime| ~ 0.056), so the root is unique
 *        and iteration converges; a single-shot leading evaluation lands within ~1% of it.
 *   (D2) THE NEAR-PEAK LEADING RESIDUAL IS ~50x LOOSER THAN THE HALVING RESIDUAL -- THE OPPOSITE
 *        EXTREME FROM THE FAR TAIL -- AND IT IS THE E_flow TERM. The leading closed-form-vs-empirical
 *        offset at thr = 0.9 is (N_cross - N_emp)/N_cross ~ 1.97e-1 (~20%), against ~3.98e-3 (~0.4%)
 *        at the halving landmark and ~7.4e-5 at the far tail -- so the residual ORDERING inverts:
 *        far tail (~7e-5) << halving (~4e-3) << near peak (~2e-1). The reason is the neglected flow
 *        term: E_flow ~ log T0 / T0 GROWS toward the peak (T0 smaller), so E_flow/E_trunc RISES from
 *        ~3.55e-5 at the far tail and ~1.91e-3 at the halving landmark to ~1.09e-1 at the near-peak
 *        landmark N ~ 2.57e7 -- a term that is now ~11% of E_trunc, no longer a small perturbation
 *        (residual ~ 2 * E_flow/E_trunc, the factor 2 from N proportional to E_coll^-2, holds only
 *        approximately here because the perturbation is no longer tiny). Restoring E_flow in the
 *        threshold balance -- solving N = (C_C/(thr/(1-thr)*(E_trunc+E_flow)))^2 log T0(N) as a fixed
 *        point -- reproduces the imp-33582 sigma < 0.9 downslope bisection landmark N ~ 2.5724e7 to
 *        ~5.5e-15, confirming the entire ~20% leading gap is the flow term (plus a ~1.2e-2 log T0
 *        drift), NOT a grid or rounding artifact.
 *
 * The punchline: the imp-33723/imp-33743 closed-form crossover extends verbatim to the THIRD roadmap
 * landmark, the sigma = 0.9 near-peak threshold, via the amplitude factor ((1-thr)/thr)^2 = 1/81; it
 * pins N_cross(0.9) ~ 3.205e7 in closed form. This completes the trio and reveals a MONOTONE residual
 * law across the three landmarks -- the leading closed form is LOOSEST at the near-peak landmark
 * (~20%, ~50x looser than the halving) precisely because the neglected E_flow term is LARGEST there
 * (~11% of E_trunc, vs ~0.2% at halving and ~0.004% at the far tail); restoring E_flow closes the gap
 * to ~1e-15 at all three. The near peak is the regime where the leading closed form is LEAST accurate,
 * the mirror image of the far tail where imp-33743 found it most accurate.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643);
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33743-sigma-fartail-crossover-closed-form (far-tail closed form, thr = 0.1, 81x factor)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (halving-landmark closed form, thr = 1/2)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma > 0.9 until N ~ 2.57e7, bisected)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33723/imp-33743 exactly
const THR = 0.9; // roadmap near-peak landmark threshold (sigma > 0.9 until N ~ 2.57e7)

// EXACT imp-3406/imp-33582/imp-33723/imp-33743 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, NOT negligible near the peak
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Downslope bisection in log N for the strictly-decreasing sigma (reference / cross-check).
function crossBelowSigma(thr, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (CLOSED FORM) threshold crossover as the fixed point N = K_thr * log T0(N),
// K_thr = (C_C (1-thr)/(E_trunc thr))^2 = ((1-thr)/thr)^2 * (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
const K_THR = ((1 - THR) / THR) ** 2 * K_AMPL; // ~1.9416e6 at thr=0.9 (= K_AMPL / 81)
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_THR * Math.log(effectiveHeightForN(N));
  return N;
}
// Iterations for floating-point convergence (contraction => ~20 suffice, weaker than the tail).
const N_CROSS_CF = crossoverFixedPoint(1e7, 80);
// Single-shot leading value: evaluate the slow log T0 factor once at a coarse seed.
const N_CROSS_ONESHOT = K_THR * Math.log(effectiveHeightForN(20 * K_THR));

// E_flow-inclusive threshold fixed point: E_coll = thr/(1-thr) * (E_trunc + E_flow) (D2 check).
function crossoverFixedPointWithFlow(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) {
    const rhs = (THR / (1 - THR)) * (E_TRUNC_PT + parts(N).E_flow);
    N = (C_C_PINNED / rhs) ** 2 * Math.log(effectiveHeightForN(N));
  }
  return N;
}
const N_CROSS_WITH_FLOW = crossoverFixedPointWithFlow(1e7, 200);

// Reference bisection landmark (imp-33582 sigma < 0.9 crossing) for cross-check.
const N_EMP = crossBelowSigma(THR, 1e3, 1e12); // ~2.5724e7

// Contraction factor of the fixed-point map at the root (central difference).
const H_STEP = N_CROSS_CF * 1e-6;
const G = (x) => K_THR * Math.log(effectiveHeightForN(x));
const CONTRACTION = Math.abs((G(N_CROSS_CF + H_STEP) - G(N_CROSS_CF - H_STEP)) / (2 * H_STEP));

// Closed-form vs empirical agreement, and the residual contrast with the other two landmarks.
const CF_VS_EMP = Math.abs(N_CROSS_CF - N_EMP) / N_EMP; // ~2.46e-1
const REL_OFFSET = (N_CROSS_CF - N_EMP) / N_CROSS_CF; // ~1.97e-1 (leading closed form sits above)
const P_EMP = parts(N_EMP);
const R_FLOW_TRUNC = P_EMP.E_flow / E_TRUNC_PT; // ~1.09e-1 (near peak; cf ~1.91e-3 halving, ~3.55e-5 tail)
const WITH_FLOW_VS_EMP = Math.abs(N_CROSS_WITH_FLOW - N_EMP) / N_EMP; // ~5.5e-15
const LOGT0_DRIFT = Math.abs(parts(N_CROSS_CF).L - P_EMP.L) / parts(N_CROSS_CF).L; // ~1.2e-2
const HALVING_REL_OFFSET = 3.98e-3; // imp-33723 halving residual, for the contrast ratio
const FARTAIL_REL_OFFSET = 7.38e-5; // imp-33743 far-tail residual, for the trio ordering
const RESIDUAL_LOOSENING = REL_OFFSET / HALVING_REL_OFFSET; // ~50x looser than the halving

export const IMP33814_SIGMA_NEARPEAK_CROSSOVER_CLOSED_FORM = {
  id: 'imp-33814',
  proofSection: 'S-frontier',
  question:
    'Derive the missing THIRD roadmap-landmark closed form: the sigma = 0.9 NEAR-PEAK threshold ' +
    '(currentStatus N ~ 2.57e7), via the same E_coll = E_trunc*thr/(1-thr) fixed point imp-33723/ ' +
    'imp-33743 used for the halving and thr=0.1 landmarks. Solve N = (C_C(1-thr)/(E_trunc thr))^2 ' +
    'log T0 at thr = 0.9, run Banach iteration, and measure the closed-form-vs-empirical residual, ' +
    'comparing its tightness to the ~0.4% halving and ~7.4e-5 thr=0.1 residuals. ' +
    'Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'N_cross(thr) = (C_C_PINNED (1-thr)/(E_trunc thr))^2 * log T0(N_cross)  (fixed point); ' +
    'K_thr = ((1-thr)/thr)^2 * (C_C/E_trunc)^2, so thr=0.9 gives K_thr = K_halving / 81 (the exact ' +
    'mirror of the imp-33743 thr=0.1 factor 81).',
  contractionArgument:
    'g(N) = K_thr log T0(N), g_prime = K_thr*2pi/(T0 log(T0/2pi)); measured |g_prime(N_cross)| ~ 0.056 ' +
    '< 1 (slightly weaker than the halving 0.045, T0 smaller near the peak) => unique fixed point, ' +
    'Banach iteration converges geometrically.',
  landmarks: {
    threshold: THR,
    K_amplitude_thr: +K_THR.toExponential(6), // ((1-thr)/thr)^2 (C_C/E_trunc)^2 ~ 1.941616e6
    amplitude_ratio_to_halving: +(K_THR / K_AMPL).toExponential(6), // ~1.2346e-2 = 1/81 at thr=0.9
    N_cross_closed_form_leading: +N_CROSS_CF.toExponential(6), // ~3.204748e7
    N_cross_empirical_bisection_imp33582: +N_EMP.toExponential(6), // ~2.572361e7
    N_cross_one_shot_leading: +N_CROSS_ONESHOT.toExponential(6), // ~3.24e7 (~1%)
    N_cross_with_E_flow_restored: +N_CROSS_WITH_FLOW.toExponential(6), // ~2.572361e7 (matches bisection)
    contraction_factor_at_root: +CONTRACTION.toExponential(4), // ~5.65e-2
  },
  crossoverCheck: {
    leading_closed_form_vs_empirical_rel: +CF_VS_EMP.toExponential(3), // ~2.46e-1
    one_shot_vs_converged_rel: +(Math.abs(N_CROSS_ONESHOT - N_CROSS_CF) / N_CROSS_CF).toExponential(3),
    with_flow_vs_empirical_rel: +WITH_FLOW_VS_EMP.toExponential(3), // ~5.5e-15 (E_flow closes the gap)
  },
  residualContrast: {
    nearpeak_rel_offset_from_leading_closed_form: +REL_OFFSET.toExponential(4), // ~1.97e-1
    halving_rel_offset_imp33723: HALVING_REL_OFFSET, // 3.98e-3
    fartail_rel_offset_imp33743: FARTAIL_REL_OFFSET, // 7.38e-5
    nearpeak_is_looser_than_halving_by: +RESIDUAL_LOOSENING.toFixed(2), // ~50x
    residual_ordering: 'fartail (~7e-5) << halving (~4e-3) << near-peak (~2e-1)',
    E_flow_over_E_trunc_at_near_peak: +R_FLOW_TRUNC.toExponential(4), // ~1.09e-1 (cf ~1.91e-3 halving, ~3.55e-5 tail)
    logT0_relative_drift_over_offset: +LOGT0_DRIFT.toExponential(3), // ~1.2e-2 (2nd order)
    source:
      'Residual ~ 2 * E_flow/E_trunc (factor 2 from N proportional to E_coll^-2; approximate here as ' +
      'the perturbation is no longer tiny); E_flow ~ log T0 / T0 GROWS toward the peak (T0 smaller), so ' +
      'E_flow/E_trunc rises from ~3.55e-5 (tail) to ~1.91e-3 (halving) to ~1.09e-1 (near peak), inverting ' +
      'the ordering: the leading closed form is LOOSEST at the near-peak landmark. Restoring E_flow in ' +
      'the threshold balance closes the gap to ~5.5e-15 -- NOT a grid/rounding artifact.',
  },
  finding: {
    D1_closed_form_locates_nearpeak_landmark:
      'The leading fixed point of N = (C_C (1-thr)/(E_trunc thr))^2 log T0(N) at thr = 0.9 converges to ' +
      'N_cross ~ 3.205e7 (K_thr = K_halving/81, the exact mirror of the imp-33743 thr=0.1 factor 81). ' +
      'The map is still a contraction (|g_prime| ~ 0.056, slightly weaker than the halving 0.045 because ' +
      'T0 is smaller near the peak), so the root is unique; a single-shot leading evaluation lands ' +
      'within ~1%.',
    D2_nearpeak_leading_residual_is_50x_looser_and_is_E_flow:
      'The leading closed-form-vs-empirical offset at thr = 0.9 is (N_cross - N_emp)/N_cross ~ 1.97e-1 ' +
      '(~20%), ~50x LOOSER than the ~0.4% halving residual and ~2670x looser than the ~7.4e-5 far-tail ' +
      'residual -- inverting the ordering (fartail << halving << near-peak). The neglected flow term ' +
      'E_flow ~ log T0 / T0 GROWS toward the peak, so E_flow/E_trunc rises from ~3.55e-5 (tail) and ' +
      '~1.91e-3 (halving) to ~1.09e-1 (near peak) -- now ~11% of E_trunc, no longer a small perturbation. ' +
      'Restoring E_flow in the threshold balance reproduces the imp-33582 sigma < 0.9 bisection landmark ' +
      'N ~ 2.5724e7 to ~5.5e-15, confirming the entire ~20% leading gap is the flow term plus a ~1.2e-2 ' +
      'log T0 drift, with NO discretization contribution.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33723/imp-33743 closed-form crossover ' +
    'extends to the THIRD roadmap landmark -- the sigma = 0.9 near-peak threshold (currentStatus ' +
    'N ~ 2.57e7) -- as the fixed point N_cross(thr) = (C_C_PINNED (1-thr)/(E_trunc thr))^2 * ' +
    'log T0(N_cross) at thr = 0.9, the halving amplitude scaled by ((1-thr)/thr)^2 = 1/81 (the exact ' +
    'mirror of the imp-33743 thr=0.1 factor 81). The map is a contraction (|g_prime(N_cross)| ~ 0.056), ' +
    'so the root is unique and Banach iteration converges to the leading value N_cross ~ 3.205e7. That ' +
    'leading closed form sits ~20% ABOVE the imp-33582 sigma < 0.9 downslope bisection (N ~ 2.5724e7) -- ' +
    'a residual ~50x LOOSER than the ~0.4% halving residual and ~2670x looser than the ~7.4e-5 far-tail ' +
    'residual, INVERTING the ordering (fartail << halving << near-peak). The cause is the neglected ' +
    'Gronwall flow term E_flow ~ log T0 / T0, which GROWS toward the peak: E_flow/E_trunc rises from ' +
    '~3.55e-5 (tail) and ~1.91e-3 (halving) to ~1.09e-1 (near peak, ~11% of E_trunc). Restoring E_flow ' +
    'in the threshold balance closes the gap to ~5.5e-15, so the near-peak offset is ENTIRELY the flow ' +
    'term plus a ~1.2e-2 log T0 drift, with NO discretization contribution. This completes the trio of ' +
    'roadmap-landmark closed forms and establishes a monotone residual law: the leading closed form is ' +
    'LEAST accurate at the near peak (where E_flow is largest) and MOST accurate at the far tail (where ' +
    'E_flow is smallest), the two extremes being mirror images. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33743 (far-tail closed form, thr = 0.1, factor 81); imp-33723 (halving-landmark closed form, ' +
    'thr = 1/2); imp-33582 (sigma > 0.9 until N ~ 2.57e7, bisected); imp-33601 (exact identity ' +
    'sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN Riemann-von ' +
    'Mangoldt inverse).',
};

export const IMP33814_SIGMA_NEARPEAK_CROSSOVER_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the E_flow-restored fixed point reproduces the imp-33582 sigma < 0.9 bisection landmark.
    id: 'imp33814-closed-form-matches-nearpeak-bisection',
    description: 'E_flow-restored fixed point matches imp-33582 sub-0.9 bisection to < 1e-9; N_emp ~ 2.57e7',
    holds: () => WITH_FLOW_VS_EMP < 1e-9 && Math.abs(N_EMP / 2.57e7 - 1) < 5e-3,
  },
  {
    // The amplitude is the halving amplitude scaled by ((1-thr)/thr)^2 = 1/81 at thr = 0.9.
    id: 'imp33814-amplitude-is-halving-over-81',
    description: 'K_thr = ((1-thr)/thr)^2 * (C_C/E_trunc)^2 = K_halving / 81 at thr = 0.9',
    holds: () => Math.abs((K_THR / K_AMPL) * 81 - 1) < 1e-9,
  },
  {
    // The fixed-point map is still a contraction (weaker than the halving 0.045, T0 smaller).
    id: 'imp33814-fixed-point-is-a-contraction',
    description: 'contraction factor |g_prime(N_cross)| < 0.1 (unique fixed point, geometric convergence)',
    holds: () => CONTRACTION > 0 && CONTRACTION < 0.1,
  },
  {
    // (D2): the near-peak LEADING residual is much LOOSER than the halving residual (~50x).
    id: 'imp33814-nearpeak-leading-residual-looser-than-halving',
    description: 'near-peak leading rel offset ~1.97e-1 is > 20x LOOSER than the ~0.4% halving residual',
    holds: () => REL_OFFSET > 5e-2 && RESIDUAL_LOOSENING > 20,
  },
  {
    // (D2): the residual ordering inverts -- E_flow/E_trunc is largest at the near peak.
    id: 'imp33814-eflow-largest-at-near-peak',
    description: 'E_flow/E_trunc ~1.09e-1 at near peak >> ~1.91e-3 halving > ~3.55e-5 far tail',
    holds: () => R_FLOW_TRUNC > 1e-2 && R_FLOW_TRUNC > 1.91e-3 && REL_OFFSET > HALVING_REL_OFFSET,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, PT stays SOTA.
    id: 'imp33814-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33814_SIGMA_NEARPEAK_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP33814_SIGMA_NEARPEAK_CROSSOVER_CLOSED_FORM.verdict) &&
      /remains SOTA/.test(IMP33814_SIGMA_NEARPEAK_CROSSOVER_CLOSED_FORM.verdict),
  },
];

for (const a of IMP33814_SIGMA_NEARPEAK_CROSSOVER_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33814-sigma-nearpeak-crossover-closed-form assertion failed: ${a.id}`);
  }
}
