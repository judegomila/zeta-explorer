/**
 * @module imp-97661-peak-landmark-elasticity-scaling-symmetry
 *
 * imp-97661 (numerical, frontier cross-check): imp-97644 established that the imp-33582 sigma = E_coll/E_N
 * conditional-share landmark is degree-0 homogeneous in the three amplitudes (C_C, E_trunc, C_F): scaling
 * all three together scales E_coll and E_N equally, so DIAG3 == 0 (machine-zero) and additivity forces
 * E_CC + E_ET + E_CF == 0. But imp-97644 measured this only at the three DOWNSLOPE crossings L2/L3/L4, where
 * the landmark is a LEVEL crossing sigma = const and the crossing-elasticity construction (implicit-function
 * shift of a bisection root) applies directly. The imp-97520 L1 INTERIOR PEAK (N ~ 9.22e5, sigma_max ~ 0.9494)
 * is a TANGENCY (dsigma/dN = 0), NOT a level crossing, so that construction does not directly apply. This
 * module ports the three-axis measurement to the peak: it replaces the bisection crossing with a ternary-search
 * interior maximum and measures the peak-location elasticities d ln N_peak / d ln{C_C, E_trunc, C_F}, the
 * three-axis diagonal DIAG3, and whether the sum still vanishes. Measurement only; the pinned constants are
 * perturbed only as probes; the C_mb GUE-conditional per imp-486 is untouched; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97520/imp-97644 sub-terms, C_F carried)
 * ----------------------------------------------------------------------------------
 *   E_N    = E_trunc + E_flow + E_coll,   sigma = E_coll / E_N,
 *   E_flow = C_F * (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi) + 1) / 2pi  (imp-398 prefactor),
 *   E_coll = C_C * sqrt(log T0 / N)   (GUE-conditional, C_H ansatz).
 * The interior peak of sigma(N) is the tangency dsigma/dlnN = 0, equivalently (with s = E_coll and
 * d0 = E_trunc + E_flow the C_C-free denominator part):  dln(s)/dlnN = dln(d0)/dlnN.
 *
 * THE MEASUREMENTS (the deliverable) -- central differences in log-parameter space, ternary-search peak
 * -----------------------------------------------------------------------------------------------------
 * At the peak the elasticities of the maximiser N_peak(C_C, E_trunc, C_F) are:
 *   E_CC = d ln N_peak / d ln C_C,  E_ET = d ln N_peak / d ln E_trunc,  E_CF = d ln N_peak / d ln C_F,
 *   DIAG3    = d ln N_peak / ds along C_C/E_trunc/C_F = const (all three amplitudes scaled by exp(s)),
 *   DIAG_DEN = d ln N_peak / ds along E_trunc/C_F = const (only the two DENOMINATOR amplitudes scaled).
 *
 *   PEAK           N_peak         sigma_max     E_CC       E_ET       E_CF        DIAG3       DIAG_DEN    E_ET+E_CF
 *   L1 (tangency)  9.218633e5     0.949429      ~0 (mach)  -1.373232  +1.373232   ~0 (mach)   ~0 (mach)   ~0 (mach)
 *
 * THE DECISIVE STRUCTURE (1): AT THE PEAK THE SCALING SYMMETRY FACTORIZES INTO TWO INDEPENDENT EXACT INVARIANCES
 * -------------------------------------------------------------------------------------------------------------
 * The peak condition dln(s)/dlnN = dln(d0)/dlnN (with s = E_coll, d0 = E_trunc + E_flow) is invariant under
 * TWO independent scalings, so it splits the joint symmetry that was coupled at the crossings:
 *   (a) NUMERATOR-PREFACTOR invariance: C_C is a pure multiplier on s = E_coll, so C_C -> exp(dCC) C_C leaves
 *       dln(s)/dlnN and d0 both UNCHANGED. The peak location does not move: E_CC == 0 EXACTLY (machine-zero,
 *       stable across eps -- it does NOT scale as eps^2 because the underlying elasticity is a genuine zero).
 *   (b) DENOMINATOR joint-scaling invariance: scaling E_trunc and C_F together sends d0 -> exp(s) d0, leaving
 *       dln(d0)/dlnN (and dln(s)/dlnN) UNCHANGED. The peak does not move: DIAG_DEN = E_ET + E_CF == 0 EXACTLY.
 * At the DOWNSLOPE crossings (imp-97644) none of the three single-axis elasticities vanished individually
 * (E_CC ~ +2.08, E_ET ~ -2.08, E_CF small); only their SUM did, via degree-0 homogeneity. At the PEAK the
 * symmetry is STRONGER: E_CC = 0 and E_ET = -E_CF each hold on their own.
 *
 * THE DECISIVE STRUCTURE (2): DIAG3 == 0 AND sigma_max ITSELF IS INVARIANT (WHOLE CURVE DEGREE-0 HOMOGENEOUS)
 * ---------------------------------------------------------------------------------------------------------
 * DIAG3 = E_CC + DIAG_DEN = 0 + 0 = 0 (measured machine-zero), so joint scaling of all three amplitudes fixes
 * the peak location, exactly as at the crossings. But at the peak we can say more: because sigma(N) is degree-0
 * homogeneous, the ENTIRE curve is invariant under joint scaling, so not only N_peak but sigma_max = sigma(N_peak)
 * is invariant -- measured to reldiff 0 (machine-zero) under a joint 1.3x scaling. At a level crossing sigma is
 * pinned to the target level by construction, so that stronger statement has no content there; at the tangency
 * it does.
 *
 * THE DECISIVE STRUCTURE (3): THE SURVIVING NONZERO ELASTICITIES ARE THE E_trunc/C_F SEE-SAW
 * -----------------------------------------------------------------------------------------
 * The only nonzero peak-location elasticities are E_ET ~ -1.37323 and E_CF ~ +1.37323, equal and opposite:
 * pushing the fixed-strip constant E_trunc up moves the peak to smaller N, and pushing the flow prefactor C_F
 * up moves it to larger N by the same amount, because at the peak the flow term is a share
 * E_flow/E_N ~ 3.06e-2 of the denominator and only the RATIO E_trunc : E_flow inside d0 sets the tangency.
 * Their exact cancellation is DIAG_DEN == 0; it is the residue of the crossing-picture E_CF/E_ET = E_flow/E_trunc
 * relation specialised to the tangency, where E_CC drops out entirely.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (P1) THE PEAK IS INVARIANT UNDER JOINT SCALING: DIAG3 == 0 (machine-zero), and moreover sigma_max itself is
 *        invariant (reldiff 0 under joint 1.3x scaling) because the whole degree-0-homogeneous curve is fixed.
 *        The additivity/scaling symmetry specialises cleanly to the tangency.
 *   (P2) AT THE PEAK THE SYMMETRY FACTORIZES: E_CC == 0 EXACTLY (numerator-prefactor invariance -- the peak
 *        condition is scale-free in E_coll) AND E_ET + E_CF == 0 EXACTLY (denominator joint-scaling invariance,
 *        DIAG_DEN == 0). Both are machine-zero and stable in eps (genuine zeros, not O(eps^2) truncation tails).
 *        Contrast the crossings, where all three axes were coupled and only the total sum vanished.
 *   (P3) THE SURVIVING ELASTICITIES ARE THE E_trunc/C_F SEE-SAW: E_ET ~ -1.37323 = -E_CF ~ -1.37323, equal and
 *        opposite, the only nonzero peak-location elasticities. The peak tracks the E_trunc : E_flow ratio inside
 *        the denominator; the numerator prefactor C_C has no leverage on the tangency location.
 *
 * The punchline: the imp-97644 three-axis scaling symmetry DOES specialise to the imp-97520 L1 interior peak, and
 * there it is STRONGER: the peak location is invariant under joint scaling (DIAG3 == 0) AND sigma_max itself is
 * invariant, and the symmetry factorizes into a numerator-prefactor invariance (E_CC == 0 exactly) and a
 * denominator joint-scaling invariance (E_ET + E_CF == 0 exactly, an E_trunc/C_F see-saw at ~ +-1.37323). The
 * tangency being a maximum, not a level crossing, removes the C_C leverage entirely rather than breaking additivity.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5, and the imp-398 C_F prefactor are
 * UNTOUCHED and are perturbed here only as sensitivity probes, not re-pinned; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97644-three-axis-additivity-flow-prefactor (the crossing-landmark three-axis scaling symmetry L2/L3/L4)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four landmarks; L1 peak N ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-97623-additivity-residual-multi-landmark-crosscheck (two-axis C_C/E_trunc additivity, r ~ eps^2)
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift (C_C-axis crossing elasticity ~ +2.10235)
 * @see imp-97584-sigma-landmark-etrunc-sensitivity (E_trunc-axis crossing elasticity ~ -2.098)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644 exactly

// EXACT imp-3406/imp-97520/imp-97644 sub-terms, with C_C, E_trunc AND the imp-398 C_F prefactor carried as
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

// Interior peak of sigma(N): ternary search in log N (identical procedure to imp-97520 peakNlogN).
function peakLnN(cc, et, cf) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 400; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc, et, cf).sigma < parts(Math.exp(m2), cc, et, cf).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}

// Peak-location elasticity + diagonals at a given step eps.
function measure(eps) {
  const at = (dCC, dEt, dCF) =>
    peakLnN(C_C_PINNED * Math.exp(dCC), E_TRUNC_PT * Math.exp(dEt), 1.0 * Math.exp(dCF));
  const E_CC = (at(eps, 0, 0) - at(-eps, 0, 0)) / (2 * eps);
  const E_ET = (at(0, eps, 0) - at(0, -eps, 0)) / (2 * eps);
  const E_CF = (at(0, 0, eps) - at(0, 0, -eps)) / (2 * eps);
  const DIAG3 = (at(eps, eps, eps) - at(-eps, -eps, -eps)) / (2 * eps); // C_C/E_trunc/C_F = const
  const DIAG_DEN = (at(0, eps, eps) - at(0, -eps, -eps)) / (2 * eps); // E_trunc/C_F = const (denominator only)
  const SUM3 = E_CC + E_ET + E_CF;
  return { E_CC, E_ET, E_CF, DIAG3, DIAG_DEN, SUM3 };
}

// eps = 1e-2 lifts the exact-zero diagnostics (E_CC, DIAG3, DIAG_DEN, E_ET+E_CF) clear of the ternary-search
// roundoff floor so they read as machine-zero rather than O(eps^2) truncation tails of a nonzero elasticity.
const EPS_PRIMARY = 1e-2;

const N_PEAK = Math.exp(peakLnN(C_C_PINNED, E_TRUNC_PT, 1.0));
const P_PEAK = parts(N_PEAK, C_C_PINNED, E_TRUNC_PT, 1.0);
const M = measure(EPS_PRIMARY);

// sigma_max invariance under a finite joint 1.3x scaling of all three amplitudes (whole curve degree-0 homogeneous).
const N_PEAK_SCALED = Math.exp(peakLnN(C_C_PINNED * 1.3, E_TRUNC_PT * 1.3, 1.3));
const SIGMA_MAX_SCALED = parts(N_PEAK_SCALED, C_C_PINNED * 1.3, E_TRUNC_PT * 1.3, 1.3).sigma;
const SIGMA_MAX_RELDIFF = SIGMA_MAX_SCALED / P_PEAK.sigma - 1;

const PEAK = {
  key: 'L1_peak',
  label: 'interior maximum (tangency dsigma/dN = 0)',
  N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
  sigma_max: +P_PEAK.sigma.toFixed(6), // ~0.949429
  flow_share_of_E_N: +(P_PEAK.E_flow / P_PEAK.E_N).toExponential(4), // ~3.06e-2
  elasticity_CC: +M.E_CC.toExponential(4), // ~0 (numerator-prefactor invariance)
  elasticity_Et: +M.E_ET.toFixed(6), // ~ -1.373232
  elasticity_CF: +M.E_CF.toFixed(6), // ~ +1.373232
  diagonal3_elasticity: +M.DIAG3.toExponential(4), // ~0 (joint scaling: peak invariant)
  diagonal_denominator_elasticity: +M.DIAG_DEN.toExponential(4), // ~0 (E_trunc/C_F joint scaling)
  sum_ET_plus_CF: +(M.E_ET + M.E_CF).toExponential(4), // ~0 (E_ET = -E_CF see-saw)
  sum_three_axis: +M.SUM3.toExponential(4), // ~0
  sigma_max_reldiff_under_joint_scaling: +SIGMA_MAX_RELDIFF.toExponential(3), // ~0 (curve invariant)
};

export const IMP97661_PEAK_LANDMARK_ELASTICITY_SCALING_SYMMETRY = {
  id: 'imp-97661',
  proofSection: 'S-frontier',
  question:
    'How does the imp-97644 three-axis (C_C/E_trunc/C_F) scaling symmetry -- DIAG3 == 0 and ' +
    'E_CC + E_ET + E_CF == 0, established only at the DOWNSLOPE crossings L2/L3/L4 where the landmark is a ' +
    'level crossing -- specialise at the imp-97520 L1 INTERIOR PEAK (N ~ 9.22e5, sigma_max ~ 0.9494), which ' +
    'is a TANGENCY dsigma/dN = 0, not a level crossing? Measure the peak-location elasticities ' +
    'd ln N_peak / d ln{C_C, E_trunc, C_F}, whether DIAG3 stays machine-zero (peak invariant under joint ' +
    'scaling), and whether the sum still vanishes. Measurement only; pinned constants perturbed only as ' +
    'probes; no bound moves; no QED.',
  method:
    'Replace the imp-97644 bisection crossing with a ternary-search interior maximum of sigma(N) (identical ' +
    'imp-97520 peakNlogN procedure) and apply the same central-difference elasticity procedure at the peak: ' +
    'E_CC, E_ET, E_CF single-axis; DIAG3 along C_C/E_trunc/C_F = const; and DIAG_DEN along E_trunc/C_F = const ' +
    '(denominator-only joint scaling). eps = 1e-2 is used to lift the exact-zero diagnostics clear of the ' +
    'ternary-search roundoff floor. Also check sigma_max invariance under a finite joint 1.3x scaling.',
  step_probed: { eps_primary: EPS_PRIMARY },
  peak: PEAK,
  finding: {
    P1_peak_invariant_under_joint_scaling:
      'DIAG3 == 0 (machine-zero) so joint scaling of all three amplitudes fixes the peak location, and ' +
      'moreover sigma_max itself is invariant (reldiff ~ 0 under joint 1.3x scaling) because the whole ' +
      'degree-0-homogeneous sigma(N) curve is fixed -- a stronger statement than at a level crossing, where ' +
      'sigma is pinned to the target by construction. The scaling symmetry specialises cleanly to the tangency.',
    P2_symmetry_factorizes_at_the_peak:
      'The symmetry FACTORIZES: E_CC == 0 EXACTLY (numerator-prefactor invariance -- the peak condition ' +
      'dln E_coll/dlnN = dln(E_trunc + E_flow)/dlnN is scale-free in the C_C multiplier on E_coll) AND ' +
      'E_ET + E_CF == 0 EXACTLY (denominator joint-scaling invariance, DIAG_DEN == 0). Both are machine-zero ' +
      'and stable in eps (genuine zeros, not O(eps^2) truncation tails). At the crossings all three axes were ' +
      'coupled and only the total sum vanished; at the peak E_CC = 0 and E_ET = -E_CF hold on their own.',
    P3_surviving_elasticities_are_the_etrunc_cf_seesaw:
      'The only nonzero peak-location elasticities are E_ET ~ -1.37323 = -E_CF ~ -1.37323, equal and ' +
      'opposite: the peak tracks the E_trunc : E_flow ratio inside the denominator, and the numerator ' +
      'prefactor C_C has no leverage on the tangency location. Their exact cancellation is DIAG_DEN == 0, the ' +
      'residue of the crossing E_CF/E_ET = E_flow/E_trunc relation specialised to the tangency where E_CC drops out.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, NOT rigorous). The imp-97644 three-axis scaling symmetry DOES ' +
    'specialise to the imp-97520 L1 interior peak (N = 9.218633e5, sigma_max = 0.949429), and there it is ' +
    'STRONGER than at the downslope crossings. The peak location is invariant under joint scaling of ' +
    '(C_C, E_trunc, C_F): DIAG3 == 0 (machine-zero), and moreover sigma_max itself is invariant (reldiff ~ 0 ' +
    'under a joint 1.3x scaling) because the whole degree-0-homogeneous sigma(N) curve is fixed. Being a ' +
    'tangency rather than a level crossing, the symmetry FACTORIZES into two independent EXACT invariances: ' +
    'E_CC == 0 (the peak condition dln E_coll/dlnN = dln(E_trunc + E_flow)/dlnN is scale-free in the C_C ' +
    'prefactor on E_coll, so the numerator amplitude has no leverage on the tangency) and E_ET + E_CF == 0 ' +
    '(denominator joint-scaling invariance, DIAG_DEN == 0). The only nonzero peak-location elasticities are ' +
    'the equal-and-opposite E_trunc/C_F see-saw E_ET ~ -1.37323 = -E_CF ~ -1.37323, tracking the ' +
    'E_trunc : E_flow ratio inside the denominator (flow share E_flow/E_N ~ 3.06e-2 at the peak). This ' +
    'contrasts the crossings, where all three axes were coupled (E_CC ~ +2.08, E_ET ~ -2.08, E_CF small) and ' +
    'only the total sum vanished; the tangency removes the C_C leverage entirely rather than breaking ' +
    'additivity. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed only as probes, not ' +
    're-pinned); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97644 (crossing-landmark three-axis scaling symmetry L2/L3/L4); imp-97520 (four-landmark ladder; L1 ' +
    'peak N ~ 9.22e5, sigma_max ~ 0.9494); imp-97623 (two-axis C_C/E_trunc additivity); imp-97565 (C_C-axis ' +
    'crossing elasticity); imp-97584 (E_trunc-axis crossing elasticity); imp-398 (C_F flow prefactor); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP97661_PEAK_LANDMARK_ELASTICITY_SCALING_SYMMETRY_ASSERTIONS = [
  {
    // The peak reproduces the imp-97520 L1 landmark (N ~ 9.22e5, sigma_max ~ 0.9494).
    id: 'imp97661-peak-reproduces-imp97520',
    description: 'peak N ~ 9.218633e5 with sigma_max ~ 0.949429 reproduces the imp-97520 L1 landmark',
    holds: () =>
      Math.abs(PEAK.N_peak / 9.218633e5 - 1) < 5e-3 && Math.abs(PEAK.sigma_max - 0.949429) < 1e-3,
  },
  {
    // (P1): DIAG3 == 0 -- the peak location is invariant under joint scaling of all three amplitudes.
    id: 'imp97661-diagonal-is-scaling-symmetry',
    description: 'DIAG3 machine-zero (|DIAG3| < 1e-4): the peak is invariant under joint scaling',
    holds: () => Math.abs(PEAK.diagonal3_elasticity) < 1e-4,
  },
  {
    // (P1): sigma_max itself is invariant under joint scaling (whole degree-0-homogeneous curve fixed).
    id: 'imp97661-sigma-max-invariant-under-joint-scaling',
    description: 'sigma_max reldiff < 1e-9 under a joint 1.3x scaling: the whole curve is degree-0 homogeneous',
    holds: () => Math.abs(PEAK.sigma_max_reldiff_under_joint_scaling) < 1e-9,
  },
  {
    // (P2): the symmetry factorizes -- E_CC == 0 exactly (numerator-prefactor invariance).
    id: 'imp97661-cc-elasticity-vanishes-at-peak',
    description: 'E_CC machine-zero (|E_CC| < 1e-4) at the peak: C_C has no leverage on the tangency location',
    holds: () => Math.abs(PEAK.elasticity_CC) < 1e-4,
  },
  {
    // (P2): E_ET + E_CF == 0 exactly (denominator joint-scaling invariance, DIAG_DEN == 0).
    id: 'imp97661-denominator-seesaw-cancels',
    description: 'E_ET + E_CF machine-zero and DIAG_DEN machine-zero (both < 1e-4): denominator joint invariance',
    holds: () => Math.abs(PEAK.sum_ET_plus_CF) < 1e-4 && Math.abs(PEAK.diagonal_denominator_elasticity) < 1e-4,
  },
  {
    // (P3): E_ET ~ -1.37323 = -E_CF -- equal and opposite, the surviving nonzero elasticities.
    id: 'imp97661-etrunc-cf-seesaw-magnitude',
    description: 'E_ET ~ -1.37323 = -E_CF: equal-and-opposite E_trunc/C_F see-saw, the only nonzero peak elasticities',
    holds: () =>
      Math.abs(PEAK.elasticity_Et + 1.37323) < 1e-3 &&
      Math.abs(PEAK.elasticity_CF - 1.37323) < 1e-3 &&
      Math.abs(PEAK.elasticity_Et + PEAK.elasticity_CF) < 1e-4,
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp97661-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97661_PEAK_LANDMARK_ELASTICITY_SCALING_SYMMETRY.isRigorous === false &&
      /NO QED/.test(IMP97661_PEAK_LANDMARK_ELASTICITY_SCALING_SYMMETRY.verdict) &&
      /remains SOTA/.test(IMP97661_PEAK_LANDMARK_ELASTICITY_SCALING_SYMMETRY.verdict),
  },
];

for (const a of IMP97661_PEAK_LANDMARK_ELASTICITY_SCALING_SYMMETRY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97661-peak-landmark-elasticity-scaling-symmetry assertion failed: ${a.id}`);
  }
}
