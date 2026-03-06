import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedModesViz from '../components/AnimatedModesViz.jsx';
import PrimeGapCouplingViz from '../components/PrimeGapCouplingViz.jsx';
import EnergyLandscapeViz from '../components/EnergyLandscapeViz.jsx';
import ExplorationGraphViz from '../components/ExplorationGraphViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function ModesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Oscillator Modes & Structure</h1>
        <p>
          Deep exploration of the oscillator chain's internal structure: animated mode evolution,
          prime gap coupling patterns, the 2D energy landscape, and the exploration dependency graph.
        </p>
      </div>

      <BlockMath tex={"\\psi(x) = x - \\sum_\\rho \\frac{x^\\rho}{\\rho} \\quad \\text{Each zero } \\rho \\text{ is a mode with frequency } \\gamma \\text{ and decay } \\sigma"} />

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Anatomy of a Mode</h3>
          <BlockMath tex={"x^\\rho = x^{\\sigma + i\\gamma} = x^\\sigma \\cdot e^{i\\gamma\\log x}"} />
          <p style={{ marginTop: 8 }}>
            Each zeta zero <InlineMath tex={"\\rho = \\sigma + i\\gamma"} /> contributes a <strong>damped
            oscillation</strong> to the prime counting function. The imaginary part <InlineMath tex={"\\gamma"} /> sets
            the oscillation frequency in log-space, while the real part <InlineMath tex={"\\sigma"} /> controls the
            amplitude envelope. Larger <InlineMath tex={"\\gamma"} /> means faster oscillation; smaller <InlineMath tex={"\\sigma"} /> means
            faster decay.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#a855f7' }}>Why <InlineMath tex={"\\sigma = 1/2"} /> Matters</h3>
          <BlockMath tex={"\\text{RH} \\iff \\text{all modes decay as } x^{1/2}"} />
          <p style={{ marginTop: 8 }}>
            If all zeros lie on the critical line (<InlineMath tex={"\\sigma = 1/2"} />), every mode shares the
            same decay rate <InlineMath tex={"x^{1/2}"} />. No single oscillatory correction dominates —
            the energy is distributed <strong>equally</strong> across all modes. A zero
            off the line would decay at a different rate, breaking this equipartition
            and causing larger deviations in the prime counting function.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>What to Explore in Each Visualization</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#3b82f6' }}>Animated Modes:</strong> select different zeta
            zeros and watch how the excitation pattern across primes changes. Some primes get
            phase-flipped (negative amplitude) depending on the zero — the superposition row at
            the bottom shows constructive/destructive interference building the prime counting correction.
          </li>
          <li>
            <strong style={{ color: '#f59e0b' }}>Prime Gap Coupling:</strong> switch between
            coupling strength, raw gaps, and oscillator frequencies. Look for twin primes (red bars)
            creating the strongest coupling spikes. The frequency view shows the logarithmic
            dispersion <InlineMath tex={"\\omega_p = \\log p"} /> that underlies the increasing density of zeta zeros.
          </li>
          <li>
            <strong style={{ color: '#8b5cf6' }}>Energy Landscape:</strong> switch metrics to
            see the energy valley along <InlineMath tex={"\\sigma = 1/2"} />. The impedance mismatch metric
            makes the critical line most visible. Hover to read exact values. White circles mark
            known zeros — check that they sit in the valley floor.
          </li>
          <li>
            <strong style={{ color: '#06b6d4' }}>Exploration Graph:</strong> drag nodes to
            rearrange the dependency network. Click nodes to see exploration details. Follow
            colored links to trace reasoning chains from foundational concepts to advanced results.
          </li>
        </ul>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="viz-title">Animated Oscillator Modes</div>
        <div className="viz-subtitle">
          Watch each prime oscillator vibrate at a zeta zero frequency. Each row shows one prime's
          contribution. The bottom row shows the superposition of all modes — the pattern that
          builds up the prime counting function.
        </div>
        <AnimatedModesViz />
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="viz-title">Prime Gap Coupling Structure</div>
        <div className="viz-subtitle">
          The coupling strength between adjacent oscillator stages is inversely proportional to the
          frequency gap: <InlineMath tex={"Y \\propto 1/(\\log p_{n+1} - \\log p_n)"} />. Twin primes (red) create the strongest coupling.
          View the oscillator frequencies <InlineMath tex={"\\omega_p = \\log(p)"} /> or the raw prime gaps.
        </div>
        <PrimeGapCouplingViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#ef4444' }}>Twin Prime Resonances</h3>
          <BlockMath tex={"Y_{n,n+1} \\propto \\frac{1}{\\log(p_{n+1}/p_n)} \\to \\infty \\text{ as gap} \\to 0"} />
          <p style={{ marginTop: 8 }}>
            Twin primes (gap = 2) create the strongest inter-stage coupling. The twin prime
            conjecture implies infinitely many strongly-coupled pairs in the chain. These
            act as "resonant cavities" that trap energy between the twin pair.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>Frequency Dispersion</h3>
          <BlockMath tex={"\\omega_p = \\log p \\Rightarrow \\omega_{p_n} \\sim \\log(n\\log n)"} />
          <p style={{ marginTop: 8 }}>
            The oscillator frequencies grow logarithmically — this is a **logarithmic dispersion
            relation**. Unlike a uniform lattice (linear dispersion), the mode spacing decreases
            at higher frequencies, leading to the increasing density of zeta zeros.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="viz-title">2D Energy Landscape</div>
        <div className="viz-subtitle">
          The full energy landscape in the <InlineMath tex={"(\\sigma, t)"} /> plane. See the "valley" along <InlineMath tex={"\\sigma = 1/2"} /> where
          impedance mismatch is minimized (conjugate-matched, not zero). Switch between system energy, impedance mismatch,
          and individual ladder magnitudes. White circles mark known zeta zeros.
        </div>
        <EnergyLandscapeViz />
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="viz-title">Exploration Dependency Graph</div>
        <div className="viz-subtitle">
          The network of mathematical explorations and how they connect. Drag nodes to rearrange.
          Colors indicate category, numbers show exploration depth. Click a node for details.
        </div>
        <ExplorationGraphViz />
      </div>

      {/* Mode Coupling and the Explicit Formula */}
      <div className="card" style={{ marginTop: 48, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>Mode Coupling and the Explicit Formula</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The oscillator mode decomposition is not merely an analogy — it <em>is</em> the Weil explicit
          formula rewritten in physical language. Each nontrivial zero <InlineMath tex={"\\rho_n = \\tfrac{1}{2} + i\\gamma_n"} /> contributes
          a resonance mode to the prime counting function with amplitude <InlineMath tex={"1/|\\rho_n|"} /> and
          frequency <InlineMath tex={"\\gamma_n"} />. The contribution of mode <InlineMath tex={"n"} /> to <InlineMath tex={"\\psi(x)"} /> is
          precisely <InlineMath tex={"x^{\\rho_n}/\\rho_n"} />, a damped oscillation in log-space whose envelope
          decays as <InlineMath tex={"x^{\\sigma}"} /> and whose phase advances at rate <InlineMath tex={"\\gamma_n \\log x"} />.
        </p>
        <BlockMath tex={"\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} + O(1)"} />
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The total mode response — the superposition of all oscillator outputs — reconstructs
          the Chebyshev function <InlineMath tex={"\\psi(x)"} /> exactly. Each mode is a resonance with
          quality factor <InlineMath tex={"Q_n = \\gamma_n / (2\\sigma)"} />, and the sum over all modes is
          the explicit formula. The oscillator chain does not approximate the explicit formula;
          it <strong>implements</strong> it.
        </p>
      </div>

      {/* Why Critical Coupling Matters */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 8 }}>Why Critical Coupling Matters</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The quality factor of each mode is <InlineMath tex={"Q = 1/(2\\sigma)"} />. At the critical
          line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, every mode has <InlineMath tex={"Q = 1"} /> — this
          is <strong>critical coupling</strong>, the unique point where the system is neither
          over-coupled nor under-coupled.
        </p>
        <BlockMath tex={"Q = \\frac{1}{2\\sigma} \\quad \\Longrightarrow \\quad \\sigma = \\tfrac{1}{2} \\iff Q = 1 \\text{ for all modes}"} />
        <div className="two-col" style={{ marginTop: 12 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#ef4444' }}>Over-coupled (<InlineMath tex={"Q > 1, \\; \\sigma < \\tfrac{1}{2}"} />):</strong>{' '}
              modes ring too long. Energy builds up in each resonance, causing the prime counting
              correction to overshoot. The system stores more energy than it dissipates per cycle,
              leading to unphysical amplification of high-frequency oscillations.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#06b6d4' }}>Under-coupled (<InlineMath tex={"Q < 1, \\; \\sigma > \\tfrac{1}{2}"} />):</strong>{' '}
              modes die too fast. Information about the prime distribution is lost as each oscillation
              is damped before completing a full cycle. The system dissipates more energy than it stores,
              smearing out the fine structure of the primes.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Critical coupling (<InlineMath tex={"Q = 1"} />) achieves the unique balance: <strong>minimum
          bandwidth times maximum peak response</strong>. This is the electrical engineer's formulation
          of RH — all resonances are critically coupled, and the prime counting function is reconstructed
          with optimal fidelity.
        </p>
      </div>

      {/* Scattering Modes and the S-Matrix */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8 }}>Scattering Modes and the S-Matrix</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The S-matrix <InlineMath tex={"S(s)"} /> relates incoming and outgoing waves at the twin-ladder ports.
          For a 2-port network, the scattering matrix takes the form:
        </p>
        <BlockMath tex={"S = \\begin{bmatrix} S_{11} & S_{12} \\\\ S_{21} & S_{22} \\end{bmatrix}"} />
        <div className="two-col" style={{ marginTop: 12 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#a855f7' }}>Transmission:</strong>{' '}
              <InlineMath tex={"S_{21}(s)"} /> is the transmission coefficient, proportional to the
              zeta function: <InlineMath tex={"S_{21}(s) \\propto \\zeta(s)"} />. Signal passing through the
              network encodes the zeros of zeta as transmission nulls.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#06b6d4' }}>Reflection:</strong>{' '}
              <InlineMath tex={"S_{11}(s)"} /> is the reflection coefficient, satisfying{' '}
              <InlineMath tex={"S_{11}(s) \\propto 1 - |\\chi(s)|^2"} />. Energy not transmitted is reflected
              back into the input port.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          At <InlineMath tex={"\\sigma = 1/2"} />, the network is <strong>lossless</strong> — unitarity holds
          and all energy is conserved: <InlineMath tex={"|S_{21}|^2 + |S_{11}|^2 = 1"} />. Off the critical
          line, unitarity is violated — the network exhibits gain or loss, meaning energy is created
          or destroyed.
        </p>
        <BlockMath tex={"|S(\\sigma + it)|^2 = I \\;\\text{(identity matrix)} \\iff \\sigma = \\tfrac{1}{2}"} />
      </div>

      {/* Angular Momentum and Topological Protection */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 8 }}>Angular Momentum and Topological Protection</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The angular momentum quantum number <InlineMath tex={"m"} /> labels how many times the phase winds
          around the origin. For the bridge function <InlineMath tex={"\\chi(s)"} />, the winding number equals
          the number of zeros of <InlineMath tex={"\\zeta"} /> with <InlineMath tex={"\\text{Im}(\\rho) < t"} />.
          This is a direct consequence of the <strong>argument principle</strong>:
        </p>
        <BlockMath tex={"\\text{winding number} = \\frac{1}{2\\pi} \\Delta \\arg \\zeta\\!\\left(\\tfrac{1}{2} + it\\right)"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The Selberg <InlineMath tex={"S(T)"} /> function captures the fluctuation of the argument:
        </p>
        <BlockMath tex={"S(T) = \\frac{1}{\\pi} \\arg \\zeta\\!\\left(\\tfrac{1}{2} + iT\\right)"} />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          <strong style={{ color: '#f59e0b' }}>Topological protection:</strong> because the winding number is
          an <em>integer</em>, zeros cannot "slide off" the critical line continuously — they
          are <strong>topologically pinned</strong>. Any continuous deformation of the network that preserves
          the winding invariant must keep zeros on <InlineMath tex={"\\sigma = 1/2"} />.
        </p>
        <BlockMath tex={"N(T) = \\frac{T}{2\\pi}\\log\\!\\left(\\frac{T}{2\\pi e}\\right) + \\frac{7}{8} + S(T) + O\\!\\left(\\frac{1}{T}\\right)"} />
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/hamiltonian" style={{ color: '#3b82f6', fontSize: 13 }}>Hamiltonian (spectral decomposition)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/simulator" style={{ color: '#f59e0b', fontSize: 13 }}>Simulator (gradient descent)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/fourier" style={{ color: '#8b5cf6', fontSize: 13 }}>Fourier (frequency analysis)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/oscillators" style={{ color: '#10b981', fontSize: 13 }}>Prime Oscillators</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/control" style={{ color: '#06b6d4', fontSize: 13 }}>Control Theory (Q-factor)</Link>
        </div>
      </div>
    </div>
  );
}
