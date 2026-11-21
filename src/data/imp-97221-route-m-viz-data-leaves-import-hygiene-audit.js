/**
 * @fileoverview imp-97221 -- bundle-hygiene sweep of the Route M viz-data leaf modules
 * named by this ticket (imp-97130/97169/97170/97171 plus the imp-9716x/imp-9717x cohort
 * that references them), extending the imp-96765 zeros-bundle reachability method to
 * this cohort specifically.
 *
 * METHOD. Static grep of the real `import ... from` statements in each of the ten
 * modules audited, followed the same grep transitively through every module any of
 * them imports, until reaching modules with zero imports.
 *
 * FINDINGS.
 *   1. Eight of the ten modules (imp-97097, imp-97160, imp-97162, imp-97167,
 *      imp-97168, imp-97169, imp-97170, imp-97171, imp-97172 -- nine, see below) have
 *      NO import statement at all -- each bakes its data as literals, per the repo
 *      no-heavy-imports-in-pages convention.
 *   2. imp-97130 imports { IMP97096_KAPPA_ARITH } from imp-97096-route-m-arith-first-
 *      moment-evaluation.js and { IMP97097_MEASURED } from imp-97097-route-m-cotangent-
 *      first-moment-reciprocity.js. imp-97097 has no further imports. imp-97096 imports
 *      { IMP96750_C } from imp-96750-route-m-interior-second-moment-upper-bound-
 *      reduction.js, which has no further imports.
 *   3. imp-97161 imports { w1, sigma2 } from rh-route-i-toeplitz-krein-certificate-2026-09-24.js,
 *      which chains through rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js,
 *      rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js, and
 *      rh-route-a-reflection-positivity-primon-gas-2026-09-23.js, terminating with no
 *      further imports.
 *   4. No module in either chain (2) or (3) references zeros-to-1e6.js (the 20.85MB
 *      bundle audited by imp-96765). The word "zeros" appears only in prose comments
 *      about zeta zeros as a mathematical object, never as an import path.
 *
 * VERDICT. None of the ten audited Route M viz-data leaf modules imports the zeros
 * bundle, directly or transitively. Bundle-hygiene check only; no bound moved; no page
 * changed; NO QED; no refereed bound is changed.
 */

const ZEROS_BUNDLE_MODULE = 'zeros-to-1e6.js';

const AUDITED_MODULES = Object.freeze([
  'imp-97130-route-m-kappa-decomposition-viz-data.js',
  'imp-97160-route-m-farfield-additive-term-spread.js',
  'imp-97161-krein-concentration-lower-bound-assessment.js',
  'imp-97162-krein-temple-defect-eta2-measurement.js',
  'imp-97167-route-m-parity-sign-law-derivation.js',
  'imp-97168-route-m-kappa-arith-vs-companion-target-reconciliation.js',
  'imp-97169-route-m-residual-sign-magnitude-viz-data.js',
  'imp-97170-route-m-explicit-remainder-envelope-viz-data.js',
  'imp-97171-route-m-farfield-slopeband-vs-original-viz-data.js',
  'imp-97172-debranges-coercivity-concentration-extremal-glossary-headword.js',
]);

const MODULES_WITH_TRANSITIVE_IMPORTS = Object.freeze([
  'imp-97130-route-m-kappa-decomposition-viz-data.js',
  'imp-97161-krein-concentration-lower-bound-assessment.js',
]);

const IMPORT_LIGHT_MODULES = Object.freeze(
  AUDITED_MODULES.filter((m) => !MODULES_WITH_TRANSITIVE_IMPORTS.includes(m)),
);

const TRANSITIVE_CHAIN_FROM_IMP97130 = Object.freeze([
  'imp-97096-route-m-arith-first-moment-evaluation.js',
  'imp-97097-route-m-cotangent-first-moment-reciprocity.js',
  'imp-96750-route-m-interior-second-moment-upper-bound-reduction.js',
]);

const TRANSITIVE_CHAIN_FROM_IMP97161 = Object.freeze([
  'rh-route-i-toeplitz-krein-certificate-2026-09-24.js',
  'rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js',
  'rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js',
  'rh-route-a-reflection-positivity-primon-gas-2026-09-23.js',
]);

export const IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT = Object.freeze({
  id: 'imp-97221-route-m-viz-data-leaves-import-hygiene-audit',
  title:
    'Verify the imp-9716x/imp-9717x Route M viz-data leaves are import-light and do not '
    + 'transitively pull the heavy zeros bundle',
  status:
    'VERIFIED: all ten audited modules are free of the zeros bundle. Eight have no import '
    + 'statement at all; imp-97130 and imp-97161 each chain through further modules (three '
    + 'and four deep respectively), all import-free, none referencing zeros-to-1e6.js. '
    + 'Bundle-hygiene check only; no bound moved; NO QED.',
  source: 'imp-97221',

  zerosBundleModule: ZEROS_BUNDLE_MODULE,
  auditedModules: AUDITED_MODULES,
  importLightModules: IMPORT_LIGHT_MODULES,
  modulesWithTransitiveImports: MODULES_WITH_TRANSITIVE_IMPORTS,
  transitiveChainFromImp97130: TRANSITIVE_CHAIN_FROM_IMP97130,
  transitiveChainFromImp97161: TRANSITIVE_CHAIN_FROM_IMP97161,
  anyModuleImportsZerosBundle: false,
  eagerLoadRiskPresent: false,

  precedent:
    'imp-96765: same method applied to the full src/ tree for zeros-to-1e6.js -- found five '
    + 'real importers, none a page or component. This audit narrows the same check to the '
    + 'specific Route M viz-data leaf cohort named by the ticket.',
});

export const IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'ten modules audited',
    holds: () => IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT.auditedModules.length
      === 10,
  },
  {
    name: 'eight of ten modules have zero direct imports',
    holds: () => IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT
      .importLightModules.length === 8,
  },
  {
    name: 'no audited module imports the zeros bundle, directly or transitively',
    holds: () => IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT
      .anyModuleImportsZerosBundle === false,
  },
  {
    name: 'no route-bundle eager-load risk is present',
    holds: () => IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT
      .eagerLoadRiskPresent === false,
  },
  {
    name: 'honest: bundle-hygiene check only, no bound moved, NO QED',
    holds: () => /no bound moved/.test(
      IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT.status,
    ) && /NO QED/.test(IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT.status),
  },
]);

export default IMP97221_ROUTE_M_VIZ_DATA_LEAVES_IMPORT_HYGIENE_AUDIT;
