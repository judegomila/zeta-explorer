import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import TwinOscillatorSimViz from '../components/TwinOscillatorSimViz.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

// Twin Oscillator Simulator — editorial (warm) re-theme.
// Full-width dashboard. The live TwinOscillatorSimViz is preserved verbatim;
// only the surrounding chrome is re-themed. Every claim, number, identity, and
// caveat is unchanged.

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 8,
};

const bodyText = {
  color: 'var(--ink-soft)',
  fontSize: 14,
  lineHeight: 1.75,
};

const smallText = {
  color: 'var(--ink-soft)',
  fontSize: 13,
  lineHeight: 1.75,
};

export default function SimulatorPage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>twin oscillator sim · minimize 𝓗(σ,t) toward σ = 1/2</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        {/* ── Title ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Twin Oscillator Simulator</h1>
          <p style={{ ...bodyText, maxWidth: 780 }}>
            Interactive exploration of the system Hamiltonian minimization at <InlineMath tex={"\\sigma = 1/2"} />.
            In the model, the energy ground state sits on the critical line because direct and dual
            ladders are conjugate-matched and the bridge scattering matrix is unitary — a property that
            follows from the functional equation, not a proof of RH.
          </p>
        </div>

        {/* ── The Hamiltonian + headline claim ──────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), marginBottom: 20 }}>
          <div style={cardLabel}>The system Hamiltonian</div>
          <BlockMath tex={"\\mathcal{H}(\\sigma, t) = \\sum_p \\tfrac{1}{2}\\log p\\bigl(|H_p(s)|^2 + |H_p(1\\!-\\!s)|^2\\bigr) + \\tfrac{1}{2}|Z_{\\text{dir}} - Z_{\\text{dual}}|^2 + 100\\,(1 - |\\chi(s)|)^2"} />
          <div style={{ marginTop: 8 }}>
            <BlockMath tex={"\\text{Claim: } \\underset{\\sigma}{\\arg\\min}\\;\\mathcal{H}(\\sigma + it) = \\tfrac{1}{2} \\quad \\forall\\; t = \\gamma_n"} />
            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--brass-deco) 14%, transparent)', color: 'var(--brass-dk)', fontSize: 12,
                fontWeight: 600, border: '1px solid color-mix(in srgb, var(--brass-deco) 45%, transparent)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
              }}>
                by construction, not a proof of RH — see caveat below
              </span>
            </div>
          </div>
        </div>

        {/* ── The live simulator (unchanged) ────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <ErrorBoundary
            title="Simulator Error"
            message="The Twin Oscillator Simulator encountered an error. This can happen with certain parameter combinations. Try reloading or adjusting the inputs."
          >
            <TwinOscillatorSimViz />
          </ErrorBoundary>
        </div>

        {/* ── What this simulator tests ─────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--green)'), marginBottom: 20 }}>
          <div style={cardLabel}>What this simulator tests</div>
          <p style={smallText}>
            Each tab probes a different aspect of the Hamiltonian minimization claim.
            <strong style={{ color: 'var(--blue)' }}> Per-Prime Energy </strong> shows individual oscillator contributions.
            <strong style={{ color: 'var(--brass-dk)' }}> Gradient Descent </strong> animates convergence to <InlineMath tex={"\\sigma = 1/2"} />.
            <strong style={{ color: 'var(--terra-dk)' }}> Convergence </strong> shows the valley sharpening with more primes.
            <strong style={{ color: 'var(--blue)' }}> Bridge Unitarity </strong> verifies <InlineMath tex={"|\\chi(s)| = 1"} /> on the critical line.
            <strong style={{ color: 'var(--terra-dk)' }}> Multi-Zero Test </strong> runs systematic verification across zeta zeros.
          </p>
        </div>

        {/* ── Anatomy of the Hamiltonian ────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), marginBottom: 20 }}>
          <div style={cardLabel}>Anatomy of the Hamiltonian</div>
          <p style={smallText}>
            The system Hamiltonian has three terms, each enforcing a different physical requirement
            for the energy ground state to sit on the critical line. Read left to right, they build
            up the argument: symmetry first, then matching, then a hard unitarity gate.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              marginTop: 16,
            }}
          >
            <div>
              <p style={{ ...smallText, marginBottom: 4 }}>
                <strong style={{ color: 'var(--blue)' }}>1 · Oscillator energy</strong>
              </p>
              <BlockMath tex={"T = \\sum_p \\tfrac{1}{2}\\log p\\,\\bigl(|H_p(s)|^2 + |H_p(1-s)|^2\\bigr)"} />
              <p style={smallText}>
                Each prime <InlineMath tex={"p"} /> contributes a pair of oscillators (direct and dual).
                The weight <InlineMath tex={"\\log p"} /> is the characteristic impedance.
                At <InlineMath tex={"\\sigma = 1/2"} /> the two stages are mirror images, and
                their combined energy is minimized by symmetry.
              </p>
            </div>
            <div>
              <p style={{ ...smallText, marginBottom: 4 }}>
                <strong style={{ color: 'var(--brass-dk)' }}>2 · Impedance mismatch</strong>{' '}
                <InlineMath tex={"\\tfrac{1}{2}|Z_{\\text{dir}} - Z_{\\text{dual}}|^2"} />
              </p>
              <p style={smallText}>
                Penalizes the difference between the direct and dual ladder impedances.
                Conjugate matching (<InlineMath tex={"Z_{\\text{dir}} = Z_{\\text{dual}}^*"} />) occurs
                at <InlineMath tex={"\\sigma = 1/2"} />, where the functional equation guarantees
                <InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> (equal magnitudes, opposite imaginary parts).
                The mismatch <InlineMath tex={"|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\mathrm{Im}\\,Z|"} /> is minimized but not zero. This term drives the energy valley toward the critical line.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--hairline)' }}>
            <p style={{ ...smallText, marginBottom: 4 }}>
              <strong style={{ color: 'var(--terra-dk)' }}>3 · Bridge unitarity penalty</strong>{' '}
              <InlineMath tex={"100\\,(1 - |\\chi(s)|)^2"} />
            </p>
            <p style={smallText}>
              Enforces that the bridge scattering matrix is lossless. The completed zeta function satisfies{' '}
              <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> exactly on the critical line (a consequence of
              the functional equation <InlineMath tex={"\\xi(s) = \\xi(1-s)"} />). Off the critical line,{' '}
              <InlineMath tex={"|\\chi| \\neq 1"} />, so this large penalty pushes the minimum to <InlineMath tex={"\\sigma = 1/2"} />.
              The factor of 100 ensures the constraint dominates.
            </p>
          </div>
        </div>

        {/* ── Important caveat ──────────────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 20 }}>
          <div style={cardLabel}>Important caveat</div>
          <p style={smallText}>
            This Hamiltonian is an <em>engineered</em> energy functional whose minimum is placed
            at <InlineMath tex={"\\sigma = 1/2"} /> by construction — it is <strong>not</strong> a proof
            of the Riemann Hypothesis. The three penalty terms encode known consequences of the functional
            equation (<InlineMath tex={"|\\chi| = 1"} /> on the critical line, conjugate matching at <InlineMath tex={"\\sigma = 1/2"} />),
            so the minimum at <InlineMath tex={"\\sigma = 1/2"} /> follows from input assumptions, not from
            new mathematics. The simulator is a pedagogical tool for visualizing <em>why</em> these
            symmetry properties conspire to single out the critical line.
          </p>
        </div>

        {/* ── Gradient descent and Weil extremization ───────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginBottom: 20 }}>
          <div style={cardLabel}>Gradient descent and Weil extremization</div>
          <p style={smallText}>
            The simulator's gradient descent on <InlineMath tex={"\\mathcal{H}(\\sigma, t)"} /> is a discrete,
            computational analog of Connes' Weil form extremization. Both methods share the same
            structure: start from an initial guess for <InlineMath tex={"\\sigma"} />, optimize a quadratic-like
            functional, and converge to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          </p>
          <BlockMath tex={"\\frac{\\partial \\mathcal{H}}{\\partial \\sigma}\\bigg|_{\\sigma = 1/2} = 0 \\quad \\longleftrightarrow \\quad \\delta W(g \\star \\tilde{g})\\big|_{\\text{extremum}} = 0"} />
          <p style={smallText}>
            The key difference is scope: the Hamiltonian <InlineMath tex={"\\mathcal{H}"} /> uses a <em>finite</em> set
            of primes (adjustable via the "number of primes" slider), while the Weil quadratic form
            uses the full explicit formula kernel summing over all primes. As the number of primes
            increases in the simulator, the gradient <InlineMath tex={"\\partial \\mathcal{H}/\\partial \\sigma|_{\\sigma=1/2} = 0"} /> mirrors
            the Weil form stationarity condition with increasing fidelity. The convergence tab shows
            this sharpening directly — more primes means a deeper, narrower valley at the critical line.
          </p>
        </div>

        {/* ── Convergence: what it proves / doesn't ─────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 20 }}>
          <div style={cardLabel}>Convergence analysis — what it proves and what it doesn't</div>
          <p style={smallText}>
            The gradient descent reliably converges to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for every
            zeta zero tested. This demonstrates that the Hamiltonian is <strong>designed correctly</strong> —
            its minimum sits on the critical line, as intended by construction.
          </p>
          <BlockMath tex={"\\underset{\\sigma}{\\arg\\min}\\;\\mathcal{H}(\\sigma + i\\gamma_n) = \\tfrac{1}{2} \\quad \\text{(by construction, not by proof)}"} />
          <p style={smallText}>
            However, convergence of gradient descent to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> does <strong>not</strong> prove
            the Riemann Hypothesis. The three penalty terms in <InlineMath tex={"\\mathcal{H}"} /> encode known
            consequences of the functional equation, so the minimum at the critical line follows from
            input assumptions. The real open question (<strong>Gap S5</strong>) is whether there exists
            a <em>quantum</em> operator — a self-adjoint operator on a Hilbert space — whose eigenvalues
            are precisely the nontrivial zeta zeros. The distinction is fundamental:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              marginTop: 12,
            }}
          >
            <div style={{
              padding: '12px 14px',
              background: 'var(--paper)',
              borderRadius: 6,
              border: '1px solid var(--hairline)',
              borderLeft: '3px solid var(--brass-dk)',
            }}>
              <p style={smallText}>
                <strong style={{ color: 'var(--brass-dk)' }}>Classical minimum (what we have):</strong>{' '}
                an engineered energy functional <InlineMath tex={"\\mathcal{H}"} /> with a minimum at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> by
                design. The gradient descent confirms the engineering is correct but reveals no new
                information about the zeros themselves.
              </p>
            </div>
            <div style={{
              padding: '12px 14px',
              background: 'var(--paper)',
              borderRadius: 6,
              border: '1px solid var(--hairline)',
              borderLeft: '3px solid var(--blue)',
            }}>
              <p style={smallText}>
                <strong style={{ color: 'var(--blue)' }}>Quantum spectrum (what we need):</strong>{' '}
                a self-adjoint operator <InlineMath tex={"\\hat{H}"} /> whose spectrum <InlineMath tex={"\\{\\gamma_n\\}"} /> matches
                the zeta zeros. If such an operator exists, its self-adjointness would <em>force</em> all
                eigenvalues to be real, implying <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for all zeros — and RH would follow.
              </p>
            </div>
          </div>
        </div>

        {/* ── Convergence diagnostics ───────────────────────────────────── */}
        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), marginBottom: 20 }}>
          <div style={cardLabel}>Convergence diagnostics</div>
          <p style={{ ...smallText, marginBottom: 12 }}>
            The gradient descent reveals important structure about the energy landscape:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ padding: '12px 14px', background: 'var(--paper)', borderRadius: 6, border: '1px solid var(--hairline)', borderLeft: '3px solid var(--green)' }}>
              <div style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700, marginBottom: 6, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Convergence rate</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.65 }}>
                Near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, the descent converges
                exponentially: <InlineMath tex={"\\sigma_k \\to \\tfrac{1}{2}"} /> as <InlineMath tex={"O(e^{-\\alpha k})"} /> where <InlineMath tex={"\\alpha > 0"} /> depends
                on the spectral gap of the Hessian.
              </p>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--paper)', borderRadius: 6, border: '1px solid var(--hairline)', borderLeft: '3px solid var(--brass-dk)' }}>
              <div style={{ color: 'var(--brass-dk)', fontSize: 12, fontWeight: 700, marginBottom: 6, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Basin of attraction</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.65 }}>
                Across the tested range, every starting point in the critical strip
                converges to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />: for the displayed prime counts the
                potential is <em>observed</em> to be convex along the <InlineMath tex={"\\sigma"} /> axis with no
                spurious local minima. This is the empirical behaviour shown in the Convergence tab, not a
                proof of global convexity for all <InlineMath tex={"t"} /> and all prime counts.
              </p>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--paper)', borderRadius: 6, border: '1px solid var(--hairline)', borderLeft: '3px solid var(--terra-dk)' }}>
              <div style={{ color: 'var(--terra-dk)', fontSize: 12, fontWeight: 700, marginBottom: 6, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Prime sensitivity</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.65 }}>
                Adding more primes sharpens the minimum. With N primes, the
                curvature grows as:
              </p>
              <BlockMath tex={"\\frac{\\partial^2 \\mathcal{H}}{\\partial\\sigma^2} \\sim \\sum_{p \\leq p_N} \\frac{(\\log p)^2}{p}"} />
            </div>
          </div>
        </div>

        {/* ── Related pages + atlas ─────────────────────────────────────── */}
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            <Link to="/oscillators" style={{ color: 'var(--brass-dk)', fontSize: 13, textDecoration: 'none' }}>→ Oscillators (prime resonators)</Link>
            <Link to="/hamiltonian" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>→ Hamiltonian (energy functional)</Link>
            <Link to="/waves" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>→ Waves (interference patterns)</Link>
            <Link to="/modes" style={{ color: 'var(--brass)', fontSize: 13, textDecoration: 'none' }}>→ Modes (oscillator structure)</Link>
            <Link to="/formal-proof" style={{ color: 'var(--green)', fontSize: 13, textDecoration: 'none' }}>→ Formal Proof (scorecard)</Link>
            <Link to="/gap-closing" style={{ color: 'var(--terra-dk)', fontSize: 13, textDecoration: 'none' }}>→ Gap Closing (S5 operator)</Link>
            <Link to="/spectral-attack" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>→ Spectral Approach (unified potential)</Link>
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
