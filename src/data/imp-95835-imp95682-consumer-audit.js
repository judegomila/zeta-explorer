/**
 * @module imp-95835-imp95682-consumer-audit
 *
 * imp-95835 (ux): orphan-consumer audit of the imp-95682 twin-pair
 * block-floor rho log-y viz-data module (IMP95682_ROWS, in
 * src/data/imp-95682-twin-pair-block-floor-rho-viz-data.js) -- determines
 * whether any page/component renders it, or whether it needs new wiring.
 *
 * METHOD: grepped src/ for the module's import specifier
 * "imp-95682-twin-pair-block-floor-rho-viz-data". Consumers found besides
 * the log/queue prose mentions: src/pages/Imp95682TwinPairBlockFloorRhoViz.jsx
 * (imports IMP95682_ROWS, IMP95682_HALF_RETENTION_RHO and
 * IMP95682_CAVEAT_BANNER directly and renders the three-curve log10-y
 * chart plus a data table), src/App.jsx (lazy-imports the page component
 * and registers it at route "/viz-imp95682-twin-pair-block-floor-rho"),
 * and src/data/visualizations-index.js (a complete row: route, title,
 * oneLine, mathBucket, dataModule, paperSourcePath, ticket,
 * pedagogicalStep 176, honestCeiling). The page is further reachable via
 * src/pages/VisualizationsIndexPage.jsx, which renders every
 * visualizations-index.js entry as a browsable link. The page also
 * already carries the imp-95831 F_inf per-cell relative-error table
 * addition, confirming it is an actively maintained, live consumer
 * rather than a stale stub.
 *
 * FINDING: NOT orphaned. The module is fully wired end to end
 * (data module -> page component -> App.jsx route ->
 * visualizations-index row -> VisualizationsIndexPage listing); no new
 * page, route, or index row is needed. AUDIT-ONLY: no bound change;
 * NO QED; no refereed bound is changed.
 */

const WIRING_CHAIN = {
  dataModule: 'src/data/imp-95682-twin-pair-block-floor-rho-viz-data.js',
  pageComponent: 'src/pages/Imp95682TwinPairBlockFloorRhoViz.jsx',
  appRoute: '/viz-imp95682-twin-pair-block-floor-rho',
  visualizationsIndexTicket: 'imp-95682',
  visualizationsIndexPedagogicalStep: 176,
};

export const IMP95835_IMP95682_CONSUMER_AUDIT = {
  ticket: 'imp-95835',
  subject: WIRING_CHAIN.dataModule,
  wiringChain: WIRING_CHAIN,
  isOrphaned: false,
  hasVizIndexRow: true,
  hasAppRoute: true,
  reachableFromIndexPage: true,
  honest:
    'AUDIT-ONLY -- the imp-95682 twin-pair block-floor rho log-y viz-data module ' +
    '(IMP95682_ROWS) is NOT orphaned: it is imported by its dedicated page component ' +
    '(Imp95682TwinPairBlockFloorRhoViz.jsx), which is routed in src/App.jsx at ' +
    '"/viz-imp95682-twin-pair-block-floor-rho", carries a complete matching row in ' +
    'visualizations-index.js (pedagogicalStep 176), and is browsable via ' +
    'VisualizationsIndexPage.jsx. No new wiring required. Changes no bound; NO QED; ' +
    'no refereed bound is changed.',
};

export const IMP95835_IMP95682_CONSUMER_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95835-not-orphaned',
    description: 'the audit concludes the module is not orphaned',
    holds: () => IMP95835_IMP95682_CONSUMER_AUDIT.isOrphaned === false,
  },
  {
    id: 'imp-95835-full-chain-present',
    description: 'every link of the data-module -> page -> route -> index chain is recorded',
    holds: () =>
      IMP95835_IMP95682_CONSUMER_AUDIT.hasAppRoute === true &&
      IMP95835_IMP95682_CONSUMER_AUDIT.hasVizIndexRow === true &&
      IMP95835_IMP95682_CONSUMER_AUDIT.reachableFromIndexPage === true,
  },
  {
    id: 'imp-95835-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP95835_IMP95682_CONSUMER_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP95835_IMP95682_CONSUMER_AUDIT.honest),
  },
];

for (const a of IMP95835_IMP95682_CONSUMER_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95835-imp95682-consumer-audit assertion failed: ${a.id}`);
}
