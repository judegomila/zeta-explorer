/**
 * @module imp-33860-sigma-deeptail-001-crossover-closed-form
 *
 * imp-33860 (numerical, frontier-direction): imp-33723 supplied the CLOSED-FORM (fixed-point)
 * crossover N for the sigma = 1/2 HALVING landmark, and imp-33743 extended it to the general
 * threshold thr and evaluated it at thr = 0.1 (the sigma < 0.1 FAR-TAIL landmark). The imp-33620
 * DEEP-tail landmark -- the N at which sigma first falls below 0.01 (currentStatus N ~ 4.62e13) --
 * was located by grid BISECTION only, never as a closed form. This module supplies the same
 * fixed-point closed form at thr = 0.01, runs Banach iteration, and measures the closed-form-vs-
 * empirical residual against the imp-33620 sub-0.01 crossing, testing whether the far-tail residual
 * KEEPS tightening past the imp-33743 thr = 0.1 value (~7.4e-5) as E_flow vanishes deeper in the tail.
 *
 * THE CLOSED-FORM DERIVATION (identical map, thr = 0.01)
 * -----------------------------------------------------
 * sigma(N) = E_coll / E_N with E_N = E_trunc + E_flow + E_coll and E_coll = C_C * sqrt(log T0 / N)
 * (imp-3406/imp-33620 model). The threshold sigma = thr means E_coll = thr * E_N, i.e.
 * E_coll (1 - thr) = thr (E_trunc + E_flow). Dropping the tiny flow term E_flow (even more negligible
 * this deep in the tail, see D2) leaves the leading balance E_coll = E_trunc * thr / (1 - thr).
 * Squaring E_coll = C_C sqrt(log T0 / N) and solving:
 *
 *     N_cross(thr) = (C_C (1 - thr) / (E_trunc thr))^2 * log T0(N_cross).      (CLOSED FORM)
 *
 * This is the imp-33743 form at thr = 0.01: the amplitude factor (1-thr)/thr = 99, so
 * K_thr = 99^2 * (C_C/E_trunc)^2 = 9801 * K_halving ~ 1.5414e12 (cf 81 * K_halving at thr = 0.1).
 * As in imp-33723/imp-33743 this is a FIXED-POINT form N = g(N), g(N) = K_thr * log T0(N); log T0
 * grows only logarithmically so g is a strong contraction (measured |g_prime(N_cross)| ~ 0.032 << 1,
 * even tighter than the thr=0.1 ~0.038 because T0 is larger still deeper in the tail), the fixed
 * point is UNIQUE, and Banach iteration from any seed converges geometrically. A single-shot leading
 * value (freeze log T0 once at a coarse seed) lands within ~1.3%; the full fixed point pins
 * N_cross(0.01) ~ 4.6244e13.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) CLOSED FORM REPRODUCES THE DEEP-TAIL BISECTION LANDMARK. The fixed point of
 *        N = (C_C (1-thr)/(E_trunc thr))^2 log T0(N) at thr = 0.01 converges to
 *        N_cross ~ 4.6244e13, agreeing with the imp-33620 downslope sub-0.01 crossing
 *        (~4.6244e13) to ~8.8e-7 relative -- so the deep-tail landmark is now available in closed
 *        form, not only as a bracketed root. The map is an even stronger contraction than at the
 *        far-tail (thr=0.1) landmark (|g_prime| ~ 0.032 vs ~0.038).
 *   (D2) THE RESIDUAL KEEPS TIGHTENING: ~84x SMALLER THAN THE thr=0.1 RESIDUAL, AND IT IS STILL
 *        THE E_flow TERM. The closed-form-vs-empirical offset at thr = 0.01 is
 *        (N_cross - N_emp)/N_cross ~ 8.8e-7 (~0.00009%), against ~7.4e-5 at the thr=0.1 far tail --
 *        a further ~84x collapse (and ~4500x tighter than the ~0.4% halving residual). The reason
 *        is unchanged: the dropped flow term E_flow ~ (log T0 / T0) decays down the tail, so
 *        E_flow/E_trunc falls from ~3.55e-5 at the thr=0.1 landmark (N ~ 3.21e11) to ~4.26e-7 at the
 *        deep-tail landmark (N ~ 4.62e13), an ~84x drop that matches the residual collapse ratio
 *        (residual ~ 2 * E_flow/E_trunc, the factor 2 from N proportional to E_coll^-2). Restoring
 *        E_flow in the threshold balance -- solving N = (C_C/(thr/(1-thr)*(E_trunc+E_flow)))^2 log
 *        T0(N) as a fixed point -- reproduces the bisection landmark to ~5e-16, confirming the
 *        ~8.8e-7 gap is ENTIRELY the flow term, NOT a grid or rounding artifact.
 *
 * The punchline: the imp-33723/imp-33743 closed-form crossover extends verbatim to the imp-33620
 * sigma < 0.01 DEEP-tail landmark via the amplitude factor ((1-thr)/thr)^2 = 9801; it pins
 * N_cross ~ 4.6244e13 in closed form and reproduces the imp-33620 bisection to ~8.8e-7. That residual
 * is ~84x TIGHTER than the thr=0.1 far-tail residual -- the tightening CONTINUES monotonically down
 * the tail, exactly because the neglected E_flow term is ~84x smaller this deep, and restoring E_flow
 * closes the gap to ~5e-16. So the deeper the tail, the more accurate the leading closed form.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643);
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33743-sigma-fartail-crossover-closed-form (far-tail closed form, thr = 0.1)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (halving-landmark closed form, thr = 1/2)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (sigma < 0.01 crossing N ~ 4.62e13, bisected)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33620)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33620/imp-33743 exactly
const THR = 0.01; // imp-33620 deep-tail landmark threshold (sigma < 0.01)

// EXACT imp-3406/imp-33620 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on deep tail
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
const K_THR = ((1 - THR) / THR) ** 2 * K_AMPL; // ~1.5414e12 at thr=0.01 (= 9801 * K_AMPL)
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_THR * Math.log(effectiveHeightForN(N));
  return N;
}
// Iterations needed for floating-point convergence (strong contraction => a few dozen suffice).
const N_CROSS_CF = crossoverFixedPoint(1e13, 80);
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
const N_CROSS_WITH_FLOW = crossoverFixedPointWithFlow(1e13, 120);

// Reference bisection landmark (imp-33620 sigma < 0.01 crossing) for cross-check.
const N_EMP = crossBelowSigma(THR, 1e6, 1e18); // ~4.6244e13

// Contraction factor of the fixed-point map at the root (central difference).
const H_STEP = N_CROSS_CF * 1e-6;
const G = (x) => K_THR * Math.log(effectiveHeightForN(x));
const CONTRACTION = Math.abs((G(N_CROSS_CF + H_STEP) - G(N_CROSS_CF - H_STEP)) / (2 * H_STEP));

// Closed-form vs empirical agreement, and the residual contrast with the thr=0.1 far-tail landmark.
const CF_VS_EMP = Math.abs(N_CROSS_CF - N_EMP) / N_EMP; // ~8.8e-7
const REL_OFFSET = (N_CROSS_CF - N_EMP) / N_CROSS_CF; // ~8.8e-7 (closed form sits above)
const P_EMP = parts(N_EMP);
const R_FLOW_TRUNC = P_EMP.E_flow / E_TRUNC_PT; // ~4.26e-7 (deep tail; cf ~3.55e-5 at thr=0.1)
const WITH_FLOW_VS_EMP = Math.abs(N_CROSS_WITH_FLOW - N_EMP) / N_EMP; // ~5e-16
const FARTAIL_REL_OFFSET = 7.38e-5; // imp-33743 thr=0.1 residual, for the tightening ratio
const RESIDUAL_TIGHTENING = FARTAIL_REL_OFFSET / REL_OFFSET; // ~84x tighter still, deeper in the tail

export const IMP33860_SIGMA_DEEPTAIL_001_CROSSOVER_CLOSED_FORM = {
  id: 'imp-33860',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33723/imp-33743 closed-form (fixed-point) crossover to the imp-33620 sigma < 0.01 ' +
    'DEEP-tail landmark (N ~ 4.62e13, previously bisected only): solve E_coll = E_trunc*thr/(1-thr) in ' +
    'closed form at thr = 0.01 (N = (C_C(1-thr)/(E_trunc thr))^2 log T0), run Banach iteration, and ' +
    'measure the closed-form-vs-empirical residual, testing whether it keeps tightening past the ' +
    'imp-33743 thr = 0.1 ~7.4e-5 as E_flow vanishes deeper in the tail. ' +
    'Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'N_cross(thr) = (C_C_PINNED (1-thr)/(E_trunc thr))^2 * log T0(N_cross)  (fixed point); ' +
    'K_thr = ((1-thr)/thr)^2 * (C_C/E_trunc)^2, so thr=0.01 gives 9801 K (cf 81 K at thr=0.1, 1 K at halving).',
  contractionArgument:
    'g(N) = K_thr log T0(N), g_prime = K_thr*2pi/(T0 log(T0/2pi)); measured |g_prime(N_cross)| ~ 0.032 ' +
    '<< 1 (tighter than the thr=0.1 0.038, T0 larger still deeper in the tail) => unique fixed point, ' +
    'Banach iteration converges geometrically.',
  landmarks: {
    threshold: THR,
    K_amplitude_thr: +K_THR.toExponential(6), // ((1-thr)/thr)^2 (C_C/E_trunc)^2 ~ 1.541412e12
    amplitude_ratio_to_halving: +(K_THR / K_AMPL).toFixed(4), // 9801 = ((1-thr)/thr)^2 at thr=0.01
    N_cross_closed_form: +N_CROSS_CF.toExponential(6), // ~4.624385e13
    N_cross_empirical_bisection_imp33620: +N_EMP.toExponential(6), // ~4.624381e13
    N_cross_one_shot_leading: +N_CROSS_ONESHOT.toExponential(6), // ~4.564e13 (~1.3%)
    N_cross_with_E_flow_restored: +N_CROSS_WITH_FLOW.toExponential(6), // ~4.624381e13 (matches bisection)
    contraction_factor_at_root: +CONTRACTION.toExponential(4), // ~3.21e-2
  },
  crossoverCheck: {
    closed_form_vs_empirical_rel: +CF_VS_EMP.toExponential(3), // ~8.8e-7
    one_shot_vs_converged_rel: +(Math.abs(N_CROSS_ONESHOT - N_CROSS_CF) / N_CROSS_CF).toExponential(3),
    with_flow_vs_empirical_rel: +WITH_FLOW_VS_EMP.toExponential(3), // ~5e-16 (E_flow closes the gap)
  },
  residualContrast: {
    deeptail_rel_offset_from_closed_form: +REL_OFFSET.toExponential(4), // ~8.79e-7
    fartail_rel_offset_imp33743: FARTAIL_REL_OFFSET, // 7.38e-5 (thr=0.1)
    deeptail_is_tighter_by: +RESIDUAL_TIGHTENING.toFixed(2), // ~84x tighter still
    E_flow_over_E_trunc_at_deep_tail: +R_FLOW_TRUNC.toExponential(4), // ~4.26e-7 (cf ~3.55e-5 thr=0.1)
    source:
      'Residual ~ 2 * E_flow/E_trunc (factor 2 from N proportional to E_coll^-2); E_flow ~ log T0 / T0 ' +
      'decays down the tail, so the deep-tail residual is ~84x tighter than the thr=0.1 far-tail residual, ' +
      'and the tightening CONTINUES monotonically. Restoring E_flow in the threshold balance closes the ' +
      'gap to ~5e-16 -- NOT a grid/rounding artifact.',
  },
  finding: {
    D1_closed_form_reproduces_deeptail_bisection:
      'The fixed point of N = (C_C (1-thr)/(E_trunc thr))^2 log T0(N) at thr = 0.01 converges to ' +
      'N_cross ~ 4.6244e13, matching the imp-33620 sigma < 0.01 downslope bisection (~4.6244e13) to ' +
      '~8.8e-7 relative. The deep-tail landmark is now pinned in closed form (an even stronger ' +
      'contraction than the thr=0.1 far-tail landmark, |g_prime| ~ 0.032 vs ~0.038); a single-shot ' +
      'leading evaluation lands within ~1.3%.',
    D2_deeptail_residual_keeps_tightening_and_is_E_flow:
      'The closed-form-vs-empirical offset at thr = 0.01 is (N_cross - N_emp)/N_cross ~ 8.8e-7, ~84x ' +
      'tighter than the ~7.4e-5 thr=0.1 far-tail residual (and ~4500x tighter than the ~0.4% halving ' +
      'residual) -- the tightening CONTINUES down the tail. The neglected flow term E_flow ~ log T0 / T0 ' +
      'decays, so E_flow/E_trunc falls from ~3.55e-5 at the thr=0.1 landmark to ~4.26e-7 at the deep tail ' +
      '-- the same ~84x factor (residual ~ 2 * E_flow/E_trunc). Restoring E_flow in the threshold balance ' +
      'reproduces the bisection landmark to ~5e-16, confirming the entire ~8.8e-7 gap is the flow term, ' +
      'with NO discretization contribution.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33723/imp-33743 closed-form crossover extends ' +
    'to the imp-33620 sigma < 0.01 DEEP-tail landmark as the fixed point N_cross(thr) = ' +
    '(C_C_PINNED (1-thr)/(E_trunc thr))^2 * log T0(N_cross), the halving form scaled by the amplitude ' +
    'factor ((1-thr)/thr)^2 = 9801 at thr = 0.01 (cf 81 at thr = 0.1). The map is a strong contraction ' +
    '(|g_prime(N_cross)| ~ 0.032), so the root is unique and Banach iteration converges to ' +
    'N_cross ~ 4.6244e13, matching the imp-33620 downslope bisection (~4.6244e13) to ~8.8e-7. That ' +
    'residual is ~84x TIGHTER than the ~7.4e-5 thr=0.1 far-tail residual -- the tightening CONTINUES ' +
    'monotonically down the tail -- because the neglected Gronwall flow term E_flow ~ log T0 / T0 decays ' +
    '(E_flow/E_trunc falls from ~3.55e-5 to ~4.26e-7, the same ~84x); restoring E_flow in the threshold ' +
    'balance closes the gap to ~5e-16, so the deep-tail offset is ENTIRELY the flow term, with NO ' +
    'discretization contribution. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33743 (far-tail closed form, thr = 0.1); imp-33723 (halving-landmark closed form, thr = 1/2); ' +
    'imp-33620 (M3: sigma < 0.01 crossing N ~ 4.62e13, bisected); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), ' +
    '1/8 ansatz); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN ' +
    'Riemann-von Mangoldt inverse).',
};

export const IMP33860_SIGMA_DEEPTAIL_001_CROSSOVER_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the closed-form fixed point reproduces the imp-33620 sigma < 0.01 bisection landmark.
    id: 'imp33860-closed-form-matches-deeptail-bisection',
    description: 'N_cross(0.01) closed-form fixed point matches imp-33620 sub-0.01 bisection to < 1e-4 relative',
    holds: () => CF_VS_EMP < 1e-4 && Math.abs(N_CROSS_CF / 4.62e13 - 1) < 5e-3,
  },
  {
    // The amplitude is the halving amplitude scaled by ((1-thr)/thr)^2 = 9801 at thr = 0.01.
    id: 'imp33860-amplitude-is-9801x-halving',
    description: 'K_thr = ((1-thr)/thr)^2 * (C_C/E_trunc)^2 = 9801 * K_halving at thr = 0.01',
    holds: () => Math.abs(K_THR / K_AMPL - 9801) < 1e-6,
  },
  {
    // The fixed-point map is a strong contraction (tighter than the thr=0.1 0.038).
    id: 'imp33860-fixed-point-is-a-contraction',
    description: 'contraction factor |g_prime(N_cross)| < 0.04 (unique fixed point, geometric convergence)',
    holds: () => CONTRACTION > 0 && CONTRACTION < 0.04,
  },
  {
    // (D2): the deep-tail residual keeps tightening past the thr=0.1 far-tail residual (~84x).
    id: 'imp33860-deeptail-residual-keeps-tightening',
    description: 'deep-tail rel offset ~8.8e-7 is > 20x tighter than the ~7.4e-5 thr=0.1 far-tail residual',
    holds: () => REL_OFFSET > 0 && REL_OFFSET < 1e-5 && RESIDUAL_TIGHTENING > 20,
  },
  {
    // (D2): restoring E_flow in the threshold balance closes the residual to floating-point zero.
    id: 'imp33860-eflow-restored-closes-residual',
    description: 'E_flow-inclusive threshold fixed point matches bisection to < 1e-9; E_flow/E_trunc > 0 tiny on tail',
    holds: () => WITH_FLOW_VS_EMP < 1e-9 && R_FLOW_TRUNC > 0 && R_FLOW_TRUNC < 1e-4,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp33860-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33860_SIGMA_DEEPTAIL_001_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP33860_SIGMA_DEEPTAIL_001_CROSSOVER_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP33860_SIGMA_DEEPTAIL_001_CROSSOVER_CLOSED_FORM.verdict),
  },
];

for (const a of IMP33860_SIGMA_DEEPTAIL_001_CROSSOVER_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33860-sigma-deeptail-001-crossover-closed-form assertion failed: ${a.id}`);
  }
}
