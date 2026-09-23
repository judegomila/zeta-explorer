import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95790_CURVE_POINTS,
  IMP95790_LANDMARKS,
  IMP95790_CAVEAT_BANNER,
} from '../data/imp-95790-rcap-deadzone-viz-data.js';

const LANDMARK_COLOR = {
  ceiling: '#38bdf8',
  crossover: '#f59e0b',
  window_bottom: '#a78bfa',
};

// r_cap(T) vs log10 T: the seven measured envelope points, the three named
// dead-zone landmarks, the GUE asymptote r=1, and the (1 - r_cap) margin
// shaded between the curve and that asymptote.
function RCapChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = IMP95790_CURVE_POINTS[0].log10T;
  const xMax = IMP95790_CURVE_POINTS[IMP95790_CURVE_POINTS.length - 1].log10T;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = 1.05;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const curvePath = IMP95790_CURVE_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T)} ${yOf(p.rCap)}`,
  ).join(' ');

  // margin-below-1 band: along the curve, then back along r=1.
  const bandPath =
    curvePath +
    ` L ${xOf(xMax)} ${yOf(1)} L ${xOf(xMin)} ${yOf(1)} Z`;

  const gueY = yOf(1);
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* (1 - r_cap) margin-below-one band */}
      <path d={bandPath} fill="rgba(96,165,250,0.10)" />

      {/* GUE / margin-top asymptote r_cap = 1 */}
      <line x1={padL} y1={gueY} x2={padL + plotW} y2={gueY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
      <text x={padL + plotW - 4} y={gueY - 5} textAnchor="end" fill="#94a3b8" fontSize={9}>
        conservatism ceiling r_cap=1
      </text>

      {IMP95790_LANDMARKS.map((m) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        return (
          <g key={m.name}>
            <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x} cy={yOf(m.rCap)} r={4} fill={color} />
          </g>
        );
      })}

      <path d={curvePath} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {IMP95790_CURVE_POINTS.map((p) => (
        <circle key={p.T} cx={xOf(p.log10T)} cy={yOf(p.rCap)} r={2.5} fill="#60a5fa" />
      ))}

      {IMP95790_LANDMARKS.map((m, i) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        const anchor = i === 0 ? 'start' : i === IMP95790_LANDMARKS.length - 1 ? 'end' : 'middle';
        return (
          <text key={`lbl-${m.name}`} x={x} y={padT + 12 + i * 11} textAnchor={anchor} fill={color} fontSize={9}>
            {`${m.label}: r_cap=${m.rCap.toFixed(4)}`}
          </text>
        );
      })}

      {IMP95790_CURVE_POINTS.map((p) => (
        <text key={`tx${p.T}`} x={xOf(p.log10T)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {p.log10T.toFixed(1)}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {t.toFixed(1)}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        log10 T
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        r_cap(T)
      </text>
    </svg>
  );
}

export default function Imp95790RCapDeadZoneViz() {
  const ceiling = IMP95790_LANDMARKS[0];
  const crossover = IMP95790_LANDMARKS[1];
  const windowBottom = IMP95790_LANDMARKS[2];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Number-Variance Cap r_cap(T) Dead-Zone Descent (imp-95766 / imp-95790)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP95790_CAVEAT_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95766 measured the imp-95722 derived envelope r_cap(T) across the ~3.28-decade
        dead zone that the imp-95750 direct sd(C&minus;E) measurement cannot reach: it falls
        monotonically from {ceiling.rCap.toFixed(4)} at the direct-measurement ceiling
        gamma_1e6&nbsp;=&nbsp;{ceiling.T.toExponential(3)}, through {crossover.rCap.toFixed(4)} at
        the imp-95729 crossover T0&nbsp;&asymp;&nbsp;{crossover.T.toExponential(2)}, down to{' '}
        {windowBottom.rCap.toFixed(4)} at the imp-95519 window bottom
        T&nbsp;=&nbsp;{windowBottom.T.toExponential(1)}. The shaded band is the margin
        (1&nbsp;&minus;&nbsp;r_cap) between the envelope and the conservatism ceiling r_cap&nbsp;=&nbsp;1:
        it only WIDENS with height across the dead zone.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        r_cap(T) vs height (log scale), margin-below-one shaded
      </h3>
      <RCapChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>log10 T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r_cap(T)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>margin (1&minus;r_cap)</th>
          </tr>
        </thead>
        <tbody>
          {IMP95790_CURVE_POINTS.map((p) => (
            <tr key={p.T} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{p.T.toExponential(3)}</td>
              <td style={{ textAlign: 'right' }}>{p.log10T.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: '#60a5fa' }}>{p.rCap.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{p.marginBelowOne.toFixed(4)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-95766 dead-zone measurement (no re-derivation). Supplies no new bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
