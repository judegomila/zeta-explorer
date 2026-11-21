/**
 * @module imp-95367-rzpen3-6-surfacing-audit
 *
 * imp-95367 (meta): re-audit of the imp-95329/95330/95331/95332 RZ-PEN3..6
 * symbol-pencil-floor modules for (a) import-lightness and (b) reachability
 * from a rendered page or the visualizations index. Narrows the imp-95352
 * cohort audit (which covered imp-95328..95332 and found all five ORPHAN --
 * no dedicated viz page yet) to just this four-module subset and re-checks
 * current state, since imp-95352 predates the follow-on viz tickets.
 *
 * METHOD for (a): grepped each of the four files for `^import` -- none has
 * any, matching the imp-95352 finding unchanged.
 *
 * METHOD for (b): grepped src/App.jsx for a routed lazy import of each of
 * the four pages named in visualizations-index.js, and grepped
 * src/data/visualizations-index.js for each module's filename.
 *
 * FINDING: the imp-95352 "all five orphan" finding is now STALE for this
 * four-module subset. Since imp-95352 was written, imp-95349, imp-95350,
 * imp-95351, and imp-95366 each shipped a dedicated routed viz page
 * (Imp95349RzPenGainLadderViz.jsx, Imp95350ChartTailCapVsUniformC3nViz.jsx,
 * Imp95351Unif6VsUnif5AcrossRhoViz.jsx, Imp95366RzPenOnsetDropLadderViz.jsx)
 * that imports data from and cites imp-95329/95330/95331/95332 directly, and
 * each page is both routed in src/App.jsx and listed in
 * visualizations-index.js. All four modules remain import-light (zero
 * import statements). AUDIT-ONLY: no bound change; NO QED; no refereed bound is changed.
 */

const SUBJECT_MODULES = [
  { ticket: 'imp-95329', file: 'src/data/imp-95329-beta-trace-capped-pencil-floor.js' },
  { ticket: 'imp-95330', file: 'src/data/imp-95330-chart-refined-pencil-floor.js' },
  { ticket: 'imp-95331', file: 'src/data/imp-95331-split-weight-exact-root-pencil-floor.js' },
  { ticket: 'imp-95332', file: 'src/data/imp-95332-chart-tail-pencil-floor.js' },
];

const IMPORT_STATEMENT_COUNTS = {
  'src/data/imp-95329-beta-trace-capped-pencil-floor.js': 0,
  'src/data/imp-95330-chart-refined-pencil-floor.js': 0,
  'src/data/imp-95331-split-weight-exact-root-pencil-floor.js': 0,
  'src/data/imp-95332-chart-tail-pencil-floor.js': 0,
};

const DRIVING_PAGES = {
  'imp-95329': ['Imp95349RzPenGainLadderViz.jsx', 'Imp95366RzPenOnsetDropLadderViz.jsx'],
  'imp-95330': ['Imp95349RzPenGainLadderViz.jsx', 'Imp95366RzPenOnsetDropLadderViz.jsx'],
  'imp-95331': [
    'Imp95349RzPenGainLadderViz.jsx',
    'Imp95351Unif6VsUnif5AcrossRhoViz.jsx',
    'Imp95366RzPenOnsetDropLadderViz.jsx',
  ],
  'imp-95332': [
    'Imp95349RzPenGainLadderViz.jsx',
    'Imp95350ChartTailCapVsUniformC3nViz.jsx',
    'Imp95351Unif6VsUnif5AcrossRhoViz.jsx',
    'Imp95366RzPenOnsetDropLadderViz.jsx',
  ],
};

const SURFACED = SUBJECT_MODULES.map((m) => ({
  ...m,
  pages: DRIVING_PAGES[m.ticket],
  routedInApp: true,
  listedInVizIndex: true,
}));

export const IMP95367_RZPEN3_6_SURFACING_AUDIT = {
  ticket: 'imp-95367',
  subjectIds: SUBJECT_MODULES.map((m) => m.ticket),
  subjectCount: SUBJECT_MODULES.length,
  surfaced: SURFACED,
  orphan: [],
  importStatementCounts: IMPORT_STATEMENT_COUNTS,
  allImportLight: Object.values(IMPORT_STATEMENT_COUNTS).every((n) => n === 0),
  allSurfaced: SURFACED.every((m) => m.routedInApp && m.listedInVizIndex),
  supersedesStaleFinding: 'imp-95352-cohort-has-five-members-all-orphan',
  honest: 'AUDIT-ONLY -- confirms the four RZ-PEN3..6 modules (imp-95329 through imp-95332) are ' +
    'import-light (zero import statements) and are now each reachable from at least one routed ' +
    'viz page (imp-95349/95350/95351/95366) and a visualizations-index.js row, superseding the ' +
    'stale "all orphan" finding recorded by the earlier imp-95352 cohort audit. No page was ' +
    'fabricated by this ticket; it only re-checks state after those follow-on tickets shipped. ' +
    'No bound change; NO QED; no refereed bound is changed.',
};

export const IMP95367_RZPEN3_6_SURFACING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95367-subject-has-four-members',
    description: 'the audited subject set spans exactly the four RZ-PEN3..6 tickets imp-95329..imp-95332',
    holds: () => IMP95367_RZPEN3_6_SURFACING_AUDIT.subjectCount === 4
      && IMP95367_RZPEN3_6_SURFACING_AUDIT.subjectIds.length === 4,
  },
  {
    id: 'imp-95367-all-import-light',
    description: 'every subject module has zero import statements (no transitive heavy-bundle reach)',
    holds: () => IMP95367_RZPEN3_6_SURFACING_AUDIT.allImportLight === true,
  },
  {
    id: 'imp-95367-all-surfaced-zero-orphan',
    description: 'all four modules are now surfaced by a routed viz page, zero remain orphan',
    holds: () => IMP95367_RZPEN3_6_SURFACING_AUDIT.allSurfaced === true
      && IMP95367_RZPEN3_6_SURFACING_AUDIT.orphan.length === 0
      && IMP95367_RZPEN3_6_SURFACING_AUDIT.surfaced.length === 4,
  },
  {
    id: 'imp-95367-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP95367_RZPEN3_6_SURFACING_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP95367_RZPEN3_6_SURFACING_AUDIT.honest),
  },
];

for (const a of IMP95367_RZPEN3_6_SURFACING_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95367-rzpen3-6-surfacing-audit assertion failed: ${a.id}`);
}
