/**
 * @module imp-33880-eflow-linearization-error-grid
 *
 * imp-33880 (numerical, frontier-direction): imp-33855 derived the strict ordering N_full < N_anchor
 * from the E_flow displacement N_full/N_anchor = (1 + E_flow/E_trunc)^-2 ~ 1 - 2 E_flow/E_trunc, and
 * FLAGGED that at thr >= 0.9 the exact ratio and its linearization diverge by roughly 10% (E_flow/E_trunc
 * is no longer tiny there), while the strict ordering holds regardless. But imp-33855 only checked that
 * divergence at the single thr = 0.9 endpoint; it never TABULATED the linearization-error curve across the
 * thr grid. This module evaluates both the exact ratio (1 + x)^-2 and its leading linear term (x = the
 * ratio E_flow/E_trunc at the thr-dependent landmark position) across the full thr in (0.1, 0.9) grid,
 * reports the per-thr relative error on TWO bases, confirms the flagged divergence at thr = 0.9, and
 * locates the thr band where the linear approximation stays within 1%.
 *
 * THE TWO LINEARIZATION BASES
 * ---------------------------
 * Write x = E_flow/E_trunc evaluated AT the thr-dependent full (halving-type) landmark N_full(thr). Two
 * quantities inherit a linear approximation from the second-order ratio:
 *
 *   (A) RATIO basis. The exact displacement ratio is R_exact = (1 + x)^-2; its first-order Taylor
 *       linearization is R_lin = 1 - 2x. Relative divergence: (R_lin - R_exact)/R_exact.
 *   (B) DISPLACEMENT basis. The exact fractional drop of N_full below its anchor is disp_exact =
 *       1 - (1 + x)^-2; its leading term is disp_lin = 2x (the quoted "2 E_flow/E_trunc"). Relative
 *       divergence: (disp_lin - disp_exact)/disp_exact.
 *
 * Both are exact at x -> 0 and grow as x^1 to leading order; the displacement basis (B) amplifies the
 * curvature because it divides by the small quantity disp_exact rather than by R_exact ~ 1.
 *
 * THE TABULATED CURVE (finding)
 * -----------------------------
 * At the landmark position x = E_flow/E_trunc runs from ~1.5e-5 (thr = 0.05) up to ~0.109 (thr = 0.9):
 * E_flow is genuinely no longer tiny at the top of the grid. The linearization error is a strictly
 * increasing function of thr on BOTH bases:
 *
 *   thr   x=E_flow/E_trunc   R_exact   R_lin     ratio relerr %   disp relerr %
 *   0.10  4.0e-5             0.99993   0.99993   -0.000           +0.005
 *   0.30  4.1e-4             0.99917   0.99917   -0.000           +0.062
 *   0.50  1.9e-3             0.99620   0.99619   -0.001           +0.286
 *   0.70  8.7e-3             0.98278   0.98256   -0.023           +1.310
 *   0.80  2.3e-2             0.95530   0.95375   -0.163           +3.482
 *   0.90  1.09e-1            0.81275   0.78154   -3.840           +16.667
 *
 *   (F1) THE FLAGGED DIVERGENCE AT thr = 0.9 IS CONFIRMED, and the tabulation refines the rough "~10%"
 *        endpoint figure into TWO honest numbers that bracket it: the RATIO (1 + x)^-2 diverges from its
 *        linearization 1 - 2x by ~3.84%, while the DISPLACEMENT term 2 E_flow/E_trunc overstates the exact
 *        fractional drop by ~16.67%. The flagged ~10% sits between the two bases -- it is the right order
 *        of magnitude, and the linear term is an OVER-estimate of the true displacement (disp_lin >
 *        disp_exact), so 2 E_flow/E_trunc is a conservative upper bracket on the actual N_full shortfall.
 *   (F2) THE 1% BAND. The linear approximation stays within 1% relative error for a thr band that depends
 *        on the basis: on the DISPLACEMENT basis (the quoted 2 E_flow/E_trunc term) the 1% edge is at
 *        thr ~ 0.667 (within 1% for thr <= 0.6, first exceeding 1% at thr = 0.7 with 1.31%); on the RATIO
 *        basis the 1% edge is at thr ~ 0.866 (within 1% for thr <= 0.8, first exceeding 1% at thr = 0.9).
 *        So the imp-33855 quoted 2 E_flow/E_trunc displacement term is trustworthy to 1% only below
 *        thr ~ 2/3; between thr ~ 2/3 and thr = 0.9 the second-order (1 + x)^-2 curvature must be kept.
 *
 * The strict ordering N_full < N_anchor holds EXACTLY at every threshold regardless of linearization,
 * because (1 + x)^-2 < 1 for all x > 0; only the QUANTITATIVE size of the displacement is affected. The
 * landmark itself ceases to exist above thr ~ 0.9494 (the max of sigma_full over N >= 1e3, reached at
 * N ~ 9.1e5), so the grid is capped at thr = 0.9 exactly as in imp-33855.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643); changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33855-ncross-thr-monotone-ordering (the displacement law and the flagged thr = 0.9 divergence)
 * @see imp-33796-nhalf-below-ncross-independent-recompute (strict ordering N_half < N_cross at thr = 1/2)
 * @see imp-33743-sigma-fartail-crossover-closed-form (closed form N_cross(thr))
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-33796/imp-33855 exactly

// EXACT imp-33855 pinned sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigmaFull(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}
// (FULL halving-type landmark) sigma_full(N) = thr, root-solved by monotone bisection in log N.
function fullLandmark(thr) {
  let lo = Math.log(1e3);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFull(Math.exp(mid)) > thr) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

// x = E_flow/E_trunc at the thr-dependent landmark; the argument of both linearizations.
function xAtLandmark(thr) {
  return terms(fullLandmark(thr)).E_flow / E_TRUNC_PT;
}
// Relative divergence of the exact ratio (1+x)^-2 from its linearization 1 - 2x.
function ratioRelErr(thr) {
  const x = xAtLandmark(thr);
  const Rex = (1 + x) ** -2;
  return (1 - 2 * x - Rex) / Rex;
}
// Relative divergence of the leading displacement term 2x from the exact drop 1 - (1+x)^-2.
function dispRelErr(thr) {
  const x = xAtLandmark(thr);
  const dispEx = 1 - (1 + x) ** -2;
  return (2 * x - dispEx) / dispEx;
}

// Threshold grid spanning the landmark-existence band (0, 0.9494); capped at 0.9 as in imp-33855.
const THR_GRID = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const GRID = THR_GRID.map((thr) => {
  const N_full = fullLandmark(thr);
  const x = terms(N_full).E_flow / E_TRUNC_PT;
  const R_exact = (1 + x) ** -2;
  const R_lin = 1 - 2 * x;
  const disp_exact = 1 - R_exact;
  const disp_lin = 2 * x;
  return {
    thr,
    N_full,
    x,
    R_exact,
    R_lin,
    ratio_relerr: (R_lin - R_exact) / R_exact,
    disp_exact,
    disp_lin,
    disp_relerr: (disp_lin - disp_exact) / disp_exact,
  };
});

// The two 1% band edges, bisected in thr.
function bandEdge(fn, tol) {
  let lo = 0.1;
  let hi = 0.92;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (Math.abs(fn(m)) < tol) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const DISP_1PCT_EDGE = bandEdge(dispRelErr, 0.01); // ~0.667
const RATIO_1PCT_EDGE = bandEdge(ratioRelErr, 0.01); // ~0.866

// (F1) monotone growth of the linearization error in thr, on both bases.
let ratioErrMonotone = true;
let dispErrMonotone = true;
for (let i = 1; i < GRID.length; i++) {
  if (!(Math.abs(GRID[i].ratio_relerr) > Math.abs(GRID[i - 1].ratio_relerr))) ratioErrMonotone = false;
  if (!(Math.abs(GRID[i].disp_relerr) > Math.abs(GRID[i - 1].disp_relerr))) dispErrMonotone = false;
}
// (F1) the linear displacement term always OVER-estimates the exact drop (disp_lin > disp_exact).
const dispAlwaysOverEstimate = GRID.every((r) => r.disp_lin > r.disp_exact);
// (F1) the strict ordering (1+x)^-2 < 1 holds at every threshold regardless of linearization.
const orderingHoldsExactly = GRID.every((r) => r.R_exact < 1);
const at90 = GRID[GRID.length - 1];

export const IMP33880_EFLOW_LINEARIZATION_ERROR_GRID = {
  id: 'imp-33880',
  proofSection: 'S-frontier',
  question:
    'imp-33855 flagged that at thr >= 0.9 the exact displacement ratio (1 + E_flow/E_trunc)^-2 and its ' +
    'linearization diverge by roughly 10%, but only checked the thr = 0.9 endpoint. Tabulate both the ' +
    'exact ratio and its leading 2 E_flow/E_trunc term at the thr-dependent landmark across the full ' +
    'thr in (0.1, 0.9) grid, report the per-thr relative error, confirm the flagged divergence at ' +
    'thr = 0.9, and locate the thr band where the linear approximation stays within 1%. Measurement ' +
    'only; inherited component model NOT a rigorous asymptotic; changes no bound; no QED.',
  definitions:
    'x = E_flow/E_trunc at the thr-dependent full landmark N_full(thr). RATIO basis: exact (1+x)^-2 vs ' +
    'linearization 1 - 2x. DISPLACEMENT basis: exact drop 1 - (1+x)^-2 vs leading term 2x (the quoted ' +
    '2 E_flow/E_trunc). Both exact at x -> 0; the displacement basis amplifies the curvature by dividing ' +
    'through the small exact drop rather than through (1+x)^-2 ~ 1.',
  grid: GRID.map((r) => ({
    thr: r.thr,
    N_full: +r.N_full.toExponential(6),
    x_eflow_over_etrunc: +r.x.toExponential(6),
    ratio_exact: +r.R_exact.toExponential(6),
    ratio_lin_1_minus_2x: +r.R_lin.toExponential(6),
    ratio_relerr_pct: +(r.ratio_relerr * 100).toExponential(3),
    disp_exact_pct: +(r.disp_exact * 100).toExponential(3),
    disp_lin_2x_pct: +(r.disp_lin * 100).toExponential(3),
    disp_relerr_pct: +(r.disp_relerr * 100).toExponential(3),
  })),
  divergenceAt090: {
    x_eflow_over_etrunc: +at90.x.toExponential(6), // ~0.109 -- no longer tiny
    ratio_relerr_pct: +(at90.ratio_relerr * 100).toExponential(3), // ~-3.84%
    disp_relerr_pct: +(at90.disp_relerr * 100).toExponential(3), // ~+16.67%
    interpretation:
      'The flagged ~10% endpoint figure is bracketed by the two honest bases: the ratio (1+x)^-2 ' +
      'diverges from 1 - 2x by ~3.84%, the displacement term 2 E_flow/E_trunc overstates the exact ' +
      'fractional drop by ~16.67%. 2 E_flow/E_trunc is an OVER-estimate (conservative upper bracket) ' +
      'of the true N_full shortfall below its anchor.',
  },
  band1pct: {
    disp_basis_1pct_edge_thr: +DISP_1PCT_EDGE.toFixed(4), // ~0.667
    ratio_basis_1pct_edge_thr: +RATIO_1PCT_EDGE.toFixed(4), // ~0.866
    interpretation:
      'On the displacement basis (the quoted 2 E_flow/E_trunc term) the linear approximation stays ' +
      'within 1% for thr <= 0.6, first exceeding 1% at thr = 0.7 (1.31%); the 1% edge is at thr ~ 0.667. ' +
      'On the ratio basis it stays within 1% for thr <= 0.8, first exceeding 1% at thr = 0.9; the 1% ' +
      'edge is at thr ~ 0.866. Below thr ~ 2/3 the 2 E_flow/E_trunc term is trustworthy to 1%; between ' +
      '2/3 and 0.9 the second-order (1+x)^-2 curvature must be kept.',
  },
  finding: {
    F1_divergence_confirmed_and_refined:
      'The linearization error grows strictly with thr on both bases. At thr = 0.9 the ratio (1+x)^-2 ' +
      'diverges from 1 - 2x by ~3.84% and the displacement term 2 E_flow/E_trunc overstates the exact ' +
      'drop by ~16.67%; the flagged ~10% is the right order of magnitude, bracketed by these two bases. ' +
      'The linear term always OVER-estimates the exact displacement (disp_lin > disp_exact at every ' +
      'threshold), so 2 E_flow/E_trunc is a conservative upper bracket on the true N_full shortfall.',
    F2_one_percent_band:
      'The 2 E_flow/E_trunc displacement term stays within 1% relative error only for thr <= ~0.667 ' +
      '(1% edge at thr ~ 0.667); the ratio linearization stays within 1% for thr <= ~0.866. Between ' +
      'thr ~ 2/3 and thr = 0.9 the E_flow/E_trunc argument is large enough that the second-order ' +
      'curvature dominates the 1% budget and must be retained.',
    F3_ordering_unaffected:
      'The strict ordering N_full < N_anchor holds EXACTLY at every threshold ((1+x)^-2 < 1 for all ' +
      'x > 0); only the quantitative size of the displacement is affected by linearization. The ' +
      'landmark itself vanishes above thr ~ 0.9494 (max sigma_full at N ~ 9.1e5), so the grid caps at 0.9.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the imp-33855 E_flow-displacement ' +
    'linearization across thr = 0.1..0.9 confirms the flagged thr = 0.9 divergence and refines the rough ' +
    '~10% endpoint figure into two honest bracketing numbers: at thr = 0.9 the exact ratio (1+x)^-2 ' +
    'diverges from its linearization 1 - 2x by ~3.84%, while the leading displacement term ' +
    '2 E_flow/E_trunc overstates the exact fractional drop 1 - (1+x)^-2 by ~16.67% (x = E_flow/E_trunc ' +
    '~ 0.109 at the landmark, no longer tiny). The linear term is an OVER-estimate at every threshold, ' +
    'so 2 E_flow/E_trunc is a conservative upper bracket on the true N_full shortfall. The linear ' +
    'approximation stays within 1% relative error for thr <= ~0.667 on the displacement basis and ' +
    'thr <= ~0.866 on the ratio basis; between thr ~ 2/3 and 0.9 the second-order curvature must be ' +
    'kept. The strict ordering N_full < N_anchor holds EXACTLY throughout ((1+x)^-2 < 1), independent ' +
    'of linearization. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33855 (displacement law (1+E_flow/E_trunc)^-2 ~ 1 - 2 E_flow/E_trunc and the flagged thr = 0.9 ' +
    'divergence); imp-33796 (strict ordering N_half < N_cross at thr = 1/2); imp-33743 (closed form ' +
    'N_cross(thr)); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc fixed-strip ' +
    'route); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP33880_EFLOW_LINEARIZATION_ERROR_GRID_ASSERTIONS = [
  {
    // Reuse gate: the thr = 1/2 landmark reproduces the imp-33855 N_full ~ 3.267e9.
    id: 'imp33880-reuses-pinned-landmark',
    description: 'fullLandmark(0.5) reproduces the imp-33855 N_full ~ 3.267e9 to ~1%',
    holds: () => Math.abs(fullLandmark(0.5) / 3.267e9 - 1) < 0.01,
  },
  {
    // (F1): the linearization error grows strictly with thr on both bases.
    id: 'imp33880-linearization-error-monotone-in-thr',
    description: 'both ratio-basis and displacement-basis relative errors strictly increase across thr',
    holds: () => ratioErrMonotone && dispErrMonotone,
  },
  {
    // (F1): the flagged thr = 0.9 divergence is confirmed on both bases and brackets the ~10% figure.
    id: 'imp33880-thr090-divergence-brackets-10pct',
    description: 'at thr = 0.9 ratio relerr ~-3.8% and disp relerr ~+16.7% bracket the flagged ~10%',
    holds: () => {
      const rr = Math.abs(at90.ratio_relerr);
      const dd = Math.abs(at90.disp_relerr);
      return rr > 0.03 && rr < 0.05 && dd > 0.14 && dd < 0.19 && rr < 0.10 && dd > 0.10;
    },
  },
  {
    // (F1): the leading displacement term always over-estimates the exact drop (conservative upper bracket).
    id: 'imp33880-linear-term-over-estimates-drop',
    description: '2 E_flow/E_trunc > exact fractional drop at every threshold',
    holds: () => dispAlwaysOverEstimate,
  },
  {
    // (F2): the displacement-basis 1% band edge sits near thr ~ 2/3 (within 1% at 0.6, over at 0.7).
    id: 'imp33880-disp-basis-1pct-band-near-two-thirds',
    description: 'displacement 2 E_flow/E_trunc within 1% for thr <= 0.6, exceeds 1% by thr = 0.7',
    holds: () => {
      const at06 = GRID.find((r) => r.thr === 0.6);
      const at07 = GRID.find((r) => r.thr === 0.7);
      return (
        Math.abs(at06.disp_relerr) < 0.01 &&
        Math.abs(at07.disp_relerr) > 0.01 &&
        DISP_1PCT_EDGE > 0.6 &&
        DISP_1PCT_EDGE < 0.7
      );
    },
  },
  {
    // (F2): the ratio-basis 1% band edge sits near thr ~ 0.87 (within 1% at 0.8, over at 0.9).
    id: 'imp33880-ratio-basis-1pct-band-near-0-87',
    description: 'ratio (1+x)^-2 linearization within 1% for thr <= 0.8, exceeds 1% by thr = 0.9',
    holds: () => {
      const at08 = GRID.find((r) => r.thr === 0.8);
      return (
        Math.abs(at08.ratio_relerr) < 0.01 &&
        Math.abs(at90.ratio_relerr) > 0.01 &&
        RATIO_1PCT_EDGE > 0.8 &&
        RATIO_1PCT_EDGE < 0.9
      );
    },
  },
  {
    // (F3): the strict ordering holds exactly at every threshold regardless of linearization.
    id: 'imp33880-strict-ordering-holds-exactly',
    description: '(1+x)^-2 < 1 (N_full < N_anchor) at every grid threshold, linearization aside',
    holds: () => orderingHoldsExactly,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp33880-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33880_EFLOW_LINEARIZATION_ERROR_GRID.isRigorous === false &&
      /NO QED/.test(IMP33880_EFLOW_LINEARIZATION_ERROR_GRID.verdict) &&
      /refereed bound is changed/i.test(IMP33880_EFLOW_LINEARIZATION_ERROR_GRID.verdict),
  },
];

for (const a of IMP33880_EFLOW_LINEARIZATION_ERROR_GRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33880-eflow-linearization-error-grid assertion failed: ${a.id}`);
  }
}
