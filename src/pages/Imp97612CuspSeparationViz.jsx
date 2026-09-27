import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97612_CUSP_ROWS,
  IMP97612_KAPPA_SMOOTH_UPPER,
  IMP97612_SUMMARY,
} from '../data/imp-97612-cusp-separation-viz-data.js';

// Dual-line chart on a log-x0 axis: |mean(r/x^2)| (shrinking) vs sd (growing), log-y scale.
function CuspSeparationChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const rows = IMP97612_CUSP_ROWS; // x0 descending: 0.2 -> 0.005
  const logX0 = rows.map((r) => Math.log10(r.x0));
  const xMin = Math.min(...logX0);
  const xMax = Math.max(...logX0);
  const xOf = (lx) => padL + ((lx - xMin) / (xMax - xMin)) * plotW;

  const allY = rows.flatMap((r) => [r.absMean, r.sd]);
  const logYVals = allY.map((v) => Math.log10(v));
  const yMin = Math.min(...logYVals);
  const yMax = Math.max(...logYVals);
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const meanPts = rows.map((r) => `${xOf(Math.log10(r.x0))},${yOf(r.absMean)}`).join(' ');
  const sdPts = rows.map((r) => `${xOf(Math.log10(r.x0))},${yOf(r.sd)}`).join(' ');
  const boundY = yOf(IMP97612_KAPPA_SMOOTH_UPPER);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* kappa_smooth upper bound reference line */}
      <line x1={padL} y1={boundY} x2={padL + plotW} y2={boundY} stroke="#64748b" strokeDasharray="4 3" strokeWidth={1} />
      <text x={padL + plotW} y={boundY - 4} textAnchor="end" fill="#64748b" fontSize={9}>
        kappa_smooth upper bound (1e-2)
      </text>

      {/* sd (growing wobble) */}
      <polyline points={sdPts} fill="none" stroke="#f59e0b" strokeWidth={2} />
      {rows.map((r) => (
        <circle key={`sd-${r.x0}`} cx={xOf(Math.log10(r.x0))} cy={yOf(r.sd)} r={3} fill="#f59e0b" />
      ))}

      {/* |mean| (shrinking average) */}
      <polyline points={meanPts} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {rows.map((r) => (
        <circle key={`mean-${r.x0}`} cx={xOf(Math.log10(r.x0))} cy={yOf(r.absMean)} r={3} fill="#60a5fa" />
      ))}

      {rows.map((r) => (
        <text
          key={`x0-${r.x0}`}
          x={xOf(Math.log10(r.x0))}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize={9.5}
        >
          {r.x0}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill="#94a3b8" fontSize={9.5}>
        x0
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        magnitude (log scale)
      </text>

      <g transform={`translate(${padL + 10}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={16} y2={0} stroke="#60a5fa" strokeWidth={2} />
        <text x={20} y={3} fill="#cbd5e1" fontSize={9.5}>|mean(r/x^2)| (Gauss-Kuzmin average)</text>
        <line x1={0} y1={14} x2={16} y2={14} stroke="#f59e0b" strokeWidth={2} />
        <text x={20} y={17} fill="#cbd5e1" fontSize={9.5}>sd (pointwise wobble)</text>
      </g>
    </svg>
  );
}

export default function Imp97612CuspSeparationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Two-Scale Cusp Separation: Average Shrinks, Wobble Grows (imp-97612 / imp-97576)" />

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
        page reshaping the frozen imp-97576 cusp ladder verbatim (no re-derivation, no new
        computation). kappa_smooth is NOT pinned to an exact value -- only its cusp-limit smallness is
        measured. Changes no bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97612_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        As x0 &rarr; 0 (right to left below), the Gauss-Kuzmin average shrinks while the pointwise
        wobble amplitude grows -- two genuinely distinct scales:
      </p>
      <CuspSeparationChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>x0</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>mean</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>sd</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>|mean|/sd</th>
          </tr>
        </thead>
        <tbody>
          {IMP97612_CUSP_ROWS.map((r) => (
            <tr key={r.x0} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.x0}</td>
              <td style={{ textAlign: 'right' }}>{r.mean.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>{r.sd.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>{r.ratio.toFixed(3)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97612_SUMMARY.verdict}
      </div>
    </div>
  );
}
