// SelbergTracePage.jsx -- imp-1118
// Companion page rendering the imp-1104 SELBERG_TRACE_REFERENCE.
// Title, formula (KaTeX), geometric/spectral side descriptions,
// Riemann correspondence table, references, why-it-matters paragraphs.
// Pure rendering. 4+ tripwires live in src/data/selberg-trace-formula-reference.js.
//
// Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
// structure/data. Color mapping from the dark-theme accents (kept consistent
// with other editorial ports, e.g. EngineRoomPage.jsx):
//   #06b6d4 cyan   -> var(--blue)
//   #10b981 green  -> var(--green)
//   #f59e0b amber  -> var(--brass-dk)
//   #a855f7 violet -> var(--brass)
//   #3b82f6 blue   -> var(--blue)
//   #f97316 orange -> var(--terra-dk)
//   #64748b/#94a3b8/#475569/#1e293b/#334155 slate -> var(--faint) / var(--hairline)
//   #fde68a/#a7f3d0/#fdba74/#93c5fd (light accents) -> matching var(--*) accent

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { SELBERG_TRACE_REFERENCE } from '../data/selberg-trace-formula-reference.js';

const R = SELBERG_TRACE_REFERENCE;

const mono = 'var(--ed-mono, var(--font-mono))';

export default function SelbergTracePage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 12 }}>
          <h1 className="ed-h1">{R.title}</h1>
          <p style={{ fontFamily: mono, color: 'var(--ink-soft)', marginTop: 6 }}>
            Spectral analog of the Riemann explicit formula (imp-1104 / imp-1118)
          </p>
        </div>

        {/* ─── Formula ─── */}
        <div className="card" style={{ marginTop: 12 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: 8 }}>Statement of the formula</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
            For a sufficiently nice test function pair <InlineMath tex="(h, g)" /> related by
            the Fourier transform <InlineMath tex="g(u) = (1/2\pi) \int h(r) e^{-iru}\, dr" />,
            the Selberg trace formula on the modular surface{' '}
            <InlineMath tex="\Gamma \backslash \mathbb{H}" /> with <InlineMath tex="\Gamma = \mathrm{SL}(2, \mathbb{Z})" /> reads:
          </p>
          <div style={{ marginTop: 12, overflowX: 'auto' }}>
            <BlockMath tex={R.formulaLaTeX} />
          </div>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
            The left-hand side is the <strong style={{ color: 'var(--green)' }}>spectral sum</strong>{' '}
            over Laplacian eigenvalues <InlineMath tex="\lambda_n = 1/4 + r_n^2" /> of Maass cusp
            forms on <InlineMath tex="\Gamma \backslash \mathbb{H}" />. The right-hand side is
            the <strong style={{ color: 'var(--brass-dk)' }}>geometric (length) sum</strong> over
            hyperbolic conjugacy classes <InlineMath tex="\{P\}" /> of <InlineMath tex="\Gamma" />{' '}
            — equivalently, closed geodesics of length <InlineMath tex="\log N(P_0)" /> on the
            modular surface — plus an identity contribution proportional to the area{' '}
            <InlineMath tex="\mathrm{vol}(\Gamma \backslash \mathbb{H})" />.
          </p>
        </div>

        {/* ─── Geometric / Spectral sides ─── */}
        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card">
            <h3 style={{ color: 'var(--brass-dk)' }}>Geometric side</h3>
            <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              {R.geometricSide.description}
            </p>
            <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              <strong style={{ color: 'var(--brass-dk)' }}>Interpretation. </strong>
              {R.geometricSide.interpretation}
            </p>
            <p style={{ marginTop: 12, fontSize: 12, fontFamily: mono, color: 'var(--faint)' }}>
              Riemann-explicit-formula analog: <em>{R.geometricSide.analogInExplicitFormula}</em>
            </p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--green)' }}>Spectral side</h3>
            <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              {R.spectralSide.description}
            </p>
            <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
              <strong style={{ color: 'var(--green)' }}>Interpretation. </strong>
              {R.spectralSide.interpretation}
            </p>
            <p style={{ marginTop: 12, fontSize: 12, fontFamily: mono, color: 'var(--faint)' }}>
              Riemann-explicit-formula analog: <em>{R.spectralSide.analogInExplicitFormula}</em>
            </p>
          </div>
        </div>

        {/* ─── Why-it-matters paragraphs ─── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass)' }}>
          <h3 style={{ color: 'var(--brass)' }}>Why it matters for the Twin-Ladder Bridge / Lambda project</h3>
          {R.whyItMatters.map((p, i) => (
            <p
              key={i}
              style={{
                marginTop: i === 0 ? 12 : 16,
                color: 'var(--ink-soft)',
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
          <h3 style={{ color: 'var(--blue)' }}>
            Selberg <span style={{ color: 'var(--faint)' }}>↔</span> Riemann correspondence
          </h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
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
                color: 'var(--ink)',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--blue)' }}>
                    Riemann explicit formula
                  </th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--green)' }}>
                    Selberg trace formula
                  </th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--faint)' }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {R.correspondenceTable.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{row.riemann}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{row.selberg}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top', color: 'var(--faint)' }}>
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
          <h3 style={{ color: 'var(--terra-dk)' }}>References</h3>
          <ul style={{ marginTop: 12, paddingLeft: 18, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
            {R.references.map((ref, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <strong style={{ color: 'var(--terra-dk)' }}>
                  {ref.authors.join(', ')} ({ref.year}).
                </strong>{' '}
                <em>{ref.title}.</em> {ref.venue}.
                <br />
                <span style={{ color: 'var(--faint)', fontSize: 12 }}>
                  role: <code style={{ fontFamily: mono }}>{ref.role}</code> — {ref.note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Project relevance ─── */}
        <div className="card" style={{ marginTop: 24, background: 'var(--paper2)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 10 }}>
            Project tickets touching this material
          </h3>
          <ul style={{ paddingLeft: 18, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
            {R.projectRelevance.map((p, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <strong style={{ color: 'var(--blue)', fontFamily: mono }}>{p.ticket}</strong>{' '}
                — <em>{p.title}.</em> {p.relation}
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Related pages ─── */}
        <div className="card" style={{ marginTop: 24, background: 'var(--paper2)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/hamiltonian" style={{ color: 'var(--blue)', fontSize: 13 }}>
              Hamiltonian (energy landscape)
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/lambda-timeline" style={{ color: 'var(--green)', fontSize: 13 }}>
              Lambda timeline
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/full-story" style={{ color: 'var(--brass)', fontSize: 13 }}>
              Full project story
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/concepts" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>
              Concepts
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
