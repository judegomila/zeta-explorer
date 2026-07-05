/**
 * @module imp-34001-geometric-center-taylor-ratio-fit
 *
 * imp-34001 (numerical, frontier-direction): imp-33947 R3 and imp-34000 R3 both assert a "clean
 * ~25x-per-order geometric reduction S1 -> S2 -> S3 -> S4" of the half-log-decade Taylor series
 * behind the imp-33879/imp-33900/imp-33947 geometric-center correction, but NEITHER ever fits the
 * per-order reduction RATIO itself. This module computes the per-order absolute-term ratios
 * r21 = S2/S1, r32 = S3/S2, r43 = S4/S3 at every rung of the same 1e12..1e15 ladder, regresses them,
 * and tests whether the asserted "~25x cut" is a clean ladder-independent constant ~1/25 or drifts
 * rung-to-rung the way the imp-33816 local exponents do.
 *
 * THE TAYLOR TERMS (unchanged from imp-34000; offset = L(x)/L(x-1/2) - 1, bK = LK/L, L = log T0)
 * ---------------------------------------------------------------------------------------------
 *     S1 = (1/2) b1
 *     S2 = (1/4) b1^2 - (1/8) b2
 *     S3 = (1/48) b3 - (1/8) b1 b2 + (1/8) b1^3
 *     S4 = -(1/384) b4 + (1/48) b1 b3 + (1/64) b2^2 - (3/32) b1^2 b2 + (1/16) b1^4
 * L1..L4 are centred finite differences of L in the decade exponent x (step 1e-2, the imp-34000 value
 * chosen so the L4 5-point stencil is not roundoff-dominated; S1..S4 reproduce imp-34000 exactly).
 *
 * THE RATIO MEASUREMENT (per-order absolute-term ratios along the ladder)
 * ----------------------------------------------------------------------
 *   N      r21=S2/S1   r32=S3/S2   r43=S4/S3   rbar (geo-mean)  rbar*L    1/rbar (the "cut")
 *   1e12   0.041005    0.040293    0.039689    0.040325         1.06108   24.80x
 *   1e13   0.038040    0.037446    0.036947    0.037475         1.06899   26.68x
 *   1e14   0.035462    0.034960    0.034546    0.034987         1.07569   28.58x
 *   1e15   0.033203    0.032772    0.032411    0.032794         1.08125   30.49x
 * (rbar is the geometric mean of the three per-order ratios at a rung; rbar*L is the ratio rescaled
 * by the local decade log-height L = log T0; 1/rbar is the per-order reduction factor -- the "~25x".)
 *
 * THE FIT (two competing hypotheses)
 * ----------------------------------
 *   (A) Clean ladder-independent constant ~1/25: FAILS. Treated as a constant, rbar runs from 0.04033
 *       (1e12) down to 0.03279 (1e15) -- a 20.7% relative spread across the ladder. Equivalently the
 *       reduction factor 1/rbar is NOT a fixed ~25x; it ramps monotonically 24.80x -> 26.68x -> 28.58x
 *       -> 30.49x as N climbs 1e12 -> 1e15. So "~25x-per-order" is the 1e12-END value, not a constant.
 *   (B) Geometric series in 1/log T0 (rbar ~ c/L): HOLDS. Rescaling by L collapses the drift: rbar*L
 *       runs only 1.06108 -> 1.08125, a 1.88% relative spread (>10x tighter than the constant fit),
 *       with c = mean(rbar*L) = 1.0718. A straight-line regression rbar = a + b/L gives
 *       a = 3.06e-3, b = 0.981, R^2 = 0.99995 -- an almost-through-origin ~1/L law (slope near unity,
 *       tiny positive intercept), i.e. rbar ~= (1/log T0) with a slow residual drift.
 *
 * THE FINDINGS (measurement/fit only)
 * -----------------------------------
 *   (R1) THE THREE PER-ORDER RATIOS AGREE AT EACH RUNG. r21, r32, r43 sit within ~3.3% of one another
 *        at every rung (they decrease very slightly with order, e.g. 0.041005 -> 0.040293 -> 0.039689
 *        at 1e12), so a single reduction ratio rbar per rung is a faithful summary -- the series really
 *        is geometric to leading order, as imp-33947/imp-34000 asserted.
 *   (R2) THE REDUCTION FACTOR IS NOT A CLEAN CONSTANT -- IT DRIFTS RUNG-TO-RUNG. As a bare constant the
 *        ratio has a 20.7% spread across 1e12..1e15; the "~25x-per-order cut" is specifically the
 *        1e12-end value and strengthens to ~30.5x by 1e15. The reduction is NOT ladder-independent.
 *   (R3) THE DRIFT IS A 1/log T0 LAW -- THE RATIO RAMPS LIKE THE imp-33816 LOCAL EXPONENTS. Rescaling
 *        rbar by L = log T0 collapses the 20.7% spread to 1.88%; the regression rbar = 3.06e-3 +
 *        0.981/L fits with R^2 = 0.99995. So the per-order ratio is ~ c/log T0 (c ~ 1.07), i.e. the
 *        half-log-decade Taylor series is geometric with a SLOWLY-VARYING, ladder-dependent ratio that
 *        shrinks as its own small parameter 1/log T0 shrinks down the ladder -- exactly the imp-34001
 *        hypothesis: the reduction factor ramps with the ladder, it is not a fixed ~1/25.
 *
 * MEASUREMENT/FIT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; L1..L4 are finite-difference measurements; S1..S4 reproduce imp-34000; the
 * C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains
 * SOTA.
 *
 * @see imp-34000-geometric-center-fourth-order-taylor-tail (S1..S4 terms, "~25x-per-order" asserted)
 * @see imp-33947-geometric-center-third-order-taylor-tail (third-order term S3, "~25x" first asserted)
 * @see imp-33900-geometric-center-second-order-taylor-tail (second-order term S2)
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (leading factor S1)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the 1/(2 log T0) local exponent this tracks)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5; // half-log-decade Taylor step h = 1/2 (endpoint -> geometric midpoint N/sqrt(10))
const H_FD = 1e-2; // centred finite-difference step in the decade exponent x (imp-34000 value)

// Same 1e12..1e15 ladder as imp-33900/imp-33947/imp-34000.
const DECADE_EXPONENTS = [12, 13, 14, 15];

const Lfun = (x) => Math.log(effectiveHeightForN(Math.pow(10, x)));

// Centred finite differences of L in the decade exponent x (L1 = first .. L4 = fourth derivative).
const dL = (x) => (Lfun(x + H_FD) - Lfun(x - H_FD)) / (2 * H_FD);
const d2L = (x) => (Lfun(x + H_FD) - 2 * Lfun(x) + Lfun(x - H_FD)) / (H_FD * H_FD);
const d3L = (x) =>
  (Lfun(x + 2 * H_FD) - 2 * Lfun(x + H_FD) + 2 * Lfun(x - H_FD) - Lfun(x - 2 * H_FD)) /
  (2 * H_FD * H_FD * H_FD);
const d4L = (x) =>
  (Lfun(x + 2 * H_FD) - 4 * Lfun(x + H_FD) + 6 * Lfun(x) - 4 * Lfun(x - H_FD) + Lfun(x - 2 * H_FD)) /
  (H_FD * H_FD * H_FD * H_FD);

// Per rung: the four Taylor terms and the three per-order absolute-term ratios.
const TABLE = DECADE_EXPONENTS.map((e) => {
  const L = Lfun(e);
  const b1 = dL(e) / L;
  const b2 = d2L(e) / L;
  const b3 = d3L(e) / L;
  const b4 = d4L(e) / L;

  // Order-by-order half-log-decade Taylor terms (identical to imp-34000).
  const S1 = HALF * b1;
  const S2 = 0.25 * b1 ** 2 - 0.125 * b2;
  const S3 = (1 / 48) * b3 - 0.125 * b1 * b2 + 0.125 * b1 ** 3;
  const S4 =
    -(1 / 384) * b4 +
    (1 / 48) * b1 * b3 +
    (1 / 64) * b2 ** 2 -
    (3 / 32) * b1 ** 2 * b2 +
    (1 / 16) * b1 ** 4;

  // Per-order absolute-term ratios and their per-rung geometric mean rbar.
  const r21 = S2 / S1;
  const r32 = S3 / S2;
  const r43 = S4 / S3;
  const rbar = Math.cbrt(r21 * r32 * r43);

  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    r21_S2_over_S1: +r21.toFixed(6), // 0.041005 .. 0.033203
    r32_S3_over_S2: +r32.toFixed(6), // 0.040293 .. 0.032772
    r43_S4_over_S3: +r43.toFixed(6), // 0.039689 .. 0.032411
    rbar_geomean: +rbar.toFixed(6), // 0.040325 .. 0.032794
    rbar_times_L: +(rbar * L).toFixed(5), // 1.06108 .. 1.08125 (near-flat: the 1/L collapse)
    reductionFactor_cut: +(1 / rbar).toFixed(2), // 24.80 .. 30.49 (the "~25x" ramping down the ladder)
  };
});

// --- Fit (A): treat rbar as a bare ladder-independent constant. ---
const RBAR = TABLE.map((r) => r.rbar_geomean);
const RBAR_MEAN = RBAR.reduce((a, b) => a + b, 0) / RBAR.length;
const RBAR_MIN = Math.min(...RBAR);
const RBAR_MAX = Math.max(...RBAR);
const CONST_REL_SPREAD_PCT = +(((RBAR_MAX - RBAR_MIN) / RBAR_MEAN) * 100).toFixed(2); // ~20.69

// --- Fit (B): rbar ~ c/L. Rescale by L; a good fit makes rbar*L flat. ---
const RBARL = TABLE.map((r) => r.rbar_times_L);
const C_MEAN = +(RBARL.reduce((a, b) => a + b, 0) / RBARL.length).toFixed(5); // ~1.07175
const RBARL_REL_SPREAD_PCT = +(((Math.max(...RBARL) - Math.min(...RBARL)) / C_MEAN) * 100).toFixed(
  2,
); // ~1.88

// --- Fit (B, regression): rbar = a + b*(1/L). ---
const XS = TABLE.map((r) => 1 / r.logT0);
const YS = RBAR;
const N = XS.length;
const MX = XS.reduce((a, b) => a + b, 0) / N;
const MY = YS.reduce((a, b) => a + b, 0) / N;
let SXY = 0;
let SXX = 0;
for (let i = 0; i < N; i += 1) {
  SXY += (XS[i] - MX) * (YS[i] - MY);
  SXX += (XS[i] - MX) ** 2;
}
const SLOPE = SXY / SXX; // ~0.981 (near unity: an almost-through-origin 1/L law)
const INTERCEPT = MY - SLOPE * MX; // ~3.06e-3
let SSR = 0;
let SST = 0;
for (let i = 0; i < N; i += 1) {
  const pred = INTERCEPT + SLOPE * XS[i];
  SSR += (YS[i] - pred) ** 2;
  SST += (YS[i] - MY) ** 2;
}
const R2 = +(1 - SSR / SST).toFixed(6); // ~0.999948
const SLOPE_R = +SLOPE.toFixed(5);
const INTERCEPT_R = +INTERCEPT.toFixed(6);

// Within-rung agreement of the three per-order ratios (max relative spread over rungs).
const WITHIN_RUNG_SPREAD_PCT = +(
  Math.max(
    ...TABLE.map(
      (r) =>
        (Math.max(r.r21_S2_over_S1, r.r32_S3_over_S2, r.r43_S4_over_S3) -
          Math.min(r.r21_S2_over_S1, r.r32_S3_over_S2, r.r43_S4_over_S3)) /
        r.rbar_geomean,
    ),
  ) * 100
).toFixed(2); // ~3.3

const CUT_HEAD = TABLE[0].reductionFactor_cut; // 24.80 at 1e12
const CUT_TAIL = TABLE[TABLE.length - 1].reductionFactor_cut; // 30.49 at 1e15

export const IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT = {
  id: 'imp-34001',
  proofSection: 'S-frontier',
  question:
    'Fit the per-order geometric reduction ratio (S2/S1, S3/S2, S4/S3) of the imp-33947/imp-34000 ' +
    'half-log-decade Taylor series across the 1e12..1e15 ladder and test whether the asserted ' +
    '"~25x-per-order" cut is a clean ladder-independent constant ~1/25 or drifts rung-to-rung like ' +
    'the imp-33816 local exponents. Measurement/fit only; no bound change; no QED.',
  componentModel:
    'Taylor terms unchanged from imp-34000: S1 = (1/2)b1; S2 = (1/4)b1^2 - (1/8)b2; S3 = (1/48)b3 ' +
    '- (1/8)b1 b2 + (1/8)b1^3; S4 = -(1/384)b4 + (1/48)b1 b3 + (1/64)b2^2 - (3/32)b1^2 b2 + (1/16)' +
    'b1^4, bK = LK/L, L = log T0, L1..L4 centred finite differences (step 1e-2). Per-order ratios ' +
    'r21 = S2/S1, r32 = S3/S2, r43 = S4/S3; rbar = geometric mean of the three per rung.',
  table: TABLE,
  fit: {
    // (A) constant ~1/25 hypothesis: FAILS.
    constant_fit_rbar_mean: +RBAR_MEAN.toFixed(5), // ~0.03640
    constant_fit_rbar_range: [+RBAR_MIN.toFixed(5), +RBAR_MAX.toFixed(5)], // [0.03279, 0.04033]
    constant_fit_rel_spread_pct: CONST_REL_SPREAD_PCT, // ~20.69 (NOT ladder-independent)
    // (B) rbar ~ c/log T0 hypothesis: HOLDS.
    cL_fit_c: C_MEAN, // ~1.07175 (rbar*L, near-flat)
    cL_fit_rbarL_rel_spread_pct: RBARL_REL_SPREAD_PCT, // ~1.88 (>10x tighter than the constant fit)
    linreg_rbar_vs_invL_slope: SLOPE_R, // ~0.98106 (near unity)
    linreg_rbar_vs_invL_intercept: INTERCEPT_R, // ~0.003060 (small, near through-origin)
    linreg_R2: R2, // ~0.999948
    // the "~25x" is a ladder end value, not a constant:
    reduction_factor_head_1e12: CUT_HEAD, // 24.80x
    reduction_factor_tail_1e15: CUT_TAIL, // 30.49x
    within_rung_ratio_spread_pct: WITHIN_RUNG_SPREAD_PCT, // ~1.6 (three orders agree per rung)
  },
  findings: {
    R1_three_per_order_ratios_agree_per_rung:
      'r21, r32, r43 sit within ~3.3% of one another at every rung (they shrink very slightly with ' +
      'order), so a single reduction ratio rbar per rung faithfully summarises the series -- it is ' +
      'geometric to leading order, as imp-33947/imp-34000 asserted.',
    R2_reduction_factor_is_not_a_clean_constant_it_drifts:
      'As a bare constant rbar has a 20.7% spread across 1e12..1e15 (0.04033 down to 0.03279); the ' +
      '"~25x-per-order cut" is the 1e12-END value and strengthens monotonically to ~30.5x by 1e15. ' +
      'The per-order reduction is NOT ladder-independent.',
    R3_drift_is_a_one_over_logT0_law_ramping_like_local_exponents:
      'Rescaling rbar by L = log T0 collapses the 20.7% spread to 1.88% (rbar*L ~ 1.07 flat); the ' +
      'regression rbar = 0.00306 + 0.98106/L fits with R^2 = 0.99995. The per-order ratio is ~ c/log ' +
      'T0 (c ~ 1.07), an almost-through-origin 1/L law: the half-log-decade Taylor series is ' +
      'geometric with a slowly-varying, ladder-dependent ratio that shrinks as its own small ' +
      'parameter 1/log T0 shrinks -- it ramps with the ladder like the imp-33816 local exponents, ' +
      'it is not a fixed ~1/25.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/FIT (frontier-direction, NOT rigorous). The imp-33947/imp-34000 "clean ~25x-per-' +
    'order geometric reduction" of the half-log-decade Taylor series is geometric to leading order ' +
    '(the three per-order absolute-term ratios r21 = S2/S1, r32 = S3/S2, r43 = S4/S3 agree within ' +
    '~3.3% at each rung) but its reduction factor is NOT a clean ladder-independent constant ~1/25. ' +
    'Treated as a constant, the geometric-mean ratio rbar drifts 20.7% across 1e12..1e15 (0.04033 -> ' +
    '0.03279), so the "~25x cut" is specifically the 1e12-end value and ramps monotonically to ~30.5x ' +
    'by 1e15. The drift is a 1/log T0 law: rescaling by L = log T0 collapses the spread to 1.88% ' +
    '(rbar*L ~ 1.07 flat) and the regression rbar = 0.00306 + 0.98106/L fits with R^2 = 0.99995, an ' +
    'almost-through-origin ~1/L scaling with c ~ 1.07. So the reduction ratio is ~ c/log T0 -- the ' +
    'series is geometric with a slowly-varying, ladder-dependent ratio that shrinks as its own small ' +
    'parameter 1/log T0 shrinks, ramping with the ladder like the imp-33816 local exponents rather ' +
    'than sitting at a fixed 1/25. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; L1..L4 are finite-difference measurements; S1..S4 ' +
    'reproduce imp-34000; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34000 (S1..S4 terms, "~25x-per-order" asserted); imp-33947 (third-order S3, "~25x" first ' +
    'asserted); imp-33900 (second-order S2); imp-33879 (leading factor S1); imp-33816 (1/(2 log T0) ' +
    'local exponent this ratio tracks); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT_ASSERTIONS = [
  {
    // (R1) The three per-order ratios agree within a few percent at each rung: geometric to leading order.
    id: 'imp34001-three-per-order-ratios-agree-per-rung',
    description: 'r21, r32, r43 agree within ~4% at every rung (single reduction ratio is faithful)',
    holds: () => WITHIN_RUNG_SPREAD_PCT > 0 && WITHIN_RUNG_SPREAD_PCT < 4,
  },
  {
    // (R2) The bare-constant fit has a large (>15%) spread: the ratio is NOT a clean ~1/25 constant.
    id: 'imp34001-constant-fit-fails-ratio-drifts',
    description: 'treated as a constant rbar drifts >15% across the ladder (not ladder-independent)',
    holds: () => CONST_REL_SPREAD_PCT > 15,
  },
  {
    // (R2) The "~25x cut" is a ladder end value, not a constant: it ramps monotonically up the ladder.
    id: 'imp34001-reduction-factor-ramps-not-fixed-25x',
    description: 'reduction factor ramps head->tail (~25x at 1e12 to ~30x at 1e15), not a fixed 25x',
    holds: () => CUT_HEAD > 23 && CUT_HEAD < 27 && CUT_TAIL > CUT_HEAD + 3 && CUT_TAIL < 33,
  },
  {
    // (R3) The 1/log T0 rescaling collapses the drift and the linear regression is nearly perfect.
    id: 'imp34001-drift-is-one-over-logT0-law',
    description: 'rbar ~ c/L collapses the 20% spread to <5% and rbar vs 1/L fits with R^2 > 0.999',
    holds: () =>
      RBARL_REL_SPREAD_PCT < 5 &&
      RBARL_REL_SPREAD_PCT < CONST_REL_SPREAD_PCT / 3 &&
      R2 > 0.999 &&
      SLOPE_R > 0.7 &&
      SLOPE_R < 1.3,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp34001-honesty-gate-no-qed',
    description: 'Measurement/fit only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.isRigorous === false &&
      /NO QED/.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict) &&
      /remains SOTA/.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict),
  },
];

for (const a of IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34001-geometric-center-taylor-ratio-fit assertion failed: ${a.id}`);
  }
}
