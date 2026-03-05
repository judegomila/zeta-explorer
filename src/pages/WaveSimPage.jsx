import React from 'react';
import { Link } from 'react-router-dom';
import WaveSimViz from '../components/WaveSimViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function WaveSimPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Wave & Energy Flow Simulator</h1>
        <p>
          Visualize how energy and waves propagate through the prime oscillator ladder network.
          The key control is <InlineMath tex="\\sigma = \\operatorname{Re}(s)" />: at <InlineMath tex="\\sigma = 0.5" /> the
          direct and dual ladders are conjugate-matched, the bridge is lossless, and signals flow through
          with minimum reflection. Move <InlineMath tex="\\sigma" /> away from 0.5 to see energy reflecting off the
          bridge, waves decohering, and delays becoming asymmetric.
        </p>
      </div>

      <BlockMath tex="\\text{Bridge pressure: } P(\\sigma, t) = \\bigl(1 - |\\chi(\\sigma + it)|\\bigr)^2 = 0 \\iff \\sigma = \\tfrac{1}{2}" />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="\\text{Conjugate match: } Z_{\\text{dir}} = Z_{\\text{dual}}^* \\;\\text{ at } \\sigma = \\tfrac{1}{2} \\quad (\\text{magnitudes equal, phases reflected})" />
      </div>

      {/* Wave Physics in the ZPO Model */}
      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>Wave Physics in the ZPO Model</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 2.2 }}>
          <li>
            Each prime <InlineMath tex="p" /> creates a standing wave with wavelength{' '}
            <InlineMath tex="\\lambda_p = \\frac{2\\pi}{\\log p}" />.
          </li>
          <li>
            The superposition of all prime waves creates the zeta function's behavior:{' '}
            <InlineMath tex="\\zeta(s) = \\prod_p \\bigl(1 - p^{-s}\\bigr)^{-1}" />.
          </li>
          <li>
            At <InlineMath tex="\\sigma = 1/2" />, direct and reflected waves are in <strong>perfect balance</strong> (conjugate matching).
          </li>
          <li>
            Off the critical line, one direction dominates (impedance mismatch) — the reflected wave
            carries energy back toward the source.
          </li>
          <li>
            The transmission zeros (where <InlineMath tex="\\zeta(s) = 0" />) are the <strong>destructive interference points</strong> —
            all prime waves cancel exactly.
          </li>
        </ul>
        <BlockMath tex="\\zeta\\!\\left(\\tfrac{1}{2} + it\\right) = 0 \\;\\;\\Longleftrightarrow\\;\\; \\sum_p \\frac{\\sin\\bigl(t \\log p\\bigr)}{\\sqrt{p}} \\;\\text{ destructively interferes}" />
      </div>

      <div style={{ marginTop: 32 }}>
        <WaveSimViz />
      </div>

      {/* Phase Velocity and Group Delay */}
      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Phase Velocity and Group Delay</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 2.2 }}>
          <li>
            <strong>Phase velocity:</strong>{' '}
            <InlineMath tex="v_\\varphi = \\frac{\\omega}{k}" /> where <InlineMath tex="k = \\log p" /> for
            the <InlineMath tex="p" />-th oscillator.
          </li>
          <li>
            <strong>Group delay:</strong>{' '}
            <InlineMath tex="\\tau_g = -\\frac{d\\varphi}{d\\omega}" /> measures how long a signal spends at each frequency.
          </li>
          <li>
            At zeros of <InlineMath tex="\\zeta" />, the group delay <strong>diverges</strong> — the signal gets "trapped"
            at the resonant frequency.
          </li>
          <li>
            This connects to <strong>Fisher information</strong>: information about <InlineMath tex="\\sigma" /> diverges at zeros,
            making the critical line maximally detectable.
          </li>
        </ul>
        <BlockMath tex="\\tau_g(\\omega) = -\\frac{\\partial}{\\partial \\omega} \\arg H(j\\omega) \\;\\;\\xrightarrow{\\;\\omega \\to \\gamma_n\\;} \\;\\infty" />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}>What This Simulator Shows</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#3b82f6' }}>Signal Flow</strong> — animated energy pulses showing transmission vs reflection at the bridge.
          <strong style={{ color: '#f59e0b' }}> Per-Prime Waves</strong> — individual oscillator waveforms for direct and dual ladders side by side.
          <strong style={{ color: '#10b981' }}> Wave Interference</strong> — superposition of all prime oscillators showing constructive/destructive patterns.
          <strong style={{ color: '#06b6d4' }}> Phase & Delay</strong> — group delay per prime, showing symmetric timing at <InlineMath tex="\\sigma = 0.5" />.
          <strong style={{ color: '#ec4899' }}> Component Diagram</strong> — circuit schematics at individual prime, ladder, and full system levels.
        </p>
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Impedance Matching & Perfect Transmission</h3>
          <p style={{ marginBottom: 12 }}>
            In the oscillator model, each prime <InlineMath tex="p" /> contributes a stage with impedance
            that depends on <InlineMath tex="\\sigma" />. The direct ladder sees <InlineMath tex="Z_p^{\\text{dir}}(\\sigma)" /> while the dual
            ladder sees <InlineMath tex="Z_p^{\\text{dual}}(\\sigma) = Z_p^{\\text{dir}}(1-\\sigma)" />.
          </p>
          <p style={{ marginBottom: 12 }}>
            At <InlineMath tex="\\sigma = 1/2" />, the functional equation symmetry
            forces <InlineMath tex="Z^{\\text{dir}} = (Z^{\\text{dual}})^*" /> (conjugate match):
            magnitudes match but phases are reflected. Combined with the bridge
            losslessness (<InlineMath tex="|\\chi| = 1" />), energy flows through without net loss:
          </p>
          <BlockMath tex="|Z^{\\text{dir}}| = |Z^{\\text{dual}}|, \\quad |\\chi(\\tfrac{1}{2}+it)| = 1 \\;\\;\\forall\\, t" />
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
            This is the wave-propagation interpretation of RH: if all zeros sit on <InlineMath tex="\\sigma = 1/2" />,
            the network transmits every frequency without loss. Move <InlineMath tex="\\sigma" /> off 1/2 in the Signal Flow
            tab to watch energy reflect back from the bridge.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>What to Look For</h3>
          <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
            <li>
              <strong style={{ color: '#10b981' }}>At <InlineMath tex="\\sigma = 0.5" />:</strong> direct and dual waveforms are mirror
              images, interference is constructive, group delays are symmetric across primes, and
              the bridge transmits 100%.
            </li>
            <li>
              <strong style={{ color: '#ef4444' }}>Away from 0.5:</strong> waveforms diverge in amplitude (one
              ladder gains energy, the other loses it), interference becomes irregular, group delays
              split apart, and reflected energy appears.
            </li>
            <li>
              <strong style={{ color: '#06b6d4' }}>Near a zero</strong> (<InlineMath tex="t \\approx \\gamma_n" />): the oscillator modes
              resonate — wave amplitudes peak, the scattering matrix exhibits phase jumps of <InlineMath tex="\\pi" />,
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

      {/* Impedance Matching */}
      <div className="card" style={{ marginTop: 32, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>Impedance Matching</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 2.2 }}>
          <li>
            <strong>Characteristic impedance:</strong>{' '}
            <InlineMath tex="Z_0 = \\sqrt{L/C}" /> for each prime oscillator stage,
            where <InlineMath tex="L" /> and <InlineMath tex="C" /> encode the prime's contribution to the Euler product.
          </li>
          <li>
            At <InlineMath tex="\\sigma = 1/2" />: impedances of the direct and dual ladders are <strong>complex conjugates</strong>,{' '}
            <InlineMath tex="Z_{\\text{dir}} = Z_{\\text{dual}}^*" />.
          </li>
          <li>
            The <strong>maximum power transfer theorem</strong> applies: all energy passes through the bridge
            with zero reflection, analogous to perfect transmission line termination.
          </li>
          <li>
            This is the engineering interpretation of the functional equation symmetry{' '}
            <InlineMath tex="\\xi(s) = \\xi(1 - s)" />.
          </li>
        </ul>
        <BlockMath tex="\\Gamma = \\frac{Z_{\\text{dir}} - Z_{\\text{dual}}^*}{Z_{\\text{dir}} + Z_{\\text{dual}}^*} = 0 \\;\\;\\text{ at } \\sigma = \\tfrac{1}{2} \\quad \\Longrightarrow \\quad |T|^2 = 1 \\;\\text{ (perfect transmission)}" />
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/oscillators" style={{ color: '#3b82f6', fontSize: 13 }}>Prime Oscillators (per-stage view)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/fourier" style={{ color: '#8b5cf6', fontSize: 13 }}>Fourier (frequency response)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/control" style={{ color: '#ef4444', fontSize: 13 }}>Control Theory (scattering matrix)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#f97316', fontSize: 13 }}>Gap Closing (Darlington S7)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/twistor" style={{ color: '#ec4899', fontSize: 13 }}>Twistor (duality view)</Link>
        </div>
      </div>
    </div>
  );
}
