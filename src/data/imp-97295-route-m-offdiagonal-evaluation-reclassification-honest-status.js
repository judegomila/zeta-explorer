/**
 * @fileoverview imp-97295 -- import-light honest-status note recording the imp-97267 RECLASSIFICATION of
 * the M2w inverse-line transfer input: from a BOUNDING problem ("absorb a bounded ~1.25 oversampling",
 * the imp-97203/imp-97225 framing) to an EVALUATION problem (a co-leading OFFDIAG twisted second moment
 * that a Weil/Kloosterman bound cannot discard). imp-97267 wrote the transfer as an exact
 * character-detection identity M2w * Sum_a a = DIAG + OFFDIAG and MEASURED OFFDIAG/DIAG ~ 1.0 (the
 * off-diagonal carries ~half of M2w, net positive, stable to b=401) -- so the sole open scalar the imp-97210
 * kappa obligation ledger rests on is sharper than that ledger currently states.
 *
 * WHY A NOTE (not a re-derivation). imp-97267 already carries the full identity, measurement, and its own
 * self-executing assertions establish every flag below. This module only records the honest status for the
 * frontier index and cross-links the imp-97210 ledger, imp-97203, imp-97225 so the reclassification is
 * discoverable from all three.
 *
 * WHAT REMAINS OPEN (imp-97267 named residual, unaffected by this note):
 *   a certified EVALUATION of the net OFFDIAG (shown comparable to, and no more than a bounded multiple of,
 *   DIAG) so that M2w ~ 2 DIAG stays below the squared target 0.32546. A bound on |T_a(m)| alone does not
 *   suffice -- the off-diagonal is Theta(1) of the diagonal, not a lower-order remainder.
 * No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97267-route-m-inverse-map-kloosterman-transfer.js (source of every verdict flag below)
 * @see imp-97210-route-m-kappa-obligation-ledger.js (ledger: M2w is the sole open scalar; predates the reclassification)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (c_1 <= sqrt(M2w); parent sub-gap)
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (sibling: OVR ~1.25 single-modulus ladder, unchanged)
 *
 * Ticket: imp-97295 (content, medium, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97267_DEFAULT, { IMP97267_MEASURED, IMP97267_VERDICT, IMP97267_SUBGAP } from './imp-97267-route-m-inverse-map-kloosterman-transfer.js';

export const IMP97295_STATUS = Object.freeze({
  ticket: 'imp-97295',
  sourceTicket: 'imp-97267',
  priorFraming: 'bounding problem: absorb a bounded ~1.25 oversampling (imp-97203/imp-97225 framing)',
  refinedFraming: 'evaluation problem: evaluate the net co-leading OFFDIAG twisted second moment (imp-97267)',
  detectionIdentityRigorous: IMP97267_VERDICT.detectionIdentityRigorous,
  offDiagonalNegligible: IMP97267_VERDICT.offDiagonalNegligible,
  weilBoundRouteSuffices: IMP97267_VERDICT.weilBoundRouteSuffices,
  transferIsEvaluationNotBound: IMP97267_VERDICT.transferIsEvaluationNotBound,
  offDiagOverDiag: IMP97267_MEASURED.offDiagOverDiag,
  offDiagShareOfM2w: IMP97267_MEASURED.offDiagShareOfM2w,
  m2wCertified: IMP97267_VERDICT.m2wCertified,
  subGapId: IMP97267_SUBGAP.id,
  ledgerCrossLinked: 'imp-97210-route-m-kappa-obligation-ledger.js',
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97295_HONEST_BANNER =
  'imp-97267 result recorded: the M2w inverse-line transfer input is RECLASSIFIED from a bounding problem ' +
  '(absorb a bounded ~1.25 oversampling, the imp-97203/imp-97225 framing) to an evaluation problem -- the ' +
  'exact character-detection identity M2w * Sum_a a = DIAG + OFFDIAG shows OFFDIAG ~ DIAG (co-leading, ~half ' +
  'of M2w, net positive, stable to b=401), so a Weil/Kloosterman bound on the twisted moments cannot certify ' +
  'M2w -- the transfer must evaluate the net off-diagonal. The imp-97210 kappa obligation ledger, imp-97203, ' +
  'and imp-97225 are cross-linked to this reclassification. M2w ~ 0.16 and OVR ~1.25 stay measured. No bound ' +
  'on Lambda moves; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97295_ASSERTIONS = [
  {
    id: 'imp97295-status-matches-committed-imp97267-verdict',
    holds: () =>
      IMP97295_STATUS.detectionIdentityRigorous === IMP97267_VERDICT.detectionIdentityRigorous &&
      IMP97295_STATUS.offDiagonalNegligible === IMP97267_VERDICT.offDiagonalNegligible &&
      IMP97295_STATUS.weilBoundRouteSuffices === IMP97267_VERDICT.weilBoundRouteSuffices &&
      IMP97295_STATUS.transferIsEvaluationNotBound === IMP97267_VERDICT.transferIsEvaluationNotBound &&
      IMP97295_STATUS.m2wCertified === IMP97267_VERDICT.m2wCertified &&
      IMP97295_STATUS.subGapId === IMP97267_SUBGAP.id &&
      IMP97267_DEFAULT.verdict === IMP97267_VERDICT,
    why: 'this honest-status note must reproduce the exact verdict flags already established by imp-97267, not a re-derivation.',
  },
  {
    id: 'imp97295-reclassification-is-from-bounding-to-evaluation',
    holds: () =>
      /bounding problem/.test(IMP97295_STATUS.priorFraming) &&
      /evaluation problem/.test(IMP97295_STATUS.refinedFraming) &&
      IMP97295_STATUS.offDiagonalNegligible === false &&
      IMP97295_STATUS.transferIsEvaluationNotBound === true &&
      IMP97295_STATUS.offDiagOverDiag > 0.9 && IMP97295_STATUS.offDiagOverDiag < 1.1,
    why: 'the note must record the specific reclassification: the off-diagonal is co-leading (not negligible), so the open task is evaluation, not bounding.',
  },
  {
    id: 'imp97295-honesty-gate-no-qed',
    holds: () =>
      IMP97295_STATUS.anyBoundMoved === false &&
      IMP97295_STATUS.operatorPositivityProved === false &&
      IMP97295_STATUS.rhResolved === false &&
      IMP97295_STATUS.qed === false &&
      /NO QED/.test(IMP97295_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97295_HONEST_BANNER) &&
      /RH open/.test(IMP97295_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97295_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97295-route-m-offdiagonal-evaluation-reclassification-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97295_STATUS, banner: IMP97295_HONEST_BANNER };
