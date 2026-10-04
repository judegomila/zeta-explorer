import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP36226_EXPONENT_COMPARISON,
  IMP36226_FINDING,
} from '../data/imp-36226-clustered-vs-default-depth-scaling-viz-data.js';
import { ED } from '../styles/tokens.js';

// Horizontal exponent axis with each fit's point estimate, 95% CI whisker,
// and the sqrt (0.5) / linear (1.0) reference lines.
function ExponentAxis() {
  const svgW = 640;
  const padL = 190;
  const padR = 40;
  const rowH = 76;
  const svgH = rowH * IMP36226_EXPONENT_COMPARISON.length + 50;
  const plotW = svgW - padL - padR;
  const domainMax = 1.3;
  const x = (v) => padL + (v / domainMax) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* Reference lines: sqrt (0.5) and linear (1.0) */}
      {[
        { v: 0.5, label: 'sqrt (0.5)', color: ED.brass },
        { v: 1.0, label: 'linear (1.0)', color: ED.inkSoft },
      ].map((ref) => (
        <g key={ref.v}>
          <line x1={x(ref.v)} x2={x(ref.v)} y1={10} y2={svgH - 30} stroke={ref.color} strokeDasharray="4 3" strokeWidth={1.5} opacity={0.7} />
          <text x={x(ref.v)} y={svgH - 14} textAnchor="middle" fill={ref.color} fontSize={11} fontFamily="monospace">
            {ref.label}
          </text>
        </g>
      ))}

      {IMP36226_EXPONENT_COMPARISON.map((row, i) => {
        const y = 30 + i * rowH;
        const [lo, hi] = row.ci95;
        return (
          <g key={row.key}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill={ED.inkSoft} fontSize={12} fontWeight={600}>
              {row.label}
            </text>
            {/* 95% CI whisker */}
            <line x1={x(lo)} x2={x(hi)} y1={y} y2={y} stroke={row.color} strokeWidth={2} opacity={0.6} />
            <line x1={x(lo)} x2={x(lo)} y1={y - 8} y2={y + 8} stroke={row.color} strokeWidth={2} opacity={0.6} />
            <line x1={x(hi)} x2={x(hi)} y1={y - 8} y2={y + 8} stroke={row.color} strokeWidth={2} opacity={0.6} />
            {/* Point estimate */}
            <circle cx={x(row.exponent)} cy={y} r={6} fill={row.color} />
            <text x={x(row.exponent)} y={y - 16} textAnchor="middle" fill={row.color} fontSize={12} fontFamily="monospace" fontWeight={700}>
              {row.exponent.toFixed(3)}
            </text>
            <text x={x(hi) + 10} y={y + 4} fill={ED.inkFaint} fontSize={10} fontFamily="monospace">
              [{lo.toFixed(2)}, {hi.toFixed(2)}] R&sup2;={row.r2.toFixed(2)} n={row.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp36226ClusteredVsDefaultDepthScalingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Clustered vs Default Depth-Scaling Exponent (imp-36132 / imp-36081 / imp-36226)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Both the CLUSTERED (imp-36132) and DEFAULT (imp-36081) worst-term orders were re-fit on the
        identical densified 37-shape pairing-tree family (depth 12..4099). The clustered order
        flattens the depth-scaling exponent to <strong style={{ color: 'var(--series-1)' }}>~0.532</strong>,
        sub-linear and sqrt-consistent, while the default order keeps a{' '}
        <strong style={{ color: 'var(--series-2)' }}>~0.753</strong> exponent that sits well above sqrt but
        still narrowly excludes linear.
      </p>

      <ExponentAxis />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)', textAlign: 'left', borderBottom: '1px solid var(--rule-soft)' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>Order</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Exponent (95% CI)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Seven-point baseline</th>
          </tr>
        </thead>
        <tbody>
          {IMP36226_EXPONENT_COMPARISON.map((row) => (
            <tr key={row.key} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '0.4rem 0.5rem', color: row.color, fontWeight: 600 }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.5rem', color: 'var(--ink-soft)', fontFamily: 'monospace' }}>
                {row.exponent.toFixed(3)} [{row.ci95[0].toFixed(3)}, {row.ci95[1].toFixed(3)}]
              </td>
              <td style={{ padding: '0.4rem 0.5rem', color: 'var(--ink-faint)', fontFamily: 'monospace' }}>
                {row.sevenPointBaseline.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP36226_FINDING.clusteredSqrtConsistent}.{' '}
        {IMP36226_FINDING.clusteredLinearInconsistent}. {IMP36226_FINDING.defaultStaysHigherAndSubLinear}.{' '}
        {IMP36226_FINDING.clusteredOrderFlattensRelativeToDefault}. Both fits are descriptive log-log
        slopes over a fixed floor-scatter dataset, not certified growth laws; neither certifies a W1
        bound. The W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb stays GUE-conditional
        (imp-486); no RH verdict, NO QED.
      </div>
    </div>
  );
}
