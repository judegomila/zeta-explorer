import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97732_VALUE_DRIFT_ROWS,
  IMP97732_REL_SPAN_ROWS,
  IMP97732_SUMMARY,
} from '../data/imp-97732-wlin-residual-halfdependence-viz-data.js';

const NODE_COLORS = ['#f87171', '#facc15', '#34d399', '#60a5fa'];

// Line chart: residual VALUE at each x node across the three half-orders, showing the drift.
function ValueDriftChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 45;
  const svgH = 280;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const halves = [100, 200, 400];
  const xOf = (h) => padL + ((halves.indexOf(h)) / (halves.length - 1)) * plotW;

  const allValues = IMP97732_VALUE_DRIFT_ROWS.flatMap((r) => r.byHalf);
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const pad = (yMax - yMin) * 0.15;
  const yOf = (v) => padT + plotH - ((v - (yMin - pad)) / (yMax - yMin + 2 * pad)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke="#1e293b" strokeWidth={1} strokeDasharray="3,3" />

      {halves.map((h) => (
        <text key={h} x={xOf(h)} y={svgH - 22} textAnchor="middle" fill="#94a3b8" fontSize={9}>
          half={h}
        </text>
      ))}

      {IMP97732_VALUE_DRIFT_ROWS.map((row, i) => {
        const color = NODE_COLORS[i];
        const path = row.byHalf.map((v, j) => `${j === 0 ? 'M' : 'L'}${xOf(halves[j])},${yOf(v)}`).join(' ');
        return (
          <g key={row.x}>
            <path d={path} fill="none" stroke={color} strokeWidth={2} />
            {row.byHalf.map((v, j) => (
              <circle key={j} cx={xOf(halves[j])} cy={yOf(v)} r={3.5} fill={color} />
            ))}
            <text x={padL + plotW + 4} y={yOf(row.byHalf[2]) + 3} fill={color} fontSize={9}>
              x={row.x}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97732WlinResidualHalfDependenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="w_lin Residual Half-Dependence Drift vs Factorization-Independence (imp-97732 / imp-97705)" />

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
        page reshaping the frozen imp-97705 residual table verbatim (no re-derivation, no new
        computation). Conditional-share diagnostic, NOT an RH bound; Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97732_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        residual value w(x)-w_lin(x) vs half-order, per x node (smooth denominator)
      </h3>
      <ValueDriftChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>x</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>half=100</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>half=200</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>half=400</th>
          </tr>
        </thead>
        <tbody>
          {IMP97732_VALUE_DRIFT_ROWS.map((row) => (
            <tr key={row.x} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.x}</td>
              {row.byHalf.map((v, j) => (
                <td key={j} style={{ padding: '0.4rem 0.5rem' }}>{v.toExponential(4)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        factorization relative span (%) per x node, at each half (fixed point at x=0.12/0.25)
      </h3>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>half</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.01</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.05</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.12</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.25</th>
          </tr>
        </thead>
        <tbody>
          {IMP97732_REL_SPAN_ROWS.map((row) => (
            <tr key={row.half} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.half}</td>
              {row.spans.map((s) => (
                <td key={s.x} style={{ padding: '0.4rem 0.5rem' }}>{s.rel.toFixed(3)}%</td>
              ))}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97732_SUMMARY.verdict}
      </div>
    </div>
  );
}
