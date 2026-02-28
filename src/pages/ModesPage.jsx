import React from 'react';
import AnimatedModesViz from '../components/AnimatedModesViz.jsx';
import PrimeGapCouplingViz from '../components/PrimeGapCouplingViz.jsx';
import EnergyLandscapeViz from '../components/EnergyLandscapeViz.jsx';
import ExplorationGraphViz from '../components/ExplorationGraphViz.jsx';
import { BlockMath } from '../components/KaTeXMath.jsx';

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
          frequency gap: Y ∝ 1/(log p_{'{n+1}'} - log p_n). Twin primes (red) create the strongest coupling.
          View the oscillator frequencies ω_p = log(p) or the raw prime gaps.
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
          The full energy landscape in the (σ, t) plane. See the "valley" along σ = 1/2 where
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
