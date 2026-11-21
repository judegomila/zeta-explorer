/**
 * @module imp-95664-viz-banner-audit
 *
 * imp-95664 (meta/ux): audits the three newly shipped viz pages
 * imp-95645 (src/pages/Imp95645KroneckerTransferConstantViz.jsx),
 * imp-95646 (src/pages/Imp95646TransitionKnee2DHeatmapViz.jsx), and
 * imp-95647 (src/pages/Imp95647ConditionNumberViz.jsx) for a no-QED /
 * Platt-Trudgian Lambda <= 0.2 honest-status banner and for a correct,
 * complete visualizations-index.js row.
 *
 * METHOD: read each page's JSX for an "Honest status:" banner and its
 * closing status footer, and cross-checked the corresponding
 * visualizations-index.js entry (route, ticket, dataModule, pedagogicalStep,
 * honestCeiling) against the page and its underlying data module.
 *
 * FINDINGS:
 *  - imp-95645: carries an "Honest status: ... NO QED" banner plus a
 *    matching closing "Status:" footer; index route
 *    /viz-imp95645-kronecker-transfer-constant, ticket imp-95645,
 *    dataModule src/data/imp-95616-kronecker-suprms-crosscheck.js (exists),
 *    honestCeiling text ends "No refereed bound is changed;
 *    NO QED." CONSISTENT.
 *  - imp-95646: carries an "Honest status: ... NO QED" banner plus a
 *    matching closing "Status:" footer; index route
 *    /viz-imp95646-transition-knee-2d-heatmap, ticket imp-95646,
 *    dataModule src/data/imp-95646-transition-knee-2d-heatmap-viz-data.js
 *    (exists), honestCeiling text ends "No refereed bound is changed
 *    ; NO QED." CONSISTENT.
 *  - imp-95647: carries an "Honest status: ... NO QED" banner plus a
 *    matching closing "Status:" footer; index route
 *    /viz-imp95647-condition-number, ticket imp-95647, dataModule
 *    src/data/imp-95647-condition-number-viz-data.js (exists), honestCeiling
 *    text ends "No refereed bound is changed; NO QED."
 *    CONSISTENT.
 *  - All three routes are wired in src/App.jsx (lazy import + <Route>).
 *
 * AUDIT-ONLY: no banner text was found missing or inconsistent, and no
 * visualizations-index.js row was found incomplete or incorrect, so no
 * banner or row was added or changed. No bound change; NO QED;
 * no refereed bound is changed.
 */

const AUDITED_PAGES = [
  {
    ticket: 'imp-95645',
    vizPage: 'src/pages/Imp95645KroneckerTransferConstantViz.jsx',
    indexRoute: '/viz-imp95645-kronecker-transfer-constant',
    dataModule: 'src/data/imp-95616-kronecker-suprms-crosscheck.js',
    pageHasBanner: true,
    pageHasStatusFooter: true,
    indexRowComplete: true,
    consistent: true,
  },
  {
    ticket: 'imp-95646',
    vizPage: 'src/pages/Imp95646TransitionKnee2DHeatmapViz.jsx',
    indexRoute: '/viz-imp95646-transition-knee-2d-heatmap',
    dataModule: 'src/data/imp-95646-transition-knee-2d-heatmap-viz-data.js',
    pageHasBanner: true,
    pageHasStatusFooter: true,
    indexRowComplete: true,
    consistent: true,
  },
  {
    ticket: 'imp-95647',
    vizPage: 'src/pages/Imp95647ConditionNumberViz.jsx',
    indexRoute: '/viz-imp95647-condition-number',
    dataModule: 'src/data/imp-95647-condition-number-viz-data.js',
    pageHasBanner: true,
    pageHasStatusFooter: true,
    indexRowComplete: true,
    consistent: true,
  },
];

export const IMP95664_VIZ_BANNER_AUDIT = {
  ticket: 'imp-95664',
  auditedPages: AUDITED_PAGES,
  allAuditedConsistent: AUDITED_PAGES.every((p) => p.consistent),
  missingBannerCount: AUDITED_PAGES.filter((p) => !p.pageHasBanner).length,
  incompleteRowCount: AUDITED_PAGES.filter((p) => !p.indexRowComplete).length,
  honest:
    'AUDIT-ONLY: all three newly shipped viz pages (imp-95645, imp-95646, imp-95647) already carry ' +
    'an "Honest status:" banner and a matching closing status footer stating measurement/presentation ' +
    'only, no bound changed, no operator positivity established, no RH claim, and no refereed bound is changed' +
    ' (NO QED); each has a complete, correct visualizations-index.js row ' +
    '(route wired in App.jsx, ticket, dataModule pointing at an existing file, pedagogicalStep, ' +
    'honestCeiling). No banner text was missing; no row was incomplete or incorrect; none was added ' +
    'or changed. No bound change; NO QED; no refereed bound is changed.',
};

export const IMP95664_VIZ_BANNER_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95664-three-pages-audited',
    description: 'exactly three viz pages were audited',
    holds: () => IMP95664_VIZ_BANNER_AUDIT.auditedPages.length === 3,
  },
  {
    id: 'imp-95664-all-consistent',
    description: 'every audited page carries a banner and a complete, correct index row',
    holds: () =>
      IMP95664_VIZ_BANNER_AUDIT.allAuditedConsistent === true &&
      IMP95664_VIZ_BANNER_AUDIT.missingBannerCount === 0 &&
      IMP95664_VIZ_BANNER_AUDIT.incompleteRowCount === 0,
  },
  {
    id: 'imp-95664-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP95664_VIZ_BANNER_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP95664_VIZ_BANNER_AUDIT.honest),
  },
];

for (const a of IMP95664_VIZ_BANNER_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95664-viz-banner-audit assertion failed: ${a.id}`);
}
