/**
 * @module imp-97025-kmax5-100-wall-viz-data
 * @fileoverview imp-97025 -- import-light viz-data leaf for the imp-96970 kmax=5 2a=1.00 cutting-plane
 *   wall: the guarded-residual cycle over LP rounds 3-12, and the interval-verifier curvature-penalty
 *   relocation as the coarse cell width hc is refined 1e-3 -> 5e-4. Bakes the imp-96970/imp-96991 rows
 *   as plain literals so any consuming page avoids the heavy zeros-bundle import chain.
 *
 * SOURCE. imp-96970 refined the kmax=5, 2a=1.00 LP solve (FINEH 3e-4 -> 1e-4, HP 0.2 -> 0.05, VIOLTOL=0)
 * and found the fine-grid worst guarded residual improves to -0.069 but CYCLES non-monotonically over
 * rounds 3-12 (a cutting-plane wall, not convergence), walled by the tail t^5 guard at t~36.4. Running
 * the interval-rigorous verifier (mpmath.iv prec 80) on the best near-converged iterate at hc=5e-4
 * (finer than imp-96991 hc=1e-3) still returns NOT VERIFIED: the deepest rigorous-lower-bound failure
 * shrinks from imp-96991 -4.189 (t~35.2) to -0.615 (t~35.855) as the (t^2+1/4)^2 W1PP curvature-penalty
 * guard shrinks ~4x with each hc halving, but the collapse only relocates to the highest resolvable
 * t-band -- it does not clear. The true pointwise F stays positive throughout both runs. Measurement
 * only: certified interval-rigorous reach stays 2a<=0.96, NO QED.
 *
 * @see imp-96970-krein-kmax5-100-converged-solve-verify.js (source finding, full derivation + assertions)
 * @see imp-96991-krein-fulldomain-hc1em3-rerun.js (sibling: hc=1e-3 full-domain rerun, 91 cells, deepest -4.189)
 * @see imp-96992-w1pp-celllocal-enclosure.js (the cell-local |w1-prime-prime| enclosure fix this motivates)
 */

// LP guarded-residual trajectory, rounds 3-12 (FINEH=1e-4, HP=0.05, VIOLTOL=0, kmax=5, 2a=1.00).
// Non-monotone and all negative -- the signature of a cutting-plane wall, not convergence.
export const IMP97025_RESIDUAL_CYCLE = Object.freeze(
  [-0.23102, -0.14777, -0.06862, -0.14776, -0.14693, -0.07316, -0.14834, -0.04636, -0.09816, -0.06891].map(
    (worstGuardedResidual, i) => Object.freeze({ round: i + 3, worstGuardedResidual }),
  ),
);

// Interval-verifier curvature-penalty relocation as hc is refined: the deepest rigorous lower bound
// shrinks ~4x per halving but the collapse relocates to a higher t-band rather than clearing.
export const IMP97025_HC_RELOCATION = Object.freeze([
  Object.freeze({
    source: 'imp-96991',
    hc: 1.0e-3,
    ncells: 40001,
    failingCells: 91,
    failTBands: [24, 25, 31, 35, 36, 37, 38],
    worstRigorousLowerBound: -4.189,
    worstLocation: 35.205,
  }),
  Object.freeze({
    source: 'imp-96970',
    hc: 5.0e-4,
    ncells: 80000,
    failingCells: 59,
    failTBands: [35],
    worstRigorousLowerBound: -0.6149795629431712,
    worstLocation: 35.855,
  }),
]);

export const IMP97025_VERDICT = Object.freeze({
  ticket: 'imp-97025',
  sourceTicket: 'imp-96970',
  lpConverges: false,
  residualCyclesNonMonotone: true,
  hcHalvingShrinksDeepestFailBy: '~6.8x (-4.189 -> -0.615)',
  collapseRelocatesRatherThanClears: true,
  truePointwiseFStaysPositive: true,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

export default {
  residualCycle: IMP97025_RESIDUAL_CYCLE,
  hcRelocation: IMP97025_HC_RELOCATION,
  verdict: IMP97025_VERDICT,
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97025_ASSERTIONS = [
  {
    id: 'imp97025-residual-cycle-all-negative-nonmonotone',
    holds: () =>
      IMP97025_RESIDUAL_CYCLE.every((r) => r.worstGuardedResidual < 0) &&
      IMP97025_RESIDUAL_CYCLE.some(
        (r, i) => i > 0 && r.worstGuardedResidual < IMP97025_RESIDUAL_CYCLE[i - 1].worstGuardedResidual,
      ),
    why: 'the round 3-12 worst guarded residual stays negative throughout and is non-monotone (a later round is worse than an earlier one), the signature of a cutting-plane wall rather than convergence.',
  },
  {
    id: 'imp97025-hc-relocation-shrinks-but-does-not-clear',
    holds: () =>
      IMP97025_HC_RELOCATION.length === 2 &&
      IMP97025_HC_RELOCATION[0].hc > IMP97025_HC_RELOCATION[1].hc &&
      IMP97025_HC_RELOCATION[0].worstRigorousLowerBound < IMP97025_HC_RELOCATION[1].worstRigorousLowerBound &&
      IMP97025_HC_RELOCATION.every((r) => r.worstRigorousLowerBound < 0) &&
      IMP97025_HC_RELOCATION.every((r) => r.worstLocation >= 24),
    why: 'halving hc from 1e-3 to 5e-4 shrinks the deepest rigorous-lower-bound failure (-4.189 -> -0.615) but both stay negative and clustered at high t (>=24), confirming relocation rather than clearance.',
  },
  {
    id: 'imp97025-measurement-only-no-qed',
    holds: () =>
      IMP97025_VERDICT.collapseRelocatesRatherThanClears === true &&
      IMP97025_VERDICT.truePointwiseFStaysPositive === true &&
      IMP97025_VERDICT.operatorPositivityProved === false &&
      IMP97025_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97025_VERDICT.qed === false,
    why: 'measurement only: the true pointwise F stays positive throughout so the collapse is a guard-resolution artifact, but no operator-positivity theorem is claimed and the certified reach stays 2a<=0.96.',
  },
];

for (const a of IMP97025_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97025-kmax5-100-wall-viz-data assertion failed: ${a.id}`);
  }
}
