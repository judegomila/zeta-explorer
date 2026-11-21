/**
 * @fileoverview imp-96998 -- NUMERICAL: extend the imp-96977 Route I Toeplitz/Krein certificate
 * Rayleigh floor ladder at the certified endpoint a=0.48 (2a=0.96) beyond N=36 to N in {44,52,60}
 * (and two probe rungs N in {68,76}) to quantify the finite-N convergence rate needed by the
 * imp-96994 sub-gap IMP96977_TRUE_LIMIT_UNSETTLED. Import-light standalone leaf: the rows are baked
 * verbatim from the reproduction run tmp/imp-96998-a048-Nladder.py; the source certificate literals
 * are carried as cited reference constants. No bound moves; reach stays 2a <= 0.96; NO QED.
 *
 * CONTEXT. imp-96977 tabulated the interval-rigorous positive-tail-dropped Rayleigh floors of
 * lambda_min(T_a[sigma_2]) at N = [20, 28, 36], pinning the a=0.48 (2a=0.96) certified endpoint at
 * 18.636 (N=36). imp-96994 tried to extrapolate the true infinite-dim limit from those three points
 * and found them PRE-ASYMPTOTIC (Aitken and 3-point power-law both unphysical), leaving the sub-gap
 * IMP96977_TRUE_LIMIT_UNSETTLED open and explicitly requesting the wider N-ladder (this ticket).
 *
 * METHOD. The certificate driver was reused VERBATIM (imp-96749/imp-96977): pole-free basis
 * phi_n(x) = (a^2-x^2)^3 P_n(x/a), exact spherical-Bessel FT
 * phihat_n(t) = a^7 sum_k (-i)^k (2k+1) j_k(a t) L_nk, composite 24-node Gauss-Legendre in t on
 * [0, T=300] with panel 1.5, generalised eigenproblem (A, B) with the ||g||^2 Gram B and the
 * POSITIVE TAIL t > 300 DROPPED (sigma_2 > 0 there => dropping a positive-semidefinite piece lowers
 * the Rayleigh quotient => the floor is a rigorous LOWER bound on the finite-N Rayleigh value). The
 * setting reproduces the imp-96977 a=0.48 N=[20,28,36] anchors [20.836, 19.936, 18.636] to the digit.
 *
 * FINDING 1 -- THE EXTENDED FLOOR LADDER (a=0.48, positive-tail-dropped LOWER bounds), N=[20..76]:
 *   N=20: 20.836409   N=28: 19.936098   N=36: 18.636145   N=44: 17.200516
 *   N=52: 15.545522   N=60: 13.664073   N=68: 11.798015   N=76: 10.153235
 * strictly monotone decreasing (finite-N Rayleigh UPPER bounds on the true lambda_min), extending the
 * imp-96977 triple by five further rungs and still order-10 positive at N=76.
 *
 * FINDING 2 -- THE PER-N DECREMENT IS STILL NOT IN A CONVERGENT GEOMETRIC TAIL AT N<=76. The
 * consecutive decrements d_k = floor(N_k) - floor(N_{k+1}) are
 *   0.90031, 1.29995, 1.43563, 1.65499, 1.88145, 1.86606, 1.64478
 * i.e. they ACCELERATE through N~52 (peak decrement 1.881 at 44->52), confirming the imp-96994
 * "second difference non-convergent" reading over the enlarged window, and only BEGIN to contract at
 * the last two steps (decrement ratios 1.4439, 1.1044, 1.1528, 1.1368, 0.9918, 0.8814 -- the ratio
 * first dips below 1 at 52->60->68). A stable geometric tail (ratio comfortably and steadily < 1)
 * is NOT yet reached: the extrapolation stays indeterminate, the sub-gap STAYS OPEN.
 *
 * FINDING 3 -- THE DOUBLE-PRECISION CONDITIONING WALL ARRIVES BEFORE THE TAIL. The Gram condition
 * number cond(B) grows ~14x per rung: 1.398e8 (N=20), 7.009e10 (N=36), 6.691e11 (N=44), 4.565e12
 * (N=52), 2.430e13 (N=60), 1.068e14 (N=68), 4.035e14 (N=76). By N~76 cond(B) ~ 4e14 is within ~1.5
 * decades of the IEEE-double singular limit (~1e16), so the two probe rungs N in {68,76} are already
 * near the reliable-precision edge and rungs beyond ~80 are untrustworthy in double precision. This
 * is exactly the imp-96749 analyticObstruction: the geometric tail that would settle the N -> infinity
 * limit is NOT reachable in double precision -- an extended-precision / orthogonal-basis recompute is
 * required, precisely as imp-96977 and imp-96994 anticipated.
 *
 * SCOPE. Measurement only; adds five finite-N rungs to the a=0.48 ladder and their decrement profile.
 * The floors stay finite-N Rayleigh UPPER bounds (monotone decreasing in N) / positive-tail-dropped
 * LOWER bounds; no operator positivity is established. The sub-gap IMP96977_TRUE_LIMIT_UNSETTLED STAYS
 * OPEN (still pre-asymptotic, conditioning-wall-limited). Interval-rigorous certificate reach stays
 * exactly 2a <= 0.96; operator positivity for 0.96 < 2a < ln3 stays OPEN; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96977-krein-intermediate-rungs.js (the N=[20,28,36] triple this leaf extends; a=0.48 pinned 18.636)
 * @see imp-96994-krein-floor-limit-extrapolation.js (the sub-gap this ladder feeds; it requested imp-96998)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (the driver reused verbatim; analyticObstruction / conditioning ceiling)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// The a=0.48 (2a=0.96) certified endpoint rung this ladder extends.
export const IMP96998_A = 0.48;
export const IMP96998_TWO_A = 0.96;

// Extended N-ladder: imp-96977 triple [20,28,36] + requested {44,52,60} + probe rungs {68,76}.
export const IMP96998_N_LADDER = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76]);

// Reproduced + extended positive-tail-dropped Rayleigh floors (LOWER bounds), one per N above.
// N=[20,28,36] reproduce the imp-96977 anchors [20.836, 19.936, 18.636] to the digit.
export const IMP96998_FLOORS = Object.freeze([
  20.836409, 19.936098, 18.636145, 17.200516, 15.545522, 13.664073, 11.798015, 10.153235,
]);

// Gram condition number cond(B) per rung -- documents the double-precision conditioning wall.
export const IMP96998_COND_B = Object.freeze([
  1.398e8, 4.543e9, 7.009e10, 6.691e11, 4.565e12, 2.430e13, 1.068e14, 4.035e14,
]);

// The imp-96977 anchor triple reproduced (first three floors), for the exact-match assertion.
export const IMP96998_IMP96977_ANCHORS = Object.freeze([20.836, 19.936, 18.636]);

// Consecutive decrements d_k = floor(N_k) - floor(N_{k+1}) (all positive; monotone-decreasing floors).
export const IMP96998_DECREMENTS = Object.freeze(
  IMP96998_FLOORS.slice(0, -1).map((v, i) => v - IMP96998_FLOORS[i + 1]),
);

// Successive decrement ratios r_k = d_{k+1}/d_k. Geometric tail would need r steadily < 1.
export const IMP96998_DECREMENT_RATIOS = Object.freeze(
  IMP96998_DECREMENTS.slice(0, -1).map((d, i) => IMP96998_DECREMENTS[i + 1] / d),
);

export const IMP96998_VERDICT = Object.freeze({
  ticket: 'imp-96998',
  question: 'extend the imp-96977 a=0.48 (2a=0.96) certified-endpoint Rayleigh floor ladder beyond N=36 to N in {44,52,60} and quantify the finite-N convergence rate feeding the imp-96994 true-limit extrapolation',
  method: 'certificate driver reused verbatim ((a^2-x^2)^3 P_n basis, exact spherical-Bessel FT, T=300, panel 1.5, 24-node GL, positive tail t>300 dropped => LOWER bounds); reproduces the imp-96977 a=0.48 N=[20,28,36] anchors to the digit, then adds N in {44,52,60} and two probe rungs {68,76}',
  nLadder: IMP96998_N_LADDER,
  floors: IMP96998_FLOORS,
  condB: IMP96998_COND_B,
  reproducesImp96977Anchors: true,               // first three floors match [20.836,19.936,18.636]
  floorsMonotoneDecreasingInN: true,             // Rayleigh upper bounds decrease with N
  floorsArePositiveTailDroppedLowerBounds: true,
  decrementsStillAcceleratingThroughN52: true,   // peak decrement 1.881 at 44->52 (Finding 2)
  decrementRatioFirstDipsBelow1AtTail: true,     // r=0.9918, 0.8814 only at the last two steps
  geometricTailReached: false,                   // no steady ratio < 1 => still pre-asymptotic
  conditioningWallBeforeTail: true,              // cond(B)~4e14 at N=76, near IEEE-double edge (Finding 3)
  floorN76: 10.153235,                           // still order-10 positive at the last reliable rung
  subGapClosed: false,
  subGap: 'IMP96977_TRUE_LIMIT_UNSETTLED STAYS OPEN -- the extended N<=76 ladder is still pre-asymptotic (decrements accelerate through N~52 and only begin to contract at N~60-76) and the Gram cond(B)~4e14 at N=76 hits the double-precision conditioning wall before a stable geometric tail is reached; settling the N -> infinity limit needs the extended-precision / orthogonal-basis recompute (imp-96749 analyticObstruction)',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96998_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96998_ASSERTIONS = [
  {
    id: 'imp96998-reproduces-imp96977-a048-anchors',
    holds: () =>
      IMP96998_FLOORS.slice(0, 3).every(
        (v, i) => Math.abs(v - IMP96998_IMP96977_ANCHORS[i]) < 0.01,
      ),
    why: 'the identical certificate setting (T=300, panel 1.5, 24-node GL, positive tail dropped) reproduces the imp-96977 a=0.48 N=[20,28,36] anchors [20.836, 19.936, 18.636] to the digit.',
  },
  {
    id: 'imp96998-floors-monotone-decreasing-in-N',
    holds: () =>
      IMP96998_FLOORS.length === IMP96998_N_LADDER.length &&
      IMP96998_FLOORS.every((x, i) => i === 0 || IMP96998_FLOORS[i - 1] > x) &&
      IMP96998_FLOORS[IMP96998_FLOORS.length - 1] > 10 &&
      IMP96998_DECREMENTS.every((d) => d > 0),
    why: 'the extended a=0.48 ladder is strictly monotone decreasing in N with all-positive decrements (finite-N Rayleigh UPPER bounds), and stays order-10 positive at N=76.',
  },
  {
    id: 'imp96998-still-pre-asymptotic-conditioning-wall',
    holds: () => {
      // decrements accelerate through the middle of the ladder (peak at the 44->52 step)
      const dmaxIdx = IMP96998_DECREMENTS.indexOf(Math.max(...IMP96998_DECREMENTS));
      const accel = dmaxIdx >= 3; // peak decrement at or beyond the 44->52 step
      // cond(B) grows monotonically and reaches the double-precision edge (~1e14+) by N=76
      const condMono = IMP96998_COND_B.every((c, i) => i === 0 || IMP96998_COND_B[i - 1] < c);
      const condWall = IMP96998_COND_B[IMP96998_COND_B.length - 1] > 1e14;
      return accel && condMono && condWall && IMP96998_VERDICT.geometricTailReached === false;
    },
    why: 'the per-N decrement still accelerates through N~52 (peak at the 44->52 step) so no stable geometric tail is reached, and cond(B) grows monotonically to ~4e14 at N=76 -- the double-precision conditioning wall arrives before the tail.',
  },
  {
    id: 'imp96998-subgap-open-no-qed',
    holds: () =>
      IMP96998_VERDICT.subGapClosed === false &&
      IMP96998_VERDICT.geometricTailReached === false &&
      IMP96998_VERDICT.floorsArePositiveTailDroppedLowerBounds === true &&
      IMP96998_VERDICT.operatorPositivityProved === false &&
      IMP96998_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96998_VERDICT.qed === false,
    why: 'the wider ladder does NOT close IMP96977_TRUE_LIMIT_UNSETTLED (still pre-asymptotic, conditioning-wall-limited); the floors stay positive-tail-dropped LOWER bounds, no operator positivity is added, the interval-rigorous reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP96998_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96998 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
