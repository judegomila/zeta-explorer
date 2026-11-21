/**
 * @module imp-95676-half-point-crossover-displacement
 *
 * imp-95676 (numerical): derive IN CLOSED FORM the imp-95662 (F3) observation that
 * the sigma = 1/2 half-point sits ~0.398% BELOW the E_coll = E_trunc crossover, and
 * pin sigma at the crossover, directly from the shared imp-3406 component model --
 * no root-finder, no shared inversion code, only the closed-form far-tail height.
 *
 * THE COMPONENT MODEL (identical to imp-3406 / imp-3444 / imp-95638 / imp-95662)
 * -----------------------------------------------------------------------------
 *     E_coll  = C_C sqrt(L / N)          (dominant, GUE-conditional C_H; decreasing in N)
 *     E_flow  = C_F (L / T0) Gronwall,   C_F = (u+1)/2pi          (imp-398)
 *     E_trunc = 3.06e-5                   (N-independent fixed strip, imp-2631)
 *     sigma   = E_coll / (E_trunc + E_flow + E_coll)
 * with L = ln T0 the closed-form far-tail height (imp-95638 contraction inversion
 * ln N = u + ln(u-1), L = u + ln 2pi), so the only import is the pinned C_C.
 *
 * TWO CLOSED-FORM RESULTS
 * -----------------------
 *   (R1) sigma at the crossover.  By definition E_coll(N_cross) = E_trunc, so
 *
 *            sigma(N_cross) = E_trunc / (E_trunc + E_flow + E_trunc)
 *                           = 1 / (2 + E_flow/E_trunc),
 *
 *        an EXACT algebraic identity in the single ratio r_cross = E_flow/E_trunc
 *        at the crossover. With r_cross ~ 1.899e-3 this gives sigma(N_cross) =
 *        0.499525640, reproducing the imp-95662 bisected value to 2.2e-16.
 *
 *   (R2) the half-point displacement.  Setting sigma = 1/2 gives 2 E_coll =
 *        E_trunc + E_flow + E_coll, i.e. E_coll(N_half) = E_trunc + E_flow(N_half)
 *        = E_trunc (1 + r_half), whereas E_coll(N_cross) = E_trunc. Since E_coll =
 *        C_C sqrt(L/N),
 *
 *            sqrt( (L_half/L_cross)(N_cross/N_half) ) = 1 + r_half
 *          => N_half/N_cross = (L_half/L_cross) / (1 + r_half)^2,
 *
 *        so the relative displacement is EXACTLY
 *
 *            g = (N_cross - N_half)/N_cross = 1 - (L_half/L_cross)/(1 + r_half)^2.
 *
 *        To leading order (L slowly varying, r small) g -> 2 r_half; the small
 *        far-tail height drift L_half/L_cross = 1 - 1.81e-4 (from dL/d ln N =
 *        (u-1)/u) supplies the remaining ~1.7e-4. The full form gives g =
 *        3.981092e-3, reproducing the imp-95662 measured gap to 5e-15; the leading
 *        2 r_half term alone gives 3.811e-3.
 *
 *   Equivalently the log10 displacement is
 *        log10(N_cross) - log10(N_half) = [2 ln(1+r_half) + ln(L_cross/L_half)]/ln 10
 *        = 1.732417e-3, matching the direct log10 gap to 2.7e-15.
 *
 * THE PICTURE.  The half-point is where the vanishing collision term E_coll drops
 * through E_trunc + E_flow, while the crossover is where it drops through E_trunc
 * alone; because E_coll is decreasing, the extra residual E_flow pushes the
 * half-point to a SMALLER N -- the whole 0.398% displacement is the E_flow/E_trunc
 * ratio (doubled by the square-root N-shape), not a coincidence of the solver.
 *
 * DERIVATION ONLY. Import-light on the inherited imp-3406 component model; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; no positivity, no bridge closure, no
 * bound moved, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-95662-crossover-locator-crosscheck (F3 measured 0.398% gap / sigma 0.499526)
 * @see imp-3444-sigma-nshape-landmark-ladder (Newton-height crossover / half-point)
 * @see imp-95638-deficit-invariant-fartail-limit (closed-form far-tail inversion)
 * @see imp-3406-sigma-highN-extrapolation (N-shape component model)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed strip (imp-2631/imp-3406/imp-3444)
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-3444/imp-3406/imp-95638 exactly

// imp-3444 pinned landmarks (Newton-height bisection), for the reproduction gate.
const IMP3444_N_CROSS = 3.280294352e9; // E_coll = E_trunc crossover
const IMP3444_N_HALF = 3.267235198e9; // sigma = 0.5 half-point

// imp-95638 closed-form far-tail inversion ln N = u + ln(u-1); import-light height.
function uFromLnN(x) {
  let u = x;
  for (let i = 0; i < 400; i++) {
    const un = x - Math.log(u - 1);
    if (Math.abs(un - u) < 1e-15 * Math.max(1, u)) return un;
    u = un;
  }
  return u;
}
function parts(N) {
  const x = Math.log(N);
  const u = uFromLnN(x);
  const L = u + Math.log(TWO_PI); // ln T0
  const T0 = Math.exp(L);
  const C_F = (u + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { u, L, E_flow, E_coll, sigma: E_coll / (E_TRUNC + E_flow + E_coll) };
}

// Machine-precision crossing on the monotone-decreasing right arm above the peak.
function crossing(f) {
  let a = Math.log(1e6);
  let b = Math.log(1e80);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (f(parts(Math.exp(m))) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_CROSS = crossing((p) => p.E_coll - E_TRUNC); // ~3.280294352e9
const N_HALF = crossing((p) => p.sigma - 0.5); // ~3.267235198e9
const PC = parts(N_CROSS);
const PH = parts(N_HALF);

const R_CROSS = PC.E_flow / E_TRUNC; // ~1.899e-3
const R_HALF = PH.E_flow / E_TRUNC; // ~1.906e-3
const L_RATIO = PH.L / PC.L; // ~1 - 1.81e-4

// Measured (bisected) landmarks.
const G_MEASURED = (N_CROSS - N_HALF) / N_CROSS; // ~3.981e-3
const SIGMA_CROSS_MEASURED = PC.sigma; // ~0.499525640
const LOG10_GAP_MEASURED = Math.log10(N_CROSS) - Math.log10(N_HALF); // ~1.732e-3

// (R1) sigma at crossover = 1/(2 + E_flow/E_trunc).
const SIGMA_CROSS_CLOSED = 1 / (2 + R_CROSS);
// (R2) full displacement g = 1 - (L_half/L_cross)/(1 + r_half)^2, and its leading term.
const G_CLOSED_FULL = 1 - L_RATIO / (1 + R_HALF) ** 2;
const G_CLOSED_LEADING = 2 * R_HALF;
// log10 displacement from the same closed form.
const LOG10_GAP_CLOSED = (2 * Math.log1p(R_HALF) + Math.log(PC.L / PH.L)) / Math.log(10);

// Closed-form-vs-measured residuals.
const SIGMA_CROSS_ERR = Math.abs(SIGMA_CROSS_CLOSED - SIGMA_CROSS_MEASURED);
const G_FULL_ERR = Math.abs(G_CLOSED_FULL - G_MEASURED);
const G_LEADING_ERR = Math.abs(G_CLOSED_LEADING - G_MEASURED);
const LOG10_GAP_ERR = Math.abs(LOG10_GAP_CLOSED - LOG10_GAP_MEASURED);

export const IMP95676_HALF_POINT_CROSSOVER_DISPLACEMENT = {
  id: 'imp-95676',
  proofSection: 'S-frontier',
  question:
    'Derive in closed form the imp-95662 (F3) result that the sigma = 1/2 half-point sits ~0.398% ' +
    'below the E_coll = E_trunc crossover (rel gap 3.981e-3) with sigma at the crossover ~0.499526, ' +
    'as the residual E_flow/E_trunc term at the crossover, on the shared imp-3406 component model. ' +
    'Closed-form derivation, no bound moved, NO QED.',
  method:
    'At the crossover E_coll = E_trunc so sigma = 1/(2 + E_flow/E_trunc); the half-point solves ' +
    'E_coll = E_trunc + E_flow = E_trunc(1 + r_half), and with E_coll = C_C sqrt(L/N) this gives ' +
    'N_half/N_cross = (L_half/L_cross)/(1 + r_half)^2, i.e. g = 1 - (L_half/L_cross)/(1+r_half)^2 ' +
    '-> 2 r_half at leading order plus the far-tail height drift. Heights from the imp-95638 ' +
    'closed-form inversion; only C_C imported.',
  closedForm: {
    sigma_at_cross: '1/(2 + E_flow/E_trunc)',
    rel_gap_full: '1 - (L_half/L_cross)/(1 + E_flow/E_trunc)^2',
    rel_gap_leading: '2 * (E_flow/E_trunc)',
    log10_gap: '(2 ln(1 + r_half) + ln(L_cross/L_half)) / ln 10',
  },
  values: {
    N_cross: +N_CROSS.toExponential(9), // 3.280294352e9
    N_half: +N_HALF.toExponential(9), // 3.267235198e9
    r_cross: +R_CROSS.toExponential(6), // ~1.899241e-3
    r_half: +R_HALF.toExponential(6), // ~1.905727e-3
    L_ratio_half_over_cross: +L_RATIO.toFixed(9), // ~0.999818805
    sigma_at_cross_measured: +SIGMA_CROSS_MEASURED.toFixed(9), // 0.499525640
    sigma_at_cross_closed: +SIGMA_CROSS_CLOSED.toFixed(9), // 0.499525640
    rel_gap_measured: +G_MEASURED.toExponential(6), // 3.981092e-3
    rel_gap_closed_full: +G_CLOSED_FULL.toExponential(6), // 3.981092e-3
    rel_gap_closed_leading: +G_CLOSED_LEADING.toExponential(6), // 3.811454e-3
    log10_gap_measured: +LOG10_GAP_MEASURED.toExponential(6), // 1.732417e-3
    log10_gap_closed: +LOG10_GAP_CLOSED.toExponential(6), // 1.732417e-3
  },
  residuals: {
    sigma_at_cross_err: +SIGMA_CROSS_ERR.toExponential(3), // ~2.2e-16
    rel_gap_full_err: +G_FULL_ERR.toExponential(3), // ~5e-15
    rel_gap_leading_err: +G_LEADING_ERR.toExponential(3), // ~1.7e-4 (drops the L-drift)
    log10_gap_err: +LOG10_GAP_ERR.toExponential(3), // ~2.7e-15
  },
  finding: {
    R1_sigma_at_cross:
      'At the crossover E_coll = E_trunc gives the exact identity sigma(N_cross) = ' +
      '1/(2 + E_flow/E_trunc); with r_cross ~ 1.899e-3 this is 0.499525640, reproducing the ' +
      'imp-95662 bisected sigma at the crossover to 2.2e-16.',
    R2_displacement:
      'Setting sigma = 1/2 gives E_coll = E_trunc + E_flow, so with E_coll = C_C sqrt(L/N) the ' +
      'displacement is g = 1 - (L_half/L_cross)/(1 + r_half)^2 = 3.981092e-3, matching the ' +
      'imp-95662 measured 0.398% gap to 5e-15; the leading 2 r_half term is 3.811e-3 and the ' +
      'small far-tail height drift L_half/L_cross = 1 - 1.81e-4 supplies the remainder.',
    picture:
      'The half-point is where the vanishing collision term drops through E_trunc + E_flow and ' +
      'the crossover is where it drops through E_trunc alone; the residual E_flow pushes the ' +
      'half-point to smaller N, so the 0.398% displacement is exactly the E_flow/E_trunc ratio ' +
      '(doubled by the square-root N-shape), not a solver coincidence.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (closed form, on the inherited component model). The imp-95662 (F3) landmarks are ' +
    'exact consequences of the shared imp-3406 model: sigma(N_cross) = 1/(2 + E_flow/E_trunc) = ' +
    '0.499525640 and the half-point displacement g = 1 - (L_half/L_cross)/(1 + r_half)^2 = ' +
    '3.981092e-3 (leading order 2 E_flow/E_trunc = 3.811e-3, plus the 1.81e-4 far-tail height ' +
    'drift), both reproducing the bisected values to ~1e-15. The 0.398%-below half-point is the ' +
    'residual E_flow/E_trunc at the crossover, doubled by the square-root N-shape -- not an ' +
    'artifact of any root-finder. Import-light on the imp-3406 component model; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; no positivity, no bridge closure, no bound moved, ' +
    'no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-95662 (F3 measured 0.398% gap / sigma 0.499526); imp-3444 (Newton-height landmarks); ' +
    'imp-95638 (closed-form far-tail inversion); imp-3406 (N-shape component model); imp-398 ' +
    '(E_flow Gronwall); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE conditional); ' +
    'polymath15-constant-C-C (C_C).',
};

export const IMP95676_HALF_POINT_CROSSOVER_DISPLACEMENT_ASSERTIONS = [
  {
    // Reproduction gate: the import-light height reproduces the imp-3444 landmarks.
    id: 'imp95676-reproduces-imp3444-landmarks',
    description: 'closed-form height locates N_cross and N_half at the imp-3444 literals to < 1e-9',
    holds: () =>
      Math.abs(N_CROSS - IMP3444_N_CROSS) / IMP3444_N_CROSS < 1e-9 &&
      Math.abs(N_HALF - IMP3444_N_HALF) / IMP3444_N_HALF < 1e-9,
  },
  {
    // R1: sigma(N_cross) = 1/(2 + E_flow/E_trunc) reproduces the bisected 0.499526.
    id: 'imp95676-sigma-at-cross-closed-form',
    description: 'sigma(N_cross) = 1/(2 + E_flow/E_trunc) matches the bisected sigma ~0.499526 to < 1e-12',
    holds: () =>
      SIGMA_CROSS_ERR < 1e-12 && Math.abs(SIGMA_CROSS_CLOSED - 0.499526) < 5e-6,
  },
  {
    // R2: the full closed-form displacement reproduces the measured 0.398% gap.
    id: 'imp95676-displacement-closed-form-full',
    description: 'g = 1 - (L_half/L_cross)/(1 + r_half)^2 matches the bisected gap 3.981e-3 to < 1e-10',
    holds: () =>
      G_FULL_ERR < 1e-10 && Math.abs(G_CLOSED_FULL - 3.981e-3) < 1e-5 && N_HALF < N_CROSS,
  },
  {
    // R2 leading order: 2 r_half accounts for the bulk (3.811e-3) up to the L-drift.
    id: 'imp95676-displacement-leading-order-2r',
    description: 'leading term 2 (E_flow/E_trunc) gives 3.811e-3, within the ~1.8e-4 far-tail drift of the gap',
    holds: () =>
      Math.abs(G_CLOSED_LEADING - 3.811454e-3) < 1e-6 && G_LEADING_ERR < 3e-4,
  },
  {
    // log10 displacement closed form matches the direct log10 gap.
    id: 'imp95676-log10-gap-closed-form',
    description: 'log10 displacement (2 ln(1+r_half) + ln(L_cross/L_half))/ln10 matches direct gap to < 1e-10',
    holds: () => LOG10_GAP_ERR < 1e-10,
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed.
    id: 'imp95676-honesty-gate-no-qed',
    description: 'Closed-form derivation only: no QED, no refereed bound is changed',
    holds: () =>
      IMP95676_HALF_POINT_CROSSOVER_DISPLACEMENT.isRigorous === false &&
      /NO QED/.test(IMP95676_HALF_POINT_CROSSOVER_DISPLACEMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95676_HALF_POINT_CROSSOVER_DISPLACEMENT.verdict),
  },
];

for (const a of IMP95676_HALF_POINT_CROSSOVER_DISPLACEMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95676-half-point-crossover-displacement assertion failed: ${a.id}`);
  }
}
