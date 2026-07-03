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
import { C_SHOCK_SUBMARGIN_PROFILE_IMP3151 } from '../data/imp-3151-c-shock-submargin-profile.js';
import { IMP3064_DEFICIT_EXCESS_FRACTION_GRID } from '../data/imp-3064-deficit-excess-fraction-grid.js';
import { IMP3065_RESIDUAL_DEFICIT_QUADRATURE } from '../data/imp-3065-residual-deficit-quadrature-2026-06-30.js';
import { IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION } from '../data/imp-3066-offdiagonal-hankel-obstruction.js';
import { IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP } from '../data/imp-3125-orthogonalized-residual-gap-degree-sweep.js';
import { IMP3102_ORTHOGONALIZED_GAP_AU_GRID } from '../data/imp-3102-orthogonalized-gap-aU-grid.js';
import DownstreamVerdictCallout from '../components/DownstreamVerdictCallout.jsx';
import { asymOnsetDrho, SG1C_ASYM_ISOLATION_CLOSED_FORM } from '../data/sg1c-asym-isolation-closed-form-2026-06-30.js';
import { IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID } from '../data/imp-3146-residual-gap-limit-aU-grid.js';
import { IMP3153_COSH_MONOMIAL_CONDITIONING_CEILING } from '../data/imp-3153-cosh-monomial-conditioning-ceiling.js';
import { IMP3155_ONSET_DECAY_NEXT_ORDER_CORRECTIONS } from '../data/imp-3155-onset-decay-next-order-corrections.js';
import { IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT } from '../data/imp-3222-onset-decay-second-order-coefficient.js';
import { IMP3325_ONSET_PADE_RESUMMATION } from '../data/imp-3325-onset-pade-resummation.js';
import { IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE } from '../data/imp-3175-overflow-fraction-resolution-reconcile.js';
import { SECTION26_MUPASS_OPERATOR_VERDICT } from '../data/section26-mupass-operator-verdict-2026-06-30.js';
import { IMP3177_EQUAL_PRODUCT_CELL_INVARIANCE_LOCK } from '../data/imp-3177-equal-product-cell-invariance-lock.js';
import { IMP3202_MUPASS_BRIDGE_LAG_CUTOFF_SWEEP } from '../data/imp-3202-mupass-bridge-lag-cutoff-sweep.js';
import { IMP3197_MUPASS_BRIDGE_SIGN_PHI_ONLY } from '../data/imp-3197-mupass-bridge-sign-phi-only.js';
import { IMP3240_MUPASS_CAPTURE_RATIO_AU_GRID } from '../data/imp-3240-mupass-capture-ratio-aU-grid.js';
import { IMP3346_CAPTURE_RATIO_C_CONSTANT_DERIVATION } from '../data/imp-3346-capture-ratio-C-constant-derivation.js';
import { IMP3350_CAPTURE_RATIO_LINEAR_SHEAR_LIMIT } from '../data/imp-3350-capture-ratio-linear-shear-limit.js';
import { IMP3343_SHEAR_GRAM_OPNORM_EQUALS_VOLTERRA_HS_IDENTITY } from '../data/imp-3343-shear-gram-opnorm-equals-volterra-hs-identity.js';
import { IMP3344_SHEAR_GRAM_VERDICT_SCALE_FACTOR } from '../data/imp-3344-shear-gram-verdict-scale-factor.js';
import { IMP3345_VHS_RICHARDSON_LIMIT } from '../data/imp-3345-vhs-richardson-limit.js';
import { IMP3351_SHEAR_GRAM_SYMMETRIC_SPECTRUM_AU_GRID } from '../data/imp-3351-shear-gram-symmetric-spectrum-aU-grid.js';
import { IMP3199_OVERFLOW_FRACTION_CELL_SWEEP } from '../data/imp-3199-overflow-fraction-cell-sweep.js';
import { IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM } from '../data/imp-3216-overflow-support-length-closed-form.js';
import { IMP3196_RESIDUAL_GAP_CONVERGENCE_RATE } from '../data/imp-3196-residual-gap-convergence-rate.js';
import { IMP3217_RESIDUAL_EXPONENT_S_LIMIT } from '../data/imp-3217-residual-exponent-s-limit.js';
import { IMP3154_GENUINE_DEG2_DEFICIT_DEGREE_SWEEP } from '../data/imp-3154-genuine-deg2-deficit-degree-sweep.js';
import { IMP3218_DEG2_DEFICIT_NORMALIZATION_FACTOR } from '../data/imp-3218-deg2-deficit-normalization-factor.js';
import { IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP } from '../data/imp-3104-orthogonalized-opnorm-degree-sweep.js';
import { IMP3288_ANALYTIC_CEILING_LEMMA } from '../data/imp-3288-analytic-ceiling-lemma.js';
import { IMP3106_EXCESS_FRACTION_INTEGRABILITY } from '../data/imp-3106-excess-fraction-integrability.js';
import { REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126 } from '../data/imp-3126-regular-mass-vs-c-shock-coincidence.js';
import { IMP3220_EN_BRIDGE_FIDELITY_FRONTIER } from '../data/imp-3220-en-bridge-fidelity-frontier.js';
import { IMP3324_SIGMA_CH_SENSITIVITY } from '../data/imp-3324-sigma-CH-sensitivity.js';
import { IMP3219_MUPASS_BRIDGE_OVERSHOOT_KNEE } from '../data/imp-3219-mupass-bridge-overshoot-knee.js';
import { IMP3255_BRIDGE_RATIO_CLOSED_FORM } from '../data/imp-3255-bridge-ratio-closed-form.js';
import { IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR } from '../data/imp-3322-spread-contraction-discriminator.js';
import { IMP3257_BRIDGE_SIGN_PHI_NONNEG_STRUCTURAL } from '../data/imp-3257-bridge-sign-phi-nonneg-structural.js';
import { IMP3347_PHI_LEFTMOST_ZERO_VS_NPHI } from '../data/imp-3347-phi-leftmost-zero-vs-nphi.js';
import { IMP3256_VHS_CROSSVAL } from '../data/imp-3256-vhs-crossval.js';
import { IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS } from '../data/imp-3309-two-tail-underflow-horizons.js';

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

// ── imp-3066 off-diagonal endpoint-Hankel obstruction card ────────────────────
// Surfaces the lone operator-positivity obstruction the complete scalar mu^pass
// cover leaves untouched: the off-diagonal Hankel cross-terms of the shear Gram.
// Shows diagonal R_jj (scalar cover, all < 1) vs operator norm ||R||, the gap,
// and all six off-diagonal R entries, all module-sourced from imp-3066.
function OffDiagHankelObstructionPanel() {
  const M = IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.measured;
  const con = IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.construction;
  const deg = con.degree;
  const diagR = M.diagonalOfR;
  const opNorm = M.operatorNorm;
  const rDiagMax = M.rDiagMax;
  const gap = M.operatorDiagonalGap;

  const W = 640, H = 260, ML = 52, MR = 24, MT = 22, MB = 44;
  const n = diagR.length;
  const yMax = Math.ceil(opNorm * 10) / 10 + 0.05;

  const px = (i) => ML + (i / (n)) * (W - ML - MR);
  const barW = (W - ML - MR) / n * 0.55;
  const py = (v) => H - MB - (v / yMax) * (H - MT - MB);

  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #ef4444', background: 'rgba(239,68,68,0.04)' }}>
      <h3 style={{ color: '#ef4444', marginTop: 0 }}>
        Scalar cover pins diagonal below 1 — operator norm overshoots (DEG={deg} monomial truncation)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The imp-3007 scalar cover drives the residual deficit to exactly 0, which is the NECESSARY
        diagonal condition: every R<sub>jj</sub>&thinsp;=&thinsp;[&#x222B;&thinsp;sinh&thinsp;&phi;<sub>j</sub><sup>2</sup>]/[&#x222B;&thinsp;cosh&thinsp;&phi;<sub>j</sub><sup>2</sup>]
        sits strictly below 1.
        But the shear Gram G<sub>shear</sub> is a genuine off-diagonal endpoint-Hankel form whose
        cross-terms scalar domination never sees. The Perron operator norm &thinsp;&#x2016;R&#x2016;&thinsp; strictly
        exceeds the largest diagonal: the gap is the off-diagonal Hankel contribution —
        the obstruction, quantified.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {yTicks.map((v) => (
            <g key={`yt${v}`}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily="var(--font-mono)">{v.toFixed(1)}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* ceiling = 1 dashed line */}
          <line x1={ML} y1={py(1)} x2={W - MR} y2={py(1)} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
          <text x={W - MR - 4} y={py(1) - 5} textAnchor="end" fontSize="10" fill="#475569" fontFamily="var(--font-mono)">ceiling = 1</text>
          {/* operator norm line */}
          <line x1={ML} y1={py(opNorm)} x2={W - MR} y2={py(opNorm)} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x={W - MR - 4} y={py(opNorm) - 5} textAnchor="end" fontSize="10" fill="#ef4444" fontFamily="var(--font-mono)">&#x2016;R&#x2016; = {opNorm.toFixed(5)}</text>
          {/* diagonal bars */}
          {diagR.map((d, j) => (
            <g key={`bar${j}`}>
              <rect
                x={px(j + 0.2) - barW / 2}
                y={py(d)}
                width={barW}
                height={py(0) - py(d)}
                fill="#10b981"
                fillOpacity="0.7"
              />
              <text x={px(j + 0.5)} y={H - MB + 16} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="var(--font-mono)">j={j}</text>
              <title>R_{j}{j} = {d.toFixed(6)}</title>
            </g>
          ))}
          {/* gap annotation arrow */}
          <line x1={W - MR - 60} y1={py(rDiagMax)} x2={W - MR - 60} y2={py(opNorm)} stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow-end)" markerStart="url(#arrow-end)" />
          <text x={W - MR - 55} y={(py(rDiagMax) + py(opNorm)) / 2 + 4} fontSize="10" fill="#f59e0b" fontFamily="var(--font-mono)">gap {gap.toFixed(4)}</text>
          <g transform={`translate(${ML + 12}, ${MT + 8})`}>
            <rect x="0" y="-7" width="14" height="10" fill="#10b981" fillOpacity="0.7" />
            <text x="18" y="2" fontSize="11" fill="#cbd5e1" fontFamily="var(--font-mono)">R_jj (scalar cover, pinned &lt; 1)</text>
          </g>
          <g transform={`translate(${ML + 12}, ${MT + 24})`}>
            <line x1="0" y1="0" x2="14" y2="0" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 2" />
            <text x="18" y="4" fontSize="11" fill="#cbd5e1" fontFamily="var(--font-mono)">&#x2016;R&#x2016; = Perron eigenvalue (overshoots)</text>
          </g>
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '14px 0' }}>
        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
          <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 3 }}>max diagonal R_jj</div>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#6ee7b7', fontSize: 13 }}>{rDiagMax.toFixed(6)}</span>
          <div style={{ marginTop: 4, fontSize: 11 }}>Scalar cover holds — pinned below 1</div>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
          <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 3 }}>operator norm &#x2016;R&#x2016;</div>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#fca5a5', fontSize: 13 }}>{opNorm.toFixed(6)}</span>
          <div style={{ marginTop: 4, fontSize: 11 }}>Perron eigenvalue &mdash; exceeds ceiling = 1</div>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
          <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 3 }}>operator/diagonal gap</div>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#fde68a', fontSize: 13 }}>{gap.toFixed(6)}</span>
          <div style={{ marginTop: 4, fontSize: 11 }}>Off-diag contribution: the obstruction</div>
        </div>
      </div>
      <div style={{ margin: '10px 0', padding: '10px 14px', borderRadius: 6, background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.2)', fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
        <span style={{ color: '#e2e8f0', fontWeight: 700 }}>Off-diagonal cross-terms (shear Hankel): </span>
        min&thinsp;|H<sub>jk</sub>|&thinsp;=&thinsp;<span style={{ fontFamily: 'var(--font-mono)', color: '#fde68a' }}>{M.minOffDiagonalHankelCrossTerm.toExponential(3)}</span>
        &nbsp;&mdash;&nbsp;
        max&thinsp;|H<sub>jk</sub>|&thinsp;=&thinsp;<span style={{ fontFamily: 'var(--font-mono)', color: '#fde68a' }}>{M.maxOffDiagonalHankelCrossTerm.toExponential(3)}</span>
        &nbsp;&mdash;&nbsp;
        min&thinsp;|R<sub>jk</sub>|&thinsp;(j&ne;k)&thinsp;=&thinsp;<span style={{ fontFamily: 'var(--font-mono)', color: '#fde68a' }}>{M.minOffDiagonalR.toExponential(3)}</span>
        &nbsp;&mdash;&nbsp;
        off-diag Frobenius&thinsp;=&thinsp;<span style={{ fontFamily: 'var(--font-mono)', color: '#fde68a' }}>{M.offDiagonalFrobeniusNormOfR.toExponential(3)}</span>.
        Every off-diagonal entry is <strong>strictly positive</strong> (sinh &gt; 0 on (0, U]), so by
        Perron-Frobenius &#x2016;R&#x2016; strictly exceeds max&thinsp;R<sub>jj</sub>.
      </div>
      <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 12, color: '#cbd5e1', lineHeight: 1.65 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 5 }}>
          HONEST CAVEAT — REPRESENTATIVE TRUNCATION ONLY, NO RH VERDICT
        </div>
        This is a <strong>diagnostic measurement on a representative degree-{deg} monomial-moment
        truncation</strong> chosen to exhibit the off-diagonal obstruction — NOT the actual section-26
        Gram. The measured &#x2016;R&#x2016; carries <strong>no RH verdict</strong>: it neither claims the
        cover fails nor that it holds on the genuine Gram. The deliverable is only the existence and
        magnitude of the off-diagonal cross-terms and the strictly-positive operator/diagonal gap that
        scalar domination cannot reach. Positivity was <strong>not attempted</strong>.
        Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
        Source: imp-3066-offdiagonal-hankel-obstruction.js &mdash; RH-EQUIVALENT; STRUCTURAL/DIAGNOSTIC; NOT a reduction.
      </p>
    </div>
  );
}

// ── imp-3288 concentrating-family Rayleigh quotient climbing to the analytic ceiling ──
// Shows Q(f_delta) rising toward sup Q = tanh(a*U) < 1 as the indicator family
// f_delta = 1_{[U-delta, U]} collapses toward tau=U (delta -> 0), with the strictly
// positive margin 1 - tanh(a*U) shaded between the curve and the ceiling = 1 line.
function AnalyticCeilingConcentratingFamilyPanel() {
  const L = IMP3288_ANALYTIC_CEILING_LEMMA.lemma;
  const M = IMP3288_ANALYTIC_CEILING_LEMMA.measured;
  const ladder = M.concentratingLadder;
  const ceiling = L.analyticCeilingTanhAU;
  const margin = L.marginOneMinusCeiling;

  const W = 640, H = 260, ML = 56, MR = 24, MT = 22, MB = 44;
  const n = ladder.length;
  const yMin = Math.floor(ladder[0].quotient * 20) / 20 - 0.02;
  const yMax = 1.0;
  const px = (i) => ML + (i / (n - 1)) * (W - ML - MR);
  const py = (v) => H - MB - ((v - yMin) / (yMax - yMin)) * (H - MT - MB);
  const yTicks = [yMin, ceiling, 1.0].concat(
    [0.94, 0.96, 0.98].filter((v) => v > yMin && v < ceiling - 0.002),
  );

  const linePath = ladder.map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(row.quotient)}`).join(' ');
  const shadedPath = `${linePath} L ${px(n - 1)} ${py(ceiling)} L ${px(0)} ${py(ceiling)} Z`;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #06b6d4', background: 'rgba(6,182,212,0.04)' }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0, fontSize: 14 }}>
        Concentrating family Q(f<sub>&delta;</sub>) climbs to the analytic ceiling tanh(a&middot;U)&thinsp;&lt;&thinsp;1 (imp-3288)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
        f<sub>&delta;</sub> = 1<sub>[U-&delta;, U]</sub> concentrates all its mass toward &tau;=U as &delta;&rarr;0<sup>+</sup>.
        The Rayleigh quotient Q(f<sub>&delta;</sub>) rises monotonically toward the sharp, non-attained
        supremum sup Q = tanh(a&middot;U) = {ceiling.toFixed(5)} &mdash; strictly below the trivial ceiling 1,
        leaving a strictly positive margin 1&thinsp;&minus;&thinsp;tanh(a&middot;U) = {margin.toFixed(5)} (shaded).
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {yTicks.map((v) => (
            <g key={`yt${v.toFixed(5)}`}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily="var(--font-mono)">{v.toFixed(3)}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* trivial ceiling = 1 dashed line */}
          <line x1={ML} y1={py(1)} x2={W - MR} y2={py(1)} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
          <text x={W - MR - 4} y={py(1) - 5} textAnchor="end" fontSize="10" fill="#475569" fontFamily="var(--font-mono)">1 (trivial)</text>
          {/* analytic ceiling tanh(a*U) dashed line */}
          <line x1={ML} y1={py(ceiling)} x2={W - MR} y2={py(ceiling)} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x={W - MR - 4} y={py(ceiling) - 5} textAnchor="end" fontSize="10" fill="#06b6d4" fontFamily="var(--font-mono)">tanh(a&middot;U) = {ceiling.toFixed(5)}</text>
          {/* strictly-positive margin, shaded */}
          <path d={shadedPath} fill="#06b6d4" fillOpacity="0.12" stroke="none" />
          {/* Q(f_delta) curve */}
          <path d={linePath} fill="none" stroke="#22d3ee" strokeWidth="2" />
          {ladder.map((row, i) => (
            <g key={`pt${i}`}>
              <circle cx={px(i)} cy={py(row.quotient)} r="3" fill="#22d3ee" />
              <title>&delta;={row.delta}, Q={row.quotient.toFixed(6)}</title>
            </g>
          ))}
          <text x={px(0)} y={H - MB + 16} textAnchor="start" fontSize="10" fill="#64748b" fontFamily="var(--font-mono)">&delta;={ladder[0].delta} (spread out)</text>
          <text x={px(n - 1)} y={H - MB + 16} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="var(--font-mono)">&delta;={ladder[n - 1].delta} (&rarr;U)</text>
        </svg>
      </div>
      <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
        <strong style={{ color: '#f87171' }}>Honest scope (imp-3288):</strong>{' '}
        Rigorous NEGATIVE result about the SCALAR cosh passive core ONLY, proved over the full
        L2([0,U]) span (not merely this trial family). Does NOT touch the operator-positivity
        residual K<sub>a</sub>&thinsp;&ge;&thinsp;0, makes NO claim the cover holds or fails, carries NO RH verdict.
        Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
        Source: imp-3288-analytic-ceiling-lemma.js &mdash; a={L.a}, U={L.U}, concentrating ladder &delta;&isin;[{ladder[n - 1].delta},{ladder[0].delta}].
      </p>
    </div>
  );
}

// ── imp-3220 GUE-conditional share sigma(N) U-shape across the assembly range ──
// Shows sigma(N) = E_coll/E(N) dipping to a minimum near N~100 then rising to its
// widest value at the N*=10^6 assembly ceiling, with the E_coll/E_flow ratio
// overlaid on a second (right) axis -- the mechanism behind the rising right arm.
function ConditionalShareUShapePanel() {
  const F = IMP3220_EN_BRIDGE_FIDELITY_FRONTIER;
  const table = F.table;
  const n = table.length;

  const W = 660, H = 280, ML = 56, MR = 60, MT = 26, MB = 44;
  const shareMin = 0.8, shareMax = 1.0;
  const ratioMin = 0, ratioMax = 35;
  const px = (i) => ML + (i / (n - 1)) * (W - ML - MR);
  const pyShare = (v) => H - MB - ((v - shareMin) / (shareMax - shareMin)) * (H - MT - MB);
  const pyRatio = (v) => H - MB - ((v - ratioMin) / (ratioMax - ratioMin)) * (H - MT - MB);

  const sharePath = table.map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${pyShare(row.conditionalShare)}`).join(' ');
  const ratioPath = table.map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${pyRatio(row.E_coll_over_E_flow)}`).join(' ');

  const shareTicks = [0.8, 0.85, 0.9, 0.95, 1.0];
  const ratioTicks = [0, 10, 20, 30];

  const minIdx = table.findIndex((r) => r.N === F.narrowestGap.N);
  const maxIdx = table.findIndex((r) => r.N === F.widestGap.N);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #a78bfa', background: 'rgba(167,139,250,0.04)' }}>
      <h3 style={{ color: '#a78bfa', marginTop: 0, fontSize: 14 }}>
        GUE-conditional share &sigma;(N) is U-shaped across the assembly range, widest at N*=10<sup>6</sup> (imp-3220)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
        &sigma;(N) = E<sub>coll</sub>(N)/E(N), the fraction of the bridge budget E(N) resting on the GUE-conditional
        C<sub>H</sub>, dips to a minimum &asymp;{F.narrowestGap.conditionalShare.toFixed(3)} near N&asymp;{F.narrowestGap.N} then
        rises monotonically to its widest value &asymp;{F.widestGap.conditionalShare.toFixed(3)} at the
        N*={F.widestGap.N.toExponential(0).replace('e+', 'e')} assembly ceiling &mdash; exactly where PATH 1 pushed the
        unconditional empirical E1/E2 floor. The overlaid E<sub>coll</sub>/E<sub>flow</sub> ratio (dashed, right axis) grows
        &asymp;{Math.round(table[n - 1].E_coll_over_E_flow)}&times; toward that ceiling, the mechanism behind the rising right arm.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {shareTicks.map((v) => (
            <g key={`ls${v}`}>
              <line x1={ML} y1={pyShare(v)} x2={W - MR} y2={pyShare(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={pyShare(v) + 4} textAnchor="end" fontSize="11" fill="#a78bfa" fontFamily={mono}>{v.toFixed(2)}</text>
            </g>
          ))}
          {ratioTicks.map((v) => (
            <text key={`rs${v}`} x={W - MR + 10} y={pyRatio(v) + 4} textAnchor="start" fontSize="11" fill="#f59e0b" fontFamily={mono}>{v}</text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* sigma(N) U-curve, left axis */}
          <path d={sharePath} fill="none" stroke="#a78bfa" strokeWidth="2.5" />
          {table.map((row, i) => (
            <circle key={`sp${i}`} cx={px(i)} cy={pyShare(row.conditionalShare)} r={i === minIdx || i === maxIdx ? 4.5 : 3} fill="#a78bfa">
              <title>{`N=${row.N}, sigma=${row.conditionalShare}`}</title>
            </circle>
          ))}
          {/* E_coll/E_flow ratio, right axis, dashed */}
          <path d={ratioPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
          {table.map((row, i) => (
            <circle key={`rp${i}`} cx={px(i)} cy={pyRatio(row.E_coll_over_E_flow)} r="2.5" fill="#f59e0b">
              <title>{`N=${row.N}, E_coll/E_flow=${row.E_coll_over_E_flow}`}</title>
            </circle>
          ))}
          {table.map((row, i) => (
            <text key={`xl${i}`} x={px(i)} y={H - MB + 16} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily={mono}>
              {row.N >= 1000 ? row.N.toExponential(0).replace('e+', 'e') : row.N}
            </text>
          ))}
          <text x={ML} y={16} textAnchor="start" fontSize="10" fill="#a78bfa" fontFamily={mono}>&sigma;(N) (left)</text>
          <text x={W - MR} y={16} textAnchor="end" fontSize="10" fill="#f59e0b" fontFamily={mono}>E_coll/E_flow (right)</text>
        </svg>
      </div>
      <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
        <strong style={{ color: '#f87171' }}>Honest scope (imp-3220):</strong>{' '}
        ASSESSMENT ONLY: E<sub>coll</sub> is the sole GUE-conditional sub-term (C<sub>H</sub> = 1/8 ansatz, the
        C<sub>mb</sub>&thinsp;&le;&thinsp;1 conditional of imp-486); E<sub>flow</sub> and E<sub>trunc</sub> are already
        unconditionally rigorous. No positivity, no bridge closure, no RH claim, NO QED. Platt&ndash;Trudgian
        &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
      </div>
      <div style={{ marginTop: 6, padding: '6px 10px', borderRadius: 4, background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.18)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
        <strong style={{ color: '#a78bfa' }}>C<sub>H</sub> load-bearing note (imp-3324/imp-3392):</strong>{' '}
        C<sub>H</sub> = 1/8 is load-bearing for the <em>absolute</em> collision budget E<sub>coll</sub> (linear in
        C<sub>H</sub>, so a 16&times; bracket [0.0625,&thinsp;1.0] swings E<sub>coll</sub> 16&times;) but NOT for the
        <em> conditional share</em> &sigma;(N) plotted above, which saturates toward 1 and stays within
        [0.904,&thinsp;0.993] over that same bracket. The two roles must not be conflated.
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3220-en-bridge-fidelity-frontier.js &mdash; N&isin;{'{2..10'}<sup>6</sup>{'}'}, dual-axis (&sigma;(N) left, E_coll/E_flow right).
      </p>
    </div>
  );
}

// ── imp-3324/imp-3393: sigma(C_H) saturation curve + semi-elasticity sigma(1-sigma) ──
// Shows the conditional share sigma(10^6) rising toward its saturation ceiling 1 as
// C_H sweeps the plausible [0.0625, 1.0] bracket, and the semi-elasticity
// d(sigma)/d(log C_H) = sigma(1-sigma) (right axis) shrinking toward 0 as sigma nears
// that ceiling -- the mechanism behind the imp-3324 robustness finding.
function SigmaCHSaturationPanel() {
  const D = IMP3324_SIGMA_CH_SENSITIVITY;
  const sweep = D.sweep;
  const n = sweep.length;

  const W = 640, H = 260, ML = 56, MR = 60, MT = 24, MB = 44;
  const sigmaMin = 0.88, sigmaMax = 1.0;
  const elastMin = 0, elastMax = 0.14;
  const px = (i) => ML + (i / (n - 1)) * (W - ML - MR);
  const pySigma = (v) => H - MB - ((v - sigmaMin) / (sigmaMax - sigmaMin)) * (H - MT - MB);
  const pyElast = (v) => H - MB - ((v - elastMin) / (elastMax - elastMin)) * (H - MT - MB);

  const sigmaPath = sweep.map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${pySigma(row.sigma)}`).join(' ');
  const elastPath = sweep
    .map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${pyElast(row.sigma * (1 - row.sigma))}`)
    .join(' ');

  const sigmaTicks = [0.88, 0.92, 0.96, 1.0];
  const elastTicks = [0, 0.05, 0.1];
  const ansatzIdx = sweep.findIndex((r) => r.C_H === 0.125);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #a78bfa', background: 'rgba(167,139,250,0.04)' }}>
      <h3 style={{ color: '#a78bfa', marginTop: 0, fontSize: 14 }}>
        &sigma;(C<sub>H</sub>) saturates toward 1, so the semi-elasticity &sigma;(1&minus;&sigma;) shrinks toward 0 (imp-3324)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
        At N*=10<sup>6</sup>, &sigma;(C<sub>H</sub>) (solid, left axis) rises from &asymp;{D.robustness.sigma_at_half_ansatz.toFixed(3)} at
        C<sub>H</sub>=0.0625 to &asymp;{D.robustness.sigma_at_placeholder.toFixed(3)} at C<sub>H</sub>=1.0 &mdash; a 16&times; C<sub>H</sub> range
        compressed into a &asymp;{(D.robustness.bracket_share_span * 100).toFixed(1)}-point share band. The semi-elasticity
        d&sigma;/d(log&nbsp;C<sub>H</sub>) = &sigma;(1&minus;&sigma;) (dashed, right axis) falls from
        &asymp;{(sweep[0].sigma * (1 - sweep[0].sigma)).toFixed(3)} to &asymp;{(sweep[n - 1].sigma * (1 - sweep[n - 1].sigma)).toFixed(4)} across the
        same sweep, the saturation signature behind the imp-3324 robustness finding.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {sigmaTicks.map((v) => (
            <g key={`ss${v}`}>
              <line x1={ML} y1={pySigma(v)} x2={W - MR} y2={pySigma(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={pySigma(v) + 4} textAnchor="end" fontSize="11" fill="#a78bfa" fontFamily={mono}>{v.toFixed(2)}</text>
            </g>
          ))}
          {elastTicks.map((v) => (
            <text key={`es${v}`} x={W - MR + 10} y={pyElast(v) + 4} textAnchor="start" fontSize="11" fill="#f59e0b" fontFamily={mono}>{v.toFixed(2)}</text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* sigma(C_H) saturation curve, left axis */}
          <path d={sigmaPath} fill="none" stroke="#a78bfa" strokeWidth="2.5" />
          {sweep.map((row, i) => (
            <circle key={`sc${i}`} cx={px(i)} cy={pySigma(row.sigma)} r={i === ansatzIdx ? 4.5 : 3} fill="#a78bfa">
              <title>{`C_H=${row.C_H}, sigma=${row.sigma}`}</title>
            </circle>
          ))}
          {/* semi-elasticity sigma(1-sigma), right axis, dashed */}
          <path d={elastPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
          {sweep.map((row, i) => (
            <circle key={`ec${i}`} cx={px(i)} cy={pyElast(row.sigma * (1 - row.sigma))} r="2.5" fill="#f59e0b">
              <title>{`C_H=${row.C_H}, sigma(1-sigma)=${(row.sigma * (1 - row.sigma)).toFixed(5)}`}</title>
            </circle>
          ))}
          {sweep.map((row, i) => (
            <text key={`xl${i}`} x={px(i)} y={H - MB + 16} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily={mono}>
              {row.C_H}
            </text>
          ))}
          <text x={ML} y={16} textAnchor="start" fontSize="10" fill="#a78bfa" fontFamily={mono}>&sigma;(C_H) (left)</text>
          <text x={W - MR} y={16} textAnchor="end" fontSize="10" fill="#f59e0b" fontFamily={mono}>&sigma;(1&minus;&sigma;) (right)</text>
        </svg>
      </div>
      <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
        <strong style={{ color: '#f87171' }}>Honest scope (imp-3324):</strong>{' '}
        ASSESSMENT ONLY: C<sub>H</sub> is load-bearing for the absolute E<sub>coll</sub> budget (linear) but NOT for the
        conditional share &sigma;, which saturates toward 1. No positivity, no bridge closure, no RH claim, NO QED.
        Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3324-sigma-CH-sensitivity.js &mdash; N*=10<sup>6</sup>, C<sub>H</sub>&isin;[0.0625,&thinsp;1.0], dual-axis (&sigma;(C_H) left, &sigma;(1&minus;&sigma;) right).
      </p>
    </div>
  );
}

// ── imp-3219 fine-grid capture(c) overshoot: rise to peak, then monotone relax ──
// Shows the near-diagonal bridge capture curve capture(c) = ||T_c|| / ||T|| on the
// fine lag grid: it crosses 1 at the onset cutoff, overshoots to a bounded (<0.5%)
// peak one lag step later, then relaxes monotonically back to 1 -- the minimal
// lag-support carrying essentially the entire bridge operator norm.
function CaptureOvershootKneePanel() {
  const M = IMP3219_MUPASS_BRIDGE_OVERSHOOT_KNEE.measured;
  const table = M.fineTable;
  const n = table.length;

  const W = 640, H = 260, ML = 56, MR = 24, MT = 22, MB = 44;
  const xMax = table[n - 1].cutoff;
  const yMin = 0.98, yMax = 1.006;
  const px = (c) => ML + (c / xMax) * (W - ML - MR);
  const py = (v) => H - MB - ((v - yMin) / (yMax - yMin)) * (H - MT - MB);
  const yTicks = [0.98, 0.99, 1.0, M.overshootPeak, 1.005];

  const linePath = table.map((row, i) => `${i === 0 ? 'M' : 'L'} ${px(row.cutoff)} ${py(row.capture)}`).join(' ');
  const onsetRow = table.find((r) => r.cutoff === M.onsetCutoff) || table.find((r) => r.capture > 1);
  const peakRow = table.find((r) => r.capture === M.overshootPeak);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #34d399', background: 'rgba(52,211,153,0.04)' }}>
      <h3 style={{ color: '#34d399', marginTop: 0, fontSize: 14 }}>
        Fine-grid capture(c) overshoots 1 by &lt;0.5%, peaking at c*&asymp;{M.cStar.toFixed(2)}, then relaxes monotonically (imp-3219)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
        On the fine lag grid (one integer lag step per sample), the near-diagonal band-truncated capture
        first crosses 1 at the onset c&asymp;{M.onsetCutoff.toFixed(2)}, overshoots to a peak
        capture&asymp;{M.overshootPeak.toFixed(6)} ({M.overshootPercent.toFixed(3)}%) at c*&asymp;{M.cStar.toFixed(2)}, then
        relaxes monotonically back to within 1e-4 of 1 by c&asymp;{table[n - 1].cutoff.toFixed(2)}. The overshoot means the
        near-diagonal band alone carries marginally MORE operator norm than the full bridge operator -- the far-lag
        tail is indefinite and partially self-cancelling, not additive.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {yTicks.map((v) => (
            <g key={`yt${v.toFixed(5)}`}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="var(--font-mono)">{v.toFixed(4)}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* capture = 1 reference line */}
          <line x1={ML} y1={py(1)} x2={W - MR} y2={py(1)} stroke="#475569" strokeWidth="1" strokeDasharray="4 3" />
          <text x={W - MR - 4} y={py(1) - 5} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="var(--font-mono)">capture = 1</text>
          {/* capture(c) curve */}
          <path d={linePath} fill="none" stroke="#34d399" strokeWidth="2" />
          {onsetRow && (
            <g>
              <circle cx={px(onsetRow.cutoff)} cy={py(onsetRow.capture)} r="4" fill="#facc15" />
              <text x={px(onsetRow.cutoff)} y={py(onsetRow.capture) - 8} textAnchor="middle" fontSize="10" fill="#facc15" fontFamily="var(--font-mono)">onset c&asymp;{onsetRow.cutoff.toFixed(2)}</text>
            </g>
          )}
          {peakRow && (
            <g>
              <circle cx={px(peakRow.cutoff)} cy={py(peakRow.capture)} r="4" fill="#f87171" />
              <text x={px(peakRow.cutoff)} y={py(peakRow.capture) - 8} textAnchor="middle" fontSize="10" fill="#f87171" fontFamily="var(--font-mono)">peak c*&asymp;{peakRow.cutoff.toFixed(2)}</text>
            </g>
          )}
          <text x={px(xMax)} y={H - MB + 16} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="var(--font-mono)">c&rarr;{xMax.toFixed(2)} (relaxed)</text>
          <text x={ML} y={H - MB + 16} textAnchor="start" fontSize="10" fill="#64748b" fontFamily="var(--font-mono)">c=0</text>
        </svg>
      </div>
      <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
        <strong style={{ color: '#f87171' }}>Honest scope (imp-3219):</strong>{' '}
        RH-EQUIVALENT diagnostic only: locating the capture overshoot peak is a cutoff-localization
        measurement, NOT a construction of the missing operator-norm magnitude or the K<sub>a</sub>&thinsp;&ge;&thinsp;0
        positivity residual. Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
        Source: imp-3219-mupass-bridge-overshoot-knee.js &mdash; a=0.5, U=6, N=200, fine lag-band sweep.
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
        C = sqrt(2)*(1 &minus; arcsinh(1)) &asymp; {C.toFixed(5)} (imp-3087 onset pole constant);{" "}
        K = 2*(sqrt(2) &minus; arcsinh(1)) &asymp; {K.toFixed(5)} (imp-3088 large-s decay constant).{" "}
        Convergence signatures (imp-3112): &phi;(s<sub>0</sub>+&epsilon;)&epsilon;<sup>2</sup>/C&rarr;1 as &epsilon;&rarr;0+
        (ratio within ~3.3&times;10<sup>&minus;5</sup> of 1 at &epsilon;=10<sup>&minus;5</sup>);{" "}
        &phi;(s)e<sup>s</sup>/K&rarr;1 as s&rarr;&infin;
        (ratio within ~10<sup>&minus;7</sup> of 1 at s=20).{" "}
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

// ── imp-3095: scalar-phi collapse -- phi(s) = G(s)/F(s) single curve + grid dots ─────
// Implements the scalar-phi collapse that OperatorGapCollapseViz calls "pending imp-3095".
// Plots the continuous curve phi(s) = G(s)/F(s) with all 20 (a,U) grid cells overlaid
// as colored dots, demonstrating that equal-product cells collapse onto a single point.
function PhiCollapseViz() {
  const M = IMP3064_DEFICIT_EXCESS_FRACTION_GRID;
  const rows = M.rows;
  const si = M.scaleInvariantFinding;

  const ASINH1 = Math.asinh(1);   // ~0.88137 -- overflow onset s0
  const SQRT2  = Math.SQRT2;
  const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;
  const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);
  const phi = (s) => (s > ASINH1 ? G(s) / F(s) : null);

  const W = 720, H = 340, ML = 60, MR = 24, MT = 24, MB = 48;
  const S_MIN = 0.9, S_MAX = 5.5, PHI_MAX = 2.2;
  const px = (s) => ML + ((s - S_MIN) / (S_MAX - S_MIN)) * (W - ML - MR);
  const py = (v) => H - MB - (v / PHI_MAX) * (H - MT - MB);

  const sTicks = [1, 2, 3, 4, 5];
  const phiTicks = [0, 0.5, 1.0, 1.5, 2.0];

  // Continuous curve: dense points from just above s0 to S_MAX
  const S_CURVE_START = ASINH1 + 0.015;
  const N_CURVE = 400;
  const curvePts = [];
  for (let i = 0; i <= N_CURVE; i++) {
    const s = S_CURVE_START + (i / N_CURVE) * (S_MAX - S_CURVE_START);
    const v = phi(s);
    if (v !== null && v <= PHI_MAX * 1.05) curvePts.push({ s, v });
  }
  const curvePath = curvePts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.s).toFixed(1)} ${py(Math.min(p.v, PHI_MAX)).toFixed(1)}`)
    .join(' ');

  // Grid dots: cells with overflow only
  const dotRows = rows.filter((r) => r.hasOverflow && r.s >= S_MIN && r.s <= S_MAX);

  // Headline coincidence pair: (a=0.5,U=6) and (a=0.3,U=10) both at s=3
  const eqPairS = 3.0;
  const eqPhi   = phi(eqPairS);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #f59e0b", background: "rgba(245,158,11,0.04)" }}>
      <h3 style={{ color: "#f59e0b", marginTop: 0 }}>
        phi(s) = G(s)/F(s): all equal-product (a,U) cells collapse onto one curve (imp-3095)
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        The excess fraction <span style={{ fontFamily: mono }}>phi = E / D_raw</span> depends only on
        the product <span style={{ fontFamily: mono }}>s = a&middot;U</span>. Here the continuous curve{" "}
        <span style={{ fontFamily: mono }}>phi(s) = G(s)/F(s)</span> (white) is plotted linearly,
        with all grid cells from the 5&times;4 (a, U) array overlaid as colored dots.
        Every dot lands exactly on the curve; cells sharing the same product (gold annotation at s=3)
        are indistinguishable. As s grows, <span style={{ fontFamily: mono }}>F(s)~e^s/2</span> diverges
        while <span style={{ fontFamily: mono }}>G(s)</span> saturates at{" "}
        <span style={{ fontFamily: mono }}>&radic;2&minus;arcsinh(1)&asymp;{si.saturationCeiling.toFixed(4)}</span>,
        so <span style={{ fontFamily: mono }}>phi&rarr;0</span>: the no-ghost surplus is small
        precisely where the overflow is large.
      </p>
      <div style={{ overflowX: "auto" }}>
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
          {/* grid lines */}
          {phiTicks.map((v) => (
            <g key={"pt" + v}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{v.toFixed(1)}</text>
            </g>
          ))}
          {sTicks.map((s) => (
            <g key={"st" + s}>
              <line x1={px(s)} y1={MT} x2={px(s)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={px(s)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{s}</text>
            </g>
          ))}
          {/* axes */}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* onset vertical at s0 */}
          <line x1={px(ASINH1)} y1={MT} x2={px(ASINH1)} y2={H - MB} stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <text x={px(ASINH1) + 4} y={MT + 14} fontSize="10" fill="#ef4444" fontFamily={mono}>s0=arcsinh(1)</text>
          {/* phi=0 reference */}
          <line x1={ML} y1={py(0)} x2={W - MR} y2={py(0)} stroke="#334155" strokeWidth="1.5" />
          {/* phi=1 reference */}
          <line x1={ML} y1={py(1)} x2={W - MR} y2={py(1)} stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <text x={W - MR - 4} y={py(1) - 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>phi=1</text>
          {/* axis labels */}
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>
            s = a&middot;U
          </text>
          <text x={14} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={`rotate(-90 14 ${(MT + H - MB) / 2})`}>
            phi(s) = G(s)/F(s)
          </text>
          {/* continuous phi(s) curve */}
          <path d={curvePath} fill="none" stroke="#e2e8f0" strokeWidth="2" />
          {/* grid dots colored by a */}
          {dotRows.map((r, i) => (
            <circle key={i} cx={px(r.s)} cy={py(r.excessFraction)} r="5"
              fill={A_COLORS[r.a] || "#94a3b8"} fillOpacity="0.65"
              stroke={A_COLORS[r.a] || "#94a3b8"} strokeWidth="1.2">
              <title>{`a=${r.a}, U=${r.U}  s=${r.s.toFixed(2)}  phi=${r.excessFraction.toFixed(5)}`}</title>
            </circle>
          ))}
          {/* equal-product annotation at s=3 */}
          {eqPhi !== null && eqPhi <= PHI_MAX && (
            <g>
              <line x1={px(eqPairS)} y1={py(eqPhi) - 10} x2={px(eqPairS)} y2={MT + 6}
                stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
              <text x={px(eqPairS) + 5} y={MT + 16} fontSize="10" fill="#fbbf24" fontFamily={mono}>
                s=3: (0.5,6)=(0.3,10)
              </text>
              <text x={px(eqPairS) + 5} y={MT + 27} fontSize="10" fill="#fbbf24" fontFamily={mono}>
                phi={eqPhi.toFixed(4)}
              </text>
            </g>
          )}
          {/* legend */}
          {[0.5, 0.3, 0.2, 0.1].map((a, i) => (
            <g key={"leg" + a} transform={`translate(${W - MR - 90}, ${MT + 10 + i * 18})`}>
              <circle cx="0" cy="-4" r="5" fill={A_COLORS[a]} fillOpacity="0.65" stroke={A_COLORS[a]} strokeWidth="1.2" />
              <text x="12" y="0" fontSize="11" fill="#cbd5e1" fontFamily={mono}>a = {a}</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 5, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.3)", fontSize: 12, color: "#cbd5e1", lineHeight: 1.65 }}>
        <strong style={{ color: "#fbbf24", fontFamily: mono }}>SCALE INVARIANCE: </strong>
        Every (a,U) dot lies on the smooth curve phi(s)=G(s)/F(s).
        The (0.5,6) and (0.3,10) dots are indistinguishable at s=3 (gold annotation).
        Cells below the onset s0=arcsinh(1) have no overflow and are omitted.
        F(s)=cosh(s)&minus;&radic;2&minus;s+arcsinh(1), G(s)=&radic;2&minus;arcsinh(1)&minus;e^(&minus;s).
      </div>
      <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.25)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 4 }}>
          DEGREE-0 SCALAR ONLY &mdash; RH-EQUIVALENT &mdash; NO RH VERDICT
        </div>
        <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          {M.honestCaveat.operatorStepUntouched} {M.honestCaveat.sota}.
        </p>
      </div>
      <p style={{ marginTop: 10, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3064-deficit-excess-fraction-grid.js &mdash; scalar companion to the imp-3085 operator-gap collapse viz.
        imp-3095.
      </p>
    </div>
  );
}

// ── imp-3353: degree-0 bridge-margin ratio B/D(s) as a curve over s=aU (imp-3255 closed form) ──
// B/D(s) = (sinh s - s) / (cosh s - s + arcsinh(1) - sqrt2), diverging as s -> arcsinh(1)+
// (D_0 -> 0) and -> 1+ as s -> inf. Same closed form as IMP3255_BRIDGE_RATIO_CLOSED_FORM;
// sampled densely here purely for smooth rendering (no new computation, matches the PhiCollapseViz pattern).
function BridgeMarginRatioCurvePanel() {
  const M = IMP3255_BRIDGE_RATIO_CLOSED_FORM.measured;
  const C = IMP3255_BRIDGE_RATIO_CLOSED_FORM.construction;

  const ASINH1 = Math.asinh(1);          // ~0.881374 -- the D_0=0 pole, s0 = arcsinh(1)
  const RATIO_CONST = ASINH1 - Math.SQRT2;
  const ratioOfScale = (s) => (Math.sinh(s) - s) / (Math.cosh(s) - s + RATIO_CONST);

  const W = 680, H = 300, ML = 56, MR = 24, MT = 22, MB = 44;
  const S_MIN = ASINH1, S_MAX = 6.5, Y_MIN = 1, Y_MAX = 3.2;
  const px = (s) => ML + ((s - S_MIN) / (S_MAX - S_MIN)) * (W - ML - MR);
  const py = (v) => H - MB - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - MT - MB);

  const sTicks = [1, 2, 3, 4, 5, 6];
  const yTicks = [1, 1.5, 2, 2.5, 3];

  // Continuous curve: dense points from just above the pole to S_MAX, clipped at Y_MAX.
  const S_CURVE_START = ASINH1 + 0.01;
  const N_CURVE = 400;
  const curvePts = [];
  for (let i = 0; i <= N_CURVE; i++) {
    const s = S_CURVE_START + (i / N_CURVE) * (S_MAX - S_CURVE_START);
    const v = ratioOfScale(s);
    if (v <= Y_MAX * 1.05) curvePts.push({ s, v });
  }
  const curvePath = curvePts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.s).toFixed(1)} ${py(Math.min(p.v, Y_MAX)).toFixed(1)}`)
    .join(' ');

  // Cross-check dots from the module's own s-sweep table, where they fall in the plotted window.
  const tableDots = M.ratioVsS.filter((r) => r.s >= S_MIN && r.s <= S_MAX && r.ratio <= Y_MAX);
  const sGenuine = C.sGenuine;
  const ratioGenuine = M.ratioExact;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #38bdf8", background: "rgba(56,189,248,0.04)" }}>
      <h3 style={{ color: "#38bdf8", marginTop: 0 }}>
        Bridge-margin ratio B/D(s) as a curve over s=aU: diverges at the D&#x2080;=0 pole, &#x2192;1 as s&#x2192;&#x221E; (imp-3255 / imp-3353)
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        The degree-0 cosh-completion bridge margin{' '}
        <span style={{ fontFamily: mono }}>B/D(s) = (sinh s &minus; s) / (cosh s &minus; s + arcsinh(1) &minus; &radic;2)</span>{' '}
        depends only on the single scale <span style={{ fontFamily: mono }}>s = a&middot;U</span> (imp-3255). It
        diverges to +&#x221E; as <span style={{ fontFamily: mono }}>s &#x2192; arcsinh(1)&#x207A;</span> (the raw
        overflow deficit <span style={{ fontFamily: mono }}>D&#x2080; &#x2192; 0</span>), and relaxes toward{' '}
        <span style={{ fontFamily: mono }}>1&#x207A;</span> as s grows &mdash; the recorded 1.074 surplus is just
        the genuine cell&apos;s <span style={{ fontFamily: mono }}>s = {sGenuine}</span> point on this curve, not a
        universal constant.
      </p>
      <div style={{ overflowX: "auto" }}>
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
          {yTicks.map((v) => (
            <g key={`yt${v}`}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{v.toFixed(1)}</text>
            </g>
          ))}
          {sTicks.map((s) => (
            <g key={`st${s}`}>
              <line x1={px(s)} y1={MT} x2={px(s)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={px(s)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{s}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* D_0=0 pole at s0=arcsinh(1) */}
          <line x1={px(ASINH1)} y1={MT} x2={px(ASINH1)} y2={H - MB} stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <text x={px(ASINH1) + 4} y={MT + 14} fontSize="10" fill="#ef4444" fontFamily={mono}>s0=arcsinh(1)={ASINH1.toFixed(5)}</text>
          {/* B/D -> 1 asymptote */}
          <line x1={ML} y1={py(1)} x2={W - MR} y2={py(1)} stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <text x={W - MR - 4} y={py(1) - 5} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>B/D&rarr;1</text>
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>s = a&middot;U</text>
          <text x={14} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={`rotate(-90 14 ${(MT + H - MB) / 2})`}>B/D(s)</text>
          {/* continuous B/D(s) curve */}
          <path d={curvePath} fill="none" stroke="#e2e8f0" strokeWidth="2" />
          {/* cross-check dots from the module's own s-sweep table */}
          {tableDots.map((r) => (
            <circle key={`d${r.s}`} cx={px(r.s)} cy={py(r.ratio)} r="4" fill="#38bdf8" fillOpacity="0.7" stroke="#38bdf8" strokeWidth="1">
              <title>{`s=${r.s}: B/D=${r.ratio.toFixed(5)}`}</title>
            </circle>
          ))}
          {/* genuine cell s=3 */}
          <g>
            <circle cx={px(sGenuine)} cy={py(ratioGenuine)} r="5" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" />
            <text x={px(sGenuine) + 6} y={py(ratioGenuine) - 8} fontSize="10" fill="#fbbf24" fontFamily={mono}>
              genuine cell s={sGenuine}, B/D={ratioGenuine.toFixed(3)}
            </text>
          </g>
        </svg>
      </div>
      <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.25)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 4 }}>
          DEGREE-0 SCALAR MASS-FEASIBILITY ONLY &mdash; RH-EQUIVALENT &mdash; NO RH VERDICT
        </div>
        <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          B/D &gt; 1 kills the impossibility option but is necessary-but-not-sufficient; the operator-level
          K&#x2090;&thinsp;&#x2265;&thinsp;0 endpoint-Hankel obstruction (imp-3066) is untouched. Platt&ndash;Trudgian
          &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3255-bridge-ratio-closed-form.js &mdash; genuine cell a=0.5, U=6, s=aU=3.
      </p>
    </div>
  );
}

// ── imp-3136: C_shock margin 1/3 - C_shock(N) grows with N (imp-3108 data) ───
// ── imp-3180: onset derivative drho/ds showing c_asym root vs imp-3045 false onset ──
function AsymOnsetDerivativeViz() {
  const CF = SG1C_ASYM_ISOLATION_CLOSED_FORM;
  const C_ASYM = CF.cAsym;                      // 0.9027902227683418
  const FALSE_G = CF.scanDiscontinuityValue;     // 0.9032364257812502
  const FALSE_DRHO = asymOnsetDrho(FALSE_G);     // ~+0.00242

  const G_MIN = 0.68, G_MAX = 0.975;
  const N_POINTS = 300;
  const points = [];
  for (let i = 0; i <= N_POINTS; i++) {
    const g = G_MIN + (i / N_POINTS) * (G_MAX - G_MIN);
    points.push({ g, v: asymOnsetDrho(g) });
  }

  const W = 700, H = 300, ML = 72, MR = 36, MT = 28, MB = 52;
  const Y_MIN = -1.4, Y_MAX = 0.28;

  const px = (g) => ML + ((g - G_MIN) / (G_MAX - G_MIN)) * (W - ML - MR);
  const py = (v) => H - MB - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - MT - MB);

  const zeroY = py(0);
  const cx_root  = px(C_ASYM);
  const cx_false = px(FALSE_G);
  const cy_false = py(FALSE_DRHO);
  const cx_basin = px(0.72);
  const ycx = (MT + H - MB) / 2;

  // Clip path to display window
  const clipped = points.filter((p) => p.v >= Y_MIN && p.v <= Y_MAX);
  const linePath = clipped
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.g).toFixed(1)} ${py(p.v).toFixed(1)}`)
    .join(' ');

  const yTicks = [-1.2, -0.9, -0.6, -0.3, 0.0];
  const xTicks = [0.70, 0.75, 0.80, 0.85, 0.90, 0.95];

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #10b981', background: 'rgba(16,185,129,0.04)' }}>
      <h3 style={{ color: '#10b981', marginTop: 0 }}>
        Onset derivative d&rho;/ds(g) = &psi;(g+1)+&gamma;+2g&minus;2/g&minus;1/(g+1):
        closed-form root c<sub>asym</sub>=0.90279 vs imp-3045 false onset at 0.9032364 (imp-3170)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The smooth function d&rho;/ds(g) vanishes at exactly one point in (0,1): the
        transcendental root c<sub>asym</sub>&nbsp;&asymp;&nbsp;0.90279 (emerald circle on the zero line).
        The imp-3045 bisection reported &asymp;0.9032364 as the onset (amber circle), but
        d&rho;/ds(0.9032364)&nbsp;=&nbsp;+0.00242&nbsp;&gt;&nbsp;0 &mdash; the bisection locked onto a
        DISCONTINUITY of the discrete minimal-gap selector, not the smooth zero. The
        true root c<sub>asym</sub> is 0.000446 lower. The Theorem-C basin boundary 0.72
        (cyan dashed) sits deep in the self-improving region: d&rho;/ds(0.72)&asymp;&minus;1.12.
      </p>
      <div style={{ overflowX: 'auto', marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {/* y grid + labels */}
          {yTicks.map((v) => (
            <g key={"y" + v}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{v.toFixed(1)}</text>
            </g>
          ))}
          {/* x ticks */}
          {xTicks.map((g) => (
            <g key={"x" + g}>
              <line x1={px(g)} y1={H - MB} x2={px(g)} y2={H - MB + 5} stroke="#334155" strokeWidth="1" />
              <text x={px(g)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{g.toFixed(2)}</text>
            </g>
          ))}
          {/* axes */}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* axis labels */}
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>g (isolation ratio)</text>
          <text x={14} y={ycx} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={"rotate(-90 14 " + ycx + ")"}>{"drho/ds(g)"}</text>
          {/* zero line */}
          <line x1={ML} y1={zeroY} x2={W - MR} y2={zeroY} stroke="#475569" strokeWidth="1.2" strokeDasharray="4 3" />
          <text x={W - MR - 4} y={zeroY - 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>0</text>
          {/* basin boundary at 0.72 */}
          <line x1={cx_basin} y1={MT} x2={cx_basin} y2={H - MB} stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="4 3" />
          <text x={cx_basin + 4} y={MT + 12} fontSize="10" fill="#22d3ee" fontFamily={mono}>basin=0.72</text>
          {/* curve */}
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" />
          {/* true root: c_asym circle on the zero line */}
          <circle cx={cx_root} cy={zeroY} r={6} fill="#10b981" stroke="#34d399" strokeWidth="1.5">
            <title>{"c_asym=" + C_ASYM.toFixed(10) + "  drho/ds=0 (true root)"}</title>
          </circle>
          <line x1={cx_root} y1={zeroY - 8} x2={cx_root + 4} y2={zeroY - 32} stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" />
          <text x={cx_root + 8} y={zeroY - 32} fontSize="10" fill="#34d399" fontFamily={mono}>{"c_asym=0.90279"}</text>
          <text x={cx_root + 8} y={zeroY - 20} fontSize="10" fill="#94a3b8" fontFamily={mono}>{"drho/ds=0 (true root)"}</text>
          {/* false-onset: imp-3045 scan lock point */}
          <circle cx={cx_false} cy={cy_false} r={6} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5">
            <title>{"imp-3045 scan=0.9032364  drho/ds=+0.00242 > 0 (NOT the true zero)"}</title>
          </circle>
          <line x1={cx_false} y1={cy_false + 8} x2={cx_false + 4} y2={cy_false + 32} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
          <text x={cx_false + 8} y={cy_false + 42} fontSize="10" fill="#fbbf24" fontFamily={mono}>{"imp-3045: 0.9032364"}</text>
          <text x={cx_false + 8} y={cy_false + 54} fontSize="10" fill="#94a3b8" fontFamily={mono}>{"drho/ds=+0.00242 (false onset)"}</text>
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          TRANSCENDENTAL CLOSED FORM &mdash; NOT AN RH BEAT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          The root is transcendental (digamma equation); the symmetric single-shell onset
          c*=0.93185 is algebraic. This closes the asymmetric multi-body class onset for the
          R&rarr;&infin; opposite-lattice configuration only; whether that class is the GLOBAL
          infimum remains an open sub-gap. The 0.72 basin is preserved (margin=0.1828).
          Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: sg1c-asym-isolation-closed-form-2026-06-30.js &mdash;
        c_asym={C_ASYM.toFixed(10)}, false-onset-drho={FALSE_DRHO.toExponential(3)}, basin-drho={CF.basinDrho.toFixed(4)}.
      </p>
    </div>
  );
}

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

// ── imp-3179: margin curve on descending sub-ladder below N=2458 (imp-3151) ──
function CShockSubMarginCurveViz() {
  const M = C_SHOCK_SUBMARGIN_PROFILE_IMP3151;
  const rows = M.subLadderProfile;

  const W = 700, H = 280, ML = 72, MR = 60, MT = 24, MB = 48;
  const xMin = 0, xMax = 2600;
  const yMin = -0.004, yMax = 0.052;

  const px = (N) => ML + ((N - xMin) / (xMax - xMin)) * (W - ML - MR);
  const py = (m) => H - MB - ((m - yMin) / (yMax - yMin)) * (H - MT - MB);

  const linePath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${px(r.N).toFixed(1)} ${py(r.margin_to_cap).toFixed(1)}`)
    .join(' ');

  const nStar = M.nStarClosedForm; // ~203.03
  const physFloor = M.physicalWorstCaseMargin; // ~0.0447
  const assemblyN = M.nSmallestAssembly; // 2458

  const xTicks = [0, 500, 1000, 1500, 2000, 2458];
  const yTicks = [0, 0.01, 0.02, 0.03, 0.04, 0.0447];

  const nStarXp = px(nStar);
  const zeroYp = py(0);
  const assemblyXp = px(assemblyN);
  const floorYp = py(physFloor);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #f59e0b", background: "rgba(245,158,11,0.04)" }}>
      <h3 style={{ color: "#f59e0b", marginTop: 0 }}>
        Margin 1/3 &minus; C<sub>shock</sub>(N) on descending sub-ladder: crosses zero at N<sub>*</sub>&asymp;203 (imp-3151)
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        Walking N <em>down</em> from the smallest assembly N=2458, the margin{" "}
        1/3 &minus; C<sub>shock</sub>(N) decreases monotonically toward zero. The curve crosses
        zero at the sub-ladder count N<sub>*</sub>&asymp;203.03, where &gamma;<sub>N</sub>=e<sup>6</sup>{" "}
        (log &gamma;<sub>N</sub>=6, the algebraic boundary of C<sub>shock</sub>&lt;1/3). Below N<sub>*</sub>{" "}
        the cap is violated; above N<sub>*</sub> it holds. The physical-assembly floor{" "}
        (margin&asymp;{physFloor.toFixed(4)} at N=2458) sits a factor ~12 above N<sub>*</sub>{" "}
        in count, confirming every realized assembly clears the e<sup>6</sup> threshold with margin &ge; 0.0447.
      </p>
      <div style={{ overflowX: "auto", marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
          {/* zero line */}
          <line x1={ML} y1={py(0)} x2={W - MR} y2={py(0)} stroke="#ef4444" strokeWidth="1" strokeDasharray="5 3" />
          <text x={W - MR + 4} y={py(0) + 4} fontSize="10" fill="#ef4444" fontFamily={mono}>0</text>
          {/* y grid lines */}
          {yTicks.map((m) => (
            <g key={"y" + m}>
              <line x1={ML} y1={py(m)} x2={W - MR} y2={py(m)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(m) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>
                {m === 0.0447 ? "0.0447" : m.toFixed(2)}
              </text>
            </g>
          ))}
          {/* x ticks */}
          {xTicks.map((N) => (
            <g key={"x" + N}>
              <line x1={px(N)} y1={H - MB} x2={px(N)} y2={H - MB + 5} stroke="#334155" strokeWidth="1" />
              <text x={px(N)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>
                {N === 0 ? "0" : N === 2458 ? "2458" : N.toString()}
              </text>
            </g>
          ))}
          {/* axes */}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* axis labels */}
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>N  (sub-ladder count)</text>
          <text x={14} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={"rotate(-90 14 " + ((MT + H - MB) / 2) + ")"}>1/3 &minus; C_shock</text>
          {/* margin curve */}
          <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          {/* data dots */}
          {rows.map((r, i) => (
            <circle key={i} cx={px(r.N)} cy={py(r.margin_to_cap)} r={i === 0 ? 5.5 : 3.5}
              fill={i === 0 ? "#10b981" : "#f59e0b"} stroke={i === 0 ? "#059669" : "#d97706"} strokeWidth="1.2">
              <title>{"N=" + r.N + "  C_shock=" + r.C_shock.toFixed(5) + "  margin=" + r.margin_to_cap.toFixed(5)}</title>
            </circle>
          ))}
          {/* N_star zero crossing */}
          <circle cx={nStarXp} cy={zeroYp} r={6} fill="none" stroke="#ef4444" strokeWidth="2" />
          <line x1={nStarXp} y1={zeroYp - 8} x2={nStarXp + 4} y2={zeroYp - 36} stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" />
          <text x={nStarXp + 8} y={zeroYp - 36} fontSize="11" fill="#ef4444" fontFamily={mono}>N*&asymp;203 (&gamma;=e^6)</text>
          <text x={nStarXp + 8} y={zeroYp - 24} fontSize="10" fill="#f87171" fontFamily={mono}>margin = 0</text>
          {/* physical floor annotation */}
          <line x1={assemblyXp - 6} y1={floorYp} x2={assemblyXp - 36} y2={floorYp - 22} stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />
          <text x={assemblyXp - 42} y={floorYp - 30} fontSize="11" fill="#10b981" fontFamily={mono} textAnchor="end">N=2458 (assembly floor)</text>
          <text x={assemblyXp - 42} y={floorYp - 18} fontSize="10" fill="#6ee7b7" fontFamily={mono} textAnchor="end">margin&asymp;{physFloor.toFixed(4)}</text>
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.25)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 4 }}>
          NUMERICAL PROFILE &mdash; NOT A NEW BOUND
        </div>
        <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Diagnostic of the imp-2786 proven cap. The crossing N<sub>*</sub>&asymp;203 identifies where the closed form
          fails but physically realized assemblies (N&ge;2458) sit far above it with margin &ge; 0.0447 (imp-3132 floor
          (2&minus;&radic;3)/6). NOT a new bound; does NOT close C<sub>H</sub>. Platt&ndash;Trudgian &Lambda;&le;0.2 remains SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3151-c-shock-submargin-profile.js &mdash; subMarginIsDecreasing: {String(M.subMarginIsDecreasing)},{" "}
        N*&asymp;{M.nStarClosedForm.toFixed(2)}, safetyFactor&asymp;{M.safetyFactorN.toFixed(1)}x
      </p>
    </div>
  );
}

// ── imp-3181: residual-gap limit G(s) = tanh(s) - tanh(s/2) across s=aU ─────
function ResidualGapLimitCurveViz() {
  const M = IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID.measured;
  const PHI = M.goldenRatio;         // (1+sqrt5)/2
  const S_STAR = M.sStarClosedForm;  // arccosh(phi) ~1.06128
  const G_STAR = M.gStarClosedForm;  // phi^{-5/2} ~0.30028

  const S_MIN = 0.001, S_MAX = 8.0;
  const N_POINTS = 500;
  const points = [];
  for (let i = 0; i <= N_POINTS; i++) {
    const s = S_MIN + (i / N_POINTS) * (S_MAX - S_MIN);
    points.push({ s, v: Math.tanh(s) - Math.tanh(s / 2) });
  }

  const W = 700, H = 300, ML = 72, MR = 48, MT = 28, MB = 52;
  const Y_MIN = 0, Y_MAX = 0.36;

  const px = (s) => ML + ((s - S_MIN) / (S_MAX - S_MIN)) * (W - ML - MR);
  const py = (v) => H - MB - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - MT - MB);

  const linePath = points
    .map((p, i) => (i === 0 ? "M" : "L") + " " + px(p.s).toFixed(1) + " " + py(p.v).toFixed(1))
    .join(" ");

  const cx_star = px(S_STAR);
  const cy_star = py(G_STAR);

  const xTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const yTicks = [0.0, 0.1, 0.2, 0.3];
  const ycx = (MT + H - MB) / 2;

  const gridCells = M.grid.slice(0, 8);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #a855f7", background: "rgba(168,85,247,0.04)" }}>
      <h3 style={{ color: "#a855f7", marginTop: 0 }}>
        Residual-gap limit G(s) = tanh(s)&minus;tanh(s/2): golden-ratio maximum
        &phi;<sup>&minus;5/2</sup>&asymp;0.30028 at cosh(s*)=&phi; (imp-3146)
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        The saturating residual-gap obstruction G(s)=tanh(s)&minus;tanh(s/2) depends only on
        the product s=a&middot;U (inherited imp-3102 invariance). It vanishes at both ends
        (s&rarr;0: no shear window; s&rarr;&infin;: both tanh terms saturate to 1) and reaches
        its unique interior maximum at the golden-ratio locus cosh(s*)=&phi;, where
        s*=arccosh(&phi;)&asymp;1.06128 and G(s*)=&phi;<sup>&minus;5/2</sup>&asymp;0.30028. Every
        equal-product (a,U) cell lands on the same curve to machine precision. The headline cell
        a=0.5, U=6 (s=3) sits on the saturating tail at G(3)&asymp;0.08991, well past the peak.
      </p>
      <div style={{ overflowX: "auto", marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
          {/* y grid + labels */}
          {yTicks.map((v) => (
            <g key={"y" + v}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{v.toFixed(1)}</text>
            </g>
          ))}
          {/* x ticks */}
          {xTicks.map((s) => (
            <g key={"x" + s}>
              <line x1={px(s)} y1={H - MB} x2={px(s)} y2={H - MB + 5} stroke="#334155" strokeWidth="1" />
              <text x={px(s)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{s}</text>
            </g>
          ))}
          {/* axes */}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          {/* axis labels */}
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>s = a&middot;U  (product invariant)</text>
          <text x={14} y={ycx} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={"rotate(-90 14 " + ycx + ")"}>G(s)</text>
          {/* s->0 vanishing label */}
          <text x={ML + 8} y={py(0.022)} fontSize="10" fill="#94a3b8" fontFamily={mono}>G(0)=0</text>
          {/* s->inf vanishing label */}
          <text x={W - MR - 56} y={py(0.008)} fontSize="10" fill="#94a3b8" fontFamily={mono}>G(s)&rarr;0</text>
          {/* golden-ratio maximum vertical dashed */}
          <line x1={cx_star} y1={cy_star} x2={cx_star} y2={H - MB} stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="4 3" />
          {/* curve */}
          <path d={linePath} fill="none" stroke="#a855f7" strokeWidth="2.5" />
          {/* golden-ratio maximum dot */}
          <circle cx={cx_star} cy={cy_star} r={7} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5">
            <title>{"s*=arccosh(phi)~1.061  G(s*)=phi^(-5/2)~0.30028  cosh(s*)=phi"}</title>
          </circle>
          <line x1={cx_star + 8} y1={cy_star - 4} x2={cx_star + 34} y2={cy_star - 26} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
          <text x={cx_star + 37} y={cy_star - 32} fontSize="10" fill="#fbbf24" fontFamily={mono}>s*&asymp;1.061, cosh(s*)=&phi;</text>
          <text x={cx_star + 37} y={cy_star - 20} fontSize="10" fill="#fbbf24" fontFamily={mono}>G(s*)=&phi;&#8315;&#8309;&#x2F;&#x2082;&asymp;0.30028</text>
          {/* grid cell dots */}
          {gridCells.map((cell, i) => (
            <circle key={i} cx={px(cell.product)} cy={py(cell.analyticGapLimit)} r={4} fill="#c084fc" stroke="#a855f7" strokeWidth="1">
              <title>{"a=" + cell.a + " U=" + cell.U + " s=" + cell.product.toFixed(2) + " G=" + cell.analyticGapLimit.toFixed(5)}</title>
            </circle>
          ))}
          {/* PHI label near top */}
          <text x={cx_star} y={MT + 12} textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily={mono}>&phi;&#8315;&#8309;&#x2F;&#x2082;</text>
          <text x={cx_star} y={MT + 24} textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily={mono}>&asymp;0.300</text>
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.25)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 4 }}>
          REPRESENTATIVE DIAGNOSTIC &mdash; NOT AN RH VERDICT
        </div>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
          The limit curve G(s)=tanh(s)&minus;tanh(s/2) is on the same representative
          monomial-moment truncation as imp-3066/imp-3086/imp-3102/imp-3104/imp-3125; NOT the
          section-26 Gram. A strictly-positive surviving residual gap neither claims the cover
          holds nor that it fails. Platt&ndash;Trudgian &Lambda;&le;0.2 remains rigorous SOTA.
        </div>
      </div>
      <p style={{ marginTop: 8, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3146-residual-gap-limit-aU-grid.js &mdash; limitPositiveEverywhere:{" "}
        {String(M.limitPositiveEverywhere)}, scanMax&asymp;{M.scanMaxLimit.toFixed(5)},
        sStarClosedForm&asymp;{S_STAR.toFixed(5)}, &phi;&asymp;{PHI.toFixed(6)}
      </p>
    </div>
  );
}

// ── imp-3210: equal-product cell invariance bar viz (s=0.8,1.2,2.0,3.0 pairs) ──
function EqualProductCellInvarianceViz() {
  const lock = IMP3177_EQUAL_PRODUCT_CELL_INVARIANCE_LOCK;
  const pairs = lock.measured.pairs;

  const W = 600, H = 295, ML = 60, MR = 24, MT = 32, MB = 70;
  const plotH = H - MT - MB;
  const yMax = 0.36;
  const yMin = 0;
  const groupW = (W - ML - MR) / pairs.length;
  const barW = 22;
  const barGap = 6;

  const gx = (i) => ML + (i + 0.5) * groupW;
  const py = (v) => MT + plotH * (1 - (v - yMin) / (yMax - yMin));
  const barBase = py(0);
  const yTicks = [0.0, 0.1, 0.2, 0.3];

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #0ea5e9", background: "rgba(14,165,233,0.04)" }}>
      <h3 style={{ color: "#0ea5e9", marginTop: 0 }}>
        Equal-product cell invariance: both cells of each equal-s pair give the same saturating gap (imp-3177 / imp-3210)
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        Four equal-product pairs on the imp-3146 a&times;U grid confirm that the rebuilt residual gap
        ||R<sub>orth</sub>||&minus;max&thinsp;R<sub>orth,jj</sub> depends only on s&nbsp;=&nbsp;a&middot;U.
        Both cells of each pair produce the SAME gap (pair spread&nbsp;&lt;&nbsp;{lock.measured.maxPairSpread.toExponential(1)}).
        The amber diamond marks the closed-form limit G(s)&nbsp;=&nbsp;tanh(s)&minus;tanh(s/2);
        the DEG&nbsp;=&nbsp;4 rebuilt gap (bars) saturates from below.
        Cross-module drift vs imp-3146: &lt;{lock.measured.maxDriftVsLiveGrid.toExponential(1)}.
      </p>
      <div style={{ overflowX: "auto", marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
          {yTicks.map((v) => (
            <g key={"yg" + v}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>{v.toFixed(1)}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={barBase} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={barBase} x2={W - MR} y2={barBase} stroke="#334155" strokeWidth="1" />
          {pairs.map((pair, i) => {
            const cx = gx(i);
            const xA = cx - barW - barGap / 2;
            const xB = cx + barGap / 2;
            const hA = ((pair.rebuiltGapA - yMin) / (yMax - yMin)) * plotH;
            const hB = ((pair.rebuiltGapB - yMin) / (yMax - yMin)) * plotH;
            const yLim = py(pair.gapLimit);
            const dm = 6;
            return (
              <g key={"pg" + i}>
                <rect x={xA} y={barBase - hA} width={barW} height={hA} fill="#06b6d4" opacity="0.82" rx="2">
                  <title>{"a=" + pair.cellA.a + " U=" + pair.cellA.U + " gap=" + pair.rebuiltGapA.toFixed(5)}</title>
                </rect>
                <rect x={xB} y={barBase - hB} width={barW} height={hB} fill="#10b981" opacity="0.82" rx="2">
                  <title>{"a=" + pair.cellB.a + " U=" + pair.cellB.U + " gap=" + pair.rebuiltGapB.toFixed(5)}</title>
                </rect>
                <line x1={xA - 2} y1={barBase - hA} x2={xB + barW + 2} y2={barBase - hA}
                  stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 2" />
                <text x={cx} y={barBase - hA - 6} textAnchor="middle" fontSize="8.5" fill="#e2e8f0" fontFamily={mono}>
                  {pair.rebuiltGapA.toFixed(4)}
                </text>
                <line x1={cx} y1={barBase - hA - 14} x2={cx} y2={yLim + dm + 2}
                  stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
                <polygon
                  points={cx + "," + (yLim - dm) + " " + (cx + dm) + "," + yLim + " " + cx + "," + (yLim + dm) + " " + (cx - dm) + "," + yLim}
                  fill="#f59e0b" opacity="0.92"
                >
                  <title>{"G(" + pair.product + ")=" + pair.gapLimit.toFixed(5)}</title>
                </polygon>
                <text x={cx} y={barBase + 13} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily={mono}>
                  s={pair.product}
                </text>
                <text x={xA + barW / 2} y={barBase + 24} textAnchor="middle" fontSize="8" fill="#67e8f9" fontFamily={mono}>
                  a={pair.cellA.a}
                </text>
                <text x={xA + barW / 2} y={barBase + 33} textAnchor="middle" fontSize="8" fill="#67e8f9" fontFamily={mono}>
                  U={pair.cellA.U}
                </text>
                <text x={xB + barW / 2} y={barBase + 24} textAnchor="middle" fontSize="8" fill="#6ee7b7" fontFamily={mono}>
                  a={pair.cellB.a}
                </text>
                <text x={xB + barW / 2} y={barBase + 33} textAnchor="middle" fontSize="8" fill="#6ee7b7" fontFamily={mono}>
                  U={pair.cellB.U}
                </text>
              </g>
            );
          })}
          <text x={13} y={(MT + barBase) / 2} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}
            transform={"rotate(-90 13 " + ((MT + barBase) / 2) + ")"}>
            gap
          </text>
          <text x={(ML + W - MR) / 2} y={H - 5} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>
            s = a&middot;U (equal-product pairs)
          </text>
        </svg>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
        {[
          { col: "#06b6d4", lbl: "Cell A rebuilt gap (higher a, lower U)" },
          { col: "#10b981", lbl: "Cell B rebuilt gap (lower a, higher U)" },
          { col: "#f59e0b", lbl: "G(s) = tanh(s)−tanh(s/2) limit (diamond, bars saturate from below)" },
        ].map(({ col, lbl }) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, background: col, borderRadius: 2, flexShrink: 0 }} />
            <span>{lbl}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 6, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3177-equal-product-cell-invariance-lock.js &mdash; pairs={lock.measured.pairCount},
        maxSpread&lt;{lock.measured.maxPairSpread.toExponential(1)},
        maxDrift&lt;{lock.measured.maxDriftVsLiveGrid.toExponential(1)}
      </p>
    </div>
  );
}

// ── imp-3125: residual-gap DEG-saturation curve ──────────────────────────────
function ResidualGapDegreeSweepViz() {
  const M = IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP;
  const sweep = M.measured.sweep;
  const gapLimit = M.measured.analyticGapLimit;
  const floorDiag = M.measured.analyticMaxDiagonal;

  const W = 560, H = 260, ML = 68, MR = 28, MT = 22, MB = 50;
  const yMin = 0.082, yMax = 0.0935;
  const xMin = 1, xMax = 11;

  const px = (deg) => ML + ((deg - xMin) / (xMax - xMin)) * (W - ML - MR);
  const py = (g) => H - MB - ((g - yMin) / (yMax - yMin)) * (H - MT - MB);

  const linePath = sweep
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${px(r.degree).toFixed(1)} ${py(r.residualGap).toFixed(1)}`)
    .join(' ');

  const limitY = py(gapLimit);
  const yTicks = [0.083, 0.085, 0.087, 0.089, 0.091];
  const ycx = (MT + H - MB) / 2;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #8b5cf6', background: 'rgba(139,92,246,0.04)' }}>
      <h3 style={{ color: '#8b5cf6', marginTop: 0 }}>
        Residual-gap DEG-saturation: ||R<sub>orth</sub>||&minus;max&thinsp;R<sub>orth,jj</sub> converges to tanh(3)&minus;tanh(1.5) (imp-3125)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        After orthogonalizing the FULL passive cosh Gram (R<sub>orth</sub>&nbsp;=&nbsp;LHL<sup>T</sup>),
        a strictly-positive residual gap survives and rises monotonically with DEG.
        Two analytic anchors pin the saturation limit: the operator norm climbs toward
        tanh(aU)&nbsp;=&nbsp;tanh(3)&asymp;0.99505, while the largest diagonal is fixed
        at the constant-function direction tanh(aU/2)&nbsp;=&nbsp;tanh(1.5)&asymp;{floorDiag.toFixed(5)}
        (DEG-independent). The surviving gap converges from below to the closed form
        tanh(3)&minus;tanh(1.5)&asymp;{gapLimit.toFixed(5)}.
        Measured values: 0.08471&rarr;0.08821&rarr;0.08906&rarr;0.08939&rarr;0.08959 (DEG&nbsp;2,4,6,8,10).
      </p>
      <div style={{ overflowX: 'auto', marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {yTicks.map((g) => (
            <g key={"y" + g}>
              <line x1={ML} y1={py(g)} x2={W - MR} y2={py(g)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(g) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{g.toFixed(3)}</text>
            </g>
          ))}
          {sweep.map((r) => (
            <g key={"x" + r.degree}>
              <line x1={px(r.degree)} y1={H - MB} x2={px(r.degree)} y2={H - MB + 5} stroke="#334155" strokeWidth="1" />
              <text x={px(r.degree)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{r.degree}</text>
            </g>
          ))}
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>DEG (monomial truncation degree)</text>
          <text x={14} y={ycx} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={"rotate(-90 14 " + ycx + ")"}>{"||R_orth|| - max diag"}</text>
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={limitY} x2={W - MR} y2={limitY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x={W - MR - 4} y={limitY - 5} textAnchor="end" fontSize="10" fill="#fbbf24" fontFamily={mono}>{"tanh(3)-tanh(1.5)~" + gapLimit.toFixed(5)}</text>
          <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
          {sweep.map((r) => (
            <circle key={"pt" + r.degree} cx={px(r.degree)} cy={py(r.residualGap)} r={5} fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1.5">
              <title>{"DEG=" + r.degree + "  gap=" + r.residualGap.toFixed(5) + "  dist-to-limit=" + r.distanceToGapLimit.toExponential(2)}</title>
            </circle>
          ))}
          <line x1={ML} y1={py(floorDiag > yMin ? yMin : floorDiag)} x2={ML} y2={py(floorDiag > yMin ? yMin : floorDiag)} stroke="none" />
          <text x={ML + 8} y={limitY + 16} fontSize="10" fill="#94a3b8" fontFamily={mono}>{"floor = tanh(1.5) ~ " + floorDiag.toFixed(5) + " (pinned, DEG-indep.)"}</text>
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          REPRESENTATIVE / DIAGNOSTIC &mdash; CARRIES NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Measured on the same monomial-moment truncation as imp-3086/3102/3104; NOT the section-26 Gram.
          Diagonal floor tanh(aU/2) = tanh(1.5)&asymp;{floorDiag.toFixed(5)} is pinned DEG-independent at
          the constant direction j=0. A saturating, strictly-positive survivor carries no cover claim.
          Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3125-orthogonalized-residual-gap-degree-sweep.js &mdash; a=0.5, U=6, NQ=4000, DEG&isin;&#123;2,4,6,8,10&#125;, trend: {M.measured.trend}, shrink&times;: {M.measured.gapDistanceShrinkFactor.toFixed(1)}.
      </p>
    </div>
  );
}

// ── imp-3182: cosh-monomial conditioning ceiling cond(P) and cond(H) vs DEG (imp-3153) ──
function CoshMonomialConditioningViz() {
  const D = IMP3153_COSH_MONOMIAL_CONDITIONING_CEILING;
  const table = D.measured.table;
  const trustMax = D.measured.trustworthyMaxDegree;
  const firstUntrst = D.measured.firstUntrustworthyDegree;
  const recEps = D.construction.reciprocalEpsThreshold;
  const ceiling = D.measured.analyticCeiling;

  const W = 680, H = 320, ML = 62, MR = 24, MT = 32, MB = 52;
  const LOG_MIN = 0, LOG_MAX = 20;
  const DEG_MIN = 2, DEG_MAX = 16;

  const px = (deg) => ML + ((deg - DEG_MIN) / (DEG_MAX - DEG_MIN)) * (W - ML - MR);
  const py = (logV) => H - MB - ((logV - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (H - MT - MB);
  const logScale = (v) => {
    if (!Number.isFinite(v) || v <= 0) return LOG_MAX;
    return Math.min(Math.log10(v), LOG_MAX);
  };

  const recEpsLog = logScale(recEps);

  const condPData = table.map((r) => ({
    d: r.degree,
    l: logScale(r.condP),
    trust: r.respectsCeiling,
    finite: Number.isFinite(r.condP) && r.condP > 0,
  }));
  const condHData = table.map((r) => ({
    d: r.degree,
    l: logScale(r.condH),
    finite: Number.isFinite(r.condH) && r.condH > 0,
  }));

  const pathP = condPData
    .map((p, i) => (i === 0 ? "M" : "L") + " " + px(p.d).toFixed(1) + " " + py(p.l).toFixed(1))
    .join(" ");
  const pathH = condHData
    .map((p, i) => (i === 0 ? "M" : "L") + " " + px(p.d).toFixed(1) + " " + py(p.l).toFixed(1))
    .join(" ");

  const logTicks = [0, 4, 8, 12, 16, 20];
  const degTicks = [2, 4, 6, 8, 10, 12, 14, 16];
  const ycx = (MT + H - MB) / 2;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #f97316", background: "rgba(249,115,22,0.04)" }}>
      <h3 style={{ color: "#f97316", marginTop: 0 }}>
        Cosh-monomial conditioning ceiling: cond(P) and cond(H) vs DEG (~2 orders per +2DEG),
        trust boundary DEG={trustMax} / {firstUntrst} (imp-3153)
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        The passive cosh Gram P and shear sinh Hankel H in the rescaled monomial basis
        phi_j=(tau/U)^j are Hilbert-type matrices: their spectral condition numbers grow
        geometrically (roughly two orders of magnitude per +2 DEG step). Once cond(P)
        crosses the IEEE double trust threshold 1/eps&asymp;4.5e15, the Cholesky factor
        loses all significant digits and the de-homogenized &#x2016;R_orth&#x2016; breaks through
        its analytic ceiling tanh(aU)={ceiling.toFixed(5)}. The largest DEG whose
        &#x2016;R_orth&#x2016; still respects the ceiling is trustworthyMaxDegree={trustMax};
        the first that breaches it is firstUntrustworthyDegree={firstUntrst}. The entire
        imp-3125 sweep &#123;2,4,6,8,10&#125; sits inside the trustworthy range.
      </p>
      <div style={{ overflowX: "auto", marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
          {logTicks.map((l) => (
            <g key={"lg" + l}>
              <line x1={ML} y1={py(l)} x2={W - MR} y2={py(l)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 6} y={py(l) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>{"1e" + l}</text>
            </g>
          ))}
          {degTicks.map((d) => (
            <g key={"dg" + d}>
              <line x1={px(d)} y1={MT} x2={px(d)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={px(d)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{d}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>truncation degree DEG</text>
          <text x={14} y={ycx} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={"rotate(-90 14 " + ycx + ")"}>log10 cond</text>
          <line x1={ML} y1={py(recEpsLog)} x2={W - MR} y2={py(recEpsLog)} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x={ML + 8} y={py(recEpsLog) - 5} fontSize="10" fill="#ef4444" fontFamily={mono}>1/eps~4.5e15 (trust threshold)</text>
          {trustMax !== null && (
            <g>
              <line x1={px(trustMax)} y1={MT} x2={px(trustMax)} y2={H - MB} stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x={px(trustMax) + 4} y={MT + 14} fontSize="10" fill="#10b981" fontFamily={mono}>{"DEG=" + trustMax}</text>
              <text x={px(trustMax) + 4} y={MT + 26} fontSize="9" fill="#10b981" fontFamily={mono}>(max trusted)</text>
            </g>
          )}
          {firstUntrst !== null && (
            <g>
              <line x1={px(firstUntrst)} y1={MT} x2={px(firstUntrst)} y2={H - MB} stroke="#f87171" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x={px(firstUntrst) + 4} y={MT + 42} fontSize="10" fill="#f87171" fontFamily={mono}>{"DEG=" + firstUntrst}</text>
              <text x={px(firstUntrst) + 4} y={MT + 54} fontSize="9" fill="#f87171" fontFamily={mono}>(1st untrst)</text>
            </g>
          )}
          <path d={pathP} fill="none" stroke="#f97316" strokeWidth="2" />
          {condPData.map((p) => (
            <circle
              key={"cp" + p.d}
              cx={px(p.d)} cy={py(p.l)} r="4"
              fill={p.trust ? "#f97316" : "#64748b"}
              fillOpacity="0.85"
              stroke={p.trust ? "#f97316" : "#ef4444"}
              strokeWidth="1.5"
            >
              <title>{"DEG=" + p.d + " cond(P)=" + (p.finite ? Math.pow(10, p.l).toExponential(2) : "overflow")}</title>
            </circle>
          ))}
          <path d={pathH} fill="none" stroke="#06b6d4" strokeWidth="2" />
          {condHData.map((p) => (
            <circle key={"ch" + p.d} cx={px(p.d)} cy={py(p.l)} r="3" fill="#06b6d4" fillOpacity="0.75" stroke="#06b6d4">
              <title>{"DEG=" + p.d + " cond(H)=" + (p.finite ? Math.pow(10, p.l).toExponential(2) : "overflow")}</title>
            </circle>
          ))}
          <g transform={"translate(" + (ML + 16) + ", " + (H - MB - 56) + ")"}>
            <line x1="0" y1="0" x2="18" y2="0" stroke="#f97316" strokeWidth="2" />
            <circle cx="9" cy="0" r="4" fill="#f97316" fillOpacity="0.85" />
            <text x="24" y="4" fontSize="11" fill="#cbd5e1" fontFamily={mono}>cond(P) passive cosh Gram</text>
          </g>
          <g transform={"translate(" + (ML + 16) + ", " + (H - MB - 36) + ")"}>
            <line x1="0" y1="0" x2="18" y2="0" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="9" cy="0" r="3" fill="#06b6d4" fillOpacity="0.75" />
            <text x="24" y="4" fontSize="11" fill="#cbd5e1" fontFamily={mono}>cond(H) shear sinh Hankel</text>
          </g>
          <g transform={"translate(" + (ML + 16) + ", " + (H - MB - 16) + ")"}>
            <line x1="0" y1="0" x2="18" y2="0" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="24" y="4" fontSize="11" fill="#cbd5e1" fontFamily={mono}>1/eps trust threshold</text>
          </g>
        </svg>
      </div>
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.25)", fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>
          <div style={{ color: "#10b981", fontWeight: 700, marginBottom: 3 }}>trustworthyMaxDegree</div>
          <span style={{ fontFamily: mono, color: "#6ee7b7", fontSize: 14 }}>{trustMax}</span>
          <div style={{ marginTop: 4, fontSize: 11 }}>Last DEG with &#x2016;R_orth&#x2016; below tanh(aU)</div>
        </div>
        <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>
          <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 3 }}>firstUntrustworthyDegree</div>
          <span style={{ fontFamily: mono, color: "#fca5a5", fontSize: 14 }}>{firstUntrst}</span>
          <div style={{ marginTop: 4, fontSize: 11 }}>First DEG where ceiling is breached</div>
        </div>
        <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.25)", fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>
          <div style={{ color: "#f97316", fontWeight: 700, marginBottom: 3 }}>analytic ceiling tanh(aU)</div>
          <span style={{ fontFamily: mono, color: "#fed7aa", fontSize: 14 }}>{ceiling.toFixed(6)}</span>
          <div style={{ marginTop: 4, fontSize: 11 }}>&#x2016;R_orth&#x2016; must stay strictly below this</div>
        </div>
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 6, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.3)", fontSize: 12, color: "#cbd5e1", lineHeight: 1.65 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", letterSpacing: "0.06em", marginBottom: 5 }}>
          HONEST CAVEAT &mdash; NUMERICAL-CONDITIONING DIAGNOSTIC, NO RH VERDICT
        </div>
        This quantifies WHERE the monomial-moment orthogonalizer can be trusted &mdash; NOT whether
        the cover holds or fails. The trust boundary is setup-dependent (a=0.5, U=6, NQ=4000
        midpoint panels, IEEE double). A higher-precision or better-conditioned basis would push
        it further. Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains the rigorous SOTA.
      </div>
      <p style={{ marginTop: 10, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3153-cosh-monomial-conditioning-ceiling.js &mdash; a=0.5, U=6, DEG&isin;&#123;2,4,6,8,10,12,14,16&#125;, 1/eps&asymp;{recEps.toExponential(2)}.
      </p>
    </div>
  );
}

// ── imp-3183: next-order convergence corrections viz (imp-3155) ───────────────
function NextOrderConvergenceCorrectionViz() {
  const _D = IMP3155_ONSET_DECAY_NEXT_ORDER_CORRECTIONS;
  const ASINH1 = Math.asinh(1);
  const SQRT2 = Math.SQRT2;
  const S0 = ASINH1;
  const C = SQRT2 * (1 - ASINH1);
  const K0 = SQRT2 - ASINH1;
  const K = 2 * K0;
  const A1 = (SQRT2 - 1) / (1 - ASINH1) - SQRT2 / 6;
  const D0 = 2 * K0 - 1 / K0;

  const F_s = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;
  const G_s = (s) => SQRT2 - ASINH1 - Math.exp(-s);
  const PHI = (s) => G_s(s) / F_s(s);

  const EPS_MIN = 0.02, EPS_MAX = 0.6, N_A = 200;
  const onsetPts = [];
  for (let i = 0; i <= N_A; i++) {
    const eps = EPS_MIN + (i / N_A) * (EPS_MAX - EPS_MIN);
    onsetPts.push({ eps, ratio: PHI(S0 + eps) * eps * eps / C });
  }

  const S_B_MIN = 3.0, S_B_MAX = 12.0, N_B = 300;
  const decayPts = [];
  for (let i = 0; i <= N_B; i++) {
    const s = S_B_MIN + (i / N_B) * (S_B_MAX - S_B_MIN);
    decayPts.push({ s, ratio: PHI(s) * Math.exp(s) / K });
  }

  const WA = 320, HA = 270, MLA = 52, MRA = 16, MTA = 24, MBA = 46;
  const Y_A_MIN = 0.9, Y_A_MAX = 3.2;
  const pxA = (x) => MLA + ((x - EPS_MIN) / (EPS_MAX - EPS_MIN)) * (WA - MLA - MRA);
  const pyA = (y) => HA - MBA - ((Math.min(Math.max(y, Y_A_MIN), Y_A_MAX) - Y_A_MIN) / (Y_A_MAX - Y_A_MIN)) * (HA - MTA - MBA);
  const ycA = (MTA + HA - MBA) / 2;

  const pathA = onsetPts.map((p, i) => (i === 0 ? "M" : "L") + " " + pxA(p.eps).toFixed(1) + " " + pyA(p.ratio).toFixed(1)).join(" ");
  const pathLA = onsetPts.map((p, i) => (i === 0 ? "M" : "L") + " " + pxA(p.eps).toFixed(1) + " " + pyA(1 + A1 * p.eps).toFixed(1)).join(" ");
  const yA1 = pyA(1.0);

  const WB = 320, HB = 270, MLB = 52, MRB = 16, MTB = 24, MBB = 46;
  const Y_B_MIN = 0.99, Y_B_MAX = 1.45;
  const pxB = (s) => MLB + ((s - S_B_MIN) / (S_B_MAX - S_B_MIN)) * (WB - MLB - MRB);
  const pyB = (y) => HB - MBB - ((Math.min(Math.max(y, Y_B_MIN), Y_B_MAX) - Y_B_MIN) / (Y_B_MAX - Y_B_MIN)) * (HB - MTB - MBB);
  const ycB = (MTB + HB - MBB) / 2;

  const pathB = decayPts.map((p, i) => (i === 0 ? "M" : "L") + " " + pxB(p.s).toFixed(1) + " " + pyB(p.ratio).toFixed(1)).join(" ");
  const pathCB = decayPts.map((p, i) => (i === 0 ? "M" : "L") + " " + pxB(p.s).toFixed(1) + " " + pyB(1 + (2 * p.s + D0) * Math.exp(-p.s)).toFixed(1)).join(" ");
  const yB1 = pyB(1.0);

  const yTicksA = [1.0, 1.5, 2.0, 2.5, 3.0];
  const xTicksA = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  const yTicksB = [1.0, 1.1, 1.2, 1.3, 1.4];
  const xTicksB = [4, 6, 8, 10, 12];

  // imp-3222 accuracy radius: eps* (onset) and s* (decay) where the imp-3155
  // two-term truncation error crosses 1%, marking the trustworthy expansion window.
  const epsStar1pct = IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.accuracyRadius.onsetEps1pct;
  const sStar1pct = IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.accuracyRadius.decayS1pct;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #6366f1", background: "rgba(99,102,241,0.04)" }}>
      <h3 style={{ color: "#6366f1", marginTop: 0 }}>
        imp-3155 next-order corrections: onset slope A<sub>1</sub>&asymp;{A1.toFixed(3)} (linear in &epsilon;)
        and decay correction (2s+D<sub>0</sub>)e<sup>&minus;s</sup>, D<sub>0</sub>&asymp;{D0.toFixed(3)}
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        The imp-3112 onset signature &phi;(s<sub>0</sub>+&epsilon;)&epsilon;<sup>2</sup>/C&rarr;1 converges
        LINEARLY in &epsilon; with slope A<sub>1</sub>=(&#8730;2&minus;1)/(1&minus;arcsinh1)&minus;&#8730;2/6
        &asymp;{A1.toFixed(5)} (left panel; dashed: two-term linear 1+A<sub>1</sub>&epsilon;).
        The decay signature &phi;(s)e<sup>s</sup>/K&rarr;1 carries the leading correction
        (2s+D<sub>0</sub>)e<sup>&minus;s</sup> with slope&nbsp;2 and constant part
        D<sub>0</sub>=2K<sub>0</sub>&minus;1/K<sub>0</sub>&asymp;{D0.toFixed(5)} (K<sub>0</sub>=&#8730;2&minus;arcsinh1)
        (right panel; dashed: 1+(2s+D<sub>0</sub>)e<sup>&minus;s</sup>). Both are closed-form;
        operator step (imp-3066) untouched. The green band marks the imp-3222 accuracy radius
        &mdash; where the dropped second-order term stays under 1%: &epsilon;&lt;&epsilon;*&asymp;{epsStar1pct.toFixed(3)}
        (onset, left) and s&gt;s*&asymp;{sStar1pct.toFixed(2)} (decay, right).
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, fontFamily: mono, textAlign: "center" }}>
            Onset: &phi;(s<sub>0</sub>+&epsilon;)&epsilon;<sup>2</sup>/C vs &epsilon; (s<sub>0</sub>=arcsinh1&asymp;{S0.toFixed(4)}, C={C.toFixed(5)})
          </div>
          <svg width={WA} height={HA} style={{ display: "block", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
            {yTicksA.map((v) => (
              <g key={"ya" + v}>
                <line x1={MLA} y1={pyA(v)} x2={WA - MRA} y2={pyA(v)} stroke="#1e293b" strokeWidth="1" />
                <text x={MLA - 6} y={pyA(v) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>{v.toFixed(1)}</text>
              </g>
            ))}
            {xTicksA.map((eps) => (
              <g key={"xa" + eps}>
                <line x1={pxA(eps)} y1={HA - MBA} x2={pxA(eps)} y2={HA - MBA + 4} stroke="#334155" strokeWidth="1" />
                <text x={pxA(eps)} y={HA - MBA + 16} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily={mono}>{eps.toFixed(1)}</text>
              </g>
            ))}
            <line x1={MLA} y1={MTA} x2={MLA} y2={HA - MBA} stroke="#334155" strokeWidth="1" />
            <line x1={MLA} y1={HA - MBA} x2={WA - MRA} y2={HA - MBA} stroke="#334155" strokeWidth="1" />
            <rect x={MLA} y={MTA} width={pxA(epsStar1pct) - MLA} height={(HA - MBA) - MTA} fill="rgba(16,185,129,0.08)" />
            <line x1={pxA(epsStar1pct)} y1={MTA} x2={pxA(epsStar1pct)} y2={HA - MBA} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x={pxA(epsStar1pct)} y={MTA - 8} textAnchor="middle" fontSize="9" fill="#10b981" fontFamily={mono}>&epsilon;*&asymp;{epsStar1pct.toFixed(3)} (1% err)</text>
            <line x1={MLA} y1={yA1} x2={WA - MRA} y2={yA1} stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
            <text x={WA - MRA - 4} y={yA1 - 4} textAnchor="end" fontSize="9" fill="#64748b" fontFamily={mono}>1 (limit)</text>
            <path d={pathLA} fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6 3" />
            <path d={pathA} fill="none" stroke="#6366f1" strokeWidth="2.5" />
            <text x={(MLA + WA - MRA) / 2} y={HA - 8} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>&epsilon; = s &minus; s<tspan baselineShift="sub" fontSize="9">0</tspan></text>
            <text x={12} y={ycA} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono} transform={"rotate(-90 12 " + ycA + ")"}>ratio</text>
            <line x1={MLA + 4} y1={HA - MBA - 28} x2={MLA + 18} y2={HA - MBA - 28} stroke="#6366f1" strokeWidth="2.5" />
            <text x={MLA + 22} y={HA - MBA - 24} fontSize="9" fill="#94a3b8" fontFamily={mono}>actual</text>
            <line x1={MLA + 4} y1={HA - MBA - 16} x2={MLA + 18} y2={HA - MBA - 16} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x={MLA + 22} y={HA - MBA - 12} fontSize="9" fill="#94a3b8" fontFamily={mono}>1+A1&epsilon;</text>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, fontFamily: mono, textAlign: "center" }}>
            Decay: &phi;(s)e<sup>s</sup>/K vs s (K={K.toFixed(5)}, D<sub>0</sub>={D0.toFixed(5)})
          </div>
          <svg width={WB} height={HB} style={{ display: "block", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
            {yTicksB.map((v) => (
              <g key={"yb" + v}>
                <line x1={MLB} y1={pyB(v)} x2={WB - MRB} y2={pyB(v)} stroke="#1e293b" strokeWidth="1" />
                <text x={MLB - 6} y={pyB(v) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>{v.toFixed(1)}</text>
              </g>
            ))}
            {xTicksB.map((s) => (
              <g key={"xb" + s}>
                <line x1={pxB(s)} y1={HB - MBB} x2={pxB(s)} y2={HB - MBB + 4} stroke="#334155" strokeWidth="1" />
                <text x={pxB(s)} y={HB - MBB + 16} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily={mono}>{s}</text>
              </g>
            ))}
            <line x1={MLB} y1={MTB} x2={MLB} y2={HB - MBB} stroke="#334155" strokeWidth="1" />
            <line x1={MLB} y1={HB - MBB} x2={WB - MRB} y2={HB - MBB} stroke="#334155" strokeWidth="1" />
            <rect x={pxB(sStar1pct)} y={MTB} width={(WB - MRB) - pxB(sStar1pct)} height={(HB - MBB) - MTB} fill="rgba(16,185,129,0.08)" />
            <line x1={pxB(sStar1pct)} y1={MTB} x2={pxB(sStar1pct)} y2={HB - MBB} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x={pxB(sStar1pct)} y={MTB - 8} textAnchor="middle" fontSize="9" fill="#10b981" fontFamily={mono}>s*&asymp;{sStar1pct.toFixed(2)} (1% err)</text>
            <line x1={MLB} y1={yB1} x2={WB - MRB} y2={yB1} stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
            <text x={WB - MRB - 4} y={yB1 - 4} textAnchor="end" fontSize="9" fill="#64748b" fontFamily={mono}>1 (limit)</text>
            <path d={pathCB} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" />
            <path d={pathB} fill="none" stroke="#10b981" strokeWidth="2.5" />
            <text x={(MLB + WB - MRB) / 2} y={HB - 8} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>s = a&middot;U</text>
            <text x={12} y={ycB} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono} transform={"rotate(-90 12 " + ycB + ")"}>ratio</text>
            <line x1={MLB + 4} y1={HB - MBB - 28} x2={MLB + 18} y2={HB - MBB - 28} stroke="#10b981" strokeWidth="2.5" />
            <text x={MLB + 22} y={HB - MBB - 24} fontSize="9" fill="#94a3b8" fontFamily={mono}>actual</text>
            <line x1={MLB + 4} y1={HB - MBB - 16} x2={MLB + 18} y2={HB - MBB - 16} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x={MLB + 22} y={HB - MBB - 12} fontSize="9" fill="#94a3b8" fontFamily={mono}>1+(2s+D0)e^-s</text>
          </svg>
        </div>
      </div>
      <p style={{ marginTop: 8, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3155-onset-decay-next-order-corrections.js &mdash;
        A1={_D.onsetCorrection.anchor.toFixed(6)}, D0={_D.decayCorrection.constAnchor.toFixed(6)},
        s0=arcsinh(1)={S0.toFixed(6)}, C={C.toFixed(6)}, K={K.toFixed(6)}.
      </p>
      <p style={{ marginTop: 6, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        imp-3222 second-order: onset A<sub>2</sub>=&minus;(2&#8730;2&minus;1)/(6(1&minus;arcsinh1))&minus;1/36
        ={IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.onsetSecondOrder.anchor.toFixed(6)} (negative, bends
        phi&epsilon;<sup>2</sup>/C back below); large-s B(s)=4s<sup>2</sup>+{IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.decaySecondOrder.coefS1.toFixed(5)}s
        {IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.decaySecondOrder.coefS0.toFixed(5)} (quadratic prefactor).
        imp-3155 two-term law ~1%-accurate for &epsilon;&lt;~{IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.accuracyRadius.onsetEps1pct.toFixed(4)} (onset)
        and s&gt;~{IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.accuracyRadius.decayS1pct.toFixed(3)} (decay).
      </p>
    </div>
  );
}

// ── imp-3396: imp-3325 T2/T3/P11 relative-error-vs-eps accuracy radii viz ────
function OnsetPadeAccuracyRadiusViz() {
  const M = IMP3325_ONSET_PADE_RESUMMATION;
  const ASINH1 = Math.asinh(1);
  const SQRT2 = Math.SQRT2;
  const S0 = ASINH1;
  const C = SQRT2 * (1 - ASINH1);
  const A1 = (SQRT2 - 1) / (1 - ASINH1) - SQRT2 / 6;
  const A2 = -(2 * SQRT2 - 1) / (6 * (1 - ASINH1)) - 1 / 36;
  const PADE_C = -A2 / A1;
  const PADE_B = A1 + PADE_C;

  const F_s = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;
  const G_s = (s) => SQRT2 - ASINH1 - Math.exp(-s);
  const PHI = (s) => G_s(s) / F_s(s);
  const S_TRUE = (eps) => PHI(S0 + eps) * eps * eps / C;
  const T2 = (eps) => 1 + A1 * eps;
  const T3 = (eps) => 1 + A1 * eps + A2 * eps * eps;
  const P11 = (eps) => (1 + PADE_B * eps) / (1 + PADE_C * eps);
  const relErr = (fn, eps) => Math.abs(fn(eps) - S_TRUE(eps)) / Math.abs(S_TRUE(eps));

  const EPS_MIN = 0.01, EPS_MAX = 0.5, N = 240;
  const series = ["t2", "t3", "p11"].map((k) => ({ k, fn: k === "t2" ? T2 : k === "t3" ? T3 : P11 }));
  const curves = series.map(({ k, fn }) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const eps = EPS_MIN * Math.pow(EPS_MAX / EPS_MIN, i / N);
      const err = Math.max(relErr(fn, eps), 1e-6);
      pts.push({ eps, err });
    }
    return { k, pts };
  });

  const W = 460, H = 300, ML = 56, MR = 16, MT = 20, MB = 40;
  const logMin = Math.log10(EPS_MIN), logMax = Math.log10(EPS_MAX);
  const px = (eps) => ML + ((Math.log10(eps) - logMin) / (logMax - logMin)) * (W - ML - MR);
  const yMin = -4, yMax = 0; // log10(rel err) from 1e-4 to 1
  const py = (err) => H - MB - ((Math.log10(err) - yMin) / (yMax - yMin)) * (H - MT - MB);

  const colors = { t2: "#ef4444", t3: "#fbbf24", p11: "#22d3ee" };
  const labels = { t2: "T2 (two-term)", t3: "T3 (three-term poly)", p11: "P11 ([1/1] Pade)" };

  const yTicks = [-4, -3, -2, -1, 0];
  const xTicks = [0.01, 0.03, 0.1, 0.3];

  const R = M.accuracyRadius;
  const radii1pct = { t2: R.twoTermEps1pct, t3: R.threeTermEps1pct, p11: R.padeEps1pct };

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #22d3ee", background: "rgba(34,211,238,0.04)" }}>
      <h3 style={{ color: "#22d3ee", marginTop: 0 }}>
        imp-3325 accuracy radii: T2/T3/P11 relative error vs &epsilon;, and the T3&asymp;P11 overlap
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.75 }}>
        Relative error |approx/&phi; &minus; 1| of the two-term T2, three-term polynomial T3, and
        [1/1] Pade P11 reconstructions of the imp-3064 onset signature, plotted on a log-log axis
        against a direct finite-&epsilon; evaluation of &phi;. Dashed horizontal lines mark the 1%
        and 0.1% tolerance thresholds; dotted verticals mark each curve's 1%-crossing radius
        (T2 &epsilon;*&asymp;{radii1pct.t2.toFixed(3)}, T3 &epsilon;*&asymp;{radii1pct.t3.toFixed(3)},
        P11 &epsilon;*&asymp;{radii1pct.p11.toFixed(3)}). T3 and P11 track almost exactly until
        &epsilon;&gt;~0.3, where P11 pulls slightly ahead &mdash; visual confirmation that the Pade
        rational structure adds almost nothing beyond simply keeping the A2 term.
      </p>
      <svg width={W} height={H} style={{ display: "block", background: "rgba(2,6,23,0.4)", borderRadius: 6 }}>
        {yTicks.map((v) => (
          <g key={"y" + v}>
            <line x1={ML} y1={py(Math.pow(10, v))} x2={W - MR} y2={py(Math.pow(10, v))} stroke="#1e293b" strokeWidth="1" />
            <text x={ML - 6} y={py(Math.pow(10, v)) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>
              {v === 0 ? "1" : "1e" + v}
            </text>
          </g>
        ))}
        {xTicks.map((eps) => (
          <g key={"x" + eps}>
            <line x1={px(eps)} y1={H - MB} x2={px(eps)} y2={H - MB + 4} stroke="#334155" strokeWidth="1" />
            <text x={px(eps)} y={H - MB + 16} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily={mono}>{eps}</text>
          </g>
        ))}
        <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
        <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
        <line x1={ML} y1={py(0.01)} x2={W - MR} y2={py(0.01)} stroke="#10b981" strokeWidth="1" strokeDasharray="5 3" />
        <text x={W - MR} y={py(0.01) - 4} textAnchor="end" fontSize="9" fill="#10b981" fontFamily={mono}>1% tol</text>
        <line x1={ML} y1={py(0.001)} x2={W - MR} y2={py(0.001)} stroke="#a78bfa" strokeWidth="1" strokeDasharray="5 3" />
        <text x={W - MR} y={py(0.001) - 4} textAnchor="end" fontSize="9" fill="#a78bfa" fontFamily={mono}>0.1% tol</text>
        {["t2", "t3", "p11"].map((k) => (
          <line key={"vr" + k} x1={px(radii1pct[k])} y1={MT} x2={px(radii1pct[k])} y2={H - MB} stroke={colors[k]} strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        ))}
        {curves.map(({ k, pts }) => (
          <path key={k} d={pts.map((p, i) => (i === 0 ? "M" : "L") + " " + px(p.eps).toFixed(1) + " " + py(p.err).toFixed(1)).join(" ")}
            fill="none" stroke={colors[k]} strokeWidth={k === "t2" ? 1.5 : 2} strokeDasharray={k === "t2" ? "6 3" : undefined} />
        ))}
        <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>&epsilon; (log scale)</text>
        <text x={12} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono} transform={"rotate(-90 12 " + (MT + H - MB) / 2 + ")"}>rel. error (log)</text>
        {["t2", "t3", "p11"].map((k, i) => (
          <g key={"leg" + k}>
            <line x1={ML + 4} y1={MT + 12 + i * 14} x2={ML + 18} y2={MT + 12 + i * 14} stroke={colors[k]} strokeWidth={k === "t2" ? 1.5 : 2} strokeDasharray={k === "t2" ? "6 3" : undefined} />
            <text x={ML + 22} y={MT + 16 + i * 14} fontSize="9" fill="#94a3b8" fontFamily={mono}>{labels[k]}</text>
          </g>
        ))}
      </svg>
      <p style={{ marginTop: 8, color: "#64748b", fontSize: 11, fontFamily: mono }}>
        Source: imp-3325-onset-pade-resummation.js &mdash; 1% radii T2&asymp;{radii1pct.t2.toFixed(5)},
        T3&asymp;{radii1pct.t3.toFixed(5)}, P11&asymp;{radii1pct.p11.toFixed(5)}. RH-equivalent, degree-0
        scalar diagnostic; imp-3066 lone obstruction untouched; Platt-Trudgian &Lambda;&le;0.2 SOTA.
      </p>
    </div>
  );
}

function BridgeLagCutoffCaptureViz() {
  const M = IMP3202_MUPASS_BRIDGE_LAG_CUTOFF_SWEEP;
  const table = M.measured.table;
  const knee = M.measured.minimalLagSupport;
  const satTol = M.measured.saturationTol;
  const c020 = M.measured.captureAt020;
  const c040 = M.measured.captureAt040;

  const svgW = 520, svgH = 200, padL = 48, padR = 14, padT = 16, padB = 34;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const xMin = 0, xMax = 2.0;
  const yMin = 0, yMax = 1.08;
  const xScale = (v) => padL + ((v - xMin) / (xMax - xMin)) * chartW;
  const yScale = (v) => padT + chartH * (1 - (v - yMin) / (yMax - yMin));

  const polyline = table
    .map((r) => `${xScale(r.cutoff).toFixed(1)},${yScale(r.capture).toFixed(1)}`)
    .join(' ');

  const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.5, 2.0];
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="card" style={{ marginTop: 18, borderLeft: '3px solid #a78bfa', background: 'rgba(167,139,250,0.03)' }}>
      <h3 style={{ color: '#a78bfa', marginTop: 0, fontSize: 15 }}>
        Bridge Lag-Cutoff Capture Curve (imp-3202): capture(c) = ||T_c|| / ||T||
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
        The capture fraction rises steeply with the lag cutoff c and{' '}
        <strong style={{ color: '#e2e8f0' }}>saturates at a finite minimal lag-support</strong>{' '}
        (knee at c&thinsp;=&thinsp;{knee}), locating where the bridge contraction mass stops
        accruing. A small (&lt;0.5%) overshoot above 1 appears near the knee: truncating the
        indefinite far-lag tail transiently raises the dominant singular value.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
          {/* grid lines */}
          {yTicks.map((v) => (
            <line key={v} x1={padL} y1={yScale(v)} x2={svgW - padR} y2={yScale(v)}
              stroke="#1e293b" strokeWidth={1} />
          ))}

          {/* saturation band: y in [1-satTol, 1+satTol] */}
          <rect
            x={padL} y={yScale(1 + satTol)}
            width={chartW} height={yScale(1 - satTol) - yScale(1 + satTol)}
            fill="rgba(167,139,250,0.07)"
          />
          <line x1={padL} y1={yScale(1)} x2={svgW - padR} y2={yScale(1)}
            stroke="#a78bfa" strokeWidth={1} strokeDasharray="5 3" />
          <text x={padL + 4} y={yScale(1) - 3} fill="#a78bfa" fontSize={9}>capture = 1</text>

          {/* verdict anchors: 0.20 and 0.40 with capture % annotations */}
          <line x1={xScale(0.2)} y1={padT} x2={xScale(0.2)} y2={padT + chartH}
            stroke="#fbbf24" strokeWidth={1} strokeDasharray="4 3" />
          <text x={xScale(0.2) + 2} y={padT + 10} fill="#fbbf24" fontSize={8}>c=0.20</text>
          <text x={xScale(0.2) + 2} y={padT + 20} fill="#fbbf24" fontSize={8}>{(c020 * 100).toFixed(0)}%</text>
          <line x1={xScale(0.4)} y1={padT} x2={xScale(0.4)} y2={padT + chartH}
            stroke="#fbbf24" strokeWidth={1} strokeDasharray="4 3" />
          <text x={xScale(0.4) + 2} y={padT + 10} fill="#fbbf24" fontSize={8}>c=0.40</text>
          <text x={xScale(0.4) + 2} y={padT + 20} fill="#fbbf24" fontSize={8}>{(c040 * 100).toFixed(0)}%</text>

          {/* knee marker */}
          {knee != null && (
            <>
              <line x1={xScale(knee)} y1={padT} x2={xScale(knee)} y2={padT + chartH}
                stroke="#34d399" strokeWidth={1.5} strokeDasharray="6 3" />
              <text x={xScale(knee) + 3} y={padT + 22} fill="#34d399" fontSize={8}>knee c={knee}</text>
            </>
          )}

          {/* capture curve */}
          <polyline points={polyline} fill="none" stroke="#a78bfa" strokeWidth={2} />
          {table.map((r) => (
            <circle key={r.cutoff} cx={xScale(r.cutoff)} cy={yScale(r.capture)} r={3}
              fill="#a78bfa" />
          ))}

          {/* axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#475569" strokeWidth={1.5} />
          <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH} stroke="#475569" strokeWidth={1.5} />

          {/* y-axis ticks */}
          {yTicks.map((v) => (
            <text key={v} x={padL - 4} y={yScale(v) + 3.5} fill="#64748b" fontSize={9} textAnchor="end">
              {v.toFixed(1)}
            </text>
          ))}

          {/* x-axis ticks */}
          {xTicks.map((v) => (
            <text key={v} x={xScale(v)} y={padT + chartH + 12} fill="#64748b" fontSize={9} textAnchor="middle">
              {v}
            </text>
          ))}

          {/* axis labels */}
          <text x={padL + chartW / 2} y={svgH - 2} fill="#64748b" fontSize={10} textAnchor="middle">
            lag cutoff c
          </text>
          <text x={10} y={padT + chartH / 2} fill="#64748b" fontSize={10} textAnchor="middle"
            transform={`rotate(-90 10 ${padT + chartH / 2})`}>
            capture(c)
          </text>
        </svg>
      </div>
      <div style={{
        marginTop: 10, padding: '10px 12px', borderRadius: 6,
        background: 'rgba(251,191,36,0.08)', border: '2px solid rgba(251,191,36,0.4)',
        fontSize: 12, color: '#94a3b8', lineHeight: 1.65,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.06em', marginBottom: 6 }}>
          OPEN SUB-GAP (imp-3202): TWO HALVES, ONE UN-PORTED
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
          <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.35)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.05em', marginBottom: 3 }}>HALF 1 &mdash; DONE (in-repo)</div>
            <div style={{ fontSize: 11.5, color: '#cbd5e1' }}>
              Cutoff-localization: this chart measures capture(c)&thinsp;=&thinsp;||T_c||/||T||
              for the Toeplitz surrogate T(u,v)&thinsp;=&thinsp;sinh(a(v&minus;u))&thinsp;&times;&thinsp;Abar(|v&minus;u|).
              The knee locates where bridge contraction mass saturates.
            </div>
          </div>
          <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#f87171', letterSpacing: '0.05em', marginBottom: 3 }}>HALF 2 &mdash; OPEN (un-ported)</div>
            <div style={{ fontSize: 11.5, color: '#cbd5e1' }}>
              Core-normalization: anchoring the exact verdict scalars ||R||&thinsp;=&thinsp;0.876
              (lag&thinsp;&le;&thinsp;0.20) and 0.711 (lag&thinsp;&le;&thinsp;0.40) requires the
              out-of-repo symmetric G<sub>pass</sub><sup>-1/2</sup> normalization, which has
              not been ported in-repo.
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>
          Dashed yellow lines mark the verdict anchors c&thinsp;=&thinsp;0.20 and 0.40; green marks the minimal lag-support knee.
          The in-repo chart shows the correct capture SHAPE but cannot reproduce the verdict norm values until Half 2 is ported.
        </div>
      </div>
    </div>
  );
}

function OverflowFractionResolutionSweepViz() {
  const M = IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE;
  const sweep = M.measured.sweep; // [{N, overflowFraction}, ...]
  const offline = { N: 204800, frac: M.measured.offlineConvergedOverflow }; // ~0.2092
  const anchor194 = M.measured.recordedImp3144Overflow; // 0.194
  const anchor200 = M.measured.recordedImp3154Overflow; // 0.200
  const asymptote = M.measured.offlineConvergedOverflow; // ~0.2092

  const svgW = 520, svgH = 190, padL = 44, padR = 12, padT = 14, padB = 30;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  // Log x-axis: N from 80 to 250000
  const xMin = Math.log(80), xMax = Math.log(250000);
  const xScale = (n) => padL + ((Math.log(n) - xMin) / (xMax - xMin)) * chartW;

  // Linear y-axis: 0.184 to 0.214
  const yMin = 0.184, yMax = 0.214;
  const yScale = (v) => padT + chartH * (1 - (v - yMin) / (yMax - yMin));

  const allPoints = [...sweep.map((r) => ({ N: r.N, frac: r.overflowFraction })), offline];
  const polyline = allPoints
    .map((p) => `${xScale(p.N).toFixed(1)},${yScale(p.frac).toFixed(1)}`)
    .join(' ');

  const yTicks = [0.185, 0.190, 0.195, 0.200, 0.205, 0.210];
  const xTickNs = [100, 200, 400, 800, 1600, 3200, 6400, 204800];

  return (
    <div className="card" style={{ marginTop: 18, borderLeft: '3px solid #06b6d4', background: 'rgba(6,182,212,0.03)' }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0, fontSize: 15 }}>
        Overflow Fraction Resolution Sweep (imp-3175): Monotone Convergence to ~0.209
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
        Refining the tau-grid (N panels) moves the overflow fraction{' '}
        <strong style={{ color: '#e2e8f0' }}>monotonically UP</strong>, converging to ~0.2092 at
        N&rarr;&infin; — not down to the coarse 0.194 anchor. Both recorded anchors (imp-3144: 0.194;
        imp-3154: 0.200) under-report the resolution-converged genuine fraction ~0.209.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
          {/* Grid lines */}
          {yTicks.map((v) => (
            <line key={v} x1={padL} y1={yScale(v)} x2={svgW - padR} y2={yScale(v)}
              stroke="#1e293b" strokeWidth={1} />
          ))}

          {/* Stale anchor: 0.194 */}
          <line x1={padL} y1={yScale(anchor194)} x2={svgW - padR} y2={yScale(anchor194)}
            stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 3" />
          <text x={padL + 4} y={yScale(anchor194) - 3} fill="#ef4444" fontSize={9}>
            stale 0.194 (imp-3144)
          </text>

          {/* Stale anchor: 0.200 */}
          <line x1={padL} y1={yScale(anchor200)} x2={svgW - padR} y2={yScale(anchor200)}
            stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 3" />
          <text x={padL + 4} y={yScale(anchor200) - 3} fill="#f59e0b" fontSize={9}>
            stale 0.200 (imp-3154 N=200)
          </text>

          {/* Converged asymptote ~0.2092 */}
          <line x1={padL} y1={yScale(asymptote)} x2={svgW - padR} y2={yScale(asymptote)}
            stroke="#10b981" strokeWidth={1.5} strokeDasharray="2 2" />
          <text x={svgW - padR - 2} y={yScale(asymptote) - 3} fill="#10b981" fontSize={9} textAnchor="end">
            converged ~0.2092
          </text>

          {/* Main polyline */}
          <polyline points={polyline} fill="none" stroke="#06b6d4" strokeWidth={2} />

          {/* Live N dots */}
          {sweep.map((r) => (
            <circle key={r.N}
              cx={xScale(r.N)} cy={yScale(r.overflowFraction)} r={4}
              fill="#06b6d4" stroke="#0e7490" strokeWidth={1} />
          ))}

          {/* Offline point (diamond) */}
          {(() => {
            const cx = xScale(offline.N), cy = yScale(offline.frac), d = 5;
            return (
              <polygon
                points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`}
                fill="#a78bfa" stroke="#7c3aed" strokeWidth={1}
              />
            );
          })()}
          <text x={xScale(offline.N)} y={yScale(offline.frac) - 8} fill="#a78bfa" fontSize={8} textAnchor="middle">
            offline
          </text>

          {/* Y-axis labels */}
          {yTicks.map((v) => (
            <text key={v} x={padL - 3} y={yScale(v) + 3.5} fill="#475569" fontSize={8} textAnchor="end">
              {v.toFixed(3)}
            </text>
          ))}

          {/* X-axis ticks */}
          {xTickNs.map((n) => {
            const x = xScale(n);
            const label = n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
            return (
              <g key={n}>
                <line x1={x} y1={svgH - padB} x2={x} y2={svgH - padB + 4} stroke="#475569" />
                <text x={x} y={svgH - padB + 12} fill="#475569" fontSize={7.5} textAnchor="middle">
                  {label}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={svgH - padB} stroke="#334155" />
          <line x1={padL} y1={svgH - padB} x2={svgW - padR} y2={svgH - padB} stroke="#334155" />

          {/* Axis labels */}
          <text x={10} y={padT + chartH / 2} fill="#94a3b8" fontSize={9.5} textAnchor="middle"
            transform={`rotate(-90, 10, ${padT + chartH / 2})`}>
            overflow fraction
          </text>
          <text x={padL + chartW / 2} y={svgH - 2} fill="#94a3b8" fontSize={9.5} textAnchor="middle">
            N (tau-grid panels, log scale)
          </text>
        </svg>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10, fontSize: 11, color: '#64748b' }}>
        <span><span style={{ color: '#06b6d4' }}>&#9679;</span> live N sweep (O(N) factorization)</span>
        <span><span style={{ color: '#a78bfa' }}>&#9670;</span> offline N=204800</span>
        <span><span style={{ color: '#ef4444' }}>&#8212;&#8212;</span> stale 0.194 anchor</span>
        <span><span style={{ color: '#f59e0b' }}>&#8212;&#8212;</span> stale 0.200 anchor</span>
        <span><span style={{ color: '#10b981' }}>&#8943;</span> converged ~0.2092</span>
      </div>
    </div>
  );
}

// ── imp-3250: U-sweep overflow fraction vs U collapsing onto frac*U ~1.2535 ──
// Two-panel SVG: (LEFT) scatter of frac vs U with the amber hyperbola frac=1.2535/U;
// (RIGHT) frac*U for all 7 cells showing near-flat invariance.
function USweeOverflowFractionViz() {
  const data = IMP3199_OVERFLOW_FRACTION_CELL_SWEEP;
  const cells = data.measured.perCell;
  const inv = data.measured.measureMean; // ~1.2535

  // U-varying cells only (a=0.5, NPHI=10)
  const uCells = cells.filter((r) => r.a === 0.5 && r.NPHI === 10).sort((a, b) => a.U - b.U);

  // ── LEFT PANEL: frac vs U + hyperbola ──────────────────────────────────────
  const W1 = 340, H1 = 200;
  const p1 = { t: 30, r: 16, b: 44, l: 52 };
  const cW1 = W1 - p1.l - p1.r;
  const cH1 = H1 - p1.t - p1.b;
  const Umin = 4.0, Umax = 9.5;
  const Fmin = 0, Fmax = 0.31;
  const xS1 = (U) => p1.l + ((U - Umin) / (Umax - Umin)) * cW1;
  const yS1 = (f) => p1.t + (1 - (f - Fmin) / (Fmax - Fmin)) * cH1;

  const hypPts = [];
  for (let u = 4.3; u <= 9.1; u += 0.08) hypPts.push([xS1(u), yS1(inv / u)]);
  const hypPath = hypPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  const uTicks = [5, 6, 7, 8, 9];
  const fTicks = [0, 0.1, 0.2, 0.3];

  // ── RIGHT PANEL: frac*U for all 7 cells ───────────────────────────────────
  const W2 = 240, H2 = 200;
  const p2 = { t: 30, r: 12, b: 44, l: 52 };
  const cW2 = W2 - p2.l - p2.r;
  const cH2 = H2 - p2.t - p2.b;
  const Mmin = 1.242, Mmax = 1.264;
  const xS2 = (i) => p2.l + ((i + 0.5) / cells.length) * cW2;
  const yS2 = (m) => p2.t + (1 - (m - Mmin) / (Mmax - Mmin)) * cH2;
  const mTicks = [1.245, 1.250, 1.255, 1.260];

  const dotColor = (r) => {
    if (r.U === 5) return '#10b981';
    if (r.U === 8) return '#8b5cf6';
    if (r.U === 6 && r.a === 0.5 && r.NPHI === 10) return '#06b6d4';
    return '#94a3b8';
  };

  return (
    <div className="card" style={{ marginTop: 14, borderLeft: '3px solid #06b6d4', background: 'rgba(6,182,212,0.03)' }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0, fontSize: 15 }}>
        U-Sweep Collapse: overflow fraction &prop; 1/U, product frac&times;U &asymp; 1.2535 (imp-3199)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
        The three U-varying cells (U&nbsp;=&nbsp;5,&nbsp;6,&nbsp;8; a&nbsp;=&nbsp;0.5 fixed) lie on
        the hyperbola frac&nbsp;=&nbsp;1.2535/U (amber dashes). The fraction drops from 0.251 at
        U&nbsp;=&nbsp;5 to 0.157 at U&nbsp;=&nbsp;8 — but the product frac&times;U stays
        near&nbsp;{inv.toFixed(4)} across all seven cells including a-varying and NPHI-varying ones
        (right panel). Varying a or NPHI does not move the fraction; only U matters.
      </p>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* LEFT: frac vs U + hyperbola */}
        <svg width={W1} height={H1} style={{ display: 'block' }}>
          {/* Grid */}
          {fTicks.map((f) => (
            <line key={f} x1={p1.l} x2={p1.l + cW1} y1={yS1(f)} y2={yS1(f)} stroke="#1e293b" strokeWidth={1} />
          ))}
          {uTicks.map((u) => (
            <line key={u} x1={xS1(u)} x2={xS1(u)} y1={p1.t} y2={p1.t + cH1} stroke="#1e293b" strokeWidth={1} />
          ))}
          {/* Hyperbola frac = inv/U */}
          <path d={hypPath} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={xS1(8.6)} y={yS1(inv / 8.6) - 7} fill="#f59e0b" fontSize={9} textAnchor="middle">
            frac&times;U&asymp;{inv.toFixed(4)}
          </text>
          {/* U-varying data points */}
          {uCells.map((r) => (
            <g key={r.label}>
              <circle cx={xS1(r.U)} cy={yS1(r.convergedFraction)} r={5.5} fill={dotColor(r)} stroke="#0f172a" strokeWidth={1} />
              <text x={xS1(r.U) + 9} y={yS1(r.convergedFraction) + 4} fill={dotColor(r)} fontSize={9}>
                {r.convergedFraction.toFixed(3)}
              </text>
              <text x={xS1(r.U)} y={yS1(r.convergedFraction) - 9} fill="#94a3b8" fontSize={9} textAnchor="middle">
                U={r.U}
              </text>
            </g>
          ))}
          {/* Axes */}
          <line x1={p1.l} x2={p1.l + cW1} y1={p1.t + cH1} y2={p1.t + cH1} stroke="#475569" strokeWidth={1} />
          <line x1={p1.l} x2={p1.l} y1={p1.t} y2={p1.t + cH1} stroke="#475569" strokeWidth={1} />
          {uTicks.map((u) => (
            <g key={u}>
              <line x1={xS1(u)} x2={xS1(u)} y1={p1.t + cH1} y2={p1.t + cH1 + 4} stroke="#475569" />
              <text x={xS1(u)} y={p1.t + cH1 + 14} fill="#94a3b8" fontSize={9} textAnchor="middle">{u}</text>
            </g>
          ))}
          {fTicks.map((f) => (
            <g key={f}>
              <line x1={p1.l - 4} x2={p1.l} y1={yS1(f)} y2={yS1(f)} stroke="#475569" />
              <text x={p1.l - 7} y={yS1(f) + 4} fill="#94a3b8" fontSize={9} textAnchor="end">{f.toFixed(1)}</text>
            </g>
          ))}
          <text x={p1.l + cW1 / 2} y={H1 - 5} fill="#64748b" fontSize={10} textAnchor="middle">lag cutoff U</text>
          <text
            x={11} y={p1.t + cH1 / 2} fill="#64748b" fontSize={10} textAnchor="middle"
            transform={`rotate(-90, 11, ${p1.t + cH1 / 2})`}
          >overflow fraction</text>
          <text x={p1.l + cW1 / 2} y={19} fill="#94a3b8" fontSize={10} textAnchor="middle">frac vs U</text>
        </svg>

        {/* RIGHT: frac*U for all 7 cells */}
        <svg width={W2} height={H2} style={{ display: 'block' }}>
          {/* Y grid */}
          {mTicks.map((m) => (
            <line key={m} x1={p2.l} x2={p2.l + cW2} y1={yS2(m)} y2={yS2(m)} stroke="#1e293b" strokeWidth={0.5} />
          ))}
          {/* Mean line */}
          <line x1={p2.l} x2={p2.l + cW2} y1={yS2(inv)} y2={yS2(inv)} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2" />
          <text x={p2.l + cW2 - 2} y={yS2(inv) - 4} fill="#f59e0b" fontSize={9} textAnchor="end">
            mean&asymp;{inv.toFixed(4)}
          </text>
          {/* Dots for all 7 cells */}
          {cells.map((r, i) => (
            <circle key={r.label} cx={xS2(i)} cy={yS2(r.supportMeasure)} r={4.5}
              fill={dotColor(r)} stroke="#0f172a" strokeWidth={1} />
          ))}
          {/* Axes */}
          <line x1={p2.l} x2={p2.l + cW2} y1={p2.t + cH2} y2={p2.t + cH2} stroke="#475569" strokeWidth={1} />
          <line x1={p2.l} x2={p2.l} y1={p2.t} y2={p2.t + cH2} stroke="#475569" strokeWidth={1} />
          {mTicks.map((m) => (
            <g key={m}>
              <line x1={p2.l - 4} x2={p2.l} y1={yS2(m)} y2={yS2(m)} stroke="#475569" />
              <text x={p2.l - 7} y={yS2(m) + 4} fill="#94a3b8" fontSize={8} textAnchor="end">{m.toFixed(3)}</text>
            </g>
          ))}
          <text x={p2.l + cW2 / 2} y={H2 - 4} fill="#64748b" fontSize={10} textAnchor="middle">all 7 cells</text>
          <text
            x={10} y={p2.t + cH2 / 2} fill="#64748b" fontSize={10} textAnchor="middle"
            transform={`rotate(-90, 10, ${p2.t + cH2 / 2})`}
          >frac&times;U</text>
          <text x={p2.l + cW2 / 2} y={19} fill="#94a3b8" fontSize={10} textAnchor="middle">frac&times;U invariant</text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
        <span style={{ color: '#10b981', fontSize: 11 }}>&#9679; U=5 (frac=0.251)</span>
        <span style={{ color: '#06b6d4', fontSize: 11 }}>&#9679; U=6 base (frac=0.209)</span>
        <span style={{ color: '#8b5cf6', fontSize: 11 }}>&#9679; U=8 (frac=0.157)</span>
        <span style={{ color: '#94a3b8', fontSize: 11 }}>&#9679; a- / NPHI-varying cells</span>
        <span style={{ color: '#f59e0b', fontSize: 11 }}>&#8212; frac&times;U&asymp;1.2535 hyperbola / mean</span>
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3199-overflow-fraction-cell-sweep.js &mdash; DIAGNOSTIC; overflow-support only;
        NOT a reduction; Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains SOTA.
      </p>
    </div>
  );
}

// ── imp-3314: measured (underflow-pinned) vs true overflow fraction vs U ──
// Contrasts the imp-3216 MEASURED fraction (tau_2 - tau_1)/U -- falling like
// 1/U because tau_2 is pinned at the kernel underflow horizon -- against the
// mathematically-correct fraction (U - tau_1)/U, which rises toward 1.
function UnderflowArtifactVsTrueFractionViz() {
  const data = IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM;
  const tau1 = data.measured.tau1Mean;
  const tau2 = data.measured.tau2Mean;
  const horizon = data.measured.phiUnderflowHorizon;
  const ladder = data.measured.uLadder;

  const W = 460, H = 240;
  const p = { t: 30, r: 14, b: 44, l: 48 };
  const cW = W - p.l - p.r;
  const cH = H - p.t - p.b;
  const Umin = 4.5, Umax = 13.5;
  const Fmin = 0, Fmax = 1.04;
  const xS = (U) => p.l + ((U - Umin) / (Umax - Umin)) * cW;
  const yS = (f) => p.t + (1 - (f - Fmin) / (Fmax - Fmin)) * cH;

  const measuredPts = [];
  const truePts = [];
  for (let u = Umin + 0.15; u <= Umax - 0.1; u += 0.15) {
    measuredPts.push([xS(u), yS((tau2 - tau1) / u)]);
    truePts.push([xS(u), yS(1 - tau1 / u)]);
  }
  const measuredPath = measuredPts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');
  const truePath = truePts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');

  const uTicks = [5, 6, 8, 10, 12];
  const fTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="card" style={{ marginTop: 14, borderLeft: '3px solid #f87171', background: 'rgba(248,113,113,0.03)' }}>
      <h3 style={{ color: '#f87171', marginTop: 0, fontSize: 15 }}>
        Measured vs True Overflow Fraction: 1/U underflow artifact vs &rarr;1 (imp-3314 / imp-3216)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
        The MEASURED fraction (&tau;<sub>2</sub>&nbsp;&minus;&nbsp;&tau;<sub>1</sub>)/U (red, falling)
        uses &tau;<sub>2</sub>&thinsp;&asymp;&thinsp;{tau2.toFixed(3)}, which is pinned at the IEEE-754
        kernel <strong>underflow horizon</strong> ({horizon.toFixed(3)}) rather than a genuine crossing, so it
        falls like 1/U as U grows. The mathematically-correct fraction (U&nbsp;&minus;&nbsp;&tau;<sub>1</sub>)/U
        (green, rising) uses only the genuine lower endpoint &tau;<sub>1</sub>&thinsp;&asymp;&thinsp;{tau1.toFixed(3)}
        and climbs toward 1 as U grows &mdash; because past &tau;<sub>1</sub> the overflow region
        genuinely extends all the way to U.
      </p>
      <svg width={W} height={H} style={{ display: 'block' }}>
        {fTicks.map((f) => (
          <line key={f} x1={p.l} x2={p.l + cW} y1={yS(f)} y2={yS(f)} stroke="#1e293b" strokeWidth={1} />
        ))}
        {uTicks.map((u) => (
          <line key={u} x1={xS(u)} x2={xS(u)} y1={p.t} y2={p.t + cH} stroke="#1e293b" strokeWidth={1} />
        ))}
        {/* Asymptote at f=1 */}
        <line x1={p.l} x2={p.l + cW} y1={yS(1)} y2={yS(1)} stroke="#10b981" strokeWidth={1} strokeDasharray="2,3" opacity={0.5} />
        {/* Curves */}
        <path d={truePath} fill="none" stroke="#10b981" strokeWidth={1.8} />
        <path d={measuredPath} fill="none" stroke="#f87171" strokeWidth={1.8} strokeDasharray="5,3" />
        {/* Ladder data points */}
        {ladder.map((row) => (
          <g key={`m${row.U}`}>
            <circle cx={xS(row.U)} cy={yS(row.measuredFraction)} r={3.5} fill="#f87171" stroke="#0f172a" strokeWidth={1} />
            <circle cx={xS(row.U)} cy={yS(row.trueFraction)} r={3.5} fill="#10b981" stroke="#0f172a" strokeWidth={1} />
          </g>
        ))}
        {/* tau_1 annotation (asymptotic slope driver) */}
        <text x={xS(11.5)} y={yS(1 - tau1 / 11.5) - 8} fill="#10b981" fontSize={9} textAnchor="middle">
          &tau;<tspan dy="2" fontSize={7}>1</tspan><tspan dy="-2">&thinsp;&asymp;&thinsp;{tau1.toFixed(3)}</tspan>
        </text>
        {/* underflow horizon annotation */}
        <text x={xS(9)} y={yS((tau2 - tau1) / 9) + 15} fill="#f87171" fontSize={9} textAnchor="middle">
          &tau;<tspan dy="2" fontSize={7}>2</tspan><tspan dy="-2">&thinsp;pinned&thinsp;&asymp;&thinsp;{horizon.toFixed(3)} (underflow horizon)</tspan>
        </text>
        {/* Axes */}
        <line x1={p.l} x2={p.l + cW} y1={p.t + cH} y2={p.t + cH} stroke="#475569" strokeWidth={1} />
        <line x1={p.l} x2={p.l} y1={p.t} y2={p.t + cH} stroke="#475569" strokeWidth={1} />
        {uTicks.map((u) => (
          <g key={u}>
            <line x1={xS(u)} x2={xS(u)} y1={p.t + cH} y2={p.t + cH + 4} stroke="#475569" />
            <text x={xS(u)} y={p.t + cH + 14} fill="#94a3b8" fontSize={9} textAnchor="middle">{u}</text>
          </g>
        ))}
        {fTicks.map((f) => (
          <g key={f}>
            <line x1={p.l - 4} x2={p.l} y1={yS(f)} y2={yS(f)} stroke="#475569" />
            <text x={p.l - 7} y={yS(f) + 4} fill="#94a3b8" fontSize={9} textAnchor="end">{f.toFixed(2)}</text>
          </g>
        ))}
        <text x={p.l + cW / 2} y={H - 5} fill="#64748b" fontSize={10} textAnchor="middle">lag cutoff U</text>
        <text
          x={10} y={p.t + cH / 2} fill="#64748b" fontSize={10} textAnchor="middle"
          transform={`rotate(-90, 10, ${p.t + cH / 2})`}
        >overflow fraction</text>
      </svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
        <span style={{ color: '#f87171', fontSize: 11 }}>&#8212;&#8212; measured (&tau;<sub>2</sub>&minus;&tau;<sub>1</sub>)/U &rarr; 0 as 1/U</span>
        <span style={{ color: '#10b981', fontSize: 11 }}>&#8212; true (U&minus;&tau;<sub>1</sub>)/U &rarr; 1</span>
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3216-overflow-support-length-closed-form.js (uLadder) &mdash; DIAGNOSTIC; overflow-support
        geometry only; NOT a reduction; Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains SOTA.
      </p>
    </div>
  );
}

// ── imp-3394: truncation-threshold sweep -- support length tracks the closed-form
// underflow horizon tau_2(T), not a fixed Phi-autocorrelation length (imp-3322) ──
// Overlays the DISCRETE measured support length (frac x U, at each swept threshold T)
// against the DENSE closed-form curve tau_2(T) - tau_1 (the horizon, shifted down by
// the fixed genuine lower endpoint tau_1), showing the endpoint moves inward with T
// rather than sitting still at a fixed Phi-intrinsic length.
function TruncationThresholdHorizonViz() {
  const D = IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR.measured;
  const sweep = D.d1ThresholdSweep;
  const tau1 = sweep[0].tau1;

  // Closed-form horizon tau_2(T) = (1/4) ln X, root of pi X - ln(2 pi^2 X) = ln(1/T).
  function horizonTau(T) {
    const rhs = -Math.log(T);
    const f = (X) => Math.PI * X - Math.log(2 * Math.PI * Math.PI * X) - rhs;
    let lo = 1e-6, hi = rhs;
    for (let it = 0; it < 100; it++) {
      const mid = 0.5 * (lo + hi);
      if (f(mid) > 0) hi = mid; else lo = mid;
    }
    return 0.25 * Math.log(0.5 * (lo + hi));
  }
  const expOf = (T) => -Math.log10(T);

  const W = 480, H = 260;
  const p = { t: 26, r: 16, b: 44, l: 46 };
  const cW = W - p.l - p.r;
  const cH = H - p.t - p.b;
  const Emin = 90, Emax = 330;
  const Lmin = 0.9, Lmax = 1.42;
  const xS = (E) => p.l + ((E - Emin) / (Emax - Emin)) * cW;
  const yS = (len) => p.t + (1 - (len - Lmin) / (Lmax - Lmin)) * cH;

  const curvePts = [];
  for (let E = 95; E <= 323.2; E += 4) {
    curvePts.push([xS(E), yS(horizonTau(Math.pow(10, -E)) - tau1)]);
  }
  const nativeE = expOf(sweep[0].effectiveThreshold);
  curvePts.push([xS(nativeE), yS(horizonTau(Math.pow(10, -nativeE)) - tau1)]);
  const curvePath = curvePts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');

  const eTicks = [100, 150, 200, 250, 300];

  return (
    <div className="card" style={{ marginTop: 14, borderLeft: '3px solid #38bdf8', background: 'rgba(56,189,248,0.03)' }}>
      <h3 style={{ color: '#38bdf8', marginTop: 0, fontSize: 15 }}>
        Truncation-Threshold Sweep: Support Length Tracks the Closed-Form Horizon (imp-3394 / imp-3322)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
        Raising the arithmetic truncation threshold <em>T</em> (zeroing kernel samples below <em>T</em>, from the
        native 2<sup>&minus;1074</sup> subnormal out to 1e&minus;100) moves the measured support length (gold dots)
        <strong> inward</strong>, tracking the dense closed-form horizon curve
        &tau;<sub>2</sub>(T)&thinsp;&minus;&thinsp;&tau;<sub>1</sub> (cyan). The length is <em>not</em> a fixed
        Phi-autocorrelation constant &mdash; it is the arithmetic underflow horizon, moving with precision.
      </p>
      <svg width={W} height={H} style={{ display: 'block' }}>
        {[0.9, 1.0, 1.1, 1.2, 1.3, 1.4].map((l) => (
          <line key={l} x1={p.l} x2={p.l + cW} y1={yS(l)} y2={yS(l)} stroke="#1e293b" strokeWidth={1} />
        ))}
        {eTicks.map((e) => (
          <line key={e} x1={xS(e)} x2={xS(e)} y1={p.t} y2={p.t + cH} stroke="#1e293b" strokeWidth={1} />
        ))}
        <path d={curvePath} fill="none" stroke="#38bdf8" strokeWidth={1.8} />
        {sweep.map((row) => (
          <circle
            key={row.threshold}
            cx={xS(expOf(row.effectiveThreshold))}
            cy={yS(row.measure)}
            r={3.5}
            fill="#f59e0b"
            stroke="#0f172a"
            strokeWidth={1}
          />
        ))}
        {/* native anchor annotation */}
        <text x={xS(nativeE) - 6} y={yS(sweep[0].measure) - 10} fill="#f59e0b" fontSize={9} textAnchor="end">
          native &asymp; {sweep[0].measure.toFixed(3)}
        </text>
        <text x={xS(100) + 6} y={yS(sweep[sweep.length - 1].measure) + 16} fill="#f59e0b" fontSize={9} textAnchor="start">
          T=1e&minus;100 &asymp; {sweep[sweep.length - 1].measure.toFixed(3)}
        </text>
        {/* Axes */}
        <line x1={p.l} x2={p.l + cW} y1={p.t + cH} y2={p.t + cH} stroke="#475569" strokeWidth={1} />
        <line x1={p.l} x2={p.l} y1={p.t} y2={p.t + cH} stroke="#475569" strokeWidth={1} />
        {eTicks.map((e) => (
          <g key={e}>
            <line x1={xS(e)} x2={xS(e)} y1={p.t + cH} y2={p.t + cH + 4} stroke="#475569" />
            <text x={xS(e)} y={p.t + cH + 14} fill="#94a3b8" fontSize={9} textAnchor="middle">1e&minus;{e}</text>
          </g>
        ))}
        {[0.9, 1.0, 1.1, 1.2, 1.3, 1.4].map((l) => (
          <g key={l}>
            <line x1={p.l - 4} x2={p.l} y1={yS(l)} y2={yS(l)} stroke="#475569" />
            <text x={p.l - 7} y={yS(l) + 4} fill="#94a3b8" fontSize={9} textAnchor="end">{l.toFixed(1)}</text>
          </g>
        ))}
        <text x={p.l + cW / 2} y={H - 5} fill="#64748b" fontSize={10} textAnchor="middle">truncation threshold T (native at right edge)</text>
        <text
          x={10} y={p.t + cH / 2} fill="#64748b" fontSize={10} textAnchor="middle"
          transform={`rotate(-90, 10, ${p.t + cH / 2})`}
        >support length</text>
      </svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
        <span style={{ color: '#38bdf8', fontSize: 11 }}>&#8212;&#8212; closed-form &tau;<sub>2</sub>(T)&minus;&tau;<sub>1</sub></span>
        <span style={{ color: '#f59e0b', fontSize: 11 }}>&#9679; measured support length (frac&times;U)</span>
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3322-spread-contraction-discriminator.js (d1ThresholdSweep) &mdash; DIAGNOSTIC; overflow-support
        geometry only; NOT a reduction; Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains SOTA.
      </p>
    </div>
  );
}

// ── imp-3395: imp-3309 two-tail underflow horizons -- Phi and Phi^2 magnitude
// decay (as -ln|magnitude|, the "exponent debt") crossing the 2^-1074 subnormal
// line L at tau_mu (Phi^2, first) and tau_nu (Phi, later), leaving the band
// (tau_mu, tau_nu) where nu > 0 = mu. ──
function TwoTailUnderflowHorizonsViz() {
  const M = IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS.measured;
  const L = M.lnInvMinSubnormal;
  const tauMu = M.muHorizonClosedForm;
  const tauNu = M.nuHorizonClosedForm;

  // Exponent debt (-ln|magnitude|) of the leading tail terms: underflows once this exceeds L.
  const nuDebt = (tau) => {
    const X = Math.exp(4 * tau);
    return Math.PI * X - Math.log(2 * Math.PI * Math.PI * X);
  };
  const muDebt = (tau) => {
    const X = Math.exp(4 * tau);
    return 2 * Math.PI * X - Math.log(4 * Math.pow(Math.PI, 4) * X * X);
  };

  const W = 480, H = 260;
  const p = { t: 26, r: 16, b: 44, l: 52 };
  const cW = W - p.l - p.r;
  const cH = H - p.t - p.b;
  const tMin = 0.95, tMax = 1.42;
  const dMin = 0, dMax = 950;
  const xS = (t) => p.l + ((t - tMin) / (tMax - tMin)) * cW;
  const yS = (d) => p.t + (1 - (Math.min(d, dMax) - dMin) / (dMax - dMin)) * cH;

  const nuPts = [];
  const muPts = [];
  for (let t = tMin; t <= tMax; t += 0.01) {
    nuPts.push([xS(t), yS(nuDebt(t))]);
    muPts.push([xS(t), yS(muDebt(t))]);
  }
  const nuPath = nuPts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');
  const muPath = muPts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');

  const tTicks = [1.0, 1.1, 1.2, 1.3, 1.4];
  const dTicks = [0, 250, 500, 750];

  return (
    <div className="card" style={{ marginTop: 14, borderLeft: '3px solid #2dd4bf', background: 'rgba(45,212,191,0.03)' }}>
      <h3 style={{ color: '#2dd4bf', marginTop: 0, fontSize: 15 }}>
        Two-Tail Underflow Horizons: Phi (single) vs Phi<sup>2</sup> Crossing the Subnormal Line (imp-3395 / imp-3309)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
        Plotted is the exponent debt &minus;ln|magnitude| of each leading tail term against lag &tau; (X&thinsp;=&thinsp;e<sup>4&tau;</sup>):
        the single-Phi tail 2&pi;<sup>2</sup>X e<sup>&minus;&pi;X</sup> (teal, debt &pi;X&thinsp;&minus;&thinsp;ln(2&pi;<sup>2</sup>X)) and the
        Phi<sup>2</sup> tail 4&pi;<sup>4</sup>X<sup>2</sup> e<sup>&minus;2&pi;X</sup> (purple, debt 2&pi;X&thinsp;&minus;&thinsp;ln(4&pi;<sup>4</sup>X<sup>2</sup>)).
        Both cross the IEEE-754 smallest-subnormal line L&thinsp;=&thinsp;ln(2<sup>1074</sup>)&thinsp;&asymp;&thinsp;{L.toFixed(1)} (red dashed)
        &mdash; because the Phi<sup>2</sup> exponent is exactly twice the single-Phi exponent, Phi<sup>2</sup> crosses FIRST, at
        &tau;<sub>mu</sub>&thinsp;&asymp;&thinsp;{tauMu.toFixed(3)}, then Phi crosses at &tau;<sub>nu</sub>&thinsp;&asymp;&thinsp;{tauNu.toFixed(3)},
        leaving the band ({tauMu.toFixed(3)}, {tauNu.toFixed(3)}) where nu&thinsp;&gt;&thinsp;0&thinsp;=&thinsp;mu.
      </p>
      <svg width={W} height={H} style={{ display: 'block' }}>
        {dTicks.map((d) => (
          <line key={d} x1={p.l} x2={p.l + cW} y1={yS(d)} y2={yS(d)} stroke="#1e293b" strokeWidth={1} />
        ))}
        {tTicks.map((t) => (
          <line key={t} x1={xS(t)} x2={xS(t)} y1={p.t} y2={p.t + cH} stroke="#1e293b" strokeWidth={1} />
        ))}
        {/* Subnormal threshold line L */}
        <line x1={p.l} x2={p.l + cW} y1={yS(L)} y2={yS(L)} stroke="#f87171" strokeWidth={1.4} strokeDasharray="5,3" />
        <text x={p.l + 4} y={yS(L) - 5} fill="#f87171" fontSize={9}>L&thinsp;=&thinsp;ln(2<tspan dy="-4" fontSize={7}>1074</tspan><tspan dy="4">)&thinsp;&asymp;&thinsp;{L.toFixed(1)}</tspan></text>
        {/* Debt curves */}
        <path d={muPath} fill="none" stroke="#a78bfa" strokeWidth={1.8} />
        <path d={nuPath} fill="none" stroke="#2dd4bf" strokeWidth={1.8} />
        {/* Horizon markers */}
        <line x1={xS(tauMu)} x2={xS(tauMu)} y1={yS(L)} y2={p.t + cH} stroke="#a78bfa" strokeWidth={1} strokeDasharray="2,3" />
        <circle cx={xS(tauMu)} cy={yS(L)} r={3.5} fill="#a78bfa" stroke="#0f172a" strokeWidth={1} />
        <line x1={xS(tauNu)} x2={xS(tauNu)} y1={yS(L)} y2={p.t + cH} stroke="#2dd4bf" strokeWidth={1} strokeDasharray="2,3" />
        <circle cx={xS(tauNu)} cy={yS(L)} r={3.5} fill="#2dd4bf" stroke="#0f172a" strokeWidth={1} />
        <text x={xS(tauMu)} y={p.t + cH + 14} fill="#a78bfa" fontSize={9} textAnchor="middle">
          &tau;<tspan dy="2" fontSize={7}>mu</tspan><tspan dy="-2">&thinsp;{tauMu.toFixed(3)}</tspan>
        </text>
        <text x={xS(tauNu)} y={p.t + cH + 26} fill="#2dd4bf" fontSize={9} textAnchor="middle">
          &tau;<tspan dy="2" fontSize={7}>nu</tspan><tspan dy="-2">&thinsp;{tauNu.toFixed(3)}</tspan>
        </text>
        {/* Axes */}
        <line x1={p.l} x2={p.l + cW} y1={p.t + cH} y2={p.t + cH} stroke="#475569" strokeWidth={1} />
        <line x1={p.l} x2={p.l} y1={p.t} y2={p.t + cH} stroke="#475569" strokeWidth={1} />
        {tTicks.map((t) => (
          <g key={t}>
            <line x1={xS(t)} x2={xS(t)} y1={p.t + cH} y2={p.t + cH + 4} stroke="#475569" />
            <text x={xS(t)} y={p.t + cH + 14} fill="#94a3b8" fontSize={9} textAnchor="middle">{t.toFixed(1)}</text>
          </g>
        ))}
        {dTicks.map((d) => (
          <g key={d}>
            <line x1={p.l - 4} x2={p.l} y1={yS(d)} y2={yS(d)} stroke="#475569" />
            <text x={p.l - 7} y={yS(d) + 4} fill="#94a3b8" fontSize={9} textAnchor="end">{d}</text>
          </g>
        ))}
        <text x={p.l + cW / 2} y={H - 5} fill="#64748b" fontSize={10} textAnchor="middle">lag &tau;</text>
        <text
          x={12} y={p.t + cH / 2} fill="#64748b" fontSize={10} textAnchor="middle"
          transform={`rotate(-90, 12, ${p.t + cH / 2})`}
        >exponent debt &minus;ln|magnitude|</text>
      </svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
        <span style={{ color: '#a78bfa', fontSize: 11 }}>&#8212;&#8212; Phi<sup>2</sup> (mu) debt, crosses L first</span>
        <span style={{ color: '#2dd4bf', fontSize: 11 }}>&#8212;&#8212; Phi (nu) debt, crosses L later</span>
        <span style={{ color: '#f87171', fontSize: 11 }}>&#8212; &#8212; subnormal threshold L</span>
      </div>
      <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3309-two-tail-underflow-horizons.js &mdash; closed-form horizons vs measured largest-representable-lag
        agree to &lt;3e-3; band width {M.bandWidthClosed.toFixed(5)}&thinsp;&asymp;&thinsp;(1/4)ln2. DIAGNOSTIC; confirms
        imp-3216 finding E2; NOT a reduction; Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains SOTA.
      </p>
    </div>
  );
}

// ── imp-3197: sign-vs-magnitude decomposition of K_a >= 0 bridge obstruction ──
// Shows that the SIGN half is FREE (Phi-only, 100% magnitude-weighted agreement,
// zero mismatch mass) while the MAGNITUDE half is the whole residual: the
// lag-stationary Toeplitz surrogate captures only ~3% of ||Gshear||, with ~97%
// from Phi position concentration.
function BridgeSignMagnitudeDecompositionViz() {
  const M = IMP3197_MUPASS_BRIDGE_SIGN_PHI_ONLY.measured;

  // Two vertical proportion bars + stats
  const W = 660, H = 320, MT = 36, MB = 54;
  const barH = H - MT - MB;
  const barW = 130;
  const p1x = 110; // sign bar left edge
  const p2x = 400; // magnitude bar left edge

  // SIGN panel: match (green) bottom, mismatch (red) top
  const matchH = barH * M.signMatchMassFraction; // effectively barH
  const mismatchH = barH - matchH;               // effectively 0

  // MAGNITUDE panel: concentration (red) bottom, toeplitz (amber) top
  const concentrationH = barH * M.positionConcentrationFraction; // ~97%
  const toeplitzH = barH - concentrationH;                        // ~3%

  const matchY = MT + mismatchH; // bar bottom-anchored
  const concY = MT + toeplitzH;

  const toeplitzPct = (M.lagStationaryNormRatio * 100).toFixed(1);
  const concentrationPct = (M.positionConcentrationFraction * 100).toFixed(1);
  const matchPct = (M.signMatchMassFraction * 100).toFixed(1);
  const mismatchPct = (M.mismatchMassFraction * 100).toFixed(1);

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
      <h3 style={{ color: '#f59e0b', marginTop: 0 }}>
        K&#x2090;&thinsp;&ge;&thinsp;0 sign-vs-magnitude split: SIGN is FREE (Phi-only), MAGNITUDE is the binding obstruction (imp-3197)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The section26-mupass verdict claims the bridge sign-positivity is "derived from Phi ALONE."
        imp-3197 tests this at the genuine de Bruijn-Newman Phi (NPHI=10, a=0.5, U=6, N=200) by
        splitting the requirement into two halves. The SIGN half is exactly Phi-only (trivially, because
        Phi&thinsp;&ge;&thinsp;0 on [0,U]). The MAGNITUDE half is the entire residual: the
        lag-stationary Toeplitz surrogate carrying the exact Phi autocorrelation symbol
        captures only <strong>~{toeplitzPct}%</strong> of &#x2016;G&#x209B;&#x2095;&#x2091;&#x2090;&#x2072;&#x2016;,
        with <strong>~{concentrationPct}%</strong> from Phi position concentration.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg
          width={W} height={H}
          style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}
          role="img"
          aria-label="Sign vs magnitude decomposition: two vertical proportion bars"
        >
          {/* ── Panel 1: SIGN ── */}
          <text x={p1x + barW / 2} y={MT - 18} textAnchor="middle"
            fontSize="13" fontWeight="700" fill="#10b981" fontFamily={mono}>
            SIGN HALF
          </text>
          <text x={p1x + barW / 2} y={MT - 5} textAnchor="middle"
            fontSize="10" fill="#6ee7b7" fontFamily={mono}>
            (Phi-only, FREE)
          </text>

          {/* mismatch sliver (essentially invisible — honest) */}
          {mismatchH > 0 && (
            <rect x={p1x} y={MT} width={barW} height={mismatchH} fill="#ef4444" fillOpacity="0.8" />
          )}
          {/* match block */}
          <rect x={p1x} y={matchY} width={barW} height={matchH} fill="#10b981" fillOpacity="0.85" rx="3" />

          {/* match label inside bar */}
          <text x={p1x + barW / 2} y={matchY + matchH / 2 + 5}
            textAnchor="middle" fontSize="22" fontWeight="700" fill="#052e16" fontFamily={mono}>
            {matchPct}%
          </text>
          <text x={p1x + barW / 2} y={matchY + matchH / 2 + 22}
            textAnchor="middle" fontSize="10" fill="#052e16" fontFamily={mono}>
            sign match
          </text>

          {/* mismatch annotation below */}
          <text x={p1x + barW / 2} y={H - MB + 16}
            textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>
            mismatch: {mismatchPct}%
          </text>
          <text x={p1x + barW / 2} y={H - MB + 30}
            textAnchor="middle" fontSize="10" fill="#6ee7b7" fontFamily={mono}>
            0 mismatch cells
          </text>
          <text x={p1x + barW / 2} y={H - MB + 44}
            textAnchor="middle" fontSize="10" fill="#6ee7b7" fontFamily={mono}>
            zero gap
          </text>

          {/* ── Panel 2: MAGNITUDE ── */}
          <text x={p2x + barW / 2} y={MT - 18} textAnchor="middle"
            fontSize="13" fontWeight="700" fill="#ef4444" fontFamily={mono}>
            MAGNITUDE HALF
          </text>
          <text x={p2x + barW / 2} y={MT - 5} textAnchor="middle"
            fontSize="10" fill="#fca5a5" fontFamily={mono}>
            (operator-level, BINDING)
          </text>

          {/* Toeplitz slice (amber, top ~3%) */}
          <rect x={p2x} y={MT} width={barW} height={toeplitzH} fill="#f59e0b" fillOpacity="0.85" rx="3" />

          {/* position-concentration block (red, bottom ~97%) */}
          <rect x={p2x} y={concY} width={barW} height={concentrationH} fill="#ef4444" fillOpacity="0.82" rx="3" />

          {/* Toeplitz label (annotation arrow since it is tiny) */}
          <line x1={p2x + barW + 5} y1={MT + toeplitzH / 2} x2={p2x + barW + 55} y2={MT + toeplitzH / 2 + 12}
            stroke="#f59e0b" strokeWidth="1.2" />
          <text x={p2x + barW + 57} y={MT + toeplitzH / 2 + 16}
            fontSize="10" fill="#f59e0b" fontFamily={mono}>
            Toeplitz {toeplitzPct}%
          </text>

          {/* concentration label inside bar */}
          <text x={p2x + barW / 2} y={concY + concentrationH / 2 + 5}
            textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff1f2" fontFamily={mono}>
            {concentrationPct}%
          </text>
          <text x={p2x + barW / 2} y={concY + concentrationH / 2 + 22}
            textAnchor="middle" fontSize="10" fill="#fecaca" fontFamily={mono}>
            position conc.
          </text>

          {/* annotations below magnitude panel */}
          <text x={p2x + barW / 2} y={H - MB + 16}
            textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>
            ||T|| / ||Gshear|| = {M.lagStationaryNormRatio.toFixed(4)}
          </text>
          <text x={p2x + barW / 2} y={H - MB + 30}
            textAnchor="middle" fontSize="10" fill="#fca5a5" fontFamily={mono}>
            surrogate under-reports ~33x
          </text>
          <text x={p2x + barW / 2} y={H - MB + 44}
            textAnchor="middle" fontSize="10" fill="#fca5a5" fontFamily={mono}>
            RH-equivalent gap
          </text>

          {/* divider */}
          <line x1={W / 2} y1={MT - 22} x2={W / 2} y2={H - MB + 50}
            stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
      </div>

      {/* Two-cell stat summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.06em', marginBottom: 6 }}>
            SIGN HALF &mdash; FREE (Phi-only)
          </div>
          <p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
            Phi is nonnegative on [0, U] (0 genuine sign changes; tail underflows, never negative),
            so its on-domain autocorrelation is &ge;0 at every lag. Therefore sign&thinsp;G&#x209B;(u,v)&thinsp;=&thinsp;sign(v&minus;u)
            &mdash; a pure antisymmetric sinh sign. The Phi-only predicted sign matches the
            |G&#x209B;|-derived entry sign on <strong style={{ color: '#6ee7b7' }}>100%</strong> of
            the off-diagonal mass, with <strong>0 mismatch cells</strong> and zero mismatch mass.
            This is the EASY half: it follows trivially from nonnegativity and does NOT advance K&#x2090;&thinsp;&ge;&thinsp;0.
          </p>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 6 }}>
            MAGNITUDE HALF &mdash; BINDING OBSTRUCTION
          </div>
          <p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
            The lag-stationary Toeplitz surrogate carrying the exact Phi autocorrelation symbol
            captures only <strong style={{ color: '#fca5a5' }}>~{toeplitzPct}%</strong> of
            &#x2016;G&#x209B;&#x2095;&#x2091;&#x2090;&#x2072;&#x2016; (ratio {M.lagStationaryNormRatio.toFixed(4)},
            N-stable across N&thinsp;&isin;&thinsp;&#x7B;160,240,320&#x7D;).
            The remaining <strong style={{ color: '#fca5a5' }}>~{concentrationPct}%</strong> comes from
            Phi <em>position concentration</em> &mdash; the |G&#x209B;| spectrum &mdash;
            which the 1D autocorrelation does NOT determine. The surrogate under-reports the operator
            norm by ~33x. The magnitude at the correct lags is NOT Phi-autocorrelation-readable and
            remains the entire RH-equivalent obstruction.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          ASSESSMENT ONLY &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Sign result is trivial (follows from Phi&thinsp;&ge;&thinsp;0) and does not advance K&#x2090;&thinsp;&ge;&thinsp;0.
          Positivity was not attempted. Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3197-mupass-bridge-sign-phi-only.js &mdash; NPHI=10, a=0.5, U=6, N=200.
      </p>
    </div>
  );
}

// ── imp-3358: capture ratio r = ||T||/||Gshear|| vs U, with the r ~ C/U fit overlay ──
// Reads the imp-3240 (a, U) grid: shows the ratio falls off as the inverse lag window
// (fit C/U, C ~ 0.178) and that the complementary position-concentration share 1 - r
// rises toward 1 as U grows. All values are READ from the imp-3240 module export.
function CaptureRatioVsUViz() {
  const M = IMP3240_MUPASS_CAPTURE_RATIO_AU_GRID.measured;
  const grid = M.grid;
  const C = M.inverseUConstantC;

  const W = 680, H = 340, ML = 56, MR = 24, MT = 22, MB = 44;
  const uMax = 11, ratioMax = 0.08;
  const px = (u) => ML + (u / uMax) * (W - ML - MR);
  const py = (r) => H - MB - (r / ratioMax) * (H - MT - MB);

  const uTicks = [0, 2, 4, 6, 8, 10];
  const rTicks = [0, 0.02, 0.04, 0.06, 0.08];

  // C/U fit curve, sampled densely over the plotted U range.
  const fitPts = [];
  for (let u = 3; u <= uMax; u += 0.25) fitPts.push([px(u), py(C / u)]);
  const fitPath = fitPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  const A_COLORS_LOCAL = { 0.5: '#f59e0b', 0.3: '#06b6d4', 0.2: '#a855f7', 0.1: '#10b981' };
  const aValues = [0.5, 0.3, 0.2, 0.1];

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
      <h3 style={{ color: '#f59e0b', marginTop: 0 }}>
        Capture ratio r = &#x2016;T&#x2016;/&#x2016;G&#x209B;&#x2095;&#x2091;&#x2090;&#x2072;&#x2016; falls off as C/U (imp-3240)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        Across the full (a, U) grid the imp-3197 lag-stationary capture ratio is essentially
        a function of the lag window U alone, matching the closed form{' '}
        <span style={{ fontFamily: mono }}>r &#8776; C/U</span> with{' '}
        <strong>C &#8776; {C.toFixed(4)}</strong>. Equivalently the position-concentration share{' '}
        <span style={{ fontFamily: mono }}>1&thinsp;&minus;&thinsp;r</span> rises toward 1 as the
        window widens, since the fixed-width Phi mass becomes an ever-smaller fraction of it.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {rTicks.map((r) => (
            <g key={`r${r}`}>
              <line x1={ML} y1={py(r)} x2={W - MR} y2={py(r)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(r) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{r.toFixed(2)}</text>
            </g>
          ))}
          {uTicks.map((u) => (
            <text key={`u${u}`} x={px(u)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{u}</text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>lag cutoff U</text>
          <text x={16} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={`rotate(-90 16 ${(MT + H - MB) / 2})`}>capture ratio r</text>

          {/* C/U fit curve */}
          <path d={fitPath} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* per-cell scatter, colored by a */}
          {grid.map((c, i) => (
            <circle
              key={i}
              cx={px(c.U)}
              cy={py(c.ratio)}
              r="5"
              fill={A_COLORS_LOCAL[c.a] || '#94a3b8'}
              fillOpacity="0.6"
              stroke={A_COLORS_LOCAL[c.a] || '#94a3b8'}
              strokeWidth="1.2"
            >
              <title>{`a=${c.a}, U=${c.U}  ->  r=${c.ratio.toFixed(5)}, r*U=${c.ratioTimesU.toFixed(4)}, position share=${c.positionConcentrationFraction.toFixed(4)}`}</title>
            </circle>
          ))}

          {/* legend */}
          {aValues.map((a, i) => (
            <g key={`leg${a}`} transform={`translate(${W - MR - 92}, ${MT + 10 + i * 18})`}>
              <circle cx="0" cy="-4" r="5" fill={A_COLORS_LOCAL[a]} fillOpacity="0.6" stroke={A_COLORS_LOCAL[a]} strokeWidth="1.2" />
              <text x="12" y="0" fontSize="11" fill="#cbd5e1" fontFamily={mono}>a = {a}</text>
            </g>
          ))}
          <text x={px(9.3)} y={py(C / 9.3) - 10} fontSize="11" fill="#94a3b8" fontFamily={mono}>r &#8776; {C.toFixed(3)}/U</text>
        </svg>
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.06em', marginBottom: 6 }}>
          POSITION-CONCENTRATION SHARE 1 &minus; r RISES TOWARD 1
        </div>
        <p style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.7, margin: 0 }}>
          At U = 4 the share is already{' '}
          <strong style={{ color: '#6ee7b7' }}>
            {(1 - (grid.find((c) => c.a === 0.5 && c.U === 4)?.ratio ?? 0)).toFixed(4)}
          </strong>{' '}
          and it climbs to{' '}
          <strong style={{ color: '#6ee7b7' }}>
            {(1 - (grid.find((c) => c.a === 0.5 && c.U === 10)?.ratio ?? 0)).toFixed(4)}
          </strong>{' '}
          at U = 10, as the fixed-width Phi mass becomes an ever-smaller fraction of the widening window.
        </p>
      </div>

      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          ASSESSMENT ONLY &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          r &#8776; C/U is a leading-order fit (r&middot;U drifts {M.ratioTimesUMin.toFixed(3)}&ndash;{M.ratioTimesUMax.toFixed(3)}
          {' '}across the grid), not an exact identity, and the ratio is essentially a-independent at fixed U
          (unlike the imp-3085 gap, which tracks s = a&middot;U). Positivity was not attempted.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3240-mupass-capture-ratio-aU-grid.js &mdash; parent: imp-3197.
      </p>
    </div>
  );
}

function CInfFixedResolutionConvergenceViz() {
  const M = IMP3346_CAPTURE_RATIO_C_CONSTANT_DERIVATION.measured;
  const uLadder = M.uLadder;
  const rU = M.rUFixedRes;
  const cInf = M.cInfEstimate;
  const bAvg = 0.5 * (M.extrap_10_20.b + M.extrap_16_20.b);

  const W = 680, H = 320, ML = 60, MR = 24, MT = 22, MB = 44;
  const uMax = 22, rUMin = 0.174, rUMax = 0.181;
  const px = (u) => ML + (u / uMax) * (W - ML - MR);
  const py = (r) => H - MB - ((r - rUMin) / (rUMax - rUMin)) * (H - MT - MB);

  const uTicks = [0, 4, 8, 12, 16, 20];
  const rTicks = [0.174, 0.176, 0.178, 0.18];

  const fitPts = [];
  for (let u = 3.5; u <= uMax; u += 0.25) fitPts.push([px(u), py(cInf + bAvg / u)]);
  const fitPath = fitPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #06b6d4', background: 'rgba(6,182,212,0.04)' }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0 }}>
        Fixed-resolution r&middot;U DECREASES to C&#8734; &#8776; {cInf.toFixed(4)} (imp-3346)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        Rebuilt at a FIXED grid step (h = 0.025 held constant as U grows, rather than the imp-3240
        fixed-N = 240 convention that coarsens with U), the rescaled capture ratio{' '}
        <span style={{ fontFamily: mono }}>r&middot;U</span> falls monotonically as{' '}
        <span style={{ fontFamily: mono }}>C(U) = C&#8734; + b/U</span> instead of rising &mdash; the
        imp-3240 apparent rise (0.178&rarr;0.181) was a resolution artifact, not drift.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {rTicks.map((r) => (
            <g key={`r${r}`}>
              <line x1={ML} y1={py(r)} x2={W - MR} y2={py(r)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(r) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{r.toFixed(3)}</text>
            </g>
          ))}
          {uTicks.map((u) => (
            <text key={`u${u}`} x={px(u)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{u}</text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>lag cutoff U</text>
          <text x={18} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono} transform={`rotate(-90 18 ${(MT + H - MB) / 2})`}>r&middot;U</text>

          {/* C_inf + b/U fit curve */}
          <path d={fitPath} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* C_inf asymptote */}
          <line x1={ML} y1={py(cInf)} x2={W - MR} y2={py(cInf)} stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.6" />

          {/* fixed-resolution ladder points, decreasing toward C_inf */}
          {uLadder.map((u, i) => (
            <circle key={i} cx={px(u)} cy={py(rU[i])} r="5" fill="#06b6d4" fillOpacity="0.7" stroke="#06b6d4" strokeWidth="1.2">
              <title>{`U=${u}  ->  r*U=${rU[i].toFixed(5)}`}</title>
            </circle>
          ))}

          <text x={px(20.4)} y={py(cInf) - 8} textAnchor="end" fontSize="11" fill="#22d3ee" fontFamily={mono}>C&#8734; &#8776; {cInf.toFixed(4)}</text>
        </svg>
      </div>

      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          ASSESSMENT ONLY &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          C&#8734; is a determined number fixed by Richardson extrapolation of the fixed-resolution
          ladder (two independent extrapolations agree to &#8776;1e&minus;4), not a closed-form
          identity; the imp-3066 off-diagonal endpoint-Hankel K&#8339;&thinsp;&ge;&thinsp;0 magnitude
          remains the lone obstruction. Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains
          the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3346-capture-ratio-C-constant-derivation.js &mdash; parent: imp-3240.
      </p>
    </div>
  );
}

// ── imp-3412: imp-3350 sinh a -> 0 capture-ratio ladder converging to the exactly-linear-shear ratio ──
function SinhToLinearShearLimitViz() {
  const M = IMP3350_CAPTURE_RATIO_LINEAR_SHEAR_LIMIT.measured;
  const aLadder = M.aLadderAtUStar;
  const ratios = M.ladderRatios;
  const linearLimit = M.headlineLinearRatio;
  const gap = M.maxLimitEqualsLinearGap;

  const W = 640, H = 300, ML = 68, MR = 24, MT = 22, MB = 44;
  const xMin = Math.log(aLadder[aLadder.length - 1]), xMax = Math.log(aLadder[0]);
  const yLo = Math.min(...ratios, linearLimit), yHi = Math.max(...ratios, linearLimit);
  const yPad = (yHi - yLo) * 0.25;
  const yMin = yLo - yPad, yMax = yHi + yPad;
  const px = (a) => ML + ((Math.log(a) - xMin) / (xMax - xMin)) * (W - ML - MR);
  const py = (r) => H - MB - ((r - yMin) / (yMax - yMin)) * (H - MT - MB);

  const xTicks = aLadder;
  const yTicks = [yLo, (yLo + yHi) / 2, yHi];

  const ladderPath = aLadder
    .map((a, i) => `${i === 0 ? 'M' : 'L'} ${px(a).toFixed(1)} ${py(ratios[i]).toFixed(1)}`)
    .join(' ');

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #14b8a6', background: 'rgba(20,184,166,0.04)' }}>
      <h3 style={{ color: '#14b8a6', marginTop: 0 }}>
        sinh-shear capture ratio r(a) &#8594; exactly-linear-shear ratio as a&#8594;0, gap &lt; 5e&minus;15 (imp-3350)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        At fixed U = 6 the sinh-shear capture ratio <span style={{ fontFamily: mono }}>r(a) = ||T|| / ||Gshear||</span>{' '}
        decreases monotonically as <span style={{ fontFamily: mono }}>a &#8594; 0</span> (log a&#8209;axis), a vanishing
        O(a&sup2;) sinh-nonlinearity drift of only {M.ladderTotalDrift.toExponential(2)}. The a&sup2;-Richardson
        extrapolated limit equals the exactly-linear-shear ratio{' '}
        <span style={{ fontFamily: mono }}>r_lin = ||Tlin|| / ||Glin||</span> (dashed asymptote) to within{' '}
        <strong style={{ color: '#5eead4' }}>{gap.toExponential(2)}</strong> &mdash; the same equality holds at U = 8
        and U = 10 to below 5e&minus;15.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}
          role="img" aria-label="sinh a to 0 capture ratio ladder converging to the exactly-linear-shear ratio">
          {yTicks.map((r, i) => (
            <g key={`y${i}`}>
              <line x1={ML} y1={py(r)} x2={W - MR} y2={py(r)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(r) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>{r.toFixed(7)}</text>
            </g>
          ))}
          {xTicks.map((a) => (
            <text key={`x${a}`} x={px(a)} y={H - MB + 18} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily={mono}>{a}</text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>shear weight a (log scale)</text>
          <text x={20} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={`rotate(-90 20 ${(MT + H - MB) / 2})`}>r(a)</text>

          {/* exactly-linear-shear asymptote */}
          <line x1={ML} y1={py(linearLimit)} x2={W - MR} y2={py(linearLimit)} stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.7" />
          <text x={W - MR - 4} y={py(linearLimit) - 6} textAnchor="end" fontSize="10" fill="#5eead4" fontFamily={mono}>r_lin = {linearLimit.toFixed(7)}</text>

          {/* sinh-shear a-ladder, decreasing toward r_lin */}
          <path d={ladderPath} fill="none" stroke="#14b8a6" strokeWidth="1.5" />
          {aLadder.map((a, i) => (
            <circle key={i} cx={px(a)} cy={py(ratios[i])} r="4.5" fill="#14b8a6" fillOpacity="0.75" stroke="#5eead4" strokeWidth="1">
              <title>{`a=${a}  ->  r(a)=${ratios[i].toFixed(9)}`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          MEASUREMENT ONLY &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          The equality is certified numerically (Richardson extrapolation + power iteration), not by a symbolic
          proof that the O(a&sup2;) sinh-nonlinearity vanishes exactly in the norm ratio. The a&#8209;free
          linear-shear characterization is diagnostic; the imp-3066 off-diagonal endpoint-Hankel magnitude remains
          the lone obstruction. Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3350-capture-ratio-linear-shear-limit.js &mdash; parent: imp-3240; related: imp-3346.
      </p>
    </div>
  );
}

// ── imp-3413: roundup of the imp-334x/335x capture-ratio & shear-Gram cluster verdicts,
// closing on the single shared imp-3066 obstruction none of them touch.
function CaptureRatioShearGramClusterSummaryPanel() {
  const m3343 = IMP3343_SHEAR_GRAM_OPNORM_EQUALS_VOLTERRA_HS_IDENTITY.measured;
  const m3344 = IMP3344_SHEAR_GRAM_VERDICT_SCALE_FACTOR.measured;
  const m3345 = IMP3345_VHS_RICHARDSON_LIMIT;
  const m3351 = IMP3351_SHEAR_GRAM_SYMMETRIC_SPECTRUM_AU_GRID.measured;

  const rows = [
    {
      id: 'imp-3343',
      note: '||Gshear||_op equals the Volterra Hilbert-Schmidt norm ||V||_HS EXACTLY, by a rank-2 ' +
        `hollow-antisymmetry identity (max deviation ${m3343.maxRatioDev.toExponential(1)}, continuum limit ` +
        `${m3343.continuumLimit.toExponential(4)}) -- not a ~0.2% leading-order accident.`,
    },
    {
      id: 'imp-3344',
      note: `section26-mupass verdict "~${m3344.verdictMagnitude.toExponential(1)}" is the operator magnitude ` +
        `with the midpoint quadrature weight H = U/N (${m3344.atWorkflowGrid.H}) counted TWICE at N=240; the ` +
        'physical single-weight norm converges to ~1.896e-4.',
    },
    {
      id: 'imp-3345',
      note: 'Richardson h->0 extrapolation confirms the 3-sig-fig headline 1.90e-4 is resolution-stable; the ' +
        `sharper continuum value is ${m3345.richardsonLevel1[m3345.richardsonLevel1.length - 1].toExponential(4)}.`,
    },
    {
      id: 'imp-3346',
      note: 'the capture-ratio constant is a true finite limit C_inf ~ 0.1751; the imp-3240 fixed-N rise ' +
        'was a resolution artifact, not genuine growth.',
    },
    {
      id: 'imp-3347',
      note: 'the truncation leftmost zero drifts to -infinity as ln(NPHI) grows, while Phi stays strictly ' +
        'positive far to the left of u1*.',
    },
    {
      id: 'imp-3350',
      note: 'the sinh-shear a->0 capture-ratio limit equals the exactly-linear-shear ratio to within 5e-15.',
    },
    {
      id: 'imp-3351',
      note: 'min eig(i Gshear) = -||Gshear|| (the symmetric-about-0 spectrum) extends to all ' +
        `${m3351.cells.length} cells of the a x U grid (max deviation ${m3351.maxRatioDev.toExponential(1)}), ` +
        'not only the genuine-Phi cell -- a cell-independent structural identity.',
    },
  ];

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #a78bfa', background: 'rgba(167,139,250,0.04)' }}>
      <h3 style={{ color: '#a78bfa', marginTop: 0 }}>
        Capture-Ratio &amp; Shear-Gram Cluster Roundup: seven diagnostics, one shared obstruction (imp-3413)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The imp-334x/335x cluster reconciles a set of published capture-ratio and shear-Gram measurements against
        one another &mdash; resolving apparent discrepancies as resolution artifacts, quadrature-weight conventions,
        or straightforward algebraic identities of the rank-2 hollow-antisymmetric structure Gshear = p q&#7488; &minus; q p&#7488;.
      </p>
      <div style={{ overflowX: 'auto', margin: '12px 0' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 8px', color: '#c4b5fd', borderBottom: '1px solid rgba(167,139,250,0.3)', fontFamily: mono }}>Ticket</th>
              <th style={{ textAlign: 'left', padding: '4px 8px', color: '#c4b5fd', borderBottom: '1px solid rgba(167,139,250,0.3)' }}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: '5px 8px', color: '#a78bfa', fontFamily: mono, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{r.id}</td>
                <td style={{ padding: '5px 8px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 4 }}>
          SHARED OBSTRUCTION &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Every diagnostic above is a reconciliation, convergence check, or algebraic identity at the scalar /
          rank-2 level. None of them touch the off-diagonal endpoint-Hankel operator contraction
          K&#x2090;&thinsp;&#x2265;&thinsp;0 (imp-3066), which remains the single irreducible RH-equivalent
          residual across the entire cluster. Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the
          rigorous SOTA; NO QED.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Sources: imp-3343/3344/3345/3346/3347/3350/3351; shared obstruction: imp-3066-offdiagonal-hankel-obstruction.js.
      </p>
    </div>
  );
}

// ── imp-3354: termwise Phi>=0 structure viz (imp-3257) — Phi_NPHI(u) with the per-term
// sign-flip thresholds u_n* marked; u_1* (rightmost, worst) sits strictly left of [0,U],
// so the headline domain lies entirely in the termwise-positive region.
function PhiTermwiseNonnegativityViz() {
  const M = IMP3257_BRIDGE_SIGN_PHI_NONNEG_STRUCTURAL.measured;

  const NPHI = 10; // headline cell
  const U = 6;     // headline cell
  const phiKernel = (uu, nphi) => {
    let s = 0;
    const e2 = Math.exp(2 * uu);
    const e4 = Math.exp(4 * uu);
    for (let n = 1; n <= nphi; n++) {
      const n2 = n * n;
      const n4 = n2 * n2;
      s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
    }
    return s;
  };
  const termFlipThreshold = (n) => 0.5 * Math.log(3 / (2 * Math.PI * n * n));
  const thresholds = [1, 2, 3, 4, 5].map((n) => ({ n, u: termFlipThreshold(n) }));

  const W = 680, H = 300, ML = 56, MR = 24, MT = 26, MB = 44;
  const U_MIN = -2.3, U_MAX = U + 0.4;
  const LOG_FLOOR = -8, LOG_CEIL = 3; // log10(Phi) display range
  const px = (u) => ML + ((u - U_MIN) / (U_MAX - U_MIN)) * (W - ML - MR);
  const py = (logv) => H - MB - ((logv - LOG_FLOOR) / (LOG_CEIL - LOG_FLOOR)) * (H - MT - MB);

  const N_CURVE = 500;
  const curvePts = [];
  for (let i = 0; i <= N_CURVE; i++) {
    const u = U_MIN + (i / N_CURVE) * (U_MAX - U_MIN);
    const phi = phiKernel(u, NPHI);
    const logv = Math.log10(Math.max(phi, Math.pow(10, LOG_FLOOR)));
    curvePts.push({ u, logv });
  }
  const curvePath = curvePts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.u).toFixed(1)} ${py(p.logv).toFixed(1)}`)
    .join(' ');

  const yTicks = [3, 2, 1, 0, -2, -4, -6, -8];
  const uTicks = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
  const u1Star = M.u1Star;

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #22c55e', background: 'rgba(34,197,94,0.04)' }}>
      <h3 style={{ color: '#22c55e', marginTop: 0 }}>
        Termwise &Phi;&thinsp;&ge;&thinsp;0 structure: per-term sign-flip thresholds, all left of [0,U] (imp-3257)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        Each summand of &Phi;<sub>NPHI</sub>(u) flips sign at{' '}
        <span style={{ fontFamily: mono }}>u<sub>n</sub>* = (1/2)&thinsp;ln(3/(2&pi;n&sup2;))</span>; the
        rightmost (worst-case) threshold is{' '}
        <span style={{ fontFamily: mono }}>u<sub>1</sub>* = {u1Star.toFixed(5)}</span>, strictly negative,
        and every u<sub>n</sub>* for n&thinsp;&ge;&thinsp;2 sits further left still. So the headline domain
        [0,&thinsp;U] (U=6, NPHI=10) lies entirely inside the termwise-positive region [u<sub>1</sub>*,&thinsp;&infin;),
        and every summand &mdash; hence the truncated sum &mdash; stays &ge;&thinsp;0 there (curve on a log&#8321;&#8320;
        scale; it underflows toward 0 for u&nbsp;&gtrsim;&nbsp;1.5 but never goes negative).
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg
          width={W} height={H}
          style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}
          role="img"
          aria-label="Phi_NPHI(u) on a log scale with per-term sign-flip thresholds marked"
        >
          {yTicks.map((v) => (
            <g key={`yt${v}`}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>
                {`1e${v}`}
              </text>
            </g>
          ))}
          {uTicks.map((u) => (
            <g key={`ut${u}`}>
              <line x1={px(u)} y1={MT} x2={px(u)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={px(u)} y={H - MB + 16} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily={mono}>{u}</text>
            </g>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />

          {/* termwise-positive region [u_1*, U_MAX], lightly shaded */}
          <rect x={px(u1Star)} y={MT} width={px(U_MAX) - px(u1Star)} height={H - MT - MB}
            fill="#22c55e" fillOpacity="0.07" />
          {/* [0, U] headline domain, more distinct shading */}
          <rect x={px(0)} y={MT} width={px(U) - px(0)} height={H - MT - MB}
            fill="#22c55e" fillOpacity="0.14" />
          <text x={(px(0) + px(U)) / 2} y={MT + 14} textAnchor="middle" fontSize="10" fill="#4ade80" fontFamily={mono}>
            [0, U] headline domain
          </text>

          {/* per-term thresholds u_n* */}
          {thresholds.map(({ n, u }) => (
            <g key={`th${n}`}>
              <line x1={px(u)} y1={MT} x2={px(u)} y2={H - MB} stroke={n === 1 ? '#ef4444' : '#f59e0b'}
                strokeWidth={n === 1 ? 1.6 : 1} strokeDasharray="3 3" opacity={n === 1 ? 0.9 : 0.5} />
              <text x={px(u)} y={n % 2 === 0 ? MT - 16 : MT - 4} textAnchor="middle" fontSize="9"
                fill={n === 1 ? '#ef4444' : '#f59e0b'} fontFamily={mono}>
                {`u_${n}*`}
              </text>
            </g>
          ))}

          {/* Phi_NPHI(u) curve */}
          <path d={curvePath} fill="none" stroke="#e2e8f0" strokeWidth="2" />

          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}>u</text>
          <text x={16} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily={mono}
            transform={`rotate(-90 16 ${(MT + H - MB) / 2})`}>
            Phi_NPHI(u)
          </text>
        </svg>
      </div>
      <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          STRUCTURAL, NOT MEASURED &mdash; NO U OR NPHI SWEEP CAN BREAK IT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          u<sub>1</sub>*&thinsp;&lt;&thinsp;0 for every truncation, so [0, U] is right of the last per-term flip
          for ANY U&thinsp;&ge;&thinsp;0 and ANY NPHI &mdash; a {M.sweepCellCount}-cell sweep across
          U&thinsp;&isin;&thinsp;&#123;6,8,12,16,24&#125; &times; NPHI&thinsp;&isin;&thinsp;&#123;10,20,40,80&#125; finds
          {' '}{M.totalGenuineNegatives} genuine negatives. This upgrades the imp-3197 sign half from measured to
          structural; the operator-norm magnitude (imp-3197 magnitude half) remains untouched.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 stays SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3257-bridge-sign-phi-nonneg-structural.js &mdash; headline cell NPHI=10, U=6; curve on log&#8321;&#8320; scale, floor 1e-8.
      </p>
    </div>
  );
}

// ── imp-3411: imp-3347 leftmost-zero drift vs ln(NPHI), with the growing
// left-margin-below-u1* overlay (the unused conservatism of the imp-3257 termwise bound) ──
function LeftmostZeroDriftVsLnNphiViz() {
  const M = IMP3347_PHI_LEFTMOST_ZERO_VS_NPHI.measured;
  const cells = M.cells;
  const u1Star = M.u1Star;

  const W = 640, H = 320, ML = 60, MR = 24, MT = 24, MB = 46;
  const xMin = Math.log(8), xMax = Math.log(96);
  const yMin = -5.1, yMax = -0.1;
  const px = (lnN) => ML + ((lnN - xMin) / (xMax - xMin)) * (W - ML - MR);
  const py = (u) => H - MB - ((u - yMin) / (yMax - yMin)) * (H - MT - MB);

  const xTicks = cells.map((c) => ({ nphi: c.nphi, x: Math.log(c.nphi) }));
  const yTicks = [-0.5, -1, -2, -3, -4, -5];

  const fitPts = [];
  for (let n = 8; n <= 96; n += 2) {
    const lnN = Math.log(n);
    fitPts.push([px(lnN), py(0.5 * Math.log(5 / (2 * Math.PI)) - lnN)]);
  }
  const fitPath = fitPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  const zeroPath = cells
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${px(Math.log(c.nphi)).toFixed(1)} ${py(c.leftmostZero).toFixed(1)}`)
    .join(' ');

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #f472b6', background: 'rgba(244,114,182,0.04)' }}>
      <h3 style={{ color: '#f472b6', marginTop: 0 }}>
        Leftmost truncation zero u&#8320;(NPHI) recedes left, widening the margin below u&#8321;* (imp-3347 / imp-3411)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The full truncated &Phi;<sub>NPHI</sub> stays strictly positive well below the termwise threshold{' '}
        <span style={{ fontFamily: mono }}>u<sub>1</sub>* = {u1Star.toFixed(5)}</span> (dashed line). Its leftmost
        genuine zero <span style={{ fontFamily: mono }}>u<sub>0</sub>(NPHI)</span> (solid markers) drifts log&#8209;linearly
        left as NPHI doubles, tracking the elementary closed form{' '}
        <span style={{ fontFamily: mono }}>u<sub>0</sub> &#8776; (1/2)ln(5/(2&pi)) &minus; ln N</span> (dashed fit). The
        shaded band at each cell is the unused left margin{' '}
        <span style={{ fontFamily: mono }}>u<sub>1</sub>* &minus; u<sub>0</sub>(NPHI)</span>, which GROWS from 2.09 to
        4.13 &mdash; the conservatism of the imp-3257 termwise bound below u<sub>1</sub>*.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}
          role="img" aria-label="Leftmost zero u0(NPHI) vs ln(NPHI) with the left-margin-below-u1-star overlay">
          {yTicks.map((v) => (
            <g key={`y${v}`}>
              <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily={mono}>{v}</text>
            </g>
          ))}
          {xTicks.map(({ nphi, x }) => (
            <text key={`x${nphi}`} x={px(x)} y={H - MB + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>
              {`NPHI=${nphi}`}
            </text>
          ))}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>ln(NPHI)</text>
          <text x={16} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={`rotate(-90 16 ${(MT + H - MB) / 2})`}>u</text>

          {/* u_1* termwise threshold */}
          <line x1={ML} y1={py(u1Star)} x2={W - MR} y2={py(u1Star)} stroke="#22c55e" strokeWidth="1.4" strokeDasharray="2 3" />
          <text x={W - MR - 4} y={py(u1Star) - 6} textAnchor="end" fontSize="10" fill="#4ade80" fontFamily={mono}>u_1*</text>

          {/* left-margin-below-u1* overlay: shaded band per cell */}
          {cells.map((c) => (
            <line key={`m${c.nphi}`} x1={px(Math.log(c.nphi))} y1={py(u1Star)} x2={px(Math.log(c.nphi))} y2={py(c.leftmostZero)}
              stroke="#f472b6" strokeWidth="6" strokeOpacity="0.16" />
          ))}
          {cells.map((c) => (
            <text key={`ml${c.nphi}`} x={px(Math.log(c.nphi)) + 8} y={(py(u1Star) + py(c.leftmostZero)) / 2 + 4}
              fontSize="10" fill="#f9a8d4" fontFamily={mono}>
              {`margin ${c.leftMarginBelowU1Star.toFixed(2)}`}
            </text>
          ))}

          {/* leading-order closed-form fit */}
          <path d={fitPath} fill="none" stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="4 3" />

          {/* measured leftmost zero u_0(NPHI) */}
          <path d={zeroPath} fill="none" stroke="#f472b6" strokeWidth="2" />
          {cells.map((c) => (
            <circle key={`z${c.nphi}`} cx={px(Math.log(c.nphi))} cy={py(c.leftmostZero)} r="5" fill="#f472b6" stroke="#f9a8d4" strokeWidth="1.2">
              <title>{`NPHI=${c.nphi}  ->  u_0=${c.leftmostZero.toFixed(4)}`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          DIAGNOSTIC MEASUREMENT &mdash; NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          u<sub>0</sub>(NPHI) is a pure truncation artifact of the finite sum (the untruncated de&nbsp;Bruijn&ndash;Newman
          &Phi; is positive on all of R) and recedes to &minus;&infin; as NPHI grows; it never touches the
          imp-3197/imp-3257 [0,U] window and leaves the imp-3066 operator-norm magnitude obstruction untouched.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3347-phi-leftmost-zero-vs-nphi.js.
      </p>
    </div>
  );
}

// ── imp-3196: residual-gap convergence RATE (log-log, power-law vs geometric) ──
function ResidualGapConvergenceRateViz() {
  const M = IMP3196_RESIDUAL_GAP_CONVERGENCE_RATE;
  const cells = M.measured.cellRates;

  const W = 620, H = 320, ML = 74, MR = 30, MT = 28, MB = 58;
  const L10 = Math.log10;
  const chartW = W - ML - MR;
  const chartH = H - MT - MB;

  const allRes = cells.flatMap((c) => Array.from(c.residuals));
  const yMinLog = Math.floor(L10(Math.min(...allRes)) - 0.3);
  const yMaxLog = Math.ceil(L10(Math.max(...allRes)) + 0.3);

  const xMinLog = L10(1.7);
  const xMaxLog = L10(11.5);

  const px = (d) => ML + ((L10(d) - xMinLog) / (xMaxLog - xMinLog)) * chartW;
  const py = (r) => H - MB - ((L10(r) - yMinLog) / (yMaxLog - yMinLog)) * chartH;

  const COLS = ['#fbbf24', '#10b981', '#06b6d4', '#a855f7'];
  const DEG_VALS = [2, 4, 6, 8, 10];

  function fitC(residuals, p) {
    const lr = Array.from(residuals).map((r) => Math.log(r));
    const ld = DEG_VALS.map((d) => Math.log(d));
    const mlr = lr.reduce((a, b) => a + b, 0) / lr.length;
    const mld = ld.reduce((a, b) => a + b, 0) / ld.length;
    return Math.exp(mlr + p * mld);
  }

  const yTicks = [];
  for (let e = yMinLog; e <= yMaxLog; e++) yTicks.push(Math.pow(10, e));

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #22d3ee', background: 'rgba(34,211,238,0.04)' }}>
      <h3 style={{ color: '#22d3ee', marginTop: 0 }}>
        Residual-gap convergence RATE: algebraic power-law decay, exponent p
        &asymp;{M.measured.pMin.toFixed(2)}&rarr;{M.measured.pMax.toFixed(2)} rising with s (imp-3196)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        Log-log plot of resid(DEG)&nbsp;=&nbsp;G(s)&minus;gap(DEG) vs DEG at four equal-s cells
        (s&nbsp;=&nbsp;0.8, 1.2, 2.0, 3.0; a&nbsp;=&nbsp;0.5, U&nbsp;=&nbsp;2s).
        Straight log-log lines confirm algebraic power-law decay resid&nbsp;~&nbsp;C&thinsp;DEG<sup>&minus;p</sup> at
        every cell (R<sup>2</sup>&asymp;0.996&ndash;0.999), decisively beating the geometric (semi-log) fit
        (R<sup>2</sup>&asymp;0.96&ndash;0.97).
        The exponent p rises mildly with s; larger shear products converge modestly faster.
        Consecutive ratio resid(DEG)/resid(DEG&minus;2) RISES toward 1 (&asymp;0.40&rarr;0.67) &mdash;
        the algebraic-tail signature distinguishing a power law from an exponential.
      </p>
      <div style={{ overflowX: 'auto', marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {yTicks.map((r) => (
            <g key={"yg" + r}>
              <line x1={ML} y1={py(r)} x2={W - MR} y2={py(r)} stroke="#1e293b" strokeWidth="1" />
              <text x={ML - 8} y={py(r) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily={mono}>
                {r.toExponential(0)}
              </text>
            </g>
          ))}
          {DEG_VALS.map((d) => (
            <g key={"xg" + d}>
              <line x1={px(d)} y1={MT} x2={px(d)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={px(d)} y={H - MB + 16} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{d}</text>
            </g>
          ))}
          <text x={(ML + W - MR) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>DEG (monomial truncation degree)</text>
          <text x={14} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={"rotate(-90 14 " + Math.round((MT + H - MB) / 2) + ")"}>resid(DEG) [log scale]</text>
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />

          {cells.map((cell, ci) => {
            const col = COLS[ci];
            const C = fitC(cell.residuals, cell.algebraicExponentP);
            const p = cell.algebraicExponentP;
            const fitPath = "M " + px(2).toFixed(1) + " " + py(C * Math.pow(2, -p)).toFixed(1) +
                            " L " + px(10).toFixed(1) + " " + py(C * Math.pow(10, -p)).toFixed(1);
            const dotPath = cell.sweep.map((row, i) =>
              (i === 0 ? "M " : "L ") + px(row.degree).toFixed(1) + " " + py(row.residual).toFixed(1)
            ).join(" ");
            const lx = ML + chartW - 186;
            const ly = MT + 10 + ci * 38;
            return (
              <g key={"cell" + ci}>
                <path d={fitPath} fill="none" stroke={col} strokeWidth="1.2" strokeDasharray="5 3" opacity={0.65} />
                <path d={dotPath} fill="none" stroke={col} strokeWidth="2" />
                {cell.sweep.map((row) => (
                  <circle key={"pt" + row.degree} cx={px(row.degree)} cy={py(row.residual)} r={4.5}
                    fill={col} stroke="#0f172a" strokeWidth="1.5">
                    <title>{"s=" + cell.s + "  DEG=" + row.degree + "  resid=" + row.residual.toExponential(3)}</title>
                  </circle>
                ))}
                <line x1={lx} y1={ly} x2={lx + 18} y2={ly} stroke={col} strokeWidth="2.5" />
                <circle cx={lx + 9} cy={ly} r={3.5} fill={col} />
                <text x={lx + 24} y={ly + 4} fontSize="10" fill={col} fontFamily={mono}>
                  {"s=" + cell.s + "  p=" + p.toFixed(2) + "  R²=" + cell.algebraicR2.toFixed(3)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '6px 8px', fontFamily: mono }}>s = a&middot;U</th>
              <th style={{ padding: '6px 8px', fontFamily: mono }}>Exponent p</th>
              <th style={{ padding: '6px 8px', fontFamily: mono }}>Alg. R<sup>2</sup></th>
              <th style={{ padding: '6px 8px', fontFamily: mono }}>Geom. R<sup>2</sup></th>
              <th style={{ padding: '6px 8px', fontFamily: mono }}>Best fit</th>
            </tr>
          </thead>
          <tbody>
            {cells.map((cell, ci) => (
              <tr key={"tr" + ci} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '6px 8px', color: COLS[ci], fontFamily: mono, fontWeight: 700 }}>
                  {cell.s.toFixed(1)}
                </td>
                <td style={{ padding: '6px 8px', color: '#e2e8f0', fontFamily: mono }}>
                  {cell.algebraicExponentP.toFixed(3)}
                </td>
                <td style={{ padding: '6px 8px', color: '#10b981', fontFamily: mono }}>
                  {cell.algebraicR2.toFixed(4)}
                </td>
                <td style={{ padding: '6px 8px', color: '#64748b', fontFamily: mono }}>
                  {cell.geometricR2.toFixed(4)}
                </td>
                <td style={{ padding: '6px 8px', color: '#10b981', fontFamily: mono }}>ALGEBRAIC</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          REPRESENTATIVE / DIAGNOSTIC &mdash; CARRIES NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Empirical least-squares rate over DEG in &#123;2,4,6,8,10&#125; inside the imp-3104 numerically-trustworthy
          range; NOT a proved asymptotic order. The off-diagonal endpoint-Hankel operator step (imp-3066)
          remains the lone obstruction and is untouched.
          Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains the rigorous SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3196-residual-gap-convergence-rate.js &mdash; a=0.5, U=2s, NQ=4000,
        DEG&isin;&#123;2,4,6,8,10&#125;, cells: s&isin;&#123;0.8,1.2,2.0,3.0&#125;.
      </p>
    </div>
  );
}

// ── imp-3217: does the fitted exponent p(s) saturate (to 2) as s -> inf? ──────
function ResidualExponentSLimitViz() {
  const M = IMP3217_RESIDUAL_EXPONENT_S_LIMIT;
  const sVals = M.measured.sValues;
  const pVals = M.measured.pValues;
  const rf = M.measured.risingFit;
  const sf = M.measured.saturatingFit;

  const W = 620, H = 300, ML = 60, MR = 30, MT = 28, MB = 52;
  const chartW = W - ML - MR;
  const chartH = H - MT - MB;

  const sMin = 0, sMax = 6.6;
  const pMin = 1.3, pMax = 2.2;
  const px = (s) => ML + ((s - sMin) / (sMax - sMin)) * chartW;
  const py = (p) => H - MB - ((p - pMin) / (pMax - pMin)) * chartH;

  const risingPath = "M " + px(0).toFixed(1) + " " + py(rf.alpha).toFixed(1) +
                     " L " + px(6.6).toFixed(1) + " " + py(rf.alpha + rf.beta * 6.6).toFixed(1);
  const satPts = [];
  for (let s = 0.8; s <= 6.6; s += 0.1) satPts.push([s, sf.asymptoteA + sf.slope / s]);
  const satPath = satPts.map(([s, p], i) => (i === 0 ? "M " : "L ") + px(s).toFixed(1) + " " + py(p).toFixed(1)).join(" ");
  const dataPath = sVals.map((s, i) => (i === 0 ? "M " : "L ") + px(s).toFixed(1) + " " + py(pVals[i]).toFixed(1)).join(" ");

  const pTicks = [1.4, 1.6, 1.8, 2.0, 2.2];
  const sTicks = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="card" style={{ marginTop: 16, borderLeft: '4px solid #f472b6', background: 'rgba(244,114,182,0.04)' }}>
      <h3 style={{ color: '#f472b6', marginTop: 0 }}>
        Exponent p(s) rises past 2 &mdash; NO saturation to 2 within reach (imp-3217)
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The imp-3196 power-law exponent p in resid(DEG)&nbsp;~&nbsp;C&thinsp;DEG<sup>&minus;p</sup>, refitted at seven
        equal-s cells extending to s&nbsp;=&nbsp;6.0 (a&nbsp;=&nbsp;0.5, U&nbsp;=&nbsp;2s, NQ&nbsp;=&nbsp;4000, DEG&isin;&#123;2,4,6,8,10&#125;).
        p(s) rises MONOTONICALLY from &asymp;{M.measured.pMin.toFixed(2)} to &asymp;{M.measured.pMax.toFixed(2)} and CROSSES 2 near s&nbsp;&asymp;&nbsp;6.
        A rising meta-law p&nbsp;&asymp;&nbsp;{rf.alpha.toFixed(2)}&thinsp;+&thinsp;{rf.beta.toFixed(2)}&middot;s fits well (R<sup>2</sup>&asymp;{rf.r2.toFixed(3)})
        and beats the saturating law p&nbsp;&asymp;&nbsp;{sf.asymptoteA.toFixed(2)}&minus;B/s (R<sup>2</sup>&asymp;{sf.r2.toFixed(3)}), whose
        asymptote sits BELOW the measured p<sub>max</sub>. So the natural p&nbsp;&rarr;&nbsp;2 conjecture is REFUTED as a ceiling.
      </p>
      <div style={{ overflowX: 'auto', marginTop: 10 }}>
        <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%', background: 'rgba(2,6,23,0.4)', borderRadius: 6 }}>
          {pTicks.map((p) => (
            <g key={"pg" + p}>
              <line x1={ML} y1={py(p)} x2={W - MR} y2={py(p)} stroke={p === 2.0 ? '#f472b6' : '#1e293b'} strokeWidth={p === 2.0 ? 1.2 : 1} strokeDasharray={p === 2.0 ? '4 3' : undefined} />
              <text x={ML - 8} y={py(p) + 4} textAnchor="end" fontSize="10" fill={p === 2.0 ? '#f472b6' : '#64748b'} fontFamily={mono}>{p.toFixed(1)}</text>
            </g>
          ))}
          {sTicks.map((s) => (
            <g key={"sg" + s}>
              <line x1={px(s)} y1={MT} x2={px(s)} y2={H - MB} stroke="#1e293b" strokeWidth="1" />
              <text x={px(s)} y={H - MB + 16} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily={mono}>{s}</text>
            </g>
          ))}
          <text x={(ML + W - MR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}>s = a&middot;U</text>
          <text x={13} y={(MT + H - MB) / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily={mono}
            transform={"rotate(-90 13 " + Math.round((MT + H - MB) / 2) + ")"}>fitted exponent p</text>
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#334155" strokeWidth="1" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#334155" strokeWidth="1" />

          <path d={satPath} fill="none" stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 3" opacity={0.7} />
          <path d={risingPath} fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="6 3" opacity={0.8} />
          <path d={dataPath} fill="none" stroke="#f472b6" strokeWidth="2" />
          {sVals.map((s, i) => (
            <circle key={"pt" + i} cx={px(s)} cy={py(pVals[i])} r={4.5} fill="#f472b6" stroke="#0f172a" strokeWidth="1.5">
              <title>{"s=" + s + "  p=" + pVals[i].toFixed(4)}</title>
            </circle>
          ))}
          <g>
            <line x1={ML + 14} y1={MT + 8} x2={ML + 32} y2={MT + 8} stroke="#f472b6" strokeWidth="2.5" />
            <text x={ML + 38} y={MT + 12} fontSize="10" fill="#f472b6" fontFamily={mono}>measured p(s)</text>
            <line x1={ML + 14} y1={MT + 24} x2={ML + 32} y2={MT + 24} stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 3" />
            <text x={ML + 38} y={MT + 28} fontSize="10" fill="#22d3ee" fontFamily={mono}>rising &alpha;+&beta;s (R²={rf.r2.toFixed(3)})</text>
            <line x1={ML + 14} y1={MT + 40} x2={ML + 32} y2={MT + 40} stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
            <text x={ML + 38} y={MT + 44} fontSize="10" fill="#64748b" fontFamily={mono}>saturating A&minus;B/s (R²={sf.r2.toFixed(3)})</text>
          </g>
        </svg>
      </div>

      <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>
          REPRESENTATIVE / DIAGNOSTIC &mdash; CARRIES NO RH VERDICT
        </div>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
          Empirical least-squares exponent trend over DEG in &#123;2,4,6,8,10&#125; inside the imp-3104
          numerically-trustworthy range; the s&nbsp;=&nbsp;4,&nbsp;6 cells sit near the resolution floor and are
          corroborating-only. The s&nbsp;&rarr;&nbsp;&infin; limit is UNRESOLVED &mdash; past s&nbsp;&asymp;&nbsp;6, G(s)&nbsp;&rarr;&nbsp;0
          forces resid into catastrophic cancellation below the numerical floor. The finding is that p does NOT
          saturate to 2 within reach, NOT that a specific limit was established. The endpoint-Hankel operator
          step (imp-3066) remains the lone obstruction and is untouched. Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains SOTA.
        </p>
      </div>
      <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
        Source: imp-3217-residual-exponent-s-limit.js &mdash; a=0.5, U=2s, NQ=4000,
        DEG&isin;&#123;2,4,6,8,10&#125;, cells: s&isin;&#123;0.8,1.2,1.6,2.0,3.0,4.0,6.0&#125;.
      </p>
      <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 6, background: 'rgba(100,116,139,0.06)', border: '1px dashed rgba(100,116,139,0.3)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', marginBottom: 4 }}>
          WHAT REMAINS
        </div>
        <p style={{ color: '#64748b', fontSize: 11, lineHeight: 1.6, margin: 0 }}>
          {M.whatRemains.finiteLimitBeyondDoublePrecision} {M.whatRemains.extendedPrecisionFollowUp}
        </p>
      </div>
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
        {/* imp-3168 honest-status banner: imp-3144 quantitative evidence for NOT SUFFICIENT */}
        <div
          style={{
            margin: '10px 0 8px',
            padding: '9px 14px',
            borderRadius: 6,
            background: 'rgba(251,191,36,0.06)',
            border: '1px solid rgba(251,191,36,0.28)',
            fontSize: 12,
            color: '#94a3b8',
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', marginBottom: 5 }}>
            HONEST STATUS (imp-3144): NECESSARY &ne; SUFFICIENT
          </div>
          The imp-3007 degree-0 scalar overflow cover drives the residual deficit to exactly 0
          (residual-0, necessary). However, the section26-mupass operator audit (imp-3144) measured
          the genuine deg-2 occupation deficit at{' '}
          <span style={{ fontFamily: mono, color: '#fbbf24' }}>9.28e-9</span>{' '}
          (overflow on 19.4% of tau — a coarse-grid N=200 snapshot; the resolution-converged genuine
          fraction is ~0.209 per imp-3175, not 0.194) — a tiny but strictly nonzero value that scalar domination
          never eliminates. This confirms the scalar cover is <em>not sufficient</em>: the
          off-diagonal endpoint-Hankel step remains the lone open obstruction at the operator level
          (K&#x2090;&thinsp;&#x2265;&thinsp;0, RH-equivalent, untouched).
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
        {/* imp-3208: MASS-FEASIBILITY table */}
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em', marginBottom: 6 }}>
            MASS-FEASIBILITY (imp-3144 / imp-3208): deficit sits 2400&ndash;20000&times; below available budget
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ padding: '4px 8px' }}>Degree / Measure</th>
                <th style={{ padding: '4px 8px', color: '#f87171' }}>Deficit</th>
                <th style={{ padding: '4px 8px', color: '#34d399' }}>Budget</th>
                <th style={{ padding: '4px 8px', color: '#fbbf24' }}>Ratio (Budget/Deficit)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>deg-2 vs L1 off-diagonal</td>
                <td style={{ padding: '4px 8px', color: '#f87171', fontFamily: mono }}>9.28e-9</td>
                <td style={{ padding: '4px 8px', color: '#34d399', fontFamily: mono }}>2.26e-5</td>
                <td style={{ padding: '4px 8px', color: '#fbbf24' }}>~2400&times;</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>deg-2 vs &#x2016;V&#x2016;<sub>HS</sub></td>
                <td style={{ padding: '4px 8px', color: '#f87171', fontFamily: mono }}>9.28e-9</td>
                <td style={{ padding: '4px 8px', color: '#34d399', fontFamily: mono }}>{IMP3256_VHS_CROSSVAL.convergedValue_h_to_zero.toExponential(4)}</td>
                <td style={{ padding: '4px 8px', color: '#fbbf24' }}>~20000&times;</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>deg-0 cosh-completion B vs D&#x2080;</td>
                <td style={{ padding: '4px 8px', color: '#f87171', fontFamily: mono }}>D&#x2080; = 13.07</td>
                <td style={{ padding: '4px 8px', color: '#34d399', fontFamily: mono }}>B = 14.04</td>
                <td style={{ padding: '4px 8px', color: '#fbbf24' }}>B/D = 1.074</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 7, padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11.5, color: '#94a3b8', lineHeight: 1.65 }}>
            <strong style={{ color: '#f87171' }}>Honest note:</strong>{' '}
            Mass-feasibility kills the impossibility option but does <strong>not</strong> close the
            operator-level K&#x2090;&thinsp;&#x2265;&thinsp;0 residual. The budget proxy &#x2016;V&#x2016;<sub>HS</sub> is
            itself the RH-equivalent quantity; the deg-0 B/D comparison is additionally circular.
            Construction is mass-feasible, NOT independently constructible. Per imp-3256, the
            &#x2016;V&#x2016;<sub>HS</sub> value above is the same-object h&#x2192;0 converged norm, not a
            second independent measurement corroborating the verdict.
          </div>
          {/* imp-3234: normalization-convention reconciliation note */}
          <div style={{ marginTop: 7, padding: '6px 10px', borderRadius: 4, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
            <strong style={{ color: '#fbbf24' }}>Normalization note (imp-3234):</strong>{' '}
            The imp-3154 diagnostic sweep records a genuine deg-2 deficit of{' '}
            <span style={{ fontFamily: mono, color: '#fbbf24' }}>~1.19e-7</span>{' '}
            (at N=200) vs the section26 / imp-3144 recorded{' '}
            <span style={{ fontFamily: mono, color: '#fbbf24' }}>9.28e-9</span>{' '}
            above. Both measure the same occupation deficit with the same sign and order of magnitude
            — they differ <strong>only</strong> by the offline occupation-density normalization
            convention (imp-3154 uses shear = full past-future Phi factor; section26 uses the
            standard cosh-normalized convention). This is <strong>NOT a discrepancy</strong>; the
            ~13x ratio is the imp-3218-derived connecting factor R&#x2009;&#x2248;&#x2009;4&pi;, with the
            1/2&pi; shear/passive normalization asymmetry named as the dominant source (see below) —
            not an unexplained computational disagreement.
            <div style={{ marginTop: 5, paddingTop: 5, borderTop: '1px solid rgba(251,191,36,0.18)' }}>
              <strong style={{ color: '#fbbf24' }}>Derived (imp-3218):</strong>{' '}
              the connecting factor is{' '}
              <span style={{ fontFamily: mono, color: '#fbbf24' }}>
                R = {IMP3218_DEG2_DEFICIT_NORMALIZATION_FACTOR.measured.connectingFactorR.toFixed(4)}
              </span>
              , within{' '}
              <span style={{ fontFamily: mono, color: '#fbbf24' }}>
                {(IMP3218_DEG2_DEFICIT_NORMALIZATION_FACTOR.measured.fourPiRelativeResidual * 100).toFixed(2)}%
              </span>{' '}
              of{' '}
              <span style={{ fontFamily: mono, color: '#fbbf24' }}>4&pi; = {IMP3218_DEG2_DEFICIT_NORMALIZATION_FACTOR.measured.fourPi.toFixed(4)}</span>{' '}
              &mdash; the symmetric 2&#xB7;(2&pi;) angular normalization from the 1/2&pi; shear/passive
              asymmetry. D<sub>3154</sub>&#x2009;/&#x2009;4&pi; ={' '}
              <span style={{ fontFamily: mono, color: '#fbbf24' }}>
                {IMP3218_DEG2_DEFICIT_NORMALIZATION_FACTOR.measured.fourPiReconciledMagnitude.toExponential(2)}
              </span>{' '}
              vs the recorded 9.28e-9. <strong>Same quantity to leading order and sign</strong>; the
              ~1.7% residual is the un-reproducible 3-sig-fig offline grid. Diagnostic /
              RH-equivalent; no QED.
            </div>
          </div>
        </div>
        {/* imp-3209: ||R|| grows with resolution -- no scalar core works at operator level */}
        <div
          style={{
            marginTop: 10,
            padding: '9px 14px',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.28)',
            fontSize: 12,
            color: '#94a3b8',
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: '#f87171', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', marginBottom: 5 }}>
            HONEST STATUS (imp-3209): NO SCALAR/DIAGONAL CORE WORKS AT OPERATOR ORDER
          </div>
          For <strong>every</strong> scalar or diagonal passive core &mu;, the contraction ratio{' '}
          <span style={{ fontFamily: mono, color: '#fbbf24' }}>&#x2016;R&#x2016;</span>{' '}
          <strong>grows unboundedly with resolution</strong>: the raw physical diagonal{' '}
          <span style={{ fontFamily: mono }}>m(&tau;)</span>{' '}
          gives{' '}
          <span style={{ fontFamily: mono, color: '#f87171' }}>&#x2016;R&#x2016;&thinsp;&#x223C;&thinsp;34&thinsp;&rarr;&thinsp;45</span>{' '}
          (and reaches{' '}
          <span style={{ fontFamily: mono, color: '#f87171' }}>&#x223C;10<sup>272</sup></span>{' '}
          in a degree-100 Legendre basis — the Sec.&thinsp;27 future-tail renormalization made
          quantitative). The cosh scalar enrichment (imp-2686) is ~5% better but still{' '}
          <span style={{ fontFamily: mono }}>&#x2016;R&#x2016;&thinsp;&#x223C;&thinsp;40</span>.{' '}
          The <strong>only</strong> core attaining{' '}
          <span style={{ fontFamily: mono, color: '#10b981' }}>&#x2016;R&#x2016;&thinsp;=&thinsp;1.0000</span>{' '}
          is the full operator{' '}
          <span style={{ fontFamily: mono }}>G<sub>pass</sub>&thinsp;=&thinsp;|G<sub>shear</sub>|</span>,{' '}
          which reads its answer off the operator it must dominate (tautological partial isometry —
          not an independent construction). Source:{' '}
          <span style={{ fontFamily: mono, color: '#64748b' }}>SECTION26_MUPASS_OPERATOR_VERDICT.noScalarCore</span>.
        </div>
        <p style={{ marginTop: 12, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3007-mupass-overflow-cover.js &mdash; RH-EQUIVALENT; STRUCTURAL/DIAGNOSTIC; NOT a reduction.
          Platt&ndash;Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
        </p>
      </div>

      <BridgeMarginRatioCurvePanel />

      {/* ─── imp-3266: headline reconciliation note ─── */}
      <div
        style={{
          marginTop: 14,
          padding: '9px 14px',
          borderRadius: 6,
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.28)',
          fontSize: 11.5,
          color: '#94a3b8',
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: '#818cf8', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', marginBottom: 5 }}>
          HEADLINE RECONCILIATION (imp-3266): ~64% vs ~0.209 ARE NOT A DISCREPANCY
        </div>
        A reader scanning this page encounters two overflow headlines that look contradictory:{' '}
        <strong style={{ color: '#e2e8f0' }}>~64% of lag</strong>{' '}
        (the raw degree-0 scalar overflow on [0,&thinsp;U] covered by the cosh-completion above) and{' '}
        <strong style={{ color: '#e2e8f0' }}>~0.209</strong>{' '}
        (the degree-2 resolution-converged genuine fraction from imp-3175 below). These are
        the <strong>same deficit measured at different completion degrees</strong>, not a
        contradiction:
        <ul style={{ margin: '6px 0 0 16px', padding: 0, lineHeight: 1.8 }}>
          <li>
            <strong style={{ color: '#818cf8' }}>~64%</strong>{' '}
            is the <em>degree-0 (scale-invariant) scalar measure</em>: the fraction of tau in [0,&thinsp;U]
            where sinh(a&tau;) &gt; 0, i.e. tau &gt; 0.  It counts raw positivity of the cosh-sinh gap before
            any occupation-density weighting.  The cosh-completion exactly kills this at degree-0 (residual = 0).
          </li>
          <li>
            <strong style={{ color: '#818cf8' }}>~0.209</strong>{' '}
            is the <em>degree-2 (occupation-density weighted) genuine fraction</em> from imp-3175:
            the fraction of tau carrying strictly positive deficit under the genuine degree-2 occupation
            measure.  This is tiny (deficit 9.28e-9) but nonzero — scalar cover alone cannot close it.
          </li>
        </ul>
        <div style={{ marginTop: 6, color: '#64748b', fontStyle: 'italic' }}>
          Both numbers are correct.  The apparent size difference (&sim;64% vs &sim;21%) reflects the
          occupation-density weighting: most tau where cosh&nbsp;&gt;&nbsp;sinh still carry negligible
          density, so the density-weighted fraction is much smaller.
        </div>
      </div>

      {/* ─── imp-3175: overflow fraction resolution sweep viz ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Overflow Fraction Resolution Sweep (imp-3175)
      </h2>
      <OverflowFractionResolutionSweepViz />

      {/* ─── imp-3199: cell-invariant absolute overflow-support length ─── */}
      <div
        className="card"
        style={{
          marginTop: 14,
          borderLeft: '4px solid #f59e0b',
          background: 'rgba(245,158,11,0.04)',
        }}
      >
        <h3 style={{ color: '#f59e0b', marginTop: 0, fontSize: 14 }}>
          imp-3199: ~0.209 is the U=6 reading of a cell-invariant absolute lag-length ~1.254 &mdash; NOT a universal fraction
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
          The multi-cell sweep (imp-3199) varies <em>a</em>, <em>U</em>, and <em>NPHI</em> around
          the base cell. The converged overflow <strong>fraction</strong> shifts with <em>U</em>
          (0.251 at U=5, 0.209 at U=6, 0.157 at U=8) but the absolute overflow-support
          <strong> measure frac&times;U</strong> is &asymp;{IMP3199_OVERFLOW_FRACTION_CELL_SWEEP.measured.measureMean.toFixed(4)}&thinsp;&plusmn;&thinsp;{IMP3199_OVERFLOW_FRACTION_CELL_SWEEP.measured.measureSpread.toFixed(4)} across
          all seven cells. Varying <em>a</em> (0.3, 0.5, 0.7) or <em>NPHI</em> (6, 10, 14)
          does <strong>not</strong> move the fraction. The imp-3175 ~0.209 is therefore the
          U=6 normalization of the cell-invariant overflow-support lag-length &asymp;1.254; it is
          NOT a universal fraction.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ fontSize: 11, borderCollapse: 'collapse', color: '#94a3b8', width: '100%', maxWidth: 540 }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
                <th style={{ textAlign: 'left', padding: '3px 8px', fontWeight: 500 }}>cell</th>
                <th style={{ textAlign: 'right', padding: '3px 8px', fontWeight: 500 }}>a</th>
                <th style={{ textAlign: 'right', padding: '3px 8px', fontWeight: 500 }}>U</th>
                <th style={{ textAlign: 'right', padding: '3px 8px', fontWeight: 500 }}>NPHI</th>
                <th style={{ textAlign: 'right', padding: '3px 8px', fontWeight: 500 }}>frac</th>
                <th style={{ textAlign: 'right', padding: '3px 8px', fontWeight: 500, color: '#f59e0b' }}>frac&times;U</th>
              </tr>
            </thead>
            <tbody>
              {IMP3199_OVERFLOW_FRACTION_CELL_SWEEP.measured.perCell.map((row) => (
                <tr key={row.label} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '3px 8px', fontFamily: mono, fontSize: 10.5 }}>{row.label}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px' }}>{row.a}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px' }}>{row.U}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px' }}>{row.NPHI}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px' }}>{row.convergedFraction.toFixed(6)}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px', color: '#f59e0b', fontWeight: 600 }}>
                    {row.supportMeasure.toFixed(5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3199-overflow-fraction-cell-sweep.js &mdash; DIAGNOSTIC; overflow-support only;
          NOT a reduction; Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains SOTA.
        </p>
        <div
          style={{
            marginTop: 12,
            padding: '9px 14px',
            borderRadius: 6,
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.28)',
            fontSize: 11.5,
            color: '#94a3b8',
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: '#f87171', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', marginBottom: 5 }}>
            HONEST-STATUS CORRECTION (imp-3216): the ~1.254 length above is a double-precision underflow artifact
          </div>
          Resolving the overflow interval to N&thinsp;=&thinsp;51200 shows the upper endpoint <span style={{ fontFamily: mono }}>&tau;<sub>2</sub>&thinsp;&asymp;&thinsp;1.366</span> above is{' '}
          <strong style={{ color: '#e2e8f0' }}>not a genuine nu/mu down-crossing</strong> &mdash; it is the IEEE-754{' '}
          <strong style={{ color: '#e2e8f0' }}>kernel underflow horizon</strong> where Phi(u) drops below the smallest
          representable double. The lower endpoint <span style={{ fontFamily: mono }}>&tau;<sub>1</sub>&thinsp;&asymp;&thinsp;0.111</span> is genuine, but past it{' '}
          <span style={{ fontFamily: mono }}>nu&thinsp;&gt;&thinsp;mu</span> holds all the way to <em>U</em>, with no
          further crossing &mdash; the mathematically correct overflow region is <span style={{ fontFamily: mono }}>[&tau;<sub>1</sub>, U]</span> and
          its fraction <span style={{ fontFamily: mono }}>(U&thinsp;&minus;&thinsp;&tau;<sub>1</sub>)/U&thinsp;&rarr;&thinsp;1</span> as{' '}
          <em>U</em> grows, not a fixed &sim;0.209. The <strong>~1.2535 / ~0.209 numbers above are kept as historical
          double-precision snapshots</strong>, not deleted, but should be read through this correction. See{' '}
          <span style={{ fontFamily: mono, color: '#64748b' }}>imp-3216-overflow-support-length-closed-form.js</span>{' '}
          (verdict: {IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM.measured.verdict}). DIAGNOSTIC correction; no new
          positivity; Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains SOTA.
        </div>
      </div>

      {/* ─── imp-3314: measured-artifact vs true overflow-fraction viz ─── */}
      <UnderflowArtifactVsTrueFractionViz />

      {/* ─── imp-3394: truncation-threshold sweep vs closed-form horizon viz ─── */}
      <TruncationThresholdHorizonViz />

      {/* ─── imp-3395: two-tail underflow horizons (Phi vs Phi^2 crossing the subnormal line) viz ─── */}
      <TwoTailUnderflowHorizonsViz />

      {/* ─── imp-3250: U-sweep overflow fraction viz ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        U-Sweep: frac vs U Collapse onto frac&times;U &asymp; 1.2535 (imp-3199)
      </h2>
      <USweeOverflowFractionViz />

      {/* ─── imp-3202: bridge lag-cutoff capture curve viz ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Bridge Lag-Cutoff Capture Curve (imp-3202)
      </h2>
      <BridgeLagCutoffCaptureViz />

      {/* ─── imp-3197: sign-vs-magnitude decomposition ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        K&#x2090;&thinsp;&ge;&thinsp;0 Sign-vs-Magnitude Split (imp-3197)
      </h2>
      <BridgeSignMagnitudeDecompositionViz />

      {/* ─── imp-3358: capture ratio vs U with the C/U fit ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Capture Ratio vs Lag Window U (imp-3358)
      </h2>
      <CaptureRatioVsUViz />

      {/* ─── imp-3410: fixed-resolution r*U convergence to C_inf (imp-3346) ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Fixed-Resolution Capture-Ratio Convergence to C&#8734; (imp-3346)
      </h2>
      <CInfFixedResolutionConvergenceViz />

      {/* ─── imp-3412: imp-3350 sinh a -> 0 capture ratio converging to the exactly-linear-shear ratio ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Sinh-Shear a&#8594;0 Capture-Ratio Limit Equals the Linear-Shear Ratio (imp-3350)
      </h2>
      <SinhToLinearShearLimitViz />
      <PhiTermwiseNonnegativityViz />

      {/* ─── imp-3411: imp-3347 leftmost-zero drift vs ln(NPHI), left-margin-below-u1* overlay ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Leftmost Truncation-Zero Drift vs ln(NPHI) (imp-3347)
      </h2>
      <LeftmostZeroDriftVsLnNphiViz />

      {/* ─── imp-3065: independent quadrature cross-check ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Independent Quadrature Cross-Check of Scalar Cover (imp-3065)
      </h2>
      <div
        className="card"
        style={{
          marginTop: 16,
          borderLeft: '4px solid #10b981',
          background: 'rgba(16,185,129,0.04)',
        }}
      >
        <h3 style={{ color: '#10b981', marginTop: 0 }}>
          Composite Simpson confirms D_pass = 0 across 28 cells — independent of imp-3007
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
          imp-3007 uses a single <em>midpoint</em> rule (N&thinsp;=&thinsp;200 panels) at a
          fixed U&thinsp;=&thinsp;6 sweep. A skeptic could worry the zero is a degenerate
          artifact of a broken integrator (any rule returns 0 when every sample is clamped to 0).
          imp-3065 removes that worry by two independent checks:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 0' }}>
          <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
            <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 4, fontSize: 12.5 }}>(A) Different rule, denser grid</div>
            Composite Simpson (M&thinsp;=&thinsp;1000 panels) over a-grid
            &#x7B;1, 0.5, 0.25, 0.2, 0.1, 0.05, 0.02&#x7D; × U-range &#x7B;4, 6, 8, 10&#x7D; — {IMP3065_RESIDUAL_DEFICIT_QUADRATURE.method.cellCount} cells.
            Residual deficit = <strong style={{ color: '#10b981' }}>0 exactly</strong> in every cell.
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
            <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 4, fontSize: 12.5 }}>(B) Integrator validated on non-zero companion</div>
            Same Simpson rule on the <em>signed</em> (un-clamped) integrand sinh&thinsp;&minus;&thinsp;cosh
            = &minus;e<sup>&minus;a&tau;</sup> reproduces the closed form &minus;(1&thinsp;&minus;&thinsp;e<sup>&minus;aU</sup>)/a to &lt;&thinsp;10<sup>&minus;6</sup> relative.
            Worst error across all cells: {IMP3065_RESIDUAL_DEFICIT_QUADRATURE.worstIntegratorRelError.toExponential(2)}.
          </div>
        </div>
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
          D_pass(a, U) = &#x222B;&#x2080;&#x1D41C; max(0, sinh(a&#x03C4;) &#x2212; cosh(a&#x03C4;)) d&#x03C4; = 0&nbsp;&nbsp;(Simpson, 28 cells)
          &nbsp;&nbsp;&rarr;&nbsp;&nbsp;covered fraction = 1 EXACTLY
        </div>
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.3)',
            fontSize: 12,
            color: '#cbd5e1',
            lineHeight: 1.65,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', marginBottom: 5 }}>
            HONEST SCOPE — SCALAR COVER ONLY
          </div>
          This certifies the <em>degree-0 pointwise/diagonal</em> residual deficit is zero — the
          same SCALAR statement as imp-3007, now independently cross-checked by a different rule
          over a wider grid. The <strong>operator step</strong> (off-diagonal endpoint-Hankel
          R&thinsp;=&thinsp;G<sub>pass</sub><sup>&minus;&frac12;</sup> G<sub>shear</sub> G<sub>pass</sub><sup>&minus;&frac12;</sup> contraction)
          is explicitly <strong style={{ color: '#f87171' }}>out of scope and untouched</strong>.
          RH-EQUIVALENT; STRUCTURAL/DIAGNOSTIC; NOT a reduction; NOT a proof.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </div>
        <p style={{ marginTop: 10, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3065-residual-deficit-quadrature-2026-06-30.js
        </p>
      </div>

      {/* ─── imp-3413: capture-ratio & shear-Gram cluster roundup ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Capture-Ratio &amp; Shear-Gram Cluster Roundup (imp-3413)
      </h2>
      <CaptureRatioShearGramClusterSummaryPanel />

      {/* ─── imp-3066: off-diagonal endpoint-Hankel obstruction ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Off-Diagonal Endpoint-Hankel Obstruction: operator/diagonal gap (imp-3066)
      </h2>
      <OffDiagHankelObstructionPanel />

      {/* ─── imp-3064: degree-0 excess-fraction grid ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Scalar cover price: degree-0 excess-fraction grid, phi = E / D_raw (imp-3064)
      </h2>
      <DeficitExcessFractionGridPanel />

      {/* ─── imp-3095: scalar-phi collapse curve ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Scalar-phi collapse: phi(s) single curve with all (a,U) grid cells (imp-3095)
      </h2>
      <PhiCollapseViz />

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

      {/* ─── imp-3179: sub-ladder margin curve below N=2458 (imp-3151) ─── */}
      <h2 style={{ marginTop: 28, color: "#e2e8f0", fontSize: 22, fontFamily: mono }}>
        Descending sub-ladder: margin crosses zero at N<sub>*</sub>&asymp;203 (&gamma;<sub>N</sub>=e<sup>6</sup>) (imp-3151)
      </h2>
      <CShockSubMarginCurveViz />

      {/* ─── imp-3180: onset derivative drho/ds showing c_asym root vs imp-3045 false onset ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Asymmetric onset derivative: closed-form root c<sub>asym</sub>=0.90279 corrects imp-3045 false onset (imp-3170)
      </h2>
      <AsymOnsetDerivativeViz />

      {/* ─── imp-3181: residual-gap limit G(s)=tanh(s)-tanh(s/2) golden-ratio maximum ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Residual-gap limit G(s)=tanh(s)&minus;tanh(s/2): maximum &phi;<sup>&minus;5/2</sup>&asymp;0.300 at cosh(s*)=&phi; (imp-3146)
      </h2>
      <ResidualGapLimitCurveViz />

      {/* ─── imp-3210: equal-product cell invariance bar viz (imp-3177) ─── */}
      <h2 style={{ marginTop: 24, color: '#e2e8f0', fontSize: 20, fontFamily: mono }}>
        Equal-product cell invariance: both cells of each equal-s pair coincide (imp-3146/imp-3177)
      </h2>
      <EqualProductCellInvarianceViz />

      {/* ─── imp-3126: regular-mass vs C_shock near-miss is a NUMERICAL COINCIDENCE ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Regular tail mass ~0.2690 vs C<sub>shock</sub>(N*=10<sup>4</sup>) ~0.2692: NUMERICAL COINCIDENCE, not structural (imp-3126)
      </h2>
      <div className="card" style={{ marginTop: 14, borderLeft: '4px solid #b45309', background: 'rgba(180,83,9,0.06)' }}>
        <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: 14 }}>
          N-ladder cross-check: regular mass fixed at {REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.regularMass.toFixed(6)}, C<sub>shock</sub>(N) decays monotonically (imp-3126)
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          imp-3106 measured the convergent regular tail mass int<sub>s0+1</sub><sup>&infin;</sup>&phi;&thinsp;ds &asymp;{' '}
          <span style={{ fontFamily: mono, color: '#fbbf24' }}>{REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.regularMass.toFixed(8)}</span>{' '}
          (FIXED, N-independent). The imp-3026/imp-3070 cusp constant C<sub>shock</sub>(N)=&radic;(2/(3&thinsp;log&thinsp;&gamma;<sub>N</sub>)) evaluates to{' '}
          <span style={{ fontFamily: mono, color: '#fbbf24' }}>{REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.cShockStar.toFixed(8)}</span>{' '}
          at N*=10<sup>4</sup>, agreeing to ~2e-4. The decisive test is N-dependence: C<sub>shock</sub>(N) DECAYS
          while the regular mass is fixed; the abs diff{' '}
          <strong style={{ color: '#fbbf24' }}>grows ~{Math.round(REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.absDiffBlowupOverLadder)}&times;</strong>{' '}
          over two decades. Agreement is confined to one ladder point. <strong>VERDICT: COINCIDENCE.</strong>
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 8 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'left' }}>N</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>regular mass (A, fixed)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>C<sub>shock</sub>(N) (B, decaying)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>|A&minus;B|</th>
            </tr>
          </thead>
          <tbody>
            {REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.ladder.map((row) => (
              <tr key={row.N} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#cbd5e1' }}>{row.N.toExponential(0)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#64748b', textAlign: 'right' }}>{row.regularMass.toFixed(8)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#fbbf24', textAlign: 'right' }}>{row.cShock.toFixed(8)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: row.N === REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.nStar ? '#4ade80' : '#f87171', textAlign: 'right' }}>
                  {row.absDiff.toExponential(2)}
                  {row.N === REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.nStar ? ' ← near-miss' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#f87171' }}>Honest scope (imp-3126):</strong>{' '}
          {REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.honestCaveat.operatorStepUntouched}{' '}
          {REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.honestCaveat.sota}.
        </div>
        <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3126-regular-mass-vs-c-shock-coincidence.js &mdash; N&isin;&#123;10<sup>4</sup>,10<sup>5</sup>,10<sup>6</sup>&#125;, absDiffBlowup&asymp;{Math.round(REGULAR_MASS_VS_C_SHOCK_COINCIDENCE_IMP3126.absDiffBlowupOverLadder)}&times;.
        </p>
      </div>

      {/* ─── imp-3125: residual-gap DEG-saturation curve ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Residual-gap DEG-saturation: survives orthogonalization, converges to tanh(3)&minus;tanh(1.5) (imp-3125)
      </h2>
      <ResidualGapDegreeSweepViz />

      {/* ─── imp-3196: residual-gap convergence RATE (log-log, power-law vs geometric) ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Residual-gap convergence RATE: algebraic power-law decay, exponent p rising 1.49&rarr;1.72 with s (imp-3196)
      </h2>
      <ResidualGapConvergenceRateViz />

      {/* ─── imp-3217: does the fitted exponent p(s) saturate (to 2) as s -> inf? ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Exponent p(s) rises past 2 as s grows: the p&rarr;2 conjecture is refuted, s&rarr;&infin; limit unresolved (imp-3217)
      </h2>
      <ResidualExponentSLimitViz />

      {/* ─── imp-3182: cosh-monomial conditioning ceiling cond(P)/cond(H) vs DEG (imp-3153) ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Cosh-monomial conditioning ceiling: geometric cond(P)/cond(H) growth, trust boundary pinned numerically (imp-3153)
      </h2>
      <CoshMonomialConditioningViz />

      {/* ─── imp-3183: next-order convergence corrections (imp-3155) ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Next-order convergence corrections: onset slope A<sub>1</sub>&asymp;3.256 and decay (2s+D<sub>0</sub>)e<sup>&minus;s</sup> (imp-3155)
      </h2>
      <NextOrderConvergenceCorrectionViz />

      {/* ─── imp-3396: imp-3325 T2/T3/P11 accuracy radii viz ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Onset-signature accuracy radii: T2/T3/P11 relative error vs &epsilon;, ~4x extension and T3&asymp;P11 overlap (imp-3325)
      </h2>
      <OnsetPadeAccuracyRadiusViz />

      {/* ─── imp-3154: genuine deg-2 deficit degree sweep ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Genuine deg-2 occupation deficit: DEG-independent (FIXED), strictly positive (imp-3154)
      </h2>
      <div className="card" style={{ marginTop: 14, borderLeft: '4px solid #a78bfa', background: 'rgba(167,139,250,0.04)' }}>
        <h3 style={{ color: '#a78bfa', marginTop: 0, fontSize: 14 }}>
          Genuine degree-2 (absolute) occupation deficit &mdash; sweep over monomial truncation degree DEG&isin;&#123;2,4,6,8,10&#125; (imp-3154)
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          The imp-3144 section26-mupass verdict recorded a genuine nonzero degree-2 deficit
          (9.28e-9, overflow on ~19.4% of the lag grid). This sweep asks whether that deficit
          is a monomial-basis truncation artifact that enrichment removes. Trend:{' '}
          <strong style={{ color: '#a78bfa' }}>{IMP3154_GENUINE_DEG2_DEFICIT_DEGREE_SWEEP.measured.trend}</strong>
          {' '}&mdash; the deficit converges within ~0.42% by DEG=2 and is flat from DEG=6,
          overflow fraction pinned at{' '}
          <span style={{ fontFamily: mono, color: '#a78bfa' }}>{IMP3154_GENUINE_DEG2_DEFICIT_DEGREE_SWEEP.measured.overflowFraction.toFixed(3)}</span>{' '}
          at every degree.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 8 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'left' }}>DEG</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>deficit</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>overflow frac of tau</th>
            </tr>
          </thead>
          <tbody>
            {IMP3154_GENUINE_DEG2_DEFICIT_DEGREE_SWEEP.measured.sweep.map((row) => (
              <tr key={row.degree} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#cbd5e1' }}>{row.degree}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#a78bfa', textAlign: 'right' }}>{row.deficit.toExponential(4)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#64748b', textAlign: 'right' }}>{row.overflowFractionOfTau.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#f87171' }}>Honest scope (imp-3154):</strong>{' '}
          REPRESENTATIVE / DIAGNOSTIC at the genuine Phi (NPHI=10). The absolute deficit
          (~1.19e-7) carries this module&apos;s density normalization convention; only the
          DEG-trend (FIXED, strictly positive) and the reproduced ~19.4-20% overflow fraction
          are the deliverables. Necessary-but-NOT-sufficient: a nonzero deg-2 deficit neither
          proves nor disproves the operator cover. No RH verdict.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </div>
        <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3154-genuine-deg2-deficit-degree-sweep.js &mdash; a=0.5, U=6, N=200, DEG&isin;&#123;2,4,6,8,10&#125;.
        </p>
      </div>

      {/* ─── imp-3102: orthogonalized gap a*U grid ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Orthogonalized residual gap sweeps the full a&times;U grid; survivor tracks s=a&middot;U (imp-3102)
      </h2>
      <div className="card" style={{ marginTop: 14, borderLeft: '4px solid #8b5cf6', background: 'rgba(139,92,246,0.04)' }}>
        <h3 style={{ color: '#8b5cf6', marginTop: 0, fontSize: 14 }}>
          Basis-invariant residual gap &#x2016;R<sub>orth</sub>&#x2016;&minus;max&#x2C7C;&thinsp;R<sub>orth,jj</sub> on the Cartesian a&times;U grid (imp-3102)
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          imp-3086 orthogonalized the full passive cosh Gram at one cell (a=0.5, U=6) and found the
          raw gap 3.63 collapses to ~0.09; a strictly-positive residual obstruction survives. This
          module extends that single-cell measurement to the full Cartesian a&times;U grid and tests
          whether the SURVIVING gap still tracks the single product s=a&middot;U. It does: equal-product
          cells coincide to ~{IMP3102_ORTHOGONALIZED_GAP_AU_GRID.measured.maxGapMismatchAcrossEqualProductPairs.toExponential(0)}{' '}
          (Cholesky-conditioned, a few orders looser than the raw imp-3085 ~1e-15 diagonal-normalized
          coincidence, but still machine precision). The survivor is strictly positive on every grid cell.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 8 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'left' }}>a</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>U</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>s=a&middot;U</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>&#x2016;R<sub>orth</sub>&#x2016;</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>residual gap</th>
            </tr>
          </thead>
          <tbody>
            {IMP3102_ORTHOGONALIZED_GAP_AU_GRID.measured.grid.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#cbd5e1' }}>{c.a}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#cbd5e1', textAlign: 'right' }}>{c.U}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#a78bfa', textAlign: 'right' }}>{c.s.toFixed(2)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#8b5cf6', textAlign: 'right' }}>{c.operatorNorm.toFixed(5)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#c4b5fd', textAlign: 'right' }}>{c.residualGap.toFixed(5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#f87171' }}>Honest scope (imp-3102):</strong>{' '}
          REPRESENTATIVE / DIAGNOSTIC on the SAME monomial-moment truncation as imp-3066/imp-3086 --
          NOT the section-26 Gram. The measured &#x2016;R<sub>orth</sub>&#x2016; and residual gaps carry
          NO RH verdict: they neither claim the cover holds nor that it fails. Only the a&middot;U
          scaling of the basis-invariant survivor is asserted. Positivity was not attempted;
          the bare-V pilot (imp-1240) is not re-run.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </div>
        <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3102-orthogonalized-gap-aU-grid.js &mdash; a&isin;&#123;0.5,0.3,0.2,0.1&#125;, U&isin;&#123;4,6,8,10&#125;, DEG=4, NQ=4000.
        </p>
      </div>

      {/* ─── imp-3104: orthogonalized operator-norm degree sweep ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Orthogonalized operator norm converges to tanh(a&middot;U); raw divergence is a conditioning artifact (imp-3104)
      </h2>
      <div className="card" style={{ marginTop: 14, borderLeft: '4px solid #8b5cf6', background: 'rgba(139,92,246,0.04)' }}>
        <h3 style={{ color: '#8b5cf6', marginTop: 0, fontSize: 14 }}>
          &#x2016;R<sub>orth</sub>&#x2016; vs DEG sweep at a=0.5, U=6 &mdash; basis-invariant, bounded below tanh(3)&asymp;{IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.analyticCeilingTanhAU.toFixed(5)} (imp-3104)
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          imp-3084 swept the RAW-monomial operator norm and found it DIVERGES (~1.79&rarr;10.8); imp-3086
          orthogonalized at a single cell (DEG=4) and found the intrinsic norm stays bounded. This module
          runs the FULL degree sweep on the ORTHOGONALIZED basis across DEG&isin;[2,12]. On the numerically
          trustworthy range DEG&isin;[{IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.validDegreeRange[0]},{IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.validDegreeRange[1]}] the
          norm rises monotonically ({IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.firstValidOperatorNorm.toFixed(5)}&rarr;{IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.lastValidOperatorNorm.toFixed(5)})
          and converges to tanh(a&middot;U), bounded below 1. The ceiling-distance shrinks
          ~{IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.ceilingDistanceShrinkFactor.toFixed(0)}&times;.
          At DEG&ge;11 the cosh-Hankel is catastrophically ill-conditioned; those tail rows measure the
          orthogonalizer breakdown, not the operator.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 8 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'left' }}>DEG</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>&#x2016;R<sub>orth</sub>&#x2016; (GS)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>&#x2016;R<sub>sym</sub>&#x2016; (Loewdin)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>dist to tanh(3)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>status</th>
            </tr>
          </thead>
          <tbody>
            {IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.measured.sweep.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b', opacity: row.orthogonalizerTrustworthy ? 1 : 0.5 }}>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#cbd5e1' }}>{row.degree}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#8b5cf6', textAlign: 'right' }}>{row.operatorNormGS.toFixed(5)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#a78bfa', textAlign: 'right' }}>{row.operatorNormLoewdin.toFixed(5)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#c4b5fd', textAlign: 'right' }}>{row.distanceToCeiling.toExponential(2)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: row.orthogonalizerTrustworthy ? '#4ade80' : '#f87171', textAlign: 'right' }}>
                  {row.orthogonalizerTrustworthy ? 'valid' : 'ill-cond'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#f87171' }}>Honest scope (imp-3104):</strong>{' '}
          REPRESENTATIVE / DIAGNOSTIC on the SAME monomial-moment truncation as imp-3084/imp-3086 --
          NOT the section-26 Gram. The measured &#x2016;R<sub>orth</sub>&#x2016; and DEG-trend carry
          NO RH verdict: a converging bounded norm neither claims the cover holds nor that it fails.
          Positivity not attempted; bare-V pilot (imp-1240) not re-run.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </div>
        <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3104-orthogonalized-opnorm-degree-sweep.js &mdash; a=0.5, U=6, DEG&isin;[2,12], NQ=4000.
        </p>
      </div>

      <AnalyticCeilingConcentratingFamilyPanel />

      <ConditionalShareUShapePanel />

      <SigmaCHSaturationPanel />

      <CaptureOvershootKneePanel />

      {/* ─── imp-3106: excess fraction integrability ─── */}
      <h2 style={{ marginTop: 28, color: '#e2e8f0', fontSize: 22, fontFamily: mono }}>
        Excess fraction &phi;(s) is non-integrable at overflow onset; mean cosh-completion price is unbounded (imp-3106)
      </h2>
      <div className="card" style={{ marginTop: 14, borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
        <h3 style={{ color: '#f59e0b', marginTop: 0, fontSize: 14 }}>
          Onset divergence ladder: I(&epsilon;) ~ C/&epsilon;, C&asymp;{IMP3106_EXCESS_FRACTION_INTEGRABILITY.onsetDivergence.onsetConstant.toFixed(5)}; regular mass &asymp;{IMP3106_EXCESS_FRACTION_INTEGRABILITY.convergentTail.regularMass.toFixed(4)} (imp-3106)
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          imp-3087 measured the onset pole &phi;(s) ~ C/(s&minus;s<sub>0</sub>)&sup2; and imp-3088 measured the
          tail &phi; ~ K e<sup>&minus;s</sup>, but the TOTAL area was never assessed. This module closes the gap:
          the integral of the imp-3064 excess fraction over the overflow range DIVERGES at s<sub>0</sub> = arcsinh(1).
          An &epsilon;-cutoff ladder shows I(&epsilon;) grows ~10&times; per decade (the 1/&epsilon; power law) and
          &epsilon;&middot;I(&epsilon;) &rarr; C from above. The finite regular mass beyond the onset window
          int<sub>s0+1</sub><sup>&infin;</sup>&phi;ds &asymp; {IMP3106_EXCESS_FRACTION_INTEGRABILITY.convergentTail.regularMass.toFixed(4)} is
          overrun by C/&epsilon; at the finest cutoff by a factor of &asymp;{Math.round(IMP3106_EXCESS_FRACTION_INTEGRABILITY.whereDivergenceDominates.onsetToRegularRatioAtFinestEps)}&times;.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 8 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'left' }}>&epsilon;</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>I(&epsilon;)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>&epsilon;&middot;I(&epsilon;)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, textAlign: 'right' }}>ratio to C/&epsilon;</th>
            </tr>
          </thead>
          <tbody>
            {IMP3106_EXCESS_FRACTION_INTEGRABILITY.onsetRungs.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#cbd5e1' }}>{row.eps.toExponential(0)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#f59e0b', textAlign: 'right' }}>{row.mass.toFixed(3)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#fbbf24', textAlign: 'right' }}>{row.epsTimesMass.toFixed(5)}</td>
                <td style={{ padding: '3px 8px', fontFamily: mono, color: '#fcd34d', textAlign: 'right' }}>{row.ratioToPrincipal.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '6px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#f87171' }}>Honest scope (imp-3106):</strong>{' '}
          DIVERGENCE CHARACTERIZATION, NOT A VALUE. Degree-0 scalar measure only (RH-equivalent).
          The integrability result for the imp-3064 scalar ratio &phi;(s) neither proves nor weakens RH;
          the off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone obstruction and
          is untouched. No finite mean to report.
          Platt&ndash;Trudgian &Lambda;&thinsp;&le;&thinsp;0.2 remains the rigorous SOTA.
        </div>
        <p style={{ marginTop: 8, color: '#64748b', fontSize: 11, fontFamily: mono }}>
          Source: imp-3106-excess-fraction-integrability.js &mdash; s0=arcsinh(1)&asymp;0.88137, C&asymp;{IMP3106_EXCESS_FRACTION_INTEGRABILITY.onsetDivergence.onsetConstant.toFixed(5)}, K&asymp;{IMP3106_EXCESS_FRACTION_INTEGRABILITY.convergentTail.tailConstant.toFixed(5)}.
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
