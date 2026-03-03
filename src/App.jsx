import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { MathModalProvider } from './components/KaTeXMath.jsx';
import HomePage from './pages/HomePage.jsx';
import OscillatorsPage from './pages/OscillatorsPage.jsx';
import HamiltonianPage from './pages/HamiltonianPage.jsx';
import ZetaPage from './pages/ZetaPage.jsx';
import ControlTheoryPage from './pages/ControlTheoryPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';
import ModesPage from './pages/ModesPage.jsx';
import ExplorationsPage from './pages/ExplorationsPage.jsx';
import LiteraturePage from './pages/LiteraturePage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import FourierPage from './pages/FourierPage.jsx';
import SupercriticalPage from './pages/SupercriticalPage.jsx';
import DocsPage from './pages/DocsPage.jsx';
import ImprovementsPage from './pages/ImprovementsPage.jsx';
import WaveSimPage from './pages/WaveSimPage.jsx';
import RHRigorPage from './pages/RHRigorPage.jsx';
import './styles/app.css';

const NAV_GROUPS = [
  {
    label: 'Model',
    items: [
      { to: '/oscillators', label: 'Oscillators' },
      { to: '/hamiltonian', label: 'Hamiltonian' },
      { to: '/modes', label: 'Modes' },
      { to: '/waves', label: 'Waves' },
      { to: '/simulator', label: 'Simulator' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { to: '/zeta', label: 'Zeta' },
      { to: '/fourier', label: 'Fourier' },
      { to: '/control', label: 'Control' },
      { to: '/statistics', label: 'Statistics' },
      { to: '/supercritical', label: 'Supercritical' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { to: '/explorations', label: 'Explorations' },
      { to: '/literature', label: 'Literature' },
      { to: '/rigor', label: 'Rigor' },
      { to: '/docs', label: 'Docs' },
      { to: '/improvements', label: 'Improvements' },
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
      <div className="nav-logo">
        ZPO<span className="nav-logo-text"> Explorer</span>
      </div>
      <button
        className={`hamburger-btn ${menuOpen ? 'hamburger-open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>
      <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        <NavLink to="/" end>Home</NavLink>
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
        </Routes>
      </div>
    </HashRouter>
    </MathModalProvider>
  );
}
