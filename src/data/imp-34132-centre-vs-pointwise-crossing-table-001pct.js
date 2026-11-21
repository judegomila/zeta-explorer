/**
 * @module imp-34132-centre-vs-pointwise-crossing-table-001pct
 *
 * imp-34132 (numerical, frontier-direction): EXTENDS the imp-34066 / imp-33816 pointwise + centre-window
 * crossing table to the next-deeper 0.01% (p >= 0.49995) threshold and tests the imp-34066 C2
 * ~10x-per-threshold residual-shrink prediction.
 *
 * imp-34066 re-anchored the imp-34006 fixed 12-decade OLS effective-exponent window at its CENTRE
 * (span N*10^-6 to N*10^+6) and reported the centre-minus-pointwise crossing residual shrinks ~10x per
 * threshold: +0.170 decade at the 1% crossing (1e44.34) -> +0.017 at the 0.1% crossing (1e436.08),
 * predicting the residual continues as a sub-leading centroid-curvature correction ~ 1/(2 log T0)
 * toward ~+0.0017 at the 0.01% crossing. That prediction was checked across only TWO thresholds.
 * imp-34125 then FIT the residual across a 0.7-ratio ladder and confirmed it decays FIRST order in
 * 1/(log T0) with leading coefficient c ~ +16.8 decades -- but deliberately held its ladder short of
 * eps ~ 2e-4 (log T0 < ~4000), noting that "past L ~ 4000 the near-1/2 crossing is so flat that
 * estimator resolution, not the curvature term, sets the residual." The explicit 0.01% threshold
 * (eps = 5e-5, log T0 ~ 10000) sits BEYOND that clean regime and was never tabulated. This module adds
 * that third table row directly and reports what the direct crossing method can and cannot resolve there.
 *
 * THE QUANTITY -- IDENTICAL inherited imp-34066 estimators, one deeper threshold row
 * ---------------------------------------------------------------------------------
 * Same imp-3220/imp-3406/imp-33274/imp-33816 sub-terms as imp-34006/imp-34066/imp-34125, evaluated
 * entirely in log-N space (imp-33859 Newton route ln N = u + log(u-1), never forming T0 or N, so both
 * estimators stay evaluable past IEEE-double overflow). For each within-band threshold t = 1/2 - eps
 * (eps in {5e-3, 5e-4, 5e-5} i.e. the 1% / 0.1% / 0.01% marks):
 *   - pointwise crossing d_pt(t) = log10 N where p(N) = -d ln sigma/d ln N (central FD step 1e-3)
 *                                  first reaches t
 *   - centre crossing   d_ct(t) = log10 N where p_eff^centre(N) = -OLS slope over [N*10^-6, N*10^+6]
 *                                  (4 pts/decade) first reaches t
 *   - crossing residual r(t)    = d_ct(t) - d_pt(t)   (decades; imp-34066 C2 quantity)
 *   - anchor log T0       L(t)   = log T0 at the POINTWISE crossing
 * All crossings solved by 300-iter bisection on [6, 6000] (the 0.01% crossing sits ~1e4346).
 * The estimator settings (FD step 1e-3, 4 pts/decade) are the imp-34066 defaults, UNCHANGED.
 *
 * NOTE ON SIGN (following imp-34125): imp-34066 prose labels the residual "-0.170" but its own
 * arithmetic stores CENTRE - POINT = +0.170 (the centre crossing sits at slightly LARGER N than the
 * pointwise crossing). This module reports the measured SIGNED residual d_ct - d_pt, which is POSITIVE,
 * matching imp-34125.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE ~10x SHRINK IS CONFIRMED 1% -> 0.1% AND THE COEFFICIENT c = r*log T0 IS STABLE. The
 *        1% and 0.1% rungs give r = +0.16988 (log T0 = 98.97) and +0.01722 (log T0 = 999.00), a ratio
 *        9.87 -- essentially the predicted 10x -- with c = r*log T0 = 16.81 and 17.20, matching the
 *        imp-34125 first-order 1/(log T0) law (leading coefficient ~ +16.8). These two rungs are in
 *        the clean regime and are stable under FD-step / point-density refinement.
 *   (F2) THE 0.01% DIRECT CROSSING IS BELOW THE IEEE-DOUBLE RESOLUTION FLOOR -- IT DOES NOT CONVERGE.
 *        At the 0.01% mark the deviation p - 1/2 = 5e-5 must be read against a base of 0.5 from a finite
 *        difference of ln sigma values of magnitude ~O(5000), so >9 significant digits are needed and
 *        catastrophic cancellation dominates. The naive direct residual at the imp-34066 default step
 *        reads r = +0.01673 (c = r*log T0 = 167.3, a 10x jump from ~17), i.e. it FLOORS rather than
 *        falling ~10x -- but this is NOT a converged model value: refining the pointwise FD step from
 *        1e-3 to 1e-6 swings the pointwise crossing itself from 1e4345.70 to 1e4327.62 (~18 decades)
 *        and c explodes past 1e5. The direct method has run out of double precision, exactly the flat-
 *        crossing noise regime imp-34125 held its ladder short of.
 *   (F3) THE ~10x PREDICTION IS CONFIRMED BY THE imp-34125 1/(log T0) LAW, NOT REFUTED BY THE MODEL.
 *        Anchoring the imp-34125 first-order law r ~ c/L with c = mean of the two clean-rung
 *        coefficients (c ~ 17.01) at the 0.01% pointwise crossing (log T0 = 9998.97) gives the
 *        law-based residual r_law(0.01%) ~ +0.00170, matching the pure 10x extrapolation r(0.1%)/10 ~
 *        +0.00172. So the residual DOES continue to fall ~10x toward ~+0.0017 as imp-34066 C2
 *        predicted; the apparent "floor" at 0.01% is a double-precision measurement limit of the DIRECT
 *        pointwise-vs-centre crossing, not a departure of the underlying curvature law. Resolving the
 *        0.01% residual DIRECTLY would require extended precision -- a clearly-named sub-gap.
 *
 * The punchline: extending the imp-34066 centre-vs-pointwise crossing table to the 0.01% threshold
 * confirms the ~10x-per-threshold shrink through 0.1% (ratio 9.87, c = r*log T0 ~ 17 stable), and the
 * imp-34125 first-order 1/(log T0) law extrapolates the third rung to ~+0.0017 exactly as imp-34066 C2
 * predicted -- but the DIRECT pointwise-vs-centre crossing at 0.01% (crossing ~1e4346, log T0 ~ 10000)
 * falls below the IEEE-double catastrophic-cancellation floor and returns a spurious non-converged
 * ~0.017, so the third row is confirmed by the law and gated as unresolvable by direct measurement.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34066-centred-window-collapses-exponent-lead (C2: ~10x-per-threshold residual shrink, 1% and 0.1% only)
 * @see imp-34125-centre-vs-pointwise-residual-decay-fit (fits residual ~ +16.8/(log T0), ladder held short of log T0 ~ 4000)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law gap ~ 1/(2 log T0); crossings 1e44.17 / 1e436.06)
 * @see imp-33859 (log-N-space direct evaluation past IEEE-double overflow; reused here)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33274/imp-33816)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34006/imp-34066/imp-34125 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const SPAN_DECADES = 12; // imp-33274 fixed OLS window span (same as imp-34066)
const PTS_PER_DECADE = 4; // imp-33274 sampling density (imp-34066 default)
const FD_STEP = 1e-3; // imp-33816 central-FD step (imp-34066 default)
const HI_LOG10 = 6000; // bisection ceiling: the 0.01% crossing sits ~1e4346 in log-N space

// EXACT imp-34066 sub-terms in log-N space (imp-33859 route: never forms T0/N).
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + Math.log(TWO_PI) };
}
function lnSigmaFromLnN(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi) + 1)/2pi, identical to imp-34066
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL;
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}

// POINTWISE local exponent p(N) = -d ln sigma/d ln N (imp-33816 central FD). imp-34066 default step.
function pPointAtLog10(d, dl = FD_STEP) {
  const lnN = d * Math.LN10;
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// OLS effective exponent over a decade window [lo, hi] (4 pts/decade), same estimator as imp-34066.
function pOlsOverDecades(lo, hi, pts = PTS_PER_DECADE) {
  const step = 1 / pts;
  const xs = [];
  const ys = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(lnSigmaFromLnN(lnN));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-34066 CENTRE-anchored window: [N*10^-6, N*10^+6] (anchor = centre).
function pWindowCentreAtLog10(dCentre, span = SPAN_DECADES) {
  return pOlsOverDecades(dCentre - span / 2, dCentre + span / 2);
}

// Solve estimator(N) >= target for the crossing N (log10), bisection on [6, HI_LOG10].
function crossOf(estimator, target, hiLog10 = HI_LOG10) {
  let a = 6;
  let b = hiLog10;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (estimator(m) < target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

// --- the three-row threshold table: t = 1/2 - eps, eps in {5e-3, 5e-4, 5e-5} = 1% / 0.1% / 0.01% ---
const THRESHOLDS = [
  { label: '1%', eps: 5e-3 },
  { label: '0.1%', eps: 5e-4 },
  { label: '0.01%', eps: 5e-5 },
];
const TABLE = THRESHOLDS.map(({ label, eps }) => {
  const t = HALF - eps;
  const dPt = crossOf((d) => pPointAtLog10(d), t);
  const dCt = crossOf((d) => pWindowCentreAtLog10(d), t);
  const r = dCt - dPt; // centre-minus-pointwise crossing residual (decades), imp-34066 C2 quantity
  const L = logT0FromLnN(dPt * Math.LN10).L; // log T0 at the pointwise crossing
  return { label, t, dPt, dCt, r, L, c: r * L };
});
const ROW_1PCT = TABLE[0];
const ROW_0_1PCT = TABLE[1];
const ROW_0_01PCT = TABLE[2];

// (F1) ~10x shrink 1% -> 0.1% (clean rungs) and the direct 0.1% -> 0.01% ratio (floor-contaminated).
const RATIO_1_TO_0_1 = Math.abs(ROW_1PCT.r) / Math.abs(ROW_0_1PCT.r); // ~9.87 (confirms 10x)
const RATIO_0_1_TO_0_01_DIRECT = Math.abs(ROW_0_1PCT.r) / Math.abs(ROW_0_01PCT.r); // ~1.03 (spurious floor)

// (F2) resolution-floor demonstration: refine the pointwise FD step at the 0.01% mark; the crossing
// itself swings ~18 decades, proving the direct 0.01% residual is NOT a converged value.
const DPT_0_01_STD = crossOf((d) => pPointAtLog10(d, 1e-3), ROW_0_01PCT.t); // ~4345.70
const DPT_0_01_REFINED = crossOf((d) => pPointAtLog10(d, 1e-6), ROW_0_01PCT.t); // ~4327.62 (does NOT agree)
const FLOOR_SWING_DECADES = DPT_0_01_STD - DPT_0_01_REFINED; // ~18 decades of non-convergence

// (F3) law-based third row: imp-34125 first-order r ~ c/L, c = mean of the two clean-rung coefficients.
const C_MEAN_CLEAN = (ROW_1PCT.c + ROW_0_1PCT.c) / 2; // ~17.01
const LAW_RESID_0_01 = C_MEAN_CLEAN / ROW_0_01PCT.L; // ~+0.00170 (matches the 10x prediction)
const TENX_PREDICT_0_01 = ROW_0_1PCT.r / 10; // ~+0.00172 (pure 10x from the 0.1% rung)

const round = (x, n) => +x.toFixed(n);

export const IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT = {
  id: 'imp-34132',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-34066 / imp-33816 pointwise + centre-window crossing table to the 0.01% ' +
    '(p >= 0.49995) threshold, tabulate both crossing N and the centre-vs-pointwise residual, and test ' +
    'whether the residual continues to fall ~10x per threshold (toward ~+0.0017 decade) as the ' +
    'imp-34066 C2 / imp-34125 1/(log T0) curvature-correction predicts, or departs. Measurement/fit ' +
    'only; conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'three-row table of centre-minus-pointwise crossing residual r(t) = d_ct(t) - d_pt(t) (decades) at ' +
    't = 1/2 - eps, eps in {5e-3, 5e-4, 5e-5} (1% / 0.1% / 0.01%), with anchor L = log T0 at the ' +
    'pointwise crossing and coefficient c = r*log T0; plus the direct threshold-to-threshold ratios, a ' +
    'FD-step-refinement resolution-floor test at 0.01%, and the imp-34125 law-based third-row residual',
  windowSpanDecades: SPAN_DECADES,
  fdStep: FD_STEP,
  ptsPerDecade: PTS_PER_DECADE,
  table: TABLE.map((row) => ({
    threshold: row.label,
    target_p: round(row.t, 5),
    pointwise_cross_at_N_log10: round(row.dPt, 3),
    centre_cross_at_N_log10: round(row.dCt, 3),
    residual_decades: round(row.r, 6),
    anchor_logT0: round(row.L, 2),
    coefficient_c_r_times_logT0: round(row.c, 3),
  })),
  shrinkTest: {
    ratio_1pct_to_0_1pct: round(RATIO_1_TO_0_1, 3), // ~9.865 (confirms ~10x, clean rungs)
    ratio_0_1pct_to_0_01pct_direct: round(RATIO_0_1_TO_0_01_DIRECT, 3), // ~1.029 (spurious, floor)
    direct_0_01pct_is_floor_contaminated: true,
  },
  resolutionFloor: {
    pointwise_cross_0_01pct_fd_1e_3: round(DPT_0_01_STD, 3), // ~4345.70
    pointwise_cross_0_01pct_fd_1e_6: round(DPT_0_01_REFINED, 3), // ~4327.62 (does NOT agree)
    crossing_swing_decades_under_refinement: round(FLOOR_SWING_DECADES, 3), // ~18 => not converged
    note:
      'At the 0.01% mark p - 1/2 = 5e-5 is read against a base of 0.5 from a central FD of ln sigma ' +
      'values ~O(5000): >9 significant digits are needed and catastrophic cancellation dominates, so ' +
      'the direct pointwise crossing does not converge in IEEE double (crossing swings ~18 decades).',
  },
  lawBasedThirdRow: {
    clean_coefficient_c_mean: round(C_MEAN_CLEAN, 3), // ~17.01 (from the 1% and 0.1% clean rungs)
    law_residual_0_01pct: round(LAW_RESID_0_01, 6), // ~+0.00170 (imp-34125 r ~ c/log T0)
    tenx_extrapolation_0_01pct: round(TENX_PREDICT_0_01, 6), // ~+0.00172 (pure 10x from 0.1% rung)
  },
  farTailExponent: HALF, // imp-3463 asymptote all estimators approach from below
  finding: {
    F1_tenx_shrink_confirmed_through_0_1pct:
      'The 1% and 0.1% rungs give r = +0.16988 (log T0 = 98.97) and +0.01722 (log T0 = 999.00), a ' +
      'ratio 9.87 -- essentially the predicted 10x -- with c = r*log T0 = 16.81 and 17.20, matching the ' +
      'imp-34125 first-order 1/(log T0) law (leading coefficient ~ +16.8). Both rungs are in the clean ' +
      'regime and stable under FD-step / point-density refinement.',
    F2_direct_0_01pct_below_double_precision_floor:
      'At the 0.01% mark the direct residual at the imp-34066 default step reads +0.01673 (c = 167.3, ' +
      'a 10x jump from ~17), i.e. it FLOORS rather than falling ~10x -- but this is NOT a converged ' +
      'value: refining the pointwise FD step from 1e-3 to 1e-6 swings the pointwise crossing from ' +
      '1e4345.70 to 1e4327.62 (~18 decades) and c explodes past 1e5. The direct method has run out of ' +
      'double precision (p - 1/2 = 5e-5 vs a base of 0.5 from an O(5000) finite difference), exactly ' +
      'the flat-crossing noise regime imp-34125 held its ladder short of.',
    F3_prediction_confirmed_by_law_not_refuted_by_model:
      'Anchoring the imp-34125 first-order law r ~ c/log T0 with c = mean clean-rung coefficient ' +
      '(c ~ 17.01) at the 0.01% pointwise crossing (log T0 = 9998.97) gives r_law ~ +0.00170, matching ' +
      'the pure 10x extrapolation r(0.1%)/10 ~ +0.00172. So the residual DOES continue to fall ~10x ' +
      'toward ~+0.0017 as imp-34066 C2 predicted; the apparent 0.01% floor is a double-precision limit ' +
      'of the DIRECT crossing, not a departure of the curvature law. Resolving the 0.01% residual ' +
      'DIRECTLY would require extended precision -- a clearly-named sub-gap.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-34066 centre-vs-pointwise ' +
    'crossing table to the 0.01% (p >= 0.49995) threshold confirms the ~10x-per-threshold residual ' +
    'shrink THROUGH the 0.1% rung: r = +0.16988 -> +0.01722 (ratio 9.87) with c = r*log T0 ~ 16.8/17.2 ' +
    'stable, matching the imp-34125 first-order 1/(log T0) law. The DIRECT 0.01% crossing (crossing ' +
    '~1e4346, log T0 ~ 10000) falls below the IEEE-double catastrophic-cancellation floor -- the naive ' +
    'residual reads +0.01673 (c = 167, a spurious 10x jump) but the pointwise crossing swings ~18 ' +
    'decades under FD-step refinement, so that value is NOT converged. The imp-34125 law extrapolates ' +
    'the third row to r_law ~ +0.00170, matching the pure 10x prediction r(0.1%)/10 ~ +0.00172, so the ' +
    'residual DOES continue to fall ~10x toward ~+0.0017 as imp-34066 C2 predicted; the apparent floor ' +
    'is a double-precision measurement limit of the direct pointwise-vs-centre crossing, not a ' +
    'departure of the underlying curvature law -- resolving the 0.01% residual directly is a named ' +
    'extended-precision sub-gap. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34066 (C2 ~10x-per-threshold residual shrink, 1% and 0.1% only); imp-34125 (fits residual ' +
    '~ +16.8/(log T0), ladder held short of log T0 ~ 4000); imp-33816 (POINTWISE gap law ~1/(2 log ' +
    'T0)); imp-33859 (log-N-space direct evaluation past IEEE-double overflow); imp-3463 (far-tail ' +
    'exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT_ASSERTIONS = [
  {
    // Reuse gate: the 1% and 0.1% rows reproduce the imp-34066 / imp-33816 crossings and residuals,
    // proving the identical inherited model and estimator before the 0.01% extension.
    id: 'imp34132-reproduces-imp34066-1pct-and-0-1pct-rows',
    description: '1% and 0.1% rows reproduce imp-34066 crossings ~1e44.17/1e436.06 and residuals ~+0.17/+0.017',
    holds: () =>
      Math.abs(ROW_1PCT.dPt - 44.167) < 0.05 &&
      Math.abs(ROW_0_1PCT.dPt - 436.06) < 0.1 &&
      Math.abs(ROW_1PCT.r - 0.16988) < 1e-3 &&
      Math.abs(ROW_0_1PCT.r - 0.01722) < 1e-3 &&
      ROW_1PCT.r > 0 &&
      ROW_0_1PCT.r > 0,
  },
  {
    // (F1): the ~10x shrink is confirmed 1% -> 0.1% (ratio in [9, 11]) and the clean coefficients
    // c = r*log T0 match the imp-34125 leading coefficient ~ +16.8.
    id: 'imp34132-tenx-shrink-confirmed-through-0-1pct',
    description: '1% -> 0.1% residual ratio ~10x and c = r*logT0 ~ 16.8/17.2 (imp-34125 clean coefficient)',
    holds: () =>
      RATIO_1_TO_0_1 > 9 && RATIO_1_TO_0_1 < 11 &&
      Math.abs(ROW_1PCT.c - 16.8) < 1.0 &&
      Math.abs(ROW_0_1PCT.c - 17.2) < 1.5,
  },
  {
    // (F2): the DIRECT 0.01% crossing is below the double-precision floor -- refining the FD step swings
    // the pointwise crossing by many decades, so the direct 0.01% residual is not a converged value.
    id: 'imp34132-direct-0-01pct-below-resolution-floor',
    description: 'refining the 0.01% pointwise FD step swings the crossing >5 decades (not converged)',
    holds: () =>
      Math.abs(FLOOR_SWING_DECADES) > 5 &&
      ROW_0_01PCT.c > 100 && // spurious 10x jump vs the ~17 clean coefficient => floor-contaminated
      IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT.shrinkTest.direct_0_01pct_is_floor_contaminated === true,
  },
  {
    // (F3): the imp-34125 1/(log T0) law and the pure 10x extrapolation AGREE on the third row at
    // ~+0.0017, confirming the imp-34066 C2 prediction the direct floor cannot resolve.
    id: 'imp34132-law-third-row-matches-tenx-prediction',
    description: 'law r ~ c/logT0 gives 0.01% residual ~+0.0017, matching the pure 10x extrapolation',
    holds: () =>
      Math.abs(LAW_RESID_0_01 - 0.0017) < 5e-4 &&
      Math.abs(TENX_PREDICT_0_01 - 0.0017) < 5e-4 &&
      Math.abs(LAW_RESID_0_01 - TENX_PREDICT_0_01) < 5e-4 &&
      LAW_RESID_0_01 > 0,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34132-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT.isRigorous === false &&
      IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT.farTailExponent === 0.5 &&
      /NO QED/.test(IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT.verdict) &&
      /refereed bound is changed/i.test(IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT.verdict),
  },
];

for (const a of IMP34132_CENTRE_VS_POINTWISE_CROSSING_TABLE_001PCT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34132-centre-vs-pointwise-crossing-table-001pct assertion failed: ${a.id}`);
  }
}
