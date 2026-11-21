/**
 * @module imp-33817-d2-knee-grid-resolution-floor
 *
 * imp-33817 (accuracy, frontier-direction): imp-33771 laid the imp-33744 closed-form sigma-ramp
 * inflection (inverted to an N location, N*_cf ~ 3.33e9) beside the imp-33721 DIRECT sub-decade
 * D2-zero knee (N*_D2 ~ 3.38e9) and reported a residual log10 offset ~0.0066 (~1.5% in N). Its
 * verdict (F2) asserts that residual EXCEEDS the imp-33721 sub-decade grid resolution -- so the
 * offset is a genuine two-notion separation (sigmoid inflection vs exponent-ramp D2 zero) rather
 * than a discretization artifact of the D2-zero locator. But imp-33771 tested that claim only
 * against a HARDCODED window (gridRobustnessLog10 = 0.001), a prose round-number lifted from the
 * imp-33721 F2 robustness sweep; the grid-resolution FLOOR itself was never quantified. This
 * module quantifies it: it reproduces the imp-33721 quarter-decade OLS-exponent D2 zero-crossing
 * locator verbatim, re-runs it at the four imp-33721 robustness-sweep sub-bracket widths, extracts
 * the full-precision spread of the located log10 N* (the N-uncertainty of the knee induced purely
 * by the grid spacing), and confirms the imp-33771 ~1.5% residual sits an order of magnitude above
 * that floor -- by the margin the imp-33771 verdict claims.
 *
 * THE LOCATOR (identical estimator to imp-33721 / imp-33771 -- no fresh model, no fresh terms)
 * -----------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * Quarter-decade OLS local exponent on sub-brackets across [1e9, 1e11], first/second differences
 * D1/D2 on the sub-bracket centers, single log10-interpolated D2 zero-crossing = the knee.
 *
 * THE MEASUREMENT: the grid-resolution floor of the D2-zero locator
 * ----------------------------------------------------------------
 *   (a) LOCATE PER WIDTH. Run the locator at the four imp-33721 F2 robustness-sweep sub-bracket
 *       widths W in {0.25, 0.2, 0.125, 0.1}-decade (matched pts/decade), keeping every located
 *       log10 N* at FULL precision (imp-33721 rounded these to 4 decimals for its printed sweep, so
 *       the true spread was invisible). Each width yields exactly one D2 sign change.
 *   (b) FLOOR = SPREAD. The grid-resolution floor is the spread of those four log10 N* values: the
 *       full range (max - min), the half-range, and the population standard deviation. That spread
 *       is the knee N-uncertainty attributable purely to the grid spacing (the sigma model is fixed;
 *       only the sub-bracket width and sampling density vary).
 *   (c) MARGIN. Compare the imp-33771 closed-form-vs-D2 residual (|log10 gap| ~0.0066) against the
 *       floor: residual / floor for each of the three floor notions.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) THE FLOOR IS ~7e-4 IN log10, WELL INSIDE THE +/-0.001 WINDOW imp-33771 ASSUMED. The four
 *        robustness widths locate the knee at log10 N* in [9.52855, 9.52926]; the full range is
 *        ~7.13e-4, the half-range ~3.56e-4, the population stddev ~2.55e-4. So the hardcoded
 *        gridRobustnessLog10 = 0.001 imp-33771 tested against is a conservative round-up of the
 *        actual ~7e-4 spread -- the true resolution floor is even tighter than the assumed window.
 *   (M2) THE ~1.5% RESIDUAL EXCEEDS THE FLOOR BY ~AN ORDER OF MAGNITUDE. The imp-33771 residual
 *        |log10 gap| ~0.0066 is ~9.3x the full-range floor, ~18.5x the half-range, and ~25.9x the
 *        stddev. So the closed-form-vs-D2 offset clears the grid-resolution floor by ~an order of
 *        magnitude -- exactly the "exceeds the grid resolution by a comfortable margin" the
 *        imp-33771 F2 verdict claims. The offset is a genuine two-notion separation, NOT a
 *        discretization artifact of the D2-zero locator.
 *   (M3) THE MARGIN IS ROBUST TO THE FLOOR NOTION. Whether the floor is read as the full range, the
 *        half-range, or the stddev, the residual clears it by between ~9x and ~26x -- the "residual
 *        exceeds the grid resolution" conclusion does not hinge on which spread statistic is used.
 *
 * The punchline: the imp-33721 sub-decade D2-zero locator pins the knee to log10 N* ~ 9.5289 with a
 * grid-induced spread of only ~7e-4 in log10 (tighter than the +/-0.001 window imp-33771 assumed).
 * The imp-33771 closed-form-vs-D2 residual (~0.0066, ~1.5% in N) sits ~9-26x above that floor, so it
 * is a genuine sigmoid-vs-ramp two-notion separation, confirming the imp-33771 F2 verdict by the
 * margin it claimed.
 *
 * MEASUREMENT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33771-inflection-closed-form-vs-d2-zero-crosscheck (the ~1.5% residual + gridRobustnessLog10 literal)
 * @see imp-33721-sigma-ramp-inflection-subdecade (the sub-decade D2-zero locator + F2 robustness sweep)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed form sigma_infl = 1/2 - g_prime/(2 g^2))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';
import { IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK } from './imp-33771-inflection-closed-form-vs-d2-zero-crosscheck.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33721/imp-33771 exactly

// EXACT imp-33721/imp-33771 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// imp-33721 OLS local decay exponent p = -slope of ln sigma on ln N over [10^loD, 10^hiD].
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// imp-33721 sub-decade D2-zero locator (reproduced verbatim), keeping FULL-precision log10 N*.
function subDecadeD2Zero(W, ptsPerDecade) {
  const edges = [];
  for (let d = 9.0; d <= 11.0 + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar };
}

// (a) locate the knee at the four imp-33721 F2 robustness-sweep widths, full precision.
const SWEEP_WIDTHS = [
  { W: 0.25, ppd: 40 },
  { W: 0.2, ppd: 50 },
  { W: 0.125, ppd: 80 },
  { W: 0.1, ppd: 100 },
];
const SWEEP = SWEEP_WIDTHS.map(({ W, ppd }) => {
  const r = subDecadeD2Zero(W, ppd);
  return { W, ppd, signChanges: r.signChanges, log10Nstar: r.cstar };
});
const STARS = SWEEP.map((s) => s.log10Nstar);
const PRIMARY_STAR = SWEEP[0].log10Nstar; // W = 0.25 primary grid (imp-33721 published value)

// (b) floor = spread of the located log10 N* across the four grids.
const STAR_MIN = Math.min(...STARS);
const STAR_MAX = Math.max(...STARS);
const STAR_MEAN = STARS.reduce((a, b) => a + b, 0) / STARS.length;
const FLOOR_FULL_RANGE = STAR_MAX - STAR_MIN; // ~7.13e-4 in log10
const FLOOR_HALF_RANGE = FLOOR_FULL_RANGE / 2; // ~3.56e-4
const FLOOR_STDDEV = Math.sqrt(STARS.reduce((a, b) => a + (b - STAR_MEAN) ** 2, 0) / STARS.length); // ~2.55e-4

// (c) residual = the imp-33771 published closed-form-vs-D2 log10 gap; margin = residual / floor.
const RESIDUAL_LOG10_GAP = Math.abs(IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK.log10Gap_cf_vs_d2); // ~0.0066
const GRID_ROBUSTNESS_WINDOW = IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK.gridRobustnessLog10; // 0.001 (assumed)
const MARGIN_VS_FULL_RANGE = RESIDUAL_LOG10_GAP / FLOOR_FULL_RANGE; // ~9.3x
const MARGIN_VS_HALF_RANGE = RESIDUAL_LOG10_GAP / FLOOR_HALF_RANGE; // ~18.5x
const MARGIN_VS_STDDEV = RESIDUAL_LOG10_GAP / FLOOR_STDDEV; // ~25.9x

export const IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR = {
  id: 'imp-33817',
  proofSection: 'S-frontier',
  question:
    "imp-33771's F2 verdict asserts its ~1.5% closed-form-vs-D2-knee residual (log10 gap ~0.0066) " +
    'EXCEEDS the imp-33721 sub-decade D2 grid resolution, making the offset a genuine two-notion ' +
    'separation rather than a discretization artifact -- but it tested that only against a hardcoded ' +
    'window (0.001), never quantifying the floor. Quantify the imp-33721 quarter-decade D2-zero ' +
    'locator resolution floor (the knee N-uncertainty from the grid spacing) and confirm the ~1.5% ' +
    'residual sits above it by the claimed margin. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the full-precision spread (full range, half-range, population stddev) of the imp-33721 ' +
    'sub-decade D2-zero knee log10 N* across the four F2 robustness-sweep sub-bracket widths ' +
    '(the grid-resolution floor), and the margin by which the imp-33771 closed-form-vs-D2 residual ' +
    '(|log10 gap| ~0.0066) exceeds that floor',
  // (a) per-width located knees (full precision)
  sweep: SWEEP.map((s) => ({ widthDecades: s.W, ptsPerDecade: s.ppd, signChanges: s.signChanges, log10Nstar: +s.log10Nstar.toFixed(7) })),
  primaryLog10Nstar: +PRIMARY_STAR.toFixed(7), // W=0.25 -> matches imp-33721 published 9.5285
  meanLog10Nstar: +STAR_MEAN.toFixed(7),
  // (b) the grid-resolution floor
  floorFullRangeLog10: +FLOOR_FULL_RANGE.toExponential(4), // ~7.13e-4
  floorHalfRangeLog10: +FLOOR_HALF_RANGE.toExponential(4), // ~3.56e-4
  floorStdDevLog10: +FLOOR_STDDEV.toExponential(4), // ~2.55e-4
  imp33771AssumedWindowLog10: GRID_ROBUSTNESS_WINDOW, // 0.001 (the hardcoded round-up)
  // (c) residual and margin
  residualLog10Gap: +RESIDUAL_LOG10_GAP.toFixed(4), // ~0.0066 (imp-33771 closed-form-vs-D2)
  marginVsFullRange: +MARGIN_VS_FULL_RANGE.toFixed(2), // ~9.3x
  marginVsHalfRange: +MARGIN_VS_HALF_RANGE.toFixed(2), // ~18.5x
  marginVsStdDev: +MARGIN_VS_STDDEV.toFixed(2), // ~25.9x
  finding: {
    M1_floor_is_7e4_inside_the_assumed_1e3_window:
      'The four F2 robustness widths locate the knee at log10 N* in [' + STAR_MIN.toFixed(5) + ', ' +
      STAR_MAX.toFixed(5) + ']; the full range is ~7.13e-4, the half-range ~3.56e-4, the population ' +
      'stddev ~2.55e-4. So the hardcoded gridRobustnessLog10 = 0.001 imp-33771 tested against is a ' +
      'conservative round-up of the actual ~7e-4 spread -- the true resolution floor is tighter than ' +
      'the assumed window.',
    M2_residual_exceeds_floor_by_order_of_magnitude:
      'The imp-33771 residual |log10 gap| ~0.0066 is ~9.3x the full-range floor, ~18.5x the ' +
      'half-range, and ~25.9x the stddev. The closed-form-vs-D2 offset clears the grid-resolution ' +
      'floor by ~an order of magnitude -- exactly the comfortable margin the imp-33771 F2 verdict ' +
      'claims -- so it is a genuine sigmoid-vs-ramp two-notion separation, NOT a discretization ' +
      'artifact of the D2-zero locator.',
    M3_margin_robust_to_floor_notion:
      'Whether the floor is read as the full range, the half-range, or the stddev, the residual ' +
      'clears it by ~9x to ~26x -- the "residual exceeds the grid resolution" conclusion does not ' +
      'hinge on which spread statistic is used.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Reproducing the imp-33721 quarter-decade ' +
    'D2-zero locator at its four F2 robustness-sweep widths pins the knee to log10 N* ~ 9.5289 with ' +
    'a grid-induced spread of only ~7.13e-4 in log10 (full range; half-range ~3.56e-4, stddev ' +
    '~2.55e-4) -- tighter than the +/-0.001 window imp-33771 assumed. The imp-33771 ' +
    'closed-form-vs-D2 residual (|log10 gap| ~0.0066, ~1.5% in N) sits ~9.3x above that full-range ' +
    'floor (~18.5x the half-range, ~25.9x the stddev), so it EXCEEDS the grid resolution by ~an ' +
    'order of magnitude -- confirming the imp-33771 F2 verdict by the margin it claimed: the offset ' +
    'is a genuine sigmoid-inflection-vs-exponent-ramp-D2 two-notion separation, not a discretization ' +
    'artifact. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33771 (~1.5% closed-form-vs-D2 residual + gridRobustnessLog10 literal); imp-33721 ' +
    '(sub-decade D2-zero locator + F2 robustness sweep); imp-33744 (closed form sigma_infl); ' +
    'imp-33582 (six-decade exponent ladder); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR_ASSERTIONS = [
  {
    // Reuse gate: the reproduced primary (W=0.25) knee matches the published imp-33721
    // inflectionLog10Nstar to its printed 4 decimals -- proving the IDENTICAL locator is in use.
    id: 'imp33817-reuses-imp33721-locator',
    description: 'reproduced W=0.25 knee matches the published imp-33721 inflectionLog10Nstar to 4 decimals',
    holds: () =>
      SWEEP.every((s) => s.signChanges === 1) &&
      Math.abs(+PRIMARY_STAR.toFixed(4) - IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar) < 1e-9,
  },
  {
    // (M1): the quantified floor is a small positive number, below the imp-33771 hardcoded 0.001
    // window it was tested against -- the assumed window was a conservative round-up.
    id: 'imp33817-floor-below-assumed-window',
    description: 'grid-resolution floor (full range ~7e-4) is positive and below the imp-33771 assumed 0.001 window',
    holds: () =>
      FLOOR_FULL_RANGE > 0 &&
      FLOOR_FULL_RANGE < GRID_ROBUSTNESS_WINDOW &&
      FLOOR_STDDEV > 0 &&
      FLOOR_STDDEV < FLOOR_HALF_RANGE &&
      FLOOR_HALF_RANGE < FLOOR_FULL_RANGE,
  },
  {
    // (M2): the imp-33771 residual exceeds the floor by ~an order of magnitude (> 5x the full range).
    id: 'imp33817-residual-exceeds-floor',
    description: 'imp-33771 residual |log10 gap| ~0.0066 exceeds the full-range floor by > 5x (order of magnitude)',
    holds: () =>
      RESIDUAL_LOG10_GAP > FLOOR_FULL_RANGE &&
      MARGIN_VS_FULL_RANGE > 5 &&
      Math.abs(MARGIN_VS_FULL_RANGE - 9.3) < 1.0,
  },
  {
    // (M3): the "exceeds the floor" conclusion holds for all three spread notions.
    id: 'imp33817-margin-robust-to-floor-notion',
    description: 'residual exceeds the full-range, half-range and stddev floors (all margins > 5x)',
    holds: () =>
      MARGIN_VS_FULL_RANGE > 5 &&
      MARGIN_VS_HALF_RANGE > 5 &&
      MARGIN_VS_STDDEV > 5 &&
      MARGIN_VS_HALF_RANGE > MARGIN_VS_FULL_RANGE &&
      MARGIN_VS_STDDEV > MARGIN_VS_HALF_RANGE,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp33817-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR.isRigorous === false &&
      /NO QED/.test(IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR.verdict),
  },
];

for (const a of IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33817-d2-knee-grid-resolution-floor assertion failed: ${a.id}`);
  }
}
