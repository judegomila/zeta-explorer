/**
 * @module imp-35544-sigma-three-input-decomposition-viz-data
 * @fileoverview imp-35544 -- VIZ DATA ONLY for the imp-35475 sigma(N) three-input
 *   decomposition: sigma(N) = E_coll(N) / E(N) with E(N) = E_trunc + E_flow(N) +
 *   E_coll(N), shown as three SHARE curves (truncShare, flowShare, collShare) vs
 *   log10(N).
 *
 *   collShare IS sigma(N): it rises from N=1e4 to a flat interior PEAK near
 *   N ~ 9.2186e5 (sigma_max ~ 0.94943, imp-35337/imp-35411/imp-35470), then falls.
 *   The complementary combination (truncShare + flowShare = 1 - sigma) is the
 *   mirror-image U-SHAPE: it dips to its minimum at the same N and rises on both
 *   sides. flowShare falls monotonically throughout (E_flow is the unconditionally
 *   rigorous, least-problematic input, imp-398); truncShare rises monotonically
 *   (E_trunc = 3.06e-5, imp-2631, is a fixed floor that the shrinking E_flow/E_coll
 *   denominator eventually cannot outrun) and crosses collShare at the E_coll =
 *   E_trunc CROSSOVER landmark N ~ 3.280294e9 (imp-35337/imp-3444), where both
 *   shares sit at ~0.4995.
 *
 *   imp-35475 scoped what closing the surrogate-vs-true fidelity sub-gap
 *   (imp-35337a) for collShare would require -- it did NOT ship a chart of the
 *   decomposition itself, so the shape (hump peak vs U-shaped complement, and
 *   where the crossover sits) is not visually legible anywhere on the site.
 *
 *   Values below are baked reference literals, reproduced OFFLINE from the exact
 *   imp-35475 surrogate formulas (E_trunc = 3.06e-5 fixed floor per imp-2631;
 *   E_flow = C_F (logT0/T0) Gronwall per imp-398; E_coll = C_C sqrt(logT0/N),
 *   C_C = (1/8) sqrt(3 pi) per imp-2642/imp-2643; T0 = effectiveHeightForN(N) per
 *   the imp-327 Riemann-von Mangoldt inverse), using the SAME Newton-inversion as
 *   lambda-rh-height-mapping.js. This module does NOT import imp-35475 or
 *   lambda-rh-height-mapping.js or any heavier module (no fresh computation at
 *   page load), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35475-sigma-fidelity-closure-scope.js (the three-input surrogate map this bakes)
 *   @see imp-35337-sigma-landmarks-double-double-certification.js (dd-certified peak/crossover landmarks)
 *   @see imp-35411-sigma-peak-plateau-width.js (the flat-cap peak plateau)
 *   @see imp-3444 (E_coll = E_trunc crossover landmark)
 *
 *   Ticket: imp-35544 (ux, medium). Presentation only of an already-established
 *   decomposition; adds no new Lambda bound. Discharges nothing; imp-35337a stays
 *   OPEN. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5
 *   (imp-2631) UNTOUCHED. NO QED. No refereed bound is changed.
 */

// -- baked (log10N, truncShare, flowShare, collShare) points, offline-reproduced --
// collShare = sigma(N) = E_coll/E(N); truncShare + flowShare + collShare = 1 exactly.
export const IMP35544_SHARE_POINTS = Object.freeze([
  Object.freeze({ log10N: 4.0, truncShare: 0.002370575, flowShare: 0.09600009, collShare: 0.90162934 }),
  Object.freeze({ log10N: 4.5, truncShare: 0.00408689, flowShare: 0.07530157, collShare: 0.92061154 }),
  Object.freeze({ log10N: 5.0, truncShare: 0.007044376, flowShare: 0.05702341, collShare: 0.93593222 }),
  Object.freeze({ log10N: 5.5, truncShare: 0.01211587, flowShare: 0.04184639, collShare: 0.94603774 }),
  Object.freeze({ log10N: 5.9647, truncShare: 0.01998372, flowShare: 0.03058727, collShare: 0.94942901 }), // PEAK
  Object.freeze({ log10N: 6.0, truncShare: 0.02075482, flowShare: 0.0298376, collShare: 0.94940758 }),
  Object.freeze({ log10N: 6.5, truncShare: 0.03532295, flowShare: 0.02069419, collShare: 0.94398285 }),
  Object.freeze({ log10N: 7.0, truncShare: 0.05949216, flowShare: 0.01394624, collShare: 0.9265616 }),
  Object.freeze({ log10N: 7.5, truncShare: 0.09853052, flowShare: 0.009096123, collShare: 0.89237336 }),
  Object.freeze({ log10N: 8.0, truncShare: 0.1589242, flowShare: 0.005697568, collShare: 0.83537819 }),
  Object.freeze({ log10N: 8.5, truncShare: 0.2463531, flowShare: 0.003387653, collShare: 0.75025929 }),
  Object.freeze({ log10N: 9.0, truncShare: 0.3614129, flowShare: 0.001885403, collShare: 0.63670168 }),
  Object.freeze({ log10N: 9.5, truncShare: 0.4951473, flowShare: 0.0009703152, collShare: 0.50388236 }),
  Object.freeze({ log10N: 9.5159, truncShare: 0.4995256, flowShare: 0.0009487195, collShare: 0.49952564 }), // CROSSOVER
  Object.freeze({ log10N: 10.0, truncShare: 0.6297985, flowShare: 0.0004595189, collShare: 0.36974197 }),
  Object.freeze({ log10N: 10.5, truncShare: 0.7470719, flowShare: 0.0002013264, collShare: 0.2527268 }),
  Object.freeze({ log10N: 11.0, truncShare: 0.8369461, flowShare: 0.00008269974, collShare: 0.16297122 }),
  Object.freeze({ log10N: 11.5, truncShare: 0.8992742, flowShare: 0.00003236506, collShare: 0.1006934 }),
  Object.freeze({ log10N: 12.0, truncShare: 0.9395473, flowShare: 0.00001224145, collShare: 0.06044044 }),
  Object.freeze({ log10N: 12.5, truncShare: 0.9643837, flowShare: 0.000004523353, collShare: 0.03561179 }),
  Object.freeze({ log10N: 13.0, truncShare: 0.979257, flowShare: 0.000001644978, collShare: 0.02074136 }),
  Object.freeze({ log10N: 13.5, truncShare: 0.9880049, flowShare: 5.915618e-7, collShare: 0.0119945 }),
  Object.freeze({ log10N: 14.0, truncShare: 0.9930942, flowShare: 2.110009e-7, collShare: 0.00690563 }),
]);

// Landmark N values (imp-35337/imp-35475), given as log10(N) for chart placement.
export const IMP35544_PEAK_LOG10N = 5.9647; // N_PEAK ~ 9.2186e5 (flat-cap sigma maximum)
export const IMP35544_PEAK_SIGMA = 0.94942901;
export const IMP35544_CROSSOVER_LOG10N = 9.5159; // N_CROSS ~ 3.280294e9 (E_coll = E_trunc)
export const IMP35544_CROSSOVER_SHARE = 0.49952564;

export const IMP35544_SUMMARY = Object.freeze({
  pointCount: IMP35544_SHARE_POINTS.length,
  peakLog10N: IMP35544_PEAK_LOG10N,
  peakSigma: IMP35544_PEAK_SIGMA,
  crossoverLog10N: IMP35544_CROSSOVER_LOG10N,
  crossoverShare: IMP35544_CROSSOVER_SHARE,
  maxShareSumResidual: Math.max(
    ...IMP35544_SHARE_POINTS.map((p) => Math.abs(p.truncShare + p.flowShare + p.collShare - 1)),
  ),
});

export default Object.freeze({
  id: 'imp-35544-sigma-three-input-decomposition-viz-data',
  ticket: 'imp-35544',
  sources: ['imp-35475-sigma-fidelity-closure-scope.js', 'imp-35337-sigma-landmarks-double-double-certification.js'],
  points: IMP35544_SHARE_POINTS,
  summary: IMP35544_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35544_ASSERTIONS = [
  {
    id: 'imp35544-point-count',
    holds: () => IMP35544_SHARE_POINTS.length === 23,
    why: 'The baked grid spans log10N = 4..14 in 0.5 steps plus the two exact landmark rows (peak, crossover).',
  },
  {
    id: 'imp35544-shares-sum-to-one',
    holds: () => IMP35544_SUMMARY.maxShareSumResidual < 1e-6,
    why: 'truncShare + flowShare + collShare = E(N)/E(N) = 1 exactly at every N, since the three summands assemble the same denominator (imp-35475 Part A).',
  },
  {
    id: 'imp35544-collshare-is-a-hump-peaking-near-log10n-5-9647',
    holds: () => {
      const peak = IMP35544_SHARE_POINTS.find((p) => p.log10N === IMP35544_PEAK_LOG10N);
      const before = IMP35544_SHARE_POINTS.find((p) => p.log10N === 5.5);
      const after = IMP35544_SHARE_POINTS.find((p) => p.log10N === 6.5);
      return peak.collShare > before.collShare && peak.collShare > after.collShare;
    },
    why: 'collShare = sigma(N) must rise to a strictly interior maximum at the imp-35337/imp-35411 flat-cap peak N ~ 9.2186e5 (log10N ~ 5.9647) and fall on both sides.',
  },
  {
    id: 'imp35544-peak-sigma-matches-imp35475',
    holds: () => Math.abs(IMP35544_PEAK_SIGMA - 0.94942901) < 1e-6,
    why: 'The baked peak sigma value must reproduce imp-35475 SIGMA_PEAK ~0.94942901 (imp-35337/imp-3406/imp-3444 double-certified peak).',
  },
  {
    id: 'imp35544-crossover-shares-nearly-equal',
    holds: () => {
      const cross = IMP35544_SHARE_POINTS.find((p) => p.log10N === IMP35544_CROSSOVER_LOG10N);
      return Math.abs(cross.truncShare - cross.collShare) < 1e-3;
    },
    why: 'At the E_coll = E_trunc crossover landmark (imp-35337/imp-3444), truncShare and collShare must sit at ~0.4995 each, matching the imp-35475 CROSS_REPRODUCES check.',
  },
  {
    id: 'imp35544-flowshare-monotonically-decreasing',
    holds: () =>
      IMP35544_SHARE_POINTS.every(
        (p, i) => i === 0 || p.flowShare <= IMP35544_SHARE_POINTS[i - 1].flowShare,
      ),
    why: 'E_flow (imp-398, unconditionally rigorous) is the least-problematic input and its share falls monotonically across the whole grid -- it never re-rises.',
  },
];

for (const assertion of IMP35544_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35544-sigma-three-input-decomposition-viz-data assertion failed: ${assertion.id}`);
  }
}
