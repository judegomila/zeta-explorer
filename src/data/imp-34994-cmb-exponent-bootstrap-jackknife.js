/**
 * @module imp-34994-cmb-exponent-bootstrap-jackknife
 *
 * imp-34994 (accuracy, frontier): imp-34950 F1 extracted the imp-34925 pinned power-law exponent
 * p_pinned = 1.5493 for the E_flow knee-vs-inflection crossing strength drift s*(C_mb) = K C_mb^p, with a
 * SINGLE residual-based standard error (~8.9e-4, 95% CI ~ [1.5476, 1.5511]) and asserted the clean rationals
 * 3/2 = 1.5 and 8/5 = 1.6 lie "tens of sigma outside the CI". That standard error is a textbook regression
 * formula built on the homoscedastic-normal-residual assumption; it was never STRESS-TESTED by resampling.
 * This module bootstraps (resample the 21-point C_mb fit grid WITH replacement) and jackknifes (leave-one-out)
 * the SAME through-origin log-log slope on the SAME imp-34950 kernels, VERBATIM, and asks whether the
 * clean-rational rejection survives a resampling-based uncertainty band that makes NO residual-normality
 * assumption.
 *
 * THE FINDING (measurement only; answers imp-34994)
 * -------------------------------------------------
 *   (F1) THE POINT ESTIMATE IS UNCHANGED AND THE RESAMPLING SE IS SLIGHTLY WIDER. The pinned through-origin
 *        slope on the full grid reproduces imp-34950 exactly (p = 1.5493). The bootstrap distribution over 4000
 *        deterministic (seeded-LCG) resamples has mean ~1.5495 and standard error ~1.19e-3; the jackknife SE is
 *        ~1.23e-3. Both are ~1.35x the imp-34950 residual-based SE (~8.87e-4) -- so the textbook residual SE
 *        MILDLY UNDER-estimates the true dispersion, and the honest 95% band is a touch wider than imp-34950
 *        reported (bootstrap percentile CI ~ [1.5475, 1.5521]).
 *   (F2) THE CLEAN-RATIONAL REJECTION SURVIVES THE WIDER BAND. Under the (more conservative) bootstrap SE,
 *        3/2 sits ~41 sigma and 8/5 ~42 sigma from p; under the jackknife SE, ~40 and ~41 sigma. Both rationals
 *        remain FAR OUTSIDE the bootstrap 95% percentile CI. So the "tens of sigma" claim of imp-34950 F1 is
 *        confirmed against resampling: the drop from ~55 sigma (residual-based) to ~41 sigma (resampling-based)
 *        does not come remotely close to admitting either rational. p is a genuinely measured NON-rational
 *        exponent of the inherited surrogate, not a residual-normality artifact.
 *
 * MEASUREMENT ONLY. This RE-USES the imp-34950 / imp-34925 s* bisection kernels verbatim and resamples the
 * fit grid; it changes NO bound. It does NOT discharge the GUE conditional (C_mb GUE-conditional per imp-486);
 * the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed
 * . "p is non-rational" is a statement about the SURROGATE fit, NOT a structural or arithmetic fact.
 *
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the single residual-based CI this stress-tests)
 * @see imp-34925-eflow-crossing-strength-cmb-functional-form (the power-law form + point p ~ 1.549)
 * @see imp-34886-eflow-strength-knee-inflection-crossing (the s* ~ 0.78 crossing at C_mb=1, D2/D3 kernels reused)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL } from './imp-34950-eflow-crossing-strength-cmb-exponent-structural.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34886/imp-34907/imp-34925/imp-34950 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

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

// --- the imp-34950 finer 21-point sweep over C_mb in [0.5, 1] (step 0.025), reused verbatim ------------------
const CMB_GRID = [];
for (let i = 0; i <= 20; i++) {
  CMB_GRID.push(+(1.0 - 0.025 * i).toFixed(4));
}
const S_STAR = CMB_GRID.map((c) => sStarAt(c));
const S_STAR_AT_1 = S_STAR[0]; // ~0.77765
const LN_S1 = Math.log(S_STAR_AT_1);
const LC = CMB_GRID.map((c) => Math.log(c));
const LS = S_STAR.map((s) => Math.log(s));
const NPTS = CMB_GRID.length;

// pinned through-origin log-log slope on an index MULTISET (bootstrap / jackknife use the same estimator).
function pinnedSlopeOn(idxs) {
  let num = 0, den = 0;
  for (const i of idxs) {
    const r = LS[i] - LN_S1;
    num += r * LC[i];
    den += LC[i] * LC[i];
  }
  return den > 0 ? num / den : NaN;
}
const ALL_IDX = Array.from({ length: NPTS }, (_, i) => i);
const P_PINNED = pinnedSlopeOn(ALL_IDX); // ~1.5493, reproduces imp-34950

// residual-based SE (the imp-34950 formula, recomputed here for the side-by-side comparison).
let ssePin = 0, denPin = 0;
for (let i = 0; i < NPTS; i++) {
  const r = (LS[i] - LN_S1) - P_PINNED * LC[i];
  ssePin += r * r;
  denPin += LC[i] * LC[i];
}
const SE_RESIDUAL = Math.sqrt((ssePin / (NPTS - 1)) / denPin); // ~8.87e-4

// --- (F1) BOOTSTRAP: resample the 21 fit-grid points WITH replacement, deterministic seeded LCG -------------
// A fixed-seed linear congruential generator keeps the resampling reproducible so the assertions are stable
// (Math.random would make the build non-deterministic). glibc-style constants; masked to 31 bits.
const B_RESAMPLES = 4000;
let lcgState = 1234567;
function lcgUnit() {
  lcgState = (lcgState * 1103515245 + 12345) & 0x7fffffff;
  return lcgState / 0x7fffffff;
}
const BOOT_P = [];
for (let b = 0; b < B_RESAMPLES; b++) {
  const idxs = [];
  for (let k = 0; k < NPTS; k++) idxs.push(Math.floor(lcgUnit() * NPTS));
  const p = pinnedSlopeOn(idxs);
  if (Number.isFinite(p)) BOOT_P.push(p);
}
BOOT_P.sort((a, b) => a - b);
const BOOT_N = BOOT_P.length;
const BOOT_MEAN = BOOT_P.reduce((a, b) => a + b, 0) / BOOT_N;
let bootVar = 0;
for (const p of BOOT_P) bootVar += (p - BOOT_MEAN) * (p - BOOT_MEAN);
const SE_BOOT = Math.sqrt(bootVar / (BOOT_N - 1)); // ~1.19e-3
function bootQuantile(q) {
  const idx = Math.min(BOOT_N - 1, Math.max(0, Math.floor(q * (BOOT_N - 1))));
  return BOOT_P[idx];
}
const BOOT_CI_LO = bootQuantile(0.025); // ~1.5475
const BOOT_CI_HI = bootQuantile(0.975); // ~1.5521

// histogram of the 4000-sample bootstrap distribution, 30 equal-width bins over [min, max]
// (imp-35123 viz: makes the shape of the resampling distribution, not just its summary
// stats, directly plottable without re-running the LCG resample in the page itself).
const HIST_BINS = 30;
const BOOT_MIN = BOOT_P[0];
const BOOT_MAX = BOOT_P[BOOT_N - 1];
const HIST_WIDTH = (BOOT_MAX - BOOT_MIN) / HIST_BINS;
const HIST_COUNTS = new Array(HIST_BINS).fill(0);
for (const p of BOOT_P) {
  const idx = Math.min(HIST_BINS - 1, Math.floor((p - BOOT_MIN) / HIST_WIDTH));
  HIST_COUNTS[idx]++;
}
const HIST_EDGES = Array.from({ length: HIST_BINS + 1 }, (_, i) => +(BOOT_MIN + i * HIST_WIDTH).toFixed(5));

// --- (F1) JACKKNIFE: leave-one-out over the 21 grid points --------------------------------------------------
const JK_P = ALL_IDX.map((i) => pinnedSlopeOn(ALL_IDX.filter((j) => j !== i)));
const JK_MEAN = JK_P.reduce((a, b) => a + b, 0) / NPTS;
let jkVar = 0;
for (const p of JK_P) jkVar += (p - JK_MEAN) * (p - JK_MEAN);
const SE_JK = Math.sqrt(((NPTS - 1) / NPTS) * jkVar); // ~1.23e-3

// how much wider the resampling SEs are than the textbook residual SE.
const BOOT_OVER_RESIDUAL = SE_BOOT / SE_RESIDUAL; // ~1.35
const JK_OVER_RESIDUAL = SE_JK / SE_RESIDUAL; // ~1.39

// --- (F2) CLEAN-RATIONAL REJECTION under the resampling bands -----------------------------------------------
const SIGMA_1P5_BOOT = Math.abs(P_PINNED - 1.5) / SE_BOOT; // ~41
const SIGMA_1P6_BOOT = Math.abs(P_PINNED - 1.6) / SE_BOOT; // ~42
const SIGMA_1P5_JK = Math.abs(P_PINNED - 1.5) / SE_JK; // ~40
const SIGMA_1P6_JK = Math.abs(P_PINNED - 1.6) / SE_JK; // ~41
const R_1P5_IN_BOOT_CI = 1.5 >= BOOT_CI_LO && 1.5 <= BOOT_CI_HI; // false
const R_1P6_IN_BOOT_CI = 1.6 >= BOOT_CI_LO && 1.6 <= BOOT_CI_HI; // false

// reuse gate: the point estimate reproduces the imp-34950 pinned exponent.
const P_VS_IMP34950 = Math.abs(
  P_PINNED - IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.pinned.p,
);

export const IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE = {
  id: 'imp-34994',
  proofSection: 'S-frontier',
  question:
    'imp-34950 F1 reported the pinned power-law exponent p = 1.5493 with a single residual-based standard ' +
    'error (~8.9e-4, 95% CI ~ [1.5476, 1.5511]) and claimed 3/2 and 8/5 lie tens of sigma outside the CI, ' +
    'but never stress-tested that textbook SE by resampling. Bootstrap (resample the 21-point C_mb fit grid ' +
    'with replacement) and jackknife (leave-one-out) the SAME through-origin log-log slope on the SAME ' +
    'kernels, and assess whether the clean-rational rejection survives a resampling-based uncertainty band. ' +
    'Measurement only; changes no bound; does NOT discharge the GUE conditional (imp-486); NO QED.',
  verdictShort:
    'The point estimate is unchanged (p = 1.5493, matching imp-34950) and the resampling SEs are slightly ' +
    'WIDER than the textbook residual SE: bootstrap SE ~1.19e-3 and jackknife SE ~1.23e-3, both ~1.35x the ' +
    'imp-34950 residual SE ~8.87e-4 (which therefore mildly under-estimates the true dispersion). Even under ' +
    'the wider band the clean rationals are decisively rejected: 3/2 sits ~41 sigma and 8/5 ~42 sigma from p ' +
    '(bootstrap), ~40 and ~41 sigma (jackknife), and both lie outside the bootstrap 95% percentile CI ' +
    '~[1.5475, 1.5521]. The "tens of sigma" claim of imp-34950 F1 survives resampling; p is a genuinely ' +
    'measured NON-rational exponent of the inherited surrogate, not a residual-normality artifact.',
  measuredQuantity:
    'the bootstrap (4000 seeded-LCG resamples, with replacement) and jackknife (leave-one-out) standard ' +
    'errors and 95% percentile CI of the imp-34950 pinned through-origin log-log slope p on the reused ' +
    '21-point C_mb grid over [0.5,1], compared against the imp-34950 residual-based SE, plus the ' +
    'clean-rational (3/2, 8/5) rejection distances in resampling-SE units',
  pointEstimate: {
    p_pinned: +P_PINNED.toFixed(5), // ~1.54933
    p_imp34950: IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.pinned.p,
    p_vs_imp34950_absdiff: +P_VS_IMP34950.toExponential(3),
  },
  standardErrors: {
    se_residual_imp34950_formula: +SE_RESIDUAL.toExponential(3), // ~8.87e-4
    se_bootstrap: +SE_BOOT.toExponential(3), // ~1.19e-3
    se_jackknife: +SE_JK.toExponential(3), // ~1.23e-3
    bootstrap_over_residual: +BOOT_OVER_RESIDUAL.toFixed(3), // ~1.35
    jackknife_over_residual: +JK_OVER_RESIDUAL.toFixed(3), // ~1.39
    note:
      'Both resampling SEs are ~1.35x the textbook residual SE, so the imp-34950 residual formula mildly ' +
      'UNDER-estimates the true dispersion (its homoscedastic-normal assumption is slightly optimistic here). ' +
      'The honest 95% band is a touch wider than imp-34950 reported.',
  },
  bootstrap: {
    resamples: B_RESAMPLES,
    seed: 1234567,
    mean: +BOOT_MEAN.toFixed(5), // ~1.5495
    ci95_lo: +BOOT_CI_LO.toFixed(5), // ~1.5475
    ci95_hi: +BOOT_CI_HI.toFixed(5), // ~1.5521
    histogram: {
      bins: HIST_BINS,
      edges: HIST_EDGES,
      counts: HIST_COUNTS,
    },
  },
  jackknife: {
    leave_one_out_points: NPTS,
    mean: +JK_MEAN.toFixed(5), // ~1.5493
  },
  cleanRationalRejection: {
    sigma_from_1p5_bootstrap: +SIGMA_1P5_BOOT.toFixed(1), // ~41
    sigma_from_1p6_bootstrap: +SIGMA_1P6_BOOT.toFixed(1), // ~42
    sigma_from_1p5_jackknife: +SIGMA_1P5_JK.toFixed(1), // ~40
    sigma_from_1p6_jackknife: +SIGMA_1P6_JK.toFixed(1), // ~41
    three_halves_in_bootstrap_ci: R_1P5_IN_BOOT_CI, // false
    eight_fifths_in_bootstrap_ci: R_1P6_IN_BOOT_CI, // false
    note:
      'Under the wider resampling SEs the rejection drops from imp-34950 ~55 sigma (residual-based) to ~41 ' +
      'sigma (bootstrap) / ~40 sigma (jackknife) -- still tens of sigma, and both rationals sit outside the ' +
      'bootstrap 95% percentile CI. The clean-rational rejection is robust to resampling.',
  },
  finding: {
    F1_point_unchanged_resampling_se_wider:
      'The pinned through-origin slope reproduces imp-34950 exactly (p = 1.5493). The bootstrap (4000 ' +
      'seeded resamples) SE is ~1.19e-3 and the jackknife SE ~1.23e-3, both ~1.35x the imp-34950 ' +
      'residual-based SE ~8.87e-4 -- so the textbook residual SE MILDLY UNDER-estimates the true dispersion, ' +
      'and the honest 95% band (bootstrap percentile CI ~[1.5475, 1.5521]) is a touch wider than reported.',
    F2_clean_rational_rejection_survives:
      'Under the wider bootstrap SE, 3/2 sits ~41 sigma and 8/5 ~42 sigma from p; under the jackknife SE, ' +
      '~40 and ~41 sigma. Both rationals lie outside the bootstrap 95% percentile CI. The drop from ~55 ' +
      'sigma (residual-based) to ~41 sigma (resampling) does not remotely admit either rational, so the ' +
      'imp-34950 F1 "tens of sigma" claim is CONFIRMED against resampling -- p is a genuinely measured ' +
      'NON-rational exponent of the inherited surrogate, not a residual-normality artifact.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Bootstrapping (4000 deterministic seeded-LCG resamples of the ' +
    '21-point C_mb fit grid, with replacement) and jackknifing (leave-one-out) the imp-34950 pinned ' +
    'through-origin log-log slope on the SAME kernels VERBATIM: (F1) the point estimate is unchanged ' +
    '(p = 1.5493, reproducing imp-34950), and the resampling SEs are slightly WIDER than the textbook ' +
    'residual SE -- bootstrap SE ~1.19e-3, jackknife SE ~1.23e-3, both ~1.35x the imp-34950 residual SE ' +
    '~8.87e-4, which therefore mildly under-estimates the true dispersion. (F2) Even under the wider band ' +
    'the clean rationals are decisively rejected: 3/2 ~41 sigma and 8/5 ~42 sigma from p (bootstrap), ~40 ' +
    'and ~41 sigma (jackknife), both outside the bootstrap 95% percentile CI ~[1.5475, 1.5521]. So the ' +
    'imp-34950 F1 "tens of sigma outside the CI" claim SURVIVES resampling; p is a genuinely measured ' +
    'NON-rational exponent of the inherited surrogate. This RE-USES the imp-34950 / imp-34925 kernels and ' +
    'resamples the fit grid; it changes NO bound; does NOT discharge the GUE conditional (C_mb ' +
    'GUE-conditional per imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-34994: bootstrap (SE ~1.19e-3, 95% percentile CI ~[1.5475, 1.5521]) and jackknife ' +
    '(SE ~1.23e-3) of the imp-34950 pinned exponent p = 1.5493 give resampling SEs ~1.35x the residual-based ' +
    'SE ~8.87e-4, so the textbook SE mildly under-estimates dispersion; even so, 3/2 and 8/5 remain ~40-42 ' +
    'sigma out and outside the 95% CI, confirming imp-34950 F1. What stays OPEN (deferred, changes no bound): ' +
    'whether the resampling band itself is surrogate-independent or drifts with the imp-3220/imp-3406 ' +
    'extrapolation; and a derivation PINNING C_mb below the GUE bound of 1 (imp-486) would then fix the ' +
    'physical s* via C_mb^p. NO QED; no refereed bound is changed.',
  citation:
    'imp-34950 (the single residual-based CI stress-tested here); imp-34925 (the power-law form and point ' +
    'exponent p ~ 1.549); imp-34886 (the s* ~ 0.78 crossing at C_mb=1, D2/D3 kernels reused verbatim); ' +
    'imp-3463 (far-tail exponent 1/2); imp-486 (C_mb GUE-conditional).',
};

export const IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE_ASSERTIONS = [
  {
    // Reuse gate: the pinned point estimate reproduces the imp-34950 exponent.
    id: 'imp34994-reproduces-imp34950-exponent',
    description: 'pinned p reproduces the imp-34950 point exponent p ~ 1.5493',
    holds: () => P_VS_IMP34950 < 1e-3 && Math.abs(P_PINNED - 1.5493) < 5e-3,
  },
  {
    // (F1): the resampling SEs are of the right order and WIDER than the residual SE.
    id: 'imp34994-resampling-se-wider-than-residual',
    description: 'bootstrap and jackknife SEs exceed the residual SE and stay in a plausible band',
    holds: () =>
      SE_BOOT > SE_RESIDUAL &&
      SE_JK > SE_RESIDUAL &&
      SE_BOOT < 3e-3 &&
      SE_JK < 3e-3 &&
      BOOT_OVER_RESIDUAL > 1.1 &&
      BOOT_OVER_RESIDUAL < 2.0,
  },
  {
    // (F1): the bootstrap percentile CI is narrow and brackets the point estimate.
    id: 'imp34994-bootstrap-ci-brackets-point',
    description: 'the bootstrap 95% percentile CI is < 1e-2 wide and contains the pinned point estimate',
    holds: () =>
      BOOT_CI_HI - BOOT_CI_LO < 1e-2 &&
      P_PINNED >= BOOT_CI_LO &&
      P_PINNED <= BOOT_CI_HI &&
      BOOT_N > 3900,
  },
  {
    // (F2): both clean rationals are rejected at tens of sigma under BOTH resampling SEs.
    id: 'imp34994-clean-rationals-rejected-under-resampling',
    description: '3/2 and 8/5 sit tens of sigma from p under both the bootstrap and jackknife SEs',
    holds: () =>
      SIGMA_1P5_BOOT > 25 &&
      SIGMA_1P6_BOOT > 25 &&
      SIGMA_1P5_JK > 25 &&
      SIGMA_1P6_JK > 25,
  },
  {
    // (F2): both clean rationals lie OUTSIDE the bootstrap 95% percentile CI.
    id: 'imp34994-clean-rationals-outside-bootstrap-ci',
    description: 'neither 3/2 nor 8/5 lies inside the bootstrap 95% percentile CI',
    holds: () => R_1P5_IN_BOOT_CI === false && R_1P6_IN_BOOT_CI === false,
  },
  {
    // imp-35123 viz support: the histogram is a lossless re-binning of BOOT_P (counts sum to BOOT_N).
    id: 'imp34994-histogram-counts-sum-to-boot-n',
    description: 'the exported bootstrap histogram bin counts sum to the number of finite resamples',
    holds: () =>
      HIST_COUNTS.length === HIST_BINS &&
      HIST_EDGES.length === HIST_BINS + 1 &&
      HIST_COUNTS.reduce((a, b) => a + b, 0) === BOOT_N,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp34994-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.isRigorous === false &&
      IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.farTailExponent === 0.5 &&
      typeof IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.subGap === 'string' &&
      /imp-486/.test(IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.subGap) &&
      /NO QED/.test(IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.verdict) &&
      /refereed bound is changed/i.test(IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.verdict),
  },
];

for (const a of IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34994-cmb-exponent-bootstrap-jackknife assertion failed: ${a.id}`);
  }
}
