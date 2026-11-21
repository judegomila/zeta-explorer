/**
 * @module imp-95407-rzpen7-8-surfacing-audit
 *
 * imp-95407 (meta): extends the imp-95367 RZ-PEN3..6 (imp-95329..95332)
 * surfacing audit -- which found all four of those modules now reachable
 * from a dedicated routed viz page -- to the next two modules in the same
 * chain: imp-95333 (RZ-PEN7 / LEMMA PAIR-2) and imp-95334 (RZ-PEN8 /
 * LEMMA T-EXACT).
 *
 * METHOD for (a) import-lightness: grepped both files for `^import` --
 * neither has any (zero import statements, no transitive zeros-bundle
 * reach), matching the RZ-PEN3..6 pattern.
 *
 * METHOD for (b) reachability: grepped src/App.jsx and
 * src/data/visualizations-index.js for each module's ticket id and
 * filename, and grepped the whole src/ tree for any file importing
 * either module.
 *
 * FINDING: unlike RZ-PEN3..6, neither RZ-PEN7 nor RZ-PEN8 has a dedicated
 * routed viz page. Both are ORPHAN: no hit in src/App.jsx, no row in
 * visualizations-index.js. The only file in the repo that references
 * either module's filename is imp-95406 (a data-only reconciliation note
 * that itself has no routed page and is not listed in
 * visualizations-index.js), so citation by imp-95406 does not establish
 * reachability. AUDIT-ONLY: no bound change; NO QED; no refereed bound is changed
 * . Flags a surfacing follow-up (dedicated viz
 * page for RZ-PEN7/8) as the open item, not a numerics gap.
 */

const SUBJECT_MODULES = [
  { ticket: 'imp-95333', label: 'RZ-PEN7 / LEMMA PAIR-2', file: 'src/data/imp-95333-pair-extended-pencil-floor.js' },
  { ticket: 'imp-95334', label: 'RZ-PEN8 / LEMMA T-EXACT', file: 'src/data/imp-95334-b-exact-trace-pencil-floor.js' },
];

const IMPORT_STATEMENT_COUNTS = {
  'src/data/imp-95333-pair-extended-pencil-floor.js': 0,
  'src/data/imp-95334-b-exact-trace-pencil-floor.js': 0,
};

const CITING_FILES = {
  'imp-95333': ['src/data/imp-95406-rzpen6-floor-gap-note-staleness-reconciliation.js'],
  'imp-95334': ['src/data/imp-95406-rzpen6-floor-gap-note-staleness-reconciliation.js'],
};

const SURFACED = SUBJECT_MODULES.map((m) => ({
  ...m,
  citingFiles: CITING_FILES[m.ticket],
  routedInApp: false,
  listedInVizIndex: false,
}));

export const IMP95407_RZPEN7_8_SURFACING_AUDIT = {
  ticket: 'imp-95407',
  subjectIds: SUBJECT_MODULES.map((m) => m.ticket),
  subjectCount: SUBJECT_MODULES.length,
  surfaced: [],
  orphan: SURFACED,
  importStatementCounts: IMPORT_STATEMENT_COUNTS,
  allImportLight: Object.values(IMPORT_STATEMENT_COUNTS).every((n) => n === 0),
  anySurfaced: SURFACED.some((m) => m.routedInApp && m.listedInVizIndex),
  extendsAudit: 'imp-95367-rzpen3-6-surfacing-audit',
  honest: 'AUDIT-ONLY -- confirms imp-95333 (RZ-PEN7) and imp-95334 (RZ-PEN8) are both import-light ' +
    '(zero import statements each) but, unlike the RZ-PEN3..6 cohort audited by imp-95367, neither ' +
    'has a dedicated routed viz page or a visualizations-index.js row; the only citing file is the ' +
    'data-only imp-95406 note, which does not itself establish reachability. Both remain ORPHAN. ' +
    'No page was fabricated by this ticket; it only records current state and flags a surfacing ' +
    'follow-up as the open item. No bound change; NO QED; no refereed bound is changed.',
};

export const IMP95407_RZPEN7_8_SURFACING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95407-subject-has-two-members',
    description: 'the audited subject set spans exactly the two RZ-PEN7/8 tickets imp-95333/imp-95334',
    holds: () => IMP95407_RZPEN7_8_SURFACING_AUDIT.subjectCount === 2
      && IMP95407_RZPEN7_8_SURFACING_AUDIT.subjectIds.length === 2,
  },
  {
    id: 'imp-95407-all-import-light',
    description: 'every subject module has zero import statements (no transitive heavy-bundle reach)',
    holds: () => IMP95407_RZPEN7_8_SURFACING_AUDIT.allImportLight === true,
  },
  {
    id: 'imp-95407-both-orphan',
    description: 'both modules are recorded as orphan (no routed page, no viz-index row), zero surfaced',
    holds: () => IMP95407_RZPEN7_8_SURFACING_AUDIT.anySurfaced === false
      && IMP95407_RZPEN7_8_SURFACING_AUDIT.orphan.length === 2
      && IMP95407_RZPEN7_8_SURFACING_AUDIT.surfaced.length === 0,
  },
  {
    id: 'imp-95407-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP95407_RZPEN7_8_SURFACING_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP95407_RZPEN7_8_SURFACING_AUDIT.honest),
  },
];

for (const a of IMP95407_RZPEN7_8_SURFACING_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95407-rzpen7-8-surfacing-audit assertion failed: ${a.id}`);
}
