/**
 * @module imp-3677-skew-toeplitz-krylov-depth-vs-N-law-viz-data
 *
 * imp-3677 (ux): lightweight, import-light viz-data module for a chart of the imp-3645
 * skew-Toeplitz Krylov depth-vs-N law: the two ticket-named anchors (N=1600, pair 2,
 * m*=280) and (N=2000, pair 3, m*=480), the three candidate m*(N) fits (linear/sqrt/log)
 * that pass through them exactly, and the pair-index confound revealed by the
 * homogeneous same-pair (lambda_3, pair 2) evidence: m* stays FLAT at 280 across
 * N=1600..2000 even though the named-anchor jump (280 -> 480) looks super-linear in N.
 *
 * Reference literals are baked from the imp-3645 measured.namedAnchors,
 * measured.samePairAnchors, measured.predictions and measured.{linearFit,sqrtFit,logFit}
 * fields (self-computing at import) -- no re-derivation here.
 *
 * @see imp-3645-skew-toeplitz-krylov-depth-vs-N-law.js (source module: anchors, fits, predictions)
 * @see imp-3696-matched-pair-krylov-depth-sweep-viz-data.js (sibling viz-data for the later imp-3663 matched-pair sweep)
 *
 * Ticket: imp-3677 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP3677_NAMED_ANCHORS = [
  { N: 1600, pairIndex: 2, pair: 'lambda_3', mStar: 280 },
  { N: 2000, pairIndex: 3, pair: 'lambda_5=lambda_6', mStar: 480 },
];

export const IMP3677_SAME_PAIR2_ANCHORS = [
  { N: 1200, mStar: 200, mStarIsUpperBound: true },
  { N: 1600, mStar: 280, mStarIsUpperBound: false },
  { N: 2000, mStar: 280, mStarIsUpperBound: false },
];

export const IMP3677_FITS = {
  linear: { slope: 0.5, intercept: -520 },
  sqrt: { slope: 42.36067977499788, intercept: -1414.4271909999152 },
  log: { slope: 896.2840235449102, intercept: -6332.5674390107815 },
};

export const IMP3677_PREDICT_LINEAR = (N) => IMP3677_FITS.linear.slope * N + IMP3677_FITS.linear.intercept;
export const IMP3677_PREDICT_SQRT = (N) => IMP3677_FITS.sqrt.slope * Math.sqrt(N) + IMP3677_FITS.sqrt.intercept;
export const IMP3677_PREDICT_LOG = (N) => IMP3677_FITS.log.slope * Math.log(N) + IMP3677_FITS.log.intercept;

export const IMP3677_PREDICTIONS = [
  { N: 2400, linear: 680, sqrt: 660.8138211236874, log: 643.4118985022569 },
  { N: 3200, linear: 1080, sqrt: 981.8547229659116, log: 901.2567439010782 },
];

export const IMP3677_GROWTH_FACTORS = {
  mStar: 480 / 280,
  n: 2000 / 1600,
  sqrtN: Math.sqrt(2000 / 1600),
};

export const IMP3677_SAME_PAIR_FLAT = true;
