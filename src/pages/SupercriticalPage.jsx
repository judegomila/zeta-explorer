import React from 'react';
import SupercriticalViz from '../components/SupercriticalViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function SupercriticalPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Supercritical Phase Explorer</h1>
        <p>
          Push the zeta function beyond the critical strip into the supercritical regime (<InlineMath tex="\sigma > 1" />)
          and below zero (<InlineMath tex="\sigma < 0" />). Using Tao's thermodynamic framework, <InlineMath tex="\sigma" /> acts as inverse
          temperature: the Bost-Connes phase transition at <InlineMath tex="\sigma = 1" /> separates the convergent "gas phase"
          from the interacting "condensed phase" of the critical strip. The critical line <InlineMath tex="\sigma = 1/2" />
          is the equilibrium point.
        </p>
      </div>

      <BlockMath tex="\\zeta(\\beta) = \\sum_{n=1}^{\\infty} e^{-\\beta \\log n} = \\prod_p \\frac{1}{1 - e^{-\\beta\\log p}} \\qquad \\beta = \\sigma \\;\\text{(inverse temperature)}" />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="F = -T\\log\\zeta(\\beta), \\quad S = -\\frac{\\partial F}{\\partial T}, \\quad P = \\frac{1}{N}\\sum_p \\log\\frac{1}{|1-p^{-s}|}" />
      </div>

      <div style={{ marginTop: 32 }}>
        <SupercriticalViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>What to Explore in Each Tab</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#3b82f6' }}>Extended Landscape</strong> plots <InlineMath tex="|\zeta(\sigma+it)|" /> over the
          full <InlineMath tex="\sigma" /> range, including the supercritical region. Look for the pole at <InlineMath tex="\sigma = 1" /> and the
          functional equation symmetry reflecting the plot about <InlineMath tex="\sigma = 1/2" />.
          <strong style={{ color: '#10b981' }}> Thermodynamics</strong> shows the free energy, entropy, specific heat,
          and pressure as functions of <InlineMath tex="\sigma" />. Watch for the divergence at the Bost-Connes transition
          <InlineMath tex="\sigma = 1" /> and the sign change in entropy near the critical line.
          <strong style={{ color: '#f59e0b' }}> Heat Flow</strong> evolves the Xi function under the heat equation,
          animating how zeros migrate as <InlineMath tex="\tau" /> varies. At <InlineMath tex="\tau = 0" /> zeros sit on the real axis
          (assuming RH); negative <InlineMath tex="\tau" /> (backward heat) scatters them into the complex plane, while
          positive <InlineMath tex="\tau" /> smooths the function and preserves real zeros.
          <strong style={{ color: '#ef4444' }}> Euler Product Phase</strong> decomposes the phase of <InlineMath tex="\zeta" /> into
          individual prime contributions. Look for how phase cancellation between primes sharpens near zeros,
          and how the distribution changes across the <InlineMath tex="\sigma = 1" /> boundary.
        </p>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Free Energy & Entropy</h3>
          <BlockMath tex="F(\beta) = -T\log|\zeta(\beta + it)|, \quad S = -\frac{\partial F}{\partial T} = \beta^2 \frac{\partial}{\partial \beta}\log|\zeta|" />
          <p style={{ marginTop: 8 }}>
            <strong style={{ color: '#3b82f6' }}>Free energy</strong> <InlineMath tex="F" /> is the thermodynamic
            potential — it diverges at the pole <InlineMath tex="\sigma = 1" /> (the phase transition) and is smooth
            elsewhere. <strong style={{ color: '#8b5cf6' }}>Entropy</strong> <InlineMath tex="S" /> measures
            the disorder of prime occupancy states. It changes sign near
            the critical line: positive for <InlineMath tex="\sigma < 1" /> (hot, disordered)
            and negative for <InlineMath tex="\sigma > 1" /> (cold, ordered). The sign change marks the crossover
            from collective to independent prime behavior.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Specific Heat & Pressure</h3>
          <BlockMath tex="C_v = \beta^2\frac{\partial^2 \log|\zeta|}{\partial \beta^2}, \quad P = \frac{1}{N}\sum_p \log\frac{1}{|1-p^{-s}|}" />
          <p style={{ marginTop: 8 }}>
            <strong style={{ color: '#10b981' }}>Specific heat</strong> <InlineMath tex="C_v" /> measures the
            system's response to temperature changes — it spikes sharply at the phase
            transition <InlineMath tex="\sigma = 1" />, signaling critical fluctuations. A second, subtler
            feature near <InlineMath tex="\sigma = 1/2" /> reflects the oscillator chain's resonance structure.{' '}
            <strong style={{ color: '#f59e0b' }}>Pressure</strong> <InlineMath tex="P" /> is the average
            per-prime contribution to <InlineMath tex="\log|\zeta|" />, finite in the gas
            phase (<InlineMath tex="\sigma > 1" />) and divergent at the transition.
          </p>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Bost-Connes Phase Transition (<InlineMath tex="\sigma = 1" />)</h3>
          <BlockMath tex="\\beta_c = 1: \\quad \\text{symmetry breaking, multiple KMS states} \\;(\\beta > 1) \\;\\leftrightarrow\\; \\text{unique KMS state} \\;(\\beta \\leq 1)" />
          <p style={{ marginTop: 8 }}>
            Above <InlineMath tex="\sigma = 1" /> (cold/supercritical), the Euler product converges absolutely but symmetry
            is spontaneously broken — the system selects a preferred KMS state among many, labelled by
            embeddings of <InlineMath tex="\mathbb{Q}^{\text{ab}}" /> into <InlineMath tex="\mathbb{C}" />. Below <InlineMath tex="\sigma = 1" /> (hot), symmetry is
            restored and the KMS state is unique — primes interact collectively in a "disordered phase."
            The critical strip <InlineMath tex="0 < \sigma < 1" /> is where all the interesting physics happens.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>De Bruijn-Newman Heat Flow</h3>
          <BlockMath tex="\\frac{\\partial H_\\tau}{\\partial \\tau} = \\frac{\\partial^2 H_\\tau}{\\partial t^2}, \\qquad \\Lambda \\geq 0 \\;\\text{(Rodgers-Tao 2020)}" />
          <p style={{ marginTop: 8 }}>
            The xi function evolves under the heat equation. At <InlineMath tex="\tau = 0" /> (no heating), RH says
            all zeros are on the real line. Forward heat flow (<InlineMath tex="\tau > 0" />) smooths the function and
            preserves real zeros; backward flow (<InlineMath tex="\tau < 0" />) scatters zeros off the real axis.
            Rodgers-Tao proved <InlineMath tex="\Lambda \geq 0" />: the system is already at the critical
            threshold — any backward perturbation destroys real zeros.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>The Primon Gas: Pressure Interpretation</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          In the primon gas model (Julia 1990), each prime p is a quantum particle with energy
          <InlineMath tex="\log(p)" />. The Euler product decomposes <InlineMath tex="\zeta(\beta)" /> into independent "prime partition functions."
          <strong style={{ color: '#f59e0b' }}> Pressure </strong> measures the average contribution per prime
          oscillator to the total log-partition function. In the supercritical phase, pressure is
          finite and decreases as <InlineMath tex="\sigma" /> increases (colder = less pressure). At the phase transition
          <InlineMath tex="\sigma = 1" />, pressure diverges. In the critical strip, the effective pressure is determined by
          the interplay between direct and dual ladders, achieving its equilibrium value at <InlineMath tex="\sigma = 1/2" />.
        </p>
      </div>
    </div>
  );
}
