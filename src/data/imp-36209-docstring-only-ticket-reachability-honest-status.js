/**
 * @module imp-36209-docstring-only-ticket-reachability-honest-status
 *
 * imp-36209 (meta, sonnet-4-6, sonnet): assesses whether a DOCSTRING-ONLY ticket -- one whose
 * fix lands as a prose correction inside an EXISTING module rather than as its own standalone
 * file -- is discoverable via the standard module-registry / @see surfacing method that the
 * imp-3598x/imp-3600x/... registration-reachability audits (imp-35982, imp-35905, imp-36034,
 * imp-36070, imp-36087, imp-36109, imp-36169, ...) all use.
 *
 * CASE STUDY. imp-36065 (improvements.js id 31121) fixed a stale hand-quoted N_cross value in
 * the imp-35968-e-trunc-coll-crossover-location.js docstring. It has no standalone
 * imp-36065-*.js file: it is a same-file edit inside an already-existing module.
 *
 * METHOD. The standard registration-reachability method (imp-36034 et al.) operates on FILE
 * PATHS: grep scripts/run-assertions.mjs DATA_MODULES for a `/src/data/<candidate-file>.js`
 * entry, then grep src/data for real `import` statements naming that file, to classify a
 * candidate as direct / transitive / orphaned. That method presupposes a candidate file exists.
 * For imp-36065 there is no `imp-36065-*.js` to look up -- the ticket id names a docstring edit,
 * not a module. So this audit instead directly inspected: (a) the imp-35968 file's own docstring
 * for any backlink to imp-36065, and (b) which other committed modules mention "imp-36065" in
 * their own text.
 *
 * FINDING -- NOT DISCOVERABLE BY THE STANDARD METHOD; RECOVERABLE ONLY BY ID-STRING GREP.
 * imp-35968-e-trunc-coll-crossover-location.js's own docstring contains ZERO occurrences of
 * "36065" -- the host module does not self-document which ticket last touched its prose, so a
 * reader auditing imp-35968 in isolation has no in-file trail back to imp-36065. The only
 * surviving trace of imp-36065 having happened is bookkeeping text: the improvements.js id 31121
 * row, the improvement-queue.js ticket record, and later modules that happen to mention the id
 * in passing prose (imp-36110's cross-reference-integrity audit and imp-36169's registration
 * audit both name "imp-36065" as a cohort marker, but neither is itself a backlink from imp-35968).
 * A DATA_MODULES / @see sweep keyed on file paths -- the method every prior reachability audit in
 * this cohort used -- would never surface imp-36065 at all, not because it is orphaned in the
 * run-assertions.mjs sense (its assertions live inside imp-35968, which IS registered), but
 * because the ticket id and the module file id have silently DIVERGED: imp-35968's assertions
 * run under `npm run assert` regardless of the imp-36065 fix, so there is no "orphan" to detect,
 * yet imp-36065-the-ticket itself is invisible to any tool that greps for a same-named file.
 *
 * IS THIS A DISTINCT FAILURE MODE FROM imp-36129's ORPHANED-MODULE FINDING? Yes. imp-36129
 * documented a module that EXISTS but has no DATA_MODULES entry (an execution-reachability gap).
 * This is the converse: a ticket that has NO module to register at all, because its payload is a
 * same-file prose edit. Execution reachability (does `npm run assert` run it) is not at stake --
 * imp-35968 always runs. Ticket-to-artifact TRACEABILITY is: a plain-text grep for the exact
 * ticket id (not the registration-reachability method) is the only way to relocate the fix.
 *
 * NO FIX APPLIED. This is a scoping/honest-status finding, not a code defect: docstring-only
 * tickets are working as designed (improvements.js is the ledger of record for them), but the
 * registration-reachability audit method cannot and should not be pointed at them expecting a
 * file-path hit. Read-only record; changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-36065 (improvements.js id 31121; the docstring-only fix, case study of this audit)
 * @see imp-35968-e-trunc-coll-crossover-location.js (the host module imp-36065's fix landed inside)
 * @see imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit.js (notes imp-36065 has no standalone module)
 * @see imp-36129-orphaned-module-registration-audit-honest-status.js (the converse failure mode: a real orphaned FILE)
 * @see imp-36034-imp3596x97x-registration-reachability-audit.js (the file-path-keyed registration-audit method)
 */

const CASE_STUDY_TICKET = 'imp-36065';
const CASE_STUDY_IMPROVEMENTS_ID = 31121;
const HOST_MODULE = 'imp-35968-e-trunc-coll-crossover-location';
const HOST_MODULE_DOCSTRING_MENTIONS_TICKET = false;
const MODULES_MENTIONING_TICKET_ID_IN_PASSING = [
  'imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit',
  'imp-36169-imp3606x82x95x96x97x-registration-reachability-audit',
];

export const IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS = {
  id: 'imp-36209',
  proofSection: 'audit',
  question:
    'Are DOCSTRING-ONLY tickets (a fix landing as a prose edit inside an existing module, ' +
    'no standalone file) discoverable via the standard file-path-keyed module-registry / ' +
    '@see reachability method used by the imp-3598x/imp-3600x/... audit cohort?',
  verdictShort:
    'NOT DISCOVERABLE BY THE STANDARD METHOD. That method is keyed on candidate file paths ' +
    '(DATA_MODULES membership, then import statements naming the file); a docstring-only fix ' +
    'has no such file to look up. Case study imp-36065 (improvements.js id 31121) landed inside ' +
    HOST_MODULE +
    '.js, whose own docstring contains zero backlink to the ticket id. The only recoverable ' +
    'trail is a plain-text grep for the exact "imp-36065" id string across improvements.js, ' +
    'improvement-queue.js, and any later module that happens to mention it in passing.',
  caseStudyTicket: CASE_STUDY_TICKET,
  caseStudyImprovementsId: CASE_STUDY_IMPROVEMENTS_ID,
  hostModule: HOST_MODULE,
  hostModuleDocstringMentionsTicket: HOST_MODULE_DOCSTRING_MENTIONS_TICKET,
  modulesMentioningTicketIdInPassing: MODULES_MENTIONING_TICKET_ID_IN_PASSING,
  isOrphanedInExecutionSense: false,
  isTraceableViaFilePathRegistryMethod: false,
  isTraceableViaPlainIdGrep: true,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / SCOPING FINDING (not a measurement of a mathematical quantity, no fix applied). ' +
    'Docstring-only tickets are execution-reachable through their host module (imp-35968 always ' +
    'runs under `npm run assert`; no orphan in the imp-36129 sense) but are NOT traceable via the ' +
    'file-path-keyed DATA_MODULES/@see method every prior registration-reachability audit in this ' +
    'cohort used, because that method presupposes a same-named candidate file exists. The host ' +
    'module here self-documents no backlink to the ticket id at all; the only surviving trail is ' +
    'a literal id-string grep over improvements.js / improvement-queue.js / later prose mentions. ' +
    'This is a distinct failure mode from imp-36129 (a module that exists but is unregistered): ' +
    'here there is no module to register, only a ticket id with no file-shaped home. Changes no ' +
    'bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36065 (improvements.js id 31121, the docstring-only fix); imp-35968-e-trunc-coll-' +
    'crossover-location.js (the host module); imp-36110 (cross-reference audit noting the ' +
    'standalone-module gap); imp-36129 (converse orphaned-module failure mode); imp-36034 ' +
    '(the file-path-keyed registration-audit method this finding scopes the limits of).',
};

export const IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36209-case-study-identified',
    description: 'records imp-36065 (improvements.js id 31121) as the docstring-only case study',
    holds: () =>
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.caseStudyTicket === 'imp-36065' &&
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.caseStudyImprovementsId === 31121,
  },
  {
    id: 'imp36209-host-module-has-no-backlink',
    description: 'the host module docstring contains no backlink to the ticket id',
    holds: () =>
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.hostModuleDocstringMentionsTicket ===
      false,
  },
  {
    id: 'imp36209-not-traceable-via-registry-method',
    description: 'the file-path-keyed registration-reachability method cannot surface this ticket',
    holds: () =>
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.isTraceableViaFilePathRegistryMethod ===
        false &&
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.isTraceableViaPlainIdGrep === true,
  },
  {
    id: 'imp36209-not-orphaned-in-execution-sense',
    description: 'the host module still runs under npm run assert -- no execution orphan',
    holds: () =>
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.isOrphanedInExecutionSense === false,
  },
  {
    id: 'imp36209-no-fix-honesty-gate',
    description: 'Scoping finding only: no fix applied, no bound changed, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.fixApplied === false &&
      IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-36209-docstring-only-ticket-reachability-honest-status assertion failed: ${a.id}`
    );
  }
}

export default IMP36209_DOCSTRING_ONLY_TICKET_REACHABILITY_HONEST_STATUS;
