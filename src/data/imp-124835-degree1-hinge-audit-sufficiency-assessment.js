/**
 * @module imp-124835-degree1-hinge-audit-sufficiency-assessment
 *
 * imp-124835 (proof/assessment, frontier delineation): imp-124812 B1 identifies the linear-prefactor
 * structure -- each E_component being DEGREE-1 in its own amplitude -- as the SOLE load-bearing
 * hypothesis behind the three-axis additivity E_CC + E_ET + E_CF = 0 (equivalently DIAG3 == 0). That
 * hinge is verified numerically by the imp-97668 SIX-PROBE amplitude audit but explicitly NOT proven.
 * This leaf ASSESSES a precise logical question: does the six-probe audit LOGICALLY ESTABLISH degree-0
 * homogeneity of sigma = E_coll/E_N in the amplitudes (c, e, f), or does it only rule out specific
 * (low-order, local) nonlinearities? And what would a from-the-model-definition PROOF of the
 * homogeneity actually require? Assessment/derivation + demonstration only; the C_mb GUE-conditional
 * per imp-486 is untouched; the pinned constants appear only as symbolic differentiation axes; no bound
 * moves; NO QED.
 *
 * WHAT THE SIX-PROBE AUDIT ACTUALLY TESTS (imp-97668)
 * ---------------------------------------------------
 * The audit applies a central-difference (eps = 1e-3) to each of six multiplicative probes at ONE
 * baseline and checks that every measured elasticity lands in span{E_CC, E_ET, E_CF} and that the
 * diagonal DIAG3 (all amplitudes co-scaled) reads machine-zero. Every one of those numbers is a
 * FIRST-ORDER (tangent) quantity evaluated at t = 1: it certifies the local linearization of sigma
 * along the co-scaling ray, nothing more. Homogeneity, by contrast, is a GLOBAL statement --
 * sigma(t*(c,e,f)) = sigma(c,e,f) for ALL t > 0 -- so there is a logical gap between what is measured
 * (the t = 1 tangent, DIAG3 = d sigma/d ln t at t = 1) and what B1 asserts (invariance for every t).
 *
 * THE DECISIVE DEMONSTRATION: A NON-HOMOGENEOUS DECOY THAT PASSES THE AUDIT
 * ------------------------------------------------------------------------
 * Take the exact imp-124812 model sigma_true = E_coll/E_N with E_coll = c*g, E_flow = f*h, E_trunc = e
 * (each amplitude a degree-1 prefactor) and build a DECOY that adds a non-homogeneous denominator
 * defect D_m = lambda * e * ((c/C0)*(f/F0) - 1)^m of even order m. At the baseline (c,e,f) = (C0,E0,F0)
 * the term ((c/C0)(f/F0) - 1) vanishes together with all its derivatives of order < m, so:
 *   - the baseline VALUE is unchanged (D_m = 0 at baseline);
 *   - every single-probe first-order elasticity is unchanged (the defect gradient is zero at baseline);
 *   - the diagonal DIAG3 first-order response is O(eps^(m)) under the audit step.
 * Under a JOINT rescaling (c,e,f) -> t*(c,e,f), however, (c/C0)(f/F0) -> t^2, so D_m = lambda*e*(t^2-1)^m
 * grows without bound and sigma is NOT invariant -- the decoy is genuinely non-homogeneous. Measured at
 * the audit step eps = 1e-3:
 *   m = 2 decoy: DIAG3 (joint J1) = -9.20e-7  -> ABOVE the imp-97668 machine-zero gate (1e-9): CAUGHT.
 *   m = 4 decoy: DIAG3 (joint J1) = -7.38e-12 -> BELOW 1e-9: PASSES the full first-order audit,
 *                single-probe elasticities matching the true model to ~1e-12 (C_C), 0 (E_trunc),
 *                ~2e-10 (C_F) -- yet the FINITE-t homogeneity defect is sigma(2*amps) - sigma(amps)
 *                = -0.596 (a 94% collapse of sigma), and -0.637 at t = 10.
 * So the six-probe audit catches LOW-ORDER nonlinearities (m = 2) but a sufficiently HIGH-ORDER defect
 * (m = 4) slips through undetected: a finite-order LOCAL audit at a single baseline cannot, by itself,
 * certify a GLOBAL homogeneity. The audit is NECESSARY (it rules out the low-order breaking modes and
 * would have flagged any first-order coding nonlinearity) but not, on its own, LOGICALLY SUFFICIENT.
 *
 * WHAT A FROM-THE-DEFINITION PROOF REQUIRES (and why B1 IS provable, so the audit is confirmatory)
 * -----------------------------------------------------------------------------------------------
 * The gap is closed not by more probing but by a SYMBOLIC degree argument on the closed form, which is
 * available because the model is written explicitly:
 *   (P1) MONOMIAL-DEGREE INSPECTION. Read sigma = u/(u+v) with u = c*g(N) and v = e + f*h(N). Each
 *        amplitude symbol (c, e, f) occurs EXACTLY ONCE, to the FIRST power, and OUTSIDE every nonlinear
 *        function (sqrt, exp, log, 1/T0). The shape functions g(N), h(N) and the height map T0(N) are
 *        functions of the fixed abscissa N ALONE and contain NO amplitude symbol. This is a finite,
 *        decidable term-graph check, not a measurement.
 *   (P2) EXACT SCALING. From (P1), u(t*(c,e,f)) = t*u and v(t*(c,e,f)) = t*v for EVERY t (each is a sum
 *        of first-degree monomials in the amplitudes), so sigma = tu/(tu+tv) = u/(u+v) EXACTLY --
 *        degree-0 homogeneity holds identically, and Euler then forces c sigma_c + e sigma_e + f sigma_f
 *        = 0 pointwise (imp-124812 core), whence DIAG3 = K * 0 = 0 with K the shared kernel.
 *   (P3) THE WRAPPED CONSTANTS ARE NOT AMPLITUDES. The only nonlinear wrappers (C_KH inside sqrt, the
 *        Gronwall exponent inside exp, and T0(N)) enclose FIXED constants or the abscissa, none of which
 *        is co-scaled with (c,e,f); this is exactly what imp-97668 verified probe-by-probe (C_KH ->
 *        0.5*E_CC, Gronwall exponent -> TC*E_CF, T0(N) = abscissa). Under (P1) this is a statement about
 *        the dependency graph -- the amplitude symbols do not appear inside any wrapper -- and needs no
 *        numerics.
 * Because (P1)-(P3) are exact and decidable from the model definition, B1 is provable-in-principle; the
 * six-probe audit is therefore CONFIRMATORY (an implementation guard that no coding-level nonlinearity
 * silently entered E_N, and a check that the wrapped constants really do factor through a single axis)
 * rather than the LOAD-BEARING logical foundation. The one residual caveat is honest: even a FINITE-t
 * global check only samples finitely many t (a defect proportional to sin(2*pi*ln t/ln 2) would vanish
 * at any fixed sample set), so neither the tangent audit nor finite-t sampling is a proof -- only the
 * symbolic monomial-degree argument (P1)-(P2) is.
 *
 * ASSESSMENT / DERIVATION + DEMONSTRATION ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc
 * 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only as symbolic axes); changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124812-diag3-additivity-exact-identity-assessment (B1 named as the sole load-bearing hinge)
 * @see imp-97668-nonlinear-amplitude-audit (the six-probe first-order amplitude audit assessed here)
 * @see imp-97689-diag3-additivity-euler-derivation (Euler degree-0 -> DIAG3 == 0)
 * @see imp-97644-three-axis-additivity-flow-prefactor (STRUCTURE (1): degree-0 homogeneity claim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-124812 exactly

const N_PROBE = 1e9; // representative abscissa; the algebraic core is N-independent (imp-124812)
const T0 = effectiveHeightForN(N_PROBE);
const L = Math.log(T0);
const G_SHAPE = Math.sqrt(L / N_PROBE); // E_coll shape g(N) (contains NO amplitude symbol)
const H_SHAPE = ((Math.log(T0 / TWO_PI) + 1) / TWO_PI) * (L / T0) * GRONWALL; // E_flow per-unit-f shape h(N)

const C0 = C_C_PINNED; // C_C amplitude baseline (1/8 ansatz)
const E0 = E_TRUNC_PT; // E_trunc amplitude baseline
const F0 = 1.0; // C_F multiplier baseline
const LAMBDA = 0.5; // decoy defect amplitude (arbitrary O(1) probe weight)

// TRUE degree-1 model: each amplitude is a first-degree prefactor of exactly one additive term of E_N.
function sigmaTrue(c, e, f) {
  const E_coll = c * G_SHAPE;
  const E_flow = f * H_SHAPE;
  const E_N = e + E_flow + E_coll;
  return E_coll / E_N;
}

// DECOY: same baseline VALUE and same local derivatives of order < m, but a NON-homogeneous denominator
// defect D_m = lambda*e*((c/C0)*(f/F0) - 1)^m. At baseline the bracket vanishes with all derivatives of
// order < m, so any finite-order LOCAL audit of order < m sees nothing; under joint scaling the bracket
// -> t^2 - 1 so the defect is large. Diagnostic construction only; NOT a proposed alternative model.
function makeDecoy(m) {
  return (c, e, f) => {
    const E_coll = c * G_SHAPE;
    const E_flow = f * H_SHAPE;
    const ratio = (c / C0) * (f / F0);
    const D = LAMBDA * e * Math.pow(ratio - 1, m);
    const E_N = e + E_flow + E_coll + D;
    return E_coll / E_N;
  };
}

// DIAG3 up to the shared kernel K: the joint-scaling first-order log-derivative d sigma/d ln t at t = 1
// (= c sigma_c + e sigma_e + f sigma_f, imp-124812). This is the pointwise object the six-probe audit
// measures at the crossing as DIAG3 = K * (this); K != 0, so DIAG3 == 0 iff this == 0.
function jointJ1(sig, eps) {
  const up = sig(C0 * Math.exp(eps), E0 * Math.exp(eps), F0 * Math.exp(eps));
  const dn = sig(C0 * Math.exp(-eps), E0 * Math.exp(-eps), F0 * Math.exp(-eps));
  return (up - dn) / (2 * eps);
}

// Single-probe first-order log-elasticities (the E_CC/E_ET/E_CF axes, up to the shared kernel K).
function probe(sig, key, eps) {
  const scale = (base, on) => (on ? base * Math.exp(eps) : base);
  const scaleDn = (base, on) => (on ? base * Math.exp(-eps) : base);
  const up = sig(scale(C0, key === 'c'), scale(E0, key === 'e'), scale(F0, key === 'f'));
  const dn = sig(scaleDn(C0, key === 'c'), scaleDn(E0, key === 'e'), scaleDn(F0, key === 'f'));
  return (up - dn) / (2 * eps);
}

// FINITE-t homogeneity defect (the global test a proof-surrogate uses): sigma(t*amps) - sigma(amps).
function homogDefect(sig, t) {
  return sig(C0 * t, E0 * t, F0 * t) - sig(C0, E0, F0);
}

const EPS = 1e-3; // the imp-97668 audit step
const SIGMA_BASE = sigmaTrue(C0, E0, F0);
const DECOY2 = makeDecoy(2);
const DECOY4 = makeDecoy(4);

// The true model: exact degree-0 homogeneity (tangent AND global), machine-zero everywhere.
const TRUE_MODEL = {
  sigma_base: +SIGMA_BASE.toFixed(10),
  diag3_joint_J1: +jointJ1(sigmaTrue, EPS).toExponential(3), // == 0
  probe_C_CC: +probe(sigmaTrue, 'c', EPS).toExponential(6),
  probe_E_ET: +probe(sigmaTrue, 'e', EPS).toExponential(6),
  probe_F_CF: +probe(sigmaTrue, 'f', EPS).toExponential(6),
  finite_t_defect_t0p5: +homogDefect(sigmaTrue, 0.5).toExponential(3), // == 0
  finite_t_defect_t2: +homogDefect(sigmaTrue, 2).toExponential(3), // == 0
  finite_t_defect_t10: +homogDefect(sigmaTrue, 10).toExponential(3), // == 0
};

// The m = 2 decoy: a LOW-order non-homogeneity that the first-order audit CATCHES (DIAG3 > 1e-9).
const DECOY_M2 = {
  order_m: 2,
  baseline_value_shift: +(DECOY2(C0, E0, F0) - SIGMA_BASE).toExponential(3), // == 0
  diag3_joint_J1: +jointJ1(DECOY2, EPS).toExponential(3), // ~ -9.2e-7, ABOVE the 1e-9 gate: CAUGHT
  caught_by_machine_zero_gate: Math.abs(jointJ1(DECOY2, EPS)) > 1e-9,
  finite_t_defect_t2: +homogDefect(DECOY2, 2).toExponential(3), // large
};

// The m = 4 decoy: a HIGH-order non-homogeneity that PASSES the full first-order six-probe audit at
// machine-zero, yet is grossly non-homogeneous under finite-t joint scaling. THE key demonstration.
const DECOY_M4 = {
  order_m: 4,
  baseline_value_shift: +(DECOY4(C0, E0, F0) - SIGMA_BASE).toExponential(3), // == 0
  diag3_joint_J1: +jointJ1(DECOY4, EPS).toExponential(3), // ~ -7.4e-12, BELOW 1e-9: PASSES
  passes_machine_zero_gate: Math.abs(jointJ1(DECOY4, EPS)) < 1e-9,
  probe_C_reldiff_vs_true: +Math.abs(probe(DECOY4, 'c', EPS) / probe(sigmaTrue, 'c', EPS) - 1).toExponential(3),
  probe_E_reldiff_vs_true: +Math.abs(probe(DECOY4, 'e', EPS) / probe(sigmaTrue, 'e', EPS) - 1).toExponential(3),
  probe_F_reldiff_vs_true: +Math.abs(probe(DECOY4, 'f', EPS) / probe(sigmaTrue, 'f', EPS) - 1).toExponential(3),
  finite_t_defect_t0p5: +homogDefect(DECOY4, 0.5).toExponential(3), // large
  finite_t_defect_t2: +homogDefect(DECOY4, 2).toExponential(3), // large (~ -0.60, a 94% collapse)
  finite_t_defect_t10: +homogDefect(DECOY4, 10).toExponential(3), // large
};

export const IMP124835_DEGREE1_HINGE_AUDIT_SUFFICIENCY_ASSESSMENT = {
  id: 'imp-124835',
  proofSection: 'S-frontier',
  question:
    'imp-124812 B1 names the linear-prefactor structure (each E_component degree-1 in its amplitude) as ' +
    'the SOLE load-bearing hypothesis for E_CC + E_ET + E_CF = 0, verified by the imp-97668 six-probe ' +
    'amplitude audit but NOT proven. Does the six-probe audit LOGICALLY ESTABLISH degree-0 homogeneity of ' +
    'sigma = E_coll/E_N in the amplitudes, or only rule out specific nonlinearities? What would a ' +
    'from-the-model-definition proof require, and does the model construction already force it (making the ' +
    'audit confirmatory rather than load-bearing)? Assessment/demonstration only; pinned constants as ' +
    'symbolic axes; no bound moves; no QED.',
  method:
    'Classify the audit numbers as first-order (tangent, t=1) quantities and expose the logical gap to the ' +
    'global homogeneity claim by constructing a NON-homogeneous decoy sigma_decoy with a denominator defect ' +
    'D_m = lambda*e*((c/C0)(f/F0) - 1)^m that vanishes with all derivatives of order < m at the baseline. ' +
    'Measure, at the audit step eps=1e-3, the decoy DIAG3 (joint J1) and single-probe elasticities against ' +
    'the true model, and the FINITE-t homogeneity defect sigma(t*amps) - sigma(amps); contrast m=2 (caught) ' +
    'with m=4 (passes the machine-zero audit yet fails finite-t). Then state the symbolic monomial-degree ' +
    'argument (P1)-(P3) that closes the gap from the closed-form model definition.',
  probe_abscissa_N: N_PROBE,
  audit_step_eps: EPS,
  trueModel: TRUE_MODEL,
  decoyOrder2_caught: DECOY_M2,
  decoyOrder4_passes: DECOY_M4,
  finding: {
    audit_is_first_order_local:
      'Every six-probe number is a t=1 tangent quantity (single-probe elasticities and DIAG3 = d sigma/d ' +
      'ln t at t=1); homogeneity is the GLOBAL claim sigma(t*amps) = sigma(amps) for all t, so there is a ' +
      'logical gap between what is measured and what B1 asserts.',
    decoy_defeats_the_audit:
      'A denominator defect D_m = lambda*e*((c/C0)(f/F0)-1)^m is non-homogeneous (bracket -> t^2-1 under ' +
      'joint scaling) yet vanishes with all derivatives of order < m at the baseline. m=2 is CAUGHT (DIAG3 ' +
      '= ' + DECOY_M2.diag3_joint_J1.toExponential(3) + ' > 1e-9) but m=4 PASSES the machine-zero audit ' +
      '(DIAG3 = ' + DECOY_M4.diag3_joint_J1.toExponential(3) + ' < 1e-9, single-probe elasticities matching ' +
      'the true model to <= ' + Math.max(DECOY_M4.probe_C_reldiff_vs_true, DECOY_M4.probe_F_reldiff_vs_true).toExponential(3) +
      ') while the finite-t defect is ' + DECOY_M4.finite_t_defect_t2.toExponential(3) + ' at t=2: a ' +
      'finite-order local audit at one baseline cannot certify a global homogeneity.',
    proof_is_symbolic_not_empirical:
      'The gap is closed by a decidable term-graph check on the closed form, not by more probing: (P1) each ' +
      'amplitude symbol occurs once, first-power, outside every nonlinear wrapper, and g(N),h(N),T0(N) ' +
      'contain no amplitude; (P2) hence u,v scale exactly by t and sigma is degree-0 homogeneous ' +
      'identically (Euler -> DIAG3 = K*0 = 0); (P3) the wrapped constants (C_KH in sqrt, Gronwall exponent ' +
      'in exp, T0(N)) are fixed constants/abscissa, not co-scaled amplitudes -- precisely imp-97668 A2/A3.',
    verdict_on_the_audit:
      'B1 is provable-in-principle from the model definition via (P1)-(P2); the six-probe audit is therefore ' +
      'CONFIRMATORY (an implementation guard against a coding-level nonlinearity and a check that the ' +
      'wrapped constants factor through a single axis), NOT the load-bearing logical foundation. Honest ' +
      'residual: even finite-t sampling only tests finitely many t, so only the symbolic argument is a proof.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT + DEMONSTRATION (frontier delineation, NOT rigorous). The imp-97668 six-probe amplitude ' +
    'audit does NOT, on its own, logically establish the degree-0 homogeneity that B1 rests on: every audit ' +
    'number is a FIRST-ORDER (tangent, t=1) quantity, whereas homogeneity is the GLOBAL claim ' +
    'sigma(t*(c,e,f)) = sigma(c,e,f) for all t. A non-homogeneous decoy with a denominator defect ' +
    'D_m = lambda*e*((c/C0)(f/F0)-1)^m that vanishes with all derivatives of order < m at the baseline ' +
    'demonstrates the gap: the m=2 decoy is CAUGHT (DIAG3 joint J1 = ' + DECOY_M2.diag3_joint_J1.toExponential(3) +
    ' > 1e-9), but the m=4 decoy PASSES the entire machine-zero audit (DIAG3 = ' +
    DECOY_M4.diag3_joint_J1.toExponential(3) + ' < 1e-9, single-probe C_C/E_trunc/C_F elasticities matching ' +
    'the true model to <= ' + Math.max(DECOY_M4.probe_C_reldiff_vs_true, DECOY_M4.probe_F_reldiff_vs_true).toExponential(3) +
    ') while its finite-t homogeneity defect is ' + DECOY_M4.finite_t_defect_t2.toExponential(3) + ' at t=2 ' +
    '(a ~94% collapse of sigma) and ' + DECOY_M4.finite_t_defect_t10.toExponential(3) + ' at t=10 -- so a ' +
    'finite-order LOCAL audit at a single baseline catches low-order breaking modes but cannot certify a ' +
    'GLOBAL homogeneity. What a from-the-definition PROOF requires is a SYMBOLIC monomial-degree argument, ' +
    'available because the closed form is explicit: (P1) each amplitude symbol occurs once, to first power, ' +
    'outside every nonlinear wrapper, and g(N),h(N),T0(N) contain no amplitude; (P2) so u=c*g and ' +
    'v=e+f*h scale exactly by t and sigma is degree-0 homogeneous identically, Euler forcing DIAG3 = K*0 = 0; ' +
    '(P3) the wrapped constants (C_KH in sqrt, the Gronwall exponent in exp, T0(N)) are fixed ' +
    'constants/abscissa, never co-scaled amplitudes -- exactly the imp-97668 A2/A3 findings. Since ' +
    '(P1)-(P3) are exact and decidable from the model definition, B1 is provable-in-principle and the ' +
    'six-probe audit is CONFIRMATORY (an implementation guard), NOT the load-bearing logical foundation; ' +
    'the honest residual is that even finite-t sampling tests only finitely many t, so only the symbolic ' +
    'argument is a proof. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the pinned constants appear only as symbolic differentiation axes, not ' +
    're-pinned; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124812 (B1 named as the sole load-bearing hinge, verified not proven); imp-97668 (six-probe ' +
    'amplitude audit assessed here; A2 C_KH -> 0.5*E_CC, Gronwall exponent -> TC*E_CF; A3 T0(N) = ' +
    'abscissa); imp-97689 (Euler degree-0 -> DIAG3 == 0); imp-97644 (STRUCTURE (1) homogeneity claim); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); imp-398 (C_F prefactor); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124835_DEGREE1_HINGE_AUDIT_SUFFICIENCY_ASSESSMENT_ASSERTIONS = [
  {
    // The decoy preserves the baseline VALUE exactly (D_m = 0 at baseline) for both orders.
    id: 'imp124835-decoy-preserves-baseline-value',
    description: 'both decoys leave sigma(baseline) unchanged (defect term is zero at the baseline)',
    holds: () =>
      Math.abs(DECOY_M2.baseline_value_shift) < 1e-15 && Math.abs(DECOY_M4.baseline_value_shift) < 1e-15,
  },
  {
    // The TRUE model is degree-0 homogeneous: tangent (DIAG3) AND global (finite-t) machine-zero.
    id: 'imp124835-true-model-exactly-homogeneous',
    description: 'true model DIAG3 and finite-t defects (t=0.5,2,10) are all machine-zero (< 1e-14)',
    holds: () =>
      Math.abs(TRUE_MODEL.diag3_joint_J1) < 1e-14 &&
      Math.abs(TRUE_MODEL.finite_t_defect_t0p5) < 1e-14 &&
      Math.abs(TRUE_MODEL.finite_t_defect_t2) < 1e-14 &&
      Math.abs(TRUE_MODEL.finite_t_defect_t10) < 1e-14,
  },
  {
    // The m=2 decoy is a low-order non-homogeneity the first-order audit WOULD catch (DIAG3 > 1e-9).
    id: 'imp124835-order2-decoy-caught-by-audit',
    description: 'm=2 decoy DIAG3 joint J1 exceeds the imp-97668 machine-zero gate (|DIAG3| > 1e-9)',
    holds: () => DECOY_M2.caught_by_machine_zero_gate === true,
  },
  {
    // The m=4 decoy PASSES the machine-zero DIAG3 gate -- the audit does NOT see it.
    id: 'imp124835-order4-decoy-passes-diag3-gate',
    description: 'm=4 decoy DIAG3 joint J1 is below the machine-zero gate (|DIAG3| < 1e-9): undetected',
    holds: () => DECOY_M4.passes_machine_zero_gate === true,
  },
  {
    // The m=4 decoy also matches every single-probe elasticity of the true model (full audit fooled).
    id: 'imp124835-order4-decoy-matches-single-probes',
    description: 'm=4 decoy single-probe C_C/E_trunc/C_F elasticities match the true model to < 1e-6 relative',
    holds: () =>
      DECOY_M4.probe_C_reldiff_vs_true < 1e-6 &&
      DECOY_M4.probe_E_reldiff_vs_true < 1e-6 &&
      DECOY_M4.probe_F_reldiff_vs_true < 1e-6,
  },
  {
    // Decisive: the m=4 decoy that PASSES the audit is grossly non-homogeneous under finite-t scaling.
    id: 'imp124835-order4-decoy-fails-finite-t',
    description: 'the audit-passing m=4 decoy has a large finite-t homogeneity defect (|defect(t=2)| > 1e-2)',
    holds: () => Math.abs(DECOY_M4.finite_t_defect_t2) > 1e-2,
  },
  {
    // Honesty gate: assessment/demonstration only, no QED, no refereed bound is changed.
    id: 'imp124835-honesty-gate-no-qed',
    description: 'Assessment/demonstration only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124835_DEGREE1_HINGE_AUDIT_SUFFICIENCY_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP124835_DEGREE1_HINGE_AUDIT_SUFFICIENCY_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP124835_DEGREE1_HINGE_AUDIT_SUFFICIENCY_ASSESSMENT.verdict),
  },
];

for (const a of IMP124835_DEGREE1_HINGE_AUDIT_SUFFICIENCY_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124835-degree1-hinge-audit-sufficiency-assessment assertion failed: ${a.id}`);
  }
}
