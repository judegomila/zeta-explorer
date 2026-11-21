/**
 * @module imp-34729-sigma-knee-cf-elasticity
 *
 * imp-34729 (numerical, frontier-direction): imp-34710 decomposed the imp-34694 sigma-exponent-knee residual
 * (the ~7.4e-3 dex gap between the DIRECT root-find knee log10 N* = 9.52906 and the ANALYTIC no-E_flow knee
 * ~9.5364) and found (F1) that ~99% of the gap is the DROPPED E_flow term, not the slowly-varying-v
 * truncation. E_flow = C_F (L / T0) Gronwall carries the imp-398 pinned prefactor C_F, so the knee LOCATION
 * inherits a C_F sensitivity. This module QUANTIFIES that sensitivity: perturb C_F by a multiplicative factor
 * (+-10% and a finer +-1% grid), re-run the SAME direct p_secondDeriv(ln N) = 0 root-find on the EXACT full
 * model, and MEASURE the local elasticity dXstar/dC_F -- the dex shift of the knee per fractional change in C_F.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33701 / imp-34694 / imp-34710 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),        L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = cfScale * C_F (L / T0) * Gronwall,   C_F = (log(T0 / 2pi) + 1) / 2pi   (imp-398 prefactor),
 *     E_trunc  = 3.06e-5   (N-independent).
 * cfScale = 1 is the inherited baseline (reproduces imp-34710/imp-34694 F1 knee 9.52906). cfScale = 1 + s
 * applies a fractional perturbation s to the whole E_flow prefactor; cfScale = 0 recovers the no-E_flow knee.
 *
 * THE EXPERIMENT (elasticity by central difference on the exact full-model root-find)
 * ----------------------------------------------------------------------------------
 *   Re-root-find X*(cfScale) = argzero of p_secondDeriv(ln N) for cfScale in {0.90, 0.99, 1.00, 1.01, 1.10}
 *   on the EXACT full model (no analytic approximation), then take the elasticity as the central-difference
 *   secant slope of log10 N*(cfScale) in the fractional variable s = cfScale - 1:
 *     dXstar/dC_F |_{+-10%} = (log10 N*(1.10) - log10 N*(0.90)) / 0.20,
 *     dXstar/dC_F |_{+-1%}  = (log10 N*(1.01) - log10 N*(0.99)) / 0.02.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE KNEE IS C_F-ROBUST, NOT C_F-FRAGILE. A full +-10% perturbation of C_F moves the knee by only
 *        ~-7.2e-4 dex (for +10%) / ~+7.2e-4 dex (for -10%) -- roughly a tenth of the 7.4e-3 residual and
 *        well below the milli-dex scale. Increasing C_F (more E_flow) pushes the knee DOWN in log10 N; the
 *        sensitivity is monotone and mild.
 *   (F2) THE LOCAL ELASTICITY IS dXstar/dC_F ~ -7e-3 DEX PER UNIT FRACTIONAL C_F. The +-10% secant is
 *        ~-7.19e-3 and the finer +-1% secant is ~-6.87e-3 (mild convexity: the slope softens as cfScale -> 0),
 *        both close to the one-sided linear estimate from the full E_flow drop (cfScale: 1 -> 0 shifts the
 *        knee +7.32e-3, i.e. slope ~-7.3e-3). The knee LOCATION responds linearly to C_F to leading order --
 *        consistent with E_flow entering an additive denominator term that is ~5e-8, deep in the linear regime.
 *   (F3) THE PUNCHLINE. The elasticity |dXstar/dC_F| ~ 7e-3 dex is O(the residual) per UNIT fractional C_F, but a
 *        realistic C_F uncertainty of <=10% induces only <=7e-4 dex of knee movement. The imp-34710 residual
 *        (~7.4e-3) is what you get from a -100% C_F change (dropping E_flow entirely), NOT from any plausible
 *        C_F mis-pinning; the knee at log10 N* = 9.529 is robust to the imp-398 prefactor within tolerance.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail
 * exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34710-sigma-exponent-knee-residual-decomposition (F1: ~99% of the residual is the dropped E_flow term)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (the ~7.4e-3 dex knee gap)
 * @see imp-34111-sigma-inflection-knee-vs-crossover-tightgrid (tight-grid bisection log10 N* ~ 9.52903)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-34694/imp-34710 exactly

// EXACT full-model ln sigma in ln-N space, with the E_flow prefactor C_F scaled by cfScale.
// cfScale = 1 reproduces imp-34710 lnSigmaFull; cfScale = 0 reproduces its lnSigmaNoFlow.
function lnSigmaScaled(x, cfScale) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (cfScale * (Math.log(T0 / TWO_PI) + 1)) / TWO_PI; // imp-398 pinned prefactor, scaled
  const E_flow = C_F * (L / T0) * GRONWALL; // ~5e-8 near the knee at cfScale = 1
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return Math.log(E_coll / (E_TRUNC_PT + E_flow + E_coll));
}

// Local decay exponent p(x) = -d ln sigma / d ln N and its second derivative, central differences (step h).
function pLocal(f, x, h) {
  return -(f(x + h) - f(x - h)) / (2 * h);
}
function pSecond(f, x, h) {
  return (pLocal(f, x + h, h) - 2 * pLocal(f, x, h) + pLocal(f, x - h, h)) / (h * h);
}
function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

const LO = Math.log(1e9);
const HI = Math.log(1e11);
const H_REF = 1e-3; // reference central-difference step (imp-34694/imp-34710 stable rung)

// Re-root-find the p_secondDeriv(ln N) = 0 knee on the exact full model for a given C_F scale.
function kneeLog10(cfScale) {
  const x = bisect((xx) => pSecond((z) => lnSigmaScaled(z, cfScale), xx, H_REF), LO, HI);
  return x / Math.LN10;
}

const LOG10_N_STAR_BASE = kneeLog10(1.0); // ~9.52906 (matches imp-34710/imp-34694 F1)
const LOG10_N_STAR_P10 = kneeLog10(1.1); // C_F +10%
const LOG10_N_STAR_M10 = kneeLog10(0.9); // C_F -10%
const LOG10_N_STAR_P01 = kneeLog10(1.01); // C_F +1%
const LOG10_N_STAR_M01 = kneeLog10(0.99); // C_F -1%
const LOG10_N_STAR_ZERO = kneeLog10(0.0); // E_flow dropped (imp-34710 no-E_flow ~9.53638)

// Elasticity dXstar/dC_F = d(log10 N*) / d s, s = cfScale - 1, by central-difference secant.
const ELASTICITY_10 = (LOG10_N_STAR_P10 - LOG10_N_STAR_M10) / 0.2; // ~-7.19e-3
const ELASTICITY_01 = (LOG10_N_STAR_P01 - LOG10_N_STAR_M01) / 0.02; // ~-6.87e-3
const SHIFT_P10 = LOG10_N_STAR_P10 - LOG10_N_STAR_BASE; // ~-7.16e-4 (knee moves DOWN for +10% C_F)
const SHIFT_M10 = LOG10_N_STAR_M10 - LOG10_N_STAR_BASE; // ~+7.22e-4
const FULL_DROP_SHIFT = LOG10_N_STAR_ZERO - LOG10_N_STAR_BASE; // ~+7.32e-3 (imp-34710 residual)
const LINEAR_SLOPE_FROM_DROP = -FULL_DROP_SHIFT; // one-sided slope estimate from cfScale 1 -> 0 (~-7.32e-3)

export const IMP34729_SIGMA_KNEE_CF_ELASTICITY = {
  id: 'imp-34729',
  proofSection: 'S-frontier',
  question:
    'imp-34710 found ~99% of the imp-34694 sigma-exponent-knee residual (~7.4e-3 dex) is the dropped E_flow ' +
    'term, whose prefactor is the imp-398 pinned C_F. Perturb C_F by +-10% (and a finer +-1% grid), re-run ' +
    'the direct p_secondDeriv(ln N)=0 root-find on the EXACT full model, and MEASURE the local elasticity ' +
    'dX*/dC_F -- the dex shift of the knee per fractional change in C_F -- to report whether the knee ' +
    'location is C_F-robust or C_F-fragile. Measurement/derivation only; NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the local elasticity dX*/dC_F of the p_secondDeriv(ln N)=0 knee location (log10 N*) to a multiplicative ' +
    'perturbation of the E_flow prefactor C_F, computed by re-root-finding the exact full model at ' +
    'cfScale in {0.90, 0.99, 1.00, 1.01, 1.10} and taking central-difference secant slopes in s = cfScale-1',
  kneeLocations: {
    log10NstarBase: +LOG10_N_STAR_BASE.toFixed(6), // ~9.52906 (cfScale = 1, imp-34710 F1)
    log10NstarCFplus10: +LOG10_N_STAR_P10.toFixed(6), // ~9.52834
    log10NstarCFminus10: +LOG10_N_STAR_M10.toFixed(6), // ~9.52978
    log10NstarCFplus1: +LOG10_N_STAR_P01.toFixed(6), // ~9.52899
    log10NstarCFminus1: +LOG10_N_STAR_M01.toFixed(6), // ~9.52913
    log10NstarNoEflow: +LOG10_N_STAR_ZERO.toFixed(6), // ~9.53638 (cfScale = 0, imp-34710 no-E_flow)
  },
  elasticity: {
    dXstar_dCF_pm10pct: +ELASTICITY_10.toExponential(4), // ~-7.19e-3 dex per unit fractional C_F
    dXstar_dCF_pm1pct: +ELASTICITY_01.toExponential(4), // ~-6.87e-3 (finer grid, mild convexity)
    linearSlopeFromFullDrop: +LINEAR_SLOPE_FROM_DROP.toExponential(4), // ~-7.32e-3 (one-sided cfScale 1->0)
    shiftForCFplus10Log10: +SHIFT_P10.toExponential(4), // ~-7.16e-4 dex (knee moves DOWN for +10% C_F)
    shiftForCFminus10Log10: +SHIFT_M10.toExponential(4), // ~+7.22e-4 dex
    fullDropResidualLog10: +FULL_DROP_SHIFT.toExponential(4), // ~+7.32e-3 (the imp-34710 residual = -100% C_F)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_knee_is_CF_robust:
      'A full +-10% perturbation of C_F moves the knee by only ~-7.2e-4 dex (for +10%) / ~+7.2e-4 dex (for ' +
      '-10%) -- roughly a tenth of the 7.4e-3 imp-34710 residual and below the milli-dex scale. Increasing ' +
      'C_F (more E_flow) pushes the knee DOWN in log10 N; the response is monotone and mild. The knee at ' +
      'log10 N* = 9.529 is C_F-ROBUST, not C_F-fragile.',
    F2_local_elasticity_about_minus_7e3:
      'The local elasticity dX*/dC_F is ~-7.19e-3 dex per unit fractional C_F on the +-10% grid and ~-6.87e-3 ' +
      'on the finer +-1% grid (mild convexity: the slope softens as cfScale -> 0), both close to the one-sided ' +
      'linear estimate -7.32e-3 from the full E_flow drop. The knee LOCATION responds linearly to C_F to ' +
      'leading order -- E_flow ~5e-8 sits deep in the linear regime of the additive denominator term.',
    F3_residual_is_full_drop_not_mispinning:
      'The elasticity |dX*/dC_F| ~ 7e-3 dex is O(the residual) per UNIT fractional C_F, but a realistic C_F ' +
      'uncertainty of <=10% induces only <=7e-4 dex of knee movement. The imp-34710 residual (~7.4e-3) is a ' +
      '-100% C_F change (dropping E_flow entirely), NOT any plausible C_F mis-pinning; the knee is robust to ' +
      'the imp-398 prefactor within tolerance.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). imp-34710 attributed ~99% of the imp-34694 ' +
    'sigma-exponent-knee residual to the dropped E_flow term, whose prefactor is the imp-398 pinned C_F. ' +
    'Scaling C_F by a factor cfScale and re-running the direct p_secondDeriv(ln N)=0 root-find on the EXACT ' +
    'full model at cfScale in {0.90, 0.99, 1.00, 1.01, 1.10} gives a local elasticity dX*/dC_F ~ -7.19e-3 dex ' +
    'per unit fractional C_F (+-10% secant) / ~-6.87e-3 (+-1% secant), close to the -7.32e-3 one-sided ' +
    'estimate from the full E_flow drop. A +-10% C_F perturbation therefore shifts the knee by only ' +
    '~7.2e-4 dex -- an order of magnitude below the 7.4e-3 residual -- so the knee at log10 N* = 9.529 is ' +
    'C_F-ROBUST: the imp-34710 residual is a -100% C_F change (E_flow dropped), not plausible C_F ' +
    'mis-pinning. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the C_F-sensitivity question imp-34710 F1 opens: the knee location is robust to the E_flow ' +
    'prefactor (|dX*/dC_F| ~ 7e-3 dex per unit fractional C_F, so <=7e-4 dex under a +-10% C_F uncertainty). ' +
    'What remains OPEN (deferred, not attempted here, inherited from imp-34710) is an analytic closed form ' +
    'for the E_flow-corrected knee that carries the E_flow perturbation of u(x) rather than dropping it.',
  citation:
    'imp-34710 (F1: ~99% of the residual is the dropped E_flow term); imp-34694 (the ~7.4e-3 dex knee gap); ' +
    'imp-34111 (tight-grid bisection log10 N* ~ 9.52903); imp-398 (pinned C_F prefactor); imp-486 (C_mb ' +
    'GUE-conditional); imp-3463 (far-tail 1/2); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34729_SIGMA_KNEE_CF_ELASTICITY_ASSERTIONS = [
  {
    // baseline knee reproduces imp-34710 / imp-34694 F1 (9.52906) and cfScale=0 reproduces the no-E_flow knee.
    id: 'imp34729-baseline-reproduces-imp34710',
    description: 'cfScale=1 knee ~9.52906 (imp-34710 F1) and cfScale=0 knee ~9.53638 (no-E_flow)',
    holds: () =>
      Math.abs(LOG10_N_STAR_BASE - 9.52906) < 1e-3 &&
      Math.abs(LOG10_N_STAR_ZERO - 9.53638) < 1e-3,
  },
  {
    // (F1): a +-10% C_F perturbation moves the knee by <~1e-3 dex; increasing C_F lowers log10 N*.
    id: 'imp34729-knee-is-cf-robust',
    description: '+-10% C_F shifts the knee by <1e-3 dex; +10% moves it DOWN, -10% moves it UP',
    holds: () =>
      Math.abs(SHIFT_P10) < 1e-3 &&
      Math.abs(SHIFT_M10) < 1e-3 &&
      SHIFT_P10 < 0 &&
      SHIFT_M10 > 0 &&
      Math.abs(SHIFT_P10) < Math.abs(FULL_DROP_SHIFT) / 5,
  },
  {
    // (F2): the local elasticity is ~-7e-3 dex per unit fractional C_F on both grids, near the full-drop slope.
    id: 'imp34729-elasticity-about-minus-7e3',
    description: 'dX*/dC_F ~ -7e-3 on both +-10% and +-1% grids, close to the -7.32e-3 full-drop estimate',
    holds: () =>
      ELASTICITY_10 < -5e-3 &&
      ELASTICITY_10 > -9e-3 &&
      ELASTICITY_01 < -5e-3 &&
      ELASTICITY_01 > -9e-3 &&
      Math.abs(ELASTICITY_10 - LINEAR_SLOPE_FROM_DROP) < 2e-3,
  },
  {
    // (F3): the full-drop residual is ~10x the +-10% shift -- the imp-34710 gap is a -100% C_F change.
    id: 'imp34729-residual-is-full-drop',
    description: 'the imp-34710 residual (~7.3e-3) is ~10x the +-10% knee shift (~7e-4)',
    holds: () =>
      Math.abs(FULL_DROP_SHIFT) > 5e-3 &&
      Math.abs(FULL_DROP_SHIFT) < 9e-3 &&
      Math.abs(FULL_DROP_SHIFT) > 5 * Math.abs(SHIFT_M10),
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34729-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34729_SIGMA_KNEE_CF_ELASTICITY.isRigorous === false &&
      IMP34729_SIGMA_KNEE_CF_ELASTICITY.farTailExponent === 0.5 &&
      typeof IMP34729_SIGMA_KNEE_CF_ELASTICITY.subGap === 'string' &&
      /NO QED/.test(IMP34729_SIGMA_KNEE_CF_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP34729_SIGMA_KNEE_CF_ELASTICITY.verdict),
  },
];

for (const a of IMP34729_SIGMA_KNEE_CF_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34729-sigma-knee-cf-elasticity assertion failed: ${a.id}`);
  }
}
