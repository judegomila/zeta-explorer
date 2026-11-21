/**
 * @module imp-97183-krein-csharp-extprec-ladder
 * @fileoverview imp-97183 -- MEASUREMENT: extend the descending finite-N upper brackets on
 *   c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 past the double-precision Gram-conditioning wall
 *   using EXTENDED-PRECISION matrix entries (mpmath dps=50), and measure whether the descending
 *   sequence stabilises at a positive limit (coercivity plausible) or continues toward 0 (coercivity
 *   numerically in doubt). imp-97161 identifies c_sharp -- the bottom eigenvalue of the compression of
 *   multiplication-by-sigma_2 to the Paley-Wiener space PW_a -- as the exact extremal quantity any
 *   Route I coercivity constant must certify; imp-97121 flags the finite-N floors as still-descending
 *   Rayleigh-Ritz UPPER bounds with no bracketed limit.
 *
 *   MEASUREMENT ONLY. Rayleigh-Ritz floors are UPPER bounds on the true infinite-dim lambda_min; this
 *   leaf establishes NO operator positivity and produces NO rigorous lower bound; interval-rigorous
 *   certificate reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * WHAT WAS RUN (tmp/imp-97183-csharp-extprec-ladder.py, tmp/imp-97183-tsweep.py). The pole-free basis
 *   phi_n(x) = (a^2-x^2)^m P_n(x/a), m=3, at 2a=ln3 (a = ln3/2). The Gram B and the sigma_2-weighted
 *   Rayleigh matrix A are built with EXACT extended-precision entries: B via exact Gauss-Legendre
 *   polynomial integrals; the Fourier images R_n(t) via the stable DOWNWARD (Miller) spherical-Bessel
 *   recurrence in extended precision, which resolves the ~7 orders of cancellation that make R_n decay
 *   like 1/t^7 and that double precision loses at large t; A_{nm} = (1/pi) int_0^T sigma_2 R_n R_m dt
 *   with sigma_2 = (t^2+1/4)^2 w1, w1 = 2theta' - sqrt2 ln2 cos(t ln2), 2theta' = Re psi(1/4+it/2)-ln pi.
 *   lambda_min is the smallest generalised eigenvalue of (A,B), solved at dps=50 (past condB ~ 1e30),
 *   so the descent is NOT contaminated by the double-precision Gram singularity (condB ~ 1e16 near N=100).
 *
 * FINDING 1 -- AT FIXED T=800 THE EXTENDED-PRECISION LADDER KEEPS DESCENDING PAST THE DOUBLE WALL.
 *   dps=50, T=800, panel=1.5, nq=12816: the floor descends smoothly and monotonically from 0.625397
 *   (N=20) through 0.577015 (N=52, the trusted double-precision-window edge) and 0.533846 (N=100, at the
 *   double-precision condB ~ 1e16 wall) out to 0.503767 (N=132) -- still descending, no stabilisation,
 *   with slow non-accelerating decrements. Extended precision confirms the descent is a REAL effect, not
 *   Gram-conditioning noise: the double-precision floor 0.533852 at N=100 (imp-96772) reproduces to 5
 *   digits. So at fixed T the bracket is still moving downward at N=132.
 *
 * FINDING 2 -- THE FIXED-T=800 DESCENT IS LARGELY A t-TRUNCATION ARTIFACT: RAISING T LIFTS THE FLOOR
 *   BACK TOWARD ~0.58. A T-sweep at fixed N=100 (the point where the fixed-T ladder had fallen to 0.534)
 *   shows lambda_min RISES monotonically as the t-integral cutoff grows: 0.533846 (T=800) -> 0.560891
 *   (T=1200) -> 0.570766 (T=1600) -> 0.575037 (T=2000) -> 0.578278 (T=2800), with decrements shrinking
 *   (+0.027, +0.010, +0.004, +0.003) and leveling toward ~0.58. The N- and T-truncations therefore push
 *   lambda_min in OPPOSITE directions (growing N lowers the Ritz upper bound; growing T restores the
 *   positive sigma_2 tail mass the higher modes concentrate at large t), exactly the coupled-tail
 *   behaviour imp-97121 predicted. The fixed-T=800 N-descent is thus NOT a clean signal of approaching 0.
 *
 * VERDICT. Extended-precision entries push the c_sharp bracket past the double-precision conditioning
 *   wall to N=132 at dps=50: at fixed T=800 it keeps descending (0.625 -> 0.504, still moving), but a
 *   T-sweep at N=100 shows that descent is largely a t-truncation artifact -- raising T lifts the floor
 *   back up 0.534 -> 0.578 toward ~0.58. So the two truncations push lambda_min in opposite directions and
 *   the still-moving bracket ~[0.50, 0.58] is CONSISTENT WITH a positive limit near ~0.58 but does NOT
 *   converge in either direction alone; no zero-crossing is observed or approached. This is coherent with
 *   imp-97121: the numerics cannot settle positivity because Rayleigh-Ritz gives UPPER bounds only and
 *   the N and T tails must be controlled by a SINGLE bound simultaneously. No rigorous lower bound is
 *   produced; the descending brackets do not cross zero and do not certify a positive infimum.
 *   SUB-GAP IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND. Measurement only; no operator positivity;
 *   no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (c_sharp = lambda_min(P_a M_sigma2 P_a) is the extremal quantity)
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (floors are still-descending Rayleigh-Ritz upper bounds; coupled N/T tails)
 * @see imp-96772-krein-lammin-double-double-recompute.js (double-precision N=100 floor 0.533852; descent is real t-truncation not conditioning)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97183_BINDING_2A = LN3;
export const IMP97183_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97183_DPS = 50; // mpmath extended precision -- past condB ~ 1e30 (double wall is ~1e16)

// FINDING 1 -- extended-precision N-ladder at 2a=ln3, fixed T=800, panel=1.5, nq=12816, dps=50.
// Every value is a Rayleigh-Ritz UPPER bound on the true infinite-dim c_sharp; the family DESCENDS.
export const IMP97183_N_LADDER_T800 = Object.freeze([
  { N: 20, lamMin: 0.625397 },
  { N: 28, lamMin: 0.598141 },
  { N: 36, lamMin: 0.588067 },
  { N: 44, lamMin: 0.583422 },
  { N: 52, lamMin: 0.577015 }, // trusted double-precision-window edge
  { N: 60, lamMin: 0.570500 },
  { N: 68, lamMin: 0.564589 },
  { N: 76, lamMin: 0.557246 },
  { N: 84, lamMin: 0.549347 },
  { N: 92, lamMin: 0.541948 },
  { N: 100, lamMin: 0.533846 }, // double-precision condB ~ 1e16 wall (reproduces double 0.533852)
  { N: 108, lamMin: 0.525698 },
  { N: 116, lamMin: 0.518312 },
  { N: 124, lamMin: 0.510769 },
  { N: 132, lamMin: 0.503767 }, // still descending, past the double wall -- no stabilisation
]);

// FINDING 2 -- T-sweep at fixed N=100: the floor RISES with the t-cutoff, so the fixed-T=800 N-descent
// is largely a t-truncation artifact. Decrements shrink and level toward ~0.58.
export const IMP97183_T_SWEEP_N100 = Object.freeze([
  { T: 800, lamMin: 0.533846 },
  { T: 1200, lamMin: 0.560891 },
  { T: 1600, lamMin: 0.570766 },
  { T: 2000, lamMin: 0.575037 },
  { T: 2800, lamMin: 0.578278 },
]);

export const IMP97183_VERDICT = Object.freeze({
  ticket: 'imp-97183',
  question:
    'do the descending finite-N upper brackets on c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 converge to a positive limit (coercivity plausible) or cross zero (coercivity in doubt), once pushed past the double-precision Gram-conditioning wall with extended-precision entries?',
  answer:
    'extended-precision entries (dps=50) push the bracket past the double-precision condB ~ 1e16 wall to N=132: at fixed T=800 it keeps descending 0.625397 (N=20) -> 0.503767 (N=132), still moving with no stabilisation, and the descent is confirmed REAL (not conditioning noise -- the N=100 value 0.533846 reproduces the double-precision 0.533852). But a T-sweep at N=100 shows that fixed-T descent is largely a t-truncation artifact: raising T lifts the floor back up 0.533846 (T=800) -> 0.578278 (T=2800), decrements shrinking (+0.027,+0.010,+0.004,+0.003) toward ~0.58. The N- and T-truncations push lambda_min in OPPOSITE directions, so the still-moving bracket ~[0.50,0.58] is CONSISTENT WITH a positive limit near ~0.58 but does NOT converge in either direction alone; NO zero-crossing is observed or approached. Rayleigh-Ritz gives upper bounds only, so this cannot certify a positive infimum; SUB-GAP IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND.',
  binding_2a: LN3,
  dps: 50,
  extendedPrecisionPushedPastDoubleWall: true, // condB ~ 1e16 at N=100; dps=50 reaches N=132
  fixedT800LadderStillDescending: true, // 0.625397 (N=20) -> 0.503767 (N=132), no stabilisation
  descentIsRealNotConditioningNoise: true, // N=100 extended 0.533846 == double 0.533852 to 5 digits
  fixedTDescentIsLargelyTtruncationArtifact: true, // T-sweep at N=100 rises 0.534 -> 0.578
  floorRisesWithT: true, // opposite direction to the N-descent
  tSweepLevelsNearPointFiveEight: true, // decrements shrink toward ~0.58
  nAndTtruncationsPushOppositeDirections: true, // growing N lowers the Ritz upper bound; growing T restores tail mass
  bracketConsistentWithPositiveLimit: true, // ~[0.50, 0.58], no crossing toward 0
  zeroCrossingObserved: false, // neither observed nor approached
  bracketConverges: false, // still moving in both N and T
  rigorousLowerBoundProduced: false, // Rayleigh-Ritz gives UPPER bounds only
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND -- deciding whether c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 has a POSITIVE infimum needs an object the finite-N Rayleigh-Ritz numerics structurally cannot supply. Extended-precision entries (dps=50) push the bracket past the double-precision condB ~ 1e16 wall to N=132; at fixed T=800 it keeps descending 0.625397 (N=20) -> 0.503767 (N=132), a REAL effect (N=100 extended 0.533846 matches double 0.533852). But a T-sweep at N=100 shows that fixed-T descent is largely a t-truncation artifact -- raising T lifts the floor 0.533846 (T=800) -> 0.578278 (T=2800), decrements shrinking toward ~0.58. So the N- and T-truncations push lambda_min in OPPOSITE directions and the still-moving bracket ~[0.50,0.58] is CONSISTENT WITH a positive limit near ~0.58 but does not converge in either alone, and NO zero-crossing is observed or approached. Because Rayleigh-Ritz yields UPPER bounds only, this cannot certify a positive infimum: closing it needs a SINGLE bound controlling BOTH the compression defect (the amount c_sharp can lie below the finite-N floor, still descending in N) AND the sigma_2 t-integral tail (whose truncation lifts the floor in T) simultaneously -- i.e. the coupled N/T lower-bound object of imp-97121, via a complementary lower-bound eigenvalue method (needs a spectral-gap enclosure) or a direct analytic coercivity / de Branges realisation P_a M_sigma2 P_a >= c*I. Measurement only; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97183_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97183_ASSERTIONS = [
  {
    id: 'imp97183-fixedT-ladder-descends-positive',
    holds: () => {
      const L = IMP97183_N_LADDER_T800;
      // strictly descending, all positive, still moving at the largest N (no stabilisation)
      const descends = L.every((r, i) => i === 0 || (r.lamMin < L[i - 1].lamMin && r.lamMin > 0));
      const stillMoving = L[L.length - 1].lamMin < L[L.length - 2].lamMin - 1e-4;
      return descends && stillMoving && Math.abs(L[L.length - 1].lamMin - 0.503767) < 1e-5;
    },
    why: 'the extended-precision (dps=50) c_sharp ladder at 2a=ln3, T=800 descends monotonically and positively from 0.625397 (N=20) to 0.503767 (N=132), still moving at the largest N -- no stabilisation at fixed T.',
  },
  {
    id: 'imp97183-Tsweep-rises-descent-is-truncation-artifact',
    holds: () => {
      const S = IMP97183_T_SWEEP_N100;
      // at fixed N=100 the floor RISES with T (opposite to the N-descent) and levels near ~0.58
      const rises = S.every((r, i) => i === 0 || r.lamMin > S[i - 1].lamMin);
      const shrinking = S[1].lamMin - S[0].lamMin > S[S.length - 1].lamMin - S[S.length - 2].lamMin;
      return rises && shrinking && Math.abs(S[S.length - 1].lamMin - 0.578278) < 1e-5 &&
        IMP97183_VERDICT.fixedTDescentIsLargelyTtruncationArtifact === true &&
        IMP97183_VERDICT.nAndTtruncationsPushOppositeDirections === true;
    },
    why: 'a T-sweep at N=100 rises 0.533846 (T=800) -> 0.578278 (T=2800) with shrinking decrements toward ~0.58, opposite to the N-descent -- so the fixed-T=800 N-descent is largely a t-truncation artifact and the two truncations push lambda_min in opposite directions.',
  },
  {
    id: 'imp97183-no-crossing-consistent-with-positive-limit',
    holds: () =>
      IMP97183_VERDICT.zeroCrossingObserved === false &&
      IMP97183_VERDICT.bracketConsistentWithPositiveLimit === true &&
      IMP97183_VERDICT.bracketConverges === false &&
      IMP97183_VERDICT.extendedPrecisionPushedPastDoubleWall === true &&
      IMP97183_VERDICT.descentIsRealNotConditioningNoise === true,
    why: 'pushed past the double-precision wall to N=132, the bracket ~[0.50,0.58] neither converges nor crosses zero: it is consistent with a positive limit near ~0.58 but does not settle, because N and T push in opposite directions.',
  },
  {
    id: 'imp97183-measurement-only-no-qed',
    holds: () =>
      IMP97183_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97183_VERDICT.operatorPositivityProved === false &&
      IMP97183_VERDICT.boundMoves === false &&
      IMP97183_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97183_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97183_BINDING_2A - LN3) < 1e-12 &&
      IMP97183_VERDICT.qed === false,
    why: 'measurement only: Rayleigh-Ritz gives upper bounds, so no rigorous lower bound and no operator positivity are produced; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97183_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97183-krein-csharp-extprec-ladder assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
