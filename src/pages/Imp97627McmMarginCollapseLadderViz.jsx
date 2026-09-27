import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97627_LADDER_ROWS,
  IMP97627_ONSET_OMEGA,
  IMP97627_LAST_HOLDING_OMEGA,
  IMP97627_PRIMORIAL_LIMIT,
  IMP97627_SUMMARY,
} from '../data/imp-97627-mcm-margin-collapse-ladder-viz-data.js';

// Line chart of T(p_omega#) vs omega, with vertical markers at the last holding order (omega=10)
// and the onset (omega=11, first negative), plus a horizontal dashed asymptote at the primorial
// limit -e^{gamma}/12 + Rcorr (~-0.0458), which the ladder drifts toward but never reaches.
function MarginLadderChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const rows = IMP97627_LADDER_ROWS; // omega ascending: 6 -> 15
  const xMin = Math.min(...rows.map((r) => r.omega));
  const xMax = Math.max(...rows.map((r) => r.omega));
  const xOf = (omega) => padL + ((omega - xMin) / (xMax - xMin)) * plotW;

  const yMax = Math.max(...rows.map((r) => r.T));
  const yMin = Math.min(IMP97627_PRIMORIAL_LIMIT, ...rows.map((r) => r.T));
  const span = yMax - yMin;
  const yOf = (v) => padT + plotH - ((v - yMin) / span) * plotH;

  const linePts = rows.map((r) => `${xOf(r.omega)},${yOf(r.T)}`).join(' ');
  const zeroY = yOf(0);
  const limitY = yOf(IMP97627_PRIMORIAL_LIMIT);
  const lastHoldingX = xOf(IMP97627_LAST_HOLDING_OMEGA);
  const onsetX = xOf(IMP97627_ONSET_OMEGA);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* zero-margin reference line */}
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke="#475569" strokeDasharray="3 3" strokeWidth={1} />

      {/* primorial limit asymptote -e^{gamma}/12 + Rcorr ~ -0.0458 */}
      <line x1={padL} y1={limitY} x2={padL + plotW} y2={limitY} stroke="#a855f7" strokeDasharray="2 4" strokeWidth={1} />
      <text x={padL + 4} y={limitY - 4} fill="#a855f7" fontSize={9}>
        primorial limit {IMP97627_PRIMORIAL_LIMIT.toFixed(4)}
      </text>

      {/* last-holding omega=10 marker */}
      <line x1={lastHoldingX} y1={padT} x2={lastHoldingX} y2={padT + plotH} stroke="#34d399" strokeDasharray="4 3" strokeWidth={1} />
      <text x={lastHoldingX} y={padT - 4} textAnchor="middle" fill="#34d399" fontSize={9}>
        last holding omega={IMP97627_LAST_HOLDING_OMEGA}
      </text>

      {/* onset omega=11 marker */}
      <line x1={onsetX} y1={padT} x2={onsetX} y2={padT + plotH} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1} />
      <text x={onsetX} y={padT + 10} textAnchor="middle" fill="#f59e0b" fontSize={9}>
        onset omega={IMP97627_ONSET_OMEGA}
      </text>

      <polyline points={linePts} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {rows.map((r) => (
        <circle
          key={`pt-${r.omega}`}
          cx={xOf(r.omega)}
          cy={yOf(r.T)}
          r={r.isLastHolding || r.isOnset ? 4 : 3}
          fill={r.isLastHolding ? '#34d399' : r.isOnset ? '#f59e0b' : '#60a5fa'}
        />
      ))}

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill="#94a3b8" fontSize={9.5}>
        omega (prime-set size)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        T(p_omega#)
      </text>
    </svg>
  );
}

export default function Imp97627McmMarginCollapseLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route-M MCM Margin-Collapse Ladder: T(p_omega#) vs omega (imp-97627 / imp-97583 / imp-97601)" />

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
        page reshaping the frozen imp-97583 / imp-97601 ladder and gap-law literals verbatim (no
        re-derivation, no new computation). Changes no bound; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97627_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        The Route-M MCM primorial holding margin T(p_omega#) crosses zero between the last holding
        order omega = 10 (green) and the first failing order omega = 11 (amber), then drifts toward
        the -e&#123;gamma&#125;/12 + Rcorr primorial limit (purple dashed), which the imp-97601 gap
        law gap(omega) ~ 0.166635/log p_omega shows is approached only logarithmically and never
        reached at any finite omega:
      </p>
      <MarginLadderChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>omega</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>T(p_omega#)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>marker</th>
          </tr>
        </thead>
        <tbody>
          {IMP97627_LADDER_ROWS.map((r) => (
            <tr key={r.omega} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.omega}</td>
              <td style={{ textAlign: 'right' }}>{r.T.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>
                {r.isLastHolding ? 'last holding' : r.isOnset ? 'onset (first negative)' : ''}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97627_SUMMARY.verdict}
      </div>
    </div>
  );
}
