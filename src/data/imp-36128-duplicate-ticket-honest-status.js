/**
 * @module imp-36128-duplicate-ticket-honest-status
 *
 * imp-36128 (meta, sonnet-4-6, sonnet): honest-status finding that ticket imp-36128 itself
 * duplicates an already-completed ticket, imp-36108.
 *
 * FINDING. imp-36128 asked to "implement the lightweight pre-seed viz-data
 * duplicate-detection guard that imp-36033 proposed but explicitly did not implement" in
 * scripts/seed-ticket.mjs. That guard was already implemented and shipped as imp-36108
 * (status: completed, completedByModel: sonnet-4-6) -- see the checkVizDataDuplicate()
 * function in scripts/seed-ticket.mjs (added under the "imp-36108, proposed by imp-36033"
 * comment): for a category:'ux' ticket naming a source imp-NNNNN, it greps src/data/*.js for
 * a matching filename or an '@see imp-NNNNN' docstring co-occurring with 'viz-data', and
 * prints a non-blocking warning naming the already-delivered module. imp-36128 is therefore a
 * stale duplicate of imp-36108, not new scope -- no code change is made here.
 *
 * WHY THE ux-ONLY GUARD DID NOT CATCH THIS. checkVizDataDuplicate() only fires for
 * category:'ux' tickets. imp-36128 itself was seeded as category 'bug', so the very guard it
 * asked to build would not have flagged imp-36128 as a duplicate of imp-36108 even if imp-36108
 * had already existed at seed time -- the duplicate-ticket problem it targets is scoped to
 * "duplicate viz-data delivery," not "duplicate feature-implementation proposal." This module
 * records that gap as a known blind spot in the ticket-seeding duplicate check, distinct from
 * (and narrower than) a general fix.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36108-preseed-vizdata-duplicate-guard (the already-completed implementation this ticket duplicates)
 * @see imp-36033 (originally proposed the guard without implementing it)
 * @see scripts/seed-ticket.mjs (checkVizDataDuplicate function, category:'ux'-only scope)
 */

const DUPLICATE_TICKET_ID = 'imp-36128';
const ORIGINAL_TICKET_ID = 'imp-36108';
const ORIGINAL_TICKET_STATUS = 'completed';
const GUARD_SCOPE_CATEGORY = 'ux';
const DUPLICATE_TICKET_CATEGORY = 'bug';

export const IMP36128_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36128',
  proofSection: 'audit',
  question:
    'Does imp-36128 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36108 (completed). The pre-seed viz-data duplicate-detection guard ' +
    'imp-36128 asks for already exists as checkVizDataDuplicate() in scripts/seed-ticket.mjs, ' +
    'shipped under imp-36108. No code change made; the ux-only scope of that guard is the ' +
    'reason it did not itself flag imp-36128 (category: bug) as a duplicate feature request.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  guardScopeCategory: GUARD_SCOPE_CATEGORY,
  duplicateTicketCategory: DUPLICATE_TICKET_CATEGORY,
  guardIsCategoryScoped: GUARD_SCOPE_CATEGORY !== DUPLICATE_TICKET_CATEGORY,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36128 duplicates the ' +
    'already-completed imp-36108; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36108-preseed-vizdata-duplicate-guard (the completed implementation); ' +
    'imp-36033 (original proposal); scripts/seed-ticket.mjs checkVizDataDuplicate().',
};

export const IMP36128_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36128-duplicate-of-completed-original',
    description: 'imp-36128 is recorded as a duplicate of the completed imp-36108',
    holds: () =>
      IMP36128_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36108' &&
      IMP36128_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36128-guard-is-category-scoped',
    description:
      'the pre-existing guard is scoped to category ux, distinct from imp-36128 own bug category',
    holds: () =>
      IMP36128_DUPLICATE_TICKET_HONEST_STATUS.guardScopeCategory === 'ux' &&
      IMP36128_DUPLICATE_TICKET_HONEST_STATUS.duplicateTicketCategory === 'bug' &&
      IMP36128_DUPLICATE_TICKET_HONEST_STATUS.guardIsCategoryScoped === true,
  },
  {
    id: 'imp36128-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36128_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36128_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36128_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36128_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36128-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36128_DUPLICATE_TICKET_HONEST_STATUS;
