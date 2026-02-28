import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from '../components/KaTeXMath.jsx';
import { getAllExplorations } from '../data/explorations.js';
import { getAllReferences } from '../data/literature.js';
import { ZETA_ZEROS } from '../math/zeta.js';

export default function HomePage() {
  const explorations = getAllExplorations();
  const references = getAllReferences();

  return (
    <div className="page">
      <div className="hero">
        <h1>Zeta Prime Oscillator Explorer</h1>
        <p>
          A deep investigation into the Riemann zeta function through the lens of
          prime oscillator chains, ladder networks, and Hamiltonian minimization.
          Exploring the bridge between number theory, circuit theory, and control systems.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#3b82f6' }}>{ZETA_ZEROS.length}</div>
          <div className="stat-label">Known Zeros</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#10b981' }}>{explorations.length}</div>
          <div className="stat-label">Explorations</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#8b5cf6' }}>{references.length}</div>
          <div className="stat-label">References</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#f59e0b' }}>9</div>
          <div className="stat-label">Pages</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#ec4899' }}>14</div>
          <div className="stat-label">Visualizations</div>
        </div>
      </div>

      <div style={{ margin: '40px 0' }}>
        <BlockMath tex="\\zeta(s) = \\underbrace{\\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}}_{\\text{Cascade of prime oscillators}} = \\underbrace{\\chi(s)}_{\\text{Lossless bridge}} \\cdot \\underbrace{\\zeta(1-s)}_{\\text{Dual ladder}}" />
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>The Core Idea</h2>
      <div className="card-grid">
        <Link to="/oscillators" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#3b82f6' }}>Prime Oscillator Chain</h3>
            <p>Each prime p generates a resonator with frequency log(p). The Euler product becomes
               a cascade of LC oscillator stages forming a ladder network.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-blue">Interactive</span>
              <span className="tag tag-cyan">D3 Visualization</span>
            </div>
          </div>
        </Link>
        <Link to="/oscillators" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#f59e0b' }}>Direct & Dual Ladders</h3>
            <p>Two ladder networks — one computing ζ(s) and one computing ζ(1-s) — connected
               by a lossless bridge that encodes the functional equation.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-orange">Duality</span>
              <span className="tag tag-purple">Bridge</span>
            </div>
          </div>
        </Link>
        <Link to="/hamiltonian" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#10b981' }}>Hamiltonian Minimization</h3>
            <p>The total system energy — kinetic + mismatch + bridge coupling — achieves
               its minimum at σ = 1/2, the critical line. This is the Hilbert-Pólya dream.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-green">Energy</span>
              <span className="tag tag-red">Critical Line</span>
            </div>
          </div>
        </Link>
        <Link to="/zeta" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#8b5cf6' }}>Zeta Landscape</h3>
            <p>Visualize the zeta function across the critical strip, see the Riemann-Siegel Z function,
               and explore the heatmap of |ζ(s)|.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-purple">Heatmap</span>
              <span className="tag tag-blue">Critical Line</span>
            </div>
          </div>
        </Link>
        <Link to="/control" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#ef4444' }}>Control Theory</h3>
            <p>Nyquist plots, Bode diagrams, scattering matrices. RH as a stability criterion.
               H-infinity optimal control at σ = 1/2.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-red">Nyquist</span>
              <span className="tag tag-orange">Bode</span>
            </div>
          </div>
        </Link>
        <Link to="/statistics" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#8b5cf6' }}>Zero Statistics</h3>
            <p>GUE spacing distributions, pair correlations, Li criterion, and de Bruijn-Newman
               heat flow. Random matrix theory meets the oscillator chain.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-purple">GUE</span>
              <span className="tag tag-green">Li Criterion</span>
            </div>
          </div>
        </Link>
        <Link to="/modes" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#06b6d4' }}>Oscillator Modes</h3>
            <p>Animated mode evolution at zeta zero frequencies, prime gap coupling structure,
               2D energy landscape, and the exploration dependency graph.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-cyan">Animated</span>
              <span className="tag tag-blue">Interactive</span>
            </div>
          </div>
        </Link>
        <Link to="/explorations" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#ec4899' }}>AI Exploration Journal</h3>
            <p>Browse {explorations.length} continuously-generated AI investigations — deep mathematical
               explorations with LaTeX rendering, insights, and cross-references.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-pink">AI Research</span>
              <span className="tag tag-cyan">LaTeX</span>
            </div>
          </div>
        </Link>
        <Link to="/literature" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#06b6d4' }}>Literature Database</h3>
            <p>Comprehensive reference database connecting circuit theory, control theory,
               random matrix theory, and the zeta function. {references.length}+ annotated references.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-cyan">References</span>
              <span className="tag tag-green">Annotated</span>
            </div>
          </div>
        </Link>
      </div>

      <div style={{ margin: '48px 0 20px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Key Mathematical Correspondences</h2>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Number Theory</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Circuit / Control Theory</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Our Model</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Euler product ∏(1-p⁻ˢ)⁻¹', 'Cascade of two-port networks', 'Ladder of prime oscillators'],
                ['Functional equation ξ(s)=ξ(1-s)', 'Lossless scattering matrix S†S=I', 'Bridge connecting ladders'],
                ['Critical line σ=1/2', 'Perfect impedance match', 'Hamiltonian minimum'],
                ['Nontrivial zeros', 'Transmission zeros', 'System resonances'],
                ['Explicit formula', 'Impulse response decomposition', 'Sum of damped sinusoids'],
                ['Prime Number Theorem', 'Bode sensitivity integral', 'Low-frequency gain constraint'],
                ['GUE statistics of zeros', 'Random scattering matrix', 'CUE bridge ensemble'],
                ['de Bruijn-Newman Λ≥0', 'Zero/negative resistance', 'Exactly lossless system'],
              ].map(([nt, ct, model], i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(42,48,80,0.5)' }}>
                  <td style={{ padding: '10px 14px', color: '#3b82f6', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{nt}</td>
                  <td style={{ padding: '10px 14px', color: '#f59e0b', fontSize: 13 }}>{ct}</td>
                  <td style={{ padding: '10px 14px', color: '#10b981', fontSize: 13 }}>{model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
