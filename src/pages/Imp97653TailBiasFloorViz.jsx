import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97653_LADDER_ROWS,
  IMP97653_SNR_ROWS,
  IMP97653_SUMMARY,
} from '../data/imp-97653-krein-tail-bias-floor-viz-data.js';

const KIND_COLORS = Object.freeze({
  floor: '#64748b',
  signal: '#f87171',
  bar: '#60a5fa',
});

// Log-scale horizontal bar ladder: two floors, the resolved signal, and the tail bar.
function LogLadderChart() {
  const svgW = 640;
  const padL = 190;
  const padR = 70;
  const padT = 16;
  const rowH = 46;
  const plotW = svgW - padL - padR;
  const svgH = padT + rowH * IMP97653_LADDER_ROWS.length + 10;

  const logs = IMP97653_LADDER_ROWS.map((r) => Math.log10(r.value));
  const lMin = Math.min(...logs) - 0.5;
  const lMax = Math.max(...logs) + 0.5;
  const xOf = (v) => padL + ((Math.log10(v) - lMin) / (lMax - lMin)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP97653_LADDER_ROWS.map((row, i) => {
        const y = padT + i * rowH + rowH / 2;
        const barX = padL;
        const barEnd = xOf(row.value);
        return (
          <g key={row.label}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {row.label}
            </text>
            <line
              x1={barX}
              y1={y}
              x2={barEnd}
              y2={y}
              stroke={KIND_COLORS[row.kind]}
              strokeWidth={10}
              strokeLinecap="round"
            />
            <text x={barEnd + 8} y={y + 4} textAnchor="start" fill="#cbd5e1" fontSize={9.5}>
              {row.value.toExponential(2)}
            </text>
          </g>
        );
      })}
      <line
        x1={padL}
        y1={padT - 4}
        x2={padL}
        y2={padT + rowH * IMP97653_LADDER_ROWS.length}
        stroke="#334155"
        strokeWidth={1}
      />
    </svg>
  );
}

// Margin bars: SNR/factor by which the signal clears each floor, and clears under the tail bar.
function MarginChart() {
  const svgW = 640;
  const padL = 190;
  const padR = 70;
  const padT = 16;
  const rowH = 40;
  const plotW = svgW - padL - padR;
  const svgH = padT + rowH * IMP97653_SNR_ROWS.length + 10;

  const logs = IMP97653_SNR_ROWS.map((r) => Math.log10(r.factor));
  const lMax = Math.max(...logs) + 0.5;
  const xOf = (v) => padL + (Math.log10(v) / lMax) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP97653_SNR_ROWS.map((row, i) => {
        const y = padT + i * rowH + rowH / 2;
        return (
          <g key={row.label}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {row.label}
            </text>
            <line
              x1={padL}
              y1={y}
              x2={xOf(row.factor)}
              y2={y}
              stroke={row.direction === 'above' ? '#34d399' : '#fbbf24'}
              strokeWidth={10}
              strokeLinecap="round"
            />
            <text x={xOf(row.factor) + 8} y={y + 4} textAnchor="start" fill="#cbd5e1" fontSize={9.5}>
              {row.factor.toExponential(2)}x {row.direction}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT - 4} x2={padL} y2={padT + rowH * IMP97653_SNR_ROWS.length} stroke="#334155" strokeWidth={1} />
    </svg>
  );
}

export default function Imp97653TailBiasFloorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Tail-Bias Signal vs Edge-Amplitude Floor (imp-97653 / imp-97625)" />

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
        page reshaping the frozen imp-97625 floor-assessment literals verbatim (no re-derivation, no
        new computation). Assessment only; the m=1/m=2 Krein enclosure stays unusable at 2a = ln3;
        interval-rigorous reach stays 2a &le; 0.96. Changes no bound; Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97653_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Signal-vs-floor ladder (log scale): two floors, the resolved signal, the tail bar
      </h3>
      <LogLadderChart />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <span style={{ color: '#64748b' }}>&#9632; measurement floors</span>
        <span style={{ color: '#f87171' }}>&#9632; resolved |relBias(3.36)| signal</span>
        <span style={{ color: '#60a5fa' }}>&#9632; imp-97497 tail bar</span>
      </div>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Margins: how far the signal clears each floor, and clears under the tail bar
      </h3>
      <MarginChart />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97653_SUMMARY.verdict}
      </div>
    </div>
  );
}
