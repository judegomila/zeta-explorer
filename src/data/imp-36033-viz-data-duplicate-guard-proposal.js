/**
 * @module imp-36033-viz-data-duplicate-guard-proposal
 *
 * imp-36033 (meta, S-frontier assessment): the anti-starvation frontier scout
 * (scripts/frontier-scout.sh) re-seeded imp-35976 and imp-35978 as viz-data
 * tickets whose requested output turned out to be ALREADY DELIVERED --
 * imp-35976 duplicated imp-35956-pairwise-tree-shape-ladder-viz-data.js and
 * imp-35978 duplicated imp-35957-rdirect-floor-height-sweep-viz-data.js. Both
 * were caught only after landing, by dedicated duplicate-audit modules
 * (imp-35976-tree-shape-viz-duplicate-audit.js,
 * imp-35978-rdirect-floor-viz-duplicate-audit.js), not before minting.
 *
 * ASSESSMENT: of the recent S-frontier viz-data cohort (imp-3595x/3597x/3600x/
 * 3602x/3603x), exactly 2 confirmed duplicate viz-data tickets have surfaced
 * (imp-35976, imp-35978), both against sibling modules minted in the SAME
 * frontier-scout batch as (or just before) the duplicate. The scout prompt
 * (scripts/frontier-scout.sh SCOUT_PROMPT) already tells the model to "grep
 * improvement-queue.js for keywords first", but that only checks the QUEUE
 * (ticket titles), never src/data/ (already-DELIVERED modules) -- so a viz-data
 * request for a source id whose module already landed slips through even
 * though the ticket text is phrased differently each time.
 *
 * PROPOSED GUARD (not implemented here -- imp-36033 asks to propose, not
 * necessarily implement): before seed-ticket.mjs inserts a new ticket whose
 * category is "ux" and whose title/description names a source imp-NNNNN,
 * grep src/data/*.js for an existing filename or "@see imp-NNNNN" docstring
 * reference paired with the word "viz-data" -- if found, the seeder should
 * print a WARNING (not necessarily a hard block, since the citation heuristic
 * has false-positive risk) naming the already-delivered module, mirroring the
 * check this module performs read-only below. This keeps the guard
 * lightweight: a single extra grep over already-fast, already-small files,
 * no new dependency, no change to the ticket schema.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Does not modify scripts/seed-ticket.mjs or scripts/frontier-scout.sh --
 * assessment/proposal only, per the ticket's explicit "do not necessarily
 * implement" scope. No new numerics; no new claim; changes no bound; NO QED.
 *
 * @see imp-35976-tree-shape-viz-duplicate-audit (first confirmed duplicate)
 * @see imp-35978-rdirect-floor-viz-duplicate-audit (second confirmed duplicate)
 * @see imp-35956-pairwise-tree-shape-ladder-viz-data (module imp-35976 duplicated)
 * @see imp-35957-rdirect-floor-height-sweep-viz-data (module imp-35978 duplicated)
 */

export const IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL = {
  id: 'imp-36033',
  proofSection: 'S-frontier',
  question:
    'Assess how many recent frontier-scout viz-data tickets were confirmed duplicates of ' +
    'already-delivered modules, and propose (without necessarily implementing) a lightweight ' +
    'pre-seed duplicate-detection guard.',
  confirmedDuplicateCount: 2,
  confirmedDuplicates: [
    { ticket: 'imp-35976', duplicateOf: 'imp-35956', module: 'imp-35956-pairwise-tree-shape-ladder-viz-data.js' },
    { ticket: 'imp-35978', duplicateOf: 'imp-35957', module: 'imp-35957-rdirect-floor-height-sweep-viz-data.js' },
  ],
  rootCause:
    'The frontier-scout SCOUT_PROMPT hard rule ("NO duplicate of any pending or completed ticket ' +
    'title") only instructs a grep of src/data/improvement-queue.js (ticket TITLES), never a grep ' +
    'of src/data/*.js (DELIVERED modules) -- so a re-seeded ticket whose paraphrased title differs ' +
    'from the original slips past the existing check even when the underlying viz-data already shipped.',
  proposedGuard:
    'Before seed-ticket.mjs inserts a ticket with category "ux" naming a source imp-NNNNN in its ' +
    'title/description, grep src/data/*.js for a filename or "@see imp-NNNNN" docstring reference ' +
    'co-occurring with "viz-data"; if a match is found, print a non-blocking WARNING identifying ' +
    'the already-delivered module (the seeder still inserts the ticket -- the heuristic is a hint, ' +
    'not a hard gate, since paraphrased citations can produce false positives).',
  implemented: false,
  isRigorous: false,
  verdict:
    'ASSESSMENT/PROPOSAL ONLY. Exactly 2 confirmed duplicate viz-data tickets found (imp-35976, ' +
    'imp-35978); guard proposed above, not implemented in this module per the ticket scope. ' +
    'Changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL_ASSERTIONS = [
  {
    id: 'imp36033-two-confirmed-duplicates',
    description: 'Exactly two confirmed duplicate viz-data tickets are recorded',
    holds: () =>
      IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.confirmedDuplicateCount === 2 &&
      IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.confirmedDuplicates.length === 2,
  },
  {
    id: 'imp36033-duplicates-cite-correct-originals',
    description: 'Each confirmed duplicate cites the correct pre-existing module it duplicated',
    holds: () => {
      const [d1, d2] = IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.confirmedDuplicates;
      return (
        d1.ticket === 'imp-35976' &&
        d1.duplicateOf === 'imp-35956' &&
        d2.ticket === 'imp-35978' &&
        d2.duplicateOf === 'imp-35957'
      );
    },
  },
  {
    id: 'imp36033-guard-not-implemented',
    description: 'The module honestly records that the proposed guard was NOT implemented, per ticket scope',
    holds: () => IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.implemented === false,
  },
  {
    id: 'imp36033-proposed-guard-is-non-blocking',
    description: 'The proposed guard text describes a WARNING, not a hard block (false-positive risk noted)',
    holds: () =>
      /WARNING/.test(IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.proposedGuard) &&
      /non-blocking/.test(IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.proposedGuard),
  },
  {
    id: 'imp36033-honesty-gate-no-qed',
    description: 'Assessment is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.isRigorous === false &&
      /NO QED/.test(IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.verdict) &&
      /refereed bound is changed/i.test(IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.verdict) &&
      /GUE-conditional/.test(IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL.verdict),
  },
];

for (const a of IMP36033_VIZ_DATA_DUPLICATE_GUARD_PROPOSAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36033-viz-data-duplicate-guard-proposal assertion failed: ${a.id}`);
  }
}
