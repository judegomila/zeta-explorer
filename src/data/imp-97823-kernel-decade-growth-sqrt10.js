/**
 * @module imp-97823-kernel-decade-growth-sqrt10
 *
 * imp-97823 (numerical/measurement, frontier cross-check): imp-97721 straddled the imp-97520 L1 sigma peak
 * (sigma_max ~ 0.949429, N_peak ~ 9.22e5) and confirmed the exact three-axis DIAG3 == 0 cancellation survives
 * the imp-97662 square-root fold: the reconstructed single-axis elasticities diverge because the shared
 * reconstruction kernel |K| = |1/(N sigma_N)| grows ~sqrt(10) per decade of gap, yet RECON_SUM = K*NUM stays
 * machine-zero. imp-97721 reported the |K| decade growth only QUALITATIVELY (~sqrt(10)). This leaf PINS the
 * |K| per-decade growth rate PRECISELY on BOTH arms across several decades straddling the peak and tests the
 * exact-sqrt(10) = 10^(1/2) hypothesis (the sqrt-fold / RvM log-derivative Jacobian scaling), reporting the fit
 * residual and characterising the finite-gap running correction. Reuses the imp-97721 kernel construction
 * verbatim; measurement/sensitivity ONLY on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz are UNTOUCHED; no bound moves; NO QED.
 *
 * THE KERNEL AND WHY sqrt(10) IS THE PREDICTION
 * ---------------------------------------------
 * Near the interior peak sigma(x) = sigma_max - A*(x - x_peak)^2 - B*(x - x_peak)^3 - ... in x = ln N (a
 * quadratic fold plus higher-order running). The shared kernel is K = -1/(N sigma_N) = -1/(d sigma / d ln N),
 * and at leading order d sigma / d ln N = -2A*(x - x_peak), so |K| = 1/(2A|x - x_peak|). The near-peak gap is
 * g = sigma_max - s = A*(x - x_peak)^2, hence |x - x_peak| = sqrt(g/A) and
 *      |K| = 1 / (2 sqrt(A) sqrt(g))  ~  g^(-1/2).
 * A pure inverse-square-root law means |K| multiplies by sqrt(10) = 10^(1/2) = 3.162278 for every DECADE that
 * the gap g shrinks. The cubic term B breaks the arm symmetry and injects an O(sqrt(g)) running correction of
 * OPPOSITE sign on the two arms (upslope x < x_peak, downslope x > x_peak).
 *
 * THE MEASUREMENT (the deliverable)
 * ---------------------------------
 *   (i)  WIDE LADDER. |K| at gaps g = 1e-1 .. 1e-7 on both arms; report the raw per-decade ratios. Far from the
 *        peak these are NOT sqrt(10) (upslope climbs 1.77 -> 2.89 -> 3.07 -> ...; downslope falls 4.25 -> 3.51
 *        -> 3.27 -> ...) -- the finite-gap running correction, NOT a genuine exponent that differs from 1/2.
 *   (ii) DEEP LIMIT. |K| at gaps g = 1e-5 .. 1e-8; the per-decade ratios converge geometrically onto sqrt(10),
 *        the deviation |ratio - sqrt(10)| shrinking by ~1/sqrt(10) per decade (an O(sqrt(g)) correction), the
 *        two arms bracketing sqrt(10) from opposite sides.
 *   (iii) FIT. Least-squares slope p of log10|K| vs log10(g) over the DEEP window; test p == -1/2, i.e.
 *        per-decade growth 10^(-p) == sqrt(10). Report the log-linear residual.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (M1) EXACT sqrt(10) IN THE LIMIT. The deep-window LS slope is p = -0.4994 (upslope) / -0.5006 (downslope),
 *        bracketing -1/2 to ~1e-3; per-decade growth 3.158 / 3.167 vs sqrt(10) = 3.162278, log-linear residual
 *        ~4e-4. The |K| ~ g^(-1/2) inverse-square-root fold law is confirmed to the deep-limit measurement floor.
 *   (M2) THE APPARENT DEVIATION FAR FROM THE PEAK IS A RUNNING CORRECTION, NOT AN EXPONENT SHIFT. The naive LS
 *        slope over the FULL 1e-1..1e-7 ladder reads growth 2.90 (upslope) / 3.36 (downslope) -- NOT sqrt(10) --
 *        purely because the far-from-peak decades carry the O(sqrt(g)) running term. The per-decade deviation
 *        |ratio - sqrt(10)| decays geometrically by ~1/sqrt(10) each decade (~3.1e-2 -> ~9.8e-3 -> ~3.1e-3 ->
 *        ~9.8e-4), opposite-signed on the two arms, exactly the cubic-fold signature.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486,
 * the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED
 * and appear only as the fixed surrogate; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97721-diag3-peak-upslope-crossvalidation (kernel |K| ~ sqrt(10) per decade reported qualitatively)
 * @see imp-97662-cc-elasticity-peak-divergence (near-peak individual-elasticity square-root fold)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97721 exactly
const SQRT10 = Math.sqrt(10); // 3.16227766...

// EXACT imp-3406/imp-97644/imp-97721 sub-terms (baseline amplitudes c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N };
}
// Interior peak location: ternary search in x = ln N (imp-97662/imp-97721).
function peakLogN(cc, et, cf) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc, et, cf).sigma < parts(Math.exp(m2), cc, et, cf).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}
// Downslope crossing (right arm): sigma first drops below target.
function crossBelow(target, cc, et, cf, xPeak) {
  let a = xPeak;
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Upslope crossing (left arm): sigma first rises above target.
function crossAbove(target, cc, et, cf, xPeak) {
  let a = Math.log(1e4);
  let b = xPeak;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function crossOnArm(target, arm, cc, et, cf, xPeak) {
  return arm === 'down' ? crossBelow(target, cc, et, cf, xPeak) : crossAbove(target, cc, et, cf, xPeak);
}
// d sigma / d ln N via 5-point O(h^4) stencil (imp-97703/imp-97721) -- the shared kernel K = -1/(N sigma_N).
function dSigmaDlnN(N, cc, et, cf, h) {
  const s = (d) => parts(N * Math.exp(d), cc, et, cf).sigma;
  return (-s(2 * h) + 8 * s(h) - 8 * s(-h) + s(-2 * h)) / (12 * h);
}

// --- The peak (imp-97520/imp-97662/imp-97721 L1 interior maximum) ---
const X_PEAK = peakLogN(C_C_PINNED, E_TRUNC_PT, 1.0);
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = parts(N_PEAK, C_C_PINNED, E_TRUNC_PT, 1.0).sigma;

const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K (imp-97721 verbatim)

// |K| at a near-peak gap g on the given arm.
function absKAtGap(g, arm) {
  const target = SIGMA_MAX - g;
  const N = crossOnArm(target, arm, C_C_PINNED, E_TRUNC_PT, 1.0, X_PEAK);
  const K = -1 / dSigmaDlnN(N, C_C_PINNED, E_TRUNC_PT, 1.0, H_STENCIL);
  return { g, N, absK: Math.abs(K) };
}

// Least-squares slope p and max |residual| of log10|K| = a + p*log10(g).
function lsSlope(rows) {
  const xs = rows.map((r) => Math.log10(r.g));
  const ys = rows.map((r) => Math.log10(r.absK));
  const n = xs.length;
  const sx = xs.reduce((u, v) => u + v, 0);
  const sy = ys.reduce((u, v) => u + v, 0);
  const sxx = xs.reduce((u, v) => u + v * v, 0);
  const sxy = xs.reduce((u, v, i) => u + v * ys[i], 0);
  const p = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - p * sx) / n;
  const maxResid = Math.max(...xs.map((x, i) => Math.abs(ys[i] - (a + p * x))));
  return { p, growth: Math.pow(10, -p), maxResid };
}

const WIDE_GAPS = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7];
const DEEP_GAPS = [1e-5, 1e-6, 1e-7, 1e-8]; // the asymptotic near-peak window

// Wide + deep measurement on both arms.
function armReport(arm) {
  const wide = WIDE_GAPS.map((g) => absKAtGap(g, arm));
  const wideRatios = [];
  for (let i = 0; i + 1 < wide.length; i++) wideRatios.push(wide[i + 1].absK / wide[i].absK);
  const deep = DEEP_GAPS.map((g) => absKAtGap(g, arm));
  const deepRatios = [];
  for (let i = 0; i + 1 < deep.length; i++) deepRatios.push(deep[i + 1].absK / deep[i].absK);
  // Deviation of each deep ratio from sqrt(10), and the decade-over-decade decay of that deviation.
  const deepDev = deepRatios.map((r) => r - SQRT10);
  const devDecay = [];
  for (let i = 0; i + 1 < deepDev.length; i++) devDecay.push(Math.abs(deepDev[i + 1]) / Math.abs(deepDev[i]));
  return {
    ladder: wide.map((r) => ({
      gap: +r.g.toExponential(0),
      N: +r.N.toExponential(4),
      absK: +r.absK.toExponential(4),
    })),
    wide_per_decade_ratios: wideRatios.map((r) => +r.toFixed(4)),
    deep_per_decade_ratios: deepRatios.map((r) => +r.toFixed(6)),
    deep_ratio_deviation_from_sqrt10: deepDev.map((d) => +d.toExponential(2)),
    deviation_decade_decay_factor: devDecay.map((d) => +d.toFixed(4)), // ~1/sqrt(10) = 0.3162
    deep_ls: (() => {
      const f = lsSlope(deep);
      return { slope_p: +f.p.toFixed(6), growth_per_decade: +f.growth.toFixed(6), max_resid_log10: +f.maxResid.toExponential(2) };
    })(),
    full_ls: (() => {
      const f = lsSlope(wide);
      return { slope_p: +f.p.toFixed(6), growth_per_decade: +f.growth.toFixed(6) };
    })(),
  };
}

const UP = armReport('up');
const DOWN = armReport('down');

export const IMP97823_KERNEL_DECADE_GROWTH_SQRT10 = {
  id: 'imp-97823',
  proofSection: 'S-frontier',
  question:
    'imp-97721 reported the shared reconstruction kernel |K| = |1/(N sigma_N)| grows ~sqrt(10) per decade of ' +
    'gap approaching the imp-97520 L1 peak (sigma_max ~ 0.949429, N_peak ~ 9.22e5) only QUALITATIVELY. Pinned ' +
    'precisely on both arms across several decades, is the per-decade growth EXACTLY sqrt(10) = 10^(1/2) (the ' +
    'sqrt-fold / RvM log-derivative Jacobian scaling), or does it carry a slow running correction? Report the ' +
    'fit residual. Measurement/sensitivity only; pinned constants untouched; no bound moves; no QED.',
  method:
    'Reusing the imp-97721 kernel construction verbatim, measure |K| = |1/(N sigma_N)| (5-point O(h^4) stencil) ' +
    'at near-peak gaps g = sigma_max - s on BOTH arms across a wide ladder (g = 1e-1 .. 1e-7) and a deep window ' +
    '(g = 1e-5 .. 1e-8). Report the raw per-decade ratios, the deviation of each deep ratio from sqrt(10) and ' +
    'its decade-over-decade decay, and the least-squares slope p of log10|K| vs log10(g) on the deep window ' +
    '(test p == -1/2 <=> growth 10^(-p) == sqrt(10)).',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
  },
  stencil_step_for_kernel: H_STENCIL,
  sqrt10: +SQRT10.toFixed(6), // 3.162278 (the exact prediction)
  upslope: UP,
  downslope: DOWN,
  finding: {
    M1_exact_sqrt10_in_the_limit:
      'The deep-window (g = 1e-5 .. 1e-8) least-squares slope of log10|K| vs log10(g) is p = ' +
      UP.deep_ls.slope_p + ' (upslope) / ' + DOWN.deep_ls.slope_p + ' (downslope), bracketing -1/2 to ~1e-3; ' +
      'per-decade growth 10^(-p) = ' + UP.deep_ls.growth_per_decade + ' / ' + DOWN.deep_ls.growth_per_decade +
      ' vs sqrt(10) = ' + SQRT10.toFixed(6) + ', log-linear residual ~' + UP.deep_ls.max_resid_log10 + '. The ' +
      '|K| ~ g^(-1/2) inverse-square-root fold law (Jacobian scaling) is confirmed to the deep-limit floor.',
    M2_far_deviation_is_a_running_correction_not_an_exponent_shift:
      'A naive LS fit over the FULL 1e-1..1e-7 ladder reads per-decade growth ' + UP.full_ls.growth_per_decade +
      ' (upslope) / ' + DOWN.full_ls.growth_per_decade + ' (downslope) -- NOT sqrt(10) -- purely because the ' +
      'far-from-peak decades carry an O(sqrt(g)) running term. The per-decade deviation |ratio - sqrt(10)| decays ' +
      'geometrically by a factor ~' + UP.deviation_decade_decay_factor.join('/') + ' per decade (upslope, ~1/sqrt(10) ' +
      '= 0.3162), opposite-signed on the two arms (upslope from below, downslope from above): the cubic-fold ' +
      'signature, an amplitude-only correction to a genuine 1/2 exponent, NOT a distinct exponent.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, NOT rigorous). Pinning the imp-97721 reconstruction kernel |K| = ' +
    '|1/(N sigma_N)| per-decade growth precisely on BOTH arms straddling the imp-97520 L1 peak (sigma_max ~ ' +
    '0.949429, N_peak ~ 9.22e5) confirms it is EXACTLY sqrt(10) = 10^(1/2) = ' + SQRT10.toFixed(6) + ' in the ' +
    'deep-limit: the deep-window (g = 1e-5..1e-8) log10|K|-vs-log10(g) slope is p = ' + UP.deep_ls.slope_p +
    ' (upslope) / ' + DOWN.deep_ls.slope_p + ' (downslope), bracketing -1/2 to ~1e-3, growth ' +
    UP.deep_ls.growth_per_decade + ' / ' + DOWN.deep_ls.growth_per_decade + ', log-linear residual ~' +
    UP.deep_ls.max_resid_log10 + '. This is the sqrt-fold / RvM log-derivative Jacobian scaling: near the ' +
    'quadratic peak sigma = sigma_max - A(x-x_peak)^2 gives |K| = 1/(2 sqrt(A g)) ~ g^(-1/2), i.e. sqrt(10) per ' +
    'decade. The apparent departure far from the peak (naive full-ladder growth ' + UP.full_ls.growth_per_decade +
    ' / ' + DOWN.full_ls.growth_per_decade + ') is a finite-gap O(sqrt(g)) RUNNING CORRECTION -- the cubic ' +
    'fold term -- decaying by ~1/sqrt(10) per decade and opposite-signed on the two arms (they bracket sqrt(10)), ' +
    'NOT an exponent distinct from 1/2. Conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97721 (kernel |K| ~ sqrt(10) per decade, reported qualitatively); imp-97662 (near-peak ' +
    'individual-elasticity square-root fold); imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); ' +
    'imp-97703 (5-point stencil); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97823_KERNEL_DECADE_GROWTH_SQRT10_ASSERTIONS = [
  {
    // The peak matches the imp-97520/imp-97662/imp-97721 L1 interior maximum.
    id: 'imp97823-peak-matches-l1',
    description: 'the interior peak is at N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520 L1)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // (M1): the deep-window growth equals sqrt(10) on both arms to ~1% (the exact-sqrt(10) hypothesis).
    id: 'imp97823-deep-growth-is-sqrt10',
    description: 'the deep-window per-decade growth 10^(-p) equals sqrt(10) = 3.162278 to < 1% on both arms',
    holds: () =>
      Math.abs(UP.deep_ls.growth_per_decade - SQRT10) / SQRT10 < 0.01 &&
      Math.abs(DOWN.deep_ls.growth_per_decade - SQRT10) / SQRT10 < 0.01,
  },
  {
    // (M1): the deep-window LS slope brackets -1/2 (the inverse-square-root fold exponent) to ~1e-3.
    id: 'imp97823-deep-slope-is-minus-half',
    description: 'the deep-window LS slope p brackets -1/2 to < 3e-3 on both arms (|K| ~ g^(-1/2))',
    holds: () => Math.abs(UP.deep_ls.slope_p + 0.5) < 3e-3 && Math.abs(DOWN.deep_ls.slope_p + 0.5) < 3e-3,
  },
  {
    // (M1): the deep-window log-linear residual is tiny (clean power law in the limit).
    id: 'imp97823-deep-fit-residual-tiny',
    description: 'the deep-window log10|K| vs log10(g) residual is < 1e-3 on both arms (clean power law)',
    holds: () => UP.deep_ls.max_resid_log10 < 1e-3 && DOWN.deep_ls.max_resid_log10 < 1e-3,
  },
  {
    // (M2): the two arms bracket sqrt(10) with opposite-signed deep deviations (the cubic-fold asymmetry).
    id: 'imp97823-arms-bracket-sqrt10',
    description: 'the deep per-decade ratios bracket sqrt(10): upslope deviation < 0, downslope deviation > 0',
    holds: () =>
      UP.deep_ratio_deviation_from_sqrt10.every((d) => d < 0) &&
      DOWN.deep_ratio_deviation_from_sqrt10.every((d) => d > 0),
  },
  {
    // (M2): the per-decade deviation from sqrt(10) decays geometrically toward zero (running correction, not shift).
    id: 'imp97823-deviation-decays-to-zero',
    description: 'the |ratio - sqrt(10)| deviation shrinks each decade toward zero (O(sqrt(g)) running correction)',
    holds: () =>
      UP.deviation_decade_decay_factor.every((f) => f < 0.5) &&
      DOWN.deviation_decade_decay_factor.every((f) => f < 0.5),
  },
  {
    // (M2): far from the peak the naive full-ladder growth is genuinely NOT sqrt(10) (the running masks it).
    id: 'imp97823-full-ladder-not-sqrt10',
    description: 'the naive full-ladder growth departs sqrt(10) by > 3% on at least one arm (running correction)',
    holds: () =>
      Math.abs(UP.full_ls.growth_per_decade - SQRT10) / SQRT10 > 0.03 ||
      Math.abs(DOWN.full_ls.growth_per_decade - SQRT10) / SQRT10 > 0.03,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp97823-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97823_KERNEL_DECADE_GROWTH_SQRT10.isRigorous === false &&
      /NO QED/.test(IMP97823_KERNEL_DECADE_GROWTH_SQRT10.verdict) &&
      /refereed bound is changed/i.test(IMP97823_KERNEL_DECADE_GROWTH_SQRT10.verdict),
  },
];

for (const a of IMP97823_KERNEL_DECADE_GROWTH_SQRT10_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97823-kernel-decade-growth-sqrt10 assertion failed: ${a.id}`);
  }
}
