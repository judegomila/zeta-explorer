import React from 'react';
import { Link } from 'react-router-dom';
import WaveSimViz from '../components/WaveSimViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function WaveSimPage() {
  return (
    <div className="page">
      <PageHeader title="Wave Simulator — Finite Model">
        <p>
          Explore a finite oscillator visualization inspired by prime logarithms and the
          functional equation. The animation is a model diagnostic, not a physical realization
          of the analytically continued zeta function.
        </p>
      </PageHeader>

      <div className="card" style={{ borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#fbbf24', marginTop: 0 }}>Interpretation boundary</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
          The exact statement is that the standard functional-equation factor satisfies
          <InlineMath tex="|\chi(\tfrac12+it)|=1" /> for every real <InlineMath tex="t" />.
          This makes the critical line a global unit-modulus symmetry line. A single point with
          <InlineMath tex="|\chi(\sigma+it)|=1" /> does not characterize
          <InlineMath tex="\sigma=\tfrac12" />, and scalar unit modulus does not establish
          impedance matching, zero reflection, passivity, or a causal two-port realization.
        </p>
        <BlockMath tex="\zeta(s)=\chi(s)\zeta(1-s),\qquad |\chi(\tfrac12+it)|=1\quad(t\in\mathbb R)" />
      </div>

      <div style={{ marginTop: 32 }}>
        <WaveSimViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>What the controls actually compute</h3>
        <ul style={{ marginLeft: 18, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 2 }}>
          <li>
            Prime labels use the formal frequencies <InlineMath tex="\log p" /> and finite weights
            such as <InlineMath tex="p^{-k\sigma}" />.
          </li>
          <li>
            For each fixed prime, <InlineMath tex="\sum_{k\ge1}p^{-k\sigma}" /> converges when
            <InlineMath tex="\sigma>0" />. The sum/product over all primes is absolutely convergent
            only when <InlineMath tex="\sigma>1" />.
          </li>
          <li>
            Direct/dual colors visualize the reflection <InlineMath tex="s\mapsto1-s" />. They do
            not numerically evaluate two convergent Euler products inside the critical strip.
          </li>
          <li>
            Adding more displayed primes changes a finite truncation. On
            <InlineMath tex="\sigma=\tfrac12" /> it must not be described as convergence to the raw
            Euler product.
          </li>
        </ul>
        <BlockMath tex="\prod_p(1-p^{-s})^{-1}=\zeta(s)\quad\text{only as a convergent Euler product for }\operatorname{Re}s>1" />
      </div>

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Phase and delay: model quantities</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            The interface can plot phases and derivatives of its finite proxy. In engineering,
            group delay <InlineMath tex="\tau_g=-d\arg H(i\omega)/d\omega" /> has a physical
            interpretation only after a causal transfer function and its realization are defined.
            This project has not proved that the finite proxy extends to such a zeta realization.
          </p>
          <p style={{ color: '#fca5a5', fontSize: 13, lineHeight: 1.7 }}>
            In particular, neither divergent group delay nor divergent Fisher information at zeta
            zeros has been established by the twin-ladder construction.
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: '#8b5cf6' }}>Scattering: unresolved realization</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            A conjugate-match or maximum-power-transfer claim needs defined impedances with
            positivity, causality, and port normalization. The identity
            <InlineMath tex="|\chi|=1" /> on the line supplies none of those by itself.
            For the algebraic cascade used elsewhere in the app,
            <InlineMath tex="S_{21}(s)=\zeta(2s)/\zeta(s)" />, so generic nontrivial zeta zeros
            are poles rather than transmission zeros.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #a855f7' }}>
        <h3 style={{ color: '#c4b5fd', marginTop: 0 }}>
          First zero: what may and may not be inferred
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
          The analytic continuation satisfies
          <InlineMath tex="\zeta(\tfrac12+i\gamma_1)=0" /> at
          <InlineMath tex="\gamma_1\approx14.134725" />. Finite prime phasors can be displayed at
          that height, but their vector sum is not the zeta value and the divergent product
          <InlineMath tex="\prod_p(1-p^{-1/2-i\gamma_1})^{-1}" /> must not be set equal to zero.
          Any prime-side reconstruction on the critical line requires an explicit summation or
          regularization theorem.
        </p>
        <BlockMath tex="\zeta(\tfrac12+i\gamma_1)=0\qquad\not\Longrightarrow\qquad \prod_p(1-p^{-1/2-i\gamma_1})^{-1}=0" />
      </div>

      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#94a3b8', fontSize: 13, marginBottom: 10 }}>Continue the audited path</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/paper">Model vs. theorem boundary</Link>
          <Link to="/control">Corrected control-theory audit</Link>
          <Link to="/proof-overview">Evidence-graded proof overview</Link>
          <Link to="/closure-routes">Open closure routes</Link>
        </div>
      </div>
    </div>
  );
}
