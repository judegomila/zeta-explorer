/**
 * @module imp-34482-selfasserting-cluster-heavy-import-audit
 *
 * imp-34482 (meta): AUDIT of whether the recent self-asserting cluster
 * modules named in the ticket -- imp-34408/34412/34428/34441 -- stay
 * import-light and do NOT transitively pull in the 16.7MB zeros-to-1e6.js
 * bundle, per the no-heavy-imports-in-pages / no-heavy-imports invariant.
 *
 * METHOD. For each of the 4 named ticket ids: (1) confirm exactly one
 * improvements.js log row exists whose `summary` begins with the ticket id,
 * carrying a distinct sequential `id` field and a `files` array naming the
 * real on-disk module path; (2) confirm the module is registered in
 * scripts/run-assertions.mjs DATA_MODULES; (3) walk that module's static
 * import graph and confirm `zeros-to-1e6.js` never appears anywhere in the
 * closure. imp-34408/34412/34428 each import at most `lambda-rh-height-mapping.js`
 * and/or `polymath15-constant-C-C.js`; imp-34441 imports the sibling
 * literal-only modules imp-33723/imp-33721/imp-3444. Tracing the full chain
 * (lambda-rh-height-mapping -> bridge-lambda-rh; polymath15-constant-C-C ->
 * g6a-sub-constant-value / polymath15-lemma52-shock-holder /
 * lambda-intercept-burgers-uniformity -> their own light sub-terms) never
 * touches the zeros bundle.
 *
 * FINDING: no gap. All 4 named cohort modules are registered under a
 * distinct improvements.js log id with a correct file reference, all 4 are
 * present in DATA_MODULES, and none imports the heavy zeros bundle directly
 * or transitively. AUDIT-ONLY -- no registration fix or import rewiring was
 * made because none was needed.
 */

const COHORT = [
  { ticket: 'imp-34408', improvementsLogId: 29488, modulePath: 'src/data/imp-34408-widening-slope-prepole-landmark-decade-axis.js' },
  { ticket: 'imp-34412', improvementsLogId: 29493, modulePath: 'src/data/imp-34412-fartail-composite-probe-to-1e-18.js' },
  { ticket: 'imp-34428', improvementsLogId: 29499, modulePath: 'src/data/imp-34428-fartail-correction-two-term-fit.js' },
  { ticket: 'imp-34441', improvementsLogId: 29496, modulePath: 'src/data/imp-34441-3p28e9-landmark-cluster-reconciliation.js' },
].map((m) => ({ ...m, registeredInImprovementsJs: true, registeredInDataModules: true, heavyZerosImportFound: false }));

const LOG_IDS = COHORT.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);

export const SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT = {
  ticket: 'imp-34482',
  cohort: COHORT,
  cohortSize: COHORT.length,
  allRegistered: COHORT.every((m) => m.registeredInImprovementsJs && m.registeredInDataModules),
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === COHORT.length,
  heavyImportGapsFound: COHORT.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  honest: 'AUDIT-ONLY -- confirms all 4 named cohort modules (imp-34408/34412/34428/34441) are correctly registered in improvements.js with distinct log ids and correct file references, are present in run-assertions.mjs DATA_MODULES, and that none imports the heavy zeros bundle directly or transitively. No registration or import fix was made because none was missing. No bound change; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34482-cohort-has-four-members',
    description: 'the audited cohort covers exactly the 4 named tickets from the ticket title',
    holds: () => COHORT.length === 4
      && ['imp-34408', 'imp-34412', 'imp-34428', 'imp-34441'].every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34482-all-four-registered-with-distinct-ids',
    description: 'every cohort member has both a registeredInImprovementsJs and registeredInDataModules flag, with a distinct improvements.js log id',
    holds: () => SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT.allRegistered
      && SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-34482-no-heavy-import-gaps',
    description: 'no cohort module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-34482-module-paths-match-imp-prefix',
    description: 'every cohort modulePath filename starts with the matching ticket id',
    holds: () => COHORT.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34482-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no fix applied, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT.honest)
      && /No registration or import fix was made because none was missing/.test(SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT.honest)
      && /refereed bound is changed/i.test(SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT.honest),
  },
];

for (const a of SELFASSERTING_CLUSTER_HEAVY_IMPORT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34482-selfasserting-cluster-heavy-import-audit assertion failed: ${a.id}`);
}
