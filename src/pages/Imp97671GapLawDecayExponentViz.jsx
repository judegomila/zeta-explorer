import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97671_EXPONENT_ROWS,
  IMP97671_FIXED_POWER_REFERENCES,
  IMP97671_SUMMARY,
} from '../data/imp-97671-gap-law-decay-exponent-viz-data.js';

const RUNG_COLOR = '#60a5fa';
const RUNG_COLOR_LIMITED = '#f87171';
const REF_COLOR_Q2 = '#94a3b8';
const REF_COLOR_Q3 = '#facc15';

// Bar chart of the three local exponent rungs against the fixed q=2, q=3 reference lines.
function ExponentLadderChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 50;
  const svgH = 300;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxQ = Math.max(...IMP97671_EXPONENT_ROWS.map((r) => r.qLocal)) * 1.15;
  const yOf = (v) => padT + plotH - (v / maxQ) * plotH;

  const barW = plotW / (IMP97671_EXPONENT_ROWS.length * 2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* fixed-power reference lines */}
      <line
        x1={padL}
        y1={yOf(IMP97671_FIXED_POWER_REFERENCES.q2)}
        x2={padL + plotW}
        y2={yOf(IMP97671_FIXED_POWER_REFERENCES.q2)}
        stroke={REF_COLOR_Q2}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW + 2} y={yOf(IMP97671_FIXED_POWER_REFERENCES.q2) + 3} fill={REF_COLOR_Q2} fontSize={10}>
        q=2
      </text>
      <line
        x1={padL}
        y1={yOf(IMP97671_FIXED_POWER_REFERENCES.q3)}
        x2={padL + plotW}
        y2={yOf(IMP97671_FIXED_POWER_REFERENCES.q3)}
        stroke={REF_COLOR_Q3}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW + 2} y={yOf(IMP97671_FIXED_POWER_REFERENCES.q3) + 3} fill={REF_COLOR_Q3} fontSize={10}>
        q=3
      </text>

      {IMP97671_EXPONENT_ROWS.map((row, i) => {
        const groupW = plotW / IMP97671_EXPONENT_ROWS.length;
        const x = padL + i * groupW + (groupW - barW) / 2;
        const y = yOf(row.qLocal);
        const h = padT + plotH - y;
        return (
          <g key={row.key}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              fill={row.precisionLimited ? RUNG_COLOR_LIMITED : RUNG_COLOR}
            />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="#cbd5e1" fontSize={11}>
              {row.qLocal.toFixed(3)}
            </text>
            <text x={x + barW / 2} y={svgH - 30} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {row.label}
            </text>
            {row.precisionLimited && (
              <text x={x + barW / 2} y={svgH - 16} textAnchor="middle" fill={RUNG_COLOR_LIMITED} fontSize={9}>
                precision-limited
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97671GapLawDecayExponentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Gap-Law Residual Local Decay Exponent vs Fixed Powers (imp-97671 / imp-97640)" />

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
        page reshaping the frozen imp-97640 local-exponent ladder verbatim (no re-derivation, no new
        computation). The third rung is precision-limited by 7-sig-fig catastrophic cancellation and is
        flagged, not resolved. Changes no bound; MCM stays refuted from omega=11; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97671_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Local decay exponent q per rung vs the q=2, q=3 fixed-power references
      </h3>
      <ExponentLadderChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>Rung</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>q (local exponent)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Residual ratio</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {IMP97671_EXPONENT_ROWS.map((row) => (
            <tr key={row.key} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.qLocal.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.residualRatio.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.5rem', color: row.precisionLimited ? '#f87171' : '#34d399' }}>
                {row.precisionLimited ? 'precision-limited' : 'precision-clean'}
              </td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97671_SUMMARY.verdict}
      </div>
    </div>
  );
}
