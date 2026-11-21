/**
 * @module imp-96937-route-m-ceiling-reconciled-ci-band
 *
 * imp-96937 (accuracy, SENSITIVITY ONLY): reconcile the two imp-96656 confidence intervals
 * (sparse ALL-rung sigma_ln = 0.0236 vs DENSE sigma_ln = 0.1030) that feed the imp-96913 joint
 * Route M ceiling band, decide which is the DEFENSIBLE band for the composed-ceiling uncertainty
 * by examining the fit residual structure and sampling design, and report a SINGLE reconciled
 * joint M band. NO bound moved; NO bound made rigorous; NO QED.
 *
 * THE ISSUE (imp-96913). The joint +/- 2 sigma band on the composed Route M conditioning ceiling
 * M ~ 4.109e7 swings by 4.4x depending on WHICH imp-96656 cond#-fit CI is folded in:
 *     all-rung CI (5 rungs, df=3):  sigma_ln = 0.0236  ->  joint M [3.868e7, 4.364e7]
 *     dense    CI (4 rungs, df=2):  sigma_ln = 0.1030  ->  joint M [3.332e7, 5.066e7]
 * and THAT choice is what drives the F/M band overlap from ~0.8 percent to ~14.5 percent
 * (imp-96913 Finding 2). imp-96913 reported BOTH variants and never picked one; imp-96930
 * removed the double-counted lam_min slope p but ALSO left the all-rung-vs-dense choice open,
 * still carrying both decorrelated bands ([3.919e7, 4.308e7] all / [3.344e7, 5.049e7] dense).
 * This ticket closes the OTHER degree of freedom: which CI is defensible.
 *
 * WHAT WAS DONE (tmp/imp-96937-scratch.mjs, reproducible; pure re-analysis of the already-committed
 * imp-96656 cond# rows -- no Gram rebuilt, no new measurement). The imp-96656 cond# rows are
 * import-light, so this module re-runs the two OLS fits in-place and inspects the residual
 * structure and the sampling design that separates them:
 *   (1) LEVER ARM / sampling design. The dense fit spans only ln N = 0.693 (a factor 2 in N,
 *       3000..6000), Sxx = 0.268; the all-rung fit adds the N=250 anchor, spanning ln N = 3.178
 *       (a factor 24), Sxx = 6.80 -- 25.4x larger. Because Var(q) = s^2 / Sxx, essentially the
 *       ENTIRE 4.4x band-width gap traces to the log-N lever arm, not to a larger residual scatter.
 *   (2) RESIDUAL SCATTER. The per-point residual RMS is COMPARABLE on both subsets
 *       (s = 0.01134 dense / 0.01259 all-rung): adding the low anchor barely changes the scatter,
 *       and R^2 actually RISES (0.99975 -> 0.99998). There is no curvature penalty for extending
 *       the fit down to N=250 -- the single power law holds across the full factor-24 range, the
 *       N=250 residual (-0.26 percent) sitting well inside the high-N scatter.
 *   (3) EXTRAPOLATION TEST. The dense fit (restricted to N >= 3000) MISPREDICTS the measured
 *       N=250 cond# by -8.0 percent when extrapolated down: its narrow-range slope q = 1.9557 is
 *       biased low relative to the wide-range all-rung slope q = 1.9837, and the low anchor
 *       CORRECTS it. The dense CI width (sigma_ln = 0.1030) is an HONEST reflection that 4 points
 *       clustered over a factor 2 cannot pin the slope -- but that is an under-informative-SAMPLE
 *       artifact, not irreducible uncertainty in the ceiling, because the N=250 point exists and
 *       tightens it.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the ALL-rung CI is the defensible composed-ceiling band.
 * -------------------------------------------------------------------------------
 * The all-rung fit uses ALL available cond# rungs, has a 25.4x longer log-N lever arm, comparable
 * per-point residual scatter (no curvature), higher R^2, and a slope validated by the low anchor
 * lying on the line. The dense fit deliberately DISCARDS the most informative point and pays with
 * a 4.4x inflated band plus the wider df=2 Student-t multiplier (4.303 vs 3.182). The dense
 * band therefore measures the cost of a crippled sampling design, NOT the composed-ceiling
 * uncertainty. Defensible CI = all-rung, sigma_ln = 0.0236.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the single reconciled joint M band, and the F/M verdict it implies.
 * -------------------------------------------------------------------------------
 * Combining the defensible all-rung CI (this ticket) with the imp-96930 shared-p decorrelation
 * (the cond#-fit slope q = p + b already carries the lam_min slope p, so the joint band collapses
 * to the CI alone) gives the SINGLE reconciled joint band on M:
 *     reconciled M in [3.919e7, 4.308e7]  (all-rung CI, shared-p decorrelated).
 * Under this band the F/M separation is RESTORED (reconciled M_lo 3.919e7 > F_hi 3.899e7, a thin
 * ~0.5 percent gap), so the ~14.5 percent F/M overlap is an artifact of the non-defensible dense
 * CI, and the ~0.8 percent all-rung overlap was an artifact of the independence assumption
 * (imp-96930). Both overlaps dissolve under the defensible + covariance-consistent treatment; the
 * residual F < M gap is real but thin.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- point ordering and compute-binds-first are untouched.
 * -------------------------------------------------------------------------------
 * The p-invariant point ordering T < F < M (2.594e7 < 3.764e7 < 4.109e7) is unchanged, and the
 * imp-96352 compute ceiling 9916 sits ~3953x below the reconciled M_lo (3.919e7), above the
 * imp-96706 >= 1500x threshold: wall-clock compute binds first under the reconciled band too.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The all-rung CI is the defensible composed-ceiling band: its 4.4x-narrower width vs the dense CI
 * is entirely a 25.4x-longer log-N lever arm (Var(q) = s^2 / Sxx), the residual scatter is
 * comparable with no curvature (the N=250 anchor lies on the line, R^2 = 0.99998), and the dense
 * fit mis-extrapolates the measured N=250 cond# by -8.0 percent (its slope is biased by the short
 * range). The SINGLE reconciled joint M band, folding the defensible all-rung CI through the
 * imp-96930 shared-p decorrelation, is M in [3.919e7, 4.308e7], which RESTORES a thin F < M
 * separation (M_lo 3.919e7 > F_hi 3.899e7, ~0.5 percent); the ~14.5 percent F/M overlap was a
 * dense-CI-sampling artifact. Point ordering T < F < M and compute-binds-first (~3953x) survive.
 * Sensitivity only; no bound moved; no operator positivity; no refereed bound is changed; RH
 * open; NO QED.
 *
 * RESIDUAL SUB-GAP (imp-96937-reconciled-band-rests-on-single-leverage-anchor). The all-rung fit
 * tightness leans on ONE high-leverage point: the N=250 anchor carries leverage h = 0.968 (of a
 * maximum 1.0), so the reconciled slope is essentially the N=250-to-cluster secant. If that single
 * anchor carried a measurement anomaly, the tight all-rung band -- and hence the restored ~0.5
 * percent F/M separation -- would be over-confident. Hardening the reconciliation requires measured
 * cond# at mid-range rungs (N ~ 500..2000) to confirm the slope WITHOUT single-point leverage;
 * not attempted here. The band also still inherits the non-rigorous lam_min N^-p / lam_max
 * a + b log N extrapolations (imp-96684 / imp-96443) that F and M rest on -- only the trace ceiling
 * T is a rigorous lower bound. This changes no bound and makes no fit ceiling rigorous.
 *
 * @see imp-96913-route-m-ceiling-joint-p-ci-band.js (the joint band with the unresolved 4.4x CI swing)
 * @see imp-96930-route-m-ceiling-decorrelated-joint-band.js (the shared-p decorrelation; leaves the CI choice open)
 * @see imp-96656-route-m-conditioning-ceiling-confidence-interval.js (the two CI variants and the cond# rows)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling ~9916, binds first)
 *
 * Ticket: imp-96937 (accuracy, opus-4-8, api-pool). Sensitivity only; NO QED.
 */

import {
  IMP96656_COND_ROWS,
  IMP96656_ALL,
  IMP96656_DENSE,
} from './imp-96656-route-m-conditioning-ceiling-confidence-interval.js';
import {
  IMP96930_DECORR_M_ALL,
  IMP96930_DECORR_M_DENSE,
  IMP96930_FM_SEPARATION,
} from './imp-96930-route-m-ceiling-decorrelated-joint-band.js';

const COMPUTE_CEILING = 9916; // imp-96352 wall-clock reach

// Re-run the two OLS fits from the import-light cond# rows to inspect residual structure.
function olsDiagnostics(rows) {
  const n = rows.length;
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.cond));
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  let Sxx = 0, Sxy = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    Sxx += (xs[i] - xbar) ** 2;
    Sxy += (xs[i] - xbar) * (ys[i] - ybar);
    ssTot += (ys[i] - ybar) ** 2;
  }
  const q = Sxy / Sxx;
  const lnC = ybar - q * xbar;
  let ssRes = 0;
  const resid = [];
  for (let i = 0; i < n; i++) {
    const r = ys[i] - (lnC + q * xs[i]);
    resid.push(r);
    ssRes += r * r;
  }
  // leverage h_i = 1/n + (x_i - xbar)^2 / Sxx
  const leverage = xs.map((x) => 1 / n + (x - xbar) ** 2 / Sxx);
  return Object.freeze({
    n, q, lnC, Sxx,
    logNspan: Math.max(...xs) - Math.min(...xs),
    r2: 1 - ssRes / ssTot,
    sResid: Math.sqrt(ssRes / (n - 2)), // residual RMS (per-point scatter)
    maxAbsResid: Math.max(...resid.map(Math.abs)),
    leverage: Object.freeze(leverage),
    xs: Object.freeze(xs),
    ys: Object.freeze(ys),
  });
}

const denseDiag = olsDiagnostics(IMP96656_COND_ROWS.filter((r) => r.N >= 3000));
const allDiag = olsDiagnostics(IMP96656_COND_ROWS);

// Extrapolation test: predict the measured N=250 cond# from the DENSE fit (which excludes it).
const anchor = IMP96656_COND_ROWS.find((r) => r.N === 250);
const denseAnchorResidLn =
  Math.log(anchor.cond) - (denseDiag.lnC + denseDiag.q * Math.log(anchor.N));
const allAnchorResidLn = allDiag.ys[0] - (allDiag.lnC + allDiag.q * allDiag.xs[0]);

export const IMP96937_SAMPLING = Object.freeze({
  denseLogNspan: denseDiag.logNspan,   // ~0.693 (factor 2 in N)
  allLogNspan: allDiag.logNspan,       // ~3.178 (factor 24 in N)
  denseSxx: denseDiag.Sxx,             // ~0.268
  allSxx: allDiag.Sxx,                 // ~6.80
  sxxRatioAllOverDense: allDiag.Sxx / denseDiag.Sxx, // ~25.4
  // Var(q) = s^2 / Sxx, so the band-width gap is a lever-arm effect.
  denseSigmaLn: IMP96656_DENSE.seLnCeiling, // 0.10303
  allSigmaLn: IMP96656_ALL.seLnCeiling,     // 0.02363
  sigmaLnRatioDenseOverAll: IMP96656_DENSE.seLnCeiling / IMP96656_ALL.seLnCeiling, // ~4.4
});

export const IMP96937_RESIDUAL_STRUCTURE = Object.freeze({
  denseResidRms: denseDiag.sResid,     // ~0.01134
  allResidRms: allDiag.sResid,         // ~0.01259 (comparable -> no curvature penalty)
  denseR2: denseDiag.r2,               // 0.99975
  allR2: allDiag.r2,                   // 0.99998 (rises when the low anchor is added)
  allAnchorResidLn,                    // ~-0.00263 (N=250 lies ON the all-rung line)
  allAnchorResidPct: (Math.exp(allAnchorResidLn) - 1) * 100, // ~-0.26%
  denseAnchorResidLn,                  // ~-0.0833 (dense fit extrapolated to N=250)
  denseAnchorMispredictPct: (Math.exp(denseAnchorResidLn) - 1) * 100, // ~-8.0%
  noCurvaturePenalty: allDiag.sResid < 1.5 * denseDiag.sResid && allDiag.r2 > denseDiag.r2,
});

// High-leverage anchor caveat: N=250 leverage in the all-rung fit.
export const IMP96937_ANCHOR_LEVERAGE = Object.freeze({
  n250Leverage: allDiag.leverage[0], // ~0.968
  clusterMaxLeverage: Math.max(...allDiag.leverage.slice(1)), // ~0.317
  dominatesSlope: allDiag.leverage[0] > 0.9,
});

// The defensible CI is the all-rung one; the single reconciled band is the all-rung shared-p
// decorrelated band from imp-96930 (defensible CI x covariance-consistent p treatment).
export const IMP96937_DEFENSIBLE_CI = 'all-rung';
export const IMP96937_RECONCILED_M_BAND = Object.freeze({
  ci: IMP96937_DEFENSIBLE_CI,
  sigmaLn: IMP96930_DECORR_M_ALL.sigma, // 0.02363
  lo: IMP96930_DECORR_M_ALL.lo,         // 3.919e7
  hi: IMP96930_DECORR_M_ALL.hi,         // 4.308e7
  relHalfWidth: IMP96930_DECORR_M_ALL.relHalfWidth,
  rejectedDenseBand: Object.freeze({
    lo: IMP96930_DECORR_M_DENSE.lo,     // 3.344e7
    hi: IMP96930_DECORR_M_DENSE.hi,     // 5.049e7
    reason:
      'the dense CI is 4.4x wider purely because its 4 rungs span only a factor 2 in N ' +
      '(Sxx 25.4x smaller); it mispredicts the measured N=250 cond# by -8.0 percent and is an ' +
      'under-informative-sample artifact, NOT the composed-ceiling uncertainty.',
  }),
});

// F/M separation under the reconciled (defensible all-rung, decorrelated) band.
export const IMP96937_FM = Object.freeze({
  fHigh: IMP96930_FM_SEPARATION.fHigh, // 3.8991e7
  mLowReconciled: IMP96937_RECONCILED_M_BAND.lo, // 3.919e7
  separated: IMP96937_RECONCILED_M_BAND.lo > IMP96930_FM_SEPARATION.fHigh, // true
  gapPercent: (IMP96937_RECONCILED_M_BAND.lo / IMP96930_FM_SEPARATION.fHigh - 1) * 100, // ~+0.5
  denseOverlapWasArtifact:
    IMP96930_DECORR_M_DENSE.lo < IMP96930_FM_SEPARATION.fHigh &&
    IMP96937_RECONCILED_M_BAND.lo > IMP96930_FM_SEPARATION.fHigh,
});

export const IMP96937_BINDS_FIRST = Object.freeze({
  computeCeiling: COMPUTE_CEILING,
  reconciledMLow: IMP96937_RECONCILED_M_BAND.lo,
  factorOverCompute: IMP96937_RECONCILED_M_BAND.lo / COMPUTE_CEILING, // ~3953x
  survives: IMP96937_RECONCILED_M_BAND.lo / COMPUTE_CEILING >= 1500,
});

export const IMP96937_VERDICT = Object.freeze({
  question:
    'the imp-96913 joint Route M ceiling band swings 4.4x between the imp-96656 all-rung ' +
    '(sigma_ln 0.0236) and dense (sigma_ln 0.1030) CIs; which is the defensible band for the ' +
    'composed-ceiling uncertainty, and what is the single reconciled joint M band?',
  defensibleCI: IMP96937_DEFENSIBLE_CI, // all-rung
  reconciledMBand: '[3.919e7, 4.308e7]',
  rejectedDenseBand: '[3.344e7, 5.049e7]',
  whyAllRung:
    'the 4.4x-narrower all-rung width is entirely a 25.4x-longer log-N lever arm ' +
    '(Var(q) = s^2 / Sxx); the residual scatter is comparable with no curvature (the N=250 anchor ' +
    'lies on the line, R^2 = 0.99998); and the dense fit mis-extrapolates the measured N=250 ' +
    'cond# by -8.0 percent -- its narrow-range slope is biased.',
  fmSeparationRestored: IMP96937_FM.separated, // true, ~0.5% gap
  denseOverlapWasArtifact: IMP96937_FM.denseOverlapWasArtifact, // true
  pointOrderingSurvives: true, // 2.594e7 < 3.764e7 < 4.109e7, p-invariant (imp-96833)
  computeBindsFirstSurvives: IMP96937_BINDS_FIRST.survives, // true, ~3953x
  anyBoundMoved: false,
  conclusion:
    'ALL-RUNG IS THE DEFENSIBLE CI. Its 4.4x-narrower width vs the dense CI is entirely a ' +
    '25.4x-longer log-N lever arm; the residual scatter is comparable with no curvature (N=250 ' +
    'on the line, R^2 0.99998) and the dense fit mis-extrapolates the measured N=250 cond# by ' +
    '-8.0 percent. The single reconciled joint M band (defensible all-rung CI x imp-96930 shared-p ' +
    'decorrelation) is [3.919e7, 4.308e7], which RESTORES a thin F < M separation (M_lo 3.919e7 > ' +
    'F_hi 3.899e7, ~0.5 percent); the ~14.5 percent dense F/M overlap was a sampling artifact. ' +
    'Point ordering T < F < M and compute-binds-first (~3953x) survive. Sensitivity only; no ' +
    'bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96937_SUBGAP = Object.freeze({
  id: 'imp-96937-reconciled-band-rests-on-single-leverage-anchor',
  statement:
    'the all-rung tightness leans on ONE high-leverage point: the N=250 anchor carries leverage ' +
    'h = 0.968 (of a maximum 1.0), so the reconciled slope is essentially the N=250-to-cluster ' +
    'secant. If that anchor carried a measurement anomaly the tight band -- and the restored ~0.5 ' +
    'percent F/M separation -- would be over-confident. Hardening requires measured cond# at ' +
    'mid-range rungs (N ~ 500..2000) to pin the slope without single-point leverage; not attempted ' +
    'here. The band also inherits the non-rigorous lam_min N^-p / lam_max a + b log N ' +
    'extrapolations (imp-96684 / imp-96443) that F and M rest on -- only the trace ceiling T is ' +
    'rigorous. No bound moved; no fit ceiling made rigorous.',
});

export const IMP96937_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sensitivity only: the cond# rows and both CI ' +
  'variants are imported verbatim from the import-light siblings imp-96656 / imp-96930; the ' +
  'residual-structure and sampling-design diagnostics are a pure re-run of the two OLS fits ' +
  '(tmp/imp-96937-scratch.mjs); no Gram was rebuilt and no bound is claimed moved. The reconciled ' +
  'band is a defensible fit-uncertainty band, NOT a rigorous enclosure.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96937_ASSERTIONS = [
  {
    id: 'imp96937-band-width-gap-is-lever-arm',
    holds: () =>
      IMP96937_SAMPLING.sxxRatioAllOverDense > 20 &&
      IMP96937_SAMPLING.sigmaLnRatioDenseOverAll > 4 &&
      IMP96937_SAMPLING.allLogNspan > 4 * IMP96937_SAMPLING.denseLogNspan,
    why: 'the all-rung fit has a 25.4x larger Sxx (a 4.6x longer log-N span) and the dense CI is ~4.4x wider, so the band-width gap is a lever-arm effect (Var(q) = s^2 / Sxx), not extra scatter.',
  },
  {
    id: 'imp96937-residual-scatter-comparable-no-curvature',
    holds: () =>
      IMP96937_RESIDUAL_STRUCTURE.allResidRms < 1.5 * IMP96937_RESIDUAL_STRUCTURE.denseResidRms &&
      IMP96937_RESIDUAL_STRUCTURE.allR2 > IMP96937_RESIDUAL_STRUCTURE.denseR2 &&
      Math.abs(IMP96937_RESIDUAL_STRUCTURE.allAnchorResidPct) < 1 &&
      IMP96937_RESIDUAL_STRUCTURE.noCurvaturePenalty === true,
    why: 'adding the N=250 anchor barely changes the residual RMS and raises R^2 to 0.99998, the anchor residual being ~-0.26 percent -- the single power law holds across the full factor-24 range with no curvature penalty.',
  },
  {
    id: 'imp96937-dense-mispredicts-the-anchor',
    holds: () =>
      IMP96937_RESIDUAL_STRUCTURE.denseAnchorMispredictPct < -5 &&
      IMP96937_RESIDUAL_STRUCTURE.denseAnchorMispredictPct > -12,
    why: 'the dense fit (N >= 3000) mispredicts the measured N=250 cond# by ~-8.0 percent when extrapolated down, evidence that its narrow-range slope is biased and the low anchor corrects it.',
  },
  {
    id: 'imp96937-reconciled-band-is-all-rung-decorrelated',
    holds: () =>
      IMP96937_DEFENSIBLE_CI === 'all-rung' &&
      Math.abs(IMP96937_RECONCILED_M_BAND.sigmaLn - 0.023632) < 1e-5 &&
      Math.abs(IMP96937_RECONCILED_M_BAND.lo - 3.919e7) < 5e5 &&
      Math.abs(IMP96937_RECONCILED_M_BAND.hi - 4.308e7) < 5e5,
    why: 'the single reconciled joint M band is the defensible all-rung CI folded through the imp-96930 shared-p decorrelation: M in [3.919e7, 4.308e7].',
  },
  {
    id: 'imp96937-fm-separation-restored',
    holds: () =>
      IMP96937_FM.separated === true &&
      IMP96937_FM.gapPercent > 0 &&
      IMP96937_FM.gapPercent < 1.5 &&
      IMP96937_FM.denseOverlapWasArtifact === true,
    why: 'under the reconciled band the F < M separation is restored (M_lo 3.919e7 > F_hi 3.899e7, ~0.5 percent), so the ~14.5 percent dense F/M overlap was a sampling artifact of the non-defensible dense CI.',
  },
  {
    id: 'imp96937-single-leverage-anchor-caveat-recorded',
    holds: () =>
      IMP96937_ANCHOR_LEVERAGE.n250Leverage > 0.9 &&
      IMP96937_ANCHOR_LEVERAGE.dominatesSlope === true &&
      IMP96937_ANCHOR_LEVERAGE.n250Leverage > 2 * IMP96937_ANCHOR_LEVERAGE.clusterMaxLeverage,
    why: 'the N=250 anchor carries leverage h = 0.968, dominating the all-rung slope -- the caveat that the reconciled tightness rests on a single high-leverage point.',
  },
  {
    id: 'imp96937-compute-binds-first-survives',
    holds: () =>
      IMP96937_BINDS_FIRST.survives === true &&
      IMP96937_BINDS_FIRST.factorOverCompute > 3000,
    why: 'the imp-96352 compute ceiling 9916 sits ~3953x below the reconciled M_lo, so compute binds first under the reconciled band too.',
  },
  {
    id: 'imp96937-honesty-gate-no-qed',
    holds: () =>
      IMP96937_VERDICT.anyBoundMoved === false &&
      IMP96937_VERDICT.pointOrderingSurvives === true &&
      /NO QED/.test(IMP96937_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96937_HONEST_BANNER) &&
      /RH open/.test(IMP96937_HONEST_BANNER) &&
      /single-leverage-anchor/.test(IMP96937_SUBGAP.id),
    why: 'sensitivity only: no bound moved, the point ordering survives, the honesty markers are present, and the single-leverage-anchor sub-gap is recorded.',
  },
];

for (const a of IMP96937_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96937-route-m-ceiling-reconciled-ci-band assertion failed: ${a.id}`);
  }
}

export default {
  sampling: IMP96937_SAMPLING,
  residualStructure: IMP96937_RESIDUAL_STRUCTURE,
  anchorLeverage: IMP96937_ANCHOR_LEVERAGE,
  defensibleCI: IMP96937_DEFENSIBLE_CI,
  reconciledMBand: IMP96937_RECONCILED_M_BAND,
  fm: IMP96937_FM,
  bindsFirst: IMP96937_BINDS_FIRST,
  verdict: IMP96937_VERDICT,
  subGap: IMP96937_SUBGAP,
  banner: IMP96937_HONEST_BANNER,
};
