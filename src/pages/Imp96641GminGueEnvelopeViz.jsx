import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96641_LADDER,
  IMP96641_FIT,
  IMP96641_GUE_MEDIAN_CONSTANT,
  IMP96641_PLATEAU_ARGMIN_IDX,
  IMP96641_READING,
} from '../data/imp-96641-gmin-gue-envelope-viz-data.js';
import { ED } from '../styles/tokens.js';

// log-log chart: N (50..1e6) on the x-axis, g_min(N)/y_N on the y-axis,
// measured running-min ladder (staircase, plateaus marked) against the
// GUE median envelope 0.8582 N^{-1/3}.
function GminEnvelopePanel() {
  const rows = IMP96641_LADDER;
  const svgW = 720;
  const padL = 60;
  const padR = 24;
  const svgH = 340;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logNMin = Math.log10(40);
  const logNMax = Math.log10(1.3e6);
  const logYMin = Math.log10(0.006);
  const logYMax = Math.log10(0.6);

  const xOf = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (ratio) => padT + plotH - ((Math.log10(ratio) - logYMin) / (logYMax - logYMin)) * plotH;

  const measuredPath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.ratio)}`).join(' ');

  const gueN = [50, 100, 300, 1000, 3000, 10000, 30000, 100000, 300000, 1000000];
  const guePath = gueN
    .map((N, i) => {
      const y = IMP96641_GUE_MEDIAN_CONSTANT * Math.pow(N, -1 / 3);
      return `${i === 0 ? 'M' : 'L'} ${xOf(N)} ${yOf(y)}`;
    })
    .join(' ');

  const xTicks = [100, 1000, 10000, 100000, 1000000];
  const yTicks = [0.01, 0.03, 0.1, 0.3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((N) => (
        <g key={`x${N}`}>
          <line x1={xOf(N)} y1={padT} x2={xOf(N)} y2={padT + plotH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xOf(N)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {N >= 1000 ? `${N / 1000}k` : N}
          </text>
        </g>
      ))}

      <path d={guePath} fill="none" stroke={ED.series3} strokeWidth={1.4} strokeDasharray="4 3" />
      <text x={padL + plotW - 4} y={yOf(0.3) - 6} textAnchor="end" fill={ED.series3} fontSize={8.5}>
        GUE median {IMP96641_GUE_MEDIAN_CONSTANT} N^-1/3
      </text>

      <path d={measuredPath} fill="none" stroke={ED.series1} strokeWidth={1.6} />
      {rows.map((row) => (
        <circle
          key={`pt${row.N}`}
          cx={xOf(row.N)}
          cy={yOf(row.ratio)}
          r={row.isPlateau ? 4.2 : 2.6}
          fill={row.isPlateau ? ED.brassDeco : ED.series1}
          stroke={row.isPlateau ? '#78350f' : 'none'}
          strokeWidth={row.isPlateau ? 1 : 0}
        />
      ))}

      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (number of zeros)
      </text>
      <text
        x={-(padT + plotH / 2)}
        y={16}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9}
        transform="rotate(-90)"
      >
        g_min(N) / y_N
      </text>
    </svg>
  );
}

export default function Imp96641GminGueEnvelopeViz() {
  const plateauRows = IMP96641_LADDER.filter((r) => r.isPlateau);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="g_min(N)/y_N Extreme-Gap Decay vs. the GUE Median Envelope" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96616 measured the running-min normalized gap ratio g<sub>min</sub>(N)/y<sub>N</sub> over
        the first 2,001,052 Odlyzko zeros, fitting a power-law decay exponent{' '}
        {IMP96641_FIT.exponent.toFixed(4)} &mdash; close to, and slightly steeper than, the GUE
        cube-root extreme-gap exponent {IMP96641_FIT.gueExtremeGapExponent.toFixed(4)} &mdash; against
        the GUE median envelope {IMP96641_GUE_MEDIAN_CONSTANT} N<sup>-1/3</sup>.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Measured ladder (blue) vs. GUE median envelope (green, dashed), log-log
      </h3>
      <GminEnvelopePanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the yellow-ringed points mark
        the three argmin-freeze plateaus, where the running-min record gap has not moved since the
        previous rung (argmin zero index {plateauRows.map((r) => r.argminIdx).join(', ')}); consecutive
        N values on a plateau repeat the same ratio, biasing a naive slope fit. The measured staircase
        crosses below the GUE median twice (N=5000, N=5e5) and above it elsewhere, tracking it to
        within a factor 0.90..2.21 across the whole range.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96641
        viz-data (ladder reused verbatim from imp-96616). {IMP96641_READING}
      </div>
    </div>
  );
}
