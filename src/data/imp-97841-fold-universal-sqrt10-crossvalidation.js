/**
 * @module imp-97841-fold-universal-sqrt10-crossvalidation
 *
 * imp-97841 (numerical/cross-validation, frontier cross-check): imp-97823 confirmed the shared
 * reconstruction kernel |K| = |1/(N sigma_N)| = |1/(d sigma / d ln N)| grows by exactly sqrt(10) = 10^(1/2)
 * per decade of near-peak gap g (deep-window LS slope p = -1/2, residual ~4e-4) at the imp-97520 L1 interior
 * sigma peak. That measurement pinned the g^(-1/2) inverse-square-root fold law at ONE fold object -- the
 * reconstruction kernel. THIS leaf tests whether the same law is FOLD-UNIVERSAL by cross-validating it at a
 * SECOND, structurally distinct fold node: the imp-97662 square-root fold, where the diverging object is the
 * C_C-elasticity E = d(ln N)/d(ln C_C) = 2/D, D = 1 + 2 d(ln R)/dx - d(ln L)/dx (x = ln N), NOT the
 * reconstruction kernel. Both objects fold at the same peak location (both denominators vanish there: the peak
 * condition is exactly D == 0 == d sigma / d ln N), but they are structurally different maps of that fold, so
 * matching exponents on both is a genuine cross-validation, not a restatement. Reuses the imp-97662 closed-form
 * construction verbatim and applies the imp-97823 deep-window LS-slope instrument to |E|. Measurement/
 * cross-validation ONLY on the inherited imp-3220/imp-3406 surrogate; the C_mb GUE-conditional per imp-486 and
 * the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED (C_C fixed, not perturbed here); E_trunc pinned 3.06e-5;
 * changes no bound; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *
 * WHY sqrt(10) IS THE PREDICTION AT THE SECOND NODE
 * ------------------------------------------------
 * imp-97662 showed the C_C-elasticity of a near-peak crossing diverges as E ~ +/- K / sqrt(sigma_max - s), the
 * generic square-root blow-up of a quadratic fold (down branch +K, up branch -K, K = (d sigma_max / d ln C_C) /
 * (2 sqrt(A)), A = -sigma''(x_peak)/2). A pure inverse-square-root law means |E| multiplies by sqrt(10) for every
 * DECADE the gap g = sigma_max - s shrinks -- the SAME Jacobian scaling as the imp-97823 kernel |K|, because both
 * inherit the vanishing-linear denominator of the same quadratic fold. If the deep-window LS slope of log10|E| vs
 * log10(g) is -1/2 (growth sqrt(10)) on both arms -- matching imp-97823's kernel result to the deep-limit floor --
 * the g^(-1/2) growth is a UNIVERSAL quadratic-fold signature, not a property peculiar to the reconstruction
 * kernel. If instead |E| carried a distinct exponent, the sqrt(10) law would be kernel-specific.
 *
 * THE MEASUREMENT (the deliverable)
 * ---------------------------------
 *   (i)  DEEP LADDER. |E| = |2/D| at deep-window gaps g = 1e-5 .. 1e-8 on BOTH arms (closed form, the clean
 *        instrument at the fold; the numeric log-C_C difference degrades near the tangency per imp-97662).
 *   (ii) RATIOS + DEVIATION. Per-decade ratios |E(g/10)|/|E(g)|, their deviation from sqrt(10), and the
 *        decade-over-decade decay of that deviation (~1/sqrt(10), the O(sqrt(g)) cubic running correction).
 *   (iii) FIT. Least-squares slope p of log10|E| vs log10(g) over the deep window; test p == -1/2, i.e.
 *        per-decade growth 10^(-p) == sqrt(10). Report the log-linear residual and compare to imp-97823.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (X1) FOLD-UNIVERSAL sqrt(10). The deep-window LS slope of log10|E| vs log10(g) is p = -0.500593 (downslope) /
 *        -0.499359 (upslope), bracketing -1/2 to ~6e-4; per-decade growth 3.166598 / 3.157617 vs sqrt(10) =
 *        3.162278, log-linear residual ~4e-4 -- statistically indistinguishable from the imp-97823 kernel result
 *        (kernel p = -0.4994 / -0.5006, growth 3.158 / 3.167). The g^(-1/2) inverse-square-root fold law holds at
 *        BOTH the reconstruction-kernel fold (imp-97823) and the C_C-elasticity fold (imp-97662): it is a
 *        universal quadratic-fold Jacobian signature, not peak-kernel-specific.
 *   (X2) SAME BRACKETING GEOMETRY. The two arms bracket sqrt(10) from opposite sides (downslope from above,
 *        upslope from below) and the per-decade deviation |ratio - sqrt(10)| decays geometrically by ~1/sqrt(10)
 *        per decade -- the same cubic-fold running-correction signature imp-97823 measured on the kernel, an
 *        amplitude-only correction to a genuine 1/2 exponent, NOT a distinct exponent.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only as the fixed surrogate; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10 (the reconstruction-kernel fold: |K| ~ sqrt(10) per decade at L1)
 * @see imp-97662-cc-elasticity-peak-divergence (the C_C-elasticity square-root fold E ~ +/- K/sqrt(sigma_max - s))
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97662/imp-97823 exactly
const SQRT10 = Math.sqrt(10); // 3.16227766...

// EXACT imp-3406/imp-97662 sub-terms (baseline amplitude C_C = C_C_PINNED, fixed here).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const R = E_TRUNC_PT + E_flow;
  return { L, R, sigma: E_coll / (R + E_coll) };
}
// Interior peak location: ternary search in x = ln N (imp-97662/imp-97823).
function peakLogN() {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1)).sigma < parts(Math.exp(m2)).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}
// Downslope crossing (right arm): sigma first drops below target.
function crossBelow(target, xPeak) {
  let a = xPeak;
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Upslope crossing (left arm): sigma first rises above target.
function crossAbove(target, xPeak) {
  let a = Math.log(1e4);
  let b = xPeak;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// 5-point central-difference log-derivative, x = ln N (imp-97662 verbatim).
function dLogDx5(fn, N, h) {
  const f = (k) => Math.log(fn(N * Math.exp(k * h)));
  return (-f(2) + 8 * f(1) - 8 * f(-1) + f(-2)) / (12 * h);
}

const X_PEAK = peakLogN();
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = parts(N_PEAK).sigma;
const H_STENCIL = 5e-6; // ln N stencil step for the closed-form log-derivatives (imp-97662 verbatim)

// The imp-97662 fold object: closed-form C_C-elasticity E = 2/(1 + 2 dlnR/dx - dlnL/dx) at a branch crossing.
function closedE(target, arm) {
  const N = arm === 'down' ? crossBelow(target, X_PEAK) : crossAbove(target, X_PEAK);
  const dlnR = dLogDx5((n) => parts(n).R, N, H_STENCIL);
  const dlnL = dLogDx5((n) => parts(n).L, N, H_STENCIL);
  const D = 1 + 2 * dlnR - dlnL;
  return { N, E: 2 / D };
}
// |E| at a near-peak gap g on the given arm.
function absEAtGap(g, arm) {
  const r = closedE(SIGMA_MAX - g, arm);
  return { g, N: r.N, absE: Math.abs(r.E) };
}

// Least-squares slope p and max |residual| of log10|E| = a + p*log10(g) (imp-97823 instrument).
function lsSlope(rows) {
  const xs = rows.map((r) => Math.log10(r.g));
  const ys = rows.map((r) => Math.log10(r.absE));
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

const DEEP_GAPS = [1e-5, 1e-6, 1e-7, 1e-8]; // the asymptotic near-peak window (imp-97823 deep window)

function armReport(arm) {
  const deep = DEEP_GAPS.map((g) => absEAtGap(g, arm));
  const ratios = [];
  for (let i = 0; i + 1 < deep.length; i++) ratios.push(deep[i + 1].absE / deep[i].absE);
  const dev = ratios.map((r) => r - SQRT10);
  const devDecay = [];
  for (let i = 0; i + 1 < dev.length; i++) devDecay.push(Math.abs(dev[i + 1]) / Math.abs(dev[i]));
  const f = lsSlope(deep);
  return {
    ladder: deep.map((r) => ({
      gap: +r.g.toExponential(0),
      N: +r.N.toExponential(4),
      absE: +r.absE.toExponential(4),
    })),
    deep_per_decade_ratios: ratios.map((r) => +r.toFixed(6)),
    deep_ratio_deviation_from_sqrt10: dev.map((d) => +d.toExponential(2)),
    deviation_decade_decay_factor: devDecay.map((d) => +d.toFixed(4)), // ~1/sqrt(10) = 0.3162
    deep_ls: { slope_p: +f.p.toFixed(6), growth_per_decade: +f.growth.toFixed(6), max_resid_log10: +f.maxResid.toExponential(2) },
  };
}

const UP = armReport('up');
const DOWN = armReport('down');

// imp-97823 kernel reference (reported values) for the cross-node comparison.
const KERNEL_REF = { up_slope: -0.4994, down_slope: -0.5006, up_growth: 3.158, down_growth: 3.167 };

export const IMP97841_FOLD_UNIVERSAL_SQRT10_CROSSVALIDATION = {
  id: 'imp-97841',
  proofSection: 'S-frontier',
  question:
    'imp-97823 pinned the reconstruction-kernel fold |K| = |1/(N sigma_N)| growth at exactly sqrt(10) = 10^(1/2) ' +
    'per gap-decade at the imp-97520 L1 peak. Is that g^(-1/2) inverse-square-root law FOLD-UNIVERSAL, or ' +
    'specific to the reconstruction kernel? Cross-validate at a second, structurally distinct fold node -- the ' +
    'imp-97662 C_C-elasticity fold E = 2/(1 + 2 d ln R/dx - d ln L/dx) -- by running the same deep-window ' +
    'LS-slope instrument on |E|. Measurement/cross-validation only; pinned constants untouched; no bound moves; ' +
    'NO QED.',
  method:
    'Reusing the imp-97662 closed-form construction verbatim, measure |E| = |2/D| at deep-window gaps ' +
    'g = sigma_max - s = 1e-5 .. 1e-8 on BOTH arms (the closed form is the clean instrument at the fold; the ' +
    'numeric log-C_C difference degrades near the tangency per imp-97662). Apply the imp-97823 deep-window ' +
    'LS-slope instrument to log10|E| vs log10(g): report the raw per-decade ratios, the deviation of each ratio ' +
    'from sqrt(10) and its decade-over-decade decay, the LS slope p (test p == -1/2 <=> growth 10^(-p) == ' +
    'sqrt(10)) and the log-linear residual, then compare to the imp-97823 kernel result.',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
  },
  stencil_step_for_logderiv: H_STENCIL,
  sqrt10: +SQRT10.toFixed(6), // 3.162278 (the exact prediction)
  fold_object: 'imp-97662 C_C-elasticity E = 2/(1 + 2 d ln R/dx - d ln L/dx) (structurally distinct from the imp-97823 reconstruction kernel |K| = |1/(N sigma_N)|)',
  upslope: UP,
  downslope: DOWN,
  kernel_reference_imp97823: KERNEL_REF,
  finding: {
    X1_fold_universal_sqrt10:
      'The deep-window (g = 1e-5 .. 1e-8) least-squares slope of log10|E| vs log10(g) at the imp-97662 ' +
      'C_C-elasticity fold is p = ' + DOWN.deep_ls.slope_p + ' (downslope) / ' + UP.deep_ls.slope_p +
      ' (upslope), bracketing -1/2 to ~6e-4; per-decade growth 10^(-p) = ' + DOWN.deep_ls.growth_per_decade +
      ' / ' + UP.deep_ls.growth_per_decade + ' vs sqrt(10) = ' + SQRT10.toFixed(6) + ', log-linear residual ~' +
      DOWN.deep_ls.max_resid_log10 + '. This is statistically indistinguishable from the imp-97823 ' +
      'reconstruction-kernel result (kernel p = ' + KERNEL_REF.up_slope + ' / ' + KERNEL_REF.down_slope +
      ', growth ' + KERNEL_REF.up_growth + ' / ' + KERNEL_REF.down_growth + '): the g^(-1/2) inverse-square-root ' +
      'fold law holds at BOTH fold objects, so it is a UNIVERSAL quadratic-fold Jacobian signature, not ' +
      'peak-kernel-specific.',
    X2_same_bracketing_geometry:
      'The two arms bracket sqrt(10) from opposite sides (downslope from above, upslope from below) and the ' +
      'per-decade deviation |ratio - sqrt(10)| decays geometrically by ~' + UP.deviation_decade_decay_factor.join('/') +
      ' per decade (~1/sqrt(10) = 0.3162) -- the same cubic-fold O(sqrt(g)) running-correction signature ' +
      'imp-97823 measured on the kernel, an amplitude-only correction to a genuine 1/2 exponent, NOT a distinct ' +
      'exponent.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Running the imp-97823 deep-window ' +
    'LS-slope instrument on the imp-97662 C_C-elasticity fold object E = 2/(1 + 2 d ln R/dx - d ln L/dx) -- ' +
    'structurally distinct from the imp-97823 reconstruction kernel |K| = |1/(N sigma_N)| but folding at the ' +
    'same imp-97520 L1 peak (sigma_max ~ 0.949429, N_peak ~ 9.22e5) -- confirms the g^(-1/2) inverse-square-root ' +
    'law is FOLD-UNIVERSAL. The deep-window (g = 1e-5..1e-8) log10|E|-vs-log10(g) slope is p = ' +
    DOWN.deep_ls.slope_p + ' (downslope) / ' + UP.deep_ls.slope_p + ' (upslope), bracketing -1/2 to ~6e-4, ' +
    'growth ' + DOWN.deep_ls.growth_per_decade + ' / ' + UP.deep_ls.growth_per_decade + ' vs sqrt(10) = ' +
    SQRT10.toFixed(6) + ', residual ~' + DOWN.deep_ls.max_resid_log10 + ' -- matching the imp-97823 kernel ' +
    'result (growth ' + KERNEL_REF.up_growth + ' / ' + KERNEL_REF.down_growth + ') to the deep-limit floor, with ' +
    'the same opposite-side bracketing and ~1/sqrt(10) cubic-fold running correction. Both objects inherit the ' +
    'vanishing-linear denominator of the same quadratic fold, so the sqrt(10) per-decade growth is a generic ' +
    'quadratic-fold Jacobian signature, not a property of the reconstruction kernel alone. Conditional-share ' +
    'diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the ' +
    'imp-398 C_F prefactor are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97823 (reconstruction-kernel fold |K| ~ sqrt(10) per decade at L1); imp-97662 (C_C-elasticity ' +
    'square-root fold E ~ +/- K/sqrt(sigma_max - s)); imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ ' +
    '9.22e5); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse).',
};

export const IMP97841_FOLD_UNIVERSAL_SQRT10_CROSSVALIDATION_ASSERTIONS = [
  {
    // The fold node matches the imp-97520/imp-97662/imp-97823 L1 interior maximum.
    id: 'imp97841-peak-matches-l1',
    description: 'the fold node is the L1 interior peak N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // (X1): the elasticity-fold deep-window growth equals sqrt(10) on both arms to < 1% (fold-universality).
    id: 'imp97841-elasticity-deep-growth-is-sqrt10',
    description: 'the deep-window per-decade growth 10^(-p) of |E| equals sqrt(10) = 3.162278 to < 1% on both arms',
    holds: () =>
      Math.abs(UP.deep_ls.growth_per_decade - SQRT10) / SQRT10 < 0.01 &&
      Math.abs(DOWN.deep_ls.growth_per_decade - SQRT10) / SQRT10 < 0.01,
  },
  {
    // (X1): the deep-window LS slope brackets -1/2 (the inverse-square-root fold exponent) on both arms.
    id: 'imp97841-elasticity-deep-slope-is-minus-half',
    description: 'the deep-window LS slope p of log10|E| brackets -1/2 to < 3e-3 on both arms (|E| ~ g^(-1/2))',
    holds: () => Math.abs(UP.deep_ls.slope_p + 0.5) < 3e-3 && Math.abs(DOWN.deep_ls.slope_p + 0.5) < 3e-3,
  },
  {
    // (X1): the two fold objects agree -- elasticity slope matches the imp-97823 kernel slope to the fit floor.
    id: 'imp97841-fold-universal-agrees-with-kernel',
    description: 'the elasticity-fold deep slope matches the imp-97823 kernel deep slope to < 5e-3 (fold-universal)',
    holds: () =>
      Math.abs(UP.deep_ls.slope_p - KERNEL_REF.up_slope) < 5e-3 &&
      Math.abs(DOWN.deep_ls.slope_p - KERNEL_REF.down_slope) < 5e-3,
  },
  {
    // (X1): the deep-window log-linear residual is tiny (clean power law in the limit, same as the kernel).
    id: 'imp97841-elasticity-deep-fit-residual-tiny',
    description: 'the deep-window log10|E| vs log10(g) residual is < 1e-3 on both arms (clean power law)',
    holds: () => UP.deep_ls.max_resid_log10 < 1e-3 && DOWN.deep_ls.max_resid_log10 < 1e-3,
  },
  {
    // (X2): the two arms bracket sqrt(10) with opposite-signed deep deviations (the cubic-fold asymmetry).
    id: 'imp97841-arms-bracket-sqrt10',
    description: 'the deep per-decade ratios bracket sqrt(10): downslope deviation > 0, upslope deviation < 0',
    holds: () =>
      DOWN.deep_ratio_deviation_from_sqrt10.every((d) => d > 0) &&
      UP.deep_ratio_deviation_from_sqrt10.every((d) => d < 0),
  },
  {
    // (X2): the per-decade deviation from sqrt(10) decays geometrically toward zero (running correction, not shift).
    id: 'imp97841-deviation-decays-to-zero',
    description: 'the |ratio - sqrt(10)| deviation shrinks each decade toward zero (O(sqrt(g)) running correction)',
    holds: () =>
      UP.deviation_decade_decay_factor.every((f) => f < 0.6) &&
      DOWN.deviation_decade_decay_factor.every((f) => f < 0.6),
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp97841-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97841_FOLD_UNIVERSAL_SQRT10_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP97841_FOLD_UNIVERSAL_SQRT10_CROSSVALIDATION.verdict) &&
      /remains SOTA/.test(IMP97841_FOLD_UNIVERSAL_SQRT10_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP97841_FOLD_UNIVERSAL_SQRT10_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97841-fold-universal-sqrt10-crossvalidation assertion failed: ${a.id}`);
  }
}
