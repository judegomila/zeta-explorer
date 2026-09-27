import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97613_LADDER_ROWS,
  IMP97613_LANDMARKS,
  IMP97613_SUMMARY,
} from '../data/imp-97613-eflow-share-decay-viz-data.js';

// Single-line chart on a log-N axis, log-share axis: the flow share collapsing across the ladder,
// with the two named crossings (share=1, share=1e-3) and the halving landmark marked.
function FlowShareDecayChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const rows = IMP97613_LADDER_ROWS; // N ascending: 1e6 -> 1e12
  const logN = rows.map((r) => Math.log10(r.N));
  const xMin = Math.min(...logN);
  const xMax = Math.max(...logN);
  const xOf = (lx) => padL + ((lx - xMin) / (xMax - xMin)) * plotW;

  const logShare = rows.map((r) => Math.log10(r.share));
  const yMin = Math.min(...logShare);
  const yMax = Math.max(...logShare);
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const sharePts = rows.map((r) => `${xOf(Math.log10(r.N))},${yOf(r.share)}`).join(' ');
  const oneLineY = yOf(1);
  const thousandthLineY = yOf(1e-3);
  const nHalfX = xOf(Math.log10(IMP97613_LANDMARKS.N_half));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* share = 1 reference line */}
      <line x1={padL} y1={oneLineY} x2={padL + plotW} y2={oneLineY} stroke="#64748b" strokeDasharray="4 3" strokeWidth={1} />
      <text x={padL + plotW} y={oneLineY - 4} textAnchor="end" fill="#64748b" fontSize={9}>
        share = 1 (E_flow = E_trunc)
      </text>

      {/* share = 1e-3 reference line */}
      <line x1={padL} y1={thousandthLineY} x2={padL + plotW} y2={thousandthLineY} stroke="#64748b" strokeDasharray="4 3" strokeWidth={1} />
      <text x={padL + plotW} y={thousandthLineY - 4} textAnchor="end" fill="#64748b" fontSize={9}>
        share = 1e-3
      </text>

      {/* N_half halving landmark */}
      <line x1={nHalfX} y1={padT} x2={nHalfX} y2={padT + plotH} stroke="#a78bfa" strokeDasharray="2 3" strokeWidth={1} />
      <text x={nHalfX} y={padT - 4} textAnchor="middle" fill="#a78bfa" fontSize={9}>
        N_half
      </text>

      <polyline points={sharePts} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {rows.map((r) => (
        <circle key={`share-${r.N}`} cx={xOf(Math.log10(r.N))} cy={yOf(r.share)} r={3} fill="#60a5fa" />
      ))}

      {rows.map((r) => (
        <text
          key={`n-${r.N}`}
          x={xOf(Math.log10(r.N))}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize={9.5}
        >
          {r.N.toExponential(0)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill="#94a3b8" fontSize={9.5}>
        N
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        E_flow / E_trunc (log scale)
      </text>

      <g transform={`translate(${padL + 10}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={16} y2={0} stroke="#60a5fa" strokeWidth={2} />
        <text x={20} y={3} fill="#cbd5e1" fontSize={9.5}>E_flow / E_trunc (Gronwall flow share)</text>
      </g>
    </svg>
  );
}

export default function Imp97613EflowShareDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Gronwall Flow-Share Decay: E_flow/E_trunc Across the Ladder (imp-97613 / imp-97585)" />

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
        page reshaping the frozen imp-97585 ladder and landmarks verbatim (no re-derivation, no new
        computation). Changes no bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97613_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        As N grows across the decade ladder (left to right below), the flow share collapses,
        crossing share=1 near N~1.60e6 and share=1e-3 near N~6.93e9, just above the halving
        landmark:
      </p>
      <FlowShareDecayChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>E_flow / E_trunc</th>
          </tr>
        </thead>
        <tbody>
          {IMP97613_LADDER_ROWS.map((r) => (
            <tr key={r.N} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.N.toExponential(0)}</td>
              <td style={{ textAlign: 'right' }}>{r.share.toExponential(4)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97613_SUMMARY.verdict}
      </div>
    </div>
  );
}
