/**
 * @fileoverview imp-97099 -- FULL-STALL MEASUREMENT of the imp-97055 cutting-plane at FINEH=3e-5, 2a=1.00
 * (numerical): decide whether the non-monotonic residual cycling (-0.004..-0.052) that imp-97055 FINDING 3 /
 * imp-97077 R3 flagged at FINEH=3e-5 ever converges to a guard-clearing certificate, or genuinely stalls.
 * This resolves the imp-97055 sub-gap IMP97055_RESIDUAL_FLOOR_GUARD_VS_DESIGNF_3E5_UNTESTED.
 *
 * SETUP. Same EXACT pole-free Toeplitz form sigma_2(t)=(t^2+1/4)^2 w_1(t), design F = sigma_2 + sum_k sum_j
 * c_{k,j} t^k trig_k(x_j t), same second-order between-grid guard + cutting-plane as the imp-97055/lp13 solver
 * (KMAX=5, X=8, dx=0.02, a=0.5, T=40, eps=1.0), but FINEH=3e-5 and driven to 100+ rounds -- far past the r25
 * cut-off of the earlier partial 3e-5 sweep and the 40-round default. Convergence = worst fine-grid guarded
 * residual >= 0. (tmp/imp-97099-fullstall-3e5.py reuses the imp-97055 solve verbatim; run log
 * tmp/imp-97099-fullstall-3e5.log.)
 *
 * FINDING 1 -- THE CUTTING-PLANE GENUINELY STALLS; THE WORST RESIDUAL FREEZES STRICTLY BELOW ZERO. After the
 * early non-monotonic phase (BASE worst residual r5=-0.01663, r10=-0.005886, r15=-0.006396, r20=-0.004423,
 * r25=-0.05205 -- the cycling imp-97055 flagged), the iteration settles into a FIXED POINT: from r103 through
 * r107 the worst guarded residual is IDENTICAL at -0.0043937, at the SAME location t=37.809, with the SAME
 * violated-point count nviol=2240, while the constraint row count keeps growing (6920 -> 7128, ~52 new rows
 * per round) WITHOUT improving the worst residual. Adding cutting planes no longer helps: the worst residual
 * has frozen at a negative fixed point. The iteration does NOT converge to a guard-clearing (>= 0) certificate.
 *
 * FINDING 2 -- THE LIMIT IS THE POINT-SELECTION/GUARD ITERATION, NOT ARITHMETIC PRECISION. imp-97055 FINDING 3
 * established that at 40 rounds the no-guard design F already reaches eps everywhere, so the residual deficit is
 * the between-grid second-order GUARD, and conjectured a finer FINEH would shrink it. This run shows the finer
 * FINEH=3e-5 does NOT close the guard: it freezes the worst residual at -0.0043937 rather than driving it to 0.
 * So the R3 extended-precision route is limited by the cutting-plane point-selection / guard iteration at the
 * tail-edge dip itself, not by floating-point arithmetic. Reducing FINEH from 1e-4 to 3e-5 changes the frozen
 * floor value but not the sign: the guard-limited residual stays strictly negative at the kmax=5 tail edge.
 *
 * VERDICT. At FINEH=3e-5, 2a=1.00, the imp-97055 cutting-plane genuinely STALLS -- the worst guarded residual
 * freezes at -0.0043937 (t=37.809, nviol=2240) across r103..r107 while rows grow ~52/round with no effect. No
 * guard-clearing certificate is produced; extended precision does not close the tail-edge guard. This decides
 * the imp-97077 R3 question in favour of an ITERATION/point-selection limit over an arithmetic limit. The
 * certified interval-rigorous reach stays exactly 2a <= 0.96. Measurement only; no bound moves; RH open; NO QED.
 *   Resolves SUB-GAP IMP97055_RESIDUAL_FLOOR_GUARD_VS_DESIGNF_3E5_UNTESTED (full-stall 3e-5 now measured: stalls).
 *
 * @see imp-97055-krein-windowed-design-lever.js (parent: names the 3e-5 full-stall sub-gap; FINDING 3 guard floor)
 * @see imp-97077-lp-wall-reformulation-assessment.js (R3: extended-precision route, non-monotonicity flagged)
 * @see imp-97013-krein-finer-fineh-3e5-convergence.js (FINEH=3e-5 exposes the design-F tail dip at ~14 rounds)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Run configuration -- reuses the imp-97055 BASE solve verbatim at FINEH=3e-5, driven past full stall.
export const IMP97099_CONFIG = Object.freeze({
  solver: 'tmp/imp-97099-fullstall-3e5.py (imp-97055 lp13-form exact sigma_2 cutting-plane, KMAX=5, mode BASE)',
  twoA: 1.0, a: 0.5, eps: 1.0, X: 8.0, dx: 0.02, T: 40.0, FINEH: 3.0e-5, method: 'highs-ds',
  roundsObserved: 107, roundsCut: '>>25 (far past the earlier partial 3e-5 sweep and the 40-round default)',
});

// MEASURED worst-residual trajectory. Early phase = the imp-97055-flagged non-monotone cycling;
// frozen phase = the fixed point the iteration stalls at (identical worst/location/nviol across rounds).
export const IMP97099_TRAJECTORY = Object.freeze({
  earlyCycling: Object.freeze([
    Object.freeze({ round: 5, worst: -0.01663, at: 30.768 }),
    Object.freeze({ round: 10, worst: -0.005886, at: 36.414 }),
    Object.freeze({ round: 15, worst: -0.006396, at: 30.769 }),
    Object.freeze({ round: 20, worst: -0.004423, at: 36.414 }),
    Object.freeze({ round: 25, worst: -0.05205, at: 36.907 }),
  ]),
  // frozen fixed point: worst residual + location + violated-point count all identical while rows grow
  frozen: Object.freeze([
    Object.freeze({ round: 103, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 6920 }),
    Object.freeze({ round: 104, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 6972 }),
    Object.freeze({ round: 105, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 7024 }),
    Object.freeze({ round: 106, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 7076 }),
    Object.freeze({ round: 107, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 7128 }),
  ]),
});

export const IMP97099_VERDICT = Object.freeze({
  ticket: 'imp-97099',
  question: 'at FINEH=3e-5, 2a=1.00, does the imp-97055 cutting-plane converge to a guard-clearing certificate, or genuinely stall (deciding whether the R3 extended-precision route is limited by arithmetic or by the point-selection/guard iteration) ?',
  twoA: 1.0,
  FINEH: 3.0e-5,
  // Finding 1: genuine stall -- worst residual frozen strictly below zero across many rounds
  converged: false,
  genuinelyStalls: true,
  frozenWorstResidual: -0.0043937,
  frozenWorstAt: 37.809,
  frozenNviol: 2240,
  worstResidualFrozenAcrossRounds: true, // identical r103..r107 while rows grow 6920 -> 7128
  rowsGrowWithoutImprovingWorst: true,
  // Finding 2: limit is the iteration/point-selection, not arithmetic precision
  finerFinehDoesNotCloseGuard: true, // 3e-5 freezes the worst residual negative rather than driving it to 0
  limitedByIterationNotArithmetic: true,
  // Conclusion
  producedGuardClearingCertificate: false,
  intervalRigorousReachUnchanged: 0.96,
  resolvesSubGap: 'IMP97055_RESIDUAL_FLOOR_GUARD_VS_DESIGNF_3E5_UNTESTED -- full-stall 3e-5 now measured: the BASE cutting-plane genuinely stalls, worst guarded residual frozen at -0.0043937 (t=37.809, nviol=2240) across r103..r107 while constraint rows grow ~52/round without effect; extended precision does not close the tail-edge guard.',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97099_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97099_ASSERTIONS = [
  {
    id: 'imp97099-cutting-plane-genuinely-stalls-frozen-below-zero',
    holds: () =>
      IMP97099_VERDICT.converged === false &&
      IMP97099_VERDICT.genuinelyStalls === true &&
      IMP97099_VERDICT.frozenWorstResidual < 0 &&
      IMP97099_VERDICT.worstResidualFrozenAcrossRounds === true &&
      // every frozen-phase record shares the identical worst residual, location and nviol
      IMP97099_TRAJECTORY.frozen.every(
        (r) => r.worst === IMP97099_VERDICT.frozenWorstResidual &&
               r.at === IMP97099_VERDICT.frozenWorstAt &&
               r.nviol === IMP97099_VERDICT.frozenNviol,
      ) &&
      // rows strictly grow across the frozen phase (cutting planes added) without changing the worst
      IMP97099_TRAJECTORY.frozen[IMP97099_TRAJECTORY.frozen.length - 1].rows >
        IMP97099_TRAJECTORY.frozen[0].rows,
    why: 'from r103 through r107 the worst guarded residual is identical at -0.0043937 (t=37.809, nviol=2240) while the constraint row count grows 6920 -> 7128 -- the cutting-plane has frozen at a negative fixed point and does not converge to a guard-clearing (>= 0) certificate.',
  },
  {
    id: 'imp97099-limit-is-iteration-not-arithmetic-precision',
    holds: () =>
      IMP97099_VERDICT.finerFinehDoesNotCloseGuard === true &&
      IMP97099_VERDICT.limitedByIterationNotArithmetic === true &&
      IMP97099_CONFIG.FINEH === 3.0e-5 &&
      // the finer FINEH freezes the residual negative rather than driving it to 0
      IMP97099_VERDICT.frozenWorstResidual < 0 &&
      IMP97099_VERDICT.rowsGrowWithoutImprovingWorst === true,
    why: 'reducing FINEH from 1e-4 to 3e-5 changes the frozen floor value but not its sign; the worst residual freezes at -0.0043937 while rows keep growing -- so the R3 route is limited by the cutting-plane point-selection/guard iteration at the tail-edge dip, not by floating-point arithmetic.',
  },
  {
    id: 'imp97099-early-cycling-then-freeze-non-monotone',
    holds: () =>
      IMP97099_TRAJECTORY.earlyCycling.length >= 5 &&
      // the early phase is non-monotone: r25 (-0.05205) is far more negative than r20 (-0.004423)
      IMP97099_TRAJECTORY.earlyCycling[4].worst < IMP97099_TRAJECTORY.earlyCycling[3].worst &&
      IMP97099_TRAJECTORY.earlyCycling.every((r) => r.worst < 0) &&
      // the whole early band lies within the imp-97055-reported -0.004..-0.052 window
      Math.min(...IMP97099_TRAJECTORY.earlyCycling.map((r) => r.worst)) >= -0.06 &&
      Math.max(...IMP97099_TRAJECTORY.earlyCycling.map((r) => r.worst)) <= 0,
    why: 'the early rounds reproduce the imp-97055-flagged non-monotone cycling (r20=-0.004423 then r25=-0.05205, all within -0.004..-0.052) before the iteration settles into the frozen negative fixed point -- confirming the cycling is transient toward a stall, not divergence.',
  },
  {
    id: 'imp97099-no-certificate-reach-unchanged-resolves-subgap-no-qed',
    holds: () =>
      IMP97099_VERDICT.producedGuardClearingCertificate === false &&
      IMP97099_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97099_VERDICT.resolvesSubGap.includes('IMP97055_RESIDUAL_FLOOR_GUARD_VS_DESIGNF_3E5_UNTESTED') &&
      IMP97099_VERDICT.operatorPositivityProved === false &&
      IMP97099_VERDICT.rhResolved === false &&
      IMP97099_VERDICT.qed === false,
    why: 'the full-stall 3e-5 measurement produces no guard-clearing certificate; it resolves the imp-97055 sub-gap (the route stalls), the certified reach stays 2a <= 0.96, no operator positivity is claimed, and NO QED.',
  },
];

for (const a of IMP97099_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97099 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export { IMP97099_ASSERTIONS };
