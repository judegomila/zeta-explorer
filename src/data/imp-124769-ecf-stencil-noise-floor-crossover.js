/**
 * @module imp-124769-ecf-stencil-noise-floor-crossover
 *
 * imp-124769 (numerical/measurement, frontier cross-check): imp-97821 reported QUALITATIVELY that at the sixth
 * landmark L6 (sigma = 0.005) the direct DIAG3 = E_CC + E_ET + E_CF eps-ladder stops quartering cleanly and
 * becomes NON-monotone, because the collapsed E_CF elasticity (~2.4e-7) is so small that the landmark-bisection
 * round-off in its finite difference overtakes the O(eps^2) truncation -- whereas at L5 (sigma = 0.02) the ladder
 * still quartered cleanly. This leaf PINS that crossover: it measures, across the imp-97520 landmark ladder
 * L2..L6, the collapsed E_CF elasticity magnitude AND the finite-difference error of the DIRECT E_CF measurement
 * at the shared headline step eps = 1e-3, and pins the sigma (equivalently the E_CF magnitude) at which that
 * error switches from a clean O(eps^2) truncation power law to the landmark-bisection round-off floor. The
 * imp-97821/imp-97710 central-difference machinery is reused VERBATIM. Measurement/sensitivity only; conditional-
 * share diagnostic; the pinned constants are perturbed only symbolically as differentiation axes; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689/imp-97710/imp-97821 crossing relation)
 * -------------------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L (identical
 * bisection to imp-97644/imp-97689/imp-97710/imp-97821). E_CF = d ln N_L / d ln f is the crossing elasticity of
 * the flow amplitude, reconstructed in closed form as E_CF = K * (-E_flow*sigma/E_N) with K = -1/(N_L sigma_N).
 *
 * THE CROSSOVER PIN (the deliverable)
 * -----------------------------------
 * At each landmark L2..L6 (sigma = 0.9, 0.5, 0.1, 0.02, 0.005) the collapsed E_CF magnitude is reconstructed in
 * closed form, and the DIRECT central-difference E_CF elasticity is measured at the shared headline step
 * eps = 1e-3. The finite-difference error errCF(eps=1e-3) = |E_CF^direct - E_CF^recon| is decomposed into two
 * competing regimes:
 *   (a) TRUNCATION regime: errCF ~ relTrunc * |E_CF|, a CONSTANT relative O(eps^2) truncation (relTrunc ~ 3.3e-7
 *       at eps = 1e-3, i.e. ~ eps^2/6 times the relative third log-derivative). Clean while |E_CF| is large.
 *   (b) ROUND-OFF regime: errCF ~ R, a nearly landmark-independent absolute floor set by the double-precision
 *       bisection resolution of ln N_L (measured R ~ 4.5e-13 at eps = 1e-3). Dominates once |E_CF| is small.
 * The CROSSOVER is where the two meet: relTrunc * |E_CF|_crit = R  =>  |E_CF|_crit = R / relTrunc ~ 1.4e-6,
 * i.e. sigma_crit ~ 0.013 -- BETWEEN L5 (sigma 0.02, |E_CF| ~ 3.25e-6, still truncation-clean) and L6
 * (sigma 0.005, |E_CF| ~ 2.39e-7, round-off-dominated). This is exactly why imp-97710 saw clean quartering at
 * L5 and imp-97821 saw the non-monotone eps-ladder appear at L6.
 *
 * THE FINDING (measurement / cross-validation only)
 * ------------------------------------------------
 *   (M1) THE E_CF STEP-1e-3 ERROR HAS A CLEAN TRUNCATION POWER LAW THAT BOTTOMS AT L5. errCF(1e-3) falls
 *        MONOTONICALLY L2 -> L5 (7.5e-8, 1.3e-9, 2.5e-11, 4.5e-13) tracking relTrunc*|E_CF| with relTrunc
 *        stable at ~3.3e-7 across L2..L4, then TURNS BACK UP at L6 (3.4e-12): the truncation regime bottoms at
 *        the round-off floor R ~ 4.5e-13 at L5.
 *   (M2) THE RELATIVE TRUNCATION CONSTANT BREAKS PAST L5. errCF/|E_CF| is ~3.0e-7/3.3e-7/3.4e-7 at L2/L3/L4
 *        (a clean O(eps^2) plateau) but collapses at L5 (~1.4e-7, error now at the floor, no longer truncation)
 *        and explodes at L6 (~1.4e-5, pure round-off / tiny E_CF): the truncation description fails once
 *        |E_CF| < ~1.4e-6.
 *   (M3) THE CROSSOVER IS PINNED AT |E_CF|_crit ~ 1.4e-6 / sigma_crit ~ 0.013, BETWEEN L5 AND L6. The standard
 *        eps = 1e-3 rung (and hence the DIAG3 eps-ladder) stays truncation-clean while |E_CF| > |E_CF|_crit
 *        (through L5, sigma 0.02) and becomes round-off-dominated / non-monotone once |E_CF| < |E_CF|_crit
 *        (at L6, sigma 0.005) -- pinning the imp-97821 M3 qualitative crossover to a magnitude and a sigma.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (L6 non-monotone eps-ladder reported qualitatively)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the far-downslope L5 clean O(eps^2) quartering)
 * @see imp-97689-diag3-additivity-euler-derivation (analytic derivation + L2/L3/L4 closed-form verification)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97689/imp-97710/imp-97821

// EXACT imp-3406/imp-97644/imp-97689/imp-97710/imp-97821 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97689/imp-97710/imp-97821).
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
// +/- amplitude perturbation (verbatim imp-97710/imp-97821 machinery).
function directElasticity(level, axis, eps) {
  const base = { cc: C_C_PINNED, et: E_TRUNC_PT, cf: 1.0 };
  const solve = (sgn) => {
    const q = { ...base };
    q[axis] = base[axis] * (1 + sgn * eps);
    return Math.log(landmark(level, q.cc, q.et, q.cf));
  };
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

// The imp-97520 landmark ladder L2..L6 (identical sigma levels to imp-97689/imp-97710/imp-97821).
const LADDER_SIGMAS = [
  { key: 'L2', sigma: 0.9 },
  { key: 'L3', sigma: 0.5 },
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 }, // imp-97710 anchor: last clean O(eps^2) quartering
  { key: 'L6', sigma: 0.005 }, // imp-97821 anchor: non-monotone eps-ladder appears
];
const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K only
const EPS_HEADLINE = 1e-3; // shared headline amplitude step of imp-97710/imp-97821

// At each landmark: reconstruct the collapsed E_CF magnitude and measure the DIRECT E_CF finite-difference error
// at the shared headline step eps = 1e-3.
const LADDER = LADDER_SIGMAS.map(({ key, sigma }) => {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const K = -1 / dSigmaDlnN(N, H_STENCIL);
  const reconCF = K * (-P.E_flow * P.sigma / P.E_N); // collapsed E_CF (closed form)
  const directCF = directElasticity(sigma, 'cf', EPS_HEADLINE);
  const errCF = Math.abs(directCF - reconCF); // finite-difference error at eps = 1e-3
  const relTrunc = errCF / Math.abs(reconCF); // constant ~3.3e-7 while truncation-limited
  return {
    key,
    sigma,
    N_L: +N.toExponential(6),
    E_CF: +reconCF.toExponential(6),
    absE_CF: Math.abs(reconCF),
    errCF_at_1em3: +errCF.toExponential(4),
    errCF_abs: errCF,
    relTrunc_at_1em3: +relTrunc.toExponential(4),
  };
});

const byKey = Object.fromEntries(LADDER.map((r) => [r.key, r]));

// (M1)/(M2): the clean truncation plateau over L2..L4, and the round-off floor reached at L5.
const REL_TRUNC_CLEAN = ['L2', 'L3', 'L4'].map((k) => byKey[k].relTrunc_at_1em3);
const REL_TRUNC_MEAN = REL_TRUNC_CLEAN.reduce((a, b) => a + b, 0) / REL_TRUNC_CLEAN.length;
const ROUNDOFF_FLOOR = byKey.L5.errCF_abs; // measured minimum of the errCF(1e-3) ladder (at L5)

// (M3): pin the crossover magnitude and sigma where truncation == round-off.
const ECF_CRIT = ROUNDOFF_FLOOR / REL_TRUNC_MEAN; // |E_CF|_crit = R / relTrunc
// Interpolate sigma_crit in log-log between the bracketing rungs L5 (clean) and L6 (round-off).
const lo = byKey.L6; // smaller |E_CF|, smaller sigma
const hi = byKey.L5; // larger |E_CF|, larger sigma
const t =
  (Math.log(ECF_CRIT) - Math.log(lo.absE_CF)) /
  (Math.log(hi.absE_CF) - Math.log(lo.absE_CF));
const SIGMA_CRIT = Math.exp(Math.log(lo.sigma) + t * (Math.log(hi.sigma) - Math.log(lo.sigma)));

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER = {
  id: 'imp-124769',
  proofSection: 'S-frontier',
  question:
    'imp-97821 reported qualitatively that the direct DIAG3 = E_CC + E_ET + E_CF eps-ladder loses its clean ' +
    'O(eps^2) quartering and becomes NON-monotone at the sixth landmark L6 (sigma = 0.005) because the collapsed ' +
    'E_CF elasticity (~2.4e-7) is so small that the landmark-bisection round-off overtakes the truncation, ' +
    'whereas at L5 (sigma = 0.02) it still quartered cleanly. At what sigma (equivalently, at what E_CF ' +
    'magnitude) does that crossover actually happen? Measurement/sensitivity only; pinned constants perturbed ' +
    'only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-97710/imp-97821 machinery verbatim. Across the landmark ladder L2..L6 (sigma = 0.9, 0.5, 0.1, ' +
    '0.02, 0.005) reconstruct the collapsed E_CF = K*(-E_flow*sigma/E_N) in closed form and MEASURE the direct ' +
    'central-difference E_CF elasticity at the shared headline step eps = 1e-3, forming errCF = |E_CF^direct - ' +
    'E_CF^recon|. Decompose errCF(1e-3) into a truncation regime errCF ~ relTrunc*|E_CF| (constant relative ' +
    'O(eps^2)) and a round-off floor errCF ~ R (bisection resolution of ln N_L); pin the crossover ' +
    '|E_CF|_crit = R/relTrunc and interpolate sigma_crit between the bracketing rungs.',
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  stencil_step_for_kernel_only: H_STENCIL,
  headline_eps: EPS_HEADLINE,
  ladder: LADDER.map((r) => ({
    key: r.key,
    sigma: r.sigma,
    N_L: r.N_L,
    E_CF: r.E_CF,
    errCF_at_1em3: r.errCF_at_1em3,
    relTrunc_at_1em3: r.relTrunc_at_1em3,
  })),
  truncationPlateau: {
    rungs: ['L2', 'L3', 'L4'],
    relTrunc_values: REL_TRUNC_CLEAN,
    relTrunc_mean: round(REL_TRUNC_MEAN),
    note:
      'errCF(1e-3)/|E_CF| is a stable ~3.3e-7 plateau across L2..L4 -- a clean O(eps^2) truncation at the ' +
      'headline step -- then breaks (falls at L5 where the error hits the floor, explodes at L6 pure round-off).',
  },
  roundoffFloor: {
    R_abs: round(ROUNDOFF_FLOOR),
    reached_at: 'L5',
    note:
      'errCF(1e-3) falls monotonically L2 -> L5 tracking relTrunc*|E_CF|, bottoms at the landmark-bisection ' +
      'round-off floor R ~ 4.5e-13 at L5, then turns back UP at L6 -- the truncation regime bottoms out.',
  },
  crossover: {
    E_CF_crit: round(ECF_CRIT),
    sigma_crit: round(SIGMA_CRIT),
    bracket: 'between L5 (sigma 0.02, |E_CF| ~ 3.25e-6, clean) and L6 (sigma 0.005, |E_CF| ~ 2.39e-7, round-off)',
    E_CF_L5: hi.E_CF,
    E_CF_L6: lo.E_CF,
    note:
      'relTrunc*|E_CF|_crit = R gives |E_CF|_crit ~ 1.4e-6, sigma_crit ~ 0.013: the standard eps = 1e-3 rung ' +
      '(hence the DIAG3 eps-ladder) stays truncation-clean while |E_CF| > |E_CF|_crit (through L5) and becomes ' +
      'round-off-dominated / non-monotone once |E_CF| < |E_CF|_crit (at L6).',
  },
  finding: {
    M1_truncation_powerlaw_bottoms_at_L5:
      'errCF(1e-3) = |E_CF^direct - E_CF^recon| falls MONOTONICALLY across L2 -> L5 (' +
      byKey.L2.errCF_at_1em3.toExponential(2) + ', ' + byKey.L3.errCF_at_1em3.toExponential(2) + ', ' +
      byKey.L4.errCF_at_1em3.toExponential(2) + ', ' + byKey.L5.errCF_at_1em3.toExponential(2) + '), tracking ' +
      'relTrunc*|E_CF|, then TURNS BACK UP at L6 (' + byKey.L6.errCF_at_1em3.toExponential(2) + '): the ' +
      'truncation regime bottoms at the round-off floor R ~ ' + ROUNDOFF_FLOOR.toExponential(2) + ' at L5.',
    M2_rel_truncation_constant_breaks_past_L5:
      'errCF(1e-3)/|E_CF| is a clean O(eps^2) plateau ~' + REL_TRUNC_MEAN.toExponential(2) + ' across L2..L4 (' +
      byKey.L2.relTrunc_at_1em3.toExponential(2) + '/' + byKey.L3.relTrunc_at_1em3.toExponential(2) + '/' +
      byKey.L4.relTrunc_at_1em3.toExponential(2) + ') but collapses at L5 (' +
      byKey.L5.relTrunc_at_1em3.toExponential(2) + ', error at the floor) and explodes at L6 (' +
      byKey.L6.relTrunc_at_1em3.toExponential(2) + ', pure round-off): the truncation description fails once ' +
      '|E_CF| < ~' + ECF_CRIT.toExponential(2) + '.',
    M3_crossover_pinned:
      'relTrunc*|E_CF|_crit = R pins the crossover at |E_CF|_crit ~ ' + ECF_CRIT.toExponential(2) +
      ' / sigma_crit ~ ' + SIGMA_CRIT.toExponential(2) + ', BETWEEN L5 (sigma 0.02, |E_CF| ~ ' +
      Math.abs(hi.E_CF).toExponential(2) + ') and L6 (sigma 0.005, |E_CF| ~ ' + Math.abs(lo.E_CF).toExponential(2) +
      '): the eps = 1e-3 rung (hence the DIAG3 ladder) stays truncation-clean above it (through L5) and becomes ' +
      'round-off-dominated / non-monotone below it (at L6). This pins the imp-97821 M3 qualitative crossover.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Across the landmark ladder L2..L6 the ' +
    'direct E_CF finite-difference error at the shared headline step eps = 1e-3 follows a clean O(eps^2) ' +
    'truncation power law errCF ~ relTrunc*|E_CF| with relTrunc ~ ' + REL_TRUNC_MEAN.toExponential(2) + ' stable ' +
    'across L2..L4, bottoms at the landmark-bisection round-off floor R ~ ' + ROUNDOFF_FLOOR.toExponential(2) +
    ' at L5, then turns back up at L6. Equating the two regimes pins the crossover at |E_CF|_crit ~ ' +
    ECF_CRIT.toExponential(2) + ' (sigma_crit ~ ' + SIGMA_CRIT.toExponential(2) + '), BETWEEN L5 (sigma 0.02, ' +
    'the imp-97710 clean quartering) and L6 (sigma 0.005, the imp-97821 non-monotone ladder): the standard ' +
    'eps = 1e-3 rung -- and hence the DIAG3 eps-ladder -- stays truncation-clean while |E_CF| > |E_CF|_crit and ' +
    'becomes round-off-dominated once |E_CF| < |E_CF|_crit, pinning the imp-97821 M3 qualitative crossover to a ' +
    'magnitude and a sigma. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as ' +
    'differentiation axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97821 (L6 non-monotone eps-ladder, qualitative); imp-97710 (L5 clean O(eps^2) quartering); imp-97689 ' +
    '(Euler-additivity derivation + L2/L3/L4 verification); imp-97665 (EXACT pair-ratio E_CF/E_ET = ' +
    'E_flow/E_trunc); imp-97520 (landmark ladder L1..L4); imp-398 (C_F flow prefactor); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER_ASSERTIONS = [
  {
    // The ladder covers the five landmarks L2..L6 with the inherited sigma levels and downslope N ordering.
    id: 'imp124769-ladder-covers-L2-through-L6',
    description: 'ladder has L2..L6 at sigma 0.9/0.5/0.1/0.02/0.005 with strictly increasing N_L down the ladder',
    holds: () =>
      LADDER.length === 5 &&
      LADDER.every((r, i) => Math.abs(r.sigma - LADDER_SIGMAS[i].sigma) < 1e-12) &&
      LADDER.every((r, i) => i === 0 || r.absE_CF < LADDER[i - 1].absE_CF) &&
      LADDER.every((r, i) => i === 0 || r.N_L > LADDER[i - 1].N_L),
  },
  {
    // (M1): the E_CF headline-step error falls monotonically L2 -> L5 (clean truncation regime).
    id: 'imp124769-errCF-monotone-decreasing-L2-to-L5',
    description: 'errCF(1e-3) strictly decreases L2 > L3 > L4 > L5 (clean O(eps^2) truncation power law)',
    holds: () =>
      byKey.L2.errCF_abs > byKey.L3.errCF_abs &&
      byKey.L3.errCF_abs > byKey.L4.errCF_abs &&
      byKey.L4.errCF_abs > byKey.L5.errCF_abs,
  },
  {
    // (M1): errCF(1e-3) turns back UP at L6 -- the truncation regime bottoms at the round-off floor at L5.
    id: 'imp124769-errCF-turns-up-at-L6',
    description: 'errCF(1e-3) increases from L5 to L6 (round-off floor reached; truncation regime bottoms at L5)',
    holds: () => byKey.L6.errCF_abs > byKey.L5.errCF_abs && byKey.L6.errCF_abs > ROUNDOFF_FLOOR,
  },
  {
    // (M2): the relative truncation constant is a stable ~3.3e-7 plateau across L2..L4.
    id: 'imp124769-relTrunc-plateau-L2-to-L4',
    description: 'errCF(1e-3)/|E_CF| stays within a factor 2 of ~3.3e-7 across L2..L4 (clean O(eps^2) plateau)',
    holds: () =>
      REL_TRUNC_CLEAN.every((v) => v > 1e-7 && v < 6e-7) &&
      Math.max(...REL_TRUNC_CLEAN) / Math.min(...REL_TRUNC_CLEAN) < 2,
  },
  {
    // (M2): the relative truncation constant BREAKS past L5 (falls below the plateau at L5, explodes at L6).
    id: 'imp124769-relTrunc-breaks-past-L5',
    description: 'relTrunc collapses below the plateau at L5 and explodes (> plateau) at L6 (truncation fails)',
    holds: () =>
      byKey.L5.relTrunc_at_1em3 < REL_TRUNC_MEAN &&
      byKey.L6.relTrunc_at_1em3 > 10 * REL_TRUNC_MEAN,
  },
  {
    // (M3): the pinned crossover magnitude lies strictly between the L6 and L5 |E_CF| values.
    id: 'imp124769-crossover-brackets-L5-L6',
    description: '|E_CF|_crit = R/relTrunc lies strictly between the L6 (~2.4e-7) and L5 (~3.25e-6) magnitudes',
    holds: () => ECF_CRIT > lo.absE_CF && ECF_CRIT < hi.absE_CF,
  },
  {
    // (M3): the interpolated crossover sigma lies strictly between the L6 (0.005) and L5 (0.02) levels.
    id: 'imp124769-crossover-sigma-between-L5-L6',
    description: 'sigma_crit lies strictly between L6 (0.005) and L5 (0.02), pinning the imp-97821 crossover',
    holds: () => SIGMA_CRIT > 0.005 && SIGMA_CRIT < 0.02,
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, PT stays SOTA.
    id: 'imp124769-honesty-gate-no-qed',
    description: 'Measurement/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.verdict) &&
      /remains SOTA/.test(IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.verdict),
  },
];

for (const a of IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124769-ecf-stencil-noise-floor-crossover assertion failed: ${a.id}`);
  }
}
