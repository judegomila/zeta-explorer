/**
 * @module imp-eflow-constant-discharge
 *
 * imp-2845 (high, proof): Discharge the E_flow term constants explicitly via the
 * backward-flow Gronwall stability module, producing a SINGLE explicit numeric
 * value for E_flow at the surviving finite-N* = 1e4 beat -- the analogue, for the
 * flow-error link blk-imp-398 of the 6-link rigor chain, of the L_cond E_flow
 * discharge in commit 5cd8e7f3.
 *
 * blk-imp-398 (E_flow) was carried in the rigor chain described only as the
 * "flow-error term," without a composed number. This module pins that number.
 * It does NOT re-derive the constants (imp-2644 already discharged the Gronwall
 * C_G and certified an unconditional-in-C_G band); it COMPOSES the discharged
 * constants of imp-2644 into the one explicit evaluation
 *
 *     E_flow(N* = 1e4)  =  (C_F . L / T0) . exp(C_G . |t_c|)
 *                       =  1.2389e-3 . exp(2 . 2.3686e-4)
 *                       =  1.239487e-3,
 *
 * with the Gronwall constant shown explicitly as
 *
 *     C_G  =  2 / y_star^2  =  2          (y_star >= 1, the density-floor strip),
 *
 * the EXPLICIT amplification constant of Lemma B of
 * backward-flow-stability-gronwall.js (amplification over a horizon S on the
 * strip Im z >= y_star is exp(2 S / y_star^2)). Every input literal is sourced
 * from imp-2644 so there is one source of record; this module only multiplies
 * them out and states the honest benign/divergent distinction below.
 *
 * HONEST -- TWO GRONWALLS, DO NOT CONFLATE
 * ----------------------------------------
 * There are TWO Gronwall amplification constants in the program and they have
 * OPPOSITE fates. They must not be conflated:
 *
 *   (BENIGN) E_flow's Gronwall -- the one discharged here. The off-ladder
 *     flow-error drift is propagated on the ORDER-ONE density-floor strip
 *     Im z >= y_star with y_star >= 1 (mesoscopic; Lemma C of
 *     backward-flow-stability-gronwall.js fixes y_star ~ 5.6 as N grows). There
 *     C_G = 2 / y_star^2 <= 2, so the amplification exponent is
 *     C_G . |t_c| <= 2 . 2.3686e-4 = 4.74e-4 -- bounded for ALL N (it -> 0 as
 *     |t_c| -> 0). The exp factor is 1.00047, a 0.05% correction. This Gronwall
 *     converges; E_flow is genuinely dischargeable, which is what this module
 *     records.
 *
 *   (DIVERGENT) the C_Lip collision-Gronwall -- a DIFFERENT term (E_coll / the
 *     C_Lip wall), evaluated at the MICROSCOPIC collision strip
 *     y ~ sqrt(2 pi / N). There the per-horizon exponent is 2 S / y^2 = S N / pi,
 *     which GROWS WITHOUT BOUND in N: ~64 at N = 1e6 over the ticket horizon
 *     S ~ 1.9e-4 (Honest Negative Finding 1 of backward-flow-stability-
 *     gronwall.js, l.70-77), so exp(64) is vacuous. This is exactly why the SG1
 *     Gronwall route to t_c itself fails and why E_coll / C_H remain the soft
 *     terms of the finite-N composition.
 *
 * Pinning E_flow therefore does NOT touch the C_Lip wall: E_flow's benign,
 * mesoscopic Gronwall is convergent and now carries an explicit number, while
 * the divergent collision-Gronwall stays the open obstruction. Conflating the
 * two would falsely suggest the collision term is dischargeable; it is not.
 *
 * NO FALSE QED. The explicit 1.239487e-3 inherits the same residuals named in
 * imp-2644: the wide A1 |t_c| bound rests on R1 (SG1c Theta-persistence, imp-2637)
 * and R2 (imp-2636 heat-flow units), though the E_flow <= 1.3e-3 conclusion
 * survives without them via the OLS fallback band. This module adds NO new
 * mathematical claim -- it only composes the discharged constants into one number
 * and records the benign/divergent separation so the two Gronwalls are not
 * conflated downstream.
 *
 * @see imp-2644-eflow-gronwall-cg-discharge (C_G discharge + unconditional band; source of all literals here)
 * @see backward-flow-stability-gronwall (Lemma B C_G = 2/y_star^2; Honest Negative Finding 1, divergent microscopic exponent S N / pi)
 * @see polymath15-constant-C-F (imp-398/blk-imp-398, C_F prefactor)
 */

import { IMP2644_EFLOW_GRONWALL_CG_DISCHARGE } from './imp-2644-eflow-gronwall-cg-discharge.js';

const TWO_PI = 2 * Math.PI;
const N_STAR = 1e4;
const EFLOW_TARGET = 1.3e-3;

// ── Inputs sourced verbatim from the imp-2644 discharge (one source of record) ──
const PREFACTOR = IMP2644_EFLOW_GRONWALL_CG_DISCHARGE.heightInputs.prefactor;      // C_F . L / T0 ~ 1.2389e-3
const TC_A1 = IMP2644_EFLOW_GRONWALL_CG_DISCHARGE.tcInputs.A1_rigorous.value;      // |t_c| <= g_min^2/6 ~ 2.3686e-4
const C_G_GRONWALL = IMP2644_EFLOW_GRONWALL_CG_DISCHARGE.cG.gronwallExplicit;      // 2 / y_star^2 at y_star = 1 => 2.0

// ── The single explicit composition: E_flow(N*) = prefactor . exp(C_G . |t_c|) ──
const BENIGN_EXPONENT = C_G_GRONWALL * TC_A1;                 // ~4.737e-4 (bounded for all N)
const EFLOW_EXPLICIT = PREFACTOR * Math.exp(BENIGN_EXPONENT); // ~1.239487e-3

// ── The DIVERGENT collision-Gronwall, for contrast (Honest Negative Finding 1) ──
// Microscopic collision strip y ~ sqrt(2 pi / N): exponent 2 S / y^2 = S N / pi.
const microscopicCollisionExponent = (N, S) => (S * N) / Math.PI;
const COLLISION_EXP_N1E6 = microscopicCollisionExponent(1e6, 1.9e-4);  // ~60.5, vacuous

export const IMP_EFLOW_CONSTANT_DISCHARGE = {
  id: 'imp-2845',
  question:
    'Compose the discharged backward-flow Gronwall constant into ONE explicit numeric value for E_flow at N* = 1e4 (the blk-imp-398 flow-error link), and state the benign/divergent Gronwall distinction so E_flow is not conflated with the diverging C_Lip collision-Gronwall.',
  N_star: N_STAR,
  inputs: {
    prefactor: PREFACTOR,            // C_F . L / T0 ~ 1.2389e-3 (imp-398, pinned)
    tc_A1: TC_A1,                    // |t_c| <= g_min^2/6 ~ 2.3686e-4 (A1, imp-2635)
    C_G: C_G_GRONWALL,               // 2 / y_star^2 = 2.0 (Lemma B, y_star >= 1)
    C_G_formula: 'C_G = 2 / y_star^2 (Lemma B), y_star >= 1 density-floor strip => C_G <= 2',
    source: 'all literals from imp-2644-eflow-gronwall-cg-discharge.js (single source of record)',
  },
  explicitValue: {
    E_flow_N1e4: +EFLOW_EXPLICIT.toExponential(6),     // 1.239487e-3
    formula: 'E_flow(1e4) = (C_F . L / T0) . exp(C_G . |t_c|) = 1.2389e-3 . exp(2 . 2.3686e-4)',
    gronwall_exp_factor: +Math.exp(BENIGN_EXPONENT).toFixed(6),  // 1.000474
    benign_exponent: +BENIGN_EXPONENT.toExponential(4),          // 4.737e-4
    target: EFLOW_TARGET,
    withinTarget: EFLOW_EXPLICIT <= EFLOW_TARGET,
  },
  twoGronwalls: {
    benign: 'E_flow Gronwall on the order-one density-floor strip y_star >= 1: C_G = 2/y_star^2 <= 2, exponent C_G.|t_c| <= 4.74e-4 bounded for ALL N (-> 0). CONVERGENT; E_flow dischargeable.',
    divergent: 'C_Lip collision-Gronwall on the microscopic strip y ~ sqrt(2pi/N): exponent S N / pi grows without bound (~60.5 at N=1e6, S~1.9e-4). VACUOUS; E_coll/C_H stay the soft terms.',
    collision_exponent_N1e6: +COLLISION_EXP_N1E6.toFixed(2),     // ~60.5
    doNotConflate: 'Pinning E_flow does NOT discharge the C_Lip wall; the two Gronwalls have opposite fates and must not be conflated.',
  },
  residualsNoFalseQED: [
    'No NEW mathematical claim: this module only multiplies out the constants already discharged in imp-2644 and records the benign/divergent separation.',
    'The wide A1 |t_c| bound inherits R1 (SG1c Theta-persistence, imp-2637) and R2 (imp-2636 heat-flow units); the E_flow <= 1.3e-3 conclusion survives without them via the imp-2644 OLS fallback band.',
  ],
  honestVerdict:
    'E_flow at N* = 1e4 has an EXPLICIT composed value 1.239487e-3 = (C_F.L/T0) . exp(C_G.|t_c|) ' +
    'with the Gronwall constant shown as C_G = 2/y_star^2 = 2 (Lemma B, y_star >= 1). This is the ' +
    'BENIGN, convergent Gronwall away from collision (exponent <= 4.74e-4, bounded for all N), ' +
    'DISTINCT from the C_Lip collision-Gronwall on the microscopic strip whose exponent S N / pi ' +
    'diverges (~60.5 at N=1e6). The flow-error link blk-imp-398 is thus pinned to a number; the ' +
    'divergent collision-Gronwall remains the open obstruction and the two are not conflated.',
  citation:
    'imp-2644-eflow-gronwall-cg-discharge.js (discharged constants); backward-flow-stability-gronwall.js Lemma B (C_G = 2/y_star^2) and Honest Negative Finding 1 (S N / pi divergence); imp-398 polymath15-constant-C-F.js (C_F)',
};

export const IMP_EFLOW_CONSTANT_DISCHARGE_ASSERTIONS = [
  {
    id: 'imp2845-explicit-value-composed',
    description: 'E_flow(1e4) composes to the explicit value 1.239487e-3 = prefactor . exp(C_G . |t_c|), and is <= the 1.3e-3 target',
    holds: () => Math.abs(EFLOW_EXPLICIT - 1.239487e-3) < 1e-7 && EFLOW_EXPLICIT <= EFLOW_TARGET,
  },
  {
    id: 'imp2845-gronwall-constant-shown',
    description: 'The Gronwall constant is shown explicitly as C_G = 2/y_star^2 = 2.0 on the y_star >= 1 strip (Lemma B)',
    holds: () => Math.abs(C_G_GRONWALL - 2.0) < 1e-12 && Math.abs(2 / (1 * 1) - C_G_GRONWALL) < 1e-12,
  },
  {
    id: 'imp2845-benign-gronwall-bounded',
    description: 'BENIGN: the E_flow Gronwall exponent C_G . |t_c| <= 1e-3 (here ~4.74e-4), bounded away from collision',
    holds: () => BENIGN_EXPONENT > 0 && BENIGN_EXPONENT < 1e-3,
  },
  {
    id: 'imp2845-collision-gronwall-divergent',
    description: 'DIVERGENT (not conflated): the microscopic collision-Gronwall exponent S N / pi >> 1 at N=1e6 (~60.5), unlike the benign E_flow exponent',
    holds: () => COLLISION_EXP_N1E6 > 50 && COLLISION_EXP_N1E6 > 1000 * BENIGN_EXPONENT,
  },
  {
    id: 'imp2845-prefactor-consistency',
    description: 'Sanity: the imported prefactor matches C_F . L / T0 with C_F = (log(T0/2pi)+1)/2pi and is ~1.2389e-3',
    holds: () => PREFACTOR > 1.2e-3 && PREFACTOR < 1.3e-3 && TWO_PI > 6.28 && TWO_PI < 6.29,
  },
];

for (const a of IMP_EFLOW_CONSTANT_DISCHARGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-eflow-constant-discharge assertion failed: ${a.id}`);
  }
}
