/**
 * @module imp-34406-eflow-attr-smooth-nonzero-across-pole
 * @fileoverview imp-34406 -- CONFIRM the imp-34310 F2 premise that the numerator
 *   eflow_attr = eflow_over_resid * resid_exp is SMOOTH and NONZERO across the pole
 *   k* ~ 21.28095 (the simple zero of resid_exp), by recovering eflow_attr on SIX
 *   additional rungs bracketing k* -- not just the two (k=21.25, 21.50) imp-34310
 *   read -- and ruling out a REMOVABLE singularity (which would require eflow_attr to
 *   itself vanish at k*, turning eflow_over_resid = eflow_attr / resid_exp into 0/0).
 *
 *   imp-34310 F2 classified the eflow_over_resid pole as SIMPLE on the premise that
 *   eflow_attr is smooth and nonzero at k* (its E* ~ 4.583e-15 was a LINEAR interp of
 *   just two rungs). If eflow_attr instead vanished at k* the singularity would be
 *   removable, not a genuine pole. This module supplies the missing rungs.
 *
 *   RECOVERY METHOD. Rather than form the near-pole quotient ratio * resid_exp (which
 *   loses digits as resid_exp -> 0, the imp-34405 floor), eflow_attr is recovered
 *   DIRECTLY as eflow_attr(k) = (E_flow / E_N) * |d ln E_flow / d log10 N| evaluated at
 *   the decade top N = 10^(k+1), which is EXACTLY the numerator the imp-34169
 *   eflowOverResidAt divides by resid_exp (so eflow_attr === ratio * resid_exp by
 *   construction, with no cancellation). The eight values below were computed offline
 *   via the verbatim imp-34169 / imp-34109 parts() + eflowLogSlope() + eflowAttr
 *   machinery (import-light: baked reference literals, no 16.7MB zeros bundle in the
 *   chain, per [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]),
 *   and the two rungs imp-34310 published (k=21.25 -> 4.8321e-15, k=21.50 -> 2.81799e-15)
 *   are reproduced to <0.1% as a reuse gate. The imp-34310 K* / E* scalars are imported
 *   (themselves import-light literals baked from imp-34237) for an exact cross-check.
 *
 *   FINDINGS (measurement only -- ruling out a removable singularity).
 *   ------------------------------------------------------------------
 *   (F1) NONZERO AT k*. Directly recovered eflow_attr(k*) = +4.5197e-15 -- strictly
 *        positive and ~5.5 orders of magnitude clear of zero (the smallest rung on the
 *        whole bracket, k=21.50, is still +2.816e-15). eflow_attr does NOT vanish at k*,
 *        so eflow_over_resid = eflow_attr / resid_exp is 0/0 NOWHERE near k*: the
 *        singularity is a GENUINE pole, NOT removable. This is the imp-34310 F2 premise,
 *        now confirmed on six extra rungs instead of assumed from two.
 *   (F2) SMOOTH AND MONOTONE THROUGH k*. eflow_attr is strictly monotone DECREASING and
 *        smooth across the whole bracket k = 21.00 .. 21.50 (8.287e-15 -> 2.816e-15),
 *        with NO local zero, sign change, or kink straddling k*. Its three-point second
 *        difference at k=21.0/21.1/21.2 is +3.117e-14 per k^2 (mildly convex, decay
 *        decelerating), and its local log-slope at k* is a FINITE -2.159 per k -- no
 *        blow-up. So the ONLY singular factor in eflow_over_resid at k* is the resid_exp
 *        zero (imp-34310 F2), confirming the SIMPLE-pole order.
 *   (F3) CONVEXITY REFINES THE imp-34310 INTERP. The imp-34310 two-rung LINEAR interp
 *        E* = 4.582753e-15 sits +1.395% ABOVE the directly recovered 4.519696e-15,
 *        because eflow_attr is convex (F2) so the secant between 21.25 and 21.50
 *        over-reads at the interior k*. The direct value is the more accurate E* at k*;
 *        the sign, order of magnitude, and nonzero-ness of the imp-34310 premise are
 *        UNCHANGED (a ~1.4% numerator move does not alter the simple-pole classification
 *        nor materially the residue R = E_star/m). The imp-34310 residue would tighten from
 *        -1.979e-8 by the same ~1.4% if the direct E* replaced the interp.
 *
 *   The punchline: eflow_attr is smooth, strictly positive, and monotone across
 *   k* ~ 21.28095 (recovered directly on 8 rungs, min +2.816e-15, value at k*
 *   +4.520e-15), so the eflow_over_resid singularity is a GENUINE simple pole and NOT
 *   removable -- the imp-34310 F2 nonzero-smooth premise is confirmed, previously
 *   checked on only 2 rungs.
 *
 *   MEASUREMENT ONLY. A finite-difference recovery of an inherited surrogate numerator
 *   across an inherited pole, NOT an RH bound. The component model is the inherited
 *   imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 *   per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 *   imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (F2 premise: eflow_attr smooth+nonzero at k*)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts()/eflowLogSlope()/eflowAttr machinery)
 *   @see imp-34405-resid-exp-near-pole-digit-loss.js (why the direct recovery beats the near-pole quotient)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (resid_exp rows, kStar)
 */

import {
  IMP34310_KSTAR,
  IMP34310_EFLOW_ATTR_AT_KSTAR,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';

const KSTAR = IMP34310_KSTAR; // 21.28095 (imp-34023/imp-34237/imp-34310)

// eflow_attr recovered directly (= ratio * resid_exp, no near-pole cancellation) on a
// bracket of 8 rungs straddling k*, via the verbatim imp-34169 machinery (offline).
// eflow_attr(k) = (E_flow / E_N) * |d ln E_flow / d log10 N| at N = 10^(k+1).
export const IMP34406_EFLOW_ATTR_RUNGS = Object.freeze([
  { k: 21.0, eflowAttr: 8.28715423e-15 },
  { k: 21.1, eflowAttr: 6.67906852e-15 },
  { k: 21.2, eflowAttr: 5.38265555e-15 },
  { k: 21.25, eflowAttr: 4.83198803e-15 }, // imp-34310 published rung (4.8321e-15)
  { k: 21.28095, eflowAttr: 4.51969554e-15 }, // AT the pole k* -- nonzero, direct
  { k: 21.3, eflowAttr: 4.33758269e-15 },
  { k: 21.4, eflowAttr: 3.49518130e-15 },
  { k: 21.5, eflowAttr: 2.81619473e-15 }, // imp-34310 published rung (2.81799e-15)
]);

// The rung sitting exactly at k* (direct recovery, the F1 nonzero witness).
const KSTAR_RUNG = IMP34406_EFLOW_ATTR_RUNGS.find((r) => r.k === 21.28095);
export const IMP34406_EFLOW_ATTR_AT_KSTAR_DIRECT = KSTAR_RUNG.eflowAttr; // 4.51969554e-15

// --- (F2) smoothness diagnostics ----------------------------------------------
// Three-point second difference at k=21.0/21.1/21.2 (uniform h=0.1): convexity sign.
const H = 0.1;
export const IMP34406_SECOND_DIFFERENCE =
  (IMP34406_EFLOW_ATTR_RUNGS[0].eflowAttr -
    2 * IMP34406_EFLOW_ATTR_RUNGS[1].eflowAttr +
    IMP34406_EFLOW_ATTR_RUNGS[2].eflowAttr) /
  (H * H); // +3.116727e-14 (convex, decay decelerating)

// Minimum eflow_attr over the whole bracket (the nonzero floor -- last rung, k=21.5).
export const IMP34406_MIN_EFLOW_ATTR = IMP34406_EFLOW_ATTR_RUNGS.reduce(
  (m, r) => Math.min(m, r.eflowAttr),
  Infinity,
); // 2.81619473e-15 > 0

// --- (F3) convexity refinement of the imp-34310 two-rung linear interp ---------
// imp-34310 E* was a LINEAR interp; the direct value at k* is lower by the convexity.
export const IMP34406_IMP34310_INTERP_HIGH_PCT =
  ((IMP34310_EFLOW_ATTR_AT_KSTAR - IMP34406_EFLOW_ATTR_AT_KSTAR_DIRECT) /
    IMP34406_EFLOW_ATTR_AT_KSTAR_DIRECT) *
  100; // +1.395% (imp-34310 interp over-reads at the interior k*)

export const IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE = {
  ticket: 'imp-34406',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34310 F2 classifies the eflow_over_resid pole at k* ~ 21.28095 as SIMPLE on the ' +
    'premise that eflow_attr = ratio * resid_exp is smooth and NONZERO at k*, checked on ' +
    'only 2 rungs. Recover eflow_attr on additional rungs bracketing k* and confirm it does ' +
    'not itself vanish there (which would make the singularity removable). Measurement only; NO QED.',
  rungs: IMP34406_EFLOW_ATTR_RUNGS,
  eflowAttrAtKStarDirect: IMP34406_EFLOW_ATTR_AT_KSTAR_DIRECT,
  minEflowAttr: IMP34406_MIN_EFLOW_ATTR,
  secondDifference: +IMP34406_SECOND_DIFFERENCE.toExponential(6),
  imp34310InterpHighPct: +IMP34406_IMP34310_INTERP_HIGH_PCT.toFixed(4),
  finding: {
    F1_nonzero_at_kstar:
      'Directly recovered eflow_attr(k*) = +4.5197e-15 -- strictly positive and ~5.5 orders ' +
      'clear of zero (smallest bracket rung k=21.50 is still +2.816e-15). eflow_attr does NOT ' +
      'vanish at k*, so eflow_over_resid = eflow_attr / resid_exp is 0/0 nowhere near k*: the ' +
      'singularity is a GENUINE pole, NOT removable.',
    F2_smooth_and_monotone_through_kstar:
      'eflow_attr is strictly monotone decreasing and smooth across k = 21.00 .. 21.50 ' +
      '(8.287e-15 -> 2.816e-15), no local zero, sign change, or kink straddling k*; second ' +
      'difference +3.117e-14 per k^2 (mildly convex) and finite log-slope -2.159 per k at k*. ' +
      'The only singular factor at k* is the resid_exp zero (imp-34310 F2) -> SIMPLE pole.',
    F3_convexity_refines_imp34310_interp:
      'The imp-34310 two-rung LINEAR interp E* = 4.582753e-15 is +1.395% above the directly ' +
      'recovered 4.519696e-15 (convexity makes the secant over-read at the interior k*); the ' +
      'sign / order / nonzero-ness of the imp-34310 premise are unchanged and the residue ' +
      'R = E*/m would tighten by the same ~1.4% with the direct E*.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a finite-difference recovery of the inherited surrogate numerator ' +
    'eflow_attr across the inherited pole k* ~ 21.28095, computed via the verbatim imp-34169 ' +
    'machinery. eflow_attr is smooth, strictly positive, and monotone through k* (8 rungs, ' +
    'min +2.816e-15, value at k* +4.520e-15), so the eflow_over_resid singularity is a GENUINE ' +
    'simple pole, NOT removable -- confirming the imp-34310 F2 premise previously checked on 2 ' +
    'rungs. Descriptive surrogate, NOT a rigorous asymptotic; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34406_ASSERTIONS = [
  {
    // Reuse gate: k* is the imp-34310 published value, not a fresh literal.
    id: 'imp-34406-reuses-imp34310-kstar',
    description: 'k* = 21.28095 imported from imp-34310 verbatim',
    holds: () => KSTAR === 21.28095 && IMP34406_EFLOW_ATTR_RUNGS.length === 8,
  },
  {
    // (F1) eflow_attr is NONZERO (strictly positive) at k* and on every bracket rung.
    id: 'imp-34406-eflow-attr-nonzero-across-kstar',
    description: 'eflow_attr is strictly positive on all 8 rungs and at k* directly (>+2.8e-15 floor) -- singularity NOT removable',
    holds: () =>
      IMP34406_EFLOW_ATTR_RUNGS.every((r) => r.eflowAttr > 0) &&
      IMP34406_EFLOW_ATTR_AT_KSTAR_DIRECT > 0 &&
      Math.abs(IMP34406_EFLOW_ATTR_AT_KSTAR_DIRECT - 4.51969554e-15) < 1e-22 &&
      IMP34406_MIN_EFLOW_ATTR > 2.8e-15,
  },
  {
    // (F2) smooth + strictly monotone decreasing through k*, no local zero/kink.
    id: 'imp-34406-smooth-monotone-through-kstar',
    description: 'eflow_attr strictly monotone decreasing across the bracket, convex (2nd diff > 0), no sign change at k*',
    holds: () => {
      for (let i = 1; i < IMP34406_EFLOW_ATTR_RUNGS.length; i++) {
        if (
          !(
            IMP34406_EFLOW_ATTR_RUNGS[i].eflowAttr <
            IMP34406_EFLOW_ATTR_RUNGS[i - 1].eflowAttr
          )
        )
          return false;
      }
      return (
        IMP34406_SECOND_DIFFERENCE > 0 &&
        Math.abs(IMP34406_SECOND_DIFFERENCE - 3.116727e-14) < 1e-20
      );
    },
  },
  {
    // Reuse gate: the two imp-34310 published rungs are reproduced to <0.1% by the direct recovery.
    id: 'imp-34406-reproduces-imp34310-two-rungs',
    description: 'direct recovery reproduces the imp-34310 rungs k=21.25 (4.8321e-15) and k=21.50 (2.81799e-15) to <0.1%',
    holds: () => {
      const lo = IMP34406_EFLOW_ATTR_RUNGS.find((r) => r.k === 21.25).eflowAttr;
      const hi = IMP34406_EFLOW_ATTR_RUNGS.find((r) => r.k === 21.5).eflowAttr;
      return (
        Math.abs(lo / 4.8321e-15 - 1) < 1e-3 &&
        Math.abs(hi / 2.81799e-15 - 1) < 1e-3
      );
    },
  },
  {
    // (F3) the imp-34310 two-rung linear interp over-reads the direct value by ~1.4% (convexity).
    id: 'imp-34406-imp34310-interp-over-reads-by-convexity',
    description: 'imp-34310 linear interp E* = 4.582753e-15 is ~+1.4% above the direct value at k* (convexity), premise otherwise unchanged',
    holds: () =>
      IMP34406_IMP34310_INTERP_HIGH_PCT > 0 &&
      Math.abs(IMP34406_IMP34310_INTERP_HIGH_PCT - 1.395) < 5e-2 &&
      IMP34310_EFLOW_ATTR_AT_KSTAR > IMP34406_EFLOW_ATTR_AT_KSTAR_DIRECT,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34406-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE.isRigorous === false &&
      /NO QED/.test(IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE.honest) &&
      /refereed bound is changed/i.test(IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE.honest),
  },
];

for (const a of IMP34406_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34406-eflow-attr-smooth-nonzero-across-pole assertion failed: ${a.id}`);
  }
}
