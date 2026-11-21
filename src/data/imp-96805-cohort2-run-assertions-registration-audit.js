/**
 * @fileoverview imp-96805 -- confirm whether the imp-96707 cohort2 orphan modules'
 * module-scope self-executing tripwire assertions (confirmed present by imp-96803:
 * imp-96631, imp-96687, imp-96688, imp-96689, imp-96691, imp-96697, imp-96709,
 * imp-96751, imp-96770 -- imp-96722 excluded, already wired into ConceptsPage by
 * imp-96797) actually EXECUTE under `node scripts/run-assertions.mjs`, and confirm
 * none pulls the 16.7MB zeros bundle at import.
 *
 * METHOD. `run-assertions.mjs` only loads modules whose path string is literally
 * present in its hardcoded DATA_MODULES array (Vite ssrLoadModule per entry) -- it
 * does not glob src/data/. Grepped run-assertions.mjs for each of the 9 module
 * paths as an ACTUAL array entry (not a prose/@see comment mentioning the imp id):
 * zero matches for all 9. Separately, imp-96707 already established zero of the 9
 * are imported by any page/index/viz-data leaf. Grepped every one of the 9 files
 * (plus imp-96687's two extra sibling imports, imp-96649 and imp-96562) for the
 * string "zeros" and for dynamic `import(`: zero hits in both sweeps.
 *
 * FINDINGS. (1) None of the 9 modules is registered in DATA_MODULES, so their
 * self-executing throw tripwires do not run under `node run-assertions.mjs` --
 * this is the SAME unregistered-module gap as the imp-96825 sibling audit found for
 * the imp-96772/96773/96774 cohort, applied to the older imp-96707 cohort2 set.
 * Combined with the imp-96707 zero-page-consumer finding, these 9 assertions
 * currently execute NOWHERE: not at build time, not in any served page. (2) None
 * is import-heavy: no direct or transitive import (imp-96687's chain through
 * imp-96649/imp-96562 included) references the zeros bundle, and none uses a
 * dynamic import(). All 9 are safe to register.
 *
 * VERDICT. All 9 need registering in DATA_MODULES to make their tripwire
 * assertions actually exercised; none is blocked by the verify-heavy-assertion
 * import-light constraint. Audit only; no bound moved; NO QED.
 */

const REGISTRATION_STATUS = Object.freeze([
  { module: 'imp-96631-route-m-largesieve-lower-frame-assessment.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96687-lammax-normalized-ratios-above-6000.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96688-route-m-frobenius-g-factorization-assessment.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96689-route-m-lammin-doubledouble-cert-crossover-ladder.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96691-route-m-bohr-lift-multiplicative-szego-assessment.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96697-route-m-lammin-elementary-lower-bound-routes-assessment.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96709-route-m-drift-vif-block-bootstrap.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96751-route-m-frobenius-ladder-above-12000.js', registeredInDataModules: false, pullsZerosBundle: false },
  { module: 'imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js', registeredInDataModules: false, pullsZerosBundle: false },
]);

export const IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT = Object.freeze({
  id: 'imp-96805-cohort2-run-assertions-registration-audit',
  title:
    'Confirm the imp-96707 cohort2 orphan modules’ tripwire assertions are exercised '
    + 'by node run-assertions (not browser-only) and are import-light',
  status:
    'AUDIT: none of the 9 imp-96707 cohort2 orphan modules (imp-96722 excluded, '
    + 'already wired by imp-96797) is registered in run-assertions.mjs DATA_MODULES, '
    + 'so their module-scope self-executing throw tripwires (confirmed present by '
    + 'imp-96803) currently run under NEITHER node run-assertions NOR any page bundle '
    + '(imp-96707: zero consumers) -- the assertions execute nowhere. All 9 are '
    + 'import-light: no direct or transitive import touches the zeros bundle, and none '
    + 'uses a dynamic import(). Audit only; changes no bound; establishes no operator '
    + 'positivity; no refereed bound is changed; RH open; NO QED.',
  source: 'imp-96631, imp-96687, imp-96688, imp-96689, imp-96691, imp-96697, imp-96709, imp-96751, imp-96770',

  registrationStatus: REGISTRATION_STATUS,

  verdict: Object.freeze({
    modulesAudited: 9,
    modulesRegisteredInDataModules: 0,
    modulesPullingZerosBundle: 0,
    conclusion:
      'All 9 cohort2 orphans need a DATA_MODULES entry in run-assertions.mjs before '
      + 'their existing self-executing tripwires are exercised anywhere; none is '
      + 'blocked from registering by the verify-heavy-assertion import-light constraint '
      + '(zero zeros-bundle dependence, direct or transitive).',
  }),

  caveats:
    'Static grep audit (path-string presence in DATA_MODULES, "zeros" string and '
    + 'dynamic import() search across the 9 files plus imp-96687’s 2 sibling '
    + 'imports); does not re-derive any module’s own mathematical claim, and does '
    + 'not itself register the 9 modules (a follow-up wiring ticket, not this audit, '
    + 'should do that). Changes no bound; no refereed bound is changed; '
    + 'NO QED.',
});

export const IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'all 9 audited modules are confirmed unregistered in DATA_MODULES',
    holds: () => REGISTRATION_STATUS.length === 9
      && REGISTRATION_STATUS.every((m) => m.registeredInDataModules === false),
  },
  {
    name: 'no audited module pulls the zeros bundle',
    holds: () => REGISTRATION_STATUS.every((m) => m.pullsZerosBundle === false),
  },
  {
    name: 'verdict counts match the audited list',
    holds: () => IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT.verdict.modulesAudited === REGISTRATION_STATUS.length
      && IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT.verdict.modulesRegisteredInDataModules === 0
      && IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT.verdict.modulesPullingZerosBundle === 0,
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () => /changes no bound/.test(IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT.status)
      && /refereed bound is changed/i.test(IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT.status)
      && /NO QED/.test(IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT.status),
  },
]);

export default IMP96805_COHORT2_RUN_ASSERTIONS_REGISTRATION_AUDIT;
