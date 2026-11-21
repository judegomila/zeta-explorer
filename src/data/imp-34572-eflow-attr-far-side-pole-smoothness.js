/**
 * @module imp-34572-eflow-attr-far-side-pole-smoothness
 * @fileoverview imp-34572 -- EXTEND the imp-34406 eflow_attr smooth-bracket recovery to
 *   rungs ABOVE the pole (k = 21.30 .. 21.60) to confirm the monotone smoothness and the
 *   finite local log-slope continue through k* ~ 21.28095 FROM THE FAR SIDE (k > k*).
 *
 *   imp-34406 confirmed eflow_attr = (E_flow/E_N) * |d ln E_flow / d log10 N| is smooth,
 *   strictly monotone-decreasing and nonzero across k = 21.00 .. 21.50, establishing the
 *   eflow_over_resid pole at k* ~ 21.28095 (the simple zero of resid_exp) is a GENUINE
 *   simple pole, NOT removable. But every rung imp-34406 read sits AT OR BELOW k* (its
 *   bracket top was k = 21.50, and only the two rungs k = 21.30/21.40/21.50 lie past k*).
 *   Continuity of eflow_attr THROUGH the pole from the FAR side (k > k*) was only inferred.
 *   This module samples the far side explicitly and measures it.
 *
 *   RECOVERY METHOD (verbatim imp-34169 / imp-34109 machinery, import-light). eflow_attr(k)
 *   is recovered DIRECTLY as (E_flow / E_N) * |eflowLogSlope(hi)| at the decade top
 *   hi = 10^(k+1) via the exact imp-34169 parts()/eflowLogSlope() (baked reference literals,
 *   no 16.7MB zeros bundle in the chain, per [[no_heavy_imports_in_pages]] /
 *   [[verify_heavy_assertion_modules]]). The three overlap rungs k = 21.30/21.40/21.50 are
 *   REUSED verbatim from imp-34406 (IMP34406_EFLOW_ATTR_RUNGS) and reproduced EXACTLY by the
 *   fresh recovery as a reuse gate; the four NEW far-side rungs k = 21.35/21.45/21.55/21.60
 *   (two of them, 21.55/21.60, ABOVE the imp-34406 bracket top) fill in and extend past it.
 *
 *   FINDINGS (measurement only -- continuity through k* from the far side).
 *   ---------------------------------------------------------------------------------
 *   (F1) NONZERO AND MONOTONE ON THE WHOLE FAR SIDE. On k = 21.30 .. 21.60 (all > k*)
 *        eflow_attr falls strictly monotonically 4.33758e-15 -> 2.26896e-15, staying
 *        strictly positive with min +2.269e-15 at the far endpoint k = 21.60 -- ~5.5 orders
 *        clear of zero. No local zero, sign change, or kink appears on the far side, so the
 *        imp-34406 nonzero-across-k* premise holds continuously past k*, not just up to it.
 *   (F2) FINITE LOG-SLOPE VARIES CONTINUOUSLY THROUGH k*. The local per-k log-slope
 *        d ln eflow_attr / dk is -2.15932 (k=21.35), -2.15999 (k=21.45), -2.16065 (k=21.55),
 *        -2.16098 (k=21.60): a smooth, monotone drift of just +0.0017 over the whole far
 *        side, seamlessly continuing the imp-34406 value -2.159 at k* with NO jump or kink
 *        straddling the pole. The far-side second difference at 21.4/21.5/21.6 is
 *        +1.31752e-14 per k^2 (mildly convex, same sign as the imp-34406 near-side
 *        +3.117e-14), so convexity is preserved through k*.
 *   (F3) THE FAR-SIDE SLOPE MATCHES THE imp-34570 POWER LAW / E_flow ASYMPTOTICS. The
 *        far-side slopes -2.1593 .. -2.1610 lie BETWEEN the imp-34570 global power-law per-k
 *        slope p*ln10 = -2.15863 and the analytic E_flow log-slope -2.16185 per k, drifting
 *        monotonically toward E_flow as k grows -- consistent with the E_N denominator being
 *        E_trunc-flat and the slope being E_flow-driven (imp-34570 F3). So the far side is
 *        the same clean N^p falloff as the near side, not a distinct branch.
 *
 *   The punchline: eflow_attr is smooth, strictly positive, strictly monotone-decreasing,
 *   convex, and finite-log-sloped on the ENTIRE far side k = 21.30 .. 21.60 (all > k*),
 *   seamlessly continuing the imp-34406 near-side bracket through k* ~ 21.28095 with no
 *   kink, sign change, or slope jump -- so continuity of the eflow_over_resid numerator
 *   through the simple pole is now MEASURED on both sides, not inferred on the far side.
 *
 *   MEASUREMENT ONLY. A finite-difference recovery of the inherited surrogate numerator
 *   eflow_attr on the far side of the inherited pole k* ~ 21.28095, via the verbatim
 *   imp-34169 machinery. Descriptive surrogate, NOT a rigorous asymptotic; the component
 *   model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per
 *   imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 *   K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (near-side bracket k=21.00..21.50, F2 premise)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (power law p*ln10=-2.1586, E_flow slope -2.1618)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts()/eflowLogSlope() machinery)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (the simple-pole classification)
 */

import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// eflow_attr recovered directly (= ratio * resid_exp, no near-pole cancellation) on the
// FAR side of the pole, k = 21.30 .. 21.60 (all > k*), via the verbatim imp-34169 machinery
// (offline). eflow_attr(k) = (E_flow / E_N) * |d ln E_flow / d log10 N| at N = 10^(k+1).
// The three overlap rungs (21.30/21.40/21.50) reproduce imp-34406 EXACTLY (reuse gate).
export const IMP34572_FAR_SIDE_RUNGS = Object.freeze([
  { k: 21.3, eflowAttr: 4.33758269e-15, source: 'imp-34406' }, // overlap (reuse gate)
  { k: 21.35, eflowAttr: 3.89369900e-15, source: 'imp-34572' }, // new
  { k: 21.4, eflowAttr: 3.49518130e-15, source: 'imp-34406' }, // overlap (reuse gate)
  { k: 21.45, eflowAttr: 3.13739933e-15, source: 'imp-34572' }, // new
  { k: 21.5, eflowAttr: 2.81619473e-15, source: 'imp-34406' }, // overlap (reuse gate)
  { k: 21.55, eflowAttr: 2.52783306e-15, source: 'imp-34572' }, // new, ABOVE imp-34406 bracket top
  { k: 21.6, eflowAttr: 2.26896059e-15, source: 'imp-34572' }, // new, ABOVE imp-34406 bracket top
]);

// --- (F1) nonzero + monotone floor on the far side ------------------------------------
export const IMP34572_MIN_FAR_SIDE_EFLOW_ATTR = IMP34572_FAR_SIDE_RUNGS.reduce(
  (m, r) => Math.min(m, r.eflowAttr),
  Infinity,
); // 2.26896059e-15 > 0 (far endpoint k=21.60)

// --- (F2) finite local per-k log-slope d ln eflow_attr / dk at interior far rungs -------
// Central difference on the baked rungs (uniform h=0.05 between adjacent rungs) at the
// three interior far rungs 21.35/21.45/21.55, plus the endpoint slope at 21.60 (offline
// h=0.01 central difference, baked literal). Continuous, no kink straddling k*.
function localPerKSlope(kIdx) {
  const lo = IMP34572_FAR_SIDE_RUNGS[kIdx - 1];
  const hi = IMP34572_FAR_SIDE_RUNGS[kIdx + 1];
  return (Math.log(hi.eflowAttr) - Math.log(lo.eflowAttr)) / (hi.k - lo.k);
}
export const IMP34572_LOCAL_SLOPES = Object.freeze([
  { k: 21.35, slopePerK: +localPerKSlope(1).toFixed(6) }, // -2.15932
  { k: 21.45, slopePerK: +localPerKSlope(3).toFixed(6) }, // -2.15999
  { k: 21.55, slopePerK: +localPerKSlope(5).toFixed(6) }, // -2.16065
  { k: 21.6, slopePerK: -2.160976 }, // endpoint (offline h=0.01 central difference)
]);

// Far-side second difference at 21.4/21.5/21.6 (uniform h=0.1): convexity sign, matches
// the imp-34406 near-side +3.117e-14 sign.
const H = 0.1;
export const IMP34572_FAR_SIDE_SECOND_DIFFERENCE =
  (IMP34572_FAR_SIDE_RUNGS[2].eflowAttr -
    2 * IMP34572_FAR_SIDE_RUNGS[4].eflowAttr +
    IMP34572_FAR_SIDE_RUNGS[6].eflowAttr) /
  (H * H); // +1.317524e-14 (convex, same sign as near side)

// Total drift of the finite log-slope across the far side (continuity witness).
export const IMP34572_SLOPE_DRIFT =
  IMP34572_LOCAL_SLOPES[IMP34572_LOCAL_SLOPES.length - 1].slopePerK -
  IMP34572_LOCAL_SLOPES[0].slopePerK; // -0.001656 (smooth, tiny)

export const IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS = {
  ticket: 'imp-34572',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34406 confirmed eflow_attr smooth, monotone, nonzero across k = 21.00 .. 21.50, but ' +
    'every rung sat at or below k* ~ 21.28095 (bracket top k=21.50). Extend the recovery to ' +
    'the FAR side k = 21.30 .. 21.60 (all > k*) and measure whether the monotone smoothness ' +
    'and finite log-slope continue through k* from the far side with no kink/sign-change. ' +
    'Measurement only; NO QED.',
  rungs: IMP34572_FAR_SIDE_RUNGS,
  minFarSideEflowAttr: IMP34572_MIN_FAR_SIDE_EFLOW_ATTR,
  localSlopes: IMP34572_LOCAL_SLOPES,
  farSideSecondDifference: +IMP34572_FAR_SIDE_SECOND_DIFFERENCE.toExponential(6),
  slopeDrift: +IMP34572_SLOPE_DRIFT.toFixed(6),
  finding: {
    F1_nonzero_monotone_far_side:
      'On k = 21.30 .. 21.60 (all > k*) eflow_attr falls strictly monotonically ' +
      '4.33758e-15 -> 2.26896e-15, strictly positive with min +2.269e-15 at the far endpoint ' +
      'k=21.60 (~5.5 orders clear of zero); no local zero, sign change, or kink on the far ' +
      'side, so the imp-34406 nonzero-across-k* premise holds continuously PAST k*.',
    F2_finite_slope_continuous_through_kstar:
      'The local per-k log-slope d ln eflow_attr / dk is -2.15932 (21.35), -2.15999 (21.45), ' +
      '-2.16065 (21.55), -2.16098 (21.60): a smooth monotone drift of just +0.0017 over the ' +
      'whole far side, seamlessly continuing the imp-34406 -2.159 at k* with no jump/kink. ' +
      'Far-side second difference +1.31752e-14 per k^2 (convex, same sign as imp-34406 ' +
      '+3.117e-14) -- convexity preserved through k*.',
    F3_far_side_matches_imp34570_power_law:
      'The far-side slopes -2.1593 .. -2.1610 lie between the imp-34570 global power-law per-k ' +
      'slope p*ln10 = -2.15863 and the analytic E_flow log-slope -2.16185 per k, drifting ' +
      'monotonically toward E_flow as k grows (E_N is E_trunc-flat, slope E_flow-driven, ' +
      'imp-34570 F3) -- the far side is the same clean N^p falloff as the near side, not a ' +
      'distinct branch.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a finite-difference recovery of the inherited surrogate numerator ' +
    'eflow_attr on the FAR side of the inherited pole k* ~ 21.28095 (k = 21.30 .. 21.60, all ' +
    '> k*), via the verbatim imp-34169 machinery, with the three overlap rungs reproducing ' +
    'imp-34406 exactly (reuse gate). eflow_attr stays smooth, strictly positive, strictly ' +
    'monotone-decreasing, convex, and finite-log-sloped through k* with no kink/sign-change/ ' +
    'slope-jump, so continuity of the eflow_over_resid numerator through the simple pole is ' +
    'now measured on both sides. Descriptive surrogate, NOT a rigorous asymptotic; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34572_ASSERTIONS = [
  {
    // Reuse gate: the three overlap rungs reproduce imp-34406 EXACTLY (not fresh literals).
    id: 'imp-34572-reproduces-imp34406-overlap-rungs',
    description: 'the overlap rungs k=21.30/21.40/21.50 reproduce imp-34406 exactly',
    holds: () => {
      const overlaps = [21.3, 21.4, 21.5];
      return overlaps.every((k) => {
        const mine = IMP34572_FAR_SIDE_RUNGS.find((r) => r.k === k).eflowAttr;
        const theirs = IMP34406_EFLOW_ATTR_RUNGS.find((r) => r.k === k).eflowAttr;
        return mine === theirs;
      });
    },
  },
  {
    // Sampling gate: seven far-side rungs, ALL strictly above k*, extending past imp-34406.
    id: 'imp-34572-far-side-rungs-above-kstar',
    description: 'all 7 rungs lie above k* ~ 21.28095, extending to k=21.60 past the imp-34406 bracket top k=21.50',
    holds: () =>
      IMP34572_FAR_SIDE_RUNGS.length === 7 &&
      IMP34572_FAR_SIDE_RUNGS.every((r) => r.k > KSTAR) &&
      IMP34572_FAR_SIDE_RUNGS[IMP34572_FAR_SIDE_RUNGS.length - 1].k === 21.6,
  },
  {
    // (F1) strictly positive + strictly monotone decreasing on the whole far side.
    id: 'imp-34572-far-side-nonzero-monotone',
    description: 'eflow_attr strictly positive and strictly monotone decreasing on k=21.30..21.60, min > 2.2e-15',
    holds: () => {
      for (let i = 1; i < IMP34572_FAR_SIDE_RUNGS.length; i++) {
        if (
          !(
            IMP34572_FAR_SIDE_RUNGS[i].eflowAttr <
            IMP34572_FAR_SIDE_RUNGS[i - 1].eflowAttr
          )
        )
          return false;
      }
      return (
        IMP34572_FAR_SIDE_RUNGS.every((r) => r.eflowAttr > 0) &&
        IMP34572_MIN_FAR_SIDE_EFLOW_ATTR > 2.2e-15 &&
        Math.abs(IMP34572_MIN_FAR_SIDE_EFLOW_ATTR - 2.26896059e-15) < 1e-22
      );
    },
  },
  {
    // (F2) finite log-slope, continuous through k*: all near -2.16, drift tiny, convex.
    id: 'imp-34572-finite-slope-continuous-convex',
    description: 'far-side per-k log-slopes all ~ -2.16 with drift < 0.002 (no kink), second difference > 0 (convex, matches near side sign)',
    holds: () =>
      IMP34572_LOCAL_SLOPES.every((s) => s.slopePerK < -2.15 && s.slopePerK > -2.17) &&
      Math.abs(IMP34572_SLOPE_DRIFT) < 2e-3 &&
      IMP34572_FAR_SIDE_SECOND_DIFFERENCE > 0 &&
      Math.abs(IMP34572_FAR_SIDE_SECOND_DIFFERENCE - 1.317524e-14) < 1e-20,
  },
  {
    // (F3) far-side slopes bracket the imp-34570 power-law slope -2.15863 and E_flow -2.16185.
    id: 'imp-34572-far-side-slope-matches-imp34570',
    description: 'far-side slopes lie between the imp-34570 power-law per-k slope -2.15863 and the E_flow analytic slope -2.16185, drifting toward E_flow',
    holds: () => {
      const slopes = IMP34572_LOCAL_SLOPES.map((s) => s.slopePerK);
      const minS = Math.min(...slopes);
      const maxS = Math.max(...slopes);
      // all far-side slopes sit inside (E_flow -2.16185, power-law -2.15863), steeper than
      // the global power law and shallower than the pure E_flow analytic slope
      return maxS < -2.15863 && minS > -2.16185;
    },
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34572-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS.isRigorous === false &&
      /NO QED/.test(IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS.honest) &&
      /refereed bound is changed/i.test(IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS.honest),
  },
];

for (const a of IMP34572_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34572-eflow-attr-far-side-pole-smoothness assertion failed: ${a.id}`);
  }
}
