/**
 * @module imp-96442-viz-data-throw-anti-pattern-scan
 *
 * imp-96442 (meta, audit): SCAN the imp-96410-and-later viz-data leaves
 * (registered VISUALIZATIONS_INDEX dataModule entries in that id range) for
 * the browser-only self-executing-throw anti-pattern -- an import-time
 * `for (...) { if (!a.holds()) throw ... }` block whose failure would blank
 * the lazy-loaded page (React.lazy sees `default of undefined`) if any
 * assertion diverges only in the browser, as flagged by the imp-96294
 * pattern switch (plain exported check object instead of an import-time
 * throw).
 *
 * METHOD. Found every VISUALIZATIONS_INDEX entry with a dataModule path
 * matching imp-964[1-8]x and >= imp-96410 (five: imp-96410, imp-96413,
 * imp-96422, imp-96438, imp-96439), then read each file for a top-level
 * `for (const a of ...) { throw ... }` block outside any function. For each
 * hit, inspected whether the compared quantities are recomputed with
 * transcendental functions / derivative-sign checks near a flat extremum
 * (the fragile shape seen in the imp-96294 incident) or are exact-copy /
 * integer-count / plain-min-max checks (not fragile: IEEE754 double
 * comparison and Math.min/max are engine-independent, no reordering risk).
 *
 * FINDING: two of the five (imp-96413, imp-96438) still throw at import.
 * Neither is fragile: imp-96413's tolerance-1e-15 checks compare a value
 * against the literal source field it was copied from (diff is always
 * exactly 0, no arithmetic in between); imp-96438's tolerance-1e-12 band
 * check recomputes Math.min/Math.max over the same array whose extremes
 * back the compared imp-96105 band (plain comparisons only, no
 * transcendental functions, no near-zero derivative sign flip). The other
 * three (imp-96410 ships no assertions at all; imp-96422 and imp-96439)
 * already use the plain-exported-check-object convention. No fix applied:
 * no fragile instance found in this range.
 *
 * @see imp-96294 (pattern-switch precedent: self-executing throw -> plain exported check object)
 * @see imp-96417-viz-registration-audit (audit-module structure precedent)
 */

const SCANNED_MODULES = Object.freeze([
  {
    ticket: 'imp-96410',
    file: 'src/data/imp-96410-sigma-peak-knee-crossover-viz-data.js',
    hasImportTimeThrow: false,
    note: 'ships no *_ASSERTIONS block at all',
  },
  {
    ticket: 'imp-96413',
    file: 'src/data/imp-96413-count-model-sensitivity-ladder-viz-data.js',
    hasImportTimeThrow: true,
    note: 'tolerance-1e-15 checks diff a value against the literal source field it was copied from -- diff is always exactly 0',
    fragile: false,
  },
  {
    ticket: 'imp-96422',
    file: 'src/data/imp-96422-eflow-frac-ladder-peak-recovery-viz-data.js',
    hasImportTimeThrow: false,
    note: 'already on the imp-96294 plain-exported-check-object convention',
  },
  {
    ticket: 'imp-96438',
    file: 'src/data/imp-96438-route-m-full-ladder-viz-data.js',
    hasImportTimeThrow: true,
    note: 'tolerance-1e-12 band check recomputes Math.min/Math.max over the merged array -- plain comparisons only, no transcendental functions',
    fragile: false,
  },
  {
    ticket: 'imp-96439',
    file: 'src/data/imp-96439-three-basis-rho-crossvalidation-viz-data.js',
    hasImportTimeThrow: false,
    note: 'already on the imp-96294 plain-exported-check-object convention',
  },
]);

export const IMP96442_THROW_ANTI_PATTERN_SCAN = {
  id: 'imp-96442',
  proofSection: 'audit',
  question:
    'Do any registered viz-data leaves from imp-96410 onward still carry an import-time '
    + 'self-executing-throw block, and if so, is the throw fragile (transcendental / '
    + 'near-flat-extremum, per the imp-96294 incident) or safe (exact-copy / plain-comparison)?',
  scanned: SCANNED_MODULES,
  throwingModules: SCANNED_MODULES.filter((m) => m.hasImportTimeThrow).map((m) => m.ticket),
  fragileModules: SCANNED_MODULES.filter((m) => m.hasImportTimeThrow && m.fragile).map((m) => m.ticket),
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Of the five '
    + 'registered viz-data leaves from imp-96410 onward, two (imp-96413, imp-96438) still use '
    + 'the import-time self-executing-throw convention, but neither is fragile: both compare '
    + 'either an exact-copied literal or a plain Math.min/max recomputation, with no '
    + 'transcendental function and no near-zero derivative sign flip -- the shape that caused '
    + 'the imp-96294 browser-only blank-page incident. No fix applied. Changes no bound; NO QED; '
    + 'no refereed bound is changed.',
  citation:
    'imp-96294 (pattern-switch precedent); imp-96410, imp-96413, imp-96422, imp-96438, '
    + 'imp-96439 (scanned modules); imp-96417 (audit-module structure precedent).',
};

export const IMP96442_THROW_ANTI_PATTERN_SCAN_ASSERTIONS = [
  {
    id: 'imp96442-scanned-five-registered-leaves',
    description: 'the scan covers exactly the five registered viz-data leaves in the imp-96410+ range',
    holds: () =>
      IMP96442_THROW_ANTI_PATTERN_SCAN.scanned.length === 5
      && IMP96442_THROW_ANTI_PATTERN_SCAN.scanned.every((m) => /^imp-\d{5}$/.test(m.ticket)),
  },
  {
    id: 'imp96442-throwing-set-matches-expected',
    description: 'exactly imp-96413 and imp-96438 still carry an import-time throw',
    holds: () =>
      IMP96442_THROW_ANTI_PATTERN_SCAN.throwingModules.length === 2
      && IMP96442_THROW_ANTI_PATTERN_SCAN.throwingModules.includes('imp-96413')
      && IMP96442_THROW_ANTI_PATTERN_SCAN.throwingModules.includes('imp-96438'),
  },
  {
    id: 'imp96442-no-fragile-instance-and-no-qed',
    description: 'no fragile throwing module found (fragileModules empty); audit only, no bound changed, no QED, no refereed bound is changed',
    holds: () =>
      IMP96442_THROW_ANTI_PATTERN_SCAN.fragileModules.length === 0
      && IMP96442_THROW_ANTI_PATTERN_SCAN.isRigorous === false
      && /NO QED/.test(IMP96442_THROW_ANTI_PATTERN_SCAN.verdict)
      && /refereed bound is changed/i.test(IMP96442_THROW_ANTI_PATTERN_SCAN.verdict),
  },
];

for (const a of IMP96442_THROW_ANTI_PATTERN_SCAN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96442-viz-data-throw-anti-pattern-scan assertion failed: ${a.id}`);
  }
}
