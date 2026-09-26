import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97171_SLOPE_BAND_ROWS,
  IMP97171_COMPARISON_ROWS,
  IMP97171_VERDICT,
} from '../data/imp-97171-route-m-farfield-slopeband-vs-original-viz-data.js';

// imp-97214: the imp-97171 viz-data leaf (imp-97142 propagated fPctVsLine interval vs the imp-96982
// original credible band) had no chart consumer yet. This page renders both bands on one shared
// percentage axis as a range chart, with the three imp-97142 slope-sweep points (lo/center/hi)
// marked inside the propagated band, so the "entire propagated interval sits below the original
// floor" verdict is visible at a glance.

const SERIES_COLOR = {
  'imp-97142 propagated interval': '#38bdf8',
  'imp-96982 original band': '#f87171',
};

function RangeChart({ comparisonRows, slopeRows }) {
  const svgW = 680;
  const rowH = 60;
  const padL = 60;
  const padR = 30;
  const padT = 24;
  const padB = 40;
  const svgH = padT + comparisonRows.length * rowH + padB;
  const cW = svgW - padL - padR;

  const allPct = [
    ...comparisonRows.flatMap((r) => [r.loPct, r.hiPct]),
    ...slopeRows.map((r) => r.fPctVsLine),
  ];
  const minPct = Math.min(...allPct) - 1;
  const maxPct = Math.max(...allPct) + 1;
  const xAt = (v) => padL + ((v - minPct) / (maxPct - minPct)) * cW;

  const zeroX = xAt(0);
  const ticks = [];
  for (let t = Math.ceil(minPct); t <= Math.floor(maxPct); t += 2) ticks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* zero-line reference */}
      <line x1={zeroX} y1={padT - 8} x2={zeroX} y2={svgH - padB + 4} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
      <text x={zeroX} y={padT - 12} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="monospace">
        0%
      </text>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={svgH - padB} x2={xAt(t)} y2={svgH - padB + 4} stroke="#475569" strokeWidth={1} />
          <text x={xAt(t)} y={svgH - padB + 16} textAnchor="middle" fill="#64748b" fontSize={8.5} fontFamily="monospace">
            {t}%
          </text>
        </g>
      ))}
      <text x={svgW - padR} y={svgH - 6} textAnchor="end" fill="#64748b" fontSize={9.5} fontFamily="monospace">
        fPctVsLine &rarr;
      </text>

      {comparisonRows.map((row, idx) => {
        const y = padT + idx * rowH;
        const x1 = xAt(row.loPct);
        const x2 = xAt(row.hiPct);
        const color = SERIES_COLOR[row.series] || '#94a3b8';
        return (
          <g key={row.series}>
            <text x={padL - 8} y={y + rowH / 2 - 6} textAnchor="end" fill="#94a3b8" fontSize={9} fontFamily="monospace">
              {row.series}
            </text>
            <rect x={x1} y={y + 14} width={Math.max(2, x2 - x1)} height={16} fill={color} opacity={0.85} rx={3} />
            <text x={x1} y={y + 44} fill="#e2e8f0" fontSize={8.5} fontFamily="monospace">
              {row.loPct}%
            </text>
            <text x={x2} y={y + 44} textAnchor="end" fill="#e2e8f0" fontSize={8.5} fontFamily="monospace">
              {row.hiPct}%
            </text>
          </g>
        );
      })}

      {/* imp-97142 slope-sweep points overlaid on the propagated-interval row */}
      {slopeRows.map((row) => {
        const y = padT + 0 * rowH + 22;
        const cx = xAt(row.fPctVsLine);
        return (
          <g key={row.label}>
            <circle cx={cx} cy={y} r={4} fill="#0f172a" stroke="#e2e8f0" strokeWidth={1.5} />
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97214RouteMFarfieldSlopebandVsOriginalViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Far-Field Slope-Band Interval vs Original Band" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.06)',
          borderLeft: '3px solid #64748b',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#e2e8f0' }}>Honest status:</strong> the imp-97142 propagated interval
        [-2.035%, +0.389%] (blue) sits entirely below the imp-96982 original credible band
        [+1.369%, +8.356%] (red), with the closest approach ~0.98 percentage points apart. This is a
        presentation of an already-established measurement; no bound on &Lambda; moves; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Range chart on a shared fPctVsLine axis. The three small markers on the blue bar are the
        imp-97142 slope-sweep points (s* = 5.66, 5.76, 5.80) that generate the propagated interval.
      </p>
      <RangeChart comparisonRows={IMP97171_COMPARISON_ROWS} slopeRows={IMP97171_SLOPE_BAND_ROWS} />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97171_VERDICT.conclusion}
      </div>
    </div>
  );
}
