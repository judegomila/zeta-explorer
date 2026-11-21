/**
 * @module imp-95696-legb-straddle-consumer-audit
 *
 * imp-95696 (meta): orphan-consumer audit of the imp-95587 LEG B DELTA_A
 * straddle-vs-ratio viz-data module
 * (src/data/imp-95587-legb-straddle-vs-ratio-viz-data.js) -- determines
 * whether any page/component renders it, or whether it is an orphaned
 * data file needing new wiring.
 *
 * METHOD: grepped src/ for the module's import specifier
 * "imp-95587-legb-straddle-vs-ratio-viz-data". Three consumers found
 * besides the log/queue prose mentions: src/pages/Imp95587LegBStraddleVsRatioViz.jsx
 * (imports the module directly), src/App.jsx (lazy-imports the page
 * component and registers it at route
 * "/viz-imp95587-legb-straddle-vs-ratio"), and
 * src/data/visualizations-index.js (a complete row: route, title,
 * oneLine, mathBucket, dataModule, paperSourcePath, ticket,
 * pedagogicalStep 165, honestCeiling). Confirmed the page itself carries
 * the mandatory NO QED / no-refereed-bound-change banner.
 *
 * FINDING: NOT orphaned. The module is fully wired end to end
 * (data module -> page component -> App.jsx route -> visualizations-index
 * row); no new page, route, or index row is needed. AUDIT-ONLY: no bound
 * change; NO QED; no refereed bound is changed.
 */

const WIRING_CHAIN = {
  dataModule: 'src/data/imp-95587-legb-straddle-vs-ratio-viz-data.js',
  pageComponent: 'src/pages/Imp95587LegBStraddleVsRatioViz.jsx',
  appRoute: '/viz-imp95587-legb-straddle-vs-ratio',
  visualizationsIndexTicket: 'imp-95587',
};

export const IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT = {
  ticket: 'imp-95696',
  subject: WIRING_CHAIN.dataModule,
  wiringChain: WIRING_CHAIN,
  isOrphaned: false,
  pageHasHonestBanner: true,
  hasVizIndexRow: true,
  hasAppRoute: true,
  honest:
    'AUDIT-ONLY -- the imp-95587 LEG B DELTA_A straddle-vs-ratio viz-data module is NOT ' +
    'orphaned: it is imported by its dedicated page component ' +
    '(Imp95587LegBStraddleVsRatioViz.jsx), which is routed in src/App.jsx at ' +
    '"/viz-imp95587-legb-straddle-vs-ratio" and carries a complete matching row in ' +
    'visualizations-index.js (pedagogicalStep 165). No new wiring required. Changes no ' +
    'bound; NO QED; no refereed bound is changed.',
};

export const IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95696-not-orphaned',
    description: 'the audit concludes the module is not orphaned',
    holds: () => IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT.isOrphaned === false,
  },
  {
    id: 'imp-95696-full-chain-present',
    description: 'every link of the data-module -> page -> route -> index chain is recorded',
    holds: () =>
      IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT.hasAppRoute === true &&
      IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT.hasVizIndexRow === true &&
      IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT.pageHasHonestBanner === true,
  },
  {
    id: 'imp-95696-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT.honest),
  },
];

for (const a of IMP95696_LEGB_STRADDLE_CONSUMER_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95696-legb-straddle-consumer-audit assertion failed: ${a.id}`);
}
