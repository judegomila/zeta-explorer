import React from 'react';
import TwinOscillatorSimViz from '../components/TwinOscillatorSimViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function SimulatorPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Twin Oscillator Simulator</h1>
        <p>
          Interactive exploration of the system Hamiltonian minimization at <InlineMath tex="\sigma = 1/2" />.
          In the model, the energy ground state sits on the critical line because direct and dual
          ladders are conjugate-matched and the bridge scattering matrix is unitary — a property that
          follows from the functional equation, not a proof of RH.
        </p>
      </div>

      <BlockMath tex="\\mathcal{H}(\\sigma, t) = \\sum_p \\tfrac{1}{2}\\log p\\bigl(|H_p(s)|^2 + |H_p(1\\!-\\!s)|^2\\bigr) + \\tfrac{1}{2}|Z_{\\text{dir}} - Z_{\\text{dual}}|^2 + 100\\,(1 - |\\chi(s)|)^2" />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex="\\text{Claim: } \\underset{\\sigma}{\\arg\\min}\\;\\mathcal{H}(\\sigma + it) = \\tfrac{1}{2} \\quad \\forall\\; t = \\gamma_n" />
      </div>

      <div style={{ marginTop: 32 }}>
        <TwinOscillatorSimViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>What This Simulator Tests</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Each tab probes a different aspect of the Hamiltonian minimization claim.
          <strong style={{ color: '#3b82f6' }}> Per-Prime Energy </strong> shows individual oscillator contributions.
          <strong style={{ color: '#f59e0b' }}> Gradient Descent </strong> animates convergence to <InlineMath tex="\sigma = 1/2" />.
          <strong style={{ color: '#8b5cf6' }}> Convergence </strong> shows the valley sharpening with more primes.
          <strong style={{ color: '#06b6d4' }}> Bridge Unitarity </strong> verifies <InlineMath tex="|\\chi(s)| = 1" /> on the critical line.
          <strong style={{ color: '#ec4899' }}> Multi-Zero Test </strong> runs systematic verification across zeta zeros.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#3b82f6' }}>Anatomy of the Hamiltonian</h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
          The system Hamiltonian has three terms, each enforcing a different physical requirement
          for the energy ground state to sit on the critical line.
        </p>
        <div className="two-col" style={{ marginTop: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#3b82f6' }}>Oscillator energy</strong>{' '}
              <InlineMath tex="\sum_p \tfrac{1}{2}\log p\,(|H_p(s)|^2 + |H_p(1-s)|^2)" />:
              each prime <InlineMath tex="p" /> contributes a pair of oscillators (direct and dual ladder stages).
              The weight <InlineMath tex="\log p" /> is the characteristic impedance of the <InlineMath tex="p" />-stage (with <InlineMath tex="L_p = \log p, C_p = 1/\log p" />, giving LC resonant frequency <InlineMath tex="\omega_0 = 1" /> for all primes).
              At <InlineMath tex="\sigma = 1/2" /> the two stages are mirror images, and
              their combined energy is minimized by symmetry.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>Impedance mismatch</strong>{' '}
              <InlineMath tex="\tfrac{1}{2}|Z_{\text{dir}} - Z_{\text{dual}}|^2" />:
              penalizes the difference between the direct and dual ladder impedances.
              Conjugate matching (<InlineMath tex="Z_{\text{dir}} = Z_{\text{dual}}^*" />) occurs
              at <InlineMath tex="\sigma = 1/2" />, where the functional equation guarantees
              <InlineMath tex="Z_{\text{dual}} = \overline{Z_{\text{dir}}}" /> (equal magnitudes, opposite imaginary parts).
              The mismatch <InlineMath tex="|Z_{\text{dir}} - Z_{\text{dual}}| = 2|\mathrm{Im}\,Z|" /> is minimized but not zero. This term drives the energy valley toward the critical line.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: '#8b5cf6' }}>Bridge unitarity penalty</strong>{' '}
          <InlineMath tex="100\,(1 - |\chi(s)|)^2" />:
          enforces that the bridge scattering matrix is lossless. The completed zeta function satisfies{' '}
          <InlineMath tex="|\chi(\tfrac{1}{2}+it)| = 1" /> exactly on the critical line (a consequence of
          the functional equation <InlineMath tex="\xi(s) = \xi(1-s)" />). Off the critical line,{' '}
          <InlineMath tex="|\chi| \neq 1" />, so this large penalty pushes the minimum to <InlineMath tex="\sigma = 1/2" />.
          The factor of 100 ensures the constraint dominates.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>Important Caveat</h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
          This Hamiltonian is an <em>engineered</em> energy functional whose minimum is placed
          at <InlineMath tex="\sigma = 1/2" /> by construction — it is <strong>not</strong> a proof
          of the Riemann Hypothesis. The three penalty terms encode known consequences of the functional
          equation (<InlineMath tex="|\chi| = 1" /> on the critical line, conjugate matching at <InlineMath tex="\sigma = 1/2" />),
          so the minimum at <InlineMath tex="\sigma = 1/2" /> follows from input assumptions, not from
          new mathematics. The simulator is a pedagogical tool for visualizing <em>why</em> these
          symmetry properties conspire to single out the critical line.
        </p>
      </div>
    </div>
  );
}
