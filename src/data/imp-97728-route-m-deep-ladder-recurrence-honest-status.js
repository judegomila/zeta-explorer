/**
 * @fileoverview imp-97728 -- import-light standalone honest-status note recording the imp-97706 RESULT:
 * extending the imp-97659 dps=35 deep Route M gap-law residual ladder past p=9.9e7 out to p~4.93e8 (omega
 * up to 2.6e7) answered both imp-97687 open questions.
 *
 * (Q2) The single imp-97659 residual sign-change RECURS: the decay slope goes negative on EIGHT rungs of
 * the combined 23-rung ladder (seven of them new, in the p=9.9e7..4.93e8 extension alone), so it is a
 * PERIODIC oscillation -- the signature of the oscillating PNT/Mertens error term -- not a one-off
 * fingerprint.
 *
 * (Q1) Re-running the imp-97687 seeded 20000-draw bootstrap on the doubled ladder NARROWS the 95%
 * confidence band from [8.2, 11.0] (width ~2.8) to [9.80, 11.22] (width ~1.42), mean ~10.54, while the
 * "residual outruns every fixed power <= 3" conclusion holds in 100% of resamples -- the wide imp-97687
 * band was partly a small-sample effect, and doubling the rungs only reinforces the qualitative
 * conclusion, never overturns it.
 *
 * WHY A NOTE (not a re-derivation). imp-97706 already carries the full derivation, the combined ladder,
 * and its own self-executing assertions establishing every flag below. This module only records the
 * honest status for the frontier index.
 *
 * WHAT REMAINS OPEN: the residual's oscillation envelope has no closed-form periodicity model (only
 * measured rise/fall counts); the exact PNT/Mertens error term driving the oscillation is not derived
 * here. MCM stays refuted from omega=11; no bound on Lambda moves; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-97706-route-m-deep-ladder-extension.js (source of every verdict flag below)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 ladder, the single sign-change first observed)
 * @see imp-97687-route-m-avg-exponent-robustness.js (11-rung bootstrap band [8.2,11.0] this note narrows)
 *
 * Ticket: imp-97728 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97706_DEFAULT, { IMP97706_VERDICT, IMP97706_BOOTSTRAP, IMP97706_RESULTS } from './imp-97706-route-m-deep-ladder-extension.js';

export const IMP97728_STATUS = Object.freeze({
  ticket: 'imp-97728',
  sourceTicket: 'imp-97706',
  signChangeRecurs: IMP97706_VERDICT.signChangeRecurs,
  isPeriodicNotOneOff: IMP97706_VERDICT.isPeriodicNotOneOff,
  riseRungsCombined: IMP97706_RESULTS.riseRungsCombined,
  combinedRungs: IMP97706_RESULTS.combinedRungs,
  bootstrapBandNarrows: IMP97706_VERDICT.bootstrapBandNarrows,
  bootstrapCI95: IMP97706_BOOTSTRAP.ci95,
  bootstrapWidth: IMP97706_BOOTSTRAP.width,
  fractionExceedsThree: IMP97706_BOOTSTRAP.fractionExceedsThree,
  outrunsEveryFixedPowerLE3: IMP97706_VERDICT.outrunsEveryFixedPowerLE3,
  mcmRefuted: IMP97706_VERDICT.mcmRefuted,
  anyBoundMoved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97728_HONEST_BANNER =
  'imp-97706 result recorded: extending the dps=35 Route M deep gap-law residual ladder past p=9.9e7 to ' +
  'p~4.93e8 shows the single imp-97659 residual sign-change RECURS (eight negative-slope rungs on the ' +
  'combined 23-rung ladder), confirming a periodic oscillating PNT/Mertens error rather than a one-off ' +
  'fingerprint. Re-running the imp-97687 seeded bootstrap on the doubled ladder NARROWS the 95% band from ' +
  '[8.2,11.0] to [9.80,11.22], with the "outruns every fixed power <= 3" conclusion holding in 100% of ' +
  'resamples. Left open: no closed-form periodicity model for the oscillation envelope. MCM stays refuted ' +
  'from omega=11; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97728_ASSERTIONS = [
  {
    id: 'imp97728-status-matches-committed-imp97706-verdict',
    holds: () =>
      IMP97728_STATUS.signChangeRecurs === IMP97706_VERDICT.signChangeRecurs &&
      IMP97728_STATUS.isPeriodicNotOneOff === IMP97706_VERDICT.isPeriodicNotOneOff &&
      IMP97728_STATUS.bootstrapBandNarrows === IMP97706_VERDICT.bootstrapBandNarrows &&
      IMP97728_STATUS.outrunsEveryFixedPowerLE3 === IMP97706_VERDICT.outrunsEveryFixedPowerLE3 &&
      IMP97728_STATUS.mcmRefuted === IMP97706_VERDICT.mcmRefuted &&
      IMP97728_STATUS.bootstrapCI95[0] === IMP97706_BOOTSTRAP.ci95[0] &&
      IMP97728_STATUS.bootstrapCI95[1] === IMP97706_BOOTSTRAP.ci95[1] &&
      IMP97706_DEFAULT.verdict === IMP97706_VERDICT,
    why: 'this honest-status note must reproduce the exact verdict flags and bootstrap bookkeeping already established by imp-97706, not a re-derivation.',
  },
  {
    id: 'imp97728-eight-rungs-and-narrowed-band',
    holds: () =>
      IMP97728_STATUS.riseRungsCombined === 8 &&
      IMP97728_STATUS.combinedRungs === 23 &&
      IMP97728_STATUS.bootstrapWidth < 2.8 &&
      IMP97728_STATUS.bootstrapCI95[0] > 8.2 &&
      IMP97728_STATUS.fractionExceedsThree > 0.999,
    why: 'the recorded status must state the eight-rung recurrence on the 23-rung combined ladder and a bootstrap band strictly narrower than the imp-97687 [8.2,11.0] with ">3" holding in essentially 100% of resamples.',
  },
  {
    id: 'imp97728-honesty-gate-no-qed',
    holds: () =>
      IMP97728_STATUS.anyBoundMoved === false &&
      IMP97728_STATUS.rhResolved === false &&
      IMP97728_STATUS.qed === false &&
      /NO QED/.test(IMP97728_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97728_HONEST_BANNER) &&
      /RH open/.test(IMP97728_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no RH resolution, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97728_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97728-route-m-deep-ladder-recurrence-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97728_STATUS, banner: IMP97728_HONEST_BANNER };
