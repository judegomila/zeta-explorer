import React from 'react';
import { Link } from 'react-router-dom';
import ProofCheckerViz from '../components/ProofCheckerViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function ProofCheckerPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Proof Checker</h1>
        <p>
          A skeptical verification engine that tests every claim in the ZPO framework.
          Includes the Davenport-Heilbronn counterexample — a function that satisfies
          most ZPO properties but violates RH, identifying exactly which arguments are valid.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 14, marginBottom: 8 }}>Adversarial Testing Philosophy</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          This checker is deliberately skeptical. For each ZPO claim, it asks: <em>"Does this
          hold for the Davenport-Heilbronn function?"</em> D-H has a functional equation like ζ
          but has zeros OFF the critical line. Any argument that also works for D-H
          <strong style={{ color: '#ef4444' }}> cannot prove RH</strong>.
        </p>
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ color: '#10b981', fontSize: 14 }}>What the Checker Verifies</h3>
          <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 2 }}>
            <li><strong>Mathematical identities</strong> — functional equation, bridge unitarity, Euler convergence</li>
            <li><strong>ZPO model claims</strong> — Hamiltonian minimum, impedance matching, entropy maximum</li>
            <li><strong>Davenport-Heilbronn discrimination</strong> — which claims are unique to ζ?</li>
            <li><strong>Logical structure</strong> — circularity detection, implication strength</li>
            <li><strong>Stress tests</strong> — large t, near zeros, few primes, numerical stability</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b', fontSize: 14 }}>The Davenport-Heilbronn Function</h3>
          <BlockMath tex={
            'f(s) = \\frac{1-i\\kappa}{2} L(s, \\chi_1) + \\frac{1+i\\kappa}{2} L(s, \\bar{\\chi}_1)'
          } />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            where <InlineMath tex={"\\chi_1"} /> is primitive mod 5 with <InlineMath tex={"\\chi_1(2) = i"} />,
            and <InlineMath tex={"\\kappa = (\\sqrt{10-2\\sqrt{5}}-2)/(\\sqrt{5}-1)"} />.
            This function has a functional equation but zeros off <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          </p>
        </div>
      </div>

      {/* Davenport-Heilbronn: The Evil Twin */}
      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 15, marginBottom: 12 }}>
          The Davenport-Heilbronn Function — Why Functional Equation Alone is Insufficient
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          The Davenport-Heilbronn function is the canonical &ldquo;evil twin&rdquo; of the Riemann zeta function.
          It is a Dirichlet series that satisfies a functional equation of the same shape as{' '}
          <InlineMath tex={"\\zeta(s)"} />, yet it has zeros <strong style={{ color: '#ef4444' }}>off</strong> the
          critical line. This makes it the ultimate stress test: any argument that purports to prove RH
          but also applies to D-H is necessarily flawed.
        </p>

        <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <p style={{ color: '#cbd5e1', fontSize: 13, marginBottom: 8 }}>
            <strong>Definition.</strong> The D-H function is the Dirichlet series
          </p>
          <BlockMath tex={"f(s) = \\sum_{n=1}^{\\infty} \\frac{a_n}{n^s}"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
            where the coefficients <InlineMath tex={"a_n"} /> are built from a specific pair of Dirichlet
            characters <InlineMath tex={"\\chi_1, \\bar{\\chi}_1"} /> modulo 5 with{' '}
            <InlineMath tex={"\\chi_1(2) = i"} />:
          </p>
          <BlockMath tex={
            "f(s) = \\frac{1 - i\\kappa}{2}\\,L(s,\\chi_1) \\;+\\; \\frac{1 + i\\kappa}{2}\\,L(s,\\bar{\\chi}_1)"
          } />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            with <InlineMath tex={"\\kappa = \\frac{\\sqrt{10 - 2\\sqrt{5}} - 2}{\\sqrt{5} - 1}"} />.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: 14 }}>
            <p style={{ color: '#10b981', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
              What D-H DOES satisfy
            </p>
            <BlockMath tex={"f(s) = \\chi(s)\\,f(1-s)"} />
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.7 }}>
              A functional equation of the standard Riemann type, relating values at{' '}
              <InlineMath tex={"s"} /> and <InlineMath tex={"1-s"} />.
            </p>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 8, padding: 14 }}>
            <p style={{ color: '#ef4444', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
              What D-H does NOT satisfy
            </p>
            <BlockMath tex={"f(s) \\neq \\prod_{p}\\bigl(1 - a_p\\,p^{-s}\\bigr)^{-1}"} />
            <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.7 }}>
              No Euler product. The coefficients are <em>not</em> multiplicative, so there is no
              factorization over primes.
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 8, padding: 14 }}>
          <p style={{ color: '#ef4444', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
            Consequence: Zeros off the critical line
          </p>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            Because <InlineMath tex={"f"} /> lacks an Euler product, the bridge{' '}
            <InlineMath tex={"\\chi(s)"} /> is <strong>not backed by prime factorization</strong>.
            The result: <InlineMath tex={"f"} /> has infinitely many zeros{' '}
            <InlineMath tex={"\\rho"} /> with{' '}
            <InlineMath tex={"\\operatorname{Re}(\\rho) \\neq \\tfrac{1}{2}"} />.
            The discriminator is clear:
          </p>
          <BlockMath tex={
            "f \\text{ has no Euler product} \\;\\Longrightarrow\\; \\text{the bridge } \\chi(s) \\text{ is NOT backed by prime factorization}"
          } />
        </div>
      </div>

      <ProofCheckerViz />

      {/* Verification Checklist */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #6366f1', background: 'rgba(99,102,241,0.04)' }}>
        <h3 style={{ color: '#6366f1', fontSize: 15, marginBottom: 4 }}>
          Verification Checklist
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
          A valid proof of RH must establish all five properties below. Green items are
          rigorously established; red items remain open.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Item 1 — Established */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: 14 }}>
            <span style={{ color: '#10b981', fontSize: 18, lineHeight: 1 }}>&#10003;</span>
            <div>
              <p style={{ color: '#10b981', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Euler product convergence (<InlineMath tex={"\\sigma > 1"} />)
              </p>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
                <strong>Established.</strong> The Euler product{' '}
                <InlineMath tex={"\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}"} /> converges absolutely
                for <InlineMath tex={"\\operatorname{Re}(s) > 1"} /> and encodes unique prime
                factorization. This is the property D-H lacks.
              </p>
            </div>
          </div>

          {/* Item 2 — Established */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: 14 }}>
            <span style={{ color: '#10b981', fontSize: 18, lineHeight: 1 }}>&#10003;</span>
            <div>
              <p style={{ color: '#10b981', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Analytic continuation via eta relation
              </p>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
                <strong>Established.</strong> The relation{' '}
                <InlineMath tex={"\\eta(s) = (1 - 2^{1-s})\\,\\zeta(s)"} /> extends{' '}
                <InlineMath tex={"\\zeta"} /> to a meromorphic function on{' '}
                <InlineMath tex={"\\mathbb{C}"} /> with a single pole at{' '}
                <InlineMath tex={"s = 1"} />.
              </p>
            </div>
          </div>

          {/* Item 3 — Established */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(16,185,129,0.06)', borderRadius: 8, padding: 14 }}>
            <span style={{ color: '#10b981', fontSize: 18, lineHeight: 1 }}>&#10003;</span>
            <div>
              <p style={{ color: '#10b981', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Functional equation
              </p>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
                <strong>Established.</strong>{' '}
                <InlineMath tex={"\\xi(s) = \\xi(1-s)"} /> where{' '}
                <InlineMath tex={"\\xi(s) = \\tfrac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)"} />.
                The completed zeta function is invariant under{' '}
                <InlineMath tex={"s \\mapsto 1-s"} />.
              </p>
            </div>
          </div>

          {/* Item 4 — Open */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(239,68,68,0.06)', borderRadius: 8, padding: 14 }}>
            <span style={{ color: '#ef4444', fontSize: 18, lineHeight: 1 }}>&#10007;</span>
            <div>
              <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Self-adjoint operator construction (Hilbert-Polya)
              </p>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
                <strong>Open.</strong> The Hilbert-Polya conjecture posits an unbounded self-adjoint
                operator <InlineMath tex={"H"} /> on a Hilbert space whose eigenvalues are{' '}
                <InlineMath tex={"\\{ \\gamma_n \\}"} /> (the imaginary parts of the non-trivial zeros).
                Self-adjointness would force real eigenvalues, hence{' '}
                <InlineMath tex={"\\operatorname{Re}(\\rho) = \\tfrac{1}{2}"} />. No such operator
                has been rigorously constructed.
              </p>
            </div>
          </div>

          {/* Item 5 — Open */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(239,68,68,0.06)', borderRadius: 8, padding: 14 }}>
            <span style={{ color: '#ef4444', fontSize: 18, lineHeight: 1 }}>&#10007;</span>
            <div>
              <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Darlington losslessness for infinite cascade
              </p>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
                <strong>Open.</strong> The Darlington synthesis interprets{' '}
                <InlineMath tex={"\\zeta"} /> as a scattering matrix for an infinite cascade of
                two-port sections indexed by primes. Losslessness of the cascade would
                imply all reflection zeros lie on{' '}
                <InlineMath tex={"\\operatorname{Re}(s) = \\tfrac{1}{2}"} />.
                Extension from finite to infinite cascades is not yet proven.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 14 }}>Key Finding: The Euler Product is Essential</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The checker identifies that the <strong>Euler product structure</strong> (multiplicativity of coefficients,
          Selberg class membership) is the <strong>only</strong> property that discriminates ζ from D-H.
          All other ZPO arguments (Hamiltonian, bridge, information theory) follow from the functional equation
          alone, which D-H also satisfies. This means the proof path must go through Darlington synthesis
          or the Euler product directly — not through surrogate measures.
        </p>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/rh-attack" style={{ color: '#3b82f6', fontSize: 13 }}>RH Attack</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/spectral-attack" style={{ color: '#06b6d4', fontSize: 13 }}>Spectral Attack</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#f97316', fontSize: 13 }}>Gap Closing</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rigor" style={{ color: '#f59e0b', fontSize: 13 }}>Rigor</Link>
        </div>
      </div>
    </div>
  );
}
