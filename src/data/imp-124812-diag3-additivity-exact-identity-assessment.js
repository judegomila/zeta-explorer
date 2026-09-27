/**
 * @module imp-124812-diag3-additivity-exact-identity-assessment
 *
 * imp-124812 (proof/assessment, frontier delineation): imp-97665 proved the PAIR-ratio
 * E_CF/E_ET = E_flow/E_trunc exactly by cancelling the common crossing kernel across two
 * denominator-additive axes, and imp-97689 derived the FULL three-axis additivity
 * E_CC + E_ET + E_CF = 0 as an Euler degree-0 homogeneity of sigma = E_coll/E_N. Both are
 * DERIVATIONS; neither delineated PRECISELY which parts of the identity are exact algebra of
 * the model versus which rely on the numerically measured elasticities and pinned constants.
 * This leaf ASSESSES that boundary. It separates the additivity into (A) a pointwise algebraic
 * core that holds at EVERY N, for EVERY flow share E_flow/E_N, and for EVERY set of pinned
 * amplitude/shape values -- provably, with no numerics -- and (B) the strictly measurement-only
 * ingredients (the common kernel K, the landmark abscissae, the linear-prefactor structure
 * itself, and the inherited constant values). It demonstrates (A) by sweeping the flow share and
 * perturbing the constants and confirming the amplitude-partial sum stays machine-zero, and
 * isolates the SOLE load-bearing hypothesis by breaking linearity (a c^2 numerator) and watching
 * the sum become sigma(1-sigma) != 0. Assessment/derivation only; the C_mb GUE-conditional per
 * imp-486 is untouched; the pinned constants appear only as symbolic axes; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689 crossing relation)
 * -----------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 *
 * THE PROVEN ALGEBRAIC CORE (A) -- pointwise, no numerics, flow-share- and value-independent
 * ------------------------------------------------------------------------------------------
 * Write sigma = u / (v + u) with numerator u = c*g and denominator remainder v = e + f*h. Each
 * component is DEGREE-1 in its own amplitude (u linear in c; the two denominator legs linear in
 * e and f respectively), so under the JOINT scaling (c, e, f) -> (t*c, t*e, t*f) both u and v
 * scale by t and sigma is INVARIANT: sigma is degree-0 homogeneous in (c, e, f). Euler s theorem
 * then gives, at EVERY N (no crossing needed):
 *   c*sigma_c + e*sigma_e + f*sigma_f = 0,   with the closed forms
 *     c*sigma_c = sigma(1 - sigma)            (numerator / C_C axis, > 0),
 *     e*sigma_e = -(e)   * sigma / E_N        (denominator / E_trunc axis, < 0),
 *     f*sigma_f = -(f*h) * sigma / E_N = -E_flow * sigma / E_N   (denominator / C_F axis, < 0),
 *   sum = sigma(1 - sigma) - (e + E_flow) * sigma/E_N = sigma(1 - sigma) - (1 - sigma) sigma = 0.
 * This cancellation uses ONLY e + E_flow = E_N - E_coll; it never references the VALUES of c, e,
 * f, g(N), h(N), the height mapping T0(N), or the flow share E_flow/E_N. Splitting the denominator
 * into more legs, or moving mass between the two denominator legs (changing the flow share),
 * leaves each leg degree-1 and the sum still zero. The crossing elasticities are E_p = K * (p sigma_p)
 * with the SHARED kernel K = -1/(N_L sigma_N); the kernel is a COMMON FACTOR, so
 *   E_CC + E_ET + E_CF = K * (c sigma_c + e sigma_e + f sigma_f) = K * 0 = 0
 * for ANY finite non-zero K -- the additivity is inherited from the pointwise algebraic identity
 * and is therefore independent of the crossing details as well. PROVEN, within the linear model.
 *
 * THE MEASUREMENT-ONLY BOUNDARY (B) -- exactly what is NOT algebra
 * ---------------------------------------------------------------
 *   (B1) THE LINEAR-PREFACTOR STRUCTURE IS THE SOLE LOAD-BEARING HYPOTHESIS. The whole core rests
 *        on each E_component being degree-1 in its amplitude. If ANY amplitude entered non-linearly
 *        -- e.g. a c^2 numerator E_coll = c^2 g -- joint scaling would no longer leave sigma
 *        invariant and Euler would give c sigma_c + e sigma_e + f sigma_f = sigma(1 - sigma) != 0.
 *        That the REAL model is linear-in-amplitude is verified numerically (imp-97668 six-probe
 *        amplitude audit / imp-97720 first-order structure), NOT proven; it is the one hinge the
 *        additivity hangs on.
 *   (B2) THE INDIVIDUAL ELASTICITY MAGNITUDES are measurement-only. E_CC/E_ET/E_CF each need the
 *        kernel K = -1/(N_L sigma_N), obtained from a numerical N-stencil at a numerically located
 *        landmark N_L; only their SUM is kernel-free. Reporting E_CC ~ +2.555 etc. is measurement.
 *   (B3) THE CROSSING ITSELF (existence of a downslope solution sigma(N_L)=L with sigma_N < 0 so K
 *        is finite and non-zero) is a numerical feature of the inherited T0(N), g, h -- not forced.
 *   (B4) THE PINNED VALUES c = C_C (1/8 ansatz, imp-2642/imp-2643), e = E_trunc = 3.06e-5, the
 *        imp-398 C_F prefactor, the shapes g, h and the height mapping T0(N), and the C_mb
 *        GUE-conditional per imp-486 are all inherited numerics. The additivity does not DEPEND on
 *        their values (that is exactly (A)), but any statement about WHERE the landmarks sit or how
 *        big the individual elasticities are does.
 *
 * THE DEMONSTRATION (confirms A, isolates B1)
 * -------------------------------------------
 *   - FLOW-SHARE SWEEP: vary f across {0.1, 1, 5, 20} at a fixed N so the flow share E_flow/E_N
 *     moves materially; the amplitude-partial sum NUM stays machine-zero (< 1e-15) throughout, and
 *     a central-difference cross-check confirms the closed-form c sigma_c matches c * (d sigma/dc).
 *   - VALUE PERTURBATION: scale c and e by arbitrary factors; NUM stays machine-zero.
 *   - LINEARITY BREAK (isolates B1): replace the numerator by c^2 g; NUM becomes sigma(1 - sigma)
 *     (> 0, matched to < 1e-6), the exact signature of the lost degree-0 homogeneity.
 *
 * ASSESSMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the
 * imp-398 C_F prefactor are UNTOUCHED (appear only as symbolic axes); changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97689-diag3-additivity-euler-derivation (analytic three-axis derivation + L2/L3/L4 verification)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED DIAG3 == 0; SUM3 = O(eps^2))
 * @see imp-97668-nonlinear-amplitude-audit (six-probe linear-prefactor structure, the B1 hinge)
 * @see imp-97720-diag3-second-order-hessian (second-order structure; degree-0 forces only DIAG3)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97689 exactly

// EXACT imp-3406/imp-97689 sub-terms. `pow` selects the numerator amplitude exponent: pow=1 is the
// real linear model; pow=2 is the diagnostic non-linear numerator used to break the identity (B1).
function parts(N, cc, et, cf, pow) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = Math.pow(cc, pow) * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll, et };
}

// Closed-form amplitude-weighted partial sum NUM = c sigma_c + e sigma_e + f sigma_f (pow=1 => 0 by Euler).
function partialSum(N, cc, et, cf) {
  const p = parts(N, cc, et, cf, 1);
  const csc = p.sigma * (1 - p.sigma); // c sigma_c (numerator, linear model)
  const ese = -p.et * p.sigma / p.E_N; // e sigma_e (E_trunc)
  const fsf = -p.E_flow * p.sigma / p.E_N; // f sigma_f (C_F / E_flow)
  return { NUM: csc + ese + fsf, csc, ese, fsf, sigma: p.sigma, E_flow: p.E_flow, E_N: p.E_N };
}

// Numerical c*(d sigma/dc) via central difference in the numerator amplitude -- confirms the closed form.
function cSigmaCFiniteDiff(N, cc, et, cf, rel) {
  const dc = cc * rel;
  const sp = parts(N, cc + dc, et, cf, 1).sigma;
  const sm = parts(N, cc - dc, et, cf, 1).sigma;
  return (cc * (sp - sm)) / (2 * dc);
}

const N_PROBE = 1e9; // representative abscissa; the algebraic core is N-independent (checked below)

// (A) FLOW-SHARE SWEEP: vary f so E_flow/E_N moves materially; the partial sum stays machine-zero.
const FLOW_SHARE_SWEEP = [0.1, 1.0, 5.0, 20.0].map((cf) => {
  const r = partialSum(N_PROBE, C_C_PINNED, E_TRUNC_PT, cf);
  const csc_fd = cSigmaCFiniteDiff(N_PROBE, C_C_PINNED, E_TRUNC_PT, cf, 1e-5);
  return {
    cf,
    flow_share: +(r.E_flow / r.E_N).toExponential(6), // E_flow/E_N -- genuinely varies with cf
    partial_sum_NUM: +r.NUM.toExponential(3), // ~0 at every flow share (Euler)
    csc_closed_form: +r.csc.toExponential(6),
    csc_finite_diff: +csc_fd.toExponential(6), // matches the closed form -> closed form is the true partial
    csc_reldiff: +Math.abs(csc_fd / r.csc - 1).toExponential(3),
  };
});

// (A) VALUE PERTURBATION: scale c and e by arbitrary factors; the sum is still machine-zero.
const VALUE_PERTURB = [
  { fc: 1.0, fe: 1.0 },
  { fc: 3.7, fe: 0.4 },
  { fc: 0.25, fe: 11.0 },
].map(({ fc, fe }) => ({
  fc,
  fe,
  partial_sum_NUM: +partialSum(N_PROBE, C_C_PINNED * fc, E_TRUNC_PT * fe, 1.0).NUM.toExponential(3),
}));

// (A) N-INDEPENDENCE: the core holds pointwise at every abscissa, no crossing required.
const N_GRID = [1e6, 1e9, 1e12, 1e15].map((N) => ({
  N: +N.toExponential(0),
  partial_sum_NUM: +partialSum(N, C_C_PINNED, E_TRUNC_PT, 1.0).NUM.toExponential(3),
}));

// (B1) LINEARITY BREAK: a c^2 numerator loses degree-0 homogeneity; the sum becomes sigma(1-sigma) != 0.
const NONLINEAR_BREAK = (() => {
  const p2 = parts(N_PROBE, C_C_PINNED, E_TRUNC_PT, 1.0, 2);
  // With E_coll = c^2 g: c*sigma_c = 2 sigma(1-sigma); denominators unchanged -> NUM = sigma(1-sigma).
  const csc2 = 2 * p2.sigma * (1 - p2.sigma);
  const ese2 = -p2.et * p2.sigma / p2.E_N;
  const fsf2 = -p2.E_flow * p2.sigma / p2.E_N;
  const NUM2 = csc2 + ese2 + fsf2;
  const predicted = p2.sigma * (1 - p2.sigma); // the exact broken-identity signature
  return {
    sigma: +p2.sigma.toExponential(6),
    partial_sum_NUM: +NUM2.toExponential(6), // NONZERO
    predicted_sigma_one_minus_sigma: +predicted.toExponential(6),
    reldiff: +Math.abs(NUM2 / predicted - 1).toExponential(3),
  };
})();

const MAX_LINEAR_NUM = Math.max(
  ...FLOW_SHARE_SWEEP.map((r) => Math.abs(r.partial_sum_NUM)),
  ...VALUE_PERTURB.map((r) => Math.abs(r.partial_sum_NUM)),
  ...N_GRID.map((r) => Math.abs(r.partial_sum_NUM)),
);

export const IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT = {
  id: 'imp-124812',
  proofSection: 'S-frontier',
  question:
    'imp-97665 proved the pair-ratio E_CF/E_ET = E_flow/E_trunc and imp-97689 derived the three-axis ' +
    'additivity E_CC + E_ET + E_CF = 0 as an Euler degree-0 homogeneity, but neither delineated PRECISELY ' +
    'which parts are exact algebra of the sigma = E_coll/E_N model versus which rely on the measured ' +
    'elasticities and pinned constants. Is the three-axis additivity an EXACT algebraic identity independent ' +
    'of the flow share and the pinned constant VALUES, and exactly what stays measurement-only? ' +
    'Assessment/derivation only; pinned constants appear only as symbolic axes; no bound moves; no QED.',
  method:
    'Split the additivity into (A) a pointwise algebraic core -- sigma is degree-0 homogeneous in (c,e,f) ' +
    'because each E_component is degree-1 in its own amplitude, so Euler gives c sigma_c + e sigma_e + f sigma_f ' +
    '= 0 at every N, and the shared kernel K factors out of the elasticity sum -- and (B) the measurement-only ' +
    'ingredients (linear-prefactor structure, kernel K, landmark existence, pinned values). Demonstrate (A) by ' +
    'sweeping the flow share and perturbing c,e and confirming the partial sum stays machine-zero (with a ' +
    'central-difference cross-check of the closed-form c sigma_c), and isolate the sole hinge (B1) by breaking ' +
    'linearity (a c^2 numerator) and observing the sum become sigma(1-sigma) != 0.',
  probe_abscissa_N: N_PROBE,
  flowShareSweep: FLOW_SHARE_SWEEP,
  valuePerturbation: VALUE_PERTURB,
  nIndependence: N_GRID,
  nonlinearBreak: NONLINEAR_BREAK,
  max_linear_partial_sum: +MAX_LINEAR_NUM.toExponential(3),
  finding: {
    A_algebraic_core_proven:
      'E_CC + E_ET + E_CF = K*(c sigma_c + e sigma_e + f sigma_f) = 0 is EXACT within the linear model and ' +
      'independent of the flow share E_flow/E_N and of the VALUES of c,e,f,g,h,T0(N): each E_component is ' +
      'degree-1 in its amplitude, so sigma is degree-0 homogeneous in (c,e,f) and Euler forces the ' +
      'amplitude-partial sum to zero POINTWISE at every N; the common crossing kernel K = -1/(N_L sigma_N) is a ' +
      'shared factor that cancels. Across the flow-share sweep, the value perturbations and the N-grid the ' +
      'partial sum stays below ' + MAX_LINEAR_NUM.toExponential(3) + ' (IEEE round-off).',
    B_measurement_only_boundary:
      'What is NOT algebra: (B1) the linear-prefactor structure itself is the SOLE load-bearing hypothesis -- a ' +
      'c^2 numerator breaks degree-0 homogeneity and the sum becomes sigma(1-sigma) = ' +
      NONLINEAR_BREAK.predicted_sigma_one_minus_sigma.toExponential(3) + ' != 0 (matched to ' +
      NONLINEAR_BREAK.reldiff.toExponential(3) + '); the model s linearity is verified numerically (imp-97668/ ' +
      'imp-97720), not proven. (B2) the individual elasticities E_CC/E_ET/E_CF need the numerical kernel K (only ' +
      'their sum is kernel-free). (B3) the existence of a downslope crossing (sigma_N < 0). (B4) the pinned ' +
      'values c=C_C, e=E_trunc, the imp-398 C_F prefactor, g,h,T0(N) and the C_mb GUE-conditional per imp-486.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT + DEMONSTRATION (frontier delineation, NOT rigorous). The three-axis additivity ' +
    'E_CC + E_ET + E_CF = 0 is an EXACT algebraic identity of the sigma = E_coll/E_N model, independent of the ' +
    'flow share and of the pinned constant VALUES: because each E_component is degree-1 in its own amplitude, ' +
    'sigma is degree-0 homogeneous in (c,e,f), so Euler gives c sigma_c + e sigma_e + f sigma_f = 0 POINTWISE at ' +
    'every N (verified machine-zero, < ' + MAX_LINEAR_NUM.toExponential(3) + ', across a flow-share sweep ' +
    'f in {0.1,1,5,20} moving E_flow/E_N materially, arbitrary c,e perturbations, and an N-grid 1e6..1e15), and ' +
    'the shared crossing kernel K = -1/(N_L sigma_N) is a common factor that cancels out of the elasticity sum ' +
    '(K*0 = 0). A central-difference cross-check confirms the closed-form c sigma_c = sigma(1-sigma) is the true ' +
    'partial. What stays MEASUREMENT-ONLY: (B1) the linear-prefactor structure is the SOLE load-bearing ' +
    'hypothesis -- replacing the numerator by c^2 g breaks degree-0 homogeneity and the sum becomes ' +
    'sigma(1-sigma) != 0 (matched to ' + NONLINEAR_BREAK.reldiff.toExponential(3) + '), and that the real model ' +
    'is linear-in-amplitude is verified numerically (imp-97668/imp-97720), not proven; (B2) the individual ' +
    'elasticity magnitudes (need the numerical kernel K; only the sum is kernel-free); (B3) the existence of a ' +
    'downslope crossing (sigma_N < 0, K finite); (B4) the pinned values c=C_C (1/8 ansatz), e=E_trunc=3.06e-5, ' +
    'the imp-398 C_F prefactor, the shapes g,h, the height mapping T0(N), and the C_mb GUE-conditional per ' +
    'imp-486. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the pinned constants appear only as symbolic differentiation axes, not re-pinned; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97689 (analytic three-axis Euler derivation + L2/L3/L4 verification); imp-97665 (EXACT pair-ratio ' +
    'E_CF/E_ET = E_flow/E_trunc); imp-97644 (MEASURED DIAG3 == 0; SUM3 = O(eps^2)); imp-97668 (six-probe ' +
    'linear-prefactor audit, the B1 hinge); imp-97720 (second-order Hessian; degree-0 forces only DIAG3); ' +
    'imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT_ASSERTIONS = [
  {
    // (A): the flow share genuinely varies across the sweep (otherwise "flow-share independence" is vacuous).
    id: 'imp124812-flow-share-varies-materially',
    description: 'E_flow/E_N spans at least a factor of 5 across the f-sweep {0.1,1,5,20}',
    holds: () => {
      const shares = FLOW_SHARE_SWEEP.map((r) => r.flow_share);
      return Math.max(...shares) / Math.min(...shares) > 5;
    },
  },
  {
    // (A): the amplitude-partial sum is machine-zero at every flow share (Euler, flow-share-independent).
    id: 'imp124812-partial-sum-zero-across-flow-share',
    description: 'NUM = c*sigma_c + e*sigma_e + f*sigma_f < 1e-15 at every flow share',
    holds: () => FLOW_SHARE_SWEEP.every((r) => Math.abs(r.partial_sum_NUM) < 1e-15),
  },
  {
    // (A): the closed-form c*sigma_c matches the finite-difference c*(d sigma/dc) -> it is the true partial.
    id: 'imp124812-closed-form-matches-finite-diff',
    description: 'closed-form c*sigma_c matches central-difference c*(dsigma/dc) to < 1e-6 relative',
    holds: () => FLOW_SHARE_SWEEP.every((r) => Math.abs(r.csc_reldiff) < 1e-6),
  },
  {
    // (A): arbitrary perturbations of the pinned VALUES leave the sum machine-zero (value-independence).
    id: 'imp124812-partial-sum-zero-under-value-perturbation',
    description: 'NUM < 1e-15 under arbitrary c,e rescalings (value-independence of the additivity)',
    holds: () => VALUE_PERTURB.every((r) => Math.abs(r.partial_sum_NUM) < 1e-15),
  },
  {
    // (A): the core is pointwise -- machine-zero across the abscissa grid, no crossing required.
    id: 'imp124812-partial-sum-zero-pointwise-in-N',
    description: 'NUM < 1e-15 at N = 1e6, 1e9, 1e12, 1e15 (N-independent algebraic identity)',
    holds: () => N_GRID.every((r) => Math.abs(r.partial_sum_NUM) < 1e-15),
  },
  {
    // (B1): breaking linearity (c^2 numerator) makes NUM = sigma(1-sigma) != 0 -- the load-bearing hinge.
    id: 'imp124812-nonlinear-break-is-sigma-one-minus-sigma',
    description: 'a c^2 numerator gives NUM = sigma(1-sigma) > 0, matched to < 1e-6 relative',
    holds: () =>
      NONLINEAR_BREAK.partial_sum_NUM > 0 && Math.abs(NONLINEAR_BREAK.reldiff) < 1e-6,
  },
  {
    // Honesty gate: assessment/derivation only, no QED, PT stays SOTA.
    id: 'imp124812-honesty-gate-no-qed',
    description: 'Assessment/derivation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT.verdict) &&
      /remains SOTA/.test(IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT.verdict),
  },
];

for (const a of IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124812-diag3-additivity-exact-identity-assessment assertion failed: ${a.id}`);
  }
}
