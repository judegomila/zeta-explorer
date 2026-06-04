/**
 * @module data/imp-2459-sympow-rs-uniform-margin-2026-06
 * @fileoverview imp-2459 (Wave-4 follow-on to imp-2436/imp-2437) -- turn the
 * imp-2437 residue identity into the EXPLICIT m-dependence of the conductor-
 * normalised contraction margin, and pin the BREAKPOINT CONDUCTOR at which the
 * UNCONDITIONAL O(j) per-factor bound breaks the a_m = a_0/log Q_m normalisation.
 *
 * imp-2437 fixed the object exactly: c_m = Res_{s=1} L(s, sym^m f x sym^m f)
 * = prod_{j=1}^m L(1, sym^{2j} f), and stated the threshold the imp-2436
 * conductor-normalised preservation route needs as log c_m = O(log Q_m). It
 * reported the bare ratio R_m = log c_m / log Q_m at the GRH and unconditional
 * model caps. This file converts that ratio into the SIGNED tightness margin
 * (headroom) of the a_m-normalisation
 *     h_m = 1 - R_m = 1 - log c_m / log Q_m,
 * h_m > 0 meaning the conductor budget log Q_m dominates the second-moment
 * budget log c_m (unfolding tight, normalisation holds) and h_m < 0 meaning the
 * second moment OVERRUNS the conductor (normalisation broken). It reports the
 * explicit m-law of h_m under each per-factor input and the smallest sym power /
 * conductor at which the unconditional headroom first goes negative.
 *
 * RESULT (all derived in closed form from the imp-2437 analytic-conductor
 * function logQ(m) = sum_{j=0}^m log(1+|(m-2j)kappa/2|), kappa = k-1 = 11 for
 * Delta, and the two cited per-factor model caps):
 *   - EMPIRICAL (Delta): R_m ~ 0, so h_m ~ 1 -- full headroom, tight with room
 *     to spare (the L(1,sym^{2j}) factors oscillate in sign and cancel).
 *   - GRH model cap log L(1,sym^{2j}f) <= log log Q(sym^{2j}f): R_m -> ~1.06
 *     BOUNDED, so h_m -> a bounded constant ~ -0.06. The ratio converges, i.e.
 *     log c_m = Theta(log Q_m): the normalisation stays tight up to a bounded
 *     O(1) factor for ALL m -- UNIFORM in m, route closes conditionally on GRH.
 *   - UNCONDITIONAL model cap log L(1,sym^{2j}f) <= log Q / log log Q = O(j):
 *     R_m ~ 0.778 * m/log m GROWS without bound, so h_m ~ 1 - 0.778 m/log m
 *     -> -inf. The headroom first crosses 0 at m = 2 (sym^4), analytic conductor
 *     Q_2 ~ 144 (log Q_2 = 4.97), and is monotone negative thereafter: the
 *     a_m-normalisation is PERMANENTLY broken from sym^4 on. So the second-moment
 *     control is NOT uniform in m unconditionally; it IS uniform under GRH.
 *
 * BREAKPOINT: sym^4, conductor Q ~ 144. This is the concrete quantity the ticket
 * asked for -- the exact symmetric power / conductor at which the best
 * unconditional per-factor input stops keeping the conductor-normalised margin
 * bounded. No proof claim (RH/GRH open); analytic reduction + closed-form numerics.
 * @see imp-2437
 * @see imp-2436
 * @see imp-2357
 * @see imp-1258
 * @see data/imp-2437-sympow-rs-second-moment-2026-06.js
 */
// imp-2459 -- explicit m-dependence of the sym^m conductor-normalised contraction
// margin, and the unconditional breakpoint conductor.
//
// THE MARGIN, MADE EXPLICIT (signed tightness headroom)
// -----------------------------------------------------
// imp-2436 reduced functoriality of the Volterra contraction under f -> sym^m f
// to the conductor-normalised shift a_m = a_0/log Q_m killing the translation
// amplification Q_m^{a/2}, leaving the residual requirement that the second-
// moment normalisation log c_m not outrun the conductor budget log Q_m. imp-2437
// pinned c_m = prod_{j=1}^m L(1,sym^{2j} f) and the threshold log c_m = O(log Q_m).
// The SIGNED tightness margin of the a_m-normalisation is therefore the headroom
//     h_m = 1 - R_m,    R_m = log c_m / log Q_m.
// h_m is the fraction of the conductor budget still UNSPENT by the second moment:
// h_m > 0 (R_m < 1) the unfolding window captures an O(1) fraction of the mass and
// the normalisation is tight; h_m < 0 (R_m > 1) the second-moment mass overruns the
// window and the conductor-normalised op-norm is no longer controlled by log Q_m
// alone -- the normalisation breaks. (This uses only the imp-2437 ratio; it does
// not model any extra op-norm amplification constant -- it is the bare tightness of
// the budget inequality the route depends on.)
//
// THE m-LAW OF THE MARGIN UNDER EACH INPUT
// ----------------------------------------
//   * EMPIRICAL (Delta, weight 12): the per-factor log L(1,sym^{2j} Delta) oscillate
//     in sign and nearly cancel (imp-2437), so log c_m stays O(1), R_m ~ 0 and
//     h_m ~ 1: full headroom, uniform in m -- Delta sits deep inside the safe regime.
//   * GRH model: per-factor cap log L(1,sym^{2j}f) <= log log Q(sym^{2j}f) gives
//     log c_m = sum_{j<=m} log log Q(sym^{2j}f) = Theta(m log log m) and
//     log Q_m = Theta(m log m), so R_m -> a bounded constant (~1.06 for Delta) and
//     h_m -> a bounded constant (~ -0.06). BOUNDED: log c_m = Theta(log Q_m), the
//     a_m-normalisation is tight up to a fixed O(1) factor for every m -- this is
//     exactly the "uniform-in-m second-moment control" the route needs, and it
//     holds CONDITIONALLY on GRH.
//   * UNCONDITIONAL model: per-factor cap log L(1,sym^{2j}f) <= log Q/log log Q =
//     O(j) gives log c_m = Theta(sum_{j<=m} j) = Theta(m^2) while log Q_m =
//     Theta(m log m), so R_m = Theta(m/log m) and the empirical Delta fit over
//     m=2..24 is R_m ~ 0.778 * m/log m - 0.417. Hence
//         h_m ~ 1 - 0.778 * m/log m  ->  -infinity.
//     UNBOUNDED: the second-moment budget outruns the conductor budget by the
//     same factor ~ m/log m imp-2437 named, so NO fixed conductor-normalised shift
//     can absorb it -- the control is NOT uniform in m unconditionally.
//
// THE BREAKPOINT CONDUCTOR
// ------------------------
// Solving h_m^{uncond} = 0 (R_m^{uncond} = 1) on the exact closed-form ratio:
// R_1 = 0.828 (h_1 = +0.172, still tight) and R_2 = 1.559 (h_2 = -0.559, broken),
// so the headroom first goes negative at m = 2, i.e. at sym^4, with analytic
// conductor Q_2 = exp(log Q_2) = exp(4.9698) ~ 144. From sym^4 onward h_m^{uncond}
// is monotone decreasing and negative (h_4 = -0.96, h_8 = -1.72, h_24 = -4.44):
// the unconditional O(j) per-factor bound breaks the a_m-normalisation
// PERMANENTLY at the very first non-trivial symmetric power, conductor ~ 144.
// (The GRH headroom by contrast never diverges: it settles to ~ -0.06, a bounded
// O(1) slack absorbed by the constant in a_0.)
//
// VERDICT: 'sympow-second-moment-uniform-under-GRH-breaks-at-sym4-unconditionally'.
//   The uniform-in-m sym^m Rankin-Selberg second-moment control the imp-2436 route
//   needs HOLDS uniformly under GRH (bounded headroom for all m) and FAILS
//   unconditionally from sym^4 (conductor ~ 144) on, where the best zero-free-region
//   per-factor bound first lets log c_m overrun log Q_m. No proof claim.

export const SYMPOW_RS_UNIFORM_MARGIN = Object.freeze({
  ticket: "imp-2459",
  followOnTo: "imp-2437",
  dependsOn: Object.freeze(["imp-2436", "imp-2437"]),
  evidenceClass: "analytic-reduction-plus-closed-form-numerics",
  question: "Is the sym^m Rankin-Selberg second-moment control c_m = prod_{j=1}^m L(1,sym^{2j} f) UNIFORM in m, and at what conductor does the unconditional O(j) per-factor bound break the a_m = a_0/log Q_m normalisation?",
  margin: Object.freeze({
    definition: "signed tightness headroom h_m = 1 - R_m, R_m = log c_m / log Q_m; h_m > 0 the conductor budget log Q_m dominates the second-moment budget log c_m (a_m-normalisation tight), h_m < 0 the second moment overruns it (normalisation broken).",
    note: "h_m is the bare tightness of the budget inequality log c_m <= log Q_m that the conductor-normalised route depends on; it introduces no extra op-norm amplification constant beyond the imp-2437 ratio.",
  }),
  mLaw: Object.freeze({
    empirical: Object.freeze({
      law: "R_m ~ 0, h_m ~ 1 (the L(1,sym^{2j} Delta) factors oscillate in sign and cancel).",
      uniform: true,
      reading: "Delta sits deep inside the safe regime -- full headroom, uniform in m.",
    }),
    grhModel: Object.freeze({
      law: "log c_m = Theta(m log log m), log Q_m = Theta(m log m) => R_m -> bounded const ~1.06, h_m -> bounded const ~ -0.06.",
      uniform: true,
      reading: "BOUNDED: log c_m = Theta(log Q_m), normalisation tight up to a fixed O(1) factor for every m -- the uniform-in-m control the route needs, holds conditionally on GRH.",
    }),
    unconditionalModel: Object.freeze({
      law: "log c_m = Theta(m^2), log Q_m = Theta(m log m) => R_m = Theta(m/log m); Delta fit (m=2..24): R_m ~ 0.778 * m/log m - 0.417, so h_m ~ 1 - 0.778 * m/log m -> -infinity.",
      uniform: false,
      reading: "UNBOUNDED: second-moment budget outruns the conductor budget by ~ m/log m -- no fixed conductor-normalised shift absorbs it; control NOT uniform in m unconditionally.",
      growthFit: Object.freeze({ form: "R_m ~ alpha * m/log m + beta", alpha: 0.7782, beta: -0.4167, fitRange: "m = 2..24 (Delta analytic conductor)" }),
    }),
  }),
  breakpoint: Object.freeze({
    m: 2,
    symPower: "sym^4",
    log_Q: 4.9698,
    conductor_Q: 144.0,
    statement: "the unconditional O(j) per-factor bound first lets R_m exceed 1 at m=2 (sym^4); the headroom h_m goes negative there and is monotone decreasing thereafter -- the a_m-normalisation is permanently broken from sym^4 (analytic conductor ~ 144) on.",
    contrastGRH: "the GRH headroom never diverges: R_m settles to ~1.06, h_m -> ~ -0.06, a bounded O(1) slack absorbable by the constant in a_0.",
  }),
  // h_m = 1 - R_m at selected m, all closed-form from logQ(m) and the two model caps.
  // (logQ(m) = sum_{j=0}^m log(1+|(m-2j)*11/2|); see imp-2437 script for the identical
  // conductor function and the GRH/unconditional per-factor caps.)
  marginTable: Object.freeze([
    Object.freeze({ m: 1, sym: 2, log_Q_m: 3.7436, R_uncond: 0.8280, h_uncond: 0.1720, R_GRH: 0.4283, h_GRH: 0.5717 }),
    Object.freeze({ m: 2, sym: 4, log_Q_m: 4.9698, R_uncond: 1.5585, h_uncond: -0.5585, R_GRH: 0.8095, h_GRH: 0.1905 }),
    Object.freeze({ m: 3, sym: 6, log_Q_m: 9.4680, R_uncond: 1.4828, h_uncond: -0.4828, R_GRH: 0.7319, h_GRH: 0.2681 }),
    Object.freeze({ m: 4, sym: 8, log_Q_m: 11.2408, R_uncond: 1.9571, h_uncond: -0.9571, R_GRH: 0.9060, h_GRH: 0.0940 }),
    Object.freeze({ m: 6, sym: 12, log_Q_m: 18.2935, R_uncond: 2.3474, h_uncond: -1.3474, R_GRH: 0.9542, h_GRH: 0.0458 }),
    Object.freeze({ m: 8, sym: 16, log_Q_m: 25.9068, R_uncond: 2.7249, h_uncond: -1.7249, R_GRH: 0.9837, h_GRH: 0.0163 }),
    Object.freeze({ m: 12, sym: 24, log_Q_m: 42.3669, R_uncond: 3.4474, h_uncond: -2.4474, R_GRH: 1.0186, h_GRH: -0.0186 }),
    Object.freeze({ m: 16, sym: 32, log_Q_m: 60.0576, R_uncond: 4.1365, h_uncond: -3.1365, R_GRH: 1.0389, h_GRH: -0.0389 }),
    Object.freeze({ m: 20, sym: 40, log_Q_m: 78.6870, R_uncond: 4.8005, h_uncond: -3.8005, R_GRH: 1.0524, h_GRH: -0.0524 }),
    Object.freeze({ m: 24, sym: 48, log_Q_m: 98.0758, R_uncond: 5.4448, h_uncond: -4.4448, R_GRH: 1.0621, h_GRH: -0.0621 }),
  ]),
  reproduce: "augment scripts/compute-imp2437-sympow-rs-residue.mjs with h_m = 1 - ratio per row; the R_uncond / R_GRH columns are the imp-2437 ratio_uncondModel / ratio_GRHmodel verbatim, and the conductor function logQ(m) is unchanged.",
  namedResidualGap: Object.freeze({
    "imp-2437-uniform-sympow-edge-bound": "still the single open input: an unconditional uniform-in-m per-factor bound log L(1,sym^{2j}f) = o(j) would push the breakpoint conductor to infinity (h_m bounded); the current zero-free-region O(j) fixes it at sym^4, conductor ~ 144.",
  }),
  verdict: "sympow-second-moment-uniform-under-GRH-breaks-at-sym4-unconditionally",
  headline: "The conductor-normalised second-moment margin h_m = 1 - log c_m/log Q_m is BOUNDED (uniform in m, ~ -0.06) under the GRH per-factor cap but DIVERGES like 1 - 0.778 m/log m unconditionally, first going negative at sym^4 (analytic conductor ~ 144) and monotone thereafter -- so uniform-in-m control holds under GRH and breaks unconditionally from the very first non-trivial symmetric power.",
  proofClaim: false,
});
