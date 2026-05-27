// FreezingBridgePage.jsx -- imp-1221
// Renders Section 23 ("Freezing, Bridge Renormalization, and a Targeted
// No-Ghost Attack") of the user's paper "Twin-Ladder Deformations of xi"
// v52 (research-inputs/twin_ladder_consolidated_v52.pdf, pages 32-36):
//
//   23.1  What a freeze can and cannot do                  (Prop. 23.1)
//   23.2  Schur-complement freezing preserves negative index (Prop. 23.2)
//   23.3  Endpoint bridges as finite-window positivity repairs (Lemma 23.3)
//   23.4  Frozen coherent-shell domination                 (Principle 23.4)
//   23.5  Can a clever freeze finish the proof?            (Conjecture 23.5)
//   23.6  A practical next experiment                      (5-step protocol)
//   23.7  Conclusion of the freeze attack
//
// Pure rendering. All tripwires live in
// src/data/freezing-bridge-section.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { FREEZING_BRIDGE_SECTION } from '../data/freezing-bridge-section.js';

const S = FREEZING_BRIDGE_SECTION;
const mono = 'var(--font-mono)';

const SUBSECTION_ACCENTS = {
  '23.1': '#a855f7', // purple   — diagnostic
  '23.2': '#06b6d4', // cyan     — Schur / inertia
  '23.3': '#10b981', // green    — finite-window certificate
  '23.4': '#f59e0b', // amber    — frozen-shell domination
  '23.5': '#ec4899', // pink     — verdict on clever freeze
  '23.6': '#8b5cf6', // violet   — practical experiment
  '23.7': '#3b82f6', // blue     — conclusion
};

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
      <span style={{ color: '#475569', marginRight: 8 }}>§{tag}</span>
      {children}
    </h3>
  );
}

function SubsectionCard({ sub }) {
  const accent = SUBSECTION_ACCENTS[sub.id] || '#64748b';
  return (
    <div
      className="card"
      style={{
        marginTop: 24,
        borderLeft: `3px solid ${accent}`,
        background: 'rgba(15, 23, 42, 0.35)',
      }}
    >
      <SectionHeader tag={sub.id} color={accent}>
        {sub.name}
      </SectionHeader>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: 13,
          lineHeight: 1.75,
          marginTop: 4,
        }}
      >
        {sub.paperContent}
      </p>

      <div
        style={{
          marginTop: 14,
          padding: '10px 14px',
          borderRadius: 6,
          background: 'rgba(0, 0, 0, 0.25)',
          borderLeft: `2px solid ${accent}`,
        }}
      >
        <div
          style={{
            color: accent,
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          Key result
        </div>
        <div
          style={{
            color: '#e2e8f0',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {sub.keyResult}
        </div>
      </div>

      <div style={{ marginTop: 14, overflowX: 'auto' }}>
        <BlockMath tex={sub.kaTeXFormula} />
      </div>

      <div
        style={{
          marginTop: 10,
          fontFamily: mono,
          fontSize: 11,
          color: '#64748b',
        }}
      >
        verdict: <code style={{ color: '#94a3b8' }}>{sub.verdict}</code>
      </div>
    </div>
  );
}

export default function FreezingBridgePage() {
  const subsections = [
    S.s23_1,
    S.s23_2,
    S.s23_3,
    S.s23_4,
    S.s23_5,
    S.s23_6,
    S.s23_7,
  ];
  const verdictColor =
    S.s23_5.cleverFreezeVerdict === 'NO' ? '#ef4444' : '#10b981';

  return (
    <div className="page">
      {/* ─── Header ─── */}
      <div className="page-header">
        <h1>{S.title} (§{S.paperSection})</h1>
        <p
          className="page-subtitle"
          style={{ fontFamily: mono, color: 'var(--text-secondary)' }}
        >
          §{S.paperSection} of the twin-ladder consolidated draft v52 ·
          pages {S.paperPageRange[0]}–{S.paperPageRange[1]} · ticket{' '}
          <code style={{ color: '#93c5fd' }}>{S.ticketId}</code>
        </p>
      </div>

      {/* ─── Intro + recall of shifted bridge ─── */}
      <div
        className="card"
        style={{ marginTop: 12, borderLeft: '3px solid #a855f7' }}
      >
        <h3 style={{ color: '#a855f7', fontFamily: mono, fontSize: 14 }}>
          Why this section exists
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
            marginTop: 10,
          }}
        >
          {S.intro}
        </p>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
            marginTop: 12,
          }}
        >
          Recall the shifted bridge object from §15 (
          <Link
            to="/shift-bridge-positivity"
            style={{ color: '#a855f7', fontFamily: mono }}
          >
            /shift-bridge-positivity
          </Link>
          ):
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={S.shiftedBridgeRecallLaTeX} />
        </div>
      </div>

      {/* ─── Clever-freeze verdict badge ─── */}
      <div
        className="card"
        style={{
          marginTop: 16,
          background: 'rgba(239, 68, 68, 0.06)',
          borderLeft: `3px solid ${verdictColor}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            §23.5 verdict
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 13,
              color: '#e2e8f0',
            }}
          >
            Can a clever freeze finish the proof?
          </div>
          <div
            style={{
              marginLeft: 'auto',
              color: verdictColor,
              fontFamily: mono,
              fontSize: 13,
              border: `1px solid ${verdictColor}`,
              padding: '4px 10px',
              borderRadius: 4,
              fontWeight: 600,
            }}
          >
            {S.s23_5.cleverFreezeVerdict}
          </div>
        </div>
        <p
          style={{
            marginTop: 12,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          {S.s23_5.cleverFreezeVerdictExplained}
        </p>
      </div>

      {/* ─── Seven subsections (23.1 – 23.7) ─── */}
      {subsections.map((sub) => (
        <SubsectionCard key={sub.id} sub={sub} />
      ))}

      {/* ─── Practical next-experiment callout box ─── */}
      <div
        className="card"
        style={{
          marginTop: 24,
          background: 'rgba(139, 92, 246, 0.06)',
          borderLeft: '3px solid #8b5cf6',
        }}
      >
        <h3 style={{ color: '#8b5cf6', fontFamily: mono, fontSize: 14 }}>
          Practical next experiment (§23.6 protocol)
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
            marginTop: 10,
          }}
        >
          The §23.6 protocol turns the philosophical no-ghost statement into a
          falsifiable, pass/fail numerical certification — the same shape used
          earlier for zero-transfer windows. Persistent zero index supports
          no-ghost on the chosen window <InlineMath tex="W \subset \mathbb{C}_{+}" />;
          a nonzero index produces an explicit ghost witness.
        </p>
        <ol
          style={{
            marginTop: 14,
            paddingLeft: 22,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.85,
          }}
        >
          {S.s23_6.fiveSteps.map((step, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <span style={{ color: '#c4b5fd', fontFamily: mono }}>
                step {i + 1}.
              </span>{' '}
              {step}
            </li>
          ))}
        </ol>
        <div
          style={{
            marginTop: 14,
            padding: '10px 14px',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 6,
            fontFamily: mono,
            fontSize: 11,
            color: '#94a3b8',
          }}
        >
          pass/fail certification ⇒ same shape as the zero-transfer-window
          protocol; not a proof until exhaustion + tail bounds are uniform.
        </div>
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

      {/* ─── Sibling sections ─── */}
      <div
        className="card"
        style={{ marginTop: 24, background: 'rgba(16, 185, 129, 0.04)' }}
      >
        <h3 style={{ color: '#10b981', fontSize: 14, marginBottom: 10 }}>
          Sibling sections of the v52 paper
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
          <Link
            to="/shift-bridge-positivity"
            style={{ color: '#a855f7', fontSize: 13 }}
          >
            §15 Shift-bridge
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link
            to="/closure-routes"
            style={{ color: '#10b981', fontSize: 13 }}
          >
            §16 Closure routes
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link
            to="/blaschke-ghosts"
            style={{ color: '#ec4899', fontSize: 13 }}
          >
            §17 Blaschke ghosts
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link
            to="/three-attacks"
            style={{ color: '#f59e0b', fontSize: 13 }}
          >
            §18 Three attacks
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
        <code>src/pages/FreezingBridgePage.jsx</code>; tripwires in{' '}
        <code>src/data/freezing-bridge-section.js</code>.
      </div>
    </div>
  );
}
