/**
 * @module imp-34060-geometric-center-taylor-ratio-extended
 *
 * imp-34060 (numerical, frontier-direction): imp-34001 R3 fitted the per-order geometric reduction
 * ratio rbar = 3.06e-3 + 0.981/L (R^2 0.99995, L = log T0) of the imp-33947/imp-34000 half-log-decade
 * Taylor series across the 1e12..1e15 ladder, collapsing a 20.7% bare-constant spread to 1.88% under
 * rescaling by L. This module EXTENDS that ladder 15 further decades to 1e18..1e30 (same S1..S4 terms,
 * same finite-difference machinery) and tests two claims made off the short 1e12..1e15 window:
 *   (Q1) does the rbar*L collapse still hold far down the ladder as 1/log T0 keeps shrinking?
 *   (Q2) does the fitted near-zero intercept a = 3.06e-3 of rbar = a + b/L persist (or blow up)?
 *
 * THE TAYLOR TERMS (unchanged from imp-34000/imp-34001)
 * ----------------------------------------------------
 *     S1 = (1/2) b1
 *     S2 = (1/4) b1^2 - (1/8) b2
 *     S3 = (1/48) b3 - (1/8) b1 b2 + (1/8) b1^3
 *     S4 = -(1/384) b4 + (1/48) b1 b3 + (1/64) b2^2 - (3/32) b1^2 b2 + (1/16) b1^4
 * bK = LK/L, L = log T0, L1..L4 centred finite differences of L in the decade exponent x (step 1e-2).
 * Per-order absolute-term ratios r21 = S2/S1, r32 = S3/S2, r43 = S4/S3; rbar = geometric mean per rung.
 *
 * THE EXTENDED MEASUREMENT (1e18..1e30, five new rungs above the imp-34001 window)
 * -------------------------------------------------------------------------------
 *   N      L=logT0   rbar        rbar*L     1/rbar (the "cut")
 *   1e18   39.6778   0.027580    1.09430    36.26x
 *   1e21   46.4176   0.023768    1.10324    42.07x
 *   1e24   53.1811   0.020875    1.11015    47.90x
 *   1e27   59.9624   0.018588    1.11457    53.80x
 *   1e30   66.7578   0.016764    1.11914    59.65x
 * (For reference the imp-34001 window ran rbar*L 1.06108 -> 1.08125 and cut 24.80x -> 30.49x.)
 *
 * THE FINDINGS (measurement/fit only)
 * -----------------------------------
 *   (R1) THE rbar*L COLLAPSE STILL HOLDS -- BUT rbar*L IS NOT FLAT, IT DRIFTS UP. Across 1e18..1e30 the
 *        bare rbar spreads 50.3% (0.02758 down to 0.01676) while rbar*L spreads only 2.24% -- the L
 *        rescaling is still ~22x tighter, so the ~c/L reading survives 15 decades past the fit window.
 *        BUT rbar*L is not a flat constant: it climbs monotonically 1.06108 (1e12) -> 1.11914 (1e30),
 *        a +5.47% head-to-tail drift -- so c is not fixed at ~1.07; it ramps slowly toward ~1.12.
 *   (R2) THE NEAR-ZERO INTERCEPT PERSISTS -- IT DOES NOT BLOW UP. Refitting rbar = a + b/L over the new
 *        1e18..1e30 rungs gives a = 9.46e-4, b = 1.058, R^2 = 0.99995 -- the intercept stays O(1e-3)
 *        (in fact even closer to zero than the imp-34001 3.06e-3), the slope stays near unity, the fit
 *        stays near-perfect. The COMBINED 1e12..1e30 fit gives a = 1.58e-3, b = 1.025, R^2 = 0.99976.
 *        So a stays small and positive across the whole 18-decade span; the small positive intercept is
 *        exactly what shows up as the slow upward rbar*L drift (rbar*L = a*L + b climbs linearly in L).
 *   (R3) THE "CUT" 1/rbar KEEPS RAMPING WITHOUT SATURATING. The per-order reduction factor runs 24.80x
 *        (1e12) -> 36.26x (1e18) -> 59.65x (1e30): it more than doubles over the full 18-decade span
 *        and shows no plateau. So imp-34001's verdict that "~25x-per-order" is a ladder END value, not a
 *        constant, strengthens with reach -- the reduction ramps like the imp-33816 local exponents all
 *        the way to 1e30, driven by the surviving ~c/log T0 law with a slowly-climbing c.
 *
 * MEASUREMENT/FIT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; L1..L4 are finite-difference measurements; S1..S4 reproduce imp-34000/imp-34001;
 * the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains
 * SOTA.
 *
 * @see imp-34001-geometric-center-taylor-ratio-fit (the 1e12..1e15 rbar = 3.06e-3 + 0.981/L fit)
 * @see imp-34000-geometric-center-fourth-order-taylor-tail (S1..S4 terms, "~25x-per-order" asserted)
 * @see imp-33947-geometric-center-third-order-taylor-tail (third-order term S3, "~25x" first asserted)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the 1/(2 log T0) local exponent this tracks)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5; // half-log-decade Taylor step h = 1/2 (endpoint -> geometric midpoint N/sqrt(10))
const H_FD = 1e-2; // centred finite-difference step in the decade exponent x (imp-34000/imp-34001 value)

// The EXTENDED ladder: 15 decades above the imp-34001 1e12..1e15 fit window.
const DECADE_EXPONENTS = [18, 21, 24, 27, 30];
// The original imp-34001 window, carried for the combined-fit and head-to-tail comparisons.
const ORIG_EXPONENTS = [12, 13, 14, 15];

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

// Per rung: the four Taylor terms, the three per-order ratios, and their geometric mean rbar.
const rowFor = (e) => {
  const L = Lfun(e);
  const b1 = dL(e) / L;
  const b2 = d2L(e) / L;
  const b3 = d3L(e) / L;
  const b4 = d4L(e) / L;

  const S1 = HALF * b1;
  const S2 = 0.25 * b1 ** 2 - 0.125 * b2;
  const S3 = (1 / 48) * b3 - 0.125 * b1 * b2 + 0.125 * b1 ** 3;
  const S4 =
    -(1 / 384) * b4 +
    (1 / 48) * b1 * b3 +
    (1 / 64) * b2 ** 2 -
    (3 / 32) * b1 ** 2 * b2 +
    (1 / 16) * b1 ** 4;

  const r21 = S2 / S1;
  const r32 = S3 / S2;
  const r43 = S4 / S3;
  const rbar = Math.cbrt(r21 * r32 * r43);

  return { e, L, r21, r32, r43, rbar, rbarL: rbar * L, cut: 1 / rbar };
};

const TABLE = DECADE_EXPONENTS.map((e) => {
  const r = rowFor(e);
  return {
    N_log10: e,
    logT0: +r.L.toFixed(4),
    r21_S2_over_S1: +r.r21.toFixed(6),
    r32_S3_over_S2: +r.r32.toFixed(6),
    r43_S4_over_S3: +r.r43.toFixed(6),
    rbar_geomean: +r.rbar.toFixed(6), // 0.027580 .. 0.016764
    rbar_times_L: +r.rbarL.toFixed(5), // 1.09430 .. 1.11914 (still tight but drifting UP)
    reductionFactor_cut: +r.cut.toFixed(2), // 36.26 .. 59.65 (keeps ramping, no plateau)
  };
});

// Least-squares fit rbar = a + b*(1/L) over a set of rows.
const fitInvL = (rows) => {
  const xs = rows.map((r) => 1 / r.L);
  const ys = rows.map((r) => r.rbar);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i += 1) {
    const pred = intercept + slope * xs[i];
    ssr += (ys[i] - pred) ** 2;
    sst += (ys[i] - my) ** 2;
  }
  return { slope, intercept, R2: 1 - ssr / sst };
};

const EXT_ROWS = DECADE_EXPONENTS.map(rowFor);
const ALL_ROWS = [...ORIG_EXPONENTS, ...DECADE_EXPONENTS].map(rowFor);

const EXT_FIT = fitInvL(EXT_ROWS);
const ALL_FIT = fitInvL(ALL_ROWS);

// rbar*L collapse diagnostics on the extended ladder.
const RBARL = EXT_ROWS.map((r) => r.rbarL);
const RBARL_C_MEAN = +(RBARL.reduce((a, b) => a + b, 0) / RBARL.length).toFixed(5); // ~1.10828
const RBARL_SPREAD_PCT = +(
  ((Math.max(...RBARL) - Math.min(...RBARL)) / RBARL_C_MEAN) *
  100
).toFixed(3); // ~2.24
const RBAR = EXT_ROWS.map((r) => r.rbar);
const RBAR_MEAN = RBAR.reduce((a, b) => a + b, 0) / RBAR.length;
const BARE_SPREAD_PCT = +(((Math.max(...RBAR) - Math.min(...RBAR)) / RBAR_MEAN) * 100).toFixed(3); // ~50.27

// Head-to-tail rbar*L drift across the FULL 1e12..1e30 span (the "not-flat" signature).
const RBARL_HEAD_FULL = +ALL_ROWS[0].rbarL.toFixed(5); // 1.06108 at 1e12
const RBARL_TAIL_FULL = +ALL_ROWS[ALL_ROWS.length - 1].rbarL.toFixed(5); // 1.11914 at 1e30
const RBARL_DRIFT_PCT = +(
  ((RBARL_TAIL_FULL - RBARL_HEAD_FULL) / RBARL_HEAD_FULL) *
  100
).toFixed(3); // ~5.47

// Within-rung agreement of the three per-order ratios on the extended ladder.
const WITHIN_RUNG_SPREAD_PCT = +(
  Math.max(
    ...EXT_ROWS.map(
      (r) => (Math.max(r.r21, r.r32, r.r43) - Math.min(r.r21, r.r32, r.r43)) / r.rbar,
    ),
  ) * 100
).toFixed(3); // ~1.86

const CUT_HEAD_FULL = +ALL_ROWS[0].cut.toFixed(2); // 24.80 at 1e12
const CUT_TAIL_FULL = +ALL_ROWS[ALL_ROWS.length - 1].cut.toFixed(2); // 59.65 at 1e30

export const IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED = {
  id: 'imp-34060',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-34001 per-order Taylor reduction-ratio ladder 15 decades past 1e15 (to 1e18..1e30) ' +
    'and test whether the rbar*L collapse still holds and whether the fitted near-zero intercept ' +
    'a = 3.06e-3 of rbar = a + b/log T0 persists as 1/log T0 keeps shrinking. Measurement/fit only; ' +
    'no bound change; no QED.',
  componentModel:
    'Taylor terms unchanged from imp-34000/imp-34001: S1 = (1/2)b1; S2 = (1/4)b1^2 - (1/8)b2; ' +
    'S3 = (1/48)b3 - (1/8)b1 b2 + (1/8)b1^3; S4 = -(1/384)b4 + (1/48)b1 b3 + (1/64)b2^2 - ' +
    '(3/32)b1^2 b2 + (1/16)b1^4, bK = LK/L, L = log T0, L1..L4 centred finite differences (step 1e-2). ' +
    'Per-order ratios r21 = S2/S1, r32 = S3/S2, r43 = S4/S3; rbar = geometric mean of the three per ' +
    'rung. Extended ladder N = 1e18, 1e21, 1e24, 1e27, 1e30.',
  table: TABLE,
  fit: {
    // (Q1) rbar*L collapse on the extended ladder: still holds, but rbar*L is NOT flat.
    ext_bare_rbar_rel_spread_pct: BARE_SPREAD_PCT, // ~50.27 (bare ratio still drifts hugely)
    ext_rbarL_c_mean: RBARL_C_MEAN, // ~1.10828 (up from imp-34001 ~1.07)
    ext_rbarL_rel_spread_pct: RBARL_SPREAD_PCT, // ~2.24 (~22x tighter than bare: collapse survives)
    full_rbarL_head_1e12: RBARL_HEAD_FULL, // 1.06108
    full_rbarL_tail_1e30: RBARL_TAIL_FULL, // 1.11914
    full_rbarL_drift_pct: RBARL_DRIFT_PCT, // ~5.47 (monotonic upward drift: c ramps, not fixed)
    // (Q2) refit rbar = a + b/L: near-zero intercept persists, slope near unity, R^2 near-perfect.
    ext_fit_intercept_a: +EXT_FIT.intercept.toExponential(4), // ~9.4579e-4 (even closer to zero)
    ext_fit_slope_b: +EXT_FIT.slope.toFixed(5), // ~1.05800 (near unity)
    ext_fit_R2: +EXT_FIT.R2.toFixed(6), // ~0.999947
    combined_fit_intercept_a: +ALL_FIT.intercept.toExponential(4), // ~1.5754e-3 (O(1e-3), small +)
    combined_fit_slope_b: +ALL_FIT.slope.toFixed(5), // ~1.02511 (near unity)
    combined_fit_R2: +ALL_FIT.R2.toFixed(6), // ~0.999764
    // (R3) the "~25x cut" keeps ramping with no plateau.
    reduction_factor_head_1e12: CUT_HEAD_FULL, // 24.80x
    reduction_factor_tail_1e30: CUT_TAIL_FULL, // 59.65x (more than doubles over 18 decades)
    within_rung_ratio_spread_pct: WITHIN_RUNG_SPREAD_PCT, // ~1.86 (three orders still agree per rung)
  },
  findings: {
    R1_rbarL_collapse_holds_but_drifts_up:
      'Over 1e18..1e30 the bare rbar spreads 50.3% while rbar*L spreads only 2.24% -- the L rescaling ' +
      'is still ~22x tighter, so the ~c/L reading survives 15 decades past the imp-34001 fit window. ' +
      'But rbar*L is NOT a flat constant: it climbs monotonically 1.06108 (1e12) -> 1.11914 (1e30), a ' +
      '+5.47% head-to-tail drift, so c is not fixed at ~1.07 -- it ramps slowly toward ~1.12.',
    R2_near_zero_intercept_persists:
      'Refitting rbar = a + b/L over 1e18..1e30 gives a = 9.46e-4, b = 1.058, R^2 = 0.99995 -- the ' +
      'intercept stays O(1e-3) (even closer to zero than the imp-34001 3.06e-3), the slope stays near ' +
      'unity, the fit stays near-perfect. The combined 1e12..1e30 fit gives a = 1.58e-3, b = 1.025, ' +
      'R^2 = 0.99976. So a stays small and positive across the whole 18-decade span; the small ' +
      'positive intercept is exactly the slow upward rbar*L drift (rbar*L = a*L + b climbs in L).',
    R3_cut_keeps_ramping_no_plateau:
      'The per-order reduction factor 1/rbar runs 24.80x (1e12) -> 36.26x (1e18) -> 59.65x (1e30): it ' +
      'more than doubles over the full 18-decade span with no plateau. imp-34001s verdict that ' +
      '"~25x-per-order" is a ladder END value (not a constant) strengthens with reach -- the reduction ' +
      'ramps like the imp-33816 local exponents all the way to 1e30, driven by the surviving ~c/log T0 ' +
      'law with a slowly-climbing c.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/FIT (frontier-direction, NOT rigorous). Extending the imp-34001 per-order Taylor ' +
    'reduction-ratio ladder 15 decades to 1e18..1e30 confirms and sharpens the imp-34001 reading. ' +
    'The rbar*L collapse HOLDS: the bare geometric-mean ratio rbar spreads 50.3% across the extended ' +
    'rungs (0.02758 -> 0.01676) while rbar*L spreads only 2.24% (~22x tighter), so the per-order ratio ' +
    'is still ~c/log T0 fifteen decades past the fit window. But rbar*L is NOT flat -- it drifts up ' +
    'monotonically 1.06108 (1e12) -> 1.11914 (1e30), a +5.47% head-to-tail climb, so c ramps slowly ' +
    'toward ~1.12 rather than sitting at the imp-34001 ~1.07. The fitted near-zero intercept PERSISTS: ' +
    'refitting rbar = a + b/L over 1e18..1e30 gives a = 9.46e-4, b = 1.058, R^2 = 0.99995 (intercept ' +
    'even closer to zero than the imp-34001 3.06e-3, slope near unity), and the combined 1e12..1e30 ' +
    'fit gives a = 1.58e-3, b = 1.025, R^2 = 0.99976 -- a stays small and positive, and that small ' +
    'positive intercept is precisely what shows up as the slow upward rbar*L drift (rbar*L = a*L + b). ' +
    'The per-order reduction factor 1/rbar keeps ramping without a plateau, 24.80x (1e12) -> 59.65x ' +
    '(1e30), more than doubling over 18 decades, so the "~25x-per-order" cut is confirmed as a ladder ' +
    'END value ramping like the imp-33816 local exponents, not a fixed 1/25. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; L1..L4 are finite-' +
    'difference measurements; S1..S4 reproduce imp-34000/imp-34001; the C_mb GUE-conditional share per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34001 (1e12..1e15 rbar = 3.06e-3 + 0.981/L fit); imp-34000 (S1..S4 terms, "~25x-per-order" ' +
    'asserted); imp-33947 (third-order S3); imp-33816 (1/(2 log T0) local exponent this ratio tracks); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED_ASSERTIONS = [
  {
    // (Q1) The rbar*L collapse still holds far down the ladder (much tighter than the bare ratio).
    id: 'imp34060-rbarL-collapse-still-holds',
    description: 'rbar*L spread <5% and >6x tighter than the 50% bare-rbar spread on 1e18..1e30',
    holds: () =>
      RBARL_SPREAD_PCT < 5 && BARE_SPREAD_PCT > 30 && BARE_SPREAD_PCT > 6 * RBARL_SPREAD_PCT,
  },
  {
    // (R1) rbar*L is NOT flat: it drifts monotonically UP across the full 1e12..1e30 span.
    id: 'imp34060-rbarL-drifts-up-not-flat',
    description: 'rbar*L climbs head->tail across 1e12..1e30 (c ramps ~1.06 -> ~1.12, not fixed)',
    holds: () => RBARL_TAIL_FULL > RBARL_HEAD_FULL && RBARL_DRIFT_PCT > 3 && RBARL_DRIFT_PCT < 10,
  },
  {
    // (Q2) The near-zero intercept persists (stays O(1e-3), small and positive) with slope near unity.
    id: 'imp34060-near-zero-intercept-persists',
    description: 'refit intercept a stays O(1e-3) positive, slope near unity, R^2 > 0.999 (ext + combined)',
    holds: () =>
      EXT_FIT.intercept > 0 &&
      EXT_FIT.intercept < 5e-3 &&
      ALL_FIT.intercept > 0 &&
      ALL_FIT.intercept < 5e-3 &&
      EXT_FIT.slope > 0.7 &&
      EXT_FIT.slope < 1.3 &&
      ALL_FIT.slope > 0.7 &&
      ALL_FIT.slope < 1.3 &&
      EXT_FIT.R2 > 0.999 &&
      ALL_FIT.R2 > 0.999,
  },
  {
    // (R3) The reduction factor keeps ramping with no plateau -- more than doubles over 18 decades.
    id: 'imp34060-cut-keeps-ramping-no-plateau',
    description: 'reduction factor 1/rbar climbs 24.8x (1e12) to ~60x (1e30), more than doubling',
    holds: () => CUT_HEAD_FULL > 23 && CUT_HEAD_FULL < 27 && CUT_TAIL_FULL > 2 * CUT_HEAD_FULL,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp34060-honesty-gate-no-qed',
    description: 'Measurement/fit only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.isRigorous === false &&
      /NO QED/.test(IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.verdict) &&
      /remains SOTA/.test(IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.verdict),
  },
];

for (const a of IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34060-geometric-center-taylor-ratio-extended assertion failed: ${a.id}`);
  }
}
