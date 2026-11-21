/**
 * @fileoverview imp-97073 -- DENSER HP=0.01 TAIL-BLOCK FULL-STALL CONFIRMATION (numerical): close the
 * imp-97032 sub-gap IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5. imp-97032 stopped the HP=0.01
 * kmax=5 Route I Krein tail-block solve (~31k tail rows/round) at round 5 (worst guarded residual -0.0615,
 * plateauing near the imp-97013 best -0.0557), leaving open whether a longer run to full stall would hold
 * the ~-0.06 plateau (fine-grid binding persists) or slowly climb to >= 0. This run continues the SAME
 * lp13 FINEH=3e-5, T=40, HP=0.01 exact-sigma_2 cutting-plane solve (tmp/toeplitz-krein-lp13.py, KMAX=5,
 * X=8, dx=0.02, VIOLTOL=0) to full stall -- 14 rounds (0-13), ~3495s -- and re-measures the no-guard min
 * pointwise design F on the final iterate (tmp/imp-97032/eval-minF.py). The plateau HOLDS: the residual
 * never reaches 0 and the design F stays below eps in the tail. Certified reach stays 2a<=0.96; RH open;
 * NO QED.
 *
 * SETUP. Identical guarded design condition to imp-97032 lever B: F(t) - guard(t) - eps >= 0 on a fine
 * grid of spacing FINEH=3e-5 plus a periodic top-t^5 tail block of spacing HP=0.01 over the tail; F =
 * sigma_2 + sum_k sum_j c_{k,j} t^k trig_k(x_j t), sigma_2 = (t^2+1/4)^2 w_1, eps=1.0, 2a=1.00. The guard
 * scales as FINEH^2 (rendered negligible ~0.013-0.018 by imp-97013), so the binding is the design F. The
 * ONLY change from imp-97032 lever B is running past round 5 to cutting-plane stall.
 *
 * FINDING 1 -- THE GUARDED RESIDUAL PLATEAUS NEAR -0.06 AND WALLS; IT DOES NOT CLIMB TO >= 0. Continuing
 * the HP=0.01 solve to round 13 (14 rounds) the worst guarded fine-grid residual improves through round 5
 * (-588.14, -40.47, -23.18, -0.2263, -0.06529, -0.06148) then OSCILLATES on a plateau near -0.06 for the
 * remaining rounds (-0.06152, -0.06517, -0.2954 spike, -0.06164, -0.06534, -0.06794, -0.06549, -0.06534),
 * with best -0.06148 (round 5) and final -0.06534 (round 13). The full trajectory is monotone-then-flat:
 * the cutting plane cannot push the worst residual above the ~-0.06 wall, and the intermittent spike
 * (-0.2954 at round 8) confirms a cutting-plane cycle, not a slow climb toward feasibility.
 *
 * FINDING 2 -- THE NO-GUARD DESIGN-F DIP PERSISTS BELOW eps IN THE t~35-40 BAND. Re-measuring the no-guard
 * min pointwise F on the round-13 iterate: global min F = 0.9501 at t=36.414 -- still in the t~35-40 tail
 * band and still BELOW eps=1.0. The interior (t<30) min is 0.9905 at t=24.34 and the t~30-35 band min has
 * lifted to 1.0013 >= eps at t=30.77, so the binding is squarely the tail-edge design-F dip. Compared with
 * the round-5 iterate (global min F 0.9529 at t=35.85) the extra rounds do NOT lift the tail dip toward eps
 * -- it settles at ~0.95, confirming the fine-grid design-F binding is a stall, not a transient.
 *
 * VERDICT. The denser HP=0.01 tail-block solve run to full stall CONFIRMS the imp-97032 plateau: the
 * kmax=5 guarded LP residual walls near -0.06 (best -0.0615, final -0.0653) without ever reaching 0, and
 * the no-guard design F stays at 0.9501 < eps=1.0 in the t~35-40 tail band. The fine-grid design-F binding
 * persists exactly as imp-97032/imp-97013 predicted -- tail-block densification tightens only the
 * periodic-average tail constraint, not the fine-grid pointwise F >= eps requirement, so a longer run does
 * not dissolve the dip. No converged iterate is produced; the certified reach stays exactly 2a<=0.96. This
 * closes IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5 (the plateau holds, it does not climb) and
 * leaves the live lever as imp-97032 named: a RICHER DESIGN FAMILY (higher kmax or a different tail
 * ansatz), not tail parametrisation.
 *   SUB-GAP IMP97073_KMAX5_100_TAIL_DIP_NEEDS_RICHER_FAMILY -- with FINEH=3e-5, T=40 and HP now densified
 *   to 0.01 all exhausted, the kmax=5 top-family design F still dips to ~0.95 < eps at t~36.4 near the T=40
 *   cutoff; the untested lever is a richer design family (kmax>5 or a non-periodic tail ansatz), matching
 *   the imp-97032 structural sub-gap IMP97032_TAIL_EDGE_DIP_IS_STRUCTURAL_NOT_PARAMETRISATION.
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-97032-krein-tail-parametrisation-lever.js (parent: sub-gap IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5, round-5 plateau -0.0615)
 * @see imp-97013-krein-finer-fineh-3e5-convergence.js (grandparent: FINEH=3e-5 exposes the design-F tail dip)
 * @see imp-97012-krein-kmax5-100-celllocal-w1pp-verify.js (cell-local interval verify machinery at 2a=1.00)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Solve configuration -- identical to imp-97032 lever B; the ONLY change is running to full cutting-plane stall.
export const IMP97073_CONFIG = Object.freeze({
  solver: 'tmp/toeplitz-krein-lp13.py (lp13 exact sigma_2 cutting-plane, KMAX=5)',
  twoA: 1.0, eps: 1.0, X: 8.0, dx: 0.02, FINEH: 3.0e-5, T: 40.0, HP: 0.01, violTol: 0.0, method: 'highs-ds',
  rounds: 14, secs: 3494.9, tailRowsApprox: 31000,
  baselineImp97032Round5: -0.061482280869862294, // the round-5 stopping point of the parent
  baselineImp97013: -0.055737948196962206, // T=40 HP=0.05 FINEH=3e-5 best
});

// MEASURED full-stall worst-guarded-residual trajectory (rounds 0-13, from tmp/imp-97032/run-HP01.log RESULT_JSON).
export const IMP97073_TRAJECTORY = Object.freeze([
  -588.1449741707944, -40.46516763564793, -23.179548960500686, -0.22633347141619453,
  -0.06528975022719441, -0.061482280869862294, -0.06151865829039027, -0.06516658686399934,
  -0.2954102732663826, -0.06163621989446044, -0.06533805123815895, -0.06794007195519702,
  -0.06548581804284703, -0.0653402795927005,
]);

// MEASURED no-guard min pointwise design F, re-computed independently from the round-13 emitted coefficients
// (tmp/imp-97032/eval-minF.py on iterate-T40_HP0.01_FH3e-5.json; interior = t<30, bands as named).
export const IMP97073_MIN_POINTWISE_F = Object.freeze({
  round: 13, l1: 7.030230532424303, worstGuardedResidual: -0.0653402795927005,
  globalMinF: 0.950140833389014, globalMinAt: 36.4142, // still in t~35-40 tail band, still below eps
  interiorMinF_lt30: 0.9904791065491736, interiorMinAt: 24.3443,
  band3540MinF: 0.950140833389014, band3540At: 36.4142,
  band3035MinF: 1.0013270522467792, band3035At: 30.7684, // t~30-35 now >= eps
  round5GlobalMinF: 0.9529180417302996, // imp-97032 round-5 reference (dip did not lift over the extra rounds)
  eps: 1.0,
});

export const IMP97073_VERDICT = Object.freeze({
  ticket: 'imp-97073',
  question: 'run the HP=0.01 tail-block kmax=5 Route I Krein solve to full stall (past the resource-limited round 5): does the guarded residual hold the ~-0.06 plateau (fine-grid binding persists) or climb to >= 0 ?',
  twoA: 1.0,
  ranToFullStall: true,
  roundsRun: 14, // rounds 0-13
  bestGuardedResidual: -0.061482280869862294, // round 5
  finalGuardedResidual: -0.0653402795927005, // round 13
  residualPlateausNear006: true, // oscillates -0.061..-0.068 with a -0.295 spike; never reaches 0
  residualReachedZero: false,
  hasCuttingPlaneSpike: true, // -0.2954 at round 8 => cycle, not a slow climb
  noGuardGlobalMinF: 0.950140833389014, // round 13
  noGuardGlobalMinAt: 36.4142,
  designFDipPersistsBelowEps: true, // 0.9501 < 1.0 in the t~35-40 band
  designFDipDidNotLiftOverExtraRounds: true, // 0.9529 (round 5) -> 0.9501 (round 13), no upward trend
  producedConvergedIterate: false,
  fineGridBindingPersists: true, // confirms imp-97013 / imp-97032
  frontierExtendsCertifiedReach: false,
  intervalRigorousReachUnchanged: 0.96,
  closesSubGap: 'IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5',
  subGap: 'IMP97073_KMAX5_100_TAIL_DIP_NEEDS_RICHER_FAMILY -- with FINEH=3e-5, T=40 and HP densified to 0.01 all exhausted, the kmax=5 top-family design F still dips to ~0.95 < eps at t~36.4 near the T=40 cutoff; the untested lever is a richer design family (kmax>5 or a non-periodic tail ansatz), not tail parametrisation.',
  indicatedLever: 'a richer design family (higher kmax or a different tail ansatz), NOT tail parametrisation',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97073_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97073_ASSERTIONS = [
  {
    id: 'imp97073-ran-to-full-stall-past-round5',
    holds: () =>
      IMP97073_VERDICT.ranToFullStall === true &&
      IMP97073_TRAJECTORY.length === 14 && // rounds 0-13, past the imp-97032 round-5 stop
      IMP97073_VERDICT.roundsRun === IMP97073_TRAJECTORY.length &&
      IMP97073_TRAJECTORY[5] === IMP97073_CONFIG.baselineImp97032Round5, // continues from the same round-5 iterate
    why: 'the HP=0.01 solve was continued from the imp-97032 round-5 stop to full cutting-plane stall -- 14 rounds (0-13), the round-5 worst residual matching the parent baseline -0.06148.',
  },
  {
    id: 'imp97073-residual-plateaus-near-006-never-reaches-zero',
    holds: () =>
      IMP97073_VERDICT.residualReachedZero === false &&
      IMP97073_TRAJECTORY.every((v) => v < 0) && // never non-negative
      // the tail (rounds 4-13) all sit on the ~-0.06 plateau or spike, none climb toward 0
      IMP97073_TRAJECTORY.slice(4).every((v) => v <= -0.06) &&
      Math.max(...IMP97073_TRAJECTORY) === IMP97073_VERDICT.bestGuardedResidual && // best is the least-negative
      IMP97073_TRAJECTORY[IMP97073_TRAJECTORY.length - 1] === IMP97073_VERDICT.finalGuardedResidual &&
      IMP97073_VERDICT.hasCuttingPlaneSpike === true &&
      Math.min(...IMP97073_TRAJECTORY.slice(4)) < -0.25, // the -0.2954 round-8 spike
    why: 'over rounds 4-13 the worst guarded residual walls on a plateau near -0.06 (best -0.06148 round 5, final -0.06534 round 13) with an intermittent -0.2954 spike (round 8) -- a cutting-plane cycle, never reaching 0.',
  },
  {
    id: 'imp97073-design-F-dip-persists-below-eps-in-tail',
    holds: () =>
      IMP97073_MIN_POINTWISE_F.globalMinF < IMP97073_MIN_POINTWISE_F.eps && // still below eps
      IMP97073_MIN_POINTWISE_F.globalMinAt > 35 && IMP97073_MIN_POINTWISE_F.globalMinAt < 40 && // in the tail band
      IMP97073_MIN_POINTWISE_F.band3035MinF >= IMP97073_MIN_POINTWISE_F.eps && // t~30-35 now >= eps
      // the extra rounds did NOT lift the dip toward eps (0.9529 round 5 -> 0.9501 round 13)
      IMP97073_MIN_POINTWISE_F.globalMinF < IMP97073_MIN_POINTWISE_F.round5GlobalMinF &&
      IMP97073_VERDICT.designFDipDidNotLiftOverExtraRounds === true,
    why: 'the round-13 no-guard min pointwise design F is 0.9501 at t=36.41 -- still below eps=1.0 in the t~35-40 band and no higher than the round-5 value (0.9529), so the fine-grid design-F dip is a stall, not a transient that more rounds would clear.',
  },
  {
    id: 'imp97073-closes-subgap-reach-unchanged-no-qed',
    holds: () =>
      IMP97073_VERDICT.producedConvergedIterate === false &&
      IMP97073_VERDICT.fineGridBindingPersists === true &&
      IMP97073_VERDICT.frontierExtendsCertifiedReach === false &&
      IMP97073_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97073_VERDICT.closesSubGap === 'IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5' &&
      IMP97073_VERDICT.subGap.includes('IMP97073_KMAX5_100_TAIL_DIP_NEEDS_RICHER_FAMILY') &&
      IMP97073_VERDICT.operatorPositivityProved === false &&
      IMP97073_VERDICT.rhResolved === false &&
      IMP97073_VERDICT.qed === false,
    why: 'the full-stall HP=0.01 run closes the imp-97032 round-5 sub-gap (the plateau holds, it does not climb to >= 0), leaves the richer-design-family lever open, keeps the certified reach at 2a<=0.96, and claims NO QED.',
  },
];

for (const a of IMP97073_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97073 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
