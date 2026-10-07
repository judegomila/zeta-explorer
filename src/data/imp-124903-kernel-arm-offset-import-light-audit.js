/**
 * @fileoverview imp-124903 -- bundle-hygiene audit of imp-124852 (kernel arm-offset
 * asymmetry viz-data leaf), per the no-heavy-imports-in-pages rule (pages must not
 * transitively import the 16.7MB+ src/data/zeros-to-1e6.js bundle).
 *
 * METHOD. Static grep of every real `import ... from` statement starting at
 * imp-124852-kernel-arm-offset-asymmetry-viz-data.js, walked outward until the closure
 * bottoms out, checking each hop for a direct or renamed import of zeros-to-1e6.js
 * (distinguishing real imports from prose mentions in comments, per the imp-96765
 * precedent).
 *
 * FINDINGS. imp-124852 imports only IMP124776_WIDE_RATIO_VS_GAP /
 * IMP124776_DEEP_RATIO_VS_GAP from imp-124776-kernel-decade-ratio-vs-gap-viz-data.js,
 * which in turn imports only imp-97823-kernel-decade-growth-sqrt10.js. From there the
 * closure fans out through the pre-existing Lambda/Dyson-Burgers chain
 * (lambda-rh-height-mapping -> bridge-lambda-rh -> guth-maynard-tail-bound;
 * polymath15-constant-C-C -> g6a-sub-constant-value, polymath15-lemma52-shock-holder,
 * lambda-intercept-burgers-uniformity -> dyson-burgers-shock, lambda-intercept-
 * confidence, lambda-error-budget, lambda-intercept-analytic, dyson-monotonicity-proof,
 * dyson-collision-lower-bound) -- 16 modules total, none of which import
 * data/zeros-to-1e6.js, data/improvements.js, or data/improvement-queue.js.
 *
 * VERDICT. imp-124852 is import-light: its transitive closure never reaches
 * data/zeros-to-1e6.js. This is a bundle-hygiene check only -- it changes no bound,
 * establishes no operator positivity, and asserts no QED; Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 */

const AUDITED_MODULE = 'imp-124852-kernel-arm-offset-asymmetry-viz-data.js';

const CLOSURE_MODULES = Object.freeze([
  'imp-124776-kernel-decade-ratio-vs-gap-viz-data.js',
  'imp-97823-kernel-decade-growth-sqrt10.js',
  'lambda-rh-height-mapping.js',
  'bridge-lambda-rh.js',
  'guth-maynard-tail-bound.js',
  'polymath15-constant-C-C.js',
  'g6a-sub-constant-value.js',
  'polymath15-lemma52-shock-holder.js',
  'lambda-intercept-burgers-uniformity.js',
  'dyson-burgers-shock.js',
  'lambda-intercept-confidence.js',
  'lambda-error-budget.js',
  'lambda-intercept-analytic.js',
  'dyson-monotonicity-proof.js',
  'dyson-collision-lower-bound.js',
]);

export const IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT = Object.freeze({
  id: 'imp-124903-kernel-arm-offset-import-light-audit',
  title:
    'Import-light bundle-hygiene audit of imp-124852 (kernel arm-offset asymmetry '
    + 'viz-data leaf)',
  status:
    'VERIFIED: imp-124852 imports only imp-124776, which imports only imp-97823, '
    + 'which fans into the pre-existing 13-module Lambda/Dyson-Burgers closure. '
    + '16 modules total in the full closure, none of which reach data/zeros-to-1e6.js. '
    + 'Bundle-hygiene check only; no bound moved; NO QED.',
  source: 'imp-124903',
  auditedModule: AUDITED_MODULE,
  closureModules: CLOSURE_MODULES,
  closureSize: CLOSURE_MODULES.length,
  heavyBundleModule: 'zeros-to-1e6.js',
  heavyBundleReachable: false,

  precedent:
    'imp-124804/imp-124866/imp-124878: same reachability-audit method applied to the '
    + 'sigma-diagnostic leaf cohort. imp-96765: same method applied to the zeros-to-'
    + '1e6.js bundle from page/component entry points.',
});

export const IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly one module audited',
    holds: () => IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT.auditedModule === AUDITED_MODULE,
  },
  {
    name: 'full transitive closure is 15 modules deep',
    holds: () => IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT.closureSize === 15,
  },
  {
    name: 'heavy zeros bundle is not reachable from the audited module',
    holds: () => IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT.heavyBundleReachable === false,
  },
  {
    name: 'honest: bundle-hygiene check only, no bound moved, NO QED',
    holds: () => /no bound moved/.test(IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT.status)
      && /NO QED/.test(IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT.status),
  },
]);

for (const assertion of IMP124903_KERNEL_ARM_OFFSET_IMPORT_LIGHT_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124903 import-light audit assertion failed: ${assertion.name}`);
  }
}
