// SelbergTracePage.jsx -- imp-1118
// Companion page rendering the imp-1104 SELBERG_TRACE_REFERENCE.
// Title, formula (KaTeX), geometric/spectral side descriptions,
// Riemann correspondence table, references, why-it-matters paragraphs.
// Pure rendering. 4+ tripwires live in src/data/selberg-trace-formula-reference.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { SELBERG_TRACE_REFERENCE } from '../data/selberg-trace-formula-reference.js';

const R = SELBERG_TRACE_REFERENCE;

const mono = 'var(--font-mono)';

export default function SelbergTracePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>{R.title}</h1>
        <p className="page-subtitle" style={{ fontFamily: mono, color: 'var(--text-secondary)' }}>
          Spectral analog of the Riemann explicit formula (imp-1104 / imp-1118)
        </p>
      </div>

      {/* ─── Formula ─── */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>Statement of the formula</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
          For a sufficiently nice test function pair <InlineMath tex="(h, g)" /> related by
          the Fourier transform <InlineMath tex="g(u) = (1/2\pi) \int h(r) e^{-iru}\, dr" />,
          the Selberg trace formula on the modular surface{' '}
          <InlineMath tex="\Gamma \backslash \mathbb{H}" /> with <InlineMath tex="\Gamma = \mathrm{SL}(2, \mathbb{Z})" /> reads:
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={R.formulaLaTeX} />
        </div>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          The left-hand side is the <strong style={{ color: '#10b981' }}>spectral sum</strong>{' '}
          over Laplacian eigenvalues <InlineMath tex="\lambda_n = 1/4 + r_n^2" /> of Maass cusp
          forms on <InlineMath tex="\Gamma \backslash \mathbb{H}" />. The right-hand side is
          the <strong style={{ color: '#f59e0b' }}>geometric (length) sum</strong> over
          hyperbolic conjugacy classes <InlineMath tex="\{P\}" /> of <InlineMath tex="\Gamma" />{' '}
          — equivalently, closed geodesics of length <InlineMath tex="\log N(P_0)" /> on the
          modular surface — plus an identity contribution proportional to the area{' '}
          <InlineMath tex="\mathrm{vol}(\Gamma \backslash \mathbb{H})" />.
        </p>
      </div>

      {/* ─── Geometric / Spectral sides ─── */}
      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Geometric side</h3>
          <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            {R.geometricSide.description}
          </p>
          <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            <strong style={{ color: '#fde68a' }}>Interpretation. </strong>
            {R.geometricSide.interpretation}
          </p>
          <p style={{ marginTop: 12, fontSize: 12, fontFamily: mono, color: '#64748b' }}>
            Riemann-explicit-formula analog: <em>{R.geometricSide.analogInExplicitFormula}</em>
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Spectral side</h3>
          <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            {R.spectralSide.description}
          </p>
          <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
            <strong style={{ color: '#a7f3d0' }}>Interpretation. </strong>
            {R.spectralSide.interpretation}
          </p>
          <p style={{ marginTop: 12, fontSize: 12, fontFamily: mono, color: '#64748b' }}>
            Riemann-explicit-formula analog: <em>{R.spectralSide.analogInExplicitFormula}</em>
          </p>
        </div>
      </div>

      {/* ─── Why-it-matters paragraphs ─── */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #a855f7' }}>
        <h3 style={{ color: '#a855f7' }}>Why it matters for the ZPO / Lambda project</h3>
        {R.whyItMatters.map((p, i) => (
          <p
            key={i}
            style={{
              marginTop: i === 0 ? 12 : 16,
              color: 'var(--text-secondary)',
              fontSize: 13,
              lineHeight: 1.75,
            }}
          >
            {p}
          </p>
        ))}
      </div>

      {/* ─── Correspondence table ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#06b6d4' }}>
          Selberg <span style={{ color: '#64748b' }}>↔</span> Riemann correspondence
        </h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          Structural match between trace-formula constituents and explicit-formula constituents.
          The Selberg setting realizes the Hilbert-Polya philosophy where the Riemann setting
          conjectures it.
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: mono,
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #475569' }}>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#3b82f6' }}>
                  Riemann explicit formula
                </th>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#10b981' }}>
                  Selberg trace formula
                </th>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#64748b' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {R.correspondenceTable.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '8px', verticalAlign: 'top' }}>{row.riemann}</td>
                  <td style={{ padding: '8px', verticalAlign: 'top' }}>{row.selberg}</td>
                  <td style={{ padding: '8px', verticalAlign: 'top', color: '#94a3b8' }}>
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── References ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#f97316' }}>References</h3>
        <ul style={{ marginTop: 12, paddingLeft: 18, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
          {R.references.map((ref, i) => (
            <li key={i} style={{ marginBottom: 10 }}>
              <strong style={{ color: '#fdba74' }}>
                {ref.authors.join(', ')} ({ref.year}).
              </strong>{' '}
              <em>{ref.title}.</em> {ref.venue}.
              <br />
              <span style={{ color: '#64748b', fontSize: 12 }}>
                role: <code style={{ fontFamily: mono }}>{ref.role}</code> — {ref.note}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Project relevance ─── */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 10 }}>
          Project tickets touching this material
        </h3>
        <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
          {R.projectRelevance.map((p, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <strong style={{ color: '#93c5fd', fontFamily: mono }}>{p.ticket}</strong>{' '}
              — <em>{p.title}.</em> {p.relation}
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Related pages ─── */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/hamiltonian" style={{ color: '#06b6d4', fontSize: 13 }}>
            Hamiltonian (energy landscape)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/lambda-timeline" style={{ color: '#10b981', fontSize: 13 }}>
            Lambda timeline
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/full-story" style={{ color: '#a855f7', fontSize: 13 }}>
            Full project story
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/concepts" style={{ color: '#f59e0b', fontSize: 13 }}>
            Concepts
          </Link>
        </div>
      </div>
    </div>
  );
}
