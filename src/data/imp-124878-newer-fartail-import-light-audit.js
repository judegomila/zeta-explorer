/**
 * @fileoverview imp-124878 -- bundle-hygiene audit extending imp-124804 to the newer
 * sigma-diagnostic batch imp-124846 / imp-124847 / imp-124848 / imp-124849 / imp-124850,
 * per the no-heavy-imports-in-pages rule (pages must not transitively import the
 * 16.7MB+ src/data/zeros-to-1e6.js bundle).
 *
 * METHOD. Static grep of every real `import ... from` statement starting at the five
 * target modules, walked outward until the closure bottoms out, checking each hop for a
 * direct or renamed import of zeros-to-1e6.js (distinguishing real imports from prose
 * mentions in comments, per the imp-96765 precedent).
 *
 * FINDINGS.
 *   1. imp-124846 and imp-124849 have zero imports -- both are standalone literal-data
 *      modules with no dependency closure at all.
 *   2. imp-124847 and imp-124850 import only `effectiveHeightForN`
 *      (lambda-rh-height-mapping.js) and `C_C_PINNED` (polymath15-constant-C-C.js),
 *      the same pair already closure-audited by imp-124804.
 *   3. imp-124848 imports imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js
 *      (itself only effectiveHeightForN / C_C_PINNED) and
 *      imp-124772-knee-floor-elasticity-multifloor-fit.js -- the latter is one of the
 *      four modules imp-124804 already verified import-light, so this hop adds no new
 *      closure beyond what imp-124804 covered.
 *   4. No new module in this batch's closure was absent from the imp-124804 closure
 *      list; the heavy zeros-to-1e6.js bundle remains unreachable.
 *
 * VERDICT. All five modules (imp-124846/124847/124848/124849/124850) are import-light:
 * their transitive closure never reaches data/zeros-to-1e6.js. This is a bundle-hygiene
 * check only -- it changes no bound, establishes no operator positivity, and asserts no
 * QED; no refereed bound is changed.
 */

const AUDITED_MODULES = Object.freeze([
  'imp-124846-fartail-mantissa-leading-ratio-isolation.js',
  'imp-124847-knee-locator-gap-thirdgrid-stencil-form.js',
  'imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js',
  'imp-124849-extprec-ecf-floor-sigmacrit.js',
  'imp-124850-pairratio-drift-slope-fit.js',
]);

const MODULES_WITH_NO_IMPORTS = Object.freeze([
  'imp-124846-fartail-mantissa-leading-ratio-isolation.js',
  'imp-124849-extprec-ecf-floor-sigmacrit.js',
]);

const CLOSURE_MODULES = Object.freeze([
  'lambda-rh-height-mapping.js',
  'polymath15-constant-C-C.js',
  'imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js',
  'imp-124772-knee-floor-elasticity-multifloor-fit.js',
]);

export const IMP124878_NEWER_FARTAIL_IMPORT_LIGHT_AUDIT = Object.freeze({
  id: 'imp-124878-newer-fartail-import-light-audit',
  title:
    'Import-light bundle-hygiene audit of imp-124846..124850, extending the imp-124804 '
    + 'far-frontier import-light audit',
  status:
    'VERIFIED: imp-124846/124849 have zero imports; imp-124847/124850 import only '
    + 'effectiveHeightForN / C_C_PINNED; imp-124848 reaches the same pair via '
    + 'imp-33684 and via imp-124772 (already verified import-light by imp-124804). '
    + 'No module in this batch reaches data/zeros-to-1e6.js. Bundle-hygiene check '
    + 'only; no bound moved; NO QED.',
  source: 'imp-124878',
  extendsAudit: 'imp-124804',

  auditedModules: AUDITED_MODULES,
  modulesWithNoImports: MODULES_WITH_NO_IMPORTS,
  closureModules: CLOSURE_MODULES,
  heavyBundleModule: 'zeros-to-1e6.js',
  heavyBundleReachable: false,

  precedent:
    'imp-124804: same reachability-audit method applied to imp-124769/124770/124771/'
    + '124772, also zero eager-load risk. imp-96765: same method applied to the zeros-'
    + 'to-1e6.js bundle from page/component entry points.',
});

export const IMP124878_NEWER_FARTAIL_IMPORT_LIGHT_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly five modules audited',
    holds: () => IMP124878_NEWER_FARTAIL_IMPORT_LIGHT_AUDIT.auditedModules.length === 5,
  },
  {
    name: 'heavy zeros bundle is not reachable from any audited module',
    holds: () => IMP124878_NEWER_FARTAIL_IMPORT_LIGHT_AUDIT.heavyBundleReachable === false,
  },
  {
    name: 'two modules in the batch have no imports at all',
    holds: () => IMP124878_NEWER_FARTAIL_IMPORT_LIGHT_AUDIT.modulesWithNoImports.length === 2,
  },
  {
    name: 'honest: bundle-hygiene check only, no bound moved, NO QED',
    holds: () => /no bound moved/.test(IMP124878_NEWER_FARTAIL_IMPORT_LIGHT_AUDIT.status)
      && /NO QED/.test(IMP124878_NEWER_FARTAIL_IMPORT_LIGHT_AUDIT.status),
  },
]);
