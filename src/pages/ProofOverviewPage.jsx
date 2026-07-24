import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

const STEPS = [
  {
    n: 1,
    title: 'Euler product',
    grade: 'established',
    statement:
      'The Dirichlet series and Euler product agree absolutely for Re(s) > 1. Interpreting each factor as a normalized passive two-port is additional model structure.',
    math: '\\zeta(s)=\\prod_p(1-p^{-s})^{-1},\\qquad \\Re s>1.',
  },
  {
    n: 2,
    title: 'Cascade embeddings',
    grade: 'corrected',
    statement:
      'The symmetric algebraic matrices produce ζ(2s)/ζ(s). The physical LC/ABCD proxies have different transmission functions; the two were previously conflated.',
    math: 'M_p=\\begin{pmatrix}1&p^{-s}\\\\p^{-s}&1\\end{pmatrix}\\Longrightarrow S_{21}^{(A)}=\\frac{\\zeta(2s)}{\\zeta(s)}.',
  },
  {
    n: 3,
    title: 'Functional-equation boundary',
    grade: 'established',
    statement:
      '|χ(1/2+it)|=1 holds for every real t. It does not characterize the line pointwise and does not construct the full scattering network.',
    math: '|\\chi(\\tfrac12+it)|=1.',
  },
  {
    n: 4,
    title: 'Analytic continuation',
    grade: 'established-with-caveat',
    statement:
      'The eta function is entire and ζ is recovered meromorphically by division. Eta has extra multiplier zeros, so it does not literally preserve the zeta zero set.',
    math: '\\eta(s)=(1-2^{1-s})\\zeta(s),\\qquad \\zeta(s)=\\frac{\\eta(s)}{1-2^{1-s}}.',
  },
  {
    n: 5,
    title: 'Hilbert–Pólya operator',
    grade: 'open',
    statement:
      'No self-adjoint operator whose spectrum is proved to equal all nontrivial zeta ordinates has been constructed here.',
    math: '\\operatorname{Spec}(H)=\\{\\gamma:\\zeta(\\tfrac12+i\\gamma)=0\\}\\quad\\text{is a target, not a theorem}.',
  },
  {
    n: 6,
    title: 'Energy landscape',
    grade: 'finite-model',
    statement:
      'Finite truncated diagnostics can have a symmetric minimum at σ=1/2. The formerly displayed infinite positive prime sum diverges and does not define a Hamiltonian.',
    math: 'H_N(\\sigma,t)\\ \\text{is a finite visualization proxy}.',
  },
  {
    n: 7,
    title: 'Passivity / Darlington',
    grade: 'open',
    statement:
      'A qualified synthesis theorem needs stability, minimality, normalization, and an exact divisor map. Generic boundary losslessness does not confine transmission zeros.',
    math: 'S^\\dagger S=I\\ \\text{on a boundary does not by itself imply RH}.',
  },
  {
    n: 8,
    title: 'Zero/pole bookkeeping',
    grade: 'corrected',
    statement:
      'For the algebraic ratio, generic zeta zeros are poles. Transmission zeros come from uncancelled zeros of ζ(2s), so the former Darlington transmission-zero conclusion targets the wrong divisor.',
    math: '\\zeta(s_0)=0,\\ \\zeta(2s_0)\\ne0\\Longrightarrow \\operatorname{pole}_{s_0}S_{21}^{(A)}.',
  },
];

const STYLE = {
  established: { fg: '#86efac', border: '#22c55e', label: 'established' },
  'established-with-caveat': { fg: '#86efac', border: '#22c55e', label: 'established · caveat' },
  corrected: { fg: '#a5b4fc', border: '#6366f1', label: 'corrected identity' },
  'finite-model': { fg: '#facc15', border: '#eab308', label: 'finite model only' },
  open: { fg: '#fca5a5', border: '#ef4444', label: 'open' },
};

function Step({ step }) {
  const style = STYLE[step.grade];
  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${style.border}`,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          S{step.n}
        </span>
        <strong style={{ color: '#e2e8f0' }}>{step.title}</strong>
        <span
          style={{
            color: style.fg,
            border: `1px solid ${style.border}55`,
            borderRadius: 999,
            padding: '2px 8px',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
          }}
        >
          {style.label}
        </span>
      </div>
      <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.7 }}>{step.statement}</p>
      <BlockMath tex={step.math} />
    </div>
  );
}

export default function ProofOverviewPage() {
  return (
    <div className="page" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <HonestCeilingBanner />
      <PageHeader
        title="Proof-Attempt Overview — Audited"
        subtitle="A step-by-step separation of classical identities, corrected model claims, finite diagnostics, and genuinely open theorems."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 13,
          marginTop: 22,
        }}
      >
        {STEPS.map((step) => <Step key={step.n} step={step} />)}
      </div>

      <section style={{ marginTop: 38 }}>
        <h2 style={{ color: '#e2e8f0' }}>What survives the audit</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 14,
          }}
        >
          <div className="card" style={{ borderLeft: '3px solid #22c55e', padding: 16 }}>
            <h3 style={{ color: '#86efac', marginTop: 0 }}>Exact</h3>
            <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.75, paddingLeft: 18 }}>
              <li>Euler product in <InlineMath tex="\Re s>1" />.</li>
              <li>Functional equation and critical-line boundary modulus.</li>
              <li>Finite induction for the separate algebraic zeta ratio.</li>
              <li>Correct zero/pole divisor of that ratio.</li>
            </ul>
          </div>
          <div className="card" style={{ borderLeft: '3px solid #eab308', padding: 16 }}>
            <h3 style={{ color: '#facc15', marginTop: 0 }}>Evidence, not proof</h3>
            <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.75, paddingLeft: 18 }}>
              <li>Finite energy and curvature plots.</li>
              <li>GUE-like numerical statistics for computed zeros.</li>
              <li>Li coefficients checked over finite ranges.</li>
              <li>Sampled shift-ratio contractivity.</li>
            </ul>
          </div>
          <div className="card" style={{ borderLeft: '3px solid #ef4444', padding: 16 }}>
            <h3 style={{ color: '#fca5a5', marginTop: 0 }}>Still open</h3>
            <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.75, paddingLeft: 18 }}>
              <li>Physical realization of the arithmetic ratio.</li>
              <li>Self-adjoint spectral identification.</li>
              <li>All-shifts Schur/de Branges positivity.</li>
              <li>The eight interfaces of the 0.1787854 candidate.</li>
            </ul>
          </div>
        </div>
      </section>

      <div
        className="card"
        style={{
          marginTop: 30,
          border: '1px solid rgba(239,68,68,0.35)',
          background: 'rgba(239,68,68,0.06)',
          padding: 18,
        }}
      >
        <h2 style={{ color: '#fca5a5', fontSize: 18, marginTop: 0 }}>Verdict</h2>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
          The old eight-step chain does not prove RH. Its most important self-correction is the
          separation between the exact algebraic Euler embedding and the physical LC analogy. The
          v70 shift-bridge formulation supplies a cleaner RH-equivalent target, while the candidate
          packages supply numerical evidence whose analytic welds remain review-open.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link to="/full-story" style={{ color: '#a5b4fc' }}>Corrected full story</Link>
          <Link to="/control" style={{ color: '#a5b4fc' }}>Control-theory correction</Link>
          <Link to="/paper-audit-dashboard" style={{ color: '#a5b4fc' }}>v70 audit</Link>
          <Link to="/newman-lambda-01787854-candidate" style={{ color: '#fbbf24' }}>Candidate review</Link>
        </div>
      </div>
    </div>
  );
}
