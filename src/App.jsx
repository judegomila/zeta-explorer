import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import OscillatorsPage from './pages/OscillatorsPage.jsx';
import HamiltonianPage from './pages/HamiltonianPage.jsx';
import ZetaPage from './pages/ZetaPage.jsx';
import ControlTheoryPage from './pages/ControlTheoryPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';
import ModesPage from './pages/ModesPage.jsx';
import ExplorationsPage from './pages/ExplorationsPage.jsx';
import LiteraturePage from './pages/LiteraturePage.jsx';
import './styles/app.css';

export default function App() {
  return (
    <HashRouter>
      <div className="nav-bar">
        <div className="nav-logo">
          ZPO<span> Explorer</span>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/oscillators">Oscillators</NavLink>
          <NavLink to="/hamiltonian">Hamiltonian</NavLink>
          <NavLink to="/zeta">Zeta</NavLink>
          <NavLink to="/control">Control</NavLink>
          <NavLink to="/statistics">Statistics</NavLink>
          <NavLink to="/modes">Modes</NavLink>
          <NavLink to="/explorations">Explorations</NavLink>
          <NavLink to="/literature">Literature</NavLink>
        </nav>
      </div>
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
        </Routes>
      </div>
    </HashRouter>
  );
}
