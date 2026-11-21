/**
 * @module imp-97760-four-axis-additivity-gronwall-a1
 *
 * imp-97760 (proof/derivation, frontier cross-check): imp-97644 proved that the THREE-axis diagonal
 * (C_C / E_trunc / C_F all scaled together) is an EXACT scaling symmetry -- sigma = E_coll / E_N is
 * degree-0 homogeneous in the three amplitudes, so DIAG3 == 0 (machine-zero) and first-order additivity
 * forces E_CC + E_ET + E_CF == 0. Open question (this ticket): does that symmetry extend to a FOURTH
 * amplitude axis -- the imp-3406/imp-33582 Gronwall/A1 factor exp(TC_A1_TRAP) that multiplies E_flow --
 * as DIAG4 == 0, or does adding the A1 factor break the homogeneity? This module adds the Gronwall/A1
 * factor as a fourth multiplicative probe (ga, baseline 1) and derives/measures the four-axis diagonal
 * DIAG4 and the four-term sum E_CC + E_ET + E_CF + E_A1 at the sigma landmarks. Measurement/derivation
 * ONLY on the inherited surrogate; the C_mb GUE-conditional per imp-486 is untouched; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-97644 crossing relation, now with the Gronwall/A1 factor carried as its own axis)
 * ---------------------------------------------------------------------------------------------------------
 *   E_N    = E_trunc + E_flow + E_coll,   sigma = E_coll / E_N,
 *   E_flow = C_F * (log T0 / T0) * (A1 * Gronwall),   C_F = (log(T0/2pi) + 1) / 2pi  (imp-398 prefactor),
 *   Gronwall = exp(TC_A1_TRAP),   TC_A1_TRAP = 2.37e-4  (imp-3406/imp-33582/imp-97644),
 *   E_coll  = C_C * sqrt(log T0 / N)   (GUE-conditional, C_H ansatz).
 * The FOUR perturbable amplitudes are C_C (the numerator collision term), E_trunc (the fixed-strip
 * constant), C_F (the imp-398 flow prefactor) and A1 (the Gronwall/A1 amplitude). CRUCIALLY, C_F and A1
 * BOTH multiply the single flow term E_flow: E_flow is proportional to the PRODUCT C_F * A1.
 *
 * THE DECISIVE STRUCTURE (1): THE A1 FACTOR IS DEGENERATE WITH C_F -> E_A1 == E_CF EXACTLY
 * -------------------------------------------------------------------------------------------
 * Because E_flow depends on cf and ga only through the product cf*ga, the landmark N_L(cc, et, cf, ga)
 * depends on cf and ga only through that product. Hence the two single-axis elasticities are IDENTICAL,
 * E_A1 = d ln N_L / d ln ga == E_CF = d ln N_L / d ln cf -- not merely to O(eps^2) but to MACHINE PRECISION
 * at finite eps (both central differences perturb the same E_flow amplitude by the same factor). The A1
 * factor DOES enter E_flow "purely multiplicatively", exactly as C_F does -- but that is precisely why it
 * is a REDUNDANT re-parameterisation of the flow amplitude, not an independent fourth degree of freedom.
 *
 * THE DECISIVE STRUCTURE (2): THE NAIVE FOUR-AXIS DIAGONAL BREAKS THE SYMMETRY -> DIAG4 == E_CF != 0
 * -------------------------------------------------------------------------------------------------
 * Scaling all four amplitudes by the SAME factor exp(s) scales E_coll -> exp(s) E_coll, E_trunc ->
 * exp(s) E_trunc, but E_flow -> exp(2s) E_flow (BOTH C_F and A1 each contribute a factor exp(s) to the
 * single flow term). So E_N is NO LONGER homogeneous of degree 1 -- sigma = E_coll / E_N = E_coll /
 * (E_trunc + exp(s) E_flow + E_coll) DEPENDS on s. The crossing N_L therefore MOVES: DIAG4 = d ln N_L / ds
 * != 0. By first-order additivity DIAG4 = E_CC + E_ET + E_CF + E_A1 = (E_CC + E_ET + E_CF) + E_CF = E_CF
 * (using the imp-97644 three-axis zero). Measured: DIAG4 == E_CF to machine precision at every landmark
 * (-2.516314e-1 at L2, -3.998880e-3 at L3, -7.377778e-5 at L4) -- NOT machine-zero, so DIAG4 == 0 FAILS.
 * The excess over the three-axis symmetry is exactly the ONE extra copy of E_flow's scaling.
 *
 * THE DECISIVE STRUCTURE (3): ADDITIVITY ITSELF SURVIVES; THE FOUR-TERM CONSTRAINT IS SUM4 = E_CF
 * ----------------------------------------------------------------------------------------------
 * The chain-rule additivity DIAG4 = E_CC + E_ET + E_CF + E_A1 STILL HOLDS: DIAG4 - SUM4 quarters when eps
 * halves (residual -3.282e-7 -> at L2, matching the imp-97644 SUM3 truncation tail), so the identity is
 * exact and only the finite-eps value is O(eps^2). What breaks is NOT additivity but HOMOGENEITY: the
 * genuine scaling symmetry is THREE-dimensional (one amplitude per term E_coll/E_trunc/E_flow); splitting
 * the flow amplitude into two multiplicative factors C_F, A1 makes the four-parameter family RANK-DEFICIENT
 * with one redundancy. The four-term elasticity constraint is E_CC + E_ET + E_CF + E_A1 = E_CF != 0 (it is
 * 2 E_CF - (E_CC+E_ET) reduced by the three-axis zero to a single copy of E_CF). Restoring homogeneity
 * requires scaling C_F and A1 by exp(s/2) EACH (so E_flow scales by exp(s) like the other terms): that
 * corrected diagonal DIAG4c is machine-zero, confirming the symmetry is intact once the flow amplitude is
 * scaled once, not twice.
 *
 * THE FINDING (derivation + measurement)
 * --------------------------------------
 *   (B1) THE A1 FACTOR IS A REDUNDANT COPY OF C_F. E_A1 == E_CF to machine precision (diff exactly 0 at
 *        finite eps) because E_flow ~ C_F * A1 depends only on the product. The A1 factor enters E_flow
 *        purely multiplicatively, exactly like C_F -- it is not an independent axis.
 *   (B2) THE NAIVE FOUR-AXIS DIAGONAL IS NON-ZERO: DIAG4 == E_CF (measured to machine precision), NOT
 *        machine-zero. So DIAG4 == 0 FAILS -- scaling all four amplitudes over-scales E_flow (by exp(2s)),
 *        breaking the degree-0 homogeneity of sigma. The answer to the ticket is NO: DIAG4 != 0.
 *   (B3) ADDITIVITY SURVIVES; THE CONSTRAINT IS SUM4 = E_CF. DIAG4 = E_CC + E_ET + E_CF + E_A1 holds to
 *        O(eps^2) (residual quarters when eps halves), and equals E_CF via the imp-97644 three-axis zero.
 *        The corrected diagonal (C_F, A1 each scaled by exp(s/2)) is machine-zero: the true symmetry is
 *        three-dimensional; the fourth axis is a rank-deficient redundancy, not a symmetry breaker of
 *        additivity.
 *
 * The punchline: adding the Gronwall/A1 factor as a fourth axis does NOT give DIAG4 == 0. The A1 factor
 * enters E_flow purely multiplicatively -- exactly like the imp-398 C_F prefactor -- so it is DEGENERATE
 * with C_F (E_A1 == E_CF), and scaling all four amplitudes together scales the single flow term TWICE
 * (exp(2s)), breaking the degree-0 homogeneity that gave DIAG3 == 0. The naive four-axis diagonal is
 * DIAG4 == E_CF != 0. Additivity itself is preserved (DIAG4 = E_CC+E_ET+E_CF+E_A1 to O(eps^2)), the
 * four-term constraint is E_CC+E_ET+E_CF+E_A1 = E_CF, and the genuine scaling symmetry remains
 * three-dimensional (one amplitude per term): scaling C_F and A1 by exp(s/2) each restores DIAG == 0.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5, the imp-398
 * C_F prefactor and the imp-3406 Gronwall/A1 factor (TC_A1_TRAP = 2.37e-4) are UNTOUCHED and are perturbed
 * here only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; interval-rigorous reach stays 2a <= 0.96; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-97644-three-axis-additivity-flow-prefactor (three-axis DIAG3 == 0 scaling symmetry; E_CC+E_ET+E_CF=0)
 * @see imp-97623-additivity-residual-multi-landmark-crosscheck (two-axis C_C/E_trunc additivity, r ~ eps^2)
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
const GRONWALL_BASE = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644 exactly

// EXACT imp-97644 sub-terms, now with the Gronwall/A1 amplitude carried as a FOURTH axis (ga, baseline 1)
// in addition to C_C (cc), E_trunc (et) and the imp-398 C_F prefactor (cf). CRUCIALLY, cf and ga BOTH
// multiply E_flow: E_flow is proportional to the product cf*ga. Sensitivity probes only; pinned untouched.
function parts(N, cc, et, cf, ga) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * (ga * GRONWALL_BASE); // Gronwall/A1 amplitude scaled by ga
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// General downslope crossing sigma = level, all four parameters live (identical procedure to imp-97644).
function landmark(level, cc, et, cf, ga) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf, ga).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et, cf, ga) => Math.log(landmark(level, cc, et, cf, ga));

// Four-axis elasticity + naive diagonal + corrected diagonal + sum at a landmark sigma-level for step eps.
function measure(level, eps) {
  const at = (dCC, dEt, dCF, dGA) =>
    lnN(
      level,
      C_C_PINNED * Math.exp(dCC),
      E_TRUNC_PT * Math.exp(dEt),
      1.0 * Math.exp(dCF),
      1.0 * Math.exp(dGA),
    );
  const E_CC = (at(eps, 0, 0, 0) - at(-eps, 0, 0, 0)) / (2 * eps);
  const E_ET = (at(0, eps, 0, 0) - at(0, -eps, 0, 0)) / (2 * eps);
  const E_CF = (at(0, 0, eps, 0) - at(0, 0, -eps, 0)) / (2 * eps);
  const E_A1 = (at(0, 0, 0, eps) - at(0, 0, 0, -eps)) / (2 * eps);
  // Naive four-axis diagonal: all four amplitudes scaled by exp(s) -> E_flow over-scaled by exp(2s).
  const DIAG4 = (at(eps, eps, eps, eps) - at(-eps, -eps, -eps, -eps)) / (2 * eps);
  // Corrected diagonal: C_F and A1 each by eps/2 so E_flow scales by exp(eps) like the other two terms.
  const DIAG4c = (at(eps, eps, eps / 2, eps / 2) - at(-eps, -eps, -eps / 2, -eps / 2)) / (2 * eps);
  const SUM4 = E_CC + E_ET + E_CF + E_A1;
  return { E_CC, E_ET, E_CF, E_A1, DIAG4, DIAG4c, SUM4 };
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS1 = 1e-3; // reproduces imp-97644 step
const EPS2 = 5e-4; // second, halved perturbation step

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0, 1.0);
  const m1 = measure(sigma, EPS1);
  const m2 = measure(sigma, EPS2);
  const addResid1 = m1.DIAG4 - m1.SUM4; // -> 0 as eps^2 if additivity holds
  const addResid2 = m2.DIAG4 - m2.SUM4;
  const addRatio = addResid2 !== 0 ? addResid1 / addResid2 : NaN; // ~4 if residual ~ eps^2
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    elasticity_CC: +m1.E_CC.toFixed(6),
    elasticity_Et: +m1.E_ET.toFixed(6),
    elasticity_CF: +m1.E_CF.toExponential(6),
    elasticity_A1: +m1.E_A1.toExponential(6),
    E_A1_minus_E_CF: +(m1.E_A1 - m1.E_CF).toExponential(3), // == 0: A1 is a redundant copy of C_F
    diagonal4_naive: +m1.DIAG4.toExponential(6), // == E_CF != 0: symmetry BROKEN
    diagonal4_minus_E_CF: +(m1.DIAG4 - m1.E_CF).toExponential(3), // == 0: DIAG4 = E_CF exactly
    diagonal4_corrected: +m1.DIAG4c.toExponential(6), // ~0: symmetry restored (C_F, A1 each by s/2)
    sum_four_axis: +m1.SUM4.toExponential(6), // == E_CF (three-axis zero + one E_CF)
    additivity_resid_eps1e3: +addResid1.toExponential(3),
    additivity_resid_ratio: +addRatio.toFixed(3), // ~4 => DIAG4 = SUM4 holds (additivity survives)
  };
});

const ADD_RATIOS = PER_LANDMARK.map((r) => r.additivity_resid_ratio);

export const IMP97760_FOUR_AXIS_ADDITIVITY_GRONWALL_A1 = {
  id: 'imp-97760',
  proofSection: 'S-frontier',
  question:
    'Does the imp-97644 three-axis scaling symmetry (DIAG3 == 0, forcing E_CC + E_ET + E_CF == 0) extend ' +
    'to a FOURTH amplitude axis -- the imp-3406/imp-33582 Gronwall/A1 factor exp(TC_A1_TRAP) that ' +
    'multiplies E_flow -- as DIAG4 == 0? I.e. does the A1 factor enter E_flow purely multiplicatively so ' +
    'it participates in the same scaling symmetry (like C_F did), or does it break the homogeneity? ' +
    'Derivation/measurement only; pinned constants perturbed only as probes; no bound moves; no QED.',
  method:
    'Add the Gronwall/A1 amplitude as a fourth multiplicative perturbation axis (ga, baseline 1) to the ' +
    'imp-97644 crossing model, so E_flow ~ C_F * A1 (both cf and ga multiply the single flow term), then ' +
    'apply the identical central-difference elasticity procedure (E_CC, E_ET, E_CF, E_A1 single-axis; ' +
    'naive DIAG4 along all four = const; corrected DIAG4c with C_F/A1 scaled by s/2) at three landmarks ' +
    '(sigma = 0.9, 0.5, 0.1) and two steps (eps = 1e-3, 5e-4), reporting the degeneracy E_A1 vs E_CF, the ' +
    'naive four-axis diagonal DIAG4 vs E_CF, the four-term sum, the additivity residual DIAG4 - SUM4 and ' +
    'its eps-scaling, and the corrected diagonal DIAG4c.',
  steps_probed: { eps_primary: EPS1, eps_secondary: EPS2 },
  perLandmark: PER_LANDMARK,
  finding: {
    B1_a1_is_redundant_copy_of_cf:
      'E_A1 == E_CF to machine precision (difference exactly 0 at finite eps) at every landmark: E_flow ~ ' +
      'C_F * A1 depends on cf and ga only through their product, so the two single-axis elasticities are ' +
      'identical. The A1 factor DOES enter E_flow purely multiplicatively, exactly like the imp-398 C_F ' +
      'prefactor -- which is precisely why it is a REDUNDANT re-parameterisation of the flow amplitude, ' +
      'not an independent fourth degree of freedom.',
    B2_naive_diagonal_is_nonzero_diag4_equals_e_cf:
      'DIAG4 == E_CF (measured to machine precision: -2.516314e-1 at L2, -3.998880e-3 at L3, -7.377778e-5 ' +
      'at L4), NOT machine-zero. So DIAG4 == 0 FAILS: scaling all four amplitudes by exp(s) scales the ' +
      'single flow term TWICE (E_flow -> exp(2s) E_flow), so sigma = E_coll/E_N is no longer degree-0 ' +
      'homogeneous and the crossing N_L moves. The answer to the ticket is NO: the fourth axis breaks the ' +
      'naive diagonal symmetry.',
    B3_additivity_survives_constraint_is_sum4_equals_e_cf:
      'Additivity DIAG4 = E_CC + E_ET + E_CF + E_A1 still holds: the residual DIAG4 - SUM4 quarters when ' +
      'eps halves (ratios ~4.0), so it is O(eps^2) -> 0. Via the imp-97644 three-axis zero (E_CC+E_ET+E_CF ' +
      '== 0) and E_A1 == E_CF, the four-term constraint is E_CC + E_ET + E_CF + E_A1 = E_CF != 0. The ' +
      'genuine scaling symmetry is THREE-dimensional (one amplitude per term E_coll/E_trunc/E_flow); ' +
      'splitting the flow amplitude into C_F and A1 makes the family rank-deficient by one. The corrected ' +
      'diagonal (C_F and A1 each scaled by exp(s/2), so E_flow scales by exp(s)) is machine-zero, ' +
      'restoring the symmetry.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier cross-check, NOT rigorous). The imp-97644 three-axis scaling ' +
    'symmetry does NOT extend to a fourth axis as DIAG4 == 0. The imp-3406 Gronwall/A1 factor enters ' +
    'E_flow purely multiplicatively -- exactly like the imp-398 C_F prefactor -- so E_flow is proportional ' +
    'to the PRODUCT C_F * A1 and the A1 axis is DEGENERATE with C_F: E_A1 == E_CF to machine precision at ' +
    'the imp-97520 L2 (sigma = 0.9, N = 2.572361e7), L3 (halving, N = 3.267235e9) and L4 (sigma = 0.1, ' +
    'N = 3.213181e11) landmarks alike. Scaling all four amplitudes by exp(s) therefore scales the single ' +
    'flow term TWICE (E_flow -> exp(2s) E_flow), so sigma = E_coll/E_N loses its degree-0 homogeneity and ' +
    'the crossing N_L moves: the naive four-axis diagonal is DIAG4 == E_CF (measured to machine precision, ' +
    '-2.516314e-1 at L2 down to -7.377778e-5 at L4), NOT machine-zero. Additivity ITSELF survives -- ' +
    'DIAG4 = E_CC + E_ET + E_CF + E_A1 holds to O(eps^2) (residual quarters when eps = 1e-3 -> 5e-4) -- ' +
    'and via the three-axis zero the four-term constraint reduces to E_CC + E_ET + E_CF + E_A1 = E_CF. ' +
    'What breaks is homogeneity, not additivity: the genuine scaling symmetry is three-dimensional (one ' +
    'amplitude per term), and scaling C_F and A1 by exp(s/2) each restores DIAG4c == 0 (machine-zero). ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned ' +
    'E_trunc 3.06e-5, the imp-398 C_F prefactor and the imp-3406 Gronwall/A1 factor (TC_A1_TRAP = ' +
    '2.37e-4) are UNTOUCHED (perturbed only as probes, not re-pinned); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97644 (three-axis DIAG3 == 0 scaling symmetry, E_CC+E_ET+E_CF=0, E_CF linearity); imp-97623 ' +
    '(two-axis C_C/E_trunc additivity residual ~ eps^2); imp-97565 (C_C-axis elasticity); imp-97584 ' +
    '(E_trunc-axis elasticity); imp-97520 (four-landmark ladder L1..L4); imp-398 (C_F flow prefactor); ' +
    'imp-3406/imp-33582 (Gronwall/A1 factor TC_A1_TRAP = 2.37e-4); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97760_FOUR_AXIS_ADDITIVITY_GRONWALL_A1_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97520/imp-97644 ladder positions (L2, L3, L4) with the A1 axis added.
    id: 'imp97760-landmarks-reproduce-imp97644',
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
    // (B1): the A1 factor is a redundant copy of C_F -- E_A1 == E_CF to machine precision everywhere.
    id: 'imp97760-a1-is-redundant-copy-of-cf',
    description: 'E_A1 == E_CF to machine precision (|E_A1 - E_CF| < 1e-12) at every landmark: degenerate axis',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.E_A1_minus_E_CF) < 1e-12),
  },
  {
    // (B2): the naive four-axis diagonal is NON-zero -- DIAG4 == E_CF (symmetry broken), NOT machine-zero.
    id: 'imp97760-naive-diagonal-is-nonzero',
    description: 'DIAG4 == E_CF to machine precision AND |DIAG4| > 1e-9 at every landmark: DIAG4 == 0 FAILS',
    holds: () =>
      PER_LANDMARK.every(
        (r) => Math.abs(r.diagonal4_minus_E_CF) < 1e-9 && Math.abs(r.diagonal4_naive) > 1e-9,
      ),
  },
  {
    // (B3): additivity itself survives -- DIAG4 - SUM4 quarters when eps halves (ratio ~4) at each landmark.
    id: 'imp97760-additivity-survives-eps-squared',
    description: 'DIAG4 - SUM4 quarters when eps halves at every landmark (ratio in [3.5, 4.5]): additivity holds',
    holds: () => ADD_RATIOS.every((q) => q > 3.5 && q < 4.5),
  },
  {
    // (B3): the corrected diagonal (C_F, A1 each by s/2) restores the symmetry -- machine-zero everywhere.
    id: 'imp97760-corrected-diagonal-restores-symmetry',
    description: 'DIAG4c (C_F, A1 each scaled by s/2) is machine-zero (|DIAG4c| < 1e-9): 3-dim symmetry intact',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.diagonal4_corrected) < 1e-9),
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp97760-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97760_FOUR_AXIS_ADDITIVITY_GRONWALL_A1.isRigorous === false &&
      /NO QED/.test(IMP97760_FOUR_AXIS_ADDITIVITY_GRONWALL_A1.verdict) &&
      /refereed bound is changed/i.test(IMP97760_FOUR_AXIS_ADDITIVITY_GRONWALL_A1.verdict),
  },
];

for (const a of IMP97760_FOUR_AXIS_ADDITIVITY_GRONWALL_A1_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97760-four-axis-additivity-gronwall-a1 assertion failed: ${a.id}`);
  }
}
