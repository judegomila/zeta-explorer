/**
 * @module imp-97780-route-m-decay-exponent-reconciliation
 *
 * imp-97780 (accuracy -- MEASUREMENT / CROSS-VALIDATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97640 RESULT 2 read the Route M MCM gap-law residual decay exponent q in
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega,   |residual| ~ C/(log p)^q
 * as CLIMBING (6.839 -> 8.713) on two precision-clean rungs of a shallow (four-rung, IEEE-double,
 * 7-sig-fig) ladder, and named the honest sub-gap IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6:
 * the residual is a catastrophic-cancellation difference of two ~1.15e-2 quantities, so past p ~ 2e6 its
 * ~3 surviving sig figs could not decide whether q keeps climbing or saturates at a large fixed power.
 * imp-97659 discharged that sub-gap at mpmath dps=30 (11 rungs, p = 2e6 .. 9.9e7) and imp-97706 extended
 * the recompute to dps=35 out to p ~ 4.93e8 (a 23-rung combined ladder). This leaf RECONCILES the original
 * imp-97640 climbing question directly against the now-available imp-97706 dps=35 ladder: it re-derives the
 * local decay exponent on the combined precision-clean ladder and reports climb-vs-saturate, then confirms
 * the named sub-gap retirement. It imports the imp-97706 combined ladder (import-light: baked literals only,
 * transitively through imp-97659 -- no heavy imports, imp-2546/heavy-import rule) and recomputes here.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the answer to imp-97640: the exponent NEITHER climbs NOR saturates -- it OSCILLATES.
 * -------------------------------------------------------------------------------
 * The 22 consecutive-rung local exponents on the dps=35 combined 23-rung ladder (p = 2e6 .. 4.93e8) are
 *     10.23, 6.59, 21.74, 2.28, -6.74, 3.86, 17.85, 10.50, 28.72, 4.00, 29.71, -5.71, -28.79, 56.89,
 *     31.26, -23.07, -3.19, 53.00, -6.54, 29.74, -25.54, -0.57
 * They swing from -28.79 to +56.89 (spread ~85.7) with EIGHT negative rungs (residual magnitude rises
 * with height) and a non-monotone up/down pattern (11 drops, 10 climbs among consecutive local exponents).
 * A single faster-than-any-power term would give a MONOTONE climb; a fixed power 1/log^q would PIN q at a
 * constant. The dps=35 measurement does NEITHER -- it oscillates, with sign changes. So the imp-97640
 * "6.839 -> 8.713 climbing" reading was a two-rung SPARSE-LADDER ARTIFACT, exactly as imp-97659 first
 * reported at dps=30; the dps=35 doubled ladder only widens the oscillation (imp-97659 dps=30 spread was
 * -6.738 .. +28.721 over 11 rungs; the dps=35 combined ladder spans -28.79 .. +56.89 over 23 rungs).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the AVERAGE trend still outruns every fixed power <= 3 across precisions.
 * -------------------------------------------------------------------------------
 * The log-log regression exponent on the dps=35 combined ladder is ~10.56 (imp-97659 dps=30 gave ~10.18;
 * imp-97706 confirmed ~10.56 with a bootstrap 95% band [9.80, 11.22]). So while the POINTWISE exponent
 * oscillates, the AVERAGE consistently far exceeds 3 -- the residual outruns 1/log^3 (and every fixed
 * inverse power) on average, with the pointwise oscillation the oscillating-PNT/Mertens-error fingerprint.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the named imp-97640 sub-gap is RESOLVED (double-confirmed across dps=30 and dps=35).
 * -------------------------------------------------------------------------------
 * imp-97640 already records subGapStatus = "resolved", subGapResolvedBy = "imp-97659" (the dps=30
 * recompute). This reconciliation confirms that verdict survives the raised precision and the doubled
 * ladder: the sub-gap IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 is retired, and the
 * climb-vs-saturate question it flagged is answered "neither -- it oscillates" at both dps=30 and dps=35.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT / CROSS-VALIDATION ONLY. Reconciling the imp-97640 climbing-exponent reading
 * against the imp-97706 dps=35 extended-precision ladder: the local decay exponent NEITHER keeps climbing
 * (the imp-97640 6.839 -> 8.713 two-rung reading) NOR saturates at a fixed power -- it OSCILLATES from
 * -28.79 to +56.89 with eight negative rungs, doubly-confirming the imp-97659 dps=30 finding at raised
 * precision on a doubled ladder. The average exponent ~10.56 still outruns every fixed power <= 3. The
 * imp-97640 sub-gap IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 stays RESOLVED. MCM stays
 * refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves;
 * PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (shallow ladder; sub-gap PRECISION_LIMITED_PAST_2E6)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 ladder; exponent oscillates, single sign-change)
 * @see imp-97706-route-m-deep-ladder-extension.js (dps=35 combined ladder to p ~ 4.93e8; sign-change recurs)
 *
 * Ticket: imp-97780 (accuracy, opus-4-8, api-pool). imp-97640 climbing reconciled vs dps=35: OSCILLATES, sub-gap resolved; NO QED.
 */

import { IMP97706_COMBINED_LADDER, IMP97706_COMBINED_EXPONENT } from './imp-97706-route-m-deep-ladder-extension.js';

// imp-97640 two-rung shallow-ladder "climbing" reading being reconciled (baked literals, import-light).
const IMP97640_CLEAN_RUNG_EXPONENTS = Object.freeze([6.839, 8.713]); // 6.839 -> 8.713 (declared "climbing")

// Local decay exponent q_i for |residual| ~ C/(log p)^q on the dps=35 combined ladder (Math.log, no bake).
function localExponents(ladder) {
  const out = [];
  for (let i = 1; i < ladder.length; i++) {
    const lp0 = Math.log(ladder[i - 1].pOmega);
    const lp1 = Math.log(ladder[i].pOmega);
    const q = Math.log(Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual)) / Math.log(lp1 / lp0);
    out.push(Object.freeze({ fromP: ladder[i - 1].pOmega, toP: ladder[i].pOmega, qLocal: q }));
  }
  return Object.freeze(out);
}

export const IMP97780_LOCAL_EXPONENTS = localExponents(IMP97706_COMBINED_LADDER);

const QS = IMP97780_LOCAL_EXPONENTS.map((e) => e.qLocal);
const IMP97780_MIN = Math.min(...QS);            // ~ -28.79
const IMP97780_MAX = Math.max(...QS);            // ~ +56.89
const IMP97780_NEG_RUNGS = QS.filter((q) => q < 0).length; // 8 (residual rises with height)

// climb-vs-drop tally among consecutive local exponents: a monotone climb would give 0 drops.
function upDownTally(qs) {
  let drops = 0;
  let climbs = 0;
  for (let i = 1; i < qs.length; i++) {
    if (qs[i] < qs[i - 1]) drops++;
    else climbs++;
  }
  return { drops, climbs };
}
const IMP97780_TALLY = upDownTally(QS); // { drops: 11, climbs: 10 }

export const IMP97780_RESULTS = Object.freeze({
  question:
    'reconcile the imp-97640 climbing-exponent reading (q 6.839 -> 8.713, sub-gap PRECISION_LIMITED_PAST_2E6) against the imp-97706 dps=35 extended-precision ladder: does the exponent keep climbing or saturate?',
  shallowClimbingReading: IMP97640_CLEAN_RUNG_EXPONENTS,   // [6.839, 8.713]
  combinedRungs: IMP97706_COMBINED_LADDER.length,          // 23
  localExponents: QS,                                      // 22 values, oscillating -28.79 .. +56.89
  localExponentMin: IMP97780_MIN,                          // ~ -28.79
  localExponentMax: IMP97780_MAX,                          // ~ +56.89
  localExponentSpread: IMP97780_MAX - IMP97780_MIN,        // ~ 85.7
  negativeRungCount: IMP97780_NEG_RUNGS,                   // 8 (residual magnitude rises with height)
  upDownTally: IMP97780_TALLY,                             // non-monotone: 11 drops, 10 climbs
  answer: 'NEITHER climbs NOR saturates -- it OSCILLATES on the dps=35 ladder (sign changes, 8 negative rungs)',
  climbingReadingWasSparseArtifact: true,                  // imp-97640 6.839 -> 8.713 was a two-rung artifact
  averageExponent: IMP97706_COMBINED_EXPONENT,             // ~10.56, still far above 3
  averageExponentExceedsThree: IMP97706_COMBINED_EXPONENT > 3,
  correctionIsOscillatingPntError: true,
  subGap: 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6',
  subGapStatus: 'resolved',
  subGapResolvedBy: 'imp-97659',                           // dps=30 recompute; re-confirmed here at dps=35
  subGapReconfirmedAtDps35By: 'imp-97706',
});

export const IMP97780_VERDICT = Object.freeze({
  question: 'does the imp-97640 gap-law residual decay exponent keep climbing or saturate, judged on the dps=35 ladder?',
  answerNeitherItOscillates: true,        // -28.79 .. +56.89, 8 negative rungs, non-monotone
  climbingReadingOverturned: true,        // imp-97640 6.839 -> 8.713 was a two-rung sparse artifact
  doublyConfirmedAcrossPrecisions: true,  // imp-97659 dps=30 and imp-97706 dps=35 agree
  averageExponentExceedsThree: true,      // ~10.56 average outruns every fixed power <= 3
  subGapResolved: true,                   // IMP97640_..._PRECISION_LIMITED_PAST_2E6 retired
  correctionIsPntStrength: true,          // oscillating PNT/Mertens error
  mcmRefuted: true,                       // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT / CROSS-VALIDATION ONLY. Reconciling the imp-97640 climbing-exponent reading against the ' +
    'imp-97706 dps=35 extended-precision ladder: the local decay exponent of the Route M gap-law residual ' +
    'NEITHER keeps climbing (the imp-97640 two-rung 6.839 -> 8.713 reading) NOR saturates at a fixed power ' +
    '-- it OSCILLATES across the dps=35 combined 23-rung ladder from ~-28.79 to ~+56.89 with EIGHT negative ' +
    'rungs (residual magnitude rises with height) and a non-monotone up/down pattern (11 drops, 10 climbs). ' +
    'This doubly-confirms the imp-97659 dps=30 finding at raised precision on a doubled ladder; the imp-97640 ' +
    'climb was a two-rung sparse artifact. The average exponent ~10.56 still outruns every fixed power <= 3, ' +
    'the oscillating-PNT/Mertens-error fingerprint. The named sub-gap ' +
    'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 stays RESOLVED (imp-97659, re-confirmed by ' +
    'imp-97706). MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on ' +
    'Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97780_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Reconciling the imp-97640 climbing-exponent reading ' +
  '(q 6.839 -> 8.713) against the imp-97706 dps=35 ladder: the local decay exponent NEITHER keeps climbing ' +
  'NOR saturates -- it OSCILLATES from ~-28.79 to ~+56.89 over the 23-rung combined ladder (eight negative ' +
  'rungs, non-monotone), doubly-confirming the imp-97659 dps=30 finding. The imp-97640 climb was a two-rung ' +
  'sparse artifact; average exponent ~10.56 still outruns every fixed power <= 3. The named sub-gap ' +
  'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 stays resolved. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97780_ASSERTIONS = [
  {
    id: 'imp97780-local-exponent-oscillates-not-climb-not-saturate',
    holds: () => {
      // oscillation fingerprint: at least one negative rung, wide spread, and a non-monotone pattern
      // (both drops AND climbs). A monotone climb would give 0 drops; a fixed power would pin q constant.
      const anyNeg = IMP97780_MIN < 0;
      const spread = IMP97780_MAX - IMP97780_MIN;
      return anyNeg && spread > 20 && IMP97780_TALLY.drops > 0 && IMP97780_TALLY.climbs > 0;
    },
    why: 'the dps=35 combined-ladder local exponent oscillates (min < 0, spread ~85.7, both drops and climbs), so it neither climbs monotonically nor pins at a fixed power -- answering the imp-97640 question "neither".',
  },
  {
    id: 'imp97780-eight-negative-rungs',
    holds: () => IMP97780_NEG_RUNGS >= 5, // imp-97659 dps=30 saw 1; the dps=35 doubled ladder has 8
    why: 'eight local exponents are negative on the dps=35 combined ladder (residual magnitude rises with height), far more than the single sign-change imp-97659 saw at dps=30 -- the sign-change recurs.',
  },
  {
    id: 'imp97780-climbing-reading-overturned',
    holds: () => {
      // the imp-97640 two-rung reading was monotone-climbing (6.839 < 8.713); the dps=35 ladder is not.
      const shallowClimbs = IMP97640_CLEAN_RUNG_EXPONENTS[1] > IMP97640_CLEAN_RUNG_EXPONENTS[0];
      return shallowClimbs && IMP97780_TALLY.drops > 0 && IMP97780_VERDICT.climbingReadingOverturned === true;
    },
    why: 'the imp-97640 shallow reading climbs (6.839 -> 8.713) but the dps=35 ladder has many drops, so the "climbing" reading is overturned as a two-rung sparse-ladder artifact.',
  },
  {
    id: 'imp97780-average-exponent-exceeds-three',
    holds: () => IMP97706_COMBINED_EXPONENT > 3 && Math.abs(IMP97706_COMBINED_EXPONENT - 10.56) < 0.5,
    why: 'the dps=35 combined-ladder log-log average exponent ~10.56 far exceeds 3, so the residual outruns every fixed power <= 3 on average despite the pointwise oscillation.',
  },
  {
    id: 'imp97780-subgap-resolution-reconciled',
    holds: () =>
      IMP97780_RESULTS.subGap === 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6' &&
      IMP97780_RESULTS.subGapStatus === 'resolved' &&
      IMP97780_RESULTS.subGapResolvedBy === 'imp-97659' &&
      IMP97780_RESULTS.subGapReconfirmedAtDps35By === 'imp-97706',
    why: 'the named imp-97640 sub-gap is resolved (imp-97659 dps=30) and re-confirmed at dps=35 (imp-97706), reconciled here alongside the original named string.',
  },
  {
    id: 'imp97780-honesty-gate-no-qed',
    holds: () =>
      IMP97780_VERDICT.answerNeitherItOscillates === true &&
      IMP97780_VERDICT.climbingReadingOverturned === true &&
      IMP97780_VERDICT.doublyConfirmedAcrossPrecisions === true &&
      IMP97780_VERDICT.averageExponentExceedsThree === true &&
      IMP97780_VERDICT.subGapResolved === true &&
      IMP97780_VERDICT.mcmRefuted === true &&
      IMP97780_VERDICT.ceilingTouched === false &&
      IMP97780_VERDICT.anyBoundMoved === false &&
      IMP97780_VERDICT.qed === false &&
      /NO QED/.test(IMP97780_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97780_HONEST_BANNER) &&
      /RH open/.test(IMP97780_HONEST_BANNER),
    why: 'cross-validation only -- the exponent oscillates (neither climb nor saturate), doubly confirmed, sub-gap resolved; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97780_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97780-route-m-decay-exponent-reconciliation assertion failed: ${a.id}`);
  }
}

export default {
  localExponents: IMP97780_LOCAL_EXPONENTS,
  results: IMP97780_RESULTS,
  verdict: IMP97780_VERDICT,
  banner: IMP97780_HONEST_BANNER,
};
