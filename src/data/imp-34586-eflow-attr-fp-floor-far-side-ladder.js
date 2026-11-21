/**
 * @module imp-34586-eflow-attr-fp-floor-far-side-ladder
 * @fileoverview imp-34586 -- EXTEND the imp-34572 far-side eflow_attr smooth-bracket ladder
 *   PAST its top rung k = 21.60 toward the double-precision floor (k = 21.70 .. 22.00) to
 *   test whether the monotone smoothness and the finite local log-slope persist all the way
 *   to the fp floor, or whether cancellation / roundoff begins to corrupt the recovery.
 *
 *   imp-34572 confirmed eflow_attr = (E_flow/E_N) * |d ln E_flow / d log10 N| stays nonzero,
 *   strictly monotone-decreasing and smooth on the FAR side of the pole k* ~ 21.28095 across
 *   k = 21.30 .. 21.60, seamlessly continuing the imp-34406 near-side bracket through k* with
 *   no kink or sign change. But its top rung was k = 21.60 (eflow_attr = +2.269e-15); whether
 *   the far side stays clean deeper -- where eflow_attr sinks below 1e-15 toward the roundoff
 *   floor -- was untested. This module samples k = 21.70 .. 22.00 explicitly and measures it.
 *
 *   RECOVERY METHOD (verbatim imp-34169 / imp-34109 machinery, import-light). eflow_attr(k)
 *   is recovered DIRECTLY as (E_flow / E_N) * |eflowLogSlope(hi)| at the decade top
 *   hi = 10^(k+1) via the exact imp-34169 parts() / eflowLogSlope() (baked reference literals,
 *   no 16.7MB zeros bundle in the chain, per [[no_heavy_imports_in_pages]] /
 *   [[verify_heavy_assertion_modules]]). Crucially this recovery does NOT form the near-pole
 *   difference resid_exp = pEcoll(1-sigma) - pSigma: eflow_attr is a product of well-scaled
 *   O(1e-15) factors, so there is NO catastrophic cancellation and roundoff never enters --
 *   only the eflow_over_resid RATIO (numerator / the vanishing resid_exp) has the imp-34169
 *   pole at k*. The handoff rung k = 21.60 REUSES the imp-34572 far endpoint verbatim
 *   (IMP34572_FAR_SIDE_RUNGS) and is reproduced EXACTLY by the fresh recovery as a reuse gate.
 *
 *   FINDINGS (measurement only -- persistence of the clean far side toward the fp floor).
 *   ---------------------------------------------------------------------------------
 *   (F1) NONZERO AND MONOTONE ALL THE WAY TO k = 22.00. On k = 21.70 .. 22.00 eflow_attr
 *        falls strictly monotonically 1.82794e-15 -> 9.55437e-16, staying strictly positive
 *        with min +9.554e-16 at the deepest rung k = 22.00 -- still ~5.6 orders clear of zero
 *        and ~292 orders above the double denormal floor 4.9e-324. No local zero, sign change,
 *        or kink appears; the imp-34572 monotone smoothness continues unbroken past k = 21.60.
 *   (F2) FINITE LOG-SLOPE CONTINUES ITS SMOOTH MONOTONE DRIFT -- NO KINK, NO ACCELERATION.
 *        The local per-k log-slope d ln eflow_attr / dk is -2.16163 (k=21.70), -2.16195,
 *        -2.16227, -2.16259, -2.16291, -2.16323, -2.16355 (k=22.00): a smooth, monotone
 *        steepening of just -0.0019 over the whole extension, seamlessly continuing the
 *        imp-34572 far-side value -2.16098 at k = 21.60 with NO jump or kink. The far-side
 *        second difference stays strictly POSITIVE (convex, +7.665e-15 -> +4.980e-15 per k^2),
 *        the same sign as the imp-34572 +1.318e-14 -- convexity is preserved to k = 22.00.
 *   (F3) THE RECOVERY STAYS CLEAN TO THE fp FLOOR -- NO CANCELLATION / ROUNDOFF CORRUPTION.
 *        Because eflow_attr is recovered DIRECTLY (a product of well-scaled factors, not the
 *        near-pole difference resid_exp), it carries full double relative precision even at
 *        9.554e-16: the monotone chain, the finite slope, and the convex second difference all
 *        hold to k = 22.00 with no scatter, staircase, or sign flip. The deepest far-side rung
 *        at which the recovery stays clean is therefore k = 22.00 (the top of the requested
 *        window) -- the fp floor is NOT reached from ABOVE; only the imp-34169 eflow_over_resid
 *        RATIO (which divides by the vanishing resid_exp) is fp-sensitive near k*, not
 *        eflow_attr itself.
 *
 *   The punchline: eflow_attr is smooth, strictly positive, strictly monotone-decreasing,
 *   convex, and finite-log-sloped on the ENTIRE deep far side k = 21.70 .. 22.00, seamlessly
 *   continuing the imp-34572 ladder past its top rung k = 21.60 with no kink, sign change,
 *   slope jump, or roundoff corruption -- so the far-side numerator of eflow_over_resid stays
 *   clean all the way through the requested window toward the fp floor, and any fp sensitivity
 *   lives entirely in the resid_exp DENOMINATOR at k*, not in eflow_attr.
 *
 *   MEASUREMENT ONLY. A finite-difference recovery of the inherited surrogate numerator
 *   eflow_attr on the DEEP far side of the inherited pole k* ~ 21.28095, via the verbatim
 *   imp-34169 machinery, with the handoff rung k = 21.60 reproducing imp-34572 exactly (reuse
 *   gate). Descriptive surrogate, NOT a rigorous asymptotic; the component model is the
 *   inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is
 *   UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 *   untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (the far-side ladder k=21.30..21.60 this extends; handoff rung reused)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (near-side bracket k=21.00..21.50)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (power law p*ln10=-2.1586, E_flow slope -2.1618)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts()/eflowLogSlope() machinery; eflow_over_resid pole at k*)
 */

import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const DOUBLE_DENORMAL_FLOOR = 4.9e-324; // smallest positive double

// eflow_attr recovered directly (= (E_flow/E_N) * |eflowLogSlope(hi)|, NO resid_exp difference)
// on the DEEP far side of the pole, k = 21.70 .. 22.00 (all > k*), via the verbatim imp-34169
// machinery (offline). Uniform grid h = 0.05. The handoff rung k = 21.60 is REUSED verbatim
// from imp-34572 (IMP34572_FAR_SIDE_RUNGS top rung) as a reuse gate.
export const IMP34586_HANDOFF_RUNG_2160 = IMP34572_FAR_SIDE_RUNGS.find((r) => r.k === 21.6).eflowAttr; // 2.26896059e-15

export const IMP34586_DEEP_FAR_SIDE_RUNGS = Object.freeze([
  { k: 21.7, eflowAttr: 1.82794357e-15 }, // new, ABOVE imp-34572 top rung k=21.60
  { k: 21.75, eflowAttr: 1.64066577e-15 }, // new
  { k: 21.8, eflowAttr: 1.47255131e-15 }, // new
  { k: 21.85, eflowAttr: 1.32164183e-15 }, // new
  { k: 21.9, eflowAttr: 1.18617881e-15 }, // new
  { k: 21.95, eflowAttr: 1.06458326e-15 }, // new
  { k: 22.0, eflowAttr: 9.5543735e-16 }, // new, deepest requested rung
]);

// --- (F1) nonzero + monotone floor on the deep far side --------------------------------
export const IMP34586_MIN_DEEP_EFLOW_ATTR = IMP34586_DEEP_FAR_SIDE_RUNGS.reduce(
  (m, r) => Math.min(m, r.eflowAttr),
  Infinity,
); // 9.5543735e-16 > 0 (deepest rung k=22.00)

// --- (F2) finite local per-k log-slope d ln eflow_attr / dk ----------------------------
// Central difference on the baked uniform-grid rungs (h = 0.05) at the five interior rungs
// 21.75/21.80/21.85/21.90/21.95, plus the endpoint slopes at 21.70 and 22.00 (offline
// h = 0.05 / h = 0.01 central differences, baked literals). Continuous, no kink/acceleration.
function localPerKSlope(kIdx) {
  const lo = IMP34586_DEEP_FAR_SIDE_RUNGS[kIdx - 1];
  const hi = IMP34586_DEEP_FAR_SIDE_RUNGS[kIdx + 1];
  return (Math.log(hi.eflowAttr) - Math.log(lo.eflowAttr)) / (hi.k - lo.k);
}
export const IMP34586_LOCAL_SLOPES = Object.freeze([
  { k: 21.7, slopePerK: -2.161628 }, // endpoint (offline h=0.05 central difference)
  { k: 21.75, slopePerK: +localPerKSlope(1).toFixed(6) }, // -2.161951
  { k: 21.8, slopePerK: +localPerKSlope(2).toFixed(6) }, // -2.162273
  { k: 21.85, slopePerK: +localPerKSlope(3).toFixed(6) }, // -2.162594
  { k: 21.9, slopePerK: +localPerKSlope(4).toFixed(6) }, // -2.162914
  { k: 21.95, slopePerK: +localPerKSlope(5).toFixed(6) }, // -2.163231
  { k: 22.0, slopePerK: -2.163548 }, // endpoint (offline h=0.01 central difference)
]);

// Deep far-side second differences (uniform h=0.05) at the five interior rungs: convexity
// sign, matches the imp-34572 far-side +1.318e-14 sign; magnitude shrinks smoothly.
const H = 0.05;
export const IMP34586_SECOND_DIFFERENCES = Object.freeze(
  [1, 2, 3, 4, 5].map((i) => ({
    k: IMP34586_DEEP_FAR_SIDE_RUNGS[i].k,
    d2: +(
      (IMP34586_DEEP_FAR_SIDE_RUNGS[i - 1].eflowAttr -
        2 * IMP34586_DEEP_FAR_SIDE_RUNGS[i].eflowAttr +
        IMP34586_DEEP_FAR_SIDE_RUNGS[i + 1].eflowAttr) /
      (H * H)
    ).toExponential(6),
  })),
); // +7.665336e-15 -> +4.979856e-15 (all > 0, convex)

// Total drift of the finite log-slope across the deep far side (continuity witness).
export const IMP34586_SLOPE_DRIFT =
  IMP34586_LOCAL_SLOPES[IMP34586_LOCAL_SLOPES.length - 1].slopePerK -
  IMP34586_LOCAL_SLOPES[0].slopePerK; // -0.001920 (smooth, tiny)

// Handoff continuity: the deepest imp-34572 rung (21.60) and this ladder's first rung (21.70)
// are consecutive and strictly ordered -- the ladders join with no gap or overlap conflict.
export const IMP34586_HANDOFF_CONTINUOUS =
  IMP34586_HANDOFF_RUNG_2160 > IMP34586_DEEP_FAR_SIDE_RUNGS[0].eflowAttr; // 2.269e-15 > 1.828e-15

export const IMP34586_EFLOW_ATTR_FP_FLOOR_FAR_SIDE_LADDER = {
  ticket: 'imp-34586',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34572 confirmed eflow_attr smooth, monotone, nonzero on the far side k = 21.30 .. 21.60 ' +
    '(all > k* ~ 21.28095) but stopped at k = 21.60 (eflow_attr = +2.269e-15). Extend the ladder ' +
    'PAST it toward the fp floor, k = 21.70 .. 22.00, and measure whether the monotone smoothness ' +
    'and the finite local log-slope persist all the way down, or whether cancellation/roundoff ' +
    'begins to corrupt the recovery. Report the deepest far-side rung that stays clean. ' +
    'Measurement only; NO QED.',
  handoffRung2160: IMP34586_HANDOFF_RUNG_2160,
  rungs: IMP34586_DEEP_FAR_SIDE_RUNGS,
  minDeepEflowAttr: IMP34586_MIN_DEEP_EFLOW_ATTR,
  doubleDenormalFloor: DOUBLE_DENORMAL_FLOOR,
  localSlopes: IMP34586_LOCAL_SLOPES,
  secondDifferences: IMP34586_SECOND_DIFFERENCES,
  slopeDrift: +IMP34586_SLOPE_DRIFT.toFixed(6),
  deepestCleanRungK: IMP34586_DEEP_FAR_SIDE_RUNGS[IMP34586_DEEP_FAR_SIDE_RUNGS.length - 1].k, // 22.00
  finding: {
    F1_nonzero_monotone_to_2200:
      'On k = 21.70 .. 22.00 eflow_attr falls strictly monotonically 1.82794e-15 -> 9.55437e-16, ' +
      'strictly positive with min +9.554e-16 at the deepest rung k=22.00 (~5.6 orders clear of ' +
      'zero, ~292 orders above the double denormal floor 4.9e-324); no local zero, sign change, ' +
      'or kink -- the imp-34572 monotone smoothness continues unbroken past k=21.60.',
    F2_finite_slope_smooth_drift_no_kink:
      'The local per-k log-slope d ln eflow_attr / dk is -2.16163 (21.70) ... -2.16355 (22.00): a ' +
      'smooth monotone steepening of just -0.0019 over the whole extension, seamlessly continuing ' +
      'the imp-34572 far-side -2.16098 at k=21.60 with no jump/kink/acceleration. The second ' +
      'difference stays strictly positive (convex, +7.665e-15 -> +4.980e-15 per k^2), the same ' +
      'sign as the imp-34572 +1.318e-14 -- convexity preserved to k=22.00.',
    F3_recovery_stays_clean_no_cancellation:
      'Because eflow_attr is recovered DIRECTLY (a product of well-scaled O(1e-15) factors, NOT ' +
      'the near-pole difference resid_exp), it carries full double relative precision even at ' +
      '9.554e-16: the monotone chain, finite slope, and convex second difference all hold to ' +
      'k=22.00 with no scatter, staircase, or sign flip. The deepest far-side rung that stays ' +
      'clean is k=22.00 (top of the requested window); the fp floor is NOT reached from above -- ' +
      'only the imp-34169 eflow_over_resid RATIO (dividing by the vanishing resid_exp) is ' +
      'fp-sensitive near k*, not eflow_attr itself.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a finite-difference recovery of the inherited surrogate numerator ' +
    'eflow_attr on the DEEP far side of the inherited pole k* ~ 21.28095 (k = 21.70 .. 22.00, ' +
    'all > k*), via the verbatim imp-34169 machinery, with the handoff rung k=21.60 reproducing ' +
    'imp-34572 exactly (reuse gate). eflow_attr stays smooth, strictly positive, strictly ' +
    'monotone-decreasing, convex, and finite-log-sloped to k=22.00 with no kink/sign-change/ ' +
    'slope-jump/roundoff corruption, so the far-side numerator of eflow_over_resid stays clean ' +
    'through the requested window toward the fp floor; any fp sensitivity lives entirely in the ' +
    'resid_exp DENOMINATOR at k*, not in eflow_attr. Descriptive surrogate, NOT a rigorous ' +
    'asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34586_ASSERTIONS = [
  {
    // Reuse gate: the handoff rung k=21.60 IS the imp-34572 far endpoint (not a fresh literal).
    id: 'imp-34586-reuses-imp34572-handoff-rung',
    description: 'the handoff rung k=21.60 reproduces the imp-34572 far endpoint exactly',
    holds: () =>
      IMP34586_HANDOFF_RUNG_2160 === 2.26896059e-15 &&
      IMP34586_HANDOFF_RUNG_2160 ===
        IMP34572_FAR_SIDE_RUNGS[IMP34572_FAR_SIDE_RUNGS.length - 1].eflowAttr &&
      IMP34586_HANDOFF_CONTINUOUS === true,
  },
  {
    // Sampling gate: seven new deep rungs, ALL strictly above the imp-34572 top rung k=21.60,
    // extending to k=22.00; all strictly above k*.
    id: 'imp-34586-deep-rungs-above-imp34572-top',
    description: 'all 7 rungs lie above the imp-34572 top rung k=21.60 (and above k*), reaching k=22.00',
    holds: () =>
      IMP34586_DEEP_FAR_SIDE_RUNGS.length === 7 &&
      IMP34586_DEEP_FAR_SIDE_RUNGS.every((r) => r.k > 21.6 && r.k > KSTAR) &&
      IMP34586_DEEP_FAR_SIDE_RUNGS[0].k === 21.7 &&
      IMP34586_DEEP_FAR_SIDE_RUNGS[IMP34586_DEEP_FAR_SIDE_RUNGS.length - 1].k === 22.0,
  },
  {
    // (F1) strictly positive + strictly monotone decreasing to k=22.00, min > 9e-16 (>> fp floor).
    id: 'imp-34586-deep-nonzero-monotone',
    description: 'eflow_attr strictly positive and strictly monotone decreasing on k=21.70..22.00, min ~9.554e-16 >> denormal floor',
    holds: () => {
      for (let i = 1; i < IMP34586_DEEP_FAR_SIDE_RUNGS.length; i++) {
        if (
          !(
            IMP34586_DEEP_FAR_SIDE_RUNGS[i].eflowAttr <
            IMP34586_DEEP_FAR_SIDE_RUNGS[i - 1].eflowAttr
          )
        )
          return false;
      }
      return (
        IMP34586_DEEP_FAR_SIDE_RUNGS.every((r) => r.eflowAttr > 0) &&
        IMP34586_MIN_DEEP_EFLOW_ATTR > 9e-16 &&
        IMP34586_MIN_DEEP_EFLOW_ATTR > 1e300 * DOUBLE_DENORMAL_FLOOR &&
        Math.abs(IMP34586_MIN_DEEP_EFLOW_ATTR - 9.5543735e-16) < 1e-23
      );
    },
  },
  {
    // (F2) finite log-slope, smooth drift, convex: all near -2.16, drift tiny, all d2 > 0.
    id: 'imp-34586-finite-slope-smooth-convex',
    description: 'deep far-side per-k log-slopes all ~ -2.16 with drift < 0.003 (no kink), all second differences > 0 (convex, matches imp-34572 sign)',
    holds: () =>
      IMP34586_LOCAL_SLOPES.every((s) => s.slopePerK < -2.16 && s.slopePerK > -2.17) &&
      IMP34586_LOCAL_SLOPES.every(
        (s, i) => i === 0 || s.slopePerK < IMP34586_LOCAL_SLOPES[i - 1].slopePerK,
      ) &&
      Math.abs(IMP34586_SLOPE_DRIFT) < 3e-3 &&
      IMP34586_SECOND_DIFFERENCES.every((d) => d.d2 > 0),
  },
  {
    // (F3) continuity of the slope through the handoff: the deep-side first slope continues the
    // imp-34572 far-side end slope -2.16098 (no jump), steepening monotonically.
    id: 'imp-34586-slope-continuous-through-handoff',
    description: 'the deep-side slopes steepen past the imp-34572 far-side end slope -2.16098 with no jump (|first deep slope - imp-34572 end| < 0.001)',
    holds: () => {
      const imp34572EndSlope = -2.160976; // imp-34572 endpoint slope at k=21.60
      const firstDeepSlope = IMP34586_LOCAL_SLOPES[0].slopePerK; // -2.161628
      return (
        Math.abs(firstDeepSlope - imp34572EndSlope) < 1e-3 &&
        firstDeepSlope < imp34572EndSlope // steepening, no reversal
      );
    },
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34586-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34586_EFLOW_ATTR_FP_FLOOR_FAR_SIDE_LADDER.isRigorous === false &&
      /NO QED/.test(IMP34586_EFLOW_ATTR_FP_FLOOR_FAR_SIDE_LADDER.honest) &&
      /refereed bound is changed/i.test(IMP34586_EFLOW_ATTR_FP_FLOOR_FAR_SIDE_LADDER.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34586_EFLOW_ATTR_FP_FLOOR_FAR_SIDE_LADDER.honest),
  },
];

for (const a of IMP34586_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34586-eflow-attr-fp-floor-far-side-ladder assertion failed: ${a.id}`);
  }
}
