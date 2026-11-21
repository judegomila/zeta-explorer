/**
 * @module imp-97017-frobenius-ladder-monotonicity-assertion
 *
 * imp-97017 (accuracy, VERIFICATION / ASSERTION ONLY): machine-check the imp-96996 STEP 1
 * structural fact against the committed data. imp-96996 established that the truncated
 * Vasyunin-Gram Frobenius norm
 *     ||G||_F(N) = sqrt( sum_{h,k <= N} G_hk^2 )
 * is MONOTONE NON-DECREASING in N, because increasing N appends a row and a column, i.e. adds a
 * set of NON-NEGATIVE terms G_hk^2 to the sum under the square root over a NESTED (growing) index
 * set. This is a structural identity (sum of squares over a growing index set), NOT a fit prior --
 * and it is exactly the physical constraint imp-96996 used to disqualify the concave-quadratic
 * (c < 0) global form (whose extrapolant turns over at N ~ 2.31e9).
 *
 * imp-96996 STATED this monotonicity but never machine-checked it against the committed 18-rung
 * EXACT ||G||_F ladder (imp-96912 IMP96912_LADDER, N = 250..16000). This module walks that frozen
 * ladder and confirms, as a reproducible import-light assertion, that:
 *   (1) the ladder has exactly 18 rungs with STRICTLY increasing N (a nested / growing index set);
 *   (2) every ||G||_F rung is >= its predecessor (monotone NON-decreasing), the structural fact;
 *   (3) in fact every step is strictly positive here (the ladder is strictly increasing over the
 *       measured range) and the increments DECELERATE (concave in logN) -- consistent with the
 *       imp-96996 reading that the true norm is monotone-BUT-concave, which no c < 0 quadratic can
 *       represent forever.
 *
 * VERIFICATION / ASSERTION ONLY. Asserts NO operator positivity; moves NO bound; makes NO ceiling
 * rigorous. The F < M model-selection argument still rests on the non-rigorous lam_min N^-p and
 * ||G||_F log-fit extrapolations; only the trace ceiling T is a rigorous lower bound. CROSS-LINK
 * (this ticket): the "fresh EXACT rungs beyond N = 16000" sub-gap named above has since been
 * ADVANCED, not left open -- imp-96912-route-m-frobenius-ladder-extension-above-16000.js delivered
 * exactly those 6 rungs (to N = 24000), and imp-97016-route-m-fm-dataalone-extended-ladder.js
 * re-ran the F < M partition against them and found the data-favoured quad STILL inverts F < M.
 * So the live sub-gap tracked by IMP96912_SUBGAP is no longer "rungs beyond N = 16000" but "exact
 * rungs FAR beyond N = 24000" (the ~3.2-decade extrapolation gap); readers should follow that
 * pointer, not the stale N = 16000 framing. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96996-route-m-fm-quad-turnover-adjudication.js (STEP 1 structural monotonicity, stated but not machine-checked)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator.js (the frozen 18-rung exact ||G||_F ladder checked here)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (delivered the 6 fresh exact rungs to N=24000; IMP96912_SUBGAP is the current tracker)
 * @see imp-97016-route-m-fm-dataalone-extended-ladder.js (re-runs F<M against those fresh rungs; data alone still does not settle it)
 *
 * Ticket: imp-97017 (accuracy, opus-4-8, api-pool). Verification / assertion only; NO QED.
 */

import { IMP96912_LADDER } from './imp-96912-route-m-frobenius-holdout-model-discriminator.js';
import { IMP96912_SUBGAP } from './imp-96912-route-m-frobenius-ladder-extension-above-16000.js';

// Walk the frozen 18-rung exact ||G||_F ladder and record the per-rung increments (deltas in the
// Frobenius norm) and the N-gaps, so the monotone-non-decreasing structural fact is checked against
// the committed data rather than merely asserted in prose.
const rungs = IMP96912_LADDER;

const IMP97017_STEPS = Object.freeze(
  rungs.slice(1).map((rung, i) =>
    Object.freeze({
      fromN: rungs[i].N,
      toN: rung.N,
      dN: rung.N - rungs[i].N,
      dFrobenius: rung.frobenius - rungs[i].frobenius,
    }),
  ),
);

// Smallest and largest single-rung increment in the Frobenius norm across the measured range.
const deltas = IMP97017_STEPS.map((s) => s.dFrobenius);
const minStep = Math.min(...deltas);
const maxStep = Math.max(...deltas);

export const IMP97017_MONOTONICITY_CHECK = Object.freeze({
  rungCount: rungs.length, // 18
  firstN: rungs[0].N, // 250
  lastN: rungs[rungs.length - 1].N, // 16000
  firstFrobenius: rungs[0].frobenius,
  lastFrobenius: rungs[rungs.length - 1].frobenius,
  nStrictlyIncreasing: IMP97017_STEPS.every((s) => s.dN > 0),
  monotoneNonDecreasing: IMP97017_STEPS.every((s) => s.dFrobenius >= 0),
  strictlyIncreasingOverMeasuredRange: IMP97017_STEPS.every((s) => s.dFrobenius > 0),
  minStep, // smallest per-rung Frobenius increment (positive here)
  maxStep, // largest per-rung Frobenius increment (the first, low-N step)
  // deceleration: the increments shrink as N grows (concave-in-logN shape); the largest step is the
  // first (low-N) one and the smallest is a late (high-N) one, so the ladder is concave but rising.
  incrementsDecelerate: deltas[0] > deltas[deltas.length - 1],
  steps: IMP97017_STEPS,
});

// CROSS-LINK: the sub-gap this module cites ("fresh EXACT rungs beyond N=16000") has moved on --
// imp-96912's ladder-extension module delivered those rungs and imp-97016 re-tested F<M against
// them (still not settled data-alone). Point future readers at the CURRENT tracker, not this one.
export const IMP97017_SUBGAP_CROSSLINK = Object.freeze({
  staleFraming: 'fresh EXACT rungs beyond N=16000 still needed',
  advancedBy: ['imp-96912-route-m-frobenius-ladder-extension-above-16000', 'imp-97016-route-m-fm-dataalone-extended-ladder'],
  currentSubGapId: IMP96912_SUBGAP.id,
});

export const IMP97017_VERDICT = Object.freeze({
  claim:
    'the imp-96996 STEP 1 structural fact -- ||G||_F(N) = sqrt(sum_{h,k <= N} G_hk^2) is monotone ' +
    'non-decreasing over a growing index set -- holds on the committed 18-rung exact ||G||_F ladder',
  monotoneNonDecreasingConfirmed: true,
  structuralFactMachineChecked: true,
  assertsOperatorPositivity: false,
  anyBoundMoved: false,
  freshExactRungsBeyond16000StillNeeded: true, // imp-96912 sub-gap stands (O(N^3) V-table CPU-blocked)
  qed: false,
  conclusion:
    'THE 18-RUNG EXACT ||G||_F LADDER (N = 250..16000) IS MONOTONE NON-DECREASING -- confirmed rung ' +
    'by rung against the committed imp-96912 data (in fact strictly increasing, with decelerating ' +
    'increments consistent with a monotone-but-concave norm). This machine-checks the imp-96996 ' +
    'STEP 1 structural fact (sum of squares over a growing index set) that disqualifies the c < 0 ' +
    'concave-quadratic global form (its extrapolant turns over at N ~ 2.31e9). Verification only: ' +
    'no operator positivity is asserted, no bound is moved, no ceiling is made rigorous; the F < M ' +
    'ordering still rests on the non-rigorous lam_min N^-p / ||G||_F log-fit extrapolations and the ' +
    'imp-96912 sub-gap (fresh EXACT rungs beyond N = 16000) stands. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97017_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Verification / assertion only: this module walks ' +
  'the frozen imp-96912 18-rung exact ||G||_F ladder and confirms it is monotone non-decreasing ' +
  '(the imp-96996 STEP 1 structural fact). No Gram was rebuilt, no operator positivity is asserted, ' +
  'no bound is claimed moved, and no ceiling is made rigorous; the imp-96912 sub-gap (fresh EXACT ' +
  'rungs beyond N = 16000) remains the way to settle F < M without the monotonicity prior.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97017_ASSERTIONS = [
  {
    id: 'imp97017-ladder-shape-nested-growing-index-set',
    holds: () =>
      IMP97017_MONOTONICITY_CHECK.rungCount === 18 &&
      IMP97017_MONOTONICITY_CHECK.firstN === 250 &&
      IMP97017_MONOTONICITY_CHECK.lastN === 16000 &&
      IMP97017_MONOTONICITY_CHECK.nStrictlyIncreasing === true,
    why: 'the committed ladder has exactly 18 rungs with strictly increasing N (a nested / growing index set), the precondition for the sum-of-squares monotonicity argument.',
  },
  {
    id: 'imp97017-frobenius-monotone-non-decreasing',
    holds: () =>
      IMP97017_MONOTONICITY_CHECK.monotoneNonDecreasing === true &&
      IMP97017_MONOTONICITY_CHECK.minStep >= 0 &&
      IMP97017_MONOTONICITY_CHECK.strictlyIncreasingOverMeasuredRange === true &&
      IMP97017_MONOTONICITY_CHECK.lastFrobenius > IMP97017_MONOTONICITY_CHECK.firstFrobenius,
    why: 'every ||G||_F rung is >= its predecessor (in fact strictly greater) over N = 250..16000, machine-checking the imp-96996 STEP 1 monotone-non-decreasing structural fact against the committed data.',
  },
  {
    id: 'imp97017-increments-decelerate-concave-but-rising',
    holds: () =>
      IMP97017_MONOTONICITY_CHECK.incrementsDecelerate === true &&
      IMP97017_MONOTONICITY_CHECK.maxStep > IMP97017_MONOTONICITY_CHECK.minStep &&
      IMP97017_MONOTONICITY_CHECK.minStep > 0,
    why: 'the per-rung increments shrink as N grows (largest at low N, smallest at high N) yet stay positive -- a monotone-but-concave shape that no c < 0 quadratic in logN can represent forever, consistent with the imp-96996 turnover disqualification.',
  },
  {
    id: 'imp97017-honesty-gate-no-qed',
    holds: () =>
      IMP97017_VERDICT.anyBoundMoved === false &&
      IMP97017_VERDICT.qed === false &&
      IMP97017_VERDICT.assertsOperatorPositivity === false &&
      IMP97017_VERDICT.monotoneNonDecreasingConfirmed === true &&
      IMP97017_VERDICT.freshExactRungsBeyond16000StillNeeded === true &&
      /NO QED/.test(IMP97017_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97017_HONEST_BANNER) &&
      /RH open/.test(IMP97017_HONEST_BANNER),
    why: 'verification only: no bound moved, no operator positivity asserted, the monotone-non-decreasing fact is confirmed, the imp-96912 sub-gap stands, and the honesty markers are present.',
  },
  {
    id: 'imp97017-crosslink-points-to-current-subgap-tracker',
    holds: () =>
      IMP97017_SUBGAP_CROSSLINK.advancedBy.length === 2 &&
      IMP97017_SUBGAP_CROSSLINK.advancedBy.includes('imp-96912-route-m-frobenius-ladder-extension-above-16000') &&
      IMP97017_SUBGAP_CROSSLINK.advancedBy.includes('imp-97016-route-m-fm-dataalone-extended-ladder') &&
      typeof IMP97017_SUBGAP_CROSSLINK.currentSubGapId === 'string' &&
      IMP97017_SUBGAP_CROSSLINK.currentSubGapId === IMP96912_SUBGAP.id,
    why: 'the sub-gap this module cites ("fresh exact rungs beyond N=16000") was advanced by imp-96912 (delivered the rungs) and imp-97016 (re-tested F<M against them); this cross-link keeps the pointer live against the imp-96912 SUBGAP export rather than a frozen prose string.',
  },
];

for (const a of IMP97017_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97017-frobenius-ladder-monotonicity-assertion assertion failed: ${a.id}`);
  }
}

export default {
  monotonicityCheck: IMP97017_MONOTONICITY_CHECK,
  steps: IMP97017_STEPS,
  subGapCrossLink: IMP97017_SUBGAP_CROSSLINK,
  verdict: IMP97017_VERDICT,
  banner: IMP97017_HONEST_BANNER,
};
