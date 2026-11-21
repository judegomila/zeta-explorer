/**
 * @module imp-36206-duplicate-ticket-honest-status
 *
 * imp-36206 (meta, sonnet-4-6, sonnet): honest-status finding that ticket imp-36206 itself
 * duplicates an already-completed ticket, imp-36190.
 *
 * FINDING. imp-36206 asked to "run a cross-reference @see / ES-import / bare-imp-NNNNN
 * integrity audit (imp-36110/imp-36127 method) on the newest S-frontier cross-reference
 * cohort imp-36111/imp-36112/imp-36164/imp-36165/imp-36166, which no prior audit has
 * swept, resolving every reference against the src/data listing and
 * improvement-queue.js/improvements.js". That premise is false: imp-36190 already ran
 * exactly this audit -- see IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT in
 * imp-36190-imp36098-166-cross-reference-integrity-audit.js, whose AUDITED_COHORT array
 * lists all five of imp-36206's named targets (imp-36111, imp-36112, imp-36164,
 * imp-36165, imp-36166) among its 37 audited files, and which reports zero dangling
 * @see/import/bare-imp-NNNNN references across that entire cohort. imp-36206 is
 * therefore a stale duplicate of imp-36190, not new scope -- no second audit is run here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. imp-36206's own rationale ("no prior audit has swept"
 * this five-ticket cohort) never checked the queue for imp-36190, which was seeded and
 * completed as a wider sweep covering the same imp-36098..imp-36166 range one tick
 * earlier -- the frontier-scout ticket generator's duplicate check missed it at seed
 * time, the same failure mode already recorded by imp-36167 and its cited precedents.
 * This module records the duplication so a reader landing on imp-36206 is pointed
 * straight at imp-36190 instead of a second, narrower re-run of the same audit.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36190-imp36098-166-cross-reference-integrity-audit.js (the already-completed audit this ticket duplicates)
 * @see imp-36189-imp36098-166-registration-reachability-audit.js (sibling audit, same cohort, different property)
 * @see imp-36167-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36206';
const ORIGINAL_TICKET_ID = 'imp-36190';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36206_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36206',
  proofSection: 'audit',
  question:
    'Does imp-36206 request new scope, or does it duplicate an already-completed audit?',
  verdictShort:
    'DUPLICATE OF imp-36190 (completed). The cross-reference @see/ES-import/bare-imp-NNNNN ' +
    'integrity audit imp-36206 asks for over imp-36111/imp-36112/imp-36164/imp-36165/imp-36166 ' +
    'was already run as part of imp-36190’s wider 37-file imp-36098..imp-36166 cohort sweep, ' +
    'which lists all five named targets in its AUDITED_COHORT and reports zero dangling ' +
    'references. No new audit run; this module only records the duplication and ' +
    'cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36206 duplicates the ' +
    'already-completed imp-36190; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36190-imp36098-166-cross-reference-integrity-audit.js (the completed original); ' +
    'imp-36111/imp-36112/imp-36164/imp-36165/imp-36166 (the five tickets imp-36206 named, ' +
    'all already members of imp-36190’s audited cohort).',
};

export const IMP36206_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36206-duplicate-of-completed-original',
    description: 'imp-36206 is recorded as a duplicate of the completed imp-36190',
    holds: () =>
      IMP36206_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36190' &&
      IMP36206_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36206-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36206_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36206_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36206_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36206_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36206-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36206_DUPLICATE_TICKET_HONEST_STATUS;
