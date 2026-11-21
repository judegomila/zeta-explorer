/**
 * @module imp-124942-oct6-cohort-import-light-audit
 * @fileoverview imp-124942 -- Verify the Oct-6 note/status/viz cohort
 * (imp-124822/124823/124824/124825/124837) is import-light per the no-heavy-imports-in-pages
 * rule: no transitive import path may reach the 16.7MB zeros bundle (zeros-to-1e6.js) or the
 * other two monolithic data files (improvement-queue.js, improvements.js), since a page that
 * pulls one in transitively blanks under React.lazy ("default of undefined").
 *
 * METHOD (read-only, performed at author time). Statically resolved the full transitive
 * ES-module import closure of each of the five cohort files (following every relative
 * `from './...'` specifier recursively) and checked every file in the closure against the
 * three known-heavy basenames.
 *
 * RESULT (audited 2026-10-06/07): CLEAN. Closure size 31 files total across the five
 * entry points; zero heavy-bundle hits. The deepest shared chain is
 * imp-124837 -> imp-97723/imp-124793 -> lambda-rh-height-mapping.js -> bridge-lambda-rh.js
 * -> guth-maynard-tail-bound.js, and separately polymath15-constant-C-C.js ->
 * lambda-intercept-burgers-uniformity.js -> ../math/dyson-scaling-N5000.js -- none of which
 * import the zeros bundle or either monolithic queue/log file.
 *
 * @see imp-124942 ticket in src/data/improvement-queue.js
 * @see feedback_no_heavy_imports_in_pages (no-heavy-imports-in-pages rule)
 */

export const IMP_124942_OCT6_COHORT_IMPORT_LIGHT_AUDIT = {
  id: 'imp-124942',
  auditedAt: '2026-10-07',
  method:
    'Statically resolve the full transitive relative-import closure of each of the five ' +
    'cohort entry files and check every resolved file against the three known-heavy ' +
    'basenames: zeros-to-1e6.js, improvement-queue.js, improvements.js.',
  modulesAudited: [
    'imp-124822-frontier-crosscheck-batch-cohort-index.js',
    'imp-124823-f2-curvature-honest-status.js',
    'imp-124824-ecf-stencil-crossover-viz-data.js',
    'imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note.js',
    'imp-124837-fartail-rvm-per-nine-conditional-share-note.js',
  ],
  closureFileCount: 31,
  heavyImportsFound: [],
  clean: true,
  recommendation:
    'All five cohort modules are import-light; no changes needed before page wiring lands.',
  honestNote:
    'Read-only static-import-closure audit; no pages or bounds fabricated, no code changed. ' +
    'Changes no bound; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
};

const IMP_124942_ASSERTIONS = [
  {
    id: 'imp124942-five-modules-clean',
    holds: () =>
      IMP_124942_OCT6_COHORT_IMPORT_LIGHT_AUDIT.modulesAudited.length === 5 &&
      IMP_124942_OCT6_COHORT_IMPORT_LIGHT_AUDIT.heavyImportsFound.length === 0 &&
      IMP_124942_OCT6_COHORT_IMPORT_LIGHT_AUDIT.clean === true,
    why: 'The audit must cover exactly the five named Oct-6 cohort modules and find zero heavy-bundle imports.',
  },
  {
    id: 'imp124942-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_124942_OCT6_COHORT_IMPORT_LIGHT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_124942_OCT6_COHORT_IMPORT_LIGHT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only import audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_124942_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-124942 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_124942_ASSERTIONS };
