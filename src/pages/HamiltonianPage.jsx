import React from 'react';
import HamiltonianViz from '../components/HamiltonianViz.jsx';
import ExplicitFormulaViz from '../components/ExplicitFormulaViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function HamiltonianPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Hamiltonian & Energy Landscape</h1>
        <p>
          The total system Hamiltonian — combining kinetic energy of oscillators, impedance mismatch
          potential, and bridge coupling energy — achieves its minimum at the critical line <InlineMath tex="\\sigma = 1/2" />.
        </p>
      </div>

      <BlockMath tex="\\mathcal{H}(s) = \\underbrace{T(s)}_{\\text{kinetic}} + \\underbrace{V_{\\text{mismatch}}(s)}_{\\text{impedance}} + \\underbrace{V_{\\text{bridge}}(s)}_{\\text{coupling}}" />

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>What to Explore in Each Visualization</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#3b82f6' }}>Hamiltonian Energy vs σ</strong> — drag the t slider to a zeta
          zero (<InlineMath tex="t \approx 14.13, 21.02, 25.01" />) and watch the green total-energy curve develop
          a sharp minimum at <InlineMath tex="\sigma = 0.5" />. Compare the three components: the blue kinetic energy
          is symmetric about <InlineMath tex="\sigma = 0.5" />, the orange mismatch is minimized there (conjugate-matched, not zero: <InlineMath tex="|Z_{\text{dir}} - Z_{\text{dual}}| = 2|\text{Im}\,Z|" />), and the purple
          bridge penalty is zero exactly on the critical line. Increase primes to see the valley deepen and narrow.
        </p>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#f59e0b' }}>Explicit Formula ψ(x)</strong> — start with few zeros and watch
          the gold spectral reconstruction deviate from the blue staircase. Add more zeros to see it converge,
          filling in the steps one oscillation at a time. The shaded area between the PNT line and the
          spectral approximation shows the error the zeros collectively correct. Near prime powers, the
          staircase jumps by <InlineMath tex="\log p" /> — look for how each zero's sinusoid lines up with those jumps.
        </p>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="viz-title">Hamiltonian Energy vs <InlineMath tex="\\sigma" /> at Fixed t</div>
        <div className="viz-subtitle">
          Drag t to see how the energy profile changes. The minimum consistently sits near <InlineMath tex="\\sigma = 0.5" />.
          Green = total, Blue = kinetic, Orange = mismatch, Purple = bridge coupling.
        </div>
        <HamiltonianViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Kinetic Energy <InlineMath tex="T(s)" /></h3>
          <BlockMath tex="T(s) = \\sum_p \\frac{1}{2}\\log p \\cdot \\left(|H_p(s)|^2 + |H_p(1-s)|^2\\right)" />
          <p style={{ marginTop: 8 }}>
            The total energy stored in oscillator motions across both ladders. Each prime
            contributes proportionally to its inductance <InlineMath tex="\\log(p)" /> times the squared magnitude
            of its transfer function.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Mismatch Potential <InlineMath tex="V(s)" /></h3>
          <BlockMath tex="V_{\\text{mismatch}} = \\frac{1}{2}|Z_{\\text{direct}} - Z_{\\text{dual}}|^2" />
          <p style={{ marginTop: 8 }}>
            Penalty for impedance mismatch between direct and dual ladders. Minimized (but not zero)
            at <InlineMath tex="\\sigma = 1/2" /> where Schwarz reflection gives <InlineMath tex="Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}" /> (conjugate match),
            leaving residual <InlineMath tex="|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\text{Im}\\,Z|" />.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Why <InlineMath tex="\\sigma = 1/2" /> Minimizes the Hamiltonian</h3>
        <BlockMath tex="\\frac{\\partial \\mathcal{H}}{\\partial \\sigma}\\bigg|_{\\sigma=1/2} = 0 \\quad \\text{and} \\quad \\frac{\\partial^2 \\mathcal{H}}{\\partial \\sigma^2}\\bigg|_{\\sigma=1/2} > 0" />
        <p style={{ marginTop: 12 }}>
          At <InlineMath tex="\\sigma = 1/2" />, three conditions simultaneously hold:
        </p>
        <ol style={{ margin: '12px 0 0 20px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <li><strong style={{ color: '#3b82f6' }}>Balance:</strong> Direct and dual ladders are symmetric, so kinetic energy is balanced</li>
          <li><strong style={{ color: '#f59e0b' }}>Conjugate match:</strong> <InlineMath tex="Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}" /> by Schwarz reflection (since <InlineMath tex="1 - s = \\bar{s}" /> at <InlineMath tex="\\sigma = 1/2" />), so <InlineMath tex="V_{\\text{mismatch}}" /> is minimized</li>
          <li><strong style={{ color: '#8b5cf6' }}>Lossless:</strong> <InlineMath tex="|\\chi(1/2+it)| = 1" />, so <InlineMath tex="V_{\\text{bridge}} = 0" /></li>
        </ol>
        <p style={{ marginTop: 12 }}>
          This is an exploratory analogy inspired by the Hilbert-Pólya conjecture. The conjugate matching
          and bridge unitarity at <InlineMath tex="\\sigma = 1/2" /> follow from the functional equation, which is a theorem.
          However, this model does not constitute a proof of RH — the Hamiltonian is constructed to exhibit
          this minimum, and deriving the zero locations from it would require establishing that the
          oscillator chain's eigenvalues are precisely the zeta zeros, which remains an open problem.
        </p>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="page-header">
          <h1>Explicit Formula: The Impulse Response</h1>
          <p>
            Von Mangoldt's explicit formula expresses the prime counting function <InlineMath tex="\\psi(x)" /> as a sum
            over zeta zeros — each zero contributing a damped sinusoid. In our model, this corresponds
            to the step response of the prime oscillator chain.
          </p>
        </div>
        <BlockMath tex="\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\log 2\\pi - \\frac{1}{2}\\log(1 - x^{-2})" />
        <div style={{ marginTop: 20 }}>
          <div className="viz-title">Chebyshev <InlineMath tex="\\psi(x)" /> and Spectral Reconstruction</div>
          <div className="viz-subtitle">
            Blue staircase: actual <InlineMath tex="\\psi(x)" />. Gold curve: reconstruction from zeta zeros via the
            explicit formula. Dashed: the asymptote x (PNT). Add more zeros for better fit.
          </div>
          <ExplicitFormulaViz />
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Spectral Decomposition</h3>
          <BlockMath tex="\frac{x^\rho}{\rho} + \frac{x^{\bar\rho}}{\bar\rho} = \frac{2x^{1/2}}{\sqrt{\gamma^2 + 1/4}}\,\cos\!\bigl(\gamma\log x - \arg\rho\bigr)" />
          <p style={{ marginTop: 8 }}>
            Each conjugate pair of nontrivial zeros <InlineMath tex="\rho, \bar\rho = \tfrac{1}{2}\pm i\gamma" /> contributes
            a damped sinusoid to <InlineMath tex="\psi(x)" />.
            The frequency is <InlineMath tex="\gamma" /> (the imaginary part), the envelope decays
            as <InlineMath tex="x^{1/2}" /> (from <InlineMath tex="\sigma = \tfrac{1}{2}" />), and the amplitude falls
            off as <InlineMath tex="2/|\rho|" />. Higher zeros contribute smaller, faster oscillations —
            fine detail in the prime staircase.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Convergence & Error</h3>
          <BlockMath tex="\psi(x) - x = -\sum_\rho \frac{x^\rho}{\rho} + O(1)" />
          <p style={{ marginTop: 8 }}>
            The error between <InlineMath tex="\psi(x)" /> and its leading term <InlineMath tex="x" /> is entirely
            controlled by zeta zeros. If all zeros satisfy <InlineMath tex="\text{Re}(\rho) = \tfrac{1}{2}" /> (RH),
            the error is <InlineMath tex="O(\sqrt{x}\,\log^2 x)" /> — the best possible bound. Each zero
            off the critical line would contribute a term decaying more slowly
            than <InlineMath tex="\sqrt{x}" />, degrading the approximation.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Circuit Interpretation: Impulse Response</h3>
        <p style={{ marginTop: 12 }}>
          In the oscillator chain model, the explicit formula is the system's <strong>impulse response</strong>.
          Hitting the ladder network with a delta function excites all its resonant modes — one per
          zeta zero. The output is the superposition of all these ringing modes, each decaying at a rate
          set by <InlineMath tex="\sigma" />. If the system is <em>lossless</em> (<InlineMath tex="\sigma = \tfrac{1}{2}" /> for
          all modes), every mode decays at exactly the same rate, and the step response reconstructs the
          prime staircase with optimal fidelity.
        </p>
      </div>
    </div>
  );
}
