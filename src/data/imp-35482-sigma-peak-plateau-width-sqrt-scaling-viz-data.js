/**
 * @module imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data
 * @fileoverview imp-35482 -- VIZ DATA ONLY for the imp-35411 ln-N plateau-width sqrt(tol) scaling
 *   sweep: W(tol) = 15.316494 * sqrt(tol), a line through the origin in the (sqrt(tol), W(tol))
 *   plane -- the signature of a smooth quadratic sigma-peak maximum.
 *
 *   imp-35411 measured this sweep (four tolerances, W(tol)/sqrt(tol) constant to 6+ sig figs) but
 *   shipped no chart, so the line-through-origin shape is not visually legible anywhere on the
 *   site.
 *
 *   Values below are baked reference literals, reproduced verbatim from the imp-35411 plateau
 *   bisection (sigmaD / plateauLo / plateauHi on the imp-3220/imp-3406 double surrogate). This
 *   module does NOT import imp-35411 or any heavier module (no fresh computation), per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35411-sigma-peak-plateau-width.js (the sqrt(tol) sweep this bakes)
 *   @see imp-35337-sigma-landmarks-double-double-certification.js (dd-certified peak value; flagged
 *        the argmax plateau as ill-conditioned)
 *   @see imp-35450-sigma-peak-curvature-direct-fd.js (direct FD curvature cross-check of the
 *        width-inferred k)
 *
 *   Ticket: imp-35482 (ux, medium). Presentation only of an already-established measurement; adds
 *   no new Lambda bound. Discharges nothing; imp-35337a stays OPEN. C_C = (1/8) sqrt(3 pi) ansatz
 *   (imp-2642/imp-2643) UNTOUCHED. NO QED. No refereed bound is changed.
 */

// -- four inherited (tol, W(tol)) points from the imp-35411 sqrt(tol) sweep, baked verbatim --
export const IMP35482_SWEEP_POINTS = Object.freeze([
  Object.freeze({ tol: 1e-4, sqrt_tol: 1e-2, width_decades: 0.15316508, width_over_sqrt_tol: 15.316508 }),
  Object.freeze({ tol: 1e-5, sqrt_tol: 3.1622776601683794e-3, width_decades: 0.04843501, width_over_sqrt_tol: 15.316494 }),
  Object.freeze({ tol: 1e-6, sqrt_tol: 1e-3, width_decades: 0.01531649, width_over_sqrt_tol: 15.316492 }),
  Object.freeze({ tol: 1e-7, sqrt_tol: 3.1622776601683794e-4, width_decades: 0.00484350, width_over_sqrt_tol: 15.316492 }),
]);

// The pinned slope (headline tol = 1e-5, matching imp-35337's 2.1e-5 below-ceiling margin scale).
export const IMP35482_SLOPE = 15.316494;

export const IMP35482_SUMMARY = Object.freeze({
  slope: IMP35482_SLOPE,
  pointCount: IMP35482_SWEEP_POINTS.length,
  maxSlopeSpread:
    Math.max(...IMP35482_SWEEP_POINTS.map((p) => p.width_over_sqrt_tol)) -
    Math.min(...IMP35482_SWEEP_POINTS.map((p) => p.width_over_sqrt_tol)),
});

export default Object.freeze({
  id: 'imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data',
  ticket: 'imp-35482',
  sources: ['imp-35411-sigma-peak-plateau-width.js'],
  points: IMP35482_SWEEP_POINTS,
  slope: IMP35482_SLOPE,
  summary: IMP35482_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35482_ASSERTIONS = [
  {
    id: 'imp35482-four-points-present',
    holds: () => IMP35482_SWEEP_POINTS.length === 4,
    why: 'The sqrt(tol) sweep this bakes spans exactly the four imp-35411 tolerances.',
  },
  {
    id: 'imp35482-points-sit-on-the-origin-line',
    holds: () =>
      IMP35482_SWEEP_POINTS.every(
        (p) => Math.abs(p.width_decades - IMP35482_SLOPE * p.sqrt_tol) / p.width_decades < 2e-6,
      ),
    why: 'Each baked (sqrt(tol), W(tol)) point must sit on the W = slope * sqrt(tol) line through the origin to within the imp-35411 measured 6+ sig fig precision.',
  },
  {
    id: 'imp35482-slope-matches-imp35411',
    holds: () => Math.abs(IMP35482_SLOPE - 15.3165) < 1e-2,
    why: 'The baked slope must reproduce the imp-35411 headline constant W(tol)/sqrt(tol) ~ 15.3165.',
  },
  {
    id: 'imp35482-slope-spread-is-tiny',
    holds: () => IMP35482_SUMMARY.maxSlopeSpread < 1e-3,
    why: 'The per-point width_over_sqrt_tol values must be constant to 6+ sig figs (quadratic-maximum signature), matching imp-35411 sqrt_tol_scaling.max_spread_across_sweep ~2e-5.',
  },
  {
    id: 'imp35482-headline-point-matches-imp35411-width-decades',
    holds: () => {
      const headline = IMP35482_SWEEP_POINTS.find((p) => p.tol === 1e-5);
      return Math.abs(headline.width_decades - 0.048435) < 1e-4;
    },
    why: 'The tol=1e-5 headline point must reproduce the imp-35411 WIDTH_DECADES ~0.048435 landmark.',
  },
];

for (const assertion of IMP35482_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data assertion failed: ${assertion.id}`);
  }
}
