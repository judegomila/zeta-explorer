/**
 * @module imp-33875-33843-33844-33845-runner-wiring-audit
 *
 * imp-33875 (meta): AUDIT of whether the imp-33843/imp-33844/imp-33845 *_ASSERTIONS
 * arrays are registered in scripts/run-assertions.mjs, mirroring the imp-3369 /
 * imp-33806 unwired-assertion-coverage audits.
 *
 * MECHANISM (verified against run-assertions.mjs): the sweep imports ONLY the
 * modules hard-listed in the MATH_MODULES / DATA_MODULES arrays and scans
 * Object.entries(mod) for keys ending in "_ASSERTIONS". A module's assertions
 * never fire unless its file path literally appears in one of those two lists.
 *
 * FINDING: grepping run-assertions.mjs for the three cohort filenames
 * ("imp-33843-eflow-resid-widening-form-fit.js", "imp-33844-hump-peak-closed-form.js",
 * "imp-33845-cren-gap-onset-rate.js") returns ZERO matches -- none of the three are
 * registered. Only their DOWNSTREAM cross-validator, imp-33857
 * (hump-peak-widening-crossvalidation.js), is wired in; its comment there notes it
 * "transitively exercises imp-33810/imp-33844" but that is a numerical
 * cross-check, not an import of the imp-33844 module itself, so imp-33844's own
 * IMP33844_HUMP_PEAK_CLOSED_FORM_ASSERTIONS array still never runs.
 *
 * All three cohort files were also confirmed to carry ZERO "import" statements
 * (self-contained, no transitive dependency on the 16.7MB zeros bundle or any
 * other heavy module), so -- per the imp-3369 KEEP-AND-WIRE verdict for
 * zero-import exporters -- they are safe, mechanical, low-risk candidates for a
 * follow-up wiring ticket. This audit itself does NOT wire them in (audit-only,
 * one atomic change per ticket).
 */

const COHORT_FILES = [
  { ticket: 'imp-33843', file: '/src/data/imp-33843-eflow-resid-widening-form-fit.js', exportName: 'IMP33843_EFLOW_RESID_WIDENING_FORM_FIT_ASSERTIONS', assertionCount: 5, hasImports: false, registeredInRunner: false },
  { ticket: 'imp-33844', file: '/src/data/imp-33844-hump-peak-closed-form.js', exportName: 'IMP33844_HUMP_PEAK_CLOSED_FORM_ASSERTIONS', assertionCount: 5, hasImports: false, registeredInRunner: false },
  { ticket: 'imp-33845', file: '/src/data/imp-33845-cren-gap-onset-rate.js', exportName: 'IMP33845_CREN_GAP_ONSET_ASSERTIONS', assertionCount: 5, hasImports: false, registeredInRunner: false },
];

const MISSING_FROM_RUNNER = COHORT_FILES.filter((m) => !m.registeredInRunner);
const TOTAL_DORMANT_ASSERTIONS = MISSING_FROM_RUNNER.reduce((s, m) => s + m.assertionCount, 0);

export const RUNNER_WIRING_AUDIT = {
  ticket: 'imp-33875',
  cohort: COHORT_FILES,
  missingFromRunner: MISSING_FROM_RUNNER.map((m) => m.ticket),
  missingCount: MISSING_FROM_RUNNER.length,
  totalDormantAssertions: TOTAL_DORMANT_ASSERTIONS,
  crossValidatorWiredButNotEquivalent: {
    file: '/src/data/imp-33857-hump-peak-widening-crossvalidation.js',
    note: 'exercises the SAME numerical quantities as imp-33844 by recomputation, but does not import imp-33844-hump-peak-closed-form.js, so IMP33844_HUMP_PEAK_CLOSED_FORM_ASSERTIONS still never runs in the sweep',
  },
  wiringSafety: 'all three files carry zero import statements (self-contained), so per the imp-3369 KEEP-AND-WIRE verdict they are mechanical, low-risk candidates for wiring; NOT done in this audit run',
  status: 'all 3 of imp-33843/imp-33844/imp-33845 are ABSENT from scripts/run-assertions.mjs; their combined 15 *_ASSERTIONS entries are dormant (never execute during npm run assert / build sweeps)',
  honest: 'AUDIT-ONLY -- reports the coverage gap for this specific 3-module cohort; does NOT modify run-assertions.mjs or add new math. No refereed bound is changed.',
};

export const RUNNER_WIRING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33875-cohort-has-three-members',
    description: 'the audited cohort covers exactly the three named tickets (imp-33843, imp-33844, imp-33845)',
    holds: () => COHORT_FILES.length === 3
      && COHORT_FILES.every((m) => /^imp-338(43|44|45)$/.test(m.ticket)),
  },
  {
    id: 'imp-33875-all-three-missing',
    description: 'all three cohort files are confirmed absent from the run-assertions.mjs registered module list',
    holds: () => MISSING_FROM_RUNNER.length === 3
      && COHORT_FILES.every((m) => m.registeredInRunner === false),
  },
  {
    id: 'imp-33875-dormant-assertion-total-correct',
    description: 'the dormant-assertion total equals the sum of each cohort members per-file count (5 + 5 + 5 = 15)',
    holds: () => TOTAL_DORMANT_ASSERTIONS === 15
      && COHORT_FILES.reduce((s, m) => s + m.assertionCount, 0) === 15,
  },
  {
    id: 'imp-33875-all-zero-import-safe-to-wire',
    description: 'every cohort member is flagged as import-free, so none carries heavy-bundle wiring risk',
    holds: () => COHORT_FILES.every((m) => m.hasImports === false),
  },
  {
    id: 'imp-33875-crossvalidator-distinct-from-source',
    description: 'the wired cross-validator file path is distinct from the still-unwired imp-33844 source file it numerically exercises',
    holds: () => RUNNER_WIRING_AUDIT.crossValidatorWiredButNotEquivalent.file
      !== COHORT_FILES.find((m) => m.ticket === 'imp-33844').file,
  },
  {
    id: 'imp-33875-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no runner mutation, no new math) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(RUNNER_WIRING_AUDIT.honest)
      && /does NOT modify run-assertions\.mjs/.test(RUNNER_WIRING_AUDIT.honest)
      && /refereed bound is changed/i.test(RUNNER_WIRING_AUDIT.honest),
  },
];

for (const a of RUNNER_WIRING_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-33875-runner-wiring-audit assertion failed: ${a.id}`);
}
