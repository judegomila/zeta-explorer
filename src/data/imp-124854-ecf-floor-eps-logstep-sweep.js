/**
 * @module imp-124854-ecf-floor-eps-logstep-sweep
 *
 * imp-124854 (accuracy/cross-check, frontier): imp-124810 M1/M2 modeled the DIRECT E_CF finite-difference round-off
 * floor as R ~ TOL / ln((1+eps)/(1-eps)) in the tolerance-limited regime, and reported it SATURATING at a double-
 * precision floor R_inf ~ 4.46e-13 "set by the double-precision ULP of ln N_L divided by the eps = 1e-3 log-step".
 * But imp-124810 swept ONLY the bisection tolerance TOL and held the amplitude stencil step eps FIXED at 1e-3, so the
 * asserted eps-log-step term was never tested against a varying eps. This leaf reuses the imp-124810/imp-124769
 * machinery VERBATIM (parts / landmark(...,tol) / dSigmaDlnN / directCFElasticity) and sweeps the stencil eps across
 * several decades at TWO tolerances -- an extended TOL = 1e-13 (still tolerance-limited at eps = 1e-3, reproducing the
 * imp-124810 R(1e-13) = 3.86e-11 rung) and the machine-limit TOL = 0 (the imp-124810/imp-124769 solve) -- measuring
 * whether R and R_inf scale with the predicted eps log-step term. Accuracy/cross-validation only; conditional-share
 * diagnostic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; pinned constants perturbed only symbolically as
 * differentiation axes; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-124769/imp-124810 crossing relation, reused verbatim)
 * --------------------------------------------------------------------------------------
 *   E_N = E_trunc + E_flow + E_coll, sigma = E_coll/E_N; the landmark N_L(f;TOL) at level L is the downslope solution
 *   of sigma(N_L) = L, bisected in ln N to half-width TOL (TOL <= 0 = run-to-machine-limit). The DIRECT crossing
 *   elasticity is E_CF = [ln N_L(1+eps) - ln N_L(1-eps)] / ln((1+eps)/(1-eps)) (a symmetric 2-point central-difference
 *   quotient in ln f), and R = |E_CF_direct - E_CF_recon| is the L5 (sigma = 0.02) headline error, the imp-124769/
 *   imp-124810 "floor rung". E_CF_recon = K*(-E_flow*sigma/E_N), K = -1/(N sigma_N), via the 5-point O(h^4) N-stencil.
 *
 * THE eps SWEEP (the deliverable)
 * ------------------------------
 * For eps in {3e-2 .. 1e-5} at each of TOL = 1e-13 (extended) and TOL = 0 (machine) rebuild the L5 direct elasticity
 * and read R(eps), the log-step ln((1+eps)/(1-eps)), the truncation ratio R/eps^2 and the round-off product R*logStep.
 *
 * THE FINDING (accuracy / cross-validation only)
 * ----------------------------------------------
 *   (E1) LARGE-eps TRUNCATION REGIME: R ~ a*eps^2 WITH a ~ 1.08e-6, TOL-INDEPENDENT. For eps >= 1e-2 the ratio
 *        R/eps^2 pins at a ~ 1.08e-6 identically at BOTH tolerances (round-off is negligible against the O(eps^2)
 *        2-point-stencil truncation), and the extrapolation a*(1e-3)^2 ~ 1.08e-12 REPRODUCES the imp-124849
 *        dps-invariant "true stencil floor" 1.0819e-12 -- so the eps^2 term is exactly the 2-point directCF
 *        truncation, independent of the landmark solve resolution.
 *   (E2) SMALL-eps ROUND-OFF REGIME AT MACHINE TOL: R SCALES AS 1/logStep, CONFIRMING THE imp-124810 eps-LOG-STEP
 *        CLAUSE. Below the optimum (eps <= 1e-4, TOL = 0) the round-off product R*logStep stays pinned at the ULP of
 *        ln N_L (~1e-15, i.e. ~ few*eps_mach*|ln N_L|), so R ~ ULP/logStep ~ 1/(2 eps) grows as eps shrinks -- exactly
 *        the "ULP of ln N_L divided by the log-step" term imp-124810 asserted but never swept. At extended TOL = 1e-13
 *        the same round-off product is TOL-set (~1e-13) rather than ULP-set, i.e. R ~ TOL/logStep, confirming the
 *        imp-124810 tolerance-limited form as the eps-general R ~ (bisection resolution)/logStep.
 *   (E3) CORRECTION -- R_inf IS A U-CURVE MINIMUM AT eps ~ 1e-3, NOT A MONOTONE FLOOR. At machine TOL, R(eps) is a
 *        truncation-plus-round-off U-curve minimized at eps ~ 1e-3 (R = 4.46e-13 = the imp-124810 R_inf), rising for
 *        LARGER eps as a*eps^2 (truncation) AND for SMALLER eps as ULP/logStep (round-off). So the imp-124810
 *        R_inf ~ 4.46e-13 is the MINIMUM of the two competing terms at the crossover eps = 1e-3, NOT a monotone
 *        double-precision floor; its "divided by the eps = 1e-3 log-step" clause is real but pins the value only at
 *        that crossover, and (per imp-124849) 4.46e-13 is a round-off-contaminated UNDER-estimate of the pure eps^2
 *        truncation 1.08e-12. The imp-124810 formula is thus CONFIRMED in structure (two eps-scaling terms, one
 *        truncation one log-step round-off) and CORRECTED in interpretation (crossover minimum, not saturating floor).
 *
 * ACCURACY / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124810-bisection-tol-roundoff-floor-sweep (the TOL-only sweep and the eps-log-step clause tested here)
 * @see imp-124849-extprec-ecf-floor-sigmacrit (the dps-invariant true stencil floor R ~ 1.08e-12 = a*eps^2 at eps=1e-3)
 * @see imp-124888-ecf-floor-higher-order-stencil (the 5-point O(eps^4) attribution of the O(eps^2) 2-point signature)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the R ~ 4.5e-13 floor and sigma_crit ~ 0.013 pin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-124769/imp-124810

// EXACT imp-124810 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level, bisecting ln N to half-width TOL (TOL <= 0 runs to the machine limit).
function landmark(level, cc, et, cf, tol) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 2000; i++) {
    if (tol > 0 && (b - a) / 2 <= tol) break;
    const m = (a + b) / 2;
    if (m === a || m === b) break; // machine limit reached (bracket no longer splits)
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// d sigma / d ln N via 5-point O(h^4) stencil -- for the shared kernel K (it cancels in the sum).
function dSigmaDlnN(N, h) {
  const s = (d) => parts(N * Math.exp(d), C_C_PINNED, E_TRUNC_PT, 1.0).sigma;
  return (-s(2 * h) + 8 * s(h) - 8 * s(-h) + s(-2 * h)) / (12 * h);
}

// DIRECT single-axis (cf) crossing elasticity by re-solving the landmark under a symmetric +/- eps perturbation of
// cf at the given bisection tolerance (verbatim imp-124810 directCFElasticity, eps now the swept axis).
function directCFElasticity(level, eps, tol) {
  const solve = (sgn) => Math.log(landmark(level, C_C_PINNED, E_TRUNC_PT, 1.0 * (1 + sgn * eps), tol));
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K only (unchanged from imp-124810)
const SIGMA_L5 = 0.02; // the imp-124769/imp-124810 floor rung read as R

// The eps-INDEPENDENT reconstruction reference (5-point O(h^4) N-stencil), at the machine-limit landmark.
function reconCFat(level) {
  const N = landmark(level, C_C_PINNED, E_TRUNC_PT, 1.0, 0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const K = -1 / dSigmaDlnN(N, H_STENCIL);
  return K * (-P.E_flow * P.sigma / P.E_N);
}
const RECON_CF_L5 = reconCFat(SIGMA_L5);
const LN_N_L5 = Math.log(landmark(SIGMA_L5, C_C_PINNED, E_TRUNC_PT, 1.0, 0)); // ~ ln N_L for the ULP scale

const EPS_LADDER = [3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4, 3e-5, 1e-5];
const TOL_CASES = [
  { name: 'extendedTOL', tol: 1e-13 }, // still tolerance-limited at eps = 1e-3 (imp-124810 R(1e-13) = 3.86e-11 rung)
  { name: 'machineTOL', tol: 0 }, // the imp-124810 / imp-124769 run-to-machine-limit solve
];

function sweepEpsAtTol(tol) {
  return EPS_LADDER.map((eps) => {
    const logStep = Math.log((1 + eps) / (1 - eps));
    const directCF = directCFElasticity(SIGMA_L5, eps, tol);
    const R = Math.abs(directCF - RECON_CF_L5);
    return { eps, logStep, R, truncRatio: R / (eps * eps), roundoffProduct: R * logStep };
  });
}

const SWEEP = TOL_CASES.map(({ name, tol }) => ({ name, tol, rows: sweepEpsAtTol(tol) }));
const byName = Object.fromEntries(SWEEP.map((s) => [s.name, s]));
const rowAt = (name, eps) => byName[name].rows.find((r) => r.eps === eps);

// (E1) large-eps truncation coefficient a = R/eps^2, averaged over the two large-eps rungs at each TOL.
const truncCoeffAt = (name) =>
  (rowAt(name, 3e-2).truncRatio + rowAt(name, 1e-2).truncRatio) / 2;
const A_TRUNC_EXT = truncCoeffAt('extendedTOL');
const A_TRUNC_MACHINE = truncCoeffAt('machineTOL');
const A_TRUNC = (A_TRUNC_EXT + A_TRUNC_MACHINE) / 2;
const TRUNC_FLOOR_AT_1EM3 = A_TRUNC * 1e-3 * 1e-3; // extrapolated pure-truncation R at eps = 1e-3

// (E2) small-eps round-off product at machine TOL (ULP of ln N_L, ~ few*eps_mach*|ln N_L|).
const ROUNDOFF_PRODUCT_MACHINE = rowAt('machineTOL', 1e-4).roundoffProduct;
const ULP_LN_N = Math.abs(LN_N_L5) * Number.EPSILON; // ~ one ULP of ln N_L for scale comparison

// (E3) U-curve minimum at eps = 1e-3 (machine TOL) = the imp-124810 R_inf.
const R_MIN_MACHINE = rowAt('machineTOL', 1e-3).R;
const R_LARGE_MACHINE = rowAt('machineTOL', 1e-2).R; // truncation side
const R_SMALL_MACHINE = rowAt('machineTOL', 1e-4).R; // round-off side
const R_EXT_AT_1EM3 = rowAt('extendedTOL', 1e-3).R; // reproduces imp-124810 R(1e-13) = 3.86e-11

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124854_ECF_FLOOR_EPS_LOGSTEP_SWEEP = {
  id: 'imp-124854',
  proofSection: 'S-frontier',
  question:
    'imp-124810 M1/M2 modeled the DIRECT E_CF round-off floor as R ~ TOL / ln((1+eps)/(1-eps)) saturating at ' +
    'R_inf ~ 4.46e-13 "set by the double-precision ULP of ln N_L divided by the eps = 1e-3 log-step", but swept only ' +
    'TOL with eps held at 1e-3. Sweeping the stencil eps across decades at an extended TOL and at the machine-limit ' +
    'TOL, do R and R_inf scale with the predicted eps log-step term? Accuracy/cross-validation only; pinned constants ' +
    'perturbed only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124810/imp-124769 machinery verbatim (parts / landmark(...,tol) / dSigmaDlnN / ' +
    'directCFElasticity) and sweep the amplitude stencil eps in {3e-2 .. 1e-5} at TOL = 1e-13 (extended) and TOL = 0 ' +
    '(machine). At the L5 (sigma = 0.02) floor rung read R = |E_CF_direct - E_CF_recon|, the log-step ' +
    'ln((1+eps)/(1-eps)), the truncation ratio R/eps^2 and the round-off product R*logStep, and compare against the ' +
    'imp-124810 R ~ (resolution)/logStep model and the imp-124849 dps-invariant stencil floor 1.08e-12.',
  reference: {
    reconCF_L5: round(RECON_CF_L5),
    lnN_L5: round(LN_N_L5),
    ulp_lnN_L5: round(ULP_LN_N),
    sigma_L5: SIGMA_L5,
    epsLadder: EPS_LADDER,
  },
  sweep: SWEEP.map((s) => ({
    tolCase: s.name,
    tol: s.tol,
    rows: s.rows.map((r) => ({
      eps: r.eps,
      logStep: +r.logStep.toExponential(4),
      R: +r.R.toExponential(4),
      R_over_eps2: +r.truncRatio.toExponential(4),
      R_times_logStep: +r.roundoffProduct.toExponential(4),
    })),
  })),
  truncationCoefficient: {
    a_extendedTOL: round(A_TRUNC_EXT),
    a_machineTOL: round(A_TRUNC_MACHINE),
    a_mean: round(A_TRUNC),
    tol_independence_ratio: round(A_TRUNC_EXT / A_TRUNC_MACHINE),
    extrapolated_floor_at_eps_1em3: round(TRUNC_FLOOR_AT_1EM3),
    imp124849_dps_invariant_floor: 1.0819e-12,
    note:
      'For eps >= 1e-2, R/eps^2 pins at a ~ ' + A_TRUNC.toExponential(2) + ' identically at both tolerances (ratio ~ ' +
      (A_TRUNC_EXT / A_TRUNC_MACHINE).toFixed(3) + '); a*(1e-3)^2 ~ ' + TRUNC_FLOOR_AT_1EM3.toExponential(2) +
      ' reproduces the imp-124849 dps-invariant true stencil floor 1.0819e-12 -- the eps^2 term IS the 2-point ' +
      'directCF truncation, independent of the landmark solve resolution.',
  },
  roundoffTerm: {
    R_times_logStep_machine_eps_1em4: round(ROUNDOFF_PRODUCT_MACHINE),
    ulp_lnN_L5: round(ULP_LN_N),
    note:
      'Below the optimum (eps <= 1e-4, machine TOL) R*logStep stays pinned at the ULP scale of ln N_L (~' +
      ROUNDOFF_PRODUCT_MACHINE.toExponential(2) + ' vs one ULP ~ ' + ULP_LN_N.toExponential(2) + '), so ' +
      'R ~ ULP/logStep ~ 1/(2 eps) grows as eps shrinks -- confirming the imp-124810 "ULP of ln N_L divided by the ' +
      'log-step" clause as an eps-general round-off term.',
  },
  uCurveMinimum: {
    eps_min: 1e-3,
    R_min_machine: round(R_MIN_MACHINE),
    R_large_side_machine_eps_1em2: round(R_LARGE_MACHINE),
    R_small_side_machine_eps_1em4: round(R_SMALL_MACHINE),
    R_extendedTOL_at_eps_1em3: round(R_EXT_AT_1EM3),
    imp124810_R_inf: 4.46e-13,
    note:
      'At machine TOL, R(eps) is a truncation-plus-round-off U-curve minimized at eps ~ 1e-3 (R = ' +
      R_MIN_MACHINE.toExponential(2) + ' = the imp-124810 R_inf 4.46e-13), rising to ' + R_LARGE_MACHINE.toExponential(2) +
      ' at eps = 1e-2 (truncation) and ' + R_SMALL_MACHINE.toExponential(2) + ' at eps = 1e-4 (round-off). The ' +
      'extended-TOL rung R(eps = 1e-3) = ' + R_EXT_AT_1EM3.toExponential(2) + ' reproduces the imp-124810 R(1e-13) = ' +
      '3.86e-11 tolerance-limited value.',
  },
  finding: {
    E1_large_eps_truncation_tol_independent:
      'LARGE-eps TRUNCATION: for eps >= 1e-2, R ~ a*eps^2 with a ~ ' + A_TRUNC.toExponential(2) + ', TOL-INDEPENDENT ' +
      '(a_extended/a_machine ~ ' + (A_TRUNC_EXT / A_TRUNC_MACHINE).toFixed(3) + '); a*(1e-3)^2 ~ ' +
      TRUNC_FLOOR_AT_1EM3.toExponential(2) + ' reproduces the imp-124849 dps-invariant stencil floor 1.0819e-12.',
    E2_small_eps_roundoff_scales_as_logstep:
      'SMALL-eps ROUND-OFF: at machine TOL and eps <= 1e-4, R*logStep pins at the ULP of ln N_L (~' +
      ROUNDOFF_PRODUCT_MACHINE.toExponential(2) + '), so R ~ ULP/logStep grows as eps shrinks -- CONFIRMING the ' +
      'imp-124810 eps-log-step clause; at extended TOL the same product is TOL-set (R ~ TOL/logStep).',
    E3_R_inf_is_a_u_curve_minimum_not_a_floor:
      'CORRECTION: R_inf ~ 4.46e-13 is the U-curve MINIMUM at the truncation/round-off crossover eps ~ 1e-3 (R rises ' +
      'both ways), NOT a monotone double-precision floor; the imp-124810 formula is CONFIRMED in structure (an eps^2 ' +
      'truncation term plus an ULP/logStep round-off term) and CORRECTED in interpretation (crossover minimum), ' +
      'consistent with imp-124849 that 4.46e-13 under-estimates the pure eps^2 truncation 1.08e-12.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Sweeping the stencil eps across decades at an ' +
    'extended TOL = 1e-13 and the machine-limit TOL = 0 decomposes the imp-124810 direct-E_CF floor R into TWO ' +
    'eps-scaling terms: an O(eps^2) 2-point-stencil TRUNCATION term R ~ a*eps^2 (a ~ ' + A_TRUNC.toExponential(2) +
    ', TOL-independent, extrapolating to the imp-124849 dps-invariant 1.08e-12 at eps = 1e-3) and a ROUND-OFF term ' +
    'R ~ (bisection resolution)/ln((1+eps)/(1-eps)) that is ULP-set (~' + ULP_LN_N.toExponential(2) + ') at machine ' +
    'TOL and TOL-set at extended TOL -- CONFIRMING the imp-124810 eps-log-step clause. R(eps) is thus a U-curve ' +
    'minimized at the crossover eps ~ 1e-3, where R = ' + R_MIN_MACHINE.toExponential(2) + ' = the imp-124810 ' +
    'R_inf 4.46e-13; so R_inf is a CROSSOVER MINIMUM, not a monotone floor, and (per imp-124849) under-estimates the ' +
    'pure eps^2 truncation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned ' +
    'E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as differentiation axes); ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124810 (the TOL-only sweep and the eps-log-step clause tested here); imp-124849 (the dps-invariant true ' +
    'stencil floor R ~ 1.08e-12 = a*eps^2 at eps = 1e-3); imp-124888 (5-point O(eps^4) stencil-order attribution); ' +
    'imp-124769 (the R ~ 4.5e-13 floor / sigma_crit ~ 0.013 pin); imp-398 (C_F flow prefactor); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124854_ECF_FLOOR_EPS_LOGSTEP_SWEEP_ASSERTIONS = [
  {
    // The sweep covers the eps ladder at both tolerances, all rows with finite positive R.
    id: 'imp124854-sweep-covers-eps-ladder-both-tols',
    description: 'both TOL cases have one row per eps in the ladder, all with finite positive R and logStep',
    holds: () =>
      SWEEP.length === 2 &&
      SWEEP.every(
        (s) =>
          s.rows.length === EPS_LADDER.length &&
          s.rows.every((r) => Number.isFinite(r.R) && r.R > 0 && r.logStep > 0)
      ),
  },
  {
    // (E1): large-eps truncation coefficient a = R/eps^2 pins at ~1.08e-6 at both tolerances.
    id: 'imp124854-truncation-coefficient-pins',
    description: 'R/eps^2 at eps in {3e-2, 1e-2} pins at a ~ 1.08e-6 at both extended and machine TOL',
    holds: () =>
      A_TRUNC_EXT > 8e-7 && A_TRUNC_EXT < 1.4e-6 && A_TRUNC_MACHINE > 8e-7 && A_TRUNC_MACHINE < 1.4e-6,
  },
  {
    // (E1): the truncation coefficient is TOL-independent (extended/machine ratio near 1).
    id: 'imp124854-truncation-coefficient-tol-independent',
    description: 'a_extendedTOL / a_machineTOL is within 5% of 1 (truncation term does not depend on solve resolution)',
    holds: () => {
      const r = A_TRUNC_EXT / A_TRUNC_MACHINE;
      return r > 0.95 && r < 1.05;
    },
  },
  {
    // (E1): a*(1e-3)^2 reproduces the imp-124849 dps-invariant true stencil floor 1.0819e-12.
    id: 'imp124854-extrapolated-floor-matches-imp124849',
    description: 'a*(1e-3)^2 ~ 1.08e-12 reproduces the imp-124849 dps-invariant stencil floor within 30%',
    holds: () => TRUNC_FLOOR_AT_1EM3 > 8e-13 && TRUNC_FLOOR_AT_1EM3 < 1.4e-12,
  },
  {
    // (E2): the small-eps machine-TOL round-off product is ULP-set (well below the extended-TOL / 1e-13 scale).
    id: 'imp124854-roundoff-product-ulp-set',
    description: 'machine-TOL R*logStep at eps = 1e-4 is at the ULP scale of ln N_L (< 1e-13, far below the eps^2 term)',
    holds: () => ROUNDOFF_PRODUCT_MACHINE > 0 && ROUNDOFF_PRODUCT_MACHINE < 1e-13,
  },
  {
    // (E3): eps = 1e-3 is the machine-TOL U-curve MINIMUM -- R rises on both the large-eps and small-eps sides.
    id: 'imp124854-eps-1em3-is-u-curve-minimum',
    description: 'at machine TOL R(1e-3) < R(1e-2) (truncation side) and R(1e-3) < R(1e-4) (round-off side)',
    holds: () => R_MIN_MACHINE < R_LARGE_MACHINE && R_MIN_MACHINE < R_SMALL_MACHINE,
  },
  {
    // (E3): the machine-TOL minimum reproduces the imp-124810 R_inf ~ 4.46e-13.
    id: 'imp124854-minimum-reproduces-imp124810-Rinf',
    description: 'the machine-TOL U-curve minimum R(1e-3) reproduces the imp-124810 R_inf ~ 4.46e-13 (in [3e-13, 6e-13])',
    holds: () => R_MIN_MACHINE > 3e-13 && R_MIN_MACHINE < 6e-13,
  },
  {
    // (E3): the extended-TOL eps = 1e-3 rung reproduces the imp-124810 tolerance-limited R(1e-13) ~ 3.86e-11.
    id: 'imp124854-extended-tol-reproduces-imp124810-tol-rung',
    description: 'the extended-TOL R at eps = 1e-3 reproduces the imp-124810 R(1e-13) ~ 3.86e-11 (in [2e-11, 6e-11])',
    holds: () => R_EXT_AT_1EM3 > 2e-11 && R_EXT_AT_1EM3 < 6e-11,
  },
  {
    // Honesty gate: accuracy/cross-validation only, no QED, PT stays SOTA.
    id: 'imp124854-honesty-gate-no-qed',
    description: 'Accuracy/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124854_ECF_FLOOR_EPS_LOGSTEP_SWEEP.isRigorous === false &&
      /NO QED/.test(IMP124854_ECF_FLOOR_EPS_LOGSTEP_SWEEP.verdict) &&
      /remains SOTA/.test(IMP124854_ECF_FLOOR_EPS_LOGSTEP_SWEEP.verdict),
  },
];

for (const a of IMP124854_ECF_FLOOR_EPS_LOGSTEP_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124854-ecf-floor-eps-logstep-sweep assertion failed: ${a.id}`);
  }
}
