import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

function Panel({ color, title, children }) {
  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${color}`,
        padding: 17,
      }}
    >
      <h3 style={{ color, fontSize: 15, marginTop: 0 }}>{title}</h3>
      <div style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

export default function ControlTheoryPage() {
  return (
    <div className="page" style={{ maxWidth: 1080, margin: '0 auto' }}>
      <HonestCeilingBanner />
      <PageHeader
        title="Control Theory — Corrected Model Boundary"
        subtitle="What the functional equation does prove, why the old Nyquist loop collapses, and which Schur/passivity target remains meaningful."
      />

      <div
        className="card"
        style={{
          marginTop: 18,
          padding: 18,
          border: '1px solid rgba(239,68,68,0.35)',
          background: 'rgba(239,68,68,0.06)',
        }}
      >
        <h2 style={{ color: '#fca5a5', fontSize: 18, marginTop: 0 }}>The former loop function is identically trivial</h2>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
          The page previously defined
          <InlineMath tex="\;L(s)=\chi(s)\zeta(1-s)/\zeta(s)" /> while using the convention
          <InlineMath tex="\;\zeta(s)=\chi(s)\zeta(1-s)" />. Therefore,
        </p>
        <BlockMath tex="L(s)=1" />
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
          wherever the quotient is initially defined, and meromorphic continuation extends the
          identity across removable points. Thus <InlineMath tex="1+L\equiv2" />: this loop cannot
          detect zeta zeros, wind around <InlineMath tex="-1" />, or support the old Nyquist/RH
          equivalence. The former Nyquist and Bode plots of this expression are withdrawn as proof
          evidence.
        </p>
      </div>

      <section style={{ marginTop: 34 }}>
        <h2 style={{ color: '#e2e8f0' }}>Three objects that must not be conflated</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          <Panel color="#67e8f9" title="Functional-equation factor">
            <BlockMath tex="|\chi(\tfrac12+it)|=1\qquad(t\in\mathbb R)." />
            This is a linewise boundary-modulus identity. Isolated off-line points may also have
            unit modulus. The identity alone does not construct a causal passive two-port.
          </Panel>
          <Panel color="#a5b4fc" title="Algebraic Euler embedding">
            <BlockMath tex="S_{21}^{(A)}(s)=\frac{\zeta(2s)}{\zeta(s)}." />
            This exact Euler-product ratio comes from the separate symmetric algebraic matrices.
            Generic zeta zeros are poles, while uncancelled <InlineMath tex="\zeta(2s)" /> zeros are
            transmission zeros. No physical realization is supplied by the identity.
          </Panel>
          <Panel color="#f59e0b" title="Physical LC proxy">
            A physical series/shunt or undamped LC cascade has its own ABCD transmission function.
            It is not <InlineMath tex="\zeta(2s)/\zeta(s)" />. Circuit language is an analogy until
            an exact realization theorem proves otherwise.
          </Panel>
        </div>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2 style={{ color: '#e2e8f0' }}>The meaningful Schur target</h2>
        <p style={{ color: '#cbd5e1', fontSize: 14.5, lineHeight: 1.8 }}>
          A nontrivial control-theoretic object does arise from the centered completed function:
        </p>
        <BlockMath tex="X(w)=\xi(\tfrac12+w),\qquad R_a(w)=\frac{X(w-a)}{X(w+a)}." />
        <p style={{ color: '#cbd5e1', fontSize: 14.5, lineHeight: 1.8 }}>
          The v70 shift theorem gives strict contractivity in the open right half-plane exactly at
          shifts <InlineMath tex="a\ge\Delta" />, with the endpoint and common-zero caveats handled
          separately. Proving the all-shifts statement
        </p>
        <BlockMath tex="|R_a(w)|<1\quad(\Re w>0,\ a>0)" />
        <p style={{ color: '#cbd5e1', fontSize: 14.5, lineHeight: 1.8 }}>
          non-circularly is equivalent to proving <InlineMath tex="\Delta=0" />, hence RH. In
          control language, a passive realization of every reduced <InlineMath tex="R_a" /> would
          be powerful—but the realization and its uniform all-shifts margin are the open theorem,
          not consequences of the functional equation.
        </p>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2 style={{ color: '#e2e8f0' }}>Why generic losslessness is insufficient</h2>
        <Panel color="#ef4444" title="Counterexample pattern">
          A reciprocal matrix
          <BlockMath tex="S(s)=\begin{pmatrix}0&h(s)\\h(s)&0\end{pmatrix},\qquad h(s)=\frac{s-a}{s+a},\quad a>0," />
          is unitary on the imaginary axis wherever defined, yet
          <InlineMath tex="\;h" /> has a right-half-plane zero at <InlineMath tex="s=a" />. Therefore
          “reciprocal and lossless on the boundary” does not by itself force transmission zeros onto
          that boundary. Any Darlington invocation must state the full synthesis class, stability,
          minimality, normalization, and divisor-identification hypotheses.
        </Panel>
        <Panel color="#f97316" title="Davenport–Heilbronn warning">
          Functional-equation symmetry and a unit-modulus boundary factor also occur for
          Davenport–Heilbronn-type functions with off-line zeros. A valid zeta argument must use
          additional arithmetic structure—most notably the Euler product—without silently replacing
          it by an unrelated physical cascade.
        </Panel>
      </section>

      <div
        className="card"
        style={{
          marginTop: 32,
          borderLeft: '3px solid #10b981',
          padding: 18,
        }}
      >
        <h3 style={{ color: '#86efac', marginTop: 0 }}>Defensible control-theory research question</h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
          Construct, from the completed Riemann kernel rather than from its unknown zeros, a
          restricted passive realization of the reduced ratios <InlineMath tex="R_a" /> with a
          certified margin on an exhausting family of domains and shifts. Such a theorem would
          address the actual all-shifts Schur target. Finite sampled contractivity can falsify a
          proposed realization, but cannot prove the global statement.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#64748b', padding: 16 }}>
        <h3 style={{ color: '#94a3b8', marginTop: 0 }}>Related pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13 }}>
          <Link to="/shift-bridge-positivity" style={{ color: '#a5b4fc' }}>Shift-bridge threshold</Link>
          <Link to="/closure-routes" style={{ color: '#a5b4fc' }}>Equivalent closure routes</Link>
          <Link to="/blaschke-ghosts" style={{ color: '#a5b4fc' }}>Residual poles and ghosts</Link>
          <Link to="/paper-audit-dashboard" style={{ color: '#a5b4fc' }}>v70 correction audit</Link>
        </div>
      </div>
    </div>
  );
}
