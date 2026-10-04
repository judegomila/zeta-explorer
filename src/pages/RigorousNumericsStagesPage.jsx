// RigorousNumericsStagesPage.jsx -- imp-1220
// Companion page rendering §20 as carried forward in twin-ladder. The data module
// retains the historic v52 mapping provenance and the twin-ladder transferability audit.
// "Rigorous-numerics program" (Stage I / II / III).
//
// Structure:
//   1. Header + intro ("three-stage program at a glance").
//   2. Status-summary strip (3 colored badges, one per stage).
//   3. Per-stage vertical card:
//        - title + section ref + status badge
//        - paper description (verbatim/near-verbatim)
//        - bulleted paper steps (Stage I has 5)
//        - "Current app infrastructure" subsection (path + brief, one row each)
//        - "Gaps" subsection (red-bordered list)
//   4. Related-Pages footer.
//
// All structural facts come from src/data/rigorous-numerics-stages.js (imp-1220).
// This file is presentation-only; tripwires live in the data module.
//
// Editorial (warm) re-theme: full-width shell, identical structure/data.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { RIGOROUS_NUMERICS_STAGES, findStage } from '../data/rigorous-numerics-stages.js';
import { StatusTag } from '../components/StatusLegend.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha } from '../styles/tokens.js';

const R = RIGOROUS_NUMERICS_STAGES;
const mono = 'var(--ed-mono, var(--font-mono))';

const RIGOR_TIER_STATUS = {
  rigorous:    'RIGOROUS-SOTA',
  conditional: 'CONDITIONAL',
  estimate:    'ESTIMATE',
};

// Color theme per stage -- I = green (classical baseline), II = blue
// (exploration), III = brass (certification).
const STAGE_COLORS = {
  I:   { fg: 'var(--green)',    bg: alpha(ED.series3, 0.1),   border: 'var(--green)' },
  II:  { fg: 'var(--blue)',     bg: alpha(ED.series1, 0.1),  border: 'var(--blue)' },
  III: { fg: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.1),  border: 'var(--brass-dk)' },
};

// Status badge colors -- green for implemented, brass for partial, terra for
// not-started. Pure presentation; the canonical status string lives in the
// data module.
const STATUS_COLORS = {
  'stage-implemented': { fg: 'var(--green)',    bg: alpha(ED.series3, 0.1),  border: 'var(--green)',    label: 'implemented' },
  'stage-partial':     { fg: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.12), border: 'var(--brass-dk)', label: 'partial' },
  'stage-not-started': { fg: 'var(--terra-dk)', bg: alpha(ED.series2, 0.1),  border: 'var(--terra-dk)', label: 'not started' },
};

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS['stage-partial'];
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 11,
        padding: '3px 10px',
        borderRadius: 4,
        color: sc.fg,
        background: sc.bg,
        border: `1px solid ${sc.border}`,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {sc.label}
    </span>
  );
}

// ── Per-stage card ──────────────────────────────────────────────────────────
function StageCard({ stage }) {
  const col = STAGE_COLORS[stage.stageNumber];
  return (
    <div
      className="card"
      style={{
        marginTop: 20,
        borderLeft: `4px solid ${col.border}`,
        background: col.bg,
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
        <h3 style={{ color: col.fg, margin: 0, fontSize: 22 }}>
          Stage {stage.stageNumber}: {stage.title}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 12, color: 'var(--faint)' }}>
          {stage.sectionRef}
        </span>
        <StatusBadge status={stage.status} />
        {stage.rigorTier && (
          <StatusTag status={RIGOR_TIER_STATUS[stage.rigorTier] || 'ESTIMATE'} />
        )}
      </div>

      {/* ─── Paper description (prose) ─── */}
      <p
        style={{
          marginTop: 14,
          color: 'var(--ink-soft)',
          fontSize: 14,
          lineHeight: 1.75,
        }}
      >
        <strong style={{ color: col.fg }}>Paper description. </strong>
        {stage.paperDescription}
      </p>

      {/* ─── Paper bullets ─── */}
      {stage.paperBullets.length > 1 && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: 'var(--faint)',
              marginBottom: 6,
            }}
          >
            Paper steps:
          </div>
          <ol
            style={{
              margin: 0,
              paddingLeft: 22,
              color: 'var(--ink-soft)',
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            {stage.paperBullets.map((b, i) => (
              <li key={i} style={{ marginTop: 4 }}>
                {b}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ─── Current app infrastructure ─── */}
      <div style={{ marginTop: 18 }}>
        <h4
          style={{
            color: 'var(--ink)',
            fontSize: 14,
            margin: 0,
            marginBottom: 8,
            fontFamily: mono,
          }}
        >
          Current app infrastructure ({stage.currentAppInfrastructure.length})
        </h4>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <tbody>
            {stage.currentAppInfrastructure.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid var(--hairline)',
                }}
              >
                <td
                  style={{
                    padding: '8px 10px 8px 0',
                    verticalAlign: 'top',
                    fontFamily: mono,
                    color: col.fg,
                    whiteSpace: 'nowrap',
                    width: 1,
                  }}
                >
                  {row.path}
                </td>
                <td
                  style={{
                    padding: '8px 0',
                    verticalAlign: 'top',
                    color: 'var(--ink-soft)',
                    lineHeight: 1.65,
                  }}
                >
                  {row.brief}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── C_H blocker note ─── */}
      {stage.c_h_blocker && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          borderLeft: '3px solid var(--brass-dk)',
          background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
          fontSize: 13,
          color: 'var(--brass-dk)',
          lineHeight: 1.65,
        }}>
          <span style={{ fontFamily: mono, fontWeight: 700, marginRight: 6 }}>
            C_H BLOCKER:
          </span>
          {stage.c_h_blocker}
        </div>
      )}

      {/* ─── Gaps ─── */}
      <div
        style={{
          marginTop: 18,
          padding: '12px 14px',
          borderLeft: '2px solid var(--terra-dk)',
          background: 'var(--paper)',
        }}
      >
        <h4
          style={{
            color: 'var(--terra-dk)',
            fontSize: 14,
            margin: 0,
            marginBottom: 8,
            fontFamily: mono,
          }}
        >
          Gaps ({stage.gaps.length}) — what's missing for full stage closure
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            color: 'var(--ink-soft)',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {stage.gaps.map((g, i) => (
            <li key={i} style={{ marginTop: 4 }}>
              {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function RigorousNumericsStagesPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 12 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Rigorous Numerics Stages (§20)</h1>
          <p
            style={{ fontFamily: mono, color: 'var(--ink-soft)', fontSize: 14 }}
          >
            {R.title} — §20 of the consolidated twin-ladder paper
          </p>
        </div>

        <div
          className="card"
          style={{ marginTop: 12, borderLeft: '3px solid var(--brass-dk)' }}
        >
          <h3 style={{ color: 'var(--brass-dk)', marginBottom: 8 }}>
            twin-ladder certificate-transferability boundary
          </h3>
          <p
            style={{
              color: 'var(--ink-soft)',
              fontSize: 13,
              lineHeight: 1.75,
            }}
          >
            {R.transferabilityCaveat}
          </p>
          <p style={{ marginTop: 8, color: 'var(--faint)', fontFamily: mono, fontSize: 11 }}>
            Audit source: {R.correctionAuditRef}
          </p>
        </div>

        {/* ─── Intro ─── */}
        <div className="card" style={{ marginTop: 12 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: 8 }}>
            The three-stage rigorous-numerics program
          </h3>
          <p
            style={{
              color: 'var(--ink-soft)',
              fontSize: 14,
              lineHeight: 1.75,
            }}
          >
            Section 20 of the twin-ladder consolidated draft declares the
            rigorous-numerics program in three named stages. Each stage has a
            distinct technical goal and a distinct piece of in-tree
            infrastructure. The table below ties each stage to the existing
            code that implements its primitives, and names the gaps that remain
            before the stage closes in the sense of the paper.
          </p>
          <p
            style={{
              marginTop: 10,
              color: 'var(--ink-soft)',
              fontSize: 14,
              lineHeight: 1.75,
            }}
          >
            <strong style={{ color: 'var(--brass-dk)' }}>{R.oneLine}</strong>
          </p>
        </div>

        {/* ─── Status summary strip ─── */}
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ color: 'var(--brass-dk)', marginBottom: 12 }}>
            Status at a glance
          </h3>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--hairline)',
                  color: 'var(--faint)',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Stage</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>§</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Title</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>
                  Infrastructure
                </th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Gaps</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Status</th>
                <th style={{ padding: '8px 6px', fontFamily: mono }}>Rigor tier</th>
              </tr>
            </thead>
            <tbody>
              {R.stages.map((s) => {
                const col = STAGE_COLORS[s.stageNumber];
                return (
                  <tr
                    key={s.stageNumber}
                    style={{ borderBottom: '1px solid var(--hairline)' }}
                  >
                    <td
                      style={{
                        padding: '10px 6px',
                        color: col.fg,
                        fontFamily: mono,
                        fontWeight: 700,
                      }}
                    >
                      {s.stageNumber}
                    </td>
                    <td
                      style={{
                        padding: '10px 6px',
                        color: 'var(--faint)',
                        fontFamily: mono,
                      }}
                    >
                      {s.sectionRef}
                    </td>
                    <td style={{ padding: '10px 6px', color: 'var(--ink)' }}>
                      {s.title}
                    </td>
                    <td
                      style={{
                        padding: '10px 6px',
                        color: 'var(--ink)',
                        fontFamily: mono,
                      }}
                    >
                      {s.currentAppInfrastructure.length}
                    </td>
                    <td
                      style={{
                        padding: '10px 6px',
                        color: 'var(--brass-dk)',
                        fontFamily: mono,
                      }}
                    >
                      {s.gaps.length}
                    </td>
                    <td style={{ padding: '10px 6px' }}>
                      <StatusBadge status={s.status} />
                    </td>
                    <td style={{ padding: '10px 6px' }}>
                      {s.rigorTier && (
                        <StatusTag status={RIGOR_TIER_STATUS[s.rigorTier] || 'ESTIMATE'} />
                      )}
                      {s.c_h_blocker && (
                        <span
                          style={{
                            display: 'block',
                            marginTop: 4,
                            fontFamily: mono,
                            fontSize: 10,
                            color: 'var(--brass-dk)',
                            background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
                            border: '1px solid var(--brass-dk)',
                            borderRadius: 3,
                            padding: '1px 6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          C_H BLOCKED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p
            style={{
              marginTop: 10,
              color: 'var(--faint)',
              fontSize: 12,
              fontFamily: mono,
            }}
          >
            findStage('III') ={' '}
            <span style={{ color: 'var(--blue)' }}>
              {findStage('III').title}
            </span>{' '}
            — helper smoke test.
          </p>
        </div>

        {/* ─── Per-stage cards ─── */}
        <h2 className="ed-h2" style={{ marginTop: 28 }}>
          The three stages
        </h2>
        <AnimationEmbed id="barnes-hut" />
        {R.stages.map((stage) => (
          <StageCard key={stage.stageNumber} stage={stage} />
        ))}

        {/* ─── Related pages ─── */}
        <div
          className="card"
          style={{ marginTop: 24, background: 'var(--paper2)' }}
        >
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>
            Related pages
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/zeta" style={{ color: 'var(--green)', fontSize: 13 }}>
              Zeta (Stage I infrastructure)
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/supercritical" style={{ color: 'var(--blue)', fontSize: 13 }}>
              Supercritical (Stage II infrastructure)
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/hamiltonian" style={{ color: 'var(--blue)', fontSize: 13 }}>
              Hamiltonian (Stage II UI)
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/dyson-verifier" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>
              Dyson Verifier (Stage III runtime)
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/rigor-dashboard" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>
              Rigor Dashboard
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/closure-routes" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>
              Four Closure Routes (§16)
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/paper" style={{ color: 'var(--brass)', fontSize: 13 }}>
              Paper
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>
              ← the atlas
            </Link>
          </div>
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 16 }}>
            Source: <code>{R.paperRef}</code>. Historic app-mapping source:{' '}
            <code>{R.historicalPaperRef}</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
