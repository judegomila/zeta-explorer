// FreezingBridgePage.jsx -- imp-1221
// Renders Section 23 ("Freezing, Bridge Renormalization, and a Targeted
// No-Ghost Approach") of the user's paper "Twin-Ladder Deformations of xi"
// v52 (research-inputs/twin_ladder_consolidated_v52.pdf, pages 32-36):
//
//   23.1  What a freeze can and cannot do                  (Prop. 23.1)
//   23.2  Schur-complement freezing preserves negative index (Prop. 23.2)
//   23.3  Endpoint bridges as finite-window positivity repairs (Lemma 23.3)
//   23.4  Frozen coherent-shell domination                 (Principle 23.4)
//   23.5  Can a clever freeze finish the proof?            (Conjecture 23.5)
//   23.6  A practical next experiment                      (5-step protocol)
//   23.7  Conclusion of the freeze approach
//
// Pure rendering. All tripwires live in
// src/data/freezing-bridge-section.js.
//
// Editorial (warm) re-theme: full-width shell, identical structure/data.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { FREEZING_BRIDGE_SECTION } from '../data/freezing-bridge-section.js';

const S = FREEZING_BRIDGE_SECTION;
const mono = 'var(--ed-mono, var(--font-mono))';

// Editorial palette only defines brass / brass-dk / terra / terra-dk / green /
// blue — cycle the seven subsections across those warm accents (was a wider
// dark-theme rainbow of purple/cyan/green/amber/pink/violet/blue).
const SUBSECTION_ACCENTS = {
  '23.1': 'var(--terra-dk)', // diagnostic — what freezing can't do
  '23.2': 'var(--blue)',     // Schur / inertia
  '23.3': 'var(--green)',    // finite-window certificate
  '23.4': 'var(--brass-dk)', // frozen-shell domination
  '23.5': 'var(--terra)',    // verdict on clever freeze
  '23.6': 'var(--brass)',    // practical experiment
  '23.7': 'var(--blue)',     // conclusion
};

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
  marginBottom: 6,
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
      <span style={{ color: 'var(--faint)', marginRight: 8 }}>§{tag}</span>
      {children}
    </h3>
  );
}

function SubsectionCard({ sub }) {
  const accent = SUBSECTION_ACCENTS[sub.id] || 'var(--faint)';
  return (
    <div className="card" style={{ marginTop: 24, ...cardBaseLeft(accent) }}>
      <SectionHeader tag={sub.id} color={accent}>
        {sub.name}
      </SectionHeader>

      <p
        style={{
          color: 'var(--ink-soft)',
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
          background: 'var(--paper)',
          border: '1px solid var(--hairline)',
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
        <div style={{ color: 'var(--ink)', fontSize: 13, lineHeight: 1.7 }}>
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
          color: 'var(--faint)',
        }}
      >
        verdict: <code style={{ color: 'var(--ink-soft)' }}>{sub.verdict}</code>
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
    S.s23_5.cleverFreezeVerdict === 'NO' ? 'var(--terra-dk)' : 'var(--green)';

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        {/* ─── Header ─── */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>
            {S.title} (§{S.paperSection})
          </h1>
          <p style={{ fontFamily: mono, color: 'var(--ink-soft)', fontSize: 13 }}>
            §{S.paperSection} of the consolidated twin-ladder paper ·
            pages {S.paperPageRange[0]}–{S.paperPageRange[1]} · ticket{' '}
            <code style={{ color: 'var(--blue)' }}>{S.ticketId}</code>
          </p>
        </div>

        {/* ─── Intro + recall of shifted bridge ─── */}
        <div className="card" style={{ marginTop: 12, ...cardBaseLeft('var(--terra-dk)') }}>
          <h3 style={{ color: 'var(--terra-dk)', fontFamily: mono, fontSize: 14 }}>
            Why this section exists
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 10 }}>
            {S.intro}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 12 }}>
            Recall the shifted bridge object from §15 (
            <Link to="/shift-bridge-positivity" style={{ color: 'var(--terra-dk)', fontFamily: mono }}>
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
            ...cardBaseLeft(verdictColor),
            background: 'color-mix(in srgb, var(--series-2) 5%, transparent)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: 'var(--faint)',
              }}
            >
              §23.5 verdict
            </div>
            <div style={{ fontFamily: mono, fontSize: 13, color: 'var(--ink)' }}>
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
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
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
          style={{ marginTop: 24, ...cardBaseLeft('var(--brass)'), background: 'color-mix(in srgb, var(--brass) 5%, transparent)' }}
        >
          <h3 style={{ color: 'var(--brass)', fontFamily: mono, fontSize: 14 }}>
            Practical next experiment (§23.6 protocol)
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 10 }}>
            The §23.6 protocol turns the philosophical no-ghost statement into a
            falsifiable, pass/fail numerical certification — the same shape used
            earlier for zero-transfer windows. Persistent zero index supports
            no-ghost on the chosen window <InlineMath tex="W \subset \mathbb{C}_{+}" />;
            a nonzero index produces an explicit ghost witness.
          </p>
          <ol style={{ marginTop: 14, paddingLeft: 22, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.85 }}>
            {S.s23_6.fiveSteps.map((step, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--brass-dk)', fontFamily: mono }}>step {i + 1}.</span>{' '}
                {step}
              </li>
            ))}
          </ol>
          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              background: 'var(--paper)',
              border: '1px solid var(--hairline)',
              borderRadius: 6,
              fontFamily: mono,
              fontSize: 11,
              color: 'var(--ink-soft)',
            }}
          >
            pass/fail certification ⇒ same shape as the zero-transfer-window
            protocol; not a proof until exhaustion + tail bounds are uniform.
          </div>
        </div>

        {/* ─── Why it matters ─── */}
        <div className="card" style={{ marginTop: 24, ...cardBaseLeft('var(--blue)') }}>
          <div style={cardLabel}>Why this section matters for the Λ project</div>
          {S.whyItMatters.map((p, i) => (
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

        {/* ─── References ─── */}
        <div className="card" style={{ marginTop: 24, ...cardBaseLeft('var(--brass-dk)') }}>
          <div style={cardLabel}>References</div>
          <ul style={{ marginTop: 6, paddingLeft: 18, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
            {S.references.map((ref, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <strong style={{ color: 'var(--brass-dk)' }}>
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

        {/* ─── Sibling sections ─── */}
        <div className="card" style={{ marginTop: 24, ...cardBaseLeft('var(--green)') }}>
          <div style={cardLabel}>Sibling sections of the twin-ladder paper</div>
          <ul style={{ paddingLeft: 18, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
            {S.relatedSections.map((r) => (
              <li key={r.ticket} style={{ marginBottom: 10 }}>
                <Link to={r.route} style={{ color: 'var(--green)', fontFamily: mono, fontSize: 13 }}>
                  §{r.paperSection} — {r.label}
                </Link>{' '}
                <span style={{ color: 'var(--faint)', fontSize: 12 }}>
                  (ticket <code style={{ fontFamily: mono }}>{r.ticket}</code>)
                </span>
                <br />
                <span style={{ color: 'var(--faint)', fontSize: 12 }}>{r.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Related pages ─── */}
        <div className="card" style={{ marginTop: 24, ...cardBaseLeft('var(--hairline)') }}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <Link to="/shift-bridge-positivity" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>
              §15 Shift-bridge
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/closure-routes" style={{ color: 'var(--green)', fontSize: 13 }}>
              §16 Closure routes
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/blaschke-ghosts" style={{ color: 'var(--terra)', fontSize: 13 }}>
              §17 Blaschke ghosts
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/three-attacks" style={{ color: 'var(--brass)', fontSize: 13 }}>
              §18 Three approaches
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/frozen-rung-pt-equivalence" style={{ color: 'var(--green)', fontSize: 13 }}>
              Frozen-rung ⟺ PT
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/flow-blindness-no-go" style={{ color: 'var(--terra)', fontSize: 13 }}>
              Flow-blindness no-go
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/literature" style={{ color: 'var(--blue)', fontSize: 13 }}>
              Literature
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--faint)', fontSize: 13 }}>
              ← the atlas
            </Link>
          </div>
        </div>

        {/* ─── Source footer ─── */}
        <div
          style={{
            marginTop: 24,
            padding: '12px 16px',
            color: 'var(--faint)',
            fontFamily: mono,
            fontSize: 11,
            borderTop: '1px solid var(--hairline)',
          }}
        >
          Source: <code>{S.paperSource}</code>, §{S.paperSection} (
          {S.paperSectionTitle}), pages {S.paperPageRange[0]}–
          {S.paperPageRange[1]}. Rendered by{' '}
          <code>src/pages/FreezingBridgePage.jsx</code>; tripwires in{' '}
          <code>src/data/freezing-bridge-section.js</code>.
        </div>
      </div>
    </div>
  );
}
