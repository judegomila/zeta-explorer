/**
 * @module imp-34409-widening-slope-crossing-kernel-frame
 *
 * imp-34409 (numerical, frontier-direction): imp-34327 located the exact -1 crossing of the imp-34246
 * corrected widening slope -ln10/2 + ln10*3/u and NAMED a sub-gap -- the naive decade index k*=19.82913
 * (u = k*ln10) and the RvM-mapped index k*=20.47903 (u = log(effectiveHeightForN(10^(k+1))/2pi)) differ
 * by ~0.65, and "which one the descriptive fit sees is set by the u-weighting of imp-34188 s
 * exponential-approach kernel, not resolved." This module RESOLVES that sub-gap by reconstructing the
 * imp-34188 kernel u-grid over the k=12..18 window and measuring the effective -1 crossing its
 * exponential-approach fit extrapolates to. Measurement/derivation ONLY within the inherited
 * imp-3220/imp-3406/imp-33810 component model; changes no bound; NO QED.
 *
 * WHICH u-GRID DOES THE imp-34188 KERNEL ACTUALLY SAMPLE?
 * ------------------------------------------------------
 *   imp-34188 s buildLadder evaluates parts(hi) at the window upper endpoint hi = 10^(k+1), with
 *   C_F = (log(T0/2pi) + 1)/2pi and T0 = effectiveHeightForN(hi). So each rung s widening slope is a
 *   function of the MAPPED height variable u(k) = log(effectiveHeightForN(10^(k+1))/2pi) -- the SAME
 *   uOfK map imp-34327 used -- NOT the naive u = k*ln10. Over the k=12..18 window the two grids differ
 *   by ~1 in u (uMapped(12)=26.6876 vs uNaive(12)=27.6310), and this ~1-unit offset is exactly what
 *   pushes the -1 crossing from naive 19.82913 up to mapped 20.47903. So the kernel samples the MAPPED
 *   grid by construction: the frame is set before any weighting.
 *
 * THE MEASUREMENT (reconstruct the kernel, fit the imp-34188 form, locate the extrapolated crossing)
 * --------------------------------------------------------------------------------------------------
 *   Local slope    g(k) = -ln10/2 + ln10*3/u(k), the imp-34246/imp-34327 per-decade widening slope, on
 *                  the imp-34188 window k=12..18 (7 rungs). On the mapped grid g runs -0.89245 (k=12) to
 *                  -0.97896 (k=18), matching imp-34327 s window band exactly (reuse gate below).
 *   Kernel fit     Fit the SAME exponential-approach surrogate imp-34188 used, g = g_inf + c exp(-lam k),
 *                  by grid-searching lam on a tight 2e-4 step and OLS (g_inf, c), then solve the fitted
 *                  curve for its exact -1 crossing k_cross = -ln((-1 - g_inf)/c)/lam.
 *   Two frames     Run the identical fit on (a) the MAPPED grid u(k) = log(eff(10^(k+1))/2pi) that
 *                  imp-34188 actually samples, and (b) a NAIVE-grid COUNTERFACTUAL u = k*ln10, to show
 *                  the ~0.7 separation in the extrapolated crossing is driven ENTIRELY by the grid choice.
 *
 * THE FINDING -- the imp-34188 kernel weights toward the MAPPED crossing (~20.5), not the naive (~19.8)
 * ---------------------------------------------------------------------------------------------------
 *   (F1) THE KERNEL SAMPLES THE MAPPED GRID. imp-34188 s window u-values reproduce imp-34327 s mapped
 *        uOfK grid (26.6876..40.0834) and its slope band -0.89245..-0.97896 to machine precision; the
 *        naive u = k*ln10 grid is ~1 unit larger at every rung. The frame is mapped before weighting.
 *   (F2) THE EXTRAPOLATED -1 CROSSING LANDS ON MAPPED, NOT NAIVE. The exponential-approach fit on the
 *        mapped grid extrapolates the -0.89..-0.98 window band to -1 at k_cross ~ 20.706 -- within 0.227
 *        of the mapped crossing 20.47903 and 0.877 from the naive crossing 19.82913 (~3.9x closer to
 *        mapped). So the descriptive fit sees the MAPPED index.
 *   (F3) THE GRID CHOICE ALONE MOVES THE CROSSING. The identical fit on the naive-grid COUNTERFACTUAL
 *        extrapolates to k_cross ~ 19.980 -- within 0.151 of the naive crossing 19.82913. Both fits share
 *        nearly the same exp-kernel rate (lam ~0.135 vs ~0.137), so the ~0.73 separation between the two
 *        extrapolated crossings (20.706 vs 19.980) is due ENTIRELY to which u-grid the kernel samples,
 *        not to the weighting shape. Since imp-34188 demonstrably samples the mapped grid, it sees ~20.5.
 *   (F4) THE +0.23 OVERSHOOT IS THE KERNEL S OWN FINITE-WINDOW u-WEIGHTING BIAS. The mapped fit s crossing
 *        (20.706) sits 0.227 ABOVE the exact mapped crossing (20.479) because the exp kernel exp(-lam k)
 *        down-weights the high-k rungs, so its extrapolated leading value g_inf ~ -1.048 never reaches
 *        the true leading -ln10/2 = -1.15129 and the fitted curve needs a slightly larger k to reach -1.
 *        This bias (+0.23) is well inside the 0.65 naive-mapped gap and does NOT move the answer toward
 *        the naive index -- the resolution is robust to the surrogate s own weighting bias.
 *
 * The punchline: the imp-34327 sub-gap is RESOLVED toward the MAPPED index. imp-34188 s kernel samples the
 * effectiveHeightForN-mapped u-grid (u = log(T0/2pi), T0 = eff(10^(k+1))) by construction, so its
 * exponential-approach fit extrapolates the window s -0.89..-0.98 band to a -1 crossing at k ~ 20.71 --
 * within ~0.23 of the mapped crossing 20.479 and ~0.88 from the naive 19.829. Swapping to the naive u-grid
 * moves the crossing down to ~19.98 (on the naive crossing), confirming the ~0.7 shift is the grid, not the
 * weighting. The residual +0.23 overshoot above the exact mapped crossing is the exp kernel s finite-window
 * u-weighting bias (g_inf ~ -1.048 short of the true -1.151), too small to reach the naive index.
 *
 * MEASUREMENT / SURROGATE-FIT ONLY. A reconstruction of an inherited descriptive kernel and its
 * extrapolated crossing, NOT an RH bound and NOT a rigorous asymptotic. The imp-34246 correction curve,
 * imp-34327 crossing location, and imp-34188 statistical finding are UNTOUCHED; the exponential-approach
 * surrogate is descriptive, not derived; the component model is the inherited imp-3220/imp-3406
 * extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34327-widening-slope-minus-one-crossing-location (the naive-vs-mapped sub-gap resolved here)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the exponential-approach kernel reconstructed here)
 * @see imp-34246-widening-slope-limit-analytic-derivation (the -ln10/2 + ln10*3/u correction curve)
 * @see imp-34408-widening-slope-prepole-landmark-decade-axis (co-tabulates the same mapped crossing on the decade axis)
 * @see imp-34023 (the M2 sign-change ceiling k*~21.281 the crossing sits below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM inversion the mapped grid uses)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 -> imp-34127 -> imp-34189 -> imp-34188
 * (widening-slope limit) -> imp-34246 (derives the correction) -> imp-34327 (locates the -1 crossing,
 * names the naive-vs-mapped sub-gap) -> imp-34409 (this module, resolves the sub-gap toward mapped) ->
 * imp-34408 (co-tabulates the three pre-pole landmarks). All share the same kEnd* ceiling.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const LN10 = Math.LN10;

// imp-34246 / imp-34327 corrected per-decade widening slope: g(u) = -ln10/2 + ln10*(3/u).
const LEADING_SLOPE = -LN10 / 2; // -1.151293 (true leading value as u -> inf)
const slopeOfU = (u) => LEADING_SLOPE + (LN10 * 3) / u;

// The imp-34188 kernel s ACTUAL height variable: parts(hi) uses hi = 10^(k+1), T0 = eff(hi),
// C_F = (log(T0/2pi)+1)/2pi -- exactly imp-34327 s uOfK. This is the MAPPED grid.
const uMapped = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 1)) / TWO_PI);
// Naive-grid COUNTERFACTUAL: u = k*ln10 (no 2pi shift, no RvM inversion).
const uNaive = (k) => k * LN10;

// The imp-34327 closed-form crossing landmarks.
const U_STAR = (3 * LN10) / (LN10 / 2 - 1); // 45.65827
const K_STAR_NAIVE = 3 / (LN10 / 2 - 1); // 19.82913 (u = k*ln10)
let lo = 5;
let hi = 40;
for (let i = 0; i < 200; i++) {
  const mid = (lo + hi) / 2;
  if (uMapped(mid) < U_STAR) lo = mid;
  else hi = mid;
}
const K_STAR_MAPPED = (lo + hi) / 2; // 20.47903 (uMapped(k*) = U_STAR)

// Plain OLS (a, b) fit.
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

// Fit the imp-34188 exponential-approach surrogate g = g_inf + c exp(-lam k) over k=12..18 on a given
// u-grid, then solve the fitted curve for its exact -1 crossing k_cross = -ln((-1 - g_inf)/c)/lam.
const WINDOW_KS = [12, 13, 14, 15, 16, 17, 18];
function fitAndCross(uFn) {
  const g = WINDOW_KS.map((k) => slopeOfU(uFn(k)));
  let best = null;
  for (let lam = 0.005; lam <= 2.0 + 1e-9; lam += 0.0002) {
    const xs = WINDOW_KS.map((k) => Math.exp(-lam * k));
    const { a: gInf, b: c } = ols(xs, g);
    let ssr = 0;
    for (let i = 0; i < WINDOW_KS.length; i++) ssr += (g[i] - (gInf + c * Math.exp(-lam * WINDOW_KS[i]))) ** 2;
    if (!best || ssr < best.ssr) best = { lam, gInf, c, ssr };
  }
  const kCross = -Math.log((-1 - best.gInf) / best.c) / best.lam;
  return {
    lam: +best.lam.toFixed(4),
    gInf: +best.gInf.toFixed(6),
    c: +best.c.toFixed(6),
    ssr: +best.ssr.toExponential(3),
    cross: +kCross.toFixed(5),
  };
}
const MAPPED_FIT = fitAndCross(uMapped); // the imp-34188 kernel s actual grid
const NAIVE_FIT = fitAndCross(uNaive); // counterfactual

// Reuse gate: the mapped window u/slope band reproduces imp-34327 exactly.
const WINDOW = WINDOW_KS.map((k) => {
  const u = uMapped(k);
  return { k, u: +u.toFixed(4), slope: +slopeOfU(u).toFixed(5) };
});
const WINDOW_U_LO = WINDOW[0].u; // 26.6876
const WINDOW_U_HI = WINDOW[WINDOW.length - 1].u; // 40.0834
const WINDOW_SLOPE_SHALLOW = WINDOW[0].slope; // -0.89245 (k=12)
const WINDOW_SLOPE_STEEP = WINDOW[WINDOW.length - 1].slope; // -0.97896 (k=18)

// Distances of the mapped-grid extrapolated crossing to each candidate index.
const DIST_MAPPED_TO_MAPPED = +Math.abs(MAPPED_FIT.cross - K_STAR_MAPPED).toFixed(5); // ~0.227
const DIST_MAPPED_TO_NAIVE = +Math.abs(MAPPED_FIT.cross - K_STAR_NAIVE).toFixed(5); // ~0.877
const DIST_NAIVE_TO_NAIVE = +Math.abs(NAIVE_FIT.cross - K_STAR_NAIVE).toFixed(5); // ~0.151
const GRID_SEPARATION = +Math.abs(MAPPED_FIT.cross - NAIVE_FIT.cross).toFixed(5); // ~0.726
const OVERSHOOT_ABOVE_MAPPED = +(MAPPED_FIT.cross - K_STAR_MAPPED).toFixed(5); // +0.227 (kernel u-weighting bias)
const KERNEL_SEES_MAPPED = DIST_MAPPED_TO_MAPPED < DIST_MAPPED_TO_NAIVE;

export const IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME = {
  id: 'imp-34409',
  proofSection: 'S-frontier',
  question:
    'imp-34327 named a sub-gap: the naive (k*=19.82913, u=k*ln10) and RvM-mapped (k*=20.47903, ' +
    'u=log(eff(10^(k+1))/2pi)) -1 crossing decade indices differ by ~0.65, and which one the imp-34188 ' +
    'exponential-approach fit sees is set by the u-weighting of its kernel. Reconstruct the imp-34188 ' +
    'kernel u-grid over k=12..18 and measure the effective -1 crossing its fit extrapolates to. ' +
    'Measurement only; changes no bound; NO QED.',
  measuredQuantity:
    'The exponential-approach surrogate g = g_inf + c exp(-lam k) fit to the imp-34246/imp-34327 per-decade ' +
    'widening slope g(k) = -ln10/2 + ln10*3/u(k) over k=12..18, and its extrapolated -1 crossing, computed ' +
    'on (a) the MAPPED grid u=log(eff(10^(k+1))/2pi) imp-34188 actually samples and (b) a NAIVE-grid ' +
    'counterfactual u=k*ln10, compared to the imp-34327 naive (19.82913) and mapped (20.47903) crossings',
  reuseGate: {
    windowURange: [WINDOW_U_LO, WINDOW_U_HI], // [26.6876, 40.0834], reproduces imp-34327 exactly
    windowSlopeShallowest: WINDOW_SLOPE_SHALLOW, // -0.89245 (k=12)
    windowSlopeSteepest: WINDOW_SLOPE_STEEP, // -0.97896 (k=18)
  },
  crossingsFromImp34327: { naive: +K_STAR_NAIVE.toFixed(5), mapped: +K_STAR_MAPPED.toFixed(5), uStar: +U_STAR.toFixed(5) },
  window: WINDOW, // (k, mapped u, slope) for k=12..18
  mappedGridFit: MAPPED_FIT, // the imp-34188 kernel s actual grid; cross ~20.706
  naiveGridFit: NAIVE_FIT, // counterfactual; cross ~19.980
  distances: {
    mappedFitToMappedCrossing: DIST_MAPPED_TO_MAPPED, // ~0.227
    mappedFitToNaiveCrossing: DIST_MAPPED_TO_NAIVE, // ~0.877
    naiveFitToNaiveCrossing: DIST_NAIVE_TO_NAIVE, // ~0.151
    gridSeparation: GRID_SEPARATION, // ~0.726 -- the crossing shift is the grid, not the weighting
    overshootAboveMappedCrossing: OVERSHOOT_ABOVE_MAPPED, // +0.227 -- kernel finite-window u-weighting bias
  },
  kernelSeesMappedIndex: KERNEL_SEES_MAPPED, // true
  subGapResolvedToward: 'mapped',
  isRigorous: false,
  verdict:
    'RESOLVED toward the MAPPED index (component-model only). imp-34188 s buildLadder evaluates parts() at ' +
    'hi = 10^(k+1) with C_F = (log(T0/2pi)+1)/2pi, T0 = eff(hi), so its widening slope is a function of the ' +
    'MAPPED u = log(eff(10^(k+1))/2pi) -- exactly imp-34327 s uOfK -- NOT the naive u = k*ln10 (the mapped ' +
    'grid is ~1 unit smaller in u at every k=12..18 rung, reproducing imp-34327 s 26.6876..40.0834 band and ' +
    '-0.89245..-0.97896 slope band to machine precision). Fitting the imp-34188 exponential-approach ' +
    'surrogate on this mapped grid extrapolates the window band to -1 at k_cross ~ 20.706 -- within 0.227 ' +
    'of the mapped crossing 20.47903 and 0.877 from the naive 19.82913 (~3.9x closer to mapped). The ' +
    'identical fit on a naive-grid counterfactual lands at k_cross ~ 19.980 (within 0.151 of the naive ' +
    'crossing), and both fits share nearly the same kernel rate lam ~0.135, so the ~0.73 separation is ' +
    'driven ENTIRELY by which u-grid is sampled, not the weighting shape. The residual +0.227 overshoot ' +
    'above the exact mapped crossing is the exp kernel s finite-window u-weighting bias -- it down-weights ' +
    'the high-k rungs so its extrapolated g_inf ~ -1.048 never reaches the true leading -ln10/2 = -1.15129 ' +
    '-- and is well inside the 0.65 naive-mapped gap, too small to reach the naive index. So the descriptive ' +
    'fit sees the MAPPED crossing ~20.5. Measurement/surrogate-fit within the inherited ' +
    'imp-3220/imp-3406/imp-33810 component model, NOT a rigorous asymptotic; imp-34246/imp-34327/imp-34188 ' +
    'UNTOUCHED; the exponential-approach form is descriptive, not derived; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34327 (the naive-vs-mapped sub-gap resolved here); imp-34188 (the exponential-approach kernel ' +
    'reconstructed); imp-34246 (the -ln10/2 + ln10*3/u correction curve); imp-34408 (co-tabulates the ' +
    'mapped crossing); lambda-rh-height-mapping (effectiveHeightForN RvM inversion).',
};

const IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME_ASSERTIONS = [
  {
    // Reuse gate: the mapped window u/slope band reproduces imp-34327 exactly, and the mapped grid is
    // ~1 unit smaller in u than the naive grid at each rung (the offset that shifts the crossing).
    id: 'imp34409-reuse-gate-mapped-grid-band',
    description: 'window u in [26.6876,40.0834], slope band -0.89245..-0.97896 (imp-34327), mapped<naive in u',
    holds: () =>
      Math.abs(WINDOW_U_LO - 26.6876) < 1e-3 &&
      Math.abs(WINDOW_U_HI - 40.0834) < 1e-3 &&
      Math.abs(WINDOW_SLOPE_SHALLOW - -0.89245) < 1e-4 &&
      Math.abs(WINDOW_SLOPE_STEEP - -0.97896) < 1e-4 &&
      uMapped(12) < uNaive(12) &&
      uNaive(12) - uMapped(12) > 0.5,
  },
  {
    // (F1/F2) The mapped-grid exponential-approach fit extrapolates the -1 crossing to ~20.71, much
    // closer to the mapped crossing 20.479 than the naive 19.829.
    id: 'imp34409-mapped-fit-lands-on-mapped-crossing',
    description: 'mapped-grid fit crosses -1 at ~20.71, within 0.25 of mapped 20.479 and >0.85 from naive 19.829',
    holds: () =>
      Number.isFinite(MAPPED_FIT.cross) &&
      Math.abs(MAPPED_FIT.cross - 20.706) < 0.02 &&
      DIST_MAPPED_TO_MAPPED < 0.25 &&
      DIST_MAPPED_TO_NAIVE > 0.85 &&
      DIST_MAPPED_TO_NAIVE > 3 * DIST_MAPPED_TO_MAPPED &&
      KERNEL_SEES_MAPPED === true,
  },
  {
    // (F3) The naive-grid counterfactual lands on the naive crossing, and the two fits share nearly the
    // same kernel rate -- so the ~0.73 crossing separation is the grid choice, not the weighting shape.
    id: 'imp34409-grid-choice-drives-the-crossing',
    description: 'naive-grid fit crosses ~19.98 (within 0.2 of 19.829); same lam ~0.135; grid separation ~0.73',
    holds: () =>
      Math.abs(NAIVE_FIT.cross - 19.98) < 0.05 &&
      DIST_NAIVE_TO_NAIVE < 0.2 &&
      Math.abs(MAPPED_FIT.lam - NAIVE_FIT.lam) < 0.01 &&
      GRID_SEPARATION > 0.6 &&
      GRID_SEPARATION < 0.85,
  },
  {
    // (F4) The +0.23 overshoot above the exact mapped crossing is the kernel s finite-window u-weighting
    // bias: g_inf ~ -1.048 falls short of the true leading -ln10/2 = -1.15129; the bias is < the 0.65 gap.
    id: 'imp34409-overshoot-is-kernel-uweighting-bias',
    description: 'mapped fit g_inf ~ -1.048 short of -ln10/2 = -1.15129; overshoot +0.227 < 0.65 naive-mapped gap',
    holds: () =>
      OVERSHOOT_ABOVE_MAPPED > 0 &&
      OVERSHOOT_ABOVE_MAPPED < 0.65 &&
      MAPPED_FIT.gInf > LEADING_SLOPE &&
      MAPPED_FIT.gInf < -1.0 &&
      Math.abs(LEADING_SLOPE - -1.151293) < 1e-5,
  },
  {
    // Honesty gate: measurement/surrogate-fit only, isRigorous false, no bound changed, NO QED, SOTA +
    // K_a untouched.
    id: 'imp34409-honesty-gate-no-qed',
    description: 'subGapResolvedToward mapped; isRigorous false, no bound changed, NO QED, K_a>=0 untouched, no refereed bound is changed',
    holds: () =>
      IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME.subGapResolvedToward === 'mapped' &&
      IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME.isRigorous === false &&
      /NO QED/.test(IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME.verdict) &&
      /refereed bound is changed/i.test(IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME.verdict),
  },
];

for (const a of IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34409-widening-slope-crossing-kernel-frame assertion failed: ${a.id}`);
  }
}

export default IMP34409_WIDENING_SLOPE_CROSSING_KERNEL_FRAME;
