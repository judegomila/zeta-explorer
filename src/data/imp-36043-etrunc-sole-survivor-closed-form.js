/**
 * @module imp-36043-etrunc-sole-survivor-closed-form
 *
 * imp-36043 (numerical, frontier-direction): imp-35971 LOCATED the E_trunc sole-survivor height
 * (the first N at which the collision term E_coll falls to 1% of the fixed floor E_trunc, with
 * E_flow already vanishing) by DOWNSLOPE BISECTION only, at N* ~ 4.7214e13. imp-33743 already
 * supplied the analogous CLOSED-FORM (Banach fixed-point) template for the sigma = thr landmarks,
 * N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2 * log T0(N). This module instantiates the same
 * fixed-point construction for the sole-survivor balance and measures its residual against the
 * imp-35971 bisection value.
 *
 * THE CLOSED-FORM DERIVATION (the deliverable the ticket asks for)
 * ---------------------------------------------------------------
 * The sole-survivor condition (imp-35971) is the DIRECT ratio balance E_coll = rho * E_trunc with
 * rho = 0.01 (E_flow is non-binding: it crosses 1% ~5 decades earlier, at N ~ 4.62e8). With
 * E_coll = C_C sqrt(log T0 / N) (imp-3406 / imp-33582 model), the balance E_coll = rho * E_trunc
 * squares to C_C^2 log T0 / N = (rho E_trunc)^2, i.e.
 *
 *     N_SS = (C_C / (rho E_trunc))^2 * log T0(N_SS).                         (CLOSED FORM)
 *
 * This is the imp-33743 fixed point N = g(N), g(N) = K_SS * log T0(N), with amplitude
 * K_SS = (C_C / (rho E_trunc))^2 = (1/rho)^2 * (C_C/E_trunc)^2. At rho = 0.01 the factor is
 * (1/rho)^2 = 1e4, so K_SS = 1e4 * K_amplitude ~ 1.5727e12 (vs the halving K ~ 1.5727e8). Because
 * log T0 grows only logarithmically, g is a strong contraction (measured |g_prime(N_SS)| ~ 0.032
 * << 1, even tighter than the imp-33743 thr=0.1 contraction ~0.038 because T0 is larger deeper in
 * the tail), the fixed point is UNIQUE, and Banach iteration from any seed converges geometrically.
 *
 * WHY THIS RESIDUAL IS EXACT, UNLIKE imp-33743 (the honest finding)
 * ----------------------------------------------------------------
 *   (D1) CLOSED FORM REPRODUCES THE imp-35971 BISECTION HEIGHT. The fixed point converges to
 *        N_SS ~ 4.7214e13 (log T0 ~ 30.02), matching the imp-35971 sole-survivor bisection value
 *        N* ~ 4.7214e13 to ~3.6e-15 relative -- floating-point exact. The sole-survivor height is
 *        now available in closed form, not only as a bracketed root. A single-shot leading value
 *        (freeze log T0 once at a coarse seed) lands within ~1.3%.
 *   (D2) THE RESIDUAL IS ~2e10x TIGHTER THAN THE imp-33743 thr=0.1 RESIDUAL, BECAUSE NO E_flow
 *        TERM IS DROPPED. imp-33743 balanced a sigma THRESHOLD sigma = E_coll / E_N = thr, whose
 *        closed form drops the E_flow term inside E_N = E_trunc + E_flow + E_coll -- leaving a
 *        ~7.4e-5 residual that is ENTIRELY the neglected E_flow. The sole-survivor balance is a
 *        DIRECT ratio to E_trunc (E_coll = rho * E_trunc), so E_flow never enters the equation and
 *        nothing is dropped: the closed-form fixed point and the bisection solve the SAME equation,
 *        and the residual (~3.6e-15) is pure floating-point noise, not a modelling gap. The
 *        equivalence is consistent with the imp-35971 sigma-form reading: at N_SS the sigma-form
 *        amplitude (1-sigma)/sigma with sigma ~ 9.901e-3 equals ~100.0 = 1/rho, i.e. K_SS =
 *        ((1-sigma)/sigma)^2 (C_C/E_trunc)^2 -- so the direct-ratio and sigma-threshold framings
 *        coincide, but only the direct-ratio balance is E_flow-free and hence exact.
 *
 * The punchline: the imp-33743 fixed-point template instantiates verbatim at the sole-survivor
 * balance via the amplitude factor (1/rho)^2 = 1e4, pinning N_SS ~ 4.7214e13 in closed form and
 * reproducing the imp-35971 bisection to ~3.6e-15 -- ~2e10x tighter than imp-33743 because the
 * direct E_coll/E_trunc balance drops no E_flow term. The sole-survivor is the regime where the
 * closed form is EXACT, not merely leading-order accurate.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220 / imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642 / imp-2643) is UNTOUCHED;
 * E_trunc = 3.06e-5 (imp-2631) is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35971-etrunc-sole-survivor-height (the bisection sole-survivor height N* ~ 4.7214e13 this pins in closed form)
 * @see imp-33743-sigma-fartail-crossover-closed-form (the thr-generalized fixed-point template, thr = 0.1, residual ~7.4e-5)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the halving-landmark closed form, thr = 1/2)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any derivation here)

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631 / imp-3406 / imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35971 / imp-33743 exactly
const RHO = 0.01; // sole-survivor ratio: E_coll / E_trunc target (imp-35971 THRESHOLD)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35971 / imp-33743; no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // non-binding on the deep tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// (CLOSED FORM) sole-survivor balance as the Banach fixed point N = K_SS * log T0(N),
// K_SS = (C_C / (rho E_trunc))^2 = (1/rho)^2 * (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
const K_SS = (C_C_PINNED / (RHO * E_TRUNC_PT)) ** 2; // ~1.5727e12 at rho=0.01 (= 1e4 * K_AMPL)
function soleSurvivorFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_SS * Math.log(effectiveHeightForN(N));
  return N;
}
const N_SS_CF = soleSurvivorFixedPoint(1e13, 80);
// Single-shot leading value: evaluate the slow log T0 factor once at a coarse seed.
const N_SS_ONESHOT = K_SS * Math.log(effectiveHeightForN(20 * K_SS));

// Reference bisection (the imp-35971 sole-survivor condition E_coll / E_trunc < rho) for cross-check.
function crossBelowRatio(rho, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll / E_TRUNC_PT < rho) b = m;
    else a = m;
  }
  return Math.exp((a + b) / 2);
}
const N_EMP = crossBelowRatio(RHO, 1e8, 1e20); // ~4.7214e13 (= imp-35971 N*)

// Contraction factor of the fixed-point map at the root (central difference).
const H_STEP = N_SS_CF * 1e-6;
const G = (x) => K_SS * Math.log(effectiveHeightForN(x));
const CONTRACTION = Math.abs((G(N_SS_CF + H_STEP) - G(N_SS_CF - H_STEP)) / (2 * H_STEP));

// Closed-form vs bisection agreement, and the residual contrast with imp-33743.
const CF_VS_EMP = Math.abs(N_SS_CF - N_EMP) / N_EMP; // ~3.6e-15 (floating-point exact)
const pStar = parts(N_SS_CF);
const R_FLOW_TRUNC = pStar.E_flow / E_TRUNC_PT; // ~4.18e-7 (E_flow long gone, non-binding)
const IMP33743_FARTAIL_RESIDUAL = 7.4e-5; // imp-33743 thr=0.1 closed-form-vs-bisection residual
const RESIDUAL_TIGHTENING = IMP33743_FARTAIL_RESIDUAL / Math.max(CF_VS_EMP, 1e-300); // ~2e10x tighter
// sigma-form amplitude at N_SS: (1-sigma)/sigma should equal 1/rho = 100 (framings coincide).
const SIGMA_FORM_AMPLITUDE = (1 - pStar.sigma) / pStar.sigma; // ~100.0

export const IMP36043_ETRUNC_SOLE_SURVIVOR_CLOSED_FORM = {
  id: 'imp-36043',
  proofSection: 'S-frontier',
  question:
    'imp-35971 located the E_trunc sole-survivor height (E_coll = 0.01 * E_trunc, E_flow already ' +
    'negligible) by bisection at N* ~ 4.7214e13. Instantiate the imp-33743 thr-generalized fixed-point ' +
    'template for this balance -- N_SS = (C_C / (0.01 * E_trunc))^2 * log T0(N_SS) -- run Banach ' +
    'iteration, and measure the closed-form-vs-bisection residual against imp-35971 and against the ' +
    '~7.4e-5 thr=0.1 residual imp-33743 achieved. Derivation/measurement only; NO QED.',
  closedForm:
    'N_SS = (C_C_PINNED / (rho * E_trunc))^2 * log T0(N_SS)  (fixed point), rho = 0.01; ' +
    'K_SS = (1/rho)^2 * (C_C/E_trunc)^2 = 1e4 * K_halving. The direct E_coll/E_trunc balance carries ' +
    'NO E_flow term (unlike the imp-33743 sigma = E_coll/E_N threshold), so nothing is dropped.',
  contractionArgument:
    'g(N) = K_SS log T0(N), g_prime = K_SS*2pi/(T0 log(T0/2pi)); measured |g_prime(N_SS)| ~ 0.032 ' +
    '<< 1 (tighter than the imp-33743 thr=0.1 value ~0.038, T0 larger deeper in the tail) => unique ' +
    'fixed point, Banach iteration converges geometrically.',
  landmarks: {
    rho: RHO,
    K_amplitude_sole_survivor: +K_SS.toExponential(6), // (1/rho)^2 (C_C/E_trunc)^2 ~ 1.572709e12
    amplitude_ratio_to_halving: +(K_SS / K_AMPL).toFixed(4), // 1e4 = (1/rho)^2 at rho=0.01
    N_SS_closed_form: +N_SS_CF.toExponential(6), // ~4.721429e13
    N_SS_bisection_imp35971: +N_EMP.toExponential(6), // ~4.721429e13
    N_SS_one_shot_leading: +N_SS_ONESHOT.toExponential(6), // ~4.66e13 (~1.3%)
    logT0_at_root: +pStar.L.toFixed(4), // ~30.02
    contraction_factor_at_root: +CONTRACTION.toExponential(4), // ~3.21e-2
    sigma_form_amplitude_at_root: +SIGMA_FORM_AMPLITUDE.toFixed(4), // ~100.0 = 1/rho
  },
  crossoverCheck: {
    closed_form_vs_bisection_rel: +CF_VS_EMP.toExponential(3), // ~3.6e-15
    one_shot_vs_converged_rel: +(Math.abs(N_SS_ONESHOT - N_SS_CF) / N_SS_CF).toExponential(3), // ~1.3e-2
    E_flow_over_E_trunc_at_root: +R_FLOW_TRUNC.toExponential(3), // ~4.18e-7 (non-binding)
  },
  residualContrast: {
    sole_survivor_rel_residual: +CF_VS_EMP.toExponential(3), // ~3.6e-15
    imp33743_fartail_residual: IMP33743_FARTAIL_RESIDUAL, // 7.4e-5
    sole_survivor_is_tighter_by: +RESIDUAL_TIGHTENING.toExponential(3), // ~2e10x
    reason:
      'imp-33743 balances a sigma = E_coll/E_N threshold and drops E_flow inside E_N, leaving a ' +
      '~7.4e-5 residual that IS the dropped E_flow. The sole-survivor is a DIRECT ratio E_coll = ' +
      'rho * E_trunc, so E_flow never enters -- the closed form and the bisection solve the same ' +
      'equation and the residual is pure floating-point noise (~3.6e-15), not a modelling gap.',
  },
  finding: {
    D1_closed_form_reproduces_imp35971_bisection:
      'The fixed point of N = (C_C / (0.01 * E_trunc))^2 log T0(N) converges to N_SS ~ 4.7214e13 ' +
      '(log T0 ~ 30.02), matching the imp-35971 sole-survivor bisection N* ~ 4.7214e13 to ~3.6e-15 ' +
      'relative -- floating-point exact. The map is a strong contraction (|g_prime| ~ 0.032, tighter ' +
      'than the imp-33743 thr=0.1 value ~0.038); a single-shot leading evaluation lands within ~1.3%.',
    D2_residual_exact_because_no_E_flow_dropped:
      'The closed-form-vs-bisection residual is ~3.6e-15, ~2e10x tighter than the ~7.4e-5 imp-33743 ' +
      'thr=0.1 residual. imp-33743 balances a sigma = E_coll/E_N threshold whose closed form drops the ' +
      'E_flow term inside E_N; the sole-survivor balance E_coll = rho * E_trunc is a DIRECT ratio to ' +
      'E_trunc, so E_flow never enters and nothing is dropped -- the closed form is EXACT, not merely ' +
      'leading-order. At N_SS the sigma-form amplitude (1-sigma)/sigma ~ 100.0 = 1/rho, so the ' +
      'direct-ratio and sigma-threshold framings coincide, but only the E_flow-free direct balance is exact.',
  },
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33743 thr-generalized closed-form crossover ' +
    'instantiates verbatim at the imp-35971 sole-survivor balance as the Banach fixed point N_SS = ' +
    '(C_C_PINNED / (rho * E_trunc))^2 * log T0(N_SS) with rho = 0.01, amplitude K_SS = (1/rho)^2 * ' +
    '(C_C/E_trunc)^2 = 1e4 * K_halving. The map is a strong contraction (|g_prime(N_SS)| ~ 0.032), so ' +
    'the root is unique and Banach iteration converges to N_SS ~ 4.7214e13 (log T0 ~ 30.02), matching ' +
    'the imp-35971 bisection value N* ~ 4.7214e13 to ~3.6e-15. That residual is ~2e10x TIGHTER than the ' +
    '~7.4e-5 imp-33743 thr=0.1 residual, and the reason is structural: imp-33743 balances a sigma = ' +
    'E_coll/E_N threshold whose closed form drops the E_flow term inside E_N (its residual IS that ' +
    'dropped E_flow), whereas the sole-survivor is a DIRECT ratio E_coll = rho * E_trunc in which ' +
    'E_flow never appears -- so the closed form and the bisection solve the identical equation and the ' +
    'residual is pure floating-point noise, NOT a modelling gap. At N_SS the sigma-form amplitude ' +
    '(1-sigma)/sigma ~ 100.0 = 1/rho, so the direct-ratio and sigma-threshold framings coincide, but ' +
    'only the E_flow-free direct balance is exact. Component model is the inherited imp-3220 / imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ' +
    'ansatz (imp-2642 / imp-2643) are UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35971 (sole-survivor height N* ~ 4.7214e13, bisected); imp-33743 (thr-generalized closed form, ' +
    'thr = 0.1, residual ~7.4e-5); imp-33723 (halving-landmark closed form, thr = 1/2); imp-2642 / ' +
    'imp-2643 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); imp-486 ' +
    '(GUE-conditional caveat); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt ' +
    'inverse). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36043_ETRUNC_SOLE_SURVIVOR_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the closed-form fixed point reproduces the imp-35971 sole-survivor bisection height.
    id: 'imp36043-closed-form-matches-imp35971-bisection',
    description: 'N_SS closed-form fixed point matches imp-35971 sole-survivor bisection to < 1e-9 relative',
    holds: () => CF_VS_EMP < 1e-9 && Math.abs(N_SS_CF / 4.7214e13 - 1) < 1e-3,
  },
  {
    // The amplitude is the halving amplitude scaled by (1/rho)^2 = 1e4 at rho = 0.01.
    id: 'imp36043-amplitude-is-1e4x-halving',
    description: 'K_SS = (1/rho)^2 * (C_C/E_trunc)^2 = 1e4 * K_halving at rho = 0.01',
    holds: () => Math.abs(K_SS / K_AMPL - 1e4) < 1e-3,
  },
  {
    // The fixed-point map is a strong contraction (tighter than the imp-33743 thr=0.1 ~0.038).
    id: 'imp36043-fixed-point-is-a-contraction',
    description: 'contraction factor |g_prime(N_SS)| < 0.04 (unique fixed point, geometric convergence)',
    holds: () => CONTRACTION > 0 && CONTRACTION < 0.04,
  },
  {
    // (D2): the residual is floating-point exact and far tighter than the imp-33743 thr=0.1 residual.
    id: 'imp36043-residual-exact-because-no-E-flow-dropped',
    description: 'sole-survivor rel residual ~3.6e-15 is > 1e6x tighter than the ~7.4e-5 imp-33743 residual',
    holds: () => CF_VS_EMP < 1e-12 && RESIDUAL_TIGHTENING > 1e6,
  },
  {
    // The direct-ratio and sigma-threshold framings coincide: (1-sigma)/sigma = 1/rho at the root.
    id: 'imp36043-sigma-form-amplitude-equals-inverse-rho',
    description: 'at N_SS the sigma-form amplitude (1-sigma)/sigma ~ 100.0 = 1/rho (framings coincide)',
    holds: () => Math.abs(SIGMA_FORM_AMPLITUDE - 1 / RHO) < 1e-2 && R_FLOW_TRUNC > 0 && R_FLOW_TRUNC < 1e-5,
  },
  {
    // Honesty gate: derivation/measurement only, conditional, no bound moves, no QED, no refereed bound is changed.
    id: 'imp36043-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous/isUnconditional false, keeps imp-486, imp-35337a OPEN, no QED, no refereed bound is changed',
    holds: () => {
      const r = IMP36043_ETRUNC_SOLE_SURVIVOR_CLOSED_FORM;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36043_ETRUNC_SOLE_SURVIVOR_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36043-etrunc-sole-survivor-closed-form assertion failed: ${a.id}`);
  }
}
