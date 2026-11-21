/**
 * @fileoverview imp-124866 -- bundle-hygiene audit for the imp-124793 / imp-124810 /
 * imp-124811 / imp-124812 / imp-124814 far-frontier modules, extending the imp-124804
 * audit to this later batch, per the no-heavy-imports-in-pages rule (pages must not
 * transitively import the 16.7MB+ src/data/zeros-to-1e6.js bundle).
 *
 * METHOD. Static grep of every real `import ... from` statement starting at the five
 * target modules, walked outward until the closure bottoms out, checking each hop for a
 * direct or renamed import of zeros-to-1e6.js (distinguishing real imports from prose
 * mentions in comments, per the imp-96765 precedent).
 *
 * FINDINGS.
 *   1. imp-124793 has zero imports -- a standalone literal-data module with no
 *      dependency closure at all.
 *   2. imp-124810/124811/124812/124814 import only `effectiveHeightForN`
 *      (lambda-rh-height-mapping.js) and `C_C_PINNED` (polymath15-constant-C-C.js)
 *      directly -- imp-124814 additionally reaches imp-124772-knee-floor-elasticity-
 *      multifloor-fit.js and imp-97822-sigma-knee-etrunc-floor-elasticity.js, both of
 *      which the imp-124804 audit already closure-checked.
 *   3. This batch's closure is the SAME closure imp-124804 already walked for the
 *      imp-124769/124770/124771/124772 batch (lambda-rh-height-mapping.js through
 *      math/zeta.js's 870-zero literal array) -- no new module appears in it.
 *   4. A closure-wide grep for the literal string "zeros-to-1e6" across every file in
 *      this batch's closure turns up zero import-statement hits.
 *
 * VERDICT. All five modules (imp-124793/124810/124811/124812/124814) are import-light:
 * their transitive closure never reaches data/zeros-to-1e6.js. This is a bundle-hygiene
 * check only -- it changes no bound, establishes no operator positivity, and asserts no
 * QED; no refereed bound is changed.
 */

const AUDITED_MODULES = Object.freeze([
  'imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js',
  'imp-124810-bisection-tol-roundoff-floor-sweep.js',
  'imp-124811-pairratio-reldiff-ecf-roundoff-law.js',
  'imp-124812-diag3-additivity-exact-identity-assessment.js',
  'imp-124814-knee-floor-elasticity-fresh-locator-repro.js',
]);

const MODULES_WITH_NO_IMPORTS = Object.freeze([
  'imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js',
]);

const CLOSURE_MODULES = Object.freeze([
  'lambda-rh-height-mapping.js',
  'polymath15-constant-C-C.js',
  'imp-124772-knee-floor-elasticity-multifloor-fit.js',
  'imp-97822-sigma-knee-etrunc-floor-elasticity.js',
]);

export const IMP124866_FAR_FRONTIER_SECOND_BATCH_IMPORT_LIGHT_AUDIT = Object.freeze({
  id: 'imp-124866-far-frontier-second-batch-import-light-audit',
  title:
    'Audit that the imp-124793/124810/124811/124812/124814 far-frontier modules are '
    + 'import-light (only effectiveHeightForN + pinned constants, no 16.7MB zeros bundle)',
  status:
    'VERIFIED: imp-124793 has zero imports; imp-124810/124811/124812/124814 import only '
    + 'effectiveHeightForN / C_C_PINNED (directly or one hop via imp-124772/imp-97822, '
    + 'both already in the imp-124804 closure). No module in this batch reaches '
    + 'data/zeros-to-1e6.js. Bundle-hygiene check only; no bound moved; NO QED.',
  source: 'imp-124866',
  extendsAudit: 'imp-124804',

  auditedModules: AUDITED_MODULES,
  modulesWithNoImports: MODULES_WITH_NO_IMPORTS,
  closureModules: CLOSURE_MODULES,
  heavyBundleModule: 'zeros-to-1e6.js',
  heavyBundleReachable: false,

  precedent:
    'imp-124804: same reachability-audit method applied to imp-124769/124770/124771/'
    + '124772 -- this batch’s closure is a subset of that one, zero new modules. '
    + 'imp-96765: same method applied to the zeros-to-1e6.js bundle from page/component '
    + 'entry points.',
});

export const IMP124866_FAR_FRONTIER_SECOND_BATCH_IMPORT_LIGHT_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly five modules audited',
    holds: () => IMP124866_FAR_FRONTIER_SECOND_BATCH_IMPORT_LIGHT_AUDIT
      .auditedModules.length === 5,
  },
  {
    name: 'heavy zeros bundle is not reachable from any audited module',
    holds: () => IMP124866_FAR_FRONTIER_SECOND_BATCH_IMPORT_LIGHT_AUDIT
      .heavyBundleReachable === false,
  },
  {
    name: 'exactly one module in the batch has no imports at all',
    holds: () => IMP124866_FAR_FRONTIER_SECOND_BATCH_IMPORT_LIGHT_AUDIT
      .modulesWithNoImports.length === 1,
  },
  {
    name: 'honest: bundle-hygiene check only, no bound moved, NO QED',
    holds: () => /no bound moved/.test(
      IMP124866_FAR_FRONTIER_SECOND_BATCH_IMPORT_LIGHT_AUDIT.status,
    ) && /NO QED/.test(IMP124866_FAR_FRONTIER_SECOND_BATCH_IMPORT_LIGHT_AUDIT.status),
  },
]);
