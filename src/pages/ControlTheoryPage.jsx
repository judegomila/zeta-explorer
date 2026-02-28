import React from 'react';
import NyquistBodeViz from '../components/NyquistBodeViz.jsx';
import ScatteringMatrixViz from '../components/ScatteringMatrixViz.jsx';
import { BlockMath } from '../components/KaTeXMath.jsx';

export default function ControlTheoryPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Control Theory & Scattering</h1>
        <p>
          The Riemann Hypothesis reformulated as a stability criterion in feedback control theory.
          The Nyquist plot, Bode diagram, and scattering matrix of the ladder-bridge system
          encode the locations of zeta zeros.
        </p>
      </div>

      <BlockMath tex="L(s) = \chi(s) \cdot \frac{\zeta(1-s)}{\zeta(s)}, \quad \zeta(s) = 0 \iff 1 + L(s) = 0" />

      <div style={{ marginTop: 32 }}>
        <div className="viz-title">Nyquist Plot & Bode Diagram</div>
        <div className="viz-subtitle">
          The Nyquist plot traces L(s) as t varies. Encirclements of -1 correspond to zeros off
          the critical line. At σ = 0.5, expect zero encirclements (RH). The Bode diagram
          shows magnitude (dB) and phase vs frequency.
        </div>
        <NyquistBodeViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Nyquist Stability Criterion</h3>
          <BlockMath tex="N_{\text{encircle}} = Z_{\text{RHP}} - P_{\text{RHP}}" />
          <p style={{ marginTop: 8 }}>
            The number of clockwise encirclements of -1 by the Nyquist contour equals the number
            of right-half-plane zeros minus poles. For our system: RH says zero encirclements
            when σ = 1/2 (marginally stable on the critical line).
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Bode Sensitivity Integral</h3>
          <BlockMath tex="\int_0^\infty \log|S(j\omega)|\, d\omega = \pi \sum_k \sigma_k" />
          <p style={{ marginTop: 8 }}>
            Bode's integral constrains the total sensitivity. For minimum-phase systems, this integral
            is determined by the RHP poles. Applied to our ladder: the integral evaluates to a quantity
            related to the prime number theorem. RH controls the error term.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="viz-title">Scattering Matrix of the Lossless Bridge</div>
        <div className="viz-subtitle">
          The bridge connecting direct and dual ladders has |χ(½+it)| = 1 (lossless) on the critical line.
          Off the critical line, the bridge becomes lossy (|χ| &lt; 1) or amplifying (|χ| &gt; 1).
          The reflection coefficient Γ vanishes exactly at σ = 1/2.
        </div>
        <ScatteringMatrixViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>H∞ Optimal Control</h3>
        <BlockMath tex="\min_\sigma \|S(\sigma + j\cdot)\|_\infty \quad \text{achieved at } \sigma = \frac{1}{2}" />
        <p style={{ marginTop: 12 }}>
          The H-infinity optimal control framework naturally selects σ = 1/2 as the operating point
          that minimizes the worst-case sensitivity. The sensitivity/complementary sensitivity balance
          S + T = 1 at σ = 1/2 is the control-theoretic version of the functional equation.
        </p>
        <div className="two-col" style={{ marginTop: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#3b82f6' }}>Gain margin:</strong> How much the loop gain can
              increase before instability. In our model, this measures how far zeros can drift
              from the critical line before the system becomes unstable. RH says: infinite gain
              margin on the critical line.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#f59e0b' }}>Phase margin:</strong> How much phase lag can
              be added before instability. Related to the argument of ζ(s) and the S(t) function
              counting the phase changes of ζ on the critical line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
