import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124824_LADDER_ROWS,
  IMP124824_CROSSOVER,
  IMP124824_SUMMARY,
} from '../data/imp-124824-ecf-stencil-crossover-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-124769 E_CF finite-difference error ladder verbatim (no new computation):
// errCF(1e-3) falls monotonically L2 -> L5 tracking a clean O(eps^2) truncation power law,
// bottoms at the round-off floor R, then turns back up at L6 past the pinned crossover.

function ErrCfLadderChart() {
  const svgW = 720;
  const svgH = 280;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logErr = IMP124824_LADDER_ROWS.map((r) => Math.log10(r.errCF_at_1em3));
  const minV = Math.min(...logErr);
  const maxV = Math.max(...logErr);
  const span = maxV - minV;
  const yAt = (v) => padT + cH - ((v - minV) / span) * cH;
  const xStep = cW / (IMP124824_LADDER_ROWS.length - 1);

  const points = IMP124824_LADDER_ROWS.map((r, i) => ({
    x: padL + i * xStep,
    y: yAt(Math.log10(r.errCF_at_1em3)),
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
        <g key={p.r.key}>
          <circle cx={p.x} cy={p.y} r={4.5} fill={p.r.key === 'L5' ? ED.brass : ED.series1} />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill={ED.ink} fontSize={9.5} fontWeight={700}>
            {p.r.errCF_at_1em3.toExponential(1)}
          </text>
          <text x={p.x} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
            {p.r.key}
          </text>
          <text x={p.x} y={padT + cH + 29} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            sigma={p.r.sigma}
          </text>
        </g>
      ))}

      <text x={padL - 60} y={padT - 6} fill={ED.inkFaint} fontSize={9}>log10 errCF(1e-3)</text>
    </svg>
  );
}

export default function Imp124824EcfStencilCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_CF Stencil Noise-Floor Crossover (imp-124769)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP124824_SUMMARY.law}
      </p>
      <ErrCfLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Crossover: |E_CF|_crit &asymp; {IMP124824_CROSSOVER.E_CF_crit.toExponential(2)} (sigma_crit &asymp;{' '}
        {IMP124824_CROSSOVER.sigma_crit.toExponential(2)}), strictly between {IMP124824_CROSSOVER.bracket_high} and{' '}
        {IMP124824_CROSSOVER.bracket_low}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124824_SUMMARY.verdict}
      </div>
    </div>
  );
}
