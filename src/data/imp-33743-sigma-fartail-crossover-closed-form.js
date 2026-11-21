/**
 * @module imp-33743-sigma-fartail-crossover-closed-form
 *
 * imp-33743 (accuracy, frontier-direction): imp-33723 supplied the CLOSED-FORM (fixed-point)
 * crossover N ONLY for the sigma = 1/2 halving landmark, N_cross = (C_C/E_trunc)^2 * log T0(N).
 * imp-33582 also pins a sigma < 0.1 FAR-TAIL landmark (sigma_below_0_1_at_N ~ 3.2132e11), but
 * that one is located by DOWNSLOPE BISECTION only. This module supplies the analogous closed form
 * for the general threshold thr and evaluates it at thr = 0.1, then measures the closed-form-vs-
 * empirical residual and contrasts it with the ~0.4% halving residual imp-33723 reported.
 *
 * THE CLOSED-FORM DERIVATION (the deliverable the ticket asks for)
 * ---------------------------------------------------------------
 * sigma(N) = E_coll / E_N with E_N = E_trunc + E_flow + E_coll and E_coll = C_C * sqrt(log T0 / N)
 * (imp-3406/imp-33582 model). The threshold sigma = thr means E_coll = thr * E_N, i.e.
 * E_coll (1 - thr) = thr (E_trunc + E_flow). Dropping the tiny flow term E_flow (negligible on the
 * far tail, see D2) leaves the leading balance
 *
 *     E_coll = E_trunc * thr / (1 - thr).                                    (threshold balance)
 *
 * Squaring E_coll = C_C sqrt(log T0 / N) and solving for N:
 *
 *     C_C^2 * log T0 / N = (E_trunc * thr / (1 - thr))^2
 *   =>  N_cross(thr) = (C_C (1 - thr) / (E_trunc thr))^2 * log T0(N_cross).  (CLOSED FORM)
 *
 * This generalises the imp-33723 halving form: at thr = 1/2 the amplitude factor (1-thr)/thr = 1
 * recovers K = (C_C/E_trunc)^2; at thr = 1/10 it is (1-thr)/thr = 9, so the amplitude is
 * K_thr = 81 * (C_C/E_trunc)^2 ~ 1.2739e10. As in imp-33723 this is a FIXED-POINT form
 * N = g(N), g(N) = K_thr * log T0(N); log T0 grows only logarithmically so g is a strong
 * contraction (measured |g_prime(N_cross)| ~ 0.038 << 1, even tighter than the halving 0.045
 * because T0 is larger deep in the tail), the fixed point is UNIQUE, and Banach iteration from any
 * seed converges geometrically. A single-shot leading value (freeze log T0 once at a coarse seed)
 * lands within ~0.9%; the full fixed point pins N_cross(0.1) ~ 3.2134e11.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) CLOSED FORM REPRODUCES THE FAR-TAIL BISECTION LANDMARK. The fixed point of
 *        N = (C_C (1-thr)/(E_trunc thr))^2 log T0(N) at thr = 0.1 converges to
 *        N_cross ~ 3.2134e11, agreeing with the imp-33582 downslope sub-0.1 crossing
 *        (~3.2132e11) to ~7.4e-5 relative -- so the far-tail landmark is now available in closed
 *        form, not only as a bracketed root. The map is an even stronger contraction than at the
 *        halving landmark (|g_prime| ~ 0.038 vs ~0.045).
 *   (D2) THE FAR-TAIL RESIDUAL IS ~54x SMALLER THAN THE HALVING RESIDUAL, AND IT IS THE E_flow
 *        TERM. The closed-form-vs-empirical offset at thr = 0.1 is (N_cross - N_emp)/N_cross
 *        ~ 7.4e-5 (~0.007%), against ~3.98e-3 (~0.4%) at the halving landmark -- a ~54x
 *        collapse. The reason: the dropped flow term E_flow ~ (log T0 / T0) decays down the tail,
 *        so E_flow/E_trunc falls from ~1.91e-3 at N_half (~3.27e9) to ~3.55e-5 at N_emp
 *        (~3.21e11), a ~54x drop that matches the residual collapse ratio (residual ~ 2 *
 *        E_flow/E_trunc, the factor 2 from N proportional to E_coll^-2). Restoring E_flow in the
 *        threshold balance -- solving N = (C_C/(thr/(1-thr)*(E_trunc+E_flow)))^2 log T0(N) as a
 *        fixed point -- reproduces the bisection landmark to ~1.3e-15, confirming the ~7.4e-5 gap
 *        is ENTIRELY the flow term (plus a ~2.8e-6 log T0 drift), NOT a grid or rounding artifact.
 *
 * The punchline: the imp-33723 closed-form crossover extends verbatim from the sigma = 1/2
 * halving landmark to the general threshold sigma = thr via the amplitude factor ((1-thr)/thr)^2;
 * at the sigma < 0.1 far-tail landmark it pins N_cross ~ 3.2134e11 in closed form and reproduces
 * the imp-33582 bisection to ~7.4e-5. That residual is ~54x TIGHTER than the halving residual
 * precisely because the neglected E_flow term is ~54x smaller deep in the tail, and restoring
 * E_flow closes the gap to ~1e-15 -- so the far tail is the regime where the leading closed form
 * is most accurate.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643);
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (halving-landmark closed form, thr = 1/2)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma < 0.1 crossing N ~ 3.21e11, bisected)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see imp-34174-crossover-surplus-threshold-family-decay (tabulates the E_flow surplus across this
 *      module's threshold family, reusing the identical N_cross(thr) sub-terms)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (small-thr asymptotic refinement of the imp-34174
 *      surplus built on this module's N_cross(thr) closed form)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33723 exactly
const THR = 0.1; // imp-33582 far-tail landmark threshold (sigma < 0.1)

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
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
const K_THR = ((1 - THR) / THR) ** 2 * K_AMPL; // ~1.2739e10 at thr=0.1 (= 81 * K_AMPL)
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_THR * Math.log(effectiveHeightForN(N));
  return N;
}
// Iterations needed for floating-point convergence (strong contraction => ~10 suffice).
const N_CROSS_CF = crossoverFixedPoint(1e11, 60);
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
const N_CROSS_WITH_FLOW = crossoverFixedPointWithFlow(1e11, 80);

// Reference bisection landmark (imp-33582 sigma < 0.1 crossing) for cross-check.
const N_EMP = crossBelowSigma(THR, 1e6, 1e18); // ~3.2132e11

// Contraction factor of the fixed-point map at the root (central difference).
const H_STEP = N_CROSS_CF * 1e-6;
const G = (x) => K_THR * Math.log(effectiveHeightForN(x));
const CONTRACTION = Math.abs((G(N_CROSS_CF + H_STEP) - G(N_CROSS_CF - H_STEP)) / (2 * H_STEP));

// Closed-form vs empirical agreement, and the residual contrast with the halving landmark.
const CF_VS_EMP = Math.abs(N_CROSS_CF - N_EMP) / N_EMP; // ~7.4e-5
const REL_OFFSET = (N_CROSS_CF - N_EMP) / N_CROSS_CF; // ~7.4e-5 (closed form sits above)
const P_EMP = parts(N_EMP);
const R_FLOW_TRUNC = P_EMP.E_flow / E_TRUNC_PT; // ~3.55e-5 (far tail; cf ~1.91e-3 at halving)
const WITH_FLOW_VS_EMP = Math.abs(N_CROSS_WITH_FLOW - N_EMP) / N_EMP; // ~1.3e-15
const LOGT0_DRIFT = Math.abs(parts(N_CROSS_CF).L - P_EMP.L) / parts(N_CROSS_CF).L; // ~2.8e-6
const HALVING_REL_OFFSET = 3.98e-3; // imp-33723 halving residual, for the contrast ratio
const RESIDUAL_TIGHTENING = HALVING_REL_OFFSET / REL_OFFSET; // ~54x tighter at the far tail

export const IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM = {
  id: 'imp-33743',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33723 closed-form (fixed-point) crossover from the sigma = 1/2 halving landmark ' +
    'to the imp-33582 sigma < 0.1 FAR-TAIL landmark: solve E_coll = E_trunc*thr/(1-thr) in closed ' +
    'form at thr = 0.1 (N = (C_C(1-thr)/(E_trunc thr))^2 log T0), run Banach iteration, and measure ' +
    'the closed-form-vs-empirical residual against the imp-33582 sub-0.1 crossing N ~ 3.21e11. ' +
    'Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'N_cross(thr) = (C_C_PINNED (1-thr)/(E_trunc thr))^2 * log T0(N_cross)  (fixed point); ' +
    'K_thr = ((1-thr)/thr)^2 * (C_C/E_trunc)^2, so thr=1/2 recovers imp-33723 K, thr=1/10 gives 81 K.',
  contractionArgument:
    'g(N) = K_thr log T0(N), g_prime = K_thr*2pi/(T0 log(T0/2pi)); measured |g_prime(N_cross)| ~ 0.038 ' +
    '<< 1 (tighter than the halving 0.045, T0 larger deep in the tail) => unique fixed point, Banach ' +
    'iteration converges geometrically.',
  landmarks: {
    threshold: THR,
    K_amplitude_thr: +K_THR.toExponential(6), // ((1-thr)/thr)^2 (C_C/E_trunc)^2 ~ 1.273894e10
    amplitude_ratio_to_halving: +(K_THR / K_AMPL).toFixed(4), // 81 = ((1-thr)/thr)^2 at thr=0.1
    N_cross_closed_form: +N_CROSS_CF.toExponential(6), // ~3.213418e11
    N_cross_empirical_bisection_imp33582: +N_EMP.toExponential(6), // ~3.213181e11
    N_cross_one_shot_leading: +N_CROSS_ONESHOT.toExponential(6), // ~3.185e11 (~0.9%)
    N_cross_with_E_flow_restored: +N_CROSS_WITH_FLOW.toExponential(6), // ~3.213181e11 (matches bisection)
    contraction_factor_at_root: +CONTRACTION.toExponential(4), // ~3.79e-2
  },
  crossoverCheck: {
    closed_form_vs_empirical_rel: +CF_VS_EMP.toExponential(3), // ~7.4e-5
    one_shot_vs_converged_rel: +(Math.abs(N_CROSS_ONESHOT - N_CROSS_CF) / N_CROSS_CF).toExponential(3),
    with_flow_vs_empirical_rel: +WITH_FLOW_VS_EMP.toExponential(3), // ~1.3e-15 (E_flow closes the gap)
  },
  residualContrast: {
    fartail_rel_offset_from_closed_form: +REL_OFFSET.toExponential(4), // ~7.38e-5
    halving_rel_offset_imp33723: HALVING_REL_OFFSET, // 3.98e-3
    fartail_is_tighter_by: +RESIDUAL_TIGHTENING.toFixed(2), // ~54x
    E_flow_over_E_trunc_at_far_tail: +R_FLOW_TRUNC.toExponential(4), // ~3.55e-5 (cf ~1.91e-3 halving)
    logT0_relative_drift_over_offset: +LOGT0_DRIFT.toExponential(3), // ~2.8e-6 (2nd order)
    source:
      'Residual ~ 2 * E_flow/E_trunc (factor 2 from N proportional to E_coll^-2); E_flow ~ log T0 / T0 ' +
      'decays down the tail, so the far-tail residual is ~54x tighter than the halving residual. ' +
      'Restoring E_flow in the threshold balance closes the gap to ~1e-15 -- NOT a grid/rounding artifact.',
  },
  finding: {
    D1_closed_form_reproduces_fartail_bisection:
      'The fixed point of N = (C_C (1-thr)/(E_trunc thr))^2 log T0(N) at thr = 0.1 converges to ' +
      'N_cross ~ 3.2134e11, matching the imp-33582 sigma < 0.1 downslope bisection (~3.2132e11) to ' +
      '~7.4e-5 relative. The far-tail landmark is now pinned in closed form (an even stronger ' +
      'contraction than the halving landmark, |g_prime| ~ 0.038 vs ~0.045); a single-shot leading ' +
      'evaluation lands within ~0.9%.',
    D2_fartail_residual_is_54x_tighter_and_is_E_flow:
      'The closed-form-vs-empirical offset at thr = 0.1 is (N_cross - N_emp)/N_cross ~ 7.4e-5 ' +
      '(~0.007%), ~54x tighter than the ~0.4% halving residual imp-33723 reported. The neglected ' +
      'flow term E_flow ~ log T0 / T0 decays down the tail, so E_flow/E_trunc falls from ~1.91e-3 at ' +
      'the halving landmark to ~3.55e-5 at the far tail -- the same ~54x factor (residual ~ 2 * ' +
      'E_flow/E_trunc). Restoring E_flow in the threshold balance reproduces the bisection landmark to ' +
      '~1.3e-15, confirming the entire ~7.4e-5 gap is the flow term plus a ~2.8e-6 log T0 drift, with ' +
      'NO discretization contribution.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33723 closed-form crossover extends from ' +
    'the sigma = 1/2 halving landmark to the general threshold sigma = thr as the fixed point ' +
    'N_cross(thr) = (C_C_PINNED (1-thr)/(E_trunc thr))^2 * log T0(N_cross), the halving form scaled by ' +
    'the amplitude factor ((1-thr)/thr)^2. At the imp-33582 sigma < 0.1 far-tail landmark (thr = 0.1, ' +
    'factor 81) the map is a strong contraction (|g_prime(N_cross)| ~ 0.038), so the root is unique and ' +
    'Banach iteration converges to N_cross ~ 3.2134e11, matching the imp-33582 downslope bisection ' +
    '(~3.2132e11) to ~7.4e-5. That residual is ~54x TIGHTER than the ~0.4% halving residual because ' +
    'the neglected Gronwall flow term E_flow ~ log T0 / T0 decays down the tail (E_flow/E_trunc falls ' +
    'from ~1.91e-3 to ~3.55e-5, the same ~54x); restoring E_flow in the threshold balance closes the ' +
    'gap to ~1.3e-15, so the far-tail offset is ENTIRELY the flow term plus a ~2.8e-6 log T0 drift, ' +
    'with NO discretization contribution. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (halving-landmark closed form, thr = 1/2); imp-33582 (F2/F3: sigma < 0.1 crossing ' +
    'N ~ 3.21e11, bisected); imp-33601 (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow); ' +
    'imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the closed-form fixed point reproduces the imp-33582 sigma < 0.1 bisection landmark.
    id: 'imp33743-closed-form-matches-fartail-bisection',
    description: 'N_cross(0.1) closed-form fixed point matches imp-33582 sub-0.1 bisection to < 1e-3 relative',
    holds: () => CF_VS_EMP < 1e-3 && Math.abs(N_CROSS_CF / 3.21e11 - 1) < 5e-3,
  },
  {
    // The amplitude is the halving amplitude scaled by ((1-thr)/thr)^2 = 81 at thr = 0.1.
    id: 'imp33743-amplitude-is-81x-halving',
    description: 'K_thr = ((1-thr)/thr)^2 * (C_C/E_trunc)^2 = 81 * K_halving at thr = 0.1',
    holds: () => Math.abs(K_THR / K_AMPL - 81) < 1e-6,
  },
  {
    // The fixed-point map is a strong contraction (tighter than the halving 0.045).
    id: 'imp33743-fixed-point-is-a-contraction',
    description: 'contraction factor |g_prime(N_cross)| < 0.05 (unique fixed point, geometric convergence)',
    holds: () => CONTRACTION > 0 && CONTRACTION < 0.05,
  },
  {
    // (D2): the far-tail residual is much tighter than the halving residual (~54x).
    id: 'imp33743-fartail-residual-tighter-than-halving',
    description: 'far-tail rel offset ~7.4e-5 is > 20x tighter than the ~0.4% halving residual',
    holds: () => REL_OFFSET > 0 && REL_OFFSET < 5e-4 && RESIDUAL_TIGHTENING > 20,
  },
  {
    // (D2): restoring E_flow in the threshold balance closes the residual to floating-point zero.
    id: 'imp33743-eflow-restored-closes-residual',
    description: 'E_flow-inclusive threshold fixed point matches bisection to < 1e-9; E_flow/E_trunc > 0 tiny on tail',
    holds: () => WITH_FLOW_VS_EMP < 1e-9 && R_FLOW_TRUNC > 0 && R_FLOW_TRUNC < 1e-3,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp33743-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.verdict),
  },
];

for (const a of IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33743-sigma-fartail-crossover-closed-form assertion failed: ${a.id}`);
  }
}
