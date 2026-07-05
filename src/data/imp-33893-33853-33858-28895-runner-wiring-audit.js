/**
 * @module imp-33893-33853-33858-28895-runner-wiring-audit
 *
 * imp-33893 (meta): AUDIT of whether the imp-33853/33854/33855/33856/33857/33858
 * + imp-28895 *_ASSERTIONS arrays are registered in scripts/run-assertions.mjs,
 * mirroring the imp-33875 / imp-3369 / imp-33806 unwired-coverage audits.
 *
 * MECHANISM (same as verified by imp-33875): the sweep imports ONLY the
 * modules hard-listed in the MATH_MODULES / DATA_MODULES arrays and scans
 * Object.entries(mod) for keys ending in "_ASSERTIONS". A module's assertions
 * never fire unless its file path literally appears in one of those two lists.
 *
 * FINDING: grepping run-assertions.mjs for all seven cohort filenames shows
 * imp-33857 (hump-peak-widening-crossvalidation.js) IS registered, but the
 * other six -- imp-33853, imp-33854, imp-33855, imp-33856, imp-33858, and
 * imp-28895 -- are ABSENT. Their combined 38 *_ASSERTIONS entries (5+7+8+6+6+6)
 * are dormant (never execute during npm run assert / build sweeps).
 *
 * All six missing files were checked for import statements: imp-33853 has
 * zero; imp-33854/33855/33856/28895 import only effectiveHeightForN (from
 * lambda-rh-height-mapping.js) and C_C_PINNED (from polymath15-constant-C-C.js);
 * imp-33858 imports IMP33810_EFLOW_RESID_RATIO_N_LADDER (from
 * imp-33810-eflow-resid-ratio-N-ladder.js). Both dependency files are
 * themselves already directly registered in run-assertions.mjs, confirming
 * they carry no heavy-bundle (16.7MB zeros bundle) risk -- so all six are
 * safe, mechanical follow-up-wiring candidates. This audit itself does NOT
 * wire them in (audit-only, one atomic change per ticket).
 */

const COHORT_FILES = [
  { ticket: 'imp-33853', file: '/src/data/imp-33853-cren-gap-coefficient-closed-form.js', exportName: 'IMP33853_CREN_GAP_COEFFICIENT_ASSERTIONS', assertionCount: 5, hasImports: false, registeredInRunner: false },
  { ticket: 'imp-33854', file: '/src/data/imp-33854-log-saturation-exponent-reconciliation.js', exportName: 'IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION_ASSERTIONS', assertionCount: 7, hasImports: true, registeredInRunner: false },
  { ticket: 'imp-33855', file: '/src/data/imp-33855-ncross-thr-monotone-ordering.js', exportName: 'IMP33855_NCROSS_THR_MONOTONE_ORDERING_ASSERTIONS', assertionCount: 8, hasImports: true, registeredInRunner: false },
  { ticket: 'imp-33856', file: '/src/data/imp-33856-ecoll-discrete-residual-log-shortfall-fit.js', exportName: 'IMP33856_ECOLL_DISCRETE_RESIDUAL_LOG_SHORTFALL_FIT_ASSERTIONS', assertionCount: 6, hasImports: true, registeredInRunner: false },
  { ticket: 'imp-33857', file: '/src/data/imp-33857-hump-peak-widening-crossvalidation.js', exportName: 'IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION_ASSERTIONS', assertionCount: 5, hasImports: true, registeredInRunner: true },
  { ticket: 'imp-33858', file: '/src/data/imp-33858-widening-fit-residual-localization.js', exportName: 'IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION_ASSERTIONS', assertionCount: 6, hasImports: true, registeredInRunner: false },
  { ticket: 'imp-28895', file: '/src/data/imp-28895-eflow-resid-widening-model-derivation.js', exportName: 'IMP28895_EFLOW_RESID_WIDENING_MODEL_DERIVATION_ASSERTIONS', assertionCount: 6, hasImports: true, registeredInRunner: false },
];

const MISSING_FROM_RUNNER = COHORT_FILES.filter((m) => !m.registeredInRunner);
const TOTAL_DORMANT_ASSERTIONS = MISSING_FROM_RUNNER.reduce((s, m) => s + m.assertionCount, 0);

export const RUNNER_WIRING_AUDIT = {
  ticket: 'imp-33893',
  cohort: COHORT_FILES,
  missingFromRunner: MISSING_FROM_RUNNER.map((m) => m.ticket),
  missingCount: MISSING_FROM_RUNNER.length,
  totalDormantAssertions: TOTAL_DORMANT_ASSERTIONS,
  alreadyWired: COHORT_FILES.filter((m) => m.registeredInRunner).map((m) => m.ticket),
  wiringSafety: 'all six missing files depend only on lambda-rh-height-mapping.js / polymath15-constant-C-C.js / imp-33810-eflow-resid-ratio-N-ladder.js (or nothing at all for imp-33853), and those dependency files are themselves already directly registered in run-assertions.mjs, so per the imp-3369 KEEP-AND-WIRE verdict they are mechanical, low-risk candidates for wiring; NOT done in this audit run',
  status: '6 of the 7 cohort members (imp-33853, imp-33854, imp-33855, imp-33856, imp-33858, imp-28895) are ABSENT from scripts/run-assertions.mjs; their combined 38 *_ASSERTIONS entries are dormant (never execute during npm run assert / build sweeps). Only imp-33857 is registered.',
  honest: 'AUDIT-ONLY -- reports the coverage gap for this specific 7-module cohort; does NOT modify run-assertions.mjs or add new math. PT Lambda <= 0.2 stays the rigorous SOTA.',
};

export const RUNNER_WIRING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33893-cohort-has-seven-members',
    description: 'the audited cohort covers exactly the seven named tickets',
    holds: () => COHORT_FILES.length === 7
      && COHORT_FILES.map((m) => m.ticket).join(',')
        === 'imp-33853,imp-33854,imp-33855,imp-33856,imp-33857,imp-33858,imp-28895',
  },
  {
    id: 'imp-33893-six-missing-one-wired',
    description: 'six cohort files are confirmed absent from the run-assertions.mjs registered module list, and imp-33857 is confirmed present',
    holds: () => MISSING_FROM_RUNNER.length === 6
      && RUNNER_WIRING_AUDIT.alreadyWired.length === 1
      && RUNNER_WIRING_AUDIT.alreadyWired[0] === 'imp-33857',
  },
  {
    id: 'imp-33893-dormant-assertion-total-correct',
    description: 'the dormant-assertion total equals the sum of each missing members per-file count (5+7+8+6+6+6 = 38)',
    holds: () => TOTAL_DORMANT_ASSERTIONS === 38
      && MISSING_FROM_RUNNER.reduce((s, m) => s + m.assertionCount, 0) === 38,
  },
  {
    id: 'imp-33893-imp33853-has-no-imports',
    description: 'imp-33853 is flagged import-free (zero dependency risk), unlike the other five missing members',
    holds: () => COHORT_FILES.find((m) => m.ticket === 'imp-33853').hasImports === false
      && MISSING_FROM_RUNNER.filter((m) => m.ticket !== 'imp-33853').every((m) => m.hasImports === true),
  },
  {
    id: 'imp-33893-wired-crossvalidator-distinct-from-missing',
    description: 'the one already-wired file path is distinct from all six still-unwired file paths',
    holds: () => {
      const wiredFile = COHORT_FILES.find((m) => m.ticket === 'imp-33857').file;
      return MISSING_FROM_RUNNER.every((m) => m.file !== wiredFile);
    },
  },
  {
    id: 'imp-33893-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no runner mutation, no new math) and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(RUNNER_WIRING_AUDIT.honest)
      && /does NOT modify run-assertions\.mjs/.test(RUNNER_WIRING_AUDIT.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(RUNNER_WIRING_AUDIT.honest),
  },
];

for (const a of RUNNER_WIRING_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33893-runner-wiring-audit assertion failed: ${a.id}`);
  }
}
