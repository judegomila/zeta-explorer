import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97730_LANDMARK_ROWS,
  IMP97730_EPS_LADDER_ROWS,
  IMP97730_QUARTERING_RATIOS,
  IMP97730_SUMMARY,
} from '../data/imp-97730-diag3-5point-stencil-refine-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLOR_3PT = ED.series4;
const COLOR_5PT = ED.series3;

// Grouped log-y bar chart: |DIAG3| under the 3-point vs 5-point stencil at each landmark.
function StencilCompareChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 55;
  const svgH = 300;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allValues = IMP97730_LANDMARK_ROWS.flatMap((r) => [r.abs3pt, r.abs5pt]);
  const yMinLog = Math.floor(Math.log10(Math.min(...allValues))) - 0.5;
  const yMaxLog = Math.ceil(Math.log10(Math.max(...allValues))) + 0.5;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMinLog) / (yMaxLog - yMinLog)) * plotH;

  const groupW = plotW / IMP97730_LANDMARK_ROWS.length;
  const barW = groupW * 0.28;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {[yMinLog, Math.round((yMinLog + yMaxLog) / 2), yMaxLog].map((p) => (
        <g key={p}>
          <line x1={padL} y1={yOf(Math.pow(10, p))} x2={padL + plotW} y2={yOf(Math.pow(10, p))} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(Math.pow(10, p)) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{p}
          </text>
        </g>
      ))}

      {IMP97730_LANDMARK_ROWS.map((r, i) => {
        const cx = padL + groupW * i + groupW / 2;
        const x3 = cx - barW - 2;
        const x5 = cx + 2;
        const y3 = yOf(r.abs3pt);
        const y5 = yOf(r.abs5pt);
        return (
          <g key={r.key}>
            <rect x={x3} y={y3} width={barW} height={padT + plotH - y3} fill={COLOR_3PT} />
            <rect x={x5} y={y5} width={barW} height={padT + plotH - y5} fill={COLOR_5PT} />
            <text x={cx} y={svgH - 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {r.label} (sigma={r.sigma})
            </text>
            <text x={cx} y={svgH - 20} textAnchor="middle" fill={ED.ink} fontSize={9}>
              {r.cutX}x cut
            </text>
          </g>
        );
      })}

      <rect x={padL + plotW - 130} y={padT} width={10} height={10} fill={COLOR_3PT} />
      <text x={padL + plotW - 116} y={padT + 9} fill={ED.ink} fontSize={10}>3-point O(eps^2)</text>
      <rect x={padL + plotW - 130} y={padT + 16} width={10} height={10} fill={COLOR_5PT} />
      <text x={padL + plotW - 116} y={padT + 25} fill={ED.ink} fontSize={10}>5-point O(eps^4)</text>
    </svg>
  );
}

// L2 eps-halving ladder: the 3-point |DIAG3| residual quarters each time eps halves.
function EpsQuarteringChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 45;
  const svgH = 220;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = IMP97730_EPS_LADDER_ROWS.map((r) => Math.log10(r.eps));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMinLog = Math.log10(Math.min(...IMP97730_EPS_LADDER_ROWS.map((r) => r.abs3pt))) - 0.2;
  const yMaxLog = Math.log10(Math.max(...IMP97730_EPS_LADDER_ROWS.map((r) => r.abs3pt))) + 0.2;

  const xOf = (logEps) => padL + ((logEps - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMinLog) / (yMaxLog - yMinLog)) * plotH;

  const path = IMP97730_EPS_LADDER_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'}${xOf(Math.log10(r.eps))},${yOf(r.abs3pt)}`
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <path d={path} fill="none" stroke={COLOR_3PT} strokeWidth={2} />
      {IMP97730_EPS_LADDER_ROWS.map((r, i) => (
        <g key={r.eps}>
          <circle cx={xOf(Math.log10(r.eps))} cy={yOf(r.abs3pt)} r={3.5} fill={COLOR_3PT} />
          <text x={xOf(Math.log10(r.eps))} y={svgH - 22} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
            eps={r.eps}
          </text>
          {i > 0 && (
            <text
              x={(xOf(Math.log10(IMP97730_EPS_LADDER_ROWS[i - 1].eps)) + xOf(Math.log10(r.eps))) / 2}
              y={(yOf(IMP97730_EPS_LADDER_ROWS[i - 1].abs3pt) + yOf(r.abs3pt)) / 2 - 8}
              textAnchor="middle"
              fill={ED.series2}
              fontSize={9}
            >
              &divide;{IMP97730_QUARTERING_RATIOS[i - 1]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export default function Imp97730Diag3StencilRefineViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="DIAG3 5-Point Stencil Refine: 3-Point Truncation vs Machine-Zero Floor (imp-97730 / imp-97703)" />

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
        page reshaping the frozen imp-97703 landmark table verbatim (no re-derivation, no new
        computation). Conditional-share diagnostic, NOT an RH bound; Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97730_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        |DIAG3| under the 3-point vs 5-point stencil, L2/L3/L4 (log-y axis)
      </h3>
      <StencilCompareChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>|DIAG3| 3-point</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>|DIAG3| 5-point</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>cut factor</th>
          </tr>
        </thead>
        <tbody>
          {IMP97730_LANDMARK_ROWS.map((row) => (
            <tr key={row.key} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.label} (sigma={row.sigma})</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.abs3pt.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.abs5pt.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.cutX}x</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        L2 eps-halving ladder: 3-point |DIAG3| quarters per step (O(eps^2) signature)
      </h3>
      <EpsQuarteringChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97730_SUMMARY.verdict}
      </div>
    </div>
  );
}
