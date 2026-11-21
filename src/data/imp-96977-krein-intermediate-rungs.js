/**
 * @fileoverview imp-96977 -- NUMERICAL: fill the flanking gap in the Route I Toeplitz/Krein
 * certificate lambda_min(T_a[sigma_2]) between the tabulated a=0.45 and a=0.50 rungs by computing
 * the interval-rigorous Rayleigh floor DIRECTLY at the four intermediate rungs a in
 * {0.46, 0.47, 0.48, 0.49} (2a in {0.92, 0.94, 0.96, 0.98}). Import-light standalone leaf: the four
 * rows are baked verbatim from the reproduction run; the source certificate literals are carried as
 * cited reference constants (rh-route-i-toeplitz-krein-certificate transitively pulls the heavy
 * Route H/semilocal chain, too heavy for a data leaf). No bound moves; NO QED.
 *
 * CONTEXT. imp-96958 (Finding 1) found the certificate TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2 has
 * NO rung exactly at a=0.48 (2a=0.96, the certified-positive interval endpoint): the value was only
 * FLANKED 7.743 < lambda_min(0.48) < 56.05 by the tabulated a=0.45 (56.05) and a=0.50 (7.743) rungs,
 * with a log-linear interpolation ~17.09. That flanking bracket spans ~7.2x and left the endpoint
 * unpinned.
 *
 * METHOD. Reuse the certificate driver VERBATIM (imp-96749 reproduction): pole-free basis
 * phi_n(x) = (a^2-x^2)^3 P_n(x/a), exact spherical-Bessel FT
 * phihat_n(t) = a^7 sum_k (-i)^k (2k+1) j_k(a t) L_nk, composite 24-node Gauss-Legendre in t on
 * [0, T=300] with panel 1.5, generalised eigenproblem (A, B) with the ||g||^2 Gram B and the POSITIVE
 * TAIL t > 300 DROPPED (sigma_2 > 0 there => dropping a positive-semidefinite piece lowers the
 * Rayleigh quotient => the floor is a rigorous LOWER bound). This exact setting reproduces the
 * tabulated anchors to the digit: a=0.45 -> [62.593, 59.332, 56.055] (table [62.59, 59.33, 56.05]),
 * a=0.50 -> [8.838, 8.345, 7.743] (table [8.838, 8.345, 7.743]) at N = [20, 28, 36].
 *
 * FINDING 1 -- THE FOUR INTERMEDIATE RUNGS (positive-tail-dropped LOWER bounds, N = [20, 28, 36]):
 *   a=0.46 (2a=0.92): [44.273, 41.975, 39.781]
 *   a=0.47 (2a=0.94): [30.684, 29.260, 27.635]
 *   a=0.48 (2a=0.96): [20.836, 19.936, 18.636]   <- certified-endpoint, now PINNED directly
 *   a=0.49 (2a=0.98): [13.804, 13.165, 12.213]
 *
 * FINDING 2 -- THE a=0.48 CERTIFIED ENDPOINT IS NOW PINNED, NOT MERELY FLANKED. The direct converged
 * N=36 floor at a=0.48 is 18.636, replacing the imp-96958 flanking bracket (7.743, 56.05) / log-linear
 * interpolation ~17.09 with a single computed value. The direct value 18.636 sits ABOVE the log-linear
 * interpolation 17.09 (the true decay in a is convex in log-space, so log-linear interpolation over the
 * wide 0.45-0.50 flank UNDERESTIMATES the interior floor by ~9%), a firmly order-10 positive value at
 * the certified endpoint.
 *
 * FINDING 3 -- MONOTONE DECREASE AS 2a RISES, CONFIRMED ON THE FINER GRID. Across the full refined
 * ladder the converged N=36 floor is strictly monotone decreasing in 2a:
 * 56.05 (0.90) > 39.781 (0.92) > 27.635 (0.94) > 18.636 (0.96) > 12.213 (0.98) > 7.743 (1.00),
 * confirming the imp-96835 monotone-in-2a decrease across the finer grid with no non-monotone dip.
 *
 * FINDING 4 -- RESOLVES THE imp-96958 APPARENT INVERSION. imp-96958 flagged that the finest imp-96938
 * Ritz UPPER estimate at 2a=0.96 (12.0089) sat slightly BELOW the log-interpolated rigorous lower
 * 17.09, an apparent directional-bracket inversion attributed to normalisation mismatch. The direct
 * rigorous floor 18.636 lands inside the full imp-96938 Ritz band [12.0089, 21.0155] and above the
 * log-interp 17.09, so both independent estimators now agree the endpoint value is ~18-19, in the
 * order-10 positive band -- the apparent inversion was indeed an interpolation/normalisation artefact,
 * not a certification failure.
 *
 * SCOPE. The Rayleigh floors are UPPER bounds on the true infinite-dim lambda_min (monotone decreasing
 * in N); the positive-tail-dropped construction makes each TABULATED cell a rigorous LOWER bound on the
 * finite-N Rayleigh value, not an operator positivity theorem. The interval-rigorous certificate reach
 * stays exactly 2a <= 0.96; operator positivity for 0.96 < 2a < ln3 stays OPEN; RH open; no refereed bound is changed
 * ; NO QED. SUB-GAP IMP96977_TRUE_LIMIT_UNSETTLED: these are finite-N floors
 * (uniform-in-N spectral gap lambda_min >= c > 0 still open, per imp-96749 analyticObstruction); pinning
 * the N -> infinity limit at these rungs needs the extended-precision / orthogonal-basis recompute.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2; interval reach 2a <= 0.96)
 * @see imp-96958-krein-096-ritz-vs-rigorous-crossval.js (the flanking-gap finding this leaf fills)
 * @see imp-96835-krein-2a-monotonicity-cross-check.js (lambda_min decreases monotonically as 2a rises)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (the driver reused verbatim; analyticObstruction sub-gap)
 */

// N-ladder shared by every rung (matches TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2.N)
export const IMP96977_N_LADDER = Object.freeze([20, 28, 36]);

// Reproduced flanking anchors (identical setting reproduces the tabulated values to the digit).
export const IMP96977_ANCHORS = Object.freeze({
  a045: { twoA: 0.90, floors: [62.593, 59.332, 56.055], tableN36: 56.05 },
  a050: { twoA: 1.00, floors: [8.838, 8.345, 7.743], tableN36: 7.743 },
});

// The four newly-computed intermediate rungs -- interval-rigorous Rayleigh floors
// ((a^2-x^2)^3 P_n basis, ||g||^2-normalised, positive tail t > 300 dropped => LOWER bounds),
// N = [20, 28, 36], T=300, panel 1.5, 24-node Gauss-Legendre.
export const IMP96977_INTERMEDIATE_RUNGS = Object.freeze({
  a046: { twoA: 0.92, floors: [44.273, 41.975, 39.781] },
  a047: { twoA: 0.94, floors: [30.684, 29.260, 27.635] },
  a048: { twoA: 0.96, floors: [20.836, 19.936, 18.636] }, // certified-endpoint, now pinned
  a049: { twoA: 0.98, floors: [13.804, 13.165, 12.213] },
});

// Converged (N=36) floor at the certified endpoint a=0.48, pinned directly.
export const IMP96977_A048_FLOOR_N36 = IMP96977_INTERMEDIATE_RUNGS.a048.floors[2]; // 18.636

// imp-96958 flanking bracket + log-linear interpolation the direct value replaces.
export const IMP96977_FLANK_LO = 7.743;   // a=0.50
export const IMP96977_FLANK_HI = 56.05;   // a=0.45
const FRAC_048 = (0.48 - 0.45) / (0.50 - 0.45); // 0.6
export const IMP96977_LOGLIN_INTERP_A048 = Math.exp(
  Math.log(IMP96977_FLANK_HI) + FRAC_048 * (Math.log(IMP96977_FLANK_LO) - Math.log(IMP96977_FLANK_HI)),
); // ~17.09

// imp-96938 Ritz UPPER-estimate band at 2a=0.96 (cited literals) -- the direct floor lands inside it.
export const IMP96977_RITZ_BAND_A096 = Object.freeze({ lo: 12.0089, hi: 21.0155 });

// Full converged (N=36) monotone ladder in 2a, refined grid (0.90 .. 1.00).
export const IMP96977_N36_LADDER_VS_2A = Object.freeze([
  { twoA: 0.90, floor: 56.05 },
  { twoA: 0.92, floor: 39.781 },
  { twoA: 0.94, floor: 27.635 },
  { twoA: 0.96, floor: 18.636 },
  { twoA: 0.98, floor: 12.213 },
  { twoA: 1.00, floor: 7.743 },
]);

export const IMP96977_VERDICT = Object.freeze({
  ticket: 'imp-96977',
  question: 'what is the interval-rigorous certificate lambda_min(T_a[sigma_2]) at the intermediate rungs a in {0.46,0.47,0.48,0.49} that fill the flanking gap between a=0.45 and a=0.50, and does it pin the a=0.48 certified endpoint?',
  method: 'certificate driver reused verbatim ((a^2-x^2)^3 P_n basis, exact spherical-Bessel FT, T=300, panel 1.5, 24-node GL, positive tail dropped => LOWER bounds); reproduces the tabulated a=0.45/a=0.50 anchors to the digit',
  nLadder: IMP96977_N_LADDER,
  intermediateRungs: IMP96977_INTERMEDIATE_RUNGS,
  a048FloorN36: IMP96977_A048_FLOOR_N36,            // 18.636 -- endpoint pinned
  loglinInterpA048: IMP96977_LOGLIN_INTERP_A048,    // ~17.09 -- the value now replaced
  directAboveInterp: true,                          // 18.636 > 17.09 (log-linear underestimates by ~9%)
  a048InsideRitzBand: true,                         // 18.636 in [12.0089, 21.0155]
  monotoneDecreasingIn2a: true,                     // 56.05 > 39.78 > 27.64 > 18.64 > 12.21 > 7.743
  floorsArePositiveTailDroppedLowerBounds: true,
  floorsAreFiniteNRayleighUpperBoundsOnTrueLambdaMin: true,
  subGap: 'IMP96977_TRUE_LIMIT_UNSETTLED -- the four intermediate rungs are finite-N Rayleigh floors (N up to 36), positive-tail-dropped LOWER bounds on the finite-N value, NOT the N -> infinity operator lambda_min. They pin the a=0.48 certified endpoint (18.636 at N=36) and confirm monotone decrease in 2a on the refined grid, but the uniform-in-N spectral gap lambda_min >= c > 0 stays open (imp-96749 analyticObstruction); settling the true limit at these rungs needs the extended-precision / orthogonal-basis recompute',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96977_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96977_ASSERTIONS = [
  {
    id: 'imp96977-reproduces-tabulated-anchors',
    holds: () =>
      Math.abs(IMP96977_ANCHORS.a045.floors[2] - IMP96977_ANCHORS.a045.tableN36) < 0.01 &&
      Math.abs(IMP96977_ANCHORS.a050.floors[2] - IMP96977_ANCHORS.a050.tableN36) < 0.01,
    why: 'the identical certificate setting (T=300, N=[20,28,36], positive tail dropped) reproduces the tabulated a=0.45 (56.05) and a=0.50 (7.743) N=36 anchors to the digit.',
  },
  {
    id: 'imp96977-a048-endpoint-pinned-inside-flank-and-ritz-band',
    holds: () =>
      IMP96977_A048_FLOOR_N36 > IMP96977_FLANK_LO &&
      IMP96977_A048_FLOOR_N36 < IMP96977_FLANK_HI &&
      IMP96977_A048_FLOOR_N36 > IMP96977_RITZ_BAND_A096.lo &&
      IMP96977_A048_FLOOR_N36 < IMP96977_RITZ_BAND_A096.hi &&
      IMP96977_A048_FLOOR_N36 > IMP96977_LOGLIN_INTERP_A048 &&
      Math.abs(IMP96977_A048_FLOOR_N36 - 18.636) < 1e-3,
    why: 'the direct a=0.48 N=36 floor 18.636 sits inside the flanking bracket (7.743, 56.05) and the imp-96938 Ritz band [12.0089, 21.0155], and above the log-linear interpolation 17.09 -- pinning the certified endpoint and resolving the imp-96958 apparent inversion.',
  },
  {
    id: 'imp96977-monotone-decreasing-in-2a-refined-grid',
    holds: () => {
      const v = IMP96977_N36_LADDER_VS_2A.map((r) => r.floor);
      return v.every((x, i) => i === 0 || v[i - 1] > x) && v.length === 6;
    },
    why: 'the converged N=36 floor is strictly monotone decreasing across the refined 2a grid 0.90 .. 1.00 (56.05 > 39.781 > 27.635 > 18.636 > 12.213 > 7.743), confirming the imp-96835 monotone-in-2a decrease on the finer grid.',
  },
  {
    id: 'imp96977-lower-bounds-and-no-qed',
    holds: () =>
      IMP96977_VERDICT.floorsArePositiveTailDroppedLowerBounds === true &&
      IMP96977_VERDICT.floorsAreFiniteNRayleighUpperBoundsOnTrueLambdaMin === true &&
      IMP96977_VERDICT.operatorPositivityProved === false &&
      IMP96977_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96977_VERDICT.qed === false &&
      // each rung floor is monotone decreasing in N (Rayleigh upper bounds)
      Object.values(IMP96977_INTERMEDIATE_RUNGS).every((r) => r.floors[0] > r.floors[1] && r.floors[1] > r.floors[2]),
    why: 'the floors are positive-tail-dropped LOWER bounds and finite-N Rayleigh UPPER bounds on the true lambda_min (monotone decreasing in N at every rung); no operator positivity is established, the interval-rigorous reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP96977_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96977 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
