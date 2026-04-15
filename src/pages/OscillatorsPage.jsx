import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OscillatorChainViz from '../components/OscillatorChainViz.jsx';
import EulerProductViz from '../components/EulerProductViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function OscillatorsPage() {
  const [sliderSigma, setSliderSigma] = useState(0.5);
  const sliderQ = 1 / (2 * sliderSigma);
  const sliderRegime =
    sliderQ > 1.05 ? 'underdamped' : sliderQ < 0.95 ? 'overdamped' : 'critical';
  const sliderColor =
    sliderRegime === 'underdamped' ? '#3b82f6'
    : sliderRegime === 'overdamped' ? '#f59e0b'
    : '#10b981';

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
        <BlockMath tex={"\\zeta(s) = \\prod_{p} \\underbrace{\\frac{1}{1 - p^{-s}}}_{H_p(s)} \\quad \\text{where each } H_p \\text{ is an LC oscillator } (L_p = \\log p,\\; C_p = 1/\\log p,\\; \\omega_0 = 1)"} />
      </div>

      {/* ── Building the Model ── */}
      <div className="card" style={{ marginBottom: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 16 }}>Building the Model: From Euler Factor to LC Oscillator</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          The ZPO framework constructs a physical model step-by-step, mapping each Euler factor
          to a linear system and then identifying it with an LC resonator. Here is the derivation.
        </p>

        <h4 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>Step 1: From Euler Factor to Transfer Function</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          Each Euler factor <InlineMath tex={"H_p(s) = 1/(1-p^{-s})"} /> is treated as the transfer function
          of a linear time-invariant system. The input-output relation in the Laplace domain is:
        </p>
        <BlockMath tex={"Y(s) = H_p(s) \\cdot X(s) = \\frac{1}{1 - p^{-s}} \\cdot X(s)"} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          Expanding the geometric series gives the impulse response (inverse Laplace transform of <InlineMath tex={"H_p"} />):
        </p>
        <BlockMath tex={"h_p(t) = \\sum_{k=0}^{\\infty} \\delta(t - k\\log p)"} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          The poles of <InlineMath tex={"H_p(s)"} /> occur where <InlineMath tex={"p^{-s} = 1"} />, i.e. where <InlineMath tex={"e^{-s \\log p} = 1"} />:
        </p>
        <BlockMath tex={"\\text{Poles at } s = \\frac{2\\pi i k}{\\log p}, \\quad k \\in \\mathbb{Z}"} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          These poles are equally spaced along the imaginary axis with spacing <InlineMath tex={"2\\pi / \\log p"} />,
          exactly like the resonances of a periodic system with fundamental period <InlineMath tex={"\\log p"} />.
        </p>

        <h4 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>Step 2: LC Resonator Mapping</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          Writing the Euler factor with an explicit exponential makes the oscillator structure visible:
        </p>
        <BlockMath tex={"H_p(s) = \\frac{1}{1 - e^{-s \\cdot \\log p}}"} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          Compare with the impedance of a series LC circuit driven at frequency <InlineMath tex={"\\omega"} />:
        </p>
        <BlockMath tex={"Z_{LC}(\\omega) = \\frac{j\\omega L}{1 - \\omega^2 LC}"} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          Identifying the denominator structure and matching the pole spacing yields the component values:
        </p>
        <BlockMath tex={"L_p = \\log p, \\quad C_p = \\frac{1}{\\log p}, \\quad Z_0 = \\log p"} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          The resonant frequency is <InlineMath tex={"\\omega_0 = 1/\\sqrt{L_p C_p} = 1"} /> for every prime — all oscillators
          resonate at unity frequency, but with different characteristic impedances <InlineMath tex={"Z_0 = \\log p"} />.
        </p>

        <h4 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>Step 3: Quality Factor and Critical Coupling</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          The quality factor measures how sharply an oscillator resonates. For the Euler factor
          at <InlineMath tex={"s = \\sigma + it"} />, the damping is controlled by <InlineMath tex={"\\sigma"} />:
        </p>
        <BlockMath tex={"Q_p(\\sigma) = \\frac{1}{2\\sigma}"} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          This is <em>prime-independent</em>: every oscillator in the chain has the same Q at a
          given <InlineMath tex={"\\sigma"} />. As <InlineMath tex={"\\sigma \\to 0"} />, we have <InlineMath tex={"Q \\to \\infty"} /> (lossless oscillator).
          On the critical line <InlineMath tex={"\\sigma = 1/2"} />, <InlineMath tex={"Q_p = 1"} /> for all primes — this is
          the <em>critical coupling</em> condition, where each oscillator is at the boundary between
          underdamped and overdamped behavior. The fact that this coupling is simultaneous for all primes
          is the circuit-theoretic signature of the critical line.
        </p>
      </div>

      <div className="viz-title">Direct & Dual Ladder Network with Lossless Bridge</div>
      <div className="viz-subtitle">
        Click any oscillator node to see its properties. The direct ladder (blue) computes <InlineMath tex={"\\zeta(s)"} />,
        the dual ladder (gold) computes <InlineMath tex={"\\zeta(1-s)"} />. They connect through the purple bridge.
        At <InlineMath tex={"\\sigma = 0.5"} />, the bridge is lossless (<InlineMath tex={"|\\chi| = 1"} />).
      </div>
      <OscillatorChainViz />

      <div style={{ margin: '40px 0 20px' }}>
        <BlockMath tex={"Q_p(\\sigma) = \\frac{1}{2\\sigma} \\quad \\Rightarrow \\quad Q_p(1/2) = 1 \\text{ for ALL primes (critical coupling)}"} />
        <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Note: This Q-factor arises from the LC circuit analogy where <InlineMath tex={"L_p = \\log p"} />, <InlineMath tex={"C_p = 1/\\log p"} />.
          It is a property of the model, not a theorem about the Euler product itself. The
          prime-independence of Q at <InlineMath tex={"\\sigma = 1/2"} /> is suggestive but not a proof of anything about RH.
        </p>
      </div>

      <div style={{ marginTop: 40 }}>
        <div className="viz-title">Euler Product Convergence</div>
        <div className="viz-subtitle">
          Watch the partial Euler product build up prime by prime. Blue line: cumulative <InlineMath tex={"|\\zeta(s)|"} />.
          Bars show individual factor magnitudes. Purple: cumulative phase.
        </div>
        <EulerProductViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>What to Observe</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#3b82f6' }}>Chain diagram:</strong> Click any oscillator node
            to inspect its <InlineMath tex={"L_p, C_p, Q_p"} /> values. At <InlineMath tex={"\\sigma = 0.5"} /> every
            node shows <InlineMath tex={"Q = 1"} /> (critical coupling) and the bridge reads LOSSLESS —
            slide <InlineMath tex={"\\sigma"} /> away to watch Q diverge and the bridge turn LOSSY.
          </li>
          <li>
            <strong style={{ color: '#f59e0b' }}>Euler product:</strong> Blue bars above the
            unity line amplify; gold bars below attenuate. The cumulative <InlineMath tex={"|\\zeta|"} /> curve
            shows how the product converges prime by prime. Near a zeta zero
            (<InlineMath tex={"t \\approx 14.13"} />), the curve plunges toward zero — try sliding t away to see it
            recover.
          </li>
          <li>
            <strong style={{ color: '#8b5cf6' }}>Bridge symmetry:</strong> The direct and dual
            columns are mirror images at <InlineMath tex={"\\sigma = 0.5"} />. Move <InlineMath tex={"\\sigma"} /> off the
            critical line to see the asymmetry grow — node radii will differ between the two ladders,
            and the bridge magnitude <InlineMath tex={"|\\chi|"} /> departs from 1.
          </li>
        </ul>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Direct Ladder</h3>
          <p style={{ marginBottom: 12 }}>
            Computes <InlineMath tex={"\\zeta(s)"} /> via the Euler product as a cascade of oscillators, each with
            LC resonant frequency <InlineMath tex={"\\omega_0 = 1"} /> but distinct Euler factor phase rotation
            rate <InlineMath tex={"\\log p"} />. The cascade builds up the full zeta function stage by stage.
          </p>
          <BlockMath tex={"H_{\\text{direct}}(s) = \\prod_{p \\leq P} \\frac{1}{1-p^{-s}}"} />
          <ul style={{ marginTop: 12, marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
            <li>Series elements: <InlineMath tex={"L_p = \\log(p)"} /></li>
            <li>Shunt elements: <InlineMath tex={"C_p = 1/\\log(p)"} /></li>
            <li>Coupling: via prime gaps</li>
            <li>Each stage adds one Euler factor</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Dual Ladder</h3>
          <p style={{ marginBottom: 12 }}>
            Computes <InlineMath tex={"\\zeta(1-s)"} /> at the reflected point. The functional equation connects
            direct and dual via the bridge factor <InlineMath tex={"\\chi(s)"} />.
          </p>
          <BlockMath tex={"H_{\\text{dual}}(s) = \\prod_{p \\leq P} \\frac{1}{1-p^{-(1-s)}}"} />
          <ul style={{ marginTop: 12, marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
            <li>Mirror of the direct ladder at <InlineMath tex={"s \\to 1-s"} /></li>
            <li>Same primes, different operating point</li>
            <li>Symmetric with direct at <InlineMath tex={"\\sigma = 1/2"} /></li>
            <li>Conjugate-matches direct on critical line (<InlineMath tex={"Z_{\\text{dual}} = \\bar{Z}_{\\text{dir}}"} /> by Schwarz reflection)</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>The Lossless Bridge</h3>
        <p style={{ marginBottom: 12 }}>
          The prefactor in the functional equation <InlineMath tex={"\\chi(s) = 2^s \\pi^{s-1} \\sin(\\pi s/2)\\,\\Gamma(1-s)"} /> acts as a
          lossless two-port network connecting the ladders. It has <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> for all t.
        </p>
        <BlockMath tex={"\\zeta(s) = \\chi(s) \\cdot \\zeta(1-s), \\quad |\\chi(1/2+it)| = 1"} />
        <BlockMath tex={"S_{\\text{bridge}} = \\begin{pmatrix} \\Gamma & \\tau \\\\ \\tau & -\\Gamma \\end{pmatrix}, \\quad \\Gamma = \\frac{1-|\\chi|}{1+|\\chi|},\\; \\tau = \\sqrt{1-\\Gamma^2}, \\quad S^\\dagger S = I \\;(\\text{lossless}),\\; \\Gamma = 0 \\text{ at } \\sigma = \\tfrac{1}{2}"} />
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 14 }}>Resonance Conditions and Quality Factor</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
          Each prime oscillator has a <strong>quality factor</strong> that measures how sharply tuned its resonance is.
          Since <InlineMath tex={"\\omega_0 = 1/\\sqrt{LC} = 1"} /> for all primes and the bandwidth is <InlineMath tex={"2\\sigma"} />:
        </p>
        <BlockMath tex={"Q(\\sigma) = \\frac{\\omega_0}{\\Delta\\omega} = \\frac{1}{2\\sigma}"} />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
          This is <em>prime-independent</em>: every oscillator in the chain has the same Q at a given <InlineMath tex={"\\sigma"} />.
          At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, <InlineMath tex={"Q = 1"} /> for all primes — the critical coupling condition.
          The simultaneous Q = 1 across all primes is the circuit-theoretic signature of the critical line.
        </p>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { sigma: '1/4', Q: '2', label: 'underdamped', color: '#3b82f6' },
            { sigma: '1/2', Q: '1', label: 'critical', color: '#10b981' },
            { sigma: '1', Q: '0.5', label: 'overdamped', color: '#f59e0b' },
          ].map(({ sigma, Q, label, color }) => (
            <div key={sigma} style={{ padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, textAlign: 'center' }}>
              <div style={{ color, fontSize: 16, fontWeight: 700 }}>σ = {sigma}</div>
              <div style={{ color: '#94a3b8', fontSize: 11 }}>Q = {Q} ({label})</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#64748b', fontSize: 12, marginTop: 12 }}>
          The cascade of equal-Q oscillators produces a "filter bank" whose composite
          response is the zeta function. Although Q is prime-independent, each oscillator
          contributes a different characteristic impedance <InlineMath tex={"Z_0 = \\log p"} />,
          adding distinct spectral detail per prime.
        </p>

        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(15,23,42,0.6)', borderRadius: 8, border: `1px solid ${sliderColor}40` }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
            Interactive: drag <strong style={{ color: '#e2e8f0' }}>σ</strong> to explore the Q-factor regime
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#64748b', minWidth: 60 }}>σ = {sliderSigma.toFixed(2)}</span>
            <input
              type="range"
              min="0.05"
              max="1.5"
              step="0.01"
              value={sliderSigma}
              onChange={e => setSliderSigma(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: sliderColor }}
            />
            <span style={{ fontSize: 12, color: '#64748b', minWidth: 60, textAlign: 'right' }}>σ = 1.50</span>
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: sliderColor, minWidth: 90 }}>
              Q = {sliderQ.toFixed(3)}
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 4, background: `${sliderColor}22`, color: sliderColor, fontSize: 12, fontWeight: 600 }}>
              {sliderRegime}
            </div>
            {Math.abs(sliderSigma - 0.5) < 0.01 && (
              <div style={{ fontSize: 12, color: '#10b981', fontStyle: 'italic' }}>
                ← critical line: Q = 1 exactly
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/hamiltonian" style={{ color: '#3b82f6', fontSize: 13 }}>Hamiltonian (spectral decomposition)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/zeta" style={{ color: '#f59e0b', fontSize: 13 }}>Zeta Function</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/waves" style={{ color: '#ef4444', fontSize: 13 }}>Wave Simulation</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/fourier" style={{ color: '#8b5cf6', fontSize: 13 }}>Fourier (frequency analysis)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/modes" style={{ color: '#06b6d4', fontSize: 13 }}>Oscillator Modes</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/statistics" style={{ color: '#10b981', fontSize: 13 }}>Statistics (GUE connection)</Link>
        </div>
      </div>
    </div>
  );
}
