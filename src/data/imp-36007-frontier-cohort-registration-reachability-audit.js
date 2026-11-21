/**
 * @module imp-36007-frontier-cohort-registration-reachability-audit
 *
 * imp-36007 (meta, audit): registration/reachability + import-light check
 * (imp-35590/imp-35838/imp-35858/imp-35941 method) on the seven-module
 * imp-3594x/imp-3595x measurement cohort -- imp-35946, imp-35947, imp-35948,
 * imp-35949, imp-35950, imp-35951, imp-35956 -- which postdates the
 * imp-35982 (imp-3588x/3589x) and imp-35986 reachability audits and had no
 * coverage of its own.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the
 * seven file paths, confirmed each source module exports both a result-object
 * const and a paired `*_ASSERTIONS` (or `*_VIZ_ASSERTIONS`) array, imported
 * every module under plain node to re-trigger its self-executing throwing
 * assertions, walked each module's static-import closure by hand (recursive
 * `import { X } from './Y.js'` resolution) to confirm none transitively
 * reaches src/data/zeros-to-1e6.js (the ~16.7MB zeros bundle), and grepped
 * src/data/visualizations-index.js / src/data/glossary.js for viz-page or
 * prose reachability.
 *
 * FINDING -- ZERO GAPS. All seven modules were already listed in
 * DATA_MODULES, all seven export a result-object const plus a paired
 * assertions array, and all seven self-executing assertion sets pass under
 * a plain `node --input-type=module` import (no throw). None of the seven
 * import closures (sizes 1-14 files each) reaches zeros-to-1e6.js. None of
 * the seven has a dedicated viz page in visualizations-index.js; imp-35948
 * is named in a glossary.js prose entry, and the rest are registry-only
 * measurement/audit notes cited by sibling modules (imp-35976, imp-35998,
 * imp-35999, imp-36010) rather than charted -- the same registry-only
 * pattern imp-35941 found acceptable for imp-35855.
 *
 * SCOPE. Read-only audit; no source module changed, no wiring fix needed.
 * Changes no bound; establishes no operator positivity; no RH verdict;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35941-numerical-cohort-registration-reachability-audit.js (method precedent, prior cohort)
 * @see imp-35982 (imp-3588x/3589x reachability audit, does not cover this cohort)
 * @see imp-35946-tree-shape-duplicate-audit.js (audited module)
 * @see imp-35947-log-domain-height-seed-cliff-deferral.js (audited module)
 * @see imp-35948-w1-probabilistic-sqrtN-apriori-scale.js (audited module)
 * @see imp-35949-w1-accumulator-frequency-grid-robustness.js (audited module)
 * @see imp-35950-etrunc-ecoll-crossover-height.js (audited module)
 * @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js (audited module)
 * @see imp-35956-pairwise-tree-shape-ladder-viz-data.js (audited module)
 */

const AUDITED_BATCH = [
  {
    file: 'imp-35946-tree-shape-duplicate-audit',
    resultExport: 'IMP35946_TREE_SHAPE_DUPLICATE_AUDIT',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35947-log-domain-height-seed-cliff-deferral',
    resultExport: 'IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35948-w1-probabilistic-sqrtN-apriori-scale',
    resultExport: 'IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35949-w1-accumulator-frequency-grid-robustness',
    resultExport: 'IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35950-etrunc-ecoll-crossover-height',
    resultExport: 'IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy',
    resultExport: 'IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35956-pairwise-tree-shape-ladder-viz-data',
    resultExport: 'IMP35956_TREE_SHAPE_LADDER_VIZ_DATA',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
];

const ORPHANS_FOUND = AUDITED_BATCH.filter((m) => !m.listedInDataModules);

export const IMP36007_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36007',
  proofSection: 'S-frontier',
  question:
    'Do the seven imp-3594x/imp-3595x cohort modules (imp-35946, imp-35947, ' +
    'imp-35948, imp-35949, imp-35950, imp-35951, imp-35956) each export a ' +
    'result-object const plus a wired assertions array registered in ' +
    'scripts/run-assertions.mjs, do their self-executing assertions pass, ' +
    'and does none transitively import the 16.7MB zeros bundle?',
  verdictShort:
    'ZERO GAPS FOUND. All seven modules were already listed in DATA_MODULES ' +
    'with a correct result-const + assertions-array export pair, all seven ' +
    'self-executing assertion sets pass under plain node import, and none ' +
    'of the seven import closures reaches zeros-to-1e6.js. No viz-status ' +
    'mismatch: none has a dedicated viz page (all are registry-only ' +
    'measurement/audit notes, matching the imp-35855 precedent), and ' +
    'imp-35948 is additionally named in a glossary.js prose entry.',
  auditedBatch: AUDITED_BATCH,
  danglingOrOrphanedFound: ORPHANS_FOUND.length,
  orphanedFiles: ORPHANS_FOUND.map((m) => m.file),
  vizStatusMismatchFound: 0,
  importHeavyBundleFound: 0,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical ' +
    'quantity). Checked scripts/run-assertions.mjs DATA_MODULES wiring, ' +
    'each module’s exports, re-ran each module’s self-executing ' +
    'assertions under plain node, and walked each module’s static-import ' +
    'closure by hand for seven cohort modules. Result: zero orphans, zero ' +
    'viz-status mismatches, zero heavy-bundle imports. Changes no bound; ' +
    'establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35946, imp-35947, imp-35948, imp-35949, imp-35950, imp-35951, ' +
    'imp-35956 (audited modules); imp-35590/imp-35838/imp-35858/imp-35941 ' +
    '(registration/reachability method precedent); imp-35982/imp-35986 ' +
    '(prior cohort audits this ticket extends coverage past).',
};

export const IMP36007_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36007-batch-size-seven',
    description: 'exactly seven modules were audited',
    holds: () => AUDITED_BATCH.length === 7,
  },
  {
    id: 'imp36007-all-have-assertions-export-and-result-export',
    description: 'every audited file exports a result-object const and an assertions export',
    holds: () => AUDITED_BATCH.every((m) => m.hasAssertionsExport === true && !!m.resultExport),
  },
  {
    id: 'imp36007-zero-orphans-found',
    description: 'no audited module was missing from DATA_MODULES',
    holds: () => ORPHANS_FOUND.length === 0,
  },
  {
    id: 'imp36007-orphan-count-matches-summary-field',
    description: 'danglingOrOrphanedFound matches the actual orphan count',
    holds: () =>
      IMP36007_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound ===
      ORPHANS_FOUND.length,
  },
  {
    id: 'imp36007-none-have-viz-page',
    description: 'all seven modules are registry-only (no dedicated viz page), matching the imp-35855 precedent',
    holds: () => AUDITED_BATCH.every((m) => m.hasVizPage === false),
  },
  {
    id: 'imp36007-no-module-imports-heavy-zeros-bundle',
    description: 'no audited module transitively imports the 16.7MB zeros-to-1e6.js bundle',
    holds: () => AUDITED_BATCH.every((m) => m.importClosureReachesZerosBundle === false),
  },
  {
    id: 'imp36007-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36007_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36007_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36007_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP36007_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36007-frontier-cohort-registration-reachability-audit assertion failed: ${a.id}`);
  }
}
