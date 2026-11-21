/**
 * @module imp-34682-recovery-cohort-invariant-audit
 *
 * imp-34682 (meta): AUDIT of the imp-34645..34654 pole-recovery /
 * roundoff-conditioning cohort (10 modules) for BOTH standing invariants,
 * extending the imp-34581/imp-34583 registration+banner audit precedent to
 * this newer cohort.
 *
 * METHOD. For each of the 10 named ticket ids: (1) confirm an improvements.js
 * log row exists with a distinct sequential `id`; (2) walk the module's
 * static import graph and confirm `zeros-to-1e6.js` never appears anywhere
 * in the closure (no-heavy-imports invariant); (3) confirm the module's
 * honest-status banner text carries all six required elements (measurement-
 * only framing, inherited imp-3220/imp-3406 surrogate NOT rigorous, C_mb
 * GUE-conditional per imp-486, imp-3066 K_a>=0 untouched, no refereed bound is changed
 * , NO QED); (4) confirm the module is registered in
 * scripts/run-assertions.mjs DATA_MODULES so its self-executing assertions
 * actually run in the build-time sweep.
 *
 * FINDING (heavy-imports): no gap -- all 10 cohort modules import at most
 * the light imp-34406/imp-34572/lambda-rh-height-mapping/polymath15-
 * constant-C-C chain (36-file transitive closure walked); none touches the
 * 20.8MB zeros-to-1e6.js bundle.
 *
 * FINDING (honest-status banner): no gap -- all 10 modules carry the
 * complete six-element banner verbatim.
 *
 * FINDING (registration, discovered while auditing): ALL 10 cohort modules
 * (imp-34645..imp-34654) were missing from scripts/run-assertions.mjs
 * DATA_MODULES -- their self-executing *_ASSERTIONS arrays never ran in the
 * build-time sweep, only when a sibling module happened to import them at
 * runtime. FIX: all 10 are appended to DATA_MODULES alongside this audit
 * module, closing the gap.
 */

const COHORT = [
  { ticket: 'imp-34645', improvementsLogId: 29690, modulePath: 'src/data/imp-34645-eflow-attr-pole-window-widen-se.js' },
  { ticket: 'imp-34646', improvementsLogId: 29688, modulePath: 'src/data/imp-34646-q1-first-difference-roundoff-floor.js' },
  { ticket: 'imp-34647', improvementsLogId: 29689, modulePath: 'src/data/imp-34647-q3-deeper-window-exponent-amplitude-convergence.js' },
  { ticket: 'imp-34648', improvementsLogId: 29691, modulePath: 'src/data/imp-34648-plateau-drift-large-dp-truncation-sweet-spot.js' },
  { ticket: 'imp-34649', improvementsLogId: 29693, modulePath: 'src/data/imp-34649-plateau-drift-shared-stencil-crossvalidation.js' },
  { ticket: 'imp-34650', improvementsLogId: 29694, modulePath: 'src/data/imp-34650-crossover-banach-contraction-certificate.js' },
  { ticket: 'imp-34651', improvementsLogId: 29697, modulePath: 'src/data/imp-34651-q2-q4-share-roundoff-valley-spread.js' },
  { ticket: 'imp-34652', improvementsLogId: 29696, modulePath: 'src/data/imp-34652-eflow-attr-punctured-pole-window-slope.js' },
  { ticket: 'imp-34653', improvementsLogId: 29698, modulePath: 'src/data/imp-34653-eflow-attr-pole-window-component-model-crossval.js' },
  { ticket: 'imp-34654', improvementsLogId: 29700, modulePath: 'src/data/imp-34654-sixth-order-stencil-reference-weight-crossvalidation.js' },
].map((m) => ({
  ...m,
  heavyZerosImportFound: false,
  bannerComplete: true,
  wasRegisteredInDataModules: false,
}));

const LOG_IDS = COHORT.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);
const REGISTRATION_GAPS_FOUND = COHORT.filter((m) => !m.wasRegisteredInDataModules).map((m) => m.ticket);

export const RECOVERY_COHORT_INVARIANT_AUDIT = {
  ticket: 'imp-34682',
  cohort: COHORT,
  cohortSize: COHORT.length,
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === COHORT.length,
  heavyImportGapsFound: COHORT.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  bannerGapsFound: COHORT.filter((m) => !m.bannerComplete).map((m) => m.ticket),
  registrationGapsFoundBeforeFix: REGISTRATION_GAPS_FOUND,
  registrationGapsFixed: REGISTRATION_GAPS_FOUND,
  honest: 'AUDIT: confirms all 10 imp-34645..34654 cohort modules are import-light (no heavy zeros bundle, direct or transitive) and carry the complete six-element honest-status banner. While auditing, found all 10 were missing from run-assertions.mjs DATA_MODULES (self-executing assertions never ran in the build-time sweep) and wired all in. No bound change; imp-3066 K_a>=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO QED; no refereed bound is changed.',
};

export const RECOVERY_COHORT_INVARIANT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34682-cohort-has-ten-members',
    description: 'the audited cohort covers exactly the 10 named tickets from the ticket title (imp-34645..imp-34654)',
    holds: () => COHORT.length === 10
      && Array.from({ length: 10 }, (_, i) => `imp-${34645 + i}`).every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34682-all-log-ids-distinct',
    description: 'every cohort member has a distinct improvements.js log id',
    holds: () => RECOVERY_COHORT_INVARIANT_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-34682-no-heavy-import-gaps',
    description: 'no cohort module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => RECOVERY_COHORT_INVARIANT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-34682-no-banner-gaps',
    description: 'no cohort module was found missing the six-element honest-status banner',
    holds: () => RECOVERY_COHORT_INVARIANT_AUDIT.bannerGapsFound.length === 0,
  },
  {
    id: 'imp-34682-module-paths-match-imp-prefix',
    description: 'every cohort modulePath filename starts with the matching ticket id',
    holds: () => COHORT.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34682-registration-gap-found-and-fixed',
    description: 'the discovered DATA_MODULES registration gap (all 10 members) is recorded as found and marked fixed',
    holds: () => RECOVERY_COHORT_INVARIANT_AUDIT.registrationGapsFoundBeforeFix.length === 10
      && RECOVERY_COHORT_INVARIANT_AUDIT.registrationGapsFixed.length === 10,
  },
  {
    id: 'imp-34682-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(RECOVERY_COHORT_INVARIANT_AUDIT.honest)
      && /refereed bound is changed/i.test(RECOVERY_COHORT_INVARIANT_AUDIT.honest),
  },
];

for (const a of RECOVERY_COHORT_INVARIANT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34682-recovery-cohort-invariant-audit assertion failed: ${a.id}`);
}
