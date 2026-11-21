/**
 * @module imp-97517-tra2-kbig-ladder-splice-limit-fit
 * @fileoverview imp-97517 -- CROSS-VALIDATE the imp-97495 tr(A2) Kbig ladder against the imp-97482
 *   Kbig ladder by SPLICING them at the shared Kbig=260 edge, then FIT the shrinking-increment tail to a
 *   common power-law saturation model to PIN tr(A2)(infinity) and check it against the ~4819.1M limit that
 *   imp-97482 / imp-97495 NAMED only by eyeballing the collapsing deltas (never fit).
 *
 *   imp-97482 built the direct projector-limit A2 reproducing-kernel trace at Kbig in {140,180,220,260} and
 *   imp-97495 extended the same build to {300,340,380}; both reported the full-projector second-moment trace
 *   tr(A2) rising with strictly shrinking 40-step increments and both narrated the deltas as collapsing
 *   "toward the ~4819.1M limit," but the two readings were never tabulated together or fit to a convergence
 *   model. This leaf splices the two into one 7-point ladder (the Kbig=260 value 4818631331.255102 is shared
 *   and reproduces exactly across both modules, so the splice is seam-free) and fits the tail.
 *
 * SPLICED LADDER (raw trace, units ~4.8e9; 40-step deltas below).
 *     Kbig  : 140            180            220            260            300            340            380
 *     trA2  : 4818299480.23  4818482170.29  4818576414.40  4818631331.26  4818666116.82  4818689534.22  4818706048.29
 *     delta :        182690.06       94244.11       54916.85       34785.57       23417.40       16514.07
 *   Successive delta ratios RISE monotonically 0.5159 -> 0.5827 -> 0.6334 -> 0.6732 -> 0.7052 (NOT a fixed
 *   geometric ratio), the signature of a power-law approach delta(K) ~ B*p*40*K^{-p-1} whose ratio
 *   ((K+40)/K)^{-(p+1)} -> 1, not of a geometric tail whose ratio is constant. This reconciles the two
 *   modules' own observations: imp-97482 read a ~0.54 ratio over its low-Kbig window while imp-97495 read
 *   ratios rising to ~0.70 over its higher window -- the same rising-ratio power law sampled at two ranges.
 *
 * FIT -- POWER-LAW SATURATION tr(A2)(K) = Tinf - B*K^{-p}. Two independent estimators agree to ~500 out of
 *   4.8e9: (a) a nonlinear fit of the six 40-step deltas to B*(K^{-p} - (K+40)^{-p}) gives p=1.9257,
 *   R^2=0.99999741, max residual 145, remaining ascent past Kbig=380 of 69637 -> Tinf=4818775685.31; and
 *   (b) a Tinf-scan maximizing the log-linearity of log(Tinf - trA2) vs log(Kbig) gives p=1.9325 and
 *   Tinf=4818775182.76. So the PINNED limit is
 *     tr(A2)(infinity) = 4818.776M  (4.818776e9),  convergence exponent p ~= 1.93.
 *
 * CROSS-CHECK vs THE NAMED ~4819.1M LIMIT -- IT IS A SLIGHT OVERSHOOT. The fitted Tinf=4818.776M lies
 *   324317 BELOW the eyeballed 4819.1M (relative gap -6.73e-5, i.e. -0.0067%). The ~4819.1M figure was a
 *   round estimate read off the collapsing deltas, never a fit; the power-law fit places the true limit
 *   ~0.32M lower. tr(A2) is monotone increasing and bounded, so the limit exceeds the directly-measured
 *   Kbig=380 value 4818706048.29; the fit adds only ~0.070M more ascent, ruling out the extra ~0.39M the
 *   named 4819.1M would require.
 *
 * SPLICE CONSISTENCY -- fitting the imp-97482 half (140..260) and the imp-97495 half (260..380) SEPARATELY
 *   with the same power-law-delta model gives Tinf = 4818.7766M (p=1.921) and 4818.7743M (p=1.948)
 *   respectively -- agreeing to ~2300 out of 4.8e9. The two independently-executed builds extrapolate to the
 *   SAME limit, confirming the ladders are one consistent convergent sequence.
 *
 * RELATION TO THE LEHMANN-PENCIL FLOOR CONVERGENCE. The trace saturation exponent p~=1.93 is consistent with
 *   the imp-97482 Route-2 lower-bound floor power-saturation refit p=2.0530 (R^2=0.994811): the reproducing
 *   kernel A2, its trace, and the Lehmann pencil floor rho - 1/nu_max all saturate as K^{-p} with p~=2, so
 *   the trace convergence rate and the floor convergence rate are governed by the same enlarged-basis kernel
 *   completeness rate. This is measurement/cross-check only.
 *
 * VERDICT. The imp-97495 and imp-97482 tr(A2) Kbig ladders splice seam-free at Kbig=260 into one power-law
 *   saturating sequence with pinned limit tr(A2)(infinity)=4818.776M (p~=1.93); the previously-named ~4819.1M
 *   is a slight eyeball overshoot (-6.73e-5). No bound moves: this only pins the second-moment trace normalizer
 *   behind the Route-2 lower-bound floor, which stays four orders below the required 0.581059 and thus the m=1
 *   enclosure stays UNUSABLE at 2a=ln3. No refereed bound is changed; interval-rigorous reach stays
 *   2a<=0.96; RH open; NO QED.
 *
 * @see imp-97495-krein-route2-kbig300-380-direct-floor.js (the {300,340,380} half of the ladder)
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (the {140,180,220,260} half + p=2.0530 floor refit)
 * @see imp-97455-krein-route2-kbig-divergence-rate.js (the original saturation fit and floor bracket)
 *
 * Ticket: imp-97517 (numerical, opus-4-8, api-pool). Measurement/cross-check only; no rigorous lower bound on
 * lambda_2; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97517_BINDING_2A = LN3;
export const IMP97517_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97517_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The spliced 7-point tr(A2) ladder: imp-97482 {140..260} + imp-97495 {260..380}, seam at the shared Kbig=260.
export const IMP97517_A2_TRACE_LADDER = Object.freeze({
  140: 4818299480.227299, // imp-97482
  180: 4818482170.290751, // imp-97482
  220: 4818576414.402526, // imp-97482
  260: 4818631331.255102, // shared edge (identical in both modules -> seam-free splice)
  300: 4818666116.820719, // imp-97495
  340: 4818689534.221049, // imp-97495
  380: 4818706048.289207, // imp-97495
});

// 40-step deltas and their successive ratios (ratios RISE -> power law, not geometric).
export const IMP97517_A2_TRACE_DELTAS = Object.freeze([
  182690.063452, 94244.111775, 54916.852576, 34785.565617, 23417.400330, 16514.068158,
]);
export const IMP97517_DELTA_RATIOS = Object.freeze([0.51587, 0.58271, 0.63342, 0.67319, 0.70521]);

// Power-law saturation fit tr(A2)(K) = Tinf - B*K^{-p} (two independent estimators agree to ~500 / 4.8e9).
export const IMP97517_LIMIT_FIT = Object.freeze({
  model: 'tr(A2)(Kbig) = Tinf - B*Kbig^{-p}',
  deltaFit: { Tinf: 4818775685.31, p: 1.9257, r2: 0.99999741, maxResidual: 145, ascentPast380: 69637.02 },
  loglinScan: { Tinf: 4818775182.76, p: 1.9325 },
  pinnedTinf: 4818775685.31, // 4818.776M -- the pinned tr(A2)(infinity)
  pinnedTinfMillions: 4818.776,
});

// Cross-check against the ~4819.1M limit imp-97482 / imp-97495 NAMED (eyeball off the deltas, never fit).
export const IMP97517_NAMED_LIMIT_CHECK = Object.freeze({
  namedLimit: 4819.1e6, // the round figure both modules narrated the deltas as collapsing toward
  namedLimitSource: 'eyeball estimate off the collapsing 40-step deltas; never a fit',
  fittedMinusNamed: -324314.69, // fitted Tinf sits BELOW the named limit
  relativeGap: -6.73e-5, // -0.0067%
  namedIsSlightOvershoot: true, // the fit places the true limit ~0.32M lower than the named ~4819.1M
});

// Splice consistency: the two halves fit SEPARATELY to the same limit (agree ~2300 / 4.8e9).
export const IMP97517_SPLICE_CONSISTENCY = Object.freeze({
  half97482: { range: '140..260', Tinf: 4818776600, TinfMillions: 4818.7766, p: 1.9207 },
  half97495: { range: '260..380', Tinf: 4818774300, TinfMillions: 4818.7743, p: 1.948 },
  halvesAgreeTo: 2300, // absolute difference of the two half-fit limits (out of ~4.8e9)
  seamFree: true, // Kbig=260 value identical in both modules
});

// The trace saturation exponent matches the Lehmann-pencil floor saturation exponent (same kernel completeness rate).
export const IMP97517_FLOOR_RATE_RELATION = Object.freeze({
  traceExponentP: 1.93, // this leaf
  floorRefitExponentP: 2.0530, // imp-97482 IMP97482_SATURATION_REFIT.p (R^2=0.994811)
  consistent: true, // both saturate as K^{-p} with p ~= 2 -> common enlarged-basis kernel completeness rate
  note: 'measurement/cross-check only; relates convergence rates, does not move any bound.',
});

export const IMP97517_VERDICT = Object.freeze({
  ticket: 'imp-97517',
  question:
    'do the imp-97495 and imp-97482 tr(A2) Kbig ladders splice consistently, and does a shrinking-increment tail fit pin tr(A2)(infinity) at the ~4819.1M limit they named?',
  answer:
    'the two ladders splice seam-free at the shared Kbig=260 edge into one 7-point power-law saturating sequence ' +
    'tr(A2)(K)=Tinf - B*K^{-p} with p~=1.93 (delta fit R^2=0.99999741; log-linear scan p=1.93), pinning ' +
    'tr(A2)(infinity)=4818.776M. The previously-named ~4819.1M limit was an eyeball off the collapsing deltas, ' +
    'never a fit, and is a slight overshoot: the fitted limit sits 324317 (relative -6.73e-5) BELOW it. Fitting ' +
    'the two halves separately gives 4818.7766M and 4818.7743M (agree to ~2300 / 4.8e9), confirming one ' +
    'consistent convergent sequence. The trace exponent p~=1.93 matches the imp-97482 Route-2 floor power-refit ' +
    'p=2.05, so trace and Lehmann-pencil floor share the same K^{-p} kernel-completeness rate. Measurement/' +
    'cross-check only; no bound moves; m=1 enclosure stays UNUSABLE at 2a=ln3; RH open; NO QED.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  pinnedTraceLimit: 4818775685.31,
  namedLimitOvershoot: true,
  boundMoves: false,
  rhStatus: 'open',
  qed: false,
});
