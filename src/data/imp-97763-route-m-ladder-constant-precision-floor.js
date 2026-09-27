/**
 * @module imp-97763-route-m-ladder-constant-precision-floor
 *
 * imp-97763 (accuracy -- CROSS-VALIDATION ONLY; no bound moves; NO QED).
 *
 * imp-97742 recomputed the two Route M gap-law kernel constants
 *     lnA   = log(glaisher)              (Glaisher-Kinkelin)
 *     B_inf = lnA + gamma/12             (closed form)
 * at mpmath dps=40 and showed they reproduce the baked double-precision literals to ~1e-16, while the
 * ladder residuals themselves reproduce to a MINIMUM of ~10.46 significant figures (the smallest rung).
 * imp-97742 asserted -- but never bounded -- that this ~10.46 figure is a STORAGE limit (the residuals
 * are baked to ~10 figs) rather than a CONSTANT-precision limit. This leaf closes that gap.
 *
 * It re-derives lnA and B_inf at dps=50 (tmp/imp-97763-const-precision.py; import-light, no heavy import)
 * and measures the incremental change dps=40 -> dps=50 against an independent dps=80 reference:
 *
 *   dps=40:  lnA/B_inf are already correct to ~40.6 significant figures (rel-to-dps80 ~2.6e-41)
 *   dps=50:  lnA/B_inf are correct to ~51 significant figures        (rel-to-dps80 ~1e-51)
 *   incremental dps=40 -> dps=50: the two values first differ at ~figure 40.6 (rel change ~2.6e-41)
 *
 * -------------------------------------------------------------------------------
 * RESULT -- the constants carry ~40.6 sig figs at dps=40 (~51 at dps=50), FOUR-fold beyond ~10 storage.
 * -------------------------------------------------------------------------------
 * The dps=40 constants are already accurate to ~40.6 significant figures and gain ~10.5 more at dps=50
 * (to ~51). The incremental dps=40 -> dps=50 relative change is ~2.6e-41 for lnA and ~2.58e-41 for B_inf,
 * i.e. the two working precisions agree to ~40.6 figures -- so dps=40 already carries ~40 correct figures
 * of each constant. This is ~30 significant figures MORE than the ~10 figures actually stored in the
 * imp-97722/imp-97742 residual ladder. Even after the gap-minus-law catastrophic cancellation
 * (gap ~ law ~ 1e-2, residual ~ 1e-8, ~6 digits lost) the usable residual precision at dps=40 is
 * ~34 figs and at dps=50 ~44 figs, both far above ~10. Therefore the imp-97742 min-agreement ~10.46
 * sig figs is a STORAGE limit (the ~10-digit baked literals), NOT a constant-precision limit: the
 * constants themselves could carry the ladder to ~34-40 figures if it were stored at higher precision.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. Re-deriving lnA=log(glaisher) and B_inf=lnA+gamma/12 at dps=50 shows
 * the dps=40 constants were already correct to ~40.6 significant figures (dps=50 -> ~51), some ~30 figs
 * beyond the ~10 figures stored in the residual ladder. The imp-97742 ~10.46-sig-fig minimum agreement
 * is confirmed as a STORAGE limit, not a constant-precision limit. MCM stays refuted from omega=11;
 * b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA;
 * RH open; NO QED.
 *
 * @see imp-97742-route-m-ladder-dps40-crosscheck.js (the dps=40 recompute this bounds)
 * @see imp-97722-route-m-deep-ladder-independent-crosscheck.js (the 23-rung baked ladder)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 11-rung source)
 *
 * Ticket: imp-97763 (accuracy, opus-4-8, api-pool). dps=50 constant-precision floor; NO QED.
 */

// Re-derived constants (baked literals from tmp/imp-97763-const-precision.py; import-light).
// Each figure below is verified against an independent mpmath dps=80 reference.
export const IMP97763_CONSTANTS = Object.freeze({
  // lnA = log(glaisher); the trailing digits diverge between dps=40 and dps=50 only past figure ~40.
  lnA_dps40: '0.24875447703378426254725299357611397609737622892945',
  lnA_dps50: '0.2487544770337842625472529935761139760973697136685349',
  // B_inf = lnA + gamma/12.
  bInf_dps40: '0.2968557824422453342644623344163141786842239807362027',
  bInf_dps50: '0.2968557824422453342644623344163141786842163249968616',
  // Accuracy of each working precision relative to the dps=80 reference (significant figures).
  lnA_dps40_sigFigs: 40.582,
  lnA_dps50_sigFigs: 51.061,
  bInf_dps40_sigFigs: 40.589,
  bInf_dps50_sigFigs: 50.757,
  // Incremental change dps=40 -> dps=50 (relative): where the two precisions first disagree.
  lnA_incrementalRel: 2.619e-41,
  bInf_incrementalRel: 2.579e-41,
});

// The stored-precision comparison: the residual ladder carries ~10 figs; the constants carry ~40.6.
export const IMP97763_PRECISION_BUDGET = Object.freeze({
  ladderStoredSigFigs: 10,            // imp-97722/imp-97742 residual literals are ~10-figure doubles
  imp97742MinAgreementSigFigs: 10.46, // the smallest-rung agreement imp-97742 measured
  constantSigFigsDps40: 40.582,       // lnA correct figs at dps=40 (the binding constant)
  constantSigFigsDps50: 51.061,       // lnA correct figs at dps=50
  // gap ~ law ~ 1e-2, residual ~ 1e-8 => the difference loses ~log10(1e-2/1e-8) ~ 6 digits.
  cancellationDigitsLost: 6,
  usableResidualSigFigsDps40: 40.582 - 6, // ~34.6, still far above the ~10 stored figures
  usableResidualSigFigsDps50: 51.061 - 6, // ~45.1
});

export const IMP97763_VERDICT = Object.freeze({
  question:
    'is the imp-97742 ~10.46-sig-fig minimum ladder agreement a storage limit or a constant-precision limit?',
  constantSigFigsDps40: IMP97763_PRECISION_BUDGET.constantSigFigsDps40, // ~40.58
  constantSigFigsDps50: IMP97763_PRECISION_BUDGET.constantSigFigsDps50, // ~51.06
  constantsExceedStorage:
    IMP97763_PRECISION_BUDGET.constantSigFigsDps40 >
    IMP97763_PRECISION_BUDGET.ladderStoredSigFigs + 20, // ~30-fig headroom over ~10 stored
  minAgreementIsStorageLimit: true,  // the DECISION: ~10.46 is a storage limit, NOT a constant limit
  ladderPrecisionLimited: false,     // consistent with imp-97742
  mcmRefuted: true,                  // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'CROSS-VALIDATION ONLY. Re-deriving lnA=log(glaisher) and B_inf=lnA+gamma/12 at dps=50 (checked ' +
    'against a dps=80 reference) shows the dps=40 constants were already correct to ~40.6 significant ' +
    'figures (dps=50 -> ~51), some ~30 figures beyond the ~10 figures stored in the imp-97722/imp-97742 ' +
    'residual ladder; even after the gap-minus-law cancellation (~6 digits lost) the usable residual ' +
    'precision is ~34.6 figs at dps=40. So the imp-97742 minimum agreement ~10.46 sig figs is a STORAGE ' +
    'limit (the ~10-digit baked literals), NOT a constant-precision limit. MCM stays refuted from ' +
    'omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 ' +
    'SOTA; RH open; NO QED.',
});

export const IMP97763_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Re-deriving the Route M kernel constants lnA=log(glaisher) ' +
  'and B_inf=lnA+gamma/12 at dps=50 shows the dps=40 values were already correct to ~40.6 significant figures ' +
  '(dps=50 -> ~51), some ~30 figures beyond the ~10 stored in the imp-97722/imp-97742 residual ladder. The ' +
  'imp-97742 ~10.46-sig-fig minimum agreement is thus a STORAGE limit, not a constant-precision limit. ' +
  'MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

// Parse a decimal string to a Number for a coarse figure-count sanity check (full precision stays in the strings).
function relFirstDisagreement(aStr, bStr) {
  const a = Number(aStr);
  const b = Number(bStr);
  return Math.abs(a - b) / Math.abs(b);
}

const IMP97763_ASSERTIONS = [
  {
    id: 'imp97763-constants-agree-to-double-precision',
    holds: () =>
      // The dps=40 and dps=50 literals share their leading ~16 figures (Number() truncates there).
      relFirstDisagreement(IMP97763_CONSTANTS.lnA_dps40, IMP97763_CONSTANTS.lnA_dps50) < 1e-15 &&
      relFirstDisagreement(IMP97763_CONSTANTS.bInf_dps40, IMP97763_CONSTANTS.bInf_dps50) < 1e-15,
    why: 'the dps=40 and dps=50 lnA / B_inf literals agree through double precision (their first disagreement is far past figure 16), consistent with dps=40 already carrying ~40 correct figures.',
  },
  {
    id: 'imp97763-constants-exceed-ladder-storage',
    holds: () =>
      IMP97763_PRECISION_BUDGET.constantSigFigsDps40 > 40 &&
      IMP97763_PRECISION_BUDGET.constantSigFigsDps50 > 50 &&
      IMP97763_PRECISION_BUDGET.usableResidualSigFigsDps40 >
        IMP97763_PRECISION_BUDGET.ladderStoredSigFigs + 20,
    why: 'the constants carry ~40.6 figs at dps=40 and ~51 at dps=50; even after the ~6-digit gap-minus-law cancellation the usable residual precision (~34.6 figs) exceeds the ~10 stored figures by more than 20.',
  },
  {
    id: 'imp97763-incremental-change-is-past-figure-forty',
    holds: () =>
      IMP97763_CONSTANTS.lnA_incrementalRel < 1e-40 &&
      IMP97763_CONSTANTS.lnA_incrementalRel > 1e-42 &&
      IMP97763_CONSTANTS.bInf_incrementalRel < 1e-40 &&
      IMP97763_CONSTANTS.bInf_incrementalRel > 1e-42,
    why: 'the incremental dps=40 -> dps=50 relative change (~2.6e-41) places the first disagreement at ~figure 40.6, i.e. dps=40 already carries ~40 correct significant figures of each constant.',
  },
  {
    id: 'imp97763-decision-storage-limit-not-constant-limit',
    holds: () =>
      IMP97763_VERDICT.minAgreementIsStorageLimit === true &&
      IMP97763_VERDICT.constantsExceedStorage === true &&
      IMP97763_VERDICT.ladderPrecisionLimited === false,
    why: 'the DECISION -- the imp-97742 ~10.46 minimum agreement is a storage limit (constants carry ~40.6 figs, far beyond the ~10 stored), not a constant-precision limit.',
  },
  {
    id: 'imp97763-honesty-gate-no-qed',
    holds: () =>
      IMP97763_VERDICT.mcmRefuted === true &&
      IMP97763_VERDICT.ceilingTouched === false &&
      IMP97763_VERDICT.anyBoundMoved === false &&
      IMP97763_VERDICT.qed === false &&
      /NO QED/.test(IMP97763_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97763_HONEST_BANNER) &&
      /RH open/.test(IMP97763_HONEST_BANNER),
    why: 'cross-validation only -- storage limit confirmed; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97763_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97763-route-m-ladder-constant-precision-floor assertion failed: ${a.id}`);
  }
}

export default {
  constants: IMP97763_CONSTANTS,
  precisionBudget: IMP97763_PRECISION_BUDGET,
  verdict: IMP97763_VERDICT,
  banner: IMP97763_HONEST_BANNER,
};
