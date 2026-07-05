/**
 * @module imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data
 * @fileoverview imp-34237 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34169 fixed-band (k<=10)
 *   peak re-acceleration and the imp-33810/imp-33843 surrogate resid_exp(k) zero-
 *   crossing / pole it terminates at.
 *
 *   Two panels of the SAME imp-34169 measurement:
 *     (1) the fixed-band peak over the three windows that stay computable
 *         (kEnd = 20.0, 20.5, 21.0) keeps climbing +0.865303 -> +0.915942 ->
 *         +0.996333, with increments that RE-ACCELERATE 0.050639 -> 0.080391
 *         (a strictly positive second difference +0.029752);
 *     (2) the surrogate resid_exp(k) = pEcoll(1-sigma) - pSigma decays through
 *         the deep tail and crosses zero at k* ~ 21.28095 -- past that point
 *         eflow_over_resid = eflow_attr / resid_exp flips sign (a pole at k*),
 *         Math.log of it is NaN, and the fixed-band peak is undefined for
 *         kEnd >= 21.5 (only 3 of the ticket's 13-window kEnd=20..26 grid
 *         compute).
 *
 *   All numbers are baked reference literals copied from the imp-34169 module
 *   docstring/exports -- this module does not import imp-34169 (or its
 *   lambda-rh-height-mapping / polymath15-constant-C-C dependency chain) so
 *   pages consuming it stay import-light.
 *
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (source measurement)
 *   @see imp-34109-fixed-band-peak-amplitude-saturation-fit.js (the kEnd=14..20 sweep imp-34169 continues)
 *
 *   Ticket: imp-34237 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// (1) Fixed-band (k<=10) peak over the three computable windows -- imp-34169 F1.
export const IMP34237_FIXED_BAND_PEAK_ROWS = Object.freeze([
  { kEnd: 20.0, peak: 0.865303 },
  { kEnd: 20.5, peak: 0.915942 },
  { kEnd: 21.0, peak: 0.996333 },
]);

export const IMP34237_PEAK_INCREMENTS = Object.freeze([0.050639, 0.080391]);
export const IMP34237_PEAK_SECOND_DIFFERENCE = 0.029752;

// (2) Surrogate resid_exp(k) through the deep tail, crossing zero at k* ~ 21.28095 -- imp-34169 F2/F3.
export const IMP34237_RESID_EXP_ROWS = Object.freeze([
  { k: 19.0, residExp: 3.04e-6 },
  { k: 20.0, residExp: 7.94e-7 },
  { k: 21.0, residExp: 8.72e-8 },
  { k: 21.25, residExp: 8.19e-9 },
  { k: 21.5, residExp: -4.97e-8 },
]);

export const IMP34237_RESID_ZERO_KSTAR = 21.28095;

// eflow_over_resid ratio (the log argument) spikes toward the pole then flips sign past k*.
export const IMP34237_EFLOW_OVER_RESID_ROWS = Object.freeze([
  { k: 21.25, ratio: 5.9e-7 },
  { k: 21.5, ratio: -5.67e-8 },
]);

export const IMP34237_FIRST_BREAKDOWN_KEND = 21.5; // first kEnd whose ladder carries a non-positive rung
export const IMP34237_COMPUTABLE_WINDOW_COUNT = 3;
export const IMP34237_TOTAL_WINDOW_COUNT = 13; // the ticket's kEnd=20..26 grid; only 3 compute

export const IMP34237_FIXED_BAND_PEAK_REACCEL_AND_SURROGATE_POLE_VIZ_DATA = {
  ticket: 'imp-34237',
  peakRows: IMP34237_FIXED_BAND_PEAK_ROWS,
  peakIncrements: IMP34237_PEAK_INCREMENTS,
  peakSecondDifference: IMP34237_PEAK_SECOND_DIFFERENCE,
  residExpRows: IMP34237_RESID_EXP_ROWS,
  residZeroKStar: IMP34237_RESID_ZERO_KSTAR,
  eflowOverResidRows: IMP34237_EFLOW_OVER_RESID_ROWS,
  firstBreakdownKEnd: IMP34237_FIRST_BREAKDOWN_KEND,
  computableWindowCount: IMP34237_COMPUTABLE_WINDOW_COUNT,
  totalWindowCount: IMP34237_TOTAL_WINDOW_COUNT,
  note:
    'Two views of the SAME imp-34169 measurement: the fixed-band (k<=10) peak keeps ' +
    'climbing and its increments RE-ACCELERATE over the three windows that stay ' +
    'computable, while the surrogate resid_exp(k) whose log the whole fit takes decays ' +
    'through the deep tail and crosses zero at k*~21.28095, putting a pole in ' +
    'eflow_over_resid and leaving every window past kEnd=21.0 undefined.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34169 measurement on one shared ' +
    'k-axis; adds no new derivation and changes no bound. Descriptive surrogate/fit, NOT ' +
    'a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 ' +
    'untouched; NO QED; Platt-Trudgian Lambda<=0.2 remains SOTA.',
};

export const IMP34237_ASSERTIONS = [
  {
    id: 'imp-34237-peak-rows-monotone-reaccelerating',
    description: 'the three fixed-band peak rows are monotone rising and increments strictly re-accelerate',
    holds: () =>
      IMP34237_FIXED_BAND_PEAK_ROWS.length === 3 &&
      IMP34237_FIXED_BAND_PEAK_ROWS[1].peak > IMP34237_FIXED_BAND_PEAK_ROWS[0].peak &&
      IMP34237_FIXED_BAND_PEAK_ROWS[2].peak > IMP34237_FIXED_BAND_PEAK_ROWS[1].peak &&
      IMP34237_PEAK_INCREMENTS[1] > IMP34237_PEAK_INCREMENTS[0] &&
      IMP34237_PEAK_SECOND_DIFFERENCE > 0,
  },
  {
    id: 'imp-34237-resid-exp-decays-and-crosses-zero',
    description: 'resid_exp(k) decays through the deep tail and the bisected zero k* sits between the last positive and first negative rungs',
    holds: () => {
      const rows = IMP34237_RESID_EXP_ROWS;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].residExp < rows[i - 1].residExp)) return false;
      }
      const lastPositive = rows[rows.length - 2];
      const firstNegative = rows[rows.length - 1];
      return (
        lastPositive.residExp > 0 &&
        firstNegative.residExp < 0 &&
        IMP34237_RESID_ZERO_KSTAR > lastPositive.k &&
        IMP34237_RESID_ZERO_KSTAR < firstNegative.k
      );
    },
  },
  {
    id: 'imp-34237-eflow-ratio-flips-sign-across-pole',
    description: 'eflow_over_resid flips from positive to negative across k*, matching only 3 of 13 windows computable',
    holds: () =>
      IMP34237_EFLOW_OVER_RESID_ROWS[0].ratio > 0 &&
      IMP34237_EFLOW_OVER_RESID_ROWS[1].ratio < 0 &&
      IMP34237_FIRST_BREAKDOWN_KEND === 21.5 &&
      IMP34237_COMPUTABLE_WINDOW_COUNT < IMP34237_TOTAL_WINDOW_COUNT,
  },
];

for (const a of IMP34237_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data assertion failed: ${a.id}`);
  }
}
