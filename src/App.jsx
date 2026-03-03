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
        <NavLink to="/oscillators">Oscillators</NavLink>
        <NavLink to="/hamiltonian">Hamiltonian</NavLink>
        <NavLink to="/zeta">Zeta</NavLink>
        <NavLink to="/control">Control</NavLink>
        <NavLink to="/statistics">Statistics</NavLink>
        <NavLink to="/modes">Modes</NavLink>
        <NavLink to="/explorations">Explorations</NavLink>
        <NavLink to="/literature">Literature</NavLink>
        <NavLink to="/simulator">Simulator</NavLink>
        <NavLink to="/fourier">Fourier</NavLink>
        <NavLink to="/supercritical">Supercritical</NavLink>
        <NavLink to="/docs">Docs</NavLink>
        <NavLink to="/waves">Waves</NavLink>
        <NavLink to="/rigor">Rigor</NavLink>
        <NavLink to="/improvements">Improvements</NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <MathModalProvider>
    <HashRouter>
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
