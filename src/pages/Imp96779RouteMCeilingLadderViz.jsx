import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96779_BARS,
  IMP96779_RATIO_LABELS,
  IMP96779_VERDICT_SUMMARY,
  IMP96779_HONEST_BANNER,
} from '../data/imp-96779-route-m-ceiling-ladder-viz-data.js';

// Horizontal bar chart on a shared log10(N) axis: four ladder rungs
// (compute < trace-rigorous < Frobenius-rigorous < measured/fit), with the
// three adjacency ratios labelled between consecutive bars.
function LadderPanel() {
  const svgW = 720;
  const svgH = 260;
  const padL = 170;
  const padR = 30;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...IMP96779_BARS.map((b) => b.log10N)) - 0.4;
  const maxX = Math.max(...IMP96779_BARS.map((b) => b.log10N)) + 0.4;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;

  const rowH = plotH / IMP96779_BARS.length;
  const barH = rowH * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {IMP96779_BARS.map((b, i) => {
        const cy = padT + rowH * (i + 0.5);
        return (
          <g key={b.key}>
            <rect
              x={padL}
              y={cy - barH / 2}
              width={xOf(b.log10N) - padL}
              height={barH}
              fill={b.color}
              opacity={0.75}
            />
            <text x={padL - 8} y={cy + 3} textAnchor="end" fill="#94a3b8" fontSize={9.5}>
              {b.rigor.split(',')[0]}
            </text>
            <text x={xOf(b.log10N) + 6} y={cy + 3} fill={b.color} fontSize={9.5}>
              N&asymp;{b.N.toExponential(2)}
            </text>
          </g>
        );
      })}

      {IMP96779_RATIO_LABELS.map((r) => {
        const fromY = padT + rowH * (r.fromIdx + 0.5);
        const toY = padT + rowH * (r.toIdx + 0.5);
        const midY = (fromY + toY) / 2;
        return (
          <text key={r.key} x={padL - 8} y={midY + 3} textAnchor="end" fill="#facc15" fontSize={8} fontStyle="italic">
            {r.label}: {r.ratio.toFixed(2)}x &darr;
          </text>
        );
      })}

      {[minX, (minX + maxX) / 2, maxX].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          10^{v.toFixed(1)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        N (log10 scale)
      </text>
    </svg>
  );
}

export default function Imp96779RouteMCeilingLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Conditioning-Ceiling Ladder" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96779_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96682 reconciled four Route M double-precision conditioning-ceiling rungs -- the
        imp-96352 wall-clock compute ceiling, the imp-96548 rigorous trace-domination lower
        ceiling, the imp-96648 sharper rigorous Frobenius lower ceiling, and the
        imp-96443/imp-96570/imp-96656 measured composed ceiling -- into a single strictly-ordered
        ladder. Each bar below is the imported ceiling value on a log10(N) axis; the yellow labels
        between bars are the adjacency ratios each rung jumps by.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Four-rung ladder, log10(N), with adjacency ratios
      </h3>
      <LadderPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the ladder is strictly
        ordered ({IMP96779_VERDICT_SUMMARY.strictlyOrdered ? 'confirmed' : 'NOT confirmed'}) and
        the measured rung sits{' '}
        {IMP96779_VERDICT_SUMMARY.computeBindsFirstFactor.toFixed(0)}x above the compute ceiling,
        so wall-clock compute binds first by more than three orders of magnitude at every rigor
        level in the ladder.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-96779 viz-data leaf (every bar and ratio reused verbatim from imp-96682).{' '}
        {IMP96779_HONEST_BANNER}
      </div>
    </div>
  );
}
