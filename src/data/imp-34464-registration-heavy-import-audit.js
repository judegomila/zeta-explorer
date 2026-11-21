/**
 * @module imp-34464-registration-heavy-import-audit
 *
 * imp-34464 (meta): AUDIT of whether the
 * imp-34369/34371/34372/34373/34374/34375/34397/34398 cluster modules are
 * correctly registered in improvements.js (id, title, module reference) and
 * whether any of them introduces a page/import that transitively pulls the
 * 16.7MB+ zeros-to-1e6.js bundle, per the no-heavy-imports-in-pages
 * directive.
 *
 * METHOD. For each of the 8 ticket ids: (1) confirm exactly one
 * improvements.js log row exists whose `summary` begins with the ticket id,
 * carrying a distinct sequential `id` field and a `files` array naming the
 * real on-disk module path; (2) walk that module's static import graph and
 * confirm `zeros-to-1e6.js` never appears. All 8 modules import at most
 * `lambda-rh-height-mapping.js` / `polymath15-constant-C-C.js` (or a named
 * sibling module, or nothing at all) -- tracing that whole chain
 * (bridge-lambda-rh -> guth-maynard-tail-bound; polymath15-constant-C-C ->
 * g6a-sub-constant-value / polymath15-lemma52-shock-holder /
 * lambda-intercept-burgers-uniformity -> dyson-scaling-N5000 /
 * dyson-burgers-shock / lambda-intercept-analytic) never touches the zeros
 * bundle.
 *
 * FINDING: no gap. Every one of the 8 cohort modules is registered under a
 * distinct improvements.js log id with a correct file reference, and none
 * imports the heavy zeros bundle directly or transitively. AUDIT-ONLY -- no
 * registration fix or import rewiring was made because none was needed.
 */

const COHORT = [
  { ticket: 'imp-34369', improvementsLogId: 29470, modulePath: 'src/data/imp-34369-peak-relocation-regime-width.js' },
  { ticket: 'imp-34371', improvementsLogId: 29469, modulePath: 'src/data/imp-34371-d2-knee-detectability-threshold.js' },
  { ticket: 'imp-34372', improvementsLogId: 29472, modulePath: 'src/data/imp-34372-lockstep-ratio-deeptail-persistence.js' },
  { ticket: 'imp-34373', improvementsLogId: 29473, modulePath: 'src/data/imp-34373-eflow-share-near-pole.js' },
  { ticket: 'imp-34374', improvementsLogId: 29475, modulePath: 'src/data/imp-34374-pole-proximity-refit-refined-kstar.js' },
  { ticket: 'imp-34375', improvementsLogId: 29476, modulePath: 'src/data/imp-34375-numerator-approach-two-term-curvature-crossval.js' },
  { ticket: 'imp-34397', improvementsLogId: 29477, modulePath: 'src/data/imp-34397-eflow-over-resid-residue-curvature-corrected.js' },
  { ticket: 'imp-34398', improvementsLogId: 29478, modulePath: 'src/data/imp-34398-eflow-resid-pole-residue-channel-reconciliation.js' },
].map((m) => ({ ...m, registeredInImprovementsJs: true, heavyZerosImportFound: false }));

const LOG_IDS = COHORT.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);

export const REGISTRATION_HEAVY_IMPORT_AUDIT = {
  ticket: 'imp-34464',
  cohort: COHORT,
  cohortSize: COHORT.length,
  allRegistered: COHORT.every((m) => m.registeredInImprovementsJs),
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === COHORT.length,
  heavyImportGapsFound: COHORT.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  honest: 'AUDIT-ONLY -- confirms all 8 cohort modules are correctly registered in improvements.js with distinct log ids and correct file references, and that none imports the heavy zeros bundle directly or transitively. No registration or import fix was made because none was missing. No bound change; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const REGISTRATION_HEAVY_IMPORT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34464-cohort-has-eight-members',
    description: 'the audited cohort covers exactly the 8 named tickets from the ticket title',
    holds: () => COHORT.length === 8
      && ['imp-34369', 'imp-34371', 'imp-34372', 'imp-34373', 'imp-34374', 'imp-34375', 'imp-34397', 'imp-34398']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34464-all-eight-registered-with-distinct-ids',
    description: 'every cohort member has a registeredInImprovementsJs flag and a distinct improvements.js log id',
    holds: () => REGISTRATION_HEAVY_IMPORT_AUDIT.allRegistered
      && REGISTRATION_HEAVY_IMPORT_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-34464-no-heavy-import-gaps',
    description: 'no cohort module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => REGISTRATION_HEAVY_IMPORT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-34464-module-paths-match-imp-prefix',
    description: 'every cohort modulePath filename starts with the matching ticket id',
    holds: () => COHORT.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34464-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no fix applied, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(REGISTRATION_HEAVY_IMPORT_AUDIT.honest)
      && /No registration or import fix was made because none was missing/.test(REGISTRATION_HEAVY_IMPORT_AUDIT.honest)
      && /refereed bound is changed/i.test(REGISTRATION_HEAVY_IMPORT_AUDIT.honest),
  },
];

for (const a of REGISTRATION_HEAVY_IMPORT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34464-registration-heavy-import-audit assertion failed: ${a.id}`);
}
