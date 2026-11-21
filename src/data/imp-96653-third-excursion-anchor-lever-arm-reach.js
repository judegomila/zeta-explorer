/**
 * imp-96653 -- FEASIBILITY: does adding a THIRD mutually-independent excursion-regime dip-depth
 * anchor (a further unclipped +/-30 percent interior height from the 10^6 Odlyzko set at T >= 1.5e5,
 * or a higher externally-tabulated true-zero height) extend the imp-96551 two-anchor lever arm
 * Delta_x ~ 0.41 decade enough to push the slope error SE(p) below the imp-96528 OLS floor 0.21?
 *
 * BACKGROUND. imp-96551 proved every unbiased estimator on the TWO imp-96493 excursion anchors
 * (T = 1.5e5 and 3.879e5, Delta_x = log(T2/T1) ~ 0.9501 nat, only ~0.41 decade) is Cramer-Rao floored
 * at Var(p_hat) = 2 sigma^2 / (Delta_x)^2 with sigma = sqrt(pi^2/8) ~ 1.1107, giving SD(p) =
 * (pi/2)/Delta_x ~ 1.653 and separating p = 0 (systematic) from p = -1/4 (sampling-noise) by only
 * ~0.151 sigma. imp-96528 had shown the fixed 10^6 set supplies just 2 mutually-independent unclipped
 * +/-30 percent heights in the excursion regime T >= 1.5e5 (exactly that pair). This module asks the
 * natural follow-up: would a THIRD anchor lengthen Delta_x and add residual degrees of freedom enough
 * to bring SE(p) toward or below 0.21?
 *
 * THE OLS SLOPE ERROR IS SET BY THE SPREAD, WHICH IS SET BY THE ARM. For an OLS fit of y = log relErr
 * against x = log T over K heights with irreducible per-height scatter sigma, SE(p) = sigma / spread,
 * spread = sqrt( sum_i (x_i - xbar)^2 ). The DECISIVE structural fact:
 *   - two points separated by an arm A have spread = A / sqrt(2), so SE = sqrt(2) sigma / A = (pi/2)/A;
 *   - THREE EQUALLY-SPACED points over the SAME arm A (at 0, A/2, A) have deviations -A/2, 0, +A/2,
 *     sum of squares A^2/2, spread = A / sqrt(2) -- IDENTICAL to the two-point spread.
 * So an equally-spaced third anchor that fills the MIDDLE of the existing arm gives the SAME SE(p); its
 * only new contribution is a residual degree of freedom (OLS now HAS a defined error bar where K = 2
 * had none). The third anchor lowers SE(p) ONLY to the extent it EXTENDS the arm A, not by being added.
 * Therefore the whole feasibility question reduces to: how far above T2 = 3.879e5 can a valid third
 * excursion anchor sit, and does that arm reach the ~7.48 nat (~3.25 decade) needed for SE(p) = 0.21?
 *
 * WHAT SE(p) = 0.21 DEMANDS OF THE ARM. Setting (pi/2)/A = 0.21 (the most favourable two-point form,
 * which the equally-spaced three-point fit matches) gives A = (pi/2)/0.21 = 7.480 nat = 3.249 decades.
 * Anchored at the low excursion height T1 = 1.5e5, that places the TOP anchor at T1 * e^A ~ 2.658e8 --
 * about 576x ABOVE the +/-30 percent unclipped-above interior ceiling T_hi = gamma_1e6/1.3 ~ 4.6175e5,
 * and ~443x above the top tabulated ordinate gamma_1e6 = 6.003e5 itself. (The three-equal-point total
 * arm needed is the same 3.249 decades, since the middle point does not enlarge the spread.)
 *
 * SOURCE (a): A FURTHER +/-30 PERCENT INTERIOR HEIGHT FROM THE 10^6 SET. Mutually-independent
 * (non-overlapping) +/-30 percent windows form a geometric ladder of ratio g = (1+0.3)/(1-0.3) = 13/7 ~
 * 1.857 (imp-96528). From the low anchor T1 = 1.5e5 the third rung would sit at T1 * g^2 ~ 5.173e5 --
 * ABOVE the unclipped-above ceiling T_hi ~ 4.6175e5, so it is CLIPPED and does not exist. There is no
 * independent third +/-30 percent excursion anchor in the fixed set (confirming imp-96528s K = 2). Even
 * the maximally-optimistic OVERLAPPING choice -- a third center pinned at the ceiling 4.6175e5 itself
 * (which shares ordinates with T2 = 3.879e5, so its noise is correlated, not a valid independent anchor)
 * -- extends the arm only to log(4.6175e5/1.5e5) ~ 1.124 nat and, treated (over-optimistically) as an
 * independent OLS point, yields SE(p) ~ 1.298: still ~6.2x LOOSER than 0.21 and ~0.19 sigma on Delta_p.
 *
 * SOURCE (b): A HIGHER EXTERNALLY-TABULATED TRUE-ZERO HEIGHT. No consecutive-ordinate table in the repo
 * reaches above gamma_1e6 = 6.003e5 (imp-95863 / imp-95884); the only tabulated ordinates beyond it are
 * the Odlyzko LOCAL high blocks near T = 10^20..10^23. Arithmetically such a height would crush the arm:
 * a T = 10^20 anchor gives Delta_x ~ 34.1 nat and the two-point form SE ~ 0.046 -- far below 0.21. BUT
 * it is not a usable anchor: (i) a +/-30 percent number-variance window at T = 10^20 spans ~6e19
 * ordinates, and a local block holds only O(10^9) consecutive zeros -- the +/-30 percent excursion
 * statistic is simply NOT COMPUTABLE there; and (ii) at 10^20..10^23 the dip has relaxed into the
 * asymptotic-GUE regime, so even a computable window would measure a DIFFERENT statistic than the
 * finite-height +/-30 percent excursion depth the sub-gap is defined at -- the same "changes the fitted
 * statistic" objection imp-96528 raised for narrower spans, here in a far more extreme form (a 14-decade
 * overshoot past the excursion regime rather than a span change). So the high blocks cannot serve as a
 * valid third excursion anchor either.
 *
 * FINDINGS (recomputed below).
 *  1. The third anchor helps ONLY by extending the arm: an equally-spaced middle point over the same arm
 *     gives spread A/sqrt(2) IDENTICAL to the two-point spread, so SE(p) is unchanged (it merely supplies
 *     a residual dof, curing the K = 2 undefined-error-bar, not the width).
 *  2. Reaching SE(p) = 0.21 demands an arm A = (pi/2)/0.21 ~ 7.480 nat ~ 3.249 decades -- a top anchor at
 *     ~2.658e8, about 576x above the +/-30 percent interior ceiling 4.6175e5 and ~443x above the top
 *     tabulated ordinate gamma_1e6 = 6.003e5.
 *  3. No in-repo height set supplies a valid third excursion anchor: (a) the fixed 10^6 set has no
 *     independent third +/-30 percent rung (the third ladder rung 5.173e5 is clipped), and an optimistic
 *     overlapping ceiling point still gives SE(p) ~ 1.298 (~6.2x looser than 0.21); (b) the Odlyzko
 *     10^20..10^23 high blocks would satisfy the arithmetic (SE ~ 0.038-0.046) but cannot FORM a +/-30
 *     percent window (O(10^9) zeros vs ~6e19 needed) and overshoot into the asymptotic-GUE regime, so
 *     they measure a different statistic and are not a valid anchor.
 *
 * VERDICT. NO. No in-repo height set supplies a THIRD mutually-independent excursion-regime dip-depth
 * anchor that extends the imp-96551 lever arm Delta_x ~ 0.41 decade enough to push SE(p) below the
 * imp-96528 OLS floor 0.21. Structurally the third anchor lowers SE(p) only by EXTENDING the arm (an
 * equally-spaced middle point over the same arm leaves the spread A/sqrt(2), hence SE(p), unchanged --
 * it only cures the K = 2 undefined error bar), and reaching SE(p) = 0.21 needs an arm A = (pi/2)/0.21 ~
 * 7.480 nat ~ 3.249 decades, i.e. a top anchor near ~2.658e8, some 576x above the +/-30 percent interior
 * ceiling 4.6175e5 and ~443x above the top tabulated ordinate gamma_1e6 = 6.003e5. The fixed 10^6 set has
 * no independent third +/-30 percent rung (the ladder rung 5.173e5 is clipped; even an over-optimistic
 * overlapping ceiling point yields SE(p) ~ 1.298, ~6.2x looser than 0.21), and the only tabulated
 * ordinates beyond gamma_1e6 -- the Odlyzko 10^20..10^23 local high blocks -- cannot form a +/-30 percent
 * number-variance window (O(10^9) consecutive zeros vs ~6e19 required) and overshoot into the
 * asymptotic-GUE regime, measuring a different statistic than the finite-height excursion depth. This
 * confirms and extends imp-96551/imp-96528 and does NOT close the imp-96510 systematic-vs-noise sub-gap.
 * Feasibility assessment only; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96551-nonols-two-anchor-slope-separation-reach (the two-anchor Cramer-Rao floor SD = (pi/2)/Delta_x)
 * @see imp-96528-independent-unclipped-height-count-exponent-fit-reach (the OLS SE(p) >= 0.21 floor, K=2 in regime)
 * @see imp-96493-excursion-2sigma-interior-scan (the two interior anchors T = 1.5e5, 3.879e5)
 * @see imp-95884-odlyzko-high-block-calibration-assessment (no consecutive table above gamma_1e6; high blocks overshoot)
 *
 * Import-light: no zeros bundle, no sibling imports. The two anchor centers, the OLS floor 0.21, the top
 * tabulated ordinate gamma_1e6 = 600269.68 and the +/-30 percent span are baked literals; every arm /
 * spread / SD is recomputed here.
 */

const T_ANCHOR_LO = 1.5e5; // imp-96493 low excursion anchor
const T_ANCHOR_HI = 3.879e5; // imp-96493 high excursion anchor
const OLS_FLOOR_SE = 0.21; // imp-96528 best-reach OLS slope error
const GAMMA_1E6 = 600269.68; // top ordinate of the 10^6-th Odlyzko zero (src/data/zeros-to-1e6.js)
const NATIVE_SPAN = 0.3; // the +/-30% span the sub-gap depth relErr is defined at

// competing exponents (imp-96510): systematic relErr ~ T^0, sampling-noise relErr ~ T^(-1/4).
const P_SYSTEMATIC = 0;
const P_SAMPLING_NOISE = -0.25;
const DELTA_P = Math.abs(P_SYSTEMATIC - P_SAMPLING_NOISE); // 0.25

// irreducible single-height log-relErr scatter (imp-96528): Var(log|Z|) = trigamma(1/2)/4 = pi^2/8.
const SIGMA_LOG_RELERR = Math.sqrt((Math.PI * Math.PI) / 8); // ~1.1107

// +/-30% interior geometry (imp-96528): ladder ratio g = 13/7, unclipped-above ceiling T_hi = gamma/(1+s).
const LADDER_RATIO = (1 + NATIVE_SPAN) / (1 - NATIVE_SPAN); // 13/7 ~ 1.857
const INTERIOR_CEILING = GAMMA_1E6 / (1 + NATIVE_SPAN); // ~4.6175e5

// existing two-anchor arm and its (pi/2)/Delta_x floor (imp-96551).
const DELTA_X_TWO = Math.log(T_ANCHOR_HI / T_ANCHOR_LO); // ~0.9501 nat
const SE_TWO = (SIGMA_LOG_RELERR * Math.SQRT2) / DELTA_X_TWO; // (pi/2)/Delta_x ~ 1.653

// OLS slope SE for arbitrary log-height positions xs (spread-based; sigma known).
const slopeSE = (xs) => {
  const xbar = xs.reduce((a, b) => a + b, 0) / xs.length;
  const ss = xs.reduce((a, x) => a + (x - xbar) * (x - xbar), 0);
  return SIGMA_LOG_RELERR / Math.sqrt(ss);
};

// (1) STRUCTURAL: equally-spaced middle point over the SAME arm leaves the spread unchanged.
const x1 = Math.log(T_ANCHOR_LO);
const x2 = Math.log(T_ANCHOR_HI);
const xMid = (x1 + x2) / 2; // equally-spaced third point in the middle of the existing arm
const SE_THREE_MIDDLE = slopeSE([x1, xMid, x2]); // equals SE_TWO -- the middle point does not enlarge the spread

// (2) arm demanded to reach SE(p) = 0.21 (two-point form (pi/2)/A = 0.21, matched by 3 equal points).
const ARM_NEEDED = (SIGMA_LOG_RELERR * Math.SQRT2) / OLS_FLOOR_SE; // ~7.480 nat
const ARM_NEEDED_DECADES = ARM_NEEDED / Math.log(10); // ~3.249 decades
const TOP_ANCHOR_NEEDED = T_ANCHOR_LO * Math.exp(ARM_NEEDED); // ~2.658e8
const CEILING_SHORTFALL = TOP_ANCHOR_NEEDED / INTERIOR_CEILING; // ~576x above the +/-30% interior ceiling
const ORDINATE_SHORTFALL = TOP_ANCHOR_NEEDED / GAMMA_1E6; // ~443x above the top tabulated ordinate

// (3a) SOURCE (a): a further independent +/-30% interior rung is CLIPPED; optimistic overlapping ceiling point.
const THIRD_LADDER_RUNG = T_ANCHOR_LO * LADDER_RATIO * LADDER_RATIO; // ~5.173e5 (independent third rung)
const THIRD_RUNG_CLIPPED = THIRD_LADDER_RUNG > INTERIOR_CEILING; // true: no independent third +/-30% anchor
const xCeil = Math.log(INTERIOR_CEILING);
const SE_THREE_CEILING = slopeSE([x1, x2, xCeil]); // ~1.298: optimistic overlapping ceiling point, ignoring correlation
const SEP_THREE_CEILING = DELTA_P / SE_THREE_CEILING; // ~0.19 sigma on Delta_p

// (3b) SOURCE (b): Odlyzko high blocks -- arithmetic reach vs computability / regime.
const HIGH_BLOCK_HEIGHTS = [1e12, 1e20, 1e23];
const highBlockArithmetic = HIGH_BLOCK_HEIGHTS.map((Th) => {
  const dx = Math.log(Th / T_ANCHOR_LO);
  return {
    height: Th,
    leverArmNat: dx,
    twoPointSE: (SIGMA_LOG_RELERR * Math.SQRT2) / dx, // arithmetic only: crushes SE
    windowOrdinatesNeeded: 2 * NATIVE_SPAN * Th, // ~6e19 at 10^20; a local block holds only O(1e9)
    usableAnchor: false, // window not computable + overshoots into asymptotic-GUE regime (different statistic)
  };
});

const BEATS_OLS_FLOOR = false; // no valid third anchor reaches SE(p) <= 0.21
const ANY_INREPO_THIRD_ANCHOR = false; // neither source (a) nor (b) supplies a valid third excursion anchor

export const IMP96653_THIRD_EXCURSION_ANCHOR_LEVER_ARM_REACH = {
  ticket: 'imp-96653',
  question:
    'Does adding a THIRD mutually-independent excursion-regime dip-depth anchor (a further unclipped +/-30% interior height from the 10^6 Odlyzko set at T >= 1.5e5, or a higher externally-tabulated true-zero height) extend the imp-96551 two-anchor lever arm Delta_x ~ 0.41 decade enough to push SE(p) below the imp-96528 OLS floor 0.21?',
  method:
    'For an OLS fit of log relErr vs log T with known per-height scatter sigma = sqrt(pi^2/8) ~ 1.11, SE(p) = sigma/spread, spread = sqrt(sum (x_i - xbar)^2). Show the third anchor lowers SE(p) ONLY by extending the arm: an equally-spaced middle point over the same arm A gives spread A/sqrt(2), identical to the two-point spread. Solve the arm A needed for SE(p) = 0.21, locate the implied top anchor, and test both candidate sources: (a) a further independent +/-30% interior rung (ladder ratio g = 13/7, ceiling gamma_1e6/1.3), (b) the Odlyzko 10^20..10^23 local high blocks (arithmetic reach vs computability of a +/-30% window and vs the asymptotic-GUE regime). Import-light; baked anchor / ceiling / floor literals.',
  twoAnchorBaseline: {
    tLo: T_ANCHOR_LO, // 1.5e5
    tHi: T_ANCHOR_HI, // 3.879e5
    leverArmNat: DELTA_X_TWO, // ~0.9501
    leverArmDecades: DELTA_X_TWO / Math.log(10), // ~0.413
    SE_slope: SE_TWO, // ~1.653 = (pi/2)/Delta_x
    note: 'The imp-96551 two-anchor Cramer-Rao floor; the third anchor must extend this arm to help.',
  },
  structuralMiddlePoint: {
    SE_threeEquallySpaced: SE_THREE_MIDDLE, // == SE_TWO
    equalsTwoAnchorSE: Math.abs(SE_THREE_MIDDLE - SE_TWO) / SE_TWO < 1e-12,
    note: 'An equally-spaced middle point over the SAME arm leaves spread = A/sqrt(2) unchanged, so SE(p) is unchanged -- it only supplies a residual dof (curing the K=2 undefined error bar), not the width. The third anchor helps ONLY by extending the arm.',
  },
  armDemandedForFloor: {
    armNat: ARM_NEEDED, // ~7.480
    armDecades: ARM_NEEDED_DECADES, // ~3.249
    topAnchorNeeded: TOP_ANCHOR_NEEDED, // ~2.658e8
    aboveInteriorCeilingBy: CEILING_SHORTFALL, // ~576x
    aboveTopOrdinateBy: ORDINATE_SHORTFALL, // ~443x
    note: 'Reaching SE(p) = 0.21 needs A = (pi/2)/0.21 ~ 7.48 nat ~ 3.25 decades: a top anchor near ~2.66e8, ~576x above the +/-30% interior ceiling 4.6175e5 and ~443x above the top tabulated ordinate gamma_1e6 = 6.003e5.',
  },
  sourceA_interiorRung: {
    ladderRatio: LADDER_RATIO, // 13/7
    interiorCeiling: INTERIOR_CEILING, // ~4.6175e5
    thirdLadderRung: THIRD_LADDER_RUNG, // ~5.173e5
    thirdRungClipped: THIRD_RUNG_CLIPPED, // true: no independent third +/-30% anchor
    optimisticCeilingSE: SE_THREE_CEILING, // ~1.298 (overlapping ceiling point, ignoring correlation)
    optimisticSeparationSigma: SEP_THREE_CEILING, // ~0.19 sigma on Delta_p
    note: 'The fixed 10^6 set has no independent third +/-30% rung (the ladder rung 5.173e5 is clipped); even an over-optimistic overlapping ceiling point gives SE(p) ~ 1.298, ~6.2x looser than 0.21.',
  },
  sourceB_highBlocks: {
    topTabulatedOrdinate: GAMMA_1E6, // 6.003e5: no consecutive table reaches above it (imp-95863/imp-95884)
    arithmetic: highBlockArithmetic, // SE ~ 0.038-0.046 arithmetically, but not usable
    note: 'The Odlyzko 10^20..10^23 local high blocks would crush SE arithmetically (~0.038-0.046) but cannot FORM a +/-30% number-variance window (O(1e9) consecutive zeros vs ~6e19 needed) and overshoot into the asymptotic-GUE regime, so they measure a different statistic than the finite-height excursion depth -- not a valid anchor.',
  },
  anyInRepoThirdAnchor: ANY_INREPO_THIRD_ANCHOR, // false
  beatsOLSFloor: BEATS_OLS_FLOOR, // false
  verdict:
    'NO. No in-repo height set supplies a THIRD mutually-independent excursion-regime dip-depth anchor that extends the imp-96551 lever arm Delta_x ~ 0.41 decade enough to push SE(p) below the imp-96528 OLS floor 0.21. Structurally the third anchor lowers SE(p) only by EXTENDING the arm (an equally-spaced middle point over the same arm leaves the spread A/sqrt(2), hence SE(p), unchanged -- it only cures the K = 2 undefined error bar), and reaching SE(p) = 0.21 needs an arm A = (pi/2)/0.21 ~ 7.480 nat ~ 3.249 decades, i.e. a top anchor near ~2.658e8, some 576x above the +/-30 percent interior ceiling 4.6175e5 and ~443x above the top tabulated ordinate gamma_1e6 = 6.003e5. The fixed 10^6 set has no independent third +/-30 percent rung (the ladder rung 5.173e5 is clipped; even an over-optimistic overlapping ceiling point yields SE(p) ~ 1.298, ~6.2x looser than 0.21), and the only tabulated ordinates beyond gamma_1e6 -- the Odlyzko 10^20..10^23 local high blocks -- cannot form a +/-30 percent number-variance window (O(10^9) consecutive zeros vs ~6e19 required) and overshoot into the asymptotic-GUE regime, measuring a different statistic than the finite-height excursion depth. This confirms and extends imp-96551/imp-96528 and does NOT close the imp-96510 systematic-vs-noise sub-gap. Feasibility assessment only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96528 / imp-96551 convention).
export const IMP96653_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Feasibility assessment only: no in-repo height set '
  + 'supplies a THIRD excursion-regime dip-depth anchor to beat the imp-96528 OLS floor 0.21. The third '
  + 'anchor helps only by EXTENDING the arm (an equally-spaced middle point leaves SE(p) unchanged), and '
  + 'SE(p) = 0.21 needs an arm ~3.25 decades -- a top anchor ~2.66e8, ~576x above the +/-30% interior '
  + 'ceiling and ~443x above the top tabulated ordinate gamma_1e6 = 6.003e5. The fixed 10^6 set has no '
  + 'independent third +/-30% rung (clipped), and the Odlyzko 10^20..10^23 high blocks cannot form the '
  + 'window and overshoot into the asymptotic-GUE regime. The imp-96510 sub-gap stays open; no bound moves.';

// --- self-executing internal-consistency assertions (formula re-derivation, generous tolerances) ---
(() => {
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  // exponent separation is exactly 1/4
  if (rel(DELTA_P, 0.25) > 1e-12) throw new Error('imp-96653: exponent separation not 1/4');
  // irreducible scatter sqrt(pi^2/8) ~ 1.1107, sigma*sqrt(2) = pi/2 exactly
  if (rel(SIGMA_LOG_RELERR, 1.110720734539592) > 1e-9) throw new Error('imp-96653: sigma(log relErr) drifted from sqrt(pi^2/8)');
  if (rel(SIGMA_LOG_RELERR * Math.SQRT2, Math.PI / 2) > 1e-12) throw new Error('imp-96653: sigma*sqrt(2) should equal pi/2 exactly');
  // ladder ratio 13/7, interior ceiling ~4.6175e5
  if (rel(LADDER_RATIO, 13 / 7) > 1e-12) throw new Error('imp-96653: +/-30% ladder ratio not 13/7');
  if (rel(INTERIOR_CEILING, 4.6175e5, 5e2) > 2e-3) throw new Error('imp-96653: interior ceiling drifted from ~4.6175e5');
  // two-anchor baseline arm ~0.9501 and SE ~1.653
  if (rel(DELTA_X_TWO, 0.9501122803496657) > 5e-6) throw new Error('imp-96653: two-anchor arm drifted from ~0.9501');
  if (rel(SE_TWO, (Math.PI / 2) / DELTA_X_TWO) > 1e-12) throw new Error('imp-96653: two-anchor SE should equal (pi/2)/Delta_x');
  // STRUCTURAL: equally-spaced middle point leaves SE unchanged
  if (rel(SE_THREE_MIDDLE, SE_TWO) > 1e-12) throw new Error('imp-96653: equally-spaced middle point must leave SE(p) unchanged');
  // arm needed for SE=0.21 ~ 7.48 nat ~ 3.25 decades, top anchor ~2.66e8
  if (rel(ARM_NEEDED, (Math.PI / 2) / OLS_FLOOR_SE) > 1e-12) throw new Error('imp-96653: arm-needed should equal (pi/2)/0.21');
  if (!(ARM_NEEDED_DECADES > 3.2 && ARM_NEEDED_DECADES < 3.3)) throw new Error('imp-96653: arm needed should be ~3.25 decades');
  if (!(TOP_ANCHOR_NEEDED > 2.5e8 && TOP_ANCHOR_NEEDED < 2.8e8)) throw new Error('imp-96653: top anchor needed drifted from ~2.66e8');
  if (!(CEILING_SHORTFALL > 550 && CEILING_SHORTFALL < 600)) throw new Error('imp-96653: ceiling shortfall drifted from ~576x');
  if (!(ORDINATE_SHORTFALL > 420 && ORDINATE_SHORTFALL < 460)) throw new Error('imp-96653: ordinate shortfall drifted from ~443x');
  // SOURCE (a): third +/-30% rung is clipped; optimistic ceiling point still ~1.298 and >> 0.21
  if (!THIRD_RUNG_CLIPPED) throw new Error('imp-96653: independent third +/-30% rung must be clipped');
  if (!(SE_THREE_CEILING > 1.2 && SE_THREE_CEILING < 1.4)) throw new Error('imp-96653: optimistic ceiling-point SE drifted from ~1.298');
  if (SE_THREE_CEILING < OLS_FLOOR_SE) throw new Error('imp-96653: optimistic ceiling point must NOT beat the 0.21 floor');
  // SOURCE (b): high blocks crush arithmetic but are flagged not-usable
  if (highBlockArithmetic.some((b) => b.usableAnchor)) throw new Error('imp-96653: high blocks must be flagged not usable');
  if (!(highBlockArithmetic[1].twoPointSE < 0.21)) throw new Error('imp-96653: 10^20 arithmetic SE should be below 0.21 (arithmetic only)');
  // overall gates
  if (ANY_INREPO_THIRD_ANCHOR || BEATS_OLS_FLOOR) throw new Error('imp-96653: no valid third anchor should exist and none should beat 0.21');
  // honesty gates
  if (!/NO QED/.test(IMP96653_THIRD_EXCURSION_ANCHOR_LEVER_ARM_REACH.verdict))
    throw new Error('imp-96653: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96653_THIRD_EXCURSION_ANCHOR_LEVER_ARM_REACH.verdict))
    throw new Error('imp-96653: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96653_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96653_HONEST_BANNER) && /NO QED/.test(IMP96653_HONEST_BANNER)))
    throw new Error('imp-96653: IMP96653_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96653_THIRD_EXCURSION_ANCHOR_LEVER_ARM_REACH;
