/**
 * @module imp-35644-imp3559x-imp361x-frontier-crossref-integrity-audit
 *
 * imp-35644 (meta, audit): a cross-reference integrity check (imp-35186/imp-35327/imp-35629
 * method) on the newest committed frontier cohort, the 14 src/data files whose leading numeric
 * id falls in [35593, 35614] (imp-35629 scoped [35539, 35590]; this ticket picks up the next
 * unaudited id range, matching exactly the ticket's own imp-35593..imp-35614 span).
 *
 * METHOD. Listed every src/data/imp-NNNNN-*.js file whose leading numeric id falls in
 * [35593, 35614] (14 files found -- the intervening ids belong to non-data-file tickets). For
 * each, resolved every filename-suffixed @see target and ES-module import specifier against the
 * src/data directory listing, every named import (IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING,
 * IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE, IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE,
 * IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE, IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE,
 * effectiveHeightForN, C_C_PINNED, IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY,
 * IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY) against the target file's actual `export`
 * statements, every bare "imp-NNNNN" ticket citation (no filename suffix, 70 distinct ids across
 * the cohort) against an `id: 'imp-NNNNN'` entry in improvement-queue.js, a matching summary in
 * improvements.js, a matching src/data filename, or a matching git commit (the two
 * "guard-already-satisfied" audits in this cohort, imp-35613/imp-35614, cite git commits
 * imp-35599/imp-35602 directly by design), and cross-checked repeated landmark numeric literals
 * (N_max ~9.2186e5, N_cross ~3.280294352e9, sigma_max ~0.94942901) for consistency against their
 * imp-35337 source.
 *
 * FINDING -- ONE DANGLING @see REFERENCE, a NEW OCCURRENCE of the imp-35629-documented dangling
 * target inside this cohort's own range:
 *
 *   imp-35606-imp35561-page-registration-reachability-audit.js line 39 cites
 *   "@see imp-35484-imp35410x-registration-reachability-audit", but imp-35484 was completed as an
 *   inline fix recorded only in improvements.js (id 30544, wiring three modules into
 *   scripts/run-assertions.mjs) -- it never produced a dedicated src/data file, so no file of that
 *   name, or any name, exists for imp-35484. This is the SAME dangling target the imp-35629 audit
 *   already found in imp-35545-imp354xx-registration-reachability-audit.js (a file outside the
 *   [35539,35590] range imp-35629 covered) -- imp-35606 independently copied the same citation
 *   pattern ("prior audit establishing the method") into a file inside THIS cohort's range, so it
 *   was not yet flagged. The correct form is a bare "imp-35484" citation (no filename suffix), as
 *   imp-35606's own line 38 already does correctly for imp-35545.
 *
 * This citation names the CORRECT ticket id (imp-35484) and the surrounding prose otherwise uses
 * it correctly -- only the filename suffix appended to the @see tag is wrong, because no such
 * file was ever produced. This is documentation-only drift: no import statement, no code path, and
 * no numerical result in imp-35606 depends on the incorrect @see string.
 *
 * Everything else audited resolves cleanly: all 9 distinct named-import targets resolve to real
 * src/data files with matching exports; all 70 distinct bare imp-NNNNN ticket citations resolve to
 * a real ticket, improvements.js entry, src/data filename, or git commit; the two
 * git-commit-citing "guard-already-satisfied" audits (imp-35613 -> imp-35599, imp-35614 ->
 * imp-35602) both resolve to real commits (9dc3d750, 5c17aaba respectively); repeated landmark
 * literals (N_max ~9.2186e5, N_cross ~3.280294352e9) are byte-consistent with their imp-35337
 * source across every citing file (imp-35596, imp-35611); every audited file carries an explicit
 * NO-QED / Platt-Trudgian-Lambda-no-refereed-bound-change disclaimer.
 *
 * SCOPE. Read-only cross-reference audit only. Per the established convention in this series
 * (imp-35186 found and flagged; imp-35309 later fixed as a separate ticket; imp-35629 repeated the
 * pattern), this audit FLAGS the dangling reference but does not itself edit imp-35606 -- that
 * correction, and the still-open imp-35545/imp-35531/imp-35536/imp-35561 corrections from prior
 * batches, are left to a follow-up ticket. Changes no bound; establishes no operator positivity;
 * no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35629-imp3554x-imp3558x-frontier-crossref-integrity-audit (prior batch in the same series, [35539,35590])
 * @see imp-35589-imp3550x-imp3553x-frontier-crossref-integrity-audit (earlier batch, [35505,35538])
 * @see imp-35309 (precedent: a prior audit finding was fixed as a separate follow-up ticket)
 * @see imp-35484 (the ticket the imp-35606 dangling @see should have cited by id only -- it has no dedicated file)
 * @see imp-35606-imp35561-page-registration-reachability-audit (the file carrying the dangling reference)
 */

const AUDITED_ID_RANGE = { lo: 35593, hi: 35614 };

const AUDITED_FILES = [
  'imp-35593-peak-damping-viz-data',
  'imp-35594-peak-crossover-mechanism-derivation',
  'imp-35596-threshold-collapse-literals-assertion',
  'imp-35597-threshold-collapse-viz-data',
  'imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions',
  'imp-35604-route-ii-landmark-data-reachability-scope',
  'imp-35606-imp35561-page-registration-reachability-audit',
  'imp-35607-n2000-bs3-dt8-endpoint-positivity-reference',
  'imp-35608-two-rate-census-exit-edge-location',
  'imp-35609-peak-damping-input-sensitivity',
  'imp-35611-crossover-bracketing-literals-assertion',
  'imp-35612-cubic-skew-height-map-literals-assertion',
  'imp-35613-reentry-band-decade-gap-guard-already-satisfied-audit',
  'imp-35614-bs3-dt4-3x3-guard-already-satisfied-audit',
];

const DANGLING_REFERENCES = [
  {
    inFile: 'imp-35606-imp35561-page-registration-reachability-audit.js',
    citedTarget: 'imp-35484-imp35410x-registration-reachability-audit',
    correctTarget: null,
    kind: 'filename-suffixed @see for a ticket that has no dedicated src/data file (imp-35484 was completed inline in improvements.js id 30544 / scripts/run-assertions.mjs); same dangling target imp-35629 already found in imp-35545, now also present in this cohort',
  },
];

const DANGLING_REFERENCES_FOUND = DANGLING_REFERENCES.length; // 1

const NAMED_IMPORTS_CHECKED = [
  { symbol: 'IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING', target: 'imp-35574-peak-location-height-map-damping.js' },
  { symbol: 'IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE', target: 'imp-35571-route-i-subleading-rate-scope.js' },
  { symbol: 'IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE', target: 'imp-35452-n2000-endpoint-positivity-knife-edge-reference.js' },
  { symbol: 'IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE', target: 'imp-35477-n2000-bs3-dense-crossvalidate-reference.js' },
  { symbol: 'IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE', target: 'imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js' },
  { symbol: 'effectiveHeightForN', target: 'lambda-rh-height-mapping.js' },
  { symbol: 'C_C_PINNED', target: 'polymath15-constant-C-C.js' },
  { symbol: 'IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY', target: 'imp-35555-crossover-bracketing-family-sensitivity.js' },
  { symbol: 'IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY', target: 'imp-35557-cubic-skew-height-map-sensitivity.js' },
];

const GIT_COMMIT_CITATIONS_CHECKED = [
  { inFile: 'imp-35613-reentry-band-decade-gap-guard-already-satisfied-audit.js', citedCommit: 'imp-35599', resolvesTo: '9dc3d750' },
  { inFile: 'imp-35614-bs3-dt4-3x3-guard-already-satisfied-audit.js', citedCommit: 'imp-35602', resolvesTo: '5c17aaba' },
];

export const IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35644',
  proofSection: 'audit',
  auditedIdRange: AUDITED_ID_RANGE,
  question:
    'Do the src/data files whose leading numeric id falls in [35593, 35614] carry any dangling ' +
    '@see targets, ES-module import targets, named-import/export mismatches, git-commit ' +
    'citations, or bare imp-NNNNN ticket citations, and are repeated landmark literals ' +
    'self-consistent?',
  verdictShort:
    'ONE DANGLING @see REFERENCE FOUND: imp-35606 cites imp-35484-imp35410x-registration-' +
    'reachability-audit, a file that was never created (imp-35484 was completed inline, no ' +
    'dedicated data file) -- the same dangling target the imp-35629 audit already found in ' +
    'imp-35545, now also present in this cohort. Every named import, git-commit citation, bare ' +
    'imp-NNNNN citation, and repeated landmark literal across all 14 audited files resolves ' +
    'cleanly.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 14
  namedImportsChecked: NAMED_IMPORTS_CHECKED,
  gitCommitCitationsChecked: GIT_COMMIT_CITATIONS_CHECKED,
  bareCitationDistinctCount: 70,
  danglingReferences: DANGLING_REFERENCES,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, git-commit citation, and bare imp-NNNNN citation in the 14 src/data ' +
    'files whose filename id falls in [35593, 35614] against the actual src/data directory ' +
    'listing, improvement-queue.js/improvements.js ticket records, and git log. Result: one ' +
    'dangling @see reference found -- flagged here per the imp-35186/imp-35309/imp-35629 ' +
    'convention (audit flags, a follow-up ticket fixes); no source file was edited by this audit. ' +
    'No misnamed exports, no missing files, no landmark-literal drift otherwise. Changes no ' +
    'bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35186 (prior audit method), imp-35327/imp-35401/imp-35424/imp-35543/imp-35589/imp-35629 ' +
    '(prior batches in the same series), imp-35309 (precedent: audit-flags / ' +
    'follow-up-ticket-fixes pattern).',
};

export const IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35644-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35593, 35614] as scoped by the imp-35644 ticket',
    holds: () =>
      IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.lo === 35593 &&
      IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.hi === 35614,
  },
  {
    id: 'imp35644-audited-file-count',
    description: 'the audit covered all 14 src/data files whose leading id falls in the range',
    holds: () => IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 14,
  },
  {
    id: 'imp35644-one-dangling-reference-found',
    description: 'the audit found exactly 1 dangling @see reference',
    holds: () =>
      IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 1 &&
      IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferences.length === 1,
  },
  {
    id: 'imp35644-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35644_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35644-imp3559x-imp361x-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
