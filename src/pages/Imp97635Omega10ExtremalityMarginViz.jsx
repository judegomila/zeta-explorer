import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97635_MARGIN_ROWS,
  IMP97635_SUMMARY,
} from '../data/imp-97635-omega10-extremality-margin-viz-data.js';

// Bar chart: both bars measured up from the T=0 MCM-failure baseline, so the margin above zero is
// visible directly, alongside the small gap between the primorial and its nearest competitor.
function ExtremalityMarginChart() {
  const svgW = 560;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 70;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const rows = IMP97635_MARGIN_ROWS;
  const n = rows.length;
  const slot = plotW / n;
  const barW = slot * 0.4;

  const maxT = Math.max(...rows.map((r) => r.T));
  const scale = (plotH - 20) / maxT;
  const zeroY = padT + plotH;
  const yOf = (v) => zeroY - v * scale;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke="#334155" strokeWidth={1} />
      <text x={padL - 6} y={zeroY + 4} textAnchor="end" fill="#64748b" fontSize={9}>
        T = 0 (MCM failure)
      </text>
      <line x1={padL} y1={padT} x2={padL} y2={zeroY} stroke="#334155" strokeWidth={1} />

      {rows.map((r, i) => {
        const cx = padL + i * slot + slot / 2;
        const x = cx - barW / 2;
        const y = yOf(r.T);
        const fill = r.key === 'primorial' ? '#4ade80' : '#f87171';
        return (
          <g key={r.key}>
            <rect x={x} y={y} width={barW} height={zeroY - y} fill={fill} opacity={0.85} />
            <text x={cx} y={y - 8} textAnchor="middle" fill="#cbd5e1" fontSize={10}>
              {r.T.toExponential(4)}
            </text>
            <text x={cx} y={zeroY + 20} textAnchor="middle" fill="#94a3b8" fontSize={8.5}>
              {r.label}
            </text>
          </g>
        );
      })}

      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        T (surrogate + R_corr)
      </text>
    </svg>
  );
}

export default function Imp97635Omega10ExtremalityMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="omega=10 Primorial Extremality Margin: Primorial vs Nearest Competitor (imp-97635 / imp-97606)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a presentation-only page charting a
        frozen measurement verbatim (no re-derivation, no new computation). Changes no bound; the b/4
        ceiling is untouched; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97635_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        At omega=10, the primorial (green) is the strict minimiser of T over all 20,437 tested sets; the
        nearest non-primorial competitor (red, top prime 29&nbsp;-&gt;&nbsp;31) sits just above it. Both
        stay strictly above the T=0 line where MCM would fail:
      </p>
      <ExtremalityMarginChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>set</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'left', paddingBottom: 4, paddingLeft: 12 }}>note</th>
          </tr>
        </thead>
        <tbody>
          {IMP97635_MARGIN_ROWS.map((r) => (
            <tr key={r.key} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.T.toExponential(6)}</td>
              <td style={{ paddingLeft: 12, color: '#64748b' }}>{r.note}</td>
            </tr>
          ))}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97635_SUMMARY.verdict}
      </div>
    </div>
  );
}
