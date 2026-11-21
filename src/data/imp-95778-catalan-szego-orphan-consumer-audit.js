/**
 * @fileoverview imp-95778 -- consumer/orphan audit of the six newest Catalan/Szego finding
 * modules (imp-95743, imp-95744, imp-95745, imp-95746, imp-95749, imp-95750): for each, verify
 * it is imported by a page, an index, or the run-assertions.mjs DATA_MODULES sweep (i.e. NOT
 * orphaned), and confirm none of the six transitively pulls the 16.7MB zeros bundle.
 *
 * METHOD. Static grep of every module's import statements (none of the six has any -- each is a
 * standalone literal-data module) and of every other src/ file referencing each module's
 * `imp-NNNNN-` filename stem, cross-checked against scripts/run-assertions.mjs DATA_MODULES and
 * src/data/visualizations-index.js. No re-derivation; carried findings only.
 *
 * FINDINGS.
 *   1. imp-95743 (Szego coefficient DD crosscheck): registered in DATA_MODULES; consumed by six
 *      further research modules (imp-95761/95767/95773/95779/95784/95786) in the active
 *      Szego-coefficient/DD-Toeplitz thread. That downstream chain has not yet reached a rendered
 *      viz page (none of imp-95786/95799/95819/95820/95826/95837/95840/95844 appear in
 *      visualizations-index.js), but every checked link is itself registered in DATA_MODULES, so
 *      the whole chain is exercised by the assertion sweep. NOT orphaned (assertion-reachable);
 *      page-reachability is a residual for a future viz ticket, not an orphan finding.
 *   2. imp-95744 (twin-pair block-floor below-precision DD resolve): registered in DATA_MODULES;
 *      consumed by imp-95762/95785/95788/95803/95839 AND directly cited in
 *      visualizations-index.js as the F_inf dual floor for a rendered bar-chart page. PASS
 *      (page-reachable).
 *   3. imp-95745 (Sun Prop 6.3 +4 offset derivation): registered in DATA_MODULES; consumed by the
 *      imp-95756 glossary-headword module, which feeds src/data/glossary.js, imported by
 *      src/pages/WikiPage.jsx. PASS (page-reachable via the Concepts/Wiki glossary).
 *   4. imp-95746 (Sun Prop 6.3 +4 offset, four moduli): registered in DATA_MODULES; consumed by
 *      imp-95771/95782/95802/95822 AND directly cited in visualizations-index.js as a rendered
 *      two-panel-chart page. PASS (page-reachable).
 *   5. imp-95749 (dI variation against constant-J null): registered in DATA_MODULES; consumed by
 *      imp-95777, itself the viz-data module backing a rendered stacked-share/grouped-bar page
 *      cited in visualizations-index.js. PASS (page-reachable).
 *   6. imp-95750 (number-variance dead-zone measurement reach): registered in DATA_MODULES;
 *      consumed by imp-95766/95772/95783/95801/95805, with imp-95766 directly cited in
 *      visualizations-index.js as a rendered log10-T chart page. PASS (page-reachable). FLAGGED
 *      completeness gap: unlike its five siblings, imp-95750 exports NO `*_ASSERTIONS` array (only
 *      the data object + default export), so the DATA_MODULES sweep exercises its import-light
 *      load but none of its own numeric claims directly -- those claims (the gamma_1e6 = 6.003e5
 *      ceiling, the ~97.6% unreachable dead-zone fraction) are only re-checked where a consumer
 *      (e.g. imp-95766) re-carries the literals into its own assertions.
 *
 * VERDICT. Zero of the six modules are orphaned: all six are registered in the
 * run-assertions.mjs DATA_MODULES sweep, and five of the six (all but imp-95743's still-growing
 * research chain) are directly reachable from a rendered page. None of the six has any import
 * statement, so none can transitively pull the 16.7MB zeros bundle -- confirmed directly, not
 * inferred. One completeness gap flagged (imp-95750 missing its own `*_ASSERTIONS` export) for a
 * future ticket. This audit changes no bound, establishes no operator positivity, and asserts no
 * QED; no refereed bound is changed.
 */

const AUDITED = Object.freeze([
  Object.freeze({
    module: 'imp-95743-szego-coefficient-double-double-crosscheck.js',
    inDataModules: true,
    hasOwnAssertions: true,
    pageReachable: false,
    consumers: Object.freeze(['imp-95761', 'imp-95767', 'imp-95773', 'imp-95779', 'imp-95784', 'imp-95786']),
    zeroImports: true,
    note: 'downstream research chain not yet wired to a viz page; every link is DATA_MODULES-registered so the chain is assertion-reachable, not orphaned.',
  }),
  Object.freeze({
    module: 'imp-95744-twin-pair-block-floor-belowprec-dd-resolve.js',
    inDataModules: true,
    hasOwnAssertions: true,
    pageReachable: true,
    consumers: Object.freeze(['imp-95762', 'imp-95785', 'imp-95788', 'imp-95803', 'imp-95839']),
    zeroImports: true,
    note: 'F_inf dual floor cited directly in visualizations-index.js (imp-95791 bar-chart page).',
  }),
  Object.freeze({
    module: 'imp-95745-sun-prop63-plus4-offset-derivation.js',
    inDataModules: true,
    hasOwnAssertions: true,
    pageReachable: true,
    consumers: Object.freeze(['imp-95756']),
    zeroImports: true,
    note: 'reaches src/data/glossary.js via imp-95756, imported by src/pages/WikiPage.jsx.',
  }),
  Object.freeze({
    module: 'imp-95746-sun-prop63-plus4-offset-four-moduli.js',
    inDataModules: true,
    hasOwnAssertions: true,
    pageReachable: true,
    consumers: Object.freeze(['imp-95771', 'imp-95782', 'imp-95802', 'imp-95822']),
    zeroImports: true,
    note: 'PER_MODULUS/mFreeSector literals cited directly in visualizations-index.js (imp-95771 two-panel-chart page).',
  }),
  Object.freeze({
    module: 'imp-95749-di-variation-against-constant-J-null.js',
    inDataModules: true,
    hasOwnAssertions: true,
    pageReachable: true,
    consumers: Object.freeze(['imp-95777']),
    zeroImports: true,
    note: 'variation literal feeds the imp-95777 viz-data module, cited directly in visualizations-index.js (stacked-share/grouped-bar page).',
  }),
  Object.freeze({
    module: 'imp-95750-number-variance-deadzone-measurement-reach.js',
    inDataModules: true,
    hasOwnAssertions: false,
    pageReachable: true,
    consumers: Object.freeze(['imp-95766', 'imp-95772', 'imp-95783', 'imp-95801', 'imp-95805']),
    zeroImports: true,
    note: 'reaches a rendered page via imp-95766 (imp-95790 log10-T chart), but exports no *_ASSERTIONS of its own -- flagged completeness gap.',
  }),
]);

export const CATALAN_SZEGO_ORPHAN_CONSUMER_AUDIT = Object.freeze({
  id: 'imp-95778-catalan-szego-orphan-consumer-audit',
  title:
    'Consumer/orphan audit of the imp-95743/95744/95745/95746/95749/95750 Catalan/Szego finding '
    + 'modules: verify each is reachable via a page/index/assertion and confirm none pulls the '
    + '16.7MB zeros bundle',
  status:
    'AUDIT PASS with one flagged completeness gap. All six modules are registered in the '
    + 'run-assertions.mjs DATA_MODULES sweep (none orphaned); five of the six are directly '
    + 'reachable from a rendered page (imp-95744/95745/95746/95749/95750), and the sixth '
    + '(imp-95743) heads an active research chain that is assertion-reachable but not yet '
    + 'page-wired. None of the six has any import statement, so none can transitively pull the '
    + '16.7MB zeros bundle. FLAGGED: imp-95750 exports no *_ASSERTIONS array, unlike its five '
    + 'siblings. Audit only; changes no bound; establishes no operator positivity; '
    + 'no refereed bound is changed; NO QED.',
  source: 'imp-95743, imp-95744, imp-95745, imp-95746, imp-95749, imp-95750',

  audited: AUDITED,

  verdict: Object.freeze({
    anyOrphaned: false,
    anyPullsZerosBundle: false,
    flaggedCompletenessGaps: Object.freeze([
      'imp-95750-number-variance-deadzone-measurement-reach.js exports no *_ASSERTIONS array (only '
      + 'the data object + default export), unlike its five DATA_MODULES-registered siblings.',
    ]),
    conclusion:
      'No orphans among the six audited modules; each is either page-reachable or (imp-95743) '
      + 'assertion-reachable through an active research chain. Zero import statements across all '
      + 'six rules out any transitive zeros-bundle pull. The one completeness gap (imp-95750 '
      + 'missing its own assertions) is a coverage note, not a correctness error.',
  }),

  caveats:
    'Static grep-based reachability audit; performs no re-derivation of any module\'s own numeric '
    + 'claims. Page-reachability is checked via src/data/visualizations-index.js citations and '
    + 'direct page imports (glossary.js -> WikiPage.jsx); DATA_MODULES registration is checked via '
    + 'scripts/run-assertions.mjs. Changes no bound; no refereed bound is changed; '
    + 'NO QED.',
});

export const CATALAN_SZEGO_ORPHAN_CONSUMER_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'all six audited modules are registered in run-assertions.mjs DATA_MODULES (none orphaned)',
    holds: () => AUDITED.length === 6 && AUDITED.every((m) => m.inDataModules === true),
  },
  {
    name: 'none of the six audited modules has any import statement (no zeros-bundle pull possible)',
    holds: () => AUDITED.every((m) => m.zeroImports === true),
  },
  {
    name: 'five of six are directly page-reachable; imp-95743 is the sole non-page-wired chain head',
    holds: () => AUDITED.filter((m) => m.pageReachable).length === 5
      && AUDITED.find((m) => m.module.startsWith('imp-95743')).pageReachable === false,
  },
  {
    name: 'exactly one completeness gap flagged (imp-95750 missing its own *_ASSERTIONS export)',
    holds: () => CATALAN_SZEGO_ORPHAN_CONSUMER_AUDIT.verdict.flaggedCompletenessGaps.length === 1
      && AUDITED.find((m) => m.module.startsWith('imp-95750')).hasOwnAssertions === false,
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () => /changes no bound/.test(CATALAN_SZEGO_ORPHAN_CONSUMER_AUDIT.status)
      && /refereed bound is changed/i.test(CATALAN_SZEGO_ORPHAN_CONSUMER_AUDIT.status)
      && /NO QED/.test(CATALAN_SZEGO_ORPHAN_CONSUMER_AUDIT.status),
  },
]);

export default CATALAN_SZEGO_ORPHAN_CONSUMER_AUDIT;
