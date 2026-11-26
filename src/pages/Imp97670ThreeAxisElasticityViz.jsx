import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP97670_LANDMARK_ROWS, IMP97670_SUMMARY } from '../data/imp-97670-three-axis-elasticity-viz-data.js';
import { ED } from '../styles/tokens.js';

const AXIS_COLORS = Object.freeze({
  elasticity_CC: ED.series2,
  elasticity_ET: ED.series1,
  elasticity_CF: ED.series3,
});
const AXIS_LABELS = Object.freeze({
  elasticity_CC: 'E_CC',
  elasticity_ET: 'E_ET',
  elasticity_CF: 'E_CF',
});
const AXES = ['elasticity_CC', 'elasticity_ET', 'elasticity_CF'];

// Grouped bar chart: one group of three bars (E_CC, E_ET, E_CF) per landmark.
function ElasticityGroupedBarChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxAbs = Math.max(
    ...IMP97670_LANDMARK_ROWS.flatMap((r) => AXES.map((a) => Math.abs(r[a])))
  );
  const yMax = maxAbs * 1.15;
  const zeroY = padT + plotH / 2;
  const yOf = (v) => zeroY - (v / yMax) * (plotH / 2);

  const groupW = plotW / IMP97670_LANDMARK_ROWS.length;
  const barW = groupW / (AXES.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {IMP97670_LANDMARK_ROWS.map((row, gi) => {
        const groupX = padL + gi * groupW;
        return (
          <g key={row.key}>
            {AXES.map((axis, ai) => {
              const v = row[axis];
              const x = groupX + (ai + 0.5) * barW;
              const y0 = zeroY;
              const y1 = yOf(v);
              const top = Math.min(y0, y1);
              const height = Math.abs(y1 - y0);
              return (
                <rect
                  key={axis}
                  x={x}
                  y={top}
                  width={barW * 0.8}
                  height={Math.max(height, 1)}
                  fill={AXIS_COLORS[axis]}
                />
              );
            })}
            <text x={groupX + groupW / 2} y={svgH - 12} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {row.label}
            </text>
          </g>
        );
      })}
      {AXES.map((axis, ai) => (
        <g key={axis} transform={`translate(${padL + 10 + ai * 110}, 10)`}>
          <rect width={10} height={10} fill={AXIS_COLORS[axis]} />
          <text x={14} y={9} fill={ED.ink} fontSize={10}>
            {AXIS_LABELS[axis]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp97670ThreeAxisElasticityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Three-Axis Elasticities Across Sigma Landmarks (imp-97670 / imp-97644)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97644 elasticity literals verbatim (no re-derivation, no new
        computation). Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation,
        not a rigorous asymptotic. Changes no bound; establishes no operator positivity; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97670_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        E_CC, E_ET, E_CF grouped by landmark (L2/L3/L4)
      </h3>
      <ElasticityGroupedBarChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>Landmark</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>sigma</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_CC</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_ET</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_CF</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>DIAG3</th>
          </tr>
        </thead>
        <tbody>
          {IMP97670_LANDMARK_ROWS.map((row) => (
            <tr key={row.key} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.sigma}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.elasticity_CC.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.elasticity_ET.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.elasticity_CF.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.diagonal3.toExponential(2)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97670_SUMMARY.verdict}
      </div>
    </div>
  );
}
