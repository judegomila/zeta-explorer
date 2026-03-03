import React from 'react';
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

      <BlockMath tex="\psi(x) = x - \sum_\rho \frac{x^\rho}{\rho} \quad \text{Each zero } \rho \text{ is a mode with frequency } \gamma \text{ and decay } \sigma" />

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Anatomy of a Mode</h3>
          <BlockMath tex="x^\rho = x^{\sigma + i\gamma} = x^\sigma \cdot e^{i\gamma\log x}" />
          <p style={{ marginTop: 8 }}>
            Each zeta zero <InlineMath tex="\rho = \sigma + i\gamma" /> contributes a <strong>damped
            oscillation</strong> to the prime counting function. The imaginary part <InlineMath tex="\gamma" /> sets
            the oscillation frequency in log-space, while the real part <InlineMath tex="\sigma" /> controls the
            amplitude envelope. Larger <InlineMath tex="\gamma" /> means faster oscillation; smaller <InlineMath tex="\sigma" /> means
            faster decay.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#a855f7' }}>Why <InlineMath tex="\sigma = 1/2" /> Matters</h3>
          <BlockMath tex="\text{RH} \iff \text{all modes decay as } x^{1/2}" />
          <p style={{ marginTop: 8 }}>
            If all zeros lie on the critical line (<InlineMath tex="\sigma = 1/2" />), every mode shares the
            same decay rate <InlineMath tex="x^{1/2}" />. No single oscillatory correction dominates —
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
            dispersion <InlineMath tex="\omega_p = \log p" /> that underlies the increasing density of zeta zeros.
          </li>
          <li>
            <strong style={{ color: '#8b5cf6' }}>Energy Landscape:</strong> switch metrics to
            see the energy valley along <InlineMath tex="\sigma = 1/2" />. The impedance mismatch metric
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
          frequency gap: <InlineMath tex="Y \\propto 1/(\\log p_{n+1} - \\log p_n)" />. Twin primes (red) create the strongest coupling.
          View the oscillator frequencies <InlineMath tex="\\omega_p = \\log(p)" /> or the raw prime gaps.
        </div>
        <PrimeGapCouplingViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#ef4444' }}>Twin Prime Resonances</h3>
          <BlockMath tex="Y_{n,n+1} \propto \frac{1}{\log(p_{n+1}/p_n)} \to \infty \text{ as gap} \to 0" />
          <p style={{ marginTop: 8 }}>
            Twin primes (gap = 2) create the strongest inter-stage coupling. The twin prime
            conjecture implies infinitely many strongly-coupled pairs in the chain. These
            act as "resonant cavities" that trap energy between the twin pair.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>Frequency Dispersion</h3>
          <BlockMath tex="\omega_p = \log p \Rightarrow \omega_{p_n} \sim \log(n\log n)" />
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
          The full energy landscape in the <InlineMath tex="(\\sigma, t)" /> plane. See the "valley" along <InlineMath tex="\\sigma = 1/2" /> where
          impedance mismatch vanishes. Switch between system energy, impedance mismatch,
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
    </div>
  );
}
