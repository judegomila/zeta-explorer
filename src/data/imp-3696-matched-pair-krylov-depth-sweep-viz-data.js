/**
 * @module imp-3696-matched-pair-krylov-depth-sweep-viz-data
 *
 * imp-3696 (ux): lightweight, import-light viz-data module for a chart of the imp-3663
 * matched-pair (lambda_5=lambda_6, index 3) Krylov depth sweep: the anchor triple
 * m*(1600)=360, m*(2000)=480, m*(2400)=560 (concave, unequal steps 120 then 80), the
 * log/sqrt/linear least-squares fit residual ranking (log ~4.67 < sqrt ~7.05 <
 * linear ~9.43), and how the matched-pair extrapolation undercuts the imp-3645
 * pair-index-confounded bracket at N=2400 and N=3200.
 *
 * Reference literals are baked from the imp-3663 measured/matchedAnchors, fits, and
 * imp3645Bracket fields (self-computing at import) -- no re-derivation here.
 *
 * VERIFIED (imp-3721): all baked literals above re-checked against a live import of
 * imp-3663 -- anchors, fit slopes/intercepts/RMS, pred3200, and the imp-3645 bracket
 * reproduce bit-for-bit (reldiff 0). No drift.
 *
 * @see imp-3663-matched-pair-krylov-depth-sweep.js (source module: anchors, fits, bracket)
 * @see imp-3645-skew-toeplitz-krylov-depth-vs-N-law.js (the undiscriminated two-point bracket)
 *
 * Ticket: imp-3696 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP3696_MATCHED_ANCHORS = [
  { N: 1600, mStar: 360 },
  { N: 2000, mStar: 480 },
  { N: 2400, mStar: 560 },
];

export const IMP3696_DELTA_M = { lo: 120, hi: 80 };

export const IMP3696_FITS = {
  linear: { slope: 0.25, intercept: -33.333333333333314, rms: 9.428090415820646 },
  sqrt: { slope: 22.30330231180489, intercept: -527.4000997232811, rms: 7.0500760988507 },
  log: { slope: 494.899282445036, intercept: -3288.280247896737, rms: 4.674126969108381 },
};

export const IMP3696_PREDICT_LINEAR = (N) => IMP3696_FITS.linear.slope * N + IMP3696_FITS.linear.intercept;
export const IMP3696_PREDICT_SQRT = (N) => IMP3696_FITS.sqrt.slope * Math.sqrt(N) + IMP3696_FITS.sqrt.intercept;
export const IMP3696_PREDICT_LOG = (N) => IMP3696_FITS.log.slope * Math.log(N) + IMP3696_FITS.log.intercept;

export const IMP3696_PRED_3200 = { N: 3200, linear: 766.6666666666667, sqrt: 734.2652048791863, log: 706.0053841256267 };

export const IMP3696_IMP3645_BRACKET = {
  N2400: { linear: 680, sqrt: 661, log: 644 },
  N3200: { linear: 1080, sqrt: 982, log: 902 },
};

export const IMP3696_MATCHED_2400 = 560;
