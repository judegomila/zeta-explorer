import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96438_FULL_LADDER,
  IMP96438_BAND,
  IMP96438_VERDICT,
  IMP96438_HONEST_BANNER,
} from '../data/imp-96438-route-m-full-ladder-viz-data.js';
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

// line + point chart of ratio(N) = d_N^2 log N / C_burnol over the FULL
// combined ladder N=250..6000 (imp-96094 dense ladder + imp-96105
// extension), against the ratio=1 (RH + simple zeros) target line and the
// band the full ladder occupies.
function FullLadderPanel() {
  const rows = IMP96438_FULL_LADDER;
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minN = rows[0].N;
  const maxN = rows[rows.length - 1].N;
  const minY = 0.955;
  const maxY = 1.015;
  const xOf = (N) => padL + ((N - minN) / (maxN - minN)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const yTicks = [0.96, 0.97, 0.98, 0.99, 1.0, 1.01];
  const xTicks = [250, 1000, 2000, 2600, 4000, 5000, 6000];

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="N"
      yLabel="ratio(N) = d_N² log N / C_burnol"
    >
      <rect
        x={padL}
        y={yOf(IMP96438_BAND.hi)}
        width={plotW}
        height={yOf(IMP96438_BAND.lo) - yOf(IMP96438_BAND.hi)}
        fill={ED.series1}
        opacity={0.06}
      />
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
      <text x={padL + plotW - 4} y={yOf(1) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        ratio = 1 (RH + simple zeros)
      </text>
      {/* boundary between the imp-96094 dense ladder and the imp-96105 extension */}
      <line x1={xOf(2600)} y1={padT} x2={xOf(2600)} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.N)},${yOf(r.ratio)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.9}
      />
      {rows.map((r) => (
        <circle
          key={r.N}
          cx={xOf(r.N)}
          cy={yOf(r.ratio)}
          r={r.N === IMP96438_BAND.loN || r.N === IMP96438_BAND.hiN ? 4 : 2.5}
          fill={
            r.N === IMP96438_BAND.loN || r.N === IMP96438_BAND.hiN
              ? ED.brassDeco
              : r.source === 'imp-96105' ? ED.series5 : ED.series1
          }
        />
      ))}
      {xTicks.map((N) => (
        <text key={N} x={xOf(N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {N}
        </text>
      ))}
    </AxisFrame>
  );
}

export default function Imp96438RouteMFullLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title={`Route M: Full Burnol-Ratio Ladder (N=${IMP96438_VERDICT.nMin}..${IMP96438_VERDICT.nMax})`} />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96438_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-96094 dense ladder (N=250..2600, blue points) and the imp-96105 SPD-Gram
        extension (N=3000..6000, purple points) are merged here into a single{' '}
        {IMP96438_VERDICT.rungCount}-rung series and plotted as one continuous curve against the
        ratio=1 (RH + simple zeros) target. The full range oscillates inside{' '}
        [{IMP96438_BAND.lo.toFixed(4)}, {IMP96438_BAND.hi.toFixed(4)}] with{' '}
        {IMP96438_VERDICT.signChanges} sign changes &mdash; it does not tighten toward 1 as N grows.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        ratio(N) across N=250..6000 vs the ratio=1 target
      </h3>
      <FullLadderPanel />

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
        marks N=2600, the boundary between the imp-96094 dense ladder (blue) and the imp-96105
        extension (purple); the highlighted points are the low point at N={IMP96438_BAND.loN} and
        the high point at N={IMP96438_BAND.hiN}. {IMP96438_VERDICT.conclusion}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96438
        merged viz-data (every value copied verbatim from IMP96094_ROWS / IMP96105_EXT_ROWS, no
        re-derivation of the underlying Gram / Cholesky numerics). {IMP96438_HONEST_BANNER}
      </div>
    </div>
  );
}
