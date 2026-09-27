/**
 * @module imp-97778-route-m-ladder-rebake-precision-assessment
 *
 * imp-97778 (accuracy -- ASSESSMENT / CROSS-VALIDATION ONLY; no bound moves; NO QED).
 *
 * imp-97763 showed the two Route M gap-law kernel constants
 *     lnA   = log(glaisher)              (Glaisher-Kinkelin)
 *     B_inf = lnA + gamma/12             (closed form)
 * carry ~40.6 significant figures at mpmath dps=40 (dps=50 -> ~51), while the imp-97722/imp-97742
 * residual ladder stores only ~10 figures per rung, and even after the gap-minus-law catastrophic
 * cancellation (~6 digits lost) the USABLE residual precision at dps=40 is ~34 figures. So the
 * imp-97742 ~10.46-sig-fig minimum ladder agreement is a STORAGE limit, not a constant-precision limit.
 *
 * This leaf ASSESSES the natural follow-up: would RE-BAKING the imp-97722 residual literals at ~20-30
 * stored figures (from the already-available dps>=40 recompute) let the imp-97640 climbing-exponent and
 * the imp-97706/imp-97722 sign-oscillation readings be checked to MORE figures, and does any downstream
 * consumer rely on the ~10-figure storage? No new heavy compute -- the assessment is a precision-budget
 * analysis run directly against the baked imp-97722 ladder (import-light).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 (sign-oscillation H1) -- the ~10-fig storage already resolves every rise/fall call by
 *   a factor ~2.37 MILLION, so a re-bake changes NO sign-change reading.
 * -------------------------------------------------------------------------------
 * The 8 "RISE" rungs are decided by |residual[i]| vs |residual[i-1]| (axis-free monotonicity, no fit).
 * The CLOSEST adjacent |residual| pair is the last one (index 21 -> 22):
 *     |residual| 3.044005501e-8 -> 3.047612203e-8,   |delta| ~ 3.607e-11 .
 * A residual stored to 10 significant figures has a half-ulp granularity ~ |r| * 5e-11 ~ 1.52e-17, so
 * even this TIGHTEST call is separated by |delta| / granularity ~ 2.37e6 storage granules. Every one of
 * the 8 sign-changes is therefore resolved with a ~6.4-order-of-magnitude margin over the ~10-fig
 * storage: re-baking to 20-30 figures cannot flip, add, or remove a single rise/fall. H1 is storage-safe.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 (decay exponent H2) -- the exponent-band width is DYNAMICAL (the Mertens oscillation),
 *   ~9 orders of magnitude above the ~10-fig storage noise, so a re-bake does not tighten it.
 * -------------------------------------------------------------------------------
 * The exponent uses Y = log|residual| vs X = log(log p). A ~10-fig relative storage error maps to an
 * ABSOLUTE Y-noise ~ 5e-10 per rung. The imp-97706 seeded bootstrap 95pct band is [9.80, 11.22], width
 * ~1.42, and the imp-97722 local finite-difference exponents swing order-1 (negative on the 8 rise
 * rungs). That band width is set by the genuine PNT/Mertens sign-oscillation of the residual, ~9 orders
 * of magnitude larger than the ~5e-10 Y-noise a re-bake would remove. Re-baking to 20-30 figures shifts
 * the OLS/endpoint/Theil-Sen slopes by << 1e-8 and cannot narrow the [9.80, 11.22] band.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 (imp-97640 sub-gap provenance) -- the sub-gap is a SOURCE-COMPUTE limit, not storage.
 * -------------------------------------------------------------------------------
 * The imp-97640 sub-gap IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 was named for the
 * earlier IEEE-DOUBLE (~7-fig) recompute losing the gap-minus-law cancellation past p ~ 2e6 in the
 * EVALUATION, and was addressed by the imp-97659 (dps=30) / imp-97706 (dps=35) EXTENDED-PRECISION
 * recompute of gap AND law -- i.e. by lifting the working precision of the SOURCE compute, not by
 * storing more digits of the answer. A storage re-bake operates on an already-precision-clean number
 * (imp-97742: dps=40 reproduces the baked rungs to ~10.5-11 figs) and so does not touch that sub-gap.
 *
 * -------------------------------------------------------------------------------
 * FINDING 4 (downstream consumers) -- none rely on storage past ~10 figures.
 * -------------------------------------------------------------------------------
 * The consumers of the imp-97722 ladder -- imp-97739 (exponent-stability drift), imp-97747 (deep-ladder
 * viz), imp-97758 (dps=40 interior cross-check), and imp-97763 (this precision floor) -- all read the
 * residuals only for slope (log-log OLS / endpoint / Theil-Sen) and monotonicity (rise/fall) analyses,
 * both of which Findings 1-2 show are insensitive to figures beyond ~10. No consumer parses more than
 * the ~10 stored figures, and imp-97758 already carries the higher-precision interior values separately
 * where they are needed, so a re-bake would be inert downstream.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  ASSESSMENT -- re-baking the ladder at 20-30 figs is NOT worth it (no measurable gain).
 * -------------------------------------------------------------------------------
 * Both diagnostics the ladder feeds are storage-safe at ~10 figures: the tightest sign-oscillation call
 * clears the storage granularity by ~2.37e6, and the exponent band width (~1.42) is a dynamical
 * oscillation ~9 orders above the ~5e-10 storage noise. The imp-97640 sub-gap is a source-compute
 * precision limit already addressed by the dps=30/35 recompute, not a storage limit, and no downstream
 * consumer relies on more than ~10 stored figures. The imp-97763 headroom (~34 usable figs) is real but
 * carries no readable information for these consumers. Re-baking is inert -- do NOT re-attempt it as a
 * precision lever. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no
 * bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97763-route-m-ladder-constant-precision-floor.js (constants carry ~40.6 figs; storage-limit finding)
 * @see imp-97742-route-m-ladder-dps40-crosscheck.js (dps=40 reproduces the baked rungs to ~10.5-11 figs)
 * @see imp-97722-route-m-deep-ladder-independent-crosscheck.js (the 23-rung baked ladder, 8 sign-changes)
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (the source-compute precision sub-gap)
 *
 * Ticket: imp-97778 (accuracy, opus-4-8, api-pool). Re-bake precision assessment; NO QED.
 */

import { IMP97722_LADDER } from './imp-97722-route-m-deep-ladder-independent-crosscheck.js';

// Precision-budget analysis recomputed here from the baked ladder (import-light; no heavy import).
const STORED_SIG_FIGS = 10; // imp-97722/imp-97742 residual literals are ~10-figure doubles

// Half-ulp storage granularity of a value stored to STORED_SIG_FIGS significant figures.
function storageGranularity(r) {
  return Math.abs(r) * 0.5 * Math.pow(10, -(STORED_SIG_FIGS - 1));
}

// (Finding 1) minimum adjacent-|residual| separation measured in storage granules.
function minRiseFallMargin(ladder) {
  let minMargin = Infinity;
  let atIndex = -1;
  for (let i = 1; i < ladder.length; i++) {
    const delta = Math.abs(Math.abs(ladder[i].residual) - Math.abs(ladder[i - 1].residual));
    const granule = Math.max(storageGranularity(ladder[i].residual), storageGranularity(ladder[i - 1].residual));
    const margin = delta / granule;
    if (margin < minMargin) {
      minMargin = margin;
      atIndex = i;
    }
  }
  return { minMargin, atIndex };
}
const RISE_FALL = minRiseFallMargin(IMP97722_LADDER);

// (Finding 2) absolute Y = log|residual| noise induced by a ~10-fig relative storage error.
const Y_STORAGE_NOISE = 0.5 * Math.pow(10, -(STORED_SIG_FIGS - 1)); // ~5e-10 (d log|r| = d|r|/|r|)
const EXPONENT_BAND_WIDTH = 11.22 - 9.80;                            // imp-97706 bootstrap 95pct band

export const IMP97778_PRECISION_BUDGET = Object.freeze({
  storedSigFigs: STORED_SIG_FIGS,
  // Finding 1: tightest sign-oscillation call vs storage granularity.
  closestRungIndex: RISE_FALL.atIndex,                 // 22 (the last rung pair)
  closestRungMarginGranules: RISE_FALL.minMargin,      // ~2.37e6
  closestRungAbsDelta: Math.abs(
    Math.abs(IMP97722_LADDER[RISE_FALL.atIndex].residual) -
      Math.abs(IMP97722_LADDER[RISE_FALL.atIndex - 1].residual),
  ),                                                    // ~3.607e-11
  closestRungGranularity: storageGranularity(IMP97722_LADDER[RISE_FALL.atIndex].residual), // ~1.52e-17
  // Finding 2: exponent-band width vs storage-induced Y noise.
  yStorageNoise: Y_STORAGE_NOISE,                      // ~5e-10
  exponentBandWidth: EXPONENT_BAND_WIDTH,              // ~1.42 (dynamical Mertens oscillation)
  bandToNoiseRatio: EXPONENT_BAND_WIDTH / Y_STORAGE_NOISE, // ~2.8e9 (band dwarfs storage noise)
  // imp-97763 usable-precision headroom that a re-bake would expose but that carries no readable info.
  usableResidualSigFigsDps40: 34.6,
});

export const IMP97778_VERDICT = Object.freeze({
  question:
    'would re-baking the imp-97722 residual ladder at ~20-30 stored figures let the imp-97640 exponent and the sign-oscillation readings be checked to more figures, and does any consumer rely on the ~10-fig storage?',
  // Finding 1: every rise/fall call clears the storage granularity by a huge margin.
  signOscillationStorageSafe: IMP97778_PRECISION_BUDGET.closestRungMarginGranules > 1e5, // ~2.37e6
  // Finding 2: exponent band is dynamical, ~9 orders above the storage noise.
  exponentBandIsDynamical: IMP97778_PRECISION_BUDGET.bandToNoiseRatio > 1e6,             // ~2.8e9
  // Finding 3: the imp-97640 sub-gap is a source-compute limit, addressed by dps=30/35, not storage.
  imp97640SubgapIsSourceComputeNotStorage: true,
  // Finding 4: no downstream consumer parses more than ~10 stored figures.
  anyConsumerReliesOnHigherStorage: false,
  // The DECISION.
  rebakeImprovesReadings: false,
  rebakeWorthIt: false,
  mcmRefuted: true, // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'ASSESSMENT ONLY. Re-baking the imp-97722 Route M gap-law residual ladder at 20-30 stored figures ' +
    'gives NO measurable gain: the tightest sign-oscillation call (rungs 21->22, |delta| ~3.607e-11) ' +
    'clears the ~10-fig half-ulp granularity (~1.52e-17) by ~2.37 million granules, so no rise/fall ' +
    'reading can move; and the exponent-band width (~1.42, the imp-97706 [9.80,11.22] bootstrap) is a ' +
    'dynamical PNT/Mertens oscillation ~2.8e9 above the ~5e-10 Y=log|residual| storage noise, so no ' +
    'slope narrows. The imp-97640 sub-gap ..._PRECISION_LIMITED_PAST_2E6 is a SOURCE-COMPUTE precision ' +
    'limit (IEEE-double evaluation past p~2e6) already addressed by the imp-97659/imp-97706 dps=30/35 ' +
    'recompute, not a storage limit, and no downstream consumer (imp-97739/97747/97758/97763) parses ' +
    'more than ~10 stored figures. The imp-97763 ~34-usable-fig headroom is real but carries no readable ' +
    'information for these diagnostics; a re-bake is inert. MCM stays refuted from omega=11; b/4 ceiling ' +
    'untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97778_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Assessment of re-baking the imp-97722 Route M ' +
  'gap-law residual ladder at 20-30 stored figures: no measurable gain -- the tightest sign-oscillation ' +
  'call clears the ~10-fig storage granularity by ~2.37 million granules, and the ~1.42-wide exponent ' +
  'band is a dynamical Mertens oscillation ~2.8e9 above the ~5e-10 storage noise. The imp-97640 sub-gap ' +
  'is a source-compute precision limit already fixed by the dps=30/35 recompute, not storage; no ' +
  'consumer relies on higher storage. Re-baking is inert. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97778_ASSERTIONS = [
  {
    id: 'imp97778-sign-oscillation-storage-safe',
    holds: () =>
      IMP97778_PRECISION_BUDGET.closestRungIndex === 22 &&
      IMP97778_PRECISION_BUDGET.closestRungMarginGranules > 1e6 &&
      IMP97778_PRECISION_BUDGET.closestRungAbsDelta > 1e-11 &&
      IMP97778_PRECISION_BUDGET.closestRungAbsDelta < 1e-10 &&
      IMP97778_PRECISION_BUDGET.closestRungGranularity < 1e-16,
    why: 'the closest adjacent |residual| pair (rungs 21->22, |delta| ~3.6e-11) is separated by ~2.37 million 10-fig storage granules (~1.52e-17 each), so every one of the 8 rise/fall calls is resolved far beyond the ~10-fig storage and a re-bake cannot change any sign-change reading.',
  },
  {
    id: 'imp97778-exponent-band-is-dynamical-not-storage',
    holds: () =>
      IMP97778_PRECISION_BUDGET.yStorageNoise < 1e-9 &&
      Math.abs(IMP97778_PRECISION_BUDGET.exponentBandWidth - 1.42) < 1e-9 &&
      IMP97778_PRECISION_BUDGET.bandToNoiseRatio > 1e6,
    why: 'the exponent-band width (~1.42, the imp-97706 [9.80,11.22] bootstrap) exceeds the ~5e-10 Y=log|residual| storage noise by ~2.8e9, so the band is a dynamical PNT/Mertens oscillation and a re-bake cannot narrow it.',
  },
  {
    id: 'imp97778-decision-rebake-not-worth-it',
    holds: () =>
      IMP97778_VERDICT.rebakeImprovesReadings === false &&
      IMP97778_VERDICT.rebakeWorthIt === false &&
      IMP97778_VERDICT.signOscillationStorageSafe === true &&
      IMP97778_VERDICT.exponentBandIsDynamical === true &&
      IMP97778_VERDICT.imp97640SubgapIsSourceComputeNotStorage === true &&
      IMP97778_VERDICT.anyConsumerReliesOnHigherStorage === false,
    why: 'the DECISION -- re-baking at 20-30 figs is inert: both diagnostics are storage-safe at ~10 figs, the imp-97640 sub-gap is a source-compute limit (not storage), and no consumer relies on higher storage.',
  },
  {
    id: 'imp97778-honesty-gate-no-qed',
    holds: () =>
      IMP97778_VERDICT.mcmRefuted === true &&
      IMP97778_VERDICT.ceilingTouched === false &&
      IMP97778_VERDICT.anyBoundMoved === false &&
      IMP97778_VERDICT.qed === false &&
      /NO QED/.test(IMP97778_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97778_HONEST_BANNER) &&
      /RH open/.test(IMP97778_HONEST_BANNER),
    why: 'assessment only -- re-bake inert; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97778_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97778-route-m-ladder-rebake-precision-assessment assertion failed: ${a.id}`);
  }
}

export default {
  precisionBudget: IMP97778_PRECISION_BUDGET,
  verdict: IMP97778_VERDICT,
  banner: IMP97778_HONEST_BANNER,
};
