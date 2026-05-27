import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MathModalProvider } from './components/KaTeXMath.jsx';
import HomePage from './pages/HomePage.jsx';
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
const TwinLadderPaperRoadmapPage = lazy(() => import('./pages/TwinLadderPaperRoadmapPage.jsx'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', color: '#64748b' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>Loading...</div>
      </div>
    </div>
  );
}

const NAV_GROUPS = [
  {
    label: 'Model',
    items: [
      { to: '/full-story', label: 'Improving Bounds on Λ' },
      { to: '/oscillators', label: 'Oscillators' },
      { to: '/hamiltonian', label: 'Hamiltonian' },
      { to: '/zeta', label: 'Zeta' },
      { to: '/waves', label: 'Waves' },
      { to: '/modes', label: 'Modes' },
      { to: '/simulator', label: 'Simulator' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { to: '/fourier', label: 'Fourier' },
      { to: '/control', label: 'Control' },
      { to: '/statistics', label: 'Statistics' },
      { to: '/supercritical', label: 'Supercritical' },
      { to: '/info-theory', label: 'Info Theory' },
      { to: '/pascal', label: 'Pascal' },
      { to: '/odd-zeta', label: 'Odd Zeta' },
      { to: '/twin-ladder', label: 'Twin Ladder' },
      { to: '/calabi-yau', label: 'Calabi-Yau' },
      { to: '/gram-points', label: 'Gram Points' },
    ],
  },
  {
    label: 'Twin-Ladder v52',
    items: [
      { to: '/shift-bridge-positivity', label: 'Shift-Bridge (§15)' },
      { to: '/closure-routes', label: 'Four Closure Routes (§16)' },
      { to: '/blaschke-ghosts', label: 'Blaschke Ghosts (§17)' },
      { to: '/three-attacks', label: 'Three Attacks (§18)' },
      { to: '/freezing-bridge', label: 'Freezing Bridge (§23)' },
      { to: '/kyp-bounded-real', label: 'KYP / Bounded-Real' },
      { to: '/twin-ladder-paper-roadmap', label: 'Paper Roadmap' },
    ],
  },
  {
    label: 'Attack',
    items: [
      { to: '/lambda-bounds', label: 'Λ Bounds & RH Roadmap' },
      { to: '/lambda-timeline', label: 'Λ Timeline' },
      { to: '/rh-dag', label: 'RH Dependency DAG' },
      { to: '/rh-attack', label: 'RH Attack' },
      { to: '/spectral-attack', label: 'Spectral' },
      { to: '/gap-closing', label: 'Gap Closing' },
      { to: '/twistor', label: 'Twistor' },
      { to: '/zx-calculus', label: 'ZX-Calculus' },
      { to: '/formal-proof', label: 'Formal Proof' },
      { to: '/proof-checker', label: 'Proof Checker' },
      { to: '/reasoning', label: 'Reasoning' },
      { to: '/rigor', label: 'Rigor' },
      { to: '/rigor-dashboard', label: 'Rigor Dashboard' },
      { to: '/dyson-verifier', label: 'Dyson Verifier' },
      { to: '/cross-attack', label: 'Cross-Attack' },
      { to: '/proof-planner', label: 'Proof Planner' },
      { to: '/proof-overview', label: 'Proof Overview' },
      { to: '/proof-explorer', label: 'Proof Explorer' },
      { to: '/break-it', label: 'Break It' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { to: '/meta-acceleration', label: 'Meta Acceleration' },
      { to: '/research-journal', label: 'Research Journal' },
      { to: '/improvement-queue', label: 'Improvement Queue' },
      { to: '/improvements', label: 'Improvements Log' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/health', label: 'Health Check' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { to: '/concepts', label: 'Concepts' },
      { to: '/history', label: 'History' },
      { to: '/explorations', label: 'Explorations' },
      { to: '/literature', label: 'Literature' },
      { to: '/paper', label: 'Paper' },
      { to: '/papers', label: 'Papers' },
      { to: '/paper-upload', label: 'Upload' },
      { to: '/blog', label: 'Blog' },
      { to: '/wiki', label: 'Wiki' },
      { to: '/index', label: 'Index' },
      { to: '/docs', label: 'Docs' },
      { to: '/selberg-trace', label: 'Selberg Trace' },
      { to: '/rh-equivalents', label: 'RH Equivalents' },
    ],
  },
];

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
    <div ref={dropdownRef} className={`nav-dropdown ${hasActive ? 'nav-dropdown-active' : ''} ${isOpen ? 'nav-dropdown-open' : ''}`}>
      <button className="nav-dropdown-trigger" onClick={() => setIsOpen(o => !o)} aria-expanded={isOpen}>
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ marginLeft: 4 }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      <div className="nav-dropdown-menu">
        {items.map(item => (
          <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
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
  { key: '2', label: 'Oscillators', path: '/oscillators' },
  { key: '3', label: 'Zeta', path: '/zeta' },
  { key: '4', label: 'RH Attack', path: '/rh-attack' },
  { key: '5', label: 'Gap Closing', path: '/gap-closing' },
  { key: '6', label: 'Statistics', path: '/statistics' },
  { key: '7', label: 'Spectral Attack', path: '/spectral-attack' },
  { key: '8', label: 'Cross-Attack', path: '/cross-attack' },
  { key: '9', label: 'Proof Planner', path: '/proof-planner' },
];

function KeyboardShortcutOverlay({ show, onClose }) {
  if (!show) return null;
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
        style={{
          background: '#1e293b', border: '1px solid #334155',
          borderRadius: 12, padding: '28px 36px', maxWidth: 420, width: '90%',
          color: '#e2e8f0', fontFamily: 'var(--font-mono)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: '#f8fafc' }}>Keyboard Shortcuts</h3>
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

function useKeyboardShortcuts(navigate) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Don't fire when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;

      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }
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
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return { showHelp, setShowHelp };
}

function NavBar({ onShowShortcuts }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();
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

  return (
    <div className="nav-bar" ref={navRef}>
      <NavLink to="/" end className="nav-logo" style={{ textDecoration: 'none' }}>
        ZPO<span className="nav-logo-text"> Explorer</span>
      </NavLink>
      <button
        onClick={onShowShortcuts}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
        style={{
          background: '#334155', border: '1px solid #475569',
          borderRadius: 6, color: '#94a3b8', fontSize: 14,
          width: 28, height: 28, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', marginLeft: 'auto',
          flexShrink: 0,
        }}
      >?</button>
      <button
        className={`hamburger-btn ${menuOpen ? 'hamburger-open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>
      <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        {/* Desktop: grouped dropdowns */}
        <div className="nav-desktop-groups">
          {NAV_GROUPS.map(group => (
            <NavDropdown key={group.label} label={group.label} items={group.items} />
          ))}
        </div>
        {/* Mobile: flat list with section headers */}
        <div className="nav-mobile-flat">
          {NAV_GROUPS.map(group => (
            <React.Fragment key={group.label}>
              <div className="nav-mobile-header">{group.label}</div>
              {group.items.map(item => (
                <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
              ))}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </div>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const { showHelp, setShowHelp } = useKeyboardShortcuts(navigate);

  return (
    <>
      <ScrollToTop />
      <NavBar onShowShortcuts={() => setShowHelp(true)} />
      <KeyboardShortcutOverlay show={showHelp} onClose={() => setShowHelp(false)} />
      <div className="app-content">
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
          <Route path="/proof-checker" element={<ProofCheckerPage />} />
          <Route path="/reasoning" element={<HistoricalReasoningPage />} />
          <Route path="/papers" element={<PapersListPage />} />
          <Route path="/paper-upload" element={<PaperUploadPage />} />
          <Route path="/twin-ladder" element={<TwinLadderPage />} />
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
          <Route path="/dyson-verifier" element={<DysonVerifierPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/full-story" element={<FullStoryPage />} />
          <Route path="/papers" element={<PapersDownloadPage />} />
          <Route path="/gram-points" element={<GramPointsPage />} />
          <Route path="/selberg-trace" element={<SelbergTracePage />} />
          <Route path="/rh-equivalents" element={<RHEquivalentsPage />} />
          <Route path="/three-attacks" element={<ThreeAttacksPage />} />
          <Route path="/blaschke-ghosts" element={<BlaschkeGhostsPage />} />
          <Route path="/closure-routes" element={<ClosureRoutesPage />} />
          <Route path="/kyp-bounded-real" element={<KypBoundedRealPage />} />
          <Route path="/shift-bridge-positivity" element={<ShiftBridgePositivityPage />} />
          <Route path="/freezing-bridge" element={<FreezingBridgePage />} />
          <Route path="/twin-ladder-paper-roadmap" element={<TwinLadderPaperRoadmapPage />} />
        </Routes>
        </Suspense>
      </div>
      <footer style={{
        textAlign: 'center',
        padding: '24px 16px',
        color: '#475569',
        fontSize: 13,
        borderTop: '1px solid #1e293b',
        marginTop: 48,
        fontFamily: 'var(--font-mono)',
      }}>
        &copy; Jude Gomila 2026-onwards
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
