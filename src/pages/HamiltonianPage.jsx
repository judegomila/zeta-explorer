import React from 'react';
import HamiltonianViz from '../components/HamiltonianViz.jsx';
import ExplicitFormulaViz from '../components/ExplicitFormulaViz.jsx';
import { BlockMath } from '../components/KaTeXMath.jsx';

export default function HamiltonianPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Hamiltonian & Energy Landscape</h1>
        <p>
          The total system Hamiltonian — combining kinetic energy of oscillators, impedance mismatch
          potential, and bridge coupling energy — achieves its minimum at the critical line σ = 1/2.
        </p>
      </div>

      <BlockMath tex="\\mathcal{H}(s) = \\underbrace{T(s)}_{\\text{kinetic}} + \\underbrace{V_{\\text{mismatch}}(s)}_{\\text{impedance}} + \\underbrace{V_{\\text{bridge}}(s)}_{\\text{coupling}}" />

      <div style={{ marginTop: 32 }}>
        <div className="viz-title">Hamiltonian Energy vs σ at Fixed t</div>
        <div className="viz-subtitle">
          Drag t to see how the energy profile changes. The minimum consistently sits near σ = 0.5.
          Green = total, Blue = kinetic, Orange = mismatch, Purple = bridge coupling.
        </div>
        <HamiltonianViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Kinetic Energy T(s)</h3>
          <BlockMath tex="T(s) = \\sum_p \\frac{1}{2}\\log p \\cdot \\left(|H_p(s)|^2 + |H_p(1-s)|^2\\right)" />
          <p style={{ marginTop: 8 }}>
            The total energy stored in oscillator motions across both ladders. Each prime
            contributes proportionally to its inductance log(p) times the squared magnitude
            of its transfer function.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Mismatch Potential V(s)</h3>
          <BlockMath tex="V_{\\text{mismatch}} = \\frac{1}{2}|Z_{\\text{direct}} - Z_{\\text{dual}}|^2" />
          <p style={{ marginTop: 8 }}>
            Penalty for impedance mismatch between direct and dual ladders. Vanishes identically
            at σ = 1/2 where the functional equation guarantees symmetry.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Why σ = 1/2 Minimizes the Hamiltonian</h3>
        <BlockMath tex="\\frac{\\partial \\mathcal{H}}{\\partial \\sigma}\\bigg|_{\\sigma=1/2} = 0 \\quad \\text{and} \\quad \\frac{\\partial^2 \\mathcal{H}}{\\partial \\sigma^2}\\bigg|_{\\sigma=1/2} > 0" />
        <p style={{ marginTop: 12 }}>
          At σ = 1/2, three conditions simultaneously hold:
        </p>
        <ol style={{ margin: '12px 0 0 20px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <li><strong style={{ color: '#3b82f6' }}>Balance:</strong> Direct and dual ladders are symmetric, so kinetic energy is balanced</li>
          <li><strong style={{ color: '#f59e0b' }}>Match:</strong> Z_direct = Z_dual by the functional equation, so V_mismatch = 0</li>
          <li><strong style={{ color: '#8b5cf6' }}>Lossless:</strong> |χ(1/2+it)| = 1, so V_bridge = 0</li>
        </ol>
        <p style={{ marginTop: 12 }}>
          This is the circuit-theoretic realization of the Hilbert-Pólya conjecture: if the system's
          eigenvalues (zeros) occur at energy minima, and all minima lie on σ = 1/2, then all
          nontrivial zeros are on the critical line.
        </p>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="page-header">
          <h1>Explicit Formula: The Impulse Response</h1>
          <p>
            Von Mangoldt's explicit formula expresses the prime counting function ψ(x) as a sum
            over zeta zeros — each zero contributing a damped sinusoid. This IS the step response
            of the prime oscillator chain.
          </p>
        </div>
        <BlockMath tex="\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\log 2\\pi - \\frac{1}{2}\\log(1 - x^{-2})" />
        <div style={{ marginTop: 20 }}>
          <div className="viz-title">Chebyshev ψ(x) and Spectral Reconstruction</div>
          <div className="viz-subtitle">
            Blue staircase: actual ψ(x). Gold curve: reconstruction from zeta zeros via the
            explicit formula. Dashed: the asymptote x (PNT). Add more zeros for better fit.
          </div>
          <ExplicitFormulaViz />
        </div>
      </div>
    </div>
  );
}
