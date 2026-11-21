/**
 * @module imp-3678-moment-ratio-asymptotics-viz-data
 *
 * imp-3678 (ux): lightweight, import-light viz-data module for a chart of the imp-3646
 * remainder-tail moment-ratio asymptotics: the unbounded growth of Q_n = M_(n+2)/M_n and
 * n^2 C_n over n=3..18 (refuting the fixed b^2/n^2 saturation guess), alongside the
 * Laplace-saddle ratio Q_n/tau*(n)^2 falling monotonically toward 1 from above.
 *
 * Reference literals are baked from the imp-3646 measured.rungs table (self-computing
 * at import) -- no re-derivation here.
 *
 * @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (source module: rungs, verdict)
 *
 * Ticket: imp-3678 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP3678_RUNGS = [
  { n: 3, momentRatio: 0.02914611, n2LeadingCoeff: 0.01311575, qOverSaddleQ: 1.53820 },
  { n: 4, momentRatio: 0.03698556, n2LeadingCoeff: 0.01972563, qOverSaddleQ: 1.36330 },
  { n: 5, momentRatio: 0.04466606, n2LeadingCoeff: 0.02658694, qOverSaddleQ: 1.26704 },
  { n: 6, momentRatio: 0.05215998, n2LeadingCoeff: 0.03353141, qOverSaddleQ: 1.20700 },
  { n: 7, momentRatio: 0.05945825, n2LeadingCoeff: 0.04046464, qOverSaddleQ: 1.16643 },
  { n: 8, momentRatio: 0.06656107, n2LeadingCoeff: 0.04733231, qOverSaddleQ: 1.13744 },
  { n: 9, momentRatio: 0.07347328, n2LeadingCoeff: 0.05410305, qOverSaddleQ: 1.11584 },
  { n: 10, momentRatio: 0.08020204, n2LeadingCoeff: 0.06075912, qOverSaddleQ: 1.09922 },
  { n: 11, momentRatio: 0.08675547, n2LeadingCoeff: 0.06729110, qOverSaddleQ: 1.08611 },
  { n: 12, momentRatio: 0.09314202, n2LeadingCoeff: 0.07369479, qOverSaddleQ: 1.07555 },
  { n: 13, momentRatio: 0.09937004, n2LeadingCoeff: 0.07996923, qOverSaddleQ: 1.06689 },
  { n: 14, momentRatio: 0.10544761, n2LeadingCoeff: 0.08611555, qOverSaddleQ: 1.05969 },
  { n: 15, momentRatio: 0.11138240, n2LeadingCoeff: 0.09213617, qOverSaddleQ: 1.05363 },
  { n: 16, momentRatio: 0.11718164, n2LeadingCoeff: 0.09803431, qOverSaddleQ: 1.04847 },
  { n: 17, momentRatio: 0.12285213, n2LeadingCoeff: 0.10381364, qOverSaddleQ: 1.04404 },
  { n: 18, momentRatio: 0.12840022, n2LeadingCoeff: 0.10947808, qOverSaddleQ: 1.04020 },
];

export const IMP3678_Q_FIRST = 0.02914611;
export const IMP3678_Q_LAST = 0.12840022;
export const IMP3678_N2C_FIRST = 0.01311575;
export const IMP3678_N2C_LAST = 0.10947808;
export const IMP3678_SADDLE_RATIO_FIRST = 1.53820;
export const IMP3678_SADDLE_RATIO_LAST = 1.04020;
