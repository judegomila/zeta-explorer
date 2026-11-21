/**
 * @fileoverview imp-97072 -- RICHER-DESIGN-FAMILY LEVER PROBE (numerical): test the imp-97032 sub-gap
 * IMP97032_TAIL_EDGE_DIP_IS_STRUCTURAL_NOT_PARAMETRISATION -- whether a RICHER design family (a kmax=6
 * top-t^6 top-family, as opposed to a bigger cutoff T or a denser HP tail block, both of which imp-97032
 * already ruled out) drives the Route I Krein cutting-plane guarded LP residual >= 0 at 2a=1.00, past the
 * structural design-F tail-edge dip the kmax=5 family cannot clear. imp-97032 showed the kmax=5 tail dip
 * (F below eps=1.0 in t~35-40) RELOCATES with the cutoff T and survives tail densification, so it is a
 * property of the kmax=5 design class near any finite cutoff, and lifting it needs a richer design family
 * (higher kmax or a different tail ansatz), not tail parametrisation. This run exercises the higher-kmax
 * branch of that named lever: one matched FINEH=3e-5 solve at KMAX=6 (top-t^6 family added to the
 * top-t^k periodic tail block), same lp13 exact-sigma_2 cutting-plane (tmp/toeplitz-krein-lp13.py,
 * X=8, dx=0.02, eps=1.0, T=40, HP=0.05, VIOLTOL=0, highs-ds, runner tmp/imp-97072/run-kmax6.py).
 * No-guard min pointwise design F re-measured independently from the emitted coefficients at spacing 1e-4.
 * No bound moves; certified reach stays 2a<=0.96; RH open; NO QED.
 *
 * SETUP. Same guarded design condition as imp-97013/imp-97032, now with an extra top-degree family:
 * F(t) = sigma_2(t) + sum_{k=0..6} sum_j c_{k,j} t^k trig_k(x_j t), trig_k = cos (k even) / sin (k odd),
 * sigma_2 = (t^2+1/4)^2 w_1. The periodic tail block now constrains the top t^6 family (lp13 keys the
 * tail block to FAMS index KMAX), so the kmax=6 solve has the SAME machinery as kmax=5 plus one more
 * top-degree lever. Guard scales as FINEH^2; at FINEH=3e-5 it is negligible (imp-97013 rendered it
 * ~0.013-0.018), so the binding is the design F itself, per imp-97013 FINDING 2. Convergence = worst
 * fine-grid guarded residual >= 0.
 *
 * FINDING 1 -- THE kmax=6 TOP-FAMILY DOES NOT CONVERGE; THE GUARDED RESIDUAL WALLS AND IS WORSE THAN kmax=5.
 * Over 15 rounds the worst guarded residual is non-monotone and walls: it improves to a best (least
 * negative) of -0.10636 at round 8, then WORSENS back to -0.2097 at round 14 (full trajectory in
 * TRAJECTORY.kmax6). It never reaches 0. Crucially the kmax=6 best -0.10636 is WORSE than the kmax=5
 * FINEH=3e-5 baseline best -0.055737948196962206 (imp-97013 round 6): the extra top-t^6 degree of freedom
 * did NOT tighten the wall, it left it essentially where kmax=5 sat (and the cutting-plane path walled
 * sooner). l1 holds at ~6.80612 across all rounds (71 nonzero atoms), barely moving -- the tail-block
 * constraint pins the top-family coefficients and the added t^6 lever is not exploited to clear the dip.
 *
 * FINDING 2 -- THE STRUCTURAL DESIGN-F TAIL DIP PERSISTS UNDER THE HIGHER kmax; F STAYS ~0.81 BELOW eps.
 * The no-guard min pointwise design F, re-measured independently from the final-iterate coefficients at
 * spacing 1e-4, is 0.81259 at t=31.0005 -- still deep below eps=1.0, in the same tail band as the kmax=5
 * dip (imp-97013 round-9 tail dip 0.80151 at t=35.206; imp-97032 lever-B round-5 dip 0.9529 at t=35.855).
 * The t~35-40 band min is 0.81726 at t=37.767 and the t~30-35 band min is 0.81259 at t=31.0005; even the
 * interior (t<30) min is 0.97495 at t=26.218, below eps. So a top-t^6 family, with the guard already
 * negligible at FINEH=3e-5, still cannot hold the design F >= eps on the dense fine grid in the tail --
 * the dip is essentially unmoved (0.813 vs the kmax=5 0.802), not lifted toward eps.
 *
 * VERDICT. The higher-kmax branch of the imp-97032 richer-design-family lever does NOT drive the guarded
 * LP residual >= 0 at 2a=1.00. A kmax=6 top-family walls at a best worst-residual -0.10636 (WORSE than the
 * kmax=5 baseline -0.0557) with the design F still ~0.81 below eps in the tail. This sharpens the imp-97032
 * sub-gap: the tail-edge dip is structural not merely to the kmax=5 truncation but to the whole top-t^k
 * plus periodic-tail-block ansatz -- simply raising the top degree within that same ansatz does not remove
 * it (it does not even improve the wall). The OTHER named branch, a genuinely different decaying tail
 * ansatz (not a higher-degree top-family with the same periodic tail block), stays untested. No converged
 * iterate was produced. Certified reach stays exactly 2a<=0.96.
 *   SUB-GAP IMP97072_HIGHER_KMAX_TOP_FAMILY_DOES_NOT_LIFT_STRUCTURAL_TAIL_DIP -- a kmax=6 top-t^6 family
 *   (same lp13 exact-sigma_2 cutting-plane, FINEH=3e-5, T=40, HP=0.05) walls at best worst-residual
 *   -0.10636 (worse than the kmax=5 -0.0557) with no-guard min F 0.813 < eps in the tail; the extra
 *   top-degree lever does not clear the structural dip. Higher kmax within the top-t^k periodic-tail-block
 *   ansatz is refuted as the lever.
 *   SUB-GAP IMP97072_ALTERNATIVE_DECAYING_TAIL_ANSATZ_UNTESTED -- the second branch imp-97032 named (a
 *   different decaying tail ansatz, replacing the top-t^k periodic tail block itself rather than raising
 *   its degree) requires changing the lp13 design/tail structure and was not exercised here; whether such
 *   a genuinely different ansatz lifts the tail dip stays open.
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-97032-krein-tail-parametrisation-lever.js (parent: tail-edge dip structural, needs a richer design family; sub-gap IMP97032_TAIL_EDGE_DIP_IS_STRUCTURAL_NOT_PARAMETRISATION)
 * @see imp-97013-krein-finer-fineh-3e5-convergence.js (kmax=5 FINEH=3e-5 baseline best -0.0557; design-F tail dip 0.80151 at t=35.206)
 * @see imp-96970-krein-kmax5-100-converged-solve-verify.js (kmax=5 FINEH=1e-4, residual cycles at -0.069, tail guard wall)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Solve configuration -- richer design family (KMAX=6) at the imp-97013/imp-97032 2a=1.00 baseline.
export const IMP97072_CONFIG = Object.freeze({
  solver: 'tmp/toeplitz-krein-lp13.py (lp13 exact sigma_2 cutting-plane)',
  runner: 'tmp/imp-97072/run-kmax6.py',
  KMAX: 6, twoA: 1.0, eps: 1.0, X: 8.0, dx: 0.02, FINEH: 3.0e-5, T: 40.0, HP: 0.05, violTol: 0.0, method: 'highs-ds',
  rounds: 15, nonzeroAtoms: 71,
  kmax5BaselineImp97013BestGuardedResidual: -0.055737948196962206,
  kmax5BaselineImp97013TailMinF: 0.8015146688558161, // imp-97013 round-9 tail dip at t=35.206
});

// MEASURED worst-guarded-residual trajectory (from the lp13 per-round dumps), rounds 0..14.
export const IMP97072_TRAJECTORY = Object.freeze({
  kmax6: Object.freeze([
    -344.3824323454886, -158.27309352222238, -2.03194523709476, -3.4267974084096986,
    -0.5577538967334915, -0.5149313710380008, -0.4402682965380935, -0.2962071757620607,
    -0.10636372177316833, -0.15149705116385248, -0.41808711504566487, -0.2248336471669835,
    -0.22354311587792997, -0.37490757655779006, -0.2096890413596496,
  ]),
  bestGuardedResidual: -0.10636372177316833, // round 8 (least negative)
  finalGuardedResidual: -0.2096890413596496, // round 14
});

// MEASURED no-guard min pointwise design F, re-computed independently from the final-iterate coefficients
// (tmp/imp-97072/run-kmax6.py, spacing 1e-4; interior = t<30, bands as named). Guard removed => the pure
// design-F dip, the binding term at FINEH=3e-5 per imp-97013.
export const IMP97072_MIN_POINTWISE_F = Object.freeze({
  globalMinF: 0.8125882381573319, globalMinAt: 31.0005,
  interiorMinF_lt30: 0.9749479001620784, interiorMinAt: 26.218,
  band3540MinF: 0.8172615165822208, band3540At: 37.7671,
  band3035MinF: 0.8125882381573319, band3035At: 31.0005,
  eps: 1.0,
});

export const IMP97072_VERDICT = Object.freeze({
  ticket: 'imp-97072',
  question: 'does a richer design family (a kmax=6 top-t^6 top-family) drive the Route I Krein guarded LP residual >= 0 at 2a=1.00, past the structural design-F tail-edge dip the kmax=5 family cannot clear (imp-97032 sub-gap) ?',
  twoA: 1.0,
  richerFamilyConverges: false,
  richerFamilyBestGuardedResidual: -0.10636372177316833, // round 8; worsens to -0.2097 by round 14
  richerFamilyWorseThanKmax5Baseline: true, // best -0.10636 vs kmax=5 imp-97013 best -0.0557
  tailEdgeDipPersistsUnderHigherKmax: true, // no-guard min F 0.813 < eps, essentially the kmax=5 0.802
  designFDipsBelowEpsInTail: true,
  extraTopDegreeNotExploited: true, // l1 pinned ~6.80612, 71 atoms, dip unmoved
  producedConvergedIterate: false,
  higherKmaxWithinSameAnsatzRefuted: true,
  indicatedLever: 'a genuinely different decaying tail ansatz (not a higher-degree top-family with the same top-t^k periodic tail block); higher kmax within the same ansatz is refuted',
  frontierExtendsCertifiedReach: false,
  intervalRigorousReachUnchanged: 0.96,
  subGapHigherKmax: 'IMP97072_HIGHER_KMAX_TOP_FAMILY_DOES_NOT_LIFT_STRUCTURAL_TAIL_DIP -- a kmax=6 top-t^6 family (lp13 exact sigma_2, FINEH=3e-5, T=40, HP=0.05) walls at best worst-residual -0.10636 (worse than the kmax=5 -0.0557) with no-guard min F 0.813 < eps in the tail; higher kmax within the top-t^k periodic-tail-block ansatz does not clear the structural dip.',
  subGapAlternativeAnsatz: 'IMP97072_ALTERNATIVE_DECAYING_TAIL_ANSATZ_UNTESTED -- the second branch imp-97032 named (a genuinely different decaying tail ansatz, replacing the top-t^k periodic tail block rather than raising its degree) requires changing the lp13 design/tail structure and stays untested.',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97072_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97072_ASSERTIONS = [
  {
    id: 'imp97072-kmax6-does-not-converge-residual-walls',
    holds: () =>
      IMP97072_VERDICT.richerFamilyConverges === false &&
      IMP97072_TRAJECTORY.kmax6.every((v) => v < 0) &&
      // best (least-negative) worst residual across the run equals the recorded best
      Math.max(...IMP97072_TRAJECTORY.kmax6) === IMP97072_TRAJECTORY.bestGuardedResidual &&
      // non-monotone worsening after the best -> cutting-plane wall
      IMP97072_TRAJECTORY.kmax6[IMP97072_TRAJECTORY.kmax6.length - 1] < IMP97072_TRAJECTORY.bestGuardedResidual,
    why: 'the kmax=6 top-family solve (FINEH=3e-5, T=40, HP=0.05) gives a worst guarded residual that walls -- best -0.10636 (round 8), worsening to -0.2097 (round 14), never reaching 0.',
  },
  {
    id: 'imp97072-kmax6-worse-than-kmax5-baseline',
    holds: () =>
      IMP97072_VERDICT.richerFamilyWorseThanKmax5Baseline === true &&
      // kmax=6 best is more negative than the kmax=5 imp-97013 baseline best
      IMP97072_TRAJECTORY.bestGuardedResidual < IMP97072_CONFIG.kmax5BaselineImp97013BestGuardedResidual &&
      IMP97072_VERDICT.extraTopDegreeNotExploited === true,
    why: 'the kmax=6 best worst-residual -0.10636 is worse than the kmax=5 FINEH=3e-5 baseline best -0.0557 (imp-97013): the extra top-t^6 degree of freedom did not tighten the wall, l1 stays pinned ~6.80612.',
  },
  {
    id: 'imp97072-structural-tail-dip-persists-under-higher-kmax',
    holds: () =>
      IMP97072_VERDICT.tailEdgeDipPersistsUnderHigherKmax === true &&
      IMP97072_MIN_POINTWISE_F.globalMinF < IMP97072_MIN_POINTWISE_F.eps && // still below eps
      IMP97072_MIN_POINTWISE_F.band3540MinF < IMP97072_MIN_POINTWISE_F.eps &&
      IMP97072_MIN_POINTWISE_F.band3035MinF < IMP97072_MIN_POINTWISE_F.eps &&
      // essentially unmoved from the kmax=5 tail dip (within 0.02), not lifted toward eps
      Math.abs(IMP97072_MIN_POINTWISE_F.globalMinF - IMP97072_CONFIG.kmax5BaselineImp97013TailMinF) < 0.02,
    why: 'the no-guard min pointwise design F on the kmax=6 final iterate is 0.813 at t=31.0 (band 35-40 min 0.817, band 30-35 min 0.813, interior min 0.975) -- still deep below eps=1.0 and essentially the kmax=5 tail dip 0.802, so higher kmax does not lift the structural dip.',
  },
  {
    id: 'imp97072-no-converged-iterate-reach-unchanged-no-qed',
    holds: () =>
      IMP97072_VERDICT.producedConvergedIterate === false &&
      IMP97072_VERDICT.higherKmaxWithinSameAnsatzRefuted === true &&
      IMP97072_VERDICT.designFDipsBelowEpsInTail === true &&
      IMP97072_VERDICT.frontierExtendsCertifiedReach === false &&
      IMP97072_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97072_VERDICT.subGapHigherKmax.includes('IMP97072_HIGHER_KMAX_TOP_FAMILY_DOES_NOT_LIFT_STRUCTURAL_TAIL_DIP') &&
      IMP97072_VERDICT.subGapAlternativeAnsatz.includes('IMP97072_ALTERNATIVE_DECAYING_TAIL_ANSATZ_UNTESTED') &&
      IMP97072_VERDICT.operatorPositivityProved === false &&
      IMP97072_VERDICT.rhResolved === false &&
      IMP97072_VERDICT.qed === false,
    why: 'the kmax=6 richer top-family did not produce a converged iterate at 2a=1.00 (the design F keeps dipping ~0.81 below eps in the tail); higher kmax within the same ansatz is refuted, the alternative-tail-ansatz branch stays open, the certified reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP97072_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97072 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
