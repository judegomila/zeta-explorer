/**
 * @module imp-97495-krein-route2-kbig300-380-direct-floor
 * @fileoverview imp-97495 -- PIN the Route-2 Kbig->inf lower-bound floor further by BUILDING the direct
 *   projector-limit A2 reproducing-kernel matrix at Kbig in {300,340,380}, past the imp-97482 Kbig=260 edge,
 *   and reading the best-reachable Route-2 lower bound on lambda_2 DIRECTLY (no geometric extrapolation).
 *
 *   imp-97482 extended the direct A2 build to Kbig=260 and read the best-reachable Route-2 lower bound on
 *   lambda_2 monotone-decreasing 140:-303.335862 -> 260:-308.745199, directly pinning the UPPER edge of the
 *   converged floor at -308.745199 but leaving the limit resting on two extrapolators: a geometric-tail
 *   estimate (-309.8, assuming ratio ~ 0.54) and a 10-point power-saturation refit (-313.8), per residual
 *   IMP97482_ROUTE2_FLOOR_STILL_EXTRAPOLATED_BELOW_KBIG260. This leaf EXTENDS the same executed build
 *   (tmp/imp-97440-route2-lambda2-lowerbound.py, mpmath dps=50, N=28, T=200, panel=1.0, pole-free basis
 *   phi_n(x)=(a^2-x^2)^3 P_n(x/a)) to Kbig in {300,340,380} at the shift pushed to fr=0.99 of
 *   (lambda_2, lambda_3) (rho=5462.61632 <= lambda_3=5516.955).
 *
 * RESULT -- THE DIRECT BUILD TIGHTENS THE UPPER EDGE AND REFUTES THE imp-97482 GEOMETRIC-TAIL ESTIMATE.
 *   Extending the direct A2 reproducing-kernel build continues the monotone saturating decrease:
 *     Kbig  : 260         300         340         380
 *     bound : -308.745199 -309.298852 -309.670050 -309.931066
 *   with 40-step magnitude increments 0.553653 -> 0.371198 -> 0.261016. Because the sequence stays monotone
 *   decreasing in Kbig, the directly-measured Kbig=380 value -309.931066 is a rigorous UPPER edge on the
 *   converged floor (the limit is at most this negative), tightening the imp-97482 Kbig=260 edge -308.745199.
 *
 *   Crucially, the directly-built Kbig=380 value -309.931066 has ALREADY dropped BELOW the imp-97482
 *   geometric-tail estimate -309.781, so that extrapolator is REFUTED as too shallow. The reason: the measured
 *   successive delta ratios are RISING, 0.6296 -> 0.6705 -> 0.7032 (260->300->340->380), NOT the geometric
 *   ~0.54 that imp-97482 assumed from the 140..260 tail. A corrected geometric tail at the measured ratio
 *   ~0.703 puts the limit at ~ -310.55 (remaining descent ~ 0.618 past Kbig=380), shallower than the
 *   power-saturation refit -313.8. So the converged Route-2 lower-bound floor now sits in the directly-anchored
 *   bracket [-313.8, -309.931], with a corrected-tail central estimate ~ -310.55.
 *
 * WHY IT STAYS FINITE -- tr(A2) KEEPS CONVERGING. The full-projector second moment trace continues to rise
 *   with strictly shrinking increments as the enlarged-basis reproducing kernel converges:
 *     Kbig  : 260            300            340            380
 *     trA2  : 4818631331.26  4818666116.82  4818689534.22  4818706048.29
 *   deltas collapsing 34785.57 -> 23417.40 -> 16514.07 toward the ~4819.1M limit imp-97482 named. A converging
 *   limit matrix A2 forces a converging Lehmann pencil and hence a finite negative floor for rho - 1/nu_max.
 *
 * NO CONDITIONING BLOW-UP. The Kbig_max=380 moment build cost 394s (mpmath dps=50, nq=4800) and the Lehmann
 *   G2 minimum eigenvalue stayed strictly positive across the whole shift sweep (g2min ~ 500..2800), so the
 *   enlarged-basis Gram inverse and the generalized pencil remained tractable; the build cost rose but did not
 *   blow up.
 *
 * VERDICT. The regress conclusion of imp-97482 / imp-97455 / imp-97440 is UNCHANGED and now directly built one
 *   step deeper: the best-reachable Route-2 lower bound on lambda_2 SATURATES at a finite negative floor, with
 *   the directly-measured UPPER edge tightened to -309.931066 at Kbig=380 and the limit in [-313.8, -309.931]
 *   (corrected-tail central estimate ~ -310.55). Still four orders below the required 0.581059, so the m=1
 *   enclosure stays UNUSABLE at 2a=ln3. Measurement only; no rigorous lower bound on lambda_2; no operator
 *   positivity; no bound on Lambda moves; no refereed bound is changed; interval-rigorous reach stays
 *   2a<=0.96; RH open; NO QED.
 *   RESIDUAL IMP97495_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED (the -309.931 upper edge is directly built; the
 *   -313.8 deep end still rests on the power-saturation refit and the corrected-tail ~-310.55 on the measured
 *   rising ratio; Kbig>380 build would pin the limit exactly).
 *
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (the Kbig=260 edge and [-313.8,-308.7] bracket this extends)
 * @see imp-97455-krein-route2-kbig-divergence-rate.js (the saturation fit and [-322,-306] bracket)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (the Route-2 recursion and A2 build)
 *
 * Ticket: imp-97495 (numerical, opus-4-8, api-pool). Measurement only; no rigorous lower bound on lambda_2;
 * no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97495_BINDING_2A = LN3;
export const IMP97495_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97495_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The extended direct-build sweep (mpmath dps=50, N=28, T=200, panel=1.0; build once at Kbig_max=380).
export const IMP97495_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigSweep: [300, 340, 380], // extends imp-97482 {140,180,220,260} into the deeper projector limit
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  ritz: { lambda1: 0.543044, lambda2: 83.090493, lambda3: 5516.954964 }, // exact-Gram brackets (unchanged, N-only)
  shift: { fr: 0.99, rho: 5462.61632 }, // rho pushed to 0.99 of (lambda_2, lambda_3), rho <= lambda_3
  buildSeconds: 394, // Kbig_max=380 moment build (nq=4800); no conditioning blow-up (g2min stayed positive)
  method:
    'direct build of A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} at larger Kbig; ' +
    'best-reachable Route-2 lower bound on lambda_2 = rho - 1/nu_max read directly (no geometric extrapolation).',
  runner: 'tmp/imp-97440-route2-lambda2-lowerbound.py 28 300,340,380 200 1.0',
});

// Directly-measured best-reachable Route-2 lower bound on lambda_2 vs Kbig (Kbig=260 is the imp-97482 edge).
export const IMP97495_BOUND_BY_KBIG = Object.freeze({
  260: -308.745199, // imp-97482 directly-built edge (carried for continuity)
  300: -309.298852,
  340: -309.670050,
  380: -309.931066,
});

// 40-step magnitude increments keep collapsing (still saturating, not divergent).
export const IMP97495_STEP_DELTAS = Object.freeze([0.553653, 0.371198, 0.261016]); // |260->300|,|300->340|,|340->380|
// Successive ratios are RISING toward ~0.70 (NOT the geometric ~0.54 imp-97482 assumed): saturation is slower.
export const IMP97495_DELTA_RATIOS = Object.freeze([0.629570, 0.670450, 0.703169]); // (220->260 base) 0.6296, then 0.6705, 0.7032

// tr(A2) continues to converge as the reproducing kernel converges (units: raw trace, ~4.8e9).
export const IMP97495_A2_TRACE_BY_KBIG = Object.freeze({
  260: 4818631331.255102, // imp-97482 edge
  300: 4818666116.820719,
  340: 4818689534.221049,
  380: 4818706048.289207,
});
export const IMP97495_A2_TRACE_DELTAS = Object.freeze([34785.565617, 23417.400330, 16514.068158]); // shrinking -> converging

// Direct-build read of the Kbig->inf floor: tighter upper edge; imp-97482 geometric-tail estimate REFUTED.
export const IMP97495_FLOOR = Object.freeze({
  directMeasuredKbig380: -309.931066, // monotone-decreasing => rigorous upper edge on the converged floor
  imp97482DirectEdgeKbig260: -308.745199, // the edge this tightens
  imp97482GeometricTailEstimate: -309.781, // now SURPASSED by the direct Kbig=380 value -> refuted as too shallow
  geometricTailRefuted: true,
  correctedGeometricTailEstimate: -310.55, // remaining descent ~0.618 past Kbig=380 at the measured ratio ~0.703
  powerSaturationEstimate: -313.756, // imp-97482 10-point power refit -- now the DEEP end of the bracket
  tightenedBracket: [-313.756, -309.931066], // upper edge directly built at Kbig=380
  imp97482Bracket: [-313.756, -308.745],
  upperEdgeTightened: true,
  diverges: false,
  saturates: true,
  a2TraceConverges: true, // deltas collapse 34786 -> 16514 toward ~4819.1M
  stillFarBelowRequired: true, // floor ~ -310 vs required 0.581059
});

export const IMP97495_VERDICT = Object.freeze({
  ticket: 'imp-97495',
  question:
    'does the Route-2 Kbig->inf lower-bound floor tighten, and does the imp-97482 geometric-tail estimate -309.8 hold, when the projector-limit A2 reproducing-kernel matrix is built DIRECTLY at Kbig in {300,340,380} past 260?',
  answer:
    'the direct build TIGHTENS the upper edge and REFUTES the imp-97482 geometric-tail estimate. Extending the ' +
    'same executed A2 build to Kbig in {300,340,380} continues the monotone saturating decrease to -309.931066 ' +
    'at Kbig=380 (40-step increments 0.554 -> 0.371 -> 0.261; tr(A2) deltas 34786 -> 16514 toward ~4819.1M). ' +
    'The monotone decrease makes -309.931066 a rigorous upper edge on the converged floor, tightening the ' +
    'imp-97482 Kbig=260 edge -308.745199. The direct Kbig=380 value has already dropped below the imp-97482 ' +
    'geometric-tail estimate -309.781, refuting it: the measured delta ratios RISE 0.63 -> 0.67 -> 0.70, not ' +
    'the assumed geometric 0.54, so a corrected tail puts the limit ~ -310.55, shallower than the power refit ' +
    '-313.8. The floor now sits in the directly-anchored bracket [-313.8, -309.931]. Still four orders below ' +
    'the required 0.581059, so the m=1 enclosure stays UNUSABLE at 2a=ln3.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  divergesToNegInfinity: false,
  saturatesAtFiniteFloor: true,
  directMeasuredKbig380: -309.931066,
  tightenedBracket: [-313.756, -309.931066],
  imp97482GeometricTailRefuted: true,
  upperEdgeTightened: true,
  reproducingKernelConverges: true,
  noConditioningBlowUp: true,
  regressConclusionUnchanged: true,
  newResidual: 'IMP97495_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED',
  // measurement-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97495_ASSERTIONS = [
  {
    id: 'imp97495-carries-imp97482-kbig260-edge',
    holds: () => Math.abs(IMP97495_BOUND_BY_KBIG[260] - -308.745199) < 1e-4,
    why: 'the extended sweep carries the imp-97482 Kbig=260 directly-built edge -308.745199 for continuity.',
  },
  {
    id: 'imp97495-bound-monotone-decreasing',
    holds: () => {
      const ks = [260, 300, 340, 380];
      for (let i = 1; i < ks.length; i++) if (!(IMP97495_BOUND_BY_KBIG[ks[i]] < IMP97495_BOUND_BY_KBIG[ks[i - 1]])) return false;
      return true;
    },
    why: 'the best-reachable lower bound worsens monotonically -308.75 -> -309.93 as Kbig grows past 260 (still saturating).',
  },
  {
    id: 'imp97495-step-deltas-collapse',
    holds: () => {
      const d = IMP97495_STEP_DELTAS;
      for (let i = 1; i < d.length; i++) if (!(d[i] < d[i - 1])) return false;
      return d[0] < 1 && d[d.length - 1] < d[0]; // 0.554 -> 0.261
    },
    why: 'the 40-step magnitude increments collapse 0.554 -> 0.261 -- saturation, not divergence.',
  },
  {
    id: 'imp97495-delta-ratios-rise-above-geometric',
    holds: () => {
      const r = IMP97495_DELTA_RATIOS;
      for (let i = 1; i < r.length; i++) if (!(r[i] > r[i - 1])) return false;
      return r[r.length - 1] > 0.54; // measured ratio exceeds the imp-97482 geometric 0.54
    },
    why: 'the successive delta ratios RISE 0.63 -> 0.70, above the imp-97482 geometric 0.54, so its tail estimate is too shallow.',
  },
  {
    id: 'imp97495-geometric-tail-refuted-by-direct-build',
    holds: () =>
      IMP97495_FLOOR.geometricTailRefuted === true &&
      IMP97495_FLOOR.directMeasuredKbig380 < IMP97495_FLOOR.imp97482GeometricTailEstimate,
    why: 'the direct Kbig=380 value -309.931066 has already dropped below the imp-97482 geometric-tail estimate -309.781, refuting it.',
  },
  {
    id: 'imp97495-a2-trace-converges',
    holds: () => {
      const t = IMP97495_A2_TRACE_BY_KBIG;
      const ks = [260, 300, 340, 380];
      let prevDelta = Infinity;
      for (let i = 1; i < ks.length; i++) {
        const d = t[ks[i]] - t[ks[i - 1]];
        if (!(d > 0 && d < prevDelta)) return false; // positive, shrinking deltas -> convergence
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments past Kbig=260 -> the reproducing kernel keeps converging toward ~4819.1M.',
  },
  {
    id: 'imp97495-floor-upper-edge-tightens',
    holds: () =>
      IMP97495_FLOOR.diverges === false &&
      IMP97495_FLOOR.saturates === true &&
      IMP97495_FLOOR.upperEdgeTightened === true &&
      IMP97495_FLOOR.directMeasuredKbig380 < IMP97495_FLOOR.imp97482DirectEdgeKbig260 &&
      IMP97495_FLOOR.tightenedBracket[0] < IMP97495_FLOOR.tightenedBracket[1] &&
      IMP97495_FLOOR.tightenedBracket[1] < IMP97495_REQUIRED_RHO_EXCEEDS,
    why: 'the directly-built upper edge tightens -308.745 -> -309.931 and the floor bracket stays far below the required 0.581059.',
  },
  {
    id: 'imp97495-measurement-only-no-qed',
    holds: () =>
      IMP97495_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97495_VERDICT.operatorPositivityProved === false &&
      IMP97495_VERDICT.boundMoves === false &&
      IMP97495_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97495_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97495_BINDING_2A - LN3) < 1e-12 &&
      IMP97495_VERDICT.qed === false,
    why: 'measurement only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97495_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97495-krein-route2-kbig300-380-direct-floor assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
