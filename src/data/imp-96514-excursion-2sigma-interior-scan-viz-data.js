/**
 * @module imp-96514-excursion-2sigma-interior-scan-viz-data
 *
 * imp-96514 (ux): import-light viz-data leaf for the imp-96493 interior-height 2-sigma
 * scan. imp-96493 evaluated the imp-96089/imp-96452 dip z-score z(T) at every unclipped
 * interior height T > 1.5e5 the existing 10^6 Odlyzko ordinates reach, asking whether any
 * of them already realizes imp-96452 lever (b): a comparably-deep-or-deeper below-envelope
 * excursion at a higher unclipped height. It shipped only a baked object, no chart. This
 * module reshapes the ten-candidate scan plus the T=1.5e5 reference point into a plot-ready
 * point series so the "no candidate reaches z=2, the deepest is z=1.0358" verdict can be
 * read visually against the reference excursion and the clip threshold.
 *
 * No re-derivation: every Tc, z, relErr, nW, isDip and clipped value is copied verbatim
 * from IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN (imp-96493). The only new arithmetic here is
 * merging the reference point into the plotted series and deriving each point's marker
 * category (clean interior candidate / clipped-ceiling / reference). Changes no bound;
 * establishes no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96493-excursion-2sigma-interior-scan.js (the source object this reshapes)
 * @see imp-96452-excursion-confidence-2sigma-reach (names lever b, the T=1.5e5 reference)
 *
 * Ticket: imp-96514 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no
 * bound; NO QED. No self-executing assertion throw (per the imp-96294 convention) -- values
 * are validated below via a plain exported check object instead of an import-time throw.
 */

import { IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN as SRC } from './imp-96493-excursion-2sigma-interior-scan.js';

const markerFor = (r) => {
  if (r.clipped) return 'clipped-ceiling';
  if (r.isDip) return 'clean-interior-dip';
  return 'above-envelope-interior';
};

export const IMP96514_SCAN_POINTS = SRC.scan.map((r) => ({
  Tc: r.Tc,
  z: r.z,
  isDip: r.isDip,
  clipped: r.clipped,
  cleanInteriorCandidate: r.cleanInteriorCandidate,
  marker: markerFor(r),
}));

export const IMP96514_REFERENCE_POINT = Object.freeze({
  Tc: SRC.reference.Tc, // 1.5e5
  z: SRC.reference.z, // ~1.9234
  relErr: SRC.reference.relErr,
  nW: SRC.reference.nW,
  marker: 'reference-excursion',
});

export const IMP96514_LANDMARKS = Object.freeze({
  tClip: SRC.anchors.T_clip, // ~4.6175e5
  zTwoSigmaTarget: 2.0,
  deepestInteriorTc: SRC.deepestInteriorDip.Tc, // 3.879e5
  deepestInteriorZ: SRC.deepestInteriorDip.z, // ~1.0358
  referenceZ: SRC.reference.z, // ~1.9234
  anyInteriorHeightReachesTwoSigma: SRC.anyInteriorHeightReachesTwoSigma, // false
});

export const IMP96514_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every Tc, z, relErr, '
  + 'nW, isDip and clipped value plotted here is copied verbatim from the imp-96493 baked '
  + 'scan object; the only new step is merging the T=1.5e5 reference point into the series '
  + 'and labelling each point clean-interior-dip / clipped-ceiling / above-envelope-interior. '
  + 'This is a measurement/accuracy audit of imp-96452 lever (b) reach, not a new bound: no '
  + 'unclipped interior height above 1.5e5 reaches the z=2 target, the deepest clean dip is '
  + 'z=1.0358 at T=3.879e5 (~54% of the reference), and the T=1.5e5 excursion remains the '
  + 'global deepest below-envelope dip in the fixed 10^6-ordinate set. Changes no bound, '
  + 'establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96514_VALIDATION = Object.freeze({
  tenScanPointsPresent: IMP96514_SCAN_POINTS.length === 10,
  referencePointAboveAllScanZ: IMP96514_SCAN_POINTS.every((p) => p.z <= IMP96514_REFERENCE_POINT.z),
  noScanPointReachesTwoSigma: IMP96514_SCAN_POINTS.every((p) => p.z < 2.0),
  deepestInteriorMatchesLandmark:
    IMP96514_SCAN_POINTS
      .filter((p) => p.cleanInteriorCandidate)
      .reduce((best, p) => (p.z > best ? p.z : best), -Infinity) === IMP96514_LANDMARKS.deepestInteriorZ,
  clippedPointsAreTwo: IMP96514_SCAN_POINTS.filter((p) => p.clipped).length === 2,
});
