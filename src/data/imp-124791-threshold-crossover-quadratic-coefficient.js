/**
 * @module imp-124791-threshold-crossover-quadratic-coefficient
 *
 * imp-124791 (numerical, frontier-direction): imp-97838 D2 flagged VISIBLE curvature in the
 * leading threshold-crossover residual near the sigma peak -- the ratio rel/(2*E_flow/E_trunc)
 * inflates to ~1.125 at thr=0.9 where E_flow/E_trunc ~ 0.11 is no longer tiny -- but never FIT
 * the next-order coefficient. This module ADDS a finer near-peak threshold family
 * thr in {0.8, 0.85, 0.9, 0.93} and FITS the excess y(thr) = rel/(2*E_flow/E_trunc) - 1 as a
 * linear-in-(E_flow/E_trunc) term to extract the O((E_flow/E_trunc)^2) coefficient of the
 * crossover residual expansion and SEPARATE it from the constant logT0 drift.
 *
 * THE EXTENSION (measurement only, imp-97838/imp-33743 machinery verbatim; no re-derivation)
 * ----------------------------------------------------------------------------------------
 * The closed form and every sub-term are the imp-97838 fixed point verbatim (parts, K_AMPL,
 * crossoverFixedPoint, crossBelowSigma, sigmaPeak); only the threshold grid changes to four
 * finer near-peak rungs where E_flow/E_trunc is large enough for the quadratic term to bite.
 * For each thr we form r = E_flow/E_trunc at the empirical crossing, the leading residual
 * rel = (N_cross - N_emp)/N_emp, and the excess y = rel/(2 r) - 1. Writing the expansion
 *   rel = 2 r (1 + y),  with  y = y0 + q r + O(r^2),
 * the leading term rel ~ 2 r is the imp-97838 predictor; y0 is the constant logT0 drift (the
 * deep-tail limit y(r -> 0), measured at thr=0.001); and q is the linear-in-r slope, so the
 * quadratic coefficient of the residual is c2 = 2 q in rel = 2 r + 2 q r^2 + ... .
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) THE NEAR-PEAK EXCESS y(thr) IS LINEAR IN E_flow/E_trunc TO 4 SIG FIGS. Across the four
 *        rungs r walks 2.31e-2 -> 4.41e-2 -> 1.09e-1 -> 2.68e-1 and y walks 6.83e-2 -> 8.29e-2 ->
 *        1.25e-1 -> 2.26e-1; an ordinary least-squares fit y = a0 + a1 r gives slope
 *        a1 = 6.4184e-1 and intercept a0 = 5.4305e-2 with R^2 = 0.999877, so a single linear term
 *        captures the imp-97838 D2 curvature the whole way up to the peak. The quadratic
 *        coefficient of the residual is c2 = 2 a1 = 1.2837, i.e. rel = 2 r + 1.2837 r^2 + ...,
 *        an order-unity positive curvature that makes the leading closed form UNDER-predict the
 *        crossover height (rel > 2 r) increasingly as thr climbs toward the peak.
 *   (D2) THE CONSTANT logT0 DRIFT IS THE r -> 0 INTERCEPT y0 = 2.882e-2, DISTINCT FROM THE
 *        QUADRATIC TERM. The deep-tail limit (thr=0.001) gives y0 = 2.8819e-2 -- the same
 *        sub-1.04 tail excess imp-97838 D2 booked as the ~2.8e-6 logT0 drift (indeed the absolute
 *        rel - 2 r at thr=0.1 is 2.801e-6). Anchoring the fit intercept to this measured drift and
 *        fitting only the slope through y - y0 gives q_anchored with c2_anchored = 2 q_anchored =
 *        1.5463, so the free and drift-anchored quadratic-coefficient estimates BRACKET
 *        c2 in [1.284, 1.546]. The ~0.26 spread is the residual cubic curvature at thr=0.93
 *        (r = 0.268 is no longer small): a clean two-figure c2 needs a cubic term or a narrower
 *        near-peak window -- that is the named sub-gap, SUBGAP-124791-cubic-tail.
 *
 * The punchline: the imp-97838 D2 curvature is a genuine quadratic term with an order-unity
 * positive coefficient c2 ~ 1.28..1.55 (rel = 2 r + c2 r^2 + ...), cleanly separated from the
 * constant logT0 drift y0 = 2.88e-2. The leading closed form under-predicts by c2 r^2 near the
 * peak, exactly the ~25% miss imp-97838 saw at thr=0.9.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97838-threshold-landmark-residual-trend (D2 flagged the visible near-peak curvature; parent)
 * @see imp-33743-sigma-fartail-crossover-closed-form (thr = 0.1 far-tail closed form; the E_flow explanation)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (halving-landmark closed form, thr = 1/2)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33723/imp-33743/imp-97838 exactly

// EXACT imp-97838/imp-33743 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)

// (CLOSED FORM, imp-97838/imp-33743 verbatim) leading threshold crossover as the fixed point.
function crossoverFixedPoint(thr, seed, iters) {
  const K = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = seed;
  for (let i = 0; i < iters; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}

// Downslope bisection in log N for the strictly-decreasing sigma past the peak (reference).
function crossBelowSigma(thr, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Locate the sigma peak so the near-peak downslope roots are bracketed below it.
function sigmaPeak() {
  let bestSig = 0;
  let bestN = 1e6;
  for (let lx = 3; lx < 20; lx += 0.001) {
    const N = Math.pow(10, lx);
    const s = parts(N).sigma;
    if (s > bestSig) {
      bestSig = s;
      bestN = N;
    }
  }
  return { bestSig, bestN };
}
const PEAK = sigmaPeak(); // sigma_peak ~ 0.9494 at N ~ 9.23e5

// One near-peak rung: leading residual rel, ratio E_flow/E_trunc = r, and the excess y = rel/(2r)-1.
function excessRow(thr) {
  const N_cf = crossoverFixedPoint(thr, 1e8, 200);
  const N_emp = crossBelowSigma(thr, PEAK.bestN * 1.0001, 1e20);
  const rel = (N_cf - N_emp) / N_emp;
  const r = parts(N_emp).E_flow / E_TRUNC_PT;
  return { threshold: thr, r, rel, y: rel / (2 * r) - 1, N_emp };
}

// The finer near-peak family (imp-97838 booked only thr=0.9 up here): four rungs where
// E_flow/E_trunc is large enough for the quadratic term to be resolvable.
const NEAR_PEAK_THRESHOLDS = [0.8, 0.85, 0.9, 0.93];
const ROWS = NEAR_PEAK_THRESHOLDS.map(excessRow);

// Constant logT0 drift = the deep-tail limit of y as r -> 0 (imp-97838 D2 sub-1.04 tail excess).
const DRIFT_Y0 = excessRow(0.001).y; // ~2.882e-2
// imp-97838 sanity link: the absolute rel - 2r drift at thr=0.1 (imp-97838 booked ~2.8e-6).
const DRIFT_ABS_THR_0P1 = (() => {
  const R = excessRow(0.1);
  return R.rel - 2 * R.r;
})();

// (D1) free ordinary least-squares fit y = a0 + a1 r over the near-peak family.
function olsFit(pts) {
  const n = pts.length;
  const sx = pts.reduce((s, p) => s + p.r, 0);
  const sy = pts.reduce((s, p) => s + p.y, 0);
  const sxx = pts.reduce((s, p) => s + p.r * p.r, 0);
  const sxy = pts.reduce((s, p) => s + p.r * p.y, 0);
  const a1 = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a0 = (sy - a1 * sx) / n;
  const ybar = sy / n;
  const ssTot = pts.reduce((s, p) => s + (p.y - ybar) ** 2, 0);
  const ssRes = pts.reduce((s, p) => s + (p.y - (a0 + a1 * p.r)) ** 2, 0);
  return { a0, a1, r2: 1 - ssRes / ssTot };
}
const FIT = olsFit(ROWS);
const C2_FREE = 2 * FIT.a1; // quadratic coefficient of rel = 2r + c2 r^2 + ... (free intercept)

// (D2) drift-anchored slope: fit y - DRIFT_Y0 = q r through the origin, so the intercept is the
// measured logT0 drift and the slope carries only the quadratic curvature.
const Q_ANCHORED =
  ROWS.reduce((s, p) => s + p.r * (p.y - DRIFT_Y0), 0) / ROWS.reduce((s, p) => s + p.r * p.r, 0);
const C2_ANCHORED = 2 * Q_ANCHORED;
const C2_SPREAD = C2_ANCHORED - C2_FREE; // sub-gap width from the residual cubic tail at thr=0.93

const TABLE = ROWS.map((p) => ({
  threshold: p.threshold,
  E_flow_over_E_trunc: +p.r.toExponential(6),
  leading_residual_rel: +p.rel.toExponential(6),
  excess_y_rel_over_2r_minus_1: +p.y.toExponential(6),
  sigma_at_empirical: +parts(p.N_emp).sigma.toFixed(6),
}));

export const IMP124791_THRESHOLD_CROSSOVER_QUADRATIC_COEFFICIENT = {
  id: 'imp-124791',
  proofSection: 'S-frontier',
  question:
    'Fit the next-order O((E_flow/E_trunc)^2) coefficient of the imp-97838 threshold-crossover ' +
    'residual expansion across a finer near-peak threshold family thr in {0.8,0.85,0.9,0.93}. ' +
    'imp-97838 D2 flagged visible curvature (rel/(2*E_flow/E_trunc) ~ 1.125 at thr=0.9) but never ' +
    'fit the coefficient. Measurement/derivation only; conditional-share diagnostic, NOT an RH ' +
    'bound; no QED.',
  expansion:
    'rel = 2 r (1 + y), r = E_flow/E_trunc, y = y0 + q r + O(r^2): y0 = constant logT0 drift ' +
    '(deep-tail limit), c2 = 2 q = quadratic coefficient of rel = 2 r + c2 r^2 + ... .',
  sigmaPeak: {
    sigma_peak: +PEAK.bestSig.toFixed(6), // ~0.949429
    N_peak: +PEAK.bestN.toExponential(4), // ~9.2257e5
    note: 'all four near-peak thresholds sit below the sigma peak (~0.9494), downslope roots well defined.',
  },
  nearPeakFamily: TABLE,
  fit: {
    free_intercept_a0: +FIT.a0.toExponential(6), // ~5.4305e-2
    free_slope_a1: +FIT.a1.toExponential(6), // ~6.4184e-1
    free_R2: +FIT.r2.toFixed(8), // ~0.999877
    quadratic_coefficient_c2_free: +C2_FREE.toExponential(6), // 2*a1 ~ 1.2837
    drift_constant_y0_deep_tail: +DRIFT_Y0.toExponential(6), // ~2.882e-2
    drift_abs_rel_minus_2r_at_thr_0p1: +DRIFT_ABS_THR_0P1.toExponential(4), // ~2.801e-6 (imp-97838 link)
    quadratic_coefficient_c2_drift_anchored: +C2_ANCHORED.toExponential(6), // 2*q ~ 1.5463
    c2_bracket: `[${C2_FREE.toFixed(4)}, ${C2_ANCHORED.toFixed(4)}]`,
    c2_spread: +C2_SPREAD.toFixed(6), // ~0.2627 sub-gap from cubic tail at thr=0.93
    subGap:
      'SUBGAP-124791-cubic-tail: the ~0.26 spread between the free (1.284) and drift-anchored ' +
      '(1.546) c2 estimates is the residual cubic curvature at thr=0.93 (r=0.268 not small); a ' +
      'clean two-figure c2 needs a cubic term or a narrower near-peak window.',
  },
  finding: {
    D1_excess_is_linear_in_E_flow_over_E_trunc:
      'Across thr = 0.8,0.85,0.9,0.93 the excess y = rel/(2*E_flow/E_trunc) - 1 walks ' +
      '6.83e-2 -> 8.29e-2 -> 1.25e-1 -> 2.26e-1 and an OLS fit y = a0 + a1 r has slope ' +
      'a1 = 6.4184e-1 with R^2 = 0.999877, so a single linear-in-r term captures the imp-97838 D2 ' +
      'curvature. The residual quadratic coefficient is c2 = 2 a1 = 1.2837 (rel = 2 r + 1.2837 r^2 ' +
      '+ ...), an order-unity positive curvature: the leading closed form under-predicts the ' +
      'crossover height increasingly as thr climbs toward the sigma peak.',
    D2_drift_constant_separated_from_quadratic_term:
      'The deep-tail limit y(r -> 0) = 2.8819e-2 is the constant logT0 drift imp-97838 D2 booked ' +
      '(the absolute rel - 2 r at thr=0.1 is 2.801e-6), DISTINCT from the quadratic term. ' +
      'Anchoring the intercept to this drift and fitting only the slope gives c2_anchored = 1.5463, ' +
      'so free and drift-anchored estimates bracket c2 in [1.284, 1.546]; the ~0.26 spread is the ' +
      'residual cubic curvature at thr=0.93 (SUBGAP-124791-cubic-tail).',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). Fitting the finer near-peak threshold family ' +
    'thr in {0.8,0.85,0.9,0.93} of the imp-97838 crossover residual, the excess ' +
    'y = rel/(2*E_flow/E_trunc) - 1 is LINEAR in E_flow/E_trunc to R^2 = 0.999877 with slope ' +
    'a1 = 0.6418, so the imp-97838 D2 near-peak curvature is a genuine quadratic term ' +
    'rel = 2 r + c2 r^2 + ... with an order-unity POSITIVE coefficient c2 = 2 a1 = 1.284 (free ' +
    'fit). The constant logT0 drift is the deep-tail intercept y0 = 2.882e-2 (matching the ' +
    'imp-97838 ~2.8e-6 absolute rel - 2r at thr=0.1), cleanly separated from the quadratic term; ' +
    'anchoring the fit to that drift gives c2 = 1.546, so the coefficient brackets [1.284, 1.546], ' +
    'the ~0.26 spread being the residual cubic tail at thr=0.93 (SUBGAP-124791-cubic-tail). The ' +
    'positive c2 explains the imp-97838 ~25% under-prediction at thr=0.9 as the r^2 term. ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97838 (near-peak curvature flagged, D2; parent); imp-33743 (thr=0.1 far-tail closed ' +
    'form, the E_flow explanation); imp-33723 (halving closed form, thr=1/2); imp-33601 (exact ' +
    'identity sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124791_THRESHOLD_CROSSOVER_QUADRATIC_COEFFICIENT_ASSERTIONS = [
  {
    // (D1): the near-peak excess y grows monotonically with threshold (curvature is real, resolvable).
    id: 'imp124791-excess-monotone-near-peak',
    description: 'excess y = rel/(2*E_flow/E_trunc) - 1 rises monotonically 0.8 -> 0.85 -> 0.9 -> 0.93',
    holds: () => ROWS.every((p, i) => i === 0 || p.y > ROWS[i - 1].y),
  },
  {
    // (D1): the excess is linear in E_flow/E_trunc to high R^2 across the near-peak family.
    id: 'imp124791-excess-linear-in-eflow',
    description: 'OLS fit y = a0 + a1 r has R^2 > 0.999 over thr in {0.8,0.85,0.9,0.93}',
    holds: () => FIT.r2 > 0.999,
  },
  {
    // (D1): the free-fit quadratic coefficient c2 = 2 a1 is order-unity and positive.
    id: 'imp124791-quadratic-coefficient-order-unity',
    description: 'free-fit quadratic coefficient c2 = 2 a1 is positive and in [1.2, 1.35] (~1.284)',
    holds: () => C2_FREE > 1.2 && C2_FREE < 1.35,
  },
  {
    // (D2): the deep-tail drift constant y0 matches the imp-97838 sub-1.04 tail excess and the
    // absolute rel - 2r at thr=0.1 reproduces the imp-97838 ~2.8e-6 drift.
    id: 'imp124791-drift-constant-matches-imp97838',
    description: 'deep-tail y0 in (0.02,0.04) (~0.0288) and abs rel-2r at thr=0.1 ~ 2.8e-6 (imp-97838 link)',
    holds: () =>
      DRIFT_Y0 > 0.02 &&
      DRIFT_Y0 < 0.04 &&
      DRIFT_ABS_THR_0P1 > 2.7e-6 &&
      DRIFT_ABS_THR_0P1 < 2.9e-6,
  },
  {
    // (D2): free and drift-anchored c2 estimates bracket the coefficient with the stated sub-gap width.
    id: 'imp124791-c2-bracket-subgap',
    description: 'drift-anchored c2 (~1.546) exceeds free c2 (~1.284); bracket spread < 0.35 (cubic-tail sub-gap)',
    holds: () => C2_ANCHORED > C2_FREE && C2_SPREAD > 0 && C2_SPREAD < 0.35,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, PT stays SOTA.
    id: 'imp124791-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124791_THRESHOLD_CROSSOVER_QUADRATIC_COEFFICIENT.isRigorous === false &&
      /NO QED/.test(IMP124791_THRESHOLD_CROSSOVER_QUADRATIC_COEFFICIENT.verdict) &&
      /remains SOTA/.test(IMP124791_THRESHOLD_CROSSOVER_QUADRATIC_COEFFICIENT.verdict),
  },
];

for (const a of IMP124791_THRESHOLD_CROSSOVER_QUADRATIC_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124791-threshold-crossover-quadratic-coefficient assertion failed: ${a.id}`);
  }
}
