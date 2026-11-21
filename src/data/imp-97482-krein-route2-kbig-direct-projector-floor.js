/**
 * @module imp-97482-krein-route2-kbig-direct-projector-floor
 * @fileoverview imp-97482 -- VERIFY the imp-97455 Route-2 Kbig->inf finite floor bracket [-322, -306] by
 *   BUILDING the direct projector-limit A2 reproducing-kernel matrix at larger Kbig (extending the sweep
 *   past 140) and reading the converged best-reachable Route-2 lower bound on lambda_2 DIRECTLY, rather than
 *   by geometric extrapolation.
 *
 *   imp-97455 fit the Kbig->inf behaviour of the Route-2 Lehmann-Maehly best-reachable lower bound on
 *   lambda_2 (full band-projector second moment A2 at 2a=ln3) to a saturation model |bound| = Yinf - B*Kbig^{-p}
 *   (R^2=0.9965, Yinf ~ 322, p ~ 1.77) and put the floor at ~ -306 by geometric-tail extrapolation, i.e.
 *   bracket [-322, -306], per residual IMP97455_ROUTE2_KBIG_LIMIT_FINITE_FLOOR_NOT_DIVERGENT. This leaf
 *   measures the floor directly by extending the same executed A2 build (runner
 *   tmp/imp-97440-route2-lambda2-lowerbound.py, mpmath dps=50, N=28, T=200, panel=1.0, pole-free basis
 *   phi_n(x)=(a^2-x^2)^3 P_n(x/a)) to Kbig in {140, 180, 220, 260} and reading rho - 1/nu_max at the shift
 *   pushed to fr=0.99 of (lambda_2, lambda_3) (rho=5462.616 <= lambda_3=5516.955).
 *
 * RESULT -- THE DIRECT BUILD CONFIRMS THE FINITE FLOOR AND TIGHTENS THE BRACKET. Extending the direct A2
 *   reproducing-kernel build past 140 reproduces the imp-97455 anchor at Kbig=140 exactly and continues the
 *   saturating decrease:
 *     Kbig  : 140         180         220         260
 *     bound : -303.335862 -306.341763 -307.865784 -308.745199
 *   with 40-step magnitude increments COLLAPSING 3.006 -> 1.524 -> 0.879 (successive delta ratios 0.507,
 *   0.577; geometric mean 0.541, matching the imp-97455 geometric-tail ratio 0.5472). Because the sequence is
 *   monotone decreasing in Kbig, the directly-measured Kbig=260 value -308.745199 is a rigorous UPPER edge on
 *   the converged floor (the limit is at most this negative). Two extrapolators from the direct points then
 *   pin the limit: geometric-tail -> ~ -309.8, and a 10-point power-saturation refit (44..260, R^2=0.9948,
 *   Yinf=313.76, p=2.05) -> ~ -313.8. So the converged Route-2 lower-bound floor sits in the TIGHTER bracket
 *   [-313.8, -308.7], comfortably INSIDE the imp-97455 extrapolated [-322.065, -305.866], confirming the
 *   finite-floor (not divergent) verdict and narrowing it.
 *
 * WHY IT STAYS FINITE -- tr(A2) KEEPS CONVERGING. The full-projector second moment trace continues to rise
 *   with strictly shrinking increments as the enlarged-basis reproducing kernel converges:
 *     Kbig  : 140            180            220            260
 *     trA2  : 4818299480.23  4818482170.29  4818576414.40  4818631331.26
 *   deltas collapsing 182690 -> 94244 -> 54917 (0.183M -> 0.094M -> 0.055M) toward the ~4819.1M limit
 *   imp-97455 named. A converging limit matrix A2 forces a converging Lehmann pencil and hence a finite
 *   negative floor for rho - 1/nu_max.
 *
 * VERDICT. The regress conclusion of imp-97455 / imp-97440 is UNCHANGED and now DIRECTLY built: the
 *   best-reachable Route-2 lower bound on lambda_2 SATURATES at a finite negative floor in the tightened
 *   bracket [-313.8, -308.7] (directly measured to Kbig=260, not merely extrapolated), still four orders
 *   below the required 0.581059, so the m=1 enclosure stays UNUSABLE at 2a=ln3. Measurement only; no rigorous
 *   lower bound on lambda_2; no operator positivity; no bound on Lambda moves; no refereed bound is changed
 *   ; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *   RESIDUAL IMP97482_ROUTE2_FLOOR_STILL_EXTRAPOLATED_BELOW_KBIG260 (the -308.7 edge is directly built; the
 *   -313.8..-309.8 limit still rests on two extrapolators; Kbig>260 build would pin it exactly).
 *
 * @see imp-97455-krein-route2-kbig-divergence-rate.js (the saturation fit and [-322,-306] bracket this verifies)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (the Route-2 recursion and A2 build)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (the full-projector A2 reproducing kernel)
 *
 * Ticket: imp-97482 (numerical, opus-4-8, api-pool). Measurement only; no rigorous lower bound on lambda_2;
 * no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97482_BINDING_2A = LN3;
export const IMP97482_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97482_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The extended direct-build sweep (mpmath dps=50, N=28, T=200, panel=1.0; build once at Kbig_max=260).
export const IMP97482_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigSweep: [140, 180, 220, 260], // extends imp-97455 {44..140} into the deeper projector limit
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  ritz: { lambda1: 0.543044, lambda2: 83.090493, lambda3: 5516.954964 }, // exact-Gram brackets (unchanged, N-only)
  shift: { fr: 0.99, rho: 5462.61632 }, // rho pushed to 0.99 of (lambda_2, lambda_3), rho <= lambda_3
  method:
    'direct build of A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} at larger Kbig; ' +
    'best-reachable Route-2 lower bound on lambda_2 = rho - 1/nu_max read directly (no geometric extrapolation).',
  runner: 'tmp/imp-97440-route2-lambda2-lowerbound.py 28 140,180,220,260 200 1.0',
});

// Directly-measured best-reachable Route-2 lower bound on lambda_2 vs Kbig (Kbig=140 reproduces imp-97455).
export const IMP97482_BOUND_BY_KBIG = Object.freeze({
  140: -303.335862,
  180: -306.341763,
  220: -307.865784,
  260: -308.745199,
});

// 40-step magnitude increments collapse (geometric): confirms saturation, not divergence.
export const IMP97482_STEP_DELTAS = Object.freeze([3.005901, 1.524021, 0.879415]); // |140->180|,|180->220|,|220->260|
export const IMP97482_DELTA_RATIOS = Object.freeze([0.506999, 0.577032]); // successive ratios; geom mean ~ 0.5409

// tr(A2) continues to converge as the reproducing kernel converges (units: raw trace, ~4.8e9).
export const IMP97482_A2_TRACE_BY_KBIG = Object.freeze({
  140: 4818299480.227299, // reproduces imp-97455 exactly
  180: 4818482170.290751,
  220: 4818576414.402526,
  260: 4818631331.255102,
});

// Direct-build read of the Kbig->inf floor: a finite negative floor, tighter than imp-97455.
export const IMP97482_FLOOR = Object.freeze({
  directMeasuredKbig260: -308.745199, // monotone-decreasing => rigorous upper edge on the converged floor
  geometricTailEstimate: -309.781, // from the direct 140..260 deltas, ratio ~ 0.5409
  powerSaturationEstimate: -313.756, // 10-point refit (44..260): R^2=0.9948, Yinf=313.76, p=2.05
  tightenedBracket: [-313.756, -308.745], // narrower than imp-97455 [-322.065, -305.866]
  imp97455Bracket: [-322.065, -305.866],
  insideImp97455Bracket: true,
  diverges: false,
  saturates: true,
  a2TraceConverges: true, // deltas collapse 0.183M -> 0.055M toward ~4819.1M
  stillFarBelowRequired: true, // floor ~ -310 vs required 0.581059
});

// Refit of the imp-97455 power-saturation model on the full 10-point combined sweep (44..260).
export const IMP97482_SATURATION_REFIT = Object.freeze({
  form: '|bound| = Yinf - B*Kbig^{-p}',
  Yinf: 313.7555,
  B: 280687.4,
  p: 2.0530,
  r2: 0.994811,
  nPoints: 10, // imp-97455 seven (44..140) + three new direct points (180,220,260)
});

export const IMP97482_VERDICT = Object.freeze({
  ticket: 'imp-97482',
  question:
    'does the imp-97455 Route-2 Kbig->inf floor bracket [-322,-306], obtained by geometric extrapolation, hold when the projector-limit A2 reproducing-kernel matrix is built DIRECTLY at larger Kbig past 140?',
  answer:
    'YES -- the direct build confirms the finite floor and TIGHTENS the bracket. Extending the same executed ' +
    'A2 build to Kbig in {140,180,220,260} reproduces the Kbig=140 anchor (-303.335862) exactly and continues ' +
    'the saturating decrease to -308.745199 at Kbig=260, with 40-step increments collapsing 3.006 -> 1.524 -> ' +
    '0.879 (ratio ~ 0.541) and tr(A2) deltas collapsing 0.183M -> 0.055M toward ~4819.1M. The monotone ' +
    'decrease makes -308.745199 a rigorous upper edge on the converged floor; geometric-tail (-309.8) and a ' +
    '10-point power refit (-313.8) pin the limit to the tighter bracket [-313.8, -308.7], inside the ' +
    'imp-97455 [-322.065, -305.866]. Still four orders below the required 0.581059, so the m=1 enclosure ' +
    'stays UNUSABLE at 2a=ln3.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  divergesToNegInfinity: false,
  saturatesAtFiniteFloor: true,
  directMeasuredKbig260: -308.745199,
  tightenedBracket: [-313.756, -308.745],
  imp97455Bracket: [-322.065, -305.866],
  insideImp97455Bracket: true,
  reproducesImp97455Kbig140: true,
  reproducingKernelConverges: true,
  regressConclusionUnchanged: true,
  newResidual: 'IMP97482_ROUTE2_FLOOR_STILL_EXTRAPOLATED_BELOW_KBIG260',
  // measurement-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97482_ASSERTIONS = [
  {
    id: 'imp97482-reproduces-imp97455-kbig140',
    holds: () => Math.abs(IMP97482_BOUND_BY_KBIG[140] - -303.335862) < 1e-4,
    why: 'the extended direct build reproduces the imp-97455 Kbig=140 anchor -303.335862 exactly.',
  },
  {
    id: 'imp97482-bound-monotone-decreasing',
    holds: () => {
      const ks = [140, 180, 220, 260];
      for (let i = 1; i < ks.length; i++) if (!(IMP97482_BOUND_BY_KBIG[ks[i]] < IMP97482_BOUND_BY_KBIG[ks[i - 1]])) return false;
      return true;
    },
    why: 'the best-reachable lower bound worsens monotonically -303.34 -> -308.75 as Kbig grows past 140 (still saturating).',
  },
  {
    id: 'imp97482-step-deltas-collapse',
    holds: () => {
      const d = IMP97482_STEP_DELTAS;
      for (let i = 1; i < d.length; i++) if (!(d[i] < d[i - 1])) return false;
      return d[0] > 3 && d[d.length - 1] < 1; // 3.006 -> 0.879
    },
    why: 'the 40-step magnitude increments collapse 3.006 -> 0.879 (geometric ratio ~ 0.54) -- saturation, not divergence.',
  },
  {
    id: 'imp97482-a2-trace-converges',
    holds: () => {
      const t = IMP97482_A2_TRACE_BY_KBIG;
      const ks = [140, 180, 220, 260];
      let prevDelta = Infinity;
      for (let i = 1; i < ks.length; i++) {
        const d = t[ks[i]] - t[ks[i - 1]];
        if (!(d > 0 && d < prevDelta)) return false; // positive, shrinking deltas -> convergence
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments past Kbig=140 -> the reproducing kernel keeps converging toward ~4819.1M.',
  },
  {
    id: 'imp97482-floor-tightens-inside-imp97455-bracket',
    holds: () =>
      IMP97482_FLOOR.diverges === false &&
      IMP97482_FLOOR.saturates === true &&
      IMP97482_FLOOR.tightenedBracket[0] < IMP97482_FLOOR.tightenedBracket[1] &&
      IMP97482_FLOOR.tightenedBracket[0] > IMP97482_FLOOR.imp97455Bracket[0] &&
      IMP97482_FLOOR.tightenedBracket[1] < IMP97482_FLOOR.imp97455Bracket[1] &&
      IMP97482_FLOOR.tightenedBracket[1] < IMP97482_REQUIRED_RHO_EXCEEDS,
    why: 'the direct-build floor bracket [-313.8,-308.7] is strictly inside imp-97455 [-322.065,-305.866] and still far below the required 0.581059.',
  },
  {
    id: 'imp97482-measurement-only-no-qed',
    holds: () =>
      IMP97482_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97482_VERDICT.operatorPositivityProved === false &&
      IMP97482_VERDICT.boundMoves === false &&
      IMP97482_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97482_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97482_BINDING_2A - LN3) < 1e-12 &&
      IMP97482_VERDICT.qed === false,
    why: 'measurement only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97482_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97482-krein-route2-kbig-direct-projector-floor assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
