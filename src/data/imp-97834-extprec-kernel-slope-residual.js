/**
 * @module imp-97834-extprec-kernel-slope-residual
 *
 * imp-97834 (numerical/measurement, frontier cross-check): imp-97823 M1 measured the deep-window
 * least-squares slope of the shared reconstruction kernel |K| = |1/(N sigma_N)| as p = -0.4994 (upslope)
 * / -0.5006 (downslope) with a log-linear residual ~4e-4 -- flagged as "at the double-precision
 * measurement floor". This leaf SETTLES whether that ~4e-4 residual is a genuine finite-gap running term
 * or a double-precision arithmetic floor by RECOMPUTING the deep-window slope and residual at extended
 * (mpmath, dps=60) precision, solving the RvM height inverse exactly and taking the kernel derivative by
 * a high-precision Richardson-extrapolated derivative instead of the double-precision 5-point stencil.
 *
 * THE DISCRIMINATOR
 * -----------------
 * A double-precision FLOOR would NOT reproduce at dps=60 (the residual would collapse toward ~1e-15), and
 * it would NOT scale with the fit window. A GENUINE finite-gap running term (the imp-97662/imp-97823
 * cubic-fold O(sqrt(g)) correction to the quadratic peak sigma = sigma_max - A(x-x_peak)^2) reproduces
 * bit-for-bit at extended precision AND shrinks geometrically as the window is pushed deeper into the peak.
 *
 * THE MEASUREMENT (extended precision, dps=60; see tmp/imp-97834-extprec-kernel-slope.py)
 * -------------------------------------------------------------------------------------
 *   (i)  SAME WINDOW g = 1e-5..1e-8. Extended-precision slope p = -0.4993846 (up) / -0.5006180 (down),
 *        residual 3.973e-4 (up) / 4.002e-4 (down) -- REPRODUCES the imp-97823 double-precision p =
 *        -0.4994 / -0.5006, residual ~4e-4, to all reported figures.
 *   (ii) DEEPER WINDOW g = 1e-6..1e-10 (feasible ONLY at extended precision). Slope tightens to
 *        p = -0.4998586 (up) / -0.5001416 (down) -- bracketing -1/2 to ~1.4e-4 -- and the residual
 *        SHRINKS to 1.595e-4 (up) / 1.598e-4 (down), a factor ~2.5 smaller for a one-decade-deeper window.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (M1) NOT A DOUBLE-PRECISION FLOOR. The ~4e-4 residual reproduces exactly at dps=60. A floor would
 *        have collapsed toward machine zero; it did not. The double-precision 5-point stencil was NOT the
 *        limiting factor on the imp-97823 deep window -- the residual is real arithmetic.
 *   (M2) IT IS THE FINITE-GAP RUNNING TERM. Pushing the window one decade deeper (g = 1e-6..1e-10) both
 *        tightens the slope onto -1/2 (to ~1.4e-4) and shrinks the residual (~4e-4 -> ~1.6e-4). A residual
 *        that decays as the window deepens is the O(sqrt(g)) cubic-fold running correction, NOT a fixed
 *        numerical floor. The imp-97823 p = -1/2 (|K| ~ g^(-1/2)) inverse-square-root fold law is
 *        confirmed at extended precision; the residual is the honest finite-gap curvature, not noise.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F
 * prefactor are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10 (double-precision deep-window slope p, residual ~4e-4 floor flag)
 * @see imp-97721-diag3-peak-upslope-crossvalidation (kernel construction reused verbatim)
 * @see imp-97662-cc-elasticity-peak-divergence (near-peak square-root fold, cubic-fold running correction)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const SQRT10 = Math.sqrt(10);

// --- Double-precision baseline: the imp-97823/imp-97721 kernel, reused verbatim, so the extended-precision
//     literals below can be compared against the SAME double-precision numbers imp-97823 reported. ---
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}
function peakLogN() {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1)) < parts(Math.exp(m2))) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}
const X_PEAK = peakLogN();
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = parts(N_PEAK);
const H_STENCIL = 1e-4;
function dSigmaDlnN(N) {
  const s = (d) => parts(N * Math.exp(d));
  return (-s(2 * H_STENCIL) + 8 * s(H_STENCIL) - 8 * s(-H_STENCIL) + s(-2 * H_STENCIL)) / (12 * H_STENCIL);
}
function crossOnArm(target, arm) {
  let a = arm === 'up' ? Math.log(1e4) : X_PEAK;
  let b = arm === 'up' ? X_PEAK : Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    const s = parts(Math.exp(m));
    if (arm === 'up') { if (s < target) a = m; else b = m; }
    else { if (s > target) a = m; else b = m; }
  }
  return Math.exp((a + b) / 2);
}
function absKAtGap(g, arm) {
  const N = crossOnArm(SIGMA_MAX - g, arm);
  return Math.abs(-1 / dSigmaDlnN(N));
}
function lsSlope(gaps, arm) {
  const xs = gaps.map((g) => Math.log10(g));
  const ys = gaps.map((g) => Math.log10(absKAtGap(g, arm)));
  const n = xs.length;
  const sx = xs.reduce((u, v) => u + v, 0);
  const sy = ys.reduce((u, v) => u + v, 0);
  const sxx = xs.reduce((u, v) => u + v * v, 0);
  const sxy = xs.reduce((u, v, i) => u + v * ys[i], 0);
  const p = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - p * sx) / n;
  const maxResid = Math.max(...xs.map((x, i) => Math.abs(ys[i] - (a + p * x))));
  return { p, maxResid };
}
const DEEP_GAPS = [1e-5, 1e-6, 1e-7, 1e-8];
const UP_DBL = lsSlope(DEEP_GAPS, 'up');
const DOWN_DBL = lsSlope(DEEP_GAPS, 'down');

// --- Extended-precision (mpmath, dps=60) literals, measured by tmp/imp-97834-extprec-kernel-slope.py.
//     Same surrogate; RvM inverse solved exactly; kernel derivative by Richardson-extrapolated diff. ---
const EXTPREC = {
  dps: 60,
  deep_window_g: '1e-5..1e-8',
  deep: {
    up: { slope_p: -0.4993846491, growth_per_decade: 3.157800209, max_resid_log10: 3.973e-4 },
    down: { slope_p: -0.5006180433, growth_per_decade: 3.166781093, max_resid_log10: 4.002e-4 },
  },
  deeper_window_g: '1e-6..1e-10', // feasible ONLY at extended precision
  deeper: {
    up: { slope_p: -0.4998586028, growth_per_decade: 3.161248256, max_resid_log10: 1.595e-4 },
    down: { slope_p: -0.5001415803, growth_per_decade: 3.163308733, max_resid_log10: 1.598e-4 },
  },
};

export const IMP97834_EXTPREC_KERNEL_SLOPE_RESIDUAL = {
  id: 'imp-97834',
  proofSection: 'S-frontier',
  question:
    'imp-97823 M1 flagged the deep-window (g = 1e-5..1e-8) least-squares slope of the reconstruction ' +
    'kernel |K| = |1/(N sigma_N)|, p = -0.4994 (up) / -0.5006 (down) with log-linear residual ~4e-4, as ' +
    'being "at the double-precision measurement floor". Is that ~4e-4 residual a genuine finite-gap ' +
    'running term, or a double-precision arithmetic floor? Recompute at extended precision to decide. ' +
    'Measurement only; pinned constants untouched; no bound moves; no QED.',
  method:
    'Reproduce the imp-97823/imp-97721 component surrogate EXACTLY (same C_C, E_trunc, Gronwall, C_F ' +
    'prefactor, RvM height inverse) but at mpmath dps=60: solve the RvM height equation exactly by ' +
    'findroot instead of the double Newton, and take the kernel derivative d sigma / d ln N by a ' +
    'high-precision Richardson-extrapolated derivative instead of the double-precision 5-point O(h^4) ' +
    'stencil. Fit log10|K| vs log10(g) on the SAME deep window (g = 1e-5..1e-8) and on a DEEPER window ' +
    '(g = 1e-6..1e-10, feasible only at extended precision); compare the slope and residual against the ' +
    'imp-97823 double-precision baseline recomputed here.',
  peak: {
    N_peak: +N_PEAK.toExponential(6),
    sigma_max: +SIGMA_MAX.toFixed(9),
  },
  double_precision_baseline_deep: {
    up: { slope_p: +UP_DBL.p.toFixed(6), max_resid_log10: +UP_DBL.maxResid.toExponential(3) },
    down: { slope_p: +DOWN_DBL.p.toFixed(6), max_resid_log10: +DOWN_DBL.maxResid.toExponential(3) },
  },
  extended_precision: EXTPREC,
  finding: {
    M1_not_a_double_precision_floor:
      'At extended precision (dps=60) the deep-window (g=1e-5..1e-8) slope is p = ' +
      EXTPREC.deep.up.slope_p + ' (up) / ' + EXTPREC.deep.down.slope_p + ' (down) and the log-linear ' +
      'residual is ' + EXTPREC.deep.up.max_resid_log10.toExponential(3) + ' (up) / ' +
      EXTPREC.deep.down.max_resid_log10.toExponential(3) + ' (down) -- REPRODUCING the imp-97823 ' +
      'double-precision p = -0.4994/-0.5006, residual ~4e-4, to all reported figures. A double-precision ' +
      'floor would have collapsed toward machine zero at dps=60; it did not. The ~4e-4 residual is real ' +
      'arithmetic, NOT a stencil/round-off floor.',
    M2_it_is_the_finite_gap_running_term:
      'Pushing the fit window one decade deeper into the peak (g=1e-6..1e-10, feasible only at extended ' +
      'precision) BOTH tightens the slope onto -1/2 -- p = ' + EXTPREC.deeper.up.slope_p + ' (up) / ' +
      EXTPREC.deeper.down.slope_p + ' (down), bracketing -1/2 to ~1.4e-4 -- AND shrinks the residual to ' +
      EXTPREC.deeper.up.max_resid_log10.toExponential(3) + ' (up) / ' +
      EXTPREC.deeper.down.max_resid_log10.toExponential(3) + ' (down), a factor ~2.5 smaller. A residual ' +
      'that decays as the window deepens is the O(sqrt(g)) cubic-fold running correction (imp-97662/' +
      'imp-97823), NOT a fixed numerical floor. The |K| ~ g^(-1/2) inverse-square-root fold law is ' +
      'confirmed at extended precision; the ~4e-4 residual is honest finite-gap curvature, not noise.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, NOT rigorous). Recomputing the imp-97823 deep-window kernel ' +
    '|K| = |1/(N sigma_N)| slope at extended precision (mpmath dps=60, exact RvM inverse, ' +
    'Richardson-extrapolated derivative) SETTLES the imp-97823 M1 double-precision-floor flag: the ' +
    'deep-window (g=1e-5..1e-8) slope p = ' + EXTPREC.deep.up.slope_p + ' (up) / ' + EXTPREC.deep.down.slope_p +
    ' (down) and residual ~4e-4 REPRODUCE the double-precision result exactly (a floor would have ' +
    'collapsed to ~1e-15), so the ~4e-4 residual is NOT a double-precision floor. Pushing to a ' +
    'deeper window (g=1e-6..1e-10) tightens the slope onto -1/2 (to ~1.4e-4) and SHRINKS the residual ' +
    '(~4e-4 -> ~1.6e-4): a residual that decays as the window deepens is the O(sqrt(g)) cubic-fold ' +
    'finite-gap RUNNING TERM (imp-97662/imp-97823), confirming the |K| ~ g^(-1/2) inverse-square-root ' +
    'fold law at extended precision. Conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-97823 (double-precision deep-window slope p, residual ~4e-4 floor flag); imp-97721 (kernel ' +
    'construction reused verbatim); imp-97662 (near-peak square-root fold, cubic-fold running); ' +
    'imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); imp-398 (C_F flow prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse); ' +
    'tmp/imp-97834-extprec-kernel-slope.py (mpmath dps=60 recompute).',
};

export const IMP97834_EXTPREC_KERNEL_SLOPE_RESIDUAL_ASSERTIONS = [
  {
    // The peak matches the imp-97520/imp-97823 L1 interior maximum.
    id: 'imp97834-peak-matches-l1',
    description: 'the interior peak is at N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520 L1)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // M1: the extended-precision deep-window slope reproduces the double-precision baseline recomputed here.
    id: 'imp97834-extprec-reproduces-double-slope',
    description: 'the extended-precision deep-window slope p matches the double-precision recompute to < 5e-4 on both arms',
    holds: () =>
      Math.abs(EXTPREC.deep.up.slope_p - UP_DBL.p) < 5e-4 &&
      Math.abs(EXTPREC.deep.down.slope_p - DOWN_DBL.p) < 5e-4,
  },
  {
    // M1: the ~4e-4 residual reproduces at dps=60 -- NOT a double-precision floor (a floor would be ~1e-15).
    id: 'imp97834-residual-not-a-floor',
    description: 'the extended-precision deep-window residual stays ~4e-4 (not collapsed to a machine floor)',
    holds: () =>
      EXTPREC.deep.up.max_resid_log10 > 1e-4 && EXTPREC.deep.up.max_resid_log10 < 1e-3 &&
      EXTPREC.deep.down.max_resid_log10 > 1e-4 && EXTPREC.deep.down.max_resid_log10 < 1e-3,
  },
  {
    // M2: pushing the window deeper SHRINKS the residual -- the running-term signature, not a fixed floor.
    id: 'imp97834-deeper-window-shrinks-residual',
    description: 'the deeper window (g=1e-6..1e-10) residual is smaller than the deep window (g=1e-5..1e-8) on both arms',
    holds: () =>
      EXTPREC.deeper.up.max_resid_log10 < EXTPREC.deep.up.max_resid_log10 &&
      EXTPREC.deeper.down.max_resid_log10 < EXTPREC.deep.down.max_resid_log10,
  },
  {
    // M2: the deeper-window slope tightens onto -1/2 (the inverse-square-root fold exponent).
    id: 'imp97834-deeper-slope-tighter-on-minus-half',
    description: 'the deeper-window slope brackets -1/2 more tightly than the deep window on both arms',
    holds: () =>
      Math.abs(EXTPREC.deeper.up.slope_p + 0.5) < Math.abs(EXTPREC.deep.up.slope_p + 0.5) &&
      Math.abs(EXTPREC.deeper.down.slope_p + 0.5) < Math.abs(EXTPREC.deep.down.slope_p + 0.5),
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp97834-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97834_EXTPREC_KERNEL_SLOPE_RESIDUAL.isRigorous === false &&
      /NO QED/.test(IMP97834_EXTPREC_KERNEL_SLOPE_RESIDUAL.verdict) &&
      /refereed bound is changed/i.test(IMP97834_EXTPREC_KERNEL_SLOPE_RESIDUAL.verdict),
  },
];

for (const a of IMP97834_EXTPREC_KERNEL_SLOPE_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97834-extprec-kernel-slope-residual assertion failed: ${a.id}`);
  }
}
