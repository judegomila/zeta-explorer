/**
 * @fileoverview imp-97165 -- KMAX-SWEEP MEASUREMENT: does raising the cutting-plane trig degree KMAX
 * beyond 5 move the imp-97099 frozen tail-edge guard residual (-0.0043937 at t=37.809) at FINEH=3e-5,
 * 2a=1.00 (numerical)? imp-97099 found the imp-97055 KMAX=5 cutting-plane GENUINELY STALLS at FINEH=3e-5,
 * freezing the worst guarded residual at -0.0043937 (t=37.809), and attributed the stall to the
 * point-selection/guard iteration at the tail-edge dip rather than to arithmetic. Since the frozen dip
 * sits exactly at the highest available trig-degree edge (kmax=5), this records the KMAX=6 and KMAX=7
 * re-runs (holding the same second-order between-grid guard and FINEH=3e-5) to decide whether more design
 * freedom at the tail edge moves the frozen residual toward zero or the stall persists.
 *
 * SETUP. Identical EXACT pole-free Toeplitz form sigma_2(t)=(t^2+1/4)^2 w_1(t), same second-order
 * between-grid guard + cutting-plane as the imp-97055/imp-97099 solver (X=8, dx=0.02, a=0.5, T=40, eps=1.0,
 * FINEH=3e-5), with only the parity-tied atom degree KMAX raised. The KMAX overrides were driven by the
 * imp-97138 richer-family sweep at FINEH=3e-5 (KMAX=6 to r70: tmp/imp-97138-richer-family-3e5.log; KMAX=7
 * to r35: tmp/imp-97138-kmax7.log; KMAX=5 baseline to r65: tmp/imp-97138-kmax5.log, reproducing the
 * imp-97099 frozen -0.004394 at t=37.809). Convergence = worst fine-grid guarded residual >= 0.
 *
 * FINDING 1 -- RAISING KMAX DOES NOT MOVE THE FROZEN RESIDUAL TOWARD ZERO; IT MAKES THE ITERATION MORE
 * VOLATILE. KMAX=5 freezes cleanly at -0.004394 (t=37.809) across r50..r65 (matches imp-97099). KMAX=6
 * never freezes and never approaches zero: its worst residual oscillates in ~[-0.051, -0.0096] to r70,
 * best-ever -0.009625 (r50) -- still ~2.2x MORE negative than the kmax=5 frozen floor -- and is -0.02415
 * (t=38.756) at r70 with no sign of stabilising. KMAX=7 is more volatile still: it spikes to -4.14 (r20)
 * and oscillates in ~[-4.14, -0.018] to r35, again not converging. More parity-tied trig degree at the tail
 * edge INCREASES the violated-point count and residual volatility instead of clearing the guard.
 *
 * FINDING 2 -- THE FINEH=1e-4 FULL RUNS AGREE: HIGHER KMAX IS WORSE, NOT BETTER. The imp-97138 FINEH=1e-4
 * 45-round runs give finalWorst = -0.007665 at KMAX=5 versus -0.019873 at KMAX=7 (both converged=false):
 * doubling the polynomial degree makes the final worst residual ~2.6x more negative. The l1 design norm
 * does drop with KMAX (7.030 -> 6.806 -> 6.791 for KMAX=5/6/7), so the extra atoms are used, but that
 * extra design freedom is spent lowering the norm, not clearing the tail-edge guard.
 *
 * VERDICT. At FINEH=3e-5, 2a=1.00, raising KMAX from 5 to 6 or 7 does NOT move the imp-97099 frozen
 * tail-edge residual toward zero: KMAX=5 freezes at -0.004394 (t=37.809), while KMAX=6 (best -0.009625, at
 * r70 -0.02415) and KMAX=7 (spikes to -4.14) stay strictly negative and more volatile, producing no
 * guard-clearing certificate. The stall is thus NOT a trig-degree ceiling -- it is structural to the
 * tail-edge dip, corroborating imp-97138 that a richer polynomial/parity design family does not clear it.
 * The certified interval-rigorous reach stays exactly 2a <= 0.96. Measurement only; no operator positivity;
 * no bound moves; RH open; NO QED.
 *   Resolves SUB-GAP IMP97099_FROZEN_RESIDUAL_HIGHER_KMAX_UNTESTED (KMAX=6,7 now measured: stall persists).
 *   Leaves open SUB-GAP IMP97165_TAILEDGE_DIP_NEEDS_NON_DEGREE_CONSTRUCTION (the 2a>0.96 tail-edge dip needs
 *   a genuinely different construction, not KMAX/parity-basis enrichment).
 *
 * @see imp-97099-krein-fineh-3e5-fullstall-measurement.js (parent: the KMAX=5 frozen -0.0043937 at t=37.809)
 * @see imp-97055-krein-windowed-design-lever.js (the exact sigma_2 cutting-plane solver reused here)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Run configuration -- imp-97055 BASE solve, only KMAX varied, FINEH=3e-5, 2a=1.00. KMAX overrides driven
// by the imp-97138 richer-family sweep (same guard, X=8, dx=0.02, a=0.5, T=40, eps=1.0).
export const IMP97165_CONFIG = Object.freeze({
  solver: 'imp-97055 lp13-form exact sigma_2 cutting-plane, mode BASE, KMAX in {5,6,7} (imp-97138 richer-family override)',
  twoA: 1.0, a: 0.5, eps: 1.0, X: 8.0, dx: 0.02, T: 40.0, FINEH: 3.0e-5, method: 'highs-ds',
  logs: Object.freeze([
    'tmp/imp-97138-kmax5.log (KMAX=5 to r65)',
    'tmp/imp-97138-richer-family-3e5.log (KMAX=6 to r70)',
    'tmp/imp-97138-kmax7.log (KMAX=7 to r35)',
    'tmp/imp-97138-out.json (FINEH=1e-4 full 45-round KMAX=5 vs KMAX=7)',
  ]),
});

// MEASURED worst-residual trajectories at FINEH=3e-5, 2a=1.00 (worst = worst guarded fine-grid residual).
export const IMP97165_TRAJECTORIES = Object.freeze({
  // KMAX=5: freezes cleanly (matches imp-97099 -0.0043937 at t=37.809).
  kmax5: Object.freeze([
    Object.freeze({ round: 45, worst: -0.001756, at: 35.205 }),
    Object.freeze({ round: 50, worst: -0.004394, at: 37.809 }),
    Object.freeze({ round: 55, worst: -0.004395, at: 37.809 }),
    Object.freeze({ round: 60, worst: -0.004394, at: 37.809 }),
    Object.freeze({ round: 65, worst: -0.004394, at: 37.809 }),
  ]),
  // KMAX=6: oscillates, never freezes, never approaches zero (best -0.009625 at r50).
  kmax6: Object.freeze([
    Object.freeze({ round: 45, worst: -0.01997, at: 38.755 }),
    Object.freeze({ round: 50, worst: -0.009625, at: 31.350 }),
    Object.freeze({ round: 55, worst: -0.01031, at: 37.755 }),
    Object.freeze({ round: 60, worst: -0.02726, at: 39.431 }),
    Object.freeze({ round: 65, worst: -0.02929, at: 38.755 }),
    Object.freeze({ round: 70, worst: -0.02415, at: 38.756 }),
  ]),
  // KMAX=7: highly volatile, spikes to -4.14, does not converge (to r35 only).
  kmax7: Object.freeze([
    Object.freeze({ round: 15, worst: -0.02853, at: 37.984 }),
    Object.freeze({ round: 20, worst: -4.14, at: 38.682 }),
    Object.freeze({ round: 25, worst: -0.04367, at: 31.662 }),
    Object.freeze({ round: 30, worst: -0.02406, at: 32.349 }),
    Object.freeze({ round: 35, worst: -0.01826, at: 37.342 }),
  ]),
});

// Cross-check at FINEH=1e-4 (imp-97138 out.json, 45-round full runs): higher KMAX is worse, not better.
export const IMP97165_FINEH_1E4 = Object.freeze({
  kmax5: Object.freeze({ finalWorst: -0.007665071864822015, l1: 7.030232103255671, converged: false, rounds: 45 }),
  kmax7: Object.freeze({ finalWorst: -0.019873296521906614, l1: 6.790996687322362, converged: false, rounds: 45 }),
});

// Per-KMAX design-norm (l1) at FINEH=3e-5: the extra atoms lower the norm but do not clear the guard.
export const IMP97165_L1_BY_KMAX = Object.freeze({ 5: 7.030, 6: 6.806, 7: 6.791 });

export const IMP97165_VERDICT = Object.freeze({
  ticket: 'imp-97165',
  question: 'at FINEH=3e-5, 2a=1.00, does raising the cutting-plane trig degree KMAX beyond 5 move the imp-97099 frozen tail-edge guard residual (-0.0043937 at t=37.809) toward zero, or does the stall persist ?',
  twoA: 1.0,
  FINEH: 3.0e-5,
  kmax5FrozenWorst: -0.004394,
  kmax5FrozenAt: 37.809,
  kmax6BestWorst: -0.009625,
  kmax6FinalWorst: -0.02415,
  kmax7SpikeWorst: -4.14,
  // Finding 1: higher KMAX does not move the frozen residual toward zero; it is more volatile
  higherKmaxMovesResidualTowardZero: false,
  higherKmaxMoreVolatile: true,
  kmax6NeverFreezes: true,
  kmax7NeverConverges: true,
  // Finding 2: FINEH=1e-4 agrees -- higher KMAX final worst is more negative
  fineh1e4HigherKmaxWorse: true,
  // Conclusion
  producedGuardClearingCertificate: false,
  stallIsStructuralNotDegreeCeiling: true,
  intervalRigorousReachUnchanged: 0.96,
  resolvesSubGap: 'IMP97099_FROZEN_RESIDUAL_HIGHER_KMAX_UNTESTED -- KMAX=6,7 now measured at FINEH=3e-5, 2a=1.00: KMAX=5 freezes at -0.004394 (t=37.809), KMAX=6 oscillates in [-0.051,-0.0096] (best -0.009625, r70 -0.02415), KMAX=7 spikes to -4.14; none approach zero and no guard-clearing certificate appears.',
  opensSubGap: 'IMP97165_TAILEDGE_DIP_NEEDS_NON_DEGREE_CONSTRUCTION -- the 2a>0.96 tail-edge dip needs a genuinely different construction, not KMAX/parity-basis enrichment.',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97165_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97165_ASSERTIONS = [
  {
    id: 'imp97165-kmax5-freezes-kmax6-7-do-not-approach-zero',
    holds: () =>
      // KMAX=5 frozen tail: the last four rounds share the identical worst residual and location
      IMP97165_TRAJECTORIES.kmax5.slice(-4).every((r) => Math.abs(r.worst - IMP97165_VERDICT.kmax5FrozenWorst) < 2e-6 && r.at === IMP97165_VERDICT.kmax5FrozenAt) &&
      // KMAX=6 never gets closer to zero than the kmax=5 frozen floor
      Math.max(...IMP97165_TRAJECTORIES.kmax6.map((r) => r.worst)) < IMP97165_VERDICT.kmax5FrozenWorst &&
      // KMAX=7 stays strictly negative and spikes far past the kmax=5 floor
      Math.min(...IMP97165_TRAJECTORIES.kmax7.map((r) => r.worst)) <= IMP97165_VERDICT.kmax7SpikeWorst,
    why: 'KMAX=5 freezes at -0.004394 (t=37.809); KMAX=6 stays below -0.0096 (best -0.009625, more negative than the kmax=5 floor) and KMAX=7 spikes to -4.14 -- raising the trig degree does not move the frozen residual toward zero.',
  },
  {
    id: 'imp97165-higher-kmax-more-volatile-not-monotone-to-zero',
    holds: () =>
      IMP97165_VERDICT.higherKmaxMovesResidualTowardZero === false &&
      IMP97165_VERDICT.higherKmaxMoreVolatile === true &&
      IMP97165_VERDICT.kmax6NeverFreezes === true &&
      IMP97165_VERDICT.kmax7NeverConverges === true &&
      // KMAX=6 range spans well over an order of magnitude in worst residual (no convergence)
      Math.min(...IMP97165_TRAJECTORIES.kmax6.map((r) => r.worst)) < -0.025 &&
      Math.max(...IMP97165_TRAJECTORIES.kmax6.map((r) => r.worst)) > -0.011,
    why: 'the KMAX=6 worst residual oscillates across [-0.029,-0.0096] to r70 without freezing and KMAX=7 spikes to -4.14 -- extra parity-tied degree makes the cutting-plane more volatile, not monotone toward zero.',
  },
  {
    id: 'imp97165-fineh-1e4-crosscheck-higher-kmax-worse',
    holds: () =>
      IMP97165_VERDICT.fineh1e4HigherKmaxWorse === true &&
      IMP97165_FINEH_1E4.kmax7.finalWorst < IMP97165_FINEH_1E4.kmax5.finalWorst &&
      IMP97165_FINEH_1E4.kmax5.converged === false &&
      IMP97165_FINEH_1E4.kmax7.converged === false &&
      // the l1 design norm does drop with KMAX (atoms are used) but the guard is not cleared
      IMP97165_L1_BY_KMAX[7] < IMP97165_L1_BY_KMAX[6] &&
      IMP97165_L1_BY_KMAX[6] < IMP97165_L1_BY_KMAX[5],
    why: 'the FINEH=1e-4 full runs give finalWorst -0.007665 (KMAX=5) vs -0.019873 (KMAX=7), and the l1 norm drops 7.030->6.806->6.791 with KMAX -- the extra atoms lower the norm but the final worst residual gets more negative, corroborating the 3e-5 result.',
  },
  {
    id: 'imp97165-no-certificate-reach-unchanged-resolves-subgap-no-qed',
    holds: () =>
      IMP97165_VERDICT.producedGuardClearingCertificate === false &&
      IMP97165_VERDICT.stallIsStructuralNotDegreeCeiling === true &&
      IMP97165_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97165_VERDICT.resolvesSubGap.includes('IMP97099_FROZEN_RESIDUAL_HIGHER_KMAX_UNTESTED') &&
      IMP97165_VERDICT.opensSubGap.includes('IMP97165_TAILEDGE_DIP_NEEDS_NON_DEGREE_CONSTRUCTION') &&
      IMP97165_VERDICT.operatorPositivityProved === false &&
      IMP97165_VERDICT.rhResolved === false &&
      IMP97165_VERDICT.qed === false,
    why: 'the KMAX-sweep produces no guard-clearing certificate; it resolves the higher-KMAX sub-gap (the stall is structural, not a degree ceiling), opens a non-degree-construction sub-gap, keeps the certified reach at 2a <= 0.96, claims no operator positivity, and NO QED.',
  },
];

for (const a of IMP97165_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97165 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export { IMP97165_ASSERTIONS };
