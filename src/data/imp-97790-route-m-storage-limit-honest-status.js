/**
 * @module imp-97790-route-m-storage-limit-honest-status
 * @fileoverview imp-97790 -- HONEST-STATUS NOTE restating, standalone, the imp-97763 decision that the
 *   Route M residual ladder's ~10.46-significant-figure minimum agreement (imp-97742) is a STORAGE
 *   limit, not a constant-precision limit. imp-97763 re-derived the two Route M gap-law kernel
 *   constants lnA = log(glaisher) and B_inf = lnA + gamma/12 at mpmath dps=50 (checked against an
 *   independent dps=80 reference) and found the dps=40 values were already correct to ~40.6
 *   significant figures -- some ~30 figures beyond the ~10 figures actually stored in the
 *   imp-97722/imp-97742 residual ladder literals. Even after the gap-minus-law catastrophic
 *   cancellation (~6 digits lost), the usable residual precision at dps=40 (~34.6 figs) still far
 *   exceeds the ~10 stored figures. So the ~10.46-sig-fig minimum ladder agreement is bounded by how
 *   the ladder is STORED, not by how precisely the kernel constants are known. Documentation only:
 *   re-exports the imp-97763 verdict verbatim, no new numerics, no bound moves, NO QED.
 *
 * @see imp-97763-route-m-ladder-constant-precision-floor.js (source measurement + decision)
 * @see imp-97742-route-m-ladder-dps40-crosscheck.js (the dps=40 ladder this bounds)
 * @see imp-97722-route-m-deep-ladder-independent-crosscheck.js (the 23-rung baked ladder)
 *
 * Ticket: imp-97790 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda
 * moves; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import {
  IMP97763_CONSTANTS,
  IMP97763_PRECISION_BUDGET,
  IMP97763_VERDICT,
} from './imp-97763-route-m-ladder-constant-precision-floor.js';

export const IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97790',
  question:
    'is the imp-97742 Route M residual ladder ~10.46-sig-fig minimum agreement a STORAGE limit ' +
    '(baked ~10-digit literals) or a CONSTANT-PRECISION limit (lnA / B_inf not known precisely enough)?',
  answer:
    'It is a STORAGE limit, not a constant-precision limit. Re-deriving lnA = log(glaisher) and ' +
    'B_inf = lnA + gamma/12 at dps=50 (checked against a dps=80 reference) shows the dps=40 values ' +
    'were already correct to ~40.6 significant figures -- some ~30 figures beyond the ~10 figures ' +
    'stored in the imp-97722/imp-97742 residual ladder. Even after the gap-minus-law catastrophic ' +
    'cancellation (~6 digits lost), the usable residual precision at dps=40 (~34.6 figs) still ' +
    'exceeds the ~10 stored figures by more than 20. So the constants could carry the ladder to ' +
    '~34-40 figures if it were stored at higher precision; the ~10.46-sig-fig minimum agreement is ' +
    'an artifact of the ~10-digit baked literals, not a limit on how well lnA / B_inf are known.',
  constantSigFigsDps40: IMP97763_PRECISION_BUDGET.constantSigFigsDps40, // ~40.58
  constantSigFigsDps50: IMP97763_PRECISION_BUDGET.constantSigFigsDps50, // ~51.06
  ladderStoredSigFigs: IMP97763_PRECISION_BUDGET.ladderStoredSigFigs, // 10
  imp97742MinAgreementSigFigs: IMP97763_PRECISION_BUDGET.imp97742MinAgreementSigFigs, // 10.46
  usableResidualSigFigsDps40: IMP97763_PRECISION_BUDGET.usableResidualSigFigsDps40, // ~34.6
  headroomOverStorage:
    IMP97763_PRECISION_BUDGET.constantSigFigsDps40 - IMP97763_PRECISION_BUDGET.ladderStoredSigFigs, // ~30.58
  lnA_incrementalRel: IMP97763_CONSTANTS.lnA_incrementalRel, // ~2.6e-41
  minAgreementIsStorageLimit: IMP97763_VERDICT.minAgreementIsStorageLimit, // true
  constantsExceedStorage: IMP97763_VERDICT.constantsExceedStorage, // true
  ladderPrecisionLimited: IMP97763_VERDICT.ladderPrecisionLimited, // false
  mcmRefuted: IMP97763_VERDICT.mcmRefuted, // true
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.minAgreementIsStorageLimit === true &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.constantsExceedStorage === true &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.ladderPrecisionLimited === false &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.constantSigFigsDps40 > 40 &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.headroomOverStorage > 20 &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.usableResidualSigFigsDps40 >
      IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.ladderStoredSigFigs &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.mcmRefuted === true &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.anyBoundMoved === false &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.measurementOnly === true &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.isRigorous === false &&
    IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97790-route-m-storage-limit-honest-status assertion FAILED: the Route M ladder minimum ' +
      'agreement must record as a storage limit, with the kernel constants carrying > 20 figures of ' +
      'headroom over the ~10 stored figures.'
  );
}

export default IMP97790_ROUTE_M_STORAGE_LIMIT_HONEST_STATUS;
