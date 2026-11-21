/**
 * @module imp-97557-krein-B-subtop-galerkin-weyl-bracket-measurement
 * @fileoverview imp-97557 -- MEASURE the finite-N Galerkin eigenvalue ladder of B = P_a M_{sigma2^-} P_a at
 *   2a = ln3, read off the THIRD-LARGEST eigenvalue lambda_3rd-largest(B), and compute the resulting
 *   Weyl/Lidskii lower bracket lambda_1(C) - lambda_3rd-largest(B) toward the 83.090493 m=2 gate. imp-97536
 *   Route B identified the Weyl inequality lambda_3(A) >= lambda_1(C) - lambda_3rd-largest(B) (A = C - B,
 *   C = P_a M_{sigma2^+} P_a >= 0, B = P_a M_{sigma2^-} P_a >= 0) as the ONE structurally distinct handle
 *   toward the m=2 gate: it subtracts B THIRD-LARGEST eigenvalue rather than ||B|| = 4336.198, and the
 *   confined well (total width 6.893) under the ln3 band limit has time-bandwidth product ~2.41, so B should
 *   carry only ~2-3 well modes. imp-97536 left the actual eigenvalue ladder UNTABULATED. This leaf tabulates it.
 *
 *   MEASUREMENT ONLY (Rayleigh-Ritz brackets, NOT a certified bound). The pole-free basis
 *   phi_n = (a^2-x^2)^3 P_n(x/a) with EXACT Gram metric (imp-97183/imp-97414); for a weight g(t) the
 *   compressed operator matrix is G_g[n][m] = (1/pi) int_0^T g(t) R_n(t) R_m(t) dt and its Ritz spectrum is
 *   the generalized-eigenvalue ladder of the pencil (G_g, Gram). Driver tmp/imp-97557-B-subtop-galerkin.py,
 *   mpmath dps=40, N in {28,40}, T=200, panel=1, gl=24 (nq=4800). The A = P_a M_sigma2 P_a Ritz brackets
 *   reproduce imp-97536 exactly at N=28 (lambda_1=0.543044, lambda_2=83.090493, lambda_3=5516.954964),
 *   validating the split.
 *
 *   RESULT. The B ladder shows exactly the predicted structure: TWO dominant well-carrying modes then a sharp
 *   drop -- at N=28, lambda(B) = [1533.07, 1441.13, 89.42, 72.34, 10.46, 3.20, 0.21, 0.013, ...]. Reading
 *   off the third-largest (89.42) and lambda_1(C) = 113.92 (smallest Ritz eigenvalue of C, i.e. the Weyl
 *   lambda_1 in increasing-order convention) gives the Weyl bracket lambda_1(C) - lambda_3rd(B) =
 *   113.92 - 89.42 = 24.51. This is POSITIVE and recovers ~99.4% of the index-blind deficit (the naive
 *   ||B|| bracket lambda_1(C) - 4336.198 = -4222.27), but it is SHORT of the 83.090493 gate by 58.58.
 *   At N=40 the bracket is 18.08 (deficit 65.01): the third-largest Ritz eigenvalue of B INCREASES with N
 *   (89.42 -> 92.93) while the smallest Ritz eigenvalue of C DECREASES (113.92 -> 111.01), so the reading
 *   drifts AWAY from the gate as the basis grows.
 *
 *   WHY THE MEASUREMENT IS NOT A CERTIFICATE, IN THE ADVERSE DIRECTION. For B = P_a M_{sigma2^-} P_a >= 0 a
 *   finite-N Ritz value of a TOP eigenvalue is a LOWER bound on the true eigenvalue (max-min), so the true
 *   lambda_3rd-largest(B) is at least the measured 89.42/92.93 -- larger, not smaller. A smallest Ritz value
 *   of C is an UPPER bound on the true lambda_1(C), so the true lambda_1(C) is at most 113.92/111.01 --
 *   smaller, not larger. BOTH finite-N errors push the true certified Weyl bracket BELOW the measured value.
 *   The measured +24.51 is therefore an OPTIMISTIC reading of a quantity whose certified value is smaller and
 *   still far short of 83.09. To reach the gate one would need lambda_3rd-largest(B) < lambda_1(C) - 83.09
 *   ~ 28-30, i.e. roughly a 3x reduction below the measured ~89-93 -- and, crucially, a CERTIFIED UPPER bound
 *   on lambda_3rd-largest(B), which is exactly the band-limited concentration (prolate-spectrum) estimate the
 *   program lacks (imp-97536 sub-gap IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM). The
 *   measurement CONFIRMS imp-97536: Route B is the right structural handle (the index-skip recovers ~99% of
 *   the ||B|| deficit), the well carries the predicted 2 dominant modes, but even the optimistic finite-N
 *   reading falls ~59-65 short of the gate and drifts the wrong way with N.
 *
 *   No operator positivity; no certified bound on lambda_3rd-largest(B); the m=2 gate stays unreached at
 *   2a = ln3; no bound on Lambda moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * @see imp-97536-krein-lambda3-lower-bound-alt-routes-assessment.js (Route B; the untabulated ~2.41 TBW estimate this leaf measures)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (||B|| = -inf_t sigma_2 = 4336.198 at t=9.3502)
 * @see imp-97501-sigma2-far-field-positivity-rigorous-margin.js (confined well [0,3.306]u[6.945,10.532], sigma2>0 beyond t0~27)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (Ritz bracket machinery; A basis and exact Gram)
 *
 * Ticket: imp-97557 (numerical, opus-4-8, api-pool). Measurement only; Rayleigh/Ritz brackets, not a
 * certified bound; no operator positivity; no bound moves; reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681096 -- the binding 2a for the Krein / c_sharp floor
export const IMP97557_BINDING_2A = LN3;
export const IMP97557_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

// The m=2 gate inputs (from imp-97536); A Ritz brackets below reproduce these exactly at N=28.
export const IMP97557_GATE = Object.freeze({
  m2Gate: 83.090493, // a certified lower bound on lambda_3(A) must EXCEED this (imp-97536)
  normBCeiling: 4336.198026, // ||B|| = -inf_t sigma_2 at t=9.3502 (imp-97335) -- the index-blind subtraction
  wellTimeBandwidthProduct: (LN3 / Math.PI) * (3.306 + (10.532 - 6.945)), // ~2.41 -> ~2-3 well modes
});

// MEASURED Galerkin ladders. Driver tmp/imp-97557-B-subtop-galerkin.py (mpmath dps=40, T=200, panel=1, gl=24).
// B = P_a M_{sigma2^-} P_a descending Ritz ladder; lambda_1(C) = smallest Ritz eigenvalue of C = P_a M_{sigma2^+} P_a
// (the Weyl lambda_1 in increasing-order convention); A = P_a M_sigma2 P_a Ritz brackets (cross-check vs imp-97536).
export const IMP97557_MEASUREMENT = Object.freeze({
  N28: Object.freeze({
    N: 28,
    B_ladder_desc: Object.freeze([1533.072945, 1441.126482, 89.415903, 72.339642, 10.460469, 3.204119, 0.205568, 0.012845]),
    B_thirdLargest: 89.415903,
    lambda1_C: 113.923300,
    A_ritz: Object.freeze({ lambda1: 0.543044, lambda2: 83.090493, lambda3: 5516.954964 }),
    weylLowerBracket: 24.507397, // lambda_1(C) - lambda_3rd-largest(B)
    deficitToGate: 58.583096, // 83.090493 - 24.507397
    naiveNormBBracket: -4222.274726, // lambda_1(C) - ||B||  (index-blind, imp-97536 Route baseline)
  }),
  N40: Object.freeze({
    N: 40,
    B_ladder_desc: Object.freeze([1550.720980, 1441.871074, 92.933102, 72.462757, 10.488812, 3.430617, 0.226599, 0.014371]),
    B_thirdLargest: 92.933102,
    lambda1_C: 111.010266,
    weylLowerBracket: 18.077164,
    deficitToGate: 65.013329,
    naiveNormBBracket: -4225.187760,
  }),
});

export const IMP97557_VERDICT = Object.freeze({
  ticket: 'imp-97557',
  question:
    'measure the finite-N Galerkin eigenvalue ladder of B = P_a M_{sigma2^-} P_a at 2a=ln3, read off the ' +
    'third-largest eigenvalue, and compute the Weyl lower bracket lambda_1(C) - lambda_3rd-largest(B) to see ' +
    'how close it gets to the required 83.090493 m=2 gate.',
  answer:
    'the B ladder shows the predicted structure -- TWO dominant well-carrying modes (~1533 and ~1441 at N=28) ' +
    'then a sharp drop to a third-largest eigenvalue of ~89.4, consistent with the confined-well time-bandwidth ' +
    'product ~2.41. The measured Weyl bracket lambda_1(C) - lambda_3rd-largest(B) = 113.92 - 89.42 = 24.51 is ' +
    'POSITIVE and recovers ~99.4% of the index-blind deficit (naive ||B|| bracket = -4222.27), but it is SHORT ' +
    'of the 83.090493 gate by 58.58. At N=40 the bracket falls to 18.08 (deficit 65.01): the third-largest Ritz ' +
    'eigenvalue of B rises with N (89.42->92.93) while the smallest Ritz eigenvalue of C falls (113.92->111.01), ' +
    'so the reading drifts AWAY from the gate. And these are Ritz brackets in the ADVERSE direction: a top Ritz ' +
    'eigenvalue of B>=0 is a LOWER bound on the true value, a smallest Ritz eigenvalue of C is an UPPER bound on ' +
    'the true value, so the certified Weyl bracket is even smaller than measured. Reaching the gate needs ' +
    'lambda_3rd-largest(B) < ~28-30 (a ~3x reduction from ~89-93) AND a CERTIFIED upper bound on it -- the ' +
    'band-limited concentration estimate the program lacks (imp-97536 sub-gap). Route B is confirmed as the ' +
    'right structural handle and quantified, but it does not reach the m=2 gate.',
  binding_2a: LN3,
  m2Gate: 83.090493,
  ladderShowsTwoDominantWellModes: true, // B_1,B_2 >> B_3 (drop factor ~16x at N=28)
  weylBracketPositive: true, // +24.51 (N=28), +18.08 (N=40)
  weylBracketReachesGate: false, // short by 58.58 (N=28), 65.01 (N=40)
  bracketDriftsAwayWithN: true, // 24.51 -> 18.08 as N grows
  ritzReadingIsAdverseToCertification: true, // true certified bracket <= measured bracket
  requiresCertifiedBSubTopUpperBound: true, // imp-97536 sub-gap IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM
  crossCheckAritzMatchesImp97536: true, // lambda2=83.090493, lambda3=5516.954964 reproduced at N=28
  // program state
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

export const IMP97557_HONEST_BANNER =
  'imp-97557 measurement: the finite-N Galerkin ladder of B = P_a M_{sigma2^-} P_a at 2a=ln3 shows two ' +
  'dominant well-carrying modes (~1533, ~1441) then a sharp drop to a third-largest eigenvalue ~89.4 ' +
  '(consistent with the ~2.41 confined-well time-bandwidth product). The measured Weyl/Lidskii bracket ' +
  'lambda_1(C) - lambda_3rd-largest(B) = 24.51 (N=28) is POSITIVE and recovers ~99.4% of the index-blind ' +
  '||B||=4336.198 deficit, but is SHORT of the 83.090493 m=2 gate by 58.58, falls to 18.08 at N=40, and ' +
  'drifts away from the gate with N. Because a top Ritz eigenvalue of B underestimates and a bottom Ritz ' +
  'eigenvalue of C overestimates, the certified bracket is even smaller. Reaching the gate needs a CERTIFIED ' +
  'upper bound on lambda_3rd-largest(B) below ~28-30 -- the missing band-limited concentration estimate ' +
  '(imp-97536 sub-gap). Route B is confirmed and quantified but does not reach the gate. No operator ' +
  'positivity; no bound on Lambda moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97557_ASSERTIONS = [
  {
    id: 'imp97557-A-ritz-reproduces-imp97536-gate',
    holds: () =>
      Math.abs(IMP97557_MEASUREMENT.N28.A_ritz.lambda2 - IMP97557_GATE.m2Gate) < 1e-6 &&
      Math.abs(IMP97557_MEASUREMENT.N28.A_ritz.lambda3 - 5516.954964) < 1e-3 &&
      Math.abs(IMP97557_MEASUREMENT.N28.A_ritz.lambda1 - 0.543044) < 1e-6,
    why: 'the A = P_a M_sigma2 P_a Ritz brackets at N=28 must reproduce imp-97536 (lambda_2=83.090493, lambda_3=5516.954964, lambda_1=0.543044), validating the sigma2^+/sigma2^- split.',
  },
  {
    id: 'imp97557-ladder-two-dominant-well-modes',
    holds: () =>
      IMP97557_MEASUREMENT.N28.B_ladder_desc[0] > 1000 &&
      IMP97557_MEASUREMENT.N28.B_ladder_desc[1] > 1000 &&
      IMP97557_MEASUREMENT.N28.B_ladder_desc[2] < 200 &&
      IMP97557_MEASUREMENT.N28.B_ladder_desc[1] / IMP97557_MEASUREMENT.N28.B_ladder_desc[2] > 10 &&
      IMP97557_MEASUREMENT.N28.B_thirdLargest === IMP97557_MEASUREMENT.N28.B_ladder_desc[2] &&
      IMP97557_VERDICT.ladderShowsTwoDominantWellModes === true,
    why: 'B carries two dominant well modes (>1000) then drops >10x to the third-largest (<200), matching the ~2.41 time-bandwidth product prediction of ~2-3 well modes.',
  },
  {
    id: 'imp97557-weyl-bracket-positive-but-short',
    holds: () =>
      Math.abs((IMP97557_MEASUREMENT.N28.lambda1_C - IMP97557_MEASUREMENT.N28.B_thirdLargest) - IMP97557_MEASUREMENT.N28.weylLowerBracket) < 1e-4 &&
      IMP97557_MEASUREMENT.N28.weylLowerBracket > 0 &&
      IMP97557_MEASUREMENT.N28.weylLowerBracket < IMP97557_GATE.m2Gate &&
      Math.abs((IMP97557_GATE.m2Gate - IMP97557_MEASUREMENT.N28.weylLowerBracket) - IMP97557_MEASUREMENT.N28.deficitToGate) < 1e-4 &&
      IMP97557_MEASUREMENT.N28.naiveNormBBracket < -4000 &&
      IMP97557_VERDICT.weylBracketPositive === true &&
      IMP97557_VERDICT.weylBracketReachesGate === false,
    why: 'the Weyl bracket lambda_1(C)-lambda_3rd(B)=24.51 is positive (recovering ~99% of the index-blind ||B|| deficit) but short of the 83.090493 gate by 58.58.',
  },
  {
    id: 'imp97557-bracket-drifts-away-with-N',
    holds: () =>
      IMP97557_MEASUREMENT.N40.B_thirdLargest > IMP97557_MEASUREMENT.N28.B_thirdLargest &&
      IMP97557_MEASUREMENT.N40.lambda1_C < IMP97557_MEASUREMENT.N28.lambda1_C &&
      IMP97557_MEASUREMENT.N40.weylLowerBracket < IMP97557_MEASUREMENT.N28.weylLowerBracket &&
      IMP97557_VERDICT.bracketDriftsAwayWithN === true &&
      IMP97557_VERDICT.ritzReadingIsAdverseToCertification === true,
    why: 'as N grows the third-largest Ritz eigenvalue of B rises and the smallest of C falls, so the measured Weyl bracket drifts away from the gate and the certified value is even smaller.',
  },
  {
    id: 'imp97557-measurement-only-no-qed',
    holds: () =>
      IMP97557_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97557_VERDICT.operatorPositivityProved === false &&
      IMP97557_VERDICT.boundMoves === false &&
      IMP97557_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97557_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97557_BINDING_2A - LN3) < 1e-12 &&
      IMP97557_VERDICT.requiresCertifiedBSubTopUpperBound === true &&
      IMP97557_VERDICT.qed === false &&
      /NO QED/.test(IMP97557_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97557_HONEST_BANNER) &&
      /RH open/.test(IMP97557_HONEST_BANNER),
    why: 'measurement only: Rayleigh/Ritz brackets, no certified bound on lambda_3rd-largest(B), no operator positivity; no bound moves; reach stays 2a<=0.96; RH open; NO QED.',
  },
];

for (const a of IMP97557_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97557-krein-B-subtop-galerkin-weyl-bracket-measurement assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export default { measurement: IMP97557_MEASUREMENT, verdict: IMP97557_VERDICT, banner: IMP97557_HONEST_BANNER };
