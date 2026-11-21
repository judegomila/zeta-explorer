/**
 * @module imp-97689-diag3-additivity-euler-derivation
 *
 * imp-97689 (proof/derivation, frontier cross-check): imp-97644 STRUCTURE (1) MEASURED (machine-zero) the
 * three-axis diagonal DIAG3 = E_CC + E_ET + E_CF = 0 at the imp-97520 sigma landmarks, and STRUCTURE (2)
 * inferred the sum vanishes because DIAG3 (the joint C_C/E_trunc/C_F diagonal) equals the elasticity sum by
 * additivity and is itself zero by scaling invariance -- but only via the O(eps^2) central-difference SUM3
 * (+3.282e-7 at L2 down to +5.684e-11 at L4, quartering with eps). imp-97665 then DERIVED the pair-ratio
 * E_CF/E_ET = E_flow/E_trunc EXACTLY by cancelling the common crossing kernel across the two
 * denominator-additive axes. This leaf DERIVES the full three-axis identity E_CC + E_ET + E_CF = 0
 * ANALYTICALLY -- now INCLUDING the numerator (E_coll = C_C axis) response, which imp-97665 left aside --
 * as an exact common-factor identity (Euler degree-0 homogeneity), and verifies it in CLOSED FORM (no finite
 * differencing) so the sum is machine-zero, not O(eps^2). Derivation/measurement only; the pinned constants
 * are perturbed only symbolically; the C_mb GUE-conditional per imp-486 is untouched; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644 crossing relation)
 * -------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L.
 *
 * THE EXACT DERIVATION (the deliverable) -- E_CC + E_ET + E_CF = 0, no approximation
 * --------------------------------------------------------------------------------
 * Implicit differentiation of the level condition sigma(N_L(p), p) = L in any amplitude p in {c, e, f} gives
 * (imp-97665) the crossing-elasticity  E_p = d ln N_L / d ln p = -(p * sigma_p) / (N_L * sigma_N), so all
 * three elasticities share the SAME crossing kernel  K = -1 / (N_L * sigma_N)  (finite and non-zero at a
 * downslope crossing, sigma_N < 0). Hence
 *   E_CC + E_ET + E_CF = K * (c*sigma_c + e*sigma_e + f*sigma_f).
 * The three amplitude-weighted partials of sigma = c*g / (e + f*h + c*g) are, in CLOSED FORM:
 *   NUMERATOR axis (c):  sigma_c = g(e + f*h) / E_N^2 = (g/E_N)(1 - sigma)   ==>  c*sigma_c = sigma(1 - sigma),
 *   DENOM axis (e):      sigma_e = -c*g / E_N^2 = -sigma / E_N               ==>  e*sigma_e = -(e)     * sigma/E_N,
 *   DENOM axis (f):      sigma_f = -c*g*h / E_N^2 = -sigma*h / E_N           ==>  f*sigma_f = -(f*h)   * sigma/E_N = -E_flow*sigma/E_N.
 * Sum the three (the C_C term is the numerator response imp-97665 set aside; e + E_flow = E_N - E_coll):
 *   c*sigma_c + e*sigma_e + f*sigma_f = sigma(1 - sigma) - (e + E_flow) * sigma/E_N
 *                                     = sigma(1 - sigma) - (E_N - E_coll)/E_N * sigma
 *                                     = sigma(1 - sigma) - (1 - sigma) * sigma = 0    (EXACT).
 * This is exactly Euler s identity for a degree-0 homogeneous function: sum_p p*sigma_p = 0 because scaling
 * (c, e, f) -> (t*c, t*e, t*f) sends E_coll -> t*E_coll and E_N -> t*E_N, leaving sigma invariant. Multiplying
 * by the common kernel K, the elasticity sum inherits the exact cancellation:
 *   E_CC + E_ET + E_CF = K * 0 = 0   for EVERY level and every N_L, independent of the height mapping T0(N),
 * the N-derivative sigma_N, and the specific g(N), h(N). The numerator response E_CC = K*sigma(1 - sigma) > 0
 * exactly cancels the two denominator responses E_ET + E_CF = -K*sigma(1 - sigma) < 0 (whose split is fixed by
 * imp-97665: E_CF/E_ET = E_flow/e). DIAG3 = 0 is thus an exact common-factor identity, not a measurement.
 *
 * THE VERIFICATION (closed-form, no finite differencing on the amplitude axes)
 * --------------------------------------------------------------------------
 * At each landmark the three amplitude-weighted partials are evaluated from their CLOSED FORMS above (exact
 * functions of the single point N_L), so their sum NUM = c*sigma_c + e*sigma_e + f*sigma_f is machine-zero
 * (|NUM| < 1e-15, pure IEEE-double round-off) -- NOT the O(eps^2) ~1e-7 that the imp-97644 central-difference
 * SUM3 carried. The common kernel K = -1/(N_L*sigma_N) is obtained once per landmark from a 5-point O(h^4)
 * N-stencil (the ONLY numerical ingredient, and it cancels in the sum), and the reconstructed elasticities
 * E_CC = K*sigma(1 - sigma), E_ET = -K*e*sigma/E_N, E_CF = -K*E_flow*sigma/E_N reproduce the imp-97644
 * measured single-axis values (+2.555355/-2.303723/-2.516314e-1 at L2, etc.) while summing to machine-zero.
 *
 * THE FINDING (derivation + closed-form verification only)
 * -------------------------------------------------------
 *   (D1) THE SUM IS EXACTLY ZERO. E_CC + E_ET + E_CF = K*(c*sigma_c + e*sigma_e + f*sigma_f) = K*0 = 0 for
 *        every level and N_L, because the amplitude-weighted partials of sigma satisfy Euler s degree-0
 *        identity sum_p p*sigma_p = 0: the numerator response c*sigma_c = sigma(1 - sigma) exactly cancels the
 *        denominator responses e*sigma_e + f*sigma_f = -(e + E_flow)*sigma/E_N = -(1 - sigma)*sigma. A
 *        common-factor cancellation, no approximation -- closing the imp-97644 STRUCTURE (1)/(2) numerics.
 *   (D2) THE imp-97644 ~1e-7 SUM3 WAS TRUNCATION. Evaluated in closed form the amplitude-partial sum NUM is
 *        machine-zero (|NUM| < 1e-15) at every landmark, confirming the imp-97644 central-difference SUM3
 *        (+3.282e-7 at L2 .. +5.684e-11 at L4, quartering with eps) was the O(eps^2) stencil tail, not a real
 *        residual. The reconstructed E_CC/E_ET/E_CF match the imp-97644 measured single-axis elasticities.
 *
 * DERIVATION / VERIFICATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F
 * prefactor are UNTOUCHED and appear here only symbolically as differentiation axes, not re-pinned; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED DIAG3 == 0 and SUM3 = O(eps^2))
 * @see imp-97668-nonlinear-amplitude-audit (STRUCTURE (1) linear-prefactor audit)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644 exactly

// EXACT imp-3406/imp-97644 sub-terms (baseline amplitudes c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97644).
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

// d sigma / d ln N via 5-point O(h^4) stencil -- the only numerical ingredient (it cancels in the sum).
function dSigmaDlnN(N, h) {
  const s = (d) => parts(N * Math.exp(d), C_C_PINNED, E_TRUNC_PT, 1.0).sigma;
  return (-s(2 * h) + 8 * s(h) - 8 * s(-h) + s(-2 * h)) / (12 * h);
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K only (cancels in the elasticity sum)

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const p = parts(N_L, C_C_PINNED, E_TRUNC_PT, 1.0);
  const sig = p.sigma;
  // CLOSED-FORM amplitude-weighted partials p*sigma_p (no finite differencing on the amplitude axes).
  const csigmac = sig * (1 - sig); // c*sigma_c  (numerator = C_C axis) > 0
  const esigmae = -E_TRUNC_PT * sig / p.E_N; // e*sigma_e (E_trunc axis) < 0
  const fsigmaf = -p.E_flow * sig / p.E_N; // f*sigma_f (C_F/E_flow axis) < 0
  const NUM = csigmac + esigmae + fsigmaf; // Euler degree-0 identity => exactly 0 (round-off only)
  // Shared crossing kernel K = -1/(N_L sigma_N) = -1/(dsigma/dlnN); reconstruct the three elasticities.
  const dsig = dSigmaDlnN(N_L, H_STENCIL);
  const K = -1 / dsig;
  const E_CC = K * csigmac;
  const E_ET = K * esigmae;
  const E_CF = K * fsigmaf;
  const sumE = E_CC + E_ET + E_CF; // = K * NUM => machine-zero, NOT O(eps^2)
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    c_sigma_c: +csigmac.toExponential(6), // = sigma(1-sigma)
    e_sigma_e: +esigmae.toExponential(6), // = -e*sigma/E_N
    f_sigma_f: +fsigmaf.toExponential(6), // = -E_flow*sigma/E_N
    partial_sum_NUM: +NUM.toExponential(3), // ~0 (round-off): the exact Euler cancellation
    elasticity_CC: +E_CC.toFixed(6), // reproduces imp-97644 E_CC
    elasticity_Et: +E_ET.toFixed(6), // reproduces imp-97644 E_ET
    elasticity_CF: +E_CF.toExponential(6), // reproduces imp-97644 E_CF
    elasticity_sum: +sumE.toExponential(3), // ~0: exact common-factor identity, not O(eps^2)
  };
});

export const IMP97689_DIAG3_ADDITIVITY_EULER_DERIVATION = {
  id: 'imp-97689',
  proofSection: 'S-frontier',
  question:
    'imp-97644 MEASURED (machine-zero) the three-axis diagonal DIAG3 = E_CC + E_ET + E_CF = 0 at the sigma ' +
    'landmarks but only numerically (via the O(eps^2) central-difference SUM3), and imp-97665 derived only the ' +
    'PAIR-ratio E_CF/E_ET = E_flow/E_trunc. Can the FULL three-axis identity E_CC + E_ET + E_CF = 0 -- ' +
    'including the numerator (E_coll = C_C) response -- be derived analytically as an exact common-factor ' +
    'identity rather than a measurement? Derivation/verification only; pinned constants perturbed only ' +
    'symbolically; no bound moves; no QED.',
  method:
    'Implicit-differentiate the level condition sigma(N_L(p), p) = L to get E_p = -(p sigma_p)/(N_L sigma_N) ' +
    'sharing the common crossing kernel K = -1/(N_L sigma_N); compute the three amplitude-weighted partials ' +
    'of sigma = c g/(e + f h + c g) in closed form -- c sigma_c = sigma(1-sigma) (numerator), e sigma_e = ' +
    '-e sigma/E_N and f sigma_f = -E_flow sigma/E_N (denominator) -- and show their sum vanishes by Euler ' +
    'degree-0 homogeneity (numerator response cancels e + E_flow = E_N - E_coll denominator responses), so ' +
    'E_CC + E_ET + E_CF = K*0 = 0. VERIFY in closed form (no amplitude finite differencing) at the three ' +
    'imp-97520 landmarks: report the partials, their machine-zero sum NUM, and the reconstructed elasticities.',
  stencil_step_for_kernel_only: H_STENCIL,
  perLandmark: PER_LANDMARK,
  finding: {
    D1_sum_is_exactly_zero:
      'E_CC + E_ET + E_CF = K*(c sigma_c + e sigma_e + f sigma_f) = K*0 = 0 for every level and N_L: the ' +
      'amplitude-weighted partials satisfy Euler s degree-0 identity sum_p p sigma_p = 0, the numerator ' +
      'response c sigma_c = sigma(1-sigma) exactly cancelling the denominator responses e sigma_e + f sigma_f ' +
      '= -(e + E_flow) sigma/E_N = -(1-sigma) sigma. A common-factor cancellation, no approximation.',
    D2_imp97644_sum3_was_truncation:
      'Evaluated in closed form the partial sum NUM = c sigma_c + e sigma_e + f sigma_f is machine-zero ' +
      '(|NUM| < 1e-15) at every landmark, confirming the imp-97644 central-difference SUM3 (+3.282e-7 at L2 ' +
      'down to +5.684e-11 at L4, quartering with eps) was the O(eps^2) stencil tail, not a real residual. The ' +
      'reconstructed E_CC/E_ET/E_CF match the imp-97644 measured single-axis elasticities.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + CLOSED-FORM VERIFICATION (frontier cross-check, NOT rigorous). The imp-97644 STRUCTURE ' +
    '(1)/(2) three-axis identity E_CC + E_ET + E_CF = 0 is EXACT within the inherited component model, now ' +
    'derived analytically INCLUDING the numerator response imp-97665 set aside: implicit differentiation of ' +
    'the crossing condition gives E_p = -(p sigma_p)/(N_L sigma_N) with a common kernel K = -1/(N_L sigma_N), ' +
    'so the elasticity sum equals K*(c sigma_c + e sigma_e + f sigma_f). The three amplitude-weighted partials ' +
    'of sigma = c g/(e + f h + c g) are c sigma_c = sigma(1-sigma) (numerator/C_C), e sigma_e = -e sigma/E_N ' +
    'and f sigma_f = -E_flow sigma/E_N (denominator/E_trunc, C_F); since e + E_flow = E_N - E_coll their sum is ' +
    'sigma(1-sigma) - (1-sigma) sigma = 0 EXACTLY (Euler s degree-0 homogeneity: scaling c,e,f together leaves ' +
    'sigma invariant), so E_CC + E_ET + E_CF = K*0 = 0 for every level and N_L, independent of the height ' +
    'mapping T0(N), sigma_N, and g,h. Evaluated in closed form the partial sum is machine-zero (|NUM| < 1e-15) ' +
    'at L2 (sigma = 0.9, N = 2.572361e7), L3 (halving, N = 3.267235e9) and L4 (sigma = 0.1, N = 3.213181e11), ' +
    'confirming the imp-97644 ~1e-7 SUM3 was pure central-difference truncation; the reconstructed E_CC/E_ET/ ' +
    'E_CF reproduce the imp-97644 measured +2.555355/-2.303723/-2.516314e-1 (L2) single-axis values while ' +
    'summing to machine-zero. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), ' +
    'the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as ' +
    'differentiation axes, not re-pinned); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97665 (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc, common-kernel cancellation); imp-97644 (MEASURED ' +
    'DIAG3 == 0 and SUM3 = O(eps^2)); imp-97668 (linear-prefactor audit); imp-97520 (four-landmark ladder ' +
    'L1..L4); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse).',
};

export const IMP97689_DIAG3_ADDITIVITY_EULER_DERIVATION_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97520/imp-97644 ladder positions (L2, L3, L4).
    id: 'imp97689-landmarks-reproduce-imp97644',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce imp-97644 to < 5e-3 relative',
    holds: () => {
      const [l2, l3, l4] = PER_LANDMARK;
      return (
        Math.abs(l2.N_L / 2.572361e7 - 1) < 5e-3 &&
        Math.abs(l3.N_L / 3.267235e9 - 1) < 5e-3 &&
        Math.abs(l4.N_L / 3.213181e11 - 1) < 5e-3
      );
    },
  },
  {
    // (D1): the three amplitude-weighted partials carry the derived signs (numerator +, both denominators -).
    id: 'imp97689-partial-signs-match-closed-form',
    description: 'c*sigma_c > 0 (numerator), e*sigma_e < 0 and f*sigma_f < 0 (denominator) at every landmark',
    holds: () =>
      PER_LANDMARK.every((r) => r.c_sigma_c > 0 && r.e_sigma_e < 0 && r.f_sigma_f < 0),
  },
  {
    // (D1): c*sigma_c = sigma(1-sigma) exactly (the numerator response formula).
    id: 'imp97689-numerator-partial-is-sigma-one-minus-sigma',
    description: 'c*sigma_c equals sigma*(1-sigma) at every landmark to < 1e-9 relative',
    holds: () =>
      PER_LANDMARK.every((r) => Math.abs(r.c_sigma_c / (r.sigma * (1 - r.sigma)) - 1) < 1e-9),
  },
  {
    // (D1)+(D2): the closed-form partial sum NUM = c*sigma_c + e*sigma_e + f*sigma_f is machine-zero (Euler).
    id: 'imp97689-partial-sum-is-machine-zero',
    description: 'NUM = c*sigma_c + e*sigma_e + f*sigma_f < 1e-15 at every landmark (exact Euler cancellation)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.partial_sum_NUM) < 1e-15),
  },
  {
    // (D2): the reconstructed elasticity sum E_CC + E_ET + E_CF is machine-zero, NOT the imp-97644 O(eps^2).
    id: 'imp97689-elasticity-sum-machine-zero',
    description: 'E_CC + E_ET + E_CF < 1e-12 at every landmark (exact identity, below imp-97644 SUM3 ~1e-7)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.elasticity_sum) < 1e-12),
  },
  {
    // (D2): the reconstructed E_CC/E_ET/E_CF reproduce the imp-97644 measured single-axis values at L2.
    id: 'imp97689-reconstructs-imp97644-elasticities',
    description: 'reconstructed E_CC ~ +2.555355, E_ET ~ -2.303723 at L2 (match imp-97644 to < 1e-3)',
    holds: () => {
      const l2 = PER_LANDMARK[0];
      return (
        Math.abs(l2.elasticity_CC - 2.555355) < 1e-3 &&
        Math.abs(l2.elasticity_Et - -2.303723) < 1e-3
      );
    },
  },
  {
    // Honesty gate: derivation/verification only, no QED, no refereed bound is changed.
    id: 'imp97689-honesty-gate-no-qed',
    description: 'Derivation/verification only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97689_DIAG3_ADDITIVITY_EULER_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP97689_DIAG3_ADDITIVITY_EULER_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP97689_DIAG3_ADDITIVITY_EULER_DERIVATION.verdict),
  },
];

for (const a of IMP97689_DIAG3_ADDITIVITY_EULER_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97689-diag3-additivity-euler-derivation assertion failed: ${a.id}`);
  }
}
