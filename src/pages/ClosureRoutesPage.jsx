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
import { IMP3107_DEHOMOGENIZED_OFFDIAG_AU_GRID } from '../data/imp-3107-dehomogenized-offdiag-aU-grid.js';
import { IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP } from '../data/imp-3084-offdiagonal-gap-degree-sweep.js';
import { IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING } from '../data/imp-3086-orthogonalized-basis-conditioning.js';
import { IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP } from '../data/imp-3110-section26-gram-vs-monomial-gap.js';
import { IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS } from '../data/imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js';
import { C_SHOCK_MARGIN_CROSS_VALIDATION_IMP3108 } from '../data/imp-3108-c-shock-margin-cross-validation.js';
import { IMP3064_DEFICIT_EXCESS_FRACTION_GRID } from '../data/imp-3064-deficit-excess-fraction-grid.js';
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

// ── imp-3084 raw-basis operator/diagonal gap vs truncation degree sweep ────────
// Shows the operator/diagonal gap ||R|| - max_j R_jj growing monotonically from
// ~1.79 (DEG=2) to ~10.8 (DEG=12) while the scalar-cover ceiling max_j R_jj stays
// pinned just below 1. All values are READ from the imp-3084 module export.
function RawBasisOpGapDegreeSweepViz() {
  const M = IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP.measured;
  const sweep = M.sweep;

  const W = 680, H = 300, ML = 52, MR = 24, MT = 22, MB = 44;
  const degMin = sweep[0].degree;
  const degMax = sweep[sweep.length - 1].degree;
  const gapMax = Math.ceil(M.lastGap) + 1;

  const px = (deg) => ML + ((deg - degMin) / (degMax - degMin)) * (W - ML - MR);
  const py = (val) => H - MB - (val / gapMax) * (H - MT - MB);

  const gapPath = sweep
    .map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(row.degree).toFixed(1)} ${py(row.operatorDiagonalGap).toFixed(1)}`)
    .join(' ');

  const diagPath = sweep
    .map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(row.degree).toFixed(1)} ${py(row.rDiagMax).toFixed(1)}`)
    .join(' ');

  const degTicks = [2, 4, 6, 8, 10, 12];
  const gapTicks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
      <h3 style={{ color: '#f59e0b', marginTop: 0 }}>
        Raw-basis operator/diagonal gap GROWS with truncation degree (imp-3084)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        Sweeping the monomial truncation degree DEG from 2 to 12 (same a=0.5, U=6 grid as
        imp-3066): the off-diagonal operator/diagonal gap{' '}
        <span style={{ fontFamily: mono }}>&#x2016;R&#x2016; &minus; max&#x2C7C; R&#x2C7C;&#x2C7C;</span>{' '}
        grows monotonically from ~{M.firstGap.toFixed(2)} (DEG=2) to ~{M.lastGap.toFixed(2)} (DEG=12) &mdash;
        the raw-basis obstruction <strong>grows without saturation</strong> as the truncation refines.
        Meanwhile, the scalar-cover ceiling{' '}
        <span style={{ fontFamily: mono }}>max&#x2C7C; R&#x2C7C;&#x2C7C;</span>{' '}
        stays pinned just below 1 (~{sweep[0].rDiagMax.toFixed(3)}&rarr;~{sweep[sweep.length - 1].rDiagMax.toFixed(3)}),
        confirming the necessary scalar cover holds at every degree while the off-diagonal
        cross-term contribution diverges.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {gapTicks.map((g) => (
            <g key={`gt${g}`}>
              <line x1={ML} y1={py(g)} x2={W - MR} y2={py(g)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(g) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{g}</text>
            </g>
          ))}
          {degTicks.map((d) => (
            <g key={`dt${d}`}>
              <line x1={px(d)} y1={MT} x2={px(d)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={px(d)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{d}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={py(1)} x2={W - MR} y2={py(1)} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <text x={W - MR - 4} y={py(1) - 4} textAnchor="end" fontSize="10" fill="#475569" fontFamily={mono}>ceiling = 1</text>
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>truncation degree DEG</text>
          <text x={16} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={`rotate(-90 16 ${(MT + H - MB) / 2})`}>magnitude</text>
          <path d={gapPath} fill="none" stroke="#f59e0b" strokeWidth="2" />
          <path d={diagPath} fill="none" stroke="#10b981" strokeWidth="2" />
          {sweep.map((row) => (
            <circle key={`g${row.degree}`} cx={px(row.degree)} cy={py(row.operatorDiagonalGap)} r="4"
              fill="#f59e0b" fillOpacity="0.7" stroke="#f59e0b" strokeWidth="1">
              <title>{`DEG=${row.degree}: gap=${row.operatorDiagonalGap.toFixed(4)}, ||R||=${row.operatorNorm.toFixed(4)}`}</title>
            </circle>
          ))}
          {sweep.map((row) => (
            <circle key={`d${row.degree}`} cx={px(row.degree)} cy={py(row.rDiagMax)} r="4"
              fill="#10b981" fillOpacity="0.7" stroke="#10b981" strokeWidth="1">
              <title>{`DEG=${row.degree}: max diag=${row.rDiagMax.toFixed(5)}`}</title>
            </circle>
          ))}
          <g transform={`translate(${ML + 16}, ${MT + 10})`}>
            <line x1="0" y1="0" x2="18" y2="0" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="9" cy="0" r="4" fill="#f59e0b" fillOpacity="0.7" />
            <text x="24" y="4" fontSize="11" fill="#cbd5e1" fontFamily={mono}>gap &#x2016;R&#x2016; &minus; max&#x2C7C; R&#x2C7C;&#x2C7C;</text>
          </g>
          <g transform={`translate(${ML + 16}, ${MT + 30})`}>
            <line x1="0" y1="0" x2="18" y2="0" stroke="#10b981" strokeWidth="2" />
            <circle cx="9" cy="0" r="4" fill="#10b981" fillOpacity="0.7" />
            <text x="24" y="4" fontSize="11" fill="#cbd5e1" fontFamily={mono}>scalar ceiling max&#x2C7C; R&#x2C7C;&#x2C7C; (pinned &lt; 1)</text>
          </g>
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          REPRESENTATIVE DIAGNOSTIC &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Growing &#x2016;R&#x2016; in the raw monomial basis is NOT a claim that the cover fails &mdash; the
          basis is not the section-26 Gram and the divergence is a known monomial-conditioning effect.
          Orthogonalizing the basis DOES tame the gap: imp-3086 (see correction below) finds the gap collapses from ~3.63 to ~0.09 &mdash; largely a basis-conditioning artifact &mdash; while a smaller residual gap survives.
          Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3084-offdiagonal-gap-degree-sweep.js (same a=0.5, U=6 grid as imp-3066; only DEG varies).
      </p>
    </div>
  );
}

// ── imp-3086 basis-conditioning correction panel ──────────────────────────────
// The imp-3084 / imp-3066 raw-monomial gap (3.63) was LARGELY a basis-conditioning
// artifact. Orthogonalizing in the cosh inner product collapses it to 0.09, while a
// strictly-positive residual obstruction survives. Operator norm is a basis invariant.
function BasisConditioningCorrectionPanel() {
  const M = IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING.measured;
  const rows = [
    {
      label: 'Operator norm  ||R||',
      raw: M.operatorNormImp3066Diagonal,
      orth: M.operatorNormGramSchmidt,
      verdict: 'basis invariant (GS = Loewdin to 1e-13)',
    },
    {
      label: 'Operator/diagonal gap',
      raw: M.operatorDiagonalGapImp3066Diagonal,
      orth: M.operatorDiagonalGapGramSchmidt,
      verdict: 'LARGELY artifact — residual gap survives',
    },
    {
      label: 'Off-diagonal Frobenius',
      raw: M.offDiagonalFrobeniusImp3066Diagonal,
      orth: M.offDiagonalFrobeniusGramSchmidt,
      verdict: 'artifact component removed',
    },
  ];
  const tdStyle = { padding: '9px 10px', fontFamily: mono, fontSize: 12, verticalAlign: 'middle' };
  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #06b6d4', background: 'rgba(6,182,212,0.04)' }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0 }}>
        Honest correction: raw-basis gap was largely a conditioning artifact (imp-3086)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        imp-3066 normalized by only the diagonal of the passive cosh Gram P, dropping its
        dense positive off-diagonal cross-terms on an ill-conditioned monomial basis.
        Triangular Gram-Schmidt (<span style={{ fontFamily: mono }}>R_orth = L H L^T</span>, <span style={{ fontFamily: mono }}>L P L^T = I</span>)
        and symmetric Loewdin orthogonalization (independent witness) both give the same
        operator norm to ~1e-13: <strong>the operator norm is a basis invariant</strong>.
        Restoring the full passive Gram collapses the imp-3066 measured numbers (see table).
        A <strong>strictly-positive residual gap survives</strong> (~{M.operatorDiagonalGapGramSchmidt.toFixed(3)})
        confirming the off-diagonal endpoint-Hankel obstruction is real, just far smaller than
        the raw monomial basis advertised.
      </p>
      <div style={{ overflowX: 'auto', marginTop: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
              <th style={tdStyle}>Quantity</th>
              <th style={{ ...tdStyle, color: '#f59e0b' }}>Raw basis (imp-3066)</th>
              <th style={{ ...tdStyle, color: '#06b6d4' }}>Orthogonalized (imp-3086)</th>
              <th style={tdStyle}>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ ...tdStyle, color: '#cbd5e1' }}>{row.label}</td>
                <td style={{ ...tdStyle, color: '#f59e0b' }}>{row.raw.toFixed(3)}</td>
                <td style={{ ...tdStyle, color: '#06b6d4' }}>{row.orth.toFixed(3)}</td>
                <td style={{ ...tdStyle, color: '#64748b' }}>{row.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          REPRESENTATIVE DIAGNOSTIC &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Measured on the same representative degree-4 monomial-moment truncation as imp-3066
          (a=0.5, U=6); NOT the section-26 Gram. The orthogonalized operator norm (~{M.operatorNormGramSchmidt.toFixed(3)})
          carries no RH verdict. Positivity not attempted; bare-V pilot not re-run.
          Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3086-orthogonalized-basis-conditioning.js &mdash; a=0.5, U=6, DEG=4, NQ=4000.
      </p>
    </div>
  );
}

// ── imp-3110 toy-vs-genuine §26 Gram explainer ───────────────────────────────
// Surfaces the four concrete differences D1-D4 (basis, weight, endpoint,
// de-homogenization) between the monomial toy and the genuine section-26 Gram,
// plus the survives-swap vs truncation-artifact split. This is the canonical
// explainer for why every imp-3066/3084/3085/3086 measurement carries no RH verdict.
function Section26GapExplainerPanel() {
  const M = IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP;
  const D = M.differences;
  const S = M.survivesSwap;

  const diffRows = [
    { key: 'D1', label: 'D1 Basis', toy: D.D1_basis.toy, genuine: D.D1_basis.genuine, consequence: D.D1_basis.consequence },
    { key: 'D2', label: 'D2 Weight', toy: D.D2_weight.toy, genuine: D.D2_weight.genuine, consequence: D.D2_weight.consequence },
    { key: 'D3', label: 'D3 Endpoint', toy: D.D3_endpointStructure.toy, genuine: D.D3_endpointStructure.genuine, consequence: D.D3_endpointStructure.consequence },
    { key: 'D4', label: 'D4 De-homog', toy: D.D4_deHomogenization.toy, genuine: D.D4_deHomogenization.genuine, consequence: D.D4_deHomogenization.consequence },
  ];

  const tdBase = { padding: '9px 10px', fontSize: 12, verticalAlign: 'top', lineHeight: 1.6 };

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #f43f5e', background: 'rgba(244,63,94,0.04)' }}>
      <h3 style={{ color: '#f43f5e', marginTop: 0 }}>
        Toy vs. genuine §26 Gram: four concrete differences (imp-3110)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        Every measurement in imp-3066/3084/3085/3086 carries the caveat
        "representative monomial truncation — NOT the actual §26 Gram."
        imp-3110 characterizes that gap concretely: four axes on which the toy
        and the genuine section-26 Gram differ, and what the swap analysis shows
        survives vs. what is a truncation artifact.
      </p>

      {/* D1-D4 table */}
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ ...tdBase, fontFamily: mono, width: '8%' }}>Axis</th>
              <th style={{ ...tdBase, color: '#f59e0b', width: '28%' }}>Toy (imp-3066)</th>
              <th style={{ ...tdBase, color: '#06b6d4', width: '28%' }}>Genuine §26 object</th>
              <th style={{ ...tdBase, color: '#94a3b8', width: '36%' }}>Consequence of the gap</th>
            </tr>
          </thead>
          <tbody>
            {diffRows.map((row) => (
              <tr key={row.key} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ ...tdBase, color: '#f43f5e', fontFamily: mono, fontWeight: 700 }}>{row.label}</td>
                <td style={{ ...tdBase, color: '#fcd34d' }}>{row.toy}</td>
                <td style={{ ...tdBase, color: '#67e8f9' }}>{row.genuine}</td>
                <td style={{ ...tdBase, color: '#94a3b8' }}>{row.consequence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Survives vs Artifacts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.06em', marginBottom: 6 }}>
            SURVIVES THE SWAP (structural)
          </div>
          {S.survives.map((s, i) => (
            <p key={i} style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.65, margin: i > 0 ? '6px 0 0' : 0 }}>{s}</p>
          ))}
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 6 }}>
            TRUNCATION ARTIFACTS (do not carry over)
          </div>
          {S.artifacts.map((a, i) => (
            <p key={i} style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.65, margin: i > 0 ? '6px 0 0' : 0 }}>{a}</p>
          ))}
        </div>
      </div>

      {/* Open Conjecture 26.3 -- honest-status obstruction banner */}
      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 6, background: 'rgba(168,85,247,0.10)', border: '2px solid rgba(168,85,247,0.55)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#c084fc', letterSpacing: '0.06em', marginBottom: 6 }}>
          OPEN OBSTRUCTION — CONJECTURE 26.3: pointwise mu&#x1D40F;&#x207B;&#x1D40F; &#x2265; &#x03BD;
        </div>
        {S.neitherButOpenConjecture.map((s, i) => (
          <p key={i} style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.65, margin: 0 }}>{s}</p>
        ))}
        <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 4, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.4)' }}>
          <span style={{ color: '#c084fc', fontSize: 11, fontWeight: 700 }}>HONEST STATUS: </span>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>
            Conjecture 26.3 (&#x03BC;<sup>pass</sup>(&#x03C4;) &#x2265; &#x03BD;(&#x03C4;) pointwise) is currently unresolved and governs
            whether the genuine §26 diagonal is dominated. Toy diagonal dominance is automatic
            (sinh &lt; cosh pointwise) but does NOT transfer to the genuine object until this
            conjecture is proved. The genuine section-26 diagonal domination status is unknown.
          </span>
        </div>
      </div>

      {/* Honest-status banner */}
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          ASSESSMENT ONLY — NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          {M.honestCaveat.noRHVerdict} {M.honestCaveat.sota}.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3110-section26-gram-vs-monomial-gap.js — self-computing witness included.
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

// ── imp-3107: de-homogenized off-diagonal s-trend viz ─────────────────────────
// Shows min R_jk, max R_jk (left axis, 0-1), and the operator/diagonal gap
// (right axis, 0-4.5, from imp-3085) all vs s = a*U, confirming monotone rise
// and saturation below the common-exponential Perron limit (R_jk -> 1).
function DeHomogOffDiagSTrendViz() {
  const M7 = IMP3107_DEHOMOGENIZED_OFFDIAG_AU_GRID.measured;
  const M5 = IMP3085_HANKEL_GAP_AU_GRID.measured;
  const trend7 = M7.sTrend;
  const trend5 = M5.sTrend;

  const W = 720, H = 340, ML = 58, MR = 66, MT = 22, MB = 44;
  const sMax = 8.5, rMax = 1.05, gapMax = 4.5;

  const px = (s) => ML + (s / sMax) * (W - ML - MR);
  const pyL = (v) => H - MB - (v / rMax) * (H - MT - MB);
  const pyR = (v) => H - MB - (v / gapMax) * (H - MT - MB);
  const mkPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  const minPath = mkPath(trend7.map((t) => [px(t.s), pyL(t.minOffDiagonalR)]));
  const maxPath = mkPath(trend7.map((t) => [px(t.s), pyL(t.maxOffDiagonalR)]));
  const gapPts = trend5.map((t) => [px(t.s), pyR(t.operatorDiagonalGap)]);
  const gapPath = mkPath(gapPts);

  const sTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const rTicks = [0, 0.25, 0.5, 0.75, 1.0];
  const gTicks = [0, 1, 2, 3, 4];
  const atS3 = trend7.find((t) => Math.abs(t.s - 3) < 1e-9);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #10b981', background: 'rgba(16,185,129,0.04)' }}>
      <h3 style={{ color: '#10b981', marginTop: 0 }}>
        Off-diagonal extremes monotonically saturate below Perron limit vs s = a&middot;U (imp-3107)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The de-homogenized off-diagonal entries{' '}
        <span style={{ fontFamily: mono }}>R&#x2C7C;&#x2096; = H&#x2C7C;&#x2096; / &radic;(D&#x2C7C;&#x2C7C; D&#x2096;&#x2096;)</span>{' '}
        depend on <strong>s = a&middot;U</strong> alone (equal-product cells coincide to
        ~{M7.maxOffDiagMismatchAcrossEqualProductPairs.toExponential(0)}).
        Both extremes (min and max over j&ne;k) rise monotonically and saturate strictly
        below 1, approaching the common-exponential Perron limit from below &mdash; they
        neither peak nor decay. The operator/diagonal gap (imp-3085, right axis, cyan)
        follows the same saturating trend.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {rTicks.map((v) => (
            <g key={`rg${v}`}>
              <line x1={ML} y1={pyL(v)} x2={W - MR} y2={pyL(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={pyL(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{v.toFixed(2)}</text>
            </g>
          ))}
          {sTicks.map((s) => (
            <text key={`st${s}`} x={px(s)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{s}</text>
          ))}
          {gTicks.map((g) => (
            <text key={`gt${g}`} x={W - MR + 8} y={pyR(g) + 4} textAnchor="start" fontSize="11" fill="#06b6d4" fontFamily={mono}>{g}</text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={W - MR} y1={MT} x2={W - MR} y2={H - MB} stroke="#1e4a5c" strokeWidth="1" strokeDasharray="3 2" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>s = a&middot;U  (shear weight &times; lag window)</text>
          <text x={14} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono} transform={`rotate(-90 14 ${(MT + H - MB) / 2})`}>min/max R&#x2C7C;&#x2096;</text>
          <text x={W - 10} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="11" fill="#06b6d4" fontFamily={mono} transform={`rotate(90 ${W - 10} ${(MT + H - MB) / 2})`}>gap (right)</text>
          <line x1={ML} y1={pyL(1)} x2={W - MR} y2={pyL(1)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.5" />
          <text x={ML + 6} y={pyL(1) - 4} fontSize="10" fill="#f59e0b" fontFamily={mono} fillOpacity="0.75">Perron limit (every R&#x2C7C;&#x2096; &rarr; 1)</text>
          <path d={gapPath} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
          {gapPts.map((p, i) => (
            <circle key={`gp${i}`} cx={p[0]} cy={p[1]} r="3.5" fill="#06b6d4" fillOpacity="0.5" stroke="#06b6d4" strokeWidth="1">
              <title>{`s=${trend5[i].s}  gap=${trend5[i].operatorDiagonalGap.toFixed(4)}`}</title>
            </circle>
          ))}
          <path d={maxPath} fill="none" stroke="#f59e0b" strokeWidth="2" />
          {trend7.map((t, i) => (
            <circle key={`mxR${i}`} cx={px(t.s)} cy={pyL(t.maxOffDiagonalR)} r="4" fill="#f59e0b" fillOpacity="0.65" stroke="#f59e0b" strokeWidth="1.2">
              <title>{`s=${t.s}  max R_jk=${t.maxOffDiagonalR.toFixed(5)}`}</title>
            </circle>
          ))}
          <path d={minPath} fill="none" stroke="#10b981" strokeWidth="2" />
          {trend7.map((t, i) => (
            <circle key={`mnR${i}`} cx={px(t.s)} cy={pyL(t.minOffDiagonalR)} r="4" fill="#10b981" fillOpacity="0.65" stroke="#10b981" strokeWidth="1.2">
              <title>{`s=${t.s}  min R_jk=${t.minOffDiagonalR.toFixed(5)}`}</title>
            </circle>
          ))}
          {atS3 && (
            <g>
              <line x1={px(3)} y1={pyL(atS3.maxOffDiagonalR) + 10} x2={px(3)} y2={H - MB - 18} stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
              <text x={px(3) + 5} y={H - MB - 20} fontSize="10" fill="#94a3b8" fontFamily={mono}>
                s=3: min {atS3.minOffDiagonalR.toFixed(4)}, max {atS3.maxOffDiagonalR.toFixed(4)}
              </text>
            </g>
          )}
          <g transform={`translate(${ML + 10}, ${MT + 8})`}>
            <line x1="0" y1="6" x2="18" y2="6" stroke="#10b981" strokeWidth="2" />
            <circle cx="9" cy="6" r="3.5" fill="#10b981" fillOpacity="0.65" stroke="#10b981" strokeWidth="1" />
            <text x="22" y="10" fontSize="11" fill="#10b981" fontFamily={mono}>min R&#x2C7C;&#x2096; (left axis)</text>
          </g>
          <g transform={`translate(${ML + 10}, ${MT + 26})`}>
            <line x1="0" y1="6" x2="18" y2="6" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="9" cy="6" r="3.5" fill="#f59e0b" fillOpacity="0.65" stroke="#f59e0b" strokeWidth="1" />
            <text x="22" y="10" fontSize="11" fill="#f59e0b" fontFamily={mono}>max R&#x2C7C;&#x2096; (left axis)</text>
          </g>
          <g transform={`translate(${ML + 10}, ${MT + 44})`}>
            <line x1="0" y1="6" x2="18" y2="6" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="9" cy="6" r="3" fill="#06b6d4" fillOpacity="0.5" stroke="#06b6d4" strokeWidth="1" />
            <text x="22" y="10" fontSize="11" fill="#06b6d4" fontFamily={mono}>&#x2016;R&#x2016; - max R&#x2C7C;&#x2C7C; (right axis, imp-3085)</text>
          </g>
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          DIAGNOSTIC -- NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Measured on the same representative degree-4 monomial-moment truncation as imp-3066/3085, NOT the
          section-26 Gram. The scale invariance is a property of the de-homogenized R, not the bare Gram
          entries. Positivity was not attempted. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3107-dehomogenized-offdiag-aU-grid.js + imp-3085-hankel-gap-aU-grid.js
      </p>
    </div>
  );
}

// ── imp-3087+3088: phi(s) log-log profile viz ──────────────────────────────────
// Log-log plot of phi(s) = G(s)/F(s) vs eps = s - s0, with the onset quadratic-pole
// envelope C/(s-s0)^2 (slope -2, dashed cyan) and the large-s exponential-decay
// envelope K*e^{-s} (dashed amber). 150 log-spaced sample points; no data import
// needed -- F, G, and both constants are computed directly from closed forms.
function PhiProfileLogLogViz() {
  const S0 = Math.asinh(1);
  const SQRT2 = Math.SQRT2;
  const F = (s) => Math.cosh(s) - SQRT2 - s + S0;
  const G = (s) => SQRT2 - S0 - Math.exp(-s);
  const PHI = (s) => G(s) / F(s);
  const C = SQRT2 * (1 - S0);   // onset pole constant ~ 0.16776
  const K = 2 * (SQRT2 - S0);   // large-s decay constant ~ 1.06568

  const W = 680, H = 300, ML = 52, MR = 20, MT = 14, MB = 42;
  const pw = W - ML - MR, ph = H - MT - MB;
  const xMin = -2.0, xMax = 1.3;
  const yMin = -7, yMax = 5;

  const pxFn = (lx) => ML + ((lx - xMin) / (xMax - xMin)) * pw;
  const pyFn = (ly) => H - MB - ((ly - yMin) / (yMax - yMin)) * ph;
  const mkPath = (pts) =>
    pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");

  const phiPts = [];
  for (let i = 0; i <= 150; i++) {
    const lx = xMin + (xMax - xMin) * i / 150;
    const eps = Math.pow(10, lx);
    const phi = PHI(S0 + eps);
    if (phi > 0 && Number.isFinite(phi)) {
      const ly = Math.log10(phi);
      if (ly >= yMin - 0.5 && ly <= yMax + 0.5) {
        phiPts.push([pxFn(lx), pyFn(Math.max(yMin, Math.min(yMax, ly)))]);
      }
    }
  }

  const onsetPts = [];
  for (let i = 0; i <= 60; i++) {
    const lx = xMin + (0.6 - xMin) * i / 60;
    const eps = Math.pow(10, lx);
    const ly = Math.log10(C / (eps * eps));
    if (ly >= yMin && ly <= yMax) onsetPts.push([pxFn(lx), pyFn(ly)]);
  }

  const decayPts = [];
  for (let i = 0; i <= 60; i++) {
    const lx = -1 + (xMax + 1) * i / 60;
    const ly = Math.log10(K * Math.exp(-(S0 + Math.pow(10, lx))));
    if (ly >= yMin && ly <= yMax) decayPts.push([pxFn(lx), pyFn(ly)]);
  }

  const phiPath = mkPath(phiPts);
  const onsetPath = mkPath(onsetPts);
  const decayPath = mkPath(decayPts);

  // imp-3105 interior landmark scales -- sourced from the data module
  const _LM3105  = IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS;
  const S_STAR   = _LM3105.phiEqualsOne.s;               // phi=1 unique root
  const S_CROSS1 = _LM3105.envelopeCrossover.handoff.s;  // envelope onset->decay handoff
  const S_CROSS2 = _LM3105.envelopeCrossover.recross.s;  // algebraic re-crossing
  const ENV_C1   = C / ((S_CROSS1 - S0) * (S_CROSS1 - S0)); // envelope value at handoff ~0.157
  const lx_star  = Math.log10(S_STAR   - S0);
  const lx_c1    = Math.log10(S_CROSS1 - S0);
  const lx_c2    = Math.log10(S_CROSS2 - S0);
  const ly_star  = 0;                             // log10(1)=0
  const ly_c1    = Math.log10(PHI(S_CROSS1));     // exact phi ~0.378
  const ly_c2    = Math.log10(PHI(S_CROSS2));     // exact phi ~0.016
  const ly_env1  = Math.log10(ENV_C1);            // envelope value at handoff ~0.157

  const xTicks = [-2, -1, 0, 1];
  const yTicks = [-6, -4, -2, 0, 2, 4];
  const slopeAnnotLx = -1.5;
  const slopeAnnotLy = Math.log10(C) - 2 * slopeAnnotLx;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #a855f7", background: "rgba(168,85,247,0.04)" }}>
      <h3 style={{ color: "#a855f7", marginTop: 0 }}>
        phi(s) log-log profile: onset + decay + imp-3105 interior landmarks
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        Log-log plot of the excess fraction{" "}
        <span style={{ fontFamily: mono }}>phi(s) = G(s)/F(s)</span> vs. offset{" "}
        <span style={{ fontFamily: mono }}>eps = s &minus; s0</span> from the overflow onset{" "}
        <span style={{ fontFamily: mono }}>s0 = arcsinh(1) &asymp; {S0.toFixed(5)}</span>.
        Dashed <strong style={{ color: "#06b6d4" }}>cyan</strong>: onset quadratic-pole envelope{" "}
        <span style={{ fontFamily: mono }}>C/(s&minus;s0)^2</span> (slope &minus;2, exact as s&rarr;s0+).
        Dashed <strong style={{ color: "#f59e0b" }}>amber</strong>: large-s exponential envelope{" "}
        <span style={{ fontFamily: mono }}>K&sdot;e^(-s)</span>.
        The actual phi (white) tracks the slope &minus;2 line near the onset, then peels above both
        envelopes before following the exponential tail.{" "}
        <strong style={{ color: "#10b981" }}>Green</strong>: phi=1 at s*&asymp;1.489 (unique scale
        where the forced cosh-completion costs as much as the entire kinked cover; transcendental, no closed form).{" "}
        <strong style={{ color: "#f97316" }}>Orange</strong>: envelope handoff s_c1&asymp;1.915
        (onset envelope drops below decay envelope); honest gap: exact phi&asymp;0.378 vs common
        envelope value&asymp;0.157 -- the orange segment shows this gap since neither asymptotic is exact here.{" "}
        <strong style={{ color: "#a855f7" }}>Purple</strong>: algebraic re-crossing s_c2&asymp;4.318
        (pole envelope tail rises back above exponential; comparison artifact, NOT a regime boundary). (imp-3105)
      </p>
      <div style={{ overflowX: "auto" }}>
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
          {yTicks.map((y) => (
            <g key={"yt" + y}>
              <line x1={ML} y1={pyFn(y)} x2={W - MR} y2={pyFn(y)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 6} y={pyFn(y) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>{y}</text>
            </g>
          ))}
          {xTicks.map((x) => (
            <g key={"xt" + x}>
              <line x1={pxFn(x)} y1={MT} x2={pxFn(x)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={pxFn(x)} y={H - MB + 15} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily={mono}>{x}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>
            log&#8321;&#8320;(s &minus; s0)
          </text>
          <text x={12} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}
            transform={`rotate(-90 12 ${(MT + H - MB) / 2})`}>
            log&#8321;&#8320;(phi)
          </text>
          <path d={onsetPath} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5 3" />
          <path d={decayPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
          <path d={phiPath} fill="none" stroke="#e2e8f0" strokeWidth="2" />
          {/* imp-3105 landmark: phi=1 at s*~1.489 */}
          <line x1={pxFn(lx_star)} y1={MT} x2={pxFn(lx_star)} y2={H - MB} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          <circle cx={pxFn(lx_star)} cy={pyFn(ly_star)} r={4} fill="#10b981" stroke="#e2e8f0" strokeWidth="1" />
          <text x={pxFn(lx_star) - 38} y={pyFn(ly_star) - 8} fontSize="9" fill="#10b981" fontFamily={mono}>s*~1.489</text>
          <text x={pxFn(lx_star) - 28} y={pyFn(ly_star) + 2} fontSize="9" fill="#10b981" fontFamily={mono}>phi=1</text>
          {/* imp-3105 landmark: envelope handoff s_c1~1.915 with honest env gap */}
          <line x1={pxFn(lx_c1)} y1={MT} x2={pxFn(lx_c1)} y2={H - MB} stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          <line x1={pxFn(lx_c1)} y1={pyFn(ly_c1)} x2={pxFn(lx_c1)} y2={pyFn(ly_env1)} stroke="#f97316" strokeWidth="2.5" opacity="0.6" />
          <circle cx={pxFn(lx_c1)} cy={pyFn(ly_c1)} r={4} fill="#f97316" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx={pxFn(lx_c1)} cy={pyFn(ly_env1)} r={3} fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x={pxFn(lx_c1) + 5} y={pyFn(ly_c1) - 8} fontSize="9" fill="#f97316" fontFamily={mono}>s_c1~1.915</text>
          <text x={pxFn(lx_c1) + 5} y={pyFn(ly_c1) + 2} fontSize="9" fill="#f97316" fontFamily={mono}>handoff</text>
          {/* imp-3105 landmark: algebraic re-crossing s_c2~4.318 */}
          <line x1={pxFn(lx_c2)} y1={MT} x2={pxFn(lx_c2)} y2={H - MB} stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          <circle cx={pxFn(lx_c2)} cy={pyFn(ly_c2)} r={4} fill="#a855f7" stroke="#e2e8f0" strokeWidth="1" />
          <text x={pxFn(lx_c2) + 5} y={pyFn(ly_c2) - 8} fontSize="9" fill="#a855f7" fontFamily={mono}>s_c2~4.318</text>
          <text x={pxFn(lx_c2) + 5} y={pyFn(ly_c2) + 2} fontSize="9" fill="#a855f7" fontFamily={mono}>re-cross</text>
          <text x={pxFn(slopeAnnotLx) + 4} y={pyFn(slopeAnnotLy) - 6} fontSize="10" fill="#06b6d4" fontFamily={mono}>
            slope &minus;2
          </text>
          <rect x={W - MR - 130} y={MT + 2} width={110} height={58} rx={4} fill="rgba(2,6,23,0.7)" />
          <line x1={W - MR - 122} y1={MT + 14} x2={W - MR - 106} y2={MT + 14} stroke="#e2e8f0" strokeWidth="2" />
          <text x={W - MR - 102} y={MT + 18} fontSize="10" fill="#e2e8f0" fontFamily={mono}>phi(s)</text>
          <line x1={W - MR - 122} y1={MT + 30} x2={W - MR - 106} y2={MT + 30} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x={W - MR - 102} y={MT + 34} fontSize="10" fill="#06b6d4" fontFamily={mono}>C/(s-s0)^2</text>
          <line x1={W - MR - 122} y1={MT + 46} x2={W - MR - 106} y2={MT + 46} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x={W - MR - 102} y={MT + 50} fontSize="10" fill="#f59e0b" fontFamily={mono}>K&#x22c5;e^(-s)</text>
        </svg>
      </div>
      <p style={{ marginTop: 8, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        C = sqrt(2)*(1 &minus; arcsinh(1)) &asymp; {C.toFixed(5)} (imp-3087 onset pole constant).{" "}
        K = 2*(sqrt(2) &minus; arcsinh(1)) &asymp; {K.toFixed(5)} (imp-3088 large-s decay constant).{" "}
        imp-3105 landmarks: s*&asymp;1.48895 (phi=1), s_c1&asymp;1.91504 (handoff; exact phi&asymp;0.378 &ne; envelope&asymp;0.157), s_c2&asymp;4.31751 (re-crossing, artifact).{" "}
        Degree-0 scalar measure only; RH-EQUIVALENT; NOT the operator step.{" "}
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </p>
    </div>
  );
}

// ── imp-3064: degree-0 deficit/excess-fraction grid ──────────────────────────
// phi = E/D_raw across the 20 (a,U) cells. Diagnostic finding: phi depends
// only on s = a*U (equal-product cells coincide). Scalar companion to the
// imp-3085 operator-gap collapse viz. Surfacing per imp-3157.
function DeficitExcessFractionGridPanel() {
  const M = IMP3064_DEFICIT_EXCESS_FRACTION_GRID;
  const rows = M.rows;
  const hl = M.headline;
  const si = M.scaleInvariantFinding;

  const aVals = [0.5, 0.3, 0.2, 0.1, 0.05];
  const uVals = [4, 6, 8, 10];
  const cellOf = (a, U) => rows.find((r) => r.a === a && r.U === U);
  const isEqProduct = (a, U) => { const c = cellOf(a, U); return c && Math.abs(c.s - 3.0) < 1e-6; };

  const phiStyle = (phi) => {
    if (phi === null) return { color: '#475569', background: 'rgba(71,85,105,0.12)' };
    if (phi > 5)   return { color: '#f87171', background: 'rgba(248,113,113,0.10)' };
    if (phi > 1)   return { color: '#f97316', background: 'rgba(249,115,22,0.10)' };
    if (phi > 0.3) return { color: '#fbbf24', background: 'rgba(251,191,36,0.10)' };
    if (phi > 0.1) return { color: '#a3e635', background: 'rgba(163,230,53,0.07)' };
    return { color: '#10b981', background: 'rgba(16,185,129,0.08)' };
  };
  const phiFmt = (phi) => {
    if (phi === null) return '—';
    if (phi > 1) return phi.toFixed(1) + 'x';
    return (phi * 100).toFixed(1) + '%';
  };

  const tdBase = {
    padding: '8px 8px', fontFamily: mono, fontSize: 12,
    textAlign: 'center', borderBottom: '1px solid #1e293b', verticalAlign: 'middle',
  };

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #a855f7', background: 'rgba(168,85,247,0.04)' }}>
      <h3 style={{ color: '#a855f7', marginTop: 0 }}>
        Degree-0 excess-fraction grid: phi = E / D_raw depends only on s = a&middot;U (imp-3064)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The cosh-completion{' '}
        <span style={{ fontFamily: mono }}>w^pass = cosh(a&tau;)</span> covers the raw degree-0
        overflow completely (imp-3007), but over-supplies the minimal kinked cover{' '}
        <span style={{ fontFamily: mono }}>w^min = max(1, sinh(a&tau;))</span>. The excess fraction{' '}
        <span style={{ fontFamily: mono }}>phi = E / D_raw</span> quantifies this relative price across the
        full (a, U) grid. The diagnostic finding: both masses factor as{' '}
        <span style={{ fontFamily: mono }}>1/a</span> times a pure function of the product
        <span style={{ fontFamily: mono }}> s = a*U</span>, so{' '}
        <span style={{ fontFamily: mono }}>phi = G(s)/F(s)</span> depends on <strong>s = a&middot;U
        only</strong>. Equal-product cells coincide exactly (gold border below). At the imp-3007
        headline: phi &asymp; {(hl.excessFraction * 100).toFixed(2)}% at a={hl.a}, U={hl.U}
        (s={String(hl.a * hl.U)}). As s grows, F(s)&asymp;e^s/2 blows up while G(s) saturates
        at &radic;2&minus;arcsinh(1)&asymp;{si.saturationCeiling.toFixed(4)}, so phi&rarr;0.
      </p>

      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', textAlign: 'center', color: '#94a3b8' }}>
              <th style={{ ...tdBase, textAlign: 'left', color: '#64748b' }}>U \\ a</th>
              {aVals.map((a) => (
                <th key={a} style={{ ...tdBase, color: '#a855f7' }}>a={a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uVals.map((U) => (
              <tr key={U}>
                <td style={{ ...tdBase, textAlign: 'left', color: '#64748b' }}>U={U}</td>
                {aVals.map((a) => {
                  const c = cellOf(a, U);
                  const phi = c ? c.excessFraction : null;
                  const s = c ? c.s : a * U;
                  const hilite = isEqProduct(a, U);
                  const st = phiStyle(phi);
                  return (
                    <td
                      key={a}
                      style={{
                        ...tdBase,
                        color: st.color,
                        background: st.background,
                        boxShadow: hilite ? 'inset 0 0 0 2px #fbbf24' : 'none',
                      }}
                    >
                      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>s={s.toFixed(1)}</div>
                      <div style={{ fontWeight: 700 }}>{phiFmt(phi)}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 5, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.3)', fontSize: 12, color: '#cbd5e1', lineHeight: 1.65 }}>
        <strong style={{ color: '#fbbf24', fontFamily: mono }}>SCALE INVARIANCE: </strong>
        (a=0.5, U=6) and (a=0.3, U=10) both give s=3, phi&asymp;{(hl.excessFraction * 100).toFixed(2)}%
        (gold border). phi = G(s)/F(s) where F(s)=cosh(s)&minus;&radic;2&minus;s+arcsinh(1)
        and G(s)=&radic;2&minus;arcsinh(1)&minus;e^(&minus;s).
      </div>

      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          DEGREE-0 SCALAR ONLY &mdash; RH-EQUIVALENT &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          {M.honestCaveat.operatorStepUntouched} {M.honestCaveat.sota}.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3064-deficit-excess-fraction-grid.js &mdash; self-computing;
        all 20 cells verified via closed-form + midpoint cross-check.
      </p>
    </div>
  );
}

// ── imp-3136: C_shock margin 1/3 - C_shock(N) grows with N (imp-3108 data) ───
function CShockMarginCurveViz() {
  const M = C_SHOCK_MARGIN_CROSS_VALIDATION_IMP3108;
  const rows = M.marginCurve;

  const W = 720, H = 270, ML = 68, MR = 28, MT = 22, MB = 46;
  const logMin = Math.log10(2000);
  const logMax = Math.log10(1.3e6);
  const yMin = 0.02, yMax = 0.135;

  const px = (N) => ML + ((Math.log10(N) - logMin) / (logMax - logMin)) * (W - ML - MR);
  const py = (m) => H - MB - ((m - yMin) / (yMax - yMin)) * (H - MT - MB);

  const linePath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${px(r.N).toFixed(1)} ${py(r.margin_to_cap).toFixed(1)}`)
    .join(' ');

  const xTicks = [
    { N: 3000, label: '3k' },
    { N: 10000, label: '10k' },
    { N: 30000, label: '30k' },
    { N: 100000, label: '100k' },
    { N: 300000, label: '300k' },
    { N: 1000000, label: '1M' },
  ];
  const yTicks = [0.04, 0.06, 0.08, 0.10, 0.12];

  const worstRow = rows[0];
  const wxp = px(worstRow.N);
  const wyp = py(worstRow.margin_to_cap);
  const ycx = (MT + H - MB) / 2;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #10b981', background: 'rgba(16,185,129,0.04)' }}>
      <h3 style={{ color: '#10b981', marginTop: 0 }}>
        Margin 1/3 &minus; C<sub>shock</sub>(N) grows with N &mdash; worst case at smallest assembly (imp-3108)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        C<sub>shock</sub>(N) = &radic;(2 / (3 log &gamma;<sub>N</sub>)) strictly decreases with N (imp-3070),
        so its complement &mdash; the margin to the 1/3 cap &mdash; grows strictly with N. The worst case
        (smallest margin &asymp; {M.minMargin.toFixed(4)}) occurs at the smallest assembly
        N = {worstRow.N.toLocaleString()}. By N = 10<sup>6</sup> the margin widens to
        &asymp; {M.maxMargin.toFixed(4)}. The reduced inequality log &gamma;<sub>N</sub> &gt; 6 holds at
        every assembly N, confirming C<sub>shock</sub> &lt; 1/3 throughout the physical range.
      </p>
      <div style={{ overflowX: 'auto', marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {/* y grid lines + labels */}
          {yTicks.map((m) => (
            <g key={`y${m}`}>
              <line x1={ML} y1={py(m)} x2={W - MR} y2={py(m)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(m) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{m.toFixed(2)}</text>
            </g>
          ))}
          {/* x ticks */}
          {xTicks.map(({ N, label }) => (
            <g key={`x${N}`}>
              <line x1={px(N)} y1={H - MB} x2={px(N)} y2={H - MB + 5} stroke="#334155" strokeWidth="1" />
              <text x={px(N)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{label}</text>
            </g>
          ))}
          {/* axes */}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* axis labels */}
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>N  (log scale)</text>
          <text x={14} y={ycx} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={`rotate(-90 14 ${ycx})`}>1/3 &minus; C_shock</text>
          {/* margin curve */}
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" />
          {/* dots: worst-case N=2458 in amber, rest in green */}
          {rows.map((r, i) => (
            <circle key={i} cx={px(r.N)} cy={py(r.margin_to_cap)} r={i === 0 ? 5.5 : 3.5}
              fill={i === 0 ? '#f59e0b' : '#10b981'} stroke={i === 0 ? '#fbbf24' : '#059669'} strokeWidth="1.2">
              <title>{`N=${r.N.toLocaleString()}  C_shock=${r.C_shock.toFixed(5)}  margin=${r.margin_to_cap.toFixed(5)}`}</title>
            </circle>
          ))}
          {/* worst-case annotation */}
          <line x1={wxp} y1={wyp - 7} x2={wxp + 4} y2={wyp - 32} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
          <text x={wxp + 8} y={wyp - 32} fontSize="11" fill="#fbbf24" fontFamily={mono}>worst case</text>
          <text x={wxp + 8} y={wyp - 20} fontSize="10" fill="#94a3b8" fontFamily={mono}>N=2458, margin~{M.minMargin.toFixed(4)}</text>
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          NUMERICAL CROSS-CHECK &mdash; NOT A NEW BOUND
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Certifies an already-proven cap (imp-2786: C<sub>shock</sub> &lt; 1/3 in closed form). NOT a new
          bound, does NOT close C<sub>H</sub>. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3108-c-shock-margin-cross-validation.js &mdash; marginIsIncreasing: {String(M.marginIsIncreasing)}, {rows.length} grid points.
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

      {/* ─── imp-3064: degree-0 excess-fraction grid ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Scalar cover price: degree-0 excess-fraction grid, phi = E / D_raw (imp-3064)
      </h2>
      <DeficitExcessFractionGridPanel />

      {/* ─── imp-3084: raw-basis gap grows with DEG ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Raw-basis off-diagonal gap grows with truncation degree (imp-3084)
      </h2>
      <RawBasisOpGapDegreeSweepViz />

      {/* ─── imp-3086: basis-conditioning honest correction ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Orthogonalized basis: gap largely a conditioning artifact, residual survives (imp-3086)
      </h2>
      <BasisConditioningCorrectionPanel />

      {/* ─── imp-3085: operator-gap a*U collapse viz ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        The operator obstruction tracks one scale (imp-3085)
      </h2>
      <OperatorGapCollapseViz />

      {/* ─── imp-3107: de-homogenized off-diagonal s-trend ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        De-homogenized off-diagonal min/max R&#x2C7C;&#x2096; vs s: monotone rise to Perron limit (imp-3107)
      </h2>
      <DeHomogOffDiagSTrendViz />

      {/* ─── imp-3110: toy vs genuine §26 Gram explainer ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Why monomial measurements carry no RH verdict: toy vs. genuine §26 Gram (imp-3110)
      </h2>
      <Section26GapExplainerPanel />

      {/* ─── imp-3087+3088: phi(s) log-log profile ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        The excess fraction phi(s): onset pole to exponential tail (imp-3087 + imp-3088)
      </h2>
      <PhiProfileLogLogViz />

      {/* ─── imp-3139: honest-status -- phi integral UNBOUNDED, no finite mean ─── */}
      <div style={{
        marginTop: 12,
        padding: '10px 14px',
        background: 'rgba(180,83,9,0.18)',
        border: '1px solid #b45309',
        borderRadius: 6,
        color: '#fde68a',
        fontSize: 13,
        fontFamily: mono,
        lineHeight: 1.6,
      }}>
        <strong style={{ color: '#fbbf24' }}>HONEST STATUS (imp-3106):</strong>{' '}
        The area-weighted MEAN price of the forced even cosh-completion is{' '}
        <strong>UNBOUNDED</strong> -- the integral{' '}
        &int;<sub>s0+&epsilon;</sub><sup>&infin;</sup> &phi;(s) ds diverges as &epsilon;&#8594;0.
        The onset pole &phi; ~ C/(s&minus;s0)^2 is non-integrable: the cutoff mass I(&epsilon;) ~ C/&epsilon; with no finite limit.
        This <strong>divergence is a property</strong>, not a number.{' '}
        The phi integral must <strong>never be quoted as a finite mean</strong>.
        Only the regular tail beyond the onset window (s &gt; s0+1) carries a finite convergent mass ~0.2690.
        Degree-0 scalar measure only; RH-EQUIVALENT; NOT the operator step.
      </div>

      {/* ─── imp-3136: C_shock margin grows with N (imp-3108) ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Margin to the 1/3 cap grows with N &mdash; worst case at smallest assembly (imp-3108)
      </h2>
      <CShockMarginCurveViz />

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
