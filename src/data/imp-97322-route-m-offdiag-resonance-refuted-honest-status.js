/**
 * @fileoverview imp-97322 -- import-light honest-status note recording the imp-97285 RESULT 3: the OFFDIAG
 * twisted-second-moment mass is NOT carried by the diagonal-recovering resonance m == +-h_a (a REFUTED
 * evaluation route), together with the Rw identification -- the OFFDIAG evaluation is the SAME bounded ~1.2
 * oversampling the imp-97203/imp-97225 framing already named, not a strictly harder new object.
 *
 * WHY A NOTE (not a re-derivation). imp-97285 already carries the exact factorization M2w = Rw*Mbar, the
 * resonance-share measurement, and its own self-executing assertions establish every flag below. This module
 * only records the honest status for the frontier index and cross-links imp-97267 (parent detection identity),
 * imp-97295 (prior reclassification note), and imp-97310 (Rw mean-value decomposition) so Result 3 is
 * discoverable from all three.
 *
 * WHAT REMAINS OPEN (imp-97285 named residual, unaffected by this note): a uniform equidistribution bound on
 * the single oversampling scalar Rw = X/Xbar (sufficient target Rw < ~2.5, measured ~1.2, ~2x headroom). The
 * resonance-main-term route is ruled out, not replaced -- no alternative evaluation route is established here.
 * No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97285-route-m-offdiag-oversampling-factorization.js (source of Result 3 and every verdict flag below)
 * @see imp-97267-route-m-inverse-map-kloosterman-transfer.js (parent: DIAG + OFFDIAG detection identity)
 * @see imp-97295-route-m-offdiagonal-evaluation-reclassification-honest-status.js (prior reclassification note)
 * @see imp-97310-route-m-oversampling-rw-mean-value-decomposition.js (sibling: Rw per-modulus decomposition)
 *
 * Ticket: imp-97322 (content, medium, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97285_DEFAULT, { IMP97285_MEASURED, IMP97285_VERDICT, IMP97285_SUBGAP } from './imp-97285-route-m-offdiag-oversampling-factorization.js';

export const IMP97322_STATUS = Object.freeze({
  ticket: 'imp-97322',
  sourceTicket: 'imp-97285',
  refutedRoute: 'resonance-main-term evaluation of OFFDIAG (extract the m == +-h_a diagonal-recovering frequency as the main term)',
  refutationReason: 'the resonant terms m in {h_a, a-h_a} carry only ~1% of OFFDIAG (sign-varying share), so the off-diagonal mass is spread across all m mod a with no dominant frequency to extract',
  resonanceMainTermEvaluationRefuted: IMP97285_VERDICT.resonanceMainTermEvaluationRefuted,
  resonanceShareOfOffdiag: IMP97285_MEASURED.resonanceShareOfOffdiag,
  offDiagStrictlyHarderDowngraded: IMP97285_VERDICT.offDiagStrictlyHarderDowngraded,
  RwLevelWithOVR: IMP97285_VERDICT.RwLevelWithOVR,
  rwPlateau: IMP97285_MEASURED.RwPlateau,
  ovrPlateau: IMP97285_MEASURED.ovrPlateau,
  sufficientRwTarget: IMP97285_MEASURED.sufficientRwTarget,
  m2wCertified: IMP97285_VERDICT.m2wCertified,
  subGapId: IMP97285_SUBGAP.id,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97322_HONEST_BANNER =
  'imp-97285 Result 3 recorded: the OFFDIAG twisted-second-moment mass is NOT carried by the diagonal-' +
  'recovering resonance m == +-h_a -- the resonant terms carry only ~1% of OFFDIAG (sign-varying), so a ' +
  'resonance-main-term evaluation route is REFUTED (no dominant frequency to extract). The OFFDIAG evaluation ' +
  'is instead IDENTIFIED with the single bounded oversampling scalar Rw ~ 1.2 (level with the imp-97225/' +
  'imp-97271 OVR ~1.254 plateau), the same object the imp-97203/imp-97225 framing already named -- a downgrade ' +
  'of the imp-97267 "strictly harder" reclassification. Sufficient target Rw < ~2.5 has ~2x measured headroom. ' +
  'M2w stays MEASURED ~0.16; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97322_ASSERTIONS = [
  {
    id: 'imp97322-status-matches-committed-imp97285-verdict',
    holds: () =>
      IMP97322_STATUS.resonanceMainTermEvaluationRefuted === IMP97285_VERDICT.resonanceMainTermEvaluationRefuted &&
      IMP97322_STATUS.offDiagStrictlyHarderDowngraded === IMP97285_VERDICT.offDiagStrictlyHarderDowngraded &&
      IMP97322_STATUS.RwLevelWithOVR === IMP97285_VERDICT.RwLevelWithOVR &&
      IMP97322_STATUS.m2wCertified === IMP97285_VERDICT.m2wCertified &&
      IMP97322_STATUS.subGapId === IMP97285_SUBGAP.id &&
      IMP97285_DEFAULT.verdict === IMP97285_VERDICT,
    why: 'this honest-status note must reproduce the exact verdict flags already established by imp-97285, not a re-derivation.',
  },
  {
    id: 'imp97322-resonance-route-refuted-with-small-share',
    holds: () =>
      IMP97322_STATUS.resonanceMainTermEvaluationRefuted === true &&
      IMP97322_STATUS.resonanceShareOfOffdiag > -0.05 && IMP97322_STATUS.resonanceShareOfOffdiag < 0.05 &&
      IMP97322_STATUS.rwPlateau > 1.0 && IMP97322_STATUS.rwPlateau < 1.35,
    why: 'the note must record the specific refutation: the resonant m == +-h_a terms carry only a small (~1%) share of OFFDIAG, and the identified Rw plateau stays in the measured ~1.1..1.25 band.',
  },
  {
    id: 'imp97322-honesty-gate-no-qed',
    holds: () =>
      IMP97322_STATUS.anyBoundMoved === false &&
      IMP97322_STATUS.operatorPositivityProved === false &&
      IMP97322_STATUS.rhResolved === false &&
      IMP97322_STATUS.qed === false &&
      IMP97322_STATUS.m2wCertified === false &&
      /NO QED/.test(IMP97322_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97322_HONEST_BANNER) &&
      /RH open/.test(IMP97322_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97322_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97322-route-m-offdiag-resonance-refuted-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97322_STATUS, banner: IMP97322_HONEST_BANNER };
