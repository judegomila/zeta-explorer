/**
 * @module imp-3611-skew-toeplitz-krylov-gap-ladder-viz-data
 * @fileoverview imp-3611 -- lightweight, import-light literal data for a
 *   visualization of the imp-3575 corrected-Krylov skew-Toeplitz gap ladder.
 *
 *   Two things are visualized:
 *   (1) The N=1600 rho(m) Krylov-depth sweep: the imp-3545 m=200 reference
 *       rho=0.9993548 was an ARTIFACT rung (still climbing in lambda_3, not
 *       converged); growing the Lanczos depth to m=240 jumps it +4.03e-4 to
 *       0.9997580, where it then LOCKS (m=280/320/360 agree to < 2e-14).
 *   (2) The restored -log rho(N) ladder across N in {800,1000,1200,1600,2000}:
 *       with the CORRECTED N=1600 rung the ladder is strictly decreasing
 *       (monotone restored), whereas the imp-3555 baked artifact rung sat
 *       ABOVE N=1200 and broke monotonicity. The corrected local log-log
 *       slopes -1.9933 (1200->1600) and -1.9949 (1600->2000) continue the
 *       imp-3555 climb toward the -2 section-gap heuristic.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (measured.krylovSweep,
 *   measured.correctedLadder, measured.q1200to1600/q1600to2000) and the
 *   imp-3555 non-monotone bake it corrects. This module does NOT import the
 *   heavy Lanczos assembly, so importing it into a page costs nothing at load
 *   time.
 *
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (the source measurement)
 *   @see imp-3555-skew-toeplitz-gap-exponent-convergence.js (the non-monotone bake being corrected)
 *   @see imp-3589-cosh-overestimation-factor-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-3611 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// (1) N=1600 rho(m) Krylov-depth sweep -- the artifact-to-locked jump.
export const IMP3611_N1600_RHO_BY_M = Object.freeze([
  { m: 200, rho: 0.999354751463 }, // = imp-3545 baked value -- the ARTIFACT rung, still climbing
  { m: 240, rho: 0.999757985403 }, // +4.03e-4 jump -- lambda_3 resolved
  { m: 280, rho: 0.999757985403 }, // LOCKS
  { m: 320, rho: 0.999757985403 },
  { m: 360, rho: 0.999757985403 },
]);

// N=1200 anchor rho(m) for contrast -- already converged at m=200 (flat throughout).
export const IMP3611_N1200_ANCHOR_RHO_BY_M = Object.freeze([
  { m: 200, rho: 0.999570629767 },
  { m: 240, rho: 0.999570629767 },
  { m: 280, rho: 0.999570629767 },
  { m: 320, rho: 0.999570629767 },
  { m: 360, rho: 0.999570629767 },
]);

export const IMP3611_N1600_M200_ARTIFACT_RHO = 0.999354751463;
export const IMP3611_N1600_CONVERGED_RHO = 0.9997579854030878;
export const IMP3611_N1600_LOCK_DEPTH = 280;

// (2) The restored -log rho(N) ladder, N in {800,1000,1200,1600,2000}.
// N=800/1000/1200/2000 are single-valued (already converged); N=1600 carries
// both the imp-3555 ARTIFACT bake (breaks monotonicity) and the imp-3575
// CORRECTED value (restores it).
export const IMP3611_LADDER = Object.freeze([
  { N: 800, logInvRho: 0.0009625430796462755, src: 'imp-3530' },
  { N: 1000, logInvRho: 0.0006174642590372331, src: 'imp-3545' },
  { N: 1200, logInvRho: 0.00042946243853075395, src: 'imp-3545 / imp-3575 (converged, matches)' },
  { N: 1600, logInvRho: 0.00024204388717063361, src: 'imp-3575 (RECONVERGED, m>=280)' },
  { N: 2000, logInvRho: 0.00015508964022665903, src: 'imp-3575 (converged, m>=280)' },
]);

// The imp-3555 non-monotone N=1600 bake (m=200 artifact) -- sits ABOVE N=1200,
// breaking the strictly-decreasing ladder. Shown alongside the corrected rung.
export const IMP3611_N1600_ARTIFACT_LOG_INV_RHO = 0.000645456799568498;

export const IMP3611_HEURISTIC_Q = -2;

// Local pairwise log-log exponents on the CORRECTED ladder.
function qLocal(a, b) {
  return Math.log(b.logInvRho / a.logInvRho) / Math.log(b.N / a.N);
}
const n1200 = IMP3611_LADDER.find((r) => r.N === 1200);
const n1600 = IMP3611_LADDER.find((r) => r.N === 1600);
const n2000 = IMP3611_LADDER.find((r) => r.N === 2000);

export const IMP3611_Q_1200_TO_1600 = qLocal(n1200, n1600); // ~ -1.9933
export const IMP3611_Q_1600_TO_2000 = qLocal(n1600, n2000); // ~ -1.9949

// What the (broken) local slope would have been using the ARTIFACT rung --
// positive, i.e. a reversed/increasing gap, illustrating why imp-3555 flagged it.
export const IMP3611_Q_1200_TO_1600_ARTIFACT = qLocal(n1200, {
  N: 1600,
  logInvRho: IMP3611_N1600_ARTIFACT_LOG_INV_RHO,
});
