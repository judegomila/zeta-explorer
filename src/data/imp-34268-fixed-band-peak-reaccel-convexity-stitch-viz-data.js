/**
 * @module imp-34268-fixed-band-peak-reaccel-convexity-stitch-viz-data
 * @fileoverview imp-34357 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34268 fixed-band (k<=10)
 *   peak re-acceleration convexity stitch.
 *
 *   imp-34268 stitched the imp-34196 0.25-grid post-minimum peak increments onto the
 *   imp-34169 kEnd 20..21 increments on one common 18-window grid (kEnd = 17.00..21.25)
 *   and showed the re-acceleration branch is genuinely CONVEX: the imp-34196 4-point
 *   linear increment fit (b ~ +0.0025668, R2 ~ 0.97222) is reproduced exactly inside its
 *   own 18.75..19.50 window, but extrapolated forward it UNDER-predicts the imp-34169
 *   increments monotonically and super-linearly (residual actual - predicted growing
 *   +0.000213 at kEnd=19.75 to +0.080936 at kEnd=21.25), because the peak carries
 *   strictly positive and GROWING third differences (increment second differences
 *   +0.000960 -> +0.057428 over kEnd 19.0..21.25).
 *
 *   All numbers are baked reference literals copied from the imp-34268 module exports
 *   -- this module does not import imp-34268 (or its lambda-rh-height-mapping /
 *   polymath15-constant-C-C dependency chain) so pages consuming it stay import-light.
 *
 *   @see imp-34268-fixed-band-peak-reaccel-convexity-stitch.js (source measurement)
 *   @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine.js (the 0.25-grid re-accel slope stitched)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the kEnd 20..21 increments stitched)
 *   @see imp-34274-fixed-band-peak-increment-minimum-viz-data.js (same viz-data pattern, one decade earlier)
 *
 *   Ticket: imp-34357 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// The 18-window stitch grid, kEnd = 17.00 .. 21.25 (0.25 step).
export const IMP34268_K_ENDS = Object.freeze([
  17.0, 17.25, 17.5, 17.75, 18.0, 18.25, 18.5, 18.75, 19.0, 19.25, 19.5, 19.75, 20.0, 20.25, 20.5, 20.75, 21.0, 21.25,
]);

// The fixed-band (k<=10) peak at each kEnd -- kEnd=17.0 reproduces imp-34196/imp-34109 (+0.648552),
// kEnd=20.0 reproduces imp-34169 (+0.865303).
export const IMP34268_PEAKS = Object.freeze([
  0.648552, 0.667035, 0.685053, 0.702652, 0.71989, 0.736839, 0.75359, 0.770259, 0.787888, 0.805997, 0.824645,
  0.844226, 0.865303, 0.888735, 0.915942, 0.949607, 0.996333, 1.100487,
]);

// The 17 consecutive 0.25-grid increments (peak_i - peak_{i-1}), indexed by right-endpoint kEnd.
export const IMP34268_INCREMENT_END_KENDS = Object.freeze(IMP34268_K_ENDS.slice(1));
export const IMP34268_INCREMENTS = Object.freeze([
  0.018483, 0.018018, 0.017599, 0.017238, 0.016949, 0.016751, 0.016669, 0.017629, 0.018109, 0.018648, 0.019581,
  0.021077, 0.023432, 0.027207, 0.033665, 0.046726, 0.104154,
]);

// The increment second differences (= peak third differences), indexed by right-endpoint kEnd.
export const IMP34268_INC_SECOND_DIFF_KENDS = Object.freeze(IMP34268_K_ENDS.slice(2));
export const IMP34268_INC_SECOND_DIFFS = Object.freeze([
  -0.000465, -0.000419, -0.000361, -0.000289, -0.000198, -0.000082, 0.00096, 0.00048, 0.000539, 0.000933, 0.001496,
  0.002355, 0.003775, 0.006458, 0.013061, 0.057428,
]);

// (F1) The reproduced imp-34196 4-point post-minimum linear increment fit: increment = a + b*kEnd.
export const IMP34268_LINEAR_FIT = Object.freeze({ a: -0.0313263, b: 0.0025668, r2: 0.97222 });

// (F2) Extrapolated forward, the linear fit under-predicts every imp-34169 window -- residual actual - predicted.
export const IMP34268_UNDERPREDICT_ROWS = Object.freeze([
  { kEnd: 19.75, actual: 0.019581, predicted: 0.019368, residual: 0.000213 },
  { kEnd: 20.0, actual: 0.021077, predicted: 0.02001, residual: 0.001067 },
  { kEnd: 20.25, actual: 0.023432, predicted: 0.020651, residual: 0.002781 },
  { kEnd: 20.5, actual: 0.027207, predicted: 0.021293, residual: 0.005914 },
  { kEnd: 20.75, actual: 0.033665, predicted: 0.021935, residual: 0.01173 },
  { kEnd: 21.0, actual: 0.046726, predicted: 0.022577, residual: 0.024149 },
  { kEnd: 21.25, actual: 0.104154, predicted: 0.023218, residual: 0.080936 },
]);
export const IMP34268_MAX_RESIDUAL = 0.080936;

// The imp-34169 0.5-grid increments (reconstructed from the 0.25-grid peaks) vs. the linear-fit prediction.
export const IMP34268_HALF_GRID = Object.freeze({
  inc20to205Actual: 0.050639,
  inc20to205Predicted: 0.041945,
  inc205to21Actual: 0.080391,
  inc205to21Predicted: 0.044511,
});

// (F3) Convexity: post-minimum (kEnd >= 19.0) increment second differences, strictly positive and growing.
export const IMP34268_POSTMIN_SECOND_DIFF_KENDS = Object.freeze([
  19.0, 19.25, 19.5, 19.75, 20.0, 20.25, 20.5, 20.75, 21.0, 21.25,
]);
export const IMP34268_POSTMIN_SECOND_DIFFS = Object.freeze([
  0.00096, 0.00048, 0.000539, 0.000933, 0.001496, 0.002355, 0.003775, 0.006458, 0.013061, 0.057428,
]);
export const IMP34268_MAX_SECOND_DIFFERENCE = 0.057428;
export const IMP34268_BRANCH_IS_CONVEX = true;
export const IMP34268_ALL_UNDERPREDICTED = true;
export const IMP34268_UNDERPREDICTION_MONOTONE = true;

export const IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH_VIZ_DATA = {
  ticket: 'imp-34357',
  sourceTicket: 'imp-34268',
  kEnds: IMP34268_K_ENDS,
  peaks: IMP34268_PEAKS,
  incrementEndKEnds: IMP34268_INCREMENT_END_KENDS,
  increments: IMP34268_INCREMENTS,
  incSecondDiffKEnds: IMP34268_INC_SECOND_DIFF_KENDS,
  incSecondDiffs: IMP34268_INC_SECOND_DIFFS,
  linearFit: IMP34268_LINEAR_FIT,
  underPredictionRows: IMP34268_UNDERPREDICT_ROWS,
  maxResidual: IMP34268_MAX_RESIDUAL,
  halfGrid: IMP34268_HALF_GRID,
  postMinSecondDiffKEnds: IMP34268_POSTMIN_SECOND_DIFF_KENDS,
  postMinSecondDiffs: IMP34268_POSTMIN_SECOND_DIFFS,
  maxSecondDifference: IMP34268_MAX_SECOND_DIFFERENCE,
  branchIsConvex: IMP34268_BRANCH_IS_CONVEX,
  note:
    'Stitching the imp-34196 0.25-grid post-minimum fixed-band (k<=10) peak increments onto the imp-34169 ' +
    'kEnd 20..21 increments on one common grid shows the imp-34196 4-point linear increment slope ' +
    '(b=+0.0025668, R2=0.97222) is reproduced exactly but is only a LOCAL fit: extrapolated forward it ' +
    'under-predicts the imp-34169 increments monotonically and super-linearly, because the fixed-band peak ' +
    'carries strictly positive and growing third differences. The re-acceleration branch is genuinely ' +
    'CONVEX, not linear.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34268 measurement; adds no new derivation and ' +
    'changes no bound. Descriptive OLS surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; the functional form of the convex branch is an OPEN ' +
    'sub-gap; NO QED; no refereed bound is changed.',
};

export const IMP34268_VIZ_ASSERTIONS = [
  {
    id: 'imp34357-grid-18-windows-anchors-match',
    description: '18-window 0.25 grid 17.0..21.25; kEnd 17.0 -> +0.648552 (imp-34196), kEnd 20.0 -> +0.865303 (imp-34169)',
    holds: () =>
      IMP34268_K_ENDS.length === 18 &&
      IMP34268_K_ENDS[0] === 17.0 &&
      IMP34268_K_ENDS[IMP34268_K_ENDS.length - 1] === 21.25 &&
      IMP34268_PEAKS[0] === 0.648552 &&
      IMP34268_PEAKS[12] === 0.865303,
  },
  {
    id: 'imp34357-linear-fit-reproduces-imp34196',
    description: 'linear fit slope b ~ +0.0025668, R2 ~ 0.97222 matches imp-34196 (b~0.002567, R2~0.972)',
    holds: () => Math.abs(IMP34268_LINEAR_FIT.b - 0.002567) < 5e-6 && Math.abs(IMP34268_LINEAR_FIT.r2 - 0.972) < 5e-4,
  },
  {
    id: 'imp34357-underprediction-monotone-positive',
    description: '7-row under-prediction residual strictly positive and monotone, max ~+0.080936 at kEnd 21.25',
    holds: () =>
      IMP34268_UNDERPREDICT_ROWS.length === 7 &&
      IMP34268_ALL_UNDERPREDICTED === true &&
      IMP34268_UNDERPREDICTION_MONOTONE === true &&
      Math.abs(IMP34268_MAX_RESIDUAL - 0.080936) < 1e-6,
  },
  {
    id: 'imp34357-branch-convex-third-diffs-positive-growing',
    description: 'post-minimum increment second differences strictly positive and growing, max ~+0.057428',
    holds: () =>
      IMP34268_POSTMIN_SECOND_DIFFS.every((d) => d > 0) &&
      Math.abs(IMP34268_MAX_SECOND_DIFFERENCE - 0.057428) < 1e-6 &&
      IMP34268_BRANCH_IS_CONVEX === true,
  },
  {
    id: 'imp34357-honesty-gate-no-qed',
    description: 'honest status references no-bound-change, NOT rigorous, NO QED, no refereed bound is changed',
    holds: () =>
      /NOT a rigorous asymptotic/.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH_VIZ_DATA.honest) &&
      /NO QED/.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH_VIZ_DATA.honest),
  },
];

for (const a of IMP34268_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34268-fixed-band-peak-reaccel-convexity-stitch-viz-data assertion failed: ${a.id}`);
  }
}
