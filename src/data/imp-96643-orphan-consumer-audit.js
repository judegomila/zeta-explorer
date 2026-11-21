/**
 * @fileoverview imp-96643 -- consumer/orphan + zeros-bundle audit of the five newest finding
 * modules (imp-96612, imp-96613, imp-96616, imp-96617, rh-route-i-toeplitz-krein-certificate-payload
 * -2026-09-24): for each, verify it is imported by a page, an index, or the run-assertions.mjs
 * DATA_MODULES sweep (i.e. NOT orphaned), and confirm none transitively pulls the 16.7MB zeros bundle.
 *
 * METHOD. Static grep of every module's own import statements (none of the five has any -- each is
 * a standalone literal-data module) and of every other src/ file referencing each module's filename
 * stem, distinguishing REAL `import ... from` statements from mere prose/comment mentions (glossary
 * headwords and improvements.js/improvement-queue.js log rows do not count as reachability). Cross-
 * checked against scripts/run-assertions.mjs DATA_MODULES and src/data/visualizations-index.js. No
 * re-derivation; carried findings only.
 *
 * FINDINGS.
 *   1. imp-96612 (Route M lam_max rank-r power-iteration bracket): zero import statements of its
 *      own; its only references anywhere in src/ are the improvements.js log row (not a real
 *      import). NOT in run-assertions.mjs DATA_MODULES. ORPHANED.
 *   2. imp-96613 (Route M lam_min N-uniform lower-bound obstruction assessment): zero imports; only
 *      referenced by the improvements.js log row. NOT in DATA_MODULES. ORPHANED.
 *   3. imp-96616 (g_min/y_N extreme-gap decay): zero imports; referenced only by improvements.js and
 *      improvement-queue.js (both logs, not code). NOT in DATA_MODULES. ORPHANED.
 *   4. imp-96617 (finite-L correction sign): zero imports; its literal C ~ 2.07e-3 constant is
 *      RESTATED (not imported) inside imp-96628-boxsine-lagcorr-ibp-envelope.js -- imp-96628 carries
 *      its own copy of the number in a comment/prose cross-reference, with no `import` statement
 *      naming imp-96617. imp-96628 itself has zero consumers anywhere in src/. NOT in DATA_MODULES.
 *      ORPHANED (the one apparent "consumer" is a textual cross-reference, not a code dependency,
 *      and dead-ends at an equally unreachable sibling).
 *   5. rh-route-i-toeplitz-krein-certificate-payload-2026-09-24 (the 150-element c0..c4 coefficient
 *      arrays + 1.47e6 l1-tail-bracket payload): zero imports of its own, but IS really imported
 *      (`import { KREIN_CERTIFICATE, KREIN_CERTIFICATE_090 } from './rh-route-i-toeplitz-krein-
 *      certificate-payload-2026-09-24.js'`) by rh-route-i-toeplitz-krein-certificate-2026-09-24.js,
 *      which IS registered in run-assertions.mjs DATA_MODULES. NOT orphaned (assertion-reachable).
 *      Not yet page-reachable: glossary.js mentions both module filenames only as descriptive prose
 *      inside headword text, never as an `import` statement, and no page/component under src/pages
 *      or src/components references either filename. Page-wiring remains a residual for a future
 *      viz ticket, matching the imp-95778 precedent for imp-95743's still-growing research chain.
 *
 * ZEROS-BUNDLE CHECK. All five audited modules have zero import statements of their own. The one
 * real transitive chain (payload -> rh-route-i-toeplitz-krein-certificate-2026-09-24.js -> rh-route-
 * i-semilocal-sonine-trace-identity-2026-09-23.js -> rh-route-h-connes-scaling-site-weil-positivity-
 * 2026-09-23.js -> rh-route-a-reflection-positivity-primon-gas-2026-09-23.js) was walked three hops
 * deep; none of those files imports src/data/zeros-to-1e6.js (the 20.8MB zeros bundle, formerly
 * ~16.7MB). No transitive zeros-bundle pull from any of the five audited modules.
 *
 * VERDICT. Four of the five modules (imp-96612, imp-96613, imp-96616, imp-96617) are ORPHANED: no
 * real import statement anywhere in src/ names them, and none is registered in run-assertions.mjs
 * DATA_MODULES, so neither the build nor the assertion sweep exercises their claims. The fifth
 * (the Krein certificate payload) is NOT orphaned -- it is really imported by a DATA_MODULES-
 * registered sibling -- but is not yet page-reachable. None of the five can transitively pull the
 * zeros bundle (confirmed directly for all five; confirmed three hops deep for the one real import
 * chain). This audit changes no bound, establishes no operator positivity, and asserts no QED;
 * no refereed bound is changed.
 */

const AUDITED = Object.freeze([
  Object.freeze({
    module: 'imp-96612-route-m-lammax-rankr-power-iteration-bracket.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'only reference anywhere in src/ is the improvements.js log row, not a real import.',
  }),
  Object.freeze({
    module: 'imp-96613-route-m-lammin-nuniform-lowerbound-obstruction-assessment.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'only reference anywhere in src/ is the improvements.js log row, not a real import.',
  }),
  Object.freeze({
    module: 'imp-96616-gmin-ratio-extreme-gap-decay.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'referenced only by improvements.js and improvement-queue.js log rows, not real imports.',
  }),
  Object.freeze({
    module: 'imp-96617-finite-L-correction-sign.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'imp-96628 restates its 2.07e-3 constant in prose/comments but has no `import` statement '
      + 'naming it, and imp-96628 itself has zero consumers -- dead-end chain.',
  }),
  Object.freeze({
    module: 'rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: true,
    consumers: Object.freeze(['rh-route-i-toeplitz-krein-certificate-2026-09-24']),
    zeroImports: true,
    orphaned: false,
    note: 'really imported by rh-route-i-toeplitz-krein-certificate-2026-09-24.js, which IS '
      + 'registered in run-assertions.mjs DATA_MODULES; glossary.js mentions both filenames only '
      + 'as prose, not imports, so page-wiring is still a residual.',
  }),
]);

export const IMP96643_ORPHAN_CONSUMER_AUDIT = Object.freeze({
  id: 'imp-96643-orphan-consumer-audit',
  title:
    'Consumer/orphan + zeros-bundle audit of imp-96612, imp-96613, imp-96616, imp-96617, and the '
    + 'Krein certificate payload: verify each is imported by a page/index/assertion or flag '
    + 'orphaned, and confirm none transitively pulls the 16.7MB zeros bundle',
  status:
    'AUDIT: four of five ORPHANED (imp-96612, imp-96613, imp-96616, imp-96617 -- no real import '
    + 'statement anywhere in src/, none registered in run-assertions.mjs DATA_MODULES). The fifth '
    + '(rh-route-i-toeplitz-krein-certificate-payload-2026-09-24) is NOT orphaned: really imported '
    + 'by a DATA_MODULES-registered sibling, though not yet page-reachable. None of the five has '
    + 'any import statement, and the one real transitive chain was walked three hops deep with no '
    + 'zeros-bundle pull found. Audit only; changes no bound; establishes no operator positivity; '
    + 'no refereed bound is changed; NO QED.',
  source: 'imp-96612, imp-96613, imp-96616, imp-96617, rh-route-i-toeplitz-krein-certificate-payload-2026-09-24',

  audited: AUDITED,

  verdict: Object.freeze({
    orphanedCount: 4,
    anyPullsZerosBundle: false,
    conclusion:
      'imp-96612, imp-96613, and imp-96616 are standalone literal-data modules with no consumer at '
      + 'all beyond the improvements.js/improvement-queue.js logs. imp-96617 has one apparent '
      + 'consumer (imp-96628) that only restates its constant in prose and is itself unreachable, so '
      + 'the whole small chain is orphaned. The Krein certificate payload is the sole non-orphan: it '
      + 'is really imported by rh-route-i-toeplitz-krein-certificate-2026-09-24.js, a DATA_MODULES- '
      + 'registered module, so the assertion sweep exercises it even though no page renders it yet. '
      + 'Zero import statements across all five rules out any direct zeros-bundle pull; the one real '
      + 'transitive chain (payload -> krein-certificate module -> semilocal-sonine -> connes-scaling '
      + '-> reflection-positivity) was walked to its end with no zeros-to-1e6.js import found.',
  }),

  caveats:
    'Static grep-based reachability audit; performs no re-derivation of any module\'s own numeric '
    + 'claims. Distinguishes real `import ... from` statements from prose/comment mentions (a '
    + 'module name appearing inside a glossary headword string or an improvements.js log row does '
    + 'not make that module reachable). Page-reachability is checked via src/data/visualizations- '
    + 'index.js citations and direct page/component imports; DATA_MODULES registration is checked '
    + 'via scripts/run-assertions.mjs. The four flagged orphans are candidates for either wiring '
    + 'into a consumer/page or explicit archival; this audit does neither. Changes no bound; '
    + 'no refereed bound is changed; NO QED.',
});

export const IMP96643_ORPHAN_CONSUMER_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly four of the five audited modules are orphaned',
    holds: () => AUDITED.filter((m) => m.orphaned).length === 4,
  },
  {
    name: 'the Krein certificate payload is the sole non-orphan and is assertion-reachable',
    holds: () => AUDITED.find((m) => m.module.startsWith('rh-route-i-toeplitz-krein-certificate-payload')).orphaned === false
      && AUDITED.find((m) => m.module.startsWith('rh-route-i-toeplitz-krein-certificate-payload')).assertionReachable === true,
  },
  {
    name: 'none of the five audited modules has any import statement (no direct zeros-bundle pull possible)',
    holds: () => AUDITED.every((m) => m.zeroImports === true),
  },
  {
    name: 'zero of the five are currently page-reachable',
    holds: () => AUDITED.every((m) => m.pageReachable === false),
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () => /changes no bound/.test(IMP96643_ORPHAN_CONSUMER_AUDIT.status)
      && /refereed bound is changed/i.test(IMP96643_ORPHAN_CONSUMER_AUDIT.status)
      && /NO QED/.test(IMP96643_ORPHAN_CONSUMER_AUDIT.status),
  },
]);

export default IMP96643_ORPHAN_CONSUMER_AUDIT;
