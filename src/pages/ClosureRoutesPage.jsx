// ClosureRoutesPage.jsx -- imp-1197
// Companion page rendering §16 of research-inputs/twin_ladder_consolidated_v52.pdf:
// "Four Equivalent Closure Routes for the Zero-Bridge-Thickness Problem".
//
// Structure:
//   1. Header + setup (centered completed function, bridge kernel, threshold).
//   2. Equivalence diagram (inline SVG, no D3 dep): 4 boxes A/B/C/D arranged
//      around a central "shared bottleneck" node with bidirectional arrows.
//   3. Per-route cards (statement + LaTeX + currentStatus + blocker + principle).
//   4. Shared-bottleneck section (Godelian witness principle).
//   5. Conjectures 16.4 and 16.6 highlighted at the bottom.
//   6. Related-Pages footer.
//
// All structural facts come from src/data/closure-routes-section.js (imp-1197).
// This file is presentation-only; tripwires live in the data module.

import React from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { CLOSURE_ROUTES, findRoute } from '../data/closure-routes-section.js';

const R = CLOSURE_ROUTES;
const mono = 'var(--font-mono)';

// Color theme per route -- consistent across diagram + cards.
const ROUTE_COLORS = {
  A: { fg: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: '#fbbf24' }, // amber
  B: { fg: '#10b981', bg: 'rgba(16,185,129,0.10)', border: '#10b981' }, // emerald
  C: { fg: '#06b6d4', bg: 'rgba(6,182,212,0.10)',  border: '#06b6d4' }, // cyan
  D: { fg: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: '#a855f7' }, // violet
};

// ── Equivalence diagram (inline SVG, no D3) ───────────────────────────────────
//
// Layout:
//
//     [A]  -------------- [B]
//        \              /
//         \   [bottle  /
//          \  -neck]  /
//         /          \
//        /            \
//     [D]  -------------- [C]
//
// All arrows are bidirectional (the four routes are mathematically equivalent).
// Each outer box connects to the centre and to its two diagonal neighbours.
function EquivalenceDiagram() {
  const W = 720;
  const H = 460;
  // Coordinates for the four corner boxes + the centre node.
  const boxW = 150;
  const boxH = 80;
  const positions = {
    A: { x: 60,           y: 40 },                   // top-left
    B: { x: W - 60 - boxW, y: 40 },                  // top-right
    C: { x: W - 60 - boxW, y: H - 40 - boxH },       // bottom-right
    D: { x: 60,           y: H - 40 - boxH },        // bottom-left
  };
  const centre = { cx: W / 2, cy: H / 2, w: 200, h: 80 };

  // Helper: midpoint of a box edge facing the centre / other boxes.
  const cx = (k) => positions[k].x + boxW / 2;
  const cy = (k) => positions[k].y + boxH / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 720, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Equivalence diagram: four routes A, B, C, D connected through a shared bottleneck"
    >
      <defs>
        <marker
          id="arrow-end"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
      </defs>

      {/* ─── Connecting edges (bidirectional, drawn first so boxes overlay) ─── */}
      {/* A <-> B (top edge) */}
      <line
        x1={cx('A')} y1={cy('A')} x2={cx('B')} y2={cy('B')}
        stroke="#64748b" strokeWidth="1.4"
        markerStart="url(#arrow-end)" markerEnd="url(#arrow-end)"
      />
      {/* B <-> C (right edge) */}
      <line
        x1={cx('B')} y1={cy('B')} x2={cx('C')} y2={cy('C')}
        stroke="#64748b" strokeWidth="1.4"
        markerStart="url(#arrow-end)" markerEnd="url(#arrow-end)"
      />
      {/* C <-> D (bottom edge) */}
      <line
        x1={cx('C')} y1={cy('C')} x2={cx('D')} y2={cy('D')}
        stroke="#64748b" strokeWidth="1.4"
        markerStart="url(#arrow-end)" markerEnd="url(#arrow-end)"
      />
      {/* D <-> A (left edge) */}
      <line
        x1={cx('D')} y1={cy('D')} x2={cx('A')} y2={cy('A')}
        stroke="#64748b" strokeWidth="1.4"
        markerStart="url(#arrow-end)" markerEnd="url(#arrow-end)"
      />
      {/* A <-> C diagonal */}
      <line
        x1={cx('A')} y1={cy('A')} x2={cx('C')} y2={cy('C')}
        stroke="#475569" strokeWidth="1" strokeDasharray="3 4"
      />
      {/* B <-> D diagonal */}
      <line
        x1={cx('B')} y1={cy('B')} x2={cx('D')} y2={cy('D')}
        stroke="#475569" strokeWidth="1" strokeDasharray="3 4"
      />

      {/* ─── Outer boxes A/B/C/D ─── */}
      {R.routes.map((route) => {
        const pos = positions[route.letter];
        const col = ROUTE_COLORS[route.letter];
        return (
          <g key={route.letter}>
            <rect
              x={pos.x} y={pos.y} width={boxW} height={boxH}
              rx="8" ry="8"
              fill={col.bg} stroke={col.border} strokeWidth="2"
            />
            <text
              x={pos.x + boxW / 2} y={pos.y + 28}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="22"
              fontWeight="700"
              fill={col.fg}
            >
              Route {route.letter}
            </text>
            <text
              x={pos.x + boxW / 2} y={pos.y + 52}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="11"
              fill="#cbd5e1"
            >
              {route.name.split(' / ')[0].slice(0, 22)}
            </text>
            {route.name.split(' / ').length > 1 && (
              <text
                x={pos.x + boxW / 2} y={pos.y + 67}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="#94a3b8"
              >
                {route.name.split(' / ')[1].slice(0, 24)}
              </text>
            )}
          </g>
        );
      })}

      {/* ─── Centre "shared bottleneck" node ─── */}
      <rect
        x={centre.cx - centre.w / 2}
        y={centre.cy - centre.h / 2}
        width={centre.w}
        height={centre.h}
        rx="10" ry="10"
        fill="rgba(244,63,94,0.10)"
        stroke="#f43f5e"
        strokeWidth="2.5"
        strokeDasharray="6 3"
      />
      <text
        x={centre.cx} y={centre.cy - 14}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="15"
        fontWeight="700"
        fill="#f43f5e"
      >
        Shared bottleneck
      </text>
      <text
        x={centre.cx} y={centre.cy + 8}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="12"
        fill="#fda4af"
      >
        Prove Delta = 0
      </text>
      <text
        x={centre.cx} y={centre.cy + 26}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="11"
        fill="#e2e8f0"
      >
        non-circularly
      </text>

      {/* ─── Lines from each corner to centre node ─── */}
      {R.routes.map((route) => {
        const pos = positions[route.letter];
        const x1 = pos.x + boxW / 2;
        const y1 = pos.y + boxH / 2;
        return (
          <line
            key={`centre-${route.letter}`}
            x1={x1} y1={y1}
            x2={centre.cx} y2={centre.cy}
            stroke={ROUTE_COLORS[route.letter].border}
            strokeWidth="1.5"
            strokeOpacity="0.55"
            markerStart="url(#arrow-end)"
            markerEnd="url(#arrow-end)"
          />
        );
      })}
    </svg>
  );
}

// ── Per-route card ────────────────────────────────────────────────────────────
function RouteCard({ route }) {
  const col = ROUTE_COLORS[route.letter];
  return (
    <div
      className="card"
      style={{
        marginTop: 16,
        borderLeft: `4px solid ${col.border}`,
        background: col.bg,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ color: col.fg, margin: 0, fontSize: 20 }}>
          Route {route.letter}: {route.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 12, color: '#64748b' }}>
          {route.sectionRef}
        </span>
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <BlockMath tex={route.equivalentStatement} />
      </div>

      <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        <strong style={{ color: col.fg }}>Statement. </strong>
        {route.statement}
      </p>

      <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        <strong style={{ color: '#fbbf24' }}>Current status. </strong>
        {route.currentStatus}
      </p>

      <div
        style={{
          marginTop: 12,
          padding: '10px 12px',
          borderLeft: '2px solid #ef4444',
          background: 'rgba(15,23,42,0.5)',
        }}
      >
        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7 }}>
          <strong style={{ color: '#f87171' }}>Blocker. </strong>
          {route.blocker}
        </p>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, fontFamily: mono, color: '#94a3b8' }}>
        <em>{route.principle}</em>
      </p>
    </div>
  );
}

// ── Conjecture card ───────────────────────────────────────────────────────────
function ConjectureCard({ conj, accent }) {
  return (
    <div
      className="card"
      style={{
        marginTop: 16,
        borderLeft: `4px solid ${accent}`,
        background: 'rgba(168,85,247,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ color: accent, margin: 0, fontSize: 18 }}>
          {conj.label}: {conj.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 12, color: '#64748b' }}>
          {conj.sectionRef}
        </span>
        {conj.impliesRH && (
          <span
            style={{
              fontFamily: mono,
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              color: '#10b981',
              background: 'rgba(16,185,129,0.10)',
              border: '1px solid #10b981',
            }}
          >
            implies RH
          </span>
        )}
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <BlockMath tex={conj.equivalentStatement} />
      </div>

      <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        {conj.statement}
      </p>

      <p style={{ marginTop: 10, color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
        <em>{conj.note}</em>
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ClosureRoutesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Four Equivalent Closure Routes (§16)</h1>
        <p className="page-subtitle" style={{ fontFamily: mono, color: 'var(--text-secondary)' }}>
          {R.title} — {R.paperRef}
        </p>
      </div>

      {/* ─── Intro ─── */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>The closure problem</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
          The shifted-bridge threshold theorem of §15 converts the informal
          "no-ghost" principle into a precise gap statement: the bridge thickness
          <InlineMath tex={'\\,\\Delta := \\sup_{X(\\lambda)=0}|\\Re\\lambda|\\,'} />
          vanishes if and only if every shifted-bridge kernel is positive
          semidefinite. Concretely,
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={R.setup.thresholdTheoremLaTeX} />
        </div>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
          Section 16 records <strong style={{ color: '#fbbf24' }}>four natural routes</strong> for
          closing this gap. They look different — Schur contractivity, de Branges
          positivity, hidden-square factorization, Weil / twin-ladder norm-square
          — but Theorem 16.1 proves they are <em>mathematically the same final
          problem</em>. Making the routes explicit prevents circular proof
          attempts and isolates exactly what a successful proof must add.
        </p>
      </div>

      {/* ─── Setup definitions ─── */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>Setup</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          Centered completed function and bridge thickness:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={R.setup.centeredCompletedLaTeX + ', \\qquad ' + R.setup.bridgeThicknessLaTeX} />
        </div>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          Shifted bridge components and Schur ratio (with{' '}
          <InlineMath tex="w = -iz" />, so <InlineMath tex="z \in \mathbb{C}_+" /> corresponds to{' '}
          <InlineMath tex="\Re w > 0" />):
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={R.setup.shiftedBridgeLaTeX} />
        </div>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
          Shifted bridge kernel:
        </p>
        <div style={{ marginTop: 8, overflowX: 'auto' }}>
          <BlockMath tex={R.setup.bridgeKernelLaTeX} />
        </div>
      </div>

      {/* ─── Equivalence diagram ─── */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ color: '#a855f7', marginBottom: 8 }}>
          {R.equivalenceTheoremName}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          The four routes are equivalent statements of the closure problem.
          Solid arrows mark the four sub-equivalences proved in §16.1; dashed
          diagonals are derived. All four routes reduce to the shared bottleneck
          at the centre.
        </p>
        <EquivalenceDiagram />
        <p style={{ marginTop: 16, color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
          <strong style={{ color: '#cbd5e1' }}>Proof sketch. </strong>
          {R.equivalenceProofSketch}
        </p>
      </div>

      {/* ─── Per-route cards ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        The four routes
      </h2>
      {R.routes.map((route) => (
        <RouteCard key={route.letter} route={route} />
      ))}

      {/* ─── Shared bottleneck ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        The shared bottleneck (§16.6)
      </h2>
      <div
        className="card"
        style={{
          marginTop: 16,
          borderLeft: '4px solid #f43f5e',
          background: 'rgba(244,63,94,0.04)',
        }}
      >
        <h3 style={{ color: '#f43f5e' }}>{R.sharedBottleneck.title}</h3>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
          {R.sharedBottleneck.statement}
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath
            tex={
              '\\left|\\tfrac{X(w-a)}{X(w+a)}\\right| < 1 \\;\\iff\\; ' +
              'K_a \\succeq 0 \\;\\iff\\; K_a = B_a^* B_a \\;\\iff\\; Q_{TL}[h] \\geq 0'
            }
          />
        </div>

        <h3 style={{ color: '#fbbf24', marginTop: 18, fontSize: 16 }}>
          Godelian witness principle
        </h3>
        <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
          {R.sharedBottleneck.godelianWitnessPrinciple}
        </p>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <BlockMath tex={'z_\\rho(a) := -\\gamma + i(\\delta - a) \\in \\mathbb{C}_+, \\qquad E_a(z_\\rho(a)) = 0'} />
        </div>

        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
          <em>{R.sharedBottleneck.why}</em>
        </p>
      </div>

      {/* ─── Conjectures ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Concrete next targets
      </h2>
      <ConjectureCard conj={R.conjecture16_4} accent="#06b6d4" />
      <ConjectureCard conj={R.conjecture16_6} accent="#a855f7" />

      {/* ─── At-a-glance status table ─── */}
      <div className="card" style={{ marginTop: 28 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 12 }}>At a glance</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>Route</th>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>Name</th>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>§</th>
              <th style={{ padding: '8px 6px', fontFamily: mono }}>Equivalent to RH?</th>
            </tr>
          </thead>
          <tbody>
            {R.routes.map((route) => {
              const col = ROUTE_COLORS[route.letter];
              return (
                <tr key={route.letter} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px 6px', color: col.fg, fontFamily: mono, fontWeight: 700 }}>
                    {route.letter}
                  </td>
                  <td style={{ padding: '10px 6px', color: '#cbd5e1' }}>
                    {route.name}
                  </td>
                  <td style={{ padding: '10px 6px', color: '#64748b', fontFamily: mono }}>
                    {route.sectionRef}
                  </td>
                  <td style={{ padding: '10px 6px', color: '#10b981', fontFamily: mono }}>
                    yes
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: '#64748b', fontSize: 12, fontFamily: mono }}>
          findRoute('C') ={' '}
          <span style={{ color: '#06b6d4' }}>{findRoute('C').name}</span>{' '}— helper smoke test.
        </p>
      </div>

      {/* ─── Related pages ─── */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/twin-ladder" style={{ color: '#a855f7', fontSize: 13 }}>
            Twin Ladder
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rh-equivalents" style={{ color: '#ec4899', fontSize: 13 }}>
            RH Equivalents
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/rh-attack" style={{ color: '#fbbf24', fontSize: 13 }}>
            RH Attack
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/proof-overview" style={{ color: '#10b981', fontSize: 13 }}>
            Proof Overview
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/lambda-bounds" style={{ color: '#06b6d4', fontSize: 13 }}>
            Λ Bounds &amp; RH Roadmap
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/literature" style={{ color: '#3b82f6', fontSize: 13 }}>
            Literature
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
