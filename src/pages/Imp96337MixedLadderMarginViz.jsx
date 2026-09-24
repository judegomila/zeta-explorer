import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96337_RUNG_SERIES,
  IMP96337_THRESHOLD_SERIES,
  IMP96337_ANCHORS,
  IMP96337_HONEST_BANNER,
} from '../data/imp-96337-mixed-ladder-margin-viz-data.js';

function RungMarginChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const log2 = (v) => Math.log(v) / Math.log(2);
  const xMin = log2(1);
  const xMax = log2(30);
  const yMin = 0;
  const yMax = 0.4;

  const xOf = (u) => padL + ((log2(u) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [0, 0.1, 0.2, 0.3, 0.4];
  const xTicks = [2, 3, 4, 6, 8, 12, 16, 24];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}

      {/* ceiling (s_2 = 0.353553) reference line -- the modulus-1 gap sits above this */}
      <line x1={padL} y1={yOf(IMP96337_ANCHORS.ceiling)} x2={padL + plotW} y2={yOf(IMP96337_ANCHORS.ceiling)} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {IMP96337_RUNG_SERIES.map((p) => (
        <g key={`rung-${p.u}`}>
          <line x1={xOf(p.u)} y1={yOf(0)} x2={xOf(p.u)} y2={yOf(p.s)} stroke="#f472b6" strokeWidth={4} opacity={0.9} />
          <line x1={xOf(p.u)} y1={yOf(p.s)} x2={xOf(p.u)} y2={yOf(IMP96337_ANCHORS.ceiling)} stroke="#38bdf8" strokeWidth={4} opacity={0.55} />
        </g>
      ))}

      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={7.5}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        u = 2^a 3^b (log2 axis, leading ten S-units, u = 2..24)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke="#f472b6" strokeWidth={4} />
        <text x={22} y={3} fill="#94a3b8" fontSize={8.5}>rung magnitude s_u = u^(-1/2)/2</text>
        <line x1={0} y1={16} x2={18} y2={16} stroke="#38bdf8" strokeWidth={4} opacity={0.55} />
        <text x={22} y={19} fill="#94a3b8" fontSize={8.5}>margin below ceiling, s_2 - s_u</text>
        <line x1={0} y1={30} x2={18} y2={30} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" />
        <text x={22} y={33} fill="#94a3b8" fontSize={8.5}>ceiling s_2 = {IMP96337_ANCHORS.ceiling.toFixed(6)} (attained only at u = 2)</text>
      </g>
    </svg>
  );
}

function ThresholdCountChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 50;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 0.05;
  const xMax = 0.30;
  const yMin = 0;
  const yMax = 20;

  const xOf = (t) => padL + plotW - ((t - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  // step path: for a series sorted threshold-ascending (count non-increasing),
  // draw a right-continuous step from each row out to the next threshold.
  const stepPath = IMP96337_THRESHOLD_SERIES.map((row, i) => {
    const isFirst = i === 0;
    const seg = `${isFirst ? 'M' : 'L'} ${xOf(row.threshold).toFixed(2)} ${yOf(row.count).toFixed(2)}`;
    const next = IMP96337_THRESHOLD_SERIES[i + 1];
    if (!next) return seg;
    return `${seg} L ${xOf(next.threshold).toFixed(2)} ${yOf(row.count).toFixed(2)}`;
  }).join(' ');

  const yTicks = [0, 5, 10, 15, 20];
  const xTicks = IMP96337_THRESHOLD_SERIES.map((r) => r.threshold);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{v}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <path d={stepPath} fill="none" stroke="#facc15" strokeWidth={1.75} opacity={0.95} />

      {IMP96337_THRESHOLD_SERIES.map((row) => (
        <circle key={`t-${row.threshold}`} cx={xOf(row.threshold)} cy={yOf(row.count)} r={2.8} fill="#facc15" />
      ))}

      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={7.5}>
          {v.toFixed(2)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        threshold t (descending right-to-left, larger t = fewer qualifying rungs)
      </text>
    </svg>
  );
}

export default function Imp96337MixedLadderMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96270: Mixed {oo,2,3} Ladder Spectral-Gap Margin" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96337_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96270 tabulated the mixed 2^a 3^b {'{'}oo,2,3{'}'} S-unit prolate ladder tail: every rung
        magnitude s_u = u^(-1/2)/2 sits at or below the ceiling s_2 = {IMP96337_ANCHORS.ceiling.toFixed(6)},
        {' '}a wide gap {IMP96337_ANCHORS.gapBelowOne.toFixed(6)} below the modulus-1 boundary, attained
        only once at u = 2. The second rung already drops to {IMP96337_ANCHORS.secondRung.toFixed(6)}
        {' '}(ratio {IMP96337_ANCHORS.secondRungRatio.toFixed(6)} = sqrt(2/3) to the ceiling), and the
        count of rungs within any margin of the ceiling is finite.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Rung magnitude s_u and margin below the ceiling (leading ten S-units)
      </h3>
      <RungMarginChart />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Rung-count within threshold (finite lattice-point count, t = 0.30..0.05)
      </h3>
      <ThresholdCountChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart stacks each rung's
        magnitude (pink) below its margin to the ceiling (blue); only u = 2 touches the dashed ceiling
        line, and every other rung sits with clear daylight beneath it. The bottom step chart shows the
        count of rungs at or above a threshold only grows to 19 by t = 0.05 &mdash; a finite,
        slowly-growing lattice-point count, not a dense accumulation toward modulus 1.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96270
        baked leadingMagnitudes and countAboveThreshold fields verbatim (only the margin and threshold
        reordering are computed here). This is a tabulation of the already-reduced imp-96143 fact (I):
        it diagonalizes nothing, establishes no operator positivity, and does not touch the
        finitely-many top confined states outside the ladder (the actual residual). Changes no bound,
        no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
