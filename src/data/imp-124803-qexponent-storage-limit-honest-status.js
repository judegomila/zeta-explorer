/**
 * @module imp-124803-qexponent-storage-limit-honest-status
 * @fileoverview imp-124803 -- HONEST-STATUS NOTE recording that the imp-97640 RESULT 3 precision limit on
 *   the Route M gap-law decay-exponent q measurement is a STORAGE artifact of the 7-sig-fig baked residual
 *   ladder (imp-2546 rule), not a constant-precision limit. imp-97640 measured local exponents
 *   q(7919->104729)=6.839, q(104729->1299709)=8.713, q(1299709->1999993)=7.495 on a residual ladder formed
 *   as a catastrophic-cancellation difference of two ~1.15e-2 quantities stored to 7 sig figs, so the third
 *   rung (residual ratio only 1.25) carried just ~3 sig figs and was flagged precision-limited. imp-97763
 *   showed the underlying kernel constants lnA=log(glaisher) and B_inf=lnA+gamma/12 are known to ~34-40 sig
 *   figs at dps=40 (imp-97790 restated this for the imp-97742 ladder), ~30 figures beyond the ~10 actually
 *   stored -- i.e. the constants have ample headroom to support a much higher-precision ladder. imp-124789
 *   then closed the loop DIRECTLY on this exact ladder: re-materializing gap and law at the original four
 *   heights with mpmath dps=40 and full-precision constants left all three local exponents essentially
 *   unchanged (6.83930, 8.71259, 7.49854 vs the 7-fig 6.839, 8.713, 7.495) -- the previously
 *   precision-limited third rung recomputes to 7.499, confirming its low residual ratio (1.254) is a real
 *   feature of the residual, not a 7-fig cancellation artifact. So lifting the storage limit does not
 *   change the exponent readings: the imp-97640 precision-limited flag was a caveat about the STORED
 *   literals, not about the achievable precision of the constants feeding them. Documentation only:
 *   re-exports the imp-97763/imp-124789 verdicts verbatim, no new numerics, no bound moves, NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (the q-exponent measurement + RESULT 3 flag)
 * @see imp-97763-route-m-ladder-constant-precision-floor.js (constants carry ~34-40 sig figs, ~30 beyond storage)
 * @see imp-97790-route-m-storage-limit-honest-status.js (same storage-vs-constant argument for the imp-97742 ladder)
 * @see imp-124789-route-m-shallow-ladder-extprec.js (direct dps=40 re-materialization of THIS ladder: q unchanged)
 *
 * Ticket: imp-124803 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97640_LOCAL_EXPONENTS, IMP97640_RESULTS } from './imp-97640-route-m-gap-law-residual-decay-exponent.js';
import { IMP97763_PRECISION_BUDGET } from './imp-97763-route-m-ladder-constant-precision-floor.js';
import { IMP124789_LOCAL_EXPONENTS, IMP124789_VERDICT } from './imp-124789-route-m-shallow-ladder-extprec.js';

export const IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS = Object.freeze({
  ticket: 'imp-124803',
  question:
    'is the imp-97640 RESULT 3 precision limit on the third-rung local decay exponent q a STORAGE limit ' +
    '(7-sig-fig baked residual literals) or a CONSTANT-PRECISION limit (lnA / B_inf not known precisely enough)?',
  answer:
    'It is a STORAGE limit, not a constant-precision limit. imp-97763 shows lnA=log(glaisher) and ' +
    'B_inf=lnA+gamma/12 carry ~40.6 significant figures at dps=40, ~30 figures beyond the ~10 figures ' +
    'stored in the imp-97640 residual ladder -- ample headroom to feed a much higher-precision ladder. ' +
    'imp-124789 confirms this DIRECTLY on the exact ladder in question: re-materializing gap and law at the ' +
    'original four heights with mpmath dps=40 and full-precision constants leaves all three local exponents ' +
    'essentially unchanged (6.83930, 8.71259, 7.49854 vs the 7-fig 6.839, 8.713, 7.495), and the previously ' +
    'precision-limited third rung recomputes to 7.499 with its low residual ratio (1.254) confirmed as a ' +
    'real feature, not a cancellation artifact. So the imp-97640 precision-limited flag describes the ' +
    'STORED literals, not the achievable precision of the underlying constants.',
  sevenFigExponents: IMP97640_LOCAL_EXPONENTS.map((e) => e.qLocal), // 6.839, 8.713, 7.495
  extPrecExponents: IMP124789_LOCAL_EXPONENTS.map((e) => e.qLocal), // 6.83930, 8.71259, 7.49854
  thirdRungRatioDouble: IMP97640_LOCAL_EXPONENTS[2].residualRatio,
  thirdRungRatioExtPrec: IMP124789_LOCAL_EXPONENTS[2].residualRatio,
  constantSigFigsDps40: IMP97763_PRECISION_BUDGET.constantSigFigsDps40, // ~40.58
  ladderStoredSigFigs: IMP97763_PRECISION_BUDGET.ladderStoredSigFigs, // 10
  headroomOverStorage:
    IMP97763_PRECISION_BUDGET.constantSigFigsDps40 - IMP97763_PRECISION_BUDGET.ladderStoredSigFigs, // ~30.58
  namedSubGap: IMP97640_RESULTS.subGap, // IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6
  exponentsEssentiallyUnchangedByExtPrec: IMP124789_VERDICT.exponentsEssentiallyUnchanged, // true
  qLimitIsStorageLimit: true,
  qLimitIsConstantPrecisionLimit: false,
  mcmRefuted: true,
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.qLimitIsStorageLimit === true &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.qLimitIsConstantPrecisionLimit === false &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.constantSigFigsDps40 > 40 &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.headroomOverStorage > 20 &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.exponentsEssentiallyUnchangedByExtPrec === true &&
    Math.abs(
      IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.thirdRungRatioDouble -
        IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.thirdRungRatioExtPrec
    ) < 0.01 &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.mcmRefuted === true &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.anyBoundMoved === false &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.measurementOnly === true &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.isRigorous === false &&
    IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-124803-qexponent-storage-limit-honest-status assertion FAILED: the imp-97640 q-exponent precision ' +
      'limit must record as a storage limit, with the extended-precision third-rung ratio matching the ' +
      '7-sig-fig ratio to within 0.01 and the kernel constants carrying > 20 figures of headroom over the ' +
      '~10 stored figures.'
  );
}

export default IMP124803_QEXPONENT_STORAGE_LIMIT_HONEST_STATUS;
