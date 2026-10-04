import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96679_LADDER,
  IMP96679_MEASURED_DOUBLINGS,
  IMP96679_TWO_FOLD_FACTOR,
  IMP96679_ARGMIN_JUMPS,
  IMP96679_OSCILLATION,
  IMP96679_READING,
} from '../data/imp-96679-gmin-ratio-sawtooth-viz-data.js';
import { ED } from '../styles/tokens.js';

// log-log chart: N (50..1e6) on the x-axis, ratioOverGue = g_min(N)/(0.8582 N^-1/3)
// on the y-axis. Yellow points continue an argmin-freeze plateau (rise as
// N^{+1/3}, x1.2599 per doubling); orange-ringed points mark a fresh record
// gap that resets the numerator. Dashed line at y=1 is the GUE median crossing.
function RatioSawtoothPanel() {
  const rows = IMP96679_LADDER;
  const svgW = 720;
  const padL = 50;
  const padR = 24;
  const svgH = 340;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logNMin = Math.log10(40);
  const logNMax = Math.log10(1.3e6);
  const logYMin = Math.log10(0.75);
  const logYMax = Math.log10(2.6);

  const xOf = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (ratio) => padT + plotH - ((Math.log10(ratio) - logYMin) / (logYMax - logYMin)) * plotH;

  const path = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.ratioOverGue)}`).join(' ');

  const xTicks = [100, 1000, 10000, 100000, 1000000];
  const yTicks = [0.8, 1, 1.5, 2, 2.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line
            x1={padL}
            y1={yOf(v)}
            x2={padL + plotW}
            y2={yOf(v)}
            stroke={v === 1 ? ED.series2 : ED.ruleSoft}
            strokeWidth={1}
            strokeDasharray={v === 1 ? '5 3' : undefined}
          />
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

      <text x={padL + 6} y={yOf(1) - 5} fill={ED.series2} fontSize={8.5}>
        GUE median (ratioOverGue = 1)
      </text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={1.4} />
      {rows.map((row) => (
        <circle
          key={`pt${row.N}`}
          cx={xOf(row.N)}
          cy={yOf(row.ratioOverGue)}
          r={row.isPlateau ? 4.4 : 3}
          fill={row.isPlateau ? ED.brassDeco : row.isReset ? ED.series1 : '#94a3b8'}
          stroke={row.isReset ? ED.series4 : row.isPlateau ? '#78350f' : 'none'}
          strokeWidth={row.isReset || row.isPlateau ? 1.4 : 0}
        />
      ))}

      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (number of zeros)
      </text>
      <text
        x={-(padT + plotH / 2)}
        y={14}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9}
        transform="rotate(-90)"
      >
        ratioOverGue = g_min(N) / (0.8582 N^-1/3)
      </text>
    </svg>
  );
}

export default function Imp96679GminRatioSawtoothViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="GUE Running-Min Sawtooth: ratioOverGue Plateaus and Record-Gap Resets" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96654 showed that the imp-96616 running-min ratio ratioOverGue = g<sub>min</sub>(N) /
        (0.8582&nbsp;N<sup>-1/3</sup>) is a two-sided sawtooth about the GUE median (range{' '}
        {IMP96679_OSCILLATION.min.toFixed(4)}&ndash;{IMP96679_OSCILLATION.max.toFixed(4)}, RMS
        deviation {IMP96679_OSCILLATION.rmsDeviationFromOne.toFixed(4)}): on each argmin-freeze
        plateau, where the running-min record gap has not moved, ratioOverGue climbs exactly as
        N<sup>+1/3</sup> (&times;{IMP96679_TWO_FOLD_FACTOR.toFixed(4)} per doubling of N); each new
        record gap resets the numerator and starts a fresh climb.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        ratioOverGue over the 14-rung ladder (log-log)
      </h3>
      <RatioSawtoothPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> yellow-ringed points continue
        an argmin-freeze plateau (numerator g<sub>min</sub>(N) unchanged, ratioOverGue rising as
        N<sup>+1/3</sup>); the four measured doublings all match &times;
        {IMP96679_MEASURED_DOUBLINGS[0].factor.toFixed(4)} to 4 sig figs, e.g. N=
        {IMP96679_MEASURED_DOUBLINGS[0].from}&rarr;{IMP96679_MEASURED_DOUBLINGS[0].to}:{' '}
        {IMP96679_MEASURED_DOUBLINGS[0].ratioOverGueFrom.toFixed(4)}&rarr;
        {IMP96679_MEASURED_DOUBLINGS[0].ratioOverGueTo.toFixed(4)}. Orange-ringed points mark a fresh
        record gap (argmin index jumps {IMP96679_ARGMIN_JUMPS.join(' → ')}), which resets the
        numerator and can snap ratioOverGue below the dashed median line, as it does twice
        (N=5000, N=5e5).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96679
        viz-data (ladder reused verbatim from imp-96616, sawtooth/doubling analysis reused verbatim
        from imp-96654). {IMP96679_READING}
      </div>
    </div>
  );
}
