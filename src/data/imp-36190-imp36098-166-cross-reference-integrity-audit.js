/**
 * @module imp-36190-imp36098-166-cross-reference-integrity-audit
 *
 * imp-36190 (meta, audit): a cross-reference @see integrity audit (imp-35186/imp-36110/
 * imp-36127/imp-36148/imp-36170 method) over the NEWEST S-frontier cohort imp-36098..
 * imp-36166 -- the 37 existing cross-reference/honest-status/storyline/viz-data modules
 * committed since the prior imp-36110 sweep (which stopped at imp-36065) and its pending
 * successor (imp-36170, which stopped at imp-36097). This cohort is the same 37-file set
 * the sibling imp-36189 registration/reachability audit swept; this audit checks a
 * different property -- @see/import citation integrity, not DATA_MODULES wiring.
 *
 * METHOD. Extracted every "@see" line and "^import { ... } from './*.js'" statement from
 * all 37 cohort files. Split each @see target into filename-suffixed module-slug targets
 * (checked against the actual src/data directory listing) versus bare "imp-NNNNN"
 * citations with no slug (checked against literal `id:` occurrences in
 * improvement-queue.js / improvements.js). Every named ES import was additionally checked
 * against its target file's real `export const/function` bindings.
 *
 * FINDING. Zero dangling references. 86 distinct filename-suffixed @see/import targets
 * were extracted; 85 resolve to a real file under src/data. The one exception,
 * "imp-36108-preseed-vizdata-duplicate-guard" (cited from imp-36128), is not a dangling
 * reference: imp-36108 is a real completed ticket (id: 'imp-36108' in
 * improvement-queue.js) delivered as a scripts/seed-ticket.mjs code change rather than a
 * standalone src/data module -- the same non-file-ticket pattern the imp-36148 audit
 * already excluded for imp-36085/36089/36090/36091. All 27 named ES imports across the
 * cohort resolve to a real `export` binding in their target file (verified via regex
 * match on `export const/function/class/default NAME` or a named `export { NAME }`).
 * 22 distinct bare imp-NNNNN citations (imp-3220, imp-3406, imp-345, imp-33582,
 * imp-34687a, imp-34714a, imp-35186, imp-35327, imp-35674, imp-35681, imp-35725,
 * imp-35760, imp-35776, imp-35890, imp-35968, imp-36030, imp-36033, imp-36062, imp-36064,
 * imp-36065, imp-36113, imp-36115) all resolve to real `id:` occurrences in
 * improvement-queue.js / improvements.js (imp-34687a and imp-34714a resolve to
 * sub-gap labels inside their parent modules, matching the existing sub-gap convention).
 * Three additional "imp-3603x"/"imp-3604x"/"imp-3605x" tokens found inside imp-36127's own
 * self-descriptive prose (a wildcard cohort-range notation, e.g. "the imp-3603x/imp-3604x/
 * imp-3605x/imp-3606x cohort") are excluded from the bare-citation count -- they are not
 * literal ticket citations, the same convention already used when imp-36127/imp-36148
 * describe their own audited ranges.
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check
 * (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (audit method template)
 * @see imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit.js (predecessor sweep, stops at imp-36065)
 * @see imp-36127-imp3603x-3606x-cross-reference-integrity-audit.js (sibling sweep, imp-36030..imp-36062 cohort)
 * @see imp-36148-imp3608x9x-cross-reference-integrity-audit.js (sibling sweep, imp-3608x/imp-3609x cohort)
 * @see imp-36170-imp3606x67x82x95x96x97-cross-reference-integrity-audit.js (pending successor, stops at imp-36097)
 * @see imp-36189-imp36098-166-registration-reachability-audit.js (sibling audit, same cohort, DATA_MODULES wiring)
 */

const AUDITED_COHORT = [
  'imp-36098-kbn-kahan-onset-2e128-crossvalidation',
  'imp-36099-kbn-kahan-ratio-scaling-fit',
  'imp-36100-kbn-kahan-onset-natural-order',
  'imp-36101-w1-certified-sum-construction-steps-scope',
  'imp-36102-sole-survivor-height-evaluability',
  'imp-36103-w1-accumulator-recovery-nstability',
  'imp-36104-kbn-kahan-separation-onset-viz-data',
  'imp-36105-recovery-detuning-width-viz-data',
  'imp-36106-duplicate-ticket-honest-status',
  'imp-36107-duplicate-ticket-honest-status',
  'imp-36109-imp3603x46x61x62x-registration-reachability-audit',
  'imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit',
  'imp-36111-e-share-tail-storyline-crossref',
  'imp-36112-compensated-summation-storyline-crossref',
  'imp-36113-kbn-kahan-intermittency-fine-resolution',
  'imp-36114-kbn-kahan-ratio-decay-law-fit',
  'imp-36115-joint-2d-recovery-locus-duplicate-audit',
  'imp-36116-kappa-monotonicity-ladder',
  'imp-36122-duplicate-ticket-honest-status',
  'imp-36123-duplicate-ticket-honest-status',
  'imp-36124-kbn-kahan-soft-onset-honest-status',
  'imp-36125-w1-accumulator-recovery-margin-honest-status',
  'imp-36127-imp3603x-3606x-cross-reference-integrity-audit',
  'imp-36128-duplicate-ticket-honest-status',
  'imp-36129-orphaned-module-registration-audit-honest-status',
  'imp-36130-naive-vs-compensated-conditioning-growth-honest-status',
  'imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status',
  'imp-36144-kbn-kahan-intermittency-band-viz-data',
  'imp-36145-joint-recovery-contour-viz-data',
  'imp-36146-precision-non-binding-consolidated-honest-status',
  'imp-36147-routeB-consumable-modulo-anchor-honest-status',
  'imp-36148-imp3608x9x-cross-reference-integrity-audit',
  'imp-36161-duplicate-ticket-honest-status',
  'imp-36162-duplicate-ticket-honest-status',
  'imp-36164-perN-translation-storyline-cross-reference',
  'imp-36165-sharecoll-vs-sole-survivor-honest-status',
  'imp-36166-residual-node-storyline-cross-reference',
];

const NON_FILE_TICKET_TARGETS = ['imp-36108-preseed-vizdata-duplicate-guard'];

const DISTINCT_FILENAME_TARGETS_CHECKED = 86; // distinct filename-suffixed @see/import targets across the cohort
const DISTINCT_NAMED_IMPORTS_CHECKED = 27; // distinct named ES import bindings checked against target exports
const DISTINCT_BARE_CITATIONS_CHECKED = 22; // distinct bare imp-NNNNN citations (excludes 3 prose wildcard tokens)
const DANGLING_REFERENCES_FOUND = 0;

export const IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT = {
  id: 'imp-36190',
  proofSection: 'audit',
  question:
    'Do the @see tags, ES-module import targets, and bare imp-NNNNN ticket citations in ' +
    'the imp-36098..imp-36166 S-frontier cohort (37 src/data files) all resolve to real ' +
    'files, real exported symbols, and real tickets -- or are there dangling references ' +
    '(the imp-58685 typo class)?',
  verdictShort:
    'CLEAN. Zero dangling references found across all 37 audited files. 85 of 86 distinct ' +
    'filename-suffixed @see/import targets resolve to a real src/data file; the one ' +
    'exception (imp-36108-preseed-vizdata-duplicate-guard) resolves to a real completed ' +
    'ticket delivered as a scripts/ change, not a standalone file -- a known non-file- ' +
    'ticket pattern, not a dangling reference. All 27 named ES imports resolve to real ' +
    'exports. All 22 distinct bare imp-NNNNN citations resolve to real tickets.',
  auditedCohort: AUDITED_COHORT,
  auditedCohortCount: AUDITED_COHORT.length, // 37
  nonFileTicketTargets: NON_FILE_TICKET_TARGETS,
  distinctFilenameTargetsChecked: DISTINCT_FILENAME_TARGETS_CHECKED,
  distinctNamedImportsChecked: DISTINCT_NAMED_IMPORTS_CHECKED,
  distinctBareCitationsChecked: DISTINCT_BARE_CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'every @see tag, ES import specifier, and bare imp-NNNNN citation in the 37 named ' +
    'imp-36098..imp-36166 cohort files against the actual src/data file listing, each ' +
    'target file’s real export statements, and the ticket ids recorded in ' +
    'improvement-queue.js / improvements.js. Result: zero dangling references, zero ' +
    'misnamed exports. No source file required correction. Changes no bound; establishes ' +
    'no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35186 (cross-reference integrity audit method); imp-36110/imp-36127/imp-36148/' +
    'imp-36170 (sibling audits, prior cohorts); imp-36189 (sibling registration/' +
    'reachability audit, same cohort); imp-36098..imp-36166 (the audited cohort).',
};

export const IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36190-audited-thirtyseven-files',
    description: 'the audit covers exactly the 37 named imp-36098..imp-36166 cohort files',
    holds: () => IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.auditedCohortCount === 37,
  },
  {
    id: 'imp36190-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or bare ticket citations',
    holds: () => IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36190-citation-counts-recorded',
    description: 'the distinct filename-target, named-import, and bare-citation counts checked are all positive',
    holds: () =>
      IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctFilenameTargetsChecked > 0 &&
      IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctNamedImportsChecked > 0 &&
      IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctBareCitationsChecked > 0,
  },
  {
    id: 'imp36190-non-file-target-explained',
    description: 'the one non-resolving filename target is explicitly recorded, not silently dropped',
    holds: () =>
      IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.nonFileTicketTargets.length === 1 &&
      IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.nonFileTicketTargets[0] === 'imp-36108-preseed-vizdata-duplicate-guard',
  },
  {
    id: 'imp36190-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36190-imp36098-166-cross-reference-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP36190_CROSS_REFERENCE_INTEGRITY_AUDIT;
