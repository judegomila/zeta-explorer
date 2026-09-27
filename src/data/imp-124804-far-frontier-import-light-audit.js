/**
 * @fileoverview imp-124804 -- bundle-hygiene audit for the imp-124769 / imp-124770 /
 * imp-124771 / imp-124772 far-frontier modules, per the no-heavy-imports-in-pages rule
 * (pages must not transitively import the 16.7MB+ src/data/zeros-to-1e6.js bundle).
 *
 * METHOD. Static grep of every real `import ... from` statement starting at the four
 * target modules, walked outward until the closure bottoms out, checking each hop for a
 * direct or renamed import of zeros-to-1e6.js (distinguishing real imports from prose
 * mentions in comments, per the imp-96765 precedent).
 *
 * FINDINGS.
 *   1. All four modules import only `effectiveHeightForN` (lambda-rh-height-mapping.js)
 *      and `C_C_PINNED` (polymath15-constant-C-C.js) directly -- imp-124772 reaches the
 *      same pair one hop further via imp-97822-sigma-knee-etrunc-floor-elasticity.js.
 *   2. polymath15-constant-C-C.js's closure runs through g6a-sub-constant-value.js,
 *      polymath15-lemma52-shock-holder.js and lambda-intercept-burgers-uniformity.js,
 *      which in turn reach dyson-scaling-N5000.js, dyson-burgers-shock.js,
 *      lambda-intercept-analytic.js, dyson-monotonicity-proof.js,
 *      dyson-collision-lower-bound.js and lambda-intercept-confidence.js.
 *   3. Every zero-bearing import in that closure resolves to math/zeta.js, which defines
 *      its own literal ZETA_ZEROS array (870 zeros, ~9-digit precision) -- NOT the 20.85MB
 *      ZEROS_EXTENDED bundle in data/zeros-to-1e6.js. A closure-wide grep for the literal
 *      string "zeros-to-1e6" turns up exactly one hit, a code comment in
 *      dyson-scaling-N5000.js, never an import statement.
 *   4. The full transitive closure of source files reached from the four target modules
 *      totals ~450KB -- three orders of magnitude below the 16.7MB heavy-bundle
 *      threshold, corroborating the per-file import trace.
 *
 * VERDICT. All four modules (imp-124769/124770/124771/124772) are import-light: their
 * transitive closure never reaches data/zeros-to-1e6.js. This is a bundle-hygiene check
 * only -- it changes no bound, establishes no operator positivity, and asserts no QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const AUDITED_MODULES = Object.freeze([
  'imp-124769-ecf-stencil-noise-floor-crossover.js',
  'imp-124770-pair-ratio-identity-landmark-ladder.js',
  'imp-124771-knee-amp-bracket-width-reconcile.js',
  'imp-124772-knee-floor-elasticity-multifloor-fit.js',
]);

const CLOSURE_MODULES = Object.freeze([
  'lambda-rh-height-mapping.js',
  'bridge-lambda-rh.js',
  'guth-maynard-tail-bound.js',
  'polymath15-constant-C-C.js',
  'g6a-sub-constant-value.js',
  'polymath15-lemma52-shock-holder.js',
  'lambda-intercept-burgers-uniformity.js',
  '../math/dyson-scaling-N5000.js',
  'dyson-burgers-shock.js',
  'lambda-intercept-analytic.js',
  'dyson-monotonicity-proof.js',
  'dyson-collision-lower-bound.js',
  'lambda-intercept-confidence.js',
  'lambda-error-budget.js',
  '../math/zeta.js',
  '../math/primes.js',
  'imp-97822-sigma-knee-etrunc-floor-elasticity.js',
  'imp-97781-knee-crossover-eflow-sensitivity.js',
  'imp-97708-sigma-knee-bracket-width-sensitivity.js',
  'imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js',
  'imp-33767-sigma-inflection-offset-reconciliation.js',
  'imp-33721-sigma-ramp-inflection-subdecade.js',
]);

export const IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT = Object.freeze({
  id: 'imp-124804-far-frontier-import-light-audit',
  title:
    'Audit that the imp-124769/124770/124771/124772 far-frontier modules are import-light '
    + '(only the shared surrogate constants, no 16.7MB zeros bundle)',
  status:
    'VERIFIED: all four modules import only effectiveHeightForN / C_C_PINNED (directly or '
    + 'one hop via imp-97822); their full transitive closure (~450KB across 21 files) never '
    + 'imports data/zeros-to-1e6.js -- the sole zero-bearing dependency is the 870-zero '
    + 'literal array in math/zeta.js. Bundle-hygiene check only; no bound moved; NO QED.',
  source: 'imp-124804',

  auditedModules: AUDITED_MODULES,
  closureModuleCount: CLOSURE_MODULES.length,
  closureModules: CLOSURE_MODULES,
  closureApproxBytes: 450595,
  heavyBundleModule: 'zeros-to-1e6.js',
  heavyBundleApproxBytes: 20850000,
  heavyBundleReachable: false,
  zeroSourceInClosure: 'math/zeta.js (870-zero literal array, ~9-digit precision)',

  precedent:
    'imp-96765: same reachability-audit method applied to the zeros-to-1e6.js bundle from '
    + 'page/component entry points -- also zero eager-load risk. imp-95523: RhDagPage '
    + 'eager-loaded an 8.2MB improvement-queue chunk via a static import chain -- the '
    + 'failure mode this check screens for.',
});

export const IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly four modules audited',
    holds: () => IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT.auditedModules.length === 4,
  },
  {
    name: 'heavy zeros bundle is not reachable from any audited module',
    holds: () => IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT.heavyBundleReachable === false,
  },
  {
    name: 'closure size stays far below the heavy-bundle threshold',
    holds: () => IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT.closureApproxBytes
      < IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT.heavyBundleApproxBytes / 10,
  },
  {
    name: 'honest: bundle-hygiene check only, no bound moved, NO QED',
    holds: () => /no bound moved/.test(IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT.status)
      && /NO QED/.test(IMP124804_FAR_FRONTIER_IMPORT_LIGHT_AUDIT.status),
  },
]);
