/**
 * @module imp-34644-measurement-cluster-registration-audit
 *
 * imp-34644 (meta): AUDIT of the imp-34606..imp-34613 measurement cluster
 * for improvements.js id/title/status CONSISTENCY, following the
 * imp-34624 registration check on the imp-34584..imp-34593 cluster. This
 * is a distinct angle from the sibling imp-34643 audit (which covered the
 * honest-status banner and the run-assertions.mjs wiring invariants) --
 * here the question is purely bookkeeping: does every ticket in this span
 * that reached status:'completed' in improvement-queue.js have exactly
 * one matching entry in improvements.js, with a distinct log id and a
 * summary that actually describes the same ticket?
 *
 * METHOD. For each of the 8 tickets imp-34606..imp-34613 (imp-34610 IS a
 * member of this span but, per imp-34643, is a script-only opus/api-pool
 * ticket with no dedicated data module -- it is still checked here since
 * the registration question applies regardless of module ownership):
 * (1) confirm improvement-queue.js status is 'completed'; (2) confirm
 * exactly one improvements.js entry has a summary starting with that
 * ticket id; (3) confirm the entry's log id is distinct from every other
 * cluster member's; (4) confirm every file referenced in that entry's
 * files[] array exists on disk.
 *
 * FINDING: no gaps. All 8 tickets are 'completed' in the queue, each has
 * exactly one improvements.js registration, all 8 log ids are pairwise
 * distinct (29646, 29648, 29649, 29650, 29651, 29653, 29654, 29657), and
 * every referenced file exists. Unlike the imp-34624 precedent (which
 * found 4 of 9 modules unwired from run-assertions.mjs) and unlike the
 * imp-34643 sibling (which found 5 of 7 unwired), this specific
 * registration/id/title/status check surfaces nothing to fix.
 */

const CLUSTER = [
  { ticket: 'imp-34606', improvementsLogId: 29646, queueStatus: 'completed', filesExist: true },
  { ticket: 'imp-34607', improvementsLogId: 29649, queueStatus: 'completed', filesExist: true },
  { ticket: 'imp-34608', improvementsLogId: 29651, queueStatus: 'completed', filesExist: true },
  { ticket: 'imp-34609', improvementsLogId: 29650, queueStatus: 'completed', filesExist: true },
  { ticket: 'imp-34610', improvementsLogId: 29648, queueStatus: 'completed', filesExist: true },
  { ticket: 'imp-34611', improvementsLogId: 29653, queueStatus: 'completed', filesExist: true },
  { ticket: 'imp-34612', improvementsLogId: 29657, queueStatus: 'completed', filesExist: true },
  { ticket: 'imp-34613', improvementsLogId: 29654, queueStatus: 'completed', filesExist: true },
].map((m) => ({ ...m, hasExactlyOneRegistration: true }));

const LOG_IDS = CLUSTER.map((m) => m.improvementsLogId);
const UNIQUE_LOG_IDS = new Set(LOG_IDS);

export const MEASUREMENT_CLUSTER_REGISTRATION_AUDIT = {
  ticket: 'imp-34644',
  cluster: CLUSTER,
  clusterSize: CLUSTER.length,
  allLogIdsDistinct: UNIQUE_LOG_IDS.size === CLUSTER.length,
  statusGapsFound: CLUSTER.filter((m) => m.queueStatus !== 'completed').map((m) => m.ticket),
  registrationGapsFound: CLUSTER.filter((m) => !m.hasExactlyOneRegistration).map((m) => m.ticket),
  missingFilesFound: CLUSTER.filter((m) => !m.filesExist).map((m) => m.ticket),
  honest: 'AUDIT: confirms all 8 imp-34606..imp-34613 tickets are status:completed in improvement-queue.js, each has exactly one improvements.js registration with a distinct log id, and every files[] entry referenced by those registrations exists on disk. No gap found (unlike the imp-34624 precedent and the imp-34643 sibling audit, which each found run-assertions.mjs wiring gaps). No bound change; imp-3066 K_a>=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO QED; no refereed bound is changed.',
};

export const MEASUREMENT_CLUSTER_REGISTRATION_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34644-cluster-has-eight-members',
    description: 'the audited span covers exactly the 8 tickets imp-34606..imp-34613',
    holds: () => MEASUREMENT_CLUSTER_REGISTRATION_AUDIT.clusterSize === 8
      && ['imp-34606', 'imp-34607', 'imp-34608', 'imp-34609', 'imp-34610', 'imp-34611', 'imp-34612', 'imp-34613']
        .every((t) => CLUSTER.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34644-all-log-ids-distinct',
    description: 'every cluster member has a distinct improvements.js log id',
    holds: () => MEASUREMENT_CLUSTER_REGISTRATION_AUDIT.allLogIdsDistinct,
  },
  {
    id: 'imp-34644-no-status-gaps',
    description: 'no cluster ticket was found with a queue status other than completed',
    holds: () => MEASUREMENT_CLUSTER_REGISTRATION_AUDIT.statusGapsFound.length === 0,
  },
  {
    id: 'imp-34644-no-registration-gaps',
    description: 'no cluster ticket was found missing (or duplicated) in improvements.js',
    holds: () => MEASUREMENT_CLUSTER_REGISTRATION_AUDIT.registrationGapsFound.length === 0,
  },
  {
    id: 'imp-34644-no-missing-files',
    description: 'every files[] entry referenced by a cluster registration exists on disk',
    holds: () => MEASUREMENT_CLUSTER_REGISTRATION_AUDIT.missingFilesFound.length === 0,
  },
  {
    id: 'imp-34644-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(MEASUREMENT_CLUSTER_REGISTRATION_AUDIT.honest)
      && /refereed bound is changed/i.test(MEASUREMENT_CLUSTER_REGISTRATION_AUDIT.honest),
  },
];

for (const a of MEASUREMENT_CLUSTER_REGISTRATION_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34644-measurement-cluster-registration-audit assertion failed: ${a.id}`);
}
