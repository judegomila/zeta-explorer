/**
 * @module imp-36129-orphaned-module-registration-audit-honest-status
 *
 * imp-36129 (meta, sonnet-4-6, sonnet): standalone honest-status note recording the imp-36034
 * finding that imp-35969-krawczyk-residual-directed-rounding-width.js was a genuinely ORPHANED
 * module -- no scripts/run-assertions.mjs DATA_MODULES entry and imported nowhere in src/data --
 * so its self-executing THROWing assertions were dead code from the `npm run assert` sweep's
 * perspective, until imp-36034 registered it.
 *
 * FINDING. imp-36034 ran a registration/reachability + import-light guard audit over the
 * imp-3596x/imp-3597x cohort (imp-35968, imp-35969, imp-35970, imp-35971, imp-35972, imp-35973).
 * Five of six were already reachable pre-audit (four with a direct DATA_MODULES entry;
 * imp-35968 only transitively, via the registered imp-36022 and imp-36088 modules that import
 * it). imp-35969 had neither: no direct entry, and grepping src/data for an actual `import`
 * statement referencing it turned up nothing -- only prose `@see` mentions in imp-35970,
 * imp-36017, imp-36044, and imp-36057, none of which execute the module. Its five self-executing
 * THROWing assertions therefore never ran under `npm run assert` at all prior to imp-36034,
 * despite the module existing on disk and looking registered to a casual reader relying on `@see`
 * citations rather than DATA_MODULES membership.
 *
 * THE ORPHAN FAILURE MODE. A module can be fully written, committed, and repeatedly cited by
 * `@see` in later modules' docstrings, and still be dead code for verification purposes, because
 * `@see` is prose, not an import. Only two things make a module's assertions actually run:
 * (a) a direct `/src/data/<file>.js` string in the DATA_MODULES array in
 * scripts/run-assertions.mjs, or (b) being `import`ed (directly or transitively) by some other
 * module that itself satisfies (a). Citation density is not a proxy for either.
 *
 * THE GUARD. imp-36034 fixed this instance by adding the missing direct DATA_MODULES entry in
 * the same commit. The registration-audit method that catches this class of bug -- grep
 * DATA_MODULES for each candidate file path, then grep src/data for real `import` statements (not
 * `@see` prose) naming it, to classify each as direct / transitive / orphaned -- is the standing
 * guard: it has now been run repeatedly over sequential cohorts (imp-35982, imp-35905, imp-35986,
 * imp-36034, imp-36050, imp-36070, imp-36109, ...) specifically to catch orphans like this before
 * they accumulate silently.
 *
 * Meta finding only; no bound touched; no new measurement; NO QED. No refereed bound is changed.
 *
 * @see imp-36034-imp3596x97x-registration-reachability-audit (the audit that discovered and fixed this orphan)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the module that was orphaned, now registered)
 * @see scripts/run-assertions.mjs (DATA_MODULES array, the sole source of registration truth)
 */

const ORPHANED_MODULE = 'imp-35969-krawczyk-residual-directed-rounding-width';
const DISCOVERING_AUDIT = 'imp-36034';
const CITING_MODULES_THAT_DID_NOT_REGISTER_IT = [
  'imp-35970',
  'imp-36017',
  'imp-36044',
  'imp-36057',
];

export const IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS = {
  id: 'imp-36129',
  proofSection: 'audit',
  question:
    'What failure mode did the imp-36034 audit uncover in imp-35969, and what standing guard ' +
    'prevents it recurring undetected?',
  verdictShort:
    'ORPHANED-MODULE FAILURE MODE. imp-35969-krawczyk-residual-directed-rounding-width.js had ' +
    'no direct scripts/run-assertions.mjs DATA_MODULES entry and was never `import`ed by any ' +
    'registered module -- only cited in `@see` prose by four other modules, which does not ' +
    'execute it. Its assertions were dead code until imp-36034 added the missing entry. The ' +
    'guard: classify every candidate file as direct / transitive-via-import / orphaned by ' +
    'grepping DATA_MODULES then grepping for real import statements (not @see prose); repeat ' +
    'over each new cohort.',
  orphanedModule: ORPHANED_MODULE,
  discoveringAudit: DISCOVERING_AUDIT,
  citingModulesThatDidNotRegisterIt: CITING_MODULES_THAT_DID_NOT_REGISTER_IT,
  seeCitationCountBeforeFix: CITING_MODULES_THAT_DID_NOT_REGISTER_IT.length,
  fixedInSameCommitAsDiscovery: true,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). Records the imp-36034 ' +
    'orphaned-module discovery (imp-35969, cited by @see prose in four modules but never ' +
    'imported or DATA_MODULES-registered, hence never executed by `npm run assert`) and names ' +
    'the direct/transitive/orphaned registration-audit method as the standing guard against ' +
    'recurrence. No code change here beyond this record. Changes no bound; establishes no ' +
    'operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-36034-imp3596x97x-registration-reachability-audit (discovery and fix); ' +
    'imp-35982/imp-35905/imp-35986 (registration-audit method precedents); ' +
    'imp-35969-krawczyk-residual-directed-rounding-width (the orphaned module).',
};

export const IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36129-names-correct-orphan',
    description: 'records imp-35969 as the orphaned module discovered by imp-36034',
    holds: () =>
      IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.orphanedModule ===
        'imp-35969-krawczyk-residual-directed-rounding-width' &&
      IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.discoveringAudit === 'imp-36034',
  },
  {
    id: 'imp36129-citation-without-execution',
    description:
      'four citing modules referenced the orphan by @see prose, none of which executes it',
    holds: () =>
      IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.seeCitationCountBeforeFix === 4 &&
      IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.citingModulesThatDidNotRegisterIt
        .length === 4,
  },
  {
    id: 'imp36129-fixed-same-commit',
    description: 'the orphan was closed in the same commit that discovered it (imp-36034)',
    holds: () =>
      IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.fixedInSameCommitAsDiscovery ===
      true,
  },
  {
    id: 'imp36129-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-36129-orphaned-module-registration-audit-honest-status assertion failed: ${a.id}`
    );
  }
}

export default IMP36129_ORPHANED_MODULE_REGISTRATION_AUDIT_HONEST_STATUS;
