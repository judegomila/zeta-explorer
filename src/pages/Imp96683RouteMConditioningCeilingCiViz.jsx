import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96683_LOG10_BANDS,
  IMP96683_LOG10_REFERENCE_LINES,
  IMP96683_MARGIN_SUMMARY,
  IMP96683_HONEST_BANNER,
} from '../data/imp-96683-route-m-conditioning-ceiling-ci-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAND_COLORS = { all: ED.series3, dense: ED.series1 };
const LINE_COLORS = { compute: ED.series8, traceLower: ED.series2, frobeniusLower: ED.series4 };

// Horizontal error-bar chart on a shared log10(N) axis: two fitted bands
// (95% whisker + 68% box + point) against three fixed reference lines.
function CiPanel() {
  const svgW = 720;
  const svgH = 210;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allVals = [
    ...IMP96683_LOG10_BANDS.flatMap((b) => [b.log10Ci95.lo, b.log10Ci95.hi]),
    ...IMP96683_LOG10_REFERENCE_LINES.map((r) => r.log10Value),
  ];
  const minX = Math.min(...allVals) - 0.15;
  const maxX = Math.max(...allVals) + 0.15;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;

  const rowH = plotH / IMP96683_LOG10_BANDS.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96683_LOG10_REFERENCE_LINES.map((r) => (
        <g key={r.key}>
          <line
            x1={xOf(r.log10Value)}
            y1={padT}
            x2={xOf(r.log10Value)}
            y2={padT + plotH}
            stroke={LINE_COLORS[r.key]}
            strokeWidth={1.3}
            strokeDasharray="3 3"
          />
        </g>
      ))}

      {IMP96683_LOG10_BANDS.map((b, i) => {
        const cy = padT + rowH * (i + 0.5);
        const color = BAND_COLORS[b.key];
        return (
          <g key={b.key}>
            <line x1={xOf(b.log10Ci95.lo)} y1={cy} x2={xOf(b.log10Ci95.hi)} y2={cy} stroke={color} strokeWidth={1.3} />
            <rect
              x={xOf(b.log10Ci68.lo)}
              y={cy - 7}
              width={Math.max(1, xOf(b.log10Ci68.hi) - xOf(b.log10Ci68.lo))}
              height={14}
              fill={color}
              opacity={0.35}
              stroke={color}
              strokeWidth={1}
            />
            <circle cx={xOf(b.log10Point)} cy={cy} r={3.2} fill={color} />
            <text x={padL - 8} y={cy + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>
              {b.label.split(' ')[0]}
            </text>
          </g>
        );
      })}

      {[minX, (minX + maxX) / 2, maxX].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          10^{v.toFixed(1)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (log10 scale) -- dot = point ceiling, box = 1-sigma, whisker = 95% CI
      </text>
    </svg>
  );
}

export default function Imp96683RouteMConditioningCeilingCiViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Conditioning-Ceiling Confidence Interval" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96683_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96656 propagated the log-log OLS fit-parameter standard errors through the delta
        method to turn the Route M double-precision conditioning ceiling into an error-bounded,
        log-normal confidence interval. The dense fit (4 rungs) gives a wider band than the
        all-rung fit (5 rungs, extra low-N anchor), but both 95% lower edges clear the rigorous
        trace ceiling (imp-96548) and sit far above the wall-clock compute ceiling (imp-96352).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Point ceiling + 1-sigma + 95% band, both fits, vs three reference lines
      </h3>
      <CiPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <span style={{ color: LINE_COLORS.compute }}>&#9632; compute ceiling (imp-96352)</span>
        <span style={{ color: LINE_COLORS.traceLower }}>&#9632; trace lower ceiling (imp-96548)</span>
        <span style={{ color: LINE_COLORS.frobeniusLower }}>&#9632; Frobenius lower ceiling (imp-96648)</span>
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the compute ceiling
        (imp-96352) sits {IMP96683_MARGIN_SUMMARY.allLo95AboveComputeFactor.toFixed(0)}x
        (all-rung) / {IMP96683_MARGIN_SUMMARY.denseLo95AboveComputeFactor.toFixed(0)}x (dense)
        below every 95% band lower edge, so compute binds first regardless of fit uncertainty.
        The all-rung 95% lower edge sits{' '}
        {((IMP96683_MARGIN_SUMMARY.allLo95AboveTraceFactor - 1) * 100).toFixed(0)}% above the
        rigorous trace lower ceiling; the sparser dense fit is the tight spot at only{' '}
        {((IMP96683_MARGIN_SUMMARY.denseLo95AboveTraceFactor - 1) * 100).toFixed(1)}% above it.
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
        imp-96683 viz-data leaf (every band edge reused verbatim from imp-96656 / imp-96648).{' '}
        {IMP96683_HONEST_BANNER}
      </div>
    </div>
  );
}
