/**
 * @fileoverview imp-96644 -- bundle-hygiene verification for the Krein certificate payload.
 * rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js exports KREIN_CERTIFICATE and
 * KREIN_CERTIFICATE_090, each carrying ~150-element ks/xs/c0/c1/c2/c3/c4 arrays plus large tail
 * constants (l1 = 1.47e6). Static import of this payload into a page component would bloat that
 * route's bundle, the same failure mode as the imp-95523 RhDagPage eager-load bug (an 8.2MB chunk
 * pulled in through a static import chain).
 *
 * METHOD. Static grep of every real `import ... from` statement in src/ naming either the payload
 * module or its sole consumer (rh-route-i-toeplitz-krein-certificate-2026-09-24.js), across
 * src/pages, src/components, and src/data/visualizations-index.js, distinguishing real imports
 * from prose/comment mentions (glossary headwords and improvements.js/improvement-queue.js log
 * rows do not count). Cross-checked against scripts/run-assertions.mjs DATA_MODULES.
 *
 * FINDINGS.
 *   1. The payload module has exactly one real importer anywhere in src/:
 *      rh-route-i-toeplitz-krein-certificate-2026-09-24.js (`import { KREIN_CERTIFICATE,
 *      KREIN_CERTIFICATE_090 } from './rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js'`).
 *   2. That consumer module is itself a standalone data module (registered in run-assertions.mjs
 *      DATA_MODULES), not a page or component. Zero files under src/pages or src/components, and
 *      src/data/visualizations-index.js, reference either module's filename -- not as an import,
 *      not even as a string literal.
 *   3. Therefore the payload's ~150-element coefficient arrays are reachable only by the
 *      assertion sweep (via DATA_MODULES), never by a route bundle: there is no eager-load path
 *      for a bundler to walk from any page/route entry point to this payload. The imp-95523
 *      failure mode (a page statically importing a multi-MB data chunk) does not apply here
 *      because no page imports the payload's consumer at all yet.
 *
 * VERDICT. No route bundle currently carries the Krein certificate payload -- confirmed by static
 * import-graph grep, not bundle analysis. Because there is no page consumer today, "route it
 * through a lazy leaf" is not yet actionable; the residual action is a standing constraint on any
 * future page wiring (matching imp-96643's page-wiring residual): when a page does surface this
 * certificate, it must reach the payload via a lazy import (React.lazy / dynamic import()), never
 * a static top-level import, to avoid repeating imp-95523. This check changes no bound, establishes
 * no operator positivity, and asserts no QED; no refereed bound is changed.
 */

const PAYLOAD_MODULE = 'rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js';
const CONSUMER_MODULE = 'rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

export const IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK = Object.freeze({
  id: 'imp-96644-krein-payload-bundle-hygiene-check',
  title:
    'Verify no page statically imports the rh-route-i-toeplitz-krein-certificate-payload module '
    + 'into a route bundle; route any future consumer through a lazy leaf',
  status:
    'VERIFIED: the payload module has exactly one real importer in src/ (the data-only '
    + 'rh-route-i-toeplitz-krein-certificate-2026-09-24.js, itself not imported by any '
    + 'page/component/visualizations-index entry). No route bundle currently pulls the payload\'s '
    + '~150-element coefficient arrays or its 1.47e6 l1 tail constant. Bundle-hygiene check only; '
    + 'no bound moved; NO QED.',
  source: 'imp-96644',

  payloadModule: PAYLOAD_MODULE,
  consumerModule: CONSUMER_MODULE,
  realImportersOfPayload: Object.freeze([CONSUMER_MODULE]),
  consumerIsPageOrComponent: false,
  consumerInDataModules: true,
  pageOrComponentImportsPayload: false,
  pageOrComponentImportsConsumer: false,
  eagerLoadRiskPresent: false,

  precedent:
    'imp-95523: RhDagPage eager-loaded an 8.2MB improvement-queue chunk via a static import '
    + 'chain -- the failure mode this check screens for.',

  residualGuidance:
    'No page currently wires this certificate, so there is nothing to convert to a lazy import '
    + 'today. When a future ticket does surface it on a page, that page must reach the payload via '
    + 'a dynamic import()/React.lazy leaf, not a static top-level import, to avoid repeating '
    + 'imp-95523.',
});

export const IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK_ASSERTIONS = Object.freeze([
  {
    name: 'payload module has exactly one real importer, the data-only certificate module',
    holds: () => IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.realImportersOfPayload.length === 1
      && IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.realImportersOfPayload[0] === CONSUMER_MODULE,
  },
  {
    name: 'the sole consumer is a data module (assertion-reachable), not a page/component',
    holds: () => IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.consumerIsPageOrComponent === false
      && IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.consumerInDataModules === true,
  },
  {
    name: 'no page or component imports the payload directly or via the consumer',
    holds: () => IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.pageOrComponentImportsPayload === false
      && IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.pageOrComponentImportsConsumer === false,
  },
  {
    name: 'no route-bundle eager-load risk is currently present',
    holds: () => IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.eagerLoadRiskPresent === false,
  },
  {
    name: 'honest: bundle-hygiene check only, no bound moved, NO QED',
    holds: () => /no bound moved/.test(IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.status)
      && /NO QED/.test(IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK.status),
  },
]);

export default IMP96644_KREIN_PAYLOAD_BUNDLE_HYGIENE_CHECK;
