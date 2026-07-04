/**
 * @module imp-33571-deep-tail-jitter-envelope-viz-data
 * @fileoverview imp-33571 -- lightweight, import-light literal data for a chart of the
 *   imp-33537 depth-growing deep-tail plateau jitter envelope: worst-window ULP per rung
 *   across the four dense integer windows W0..W3 (centred on n~300, 395, 495, 595), with the
 *   imp-33295 strict 30-ULP bar and the imp-33316 widened 64-ULP deep band marked, showing the
 *   recurrence-and-intensification and the two 64-ULP band crossings (W2, W3).
 *
 *   Values below are baked reference literals reproduced from the imp-33537 module
 *   (src/data/imp-33537-deep-tail-plateau-spike-recurrence.js), which does the actual dense-grid
 *   plateau-vs-A_log scoring; this module does NOT re-run that computation, so importing it into
 *   a page costs nothing at load time.
 *
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the source dense-grid measurement)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the coarse-grid reading this corrects)
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the strict 30-ULP bar)
 *
 *   Ticket: imp-33571 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 *   Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP33571_STRICT_BAR_ULP = 30;
export const IMP33571_DEEP_BAND_ULP = 64;

export const IMP33571_WINDOW_SERIES = Object.freeze([
  { label: 'W0 (n~300, reference)', center: 300, worstUlp: 50.1519, worstAtN: 300, exceedStrictCount: 6, exceedDeepCount: 0, total: 31, longestAboveBarRun: 2 },
  { label: 'W1 (n~395)', center: 395, worstUlp: 37.4759, worstAtN: 397, exceedStrictCount: 6, exceedDeepCount: 0, total: 31, longestAboveBarRun: 1 },
  { label: 'W2 (n~495)', center: 495, worstUlp: 79.1258, worstAtN: 510, exceedStrictCount: 16, exceedDeepCount: 2, total: 31, longestAboveBarRun: 7 },
  { label: 'W3 (n~595)', center: 595, worstUlp: 74.0098, worstAtN: 596, exceedStrictCount: 17, exceedDeepCount: 1, total: 31, longestAboveBarRun: 5 },
]);
