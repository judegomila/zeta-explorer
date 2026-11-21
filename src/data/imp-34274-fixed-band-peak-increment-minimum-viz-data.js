/**
 * @module imp-34274-fixed-band-peak-increment-minimum-viz-data
 * @fileoverview imp-34274 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34196 fixed-band (k<=10)
 *   peak increment-minimum and sub-window inflection.
 *
 *   Two panels of the SAME imp-34196 measurement, on the refined kEnd = 17.0 .. 19.5
 *   (0.25-step) grid:
 *     (1) the fixed-band peak climbs monotonically +0.648552 -> +0.824645, with its
 *         10 increments dipping to a MINIMUM 0.016669 at the kEnd 18.50 -> 18.75 step
 *         then RE-INCREASING through 0.018648 -- half a window LATER than the
 *         imp-34109 coarse 0.5-grid read (18.0 -> 18.5, increment 0.03370);
 *     (2) a 3-point parabolic vertex of the increment-vs-kEnd curve places the
 *         deceleration-to-re-acceleration inflection at kEnd* ~ 18.6447, bracketed by
 *         the second-difference sign flip from negative (through 18.75) to strictly
 *         positive at kEnd = 19.0.
 *
 *   All numbers are baked reference literals copied from the imp-34196 module exports
 *   -- this module does not import imp-34196 (or its lambda-rh-height-mapping /
 *   polymath15-constant-C-C dependency chain) so pages consuming it stay import-light.
 *
 *   @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine.js (source measurement)
 *   @see imp-34109-fixed-band-peak-amplitude-saturation-fit.js (the coarse 0.5-grid sweep imp-34196 refines)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (the same viz-data pattern, one decade further)
 *
 *   Ticket: imp-34274 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// (1) Fixed-band (k<=10) peak over the 11 refined 0.25-step windows -- imp-34196 measurement.
export const IMP34274_FIXED_BAND_PEAK_ROWS = Object.freeze([
  { kEnd: 17.0, peak: 0.648552 },
  { kEnd: 17.25, peak: 0.667035 },
  { kEnd: 17.5, peak: 0.685053 },
  { kEnd: 17.75, peak: 0.702652 },
  { kEnd: 18.0, peak: 0.71989 },
  { kEnd: 18.25, peak: 0.736839 },
  { kEnd: 18.5, peak: 0.75359 },
  { kEnd: 18.75, peak: 0.770259 },
  { kEnd: 19.0, peak: 0.787888 },
  { kEnd: 19.25, peak: 0.805997 },
  { kEnd: 19.5, peak: 0.824645 },
]);

// The 10 consecutive increments (peak_i - peak_{i-1}) -- dip to a minimum then re-increase.
export const IMP34274_FIXED_BAND_INCREMENTS = Object.freeze([
  0.018483, 0.018018, 0.017599, 0.017238, 0.016949, 0.016751, 0.016669, 0.017629, 0.018109, 0.018648,
]);

export const IMP34274_INCREMENT_MINIMUM = 0.016669;
export const IMP34274_INCREMENT_MINIMUM_STEP_KEND = 18.75; // right endpoint of the kEnd 18.50 -> 18.75 step
export const IMP34274_COARSE_MINIMUM_STEP_KEND = 18.5; // imp-34109's 0.5-grid read, one bin earlier
export const IMP34274_COARSE_MINIMUM_INCREMENT = 0.0337;

// (2) The sub-window parabolic inflection -- deceleration reverses to re-acceleration.
export const IMP34274_INFLECTION_KEND = 18.6447;

export const IMP34274_SECOND_DIFFERENCES = Object.freeze([
  -0.000465, -0.000419, -0.000361, -0.000289, -0.000198, -0.000082, 0.00096, 0.00048, 0.000539,
]);

export const IMP34274_REACCEL_BRANCH = Object.freeze({
  xsKEnd: [18.75, 19.0, 19.25, 19.5],
  increments: [0.016669, 0.017629, 0.018109, 0.018648],
  slope: 0.002567,
  r2: 0.972217,
  convex: true,
});

export const IMP34274_FIXED_BAND_PEAK_INCREMENT_MINIMUM_VIZ_DATA = {
  ticket: 'imp-34274',
  peakRows: IMP34274_FIXED_BAND_PEAK_ROWS,
  increments: IMP34274_FIXED_BAND_INCREMENTS,
  incrementMinimum: IMP34274_INCREMENT_MINIMUM,
  incrementMinimumStepKEnd: IMP34274_INCREMENT_MINIMUM_STEP_KEND,
  coarseMinimumStepKEnd: IMP34274_COARSE_MINIMUM_STEP_KEND,
  coarseMinimumIncrement: IMP34274_COARSE_MINIMUM_INCREMENT,
  inflectionKEnd: IMP34274_INFLECTION_KEND,
  secondDifferences: IMP34274_SECOND_DIFFERENCES,
  reaccelBranch: IMP34274_REACCEL_BRANCH,
  note:
    'The refined (0.25-step) fixed-band (k<=10) peak climbs monotonically over kEnd = 17.0 .. 19.5; ' +
    'its increments dip to a minimum at the kEnd 18.50 -> 18.75 step -- half a window later than the ' +
    'imp-34109 coarse-grid read -- then re-increase, with a parabolic inflection at kEnd* ~ 18.6447 ' +
    'bracketed by the second-difference sign flip from negative to positive at kEnd = 19.0.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34196 measurement; adds no new derivation and ' +
    'changes no bound. Descriptive OLS surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34274_ASSERTIONS = [
  {
    id: 'imp34274-rows-monotone-11-windows',
    description: '11 fixed-band peak rows, monotonically increasing',
    holds: () =>
      IMP34274_FIXED_BAND_PEAK_ROWS.length === 11 &&
      IMP34274_FIXED_BAND_PEAK_ROWS.every((r, i) => i === 0 || r.peak > IMP34274_FIXED_BAND_PEAK_ROWS[i - 1].peak),
  },
  {
    id: 'imp34274-increment-minimum-matches-source',
    description: 'increment minimum ~0.016669 at the kEnd 18.75 step, half a window later than the coarse 18.5 step',
    holds: () =>
      Math.min(...IMP34274_FIXED_BAND_INCREMENTS) === IMP34274_INCREMENT_MINIMUM &&
      IMP34274_INCREMENT_MINIMUM_STEP_KEND === 18.75 &&
      IMP34274_INCREMENT_MINIMUM < IMP34274_COARSE_MINIMUM_INCREMENT,
  },
  {
    id: 'imp34274-inflection-in-bracket',
    description: 'parabolic inflection kEnd* strictly between 18.5 and 18.8, second-diffs flip sign',
    holds: () =>
      IMP34274_INFLECTION_KEND > 18.5 &&
      IMP34274_INFLECTION_KEND < 18.8 &&
      IMP34274_SECOND_DIFFERENCES[0] < 0 &&
      IMP34274_SECOND_DIFFERENCES[IMP34274_SECOND_DIFFERENCES.length - 1] > 0,
  },
  {
    id: 'imp34274-honesty-gate-no-qed',
    description: 'honest status references no-bound-change, NOT rigorous, NO QED, no refereed bound is changed',
    holds: () =>
      /NOT a rigorous asymptotic/.test(IMP34274_FIXED_BAND_PEAK_INCREMENT_MINIMUM_VIZ_DATA.honest) &&
      /NO QED/.test(IMP34274_FIXED_BAND_PEAK_INCREMENT_MINIMUM_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP34274_FIXED_BAND_PEAK_INCREMENT_MINIMUM_VIZ_DATA.honest),
  },
];

for (const a of IMP34274_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34274-fixed-band-peak-increment-minimum-viz-data assertion failed: ${a.id}`);
  }
}
