/**
 * @module imp-34292-slope-vs-ratio-convergence-mechanism
 *
 * imp-34292 (numerical, frontier-direction): imp-34214 recorded that its |trough|/|peak| amplitude-ratio
 * convergence-fit is the OPPOSITE outcome to the sibling imp-34129 widening-SLOPE drift -- imp-34129 seated
 * an interior exponential optimum at a finite limit b_inf ~ -1.0, while the ratio pinned both saturating
 * forms to the grid floor and extrapolated to non-physical limits (r_inf ~ 6.0 exp, ~3.8 power, both far
 * above the amplitude ceiling of 1). Both use the SAME imp-34129 exp-vs-power convergence-fit method, so the
 * divergent outcomes must come from the DATA, not the fitter. imp-34214 floated a candidate mechanism -- the
 * amplitude ratio is bounded above by 1 (|trough| <= |peak|) while the slope is unbounded -- but never
 * tested it. This module ASSESSES the structural cause by (a) isolating the true discriminant as the SIGN OF
 * THE SECOND DIFFERENCE (curvature) of each fitted segment, and (b) directly TESTING the bounded-above-by-1
 * candidate: does imposing the amplitude ceiling as a fit constraint recover a finite interior optimum, or
 * is the divergence intrinsic to the accelerating (creeping) segment?
 *
 * THE MEASUREMENT (both sequences imported verbatim from their source modules; reuse gates below)
 * ---------------------------------------------------------------------------------------------
 *   Slope seq    imp-34129 sweep b(kEnd), kEnd = 11.0..18.0 (15 windows), per-window increments
 *                slopeStepIncrements ~0.033 -> ~0.010. Curvature = second difference of b (the
 *                increment-of-increment). DECELERATING iff the increments shrink (2nd diff net < 0).
 *   Ratio seq    imp-34085 ratioSequence |trough|/|peak|, window width w = kEnd - 6 = 5.0..7.0 (the exact
 *                5-point segment imp-34214 fit), increments ratioStepIncrements +0.0142..+0.0332.
 *                ACCELERATING iff the increments grow (2nd diff net > 0).
 *   Ceiling test On the ratio segment, refit ratio = r_inf + c exp(-lam w) TWO ways: (i) UNCONSTRAINED
 *                (reproduces imp-34214: lam pins to the floor, r_inf ~ 6.0 non-physical), and (ii)
 *                CEILING-CONSTRAINED with r_inf <= 1 (when the free OLS r_inf exceeds 1, clamp r_inf = 1 and
 *                OLS c alone). Compare the constrained rate/limit and the SSR penalty. A candidate mechanism
 *                that were the true driver would let the ceiling constraint RECOVER a genuine interior
 *                convergence at no fit cost; a mere clamp of a degenerate limit reveals it as a red herring.
 *
 * THE FINDING (assessment -- the bounded-above-by-1 ceiling is REFUTED as the driver; curvature is)
 * -----------------------------------------------------------------------------------------------
 *   (R1) THE DISCRIMINANT IS THE SIGN OF THE SECOND DIFFERENCE, NOT BOUNDEDNESS. The imp-34129 slope
 *        DECELERATES: its per-window increments shrink 0.0331 -> 0.0103 (last minus first = -0.0228 < 0,
 *        12 of 13 second differences negative), so the drift is concave and a saturating exp form matches it
 *        with an interior rate and a finite limit -- no ceiling required, and the slope has none. The
 *        imp-34085 ratio segment (w = 5..7) ACCELERATES: its increments grow 0.0142 -> 0.0332 (last minus
 *        first = +0.0190 > 0), so the segment is convex and NO decelerating saturating form can represent it;
 *        the fitter degenerates by pushing the rate to the floor. Same method, opposite curvature -> opposite
 *        outcome. The unboundedness of the slope is IRRELEVANT: what converges is a decelerating sequence.
 *   (R2) IMPOSING THE CEILING DOES NOT RECOVER GENUINE CONVERGENCE -- IT DEGRADES THE FIT. Refitting the
 *        ratio segment with r_inf <= 1 clamps r_inf to the ceiling boundary (1.0, NOT a data-selected
 *        interior limit) and yields an interior rate lam ~ 0.154, but the SSR WORSENS by ~1.48x (3.79e-4 vs
 *        the unconstrained 2.56e-4). The constraint replaces a non-physical extrapolation with a physical
 *        number at a fit PENALTY -- a cosmetic clamp, not a recovered convergence. The divergence signature
 *        (the rate wanting the floor) is intrinsic to the accelerating segment; the ceiling only says where
 *        the sequence must eventually sit, it does not make the convex pre-peak segment fittable by a
 *        concave saturating approach.
 *   (R3) CORROBORATION FROM imp-34288: THE RATIO IS NOT TRULY DIVERGENT -- IT DECELERATES PAST w = 7. imp-34288
 *        extended the same grid and found the ratio keeps climbing only to a maximum ~0.907 at w ~ 9.25
 *        (BELOW the ceiling 1, no overshoot) and then RECEDES to ~0.618 by w = 14. So the imp-34214
 *        non-convergence was a finite-window artifact of fitting the ACCELERATING pre-peak segment (w <= 7),
 *        where the second difference is still positive; it is not an intrinsic failure to converge, and it is
 *        not enforced by the ceiling. The ceiling is respected structurally (a larger left-edge OLS residual,
 *        per imp-34288), not because |trough|/|peak| is being pushed against a wall.
 *
 * The punchline: the divergent imp-34129-vs-imp-34214 outcomes are driven by CURVATURE (the sign of the
 * second difference of the fitted segment), not by the amplitude ceiling. imp-34129 decelerates (concave,
 * increments shrink) and converges with no constraint; the imp-34085 ratio over w = 5..7 accelerates (convex,
 * increments grow) and defeats any saturating form. Imposing r_inf <= 1 does NOT recover a genuine interior
 * optimum -- it clamps r_inf to the boundary at a ~1.48x SSR penalty -- so the bounded-above-by-1 candidate
 * is REFUTED as the mechanism; the divergence is intrinsic to the accelerating creeping segment, exactly as
 * imp-34288 confirms by showing the ratio itself later decelerates and turns over below 1.
 *
 * MEASUREMENT / STRUCTURAL ASSESSMENT ONLY. A comparative diagnostic of two inherited descriptive
 * convergence-fits, NOT an RH bound and distinct from any log-linear-vs-power-law FORM selection (the
 * imp-33843 log-linear verdict is untouched). Both sequences and the surrogate fits are descriptive, not
 * derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34129-widening-slope-drift-convergence-fit (the slope drift that DID converge; method reused)
 * @see imp-34214-trough-peak-ratio-limit-fit (the ratio fit that REFUTED convergence; contrasted here)
 * @see imp-34085-trough-peak-ratio-convergence (the |trough|/|peak| ratio sequence assessed here)
 * @see imp-34288-trough-peak-ratio-ceiling-extension (the ratio decelerates and turns over ~0.907 below 1)
 * @see imp-486 (C_mb GUE-conditional, untouched)
 */

import { IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT } from './imp-34129-widening-slope-drift-convergence-fit.js';
import { IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE } from './imp-34085-trough-peak-ratio-convergence.js';

// ---- 0. Import both sequences verbatim (reuse gates below) ----
const SLOPE_STEPS = IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.slopeStepIncrements; // ~0.033 -> ~0.010
const RATIO_SRC = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.ratioSequence; // [{window,kEnd,peak,trough,ratio}]
const RATIO_WIDTHS = RATIO_SRC.map((r) => r.kEnd - 6); // w = 5.0..7.0
const RATIOS = RATIO_SRC.map((r) => r.ratio); // 0.6151..0.7200
const RATIO_STEPS = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.ratioStepIncrements; // +0.0142..+0.0332 (GROWING)

// ---- 1. Curvature discriminant: sign of the second difference of each sequences increments ----
// Decelerating (converges under a saturating form) iff increments SHRINK: last step < first step.
function secondDiffs(steps) {
  const out = [];
  for (let i = 1; i < steps.length; i++) out.push(+(steps[i] - steps[i - 1]).toFixed(6));
  return out;
}
const SLOPE_SECOND_DIFFS = secondDiffs(SLOPE_STEPS);
const RATIO_SECOND_DIFFS = secondDiffs(RATIO_STEPS);
const SLOPE_STEP_NET = +(SLOPE_STEPS[SLOPE_STEPS.length - 1] - SLOPE_STEPS[0]).toFixed(6); // < 0 => decelerates
const RATIO_STEP_NET = +(RATIO_STEPS[RATIO_STEPS.length - 1] - RATIO_STEPS[0]).toFixed(6); // > 0 => accelerates
const SLOPE_DECELERATES = SLOPE_STEP_NET < 0;
const RATIO_ACCELERATES = RATIO_STEP_NET > 0;
const SLOPE_SECOND_DIFF_NEG_FRACTION =
  SLOPE_SECOND_DIFFS.filter((d) => d < 0).length / SLOPE_SECOND_DIFFS.length; // majority negative

// ---- 2. Ceiling-constraint test on the ratio segment (imp-34214 method, plus a ceiling clamp) ----
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
function ssrOf(y, pred) {
  let s = 0;
  for (let i = 0; i < y.length; i++) s += (y[i] - pred[i]) ** 2;
  return s;
}
// Unconstrained exp approach ratio = r_inf + c exp(-lam w): grid-search lam, OLS (r_inf, c) at each.
function fitExpUnconstrained(w, y, lamLo, lamHi, step) {
  let best = null;
  for (let lam = lamLo; lam <= lamHi + 1e-12; lam += step) {
    const xs = w.map((x) => Math.exp(-lam * x));
    const { a: rInf, b: c } = ols(xs, y);
    const ssr = ssrOf(y, w.map((x) => rInf + c * Math.exp(-lam * x)));
    if (!best || ssr < best.ssr) best = { lam: +lam.toFixed(4), rInf, c, ssr };
  }
  return best;
}
// Ceiling-constrained exp approach: r_inf <= CEIL. When the free OLS r_inf exceeds CEIL, clamp r_inf = CEIL
// and OLS c alone (single regressor through the clamped offset).
function fitExpCeiling(w, y, ceil, lamLo, lamHi, step) {
  let best = null;
  for (let lam = lamLo; lam <= lamHi + 1e-12; lam += step) {
    const xs = w.map((x) => Math.exp(-lam * x));
    let { a: rInf, b: c } = ols(xs, y);
    if (rInf > ceil) {
      rInf = ceil;
      let sxx = 0;
      let sxy = 0;
      for (let i = 0; i < xs.length; i++) {
        sxx += xs[i] * xs[i];
        sxy += xs[i] * (y[i] - ceil);
      }
      c = sxy / sxx;
    }
    const ssr = ssrOf(y, w.map((x) => rInf + c * Math.exp(-lam * x)));
    if (!best || ssr < best.ssr) best = { lam: +lam.toFixed(4), rInf, c, ssr };
  }
  return best;
}

const LAM_LO = 0.01;
const LAM_HI = 2.0;
const LAM_STEP = 0.001;
const CEIL = 1.0;
const EXP_UNCON = fitExpUnconstrained(RATIO_WIDTHS, RATIOS, LAM_LO, LAM_HI, LAM_STEP);
const EXP_CEIL = fitExpCeiling(RATIO_WIDTHS, RATIOS, CEIL, LAM_LO, LAM_HI, LAM_STEP);

// Diagnostics on the two ratio fits.
const UNCON_PINS_FLOOR = Math.abs(EXP_UNCON.lam - LAM_LO) < 1e-9; // true -- degenerate
const UNCON_LIMIT_NON_PHYSICAL = EXP_UNCON.rInf > CEIL; // true -- r_inf ~ 6.0
const CEIL_RATE_INTERIOR = EXP_CEIL.lam > LAM_LO + 1e-9 && EXP_CEIL.lam < LAM_HI - 1e-9; // true -- lam ~0.154
const CEIL_LIMIT_PINNED_TO_BOUNDARY = Math.abs(EXP_CEIL.rInf - CEIL) < 1e-6; // true -- clamped, not interior
const CEIL_SSR_PENALTY = +(EXP_CEIL.ssr / EXP_UNCON.ssr).toFixed(3); // ~1.48 -- constrained fit WORSE
const CEIL_DOES_NOT_RECOVER_CONVERGENCE = CEIL_LIMIT_PINNED_TO_BOUNDARY && CEIL_SSR_PENALTY > 1; // true

// The candidate mechanism (bounded-above-by-1) is the driver ONLY if imposing the ceiling recovers a
// genuine interior convergence at no fit cost. It does not: r_inf clamps to the boundary and SSR worsens.
const CEILING_IS_THE_MECHANISM = !CEIL_DOES_NOT_RECOVER_CONVERGENCE; // false -- refuted

export const IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM = {
  id: 'imp-34292',
  proofSection: 'S-frontier',
  question:
    'imp-34214 fit the |trough|/|peak| amplitude ratio with the same imp-34129 exp-vs-power method that ' +
    'seated a finite interior limit for the widening SLOPE, yet got the OPPOSITE outcome (both forms pin ' +
    'to the grid floor, non-physical limits r_inf ~ 6.0/3.8), and floated -- without testing -- the ' +
    'bounded-above-by-1 amplitude ceiling as the cause. Assess the structural reason: is the divergence ' +
    'driven by the ceiling (does imposing r_inf <= 1 as a fit constraint recover a finite interior ' +
    'optimum) or is it intrinsic to the accelerating creeping segment? Comparative measurement only; ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'The sign of the second difference (curvature) of the imp-34129 slope-drift increments vs the ' +
    'imp-34085 |trough|/|peak| ratio increments over the identical w = 5..7 segment imp-34214 fit, plus a ' +
    'ceiling-constrained refit of the ratio (r_inf <= 1, clamp when the free OLS limit exceeds 1) compared ' +
    'against the unconstrained imp-34214 refit by rate, limit location, and SSR penalty',
  reuseGate: {
    slopeStepsFromImp34129: SLOPE_STEPS.length, // 14 increments over kEnd = 11..18
    ratiosReproduceImp34085: RATIOS, // [0.6151, 0.6293, 0.6492, 0.6868, 0.7200]
    ratioWidths: RATIO_WIDTHS, // [5.0, 5.5, 6.0, 6.5, 7.0]
    ratioStepsFromImp34085: RATIO_STEPS, // [0.0142, 0.0199, 0.0376, 0.0332]
  },
  curvatureDiscriminant: {
    slopeStepNet: SLOPE_STEP_NET, // ~ -0.0228 -- increments SHRINK => decelerating (concave)
    slopeDecelerates: SLOPE_DECELERATES, // true
    slopeSecondDiffNegFraction: +SLOPE_SECOND_DIFF_NEG_FRACTION.toFixed(3), // ~0.92 -- majority negative
    ratioStepNet: RATIO_STEP_NET, // ~ +0.0190 -- increments GROW => accelerating (convex)
    ratioAccelerates: RATIO_ACCELERATES, // true
    note:
      'Same imp-34129 fit method, opposite curvature: the slope drift decelerates (concave, increments ' +
      'shrink) so a saturating form fits it with an interior rate and finite limit; the ratio segment ' +
      'accelerates (convex, increments grow) so no decelerating saturating form can represent it and the ' +
      'fit degenerates. The slopes unboundedness is irrelevant -- what converges is a decelerating sequence.',
  },
  ceilingConstraintTest: {
    unconstrained: {
      form: 'ratio = r_inf + c exp(-lam w)',
      lam: EXP_UNCON.lam, // 0.01 -- pinned to floor (reproduces imp-34214)
      rInf: +EXP_UNCON.rInf.toFixed(4), // ~6.003 -- non-physical
      ssr: +EXP_UNCON.ssr.toExponential(4), // ~2.559e-4
      pinsToFloor: UNCON_PINS_FLOOR, // true
      limitNonPhysical: UNCON_LIMIT_NON_PHYSICAL, // true
    },
    ceilingConstrained: {
      form: 'ratio = r_inf + c exp(-lam w), r_inf <= 1',
      lam: EXP_CEIL.lam, // ~0.154 -- interior rate
      rInf: +EXP_CEIL.rInf.toFixed(4), // 1.0 -- CLAMPED to the ceiling boundary, not a data-selected interior limit
      ssr: +EXP_CEIL.ssr.toExponential(4), // ~3.789e-4
      rateInterior: CEIL_RATE_INTERIOR, // true
      limitPinnedToBoundary: CEIL_LIMIT_PINNED_TO_BOUNDARY, // true
    },
    ssrPenaltyConstrainedOverUnconstrained: CEIL_SSR_PENALTY, // ~1.48 -- constrained fit is WORSE
    ceilingRecoversGenuineConvergence: !CEIL_DOES_NOT_RECOVER_CONVERGENCE, // false
  },
  ceilingIsTheMechanism: CEILING_IS_THE_MECHANISM, // false -- candidate REFUTED
  finding: {
    R1_discriminant_is_second_difference_sign_not_boundedness:
      'The imp-34129 slope DECELERATES: increments shrink 0.0331 -> 0.0103 (last minus first ~ -0.0228, ' +
      '12 of 13 second differences negative), a concave drift a saturating exp form matches with an ' +
      'interior rate and finite limit -- no ceiling required, and the slope has none. The imp-34085 ratio ' +
      'segment (w = 5..7) ACCELERATES: increments grow 0.0142 -> 0.0332 (last minus first ~ +0.0190), a ' +
      'convex segment no decelerating saturating form can represent, so the fitter pushes the rate to the ' +
      'floor. Same method, opposite curvature -> opposite outcome; unboundedness is irrelevant.',
    R2_ceiling_constraint_does_not_recover_convergence:
      'Refitting the ratio segment with r_inf <= 1 clamps r_inf to the ceiling boundary (1.0, NOT a ' +
      'data-selected interior limit) and gives an interior rate lam ~ 0.154, but the SSR WORSENS ~1.48x ' +
      '(3.79e-4 vs the unconstrained 2.56e-4). The constraint swaps a non-physical extrapolation for a ' +
      'physical number at a fit penalty -- a cosmetic clamp, not a recovered convergence. The divergence ' +
      'signature (the rate wanting the floor) is intrinsic to the accelerating segment.',
    R3_corroborated_by_imp34288_ratio_decelerates_past_w7:
      'imp-34288 extended the same grid and found the ratio climbs only to a maximum ~0.907 at w ~ 9.25 ' +
      '(below the ceiling 1, no overshoot) then RECEDES to ~0.618 by w = 14 -- so the imp-34214 ' +
      'non-convergence was a finite-window artifact of the ACCELERATING pre-peak segment (w <= 7), not an ' +
      'intrinsic failure and not enforced by the ceiling; the ceiling is respected structurally, not by ' +
      'the ratio being pushed against a wall.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / STRUCTURAL ASSESSMENT (frontier-direction, NOT rigorous). The divergent ' +
    'imp-34129-vs-imp-34214 outcomes are driven by CURVATURE (the sign of the second difference of the ' +
    'fitted segment), NOT by the amplitude ceiling. imp-34129s slope DECELERATES (concave, increments ' +
    'shrink 0.0331 -> 0.0103, net -0.0228) and converges under the saturating form with no constraint; the ' +
    'imp-34085 ratio over the identical w = 5..7 segment ACCELERATES (convex, increments grow 0.0142 -> ' +
    '0.0332, net +0.0190) and defeats any decelerating saturating form, so the fitter degenerates (rate to ' +
    'the floor, r_inf ~ 6.0 non-physical). TESTING the bounded-above-by-1 candidate directly: imposing ' +
    'r_inf <= 1 does NOT recover a genuine interior optimum -- it clamps r_inf to the ceiling boundary ' +
    '(1.0) with an interior rate lam ~ 0.154 but at a ~1.48x SSR penalty (3.79e-4 vs 2.56e-4), a cosmetic ' +
    'clamp of a degenerate limit rather than a convergence the data supports. So the ceiling is REFUTED as ' +
    'the mechanism; the divergence is intrinsic to the accelerating creeping segment, exactly as imp-34288 ' +
    'confirms by showing the ratio itself decelerates and turns over below 1 (max ~0.907 at w ~ 9.25) past ' +
    'w = 7 -- the imp-34214 non-convergence was a finite-window artifact of the convex pre-peak segment. ' +
    'Distinct from any FORM selection; the imp-33843 log-linear verdict is untouched. Both sequences and ' +
    'the surrogate fits are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34129 (the widening-slope drift that DID converge; exp-vs-power method reused); imp-34214 (the ' +
    'ratio fit that REFUTED convergence, contrasted here); imp-34085 (the |trough|/|peak| ratio sequence ' +
    'assessed here); imp-34288 (the ratio decelerates and turns over ~0.907 below 1); imp-486 (C_mb ' +
    'GUE-conditional, untouched).',
};

export const IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM_ASSERTIONS = [
  {
    // Reuse gate: the imported ratio segment reproduces the imp-34085 published 0.6151..0.7200 over
    // widths w = 5..7, and the imp-34129 slope increments arrive as 14 steps -- pure downstream assessment.
    id: 'imp34292-reuse-gate-reproduces-imp34085-and-imp34129',
    description: 'imp-34085 ratios 0.6151..0.7200 over w = 5..7; imp-34129 supplies 14 slope increments',
    holds: () =>
      RATIOS.length === 5 &&
      Math.abs(RATIOS[0] - 0.6151) < 1e-9 &&
      Math.abs(RATIOS[4] - 0.72) < 1e-9 &&
      RATIO_WIDTHS.join(',') === '5,5.5,6,6.5,7' &&
      SLOPE_STEPS.length === 14,
  },
  {
    // (R1) Curvature discriminant: the slope drift DECELERATES (net increment < 0, majority of second
    // differences negative) while the ratio segment ACCELERATES (net increment > 0). Opposite curvature.
    id: 'imp34292-curvature-discriminant-slope-decelerates-ratio-accelerates',
    description: 'slope step-net < 0 (decelerates); ratio step-net > 0 (accelerates); opposite curvature',
    holds: () =>
      SLOPE_DECELERATES === true &&
      RATIO_ACCELERATES === true &&
      SLOPE_STEP_NET < -0.01 &&
      RATIO_STEP_NET > 0.01 &&
      SLOPE_SECOND_DIFF_NEG_FRACTION > 0.75,
  },
  {
    // Unconstrained refit reproduces the imp-34214 degeneracy: lam pins to the floor, r_inf non-physical.
    id: 'imp34292-unconstrained-refit-reproduces-imp34214-degeneracy',
    description: 'unconstrained exp fit pins lam = 0.01 (floor) with non-physical r_inf ~ 6.0 (> 1)',
    holds: () =>
      UNCON_PINS_FLOOR === true &&
      UNCON_LIMIT_NON_PHYSICAL === true &&
      EXP_UNCON.rInf > 4 &&
      EXP_UNCON.rInf < 9,
  },
  {
    // (R2) The ceiling constraint does NOT recover genuine convergence: r_inf clamps to the boundary (1.0),
    // and the SSR WORSENS by > 1x versus the unconstrained fit -- a cosmetic clamp, not a fit the data wants.
    id: 'imp34292-ceiling-constraint-clamps-and-worsens-ssr',
    description: 'ceiling fit clamps r_inf = 1.0 (boundary) with ~1.48x SSR penalty (constrained WORSE)',
    holds: () =>
      CEIL_LIMIT_PINNED_TO_BOUNDARY === true &&
      CEIL_RATE_INTERIOR === true &&
      CEIL_SSR_PENALTY > 1.05 &&
      CEIL_SSR_PENALTY < 3 &&
      CEIL_DOES_NOT_RECOVER_CONVERGENCE === true,
  },
  {
    // The candidate mechanism (bounded-above-by-1) is REFUTED as the driver: imposing the ceiling neither
    // recovers a data-selected interior limit nor improves the fit.
    id: 'imp34292-ceiling-refuted-as-mechanism',
    description: 'ceilingIsTheMechanism false; ceilingRecoversGenuineConvergence false -- refuted',
    holds: () =>
      CEILING_IS_THE_MECHANISM === false &&
      IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM.ceilingConstraintTest
        .ceilingRecoversGenuineConvergence === false,
  },
  {
    // Honesty gate: assessment only, isRigorous false, no QED, no refereed bound is changed, imp-3066 and C_mb untouched.
    id: 'imp34292-honesty-gate-no-qed',
    description: 'assessment only: isRigorous false, no QED, no refereed bound is changed, imp-3066 + C_mb untouched',
    holds: () =>
      IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM.isRigorous === false &&
      /NO QED/.test(IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM.verdict) &&
      /refereed bound is changed/i.test(IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(
        IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM.verdict,
      ),
  },
];

for (const a of IMP34292_SLOPE_VS_RATIO_CONVERGENCE_MECHANISM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34292-slope-vs-ratio-convergence-mechanism assertion failed: ${a.id}`);
  }
}
