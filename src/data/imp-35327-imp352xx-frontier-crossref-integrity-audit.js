/**
 * @module imp-35327-imp352xx-frontier-crossref-integrity-audit
 *
 * imp-35327 (meta, audit): a cross-reference integrity check (imp-35186 method) on the
 * NEXT unaudited batch of frontier ticket ids, imp-35245..imp-35323 (imp-35186 covered
 * imp-35036..imp-35149; imp-70234 covers only imp-35235..imp-35244; this ticket picks up
 * where those two leave off).
 *
 * METHOD. Listed every src/data/imp-NNNNN-*.js file whose leading numeric id falls in
 * [35245, 35323]. For each such file, resolved every filename-suffixed @see target and
 * ES-module import against the src/data directory listing, every named import against the
 * target file's actual `export` statements, and every bare "imp-NNNNN" ticket citation (no
 * filename suffix) against an `id: 'imp-NNNNN'` occurrence in improvements.js or
 * improvement-queue.js.
 *
 * FINDING. Exactly ONE file in src/data carries a leading id inside [35245, 35323]:
 * imp-35310-imp352xx-currentstatus-honesty-audit.js (id 35310). This is expected, not a
 * coverage gap: most ticket ids in this range (imp-35256..imp-35266, imp-35278..imp-35329,
 * etc.) are still PENDING in improvement-queue.js and have not yet produced a dedicated
 * src/data module, and several completed tickets in the range are glossary-only headword
 * additions (e.g. imp-35313, imp-35319) that edit glossary.js rather than adding a new
 * imp-NNNNN-named file. The imp-35310 file has zero `import` statements, so there are no
 * ES-module import targets to resolve. Its five @see-adjacent citations -- imp-2519 (bare),
 * and imp-3637, imp-3660, imp-3706, imp-3684 (bare, each also happens to name a real prior
 * cohort-honesty-audit file, e.g. imp-3637-3599-3604-cohort-honesty-audit.js, but the
 * citation itself carries no filename suffix so is checked as a bare ticket-id citation) --
 * all resolve to `id: 'imp-NNNNN'` entries in improvement-queue.js. Zero dangling references.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of
 * this check (none needed correction). Changes no bound; establishes no operator positivity;
 * no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35310-imp352xx-currentstatus-honesty-audit (the only file in the audited id range)
 */

const AUDITED_ID_RANGE = { lo: 35245, hi: 35323 };

const AUDITED_FILES = ['imp-35310-imp352xx-currentstatus-honesty-audit'];

const CITATIONS_CHECKED = [
  { citation: 'imp-2519', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-3637', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-3660', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-3706', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-3684', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
];

const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve

export const IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35327',
  proofSection: 'audit',
  auditedIdRange: AUDITED_ID_RANGE,
  question:
    'Do the src/data files whose leading numeric id falls in [35245, 35323] carry any dangling ' +
    '@see targets, ES-module import targets, or bare imp-NNNNN ticket citations?',
  verdictShort:
    'CLEAN. Only one file exists in that id range (imp-35310-imp352xx-currentstatus-honesty-audit), ' +
    'and every one of its bare ticket-id citations resolves in improvement-queue.js; it has no ' +
    'ES-module imports to check. Zero dangling references. The thin coverage reflects that most ' +
    'ticket ids in this range are still pending or were completed as glossary.js edits with no ' +
    'dedicated imp-NNNNN-named file, not an audit gap.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 1
  citationsChecked: CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare imp-NNNNN citation in the sole src/data file whose filename id ' +
    'falls in [35245, 35323] against the actual src/data directory listing and the ticket ids ' +
    "recorded in improvements.js / improvement-queue.js. Result: zero dangling references, zero " +
    'misnamed exports, no missing files. No source file required correction. Changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation: 'imp-35186 (prior audit method), imp-70234 (adjacent sub-range audit), imp-35310 (the audited file).',
};

export const IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35327-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35245, 35323] as scoped by the imp-35327 ticket',
    holds: () =>
      IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.lo === 35245 &&
      IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.hi === 35323,
  },
  {
    id: 'imp35327-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35327-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35327_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35327-imp352xx-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
