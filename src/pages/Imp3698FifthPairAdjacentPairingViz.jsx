import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3698_RUNGS,
  IMP3698_PAIR_LABELS,
  IMP3698_WORST_FIFTH_PAIR,
  IMP3698_SIGMA4_FIRST,
  IMP3698_SIGMA4_LAST,
} from '../data/imp-3698-fifth-pair-adjacent-pairing-viz-data.js';

const PAIR_COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#34d399'];
const REF_COLOR = '#64748b';

function DeepRungSpectrumChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const deep = IMP3698_RUNGS[IMP3698_RUNGS.length - 1]; // N=2000
  const values = deep.denseTop10;
  const yMin = Math.min(...values) - 3e-12;
  const yMax = Math.max(...values) + 3e-12;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));
  const barW = cW / values.length - 8;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {values.map((v, i) => {
        const x = padL + i * (cW / values.length) + 4;
        const y = yS(v);
        const h = padT + cH - y;
        const pairIdx = Math.floor(i / 2);
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} fill={PAIR_COLORS[pairIdx]} rx={2} />
            <text x={x + barW / 2} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
              {'l' + (i + 1)}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        Gram eigenvalue index (N=2000, top-10)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        lambda_i (x1e-9)
      </text>

      {IMP3698_PAIR_LABELS.map((label, i) => (
        <g key={label}>
          <rect x={padL + cW - 96} y={padT + 6 + i * 15} width={9} height={9} fill={PAIR_COLORS[i]} rx={2} />
          <text x={padL + cW - 84} y={padT + 14 + i * 15} fill="#94a3b8" fontSize={9}>
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Sigma4LadderChart() {
  const svgW = 460;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 160;
  const svgH = padT + cH + padB;

  const xMin = 1100;
  const xMax = 2100;
  const yMin = 0.995;
  const yMax = 1.0;

  const xS = (n) => padL + ((n - xMin) / (xMax - xMin)) * cW;
  const yS = (s) => padT + cH * (1 - (s - yMin) / (yMax - yMin));

  const path = IMP3698_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.sigma4).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0.995, 0.996, 0.997, 0.998, 0.999, 1.0].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke={REF_COLOR} strokeWidth={1.25} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(1) - 5} textAnchor="end" fill={REF_COLOR} fontSize={9}>
        sigma_4 = 1
      </text>

      <path d={path} fill="none" stroke="#34d399" strokeWidth={1.75} />

      {IMP3698_RUNGS.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.sigma4)} r={5} fill="#34d399" stroke="#052e1f" strokeWidth={1.25} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3698_RUNGS.map((r) => (
        <g key={'x' + r.N}>
          <line x1={xS(r.N)} y1={padT + cH} x2={xS(r.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            N={r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        deep rung N
      </text>
    </svg>
  );
}

function RungTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>N</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>worst adjacent-pair spread</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>sigma_4 = lambda_9/lambda_1</th>
        </tr>
      </thead>
      <tbody>
        {IMP3698_RUNGS.map((r) => (
          <tr key={r.N} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.N}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>
              {r.worstPairSpread === 0 ? '0 (machine precision)' : r.worstPairSpread.toExponential(2)}
            </td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: '#34d399' }}>{r.sigma4}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3698FifthPairAdjacentPairingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Five-Pair Adjacent-Pairing Skew-Toeplitz Spectrum (imp-3668)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3668 dense-certified a FIFTH adjacent-pairing level in the skew-Toeplitz Gram
        spectrum S = T^T T: extracting the top-10 eigenvalues at the deep rungs N in{' '}
        {'{'}1200, 1600, 2000{'}'} with an independent dense full-spectrum solver
        (Householder + implicit-QL, no Krylov), lambda_9=lambda_10 stays degenerate to
        relative &lt; {IMP3698_WORST_FIFTH_PAIR.toExponential(2)} everywhere -- extending
        the four-pair pattern (lambda_1=lambda_2, ..., lambda_7=lambda_8) to five pairs.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Top-10 Gram eigenvalues at the deepest rung (N=2000), colored by adjacent pair
      </p>
      <DeepRungSpectrumChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Fifth-pair amplitude sigma_4 = lambda_9/lambda_1 climbing toward 1 with depth
      </p>
      <Sigma4LadderChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured rungs
      </p>
      <RungTable />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart bars
        show the top-10 dense Gram eigenvalues at N=2000, grouped into five color-coded
        adjacent pairs -- each pair sits at visually indistinguishable heights, since the
        largest measured spread anywhere in the ladder is{' '}
        {IMP3698_WORST_FIFTH_PAIR.toExponential(2)} (machine precision). The bottom chart
        shows the fifth-pair amplitude sigma_4 climbing monotonically from{' '}
        {IMP3698_SIGMA4_FIRST} at N=1200 to {IMP3698_SIGMA4_LAST} at N=2000, the same
        approach-to-1 behavior the lower four pairs show as the section deepens.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> pairing-structure
        cross-check only -- this certifies the lambda_9=lambda_10 adjacent-pairing degeneracy
        against an independent dense full-spectrum solver. It does NOT establish the
        fifth-pair amplitude LAW (a distinct pending ticket) and does NOT construct the
        missing magnitude or attempt the imp-3066 K_a &ge; 0 positivity. RH-equivalent, NO
        QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
