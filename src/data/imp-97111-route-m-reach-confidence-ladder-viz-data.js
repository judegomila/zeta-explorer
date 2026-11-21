/**
 * @module imp-97111-route-m-reach-confidence-ladder-viz-data
 * @fileoverview imp-97111 -- chart-ready reshape of the imp-97060 Route M reach-threshold
 *   confidence table (target spread 10/5/1 percent -> N_top ~ 4.07e3/5.26e4/2.01e7) and the
 *   anchor back-check (law-vs-exact residual at each imp-97033 truncation rung). Presentation
 *   only: every value is imported verbatim from imp-97060, no re-derivation.
 *
 * @see imp-97060-route-m-fm-discriminant-crossvalidation.js (source: confidence table, anchor back-check, verdict)
 */

import {
  IMP97060_CONFIDENCE_TABLE,
  IMP97060_ANCHOR_BACKCHECK,
  IMP97060_RESIDUAL_SUMMARY,
  IMP97060_VERDICT,
} from './imp-97060-route-m-fm-discriminant-crossvalidation.js';

// Confidence ladder: one bar per target spread, log10(N_top) so the ~3.3-decade reach
// (4.07e3 .. 2.01e7) renders on a single readable axis.
export const IMP97111_CONFIDENCE_LADDER = Object.freeze(
  IMP97060_CONFIDENCE_TABLE.map((r) => Object.freeze({
    targetSpreadPct: r.targetSpreadPct,
    nTopRequired: r.nTopRequired,
    log10NTop: Math.log10(r.nTopRequired),
    insideExactWindow: r.insideExactWindow,
    aboveCurrentTopRung: r.aboveCurrentTopRung,
    label: `${r.targetSpreadPct}%`,
  })),
);

// Anchor back-check: signed residual (law minus exact, percentage points) at each rung.
export const IMP97111_RESIDUAL_BARS = Object.freeze(
  IMP97060_ANCHOR_BACKCHECK.map((r) => Object.freeze({
    nTop: r.nTop,
    residualPct: r.residualPct,
    inFitWindow: r.inFitWindow,
    isImp96912Anchor: r.isImp96912Anchor,
  })),
);

export const IMP97111_MAX_ABS_RESIDUAL_PCT = Math.max(
  ...IMP97111_RESIDUAL_BARS.map((r) => Math.abs(r.residualPct)),
);

export const IMP97111_VERDICT = Object.freeze({
  ticket: 'imp-97111',
  sourceTicket: 'imp-97060',
  fitWindowRmsPct: IMP97060_RESIDUAL_SUMMARY.fitWindowRmsPct,
  fitWindowMaxAbsPct: IMP97060_RESIDUAL_SUMMARY.fitWindowMaxAbsPct,
  anyBoundMoved: false,
  note:
    'confidence ladder spans ~3.3 decades (N_top ~4.07e3 at 10 percent to ~2.01e7 at 1 percent); ' +
    'anchor back-check residuals stay <= 0.042 pp everywhere (+0.009/-0.037 pp at the two imp-96912 ' +
    'anchors), confirming the near-field fit is faithful and the extrapolation risk is dominated by ' +
    'the far reach, not anchor misfit. Presentation only; no new Lambda bound; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export default IMP97111_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97111_ASSERTIONS = [
  {
    id: 'imp97111-three-confidence-rungs-monotone-in-log10',
    holds: () =>
      IMP97111_CONFIDENCE_LADDER.length === 3 &&
      IMP97111_CONFIDENCE_LADDER[0].log10NTop < IMP97111_CONFIDENCE_LADDER[1].log10NTop &&
      IMP97111_CONFIDENCE_LADDER[1].log10NTop < IMP97111_CONFIDENCE_LADDER[2].log10NTop,
    why: 'the three confidence rungs (10/5/1 percent) must be monotone increasing in log10(N_top), matching the imp-97060 table.',
  },
  {
    id: 'imp97111-nine-residual-bars-reused-verbatim',
    holds: () =>
      IMP97111_RESIDUAL_BARS.length === 9 &&
      IMP97111_RESIDUAL_BARS.every((r, i) => r.residualPct === IMP97060_ANCHOR_BACKCHECK[i].residualPct),
    why: 'every residual bar must be the exact IMP97060_ANCHOR_BACKCHECK value, not a re-derivation.',
  },
  {
    id: 'imp97111-max-abs-residual-matches-summary',
    holds: () => Math.abs(IMP97111_MAX_ABS_RESIDUAL_PCT - IMP97060_RESIDUAL_SUMMARY.fitWindowMaxAbsPct) < 0.02,
    why: 'the max absolute residual across all bars is close to the imp-97060 fit-window max (the out-of-window rungs do not exceed it by much).',
  },
  {
    id: 'imp97111-honesty-gate-no-qed',
    holds: () =>
      IMP97111_VERDICT.anyBoundMoved === false &&
      IMP97060_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP97111_VERDICT.note) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97111_VERDICT.note) &&
      /RH open/.test(IMP97111_VERDICT.note),
    why: 'presentation-only leaf: no bound moved, and the honesty markers are present.',
  },
];

for (const a of IMP97111_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97111-route-m-reach-confidence-ladder-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
