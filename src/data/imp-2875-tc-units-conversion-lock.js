/**
 * @module imp-2875-tc-units-conversion-lock
 *
 * imp-2875 (accuracy, S7): UNITS-AUDIT TRIPWIRE locking the de Bruijn-Newman vs
 * CM-flow t_c conversion factor (imp-2636). A wrong t_c normalization is the
 * documented trap that forced the imp-2630 / imp-2621 corrections; the units
 * audit (imp-2636-units-audit.js) established the conversion factor from source
 * but had NO build-time regression lock. The exact historical failure mode is a
 * future edit re-introducing a factor-N rescaling on one of the three
 * load-bearing collision-time objects, which would silently move the exponent
 * that feeds the tc-part-vs-mf linchpin (imp-2639) and E(N).
 *
 * WHAT THIS LOCKS
 * --------------
 *   (a) THE THREE LOAD-BEARING ODES ARE THE SAME FLOW. gronwall (Lemma D),
 *       sg1c (theta-contraction) and the bridge dysonDerivBackward all carry
 *       flow coefficient -2 on the UNNORMALIZED particles, in the s=-t de
 *       Bruijn-Newman time, i.e. dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j). The
 *       lock pins all three coefficients and the audit-level flowCoefficient at
 *       -2 (any factor-N rescaling perturbs at least one of them).
 *   (b) THE CONVERSION FACTOR IS UNCHANGED. (sg1c/gronwall CM-flow t_c) ->
 *       (bridge t_c_proj) is exactly 1, and the audit still classifies the ~30x
 *       ratio as PHYSICAL (thirtyXRatioIsUnitsArtifact === false), not a
 *       normalization artifact.
 *   (c) |t_c| STAYS INSIDE THE A1 TRAP 2.37e-4 (imp-2762). The A1 Theta-trap
 *       collision time g_min^2/6 the bridge exponent consumes stays bracketed
 *       strictly below the downstream display ceiling 2.37e-4, so the load-
 *       bearing exponent ceiling cannot drift past the certified trap.
 *
 * HONEST SCOPE -- NO FALSE QED
 * ----------------------------
 * This locks the units/conversion CLASSIFICATION and the A1 trap ceiling only.
 * It does NOT settle the imp-2639 R2 which-object question (t_c^part vs t_c^MF),
 * does NOT perform a fresh 1e4 backward-CM integration (imp-2636 residual R1),
 * and changes no Lambda value. It only guarantees that the conversion factor and
 * the trap ceiling the linchpin leans on cannot be silently re-normalized.
 *
 * Side-effect imported by assertion-sweep-2026-04-12.js so the throws below stay
 * reachable from the production import graph (dead-assertion audit, imp-501).
 *
 * @see imp-2636-units-audit (the conversion-factor=1 verdict this locks)
 * @see imp-2762-tc-a1-trap-interval (the A1 trap bracket below 2.37e-4)
 * @see tc-part-vs-mf-linchpin-finding (the 30x ratio; imp-2639 R2 feeding E(N))
 */

import { UNITS_AUDIT_IMP2636 } from './imp-2636-units-audit.js';
import { IMP2762_TC_A1_TRAP_INTERVAL } from './imp-2762-tc-a1-trap-interval.js';

const U = UNITS_AUDIT_IMP2636;
const S = U.sources;
const TRAP = IMP2762_TC_A1_TRAP_INTERVAL.trapInterval;

export const IMP2875_TC_UNITS_CONVERSION_LOCK = {
  id: 'imp-2875',
  title: 'Units-audit tripwire locking the de Bruijn-Newman vs CM-flow t_c conversion factor (imp-2636)',
  guards: {
    flowCoefficient: U.flowCoefficient,                       // -2
    gronwallCoefficient: S.gronwall.coefficient,              // -2
    sg1cCoefficient: S.sg1c.coefficient,                      // -2
    bridgeCoefficient: S.bridgeTcProj.coefficient,            // -2
    conversionFactor: U.conversionFactor,                    // 1 (exact)
    thirtyXRatioIsUnitsArtifact: U.thirtyXRatioIsUnitsArtifact, // false
    trapHi: TRAP.hi,                                          // ~2.3687e-4
    trapNominal: TRAP.nominalFloat,                           // g_min^2/6
    trapDisplayCeiling: TRAP.displayCeiling,                  // 2.37e-4
  },
  rationale:
    'imp-2636 established from source that the gronwall Lemma D, sg1c theta-contraction ' +
    'and bridge dysonDerivBackward objects all evolve dx_k/ds = -2 sum 1/(x_k-x_j) on the ' +
    'UNNORMALIZED particles in s=-t de Bruijn-Newman time, so the conversion factor between ' +
    'the CM-flow t_c and the bridge t_c_proj is exactly 1 and the 30x ratio is physical. A ' +
    'future normalization edit re-introducing a factor-N rescaling (the documented imp-2630/' +
    'imp-2621 trap) would silently move the linchpin exponent with no signal. This lock fails ' +
    'the build the moment any of the three flow coefficients, the unity conversion factor, the ' +
    'physical-ratio classification, or the A1 trap ceiling 2.37e-4 (imp-2762) drifts. It locks ' +
    'CLASSIFICATION and the trap ceiling only; it does not settle the imp-2639 which-object R2.',
  source: 'imp-2636 (units audit, conversion factor = 1); imp-2762 (A1 trap interval below 2.37e-4); imp-2875 (this lock)',
};

export const IMP2875_TC_UNITS_CONVERSION_LOCK_ASSERTIONS = [
  {
    id: 'imp2875-three-odes-share-the-minus-two-flow',
    description:
      '(a) gronwall, sg1c and the bridge dysonDerivBackward all carry flow coefficient -2 on the unnormalized particles in s=-t de Bruijn-Newman time (no factor-N rescaling on any of the three load-bearing ODEs)',
    holds: () =>
      U.flowCoefficient === -2 &&
      S.gronwall.coefficient === -2 &&
      S.sg1c.coefficient === -2 &&
      S.bridgeTcProj.coefficient === -2 &&
      S.gronwall.units === 'de Bruijn-Newman' &&
      S.sg1c.units === 'de Bruijn-Newman' &&
      S.bridgeTcProj.units === 'de Bruijn-Newman',
  },
  {
    id: 'imp2875-conversion-factor-stays-unity-ratio-physical',
    description:
      '(b) the pinned (sg1c/gronwall t_c) -> (bridge t_c_proj) conversion factor is exactly 1 and the ~30x ratio stays classified PHYSICAL, not a normalization artifact',
    holds: () =>
      U.conversionFactor === 1 &&
      U.thirtyXRatioIsUnitsArtifact === false,
  },
  {
    id: 'imp2875-tc-stays-inside-the-a1-trap-2p37e-4',
    description:
      '(c) the A1 Theta-trap collision time g_min^2/6 the bridge exponent consumes stays bracketed strictly inside the A1 trap ceiling 2.37e-4 (imp-2762)',
    holds: () =>
      TRAP.hi < 2.37e-4 &&
      TRAP.nominalFloat > 0 &&
      TRAP.nominalFloat < 2.37e-4 &&
      TRAP.displayCeiling === 2.37e-4,
  },
];

for (const a of IMP2875_TC_UNITS_CONVERSION_LOCK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2875-tc-units-conversion-lock assertion failed: ${a.id}`);
  }
}
