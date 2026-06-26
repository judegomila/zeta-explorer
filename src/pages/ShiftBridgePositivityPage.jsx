// ShiftBridgePositivityPage.jsx -- imp-1196
// Renders Section 15 ("Shift-Bridge Reflection Positivity and a Godelian
// Witness Principle") of the user's paper "Twin-Ladder Deformations of xi"
// v52 (research-inputs/twin_ladder_consolidated_v52.pdf, pages 22-26):
//
//   - Centered completed function X(w) = xi(1/2 + w)
//   - Horizontal displacement parameter Delta
//   - Shifted bridge (E_a, E_a^#, Theta_a, K_a)
//   - Shift-bridge threshold theorem (Theorem 15.1)
//   - Godelian-witness paragraph (Section 15.5)
//   - Prime-delay interpretation (Section 15.7)
//   - Three new conjectures (15.2, 15.3, 15.4) + Principle 15.5
//
// Pure rendering. All tripwires live in
// src/data/shift-bridge-positivity-section.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { SHIFT_BRIDGE_POSITIVITY } from '../data/shift-bridge-positivity-section.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';

const S = SHIFT_BRIDGE_POSITIVITY;
const mono = 'var(--font-mono)';

function SectionHeader({ tag, color, children }) {
  return (
    <h3
      style={{
        color,
        marginBottom: 8,
        fontFamily: mono,
        fontSize: 15,
        letterSpacing: 0.3,
      }}
    >
      <span style={{ color: '#475569', marginRight: 8 }}>{tag}</span>
      {children}
    </h3>
  );
}

function ConjectureCard({ c, accent }) {
  return (
    <div
      className="card"
      style={{
        marginTop: 12,
        borderLeft: `3px solid ${accent}`,
        background: 'rgba(15, 23, 42, 0.35)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: accent, fontFamily: mono, fontSize: 13 }}>
          {c.label}
        </span>
        <span style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>
          {c.shortName}
        </span>
        {c.equivalentToRH && (
          <span
            style={{
              marginLeft: 'auto',
              color: '#10b981',
              fontFamily: mono,
              fontSize: 11,
              border: '1px solid #064e3b',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            equivalent to RH
          </span>
        )}
      </div>
      <p
        style={{
          marginTop: 10,
          color: 'var(--text-secondary)',
          fontSize: 13,
          lineHeight: 1.75,
        }}
      >
        {c.statement}
      </p>
      <div style={{ marginTop: 10, overflowX: 'auto' }}>
        <BlockMath tex={c.statementLaTeX} />
      </div>
    </div>
  );
}

export default function ShiftBridgePositivityPage() {
  return (
    <div className="page">
      {/* ─── Header ─── */}
      <div className="page-header">
        <h1>{S.title}</h1>
        <p
          className="page-subtitle"
          style={{ fontFamily: mono, color: 'var(--text-secondary)' }}
        >
          §{S.paperSection} of the twin-ladder consolidated draft v52 ·
          pages {S.paperPageRange[0]}–{S.paperPageRange[1]} · ticket{' '}
          <code style={{ color: '#93c5fd' }}>{S.ticketId}</code>
        </p>
      </div>

      {/* ─── Honest verdict (imp-2987): the finite-N* "beat" infrastructure on
           this page is an ESTIMATE gated on the undischargeable C_H, never an
           unconditional finite-N rigorous beat. ─── */}
      <HonestCeilingBanner variant="ESTIMATE" />

      {/* ─── Summary ─── */}
      <div
        className="card"
        style={{ marginTop: 12, borderLeft: '3px solid #a855f7' }}
      >
        <SectionHeader tag="15.1" color="#a855f7">
          Purpose of this section
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.summary}
        </p>
      </div>

      {/* ─── Centered completed function ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <SectionHeader tag="15.2" color="#06b6d4">
          The centered completed function{' '}
          <InlineMath tex="X(w) := \xi(\tfrac{1}{2} + w)" />
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.centeredCompletedFunction.description}
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={S.centeredCompletedFunction.definitionLaTeX} />
          <BlockMath tex={S.centeredCompletedFunction.evennessLaTeX} />
          <BlockMath
            tex={S.centeredCompletedFunction.zeroCorrespondenceLaTeX}
          />
        </div>
        <p
          style={{
            marginTop: 12,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          The <strong style={{ color: '#fde68a' }}>horizontal zero-displacement</strong>{' '}
          parameter:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={S.centeredCompletedFunction.displacementLaTeX} />
          <BlockMath tex={S.centeredCompletedFunction.classicalStripLaTeX} />
          <BlockMath tex={S.centeredCompletedFunction.rhRestatementLaTeX} />
        </div>
      </div>

      {/* ─── Shifted bridge ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <SectionHeader tag="15.3" color="#10b981">
          The shifted bridge{' '}
          <InlineMath tex="(E_a, E_a^{\#}, \Theta_a, K_a)" />
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.shiftedBridge.description}
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={S.shiftedBridge.EaLaTeX} />
          <BlockMath tex={S.shiftedBridge.EaSharpLaTeX} />
          <BlockMath tex={S.shiftedBridge.thetaRatioLaTeX} />
          <BlockMath tex={S.shiftedBridge.afterSubstitutionLaTeX} />
          <BlockMath tex={S.shiftedBridge.contractivityLaTeX} />
        </div>
        <p
          style={{
            marginTop: 12,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          In the original variable <InlineMath tex="s = 1/2 + w" />:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={S.shiftedBridge.inXiVariableLaTeX} />
        </div>
        <p
          style={{
            marginTop: 16,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          The de Branges reproducing kernel attached to{' '}
          <InlineMath tex="(E_a, E_a^{\#})" />:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={S.shiftedBridge.kernelLaTeX} />
        </div>
      </div>

      {/* ─── Threshold theorem ─── */}
      <div
        className="card"
        style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}
      >
        <SectionHeader tag="15.4" color="#f59e0b">
          {S.thresholdTheorem.label}
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.thresholdTheorem.statement}
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={S.thresholdTheorem.statementLaTeX} />
        </div>
        <h4
          style={{
            marginTop: 18,
            color: '#fbbf24',
            fontFamily: mono,
            fontSize: 13,
          }}
        >
          Proof sketch
        </h4>
        <p
          style={{
            marginTop: 6,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.thresholdTheorem.proofSketch}
        </p>
        <p
          style={{
            marginTop: 10,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          Key identity for a same-height pair{' '}
          <InlineMath tex="\delta \pm i\gamma" /> with{' '}
          <InlineMath tex="Q_{\delta,\gamma}(w) = (w - i\gamma)^2 - \delta^2" />,{' '}
          <InlineMath tex="w = x + iy" />,{' '}
          <InlineMath tex="Y = y - \gamma" />:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={S.thresholdTheorem.keyIdentityLaTeX} />
        </div>
      </div>

      {/* ─── Godelian witness ─── */}
      <div
        className="card"
        style={{ marginTop: 24, borderLeft: '3px solid #ec4899' }}
      >
        <SectionHeader tag="15.5" color="#ec4899">
          The Godelian witness
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.godelianWitness}
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={S.godelianWitnessPointLaTeX} />
        </div>
      </div>

      {/* ─── Prime-delay interpretation ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <SectionHeader tag="15.7" color="#8b5cf6">
          Prime-delay interpretation
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.primeDelayInterpretation}
        </p>
        <p
          style={{
            marginTop: 14,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          Infinitesimal drift form (the <InlineMath tex="a \to 0^+" /> limit
          of the shift-bridge inequality):
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={S.primeDelayDriftLaTeX} />
        </div>
        <p
          style={{
            marginTop: 14,
            fontFamily: mono,
            fontSize: 12,
            color: '#64748b',
          }}
        >
          domination principle: <em>completed gamma/kernel drift &gt; coherent prime-delay pull</em>
        </p>
      </div>

      {/* ─── Conjectures 15.2 / 15.3 / 15.4 ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <SectionHeader tag="15.9" color="#06b6d4">
          Suggested additions to the conjecture list
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          The shift-bridge threshold theorem is unconditional; the three
          conjectures below are the precise RH-equivalent positivity
          statements it enables.
        </p>
        {S.conjectures.map((c, i) => (
          <ConjectureCard
            key={c.id}
            c={c}
            accent={['#10b981', '#f59e0b', '#a855f7'][i % 3]}
          />
        ))}
      </div>

      {/* ─── Principle 15.5 ─── */}
      <div
        className="card"
        style={{
          marginTop: 24,
          background: 'rgba(168, 85, 247, 0.06)',
          borderLeft: '3px solid #a855f7',
        }}
      >
        <SectionHeader tag="15.5" color="#a855f7">
          {S.principle155.label}
        </SectionHeader>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.principle155.statement}
        </p>
      </div>

      {/* ─── Why it matters ─── */}
      <div
        className="card"
        style={{ marginTop: 24, borderLeft: '3px solid #3b82f6' }}
      >
        <h3 style={{ color: '#3b82f6' }}>
          Why this section matters for the Λ project
        </h3>
        {S.whyItMatters.map((p, i) => (
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

      {/* ─── References ─── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ color: '#f97316' }}>References</h3>
        <ul
          style={{
            marginTop: 12,
            paddingLeft: 18,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.references.map((ref, i) => (
            <li key={i} style={{ marginBottom: 10 }}>
              <strong style={{ color: '#fdba74' }}>
                {ref.authors.join(', ')} ({ref.year}).
              </strong>{' '}
              <em>{ref.title}.</em> {ref.venue}.
              <br />
              <span style={{ color: '#64748b', fontSize: 12 }}>
                role:{' '}
                <code style={{ fontFamily: mono }}>{ref.role}</code> —{' '}
                {ref.note}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Project relevance ─── */}
      <div
        className="card"
        style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}
      >
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 10 }}>
          Project tickets touching this material
        </h3>
        <ul
          style={{
            paddingLeft: 18,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.projectRelevance.map((p, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <strong style={{ color: '#93c5fd', fontFamily: mono }}>
                {p.ticket}
              </strong>{' '}
              — <em>{p.title}.</em> {p.relation}
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Sibling sections (16 / 17 / 18) ─── */}
      <div
        className="card"
        style={{ marginTop: 24, background: 'rgba(16, 185, 129, 0.04)' }}
      >
        <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 10 }}>
          Continue to sibling sections of the v52 paper
        </h3>
        <ul
          style={{
            paddingLeft: 18,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.relatedSections.map((r) => (
            <li key={r.ticket} style={{ marginBottom: 10 }}>
              <Link
                to={r.route}
                style={{
                  color: '#10b981',
                  fontFamily: mono,
                  fontSize: 13,
                }}
              >
                §{r.paperSection} — {r.label}
              </Link>{' '}
              <span style={{ color: '#64748b', fontSize: 12 }}>
                (ticket{' '}
                <code style={{ fontFamily: mono }}>{r.ticket}</code>)
              </span>
              <br />
              <span style={{ color: '#94a3b8', fontSize: 12 }}>
                {r.description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Related pages ─── */}
      <div
        className="card"
        style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}
      >
        <h3
          style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}
        >
          Related pages
        </h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Link to="/closure-routes" style={{ color: '#10b981', fontSize: 13 }}>
            §16 Closure routes
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/blaschke-ghosts" style={{ color: '#ec4899', fontSize: 13 }}>
            §17 Blaschke ghosts
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/three-attacks" style={{ color: '#f59e0b', fontSize: 13 }}>
            §18 Three attacks
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/selberg-trace" style={{ color: '#06b6d4', fontSize: 13 }}>
            Selberg trace
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rh-equivalents" style={{ color: '#a855f7', fontSize: 13 }}>
            RH equivalents
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/literature" style={{ color: '#3b82f6', fontSize: 13 }}>
            Literature
          </Link>
        </div>
      </div>

      {/* ─── Source footer ─── */}
      <div
        style={{
          marginTop: 24,
          padding: '12px 16px',
          color: '#475569',
          fontFamily: mono,
          fontSize: 11,
          borderTop: '1px solid #1e293b',
        }}
      >
        Source: <code>{S.paperSource}</code>, §{S.paperSection} (
        {S.paperSectionTitle}), pages {S.paperPageRange[0]}–
        {S.paperPageRange[1]}. Rendered by{' '}
        <code>src/pages/ShiftBridgePositivityPage.jsx</code>; tripwires in{' '}
        <code>src/data/shift-bridge-positivity-section.js</code>.
      </div>
    </div>
  );
}
