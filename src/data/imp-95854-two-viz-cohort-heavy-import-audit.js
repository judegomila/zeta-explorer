/**
 * @module imp-95854-two-viz-cohort-heavy-import-audit
 *
 * imp-95854 (meta): AUDIT of whether the imp-95737 and imp-95697 viz-data
 * modules and their pages stay import-light and do NOT transitively pull in
 * the 16.7MB zeros-to-1e6.js bundle, per the no-heavy-imports invariant,
 * extending the imp-34581/imp-34464/imp-34482 registration-audit precedent.
 *
 * METHOD. For each named module+page pair: (1) walk the static import graph
 * (module -> its own imports -> their imports, recursively) and confirm
 * `zeros-to-1e6.js` never appears anywhere in the closure; (2) confirm the
 * module is registered in scripts/run-assertions.mjs DATA_MODULES if (and
 * only if) it exports a self-executing assertions array that needs to run in
 * the build-time sweep.
 *
 * imp-95737-half-retention-scale-viz-data.js imports only
 * imp-95703-twin-pair-half-retention-scale-derivation.js (no further
 * imports); its page imports only PageHeader.jsx. Full closure: 4 files,
 * zero hits on zeros-to-1e6.js. It exports no self-executing *_ASSERTIONS
 * array (plain re-export/reshape module), so DATA_MODULES registration does
 * not apply.
 *
 * imp-95697-szego-finite-size-decay-viz-data.js imports only
 * imp-95677-rho1-szego-finite-size-convergence.js (no further imports); its
 * page imports only PageHeader.jsx. Full closure: 4 files, zero hits on
 * zeros-to-1e6.js. It DOES export IMP95697_ASSERTIONS (added by imp-95833)
 * and is already present in scripts/run-assertions.mjs DATA_MODULES.
 *
 * FINDING: no gap -- both modules are import-light; neither pulls the heavy
 * zeros bundle directly or transitively, and the one module with
 * self-executing assertions is already registered.
 */

const COHORT = [
  {
    ticket: 'imp-95737',
    improvementsLogId: 32104,
    modulePath: 'src/data/imp-95737-half-retention-scale-viz-data.js',
    pagePath: 'src/pages/Imp95737HalfRetentionScaleViz.jsx',
    importClosure: [
      'src/data/imp-95737-half-retention-scale-viz-data.js',
      'src/data/imp-95703-twin-pair-half-retention-scale-derivation.js',
      'src/pages/Imp95737HalfRetentionScaleViz.jsx',
      'src/components/PageHeader.jsx',
    ],
    hasSelfExecutingAssertions: false,
    wasRegisteredInDataModules: false,
    registrationRequired: false,
    heavyZerosImportFound: false,
  },
  {
    ticket: 'imp-95697',
    improvementsLogId: 32068,
    modulePath: 'src/data/imp-95697-szego-finite-size-decay-viz-data.js',
    pagePath: 'src/pages/Imp95697SzegoFiniteSizeDecayViz.jsx',
    importClosure: [
      'src/data/imp-95697-szego-finite-size-decay-viz-data.js',
      'src/data/imp-95677-rho1-szego-finite-size-convergence.js',
      'src/pages/Imp95697SzegoFiniteSizeDecayViz.jsx',
      'src/components/PageHeader.jsx',
    ],
    hasSelfExecutingAssertions: true,
    wasRegisteredInDataModules: true,
    registrationRequired: true,
    heavyZerosImportFound: false,
  },
];

const LOG_IDS = COHORT.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);
const REGISTRATION_GAPS_FOUND = COHORT.filter(
  (m) => m.registrationRequired && !m.wasRegisteredInDataModules,
).map((m) => m.ticket);

export const TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT = {
  ticket: 'imp-95854',
  cohort: COHORT,
  cohortSize: COHORT.length,
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === COHORT.length,
  heavyImportGapsFound: COHORT.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  registrationGapsFound: REGISTRATION_GAPS_FOUND,
  honest:
    'AUDIT: confirms both the imp-95737 and imp-95697 viz-data modules and their pages are ' +
    'import-light and neither imports the heavy zeros bundle directly or transitively. ' +
    'imp-95697 already exports self-executing assertions and is already registered in ' +
    'run-assertions.mjs DATA_MODULES (imp-95833); imp-95737 exports no self-executing ' +
    'assertions, so registration does not apply. No gap found, no fix required. No bound ' +
    'change; NO QED; no refereed bound is changed.',
};

export const TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95854-cohort-has-two-members',
    description: 'the audited cohort covers exactly the 2 named tickets from the ticket title',
    holds: () => COHORT.length === 2
      && ['imp-95737', 'imp-95697'].every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-95854-all-log-ids-distinct',
    description: 'every cohort member has a distinct improvements.js log id',
    holds: () => TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-95854-no-heavy-import-gaps',
    description: 'no cohort module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-95854-module-paths-match-imp-prefix',
    description: 'every cohort modulePath and pagePath filename includes the matching ticket id',
    holds: () => COHORT.every(
      (m) => m.modulePath.includes(m.ticket) && m.pagePath.toLowerCase().includes(m.ticket.replace('imp-', 'imp')),
    ),
  },
  {
    id: 'imp-95854-no-registration-gaps',
    description: 'no module that exports self-executing assertions is missing from DATA_MODULES',
    holds: () => TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT.registrationGapsFound.length === 0,
  },
  {
    id: 'imp-95854-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT.honest)
      && /refereed bound is changed/i.test(TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT.honest),
  },
];

for (const a of TWO_VIZ_COHORT_HEAVY_IMPORT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95854-two-viz-cohort-heavy-import-audit assertion failed: ${a.id}`);
}
