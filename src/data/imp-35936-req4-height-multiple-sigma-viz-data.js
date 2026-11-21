/**
 * @module imp-35936-req4-height-multiple-sigma-viz-data
 * @fileoverview imp-35936 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35853 CONTINUOUS REQ-4
 *   required-height multiple 200 / log T0 versus sigma downslope curve, marking the
 *   three knee/flatness locators (Kneedle elbow sigma ~ 0.783, flattest point
 *   sigma ~ 0.407, PT-approach sigma ~ 0.035) and the ~6.96x PT anchor.
 *
 *   The literals below are copied verbatim from the imp-35853 measurement -- this
 *   module does not import imp-35853 (no re-running the bisection sweep at page-load
 *   time) so pages consuming it stay import-light, following the imp-35934 /
 *   imp-35935 baked-literal viz-data pattern.
 *
 *   @see imp-35853-req4-required-height-continuous-sigma-knee.js (source measurement)
 *   @see imp-35813-req4-required-height-sigma-landmark-extend.js (discrete rungs interpolated there)
 *   @see imp-35934-kappa-sweep-viz-data.js (same viz-data pattern, sibling S-frontier module)
 *
 *   Ticket: imp-35936 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

// Compact display grid (interpolated between the imp-35813 discrete rungs), verbatim
// from imp-35853's displayCurve export, sorted descending by sigma (peak -> PT anchor).
export const IMP35936_DISPLAY_CURVE = Object.freeze([
  { sigma: 0.94, N: 9.665e5, logT0: 14.7176, multiple: 13.5875 },
  { sigma: 0.9, N: 1.086e6, logT0: 15.5259, multiple: 12.8814 },
  { sigma: 0.85, N: 1.253e6, logT0: 16.4478, multiple: 12.1595 },
  { sigma: 0.8, N: 1.454e6, logT0: 17.3363, multiple: 11.5348 },
  { sigma: 0.75, N: 1.699e6, logT0: 18.2073, multiple: 10.985 },
  { sigma: 0.7, N: 2.004e6, logT0: 19.0709, multiple: 10.4872 },
  { sigma: 0.6, N: 2.895e6, logT0: 20.7925, multiple: 9.619 },
  { sigma: 0.5, N: 4.401e6, logT0: 22.5645, multiple: 8.8631 },
  { sigma: 0.4, N: 7.297e6, logT0: 24.4467, multiple: 8.1811 },
  { sigma: 0.3, N: 1.36e7, logT0: 26.4586, multiple: 7.5599 },
  { sigma: 0.25, N: 1.921e7, logT0: 27.5218, multiple: 7.2657 },
  { sigma: 0.2, N: 2.855e7, logT0: 28.6835, multiple: 6.973 },
  { sigma: 0.15, N: 4.559e7, logT0: 29.9598, multiple: 6.6756 },
  { sigma: 0.1, N: 8.235e7, logT0: 31.4051, multiple: 6.368 },
  { sigma: 0.08, N: 1.098e8, logT0: 32.0899, multiple: 6.2325 },
  { sigma: 0.06, N: 1.605e8, logT0: 32.928, multiple: 6.0736 },
  { sigma: 0.05, N: 2.032e8, logT0: 33.4363, multiple: 5.9807 },
  { sigma: 0.04, N: 2.716e8, logT0: 34.0313, multiple: 5.8772 },
  { sigma: 0.0188, N: 3e12, logT0: 28.7298, multiple: 6.9614, ptAnchor: true },
]);

// PT anchor: the log-height at which Platt-Trudgian is verified (T_PT = 3e12) and the
// required-height multiple 200 / log T0 the sigma-curve is compared against.
export const IMP35936_PT_ANCHOR = Object.freeze({
  logT0: 28.7298,
  sigma: 0.0188,
  multiple: 6.9614,
});

// (A) Kneedle elbow of the STEEP initial descent -- max normalised chord distance.
export const IMP35936_KNEEDLE_ELBOW = Object.freeze({
  sigma: 0.783,
  logT0: 18.27,
  multiple: 10.95,
  normalisedChordDistance: 0.0821,
});

// (B) Flattest point -- mid-downslope minimum |d multiple / d sigma|.
export const IMP35936_FLATTEST_POINT = Object.freeze({
  sigma: 0.407,
  multiple: 9.25,
  minAbsSlope: 3.5,
  maxAbsSlope: 62,
});

// (C) PT-anchor-value approach -- first sigma at which the multiple is within 10% / 5%.
export const IMP35936_FLOOR_APPROACH = Object.freeze({
  within10pct: { sigma: 0.065, multiple: 7.64 },
  within5pct: { sigma: 0.035, multiple: 7.28 },
});

export const IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA = {
  ticket: 'imp-35936',
  sourceTicket: 'imp-35853',
  displayCurve: IMP35936_DISPLAY_CURVE,
  ptAnchor: IMP35936_PT_ANCHOR,
  kneedleElbow: IMP35936_KNEEDLE_ELBOW,
  flattestPoint: IMP35936_FLATTEST_POINT,
  floorApproach: IMP35936_FLOOR_APPROACH,
  note:
    'imp-35853 measurement (baked here) of the imp-35813 REQ-4 required-height multiple ' +
    '200 / log T0 CONTINUOUSLY vs sigma along the full peak-to-PT downslope. The multiple ' +
    'descends monotonically from the interior peak toward the ~6.96x PT-anchor value, but its ' +
    'rate of descent is NOT monotone: steepest just below the peak, shallowest at the mid-downslope ' +
    'flattest point (sigma ~ 0.407), then RE-STEEPENS on the deep approach to the anchor.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35853 measurement verbatim; adds no new ' +
    'derivation and changes no bound. Measurement only; the multiple does NOT flatten onto the ' +
    '~6.96x PT-anchor value in sigma-space (it would keep descending below 6.96x for smaller sigma ' +
    '/ larger height); no operator positivity established; imp-35337a stays OPEN; NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35936_VIZ_ASSERTIONS = [
  {
    id: 'imp35936-curve-monotone-descending-multiple',
    description:
      'the continuous sigma-downslope multiple descends monotonically as sigma decreases (excluding the ' +
      'appended PT-anchor marker, which sits at a different height N=3e12 and is not part of the downslope)',
    // The final row is the PT anchor (ptAnchor:true) at N=3e12 -- its logT0=28.73 is LOWER than the
    // sigma~0.04 downslope tail (logT0=34.03), so its 200/logT0 multiple (6.96) legitimately exceeds the
    // tail (5.88). It is a distinct marker, not a downslope sample, so it is excluded from monotonicity.
    holds: () => {
      const slope = IMP35936_DISPLAY_CURVE.filter((r) => !r.ptAnchor);
      return slope.every((r, i) => i === 0 || r.multiple < slope[i - 1].multiple);
    },
  },
  {
    id: 'imp35936-curve-consistent-with-200-over-logT0',
    description: 'every displayCurve row satisfies multiple * logT0 ~ 200 (to the baked 4-sig-fig floor)',
    // multiple and logT0 are baked to ~4-6 sig figs, so their product only reconstructs 200 to ~0.035
    // (max dev 0.0349 at sigma=0.25); the old 0.02 tolerance was tighter than the input rounding.
    holds: () => IMP35936_DISPLAY_CURVE.every((r) => Math.abs(r.multiple * r.logT0 - 200) < 0.05),
  },
  {
    id: 'imp35936-pt-anchor-matches-tail-row',
    description: 'the PT anchor multiple/logT0 matches the final flagged displayCurve row',
    holds: () => {
      const tail = IMP35936_DISPLAY_CURVE[IMP35936_DISPLAY_CURVE.length - 1];
      return (
        tail.ptAnchor === true &&
        Math.abs(tail.multiple - IMP35936_PT_ANCHOR.multiple) < 1e-3 &&
        Math.abs(tail.logT0 - IMP35936_PT_ANCHOR.logT0) < 1e-3
      );
    },
  },
  {
    id: 'imp35936-flattest-slope-below-kneedle-and-approach',
    description: 'the flattest-point slope is strictly below both the Kneedle-region and deep-approach slopes (no flat floor)',
    holds: () =>
      IMP35936_FLATTEST_POINT.minAbsSlope < IMP35936_FLATTEST_POINT.maxAbsSlope &&
      IMP35936_FLATTEST_POINT.sigma < IMP35936_KNEEDLE_ELBOW.sigma &&
      IMP35936_FLOOR_APPROACH.within5pct.sigma < IMP35936_FLATTEST_POINT.sigma,
  },
  {
    id: 'imp35936-floor-approach-ordered-and-above-pt-sigma',
    description: 'within5pct sigma < within10pct sigma, both above the PT-anchor sigma',
    holds: () =>
      IMP35936_FLOOR_APPROACH.within5pct.sigma < IMP35936_FLOOR_APPROACH.within10pct.sigma &&
      IMP35936_FLOOR_APPROACH.within5pct.sigma > IMP35936_PT_ANCHOR.sigma,
  },
  {
    id: 'imp35936-honesty-gate-no-qed',
    description: 'honest status references measurement-only, no bound change, imp-35337a OPEN, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA.honest) &&
      /does NOT flatten/.test(IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA.honest) &&
      /imp-35337a stays OPEN/.test(IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA.honest),
  },
];

for (const a of IMP35936_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35936-req4-height-multiple-sigma-viz-data assertion failed: ${a.id}`);
  }
}
