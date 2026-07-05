/**
 * @module imp-33985-loo-model-selection-sensitivity
 *
 * imp-33985 (numerical, frontier-direction): imp-33941 DECIDED the open linear-vs-log question for the
 * boundary-locked endpoint peak of the imp-33843 widening fit -- the concave log form peak = a + b ln(kEnd)
 * beats the straight line by Delta AIC = -3.385 (evidence ratio ~5.43 : 1, weights ~0.84 / 0.16) over the
 * 9 imp-33917 boundary windows kEnd = 11.00 .. 13.00. But that ~5.4 : 1 ratio rests on only 9 points, and
 * its robustness to a single dropped rung was never measured: a decision that flips when the boundary-most
 * window is removed is not a decision. This module runs the leave-one-out (LOO) sensitivity: for each of
 * the 9 endpoint peaks in turn it drops that window, refits BOTH forms on the remaining 8, and recomputes
 * Delta AIC/BIC/AICc and the Akaike evidence ratio, then reports the min/max ratio across folds and whether
 * the log form remains favored in the positive band (Delta < -2) in EVERY fold.
 *
 * THE MEASUREMENT (imp-33917 peaks reused verbatim; only the LOO refit is new)
 * ---------------------------------------------------------------------------
 *   Data          The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                 IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep (no surrogate re-run, no fresh model).
 *   Folds         9 leave-one-out subsets, each dropping one window; per fold refit M_lin (peak = a + b kEnd)
 *                 and M_log (peak = a + b ln(kEnd)) by OLS on the remaining n = 8 points.
 *   Scores        Per fold, with equal parameter count p = 3 for both forms, the AIC, BIC and AICc contrasts
 *                 all reduce to the SAME quantity Delta = n ln(RSS_log/RSS_lin) (the +2p, +p ln n and small-
 *                 sample corrections cancel), so within a fold AIC/BIC/AICc are identical; the Akaike
 *                 evidence ratio for log over lin is exp(-Delta/2).
 *   Test          Report the min and max evidence ratio across the 9 folds, the fold whose removal weakens
 *                 the log preference MOST, and whether log stays favored with Delta < -2 (positive band) in
 *                 every fold.
 *
 * THE FINDING (measurement only -- the log-form decision is ROBUST to any single dropped rung)
 * -------------------------------------------------------------------------------------------
 *   (R1) LOG FAVORED IN ALL 9 FOLDS. In every leave-one-out subset the concave log form still beats the
 *        line: Delta AIC ranges from -2.757 (dropping the LOW boundary rung kEnd = 11) to -3.226 (dropping
 *        the HIGH boundary rung kEnd = 13), always negative and always past the positive-evidence threshold
 *        Delta < -2. No single window flips the decision.
 *   (R2) EVIDENCE RATIO STAYS IN [3.97, 5.02]. The Akaike evidence ratio for log over linear never leaves
 *        the ~4-5 : 1 band: its minimum is ~3.97 : 1 (drop kEnd = 11) and its maximum ~5.02 : 1 (drop
 *        kEnd = 13); the full-sample 5.43 : 1 sits just above the LOO max because every fold discards one
 *        of the 9 supporting points. The ratio stays POSITIVE (>~3) but never reaches the decisive band
 *        (>~20, i.e. Delta < -6) in any fold -- exactly the imp-33941 "positive, not decisive" reading.
 *   (R3) THE LOW BOUNDARY RUNG IS THE MOST INFLUENTIAL. The single most influential point is the LOW-kEnd
 *        boundary window (kEnd = 11), not the high one: removing it drops the ratio furthest (5.43 -> 3.97),
 *        while removing the high boundary rung kEnd = 13 barely moves it (5.43 -> 5.02) and interior drops
 *        land near ~4.5 : 1. Even the worst case keeps log favored with positive evidence, so the boundary-
 *        most rung the ticket flagged does NOT carry the decision.
 *
 * The punchline: the imp-33941 log-form decision is ROBUST -- across all 9 leave-one-out folds the concave
 * ln(kEnd) peak is favored over the line (Delta AIC in [-3.226, -2.757], every fold past Delta < -2), the
 * evidence ratio stays in [3.97, 5.02] : 1, and the most influential single point is the LOW boundary rung
 * kEnd = 11 (whose removal is the 3.97 : 1 worst case). The ~5.4 : 1 decision survives removal of any one
 * rung; it is never overturned and never becomes decisive.
 *
 * MEASUREMENT ONLY. A leave-one-out sensitivity of a model-selection contrast between two DESCRIPTIVE growth
 * forms on an inherited surrogate residual; NOT an RH bound. Both forms are descriptive, not derived; the
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS
 * surrogate is descriptive, not derived; the imp-33843 log-linear-vs-power-law FORM verdict is UNTOUCHED;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33941-endpoint-peak-growth-model-selection (the full-sample AIC/BIC/AICc decision stress-tested here)
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks reused verbatim as the LOO data)
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

// The 9 leave-one-out folds.
const FOLDS = K_ENDS.map((droppedK, drop) => {
  const ks = [];
  const ps = [];
  for (let i = 0; i < N_FULL; i++) {
    if (i !== drop) {
      ks.push(K_ENDS[i]);
      ps.push(PEAKS[i]);
    }
  }
  const c = contrast(ks, ps);
  return {
    droppedKEnd: droppedK,
    n: c.n,
    deltaAIC: +c.deltaAIC.toFixed(4), // = deltaBIC = deltaAICc (equal p, fixed n within fold)
    evidenceRatio: +c.evidenceRatio.toFixed(4),
    logFavored: c.deltaAIC < 0,
    positiveBand: c.deltaAIC < -2, // Delta < -2 => POSITIVE evidence for log
    decisive: c.deltaAIC < -6, // decisive band (evidence ratio > ~20)
  };
});

const RATIOS = FOLDS.map((f) => f.evidenceRatio);
const MIN_RATIO = Math.min(...RATIOS);
const MAX_RATIO = Math.max(...RATIOS);
const MIN_FOLD = FOLDS.find((f) => f.evidenceRatio === MIN_RATIO); // most influential drop
const MAX_FOLD = FOLDS.find((f) => f.evidenceRatio === MAX_RATIO);
const LOG_FAVORED_EVERY_FOLD = FOLDS.every((f) => f.logFavored);
const POSITIVE_EVERY_FOLD = FOLDS.every((f) => f.positiveBand);
const DECISIVE_ANY_FOLD = FOLDS.some((f) => f.decisive); // false -- never decisive

export const IMP33985_LOO_MODEL_SELECTION_SENSITIVITY = {
  id: 'imp-33985',
  proofSection: 'S-frontier',
  question:
    'imp-33941 DECIDED the boundary-locked endpoint peak follows the concave log form over the line by ' +
    'Delta AIC = -3.385 (evidence ratio ~5.43 : 1), but on only 9 points. Does that decision survive ' +
    'leave-one-out removal of each rung, and does the log form stay favored (Delta < -2) in EVERY fold? ' +
    'Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per-fold Delta AIC (= Delta BIC = Delta AICc, equal parameter count) and Akaike evidence ratio for ' +
    'the concave log form over the linear form, refit by OLS on each of the 9 leave-one-out subsets of ' +
    'the imp-33917 endpoint peaks, plus the min/max ratio and the most influential dropped rung',
  nFull: N_FULL,
  nPerFold: N_FULL - 1,
  fullSample: {
    deltaAIC: +FULL.deltaAIC.toFixed(4), // ~ -3.385
    evidenceRatio: +FULL.evidenceRatio.toFixed(4), // ~5.4325
  },
  folds: FOLDS, // {droppedKEnd, n, deltaAIC, evidenceRatio, logFavored, positiveBand, decisive} x 9
  summary: {
    logFavoredEveryFold: LOG_FAVORED_EVERY_FOLD, // true
    positiveEveryFold: POSITIVE_EVERY_FOLD, // true (Delta < -2 in all 9)
    decisiveAnyFold: DECISIVE_ANY_FOLD, // false
    minEvidenceRatio: +MIN_RATIO.toFixed(4), // ~3.9683 (drop kEnd = 11)
    maxEvidenceRatio: +MAX_RATIO.toFixed(4), // ~5.0190 (drop kEnd = 13)
    mostInfluentialDroppedKEnd: MIN_FOLD.droppedKEnd, // 11 -- the LOW boundary rung
    leastInfluentialDroppedKEnd: MAX_FOLD.droppedKEnd, // 13 -- the HIGH boundary rung
  },
  finding: {
    R1_log_favored_in_all_9_folds:
      'In every leave-one-out subset the concave log form still beats the line: Delta AIC ranges from ' +
      '-2.757 (drop kEnd = 11) to -3.226 (drop kEnd = 13), always negative and always past the positive ' +
      'threshold Delta < -2. No single window flips the imp-33941 decision.',
    R2_evidence_ratio_stays_3p97_to_5p02:
      'The Akaike evidence ratio for log over linear never leaves the ~4-5 : 1 band: min ~3.97 : 1 ' +
      '(drop kEnd = 11), max ~5.02 : 1 (drop kEnd = 13). The full-sample 5.43 : 1 sits just above the ' +
      'LOO max because every fold discards one supporting point. Positive (>~3) but never decisive ' +
      '(>~20, i.e. Delta < -6) in any fold -- the imp-33941 "positive, not decisive" reading holds.',
    R3_low_boundary_rung_most_influential:
      'The single most influential point is the LOW-kEnd boundary window (kEnd = 11), not the high one: ' +
      'removing it drops the ratio furthest (5.43 -> 3.97), removing the high boundary rung kEnd = 13 ' +
      'barely moves it (5.43 -> 5.02), and interior drops land near ~4.5 : 1. Even the worst case keeps ' +
      'log favored with positive evidence, so the boundary-most rung does NOT carry the decision.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / LEAVE-ONE-OUT SENSITIVITY (frontier-direction, NOT rigorous). The imp-33941 log-form ' +
    'decision is ROBUST to any single dropped rung: across all 9 leave-one-out folds the concave ln(kEnd) ' +
    'peak is favored over the line (Delta AIC in [-3.226, -2.757], every fold past Delta < -2), the Akaike ' +
    'evidence ratio stays in [3.97, 5.02] : 1, and the most influential single point is the LOW boundary ' +
    'rung kEnd = 11 (its removal is the 3.97 : 1 worst case; the high boundary kEnd = 13 is the 5.02 : 1 ' +
    'least-influential case). The ~5.4 : 1 decision survives removal of any one rung -- never overturned, ' +
    'never decisive. Both forms are descriptive, not derived; the OLS surrogate is descriptive, not ' +
    'derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the imp-33843 log-linear-vs-power-law FORM verdict is UNTOUCHED; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33941 (the full-sample AIC/BIC/AICc decision stress-tested here); imp-33917 (the 9 endpoint ' +
    'peaks reused verbatim as the LOO data); imp-33843 (the log-linear OLS whose endpoint residual is the ' +
    'peak); imp-486 (C_mb GUE-conditional).',
};

export const IMP33985_LOO_MODEL_SELECTION_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: the LOO data ARE the 9 imp-33917 boundary peaks, and the full-sample contrast reproduces
    // the imp-33941 baseline (Delta AIC ~ -3.385, ratio ~5.43).
    id: 'imp33985-reuse-gate-reproduces-imp33941-baseline',
    description: '9 windows; full-sample Delta AIC ~ -3.385 and evidence ratio ~5.43 match imp-33941',
    holds: () =>
      N_FULL === 9 &&
      FOLDS.length === 9 &&
      Math.abs(FULL.deltaAIC - -3.385) < 5e-3 &&
      Math.abs(FULL.evidenceRatio - 5.4325) < 5e-3,
  },
  {
    // (R1) Every LOO fold keeps the log form favored in the positive band (Delta < -2); none is decisive.
    id: 'imp33985-log-favored-every-fold-positive-band',
    description: 'All 9 folds: log favored, Delta < -2, none decisive (Delta < -6)',
    holds: () =>
      LOG_FAVORED_EVERY_FOLD === true &&
      POSITIVE_EVERY_FOLD === true &&
      DECISIVE_ANY_FOLD === false &&
      FOLDS.every((f) => f.n === 8),
  },
  {
    // (R2) The evidence ratio stays in the ~4-5 : 1 band; min ~3.97, max ~5.02, both below the full 5.43.
    id: 'imp33985-evidence-ratio-band-3p97-to-5p02',
    description: 'min ratio ~3.9683, max ratio ~5.0190, both < full-sample 5.4325',
    holds: () =>
      Math.abs(MIN_RATIO - 3.9683) < 1e-2 &&
      Math.abs(MAX_RATIO - 5.019) < 1e-2 &&
      MIN_RATIO < FULL.evidenceRatio &&
      MAX_RATIO < FULL.evidenceRatio,
  },
  {
    // (R3) The most influential dropped rung is the LOW boundary window kEnd = 11 (worst-case ratio),
    // the least influential is the HIGH boundary window kEnd = 13.
    id: 'imp33985-low-boundary-rung-most-influential',
    description: 'min-ratio fold drops kEnd = 11 (low boundary); max-ratio fold drops kEnd = 13 (high boundary)',
    holds: () =>
      MIN_FOLD.droppedKEnd === 11 &&
      MAX_FOLD.droppedKEnd === 13 &&
      IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.summary.mostInfluentialDroppedKEnd === 11,
  },
  {
    // Honesty gate: LOO sensitivity, isRigorous false, imp-33843 verdict untouched, no QED, PT SOTA.
    id: 'imp33985-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-33843 FORM verdict UNTOUCHED, no QED, PT SOTA',
    holds: () =>
      IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.isRigorous === false &&
      /UNTOUCHED/.test(IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.verdict),
  },
  {
    // imp-34058/imp-34080: the generic /UNTOUCHED/ check above is satisfied by the separate "C_mb
    // GUE-conditional... UNTOUCHED" text, not the imp-3066 clause -- this tripwire gates that clause
    // specifically.
    id: 'imp33985-imp3066-specific-untouched-tripwire',
    description: 'verdict states the imp-3066 K_a >= 0 untouched clause specifically, not just a generic UNTOUCHED match',
    holds: () => /imp-3066 K_a >= 0 untouched/.test(IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.verdict),
  },
];

for (const a of IMP33985_LOO_MODEL_SELECTION_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33985-loo-model-selection-sensitivity assertion failed: ${a.id}`);
  }
}
