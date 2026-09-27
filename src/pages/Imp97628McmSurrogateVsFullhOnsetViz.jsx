import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97628_ROWS,
  IMP97628_SURROGATE_ONSET_OMEGA,
  IMP97628_FULL_ONSET_OMEGA,
  IMP97628_RCORR_SATURATION,
  IMP97628_SUMMARY,
} from '../data/imp-97628-mcm-surrogate-vs-fullh-onset-viz-data.js';

// Two-line chart: the smooth surrogate iterDiff(H,p_omega#,1) (dashed) and the full-h value
// T(p_omega#) = surrogate + Rcorr (solid), vs omega. The gap between the two lines is the near-flat
// R-correction (~1.0186e-3), which buys the full-h curve exactly one extra order (omega=10) before
// it too goes negative at omega=11.
function SurrogateVsFullChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const rows = IMP97628_ROWS; // omega ascending: 7 -> 11
  const xMin = Math.min(...rows.map((r) => r.omega));
  const xMax = Math.max(...rows.map((r) => r.omega));
  const xOf = (omega) => padL + ((omega - xMin) / (xMax - xMin)) * plotW;

  const yMax = Math.max(...rows.map((r) => Math.max(r.T, r.surrogate)));
  const yMin = Math.min(...rows.map((r) => Math.min(r.T, r.surrogate)));
  const span = yMax - yMin;
  const yOf = (v) => padT + plotH - ((v - yMin) / span) * plotH;

  const fullLinePts = rows.map((r) => `${xOf(r.omega)},${yOf(r.T)}`).join(' ');
  const surrLinePts = rows.map((r) => `${xOf(r.omega)},${yOf(r.surrogate)}`).join(' ');
  const zeroY = yOf(0);
  const surrOnsetX = xOf(IMP97628_SURROGATE_ONSET_OMEGA);
  const fullOnsetX = xOf(IMP97628_FULL_ONSET_OMEGA);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* zero-margin reference line */}
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke="#475569" strokeDasharray="3 3" strokeWidth={1} />

      {/* surrogate onset omega=10 marker */}
      <line x1={surrOnsetX} y1={padT} x2={surrOnsetX} y2={padT + plotH} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1} />
      <text x={surrOnsetX} y={padT - 4} textAnchor="middle" fill="#f59e0b" fontSize={9}>
        surrogate onset omega={IMP97628_SURROGATE_ONSET_OMEGA}
      </text>

      {/* full-h onset omega=11 marker */}
      <line x1={fullOnsetX} y1={padT} x2={fullOnsetX} y2={padT + plotH} stroke="#f87171" strokeDasharray="4 3" strokeWidth={1} />
      <text x={fullOnsetX} y={padT + 10} textAnchor="middle" fill="#f87171" fontSize={9}>
        full-h onset omega={IMP97628_FULL_ONSET_OMEGA}
      </text>

      <polyline points={surrLinePts} fill="none" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 3" />
      <polyline points={fullLinePts} fill="none" stroke="#60a5fa" strokeWidth={2} />

      {rows.map((r) => (
        <circle
          key={`surr-${r.omega}`}
          cx={xOf(r.omega)}
          cy={yOf(r.surrogate)}
          r={r.isSurrogateOnset ? 4 : 3}
          fill="#a855f7"
        />
      ))}
      {rows.map((r) => (
        <circle
          key={`full-${r.omega}`}
          cx={xOf(r.omega)}
          cy={yOf(r.T)}
          r={r.isFullOnset ? 4 : 3}
          fill="#60a5fa"
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
        value at x=1
      </text>
    </svg>
  );
}

export default function Imp97628McmSurrogateVsFullhOnsetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route-M MCM Surrogate vs Full-h Onset: iterDiff(H,p_omega#,1) vs T(p_omega#) (imp-97628 / imp-97583)" />

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
        page reshaping the frozen imp-97583 ladder literals verbatim (no re-derivation, no new
        computation). Changes no bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97628_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        The smooth surrogate (purple, dashed) crosses zero one order before the full-h value T(p_omega#)
        (blue, solid) does. The near-flat gap between the two curves is the saturated R-correction
        (~{IMP97628_RCORR_SATURATION.toExponential(4)}), which lifts the full-h curve positive through
        the surrogate onset (amber) but is no longer enough at the full-h onset (red):
      </p>
      <SurrogateVsFullChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>omega</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>surrogate</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>Rcorr</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>T(p_omega#)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>marker</th>
          </tr>
        </thead>
        <tbody>
          {IMP97628_ROWS.map((r) => (
            <tr key={r.omega} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.omega}</td>
              <td style={{ textAlign: 'right' }}>{r.surrogate.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>{r.rcorr.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.T.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>
                {r.isSurrogateOnset ? 'surrogate onset' : r.isFullOnset ? 'full-h onset' : ''}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97628_SUMMARY.verdict}
      </div>
    </div>
  );
}
