import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { DI_VARIATION_FOUR_MODULI } from '../data/imp-95765-di-variation-four-moduli.js';

const DI_TABLE = DI_VARIATION_FOUR_MODULI.diTable;
const CONSEC_DIFFS = DI_VARIATION_FOUR_MODULI.variation.consecutiveDiffs;
const DI_SPREAD = DI_VARIATION_FOUR_MODULI.variation.diSpread;
const SIGNAL_TO_FLOOR = DI_VARIATION_FOUR_MODULI.resolutionCheck.signalToFloor;

const UP_COLOR = '#34d399';
const DOWN_COLOR = '#f87171';
const POINT_COLOR = '#60a5fa';

// dI(1/m) at m=18..21: a 4.146e-5-wide zigzag band (signs -,+,-), plotted
// against the 1e-9 quadrature floor to show the signal is resolved, not noise.
function DiZigzagChart() {
  const svgW = 520;
  const padL = 70;
  const padR = 24;
  const padT = 36;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const values = DI_TABLE.map((r) => r.dI);
  const yMin = Math.min(...values);
  const yMax = Math.max(...values);
  const pad = (yMax - yMin) * 0.35;
  const lo = yMin - pad;
  const hi = yMax + pad;
  const yOf = (v) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;
  const slotW = plotW / (DI_TABLE.length - 1);
  const xOf = (i) => padL + i * slotW;

  const bandTop = yOf(yMax);
  const bandBottom = yOf(yMin);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect
        x={padL}
        y={bandTop}
        width={plotW}
        height={bandBottom - bandTop}
        fill="#f59e0b"
        opacity={0.08}
      />
      <text x={padL + plotW - 4} y={bandTop - 4} textAnchor="end" fill="#f59e0b" fontSize={9}>
        band width {DI_SPREAD.toExponential(3)}
      </text>

      {DI_TABLE.slice(1).map((r, i) => {
        const prev = DI_TABLE[i];
        const diff = CONSEC_DIFFS[i];
        const color = diff.delta > 0 ? UP_COLOR : DOWN_COLOR;
        return (
          <g key={`seg-${r.m}`}>
            <line
              x1={xOf(i)}
              y1={yOf(prev.dI)}
              x2={xOf(i + 1)}
              y2={yOf(r.dI)}
              stroke={color}
              strokeWidth={2}
            />
            <text
              x={(xOf(i) + xOf(i + 1)) / 2}
              y={(yOf(prev.dI) + yOf(r.dI)) / 2 - 8}
              textAnchor="middle"
              fill={color}
              fontSize={10}
              fontWeight={600}
            >
              {diff.delta > 0 ? '+' : ''}
              {diff.delta.toExponential(3)}
            </text>
          </g>
        );
      })}

      {DI_TABLE.map((r, i) => (
        <g key={`pt-${r.m}`}>
          <circle cx={xOf(i)} cy={yOf(r.dI)} r={4.5} fill={r.m === 20 ? '#facc15' : POINT_COLOR} />
          <text x={xOf(i)} y={padT + plotH + 18} textAnchor="middle" fill="#64748b" fontSize={10}>
            {`m=${r.m}`}
          </text>
          <text x={xOf(i)} y={padT + plotH + 31} textAnchor="middle" fill="#475569" fontSize={8}>
            {r.m === 20 ? 'anchor' : ''}
          </text>
        </g>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        dI(1/m)
      </text>
      <text x={padL + plotW / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={10.5}>
        dI zigzag across m=18..21 (signs -, +, -)
      </text>
    </svg>
  );
}

export default function Imp95792DiZigzagViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Four-Moduli dI Zigzag Band (imp-95765 / imp-95749 / imp-95746)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> conditional on the +4 offset
        hypothesis (verified only at m=20; imp-95720/95745/95746). imp-95765 fed the imp-95746
        faithful J_raw at m=18,19,20,21 through the imp-95724 exact split; this page re-plots that
        frozen four-point dI table verbatim (no new quadrature). Model seam family only; changes no
        Lambda bound; NO QED; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The rho-carrying dI moves at all four moduli, spanning a{' '}
        <strong style={{ color: '#f59e0b' }}>{DI_SPREAD.toExponential(3)}</strong>-wide band, about{' '}
        <strong style={{ color: '#f59e0b' }}>{SIGNAL_TO_FLOOR.toExponential(2)}x</strong> the 1e-9
        quadrature floor: the signal is resolved, not noise. But the three consecutive differences
        carry signs (&minus;, +, &minus;) &mdash; a zigzag inherited from the non-monotone imp-95746
        Q_0 zeta(3) sector, not a clean monotone rho-trend.
      </p>

      <DiZigzagChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>m</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>dI(1/m)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>consec. diff</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sign</th>
          </tr>
        </thead>
        <tbody>
          {DI_TABLE.map((r, i) => {
            const diff = i > 0 ? CONSEC_DIFFS[i - 1] : null;
            return (
              <tr key={r.m} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
                <td style={{ padding: '3px 0' }}>{r.m}{r.m === 20 ? ' (anchor)' : ''}</td>
                <td style={{ textAlign: 'right' }}>{r.rho.toFixed(6)}</td>
                <td style={{ textAlign: 'right' }}>{r.dI.toFixed(10)}</td>
                <td style={{ textAlign: 'right' }}>{diff ? diff.delta.toExponential(3) : '—'}</td>
                <td style={{ textAlign: 'right', color: diff ? (diff.delta > 0 ? UP_COLOR : DOWN_COLOR) : '#64748b' }}>
                  {diff ? (diff.delta > 0 ? '+' : '−') : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-95765 dI table (no re-derivation). Four conditional points, not four certified anchors
        &mdash; only m=20 carries an independent certified kappa. Catalan G irrationality OPEN; Sun
        arXiv:2609.04176 single-author, unrefereed; NO Lambda movement; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; NO QED.
      </div>
    </div>
  );
}
