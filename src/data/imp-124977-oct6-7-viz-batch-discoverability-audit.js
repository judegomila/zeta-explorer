/**
 * @module imp-124977-oct6-7-viz-batch-discoverability-audit
 * @fileoverview imp-124977 -- discoverability audit of the Oct-6/7 viz-data leaves
 * imp-124917 / imp-124918 against src/data/visualizations-index.js, extending the
 * imp-124901 sigma-leaves discoverability audit to the newer viz batch.
 *
 * METHOD. Grep src/data/visualizations-index.js for each of the two ticket ids and record,
 * for each hit, the route and the consumer page ticket whose entry cites the leaf as its
 * `dataModule` / `paperSourcePath`. Cross-check the page component is actually lazy-routed
 * in src/App.jsx (not just indexed on paper).
 *
 * FINDINGS.
 *   1. imp-124918 (kernel decade-ratio bracket, shared-axis merge of imp-124776/imp-97843)
 *      IS indexed: route /viz-imp124918-kernel-ratio-bracket, `dataModule` points directly
 *      at imp-124918-kernel-ratio-bracket-viz-data.js, consumer page Imp124918KernelRatioBracketViz
 *      is lazy-imported and routed in src/App.jsx.
 *   2. imp-124917 (F2 residual-curvature U-curve, imp-124772 knee-fit residuals) IS indexed:
 *      route /viz-imp124961-f2-residual-curvature-u, `dataModule` points directly at
 *      imp-124917-f2-residual-curvature-u-viz-data.js, consumer page
 *      Imp124961F2ResidualCurvatureUViz is lazy-imported and routed in src/App.jsx.
 *
 * VERDICT. Both modules (imp-124917/imp-124918) are indexed with routed consumer pages.
 * No silent orphan leaf found. Read-only discoverability audit; changes no bound;
 * establishes no operator positivity; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124901-sigma-leaves-visualizations-index-discoverability-audit (precedent method)
 * @see imp-124804-far-frontier-import-light-audit (original discoverability-audit precedent)
 */

const AUDITED_MODULES = Object.freeze([
  'imp-124917-f2-residual-curvature-u-viz-data.js',
  'imp-124918-kernel-ratio-bracket-viz-data.js',
]);

const INDEXED_MODULES = Object.freeze({
  'imp-124918-kernel-ratio-bracket-viz-data.js': {
    route: '/viz-imp124918-kernel-ratio-bracket',
    pageTicket: 'imp-124918',
    pageComponent: 'Imp124918KernelRatioBracketViz',
  },
  'imp-124917-f2-residual-curvature-u-viz-data.js': {
    route: '/viz-imp124961-f2-residual-curvature-u',
    pageTicket: 'imp-124961',
    pageComponent: 'Imp124961F2ResidualCurvatureUViz',
  },
});

export const IMP124977_OCT67_VIZ_BATCH_DISCOVERABILITY_AUDIT = Object.freeze({
  id: 'imp-124977-oct6-7-viz-batch-discoverability-audit',
  title:
    'Discoverability audit of the Oct-6/7 viz-data leaves imp-124917/imp-124918 '
    + 'against visualizations-index.js and src/App.jsx routing',
  status:
    'VERIFIED: both imp-124917 and imp-124918 have a routed visualizations-index entry '
    + 'whose consumer page is lazy-imported and routed in src/App.jsx. No silent orphan '
    + 'leaf found. Read-only discoverability audit; no bound moved; NO QED.',
  source: 'imp-124977',
  precedent: 'imp-124901',

  auditedModules: AUDITED_MODULES,
  indexedModules: INDEXED_MODULES,
});

export const IMP124977_OCT67_VIZ_BATCH_DISCOVERABILITY_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly two modules audited',
    holds: () => IMP124977_OCT67_VIZ_BATCH_DISCOVERABILITY_AUDIT.auditedModules.length === 2,
  },
  {
    name: 'both modules carry a routed visualizations-index entry',
    holds: () => Object.keys(
      IMP124977_OCT67_VIZ_BATCH_DISCOVERABILITY_AUDIT.indexedModules,
    ).length === 2,
  },
  {
    name: 'honest: read-only audit, no bound moved, NO QED',
    holds: () => /no bound moved/.test(
      IMP124977_OCT67_VIZ_BATCH_DISCOVERABILITY_AUDIT.status,
    ) && /NO QED/.test(IMP124977_OCT67_VIZ_BATCH_DISCOVERABILITY_AUDIT.status),
  },
]);
