/**
 * @module imp-34042-lto-model-selection-sensitivity
 *
 * imp-34042 (numerical, frontier-direction): imp-33985 stress-tested the imp-33941 concave-log endpoint-peak
 * DECISION (concave log form peak = a + b ln(kEnd) beats the straight line by Delta AIC = -3.385, evidence
 * ratio ~5.43 : 1 over the 9 imp-33917 boundary windows kEnd = 11.00 .. 13.00) under leave-ONE-out only:
 * across all 9 single-drop folds the log form stayed favored (Delta AIC in [-3.226, -2.757], ratio in
 * [3.97, 5.02] : 1) and the LOW boundary rung kEnd = 11 was the single most influential point. But a
 * leave-ONE-out test cannot probe whether the TWO most influential low-boundary rungs together carry the
 * decision: if dropping kEnd = 11 AND kEnd = 11.25 as a pair flips the preference to the line, the decision
 * is fragile. This module runs the full leave-TWO-out (LTO) sensitivity: all C(9,2) = 36 pairs of dropped
 * windows, each refitting BOTH forms by OLS on the remaining n = 7 points, and reports whether ANY pair
 * removal -- especially the low-boundary pair (kEnd = 11, 11.25) -- ever overturns the concave-log preference.
 *
 * THE MEASUREMENT (imp-33917 peaks reused verbatim; only the LTO refit is new)
 * ---------------------------------------------------------------------------
 *   Data          The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                 IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep (no surrogate re-run, no fresh model).
 *   Folds         All C(9,2) = 36 leave-two-out subsets, each dropping one PAIR of windows; per fold refit
 *                 M_lin (peak = a + b kEnd) and M_log (peak = a + b ln(kEnd)) by OLS on the remaining n = 7.
 *   Scores        Per fold, with equal parameter count p = 3 for both forms, the AIC, BIC and AICc contrasts
 *                 all reduce to the SAME quantity Delta = n ln(RSS_log/RSS_lin) (the +2p, +p ln n and small-
 *                 sample corrections cancel), so within a fold AIC/BIC/AICc are identical; the Akaike
 *                 evidence ratio for log over lin is exp(-Delta/2).
 *   Test          Report the min and max evidence ratio across the 36 folds, the pair whose removal weakens
 *                 the log preference MOST, whether log stays favored with Delta < -2 (positive band) in every
 *                 fold, and specifically the (kEnd = 11, 11.25) low-boundary-pair fold the ticket flagged.
 *
 * THE FINDING (measurement only -- the log-form decision is ROBUST even to the worst two-rung drop)
 * ------------------------------------------------------------------------------------------------
 *   (R1) LOG FAVORED IN ALL 36 FOLDS. In every leave-two-out subset the concave log form still beats the
 *        line: Delta AIC ranges from -2.2238 (dropping the LOW boundary pair kEnd = 11 and 11.25) to
 *        -3.0492 (dropping the HIGH boundary pair kEnd = 12.75 and 13), always negative and always past the
 *        positive-evidence threshold Delta < -2. No pair of windows flips the imp-33941 decision.
 *   (R2) EVIDENCE RATIO STAYS IN [3.04, 4.59]. The Akaike evidence ratio for log over linear never leaves
 *        the ~3-5 : 1 band: its minimum is ~3.04 : 1 (drop kEnd = 11 and 11.25) and its maximum ~4.59 : 1
 *        (drop kEnd = 12.75 and 13); every LTO fold sits below the full-sample 5.43 : 1 because each discards
 *        two of the 9 supporting points. The ratio stays POSITIVE (>~3) but never reaches the decisive band
 *        (>~20, i.e. Delta < -6) in any fold -- the imp-33941 "positive, not decisive" reading survives.
 *   (R3) THE LOW-BOUNDARY PAIR IS THE WORST CASE AND STILL DOES NOT FLIP. The single most influential pair
 *        is exactly the LOW-boundary pair the ticket flagged, kEnd = 11 and 11.25: removing both drops the
 *        ratio furthest (5.43 -> 3.04, Delta AIC -2.2238), confirming and compounding the imp-33985 leave-
 *        one-out reading (kEnd = 11 most influential). Yet even this worst two-rung drop keeps log favored
 *        in the positive band (Delta < -2): the two most-influential low rungs together do NOT carry the
 *        decision. Removing the high-boundary pair kEnd = 12.75 and 13 barely moves it (5.43 -> 4.59).
 *
 * The punchline: the imp-33941 log-form decision is ROBUST to leave-TWO-out removal -- across all 36 folds
 * the concave ln(kEnd) peak is favored over the line (Delta AIC in [-3.0492, -2.2238], every fold past
 * Delta < -2), the evidence ratio stays in [3.04, 4.59] : 1, and the worst case is precisely the two most-
 * influential low-boundary rungs (kEnd = 11 and 11.25), whose joint removal is the 3.04 : 1 floor but STILL
 * does not overturn the concave-log preference. The ~5.4 : 1 decision survives removal of any two rungs; it
 * is never overturned and never becomes decisive.
 *
 * MEASUREMENT ONLY. A leave-two-out sensitivity of a model-selection contrast between two DESCRIPTIVE growth
 * forms on an inherited surrogate residual; NOT an RH bound. Both forms are descriptive, not derived; the
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS
 * surrogate is descriptive, not derived; the imp-33843 log-linear-vs-power-law FORM verdict is UNTOUCHED;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33985-loo-model-selection-sensitivity (the leave-ONE-out test this extends to leave-TWO-out)
 * @see imp-33941-endpoint-peak-growth-model-selection (the full-sample AIC/BIC/AICc decision stress-tested)
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks reused verbatim as the LTO data)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose endpoint residual is the peak)
 */

import { IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW as G917 } from './imp-33917-endpoint-residual-growth-law.js';

// The 9 endpoint peaks, reused VERBATIM from imp-33917 (no surrogate re-run, no fresh model).
const ROWS = G917.boundarySweep;
const K_ENDS = ROWS.map((r) => r.kEnd);
const PEAKS = ROWS.map((r) => r.peak);
const N_FULL = K_ENDS.length;

function ols(xs, ys) {
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
function rssOf(xs, ys, a, b) {
  let rss = 0;
  for (let i = 0; i < xs.length; i++) rss += (ys[i] - (a + b * xs[i])) ** 2;
  return rss;
}

// One model-selection contrast on a subset. Equal parameter count p = 3 for both forms, so AIC = BIC =
// AICc differences all reduce to Delta = n ln(RSS_log/RSS_lin); the evidence ratio for log over lin is
// exp(-Delta/2). Delta < 0 favors log.
function contrast(ks, ps) {
  const n = ks.length;
  const lin = ols(ks, ps);
  const rssLin = rssOf(ks, ps, lin.a, lin.b);
  const lnk = ks.map((k) => Math.log(k));
  const log = ols(lnk, ps);
  const rssLog = rssOf(lnk, ps, log.a, log.b);
  const deltaAIC = n * Math.log(rssLog / rssLin);
  return { n, rssLin, rssLog, deltaAIC, evidenceRatio: Math.exp(-deltaAIC / 2) };
}

// Full-sample baseline (reproduces imp-33941: Delta AIC ~ -3.385, ratio ~5.43).
const FULL = contrast(K_ENDS, PEAKS);

// All C(9,2) = 36 leave-two-out folds (drop windows i and j, refit on the remaining 7).
const FOLDS = [];
for (let i = 0; i < N_FULL; i++) {
  for (let j = i + 1; j < N_FULL; j++) {
    const ks = [];
    const ps = [];
    for (let t = 0; t < N_FULL; t++) {
      if (t !== i && t !== j) {
        ks.push(K_ENDS[t]);
        ps.push(PEAKS[t]);
      }
    }
    const c = contrast(ks, ps);
    FOLDS.push({
      droppedKEnds: [K_ENDS[i], K_ENDS[j]],
      n: c.n,
      deltaAIC: +c.deltaAIC.toFixed(4), // = deltaBIC = deltaAICc (equal p, fixed n within fold)
      evidenceRatio: +c.evidenceRatio.toFixed(4),
      logFavored: c.deltaAIC < 0,
      positiveBand: c.deltaAIC < -2, // Delta < -2 => POSITIVE evidence for log
      decisive: c.deltaAIC < -6, // decisive band (evidence ratio > ~20)
    });
  }
}

const RATIOS = FOLDS.map((f) => f.evidenceRatio);
const MIN_RATIO = Math.min(...RATIOS);
const MAX_RATIO = Math.max(...RATIOS);
const MIN_FOLD = FOLDS.find((f) => f.evidenceRatio === MIN_RATIO); // most influential pair drop
const MAX_FOLD = FOLDS.find((f) => f.evidenceRatio === MAX_RATIO);
const LOG_FAVORED_EVERY_FOLD = FOLDS.every((f) => f.logFavored);
const POSITIVE_EVERY_FOLD = FOLDS.every((f) => f.positiveBand);
const DECISIVE_ANY_FOLD = FOLDS.some((f) => f.decisive); // false -- never decisive
// The low-boundary pair the ticket flagged: kEnd = 11 AND 11.25 removed together.
const LOW_PAIR_FOLD = FOLDS.find(
  (f) => f.droppedKEnds[0] === 11 && f.droppedKEnds[1] === 11.25,
);
const ANY_FOLD_FLIPS = FOLDS.some((f) => !f.logFavored); // false -- no pair overturns log

export const IMP34042_LTO_MODEL_SELECTION_SENSITIVITY = {
  id: 'imp-34042',
  proofSection: 'S-frontier',
  question:
    'imp-33985 stress-tested the imp-33941 concave-log endpoint-peak decision (Delta AIC = -3.385, ' +
    'evidence ratio ~5.43 : 1) under leave-ONE-out only (9 folds), naming kEnd = 11 the most influential ' +
    'rung. Extend to leave-TWO-out: across all C(9,2) = 36 pairs, does the log form stay favored ' +
    '(Delta < -2) in EVERY fold, and does removing the two most-influential low-boundary rungs ' +
    '(kEnd = 11 and 11.25) together ever overturn the decision? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per-fold Delta AIC (= Delta BIC = Delta AICc, equal parameter count) and Akaike evidence ratio for ' +
    'the concave log form over the linear form, refit by OLS on each of the 36 leave-two-out subsets of ' +
    'the imp-33917 endpoint peaks, plus the min/max ratio, the most influential dropped pair, and the ' +
    'specific (kEnd = 11, 11.25) low-boundary-pair fold',
  nFull: N_FULL,
  nFolds: FOLDS.length, // 36
  nPerFold: N_FULL - 2, // 7
  fullSample: {
    deltaAIC: +FULL.deltaAIC.toFixed(4), // ~ -3.385
    evidenceRatio: +FULL.evidenceRatio.toFixed(4), // ~5.4325
  },
  folds: FOLDS, // {droppedKEnds, n, deltaAIC, evidenceRatio, logFavored, positiveBand, decisive} x 36
  summary: {
    logFavoredEveryFold: LOG_FAVORED_EVERY_FOLD, // true
    positiveEveryFold: POSITIVE_EVERY_FOLD, // true (Delta < -2 in all 36)
    decisiveAnyFold: DECISIVE_ANY_FOLD, // false
    anyFoldFlips: ANY_FOLD_FLIPS, // false -- no pair overturns log
    minEvidenceRatio: +MIN_RATIO.toFixed(4), // ~3.0401 (drop kEnd = 11 and 11.25)
    maxEvidenceRatio: +MAX_RATIO.toFixed(4), // ~4.5934 (drop kEnd = 12.75 and 13)
    mostInfluentialDroppedPair: MIN_FOLD.droppedKEnds, // [11, 11.25] -- the LOW boundary pair
    leastInfluentialDroppedPair: MAX_FOLD.droppedKEnds, // [12.75, 13] -- the HIGH boundary pair
    lowBoundaryPairFold: {
      droppedKEnds: LOW_PAIR_FOLD.droppedKEnds, // [11, 11.25]
      deltaAIC: LOW_PAIR_FOLD.deltaAIC, // ~ -2.2238
      evidenceRatio: LOW_PAIR_FOLD.evidenceRatio, // ~3.0401
      logFavored: LOW_PAIR_FOLD.logFavored, // true -- does NOT flip
      positiveBand: LOW_PAIR_FOLD.positiveBand, // true -- still past Delta < -2
    },
  },
  finding: {
    R1_log_favored_in_all_36_folds:
      'In every leave-two-out subset the concave log form still beats the line: Delta AIC ranges from ' +
      '-2.2238 (drop kEnd = 11 and 11.25) to -3.0492 (drop kEnd = 12.75 and 13), always negative and ' +
      'always past the positive threshold Delta < -2. No pair of windows flips the imp-33941 decision.',
    R2_evidence_ratio_stays_3p04_to_4p59:
      'The Akaike evidence ratio for log over linear never leaves the ~3-5 : 1 band: min ~3.04 : 1 ' +
      '(drop kEnd = 11 and 11.25), max ~4.59 : 1 (drop kEnd = 12.75 and 13). Every LTO fold sits below ' +
      'the full-sample 5.43 : 1 because each discards two supporting points. Positive (>~3) but never ' +
      'decisive (>~20, i.e. Delta < -6) in any fold -- the imp-33941 "positive, not decisive" reading holds.',
    R3_low_boundary_pair_worst_case_still_does_not_flip:
      'The single most influential pair is exactly the LOW-boundary pair the ticket flagged, kEnd = 11 ' +
      'and 11.25: removing both drops the ratio furthest (5.43 -> 3.04, Delta AIC -2.2238), compounding ' +
      'the imp-33985 leave-one-out reading that kEnd = 11 is the most influential single rung. Yet even ' +
      'this worst two-rung drop keeps log favored in the positive band (Delta < -2): the two most-' +
      'influential low rungs together do NOT carry the decision. The high-boundary pair kEnd = 12.75 and ' +
      '13 barely moves it (5.43 -> 4.59).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / LEAVE-TWO-OUT SENSITIVITY (frontier-direction, NOT rigorous). The imp-33941 log-form ' +
    'decision is ROBUST to any two dropped rungs: across all C(9,2) = 36 leave-two-out folds the concave ' +
    'ln(kEnd) peak is favored over the line (Delta AIC in [-3.0492, -2.2238], every fold past Delta < -2), ' +
    'the Akaike evidence ratio stays in [3.04, 4.59] : 1, and the most influential pair is precisely the ' +
    'two most-influential low-boundary rungs kEnd = 11 and 11.25 (their joint removal is the 3.04 : 1 ' +
    'worst case, Delta AIC -2.2238 -- still past Delta < -2, so it does NOT overturn the log preference; ' +
    'the high boundary pair kEnd = 12.75 and 13 is the 4.59 : 1 least-influential case). The ~5.4 : 1 ' +
    'decision survives removal of any two rungs -- never overturned, never decisive. Both forms are ' +
    'descriptive, not derived; the OLS surrogate is descriptive, not derived; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the imp-33843 log-linear-vs-' +
    'power-law FORM verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33985 (the leave-ONE-out test extended here); imp-33941 (the full-sample AIC/BIC/AICc decision); ' +
    'imp-33917 (the 9 endpoint peaks reused verbatim as the LTO data); imp-33843 (the log-linear OLS ' +
    'whose endpoint residual is the peak); imp-486 (C_mb GUE-conditional).',
};

export const IMP34042_LTO_MODEL_SELECTION_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: the LTO data ARE the 9 imp-33917 boundary peaks, all 36 pairs enumerated, and the full-
    // sample contrast reproduces the imp-33941 baseline (Delta AIC ~ -3.385, ratio ~5.43).
    id: 'imp34042-reuse-gate-reproduces-imp33941-baseline',
    description: '9 windows, 36 folds; full-sample Delta AIC ~ -3.385 and evidence ratio ~5.43 match imp-33941',
    holds: () =>
      N_FULL === 9 &&
      FOLDS.length === 36 &&
      FOLDS.every((f) => f.n === 7) &&
      Math.abs(FULL.deltaAIC - -3.385) < 5e-3 &&
      Math.abs(FULL.evidenceRatio - 5.4325) < 5e-3,
  },
  {
    // (R1) Every LTO fold keeps the log form favored in the positive band (Delta < -2); none is decisive;
    // no pair flips the decision to the line.
    id: 'imp34042-log-favored-every-fold-positive-band',
    description: 'All 36 folds: log favored, Delta < -2, none decisive (Delta < -6), no pair flips',
    holds: () =>
      LOG_FAVORED_EVERY_FOLD === true &&
      POSITIVE_EVERY_FOLD === true &&
      DECISIVE_ANY_FOLD === false &&
      ANY_FOLD_FLIPS === false,
  },
  {
    // (R2) The evidence ratio stays in the ~3-5 : 1 band; min ~3.04, max ~4.59, both below the full 5.43.
    id: 'imp34042-evidence-ratio-band-3p04-to-4p59',
    description: 'min ratio ~3.0401, max ratio ~4.5934, both < full-sample 5.4325',
    holds: () =>
      Math.abs(MIN_RATIO - 3.0401) < 1e-2 &&
      Math.abs(MAX_RATIO - 4.5934) < 1e-2 &&
      MIN_RATIO < FULL.evidenceRatio &&
      MAX_RATIO < FULL.evidenceRatio,
  },
  {
    // (R3) The most influential pair is the LOW boundary pair (kEnd = 11 and 11.25), the least influential
    // is the HIGH boundary pair (kEnd = 12.75 and 13), and the low pair still does NOT flip the decision.
    id: 'imp34042-low-boundary-pair-worst-case-no-flip',
    description: 'min-ratio fold drops [11, 11.25] (low boundary), stays log-favored past Delta < -2',
    holds: () =>
      MIN_FOLD.droppedKEnds[0] === 11 &&
      MIN_FOLD.droppedKEnds[1] === 11.25 &&
      MAX_FOLD.droppedKEnds[0] === 12.75 &&
      MAX_FOLD.droppedKEnds[1] === 13 &&
      LOW_PAIR_FOLD.logFavored === true &&
      LOW_PAIR_FOLD.positiveBand === true,
  },
  {
    // Honesty gate: LTO sensitivity, isRigorous false, no QED, PT SOTA, imp-3066 K_a>=0 clause SPECIFICALLY
    // untouched -- imp-34122 flagged that a generic /UNTOUCHED/ regex also matches the unrelated imp-33843
    // FORM verdict and C_mb clauses, so it does not actually bind to the imp-3066 statement (imp-34024-26
    // convention).
    id: 'imp34042-honesty-gate-imp3066-specific-no-qed',
    description: 'Measurement only: isRigorous false, imp-3066 K_a >= 0 untouched (clause-specific), no QED, PT SOTA',
    holds: () =>
      IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.isRigorous === false &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.verdict),
  },
];

for (const a of IMP34042_LTO_MODEL_SELECTION_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34042-lto-model-selection-sensitivity assertion failed: ${a.id}`);
  }
}
