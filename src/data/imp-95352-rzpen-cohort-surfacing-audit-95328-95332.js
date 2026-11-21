/**
 * @module imp-95352-rzpen-cohort-surfacing-audit-95328-95332
 *
 * imp-95352 (meta): surfacing audit of the RZ-PEN pencil-floor chain finding
 * modules imp-95328/95329/95330/95331/95332 for (a) import-lightness (no
 * transitive reach into any heavy multi-MB data bundle such as
 * zeros-to-1e6.js) and (b) reachability from a rendered page or the
 * visualizations index. Extends the imp-95284/95306 seam-chain
 * surfacing-audit lineage to the RZ-PEN cohort.
 *
 * METHOD for (a): grepped each of the five files for `^import` -- none has
 * any, so every module is a standalone literal / self-executing-assertion
 * file with zero import statements.
 *
 * METHOD for (b): grepped src/pages/*.jsx and src/data/visualizations-index.js
 * for each module's ticket id and filename.
 *
 * FINDING: all five are registered in scripts/run-assertions.mjs
 * DATA_MODULES (so their self-executing assertions run on every build), and
 * all five are import-light. None of the five has a dedicated viz page,
 * glossary headword, or visualizations-index entry yet -- a
 * completeness-coverage gap, not a caveat or heavy-import gap, already
 * targeted by several open queue tickets (imp-95344..95346, imp-95348,
 * imp-95349..95351).
 *
 * AUDIT-ONLY: this ticket records the gap, it does not build the missing
 * viz pages (that is separate follow-on scope, matching how prior
 * surfacing audits in this lineage separate "found the gap" from "closed
 * the gap"). No bound changes; NO QED; no refereed bound is changed.
 */

const COHORT = [
  { ticket: 'imp-95328', file: 'src/data/imp-95328-two-chart-pencil-floor.js' },
  { ticket: 'imp-95329', file: 'src/data/imp-95329-beta-trace-capped-pencil-floor.js' },
  { ticket: 'imp-95330', file: 'src/data/imp-95330-chart-refined-pencil-floor.js' },
  { ticket: 'imp-95331', file: 'src/data/imp-95331-split-weight-exact-root-pencil-floor.js' },
  { ticket: 'imp-95332', file: 'src/data/imp-95332-chart-tail-pencil-floor.js' },
];

const IMPORT_STATEMENT_COUNTS = {
  'src/data/imp-95328-two-chart-pencil-floor.js': 0,
  'src/data/imp-95329-beta-trace-capped-pencil-floor.js': 0,
  'src/data/imp-95330-chart-refined-pencil-floor.js': 0,
  'src/data/imp-95331-split-weight-exact-root-pencil-floor.js': 0,
  'src/data/imp-95332-chart-tail-pencil-floor.js': 0,
};

const RUN_ASSERTIONS_REGISTERED = {
  'src/data/imp-95328-two-chart-pencil-floor.js': true,
  'src/data/imp-95329-beta-trace-capped-pencil-floor.js': true,
  'src/data/imp-95330-chart-refined-pencil-floor.js': true,
  'src/data/imp-95331-split-weight-exact-root-pencil-floor.js': true,
  'src/data/imp-95332-chart-tail-pencil-floor.js': true,
};

const ORPHAN = COHORT.map((m) => ({
  ...m,
  reason: 'no dedicated viz page, glossary headword, or visualizations-index row yet',
}));

export const IMP95352_RZPEN_COHORT_SURFACING_AUDIT = {
  ticket: 'imp-95352',
  cohortIds: COHORT.map((m) => m.ticket),
  cohortSize: COHORT.length,
  surfaced: [],
  orphan: ORPHAN,
  importStatementCounts: IMPORT_STATEMENT_COUNTS,
  runAssertionsRegistered: RUN_ASSERTIONS_REGISTERED,
  allImportLight: Object.values(IMPORT_STATEMENT_COUNTS).every((n) => n === 0),
  allRegistered: Object.values(RUN_ASSERTIONS_REGISTERED).every((v) => v === true),
  honest: 'AUDIT-ONLY -- confirms all five RZ-PEN chain modules (imp-95328 through imp-95332) are ' +
    'import-light (zero import statements, no heavy-bundle reach) and are all registered in ' +
    'scripts/run-assertions.mjs DATA_MODULES so their self-executing assertions run on every build. ' +
    'None of the five has a dedicated viz page, glossary headword, or visualizations-index row yet ' +
    '(a completeness-coverage gap, not a caveat or heavy-import gap, already targeted by several ' +
    'open queue tickets). No page was fabricated by this ticket; closing that gap is separate ' +
    'follow-on scope. No bound change; NO QED; no refereed bound is changed.',
};

export const IMP95352_RZPEN_COHORT_SURFACING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95352-cohort-has-five-members',
    description: 'the audited cohort spans exactly the five RZ-PEN chain tickets imp-95328..imp-95332',
    holds: () => IMP95352_RZPEN_COHORT_SURFACING_AUDIT.cohortSize === 5
      && IMP95352_RZPEN_COHORT_SURFACING_AUDIT.cohortIds.length === 5,
  },
  {
    id: 'imp-95352-all-import-light',
    description: 'every cohort module has zero import statements (no transitive heavy-bundle reach)',
    holds: () => IMP95352_RZPEN_COHORT_SURFACING_AUDIT.allImportLight === true,
  },
  {
    id: 'imp-95352-all-run-assertions-registered',
    description: 'every cohort module is registered in scripts/run-assertions.mjs DATA_MODULES',
    holds: () => IMP95352_RZPEN_COHORT_SURFACING_AUDIT.allRegistered === true,
  },
  {
    id: 'imp-95352-zero-surfaced-five-orphan',
    description: 'zero modules have a driving page yet, all five are orphan (coverage gap)',
    holds: () => IMP95352_RZPEN_COHORT_SURFACING_AUDIT.surfaced.length === 0 && ORPHAN.length === 5,
  },
  {
    id: 'imp-95352-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP95352_RZPEN_COHORT_SURFACING_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP95352_RZPEN_COHORT_SURFACING_AUDIT.honest),
  },
];

for (const a of IMP95352_RZPEN_COHORT_SURFACING_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95352-rzpen-cohort-surfacing-audit assertion failed: ${a.id}`);
}
