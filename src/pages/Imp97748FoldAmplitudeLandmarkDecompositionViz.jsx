import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION } from '../data/imp-97748-fold-amplitude-landmark-decomposition.js';

const S_COLOR = '#34d399';
const PHI_XX_COLOR = '#f87171';

const TABLE = IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION.table;

// Grouped bar chart on a log y-axis: S (numerator) vs phi_xx (denominator) per landmark.
function NumeratorDenominatorBarChart() {
  const svgW = 640;
  const padL = 55;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const values = TABLE.flatMap((r) => [r.S, r.phi_xx]);
  const logMax = Math.log10(Math.max(...values) * 1.3);
  const logMin = Math.log10(Math.min(...values) * 0.7);
  const yOf = (v) => padT + plotH - ((Math.log10(v) - logMin) / (logMax - logMin)) * plotH;

  const groupW = plotW / TABLE.length;
  const barW = groupW / 3;

  const yTicks = [1e-4, 1e-3, 1e-2, 1e-1, 1].filter((t) => t >= 10 ** logMin && t <= 10 ** logMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 6} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toExponential(0)}
          </text>
        </g>
      ))}
      {TABLE.map((row, gi) => {
        const groupX = padL + gi * groupW;
        return (
          <g key={row.label}>
            <rect
              x={groupX + 0.4 * barW}
              y={yOf(row.S)}
              width={barW * 0.8}
              height={padT + plotH - yOf(row.S)}
              fill={S_COLOR}
            />
            <rect
              x={groupX + 1.5 * barW}
              y={yOf(row.phi_xx)}
              width={barW * 0.8}
              height={padT + plotH - yOf(row.phi_xx)}
              fill={PHI_XX_COLOR}
            />
            <text x={groupX + groupW / 2} y={svgH - 12} textAnchor="middle" fill="#94a3b8" fontSize={10}>
              {row.label}
            </text>
          </g>
        );
      })}
      <g transform={`translate(${padL + 10}, 8)`}>
        <rect width={10} height={10} fill={S_COLOR} />
        <text x={14} y={9} fill="#cbd5e1" fontSize={10}>
          S = sigma(1-sigma)
        </text>
        <rect x={140} width={10} height={10} fill={PHI_XX_COLOR} />
        <text x={154} y={9} fill="#cbd5e1" fontSize={10}>
          phi_xx
        </text>
      </g>
    </svg>
  );
}

export default function Imp97748FoldAmplitudeLandmarkDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fold-Amplitude Numerator vs Denominator Across L1..L4 (imp-97748 / imp-97725)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a measurement/decomposition-only
        page. K = sqrt(S/(2 phi_xx)) is the imp-97725 fold amplitude only AT the peak (L1); the
        L2/L3/L4 entries show how the numerator S and curvature phi_xx separately evolve downslope,
        not an extended fold law. Conditional-share diagnostic on the inherited imp-3220/imp-3406
        extrapolation, NOT an RH bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        S(N) = sigma(N)(1-sigma(N)) peaks at its algebraic maximum 0.25 exactly at the L3 halving
        landmark (sigma=1/2), while phi_xx(N) falls monotonically across the whole L1&rarr;L4
        downslope ladder &mdash; the two factors of K move independently off the peak.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        S (numerator) vs phi_xx (denominator) by landmark, log scale
      </h3>
      <NumeratorDenominatorBarChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>Landmark</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>sigma</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>S</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>phi_xx</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>K</th>
          </tr>
        </thead>
        <tbody>
          {TABLE.map((row) => (
            <tr key={row.label} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.N.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.sigma}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.S.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.phi_xx.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.K === null ? '—' : row.K.toFixed(4)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong>{' '}
        {IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION.verdict}
      </div>
    </div>
  );
}
