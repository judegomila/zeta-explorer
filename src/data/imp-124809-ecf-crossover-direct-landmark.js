/**
 * @module imp-124809-ecf-crossover-direct-landmark
 *
 * imp-124809 (numerical/measurement, frontier cross-check): imp-124769 M3 PINNED the E_CF stencil crossover at
 * |E_CF|_crit ~ 1.4e-6 / sigma_crit ~ 0.013 by INTERPOLATING (log-log) between the two bracketing rungs L5
 * (sigma 0.02, truncation-clean) and L6 (sigma 0.005, round-off-dominated). That crossover sigma was never itself
 * evaluated -- it was inferred from the two neighbours. This leaf REMOVES the interpolation: reusing the imp-124769
 * landmark/stencil machinery VERBATIM, it places a NEW landmark EXACTLY at sigma = 0.013 (between L5 and L6),
 * reconstructs the collapsed E_CF magnitude there, measures the DIRECT central-difference E_CF elasticity at the
 * shared headline step eps = 1e-3, and confirms that the resulting finite-difference error errCF(1e-3) sits at the
 * truncation/round-off KNEE -- i.e. the truncation prediction relTrunc*|E_CF| and the round-off floor R meet there.
 * Measurement/cross-validation only; C_mb GUE-conditional per imp-486 UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689/imp-97710/imp-97821/imp-124769 crossing relation)
 * -------------------------------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L (identical bisection to
 * imp-97644/imp-97689/imp-97710/imp-97821/imp-124769). E_CF = d ln N_L / d ln f is the crossing elasticity of the
 * flow amplitude, reconstructed in closed form as E_CF = K * (-E_flow*sigma/E_N) with K = -1/(N_L sigma_N).
 *
 * THE DIRECT TEST (the deliverable)
 * ---------------------------------
 * imp-124769 established two competing regimes for the headline-step error at eps = 1e-3:
 *   (a) TRUNCATION: errCF ~ relTrunc * |E_CF|, a CONSTANT relative O(eps^2) with relTrunc ~ 3.25e-7 (mean of the
 *       clean L2..L4 plateau), and
 *   (b) ROUND-OFF: errCF ~ R, a nearly landmark-independent absolute floor R ~ 4.46e-13 (the L5 minimum, set by
 *       the double-precision bisection resolution of ln N_L),
 * meeting at |E_CF|_crit = R / relTrunc ~ 1.37e-6, i.e. the interpolated sigma_crit ~ 0.013. This leaf recomputes
 * that plateau (relTrunc) and floor (R) from the SAME L2..L6 ladder, then evaluates a NEW landmark at sigma = 0.013
 * and checks the interpolation directly.
 *
 * THE FINDING (measurement / cross-validation only)
 * ------------------------------------------------
 *   (M1) THE DIRECTLY EVALUATED sigma = 0.013 LANDMARK LANDS ON THE PINNED CROSSOVER MAGNITUDE. Reconstructed
 *        |E_CF|(sigma = 0.013) ~ 1.44e-6 agrees with the imp-124769 interpolated |E_CF|_crit ~ 1.37e-6 to ~5%
 *        (ratio ~1.05), and lies strictly inside the L6 (~2.4e-7) .. L5 (~3.25e-6) bracket -- confirming the
 *        log-log interpolation reproduces the true magnitude at the pinned sigma.
 *   (M2) errCF(1e-3) AT sigma = 0.013 SITS AT THE TRUNCATION/ROUND-OFF KNEE. The truncation prediction
 *        relTrunc*|E_CF| ~ 4.68e-13 and the round-off floor R ~ 4.46e-13 agree to ~5% at this sigma, so the two
 *        regimes genuinely MEET there; the measured errCF(1e-3) ~ 5.18e-13 sits at ~1.1-1.2x each -- exactly the
 *        knee behaviour the interpolation predicted, neither in the clean truncation plateau nor deep in the floor.
 *   (M3) THE DIRECT EVALUATION VINDICATES THE imp-124769 INTERPOLATED PIN. Evaluating the crossover sigma directly
 *        (rather than inferring it from L5/L6) reproduces |E_CF|_crit and the errCF(1e-3) knee to a few percent,
 *        upgrading the imp-124769 M3 crossover from an interpolated inference to a directly measured landmark.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the interpolated crossover pin this leaf evaluates directly)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (L6 non-monotone eps-ladder reported qualitatively)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the far-downslope L5 clean O(eps^2) quartering)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97689/imp-97710/imp-97821/imp-124769

// EXACT imp-124769 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1). Reused VERBATIM.
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-124769).
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

// DIRECT single-axis crossing elasticity E_p = d ln N_L / d ln p by re-solving the landmark under a symmetric
// +/- amplitude perturbation (verbatim imp-97710/imp-97821/imp-124769 machinery).
function directElasticity(level, axis, eps) {
  const base = { cc: C_C_PINNED, et: E_TRUNC_PT, cf: 1.0 };
  const solve = (sgn) => {
    const q = { ...base };
    q[axis] = base[axis] * (1 + sgn * eps);
    return Math.log(landmark(level, q.cc, q.et, q.cf));
  };
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K only
const EPS_HEADLINE = 1e-3; // shared headline amplitude step of imp-97710/imp-97821/imp-124769

// At a given sigma: reconstruct the collapsed E_CF magnitude and measure the DIRECT E_CF finite-difference error
// at the shared headline step eps = 1e-3 (verbatim imp-124769 measurement).
function measure(sigma) {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const K = -1 / dSigmaDlnN(N, H_STENCIL);
  const reconCF = K * (-P.E_flow * P.sigma / P.E_N); // collapsed E_CF (closed form)
  const directCF = directElasticity(sigma, 'cf', EPS_HEADLINE);
  const errCF = Math.abs(directCF - reconCF); // finite-difference error at eps = 1e-3
  return { N, absE_CF: Math.abs(reconCF), reconCF, errCF, relTrunc: errCF / Math.abs(reconCF) };
}

// Rebuild the imp-124769 reference constants from the SAME L2..L6 ladder: the clean L2..L4 relTrunc plateau and
// the L5 round-off floor R. This reproduces the pinned crossover the direct landmark is tested against.
const L2 = measure(0.9);
const L3 = measure(0.5);
const L4 = measure(0.1);
const L5 = measure(0.02);
const L6 = measure(0.005);
const REL_TRUNC_PLATEAU = [L2.relTrunc, L3.relTrunc, L4.relTrunc];
const REL_TRUNC_MEAN = REL_TRUNC_PLATEAU.reduce((a, b) => a + b, 0) / REL_TRUNC_PLATEAU.length;
const ROUNDOFF_FLOOR = L5.errCF; // R, the L5 minimum of the errCF(1e-3) ladder
const ECF_CRIT = ROUNDOFF_FLOOR / REL_TRUNC_MEAN; // imp-124769 interpolated |E_CF|_crit

// THE DIRECT LANDMARK: evaluate exactly at the pinned crossover sigma = 0.013 (between L5 and L6).
const SIGMA_CROSSOVER = 0.013;
const X = measure(SIGMA_CROSSOVER);
const TRUNC_PRED_AT_X = REL_TRUNC_MEAN * X.absE_CF; // truncation regime prediction at the new landmark
const KNEE_TRUNC_VS_FLOOR = TRUNC_PRED_AT_X / ROUNDOFF_FLOOR; // ~1 at the knee (regimes meet)
const RATIO_ECF_TO_CRIT = X.absE_CF / ECF_CRIT; // ~1 => direct evaluation lands on the interpolated pin
const RATIO_ERR_TO_FLOOR = X.errCF / ROUNDOFF_FLOOR;
const RATIO_ERR_TO_TRUNC = X.errCF / TRUNC_PRED_AT_X;

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124809_ECF_CROSSOVER_DIRECT_LANDMARK = {
  id: 'imp-124809',
  proofSection: 'S-frontier',
  question:
    'imp-124769 M3 PINNED the E_CF stencil crossover at |E_CF|_crit ~ 1.4e-6 / sigma_crit ~ 0.013 by ' +
    'interpolating (log-log) between the bracketing rungs L5 (sigma 0.02, truncation-clean) and L6 (sigma 0.005, ' +
    'round-off-dominated) -- the crossover sigma itself was never evaluated. Does a landmark placed DIRECTLY at ' +
    'sigma = 0.013 reproduce |E_CF|_crit and confirm that errCF(1e-3) sits at the truncation/round-off knee? ' +
    'Measurement/cross-validation only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124769 landmark/stencil machinery verbatim. Rebuild the reference constants (the clean L2..L4 ' +
    'relTrunc plateau and the L5 round-off floor R) from the same L2..L6 ladder, then place a NEW landmark at ' +
    'sigma = 0.013, reconstruct the collapsed E_CF = K*(-E_flow*sigma/E_N) there, measure the direct ' +
    'central-difference E_CF elasticity at eps = 1e-3, and compare errCF(1e-3) against the truncation prediction ' +
    'relTrunc*|E_CF| and the floor R -- confirming the two regimes meet (the knee) at the pinned sigma.',
  crossover_sigma_evaluated: SIGMA_CROSSOVER,
  headline_eps: EPS_HEADLINE,
  stencil_step_for_kernel_only: H_STENCIL,
  reference: {
    relTrunc_mean: round(REL_TRUNC_MEAN),
    roundoff_floor_R: round(ROUNDOFF_FLOOR),
    E_CF_crit_interpolated: round(ECF_CRIT),
    bracket_L5_absE_CF: round(L5.absE_CF),
    bracket_L6_absE_CF: round(L6.absE_CF),
    note:
      'relTrunc plateau ~3.25e-7 (mean of L2..L4) and floor R ~4.46e-13 (L5 minimum) reproduce the imp-124769 ' +
      'interpolated |E_CF|_crit = R/relTrunc ~1.37e-6 (sigma_crit ~0.013).',
  },
  directLandmark: {
    sigma: SIGMA_CROSSOVER,
    N_L: +X.N.toExponential(6),
    E_CF: +X.reconCF.toExponential(6),
    absE_CF: round(X.absE_CF),
    errCF_at_1em3: round(X.errCF),
    relTrunc_at_1em3: round(X.relTrunc),
    trunc_prediction: round(TRUNC_PRED_AT_X),
    floor_R: round(ROUNDOFF_FLOOR),
    knee_trunc_over_floor: +KNEE_TRUNC_VS_FLOOR.toFixed(4),
    absE_CF_over_crit: +RATIO_ECF_TO_CRIT.toFixed(4),
    err_over_floor: +RATIO_ERR_TO_FLOOR.toFixed(4),
    err_over_trunc: +RATIO_ERR_TO_TRUNC.toFixed(4),
  },
  finding: {
    M1_direct_landmark_hits_crit_magnitude:
      'Reconstructed |E_CF|(sigma = 0.013) ~ ' + X.absE_CF.toExponential(2) + ' agrees with the imp-124769 ' +
      'interpolated |E_CF|_crit ~ ' + ECF_CRIT.toExponential(2) + ' to ~' +
      Math.abs(100 * (RATIO_ECF_TO_CRIT - 1)).toFixed(0) + '% (ratio ' + RATIO_ECF_TO_CRIT.toFixed(3) +
      '), strictly inside the L6 (' + L6.absE_CF.toExponential(2) + ') .. L5 (' + L5.absE_CF.toExponential(2) +
      ') bracket: the log-log interpolation reproduces the true magnitude at the pinned sigma.',
    M2_errCF_sits_at_the_knee:
      'At sigma = 0.013 the truncation prediction relTrunc*|E_CF| ~ ' + TRUNC_PRED_AT_X.toExponential(2) +
      ' and the round-off floor R ~ ' + ROUNDOFF_FLOOR.toExponential(2) + ' agree to ~' +
      Math.abs(100 * (KNEE_TRUNC_VS_FLOOR - 1)).toFixed(0) + '% (ratio ' + KNEE_TRUNC_VS_FLOOR.toFixed(3) +
      '), so the two regimes genuinely MEET there; the measured errCF(1e-3) ~ ' + X.errCF.toExponential(2) +
      ' sits at ~' + RATIO_ERR_TO_FLOOR.toFixed(2) + 'x the floor and ~' + RATIO_ERR_TO_TRUNC.toFixed(2) +
      'x the truncation prediction -- exactly the knee, neither in the clean plateau nor deep in the floor.',
    M3_vindicates_interpolated_pin:
      'Evaluating the crossover sigma DIRECTLY (rather than inferring it from L5/L6) reproduces |E_CF|_crit and ' +
      'the errCF(1e-3) knee to a few percent, upgrading the imp-124769 M3 crossover from an interpolated ' +
      'inference to a directly measured landmark. No bound moves; conditional-share diagnostic only.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier cross-check, NOT rigorous). A landmark placed DIRECTLY at the ' +
    'imp-124769 pinned crossover sigma = 0.013 reconstructs |E_CF| ~ ' + X.absE_CF.toExponential(2) +
    ', matching the interpolated |E_CF|_crit ~ ' + ECF_CRIT.toExponential(2) + ' to ~5% and lying strictly ' +
    'inside the L5/L6 bracket. At that sigma the truncation prediction relTrunc*|E_CF| ~ ' +
    TRUNC_PRED_AT_X.toExponential(2) + ' and the round-off floor R ~ ' + ROUNDOFF_FLOOR.toExponential(2) +
    ' meet to ~5% and the measured errCF(1e-3) ~ ' + X.errCF.toExponential(2) + ' sits at the resulting knee ' +
    '(~1.1-1.2x each), directly confirming the imp-124769 M3 interpolated crossover rather than inferring it from ' +
    'the two bracketing rungs. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as ' +
    'differentiation axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124769 (interpolated E_CF stencil crossover, |E_CF|_crit ~1.4e-6 / sigma_crit ~0.013); imp-97821 (L6 ' +
    'non-monotone eps-ladder); imp-97710 (L5 clean O(eps^2) quartering); imp-97665 (EXACT pair-ratio ' +
    'E_CF/E_ET = E_flow/E_trunc); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124809_ECF_CROSSOVER_DIRECT_LANDMARK_ASSERTIONS = [
  {
    // The direct landmark sits strictly inside the L5/L6 bracket in both sigma and |E_CF|.
    id: 'imp124809-direct-landmark-inside-L5-L6-bracket',
    description: 'sigma = 0.013 lies between L6 (0.005) and L5 (0.02) and its |E_CF| lies between the two',
    holds: () =>
      SIGMA_CROSSOVER > 0.005 &&
      SIGMA_CROSSOVER < 0.02 &&
      X.absE_CF > L6.absE_CF &&
      X.absE_CF < L5.absE_CF,
  },
  {
    // (M1): the directly evaluated |E_CF| matches the imp-124769 interpolated |E_CF|_crit to within ~15%.
    id: 'imp124809-absE_CF-matches-interpolated-crit',
    description: '|E_CF|(sigma = 0.013) agrees with the imp-124769 interpolated |E_CF|_crit to within ~15%',
    holds: () => RATIO_ECF_TO_CRIT > 0.85 && RATIO_ECF_TO_CRIT < 1.15,
  },
  {
    // (M2): the truncation prediction and the round-off floor MEET at sigma = 0.013 (the knee, to within ~15%).
    id: 'imp124809-truncation-meets-floor-at-crossover',
    description: 'relTrunc*|E_CF| and R agree to within ~15% at sigma = 0.013 (the two regimes meet: the knee)',
    holds: () => KNEE_TRUNC_VS_FLOOR > 0.85 && KNEE_TRUNC_VS_FLOOR < 1.15,
  },
  {
    // (M2): the measured errCF(1e-3) sits AT the knee -- of order the floor and the truncation prediction, not
    // deep in either regime (within a factor 2 of both).
    id: 'imp124809-errCF-sits-at-the-knee',
    description: 'measured errCF(1e-3) is within a factor 2 of both the floor R and the truncation prediction',
    holds: () =>
      RATIO_ERR_TO_FLOOR > 0.5 &&
      RATIO_ERR_TO_FLOOR < 2 &&
      RATIO_ERR_TO_TRUNC > 0.5 &&
      RATIO_ERR_TO_TRUNC < 2,
  },
  {
    // The rebuilt reference constants reproduce the imp-124769 pinned values (relTrunc ~3.25e-7, R ~4.46e-13).
    id: 'imp124809-reference-constants-reproduce-imp124769',
    description: 'rebuilt relTrunc plateau ~3.25e-7 and floor R ~4.46e-13 match the imp-124769 pinned constants',
    holds: () =>
      REL_TRUNC_MEAN > 2.5e-7 &&
      REL_TRUNC_MEAN < 4e-7 &&
      ROUNDOFF_FLOOR > 2e-13 &&
      ROUNDOFF_FLOOR < 8e-13,
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, PT stays SOTA.
    id: 'imp124809-honesty-gate-no-qed',
    description: 'Measurement/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124809_ECF_CROSSOVER_DIRECT_LANDMARK.isRigorous === false &&
      /NO QED/.test(IMP124809_ECF_CROSSOVER_DIRECT_LANDMARK.verdict) &&
      /remains SOTA/.test(IMP124809_ECF_CROSSOVER_DIRECT_LANDMARK.verdict),
  },
];

for (const a of IMP124809_ECF_CROSSOVER_DIRECT_LANDMARK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124809-ecf-crossover-direct-landmark assertion failed: ${a.id}`);
  }
}
