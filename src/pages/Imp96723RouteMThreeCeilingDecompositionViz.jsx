import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96723_BARS,
  IMP96723_RATIO_LABELS,
  IMP96723_DECOMPOSITION_SUMMARY,
  IMP96723_HONEST_BANNER,
} from '../data/imp-96723-route-m-three-ceiling-decomposition-viz-data.js';
import { ED } from '../styles/tokens.js';

// Horizontal bar chart on a shared log10(N) axis: three Route M conditioning
// ceilings (trace-domination rigorous < Frobenius fit < measured), with the
// two adjacency ratios (1.45x, 1.09x) labelled between consecutive bars.
function CeilingPanel() {
  const svgW = 720;
  const svgH = 220;
  const padL = 190;
  const padR = 30;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...IMP96723_BARS.map((b) => b.log10N)) - 0.3;
  const maxX = Math.max(...IMP96723_BARS.map((b) => b.log10N)) + 0.3;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;

  const rowH = plotH / IMP96723_BARS.length;
  const barH = rowH * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96723_BARS.map((b, i) => {
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
            <text x={padL - 8} y={cy + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>
              {b.symbol} ({b.label})
            </text>
            <text x={xOf(b.log10N) + 6} y={cy + 3} fill={b.color} fontSize={9.5}>
              N&asymp;{b.N.toExponential(3)}
            </text>
          </g>
        );
      })}

      {IMP96723_RATIO_LABELS.map((r) => {
        const fromY = padT + rowH * (r.fromIdx + 0.5);
        const toY = padT + rowH * (r.toIdx + 0.5);
        const midY = (fromY + toY) / 2;
        return (
          <text key={r.key} x={padL - 8} y={midY + 3} textAnchor="end" fill={ED.brass} fontSize={8} fontStyle="italic">
            {r.label}: {r.ratio.toFixed(4)}x &darr;
          </text>
        );
      })}

      {[minX, (minX + maxX) / 2, maxX].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          10^{v.toFixed(1)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (log10 scale)
      </text>
    </svg>
  );
}

export default function Imp96723RouteMThreeCeilingDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Three-Ceiling Decomposition" />
      <p className="ed-lbl">Related: <Link to="/viz-imp96741-route-m-three-ceiling-decomposition">later run (imp-96741)</Link></p>

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96723_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96693 audited the pairwise-ratio decomposition of the three Route M lam_max
        conditioning ceilings: the rigorous trace-domination lower ceiling T, the Frobenius
        log-law fit ceiling F, and the imp-96443 measured composed ceiling M. Each bar below is
        the imported ceiling value on a log10(N) axis, labelled with its fit-vs-rigorous status;
        the yellow labels between bars are the F/T and M/F adjacency ratios that multiply to the
        total M/T ratio.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Three-ceiling ladder, log10(N), with the 1.45x / 1.09x decomposition
      </h3>
      <CeilingPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the ladder is strictly
        ordered ({IMP96723_DECOMPOSITION_SUMMARY.strictlyOrdered ? 'confirmed' : 'NOT confirmed'})
        and the two legs multiply exactly to the total ratio M/T &asymp;{' '}
        {IMP96723_DECOMPOSITION_SUMMARY.totalRatio.toFixed(4)} (decomposition closes:{' '}
        {IMP96723_DECOMPOSITION_SUMMARY.decompositionCloses ? 'yes' : 'no'}), splitting the total
        conditioning-ceiling overstatement into a 1.45x rigorous-&gt;fit leg and a 1.09x
        fit-&gt;measured leg.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96723 viz-data leaf (every bar and ratio reused verbatim from imp-96693).{' '}
        {IMP96723_HONEST_BANNER}
      </div>
    </div>
  );
}
