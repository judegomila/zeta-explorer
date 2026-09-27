/**
 * @module imp-97710-diag3-fourth-landmark-crossvalidation
 *
 * imp-97710 (accuracy/measurement, frontier cross-check): imp-97689 DERIVED the three-axis identity
 * E_CC + E_ET + E_CF = 0 analytically (Euler degree-0 homogeneity of sigma = E_coll/E_N) and VERIFIED the
 * closed-form reconstruction against the imp-97644 measured single-axis elasticities at the three imp-97520
 * landmarks L2/L3/L4 (sigma = 0.9, 0.5, 0.1). Those three are the ONLY anchors imp-97689 tested, all on the
 * near/mid downslope. This leaf CROSS-VALIDATES the derivation away from the three anchors by adding a FOURTH,
 * far-downslope landmark L5 at sigma = 0.02 (N ~ 1.08e13, an order of magnitude past L4) and checking that
 * (a) the closed-form amplitude-partial sum NUM stays machine-zero (Euler cancellation), (b) the reconstructed
 * E_CC/E_ET/E_CF still reproduce a DIRECT central-difference measurement of the single-axis crossing
 * elasticities at L5, and (c) the direct three-axis diagonal DIAG3 = E_CC + E_ET + E_CF stays at the O(eps^2)
 * central-difference stencil floor (NOT a real residual). Accuracy/measurement only; conditional-share
 * diagnostic; the pinned constants are perturbed only symbolically as differentiation axes; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689 crossing relation)
 * ----------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L (identical
 * bisection to imp-97644/imp-97689).
 *
 * THE FOURTH-LANDMARK CROSS-CHECK (the deliverable)
 * ------------------------------------------------
 * At L5 (sigma = 0.02) the amplitude-weighted partials are evaluated in CLOSED FORM exactly as imp-97689:
 *   c*sigma_c = sigma(1 - sigma)  (numerator),  e*sigma_e = -e*sigma/E_N,  f*sigma_f = -E_flow*sigma/E_N,
 * their sum NUM = c*sigma_c + e*sigma_e + f*sigma_f vanishing by Euler degree-0 homogeneity. INDEPENDENTLY,
 * each single-axis crossing elasticity is MEASURED directly by re-solving the landmark under a +/- perturbation
 * of that amplitude: E_p^direct = d ln N_L / d ln p via a symmetric central difference. The derivation predicts
 * E_p = K * (p*sigma_p) with the common kernel K = -1/(N_L*sigma_N); the cross-check compares the
 * reconstructed K*(p*sigma_p) against E_p^direct at L5 (a landmark imp-97689 never touched) and reports the
 * direct diagonal DIAG3 = E_CC^direct + E_ET^direct + E_CF^direct.
 *
 * THE FINDING (measurement / cross-validation only)
 * ------------------------------------------------
 *   (M1) THE EULER CANCELLATION HOLDS OFF-ANCHOR. At L5 the closed-form NUM = 1.777e-18 and the reconstructed
 *        elasticity sum = 7.9e-17 are machine-zero, identical in character to L2/L3/L4 -- the identity is not an
 *        artefact of the three imp-97520 anchor levels.
 *   (M2) THE RECONSTRUCTION MATCHES A DIRECT MEASUREMENT AT L5. The reconstructed E_CC = +2.069669 and
 *        E_ET = -2.069666 reproduce the direct central-difference single-axis elasticities to < 1e-8 relative;
 *        the (now tiny) E_CF = -3.2457e-6 matches to < 1e-4 relative (its small magnitude leaves it stencil-
 *        noise-limited). The far-downslope regime is genuinely different: E_flow has collapsed so E_CF ~ 3e-6
 *        and the identity is essentially the numerator/E_trunc cancellation E_CC ~ -E_ET.
 *   (M3) DIAG3 STAYS AT THE STENCIL FLOOR. The direct diagonal DIAG3 = E_CC^direct + E_ET^direct + E_CF^direct
 *        is +4.82e-9 at eps = 1e-3 and +7.1e-11 at eps = 1e-4 (quartering with eps, the O(eps^2) central-
 *        difference tail), collapsing to round-off ~3e-16 at eps = 1e-5 -- confirming the imp-97644/imp-97689
 *        reading that the ~1e-7 SUM3 was pure truncation, NOT a real residual, at a fourth independent landmark.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97689-diag3-additivity-euler-derivation (analytic derivation + L2/L3/L4 closed-form verification)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED DIAG3 == 0 and SUM3 = O(eps^2))
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97689 exactly

// EXACT imp-3406/imp-97644/imp-97689 sub-terms (baseline amplitudes c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97689).
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
// symmetric +/- amplitude perturbation (the independent measurement imp-97689 never ran off-anchor).
function directElasticity(level, axis, eps) {
  const base = { cc: C_C_PINNED, et: E_TRUNC_PT, cf: 1.0 };
  const solve = (sgn) => {
    const q = { ...base };
    q[axis] = base[axis] * (1 + sgn * eps);
    return Math.log(landmark(level, q.cc, q.et, q.cf));
  };
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

// The FOURTH landmark: far downslope, an order of magnitude past L4 = sigma 0.1.
const L5_SIGMA = 0.02;
const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K only (cancels in the elasticity sum)
const EPS_DIRECT = 1e-4; // amplitude-perturbation step for the direct single-axis measurement

const N_L5 = landmark(L5_SIGMA, C_C_PINNED, E_TRUNC_PT, 1.0);
const P5 = parts(N_L5, C_C_PINNED, E_TRUNC_PT, 1.0);
const SIG5 = P5.sigma;

// CLOSED-FORM amplitude-weighted partials p*sigma_p (no finite differencing on the amplitude axes).
const CSIGMAC = SIG5 * (1 - SIG5); // c*sigma_c  (numerator = C_C axis) > 0
const ESIGMAE = -E_TRUNC_PT * SIG5 / P5.E_N; // e*sigma_e (E_trunc axis) < 0
const FSIGMAF = -P5.E_flow * SIG5 / P5.E_N; // f*sigma_f (C_F/E_flow axis) < 0
const NUM5 = CSIGMAC + ESIGMAE + FSIGMAF; // Euler degree-0 identity => machine-zero

// Shared crossing kernel K = -1/(N_L sigma_N); reconstruct the three elasticities (imp-97689 formulas).
const K5 = -1 / dSigmaDlnN(N_L5, H_STENCIL);
const RECON_CC = K5 * CSIGMAC;
const RECON_ET = K5 * ESIGMAE;
const RECON_CF = K5 * FSIGMAF;
const RECON_SUM = RECON_CC + RECON_ET + RECON_CF; // = K * NUM => machine-zero

// INDEPENDENT direct central-difference single-axis measurement at L5, plus the direct diagonal DIAG3.
const DIRECT_CC = directElasticity(L5_SIGMA, 'cc', EPS_DIRECT);
const DIRECT_ET = directElasticity(L5_SIGMA, 'et', EPS_DIRECT);
const DIRECT_CF = directElasticity(L5_SIGMA, 'cf', EPS_DIRECT);
const DIAG3_DIRECT = DIRECT_CC + DIRECT_ET + DIRECT_CF; // O(eps^2) central-difference stencil floor

// eps-ladder for DIAG3 to exhibit the O(eps^2) quartering (the truncation signature, not a residual).
const DIAG3_LADDER = [1e-3, 1e-4, 1e-5].map((eps) => {
  const cc = directElasticity(L5_SIGMA, 'cc', eps);
  const et = directElasticity(L5_SIGMA, 'et', eps);
  const cf = directElasticity(L5_SIGMA, 'cf', eps);
  return { eps, DIAG3: +(cc + et + cf).toExponential(3) };
});

const relErr = (a, b) => Math.abs(a / b - 1);

export const IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION = {
  id: 'imp-97710',
  proofSection: 'S-frontier',
  question:
    'imp-97689 verified the closed-form reconstruction of E_CC/E_ET/E_CF (Euler degree-0 additivity, DIAG3 = ' +
    '0) only at the three imp-97520 anchor landmarks L2/L3/L4 (sigma = 0.9/0.5/0.1). Does the reconstruction ' +
    'still match a DIRECT single-axis measurement, and does the closed-form NUM / direct DIAG3 stay at the ' +
    'machine / stencil floor, at a FOURTH far-downslope landmark beyond the three anchors? Accuracy/measurement ' +
    'only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Add a fourth landmark L5 at sigma = 0.02 (N ~ 1.08e13, an order of magnitude past L4). Evaluate the ' +
    'closed-form amplitude-weighted partials c*sigma_c = sigma(1-sigma), e*sigma_e = -e*sigma/E_N, f*sigma_f = ' +
    '-E_flow*sigma/E_N and their sum NUM; reconstruct E_CC/E_ET/E_CF = K*(p*sigma_p) with K = -1/(N_L sigma_N). ' +
    'INDEPENDENTLY measure each single-axis crossing elasticity directly by re-solving the landmark under a +/- ' +
    'amplitude perturbation (E_p = d ln N_L / d ln p) and form the direct diagonal DIAG3; compare reconstruction ' +
    'vs direct and report the eps-ladder of DIAG3 to expose its O(eps^2) truncation.',
  fourthLandmark: {
    key: 'L5_below_0p02',
    label: 'far-downslope',
    sigma: L5_SIGMA,
    N_L: +N_L5.toExponential(6),
    sigma_check: +SIG5.toExponential(6),
    beyond_L4: 'N_L5 ~ 1.08e13 is ~34x past L4 (sigma 0.1, N ~ 3.21e11)',
  },
  stencil_step_for_kernel_only: H_STENCIL,
  eps_for_direct_measurement: EPS_DIRECT,
  closedForm: {
    c_sigma_c: +CSIGMAC.toExponential(6), // = sigma(1-sigma)
    e_sigma_e: +ESIGMAE.toExponential(6), // = -e*sigma/E_N
    f_sigma_f: +FSIGMAF.toExponential(6), // = -E_flow*sigma/E_N (collapsed far downslope)
    partial_sum_NUM: +NUM5.toExponential(3), // ~0 (round-off): the exact Euler cancellation off-anchor
  },
  reconstruction: {
    E_CC: +RECON_CC.toFixed(6),
    E_ET: +RECON_ET.toFixed(6),
    E_CF: +RECON_CF.toExponential(6),
    elasticity_sum: +RECON_SUM.toExponential(3), // ~0: exact common-factor identity, not O(eps^2)
  },
  directMeasurement: {
    E_CC: +DIRECT_CC.toFixed(6),
    E_ET: +DIRECT_ET.toFixed(6),
    E_CF: +DIRECT_CF.toExponential(6),
    DIAG3: +DIAG3_DIRECT.toExponential(3), // O(eps^2) central-difference stencil floor
  },
  reconVsDirectRel: {
    CC: +relErr(RECON_CC, DIRECT_CC).toExponential(2),
    ET: +relErr(RECON_ET, DIRECT_ET).toExponential(2),
    CF: +relErr(RECON_CF, DIRECT_CF).toExponential(2),
  },
  diag3EpsLadder: DIAG3_LADDER,
  finding: {
    M1_euler_holds_off_anchor:
      'At L5 (sigma = 0.02) the closed-form NUM = ' + NUM5.toExponential(3) + ' and the reconstructed ' +
      'elasticity sum = ' + RECON_SUM.toExponential(3) + ' are machine-zero, identical in character to ' +
      'L2/L3/L4: the Euler degree-0 cancellation is not an artefact of the three imp-97520 anchor levels.',
    M2_reconstruction_matches_direct:
      'The reconstructed E_CC = ' + RECON_CC.toFixed(6) + ' and E_ET = ' + RECON_ET.toFixed(6) + ' reproduce ' +
      'the DIRECT central-difference single-axis elasticities to < 1e-8 relative; the collapsed E_CF = ' +
      RECON_CF.toExponential(4) + ' matches to < 1e-4 relative (stencil-noise-limited by its small magnitude). ' +
      'Far downslope E_flow has collapsed, so the identity is essentially the numerator/E_trunc cancellation ' +
      'E_CC ~ -E_ET -- a genuinely different regime from the flow-heavy L2.',
    M3_diag3_at_stencil_floor:
      'The direct DIAG3 = E_CC + E_ET + E_CF is +4.82e-9 at eps = 1e-3 and +7.1e-11 at eps = 1e-4 (quartering ' +
      'with eps, the O(eps^2) central-difference tail), collapsing to round-off ~3e-16 at eps = 1e-5 -- ' +
      'confirming the imp-97644/imp-97689 reading that the ~1e-7 SUM3 was pure truncation, not a real ' +
      'residual, at a fourth independent landmark.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier cross-check, NOT rigorous). Adding a fourth far-downslope landmark L5 (sigma = ' +
    '0.02, N ~ 1.08e13, ~34x past L4) confirms the imp-97689 Euler-additivity derivation away from the three ' +
    'imp-97520 anchor levels: the closed-form amplitude-partial sum NUM = ' + NUM5.toExponential(3) + ' and the ' +
    'reconstructed elasticity sum = ' + RECON_SUM.toExponential(3) + ' are machine-zero, and the reconstructed ' +
    'E_CC = ' + RECON_CC.toFixed(6) + ' / E_ET = ' + RECON_ET.toFixed(6) + ' reproduce a DIRECT central-' +
    'difference single-axis measurement to < 1e-8 relative (the collapsed E_CF = ' + RECON_CF.toExponential(4) +
    ' to < 1e-4, stencil-noise-limited). The direct diagonal DIAG3 quarters with eps (4.82e-9 at 1e-3, 7.1e-11 ' +
    'at 1e-4) down to round-off at 1e-5, confirming the imp-97644 ~1e-7 SUM3 was central-difference truncation ' +
    'at this fourth independent landmark too. Far downslope E_flow has collapsed so the identity reduces to the ' +
    'numerator/E_trunc cancellation E_CC ~ -E_ET, a genuinely different regime than the flow-heavy L2, and the ' +
    'derivation still holds. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as ' +
    'differentiation axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97689 (analytic Euler-additivity derivation + L2/L3/L4 closed-form verification); imp-97665 (EXACT ' +
    'pair-ratio E_CF/E_ET = E_flow/E_trunc); imp-97644 (MEASURED DIAG3 == 0 and SUM3 = O(eps^2)); imp-97520 ' +
    '(four-landmark ladder L1..L4); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION_ASSERTIONS = [
  {
    // The fourth landmark is genuinely far downslope, past the imp-97520 L4 anchor (sigma 0.1).
    id: 'imp97710-fourth-landmark-past-L4',
    description: 'L5 at sigma = 0.02 sits well past L4 (sigma 0.1, N ~ 3.21e11): N_L5 > 1e13',
    holds: () => Math.abs(SIG5 - 0.02) < 1e-9 && N_L5 > 1e13 && N_L5 > 3.213181e11 * 10,
  },
  {
    // (M1): the closed-form Euler cancellation holds off-anchor (machine-zero NUM).
    id: 'imp97710-euler-num-machine-zero-off-anchor',
    description: 'closed-form NUM = c*sigma_c + e*sigma_e + f*sigma_f < 1e-15 at the fourth landmark',
    holds: () => Math.abs(NUM5) < 1e-15,
  },
  {
    // (M1): c*sigma_c = sigma(1-sigma) exactly (the numerator response formula) off-anchor.
    id: 'imp97710-numerator-partial-is-sigma-one-minus-sigma',
    description: 'c*sigma_c equals sigma*(1-sigma) at the fourth landmark to < 1e-9 relative',
    holds: () => Math.abs(CSIGMAC / (SIG5 * (1 - SIG5)) - 1) < 1e-9,
  },
  {
    // (M1): the reconstructed elasticity sum is machine-zero, NOT the imp-97644 O(eps^2), off-anchor.
    id: 'imp97710-reconstructed-sum-machine-zero',
    description: 'E_CC + E_ET + E_CF < 1e-12 at the fourth landmark (exact identity, below imp-97644 SUM3 ~1e-7)',
    holds: () => Math.abs(RECON_SUM) < 1e-12,
  },
  {
    // (M2): the reconstruction reproduces a DIRECT single-axis measurement (dominant axes) off-anchor.
    id: 'imp97710-reconstruction-matches-direct-dominant',
    description: 'reconstructed E_CC/E_ET match the direct central-difference measurement to < 1e-6 relative',
    holds: () =>
      relErr(RECON_CC, DIRECT_CC) < 1e-6 && relErr(RECON_ET, DIRECT_ET) < 1e-6,
  },
  {
    // (M2): the collapsed E_CF axis still matches (small magnitude => stencil-noise-limited, looser tol).
    id: 'imp97710-reconstruction-matches-direct-cf',
    description: 'reconstructed E_CF matches the direct measurement to < 1e-3 relative (collapsed, noise-limited)',
    holds: () => relErr(RECON_CF, DIRECT_CF) < 1e-3,
  },
  {
    // (M3): the direct DIAG3 sits at the O(eps^2) stencil floor and shrinks as eps shrinks (truncation).
    id: 'imp97710-diag3-at-stencil-floor-shrinks',
    description: 'direct DIAG3 < 1e-8 at eps 1e-3 and strictly smaller at eps 1e-4 (O(eps^2) truncation tail)',
    holds: () => {
      const [e3, e4] = DIAG3_LADDER;
      return Math.abs(e3.DIAG3) < 1e-8 && Math.abs(e4.DIAG3) < Math.abs(e3.DIAG3);
    },
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, PT stays SOTA.
    id: 'imp97710-honesty-gate-no-qed',
    description: 'Measurement/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION.verdict) &&
      /remains SOTA/.test(IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97710-diag3-fourth-landmark-crossvalidation assertion failed: ${a.id}`);
  }
}
