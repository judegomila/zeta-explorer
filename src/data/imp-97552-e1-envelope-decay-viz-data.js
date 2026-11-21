/**
 * @module imp-97552-e1-envelope-decay-viz-data
 *
 * imp-97552 (ux): import-light viz-data leaf visualizing the imp-97539
 * tabulation of ratio(b) = |E1(b)| / (phi(b) b) -- the measured decay of the
 * imp-97516 STEP 3 sub-leading L1 remainder -- against the analytic
 * O(log b log log b / b) envelope env(b) = log b log log b / b, on a
 * log-log scale across the 12-point b-ladder (primorials, squarefree
 * consecutive-prime families, a prime ladder).
 *
 * PRESENTATION ONLY. All (b, ratio, env) points are reused verbatim from the
 * committed IMP97539_LADDER; nothing is re-derived. Establishes no operator
 * positivity; changes no bound; kappa_arith = 0.5704960511 unchanged;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97539-route-m-e1-envelope-ladder.js (the tabulated 12-point ladder, reused verbatim)
 * @see imp-97516-route-m-quarter-edge-breach-vs-first-moment-companion.js (STEP 3, the stated-not-tabulated claim)
 *
 * Ticket: imp-97552 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP97539_LADDER, IMP97539_VERDICT } from './imp-97539-route-m-e1-envelope-ladder.js';

export const IMP97552_LADDER = IMP97539_LADDER;

// log10-transformed points for a log-log rendering of ratio(b) and env(b) vs b.
export const IMP97552_LOG_POINTS = Object.freeze(
  IMP97539_LADDER.map((r) =>
    Object.freeze({
      b: r.b,
      family: r.family,
      logB: Math.log10(r.b),
      logRatio: Math.log10(r.ratio),
      logEnv: Math.log10(r.env),
    })
  )
);

export const IMP97552_ANCHORS = Object.freeze({
  b211Ratio: IMP97539_LADDER.find((r) => r.b === 211).ratio,
  b30011Ratio: IMP97539_LADDER.find((r) => r.b === 30011).ratio,
});

export const IMP97552_VERDICT = Object.freeze({
  ticket: 'imp-97552',
  sourceTicket: 'imp-97539',
  claim:
    'charts the imp-97539 tabulation of ratio(b) = |E1(b)|/(phi(b) b) against the analytic envelope ' +
    'env(b) = log b log log b / b on a log-log scale: ratio(b) sits under env(b) at every one of the ' +
    '12 ladder points and the gap widens with b (decreasing ratio/env), confirming the imp-97516 STEP 3 ' +
    'o(phi(b) b) claim visually.',
  dataReusedVerbatim: true,
  ratioUnderEnvelopeEverywhere: IMP97539_VERDICT.ratioUnderEnvelope,
  boundMoves: false,
  qed: false,
});
export default IMP97552_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97552_ASSERTIONS = [
  {
    id: 'imp97552-ladder-reused-verbatim-length',
    holds: () => Array.isArray(IMP97552_LADDER) && IMP97552_LADDER.length === 12,
    why: 'the charted ladder must be the full 12-point imp-97539 tabulation, reused verbatim.',
  },
  {
    id: 'imp97552-log-points-match-ladder',
    holds: () =>
      IMP97552_LOG_POINTS.length === IMP97552_LADDER.length &&
      IMP97552_LOG_POINTS.every((p, i) => {
        const r = IMP97552_LADDER[i];
        return (
          Math.abs(p.logB - Math.log10(r.b)) < 1e-9 &&
          Math.abs(p.logRatio - Math.log10(r.ratio)) < 1e-9 &&
          Math.abs(p.logEnv - Math.log10(r.env)) < 1e-9
        );
      }),
    why: 'log10 transforms of b, ratio, and env must exactly match the recomputed values from the reused ladder.',
  },
  {
    id: 'imp97552-ratio-under-envelope-in-log-space',
    holds: () => IMP97552_LOG_POINTS.every((p) => p.logRatio < p.logEnv),
    why: 'on the log-log chart, ratio(b) must plot strictly below env(b) at every point (log ratio < log env), ' +
      'matching the imp-97539 finding.',
  },
  {
    id: 'imp97552-anchors-match-imp97516-step3',
    holds: () =>
      Math.abs(IMP97552_ANCHORS.b211Ratio - 1.18e-3) < 1e-5 &&
      Math.abs(IMP97552_ANCHORS.b30011Ratio - 8.3e-6) < 1e-7,
    why: 'the two prime-ladder anchor points (b=211, b=30011) must reproduce the imp-97516 STEP 3 cited values.',
  },
  {
    id: 'imp97552-honesty-gate-no-qed',
    holds: () =>
      IMP97552_VERDICT.dataReusedVerbatim === true &&
      IMP97552_VERDICT.ratioUnderEnvelopeEverywhere === true &&
      IMP97552_VERDICT.boundMoves === false &&
      IMP97552_VERDICT.qed === false,
    why: 'presentation-only leaf: data reused verbatim from imp-97539; no bound moves; NO QED.',
  },
];

for (const t of IMP97552_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97552-e1-envelope-decay-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
