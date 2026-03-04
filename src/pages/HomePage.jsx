import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
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
          <div className="stat-value" style={{ color: '#f59e0b' }}>17</div>
          <div className="stat-label">Pages</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#ec4899' }}>19</div>
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
            <p>Each prime <InlineMath tex="p" /> generates an LC resonator with characteristic impedance <InlineMath tex="Z_0 = \\log(p)" />. The Euler product becomes
               a cascade of oscillator stages forming a ladder network.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-blue">Interactive</span>
              <span className="tag tag-cyan">D3 Visualization</span>
            </div>
          </div>
        </Link>
        <Link to="/oscillators" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#f59e0b' }}>Direct & Dual Ladders</h3>
            <p>Two ladder networks — one computing <InlineMath tex="\\zeta(s)" /> and one computing <InlineMath tex="\\zeta(1-s)" /> — connected
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
               its minimum at <InlineMath tex="\\sigma = 1/2" />, the critical line. This is the Hilbert-Pólya dream.</p>
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
               and explore the heatmap of <InlineMath tex="|\\zeta(s)|" />.</p>
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
               H-infinity optimal control at <InlineMath tex="\\sigma = 1/2" />.</p>
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
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Suggested Learning Path</h2>
        <div className="card" style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            New to the ZPO model? Follow this progression — each page builds on concepts from the previous ones.
          </p>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { num: 1, route: '/oscillators', label: 'Prime Oscillator Chain', desc: 'Start here — learn how each prime becomes an LC resonator and the Euler product becomes a ladder network.' },
              { num: 2, route: '/hamiltonian', label: 'Hamiltonian & Explicit Formula', desc: 'See why the total system energy is minimized at σ = ½, and how zeta zeros decompose the prime staircase.' },
              { num: 3, route: '/zeta', label: 'Zeta Landscape', desc: 'Explore the raw zeta function — the Z(t) zero detector, the 2D heatmap, and the zero table.' },
              { num: 4, route: '/fourier', label: 'Fourier Domain', desc: 'View the frequency response of the ladder, the von Mangoldt spectrum, and prime harmonic decomposition.' },
              { num: 5, route: '/control', label: 'Control Theory', desc: 'Reframe RH as a Nyquist stability criterion — zeros as instability points of a feedback loop.' },
              { num: 6, route: '/statistics', label: 'Zero Statistics', desc: 'Compare zero spacing to GUE random matrix predictions and explore the Li criterion and de Bruijn-Newman heat flow.' },
              { num: 7, route: '/simulator', label: 'Twin Oscillator Simulator', desc: 'Run interactive tests — gradient descent, convergence analysis, bridge unitarity, multi-zero verification.' },
              { num: 8, route: '/modes', label: 'Modes & Structure', desc: 'Watch oscillator modes animate at zero frequencies, inspect prime gap coupling, and explore the 2D energy landscape.' },
              { num: 9, route: '/supercritical', label: 'Supercritical Analysis', desc: 'Thermodynamics of ζ as a partition function, heat flow evolution, and the extended landscape beyond the critical strip.' },
              { num: 10, route: '/waves', label: 'Wave Simulator', desc: 'Visualize energy flow through the ladder — signal reflection, wave interference, group delay, and circuit diagrams.' },
            ].map(({ num, route, label, desc }) => (
              <Link key={route} to={route} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '8px 12px',
                  borderRadius: 8,
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(59,130,246,0.15)',
                    color: '#3b82f6',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                  }}>{num}</span>
                  <div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{label}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13, marginLeft: 8 }}>{desc}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
                [<>Euler product <InlineMath tex="\prod(1-p^{-s})^{-1}" /></>, 'Cascade of two-port networks', 'Ladder of prime oscillators'],
                [<>Functional equation <InlineMath tex="\xi(s)=\xi(1-s)" /></>, <>Lossless scattering matrix <InlineMath tex="S^\dagger S=I" /></>, 'Bridge connecting ladders'],
                [<>Critical line <InlineMath tex="\sigma=1/2" /></>, 'Conjugate impedance match', 'Hamiltonian minimum'],
                ['Nontrivial zeros', 'Transmission zeros', 'System resonances'],
                ['Explicit formula', 'Impulse response decomposition', 'Sum of damped sinusoids'],
                ['Prime Number Theorem', 'Bode sensitivity integral', 'Low-frequency gain constraint'],
                ['GUE statistics of zeros', 'Random scattering matrix', 'CUE bridge ensemble'],
                [<>de Bruijn-Newman <InlineMath tex="\Lambda \geq 0" /></>, 'Zero/negative resistance', 'At lossless threshold'],
                [<><InlineMath tex="\sigma" /> as inverse temperature <InlineMath tex="\beta" /></>, <>Bose-Einstein partition function</>, <>Primon gas; Bost-Connes transition at <InlineMath tex="\sigma=1" /></>],
                [<>Li coefficients <InlineMath tex="\lambda_n \geq 0" /></>, 'Passivity (contractive S-matrix)', 'Schur-Cohn stability test'],
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
