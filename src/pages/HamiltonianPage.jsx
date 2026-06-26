import React from 'react';
import { Link } from 'react-router-dom';
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
          potential, and bridge coupling energy — achieves its minimum at the critical line <InlineMath tex={"\\sigma = 1/2"} />.
        </p>
      </div>

      <BlockMath tex={"\\mathcal{H}(s) = \\underbrace{T(s)}_{\\text{kinetic}} + \\underbrace{V_{\\text{mismatch}}(s)}_{\\text{impedance}} + \\underbrace{V_{\\text{bridge}}(s)}_{\\text{coupling}}"} />

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>What to Explore in Each Visualization</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#3b82f6' }}>Hamiltonian Energy vs σ</strong> — drag the t slider to a zeta
          zero (<InlineMath tex={"t \\approx 14.13, 21.02, 25.01"} />) and watch the green total-energy curve develop
          a sharp minimum at <InlineMath tex={"\\sigma = 0.5"} />. Compare the three components: the blue kinetic energy
          is symmetric about <InlineMath tex={"\\sigma = 0.5"} />, the orange mismatch is minimized there (conjugate-matched, not zero), and the purple
          bridge penalty is zero exactly on the critical line:
        </p>
        <BlockMath tex={"|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\text{Im}\\,Z| \\quad \\text{(residual mismatch)}"} />
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Increase primes to see the valley deepen and narrow.
        </p>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#f59e0b' }}>Explicit Formula ψ(x)</strong> — start with few zeros and watch
          the gold spectral reconstruction deviate from the blue staircase. Add more zeros to see it converge,
          filling in the steps one oscillation at a time. The shaded area between the PNT line and the
          spectral approximation shows the error the zeros collectively correct. Near prime powers, the
          staircase jumps by <InlineMath tex={"\\log p"} /> — look for how each zero's sinusoid lines up with those jumps.
        </p>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="viz-title">Hamiltonian Energy vs <InlineMath tex={"\\sigma"} /> at Fixed t</div>
        <div className="viz-subtitle">
          Drag t to see how the energy profile changes. The minimum consistently sits near <InlineMath tex={"\\sigma = 0.5"} />.
          Green = total, Blue = kinetic, Orange = mismatch, Purple = bridge coupling.
        </div>
        <HamiltonianViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Kinetic Energy <InlineMath tex="T(s)" /></h3>
          <BlockMath tex={"T(s) = \\sum_p \\frac{1}{2}\\log p \\cdot \\left(|H_p(s)|^2 + |H_p(1-s)|^2\\right)"} />
          <p style={{ marginTop: 8 }}>
            The total energy stored in oscillator motions across both ladders. Each prime
            contributes proportionally to its inductance <InlineMath tex={"\\log(p)"} /> times the squared magnitude
            of its transfer function.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Mismatch Potential <InlineMath tex="V(s)" /></h3>
          <BlockMath tex={"V_{\\text{mismatch}} = \\frac{1}{2}|Z_{\\text{direct}} - Z_{\\text{dual}}|^2"} />
          <p style={{ marginTop: 8 }}>
            Penalty for impedance mismatch between direct and dual ladders. Minimized (but not zero)
            at <InlineMath tex={"\\sigma = 1/2"} /> where Schwarz reflection gives <InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> (conjugate match),
            leaving residual <InlineMath tex={"|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\text{Im}\\,Z|"} />.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Why <InlineMath tex={"\\sigma = 1/2"} /> Minimizes the Hamiltonian</h3>
        <BlockMath tex={"\\frac{\\partial \\mathcal{H}}{\\partial \\sigma}\\bigg|_{\\sigma=1/2} = 0 \\quad \\text{and} \\quad \\frac{\\partial^2 \\mathcal{H}}{\\partial \\sigma^2}\\bigg|_{\\sigma=1/2} > 0"} />
        <p style={{ marginTop: 12 }}>
          At <InlineMath tex={"\\sigma = 1/2"} />, three conditions simultaneously hold:
        </p>
        <ol style={{ margin: '12px 0 0 20px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <li><strong style={{ color: '#3b82f6' }}>Balance:</strong> Direct and dual ladders are symmetric, so kinetic energy is balanced</li>
          <li><strong style={{ color: '#f59e0b' }}>Conjugate match:</strong> <InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> by Schwarz reflection (since <InlineMath tex={"1 - s = \\bar{s}"} /> at <InlineMath tex={"\\sigma = 1/2"} />), so <InlineMath tex={"V_{\\text{mismatch}}"} /> is minimized</li>
          <li><strong style={{ color: '#8b5cf6' }}>Lossless:</strong> <InlineMath tex={"|\\chi(1/2+it)| = 1"} />, so <InlineMath tex={"V_{\\text{bridge}} = 0"} /></li>
        </ol>
        <p style={{ marginTop: 12 }}>
          This is an exploratory analogy inspired by the Hilbert-Pólya conjecture. The conjugate matching
          and bridge unitarity at <InlineMath tex={"\\sigma = 1/2"} /> follow from the functional equation, which is a theorem.
          However, this model does not constitute a proof of RH — the Hamiltonian is constructed to exhibit
          this minimum, and deriving the zero locations from it would require establishing that the
          oscillator chain's eigenvalues are precisely the zeta zeros, which remains an open problem.
        </p>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="page-header">
          <h1>Explicit Formula: The Impulse Response</h1>
          <p>
            Von Mangoldt's explicit formula expresses the prime counting function <InlineMath tex={"\\psi(x)"} /> as a sum
            over zeta zeros — each zero contributing a damped sinusoid. In our model, this corresponds
            to the step response of the prime oscillator chain.
          </p>
        </div>
        <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log 2\\pi - \\frac{1}{2}\\log(1 - x^{-2})"} />
        <div style={{ marginTop: 20 }}>
          <div className="viz-title">Chebyshev <InlineMath tex={"\\psi(x)"} /> and Spectral Reconstruction</div>
          <div className="viz-subtitle">
            Blue staircase: actual <InlineMath tex={"\\psi(x)"} />. Gold curve: reconstruction from zeta zeros via the
            explicit formula. Dashed: the asymptote x (PNT). Add more zeros for better fit.
          </div>
          <div className="card" style={{ marginTop: 12, marginBottom: 12, borderLeft: '3px solid #f59e0b', background: 'rgba(245,158,11,0.04)', padding: '10px 14px' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12 }}>Honest note: </span>
            <span style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
              The explicit formula is a proven identity — it holds unconditionally. The zeros used here
              are tabulated values with <InlineMath tex={"\\sigma = 1/2"} /> as an <strong style={{ color: '#e2e8f0' }}>input assumption</strong>, not
              a consequence of the Hamiltonian construction. Placing zeros on the critical line is
              assumed from numerical tables (Odlyzko et al.), not derived from the ZPO model.
              Adding more zeros shows convergence of the known explicit formula, not evidence for RH.
            </span>
          </div>
          <ExplicitFormulaViz />
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Spectral Decomposition</h3>
          <BlockMath tex={"\\frac{x^{\\rho}}{\\rho} + \\frac{x^{\\bar{\\rho}}}{\\bar{\\rho}} = \\frac{2x^{1/2}}{\\sqrt{\\gamma^2 + 1/4}}\\,\\cos\\!\\bigl(\\gamma\\log x - \\arg\\rho\\bigr)"} />
          <p style={{ marginTop: 8 }}>
            Each conjugate pair of nontrivial zeros <InlineMath tex={"\\rho, \\bar{\\rho} = \\tfrac{1}{2}\\pm i\\gamma"} /> contributes
            a damped sinusoid to <InlineMath tex={"\\psi(x)"} />.
            The frequency is <InlineMath tex={"\\gamma"} /> (the imaginary part), the envelope decays
            as <InlineMath tex="x^{1/2}" /> (from <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />), and the amplitude falls
            off as <InlineMath tex={"2/|\\rho|"} />. Higher zeros contribute smaller, faster oscillations —
            fine detail in the prime staircase.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Convergence & Error</h3>
          <BlockMath tex={"\\psi(x) - x = -\\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} + O(1)"} />
          <p style={{ marginTop: 8 }}>
            The error between <InlineMath tex={"\\psi(x)"} /> and its leading term <InlineMath tex="x" /> is entirely
            controlled by zeta zeros. If all zeros satisfy <InlineMath tex={"\\text{Re}(\\rho) = \\tfrac{1}{2}"} /> (RH),
            the error is <InlineMath tex={"O(\\sqrt{x}\\,\\log^2 x)"} /> — the best possible bound. Each zero
            off the critical line would contribute a term decaying more slowly
            than <InlineMath tex={"\\sqrt{x}"} />, degrading the approximation.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Circuit Interpretation: Impulse Response</h3>
        <p style={{ marginTop: 12 }}>
          In the oscillator chain model, the explicit formula is the system's <strong>impulse response</strong>.
          Hitting the ladder network with a delta function excites all its resonant modes — one per
          zeta zero. The output is the superposition of all these ringing modes, each decaying at a rate
          set by <InlineMath tex={"\\sigma"} />. If the system is <em>lossless</em> (<InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for
          all modes), every mode decays at exactly the same rate, and the step response reconstructs the
          prime staircase with optimal fidelity.
        </p>
      </div>

      {/* Weil Connection */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8 }}>Connection: Weil Quadratic Form (Connes 2026)</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The Hamiltonian minimization at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> has a deep
          connection to the <strong>Weil quadratic form</strong>. Connes (2026) showed that the Weil
          positivity condition <InlineMath tex={"W(g \\star \\tilde{g}) \\geq 0"} /> is equivalent to
          RH, and that extremizing this form using only primes {"<"} 13 approximates 50 zeros with
          accuracy up to <InlineMath tex={"10^{-55}"} />. In ZPO terms: the Hamiltonian <InlineMath tex={"\\mathcal{H}"} /> being
          bounded below is the physical manifestation of Weil positivity. The explicit formula
          that drives the spectral decomposition above is the <em>same</em> formula that defines
          the Weil kernel.
        </p>
      </div>

      {/* Berry-Keating Semiclassical Quantization */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #e11d48' }}>
        <h3 style={{ color: '#e11d48' }}>Berry-Keating Semiclassical Quantization</h3>
        <p style={{ marginTop: 12 }}>
          Berry and Keating (1999) proposed the simplest Hamiltonian whose spectrum is related to the
          zeta zeros:
        </p>
        <BlockMath tex={"H = xp"} />
        <p style={{ marginTop: 12 }}>
          Under semiclassical quantization the trace formula becomes a sum over prime periodic orbits:
        </p>
        <BlockMath tex={"\\sum_{\\rho} h(\\gamma_\\rho) = \\sum_p \\sum_{k=1}^{\\infty} \\frac{\\log p}{p^{k/2}}\\, g(k \\log p)"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Each prime <InlineMath tex={"p"} /> defines a periodic orbit of
          period <InlineMath tex={"T_p = \\log p"} /> and
          action <InlineMath tex={"S_p = \\tfrac{1}{2}\\log p"} />.
          The Maslov index correction reshapes the eigenvalue condition into
          the <InlineMath tex={"\\tfrac{1}{4} + t^2"} /> form, ensuring that the quantized
          energies <InlineMath tex={"E_n"} /> correspond to the nontrivial zeros:
        </p>
        <BlockMath tex={"E_n \\;\\longleftrightarrow\\; \\rho_n = \\tfrac{1}{2} + i\\gamma_n"} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong>Connection to the ZPO model:</strong> the <InlineMath tex={"xp"} /> Hamiltonian is the
          continuum limit of the discrete ladder Hamiltonian used in the prime oscillator chain. In
          the ZPO picture every prime contributes a separate oscillator; taking the product over all
          primes and passing to the continuum recovers the Berry-Keating operator.
        </p>
      </div>

      {/* Why sigma = 1/2 Minimizes the Hamiltonian (detailed) */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #0ea5e9' }}>
        <h3 style={{ color: '#0ea5e9' }}>Why <InlineMath tex={"\\sigma = 1/2"} /> Minimizes the Hamiltonian</h3>
        <p style={{ marginTop: 12 }}>
          The ZPO Hamiltonian decomposes into kinetic and potential parts:
        </p>
        <BlockMath tex={"\\mathcal{H}(\\sigma, t) = T(\\sigma, t) + V(\\sigma, t)"} />

        <ol style={{ margin: '12px 0 0 20px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <li>
            <strong style={{ color: '#0ea5e9' }}>Zero potential at <InlineMath tex={"\\sigma = 1/2"} />:</strong>{" "}
            The bridge factor <InlineMath tex={"\\chi(s)"} /> satisfies <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> (unitarity),
            so <InlineMath tex={"V = 0"} /> on the critical line.
          </li>
          <li style={{ marginTop: 8 }}>
            <strong style={{ color: '#0ea5e9' }}>Minimum kinetic curvature:</strong>{" "}
            The kinetic term
            <BlockMath tex={"T = \\sum_p \\frac{(\\log p)^2\\, p^{-2\\sigma}}{(1 - p^{-2\\sigma})^2}"} />
            has its minimum curvature at <InlineMath tex={"\\sigma = 1/2"} />, where the oscillator amplitudes
            are balanced between the direct and dual ladders.
          </li>
          <li style={{ marginTop: 8 }}>
            <strong style={{ color: '#0ea5e9' }}>Convexity:</strong>{" "}
            The second variation is strictly positive at the critical line:
            <BlockMath tex={"\\frac{\\partial^2 \\mathcal{H}}{\\partial \\sigma^2}\\bigg|_{\\sigma = 1/2} > 0"} />
            confirming that <InlineMath tex={"\\sigma = 1/2"} /> is a true minimum, not merely a saddle point.
          </li>
          <li style={{ marginTop: 8 }}>
            <strong style={{ color: '#0ea5e9' }}>Restoring force off the critical line:</strong>{" "}
            When <InlineMath tex={"\\sigma \\neq 1/2"} />, the bridge factor
            satisfies <InlineMath tex={"|\\chi(s)| \\neq 1"} />, so <InlineMath tex={"V > 0"} />.
            This creates a restoring potential that pushes the system back
            toward <InlineMath tex={"\\sigma = 1/2"} />.
          </li>
          <li style={{ marginTop: 8 }}>
            <strong style={{ color: '#0ea5e9' }}>Mexican-hat profile:</strong>{" "}
            Along the <InlineMath tex={"\\sigma"} />-axis the total Hamiltonian has a "Mexican hat" potential
            profile — a ring of minima at <InlineMath tex={"\\sigma = 1/2"} /> for
            every <InlineMath tex={"t = \\gamma_n"} />, with the potential rising symmetrically on both sides.
          </li>
        </ol>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/oscillators" style={{ color: '#3b82f6', fontSize: 13 }}>Prime Oscillators</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#f97316', fontSize: 13 }}>Gap Closing (S5 operator)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/spectral-attack" style={{ color: '#06b6d4', fontSize: 13 }}>Spectral Attack (unified potential)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof (S6 status)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/simulator" style={{ color: '#f59e0b', fontSize: 13 }}>Simulator (gradient descent)</Link>
        </div>
      </div>
    </div>
  );
}
