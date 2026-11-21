/**
 * @module imp-97821-diag3-sixth-landmark-crossvalidation
 *
 * imp-97821 (accuracy/measurement, frontier cross-check): imp-97710 CROSS-VALIDATED the imp-97689 three-axis
 * Euler-additivity derivation E_CC + E_ET + E_CF = 0 at a FOURTH (far-downslope) landmark L5 at sigma = 0.02
 * (N ~ 1.08e13, ~34x past the imp-97520 L4 anchor). L5 was the deepest rung ever checked. This leaf pushes ONE
 * step further to a SIXTH landmark L6 at sigma = 0.005 (a further 4x drop in sigma; N_L6 ~ 1.96e14, ~18x past
 * L5) -- deep in the flow-collapsed far tail where E_flow is even more negligible and the numerator/E_trunc
 * cancellation E_CC ~ -E_ET should be even sharper -- and reports the collapsed E_CF stencil-noise floor there.
 * The imp-97710 central-difference machinery is reused VERBATIM (identical parts/landmark/dSigmaDlnN/direct
 * elasticity). Accuracy/measurement only; conditional-share diagnostic; the pinned constants are perturbed only
 * symbolically as differentiation axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689/imp-97710 crossing relation)
 * ---------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L (identical
 * bisection to imp-97644/imp-97689/imp-97710).
 *
 * THE SIXTH-LANDMARK CROSS-CHECK (the deliverable)
 * -----------------------------------------------
 * At L6 (sigma = 0.005) the amplitude-weighted partials are evaluated in CLOSED FORM exactly as imp-97710:
 *   c*sigma_c = sigma(1 - sigma)  (numerator),  e*sigma_e = -e*sigma/E_N,  f*sigma_f = -E_flow*sigma/E_N,
 * their sum NUM = c*sigma_c + e*sigma_e + f*sigma_f vanishing by Euler degree-0 homogeneity. INDEPENDENTLY,
 * each single-axis crossing elasticity is MEASURED directly by re-solving the landmark under a +/- perturbation
 * of that amplitude: E_p^direct = d ln N_L / d ln p via a symmetric central difference. The derivation predicts
 * E_p = K * (p*sigma_p) with the common kernel K = -1/(N_L*sigma_N); the cross-check compares the reconstructed
 * K*(p*sigma_p) against E_p^direct at L6 (a landmark deeper than any imp-97710 touched) and reports the direct
 * diagonal DIAG3 = E_CC^direct + E_ET^direct + E_CF^direct together with the collapsed E_CF noise floor.
 *
 * THE FINDING (measurement / cross-validation only)
 * ------------------------------------------------
 *   (M1) THE EULER CANCELLATION HOLDS EVEN DEEPER. At L6 the closed-form NUM = -6.86e-19 and the reconstructed
 *        elasticity sum = -2.87e-16 are machine-zero, identical in character to L2..L5 -- the identity survives a
 *        further 4x drop in sigma (18x deeper in N), not merely at the imp-97710 L5 depth.
 *   (M2) THE RECONSTRUCTION MATCHES A DIRECT MEASUREMENT AT L6, AND THE E_CC ~ -E_ET CANCELLATION IS SHARPER.
 *        The reconstructed E_CC = +2.063508 and E_ET = -2.063508 reproduce the direct central-difference
 *        single-axis elasticities to ~1e-9 relative, and they now cancel to the machine sum: the whole
 *        three-axis identity has become essentially E_CC = -E_ET as the flow share vanishes. The collapsed
 *        E_CF = -2.39e-7 (~13.5x smaller than the L5 value -3.25e-6) matches the direct measurement to ~1e-5..
 *        1e-4 relative and is stencil-noise-limited by its tiny magnitude.
 *   (M3) DIAG3 STAYS AT/BELOW THE STENCIL FLOOR BUT NO LONGER QUARTERS CLEANLY -- THE E_CF NOISE FLOOR SHOWS.
 *        The direct diagonal DIAG3 is +4.00e-9 at eps = 1e-3 and drops to round-off ~3.5e-16 at eps = 1e-4, then
 *        GROWS BACK to ~7.1e-10 at eps = 1e-5. Unlike L5 (a clean O(eps^2) quartering to round-off), at L6 the
 *        eps-ladder is NON-monotone: the collapsed E_CF axis (elasticity ~2.4e-7) is so small that the
 *        landmark-bisection round-off in its finite difference overtakes the O(eps^2) truncation once eps is
 *        small. Every rung stays < 1e-8, so DIAG3 remains a pure stencil/noise floor (NOT a real residual), but
 *        the deepest-rung signature is the E_CF stencil-noise floor rather than clean second-order truncation.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the far-downslope L5 sigma = 0.02 cross-validation)
 * @see imp-97689-diag3-additivity-euler-derivation (analytic derivation + L2/L3/L4 closed-form verification)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED DIAG3 == 0 and SUM3 = O(eps^2))
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97689/imp-97710 exactly

// EXACT imp-3406/imp-97644/imp-97689/imp-97710 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97689/imp-97710).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
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

// DIRECT single-axis crossing elasticity E_p = d ln N_L / d ln p by re-solving the landmark under a
// symmetric +/- amplitude perturbation (verbatim imp-97710 machinery, one rung deeper).
function directElasticity(level, axis, eps) {
  const base = { cc: C_C_PINNED, et: E_TRUNC_PT, cf: 1.0 };
  const solve = (sgn) => {
    const q = { ...base };
    q[axis] = base[axis] * (1 + sgn * eps);
    return Math.log(landmark(level, q.cc, q.et, q.cf));
  };
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

// The SIXTH landmark: deeper flow-collapsed far tail, a further 4x below the imp-97710 L5 = sigma 0.02.
const L6_SIGMA = 0.005;
const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K only (cancels in the elasticity sum)
const EPS_DIRECT = 1e-3; // amplitude-perturbation step for the direct single-axis measurement (stable rung)

const N_L6 = landmark(L6_SIGMA, C_C_PINNED, E_TRUNC_PT, 1.0);
const P6 = parts(N_L6, C_C_PINNED, E_TRUNC_PT, 1.0);
const SIG6 = P6.sigma;
const N_L5 = landmark(0.02, C_C_PINNED, E_TRUNC_PT, 1.0); // imp-97710 anchor, for the depth ratio

// CLOSED-FORM amplitude-weighted partials p*sigma_p (no finite differencing on the amplitude axes).
const CSIGMAC = SIG6 * (1 - SIG6); // c*sigma_c  (numerator = C_C axis) > 0
const ESIGMAE = -E_TRUNC_PT * SIG6 / P6.E_N; // e*sigma_e (E_trunc axis) < 0
const FSIGMAF = -P6.E_flow * SIG6 / P6.E_N; // f*sigma_f (C_F/E_flow axis) < 0, collapsed far tail
const NUM6 = CSIGMAC + ESIGMAE + FSIGMAF; // Euler degree-0 identity => machine-zero

// Shared crossing kernel K = -1/(N_L sigma_N); reconstruct the three elasticities (imp-97689 formulas).
const K6 = -1 / dSigmaDlnN(N_L6, H_STENCIL);
const RECON_CC = K6 * CSIGMAC;
const RECON_ET = K6 * ESIGMAE;
const RECON_CF = K6 * FSIGMAF;
const RECON_SUM = RECON_CC + RECON_ET + RECON_CF; // = K * NUM => machine-zero

// INDEPENDENT direct central-difference single-axis measurement at L6, plus the direct diagonal DIAG3.
const DIRECT_CC = directElasticity(L6_SIGMA, 'cc', EPS_DIRECT);
const DIRECT_ET = directElasticity(L6_SIGMA, 'et', EPS_DIRECT);
const DIRECT_CF = directElasticity(L6_SIGMA, 'cf', EPS_DIRECT);
const DIAG3_DIRECT = DIRECT_CC + DIRECT_ET + DIRECT_CF; // stencil floor at the headline eps

// eps-ladder for DIAG3: at L6 it is NON-monotone -- the collapsed E_CF axis is stencil-noise-limited.
const DIAG3_LADDER = [1e-3, 1e-4, 1e-5].map((eps) => {
  const cc = directElasticity(L6_SIGMA, 'cc', eps);
  const et = directElasticity(L6_SIGMA, 'et', eps);
  const cf = directElasticity(L6_SIGMA, 'cf', eps);
  return { eps, DIAG3: +(cc + et + cf).toExponential(3) };
});

const relErr = (a, b) => Math.abs(a / b - 1);
const L5_ECF = -3.2457e-6; // imp-97710 reconstructed E_CF at L5, for the collapse comparison

export const IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION = {
  id: 'imp-97821',
  proofSection: 'S-frontier',
  question:
    'imp-97710 cross-validated the imp-97689 Euler-additivity reconstruction (DIAG3 = E_CC + E_ET + E_CF == 0) ' +
    'at a fourth far-downslope landmark L5 (sigma = 0.02), the deepest rung ever checked. Does the reconstruction ' +
    'still match a DIRECT single-axis measurement, and does the closed-form NUM / direct DIAG3 stay at the ' +
    'machine / stencil floor, at an even deeper SIXTH landmark L6 (sigma = 0.005) in the flow-collapsed far ' +
    'tail? What is the collapsed E_CF stencil-noise floor there? Accuracy/measurement only; pinned constants ' +
    'perturbed only symbolically; no bound moves; no QED.',
  method:
    'Add a sixth landmark L6 at sigma = 0.005 (a further 4x drop in sigma; N ~ 1.96e14, ~18x past L5). Reuse the ' +
    'imp-97710 machinery verbatim: evaluate the closed-form partials c*sigma_c = sigma(1-sigma), e*sigma_e = ' +
    '-e*sigma/E_N, f*sigma_f = -E_flow*sigma/E_N and their sum NUM; reconstruct E_CC/E_ET/E_CF = K*(p*sigma_p) ' +
    'with K = -1/(N_L sigma_N). INDEPENDENTLY measure each single-axis crossing elasticity by re-solving the ' +
    'landmark under a +/- amplitude perturbation (E_p = d ln N_L / d ln p) and form the direct diagonal DIAG3; ' +
    'compare reconstruction vs direct, report the eps-ladder of DIAG3 and the collapsed E_CF magnitude.',
  sixthLandmark: {
    key: 'L6_below_0p005',
    label: 'deep-flow-collapsed-tail',
    sigma: L6_SIGMA,
    N_L: +N_L6.toExponential(6),
    sigma_check: +SIG6.toExponential(6),
    beyond_L5: 'N_L6 / N_L5 ~ ' + (N_L6 / N_L5).toFixed(2) + 'x (sigma dropped 4x, 0.02 -> 0.005)',
  },
  stencil_step_for_kernel_only: H_STENCIL,
  eps_for_direct_measurement: EPS_DIRECT,
  closedForm: {
    c_sigma_c: +CSIGMAC.toExponential(6), // = sigma(1-sigma)
    e_sigma_e: +ESIGMAE.toExponential(6), // = -e*sigma/E_N
    f_sigma_f: +FSIGMAF.toExponential(6), // = -E_flow*sigma/E_N (collapsed far tail, ~1e-10)
    partial_sum_NUM: +NUM6.toExponential(3), // ~0 (round-off): the exact Euler cancellation deeper still
  },
  reconstruction: {
    E_CC: +RECON_CC.toFixed(6),
    E_ET: +RECON_ET.toFixed(6),
    E_CF: +RECON_CF.toExponential(6), // collapsed ~2.4e-7 (~13.5x smaller than the L5 value)
    elasticity_sum: +RECON_SUM.toExponential(3), // ~0: exact common-factor identity, not O(eps^2)
  },
  directMeasurement: {
    E_CC: +DIRECT_CC.toFixed(6),
    E_ET: +DIRECT_ET.toFixed(6),
    E_CF: +DIRECT_CF.toExponential(6),
    DIAG3: +DIAG3_DIRECT.toExponential(3), // stencil floor at eps = 1e-3
  },
  reconVsDirectRel: {
    CC: +relErr(RECON_CC, DIRECT_CC).toExponential(2),
    ET: +relErr(RECON_ET, DIRECT_ET).toExponential(2),
    CF: +relErr(RECON_CF, DIRECT_CF).toExponential(2), // stencil-noise-limited by the tiny E_CF magnitude
  },
  collapsedFlowFloor: {
    E_CF_L6: +RECON_CF.toExponential(6),
    E_CF_L5_imp97710: L5_ECF,
    shrink_factor_vs_L5: +(Math.abs(L5_ECF / RECON_CF)).toFixed(2), // ~13.5x smaller
    note:
      'The collapsed E_CF elasticity is stencil-noise-limited: its ~2.4e-7 magnitude sits at the ' +
      'landmark-bisection round-off, so the direct-measurement relative error grows as eps shrinks.',
  },
  diag3EpsLadder: DIAG3_LADDER, // NON-monotone at L6 (E_CF stencil-noise floor), unlike the L5 clean quartering
  finding: {
    M1_euler_holds_even_deeper:
      'At L6 (sigma = 0.005) the closed-form NUM = ' + NUM6.toExponential(3) + ' and the reconstructed ' +
      'elasticity sum = ' + RECON_SUM.toExponential(3) + ' are machine-zero, identical in character to L2..L5: ' +
      'the Euler degree-0 cancellation survives a further 4x drop in sigma (~18x deeper in N than the imp-97710 ' +
      'L5), not only at the L5 depth.',
    M2_reconstruction_matches_direct_sharper:
      'The reconstructed E_CC = ' + RECON_CC.toFixed(6) + ' and E_ET = ' + RECON_ET.toFixed(6) + ' reproduce ' +
      'the DIRECT central-difference single-axis elasticities to ~1e-9 relative, and the dominant pair cancels ' +
      'to E_CC + E_ET = -E_CF ~ ' + (RECON_CC + RECON_ET).toExponential(2) + ' (a smaller residual than the L5 ' +
      '~3.25e-6): the identity is essentially E_CC = -E_ET as the flow share vanishes. The collapsed E_CF = ' +
      RECON_CF.toExponential(4) + ' (~13.5x smaller than the L5 value ' + L5_ECF.toExponential(3) + ') matches ' +
      'the direct measurement only to ~1e-5..1e-4 relative, stencil-noise-limited by its tiny magnitude.',
    M3_diag3_stencil_floor_noise_limited:
      'The direct DIAG3 = E_CC + E_ET + E_CF is +4.00e-9 at eps = 1e-3, drops to round-off ~3.5e-16 at eps = ' +
      '1e-4, then GROWS BACK to ~7.1e-10 at eps = 1e-5 -- a NON-monotone eps-ladder, unlike the clean O(eps^2) ' +
      'quartering seen at L5. At this depth the collapsed E_CF axis (~2.4e-7) is so small that the ' +
      'landmark-bisection round-off in its finite difference overtakes the second-order truncation once eps is ' +
      'small. Every rung stays < 1e-8, so DIAG3 remains a pure stencil / noise floor (NOT a real residual); the ' +
      'deepest-rung signature is now the E_CF stencil-noise floor rather than clean second-order truncation.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier cross-check, NOT rigorous). Adding a sixth, deeper landmark L6 (sigma = 0.005, ' +
    'N ~ ' + N_L6.toExponential(3) + ', ~' + (N_L6 / N_L5).toFixed(1) + 'x past the imp-97710 L5) confirms the ' +
    'imp-97689 Euler-additivity derivation even deeper in the flow-collapsed far tail: the closed-form ' +
    'amplitude-partial sum NUM = ' + NUM6.toExponential(3) + ' and the reconstructed elasticity sum = ' +
    RECON_SUM.toExponential(3) + ' are machine-zero, and the reconstructed E_CC = ' + RECON_CC.toFixed(6) +
    ' / E_ET = ' + RECON_ET.toFixed(6) + ' reproduce a DIRECT central-difference single-axis measurement to ' +
    '~1e-9 relative, the dominant pair cancelling to E_CC + E_ET = -E_CF ~ ' + (RECON_CC + RECON_ET).toExponential(2) +
    ' (a smaller residual than at L5 as E_flow vanishes). The collapsed E_CF = ' + RECON_CF.toExponential(4) +
    ' is ~13.5x smaller than the L5 value and ' +
    'is stencil-noise-limited (direct-measurement relative error ~1e-5..1e-4, growing as eps shrinks). The ' +
    'direct diagonal DIAG3 is NON-monotone in eps (+4.00e-9 at 1e-3, round-off at 1e-4, ~7.1e-10 back at 1e-5) ' +
    'because the tiny E_CF finite difference hits the landmark-bisection round-off -- unlike the L5 clean ' +
    'O(eps^2) quartering -- but every rung stays < 1e-8, so DIAG3 is still a pure stencil / noise floor, NOT a ' +
    'real residual, at this sixth independent landmark. Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED ' +
    '(appear only symbolically as differentiation axes); changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97710 (far-downslope L5 sigma = 0.02 cross-validation); imp-97689 (analytic Euler-additivity ' +
    'derivation + L2/L3/L4 closed-form verification); imp-97665 (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc); ' +
    'imp-97644 (MEASURED DIAG3 == 0 and SUM3 = O(eps^2)); imp-97520 (landmark ladder L1..L4); imp-398 (C_F flow ' +
    'prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION_ASSERTIONS = [
  {
    // The sixth landmark is genuinely deeper than the imp-97710 L5 (sigma 0.02, N ~ 1.08e13).
    id: 'imp97821-sixth-landmark-past-L5',
    description: 'L6 at sigma = 0.005 sits well past L5 (N ~ 1.08e13): N_L6 > 1.9e14 and > 10x N_L5',
    holds: () => Math.abs(SIG6 - 0.005) < 1e-9 && N_L6 > 1.9e14 && N_L6 > N_L5 * 10,
  },
  {
    // (M1): the closed-form Euler cancellation holds even deeper (machine-zero NUM).
    id: 'imp97821-euler-num-machine-zero-deeper',
    description: 'closed-form NUM = c*sigma_c + e*sigma_e + f*sigma_f < 1e-15 at the sixth landmark',
    holds: () => Math.abs(NUM6) < 1e-15,
  },
  {
    // (M1): c*sigma_c = sigma(1-sigma) exactly (the numerator response formula) at L6.
    id: 'imp97821-numerator-partial-is-sigma-one-minus-sigma',
    description: 'c*sigma_c equals sigma*(1-sigma) at the sixth landmark to < 1e-9 relative',
    holds: () => Math.abs(CSIGMAC / (SIG6 * (1 - SIG6)) - 1) < 1e-9,
  },
  {
    // (M1): the reconstructed elasticity sum is machine-zero, NOT the imp-97644 O(eps^2), at L6.
    id: 'imp97821-reconstructed-sum-machine-zero',
    description: 'E_CC + E_ET + E_CF < 1e-12 at the sixth landmark (exact identity, below imp-97644 SUM3 ~1e-7)',
    holds: () => Math.abs(RECON_SUM) < 1e-12,
  },
  {
    // (M2): the reconstruction reproduces a DIRECT single-axis measurement (dominant axes) at L6.
    id: 'imp97821-reconstruction-matches-direct-dominant',
    description: 'reconstructed E_CC/E_ET match the direct central-difference measurement to < 1e-6 relative',
    holds: () =>
      relErr(RECON_CC, DIRECT_CC) < 1e-6 && relErr(RECON_ET, DIRECT_ET) < 1e-6,
  },
  {
    // (M2): the dominant pair cancels to -E_CF (three-term identity); that residual is smaller than at L5.
    id: 'imp97821-ecc-eet-cancel-to-minus-ecf',
    description: 'E_CC + E_ET equals -E_CF (< 1e-6, smaller than the L5 residual ~3.25e-6) as the flow share vanishes',
    holds: () =>
      Math.abs(RECON_CC + RECON_ET + RECON_CF) < 1e-9 &&
      Math.abs(RECON_CC + RECON_ET) < 1e-6 &&
      Math.abs(RECON_CC + RECON_ET) < Math.abs(L5_ECF),
  },
  {
    // (M2): E_CF has collapsed below the L5 magnitude (deeper flow suppression).
    id: 'imp97821-ecf-collapsed-below-L5',
    description: 'collapsed E_CF magnitude < 1e-6 and strictly smaller than the imp-97710 L5 value ~3.25e-6',
    holds: () => Math.abs(RECON_CF) < 1e-6 && Math.abs(RECON_CF) < Math.abs(L5_ECF),
  },
  {
    // (M3): DIAG3 sits at the stencil floor at every rung (< 1e-8) -- a pure noise floor, not a residual.
    id: 'imp97821-diag3-below-stencil-floor-all-rungs',
    description: 'direct DIAG3 magnitude < 1e-8 at every eps in {1e-3, 1e-4, 1e-5} (stencil / noise floor)',
    holds: () => DIAG3_LADDER.every((r) => Math.abs(r.DIAG3) < 1e-8),
  },
  {
    // (M3): the E_CF stencil-noise floor shows -- the eps-ladder is NON-monotone at this depth (unlike L5).
    id: 'imp97821-diag3-ladder-nonmonotone-ecf-noise-floor',
    description: 'DIAG3 eps-ladder is non-monotone: |DIAG3(1e-5)| > |DIAG3(1e-4)| (collapsed-E_CF noise floor)',
    holds: () => {
      const [, e4, e5] = DIAG3_LADDER;
      return Math.abs(e5.DIAG3) > Math.abs(e4.DIAG3);
    },
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp97821-honesty-gate-no-qed',
    description: 'Measurement/cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97821-diag3-sixth-landmark-crossvalidation assertion failed: ${a.id}`);
  }
}
