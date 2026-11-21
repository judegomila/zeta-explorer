/**
 * @module imp-34844-inflection-crossover-gap-cmb-curvature
 *
 * imp-34844 (numerical, frontier): imp-34824 swept C_mb in {1.00,0.99,0.90,0.75,0.50,0.25} and reported the
 * inflection-vs-crossover relative gap relGap(C_mb) = N_star_inflection / N_cross - 1 as the ladder
 * {+2.95,+2.93,+2.70,+2.11,-0.18,-9.38}% with a FIRST-order elasticity d(relGap)/dC_mb ~ +2.15e-2/unit quoted
 * ONLY at the GUE bound C_mb = 1. The far-right rung (-9.38% at C_mb = 0.25) shows the fall is clearly NOT
 * linear, and imp-34838 already found the LOCAL slope at the sign-flip (C_mb* ~ 0.5116) is ~6.8x steeper than
 * at C_mb = 1. This module resolves the SECOND-order question directly: on a denser C_mb grid it measures the
 * local slope d(relGap)/dC_mb AND the curvature d2(relGap)/dC_mb^2 at every node, and reports whether the
 * elasticity is itself constant across the sweep or the curvature ACCELERATES the sign-flip as C_mb falls.
 *
 * THE MODEL (identical sub-terms to imp-34824 / imp-34838 -- C_mb factored onto E_coll only; reproduced here
 * so the derivatives are taken of the same surrogate relGap the sweep tabulated, not a re-derivation)
 * ------------------------------------------------------------------------------------------------------
 *     sigma(N; C_mb) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_mb * C_C_PINNED * sqrt(L / N),  L = log T0(N)   (dominant, GUE-conditional),
 *     E_flow  = C_F (L / T0) * Gronwall,          E_trunc = 3.06e-5   (both C_mb-free).
 *   CROSSOVER N_cross(C_mb): fixed point of N = (C_mb C_C / E_trunc)^2 log T0(N) = C_mb^2 K log T0(N).
 *   INFLECTION N*(C_mb): the single sub-decade D2 zero-crossing of the imp-33721 OLS decay-exponent ramp of
 *     sigma(N; C_mb), the [1e9,1e11] scan window re-centred on log10 N_cross(C_mb).
 *   relGap(C_mb) = 10^(inflectionLog10) / N_cross - 1. First and second derivatives by central differences in
 *     C_mb with step h = 0.02 (Richardson-checked against h in {0.01,0.04}: d2 agrees to 3 sig figs, so the
 *     curvature is a genuine property of relGap, not a finite-difference artifact of the OLS/D2 grid geometry).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (H1) THE ELASTICITY IS NOT CONSTANT -- IT RISES ~25x ACROSS THE SWEEP. d(relGap)/dC_mb climbs
 *        MONOTONICALLY from +2.15e-2/unit at the GUE bound C_mb = 1 to +5.39e-1/unit at C_mb = 0.30, a ~25x
 *        increase. The +2.15e-2/unit imp-34824 quoted is a GUE-bound plateau value that badly understates the
 *        slope everywhere below it; the node at C_mb = 0.55 (~+1.21e-1) and the interpolated slope at the zero
 *        C_mb* ~ 0.5116 (~+1.466e-1) reproduce the imp-34838 local elasticity and its ~6.8x steepening exactly.
 *   (H2) THE CURVATURE IS UNIFORMLY NEGATIVE AND STRENGTHENS MONOTONICALLY AS C_mb FALLS. d2(relGap)/dC_mb^2
 *        is negative at every grid node and grows in magnitude from -6.80e-2/unit^2 at C_mb = 1 to
 *        -3.94/unit^2 at C_mb = 0.30 (a ~58x strengthening). So relGap(C_mb) is CONCAVE and convex-steepening
 *        downward across the whole physical range -- the sign-flip is approached with ACCELERATING curvature,
 *        not linearly. The curvature is stable across h in {0.01,0.02,0.04} (a real second derivative).
 *   (H3) LINEAR EXTRAPOLATION OF THE GUE-BOUND SLOPE MISSES THE SIGN-FLIP ENTIRELY. Extrapolating the near-flat
 *        +2.15e-2/unit slope from C_mb = 1 predicts relGap = 0 at C_mb ~ -0.37 (OUTSIDE [0,1] -- i.e. no flip
 *        in the physical range). The true zero sits at C_mb* ~ 0.5116: it is the accelerating curvature (H2),
 *        not the GUE-bound slope, that pulls the sign-flip up into the physical range by ~0.88 in C_mb.
 *
 * THE VERDICT ON THE TICKET QUESTION (constant elasticity vs accelerating curvature)
 * ---------------------------------------------------------------------------------
 *   NOT constant -- ACCELERATING. The +2.15e-2/unit imp-34824 elasticity is a GUE-bound plateau value; the true
 *   slope rises ~25x across the sweep under a uniformly-negative, monotonically-strengthening curvature, and
 *   the sign-flip near C_mb ~ 0.512 exists in the physical range ONLY because of that acceleration -- a linear
 *   read of the C_mb = 1 slope would place the flip at C_mb ~ -0.37 and miss it. Consistent with the imp-34838
 *   ~6.8x local steepening and the accelerating imp-34824 ladder {+2.95,+2.93,+2.70,+2.11,-0.18,-9.38}%.
 *
 * MEASUREMENT ONLY. Second-order diagnostic of an imp-34824 landmark on the inherited imp-3220/imp-3406
 * surrogate crossover map, NOT a rigorous asymptotic. Treats C_mb as a free knob to measure the gap curvature;
 * does NOT tighten or discharge the GUE conditional (imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail
 * exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34824-inflection-crossover-gap-cmb-sweep (the coarse sweep + the +2.15e-2/unit elasticity at C_mb=1)
 * @see imp-34838-cmb-zero-gap-precise-root-and-elasticity (the zero C_mb* ~ 0.5116, ~6.8x local steepening)
 * @see imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection (the +2.95% R3-vs-R1/R2 residual)
 * @see imp-34734-sigma-peak-cmb-elasticity (C_mb elasticity of the peak; peak LOCATION is C_mb-invariant)
 * @see imp-33721-sigma-ramp-inflection-subdecade (R3 sub-decade D2-zero inflection knee, log10 N* ~ 9.5285)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (R1 Banach crossover, N_cross ~ 3.280294e9)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP } from './imp-34824-inflection-crossover-gap-cmb-sweep.js';
import { IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY } from './imp-34838-cmb-zero-gap-precise-root-and-elasticity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721/imp-34734/imp-34824/imp-34838 exactly

// EXACT imp-34824/imp-34838 sigma with C_mb as a multiplicative factor on the GUE-conditional E_coll.
function sigma(N, cmb) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (C_mb-free)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous (C_mb-free)
  const E_coll = cmb * C_C_PINNED * Math.sqrt(L / N); // GUE-conditional, scaled by C_mb
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// CROSSOVER N_cross(C_mb): fixed point of the E_coll = E_trunc balance N = C_mb^2 K log T0(N).
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

const W_PRIMARY = 0.25; // identical sub-bracket geometry to imp-34824/imp-34838
const PPD_PRIMARY = 40;

// The relative gap of the inflection above the crossover, exactly as imp-34824/imp-34838 define it.
function relGap(cmb) {
  const nc = crossover(cmb);
  const cstar = inflectionLog10(cmb, W_PRIMARY, PPD_PRIMARY);
  if (cstar === null) return null;
  return Math.pow(10, cstar) / nc - 1;
}

// Central-difference first and second derivatives of relGap in C_mb.
const H_FD = 0.02; // Richardson-checked against {0.01,0.04}: d2 stable to 3 sig figs (genuine curvature)
function slope(cmb, h) {
  return (relGap(cmb + h) - relGap(cmb - h)) / (2 * h);
}
function curvature(cmb, h) {
  return (relGap(cmb + h) - 2 * relGap(cmb) + relGap(cmb - h)) / (h * h);
}

// Denser C_mb grid over the range where the sub-decade knee stays cleanly resolvable (imp-34824: below ~0.25
// the crossover approaches the sigma peak and the knee is no longer clean). Slope + curvature at every node.
const CMB_DENSE = [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3];
const CURVE_GRID = CMB_DENSE.map((cmb) => ({
  C_mb: +cmb.toFixed(2),
  rel_gap_pct: +(relGap(cmb) * 100).toFixed(4),
  dRelGap_dCmb: +slope(cmb, H_FD).toExponential(4), // first-order local elasticity /unit C_mb
  d2RelGap_dCmb2: +curvature(cmb, H_FD).toExponential(4), // second-order curvature /unit^2 C_mb
}));

// Range of the first-order elasticity across the sweep (H1: it is NOT a constant).
const SLOPE_AT_GUE = slope(1.0, H_FD); // ~+2.155e-2/unit (reproduces imp-34824 +2.15e-2)
const SLOPE_AT_LOW = slope(0.3, H_FD); // ~+5.388e-1/unit
const SLOPE_SPAN_RATIO = SLOPE_AT_LOW / SLOPE_AT_GUE; // ~25x rise across the sweep

// Curvature at the endpoints (H2: uniformly negative, strengthening as C_mb falls).
const CURV_AT_GUE = curvature(1.0, H_FD); // ~-6.80e-2/unit^2
const CURV_AT_LOW = curvature(0.3, H_FD); // ~-3.94/unit^2
const CURV_STRENGTHEN_RATIO = CURV_AT_LOW / CURV_AT_GUE; // ~58x (magnitude grows toward the flip)

// Richardson stability of the curvature at the GUE bound (H2: real second derivative, not FD grid noise).
const CURV_GUE_H01 = curvature(1.0, 0.01);
const CURV_GUE_H04 = curvature(1.0, 0.04);
const CURV_H_STABILITY = Math.abs(CURV_GUE_H01 / CURV_GUE_H04 - 1); // < 1e-2 (agree to ~3 sig figs)

// H3: extrapolating the GUE-bound slope linearly predicts the zero OUTSIDE the physical [0,1].
const REL_GAP_AT_GUE = relGap(1.0);
const LINEAR_PRED_ZERO = 1.0 - REL_GAP_AT_GUE / SLOPE_AT_GUE; // ~-0.37 (no flip in [0,1] under a linear read)

// Cross-checks against the published first-order elasticities (storage-precision tolerant).
const SLOPE_AT_ROOT = slope(IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.cmbStar, 5e-3); // ~+1.466e-1
const CHECK_VS_IMP34824_GUE_SLOPE = Math.abs(
  SLOPE_AT_GUE - IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.gapElasticity.dRelGap_dCmb,
);
const CHECK_VS_IMP34838_ROOT_SLOPE = Math.abs(
  SLOPE_AT_ROOT - IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.localElasticity.dRelGap_dCmb_at_star,
);

export const IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE = {
  id: 'imp-34844',
  proofSection: 'S-frontier',
  question:
    'imp-34824 reported the inflection-vs-crossover gap ladder {+2.95,+2.93,+2.70,+2.11,-0.18,-9.38}% with a ' +
    'first-order elasticity d(relGap)/dC_mb ~ +2.15e-2/unit quoted ONLY at the GUE bound C_mb = 1, while the ' +
    'far rungs show the fall is clearly nonlinear. Is that +2.15e-2/unit elasticity itself constant across the ' +
    'sweep, or does the curvature d2(relGap)/dC_mb^2 accelerate the sign-flip as C_mb falls? Measure relGap, ' +
    'its local slope, and its second derivative on a denser C_mb grid. Measurement only; treats C_mb as a free ' +
    'knob; does NOT discharge the GUE conditional; no QED.',
  measuredQuantity:
    'the local first derivative d(relGap)/dC_mb and second derivative d2(relGap)/dC_mb^2 of the imp-34824 ' +
    'surrogate gap relGap(C_mb) = N_star_inflection(C_mb)/N_cross(C_mb) - 1, by central differences (h = 0.02) ' +
    'at every node of a dense C_mb grid over {1.00 ... 0.30}; plus the elasticity span ratio, the curvature ' +
    'strengthening ratio, and the zero predicted by a linear extrapolation of the GUE-bound slope',
  fdStep: H_FD,
  curveGrid: CURVE_GRID,
  slopeSpan: {
    dRelGap_dCmb_at_gue: +SLOPE_AT_GUE.toExponential(4), // ~+2.155e-2/unit at C_mb = 1 (reproduces imp-34824)
    dRelGap_dCmb_at_low: +SLOPE_AT_LOW.toExponential(4), // ~+5.388e-1/unit at C_mb = 0.30
    dRelGap_dCmb_at_root: +SLOPE_AT_ROOT.toExponential(4), // ~+1.466e-1/unit at C_mb* ~ 0.5116 (imp-34838)
    spanRatio: +SLOPE_SPAN_RATIO.toFixed(2), // ~25x rise -- the elasticity is NOT constant
  },
  curvatureSpan: {
    d2RelGap_dCmb2_at_gue: +CURV_AT_GUE.toExponential(4), // ~-6.80e-2/unit^2 at C_mb = 1
    d2RelGap_dCmb2_at_low: +CURV_AT_LOW.toExponential(4), // ~-3.94/unit^2 at C_mb = 0.30
    strengthenRatio: +CURV_STRENGTHEN_RATIO.toFixed(2), // ~58x -- concave, strengthening toward the flip
    richardsonHStability: +CURV_H_STABILITY.toExponential(3), // < 1e-2 -- genuine curvature, not FD grid noise
    allNodesNegative: CURVE_GRID.every((g) => g.d2RelGap_dCmb2 < 0),
  },
  linearExtrapolationMissesFlip: {
    linearPredictedZeroCmb: +LINEAR_PRED_ZERO.toFixed(4), // ~-0.37 (outside [0,1] -- no flip under a linear read)
    trueZeroCmb: IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.cmbStar, // ~0.5116
    note:
      'A linear read of the near-flat +2.15e-2/unit GUE-bound slope places the sign-flip at C_mb ~ -0.37, ' +
      'OUTSIDE the physical [0,1]. The true zero at C_mb* ~ 0.5116 exists in range only because of the ' +
      'accelerating (uniformly negative, strengthening) curvature -- the flip is pulled up by ~0.88 in C_mb.',
  },
  crossChecks: {
    gue_slope_vs_imp34824_relerr: +CHECK_VS_IMP34824_GUE_SLOPE.toExponential(3), // ~1e-4 (7-sig-fig literal)
    root_slope_vs_imp34838_absdiff: +CHECK_VS_IMP34838_ROOT_SLOPE.toExponential(3), // ~1e-4
  },
  finding: {
    H1_elasticity_not_constant:
      'The first-order elasticity is NOT constant: d(relGap)/dC_mb rises MONOTONICALLY from +2.15e-2/unit at ' +
      'the GUE bound C_mb = 1 to +5.39e-1/unit at C_mb = 0.30, a ~25x increase. The +2.15e-2/unit imp-34824 ' +
      'quoted is a GUE-bound plateau value that understates the slope everywhere below it; the node at ' +
      'C_mb = 0.55 and the interpolated slope at C_mb* ~ 0.5116 (~+1.466e-1) reproduce the imp-34838 local ' +
      'elasticity and its ~6.8x steepening.',
    H2_curvature_negative_and_strengthening:
      'The curvature d2(relGap)/dC_mb^2 is negative at EVERY node and strengthens monotonically as C_mb falls, ' +
      'from -6.80e-2/unit^2 at C_mb = 1 to -3.94/unit^2 at C_mb = 0.30 (~58x). relGap(C_mb) is concave and ' +
      'convex-steepening downward -- the sign-flip is approached with ACCELERATING curvature, not linearly. ' +
      'The curvature is stable across h in {0.01,0.02,0.04} (a genuine second derivative, not FD grid noise).',
    H3_linear_extrapolation_misses_flip:
      'Extrapolating the near-flat +2.15e-2/unit GUE-bound slope linearly predicts relGap = 0 at C_mb ~ -0.37, ' +
      'OUTSIDE the physical [0,1] -- i.e. a linear read misses the sign-flip entirely. The true zero at ' +
      'C_mb* ~ 0.5116 exists in range ONLY because of the accelerating curvature (H2), which pulls the flip ' +
      'up by ~0.88 in C_mb.',
    verdict_on_ticket_question:
      'NOT constant -- ACCELERATING. The +2.15e-2/unit imp-34824 elasticity is a GUE-bound plateau; the true ' +
      'slope rises ~25x across the sweep under a uniformly-negative, monotonically-strengthening curvature, and ' +
      'the sign-flip near C_mb ~ 0.512 lands in the physical range only because of that acceleration (a linear ' +
      'read would place it at C_mb ~ -0.37). Consistent with the imp-34838 ~6.8x local steepening and the ' +
      'accelerating imp-34824 ladder.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Central-difference first and second derivatives of the imp-34824 ' +
    'inflection-vs-crossover surrogate gap relGap(C_mb) on the inherited imp-3220/imp-3406 crossover map over a ' +
    'dense C_mb grid {1.00 ... 0.30}. The first-order elasticity is NOT the constant +2.15e-2/unit imp-34824 ' +
    'quoted at the GUE bound: it rises MONOTONICALLY ~25x to +5.39e-1/unit at C_mb = 0.30, matching the ' +
    'imp-34838 local slope (~+1.466e-1/unit, ~6.8x steepening) at the zero C_mb* ~ 0.5116. The curvature ' +
    'd2(relGap)/dC_mb^2 is negative at every node and strengthens monotonically (~-6.80e-2 to -3.94/unit^2, ' +
    '~58x), stable across h in {0.01,0.02,0.04} -- a genuine accelerating concavity, not FD grid noise. The ' +
    'acceleration is what puts the sign-flip in the physical range: a linear read of the GUE-bound slope ' +
    'predicts the zero at C_mb ~ -0.37 (outside [0,1]), whereas the true zero sits at C_mb* ~ 0.5116. VERDICT ' +
    'on the ticket: the elasticity is NOT constant -- the curvature is uniformly negative and strengthens as ' +
    'C_mb falls, accelerating the sign-flip. Second-order diagnostic of an imp-34824 landmark; treats C_mb as ' +
    'a free knob; does NOT tighten or discharge the GUE conditional (imp-486); the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'CLOSES the second-order question left open by imp-34824 (which quoted d(relGap)/dC_mb only at C_mb = 1): ' +
    'the elasticity is NOT constant -- it rises ~25x across the sweep under a uniformly-negative, ' +
    'monotonically-strengthening curvature, so the sign-flip near C_mb ~ 0.512 is approached with accelerating ' +
    'concavity (a linear GUE-bound read would miss it). What remains OPEN (deferred, not attempted here) is ' +
    '(i) the OLS/D2 finite-difference grid-geometry floor that caps the absolute accuracy of relGap and hence ' +
    'its derivatives beyond ~3-4 sig figs, and (ii) a rigorous derivation that PINS C_mb below the GUE bound ' +
    'of 1 (imp-486) -- the measurement quantifies the gap curvature but discharges neither conditional.',
  citation:
    'imp-34824 (coarse sweep, elasticity +2.15e-2/unit at C_mb=1, ladder {+2.95..-9.38}%); imp-34838 (zero ' +
    'C_mb* ~ 0.5116, local elasticity +1.466e-1/unit, ~6.8x steepening); imp-34800 (the +2.95% R3-vs-R1/R2 ' +
    'residual); imp-34734 (C_mb elasticity of the peak; peak LOCATION C_mb-invariant); imp-33721 (sub-decade ' +
    'D2-zero inflection knee, log10 N* ~ 9.5285); imp-33723 (Banach crossover, N_cross ~ 3.280294e9); imp-486 ' +
    '(C_mb GUE-conditional, bounded <= 1); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping.',
};

export const IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE_ASSERTIONS = [
  {
    // Reuse gate: the GUE-bound slope reproduces the imp-34824 +2.15e-2/unit elasticity and the interpolated
    // slope at the imp-34838 zero reproduces its +1.466e-1/unit local elasticity.
    id: 'imp34844-slopes-reproduce-imp34824-and-imp34838',
    description: 'GUE-bound slope ~ imp-34824 +2.15e-2/unit; slope at C_mb* ~ imp-34838 +1.466e-1/unit',
    holds: () => CHECK_VS_IMP34824_GUE_SLOPE < 5e-4 && CHECK_VS_IMP34838_ROOT_SLOPE < 5e-4,
  },
  {
    // (H1): the first-order elasticity is positive and rises MONOTONICALLY (in magnitude) as C_mb decreases --
    // NOT a constant. Span across the grid is > 10x.
    id: 'imp34844-elasticity-rises-monotonically',
    description: 'd(relGap)/dC_mb positive and strictly increasing as C_mb falls; span ratio > 10x',
    holds: () => {
      for (let i = 1; i < CURVE_GRID.length; i++) {
        if (!(CURVE_GRID[i].dRelGap_dCmb > CURVE_GRID[i - 1].dRelGap_dCmb)) return false;
      }
      return CURVE_GRID.every((g) => g.dRelGap_dCmb > 0) && SLOPE_SPAN_RATIO > 10;
    },
  },
  {
    // (H2): the curvature is negative at EVERY node and strengthens monotonically (in magnitude) as C_mb falls.
    id: 'imp34844-curvature-negative-and-strengthening',
    description: 'd2(relGap)/dC_mb^2 < 0 at every node, magnitude strictly increasing as C_mb decreases',
    holds: () => {
      if (!CURVE_GRID.every((g) => g.d2RelGap_dCmb2 < 0)) return false;
      for (let i = 1; i < CURVE_GRID.length; i++) {
        if (!(Math.abs(CURVE_GRID[i].d2RelGap_dCmb2) > Math.abs(CURVE_GRID[i - 1].d2RelGap_dCmb2))) return false;
      }
      return CURV_STRENGTHEN_RATIO > 10;
    },
  },
  {
    // (H2): the curvature is a genuine second derivative -- stable across h in {0.01,0.04} to ~3 sig figs.
    id: 'imp34844-curvature-h-stable',
    description: 'curvature at C_mb=1 agrees across h in {0.01,0.04} to < 1e-2 (not FD grid noise)',
    holds: () => CURV_H_STABILITY < 1e-2,
  },
  {
    // (H3): a linear extrapolation of the GUE-bound slope predicts the zero OUTSIDE [0,1] (misses the flip),
    // while the true zero is the in-range imp-34838 C_mb* ~ 0.5116.
    id: 'imp34844-linear-extrapolation-misses-flip',
    description: 'linear-from-GUE predicted zero < 0 (outside [0,1]); true zero ~ 0.5116 in range',
    holds: () =>
      LINEAR_PRED_ZERO < 0 &&
      IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.cmbStar > 0.5 &&
      IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.cmbStar < 0.52,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed.
    id: 'imp34844-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed',
    holds: () =>
      IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE.isRigorous === false &&
      IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE.farTailExponent === 0.5 &&
      typeof IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE.subGap === 'string' &&
      /imp-486/.test(IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE.subGap) &&
      /NO QED/.test(IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE.verdict) &&
      /refereed bound is changed/i.test(IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE.verdict),
  },
];

for (const a of IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34844-inflection-crossover-gap-cmb-curvature assertion failed: ${a.id}`);
  }
}
