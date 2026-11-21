// src/data/imp-33826-cohort-assertion-wiring-audit.js
//
// imp-33826: Audit whether the imp-33786/imp-33787/imp-33788/imp-33789 cohort's
// self-check tripwires are registered in scripts/run-assertions.mjs, mirroring
// the imp-3369 unwired-assertion-coverage audit for this specific four-module
// cohort (imp-33824's provenance roll-up catalogued the cohort's honest-banner
// coverage and import safety but never checked run-assertions.mjs wiring).
//
// MECHANISM (verified against scripts/run-assertions.mjs): the build-time sweep
// imports ONLY the file paths hard-listed in its MATH_MODULES / DATA_MODULES
// arrays and scans each loaded module's exports for *_ASSERTIONS arrays. A
// module's tripwires (whether an exported *_ASSERTIONS array walked by a
// `for` loop, or inline `if (...) throw` statements) execute at import time --
// but ONLY if something imports the module. If a module is absent from both
// lists AND not imported by any page/component/data module, its checks never
// fire anywhere in the build.
//
// GREP RESULT (2026-07-04): of the four cohort file paths, exactly ONE --
// '/src/data/imp-33789-decoupled-rate-grid.js' -- appears in
// scripts/run-assertions.mjs (DATA_MODULES, line ~3787). The other three --
// imp-33786-h3-joint-curvature-input-scoping.js,
// imp-33787-g7-perron-lower-bound.js, and
// imp-33788-eflow-displacement-sqrtlog-running-correction.js -- do NOT appear
// anywhere in run-assertions.mjs.
//
// A further check (grep for real `import ... from` statements, not comment
// mentions) across src/data confirms none of the three unwired modules is
// imported anywhere else in the codebase either -- imp-33794, imp-33824, and
// imp-33825 only mention their ids as text inside comments/strings, never as
// an ES import. So the three modules' tripwires currently execute NOWHERE.
//
// IMPORT-SAFETY CONTEXT (imp-33825): all four cohort modules are already
// heavy-import-safe (imp-33786/imp-33787/imp-33789 have zero imports;
// imp-33788 imports only effectiveHeightForN/C_C_PINNED, previously cleared).
// So wiring the three missing modules into DATA_MODULES would be a safe,
// low-risk follow-up in the same "KEEP-AND-WIRE" class as the imp-3369 light
// bucket -- not attempted here (audit-only, no run-assertions.mjs edit).

const COHORT_MODULES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33786',
    path: '/src/data/imp-33786-h3-joint-curvature-input-scoping.js',
    exportsAssertionsArray: true,
    assertionsExportName: 'IMP33786_H3_JOINT_CURVATURE_INPUT_ASSERTIONS',
    wiredInRunAssertions: false,
  }),
  Object.freeze({
    ticket: 'imp-33787',
    path: '/src/data/imp-33787-g7-perron-lower-bound.js',
    exportsAssertionsArray: false, // 7 inline self-executing if/throw tripwires instead of an *_ASSERTIONS array
    assertionsExportName: null,
    wiredInRunAssertions: false,
  }),
  Object.freeze({
    ticket: 'imp-33788',
    path: '/src/data/imp-33788-eflow-displacement-sqrtlog-running-correction.js',
    exportsAssertionsArray: true,
    assertionsExportName: 'IMP33788_EFLOW_DISPLACEMENT_SQRTLOG_RUNNING_CORRECTION_ASSERTIONS',
    wiredInRunAssertions: false,
  }),
  Object.freeze({
    ticket: 'imp-33789',
    path: '/src/data/imp-33789-decoupled-rate-grid.js',
    exportsAssertionsArray: true,
    assertionsExportName: 'IMP33789_DECOUPLED_RATE_GRID_ASSERTIONS',
    wiredInRunAssertions: true,
  }),
]);

const WIRED_COUNT = COHORT_MODULES.filter((m) => m.wiredInRunAssertions).length;
const UNWIRED_MODULES = COHORT_MODULES.filter((m) => !m.wiredInRunAssertions);
const UNWIRED_COUNT = UNWIRED_MODULES.length;

export const IMP33826_COHORT_ASSERTION_WIRING_AUDIT = Object.freeze({
  id: 'imp-33826-cohort-assertion-wiring-audit',
  ticket: 'imp-33826',
  cohort: COHORT_MODULES,
  wiredCount: WIRED_COUNT,
  unwiredCount: UNWIRED_COUNT,
  unwiredTickets: UNWIRED_MODULES.map((m) => m.ticket),

  summary:
    'Of the imp-33786/imp-33787/imp-33788/imp-33789 cohort, only ONE module ' +
    '(imp-33789-decoupled-rate-grid.js) is registered in scripts/run-assertions.mjs; the ' +
    'other three (imp-33786, imp-33787, imp-33788) are absent from both MATH_MODULES and ' +
    'DATA_MODULES and are not imported anywhere else in the codebase, so their self-check ' +
    'tripwires (exported *_ASSERTIONS arrays for imp-33786/imp-33788, inline if/throw ' +
    'tripwires for imp-33787) never execute during the build-time assertion sweep. All four ' +
    'modules are already heavy-import-safe (imp-33825), so wiring the three in would be a ' +
    'safe, low-risk follow-up; not performed here (audit-only).',

  verdict:
    'COHORT-MOSTLY-UNWIRED: 1 of 4 modules registered, 3 of 4 (imp-33786, imp-33787, ' +
    'imp-33788) silently absent from the run-assertions.mjs sweep. Read-only audit; no ' +
    'run-assertions.mjs edit made; no bound changed; imp-3066 K_a>=0 untouched; NO QED; ' +
    'no refereed bound is changed.',

  honest:
    'AUDIT-ONLY -- reports the cohort wiring gap identified by grepping ' +
    'scripts/run-assertions.mjs for each of the four file paths; does not modify the sweep ' +
    'registration or re-derive the modules’ own findings. No refereed bound is changed' +
    '.',
});

export const IMP33826_COHORT_ASSERTION_WIRING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33826-cohort-has-four-modules',
    description: 'the audited cohort names exactly the four imp-33786..imp-33789 modules',
    holds: () => COHORT_MODULES.length === 4
      && COHORT_MODULES.every((m) => /^imp-3378[6-9]$/.test(m.ticket)),
  },
  {
    id: 'imp-33826-exactly-one-wired',
    description: 'exactly one cohort module (imp-33789) is registered in run-assertions.mjs',
    holds: () => WIRED_COUNT === 1
      && COHORT_MODULES.find((m) => m.ticket === 'imp-33789').wiredInRunAssertions === true,
  },
  {
    id: 'imp-33826-three-unwired-named',
    description: 'the three unwired tickets are exactly imp-33786, imp-33787, imp-33788',
    holds: () => UNWIRED_COUNT === 3
      && ['imp-33786', 'imp-33787', 'imp-33788'].every((t) => IMP33826_COHORT_ASSERTION_WIRING_AUDIT.unwiredTickets.includes(t)),
  },
  {
    id: 'imp-33826-imp33787-uses-inline-tripwires',
    description: 'imp-33787 is correctly recorded as lacking an exported *_ASSERTIONS array (it self-checks via inline if/throw statements instead)',
    holds: () => COHORT_MODULES.find((m) => m.ticket === 'imp-33787').exportsAssertionsArray === false
      && COHORT_MODULES.find((m) => m.ticket === 'imp-33787').assertionsExportName === null,
  },
  {
    id: 'imp-33826-partition-consistent',
    description: 'wired count plus unwired count equals the full cohort size',
    holds: () => WIRED_COUNT + UNWIRED_COUNT === COHORT_MODULES.length,
  },
  {
    id: 'imp-33826-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP33826_COHORT_ASSERTION_WIRING_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP33826_COHORT_ASSERTION_WIRING_AUDIT.honest)
      && /NO QED/.test(IMP33826_COHORT_ASSERTION_WIRING_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP33826_COHORT_ASSERTION_WIRING_AUDIT.verdict),
  },
];

for (const a of IMP33826_COHORT_ASSERTION_WIRING_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33826-cohort-assertion-wiring-audit assertion failed: ${a.id}`);
  }
}

export default IMP33826_COHORT_ASSERTION_WIRING_AUDIT;
