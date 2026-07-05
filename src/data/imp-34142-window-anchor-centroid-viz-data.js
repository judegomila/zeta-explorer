/**
 * @module imp-34142-window-anchor-centroid-viz-data
 * @fileoverview imp-34142 -- lightweight, import-light literal data for a
 *   visualization of the imp-34066 window-anchor centroid mechanism: the
 *   fixed 12-decade OLS effective-exponent window, anchored at its START N,
 *   reads the imp-33816 pointwise exponent p(N) roughly HALF A SPAN ahead
 *   (imp-34006 F3) -- but re-anchoring the SAME window at its CENTRE
 *   collapses that ~6-decade lead to within a fraction of a decade of the
 *   pointwise crossings (imp-34066 C1), confirming the OLS reads the
 *   pointwise exponent at its window centroid.
 *
 *   Values below are baked reference literals reproduced by re-evaluating
 *   the imp-34066-centred-window-collapses-exponent-lead.js `pPointAtLog10`
 *   / `pWindowStartAtLog10` / `pWindowCentreAtLog10` formulas (identical
 *   inherited imp-3220/imp-3406/imp-33274/imp-33816 sub-terms); this module
 *   does NOT re-run that computation or import the heavy zeros bundle, so
 *   importing it into a page costs nothing at load time.
 *
 *   @see imp-34066-centred-window-collapses-exponent-lead.js (the source measurement)
 *   @see imp-34065-window-span-scaling-of-exponent-offset.js (span-linear generalization)
 *   @see imp-34006-pointwise-vs-window-exponent-cross-tabulation (F3: START-window lead ~half span)
 *   @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law gap ~ 1/(2 log T0))
 *
 *   Ticket: imp-34142 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Three exponent estimators sampled every 2 decades over log10(N) in [10, 70]:
// p = pointwise p(N); s = START-anchored 12-decade OLS window p_eff^start(N);
// c = CENTRE-anchored 12-decade OLS window p_eff^centre(N) (null where the
// centre window's lower edge N*10^-6 would fall below log10(N)=6, i.e. d<12).
export const IMP34142_ESTIMATOR_CURVE = Object.freeze([
  { log10N: 10, p: 0.30107, s: 0.47809, c: null },
  { log10N: 12, p: 0.45264, s: 0.48648, c: 0.36937 },
  { log10N: 14, p: 0.48096, s: 0.48863, c: 0.44418 },
  { log10N: 16, p: 0.48586, s: 0.48978, c: 0.47809 },
  { log10N: 18, p: 0.48769, s: 0.49066, c: 0.48648 },
  { log10N: 20, p: 0.48894, s: 0.49139, c: 0.48863 },
  { log10N: 22, p: 0.48995, s: 0.49202, c: 0.48978 },
  { log10N: 24, p: 0.49078, s: 0.49256, c: 0.49066 },
  { log10N: 26, p: 0.49149, s: 0.49304, c: 0.49139 },
  { log10N: 28, p: 0.49210, s: 0.49345, c: 0.49202 },
  { log10N: 30, p: 0.49263, s: 0.49382, c: 0.49256 },
  { log10N: 32, p: 0.49309, s: 0.49415, c: 0.49304 },
  { log10N: 34, p: 0.49350, s: 0.49445, c: 0.49345 },
  { log10N: 36, p: 0.49386, s: 0.49472, c: 0.49382 },
  { log10N: 38, p: 0.49418, s: 0.49496, c: 0.49415 },
  { log10N: 40, p: 0.49448, s: 0.49518, c: 0.49445 },
  { log10N: 42, p: 0.49474, s: 0.49539, c: 0.49472 },
  { log10N: 44, p: 0.49498, s: 0.49557, c: 0.49496 },
  { log10N: 46, p: 0.49520, s: 0.49575, c: 0.49518 },
  { log10N: 48, p: 0.49540, s: 0.49591, c: 0.49539 },
  { log10N: 50, p: 0.49559, s: 0.49605, c: 0.49557 },
  { log10N: 52, p: 0.49576, s: 0.49619, c: 0.49575 },
  { log10N: 54, p: 0.49592, s: 0.49632, c: 0.49591 },
  { log10N: 56, p: 0.49606, s: 0.49644, c: 0.49605 },
  { log10N: 58, p: 0.49620, s: 0.49655, c: 0.49619 },
  { log10N: 60, p: 0.49633, s: 0.49666, c: 0.49632 },
  { log10N: 62, p: 0.49645, s: 0.49676, c: 0.49644 },
  { log10N: 64, p: 0.49656, s: 0.49685, c: 0.49655 },
  { log10N: 66, p: 0.49666, s: 0.49694, c: 0.49666 },
  { log10N: 68, p: 0.49676, s: 0.49702, c: 0.49676 },
  { log10N: 70, p: 0.49686, s: 0.49710, c: 0.49685 },
]);

// imp-34066 within-1% (p >= 0.495) crossings for all three estimators.
export const IMP34142_WITHIN_1PCT_CROSSINGS = Object.freeze({
  point: { log10N: 44.167, label: 'pointwise p(N)' },
  start: { log10N: 38.337, label: 'START-anchored window (leads by ~5.83 decades)' },
  centre: { log10N: 44.337, label: 'CENTRE-anchored window (collapses to +0.17 decades)' },
  threshold: 0.495,
});

// imp-34066 deeper within-0.1% (p >= 0.4995) crossings -- an order of
// magnitude past this chart's log10(N)~70 edge, reported from the module
// only (not plotted as curve points).
export const IMP34142_WITHIN_0_1PCT_CROSSINGS_FROM_MODULE = Object.freeze({
  point: 436.059,
  start: 430.076,
  centre: 436.076,
  threshold: 0.4995,
});

export const IMP34142_LEADS_AND_RESIDUALS = Object.freeze({
  startLeadOverPoint1pctDecades: 5.83,
  startLeadOverPoint0_1pctDecades: 5.983,
  centreResidVsPoint1pctDecades: 0.17,
  centreResidVsPoint0_1pctDecades: 0.017,
  collapseFraction1pct: 0.9709,
  collapseFraction0_1pct: 0.9971,
});

export const IMP34142_FAR_TAIL_ASYMPTOTE = Object.freeze({ p: 0.5, label: 'imp-3463 far-tail asymptote p -> 1/2' });
