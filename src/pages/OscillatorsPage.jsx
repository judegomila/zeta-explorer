import React from 'react';
import OscillatorChainViz from '../components/OscillatorChainViz.jsx';
import EulerProductViz from '../components/EulerProductViz.jsx';
import { BlockMath } from '../components/KaTeXMath.jsx';

export default function OscillatorsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Prime Oscillator Chain</h1>
        <p>
          The Euler product decomposes the zeta function into a cascade of oscillator stages,
          one per prime. Two ladders — direct and dual — are connected via a lossless bridge
          that encodes the functional equation.
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <BlockMath tex="\\zeta(s) = \\prod_{p} \\underbrace{\\frac{1}{1 - p^{-s}}}_{H_p(s)} \\quad \\text{where each } H_p \\text{ is an LC oscillator with } \\omega_p = \\log p" />
      </div>

      <div className="viz-title">Direct & Dual Ladder Network with Lossless Bridge</div>
      <div className="viz-subtitle">
        Click any oscillator node to see its properties. The direct ladder (blue) computes ζ(s),
        the dual ladder (gold) computes ζ(1-s). They connect through the purple bridge.
        At σ = 0.5, the bridge is lossless (|χ| = 1).
      </div>
      <OscillatorChainViz />

      <div style={{ margin: '40px 0 20px' }}>
        <BlockMath tex="Q_p(\\sigma) = \\frac{1}{2\\sigma} \\quad \\Rightarrow \\quad Q_p(1/2) = 1 \\text{ for ALL primes (critical coupling)}" />
      </div>

      <div style={{ marginTop: 40 }}>
        <div className="viz-title">Euler Product Convergence</div>
        <div className="viz-subtitle">
          Watch the partial Euler product build up prime by prime. Blue line: cumulative |ζ(s)|.
          Bars show individual factor magnitudes. Purple: cumulative phase.
        </div>
        <EulerProductViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Direct Ladder</h3>
          <p style={{ marginBottom: 12 }}>
            Computes ζ(s) via the Euler product as a cascade of oscillators with increasing
            resonant frequency. Each stage filters the signal, with the cascade building up
            the full zeta function.
          </p>
          <BlockMath tex="H_{\\text{direct}}(s) = \\prod_{p \\leq P} \\frac{1}{1-p^{-s}}" />
          <ul style={{ marginTop: 12, marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
            <li>Series elements: L_p = log(p)</li>
            <li>Shunt elements: C_p = 1/log(p)</li>
            <li>Coupling: via prime gaps</li>
            <li>Each stage adds one Euler factor</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Dual Ladder</h3>
          <p style={{ marginBottom: 12 }}>
            Computes ζ(1-s) at the reflected point. The functional equation connects
            direct and dual via the bridge factor χ(s).
          </p>
          <BlockMath tex="H_{\\text{dual}}(s) = \\prod_{p \\leq P} \\frac{1}{1-p^{-(1-s)}}" />
          <ul style={{ marginTop: 12, marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
            <li>Mirror of the direct ladder at s → 1-s</li>
            <li>Same primes, different operating point</li>
            <li>Symmetric with direct at σ = 1/2</li>
            <li>Impedance matches direct on critical line</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>The Lossless Bridge</h3>
        <p style={{ marginBottom: 12 }}>
          The prefactor in the functional equation χ(s) = 2ˢπˢ⁻¹sin(πs/2)Γ(1-s) acts as a
          lossless two-port network connecting the ladders. It has |χ(½+it)| = 1 for all t.
        </p>
        <BlockMath tex="\\zeta(s) = \\chi(s) \\cdot \\zeta(1-s), \\quad |\\chi(1/2+it)| = 1" />
        <BlockMath tex="S_{\\text{bridge}} = \\begin{pmatrix} \\Gamma_{\\text{reflect}} & \\xi(s) \\\\ \\xi(1-s) & \\Gamma_{\\text{reflect}} \\end{pmatrix}, \\quad S^\\dagger S = I \\text{ on } \\sigma = \\frac{1}{2}" />
      </div>
    </div>
  );
}
