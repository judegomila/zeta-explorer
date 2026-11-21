/**
 * @fileoverview imp-97420 -- import-light honest-status note recording the imp-97397 verdict:
 * three independent decorrelation designs run on the SAME exact interior Q(b) ladder (43 points,
 * b in [500, 32000]) all FAIL to separate the sqrt(b) vs log^2 b sub-leading forms of
 *   Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2  =  s0 b + [c1 sqrt(b) + c2 log^2 b] + ...
 * (A) an orthogonalized Legendre log-polynomial basis leaves the appended sqrt(b) term earning
 * only 2.95% RMS over a pure deg-3 log-polynomial; (B) a two-range LOW (b<=1000) x HIGH (b>=8000)
 * paired 2x2 solve gives (c1,c2) magnitudes that swing order-of-magnitude across all 77 pairs;
 * (C) the direct partial correlation of the two regressors given the leading b column stays
 * 0.973274 (joint design condition number 35.75). The collinearity is therefore STRUCTURAL, not a
 * ladder-length or basis artifact.
 *
 * WHY A NOTE (not a re-derivation). imp-97397 already carries the full derivation and its own
 * self-executing assertions establish every flag below. This module only records the honest
 * status for the frontier index: what is decided, what stays open, and the no-QED gate.
 *
 * WHAT REMAINS OPEN. This closes the DIFFERENT-DESIGN numerical route (matching the
 * longer-ladder numerical route imp-97319 already closed); it does not pin the exact log^2 b
 * coefficient nor move any bound. Separating the forms by fitting alone needs the analytic
 * Bettin-Conrey small-a asymptotic; the structural (non-fitting) question was separately decided
 * by imp-97349 as log^2 b, which this measurement is consistent with but does not re-derive.
 *
 * @see imp-97397-route-m-collinearity-independent-decorrelation.js (source of every verdict flag below)
 * @see imp-97319-cq-subleading-collinearity-honest-status.js (the longer-ladder numerical route this corroborates)
 * @see imp-97380-route-m-interior-second-moment-log2b-honest-status.js (the structural log^2 b decision this is consistent with)
 *
 * Ticket: imp-97420 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import IMP97397_DEFAULT, { IMP97397_VERDICT, IMP97397_DIAGNOSTIC } from './imp-97397-route-m-collinearity-independent-decorrelation.js';

export const IMP97420_STATUS = Object.freeze({
  ticket: 'imp-97420',
  sourceTicket: 'imp-97397',
  collinearityIsStructural: IMP97397_VERDICT.collinearityIsStructural,
  orthogonalBasisSeparates: IMP97397_VERDICT.orthogonalBasisSeparates,
  twoRangeSolveSeparates: IMP97397_VERDICT.twoRangeSolveSeparates,
  fractionalTermEarnsItsKeep: IMP97397_VERDICT.fractionalTermEarnsItsKeep,
  numericalRouteClosed: IMP97397_VERDICT.numericalRouteClosed,
  coefficientValuePinned: IMP97397_VERDICT.coefficientValuePinned,
  separationNeedsAnalyticInput: IMP97397_VERDICT.separationNeedsAnalyticInput,
  partialCorrGivenB: IMP97397_DIAGNOSTIC.partialCorrGivenB,
  conditionNumber: IMP97397_DIAGNOSTIC.conditionNumber,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97420_HONEST_BANNER =
  'imp-97397 result recorded: three independent decorrelation designs on the same exact interior ' +
  'Q(b) ladder (orthogonalized Legendre basis, two-range 2x2 differencing, direct partial-corr ' +
  '0.973274 / condition 35.75) all FAIL to separate the sqrt(b) vs log^2 b sub-leading forms -- ' +
  'the collinearity is STRUCTURAL, not a ladder-length or basis artifact. This corroborates ' +
  'imp-97319 (longer-ladder numerical route already closed) and is consistent with the separate ' +
  'imp-97349 structural decision (log^2 b). No coefficient pinned; no bound moved; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97420_ASSERTIONS = [
  {
    id: 'imp97420-status-matches-committed-imp97397-verdict',
    holds: () =>
      IMP97420_STATUS.collinearityIsStructural === IMP97397_VERDICT.collinearityIsStructural &&
      IMP97420_STATUS.orthogonalBasisSeparates === IMP97397_VERDICT.orthogonalBasisSeparates &&
      IMP97420_STATUS.twoRangeSolveSeparates === IMP97397_VERDICT.twoRangeSolveSeparates &&
      IMP97420_STATUS.fractionalTermEarnsItsKeep === IMP97397_VERDICT.fractionalTermEarnsItsKeep &&
      IMP97420_STATUS.numericalRouteClosed === IMP97397_VERDICT.numericalRouteClosed &&
      IMP97420_STATUS.coefficientValuePinned === IMP97397_VERDICT.coefficientValuePinned &&
      IMP97420_STATUS.separationNeedsAnalyticInput === IMP97397_VERDICT.separationNeedsAnalyticInput &&
      IMP97420_STATUS.partialCorrGivenB === IMP97397_DIAGNOSTIC.partialCorrGivenB &&
      IMP97420_STATUS.conditionNumber === IMP97397_DIAGNOSTIC.conditionNumber &&
      IMP97397_DEFAULT.verdict === IMP97397_VERDICT,
    why: 'this honest-status note must reproduce the exact verdict flags and diagnostic values already established by imp-97397, not a re-derivation.',
  },
  {
    id: 'imp97420-honesty-gate-no-qed',
    holds: () =>
      IMP97420_STATUS.collinearityIsStructural === true &&
      IMP97420_STATUS.numericalRouteClosed === true &&
      IMP97420_STATUS.coefficientValuePinned === false &&
      IMP97420_STATUS.anyBoundMoved === false &&
      IMP97420_STATUS.operatorPositivityProved === false &&
      IMP97420_STATUS.rhResolved === false &&
      IMP97420_STATUS.qed === false &&
      /NO QED/.test(IMP97420_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97420_HONEST_BANNER) &&
      /RH open/.test(IMP97420_HONEST_BANNER),
    why: 'documentation only: structural-collinearity recorded, no coefficient pinned, no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97420_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97420-route-m-collinearity-structural-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97420_STATUS, banner: IMP97420_HONEST_BANNER };
