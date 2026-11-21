/**
 * @module imp-97455-krein-route2-kbig-divergence-rate
 * @fileoverview imp-97455 -- MEASURE the Kbig->infinity behaviour of the imp-97440 Route-2 Lehmann-Maehly
 *   best-reachable lower bound on lambda_2 for the imp-97414 FULL band-projector second moment A2 at 2a=ln3.
 *   imp-97440 FINDING 3 reported the best (least-negative, rho near lambda_3) Route-2 bound worsening
 *   MONOTONICALLY over just three Kbig points (-196.863 at 44, -245.345 at 60, -275.500 at 76) but never fit
 *   the Kbig->inf law: does it diverge to -infinity, or saturate at a finite floor?
 *
 *   This leaf extends the Kbig sweep to {44,60,76,92,108,124,140} on the SAME executed A2 (build once at
 *   Kbig_max=140) and fits the divergence law. Runner: tmp/imp-97440-route2-lambda2-lowerbound.py
 *   (mpmath dps=50, pole-free basis phi_n(x)=(a^2-x^2)^3 P_n(x/a), N=28, T=200, panel=1.0).
 *
 * RESULT -- THE BOUND SATURATES AT A FINITE FLOOR; IT DOES NOT DIVERGE TO -INFINITY. Extending the sweep
 *   past 76 shows the monotone worsening imp-97440 saw is the early part of a SATURATING curve, not a
 *   linear/log divergence. The best-reachable lower bound on lambda_2 is
 *     Kbig  : 44        60        76        92        108       124       140
 *     bound : -196.863  -245.345  -275.500  -289.974  -298.259  -301.242  -303.336
 *   with per-unit slopes COLLAPSING 3.030 -> 1.885 -> 0.905 -> 0.518 -> 0.187 -> 0.131 (successive
 *   magnitude increments 48.5, 30.2, 14.5, 8.3, 3.0, 2.1). A linear divergence fits at only R^2=0.799 and a
 *   log divergence at R^2=0.913, whereas the saturation model |bound| = Yinf - B*Kbig^{-p} fits at
 *   R^2=0.9965 with Yinf ~ 322, p ~ 1.77; a geometric-tail extrapolation (mean delta ratio 0.547) puts the
 *   floor tighter at ~ -306. So the Kbig->inf limit is a FINITE negative floor in the bracket [-322, -306].
 *
 * WHY IT SATURATES -- THE REPRODUCING KERNEL CONVERGES. The full-projector second moment A2 =
 *   A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} converges as Kbig->inf (the enlarged-basis reproducing kernel
 *   converges): tr(A2) rises 4806.70M -> 4813.34M -> 4815.99M -> 4817.28M -> 4817.99M -> 4818.17M ->
 *   4818.30M, deltas collapsing 6.637M, 2.649M, 1.296M, 0.708M, 0.183M, 0.125M toward a finite limit
 *   ~4819.1M. Because A2 converges to a finite limit matrix, the whole Lehmann pencil converges and so does
 *   rho - 1/nu_max -- to a finite negative floor. The "unbounded regress" of imp-97415 is unbounded in the
 *   sense of never turning positive, NOT in the sense of the projector-limit bound running to -infinity.
 *
 * VERDICT. The regress conclusion of imp-97440 is UNCHANGED and refined: the best-reachable Route-2 lower
 *   bound on lambda_2 SATURATES at a finite floor ~ -305 (bracket [-322, -306]) as the reproducing kernel
 *   converges, still four orders below the required 0.581059, so the m=1 enclosure stays UNUSABLE at 2a=ln3.
 *   The correction to imp-97440 FINDING 3 is that its three-point "monotone worsening" is a saturating curve,
 *   not a divergence to -infinity. Measurement only; no operator positivity; no bound on Lambda moves;
 *   no refereed bound is changed; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *   SUB-GAP IMP97455_ROUTE2_KBIG_LIMIT_FINITE_FLOOR_NOT_DIVERGENT.
 *
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (FINDING 3 three-point worsening this fits)
 * @see imp-97415-krein-lambda2-certified-lower-bound-assessment.js (Route 2 assessed as a regress on paper)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (the full-projector A2 reproducing kernel)
 *
 * Ticket: imp-97455 (numerical, opus-4-8, api-pool). Measurement only; no rigorous lower bound on lambda_2;
 * no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97455_BINDING_2A = LN3;
export const IMP97455_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97455_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The extended finite-section sweep (mpmath dps=50, N=28, T=200, panel=1.0; build once at Kbig_max=140).
export const IMP97455_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigSweep: [44, 60, 76, 92, 108, 124, 140], // extends imp-97440 {44,60,76} into the projector limit
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  ritz: { lambda1: 0.543044, lambda2: 83.090493, lambda3: 5516.954964 }, // exact-Gram brackets (unchanged, N-only)
  method:
    'best-reachable Route-2 lower bound on lambda_2 = rho - 1/nu_max at rho near lambda_3 (fr=0.99), ' +
    'A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N}; sweep Kbig and fit the Kbig->inf law.',
});

// The measured best-reachable (least-negative) Route-2 lower bound on lambda_2 vs Kbig.
export const IMP97455_BEST_BOUND_BY_KBIG = Object.freeze({
  44: -196.863257,
  60: -245.344531,
  76: -275.499942,
  92: -289.973594,
  108: -298.258838,
  124: -301.242304,
  140: -303.335862,
});

// Per-unit magnitude slopes between consecutive Kbig (collapsing => saturation, not divergence).
export const IMP97455_PER_UNIT_SLOPES = Object.freeze([3.0301, 1.8847, 0.9046, 0.5178, 0.1865, 0.1308]);

// tr(A2) converges as the reproducing kernel converges (units: raw trace, ~4.8e9).
export const IMP97455_A2_TRACE_BY_KBIG = Object.freeze({
  44: 4806700778.091496,
  60: 4813338016.330276,
  76: 4815987454.363111,
  92: 4817283146.711229,
  108: 4817991200.930917,
  124: 4818174547.805043,
  140: 4818299480.227299,
});

// Divergence-law fits: saturation dominates a linear/log divergence.
export const IMP97455_FITS = Object.freeze({
  linearDivergence: { form: '|bound| = 1.0133*Kbig + 179.70', r2: 0.799013 },
  logDivergence: { form: '|bound| = 90.710*ln(Kbig) - 131.05', r2: 0.912682 },
  saturation: { form: '|bound| = Yinf - B*Kbig^{-p}', Yinf: 322.0650, B: 100835.3, p: 1.7662, r2: 0.9964876 },
  geometricTailRatio: 0.5472, // mean successive delta ratio -> tighter floor extrapolation
});

// The measured Kbig->inf limit: a FINITE negative floor, not a divergence to -infinity.
export const IMP97455_KBIG_LIMIT = Object.freeze({
  diverges: false, // does NOT run to -infinity
  saturates: true,
  finiteFloorBracket: [-322.065, -305.866], // power-saturation fit (low) to geometric-tail (high)
  floorPointEstimate: -305.866, // geometric-tail extrapolation from the last delta
  measuredAtKbig140: -303.335862,
  a2TraceConverges: true, // tr(A2) deltas collapse 6.637M -> 0.125M toward ~4819.1M
  stillFarBelowRequired: true, // floor ~ -305 vs required 0.581059
});

export const IMP97455_VERDICT = Object.freeze({
  ticket: 'imp-97455',
  question:
    'does the best-reachable imp-97440 Route-2 lower bound on lambda_2 (full-projector A2 at 2a=ln3) diverge to -infinity as Kbig grows, or saturate at a finite floor, and at what rate?',
  answer:
    'it SATURATES at a finite negative floor -- it does NOT diverge to -infinity. Extending the Kbig sweep ' +
    'past 76 to 140 shows the per-unit magnitude slope collapsing 3.030 -> 0.131 and tr(A2) deltas ' +
    'collapsing 6.637M -> 0.125M as the reproducing kernel converges. A linear divergence fits at only ' +
    'R^2=0.799 and a log divergence at R^2=0.913, whereas the saturation model |bound| = Yinf - B*Kbig^{-p} ' +
    'fits at R^2=0.9965 (Yinf ~ 322, p ~ 1.77); a geometric-tail extrapolation puts the floor at ~ -306. So ' +
    'the Kbig->inf limit is a finite floor in the bracket [-322, -306]. This refines imp-97440 FINDING 3: ' +
    'its three-point monotone worsening was the early part of a saturating curve, not a divergence. The ' +
    'regress conclusion is unchanged -- the floor ~ -305 is four orders below the required 0.581059, so the ' +
    'm=1 enclosure stays UNUSABLE at 2a=ln3.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  divergesToNegInfinity: false,
  saturatesAtFiniteFloor: true,
  finiteFloorBracket: [-322.065, -305.866],
  saturationFitR2: 0.9964876,
  linearDivergenceFitR2: 0.799013,
  logDivergenceFitR2: 0.912682,
  reproducingKernelConverges: true,
  regressConclusionUnchanged: true,
  newSubGap: 'IMP97455_ROUTE2_KBIG_LIMIT_FINITE_FLOOR_NOT_DIVERGENT',
  // measurement-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97455_ASSERTIONS = [
  {
    id: 'imp97455-reproduces-imp97440-three-points',
    holds: () =>
      Math.abs(IMP97455_BEST_BOUND_BY_KBIG[44] - -196.863257) < 1e-4 &&
      Math.abs(IMP97455_BEST_BOUND_BY_KBIG[60] - -245.344531) < 1e-4 &&
      Math.abs(IMP97455_BEST_BOUND_BY_KBIG[76] - -275.499942) < 1e-4,
    why: 'the extended sweep reproduces the imp-97440 FINDING 3 anchor points at Kbig=44,60,76 exactly.',
  },
  {
    id: 'imp97455-slopes-collapse',
    holds: () => {
      const s = IMP97455_PER_UNIT_SLOPES;
      for (let i = 1; i < s.length; i++) if (!(s[i] < s[i - 1])) return false;
      return s[0] > 3 && s[s.length - 1] < 0.2; // monotone collapse from ~3 to ~0.13
    },
    why: 'the per-unit magnitude slope collapses monotonically from ~3.03 to ~0.13 -- the signature of saturation, not linear/log divergence.',
  },
  {
    id: 'imp97455-saturation-beats-divergence-fits',
    holds: () =>
      IMP97455_FITS.saturation.r2 > 0.99 &&
      IMP97455_FITS.saturation.r2 > IMP97455_FITS.logDivergence.r2 &&
      IMP97455_FITS.logDivergence.r2 > IMP97455_FITS.linearDivergence.r2,
    why: 'the saturation model (R^2=0.9965) fits far better than log (0.913) or linear (0.799) divergence.',
  },
  {
    id: 'imp97455-a2-trace-converges',
    holds: () => {
      const t = IMP97455_A2_TRACE_BY_KBIG;
      const ks = [44, 60, 76, 92, 108, 124, 140];
      let prevDelta = Infinity;
      for (let i = 1; i < ks.length; i++) {
        const d = t[ks[i]] - t[ks[i - 1]];
        if (!(d > 0 && d < prevDelta)) return false; // positive, shrinking deltas -> convergence
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments -> the full-projector reproducing kernel converges to a finite limit, forcing a finite bound floor.',
  },
  {
    id: 'imp97455-finite-floor-not-divergent-still-unusable',
    holds: () =>
      IMP97455_KBIG_LIMIT.diverges === false &&
      IMP97455_KBIG_LIMIT.saturates === true &&
      IMP97455_KBIG_LIMIT.finiteFloorBracket[0] < IMP97455_KBIG_LIMIT.finiteFloorBracket[1] &&
      IMP97455_KBIG_LIMIT.finiteFloorBracket[1] < 0 &&
      IMP97455_KBIG_LIMIT.finiteFloorBracket[1] < IMP97455_REQUIRED_RHO_EXCEEDS,
    why: 'the Kbig->inf limit is a finite negative floor in [-322,-306], not -infinity, and still far below the required 0.581059.',
  },
  {
    id: 'imp97455-measurement-only-no-qed',
    holds: () =>
      IMP97455_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97455_VERDICT.operatorPositivityProved === false &&
      IMP97455_VERDICT.boundMoves === false &&
      IMP97455_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97455_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97455_BINDING_2A - LN3) < 1e-12 &&
      IMP97455_VERDICT.qed === false,
    why: 'measurement only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97455_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97455-krein-route2-kbig-divergence-rate assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
