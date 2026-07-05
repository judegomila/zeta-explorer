import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33762_EXPONENT_LADDER,
  IMP33762_VELOCITY_D1,
  IMP33762_ACCELERATION_D2,
  IMP33762_KNEE_MARKER,
  IMP33762_STEEPEST_VELOCITY_MARKER,
} from '../data/imp-33762-subdecade-exponent-ramp-curvature-viz-data.js';

const SVG_W = 720;
const PAD_L = 64;
const PAD_R = 24;
const PAD_T = 20;
const PAD_B = 40;
const SVG_H = 220;
const C_W = SVG_W - PAD_L - PAD_R;
const C_H = SVG_H - PAD_T - PAD_B;
const X_MIN = 9.0;
const X_MAX = 11.0;
const X_TICKS = [9.0, 9.25, 9.5, 9.75, 10.0, 10.25, 10.5, 10.75, 11.0];

function bracketCenter(bracket) {
  const m = /^1e([\d.]+)->1e([\d.]+)$/.exec(bracket);
  return (Number(m[1]) + Number(m[2])) / 2;
}

function CurveChart({ points, yMin, yMax, yTicks, yLabel, color, dotColor, knee, steepest, zeroLine, yFmt }) {
  const xS = (x) => PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * C_W;
  const yS = (y) => PAD_T + C_H - ((y - yMin) / (yMax - yMin)) * C_H;
  const path = points.map((p) => `${xS(p.x)},${yS(p.y)}`).join(' ');

  return (
    <svg width={SVG_W} height={SVG_H} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + C_H} stroke="#334155" strokeWidth={1.5} />
      <line x1={PAD_L} y1={PAD_T + C_H} x2={PAD_L + C_W} y2={PAD_T + C_H} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={PAD_L - 4} y1={yS(t)} x2={PAD_L + C_W} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={PAD_L - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {yFmt(t)}
          </text>
        </g>
      ))}

      {X_TICKS.map((t) => (
        <g key={'xt' + t}>
          <line x1={xS(t)} y1={PAD_T + C_H - 4} x2={xS(t)} y2={PAD_T + C_H + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(t)} y={PAD_T + C_H + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={PAD_L + C_W / 2} y={SVG_H - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log10 N
      </text>
      <text
        x={16}
        y={PAD_T + C_H / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${PAD_T + C_H / 2})`}
      >
        {yLabel}
      </text>

      {zeroLine && yMin < 0 && yMax > 0 && (
        <line x1={PAD_L} y1={yS(0)} x2={PAD_L + C_W} y2={yS(0)} stroke="#475569" strokeWidth={1} strokeDasharray="2,3" />
      )}

      {steepest !== undefined && (
        <line
          x1={xS(steepest)}
          y1={PAD_T}
          x2={xS(steepest)}
          y2={PAD_T + C_H}
          stroke="#facc15"
          strokeWidth={1.25}
          strokeDasharray="4,3"
        />
      )}

      {knee !== undefined && (
        <line
          x1={xS(knee)}
          y1={PAD_T}
          x2={xS(knee)}
          y2={PAD_T + C_H}
          stroke="#f87171"
          strokeWidth={1.25}
          strokeDasharray="5,3"
        />
      )}

      <polyline points={path} fill="none" stroke={color} strokeWidth={1.75} />
      {points.map((p) => (
        <circle key={'pt' + p.x} cx={xS(p.x)} cy={yS(p.y)} r={2.75} fill={dotColor} stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
    </svg>
  );
}

export default function Imp33932SubdecadeExponentRampCurvatureViz() {
  const ladderPoints = IMP33762_EXPONENT_LADDER.map((r) => ({ x: bracketCenter(r.bracket), y: r.p_local }));
  const d1Points = IMP33762_VELOCITY_D1.map((r) => ({ x: r.centerLog10, y: r.d1 }));
  const d2Points = IMP33762_ACCELERATION_D2.map((r) => ({ x: r.centerLog10, y: r.d2 }));
  const kneeX = IMP33762_KNEE_MARKER.log10Nstar;
  const steepestX = Math.log10(IMP33762_STEEPEST_VELOCITY_MARKER.Nnear);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sub-Decade Exponent-Ramp Curvature (imp-33762 / imp-33721)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33762 plots the imp-33721 quarter-decade refinement of the sigma(N) local-exponent
        ramp over [1e9,1e11]: the p_dec ladder itself, its D1 velocity (yellow dashed marks the
        steepest point near log10&nbsp;N&nbsp;&asymp;&nbsp;{steepestX.toFixed(2)}), and its D2
        acceleration, which crosses zero exactly once (red dashed knee at log10&nbsp;N*&nbsp;&asymp;&nbsp;
        {kneeX.toFixed(4)}, N*&nbsp;&asymp;&nbsp;{IMP33762_KNEE_MARKER.Nstar.toExponential(4)}) &mdash; a full
        decade below the coarse whole-decade [1e10,1e11] bracket imp-33701 originally reported.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p_dec ladder (local exponent per quarter-decade sub-bracket)
      </p>
      <CurveChart
        points={ladderPoints}
        yMin={0.15}
        yMax={0.42}
        yTicks={[0.2, 0.25, 0.3, 0.35, 0.4]}
        yLabel="p_dec"
        color="#38bdf8"
        dotColor="#7dd3fc"
        knee={kneeX}
        yFmt={(t) => t.toFixed(2)}
      />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        D1 velocity (first difference of p_dec)
      </p>
      <CurveChart
        points={d1Points}
        yMin={0.018}
        yMax={0.036}
        yTicks={[0.02, 0.025, 0.03, 0.035]}
        yLabel="D1"
        color="#a78bfa"
        dotColor="#c4b5fd"
        knee={kneeX}
        steepest={steepestX}
        yFmt={(t) => t.toFixed(3)}
      />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        D2 acceleration (second difference of p_dec) &mdash; single sign change at the knee
      </p>
      <CurveChart
        points={d2Points}
        yMin={-0.0038}
        yMax={0.001}
        yTicks={[-0.003, -0.002, -0.001, 0, 0.001]}
        yLabel="D2"
        color="#4ade80"
        dotColor="#86efac"
        knee={kneeX}
        zeroLine
        yFmt={(t) => t.toFixed(3)}
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
            <th style={{ padding: '0.4rem 0.6rem' }}>bracket</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>p_local</th>
          </tr>
        </thead>
        <tbody>
          {IMP33762_EXPONENT_LADDER.map((r) => (
            <tr key={r.bracket} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.bracket}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.p_local.toFixed(6)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Landmark comparison:</strong> the D1 velocity peak
        (yellow dashed) sits just below the D2 knee (red dashed), consistent with a single smooth
        acceleration sign change rather than a coincidence of two separate features.
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
        already-established imp-33721 sub-decade curvature measurement (isRigorous: false).
        Conditional-share curvature diagnostic, not an RH bound. imp-3066 K_a&nbsp;&ge;&nbsp;0
        untouched; RH-EQUIVALENT; NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains the
        rigorous SOTA.
      </div>
    </div>
  );
}
