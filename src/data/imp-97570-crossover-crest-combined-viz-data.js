/**
 * @module imp-97570-crossover-crest-combined-viz-data
 *
 * imp-97570 (ux): import-light viz-data leaf combining, per b-ladder rung, the
 * imp-97441 crossover-fraction table x*(eps) across ALL FOUR tolerances with
 * the imp-97459 crest amplitudes (the 1/6 and 1/5 cotangent-sum resonances)
 * that explain WHY the eps=1% row alone is bimodal. Neither sibling viz
 * (imp-97467 shows the four tolerance ladders in isolation; imp-97487 shows
 * the crest amplitude curves over x for two fixed b) puts the crest
 * amplitudes and the 1% fraction side by side against the SAME b-ladder axis;
 * this leaf reshapes both source tables verbatim (no re-derivation) into one
 * merged per-b row so the branch flip is legible directly against the four
 * tolerance columns.
 *
 * PRESENTATION ONLY. Reuses IMP97441_XSTAR_TABLE / IMP97441_BINDEPENDENCE and
 * IMP97459_CREST_TABLE / IMP97459_CRESTS / IMP97459_STEP / IMP97459_SCALE
 * verbatim; no re-solve. Establishes no operator positivity; changes no
 * bound; the rigorous anchor stays T = 2.594e7; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97441-route-m-crossover-fraction-tolerance-table.js (x*(eps) table, b-independence, curvature fit)
 * @see imp-97459-route-m-bimodal-1pct-crossover-peaks.js (crest table, step point, A(b) scale)
 * @see imp-97467-route-m-crossover-fraction-tolerance-ladder-viz-data.js (four-tolerance ladder viz)
 * @see imp-97487-bimodal-1pct-crossover-viz-data.js (crest-vs-x viz at b=1000/16000)
 *
 * Ticket: imp-97570 (ux, sonnet-4-6, sonnet). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97441_XSTAR_TABLE,
  IMP97441_BINDEPENDENCE,
} from './imp-97441-route-m-crossover-fraction-tolerance-table.js';
import {
  IMP97459_CREST_TABLE,
  IMP97459_CRESTS,
  IMP97459_STEP,
  IMP97459_SCALE,
} from './imp-97459-route-m-bimodal-1pct-crossover-peaks.js';

export const IMP97570_B_LADDER = Object.freeze([1000, 2000, 4000, 8000, 16000]);
const B_KEYS = ['b1000', 'b2000', 'b4000', 'b8000', 'b16000'];

// -- merge the imp-97441 tolerance table with the imp-97459 crest/scale tables, aligned by b. -------
export const IMP97570_MERGED_ROWS = Object.freeze(
  IMP97570_B_LADDER.map((b, i) => {
    const key = B_KEYS[i];
    const crest = IMP97459_CREST_TABLE.find((r) => r.b === b);
    const scale = IMP97459_SCALE.find((r) => r.b === b);
    const eps = Object.freeze(
      IMP97441_XSTAR_TABLE.reduce((acc, row) => {
        acc[row.eps] = row[key];
        return acc;
      }, {}),
    );
    return Object.freeze({
      b,
      xStar: eps, // { 0.005: ..., 0.01: ..., 0.02: ..., 0.05: ... }
      ampLowerPct: crest.ampLowerPct,
      lowerOver1: crest.lowerOver1,
      ampUpperPct: crest.ampUpperPct,
      upperOver1: crest.upperOver1,
      branch: scale.branch,
      Ab: scale.Ab,
    });
  }),
);

export const IMP97570_ONEPCT_BINDEPENDENCE = IMP97441_BINDEPENDENCE.find((r) => r.eps === 0.01);
export const IMP97570_CRESTS = IMP97459_CRESTS;
export const IMP97570_STEP = IMP97459_STEP;

export const IMP97570_VERDICT = Object.freeze({
  ticket: 'imp-97570',
  sourceTickets: ['imp-97441', 'imp-97459'],
  claim:
    'The eps=1% branch flip in the merged row table (from the upper 1/5 branch, x*=0.199, ' +
    'to the lower 1/6 branch, x*=0.1665) lands exactly where ampLowerPct first crosses the 1% ' +
    'line (b=2000 -> b=4000, 0.9964% -> 1.0456%), while the other three tolerance columns and ' +
    'the always-over-1% ampUpperPct column stay flat across the same rows.',
  branchFlipRowIndex: IMP97570_MERGED_ROWS.findIndex((r) => r.branch === 'lower (1/6)'),
  qed: false,
});
export default IMP97570_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97570_ASSERTIONS = [
  {
    id: 'imp97570-five-merged-rows',
    holds: () => IMP97570_MERGED_ROWS.length === 5,
    why: 'the merged table must carry all five b-ladder rungs.',
  },
  {
    id: 'imp97570-xstar-matches-source-verbatim',
    holds: () =>
      IMP97570_MERGED_ROWS.every((r, i) =>
        IMP97441_XSTAR_TABLE.every((row) => r.xStar[row.eps] === row[B_KEYS[i]]),
      ),
    why: 'every xStar cell must equal the imp-97441 IMP97441_XSTAR_TABLE literal exactly (reuse, no re-derivation).',
  },
  {
    id: 'imp97570-crest-columns-match-source-verbatim',
    holds: () =>
      IMP97570_MERGED_ROWS.every((r) => {
        const c = IMP97459_CREST_TABLE.find((x) => x.b === r.b);
        return r.ampLowerPct === c.ampLowerPct && r.ampUpperPct === c.ampUpperPct;
      }),
    why: 'every crest amplitude must equal the imp-97459 IMP97459_CREST_TABLE literal exactly (reuse, no re-derivation).',
  },
  {
    id: 'imp97570-branch-flip-coincides-with-lower-crest-crossing-1pct',
    holds: () => {
      const flipIdx = IMP97570_MERGED_ROWS.findIndex((r) => r.branch === 'lower (1/6)');
      const prevIdx = flipIdx - 1;
      return (
        flipIdx > 0 &&
        IMP97570_MERGED_ROWS[prevIdx].lowerOver1 === false &&
        IMP97570_MERGED_ROWS[flipIdx].lowerOver1 === true &&
        IMP97570_MERGED_ROWS[flipIdx].b === IMP97570_STEP.ladderStepHiB &&
        IMP97570_MERGED_ROWS[prevIdx].b === IMP97570_STEP.ladderStepLoB
      );
    },
    why: 'the branch flip (upper 1/5 -> lower 1/6) must occur exactly at the row where ampLowerPct first crosses 1%, matching the imp-97459 step point.',
  },
  {
    id: 'imp97570-upper-crest-always-over-1pct-while-1pct-column-flat-at-other-tolerances',
    holds: () =>
      IMP97570_MERGED_ROWS.every((r) => r.upperOver1 === true) &&
      IMP97441_BINDEPENDENCE.filter((r) => r.eps !== 0.01).every((r) => r.bIndependent === true),
    why: 'the upper crest stays above 1% at every rung, and the three non-1% tolerance columns stay b-independent, isolating the bimodality to the 1% column alone.',
  },
  {
    id: 'imp97570-honesty-gate-no-qed',
    holds: () =>
      IMP97570_VERDICT.qed === false &&
      IMP97570_ONEPCT_BINDEPENDENCE.bIndependent === false &&
      IMP97570_CRESTS.lower.fraction === '1/6' &&
      IMP97570_CRESTS.upper.fraction === '1/5',
    why: 'measurement-only presentation reusing two upstream measurements verbatim: no bound moved, NO QED.',
  },
];

for (const t of IMP97570_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97570-crossover-crest-combined-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
