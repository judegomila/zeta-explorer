/**
 * @module imp-97060-route-m-fm-discriminant-crossvalidation
 *
 * imp-97060 (accuracy, MEASUREMENT/TABULATION ONLY): assembles the explicit
 * predicted-vs-anchor cross-validation table that imp-97033 never wrote down.
 *
 * imp-97033 inverted the measured quad-vs-tail ceiling spread S(N_top) log-decay law
 *   ln(spread percent) = alpha + beta * log10(N_top)    [alpha ~ 4.553, beta ~ -0.6235]
 * to scope the top exact Vasyunin-Gram ||G||_F rung N_top needed for a DATA-ALONE Route M
 * concave-quad ceiling rejection at each confidence, and it stated that the law "recovers the
 * imp-96912 anchors S(16000)=6.892, S(24000)=6.221 percent" -- but the predicted-vs-anchor
 * agreement was never assembled as an explicit table with the fit residual quoted at the anchors.
 * This leaf does exactly that, and only that: (1) for each confidence level (1/5/10 percent target
 * spread) it tabulates the N_top the inverted law predicts, and (2) it back-checks the law against
 * every exact imp-96912-derived truncation rung S(N_top) actually attains, reporting the signed
 * residual (law minus exact, in percentage points) at each rung and the RMS over the fit window.
 * No new fit, no Gram rebuilt, no O(N^3) rung computed: the decay fit and the exact spread ladder
 * are imported verbatim from imp-97033. Only the trace ceiling T ~ 2.594e7 stays rigorous; F, M
 * inherit non-rigorous extrapolations; no bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * (1) THE CONFIDENCE TABLE (invert the imp-97033 decay law at each target spread).
 * -------------------------------------------------------------------------------
 * Larger target spread S* is EASIER (needs fewer rungs) because the spread shrinks as N_top grows:
 *   S* = 10 percent  N_top ~ 4.07e3   (BELOW the exact ladder window -- a downward extrapolation)
 *   S* =  5 percent  N_top ~ 5.26e4   (just above the current top exact rung N = 24000)
 *   S* =  1 percent  N_top ~ 2.01e7   (~49 percent of N* ~ 4e7; matches the imp-97033 threshold)
 * The 1-percent rung reproduces the imp-97033 IMP97033_THRESHOLD_LADDER 1-percent entry (~2.01e7),
 * confirming the two derivations are consistent.
 *
 * -------------------------------------------------------------------------------
 * (2) THE ANCHOR BACK-CHECK (law prediction vs exact measured spread at each truncation rung).
 * -------------------------------------------------------------------------------
 * The imp-97033 decay fit is fit over N_top >= 12000. Evaluating the law at each exact truncation
 * rung and differencing against the EXACT measured spread gives the fit residual (percentage points):
 *   N_top=8000  exact 8.369  law 8.327  resid -0.042  [out of fit window]
 *   N_top=10000 exact 7.875  law 7.839  resid -0.037  [out of fit window]
 *   N_top=12000 exact 7.484  law 7.461  resid -0.023
 *   N_top=14000 exact 7.163  law 7.156  resid -0.007
 *   N_top=16000 exact 6.892  law 6.902  resid +0.009  [imp-96912 anchor]
 *   N_top=18000 exact 6.659  law 6.685  resid +0.026
 *   N_top=20000 exact 6.455  law 6.497  resid +0.042
 *   N_top=22000 exact 6.342  law 6.332  resid -0.010
 *   N_top=24000 exact 6.221  law 6.184  resid -0.037  [imp-96912 anchor]
 * At the two imp-96912 anchors the law agrees to +0.009 / -0.037 percentage points; the RMS residual
 * over the fit window (N_top >= 12000) is ~0.026 pp and the max is ~0.042 pp. So the log-decay law is
 * a faithful (~0.4 percent relative) fit to the exact anchors it was fit through -- the extrapolation
 * risk in the imp-97033 confidence table is dominated by the ~3.3-decade reach to N*, NOT by any
 * misfit at the anchors.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest tabulation).
 * -------------------------------------------------------------------------------
 * The imp-97033 inverted decay law is cross-validated against the exact imp-96912 anchor rungs: the
 * confidence table (10/5/1 percent -> N_top ~ 4.07e3 / 5.26e4 / 2.01e7) is consistent with the
 * imp-97033 threshold ladder, and the anchor back-check shows the law reproduces the exact measured
 * spread to <= 0.042 pp everywhere and to +0.009 / -0.037 pp at the two imp-96912 anchors. This does
 * not move any bound: it only certifies that the near-field fit is faithful, so the honest obstruction
 * stays the ~49-percent-of-N* far reach (imp-97033 sub-gap). Measurement/tabulation only; only the
 * trace ceiling T ~ 2.594e7 is rigorous; no bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97033-route-m-fm-discriminant-reach-threshold.js (the inverted decay law + threshold ladder)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (the 24-rung exact ||G||_F ladder + anchors)
 *
 * Ticket: imp-97060 (accuracy, opus-4-8, api-pool). Measurement/tabulation only; honest; NO QED.
 */

import {
  IMP97033_SPREAD_LADDER,
  IMP97033_DECAY_FIT,
  IMP97033_THRESHOLD_LADDER,
} from './imp-97033-route-m-fm-discriminant-reach-threshold.js';

// The imp-97033 log-decay law, imported verbatim (no refit).
const { alpha, betaPerDecade: beta } = IMP97033_DECAY_FIT;

// law-predicted ceiling spread (percent) at a top exact rung N_top.
const lawSpreadPct = (nTop) => Math.exp(alpha + beta * Math.log10(nTop));
// inverse: the N_top the law predicts is needed to reach a target spread S* (percent).
const nTopForSpreadPct = (sPct) => Math.pow(10, (Math.log(sPct) - alpha) / beta);

// The two exact imp-96912 rungs imp-97033 names as anchors.
const ANCHOR_NTOPS = [16000, 24000];

// -------------------------------------------------------------------------------
// (1) confidence table: target spread S* -> predicted N_top.
// -------------------------------------------------------------------------------
export const IMP97060_CONFIDENCE_TABLE = Object.freeze(
  [10, 5, 1].map((sPct) => {
    const nTop = nTopForSpreadPct(sPct);
    return Object.freeze({
      targetSpreadPct: sPct,
      nTopRequired: nTop,
      // is the predicted rung inside the exact ladder window (8000..24000) or an extrapolation?
      insideExactWindow: nTop >= 8000 && nTop <= 24000,
      aboveCurrentTopRung: nTop > 24000,
    });
  }),
);

// -------------------------------------------------------------------------------
// (2) anchor back-check: law prediction vs exact measured spread at each truncation rung.
// -------------------------------------------------------------------------------
export const IMP97060_ANCHOR_BACKCHECK = Object.freeze(
  IMP97033_SPREAD_LADDER.map((r) => {
    const law = lawSpreadPct(r.nTop);
    return Object.freeze({
      nTop: r.nTop,
      exactSpreadPct: r.spreadPct,
      lawSpreadPct: law,
      residualPct: law - r.spreadPct, // law minus exact, in percentage points
      inFitWindow: r.nTop >= 12000, // the imp-97033 decay fit window
      isImp96912Anchor: ANCHOR_NTOPS.includes(r.nTop),
    });
  }),
);

// residual summary over the imp-97033 fit window (N_top >= 12000) and at the imp-96912 anchors.
function rms(values) {
  return Math.sqrt(values.reduce((a, v) => a + v * v, 0) / values.length);
}
const fitWindowResid = IMP97060_ANCHOR_BACKCHECK.filter((r) => r.inFitWindow).map(
  (r) => r.residualPct,
);
export const IMP97060_RESIDUAL_SUMMARY = Object.freeze({
  fitWindowRmsPct: rms(fitWindowResid), // ~0.026 pp
  fitWindowMaxAbsPct: Math.max(...fitWindowResid.map(Math.abs)), // ~0.042 pp
  anchorResiduals: Object.freeze(
    ANCHOR_NTOPS.map((n) => {
      const r = IMP97060_ANCHOR_BACKCHECK.find((x) => x.nTop === n);
      return Object.freeze({ nTop: n, residualPct: r.residualPct });
    }),
  ),
});

export const IMP97060_VERDICT = Object.freeze({
  question:
    'do the imp-97033 log-decay-inverted N_top predictions at 1/5/10 percent confidence cross-validate ' +
    'against the exact imp-96912 anchor rungs, and how large is the fit residual at the anchors?',
  // confidence-table consistency: the 1-percent rung matches the imp-97033 threshold ladder (~2e7).
  onePercentMatchesThreshold:
    Math.abs(
      IMP97060_CONFIDENCE_TABLE.find((r) => r.targetSpreadPct === 1).nTopRequired -
        IMP97033_THRESHOLD_LADDER.find((r) => r.targetSpreadPct === 1).nTopRequired,
    ) < 1e3,
  fitWindowRmsPct: IMP97060_RESIDUAL_SUMMARY.fitWindowRmsPct,
  fitWindowMaxAbsPct: IMP97060_RESIDUAL_SUMMARY.fitWindowMaxAbsPct,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'CROSS-VALIDATES the imp-97033 inverted decay law. The confidence table (S*=10/5/1 percent -> ' +
    'N_top ~ 4.07e3 / 5.26e4 / 2.01e7) is internally consistent -- the 1-percent rung reproduces the ' +
    'imp-97033 threshold-ladder entry (~2.01e7, ~49 percent of N*) -- and the anchor back-check shows ' +
    'the law reproduces the exact measured spread to <= 0.042 pp across the fit window (RMS ~0.026 pp) ' +
    'and to +0.009 / -0.037 pp at the two imp-96912 anchors (N=16000, 24000). The near-field fit is ' +
    'therefore faithful; the honest obstruction stays the ~49-percent-of-N* far reach, not any anchor ' +
    'misfit. Measurement/tabulation only; only the trace ceiling T ~ 2.594e7 is rigorous; no bound ' +
    'moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97060_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/tabulation only: no fit was rerun, no ' +
  'Gram was rebuilt and no O(N^3) rung was computed -- the imp-97033 decay law and exact spread ladder ' +
  'are imported verbatim and only tabulated against the imp-96912 anchors. Only the trace ceiling ' +
  'T ~ 2.594e7 is rigorous; F and M inherit non-rigorous lam_min N^-p / ||G||_F log-fit extrapolations; ' +
  'no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97060_ASSERTIONS = [
  {
    id: 'imp97060-confidence-table-monotone-and-brackets-the-anchors',
    holds: () =>
      IMP97060_CONFIDENCE_TABLE.length === 3 &&
      // larger target spread needs a smaller N_top (monotone decreasing in S*)
      IMP97060_CONFIDENCE_TABLE[0].nTopRequired < IMP97060_CONFIDENCE_TABLE[1].nTopRequired &&
      IMP97060_CONFIDENCE_TABLE[1].nTopRequired < IMP97060_CONFIDENCE_TABLE[2].nTopRequired &&
      // 10 percent is a downward extrapolation, 5 percent is above the current top rung, 1 percent ~2e7
      IMP97060_CONFIDENCE_TABLE[0].nTopRequired < 8000 &&
      IMP97060_CONFIDENCE_TABLE[1].aboveCurrentTopRung === true &&
      IMP97060_CONFIDENCE_TABLE[2].nTopRequired > 1e7 &&
      IMP97060_CONFIDENCE_TABLE[2].nTopRequired < 3e7,
    why: 'inverting the imp-97033 decay law at 10/5/1 percent target spread gives N_top ~ 4.07e3 / 5.26e4 / 2.01e7 -- monotone decreasing in the target spread, with the 1 percent rung reaching ~2e7 (~49 percent of N*).',
  },
  {
    id: 'imp97060-one-percent-rung-matches-imp97033-threshold-ladder',
    holds: () => IMP97060_VERDICT.onePercentMatchesThreshold === true,
    why: 'the confidence-table 1 percent rung (~2.01e7) reproduces the imp-97033 threshold-ladder 1 percent entry to within 1000 in N_top, confirming the two derivations are consistent.',
  },
  {
    id: 'imp97060-anchor-backcheck-residuals-small',
    holds: () =>
      IMP97060_ANCHOR_BACKCHECK.length === 9 &&
      IMP97060_RESIDUAL_SUMMARY.fitWindowRmsPct < 0.05 &&
      IMP97060_RESIDUAL_SUMMARY.fitWindowMaxAbsPct < 0.05 &&
      IMP97060_RESIDUAL_SUMMARY.anchorResiduals.every((a) => Math.abs(a.residualPct) < 0.05),
    why: 'the imp-97033 log-decay law reproduces the exact measured spread to <= 0.042 pp across the fit window (RMS ~0.026 pp) and to +0.009 / -0.037 pp at the two imp-96912 anchors, so the near-field fit is faithful.',
  },
  {
    id: 'imp97060-honesty-gate-no-qed',
    holds: () =>
      IMP97060_VERDICT.anyBoundMoved === false &&
      IMP97060_VERDICT.postsRigorousCeiling === false &&
      IMP97060_VERDICT.qed === false &&
      /NO QED/.test(IMP97060_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97060_HONEST_BANNER) &&
      /RH open/.test(IMP97060_HONEST_BANNER),
    why: 'measurement/tabulation only: no bound moved, no rigorous ceiling posted, and the honesty markers are present.',
  },
];

for (const a of IMP97060_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97060-route-m-fm-discriminant-crossvalidation assertion failed: ${a.id}`,
    );
  }
}

export default {
  confidenceTable: IMP97060_CONFIDENCE_TABLE,
  anchorBackcheck: IMP97060_ANCHOR_BACKCHECK,
  residualSummary: IMP97060_RESIDUAL_SUMMARY,
  verdict: IMP97060_VERDICT,
  banner: IMP97060_HONEST_BANNER,
};
