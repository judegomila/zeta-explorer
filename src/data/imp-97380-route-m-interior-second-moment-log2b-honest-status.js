/**
 * @fileoverview imp-97380 -- import-light honest-status note recording the imp-97349 verdict: the
 * b^(1/2)-vs-log^2 b separation of the interior second-moment sub-leading term g(b) (imp-97292's
 * numerically degenerate collinear pair) is now DECIDED = log^2 b. imp-97349 split the exact
 * Vasyunin coefficient I(a,b) = Ihat(a,b) + r(a,b) into the imp-97330 elementary skeleton
 * Ihat = (a/2) log(b/a) + a(C+1/2) and the arithmetic cotangent residual r, and showed (1) the
 * arithmetic pieces Qcross, Qrr are LINEAR in b (feed the leading slope s0, not the sub-leading),
 * and (2) the elementary skeleton Qhat (~99.6% of Q) is a LOG-POLYNOMIAL with a proven log^2 b
 * term and NO fractional power (a coeff*b^(1/2) term would leave a residual ~ coeff*200 at
 * b = 40000; the measured residual is 0.0000). The imp-97292 "b^(1/2), c ~ -1.44" candidate is
 * therefore a fitting artifact of the short ladder (b^(1/2) and log^2 b collinear on b <= ~10^4),
 * NOT a genuine asymptotic form.
 *
 * WHY A NOTE (not a re-derivation). imp-97349 already carries the full derivation and its own
 * self-executing assertions establish every flag below. This module only records the honest
 * status for the frontier index: what is decided, what stays open, and the no-QED gate.
 *
 * WHAT REMAINS OPEN (imp-97349 named residual, unaffected by this qualitative closure): the EXACT
 * log^2 b coefficient is not pinned. Coprimality turns the pre-coprimality skeleton coefficient
 * -1/8 into a divisor-weighted arithmetic function of b, and Qcross contributes an additional
 * log^2 b piece; certifying the coefficient needs a rigorous bound on the SECOND MOMENT of the
 * Vasyunin/Bettin-Conrey cotangent residual r(a,b) (the imp-97116 Estermann/Kloosterman
 * small-inverse equidistribution input). No bound on Lambda moves; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97349-route-m-diagonal-remainder-profile-separation.js (source of every verdict flag below)
 * @see imp-97292-route-m-cq-subleading-extended-ladder.js (the b^(1/2)-vs-log^2 b collinear ladder resolved here)
 * @see imp-97330-route-m-smalla-intercept-closed-form.js (Ihat = (a/2) log(b/a) + a(C+1/2); the skeleton)
 *
 * Ticket: imp-97380 (content, medium, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import IMP97349_DEFAULT, { IMP97349_VERDICT, IMP97349_SUBGAP } from './imp-97349-route-m-diagonal-remainder-profile-separation.js';

export const IMP97380_STATUS = Object.freeze({
  ticket: 'imp-97380',
  sourceTicket: 'imp-97349',
  arithmeticPiecesAreLinear: IMP97349_VERDICT.arithmeticPiecesAreLinear,
  skeletonHasNoFractionalPower: IMP97349_VERDICT.skeletonHasNoFractionalPower,
  subleadingFormIsLog2b: IMP97349_VERDICT.subleadingFormIsLog2b,
  subleadingFormIsSqrtB: IMP97349_VERDICT.subleadingFormIsSqrtB,
  exactCoefficientPinned: IMP97349_VERDICT.exactCoefficientPinned,
  subGapId: IMP97349_SUBGAP.id,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97380_HONEST_BANNER =
  'imp-97349 result recorded: the b^(1/2)-vs-log^2 b separation of the interior second-moment ' +
  'sub-leading term is DECIDED = log^2 b, NOT b^(1/2) -- the imp-97292 "c ~ -1.44 b^(1/2)" ' +
  'candidate is a fitting artifact of the short, numerically-degenerate ladder (collinear with ' +
  'log^2 b on b <= ~10^4). The elementary diagonal skeleton (~99.6% of the second moment) is a ' +
  'log-polynomial with a proven log^2 b term and provably no fractional power, while the ' +
  'arithmetic Vasyunin pieces are linear in b and feed the leading slope instead. Left open: the ' +
  'EXACT log^2 b coefficient, which needs the coprimality divisor weighting plus a rigorous bound ' +
  'on the Vasyunin cotangent residual second moment (imp-97116). No bound on Lambda moves; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97380_ASSERTIONS = [
  {
    id: 'imp97380-status-matches-committed-imp97349-verdict',
    holds: () =>
      IMP97380_STATUS.arithmeticPiecesAreLinear === IMP97349_VERDICT.arithmeticPiecesAreLinear &&
      IMP97380_STATUS.skeletonHasNoFractionalPower === IMP97349_VERDICT.skeletonHasNoFractionalPower &&
      IMP97380_STATUS.subleadingFormIsLog2b === IMP97349_VERDICT.subleadingFormIsLog2b &&
      IMP97380_STATUS.subleadingFormIsSqrtB === IMP97349_VERDICT.subleadingFormIsSqrtB &&
      IMP97380_STATUS.exactCoefficientPinned === IMP97349_VERDICT.exactCoefficientPinned &&
      IMP97380_STATUS.subGapId === IMP97349_SUBGAP.id &&
      IMP97349_DEFAULT.id === IMP97349_VERDICT.id,
    why: 'this honest-status note must reproduce the exact verdict flags and sub-gap already established by imp-97349, not a re-derivation.',
  },
  {
    id: 'imp97380-honesty-gate-no-qed',
    holds: () =>
      IMP97380_STATUS.subleadingFormIsLog2b === true &&
      IMP97380_STATUS.subleadingFormIsSqrtB === false &&
      IMP97380_STATUS.exactCoefficientPinned === false &&
      IMP97380_STATUS.anyBoundMoved === false &&
      IMP97380_STATUS.operatorPositivityProved === false &&
      IMP97380_STATUS.rhResolved === false &&
      IMP97380_STATUS.qed === false &&
      /NO QED/.test(IMP97380_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97380_HONEST_BANNER) &&
      /RH open/.test(IMP97380_HONEST_BANNER),
    why: 'documentation only: decision recorded (log^2 b, not b^(1/2)), no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97380_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97380-route-m-interior-second-moment-log2b-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97380_STATUS, banner: IMP97380_HONEST_BANNER };
