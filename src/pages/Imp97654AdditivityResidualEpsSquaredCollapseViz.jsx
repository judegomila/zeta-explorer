import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97654_RESIDUAL_VS_EPS_ROWS,
  IMP97654_RATIO_ROWS,
  IMP97654_SUMMARY,
} from '../data/imp-97654-additivity-residual-eps-squared-collapse-viz-data.js';
import { ED } from '../styles/tokens.js';

const LANDMARK_COLORS = Object.freeze({
  L2_below_0p9: ED.series2,
  L3_halving: ED.series1,
  L4_below_0p1: ED.series3,
});

// Log-log residual-vs-eps ladder: one line per landmark, slope ~2 is the O(eps^2) signature.
function ResidualVsEpsChart() {
  const svgW = 640;
  const padL = 80;
  const padR = 30;
  const padT = 16;
  const padB = 36;
  const svgH = 280;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allEps = IMP97654_RESIDUAL_VS_EPS_ROWS.flatMap((row) => row.points.map((p) => p.eps));
  const allResid = IMP97654_RESIDUAL_VS_EPS_ROWS.flatMap((row) => row.points.map((p) => p.resid));
  const lxMin = Math.log10(Math.min(...allEps)) - 0.15;
  const lxMax = Math.log10(Math.max(...allEps)) + 0.15;
  const lyMin = Math.log10(Math.min(...allResid)) - 0.3;
  const lyMax = Math.log10(Math.max(...allResid)) + 0.3;
  const xOf = (eps) => padL + ((Math.log10(eps) - lxMin) / (lxMax - lxMin)) * plotW;
  const yOf = (resid) => padT + plotH - ((Math.log10(resid) - lyMin) / (lyMax - lyMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP97654_RESIDUAL_VS_EPS_ROWS.map((row) => {
        const color = LANDMARK_COLORS[row.key];
        const [p1, p2] = row.points;
        return (
          <g key={row.key}>
            <line x1={xOf(p1.eps)} y1={yOf(p1.resid)} x2={xOf(p2.eps)} y2={yOf(p2.resid)} stroke={color} strokeWidth={2} />
            <circle cx={xOf(p1.eps)} cy={yOf(p1.resid)} r={4} fill={color} />
            <circle cx={xOf(p2.eps)} cy={yOf(p2.resid)} r={4} fill={color} />
            <text x={xOf(p2.eps) - 8} y={yOf(p2.resid) - 8} textAnchor="end" fill={color} fontSize={9.5}>
              {row.label}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={svgH - 6} fill={ED.inkFaint} fontSize={9.5}>
        eps (log scale, 5e-4 &rarr; 1e-3)
      </text>
      <text x={8} y={padT + 10} fill={ED.inkFaint} fontSize={9.5}>
        |residual| (log scale)
      </text>
    </svg>
  );
}

// Ratio bar chart: each landmark's eps1e3/eps5e4 residual ratio against the O(eps^2) reference line at 4.0.
function RatioChart() {
  const svgW = 640;
  const padL = 190;
  const padR = 70;
  const padT = 16;
  const rowH = 46;
  const plotW = svgW - padL - padR;
  const svgH = padT + rowH * IMP97654_RATIO_ROWS.length + 10;
  const xMax = 5;
  const xOf = (v) => padL + (v / xMax) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={xOf(4)} y1={padT - 4} x2={xOf(4)} y2={padT + rowH * IMP97654_RATIO_ROWS.length} stroke={ED.series2} strokeWidth={1} strokeDasharray="4,3" />
      <text x={xOf(4)} y={padT - 8} textAnchor="middle" fill={ED.series2} fontSize={9}>
        4.0 (O(eps^2))
      </text>
      {IMP97654_RATIO_ROWS.map((row, i) => {
        const y = padT + i * rowH + rowH / 2;
        const color = LANDMARK_COLORS[row.key];
        return (
          <g key={row.key}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              {row.label}
            </text>
            <line x1={padL} y1={y} x2={xOf(row.ratio)} y2={y} stroke={color} strokeWidth={10} strokeLinecap="round" />
            <text x={xOf(row.ratio) + 8} y={y + 4} textAnchor="start" fill={ED.ink} fontSize={9.5}>
              {row.ratio.toFixed(2)}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT - 4} x2={padL} y2={padT + rowH * IMP97654_RATIO_ROWS.length} stroke={ED.rule} strokeWidth={1} />
    </svg>
  );
}

export default function Imp97654AdditivityResidualEpsSquaredCollapseViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Additivity-Residual eps^2 Collapse Across Sigma Landmarks (imp-97654 / imp-97623)" />

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
        page reshaping the frozen imp-97623 additivity-residual literals verbatim (no re-derivation,
        no new computation). Conditional-share diagnostic on the inherited imp-3220/imp-3406
        extrapolation, not a rigorous asymptotic. Changes no bound; establishes no operator
        positivity; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97654_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Residual vs eps (log-log): each landmark's residual shrinks as eps halves
      </h3>
      <ResidualVsEpsChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Residual ratio (eps=1e-3 / eps=5e-4): all three landmarks cluster near 4.0
      </h3>
      <RatioChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97654_SUMMARY.verdict}
      </div>
    </div>
  );
}
