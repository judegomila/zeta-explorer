import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97732_VALUE_DRIFT_ROWS,
  IMP97732_REL_SPAN_ROWS,
  IMP97732_SUMMARY,
} from '../data/imp-97732-wlin-residual-halfdependence-viz-data.js';
import { ED } from '../styles/tokens.js';

const NODE_COLORS = [ED.series2, ED.series4, ED.series3, ED.series1];

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
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.ruleSoft} strokeWidth={1} strokeDasharray="3,3" />

      {halves.map((h) => (
        <text key={h} x={xOf(h)} y={svgH - 22} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
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
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97705 residual table verbatim (no re-derivation, no new
        computation). Conditional-share diagnostic, NOT an RH bound; no refereed bound is changed;
         RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97732_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        residual value w(x)-w_lin(x) vs half-order, per x node (smooth denominator)
      </h3>
      <ValueDriftChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>x</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>half=100</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>half=200</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>half=400</th>
          </tr>
        </thead>
        <tbody>
          {IMP97732_VALUE_DRIFT_ROWS.map((row) => (
            <tr key={row.x} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.x}</td>
              {row.byHalf.map((v, j) => (
                <td key={j} style={{ padding: '0.4rem 0.5rem' }}>{v.toExponential(4)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        factorization relative span (%) per x node, at each half (fixed point at x=0.12/0.25)
      </h3>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>half</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.01</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.05</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.12</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>x=0.25</th>
          </tr>
        </thead>
        <tbody>
          {IMP97732_REL_SPAN_ROWS.map((row) => (
            <tr key={row.half} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
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
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97732_SUMMARY.verdict}
      </div>
    </div>
  );
}
