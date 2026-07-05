import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33761_SCATTER_SIGMA_0_5,
  IMP33761_SCATTER_SIGMA_0_1,
  IMP33761_FARTAIL_TREND_SIGMA_0_5,
  IMP33761_FARTAIL_TREND_SIGMA_0_1,
  IMP33761_PEAK_REFERENCE_LINE_AT_0_5_BASELINE,
  IMP33761_PEAK_REFERENCE_LINE_AT_0_1_BASELINE,
} from '../data/imp-33761-fartail-floor-sensitivity-scatter-viz-data.js';

const SVG_W = 720;
const PAD_L = 64;
const PAD_R = 24;
const PAD_T = 20;
const PAD_B = 40;
const SVG_H = 260;
const C_W = SVG_W - PAD_L - PAD_R;
const C_H = SVG_H - PAD_T - PAD_B;

function LogLogScatterChart({ scatter, fartailTrend, peakRefLine, xMin, xMax, yMin, yMax, yTicks }) {
  const xS = (x) => PAD_L + ((x - xMin) / (xMax - xMin)) * C_W;
  const yS = (y) => PAD_T + C_H - ((y - yMin) / (yMax - yMin)) * C_H;

  const fartailPoints = fartailTrend.map((p) => `${xS(p.log10_floorFactor)},${yS(p.log10_N)}`).join(' ');
  const peakPoints = peakRefLine.map((p) => `${xS(p.log10_floorFactor)},${yS(p.log10_N)}`).join(' ');

  return (
    <svg width={SVG_W} height={SVG_H} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + C_H} stroke="#334155" strokeWidth={1.5} />
      <line x1={PAD_L} y1={PAD_T + C_H} x2={PAD_L + C_W} y2={PAD_T + C_H} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={PAD_L - 4} y1={yS(t)} x2={PAD_L + C_W} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={PAD_L - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {'10^' + t.toFixed(1)}
          </text>
        </g>
      ))}

      {[-0.3, -0.1, 0, 0.1, 0.3, 0.5, 0.7].map((x) => (
        <g key={'xt' + x}>
          <line x1={xS(x)} y1={PAD_T + C_H - 4} x2={xS(x)} y2={PAD_T + C_H + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(x)} y={PAD_T + C_H + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {(10 ** x).toFixed(2)}
          </text>
        </g>
      ))}
      <text x={PAD_L + C_W / 2} y={SVG_H - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        E_trunc floor factor
      </text>
      <text
        x={16}
        y={PAD_T + C_H / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${PAD_T + C_H / 2})`}
      >
        N_landmark
      </text>

      <polyline points={peakPoints} fill="none" stroke="#f87171" strokeWidth={1.5} strokeDasharray="5,3" />
      <polyline points={fartailPoints} fill="none" stroke="#38bdf8" strokeWidth={1.75} />
      {scatter.map((r) => (
        <circle
          key={'pt' + r.floorFactor}
          cx={xS(r.log10_floorFactor)}
          cy={yS(r.log10_N)}
          r={r.floorFactor === 1.0 ? 3.5 : 2.75}
          fill={r.floorFactor === 1.0 ? '#4ade80' : '#7dd3fc'}
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp33931FartailFloorSensitivityScatterViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Floor-Sensitivity Scatter (imp-33761 / imp-33708)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33761 plots the imp-33708 far-tail floor-sensitivity sweep: for each E_trunc floor
        rescaling (0.5x&ndash;5x, green dot marks the baseline 1.0x that reproduces imp-33582), the
        N at which sigma(N) first drops below 0.5 and below 0.1. Both landmarks scale as roughly
        N&nbsp;~&nbsp;E_trunc<sup>-2.0</sup> (blue trend), STEEPER than the imp-33684 interior-peak
        reference slope of ~-1.375 (red dashed), because the tail balance drops the E_flow softening
        term the interior peak still carries.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sigma = 0.5 halving landmark (log-log), floor factor vs N
      </p>
      <LogLogScatterChart
        scatter={IMP33761_SCATTER_SIGMA_0_5}
        fartailTrend={IMP33761_FARTAIL_TREND_SIGMA_0_5}
        peakRefLine={IMP33761_PEAK_REFERENCE_LINE_AT_0_5_BASELINE}
        xMin={-0.35}
        xMax={0.75}
        yMin={7.9}
        yMax={10.3}
        yTicks={[8.0, 8.5, 9.0, 9.5, 10.0]}
      />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        sigma &lt; 0.1 crossing landmark (log-log), floor factor vs N
      </p>
      <LogLogScatterChart
        scatter={IMP33761_SCATTER_SIGMA_0_1}
        fartailTrend={IMP33761_FARTAIL_TREND_SIGMA_0_1}
        peakRefLine={IMP33761_PEAK_REFERENCE_LINE_AT_0_1_BASELINE}
        xMin={-0.35}
        xMax={0.75}
        yMin={9.9}
        yMax={12.3}
        yTicks={[10.0, 10.5, 11.0, 11.5, 12.0]}
      />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>floorFactor</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N (sigma=0.5)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N (sigma&lt;0.1)</th>
          </tr>
        </thead>
        <tbody>
          {IMP33761_SCATTER_SIGMA_0_5.map((r, i) => (
            <tr key={r.floorFactor} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.floorFactor}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N_landmark.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {IMP33761_SCATTER_SIGMA_0_1[i].N_landmark.toExponential(4)}
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
          fontSize: '0.85rem',
          color: '#cbd5e1',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Landmark comparison:</strong> the measured far-tail
        floor-scaling exponents (sigma=0.5: ~-2.099, sigma&lt;0.1: ~-2.079) are both steeper than the
        imp-33684 interior-peak reference exponent (~-1.375), visible directly as the blue trend
        lines falling below the red dashed reference on both panels above.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation only of the
        already-established imp-33708 floor-sensitivity measurement (isRigorous: false). The
        far-tail landmark N-values are ROBUST qualitatively (they always exist and stay ordered) but
        FRAGILE quantitatively (~2.1 decades of movement across the 10x floor sweep). Changes no
        bound; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; RH-EQUIVALENT; NO QED. Platt-Trudgian
        Lambda&nbsp;&le;&nbsp;0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
