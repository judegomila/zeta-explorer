/**
 * @module imp-1249-nav-link-audit
 * @description Navigation link audit — identifies pages with weak discoverability (0-1 incoming links).
 * Pages linked from multiple sibling pages have better pedagogical conversion.
 */

export const weakEntryPoints = {
  zeroIncoming: [
    { route: '/break', file: 'BreakItPage.jsx' },
    { route: '/health', file: 'HealthPage.jsx' },
    { route: '/historical-reasoning', file: 'HistoricalReasoningPage.jsx' },
    { route: '/queue', file: 'ImprovementQueuePage.jsx' },
    { route: '/project-index', file: 'ProjectIndexPage.jsx' },
    { route: '/journal', file: 'ResearchJournalPage.jsx' },
    { route: '/sim', file: 'SimulatorPage.jsx' },
    { route: '/gue-comparison', file: 'GueComparisonPage.jsx' },
    { route: '/voronin-universality', file: 'VoroninUniversalityPage.jsx' },
    { route: '/pair-correlation', file: 'PairCorrelationPage.jsx' },
    { route: '/riemann-siegel-z', file: 'RiemannSiegelZPage.jsx' },
    { route: '/berry-keating-xp', file: 'BerryKeatingXpPage.jsx' },
    { route: '/connes-adelic', file: 'ConnesAdelicPage.jsx' },
    { route: '/esy-rigidity-empirical', file: 'EsyRigidityEmpiricalPage.jsx' },
    { route: '/lmfdb-cross-reference', file: 'LmfdbCrossReferencePage.jsx' },
    { route: '/edge-rigidity', file: 'EdgeRigidityPage.jsx' },
    { route: '/papers-download', file: 'PapersDownloadPage.jsx' },
    { route: '/paper-audit-dashboard', file: 'PaperAuditDashboardPage.jsx' },
    { route: '/viz-hyperbolic-prime-spiral', file: 'VizHyperbolicPrimeSpiralPage.jsx' },
    { route: '/visualizations', file: 'VisualizationsIndexPage.jsx' },
  ],
  oneIncoming: [
    { route: '/calabi-yau', file: 'CalabiYauPage.jsx' },
    { route: '/docs', file: 'DocsPage.jsx' },
    { route: '/dyson-verifier', file: 'DysonVerifierPage.jsx' },
    { route: '/pascal', file: 'PascalPage.jsx' },
    { route: '/rh-dag', file: 'RhDagPage.jsx' },
    { route: '/wiki', file: 'WikiPage.jsx' },
    { route: '/hardy-z', file: 'HardyZPage.jsx' },
    { route: '/gram-points', file: 'GramPointsPage.jsx' },
    { route: '/freezing-bridge', file: 'FreezingBridgePage.jsx' },
    { route: '/twin-ladder-paper-roadmap', file: 'TwinLadderPaperRoadmapPage.jsx' },
    { route: '/viz-log-phase-spiral', file: 'VizLogPhaseSpiralPage.jsx' },
    { route: '/viz-euler-transport-flow', file: 'VizEulerTransportFlowPage.jsx' },
    { route: '/viz-twin-ladder-tomography', file: 'VizTwinLadderTomographyPage.jsx' },
    { route: '/hidden-square-program', file: 'HiddenSquareProgramPage.jsx' },
    { route: '/cross-attack', file: 'CrossAttackPage.jsx' },
    { route: '/rigorous-numerics-stages', file: 'RigorousNumericsStagesPage.jsx' },
  ],
};

// --------- TRIPWIRES ---------

// TRIPWIRE 1: Total weak entry points should be < 50% of all pages
export function tripwire1_weakEntryPointRatio() {
  const totalWeak = weakEntryPoints.zeroIncoming.length + weakEntryPoints.oneIncoming.length;
  const threshold = 50;
  const ratio = (totalWeak / 85) * 100;

  if (ratio > threshold) {
    return {
      pass: false,
      message: `${ratio.toFixed(1)}% of pages are weak entry points (>= ${threshold}% threshold)`,
      severity: 'warning',
      details: `${totalWeak} of 85 pages have 0-1 incoming links`,
    };
  }
  return {
    pass: true,
    message: `${ratio.toFixed(1)}% weak entry points (within ${threshold}% threshold)`,
    severity: 'info',
  };
}

// TRIPWIRE 2: Pages with zero incoming links should be documented
export function tripwire2_zeroIncomingCount() {
  const zeroCount = weakEntryPoints.zeroIncoming.length;

  if (zeroCount > 20) {
    return {
      pass: false,
      message: `${zeroCount} pages are completely unreachable from sibling pages`,
      severity: 'warning',
      details: 'These pages only appear in top nav or direct bookmarks',
    };
  }
  return {
    pass: true,
    message: `${zeroCount} pages are completely unreachable (acceptable)`,
    severity: 'info',
  };
}

// TRIPWIRE 3: Critical hub pages should have 3+ incoming links
const criticalPages = {
  '/rh-attack': 'RHAttackPage.jsx',
  '/proof-overview': 'ProofOverviewPage.jsx',
  '/gap-closing': 'GapClosingPage.jsx',
  '/paper': 'PaperPage.jsx',
  '/literature': 'LiteraturePage.jsx',
};

export function tripwire3_criticalPageConnectivity() {
  const allWeak = new Set([
    ...weakEntryPoints.zeroIncoming.map(p => p.route),
    ...weakEntryPoints.oneIncoming.map(p => p.route),
  ]);

  const criticalWithWeak = Object.keys(criticalPages).filter(route => allWeak.has(route));

  if (criticalWithWeak.length > 0) {
    return {
      pass: false,
      message: `Critical pages with weak connectivity: ${criticalWithWeak.join(', ')}`,
      severity: 'error',
      details: 'Critical hub pages should have 2+ incoming links for pedagogical flow',
    };
  }
  return {
    pass: true,
    message: 'All critical hub pages have adequate incoming links',
    severity: 'info',
  };
}

// TRIPWIRE 4: Visualization pages should be grouped or consolidated
export function tripwire4_visualizationFragmentation() {
  const vizPages = weakEntryPoints.zeroIncoming.filter(p => p.route.includes('viz-'));
  const unlinkedVizCount = vizPages.length;

  if (unlinkedVizCount > 3) {
    return {
      pass: false,
      message: `${unlinkedVizCount} visualization pages are orphaned (only reachable via /visualizations index)`,
      severity: 'warning',
      details: 'Consider cross-linking visualizations by theme or mathematical concept',
    };
  }
  return {
    pass: true,
    message: `Visualization fragmentation acceptable (${unlinkedVizCount} orphaned)`,
    severity: 'info',
  };
}

// Run all tripwires and return summary
export function runAllTripwires() {
  return {
    t1: tripwire1_weakEntryPointRatio(),
    t2: tripwire2_zeroIncomingCount(),
    t3: tripwire3_criticalPageConnectivity(),
    t4: tripwire4_visualizationFragmentation(),
  };
}
