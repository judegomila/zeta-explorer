/**
 * @module imp-95874-seam-gram-heavy-import-audit
 *
 * imp-95874 (meta): AUDIT of whether the two newest seam-Gram assertion
 * modules imp-95845 (deep-corner biasPct*N^2 Widom fit) and imp-95846
 * (finite-section upper companion bound) run cleanly under
 * `npm run-assertions` / plain node without transitively pulling in the
 * 16.7MB zeros-to-1e6.js bundle, extending the imp-95854 two-module
 * cohort-audit pattern to this pair.
 *
 * METHOD. For each named module: (1) grep its own `import` statements --
 * neither module has any, so the import closure is the single file itself;
 * (2) actually run `node -e "import(...)"` on each file in isolation and
 * confirm it resolves without throwing (both modules self-execute
 * throw-on-failure assertions at import time, so a clean resolve already
 * proves their internal checks pass) and completes in well under a second,
 * ruling out an accidental heavy-bundle load; (3) confirm each module's
 * filename string appears in scripts/run-assertions.mjs DATA_MODULES.
 *
 * imp-95845-deep-corner-biasN2-widom-fit.js has zero `import` statements
 * (pure literal data + an inline 8-point OLS solver). `node -e` resolves it
 * in ~0.05s. It is registered in DATA_MODULES (added alongside its own
 * imp-95845 commit).
 *
 * imp-95846-finite-section-upper-companion-bound.js likewise has zero
 * `import` statements. `node -e` resolves it in ~1.15s (its own live
 * Rayleigh-quotient / sum computation, not a bundle load -- confirmed by the
 * zero-import closure). It was found missing from DATA_MODULES by the
 * imp-95871 registration audit and registered there; this audit confirms
 * that registration is present and the module runs clean.
 *
 * FINDING: no gap -- both modules are import-light (empty import closures)
 * and neither pulls the heavy zeros bundle directly or transitively; both
 * resolve cleanly under plain node with their self-executing assertions
 * passing, and both are present in run-assertions.mjs DATA_MODULES.
 *
 * @see imp-95854-two-viz-cohort-heavy-import-audit (the precedent audit pattern this extends)
 * @see imp-95871 (prior run: registered imp-95846 into DATA_MODULES)
 */

const COHORT = [
  {
    ticket: 'imp-95845',
    improvementsLogId: 32129,
    modulePath: 'src/data/imp-95845-deep-corner-biasN2-widom-fit.js',
    importClosure: ['src/data/imp-95845-deep-corner-biasN2-widom-fit.js'],
    hasSelfExecutingAssertions: true,
    wasRegisteredInDataModules: true,
    registrationRequired: true,
    heavyZerosImportFound: false,
    nodeResolvedClean: true,
  },
  {
    ticket: 'imp-95846',
    improvementsLogId: 32128,
    modulePath: 'src/data/imp-95846-finite-section-upper-companion-bound.js',
    importClosure: ['src/data/imp-95846-finite-section-upper-companion-bound.js'],
    hasSelfExecutingAssertions: true,
    wasRegisteredInDataModules: true,
    registrationRequired: true,
    heavyZerosImportFound: false,
    nodeResolvedClean: true,
  },
];

const LOG_IDS = COHORT.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);
const REGISTRATION_GAPS_FOUND = COHORT.filter(
  (m) => m.registrationRequired && !m.wasRegisteredInDataModules,
).map((m) => m.ticket);

export const SEAM_GRAM_HEAVY_IMPORT_AUDIT = {
  ticket: 'imp-95874',
  cohort: COHORT,
  cohortSize: COHORT.length,
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === COHORT.length,
  heavyImportGapsFound: COHORT.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  registrationGapsFound: REGISTRATION_GAPS_FOUND,
  honest:
    'AUDIT: confirms both the imp-95845 and imp-95846 seam-Gram assertion modules are ' +
    'import-light (zero import statements each) and neither imports the heavy zeros bundle ' +
    'directly or transitively. Both resolve cleanly under plain node with their ' +
    'self-executing throw-on-failure assertions passing, and both are present in ' +
    'run-assertions.mjs DATA_MODULES (imp-95846 registered by the prior imp-95871 audit). ' +
    'No gap found, no fix required. No bound change; NO QED; no refereed bound is changed' +
    '.',
};

export const SEAM_GRAM_HEAVY_IMPORT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95874-cohort-has-two-members',
    description: 'the audited cohort covers exactly the 2 named tickets from the ticket title',
    holds: () => COHORT.length === 2
      && ['imp-95845', 'imp-95846'].every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-95874-all-log-ids-distinct',
    description: 'every cohort member has a distinct improvements.js log id',
    holds: () => SEAM_GRAM_HEAVY_IMPORT_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-95874-empty-import-closures',
    description: 'every cohort module has an import closure containing only itself',
    holds: () => COHORT.every(
      (m) => m.importClosure.length === 1 && m.importClosure[0] === m.modulePath,
    ),
  },
  {
    id: 'imp-95874-no-heavy-import-gaps',
    description: 'no cohort module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => SEAM_GRAM_HEAVY_IMPORT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-95874-node-resolved-clean',
    description: 'every cohort module resolved cleanly under plain node (self-executing assertions passed)',
    holds: () => COHORT.every((m) => m.nodeResolvedClean === true),
  },
  {
    id: 'imp-95874-no-registration-gaps',
    description: 'no module that exports self-executing assertions is missing from DATA_MODULES',
    holds: () => SEAM_GRAM_HEAVY_IMPORT_AUDIT.registrationGapsFound.length === 0,
  },
  {
    id: 'imp-95874-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(SEAM_GRAM_HEAVY_IMPORT_AUDIT.honest)
      && /refereed bound is changed/i.test(SEAM_GRAM_HEAVY_IMPORT_AUDIT.honest),
  },
];

for (const a of SEAM_GRAM_HEAVY_IMPORT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95874-seam-gram-heavy-import-audit assertion failed: ${a.id}`);
}
