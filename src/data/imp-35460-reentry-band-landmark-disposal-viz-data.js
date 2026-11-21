/**
 * @module imp-35460-reentry-band-landmark-disposal-viz-data
 * @fileoverview imp-35460 -- VIZ DATA ONLY for the imp-35415 reentry-band five-landmark
 *   DISPOSAL SPLIT under the imp-35356 route (ii) pure-artifact disposal: two absolute-coordinate
 *   landmarks (reentry edge 10^27.08, exit edge 10^37.17) are ARTIFACT-LABELED / demoted to
 *   machine-precision surrogate coordinates, while three floor-structural diagnostics (the
 *   ~10.08-decade width, the imp-35332 drift-integral self-consistency, and the imp-35263
 *   co-moving-vs-fixed window) SURVIVE as legitimate surrogate-map descriptors.
 *
 *   imp-35415 scoped this split in prose/data form but shipped no chart, so the 2-vs-3
 *   demoted/surviving disposal is not visually legible anywhere on the site.
 *
 *   Values below are baked reference literals, reproduced verbatim from the imp-35415
 *   LANDMARKS table. This module does NOT import imp-35415 or any heavier module (no fresh
 *   computation), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35415-reentry-band-landmark-disposal-scope.js (the five-landmark scoping this bakes)
 *   @see imp-35356-r1-candidate-routes-assessment.js (route ii disposal direction)
 *   @see imp-35243-reentry-band-surrogate-fidelity-assessment.js (D1 floor-sensitivity origin)
 *   @see imp-35332-reentry-band-drift-analytic-derivation.js (drift-integral self-consistency landmark)
 *   @see imp-35263-reentry-band-eps-floor-sweep.js (co-moving vs fixed window landmark)
 *
 *   Ticket: imp-35460 (ux, medium). Presentation only of an already-established scoping; adds
 *   no new Lambda bound. Discharges nothing; imp-35243a stays OPEN. C_mb GUE-conditional per
 *   imp-486 UNTOUCHED. NO QED. No refereed bound is changed.
 */

// -- five inherited reentry-band landmarks, classified under the imp-35356 route (ii) disposal --
export const IMP35460_LANDMARKS = Object.freeze([
  Object.freeze({
    id: 'reentry-edge',
    label: 'reentry edge',
    value: 27.084691,
    unit: 'log10 N',
    demoted: true,
    classification: 'ARTIFACT-LABELED',
  }),
  Object.freeze({
    id: 'exit-edge',
    label: 'exit edge',
    value: 37.167107,
    unit: 'log10 N',
    demoted: true,
    classification: 'ARTIFACT-LABELED',
  }),
  Object.freeze({
    id: 'band-width',
    label: 'band width',
    value: 10.08,
    unit: 'decades',
    demoted: false,
    classification: 'SURVIVING',
  }),
  Object.freeze({
    id: 'drift-self-consistency',
    label: 'imp-35332 drift-integral self-consistency',
    value: null,
    unit: null,
    demoted: false,
    classification: 'SURVIVING',
  }),
  Object.freeze({
    id: 'comoving-vs-fixed',
    label: 'imp-35263 co-moving vs fixed window',
    value: null,
    unit: null,
    demoted: false,
    classification: 'SURVIVING',
  }),
]);

export const IMP35460_SUMMARY = Object.freeze({
  demotedCount: IMP35460_LANDMARKS.filter((l) => l.demoted).length,
  survivingCount: IMP35460_LANDMARKS.filter((l) => !l.demoted).length,
  totalCount: IMP35460_LANDMARKS.length,
});

export default Object.freeze({
  id: 'imp-35460-reentry-band-landmark-disposal-viz-data',
  ticket: 'imp-35460',
  sources: ['imp-35415-reentry-band-landmark-disposal-scope.js'],
  landmarks: IMP35460_LANDMARKS,
  summary: IMP35460_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35460_ASSERTIONS = [
  {
    id: 'imp35460-five-landmarks-present',
    holds: () => IMP35460_LANDMARKS.length === 5,
    why: 'The disposal split must cover exactly the five imp-35415 inherited landmarks.',
  },
  {
    id: 'imp35460-two-demoted-three-surviving',
    holds: () =>
      IMP35460_SUMMARY.demotedCount === 2 &&
      IMP35460_SUMMARY.survivingCount === 3 &&
      IMP35460_SUMMARY.demotedCount + IMP35460_SUMMARY.survivingCount === IMP35460_SUMMARY.totalCount,
    why: 'imp-35415: exactly the two absolute edge positions demote (artifact); the other three floor-structural diagnostics survive.',
  },
  {
    id: 'imp35460-demoted-set-is-the-two-edges',
    holds: () =>
      IMP35460_LANDMARKS.filter((l) => l.demoted)
        .map((l) => l.id)
        .sort()
        .join(',') === 'exit-edge,reentry-edge',
    why: 'The demoted set must be exactly reentry-edge and exit-edge, matching the imp-35415 classification.',
  },
  {
    id: 'imp35460-edge-values-match-imp35415',
    holds: () => {
      const reentry = IMP35460_LANDMARKS.find((l) => l.id === 'reentry-edge');
      const exit = IMP35460_LANDMARKS.find((l) => l.id === 'exit-edge');
      const width = IMP35460_LANDMARKS.find((l) => l.id === 'band-width');
      return (
        Math.abs(reentry.value - 27.084691) < 1e-6 &&
        Math.abs(exit.value - 37.167107) < 1e-6 &&
        Math.abs(width.value - (exit.value - reentry.value)) < 0.01
      );
    },
    why: 'The baked edge/width literals must reproduce the imp-35415 REENTRY_EXP/EXIT_EXP/BAND_WIDTH_DECADES constants.',
  },
  {
    id: 'imp35460-all-classifications-consistent-with-demoted-flag',
    holds: () =>
      IMP35460_LANDMARKS.every(
        (l) =>
          (l.demoted && l.classification === 'ARTIFACT-LABELED') ||
          (!l.demoted && l.classification === 'SURVIVING'),
      ),
    why: 'Each landmark classification string must agree with its demoted boolean (no silent drift between the two fields).',
  },
];

for (const assertion of IMP35460_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35460-reentry-band-landmark-disposal-viz-data assertion failed: ${assertion.id}`);
  }
}
