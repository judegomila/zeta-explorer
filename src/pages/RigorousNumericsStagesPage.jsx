// RigorousNumericsStagesPage.jsx -- imp-1220
// Companion page rendering §20 of research-inputs/twin_ladder_consolidated_v52.pdf:
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

import React from 'react';
import { Link } from 'react-router-dom';
import { RIGOROUS_NUMERICS_STAGES, findStage } from '../data/rigorous-numerics-stages.js';

const R = RIGOROUS_NUMERICS_STAGES;
const mono = 'var(--font-mono)';

// Color theme per stage -- I = emerald (classical baseline), II = cyan
// (exploration), III = violet (certification).
const STAGE_COLORS = {
  I:   { fg: '#10b981', bg: 'rgba(16,185,129,0.10)', border: '#10b981' },
  II:  { fg: '#06b6d4', bg: 'rgba(6,182,212,0.10)',  border: '#06b6d4' },
  III: { fg: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: '#a855f7' },
};

// Status badge colors -- green for implemented, amber for partial, red for
// not-started. Pure presentation; the canonical status string lives in the
// data module.
const STATUS_COLORS = {
  'stage-implemented': { fg: '#10b981', bg: 'rgba(16,185,129,0.10)', border: '#10b981', label: 'implemented' },
  'stage-partial':     { fg: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: '#fbbf24', label: 'partial' },
  'stage-not-started': { fg: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: '#ef4444', label: 'not started' },
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
        <span style={{ fontFamily: mono, fontSize: 12, color: '#64748b' }}>
          {stage.sectionRef}
        </span>
        <StatusBadge status={stage.status} />
      </div>

      {/* ─── Paper description (prose) ─── */}
      <p
        style={{
          marginTop: 14,
          color: 'var(--text-secondary)',
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
              color: '#94a3b8',
              marginBottom: 6,
            }}
          >
            Paper steps:
          </div>
          <ol
            style={{
              margin: 0,
              paddingLeft: 22,
              color: 'var(--text-secondary)',
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
            color: '#cbd5e1',
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
                  borderBottom: '1px solid rgba(100,116,139,0.20)',
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
                    color: 'var(--text-secondary)',
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

      {/* ─── Gaps ─── */}
      <div
        style={{
          marginTop: 18,
          padding: '12px 14px',
          borderLeft: '2px solid #ef4444',
          background: 'rgba(15,23,42,0.5)',
        }}
      >
        <h4
          style={{
            color: '#f87171',
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
            color: '#cbd5e1',
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
    <div className="page">
      <div className="page-header">
        <h1>Rigorous Numerics Stages (§20)</h1>
        <p
          className="page-subtitle"
          style={{ fontFamily: mono, color: 'var(--text-secondary)' }}
        >
          {R.title} — {R.paperRef}
        </p>
      </div>

      {/* ─── Intro ─── */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>
          The three-stage rigorous-numerics program
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
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
            color: 'var(--text-secondary)',
            fontSize: 14,
            lineHeight: 1.75,
          }}
        >
          <strong style={{ color: '#fbbf24' }}>{R.oneLine}</strong>
        </p>
      </div>

      {/* ─── Status summary strip ─── */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ color: '#a855f7', marginBottom: 12 }}>
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
                borderBottom: '1px solid #334155',
                color: '#94a3b8',
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
            </tr>
          </thead>
          <tbody>
            {R.stages.map((s) => {
              const col = STAGE_COLORS[s.stageNumber];
              return (
                <tr
                  key={s.stageNumber}
                  style={{ borderBottom: '1px solid #1e293b' }}
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
                      color: '#64748b',
                      fontFamily: mono,
                    }}
                  >
                    {s.sectionRef}
                  </td>
                  <td style={{ padding: '10px 6px', color: '#cbd5e1' }}>
                    {s.title}
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      color: '#cbd5e1',
                      fontFamily: mono,
                    }}
                  >
                    {s.currentAppInfrastructure.length}
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      color: '#fbbf24',
                      fontFamily: mono,
                    }}
                  >
                    {s.gaps.length}
                  </td>
                  <td style={{ padding: '10px 6px' }}>
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p
          style={{
            marginTop: 10,
            color: '#64748b',
            fontSize: 12,
            fontFamily: mono,
          }}
        >
          findStage('III') ={' '}
          <span style={{ color: '#a855f7' }}>
            {findStage('III').title}
          </span>{' '}
          — helper smoke test.
        </p>
      </div>

      {/* ─── Per-stage cards ─── */}
      <h2
        style={{
          marginTop: 28,
          color: '#e2e8f0',
          fontSize: 22,
          fontFamily: mono,
        }}
      >
        The three stages
      </h2>
      {R.stages.map((stage) => (
        <StageCard key={stage.stageNumber} stage={stage} />
      ))}

      {/* ─── Related pages ─── */}
      <div
        className="card"
        style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}
      >
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>
          Related pages
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/zeta" style={{ color: '#10b981', fontSize: 13 }}>
            Zeta (Stage I infrastructure)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/supercritical" style={{ color: '#06b6d4', fontSize: 13 }}>
            Supercritical (Stage II infrastructure)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/hamiltonian" style={{ color: '#06b6d4', fontSize: 13 }}>
            Hamiltonian (Stage II UI)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/dyson-verifier" style={{ color: '#a855f7', fontSize: 13 }}>
            Dyson Verifier (Stage III runtime)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rigor-dashboard" style={{ color: '#a855f7', fontSize: 13 }}>
            Rigor Dashboard
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/closure-routes" style={{ color: '#fbbf24', fontSize: 13 }}>
            Four Closure Routes (§16)
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/paper" style={{ color: '#f59e0b', fontSize: 13 }}>
            Paper
          </Link>
        </div>
      </div>
    </div>
  );
}
