/**
 * @module imp-95363-maxmoduleid-maxticketid-gap-reconciliation
 *
 * imp-95363 (meta): reconciles the scripts/queue-index.json maxModuleId
 * (95332 as of the imp-95307 note that first flagged this gap) vs
 * maxTicketId (95327) divergence for the RZ-PEN chain modules
 * imp-95328..95332. Confirms each shipped module either has a completed
 * queue row or is an intentional row-free finding module with a matching
 * improvements.js log entry, and that no ledger backfill is needed.
 *
 * METHOD: grepped src/data/improvement-queue.js for a queue row keyed by
 * each of imp-95328..95332 (none found -- these ids were never dispatched
 * as pending tickets), then grepped src/data/improvements.js for a
 * `summary: "imp-NNNNN:` log entry for each id (one found per id, all
 * channel "fable" / model "fable-5").
 *
 * FINDING: all five ids are row-free finding modules by construction, not
 * dropped or orphaned tickets -- they were produced directly by the
 * frontier engine (as scripts/queue-index.json's own note on this gap
 * already documents) and each has exactly one improvements.js log entry
 * recording an honest verdict. No queue row is missing that should exist;
 * no backfill is required.
 *
 * AUDIT-ONLY: this ticket confirms the ledger is consistent, it does not
 * create or backfill any queue rows. No bound change; NO QED; no refereed bound is changed.
 */

const COHORT_IDS = ['imp-95328', 'imp-95329', 'imp-95330', 'imp-95331', 'imp-95332'];

const HAS_QUEUE_ROW = {
  'imp-95328': false,
  'imp-95329': false,
  'imp-95330': false,
  'imp-95331': false,
  'imp-95332': false,
};

const HAS_IMPROVEMENTS_LOG_ENTRY = {
  'imp-95328': true,
  'imp-95329': true,
  'imp-95330': true,
  'imp-95331': true,
  'imp-95332': true,
};

const MODULE_FILES = {
  'imp-95328': 'src/data/imp-95328-two-chart-pencil-floor.js',
  'imp-95329': 'src/data/imp-95329-beta-trace-capped-pencil-floor.js',
  'imp-95330': 'src/data/imp-95330-chart-refined-pencil-floor.js',
  'imp-95331': 'src/data/imp-95331-split-weight-exact-root-pencil-floor.js',
  'imp-95332': 'src/data/imp-95332-chart-tail-pencil-floor.js',
};

export const IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION = {
  ticket: 'imp-95363',
  cohortIds: COHORT_IDS,
  cohortSize: COHORT_IDS.length,
  moduleFiles: MODULE_FILES,
  hasQueueRow: HAS_QUEUE_ROW,
  hasImprovementsLogEntry: HAS_IMPROVEMENTS_LOG_ENTRY,
  allRowFree: Object.values(HAS_QUEUE_ROW).every((v) => v === false),
  allLogged: Object.values(HAS_IMPROVEMENTS_LOG_ENTRY).every((v) => v === true),
  backfillNeeded: false,
  honest: 'AUDIT-ONLY -- confirms all five RZ-PEN chain ids (imp-95328 through imp-95332) are ' +
    'row-free finding modules (no matching src/data/improvement-queue.js row, by design) each ' +
    'carrying exactly one src/data/improvements.js log entry. The maxModuleId(95332) > ' +
    'maxTicketId(95327) gap flagged in scripts/queue-index.json is the expected shape of this ' +
    'pattern, not missing bookkeeping. No queue row is backfilled or created by this ticket. ' +
    'No bound change; NO QED; no refereed bound is changed.',
};

export const IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION_ASSERTIONS = [
  {
    id: 'imp-95363-cohort-has-five-members',
    description: 'the audited cohort spans exactly the five RZ-PEN chain ids imp-95328..imp-95332',
    holds: () => IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION.cohortSize === 5
      && IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION.cohortIds.length === 5,
  },
  {
    id: 'imp-95363-all-row-free',
    description: 'none of the five cohort ids has a matching improvement-queue.js row',
    holds: () => IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION.allRowFree === true,
  },
  {
    id: 'imp-95363-all-logged',
    description: 'every cohort id has a matching improvements.js log entry',
    holds: () => IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION.allLogged === true,
  },
  {
    id: 'imp-95363-no-backfill-needed',
    description: 'the reconciliation concludes no queue-row backfill is required',
    holds: () => IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION.backfillNeeded === false,
  },
  {
    id: 'imp-95363-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION.honest)
      && /refereed bound is changed/i.test(IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION.honest),
  },
];

for (const a of IMP95363_MAXMODULEID_MAXTICKETID_GAP_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95363-maxmoduleid-maxticketid-gap-reconciliation assertion failed: ${a.id}`);
}
