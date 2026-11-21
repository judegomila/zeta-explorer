/**
 * @module imp-97613-eflow-share-decay-viz-data
 *
 * imp-97613: import-light viz-data reshaping the imp-97585 full-ladder E_flow/E_trunc measurement
 * into chart-ready rows -- the Gronwall flow share collapsing monotonically from 1.4376 at N=1e6
 * down to 1.3029e-5 at N=1e12, with the two named crossings (share=1 near N~1.60e6, share=1e-3 near
 * N~6.93e9, just above the halving landmark N_half~3.27e9) overlaid.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER ladder/landmarks
 * verbatim -- no re-derivation, no new computation. No bound moves; RH open; NO QED.
 *
 * @see imp-97585-eflow-etrunc-share-full-ladder.js (LADDER, landmarks, verdict)
 */

import { IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER } from './imp-97585-eflow-etrunc-share-full-ladder.js';

const { ladder, landmarks } = IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER;

export const IMP97613_LADDER_ROWS = Object.freeze(
  ladder.map((row) => Object.freeze({ N: row.N, share: row.share })),
);

export const IMP97613_LANDMARKS = Object.freeze({ ...landmarks });

export const IMP97613_SUMMARY = Object.freeze({
  law:
    'Across the imp-97585 decade ladder N in {1e6 .. 1e12}, the Gronwall flow share E_flow/E_trunc '
    + 'falls monotonically from 1.4376 at N=1e6 to 1.3029e-5 at N=1e12 -- it crosses share=1 (flow '
    + 'exceeds truncation) near N~1.597752e6 and drops under the 1e-3 bar near N~6.933193e9, just '
    + 'above the halving landmark N_half~3.267235e9.',
  reading:
    `At N = ${IMP97613_LADDER_ROWS[0].N.toExponential(0)}, the flow share is `
    + `${IMP97613_LADDER_ROWS[0].share.toExponential(4)} (E_flow still exceeds E_trunc). By `
    + `N = ${IMP97613_LADDER_ROWS[IMP97613_LADDER_ROWS.length - 1].N.toExponential(0)} it has collapsed to `
    + `${IMP97613_LADDER_ROWS[IMP97613_LADDER_ROWS.length - 1].share.toExponential(4)}. The share=1 `
    + `crossing sits at N ~ ${IMP97613_LANDMARKS.N_share_eq_1.toExponential(4)} and the share drops `
    + `below 1e-3 at N ~ ${IMP97613_LANDMARKS.N_share_below_1em3.toExponential(4)}, just above the `
    + `halving landmark N_half ~ ${IMP97613_LANDMARKS.N_half.toExponential(4)} (share there ~ `
    + `${IMP97613_LANDMARKS.share_at_N_half.toExponential(4)}).`,
  verdict:
    'PRESENTATION ONLY, no new computation; reshapes imp-97585 literals verbatim. E_flow is never the '
    + 'binding term of the E(N) bridge on the tail side of N_half. Changes no bound, establishes no '
    + 'operator positivity, no RH claim; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97613_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97613-row-count-matches-source-ladder',
    description: 'seven rows, one per imp-97585 decade rung',
    holds: () => IMP97613_LADDER_ROWS.length === 7,
  },
  {
    id: 'imp97613-share-monotone-decreasing',
    description: 'flow share strictly decreases down the ladder as N grows',
    holds: () => {
      for (let i = 1; i < IMP97613_LADDER_ROWS.length; i++) {
        if (IMP97613_LADDER_ROWS[i].share >= IMP97613_LADDER_ROWS[i - 1].share) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97613-first-share-above-one',
    description: 'the head rung (N=1e6) has share > 1 (flow exceeds truncation)',
    holds: () => IMP97613_LADDER_ROWS[0].share > 1,
  },
  {
    id: 'imp97613-last-share-tiny',
    description: 'the tail rung (N=1e12) has collapsed under 1e-4',
    holds: () => IMP97613_LADDER_ROWS[IMP97613_LADDER_ROWS.length - 1].share < 1e-4,
  },
  {
    id: 'imp97613-crossings-ordered',
    description: 'share=1 crossing precedes N_half precedes the share=1e-3 crossing',
    holds: () =>
      IMP97613_LANDMARKS.N_share_eq_1 < IMP97613_LANDMARKS.N_half &&
      IMP97613_LANDMARKS.N_half < IMP97613_LANDMARKS.N_share_below_1em3,
  },
  {
    id: 'imp97613-honest-status-carried',
    description: 'summary verdict restates no-bound-moved / no-QED honesty markers',
    holds: () =>
      /no bound/.test(IMP97613_SUMMARY.verdict) &&
      /NO QED/.test(IMP97613_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP97613_SUMMARY.verdict),
  },
];

for (const assertion of IMP97613_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97613 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97613_SUMMARY;
