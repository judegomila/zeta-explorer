/**
 * @module imp-35157-landmark-cluster-width-stability
 *
 * imp-35157 (numerical, frontier-direction): imp-35121/imp-35105 place THREE distinct
 * imp-33601-family crossover events inside a single narrow window around N ~ 3.3e9 --
 *     N_half  (sigma = E_coll/E = 1/2, exactly, imp-33582/imp-33601),
 *     N_cross (E_coll = E_trunc, closed form, imp-33723/imp-3444),
 *     N_star  (post-peak ramp inflection, the sigma-exponent D2 zero-crossing, imp-33721),
 * and list them side by side with the ordering N_half < N_cross < N_star -- but never
 * quantify the cluster WIDTH or ask whether the relative gaps are scale-STABLE or a
 * grid-resolution coincidence that TIGHTENS/spreads as the surrogate grid is refined.
 * This module tabulates the three landmarks on a refined grid, reports the pairwise gaps
 * in DECADES (log10 ratio), and runs a grid-refinement stability sweep on each landmark.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33601 / imp-33721 -- no fresh terms)
 * ----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow  = C_F (log T0 / T0) * Gronwall,   E_trunc = 3.06e-5   (N-independent, imp-2631),
 *     T0      = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse).
 *
 * HOW EACH LANDMARK IS LOCATED (and its grid sensitivity)
 * -------------------------------------------------------
 *   - N_half, N_cross: downslope bisection in log N of strictly-decreasing quantities
 *     (sigma and E_coll). These are ANALYTIC roots: the bisection converges to a fixed
 *     value, independent of grid resolution once enough iterations are taken.
 *   - N_star: the single D2 (ramp-acceleration) zero-crossing of the OLS local sigma-exponent
 *     across [1e9, 1e11], interpolated in log10 N. This is the ONE grid-sensitive landmark --
 *     it depends on the OLS sub-bracket width W and points-per-decade (imp-33721).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE CLUSTER IS A GENUINE TIGHT TRIPLE, ~0.0144 DECADES WIDE. On the refined grid
 *        N_half ~ 3.2672e9 (log10 9.5142), N_cross ~ 3.2803e9 (log10 9.5159),
 *        N_star ~ 3.3771e9 (log10 9.5285); the full cluster width N_half -> N_star is
 *        ~1.437e-2 decades (a factor ~1.034 in N). The two inner gaps are strongly
 *        asymmetric: N_half -> N_cross is only ~1.732e-3 decades (~0.40% in N), while
 *        N_cross -> N_star is ~1.263e-2 decades (~2.95%) -- the ramp inflection sits
 *        ~7x farther from the crossover than the halving point does.
 *   (F2) THE INNER (HALF->CROSS) GAP IS ANALYTICALLY FIXED, NOT A GRID ARTIFACT. Re-locating
 *        N_half and N_cross at bisection depths {30,50,100,200,300} pins both to 12+ sig figs
 *        by depth 50; the half->cross gap holds at 1.732417e-3 decades across the whole sweep.
 *        This gap IS the imp-33601 E_flow surplus (sigma = 1/2 <=> E_coll = E_trunc + E_flow),
 *        so its stability is structural, not a resolution coincidence.
 *   (F3) N_star IS ROBUST TO GRID REFINEMENT: THE CLUSTER NEITHER TIGHTENS NOR SPREADS.
 *        Recomputing the D2 crossing at OLS sub-bracket widths W in {0.25,0.2,0.125,0.1,0.0625}
 *        keeps log10 N_star in [9.5285, 9.5293] -- a total drift of ~7.1e-4 decades, ~5% of the
 *        cluster width -- with exactly one sign change every time. The measured cluster width
 *        therefore stays in ~[1.437e-2, 1.508e-2] decades across a 4x range of grid resolution:
 *        the tight triple is a property of sigma, NOT a grid-resolution coincidence.
 *
 * The punchline: the imp-35121 three-landmark ~3.3e9 cluster is a REAL, scale-stable tight
 * triple ~0.0144 decades wide, with the ordering N_half < N_cross < N_star. Its inner
 * half->cross gap is the analytically-fixed E_flow surplus; its outer cross->star gap is set
 * by the (grid-robust) ramp inflection. Refining the surrogate grid moves the width by only
 * ~5%, so the cluster is not an artifact of coarse sampling.
 *
 * MEASUREMENT ONLY. Conditional-share landmark diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35121-ecoll-etrunc-eflow-decomposition-viz-data (lists the three landmarks side by side)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (source parts(N) model; N_half<N_cross offset = E_flow)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross, E_coll=E_trunc)
 * @see imp-33721-sigma-ramp-inflection-subdecade (N_star ramp inflection, grid-robustness of the D2 crossing)
 * @see imp-35102-nhalf-ncross-strictness-multirung-verify (strict N_half<N_cross ordering across a rung bracket)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33601/imp-33721 exactly

// EXACT imp-33601/imp-33721 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Downslope bisection in log N for a strictly-decreasing f: first N with f < target.
function crossBelow(f, target, lo, hi, iters) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// N_star: single D2 (ramp-acceleration) zero-crossing of the OLS local sigma-exponent
// across [1e9, 1e11], interpolated in log10 N (identical estimator to imp-33721).
function olsExponentLog10(loD, hiD, ppd) {
  const step = 1 / ppd;
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
function inflectionLog10(W, ppd) {
  const LO = 9.0;
  const HI = 11.0;
  const edges = [];
  for (let d = LO; d <= HI + 1e-9; d += W) edges.push(+d.toFixed(6));
  const br = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    br.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ppd) });
  }
  const D1 = [];
  for (let i = 1; i < br.length; i++) D1.push({ cen: (br[i].cen + br[i - 1].cen) / 2, d1: br[i].p - br[i - 1].p });
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  let sc = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      sc += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { sc, cstar };
}

const LOG10 = (x) => Math.log10(x);

// Converged landmarks (deep bisection / primary OLS grid).
const N_HALF = crossBelow(sigma, 0.5, 1e6, 1e18, 300); // ~3.267235e9
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18, 300); // ~3.280294e9
const N_STAR = Math.pow(10, inflectionLog10(0.25, 40).cstar); // ~3.377e9

// Pairwise gaps in DECADES (log10 ratio) and the full cluster width.
const GAP_HALF_CROSS = LOG10(N_CROSS / N_HALF); // ~1.732e-3 decades
const GAP_CROSS_STAR = LOG10(N_STAR / N_CROSS); // ~1.263e-2 decades
const CLUSTER_WIDTH = LOG10(N_STAR / N_HALF); // ~1.437e-2 decades

// (F2) grid stability of the analytic crossovers: bisection-depth sweep on the half->cross gap.
const BISECTION_DEPTHS = [30, 50, 100, 200, 300];
const CROSS_GAP_SWEEP = BISECTION_DEPTHS.map((it) => {
  const nh = crossBelow(sigma, 0.5, 1e6, 1e18, it);
  const nc = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18, it);
  return { depth: it, gapDecades: LOG10(nc / nh) };
});
// Max spread of the half->cross gap once converged (depth >= 50).
const CONVERGED = CROSS_GAP_SWEEP.filter((r) => r.depth >= 50).map((r) => r.gapDecades);
const CROSS_GAP_SPREAD = Math.max(...CONVERGED) - Math.min(...CONVERGED); // ~0 (12+ sig figs)

// (F3) grid stability of N_star: OLS sub-bracket width sweep -> cluster-width range.
const STAR_WIDTHS = [
  { W: 0.25, ppd: 40 },
  { W: 0.2, ppd: 50 },
  { W: 0.125, ppd: 80 },
  { W: 0.1, ppd: 100 },
  { W: 0.0625, ppd: 160 },
];
const STAR_SWEEP = STAR_WIDTHS.map(({ W, ppd }) => {
  const r = inflectionLog10(W, ppd);
  const ns = r.cstar == null ? NaN : Math.pow(10, r.cstar);
  return { W, signChanges: r.sc, log10Nstar: r.cstar, clusterWidthDecades: LOG10(ns / N_HALF) };
});
const STAR_LOG10S = STAR_SWEEP.map((r) => r.log10Nstar);
const STAR_LOG10_SPREAD = Math.max(...STAR_LOG10S) - Math.min(...STAR_LOG10S); // ~7.1e-4 decades
const WIDTHS = STAR_SWEEP.map((r) => r.clusterWidthDecades);
const CLUSTER_WIDTH_MIN = Math.min(...WIDTHS);
const CLUSTER_WIDTH_MAX = Math.max(...WIDTHS);

export const IMP35157_LANDMARK_CLUSTER_WIDTH_STABILITY = {
  id: 'imp-35157',
  proofSection: 'S-frontier',
  question:
    'imp-35121/imp-35105 list three imp-33601-family landmarks -- N_half (sigma=1/2), N_cross ' +
    '(E_coll=E_trunc), N_star (ramp inflection) -- side by side around N ~ 3.3e9 but never ' +
    'quantify the cluster width or ask whether the relative gaps are scale-stable or a ' +
    'grid-resolution coincidence. Tabulate the three landmarks on a refined grid, report the ' +
    'pairwise gaps in decades, and sweep grid resolution to test stability. Measurement only; ' +
    'changes no bound; no QED.',
  ordering: 'N_half < N_cross < N_star',
  landmarks: {
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9
    N_cross_Ecoll_eq_Etrunc: +N_CROSS.toExponential(6), // ~3.280294e9
    N_star_ramp_inflection: +N_STAR.toExponential(6), // ~3.377e9
    log10_N_half: +LOG10(N_HALF).toFixed(6), // ~9.514180
    log10_N_cross: +LOG10(N_CROSS).toFixed(6), // ~9.515913
    log10_N_star: +LOG10(N_STAR).toFixed(6), // ~9.528547
  },
  pairwiseGapsDecades: {
    N_half_to_N_cross: +GAP_HALF_CROSS.toExponential(6), // ~1.732e-3 (analytic E_flow surplus)
    N_cross_to_N_star: +GAP_CROSS_STAR.toExponential(6), // ~1.263e-2 (ramp inflection)
    cluster_width_N_half_to_N_star: +CLUSTER_WIDTH.toExponential(6), // ~1.437e-2 decades
  },
  relativeGapsPercent: {
    N_half_to_N_cross: +((N_CROSS / N_HALF - 1) * 100).toFixed(4), // ~0.40%
    N_cross_to_N_star: +((N_STAR / N_CROSS - 1) * 100).toFixed(4), // ~2.95%
  },
  crossoverGridStability: {
    bisectionDepths: BISECTION_DEPTHS,
    halfCrossGapDecadesConverged: +GAP_HALF_CROSS.toExponential(9), // ~1.732417e-3
    maxGapSpreadDepthGe50: +CROSS_GAP_SPREAD.toExponential(3), // ~0 (12+ sig figs)
  },
  starGridStability: {
    subBracketWidths: STAR_WIDTHS.map((w) => w.W),
    log10NstarSpreadDecades: +STAR_LOG10_SPREAD.toExponential(3), // ~7.1e-4
    signChangesAlwaysOne: STAR_SWEEP.every((r) => r.signChanges === 1),
    clusterWidthRangeDecades: [+CLUSTER_WIDTH_MIN.toExponential(6), +CLUSTER_WIDTH_MAX.toExponential(6)],
    clusterWidthSpreadFraction: +((CLUSTER_WIDTH_MAX - CLUSTER_WIDTH_MIN) / CLUSTER_WIDTH).toFixed(4), // ~0.05
  },
  finding: {
    F1_genuine_tight_triple_0p0144_decades:
      'N_half ~ 3.2672e9 (log10 9.5142), N_cross ~ 3.2803e9 (log10 9.5159), N_star ~ 3.3771e9 ' +
      '(log10 9.5285); the full cluster width N_half -> N_star is ~1.437e-2 decades (factor ~1.034 ' +
      'in N). The inner gaps are strongly asymmetric: N_half -> N_cross ~1.732e-3 decades (~0.40%), ' +
      'N_cross -> N_star ~1.263e-2 decades (~2.95%) -- the ramp inflection sits ~7x farther from ' +
      'the crossover than the halving point does.',
    F2_inner_gap_analytically_fixed:
      'Re-locating N_half and N_cross at bisection depths {30,50,100,200,300} pins both to 12+ sig ' +
      'figs by depth 50; the half -> cross gap holds at 1.732417e-3 decades across the sweep ' +
      '(spread ~0). This gap IS the imp-33601 E_flow surplus (sigma=1/2 <=> E_coll=E_trunc+E_flow), ' +
      'so its stability is structural, not a resolution coincidence.',
    F3_cluster_scale_stable_not_grid_artifact:
      'Recomputing N_star at OLS sub-bracket widths W in {0.25,0.2,0.125,0.1,0.0625} keeps log10 ' +
      'N_star in [9.5285, 9.5293] -- drift ~7.1e-4 decades, ~5% of the cluster width -- with exactly ' +
      'one D2 sign change every time. The measured cluster width stays in ~[1.437e-2, 1.508e-2] ' +
      'decades across a 4x range of grid resolution: the tight triple neither tightens nor spreads, ' +
      'so it is a property of sigma, NOT a grid-resolution coincidence.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-35121 three-landmark ~3.3e9 cluster ' +
    'is a GENUINE, scale-stable tight triple ~0.0144 decades wide, ordered N_half < N_cross < ' +
    'N_star. Its inner N_half -> N_cross gap (~1.732e-3 decades) is the analytically-fixed ' +
    'imp-33601 E_flow surplus (converged to 12+ sig figs by bisection depth 50); its outer ' +
    'N_cross -> N_star gap (~1.263e-2 decades) is set by the grid-robust ramp inflection (log10 ' +
    'N_star drifts only ~7.1e-4 decades across a 4x sub-bracket-width range, always one D2 sign ' +
    'change). The full cluster width holds in ~[1.437e-2, 1.508e-2] decades under grid refinement ' +
    '-- it neither tightens nor spreads -- so the triple is NOT a grid-resolution coincidence. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35121 (three-landmark decomposition viz-data); imp-33601 (parts(N) model; N_half<N_cross ' +
    'offset = E_flow surplus); imp-33723 (closed-form N_cross); imp-33721 (N_star ramp inflection ' +
    'and its grid-robustness); imp-35102 (strict N_half<N_cross ordering); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP35157_LANDMARK_CLUSTER_WIDTH_STABILITY_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-33601/imp-33723 crossovers and the imp-33721 ramp
    // inflection from the identical inherited model, in the published ordering.
    id: 'imp35157-reproduces-three-landmarks-in-order',
    description: 'N_half ~3.267e9, N_cross ~3.280e9, N_star ~3.38e9, with N_half < N_cross < N_star',
    holds: () =>
      Math.abs(N_HALF / 3.267235e9 - 1) < 5e-3 &&
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(N_STAR / 3.38e9 - 1) < 5e-3 &&
      N_HALF < N_CROSS &&
      N_CROSS < N_STAR,
  },
  {
    // (F1): the cluster width and its two asymmetric inner gaps, measured in decades.
    id: 'imp35157-cluster-width-and-asymmetric-gaps',
    description: 'width ~1.44e-2 dec; half->cross ~1.73e-3 dec << cross->star ~1.26e-2 dec',
    holds: () =>
      Math.abs(CLUSTER_WIDTH - 1.437e-2) < 1e-3 &&
      Math.abs(GAP_HALF_CROSS - 1.732e-3) < 1e-4 &&
      Math.abs(GAP_CROSS_STAR - 1.263e-2) < 1e-3 &&
      GAP_HALF_CROSS < GAP_CROSS_STAR,
  },
  {
    // (F2): the analytic half->cross gap is grid-independent -- converged bisection depths agree
    // to 12+ sig figs (spread negligible against the gap itself).
    id: 'imp35157-crossover-gap-analytically-fixed',
    description: 'half->cross gap spread across bisection depth >= 50 is < 1e-9 of the gap',
    holds: () => CROSS_GAP_SPREAD < 1e-9 * GAP_HALF_CROSS + 1e-15,
  },
  {
    // (F3): N_star is grid-robust -- one D2 sign change at every width and the cluster width
    // stays inside a tight band (~5% of itself) across a 4x sub-bracket-width range.
    id: 'imp35157-cluster-scale-stable-not-grid-artifact',
    description: 'one D2 crossing per width; log10 N_star spread < 2e-3 dec; cluster width spread < 10%',
    holds: () =>
      STAR_SWEEP.every((r) => r.signChanges === 1) &&
      STAR_LOG10_SPREAD < 2e-3 &&
      (CLUSTER_WIDTH_MAX - CLUSTER_WIDTH_MIN) / CLUSTER_WIDTH < 0.1,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35157-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35157_LANDMARK_CLUSTER_WIDTH_STABILITY.isRigorous === false &&
      /NO QED/.test(IMP35157_LANDMARK_CLUSTER_WIDTH_STABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP35157_LANDMARK_CLUSTER_WIDTH_STABILITY.verdict),
  },
];

for (const a of IMP35157_LANDMARK_CLUSTER_WIDTH_STABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35157-landmark-cluster-width-stability assertion failed: ${a.id}`);
  }
}
