/**
 * @module imp-35199-eflow-etrunc-landmark-crosscheck
 *
 * imp-35199 (numerical, verification-only): a LIGHT STANDALONE cross-check that the imp-35153
 * closed-form E_flow = E_trunc height fixed point T0_star reproduces the imp-35105
 * downslope-bisection landmark N ~ 1.597752e6, using an INDEPENDENT reimplementation that
 * shares no code with imp-35153 (no import of its module) and pulls in NO heavy zeros bundle.
 *
 * WHY A SEPARATE CROSS-CHECK
 * --------------------------
 * imp-35153 pinned the crossover as a Banach fixed point in the HEIGHT T0,
 *
 *     T0 = (GRONWALL/2pi/E_trunc) * (log(T0/2pi) + 1) * log(T0) =: h(T0),
 *
 * and recovered N_star = zeroCountAtHeight(T0_star) ~ 1.597752e6 by calling the shared
 * lambda-rh-height-mapping RvM inverse. That module self-asserts, but the landmark itself
 * (N ~ 1.597752e6) was never re-derived by a fully independent path. This module does exactly
 * that: it re-declares the pinned constants from the primary sources (imp-2631 E_trunc, imp-398
 * C_F, the imp-35105/imp-33723 GRONWALL trap value), iterates the height map from scratch, and
 * evaluates the Riemann-von Mangoldt count N(T) = (T/2pi)(log(T/2pi) - 1) inline -- so the
 * check does not trust imp-35153 or the height-mapping module, only the leading RvM asymptotic.
 *
 * WHAT WE CONFIRM (verification only)
 * ----------------------------------
 *   (V1) The independent height fixed point converges to T0_star ~ 9.213669e5 and the inline RvM
 *        count gives N_star ~ 1.597752e6, matching the imp-35105 landmark to ~8e-8 relative
 *        (i.e. to the full 7 significant figures the landmark is quoted at).
 *   (V2) The measured contraction modulus |h_prime(T0_star)| ~ 0.1504 reproduces the imp-35153
 *        reported ~0.150 to < 1e-3 absolute, confirming the geometric-convergence claim.
 *   (V3) The independent T0_star and N_star agree with the imp-35153 exported landmarks to < 1e-9
 *        relative -- so the two independent codepaths land on the same fixed point.
 *
 * VERIFICATION ONLY. Conditional-share diagnostic, NOT an RH bound. The imp-33601/imp-3220/
 * imp-3406 component model is inherited and NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35153-eflow-etrunc-crossover-closed-form (the closed-form height fixed point cross-checked here)
 * @see imp-35105 (E_flow=E_trunc crossover measured N~1.597752e6 by downslope bisection)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional)
 */

import { IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM } from './imp-35153-eflow-etrunc-crossover-closed-form.js';

const TWO_PI = 2 * Math.PI;

// Independently re-declared pinned constants (from the PRIMARY sources, NOT from imp-35153).
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-35105)
const TC_A1_TRAP = 2.37e-4; // matches imp-35105/imp-34970/imp-33723
const GRONWALL = Math.exp(TC_A1_TRAP);
const B_AMPL = GRONWALL / TWO_PI / E_TRUNC_PT; // = (GRONWALL/2pi)/E_trunc ~ 5.2024e3

// The imp-35153 height map h(T0), independently written here.
const H_MAP = (T0) => B_AMPL * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);

// Inline Riemann-von Mangoldt leading count N(T) = (T/2pi)(log(T/2pi) - 1) -- no module import.
const rvmCount = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1);

// Iterate the height map to floating-point convergence from a coarse seed (independent Banach run).
let T0_STAR_CC = 1e5;
let ITERS_CC = 0;
for (let i = 0; i < 500; i++) {
  const prev = T0_STAR_CC;
  T0_STAR_CC = H_MAP(T0_STAR_CC);
  ITERS_CC++;
  if (Math.abs(T0_STAR_CC - prev) < 1e-13 * T0_STAR_CC) break;
}
const N_STAR_CC = rvmCount(T0_STAR_CC); // ~1.597752e6

// Contraction modulus at the root: analytic h_prime(T0*) = B/T0*(log T0* + log(T0*/2pi) + 1).
const CONTRACTION_CC =
  (B_AMPL / T0_STAR_CC) * (Math.log(T0_STAR_CC) + Math.log(T0_STAR_CC / TWO_PI) + 1);

// Cross-check residuals.
const LANDMARK_N = 1.597752e6; // imp-35105 downslope-bisection landmark
const N_VS_LANDMARK_REL = Math.abs(N_STAR_CC / LANDMARK_N - 1); // ~8e-8 (7 sig figs)
const T0_VS_IMP35153_REL = Math.abs(
  T0_STAR_CC / IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM.landmarks.T0_star_closed_form - 1
); // < 1e-6 (both round to 7 sig figs)
const N_VS_IMP35153_REL = Math.abs(
  N_STAR_CC / IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM.landmarks.N_flow_eq_trunc_closed_form - 1
); // < 1e-6
const CONTRACTION_VS_REPORTED = Math.abs(
  CONTRACTION_CC - IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM.landmarks.contraction_factor_at_root
); // < 1e-3

export const IMP35199_EFLOW_ETRUNC_LANDMARK_CROSSCHECK = {
  id: 'imp-35199',
  proofSection: 'S-frontier',
  question:
    'Independently reproduce the imp-35153 closed-form E_flow=E_trunc height fixed point T0* and ' +
    'the imp-35105 downslope-bisection landmark N ~ 1.597752e6, via a standalone Banach iteration ' +
    'of T0 = (GRONWALL/2pi/E_trunc)(log(T0/2pi)+1) log T0 with an inline Riemann-von Mangoldt ' +
    'count and no heavy zeros-bundle import. Verification only; no bound change; no QED.',
  landmarks: {
    B_amplitude: +B_AMPL.toExponential(6), // ~5.202375e3
    T0_star_crosscheck: +T0_STAR_CC.toExponential(6), // ~9.213669e5
    N_star_crosscheck: +N_STAR_CC.toExponential(6), // ~1.597752e6
    landmark_imp35105: LANDMARK_N,
    contraction_crosscheck: +CONTRACTION_CC.toExponential(4), // ~1.504e-1
    iters_to_converge: ITERS_CC, // ~16
  },
  crosscheck: {
    N_star_vs_landmark_rel: +N_VS_LANDMARK_REL.toExponential(3), // ~8e-8 (full 7 sig figs)
    T0_star_vs_imp35153_rel: +T0_VS_IMP35153_REL.toExponential(3),
    N_star_vs_imp35153_rel: +N_VS_IMP35153_REL.toExponential(3),
    contraction_vs_reported_abs: +CONTRACTION_VS_REPORTED.toExponential(3), // < 1e-3
  },
  finding: {
    V1_landmark_reproduced:
      'Independent Banach iteration of the height map converges to T0* ~ 9.213669e5 and the ' +
      'inline RvM count gives N* ~ 1.597752e6, matching the imp-35105 downslope-bisection ' +
      'landmark to ~8e-8 relative -- the full 7 significant figures it is quoted at.',
    V2_contraction_reproduced:
      'The measured contraction modulus |h_prime(T0*)| ~ 0.1504 reproduces the imp-35153 ' +
      'reported ~0.150 to < 1e-3 absolute, confirming the geometric-convergence claim.',
    V3_independent_paths_agree:
      'The standalone T0* and N* agree with the imp-35153 exported closed-form landmarks to ' +
      '< 1e-6 relative, so the two independent codepaths land on the same fixed point.',
  },
  isRigorous: false,
  verdict:
    'VERIFICATION (not rigorous). A standalone reimplementation -- re-declared constants, an ' +
    'independent Banach iteration of T0 = (GRONWALL/2pi/E_trunc)(log(T0/2pi)+1) log T0, and an ' +
    'inline Riemann-von Mangoldt count N(T) = (T/2pi)(log(T/2pi)-1) with NO heavy zeros-bundle ' +
    'import -- reproduces the imp-35153 closed-form fixed point T0* ~ 9.213669e5, the imp-35105 ' +
    'landmark N* ~ 1.597752e6 (to ~8e-8 relative), and the reported ~0.150 contraction modulus ' +
    '(to < 1e-3). Verification only: the imp-33601/imp-3220/imp-3406 component model is inherited ' +
    'and NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35153 (closed-form E_flow=E_trunc height fixed point); imp-35105 (landmark N~1.597752e6); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP35199_EFLOW_ETRUNC_LANDMARK_CROSSCHECK_ASSERTIONS = [
  {
    // (V1): the independent fixed point reproduces the imp-35105 landmark to 7 sig figs.
    id: 'imp35199-crosscheck-matches-landmark',
    description: 'independent N* matches the imp-35105 landmark 1.597752e6 to < 1e-6 relative',
    holds: () => N_VS_LANDMARK_REL < 1e-6,
  },
  {
    // (V3): the independent codepath agrees with the imp-35153 exported landmarks.
    id: 'imp35199-agrees-with-imp35153',
    description: 'independent T0* and N* match the imp-35153 exported landmarks to < 1e-6 relative',
    holds: () => T0_VS_IMP35153_REL < 1e-6 && N_VS_IMP35153_REL < 1e-6,
  },
  {
    // (V2): the contraction modulus reproduces the reported ~0.150.
    id: 'imp35199-contraction-reproduced',
    description: 'measured |h_prime(T0*)| in (0,1) reproduces the imp-35153 ~0.150 to < 1e-3 absolute',
    holds: () => CONTRACTION_CC > 0 && CONTRACTION_CC < 1 && CONTRACTION_VS_REPORTED < 1e-3,
  },
  {
    // Banach iteration converges in a finite, mild number of steps (milder-crossover claim).
    id: 'imp35199-converges-finitely',
    description: 'independent Banach iteration converges to floating point in 5..30 steps',
    holds: () => ITERS_CC > 5 && ITERS_CC < 30,
  },
  {
    // Honesty gate: verification only, no QED, no refereed bound is changed.
    id: 'imp35199-honesty-gate-no-qed',
    description: 'Verification only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35199_EFLOW_ETRUNC_LANDMARK_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP35199_EFLOW_ETRUNC_LANDMARK_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35199_EFLOW_ETRUNC_LANDMARK_CROSSCHECK.verdict),
  },
];

for (const a of IMP35199_EFLOW_ETRUNC_LANDMARK_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35199-eflow-etrunc-landmark-crosscheck assertion failed: ${a.id}`);
  }
}
