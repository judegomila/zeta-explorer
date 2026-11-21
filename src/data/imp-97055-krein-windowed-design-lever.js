/**
 * @fileoverview imp-97055 -- WINDOWED/TAPERED DESIGN + EDGE-WEIGHTED OBJECTIVE LEVER PROBE (numerical):
 * test the imp-97032 sub-gap IMP97032_TAIL_EDGE_DIP_IS_STRUCTURAL_NOT_PARAMETRISATION -- whether the two
 * UNTRIED levers (a windowed/tapered endpoint-damped design F, or an edge-weighted L1 objective) remove the
 * STRUCTURAL tail-edge F-dip in the kmax=5 Route I Krein guarded LP at 2a=1.00. imp-97032 showed neither a
 * larger cutoff T (relocates the dip to the new edge) nor a denser HP tail block (plateaus near -0.06) drives
 * the guarded residual >= 0, and named a RICHER DESIGN FAMILY as the indicated lever. This run exercises two
 * such richer-design levers on top of the same lp13 exact-sigma_2 cutting-plane (KMAX=5, X=8, dx=0.02, a=0.5,
 * T=40, eps=1.0), three matched 40-round solves at FINEH=1e-4:
 *   (BASE)  plain atoms, min-L1 objective                                   -- control.
 *   (EDGEW) plain atoms, EDGE-WEIGHTED objective  min sum_j (1/(1+x_j))|c_j| -- lever 2 (down-weight the
 *           high-x tail atoms in the cost so the solver is FREE to spend them near the cutoff edge).
 *   (TAPER) raised-cosine endpoint-damped atoms over [T-5, T] (a genuinely different tail family) with the
 *           product-rule taper guard |(W f)''| <= |W''||f| + 2|W'||f'| + |W||f''| kept rigorous. -- lever 1.
 * Convergence = worst fine-grid guarded residual >= 0. No bound moves; certified reach stays 2a<=0.96;
 * RH open; NO QED. (tmp/imp-97055-windowed-edgeweighted.py; tmp/imp-97055-out.json + run logs.)
 *
 * SETUP. Same guarded design condition as imp-97032/imp-97013: F(t) - guard(t) - eps >= 0 on a fine grid of
 * spacing FINEH plus the second-order between-grid guard (scales as FINEH^2), F = sigma_2 + sum_k sum_j
 * c_{k,j} t^k trig_k(x_j t), sigma_2 = (t^2+1/4)^2 w_1. imp-97032 reported the DESIGN F dipping to ~0.80-0.95
 * in the tail band at ~14 rounds; here all three solves are pushed to 40 rounds. IMPORTANT: at 40 rounds the
 * no-guard design F reaches eps (>= 1.0) everywhere in every mode, so the residual deficit is no longer the
 * design F below eps but the between-grid GUARD term (see FINDING 3 and the sub-gap).
 *
 * FINDING 1 -- EDGE-WEIGHTED OBJECTIVE DOES NOT HELP; IT CANNOT CHANGE FEASIBILITY. The edge-weighted L1 cost
 * (cheap high-x tail atoms) gives a final worst guarded residual -0.008533 at t=34.826 -- marginally WORSE
 * than the BASE control -0.007665 at t=37.809, not >= 0. This is the expected outcome: reweighting the
 * objective leaves the constraint set (the feasible polytope of coefficient vectors c) identical, so it can
 * only move the minimiser AMONG feasible c; it cannot create feasibility where the guarded residual walls
 * negative. The dip is a feasibility wall, not a minimiser-selection artifact, so edge-weighting is inert.
 *
 * FINDING 2 -- WINDOWED/TAPERED DESIGN SUPPRESSES THE TAIL-EDGE DIP ~2.3x AND MOVES IT OFF THE CUTOFF, BUT
 * DOES NOT REACH 0. The raised-cosine endpoint-damped design gives a final worst guarded residual -0.003383,
 * about 2.27x SMALLER (less negative) than the BASE control -0.007665, and the worst-violation location moves
 * OFF the cutoff edge: t=37.809 (BASE, ~T-2.2) -> t=30.754 (TAPER, ~T-9.2). So endpoint damping genuinely
 * suppresses the cutoff-EDGE oscillation that imp-97032 localised -- consistent with the dip being an edge
 * effect. But it walls at -0.003383, still < 0: no converged iterate. Crucially, the raised-cosine window
 * BREAKS the exact admissibility hhat = (t^2+1/4) ghat with g in L^2(-a,a), so even a converged tapered
 * residual would NOT certify Weil positivity -- TAPER is a diagnostic that localises the dip source, not a
 * certificate route.
 *
 * FINDING 3 -- AT 40 ROUNDS THE RESIDUAL FLOOR IS THE GUARD, NOT THE DESIGN F. In all three modes the
 * no-guard min pointwise design F reaches eps (>= 1.0) everywhere (BASE/TAPER 1.00000; EDGEW 1.00000005), and
 * the tail-band (t>=30) min F is >= 1.075 -- i.e. with 40 cutting-plane rounds the design F is lifted to eps
 * throughout, unlike imp-97032 (0.80-0.95 at ~14 rounds). The remaining deficit is therefore the between-grid
 * second-order GUARD, not the design F below eps: the binding has shifted. A finer FINEH shrinks the guard
 * (a partial 3e-5 sweep was run) but introduces cutting-plane non-monotonicity (the BASE 3e-5 worst residual
 * cycled -0.004 to -0.052 over rounds), and a full-stall 3e-5 confirmation is untested (sub-gap).
 *
 * VERDICT. Neither untried lever drives the kmax=5 guarded LP residual >= 0 at 2a=1.00. The edge-weighted
 * objective is inert (it cannot change feasibility; -0.008533, marginally worse than the -0.007665 control).
 * The windowed/tapered design DOES suppress the tail-edge dip -- ~2.3x smaller and relocated ~7 units off the
 * cutoff -- confirming imp-97032 that the dip is a cutoff-edge effect, but it walls at -0.003383 (< 0) and,
 * being inadmissible, cannot certify positivity even if it reached 0. No converged iterate was produced.
 * Certified reach stays exactly 2a<=0.96.
 *   SUB-GAP IMP97055_TAPER_INADMISSIBLE_NOT_A_CERTIFICATE -- the raised-cosine endpoint window breaks the
 *   exact Toeplitz admissibility hhat=(t^2+1/4)ghat, g in L^2(-a,a); its improved residual (-0.003383, dip
 *   moved off the cutoff) is a DIAGNOSTIC that the tail dip is an edge oscillation, not a positivity
 *   certificate. A genuinely admissible richer design (higher kmax within the exact form) remains the open
 *   lever named by imp-97032.
 *   SUB-GAP IMP97055_EDGEW_CANNOT_CHANGE_FEASIBILITY -- reweighting the L1 objective leaves the constraint
 *   polytope unchanged, so it only moves the minimiser among feasible c and cannot lift a negative guarded
 *   residual; measured -0.008533 (marginally worse than the -0.007665 control). Objective-only levers are
 *   ruled out for this dip.
 *   SUB-GAP IMP97055_RESIDUAL_FLOOR_GUARD_VS_DESIGNF_3E5_UNTESTED -- at FINEH=1e-4/40 rounds the design F
 *   reaches eps everywhere (no-guard min F = 1.0), so the residual deficit is the between-grid guard, which a
 *   finer FINEH shrinks; but the partial 3e-5 sweep is non-monotone (BASE worst cycled -0.004 to -0.052) and
 *   a full-stall 3e-5 confirmation of the guard-limited floor is untested.
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-97032-krein-tail-parametrisation-lever.js (parent: larger-T/denser-HP levers fail; dip structural; names richer-design lever)
 * @see imp-97013-krein-finer-fineh-3e5-convergence.js (FINEH=3e-5 exposes the design-F tail dip at ~14 rounds)
 * @see imp-96970-krein-kmax5-100-converged-solve-verify.js (FINEH=1e-4 baseline; residual cycles at -0.069, tail guard wall)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Solve configuration -- all three modes share this; only the DESIGN FAMILY / OBJECTIVE weight differs.
export const IMP97055_CONFIG = Object.freeze({
  solver: 'tmp/imp-97055-windowed-edgeweighted.py (lp13-form exact sigma_2 cutting-plane, KMAX=5)',
  twoA: 1.0, a: 0.5, eps: 1.0, X: 8.0, dx: 0.02, T: 40.0, FINEH: 1.0e-4, taperWidth: 5.0,
  rounds: 40, method: 'highs-ds',
  levers: Object.freeze({
    BASE: 'plain atoms, min-L1 objective (control)',
    EDGEW: 'plain atoms, edge-weighted objective min sum_j (1/(1+x_j))|c_j| (lever 2)',
    TAPER: 'raised-cosine endpoint-damped design over [T-5,T] with product-rule guard (lever 1)',
  }),
});

// MEASURED final-round results (40 rounds each); worst = worst fine-grid guarded residual, noGuardMinF = min
// pointwise design F with the between-grid guard removed (the imp-97032 binding metric).
export const IMP97055_RESULTS = Object.freeze({
  BASE: Object.freeze({
    converged: false, finalWorstResidual: -0.007665, finalWorstAt: 37.809, // dip at the cutoff edge (~T-2.2)
    noGuardMinF: 1.0, noGuardMinAt: 0.34, tailMinF: 1.08144, tailMinAt: 30.768, interiorMinF: 1.0, l1: 7.03,
  }),
  EDGEW: Object.freeze({
    converged: false, finalWorstResidual: -0.008533259116367486, finalWorstAt: 34.826, // marginally worse than BASE
    noGuardMinF: 1.0000000493003296, noGuardMinAt: 0.2629, tailMinF: 1.110175289446488, tailMinAt: 30.3346,
    interiorMinF: 1.0000000493003296, l1: 7.0901251650411155,
  }),
  TAPER: Object.freeze({
    converged: false, finalWorstResidual: -0.003383, finalWorstAt: 30.754, // dip moved ~7 units OFF the cutoff
    noGuardMinF: 1.0, noGuardMinAt: 0.612, tailMinF: 1.07544, tailMinAt: 30.754, interiorMinF: 1.0, l1: 7.027,
  }),
});

export const IMP97055_VERDICT = Object.freeze({
  ticket: 'imp-97055',
  question: 'does a windowed/tapered (endpoint-damped) design F or an edge-weighted objective remove the structural tail-edge F-dip in the kmax=5 Route I Krein guarded LP at 2a=1.00 (imp-97032 richer-design lever) ?',
  twoA: 1.0,
  // Lever 2 (edge-weighted objective): inert -- cannot change feasibility
  edgeWeightedConverges: false,
  edgeWeightedFinalWorst: -0.008533259116367486,
  edgeWeightedWorseThanBaseline: true, // -0.008533 vs baseline -0.007665
  edgeWeightedCannotChangeFeasibility: true,
  // Lever 1 (windowed/tapered design): suppresses the tail-edge dip but walls < 0 and is inadmissible
  taperConverges: false,
  taperFinalWorst: -0.003383,
  baselineFinalWorst: -0.007665,
  taperSuppressesEdgeDip: true, // ~2.27x smaller residual
  taperResidualRatioVsBaseline: -0.003383 / -0.007665, // ~0.441 (less negative)
  taperDipMovesOffCutoff: true, // worst-violation location 37.809 (BASE) -> 30.754 (TAPER)
  taperBreaksAdmissibility: true, // raised-cosine window breaks hhat=(t^2+1/4)ghat, g in L^2(-a,a)
  taperIsDiagnosticNotCertificate: true,
  // Shared: at 40 rounds the design F reaches eps; the residual floor is the guard, not the design F
  designFReachesEpsAt40Rounds: true, // no-guard min F = 1.0 in all modes
  residualFloorIsGuardNotDesignF: true,
  // Conclusion
  producedConvergedIterate: false,
  frontierExtendsCertifiedReach: false,
  intervalRigorousReachUnchanged: 0.96,
  subGapTaperInadmissible: 'IMP97055_TAPER_INADMISSIBLE_NOT_A_CERTIFICATE -- the raised-cosine endpoint window breaks the exact Toeplitz admissibility hhat=(t^2+1/4)ghat, g in L^2(-a,a); its improved residual (-0.003383, dip moved off the cutoff) is a diagnostic that the tail dip is an edge oscillation, not a positivity certificate. An admissible richer design (higher kmax within the exact form) remains the open lever named by imp-97032.',
  subGapEdgeWeightInert: 'IMP97055_EDGEW_CANNOT_CHANGE_FEASIBILITY -- reweighting the L1 objective leaves the constraint polytope unchanged, so it only moves the minimiser among feasible c and cannot lift a negative guarded residual (measured -0.008533, marginally worse than the -0.007665 control); objective-only levers are ruled out for this dip.',
  subGapGuardFloor3e5: 'IMP97055_RESIDUAL_FLOOR_GUARD_VS_DESIGNF_3E5_UNTESTED -- at FINEH=1e-4/40 rounds the design F reaches eps everywhere (no-guard min F = 1.0), so the residual deficit is the between-grid guard, which a finer FINEH shrinks; but the partial 3e-5 sweep is non-monotone (BASE worst cycled -0.004 to -0.052) and a full-stall 3e-5 confirmation is untested.',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97055_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97055_ASSERTIONS = [
  {
    id: 'imp97055-edge-weighted-objective-inert-cannot-change-feasibility',
    holds: () =>
      IMP97055_RESULTS.EDGEW.converged === false &&
      IMP97055_RESULTS.EDGEW.finalWorstResidual < 0 &&
      // edge-weighted is marginally WORSE than the plain-L1 control -> objective reweighting does not help
      IMP97055_RESULTS.EDGEW.finalWorstResidual < IMP97055_RESULTS.BASE.finalWorstResidual &&
      IMP97055_VERDICT.edgeWeightedCannotChangeFeasibility === true &&
      IMP97055_VERDICT.edgeWeightedWorseThanBaseline === true,
    why: 'the edge-weighted L1 objective gives worst guarded residual -0.008533 (t=34.826), marginally worse than the plain-L1 control -0.007665 -- reweighting the objective leaves the feasible polytope unchanged and cannot lift a negative residual; the dip is a feasibility wall, not a minimiser-selection artifact.',
  },
  {
    id: 'imp97055-taper-suppresses-edge-dip-but-walls-below-zero',
    holds: () =>
      IMP97055_RESULTS.TAPER.converged === false &&
      IMP97055_RESULTS.TAPER.finalWorstResidual < 0 &&
      // taper residual is ~2.3x SMALLER (less negative) than the control
      IMP97055_RESULTS.TAPER.finalWorstResidual > IMP97055_RESULTS.BASE.finalWorstResidual &&
      IMP97055_RESULTS.TAPER.finalWorstResidual / IMP97055_RESULTS.BASE.finalWorstResidual < 0.5 &&
      // worst-violation location moves OFF the cutoff edge (T=40): BASE ~37.8 -> TAPER ~30.75
      IMP97055_RESULTS.BASE.finalWorstAt > 37 &&
      IMP97055_RESULTS.TAPER.finalWorstAt < 32 &&
      IMP97055_VERDICT.taperSuppressesEdgeDip === true &&
      IMP97055_VERDICT.taperDipMovesOffCutoff === true,
    why: 'the raised-cosine endpoint-damped design gives worst guarded residual -0.003383, ~2.27x smaller than the -0.007665 control, and moves the worst-violation location off the cutoff edge (37.809 -> 30.754) -- it suppresses the tail-edge oscillation, but still walls below 0 (no converged iterate).',
  },
  {
    id: 'imp97055-taper-inadmissible-diagnostic-not-certificate',
    holds: () =>
      IMP97055_VERDICT.taperBreaksAdmissibility === true &&
      IMP97055_VERDICT.taperIsDiagnosticNotCertificate === true &&
      IMP97055_VERDICT.subGapTaperInadmissible.includes('IMP97055_TAPER_INADMISSIBLE_NOT_A_CERTIFICATE') &&
      IMP97055_VERDICT.subGapTaperInadmissible.includes('hhat=(t^2+1/4)ghat'),
    why: 'the raised-cosine window breaks the exact admissibility hhat=(t^2+1/4)ghat, g in L^2(-a,a), so even a converged tapered residual would not certify Weil positivity; the taper is a diagnostic that localises the dip as a cutoff-edge effect, not a certificate route.',
  },
  {
    id: 'imp97055-design-F-reaches-eps-residual-floor-is-guard',
    holds: () =>
      // at 40 rounds the no-guard design F reaches eps (>= 1.0) in every mode -> binding shifted to the guard
      IMP97055_RESULTS.BASE.noGuardMinF >= 1.0 &&
      IMP97055_RESULTS.TAPER.noGuardMinF >= 1.0 &&
      IMP97055_RESULTS.EDGEW.noGuardMinF >= 1.0 &&
      IMP97055_RESULTS.BASE.tailMinF > 1.0 &&
      IMP97055_RESULTS.TAPER.tailMinF > 1.0 &&
      IMP97055_VERDICT.designFReachesEpsAt40Rounds === true &&
      IMP97055_VERDICT.residualFloorIsGuardNotDesignF === true,
    why: 'with 40 cutting-plane rounds the no-guard min pointwise design F reaches eps (>= 1.0) everywhere in all three modes (tail-band min F >= 1.075), unlike imp-97032 at ~14 rounds (0.80-0.95); the remaining residual deficit is the between-grid second-order guard, not the design F below eps.',
  },
  {
    id: 'imp97055-no-converged-iterate-reach-unchanged-no-qed',
    holds: () =>
      IMP97055_VERDICT.producedConvergedIterate === false &&
      IMP97055_RESULTS.BASE.converged === false &&
      IMP97055_RESULTS.EDGEW.converged === false &&
      IMP97055_RESULTS.TAPER.converged === false &&
      IMP97055_VERDICT.frontierExtendsCertifiedReach === false &&
      IMP97055_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97055_VERDICT.subGapEdgeWeightInert.includes('IMP97055_EDGEW_CANNOT_CHANGE_FEASIBILITY') &&
      IMP97055_VERDICT.subGapGuardFloor3e5.includes('IMP97055_RESIDUAL_FLOOR_GUARD_VS_DESIGNF_3E5_UNTESTED') &&
      IMP97055_VERDICT.operatorPositivityProved === false &&
      IMP97055_VERDICT.rhResolved === false &&
      IMP97055_VERDICT.qed === false,
    why: 'neither the edge-weighted objective nor the windowed/tapered design produced a converged kmax=5 iterate at 2a=1.00; the certified reach stays 2a<=0.96, all three sub-gaps are named, and NO QED.',
  },
];

for (const a of IMP97055_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97055 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
