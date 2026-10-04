import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96941_PERIODOGRAM_SERIES,
  IMP96941_NYQUIST_LINE,
  IMP96941_HONEST_BANNER,
} from '../data/imp-96941-lombscargle-periodogram-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// stem/spike periodogram of the 21-rung Burnol-ratio ladder: the claimed w=3.85
// frequency and its alias image share identical power, both dwarfed by the
// genuine low-frequency peak at w=0.70 -- with the Nyquist line pi=3.1416
// separating the resolvable region (left) from the unresolvable alias zone (right).
function PeriodogramPanel() {
  const rows = IMP96941_PERIODOGRAM_SERIES;
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minW = 0;
  const maxW = 4.2;
  const minY = 0;
  const maxY = 5.6;
  const xOf = (w) => padL + ((w - minW) / (maxW - minW)) * plotW;
  const yOf = (p) => padT + plotH - ((p - minY) / (maxY - minY)) * plotH;
  const xTicks = [0, 1, 2, 3, 4];
  const yTicks = [0, 1, 2, 3, 4, 5];
  const colorFor = (row) => (row.isAlias ? ED.series4 : row.resolvable ? ED.series3 : ED.series2);

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="w (rad/sample)"
      yLabel="normalized Lomb power"
    >
      <rect
        x={xOf(IMP96941_NYQUIST_LINE)}
        y={padT}
        width={plotW - (xOf(IMP96941_NYQUIST_LINE) - padL)}
        height={plotH}
        fill={ED.series2}
        opacity={0.05}
      />
      <line
        x1={xOf(IMP96941_NYQUIST_LINE)}
        y1={padT}
        x2={xOf(IMP96941_NYQUIST_LINE)}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={xOf(IMP96941_NYQUIST_LINE) + 4} y={padT + 10} fill={ED.inkSoft} fontSize={8.5}>
        Nyquist pi={IMP96941_NYQUIST_LINE.toFixed(4)}
      </text>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((w) => (
        <g key={`x${w}`}>
          <line x1={xOf(w)} y1={padT + plotH} x2={xOf(w)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(w)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {w}
          </text>
        </g>
      ))}
      {rows.map((row) => (
        <g key={row.label}>
          <line
            x1={xOf(row.w)}
            y1={yOf(0)}
            x2={xOf(row.w)}
            y2={yOf(row.power)}
            stroke={colorFor(row)}
            strokeWidth={3}
          />
          <circle cx={xOf(row.w)} cy={yOf(row.power)} r={4} fill={colorFor(row)} />
          <text
            x={xOf(row.w)}
            y={yOf(row.power) - 8}
            textAnchor="middle"
            fill={colorFor(row)}
            fontSize={8.5}
          >
            {row.label}
          </text>
        </g>
      ))}
    </AxisFrame>
  );
}

export default function Imp97041NyquistAliasPeriodogramViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96832 Nyquist-Alias Relabel: Periodogram" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96941_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-96832 note attributed the 21-rung Burnol-ratio anticorrelation lobe to a best-fit
        frequency w=3.85 rad/sample. The periodogram below shows why that label is wrong: w=3.85
        (red) sits inside the shaded above-Nyquist zone (unresolvable for unit-spaced samples) and
        shares identical power with its resolvable alias image at 2pi-3.85=2.4332 (amber), while the
        genuine, leave-one-out-robust peak sits at w=0.70 (green), ~13x stronger.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Periodogram: claimed frequency vs alias image vs genuine peak
      </h3>
      <PeriodogramPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the dashed vertical line
        marks the Nyquist frequency pi=3.1416; everything to its right (shaded) is unresolvable for
        the unit-spaced 21-rung ladder. The claimed w=3.85 spike falls in that shaded zone and is the
        alias mirror of the resolvable 2.4332 spike (identical height) -- the genuine spectral
        content is the tall green spike at w=0.70.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96941
        viz-data leaf verbatim (no re-derivation of the underlying Lomb-Scargle numerics). Presentation
        only; every ACF/VIF number is unchanged by the relabel; RH-free; NO QED.
      </div>
    </div>
  );
}
