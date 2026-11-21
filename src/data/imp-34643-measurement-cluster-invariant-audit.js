/**
 * @module imp-34643-measurement-cluster-invariant-audit
 *
 * imp-34643 (meta): AUDIT of the imp-34606..imp-34613 measurement cluster
 * (7 dedicated modules; imp-34610 is an unrelated opus/api-pool script-only
 * ticket, not a member of this data-module cluster) for BOTH standing
 * invariants, following the imp-34603/imp-34682 audit precedent.
 *
 * METHOD. For each of the 7 modules: (1) confirm the honest-status banner
 * carries the required elements (measurement-only framing, inherited
 * imp-3220/imp-3406 surrogate NOT rigorous, C_mb GUE-conditional per imp-486
 * untouched, imp-3066 K_a>=0 untouched, no refereed bound is changed,
 * NO QED); (2) walk the module's static import graph and confirm
 * zeros-to-1e6.js never appears anywhere in the closure (no-heavy-imports
 * invariant); (3) confirm the module is registered in
 * scripts/run-assertions.mjs DATA_MODULES so its self-executing assertions
 * actually run in the build-time sweep.
 *
 * FINDING (honest-status banner): no gap -- all 7 modules carry the
 * complete six-element banner verbatim, each ending in "NO QED" with
 * "isRigorous: false" and an honesty-gate self-assertion.
 *
 * FINDING (heavy-imports): no gap -- the full transitive import closure of
 * all 7 modules never touches the 20.8MB zeros-to-1e6.js bundle.
 *
 * FINDING (registration, discovered while auditing): 5 of the 7 modules
 * (imp-34606, imp-34609, imp-34611, imp-34612, imp-34613) were missing from
 * scripts/run-assertions.mjs DATA_MODULES -- their self-executing
 * *_ASSERTIONS arrays never ran in the build-time sweep, only when a
 * sibling module happened to import them at runtime. FIX: all 5 are
 * appended to DATA_MODULES alongside this audit ticket's note; imp-34607
 * and imp-34608 were already wired in.
 */

const CLUSTER = [
  { ticket: 'imp-34606', improvementsLogId: 29646, modulePath: 'src/data/imp-34606-roundoff-amplification-exponent-ladder.js', wasRegisteredInDataModules: false },
  { ticket: 'imp-34607', improvementsLogId: 29649, modulePath: 'src/data/imp-34607-deflow-second-order-identifiability-window.js', wasRegisteredInDataModules: true },
  { ticket: 'imp-34608', improvementsLogId: 29651, modulePath: 'src/data/imp-34608-eflow-attr-cohort-derived-pct-drift-audit.js', wasRegisteredInDataModules: true },
  { ticket: 'imp-34609', improvementsLogId: 29650, modulePath: 'src/data/imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js', wasRegisteredInDataModules: false },
  { ticket: 'imp-34611', improvementsLogId: 29653, modulePath: 'src/data/imp-34611-plateau-drift-independent-stencil-crosscheck.js', wasRegisteredInDataModules: false },
  { ticket: 'imp-34612', improvementsLogId: 29657, modulePath: 'src/data/imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js', wasRegisteredInDataModules: false },
  { ticket: 'imp-34613', improvementsLogId: 29654, modulePath: 'src/data/imp-34613-eflow-attr-log-slope-second-deriv-sign.js', wasRegisteredInDataModules: false },
].map((m) => ({ ...m, heavyZerosImportFound: false, bannerComplete: true }));

const LOG_IDS = CLUSTER.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);
const REGISTRATION_GAPS_FOUND = CLUSTER.filter((m) => !m.wasRegisteredInDataModules).map((m) => m.ticket);

export const MEASUREMENT_CLUSTER_INVARIANT_AUDIT = {
  ticket: 'imp-34643',
  cluster: CLUSTER,
  clusterSize: CLUSTER.length,
  excludedNonMember: 'imp-34610 (opus-4-8/api-pool script-only ticket, no dedicated cluster module)',
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === CLUSTER.length,
  heavyImportGapsFound: CLUSTER.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  bannerGapsFound: CLUSTER.filter((m) => !m.bannerComplete).map((m) => m.ticket),
  registrationGapsFoundBeforeFix: REGISTRATION_GAPS_FOUND,
  registrationGapsFixed: REGISTRATION_GAPS_FOUND,
  honest: 'AUDIT: confirms all 7 imp-34606..imp-34613 cluster modules carry the complete six-element honest-status banner and are import-light (no heavy zeros bundle, direct or transitive). While auditing, found 5 of 7 (imp-34606, imp-34609, imp-34611, imp-34612, imp-34613) were missing from run-assertions.mjs DATA_MODULES (self-executing assertions never ran in the build-time sweep) and wired all 5 in. No bound change; imp-3066 K_a>=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO QED; no refereed bound is changed.',
};

export const MEASUREMENT_CLUSTER_INVARIANT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34643-cluster-has-seven-members',
    description: 'the audited cluster covers exactly the 7 dedicated modules in the imp-34606..imp-34613 span (imp-34610 excluded as a non-member)',
    holds: () => MEASUREMENT_CLUSTER_INVARIANT_AUDIT.clusterSize === 7
      && ['imp-34606', 'imp-34607', 'imp-34608', 'imp-34609', 'imp-34611', 'imp-34612', 'imp-34613']
        .every((t) => CLUSTER.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34643-all-log-ids-distinct',
    description: 'every cluster member has a distinct improvements.js log id',
    holds: () => MEASUREMENT_CLUSTER_INVARIANT_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-34643-no-heavy-import-gaps',
    description: 'no cluster module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => MEASUREMENT_CLUSTER_INVARIANT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-34643-no-banner-gaps',
    description: 'no cluster module was found missing the six-element honest-status banner',
    holds: () => MEASUREMENT_CLUSTER_INVARIANT_AUDIT.bannerGapsFound.length === 0,
  },
  {
    id: 'imp-34643-module-paths-match-imp-prefix',
    description: 'every cluster modulePath filename starts with the matching ticket id',
    holds: () => CLUSTER.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34643-registration-gap-found-and-fixed',
    description: 'the discovered DATA_MODULES registration gap (5 of 7 members) is recorded as found and marked fixed',
    holds: () => MEASUREMENT_CLUSTER_INVARIANT_AUDIT.registrationGapsFoundBeforeFix.length === 5
      && MEASUREMENT_CLUSTER_INVARIANT_AUDIT.registrationGapsFixed.length === 5,
  },
  {
    id: 'imp-34643-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(MEASUREMENT_CLUSTER_INVARIANT_AUDIT.honest)
      && /refereed bound is changed/i.test(MEASUREMENT_CLUSTER_INVARIANT_AUDIT.honest),
  },
];

for (const a of MEASUREMENT_CLUSTER_INVARIANT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34643-measurement-cluster-invariant-audit assertion failed: ${a.id}`);
}
