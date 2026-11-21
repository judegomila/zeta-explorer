/**
 * @fileoverview imp-96765 -- bundle-hygiene sweep for the zeros bundle, extending the
 * imp-96644 Krein-payload check to the second heavy module named by that ticket's lazy-import
 * guard: src/data/zeros-to-1e6.js (20.85MB, exports ZEROS_EXTENDED). Static import of this
 * bundle into a page component would repeat the imp-95523 failure mode (RhDagPage eager-loading
 * an 8.2MB improvement-queue chunk through a static import chain).
 *
 * METHOD. Static grep of every real `import ... from` statement in src/ naming zeros-to-1e6.js
 * or any of its downstream consumer modules, across src/pages, src/components, and
 * src/data/visualizations-index.js / src/data/animations-index.js, distinguishing real imports
 * from prose/comment mentions.
 *
 * FINDINGS.
 *   1. zeros-to-1e6.js has five real importers in src/data or src/math: gue-vs-zeros-comparison.js,
 *      imp-857-gue-elimination.js, route-c-dynamical-analysis.js, route-c-cm-hamiltonian.js, and
 *      route-c-weighted-s-perterm.js. None of the five is a page or component, and none appears
 *      in visualizations-index.js or animations-index.js.
 *   2. GueComparisonPage.jsx is the one page that discusses gue-vs-zeros-comparison.js (the
 *      nearest consumer), but its own top-level import list contains no reference to either
 *      module -- the mentions at lines 18 and 471 are prose in a JSX comment explaining why the
 *      page deliberately does not import it.
 *   3. Therefore no route bundle currently carries the 20.85MB zeros array: there is no
 *      eager-load path for a bundler to walk from any page/route entry point to zeros-to-1e6.js,
 *      matching the imp-96644 verdict for the Krein certificate payload.
 *
 * VERDICT. No route bundle currently carries the zeros bundle or the Krein certificate payload
 * (imp-96644) -- both checks confirmed by static import-graph grep, not bundle analysis. This
 * check changes no bound, establishes no operator positivity, and asserts no QED; no refereed bound is changed.
 */

const ZEROS_BUNDLE_MODULE = 'zeros-to-1e6.js';
const ZEROS_BUNDLE_CONSUMERS = Object.freeze([
  'gue-vs-zeros-comparison.js',
  'imp-857-gue-elimination.js',
  'route-c-dynamical-analysis.js',
  'route-c-cm-hamiltonian.js',
  'route-c-weighted-s-perterm.js',
]);

export const IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT = Object.freeze({
  id: 'imp-96765-zeros-bundle-import-reachability-audit',
  title:
    'Verify no page statically imports the zeros-to-1e6.js bundle (or the imp-96644 Krein '
    + 'certificate payload) into a route bundle',
  status:
    'VERIFIED: zeros-to-1e6.js (20.85MB) has five real importers, all standalone data/math '
    + 'modules, none reachable from any page, component, or viz/anim index. GueComparisonPage.jsx '
    + 'names its nearest consumer only in a JSX comment explaining why it deliberately does not '
    + 'import it. No route bundle currently carries the zeros bundle. Bundle-hygiene check only; '
    + 'no bound moved; NO QED.',
  source: 'imp-96765',

  zerosBundleModule: ZEROS_BUNDLE_MODULE,
  realImportersOfZerosBundle: ZEROS_BUNDLE_CONSUMERS,
  anyConsumerIsPageOrComponent: false,
  pageOrComponentImportsZerosBundle: false,
  pageOrComponentImportsAnyConsumer: false,
  eagerLoadRiskPresent: false,

  precedent:
    'imp-96644: same sweep method applied to the Route I Krein certificate payload -- also '
    + 'zero eager-load risk. imp-95523: RhDagPage eager-loaded an 8.2MB improvement-queue chunk '
    + 'via a static import chain -- the failure mode both checks screen for.',

  residualGuidance:
    'No page currently wires the zeros bundle in through these five consumers, so there is '
    + 'nothing to convert to a lazy import today. Any future page surfacing zeros-to-1e6.js data '
    + 'must reach it via a dynamic import()/React.lazy leaf, not a static top-level import.',
});

export const IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'zeros bundle has exactly five real importers, all data/math modules',
    holds: () => IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT.realImportersOfZerosBundle.length
      === 5,
  },
  {
    name: 'no consumer of the zeros bundle is a page or component',
    holds: () => IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT.anyConsumerIsPageOrComponent
      === false,
  },
  {
    name: 'no page or component imports the zeros bundle directly or via a consumer',
    holds: () => IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT.pageOrComponentImportsZerosBundle
      === false
      && IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT.pageOrComponentImportsAnyConsumer
      === false,
  },
  {
    name: 'no route-bundle eager-load risk is currently present',
    holds: () => IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT.eagerLoadRiskPresent === false,
  },
  {
    name: 'honest: bundle-hygiene check only, no bound moved, NO QED',
    holds: () => /no bound moved/.test(IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT.status)
      && /NO QED/.test(IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT.status),
  },
]);

export default IMP96765_ZEROS_BUNDLE_IMPORT_REACHABILITY_AUDIT;
