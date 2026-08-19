import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL } from '../data/imp-34330-widening-residual-prepole-reversal.js';

const { grid, kWhereLeadingFormStopsImproving, humpPeakK, signChangeCeilingKStar } =
  IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL;

// residual(k) shrinks toward zero up to k_best~17.80, then flips sign and diverges toward k*~21.281.
function ResidualChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = grid[0].k;
  const xMax = grid[grid.length - 1].k;
  const yMin = -0.15;
  const yMax = 1.5;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const residPts = grid.map((r) => `${xAt(r.k)},${yAt(r.residual)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {[-0.1, 0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {grid
        .filter((r) => r.k % 1 === 0)
        .map((r) => (
          <text key={'x' + r.k} x={xAt(r.k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.k}
          </text>
        ))}

      {/* zero line */}
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke="#475569" strokeWidth={1} strokeDasharray="3,3" />

      {/* hump peak marker */}
      <line x1={xAt(humpPeakK)} y1={padT} x2={xAt(humpPeakK)} y2={padT + cH} stroke="#a3e635" strokeWidth={1} strokeDasharray="4,3" />
      <text x={xAt(humpPeakK)} y={padT - 6} textAnchor="middle" fill="#a3e635" fontSize={9}>
        hump peak k~{humpPeakK}
      </text>

      {/* k_best zero-crossing marker */}
      <line x1={xAt(kWhereLeadingFormStopsImproving)} y1={padT} x2={xAt(kWhereLeadingFormStopsImproving)} y2={padT + cH} stroke="#fbbf24" strokeWidth={1} strokeDasharray="4,3" />
      <text x={xAt(kWhereLeadingFormStopsImproving)} y={padT + cH + 30} textAnchor="middle" fill="#fbbf24" fontSize={9}>
        k_best~{kWhereLeadingFormStopsImproving}
      </text>

      {/* pole ceiling marker */}
      <line x1={xAt(Math.min(signChangeCeilingKStar, xMax))} y1={padT} x2={xAt(Math.min(signChangeCeilingKStar, xMax))} y2={padT + cH} stroke="#f87171" strokeWidth={1} strokeDasharray="2,2" />

      <polyline points={residPts} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {grid.map((r) => (
        <circle key={r.k} cx={xAt(r.k)} cy={yAt(r.residual)} r={2.5} fill={r.residual < 0 ? '#38bdf8' : '#f472b6'} />
      ))}

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        residual (meas &minus; pred)
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={10}>
        k (decade exponent, N = 10^k)
      </text>
    </svg>
  );
}

export default function Imp34418WideningResidualPrepoleReversalViz() {
  const { question, answer, finding, honestScope, residualMinAbs, kAtResidualMinAbs, decadesBelowCeiling, decadesPastHumpPeak, humpPeakF } =
    IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Widening-Slope Two-Term Residual: Pre-Pole Sign Change and Divergence (imp-34418 / imp-34330)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {question}
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        residual(k) = measured local widening-slope &minus; two-term prediction (&minus;ln10/2 + ln10&middot;3/u): shrinks to a minimum near
        k~{kAtResidualMinAbs} ({residualMinAbs} magnitude), crosses zero at k_best~{kWhereLeadingFormStopsImproving}, then flips sign and diverges
        toward the k*~{signChangeCeilingKStar} pole
      </p>
      <ResidualChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>u</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>predicted</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>measured</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>humpF</th>
          </tr>
        </thead>
        <tbody>
          {grid
            .filter((r) => r.k % 0.5 === 0)
            .map((row) => (
              <tr key={row.k} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.k}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.u}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.predicted}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.measured}</td>
                <td
                  style={{
                    padding: '0.4rem 0.6rem',
                    fontFamily: 'monospace',
                    color: row.residual < 0 ? '#38bdf8' : '#f472b6',
                  }}
                >
                  {row.residual}
                </td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.humpF}</td>
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
        <strong style={{ color: '#94a3b8' }}>Reading the reversal:</strong> {answer}
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
        <strong style={{ color: '#94a3b8' }}>Landmarks:</strong> the leading form stops improving
        ~{decadesBelowCeiling} decades below the k*~{signChangeCeilingKStar} ceiling, which is
        ~{decadesPastHumpPeak} decades past the resid_exp hump peak (f~{humpPeakF} at k~{humpPeakK}).
        {' '}{finding.F3_regrowth_is_pole_contamination}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {honestScope}
      </div>
    </div>
  );
}
