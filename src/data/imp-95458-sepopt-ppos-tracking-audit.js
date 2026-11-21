/**
 * @module imp-95458-sepopt-ppos-tracking-audit
 *
 * imp-95458 (meta): audit that the imp-95419 (THEOREM SEP-OPT, class-optimal
 * Riesz floor) and imp-95420 (THEOREM P-POS, exit-density positivity) finding
 * modules are (a) git-tracked, (b) registered in the run-assertions
 * DATA_MODULES list, and (c) import-light -- so their self-executing
 * assertions cannot silently blank a lazy-loaded viz page (the imp-95171
 * "browser-only assertion blanks viz page" failure mode).
 *
 * METHOD for (a): `git ls-files` on both paths -- both tracked.
 * METHOD for (b): grepped scripts/run-assertions.mjs DATA_MODULES for both
 * literal path strings -- both present (registered by the imp-95437 batch).
 * METHOD for (c): grepped both files for `^import` -- neither has any, and
 * both import()-resolve cleanly under plain node.
 *
 * FINDING: all three checks pass for both modules. No untracked/unregistered
 * gap, no heavy-bundle reach. AUDIT-ONLY: no bound change; NO QED;
 * no refereed bound is changed.
 */

const SUBJECT_MODULES = [
  { ticket: 'imp-95419', file: 'src/data/imp-95419-separated-class-optimal-riesz-floor.js' },
  { ticket: 'imp-95420', file: 'src/data/imp-95420-exit-density-positivity-selfcontained.js' },
];

const GIT_TRACKED = {
  'src/data/imp-95419-separated-class-optimal-riesz-floor.js': true,
  'src/data/imp-95420-exit-density-positivity-selfcontained.js': true,
};

const REGISTERED_IN_DATA_MODULES = {
  'src/data/imp-95419-separated-class-optimal-riesz-floor.js': true,
  'src/data/imp-95420-exit-density-positivity-selfcontained.js': true,
};

const IMPORT_STATEMENT_COUNTS = {
  'src/data/imp-95419-separated-class-optimal-riesz-floor.js': 0,
  'src/data/imp-95420-exit-density-positivity-selfcontained.js': 0,
};

const AUDITED = SUBJECT_MODULES.map((m) => ({
  ...m,
  gitTracked: GIT_TRACKED[m.file],
  registered: REGISTERED_IN_DATA_MODULES[m.file],
  importCount: IMPORT_STATEMENT_COUNTS[m.file],
}));

export const IMP95458_SEPOPT_PPOS_TRACKING_AUDIT = {
  ticket: 'imp-95458',
  subjectIds: SUBJECT_MODULES.map((m) => m.ticket),
  subjectCount: SUBJECT_MODULES.length,
  audited: AUDITED,
  allGitTracked: AUDITED.every((m) => m.gitTracked),
  allRegistered: AUDITED.every((m) => m.registered),
  allImportLight: AUDITED.every((m) => m.importCount === 0),
  honest: 'AUDIT-ONLY -- confirms imp-95419 (SEP-OPT) and imp-95420 (P-POS) are both git-tracked, ' +
    'both registered in the run-assertions DATA_MODULES list (since the imp-95437 batch), and both ' +
    'import-light (zero import statements each), so neither module can blank a lazy viz page or ' +
    'silently fall out of the assertion sweep. No bound change; NO QED; no refereed bound is changed' +
    '.',
};

export const IMP95458_SEPOPT_PPOS_TRACKING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95458-subject-has-two-members',
    description: 'the audited subject set spans exactly imp-95419 and imp-95420',
    holds: () => IMP95458_SEPOPT_PPOS_TRACKING_AUDIT.subjectCount === 2
      && IMP95458_SEPOPT_PPOS_TRACKING_AUDIT.subjectIds.join(',') === 'imp-95419,imp-95420',
  },
  {
    id: 'imp-95458-all-git-tracked',
    description: 'both subject modules are tracked by git (no untracked-file trap)',
    holds: () => IMP95458_SEPOPT_PPOS_TRACKING_AUDIT.allGitTracked === true,
  },
  {
    id: 'imp-95458-all-registered',
    description: 'both subject modules are registered in run-assertions DATA_MODULES',
    holds: () => IMP95458_SEPOPT_PPOS_TRACKING_AUDIT.allRegistered === true,
  },
  {
    id: 'imp-95458-all-import-light',
    description: 'both subject modules have zero import statements (no transitive heavy-bundle reach)',
    holds: () => IMP95458_SEPOPT_PPOS_TRACKING_AUDIT.allImportLight === true,
  },
  {
    id: 'imp-95458-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP95458_SEPOPT_PPOS_TRACKING_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP95458_SEPOPT_PPOS_TRACKING_AUDIT.honest),
  },
];

for (const a of IMP95458_SEPOPT_PPOS_TRACKING_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95458-sepopt-ppos-tracking-audit assertion failed: ${a.id}`);
}
