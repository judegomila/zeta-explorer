import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97651_RATIO_ROWS,
  IMP97651_EXTRAPOLATOR_ROWS,
  IMP97651_SUMMARY,
} from '../data/imp-97651-tra2-ratio-drift-viz-data.js';

// Bar chart: two successive 80-step ratios climbing toward 1 (algebraic-tail signature).
function RatioDriftChart() {
  const svgW = 420;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 180;
  const svgH = padT + plotH + padB;
  const barW = 90;

  const yOf = (ratio) => padT + plotH - ratio * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* ratio = 1 reference line */}
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke="#64748b" strokeDasharray="4 3" strokeWidth={1} />
      <text x={padL + plotW} y={yOf(1) - 4} textAnchor="end" fill="#64748b" fontSize={9}>
        ratio = 1
      </text>

      {IMP97651_RATIO_ROWS.map((row, i) => {
        const cx = padL + plotW * ((i + 0.5) / IMP97651_RATIO_ROWS.length);
        const barY = yOf(row.ratio);
        return (
          <g key={row.label}>
            <rect
              x={cx - barW / 2}
              y={barY}
              width={barW}
              height={padT + plotH - barY}
              fill={i === 0 ? '#60a5fa' : '#f59e0b'}
              opacity={0.85}
            />
            <text x={cx} y={barY - 6} textAnchor="middle" fill="#cbd5e1" fontSize={10.5}>
              {row.ratio.toFixed(6)}
            </text>
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {row.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Horizontal bar chart: three extrapolators clustering vs the imp-97482 named line.
function ExtrapolatorClusterChart() {
  const svgW = 640;
  const padL = 180;
  const padR = 30;
  const padT = 16;
  const rowH = 32;
  const plotW = svgW - padL - padR;
  const svgH = padT + rowH * IMP97651_EXTRAPOLATOR_ROWS.length + 10;

  const vals = IMP97651_EXTRAPOLATOR_ROWS.map((r) => r.valueM);
  const vMin = Math.min(...vals) - 0.05;
  const vMax = Math.max(...vals) + 0.05;
  const xOf = (v) => padL + ((v - vMin) / (vMax - vMin)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP97651_EXTRAPOLATOR_ROWS.map((row, i) => {
        const y = padT + i * rowH;
        const isNamed = i === IMP97651_EXTRAPOLATOR_ROWS.length - 1;
        return (
          <g key={row.label}>
            <text x={padL - 10} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {row.label}
            </text>
            <line
              x1={xOf(vMin)}
              y1={y + rowH / 2}
              x2={xOf(row.valueM)}
              y2={y + rowH / 2}
              stroke={isNamed ? '#f87171' : '#60a5fa'}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <text
              x={xOf(row.valueM) + 8}
              y={y + rowH / 2 + 4}
              fill="#cbd5e1"
              fontSize={10}
            >
              {row.valueM.toFixed(3)}M
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97651Tra2RatioDriftViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="tr(A2) Uniform-80-Block Ratio Drift Toward 1 (imp-97651 / imp-97599)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97599 tr(A2) ladder literals verbatim (no re-derivation, no new
        computation). Decides only the tail MODEL (algebraic, not geometric); no constant is pinned as
        rigorous. Changes no bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97651_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        The successive 80-step ratio climbs toward 1 rather than staying constant -- the algebraic-tail
        signature:
      </p>
      <RatioDriftChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1.25rem 0 0.5rem' }}>
        Yet the geometric, Aitken, and algebraic extrapolators still cluster tightly, sitting below the
        imp-97482 named ~4819.1M line:
      </p>
      <ExtrapolatorClusterChart />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97651_SUMMARY.verdict}
      </div>
    </div>
  );
}
