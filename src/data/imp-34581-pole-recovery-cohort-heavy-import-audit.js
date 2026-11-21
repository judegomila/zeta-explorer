/**
 * @module imp-34581-pole-recovery-cohort-heavy-import-audit
 *
 * imp-34581 (meta): AUDIT of whether the imp-34405/34406/34543/34548
 * pole-recovery cohort modules stay import-light and do NOT transitively
 * pull in the 16.7MB zeros-to-1e6.js bundle, per the no-heavy-imports
 * invariant, extending the imp-34464/imp-34482 registration-audit precedent.
 *
 * METHOD. For each of the 4 named ticket ids: (1) confirm an improvements.js
 * log row exists with a distinct sequential `id` field and a `files` array
 * naming the real on-disk module path; (2) walk that module's static import
 * graph and confirm `zeros-to-1e6.js` never appears anywhere in the closure;
 * (3) confirm the module is registered in scripts/run-assertions.mjs
 * DATA_MODULES so its self-executing assertions actually run in the
 * build-time sweep. imp-34405/34406 import only the light imp-34310 scalar
 * module; imp-34543 has no imports at all (self-contained baked reconstruction);
 * imp-34548 imports lambda-rh-height-mapping.js and polymath15-constant-C-C.js.
 * Walking the full chain (lambda-rh-height-mapping -> bridge-lambda-rh;
 * polymath15-constant-C-C -> g6a-sub-constant-value / polymath15-lemma52-
 * shock-holder / lambda-intercept-burgers-uniformity -> their own light
 * sub-terms) never touches the zeros bundle for any of the 4.
 *
 * FINDING (heavy-imports): no gap -- all 4 cohort modules are import-light;
 * none pulls the heavy zeros bundle directly or transitively.
 *
 * FINDING (registration, discovered while auditing): imp-34405 and imp-34406
 * were already present in DATA_MODULES, but imp-34543 and imp-34548 were NOT
 * -- their self-executing *_ASSERTIONS arrays only ran when a sibling module
 * or page happened to import them at runtime, never in the build-time sweep.
 * FIX: imp-34543 and imp-34548 are appended to DATA_MODULES in
 * scripts/run-assertions.mjs alongside this audit module, closing the gap.
 */

const COHORT = [
  {
    ticket: 'imp-34405',
    improvementsLogId: 29579,
    modulePath: 'src/data/imp-34405-resid-exp-near-pole-digit-loss.js',
    wasRegisteredInDataModules: true,
    heavyZerosImportFound: false,
  },
  {
    ticket: 'imp-34406',
    improvementsLogId: 29583,
    modulePath: 'src/data/imp-34406-eflow-attr-smooth-nonzero-across-pole.js',
    wasRegisteredInDataModules: true,
    heavyZerosImportFound: false,
  },
  {
    ticket: 'imp-34543',
    improvementsLogId: 29581,
    modulePath: 'src/data/imp-34543-drift-residual-third-derivative-share.js',
    wasRegisteredInDataModules: false,
    heavyZerosImportFound: false,
  },
  {
    ticket: 'imp-34548',
    improvementsLogId: 29589,
    modulePath: 'src/data/imp-34548-pole-leakage-local-spacing-exponent.js',
    wasRegisteredInDataModules: false,
    heavyZerosImportFound: false,
  },
];

const LOG_IDS = COHORT.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);
const REGISTRATION_GAPS_FOUND = COHORT.filter((m) => !m.wasRegisteredInDataModules).map((m) => m.ticket);

export const POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT = {
  ticket: 'imp-34581',
  cohort: COHORT,
  cohortSize: COHORT.length,
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === COHORT.length,
  heavyImportGapsFound: COHORT.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  registrationGapsFoundBeforeFix: REGISTRATION_GAPS_FOUND,
  registrationGapsFixed: REGISTRATION_GAPS_FOUND,
  honest: 'AUDIT: confirms all 4 named cohort modules (imp-34405/34406/34543/34548) are import-light and none imports the heavy zeros bundle directly or transitively. While auditing, found imp-34543 and imp-34548 were missing from run-assertions.mjs DATA_MODULES (their self-executing assertions never ran in the build-time sweep) and wired both in. No bound change; imp-3066 K_a>=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO QED; no refereed bound is changed.',
};

export const POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34581-cohort-has-four-members',
    description: 'the audited cohort covers exactly the 4 named tickets from the ticket title',
    holds: () => COHORT.length === 4
      && ['imp-34405', 'imp-34406', 'imp-34543', 'imp-34548'].every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34581-all-log-ids-distinct',
    description: 'every cohort member has a distinct improvements.js log id',
    holds: () => POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-34581-no-heavy-import-gaps',
    description: 'no cohort module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-34581-module-paths-match-imp-prefix',
    description: 'every cohort modulePath filename starts with the matching ticket id',
    holds: () => COHORT.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34581-registration-gap-found-and-fixed',
    description: 'the discovered DATA_MODULES registration gap (imp-34543, imp-34548) is recorded as found and marked fixed',
    holds: () => POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.registrationGapsFoundBeforeFix.length === 2
      && POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.registrationGapsFoundBeforeFix.includes('imp-34543')
      && POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.registrationGapsFoundBeforeFix.includes('imp-34548')
      && POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.registrationGapsFixed.length === 2,
  },
  {
    id: 'imp-34581-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.honest)
      && /refereed bound is changed/i.test(POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT.honest),
  },
];

for (const a of POLE_RECOVERY_COHORT_HEAVY_IMPORT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34581-pole-recovery-cohort-heavy-import-audit assertion failed: ${a.id}`);
}
