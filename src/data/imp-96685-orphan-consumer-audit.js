/**
 * @fileoverview imp-96685 -- consumer/orphan + zeros-bundle audit of the seven newest Route M /
 * Route I finding modules (imp-96648, imp-96649, imp-96651, imp-96652, imp-96654, imp-96655,
 * imp-96656): for each, verify it is imported by a page, an index, or the run-assertions.mjs
 * DATA_MODULES sweep (i.e. NOT orphaned), and confirm none transitively pulls the 16.7MB zeros
 * bundle.
 *
 * METHOD. Static grep of every module's own import statements, and of every other src/ file
 * mentioning each module's filename stem, distinguishing REAL `import ... from` statements from
 * mere prose/@see/comment mentions (glossary headwords and improvements.js/improvement-queue.js
 * log rows do not count as reachability). Cross-checked against scripts/run-assertions.mjs
 * DATA_MODULES and src/data/visualizations-index.js. No re-derivation; carried findings only.
 *
 * FINDINGS.
 *   1. imp-96648 (Frobenius/Wolkowicz-Styan lam_max moment majorant): zero import statements of
 *      its own; IS registered in run-assertions.mjs DATA_MODULES (its own dedicated entry).
 *      Mentioned only via prose/@see lines inside imp-96667 and imp-96674 (neither has a real
 *      `import` statement naming it). NOT orphaned -- assertion-reachable directly.
 *   2. imp-96649 (Route M cond# fit rungs above 6000): zero imports of its own; mentioned via
 *      prose/@see lines inside imp-96668 and imp-96674 (both DATA_MODULES-registered, but neither
 *      contains a real `import` statement naming imp-96649). NOT in DATA_MODULES itself. ORPHANED.
 *   3. imp-96651 (Krein 2a=0.96 fine extended scan): zero imports; its only references anywhere in
 *      src/ are the improvements.js/improvement-queue.js log rows (not real imports). NOT in
 *      DATA_MODULES. ORPHANED.
 *   4. imp-96652 (Route M lam_max sigmoid-onset spectral derivation): zero imports; mentioned via
 *      prose/@see lines inside imp-96669 (DATA_MODULES-registered, but no real `import` statement
 *      naming imp-96652). NOT in DATA_MODULES itself. ORPHANED.
 *   5. imp-96654 (g_min crossover sensitivity oscillation): zero imports; only referenced by the
 *      improvements.js/improvement-queue.js log rows. NOT in DATA_MODULES. ORPHANED.
 *   6. imp-96655 (Route I floor-independent digamma cross-validation): HAS one real import of its
 *      own (`import { floorBeyond, M2MAX } from
 *      './rh-route-i-uncertainty-concentration-certificate-2026-09-24.js'`), which is itself
 *      DATA_MODULES-registered and page-reachable (RhNovelRoutesRoadmapPage.jsx) -- that import
 *      runs cleanly and does not make imp-96655 reachable in the other direction. Nothing anywhere
 *      in src/ imports imp-96655 itself; only the improvements.js/improvement-queue.js log rows
 *      mention it. NOT in DATA_MODULES. ORPHANED (as a target, despite importing a healthy module).
 *   7. imp-96656 (Route M conditioning-ceiling confidence interval): zero imports of its own;
 *      mentioned via prose/@see lines inside imp-96674 (DATA_MODULES-registered, but no real
 *      `import` statement naming imp-96656). NOT in DATA_MODULES itself. ORPHANED.
 *
 * ZEROS-BUNDLE CHECK. Six of the seven audited modules (all but imp-96655) have zero import
 * statements of their own, ruling out any direct or transitive pull. imp-96655's one real import
 * chain (imp-96655 -> rh-route-i-uncertainty-concentration-certificate-2026-09-24.js ->
 * rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js) was walked and neither file imports
 * src/data/zeros-to-1e6.js (the ~20.8MB zeros bundle, formerly reported as ~16.7MB). No transitive
 * zeros-bundle pull from any of the seven audited modules.
 *
 * VERDICT. Six of the seven modules (imp-96649, imp-96651, imp-96652, imp-96654, imp-96655,
 * imp-96656) are ORPHANED: no real import statement anywhere in src/ names them, and none is
 * registered in run-assertions.mjs DATA_MODULES, so neither the build nor the assertion sweep
 * exercises their claims. The seventh (imp-96648) is NOT orphaned -- it carries its own direct
 * DATA_MODULES entry -- but is not yet page-reachable. Four apparent "consumers" found by a naive
 * filename grep (imp-96667, imp-96668, imp-96669, imp-96674) turn out to reference the targets only
 * in prose/@see comments, never via a real `import` statement, despite all four themselves being
 * DATA_MODULES-registered. None of the seven can transitively pull the zeros bundle. This audit
 * changes no bound, establishes no operator positivity, and asserts no QED; no refereed bound is changed.
 */

const AUDITED = Object.freeze([
  Object.freeze({
    module: 'imp-96648-route-m-lammax-frobenius-moment-majorant.js',
    inDataModules: true,
    pageReachable: false,
    assertionReachable: true,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: false,
    note: 'has its own dedicated run-assertions.mjs DATA_MODULES entry; mentioned only via prose/@see lines in imp-96667 and imp-96674, neither of which really imports it.',
  }),
  Object.freeze({
    module: 'imp-96649-route-m-condfit-rungs-above-6000.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'mentioned only via prose/@see lines in imp-96668 and imp-96674 (both DATA_MODULES-registered but neither has a real import statement naming it), plus the improvements.js/improvement-queue.js log rows.',
  }),
  Object.freeze({
    module: 'imp-96651-krein-096-fine-extended-scan.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'only reference anywhere in src/ is the improvements.js/improvement-queue.js log rows, not a real import.',
  }),
  Object.freeze({
    module: 'imp-96652-route-m-lammax-sigmoid-onset-spectral-derivation.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'mentioned only via prose/@see lines in imp-96669 (DATA_MODULES-registered but no real import statement naming it).',
  }),
  Object.freeze({
    module: 'imp-96654-gmin-crossover-sensitivity-oscillation.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'only reference anywhere in src/ is the improvements.js/improvement-queue.js log rows, not a real import.',
  }),
  Object.freeze({
    module: 'imp-96655-route-i-floor-independent-digamma-crossval.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: false,
    orphaned: true,
    note: 'itself really imports floorBeyond/M2MAX from the healthy, DATA_MODULES-registered rh-route-i-uncertainty-concentration-certificate-2026-09-24.js, but nothing anywhere in src/ imports imp-96655 in the other direction.',
  }),
  Object.freeze({
    module: 'imp-96656-route-m-conditioning-ceiling-confidence-interval.js',
    inDataModules: false,
    pageReachable: false,
    assertionReachable: false,
    consumers: Object.freeze([]),
    zeroImports: true,
    orphaned: true,
    note: 'mentioned only via prose/@see lines in imp-96674 (DATA_MODULES-registered but no real import statement naming it).',
  }),
]);

export const IMP96685_ORPHAN_CONSUMER_AUDIT = Object.freeze({
  id: 'imp-96685-orphan-consumer-audit',
  title:
    'Consumer/orphan check for the newest Route M/Route I finding modules (imp-96648, imp-96649, '
    + 'imp-96651, imp-96652, imp-96654, imp-96655, imp-96656): verify each is imported by a '
    + 'page/index/assertion or flag it orphaned, and confirm none transitively pulls the 16.7MB '
    + 'zeros bundle',
  status:
    'AUDIT: six of seven ORPHANED (imp-96649, imp-96651, imp-96652, imp-96654, imp-96655, '
    + 'imp-96656 -- no real import statement anywhere in src/, none registered in '
    + 'run-assertions.mjs DATA_MODULES). The seventh (imp-96648) is NOT orphaned: it carries its '
    + 'own direct DATA_MODULES entry, though it is not yet page-reachable. A naive filename grep '
    + 'surfaces four apparent "consumers" (imp-96667, imp-96668, imp-96669, imp-96674) but each '
    + 'references the targets only via prose/@see comments, never a real `import` statement. None '
    + 'of the seven has any import chain reaching the zeros bundle. Audit only; changes no bound; '
    + 'establishes no operator positivity; no refereed bound is changed; NO QED.',
  source: 'imp-96648, imp-96649, imp-96651, imp-96652, imp-96654, imp-96655, imp-96656',

  audited: AUDITED,

  verdict: Object.freeze({
    orphanedCount: 6,
    anyPullsZerosBundle: false,
    conclusion:
      'imp-96649, imp-96651, imp-96652, imp-96654, and imp-96656 are standalone literal-data '
      + 'modules with no real consumer at all beyond the improvements.js/improvement-queue.js logs '
      + 'and prose/@see cross-references in sibling modules that are themselves DATA_MODULES-'
      + 'registered but do not actually import them. imp-96655 additionally has one real outbound '
      + 'import (of a healthy, already-registered module) but no inbound consumer, so it remains '
      + 'orphaned as a target. imp-96648 is the sole non-orphan: it has its own direct '
      + 'run-assertions.mjs DATA_MODULES entry, so the assertion sweep exercises it even though no '
      + 'page renders it yet. Six of seven modules have zero import statements of their own, ruling '
      + 'out any zeros-bundle pull directly; the one real outbound chain (imp-96655) was walked two '
      + 'hops with no zeros-to-1e6.js import found.',
  }),

  caveats:
    'Static grep-based reachability audit; performs no re-derivation of any module\'s own numeric '
    + 'claims. Distinguishes real `import ... from` statements from prose/@see/comment mentions (a '
    + 'module name appearing inside a glossary headword string, an improvements.js log row, or '
    + 'another module\'s @see line does not make that module reachable). Page-reachability is '
    + 'checked via src/data/visualizations-index.js citations and direct page/component imports; '
    + 'DATA_MODULES registration is checked via scripts/run-assertions.mjs. The six flagged orphans '
    + 'are candidates for either wiring into a consumer/page or explicit archival; this audit does '
    + 'neither. Changes no bound; no refereed bound is changed; NO QED.',
});

export const IMP96685_ORPHAN_CONSUMER_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly six of the seven audited modules are orphaned',
    holds: () => AUDITED.filter((m) => m.orphaned).length === 6,
  },
  {
    name: 'imp-96648 is the sole non-orphan and is assertion-reachable',
    holds: () => AUDITED.find((m) => m.module.startsWith('imp-96648')).orphaned === false
      && AUDITED.find((m) => m.module.startsWith('imp-96648')).assertionReachable === true,
  },
  {
    name: 'six of the seven audited modules have zero import statements of their own',
    holds: () => AUDITED.filter((m) => m.zeroImports === true).length === 6,
  },
  {
    name: 'zero of the seven are currently page-reachable',
    holds: () => AUDITED.every((m) => m.pageReachable === false),
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () => /changes no bound/.test(IMP96685_ORPHAN_CONSUMER_AUDIT.status)
      && /refereed bound is changed/i.test(IMP96685_ORPHAN_CONSUMER_AUDIT.status)
      && /NO QED/.test(IMP96685_ORPHAN_CONSUMER_AUDIT.status),
  },
]);

export default IMP96685_ORPHAN_CONSUMER_AUDIT;
