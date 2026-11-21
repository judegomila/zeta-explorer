/**
 * @fileoverview imp-97361 -- import-light honest-status note recording the imp-97334 VERDICT: the
 * interior second-moment sub-leading constant cQ (Q(b) = s0 b + cQ + r(b)) is NOT a pinnable
 * constant. imp-97334 documents a best constant-model figure cQ ~ -13.384 (imp-97207 4-window fit,
 * b in [100,1200], co-fit s0 = 1.7626, kernel validated against T(250)=11.757622), feeding the
 * imp-97207 far-field intercept as 2 cQ (zeta(2)-5/4) ~ -10.57 -- the dominant constituent of
 * a_int = -14.929. But that figure is a bounded-window fit artifact, not a genuine constant:
 *   (i) NO b -> infinity limit -- the direct extrapolant g(b) = <Q(b) - s0 b> swings across tens of
 *       units and BOTH signs with no settling trend (center 300 -> -13.3, 700 -> -9.0, 1100 -> +4.0),
 *       because the true sub-leading g(b) is the growing sub-linear form of imp-97261/97292/97329
 *       (co-leading b^(1/2) or log^2 b, degenerate);
 *   (ii) COUPLED to the exact leading slope s0 with sensitivity |d cQ / d s0| = b (measured exactly:
 *        spread = 0.0116*b across the imp-97243 s0 band), so the s0 uncertainty +/- 0.006 alone
 *        gives cQ = -13.4 +/- 7 at b ~ 1200 and +/- 96 at b ~ 16000 -- a LONGER ladder makes the
 *        estimate WORSE, not better.
 * Pinning cQ (hence the far-field ceiling F as a value) needs the analytic Bettin-Conrey small-a
 * asymptotic plus the crossover Euler-Maclaurin correction (imp-97329 sub-gap), not more finite-b
 * compute -- the numerical lever is doubly dead (imp-97292).
 *
 * WHY A NOTE (not a re-derivation). imp-97334 already carries the full derivation, the reproduced
 * validation checkpoints, and its own self-executing assertions establishing every flag below. This
 * module only records the honest status for the frontier index.
 *
 * WHAT REMAINS OPEN: the imp-97334-cq-constant-nonexistent-limit sub-gap -- a pinnable cQ requires
 * the analytic small-a asymptotic + crossover correction (inherits imp-97329-uniform-crossover-
 * mainterm-coupling), a wholly separate leaf from any finite-b extrapolation. No bound on Lambda
 * moves; the rigorous anchor stays the trace ceiling T = 2.594e7; compute N ~ 9916 (imp-96352)
 * binds first by >2600x; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97334-route-m-cq-subleading-constant-evaluation.js (source of every verdict flag below)
 * @see imp-97207-route-m-farfield-intercept-derivation (the intercept coefficient cQ feeds)
 * @see imp-97292-route-m-cq-subleading-extended-ladder (numerical lever refuted: longer ladder does not help)
 * @see imp-97329-route-m-uniform-crossover-second-moment (the analytic sub-gap that would pin cQ)
 *
 * Ticket: imp-97361 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97334_VERDICT_DEFAULT, { IMP97334_VERDICT, IMP97334_SUBGAP } from './imp-97334-route-m-cq-subleading-constant-evaluation.js';

export const IMP97361_STATUS = Object.freeze({
  ticket: 'imp-97361',
  sourceTicket: 'imp-97334',
  constantModelValue: IMP97334_VERDICT.constantModelValue,
  interceptContribution: IMP97334_VERDICT.interceptContribution,
  cQHasFiniteLimit: IMP97334_VERDICT.cQHasFiniteLimit,
  cQCoupledToS0: IMP97334_VERDICT.cQCoupledToS0,
  s0CouplingSensitivityIsB: IMP97334_VERDICT.s0CouplingSensitivityIsB,
  bandWidensWithScale: IMP97334_VERDICT.bandWidensWithScale,
  pinnableConstant: IMP97334_VERDICT.pinnableConstant,
  subGapId: IMP97334_SUBGAP.id,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97361_HONEST_BANNER =
  'imp-97334 verdict recorded: the interior second-moment sub-leading constant cQ (Q(b) = s0 b + cQ + ' +
  'r(b)) is NOT a pinnable constant. Best documented figure cQ ~ -13.4 (imp-97207 4-window fit, b in ' +
  '[100,1200]) feeds the far-field intercept as 2 cQ (zeta(2)-5/4) ~ -10.57, but (i) it has NO b -> ' +
  'infinity limit -- <Q(b)-s0 b> swings across tens of units and both signs with no trend, because the ' +
  'true sub-leading term grows sub-linearly (b^(1/2) or log^2 b, degenerate); and (ii) it is coupled to ' +
  'the exact leading slope with sensitivity |d cQ / d s0| = b exactly, so a longer ladder WIDENS the ' +
  'band rather than narrowing it. Pinning cQ needs the analytic Bettin-Conrey small-a asymptotic + ' +
  'crossover correction, not more finite-b compute. No bound on Lambda moves; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97361_ASSERTIONS = [
  {
    id: 'imp97361-status-matches-committed-imp97334-verdict',
    holds: () =>
      IMP97361_STATUS.constantModelValue === IMP97334_VERDICT.constantModelValue &&
      IMP97361_STATUS.interceptContribution === IMP97334_VERDICT.interceptContribution &&
      IMP97361_STATUS.cQHasFiniteLimit === IMP97334_VERDICT.cQHasFiniteLimit &&
      IMP97361_STATUS.cQCoupledToS0 === IMP97334_VERDICT.cQCoupledToS0 &&
      IMP97361_STATUS.s0CouplingSensitivityIsB === IMP97334_VERDICT.s0CouplingSensitivityIsB &&
      IMP97361_STATUS.pinnableConstant === IMP97334_VERDICT.pinnableConstant &&
      IMP97361_STATUS.subGapId === IMP97334_SUBGAP.id &&
      IMP97334_VERDICT_DEFAULT === IMP97334_VERDICT,
    why: 'this honest-status note must reproduce the exact verdict flags and sub-gap bookkeeping already established by imp-97334, not a re-derivation.',
  },
  {
    id: 'imp97361-honesty-gate-no-qed',
    holds: () =>
      IMP97361_STATUS.anyBoundMoved === false &&
      IMP97361_STATUS.operatorPositivityProved === false &&
      IMP97361_STATUS.rhResolved === false &&
      IMP97361_STATUS.qed === false &&
      IMP97361_STATUS.pinnableConstant === false &&
      /NO QED/.test(IMP97361_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97361_HONEST_BANNER) &&
      /RH open/.test(IMP97361_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97361_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97361-route-m-cq-nonpinnability-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97361_STATUS, banner: IMP97361_HONEST_BANNER };
