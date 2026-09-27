import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97715_BAND_ROWS,
  IMP97715_FIXED_POWER_REFERENCE,
  IMP97715_ABSCISSA_CONTRAST,
  IMP97715_SUMMARY,
} from '../data/imp-97715-route-m-exponent-robustness-viz-data.js';

const BAND_COLOR = '#60a5fa';
const REF_COLOR_Q3 = '#facc15';

// Horizontal error-bar chart of the two confidence bands against the fixed q=3 reference line.
function BandChart() {
  const svgW = 640;
  const padL = 170;
  const padR = 40;
  const padT = 30;
  const padB = 40;
  const svgH = 200;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxV = Math.max(...IMP97715_BAND_ROWS.map((r) => r.high)) * 1.1;
  const xOf = (v) => padL + (v / maxV) * plotW;
  const rowH = plotH / IMP97715_BAND_ROWS.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line
        x1={xOf(IMP97715_FIXED_POWER_REFERENCE.q3)}
        y1={padT}
        x2={xOf(IMP97715_FIXED_POWER_REFERENCE.q3)}
        y2={padT + plotH}
        stroke={REF_COLOR_Q3}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={xOf(IMP97715_FIXED_POWER_REFERENCE.q3)} y={padT - 10} textAnchor="middle" fill={REF_COLOR_Q3} fontSize={10}>
        q=3
      </text>

      {IMP97715_BAND_ROWS.map((row, i) => {
        const y = padT + i * rowH + rowH / 2;
        return (
          <g key={row.key}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize={11}>
              {row.label}
            </text>
            <line x1={xOf(row.low)} y1={y} x2={xOf(row.high)} y2={y} stroke={BAND_COLOR} strokeWidth={4} strokeLinecap="round" />
            <circle cx={xOf(row.center)} cy={y} r={4} fill="#e2e8f0" />
            <text x={xOf(row.high) + 8} y={y + 4} fill="#cbd5e1" fontSize={10}>
              [{row.low.toFixed(2)}, {row.high.toFixed(2)}]
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97715RouteMExponentRobustnessViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route-M Average Exponent Robustness Bands vs Fixed Power q=3 (imp-97715 / imp-97687)" />

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
        page reshaping the frozen imp-97687 robustness bands verbatim (no re-derivation, no new
        computation). Changes no bound; MCM stays refuted from omega=11; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97715_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Leave-one-out and bootstrap 95% bands for the ~10.18 average exponent vs the q=3 reference
      </h3>
      <BandChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>Band</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Low</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Center</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>High</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Clears q=3</th>
          </tr>
        </thead>
        <tbody>
          {IMP97715_BAND_ROWS.map((row) => (
            <tr key={row.key} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.low.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.center.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.high.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem', color: row.exceedsQ3 ? '#34d399' : '#f87171' }}>
                {row.exceedsQ3 ? 'yes' : 'no'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Abscissa (model) contrast: the same ladder, two exponents
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>Model</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Exponent</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
            <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{IMP97715_ABSCISSA_CONTRAST.properModel.label}</td>
            <td style={{ padding: '0.4rem 0.5rem' }}>{IMP97715_ABSCISSA_CONTRAST.properModel.exponent.toFixed(2)}</td>
          </tr>
          <tr style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
            <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{IMP97715_ABSCISSA_CONTRAST.alternateModel.label}</td>
            <td style={{ padding: '0.4rem 0.5rem' }}>{IMP97715_ABSCISSA_CONTRAST.alternateModel.exponent.toFixed(2)}</td>
          </tr>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97715_SUMMARY.verdict}
      </div>
    </div>
  );
}
