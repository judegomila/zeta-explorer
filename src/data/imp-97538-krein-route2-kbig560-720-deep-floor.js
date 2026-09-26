/**
 * @module imp-97538-krein-route2-kbig560-720-deep-floor
 * @fileoverview imp-97538 -- EXTEND the direct Route-2 A2 projector-limit build past the imp-97513 Kbig=500 edge by
 *   BUILDING the direct projector-limit A2 reproducing-kernel matrix at Kbig in {560,640,720} and reading the
 *   best-reachable Route-2 lower bound on lambda_2 DIRECTLY (no geometric extrapolation), to test whether the
 *   still-rising delta ratio 0.771 finally plateaus and pins the converged Kbig->inf floor.
 *
 *   imp-97513 built the direct A2 reproducing-kernel matrix at Kbig in {420,460,500}, tightening the Route-2
 *   lower-bound-on-lambda_2 upper edge to -310.375499 (bracket [-313.756, -310.375499], corrected-tail central
 *   ~-310.75), but left residual IMP97513_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED: the successive 40-step delta
 *   ratios KEPT RISING (0.730 -> 0.752 -> 0.771), never plateauing at the refuted geometric ~0.54, so the converged
 *   limit stayed unpinned. This leaf EXTENDS the same executed build (tmp/imp-97440-route2-lambda2-lowerbound.py,
 *   mpmath dps=50, N=28, T=200, panel=1.0, pole-free basis phi_n(x)=(a^2-x^2)^3 P_n(x/a)) to Kbig in {560,640,720}
 *   at the same shift rho=5462.61632 (fr=0.99 of (lambda_2, lambda_3), rho <= lambda_3=5516.955).
 *
 * RESULT -- THE DIRECT BUILD KEEPS TIGHTENING THE UPPER EDGE, BUT THE RATIO STILL HAS NOT PLATEAUED.
 *   Extending the direct A2 reproducing-kernel build continues the monotone saturating decrease:
 *     Kbig  : 500         560         640         720
 *     bound : -310.375499 -310.499305 -310.613648 -310.692227
 *   Because the sequence stays monotone decreasing in Kbig, the directly-measured Kbig=720 value -310.692227 is a
 *   rigorous UPPER edge on the converged floor (the limit is at most this negative), tightening the imp-97513
 *   Kbig=500 edge -310.375499.
 *
 *   The measured magnitude increments (spacing 60 then 80, 80) are 0.123806 -> 0.114343 -> 0.078579, so the 80-step
 *   delta ratio is 0.687222, i.e. a 40-step-equivalent ratio ~0.828988. That CONTINUES the imp-97513 rising trend
 *   (its last 40-step ratio was 0.771) UPWARD to ~0.829 -- the ratio has STILL NOT PLATEAUED. A corrected geometric
 *   tail at the measured 80-step ratio puts the remaining descent past Kbig=720 at ~0.1727, so the limit sits at
 *   ~ -310.865, DEEPER than the imp-97513 corrected estimate ~-310.75 but still far shallower than the
 *   power-saturation refit -313.756. So the converged Route-2 lower-bound floor now sits in the directly-anchored
 *   bracket [-313.756, -310.692227], with a corrected-tail central estimate ~ -310.87.
 *
 * WHY IT STAYS FINITE -- tr(A2) KEEPS CONVERGING. The full-projector second moment trace continues to rise with
 *   strictly shrinking increments as the enlarged-basis reproducing kernel converges:
 *     Kbig  : 500            560            640            720
 *     trA2  : 4818734261.05  4818742142.49  4818749430.60  4818754444.42
 *   deltas collapsing 7881.43 -> 7288.11 -> 5013.83 (80-step trace ratio 0.687946, matching the bound ratio 0.687222)
 *   toward the ~4819.1M limit imp-97482 named. A converging limit matrix A2 forces a converging Lehmann pencil and
 *   hence a finite negative floor for rho - 1/nu_max.
 *
 * NO CONDITIONING BLOW-UP. Across the whole shift sweep at every Kbig the Lehmann G2 minimum eigenvalue stayed
 *   strictly positive (g2min ~ 508..2830), so the enlarged-basis Gram inverse and the generalized pencil remained
 *   tractable; the build cost rose but did not blow up. (The Kbig_max=720 build was run under CPU contention from
 *   duplicate offline copies, so no clean wall-clock is recorded; the result is deterministic and read from the
 *   final JSON of the adopted run.)
 *
 * VERDICT. The regress conclusion of imp-97513 / imp-97495 / imp-97482 / imp-97440 is UNCHANGED and now directly
 *   built three steps deeper: the best-reachable Route-2 lower bound on lambda_2 SATURATES at a finite negative
 *   floor, with the directly-measured UPPER edge tightened to -310.692227 at Kbig=720 and the limit in
 *   [-313.756, -310.692227] (corrected-tail central estimate deepened to ~ -310.87). Still four orders below the
 *   required 0.581059, so the m=1 enclosure stays UNUSABLE at 2a=ln3. Measurement only; no rigorous lower bound on
 *   lambda_2; no operator positivity; no bound on Lambda moves; Platt-Trudgian Lambda<=0.2 SOTA; interval-rigorous
 *   reach stays 2a<=0.96; RH open; NO QED.
 *   RESIDUAL IMP97538_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED (the -310.692 upper edge is directly built; the
 *   -313.756 deep end still rests on the power-saturation refit and the corrected-tail ~-310.87 on the still-rising
 *   measured ratio; the 40-step-equivalent ratio has RISEN 0.771 -> 0.829, so it has not plateaued and a converged
 *   limit remains unpinned -- Kbig>720 build would pin it exactly, at rising build cost).
 *
 * @see imp-97513-krein-route2-kbig420-500-deep-floor.js (the Kbig=500 edge and [-313.756,-310.375] bracket this extends)
 * @see imp-97495-krein-route2-kbig300-380-direct-floor.js (the Kbig=380 edge and [-313.756,-309.931] bracket)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (the Route-2 recursion and A2 build)
 *
 * Ticket: imp-97538 (numerical, opus-4-8, api-pool). Measurement only; no rigorous lower bound on lambda_2;
 * no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97538_BINDING_2A = LN3;
export const IMP97538_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97538_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The extended direct-build sweep (mpmath dps=50, N=28, T=200, panel=1.0; build once at Kbig_max=720).
export const IMP97538_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigSweep: [560, 640, 720], // extends imp-97513 {420,460,500} into the deeper projector limit
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  ritz: { lambda1: 0.543043688344527, lambda2: 83.09049345172332, lambda3: 5516.954964337507 }, // exact-Gram brackets (N-only)
  shift: { fr: 0.99, rho: 5462.616319628649 }, // rho pushed to 0.99 of (lambda_2, lambda_3), rho <= lambda_3
  method:
    'direct build of A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} at larger Kbig; ' +
    'best-reachable Route-2 lower bound on lambda_2 = rho - 1/nu_max read directly (no geometric extrapolation).',
  runner: 'tmp/imp-97440-route2-lambda2-lowerbound.py 28 560,640,720 200 1.0',
  note: 'built under CPU contention from duplicate offline copies (adopted the oldest deterministic run); result read from its final JSON.',
});

// Directly-measured best-reachable Route-2 lower bound on lambda_2 vs Kbig (Kbig=500 is the imp-97513 edge).
export const IMP97538_BOUND_BY_KBIG = Object.freeze({
  500: -310.375499, // imp-97513 directly-built edge (carried for continuity)
  560: -310.499305,
  640: -310.613648,
  720: -310.692227,
});

// Magnitude increments (spacing 60,80,80) keep collapsing (still saturating, not divergent).
export const IMP97538_STEP_DELTAS = Object.freeze([0.123806, 0.114343, 0.078579]); // |500->560|,|560->640|,|640->720|
// The 80-step delta ratio and its 40-step-equivalent: the ratio KEEPS RISING past the imp-97513 0.771, still under 1.
export const IMP97538_DELTA_RATIO_80STEP = 0.687222; // (640->720) / (560->640), equal 80-step intervals
export const IMP97538_DELTA_RATIO_40STEP_EQUIV = 0.828988; // sqrt(0.687222) -- comparable to the imp-97513 0.771

// tr(A2) continues to converge as the reproducing kernel converges (units: raw trace, ~4.8e9).
export const IMP97538_A2_TRACE_BY_KBIG = Object.freeze({
  500: 4818734261.054600, // imp-97513 edge
  560: 4818742142.486366,
  640: 4818749430.595979,
  720: 4818754444.422258,
});
export const IMP97538_A2_TRACE_DELTAS = Object.freeze([7881.431766, 7288.109613, 5013.826279]); // shrinking -> converging

// Direct-build read of the Kbig->inf floor: tighter upper edge; corrected-tail central estimate deepened.
export const IMP97538_FLOOR = Object.freeze({
  directMeasuredKbig720: -310.692227, // monotone-decreasing => rigorous upper edge on the converged floor
  imp97513DirectEdgeKbig500: -310.375499, // the edge this tightens
  correctedGeometricTailEstimate: -310.865, // remaining descent ~0.1727 past Kbig=720 at the measured 80-step ratio
  imp97513CorrectedTailEstimate: -310.75, // the earlier corrected estimate this deepens
  powerSaturationEstimate: -313.756, // imp-97482 10-point power refit -- still the DEEP end of the bracket
  tightenedBracket: [-313.756, -310.692227], // upper edge directly built at Kbig=720
  imp97513Bracket: [-313.756, -310.375499],
  upperEdgeTightened: true,
  ratioStillRising: true, // 40-step-equivalent 0.771 -> 0.829, has NOT plateaued -> limit still unpinned
  diverges: false,
  saturates: true,
  a2TraceConverges: true, // deltas collapse 7881 -> 5014 toward ~4819.1M
  stillFarBelowRequired: true, // floor ~ -310.7 vs required 0.581059
});

export const IMP97538_VERDICT = Object.freeze({
  ticket: 'imp-97538',
  question:
    'does the Route-2 Kbig->inf lower-bound floor plateau (delta ratio 0.771 stop rising) and pin the converged limit when the projector-limit A2 reproducing-kernel matrix is built DIRECTLY at Kbig in {560,640,720} past 500?',
  answer:
    'NO -- the ratio still has NOT plateaued, though the direct build keeps tightening the upper edge. ' +
    'Extending the same executed A2 build to Kbig in {560,640,720} continues the monotone saturating decrease to ' +
    '-310.692227 at Kbig=720 (magnitude increments 0.124 -> 0.114 -> 0.079; tr(A2) deltas 7881 -> 5014 toward ' +
    '~4819.1M). The monotone decrease makes -310.692227 a rigorous upper edge on the converged floor, tightening ' +
    'the imp-97513 Kbig=500 edge -310.375499. The 40-step-equivalent delta ratio RISES further 0.771 -> 0.829 (it ' +
    'has not plateaued), so a corrected tail puts the limit ~ -310.87, deeper than the imp-97513 estimate -310.75 ' +
    'but still far shallower than the power refit -313.756. The floor now sits in the directly-anchored bracket ' +
    '[-313.756, -310.692227]. Still four orders below the required 0.581059, so the m=1 enclosure stays UNUSABLE ' +
    'at 2a=ln3.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  divergesToNegInfinity: false,
  saturatesAtFiniteFloor: true,
  directMeasuredKbig720: -310.692227,
  tightenedBracket: [-313.756, -310.692227],
  correctedTailEstimateDeepened: true,
  ratioStillRising: true,
  upperEdgeTightened: true,
  reproducingKernelConverges: true,
  noConditioningBlowUp: true,
  regressConclusionUnchanged: true,
  newResidual: 'IMP97538_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED',
  // measurement-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97538_ASSERTIONS = [
  {
    id: 'imp97538-carries-imp97513-kbig500-edge',
    holds: () => Math.abs(IMP97538_BOUND_BY_KBIG[500] - -310.375499) < 1e-4,
    why: 'the extended sweep carries the imp-97513 Kbig=500 directly-built edge -310.375499 for continuity.',
  },
  {
    id: 'imp97538-bound-monotone-decreasing',
    holds: () => {
      const ks = [500, 560, 640, 720];
      for (let i = 1; i < ks.length; i++) if (!(IMP97538_BOUND_BY_KBIG[ks[i]] < IMP97538_BOUND_BY_KBIG[ks[i - 1]])) return false;
      return true;
    },
    why: 'the best-reachable lower bound worsens monotonically -310.38 -> -310.69 as Kbig grows past 500 (still saturating).',
  },
  {
    id: 'imp97538-step-deltas-collapse',
    holds: () => {
      const d = IMP97538_STEP_DELTAS;
      return d[0] > 0 && d[d.length - 1] > 0 && d[d.length - 1] < d[0]; // 0.124 -> 0.079 (spacings 60,80,80)
    },
    why: 'the magnitude increments collapse 0.124 -> 0.079 -- saturation, not divergence.',
  },
  {
    id: 'imp97538-delta-ratio-rises-and-stays-below-one',
    holds: () =>
      IMP97538_DELTA_RATIO_40STEP_EQUIV > 0.771 &&
      IMP97538_DELTA_RATIO_40STEP_EQUIV < 1 &&
      IMP97538_DELTA_RATIO_80STEP > 0 &&
      IMP97538_DELTA_RATIO_80STEP < 1,
    why: 'the 40-step-equivalent delta ratio RISES 0.771 -> 0.829, past the imp-97513 0.771 and still below 1, so the tail is convergent but has NOT plateaued.',
  },
  {
    id: 'imp97538-upper-edge-tightens-past-imp97513',
    holds: () =>
      IMP97538_FLOOR.upperEdgeTightened === true &&
      IMP97538_FLOOR.directMeasuredKbig720 < IMP97538_FLOOR.imp97513DirectEdgeKbig500,
    why: 'the direct Kbig=720 value -310.692227 tightens the imp-97513 Kbig=500 upper edge -310.375499.',
  },
  {
    id: 'imp97538-corrected-tail-deepens',
    holds: () =>
      IMP97538_FLOOR.correctedGeometricTailEstimate < IMP97538_FLOOR.imp97513CorrectedTailEstimate &&
      IMP97538_FLOOR.correctedGeometricTailEstimate > IMP97538_FLOOR.powerSaturationEstimate,
    why: 'the corrected-tail central estimate deepens -310.75 -> -310.87 but stays shallower than the power refit -313.756.',
  },
  {
    id: 'imp97538-a2-trace-converges',
    holds: () => {
      const t = IMP97538_A2_TRACE_BY_KBIG;
      const ks = [500, 560, 640, 720];
      let prevDelta = Infinity;
      for (let i = 1; i < ks.length; i++) {
        const d = t[ks[i]] - t[ks[i - 1]];
        if (!(d > 0 && d < prevDelta)) return false; // positive, shrinking deltas -> convergence
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments past Kbig=500 -> the reproducing kernel keeps converging toward ~4819.1M.',
  },
  {
    id: 'imp97538-floor-stays-far-below-required',
    holds: () =>
      IMP97538_FLOOR.diverges === false &&
      IMP97538_FLOOR.saturates === true &&
      IMP97538_FLOOR.tightenedBracket[0] < IMP97538_FLOOR.tightenedBracket[1] &&
      IMP97538_FLOOR.tightenedBracket[1] < IMP97538_REQUIRED_RHO_EXCEEDS,
    why: 'the directly-built upper edge tightens and the floor bracket stays four orders below the required 0.581059.',
  },
  {
    id: 'imp97538-measurement-only-no-qed',
    holds: () =>
      IMP97538_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97538_VERDICT.operatorPositivityProved === false &&
      IMP97538_VERDICT.boundMoves === false &&
      IMP97538_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97538_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97538_BINDING_2A - LN3) < 1e-12 &&
      IMP97538_VERDICT.qed === false,
    why: 'measurement only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97538_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97538-krein-route2-kbig560-720-deep-floor assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
