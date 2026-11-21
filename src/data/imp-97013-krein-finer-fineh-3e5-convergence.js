/**
 * @fileoverview imp-97013 -- FINER-FINEH CONVERGENCE PROBE (numerical): test whether a much finer
 * fine-grid spacing FINEH (3e-5, vs the imp-96970 1e-4) drives the kmax=5 Route I Krein cutting-plane
 * guarded LP residual >= 0 at 2a=1.00, past the tail t^5 guard wall imp-96970 hit (residual cycled at
 * -0.069). This targets the imp-96970 SUB-GAP IMP96970_LP_CONVERGENCE_NOT_REACHED, which explicitly
 * left a much finer FINEH / a different tail parametrisation untested. Import-light: all values below
 * are frozen literals from a direct scipy-HiGHS cutting-plane solve (tmp/imp-97013/solve-fineh3e5.py,
 * FINEH=3e-5, HP=0.05, VIOLTOL=0, KMAX=5, X=8, dx=0.02, T=40, highs-ds) plus two IEEE-double worst-point
 * diagnostics (tmp/imp-97013/diag-worst-location.py, diag-minF.py). No bound moves; certified reach
 * stays 2a<=0.96; RH open; NO QED.
 *
 * SETUP. The cutting-plane LP minimises the atom l1 subject to the guarded design condition
 *   F(t_f) - guard(t_f) - eps >= 0,  F(t) = sigma_2(t) + sum_k sum_j c_{k,j} t^k trig_k(x_j t),
 * sigma_2 = (t^2+1/4)^2 w_1, guard = (FINEH^2/8)(sum |c| |t^k trig|-second-deriv bound + |sigma_2 second
 * deriv| bound), over a fine grid of spacing FINEH plus a periodic tail block (spacing HP) for the top
 * t^5 family. The guard scales as FINEH^2, so FINEH 1e-4 -> 3e-5 shrinks it by ~(1e-4/3e-5)^2 = 11.1x.
 * Convergence = worst fine-grid guarded residual >= 0. VIOLTOL=0 keeps adding cutting planes until that
 * holds (or the round cap is hit). imp-96970 used FINEH=1e-4 (residual cycled at -0.069, walled by the
 * tail guard); imp-96956 used FINEH=3e-4 (stalled at -0.166).
 *
 * FINDING 1 -- FINER FINEH DOES NOT CONVERGE; THE GUARDED RESIDUAL STILL CYCLES AND EVEN WORSENS. With
 * FINEH refined 1e-4 -> 3e-5 (guard ~11x smaller) and VIOLTOL=0, the fine-grid worst guarded residual
 * over rounds 3-9 is -0.2262, -0.2144, -0.1566, -0.0557, -0.0652, -0.0783, -0.2118: NON-MONOTONE and
 * never reaching 0. It improves to a best of -0.0557 at round 6 (a modest gain on the imp-96970 -0.069
 * at FINEH=1e-4 and the imp-96956 -0.166 at FINEH=3e-4) but then WORSENS back to -0.2118 at round 9 --
 * the cutting-plane WALL signature, not convergence. l1 holds at ~7.03023 throughout (61 nonzero atoms),
 * as in imp-96970. The solve was stopped at round 9 once the non-monotone worsening made non-convergence
 * unambiguous. So a fully-converged (guarded-residual >= 0) kmax=5 iterate at 2a=1.00 was again NOT
 * produced -- a much finer FINEH does not clear the wall.
 *
 * FINDING 2 -- THE GUARD IS NO LONGER THE BINDING TERM; THE DESIGN F ITSELF DIPS BELOW eps IN THE TAIL.
 * The guard DID shrink exactly as predicted: at the round-8 worst point t=37.810 the guard is 0.01825
 * and at the round-9 worst point t=35.206 it is 0.01329 -- ~9.4x-13x below the imp-96970 tail guard 0.1716
 * (consistent with the FINEH^2 scaling). But the residual stays negative because the DESIGN F itself now
 * dips below eps=1.0 in the tail band: F=0.93993 at t=37.810 (round 8) and F=0.80151 at t=35.206
 * (round 9). This is a QUALITATIVE shift from imp-96970, where the pointwise F stayed above eps
 * everywhere (minPointwiseF = +1.00000002) and ONLY the guard ate the margin. With the guard rendered
 * negligible by the fine grid, the LP effectively must hold the design F >= eps on the dense 3e-5 tail
 * grid -- and the kmax=5 family cannot: the global min pointwise F on the round-9 iterate is 0.80151 at
 * t=35.206 (tail-dominated; the interior min for t<30 is 0.93740 at t=24.778, also below eps).
 *
 * FINDING 3 -- THE BINDING RELOCATES BETWEEN TAIL BANDS EACH ROUND (t~35-38 NEAR THE T=40 EDGE). The LP
 * worst point jumps between adjacent tail sub-bands as cutting planes are added: t=37.810 (round 8) then
 * t=35.206 (round 9), both in the t~35-38 transition region just below the T=40 tail-block cutover.
 * Lifting the design F above eps at one tail band drops it below at a neighbouring one, so the residual
 * cycles. This points the remaining lever at the TAIL PARAMETRISATION (a larger cutoff T, or a denser
 * top-t^5-family periodic tail block covering the t~35-40 transition), NOT at further FINEH refinement
 * (which removes the guard but exposes the F-below-eps tail dip) and NOT at hc verifier refinement.
 *
 * VERDICT. A much finer FINEH (3e-5) does NOT drive the kmax=5 guarded LP residual >= 0 at 2a=1.00. It
 * shrinks the tail guard ~11x as predicted (0.1716 -> 0.013-0.018), removing the guard as the binding
 * term, but the residual still cycles (best -0.0557 at round 6, worsening to -0.2118 at round 9) because
 * the design F itself dips below eps=1.0 in the tail band t~35-38 (F down to 0.80 at t=35.206), a limit
 * of the kmax=5 top-family near the T=40 edge that no FINEH change can lift. No converged iterate was
 * produced. The certified interval-rigorous reach stays exactly 2a<=0.96.
 *   SUB-GAP IMP97013_FINER_FINEH_DOES_NOT_CONVERGE -- FINEH=3e-5 (tail guard ~11x smaller, 0.013-0.018)
 *   still cycles in [-0.212, -0.056] over rounds 3-9 and never reaches 0; the binding is the design F
 *   dipping below eps in the tail band t~35-38, not the guard.
 *   SUB-GAP IMP97013_TAIL_PARAMETRISATION_OR_LARGER_T_UNTESTED -- whether an alternative tail block (a
 *   larger cutoff T past 40, or a denser HP top-t^5-family tail covering the t~35-40 transition) that
 *   lifts the design F >= eps across the tail edge drives convergence remains open; this run tested only
 *   the FINEH refinement lever (which no longer helps), holding T=40 and HP=0.05 fixed.
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96970-krein-kmax5-100-converged-solve-verify.js (parent: FINEH=1e-4, residual cycles at -0.069, tail guard wall; sub-gap IMP96970_LP_CONVERGENCE_NOT_REACHED)
 * @see imp-96956-krein-kmax5-100-interval-verify.js (grandparent: FINEH=3e-4 lean iterate, stalled -0.166, collapses under rigor)
 * @see imp-96978-krein-kmax5-100-guard-resolution.js (diagnosed the C2 curvature guard structure)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Solve configuration -- finer FINEH than the imp-96970 1e-4, same tail block and VIOLTOL.
export const IMP97013_SOLVE_CONFIG = Object.freeze({
  solver: 'tmp/imp-97013/solve-fineh3e5.py (lp13 exact sigma_2 cutting-plane, KMAX=5)',
  twoA: 1.0,
  eps: 1.0,
  X: 8.0,
  dx: 0.02,
  T: 40.0,
  FINEH: 3.0e-5, // vs imp-96970 1e-4 (guard ~11.1x smaller) and imp-96956 3e-4
  HP: 0.05, // same periodic tail block as imp-96970
  violTol: 0.0, // require guarded residual >= 0
  method: 'highs-ds',
  guardScaleVsImp96970: 11.111, // (1e-4/3e-5)^2
});

// MEASURED solve result -- the LP does NOT converge; the guarded residual cycles and worsens.
export const IMP97013_SOLVE = Object.freeze({
  converged: false,
  l1: 7.030230602274985,
  nNonzeroAtoms: 61,
  bestGuardedResidual: -0.055737948196962206, // least-negative, at round 6
  bestGuardedResidualRound: 6,
  finalGuardedResidual: -0.21177276065514217, // round 9 (worsened -> wall)
  finalRound: 9,
  stoppedEarly: true, // stopped at round 9 once the non-monotone worsening made non-convergence clear
  // rounds 3-9 worst-guarded-residual trajectory (non-monotone => cutting-plane wall, not convergence)
  residualCycle: [-0.2262283817720957, -0.21435237492175563, -0.1565967841536713, -0.055737948196962206, -0.06521809582164673, -0.07832398640229965, -0.21177276065514217],
  improvesBestOverImp96970: true, // best -0.0557 (FINEH=3e-5) vs imp-96970 -0.069 (FINEH=1e-4), still not >= 0
  improvesBestOverImp96956: true, // vs imp-96956 -0.166 (FINEH=3e-4)
});

// MEASURED IEEE-double worst-point diagnostics on the round-8 and round-9 iterates (diag-worst-location.py):
// the guard is now negligible; the binding is the design F dipping below eps in the tail band t~35-38.
export const IMP97013_BINDING = Object.freeze({
  round8: Object.freeze({ t: 37.80957, F: 0.9399265754036605, guard: 0.01825056227162148, residual: -0.07832398686796094 }),
  round9: Object.freeze({ t: 35.20608, F: 0.8015146688558161, guard: 0.013287429278127648, residual: -0.21177276042231152 }),
  imp96970TailGuard: 0.171551, // FINEH=1e-4 tail guard (this run: 0.013-0.018, ~9.4x-13x smaller)
  imp96970WorstF: 1.102637, // imp-96970 F stayed ABOVE eps (guard-bound); here F dips BELOW eps
});

// MEASURED global / banded min pointwise design F on the round-9 iterate (diag-minF.py, no guard):
// F itself dips below eps=1.0 in the tail band, unlike imp-96970 (minPointwiseF = +1.00000002).
export const IMP97013_MIN_POINTWISE_F = Object.freeze({
  globalMinF: 0.8015146688558161,
  globalMinAt: 35.20608, // tail band, near the T=40 edge
  tailMinF_ge30: 0.8015146688558161,
  tailMinAt: 35.20608,
  interiorMinF_lt30: 0.9373958404175937,
  interiorMinAt: 24.7776,
  eps: 1.0,
  imp96970MinPointwiseF: 1.00000002, // imp-96970: F stayed >= eps everywhere (guard-only wall)
});

export const IMP97013_VERDICT = Object.freeze({
  ticket: 'imp-97013',
  question: 'does a much finer FINEH (3e-5) drive the kmax=5 Krein guarded LP residual >= 0 at 2a=1.00, past the imp-96970 tail t^5 guard wall (residual cycled at -0.069) ?',
  twoA: 1.0,
  // Finding 1: still no convergence
  lpConverges: false,
  lpResidualCycles: true, // non-monotone, worsens r8 -0.078 -> r9 -0.212
  lpBestGuardedResidual: IMP97013_SOLVE.bestGuardedResidual,
  finerFinehConverges: false,
  // Finding 2: guard shrank as predicted; design F now dips below eps in the tail
  guardShrankAsPredicted: true, // 0.1716 -> 0.013-0.018 (~11x, matching FINEH^2)
  guardIsBindingTerm: false, // no longer -- guard is now negligible
  designFDipsBelowEps: true, // F down to 0.80 at t=35.206 (imp-96970: F stayed >= eps)
  bindingIsTailFBelowEps: true,
  // Finding 3: binding relocates between tail bands near the T=40 edge
  bindingRelocatesBetweenTailBands: true, // t=37.810 (r8) <-> t=35.206 (r9)
  indicatedLever: 'tail parametrisation (larger T past 40, or denser HP top-t^5 tail over t~35-40), NOT further FINEH refinement',
  // Decision
  producedConvergedIterate: false,
  frontierExtendsCertifiedReach: false,
  intervalRigorousReachUnchanged: 0.96,
  // Honest sub-gaps + guardrails
  subGapFinerFineh: 'IMP97013_FINER_FINEH_DOES_NOT_CONVERGE -- FINEH=3e-5 (tail guard ~11x smaller, 0.013-0.018) still cycles in [-0.212,-0.056] over rounds 3-9 and never reaches 0; the binding is the design F dipping below eps in the tail band t~35-38, not the guard.',
  subGapTailParametrisation: 'IMP97013_TAIL_PARAMETRISATION_OR_LARGER_T_UNTESTED -- whether an alternative tail block (a larger cutoff T past 40, or a denser HP top-t^5-family tail covering the t~35-40 transition) that lifts the design F >= eps across the tail edge drives convergence remains open; this run tested only the FINEH refinement lever (which no longer helps), holding T=40 and HP=0.05 fixed.',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97013_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97013_ASSERTIONS = [
  {
    id: 'imp97013-finer-fineh-does-not-converge-residual-cycles',
    holds: () =>
      IMP97013_SOLVE.converged === false &&
      IMP97013_SOLVE.residualCycle.every((v) => v < 0) &&
      // non-monotone AND worsens: a later round is worse than an earlier one -> cutting-plane wall
      IMP97013_SOLVE.residualCycle.some((v, i) => i > 0 && v < IMP97013_SOLVE.residualCycle[i - 1]) &&
      IMP97013_SOLVE.finalGuardedResidual < IMP97013_SOLVE.bestGuardedResidual &&
      IMP97013_VERDICT.finerFinehConverges === false,
    why: 'at FINEH=3e-5/HP=0.05/VIOLTOL=0 the kmax=5 guarded residual improves to a best -0.0557 (round 6) then WORSENS to -0.2118 (round 9), non-monotone across rounds 3-9 and never reaching 0 -- a cutting-plane wall, not convergence.',
  },
  {
    id: 'imp97013-best-residual-improves-on-parents-still-negative',
    holds: () =>
      IMP97013_SOLVE.bestGuardedResidual < 0 &&
      IMP97013_SOLVE.bestGuardedResidual > -0.069 && // best -0.0557 beats imp-96970 -0.069 (FINEH=1e-4)
      IMP97013_SOLVE.improvesBestOverImp96970 === true &&
      IMP97013_SOLVE.improvesBestOverImp96956 === true,
    why: 'the finer grid improves the best worst-residual to -0.0557 (vs imp-96970 -0.069 at FINEH=1e-4 and imp-96956 -0.166 at FINEH=3e-4) but never reaches >= 0.',
  },
  {
    id: 'imp97013-guard-shrank-but-design-F-dips-below-eps',
    holds: () =>
      IMP97013_BINDING.round8.guard < 0.02 &&
      IMP97013_BINDING.round9.guard < 0.02 &&
      IMP97013_BINDING.round8.guard < IMP97013_BINDING.imp96970TailGuard / 9 && // ~11x smaller
      IMP97013_BINDING.round8.F < IMP97013_SOLVE_CONFIG.eps && // design F below eps=1.0
      IMP97013_BINDING.round9.F < IMP97013_SOLVE_CONFIG.eps &&
      IMP97013_VERDICT.guardShrankAsPredicted === true &&
      IMP97013_VERDICT.guardIsBindingTerm === false &&
      IMP97013_VERDICT.designFDipsBelowEps === true,
    why: 'the tail guard shrank ~11x (0.1716 -> 0.013-0.018, the FINEH^2 scaling) so it is no longer binding; the residual stays negative because the design F itself dips below eps=1.0 in the tail (0.940 at t=37.81 round 8, 0.802 at t=35.21 round 9).',
  },
  {
    id: 'imp97013-min-pointwise-F-below-eps-in-tail-unlike-imp96970',
    holds: () =>
      IMP97013_MIN_POINTWISE_F.globalMinF < IMP97013_MIN_POINTWISE_F.eps &&
      IMP97013_MIN_POINTWISE_F.globalMinAt > 30 && // global min sits in the tail band
      IMP97013_MIN_POINTWISE_F.interiorMinF_lt30 < IMP97013_MIN_POINTWISE_F.eps &&
      IMP97013_MIN_POINTWISE_F.globalMinF < IMP97013_MIN_POINTWISE_F.tailMinF_ge30 + 1e-12 &&
      IMP97013_MIN_POINTWISE_F.imp96970MinPointwiseF > IMP97013_MIN_POINTWISE_F.eps, // imp-96970 F stayed >= eps
    why: 'on the round-9 iterate the global min pointwise design F is 0.8015 at t=35.206 (tail band), below eps=1.0 -- a qualitative shift from imp-96970 where the pointwise F stayed above eps (+1.00000002) and only the guard was binding.',
  },
  {
    id: 'imp97013-no-converged-iterate-reach-unchanged-no-qed',
    holds: () =>
      IMP97013_VERDICT.producedConvergedIterate === false &&
      IMP97013_VERDICT.bindingIsTailFBelowEps === true &&
      IMP97013_VERDICT.frontierExtendsCertifiedReach === false &&
      IMP97013_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97013_VERDICT.subGapFinerFineh.includes('IMP97013_FINER_FINEH_DOES_NOT_CONVERGE') &&
      IMP97013_VERDICT.subGapTailParametrisation.includes('IMP97013_TAIL_PARAMETRISATION_OR_LARGER_T_UNTESTED') &&
      IMP97013_VERDICT.operatorPositivityProved === false &&
      IMP97013_VERDICT.rhResolved === false &&
      IMP97013_VERDICT.qed === false,
    why: 'no converged kmax=5 iterate was produced at 2a=1.00 (finer FINEH cycles, walled by the design F dipping below eps in the tail); the certified reach stays 2a<=0.96, both sub-gaps are named, and NO QED.',
  },
];

for (const a of IMP97013_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97013 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
