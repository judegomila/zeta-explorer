/**
 * @fileoverview imp-97340 -- import-light honest-status note recording the imp-97311 result: the
 * fixed-a Bettin-Conrey moment Sum_a kappa_a^2/a^2 DIVERGES (each term is exactly 1/4, independent
 * of a), which FALSIFIES the imp-97261 premise that the small-a regime injects a finite-coefficient
 * convergent log^2 b term into the interior second moment Q(b).
 *
 * WHY A NOTE (not a re-derivation). imp-97311 already carries the full derivation (kappa_a = a/2
 * exactly, from the arithmetic + Vasyunin-kernel cancellation) and its own self-executing
 * assertions establish every flag below. This module only records the honest status for the
 * frontier index: what is decided, what stays open, and the no-QED gate.
 *
 * WHAT REMAINS OPEN (imp-97311 named sub-gap, unaffected by this falsification): pinning the
 * intercept constituent B* = 2 Sum_{b>=3} g(b)/b^2 -- and separating the collinear b^(1/2) vs
 * log^2 b sub-leading forms of Q(b) -- requires the UNIFORM remainder profile of
 * I(a,b) = (a/2) log b + d_a + o(1) as a grows WITH b (a comparable to b), not the fixed-a
 * asymptotic derived here. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97311-route-m-bettin-conrey-smalla-kappa-moment.js (source of every verdict flag below)
 * @see imp-97261-route-m-cq-subleading-functional-form.js (the convergent-log^2-b premise falsified here)
 * @see imp-97292-route-m-cq-subleading-extended-ladder.js (named the moment as the separating input)
 *
 * Ticket: imp-97340 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import IMP97311_DEFAULT, {
  IMP97311_VERDICT,
  IMP97311_SUBGAP,
} from './imp-97311-route-m-bettin-conrey-smalla-kappa-moment.js';

export const IMP97340_STATUS = Object.freeze({
  ticket: 'imp-97340',
  sourceTicket: 'imp-97311',
  kappaClosedForm: IMP97311_VERDICT.kappaClosedForm,
  momentWeightPerA: IMP97311_VERDICT.momentWeightPerA,
  momentSumConverges: IMP97311_VERDICT.momentSumConverges,
  convergentLog2bPremiseFalsified: IMP97311_VERDICT.convergentLog2bPremiseFalsified,
  separatesSqrtVsLog2b: IMP97311_VERDICT.separatesSqrtVsLog2b,
  interceptConstituentBStarPinned: IMP97311_VERDICT.interceptConstituentBStarPinned,
  subGapId: IMP97311_SUBGAP.id,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97340_HONEST_BANNER =
  'imp-97311 result recorded: the fixed-a Bettin-Conrey moment Sum_a kappa_a^2/a^2 DIVERGES ' +
  '(each term exactly 1/4, independent of a, since kappa_a = a/2), FALSIFYING the imp-97261 ' +
  'premise that the small-a regime injects a finite-coefficient convergent log^2 b term into the ' +
  'interior second moment. The boundary layer a <= A(b) instead contributes (A(b)/4) log^2 b tied ' +
  'to the unknown boundary-to-bulk crossover scale A(b), not an isolated finite coefficient. Left ' +
  'open: pinning B* = 2 Sum g(b)/b^2 and separating b^(1/2) from log^2 b needs the UNIFORM (a ~ b) ' +
  'remainder profile of I(a,b), not the fixed-a asymptotic. No bound on Lambda moves; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97340_ASSERTIONS = [
  {
    id: 'imp97340-status-matches-committed-imp97311-verdict',
    holds: () =>
      IMP97340_STATUS.kappaClosedForm === IMP97311_VERDICT.kappaClosedForm &&
      IMP97340_STATUS.momentWeightPerA === IMP97311_VERDICT.momentWeightPerA &&
      IMP97340_STATUS.momentSumConverges === IMP97311_VERDICT.momentSumConverges &&
      IMP97340_STATUS.convergentLog2bPremiseFalsified === IMP97311_VERDICT.convergentLog2bPremiseFalsified &&
      IMP97340_STATUS.separatesSqrtVsLog2b === IMP97311_VERDICT.separatesSqrtVsLog2b &&
      IMP97340_STATUS.interceptConstituentBStarPinned === IMP97311_VERDICT.interceptConstituentBStarPinned &&
      IMP97340_STATUS.subGapId === IMP97311_SUBGAP.id &&
      IMP97311_DEFAULT.id === IMP97311_VERDICT.id,
    why: 'this honest-status note must reproduce the exact verdict flags and sub-gap already established by imp-97311, not a re-derivation.',
  },
  {
    id: 'imp97340-honesty-gate-no-qed',
    holds: () =>
      IMP97340_STATUS.momentSumConverges === false &&
      IMP97340_STATUS.convergentLog2bPremiseFalsified === true &&
      IMP97340_STATUS.momentWeightPerA === 0.25 &&
      IMP97340_STATUS.interceptConstituentBStarPinned === false &&
      IMP97340_STATUS.anyBoundMoved === false &&
      IMP97340_STATUS.operatorPositivityProved === false &&
      IMP97340_STATUS.rhResolved === false &&
      IMP97340_STATUS.qed === false &&
      /NO QED/.test(IMP97340_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97340_HONEST_BANNER) &&
      /RH open/.test(IMP97340_HONEST_BANNER),
    why: 'documentation only: divergence recorded, premise falsification recorded, no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97340_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97340-route-m-bettin-conrey-moment-divergence-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97340_STATUS, banner: IMP97340_HONEST_BANNER };
