import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124882_DPS_ROWS,
  IMP124882_SUMMARY,
} from '../data/imp-124882-dps-invariance-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-124849 dps-invariance ladder verbatim (no new computation): the round-off
// floor R and the eps-ladder crossover sigma_crit as working precision dps sweeps 15 -> 140,
// jumping once from the double-precision pin to a dps-invariant extended-precision floor.

function DpsLadderChart() {
  const svgW = 720;
  const svgH = 280;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logR = IMP124882_DPS_ROWS.map((r) => Math.log10(r.R));
  const minV = Math.min(...logR);
  const maxV = Math.max(...logR);
  const span = maxV - minV;
  const yAt = (v) => padT + cH - ((v - minV) / span) * cH;
  const xStep = cW / (IMP124882_DPS_ROWS.length - 1);

  const points = IMP124882_DPS_ROWS.map((r, i) => ({
    x: padL + i * xStep,
    y: yAt(Math.log10(r.R)),
    r,
  }));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />

      {points.map((p) => (
        <g key={p.r.dps}>
          <circle cx={p.x} cy={p.y} r={4.5} fill={p.r.dps === 15 ? ED.brass : ED.series1} />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill={ED.ink} fontSize={9.5} fontWeight={700}>
            {p.r.R.toExponential(1)}
          </text>
          <text x={p.x} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
            dps={p.r.dps}
          </text>
          <text x={p.x} y={padT + cH + 29} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            sigma_crit={p.r.sigma_crit.toFixed(5)}
          </text>
        </g>
      ))}

      <text x={padL - 60} y={padT - 6} fill={ED.inkFaint} fontSize={9}>log10 R</text>
    </svg>
  );
}

export default function Imp124882DpsInvarianceLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="DPS-Invariance Ladder: Round-Off Floor R vs Working Precision (imp-124849)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP124882_SUMMARY.law}
      </p>
      <DpsLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Extended-precision floor: R &asymp; {IMP124882_SUMMARY.extprec_floor.R.toExponential(4)}, sigma_crit &asymp;{' '}
        {IMP124882_SUMMARY.extprec_floor.sigma_crit}, dps-invariant for every dps &ge; 30 (double-precision pin:
        R &asymp; {IMP124882_SUMMARY.dp_baseline.R_inf.toExponential(2)}).
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124882_SUMMARY.verdict}
      </div>
    </div>
  );
}
