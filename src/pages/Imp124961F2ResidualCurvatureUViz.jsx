import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124917_RESIDUAL_U_ROWS,
  IMP124917_GAP_BAND,
  IMP124917_SUMMARY,
} from '../data/imp-124917-f2-residual-curvature-u-viz-data.js';
import { ED } from '../styles/tokens.js';

const SVG_W = 720;
const PAD_L = 70;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 48;
const SVG_H = 300;
const C_W = SVG_W - PAD_L - PAD_R;
const C_H = SVG_H - PAD_T - PAD_B;

// The ten imp-33708 floor factors span a decade (0.5x..5x); x-axis is log10(floorFactor).
function ResidualUCurveChart() {
  const xs = IMP124917_RESIDUAL_U_ROWS.map((r) => Math.log10(r.floorFactor));
  const ys = IMP124917_RESIDUAL_U_ROWS.map((r) => r.residualDecades);
  const xMin = Math.min(...xs) - 0.05;
  const xMax = Math.max(...xs) + 0.05;
  const yAbs = Math.max(...ys.map(Math.abs)) * 1.25;
  const yMin = -yAbs;
  const yMax = yAbs;

  const xS = (logX) => PAD_L + ((logX - xMin) / (xMax - xMin)) * C_W;
  const yS = (y) => PAD_T + C_H - ((y - yMin) / (yMax - yMin)) * C_H;

  const linePoints = IMP124917_RESIDUAL_U_ROWS.map((r) => `${xS(Math.log10(r.floorFactor))},${yS(r.residualDecades)}`).join(' ');

  const yTicks = [yMin, yMin / 2, 0, yMax / 2, yMax];

  return (
    <svg width={SVG_W} height={SVG_H} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + C_H} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={PAD_L} y1={yS(0)} x2={PAD_L + C_W} y2={yS(0)} stroke={ED.ruleSoft} strokeWidth={1} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={PAD_L - 4} y1={yS(t)} x2={PAD_L + C_W} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={0.5} />
          <text x={PAD_L - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(4)}
          </text>
        </g>
      ))}

      {IMP124917_RESIDUAL_U_ROWS.map((r) => (
        <g key={'xt' + r.floorFactor}>
          <line
            x1={xS(Math.log10(r.floorFactor))}
            y1={PAD_T + C_H - 4}
            x2={xS(Math.log10(r.floorFactor))}
            y2={PAD_T + C_H + 4}
            stroke={ED.rule}
            strokeWidth={1}
          />
          <text x={xS(Math.log10(r.floorFactor))} y={PAD_T + C_H + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {r.floorFactor}x
          </text>
        </g>
      ))}
      <text x={PAD_L + C_W / 2} y={SVG_H - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        imp-33708 floor factor
      </text>
      <text
        x={16}
        y={PAD_T + C_H / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${PAD_T + C_H / 2})`}
      >
        OLS residual (decades)
      </text>

      <polyline points={linePoints} fill="none" stroke={ED.series2} strokeWidth={2} />
      {IMP124917_RESIDUAL_U_ROWS.map((r) => (
        <circle
          key={'pt' + r.floorFactor}
          cx={xS(Math.log10(r.floorFactor))}
          cy={yS(r.residualDecades)}
          r={4}
          fill={r.residualDecades >= 0 ? ED.series1 : ED.series2}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp124961F2ResidualCurvatureUViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="F2 Residual-Curvature U-Curve (imp-124961, data: imp-124917)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a presentation-only leaf
        reusing the frozen imp-124772 OLS residuals and imp-124823 gap/ratio fields verbatim.
        Conditional-share curvature diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a
        rigorous asymptotic; no operator positivity established; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP124917_SUMMARY.law}
      </p>

      <ResidualUCurveChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reference band:</strong> {IMP124917_GAP_BAND.note}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124917_SUMMARY.verdict}
      </div>
    </div>
  );
}
