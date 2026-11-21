/**
 * @module imp-35112-sibling-estimator-resampling-se-crosscheck
 *
 * imp-35112 (accuracy, frontier): imp-34994 found that the textbook residual-based standard error MILDLY
 * UNDER-estimates the true resampling dispersion of the imp-34950 PINNED power-law exponent by a factor
 * ~1.35x (bootstrap SE ~1.19e-3, jackknife SE ~1.23e-3 vs residual SE ~8.87e-4). That factor was measured
 * ONLY for the pinned exponent. This module runs the SAME seeded-LCG bootstrap (4000 resamples with
 * replacement) and leave-one-out jackknife on the fit grids of the two SIBLING estimators --
 *   (S1) the imp-34950 FREE-K power-law exponent p_free ~ 1.5453 (OLS log-log slope on the SAME 21-point
 *        C_mb grid), and
 *   (S2) the imp-34954 G-conversion slope d ln E_coll / d ln N ~ -0.47729 at N_cross --
 * and compares each estimator resampling SE against its quoted residual SE, to characterize the ~1.35x
 * correction as estimator-GENERAL or specific to the pinned fit.
 *
 * A CAVEAT ON THE imp-34954 SLOPE ESTIMATOR (an honest reconstruction, not a native fit)
 * ------------------------------------------------------------------------------------
 * The imp-34954 slope -0.47729 is published as a SINGLE central-difference derivative at N_cross (h=1e-4),
 * NOT a regression over a fit grid -- so it has NO native residual SE to bootstrap against. To make the
 * sibling comparison meaningful this module RECONSTRUCTS the slope as an OLS log-log regression of
 * ln E_coll on ln N over a symmetric 21-point grid spanning +/- 0.5 in ln N about N_cross; that regression
 * slope reproduces the published -0.47729 to ~2e-6. The resampling SEs are then compared against the
 * regression residual SE of THAT reconstruction grid. The grid is near-DETERMINISTIC (ln E_coll is
 * ln C_C + 0.5 ln L - 0.5 ln N, linear in ln N up to the slow ln L curvature), so its residual SSE is
 * ~3.3e-8 and its residual SE ~3e-5 (~6e-5 relative) -- the slope is far more precisely determined than
 * either exponent, and the ~1.33x ratio below is a small-sample OLS geometry factor, not real dispersion.
 *
 * THE FINDING (measurement only; answers imp-35112)
 * -------------------------------------------------
 *   (F1) THE ~1.35x UNDER-ESTIMATION IS ESTIMATOR-GENERAL, NOT SPECIFIC TO THE PINNED FIT. For the free-K
 *        exponent the point estimate reproduces imp-34950 (p_free = 1.5453); its bootstrap SE ~1.63e-3 and
 *        jackknife SE ~1.71e-3 run ~1.38x and ~1.45x its residual SE ~1.18e-3. For the reconstructed
 *        G-conversion slope the point estimate reproduces imp-34954 (-0.47729); its bootstrap SE ~3.99e-5
 *        and jackknife SE ~4.15e-5 run ~1.33x and ~1.38x its reconstruction residual SE ~3.00e-5. Together
 *        with the imp-34994 pinned result (bootstrap ~1.35x, jackknife ~1.39x), ALL THREE estimators cluster
 *        the bootstrap ratio in ~1.33-1.45x, so the imp-34994 ~1.35x under-estimation is a property of the
 *        small-sample (n ~ 21) through-a-grid OLS geometry shared by the surrogate fits, NOT a feature of
 *        the pinned power law alone.
 *   (F2) THE SIBLINGS REMAIN SHARPLY DETERMINED UNDER RESAMPLING. Even at the wider resampling SEs the
 *        free-K exponent keeps its bootstrap 95% percentile CI ~ [1.5424, 1.5489] (width ~6.5e-3), and the
 *        G-conversion slope keeps a ~4e-5 absolute band about -0.47729. Neither estimator loses its
 *        published value; the correction only widens each SE by the shared ~1.35x factor.
 *
 * MEASUREMENT ONLY. This RE-USES the imp-34950 s* bisection kernels and the imp-34954 E_coll component
 * model VERBATIM and resamples their fit grids; it changes NO bound. It does NOT discharge the GUE
 * conditional (C_mb GUE-conditional per imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34994-cmb-exponent-bootstrap-jackknife (the ~1.35x factor for the PINNED exponent this generalizes)
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the free-K exponent p_free ~ 1.5453)
 * @see imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck (the G-conversion slope -0.47729)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL } from './imp-34950-eflow-crossing-strength-cmb-exponent-structural.js';
import { IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK } from './imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34950/imp-34954/imp-34994 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// deterministic seeded LCG (glibc constants, masked to 31 bits) -- keeps the resampling reproducible so the
// assertions are stable (Math.random would make the build non-deterministic). imp-34994 used the same seed.
function makeLcg(seed) {
  let state = seed;
  return function lcgUnit() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}
const B_RESAMPLES = 4000;
const BOOT_SEED = 1234567;

// ============================================================================================================
// (S1) imp-34950 FREE-K power-law exponent p_free on the reused 21-point C_mb grid
// ============================================================================================================
// --- kernels reused VERBATIM from imp-34950 (C_mb enters u_0 as an additive ln C_mb shift) ------------------
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function u0(x, cmb) {
  return Math.log(cmb) + Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
function uFull(x, s, cmb) {
  return u0(x, cmb) + phi(x, s);
}
function sigmaOf(x, s, cmb) {
  return 1 / (1 + Math.exp(-uFull(x, s, cmb)));
}
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}
function d2Cond(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const up = d1((z) => uFull(z, s, cmb), x, h);
  const upp = d2((z) => uFull(z, s, cmb), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const v = -d1((z) => uFull(z, s, cmb), x, h);
  const vp = -d2((z) => uFull(z, s, cmb), x, h);
  const vpp = -d3((z) => uFull(z, s, cmb), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return 0.5 * (a + b);
}
const LN10 = Math.LN10;
const LO = Math.log(1e6);
const HI = Math.log(1e13);
function kneeAt(s, cmb) {
  return bisect((x) => fKnee(x, s, cmb, H_ID), LO, HI);
}
function inflAt(s, cmb) {
  return bisect((x) => d2Cond(x, s, cmb, H_ID), LO, HI);
}
function gapAt(s, cmb) {
  return (kneeAt(s, cmb) - inflAt(s, cmb)) / LN10;
}
function sStarAt(cmb) {
  return bisect((s) => gapAt(s, cmb), 0, 1);
}
const CMB_GRID = [];
for (let i = 0; i <= 20; i++) {
  CMB_GRID.push(+(1.0 - 0.025 * i).toFixed(4));
}
const S_STAR = CMB_GRID.map((c) => sStarAt(c));
const LC = CMB_GRID.map((c) => Math.log(c));
const LS = S_STAR.map((s) => Math.log(s));
const NPTS = CMB_GRID.length;

// free-K OLS log-log slope on an index MULTISET (bootstrap / jackknife use the same estimator).
function freeSlopeOn(idxs) {
  let st = 0, sy = 0, stt = 0, sty = 0;
  const n = idxs.length;
  for (const i of idxs) {
    st += LC[i]; sy += LS[i]; stt += LC[i] * LC[i]; sty += LC[i] * LS[i];
  }
  const denom = n * stt - st * st;
  return denom !== 0 ? (n * sty - st * sy) / denom : NaN;
}
const ALL_IDX = Array.from({ length: NPTS }, (_, i) => i);
const P_FREE = freeSlopeOn(ALL_IDX); // ~1.5453, reproduces imp-34950 free-K

// free-K residual SE (the imp-34950 classic OLS slope SE formula, recomputed for the side-by-side compare).
let stF = 0, syF = 0, sttF = 0;
for (let i = 0; i < NPTS; i++) { stF += LC[i]; syF += LS[i]; sttF += LC[i] * LC[i]; }
const A_FREE = (syF - P_FREE * stF) / NPTS;
let sseFree = 0;
for (let i = 0; i < NPTS; i++) {
  const r = LS[i] - (A_FREE + P_FREE * LC[i]);
  sseFree += r * r;
}
const SXX_FREE = sttF - (stF * stF) / NPTS;
const SE_FREE_RESIDUAL = Math.sqrt((sseFree / (NPTS - 2)) / SXX_FREE); // ~1.18e-3

// bootstrap the free-K slope (resample the 21 grid points WITH replacement).
const bootFree = makeLcg(BOOT_SEED);
const BOOT_FREE = [];
for (let b = 0; b < B_RESAMPLES; b++) {
  const idxs = [];
  for (let k = 0; k < NPTS; k++) idxs.push(Math.floor(bootFree() * NPTS));
  const p = freeSlopeOn(idxs);
  if (Number.isFinite(p)) BOOT_FREE.push(p);
}
BOOT_FREE.sort((a, b) => a - b);
const BOOT_FREE_N = BOOT_FREE.length;
const BOOT_FREE_MEAN = BOOT_FREE.reduce((a, b) => a + b, 0) / BOOT_FREE_N;
let bootFreeVar = 0;
for (const p of BOOT_FREE) bootFreeVar += (p - BOOT_FREE_MEAN) * (p - BOOT_FREE_MEAN);
const SE_FREE_BOOT = Math.sqrt(bootFreeVar / (BOOT_FREE_N - 1)); // ~1.63e-3
function bootFreeQ(q) {
  const idx = Math.min(BOOT_FREE_N - 1, Math.max(0, Math.floor(q * (BOOT_FREE_N - 1))));
  return BOOT_FREE[idx];
}
const BOOT_FREE_CI_LO = bootFreeQ(0.025); // ~1.5424
const BOOT_FREE_CI_HI = bootFreeQ(0.975); // ~1.5489

// jackknife the free-K slope (leave-one-out over the 21 grid points).
const JK_FREE = ALL_IDX.map((i) => freeSlopeOn(ALL_IDX.filter((j) => j !== i)));
const JK_FREE_MEAN = JK_FREE.reduce((a, b) => a + b, 0) / NPTS;
let jkFreeVar = 0;
for (const p of JK_FREE) jkFreeVar += (p - JK_FREE_MEAN) * (p - JK_FREE_MEAN);
const SE_FREE_JK = Math.sqrt(((NPTS - 1) / NPTS) * jkFreeVar); // ~1.71e-3

const FREE_BOOT_OVER_RESIDUAL = SE_FREE_BOOT / SE_FREE_RESIDUAL; // ~1.38
const FREE_JK_OVER_RESIDUAL = SE_FREE_JK / SE_FREE_RESIDUAL; // ~1.45

// ============================================================================================================
// (S2) imp-34954 G-conversion slope d ln E_coll / d ln N at N_cross (reconstructed as a local regression)
// ============================================================================================================
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9 (imp-3444)
const LN_CROSS = Math.log(N_CROSS);
// the imp-34954 published point estimate: a single central-difference derivative (h=1e-4).
const H_PT = 1e-4;
const SLOPE_POINT =
  (Math.log(parts(Math.exp(LN_CROSS + H_PT)).E_coll) - Math.log(parts(Math.exp(LN_CROSS - H_PT)).E_coll)) /
  (2 * H_PT); // ~-0.47728831

// reconstruct the slope as an OLS regression of ln E_coll on ln N over a symmetric +/- 0.5 lnN, 21-point grid.
const SLOPE_MPTS = 21;
const SLOPE_WIN = 0.5;
const XN = [];
const YE = [];
for (let i = 0; i < SLOPE_MPTS; i++) {
  const xln = LN_CROSS - SLOPE_WIN + (2 * SLOPE_WIN) * i / (SLOPE_MPTS - 1);
  XN.push(xln);
  YE.push(Math.log(parts(Math.exp(xln)).E_coll));
}
function slopeFitOn(idxs) {
  let st = 0, sy = 0, stt = 0, sty = 0;
  const n = idxs.length;
  for (const i of idxs) {
    st += XN[i]; sy += YE[i]; stt += XN[i] * XN[i]; sty += XN[i] * YE[i];
  }
  const denom = n * stt - st * st;
  return denom !== 0 ? (n * sty - st * sy) / denom : NaN;
}
const SLOPE_ALL = Array.from({ length: SLOPE_MPTS }, (_, i) => i);
const SLOPE_REG = slopeFitOn(SLOPE_ALL); // ~-0.47728614, reproduces the imp-34954 point slope to ~2e-6

// reconstruction residual SE (near-deterministic grid: ln E_coll linear in ln N up to the slow ln L curvature).
let stS = 0, syS = 0, sttS = 0;
for (let i = 0; i < SLOPE_MPTS; i++) { stS += XN[i]; syS += YE[i]; sttS += XN[i] * XN[i]; }
const A_SLOPE = (syS - SLOPE_REG * stS) / SLOPE_MPTS;
let sseSlope = 0;
for (let i = 0; i < SLOPE_MPTS; i++) {
  const r = YE[i] - (A_SLOPE + SLOPE_REG * XN[i]);
  sseSlope += r * r;
}
const SXX_SLOPE = sttS - (stS * stS) / SLOPE_MPTS;
const SE_SLOPE_RESIDUAL = Math.sqrt((sseSlope / (SLOPE_MPTS - 2)) / SXX_SLOPE); // ~3.0e-5

// bootstrap the reconstructed slope (fresh seeded LCG, same seed / same resample count).
const bootSlope = makeLcg(BOOT_SEED);
const BOOT_SLOPE = [];
for (let b = 0; b < B_RESAMPLES; b++) {
  const idxs = [];
  for (let k = 0; k < SLOPE_MPTS; k++) idxs.push(Math.floor(bootSlope() * SLOPE_MPTS));
  const p = slopeFitOn(idxs);
  if (Number.isFinite(p)) BOOT_SLOPE.push(p);
}
const BOOT_SLOPE_N = BOOT_SLOPE.length;
const BOOT_SLOPE_MEAN = BOOT_SLOPE.reduce((a, b) => a + b, 0) / BOOT_SLOPE_N;
let bootSlopeVar = 0;
for (const p of BOOT_SLOPE) bootSlopeVar += (p - BOOT_SLOPE_MEAN) * (p - BOOT_SLOPE_MEAN);
const SE_SLOPE_BOOT = Math.sqrt(bootSlopeVar / (BOOT_SLOPE_N - 1)); // ~3.99e-5

// jackknife the reconstructed slope (leave-one-out over the 21 grid points).
const JK_SLOPE = SLOPE_ALL.map((i) => slopeFitOn(SLOPE_ALL.filter((j) => j !== i)));
const JK_SLOPE_MEAN = JK_SLOPE.reduce((a, b) => a + b, 0) / SLOPE_MPTS;
let jkSlopeVar = 0;
for (const p of JK_SLOPE) jkSlopeVar += (p - JK_SLOPE_MEAN) * (p - JK_SLOPE_MEAN);
const SE_SLOPE_JK = Math.sqrt(((SLOPE_MPTS - 1) / SLOPE_MPTS) * jkSlopeVar); // ~4.15e-5

const SLOPE_BOOT_OVER_RESIDUAL = SE_SLOPE_BOOT / SE_SLOPE_RESIDUAL; // ~1.33
const SLOPE_JK_OVER_RESIDUAL = SE_SLOPE_JK / SE_SLOPE_RESIDUAL; // ~1.38

// --- reuse gates: the two point estimates reproduce the imp-34950 / imp-34954 published values -------------
const P_FREE_VS_IMP34950 = Math.abs(P_FREE - IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.free.p);
const SLOPE_VS_IMP34954 = Math.abs(
  SLOPE_REG - IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK.refinedConversion.measured_E_coll_log_slope_at_N_cross,
);
// the imp-34994 pinned reference ratio, for the estimator-general clustering statement.
const IMP34994_PINNED_BOOT_RATIO = 1.35; // imp-34994 bootstrap SE / residual SE

export const IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK = {
  id: 'imp-35112',
  proofSection: 'S-frontier',
  question:
    'imp-34994 measured the ~1.35x resampling-over-residual SE under-estimation ONLY for the imp-34950 ' +
    'PINNED power-law exponent. Run the SAME seeded-LCG bootstrap (4000 resamples, with replacement) and ' +
    'leave-one-out jackknife on the fit grids of the two SIBLING estimators -- the imp-34950 free-K exponent ' +
    'p_free ~ 1.5453 and the imp-34954 G-conversion slope d ln E_coll/d ln N ~ -0.47729 -- and compare each ' +
    'resampling SE against its quoted residual SE, to decide whether the ~1.35x correction is ' +
    'estimator-general or specific to the pinned fit. Measurement only; changes no bound; does NOT discharge ' +
    'the GUE conditional (imp-486); NO QED.',
  verdictShort:
    'The ~1.35x under-estimation is ESTIMATOR-GENERAL, not specific to the pinned fit. The free-K exponent ' +
    'reproduces imp-34950 (p_free = 1.5453); its bootstrap SE ~1.63e-3 and jackknife SE ~1.71e-3 run ~1.38x ' +
    'and ~1.45x its residual SE ~1.18e-3. The reconstructed G-conversion slope reproduces imp-34954 ' +
    '(-0.47729); its bootstrap SE ~3.99e-5 and jackknife SE ~4.15e-5 run ~1.33x and ~1.38x its reconstruction ' +
    'residual SE ~3.00e-5. With the imp-34994 pinned result (~1.35x boot, ~1.39x jk), ALL THREE estimators ' +
    'cluster the bootstrap ratio in ~1.33-1.45x, so the correction is a small-sample (n ~ 21) through-a-grid ' +
    'OLS geometry factor of the shared surrogate fits, not a feature of the pinned power law. CAVEAT: the ' +
    'imp-34954 slope is published as a single central-difference derivative (no native residual SE), so its ' +
    'comparison uses a reconstructed +/- 0.5-lnN 21-point local log-log regression grid whose OLS slope ' +
    'reproduces -0.47729 to ~2e-6; that grid is near-deterministic (residual SSE ~3.3e-8), so its ~1.33x ' +
    'ratio is a geometric small-sample factor and the slope is far more precisely determined than either ' +
    'exponent.',
  measuredQuantity:
    'the bootstrap (4000 seeded-LCG resamples, with replacement) and jackknife (leave-one-out) standard ' +
    'errors of (S1) the imp-34950 free-K OLS log-log exponent p_free on the reused 21-point C_mb grid and ' +
    '(S2) the imp-34954 E_coll log-slope reconstructed as an OLS regression over a +/- 0.5-lnN 21-point grid ' +
    'about N_cross, each compared against its residual-based SE',
  freeKExponent: {
    p_free: +P_FREE.toFixed(5), // ~1.54525
    p_free_imp34950: IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.free.p,
    p_free_vs_imp34950_absdiff: +P_FREE_VS_IMP34950.toExponential(3),
    se_residual: +SE_FREE_RESIDUAL.toExponential(3), // ~1.18e-3
    se_bootstrap: +SE_FREE_BOOT.toExponential(3), // ~1.63e-3
    se_jackknife: +SE_FREE_JK.toExponential(3), // ~1.71e-3
    bootstrap_over_residual: +FREE_BOOT_OVER_RESIDUAL.toFixed(3), // ~1.38
    jackknife_over_residual: +FREE_JK_OVER_RESIDUAL.toFixed(3), // ~1.45
    bootstrap_ci95_lo: +BOOT_FREE_CI_LO.toFixed(5), // ~1.5424
    bootstrap_ci95_hi: +BOOT_FREE_CI_HI.toFixed(5), // ~1.5489
  },
  gConversionSlope: {
    slope_point_central_diff: +SLOPE_POINT.toFixed(8), // ~-0.47728831 (imp-34954 published estimator)
    slope_regression_reconstruction: +SLOPE_REG.toFixed(8), // ~-0.47728614 (grid OLS, reproduces the point)
    slope_imp34954: IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK.refinedConversion.measured_E_coll_log_slope_at_N_cross,
    slope_vs_imp34954_absdiff: +SLOPE_VS_IMP34954.toExponential(3),
    reconstruction_grid: 'OLS of ln E_coll on ln N over 21 points spanning +/- 0.5 in ln N about N_cross',
    se_residual_reconstruction: +SE_SLOPE_RESIDUAL.toExponential(3), // ~3.0e-5
    se_bootstrap: +SE_SLOPE_BOOT.toExponential(3), // ~3.99e-5
    se_jackknife: +SE_SLOPE_JK.toExponential(3), // ~4.15e-5
    bootstrap_over_residual: +SLOPE_BOOT_OVER_RESIDUAL.toFixed(3), // ~1.33
    jackknife_over_residual: +SLOPE_JK_OVER_RESIDUAL.toFixed(3), // ~1.38
    caveat:
      'The imp-34954 slope is published as a single central-difference derivative with NO native residual SE; ' +
      'this comparison RECONSTRUCTS it as a local log-log regression grid whose OLS slope reproduces -0.47729 ' +
      'to ~2e-6. That grid is near-deterministic (residual SSE ~3.3e-8, residual SE ~6e-5 relative), so the ' +
      '~1.33x ratio is a small-sample OLS geometry factor, not real dispersion.',
  },
  estimatorGeneralClustering: {
    pinned_imp34994_bootstrap_over_residual: IMP34994_PINNED_BOOT_RATIO, // ~1.35
    free_bootstrap_over_residual: +FREE_BOOT_OVER_RESIDUAL.toFixed(3), // ~1.38
    slope_bootstrap_over_residual: +SLOPE_BOOT_OVER_RESIDUAL.toFixed(3), // ~1.33
    note:
      'The bootstrap-over-residual ratio clusters in ~1.33-1.45x across all three estimators (pinned, free-K, ' +
      'slope), so the imp-34994 ~1.35x under-estimation is a shared small-sample (n ~ 21) OLS geometry ' +
      'property, NOT specific to the pinned power-law fit.',
  },
  finding: {
    F1_under_estimation_is_estimator_general:
      'The free-K exponent reproduces imp-34950 (p_free = 1.5453) with bootstrap SE ~1.63e-3 (~1.38x) and ' +
      'jackknife SE ~1.71e-3 (~1.45x) over its residual SE ~1.18e-3. The reconstructed G-conversion slope ' +
      'reproduces imp-34954 (-0.47729) with bootstrap SE ~3.99e-5 (~1.33x) and jackknife SE ~4.15e-5 (~1.38x) ' +
      'over its reconstruction residual SE ~3.00e-5. With the imp-34994 pinned ~1.35x, all three cluster the ' +
      'bootstrap ratio in ~1.33-1.45x, so the ~1.35x under-estimation is a shared small-sample OLS geometry ' +
      'factor, not specific to the pinned fit.',
    F2_siblings_stay_sharply_determined:
      'Even at the wider resampling SEs the free-K exponent keeps a tight bootstrap 95% percentile CI ' +
      '~[1.5424, 1.5489] and the G-conversion slope keeps a ~4e-5 absolute band about -0.47729; neither ' +
      'estimator loses its published value under resampling.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Running the imp-34994 seeded-LCG bootstrap (4000 resamples, with ' +
    'replacement) and leave-one-out jackknife on the two SIBLING estimators: (F1) the ~1.35x ' +
    'resampling-over-residual SE under-estimation is ESTIMATOR-GENERAL -- the imp-34950 free-K exponent ' +
    '(point p_free = 1.5453, reproducing imp-34950) has bootstrap SE ~1.63e-3 (~1.38x) and jackknife SE ' +
    '~1.71e-3 (~1.45x) over its residual SE ~1.18e-3, and the imp-34954 G-conversion slope (point -0.47729, ' +
    'reproducing imp-34954), reconstructed as a +/- 0.5-lnN 21-point local log-log regression, has bootstrap ' +
    'SE ~3.99e-5 (~1.33x) and jackknife SE ~4.15e-5 (~1.38x) over its reconstruction residual SE ~3.00e-5. ' +
    'With the imp-34994 pinned ~1.35x, all three estimators cluster the bootstrap ratio in ~1.33-1.45x, so ' +
    'the correction is a small-sample (n ~ 21) through-a-grid OLS geometry factor of the shared surrogate ' +
    'fits, NOT a feature of the pinned power law. CAVEAT: the imp-34954 slope is published as a single ' +
    'central-difference derivative with no native residual SE, so its comparison uses a reconstructed grid ' +
    'whose OLS slope reproduces -0.47729 to ~2e-6 and which is near-deterministic (residual SSE ~3.3e-8) -- ' +
    'its ~1.33x ratio is a geometric small-sample factor, and the slope is far more precisely determined ' +
    'than either exponent. (F2) Both siblings stay sharply determined under resampling (free-K bootstrap 95% ' +
    'percentile CI ~[1.5424, 1.5489]; slope ~4e-5 band about -0.47729). This RE-USES the imp-34950 s* ' +
    'bisection kernels and the imp-34954 E_coll component model VERBATIM and resamples their fit grids; it ' +
    'changes NO bound; does NOT discharge the GUE conditional (C_mb GUE-conditional per imp-486); the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'ANSWERS imp-35112: the imp-34994 ~1.35x resampling-over-residual SE under-estimation is ' +
    'ESTIMATOR-GENERAL -- free-K exponent bootstrap/jackknife ~1.38x/~1.45x (SE ~1.63e-3/~1.71e-3 vs residual ' +
    '~1.18e-3), G-conversion slope ~1.33x/~1.38x (SE ~3.99e-5/~4.15e-5 vs reconstruction residual ~3.00e-5), ' +
    'clustering with the pinned ~1.35x into a ~1.33-1.45x small-sample OLS geometry band. What stays OPEN ' +
    '(deferred, changes no bound): the imp-34954 slope has NO native residual SE (it is a single ' +
    'central-difference derivative), so its comparison rests on a reconstructed local-regression grid -- a ' +
    'first-principles small-sample SE-inflation factor for n = 21 through-origin/free OLS would let the ' +
    '~1.35x be predicted rather than measured; and whether the resampling band is surrogate-independent or ' +
    'drifts with the imp-3220/imp-3406 extrapolation. C_mb GUE-conditional per imp-486; NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-34994 (the ~1.35x factor for the pinned exponent this generalizes); imp-34950 (the free-K exponent ' +
    'p_free ~ 1.5453); imp-34954 (the G-conversion slope -0.47729); imp-3463 (far-tail exponent 1/2); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK_ASSERTIONS = [
  {
    // Reuse gate: both sibling point estimates reproduce the imp-34950 / imp-34954 published values.
    id: 'imp35112-reproduces-sibling-point-estimates',
    description: 'free-K p_free reproduces imp-34950 and the reconstructed slope reproduces imp-34954',
    holds: () =>
      P_FREE_VS_IMP34950 < 1e-3 &&
      Math.abs(P_FREE - 1.5453) < 5e-3 &&
      SLOPE_VS_IMP34954 < 1e-4 &&
      Math.abs(SLOPE_REG + 0.47729) < 1e-3,
  },
  {
    // (F1): the free-K resampling SEs exceed the residual SE by the ~1.35x-family factor.
    id: 'imp35112-freek-resampling-se-wider',
    description: 'free-K bootstrap and jackknife SEs exceed the residual SE with ratio in the ~1.3-1.5x band',
    holds: () =>
      SE_FREE_BOOT > SE_FREE_RESIDUAL &&
      SE_FREE_JK > SE_FREE_RESIDUAL &&
      FREE_BOOT_OVER_RESIDUAL > 1.2 &&
      FREE_BOOT_OVER_RESIDUAL < 1.6 &&
      FREE_JK_OVER_RESIDUAL > 1.2 &&
      FREE_JK_OVER_RESIDUAL < 1.7,
  },
  {
    // (F1): the reconstructed G-conversion slope resampling SEs exceed the residual SE by the same factor.
    id: 'imp35112-slope-resampling-se-wider',
    description: 'reconstructed-slope bootstrap and jackknife SEs exceed the residual SE with ratio ~1.3-1.5x',
    holds: () =>
      SE_SLOPE_BOOT > SE_SLOPE_RESIDUAL &&
      SE_SLOPE_JK > SE_SLOPE_RESIDUAL &&
      SLOPE_BOOT_OVER_RESIDUAL > 1.2 &&
      SLOPE_BOOT_OVER_RESIDUAL < 1.6 &&
      SLOPE_JK_OVER_RESIDUAL > 1.2 &&
      SLOPE_JK_OVER_RESIDUAL < 1.6,
  },
  {
    // (F1): the ratios cluster across all three estimators (pinned, free-K, slope) in a ~1.3-1.5x band.
    id: 'imp35112-ratio-clusters-across-estimators',
    description: 'the bootstrap-over-residual ratio is estimator-general (pinned/free-K/slope all ~1.3-1.5x)',
    holds: () =>
      Math.abs(FREE_BOOT_OVER_RESIDUAL - IMP34994_PINNED_BOOT_RATIO) < 0.15 &&
      Math.abs(SLOPE_BOOT_OVER_RESIDUAL - IMP34994_PINNED_BOOT_RATIO) < 0.15,
  },
  {
    // (S2) caveat gate: the reconstruction grid is near-deterministic (its residual SE is tiny in relative terms).
    id: 'imp35112-slope-reconstruction-near-deterministic',
    description: 'the reconstructed-slope residual SE is a tiny fraction of the slope magnitude (near-deterministic grid)',
    holds: () =>
      SE_SLOPE_RESIDUAL > 0 &&
      SE_SLOPE_RESIDUAL / Math.abs(SLOPE_REG) < 1e-3,
  },
  {
    // (F2): both siblings keep tight resampling bands (free-K bootstrap CI narrow and bracketing the point).
    id: 'imp35112-siblings-stay-sharply-determined',
    description: 'the free-K bootstrap 95% CI is narrow and brackets p_free; bootstrap sample count is full',
    holds: () =>
      BOOT_FREE_CI_HI - BOOT_FREE_CI_LO < 1e-2 &&
      P_FREE >= BOOT_FREE_CI_LO &&
      P_FREE <= BOOT_FREE_CI_HI &&
      BOOT_FREE_N > 3900 &&
      BOOT_SLOPE_N > 3900,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp35112-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK.isRigorous === false &&
      IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK.farTailExponent === 0.5 &&
      typeof IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK.subGap === 'string' &&
      /imp-486/.test(IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK.subGap) &&
      /NO QED/.test(IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK.verdict),
  },
];

for (const a of IMP35112_SIBLING_ESTIMATOR_RESAMPLING_SE_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35112-sibling-estimator-resampling-se-crosscheck assertion failed: ${a.id}`);
  }
}
