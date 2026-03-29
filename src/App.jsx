import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { MathModalProvider } from './components/KaTeXMath.jsx';
import HomePage from './pages/HomePage.jsx';
import './styles/app.css';

// Lazy-load all pages except HomePage for code-splitting
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
    ],
  },
  {
    label: 'Attack',
    items: [
      { to: '/rh-attack', label: 'RH Attack' },
      { to: '/spectral-attack', label: 'Spectral' },
      { to: '/gap-closing', label: 'Gap Closing' },
      { to: '/twistor', label: 'Twistor' },
      { to: '/zx-calculus', label: 'ZX-Calculus' },
      { to: '/formal-proof', label: 'Formal Proof' },
      { to: '/proof-checker', label: 'Proof Checker' },
      { to: '/reasoning', label: 'Reasoning' },
      { to: '/rigor', label: 'Rigor' },
      { to: '/cross-attack', label: 'Cross-Attack' },
      { to: '/proof-planner', label: 'Proof Planner' },
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
      { to: '/docs', label: 'Docs' },
      { to: '/improvements', label: 'Improvements' },
      { to: '/improvement-queue', label: 'Queue' },
    ],
  },
];

function NavDropdown({ label, items }) {
  const location = useLocation();
  const hasActive = items.some(item => location.pathname === item.to);

  return (
    <div className={`nav-dropdown ${hasActive ? 'nav-dropdown-active' : ''}`}>
      <button className="nav-dropdown-trigger">
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

function NavBar() {
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

export default function App() {
  return (
    <MathModalProvider>
    <HashRouter>
      <ScrollToTop />
      <NavBar />
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
    </HashRouter>
    </MathModalProvider>
  );
}
