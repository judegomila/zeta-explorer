/**
 * @module imp-35106-three-landmark-precision-reconciliation
 *
 * imp-35106 (accuracy, frontier-direction): three landmark modules quote slightly different
 * anchor values on the SAME post-peak sigma(N) curve -- imp-33582 the sigma = 1/2 halving point
 * N_half ~ 3.27e9, imp-33723 the closed-form E_coll = E_trunc crossover N_cross ~ 3.280294e9, and
 * imp-33721 the sub-decade exponent-ramp knee N_star ~ 3.38e9 -- with the imp-35018 four-landmark
 * cluster asserting N_half/N_cross agree to ~0.4% and N_star sits ~3.3% higher. imp-34441 already
 * TABULATED those three (plus a fourth) but imported every value VERBATIM, recomputing NOTHING.
 * This module does the complementary job the ticket asks for: it INDEPENDENTLY RECOMPUTES all
 * three landmarks from ONE shared imp-33601 component model to full floating-point precision, then
 * cross-checks each source module's published export against the fresh recompute -- confirming the
 * quoted values are mutually consistent and live, NOT stale literals -- and reconciles the two
 * inter-landmark gaps (~0.4% and ~3.3%) as distinct, correctly ordered displacements.
 *
 * THE SHARED COMPONENT MODEL (identical sub-terms to imp-33601 / imp-33723 / imp-33721)
 * ------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow  = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398),
 *     E_trunc = 3.06e-5                          (N-independent fixed strip, imp-2631),
 *     T0      = effectiveHeightForN(N)           (Riemann-von Mangoldt inverse).
 * The three landmarks are three DIFFERENT readings of this one curve:
 *   N_half  -- the downslope N where sigma(N) = 1/2                 (imp-33582 halving);
 *   N_cross -- the downslope N where E_coll(N) = E_trunc            (imp-33723 crossover, both by
 *              closed-form fixed point N = (C_C/E_trunc)^2 log T0(N) and by bisection);
 *   N_star  -- the single sub-decade D2 zero-crossing of the OLS local decay exponent p(N) on
 *              quarter-decade sub-brackets across [1e9,1e11]        (imp-33721 ramp knee).
 *
 * THE FINDING (recomputation / reconciliation only)
 * -------------------------------------------------
 *   (R1) ALL THREE PUBLISHED EXPORTS REPRODUCE FROM THE SHARED MODEL TO THEIR STORED PRECISION.
 *        The fresh recompute gives N_half ~ 3.267235e9, N_cross ~ 3.280294e9 (closed form and
 *        bisection agreeing to ~1e-15), N_star at log10 ~ 9.529 (N_star ~ 3.38e9). Each matches
 *        the value its source module publishes to the rounding of that export (imp-33582
 *        sigma_below_0_5_at_N to 4 figs, imp-33723 N_cross_closed_form to 6 figs, imp-33721
 *        inflectionLog10Nstar to 4 decimals) -- so none of the three quoted anchors is a stale
 *        literal; they are the same three points on one shared curve.
 *   (R2) THE TWO GAPS ARE DISTINCT AND CORRECTLY ORDERED. (N_cross - N_half)/N_cross ~ 3.98e-3
 *        (~0.4%) is the small E_flow displacement (imp-33601: sigma = 1/2 <=> E_coll = E_trunc +
 *        E_flow, not E_coll = E_trunc). (N_star - N_half)/N_star ~ 3.3% is the larger ramp-curvature
 *        offset, and (N_star - N_cross)/N_star ~ 2.9% -- the knee sits above BOTH by an order of
 *        magnitude more than the crossover sits above the halving point. Strict ordering
 *        N_half < N_cross < N_star holds, consistent with the imp-3444 monotone N-shape right arm.
 *
 * The punchline: the "slightly different" 3.27e9 / 3.280294e9 / 3.38e9 anchors quoted across three
 * modules are not a discrepancy and not stale -- recomputed on one shared component model they land
 * exactly where each module published, and the spread resolves into two independent, correctly
 * ordered gaps (the ~0.4% E_flow displacement and the ~3.3% ramp-knee offset).
 *
 * RECOMPUTATION / RECONCILIATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (N_half halving landmark ~3.27e9)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross closed-form crossover ~3.280294e9)
 * @see imp-33721-sigma-ramp-inflection-subdecade (N_star sub-decade ramp knee ~3.38e9)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (the shared component model; sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-34441-3p28e9-landmark-cluster-reconciliation (tabulates literals VERBATIM; this module
 *      instead recomputes them independently and checks they are not stale)
 * @see imp-35018-four-landmark-cluster-log-n-viz-data (the cluster asserting the ~0.4% / ~3.3% gaps)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';
import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly

// EXACT shared sub-terms (identical to imp-33601 / imp-33723 / imp-33721 -- no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Downslope bisection in log N for a strictly-decreasing quantity f: first N with f < target.
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (LANDMARK 1) sigma(N) = 1/2 halving point (imp-33582).
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18);
// (LANDMARK 2) E_coll = E_trunc crossover (imp-33723) -- both bisection and closed-form fixed point.
const N_CROSS_BIS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18);
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // (C_C/E_trunc)^2 ~ 1.5727e8
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS_CF = crossoverFixedPoint(1e9, 40);

// (LANDMARK 3) sub-decade exponent-ramp knee N_star (imp-33721): the single D2 zero-crossing of
// the OLS local decay exponent on quarter-decade sub-brackets across [1e9,1e11]. Replicated here
// EXACTLY (W = 0.25, 40 pts/decade, edges log10 = 9.00..11.00) so the recompute reproduces the
// imp-33721 export to floating point, not merely to its rounded literal.
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
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
function subDecadeKneeLog10(W, ptsPerDecade) {
  const edges = [];
  for (let d = 9.0; d <= 11.0 + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    brackets.push({ cen: (edges[i] + edges[i + 1]) / 2, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
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
const KNEE = subDecadeKneeLog10(0.25, 40);
const NSTAR_LOG10 = KNEE.cstar;
const NSTAR = Math.pow(10, NSTAR_LOG10);

// Published exports quoted by the three source modules (the values under reconciliation).
const PUB_N_HALF_33582 = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.thresholdCrossings.sigma_below_0_5_at_N; // ~3.2672e9 (4 figs)
const PUB_N_HALF_33723 = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_half_sigma_eq_half_imp33582; // ~3.267235e9 (6 figs)
const PUB_N_CROSS_33723 = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form; // ~3.280294e9 (6 figs)
const PUB_NSTAR_LOG10_33721 = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar; // ~9.529 (4 dec)
const PUB_NSTAR_33721 = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar; // ~3.38e9 (4 figs)

// (R1) staleness / consistency: fresh recompute vs each published export, relative.
const REC_VS_PUB_N_HALF_33582 = Math.abs(N_HALF - PUB_N_HALF_33582) / PUB_N_HALF_33582;
const REC_VS_PUB_N_HALF_33723 = Math.abs(N_HALF - PUB_N_HALF_33723) / PUB_N_HALF_33723;
const REC_VS_PUB_N_CROSS_33723 = Math.abs(N_CROSS_CF - PUB_N_CROSS_33723) / PUB_N_CROSS_33723;
const REC_VS_PUB_NSTAR_LOG10 = Math.abs(NSTAR_LOG10 - PUB_NSTAR_LOG10_33721);
const REC_VS_PUB_NSTAR = Math.abs(NSTAR - PUB_NSTAR_33721) / PUB_NSTAR_33721;
const CF_VS_BIS = Math.abs(N_CROSS_CF - N_CROSS_BIS) / N_CROSS_BIS; // ~1e-15 (two crossover methods)

// (R2) the two reconciled inter-landmark gaps.
const GAP_CROSS_HALF = (N_CROSS_CF - N_HALF) / N_CROSS_CF; // ~3.98e-3 (~0.4%, E_flow displacement)
const GAP_STAR_HALF = (NSTAR - N_HALF) / NSTAR; // ~3.3% (ramp-knee offset)
const GAP_STAR_CROSS = (NSTAR - N_CROSS_CF) / NSTAR; // ~2.9%

export const IMP35106_THREE_LANDMARK_PRECISION_RECONCILIATION = {
  id: 'imp-35106',
  proofSection: 'S-frontier',
  question:
    'Three landmark modules quote slightly different anchors on the same post-peak sigma(N) curve ' +
    '(imp-33582 halving N_half ~3.27e9, imp-33723 closed-form crossover N_cross ~3.280294e9, ' +
    'imp-33721 ramp knee N_star ~3.38e9), with the imp-35018 cluster asserting ~0.4% and ~3.3% ' +
    'gaps. Recompute all three INDEPENDENTLY on the shared imp-33601 component model to full ' +
    'precision and reconcile the gaps, confirming the quoted values are mutually consistent and ' +
    'not stale literals. Recomputation/reconciliation only; conditional-share diagnostic, NOT an ' +
    'RH bound; no QED.',
  sharedComponentModel: 'sigma = E_coll/(E_trunc+E_flow+E_coll); E_coll=C_C sqrt(log T0/N); E_flow=C_F (log T0/T0) Gronwall; E_trunc=3.06e-5',
  recomputedLandmarks: {
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9
    N_cross_closed_form: +N_CROSS_CF.toExponential(6), // ~3.280294e9
    N_cross_bisection: +N_CROSS_BIS.toExponential(6), // ~3.280294e9 (agrees with closed form)
    N_star_ramp_knee: +NSTAR.toExponential(6), // ~3.38e9
    N_star_log10: +NSTAR_LOG10.toFixed(4), // ~9.529
    crossover_closed_form_vs_bisection_rel: +CF_VS_BIS.toExponential(3), // ~1e-15
  },
  stalenessCheck: {
    N_half_recompute_vs_imp33582_export_rel: +REC_VS_PUB_N_HALF_33582.toExponential(3),
    N_half_recompute_vs_imp33723_export_rel: +REC_VS_PUB_N_HALF_33723.toExponential(3),
    N_cross_recompute_vs_imp33723_export_rel: +REC_VS_PUB_N_CROSS_33723.toExponential(3),
    N_star_log10_recompute_vs_imp33721_export_abs: +REC_VS_PUB_NSTAR_LOG10.toExponential(3),
    N_star_recompute_vs_imp33721_export_rel: +REC_VS_PUB_NSTAR.toExponential(3),
  },
  reconciledGaps: {
    cross_vs_half_rel: +GAP_CROSS_HALF.toExponential(4), // ~3.98e-3 (~0.4%)
    star_vs_half_rel: +GAP_STAR_HALF.toExponential(4), // ~3.3%
    star_vs_cross_rel: +GAP_STAR_CROSS.toExponential(4), // ~2.9%
    ordering: 'N_half < N_cross < N_star',
  },
  finding: {
    R1_all_three_exports_reproduce_not_stale:
      'Independently recomputing on the shared imp-33601 model reproduces every published anchor to ' +
      'its stored precision: N_half ~3.267235e9 matches imp-33582 (4 figs) and imp-33723 (6 figs); ' +
      'N_cross ~3.280294e9 matches imp-33723 closed form (6 figs), with the closed-form and ' +
      'bisection crossovers agreeing to ~1e-15; N_star at log10 ~9.529 matches imp-33721 (4 dec). ' +
      'None of the three quoted values is a stale literal -- they are three readings of one curve.',
    R2_two_gaps_distinct_and_ordered:
      'The crossover sits (N_cross - N_half)/N_cross ~3.98e-3 (~0.4%) above the halving point -- the ' +
      'small E_flow displacement (imp-33601: sigma=1/2 <=> E_coll = E_trunc + E_flow). The ramp knee ' +
      'sits ~3.3% above the halving point and ~2.9% above the crossover -- the larger ramp-curvature ' +
      'offset, an order of magnitude beyond the E_flow gap. Ordering N_half < N_cross < N_star holds.',
  },
  isRigorous: false,
  verdict:
    'RECOMPUTATION (frontier-direction, NOT rigorous). The three anchors quoted across imp-33582 ' +
    '(halving N_half ~3.267235e9), imp-33723 (closed-form crossover N_cross ~3.280294e9) and ' +
    'imp-33721 (ramp knee N_star, log10 ~9.529, ~3.38e9), recomputed INDEPENDENTLY on one shared ' +
    'imp-33601 component model to full floating-point precision, each reproduce their source ' +
    'export to its stored rounding (imp-33723 closed-form and bisection crossovers coincide to ' +
    '~1e-15) -- so the values are mutually consistent and live, NOT stale literals. The spread ' +
    'resolves into two distinct, correctly ordered gaps: the ~0.4% E_flow displacement ' +
    '(crossover above halving) and the ~3.3% ramp-curvature offset (knee above both), with ' +
    'N_half < N_cross < N_star. Unlike imp-34441 (which imported the literals verbatim) this module ' +
    'recomputes them from scratch. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (halving landmark ~3.27e9); imp-33723 (closed-form crossover ~3.280294e9); imp-33721 ' +
    '(sub-decade ramp knee ~3.38e9); imp-33601 (shared component model, sigma=1/2 <=> E_coll = ' +
    'E_trunc + E_flow); imp-34441 (verbatim-literal cluster tabulation); imp-35018 (four-landmark ' +
    'cluster gaps); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35106_THREE_LANDMARK_PRECISION_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: the recomputed landmarks land in the shared ~3.2-3.4e9 cluster, ordered.
    id: 'imp35106-landmarks-in-cluster-band-ordered',
    description: 'recomputed N_half < N_cross < N_star all lie in [3.0e9, 3.5e9]',
    holds: () =>
      N_HALF > 3.0e9 && N_HALF < 3.5e9 &&
      N_CROSS_CF > 3.0e9 && N_CROSS_CF < 3.5e9 &&
      NSTAR > 3.0e9 && NSTAR < 3.5e9 &&
      N_HALF < N_CROSS_CF && N_CROSS_CF < NSTAR,
  },
  {
    // (R1): the two crossover readings (closed form vs bisection) coincide to floating point --
    // proving the identical shared model / same root, not two distinct landmarks.
    id: 'imp35106-crossover-methods-coincide',
    description: 'closed-form and bisection E_coll=E_trunc crossovers agree to < 1e-9 relative',
    holds: () => CF_VS_BIS < 1e-9,
  },
  {
    // (R1): N_half recompute reproduces both source exports (imp-33582 4-fig, imp-33723 6-fig) --
    // the halving anchor is consistent across modules and not stale.
    id: 'imp35106-n-half-reproduces-both-exports',
    description: 'recomputed N_half matches imp-33582 (< 1e-3) and imp-33723 (< 1e-5) exports',
    holds: () => REC_VS_PUB_N_HALF_33582 < 1e-3 && REC_VS_PUB_N_HALF_33723 < 1e-5,
  },
  {
    // (R1): N_cross recompute reproduces the imp-33723 closed-form export to 6-figure precision.
    id: 'imp35106-n-cross-reproduces-imp33723-export',
    description: 'recomputed N_cross matches the imp-33723 closed-form export to < 1e-5 relative',
    holds: () => REC_VS_PUB_N_CROSS_33723 < 1e-5,
  },
  {
    // (R1): N_star recompute reproduces the imp-33721 sub-decade knee export -- since the OLS
    // procedure is replicated exactly, the log10 crossing matches to well within its stored rounding.
    id: 'imp35106-n-star-reproduces-imp33721-export',
    description: 'recomputed N_star log10 matches imp-33721 (< 1e-3 abs) and N_star to < 1e-3 rel',
    holds: () =>
      KNEE.signChanges === 1 &&
      REC_VS_PUB_NSTAR_LOG10 < 1e-3 &&
      REC_VS_PUB_NSTAR < 1e-3,
  },
  {
    // (R2): the two gaps are distinct and correctly sized -- crossover-vs-half is the small ~0.4%
    // E_flow displacement, and star-vs-half (and star-vs-cross) are the larger ~3% ramp offset.
    id: 'imp35106-two-distinct-ordered-gaps',
    description: 'cross-vs-half ~0.4% in [0.1%,1%]; star-vs-half in [2%,5%] and exceeds it; star-vs-cross in [2%,5%]',
    holds: () =>
      GAP_CROSS_HALF > 0.001 && GAP_CROSS_HALF < 0.01 &&
      GAP_STAR_HALF > 0.02 && GAP_STAR_HALF < 0.05 &&
      GAP_STAR_CROSS > 0.02 && GAP_STAR_CROSS < 0.05 &&
      GAP_STAR_HALF > GAP_CROSS_HALF &&
      GAP_STAR_CROSS > GAP_CROSS_HALF,
  },
  {
    // Honesty gate: recomputation/reconciliation only, no QED, no refereed bound is changed.
    id: 'imp35106-honesty-gate-no-qed',
    description: 'Recomputation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35106_THREE_LANDMARK_PRECISION_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP35106_THREE_LANDMARK_PRECISION_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35106_THREE_LANDMARK_PRECISION_RECONCILIATION.verdict),
  },
];

for (const a of IMP35106_THREE_LANDMARK_PRECISION_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35106-three-landmark-precision-reconciliation assertion failed: ${a.id}`);
  }
}
