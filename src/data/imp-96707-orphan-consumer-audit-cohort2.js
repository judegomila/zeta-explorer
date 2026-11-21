/**
 * @fileoverview imp-96707 -- second-cohort consumer/orphan + zeros-bundle audit of the
 * Route M numerical/proof modules above imp-96606 (extends the imp-96605 first-cohort
 * audit, which covered imp-96562/63/67/68/69/71). For each of the 10 newest Route M
 * modules found unreferenced by the imp-96707 scan, verify it is imported by a page, an
 * index, or the run-assertions.mjs DATA_MODULES sweep (i.e. NOT orphaned), and confirm
 * none transitively pulls the 16.7MB zeros bundle.
 *
 * METHOD. Static grep of every module's own import statements, and of every other src/
 * file mentioning each module's filename stem, distinguishing REAL `import ... from`
 * statements from mere prose/@see/comment/glossary mentions (glossary headwords and
 * improvements.js/improvement-queue.js log rows do not count as reachability).
 * Cross-checked against scripts/run-assertions.mjs DATA_MODULES and
 * src/data/visualizations-index.js. No re-derivation; carried findings only.
 *
 * FINDINGS. All 10 audited modules are ORPHANED -- no real import statement anywhere in
 * src/ names any of them, none is registered in run-assertions.mjs DATA_MODULES, and
 * none appears in visualizations-index.js:
 *   1. imp-96631 (large-sieve lower-frame assessment): only hit is a prose/@see mention
 *      inside imp-96705's consumer-audit table.
 *   2. imp-96687 (lam_max normalized ratios above 6000): zero src/ hits at all outside
 *      its own file, improvements.js, and improvement-queue.js.
 *   3. imp-96688 (Frobenius G-factorization assessment): zero src/ hits at all outside
 *      its own file, improvements.js, and improvement-queue.js.
 *   4. imp-96689 (lam_min double-double cert crossover ladder): only hit is a
 *      prose/@see mention inside imp-96705's consumer-audit table.
 *   5. imp-96691 (Bohr-lift multiplicative-Szego assessment): every hit is a prose/@see
 *      mention inside imp-96722 (which glosses its verdict without importing it).
 *   6. imp-96697 (lam_min elementary lower-bound routes assessment): only hit is a
 *      prose/@see mention inside imp-96705's consumer-audit table.
 *   7. imp-96709 (drift-VIF block bootstrap): zero src/ hits at all outside its own
 *      file, improvements.js, and improvement-queue.js.
 *   8. imp-96722 (Bohr-lift Szego edge-ceiling glossary headword): zero src/ hits at
 *      all outside its own file, improvements.js, and improvement-queue.js -- despite
 *      being a glossary-style headword itself, it was never wired into ConceptsPage's
 *      glossary term list.
 *   9. imp-96751 (Frobenius ladder above 12000): zero src/ hits at all outside its own
 *      file, improvements.js, and improvement-queue.js.
 *   10. imp-96770 (weighted-cotangent homogeneous envelope): zero src/ hits at all
 *       outside its own file, improvements.js, and improvement-queue.js.
 *
 * ZEROS-BUNDLE CHECK. Nine of the ten audited modules have zero import statements of
 * their own. The tenth, imp-96687, imports imp-96604, imp-96649, and imp-96562 -- none
 * of which carries any import statement of its own either, so no transitive path to the
 * 16.7MB zeros-to-1e6.js bundle exists from any of the ten.
 *
 * VERDICT. All 10 Route M modules newly found above imp-96606 are ORPHANED: their
 * numeric/proof claims are exercised by neither the build's page tree nor the
 * run-assertions.mjs sweep -- only their ids appear as text inside sibling modules'
 * @see lines, prose tables, and improvements.js/improvement-queue.js log rows. This
 * audit changes no bound, establishes no operator positivity, and asserts no QED;
 * no refereed bound is changed.
 */

const AUDITED = Object.freeze([
  Object.freeze({
    module: 'imp-96631-route-m-largesieve-lower-frame-assessment.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'only src/ hit is a prose/@see mention inside imp-96705\'s consumer-audit table, not a real import statement anywhere.',
  }),
  Object.freeze({
    module: 'imp-96687-lammax-normalized-ratios-above-6000.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: false,
    orphaned: true,
    note: 'zero src/ hits outside its own file, improvements.js, and improvement-queue.js; it does import imp-96604/imp-96649/imp-96562, none of which import anything themselves.',
  }),
  Object.freeze({
    module: 'imp-96688-route-m-frobenius-g-factorization-assessment.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'zero src/ hits outside its own file, improvements.js, and improvement-queue.js.',
  }),
  Object.freeze({
    module: 'imp-96689-route-m-lammin-doubledouble-cert-crossover-ladder.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'only src/ hit is a prose/@see mention inside imp-96705\'s consumer-audit table, not a real import statement anywhere.',
  }),
  Object.freeze({
    module: 'imp-96691-route-m-bohr-lift-multiplicative-szego-assessment.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'every src/ hit is a prose/@see mention inside imp-96722, which glosses its verdict without importing it.',
  }),
  Object.freeze({
    module: 'imp-96697-route-m-lammin-elementary-lower-bound-routes-assessment.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'only src/ hit is a prose/@see mention inside imp-96705\'s consumer-audit table, not a real import statement anywhere.',
  }),
  Object.freeze({
    module: 'imp-96709-route-m-drift-vif-block-bootstrap.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'zero src/ hits outside its own file, improvements.js, and improvement-queue.js.',
  }),
  Object.freeze({
    module: 'imp-96722-bohr-lift-szego-edge-ceiling-glossary-headword.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'zero src/ hits outside its own file, improvements.js, and improvement-queue.js -- a glossary-style headword never wired into ConceptsPage\'s glossary term list.',
  }),
  Object.freeze({
    module: 'imp-96751-route-m-frobenius-ladder-above-12000.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'zero src/ hits outside its own file, improvements.js, and improvement-queue.js.',
  }),
  Object.freeze({
    module: 'imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'zero src/ hits outside its own file, improvements.js, and improvement-queue.js.',
  }),
]);

export const IMP96707_ORPHAN_CONSUMER_AUDIT_COHORT2 = Object.freeze({
  id: 'imp-96707-orphan-consumer-audit-cohort2',
  title:
    'Second-cohort consumer/orphan check for the Route M finding modules above imp-96606 '
    + '(imp-96631, imp-96687, imp-96688, imp-96689, imp-96691, imp-96697, imp-96709, '
    + 'imp-96722, imp-96751, imp-96770): verify each is imported by a page/index/'
    + 'assertion or flag it orphaned, and confirm none transitively pulls the 16.7MB '
    + 'zeros bundle',
  status:
    'AUDIT: all 10 audited modules are ORPHANED -- no real import statement anywhere in '
    + 'src/ names any of them, none registered in run-assertions.mjs DATA_MODULES, none '
    + 'in visualizations-index.js; only mentioned as text inside sibling @see lines, '
    + 'prose consumer-audit tables, and improvements.js/improvement-queue.js log rows. '
    + 'None has any import chain reaching the zeros bundle. Audit only; changes no '
    + 'bound; establishes no operator positivity; no refereed bound is changed'
    + '; NO QED.',
  source: 'imp-96631, imp-96687, imp-96688, imp-96689, imp-96691, imp-96697, imp-96709, imp-96722, imp-96751, imp-96770',

  audited: AUDITED,

  verdict: Object.freeze({
    orphanedCount: 10,
    anyPullsZerosBundle: false,
    conclusion:
      'All 10 newly-audited Route M modules above imp-96606 are standalone modules with '
      + 'no real consumer beyond the improvements.js/improvement-queue.js logs and '
      + 'prose/@see/id-string cross-references in sibling modules (imp-96705\'s '
      + 'consumer-audit table, imp-96722\'s glossary gloss) that do not actually import '
      + 'them. Nine have zero import statements of their own; the tenth (imp-96687) '
      + 'imports three sibling modules, none of which import anything themselves, so no '
      + 'transitive path to the zeros bundle exists from any of the ten.',
  }),

  caveats:
    'Static grep-based reachability audit; performs no re-derivation of any module\'s own '
    + 'numeric or proof claims. Distinguishes real `import ... from` statements from '
    + 'prose/@see/comment/glossary-id mentions (a module name appearing inside another '
    + 'module\'s @see line, consumer-audit table, or an improvements.js log row does not '
    + 'make that module reachable). Page-reachability is checked via direct page/'
    + 'component imports and App.jsx lazy routes; DATA_MODULES registration is checked '
    + 'via scripts/run-assertions.mjs; glossary reachability is checked via '
    + 'visualizations-index.js. The 10 flagged orphans are candidates for either wiring '
    + 'into a consumer/page/DATA_MODULES entry or explicit archival; this audit does '
    + 'neither. Changes no bound; no refereed bound is changed; NO QED.',
});

export const IMP96707_ORPHAN_CONSUMER_AUDIT_COHORT2_ASSERTIONS = Object.freeze([
  {
    name: 'all 10 audited modules are orphaned',
    holds: () => AUDITED.length === 10 && AUDITED.every((m) => m.orphaned === true),
  },
  {
    name: 'none of the 10 audited modules is registered in DATA_MODULES or visualizations-index.js',
    holds: () => AUDITED.every((m) => m.inDataModules === false && m.assertionReachable === false),
  },
  {
    name: 'exactly one audited module (imp-96687) has import statements of its own',
    holds: () => AUDITED.filter((m) => !m.zeroImports).length === 1
      && AUDITED.find((m) => !m.zeroImports).module.startsWith('imp-96687'),
  },
  {
    name: 'no audited module has any confirmed page-reachable consumer',
    holds: () => AUDITED.every((m) => m.pageReachable === false && m.consumers.length === 0),
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () => /changes no bound/.test(IMP96707_ORPHAN_CONSUMER_AUDIT_COHORT2.status)
      && /refereed bound is changed/i.test(IMP96707_ORPHAN_CONSUMER_AUDIT_COHORT2.status)
      && /NO QED/.test(IMP96707_ORPHAN_CONSUMER_AUDIT_COHORT2.status),
  },
]);

export default IMP96707_ORPHAN_CONSUMER_AUDIT_COHORT2;
