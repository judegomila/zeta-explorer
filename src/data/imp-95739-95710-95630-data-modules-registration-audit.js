/**
 * @module imp-95739-95710-95630-data-modules-registration-audit
 * @fileoverview imp-95739 -- META registration audit confirming that the imp-95710 and imp-95630
 * baked viz-data modules are wired into scripts/run-assertions.mjs DATA_MODULES, so a git-tracked
 * but unregistered module cannot silently fall back to the hours-long full sweep (imp-36222-class
 * trap; see also the imp-95628/imp-95611 precedent audits).
 *
 * METHOD (read-only, performed at author time). Grepped scripts/run-assertions.mjs for both
 * module path literals.
 *
 * RESULT (audited 2026-09-23). Both modules are present in DATA_MODULES:
 *   - '/src/data/imp-95710-number-variance-ratio-vs-height.js'        (run-assertions.mjs:17836)
 *   - '/src/data/imp-95630-transition-knee-gap-baked-viz-data.js'     (run-assertions.mjs:17865)
 * No gaps found; no follow-up action needed.
 *
 * @see imp-95611, imp-95628 (precedent registration/provenance roll-ups this note follows)
 */

export const IMP_95739_REGISTRATION_AUDIT = {
  id: 'imp-95739',
  auditedAt: '2026-09-23',
  method: 'Grep scripts/run-assertions.mjs DATA_MODULES for both module path literals.',
  modules: [
    {
      file: 'imp-95710-number-variance-ratio-vs-height.js',
      registeredInDataModules: true,
    },
    {
      file: 'imp-95630-transition-knee-gap-baked-viz-data.js',
      registeredInDataModules: true,
    },
  ],
  registrationFullCoverageCount: 2,
  recommendation:
    'No action needed -- both modules are already registered in DATA_MODULES.',
  honestNote:
    'Read-only registration audit; no new bound claimed by this module itself. ' +
    'No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_95739_ASSERTIONS = [
  {
    id: 'imp95739-exactly-two-modules-catalogued',
    holds: () => IMP_95739_REGISTRATION_AUDIT.modules.length === 2,
    why: 'The audit must cover exactly the two named modules (imp-95710/imp-95630).',
  },
  {
    id: 'imp95739-both-registered-in-data-modules',
    holds: () =>
      IMP_95739_REGISTRATION_AUDIT.modules.every((x) => x.registeredInDataModules === true) &&
      IMP_95739_REGISTRATION_AUDIT.registrationFullCoverageCount === 2,
    why: 'Every module in the cohort must be present in run-assertions.mjs DATA_MODULES -- ' +
      'grep-verified against the source file.',
  },
  {
    id: 'imp95739-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_95739_REGISTRATION_AUDIT.honestNote) &&
      /no QED/i.test(IMP_95739_REGISTRATION_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only registration audit, not a bound; no refereed bound is changed' +
      '.',
  },
];

for (const a of IMP_95739_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-95739 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_95739_ASSERTIONS };
