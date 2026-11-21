/**
 * @fileoverview imp-96868 -- MEASUREMENT: test whether EXTENDED (multi-word) precision moves the
 * kmax = 5 Route I Krein certified-margin frontier 2a* past the 1.08 double-precision wall toward ln 3.
 *
 * CONTEXT. imp-96845 measured the fresh kmax = 5 double-precision cutting-plane LP (lean config
 * X = 8, dx = 0.02, T = 40, HP = 0.2, FINEH = 3e-4, VIOLTOL = 0.4) as solvable and small-l1 out to
 * 2a = 1.06, then HiGHS status-4 walled at 2a = 1.08, and concluded "degree AND extended precision are
 * needed JOINTLY" to reach ln 3 = 1.0986 -- flagging extended precision as the indicated next lever but
 * NOT testing it (SUB-GAP IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED). This ticket probes that lever.
 *
 * METHOD (fresh diagnostics, NOT interval-rigorous, NOT a full multi-word LP re-solve). Three genuine
 * measurements on the identical lean kmax = 5 LP (tmp/toeplitz-krein-lp13.py):
 *   A. WALL PIN. Re-ran the frontier band 2a in {1.06, 1.07, 1.08, 1.09, ln 3} under BOTH HiGHS
 *      dual-simplex (highs-ds) and interior-point (highs-ipm), rounds <= 20, capturing the round-0
 *      HiGHS status code at each wall point.
 *   B. EXTENDED-PRECISION EVALUATION. Re-evaluated the last-solvable (2a = 1.06) double-precision
 *      iterate at 50-decimal-digit mpmath precision -- sigma_2 via mpmath digamma -- to decide whether
 *      the binding worst design-condition residual (the thing keeping every kmax = 5 point NOT
 *      converged) is a double-precision ROUNDOFF artifact (removable by extended precision) or GENUINE.
 *   C. CONDITIONING. Computed the round-0 scaled constraint-matrix singular-value conditioning at
 *      2a = 1.06 (solvable) vs 2a = 1.07 (walls) to characterize the status-4 breakdown.
 *
 * FINDINGS (measured, verbatim from tmp/imp-96868/).
 *   1. WALL ONSET TIGHTENED AND METHOD-INDEPENDENT. Both highs-ds and highs-ipm solve 2a = 1.06
 *      (l1 = 7.7486, near-feasible) and both HiGHS status-4 (numerical, NOT status-2 infeasible) wall at
 *      2a = 1.07, 1.08, 1.09 and ln 3. So the double-precision kmax = 5 frontier band tightens from
 *      imp-96845 (1.06, 1.08) to (1.06, 1.07), and the wall is not a solver-method artifact.
 *   2. THE BINDING RESIDUAL IS PRECISION-INVARIANT. At the last-solvable point 2a = 1.06 the binding
 *      worst design-condition residual sits at t* = 37.878 (near the T = 40 tail). Double precision
 *      gives -0.22168370; 50-digit mpmath gives -0.22168366; they agree to 3.85e-8. So the residual is
 *      NOT a roundoff artifact -- extended precision of the arithmetic does NOT move it. Moreover the
 *      raw F - eps floor there is +5.200 (F itself comfortably positive); the -0.22 is entirely the
 *      coarse-grid SECOND-ORDER GUARD (safety) deficit near the tail, not an F < eps infeasibility.
 *   3. THE ROUND-0 MATRIX IS ALREADY CATASTROPHICALLY ILL-CONDITIONED AT BOTH POINTS, FLAT ACROSS
 *      THE ONSET. cond(A_scaled) = 2.13e20 at 2a = 1.06 (which solves) and 7.52e19 at 2a = 1.07 (which
 *      walls), both far past the double-precision limit ~1e16, with identical numerical rank 121/801.
 *      So the status-4 breakdown IS a genuine double-precision conditioning regime (extended precision
 *      is the right lever for the SOLVER), but the wall ONSET (why 1.06 works and 1.07 fails) is NOT a
 *      conditioning cliff -- conditioning is essentially flat across it.
 *
 * VERDICT. Extended-precision ARITHMETIC is necessary to keep the LP factorization alive in the
 * ~1e20-conditioning regime past 1.07, but it is NOT sufficient to reach a converged certificate: the
 * binding convergence barrier at the frontier is a precision-invariant coarse-grid guard deficit near
 * the tail (Finding 2), so the guard resolution (FINEH / tail handling) and certificate DEGREE remain
 * co-binding levers. This REFINES imp-96845 "degree AND extended precision jointly": at the binding
 * point precision is NOT the mover of the residual -- it only unlocks the solver.
 *
 * HONEST CAVEAT / SUB-GAP. A genuine full MULTI-WORD-PRECISION LP RE-SOLVE was NOT performed: the
 * environment has no extended-precision LP solver (scipy HiGHS is double-only; no cvxpy / exact-rational
 * simplex). So the direct number "how far 2a* moves in extended precision" is NOT measured here; what IS
 * established is that the binding residual at the frontier is precision-invariant, making a large
 * extended-precision move of the CONVERGED frontier unlikely at fixed guard resolution.
 *   SUB-GAP IMP96868_MULTIWORD_LP_RESOLVE_UNAVAILABLE -- a genuine extended-precision LP solve (mpf /
 *   exact-rational simplex over the ~4.2e3-variable kmax = 5 program) is needed to directly measure the
 *   solver frontier past 1.07; the double-precision status-4 wall confirms the ~1e20 conditioning regime
 *   but cannot itself yield the extended-precision 2a* number.
 *
 * Measurement only; interval-rigorous certified reach stays exactly 2a <= 0.96 (no verified certificate
 * produced past it); the operator floor is a Rayleigh UPPER bound (no operator positivity established);
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96845-krein-kmax5-frontier-measurement.js (parent: double-precision band (1.06,1.08); SUB-GAP IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED flagged extended precision as next lever)
 * @see imp-96732-krein-extended-precision-reach-assessment.js (grandparent: degree + precision refinement labelled 2a >= 1.0 intrinsic)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source: baked kmax=4 certificate, epsMarginDecay)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// lean double-precision cutting-plane config (identical to imp-96845 IMP96845_SOLVE_CONFIG)
export const IMP96868_SOLVE_CONFIG = Object.freeze({
  solver: 'tmp/toeplitz-krein-lp13.py (exact sigma_2 cutting-plane), KMAX=5',
  X: 8.0,
  dx: 0.02,
  T: 40.0,
  HP: 0.2,
  FINEH: 3e-4,
  roundsCap: 20,
  violTol: 0.4,
  extPrecEval: 'mpmath dps=50 (sigma_2 via mpmath digamma) on the 2a=1.06 double-precision iterate',
  note: 'LEAN config -- absolute wall numbers are config-dependent; robust signals are the method-independent wall onset, the precision-invariance of the binding residual, and the round-0 conditioning',
});

// MEASURED wall band (tmp/imp-96868/expA-results.json + round-0 status probe). Both methods.
// status: solved = LP feasible each round (bounded l1, near-feasible iterate); walled = HiGHS status 4.
export const IMP96868_WALL = Object.freeze([
  { twoA: 1.06, meth: 'highs-ds', status: 'solved', highsStatus: 0, l1: 7.748635770708253, worstViol: -0.22168369850443792 },
  { twoA: 1.07, meth: 'highs-ds', status: 'walled', highsStatus: 4, l1: null, worstViol: null },
  { twoA: 1.08, meth: 'highs-ds', status: 'walled', highsStatus: 4, l1: null, worstViol: null },
  { twoA: 1.06, meth: 'highs-ipm', status: 'solved', highsStatus: 0, l1: 7.748638333099963, worstViol: -0.23214733460131542 },
  { twoA: 1.07, meth: 'highs-ipm', status: 'walled', highsStatus: 4, l1: null, worstViol: null },
  { twoA: 1.08, meth: 'highs-ipm', status: 'walled', highsStatus: 4, l1: null, worstViol: null },
]);

// MEASURED extended-precision evaluation of the 2a=1.06 double-precision iterate (tmp/imp-96868/expB-1.06.json)
export const IMP96868_EXTPREC_EVAL = Object.freeze({
  twoA: 1.06,
  dps: 50,
  worstViolLocation: 37.878, // t* near the T=40 tail
  dpWorstViol: -0.22168369710745495, // double precision, fine grid
  mpWorstViol: -0.2216836585680741, // 50-digit mpmath
  dpMpDiffAtTstar: 3.8539380856313815e-8, // double vs 50-digit agree to ~4e-8
  mpFepsFloorAtTstar: 5.200286256504566, // F - eps itself is POSITIVE there; the -0.22 is the guard deficit
  dpMinF: 1.000000210809269, // raw F floor reaches the design margin eps=1
});

// MEASURED round-0 scaled constraint-matrix conditioning (tmp/imp-96868-cond.py)
export const IMP96868_CONDITIONING = Object.freeze([
  { twoA: 1.06, cond: 2.133e20, smin: 2.282e-16, numRank: 121, rows: 801 },
  { twoA: 1.07, cond: 7.522e19, smin: 6.458e-16, numRank: 121, rows: 801 },
]);

const dpAbsResidual = Math.abs(IMP96868_EXTPREC_EVAL.dpMpDiffAtTstar);
const residualMagnitude = Math.abs(IMP96868_EXTPREC_EVAL.dpWorstViol);

export const IMP96868_VERDICT = Object.freeze({
  ticket: 'imp-96868',
  question:
    'does extended (multi-word) precision move the kmax=5 certified-margin frontier 2a* past the 1.08 double-precision wall toward ln3?',
  answer:
    'the binding worst design-condition residual at the last-solvable point 2a=1.06 is PRECISION-INVARIANT (double vs 50-digit mpmath agree to 3.85e-8) and is a coarse-grid GUARD deficit near the T=40 tail (F-eps itself is +5.2 there), so extended-precision arithmetic does NOT move that residual; the status-4 wall reflects a genuine ~1e20-conditioning regime (extended precision is the right lever for the SOLVER) but the wall onset 1.06->1.07 is not a conditioning cliff (cond flat, rank 121/801 at both). A full multi-word LP re-solve was not available, so the direct extended-precision 2a* number is NOT measured (SUB-GAP).',
  wallOnsetLower: 1.06, // last solvable (both methods)
  wallOnsetUpper: 1.07, // first walled (both methods) -- tightens imp-96845 band from 1.08 to 1.07
  wallIsStatus4Numerical: true,
  wallMethodIndependent: true, // highs-ds and highs-ipm agree
  bindingResidualPrecisionInvariant: dpAbsResidual < 1e-6, // 3.85e-8 << residual magnitude 0.22
  bindingResidualMagnitude: residualMagnitude, // 0.2217
  bindingResidualIsGuardNotInfeasibility: IMP96868_EXTPREC_EVAL.mpFepsFloorAtTstar > 0, // F-eps = +5.2 > 0
  conditioningRegime: 'catastrophic (~1e20, past double-precision limit 1e16) at BOTH 1.06 and 1.07, flat across onset',
  refinesImp96845:
    'refines "degree AND extended precision jointly": at the binding point precision is NOT the mover of the residual -- extended precision only unlocks the LP factorization in the ~1e20 conditioning regime; the convergence barrier is a precision-invariant guard deficit, so guard resolution (FINEH/tail) and degree remain co-binding',
  subGap:
    'IMP96868_MULTIWORD_LP_RESOLVE_UNAVAILABLE -- no extended-precision LP solver in the environment (scipy HiGHS double-only, no cvxpy/exact-rational simplex); the direct extended-precision 2a* number past 1.07 is NOT measured, only that the binding residual at the frontier is precision-invariant',
  ln3: LN3,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96868_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96868_ASSERTIONS = [
  {
    id: 'imp96868-wall-onset-method-independent',
    holds: () => {
      const ds06 = IMP96868_WALL.find((r) => r.twoA === 1.06 && r.meth === 'highs-ds');
      const ipm06 = IMP96868_WALL.find((r) => r.twoA === 1.06 && r.meth === 'highs-ipm');
      const ds07 = IMP96868_WALL.find((r) => r.twoA === 1.07 && r.meth === 'highs-ds');
      const ipm07 = IMP96868_WALL.find((r) => r.twoA === 1.07 && r.meth === 'highs-ipm');
      return ds06.status === 'solved' && ipm06.status === 'solved' && ds07.status === 'walled' && ipm07.status === 'walled';
    },
    why: 'both HiGHS dual-simplex and interior-point solve 2a=1.06 and wall at 2a=1.07 -- the frontier onset is method-independent, tightening the imp-96845 band to (1.06,1.07).',
  },
  {
    id: 'imp96868-wall-is-status4-numerical',
    holds: () => IMP96868_WALL.filter((r) => r.status === 'walled').every((r) => r.highsStatus === 4),
    why: 'every walled point is HiGHS status 4 (numerical), not status 2 (infeasible) -- the wall is a double-precision solver breakdown, not a proven infeasibility.',
  },
  {
    id: 'imp96868-binding-residual-precision-invariant',
    holds: () =>
      dpAbsResidual < 1e-6 &&
      dpAbsResidual < residualMagnitude * 1e-3 &&
      IMP96868_VERDICT.bindingResidualPrecisionInvariant === true,
    why: 'double precision and 50-digit mpmath agree on the binding worst residual to 3.85e-8, six orders below the residual magnitude 0.22 -- extended-precision arithmetic does NOT move it, so it is genuine, not roundoff.',
  },
  {
    id: 'imp96868-binding-residual-is-guard-not-infeasibility',
    holds: () => IMP96868_EXTPREC_EVAL.mpFepsFloorAtTstar > 0 && IMP96868_EXTPREC_EVAL.dpMinF > 0,
    why: 'the extended-precision F-eps floor at t* is +5.2 (and raw minF reaches eps) -- the -0.22 binding residual is the coarse-grid second-order GUARD deficit near the tail, not an F<eps infeasibility.',
  },
  {
    id: 'imp96868-conditioning-catastrophic-and-flat',
    holds: () => {
      const c06 = IMP96868_CONDITIONING.find((r) => r.twoA === 1.06);
      const c07 = IMP96868_CONDITIONING.find((r) => r.twoA === 1.07);
      return c06.cond > 1e16 && c07.cond > 1e16 && c06.numRank === c07.numRank;
    },
    why: 'both round-0 matrices are ill-conditioned past the 1e16 double-precision limit (~1e20) with identical numerical rank 121/801 -- the status-4 regime is genuine but the onset is not a conditioning cliff.',
  },
  {
    id: 'imp96868-measurement-only-reach-and-qed-unchanged',
    holds: () =>
      IMP96868_VERDICT.qed === false &&
      IMP96868_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      typeof IMP96868_VERDICT.subGap === 'string' &&
      IMP96868_VERDICT.subGap.includes('IMP96868_MULTIWORD_LP_RESOLVE_UNAVAILABLE'),
    why: 'this is measurement only: no full multi-word LP re-solve was available (named sub-gap), no QED, interval-rigorous reach stays 2a<=0.96.',
  },
];

for (const a of IMP96868_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96868-krein-kmax5-extprec-frontier assertion failed: ${a.id}`);
  }
}
