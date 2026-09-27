import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97765_CROSSING_ROWS,
  IMP97765_SUMMARY,
} from '../data/imp-97765-fartail-crossing-heights-viz-data.js';

const BAR_COLOR = '#60a5fa';
const LABEL_COLOR = '#f87171';

// Bar chart of log10(N) at each pinned crossing height (0.99/0.995/0.999), showing how the
// crossing height explodes as the diagnostic target climbs toward 1.
function CrossingHeightBars() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 55;
  const svgH = 320;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxLog10N = Math.max(...IMP97765_CROSSING_ROWS.map((r) => r.log10_N));
  const barW = plotW / IMP97765_CROSSING_ROWS.length;

  const yOf = (v) => padT + plotH - (v / maxLog10N) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {IMP97765_CROSSING_ROWS.map((r, i) => {
        const x = padL + i * barW + barW * 0.2;
        const w = barW * 0.6;
        const y = yOf(r.log10_N);
        const h = padT + plotH - y;
        return (
          <g key={r.key}>
            <rect x={x} y={y} width={w} height={h} fill={BAR_COLOR} opacity={0.85} />
            <text x={x + w / 2} y={y - 8} textAnchor="middle" fill={LABEL_COLOR} fontSize={10}>
              log10 N = {r.log10_N}
            </text>
            <text x={x + w / 2} y={padT + plotH + 18} textAnchor="middle" fill="#94a3b8" fontSize={10}>
              t = {r.target}
            </text>
            <text x={x + w / 2} y={padT + plotH + 34} textAnchor="middle" fill="#64748b" fontSize={8}>
              N ~ {r.N_mantissa}e{r.N_exp10}
            </text>
          </g>
        );
      })}

      <text x={padL - 8} y={padT + 10} textAnchor="end" fill="#64748b" fontSize={9}>
        log10 N
      </text>
    </svg>
  );
}

export default function Imp97765FarTailCrossingHeightsViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Diagnostic Crossing Heights, Pinned (imp-97765 / imp-97744)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97744 closed-form crossing pins verbatim (no re-derivation,
        no new computation). Conditional-share diagnostic, NOT an RH bound; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97765_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log10(N) at each pinned crossing height (0.99 / 0.995 / 0.999)
      </h3>
      <CrossingHeightBars />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>target t</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>L = 1/(1-t)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>log10 T0</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>log10 N</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>N (mantissa x 10^exp)</th>
          </tr>
        </thead>
        <tbody>
          {IMP97765_CROSSING_ROWS.map((row) => (
            <tr key={row.key} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.target}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.L}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.log10_T0}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.log10_N}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.N_mantissa}e{row.N_exp10}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97765_SUMMARY.verdict}
      </div>
    </div>
  );
}
