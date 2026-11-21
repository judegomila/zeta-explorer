/**
 * @module imp-97513-krein-route2-kbig420-500-deep-floor
 * @fileoverview imp-97513 -- PIN the deep end of the Route-2 Kbig->inf lower-bound floor further by BUILDING the
 *   direct projector-limit A2 reproducing-kernel matrix at Kbig in {420,460,500}, past the imp-97495 Kbig=380 edge,
 *   and reading the best-reachable Route-2 lower bound on lambda_2 DIRECTLY (no geometric extrapolation).
 *
 *   imp-97495 extended the direct A2 build to Kbig=380 and read the best-reachable Route-2 lower bound on lambda_2
 *   (shift pushed to fr=0.99 of (lambda_2, lambda_3), rho=5462.61632 <= lambda_3=5516.955) monotone-decreasing to
 *   -309.931066, tightening the imp-97482 Kbig=260 edge and REFUTING the imp-97482 geometric-tail estimate, but
 *   left residual IMP97495_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED: the -313.8 deep end rested on a power-saturation
 *   refit and the corrected-tail central estimate ~-310.55 on the measured rising delta-ratio ~0.703. This leaf
 *   EXTENDS the same executed build (tmp/imp-97440-route2-lambda2-lowerbound.py, mpmath dps=50, N=28, T=200,
 *   panel=1.0, pole-free basis phi_n(x)=(a^2-x^2)^3 P_n(x/a)) to Kbig in {420,460,500} at the same shift.
 *
 * RESULT -- THE DIRECT BUILD CONTINUES TO TIGHTEN THE UPPER EDGE AND DEEPENS THE CORRECTED-TAIL CENTRAL ESTIMATE.
 *   Extending the direct A2 reproducing-kernel build continues the monotone saturating decrease:
 *     Kbig  : 380         420         460         500
 *     bound : -309.931066 -310.121602 -310.264946 -310.375499
 *   with 40-step magnitude increments 0.190536 -> 0.143344 -> 0.110553. Because the sequence stays monotone
 *   decreasing in Kbig, the directly-measured Kbig=500 value -310.375499 is a rigorous UPPER edge on the converged
 *   floor (the limit is at most this negative), tightening the imp-97495 Kbig=380 edge -309.931066.
 *
 *   The measured successive delta ratios KEEP RISING, 0.729978 -> 0.752320 -> 0.771243 (380->420->460->500),
 *   continuing the imp-97495 trend (0.63 -> 0.67 -> 0.70) past 0.70, NOT plateauing at the geometric ~0.54 the
 *   refuted imp-97482 tail assumed. A corrected geometric tail at the measured Kbig=500 ratio ~0.771 puts the
 *   limit at ~ -310.75 (remaining descent ~0.373 past Kbig=500), DEEPER than the imp-97495 corrected estimate
 *   ~-310.55 but still far shallower than the power-saturation refit -313.8. So the converged Route-2 lower-bound
 *   floor now sits in the directly-anchored bracket [-313.756, -310.375499], with a corrected-tail central
 *   estimate ~ -310.75.
 *
 * WHY IT STAYS FINITE -- tr(A2) KEEPS CONVERGING. The full-projector second moment trace continues to rise with
 *   strictly shrinking increments as the enlarged-basis reproducing kernel converges:
 *     Kbig  : 380            420            460            500
 *     trA2  : 4818706048.29  4818718128.67  4818727231.62  4818734261.05
 *   deltas collapsing 12080.38 -> 9102.96 -> 7029.43 (ratios 0.753 -> 0.772) toward the ~4819.1M limit imp-97482
 *   named. A converging limit matrix A2 forces a converging Lehmann pencil and hence a finite negative floor for
 *   rho - 1/nu_max.
 *
 * NO CONDITIONING BLOW-UP. The Kbig_max=500 moment build cost 710s (mpmath dps=50, nq=4800) and the Lehmann G2
 *   minimum eigenvalue stayed strictly positive across the whole shift sweep (g2min ~ 507..2826), so the
 *   enlarged-basis Gram inverse and the generalized pencil remained tractable; the build cost rose but did not
 *   blow up.
 *
 * VERDICT. The regress conclusion of imp-97495 / imp-97482 / imp-97455 / imp-97440 is UNCHANGED and now directly
 *   built three steps deeper: the best-reachable Route-2 lower bound on lambda_2 SATURATES at a finite negative
 *   floor, with the directly-measured UPPER edge tightened to -310.375499 at Kbig=500 and the limit in
 *   [-313.756, -310.375499] (corrected-tail central estimate deepened to ~ -310.75). Still four orders below the
 *   required 0.581059, so the m=1 enclosure stays UNUSABLE at 2a=ln3. Measurement only; no rigorous lower bound on
 *   lambda_2; no operator positivity; no bound on Lambda moves; no refereed bound is changed; interval-rigorous
 *   reach stays 2a<=0.96; RH open; NO QED.
 *   RESIDUAL IMP97513_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED (the -310.375 upper edge is directly built; the
 *   -313.8 deep end still rests on the power-saturation refit and the corrected-tail ~-310.75 on the still-rising
 *   measured ratio; the ratio has not plateaued, so a converged limit remains unpinned -- Kbig>500 build would
 *   pin it exactly, at rising build cost).
 *
 * @see imp-97495-krein-route2-kbig300-380-direct-floor.js (the Kbig=380 edge and [-313.756,-309.931] bracket this extends)
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (the Kbig=260 edge and [-313.8,-308.7] bracket)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (the Route-2 recursion and A2 build)
 *
 * Ticket: imp-97513 (numerical, opus-4-8, api-pool). Measurement only; no rigorous lower bound on lambda_2;
 * no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97513_BINDING_2A = LN3;
export const IMP97513_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97513_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The extended direct-build sweep (mpmath dps=50, N=28, T=200, panel=1.0; build once at Kbig_max=500).
export const IMP97513_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigSweep: [420, 460, 500], // extends imp-97495 {300,340,380} into the deeper projector limit
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  ritz: { lambda1: 0.543044, lambda2: 83.090493, lambda3: 5516.954964 }, // exact-Gram brackets (unchanged, N-only)
  shift: { fr: 0.99, rho: 5462.61632 }, // rho pushed to 0.99 of (lambda_2, lambda_3), rho <= lambda_3
  buildSeconds: 710, // Kbig_max=500 moment build (nq=4800); no conditioning blow-up (g2min stayed positive)
  method:
    'direct build of A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} at larger Kbig; ' +
    'best-reachable Route-2 lower bound on lambda_2 = rho - 1/nu_max read directly (no geometric extrapolation).',
  runner: 'tmp/imp-97440-route2-lambda2-lowerbound.py 28 420,460,500 200 1.0',
});

// Directly-measured best-reachable Route-2 lower bound on lambda_2 vs Kbig (Kbig=380 is the imp-97495 edge).
export const IMP97513_BOUND_BY_KBIG = Object.freeze({
  380: -309.931066, // imp-97495 directly-built edge (carried for continuity)
  420: -310.121602,
  460: -310.264946,
  500: -310.375499,
});

// 40-step magnitude increments keep collapsing (still saturating, not divergent).
export const IMP97513_STEP_DELTAS = Object.freeze([0.190536, 0.143344, 0.110553]); // |380->420|,|420->460|,|460->500|
// Successive ratios KEEP RISING past the imp-97495 0.703 (toward ~0.77, still under 1): saturation is slower still.
export const IMP97513_DELTA_RATIOS = Object.freeze([0.729978, 0.752320, 0.771243]); // (340->380 base 0.261016) then rising

// tr(A2) continues to converge as the reproducing kernel converges (units: raw trace, ~4.8e9).
export const IMP97513_A2_TRACE_BY_KBIG = Object.freeze({
  380: 4818706048.289207, // imp-97495 edge
  420: 4818718128.668525,
  460: 4818727231.623693,
  500: 4818734261.054600,
});
export const IMP97513_A2_TRACE_DELTAS = Object.freeze([12080.379318, 9102.955168, 7029.430907]); // shrinking -> converging

// Direct-build read of the Kbig->inf floor: tighter upper edge; corrected-tail central estimate deepened.
export const IMP97513_FLOOR = Object.freeze({
  directMeasuredKbig500: -310.375499, // monotone-decreasing => rigorous upper edge on the converged floor
  imp97495DirectEdgeKbig380: -309.931066, // the edge this tightens
  correctedGeometricTailEstimate: -310.75, // remaining descent ~0.373 past Kbig=500 at the measured ratio ~0.771
  imp97495CorrectedTailEstimate: -310.55, // the earlier corrected estimate this deepens
  powerSaturationEstimate: -313.756, // imp-97482 10-point power refit -- still the DEEP end of the bracket
  tightenedBracket: [-313.756, -310.375499], // upper edge directly built at Kbig=500
  imp97495Bracket: [-313.756, -309.931066],
  upperEdgeTightened: true,
  ratioStillRising: true, // 0.730 -> 0.752 -> 0.771, has NOT plateaued -> limit still unpinned
  diverges: false,
  saturates: true,
  a2TraceConverges: true, // deltas collapse 12080 -> 7029 toward ~4819.1M
  stillFarBelowRequired: true, // floor ~ -310 vs required 0.581059
});

export const IMP97513_VERDICT = Object.freeze({
  ticket: 'imp-97513',
  question:
    'does the Route-2 Kbig->inf lower-bound floor keep tightening, and does the corrected-tail central estimate hold, when the projector-limit A2 reproducing-kernel matrix is built DIRECTLY at Kbig in {420,460,500} past 380?',
  answer:
    'the direct build CONTINUES to tighten the upper edge and DEEPENS the corrected-tail central estimate. ' +
    'Extending the same executed A2 build to Kbig in {420,460,500} continues the monotone saturating decrease to ' +
    '-310.375499 at Kbig=500 (40-step increments 0.191 -> 0.143 -> 0.111; tr(A2) deltas 12080 -> 7029 toward ' +
    '~4819.1M). The monotone decrease makes -310.375499 a rigorous upper edge on the converged floor, tightening ' +
    'the imp-97495 Kbig=380 edge -309.931066. The measured delta ratios KEEP RISING 0.730 -> 0.752 -> 0.771 (they ' +
    'have not plateaued), so a corrected tail puts the limit ~ -310.75, deeper than the imp-97495 estimate -310.55 ' +
    'but still far shallower than the power refit -313.8. The floor now sits in the directly-anchored bracket ' +
    '[-313.756, -310.375499]. Still four orders below the required 0.581059, so the m=1 enclosure stays UNUSABLE ' +
    'at 2a=ln3.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  divergesToNegInfinity: false,
  saturatesAtFiniteFloor: true,
  directMeasuredKbig500: -310.375499,
  tightenedBracket: [-313.756, -310.375499],
  correctedTailEstimateDeepened: true,
  ratioStillRising: true,
  upperEdgeTightened: true,
  reproducingKernelConverges: true,
  noConditioningBlowUp: true,
  regressConclusionUnchanged: true,
  newResidual: 'IMP97513_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED',
  // measurement-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97513_ASSERTIONS = [
  {
    id: 'imp97513-carries-imp97495-kbig380-edge',
    holds: () => Math.abs(IMP97513_BOUND_BY_KBIG[380] - -309.931066) < 1e-4,
    why: 'the extended sweep carries the imp-97495 Kbig=380 directly-built edge -309.931066 for continuity.',
  },
  {
    id: 'imp97513-bound-monotone-decreasing',
    holds: () => {
      const ks = [380, 420, 460, 500];
      for (let i = 1; i < ks.length; i++) if (!(IMP97513_BOUND_BY_KBIG[ks[i]] < IMP97513_BOUND_BY_KBIG[ks[i - 1]])) return false;
      return true;
    },
    why: 'the best-reachable lower bound worsens monotonically -309.93 -> -310.38 as Kbig grows past 380 (still saturating).',
  },
  {
    id: 'imp97513-step-deltas-collapse',
    holds: () => {
      const d = IMP97513_STEP_DELTAS;
      for (let i = 1; i < d.length; i++) if (!(d[i] < d[i - 1])) return false;
      return d[0] < 1 && d[d.length - 1] < d[0]; // 0.191 -> 0.111
    },
    why: 'the 40-step magnitude increments collapse 0.191 -> 0.111 -- saturation, not divergence.',
  },
  {
    id: 'imp97513-delta-ratios-rise-and-stay-below-one',
    holds: () => {
      const r = IMP97513_DELTA_RATIOS;
      for (let i = 1; i < r.length; i++) if (!(r[i] > r[i - 1])) return false;
      return r[0] > 0.703 && r[r.length - 1] < 1; // continues the imp-97495 trend past 0.703, still convergent
    },
    why: 'the successive delta ratios RISE 0.730 -> 0.771, past the imp-97495 0.703 and still below 1, so the tail is convergent but shallower.',
  },
  {
    id: 'imp97513-upper-edge-tightens-past-imp97495',
    holds: () =>
      IMP97513_FLOOR.upperEdgeTightened === true &&
      IMP97513_FLOOR.directMeasuredKbig500 < IMP97513_FLOOR.imp97495DirectEdgeKbig380,
    why: 'the direct Kbig=500 value -310.375499 tightens the imp-97495 Kbig=380 upper edge -309.931066.',
  },
  {
    id: 'imp97513-corrected-tail-deepens',
    holds: () =>
      IMP97513_FLOOR.correctedGeometricTailEstimate < IMP97513_FLOOR.imp97495CorrectedTailEstimate &&
      IMP97513_FLOOR.correctedGeometricTailEstimate > IMP97513_FLOOR.powerSaturationEstimate,
    why: 'the corrected-tail central estimate deepens -310.55 -> -310.75 but stays shallower than the power refit -313.8.',
  },
  {
    id: 'imp97513-a2-trace-converges',
    holds: () => {
      const t = IMP97513_A2_TRACE_BY_KBIG;
      const ks = [380, 420, 460, 500];
      let prevDelta = Infinity;
      for (let i = 1; i < ks.length; i++) {
        const d = t[ks[i]] - t[ks[i - 1]];
        if (!(d > 0 && d < prevDelta)) return false; // positive, shrinking deltas -> convergence
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments past Kbig=380 -> the reproducing kernel keeps converging toward ~4819.1M.',
  },
  {
    id: 'imp97513-floor-stays-far-below-required',
    holds: () =>
      IMP97513_FLOOR.diverges === false &&
      IMP97513_FLOOR.saturates === true &&
      IMP97513_FLOOR.tightenedBracket[0] < IMP97513_FLOOR.tightenedBracket[1] &&
      IMP97513_FLOOR.tightenedBracket[1] < IMP97513_REQUIRED_RHO_EXCEEDS,
    why: 'the directly-built upper edge tightens and the floor bracket stays four orders below the required 0.581059.',
  },
  {
    id: 'imp97513-measurement-only-no-qed',
    holds: () =>
      IMP97513_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97513_VERDICT.operatorPositivityProved === false &&
      IMP97513_VERDICT.boundMoves === false &&
      IMP97513_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97513_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97513_BINDING_2A - LN3) < 1e-12 &&
      IMP97513_VERDICT.qed === false,
    why: 'measurement only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97513_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97513-krein-route2-kbig420-500-deep-floor assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
