/**
 * @module imp-95754-cf-wedge-depth-vs-multiplier-viz-data
 * @fileoverview imp-95754 -- lightweight viz-data module for the imp-95617 /
 *   imp-95691 / imp-95721 cohort: plots the box-min gap minGap (over the
 *   +/-50% (C_C, E_trunc) band) as a function of the honest C_F multiplier
 *   cf, from the nominal cf=1 point through the imp-95691 pinned
 *   geometric-mean lane to the imp-95721 density-weighted physical-cutoff
 *   band, showing a single monotone-deepening curve with a fixed wedge
 *   corner.
 *
 *   Baked literals reproduced from the imp-95617/imp-95691/imp-95721 tables
 *   (no re-derivation, no fresh quadrature, no heavy imports). Viz data
 *   only; changes no bound; no QED.
 *
 * @see imp-95617-transition-knee-ordering-joint-2d.js (nominal box-min gap -0.004682 at cf=1)
 * @see imp-95691-cf-band-hi-pinned-wedge-opening.js (pinned geom-mean lane cf 1.2/1.29615/1.4)
 * @see imp-95721-cf-alpha-weight-density-pinned.js (density-weighted physical-cutoff r_eff band)
 * @see imp-95747-cf-reff-gue-repulsion-regularization.js (GUE-saturated converged r_eff=9.5831x, minGap -0.184642)
 */

// Baked landmark points (cf multiplier, box-min gap), sorted ascending in cf. Every gap is
// evaluated at the SAME fixed wedge corner (C_C 0.5x, E_trunc 1.5x); see @see modules above.
export const IMP95754_WEDGE_DEPTH_CURVE = Object.freeze([
  Object.freeze({ cf: 1.0, minGap: -0.004682, label: 'nominal', source: 'imp-95617' }),
  Object.freeze({ cf: 1.2, minGap: -0.010441, label: 'imp-95691 conservative floor', source: 'imp-95691' }),
  Object.freeze({ cf: 1.29615, minGap: -0.013188, label: 'imp-95691 pinned geom-mean', source: 'imp-95691' }),
  Object.freeze({ cf: 1.4, minGap: -0.016134, label: 'imp-95691 reach edge', source: 'imp-95691' }),
  Object.freeze({ cf: 2.7032, minGap: -0.0517, label: 'imp-95721 bulk edge (alpha_max=0.9)', source: 'imp-95721' }),
  Object.freeze({ cf: 6.1035, minGap: -0.129629, label: 'imp-95721 c=10 spacings', source: 'imp-95721' }),
  Object.freeze({ cf: 6.8471, minGap: -0.143521, label: 'imp-95721 c=5 spacings', source: 'imp-95721' }),
  Object.freeze({ cf: 7.8364, minGap: -0.160179, label: 'imp-95721 c=2 spacings', source: 'imp-95721' }),
  Object.freeze({ cf: 8.5874, minGap: -0.171451, label: 'imp-95721 c=1 spacing (nearest admissible)', source: 'imp-95721' }),
  Object.freeze({ cf: 9.5831, minGap: -0.184642, label: 'imp-95747 GUE-saturated (converged)', source: 'imp-95747' }),
]);

// The wedge corner is fixed across every landmark point (imp-95617/imp-95691/imp-95721 all report
// the box-min at (C_C 0.5x, E_trunc 1.5x); the corner never migrates as cf rises).
export const IMP95754_WEDGE_CORNER = Object.freeze({ cC_mult: 0.5, eTrunc_mult: 1.5 });

const NOMINAL_GAP = IMP95754_WEDGE_DEPTH_CURVE[0].minGap;

// Deepening factor relative to the nominal cf=1 depth, for the annotation table.
export const IMP95754_DEEPEN_FACTORS = Object.freeze(
  IMP95754_WEDGE_DEPTH_CURVE.map((p) => Object.freeze({ ...p, deepenFactor: +(p.minGap / NOMINAL_GAP).toFixed(2) })),
);

export const IMP95754_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-measured imp-95617/imp-95691/imp-95721/imp-95747 ' +
  'box-min gap values, not a new measurement. The curve shows minGap deepening monotonically from -0.004682 ' +
  '(nominal cf=1) to -0.184642 (imp-95747 GUE-saturated converged r_eff=9.5831x, ~39.4x deeper) as the ' +
  'honest C_F provenance multiplier cf rises; the box-min corner stays fixed at (C_C 0.5x, E_trunc 1.5x) ' +
  'throughout. Model seam family only; introduces no new cited input and changes no bound; no refereed bound is changed' +
  '. No QED.';

export const IMP95754_CF_WEDGE_DEPTH_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95754-ten-landmark-points-sorted-by-cf',
    description: 'the curve has 10 landmark points strictly increasing in cf',
    holds: () =>
      IMP95754_WEDGE_DEPTH_CURVE.length === 10 &&
      IMP95754_WEDGE_DEPTH_CURVE.every((p, i) => i === 0 || p.cf > IMP95754_WEDGE_DEPTH_CURVE[i - 1].cf),
  },
  {
    id: 'imp95754-mingap-monotone-deepening',
    description: 'minGap strictly decreases (more negative) as cf increases across all 10 points',
    holds: () =>
      IMP95754_WEDGE_DEPTH_CURVE.every((p, i) => i === 0 || p.minGap < IMP95754_WEDGE_DEPTH_CURVE[i - 1].minGap),
  },
  {
    id: 'imp95754-endpoints-match-source-modules',
    description: 'nominal cf=1 matches imp-95617 (-0.004682); densest cf=9.5831 matches imp-95747 GUE-saturated (-0.184642)',
    holds: () =>
      Math.abs(IMP95754_WEDGE_DEPTH_CURVE[0].minGap - -0.004682) < 1e-9 &&
      Math.abs(IMP95754_WEDGE_DEPTH_CURVE[IMP95754_WEDGE_DEPTH_CURVE.length - 1].minGap - -0.184642) < 1e-9,
  },
  {
    id: 'imp95754-deepen-factor-endpoint-is-39p4x',
    description: 'the deepen factor at the densest point is ~39.4x the nominal depth',
    holds: () => {
      const last = IMP95754_DEEPEN_FACTORS[IMP95754_DEEPEN_FACTORS.length - 1];
      return Math.abs(last.deepenFactor - 39.4) < 0.05;
    },
  },
  {
    id: 'imp95754-corner-is-fixed-low-cC-high-eTrunc',
    description: 'the wedge corner is (C_C 0.5x, E_trunc 1.5x), the same corner reported by every source module',
    holds: () => IMP95754_WEDGE_CORNER.cC_mult === 0.5 && IMP95754_WEDGE_CORNER.eTrunc_mult === 1.5,
  },
  {
    id: 'imp95754-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95754_CAVEAT_BANNER) && /No QED/.test(IMP95754_CAVEAT_BANNER),
  },
];

for (const a of IMP95754_CF_WEDGE_DEPTH_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95754-cf-wedge-depth-vs-multiplier-viz-data assertion failed: ${a.id}`);
  }
}
