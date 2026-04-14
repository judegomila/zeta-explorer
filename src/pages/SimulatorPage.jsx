import React from 'react';
import { Link } from 'react-router-dom';
import TwinOscillatorSimViz from '../components/TwinOscillatorSimViz.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function SimulatorPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Twin Oscillator Simulator</h1>
        <p>
          Interactive exploration of the system Hamiltonian minimization at <InlineMath tex={"\\sigma = 1/2"} />.
          In the model, the energy ground state sits on the critical line because direct and dual
          ladders are conjugate-matched and the bridge scattering matrix is unitary — a property that
          follows from the functional equation, not a proof of RH.
        </p>
      </div>

      <BlockMath tex={"\\mathcal{H}(\\sigma, t) = \\sum_p \\tfrac{1}{2}\\log p\\bigl(|H_p(s)|^2 + |H_p(1\\!-\\!s)|^2\\bigr) + \\tfrac{1}{2}|Z_{\\text{dir}} - Z_{\\text{dual}}|^2 + 100\\,(1 - |\\chi(s)|)^2"} />

      <div style={{ marginTop: 8 }}>
        <BlockMath tex={"\\text{Claim: } \\underset{\\sigma}{\\arg\\min}\\;\\mathcal{H}(\\sigma + it) = \\tfrac{1}{2} \\quad \\forall\\; t = \\gamma_n"} />
      </div>

      <div style={{ marginTop: 32 }}>
        <ErrorBoundary
          title="Simulator Error"
          message="The Twin Oscillator Simulator encountered an error. This can happen with certain parameter combinations. Try reloading or adjusting the inputs."
        >
          <TwinOscillatorSimViz />
        </ErrorBoundary>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>What This Simulator Tests</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Each tab probes a different aspect of the Hamiltonian minimization claim.
          <strong style={{ color: '#3b82f6' }}> Per-Prime Energy </strong> shows individual oscillator contributions.
          <strong style={{ color: '#f59e0b' }}> Gradient Descent </strong> animates convergence to <InlineMath tex={"\\sigma = 1/2"} />.
          <strong style={{ color: '#8b5cf6' }}> Convergence </strong> shows the valley sharpening with more primes.
          <strong style={{ color: '#06b6d4' }}> Bridge Unitarity </strong> verifies <InlineMath tex={"|\\chi(s)| = 1"} /> on the critical line.
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
              <strong style={{ color: '#3b82f6' }}>Oscillator energy:</strong>
            </p>
            <BlockMath tex={"T = \\sum_p \\tfrac{1}{2}\\log p\\,\\bigl(|H_p(s)|^2 + |H_p(1-s)|^2\\bigr)"} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Each prime <InlineMath tex={"p"} /> contributes a pair of oscillators (direct and dual).
              The weight <InlineMath tex={"\\log p"} /> is the characteristic impedance.
              At <InlineMath tex={"\\sigma = 1/2"} /> the two stages are mirror images, and
              their combined energy is minimized by symmetry.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>Impedance mismatch</strong>{' '}
              <InlineMath tex={"\\tfrac{1}{2}|Z_{\\text{dir}} - Z_{\\text{dual}}|^2"} />:
              penalizes the difference between the direct and dual ladder impedances.
              Conjugate matching (<InlineMath tex={"Z_{\\text{dir}} = Z_{\\text{dual}}^*"} />) occurs
              at <InlineMath tex={"\\sigma = 1/2"} />, where the functional equation guarantees
              <InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> (equal magnitudes, opposite imaginary parts).
              The mismatch <InlineMath tex={"|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\mathrm{Im}\\,Z|"} /> is minimized but not zero. This term drives the energy valley toward the critical line.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: '#8b5cf6' }}>Bridge unitarity penalty</strong>{' '}
          <InlineMath tex={"100\\,(1 - |\\chi(s)|)^2"} />:
          enforces that the bridge scattering matrix is lossless. The completed zeta function satisfies{' '}
          <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> exactly on the critical line (a consequence of
          the functional equation <InlineMath tex={"\\xi(s) = \\xi(1-s)"} />). Off the critical line,{' '}
          <InlineMath tex={"|\\chi| \\neq 1"} />, so this large penalty pushes the minimum to <InlineMath tex={"\\sigma = 1/2"} />.
          The factor of 100 ensures the constraint dominates.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>Important Caveat</h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
          This Hamiltonian is an <em>engineered</em> energy functional whose minimum is placed
          at <InlineMath tex={"\\sigma = 1/2"} /> by construction — it is <strong>not</strong> a proof
          of the Riemann Hypothesis. The three penalty terms encode known consequences of the functional
          equation (<InlineMath tex={"|\\chi| = 1"} /> on the critical line, conjugate matching at <InlineMath tex={"\\sigma = 1/2"} />),
          so the minimum at <InlineMath tex={"\\sigma = 1/2"} /> follows from input assumptions, not from
          new mathematics. The simulator is a pedagogical tool for visualizing <em>why</em> these
          symmetry properties conspire to single out the critical line.
        </p>
      </div>

      {/* Gradient Descent and Weil Extremization */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8 }}>Gradient Descent and Weil Extremization</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The simulator's gradient descent on <InlineMath tex={"\\mathcal{H}(\\sigma, t)"} /> is a discrete,
          computational analog of Connes' Weil form extremization. Both methods share the same
          structure: start from an initial guess for <InlineMath tex={"\\sigma"} />, optimize a quadratic-like
          functional, and converge to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
        </p>
        <BlockMath tex={"\\frac{\\partial \\mathcal{H}}{\\partial \\sigma}\\bigg|_{\\sigma = 1/2} = 0 \\quad \\longleftrightarrow \\quad \\delta W(g \\star \\tilde{g})\\big|_{\\text{extremum}} = 0"} />
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The key difference is scope: the Hamiltonian <InlineMath tex={"\\mathcal{H}"} /> uses a <em>finite</em> set
          of primes (adjustable via the "number of primes" slider), while the Weil quadratic form
          uses the full explicit formula kernel summing over all primes. As the number of primes
          increases in the simulator, the gradient <InlineMath tex={"\\partial \\mathcal{H}/\\partial \\sigma|_{\\sigma=1/2} = 0"} /> mirrors
          the Weil form stationarity condition with increasing fidelity. The convergence tab shows
          this sharpening directly — more primes means a deeper, narrower valley at the critical line.
        </p>
      </div>

      {/* Convergence Analysis */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 14, marginBottom: 8 }}>Convergence Analysis: What It Proves and What It Doesn't</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The gradient descent reliably converges to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for every
          zeta zero tested. This demonstrates that the Hamiltonian is <strong>designed correctly</strong> —
          its minimum sits on the critical line, as intended by construction.
        </p>
        <BlockMath tex={"\\underset{\\sigma}{\\arg\\min}\\;\\mathcal{H}(\\sigma + i\\gamma_n) = \\tfrac{1}{2} \\quad \\text{(by construction, not by proof)}"} />
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          However, convergence of gradient descent to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> does <strong>not</strong> prove
          the Riemann Hypothesis. The three penalty terms in <InlineMath tex={"\\mathcal{H}"} /> encode known
          consequences of the functional equation, so the minimum at the critical line follows from
          input assumptions. The real open question (<strong>Gap S5</strong>) is whether there exists
          a <em>quantum</em> operator — a self-adjoint operator on a Hilbert space — whose eigenvalues
          are precisely the nontrivial zeta zeros. The distinction is fundamental:
        </p>
        <div className="two-col" style={{ marginTop: 12 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>Classical minimum (what we have):</strong>{' '}
              an engineered energy functional <InlineMath tex={"\\mathcal{H}"} /> with a minimum at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> by
              design. The gradient descent confirms the engineering is correct but reveals no new
              information about the zeros themselves.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: '#8b5cf6' }}>Quantum spectrum (what we need):</strong>{' '}
              a self-adjoint operator <InlineMath tex={"\\hat{H}"} /> whose spectrum <InlineMath tex={"\\{\\gamma_n\\}"} /> matches
              the zeta zeros. If such an operator exists, its self-adjointness would <em>force</em> all
              eigenvalues to be real, implying <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for all zeros — and RH would follow.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #06b6d4' }}>
        <h3 style={{ color: '#06b6d4', fontSize: 14 }}>Convergence Diagnostics</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
          The gradient descent reveals important structure about the energy landscape:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ color: '#10b981', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Convergence Rate</div>
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6 }}>
              Near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, the descent converges
              exponentially: <InlineMath tex={"\\sigma_k \\to \\tfrac{1}{2}"} /> as <InlineMath tex={"O(e^{-\\alpha k})"} /> where <InlineMath tex={"\\alpha > 0"} /> depends
              on the spectral gap of the Hessian.
            </p>
          </div>
          <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.06)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Basin of Attraction</div>
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6 }}>
              Every starting point in the critical strip converges
              to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />. No local minima exist — the potential is
              convex along the <InlineMath tex={"\\sigma"} /> axis.
            </p>
          </div>
          <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Prime Sensitivity</div>
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6 }}>
              Adding more primes sharpens the minimum. With N primes, the
              curvature grows as:
            </p>
            <BlockMath tex={"\\frac{\\partial^2 \\mathcal{H}}{\\partial\\sigma^2} \\sim \\sum_{p \\leq p_N} \\frac{(\\log p)^2}{p}"} />
          </div>
        </div>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/oscillators" style={{ color: '#f59e0b', fontSize: 13 }}>Oscillators (prime resonators)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/hamiltonian" style={{ color: '#3b82f6', fontSize: 13 }}>Hamiltonian (energy functional)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/waves" style={{ color: '#06b6d4', fontSize: 13 }}>Waves (interference patterns)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/modes" style={{ color: '#a855f7', fontSize: 13 }}>Modes (oscillator structure)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof (scorecard)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#f97316', fontSize: 13 }}>Gap Closing (S5 operator)</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/spectral-attack" style={{ color: '#06b6d4', fontSize: 13 }}>Spectral Attack (unified potential)</Link>
        </div>
      </div>
    </div>
  );
}
