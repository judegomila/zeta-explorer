import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MathModalProvider } from './components/KaTeXMath.jsx';
import HomePage from './pages/HomePage.jsx';
import RouteErrorBoundary from './components/RouteErrorBoundary.jsx';
import { NAV_GROUPS } from './data/nav-groups.js';
import './styles/app.css';

// Lazy-load all pages except HomePage for code-splitting
const PapersDownloadPage = lazy(() => import('./pages/PapersDownloadPage.jsx'));
const OscillatorsPage = lazy(() => import('./pages/OscillatorsPage.jsx'));
const HamiltonianPage = lazy(() => import('./pages/HamiltonianPage.jsx'));
const ZetaPage = lazy(() => import('./pages/ZetaPage.jsx'));
const ControlTheoryPage = lazy(() => import('./pages/ControlTheoryPage.jsx'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage.jsx'));
const ModesPage = lazy(() => import('./pages/ModesPage.jsx'));
const ExplorationsPage = lazy(() => import('./pages/ExplorationsPage.jsx'));
const LiteraturePage = lazy(() => import('./pages/LiteraturePage.jsx'));
const SimulatorPage = lazy(() => import('./pages/SimulatorPage.jsx'));
const FourierPage = lazy(() => import('./pages/FourierPage.jsx'));
const SupercriticalPage = lazy(() => import('./pages/SupercriticalPage.jsx'));
const DocsPage = lazy(() => import('./pages/DocsPage.jsx'));
const ImprovementsPage = lazy(() => import('./pages/ImprovementsPage.jsx'));
const WaveSimPage = lazy(() => import('./pages/WaveSimPage.jsx'));
const RHRigorPage = lazy(() => import('./pages/RHRigorPage.jsx'));
const TwistorPage = lazy(() => import('./pages/TwistorPage.jsx'));
const PaperPage = lazy(() => import('./pages/PaperPage.jsx'));
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const ConceptsPage = lazy(() => import('./pages/ConceptsPage.jsx'));
const PascalPage = lazy(() => import('./pages/PascalPage.jsx'));
const ZXCalculusPage = lazy(() => import('./pages/ZXCalculusPage.jsx'));
const RHAttackPage = lazy(() => import('./pages/RHAttackPage.jsx'));
const InformationTheoryPage = lazy(() => import('./pages/InformationTheoryPage.jsx'));
const FormalProofPage = lazy(() => import('./pages/FormalProofPage.jsx'));
const OddZetaPage = lazy(() => import('./pages/OddZetaPage.jsx'));
const GapClosingPage = lazy(() => import('./pages/GapClosingPage.jsx'));
const SpectralAttackPage = lazy(() => import('./pages/SpectralAttackPage.jsx'));
const ProofCheckerPage = lazy(() => import('./pages/ProofCheckerPage.jsx'));
const HistoricalReasoningPage = lazy(() => import('./pages/HistoricalReasoningPage.jsx'));
const PaperUploadPage = lazy(() => import('./pages/PaperUploadPage.jsx'));
const PapersListPage = lazy(() => import('./pages/PapersListPage.jsx'));
const TwinLadderPage = lazy(() => import('./pages/TwinLadderPage.jsx'));
const CalabiYauPage = lazy(() => import('./pages/CalabiYauPage.jsx'));
const CrossAttackPage = lazy(() => import('./pages/CrossAttackPage.jsx'));
const ProofPlannerPage = lazy(() => import('./pages/ProofPlannerPage.jsx'));
const ImprovementQueuePage = lazy(() => import('./pages/ImprovementQueuePage.jsx'));
const ProofOverviewPage = lazy(() => import('./pages/ProofOverviewPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const BreakItPage = lazy(() => import('./pages/BreakItPage.jsx'));
const ProofExplorerPage = lazy(() => import('./pages/ProofExplorerPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const WikiPage = lazy(() => import('./pages/WikiPage.jsx'));
const ProjectIndexPage = lazy(() => import('./pages/ProjectIndexPage.jsx'));
const ResearchJournalPage = lazy(() => import('./pages/ResearchJournalPage.jsx'));
const MetaAccelerationPage = lazy(() => import('./pages/MetaAccelerationPage.jsx'));
const LambdaBoundsPage = lazy(() => import('./pages/LambdaBoundsPage.jsx'));
const LambdaTimelinePage = lazy(() => import('./pages/LambdaTimelinePage.jsx'));
const RhDagPage = lazy(() => import('./pages/RhDagPage.jsx'));
const RigorDashboardPage = lazy(() => import('./pages/RigorDashboardPage.jsx'));
const DysonVerifierPage = lazy(() => import('./pages/DysonVerifierPage.jsx'));
const HealthPage = lazy(() => import('./pages/HealthPage.jsx'));
const FullStoryPage = lazy(() => import('./pages/FullStoryPage.jsx'));
const GramPointsPage = lazy(() => import('./pages/GramPointsPage.jsx'));
const SelbergTracePage = lazy(() => import('./pages/SelbergTracePage.jsx'));
const RHEquivalentsPage = lazy(() => import('./pages/RHEquivalentsPage.jsx'));
const ThreeAttacksPage = lazy(() => import('./pages/ThreeAttacksPage.jsx'));
const BlaschkeGhostsPage = lazy(() => import('./pages/BlaschkeGhostsPage.jsx'));
const ClosureRoutesPage = lazy(() => import('./pages/ClosureRoutesPage.jsx'));
const KypBoundedRealPage = lazy(() => import('./pages/KypBoundedRealPage.jsx'));
const ShiftBridgePositivityPage = lazy(() => import('./pages/ShiftBridgePositivityPage.jsx'));
const FreezingBridgePage = lazy(() => import('./pages/FreezingBridgePage.jsx'));
const RigorousNumericsStagesPage = lazy(() => import('./pages/RigorousNumericsStagesPage.jsx'));
const TwinLadderPaperRoadmapPage = lazy(() => import('./pages/TwinLadderPaperRoadmapPage.jsx'));
const PaperAuditDashboardPage = lazy(() => import('./pages/PaperAuditDashboardPage.jsx'));
const PCCRouteExhaustionPage = lazy(() => import('./pages/PCCRouteExhaustionPage.jsx'));
const HtCorridorCertificatesPage = lazy(() => import('./pages/HtCorridorCertificatesPage.jsx'));
const HtFiniteWindowPage = lazy(() => import('./pages/HtFiniteWindowPage.jsx'));
const VizHyperbolicPrimeSpiralPage = lazy(() => import('./pages/VizHyperbolicPrimeSpiralPage.jsx'));
const HiddenSquareProgramPage = lazy(() => import('./pages/HiddenSquareProgramPage.jsx'));
const ReciprocalProgramPage = lazy(() => import('./pages/ReciprocalProgramPage.jsx'));
const VizLogPhaseSpiralPage = lazy(() => import('./pages/VizLogPhaseSpiralPage.jsx'));
const VizEulerTransportFlowPage = lazy(() => import('./pages/VizEulerTransportFlowPage.jsx'));
const HardyZPage = lazy(() => import('./pages/HardyZPage.jsx'));
const VizTwinLadderTomographyPage = lazy(() => import('./pages/VizTwinLadderTomographyPage.jsx'));
const VizPrimeCausticPage = lazy(() => import('./pages/VizPrimeCausticPage.jsx'));
const VizPrimeDensityOnCausticPage = lazy(() => import('./pages/VizPrimeDensityOnCausticPage.jsx'));
const VizPrimePhaseCrystalPage = lazy(() => import('./pages/VizPrimePhaseCrystalPage.jsx'));
const VisualizationsIndexPage = lazy(() => import('./pages/VisualizationsIndexPage.jsx'));
const VolterraKernelHeatmapPage = lazy(() => import('./pages/VolterraKernelHeatmapPage.jsx'));
const VolterraNormCurvePage = lazy(() => import('./pages/VolterraNormCurvePage.jsx'));
const VolterraBoundPage = lazy(() => import('./pages/VolterraBoundPage.jsx'));
const SchattenTraceNormPage = lazy(() => import('./pages/SchattenTraceNormPage.jsx'));
const CayleySchurTrajectoryPage = lazy(() => import('./pages/CayleySchurTrajectoryPage.jsx'));
const CollapseChainPage = lazy(() => import('./pages/CollapseChainPage.jsx'));
const RHProofStateDashboardPage = lazy(() => import('./pages/RHProofStateDashboardPage.jsx'));
const WhatWeKnowPage = lazy(() => import('./pages/WhatWeKnowPage.jsx'));
const RouteMapPage = lazy(() => import('./pages/RouteMapPage.jsx'));
const StateOfProgramPage = lazy(() => import('./pages/StateOfProgramPage.jsx'));
const EngineRoomPage = lazy(() => import('./pages/EngineRoomPage.jsx'));
const VortexFieldPage = lazy(() => import('./pages/VortexFieldPage.jsx'));
const VizWindingDysonFlowPage = lazy(() => import('./pages/VizWindingDysonFlowPage.jsx'));
const VizNearZeroPage = lazy(() => import('./pages/VizNearZeroPage.jsx'));
const VisualGeometriesPage = lazy(() => import('./pages/VisualGeometriesPage.jsx'));
const PrimeRigidityPage = lazy(() => import('./pages/PrimeRigidityPage.jsx'));
const VizEulerProductPage = lazy(() => import('./pages/VizEulerProductPage.jsx'));
const VizCausticResonancePage = lazy(() => import('./pages/VizCausticResonancePage.jsx'));
const VizPhaseCylinderPage = lazy(() => import('./pages/VizPhaseCylinderPage.jsx'));
const VizUnwrappedRaysPage = lazy(() => import('./pages/VizUnwrappedRaysPage.jsx'));
const VizZoomHierarchyPage = lazy(() => import('./pages/VizZoomHierarchyPage.jsx'));
const AngularSpacingStatsPage = lazy(() => import('./pages/AngularSpacingStatsPage.jsx'));
const MillsTheoremPage = lazy(() => import('./pages/MillsTheoremPage.jsx'));
const GilbreathObservationPage = lazy(() => import('./pages/GilbreathObservationPage.jsx'));
const BerryKeatingXpPage = lazy(() => import('./pages/BerryKeatingXpPage.jsx'));
const ConnesAdelicPage = lazy(() => import('./pages/ConnesAdelicPage.jsx'));
const EdgeRigidityPage = lazy(() => import('./pages/EdgeRigidityPage.jsx'));
const EsyRigidityEmpiricalPage = lazy(() => import('./pages/EsyRigidityEmpiricalPage.jsx'));
const GueComparisonPage = lazy(() => import('./pages/GueComparisonPage.jsx'));
const LmfdbCrossReferencePage = lazy(() => import('./pages/LmfdbCrossReferencePage.jsx'));
const PairCorrelationPage = lazy(() => import('./pages/PairCorrelationPage.jsx'));
const RiemannSiegelZPage = lazy(() => import('./pages/RiemannSiegelZPage.jsx'));
const VoroninUniversalityPage = lazy(() => import('./pages/VoroninUniversalityPage.jsx'));
const ThetaSeizingMarginPage = lazy(() => import('./pages/ThetaSeizingMarginPage.jsx'));
const ThetaStaticObstructionPage = lazy(() => import('./pages/ThetaStaticObstructionPage.jsx'));
const ThetaBasinClosurePage = lazy(() => import('./pages/ThetaBasinClosurePage.jsx'));
const TheoremBThresholdPage = lazy(() => import('./pages/TheoremBThresholdPage.jsx'));
const OnsetBracketLedgerPage = lazy(() => import('./pages/OnsetBracketLedgerPage.jsx'));
const OpenFrontierPage = lazy(() => import('./pages/OpenFrontierPage.jsx'));
const Section26ConditioningArtifactPage = lazy(() => import('./pages/Section26ConditioningArtifactPage.jsx'));
const ExcessFractionPhiPage = lazy(() => import('./pages/ExcessFractionPhiPage.jsx'));
const CShockNumericalCoincidencePage = lazy(() => import('./pages/CShockNumericalCoincidencePage.jsx'));
const Imp3256CrossvalPage = lazy(() => import('./pages/Imp3256CrossvalPage.jsx'));
const Imp3252ScaledMuPage = lazy(() => import('./pages/Imp3252ScaledMuPage.jsx'));
const Imp3467ClosedFormCViz = lazy(() => import('./pages/Imp3467ClosedFormCViz.jsx'));
const Imp3540PowerIterationBudgetViz = lazy(() => import('./pages/Imp3540PowerIterationBudgetViz.jsx'));
const Imp3541CoshCancellationMarginViz = lazy(() => import('./pages/Imp3541CoshCancellationMarginViz.jsx'));
const Imp3542DegreeDMissFactorViz = lazy(() => import('./pages/Imp3542DegreeDMissFactorViz.jsx'));
const Imp3543XiStarRobustnessViz = lazy(() => import('./pages/Imp3543XiStarRobustnessViz.jsx'));
const Imp3563QuadratureStraddleViz = lazy(() => import('./pages/Imp3563QuadratureStraddleViz.jsx'));
const Imp3564PowerIterationClosedFormViz = lazy(() => import('./pages/Imp3564PowerIterationClosedFormViz.jsx'));
const Imp3565SigmaPostpeakDecayExponentViz = lazy(() => import('./pages/Imp3565SigmaPostpeakDecayExponentViz.jsx'));
const Imp3566CoshSinhMarginContrastViz = lazy(() => import('./pages/Imp3566CoshSinhMarginContrastViz.jsx'));
const Imp3586SigmaCrossingLogisticDropViz = lazy(() => import('./pages/Imp3586SigmaCrossingLogisticDropViz.jsx'));
const Imp3567ClosedErrorCertificateViz = lazy(() => import('./pages/Imp3567ClosedErrorCertificateViz.jsx'));
const Imp3589CoshOverestimationFactorViz = lazy(() => import('./pages/Imp3589CoshOverestimationFactorViz.jsx'));
const Imp3611SkewToeplitzKrylovGapLadderViz = lazy(() => import('./pages/Imp3611SkewToeplitzKrylovGapLadderViz.jsx'));
const Imp3612FitBiasDepthSweepViz = lazy(() => import('./pages/Imp3612FitBiasDepthSweepViz.jsx'));
const Imp3613ReplicaFoldInGeometryViz = lazy(() => import('./pages/Imp3613ReplicaFoldInGeometryViz.jsx'));
const Imp3614SigmaCrossoverFloorInvarianceViz = lazy(() => import('./pages/Imp3614SigmaCrossoverFloorInvarianceViz.jsx'));
const Imp3655FlowGapResidualLadderViz = lazy(() => import('./pages/Imp3655FlowGapResidualLadderViz.jsx'));
const Imp3656TripleSkewToeplitzGapLadderViz = lazy(() => import('./pages/Imp3656TripleSkewToeplitzGapLadderViz.jsx'));
const Imp3657SigmaCrossoverTcClosedformPinViz = lazy(() => import('./pages/Imp3657SigmaCrossoverTcClosedformPinViz.jsx'));
const Imp3658PlantedReplicaArgmaxDriftViz = lazy(() => import('./pages/Imp3658PlantedReplicaArgmaxDriftViz.jsx'));
const Imp3695FeatureFoldinFloorLadderViz = lazy(() => import('./pages/Imp3695FeatureFoldinFloorLadderViz.jsx'));
const Imp3696MatchedPairKrylovDepthSweepViz = lazy(() => import('./pages/Imp3696MatchedPairKrylovDepthSweepViz.jsx'));
const Imp3697AWeightDecayCrosscheckViz = lazy(() => import('./pages/Imp3697AWeightDecayCrosscheckViz.jsx'));
const Imp3698FifthPairAdjacentPairingViz = lazy(() => import('./pages/Imp3698FifthPairAdjacentPairingViz.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function PageLoader() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ height: 26, width: '50%', borderRadius: 6, background: 'var(--color-border, #e2e8f0)', marginBottom: 24, animation: 'pulse 1.6s ease-in-out infinite' }} />
      {[100, 88, 94].map((w, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ height: 13, width: w + '%', borderRadius: 4, background: 'var(--color-border, #e2e8f0)', animation: 'pulse 1.6s ease-in-out infinite' }} />
        </div>
      ))}
      <div style={{ height: 13, width: '60%', borderRadius: 4, background: 'var(--color-border, #e2e8f0)', marginTop: 24, animation: 'pulse 1.6s ease-in-out infinite' }} />
    </div>
  );
}

function NavDropdown({ label, items }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const hasActive = items.some(item => location.pathname === item.to);

  // Close dropdown on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={`nav-dropdown ${hasActive ? 'nav-dropdown-active' : ''} ${isOpen ? 'nav-dropdown-open' : ''}`}
      onKeyDown={e => { if (e.key === 'Escape' && isOpen) setIsOpen(false); }}
    >
      <button
        className="nav-dropdown-trigger"
        onClick={() => setIsOpen(o => !o)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`${label} menu`}
      >
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ marginLeft: 4 }} aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      <div className="nav-dropdown-menu" role="menu" aria-label={`${label} navigation`}>
        {items.map(item => (
          // end: all nav items are non-root flat paths; prevents false-active if a nested route is ever added under the same slug
          // NavLink auto-applies aria-current="page" on the active route; role=menuitem completes the menu pattern
          <NavLink key={item.to} to={item.to} end role="menuitem">{item.label}</NavLink>
        ))}
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const KEYBOARD_SHORTCUTS = [
  { key: '1', label: 'Home', path: '/' },
  { key: '2', label: 'Lambda Bounds', path: '/lambda-bounds' },
  { key: '3', label: 'Zeta', path: '/zeta' },
  { key: '4', label: 'Route Map', path: '/route-map' },
  { key: '5', label: 'Engine Room', path: '/engine-room' },
  { key: '6', label: 'Statistics', path: '/statistics' },
  { key: '7', label: 'RH Proof State', path: '/rh-proof-state' },
  { key: '8', label: 'Improvement Queue', path: '/improvement-queue' },
  { key: '9', label: 'RH DAG', path: '/rh-dag' },
];

function KeyboardShortcutOverlay({ show, onClose }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!show) return undefined;
    previousFocusRef.current = document.activeElement;
    const node = dialogRef.current;
    if (node) {
      const firstFocusable = node.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
      (firstFocusable || node).focus();
    }
    return () => {
      const trigger = previousFocusRef.current;
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    };
  }, [show]);

  if (!show) return null;

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const node = dialogRef.current;
    if (!node) return;
    const focusable = Array.from(
      node.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled);
    if (focusable.length === 0) { e.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)', display: 'flex',
        justifyContent: 'center', alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kbd-shortcuts-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{
          background: '#1e293b', border: '1px solid #334155',
          borderRadius: 12, padding: '28px 36px', maxWidth: 420, width: '90%',
          color: '#e2e8f0', fontFamily: 'var(--font-mono)', outline: 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 id="kbd-shortcuts-title" style={{ margin: 0, fontSize: 18, color: '#f8fafc' }}>Keyboard Shortcuts</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#94a3b8',
              fontSize: 20, cursor: 'pointer', padding: '0 4px',
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {KEYBOARD_SHORTCUTS.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <kbd style={{
                background: '#334155', border: '1px solid #475569',
                borderRadius: 4, padding: '2px 8px', fontSize: 14,
                minWidth: 24, textAlign: 'center', color: '#e0f2fe',
              }}>{s.key}</kbd>
              <span style={{ color: '#cbd5e1', fontSize: 14 }}>{s.label}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #334155', margin: '8px 0', paddingTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <kbd style={{
                background: '#334155', border: '1px solid #475569',
                borderRadius: 4, padding: '2px 8px', fontSize: 14,
                minWidth: 24, textAlign: 'center', color: '#e0f2fe',
              }}>?</kbd>
              <span style={{ color: '#cbd5e1', fontSize: 14 }}>Show this help</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <kbd style={{
                background: '#334155', border: '1px solid #475569',
                borderRadius: 4, padding: '2px 8px', fontSize: 14,
                minWidth: 24, textAlign: 'center', color: '#e0f2fe',
              }}>Esc</kbd>
              <span style={{ color: '#cbd5e1', fontSize: 14 }}>Close overlay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ALL_ROUTES = [
  { to: '/', label: 'Home', group: 'Home' },
  ...NAV_GROUPS.flatMap(g => g.items.map(item => ({ ...item, group: g.label }))),
];

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const match = ALL_ROUTES.find(r => r.to === pathname);
    document.title = match ? `${match.label} | ZPO Explorer` : 'ZPO Explorer';
  }, [pathname]);
  return null;
}

function CommandPalette({ show, onClose, navigate }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef();

  const results = query.trim() === ''
    ? ALL_ROUTES.slice(0, 12)
    : ALL_ROUTES.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.to.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12);

  useEffect(() => {
    if (show) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }
  }, [show]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!show) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      if (results[activeIndex]) { navigate(results[activeIndex].to); onClose(); }
    } else if (e.key === 'Escape') { onClose(); }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Page navigation"
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.75)', display: 'flex',
        justifyContent: 'center', alignItems: 'flex-start',
        paddingTop: '15vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b', border: '1px solid #334155',
          borderRadius: 12, width: '90%', maxWidth: 560,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #334155', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#64748b', flexShrink: 0 }} aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search pages"
            aria-expanded={results.length > 0}
            aria-haspopup="listbox"
            aria-controls="cmd-palette-listbox"
            aria-activedescendant={results[activeIndex] ? `cmd-palette-option-${activeIndex}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#f1f5f9', fontSize: 16, fontFamily: 'var(--font-mono)',
            }}
          />
          <kbd style={{
            background: '#334155', border: '1px solid #475569', borderRadius: 4,
            padding: '1px 6px', fontSize: 11, color: '#94a3b8', flexShrink: 0,
          }}>Esc</kbd>
        </div>
        <div
          id="cmd-palette-listbox"
          role="listbox"
          aria-label="Page results"
          style={{ maxHeight: 360, overflowY: 'auto' }}
        >
          {results.length === 0 ? (
            <div role="status" style={{ padding: '24px 16px', color: '#64748b', textAlign: 'center', fontSize: 14 }}>
              No pages match
            </div>
          ) : results.map((r, i) => (
            <div
              key={r.to}
              id={`cmd-palette-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              aria-label={`${r.label} — ${r.group} — ${r.to}`}
              onClick={() => { navigate(r.to); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', cursor: 'pointer',
                background: i === activeIndex ? '#1d3557' : 'transparent',
                borderLeft: i === activeIndex ? '2px solid #3b82f6' : '2px solid transparent',
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span style={{ color: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 80, flexShrink: 0 }}>{r.group}</span>
              <span style={{ color: i === activeIndex ? '#f1f5f9' : '#cbd5e1', fontSize: 14 }}>{r.label}</span>
              <span style={{ marginLeft: 'auto', color: '#475569', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{r.to}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #334155', display: 'flex', gap: 16, fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>
          <span>up/down navigate</span>
          <span>enter go</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

function useKeyboardShortcuts(navigate) {
  const [showHelp, setShowHelp] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Cmd+K / Ctrl+K opens command palette from anywhere
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
        setShowHelp(false);
        return;
      }
      if (e.key === 'Escape') {
        setShowHelp(false);
        setShowPalette(false);
        return;
      }
      // Don't fire when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;

      if (e.key === '?') {
        setShowHelp(prev => !prev);
        return;
      }
      const shortcut = KEYBOARD_SHORTCUTS.find(s => s.key === e.key);
      if (shortcut) {
        setShowHelp(false);
        navigate(shortcut.path);
      }
    };
    const paletteHandler = () => setShowPalette(true);
    window.addEventListener('keydown', handler);
    window.addEventListener('open-command-palette', paletteHandler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('open-command-palette', paletteHandler);
    };
  }, [navigate]);

  return { showHelp, setShowHelp, showPalette, setShowPalette };
}

function MobileNavSection({ label, items }) {
  const location = useLocation();
  const hasActive = items.some(item => location.pathname === item.to);
  const [collapsed, setCollapsed] = useState(!hasActive);
  return (
    <div className="nav-mobile-section">
      <button
        className={`nav-mobile-section-header${hasActive ? ' nav-mobile-section-active' : ''}`}
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
      >
        <span>{label}</span>
        <svg
          className={`nav-mobile-chevron${collapsed ? '' : ' nav-mobile-chevron-open'}`}
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`nav-mobile-section-items${collapsed ? '' : ' nav-mobile-section-items-open'}`}>
        <div className="nav-mobile-section-inner">
          {items.map(item => (
            // end: all nav items are non-root flat paths; prevents false-active if a nested route is ever added under the same slug
            <NavLink key={item.to} to={item.to} end>{item.label}</NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavBar({ onShowShortcuts, onShowPalette }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();
  const hamburgerRef = useRef();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Escape to close + focus trap (mobile a11y)
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = navRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="nav-bar" ref={navRef}>
      <NavLink to="/" end className="nav-logo" style={{ textDecoration: 'none' }}>
        ZPO<span className="nav-logo-text"> Explorer</span>
      </NavLink>
      <button
        onClick={onShowPalette}
        aria-label="Search pages"
        title="Search pages (Ctrl+K)"
        style={{
          background: '#1e293b', border: '1px solid #334155',
          borderRadius: 6, color: '#94a3b8', fontSize: 14,
          height: 28, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 5,
          marginLeft: 'auto', flexShrink: 0, padding: '0 8px',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>Search</span>
      </button>
      <button
        onClick={onShowShortcuts}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
        style={{
          background: '#334155', border: '1px solid #475569',
          borderRadius: 6, color: '#94a3b8', fontSize: 14,
          width: 28, height: 28, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', flexShrink: 0,
        }}
      >?</button>
      <button
        ref={hamburgerRef}
        className={`hamburger-btn ${menuOpen ? 'hamburger-open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
      >
        <span /><span /><span />
      </button>
      <nav id="mobile-nav" className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        {/* Desktop: grouped dropdowns */}
        <div className="nav-desktop-groups">
          {NAV_GROUPS.map(group => (
            <NavDropdown key={group.label} label={group.label} items={group.items} />
          ))}
        </div>
        {/* Mobile: collapsible sections */}
        <div className="nav-mobile-flat">
          {NAV_GROUPS.map(group => (
            <MobileNavSection key={group.label} label={group.label} items={group.items} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const { showHelp, setShowHelp, showPalette, setShowPalette } = useKeyboardShortcuts(navigate);

  return (
    <>
      <ScrollToTop />
      <DocumentTitle />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <NavBar onShowShortcuts={() => setShowHelp(true)} onShowPalette={() => setShowPalette(true)} />
      <KeyboardShortcutOverlay show={showHelp} onClose={() => setShowHelp(false)} />
      <CommandPalette show={showPalette} onClose={() => setShowPalette(false)} navigate={navigate} />
      <main id="main-content" className="app-content">
        <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/oscillators" element={<OscillatorsPage />} />
          <Route path="/hamiltonian" element={<HamiltonianPage />} />
          <Route path="/zeta" element={<ZetaPage />} />
          <Route path="/control" element={<ControlTheoryPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/modes" element={<ModesPage />} />
          <Route path="/explorations" element={<ExplorationsPage />} />
          <Route path="/literature" element={<LiteraturePage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/fourier" element={<FourierPage />} />
          <Route path="/supercritical" element={<SupercriticalPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/waves" element={<WaveSimPage />} />
          <Route path="/rigor" element={<RHRigorPage />} />
          <Route path="/improvements" element={<ImprovementsPage />} />
          <Route path="/twistor" element={<TwistorPage />} />
          <Route path="/paper" element={<PaperPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/pascal" element={<PascalPage />} />
          <Route path="/zx-calculus" element={<ZXCalculusPage />} />
          <Route path="/rh-attack" element={<RHAttackPage />} />
          <Route path="/info-theory" element={<InformationTheoryPage />} />
          <Route path="/formal-proof" element={<FormalProofPage />} />
          <Route path="/odd-zeta" element={<OddZetaPage />} />
          <Route path="/gap-closing" element={<GapClosingPage />} />
          <Route path="/spectral-attack" element={<SpectralAttackPage />} />
          <Route path="/theta-seizing-margin" element={<ThetaSeizingMarginPage />} />
          <Route path="/theta-static-obstruction" element={<ThetaStaticObstructionPage />} />
          <Route path="/theta-basin-closure" element={<ThetaBasinClosurePage />} />
          <Route path="/theorem-b-threshold" element={<TheoremBThresholdPage />} />
          <Route path="/onset-bracket-ledger" element={<OnsetBracketLedgerPage />} />
          <Route path="/open-frontier" element={<OpenFrontierPage />} />
          <Route path="/section26-conditioning-artifact" element={<Section26ConditioningArtifactPage />} />
          <Route path="/excess-fraction-phi" element={<ExcessFractionPhiPage />} />
          <Route path="/c-shock-numerical-coincidence" element={<CShockNumericalCoincidencePage />} />
          <Route path="/viz-imp3256-vhs-crossval" element={<Imp3256CrossvalPage />} />
          <Route path="/viz-imp3252-scaled-mu" element={<Imp3252ScaledMuPage />} />
          <Route path="/viz-imp3467-closed-form-c" element={<Imp3467ClosedFormCViz />} />
          <Route path="/viz-imp3540-power-iteration-budget" element={<Imp3540PowerIterationBudgetViz />} />
          <Route path="/viz-imp3541-cosh-cancellation-margin" element={<Imp3541CoshCancellationMarginViz />} />
          <Route path="/viz-imp3542-degree-d-miss-factor" element={<Imp3542DegreeDMissFactorViz />} />
          <Route path="/viz-imp3543-xistar-robustness" element={<Imp3543XiStarRobustnessViz />} />
          <Route path="/viz-imp3563-quadrature-straddle" element={<Imp3563QuadratureStraddleViz />} />
          <Route path="/viz-imp3564-power-iteration-closed-form" element={<Imp3564PowerIterationClosedFormViz />} />
          <Route path="/viz-imp3565-sigma-postpeak-decay-exponent" element={<Imp3565SigmaPostpeakDecayExponentViz />} />
          <Route path="/viz-imp3566-cosh-sinh-margin-contrast" element={<Imp3566CoshSinhMarginContrastViz />} />
          <Route path="/viz-imp3586-sigma-crossing-logistic-drop" element={<Imp3586SigmaCrossingLogisticDropViz />} />
          <Route path="/viz-imp3567-closed-error-certificate" element={<Imp3567ClosedErrorCertificateViz />} />
          <Route path="/viz-imp3589-cosh-overestimation-factor" element={<Imp3589CoshOverestimationFactorViz />} />
          <Route path="/viz-imp3611-skew-toeplitz-krylov-gap-ladder" element={<Imp3611SkewToeplitzKrylovGapLadderViz />} />
          <Route path="/viz-imp3612-fit-bias-depth-sweep" element={<Imp3612FitBiasDepthSweepViz />} />
          <Route path="/viz-imp3613-replica-fold-in-geometry" element={<Imp3613ReplicaFoldInGeometryViz />} />
          <Route path="/viz-imp3614-sigma-crossover-floor-invariance" element={<Imp3614SigmaCrossoverFloorInvarianceViz />} />
          <Route path="/viz-imp3655-flow-gap-residual-ladder" element={<Imp3655FlowGapResidualLadderViz />} />
          <Route path="/viz-imp3656-triple-skew-toeplitz-gap-ladder" element={<Imp3656TripleSkewToeplitzGapLadderViz />} />
          <Route path="/viz-imp3657-sigma-crossover-tc-closedform-pin" element={<Imp3657SigmaCrossoverTcClosedformPinViz />} />
          <Route path="/viz-imp3658-planted-replica-argmax-drift" element={<Imp3658PlantedReplicaArgmaxDriftViz />} />
          <Route path="/viz-imp3695-feature-foldin-floor-ladder" element={<Imp3695FeatureFoldinFloorLadderViz />} />
          <Route path="/viz-imp3696-matched-pair-krylov-depth-sweep" element={<Imp3696MatchedPairKrylovDepthSweepViz />} />
          <Route path="/viz-imp3697-a-weight-decay-crosscheck" element={<Imp3697AWeightDecayCrosscheckViz />} />
          <Route path="/viz-imp3698-fifth-pair-adjacent-pairing" element={<Imp3698FifthPairAdjacentPairingViz />} />
          <Route path="/proof-checker" element={<ProofCheckerPage />} />
          <Route path="/reasoning" element={<HistoricalReasoningPage />} />
          <Route path="/papers" element={<PapersListPage />} />
          <Route path="/paper-upload" element={<PaperUploadPage />} />
          <Route path="/twin-ladder" element={<TwinLadderPage />} />
          <Route path="/mills-theorem" element={<MillsTheoremPage />} />
          <Route path="/gilbreath" element={<GilbreathObservationPage />} />
          <Route path="/calabi-yau" element={<CalabiYauPage />} />
          <Route path="/cross-attack" element={<CrossAttackPage />} />
          <Route path="/proof-planner" element={<ProofPlannerPage />} />
          <Route path="/improvement-queue" element={<ImprovementQueuePage />} />
          <Route path="/proof-overview" element={<ProofOverviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/proof-explorer" element={<ProofExplorerPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/wiki" element={<WikiPage />} />
          <Route path="/index" element={<ProjectIndexPage />} />
          <Route path="/break-it" element={<BreakItPage />} />
          <Route path="/research-journal" element={<ResearchJournalPage />} />
          <Route path="/meta-acceleration" element={<MetaAccelerationPage />} />
          <Route path="/lambda-bounds" element={<LambdaBoundsPage />} />
          <Route path="/lambda-timeline" element={<LambdaTimelinePage />} />
          <Route path="/rh-dag" element={<RhDagPage />} />
          <Route path="/rigor-dashboard" element={<RigorDashboardPage />} />
          <Route path="/rh-proof-state" element={<RHProofStateDashboardPage />} />
          <Route path="/what-we-know" element={<WhatWeKnowPage />} />
          <Route path="/route-map" element={<RouteMapPage />} />
          <Route path="/state-of-program" element={<StateOfProgramPage />} />
          <Route path="/engine-room" element={<EngineRoomPage />} />
          <Route path="/vortex-field" element={<VortexFieldPage />} />
          <Route path="/viz-winding-dyson-flow" element={<VizWindingDysonFlowPage />} />
          <Route path="/viz-near-zero" element={<VizNearZeroPage />} />
          <Route path="/visual-geometries" element={<VisualGeometriesPage />} />
          <Route path="/prime-rigidity" element={<PrimeRigidityPage />} />
          <Route path="/viz-euler-product" element={<VizEulerProductPage />} />
          <Route path="/dyson-verifier" element={<DysonVerifierPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/full-story" element={<FullStoryPage />} />
          <Route path="/papers-download" element={<PapersDownloadPage />} />
          <Route path="/gram-points" element={<GramPointsPage />} />
          <Route path="/selberg-trace" element={<SelbergTracePage />} />
          <Route path="/rh-equivalents" element={<RHEquivalentsPage />} />
          <Route path="/three-attacks" element={<ThreeAttacksPage />} />
          <Route path="/blaschke-ghosts" element={<BlaschkeGhostsPage />} />
          <Route path="/closure-routes" element={<ClosureRoutesPage />} />
          <Route path="/kyp-bounded-real" element={<KypBoundedRealPage />} />
          <Route path="/shift-bridge-positivity" element={<ShiftBridgePositivityPage />} />
          <Route path="/freezing-bridge" element={<FreezingBridgePage />} />
          <Route path="/rigorous-numerics-stages" element={<RigorousNumericsStagesPage />} />
          <Route path="/twin-ladder-paper-roadmap" element={<TwinLadderPaperRoadmapPage />} />
          <Route path="/paper-audit-dashboard" element={<PaperAuditDashboardPage />} />
          <Route path="/pcc-route-exhaustion" element={<PCCRouteExhaustionPage />} />
          <Route path="/ht-corridor-certificates" element={<HtCorridorCertificatesPage />} />
          <Route path="/ht-window-census" element={<HtFiniteWindowPage />} />
          <Route path="/viz-hyperbolic-prime-spiral" element={<VizHyperbolicPrimeSpiralPage />} />
          <Route path="/hidden-square-program" element={<HiddenSquareProgramPage />} />
          <Route path="/reciprocal-program" element={<ReciprocalProgramPage />} />
          <Route path="/viz-log-phase-spiral" element={<VizLogPhaseSpiralPage />} />
          <Route path="/viz-euler-transport-flow" element={<VizEulerTransportFlowPage />} />
          <Route path="/hardy-z" element={<HardyZPage />} />
          <Route path="/viz-volterra-kernel-heatmap" element={<VolterraKernelHeatmapPage />} />
          <Route path="/viz-volterra-norm-curve" element={<VolterraNormCurvePage />} />
          <Route path="/volterra-bound" element={<VolterraBoundPage />} />
          <Route path="/schatten-trace-norm" element={<SchattenTraceNormPage />} />
          <Route path="/collapse-chain" element={<CollapseChainPage />} />
          <Route path="/cayley-schur-trajectory" element={<CayleySchurTrajectoryPage />} />
          <Route path="/viz-twin-ladder-tomography" element={<VizTwinLadderTomographyPage />} />
          <Route path="/viz-prime-caustic" element={<VizPrimeCausticPage />} />
          <Route path="/viz-prime-density-caustic" element={<VizPrimeDensityOnCausticPage />} />
          <Route path="/viz-caustic-resonance" element={<VizCausticResonancePage />} />
          <Route path="/viz-phase-cylinder" element={<VizPhaseCylinderPage />} />
          <Route path="/viz-unwrapped-rays" element={<VizUnwrappedRaysPage />} />
          <Route path="/zoom-hierarchy" element={<VizZoomHierarchyPage />} />
          <Route path="/angular-spacing-stats" element={<AngularSpacingStatsPage />} />
          <Route path="/viz-prime-phase-crystal" element={<VizPrimePhaseCrystalPage />} />
          <Route path="/visualizations" element={<VisualizationsIndexPage />} />
          <Route path="/berry-keating-xp" element={<BerryKeatingXpPage />} />
          <Route path="/connes-adelic" element={<ConnesAdelicPage />} />
          <Route path="/edge-rigidity" element={<EdgeRigidityPage />} />
          <Route path="/esy-rigidity-empirical" element={<EsyRigidityEmpiricalPage />} />
          <Route path="/gue-comparison" element={<GueComparisonPage />} />
          <Route path="/lmfdb-cross-reference" element={<LmfdbCrossReferencePage />} />
          <Route path="/pair-correlation" element={<PairCorrelationPage />} />
          <Route path="/riemann-siegel-z" element={<RiemannSiegelZPage />} />
          <Route path="/voronin-universality" element={<VoroninUniversalityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        </RouteErrorBoundary>
      </main>
      <footer style={{
        padding: '24px 16px',
        color: '#475569',
        fontSize: 13,
        borderTop: '1px solid #1e293b',
        marginTop: 48,
        fontFamily: 'var(--font-mono)',
      }}>
        <div style={{ textAlign: 'center' }}>
          Found a bug? Copy the error card text and{' '}
          <a
            href="https://github.com/judegomila/mathexplorer/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#475569', textDecoration: 'underline' }}
          >
            paste it in a new issue
          </a>
          {' '}&mdash; &copy; Jude Gomila 2026-onwards
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <MathModalProvider>
    <HashRouter>
      <AppShell />
    </HashRouter>
    </MathModalProvider>
  );
}
