import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97729_PIECE_ROWS,
  IMP97729_CROSSOVER,
  IMP97729_ASYMPTOTE_ROWS,
  IMP97729_SUMMARY,
} from '../data/imp-97729-fartail-residual-twopiece-crossover-viz-data.js';

const POWER_COLOR = '#60a5fa';
const LOG_COLOR = '#facc15';
const CROSSOVER_COLOR = '#f87171';
const ASYMPTOTE_COLOR = '#34d399';

// Log-y line chart of the two residual pieces across log10 N = 12..15, with the crossover
// marked as a vertical dashed line (the power-law piece falls ~1/sqrt(10)/decade while the
// log piece is nearly flat, so a log-y axis keeps both legible).
function TwoPieceCrossoverChart() {
  const svgW = 660;
  const padL = 55;
  const padR = 20;
  const padT = 24;
  const padB = 45;
  const svgH = 320;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logNMin = IMP97729_PIECE_ROWS[0].logN;
  const logNMax = IMP97729_PIECE_ROWS[IMP97729_PIECE_ROWS.length - 1].logN;
  const allValues = IMP97729_PIECE_ROWS.flatMap((r) => [r.powerLawPiece, r.logPiece]);
  const yMinLog = Math.log10(Math.min(...allValues)) - 0.15;
  const yMaxLog = Math.log10(Math.max(...allValues)) + 0.15;

  const xOf = (logN) => padL + ((logN - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMinLog) / (yMaxLog - yMinLog)) * plotH;

  const powerPath = IMP97729_PIECE_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.logN)},${yOf(r.powerLawPiece)}`
  ).join(' ');
  const logPath = IMP97729_PIECE_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.logN)},${yOf(r.logPiece)}`
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* crossover marker */}
      <line
        x1={xOf(IMP97729_CROSSOVER.log10N)}
        y1={padT}
        x2={xOf(IMP97729_CROSSOVER.log10N)}
        y2={padT + plotH}
        stroke={CROSSOVER_COLOR}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={xOf(IMP97729_CROSSOVER.log10N)} y={padT + 10} textAnchor="middle" fill={CROSSOVER_COLOR} fontSize={8}>
        crossover @ log10 N &asymp; {IMP97729_CROSSOVER.log10N}
      </text>

      <path d={logPath} fill="none" stroke={LOG_COLOR} strokeWidth={2} />
      <path d={powerPath} fill="none" stroke={POWER_COLOR} strokeWidth={2} />

      {IMP97729_PIECE_ROWS.map((r) => (
        <g key={r.key}>
          <circle cx={xOf(r.logN)} cy={yOf(r.powerLawPiece)} r={3} fill={POWER_COLOR} />
          <circle cx={xOf(r.logN)} cy={yOf(r.logPiece)} r={3} fill={LOG_COLOR} />
          <text x={xOf(r.logN)} y={svgH - 24} textAnchor="middle" fill="#94a3b8" fontSize={9}>
            1e{r.logN}
          </text>
        </g>
      ))}

      <text x={padL + plotW - 10} y={yOf(IMP97729_PIECE_ROWS[0].powerLawPiece) - 8} textAnchor="end" fill={POWER_COLOR} fontSize={10}>
        (1/2) sigma
      </text>
      <text x={padL + plotW - 10} y={yOf(IMP97729_PIECE_ROWS[IMP97729_PIECE_ROWS.length - 1].logPiece) - 8} textAnchor="end" fill={LOG_COLOR} fontSize={10}>
        a (1 - sigma)
      </text>
    </svg>
  );
}

// Small line chart of the deep-tail diagnostic settling to ~0.98 across 1e15/1e18/1e24.
function AsymptoteSettleChart() {
  const svgW = 660;
  const padL = 55;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const svgH = 200;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logNMin = IMP97729_ASYMPTOTE_ROWS[0].logN;
  const logNMax = IMP97729_ASYMPTOTE_ROWS[IMP97729_ASYMPTOTE_ROWS.length - 1].logN;
  const yMin = Math.min(...IMP97729_ASYMPTOTE_ROWS.map((r) => r.value)) - 0.03;
  const yMax = Math.max(...IMP97729_ASYMPTOTE_ROWS.map((r) => r.value), 1) + 0.03;

  const xOf = (logN) => padL + ((logN - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const path = IMP97729_ASYMPTOTE_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.logN)},${yOf(r.value)}`
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke="#475569" strokeWidth={1} strokeDasharray="2 3" />
      <text x={padL + 4} y={yOf(1) - 4} fill="#64748b" fontSize={9}>
        1/(2 log T0) ratio = 1
      </text>

      <path d={path} fill="none" stroke={ASYMPTOTE_COLOR} strokeWidth={2} />
      {IMP97729_ASYMPTOTE_ROWS.map((r) => (
        <g key={r.key}>
          <circle cx={xOf(r.logN)} cy={yOf(r.value)} r={3.5} fill={ASYMPTOTE_COLOR} />
          <text x={xOf(r.logN)} y={svgH - 20} textAnchor="middle" fill="#94a3b8" fontSize={9}>
            1e{r.logN}
          </text>
          <text x={xOf(r.logN)} y={yOf(r.value) - 8} textAnchor="middle" fill={ASYMPTOTE_COLOR} fontSize={9}>
            {r.value}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp97729FarTailResidualTwoPieceCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Residual Two-Piece Split &amp; Crossover (imp-97729 / imp-97702)" />

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
        page reshaping the frozen imp-97702 ladder verbatim (no re-derivation, no new computation).
        Conditional-share diagnostic, NOT an RH bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains
        SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97729_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        (1/2) sigma vs a (1 - sigma), N = 1e12..1e15 (log-y axis)
      </h3>
      <TwoPieceCrossoverChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>power-law piece (1/2)sigma</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>log piece a(1-sigma)</th>
          </tr>
        </thead>
        <tbody>
          {IMP97729_PIECE_ROWS.map((row) => (
            <tr key={row.key} style={{ color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #1e293b' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>1e{row.logN}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.powerLawPiece}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.logPiece}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        deep-tail diagnostic (1/2 - p) * 2 log T0, N = 1e15..1e24
      </h3>
      <AsymptoteSettleChart />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97729_SUMMARY.verdict}
      </div>
    </div>
  );
}
