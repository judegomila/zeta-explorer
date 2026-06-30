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
import { IMP3085_HANKEL_GAP_AU_GRID } from '../data/imp-3085-hankel-gap-aU-grid.js';
import DownstreamVerdictCallout from '../components/DownstreamVerdictCallout.jsx';

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

// ── imp-3085 operator-gap a*U collapse viz ────────────────────────────────────
// Operator-side companion to the (pending) imp-3095 scalar-phi collapse: plot the
// de-homogenized operator/diagonal gap ||R|| - max_j R_jj vs s = a*U and SHOW that
// equal-product (a,U) cells land on the same curve, while the RAW off-diagonal
// Hankel cross-term does NOT collapse. All values are READ from the imp-3085 module
// export; no math is recomputed here.
const A_COLORS = {
  0.5: '#f59e0b', // amber
  0.3: '#06b6d4', // cyan
  0.2: '#a855f7', // purple
  0.1: '#10b981', // emerald
};

function OperatorGapCollapseViz() {
  const M = IMP3085_HANKEL_GAP_AU_GRID.measured;
  const grid = M.grid;
  const trend = M.sTrend;
  // s = 3 equal-product pair: (0.5,6) and (0.3,10) -> gap coincides, raw |H_jk| does not.
  const headlinePair = M.equalProductPairs.find((p) => Math.abs(p.s - 3) < 1e-9);

  // Plot frame.
  const W = 720, H = 360, ML = 56, MR = 24, MT = 22, MB = 44;
  const sMax = 5.2, gapMax = 4.0;
  const px = (s) => ML + (s / sMax) * (W - ML - MR);
  const py = (g) => H - MB - (g / gapMax) * (H - MT - MB);

  const sTicks = [0, 1, 2, 3, 4, 5];
  const gTicks = [0, 1, 2, 3, 4];
  const aValues = [0.5, 0.3, 0.2, 0.1];

  // Collapsed trend polyline (the single s-curve every cell lands on).
  const trendPath = trend
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${px(t.s).toFixed(1)} ${py(t.operatorDiagonalGap).toFixed(1)}`)
    .join(' ');

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #06b6d4', background: 'rgba(6,182,212,0.04)' }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0 }}>
        Operator/diagonal gap collapses onto s = a&middot;U (imp-3085)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        De-homogenizing the §26 contraction{' '}
        <span style={{ fontFamily: mono }}>R&#x2C7C;&#x2096; = H&#x2C7C;&#x2096; / &radic;(D&#x2C7C;&#x2C7C; D&#x2096;&#x2096;)</span>{' '}
        cancels the shared lag-window prefactor U (substitute &#x03C4; = U&middot;x), so the operator
        norm &#x2016;R&#x2016;, its diagonal, and the obstruction gap{' '}
        <span style={{ fontFamily: mono }}>&#x2016;R&#x2016; &minus; max&#x2C7C; R&#x2C7C;&#x2C7C;</span>{' '}
        depend on the single product <strong>s = a&middot;U</strong> alone. Every (a, U) grid cell —
        colored by the shear weight a — lands on one curve; cells with equal product coincide to{' '}
        ~{M.maxGapMismatchAcrossEqualProductPairs.toExponential(0)}. This is the operator-side
        analogue of the degree-0 scalar excess-fraction collapse (imp-3064).
      </p>

      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {/* grid + axes */}
          {gTicks.map((g) => (
            <g key={`g${g}`}>
              <line x1={ML} y1={py(g)} x2={W - MR} y2={py(g)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(g) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{g.toFixed(1)}</text>
            </g>
          ))}
          {sTicks.map((s) => (
            <text key={`s${s}`} x={px(s)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{s}</text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>s = a&middot;U  (lag-window &times; shear product)</text>
          <text x={16} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={`rotate(-90 16 ${(MT + H - MB) / 2})`}>operator/diagonal gap</text>

          {/* collapsed trend curve */}
          <path d={trendPath} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* per-cell scatter, colored by a */}
          {grid.map((c, i) => (
            <circle
              key={i}
              cx={px(c.s)}
              cy={py(c.operatorDiagonalGap)}
              r="5"
              fill={A_COLORS[c.a] || '#94a3b8'}
              fillOpacity="0.55"
              stroke={A_COLORS[c.a] || '#94a3b8'}
              strokeWidth="1.2"
            >
              <title>{`a=${c.a}, U=${c.U}  ->  s=${c.s}, gap=${c.operatorDiagonalGap.toFixed(5)}, ||R||=${c.operatorNorm.toFixed(4)}`}</title>
            </circle>
          ))}

          {/* headline coincidence annotation at s = 3 */}
          {headlinePair && (
            <g>
              <line x1={px(3)} y1={py(headlinePair.cellA.operatorDiagonalGap) - 10} x2={px(3)} y2={MT + 8} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
              <text x={px(3) + 6} y={MT + 16} fontSize="11" fill="#fbbf24" fontFamily={mono}>
                (0.5,6) &amp; (0.3,10) &rarr; gap {headlinePair.cellA.operatorDiagonalGap.toFixed(4)}
              </text>
            </g>
          )}

          {/* legend */}
          {aValues.map((a, i) => (
            <g key={`leg${a}`} transform={`translate(${W - MR - 92}, ${MT + 10 + i * 18})`}>
              <circle cx="0" cy="-4" r="5" fill={A_COLORS[a]} fillOpacity="0.55" stroke={A_COLORS[a]} strokeWidth="1.2" />
              <text x="12" y="0" fontSize="11" fill="#cbd5e1" fontFamily={mono}>a = {a}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* contrast: the RAW Hankel cross-term does NOT collapse */}
      {headlinePair && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 6 }}>
            THE RAW GRAM DOES NOT COLLAPSE
          </div>
          <p style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.7, margin: 0 }}>
            The scale invariance lives in the <em>de-homogenized</em> operator R, not the bare Gram.
            At the same s = 3 the two equal-product cells give identical gaps but the raw off-diagonal{' '}
            <span style={{ fontFamily: mono }}>min&#x2C7C;&#x2260;&#x2096; |H&#x2C7C;&#x2096;|</span> still
            carries the dimensionful U prefactor and differs by O(1):{' '}
            <span style={{ fontFamily: mono, color: '#fca5a5' }}>
              {headlinePair.cellA.minOffDiagonalHankelCrossTerm.toFixed(2)} (a=0.5,U=6)
            </span>{' '}
            vs{' '}
            <span style={{ fontFamily: mono, color: '#fca5a5' }}>
              {headlinePair.cellB.minOffDiagonalHankelCrossTerm.toFixed(2)} (a=0.3,U=10)
            </span>.
          </p>
        </div>
      )}

      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          DIAGNOSTIC — NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Measured on the SAME representative degree-4 monomial-moment truncation as imp-3066 (chosen to
          EXHIBIT the off-diagonal cross-terms), NOT the section-26 Gram. Only the a&middot;U scaling of the
          obstruction magnitude is asserted — the gap claims neither that the cover fails nor that it holds.
          Positivity was not attempted. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
        </p>
      </div>

      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3085-hankel-gap-aU-grid.js &mdash; operator companion to the imp-3095 scalar-phi collapse.
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

      <DownstreamVerdictCallout />

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

      {/* ─── imp-3007: Scalar cover vs. operator positivity ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Scalar Cover vs. Operator Positivity (imp-3007)
      </h2>
      <div
        className="card"
        style={{
          marginTop: 16,
          borderLeft: '4px solid #f59e0b',
          background: 'rgba(245,158,11,0.04)',
        }}
      >
        <h3 style={{ color: '#f59e0b', marginTop: 0 }}>What the mu-pass cover does — and what it leaves open</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
          The endpoint-bridge cosh-completion{' '}
          <span style={{ fontFamily: mono, color: '#fbbf24' }}>w&#x207F;&#x1D552;&#x1D557;&#x1D560;(&#x03C4;) = cosh(a&#x03C4;)</span>{' '}
          (imp-2686) is a <em>scalar</em> (pointwise, lag-symbol) weight. Re-evaluating the
          degree-0 deficit functional from imp-2841 at this weight gives post-bridge residual
          deficit <strong style={{ color: '#10b981' }}>exactly 0</strong> — the bridge covers
          100% of the raw "~64% of lag" overflow on the whole axis [0, U]. This is a genuine,
          RH-equivalent closure step in the degree-0 (scale-invariant) measure.
        </p>
        <div
          style={{
            margin: '14px 0',
            padding: '10px 14px',
            borderRadius: 6,
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.3)',
            fontFamily: mono,
            fontSize: 12.5,
            color: '#6ee7b7',
          }}
        >
          D_pass(a) = &#x222B;&#x2080;&#x1D41C; max(0, sinh(a&#x03C4;) &#x2212; cosh(a&#x03C4;)) d&#x03C4; = 0&nbsp;&nbsp;(exact)
          &nbsp;&nbsp;&rarr;&nbsp;&nbsp;covered fraction = 1
        </div>
        <div
          style={{
            margin: '14px 0',
            padding: '10px 14px',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 6 }}>
            NECESSARY BUT NOT SUFFICIENT
          </div>
          <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Pointwise weight domination{' '}
            <span style={{ fontFamily: mono }}>w&#x207F;&#x1D552;&#x1D557;&#x1D560; &ge; &#x03BD;</span>{' '}
            controls only the <em>diagonal</em> of the §26 Gram comparison. The RH-equivalent
            target — operator positivity K&#x2090; &#x2265; 0 — requires the de-homogenized
            contraction{' '}
            <span style={{ fontFamily: mono }}>R = G&#x209A;&#x2090;&#x2E2D;&#x207B;&#xBD; G&#x209B;&#x2095;&#x2091;&#x2090;&#x1D63 G&#x209A;&#x2090;&#x2E2D;&#x207B;&#xBD;</span>{' '}
            to satisfy &#x2016;R&#x2016; &le; 1. The shear Gram G&#x209B;&#x2095;&#x2091;&#x2090;&#x1D63 is an
            off-diagonal <strong>endpoint-Hankel form</strong>; its cross-terms are not bounded
            by scalar weight domination. The scalar cover is therefore a{' '}
            <strong style={{ color: '#fbbf24' }}>necessary step</strong>, but the off-diagonal
            endpoint-Hankel cross-terms — the one remaining obstruction — are precisely the
            RH-hard content.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
          <div style={{ padding: '8px 12px', borderRadius: 5, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
            <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 3 }}>CLOSED (scalar step)</div>
            Degree-0 overflow cover complete. Residual deficit = 0. Covers 100% of the raw
            64%-class overflow. Scalar cover is DONE.
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 5, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
            <div style={{ color: '#f87171', fontWeight: 700, marginBottom: 3 }}>OPEN (operator step)</div>
            Off-diagonal endpoint-Hankel cross-terms still need bounding. Scalar domination
            does not reach here. This is the lone remaining obstruction — and the RH-hard part.
          </div>
        </div>
        <p style={{ marginTop: 12, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3007-mupass-overflow-cover.js &mdash; RH-EQUIVALENT; STRUCTURAL/DIAGNOSTIC; NOT a reduction.
          Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
        </p>
      </div>

      {/* ─── imp-3085: operator-gap a*U collapse viz ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        The operator obstruction tracks one scale (imp-3085)
      </h2>
      <OperatorGapCollapseViz />

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
                    {route.lastReviewed && (
                      <span style={{
                        marginLeft: 8,
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 3,
                        color: '#6ee7b7',
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        whiteSpace: 'nowrap',
                      }}>
                        rev. {route.lastReviewed}
                      </span>
                    )}
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
