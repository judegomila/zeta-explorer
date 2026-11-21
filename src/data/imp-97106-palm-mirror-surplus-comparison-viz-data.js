/**
 * @module imp-97106-palm-mirror-surplus-comparison-viz-data
 * @fileoverview imp-97106 -- chart-ready reshape of the imp-97080 mirror-count-vs-p_req
 *   surplus comparison. Bakes every baseline (neutral rigid-lattice Palm 2-slot/1-slot at
 *   the seam and at N1*, empirical finite-height block minima at 1e12 location-free /
 *   pair-replacement and 1e22 location-free) into one bar-chart-ready list, each entry
 *   carrying its measured mirror count, the required p_req = 4.3743, and the surplus
 *   factor p_req / count. Presentation only: every literal is imported verbatim from
 *   IMP97080_MEASUREMENT, no re-derivation.
 *
 * @see imp-97080-palm-mirror-baseline-vs-preq-measurement.js (source: all counts, p_req, verdict)
 */

import { IMP97080_MEASUREMENT } from './imp-97080-palm-mirror-baseline-vs-preq-measurement.js';

const M = IMP97080_MEASUREMENT;

export const IMP97106_PREQ = M.pReq; // 4.3743

// One bar per baseline, ordered by ascending surplus (closest to parity first).
export const IMP97106_SURPLUS_BARS = Object.freeze([
  Object.freeze({
    key: 'palm2-n1star',
    label: 'neutral Palm 2-slot @ N1*',
    count: M.neutralPalm.twoSlotN1Star,
    surplus: M.neutralPalm.twoSlotN1StarSurplus,
    color: '#4ade80',
  }),
  Object.freeze({
    key: 'emp-1e22-locfree',
    label: 'empirical 1e22 location-free',
    count: M.empiricalFiniteHeight.block1e22LocationFree,
    surplus: M.empiricalFiniteHeight.block1e22LocationFreeSurplus,
    color: '#34d399',
  }),
  Object.freeze({
    key: 'palm1-seam',
    label: 'neutral Palm 1-slot (seam)',
    count: M.neutralPalm.oneSlotSeam,
    surplus: M.neutralPalm.oneSlotSeamSurplus,
    color: '#38bdf8',
  }),
  Object.freeze({
    key: 'emp-1e12-locfree',
    label: 'empirical 1e12 location-free',
    count: M.empiricalFiniteHeight.block1e12LocationFree,
    surplus: M.empiricalFiniteHeight.block1e12LocationFreeSurplus,
    color: '#818cf8',
  }),
  Object.freeze({
    key: 'palm2-seam',
    label: 'neutral Palm 2-slot (seam)',
    count: M.neutralPalm.twoSlotSeam,
    surplus: M.neutralPalm.twoSlotSeamSurplus,
    color: '#fbbf24',
  }),
  Object.freeze({
    key: 'emp-1e12-pairrep',
    label: 'empirical 1e12 pair-replacement',
    count: M.empiricalFiniteHeight.block1e12PairReplacement,
    surplus: M.empiricalFiniteHeight.block1e12PairReplacementSurplus,
    color: '#f87171',
  }),
]);

export const IMP97106_MAX_COUNT = Math.max(IMP97106_PREQ, ...IMP97106_SURPLUS_BARS.map((b) => b.count));

export const IMP97106_VERDICT = Object.freeze({
  ticket: 'imp-97106',
  sourceTicket: 'imp-97080',
  pReq: IMP97106_PREQ,
  hypothesisHolds: M.hypothesisHolds, // false
  anyBoundMoved: M.anyBoundMoved, // false
  note:
    'every bar falls short of p_req except the far-height N1* / 1e22 baselines, which reach ' +
    'approximate parity (~1.0x) -- a height effect from the mirror mean ln N / 2, not a ' +
    'relaxation at the binding y0 = 0.165 window. Presentation only; no new Lambda bound; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export default IMP97106_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97106_ASSERTIONS = [
  {
    id: 'imp97106-six-bars-present',
    holds: () => IMP97106_SURPLUS_BARS.length === 6,
    why: 'the comparison must cover all six imp-97080 baselines: Palm 2-slot/1-slot at the ' +
      'seam, Palm 2-slot at N1*, and the three empirical finite-height block minima.',
  },
  {
    id: 'imp97106-bars-reused-verbatim',
    holds: () =>
      IMP97106_SURPLUS_BARS.find((b) => b.key === 'palm2-seam').count === M.neutralPalm.twoSlotSeam &&
      IMP97106_SURPLUS_BARS.find((b) => b.key === 'emp-1e12-pairrep').count === M.empiricalFiniteHeight.block1e12PairReplacement &&
      IMP97106_SURPLUS_BARS.find((b) => b.key === 'emp-1e22-locfree').count === M.empiricalFiniteHeight.block1e22LocationFree,
    why: 'every count must be the exact IMP97080_MEASUREMENT value, not a re-derivation.',
  },
  {
    id: 'imp97106-surplus-matches-preq-over-count',
    holds: () => IMP97106_SURPLUS_BARS.every((b) => Math.abs(b.surplus - IMP97106_PREQ / b.count) < 1e-9),
    why: 'surplus is defined exactly as p_req / count for every bar, matching the source module formula.',
  },
  {
    id: 'imp97106-ordering-is-ascending-surplus',
    holds: () =>
      IMP97106_SURPLUS_BARS.every((b, i) => i === 0 || b.surplus >= IMP97106_SURPLUS_BARS[i - 1].surplus),
    why: 'bars are ordered from closest-to-parity (surplus near 1x) to furthest-short, so the ' +
      'chart reads as an honest ladder rather than an arbitrary shuffle.',
  },
  {
    id: 'imp97106-only-far-height-baselines-near-parity',
    holds: () => {
      const nearParity = IMP97106_SURPLUS_BARS.filter((b) => b.surplus < 1.05);
      return nearParity.length === 2 &&
        nearParity.every((b) => b.key === 'palm2-n1star' || b.key === 'emp-1e22-locfree');
    },
    why: 'only the far-height N1* Palm baseline and the 1e22 empirical block reach ~1.0x ' +
      'surplus (parity); every seam-height / 1e12 baseline falls short, matching the imp-97080 verdict.',
  },
  {
    id: 'imp97106-verdict-honesty-gate-no-qed',
    holds: () =>
      IMP97106_VERDICT.hypothesisHolds === false &&
      IMP97106_VERDICT.anyBoundMoved === false &&
      /No new Lambda bound/i.test(IMP97106_VERDICT.note) &&
      /refereed bound is changed/i.test(IMP97106_VERDICT.note) &&
      /RH open/.test(IMP97106_VERDICT.note) &&
      /NO QED/.test(IMP97106_VERDICT.note),
    why: 'presentation-only leaf: no bound moved, no-refereed-bound-change line and NO QED present.',
  },
];

for (const a of IMP97106_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97106-palm-mirror-surplus-comparison-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
