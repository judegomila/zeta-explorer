/**
 * @module imp-124851-diag3-degree2-coefficient-bound
 *
 * imp-124851 (proof/assessment, frontier quantification): imp-124812 named B1 -- each E_component being
 * DEGREE-1 in its own amplitude -- as the SOLE load-bearing hypothesis of the three-axis additivity
 * E_CC + E_ET + E_CF = 0 (equivalently DIAG3 == 0), verified numerically by the imp-97668 six-probe
 * amplitude audit but not proven. imp-124812 showed the EXTREME break (a fully quadratic c^2 numerator
 * makes the amplitude-partial sum become sigma(1-sigma) != 0); imp-124835 showed that a sufficiently
 * HIGH-order defect (m >= 3) can slip through the first-order audit. This leaf fills the QUANTITATIVE
 * gap for the ONE order the audit DOES catch -- the degree-2 (m = 2) departure -- by bounding how large
 * a second-order amplitude coefficient the imp-97668 measured linearity admits, and translating that
 * bound into the maximal DIAG3 residual (and the maximal finite-scaling homogeneity defect) it could
 * produce. Assessment/derivation only; the C_mb GUE-conditional per imp-486 is untouched; the pinned
 * constants appear only as symbolic differentiation axes; no bound moves; NO QED.
 *
 * THE DEGREE-2 DEPARTURE MODEL (a one-parameter deformation of the imp-97668 numerator)
 * -----------------------------------------------------------------------------------
 * Deform only the collision numerator by a degree-excess weight w, holding the baseline VALUE fixed:
 *   E_coll(N; c) = c * g(N) * (1 + w * (c/C0 - 1)),   g(N) = sqrt(log T0(N) / N),   C0 = C_C pinned.
 * At the baseline c = C0 the bracket is 1, so sigma is unchanged; but d ln E_coll / d ln c = 1 + w, so
 * the numerator carries the amplitude to effective power 1 + w. w = 0 is the true linear model; w = 1 is
 * the imp-124812 fully quadratic c^2 numerator. w is exactly the "second-order amplitude coefficient" --
 * the fraction of the numerator that scales quadratically with its amplitude.
 *
 * THE EXACT FIRST-ORDER LAW: DIAG3(w) = w * E_CC (and pointwise NUM(w) = w * sigma(1-sigma))
 * ----------------------------------------------------------------------------------------
 * Write sigma = u/(u+v) with numerator u = c*g and denominator remainder v = e + f*h (degree-1). Under
 * a JOINT amplitude rescaling (c,e,f) -> t*(c,e,f) with the degree-2 numerator, u -> t*u + O(w) and the
 * amplitude-scaling generator gives, pointwise at every N,
 *   NUM := c sigma_c + e sigma_e + f sigma_f = w * sigma(1-sigma) + O(w^2)
 * (the imp-124812 c^2 result is the w = 1 case, NUM = sigma(1-sigma)). The crossing diagonal is the
 * shared kernel K = -1/(N_L sigma_N) times NUM, and since the C_C crossing elasticity is itself
 * E_CC = K * sigma(1-sigma), the two kernels cancel exactly:
 *   DIAG3(w) = K * NUM = w * K * sigma(1-sigma) = w * E_CC.
 * So a degree-2 numerator fraction w produces a crossing diagonal of EXACTLY w times the (measured)
 * C_C elasticity -- verified here to < 1e-4 relative at all three imp-97520 landmarks, and the pure c^2
 * case (w = 1) reproduces DIAG3 = E_CC (+2.5554 / +2.1023 / +2.0790 at L2/L3/L4).
 *
 * THE BOUND: THE OBSERVED MACHINE-ZERO DIAG3 CONFINES w LINEARLY
 * -------------------------------------------------------------
 * Inverting DIAG3(w) = w * E_CC, the admissible degree-2 fraction is w_max = |DIAG3_observed| / E_CC.
 * The imp-97668 audit reports |DIAG3| at the machine-zero gate 1e-9, with a realized round-off residual
 * of 3.55e-12 at L2 and 0 at L3/L4. Hence:
 *   w_max (declared 1e-9 gate)   ~ 3.9e-10 (L2), 4.8e-10 (L3), 4.8e-10 (L4);
 *   w_max (realized round-off)   ~ 1.4e-12 (L2), <round-off (L3/L4).
 * Translating back, the maximal DIAG3 residual such a maximally-hidden degree-2 term produces is exactly
 * the floor it hides under (w_max * E_CC = the floor, by construction) -- i.e. the audit machine-zero IS
 * the degree-2 bound, saturated. In the INDEPENDENT observable of finite-scaling homogeneity, the
 * maximal defect sigma(t*amps) - sigma(amps) at t = 2 that an admissible w produces is only ~1e-10
 * (versus the ~0.05..0.17 collapse of the pure c^2 case), utterly negligible. The B1 hinge is thereby
 * QUANTIFIED: any degree-2 amplitude nonlinearity large enough to perturb the additivity at the 1e-9
 * level would require |w| > ~4e-10, an excess degree of at most four parts in ten billion.
 *
 * WHAT STAYS MEASUREMENT-ONLY (inherited imp-124812 boundary B)
 * ------------------------------------------------------------
 * The bound is a first-order (tangent) statement at the crossing: it caps the degree-2 (m = 2) mode,
 * the order the audit resolves, but does NOT cap the higher-order (m >= 3) modes that imp-124835 showed
 * evade the first-order audit -- only the symbolic monomial-degree argument (imp-124835 P1-P2) closes
 * those. The E_CC value, the landmark abscissae and the round-off floor are all measurement (only the
 * SUM E_CC + E_ET + E_CF is kernel-free). The pinned c = C_C, e = E_trunc, the imp-398 C_F prefactor,
 * the shapes g,h, the height map T0(N) and the C_mb GUE-conditional per imp-486 are inherited numerics.
 *
 * ASSESSMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the
 * imp-398 C_F prefactor are UNTOUCHED (appear only as symbolic axes); changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124812-diag3-additivity-exact-identity-assessment (B1 named; the w = 1 c^2 break)
 * @see imp-124835-degree1-hinge-audit-sufficiency-assessment (first-order audit misses m >= 3 decoys)
 * @see imp-97668-nonlinear-amplitude-audit (the six-probe audit; DIAG3 machine-zero gate 1e-9)
 * @see imp-97720-diag3-second-order-hessian (second-order structure; degree-0 forces only DIAG3)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97668/imp-124812 exactly
const C_C0 = C_C_PINNED; // C_C amplitude baseline (1/8 ansatz, imp-2642/imp-2643)

// The imp-97668 model with a degree-2 numerator deformation of weight w. Probe p = {ch, et, cf} are the
// multiplicative amplitude probes (baseline 1); w gives the numerator amplitude effective power 1 + w
// (w = 0 linear, w = 1 the imp-124812 c^2 numerator). At ch = 1 the bracket is 1 -> baseline preserved.
function parts(N, p, w) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const ch = p.ch ?? 1;
  const C_F = (p.cf ?? 1) * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C0 * ch * Math.sqrt(L / N) * (1 + w * (ch - 1)); // GUE-conditional, degree-excess w
  const E_trunc = (p.et ?? 1) * E_TRUNC_PT;
  const E_N = E_trunc + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll, E_trunc };
}

// Downslope crossing sigma = level (identical bisection to imp-97668).
function landmark(level, w) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), {}, w).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnCross = (level, p, w) => Math.log(landmarkWithProbe(level, p, w));
function landmarkWithProbe(level, p, w) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), p, w).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Crossing diagonal DIAG3: co-scale ch, et, cf together (central difference in the log-parameter).
function diag3(level, w, eps) {
  const up = { ch: Math.exp(eps), et: Math.exp(eps), cf: Math.exp(eps) };
  const dn = { ch: Math.exp(-eps), et: Math.exp(-eps), cf: Math.exp(-eps) };
  return (lnCross(level, up, w) - lnCross(level, dn, w)) / (2 * eps);
}
// Single-probe C_C crossing elasticity E_CC (ch alone) -- the slope the diagonal collapses onto.
function elasCC(level, w, eps) {
  const up = { ch: Math.exp(eps) };
  const dn = { ch: Math.exp(-eps) };
  return (lnCross(level, up, w) - lnCross(level, dn, w)) / (2 * eps);
}
// Pointwise amplitude-partial sum NUM = c sigma_c + e sigma_e + f sigma_f at fixed N (kernel-free).
function pointwiseNUM(N, w, eps) {
  const s = (p) => parts(N, p, w).sigma;
  const up = s({ ch: Math.exp(eps), et: Math.exp(eps), cf: Math.exp(eps) });
  const dn = s({ ch: Math.exp(-eps), et: Math.exp(-eps), cf: Math.exp(-eps) });
  return (up - dn) / (2 * eps);
}
// Finite-t homogeneity defect sigma(t*amps) - sigma(amps) at a fixed N (an INDEPENDENT observable).
function homogDefect(N, w, t) {
  const base = parts(N, {}, w).sigma;
  const scaled = parts(N, { ch: t, et: t, cf: t }, w).sigma;
  return scaled - base;
}

const EPS = 1e-3; // the imp-97668 audit step
const DIAG3_GATE = 1e-9; // the imp-97668 declared machine-zero detection gate
const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, 0);
  const E_CC = elasCC(sigma, 0, EPS); // measured C_C crossing elasticity (the slope)
  const diag3_pure_c2 = diag3(sigma, 1.0, EPS); // w = 1 imp-124812 case -> should equal E_CC
  const slope = (diag3(sigma, 1e-3, EPS) - diag3(sigma, 0, EPS)) / 1e-3; // dDIAG3/dw -> E_CC
  const realized_floor = Math.abs(diag3(sigma, 0, EPS)); // true-model round-off residual
  const num_small = pointwiseNUM(N_L, 0.01, 1e-6); // NUM at w = 0.01
  const num_pred = 0.01 * sigma * (1 - sigma); // predicted w * sigma(1-sigma)
  const w_max_gate = DIAG3_GATE / Math.abs(slope); // admissible degree-2 fraction under the 1e-9 gate
  const w_max_realized = realized_floor / Math.abs(slope); // under the realized round-off floor
  const defect_pure_c2_t2 = homogDefect(N_L, 1.0, 2); // finite-t defect of the pure c^2 numerator
  const defect_wmax_t2 = homogDefect(N_L, w_max_gate, 2); // finite-t defect of the admissible w_max
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    E_CC: +E_CC.toFixed(6),
    diag3_slope_dDIAG3_dw: +slope.toFixed(6), // == E_CC: DIAG3(w) = w * E_CC
    slope_matches_ECC_reldiff: +Math.abs(slope / E_CC - 1).toExponential(3),
    diag3_pure_c2_w1: +diag3_pure_c2.toFixed(6), // == E_CC (imp-124812 w = 1)
    pure_c2_matches_ECC_reldiff: +Math.abs(diag3_pure_c2 / E_CC - 1).toExponential(3),
    pointwise_NUM_w0p01: +num_small.toExponential(6),
    pointwise_NUM_matches_w_sigma_reldiff: +Math.abs(num_small / num_pred - 1).toExponential(3),
    realized_diag3_floor: +realized_floor.toExponential(3),
    w_max_declared_1e9_gate: +w_max_gate.toExponential(3),
    w_max_realized_roundoff: +w_max_realized.toExponential(3),
    finite_t_defect_pure_c2_t2: +defect_pure_c2_t2.toExponential(3),
    finite_t_defect_wmax_t2: +defect_wmax_t2.toExponential(3),
  };
});

const MAX_SLOPE_RELDIFF = Math.max(...PER_LANDMARK.map((r) => r.slope_matches_ECC_reldiff));
const MAX_W_MAX_GATE = Math.max(...PER_LANDMARK.map((r) => r.w_max_declared_1e9_gate));
const MAX_DEFECT_WMAX = Math.max(...PER_LANDMARK.map((r) => Math.abs(r.finite_t_defect_wmax_t2)));

export const IMP124851_DIAG3_DEGREE2_COEFFICIENT_BOUND = {
  id: 'imp-124851',
  proofSection: 'S-frontier',
  question:
    'imp-124812 B1 names the linear-prefactor (degree-1-in-amplitude) structure as the sole load-bearing ' +
    'hypothesis of E_CC + E_ET + E_CF = 0, verified by the imp-97668 six-probe audit but not proven; ' +
    'imp-124812 showed the fully quadratic c^2 break and imp-124835 showed high-order (m >= 3) decoys ' +
    'evade the first-order audit. For the ONE order the audit resolves -- the degree-2 (m = 2) departure ' +
    '-- how large a second-order amplitude coefficient does the measured linearity admit, and what is the ' +
    'maximal DIAG3 residual (and finite-scaling homogeneity defect) it could produce? Assessment only; ' +
    'pinned constants as symbolic axes; no bound moves; no QED.',
  method:
    'Deform only the collision numerator by a degree-excess weight w: E_coll = c*g*(1 + w*(c/C0 - 1)), so ' +
    'd ln E_coll/d ln c = 1 + w (w = 0 linear, w = 1 the imp-124812 c^2 case) with the baseline value ' +
    'preserved. Derive and numerically confirm the exact first-order law DIAG3(w) = w * E_CC (crossing) ' +
    'and NUM(w) = w * sigma(1-sigma) (pointwise) at the three imp-97520 landmarks, then invert the ' +
    'measured DIAG3 machine-zero (declared gate 1e-9; realized round-off 3.55e-12 at L2, 0 at L3/L4) to ' +
    'bound w_max = |DIAG3_observed|/E_CC, and translate w_max into the maximal DIAG3 residual (the floor ' +
    'itself, saturated) and the maximal finite-t homogeneity defect sigma(t*amps) - sigma(amps) at t = 2.',
  audit_step_eps: EPS,
  diag3_machine_zero_gate: DIAG3_GATE,
  perLandmark: PER_LANDMARK,
  max_slope_matches_ECC_reldiff: +MAX_SLOPE_RELDIFF.toExponential(3),
  max_w_max_declared_gate: +MAX_W_MAX_GATE.toExponential(3),
  max_finite_t_defect_of_wmax: +MAX_DEFECT_WMAX.toExponential(3),
  finding: {
    exact_first_order_law:
      'A degree-2 numerator fraction w produces the EXACT crossing diagonal DIAG3(w) = w * E_CC and the ' +
      'pointwise partial sum NUM(w) = w * sigma(1-sigma): the shared crossing kernel K = -1/(N_L sigma_N) ' +
      'cancels because E_CC = K*sigma(1-sigma) itself. Confirmed to < ' + MAX_SLOPE_RELDIFF.toExponential(3) +
      ' relative at L2/L3/L4, with the pure c^2 case (w = 1) reproducing DIAG3 = E_CC (imp-124812).',
    admissible_coefficient_bound:
      'Inverting DIAG3(w) = w * E_CC, the measured machine-zero confines the degree-2 fraction to ' +
      'w_max = |DIAG3_observed|/E_CC: ~3.9e-10 (L2), 4.8e-10 (L3), 4.8e-10 (L4) under the declared 1e-9 ' +
      'gate, and ~1.4e-12 (L2, below round-off at L3/L4) under the realized round-off floor. An excess ' +
      'degree of at most four parts in ten billion.',
    translated_maximal_residual:
      'The maximal DIAG3 residual such a maximally-hidden degree-2 term produces is exactly the floor it ' +
      'hides under (w_max * E_CC = the floor, by construction) -- the audit machine-zero IS the saturated ' +
      'degree-2 bound. In the independent observable of finite-scaling homogeneity, the maximal defect ' +
      'sigma(t*amps) - sigma(amps) at t = 2 that an admissible w produces is only ' +
      MAX_DEFECT_WMAX.toExponential(3) + ' (vs the ~0.05..0.17 collapse of the pure c^2 case): negligible.',
    measurement_only_residual:
      'The bound is a first-order (tangent) crossing statement: it caps the degree-2 (m = 2) mode but not ' +
      'the higher-order (m >= 3) modes that imp-124835 showed evade the first-order audit (only the ' +
      'symbolic monomial-degree argument closes those). E_CC, the landmarks and the round-off floor are ' +
      'measurement; the pinned c=C_C, e=E_trunc, imp-398 C_F prefactor, g,h,T0(N) and the C_mb ' +
      'GUE-conditional per imp-486 are inherited numerics.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT + QUANTIFICATION (frontier, NOT rigorous). For the degree-2 (m = 2) amplitude departure -- ' +
    'the one order the imp-97668 first-order six-probe audit resolves -- deforming the collision numerator ' +
    'by a degree-excess weight w (E_coll = c*g*(1 + w*(c/C0 - 1)), so d ln E_coll/d ln c = 1 + w, baseline ' +
    'value preserved) yields the EXACT first-order law DIAG3(w) = w * E_CC (crossing) and NUM(w) = ' +
    'w * sigma(1-sigma) (pointwise): the shared crossing kernel cancels because E_CC = K*sigma(1-sigma), ' +
    'confirmed to < ' + MAX_SLOPE_RELDIFF.toExponential(3) + ' relative at all three imp-97520 landmarks ' +
    'with the pure c^2 case (w = 1) reproducing DIAG3 = E_CC (+2.5554/+2.1023/+2.0790, the imp-124812 ' +
    'break). Inverting, the measured DIAG3 machine-zero confines the degree-2 fraction to ' +
    'w_max = |DIAG3_observed|/E_CC: ~3.9e-10 (L2), 4.8e-10 (L3), 4.8e-10 (L4) under the declared 1e-9 ' +
    'gate, and ~1.4e-12 (L2; below round-off at L3/L4) under the realized round-off floor -- an excess ' +
    'degree of at most four parts in ten billion. The maximal DIAG3 residual such a maximally-hidden term ' +
    'produces is exactly the floor it hides under (w_max * E_CC = floor, saturated: the audit machine-zero ' +
    'IS the degree-2 bound), and its maximal finite-scaling homogeneity defect sigma(t*amps) - sigma(amps) ' +
    'at t = 2 is only ' + MAX_DEFECT_WMAX.toExponential(3) + ' versus the ~0.05..0.17 collapse of the pure ' +
    'c^2 numerator: negligible. This QUANTIFIES the B1 hinge for the resolved order; it does NOT cap the ' +
    'higher-order (m >= 3) modes imp-124835 showed evade the first-order audit -- only the symbolic ' +
    'monomial-degree argument closes those. Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the pinned constants appear only as ' +
    'symbolic differentiation axes, not re-pinned; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124812 (B1 sole hinge; the w = 1 c^2 break gives NUM = sigma(1-sigma)); imp-124835 (first-order ' +
    'audit misses m >= 3 decoys; symbolic monomial-degree proof); imp-97668 (six-probe audit; DIAG3 ' +
    'machine-zero gate 1e-9, E_CC = +2.5554/+2.1023/+2.0790); imp-97720 (second-order Hessian); imp-97689 ' +
    '(Euler degree-0 -> DIAG3 == 0); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip ' +
    'route); imp-398 (C_F prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP124851_DIAG3_DEGREE2_COEFFICIENT_BOUND_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97668/imp-97520 ladder positions (L2, L3, L4).
    id: 'imp124851-landmarks-reproduce-imp97668',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce imp-97668 to < 5e-3 relative',
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
    // Core law: DIAG3(w) = w * E_CC -- the diagonal slope in w equals the measured C_C elasticity.
    id: 'imp124851-diag3-slope-equals-ECC',
    description: 'dDIAG3/dw == E_CC at every landmark (DIAG3(w) = w*E_CC, reldiff < 1e-4)',
    holds: () => PER_LANDMARK.every((r) => r.slope_matches_ECC_reldiff < 1e-4),
  },
  {
    // The pure c^2 case (w = 1, imp-124812) reproduces DIAG3 = E_CC exactly.
    id: 'imp124851-pure-c2-equals-ECC',
    description: 'the w=1 (imp-124812 c^2) diagonal equals E_CC at every landmark (reldiff < 1e-4)',
    holds: () => PER_LANDMARK.every((r) => r.pure_c2_matches_ECC_reldiff < 1e-4),
  },
  {
    // Pointwise: NUM(w) = w * sigma(1-sigma) (kernel-free), consistent with the imp-124812 core.
    id: 'imp124851-pointwise-num-equals-w-sigma',
    description: 'pointwise NUM(w) == w*sigma(1-sigma) at every landmark (reldiff < 1e-4)',
    holds: () => PER_LANDMARK.every((r) => r.pointwise_NUM_matches_w_sigma_reldiff < 1e-4),
  },
  {
    // The admissible degree-2 fraction under the declared 1e-9 gate is O(1e-10) at every landmark.
    id: 'imp124851-wmax-gate-order-1e-10',
    description: 'w_max under the 1e-9 gate is between 1e-10 and 1e-9 at every landmark (four parts in ~1e10)',
    holds: () =>
      PER_LANDMARK.every((r) => r.w_max_declared_1e9_gate > 1e-10 && r.w_max_declared_1e9_gate < 1e-9),
  },
  {
    // Translation: an admissible w_max is grossly non-homogeneity-defect-free at finite t (negligible),
    // whereas the pure c^2 numerator collapses sigma by > 1e-2 at t = 2.
    id: 'imp124851-wmax-finite-t-defect-negligible',
    description: 'finite-t defect of w_max is < 1e-8 while the pure c^2 defect exceeds 1e-2 at t=2',
    holds: () =>
      PER_LANDMARK.every(
        (r) => Math.abs(r.finite_t_defect_wmax_t2) < 1e-8 && Math.abs(r.finite_t_defect_pure_c2_t2) > 1e-2,
      ),
  },
  {
    // Honesty gate: assessment only, no QED, PT stays SOTA.
    id: 'imp124851-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124851_DIAG3_DEGREE2_COEFFICIENT_BOUND.isRigorous === false &&
      /NO QED/.test(IMP124851_DIAG3_DEGREE2_COEFFICIENT_BOUND.verdict) &&
      /remains SOTA/.test(IMP124851_DIAG3_DEGREE2_COEFFICIENT_BOUND.verdict),
  },
];

for (const a of IMP124851_DIAG3_DEGREE2_COEFFICIENT_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124851-diag3-degree2-coefficient-bound assertion failed: ${a.id}`);
  }
}
