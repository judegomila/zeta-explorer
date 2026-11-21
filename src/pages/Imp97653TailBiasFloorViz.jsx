import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97653_LADDER_ROWS,
  IMP97653_SNR_ROWS,
  IMP97653_SUMMARY,
} from '../data/imp-97653-krein-tail-bias-floor-viz-data.js';
import { ED } from '../styles/tokens.js';

const KIND_COLORS = Object.freeze({
  floor: ED.series8,
  signal: ED.series2,
  bar: ED.series1,
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
            <text x={padL - 10} y={y + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
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
            <text x={barEnd + 8} y={y + 4} textAnchor="start" fill={ED.ink} fontSize={9.5}>
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
        stroke={ED.rule}
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
            <text x={padL - 10} y={y + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              {row.label}
            </text>
            <line
              x1={padL}
              y1={y}
              x2={xOf(row.factor)}
              y2={y}
              stroke={row.direction === 'above' ? ED.series3 : ED.brassDeco}
              strokeWidth={10}
              strokeLinecap="round"
            />
            <text x={xOf(row.factor) + 8} y={y + 4} textAnchor="start" fill={ED.ink} fontSize={9.5}>
              {row.factor.toExponential(2)}x {row.direction}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT - 4} x2={padL} y2={padT + rowH * IMP97653_SNR_ROWS.length} stroke={ED.rule} strokeWidth={1} />
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
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97625 floor-assessment literals verbatim (no re-derivation, no
        new computation). Assessment only; the m=1/m=2 Krein enclosure stays unusable at 2a = ln3;
        interval-rigorous reach stays 2a &le; 0.96. Changes no bound; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97653_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Signal-vs-floor ladder (log scale): two floors, the resolved signal, the tail bar
      </h3>
      <LogLadderChart />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--ink-faint)' }}>&#9632; measurement floors</span>
        <span style={{ color: 'var(--series-2)' }}>&#9632; resolved |relBias(3.36)| signal</span>
        <span style={{ color: 'var(--series-1)' }}>&#9632; imp-97497 tail bar</span>
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Margins: how far the signal clears each floor, and clears under the tail bar
      </h3>
      <MarginChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97653_SUMMARY.verdict}
      </div>
    </div>
  );
}
