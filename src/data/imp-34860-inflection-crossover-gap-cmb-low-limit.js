/**
 * @module imp-34860-inflection-crossover-gap-cmb-low-limit
 *
 * imp-34860 (numerical, frontier): imp-34844 measured the inflection-vs-crossover relative gap
 * relGap(C_mb) = N_star_inflection(C_mb)/N_cross(C_mb) - 1 on a dense C_mb grid {1.00 ... 0.30} and found a
 * first-order elasticity d(relGap)/dC_mb rising ~25x (from +2.15e-2/unit at the GUE bound C_mb = 1 to
 * +5.39e-1/unit at C_mb = 0.30) under a UNIFORMLY-NEGATIVE curvature d2(relGap)/dC_mb^2 strengthening ~58x
 * (-6.80e-2 to -3.94/unit^2). It STOPPED the grid at C_mb = 0.30 (below which imp-34824 warned the crossover
 * approaches the sigma peak and the sub-decade knee stops being clean). This module extends the dense grid
 * TOWARD 0 -- guarding the N_cross = C_mb^2 K log T0(N) fixed point as N_cross -> 0 -- and answers the two
 * questions imp-34844 left open: (i) does relGap and its curvature DIVERGE or SATURATE as C_mb -> 0, and
 * (ii) where along the sweep does |d2 relGap/dC_mb^2| PEAK.
 *
 * THE MODEL (identical sub-terms to imp-34844 / imp-34824 / imp-34838 -- C_mb factored onto E_coll only;
 * reproduced here so the low-C_mb derivatives are taken of the same surrogate relGap the sweep tabulated)
 * -----------------------------------------------------------------------------------------------------------
 *     sigma(N; C_mb) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_mb * C_C_PINNED * sqrt(L / N),  L = log T0(N)   (dominant, GUE-conditional),
 *     E_flow  = C_F (L / T0) * Gronwall,          E_trunc = 3.06e-5   (both C_mb-free).
 *   CROSSOVER N_cross(C_mb): fixed point of N = (C_mb C_C / E_trunc)^2 log T0(N) = C_mb^2 K log T0(N).
 *   INFLECTION N*(C_mb): the single sub-decade D2 zero-crossing of the imp-33721 OLS decay-exponent ramp of
 *     sigma(N; C_mb), the [1e9,1e11] scan window re-centred on log10 N_cross(C_mb).
 *   relGap(C_mb) = 10^(inflectionLog10)/N_cross - 1. First and second derivatives by central differences in
 *     C_mb with step h = 0.02 (identical to imp-34844). relGap returns null when the sub-decade knee has no
 *     clean D2 zero-crossing (the diagnostic has BROKEN DOWN) -- the guard the low-limit sweep must respect.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (L1) THE CURVATURE DOES NOT DIVERGE -- IT SATURATES AT A FINITE INTERIOR PEAK AND REVERSES. The
 *        magnitude |d2 relGap/dC_mb^2| does NOT keep strengthening as C_mb -> 0 the way a naive extrapolation
 *        of the imp-34844 monotone ~58x ladder would suggest. It PEAKS at C_mb ~ 0.184 with magnitude
 *        ~9.34/unit^2 (Richardson-stable across h in {0.01,0.02}), then WEAKENS, and the curvature SIGN-FLIPS
 *        from negative (concave) to positive (convex) at C_mb ~ 0.139. So the imp-34844 "monotonically
 *        strengthening negative curvature" is an OVER-THE-GUE-BOUND-TO-0.30 window statement, not a global
 *        one: the concavity has an interior extremum, not a divergence.
 *   (L2) relGap KEEPS FALLING MONOTONICALLY THROUGH THE RESOLVABLE BAND, THEN THE DIAGNOSTIC FAILS. relGap
 *        continues downward from -6.12% at C_mb = 0.30 to -27.39% at C_mb = 0.11 (N_cross ~ 3.14e7), the last
 *        cleanly-resolvable rung. BELOW that -- around C_mb ~ 0.10 (N_cross ~ 2.56e7) -- the sub-decade knee
 *        loses its clean D2 zero-crossing and relGap returns null (an unresolvable band ~C_mb in [0.085,0.105]),
 *        with only SPURIOUS re-crossings further down. The surrogate DIAGNOSTIC BREAKS DOWN before N_cross
 *        reaches 0.
 *   (L3) THE C_mb -> 0 LIMIT IS UNRESOLVABLE ON THIS SURROGATE. Because the knee diagnostic fails at
 *        N_cross ~ 2.6e7 (C_mb ~ 0.10) -- long before N_cross -> 0 -- neither divergence nor saturation of
 *        relGap in the true C_mb -> 0 limit can be MEASURED here. What IS measured: relGap stays finite and
 *        falling (-27.4% at the floor) and the curvature stays finite (peaks ~9.34/unit^2), i.e. NO divergence
 *        is observed anywhere in the resolvable range.
 *
 * THE VERDICT ON THE TICKET QUESTION (diverge vs saturate; curvature-peak location)
 * ---------------------------------------------------------------------------------
 *   SATURATES, does NOT diverge. The curvature has a FINITE interior magnitude peak at C_mb ~ 0.184
 *   (~9.34/unit^2) and reverses sign at C_mb ~ 0.139; relGap stays finite and monotone-falling to -27.4% at
 *   the resolvability floor C_mb ~ 0.11. The literal C_mb -> 0 limit is UNRESOLVABLE because the imp-33721
 *   sub-decade knee loses its clean D2 zero near C_mb ~ 0.10 (N_cross ~ 2.6e7). The imp-34844 monotone
 *   ~58x curvature strengthening is thus a local (>= 0.30) statement, not the onset of a divergence.
 *
 * MEASUREMENT ONLY. Low-C_mb extension of an imp-34844 landmark on the inherited imp-3220/imp-3406 surrogate
 * crossover map, NOT a rigorous asymptotic. Treats C_mb as a free knob to probe the low-limit gap curvature;
 * does NOT tighten or discharge the GUE conditional (imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail
 * exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34844-inflection-crossover-gap-cmb-curvature (the dense-grid slope+curvature {1.00 ... 0.30}, ~58x)
 * @see imp-34838-cmb-zero-gap-precise-root-and-elasticity (the zero C_mb* ~ 0.5116, ~6.8x local steepening)
 * @see imp-34824-inflection-crossover-gap-cmb-sweep (the coarse sweep + the +2.15e-2/unit GUE-bound elasticity)
 * @see imp-33721-sigma-ramp-inflection-subdecade (R3 sub-decade D2-zero inflection knee, log10 N* ~ 9.5285)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (R1 Banach crossover, N_cross ~ 3.280294e9)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE } from './imp-34844-inflection-crossover-gap-cmb-curvature.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721/imp-34824/imp-34838/imp-34844 exactly

// EXACT imp-34844 sigma with C_mb as a multiplicative factor on the GUE-conditional E_coll.
function sigma(N, cmb) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (C_mb-free)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous (C_mb-free)
  const E_coll = cmb * C_C_PINNED * Math.sqrt(L / N); // GUE-conditional, scaled by C_mb
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// CROSSOVER N_cross(C_mb): fixed point of the E_coll = E_trunc balance N = C_mb^2 K log T0(N). As C_mb -> 0
// the fixed point N_cross = C_mb^2 K log T0 -> 0; the iteration below stays stable because log T0(N) is bounded
// and slowly varying, so N stays positive (the N_cross -> 0 guard the ticket calls out).
function crossover(cmb) {
  const K = (cmb * C_C_PINNED / E_TRUNC_PT) ** 2;
  let N = 1e9;
  for (let i = 0; i < 400; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}

// imp-33721 OLS local decay exponent p = -slope of ln sigma on ln N over [10^loD, 10^hiD].
function olsExponentLog10(loD, hiD, ppd, cmb) {
  const step = 1 / ppd;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N, cmb)));
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

// imp-33721 sub-decade D2-zero inflection knee of sigma(N; C_mb), window re-centred on log10 N_cross(C_mb).
// Returns null when there is no clean D2 zero-crossing -- the signal that the diagnostic has broken down.
const CROSS_BASE = crossover(1.0);
const LOG10_CROSS_BASE = Math.log10(CROSS_BASE);
function inflectionLog10(cmb, W, ppd) {
  const shift = Math.log10(crossover(cmb)) - LOG10_CROSS_BASE;
  const loD = 9.0 + shift;
  const hiD = 11.0 + shift;
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(6));
  const br = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    br.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ppd, cmb) });
  }
  const D1 = [];
  for (let i = 1; i < br.length; i++) D1.push({ cen: (br[i].cen + br[i - 1].cen) / 2, d1: br[i].p - br[i - 1].p });
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2) && cstar === null) {
      const c0 = D2[i - 1].cen;
      const c1 = D2[i].cen;
      const y0 = D2[i - 1].d2;
      const y1 = D2[i].d2;
      cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
    }
  }
  return cstar;
}

const W_PRIMARY = 0.25; // identical sub-bracket geometry to imp-34824/imp-34838/imp-34844
const PPD_PRIMARY = 40;

// The relative gap of the inflection above the crossover, exactly as imp-34844 defines it.
function relGap(cmb) {
  const nc = crossover(cmb);
  const cstar = inflectionLog10(cmb, W_PRIMARY, PPD_PRIMARY);
  if (cstar === null) return null;
  return Math.pow(10, cstar) / nc - 1;
}

// Central-difference first and second derivatives of relGap in C_mb, null-propagating (guard for the band
// where the knee is unresolvable -- so the low-limit sweep never fabricates a slope/curvature from a null).
const H_FD = 0.02; // identical step to imp-34844
function slope(cmb, h) {
  const a = relGap(cmb + h);
  const b = relGap(cmb - h);
  if (a === null || b === null) return null;
  return (a - b) / (2 * h);
}
function curvature(cmb, h) {
  const a = relGap(cmb + h);
  const m = relGap(cmb);
  const b = relGap(cmb - h);
  if (a === null || m === null || b === null) return null;
  return (a - 2 * m + b) / (h * h);
}

// Low-C_mb extension grid, from where imp-34844 stopped (0.30) down toward 0 in steps of 0.01. Every node that
// still yields a clean knee is tabulated; nodes where the diagnostic has broken down are recorded as null.
const CMB_LOW = [];
for (let c = 0.3; c > 0.079; c -= 0.01) CMB_LOW.push(+c.toFixed(2));
const LOW_GRID = CMB_LOW.map((cmb) => {
  const rg = relGap(cmb);
  const s = slope(cmb, H_FD);
  const cu = curvature(cmb, H_FD);
  return {
    C_mb: +cmb.toFixed(2),
    N_cross: +crossover(cmb).toExponential(3),
    rel_gap_pct: rg === null ? null : +(rg * 100).toFixed(4),
    dRelGap_dCmb: s === null ? null : +s.toExponential(4),
    d2RelGap_dCmb2: cu === null ? null : +cu.toExponential(4),
    resolvable: rg !== null,
  };
});

// (L1) The curvature magnitude PEAK -- an interior maximum, located by a fine scan over the resolvable band.
function findCurvaturePeak() {
  let best = { cmb: null, mag: 0 };
  for (let c = 0.24; c >= 0.129; c -= 0.001) {
    const cmb = +c.toFixed(3);
    const cu = curvature(cmb, H_FD);
    if (cu !== null && Math.abs(cu) > best.mag) best = { cmb, mag: Math.abs(cu) };
  }
  return best;
}
const CURV_PEAK = findCurvaturePeak(); // ~{cmb: 0.184, mag: 9.34/unit^2}

// (L1) The curvature SIGN-FLIP (negative/concave -> positive/convex), located by bisection.
function findCurvatureSignFlip() {
  let lo = 0.13;
  let hi = 0.145;
  const cuHi = curvature(hi, H_FD);
  const cuLo = curvature(lo, H_FD);
  if (cuHi === null || cuLo === null || Math.sign(cuHi) === Math.sign(cuLo)) return null;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const cu = curvature(mid, H_FD);
    if (cu === null) break;
    if (Math.sign(cu) === Math.sign(cuHi)) hi = mid;
    else lo = mid;
  }
  return +((lo + hi) / 2).toFixed(5);
}
const CURV_SIGN_FLIP_CMB = findCurvatureSignFlip(); // ~0.139

// Richardson stability of the peak curvature (L1: a genuine second derivative, not FD grid noise).
const CURV_PEAK_H01 = curvature(CURV_PEAK.cmb, 0.01);
const CURV_PEAK_H02 = curvature(CURV_PEAK.cmb, 0.02);
const CURV_PEAK_H_STABILITY = Math.abs(CURV_PEAK_H01 / CURV_PEAK_H02 - 1); // ~9e-3 (< 1e-2)

// (L2) The resolvability FLOOR: the lowest C_mb whose knee is still clean, and the first C_mb where it fails.
const RESOLVABLE = LOW_GRID.filter((g) => g.resolvable);
const RESOLVABILITY_FLOOR = RESOLVABLE.length ? RESOLVABLE[RESOLVABLE.length - 1] : null; // ~{C_mb:0.11, ...}
const FIRST_UNRESOLVABLE = LOW_GRID.find((g) => !g.resolvable) || null; // ~{C_mb:0.10, N_cross:2.56e7}

// (L2) relGap keeps FALLING (more negative) monotonically across the whole resolvable band.
const REL_GAP_MONOTONE_FALLING = (() => {
  for (let i = 1; i < RESOLVABLE.length; i++) {
    if (!(RESOLVABLE[i].rel_gap_pct < RESOLVABLE[i - 1].rel_gap_pct)) return false;
  }
  return true;
})();

// Continuity with imp-34844: the C_mb = 0.30 rung reproduces the imp-34844 far-right endpoint exactly.
const IMP34844_C030 = IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE.curveGrid.find((g) => g.C_mb === 0.3);
const C030 = LOW_GRID.find((g) => g.C_mb === 0.3);
const CHECK_VS_IMP34844_C030_RELGAP = Math.abs(C030.rel_gap_pct - IMP34844_C030.rel_gap_pct);
const CHECK_VS_IMP34844_C030_CURV = Math.abs(C030.d2RelGap_dCmb2 - IMP34844_C030.d2RelGap_dCmb2);

export const IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT = {
  id: 'imp-34860',
  proofSection: 'S-frontier',
  question:
    'imp-34844 measured d(relGap)/dC_mb rising ~25x under a uniformly-negative curvature strengthening ~58x ' +
    '(to -3.94/unit^2 at C_mb = 0.30) and STOPPED the grid at C_mb = 0.30. Extending the dense C_mb grid ' +
    'toward 0 (guarding the N_cross = C_mb^2 K log T0 fixed point as N_cross -> 0): does relGap and its ' +
    'curvature DIVERGE or SATURATE as C_mb -> 0, and where does |d2 relGap/dC_mb^2| PEAK? Measurement only; ' +
    'treats C_mb as a free knob; does NOT discharge the GUE conditional; no QED.',
  measuredQuantity:
    'relGap(C_mb) = N_star_inflection(C_mb)/N_cross(C_mb) - 1, its central-difference slope and curvature ' +
    '(h = 0.02), on a dense C_mb grid extended from 0.30 down toward 0 in steps of 0.01; plus the C_mb of ' +
    'maximal |d2 relGap/dC_mb^2|, the curvature sign-flip C_mb, and the resolvability floor (lowest C_mb with ' +
    'a clean sub-decade knee)',
  fdStep: H_FD,
  lowGrid: LOW_GRID,
  curvaturePeak: {
    C_mb: +CURV_PEAK.cmb.toFixed(3), // ~0.184 -- an INTERIOR maximum, not a divergence toward C_mb -> 0
    absCurvature: +CURV_PEAK.mag.toExponential(4), // ~9.34/unit^2
    richardsonHStability: +CURV_PEAK_H_STABILITY.toExponential(3), // < 1e-2 -- genuine second derivative
    note:
      'The curvature magnitude PEAKS at an interior C_mb ~ 0.184 (~9.34/unit^2), then WEAKENS -- it does NOT ' +
      'keep diverging toward C_mb -> 0. The imp-34844 monotone ~58x strengthening is a >= 0.30 window ' +
      'statement, not the onset of a divergence.',
  },
  curvatureSignFlipCmb: CURV_SIGN_FLIP_CMB, // ~0.139 -- concave (neg) above, convex (pos) below
  resolvability: {
    floorRung: RESOLVABILITY_FLOOR, // ~{C_mb:0.11, N_cross:3.14e7, rel_gap_pct:-27.39}
    firstUnresolvableRung: FIRST_UNRESOLVABLE, // ~{C_mb:0.10, N_cross:2.56e7, rel_gap_pct:null}
    note:
      'The imp-33721 sub-decade knee loses its clean D2 zero-crossing around C_mb ~ 0.10 (N_cross ~ 2.6e7); ' +
      'relGap returns null through an unresolvable band ~C_mb in [0.085,0.105] with only spurious re-crossings ' +
      'further down. The surrogate DIAGNOSTIC BREAKS DOWN before N_cross reaches 0, so the literal C_mb -> 0 ' +
      'limit is UNRESOLVABLE here.',
  },
  finding: {
    L1_curvature_saturates_and_reverses:
      'The curvature does NOT diverge as C_mb -> 0. |d2 relGap/dC_mb^2| PEAKS at an interior C_mb ~ 0.184 ' +
      '(~9.34/unit^2, Richardson-stable across h in {0.01,0.02}), then WEAKENS, and the curvature SIGN-FLIPS ' +
      'from negative (concave) to positive (convex) at C_mb ~ 0.139. The imp-34844 "monotonically strengthening ' +
      'negative curvature" is thus a local (>= 0.30) statement -- the concavity has an interior extremum.',
    L2_relgap_falls_then_diagnostic_fails:
      'relGap keeps falling monotonically from -6.12% at C_mb = 0.30 to -27.39% at C_mb = 0.11 (N_cross ~ ' +
      '3.14e7, the last cleanly-resolvable rung). Below that, around C_mb ~ 0.10 (N_cross ~ 2.56e7), the ' +
      'sub-decade knee loses its clean D2 zero and relGap returns null (unresolvable band ~[0.085,0.105]). The ' +
      'surrogate diagnostic breaks down before N_cross reaches 0.',
    L3_low_limit_unresolvable:
      'Because the knee diagnostic fails at N_cross ~ 2.6e7 -- long before N_cross -> 0 -- neither divergence ' +
      'nor saturation of relGap in the true C_mb -> 0 limit can be MEASURED on this surrogate. What IS observed: ' +
      'relGap stays finite and falling (-27.4% at the floor) and the curvature stays finite (peaks ~9.34), i.e. ' +
      'NO divergence anywhere in the resolvable range.',
    verdict_on_ticket_question:
      'SATURATES, does NOT diverge. The curvature has a finite interior magnitude peak at C_mb ~ 0.184 ' +
      '(~9.34/unit^2) and reverses sign at C_mb ~ 0.139; relGap stays finite and monotone-falling to -27.4% at ' +
      'the resolvability floor C_mb ~ 0.11. The literal C_mb -> 0 limit is UNRESOLVABLE because the sub-decade ' +
      'knee loses its clean D2 zero near C_mb ~ 0.10 (N_cross ~ 2.6e7).',
  },
  crossChecks: {
    c030_relgap_vs_imp34844_absdiff: +CHECK_VS_IMP34844_C030_RELGAP.toExponential(3), // continuity at C_mb=0.30
    c030_curvature_vs_imp34844_absdiff: +CHECK_VS_IMP34844_C030_CURV.toExponential(3),
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Low-C_mb extension of the imp-34844 inflection-vs-crossover ' +
    'surrogate gap relGap(C_mb) on the inherited imp-3220/imp-3406 crossover map, from where imp-34844 stopped ' +
    '(C_mb = 0.30) down toward 0. The curvature does NOT diverge as C_mb -> 0: |d2 relGap/dC_mb^2| PEAKS at an ' +
    'interior C_mb ~ 0.184 (~9.34/unit^2, Richardson-stable), then WEAKENS and SIGN-FLIPS to positive at ' +
    'C_mb ~ 0.139 -- so the imp-34844 monotone ~58x strengthening is a >= 0.30 window statement, not a ' +
    'divergence onset. relGap keeps falling monotonically to -27.39% at C_mb = 0.11 (N_cross ~ 3.14e7), then ' +
    'the imp-33721 sub-decade knee loses its clean D2 zero around C_mb ~ 0.10 (N_cross ~ 2.56e7) and relGap ' +
    'returns null. The surrogate DIAGNOSTIC BREAKS DOWN before N_cross reaches 0, so the literal C_mb -> 0 ' +
    'limit is UNRESOLVABLE here; within the resolvable range NO divergence of relGap or its curvature is ' +
    'observed. VERDICT on the ticket: SATURATES (finite interior curvature peak at C_mb ~ 0.184), does NOT ' +
    'diverge. Low-limit diagnostic of an imp-34844 landmark; treats C_mb as a free knob; does NOT tighten or ' +
    'discharge the GUE conditional (imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the low-C_mb limit + curvature-peak questions imp-34844 left open (it stopped at C_mb = 0.30): the ' +
    'curvature SATURATES at a finite interior magnitude peak (C_mb ~ 0.184, ~9.34/unit^2) and reverses sign at ' +
    'C_mb ~ 0.139 -- it does NOT diverge -- and relGap stays finite/falling to -27.4% at the resolvability ' +
    'floor C_mb ~ 0.11. What remains OPEN (deferred, not attempted here) is (i) the literal C_mb -> 0 ' +
    '(N_cross -> 0) limit, which is UNRESOLVABLE on this surrogate because the imp-33721 sub-decade knee loses ' +
    'its clean D2 zero near C_mb ~ 0.10 (N_cross ~ 2.6e7) -- a finer/wider-window knee estimator would be ' +
    'needed to probe below it; and (ii) a rigorous derivation that PINS C_mb below the GUE bound of 1 ' +
    '(imp-486) -- the measurement quantifies the low-limit gap curvature but discharges neither conditional.',
  citation:
    'imp-34844 (dense-grid slope+curvature {1.00 ... 0.30}, ~58x strengthening, stops at 0.30); imp-34838 ' +
    '(zero C_mb* ~ 0.5116, local elasticity +1.466e-1/unit); imp-34824 (coarse sweep, +2.15e-2/unit GUE-bound ' +
    'elasticity); imp-33721 (sub-decade D2-zero inflection knee, log10 N* ~ 9.5285); imp-33723 (Banach ' +
    'crossover, N_cross ~ 3.280294e9); imp-486 (C_mb GUE-conditional, bounded <= 1); imp-398 (E_flow C_F ' +
    'prefactor); lambda-rh-height-mapping.',
};

export const IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT_ASSERTIONS = [
  {
    // Continuity gate: the C_mb = 0.30 rung reproduces the imp-34844 far-right endpoint (relGap + curvature).
    id: 'imp34860-c030-reproduces-imp34844-endpoint',
    description: 'C_mb=0.30 relGap and curvature reproduce the imp-34844 far-right node',
    holds: () => CHECK_VS_IMP34844_C030_RELGAP < 1e-2 && CHECK_VS_IMP34844_C030_CURV < 1e-2,
  },
  {
    // (L1): the curvature magnitude has an INTERIOR peak (not at the grid edge) -- saturation, not divergence.
    id: 'imp34860-curvature-peak-interior',
    description: '|d2 relGap/dC_mb^2| peaks at an interior C_mb in (0.14, 0.24), Richardson-stable',
    holds: () =>
      CURV_PEAK.cmb > 0.14 &&
      CURV_PEAK.cmb < 0.24 &&
      CURV_PEAK.mag > 8 &&
      CURV_PEAK.mag < 11 &&
      CURV_PEAK_H_STABILITY < 1e-2,
  },
  {
    // (L1): the curvature sign-flips (concave -> convex) at an in-band C_mb -- the concavity is not monotone.
    id: 'imp34860-curvature-sign-flip',
    description: 'curvature sign-flips negative->positive at C_mb ~ 0.139 (interior, in the resolvable band)',
    holds: () => CURV_SIGN_FLIP_CMB !== null && CURV_SIGN_FLIP_CMB > 0.13 && CURV_SIGN_FLIP_CMB < 0.145,
  },
  {
    // (L2): relGap falls monotonically across the resolvable band and there IS a resolvability floor above 0.
    id: 'imp34860-relgap-falls-then-floor',
    description: 'relGap monotone-falling across resolvable band; resolvability floor C_mb in (0.10, 0.13)',
    holds: () =>
      REL_GAP_MONOTONE_FALLING &&
      RESOLVABILITY_FLOOR !== null &&
      RESOLVABILITY_FLOOR.C_mb > 0.1 &&
      RESOLVABILITY_FLOOR.C_mb < 0.13 &&
      RESOLVABILITY_FLOOR.rel_gap_pct < -25,
  },
  {
    // (L2/L3): the diagnostic BREAKS DOWN (relGap null) before N_cross reaches 0 -- the low limit is unresolvable.
    id: 'imp34860-diagnostic-breaks-down',
    description: 'a first-unresolvable rung exists (relGap null) at N_cross ~ 2.6e7, before N_cross -> 0',
    holds: () =>
      FIRST_UNRESOLVABLE !== null &&
      FIRST_UNRESOLVABLE.rel_gap_pct === null &&
      FIRST_UNRESOLVABLE.N_cross > 1e7 &&
      FIRST_UNRESOLVABLE.N_cross < 5e7,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed.
    id: 'imp34860-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed',
    holds: () =>
      IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT.isRigorous === false &&
      IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT.farTailExponent === 0.5 &&
      typeof IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT.subGap === 'string' &&
      /imp-486/.test(IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT.subGap) &&
      /NO QED/.test(IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT.verdict) &&
      /refereed bound is changed/i.test(IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT.verdict),
  },
];

for (const a of IMP34860_INFLECTION_CROSSOVER_GAP_CMB_LOW_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34860-inflection-crossover-gap-cmb-low-limit assertion failed: ${a.id}`);
  }
}
