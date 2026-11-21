/**
 * @module imp-34514-coupling-ratio-1overlogT0-fit-viz-data
 * @fileoverview imp-34514 -- VIZ DATA ONLY for the imp-34487 coupling-ratio five-landmark
 *   1/log T0 fit, showing the excess-above-2 decaying toward the finite limit 2.
 *
 *   imp-34487 added a fifth, hyper-deep landmark (thr=0.0001) to the imp-34372/imp-34447
 *   coupling-ratio ladder and fit the excess-above-2 sequence against x = 1/log T0. As shallow
 *   landmarks are dropped from the fit window, the intercept collapses toward zero and the
 *   slope tightens toward 2 -- the signature of an exact leading correction
 *   coupling ~ 2 + 2/log T0, so the finite limit is the LEADING value 2 (not the imp-34447
 *   qualitative "~2.05"), approached from above as ~2/log T0.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34487 module's
 *   IMP34487_LANDMARKS and IMP34487_LIMIT_FITS exports (direct re-statement, not re-derived
 *   here). This module does NOT import lambda-rh-height-mapping.js or the zeros bundle -- no
 *   fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34487-coupling-ratio-1overlogT0-limit.js (source measurement: five-landmark ladder + fit)
 *   @see imp-34456-coupling-ratio-drift-ladder-viz-data.js (earlier four-landmark ladder viz)
 *
 *   Ticket: imp-34514 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED.
 *   No refereed bound is changed.
 */

// -- five-landmark ladder: logT0, coupling ratio, and its excess above the leading value 2 --
export const IMP34514_LANDMARKS = Object.freeze([
  Object.freeze({ landmark: 'Halving (thr=0.5)', thr: 0.5, logT0: 20.8538, coupling_ratio: 2.089015, excess_above_two: 0.089015, inv_logT0: 1 / 20.8538 }),
  Object.freeze({ landmark: 'Far-tail (thr=0.1)', thr: 0.1, logT0: 25.2251, coupling_ratio: 2.078776, excess_above_two: 0.078776, inv_logT0: 1 / 25.2251 }),
  Object.freeze({ landmark: 'Deep-tail (thr=0.01)', thr: 0.01, logT0: 30.0010, coupling_ratio: 2.066432, excess_above_two: 0.066432, inv_logT0: 1 / 30.0010 }),
  Object.freeze({ landmark: 'Ultra-deep-tail (thr=0.001)', thr: 0.001, logT0: 34.6104, coupling_ratio: 2.057639, excess_above_two: 0.057639, inv_logT0: 1 / 34.6104 }),
  Object.freeze({ landmark: 'Hyper-deep-tail (thr=0.0001)', thr: 0.0001, logT0: 39.2070, coupling_ratio: 2.050855, excess_above_two: 0.050855, inv_logT0: 1 / 39.2070 }),
]);

// -- 1/logT0 decay fit windows: excess = c0 + c1*(1/logT0); finite limit = 2 + c0 --
export const IMP34514_LIMIT_FITS = Object.freeze([
  Object.freeze({ window: 'all 5 landmarks', n: 5, c0: 0.008106, c1_slope: 1.723562, r2: 0.988725, limit: 2.008106 }),
  Object.freeze({ window: 'deep 4 (drop thr=0.5)', n: 4, c0: 0.000563, c1_slope: 1.974097, r2: 0.999973, limit: 2.000563 }),
  Object.freeze({ window: 'deep 3 (thr<=0.01)', n: 3, c0: 0.000120, c1_slope: 1.989766, r2: 0.999990, limit: 2.000120 }),
]);

export const IMP34514_SUMMARY = Object.freeze({
  limit_band_lo: 2.000120,
  limit_band_hi: 2.008106,
  limit_band_midpoint: 2.004113,
  finite_limit_is_leading_value_two: true,
  imp34447_2p05_revised_to_two_from_above: true,
});

export default Object.freeze({
  id: 'imp-34514-coupling-ratio-1overlogT0-fit-viz-data',
  ticket: 'imp-34514',
  source: 'imp-34487-coupling-ratio-1overlogT0-limit.js',
  landmarks: IMP34514_LANDMARKS,
  limitFits: IMP34514_LIMIT_FITS,
  summary: IMP34514_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34514_ASSERTIONS = [
  {
    id: 'imp34514-five-landmarks-decreasing-thr',
    holds: () => {
      const r = IMP34514_LANDMARKS;
      return (
        r.length === 5 &&
        r[0].thr === 0.5 && r[1].thr === 0.1 && r[2].thr === 0.01 &&
        r[3].thr === 0.001 && r[4].thr === 0.0001
      );
    },
    why: 'The ladder must be exactly {0.5, 0.1, 0.01, 0.001, 0.0001} in decreasing-thr order (imp-34487).',
  },
  {
    id: 'imp34514-excess-decays-monotonically',
    holds: () => {
      const r = IMP34514_LANDMARKS;
      return (
        r.every((x) => x.excess_above_two > 0 && x.excess_above_two < 0.1) &&
        r[0].excess_above_two > r[1].excess_above_two &&
        r[1].excess_above_two > r[2].excess_above_two &&
        r[2].excess_above_two > r[3].excess_above_two &&
        r[3].excess_above_two > r[4].excess_above_two
      );
    },
    why: 'The excess above 2 must stay positive (< 10%) at all five landmarks and decay monotonically as logT0 grows.',
  },
  {
    id: 'imp34514-fit-limit-collapses-toward-two',
    holds: () => {
      const f = IMP34514_LIMIT_FITS;
      return (
        f.length === 3 &&
        f.every((x) => x.r2 > 0.98 && x.limit > 2 && x.limit < 2.01) &&
        f[2].r2 > f[0].r2 &&
        f[2].c0 < f[0].c0 &&
        Math.abs(f[2].c1_slope - 2) < Math.abs(f[0].c1_slope - 2)
      );
    },
    why: 'Dropping shallow landmarks must improve R^2, collapse the intercept toward 0, and tighten the slope toward 2 -- the signature of the exact leading correction coupling ~ 2 + 2/logT0.',
  },
  {
    id: 'imp34514-limit-band-brackets-two',
    holds: () => {
      const s = IMP34514_SUMMARY;
      return (
        s.limit_band_lo > 2 && s.limit_band_lo < 2.001 &&
        s.limit_band_hi > 2 && s.limit_band_hi < 2.01 &&
        s.finite_limit_is_leading_value_two === true
      );
    },
    why: 'The limit band across all three fit windows must sit just above 2, confirming the finite limit is the leading value 2.',
  },
];

for (const assertion of IMP34514_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34514-coupling-ratio-1overlogT0-fit-viz-data assertion failed: ${assertion.id}`);
  }
}
