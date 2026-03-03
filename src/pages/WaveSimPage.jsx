import React from 'react';
import WaveSimViz from '../components/WaveSimViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function WaveSimPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Wave & Energy Flow Simulator</h1>
        <p>
          Visualize how energy and waves propagate through the prime oscillator ladder network.
          The key control is <InlineMath tex="\sigma = \operatorname{Re}(s)" />: at <InlineMath tex="\sigma = 0.5" /> the
          direct and dual ladders are impedance-matched, the bridge is lossless, and signals flow through
          without reflection. Move <InlineMath tex="\sigma" /> away from 0.5 to see energy reflecting off the
          bridge, waves decoherring, and delays becoming asymmetric.
        </p>
      </div>

      <BlockMath tex="\text{Bridge pressure: } P(\sigma, t) = \bigl(1 - |\chi(\sigma + it)|\bigr)^2 = 0 \iff \sigma = \tfrac{1}{2}" />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="\text{Conjugate match: } Z_{\text{dir}} = Z_{\text{dual}}^* \;\text{ at } \sigma = \tfrac{1}{2} \quad (\text{magnitudes equal, phases reflected})" />
      </div>

      <div style={{ marginTop: 32 }}>
        <WaveSimViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>What This Simulator Shows</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#3b82f6' }}>Signal Flow</strong> — animated energy pulses showing transmission vs reflection at the bridge.
          <strong style={{ color: '#f59e0b' }}> Per-Prime Waves</strong> — individual oscillator waveforms for direct and dual ladders side by side.
          <strong style={{ color: '#10b981' }}> Wave Interference</strong> — superposition of all prime oscillators showing constructive/destructive patterns.
          <strong style={{ color: '#06b6d4' }}> Phase & Delay</strong> — group delay per prime, showing symmetric timing at <InlineMath tex="\sigma = 0.5" />.
          <strong style={{ color: '#ec4899' }}> Component Diagram</strong> — circuit schematics at individual prime, ladder, and full system levels.
        </p>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Impedance Matching & Perfect Transmission</h3>
          <p style={{ marginBottom: 12 }}>
            In the oscillator model, each prime <InlineMath tex="p" /> contributes a stage with impedance
            that depends on <InlineMath tex="\sigma" />. The direct ladder sees <InlineMath tex="Z_p^{\text{dir}}(\sigma)" /> while the dual
            ladder sees <InlineMath tex="Z_p^{\text{dual}}(\sigma) = Z_p^{\text{dir}}(1-\sigma)" />.
          </p>
          <p style={{ marginBottom: 12 }}>
            At <InlineMath tex="\sigma = 1/2" />, the functional equation symmetry
            forces <InlineMath tex="Z^{\text{dir}} = (Z^{\text{dual}})^*" /> (conjugate match):
            magnitudes match but phases are reflected. Combined with the bridge
            losslessness (<InlineMath tex="|\chi| = 1" />), energy flows through without net loss:
          </p>
          <BlockMath tex="|Z^{\text{dir}}| = |Z^{\text{dual}}|, \quad |\chi(\tfrac{1}{2}+it)| = 1 \;\;\forall\, t" />
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
            This is the wave-propagation interpretation of RH: if all zeros sit on <InlineMath tex="\sigma = 1/2" />,
            the network transmits every frequency without loss. Move <InlineMath tex="\sigma" /> off 1/2 in the Signal Flow
            tab to watch energy reflect back from the bridge.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>What to Look For</h3>
          <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
            <li>
              <strong style={{ color: '#10b981' }}>At <InlineMath tex="\sigma = 0.5" />:</strong> direct and dual waveforms are mirror
              images, interference is constructive, group delays are symmetric across primes, and
              the bridge transmits 100%.
            </li>
            <li>
              <strong style={{ color: '#ef4444' }}>Away from 0.5:</strong> waveforms diverge in amplitude (one
              ladder gains energy, the other loses it), interference becomes irregular, group delays
              split apart, and reflected energy appears.
            </li>
            <li>
              <strong style={{ color: '#06b6d4' }}>Near a zero</strong> (<InlineMath tex="t \approx \gamma_n" />): the oscillator modes
              resonate — wave amplitudes peak, the scattering matrix exhibits phase jumps of <InlineMath tex="\pi" />,
              and the Per-Prime tab reveals which harmonics dominate.
            </li>
            <li>
              <strong style={{ color: '#8b5cf6' }}>More primes:</strong> adding oscillators sharpens the resonance
              peaks near zeros and makes the interference pattern converge toward the analytic
              Euler product.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
