/**
 * @module imp-124766-cubic-fold-coefficient-B-inverse-fit
 *
 * imp-124766 (numerical/measurement, frontier cross-check): imp-97823 M2 named the cubic term B in the near-peak
 * expansion sigma(x) = sigma_max - A*(x - x_peak)^2 - B*(x - x_peak)^3 - ... (x = ln N) as the source of the
 * two-arm asymmetry in the reconstruction-kernel |K| = |1/(N sigma_N)| per-decade growth, but never measured B on
 * the imp-97823 WIDE ladder itself. imp-97833 then measured A and B DIRECTLY from the sigma Taylor derivatives at
 * the peak and PREDICTED the deep-window deviations. This leaf runs the INVERSE measurement the imp-124766 ticket
 * asks for: it FITS B (and the quadratic A) back out of the imp-97823 wide-ladder |K| observables themselves --
 * the sum of the two arms fixes A, the arm asymmetry fixes the running amplitude coefficient beta = B/A^(3/2) --
 * and verifies the fitted B reproduces the measured per-decade |K| ratios on BOTH arms. The wide-ladder inverse
 * fit converges (from the deep end inward) onto the imp-97833 derivative-measured A and B to ~1e-3 relative,
 * closing the loop by an independent method. Reuses the imp-97721/imp-97823/imp-97833 kernel construction verbatim;
 * measurement/sensitivity ONLY on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz are UNTOUCHED; pinned constants untouched; changes no
 * bound; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * THE INVERSE FIT (why the wide-ladder |K| observables pin A and B)
 * ----------------------------------------------------------------
 * Near the peak the gap g = sigma_max - s satisfies g = A*dx^2 + B*dx^3 with dx = x - x_peak. Solving for dx and
 * differentiating gives the two-arm kernel to next order (s = -1 upslope / +1 downslope):
 *      |K|(g, arm) = |K|_0(g) * (1 + s * beta * sqrt(g) + O(g)),   |K|_0(g) = 1 / (2 sqrt(A) sqrt(g)),
 * with beta = B / A^(3/2). Two arm observables therefore invert cleanly at each gap:
 *      SUM   = |K|_up + |K|_down = 1/sqrt(A g) * (1 + O(g))         =>  A_fit(g) = 1 / (g * SUM^2),
 *      ASYM  = (|K|_up - |K|_down)/(|K|_up + |K|_down) = beta*sqrt(g) + O(g)  =>  beta_fit(g) = ASYM / sqrt(g),
 * and B_fit(g) = beta_fit(g) * A_fit(g)^(3/2). A second, equivalent route reads beta from the per-decade RATIO
 * asymmetry: r(g, arm) = |K|(g/10)/|K|(g) = sqrt(10) * (1 - s*(sqrt(10)-1)*beta*sqrt(g) + O(g)), so
 *      beta_ratio(g) = (r_down - r_up) / (2 (sqrt(10) - 1) sqrt(g)).
 * Both routes are the imp-97823 M2 running-correction amplitude read BACKWARDS to recover the cubic coefficient.
 *
 * THE MEASUREMENT (the deliverable)
 * ---------------------------------
 *   (i)   WIDE LADDER. |K|_up and |K|_down at gaps g = 1e-1 .. 1e-7 (imp-97823 verbatim); per-gap A_fit, beta_fit
 *         and B_fit from the sum/asymmetry inversion.
 *   (ii)  RATIO ROUTE. beta_ratio from the per-decade |K|-ratio asymmetry at each wide anchor.
 *   (iii) CROSS-CHECK. The deep-converged A_fit, beta_fit, B_fit vs the imp-97833 derivative-measured
 *         A = 3.215955e-3, B = 2.6240e-4, beta = 1.4388 (independent method agreement).
 *   (iv)  VERIFY. The fitted (A, beta) reproduce the measured per-decade |K| ratios on both arms; the relative
 *         match error per decade, and the shallowest-gap breakdown where the two-term O(sqrt(g)) model fails.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (M1) B FITTED FROM THE WIDE LADDER = imp-97833 DERIVATIVE-MEASURED B. The sum/asymmetry inversion converges (from
 *        g = 1e-4 inward) onto A_fit = 3.215955e-3 and beta_fit = 1.43862, giving B_fit = 2.6237e-4 (positive),
 *        matching the imp-97833 derivative A = 3.215955e-3 / B = 2.6240e-4 / beta = 1.4388 to < 1.2e-3 relative --
 *        an independent-method confirmation that the two-arm |K| asymmetry IS the cubic fold with this B.
 *   (M2) THE PER-DECADE RATIO-ASYMMETRY ROUTE AGREES. beta_ratio from the |K|-ratio asymmetry converges to 1.43865,
 *        identical to the sum/asymmetry beta to < 1e-4, so the recovered B is route-independent.
 *   (M3) THE FITTED B REPRODUCES THE MEASURED DECADE RATIOS; SHALLOWEST DECADE IS THE SUB-GAP. Feeding (A_fit,
 *        beta_fit) back through the two-arm model reproduces the measured per-decade |K| ratios to < 1e-2 on both
 *        arms for all gaps g <= 1e-2; only the shallowest decade g = 1e-1 (sqrt(g) ~ 0.32, |dx| ~ 5.6, the two-term
 *        model is not asymptotic there) departs (~40% upslope), where A_fit = 1.78e-3 undershoots by ~45%. NAMED
 *        SUB-GAP: the wide-ladder inverse fit is trustworthy only inward of g ~ 1e-2; the shallowest decade carries
 *        uncontrolled quartic-and-higher fold terms and is NOT invertible by the two-term (A, B) model.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only as the fixed surrogate; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97833-cubic-fold-curvature-B (A, B from the sigma Taylor derivatives at the peak; predicts the deviations)
 * @see imp-97823-kernel-decade-growth-sqrt10 (|K| ~ sqrt(10) per decade + the M2 cubic-fold running correction)
 * @see imp-97721-diag3-peak-upslope-crossvalidation (shared kernel construction)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97721/imp-97823/imp-97833 exactly
const SQRT10 = Math.sqrt(10); // 3.16227766...

// imp-97833 derivative-measured reference (A = -sigma_xx/2, B = -sigma_xxx/6 at the peak): the target the inverse fit must recover.
const A_REF = 3.215955e-3;
const B_REF = 2.6240e-4;
const BETA_REF = 1.4388;

// EXACT imp-3406/imp-97644/imp-97721/imp-97823/imp-97833 surrogate (baseline amplitudes c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function sigmaAt(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}
// Interior peak location: ternary search in x = ln N (imp-97662/imp-97721/imp-97823/imp-97833 verbatim).
function peakLogN() {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (sigmaAt(Math.exp(m1)) < sigmaAt(Math.exp(m2))) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}

const X_PEAK = peakLogN();
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = sigmaAt(N_PEAK);

// d sigma / d ln N via 5-point O(h^4) stencil -- the shared kernel K = -1/(N sigma_N) (imp-97823 verbatim).
function dSigmaDlnN(N, h) {
  const s = (d) => sigmaAt(N * Math.exp(d));
  return (-s(2 * h) + 8 * s(h) - 8 * s(-h) + s(-2 * h)) / (12 * h);
}
function crossBelow(target) {
  let a = X_PEAK, b = Math.log(1e18);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2; if (sigmaAt(Math.exp(m)) > target) a = m; else b = m; }
  return Math.exp((a + b) / 2);
}
function crossAbove(target) {
  let a = Math.log(1e4), b = X_PEAK;
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2; if (sigmaAt(Math.exp(m)) < target) a = m; else b = m; }
  return Math.exp((a + b) / 2);
}
const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K (imp-97823 verbatim)
function absKAtGap(g, arm) {
  const target = SIGMA_MAX - g;
  const N = arm === 'down' ? crossBelow(target) : crossAbove(target);
  return Math.abs(-1 / dSigmaDlnN(N, H_STENCIL));
}

// --- The imp-97823 wide ladder, both arms, and the per-gap sum/asymmetry inversion ---
const WIDE_GAPS = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7];
const LADDER = WIDE_GAPS.map((g) => {
  const Kup = absKAtGap(g, 'up');
  const Kdown = absKAtGap(g, 'down');
  const SUM = Kup + Kdown;
  const ASYM = (Kup - Kdown) / SUM;
  const A_fit = 1 / (g * SUM * SUM); // sum route: SUM ~ 1/sqrt(A g)
  const beta_fit = ASYM / Math.sqrt(g); // asymmetry route: ASYM ~ beta sqrt(g)
  const B_fit = beta_fit * Math.pow(A_fit, 1.5);
  return { g, Kup, Kdown, A_fit, beta_fit, B_fit };
});

// Primary deep readout: the g = 1e-6 rung (deep enough to converge, before the g = 1e-7 asymmetry round-off floor).
const PRIMARY = LADDER.find((r) => r.g === 1e-6);
const A_FIT = PRIMARY.A_fit; // ~3.215955e-3
const BETA_FIT = PRIMARY.beta_fit; // ~1.438615
const B_FIT = PRIMARY.B_fit; // ~2.6237e-4

// --- Second route: beta from the per-decade |K|-ratio asymmetry ---
const RATIO_ROWS = [];
for (let i = 0; i + 1 < LADDER.length; i++) {
  const g = LADDER[i].g;
  const rUp = LADDER[i + 1].Kup / LADDER[i].Kup;
  const rDown = LADDER[i + 1].Kdown / LADDER[i].Kdown;
  const beta_ratio = (rDown - rUp) / (2 * (SQRT10 - 1) * Math.sqrt(g));
  RATIO_ROWS.push({ g, rUp, rDown, beta_ratio });
}
const BETA_RATIO = RATIO_ROWS.find((r) => r.g === 1e-6).beta_ratio; // ~1.43865

// --- Verify: the fitted (A, beta) reproduce the measured per-decade |K| ratios on both arms ---
function predRatio(g, arm) {
  const s = arm === 'up' ? 1 : -1;
  const Kg = (1 / (2 * Math.sqrt(A_FIT * g))) * (1 + s * BETA_FIT * Math.sqrt(g));
  const Kg10 = (1 / (2 * Math.sqrt(A_FIT * (g / 10)))) * (1 + s * BETA_FIT * Math.sqrt(g / 10));
  return Kg10 / Kg;
}
const VERIFY = [];
for (let i = 0; i + 1 < LADDER.length; i++) {
  const g = LADDER[i].g;
  const rUpM = LADDER[i + 1].Kup / LADDER[i].Kup;
  const rDownM = LADDER[i + 1].Kdown / LADDER[i].Kdown;
  const rUpP = predRatio(g, 'up');
  const rDownP = predRatio(g, 'down');
  VERIFY.push({
    g,
    up_rel_err: Math.abs(rUpM - rUpP) / rUpM,
    down_rel_err: Math.abs(rDownM - rDownP) / rDownM,
  });
}
// Deep verify (g <= 1e-2): the two-term model must reproduce the ratios cleanly. Shallowest (g = 1e-1) is the sub-gap.
const DEEP_VERIFY = VERIFY.filter((v) => v.g <= 1e-2);
const SHALLOW = VERIFY.find((v) => v.g === 1e-1);
const A_FIT_SHALLOW = LADDER.find((r) => r.g === 1e-1).A_fit; // undershoots -- sub-gap marker

export const IMP124766_CUBIC_FOLD_COEFFICIENT_B_INVERSE_FIT = {
  id: 'imp-124766',
  proofSection: 'S-frontier',
  question:
    'imp-97823 M2 named the cubic term B in sigma(x) = sigma_max - A*(x-x_peak)^2 - B*(x-x_peak)^3 as the source ' +
    'of the two-arm |K| = |1/(N sigma_N)| per-decade asymmetry but never measured it on the wide ladder. Fit B ' +
    '(and A) BACK OUT of the imp-97823 wide-ladder |K| observables -- the arm sum fixes A, the arm asymmetry fixes ' +
    'beta = B/A^(3/2) -- and verify the fitted B reproduces the measured per-decade |K| ratios on both arms. ' +
    'Measurement/sensitivity only; pinned constants untouched; no bound moves; no QED.',
  method:
    'Reusing the imp-97823/imp-97833 surrogate and kernel verbatim, measure |K|_up and |K|_down at wide gaps ' +
    'g = 1e-1..1e-7. Invert per gap: A_fit = 1/(g*SUM^2) from SUM = |K|_up+|K|_down ~ 1/sqrt(A g); ' +
    'beta_fit = ASYM/sqrt(g) from ASYM = (|K|_up-|K|_down)/SUM ~ beta sqrt(g); B_fit = beta_fit*A_fit^(3/2). ' +
    'Second route: beta_ratio = (r_down-r_up)/(2(sqrt(10)-1)sqrt(g)) from the per-decade |K|-ratio asymmetry. ' +
    'Cross-check the deep-converged A_fit/B_fit/beta_fit against the imp-97833 derivative-measured A/B/beta, and ' +
    'verify the fitted (A, beta) reproduce the measured per-decade |K| ratios on both arms.',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
  },
  inverse_fit_ladder: LADDER.map((r) => ({
    gap: +r.g.toExponential(0),
    absK_up: +r.Kup.toExponential(4),
    absK_down: +r.Kdown.toExponential(4),
    A_fit: +r.A_fit.toExponential(6),
    beta_fit: +r.beta_fit.toFixed(6),
    B_fit: +r.B_fit.toExponential(6),
  })),
  deep_converged_fit: {
    anchor_gap: 1e-6,
    A_fit: +A_FIT.toExponential(6), // ~3.215955e-3
    beta_fit: +BETA_FIT.toFixed(6), // ~1.438615
    B_fit: +B_FIT.toExponential(6), // ~2.623672e-4
    B_sign_positive: B_FIT > 0,
  },
  ratio_asymmetry_route: {
    per_anchor_beta: RATIO_ROWS.map((r) => ({ gap: +r.g.toExponential(0), beta_ratio: +r.beta_ratio.toFixed(6) })),
    deep_beta_ratio: +BETA_RATIO.toFixed(6), // ~1.43865
  },
  imp97833_reference_crosscheck: {
    A_ref: A_REF,
    B_ref: B_REF,
    beta_ref: BETA_REF,
    A_rel_diff: +(Math.abs(A_FIT - A_REF) / A_REF).toExponential(2),
    B_rel_diff: +(Math.abs(B_FIT - B_REF) / B_REF).toExponential(2),
    beta_rel_diff: +(Math.abs(BETA_FIT - BETA_REF) / BETA_REF).toExponential(2),
  },
  verify_decade_ratios: {
    per_decade_rel_err: VERIFY.map((v) => ({
      gap: +v.g.toExponential(0),
      up_rel_err: +v.up_rel_err.toExponential(2),
      down_rel_err: +v.down_rel_err.toExponential(2),
    })),
    deep_max_rel_err: +Math.max(...DEEP_VERIFY.map((v) => Math.max(v.up_rel_err, v.down_rel_err))).toExponential(2),
    shallow_gap_max_rel_err: +Math.max(SHALLOW.up_rel_err, SHALLOW.down_rel_err).toExponential(2),
    shallow_A_fit_undershoot: +A_FIT_SHALLOW.toExponential(6), // ~1.78e-3, ~45% below the converged A
  },
  finding: {
    M1_B_fitted_from_wide_ladder_equals_derivative:
      'The sum/asymmetry inversion of the imp-97823 wide-ladder |K| observables converges (from g = 1e-4 inward) ' +
      'onto A_fit = ' + A_FIT.toExponential(6) + ' and beta_fit = ' + BETA_FIT.toFixed(5) + ', giving ' +
      'B_fit = ' + B_FIT.toExponential(4) + ' (positive), matching the imp-97833 derivative-measured ' +
      'A = ' + A_REF.toExponential(4) + ' / B = ' + B_REF.toExponential(4) + ' / beta = ' + BETA_REF +
      ' to < 1.2e-3 relative -- an independent-method confirmation that the two-arm |K| asymmetry IS the ' +
      'cubic fold with this B.',
    M2_ratio_route_agrees:
      'The second route -- beta from the per-decade |K|-ratio asymmetry (r_down-r_up)/(2(sqrt(10)-1)sqrt(g)) -- ' +
      'converges to beta_ratio = ' + BETA_RATIO.toFixed(5) + ', identical to the sum/asymmetry beta to < 1e-4, ' +
      'so the recovered B is route-independent.',
    M3_fitted_B_reproduces_ratios_shallow_is_subgap:
      'Feeding (A_fit, beta_fit) back through the two-arm model reproduces the measured per-decade |K| ratios to ' +
      '< 1e-2 on both arms for all g <= 1e-2 (deep max rel err ' + DEEP_VERIFY.reduce((m, v) => Math.max(m, v.up_rel_err, v.down_rel_err), 0).toExponential(2) +
      '); only the shallowest decade g = 1e-1 (sqrt(g) ~ 0.32, the two-term model is not asymptotic) departs ' +
      '(max rel err ' + Math.max(SHALLOW.up_rel_err, SHALLOW.down_rel_err).toExponential(1) + ', A_fit there = ' +
      A_FIT_SHALLOW.toExponential(3) + ' undershoots ~45%). NAMED SUB-GAP: the wide-ladder inverse fit is ' +
      'trustworthy only inward of g ~ 1e-2; the shallowest decade carries uncontrolled quartic-and-higher fold ' +
      'terms and is NOT invertible by the two-term (A, B) model.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, NOT rigorous). Fitting the cubic-fold coefficient B back out of the ' +
    'imp-97823 wide-ladder |K| = |1/(N sigma_N)| observables -- the arm SUM fixes A_fit = ' + A_FIT.toExponential(6) +
    ', the arm ASYMMETRY fixes beta_fit = ' + BETA_FIT.toFixed(5) + ' = B/A^(3/2), giving B_fit = ' +
    B_FIT.toExponential(4) + ' (positive) -- recovers the imp-97833 derivative-measured A = ' + A_REF.toExponential(4) +
    ' / B = ' + B_REF.toExponential(4) + ' / beta = ' + BETA_REF + ' to < 1.2e-3 relative by an independent ' +
    'method, and the per-decade |K|-ratio-asymmetry route agrees (beta_ratio = ' + BETA_RATIO.toFixed(5) + '). The ' +
    'fitted (A, beta) reproduce the measured per-decade |K| ratios to < 1e-2 on both arms for all g <= 1e-2; the ' +
    'shallowest decade g = 1e-1 (sqrt(g) ~ 0.32, not asymptotic) is the NAMED SUB-GAP where the two-term (A, B) ' +
    'model fails (A_fit undershoots ~45%, ratio miss ~40%) because uncontrolled quartic-and-higher fold terms ' +
    'dominate there. So the imp-97823 M2 two-arm asymmetry IS the cubic fold, and B is now measured from the ' +
    'wide-ladder observable itself, not only from the peak derivatives. Conditional-share diagnostic on the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97833 (A, B from sigma Taylor derivatives at the peak; predicts the deviations); imp-97823 (|K| ~ ' +
    'sqrt(10) per decade + M2 cubic-fold running correction); imp-97721 (shared kernel construction); imp-97520 ' +
    '(L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); imp-398 (C_F flow prefactor); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124766_CUBIC_FOLD_COEFFICIENT_B_INVERSE_FIT_ASSERTIONS = [
  {
    // The peak matches the imp-97520/imp-97662/imp-97721/imp-97823/imp-97833 L1 interior maximum.
    id: 'imp124766-peak-matches-l1',
    description: 'the interior peak is at N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520 L1)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // (M1): the wide-ladder inverse fit recovers A to < 1e-3 relative of the imp-97833 derivative value.
    id: 'imp124766-A-fit-recovers-derivative',
    description: 'the deep inverse-fit A_fit matches the imp-97833 derivative A = 3.215955e-3 to < 1e-3 relative',
    holds: () => Math.abs(A_FIT - A_REF) / A_REF < 1e-3,
  },
  {
    // (M1): the fitted B is positive and matches the imp-97833 derivative B to < 1.2e-3 relative.
    id: 'imp124766-B-fit-recovers-derivative',
    description: 'the deep inverse-fit B_fit > 0 matches the imp-97833 derivative B = 2.6240e-4 to < 1.2e-3 relative',
    holds: () => B_FIT > 0 && Math.abs(B_FIT - B_REF) / B_REF < 1.2e-3,
  },
  {
    // (M1): the running amplitude coefficient beta = B/A^(3/2) recovers the imp-97833 value to < 2e-3.
    id: 'imp124766-beta-fit-recovers-derivative',
    description: 'the deep inverse-fit beta_fit ~ 1.4386 matches the imp-97833 beta = 1.4388 to < 2e-3 relative',
    holds: () => Math.abs(BETA_FIT - BETA_REF) / BETA_REF < 2e-3,
  },
  {
    // (M1): the inverse fit converges -- A_fit is stable across the deep gaps g = 1e-4..1e-7 to < 1e-4 relative.
    id: 'imp124766-A-fit-converges',
    description: 'A_fit is stable across the deep gaps g = 1e-4..1e-7 to < 1e-4 relative (converged inverse fit)',
    holds: () => {
      const deepA = LADDER.filter((r) => r.g <= 1e-4).map((r) => r.A_fit);
      return (Math.max(...deepA) - Math.min(...deepA)) / Math.abs(deepA[0]) < 1e-4;
    },
  },
  {
    // (M2): the per-decade ratio-asymmetry route recovers the same beta to < 1e-3.
    id: 'imp124766-ratio-route-agrees',
    description: 'the per-decade ratio-asymmetry beta_ratio matches the sum/asymmetry beta_fit to < 1e-3',
    holds: () => Math.abs(BETA_RATIO - BETA_FIT) / BETA_FIT < 1e-3,
  },
  {
    // (M3): the fitted (A, beta) reproduce the measured per-decade |K| ratios to < 1e-2 on both arms for g <= 1e-2.
    id: 'imp124766-verify-deep-ratios',
    description: 'the fitted (A, beta) reproduce the measured per-decade |K| ratios to < 1e-2 on both arms for g <= 1e-2',
    holds: () => DEEP_VERIFY.every((v) => v.up_rel_err < 1e-2 && v.down_rel_err < 1e-2),
  },
  {
    // (M3): the shallowest decade g = 1e-1 is the named sub-gap -- the two-term model fails there (> 10% ratio miss).
    id: 'imp124766-shallow-gap-is-subgap',
    description: 'the shallowest decade g = 1e-1 breaks the two-term model (> 10% ratio miss) -- the named sub-gap',
    holds: () => Math.max(SHALLOW.up_rel_err, SHALLOW.down_rel_err) > 0.1,
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp124766-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124766_CUBIC_FOLD_COEFFICIENT_B_INVERSE_FIT.isRigorous === false &&
      /NO QED/.test(IMP124766_CUBIC_FOLD_COEFFICIENT_B_INVERSE_FIT.verdict) &&
      /remains SOTA/.test(IMP124766_CUBIC_FOLD_COEFFICIENT_B_INVERSE_FIT.verdict),
  },
];

for (const a of IMP124766_CUBIC_FOLD_COEFFICIENT_B_INVERSE_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124766-cubic-fold-coefficient-B-inverse-fit assertion failed: ${a.id}`);
  }
}
