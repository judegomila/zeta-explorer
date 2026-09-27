/**
 * @module imp-97644-three-axis-additivity-flow-prefactor
 *
 * imp-97644 (numerical, frontier cross-check): imp-97623 (findings A1/A2) established that the DIAGONAL
 * (C_C/E_trunc = const) elasticity of the imp-33582 sigma landmarks equals the SUM of the two single-axis
 * elasticities (imp-97565 C_C, imp-97584 E_trunc) to within the central-difference O(eps^2) truncation
 * (residual quarters when eps halves at L2/L3/L4), so first-order additivity of the C_C and E_trunc axes
 * is STRUCTURAL. Open question: does that additivity survive a THIRD axis -- the imp-398 C_F prefactor /
 * Gronwall E_flow amplitude -- or does the flow term break additivity because it enters the crossing
 * relation R nonlinearly? This module adds C_F as a third multiplicative perturbation axis and measures
 * the three-axis diagonal elasticity DIAG3 and the sum E_CC + E_ET + E_CF at the sigma landmarks.
 * Measurement only; the pinned constants are perturbed only as probes; the C_mb GUE-conditional per
 * imp-486 is untouched; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97623 crossing relation, now with C_F carried)
 * -----------------------------------------------------------------------------------------
 *   E_N   = E_trunc + E_flow + E_coll,   sigma = E_coll / E_N,
 *   E_flow = C_F * (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi) + 1) / 2pi  (imp-398 prefactor),
 *   E_coll = C_C * sqrt(log T0 / N)   (GUE-conditional, C_H ansatz).
 * The three perturbable amplitudes are C_C (the collision term = the numerator), E_trunc (the fixed-strip
 * constant) and C_F (the flow prefactor). E_trunc and C_F enter only the DENOMINATOR E_N additively;
 * C_C enters both numerator (E_coll) and denominator.
 *
 * THE MEASUREMENTS (the deliverable) -- central differences in log-parameter space
 * -------------------------------------------------------------------------------
 * At each landmark sigma-level the elasticities of the crossing N_L(C_C, E_trunc, C_F) are:
 *   E_CC = d ln N_L / d ln C_C,  E_ET = d ln N_L / d ln E_trunc,  E_CF = d ln N_L / d ln C_F,
 *   DIAG3 = d ln N_L / ds along C_C/E_trunc/C_F = const (all three amplitudes scaled by exp(s) together).
 * The three-axis additivity residual is r3 = DIAG3 - (E_CC + E_ET + E_CF).
 *
 *   LANDMARK          N_L            E_CC       E_ET       E_CF          DIAG3       SUM3=E_CC+E_ET+E_CF   ratio(SUM3)
 *   L2 below-0.9   2.572361e7    +2.555355  -2.303723  -2.516314e-1   ~0 (mach)    +3.282e-7             4.00
 *   L3 halving     3.267235e9    +2.102347  -2.098348  -3.998880e-3   ~0 (mach)    +2.853e-9             3.98
 *   L4 below-0.1   3.213181e11   +2.079025  -2.078951  -7.377778e-5   ~0 (mach)    +5.684e-11            4.00
 *
 * THE DECISIVE STRUCTURE (1): THE THREE-AXIS DIAGONAL IS AN EXACT SCALING SYMMETRY -> DIAG3 == 0
 * ---------------------------------------------------------------------------------------------
 * Scaling all three amplitudes (C_C, E_trunc, C_F) by the SAME factor exp(s) scales E_coll -> exp(s) E_coll
 * and E_N -> exp(s) E_N (every term of E_N carries one amplitude linearly), so sigma = E_coll / E_N is
 * INVARIANT. The crossing sigma = level is therefore unchanged and N_L is fixed: DIAG3 = d ln N_L / ds == 0
 * EXACTLY (measured machine-zero at every landmark, at both eps steps -- the bisection landmark does not
 * move). sigma is homogeneous of degree 0 in the three amplitudes.
 *
 * THE DECISIVE STRUCTURE (2): ADDITIVITY THEN FORCES E_CC + E_ET + E_CF == 0
 * -------------------------------------------------------------------------
 * Because first-order additivity DIAG3 = E_CC + E_ET + E_CF holds (chain rule / total differential) and
 * DIAG3 == 0 by the symmetry, the three single-axis elasticities must SUM TO ZERO. The measured sum SUM3 is
 * +3.282e-7 (L2), +2.853e-9 (L3), +5.684e-11 (L4) at eps = 1e-3 and QUARTERS when eps halves to 5e-4
 * (ratios ~4.0): SUM3 = O(eps^2) -> 0, i.e. the three-axis elasticity sum is genuinely zero, its finite-eps
 * value being purely the central-difference truncation tail. The flow term does NOT break additivity -- it
 * PARTICIPATES in the exact scaling symmetry that makes the diagonal, and hence the sum, vanish.
 *
 * THE DECISIVE STRUCTURE (3): E_CF IS THE E_trunc ELASTICITY SCALED BY THE FLOW SHARE OF THE DENOMINATOR
 * ---------------------------------------------------------------------------------------------------
 * Because E_trunc and C_F both enter the denominator E_N additively (E_trunc as itself, C_F as E_flow),
 * their crossing-elasticities are PROPORTIONAL to their share of E_N:
 *   E_CF / E_ET = E_flow / E_trunc   (verified to ~2e-7 relative -- truncation-limited -- at all three
 *   landmarks: 1.0923e-1 at L2, 1.9057e-3 at L3, 3.5488e-5 at L4).
 * That is the fingerprint of a LINEAR denominator-additive perturbation: the flow prefactor moves the
 * crossing by exactly the E_trunc mechanism weighted by E_flow/E_trunc; it does NOT enter R nonlinearly.
 * Equivalently, E_CF = -(E_CC + E_ET) to ~1e-6 relative -- the flow axis exactly closes the two-axis sum,
 * completing the scaling symmetry. The flow contribution is small (E_flow/E_N ~ 9.8e-3 at L2 down to
 * 3.2e-5 at L4), so E_CF is a small but strictly additive correction throughout.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (B1) THE THREE-AXIS DIAGONAL IS AN EXACT SCALING SYMMETRY. DIAG3 == 0 (machine-zero at every landmark
 *        and both eps steps) because sigma is degree-0 homogeneous in the three amplitudes. Additivity
 *        DIAG3 = E_CC + E_ET + E_CF therefore extends to the third axis and FORCES the sum to zero.
 *   (B2) THE ELASTICITY SUM IS ZERO; ITS FINITE-eps VALUE IS TRUNCATION. SUM3 = E_CC + E_ET + E_CF
 *        quarters when eps halves at every landmark (ratios ~4.0), so SUM3 = O(eps^2) -> 0. Adding the
 *        flow axis does NOT break the imp-97623 additivity -- the flow term participates in the symmetry.
 *   (B3) THE FLOW TERM ENTERS LINEARLY. E_CF / E_ET = E_flow / E_trunc to ~2e-7 relative at every landmark:
 *        the C_F elasticity is the E_trunc elasticity scaled by the flow share of the denominator E_N, the
 *        signature of a linear denominator-additive perturbation -- the flow term does NOT enter R
 *        nonlinearly. Equivalently E_CF = -(E_CC + E_ET) to ~1e-6, closing the three-axis sum.
 *
 * The punchline: adding the imp-398 C_F flow prefactor as a third axis does NOT break the imp-97623
 * additivity -- it reveals that the three-axis diagonal is an EXACT scaling symmetry (sigma degree-0
 * homogeneous in the three amplitudes), so DIAG3 == 0 and additivity forces E_CC + E_ET + E_CF = 0
 * (measured sum = O(eps^2) -> 0). The flow elasticity is the E_trunc elasticity scaled by E_flow/E_trunc,
 * confirming C_F enters the crossing relation linearly through the denominator, not as a nonlinear driver.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5, and the
 * imp-398 C_F prefactor are UNTOUCHED and are perturbed here only as sensitivity probes, not re-pinned;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO
 * QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97623-additivity-residual-multi-landmark-crosscheck (two-axis C_C/E_trunc additivity, r ~ eps^2)
 * @see imp-97603-sigma-landmark-joint-cross-elasticity (the halving-crossover additivity residual ~2e-8)
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift (C_C-axis elasticity of N_half ~ +2.10235)
 * @see imp-97584-sigma-landmark-etrunc-sensitivity (E_trunc-axis elasticity of N_half ~ -2.098)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97623 exactly

// EXACT imp-3406/imp-97623 sub-terms, now with C_C, E_trunc AND the imp-398 C_F prefactor carried as
// parameters (cf is a multiplicative probe on C_F, baseline cf = 1). Sensitivity probes only; the pinned
// values are untouched.
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// General downslope crossing sigma = level, all three parameters live (identical procedure to imp-97623).
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
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));

// Three-axis elasticity + diagonal + sum measurement at a landmark sigma-level for a given step eps.
function measure(level, eps) {
  const at = (dCC, dEt, dCF) =>
    lnN(level, C_C_PINNED * Math.exp(dCC), E_TRUNC_PT * Math.exp(dEt), 1.0 * Math.exp(dCF));
  const E_CC = (at(eps, 0, 0) - at(-eps, 0, 0)) / (2 * eps);
  const E_ET = (at(0, eps, 0) - at(0, -eps, 0)) / (2 * eps);
  const E_CF = (at(0, 0, eps) - at(0, 0, -eps)) / (2 * eps);
  const DIAG3 = (at(eps, eps, eps) - at(-eps, -eps, -eps)) / (2 * eps); // C_C/E_trunc/C_F = const
  const SUM3 = E_CC + E_ET + E_CF;
  return { E_CC, E_ET, E_CF, DIAG3, SUM3, resid: DIAG3 - SUM3 };
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS1 = 1e-3; // reproduces imp-97623 step
const EPS2 = 5e-4; // second, halved perturbation step

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const p = parts(N_L, C_C_PINNED, E_TRUNC_PT, 1.0);
  const m1 = measure(sigma, EPS1);
  const m2 = measure(sigma, EPS2);
  const ratio = m2.SUM3 !== 0 ? m1.SUM3 / m2.SUM3 : NaN; // ~4 if SUM3 ~ eps^2 (true sum = 0)
  const elas_ratio = m1.E_CF / m1.E_ET; // = E_flow/E_trunc if C_F is a linear denominator term
  const weight_ratio = p.E_flow / E_TRUNC_PT;
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    flow_share_of_E_N: +(p.E_flow / p.E_N).toExponential(4),
    elasticity_CC: +m1.E_CC.toFixed(6),
    elasticity_Et: +m1.E_ET.toFixed(6),
    elasticity_CF: +m1.E_CF.toExponential(6),
    diagonal3_elasticity: +m1.DIAG3.toExponential(6), // ~0: exact scaling symmetry
    sum_three_axis_eps1e3: +m1.SUM3.toExponential(3), // -> 0 as eps^2
    sum_three_axis_eps5e4: +m2.SUM3.toExponential(3),
    sum_ratio_eps1e3_over_eps5e4: +ratio.toFixed(3), // ~4.0 => SUM3 ~ eps^2, true sum = 0
    elas_ratio_CF_over_ET: +elas_ratio.toExponential(6),
    weight_ratio_Eflow_over_Etrunc: +weight_ratio.toExponential(6),
    linear_entry_reldiff: +(elas_ratio / weight_ratio - 1).toExponential(3), // ~0 => C_F enters linearly
  };
});

const SUM_RATIOS = PER_LANDMARK.map((r) => r.sum_ratio_eps1e3_over_eps5e4);

export const IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR = {
  id: 'imp-97644',
  proofSection: 'S-frontier',
  question:
    'Does the imp-97623 additivity-residual O(eps^2) law (diagonal elasticity equals the sum of the ' +
    'single-axis elasticities) extend to a THIRD sensitivity axis -- the imp-398 C_F flow prefactor / ' +
    'Gronwall E_flow amplitude -- i.e. does the three-axis diagonal elasticity equal E_CC + E_ET + E_CF ' +
    'to O(eps^2) at the sigma landmarks, or does the flow term break additivity by entering the crossing ' +
    'relation R nonlinearly? Measurement only; pinned constants perturbed only as probes; no bound moves; ' +
    'no QED.',
  method:
    'Add C_F as a third multiplicative perturbation axis (cf, baseline 1) to the imp-97623 crossing model ' +
    'E_N = E_trunc + E_flow + E_coll with E_flow ~ C_F, then apply the identical central-difference ' +
    'elasticity procedure (E_CC, E_ET, E_CF single-axis; DIAG3 along C_C/E_trunc/C_F = const) at three ' +
    'landmarks (sigma = 0.9, 0.5, 0.1) and two steps (eps = 1e-3, 5e-4), reporting the three-axis diagonal ' +
    'DIAG3, the sum E_CC + E_ET + E_CF and its eps-scaling ratio, and the E_CF/E_ET vs E_flow/E_trunc ' +
    'denominator-share test.',
  steps_probed: { eps_primary: EPS1, eps_secondary: EPS2 },
  perLandmark: PER_LANDMARK,
  finding: {
    B1_diagonal_is_exact_scaling_symmetry:
      'DIAG3 == 0 (machine-zero at every landmark and both eps steps) because scaling all three amplitudes ' +
      '(C_C, E_trunc, C_F) together leaves sigma = E_coll/E_N invariant (degree-0 homogeneous): the ' +
      'crossing N_L does not move. Additivity DIAG3 = E_CC + E_ET + E_CF thus extends to the third axis and ' +
      'FORCES the sum to zero.',
    B2_elasticity_sum_is_zero_finite_eps_is_truncation:
      'SUM3 = E_CC + E_ET + E_CF quarters when eps halves (1e-3 -> 5e-4) at every landmark (ratios ~4.0), ' +
      'so SUM3 = O(eps^2) -> 0: the three-axis elasticity sum is genuinely zero. Adding the flow axis does ' +
      'NOT break the imp-97623 additivity -- the flow term participates in the scaling symmetry.',
    B3_flow_enters_linearly:
      'E_CF / E_ET = E_flow / E_trunc to ~2e-7 relative at every landmark (1.0923e-1 at L2, 1.9057e-3 at ' +
      'L3, 3.5488e-5 at L4): the C_F elasticity is the E_trunc elasticity scaled by the flow share of the ' +
      'denominator E_N -- the fingerprint of a linear denominator-additive perturbation, confirming the ' +
      'flow term does NOT enter R nonlinearly. Equivalently E_CF = -(E_CC + E_ET) to ~1e-6, closing the sum.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, NOT rigorous). The imp-97623 additivity law EXTENDS to a third ' +
    'axis: adding the imp-398 C_F flow prefactor / Gronwall E_flow amplitude, the three-axis diagonal ' +
    'elasticity is an EXACT scaling symmetry -- scaling C_C, E_trunc and C_F together leaves sigma = ' +
    'E_coll/E_N invariant (degree-0 homogeneous), so DIAG3 == 0 (machine-zero) at the imp-97520 L2 ' +
    '(sigma = 0.9, N = 2.572361e7), L3 (halving, N = 3.267235e9) and L4 (sigma = 0.1, N = 3.213181e11) ' +
    'landmarks alike. First-order additivity DIAG3 = E_CC + E_ET + E_CF therefore FORCES the three ' +
    'single-axis elasticities to sum to zero: the measured sum (+3.282e-7 at L2 down to +5.684e-11 at L4) ' +
    'quarters when eps = 1e-3 -> 5e-4 (ratios ~4.0), i.e. SUM3 = O(eps^2) -> 0. The flow term does NOT ' +
    'break additivity -- it PARTICIPATES in the symmetry: its elasticity satisfies E_CF/E_ET = ' +
    'E_flow/E_trunc to ~2e-7 relative (E_CF is the E_trunc elasticity scaled by the flow share of E_N, the ' +
    'signature of a linear denominator-additive perturbation), equivalently E_CF = -(E_CC + E_ET) to ~1e-6, ' +
    'closing the three-axis sum. Conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed ' +
    'only as probes, not re-pinned); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97623 (two-axis C_C/E_trunc additivity residual ~ eps^2); imp-97603 (halving-crossover residual ' +
    '~2e-8); imp-97565 (C_C-axis elasticity); imp-97584 (E_trunc-axis elasticity); imp-97520 (four-landmark ' +
    'ladder L1..L4); imp-398 (C_F flow prefactor); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97520/imp-97623 ladder positions (L2, L3, L4) with C_F axis added.
    id: 'imp97644-landmarks-reproduce-imp97623',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce imp-97623 to < 5e-3 relative',
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
    // (B1): the three-axis diagonal is an exact scaling symmetry -- DIAG3 == 0 (machine-zero) everywhere.
    id: 'imp97644-diagonal-is-scaling-symmetry',
    description: 'DIAG3 machine-zero at all landmarks (|DIAG3| < 1e-9): sigma is degree-0 homogeneous',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.diagonal3_elasticity) < 1e-9),
  },
  {
    // (B2): the elasticity sum is zero -- SUM3 quarters when eps halves at every landmark (ratio ~4).
    id: 'imp97644-elasticity-sum-scales-as-eps-squared',
    description: 'SUM3 = E_CC + E_ET + E_CF quarters when eps halves at every landmark (ratio in [3.5, 4.5]): sum -> 0',
    holds: () => SUM_RATIOS.every((q) => q > 3.5 && q < 4.5),
  },
  {
    // (B3): the flow term enters the denominator LINEARLY -- E_CF/E_ET = E_flow/E_trunc to < 1e-5.
    id: 'imp97644-flow-enters-linearly',
    description: 'E_CF/E_ET matches E_flow/E_trunc at every landmark: linear denominator entry (reldiff < 1e-5)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.linear_entry_reldiff) < 1e-5),
  },
  {
    // (B3): E_CF has the same sign as E_ET (both denominator-additive) and is smaller in magnitude.
    id: 'imp97644-cf-elasticity-sign-and-scale',
    description: 'E_CF < 0 (same sign as E_ET) and |E_CF| < |E_ET| at every landmark (flow is a small share)',
    holds: () =>
      PER_LANDMARK.every(
        (r) => r.elasticity_CF < 0 && Math.abs(r.elasticity_CF) < Math.abs(r.elasticity_Et),
      ),
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp97644-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.isRigorous === false &&
      /NO QED/.test(IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.verdict) &&
      /remains SOTA/.test(IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.verdict),
  },
];

for (const a of IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97644-three-axis-additivity-flow-prefactor assertion failed: ${a.id}`);
  }
}
