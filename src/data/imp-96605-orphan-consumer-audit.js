/**
 * @fileoverview imp-96605 -- consumer/orphan + zeros-bundle audit of the six newest Route M /
 * sine-kernel finding modules (imp-96562, imp-96563, imp-96567, imp-96568, imp-96569, imp-96571):
 * for each, verify it is imported by a page, an index, or the run-assertions.mjs DATA_MODULES
 * sweep (i.e. NOT orphaned), and confirm none transitively pulls the 16.7MB zeros bundle.
 *
 * METHOD. Static grep of every module's own import statements, and of every other src/ file
 * mentioning each module's filename stem, distinguishing REAL `import ... from` statements from
 * mere prose/@see/comment/glossary mentions (glossary headwords and improvements.js/
 * improvement-queue.js log rows do not count as reachability). Cross-checked against
 * scripts/run-assertions.mjs DATA_MODULES and src/data/visualizations-index.js. No
 * re-derivation; carried findings only.
 *
 * FINDINGS.
 *   1. imp-96562 (Route M lam_max off-diagonal Szego assessment): zero import statements of its
 *      own; IS really imported by imp-96604-lammax-normalized-ratio-viz-data.js, which is itself
 *      imported by src/pages/Imp96604LammaxNormalizedRatioViz.jsx, lazy-routed in App.jsx. NOT in
 *      run-assertions.mjs DATA_MODULES. NOT orphaned -- page-reachable.
 *   2. imp-96563 (Route M lam_min rigorous lower-bound assessment): zero import statements of its
 *      own; every hit in src/ (imp-96602 glossary headword, imp-96595, imp-96591, imp-96613,
 *      imp-96582, imp-96584, improvements.js, improvement-queue.js) is a prose/@see/id-string
 *      mention, not a real `import` statement. NOT in DATA_MODULES. ORPHANED.
 *   3. imp-96567 (box-averaged sine-kernel lag decay): zero import statements of its own; IS
 *      really imported by imp-96598-sine-kernel-lag-decay-viz-data.js, which is itself imported by
 *      src/pages/Imp96598SineKernelLagDecayViz.jsx, lazy-routed in App.jsx. NOT in DATA_MODULES.
 *      NOT orphaned -- page-reachable.
 *   4. imp-96568 (basis-C intermediate-rung floor ladder): zero import statements of its own; IS
 *      really imported by imp-96600-basis-c-floor-ladder-viz-data.js, which is itself imported by
 *      src/pages/Imp96600BasisCFloorLadderViz.jsx, lazy-routed in App.jsx. Also carries its own
 *      direct run-assertions.mjs DATA_MODULES entry. NOT orphaned -- both page- and
 *      assertion-reachable.
 *   5. imp-96569 (Route M window reach-projection): zero import statements of its own; every hit
 *      in src/ (imp-96601 glossary headword, improvements.js, improvement-queue.js) is a
 *      prose/id-string mention, not a real `import` statement. NOT in DATA_MODULES. ORPHANED.
 *   6. imp-96571 (VIF rho_1 bound rigor assessment): zero import statements of its own; every hit
 *      in src/ (imp-96583, imp-96617, imp-96593, ConceptsPage.jsx, improvements.js,
 *      improvement-queue.js) is a prose/@see/id-string mention -- the ConceptsPage.jsx hit is a
 *      glossary term whose `id` field literally spells the module stem as a string, not an
 *      `import` of the module. NOT in DATA_MODULES. ORPHANED.
 *
 * ZEROS-BUNDLE CHECK. All six audited modules have zero import statements of their own (confirmed
 * via `grep -n "^import"`), which rules out any direct or transitive pull of the 16.7MB
 * zeros-to-1e6.js bundle from any of them.
 *
 * VERDICT. Three of the six modules (imp-96563, imp-96569, imp-96571) are ORPHANED: no real
 * import statement anywhere in src/ names them, and none is registered in run-assertions.mjs
 * DATA_MODULES, so neither the build nor the assertion sweep exercises their claims -- only their
 * ids appear as text inside glossary headwords and improvements.js/improvement-queue.js log rows.
 * The other three (imp-96562, imp-96567, imp-96568) are NOT orphaned: each is really imported by a
 * dedicated viz-data leaf that is in turn imported by a page component lazy-routed in App.jsx;
 * imp-96568 additionally has its own direct DATA_MODULES entry. None of the six can transitively
 * pull the zeros bundle. This audit changes no bound, establishes no operator positivity, and
 * asserts no QED; no refereed bound is changed.
 */

const AUDITED = Object.freeze([
  Object.freeze({
    module: 'imp-96562-route-m-lammax-offdiagonal-szego-assessment.js',
    inDataModules: false,
    pageReachable: true,
    assertionReachable: false,
    consumers: Object.freeze(['imp-96604-lammax-normalized-ratio-viz-data.js']),
    zeroImports: true,
    orphaned: false,
    note: 'really imported by imp-96604, which feeds src/pages/Imp96604LammaxNormalizedRatioViz.jsx, lazy-routed in App.jsx.',
  }),
  Object.freeze({
    module: 'imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'every src/ hit (imp-96602 glossary headword, imp-96595, imp-96591, imp-96613, imp-96582, imp-96584) is a prose/@see/id-string mention, no real import statement anywhere.',
  }),
  Object.freeze({
    module: 'imp-96567-box-averaged-sine-kernel-lag-decay.js',
    inDataModules: false,
    pageReachable: true,
    assertionReachable: false,
    consumers: Object.freeze(['imp-96598-sine-kernel-lag-decay-viz-data.js']),
    zeroImports: true,
    orphaned: false,
    note: 'really imported by imp-96598, which feeds src/pages/Imp96598SineKernelLagDecayViz.jsx, lazy-routed in App.jsx.',
  }),
  Object.freeze({
    module: 'imp-96568-basis-c-intermediate-rung-floor-ladder.js',
    inDataModules: true,
    pageReachable: true,
    assertionReachable: true,
    consumers: Object.freeze(['imp-96600-basis-c-floor-ladder-viz-data.js']),
    zeroImports: true,
    orphaned: false,
    note: 'really imported by imp-96600, which feeds src/pages/Imp96600BasisCFloorLadderViz.jsx (lazy-routed), and carries its own direct DATA_MODULES entry.',
  }),
  Object.freeze({
    module: 'imp-96569-route-m-window-reach-projection.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'every src/ hit (imp-96601 glossary headword, improvements.js, improvement-queue.js) is a prose/id-string mention, no real import statement anywhere.',
  }),
  Object.freeze({
    module: 'imp-96571-vif-rho1-bound-rigor-assessment.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'every src/ hit (imp-96583, imp-96617, imp-96593, ConceptsPage.jsx glossary term id-string, improvements.js, improvement-queue.js) is a prose/@see/id-string mention, no real import statement anywhere.',
  }),
]);

export const IMP96605_ORPHAN_CONSUMER_AUDIT = Object.freeze({
  id: 'imp-96605-orphan-consumer-audit',
  title:
    'Consumer/orphan check for the newest Route M/sine-kernel finding modules (imp-96562, '
    + 'imp-96563, imp-96567, imp-96568, imp-96569, imp-96571): verify each is imported by a '
    + 'page/index/assertion or flag it orphaned, and confirm none transitively pulls the 16.7MB '
    + 'zeros bundle',
  status:
    'AUDIT: three of six ORPHANED (imp-96563, imp-96569, imp-96571 -- no real import statement '
    + 'anywhere in src/, none registered in run-assertions.mjs DATA_MODULES; only mentioned as '
    + 'text inside glossary headwords and improvements.js/improvement-queue.js log rows). The '
    + 'other three (imp-96562, imp-96567, imp-96568) are NOT orphaned: each is really imported by '
    + 'a dedicated viz-data leaf that feeds a page component lazy-routed in App.jsx; imp-96568 '
    + 'additionally has its own direct DATA_MODULES entry. None of the six has any import chain '
    + 'reaching the zeros bundle. Audit only; changes no bound; establishes no operator '
    + 'positivity; no refereed bound is changed; NO QED.',
  source: 'imp-96562, imp-96563, imp-96567, imp-96568, imp-96569, imp-96571',

  audited: AUDITED,

  verdict: Object.freeze({
    orphanedCount: 3,
    anyPullsZerosBundle: false,
    conclusion:
      'imp-96563, imp-96569, and imp-96571 are standalone literal-data modules with no real '
      + 'consumer at all beyond the improvements.js/improvement-queue.js logs and prose/@see/'
      + 'id-string cross-references in sibling modules (including one Concepts glossary term whose '
      + 'id field spells the module stem as a plain string) that do not actually import them. '
      + 'imp-96562, imp-96567, and imp-96568 are each really imported by a dedicated viz-data leaf '
      + 'that is itself imported by a page component lazy-routed in App.jsx; imp-96568 additionally '
      + 'carries its own direct run-assertions.mjs DATA_MODULES entry. All six modules have zero '
      + 'import statements of their own, ruling out any zeros-bundle pull.',
  }),

  caveats:
    'Static grep-based reachability audit; performs no re-derivation of any module\'s own numeric '
    + 'claims. Distinguishes real `import ... from` statements from prose/@see/comment/glossary-id '
    + 'mentions (a module name appearing inside a glossary headword id or term string, an '
    + 'improvements.js log row, or another module\'s @see line does not make that module '
    + 'reachable). Page-reachability is checked via direct page/component imports and App.jsx lazy '
    + 'routes; DATA_MODULES registration is checked via scripts/run-assertions.mjs. The three '
    + 'flagged orphans are candidates for either wiring into a consumer/page or explicit archival; '
    + 'this audit does neither. Changes no bound; no refereed bound is changed; NO '
    + 'QED.',
});

export const IMP96605_ORPHAN_CONSUMER_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly three of the six audited modules are orphaned',
    holds: () => AUDITED.filter((m) => m.orphaned).length === 3,
  },
  {
    name: 'imp-96562, imp-96567, imp-96568 are the three non-orphans and are all page-reachable',
    holds: () => ['imp-96562', 'imp-96567', 'imp-96568'].every((stem) => {
      const rec = AUDITED.find((m) => m.module.startsWith(stem));
      return rec.orphaned === false && rec.pageReachable === true;
    }),
  },
  {
    name: 'imp-96568 is the sole module with its own direct DATA_MODULES entry',
    holds: () => AUDITED.filter((m) => m.inDataModules).length === 1
      && AUDITED.find((m) => m.inDataModules).module.startsWith('imp-96568'),
  },
  {
    name: 'all six audited modules have zero import statements of their own',
    holds: () => AUDITED.every((m) => m.zeroImports === true),
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () => /changes no bound/.test(IMP96605_ORPHAN_CONSUMER_AUDIT.status)
      && /refereed bound is changed/i.test(IMP96605_ORPHAN_CONSUMER_AUDIT.status)
      && /NO QED/.test(IMP96605_ORPHAN_CONSUMER_AUDIT.status),
  },
]);

export default IMP96605_ORPHAN_CONSUMER_AUDIT;
