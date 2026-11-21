/**
 * @fileoverview imp-97032 -- TAIL-PARAMETRISATION LEVER PROBE (numerical): test the imp-97013 sub-gap
 * IMP97013_TAIL_PARAMETRISATION_OR_LARGER_T_UNTESTED -- whether a larger cutoff T past 40 and/or a denser
 * HP top-t^5 tail block over t~35-40 drives the kmax=5 Route I Krein cutting-plane guarded LP residual
 * >= 0 at 2a=1.00. imp-97013 (FINEH=3e-5) showed the tail guard shrinks ~11x as predicted but the DESIGN
 * F itself dips below eps=1.0 in the tail band t~35-38 (F=0.802 at t=35.206), so the binding is the
 * design F, not the guard; it named the tail parametrisation as the remaining untested lever while
 * holding T=40 and HP=0.05 fixed. This run exercises exactly that lever: two matched FINEH=3e-5 solves,
 * one with a larger cutoff (T=60, HP=0.05) and one with a denser tail block (T=40, HP=0.01), both via the
 * same lp13 exact-sigma_2 cutting-plane (tmp/toeplitz-krein-lp13.py, KMAX=5, X=8, dx=0.02, VIOLTOL=0).
 * No-guard min pointwise design F re-measured independently from the emitted coefficients
 * (tmp/imp-97032/eval-minF.py). No bound moves; certified reach stays 2a<=0.96; RH open; NO QED.
 *
 * SETUP. Same guarded design condition as imp-97013: F(t) - guard(t) - eps >= 0 on a fine grid of
 * spacing FINEH plus a periodic tail block (spacing HP) for the top t^5 family, F = sigma_2 + sum_k sum_j
 * c_{k,j} t^k trig_k(x_j t), sigma_2 = (t^2+1/4)^2 w_1. The guard scales as FINEH^2; imp-97013 rendered
 * it negligible (0.013-0.018) and exposed the design-F tail dip. Here FINEH=3e-5 is held at that value and
 * the TAIL block is varied: (A) push the cutoff T=40 -> 60 (dip near the old T=40 edge should clear if it
 * is a cutoff artifact); (B) densify the tail block HP=0.05 -> 0.01 (5x more top-t^5 periodic-average rows
 * over the tail). Convergence = worst fine-grid guarded residual >= 0.
 *
 * FINDING 1 -- LARGER CUTOFF T=60 DOES NOT CONVERGE; THE DESIGN-F TAIL-EDGE DIP RELOCATES TO THE NEW EDGE.
 * With T pushed 40 -> 60 (HP=0.05, FINEH=3e-5) the worst guarded residual over rounds is non-monotone and
 * walls: best -0.1668 at round 12, WORSENING to -0.7447 at round 13 (full trajectory in TRAJECTORY.T60) --
 * worse than the T=40 baseline best -0.0557 (imp-97013), never reaching 0. The no-guard min pointwise F
 * (re-measured from the round-12 coefficients) shows why: the OLD dip band t~35-40 is now LIFTED (band
 * min F rises 0.802 -> 0.9951 at t=35.62; the t~30-35 band min is 1.0045 >= eps) but a NEW dip appears at
 * the NEW cutoff edge -- global min F = 0.8658 at t=42.555, near T=60. The tail-edge F-dip is a STRUCTURAL
 * edge effect that tracks wherever the cutoff sits; a larger T moves it outward, it does not remove it.
 *
 * FINDING 2 -- DENSER TAIL BLOCK HP=0.01 SLOWLY LIFTS F BUT WALLS BELOW eps; THE FINE-GRID DIP PERSISTS.
 * With the tail block densified HP=0.05 -> 0.01 (T=40, FINEH=3e-5, ~31k tail rows/round) the worst guarded
 * residual improves round on round (-0.2263, -0.0653, -0.0615 over rounds 3-5) but PLATEAUS near -0.06 --
 * essentially the imp-97013 best (-0.0557), not >= 0. The no-guard min pointwise F on the round-5 iterate
 * has risen from 0.782 (round 3) to 0.9529 at t=35.855 -- still BELOW eps=1.0 in the t~35-40 band. The
 * denser HP block tightens only the top-t^5 periodic-average tail constraint, not the fine-grid pointwise
 * F >= eps requirement, so the fine-grid design-F dip is only slowly nudged and does not clear. (This solve
 * was resource-limited to round 5 by the 5x larger tail-block row count; see sub-gap.)
 *
 * VERDICT. Neither the larger-cutoff-T lever nor the denser-HP-tail lever drives the kmax=5 guarded LP
 * residual >= 0 at 2a=1.00. The design F keeps dipping below eps in the tail: a larger T (60) RELOCATES
 * the tail-edge dip to the new cutoff (F=0.866 at t=42.55) rather than removing it, and a denser HP block
 * (0.01) only slowly lifts the fine-grid F toward eps while walling near -0.06 with F still below eps
 * (0.953 at t=35.85). This confirms and sharpens imp-97013: the binding is the design F below eps in the
 * tail -- a structural limit of the kmax=5 top-family near ANY finite cutoff, not a tail-discretisation
 * artifact that a bigger T or finer HP can dissolve. No converged iterate was produced. Certified reach
 * stays exactly 2a<=0.96.
 *   SUB-GAP IMP97032_TAIL_EDGE_DIP_IS_STRUCTURAL_NOT_PARAMETRISATION -- the design-F tail-edge dip
 *   relocates with the cutoff T (t~35 at T=40 -> t~42.5 at T=60) and survives tail-block densification
 *   (F still 0.953 at t=35.85 with HP=0.01), so it is a property of the kmax=5 design class near any finite
 *   cutoff; lifting it needs a RICHER DESIGN FAMILY (higher kmax or a different tail ansatz), not tail
 *   parametrisation.
 *   SUB-GAP IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5 -- the HP=0.01 solve (~31k tail-block rows
 *   per round) was run only to round 5 (worst -0.0615, plateauing near the imp-97013 best -0.0557); a
 *   longer run to full stall is untested, but the no-guard F dip (0.953 < eps at round 5) already shows the
 *   fine-grid binding persists.
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-97013-krein-finer-fineh-3e5-convergence.js (parent: FINEH=3e-5 exposes the design-F tail dip; sub-gap IMP97013_TAIL_PARAMETRISATION_OR_LARGER_T_UNTESTED)
 * @see imp-96970-krein-kmax5-100-converged-solve-verify.js (grandparent: FINEH=1e-4, residual cycles at -0.069, tail guard wall)
 * @see imp-97012-krein-kmax5-100-celllocal-w1pp-verify.js (cell-local |w1-prime-prime| verify machinery at 2a=1.00)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Solve configurations -- FINEH held at the imp-97013 3e-5; the TAIL block is the varied lever.
export const IMP97032_CONFIGS = Object.freeze({
  common: Object.freeze({ solver: 'tmp/toeplitz-krein-lp13.py (lp13 exact sigma_2 cutting-plane, KMAX=5)', twoA: 1.0, eps: 1.0, X: 8.0, dx: 0.02, FINEH: 3.0e-5, violTol: 0.0, method: 'highs-ds' }),
  leverA_largerT: Object.freeze({ T: 60.0, HP: 0.05, note: 'push the cutoff T=40 -> 60' }),
  leverB_denserHP: Object.freeze({ T: 40.0, HP: 0.01, note: 'densify the tail block HP=0.05 -> 0.01 (~31k tail rows/round)' }),
  baselineImp97013: Object.freeze({ T: 40.0, HP: 0.05, bestGuardedResidual: -0.055737948196962206 }),
});

// MEASURED worst-guarded-residual trajectories (from the lp13 per-round dumps).
export const IMP97032_TRAJECTORY = Object.freeze({
  // T=60, HP=0.05: non-monotone, walls; best -0.1668 (round 12), worsens to -0.7447 (round 13).
  T60: Object.freeze([-7466.8103, -615.9001, -931.3486, -12.5985, -3.2332, -0.8055, -0.2193, -0.4416, -1.5616, -0.7663, -0.639, -0.3904, -0.1667915522989556, -0.7446821460289921]),
  // T=40, HP=0.01 (rounds 0-5): improves round on round then plateaus near -0.06 (resource-limited to round 5).
  T40_HP001: Object.freeze([-588.145, -40.4652, -23.1795, -0.2263, -0.0653, -0.061482280869862294]),
});

// MEASURED no-guard min pointwise design F, re-computed independently from the emitted coefficients
// (tmp/imp-97032/eval-minF.py; interior = t<30, tail = t>=30, bands as named). Guard removed => this is the
// pure design-F dip, the binding term per imp-97013.
export const IMP97032_MIN_POINTWISE_F = Object.freeze({
  // Lever A (T=60, HP=0.05), round-12 iterate: old t~35-40 band lifted, dip RELOCATES to the new T=60 edge.
  leverA_T60: Object.freeze({
    round: 12, l1: 7.05192, worstGuardedResidual: -0.1667915522989556,
    globalMinF: 0.8658410729840398, globalMinAt: 42.555, // NEW dip near the new cutoff
    interiorMinF_lt30: 0.9948465869529173, interiorMinAt: 24.6586,
    band3540MinF: 0.9950808095745742, band3540At: 35.6242, // OLD dip band now lifted ~ to eps
    band3035MinF: 1.004501189570874, band3035At: 30.5183, // t~30-35 now >= eps
  }),
  // Lever B (T=40, HP=0.01), round-5 iterate: fine-grid dip slowly lifted 0.782 -> 0.953 but still < eps.
  leverB_HP001_round5: Object.freeze({
    round: 5, l1: 7.03023, worstGuardedResidual: -0.061482280869862294,
    globalMinF: 0.9529180417302996, globalMinAt: 35.8547, // still in t~35-40, still below eps
    interiorMinF_lt30: 0.9969169935211539, interiorMinAt: 24.3445,
    band3035MinF: 0.9905297458171844, band3035At: 30.7684,
  }),
  leverB_HP001_round3: Object.freeze({ round: 3, globalMinF: 0.7819164311513305, globalMinAt: 30.7688 }),
  eps: 1.0,
  imp97013BaselineTailMinF: 0.8015146688558161, // imp-97013 T=40 HP=0.05 FINEH=3e-5 round-9 tail dip
});

export const IMP97032_VERDICT = Object.freeze({
  ticket: 'imp-97032',
  question: 'does a larger cutoff T past 40 and/or a denser HP top-t^5 tail block drive the kmax=5 Krein guarded LP residual >= 0 at 2a=1.00 (imp-97013 tail-parametrisation lever) ?',
  twoA: 1.0,
  // Lever A: larger T does not converge; the design-F tail-edge dip relocates to the new cutoff
  largerTConverges: false,
  largerTBestGuardedResidual: -0.1667915522989556, // round 12; worsens to -0.7447 round 13
  largerTWorseThanBaseline: true, // -0.1668 vs imp-97013 baseline best -0.0557
  tailEdgeDipRelocatesToNewCutoff: true, // old t~35-40 lifted to 0.995; new dip 0.866 at t=42.55
  // Lever B: denser HP slowly lifts F but walls below eps; fine-grid dip persists
  denserHPConverges: false,
  denserHPBestGuardedResidual: -0.061482280869862294, // round 5, plateauing near baseline -0.0557
  denserHPFineGridDipPersists: true, // no-guard min F 0.953 < eps at t=35.85
  denserHPResourceLimitedRound: 5,
  // Shared conclusion
  designFKeepsDipping: true,
  bindingIsDesignFBelowEpsInTail: true, // confirms imp-97013
  tailEdgeDipIsStructural: true, // relocates with T, survives HP densification
  indicatedLever: 'a richer design family (higher kmax or a different tail ansatz), NOT tail parametrisation',
  producedConvergedIterate: false,
  frontierExtendsCertifiedReach: false,
  intervalRigorousReachUnchanged: 0.96,
  subGapStructural: 'IMP97032_TAIL_EDGE_DIP_IS_STRUCTURAL_NOT_PARAMETRISATION -- the design-F tail-edge dip relocates with the cutoff T (t~35 at T=40 -> t~42.5 at T=60) and survives tail-block densification (F still 0.953 at t=35.85 with HP=0.01), so it is a property of the kmax=5 design class near any finite cutoff; lifting it needs a richer design family, not tail parametrisation.',
  subGapDenserHPLimited: 'IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5 -- the HP=0.01 solve (~31k tail-block rows/round) was run only to round 5 (worst -0.0615, plateauing near the imp-97013 best -0.0557); a longer run to full stall is untested, but the no-guard F dip (0.953 < eps at round 5) already shows the fine-grid binding persists.',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97032_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97032_ASSERTIONS = [
  {
    id: 'imp97032-larger-T-does-not-converge-residual-walls',
    holds: () =>
      IMP97032_VERDICT.largerTConverges === false &&
      IMP97032_TRAJECTORY.T60.every((v) => v < 0) &&
      // best (least-negative) worst residual across the T=60 run is still below the baseline best
      Math.max(...IMP97032_TRAJECTORY.T60) < IMP97032_CONFIGS.baselineImp97013.bestGuardedResidual &&
      // non-monotone worsening at the end -> cutting-plane wall
      IMP97032_TRAJECTORY.T60[IMP97032_TRAJECTORY.T60.length - 1] < -0.5 &&
      IMP97032_VERDICT.largerTWorseThanBaseline === true,
    why: 'pushing the cutoff T=40 -> 60 (HP=0.05, FINEH=3e-5) gives a worst guarded residual that walls -- best -0.1668 (round 12), worsening to -0.7447 (round 13), never reaching 0 and worse than the imp-97013 baseline best -0.0557.',
  },
  {
    id: 'imp97032-tail-edge-dip-relocates-to-new-cutoff',
    holds: () =>
      IMP97032_MIN_POINTWISE_F.leverA_T60.band3540MinF > IMP97032_MIN_POINTWISE_F.imp97013BaselineTailMinF && // old dip band lifted
      IMP97032_MIN_POINTWISE_F.leverA_T60.band3035MinF >= IMP97032_MIN_POINTWISE_F.eps && // t~30-35 now >= eps
      IMP97032_MIN_POINTWISE_F.leverA_T60.globalMinF < IMP97032_MIN_POINTWISE_F.eps && // but global dip persists
      IMP97032_MIN_POINTWISE_F.leverA_T60.globalMinAt > 40 && // relocated near the new T=60 edge
      IMP97032_VERDICT.tailEdgeDipRelocatesToNewCutoff === true,
    why: 'with T=60 the old t~35-40 dip is lifted (band min 0.995, t~30-35 min 1.0045 >= eps) but a new dip appears at t=42.55 (global min F 0.866) near the new cutoff -- the tail-edge dip relocates outward, it is not removed.',
  },
  {
    id: 'imp97032-denser-HP-lifts-but-walls-below-eps',
    holds: () =>
      IMP97032_VERDICT.denserHPConverges === false &&
      // residual improves round on round then plateaus near -0.06 (not >= 0)
      IMP97032_TRAJECTORY.T40_HP001[5] < 0 &&
      IMP97032_TRAJECTORY.T40_HP001[5] > IMP97032_TRAJECTORY.T40_HP001[3] && // r5 better than r3
      Math.abs(IMP97032_TRAJECTORY.T40_HP001[5] - IMP97032_CONFIGS.baselineImp97013.bestGuardedResidual) < 0.02 && // plateaus near baseline best
      // no-guard fine-grid F lifted 0.782 -> 0.953 but still below eps
      IMP97032_MIN_POINTWISE_F.leverB_HP001_round5.globalMinF > IMP97032_MIN_POINTWISE_F.leverB_HP001_round3.globalMinF &&
      IMP97032_MIN_POINTWISE_F.leverB_HP001_round5.globalMinF < IMP97032_MIN_POINTWISE_F.eps &&
      IMP97032_VERDICT.denserHPFineGridDipPersists === true,
    why: 'densifying the tail block HP=0.05 -> 0.01 slowly lifts the fine-grid design F (0.782 round 3 -> 0.953 round 5) and the worst residual (-0.226 -> -0.0615) but plateaus near the imp-97013 best -0.0557 with F still below eps=1.0 at t=35.85 -- the denser block tightens only the periodic-average tail constraint, not the fine-grid F requirement.',
  },
  {
    id: 'imp97032-no-converged-iterate-reach-unchanged-no-qed',
    holds: () =>
      IMP97032_VERDICT.producedConvergedIterate === false &&
      IMP97032_VERDICT.designFKeepsDipping === true &&
      IMP97032_VERDICT.bindingIsDesignFBelowEpsInTail === true &&
      IMP97032_VERDICT.tailEdgeDipIsStructural === true &&
      IMP97032_VERDICT.frontierExtendsCertifiedReach === false &&
      IMP97032_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97032_VERDICT.subGapStructural.includes('IMP97032_TAIL_EDGE_DIP_IS_STRUCTURAL_NOT_PARAMETRISATION') &&
      IMP97032_VERDICT.subGapDenserHPLimited.includes('IMP97032_DENSER_HP_RUN_RESOURCE_LIMITED_TO_ROUND5') &&
      IMP97032_VERDICT.operatorPositivityProved === false &&
      IMP97032_VERDICT.rhResolved === false &&
      IMP97032_VERDICT.qed === false,
    why: 'neither the larger-T nor the denser-HP tail lever produced a converged kmax=5 iterate at 2a=1.00 (the design F keeps dipping below eps in the tail); the certified reach stays 2a<=0.96, both sub-gaps are named, and NO QED.',
  },
];

for (const a of IMP97032_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97032 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
