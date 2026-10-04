import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { ED } from '../styles/tokens.js';

// Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
// structure/data/grades. Every evidence grade, RH-not-proved caveat, and the
// Λ ≤ 0.1787854 unreviewed-candidate language is kept verbatim (imp: warm-port).

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

// Literal warm hex (not var()) so the pill background can use the "border+55"
// alpha-suffix trick below — CSS var() references can't be alpha-suffixed.
const STYLE = {
  established: { fg: ED.series3, border: ED.series3, label: 'established' },
  'established-with-caveat': { fg: ED.series3, border: ED.series3, label: 'established · caveat' },
  corrected: { fg: ED.series1, border: ED.series1, label: 'corrected identity' },
  'finite-model': { fg: ED.brass, border: ED.brassDeco, label: 'finite model only' },
  open: { fg: ED.accent, border: ED.accent, label: 'open' },
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
        <span style={{ color: 'var(--ink-faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}>
          S{step.n}
        </span>
        <strong style={{ color: 'var(--ink)' }}>{step.title}</strong>
        <span
          style={{
            color: style.fg,
            border: `1px solid ${style.border}55`,
            borderRadius: 999,
            padding: '2px 8px',
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            fontSize: 10,
          }}
        >
          {style.label}
        </span>
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.7 }}>{step.statement}</p>
      <BlockMath tex={step.math} />
    </div>
  );
}

export default function ProofOverviewPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <HonestCeilingBanner />
        <h1 className="ed-h1" style={{ marginTop: 18, marginBottom: 10 }}>Proof-Attempt Overview — Audited</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760, marginBottom: 22 }}>
          A step-by-step separation of classical identities, corrected model claims, finite
          diagnostics, and genuinely open theorems.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 13,
            marginBottom: 24,
          }}
        >
          {STEPS.map((step) => <Step key={step.n} step={step} />)}
        </div>

        <section style={{ marginBottom: 24 }}>
          <h2 className="ed-h2" style={{ marginBottom: 12 }}>What survives the audit</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: 14,
            }}
          >
            <div className="card" style={{ borderLeft: '3px solid var(--series-3)', padding: 16 }}>
              <h3 style={{ color: 'var(--series-3)', marginTop: 0 }}>Exact</h3>
              <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, paddingLeft: 18 }}>
                <li>Euler product in <InlineMath tex="\Re s>1" />.</li>
                <li>Functional equation and critical-line boundary modulus.</li>
                <li>Finite induction for the separate algebraic zeta ratio.</li>
                <li>Correct zero/pole divisor of that ratio.</li>
              </ul>
            </div>
            <div className="card" style={{ borderLeft: '3px solid var(--brass-deco)', padding: 16 }}>
              <h3 style={{ color: 'var(--brass)', marginTop: 0 }}>Evidence, not proof</h3>
              <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, paddingLeft: 18 }}>
                <li>Computer-assisted candidate <InlineMath tex="\Lambda\le0.1787854" /> (reviewed by Dan Romik; unrefereed; bound not established).</li>
                <li>Computer-assisted candidate <InlineMath tex="\Lambda\le0.1758354" /> (four Arb gates, Lean-checked y-transfer reduction and Lemma B3; unrefereed) — <Link to="/lambda-01758354-candidate" style={{ color: 'var(--series-1)' }}>candidate page</Link>.</li>
                <li>The <InlineMath tex="\Lambda\le0.14" /> completion contract — a conditional contract, not a bound; one open family remains — <Link to="/permutation-architecture" style={{ color: 'var(--series-1)' }}>permutation architecture</Link>.</li>
                <li>Finite energy and curvature plots.</li>
                <li>GUE-like numerical statistics for computed zeros.</li>
                <li>Li coefficients checked over finite ranges.</li>
                <li>Sampled shift-ratio contractivity.</li>
              </ul>
            </div>
            <div className="card" style={{ borderLeft: '3px solid var(--accent)', padding: 16 }}>
              <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>Still open</h3>
              <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, paddingLeft: 18 }}>
                <li>Physical realization of the arithmetic ratio.</li>
                <li>Self-adjoint spectral identification.</li>
                <li>All-shifts Schur/de Branges positivity.</li>
                <li>Independent mathematical validation and peer review of the 0.1787854 candidate.</li>
              </ul>
            </div>
          </div>
        </section>

        <div
          className="card"
          style={{
            border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
            background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
            padding: 18,
          }}
        >
          <h2 style={{ color: 'var(--accent)', fontFamily: 'var(--ed-display)', fontWeight: 500, fontSize: 18, marginTop: 0 }}>Verdict</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.75 }}>
            The old eight-step chain does not prove RH. Its most important self-correction is the
            separation between the exact algebraic Euler embedding and the physical LC analogy. The
            twin-ladder shift-bridge formulation supplies a cleaner RH-equivalent target. Separately, the
            standalone repository presents the positive bound <InlineMath tex="\Lambda\le0.1787854" /> as
            a computer-assisted candidate for an unconditional proof (reviewed by Dan Romik; unrefereed;
            bound not established). A sharper candidate <InlineMath tex="\Lambda\le0.1758354" /> (four
            Arb gates, Lean-checked y-transfer reduction and Lemma B3, unrefereed) and the <InlineMath tex="\Lambda\le0.14" />{' '}
            completion contract — a conditional contract, not a bound — sit alongside it. None of these is RH.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link to="/full-story" style={{ color: 'var(--series-1)' }}>Corrected full story</Link>
            <Link to="/control" style={{ color: 'var(--series-1)' }}>Control-theory correction</Link>
            <Link to="/paper-audit-dashboard" style={{ color: 'var(--series-1)' }}>twin-ladder audit</Link>
            <Link to="/newman-lambda-01787854-candidate" style={{ color: 'var(--series-1)' }}>Candidate package</Link>
            <Link to="/lambda-01758354-candidate" style={{ color: 'var(--series-1)' }}>0.1758354 candidate</Link>
            <Link to="/permutation-architecture" style={{ color: 'var(--series-1)' }}>0.14 contract</Link>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--brass)', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/full-story" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              → Corrected full story
            </Link>
            <Link to="/control" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Control-theory correction
            </Link>
            <Link to="/paper-audit-dashboard" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → twin-ladder audit dashboard
            </Link>
            <Link to="/newman-lambda-01787854-candidate" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              → Λ ≤ 0.1787854 candidate package
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
