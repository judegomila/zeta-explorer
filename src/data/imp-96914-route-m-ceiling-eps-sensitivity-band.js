/**
 * @module imp-96914-route-m-ceiling-eps-sensitivity-band
 *
 * imp-96914 (numerical, SENSITIVITY ONLY): band the eps-sensitivity of the three Route M
 * conditioning ceilings (trace T ~ 2.594e7, Frobenius F ~ 3.764e7, measured M ~ 4.109e7) to the
 * machine-epsilon CHOICE eps = 2.22e-16 in the breakdown scale cond#(N) = lam_max / lam_min = 1/eps.
 * Every ceiling is solved from N_star = (A / (eps pi))^(1 / p) with lam_min = A N^-p (imp-96428),
 * so each ceiling depends on eps through the SAME 1/(p+b) exponent that imp-96833 used for p, yet
 * imp-96833 varied only p and held eps fixed at bare machine epsilon. Here we (1) derive the
 * analytic elasticity d(log N_star)/d(log eps) = -1/(p+b), (2) propagate a plausible eps range from
 * bare machine eps up to a conservative accumulated-roundoff estimate c sqrt(N) eps, (3) report the
 * resulting ceiling band, and (4) test whether the T < F < M ordering and the >= 1500x
 * wall-clock-binds-first conclusion survive the eps variation. NO bound moved; NO QED.
 *
 * THE ISSUE. imp-96833 banded only the lam_min power-law exponent p and found the ceilings
 * essentially p-insensitive (+/- 4.4 percent per +/- 2 sigma) with a p-invariant ordering. But the
 * same ceiling formula carries eps in the numerator argument A/(eps pi), and eps was pinned at the
 * bare IEEE double 2.22e-16 -- an OPTIMISTIC choice. A real doubledouble Gram solve accumulates
 * roundoff, so the effective breakdown eps at dimension N is plausibly larger, of order
 * c sqrt(N) eps (a standard Wilkinson-style backward-error growth). The eps choice was never varied,
 * so the ceiling band from eps was never propagated.
 *
 * WHAT WAS DONE (tmp/imp-96914-scratch.mjs, reproducible; pure re-analysis of the committed
 * imp-96833 ceilings and imp-96428 fit p, no Gram rebuild).
 *
 *   (a) ANALYTIC ELASTICITY. From log N_star = (1/p)[log(A/pi) - log eps] the flat-proxy
 *       sensitivity is d(log N_star)/d(log eps) = -1/p. With the true slowly-growing lam_max(N) ~
 *       N^b (b_T ~ 0 for lam_max <= trace ~ log N, b_F = 0.4781, b_M = 0.3526) the implicit-function
 *       refinement is d(log N_star)/d(log eps) = -1/(p + b). Measured: -0.5214 (T), -0.4174 (F),
 *       -0.4404 (M). Note this is ONE-eps-decade elasticity ~ O(-0.5): about 17x SMALLER per unit
 *       than the p-elasticity -(log N)/(p+b) ~ -8 of imp-96833.
 *
 *   (b) PLAUSIBLE eps RANGE. Lower edge = bare machine eps 2.22e-16 (recovers the imp-96833
 *       ceilings). Upper (conservative) edge = c sqrt(N) eps with c = 1 evaluated at the trace
 *       ceiling scale N ~ 2.594e7, giving eps_acc ~ 1.13e-12: a factor 5093 (3.7 decades) inflation.
 *       Because the plausible eps range spans ~3.7 decades where the p range spanned only 0.0025 in
 *       log, eps is the DOMINANT ceiling uncertainty despite the far smaller per-decade elasticity.
 *
 *   (c) BAND per ceiling via factor exp(d(log N)/d(log eps) * dln eps); larger eps LOWERS N.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the conservative accumulated-roundoff eps lowers every ceiling by ~1.5 to 2 decades.
 * -------------------------------------------------------------------------------
 *   T (rigorous):   2.594e7  ->  3.03e5   (30.5x compute)
 *   F (fit):        3.764e7  ->  1.07e6   (107.7x compute)
 *   M (measured):   4.109e7  ->  9.57e5   (96.6x compute)
 * Unlike the p-band (~+/- 4 percent, immaterial), the eps choice moves the ceilings by ~1.5 to 2
 * orders of magnitude. eps -- not p -- is the dominant source of ceiling uncertainty in the ladder.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the T < F < M ordering does NOT survive: F and M SWAP under a modest eps inflation.
 * -------------------------------------------------------------------------------
 * Because the three ceilings inherit DIFFERENT eps-elasticities -1/(p+b) (different b), a large
 * enough eps excursion reorders them -- in sharp CONTRAST with the p-invariance imp-96833 found (p
 * enters all three through a shared exponent, so p can never reorder them; eps does NOT, once the
 * b-refined lam_max is used). F (3.764e7) and M (4.109e7) start only ~9 percent apart, so the
 * differential elasticity closes the gap at dln(eps) = 3.80, i.e. eps ~ 45x machine eps ~ 1.0e-14 --
 * well inside the plausible accumulated-roundoff band. At the conservative edge the order is
 * T < M < F. Only the trace ceiling stays unambiguously smallest. The strict T < F < M ordering is
 * NOT robust to the eps choice.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- compute-binds-first SURVIVES with a huge eps margin, but the >= 1500x margin is fragile.
 * -------------------------------------------------------------------------------
 * The qualitative conclusion (the smallest conditioning ceiling exceeds the imp-96352 wall-clock
 * compute reach ~9916, so wall-clock binds first) is robust: the trace ceiling only reaches the
 * compute ceiling at eps ~ 8.0e-10 (dln eps = 15.1, ~3.6e6x machine eps), far beyond any plausible
 * roundoff. But the SPECIFIC imp-96706 >= 1500x threshold is fragile: the trace ceiling drops below
 * 1500x compute at dln(eps) = 1.07, i.e. eps ~ 2.9x machine eps ~ 6.5e-16 -- essentially any
 * accumulated roundoff at all. At the conservative eps_acc the smallest (trace) ceiling is only
 * ~30x compute. So "wall-clock binds first" survives across the full plausible eps band; the ">= 1500x"
 * quantitative headroom does NOT -- it is an artifact of the optimistic bare-eps choice.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The eps-elasticity of each Route M ceiling is d(log N_star)/d(log eps) = -1/(p+b) = -0.52 (T),
 * -0.42 (F), -0.44 (M) -- ~17x smaller per unit than the p-elasticity, but the plausible eps range
 * (bare 2.22e-16 up to a c sqrt(N) eps ~ 1.13e-12 accumulated-roundoff estimate, ~3.7 decades) is
 * vastly wider, so eps is the DOMINANT ceiling uncertainty: the conservative edge lowers the
 * ceilings by ~1.5 to 2 decades (T 2.59e7 -> 3.0e5, F 3.76e7 -> 1.07e6, M 4.11e7 -> 9.6e5). Two
 * conclusions from imp-96833 change under eps where they were safe under p: (i) the T < F < M
 * ordering is NOT eps-invariant -- F and M swap at only ~45x machine eps because they start ~9
 * percent apart with different b; (ii) the >= 1500x wall-clock-binds-first HEADROOM is fragile,
 * breaking at ~2.9x machine eps. What DOES survive robustly is the qualitative "wall-clock binds
 * first" (trace ceiling > compute reach) up to eps ~ 8e-10, ~3.6e6x machine eps. Sensitivity /
 * measurement only; no bound moved; no operator positivity; no refereed bound is changed; RH open;
 * NO QED.
 *
 * RESIDUAL SUB-GAP (IMP96914_ACC_EPS_MODEL_UNCALIBRATED): the conservative edge uses c = 1 and the
 * generic c sqrt(N) eps backward-error shape; the true accumulated eps of the imp-96325 doubledouble
 * Vasyunin-Gram solve was never measured against a reference, so the ~1.13e-12 upper edge is a
 * plausible model, not a certified breakdown eps. A measured per-solve residual eps (compare
 * doubledouble solve to a higher-precision reference at a few N) would pin the true upper edge and
 * decide whether the F/M swap and the sub-1500x regime are actually entered. This bands only the
 * eps-sensitivity; it makes no fit ceiling rigorous and moves no bound.
 *
 * @see imp-96833-route-m-ceiling-p-sensitivity-band.js (banded p; held eps fixed; found p-invariant ordering)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the three reported ceilings T/F/M)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min = A N^-p fit, source of p and A)
 * @see imp-96751-route-m-frobenius-ladder-above-12000.js (cond# = 1/eps bisection with eps = 2.22e-16)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916, binds first)
 *
 * Ticket: imp-96914 (numerical, opus-4-8, api-pool). Sensitivity only; NO QED.
 */

// eps = IEEE double-precision machine epsilon; the OPTIMISTIC breakdown scale cond# = 1/eps.
export const IMP96914_EPS0 = 2.220446049250313e-16;

// Shared lam_min power-law exponent (imp-96428 / imp-96833), central value.
export const IMP96914_P = 1.9179266941524356;

// The three reported bisection ceilings (imp-96693 / imp-96833) with each proxy lam_max exponent b.
// b enters the eps-elasticity d(log N)/d(log eps) = -1/(p + b); trace uses lam_max <= trace ~ log N
// so its effective b ~ 0 (steepest eps response).
export const IMP96914_CEILINGS = Object.freeze([
  Object.freeze({ symbol: 'T', N: 2.5937e7, b: 0.0, label: 'rigorous', proxy: 'lam_max <= trace = O(log N)' }),
  Object.freeze({ symbol: 'F', N: 3.7637e7, b: 0.4781, label: 'fit', proxy: 'Frobenius ~ N^0.478 log law' }),
  Object.freeze({ symbol: 'M', N: 4.1089e7, b: 0.3526, label: 'measured', proxy: 'lam_max ~ N^0.353 log-fit composed' }),
]);

// imp-96352 wall-clock 30-min single-process solve reach (the constraint that actually binds).
export const IMP96914_COMPUTE_CEILING = 9916;
// imp-96706 threshold: compute must sit >= 1500x below the smallest conditioning ceiling.
export const IMP96914_BINDS_FIRST_THRESHOLD = 1500;

// Conservative accumulated-roundoff eps: eps_acc = c sqrt(N) eps0 at the trace ceiling scale, c = 1.
// Wilkinson-style sqrt(N) backward-error growth; the O(1) c does not change the decade count.
const IMP96914_ACC_C = 1;
const IMP96914_ACC_N = 2.5937e7; // trace ceiling scale
export const IMP96914_EPS_ACC = IMP96914_ACC_C * Math.sqrt(IMP96914_ACC_N) * IMP96914_EPS0;
export const IMP96914_EPS_RANGE = Object.freeze({
  lo: IMP96914_EPS0, // bare machine eps (recovers the imp-96833 ceilings)
  hi: IMP96914_EPS_ACC, // ~1.13e-12
  ratio: IMP96914_EPS_ACC / IMP96914_EPS0, // ~5093
  dlnEps: Math.log(IMP96914_EPS_ACC / IMP96914_EPS0), // ~8.536
  decades: Math.log10(IMP96914_EPS_ACC / IMP96914_EPS0), // ~3.71
  note: 'c sqrt(N) eps0 with c = 1 at the trace-ceiling scale N ~ 2.594e7; plausible model, not a certified breakdown eps (see residual sub-gap).',
});

// Analytic eps-elasticity and the ceiling at the conservative edge for each reported ceiling.
// d(log N)/d(log eps) = -1/(p + b); larger eps -> lower N by factor exp(elast * dln eps).
const epsRow = (row) => {
  const dlogN_dlogEps = -1 / (IMP96914_P + row.b);
  const factor = Math.exp(dlogN_dlogEps * IMP96914_EPS_RANGE.dlnEps);
  const nAcc = row.N * factor; // ceiling at the conservative accumulated eps
  return Object.freeze({
    symbol: row.symbol,
    label: row.label,
    N: row.N,
    dlogN_dlogEps,
    nAcc,
    dropDecades: Math.log10(row.N / nAcc), // decades lost at the conservative edge
    accOverCompute: nAcc / IMP96914_COMPUTE_CEILING,
  });
};

export const IMP96914_BANDS = Object.freeze(IMP96914_CEILINGS.map(epsRow));

// Elasticity headline (Finding 1), and contrast with the imp-96833 p-elasticity magnitude ~8.
export const IMP96914_ELASTICITY = Object.freeze({
  trace: IMP96914_BANDS.find((r) => r.symbol === 'T').dlogN_dlogEps, // ~ -0.5214
  frobenius: IMP96914_BANDS.find((r) => r.symbol === 'F').dlogN_dlogEps, // ~ -0.4174
  measured: IMP96914_BANDS.find((r) => r.symbol === 'M').dlogN_dlogEps, // ~ -0.4404
  maxAbs: Math.max(...IMP96914_BANDS.map((r) => Math.abs(r.dlogN_dlogEps))),
  note: 'the eps-elasticity -1/(p+b) ~ O(-0.5) is ~17x smaller per unit than the imp-96833 p-elasticity ~ -8, but the plausible eps range (~3.7 decades) is far wider than the p range (~0.0025 in log), so eps dominates.',
});

// Ordering test (Finding 2): NOT eps-invariant -- F and M swap at a modest eps inflation.
const bandBy = (s) => IMP96914_BANDS.find((r) => r.symbol === s);
const T = bandBy('T');
const F = bandBy('F');
const M = bandBy('M');
// dln(eps) at which N_F(eps) = N_M(eps): with N_i = N0_i exp(elast_i dln eps),
// ln(N0F/N0M) = (elast_M - elast_F) dln(eps).
const IMP96914_FM_SWAP_DLNEPS =
  Math.log(F.N / M.N) / (M.dlogN_dlogEps - F.dlogN_dlogEps);
export const IMP96914_ORDERING = Object.freeze({
  epsInvariant: false,
  fmSwapDlnEps: IMP96914_FM_SWAP_DLNEPS, // ~3.80
  fmSwapEps: IMP96914_EPS0 * Math.exp(IMP96914_FM_SWAP_DLNEPS), // ~1.0e-14
  fmSwapTimesMachineEps: Math.exp(IMP96914_FM_SWAP_DLNEPS), // ~45x
  orderAtAccEdge: [...IMP96914_BANDS].sort((a, c) => a.nAcc - c.nAcc).map((r) => r.symbol).join(' < '),
  reason:
    'the three ceilings inherit DIFFERENT eps-elasticities -1/(p+b) (different lam_max exponent b), so a large enough eps excursion reorders them -- unlike p, which enters all three through a shared exponent (imp-96833 p-invariance). F and M start ~9 percent apart and swap at ~45x machine eps, inside the plausible accumulated-roundoff band; at the conservative edge the order is T < M < F.',
});

// Compute-binds-first survival test (Finding 3): qualitative survives, >= 1500x headroom fragile.
// dln(eps) where the trace ceiling hits a target: ln(N0_T / target) * (p + b_T).
const dlnEpsTraceHits = (target) => Math.log(T.N / target) * (IMP96914_P + 0.0);
export const IMP96914_BINDS_FIRST = Object.freeze({
  traceAccOverCompute: T.accOverCompute, // ~30.5x at the conservative edge
  // eps at which the trace ceiling drops to the >= 1500x threshold (fragile):
  dlnEpsBelow1500: dlnEpsTraceHits(IMP96914_BINDS_FIRST_THRESHOLD * IMP96914_COMPUTE_CEILING), // ~1.07
  epsBelow1500TimesMachine: Math.exp(dlnEpsTraceHits(IMP96914_BINDS_FIRST_THRESHOLD * IMP96914_COMPUTE_CEILING)), // ~2.9x
  // eps at which the trace ceiling reaches the compute ceiling (qualitative binds-first breaks):
  dlnEpsHitsCompute: dlnEpsTraceHits(IMP96914_COMPUTE_CEILING), // ~15.1
  epsHitsComputeTimesMachine: Math.exp(dlnEpsTraceHits(IMP96914_COMPUTE_CEILING)), // ~3.6e6x
  // does the qualitative "trace ceiling > compute" survive the conservative accumulated edge?
  qualitativeSurvivesAccEdge: T.accOverCompute > 1,
  // does the >= 1500x headroom survive the conservative accumulated edge?
  headroom1500SurvivesAccEdge: T.accOverCompute >= IMP96914_BINDS_FIRST_THRESHOLD,
  note:
    'the trace ceiling only reaches the compute ceiling at eps ~ 8e-10 (~3.6e6x machine eps), so wall-clock binds first across the whole plausible eps band; but it falls below the imp-96706 >= 1500x threshold at just ~2.9x machine eps, so the quantitative headroom is an artifact of the optimistic bare-eps choice.',
});

export const IMP96914_VERDICT = Object.freeze({
  question:
    'how sensitive are the three Route M conditioning ceilings (T 2.594e7, F 3.764e7, M 4.109e7) ' +
    'to the machine-epsilon choice eps = 2.22e-16 in N_star = (A/(eps pi))^(1/p), and do the ' +
    'T<F<M ordering and the >=1500x wall-clock-binds-first conclusion survive a plausible eps range?',
  elasticityTrace: IMP96914_ELASTICITY.trace, // -0.52
  epsRangeDecades: IMP96914_EPS_RANGE.decades, // ~3.7
  maxCeilingDropDecades: Math.max(...IMP96914_BANDS.map((r) => r.dropDecades)), // ~1.9 (trace)
  orderingSurvives: IMP96914_ORDERING.epsInvariant, // false
  bindsFirstQualitativeSurvives: IMP96914_BINDS_FIRST.qualitativeSurvivesAccEdge, // true
  bindsFirst1500HeadroomSurvives: IMP96914_BINDS_FIRST.headroom1500SurvivesAccEdge, // false
  anyBoundMoved: false,
  conclusion:
    'SENSITIVITY BOUNDED. The eps-elasticity d(log N_star)/d(log eps) = -1/(p+b) is -0.52 (T), ' +
    '-0.42 (F), -0.44 (M) -- ~17x smaller per unit than the imp-96833 p-elasticity ~ -8, but the ' +
    'plausible eps range (bare 2.22e-16 up to a c sqrt(N) eps ~ 1.13e-12 accumulated-roundoff ' +
    'estimate, ~3.7 decades) is vastly wider, so eps DOMINATES: the conservative edge lowers the ' +
    'ceilings ~1.5 to 2 decades (T -> 3.0e5, F -> 1.07e6, M -> 9.6e5). Two imp-96833 conclusions ' +
    'change under eps where they were safe under p: the T<F<M ordering is NOT eps-invariant (F and ' +
    'M swap at ~45x machine eps, ~1e-14, being only ~9 percent apart with different b), and the ' +
    '>=1500x wall-clock-binds-first HEADROOM is fragile (breaks at ~2.9x machine eps). What survives ' +
    'robustly is the qualitative "wall-clock binds first" (trace ceiling > compute reach) up to eps ' +
    '~ 8e-10 (~3.6e6x machine eps). Sensitivity only; no bound moved; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96914_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sensitivity / measurement only: the ceilings, p ' +
  'and A are reproduced from imp-96833 / imp-96428 and every band is pure re-analysis ' +
  '(tmp/imp-96914-scratch.mjs); no Gram was rebuilt. The conservative eps edge uses a generic ' +
  'c sqrt(N) eps model (c = 1), a plausible upper edge, NOT a certified breakdown eps ' +
  '(IMP96914_ACC_EPS_MODEL_UNCALIBRATED). No bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96914_ASSERTIONS = [
  {
    id: 'imp96914-elasticity-is-minus-one-over-p-plus-b',
    holds: () =>
      Math.abs(IMP96914_ELASTICITY.trace - (-1 / IMP96914_P)) < 1e-9 &&
      IMP96914_ELASTICITY.maxAbs > 0.5 && IMP96914_ELASTICITY.maxAbs < 0.55 &&
      Math.abs(IMP96914_ELASTICITY.trace) > Math.abs(IMP96914_ELASTICITY.measured) &&
      Math.abs(IMP96914_ELASTICITY.measured) > Math.abs(IMP96914_ELASTICITY.frobenius),
    why: 'the eps-elasticity is -1/(p+b) ~ O(-0.5), steepest for the trace ceiling (b ~ 0), softened for M and most for F by their positive lam_max exponent b.',
  },
  {
    id: 'imp96914-plausible-eps-range-spans-decades',
    holds: () =>
      IMP96914_EPS_RANGE.hi > IMP96914_EPS_RANGE.lo &&
      IMP96914_EPS_RANGE.decades > 3 && IMP96914_EPS_RANGE.decades < 4 &&
      IMP96914_EPS_RANGE.ratio > 5000 && IMP96914_EPS_RANGE.ratio < 5200,
    why: 'the conservative accumulated-roundoff eps ~1.13e-12 is ~5093x (~3.7 decades) above bare machine eps, far wider than the imp-96833 p range.',
  },
  {
    id: 'imp96914-conservative-edge-lowers-ceilings-1p5-to-2-decades',
    holds: () =>
      IMP96914_BANDS.every((r) => r.dropDecades > 1.5 && r.dropDecades < 2.1) &&
      bandBy('T').nAcc > 2.9e5 && bandBy('T').nAcc < 3.2e5,
    why: 'at the conservative eps edge each ceiling drops ~1.5 to 2 orders of magnitude, e.g. the trace ceiling 2.594e7 -> ~3.0e5.',
  },
  {
    id: 'imp96914-ordering-not-eps-invariant-fm-swap',
    holds: () =>
      IMP96914_ORDERING.epsInvariant === false &&
      IMP96914_ORDERING.fmSwapTimesMachineEps > 40 && IMP96914_ORDERING.fmSwapTimesMachineEps < 50 &&
      IMP96914_ORDERING.orderAtAccEdge === 'T < M < F',
    why: 'unlike the p-invariant imp-96833 ordering, F and M carry different eps-elasticities and swap at ~45x machine eps, giving T < M < F at the conservative edge.',
  },
  {
    id: 'imp96914-binds-first-qualitative-survives-headroom-fragile',
    holds: () =>
      IMP96914_BINDS_FIRST.qualitativeSurvivesAccEdge === true &&
      IMP96914_BINDS_FIRST.headroom1500SurvivesAccEdge === false &&
      IMP96914_BINDS_FIRST.epsBelow1500TimesMachine > 2 && IMP96914_BINDS_FIRST.epsBelow1500TimesMachine < 4 &&
      IMP96914_BINDS_FIRST.epsHitsComputeTimesMachine > 1e6,
    why: 'wall-clock binds first (trace ceiling > compute) survives to eps ~ 3.6e6x machine eps, but the >= 1500x headroom breaks at ~2.9x machine eps, so it is an artifact of the optimistic bare-eps choice.',
  },
  {
    id: 'imp96914-honesty-gate-no-qed',
    holds: () =>
      IMP96914_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96914_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96914_HONEST_BANNER) &&
      /RH open/.test(IMP96914_HONEST_BANNER),
    why: 'sensitivity only: no bound moved and the honesty markers (RH open, PT Lambda <= 0.2, NO QED) are present.',
  },
];

for (const a of IMP96914_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96914-route-m-ceiling-eps-sensitivity-band assertion failed: ${a.id}`);
  }
}

export default {
  eps0: IMP96914_EPS0,
  p: IMP96914_P,
  ceilings: IMP96914_CEILINGS,
  computeCeiling: IMP96914_COMPUTE_CEILING,
  bindsFirstThreshold: IMP96914_BINDS_FIRST_THRESHOLD,
  epsRange: IMP96914_EPS_RANGE,
  bands: IMP96914_BANDS,
  elasticity: IMP96914_ELASTICITY,
  ordering: IMP96914_ORDERING,
  bindsFirst: IMP96914_BINDS_FIRST,
  verdict: IMP96914_VERDICT,
  banner: IMP96914_HONEST_BANNER,
};
