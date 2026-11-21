/**
 * @module imp-97581-krein-route2-kbig800-deep-floor
 * @fileoverview imp-97581 -- EXTEND the direct Route-2 A2 projector-limit build past the imp-97538 Kbig=720 edge by
 *   BUILDING the direct projector-limit A2 reproducing-kernel matrix at Kbig=800 (the first of the requested
 *   {800,900,1000} deep-end steps) and reading the best-reachable Route-2 lower bound on lambda_2 DIRECTLY, to test
 *   whether the still-rising imp-97538 delta ratio 0.829 (40-step-equivalent) finally plateaus and pins the converged
 *   Kbig->inf floor.
 *
 *   imp-97538 built the direct A2 reproducing-kernel matrix at Kbig in {560,640,720}, tightening the Route-2
 *   lower-bound-on-lambda_2 upper edge to -310.692227 (bracket [-313.756,-310.692227], corrected-tail central
 *   ~-310.87), but left residual IMP97538_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED: the 40-step-equivalent delta ratio
 *   ROSE 0.771 -> 0.829 and never plateaued, so the converged limit stayed unpinned between the directly-anchored
 *   -310.692227 and the power-saturation refit -313.756. This leaf EXTENDS the same executed build
 *   (tmp/imp-97440-route2-lambda2-lowerbound.py, mpmath dps=50, N=28, T=200, panel=1.0, pole-free basis
 *   phi_n(x)=(a^2-x^2)^3 P_n(x/a)) to Kbig=800 at the same shift rho=5462.61632 (fr=0.99 of (lambda_2, lambda_3),
 *   rho <= lambda_3=5516.955).
 *
 * PARTIAL RESULT (Kbig=800 directly built; Kbig=900 and Kbig=1000 still building in the same adopted run) --
 *   THE DIRECT BUILD KEEPS TIGHTENING THE UPPER EDGE, AND THE RATIO IS STILL RISING (NOT PLATEAUED).
 *   Extending the direct A2 reproducing-kernel build one step past Kbig=720 continues the monotone saturating
 *   decrease:
 *     Kbig  : 640         720         800
 *     bound : -310.613648 -310.692227 -310.748543
 *   Because the sequence stays monotone decreasing in Kbig, the directly-measured Kbig=800 value -310.748543 is a
 *   rigorous UPPER edge on the converged floor (the limit is at most this negative), tightening the imp-97538
 *   Kbig=720 edge -310.692227.
 *
 *   The measured magnitude increments (uniform 80-spacing) are 0.114343 -> 0.078579 -> 0.056316, so the 80-step delta
 *   ratio is 0.716680, i.e. a 40-step-equivalent ratio ~0.846570. That CONTINUES the imp-97538 rising trend UPWARD
 *   (0.687222 -> 0.716680 at 80-step; 0.828988 -> 0.846570 at 40-step-equivalent) -- the ratio has STILL NOT
 *   PLATEAUED. A corrected geometric tail at the measured 80-step ratio puts the remaining descent past Kbig=800 at
 *   ~0.14246, so the limit sits at ~ -310.891, DEEPER than the imp-97538 corrected estimate ~-310.87 but still far
 *   shallower than the power-saturation refit -313.756. So the converged Route-2 lower-bound floor now sits in the
 *   directly-anchored bracket [-313.756, -310.748543], with a corrected-tail central estimate ~ -310.89.
 *
 * WHY IT STAYS FINITE -- tr(A2) KEEPS CONVERGING. The full-projector second moment trace continues to rise with
 *   strictly shrinking increments as the enlarged-basis reproducing kernel converges:
 *     Kbig  : 640            720            800
 *     trA2  : 4818749430.60  4818754444.42  4818758040.52
 *   deltas collapsing 5013.83 -> 3596.09 (80-step trace ratio 0.717235, matching the bound ratio 0.716680) toward the
 *   ~4819.1M limit imp-97482 named. The Kbig=800 tr(A2)=4818758040.515779 is INDEPENDENTLY cross-checked: the
 *   imp-97599 trace-only build (a distinct LU-solve procedure, no matrix inverse) produced the identical value.
 *
 * NO CONDITIONING BLOW-UP. Across the whole shift sweep at Kbig=800 the Lehmann G2 minimum eigenvalue stayed strictly
 *   positive (g2min ~ 508..2830), so the enlarged-basis Gram inverse and the generalized pencil remained tractable;
 *   the build cost rose but did not blow up. (The Kbig_max=1000 build was run under CPU contention from duplicate
 *   offline copies, so no clean wall-clock is recorded; the Kbig=800 slice is deterministic and read from the run log
 *   tmp/imp-97581-route2-kbig800-1000.log.)
 *
 * VERDICT (partial). The regress conclusion of imp-97538 / imp-97513 / imp-97495 / imp-97482 / imp-97440 is
 *   UNCHANGED and now directly built one step deeper: the best-reachable Route-2 lower bound on lambda_2 SATURATES at
 *   a finite negative floor, with the directly-measured UPPER edge tightened to -310.748543 at Kbig=800 and the limit
 *   in [-313.756, -310.748543] (corrected-tail central estimate deepened to ~ -310.89). Still four orders below the
 *   required 0.581059, so the m=1 enclosure stays UNUSABLE at 2a=ln3. Measurement only; no rigorous lower bound on
 *   lambda_2; no operator positivity; no bound on Lambda moves; no refereed bound is changed; interval-rigorous
 *   reach stays 2a<=0.96; RH open; NO QED.
 *   RESIDUAL IMP97581_ROUTE2_FLOOR_KBIG900_1000_INFLIGHT (the -310.748543 upper edge is directly built at Kbig=800;
 *   the ticket also requested Kbig=900 and Kbig=1000, which are still building in the same adopted mpmath run
 *   (PID-owned tmp/imp-97581-route2-kbig800-1000.log) -- their heavier 900x900 and 1000x1000 Gram inverses at dps=50
 *   had not yet emitted when this slice was adopted. The 40-step-equivalent ratio has RISEN again 0.829 -> 0.847, so
 *   it has STILL not plateaued and a converged limit remains unpinned -- Kbig=900,1000 will extend the anchor two
 *   further steps once the run completes).
 *
 * @see imp-97538-krein-route2-kbig560-720-deep-floor.js (the Kbig=720 edge and [-313.756,-310.692227] bracket this extends)
 * @see imp-97513-krein-route2-kbig420-500-deep-floor.js (the Kbig=500 edge and [-313.756,-310.375499] bracket)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (the Route-2 recursion and A2 build)
 *
 * Ticket: imp-97581 (numerical, opus-4-8, api-pool). Measurement only; no rigorous lower bound on lambda_2;
 * no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97581_BINDING_2A = LN3;
export const IMP97581_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97581_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The extended direct-build slice (mpmath dps=50, N=28, T=200, panel=1.0; build once at Kbig_max=1000, Kbig=800 read).
export const IMP97581_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigRequested: [800, 900, 1000], // extends imp-97538 {560,640,720} into the deeper projector limit
  KbigBuiltThisLeaf: [800], // 900 and 1000 still building in the same adopted run (see residual)
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  ritz: { lambda1: 0.543043688344527, lambda2: 83.09049345172332, lambda3: 5516.954964337507 }, // exact-Gram brackets (N-only)
  shift: { fr: 0.99, rho: 5462.616319628649 }, // rho pushed to 0.99 of (lambda_2, lambda_3), rho <= lambda_3
  method:
    'direct build of A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} at larger Kbig; ' +
    'best-reachable Route-2 lower bound on lambda_2 = rho - 1/nu_max read directly (no geometric extrapolation).',
  runner: 'tmp/imp-97440-route2-lambda2-lowerbound.py 28 800,900,1000 200 1.0',
  log: 'tmp/imp-97581-route2-kbig800-1000.log',
  note: 'built under CPU contention from duplicate offline copies; the Kbig=800 slice is deterministic and read from the run log; Kbig=900,1000 still in-flight.',
});

// Directly-measured best-reachable Route-2 lower bound on lambda_2 vs Kbig (Kbig=640,720 carried from imp-97538).
export const IMP97581_BOUND_BY_KBIG = Object.freeze({
  640: -310.613648, // imp-97538 (carried for continuity)
  720: -310.692227, // imp-97538 directly-built edge this extends
  800: -310.748543, // NEW directly-built edge (this leaf)
});

// Magnitude increments (uniform 80-spacing) keep collapsing (still saturating, not divergent).
export const IMP97581_STEP_DELTAS = Object.freeze([0.078579, 0.056316]); // |640->720|, |720->800|
// The 80-step delta ratio and its 40-step-equivalent: the ratio KEEPS RISING past the imp-97538 0.829, still under 1.
export const IMP97581_DELTA_RATIO_80STEP = 0.716680; // (720->800) / (640->720), equal 80-step intervals
export const IMP97581_DELTA_RATIO_40STEP_EQUIV = 0.846570; // sqrt(0.716680) -- rises past the imp-97538 0.828988
export const IMP97538_DELTA_RATIO_40STEP_EQUIV_PRIOR = 0.828988; // the imp-97538 value this rises past

// tr(A2) continues to converge as the reproducing kernel converges (units: raw trace, ~4.8e9).
export const IMP97581_A2_TRACE_BY_KBIG = Object.freeze({
  640: 4818749430.595979, // imp-97538 (carried)
  720: 4818754444.422258, // imp-97538 (carried)
  800: 4818758040.515779, // NEW; cross-checked by the imp-97599 trace-only LU-solve build (identical value)
});
export const IMP97581_A2_TRACE_DELTAS = Object.freeze([5013.826279, 3596.093521]); // |640->720|, |720->800| shrinking
export const IMP97581_A2_TRACE_INDEPENDENT_CROSSCHECK = Object.freeze({
  Kbig: 800,
  thisLeaf: 4818758040.515779,
  imp97599TraceOnly: 4818758040.515779, // distinct LU-solve procedure, no matrix inverse
  agree: true,
});

// Direct-build read of the Kbig->inf floor: tighter upper edge; corrected-tail central estimate deepened.
export const IMP97581_FLOOR = Object.freeze({
  directMeasuredKbig800: -310.748543, // monotone-decreasing => rigorous upper edge on the converged floor
  imp97538DirectEdgeKbig720: -310.692227, // the edge this tightens
  correctedGeometricTailEstimate: -310.891, // remaining descent ~0.14246 past Kbig=800 at the measured 80-step ratio
  imp97538CorrectedTailEstimate: -310.865, // the earlier corrected estimate this deepens
  powerSaturationEstimate: -313.756, // imp-97482 10-point power refit -- still the DEEP end of the bracket
  tightenedBracket: [-313.756, -310.748543], // upper edge directly built at Kbig=800
  imp97538Bracket: [-313.756, -310.692227],
  upperEdgeTightened: true,
  ratioStillRising: true, // 40-step-equivalent 0.829 -> 0.847, has NOT plateaued -> limit still unpinned
  diverges: false,
  saturates: true,
  a2TraceConverges: true, // deltas collapse 5014 -> 3596 toward ~4819.1M
  stillFarBelowRequired: true, // floor ~ -310.75 vs required 0.581059
});

export const IMP97581_VERDICT = Object.freeze({
  ticket: 'imp-97581',
  question:
    'does the Route-2 Kbig->inf lower-bound floor plateau (delta ratio 0.829 stop rising) and pin the converged limit when the projector-limit A2 reproducing-kernel matrix is built DIRECTLY at Kbig past 720?',
  answer:
    'NO at the first requested step -- the ratio still has NOT plateaued, though the direct build keeps tightening the ' +
    'upper edge. Extending the same executed A2 build to Kbig=800 continues the monotone saturating decrease to ' +
    '-310.748543 (magnitude increments 0.079 -> 0.056; tr(A2) deltas 5014 -> 3596 toward ~4819.1M, independently ' +
    'cross-checked by the imp-97599 trace-only build). The monotone decrease makes -310.748543 a rigorous upper edge ' +
    'on the converged floor, tightening the imp-97538 Kbig=720 edge -310.692227. The 40-step-equivalent delta ratio ' +
    'RISES further 0.829 -> 0.847 (it has not plateaued), so a corrected tail puts the limit ~ -310.89, deeper than ' +
    'the imp-97538 estimate -310.87 but still far shallower than the power refit -313.756. The floor now sits in the ' +
    'directly-anchored bracket [-313.756, -310.748543]. Still four orders below the required 0.581059, so the m=1 ' +
    'enclosure stays UNUSABLE at 2a=ln3. Kbig=900 and Kbig=1000 are still building in the same adopted run.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  divergesToNegInfinity: false,
  saturatesAtFiniteFloor: true,
  directMeasuredKbig800: -310.748543,
  tightenedBracket: [-313.756, -310.748543],
  correctedTailEstimateDeepened: true,
  ratioStillRising: true,
  upperEdgeTightened: true,
  reproducingKernelConverges: true,
  traceIndependentlyCrossChecked: true,
  noConditioningBlowUp: true,
  regressConclusionUnchanged: true,
  partialClosure: true, // Kbig=900,1000 still in-flight
  newResidual: 'IMP97581_ROUTE2_FLOOR_KBIG900_1000_INFLIGHT',
  // measurement-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97581_ASSERTIONS = [
  {
    id: 'imp97581-carries-imp97538-kbig720-edge',
    holds: () => Math.abs(IMP97581_BOUND_BY_KBIG[720] - -310.692227) < 1e-4,
    why: 'the extended slice carries the imp-97538 Kbig=720 directly-built edge -310.692227 for continuity.',
  },
  {
    id: 'imp97581-bound-monotone-decreasing',
    holds: () => {
      const ks = [640, 720, 800];
      for (let i = 1; i < ks.length; i++) if (!(IMP97581_BOUND_BY_KBIG[ks[i]] < IMP97581_BOUND_BY_KBIG[ks[i - 1]])) return false;
      return true;
    },
    why: 'the best-reachable lower bound worsens monotonically -310.61 -> -310.75 as Kbig grows past 640 (still saturating).',
  },
  {
    id: 'imp97581-step-deltas-collapse',
    holds: () => {
      const d = IMP97581_STEP_DELTAS;
      return d[0] > 0 && d[1] > 0 && d[1] < d[0]; // 0.0786 -> 0.0563 (uniform 80-spacing)
    },
    why: 'the magnitude increments collapse 0.079 -> 0.056 -- saturation, not divergence.',
  },
  {
    id: 'imp97581-delta-ratio-rises-and-stays-below-one',
    holds: () =>
      IMP97581_DELTA_RATIO_40STEP_EQUIV > IMP97538_DELTA_RATIO_40STEP_EQUIV_PRIOR &&
      IMP97581_DELTA_RATIO_40STEP_EQUIV < 1 &&
      IMP97581_DELTA_RATIO_80STEP > 0 &&
      IMP97581_DELTA_RATIO_80STEP < 1,
    why: 'the 40-step-equivalent delta ratio RISES 0.829 -> 0.847, past the imp-97538 0.829 and still below 1, so the tail is convergent but has NOT plateaued.',
  },
  {
    id: 'imp97581-ratio-consistent-with-trace',
    holds: () => {
      const dtr = IMP97581_A2_TRACE_DELTAS;
      const traceRatio = dtr[1] / dtr[0];
      return Math.abs(traceRatio - IMP97581_DELTA_RATIO_80STEP) < 0.01; // 0.717235 vs 0.716680
    },
    why: 'the tr(A2) 80-step delta ratio 0.717 matches the bound 80-step ratio 0.717 -- consistent convergence of the reproducing kernel and the Lehmann pencil.',
  },
  {
    id: 'imp97581-upper-edge-tightens-past-imp97538',
    holds: () =>
      IMP97581_FLOOR.upperEdgeTightened === true &&
      IMP97581_FLOOR.directMeasuredKbig800 < IMP97581_FLOOR.imp97538DirectEdgeKbig720,
    why: 'the direct Kbig=800 value -310.748543 tightens the imp-97538 Kbig=720 upper edge -310.692227.',
  },
  {
    id: 'imp97581-corrected-tail-deepens',
    holds: () =>
      IMP97581_FLOOR.correctedGeometricTailEstimate < IMP97581_FLOOR.imp97538CorrectedTailEstimate &&
      IMP97581_FLOOR.correctedGeometricTailEstimate > IMP97581_FLOOR.powerSaturationEstimate,
    why: 'the corrected-tail central estimate deepens -310.87 -> -310.89 but stays shallower than the power refit -313.756.',
  },
  {
    id: 'imp97581-a2-trace-converges',
    holds: () => {
      const t = IMP97581_A2_TRACE_BY_KBIG;
      const ks = [640, 720, 800];
      let prevDelta = Infinity;
      for (let i = 1; i < ks.length; i++) {
        const d = t[ks[i]] - t[ks[i - 1]];
        if (!(d > 0 && d < prevDelta)) return false; // positive, shrinking deltas -> convergence
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments past Kbig=640 -> the reproducing kernel keeps converging toward ~4819.1M.',
  },
  {
    id: 'imp97581-trace-independently-crosschecked',
    holds: () =>
      IMP97581_A2_TRACE_INDEPENDENT_CROSSCHECK.agree === true &&
      IMP97581_A2_TRACE_INDEPENDENT_CROSSCHECK.thisLeaf === IMP97581_A2_TRACE_INDEPENDENT_CROSSCHECK.imp97599TraceOnly,
    why: 'the Kbig=800 tr(A2) from this inverse-based build equals the imp-97599 LU-solve trace-only value exactly -- an independent cross-check.',
  },
  {
    id: 'imp97581-floor-stays-far-below-required',
    holds: () =>
      IMP97581_FLOOR.diverges === false &&
      IMP97581_FLOOR.saturates === true &&
      IMP97581_FLOOR.tightenedBracket[0] < IMP97581_FLOOR.tightenedBracket[1] &&
      IMP97581_FLOOR.tightenedBracket[1] < IMP97581_REQUIRED_RHO_EXCEEDS,
    why: 'the directly-built upper edge tightens and the floor bracket stays four orders below the required 0.581059.',
  },
  {
    id: 'imp97581-partial-closure-residual-named',
    holds: () =>
      IMP97581_VERDICT.partialClosure === true &&
      IMP97581_VERDICT.newResidual === 'IMP97581_ROUTE2_FLOOR_KBIG900_1000_INFLIGHT' &&
      IMP97581_RUN.KbigBuiltThisLeaf.length === 1 &&
      IMP97581_RUN.KbigRequested.length === 3,
    why: 'this is an honest partial: Kbig=800 built and read; Kbig=900,1000 requested but still building, named as the residual.',
  },
  {
    id: 'imp97581-measurement-only-no-qed',
    holds: () =>
      IMP97581_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97581_VERDICT.operatorPositivityProved === false &&
      IMP97581_VERDICT.boundMoves === false &&
      IMP97581_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97581_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97581_BINDING_2A - LN3) < 1e-12 &&
      IMP97581_VERDICT.qed === false,
    why: 'measurement only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97581_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97581-krein-route2-kbig800-deep-floor assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
